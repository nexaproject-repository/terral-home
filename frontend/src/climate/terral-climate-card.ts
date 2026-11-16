// Terral · Climate card (1/1, 2/1, 2/2, 4/2) for any climate entity.
//   The icon turns it on / off ("off" is not offered as a mode).
//   2/2: [mode] [− temperature +] [fan]; 4/2: big dial, mode bottom-left,
//   fan bottom-right. Temperature and fan dim when the mode doesn't use them.
//   The mode button is hidden when the machine has a single mode (heaters).
import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { lang, t } from "../i18n";
import { fanIcon, stepMinusIcon, stepPlusIcon } from "../shared/icons";
import { openPop } from "../shared/terral-pop";
import { openCardSettings } from "../panel/terral-card-config";
import { type Target, fmtT, humidityText, modeIcon, statusText, targetOf, targetText, tint } from "./climate-look";
import {
  type ClimateConfig,
  actionName,
  canFan,
  canTemp,
  currentTemp,
  fanModes,
  fanTag,
  isOff,
  isRange,
  isUnavailable,
  limits,
  modeName,
  modes,
  optionName,
  rememberMode,
  setFan,
  setMode,
  setTemp,
  snap,
  turnOff,
  turnOn,
} from "./climate-model";
import { openClimateDialog, updateClimateDialog } from "./terral-climate-dialog";

export type TerralClimateCardConfig = LovelaceCardConfig & ClimateConfig;
type Size = "s11" | "s21" | "s22" | "s42";

export const CLIMATE_CARD_TAG = "terral-home-climate";

/** Pending target while the user is still pressing / dragging; sent after a short pause. */
export class TempSender {
  value?: Target;
  private timer?: number;
  constructor(private onChange: () => void) {}
  set(h: HomeAssistant, e: HassEntity, v: Target) {
    this.value = v;
    this.onChange();
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      setTemp(h, e, v);
      window.setTimeout(() => {
        this.value = undefined;
        this.onChange();
      }, 2500);
    }, 650);
  }
}

