// Climate window: status (icon = on/off), temperature, modes, fan speed,
// swing (only when enabled in the card settings) and presets.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant } from "../ha-types";
import { lang, t } from "../i18n";
import { gearIcon, stepMinusIcon, stepPlusIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { type Target, humidityText, modeIcon, targetOf, targetText, tint, fmtT } from "./climate-look";
import {
  type ClimateConfig,
  canFan,
  canTemp,
  currentTemp,
  fanModes,
  isOff,
  isUnavailable,
  limits,
  modeName,
  modes,
  optionName,
  presetModes,
  setFan,
  setMode,
  setPreset,
  setSwing,
  setTemp,
  snap,
  swingSupported,
  turnOff,
  turnOn,
} from "./climate-model";

@customElement("terral-climate-dialog")
export class TerralClimateDialog extends TerralSheet {
  @property({ attribute: false }) config!: ClimateConfig;
  @property() name = "";
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _pending?: Target;
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

  private get _e(): HassEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private _step(e: HassEntity, dir: 1 | -1) {
    const l = limits(e, this.config);
    const cur = this._pending ?? targetOf(e);
    if (cur == null) return;
    const next: Target =
      typeof cur === "number" ? snap(cur + dir * l.step, l) : dir > 0 ? { low: cur.low, high: snap(cur.high + l.step, l) } : { low: snap(cur.low - l.step, l), high: cur.high };
    this._pending = next;
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => {
      setTemp(this.hass, e, next);
      window.setTimeout(() => (this._pending = undefined), 2500);
    }, 650);
  }

  protected renderContent() {
    const h = this.hass;
    const e = this._e;
    if (!e) return html`<p>${t(h, "not_found")}</p>`;
    const l = lang(h);
    const off = isOff(e);
    const okT = canTemp(e, this.config);
    const okF = canFan(e, this.config);
    const tg = this._pending ?? targetOf(e);
    const cur = currentTemp(e);
    const fans = fanModes(e);
    const ms = modes(e);
    const presets = presetModes(e);
    const showSwing = this.config.show_swing === true && swingSupported(e);
    const swingOn = e.attributes.swing_mode != null && e.attributes.swing_mode !== "off";
    const sub = [cur != null ? `${l === "es" ? "Dentro" : "Inside"} ${fmtT(h, cur)}°` : "", humidityText(h, e)].filter(Boolean).join(" · ");

    return html`
      <div class="status ${off ? "" : "on"}" style=${tint(e)}>
        <button class="icon" aria-label=${off ? t(h, "turn_on") : t(h, "turn_off")} ?disabled=${isUnavailable(e)} @click=${() => (off ? turnOn(h, e) : turnOff(h, e))}>
          ${modeIcon(off ? "off" : e.state, 30)}
        </button>
        <div class="txt">
          <strong>${off ? (l === "es" ? "Apagado" : "Off") : okT ? `${modeName(l, e.state)} · ${targetText(h, tg)}` : modeName(l, e.state)}</strong>
          ${sub ? html`<span>${sub}</span>` : nothing}
        </div>
      </div>
      <div class="scroll">
        <section class=${okT ? "" : "dim"}>
          <h3>${t(h, "temperature")}</h3>
          <div class="wstep">
            <button aria-label="−" ?disabled=${!okT} @click=${() => this._step(e, -1)}>${stepMinusIcon()}</button>
            <span class="v">${okT ? targetText(h, tg) : off ? "—" : t(h, "no_temperature")}</span>
            <button aria-label="+" ?disabled=${!okT} @click=${() => this._step(e, 1)}>${stepPlusIcon()}</button>
          </div>
        </section>
        ${ms.length > 1
          ? html`<section>
              <h3>${t(h, "climate_mode")}</h3>
              <div class="grid">
                ${ms.map((m) => html`<button class="opt ${!off && e.state === m ? "sel" : ""}" @click=${() => setMode(h, e, m)}>${modeIcon(m, 22)}<span>${modeName(l, m)}</span></button>`)}
              </div>
            </section>`
          : nothing}
        ${fans.length
          ? html`<section class=${okF ? "" : "dim"}>
              <h3>${t(h, "climate_fan")}</h3>
              <div class="grid small" style="grid-template-columns:repeat(${Math.min(fans.length, 4)},1fr)">
                ${fans.map((f) => html`<button class="opt ${e.attributes.fan_mode === f ? "sel" : ""}" ?disabled=${!okF} @click=${() => setFan(h, e, f)}><span>${optionName(l, f)}</span></button>`)}
              </div>
              ${okF ? nothing : html`<p class="note">${off ? t(h, "climate_off_note") : t(h, "fan_fixed", { mode: modeName(l, e.state) })}</p>`}
            </section>`
          : nothing}
        ${showSwing
          ? html`<div class="list"><button class="li" role="switch" aria-checked=${swingOn} ?disabled=${off} @click=${() => setSwing(h, e, !swingOn)}>
              <span class="nm">${t(h, "swing")}</span><span class="tog ${swingOn ? "on" : ""}"></span>
            </button></div>`
          : nothing}
        ${presets.length
          ? html`<section>
              <h3>${t(h, "presets")}</h3>
              <div class="grid small">
                ${presets.map((p) => html`<button class="opt ${e.attributes.preset_mode === p ? "sel" : ""}" ?disabled=${off} @click=${() => setPreset(h, e, p)}><span>${optionName(l, p)}</span></button>`)}
              </div>
            </section>`
          : nothing}
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
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
      }
      .status.on {
        background: var(--bg);
      }
      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .status.on .icon {
        background: var(--accent);
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
        font-size: 13.5px;
        color: var(--fg2);
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
      .dim {
        opacity: 0.55;
      }
      .wstep {
        height: 54px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
      }
      .wstep button {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .wstep .v {
        font-size: 20px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .opt {
        height: 70px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12.5px;
        font-weight: 600;
        text-align: center;
      }
      .grid.small .opt {
        height: 44px;
      }
      .opt.sel {
        background: #fff;
        color: #23233a;
      }
      .note {
        margin: 6px 4px 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.62);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 52px;
        box-sizing: border-box;
      }
      .li .nm {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
      }
      .tog::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
    `,
  ];
}

export function openClimateDialog(hass: HomeAssistant, config: ClimateConfig, name: string, onSettings?: () => void) {
  document.querySelector("terral-climate-dialog")?.remove();
  const el = document.createElement("terral-climate-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.name = name;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

export function updateClimateDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-climate-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-climate-dialog": TerralClimateDialog;
  }
}
