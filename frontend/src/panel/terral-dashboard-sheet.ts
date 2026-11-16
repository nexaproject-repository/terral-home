// Dashboard settings ("···" → Dashboard settings) and "New dashboard".
// Every Terral dashboard is its own entry in Home Assistant's sidebar, so on
// each device it can be chosen as the main dashboard from the HA profile.
//   Sidebar      name, icon, admins only (not for the first dashboard's name:
//                empty keeps "Terral Home")
//   Favourites   strip across every column on tablets and computers, on/off
//                and 1 row (1/1 cards) or 2 rows (1/1, 2/1 and 2/2)
//   Delete       every dashboard but the first one
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { TerralSheet } from "../shared/terral-sheet";
import { openConfirmSheet } from "./terral-confirm-sheet";

export interface DashboardInfo {
  id: string;
  title?: string;
  icon?: string;
  require_admin?: boolean;
}

export interface DashboardResult {
  title?: string;
  icon?: string;
  require_admin?: boolean;
  favorites: { enabled: boolean; rows: 1 | 2 };
}

export interface DashboardSheetOptions {
  mode: "edit" | "create";
  info: DashboardInfo;
  favorites: { enabled: boolean; rows: 1 | 2 };
  admin: boolean;
  onSave: (r: DashboardResult) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

/** Sidebar icons offered (Material Design Icons, as Home Assistant uses them). */
export const DASHBOARD_ICONS = [
  "mdi:home-roof",
  "mdi:home",
  "mdi:view-dashboard",
  "mdi:stairs-up",
  "mdi:stairs-down",
  "mdi:sofa",
  "mdi:bed",
  "mdi:silverware-fork-knife",
  "mdi:tablet",
  "mdi:cellphone",
  "mdi:monitor",
  "mdi:tree",
  "mdi:garage",
  "mdi:account-child",
  "mdi:shield-home",
  "mdi:lightbulb-group",
];

/** Navigate inside Home Assistant without reloading the page. */
export function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

@customElement("terral-dashboard-sheet")
export class TerralDashboardSheet extends TerralSheet {
  @property({ attribute: false }) options!: DashboardSheetOptions;
  @state() private _title = "";
  @state() private _icon = "";
  @state() private _admin = false;
  @state() private _favOn = true;
  @state() private _rows: 1 | 2 = 2;
  @state() private _busy = false;
  @state() private _err?: string;

  connectedCallback(): void {
    super.connectedCallback();
    const o = this.options;
    this._title = o.info.title ?? "";
    this._icon = o.info.icon ?? (o.mode === "create" ? "mdi:view-dashboard" : "");
    this._admin = !!o.info.require_admin;
    this._favOn = o.favorites.enabled;
    this._rows = o.favorites.rows;
  }

  protected get heading() {
    return t(this.hass, this.options.mode === "create" ? "dash_new" : "dash_settings");
  }

  private get _isHome() {
    return this.options.info.id === "home";
  }

  private async _save() {
    const create = this.options.mode === "create";
    if (create && !this._title.trim()) {
      this._err = t(this.hass, "dash_name_needed");
      return;
    }
    this._busy = true;
    try {
      await this.options.onSave({
        title: this._title.trim() || undefined,
        icon: this._icon || undefined,
        require_admin: this._admin,
        favorites: { enabled: this._favOn, rows: this._rows },
      });
      this.close();
    } catch (e) {
      this._err = (e as { message?: string })?.message ?? String(e);
    } finally {
      this._busy = false;
    }
  }

  protected renderContent() {
    const h = this.hass;
    const o = this.options;
    const create = o.mode === "create";
    const canEditMeta = o.admin;
    return html`
      <div class="scroll">
        <section>
          <h3>${t(h, "dash_sidebar")}</h3>
          <div class="list">
            <label class="li">
              <span class="nm">${t(h, "name_label")}</span>
              <input class="txt" maxlength="40" .value=${this._title} ?disabled=${!canEditMeta}
                placeholder=${this._isHome ? "Terral Home" : t(h, "dash_name_ph")}
                @input=${(ev: Event) => {
                  this._title = (ev.target as HTMLInputElement).value;
                  this._err = undefined;
                }} />
            </label>
            ${canEditMeta && !create
              ? html`<button class="li" role="switch" aria-checked=${this._admin} @click=${() => (this._admin = !this._admin)}>
                  <span class="nm">${t(h, "dash_admin")}<small>${t(h, "dash_admin_sub")}</small></span><span class="tog ${this._admin ? "on" : ""}"></span>
                </button>`
              : nothing}
          </div>
          ${canEditMeta
            ? html`<div class="icons">
                ${DASHBOARD_ICONS.map(
                  (i) => html`<button class="icon ${this._icon === i || (!this._icon && this._isHome && i === "mdi:home-roof") ? "sel" : ""}" aria-label=${i} @click=${() => (this._icon = i)}>
                    <ha-icon .icon=${i}></ha-icon>
                  </button>`,
                )}
              </div>`
            : nothing}
          <p class="note">${t(h, "dash_sidebar_note")}</p>
        </section>
        ${create
          ? nothing
          : html`<section>
              <h3>${t(h, "fav_title")}</h3>
              <div class="list">
                <button class="li" role="switch" aria-checked=${this._favOn} @click=${() => (this._favOn = !this._favOn)}>
                  <span class="nm">${t(h, "fav_strip")}<small>${t(h, "fav_strip_sub")}</small></span><span class="tog ${this._favOn ? "on" : ""}"></span>
                </button>
                <div class="li ${this._favOn ? "" : "dim"}">
                  <span class="nm">${t(h, "fav_rows")}<small>${t(h, "fav_rows_sub")}</small></span>
                  <span class="seg">${([1, 2] as const).map((n) => html`<button class=${this._rows === n ? "sel" : ""} ?disabled=${!this._favOn} @click=${() => (this._rows = n)}>${n}</button>`)}</span>
                </div>
              </div>
              <p class="note">${t(h, "fav_note")}</p>
            </section>`}
        ${this._err ? html`<p class="err">${this._err}</p>` : nothing}
        ${!create && o.onDelete && canEditMeta
          ? html`<button class="remove" @click=${() =>
              openConfirmSheet(h, {
                heading: t(h, "dash_delete_q", { name: this._title || this.options.info.id }),
                message: t(h, "dash_delete_msg"),
                actions: [{ label: t(h, "dash_delete"), danger: true, run: async () => { this.close(); await o.onDelete?.(); } }],
              })}>${t(h, "dash_delete")}</button>`
          : nothing}
      </div>
      <button class="cta" ?disabled=${this._busy} @click=${() => this._save()}>${t(h, create ? "dash_create" : "save")}</button>
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
      .li.dim {
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
      .icons {
        display: grid;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        gap: 6px;
        margin-top: 10px;
      }
      .icon {
        aspect-ratio: 1;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 22px;
      }
      .icon.sel {
        background: #fff;
        color: #23233a;
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
        min-width: 40px;
        padding: 0 12px;
        border-radius: 15px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
      .seg button.sel {
        background: #fff;
        color: #23233a;
      }
      .note {
        margin: 8px 4px 0;
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.6);
      }
      .err {
        margin: 0 4px;
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
      .cta:disabled {
        opacity: 0.5;
      }
    `,
  ];
}

export function openDashboardSheet(hass: HomeAssistant, options: DashboardSheetOptions) {
  document.querySelector("terral-dashboard-sheet")?.remove();
  const el = document.createElement("terral-dashboard-sheet");
  el.hass = hass;
  el.options = options;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-dashboard-sheet": TerralDashboardSheet;
  }
}
