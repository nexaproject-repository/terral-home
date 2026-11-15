// Charger window: current state, lock button, last 7 days and recent charges.
// The gear (top right) opens the settings: lock entity + invert, data sensors
// and maximum power. Every change is saved straight away.
import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { backIcon, boltIcon, checkIcon, chevronIcon, evChargerIcon, gearIcon, lockIcon, searchIcon, unlockIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { chargerView, statusText } from "./charger-look";
import {
  type ChargerConfig,
  type Session,
  LOCK_DOMAINS,
  domainOf,
  energyKwh,
  fmtDuration,
  fmtNum,
  isEnergySensor,
  isLockDomain,
  isPowerSensor,
  isStatusSensor,
  lockedRaw,
  looksLikeCharger,
  perDay,
  powerHistory,
  resolveEntities,
  sessionsFrom,
  setLocked,
  siblings,
} from "./charger-model";

type Field = "entity" | "status_entity" | "power_entity" | "energy_entity";

@customElement("terral-charger-dialog")
export class TerralChargerDialog extends TerralSheet {
  @property({ attribute: false }) config!: ChargerConfig;
  @property() name = "";
  @property() view: "main" | "settings" = "main";
  @property({ attribute: false }) onConfig?: (cfg: ChargerConfig) => boolean;
  @state() private _sessions?: Session[];
  @state() private _histError = false;
  @state() private _pick?: Field;
  @state() private _q = "";
  @state() private _localOnly = false;
  private _histFor?: string;

  protected get heading() {
    return this.view === "settings" ? t(this.hass, "settings") : this.name;
  }

  protected renderHeaderStart() {
    if (this.view !== "settings") return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "back")} @click=${() => (this.view = "main")}>${backIcon()}</button>`;
  }

  protected renderHeaderEnd() {
    if (this.view === "settings") return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "settings")} @click=${() => (this.view = "settings")}>${gearIcon(19)}</button>`;
  }

  protected updated(): void {
    if (this.view !== "main" || !this.hass) return;
    const power = resolveEntities(this.hass, this.config).power;
    if (power && power !== this._histFor) {
      this._histFor = power;
      this._load(power);
    }
  }

  private async _load(power: string) {
    try {
      const now = Date.now();
      const pts = await powerHistory(this.hass, power, new Date(now - 7 * 86_400_000));
      this._sessions = sessionsFrom(pts, now);
      this._histError = false;
    } catch {
      this._histError = true;
    }
  }

  private _save(patch: Partial<ChargerConfig>) {
    const cfg = { ...this.config, ...patch };
    for (const k of Object.keys(cfg) as (keyof ChargerConfig)[]) if (cfg[k] === undefined || cfg[k] === "") delete cfg[k];
    this.config = cfg;
    this._histFor = undefined;
    const stored = this.onConfig?.(cfg) ?? false;
    this._localOnly = !stored;
  }

  protected renderContent() {
    return this.view === "settings" ? this._settings() : this._main();
  }

  // ---- Main ---------------------------------------------------------------------

  private _main(): TemplateResult {
    const h = this.hass;
    const e = h.states[this.config.entity];
    if (!e) return html`<p>${t(h, "not_found")}</p>`;
    const v = chargerView(h, this.config);
    const kwh = energyKwh(h, v.ids.energy);
    const live = this._sessions?.find((s) => s.live);
    const sub =
      v.look === "charging" && kwh != null
        ? t(h, "this_charge", { kwh: `${fmtNum(h, kwh)} kWh`, time: live ? fmtDuration(Date.now() - live.start) : "" }).replace(/ · $/, "")
        : kwh != null
          ? `${t(h, "last_session")}: ${fmtNum(h, kwh)} kWh`
          : "";
    const days = this._sessions ? perDay(this._sessions, 7) : undefined;
    const max = days ? Math.max(...days.map((d) => d.kwh), 0.1) : 1;
    const week = days?.reduce((a, d) => a + d.kwh, 0) ?? 0;
    const weekCount = this._sessions?.length ?? 0;
    const recent = [...(this._sessions ?? [])].reverse().slice(0, 5);
    const loc = h.locale?.language ?? h.language ?? undefined;
    const dayLabel = (d: Date, i: number) => (i === 6 ? (loc?.startsWith("es") ? "Hoy" : "Today") : d.toLocaleDateString(loc, { weekday: "narrow" }));
    const when = (ts: number) => {
      const d = new Date(ts);
      const today = new Date();
      const yest = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      const time = d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
      const es = loc?.startsWith("es");
      if (d.toDateString() === today.toDateString()) return `${es ? "Hoy" : "Today"} · ${time}`;
      if (d.toDateString() === yest.toDateString()) return `${es ? "Ayer" : "Yesterday"} · ${time}`;
      const day = d.toLocaleDateString(loc, { weekday: "long", day: "numeric" });
      return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`;
    };

    return html`
      <div class="status ${v.tinted ? "on" : ""}" style=${v.style}>
        <button class="icon" aria-label=${v.locked ? t(h, "unlock") : t(h, "lock")} @click=${() => setLocked(h, e, !v.locked, !!this.config.invert)}>
          ${evChargerIcon(32)}${v.locked ? html`<span class="lk">${lockIcon(14)}</span>` : nothing}
        </button>
        <div class="txt"><strong>${statusText(h, v, false)}</strong>${sub ? html`<span>${sub}</span>` : nothing}</div>
      </div>
      ${v.look !== "unavailable"
        ? html`<button class="big ${v.locked ? "solid" : ""}" @click=${() => setLocked(h, e, !v.locked, !!this.config.invert)}>
            ${v.locked ? unlockIcon() : lockIcon()}<span>${v.locked ? t(h, "unlock") : t(h, "lock")}</span>
          </button>`
        : nothing}
      <div class="scroll">
        ${v.ids.power
          ? html`
              <section>
                <h3>${t(h, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError
                    ? html`<p class="empty">${t(h, "history_unavailable")}</p>`
                    : html`<div class="week">
                          ${(days ?? Array.from({ length: 7 }, (_, i) => ({ day: new Date(Date.now() - (6 - i) * 86_400_000), kwh: 0 }))).map(
                            (d, i) => html`<div>
                              <i class=${i === 6 ? "today" : d.kwh ? "" : "zero"} style="height:${d.kwh ? Math.max(6, (d.kwh / max) * 62) : 3}px"></i>
                              <span>${dayLabel(d.day, i)}</span>
                            </div>`,
                          )}
                        </div>
                        <div class="sum"><span>${t(h, "week_total")} <b>${fmtNum(h, week)} kWh</b></span><span>${weekCount} ${loc?.startsWith("es") ? (weekCount === 1 ? "carga" : "cargas") : weekCount === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${t(h, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? html`<p class="empty">…</p>` : nothing}
                  ${this._sessions && !recent.length ? html`<p class="empty">${t(h, "no_history")}</p>` : nothing}
                  ${recent.map(
                    (s) => html`<div class="sess">
                      <span class="dot">${boltIcon()}</span>
                      <span class="nm">
                        <span>${when(s.start)}${s.live ? html`<em>${t(h, "charging_now")}</em>` : nothing}</span>
                        <small>${s.live ? `${t(h, "in_progress")} · ` : ""}${fmtDuration(s.end - s.start)}${s.live ? "" : ` · ${t(h, "max_kw", { kw: `${fmtNum(h, s.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${fmtNum(h, s.kwh)} kWh</span>
                    </div>`,
                  )}
                </div>
              </section>`
          : nothing}
      </div>
    `;
  }

  // ---- Settings -----------------------------------------------------------------

  private _candidates(field: Field): string[] {
    const h = this.hass;
    const test: Record<Field, (id: string) => boolean> = {
      entity: (id) => LOCK_DOMAINS.includes(domainOf(id)),
      status_entity: (id) => isStatusSensor(h, id),
      power_entity: (id) => isPowerSensor(h, id),
      energy_entity: (id) => isEnergySensor(h, id),
    };
    const same = new Set(siblings(h, this.config.entity));
    const nameOf = (id: string) => String(h.states[id]?.attributes.friendly_name ?? id);
    const q = this._q.trim().toLowerCase();
    return Object.keys(h.states)
      .filter((id) => {
        const reg = h.entities?.[id] as { hidden?: boolean } | undefined;
        return !reg?.hidden && test[field](id);
      })
      .filter((id) => !q || id.toLowerCase().includes(q) || nameOf(id).toLowerCase().includes(q))
      .sort((a, b) => {
        const rank = (id: string) => (same.has(id) || id === this.config.entity ? 0 : looksLikeCharger(id, nameOf(id)) ? 1 : 2);
        return rank(a) - rank(b) || nameOf(a).localeCompare(nameOf(b));
      })
      .slice(0, 60);
  }

  private _picker(field: Field) {
    const h = this.hass;
    const list = this._candidates(field);
    const cur = this.config[field];
    const nameOf = (id: string) => String(h.states[id]?.attributes.friendly_name ?? id);
    const choose = (value?: string) => {
      this._save({ [field]: value } as Partial<ChargerConfig>);
      this._pick = undefined;
      this._q = "";
    };
    return html`<div class="picker">
      <label class="search">${searchIcon(16)}<input
        type="search"
        placeholder=${t(h, "search_entities")}
        .value=${this._q}
        @input=${(ev: Event) => (this._q = (ev.target as HTMLInputElement).value)}
      /></label>
      ${field !== "entity"
        ? html`<button class="opt ${!cur ? "sel" : ""}" @click=${() => choose(undefined)}><span>${t(h, "auto")}</span><span class="ck">${checkIcon(18)}</span></button>
            <button class="opt ${cur === "none" ? "sel" : ""}" @click=${() => choose("none")}><span>${t(h, "none")}</span><span class="ck">${checkIcon(18)}</span></button>`
        : nothing}
      ${list.map(
        (id) => html`<button class="opt ${cur === id ? "sel" : ""}" @click=${() => choose(id)}>
          <span>${nameOf(id)}<small>${id}</small></span><span class="ck">${checkIcon(18)}</span>
        </button>`,
      )}
    </div>`;
  }

  private _row(field: Field, label: string, auto?: string) {
    const h = this.hass;
    const cur = this.config[field];
    const shown = cur === "none" ? t(h, "none") : cur ? String(h.states[cur]?.attributes.friendly_name ?? cur) : auto ? `${t(h, "auto")} · ${h.states[auto]?.attributes.friendly_name ?? auto}` : t(h, "auto");
    const open = this._pick === field;
    return html`<button class="li" aria-expanded=${open} @click=${() => {
      this._pick = open ? undefined : field;
      this._q = "";
    }}>
      <span class="nm">${label}${field === "entity" && cur ? html`<small>${cur}</small>` : nothing}</span>
      <span class="val">${shown}${chevronIcon(open, 16)}</span>
    </button>
    ${open ? this._picker(field) : nothing}`;
  }

  private _settings(): TemplateResult {
    const h = this.hass;
    const id = this.config.entity;
    const lockish = isLockDomain(id);
    const a = t(h, lockish ? "raw_locked" : "raw_on");
    const b = t(h, lockish ? "raw_unlocked" : "raw_off");
    const activeIsLocked = lockedRaw(id, !!this.config.invert) === "active";
    const L = t(h, "ch_locked");
    const U = t(h, "ch_unlocked");
    const auto = resolveEntities(h, { entity: id });
    return html`<div class="scroll">
      <section>
        <h3>${t(h, "ch_lock_section")}</h3>
        <div class="list">
          ${this._row("entity", t(h, "ch_entity"))}
          <button class="li" role="switch" aria-checked=${!!this.config.invert} @click=${() => this._save({ invert: !this.config.invert })}>
            <span class="nm">${t(h, "ch_invert")}<small>${t(h, "ch_invert_sub", { a, b })}</small></span>
            <span class="tog ${this.config.invert ? "on" : ""}"></span>
          </button>
        </div>
      </section>
      <p class="explain">${t(h, "ch_explain", { a, la: activeIsLocked ? L : U, b, lb: activeIsLocked ? U : L, press: activeIsLocked ? a : b })}</p>
      <section>
        <h3>${t(h, "ch_data")}</h3>
        <div class="list">
          ${this._row("status_entity", t(h, "ch_status"), auto.status)}
          ${this._row("power_entity", t(h, "ch_power"), auto.power)}
          ${this._row("energy_entity", t(h, "ch_energy"), auto.energy)}
          <label class="li">
            <span class="nm">${t(h, "ch_max")}</span>
            <input
              class="num"
              type="number"
              inputmode="decimal"
              min="1"
              max="50"
              step="0.1"
              placeholder="7,4"
              .value=${this.config.max_power != null ? String(this.config.max_power) : ""}
              @change=${(ev: Event) => {
                const n = parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
                this._save({ max_power: Number.isFinite(n) && n > 0 ? n : undefined });
              }}
            />
          </label>
        </div>
      </section>
      ${this._localOnly ? html`<p class="note">${t(h, "save_local")}</p>` : nothing}
    </div>`;
  }

  static styles = [
    TerralSheet.styles,
    css`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
      }
      .status.on {
        background: var(--bg);
      }
      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        position: relative;
      }
      .status.on .icon {
        background: var(--accent);
      }
      .lk {
        position: absolute;
        right: -3px;
        bottom: -3px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: var(--lk, #3a3d4a);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .txt strong {
        font-size: 18px;
      }
      .txt span {
        font-size: 13.5px;
        color: var(--fg2);
      }
      .big {
        flex: none;
        height: 54px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 700;
      }
      .big.solid {
        background: #fff;
        color: #23233a;
      }
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
      .empty {
        margin: 0;
        padding: 16px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
      }
      .week {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 92px;
        padding: 12px 14px 8px;
        box-sizing: border-box;
      }
      .week div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
      }
      .week i {
        width: 100%;
        max-width: 26px;
        border-radius: 6px 6px 3px 3px;
        background: rgba(52, 199, 123, 0.75);
      }
      .week i.today {
        background: #34c77b;
      }
      .week i.zero {
        background: rgba(255, 255, 255, 0.18);
      }
      .week span {
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: capitalize;
      }
      .sum {
        display: flex;
        justify-content: space-between;
        padding: 0 14px 12px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }
      .sum b {
        color: #fff;
      }
      .sess {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
      }
      .sess + .sess {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .dot {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: #34c77b;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .sess .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
      }
      .sess .nm small {
        font-size: 12.5px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .sess em {
        font-style: normal;
        font-size: 11px;
        font-weight: 700;
        color: #34c77b;
        margin-left: 6px;
      }
      .kwh {
        font-size: 15px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
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
      .li + .li,
      .picker + .li,
      .li + .picker {
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
      }
      .val {
        max-width: 55%;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
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
      .picker {
        background: rgba(0, 0, 0, 0.12);
        max-height: 320px;
        overflow-y: auto;
        overscroll-behavior: contain;
      }
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 10px;
        height: 40px;
        padding: 0 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.12);
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
      input.num {
        flex: none;
        width: 80px;
        text-align: right;
        padding: 6px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.12);
      }
      .opt {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        min-height: 48px;
        box-sizing: border-box;
        font-size: 14.5px;
      }
      .opt + .opt {
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
      .opt small {
        display: block;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.55);
      }
      .opt .ck {
        margin-left: auto;
        color: #34c77b;
        opacity: 0;
      }
      .opt.sel .ck {
        opacity: 1;
      }
      .note {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
      }
    `,
  ];
}

export function openChargerDialog(
  hass: HomeAssistant,
  config: ChargerConfig,
  name: string,
  view: "main" | "settings",
  onConfig: (cfg: ChargerConfig) => boolean,
) {
  document.querySelector("terral-charger-dialog")?.remove();
  const el = document.createElement("terral-charger-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.name = name;
  el.view = view;
  el.onConfig = onConfig;
  document.body.appendChild(el);
  return el;
}

export function updateChargerDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-charger-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-charger-dialog": TerralChargerDialog;
  }
}
