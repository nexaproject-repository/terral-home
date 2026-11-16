// Terral · Interruptor — card for anything on a switch: water heater, mosquito
// zapper, plug… (1/1, 2/1, 2/2).
//   The icon (chosen in the settings, or guessed from the name) switches it on
//   and off; a tap anywhere else opens the window (log, consumption…).
//   On: the chosen colour, strong in the icon and soft in the background.
//   2/2 shows one of three views, chosen in the settings:
//     a · Data: since · now (kW) · today
//     b · Consumption: big number and per-hour bars of today
//     c · Timeline of the day: the on periods of today from 0 to 24 h (default)
// A long press moves the card in the Terral panel.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { t } from "../i18n";
import { openCardSettings } from "../panel/terral-card-config";
import { guessIcon, switchIcon, switchTint, tintStyle } from "./switch-look";
import {
  type SwitchConfig,
  type Usage,
  fmtKw,
  fmtKwh,
  fmtSpan,
  fmtTime,
  isOn,
  isSwitchEntity,
  isUnavailable,
  meterOf,
  powerNow,
  todayUsage,
  toggle,
} from "./switch-model";
import { openSwitchDialog, updateSwitchDialog } from "./terral-switch-dialog";

export type TerralSwitchCardConfig = LovelaceCardConfig & SwitchConfig;
type Size = "s11" | "s21" | "s22";

export const SWITCH_CARD_TAG = "terral-home-switch";

