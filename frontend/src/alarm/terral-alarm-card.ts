// Terral · Alarm card (2/2). Same layout as the 2/2 light card: icon circle,
// name and status on top, a 48 px row of actions below.
//   Disarmed  → one button per enabled mode (away, home, vacation).
//   Arming    → the shield pulses inside an amber ring that empties, seconds blink; Cancel.
//   Armed     → card tinted with the mode colour (like a lit light); Disarm only.
//   Refused   → Alarmo found something open: "Arm anyway" / Cancel.
//   Pending   → red border pulse + countdown; Triggered → the card flashes red.
// Tapping anywhere but a button opens the alarm window; long press = move.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { t } from "../i18n";
import { alertIcon, closeIcon, lockIcon, shieldCheckIcon, shieldIcon, unlockIcon } from "../shared/icons";
import { REFUSAL_EVENT, alarmTexts, arm, clearRefusal, countdown, disarm, modeLabel, refusalFor } from "./alarm-actions";
import { CARD_MODES, type AlarmMode, currentMode, delayTotal, enabledModes, modeTint, phase, secondsLeft } from "./alarm-model";
import { modeIcon, openAlarmDialog, updateAlarmDialog } from "./terral-alarm-dialog";

export interface TerralAlarmCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
}

export const ALARM_CARD_TAG = "terral-home-alarm";

