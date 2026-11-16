// Terral · Puertas y ventanas — a door / window / balcony door / garage contact
// sensor, or a group of them.
//   Closed: glass. Open: orange, with the icon swung open and the time.
//   Ventilation / tilted (recorded X / Y / Z positions, see the settings):
//   blue, even though the contact still reads closed.
//   Single sensor: 1/1, 2/1, 2/2 (today's open periods, temperature, battery).
//   Group (`group` in the settings): every size up to 4/2; the open ones first.
// A tap opens the window; a long press moves the card.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { t } from "../i18n";
import { openCardSettings } from "../panel/terral-card-config";
import { type Usage, fmtTime, todayUsage } from "../switch/switch-model";
import {
  type ContactConfig,
  type Look,
  contactIcon,
  fmtMins,
  isOpen,
  isUnavailable,
  kindIcon,
  kindOf,
  lookIcon,
  lookOf,
  lookWord,
  minutesIn,
  parts,
  tintOf,
} from "./contact-model";
import { openContactDialog, updateContactDialog } from "./terral-contact-dialog";

export type TerralContactCardConfig = LovelaceCardConfig & ContactConfig;
type Size = "s11" | "s21" | "s22" | "s42";

export const CONTACT_CARD_TAG = "terral-home-contact";

@customElement(CONTACT_CARD_TAG)
export class TerralContactCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralContactCardConfig;
  @state() private _size: Size = "s22";
  @state() private _usage?: Usage;

  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;
  private _tick?: number;
  private _loaded = "";

  setConfig(config: TerralContactCardConfig): void {
    if (!config?.entity) throw new Error("Terral · Puertas y ventanas: 'entity' must be a door / window sensor");
    this._config = config;
    this._loaded = "";
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.h === 4 ? "s42" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s42" ? 4 : this._size === "s11" ? 1 : 2;
  }

  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes() {
    const all = [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 },
    ];
    return this._isGroup ? all : all.slice(0, 3);
  }

  static getStubConfig(hass: HomeAssistant) {
    const id = Object.keys(hass?.states ?? {}).find((x) => x.startsWith("binary_sensor.") && ["door", "window"].includes(String(hass.states[x].attributes.device_class)));
    return { entity: id ?? "binary_sensor.door" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "binary_sensor" } } },
        { name: "name", selector: { text: {} } },
        { name: "kind", selector: { select: { mode: "dropdown", options: ["door", "window", "balcony", "garage"] } } },
        { name: "group", selector: { entity: { domain: "binary_sensor", multiple: true } } },
      ],
    };
  }

  private get _isGroup() {
    return (this._config?.group ?? []).length > 0;
  }

  private get _ids(): string[] {
    const c = this._config!;
    return [c.entity, ...(c.group ?? [])].filter((id, i, a) => a.indexOf(id) === i);
  }

  private _nameOf(id: string) {
    const c = this._config!;
    if (id === c.entity && c.name && !this._isGroup) return c.name;
    const e = this.hass?.states[id];
    return (e ? this.hass?.formatEntityName?.(e) : undefined) || String(e?.attributes.friendly_name ?? id);
  }

  // ---- Lifecycle -----------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    // The "open for …" time and the alert need a refresh while something is open.
    this._tick = window.setInterval(() => {
      if (this.hass && this._config && this._ids.some((id) => isOpen(this.hass!.states[id]))) this.requestUpdate();
    }, 30_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._tick);
    this._cancelHold();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this._config || !this.hass) return true;
    const p = parts(this.hass, this._config.entity);
    const axes = this._ids.flatMap((id) => {
      const q = id === this._config!.entity ? p : parts(this.hass!, id);
      return [q.x, q.y, q.z];
    });
    return [...this._ids, ...Object.values(p), ...axes].some((id) => id && old.states[id] !== this.hass!.states[id]);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) updateContactDialog(this.hass);
    const h = this.hass;
    const c = this._config;
    if (!h || !c || this._isGroup || this._size !== "s22") return;
    const key = `${h.states[c.entity]?.last_changed}`;
    if (key === this._loaded) return;
    this._loaded = key;
    todayUsage(h, { entity: c.entity, power_entity: "none", energy_entity: "none" }).then((u) => (this._usage = u)).catch(() => undefined);
  }

  // ---- Actions ---------------------------------------------------------------------

  private _openWindow(id?: string) {
    if (!this.hass || !this._config) return;
    openContactDialog(this.hass, this._config, id ?? (this._isGroup ? undefined : this._config.entity), () =>
      this.hass && this._config && openCardSettings(this, this.hass, "contact", this._config));
  }

  private _down = (ev: PointerEvent) => {
    this._held = false;
    this._holdStart = { x: ev.clientX, y: ev.clientY };
    clearTimeout(this._holdTimer);
    const startAt = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId };
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      const hold = new CustomEvent("terral-card-hold", { detail: startAt, bubbles: true, composed: true, cancelable: true });
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

  private _click = (ev: Event) => {
    if (this._held) {
      ev.stopPropagation();
      ev.preventDefault();
      this._held = false;
      return;
    }
    // A row of the group opens that sensor.
    for (const node of ev.composedPath()) {
      if (node === ev.currentTarget) break;
      if (node instanceof HTMLElement && node.dataset.id) return this._openWindow(node.dataset.id);
    }
    this._openWindow();
  };

  // ---- Render ------------------------------------------------------------------------

  private _stateText(id: string, short = false): string {
    const h = this.hass!;
    const e = h.states[id];
    if (isUnavailable(e)) return t(h, "unavailable");
    const look = lookOf(h, this._config!, id);
    const word = lookWord(h, look);
    if (short) return word;
    if (look === "open") return `${word} · ${t(h, "ct_ago", { t: fmtMins(minutesIn(e)) })}`;
    if (look === "closed") return `${word} · ${t(h, "ct_since", { t: fmtTime(h, e!.last_changed) })}`;
    return word;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    return this._isGroup ? this._group() : this._single();
  }

  private _wrap(cls: string, style: string, body: unknown, label: string) {
    return html`<div class="card ${this._size} ${cls}" style=${style} role="button" tabindex="0" aria-label=${label}
      @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._cancelHold} @pointercancel=${this._cancelHold} @pointerleave=${this._cancelHold}
      @click=${this._click}
      @keydown=${(ev: KeyboardEvent) => {
        if ((ev.key === "Enter" || ev.key === " ") && ev.target === ev.currentTarget) {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}>${body}</div>`;
  }

  private _single() {
    const h = this.hass!;
    const c = this._config!;
    const e = h.states[c.entity];
    if (!e) return html`<div class="card off missing"><span>${t(h, "not_found")}</span><small>${c.entity}</small></div>`;
    const look = lookOf(h, c);
    const open = isOpen(e);
    const kind = kindOf(h, c);
    const p = parts(h, c.entity);
    const style = tintOf(look);
    const size = this._size === "s42" ? "s22" : this._size;
    const icon = html`<span class="icon">${lookIcon(kind, look, size === "s11" ? 20 : 32)}</span>`;
    const name = this._nameOf(c.entity);
    const stateTxt = this._stateText(c.entity, size !== "s22");
    const text = html`<span class="txt"><span class="name">${name}</span><span class="state">${stateTxt}</span></span>`;
    let body: unknown = html`${icon}${text}`;
    if (size === "s22") {
      const u = this._usage;
      const t0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      const opens = u ? u.spans.filter((s) => s.start >= t0).length : undefined;
      const temp = c.show_temp !== false && p.temperature ? h.states[p.temperature] : undefined;
      const bat = c.show_battery !== false && p.battery ? h.states[p.battery] : undefined;
      const batTxt = bat ? (bat.entity_id.startsWith("binary_sensor.") ? t(h, bat.state === "on" ? "ct_bat_low" : "ct_bat_ok") : `${Math.round(Number(bat.state))} %`) : "";
      const chips = html`${temp && !isUnavailable(temp) ? html`<span class="chip">${contactIcon("thermo", 14)}${Number(temp.state).toLocaleString(h.locale?.language, { maximumFractionDigits: 1 })}°</span>` : nothing}
        ${bat && !isUnavailable(bat) ? html`<span class="chip">${contactIcon("battery", 14)}${batTxt}</span>` : nothing}
        ${opens != null ? html`<span class="chip">${t(h, opens === 1 ? "ct_opens_one" : "ct_opens", { n: opens })}</span>` : nothing}`;
      const day = 86_400_000;
      body = html`<div class="head">${icon}${text}</div>
        <div class="foot">
          ${open || (u && u.spans.some((s) => s.end > t0))
            ? html`<div class="tl">${(u?.spans ?? []).filter((s) => s.end > t0).map((s) => {
                const a = Math.max(0, (s.start - t0) / day) * 100;
                const b = Math.min(100, ((s.end - t0) / day) * 100);
                return html`<i style="left:${a}%;width:${Math.max(0.8, b - a)}%"></i>`;
              })}<b style="left:${((Date.now() - t0) / day) * 100}%"></b></div>`
            : nothing}
          <div class="chips">${chips}</div>
        </div>`;
    }
    return this._wrap(`${style ? "on" : "off"} ${look === "unavailable" ? "unavailable" : ""}`, style, body, `${name}: ${stateTxt}`);
  }

  private _group() {
    const h = this.hass!;
    const c = this._config!;
    const ids = this._ids.filter((id) => h.states[id]);
    const looks: Record<string, Look> = Object.fromEntries(ids.map((id) => [id, lookOf(h, c, id)]));
    const openIds = ids.filter((id) => looks[id] === "open");
    const ventIds = ids.filter((id) => looks[id] === "vent" || looks[id] === "tilt");
    const closedN = ids.length - openIds.length - ventIds.length;
    const top: Look = openIds.length ? "open" : ventIds.length ? "vent" : "closed";
    const style = tintOf(top);
    const title = c.name || t(h, "ct_group_title");
    const bits = [
      openIds.length ? t(h, openIds.length === 1 ? "ct_open_one" : "ct_open_n", { n: openIds.length }) : "",
      ventIds.length ? t(h, "ct_vent_n", { n: ventIds.length }) : "",
      closedN && (openIds.length || ventIds.length) ? t(h, closedN === 1 ? "ct_closed_one" : "ct_closed_n", { n: closedN }) : "",
    ].filter(Boolean);
    const sum = bits.length ? bits.join(" · ") : t(h, "ct_all_closed");
    const lead = openIds[0] ?? ventIds[0] ?? ids[0] ?? c.entity;
    const firstKind = kindOf(h, { entity: lead, kind: lead === c.entity ? c.kind : undefined });
    const size = this._size;
    const count = openIds.length || ventIds.length;
    const icon = html`<span class="icon">${lookIcon(firstKind, top, size === "s11" ? 20 : 32)}
      ${count ? html`<i class="cnt">${count}</i>` : nothing}</span>`;
    const text = html`<span class="txt"><span class="name">${title}</span><span class="state">${sum}</span></span>`;
    if (size === "s11" || size === "s21") return this._wrap(openIds.length ? "on" : "off", style, html`${icon}${text}`, `${title}: ${sum}`);
    const sorted = [...ids].sort((a, b) => {
      const r = (x: string) => (looks[x] === "open" ? 0 : looks[x] === "vent" || looks[x] === "tilt" ? 1 : looks[x] === "unavailable" ? 2 : 3);
      return r(a) - r(b) || this._nameOf(a).localeCompare(this._nameOf(b));
    });
    const max = size === "s42" ? 4 : 2;
    const shown = sorted.slice(0, sorted.length > max ? max - 1 : max);
    const rest = sorted.length - shown.length;
    return this._wrap(openIds.length ? "on" : "off", style, html`<div class="head">${icon}${text}</div>
      <div class="rows">
        ${shown.map((id) => {
          const lk = looks[id];
          const e = h.states[id];
          const right = lk === "open" ? fmtMins(minutesIn(e)) : lk === "vent" || lk === "tilt" ? lookWord(h, lk) : lk === "unavailable" ? "—" : "";
          return html`<button class="row ${lk}" data-id=${id}>
            <span class="ri">${lookIcon(kindOf(h, { entity: id, kind: id === c.entity ? c.kind : undefined }), lk, 18)}</span>
            <span class="rn">${this._nameOf(id)}<small>${this._stateText(id)}</small></span>
            <b>${right || contactIcon("check", 16)}</b>
          </button>`;
        })}
        ${rest > 0 ? html`<span class="more">+ ${rest} ${t(h, "more")}</span>` : nothing}
      </div>`, `${title}: ${sum}`);
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
      text-align: left;
    }
    svg {
      display: block;
      flex: none;
    }
    .card {
      box-sizing: border-box;
      height: 100%;
      min-height: 64px;
      border-radius: var(--ha-card-border-radius, 22px);
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      overflow: hidden;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      cursor: pointer;
      outline: none;
      transition: background 0.25s, color 0.25s;
      --fg: #fff;
      --fg2: rgba(255, 255, 255, 0.75);
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
    .unavailable {
      opacity: 0.55;
    }
    .missing {
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 13px;
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
    .bd {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #b3261e;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
    }
    .cnt {
      position: absolute;
      right: -4px;
      top: -4px;
      min-width: 22px;
      height: 22px;
      padding: 0 5px;
      box-sizing: border-box;
      border-radius: 11px;
      background: #fff;
      color: #3d1c10;
      font-size: 12px;
      font-weight: 700;
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .txt {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .s21 .txt {
      flex: none;
    }
    .s21 .icon {
      align-self: flex-start;
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s22 .name,
    .s42 .name {
      font-size: 17px;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s11 {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0 12px;
      gap: 10px;
      border-radius: 20px;
    }
    .s11 .icon {
      width: 40px;
      height: 40px;
    }
    .s11 .bd {
      width: 18px;
      height: 18px;
      right: -5px;
      bottom: -5px;
    }
    .s11 .cnt {
      min-width: 18px;
      height: 18px;
      font-size: 10.5px;
      right: -6px;
      top: -6px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .foot {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: none;
    }
    .tl {
      position: relative;
      height: 10px;
      border-radius: 5px;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      overflow: hidden;
    }
    .tl i {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 5px;
      background: var(--accent, rgba(255, 255, 255, 0.65));
    }
    .off .tl i {
      background: rgba(255, 255, 255, 0.65);
    }
    .tl b {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--fg);
      opacity: 0.7;
    }
    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      max-height: 28px;
      overflow: hidden;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 10px;
      border-radius: 14px;
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-height: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: 14px;
      min-width: 0;
    }
    .ri {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .row.open .ri {
      background: #ff7a2f;
      color: #fff;
    }
    .row.vent .ri,
    .row.tilt .ri {
      background: #3b82f6;
      color: #fff;
    }
    .row.open,
    .row.vent,
    .row.tilt {
      background: color-mix(in srgb, var(--fg) 6%, transparent);
    }
    .rn {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .rn small {
      font-size: 12px;
      font-weight: 400;
      color: var(--fg2);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row b {
      font-size: 13px;
      white-space: nowrap;
    }
    .more {
      margin: 2px 8px 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--fg2);
    }
  `;
}



declare global {
  interface HTMLElementTagNameMap {
    "terral-home-contact": TerralContactCard;
  }
}