@customElement(SWITCH_CARD_TAG)
export class TerralSwitchCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralSwitchCardConfig;
  @state() private _size: Size = "s22";
  @state() private _usage?: Usage;

  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;
  private _tick?: number;
  private _loadKey = "";

  setConfig(config: TerralSwitchCardConfig): void {
    if (!config?.entity || !isSwitchEntity(String(config.entity))) {
      throw new Error("Terral · Interruptor: 'entity' must be a switch, input_boolean, light or fan");
    }
    this._config = config;
    this._loadKey = "";
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s11" ? 1 : 2;
  }

  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
    ];
  }

  static getStubConfig(hass: HomeAssistant) {
    return { entity: Object.keys(hass?.states ?? {}).find((id) => id.startsWith("switch.")) ?? "switch.example" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } } },
        { name: "name", selector: { text: {} } },
        { name: "style", selector: { select: { mode: "dropdown", options: ["a", "b", "c"] } } },
      ],
    };
  }

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  private get _name() {
    return this._config?.name || this.hass?.formatEntityName?.(this._entity!) || (this._entity?.attributes.friendly_name as string) || this._config?.entity || "";
  }

  private get _icon() {
    return this._config?.icon || guessIcon(`${this._name} ${this._config?.entity ?? ""}`);
  }

  // ---- Lifecycle ---------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // Keep the "now" marker, the totals and the bars fresh.
    this._tick = window.setInterval(() => {
      this._loadKey = "";
      this._load();
    }, 5 * 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._tick);
    this._cancelHold();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this._config || !this.hass) return true;
    const m = meterOf(this.hass, this._config);
    return [this._config.entity, m.power, m.energy].some((id) => id && old.states[id] !== this.hass!.states[id]);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) updateSwitchDialog(this.hass);
    this._load();
  }

  /** Today's history: only the 2/2 (and the 2/1 state line) need it. */
  private _load() {
    const h = this.hass;
    const c = this._config;
    const e = this._entity;
    if (!h || !c || !e || this._size === "s11") return;
    const key = `${e.last_changed}|${this._size}|${c.power_entity}|${c.energy_entity}`;
    if (key === this._loadKey) return;
    this._loadKey = key;
    todayUsage(h, c).then((u) => (this._usage = u)).catch(() => undefined);
  }

  // ---- Actions -------------------------------------------------------------------

  private _openWindow() {
    if (!this.hass || !this._config) return;
    openSwitchDialog(this.hass, this._config, this._name, () => this.hass && this._config && openCardSettings(this, this.hass, "switch", this._config));
  }

  private _toggle = (ev: Event) => {
    ev.stopPropagation();
    const e = this._entity;
    if (e && this.hass && !isUnavailable(e)) toggle(this.hass, e);
  };

  private _down = (ev: PointerEvent) => {
    this._held = false;
    this._holdStart = { x: ev.clientX, y: ev.clientY };
    clearTimeout(this._holdTimer);
    const startAt = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId };
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      const hold = new CustomEvent("terral-card-hold", { detail: startAt, bubbles: true, composed: true, cancelable: true });
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

  // ---- Texts -----------------------------------------------------------------------

  private _status(e: HassEntity, on: boolean): string {
    const h = this.hass!;
    if (isUnavailable(e)) return t(h, "unavailable");
    const style = this._config!.style ?? "c";
    const kw = on ? powerNow(h, meterOf(h, this._config!).power) : null;
    const u = this._usage;
    const todayTxt = u ? (u.kwhToday != null ? fmtKwh(h, u.kwhToday) : fmtSpan(u.onToday)) : "";
    const word = t(h, on ? "sw_on" : "sw_off");
    if (this._size === "s11") return word;
    if (this._size === "s21") return kw != null && kw > 0.001 ? fmtKw(h, kw) : word;
    if (style === "a") return kw != null && on ? `${word} · ${fmtKw(h, kw)}` : word;
    if (style === "b") {
      if (!on) return todayTxt ? `${word} · ${t(h, "sw_today_l")} ${todayTxt}` : word;
      const since = `${t(h, "sw_since")} ${fmtTime(h, e.last_changed)}`;
      return u?.kwhToday != null ? `${since} · ${t(h, "sw_today_l")} ${fmtKwh(h, u.kwhToday)}` : since;
    }
    // c
    if (!on) return todayTxt ? `${word} · ${t(h, "sw_today_l")} ${todayTxt}` : word;
    if (kw != null && u?.kwhToday != null) return `${fmtKw(h, kw)} · ${t(h, "sw_today_l")} ${fmtKwh(h, u.kwhToday)}`;
    return u ? `${t(h, "sw_since")} ${fmtTime(h, e.last_changed)} · ${t(h, "sw_today_l")} ${fmtSpan(u.onToday)}` : `${t(h, "sw_since")} ${fmtTime(h, e.last_changed)}`;
  }

  // ---- Render ------------------------------------------------------------------------

  render() {
    if (!this._config || !this.hass) return nothing;
    const h = this.hass;
    const e = this._entity;
    if (!e) return html`<div class="card off missing"><span>${t(h, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const on = isOn(e);
    const unavailable = isUnavailable(e);
    const size = this._size;
    const icon = html`<button class="icon" aria-label="${on ? t(h, "turn_off") : t(h, "turn_on")} ${this._name}" ?disabled=${unavailable} @click=${this._toggle}>
      ${switchIcon(this._icon, on, size === "s11" ? 20 : 32)}
    </button>`;
    const text = html`<div class="text"><span class="name">${this._name}</span><span class="state">${this._status(e, on)}</span></div>`;
    return html`<div
      class="card ${size} ${on ? "on" : "off"} ${unavailable ? "unavailable" : ""}"
      style=${on ? tintStyle(switchTint(this._config.color)) : ""}
      role="button"
      tabindex="0"
      aria-label=${this._name}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      @click=${this._cardClick}
      @keydown=${(ev: KeyboardEvent) => {
        if ((ev.key === "Enter" || ev.key === " ") && ev.target === ev.currentTarget) {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >
      ${size === "s22" ? html`<div class="head">${icon}${text}</div>${this._body(e, on)}` : html`${icon}${text}`}
    </div>`;
  }

  private _body(e: HassEntity, on: boolean) {
    const h = this.hass!;
    const c = this._config!;
    const u = this._usage;
    const style = c.style ?? "c";
    const kw = on ? powerNow(h, meterOf(h, c).power) : null;
    if (style === "a") {
      return html`<div class="since">
        <span><b>${t(h, on ? "sw_since" : "sw_off")}</b>${fmtTime(h, e.last_changed)}</span>
        ${kw != null ? html`<span><b>${t(h, "sw_now")}</b>${fmtKw(h, kw)}</span>` : nothing}
        ${u ? html`<span><b>${t(h, "today")}</b>${u.kwhToday != null ? fmtKwh(h, u.kwhToday) : fmtSpan(u.onToday)}</span>` : nothing}
      </div>`;
    }
    if (style === "b") {
      const vals = u ? (u.hourly ?? u.hourlyOn) : Array(24).fill(0);
      const max = Math.max(...vals, u?.hourly ? 0.05 : 15);
      const nowH = new Date().getHours();
      let big: [string, string];
      if (kw != null && on) {
        const s = fmtKw(h, kw).split(" ");
        big = [s[0], s[1]];
      } else if (u?.kwhToday != null) big = [fmtKwh(h, u.kwhToday).split(" ")[0], "kWh"];
      else {
        const s = fmtSpan(u?.onToday ?? 0);
        const m = s.match(/^(.*?)\s*(min|h)$/);
        big = m ? [m[1], m[2]] : [s, ""];
      }
      return html`<div class="cons">
        <span class="big">${big[0]}<small> ${big[1]}</small></span>
        <span class="bars" aria-hidden="true">${vals.map((v, i) =>
          html`<i class=${v > 0 ? (i === nowH ? "now" : "") : "z"} style="height:${v > 0 ? Math.max(4, (v / max) * 34) : 3}px"></i>`)}</span>
      </div>`;
    }
    // c · timeline of the day
    const t0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const day = 86_400_000;
    const nowPct = ((Date.now() - t0) / day) * 100;
    const spans = (u?.spans ?? []).filter((s) => s.end > t0);
    return html`<div class="line">
      <div class="tl">
        ${spans.map((s) => {
          const a = Math.max(0, (s.start - t0) / day) * 100;
          const b = Math.min(100, ((s.end - t0) / day) * 100);
          return html`<i style="left:${a}%;width:${Math.max(0.8, b - a)}%"></i>`;
        })}
        <b style="left:${nowPct}%"></b>
      </div>
      <div class="ticks"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
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
    button:disabled {
      cursor: default;
    }
    svg {
      display: block;
      flex: none;
    }
    .card {
      box-sizing: border-box;
      height: 100%;
      min-height: 64px;
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
    .unavailable {
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
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      transition: background 0.25s;
    }
    .on .icon {
      background: var(--accent);
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
    }
    .head .text {
      flex: 1;
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s22 .name {
      font-size: 17px;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .s21 .icon {
      align-self: flex-start;
    }
    /* a · data */
    .since {
      display: flex;
      gap: 18px;
      font-size: 12px;
      color: var(--fg2);
      flex: none;
    }
    .since b {
      display: block;
      font-size: 15px;
      color: var(--fg);
    }
    /* b · consumption */
    .cons {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 12px;
      flex: none;
    }
    .big {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .big small {
      font-size: 15px;
      font-weight: 600;
      color: var(--fg2);
      letter-spacing: 0;
    }
    .bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 34px;
      width: 46%;
    }
    .bars i {
      flex: 1;
      border-radius: 3px 3px 1px 1px;
      background: var(--accent, rgba(255, 255, 255, 0.85));
      opacity: 0.8;
    }
    .bars i.now {
      opacity: 1;
    }
    .bars i.z {
      background: color-mix(in srgb, var(--fg) 14%, transparent);
      opacity: 1;
    }
    /* c · timeline */
    .line {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: none;
    }
    .tl {
      position: relative;
      height: 12px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      overflow: hidden;
    }
    .tl i {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 6px;
      background: var(--accent, #fff);
    }
    .off .tl i {
      background: rgba(255, 255, 255, 0.6);
    }
    .tl b {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--fg);
      opacity: 0.7;
    }
    .ticks {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      font-weight: 600;
      color: var(--fg2);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-switch": TerralSwitchCard;
  }
}
