// Card settings sheet, used when adding a card (after choosing its type) and
// from the gear in every card's window:
//   General — device (filtered per card type, by area) or, for the alarm and
//             the weather, the entity itself (they have no device), and name.
//   Per type — light entity / tint; charger lock switch, invert, data sensors,
//             max power; climate limits, steps, per-mode controls, swing;
//             weather forecast options; robot vacuum routines on the card;
//             switch colour, 2/2 view, icon and consumption sensors;
//             home energy view, main meter and consumers.
// The size is not chosen here: new cards get a default and the corner resizes.
// In "edit" mode it reports through terral-card-config / terral-card-remove
// events (see openCardSettings), which the Terral panel stores in the layout.
import { css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t, type StringKey } from "../i18n";
import { backIcon, bulbIcon, checkIcon, chevronIcon, evChargerIcon, plusIcon, searchIcon, shieldIcon } from "../shared/icons";
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
import { stepMinusIcon, stepPlusIcon, thermoIcon, vacuumIcon } from "../shared/icons";
import { deviceRoutines, isVacuumScript, routineName } from "../vacuum/vacuum-model";
import { routineIcon } from "../vacuum/vacuum-look";
import { SWITCH_COLORS, SWITCH_ICONS, guessIcon, switchIcon, switchTint } from "../switch/switch-look";
import { meterOf } from "../switch/switch-model";
import { CONSUMER_COLORS, type Consumer, consumerIcon, consumerName, guessTotal, isPower } from "../energy/energy-model";
import { ENERGY_ICONS, energyIcon, hexOf } from "../energy/energy-views";

export type CardType = "light" | "alarm" | "charger" | "climate" | "weather" | "vacuum" | "switch" | "energy";
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

const TYPE_LABEL: Record<CardType, StringKey> = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate", weather: "type_weather", vacuum: "type_vacuum", switch: "type_switch", energy: "type_energy" };

type Sub = "device" | "entity" | "alarm" | "weather" | "lock" | "status_entity" | "power_entity" | "energy_entity" | "total" | "consumer" | "consumer_entity";
type Dev = { id: string; name?: string | null; name_by_user?: string | null; area_id?: string | null; manufacturer?: string | null; model?: string | null };

const CHARGER_DEVICE = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;

@customElement("terral-card-config")
export class TerralCardConfig extends TerralSheet {
  @property({ attribute: false }) draft!: CardDraft;
  @property({ attribute: false }) options!: CardConfigOptions;
  @state() private _sub?: Sub;
  @state() private _q = "";
  @state() private _allDevices = false;
  /** Consumer being edited (energy card); equal to the list length while adding one. */
  @state() private _ci = 0;