@customElement(CLIMATE_CARD_TAG)
export class TerralClimateCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralClimateCardConfig;
  @state() private _size: Size = "s22";
  @state() private _tick = 0;

  private _pending = new TempSender(() => this._tick++);
  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;
  private _dragging = false;

  setConfig(config: TerralClimateCardConfig): void {
    if (!config?.entity || !String(config.entity).startsWith("climate.")) {
      throw new Error("Terral · Clima: 'entity' must be a climate entity (climate.xxx)");
    }
    this._config = config;
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.h === 4 ? "s42" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s42" ? 4 : 2;
  }

  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 },
    ];
  }

  static getStubConfig(hass: HomeAssistant) {
    return { entity: Object.keys(hass?.states ?? {}).find((id) => id.startsWith("climate.")) ?? "climate.example" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "climate" } } },
        { name: "name", selector: { text: {} } },
        { name: "min_temp", selector: { number: { min: 0, max: 40, step: 0.5 } } },
        { name: "max_temp", selector: { number: { min: 0, max: 40, step: 0.5 } } },
        { name: "temp_step", selector: { select: { options: ["0.5", "1"] } } },
      ],
    };
  }

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  private get _name() {
    return this._config?.name || (this._entity?.attributes.friendly_name as string) || t(this.hass, "type_climate");
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    return !old || !this._config || old.states[this._config.entity] !== this._entity;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
      updateClimateDialog(this.hass);
      const e = this._entity;
      if (e) rememberMode(e);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cancelHold();
  }

  // ---- Actions -----------------------------------------------------------------

  private _power = (ev: Event) => {
    ev.stopPropagation();
    const e = this._entity;
    if (!e || !this.hass || isUnavailable(e)) return;
    if (isOff(e)) turnOn(this.hass, e);
    else turnOff(this.hass, e);
  };

  private _target(e: HassEntity): Target | null {
    return this._pending.value ?? targetOf(e);
  }

  private _step(dir: 1 | -1) {
    return (ev: Event) => {
      ev.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass || !this._config) return;
      const l = limits(e, this._config);
      const cur = this._target(e);
      if (cur == null) return;
      if (typeof cur === "number") this._pending.set(this.hass, e, snap(cur + dir * l.step, l));
      else if (dir > 0) this._pending.set(this.hass, e, { low: cur.low, high: snap(cur.high + l.step, l) });
      else this._pending.set(this.hass, e, { low: snap(cur.low - l.step, l), high: cur.high });
    };
  }

  private _modeMenu = (ev: Event) => {
    ev.stopPropagation();
    const e = this._entity;
    if (!e || !this.hass) return;
    const l = lang(this.hass);
    openPop(ev.currentTarget as Element, modes(e).map((m) => ({
      label: modeName(l, m),
      icon: modeIcon(m, 21),
      selected: !isOff(e) && e.state === m,
      run: () => setMode(this.hass!, e, m),
    })));
  };

  private _fanMenu = (ev: Event) => {
    ev.stopPropagation();
    const e = this._entity;
    if (!e || !this.hass) return;
    const l = lang(this.hass);
    openPop(ev.currentTarget as Element, fanModes(e).map((f) => ({
      label: optionName(l, f),
      icon: fanIcon(21),
      selected: e.attributes.fan_mode === f,
      run: () => setFan(this.hass!, e, f),
    })), "right");
  };

  private _openWindow() {
    if (!this.hass || !this._config) return;
    openClimateDialog(this.hass, this._config, this._name, () => this.hass && this._config && openCardSettings(this, this.hass, "climate", this._config));
  }

  // ---- Dial drag -----------------------------------------------------------------

  private _dialDown = (ev: PointerEvent) => {
    const e = this._entity;
    if (!e || !this._config || !canTemp(e, this._config)) return;
    ev.stopPropagation();
    this._cancelHold();
    this._dragging = true;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    this._dialMove(ev);
  };

  private _dialMove = (ev: PointerEvent) => {
    if (!this._dragging || !this.hass || !this._config) return;
    const e = this._entity;
    if (!e) return;
    const r = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + (r.height * 100) / 180;
    const a = (Math.atan2(cy - ev.clientY, ev.clientX - cx) * 180) / Math.PI;
    let from = 225 - a;
    if (from < 0) from += 360;
    if (from > 300) from = 0;
    const l = limits(e, this._config);
    const v = snap(l.min + Math.min(1, from / 270) * (l.max - l.min), l);
    const cur = this._target(e);
    if (cur != null && typeof cur === "object") this._pending.set(this.hass, e, { low: Math.min(cur.low, v - l.step), high: v });
    else this._pending.set(this.hass, e, v);
  };

  private _dialUp = () => {
    this._dragging = false;
  };

  // ---- Hold / click (same rules as the other cards) ---------------------------------

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
      if (node instanceof HTMLElement && (node.tagName === "BUTTON" || node.classList.contains("dial"))) return;
    }
    this._openWindow();
  };

  // ---- Render -------------------------------------------------------------------

  private _pct(e: HassEntity): number {
    if (!this._config || !canTemp(e, this._config)) return 0;
    const l = limits(e, this._config);
    const tg = this._target(e);
    if (tg == null) return 0;
    const v = typeof tg === "number" ? tg : tg.high;
    return Math.max(0, Math.min(1, (v - l.min) / (l.max - l.min)));
  }

  private _icon(e: HassEntity, size: number) {
    return html`<button class="icon" aria-label=${isOff(e) ? t(this.hass, "turn_on") : t(this.hass, "turn_off")} ?disabled=${isUnavailable(e)} @click=${this._power}>
      ${modeIcon(isOff(e) ? "off" : e.state, size)}
    </button>`;
  }

  private _modeBtn(e: HassEntity) {
    if (modes(e).length < 2) return nothing;
    return html`<button class="rbtn" aria-label=${t(this.hass, "climate_mode")} ?disabled=${isUnavailable(e)} @click=${this._modeMenu}>
      ${modeIcon(isOff(e) ? (modes(e)[0] ?? "off") : e.state, 22)}
    </button>`;
  }

  private _fanBtn(e: HassEntity) {
    const list = fanModes(e);
    if (!list.length) return nothing;
    const ok = canFan(e, this._config!);
    const cur = e.attributes.fan_mode as string | undefined;
    return html`<button class="rbtn" aria-label=${t(this.hass, "climate_fan")} ?disabled=${!ok} @click=${this._fanMenu}>
      ${fanIcon(22)}${cur ? html`<span class="tag">${fanTag(list, cur)}</span>` : nothing}
    </button>`;
  }

  private _stepper(e: HassEntity) {
    const h = this.hass!;
    const ok = canTemp(e, this._config!);
    const tg = this._target(e);
    const cur = currentTemp(e);
    const label = ok
      ? html`<span class="v ${typeof tg === "object" ? "range" : ""}">${targetText(h, tg)}</span>`
      : html`<span class="v muted">${isOff(e) ? (cur != null ? `${fmtT(h, cur)}° ${lang(h) === "es" ? "dentro" : "inside"}` : "—") : t(h, "no_temperature")}</span>`;
    return html`<div class="step ${ok ? "" : "dis"}">
      <button aria-label="−" ?disabled=${!ok} @click=${this._step(-1)}>${stepMinusIcon()}</button>
      ${label}
      <button aria-label="+" ?disabled=${!ok} @click=${this._step(1)}>${stepPlusIcon()}</button>
    </div>`;
  }

  private _dial(e: HassEntity) {
    const h = this.hass!;
    const l = lang(h);
    const R = 86;
    const C = 2 * Math.PI * R;
    const arc = C * 0.75;
    const p = this._pct(e);
    const ang = ((225 - p * 270) * Math.PI) / 180;
    const cx = 114 + R * Math.cos(ang);
    const cy = 100 - R * Math.sin(ang);
    const ok = canTemp(e, this._config!);
    const cur = currentTemp(e);
    const curTxt = cur != null ? `${fmtT(h, cur)}°` : "—";
    const tg = this._target(e);
    const big = ok ? targetText(h, tg) : curTxt;
    const small = isOff(e)
      ? `${l === "es" ? "dentro · apagado" : "inside · off"}`
      : ok
        ? `${modeName(l, e.state)} · ${l === "es" ? "dentro" : "inside"} ${curTxt}`
        : `${modeName(l, e.state)} · ${l === "es" ? "dentro" : "inside"}`;
    return html`<div class="dial ${ok ? "" : "disabled"}" @pointerdown=${this._dialDown} @pointermove=${this._dialMove} @pointerup=${this._dialUp} @pointercancel=${this._dialUp}>
      ${svg`<svg viewBox="0 0 228 180" aria-hidden="true">
        <circle class="trk" cx="114" cy="100" r=${R} stroke-dasharray="${arc} ${C}" transform="rotate(135 114 100)"></circle>
        ${p ? svg`<circle class="val" cx="114" cy="100" r=${R} stroke-dasharray="${arc * p} ${C}" transform="rotate(135 114 100)"></circle>
          <circle class="thumb" cx=${cx} cy=${cy} r="12"></circle>` : nothing}
      </svg>`}
      <div class="mid"><b class=${typeof tg === "object" && ok ? "range" : ""}>${big}</b><span>${small}</span></div>
    </div>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const h = this.hass;
    const e = this._entity;
    if (!e) return html`<div class="card off missing"><span>${t(h, "not_found")}</span><small>${this._config.entity}</small></div>`;
    void this._tick;
    const size = this._size;
    const name = this._name;
    const tg = this._target(e);
    const off = isOff(e);
    const st = statusText(h, e, this._config, tg, false);
    const stShort = statusText(h, e, this._config, tg, true);
    const l = lang(h);

    let body;
    if (size === "s11") {
      body = html`${this._icon(e, 21)}<div class="text"><span class="name">${name}</span><span class="state">${stShort}</span></div>`;
    } else if (size === "s21") {
      const cur = currentTemp(e);
      const extra = cur != null ? ` · ${fmtT(h, cur)}° ${l === "es" ? "dentro" : "inside"}` : "";
      body = html`${this._icon(e, 30)}<div class="text"><span class="name">${name}</span><span class="state">${off ? st : stShort + extra}</span></div>`;
    } else if (size === "s22") {
      body = html`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${name}</span><span class="state">${st}</span></div></div>
        <div class="row">${this._modeBtn(e)}${this._stepper(e)}${this._fanBtn(e)}</div>`;
    } else {
      const hum = humidityText(h, e);
      const sub = off ? (l === "es" ? "Apagado" : "Off") : [actionName(l, e.state), hum].filter(Boolean).join(" · ");
      body = html`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${name}</span><span class="state">${sub}</span></div></div>
        ${this._dial(e)}
        <div class="bottom">${this._modeBtn(e) === nothing ? html`<span></span>` : this._modeBtn(e)}${this._fanBtn(e)}</div>`;
    }

    return html`<div
      class="card ${size} ${off ? "off" : "on"} ${isUnavailable(e) ? "unavailable" : ""}"
      style=${tint(e)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${name}, ${st}`}
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
    button:disabled {
      cursor: default;
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
    .ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      pointer-events: none;
      background: conic-gradient(from 225deg, var(--arc, #fff) calc(var(--p) * 270deg), color-mix(in srgb, var(--fg) 14%, transparent) 0 270deg, transparent 0);
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3.5px));
      mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3.5px));
    }
    .off .ring {
      display: none;
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
    .s11 .ring {
      inset: -3px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: none;
    }
    .rbtn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .rbtn:disabled {
      opacity: 0.4;
    }
    .tag {
      position: absolute;
      right: -2px;
      bottom: -2px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      box-sizing: border-box;
      border-radius: 9px;
      background: var(--fg);
      color: var(--bg-solid, #23233a);
      font-size: 10px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .step {
      flex: 1;
      min-width: 0;
      height: 48px;
      border-radius: 24px;
      padding: 0 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .step.dis {
      opacity: 0.45;
    }
    .step button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .step button:active:not(:disabled) {
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .v {
      font-size: 18px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .v.range {
      font-size: 15px;
    }
    .v.muted {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--fg2);
    }
    .s42 {
      justify-content: flex-start;
      gap: 8px;
      padding: 16px;
    }
    .dial {
      position: relative;
      width: 228px;
      height: 180px;
      max-width: 100%;
      margin: 0 auto;
      flex: none;
      touch-action: none;
    }
    .dial.disabled {
      cursor: inherit;
    }
    .dial svg {
      width: 100%;
      height: 100%;
    }
    .trk {
      fill: none;
      stroke: color-mix(in srgb, var(--fg) 14%, transparent);
      stroke-width: 13;
      stroke-linecap: round;
    }
    .val {
      fill: none;
      stroke: var(--arc, #fff);
      stroke-width: 13;
      stroke-linecap: round;
    }
    .thumb {
      fill: #fff;
      stroke: rgba(0, 0, 0, 0.15);
      stroke-width: 1;
    }
    .mid {
      position: absolute;
      left: 0;
      right: 0;
      top: 56px;
      text-align: center;
      pointer-events: none;
    }
    .mid b {
      font-size: 46px;
      font-weight: 800;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }
    .mid b.range {
      font-size: 32px;
    }
    .mid span {
      display: block;
      margin-top: 2px;
      font-size: 13px;
      font-weight: 600;
      color: var(--fg2);
    }
    .bottom {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }
    .bottom > * {
      pointer-events: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-climate": TerralClimateCard;
  }
}
