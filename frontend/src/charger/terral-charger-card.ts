// Terral · EV charger card (1/1, 2/1, 2/2, 4/2).
// The icon locks / unlocks; anywhere else opens the window (recent charges,
// settings behind the gear); long press moves the card. Colours per state
// come from charger-look.ts. Only the 4/2 power chart has moving stripes.
import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { t } from "../i18n";
import { batteryIcon, clockIcon, evChargerIcon, lockIcon, unlockIcon } from "../shared/icons";
import { type ChargerView, chargerView, statusText } from "./charger-look";
import {
  type ChargerConfig,
  energyKwh,
  fmtDuration,
  fmtNum,
  perDay,
  powerHistory,
  powerKw,
  sessionsFrom,
  setLocked,
} from "./charger-model";
import { openChargerDialog, updateChargerDialog } from "./terral-charger-dialog";
import { openCardSettings } from "../panel/terral-card-config";

export type TerralChargerCardConfig = LovelaceCardConfig & ChargerConfig;
type Size = "s11" | "s21" | "s22" | "s42";

export const CHARGER_CARD_TAG = "terral-home-charger";

@customElement(CHARGER_CARD_TAG)
export class TerralChargerCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralChargerCardConfig;
  @state() private _size: Size = "s22";
  /** Last hour of power, kW (4/2 chart). */
  @state() private _spark: [number, number][] = [];
  @state() private _week?: number;
  @state() private _sessionStart?: number;

  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;
  private _histTimer?: number;
  private _histFor?: string;

  setConfig(config: TerralChargerCardConfig): void {
    if (!config?.entity || !/^(switch|lock|input_boolean)\./.test(String(config.entity))) {
      throw new Error("Terral · Cargador: 'entity' must be a switch, lock or input_boolean");
    }
    this._config = config;
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.h === 4 ? "s42" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s42" ? 4 : 2;
  }

  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes(): { w: number; h: number }[] {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 },
    ];
  }

  static getStubConfig(hass: HomeAssistant) {
    const id = Object.keys(hass?.states ?? {}).find((i) => /^(switch|lock)\./.test(i) && /charg|cargad|wallbox|evse/i.test(i));
    return { entity: id ?? "switch.charger" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: ["switch", "lock", "input_boolean"] } } },
        { name: "invert", selector: { boolean: {} } },
        { name: "name", selector: { text: {} } },
        { name: "status_entity", selector: { entity: { domain: ["sensor", "binary_sensor"] } } },
        { name: "power_entity", selector: { entity: { domain: "sensor" } } },
        { name: "energy_entity", selector: { entity: { domain: "sensor" } } },
        { name: "max_power", selector: { number: { min: 1, max: 50, step: 0.1, unit_of_measurement: "kW" } } },
      ],
      computeLabel: (s: { name: string }) =>
        t(undefined, ({ entity: "charger_entity", invert: "ch_invert", name: "name", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy", max_power: "ch_max" } as const)[s.name as "entity"] ?? "name"),
    };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._histTimer);
    this._histTimer = undefined;
    this._histFor = undefined;
    this._cancelHold();
  }

  /** Opens the window straight on its settings page (used right after adding the card). */
  openSettings() {
    this._openWindow("settings");
  }

  private get _name() {
    return this._config?.name || t(this.hass, "charger");
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1 || !this._config) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this.hass) return true;
    const ids = chargerView(this.hass, this._config).ids;
    return [this._config.entity, ids.status, ids.power, ids.energy].some((id) => id && old.states[id] !== this.hass!.states[id]);
  }

  protected updated(changed: PropertyValues): void {
    if (!this.hass || !this._config) return;
    if (changed.has("hass")) updateChargerDialog(this.hass);
    const v = chargerView(this.hass, this._config);
    // Big card: keep a last-hour chart and this week's total.
    if (this._size === "s42" && v.ids.power) {
      if (this._histFor !== v.ids.power) {
        this._histFor = v.ids.power;
        this._loadHistory(v.ids.power);
        clearInterval(this._histTimer);
        this._histTimer = window.setInterval(() => this._loadHistory(v.ids.power!), 30 * 60_000);
      }
      const kw = powerKw(this.hass, v.ids.power);
      const last = this._spark[this._spark.length - 1];
      if (kw != null && (!last || last[1] !== kw)) {
        const now = Date.now();
        this._spark = [...this._spark.filter(([ts]) => now - ts < 3_600_000), [now, kw]];
        if (v.look === "charging" && !this._sessionStart) this._sessionStart = now;
        if (v.look !== "charging") this._sessionStart = undefined;
      }
    }
  }

  private async _loadHistory(powerId: string) {
    if (!this.hass) return;
    try {
      const now = Date.now();
      const pts = await powerHistory(this.hass, powerId, new Date(now - 7 * 86_400_000));
      const sessions = sessionsFrom(pts, now);
      this._week = perDay(sessions, 7).reduce((a, d) => a + d.kwh, 0);
      const live = sessions.find((s) => s.live);
      this._sessionStart = live?.start;
      this._spark = pts.filter(([ts]) => now - ts < 3_600_000);
    } catch {
      this._week = undefined;
    }
  }

  // ---- Interaction ------------------------------------------------------------

  private _toggle = (ev: Event) => {
    ev.stopPropagation();
    if (!this.hass || !this._config) return;
    const e = this.hass.states[this._config.entity];
    if (!e) return;
    const v = chargerView(this.hass, this._config);
    if (v.look === "unavailable") return;
    setLocked(this.hass, e, !v.locked, !!this._config.invert);
  };

  private _openWindow(view: "main" | "settings" = "main") {
    if (!this.hass || !this._config) return;
    const settings = () => this.hass && this._config && openCardSettings(this, this.hass, "charger", this._config);
    if (view === "settings") return settings();
    openChargerDialog(this.hass, this._config, this._name, settings);
  }

  private _down = (ev: PointerEvent) => {
    this._held = false;
    this._holdStart = { x: ev.clientX, y: ev.clientY };
    clearTimeout(this._holdTimer);
    const start = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId };
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      const hold = new CustomEvent("terral-card-hold", { detail: start, bubbles: true, composed: true, cancelable: true });
      if (this.dispatchEvent(hold)) this._openWindow();
    }, 500);
  };

  private _move = (ev: PointerEvent) => {
    if (!this._holdStart) return;
    if (Math.hypot(ev.clientX - this._holdStart.x, ev.clientY - this._holdStart.y) > 10) this._cancelHold();
  };

  private _cancelHold = () => {
    clearTimeout(this._holdTimer);
    this._holdStart = undefined;
  };

  private _cardClick = (ev: Event) => {
    if (this._held) {
      ev.stopPropagation();
      ev.preventDefault();
      this._held = false;
      return;
    }
    const root = ev.currentTarget;
    for (const node of ev.composedPath()) {
      if (node === root) break;
      if (node instanceof HTMLElement && node.tagName === "BUTTON") return;
    }
    this._openWindow();
  };

  // ---- Render ---------------------------------------------------------------

  private _icon(v: ChargerView, size: number) {
    return html`<button class="icon" aria-label=${v.locked ? t(this.hass, "unlock") : t(this.hass, "lock")} ?disabled=${v.look === "unavailable"} @click=${this._toggle}>
      ${evChargerIcon(size)}
      ${v.locked ? html`<span class="lk">${lockIcon(14)}</span>` : nothing}
    </button>`;
  }

  private _lockBtn(v: ChargerView) {
    if (v.look === "unavailable") return nothing;
    return html`<button class="pb ${v.locked && v.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${v.locked ? unlockIcon(19) : lockIcon(19)}<span>${v.locked ? t(this.hass, "unlock") : t(this.hass, "lock")}</span>
    </button>`;
  }

  private _sparkline() {
    const pts = this._spark;
    if (pts.length < 2) return nothing;
    const w = 300;
    const h = 58;
    const now = Date.now();
    const max = Math.max(this._config?.max_power ?? 0, ...pts.map((p) => p[1]), 1);
    const xy = pts.map(([ts, v]) => [Math.max(0, w - ((now - ts) / 3_600_000) * w), h - 4 - (v / max) * (h - 10)]);
    xy.push([w, xy[xy.length - 1][1]]);
    const d = xy.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const last = xy[xy.length - 1];
    return svg`<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${d} L${w} ${h} L${xy[0][0]} ${h}Z"></path><path class="l" d=${d}></path><circle cx=${last[0]} cy=${last[1]} r="4"></circle></svg>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const h = this.hass;
    const e = h.states[this._config.entity];
    if (!e) {
      return html`<div class="card off missing"><span>${t(h, "not_found")}</span><small>${this._config.entity}</small></div>`;
    }
    const v = chargerView(h, this._config);
    const size = this._size;
    const kwh = energyKwh(h, v.ids.energy);
    const kwText = v.kw != null ? `${fmtNum(h, v.kw)} kW` : "";
    const kwhText = kwh != null ? `${fmtNum(h, kwh)} kWh` : "";
    const charging = v.look === "charging";
    const name = this._name;

    let body;
    if (size === "s11") {
      body = html`${this._icon(v, 22)}<div class="text"><span class="name">${name}</span><span class="state">${statusText(h, v, true)}</span></div>`;
    } else if (size === "s21") {
      const st = charging && kwhText ? [kwText, kwhText].filter(Boolean).join(" · ") : statusText(h, v, true);
      body = html`${this._icon(v, 32)}<div class="text"><span class="name">${name}</span><span class="state">${st}</span></div>`;
    } else {
      const head = html`<div class="head">${this._icon(v, 32)}<div class="text"><span class="name">${name}</span><span class="state">${statusText(h, v, false)}</span></div></div>`;
      if (size === "s22") {
        body = html`${head}<div class="row">
          ${charging && (kwText || kwhText)
            ? html`${kwText ? html`<div class="pb static"><span>${kwText}</span></div>` : nothing}
                ${kwhText ? html`<div class="pb static">${batteryIcon()}<span>${kwhText}</span></div>` : nothing}`
            : this._lockBtn(v)}
        </div>`;
      } else {
        const started = this._sessionStart ?? (v.ids.status ? new Date(h.states[v.ids.status]?.last_changed ?? Date.now()).getTime() : undefined);
        body = html`${head}
          ${charging
            ? html`<div class="chart flow">
                  <div class="chead"><span class="big">${v.kw != null ? fmtNum(h, v.kw) : "–"}<small>kW</small></span><span class="state">${t(h, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${kwhText ? html`<div class="pb static">${batteryIcon()}<span>${kwhText}</span></div>` : nothing}
                  ${started ? html`<div class="pb static">${clockIcon()}<span>${fmtDuration(Date.now() - started)}</span></div>` : nothing}
                </div>`
            : html`<div class="stats">
                ${kwhText ? html`<div class="stat"><b>${kwhText}</b><span>${t(h, "last_session")}</span></div>` : nothing}
                ${this._week != null ? html`<div class="stat"><b>${fmtNum(h, this._week)} kWh</b><span>${t(h, "this_week")}</span></div>` : nothing}
              </div>`}
          <div class="spacer"></div>
          <div class="row">${this._lockBtn(v)}</div>`;
      }
    }

    return html`<div
      class="card ${size} ${v.tinted ? "on" : "off"} look-${v.look}"
      style=${v.style}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${name}, ${statusText(h, v, false)}`}
      @click=${this._cardClick}
      @keydown=${(ev: KeyboardEvent) => {
        if ((ev.key === "Enter" || ev.key === " ") && ev.target === ev.currentTarget) {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >${body}</div>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    button {
      font: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
    }
    svg {
      display: block;
    }
    .card {
      box-sizing: border-box;
      height: 100%;
      border-radius: var(--ha-card-border-radius, 22px);
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      overflow: hidden;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      cursor: pointer;
      outline: none;
      transition: background 0.25s, color 0.25s;
      --fg: #fff;
      --fg2: rgba(255, 255, 255, 0.75);
      color: var(--fg);
    }
    .off {
      background: var(--ha-card-background, rgba(255, 255, 255, 0.13));
      -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
      backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }
    .on {
      background: var(--bg);
      border: 1px solid rgba(255, 255, 255, 0.7);
    }
    .look-unavailable {
      opacity: 0.55;
    }
    .missing {
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 13px;
    }
    .icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      flex: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    .on .icon {
      background: var(--accent);
    }
    .lk {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: var(--lk, #3a3d4a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.25);
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s22 .name,
    .s42 .name {
      font-size: 17px;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* 1/1: icon left, text right */
    .s11 {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0 12px;
      gap: 10px;
      border-radius: 20px;
    }
    .s11 .icon {
      width: 40px;
      height: 40px;
    }
    .s11 .lk {
      width: 19px;
      height: 19px;
      right: -5px;
      bottom: -5px;
    }
    .s11 .lk svg {
      width: 11px;
      height: 11px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .s42 {
      justify-content: flex-start;
      padding: 16px;
    }
    .spacer {
      flex: 1;
    }
    .row {
      display: flex;
      gap: 8px;
      flex: none;
    }
    .pb {
      flex: 1;
      min-width: 0;
      height: 48px;
      border-radius: 24px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      transition: transform 0.1s;
    }
    button.pb:active {
      transform: scale(0.97);
    }
    .pb.static {
      cursor: inherit;
    }
    .pb svg {
      flex: none;
    }
    .pb span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pb.primary {
      background: var(--fg);
      color: var(--bg-solid, #fff);
    }
    .chart {
      border-radius: 16px;
      padding: 10px 12px;
      background: color-mix(in srgb, var(--fg) 7%, transparent);
    }
    .chead {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .big {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .big small {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0;
      margin-left: 3px;
      color: var(--fg2);
    }
    .spark {
      width: 100%;
      height: 58px;
      margin-top: 4px;
    }
    .spark .l {
      fill: none;
      stroke: #1f9d5e;
      stroke-width: 2.5;
      stroke-linejoin: round;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    .spark .a {
      fill: rgba(52, 199, 123, 0.22);
    }
    .spark circle {
      fill: #1f9d5e;
    }
    /* Moving stripes: only inside the 4/2 chart while charging. */
    .flow {
      position: relative;
      overflow: hidden;
    }
    .flow::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: repeating-linear-gradient(110deg, transparent 0 18px, rgba(30, 160, 95, 0.12) 18px 27px);
      animation: flow 1.2s linear infinite;
    }
    .flow > * {
      position: relative;
      z-index: 1;
    }
    @keyframes flow {
      from { background-position: 0 0; }
      to { background-position: -62px 0; }
    }
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .stat {
      border-radius: 16px;
      background: color-mix(in srgb, var(--fg) 9%, transparent);
      padding: 9px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stat b {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .stat span {
      font-size: 11.5px;
      color: var(--fg2);
      font-weight: 600;
    }
    @media (prefers-reduced-motion: reduce) {
      .flow::after { animation: none; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-charger": TerralChargerCard;
  }
}
