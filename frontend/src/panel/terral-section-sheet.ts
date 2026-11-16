// Section settings, opened from the gear on a section title in move mode:
// name, which quick actions show on the right of the title (lights, climate;
// each with how many devices of the section it acts on) and "Remove section".
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { bulbIcon, thermoIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { type QuickKind, QUICK_KINDS, quickOf, quickState } from "./quick-actions";

export interface SectionSettings {
  title: string;
  quick: QuickKind[];
}

interface SectionLike {
  title: string;
  quick?: unknown;
  cards: { type: string; entity: string }[];
}

@customElement("terral-section-sheet")
export class TerralSectionSheet extends TerralSheet {
  @property({ attribute: false }) section!: SectionLike;
  @property({ attribute: false }) onSave?: (s: SectionSettings) => void;
  @property({ attribute: false }) onRemove?: () => void;
  @state() private _title = "";
  @state() private _quick: QuickKind[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this._title = this.section.title;
    this._quick = quickOf(this.section);
  }

  protected get heading() {
    return this._title || this.section.title;
  }

  private _toggle(k: QuickKind) {
    const on = this._quick.includes(k);
    this._quick = QUICK_KINDS.filter((x) => (x === k ? !on : this._quick.includes(x)));
  }

  protected renderContent() {
    const h = this.hass;
    const row = (k: QuickKind) => {
      const n = quickState(h, k, this.section.cards).ids.length;
      const on = this._quick.includes(k) && n > 0;
      return html`<button class="li" role="switch" aria-checked=${on} ?disabled=${!n} @click=${() => this._toggle(k)}>
        <span class="ic">${k === "lights" ? bulbIcon(false, 20) : thermoIcon(20)}</span>
        <span class="nm">${t(h, k === "lights" ? "quick_lights" : "quick_climate")}<small>${n ? t(h, k === "lights" ? "quick_lights_sub" : "quick_climate_sub", { n }) : t(h, "quick_none")}</small></span>
        <span class="tog ${on ? "on" : ""}"></span>
      </button>`;
    };
    return html`
      <div class="scroll">
        <section>
          <h3>${t(h, "general")}</h3>
          <div class="list">
            <label class="li"><span class="nm">${t(h, "name_label")}</span>
              <input class="txt" maxlength="40" .value=${this._title} @input=${(ev: Event) => (this._title = (ev.target as HTMLInputElement).value)} />
            </label>
          </div>
        </section>
        <section>
          <h3>${t(h, "quick_actions")}</h3>
          <div class="list">${QUICK_KINDS.map(row)}</div>
          <p class="note">${t(h, "quick_note")}</p>
        </section>
        ${this.onRemove ? html`<button class="remove" @click=${() => { this.close(); this.onRemove!(); }}>${t(h, "delete_section")}</button>` : nothing}
      </div>
      <button class="cta" @click=${() => {
        this.onSave?.({ title: this._title.trim() || this.section.title, quick: this._quick });
        this.close();
      }}>${t(h, "save")}</button>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
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
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
        text-align: left;
      }
      .li + .li {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .li:disabled {
        opacity: 0.45;
      }
      .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
      }
      .nm small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
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
      input.txt {
        flex: 1;
        min-width: 0;
        text-align: right;
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
        transition: background 0.2s;
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
      .note {
        margin: 8px 4px 0;
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.6);
      }
      .remove {
        width: 100%;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        text-align: center;
        font-size: 14.5px;
        font-weight: 600;
        color: #ff8a80;
      }
      .cta {
        flex: none;
        height: 54px;
        border-radius: 27px;
        background: #fff;
        color: #23233a;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        margin-top: 4px;
      }
    `,
  ];
}

export function openSectionSheet(hass: HomeAssistant, section: SectionLike, onSave: (s: SectionSettings) => void, onRemove?: () => void) {
  document.querySelector("terral-section-sheet")?.remove();
  const el = document.createElement("terral-section-sheet");
  el.hass = hass;
  el.section = section;
  el.onSave = onSave;
  el.onRemove = onRemove;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-section-sheet": TerralSectionSheet;
  }
}
