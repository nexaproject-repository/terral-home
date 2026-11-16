// Switch window: state (the icon switches it, no extra button), today (timeline
// from 0 to 24 h, time on, consumption), the last 7 days (kWh, or hours
// on without a meter) and the log of every on / off with who did it. Every
// colour follows the card's. The gear opens the card settings.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { gearIcon, powerIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { guessIcon, switchIcon, switchTint } from "./switch-look";
import {
  type Cause,
  type SwitchConfig,
  type Usage,
  fmtKw,
  fmtKwh,
  fmtSpan,
  fmtTime,
  isOn,
  isUnavailable,
  loadCauses,
  loadUsage,
  meterOf,
  powerNow,
  toggle,
} from "./switch-model";

interface LogRow {
  t: number;
  on: boolean;
  ms?: number;
  kwh?: number | null;
  live?: boolean;
  cause?: Cause;
}

@customElement("terral-switch-dialog")
export class TerralSwitchDialog extends TerralSheet {
  @property({ attribute: false }) config!: SwitchConfig;
  @property() name = "";
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _usage?: Usage;
  @state() private _causes: { t: number; state?: string; cause: Cause }[] = [];
  @state() private _error = false;
  private _loadedFor = "";

  protected get heading() {
    return this.name;
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
    const e = this.hass?.states[this.config.entity];
    if (!e) return;
    const key = e.last_changed;
    if (key === this._loadedFor) return;
    this._loadedFor = key;
    const from = new Date(new Date().setHours(0, 0, 0, 0) - 6 * 86_400_000);
    loadUsage(this.hass, this.config, 7)
      .then((u) => {
        this._usage = u;
        this._error = false;
      })
      .catch(() => (this._error = true));
    // The logbook is optional: without it the log just has no "who".
    loadCauses(this.hass, this.config.entity, from).then((c) => (this._causes = c)).catch(() => undefined);
  }

  private _causeText(c?: Cause): string {
    const h = this.hass;
    if (!c) return "";
    if (c.kind === "automation") return t(h, "sw_by_automation", { n: c.name ?? "" });
    if (c.kind === "script") return t(h, "sw_by_script", { n: c.name ?? "" });
    if (c.kind === "you") return t(h, "sw_by_you");
    if (c.kind === "user") return t(h, "sw_by_ha");
    return "";
  }

