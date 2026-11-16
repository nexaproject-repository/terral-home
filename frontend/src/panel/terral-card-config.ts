// Card settings sheet, used when adding a card (after choosing its type) and
// from the gear in every card's window. Live preview with the size on top,
// then "General" (device — or the alarm itself, Alarmo has no device — and
// name) and what each card type needs.
import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t, type StringKey } from "../i18n";
import { backIcon, checkIcon, chevronIcon, evChargerIcon, bulbIcon, searchIcon, shieldIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { isGroup } from "../light/light-model";
import {
  LOCK_DOMAINS,
  domainOf,
  guessInvert,
  isEnergySensor,
  isLockDomain,
  isPowerSensor,
  isStatusSensor,
  lockedRaw,
  resolveEntities,
  siblings,
} from "../charger/charger-model";
import { openConfirmSheet } from "./terral-confirm-sheet";
import { type ClimateConfig, fanModes, limits, modeName, modes as climateModes, rules as climateRules, swingSupported } from "../climate/climate-model";
import { modeIcon as climateIcon } from "../climate/climate-look";
import { lang } from "../i18n";
import { stepMinusIcon, stepPlusIcon, thermoIcon } from "../shared/icons";

export type CardType = "light" | "alarm" | "charger" | "climate" | "weather";
export interface CardDraft {
  type: CardType;
  config: Record<string, any>;
  w: 1 | 2;
  h: 1 | 2 | 4;
}
export interface CardConfigOptions {
  mode: "add" | "edit";
  onSave: (d: CardDraft) => void;
  onBack?: () => void;
  onRemove?: () => void;
}

const TAGS: Record<CardType, string> = { light: "terral-home-light", alarm: "terral-home-alarm", charger: "terral-home-charger", climate: "terral-home-climate", weather: "terral-home-weather" };
const TYPE_LABEL: Record<CardType, StringKey> = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate", weather: "type_weather" };
const SIZE_LABEL = (w: number, h: number) => (h === 4 ? "4/2" : h === 1 ? "1/1" : w === 2 ? "2/2" : "2/1");

type Sub = "device" | "entity" | "alarm" | "weather" | "lock" | "status_entity" | "power_entity" | "energy_entity";
type Dev = { id: string; name?: string | null; name_by_user?: string | null; area_id?: string | null; manufacturer?: string | null; model?: string | null };

const CHARGER_DEVICE = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;

@customElement("terral-card-config")
export class TerralCardConfig extends TerralSheet {
  @property({ attribute: false }) draft!: CardDraft;
  @property({ attribute: false }) options!: CardConfigOptions;
  @state() private _sub?: Sub;
  @state() private _q = "";
  @state() private _allDevices = false;
  private _preview?: HTMLElement & { hass?: HomeAssistant; setConfig(c: unknown): void; getTerralSizes?: () => { w: number; h: number }[] };

  protected get heading() {
    if (this._sub === "entity" && this.draft.type === "climate") return t(this.hass, "climate_entity");
    if (this._sub) return t(this.hass, ({ device: "ch_device", entity: "light_entity", alarm: "type_alarm", weather: "type_weather", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" } as const)[this._sub]);
    return this.options.mode === "edit" ? t(this.hass, "settings") : t(this.hass, TYPE_LABEL[this.draft.type]);
  }

  protected renderHeaderStart() {
    if (!this._sub && !(this.options.mode === "add" && this.options.onBack)) return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "back")} @click=${this._back}>${backIcon()}</button>`;
  }

  private _back = () => {
    if (this._sub) {
      this._sub = undefined;
      this._q = "";
      return;
    }
    this.close();
    this.options.onBack?.();
  };

  private _set(patch: Record<string, unknown>) {
    const config = { ...this.draft.config, ...patch };
    for (const k of Object.keys(config)) if (config[k] === undefined || config[k] === "") delete config[k];
    this.draft = { ...this.draft, config };
  }

  // ---- Registry helpers ------------------------------------------------------

  private get _devices(): Dev[] {
    return Object.values((this.hass.devices ?? {}) as Record<string, Dev>);
  }
  private _devName = (d: Dev) => d.name_by_user || d.name || d.id;
  private _entName = (id: string) => String(this.hass.states[id]?.attributes.friendly_name ?? id);
  private _area = (areaId?: string | null) => (areaId ? this.hass.areas?.[areaId]?.name : undefined) ?? t(this.hass, "other_area");
  private _visible = (id: string) => {
    const r = this.hass.entities?.[id] as { hidden?: boolean; entity_category?: string | null } | undefined;
    return !!this.hass.states[id] && !r?.hidden && !r?.entity_category;
  };
  private _entitiesOf(devId: string, test: (id: string) => boolean): string[] {
    return Object.entries(this.hass.entities ?? {})
      .filter(([id, r]) => (r as { device_id?: string | null }).device_id === devId && this._visible(id) && test(id))
      .map(([id]) => id)
      .sort((a, b) => this._entName(a).localeCompare(this._entName(b)));
  }
  private _deviceOf(id?: string): string | undefined {
    return id ? ((this.hass.entities?.[id] as { device_id?: string | null } | undefined)?.device_id ?? undefined) : undefined;
  }
  private _match(...texts: (string | null | undefined)[]) {
    const q = this._q.trim().toLowerCase();
    return !q || texts.some((x) => x?.toLowerCase().includes(q));
  }

  // ---- Preview -----------------------------------------------------------------

  private _sizes(): { w: number; h: number }[] {
    const s = this._preview?.getTerralSizes?.();
    return s?.length ? s : [{ w: 2, h: 2 }];
  }

  private _renderPreview(): TemplateResult {
    const { type, config, w, h } = this.draft;
    if (!config.entity) {
      return html`<div class="prev"><div class="pgrid"><div class="cell" style="grid-column:span 2;grid-row:span 2">
        <div class="ph">${type === "alarm" ? shieldIcon(26) : type === "charger" ? evChargerIcon(26) : bulbIcon(false, 26)}<span>${t(this.hass, type === "alarm" ? "pick_alarm" : "pick_device")}</span></div>
      </div></div></div>`;
    }
    if (!this._preview || this._preview.localName !== TAGS[type]) this._preview = document.createElement(TAGS[type]) as typeof this._preview;
    try {
      this._preview!.setConfig({ ...config, type: `custom:${TAGS[type]}`, view_layout: { terral: { w, h } } });
    } catch {
      /* incomplete config */
    }
    this._preview!.hass = this.hass;
    const sizes = this._sizes();
    return html`<div class="prev">
      <div class="pgrid"><div class="cell" style="grid-column:span ${w};grid-row:span ${h === 4 ? 4 : h}">${this._preview}</div></div>
      ${sizes.length > 1
        ? html`<div class="sizes">${sizes.map(
            (s) => html`<button class="sz ${s.w === w && s.h === h ? "on" : ""}" @click=${() => (this.draft = { ...this.draft, w: s.w as 1 | 2, h: s.h as 1 | 2 | 4 })}>${SIZE_LABEL(s.w, s.h)}</button>`,
          )}</div>`
        : nothing}
    </div>`;
  }

  // ---- Main page ---------------------------------------------------------------

  private _row(label: string, value: string, sub: Sub, small?: string) {
    return html`<button class="li" @click=${() => {
      this._sub = sub;
      this._q = "";
    }}>
      <span class="nm">${label}${small ? html`<small>${small}</small>` : nothing}</span>
      <span class="val">${value}${chevronIcon(false, 16)}</span>
    </button>`;
  }

  private _defaultName(): string {
    const c = this.draft.config;
    if (this.draft.type === "alarm") return t(this.hass, "alarm");
    const dev = c.device ? (this.hass.devices?.[c.device] as Dev | undefined) : undefined;
    return dev ? this._devName(dev) : c.entity ? this._entName(c.entity) : "";
  }

  private _main(): TemplateResult {
    const h = this.hass;
    const { type, config: c } = this.draft;
    const devId = c.device ?? this._deviceOf(c.entity);
    const dev = devId ? (h.devices?.[devId] as Dev | undefined) : undefined;
    const general = html`<section>
      <h3>${t(h, "general")}</h3>
      <div class="list">
        ${type === "weather"
          ? this._weathers().length > 1
            ? this._row(t(h, "type_weather"), c.entity ? this._entName(c.entity) : t(h, "choose"), "weather")
            : nothing
          : type === "alarm"
          ? this._alarms().length > 1
            ? this._row(t(h, "type_alarm"), c.entity ? this._entName(c.entity) : t(h, "choose"), "alarm")
            : nothing
          : this._row(t(h, "ch_device"), dev ? this._devName(dev) : c.entity ? this._entName(c.entity) : t(h, "choose"), "device")}
        <label class="li">
          <span class="nm">${t(h, "name_label")}</span>
          <input class="txt" .value=${c.name ?? ""} placeholder=${this._defaultName()} @input=${(ev: Event) => this._set({ name: (ev.target as HTMLInputElement).value })} />
        </label>
      </div>
    </section>`;

    let specific: unknown = nothing;
    if (type === "light" && c.entity) {
      const lights = devId ? this._entitiesOf(devId, (id) => id.startsWith("light.")) : [];
      specific = html`<section>
        <h3>${t(h, "type_light")}</h3>
        <div class="list">
          ${lights.length > 1 ? this._row(t(h, "light_entity"), this._entName(c.entity), "entity", c.entity) : nothing}
          <button class="li" role="switch" aria-checked=${c.use_light_color !== false} @click=${() => this._set({ use_light_color: c.use_light_color === false ? undefined : false })}>
            <span class="nm">${t(h, "use_light_color")}</span><span class="tog ${c.use_light_color !== false ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
    } else if (type === "weather" && c.entity) {
      const seg = (cur: unknown, opts: [unknown, string][], set: (v: unknown) => void) =>
        html`<span class="seg">${opts.map(([v, label]) => html`<button class=${cur === v ? "sel" : ""} @click=${() => set(v)}>${label}</button>`)}</span>`;
      specific = html`
        <section>
          <h3>${t(h, "card_section")}</h3>
          <div class="list">
            <div class="li"><span class="nm">${t(h, "forecast_22")}</span>${seg(c.forecast_2x2 ?? "hourly", [["hourly", t(h, "hours_word")], ["daily", t(h, "days_word")]], (v) => this._set({ forecast_2x2: v === "hourly" ? undefined : v }))}</div>
            <button class="li" role="switch" aria-checked=${c.animate !== false} @click=${() => this._set({ animate: c.animate === false ? undefined : false })}>
              <span class="nm">${t(h, "animate_fx")}</span><span class="tog ${c.animate !== false ? "on" : ""}"></span>
            </button>
          </div>
        </section>
        <section>
          <h3>${t(h, "window_section")}</h3>
          <div class="list">
            <button class="li" role="switch" aria-checked=${c.show_details !== false} @click=${() => this._set({ show_details: c.show_details === false ? undefined : false })}>
              <span class="nm">${t(h, "show_details")}<small>${t(h, "show_details_sub")}</small></span><span class="tog ${c.show_details !== false ? "on" : ""}"></span>
            </button>
            <div class="li"><span class="nm">${t(h, "forecast_days")}</span>${seg(c.forecast_days ?? 7, [[5, "5"], [7, "7"]], (v) => this._set({ forecast_days: v === 7 ? undefined : v }))}</div>
          </div>
        </section>`;
    } else if (type === "climate" && c.entity && h.states[c.entity]) {
      specific = this._climateSettings(devId);
    } else if (type === "charger" && c.entity) {
      const lockish = isLockDomain(c.entity);
      const a = t(h, lockish ? "raw_locked" : "raw_on");
      const b = t(h, lockish ? "raw_unlocked" : "raw_off");
      const activeIsLocked = lockedRaw(c.entity, !!c.invert) === "active";
      const L = t(h, "ch_locked");
      const U = t(h, "ch_unlocked");
      const auto = resolveEntities(h, { entity: c.entity });
      const dataVal = (k: "status_entity" | "power_entity" | "energy_entity", autoId?: string) =>
        c[k] === "none" ? t(h, "none") : c[k] ? this._entName(c[k]) : autoId ? `${t(h, "auto")} · ${this._entName(autoId)}` : t(h, "auto");
      specific = html`
        <section>
          <h3>${t(h, "ch_lock_section")}</h3>
          <div class="list">
            ${this._row(t(h, "ch_lock_entity"), this._entName(c.entity), "lock", c.entity)}
            <button class="li" role="switch" aria-checked=${!!c.invert} @click=${() => this._set({ invert: !c.invert || undefined })}>
              <span class="nm">${t(h, "ch_invert")}<small>${t(h, "ch_invert_sub", { a, b })}</small></span>
              <span class="tog ${c.invert ? "on" : ""}"></span>
            </button>
          </div>
        </section>
        <p class="explain">${t(h, "ch_explain", { a, la: activeIsLocked ? L : U, b, lb: activeIsLocked ? U : L, press: activeIsLocked ? a : b })}</p>
        <section>
          <h3>${t(h, "ch_data")}</h3>
          <div class="list">
            ${this._row(t(h, "ch_status"), dataVal("status_entity", auto.status), "status_entity")}
            ${this._row(t(h, "ch_power"), dataVal("power_entity", auto.power), "power_entity")}
            ${this._row(t(h, "ch_energy"), dataVal("energy_entity", auto.energy), "energy_entity")}
            <label class="li">
              <span class="nm">${t(h, "ch_max")}</span>
              <input class="num" type="number" inputmode="decimal" min="1" max="50" step="0.1" placeholder="7,4"
                .value=${c.max_power != null ? String(c.max_power) : ""}
                @change=${(ev: Event) => {
                  const n = parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
                  this._set({ max_power: Number.isFinite(n) && n > 0 ? n : undefined });
                }} />
            </label>
          </div>
        </section>`;
    }

    return html`
      <div class="scroll">
        ${general}
        ${specific}
        ${this.options.mode === "edit" && this.options.onRemove
          ? html`<button class="remove" @click=${() =>
              openConfirmSheet(h, {
                heading: t(h, "remove_card_q"),
                actions: [{ label: t(h, "remove_card"), danger: true, run: () => { this.close(); this.options.onRemove?.(); } }],
              })}>${t(h, "remove_card")}</button>`
          : nothing}
      </div>
      <button class="cta" ?disabled=${!c.entity} @click=${() => {
        this.options.onSave(this.draft);
        this.close();
      }}>${t(h, this.options.mode === "add" ? "add" : "save")}</button>
    `;
  }

  private _climateSettings(devId?: string) {
    const h = this.hass;
    const c = this.draft.config as ClimateConfig & Record<string, any>;
    const e = h.states[c.entity];
    const l = lang(h);
    const lim = limits(e, c);
    const fmt = (n: number) => n.toLocaleString(h.locale?.language ?? h.language ?? undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const ents = devId ? this._entitiesOf(devId, (id) => id.startsWith("climate.")) : [];
    const ms = climateModes(e);
    const hasFan = fanModes(e).length > 0;
    const canSwing = swingSupported(e);
    const setRule = (m: string, k: "t" | "f") => {
      const cur = climateRules(c, m);
      this._set({ mode_rules: { ...(c.mode_rules ?? {}), [m]: { ...cur, [k]: !cur[k] } } });
    };
    const bump = (k: "min_temp" | "max_temp", dir: 1 | -1) => {
      const cur = k === "min_temp" ? lim.min : lim.max;
      let v = Math.round((cur + dir * lim.step) / lim.step) * lim.step;
      v = k === "min_temp" ? Math.max(lim.hwMin, Math.min(lim.max - lim.step, v)) : Math.min(lim.hwMax, Math.max(lim.min + lim.step, v));
      const hw = k === "min_temp" ? lim.hwMin : lim.hwMax;
      this._set({ [k]: v === hw ? undefined : v });
    };
    const stepper = (k: "min_temp" | "max_temp") => html`<span class="mini">
      <button aria-label="−" @click=${() => bump(k, -1)}>${stepMinusIcon(16)}</button>
      <b>${fmt(k === "min_temp" ? lim.min : lim.max)}°</b>
      <button aria-label="+" @click=${() => bump(k, 1)}>${stepPlusIcon(16)}</button>
    </span>`;
    return html`
      ${ents.length > 1
        ? html`<section><h3>${t(h, "climate_entity")}</h3><div class="list">${this._row(t(h, "climate_entity"), this._entName(c.entity), "entity", c.entity)}</div></section>`
        : nothing}
      <section>
        <h3>${t(h, "temperature")}</h3>
        <div class="list">
          <div class="li"><span class="nm">${t(h, "min_temp_l")}<small>${t(h, "hw_min", { v: fmt(lim.hwMin) })}</small></span>${stepper("min_temp")}</div>
          <div class="li"><span class="nm">${t(h, "max_temp_l")}<small>${t(h, "hw_max", { v: fmt(lim.hwMax) })}</small></span>${stepper("max_temp")}</div>
          <div class="li"><span class="nm">${t(h, "temp_step_l")}</span>
            <span class="seg">${[0.5, 1].map((v) => html`<button class=${lim.step === v ? "sel" : ""} @click=${() => this._set({ temp_step: v })}>${fmt(v)}°</button>`)}</span>
          </div>
        </div>
      </section>
      ${ms.length
        ? html`<section>
            <h3>${t(h, "per_mode")}</h3>
            <div class="list">
              <table class="matrix">
                <tr><th>${t(h, "climate_mode")}</th><th>${t(h, "col_temp")}</th>${hasFan ? html`<th>${t(h, "col_fan")}</th>` : nothing}</tr>
                ${ms.map((m) => {
                  const r = climateRules(c, m);
                  return html`<tr>
                    <td><span class="mname">${climateIcon(m, 18)}${modeName(l, m)}</span></td>
                    <td><button class="ck ${r.t ? "on" : ""}" role="checkbox" aria-checked=${r.t} @click=${() => setRule(m, "t")}>${r.t ? checkIcon(15) : nothing}</button></td>
                    ${hasFan ? html`<td><button class="ck ${r.f ? "on" : ""}" role="checkbox" aria-checked=${r.f} @click=${() => setRule(m, "f")}>${r.f ? checkIcon(15) : nothing}</button></td>` : nothing}
                  </tr>`;
                })}
              </table>
            </div>
            ${c.mode_rules ? html`<button class="more" style="margin-top:8px" @click=${() => this._set({ mode_rules: undefined })}>${t(h, "reset_rules")}</button>` : nothing}
          </section>`
        : nothing}
      <section>
        <h3>${t(h, "window_section")}</h3>
        <div class="list">
          <button class="li" role="switch" aria-checked=${!!c.show_swing && canSwing} ?disabled=${!canSwing} style=${canSwing ? "" : "opacity:.5"} @click=${() => this._set({ show_swing: !c.show_swing || undefined })}>
            <span class="nm">${t(h, "show_swing")}<small>${t(h, canSwing ? "show_swing_sub" : "no_swing")}</small></span>
            <span class="tog ${c.show_swing && canSwing ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
  }

  // ---- Sub pages ---------------------------------------------------------------

  private _opt(label: string, small: string | undefined, selected: boolean, onPick: () => void, icon?: unknown) {
    return html`<button class="opt ${selected ? "sel" : ""}" @click=${() => {
      onPick();
      this._sub = undefined;
      this._q = "";
    }}>
      ${icon ? html`<span class="ic">${icon}</span>` : nothing}
      <span class="on">${label}${small ? html`<small>${small}</small>` : nothing}</span>
      <span class="ck">${checkIcon(18)}</span>
    </button>`;
  }

  private _group(title: string, items: TemplateResult[]) {
    if (!items.length) return nothing;
    return html`<section><h3>${title}</h3><div class="list">${items}</div></section>`;
  }

  private _byArea<T>(items: T[], areaOf: (x: T) => string | null | undefined, render: (x: T) => TemplateResult) {
    const map = new Map<string, T[]>();
    for (const it of items) {
      const a = this._area(areaOf(it));
      if (!map.has(a)) map.set(a, []);
      map.get(a)!.push(it);
    }
    return [...map].sort((a, b) => a[0].localeCompare(b[0])).map(([area, list]) => this._group(area, list.map(render)));
  }

  private _devicePage(): TemplateResult {
    const h = this.hass;
    const { type, config: c } = this.draft;
    const cur = c.device ?? this._deviceOf(c.entity);
    if (type === "light") {
      const devs = this._devices
        .map((d) => ({ d, lights: this._entitiesOf(d.id, (id) => id.startsWith("light.")) }))
        .filter((x) => x.lights.length && this._match(this._devName(x.d), ...x.lights.map(this._entName)))
        .sort((a, b) => this._devName(a.d).localeCompare(this._devName(b.d)));
      const loose = Object.keys(h.states).filter((id) => id.startsWith("light.") && this._visible(id) && !this._deviceOf(id) && this._match(this._entName(id), id));
      const groups = loose.filter((id) => isGroup(h.states[id]));
      const others = loose.filter((id) => !isGroup(h.states[id]));
      const pickEntity = (id: string) => this._set({ entity: id, device: undefined, name: this._entName(id) });
      return html`${this._search()}
        ${this._group(t(h, "light_groups"), groups.map((id) => this._opt(this._entName(id), t(h, "group"), c.entity === id, () => pickEntity(id), bulbIcon(false, 20))))}
        ${this._byArea(devs, (x) => x.d.area_id, (x) =>
          this._opt(this._devName(x.d), x.lights.length > 1 ? `${x.lights.length} ${t(h, "lights_word")}` : x.d.model ?? undefined, cur === x.d.id, () =>
            this._set({ device: x.d.id, entity: x.lights[0], name: this._devName(x.d) }), bulbIcon(false, 20)))}
        ${this._group(t(h, "other_lights"), others.map((id) => this._opt(this._entName(id), id, c.entity === id, () => pickEntity(id), bulbIcon(false, 20))))}`;
    }
    if (type === "climate") {
      const devs = this._devices
        .map((d) => ({ d, ents: this._entitiesOf(d.id, (id) => id.startsWith("climate.")) }))
        .filter((x) => x.ents.length && this._match(this._devName(x.d), ...x.ents.map(this._entName)))
        .sort((a, b) => this._devName(a.d).localeCompare(this._devName(b.d)));
      const loose = Object.keys(h.states).filter((id) => id.startsWith("climate.") && this._visible(id) && !this._deviceOf(id) && this._match(this._entName(id), id));
      return html`${this._search()}
        ${this._byArea(devs, (x) => x.d.area_id, (x) =>
          this._opt(this._devName(x.d), x.d.model ?? undefined, cur === x.d.id, () => this._set({ device: x.d.id, entity: x.ents[0], name: this._devName(x.d) }), thermoIcon(20)))}
        ${this._group(t(h, "other_climates"), loose.map((id) => this._opt(this._entName(id), id, c.entity === id, () => this._set({ entity: id, device: undefined, name: this._entName(id) }), thermoIcon(20))))}`;
    }
    // charger
    const devs = this._devices
      .map((d) => ({ d, locks: this._entitiesOf(d.id, (id) => LOCK_DOMAINS.includes(domainOf(id))) }))
      .filter((x) => x.locks.length);
    const chargerLike = (x: { d: Dev; locks: string[] }) => CHARGER_DEVICE.test([this._devName(x.d), x.d.manufacturer, x.d.model].join(" "));
    const shown = devs.filter((x) => (this._allDevices || chargerLike(x)) && this._match(this._devName(x.d), x.d.manufacturer, x.d.model));
    const best = (locks: string[]) =>
      locks.find((id) => /bloq|lock/i.test(id + this._entName(id))) ?? locks.find((id) => /paus|stop/i.test(id + this._entName(id))) ?? locks[0];
    const choose = (x: { d: Dev; locks: string[] }) => {
      const lock = best(x.locks);
      this._set({ device: x.d.id, entity: lock, invert: guessInvert(h, lock) || undefined, name: this._devName(x.d), status_entity: undefined, power_entity: undefined, energy_entity: undefined });
    };
    return html`${this._search()}
      ${this._byArea(shown, (x) => x.d.area_id, (x) =>
        this._opt(this._devName(x.d), x.locks.map(this._entName).join(" · "), cur === x.d.id, () => choose(x), evChargerIcon(20)))}
      ${!shown.length ? html`<p class="note">${t(h, "no_chargers_found")}</p>` : nothing}
      ${this._allDevices ? nothing : html`<button class="more" @click=${() => (this._allDevices = true)}>${t(h, "show_all_devices")}</button>`}`;
  }

  private _search() {
    return html`<label class="search">${searchIcon(16)}<input type="search" placeholder=${t(this.hass, "search_entities")} .value=${this._q}
      @input=${(ev: Event) => (this._q = (ev.target as HTMLInputElement).value)} /></label>`;
  }

  private _subPage(): TemplateResult {
    const h = this.hass;
    const { config: c } = this.draft;
    const sub = this._sub!;
    if (sub === "device") return html`<div class="scroll">${this._devicePage()}</div>`;
    if (sub === "weather") {
      const list = this._weathers();
      return html`<div class="scroll">${this._group(t(h, "type_weather"), list.map((id) =>
        this._opt(this._entName(id), id, c.entity === id, () => this._set({ entity: id }))))}</div>`;
    }
    if (sub === "alarm") {
      const list = Object.keys(h.states).filter((id) => id.startsWith("alarm_control_panel.") && this._visible(id));
      return html`<div class="scroll">${this._group(t(h, "type_alarm"), list.map((id) =>
        this._opt(this._entName(id), id, c.entity === id, () => this._set({ entity: id, name: c.name || undefined }), shieldIcon(20))))}
        ${!list.length ? html`<p class="note">${t(h, "no_alarms_found")}</p>` : nothing}</div>`;
    }
    const devId = c.device ?? this._deviceOf(c.entity);
    if (sub === "entity") {
      const dom = this.draft.type === "climate" ? "climate." : "light.";
      const list = devId ? this._entitiesOf(devId, (id) => id.startsWith(dom)) : [];
      return html`<div class="scroll">${this._group(t(h, "light_entity"), list.map((id) => this._opt(this._entName(id), id, c.entity === id, () => this._set({ entity: id }))))}</div>`;
    }
    if (sub === "lock") {
      const list = devId
        ? this._entitiesOf(devId, (id) => LOCK_DOMAINS.includes(domainOf(id)))
        : Object.keys(h.states).filter((id) => LOCK_DOMAINS.includes(domainOf(id)) && this._visible(id) && this._match(this._entName(id), id));
      return html`<div class="scroll">${devId ? nothing : this._search()}${this._group(t(h, "ch_lock_entity"), list.map((id) =>
        this._opt(this._entName(id), id, c.entity === id, () => this._set({ entity: id, invert: guessInvert(h, id) || undefined }))))}</div>`;
    }
    // data sensors
    const test = sub === "status_entity" ? (id: string) => isStatusSensor(h, id) : sub === "power_entity" ? (id: string) => isPowerSensor(h, id) : (id: string) => isEnergySensor(h, id);
    const same = new Set(c.entity ? siblings(h, c.entity) : []);
    const list = Object.keys(h.states)
      .filter((id) => this._visible(id) && test(id) && this._match(this._entName(id), id))
      .sort((a, b) => Number(same.has(b)) - Number(same.has(a)) || this._entName(a).localeCompare(this._entName(b)))
      .slice(0, 60);
    return html`<div class="scroll">${this._search()}
      <div class="list">
        ${this._opt(t(h, "auto"), undefined, !c[sub], () => this._set({ [sub]: undefined }))}
        ${this._opt(t(h, "none"), undefined, c[sub] === "none", () => this._set({ [sub]: "none" }))}
        ${list.map((id) => this._opt(this._entName(id), id, c[sub] === id, () => this._set({ [sub]: id })))}
      </div></div>`;
  }

  protected renderContent() {
    return this._sub ? this._subPage() : this._main();
  }

  /** Alarm panels in the house, Alarmo's first. */
  private _alarms(): string[] {
    const plat = (id: string) => (this.hass.entities?.[id] as { platform?: string } | undefined)?.platform;
    return Object.keys(this.hass.states)
      .filter((id) => id.startsWith("alarm_control_panel.") && this._visible(id))
      .sort((a, b) => Number(plat(b) === "alarmo") - Number(plat(a) === "alarmo"));
  }

  private _weathers(): string[] {
    return Object.keys(this.hass.states).filter((id) => id.startsWith("weather.") && this._visible(id)).sort();
  }

  protected willUpdate(): void {
    if (this.draft.type === "weather" && !this.draft.config.entity && this.hass) {
      const first = this._weathers()[0];
      if (first) this.draft = { ...this.draft, config: { ...this.draft.config, entity: first } };
    }
    if (this.draft.type === "alarm" && !this.draft.config.entity && this.hass) {
      const first = this._alarms()[0];
      if (first) this.draft = { ...this.draft, config: { ...this.draft.config, entity: first } };
    }
  }

  static styles = [
    TerralSheet.styles,
    css`
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 4px;
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
      .prev {
        flex: none;
        padding: 14px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      /* Same proportions as the home grid on a phone. */
      .pgrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 62px;
        gap: 10px;
        pointer-events: none;
      }
      .ph {
        height: 100%;
        border-radius: 22px;
        border: 2px dashed rgba(255, 255, 255, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
        box-sizing: border-box;
      }
      .sizes {
        display: flex;
        gap: 6px;
        justify-content: center;
      }
      .sz {
        height: 30px;
        padding: 0 12px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.1);
        font-size: 12.5px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.75);
      }
      .sz.on {
        background: #fff;
        color: #23233a;
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
      .li .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
      }
      .li .nm small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .val {
        max-width: 58%;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
      }
      input {
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
        color: rgba(255, 255, 255, 0.5);
      }
      input.txt {
        flex: 1;
        min-width: 0;
        text-align: right;
      }
      input.num {
        width: 80px;
        text-align: right;
        padding: 6px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.12);
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
      .explain {
        margin: 0;
        border-radius: 16px;
        padding: 12px 14px;
        background: rgba(52, 199, 123, 0.14);
        border: 1px solid rgba(52, 199, 123, 0.35);
        font-size: 14px;
        line-height: 1.5;
      }
      .note {
        margin: 0 4px;
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.6);
      }
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        padding: 0 12px;
        border-radius: 13px;
        background: rgba(255, 255, 255, 0.12);
        flex: none;
      }
      .search input {
        flex: 1;
        min-width: 0;
      }
      .opt {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 52px;
        box-sizing: border-box;
        font-size: 15px;
      }
      .opt + .opt {
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }
      .opt .on {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .opt small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.55);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .opt .ck {
        color: #34c77b;
        opacity: 0;
      }
      .opt.sel .ck {
        opacity: 1;
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
      .mini {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 2px;
      }
      .mini button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mini b {
        min-width: 52px;
        text-align: center;
        font-variant-numeric: tabular-nums;
        font-size: 15px;
      }
      .seg {
        display: flex;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 3px;
      }
      .seg button {
        height: 30px;
        padding: 0 14px;
        border-radius: 15px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
      .seg button.sel {
        background: #fff;
        color: #23233a;
      }
      .matrix {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      .matrix th {
        font-size: 11.5px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        padding: 10px 6px;
        text-align: center;
      }
      .matrix th:first-child,
      .matrix td:first-child {
        text-align: left;
        padding-left: 14px;
      }
      .matrix td {
        padding: 8px 6px;
        text-align: center;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .mname {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ck {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.35);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
      .ck.on {
        background: #34c77b;
        border-color: #34c77b;
      }
      .more,
      .remove {
        width: 100%;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        text-align: center;
        font-size: 14.5px;
        font-weight: 600;
      }
      .remove {
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
        opacity: 0.4;
      }
    `,
  ];
}

export function openCardConfig(hass: HomeAssistant, draft: CardDraft, options: CardConfigOptions) {
  document.querySelector("terral-card-config")?.remove();
  const el = document.createElement("terral-card-config");
  el.hass = hass;
  el.draft = { ...draft, config: { ...draft.config } };
  el.options = options;
  document.body.appendChild(el);
  return el;
}

/** For a card's gear: open its settings and report back through events the Terral panel listens to. */
export function openCardSettings(card: HTMLElement, hass: HomeAssistant, type: CardType, config: Record<string, any>) {
  const { type: _t, view_layout, ...rest } = config;
  const size = (view_layout as { terral?: { w?: number; h?: number } } | undefined)?.terral;
  openCardConfig(hass, { type, config: rest, w: (size?.w ?? 2) as 1 | 2, h: (size?.h ?? 2) as 1 | 2 | 4 }, {
    mode: "edit",
    onSave: (d) => card.dispatchEvent(new CustomEvent("terral-card-config", { detail: { config: d.config, size: { w: d.w, h: d.h } }, bubbles: true, composed: true, cancelable: true })),
    onRemove: () => card.dispatchEvent(new CustomEvent("terral-card-remove", { bubbles: true, composed: true })),
  });
}

/** Default draft when a card type is picked in "Añadir tarjeta". */
export function newDraft(type: CardType): CardDraft {
  return { type, config: {}, w: type === "light" ? 1 : 2, h: 2 };
  // Climate starts as 2/2 too; the corner gives 4/2 with the big dial.
}

export function updateCardConfig(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-card-config")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-card-config": TerralCardConfig;
  }
}
