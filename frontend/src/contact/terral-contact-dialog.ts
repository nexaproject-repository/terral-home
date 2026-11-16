// Door / window window: state (open, ventilation, closed), today (timeline,
// openings, time open, longest), the openings of the last 7 days and the
// sensor's own data (temperature, vibration, tamper, battery, Z-Wave status).
// For a group card it first lists every sensor; tapping one shows its detail.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { backIcon, gearIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { type Usage, fmtTime, loadUsage } from "../switch/switch-model";
import {
  type ContactConfig,
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


@customElement("terral-contact-dialog")
export class TerralContactDialog extends TerralSheet {
  @property({ attribute: false }) config!: ContactConfig;
  /** Sensor shown; undefined = the group list. */
  @property() sensor?: string;
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _usage?: Usage;
  @state() private _error = false;
  private _loadedFor = "";

  private get _ids() {
    return [this.config.entity, ...(this.config.group ?? [])].filter((id, i, a) => a.indexOf(id) === i);
  }

  private _name(id: string) {
    const e = this.hass.states[id];
    if (id === this.config.entity && this.config.name && !(this.config.group ?? []).length) return this.config.name;
    return (e ? this.hass.formatEntityName?.(e) : undefined) || String(e?.attributes.friendly_name ?? id);
  }

  protected get heading() {
    return this.sensor ? this._name(this.sensor) : this.config.name || t(this.hass, "ct_group_title");
  }

  protected renderHeaderStart() {
    if (!this.sensor || !(this.config.group ?? []).length) return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "back")} @click=${() => {
      this.sensor = undefined;
      this._usage = undefined;
      this._loadedFor = "";
    }}>${backIcon()}</button>`;
  }

  protected renderHeaderEnd() {
    if (!this.onSettings) return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "settings")} @click=${() => {
      const go = this.onSettings!;
      this.close();
      go();
    }}>${gearIcon(19)}</button>`;
  }

  protected updated(): void {
    const id = this.sensor;
    if (!id || !this.hass) return;
    const key = `${id}|${this.hass.states[id]?.last_changed}`;
    if (key === this._loadedFor) return;
    this._loadedFor = key;
    loadUsage(this.hass, { entity: id, power_entity: "none", energy_entity: "none" }, 7)
      .then((u) => {
        this._usage = u;
        this._error = false;
      })
      .catch(() => (this._error = true));
  }

  protected renderContent() {
    return this.sensor ? this._detail(this.sensor) : this._list();
  }

  private _list() {
    const h = this.hass;
    const ids = this._ids.filter((id) => h.states[id]);
    const rank = (id: string) => ({ open: 0, vent: 1, tilt: 1, unavailable: 2, closed: 3 })[lookOf(h, this.config, id)];
    return html`<div class="scroll"><div class="list">
      ${[...ids].sort((a, b) => rank(a) - rank(b) || this._name(a).localeCompare(this._name(b))).map((id) => {
        const e = h.states[id];
        const lk = lookOf(h, this.config, id);
        return html`<button class="sess" @click=${() => (this.sensor = id)}>
          <span class="dot ${lk}">${lookIcon(kindOf(h, { entity: id, kind: id === this.config.entity ? this.config.kind : undefined }), lk, 17)}</span>
          <span class="nm"><span>${this._name(id)}</span><small>${this._stateLine(id)}</small></span>
          <span class="kwh">${lk === "open" ? fmtMins(minutesIn(e)) : lk === "vent" || lk === "tilt" ? lookWord(h, lk) : lk === "unavailable" ? "—" : contactIcon("check", 16)}</span>
        </button>`;
      })}
    </div></div>`;
  }

  private _stateLine(id: string) {
    const h = this.hass;
    const e = h.states[id];
    if (isUnavailable(e)) return t(h, "unavailable");
    const lk = lookOf(h, this.config, id);
    if (lk === "vent" || lk === "tilt") return lookWord(h, lk);
    return isOpen(e)
      ? `${t(h, "ct_open")} · ${t(h, "ct_ago", { t: fmtMins(minutesIn(e)) })}`
      : `${t(h, "ct_closed")} · ${t(h, "ct_since", { t: fmtTime(h, e!.last_changed) })}`;
  }

  private _when(ts: number) {
    const h = this.hass;
    const loc = h.locale?.language ?? h.language ?? undefined;
    const d = new Date(ts);
    const today = new Date();
    const yest = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const time = fmtTime(h, ts);
    if (d.toDateString() === today.toDateString()) return `${t(h, "today")} · ${time}`;
    if (d.toDateString() === yest.toDateString()) return `${t(h, "yesterday")} · ${time}`;
    const day = d.toLocaleDateString(loc, { weekday: "long", day: "numeric" });
    return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`;
  }

  private _detail(id: string) {
    const h = this.hass;
    const c = this.config;
    const e = h.states[id];
    if (!e) return html`<p class="empty">${t(h, "not_found")}</p>`;
    const open = isOpen(e);
    const lk = lookOf(h, c, id);
    const kind = kindOf(h, { entity: id, kind: id === c.entity ? c.kind : undefined });
    const p = parts(h, id);
    const u = this._usage;
    const t0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const day = 86_400_000;
    const todaySpans = (u?.spans ?? []).filter((s) => s.end > t0);
    const opensToday = todaySpans.filter((s) => s.start >= t0).length;
    const longest = todaySpans.reduce((a, s) => Math.max(a, Math.min(s.end, Date.now()) - Math.max(s.start, t0)), 0);
    const recent = [...(u?.spans ?? [])].reverse().slice(0, 10);
    const st = (x?: string) => (x ? h.states[x] : undefined);
    const row = (icon: string, label: string, sub: string, value: string, ok = false) => html`<div class="src">
      <span class="ci">${contactIcon(icon, 17)}</span><span class="nm">${label}${sub ? html`<small>${sub}</small>` : nothing}</span><span class="v ${ok ? "ok" : ""}">${value}</span></div>`;
    const tamper = st(p.tamper), vib = st(p.vibration), temp = st(p.temperature), bat = st(p.battery), node = st(p.node);
    const nodeTxt = node ? (node.state === "dead" ? t(h, "ct_node_dead") : t(h, "ct_node_ok")) : "";
    return html`
      <div class="status ${tintOf(lk) ? "on" : ""}" style=${tintOf(lk)}>
        <span class="icon">${lookIcon(kind, lk, 32)}</span>
        <div class="txt"><strong>${lookWord(h, lk)}</strong>
          <span>${isUnavailable(e) ? "" : `${t(h, "ct_since_at", { t: fmtTime(h, e.last_changed) })} · ${fmtMins((Date.now() - new Date(e.last_changed).getTime()) / 60_000)}`}</span></div>
      </div>
      <div class="scroll">
        ${this._error ? html`<div class="list"><p class="empty">${t(h, "history_unavailable")}</p></div>` : nothing}
        <section>
          <h3>${t(h, "today")}</h3>
          <div class="list">
            <div class="tlw">
              <div class="tl">${todaySpans.map((s) => {
                const a = Math.max(0, (s.start - t0) / day) * 100;
                const b = Math.min(100, ((s.end - t0) / day) * 100);
                return html`<i style="left:${a}%;width:${Math.max(0.6, b - a)}%"></i>`;
              })}<b style="left:${((Date.now() - t0) / day) * 100}%"></b></div>
              <div class="ticks"><span>0 h</span><span>6</span><span>12</span><span>18</span><span>24 h</span></div>
            </div>
            <div class="st3">
              <div>${t(h, "ct_openings")}<b>${u ? opensToday : "…"}</b></div>
              <div>${t(h, "ct_time_open")}<b>${u ? fmtMins(u.onToday / 60_000) : "…"}</b></div>
              <div>${t(h, "ct_longest")}<b>${u ? fmtMins(longest / 60_000) : "…"}</b></div>
            </div>
          </div>
        </section>
        <section>
          <h3>${t(h, "ct_openings")}</h3>
          <div class="list">
            ${!u && !this._error ? html`<p class="empty">…</p>` : nothing}
            ${u && !recent.length ? html`<p class="empty">${t(h, "ct_no_openings")}</p>` : nothing}
            ${recent.map((s) => html`<div class="sess">
              <span class="dot ${s.live ? "open" : ""}">${kindIcon(kind, s.live, 17)}</span>
              <span class="nm"><span>${this._when(s.start)}</span><small>${s.live ? t(h, "ct_open_now") : t(h, "ct_was_open", { t: fmtMins((s.end - s.start) / 60_000) })}</small></span>
              <span class="kwh">${fmtMins((Math.min(s.end, Date.now()) - s.start) / 60_000)}</span>
            </div>`)}
          </div>
        </section>
        ${temp || vib || tamper || bat || node
          ? html`<section>
              <h3>${t(h, "ct_sensor")}</h3>
              <div class="list">
                ${temp ? row("thermo", t(h, "temperature"), "", `${Number(temp.state).toLocaleString(h.locale?.language, { maximumFractionDigits: 1 })} °C`) : nothing}
                ${vib ? row("vibration", t(h, "ct_vibration"), t(h, "ct_vibration_sub"), t(h, vib.state === "on" ? "ct_detected" : "ct_still"), vib.state !== "on") : nothing}
                ${tamper ? row("shield", t(h, "ct_tamper"), t(h, "ct_tamper_sub"), t(h, tamper.state === "on" ? "ct_detected" : "ct_not_detected"), tamper.state !== "on") : nothing}
                ${bat ? row("battery", t(h, "battery"), "", bat.entity_id.startsWith("binary_sensor.") ? t(h, bat.state === "on" ? "ct_bat_low" : "ct_bat_ok") : `${Math.round(Number(bat.state))} %`) : nothing}
                ${node ? row("sleep", t(h, "ct_node"), t(h, "ct_node_sub", { s: node.state }), nodeTxt, node.state !== "dead") : nothing}
              </div>
            </section>`
          : nothing}
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
      }
      .status.on .icon {
        background: var(--accent);
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
      .warn {
        margin: 0;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 122, 47, 0.16);
        border: 1px solid rgba(255, 122, 47, 0.4);
        font-size: 13.5px;
        line-height: 1.45;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      .tlw {
        padding: 14px 14px 4px;
      }
      .tl {
        position: relative;
        height: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .tl i {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 8px;
        background: #ff7a2f;
      }
      .tl b {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 2px;
        background: #fff;
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 6px;
      }
      .st3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        padding: 10px 14px 14px;
      }
      .st3 div {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.07);
        padding: 9px 10px;
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.65);
        min-width: 0;
      }
      .st3 b {
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sess {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
        text-align: left;
      }
      .sess + .sess {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .dot {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .dot.open {
        background: #ff7a2f;
      }
      .dot.vent,
      .dot.tilt {
        background: #3b82f6;
      }
      .sess .nm,
      .src .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
      }
      .sess .nm small,
      .src .nm small {
        font-size: 12.5px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .kwh {
        font-size: 15px;
        font-weight: 700;
        white-space: nowrap;
      }
      .src {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
      }
      .src + .src {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .ci {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
      }
      .v {
        font-size: 14px;
        font-weight: 700;
        white-space: nowrap;
      }
      .v.ok {
        color: #5be39a;
      }
    `,
  ];
}

export function openContactDialog(hass: HomeAssistant, config: ContactConfig, sensor: string | undefined, onSettings?: () => void) {
  document.querySelector("terral-contact-dialog")?.remove();
  const el = document.createElement("terral-contact-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.sensor = sensor;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

export function updateContactDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-contact-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-contact-dialog": TerralContactDialog;
  }
}
