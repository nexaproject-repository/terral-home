// Small confirmation sheet with a message and a list of actions.
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { TerralSheet } from "../shared/terral-sheet";

export interface ConfirmAction {
  label: string;
  sub?: string;
  danger?: boolean;
  run: () => void;
}

export interface ConfirmOptions {
  heading: string;
  message?: string;
  actions: ConfirmAction[];
}

@customElement("terral-confirm-sheet")
export class TerralConfirmSheet extends TerralSheet {
  @property({ attribute: false }) options: ConfirmOptions = { heading: "", actions: [] };

  protected get heading() {
    return this.options.heading;
  }

  protected renderContent() {
    return html`
      ${this.options.message ? html`<p class="msg">${this.options.message}</p>` : ""}
      <div class="list">
        ${this.options.actions.map(
          (a) => html`<button class="row ${a.danger ? "danger" : ""}" @click=${() => {
            a.run();
            this.close();
          }}><span>${a.label}</span>${a.sub ? html`<small>${a.sub}</small>` : ""}</button>`,
        )}
      </div>
      <button class="cancel" @click=${() => this.close()}>${t(this.hass, "cancel")}</button>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
      .msg {
        margin: -4px 0 4px;
        font-size: 15px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.8);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .row {
        width: 100%;
        min-height: 54px;
        padding: 10px 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 16px;
        font-weight: 600;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .row small {
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.65);
      }
      .row:active {
        background: rgba(255, 255, 255, 0.08);
      }
      .danger {
        color: #ff8a80;
      }
      .cancel {
        height: 52px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.12);
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    `,
  ];
}

export function openConfirmSheet(hass: HomeAssistant, options: ConfirmOptions) {
  const el = document.createElement("terral-confirm-sheet");
  el.hass = hass;
  el.options = options;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-confirm-sheet": TerralConfirmSheet;
  }
}