  protected get heading() {
    if (this._sub === "entity" && this.draft.type === "climate") return t(this.hass, "climate_entity");
    if (this._sub === "entity" && this.draft.type === "switch") return t(this.hass, "sw_entity");
    if (this._sub === "total") return t(this.hass, "en_total");
    if (this._sub === "consumer") return t(this.hass, "en_consumer");
    if (this._sub === "consumer_entity") return t(this.hass, "en_sensor");
    if (this.draft.type === "switch" && this._sub === "power_entity") return t(this.hass, "sw_power");
    if (this.draft.type === "switch" && this._sub === "energy_entity") return t(this.hass, "sw_energy");
    if (this._sub) return t(this.hass, ({ device: "ch_device", entity: "light_entity", alarm: "type_alarm", weather: "type_weather", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" } as const)[this._sub]);
    return this.options.mode === "edit" ? t(this.hass, "settings") : t(this.hass, TYPE_LABEL[this.draft.type]);
  }

  protected renderHeaderStart() {
    if (!this._sub && !(this.options.mode === "add" && this.options.onBack)) return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "back")} @click=${this._back}>${backIcon()}</button>`;
  }

  private _back = () => {
    if (this._sub === "consumer_entity" && this._ci < (this.draft.config.consumers ?? []).length) {
      this._sub = "consumer";
      this._q = "";
      return;
    }
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
    if (this.draft.type === "energy") return t(this.hass, "en_title");
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
        ${type === "energy"
          ? this._row(t(h, "en_total"), c.sum_only ? t(h, "en_total_none") : c.entity ? this._entName(c.entity) : t(h, "choose"), "total", c.sum_only ? undefined : c.entity)
          : type === "weather"
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
    } else if (type === "vacuum" && c.entity && h.states[c.entity]) {
      specific = this._vacuumSettings();
    } else if (type === "switch" && c.entity) {
      specific = this._switchSettings(devId);
    } else if (type === "energy") {
      specific = this._energySettings();
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
      <button class="cta" ?disabled=${!c.entity || (type === "energy" && c.sum_only && !(c.consumers ?? []).length)} @click=${() => {
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

  /** Up to 3 routines for the 2/2 card, numbered in the order they were picked. */
  private _vacuumSettings() {
    const h = this.hass;
    const c = this.draft.config;
    const robot = c.name || this._entName(c.entity);
    const chosen: string[] = (c.routines ?? []).filter((id: string) => h.states[id]);
    const dev = deviceRoutines(h, c.entity);
    const scripts = Object.keys(h.states).filter((id) => (isVacuumScript(h, id) || chosen.includes(id)) && !dev.includes(id) && this._visible(id));
    const toggle = (id: string) => {
      const next = chosen.includes(id) ? chosen.filter((x) => x !== id) : chosen.length < 3 ? [...chosen, id] : chosen;
      this._set({ routines: next.length ? next : undefined });
    };
    const row = (id: string) => {
      const n = routineName(h, id, robot);
      const i = chosen.indexOf(id);
      const full = i < 0 && chosen.length >= 3;
      return html`<button class="li" role="checkbox" aria-checked=${i >= 0} ?disabled=${full} style=${full ? "opacity:.45" : ""} @click=${() => toggle(id)}>
        <span class="ic">${routineIcon(n, 18)}</span>
        <span class="nm">${n}${id.startsWith("script.") ? html`<small>${id}</small>` : nothing}</span>
        <span class="num ${i >= 0 ? "on" : ""}">${i >= 0 ? i + 1 : nothing}</span>
      </button>`;
    };
    return html`<section>
        <h3>${t(h, "vac_card_routines")}</h3>
        ${dev.length ? html`<div class="list">${dev.map(row)}</div>` : html`<p class="note">${t(h, "vac_no_routines")}</p>`}
        <p class="note" style="margin-top:8px">${t(h, "vac_card_routines_sub")}</p>
      </section>
      ${scripts.length ? html`<section><h3>${t(h, "vac_scripts")}</h3><div class="list">${scripts.map(row)}</div></section>` : nothing}`;
  }

  // ---- Home energy ----------------------------------------------------------------

  private get _consumers(): Consumer[] {
    return (this.draft.config.consumers ?? []) as Consumer[];
  }

  private _setConsumers(list: Consumer[]) {
    const c = this.draft.config;
    const patch: Record<string, unknown> = { consumers: list };
    // Without a main meter the card needs some entity: the first consumer's sensor.
    if (c.sum_only) patch.entity = list[0]?.entity ?? "none";
    this._set(patch);
  }

  private _thumb(v: "flow" | "ring" | "bars") {
    const cols = ["green", "blue", "amber"].map(hexOf);
    if (v === "flow")
      return html`<svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true"><path d="M32 9 C32 20, 12 18, 12 32" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3.5" stroke-linecap="round"/><path d="M32 9 L32 32" stroke="rgba(255,255,255,.3)" stroke-width="2.6"/><path d="M32 9 C32 20, 52 18, 52 32" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2"/><circle cx="32" cy="8" r="5.5" fill="rgba(255,255,255,.5)"/><circle cx="12" cy="35" r="6" fill=${cols[0]}/><circle cx="32" cy="35" r="6" fill=${cols[1]}/><circle cx="52" cy="35" r="6" fill=${cols[2]}/></svg>`;
    if (v === "ring")
      return html`<svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true"><g transform="rotate(-90 22 22)"><circle cx="22" cy="22" r="15" fill="none" stroke=${cols[0]} stroke-width="6" stroke-dasharray="55 40"/><circle cx="22" cy="22" r="15" fill="none" stroke=${cols[1]} stroke-width="6" stroke-dasharray="22 73" stroke-dashoffset="-58"/><circle cx="22" cy="22" r="15" fill="none" stroke=${cols[2]} stroke-width="6" stroke-dasharray="11 84" stroke-dashoffset="-83"/></g><rect x="44" y="9" width="14" height="4" rx="2" fill=${cols[0]}/><rect x="44" y="20" width="14" height="4" rx="2" fill=${cols[1]}/><rect x="44" y="31" width="14" height="4" rx="2" fill=${cols[2]}/></svg>`;
    return html`<svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true">${[40, 18, 9].map((w, i) => svg`<circle cx="7" cy=${9 + i * 13} r="4.5" fill=${cols[i]}/><rect x="16" y=${7 + i * 13} width="44" height="4.5" rx="2.2" fill="rgba(255,255,255,.15)"/><rect x="16" y=${7 + i * 13} width=${w} height="4.5" rx="2.2" fill=${cols[i]}/>`)}</svg>`;
  }

  /** Energy: view, consumers (each opens its own page), rest of the house and movement. */
  private _energySettings() {
    const h = this.hass;
    const c = this.draft.config;
    const view = c.view ?? "flow";
    const list = this._consumers;
    return html`
      <section>
        <h3>${t(h, "en_view")}</h3>
        <div class="list"><div class="views">
          ${(["flow", "ring", "bars"] as const).map((v) => html`<button class="vw ${view === v ? "sel" : ""}" aria-pressed=${view === v} @click=${() => this._set({ view: v === "flow" ? undefined : v })}>
            ${this._thumb(v)}${t(h, `en_view_${v}` as StringKey)}</button>`)}
        </div></div>
        <p class="note" style="margin-top:8px">${t(h, "en_view_note")}</p>
      </section>
      <section>
        <h3>${t(h, "en_consumers")}</h3>
        <div class="list">
          ${list.map((x, i) => {
            const name = consumerName(h, x);
            return html`<button class="li" @click=${() => {
              this._ci = i;
              this._sub = "consumer";
            }}>
              <span class="ic" style="background:${hexOf(x.color ?? CONSUMER_COLORS[i % CONSUMER_COLORS.length])}">${energyIcon(consumerIcon(x, name), 18)}</span>
              <span class="nm">${name}<small>${x.entity}</small></span>
              ${chevronIcon(false, 16)}
            </button>`;
          })}
          <button class="li" role="switch" aria-checked=${!c.sum_only && c.rest !== false} ?disabled=${!!c.sum_only} style=${c.sum_only ? "opacity:.5" : ""}
            @click=${() => this._set({ rest: c.rest === false ? undefined : false })}>
            <span class="ic" style="background:${hexOf("amber")}">${energyIcon("home", 18)}</span>
            <span class="nm">${t(h, "en_rest")}<small>${t(h, c.sum_only ? "en_rest_off" : "en_rest_sub")}</small></span>
            <span class="tog ${!c.sum_only && c.rest !== false ? "on" : ""}"></span>
          </button>
          <button class="li addc" @click=${() => {
            this._ci = list.length;
            this._sub = "consumer_entity";
            this._q = "";
          }}><span class="ic dash">${plusIcon(18)}</span><span class="nm">${t(h, "en_add")}</span></button>
        </div>
        <p class="note" style="margin-top:8px">${t(h, "en_consumers_note")}</p>
      </section>
      <section>
        <h3>${t(h, "window_section")}</h3>
        <div class="list">
          <button class="li" role="switch" aria-checked=${c.animate !== false} @click=${() => this._set({ animate: c.animate === false ? undefined : false })}>
            <span class="nm">${t(h, "en_animate")}<small>${t(h, "en_animate_sub")}</small></span><span class="tog ${c.animate !== false ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
  }

  /** One consumer: sensor, name, colour, icon, order, remove. */
  private _consumerPage() {
    const h = this.hass;
    const list = this._consumers;
    const i = this._ci;
    const x = list[i];
    if (!x) return html`<div class="scroll"></div>`;
    const name = consumerName(h, x);
    const color = x.color ?? CONSUMER_COLORS[i % CONSUMER_COLORS.length];
    const icon = consumerIcon(x, name);
    const upd = (patch: Partial<Consumer>) => {
      const next = list.map((y, k) => (k === i ? { ...y, ...patch } : y));
      for (const y of next) for (const key of Object.keys(y) as (keyof Consumer)[]) if (y[key] === undefined || y[key] === "") delete y[key];
      this._setConsumers(next);
    };
    const move = (d: -1 | 1) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      this._setConsumers(next);
      this._ci = j;
    };
    return html`<div class="scroll">
      <section>
        <div class="list">
          ${this._row(t(h, "en_sensor"), this._entName(x.entity), "consumer_entity", x.entity)}
          <label class="li"><span class="nm">${t(h, "name_label")}</span>
            <input class="txt" .value=${x.name ?? ""} placeholder=${String(h.states[x.entity]?.attributes.friendly_name ?? "")} @input=${(ev: Event) => upd({ name: (ev.target as HTMLInputElement).value })} /></label>
        </div>
      </section>
      <section>
        <h3>${t(h, "en_color")}</h3>
        <div class="list"><div class="sws">
          ${SWITCH_COLORS.map((col) => html`<button class="sw ${color === col.key ? "sel" : ""}" aria-label=${t(h, col.name)} @click=${() => upd({ color: col.key })}>
            <i style="background:${switchTint(col.key).bg}"><b style="background:${col.hex}">${color === col.key ? checkIcon(16) : nothing}</b></i><span>${t(h, col.name)}</span></button>`)}
        </div></div>
      </section>
      <section>
        <h3>${t(h, "sw_icon")}</h3>
        <div class="list"><div class="igrid">
          ${ENERGY_ICONS.map((k) => html`<button class="gi ${icon === k ? "sel" : ""}" aria-label=${k} @click=${() => upd({ icon: k })}>${energyIcon(k, 22)}</button>`)}
        </div></div>
      </section>
      <section>
        <div class="list">
          <button class="li" ?disabled=${i === 0} style=${i === 0 ? "opacity:.45" : ""} @click=${() => move(-1)}><span class="nm">${t(h, "en_move_up")}</span></button>
          <button class="li" ?disabled=${i === list.length - 1} style=${i === list.length - 1 ? "opacity:.45" : ""} @click=${() => move(1)}><span class="nm">${t(h, "en_move_down")}</span></button>
        </div>
      </section>
      <button class="remove" @click=${() => {
        this._setConsumers(list.filter((_, k) => k !== i));
        this._sub = undefined;
      }}>${t(h, "en_remove")}</button>
    </div>`;
  }

  /** Power sensors for the main meter or a consumer (the ones already used last). */
  private _powerList(): string[] {
    const h = this.hass;
    const used = new Set(this._consumers.map((x) => x.entity));
    return Object.keys(h.states)
      .filter((id) => isPower(h, id) && this._visible(id) && this._match(this._entName(id), id))
      .sort((a, b) => Number(used.has(a)) - Number(used.has(b)) || this._entName(a).localeCompare(this._entName(b)))
      .slice(0, 80);
  }

  /** Switch: colour (with a preview), 2/2 view, icon and consumption sensors. */
  private _switchSettings(devId?: string) {
    const h = this.hass;
    const c = this.draft.config;
    const name = c.name || this._defaultName();
    const icon = c.icon || guessIcon(`${name} ${c.entity}`);
    const tint = switchTint(c.color);
    const ents = devId ? this._entitiesOf(devId, (id) => /^(switch|input_boolean)\./.test(id)) : [];
    const auto = meterOf(h, { entity: c.entity });
    const dataVal = (k: "power_entity" | "energy_entity", autoId?: string) =>
      c[k] === "none" ? t(h, "none") : c[k] ? this._entName(c[k]) : autoId ? `${t(h, "auto")} · ${this._entName(autoId)}` : t(h, "auto");
    const style = c.style ?? "c";
    const styleRow = (v: "a" | "b" | "c") => html`<button class="opt ${style === v ? "sel" : ""}" @click=${() => this._set({ style: v === "c" ? undefined : v })}>
      <span class="on">${t(h, `sw_style_${v}` as StringKey)}<small>${t(h, `sw_style_${v}_sub` as StringKey)}</small></span>
      <span class="ck">${checkIcon(18)}</span>
    </button>`;
    return html`
      ${ents.length > 1
        ? html`<section><h3>${t(h, "sw_entity")}</h3><div class="list">${this._row(t(h, "sw_entity"), this._entName(c.entity), "entity", c.entity)}</div></section>`
        : nothing}
      <section>
        <h3>${t(h, "sw_color")}</h3>
        <div class="list">
          <div class="sws">
            ${SWITCH_COLORS.map((col) => {
              const sel = (c.color ?? "amber") === col.key;
              return html`<button class="sw ${sel ? "sel" : ""}" aria-label=${t(h, col.name)} aria-pressed=${sel} @click=${() => this._set({ color: col.key === "amber" ? undefined : col.key })}>
                <i style="background:${switchTint(col.key).bg}"><b style="background:${col.hex}">${sel ? checkIcon(16) : nothing}</b></i>
                <span>${t(h, col.name)}</span>
              </button>`;
            })}
          </div>
          <div class="prev">
            <span class="pc" style="background:${tint.bg};color:${tint.fg}"><i style="background:${tint.accent}">${switchIcon(icon, true, 20)}</i><span>${name}<small style="color:${tint.fg2}">${t(h, "sw_on")}</small></span></span>
            <span class="pc off"><i>${switchIcon(icon, false, 20)}</i><span>${name}<small>${t(h, "sw_off")}</small></span></span>
          </div>
        </div>
        <p class="note" style="margin-top:8px">${t(h, "sw_color_note")}</p>
      </section>
      <section>
        <h3>${t(h, "sw_style")}</h3>
        <div class="list">${styleRow("a")}${styleRow("b")}${styleRow("c")}</div>
      </section>
      <section>
        <h3>${t(h, "sw_icon")}</h3>
        <div class="list">
          <div class="igrid">
            ${SWITCH_ICONS.map((k) => html`<button class="gi ${icon === k ? "sel" : ""}" aria-label=${k} aria-pressed=${icon === k} @click=${() => this._set({ icon: k })}>${switchIcon(k, false, 22)}</button>`)}
          </div>
        </div>
      </section>
      <section>
        <h3>${t(h, "sw_meter")}</h3>
        <div class="list">
          ${this._row(t(h, "sw_power"), dataVal("power_entity", auto.power), "power_entity")}
          ${this._row(t(h, "sw_energy"), dataVal("energy_entity", auto.energy), "energy_entity")}
        </div>
        <p class="note" style="margin-top:8px">${t(h, "sw_meter_note")}</p>
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
    if (type === "vacuum") {
      const devs = this._devices
        .map((d) => ({ d, ents: this._entitiesOf(d.id, (id) => id.startsWith("vacuum.")) }))
        .filter((x) => x.ents.length && this._match(this._devName(x.d), ...x.ents.map(this._entName)))
        .sort((a, b) => this._devName(a.d).localeCompare(this._devName(b.d)));
      const loose = Object.keys(h.states).filter((id) => id.startsWith("vacuum.") && this._visible(id) && !this._deviceOf(id) && this._match(this._entName(id), id));
      return html`${this._search()}
        ${this._byArea(devs, (x) => x.d.area_id, (x) =>
          this._opt(this._devName(x.d), x.d.model ?? undefined, cur === x.d.id, () => this._set({ device: x.d.id, entity: x.ents[0], name: this._devName(x.d), routines: undefined }), vacuumIcon(20)))}
        ${this._group(t(h, "other_vacuums"), loose.map((id) => this._opt(this._entName(id), id, c.entity === id, () => this._set({ entity: id, device: undefined, name: this._entName(id), routines: undefined }), vacuumIcon(20))))}`;
    }
    if (type === "switch") {
      const isSw = (id: string) => /^(switch|input_boolean)\./.test(id);
      const devs = this._devices
        .map((d) => ({ d, ents: this._entitiesOf(d.id, isSw) }))
        .filter((x) => x.ents.length && this._match(this._devName(x.d), ...x.ents.map(this._entName)))
        .sort((a, b) => this._devName(a.d).localeCompare(this._devName(b.d)));
      const loose = Object.keys(h.states).filter((id) => isSw(id) && this._visible(id) && !this._deviceOf(id) && this._match(this._entName(id), id));
      const clear = { power_entity: undefined, energy_entity: undefined, icon: undefined };
      return html`${this._search()}
        ${this._byArea(devs, (x) => x.d.area_id, (x) =>
          this._opt(this._devName(x.d), x.ents.length > 1 ? x.ents.map(this._entName).join(" · ") : x.d.model ?? undefined, cur === x.d.id, () =>
            this._set({ device: x.d.id, entity: x.ents[0], name: this._devName(x.d), ...clear }), switchIcon(guessIcon(this._devName(x.d)), false, 20)))}
        ${this._group(t(h, "other_switches"), loose.map((id) => this._opt(this._entName(id), id, c.entity === id, () =>
          this._set({ entity: id, device: undefined, name: this._entName(id), ...clear }), switchIcon(guessIcon(this._entName(id)), false, 20))))}`;
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
    if (sub === "consumer") return this._consumerPage();
    if (sub === "total") {
      return html`<div class="scroll">${this._search()}
        <div class="list">
          ${this._opt(t(h, "en_total_none"), t(h, "en_total_none_sub"), !!c.sum_only, () =>
            this._set({ sum_only: true, entity: this._consumers[0]?.entity ?? "none" }))}
          ${this._powerList().map((id) => this._opt(this._entName(id), id, !c.sum_only && c.entity === id, () => this._set({ sum_only: undefined, entity: id })))}
        </div></div>`;
    }
    if (sub === "consumer_entity") {
      const i = this._ci;
      const list = this._consumers;
      return html`<div class="scroll">${this._search()}
        <div class="list">${this._powerList().filter((id) => c.sum_only || id !== c.entity).map((id) => this._opt(this._entName(id), id, list[i]?.entity === id, () => {
          if (i < list.length) this._setConsumers(list.map((y, k) => (k === i ? { ...y, entity: id } : y)));
          else this._setConsumers([...list, { entity: id, color: CONSUMER_COLORS[list.length % CONSUMER_COLORS.length] }]);
          queueMicrotask(() => (this._sub = "consumer"));
        }))}</div></div>`;
    }
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
      const test = this.draft.type === "switch" ? (id: string) => /^(switch|input_boolean)\./.test(id) : (id: string) => id.startsWith(dom);
      const list = devId ? this._entitiesOf(devId, test) : [];
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
    if (this.draft.type === "energy" && !this.draft.config.entity && this.hass) {
      const guess = guessTotal(this.hass);
      if (guess) this.draft = { ...this.draft, config: { ...this.draft.config, entity: guess } };
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
      .sws {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px 8px;
        padding: 14px 12px 12px;
      }
      .sw {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
      .sw i {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sw b {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .sw.sel i {
        box-shadow: 0 0 0 3px #fff;
      }
      .sw.sel span {
        color: #fff;
      }
      .prev {
        display: flex;
        gap: 12px;
        padding: 12px 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }
      .pc {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 16px;
        padding: 10px;
        font-size: 15px;
        font-weight: 600;
      }
      .pc > span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pc i {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .pc small {
        display: block;
        font-size: 12px;
        font-weight: 400;
      }
      .pc.off {
        background: rgba(255, 255, 255, 0.12);
      }
      .pc.off i {
        background: rgba(255, 255, 255, 0.18);
      }
      .pc.off small {
        color: rgba(255, 255, 255, 0.65);
      }
      .views {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        padding: 10px;
      }
      .vw {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px 6px 10px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        border: 2px solid transparent;
      }
      .vw.sel {
        background: rgba(255, 255, 255, 0.14);
        border-color: #fff;
        color: #fff;
      }
      .ic.dash {
        background: none;
        border: 2px dashed rgba(255, 255, 255, 0.45);
        box-sizing: border-box;
      }
      .addc .nm {
        font-weight: 600;
      }
      .li .ic {
        color: #fff;
      }
      .igrid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
        padding: 12px;
      }
      .gi {
        aspect-ratio: 1;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gi.sel {
        background: #fff;
        color: #23233a;
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
      .num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.35);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        flex: none;
      }
      .num.on {
        background: #fff;
        border-color: #fff;
        color: #23233a;
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
  return { type, config: type === "energy" ? { consumers: [] } : {}, w: type === "light" ? 1 : 2, h: type === "energy" ? 4 : 2 };
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