@customElement(ALARM_CARD_TAG)
export class TerralAlarmCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralAlarmCardConfig;
  @state() private _tick = 0;

  private _timer?: number;
  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;

  setConfig(config: TerralAlarmCardConfig): void {
    if (!config?.entity || !String(config.entity).startsWith("alarm_control_panel.")) {
      throw new Error("Terral · Alarma: 'entity' must be an alarm (alarm_control_panel.xxx)");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 2;
  }

  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 6, min_rows: 2 };
  }

  /** Only 2/2 for now. */
  getTerralSizes(): { w: number; h: number }[] {
    return [{ w: 2, h: 2 }];
  }

  static getStubConfig(hass: HomeAssistant) {
    const pick = Object.keys(hass?.states ?? {}).find((id) => id.startsWith("alarm_control_panel.")) ?? "alarm_control_panel.alarmo";
    return { entity: pick };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "alarm_control_panel" } } },
        { name: "name", selector: { text: {} } },
      ],
      computeLabel: (s: { name: string }) => t(undefined, s.name === "entity" ? "alarm_entity" : "name"),
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(REFUSAL_EVENT, this._refresh);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(REFUSAL_EVENT, this._refresh);
    clearInterval(this._timer);
    this._timer = undefined;
    this._cancelHold();
  }

  private _refresh = () => this.requestUpdate();

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  private get _name(): string {
    return this._config?.name || t(this.hass, "alarm");
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    return !old || !this._config || old.states[this._config.entity] !== this._entity;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) updateAlarmDialog(this.hass);
    // Tick while a delay is counting down.
    const e = this._entity;
    const counting = !!e && secondsLeft(e) != null;
    if (counting && !this._timer) this._timer = window.setInterval(() => this._tick++, 250);
    if (!counting && this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  // ---- Interaction (same rules as the light card) ---------------------------

  private _getHass = () => this.hass;

  private _openWindow() {
    if (this.hass && this._config) openAlarmDialog(this.hass, this._config.entity, this._name);
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

  private _act(fn: () => void) {
    return (ev: Event) => {
      ev.stopPropagation();
      fn();
    };
  }

  // ---- Render ---------------------------------------------------------------

  private _row(e: HassEntity) {
    const id = e.entity_id;
    const ph = phase(e);
    const refused = refusalFor(e);
    if (refused) {
      return html`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => arm(this._getHass, id, refused.mode, true))}>${lockIcon()}<span>${t(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => clearRefusal(id))}><span>${t(this.hass, "cancel")}</span></button>
      </div>`;
    }
    switch (ph) {
      case "disarmed": {
        const modes = enabledModes(e).filter((m) => CARD_MODES.includes(m));
        return html`<div class="row ${modes.length > 2 ? "three" : ""}">
          ${modes.map(
            (m: AlarmMode) => html`<button class="pb" aria-label=${t(this.hass, "arm_mode", { mode: modeLabel(this.hass, m) })} @click=${this._act(() => arm(this._getHass, id, m))}>
              ${modeIcon(m)}<span>${modeLabel(this.hass, m)}</span>
            </button>`,
          )}
        </div>`;
      }
      case "arming":
        return html`<div class="row"><button class="pb" @click=${this._act(() => disarm(this._getHass, id))}>${closeIcon(20)}<span>${t(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return html`<div class="row"><button class="pb" @click=${this._act(() => disarm(this._getHass, id))}>${unlockIcon()}<span>${t(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return html`<div class="row"><button class="pb solid" @click=${this._act(() => disarm(this._getHass, id))}>${unlockIcon()}<span>${t(this.hass, "disarm")}</span></button></div>`;
      default:
        return nothing;
    }
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const e = this._entity;
    if (!e) {
      return html`<div class="card off missing"><span>${t(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    }
    void this._tick;
    const ph = phase(e);
    const refused = !!refusalFor(e);
    const mode = currentMode(e);
    const armed = ph === "armed" && !!mode;
    const tint = armed ? modeTint(mode!) : undefined;
    const secs = countdown(e);
    const total = delayTotal(e);
    const left = secondsLeft(e);
    const p = left != null && total ? left / total : 0;
    const style = `${tint ? `--bg:${tint.bg};--fg:${tint.fg};--fg2:${tint.fg2};--accent:${tint.accent};` : ""}--p:${p}`;
    const icon = refused || ph === "pending" || ph === "triggered" ? alertIcon(28) : armed ? shieldCheckIcon(30) : shieldIcon(30);
    const { title, status } = alarmTexts(this.hass, e, this._name);
    const st = refused ? "failed" : ph;

    return html`<div
      class="card ${armed ? "on" : "off"} st-${st}"
      style=${style}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${title}, ${status}`}
      @click=${this._cardClick}
      @keydown=${(ev: KeyboardEvent) => {
        if ((ev.key === "Enter" || ev.key === " ") && ev.target === ev.currentTarget) {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >
      <div class="head">
        <span class="icon">${icon}</span>
        <div class="text"><span class="name">${title}</span><span class="state">${status}</span></div>
        ${secs != null ? html`<span class="secs">${secs}</span>` : nothing}
      </div>
      ${this._row(e)}
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
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      cursor: pointer;
      outline: none;
      transition: background 0.25s, color 0.25s, border-color 0.25s;
      --fg: #fff;
      --fg2: rgba(255, 255, 255, 0.75);
      --ring: transparent;
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
    .missing {
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 13px;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
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
    /* Countdown ring: a conic arc that empties as the delay runs out. */
    .icon::before {
      content: "";
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(var(--ring) calc(var(--p, 0) * 1turn), transparent 0);
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px));
      mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px));
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .name {
      font-size: 17px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .secs {
      flex: none;
      min-width: 40px;
      text-align: right;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--ring);
      animation: blink 1s ease-in-out infinite;
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
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      transition: transform 0.1s, background 0.2s;
    }
    .pb:active {
      transform: scale(0.97);
    }
    .pb svg {
      width: 20px;
      height: 20px;
      flex: none;
    }
    .pb span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pb.solid {
      background: #fff;
      color: #23233a;
    }
    .pb.grow {
      flex: 1.7;
    }
    .row.three {
      gap: 6px;
    }
    .row.three .pb {
      padding: 0 6px;
      font-size: 13.5px;
    }
    .row.three .pb svg {
      display: none;
    }

    .st-arming {
      --ring: #ffb45c;
    }
    .st-arming .icon {
      color: #ffb45c;
      --pc: #ffb45c;
      animation: pulse 1.2s ease-in-out infinite;
    }
    .st-pending {
      --ring: #fff;
      border-color: rgba(255, 120, 110, 0.9);
      animation: warn 1s ease-in-out infinite;
    }
    .st-pending .icon {
      background: #ff453a;
      --pc: #ff453a;
      animation: pulse 1s ease-in-out infinite;
    }
    .st-triggered {
      background: #ff453a;
      border: 1px solid rgba(255, 255, 255, 0.7);
      animation: flash 0.9s steps(1) infinite;
    }
    .st-triggered .icon {
      background: #fff;
      color: #ff453a;
    }
    .st-triggered .pb.solid {
      color: #b3221b;
    }
    .st-failed .icon {
      color: #ffb45c;
    }
    .st-unavailable {
      opacity: 0.55;
    }
    @keyframes blink {
      50% { opacity: 0.3; }
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--pc) 55%, transparent); }
      60% { box-shadow: 0 0 0 9px color-mix(in srgb, var(--pc) 0%, transparent); }
    }
    @keyframes warn {
      0%, 100% { background: rgba(255, 255, 255, 0.13); }
      50% { background: rgba(255, 69, 58, 0.32); }
    }
    @keyframes flash {
      0%, 100% { background: #ff453a; }
      50% { background: #8f1d17; }
    }
    @media (prefers-reduced-motion: reduce) {
      .card, .card * { animation: none !important; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-alarm": TerralAlarmCard;
  }
}
