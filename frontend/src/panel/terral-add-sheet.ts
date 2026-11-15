// "Añadir accesorio": pick an alarm, an EV charger, a light or a light group to add to the panel.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { areaOf, isGroup, isOn } from "../light/light-model";
import { looksLikeCharger } from "../charger/charger-model";
import { bulbIcon, checkIcon, evChargerIcon, searchIcon, shieldIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";

interface Row {
  id: string;
  name: string;
  area: string;
  group: boolean;
  on: boolean;
  alarm?: boolean;
  charger?: boolean;
}

@customElement("terral-add-sheet")
export class TerralAddSheet extends TerralSheet {
  @property({ attribute: false }) existing = new Set<string>();
  @property({ attribute: false }) onPick?: (entityId: string) => void;
  @state() private _q = "";
  /** Show every switch / lock as a possible charger. */
  @state() private _allChargers = false;

  protected get heading() {
    return t(this.hass, "add_accessory");
  }

  private _rows(): Row[] {
    const h = this.hass;
    const rows: Row[] = [];
    for (const [id, e] of Object.entries(h.states)) {
      const alarm = id.startsWith("alarm_control_panel.");
      const lockish = /^(switch|lock|input_boolean)\./.test(id);
      const fname = String(e.attributes.friendly_name ?? id);
      const charger = lockish && (this._allChargers || looksLikeCharger(id, fname));
      if (!alarm && !charger && !id.startsWith("light.")) continue;
      const reg = h.entities?.[id] as { hidden?: boolean; entity_category?: string | null } | undefined;
      if (reg?.hidden || reg?.entity_category) continue;
      rows.push({
        id,
        name: h.formatEntityName?.(e as HassEntity) || (e.attributes.friendly_name as string) || id,
        area: areaOf(h, id) ?? t(h, "other_area"),
        group: !alarm && !charger && isGroup(e),
        on: !alarm && !charger && isOn(e),
        alarm,
        charger,
      });
    }
    const q = this._q.trim().toLowerCase();
    return rows
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.area.toLowerCase().includes(q))
      .sort((a, b) => Number(b.group) - Number(a.group) || a.area.localeCompare(b.area) || a.name.localeCompare(b.name));
  }

  protected renderContent() {
    const rows = this._rows();
    const alarms = rows.filter((r) => r.alarm);
    const chargers = rows.filter((r) => r.charger);
    const groups = rows.filter((r) => r.group);
    const byArea = new Map<string, Row[]>();
    for (const r of rows.filter((r) => !r.group && !r.alarm && !r.charger)) {
      if (!byArea.has(r.area)) byArea.set(r.area, []);
      byArea.get(r.area)!.push(r);
    }
    return html`
      <label class="search">
        ${searchIcon()}
        <input
          type="search"
          placeholder=${t(this.hass, "search_lights")}
          .value=${this._q}
          @input=${(ev: Event) => (this._q = (ev.target as HTMLInputElement).value)}
        />
      </label>
      <div class="scroll">
        ${!rows.length ? html`<p class="empty">${t(this.hass, "no_lights")}</p>` : nothing}
        ${alarms.length ? this._section(t(this.hass, "security"), alarms) : nothing}
        ${chargers.length ? this._section(t(this.hass, "ev_charger"), chargers) : nothing}
        ${groups.length ? this._section(t(this.hass, "light_groups"), groups) : nothing}
        ${[...byArea].map(([area, list]) => this._section(area, list))}
        ${this._allChargers
          ? nothing
          : html`<button class="more" @click=${() => (this._allChargers = true)}>${evChargerIcon(18)}<span>${t(this.hass, "add_charger_other")}</span></button>`}
      </div>
    `;
  }

  private _section(title: string, rows: Row[]) {
    return html`<section>
      <h3>${title}</h3>
      <div class="list">
        ${rows.map((r) => {
          const added = this.existing.has(r.id);
          return html`<button class="row" ?disabled=${added} @click=${() => this._pick(r.id)}>
            <span class="ic ${r.on ? "on" : ""}">${r.alarm ? shieldIcon(20) : r.charger ? evChargerIcon(20) : bulbIcon(r.on, 20)}</span>
            <span class="nm">${r.name}${r.group ? html`<small>${t(this.hass, "group")}</small>` : nothing}</span>
            ${added ? html`<span class="added">${checkIcon(16)} ${t(this.hass, "added")}</span>` : nothing}
          </button>`;
        })}
      </div>
    </section>`;
  }

  private _pick(id: string) {
    this.onPick?.(id);
    this.close();
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
        min-height: 56px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .row:active:not(:disabled) {
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
      .ic.on {
        background: #f3b24a;
        color: #fff;
      }
      .nm {
        flex: 1;
        min-width: 0;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        flex-direction: column;
      }
      .nm small {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .added {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }
      .row:disabled .ic,
      .row:disabled .nm {
        opacity: 0.55;
      }
      .more {
        width: 100%;
        margin-top: 16px;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.85);
      }
      .empty {
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        margin: 30px 0;
      }
    `,
  ];
}

export function openAddSheet(hass: HomeAssistant, existing: Set<string>, onPick: (id: string) => void) {
  const el = document.createElement("terral-add-sheet");
  el.hass = hass;
  el.existing = existing;
  el.onPick = onPick;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-add-sheet": TerralAddSheet;
  }
}
