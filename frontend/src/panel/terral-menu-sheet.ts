// "···" menu: arrange the home, and (later) Terral Home settings.
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { gearIcon, gripIcon, roomsIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";

@customElement("terral-menu-sheet")
export class TerralMenuSheet extends TerralSheet {
  @property({ attribute: false }) actions: { onEdit?: () => void; onRooms?: () => void } = {};
  @property() version = "";

  protected get heading() {
    return "Terral Home";
  }

  protected renderContent() {
    return html`
      <div class="list">
        <button class="row" @click=${() => {
          this.actions.onEdit?.();
          this.close();
        }}>
          <span class="ic">${gripIcon()}</span><span class="nm">${t(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
          this.close();
          this.actions.onRooms?.();
        }}>
          <span class="ic">${roomsIcon()}</span>
          <span class="nm">${t(this.hass, "by_rooms")}<small>${t(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" disabled>
          <span class="ic">${gearIcon()}</span>
          <span class="nm">${t(this.hass, "terral_settings")}<small>${t(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
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
      .row:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
      }
      .row:disabled {
        opacity: 0.55;
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
        display: flex;
        flex-direction: column;
      }
      .nm small {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.65);
      }
      .foot {
        margin: 8px 0 0;
        text-align: center;
        font-size: 12px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.5);
      }
    `,
  ];
}

export function openMenuSheet(hass: HomeAssistant, version: string, actions: { onEdit?: () => void; onRooms?: () => void }) {
  const el = document.createElement("terral-menu-sheet");
  el.hass = hass;
  el.version = version;
  el.actions = actions;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-menu-sheet": TerralMenuSheet;
  }
}
