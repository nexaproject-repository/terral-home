// Page settings (gear on the active page pill in move mode) and "+ Página".
// A dashboard's first page is the layout itself; the others live in
// `layout.pages`. Each page has its own address (/<panel>/<page id>) so the
// back button works and a page can be opened directly.
//   Name       (the first page is called "Inicio" until renamed)
//   Position   before / after (not for the first page, which stays first)
//   Address    shown for links and automations
//   Delete     not the first page; its cards go to the first page or away
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { TerralSheet } from "../shared/terral-sheet";
import { openConfirmSheet } from "./terral-confirm-sheet";

export interface PageSheetOptions {
  mode: "create" | "edit";
  title: string;
  /** First page of the dashboard: can't move or be deleted. */
  first: boolean;
  /** 1-based position and number of pages (edit). */
  index?: number;
  count?: number;
  address?: string;
  cards?: number;
  homeTitle: string;
  onSave: (title: string) => void;
  onMove?: (dir: -1 | 1) => void;
  onDelete?: (keepCards: boolean) => void;
}

/** URL-safe id from a page name ("Salón y cocina" → "salon-y-cocina"). */
export function pageSlug(title: string, taken: string[]): string {
  const base =
    title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "pagina";
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`;
  return id;
}

@customElement("terral-page-sheet")
export class TerralPageSheet extends TerralSheet {
  @property({ attribute: false }) options!: PageSheetOptions;
  @state() private _title = "";
  @state() private _err?: string;

  connectedCallback(): void {
    super.connectedCallback();
    this._title = this.options.title;
  }

  protected get heading() {
    return t(this.hass, this.options.mode === "create" ? "page_new" : "page_settings");
  }

  private _save() {
    const v = this._title.trim();
    if (!v && !this.options.first) {
      this._err = t(this.hass, "dash_name_needed");
      return;
    }
    this.options.onSave(v);
    this.close();
  }

  protected renderContent() {
    const h = this.hass;
    const o = this.options;
    const edit = o.mode === "edit";
    return html`
      <div class="scroll">
        <section>
          <h3>${t(h, "general")}</h3>
          <div class="list">
            <label class="li">
              <span class="nm">${t(h, "name_label")}</span>
              <input class="txt" maxlength="30" .value=${this._title} placeholder=${o.first ? t(h, "page_home") : t(h, "page_name_ph")}
                @input=${(ev: Event) => {
                  this._title = (ev.target as HTMLInputElement).value;
                  this._err = undefined;
                }}
                @keydown=${(ev: KeyboardEvent) => ev.key === "Enter" && this._save()} />
            </label>
            ${edit && !o.first && o.index && o.count
              ? html`<div class="li">
                  <span class="nm">${t(h, "page_position")}<small>${t(h, "page_pos_of", { n: o.index, m: o.count })}</small></span>
                  <span class="seg">
                    <button ?disabled=${o.index <= 2} @click=${() => o.onMove?.(-1)}>${t(h, "page_before")}</button>
                    <button ?disabled=${o.index >= o.count} @click=${() => o.onMove?.(1)}>${t(h, "page_after")}</button>
                  </span>
                </div>`
              : nothing}
          </div>
          ${this._err ? html`<p class="err">${this._err}</p>` : nothing}
        </section>
        ${edit && o.address
          ? html`<section>
              <h3>${t(h, "page_address")}</h3>
              <div class="list"><div class="li"><span class="nm">${o.address}<small>${t(h, "page_address_sub")}</small></span></div></div>
            </section>`
          : nothing}
        ${edit && !o.first && o.onDelete
          ? html`<button class="remove" @click=${() => {
              const name = this._title || o.title;
              const del = (keep: boolean) => {
                this.close();
                o.onDelete?.(keep);
              };
              if (!o.cards) {
                del(false);
                return;
              }
              openConfirmSheet(h, {
                heading: t(h, "page_delete_q", { name }),
                message: t(h, "page_delete_msg", { n: o.cards }),
                actions: [
                  { label: t(h, "page_keep", { home: o.homeTitle }), sub: t(h, "page_keep_sub"), run: () => del(true) },
                  { label: t(h, "page_remove_all"), danger: true, run: () => del(false) },
                ],
              });
            }}>${t(h, "page_delete")}</button>`
          : nothing}
      </div>
      <button class="cta" @click=${() => this._save()}>${t(h, edit ? "save" : "page_create")}</button>
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
      }
      .li + .li {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .nm small {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
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
      input.txt::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      .seg {
        display: flex;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 3px;
        flex: none;
      }
      .seg button {
        height: 30px;
        padding: 0 12px;
        border-radius: 15px;
        font-size: 13.5px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.12);
      }
      .seg button:disabled {
        opacity: 0.35;
      }
      .err {
        margin: 8px 4px 0;
        font-size: 13.5px;
        color: #ff8a80;
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

export function openPageSheet(hass: HomeAssistant, options: PageSheetOptions) {
  document.querySelector("terral-page-sheet")?.remove();
  const el = document.createElement("terral-page-sheet");
  el.hass = hass;
  el.options = options;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-page-sheet": TerralPageSheet;
  }
}
