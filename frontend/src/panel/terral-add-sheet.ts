// "Añadir tarjeta": first choose the kind of card (list); its settings sheet
// (device and name) comes next.
import { css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t, type StringKey } from "../i18n";
import { bulbIcon, chevronIcon, evChargerIcon, searchIcon, shieldIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import type { CardType } from "./terral-card-config";

const thermoIcon = (s = 20) => svg`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>`;
const blindIcon = (s = 20) => svg`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M5 4v12M19 4v12M5 8h14M5 12h14M5 16h14M12 16v4"></path></svg>`;
const gaugeIcon = (s = 20) => svg`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"></path><path d="M12 18l4-6"></path></svg>`;

const TYPES: { type: CardType; name: StringKey; desc: StringKey; icon: () => unknown; color: string }[] = [
  { type: "light", name: "type_light", desc: "type_light_desc", icon: () => bulbIcon(true, 20), color: "#ffb020" },
  { type: "alarm", name: "type_alarm", desc: "type_alarm_desc", icon: () => shieldIcon(20), color: "rgba(255,255,255,.18)" },
  { type: "charger", name: "ev_charger", desc: "type_charger_desc", icon: () => evChargerIcon(20), color: "#34c77b" },
  { type: "climate", name: "type_climate", desc: "type_climate_desc", icon: () => thermoIcon(), color: "#4696ff" },
];
const SOON: { name: StringKey; icon: () => unknown }[] = [
  { name: "type_cover", icon: () => blindIcon() },
  { name: "type_sensor", icon: () => gaugeIcon() },
];

@customElement("terral-add-sheet")
export class TerralAddSheet extends TerralSheet {
  @property({ attribute: false }) onType?: (type: CardType) => void;
  @state() private _q = "";

  protected get heading() {
    return t(this.hass, "add_card");
  }

  protected renderContent() {
    const q = this._q.trim().toLowerCase();
    const match = (k: StringKey, d?: StringKey) => !q || t(this.hass, k).toLowerCase().includes(q) || (d && t(this.hass, d).toLowerCase().includes(q));
    const types = TYPES.filter((x) => match(x.name, x.desc));
    // A type with nothing to show in this house is greyed out with the reason.
    const missing = (type: CardType): StringKey | undefined =>
      type === "alarm" && !Object.keys(this.hass.states).some((id) => id.startsWith("alarm_control_panel."))
        ? "alarm_missing"
        : type === "climate" && !Object.keys(this.hass.states).some((id) => id.startsWith("climate."))
          ? "climate_missing"
          : undefined;
    const soon = SOON.filter((x) => match(x.name));
    return html`
      <label class="search">
        ${searchIcon()}
        <input type="search" placeholder=${t(this.hass, "search_card_types")} .value=${this._q}
          @input=${(ev: Event) => (this._q = (ev.target as HTMLInputElement).value)} />
      </label>
      <div class="scroll">
        ${types.length
          ? html`<section>
              <h3>${t(this.hass, "available")}</h3>
              <div class="list">
                ${types.map((x) => {
                  const why = missing(x.type);
                  return html`<button class="row ${why ? "soon" : ""}" ?disabled=${!!why} @click=${() => {
                    this.close();
                    this.onType?.(x.type);
                  }}>
                    <span class="ic" style="background:${why ? "rgba(255,255,255,.14)" : x.color}">${x.icon()}</span>
                    <span class="nm">${t(this.hass, x.name)}<small>${t(this.hass, why ?? x.desc)}</small></span>
                    ${why ? nothing : html`<span class="chev">${chevronIcon(false, 16)}</span>`}
                  </button>`;
                })}
              </div>
            </section>`
          : nothing}
        ${soon.length
          ? html`<section>
              <h3>${t(this.hass, "coming_soon")}</h3>
              <div class="list">
                ${soon.map(
                  (x) => html`<div class="row soon">
                    <span class="ic">${x.icon()}</span>
                    <span class="nm">${t(this.hass, x.name)}<small>${t(this.hass, "coming_soon")}</small></span>
                  </div>`,
                )}
              </div>
            </section>`
          : nothing}
      </div>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.12);
        flex: none;
      }
      input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      input::placeholder {
        color: rgba(255, 255, 255, 0.55);
      }
      section + section {
        margin-top: 16px;
      }
      h3 {
        margin: 6px 4px 8px;
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
        min-height: 60px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      button.row:active {
        background: rgba(255, 255, 255, 0.08);
      }
      .soon {
        opacity: 0.45;
      }
      .ic {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .nm {
        flex: 1;
        min-width: 0;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
      }
      .nm small {
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .chev {
        opacity: 0.6;
      }
    `,
  ];
}

export function openAddSheet(hass: HomeAssistant, onType: (type: CardType) => void) {
  const el = document.createElement("terral-add-sheet");
  el.hass = hass;
  el.onType = onType;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-add-sheet": TerralAddSheet;
  }
}
