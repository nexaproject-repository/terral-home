// Alarm window: status, every enabled mode (night and custom too), skip the
// delay, open / bypassed sensors and who changed it last.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { relativeTime, t } from "../i18n";
import {
  alertIcon,
  awayIcon,
  closeIcon,
  customModeIcon,
  gearIcon,
  homeIcon,
  lockIcon,
  nightIcon,
  shieldCheckIcon,
  shieldIcon,
  skipIcon,
  unlockIcon,
  vacationIcon,
} from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { REFUSAL_EVENT, alarmTexts, arm, clearRefusal, countdown, disarm, modeLabel, refusalFor } from "./alarm-actions";
import {
  type AlarmMode,
  MODE_COLORS,
  bypassedSensors,
  currentMode,
  enabledModes,
  entityName,
  openSensors,
  phase,
  secondsLeft,
  skipDelay,
} from "./alarm-model";

export const modeIcon = (m: AlarmMode, size = 20) =>
  ({ away: awayIcon, home: homeIcon, night: nightIcon, vacation: vacationIcon, custom: customModeIcon })[m](size);

@customElement("terral-alarm-dialog")
export class TerralAlarmDialog extends TerralSheet {
  @property() entityId = "";
  @property() name = "";
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _tick = 0;
  private _timer?: number;

  protected get heading() {
    return this.name;
  }

  protected renderHeaderEnd() {
    if (!this.onSettings) return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "settings")} @click=${() => {
      const go = this.onSettings!;
      this.close();
      go();
    }}>${gearIcon(19)}</button>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(REFUSAL_EVENT, this._refresh);
    this._timer = window.setInterval(() => {
      const e = this.hass?.states[this.entityId];
      if (e && secondsLeft(e) != null) this._tick++;
    }, 250);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(REFUSAL_EVENT, this._refresh);
    clearInterval(this._timer);
  }

  private _refresh = () => this.requestUpdate();
  private _getHass = () => this.hass;

  private _sensorList(title: string, ids: string[]) {
    if (!ids.length) return nothing;
    return html`<section>
      <h3>${title}</h3>
      <div class="list">${ids.map((id) => html`<div class="row static"><span class="ic">${alertIcon(18)}</span><span class="nm">${entityName(this.hass, id)}</span></div>`)}</div>
    </section>`;
  }

  protected renderContent() {
    const h = this.hass;
    const e = h?.states[this.entityId];
    if (!e) return html`<p>${t(h, "not_found")}</p>`;
    void this._tick;
    const id = this.entityId;
    const ph = phase(e);
    const mode = currentMode(e);
    const refused = refusalFor(e);
    const secs = countdown(e);
    const { title, status } = alarmTexts(h, e, this.name);
    const accent = ph === "armed" && mode ? `rgb(${MODE_COLORS[mode].join(",")})` : ph === "arming" ? "#ffb45c" : ph === "pending" || ph === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)";
    const icon = refused || ph === "pending" || ph === "triggered" ? alertIcon(30) : ph === "armed" ? shieldCheckIcon(32) : shieldIcon(32);
    const isAlarmo = "arm_mode" in e.attributes || "next_state" in e.attributes;

    let actions: unknown = nothing;
    if (refused) {
      actions = html`<div class="btns">
        <button class="big solid" @click=${() => arm(this._getHass, id, refused.mode, true)}>${lockIcon()}<span>${t(h, "arm_anyway")}</span></button>
        <button class="big" @click=${() => clearRefusal(id)}><span>${t(h, "cancel")}</span></button>
      </div>`;
    } else if (ph === "disarmed") {
      actions = html`<section>
        <h3>${t(h, "arm_options")}</h3>
        <div class="list">
          ${enabledModes(e).map(
            (m) => html`<button class="row" @click=${() => arm(this._getHass, id, m)}>
              <span class="ic" style="color:rgb(${MODE_COLORS[m].join(",")})">${modeIcon(m)}</span><span class="nm">${modeLabel(h, m)}</span>
            </button>`,
          )}
        </div>
      </section>`;
    } else if (ph === "arming") {
      actions = html`<div class="btns">
        <button class="big" @click=${() => disarm(this._getHass, id)}>${closeIcon(20)}<span>${t(h, "cancel")}</span></button>
        ${isAlarmo ? html`<button class="big" @click=${() => skipDelay(h, e)}>${skipIcon()}<span>${t(h, "skip_delay")}</span></button>` : nothing}
      </div>`;
    } else if (ph !== "unavailable") {
      actions = html`<div class="btns"><button class="big solid" @click=${() => disarm(this._getHass, id)}>${unlockIcon()}<span>${t(h, "disarm")}</span></button></div>`;
    }

    const changedBy = e.attributes.changed_by as string | undefined;
    return html`
      <div class="status st-${refused ? "failed" : ph}" style="--ac:${accent}">
        <span class="sic">${icon}</span>
        <div class="txt"><strong>${title}</strong><span>${status}</span></div>
        ${secs != null ? html`<span class="secs">${secs}</span>` : nothing}
      </div>
      <div class="scroll">
        ${actions}
        ${this._sensorList(t(h, "open_sensors"), openSensors(e))}
        ${ph === "armed" ? this._sensorList(t(h, "bypassed_sensors"), bypassedSensors(e)) : nothing}
        <p class="foot">${t(h, "changed_by")}: ${changedBy ? `${changedBy} · ` : ""}${relativeTime(h, e.last_changed)}</p>
      </div>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
      }
      .sic {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--ac);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .st-arming .sic,
      .st-failed .sic {
        background: rgba(255, 255, 255, 0.16);
        color: #ffb45c;
      }
      .st-arming .sic {
        animation: pulse 1.2s ease-in-out infinite;
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .txt strong {
        font-size: 18px;
      }
      .txt span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.75);
      }
      .secs {
        font-size: 34px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: var(--ac);
        animation: blink 1s ease-in-out infinite;
      }
      .st-pending .secs {
        color: #fff;
      }
      @keyframes blink { 50% { opacity: 0.3; } }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 180, 92, 0.55); }
        60% { box-shadow: 0 0 0 9px rgba(255, 180, 92, 0); }
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      button.row:active {
        background: rgba(255, 255, 255, 0.08);
      }
      .ic {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .nm {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
      }
      .btns {
        display: flex;
        gap: 10px;
      }
      .big {
        flex: 1;
        height: 54px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
      }
      .big.solid {
        background: #fff;
        color: #23233a;
      }
      .foot {
        margin: 0 4px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.55);
      }
      @media (prefers-reduced-motion: reduce) {
        .sic, .secs { animation: none !important; }
      }
    `,
  ];
}

export function openAlarmDialog(hass: HomeAssistant, entityId: string, name: string, onSettings?: () => void) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const el = document.createElement("terral-alarm-dialog");
  el.hass = hass;
  el.entityId = entityId;
  el.name = name;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

/** Keep an open window in sync with HA state. */
export function updateAlarmDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-alarm-dialog")) el.hass = hass;
  for (const el of document.querySelectorAll("terral-code-sheet")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-alarm-dialog": TerralAlarmDialog;
  }
}