  /** On / off rows, newest first, with the logbook cause matched by time. */
  private _log(): LogRow[] {
    const u = this._usage;
    if (!u) return [];
    const rows: LogRow[] = [];
    const causeAt = (tm: number, on: boolean) =>
      this._causes.find((c) => Math.abs(c.t - tm) < 5000 && (!c.state || (c.state === "on") === on))?.cause;
    for (const s of u.spans) {
      rows.push({ t: s.start, on: true, live: s.live, cause: causeAt(s.start, true) });
      if (!s.live) rows.push({ t: s.end, on: false, ms: s.end - s.start, kwh: u.kwhBetween(s.start, s.end), cause: causeAt(s.end, false) });
    }
    return rows.sort((a, b) => b.t - a.t).slice(0, 12);
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

  protected renderContent() {
    const h = this.hass;
    const c = this.config;
    const e = h.states[c.entity];
    if (!e) return html`<p class="empty">${t(h, "not_found")}</p>`;
    const on = isOn(e);
    const tint = switchTint(c.color);
    const icon = c.icon || guessIcon(`${this.name} ${c.entity}`);
    const m = meterOf(h, c);
    const kw = on ? powerNow(h, m.power) : null;
    const u = this._usage;
    const metered = !!(m.power || m.energy);
    const loc = h.locale?.language ?? h.language ?? undefined;
    const sinceMs = Date.now() - new Date(e.last_changed).getTime();
    const title = isUnavailable(e) ? t(h, "unavailable") : `${t(h, on ? "sw_on" : "sw_off")}${kw != null ? ` · ${fmtKw(h, kw)}` : ""}`;
    const sub = isUnavailable(e) ? "" : `${t(h, "sw_since_at", { t: fmtTime(h, e.last_changed) })} · ${fmtSpan(sinceMs)}`;

    const t0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const day = 86_400_000;
    const nowPct = ((Date.now() - t0) / day) * 100;
    const todaySpans = (u?.spans ?? []).filter((s) => s.end > t0);
    const timesToday = todaySpans.filter((s) => s.start >= t0).length + (todaySpans.some((s) => s.start < t0) ? 1 : 0);

    const days = u?.days ?? [];
    const vals = days.map((d) => (metered ? d.kwh ?? 0 : d.onMs / 3_600_000));
    const max = Math.max(...vals, metered ? 0.1 : 1);
    const weekKwh = days.reduce((a, d) => a + (d.kwh ?? 0), 0);
    const weekOn = days.reduce((a, d) => a + d.onMs, 0);
    const dayLabel = (d: Date, i: number) => (i === days.length - 1 ? t(h, "today") : d.toLocaleDateString(loc, { weekday: "narrow" }));
    const log = this._log();

    return html`
      <div class="status ${on ? "on" : ""}" style=${on ? `--bg:${tint.bg};--fg:${tint.fg};--fg2:${tint.fg2};--accent:${tint.accent}` : ""}>
        <button class="icon" aria-label=${on ? t(h, "turn_off") : t(h, "turn_on")} ?disabled=${isUnavailable(e)} @click=${() => toggle(h, e)}>
          ${switchIcon(icon, on, 32)}
        </button>
        <div class="txt"><strong>${title}</strong>${sub ? html`<span>${sub}</span>` : nothing}</div>
      </div>
      <div class="scroll" style="--accent:${tint.accent}">
        ${this._error ? html`<div class="list"><p class="empty">${t(h, "history_unavailable")}</p></div>` : nothing}
        <section>
          <h3>${t(h, "today")}</h3>
          <div class="list">
            <div class="tlw">
              <div class="tl">
                ${todaySpans.map((s) => {
                  const a = Math.max(0, (s.start - t0) / day) * 100;
                  const b = Math.min(100, ((s.end - t0) / day) * 100);
                  return html`<i style="left:${a}%;width:${Math.max(0.6, b - a)}%"></i>`;
                })}
                <b style="left:${nowPct}%"></b>
              </div>
              <div class="ticks"><span>0 h</span><span>6</span><span>12</span><span>18</span><span>24 h</span></div>
              <div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
                <div>${t(h, "sw_on_time")}<b>${u ? fmtSpan(u.onToday) : "…"}</b></div>
                ${metered
                  ? html`<div>${t(h, "sw_consumption")}<b>${u?.kwhToday != null ? fmtKwh(h, u.kwhToday) : "…"}</b></div>`
                  : html`<div>${t(h, "sw_times")}<b>${u ? timesToday : "…"}</b></div>`}
              </div>
            </div>
          </div>
        </section>
        <section>
          <h3>${t(h, metered ? "sw_week_kwh" : "sw_week_hours")}</h3>
          <div class="list">
            <div class="week">
              ${(days.length ? days : Array.from({ length: 7 }, (_, i) => ({ day: new Date(t0 - (6 - i) * day), kwh: 0, onMs: 0 }))).map((d, i) => {
                const v = vals[i] ?? 0;
                return html`<div>
                  <i class=${i === 6 ? "today" : v ? "" : "zero"} style="height:${v ? Math.max(6, (v / max) * 62) : 3}px"></i>
                  <span>${dayLabel(d.day, i)}</span>
                </div>`;
              })}
            </div>
            <div class="sum">
              <span>${t(h, "week_total")} <b>${u ? (metered ? fmtKwh(h, weekKwh) : fmtSpan(weekOn)) : "…"}</b></span>
              ${metered ? nothing : html`<span>${t(h, "sw_no_meter")}</span>`}
            </div>
          </div>
        </section>
        <section>
          <h3>${t(h, "sw_log")}</h3>
          <div class="list">
            ${!u && !this._error ? html`<p class="empty">…</p>` : nothing}
            ${u && !log.length ? html`<p class="empty">${t(h, "sw_no_log")}</p>` : nothing}
            ${log.map((r) => {
              const cause = this._causeText(r.cause);
              const what = r.on ? t(h, "sw_on") : `${t(h, "sw_off")} · ${t(h, "sw_lasted", { d: fmtSpan(r.ms ?? 0) })}`;
              const right = r.live ? t(h, "sw_running") : !r.on && r.kwh != null && metered ? fmtKwh(h, r.kwh) : !r.on && !metered ? fmtSpan(r.ms ?? 0) : "";
              return html`<div class="sess">
                <span class="dot ${r.on ? "on" : ""}">${powerIcon(16)}</span>
                <span class="nm"><span>${this._when(r.t)}</span><small>${what}${cause ? ` · ${cause}` : ""}</small></span>
                ${right ? html`<span class="kwh">${right}</span>` : nothing}
              </div>`;
            })}
          </div>
        </section>
      </div>
    `;
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
      .tlw {
        padding: 14px 14px 12px;
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
        background: var(--accent);
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
      .stats {
        display: grid;
        gap: 8px;
        margin-top: 12px;
      }
      .stats div {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.07);
        padding: 9px 10px;
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.65);
        min-width: 0;
      }
      .stats b {
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        background: color-mix(in srgb, var(--accent) 70%, transparent);
      }
      .week i.today {
        background: var(--accent);
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
        gap: 10px;
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
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .dot.on {
        background: var(--accent);
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
      .kwh {
        font-size: 15px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    `,
  ];
}

export function openSwitchDialog(hass: HomeAssistant, config: SwitchConfig, name: string, onSettings?: () => void) {
  document.querySelector("terral-switch-dialog")?.remove();
  const el = document.createElement("terral-switch-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.name = name;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

export function updateSwitchDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-switch-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-switch-dialog": TerralSwitchDialog;
  }
}
