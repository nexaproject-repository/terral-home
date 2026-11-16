// Energy window: power now (in the card's view), today per hour stacked by
// consumer, each consumer today (kWh and share), and the last 7 days.
// The gear opens the card settings.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { gearIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { type EnergyConfig, type EnergyUsage, fmt1, live, loadEnergy } from "./energy-model";
import { energyStyles } from "./energy-style";
import { energyIcon, hexOf, view22 } from "./energy-views";

@customElement("terral-energy-dialog")
export class TerralEnergyDialog extends TerralSheet {
  @property({ attribute: false }) config!: EnergyConfig;
  @property() name = "";
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _usage?: EnergyUsage;
  @state() private _error = false;
  private _started = false;

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
    if (this._started || !this.hass) return;
    this._started = true;
    loadEnergy(this.hass, this.config, 7)
      .then((u) => (this._usage = u))
      .catch(() => (this._error = true));
  }

  protected renderContent() {
    const h = this.hass;
    const c = this.config;
    const lv = live(h, c, t(h, "en_rest"));
    const u = this._usage;
    const loc = h.locale?.language ?? h.language ?? undefined;
    const keys = lv.items.map((x) => x.key);
    const color = Object.fromEntries(lv.items.map((x) => [x.key, hexOf(x.color)]));
    const hourTot = Array.from({ length: 24 }, (_, i) => keys.reduce((a, k) => a + (u?.hourly[k]?.[i] ?? 0), 0));
    const hMax = Math.max(0.2, ...hourTot);
    const dayTot = (u?.days ?? []).map((d) => keys.reduce((a, k) => a + (d.kwh[k] ?? 0), 0));
    const dMax = Math.max(0.5, ...dayTot);
    const week = dayTot.reduce((a, v) => a + v, 0);
    const shares = keys.map((k) => ({ k, v: (u?.days ?? []).reduce((a, d) => a + (d.kwh[k] ?? 0), 0) }));
    const names = Object.fromEntries(lv.items.map((x) => [x.key, x.name]));
    return html`
      <div class="status">
        <span class="eic">${energyIcon("bolt", 30)}</span>
        <div class="stx"><strong>${fmt1(h, lv.total)} kW ${t(h, "en_now_l")}</strong>${u ? html`<span>${t(h, "today")} ${fmt1(h, u.todayTotal)} kWh</span>` : nothing}</div>
      </div>
      <div class="scroll">
        ${this._error ? html`<div class="list"><p class="empty">${t(h, "history_unavailable")}</p></div>` : nothing}
        <section>
          <h3>${t(h, "en_now")}</h3>
          <div class="list now">${view22({
            h, live: lv, view: c.view ?? "flow", animate: c.animate !== false, title: t(h, "en_consumption"),
            labels: { now: t(h, "en_now"), grid: t(h, "en_grid"), kwNow: t(h, "en_kw_now") },
          })}</div>
        </section>
        <section>
          <h3>${t(h, "en_today_hours")}</h3>
          <div class="list">
            <div class="hb">${hourTot.map((tot, i) => tot > 0.001
              ? html`<div>${keys.map((k) => {
                  const v = u?.hourly[k]?.[i] ?? 0;
                  return v > 0.001 ? html`<i style="height:${(v / hMax) * 72}px;background:${color[k]}"></i>` : nothing;
                })}</div>`
              : html`<div><i class="z"></i></div>`)}</div>
            <div class="ticks"><span>0 h</span><span>6</span><span>12</span><span>18</span><span>24 h</span></div>
          </div>
        </section>
        <section>
          <h3>${t(h, "en_by_consumer")}</h3>
          <div class="list">
            ${lv.items.map((x) => {
              const kwh = u?.today[x.key] ?? 0;
              const p = u && u.todayTotal > 0 ? Math.round((kwh / u.todayTotal) * 100) : 0;
              return html`<div class="row">
                <span class="ci" style="background:${hexOf(x.color)}">${energyIcon(x.icon, 18)}</span>
                <span class="nm">${x.name}<small>${fmt1(h, x.kw)} kW ${t(h, "en_now_l")}</small><span class="bar"><i style="width:${p}%;background:${hexOf(x.color)}"></i></span></span>
                <span class="v">${u ? `${fmt1(h, kwh)} kWh` : "…"}<small>${u ? `${p} %` : ""}</small></span>
              </div>`;
            })}
          </div>
        </section>
        <section>
          <h3>${t(h, "last_7_days")}</h3>
          <div class="list">
            <div class="wk">${(u?.days ?? Array.from({ length: 7 }, (_, i) => ({ day: new Date(Date.now() - (6 - i) * 86_400_000), kwh: {} as Record<string, number> }))).map((d, i, all) => html`<div>
              <span class="col">${keys.map((k) => ((d.kwh[k] ?? 0) > 0.001 ? html`<i style="height:${((d.kwh[k] ?? 0) / dMax) * 80}px;background:${color[k]}"></i>` : nothing))}</span>
              <span>${i === all.length - 1 ? t(h, "today") : d.day.toLocaleDateString(loc, { weekday: "narrow" })}</span>
            </div>`)}</div>
            <div class="sum"><span>${t(h, "week_total")} <b>${u ? `${fmt1(h, week)} kWh` : "…"}</b></span>
              <span>${u && week > 0 ? shares.filter((s) => s.v > 0).map((s) => `${names[s.k].split(" ")[0]} ${Math.round((s.v / week) * 100)} %`).join(" · ") : ""}</span></div>
          </div>
        </section>
      </div>
    `;
  }

  static styles = [
    TerralSheet.styles,
    energyStyles,
    css`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
        --fg2: rgba(255, 255, 255, 0.75);
      }
      .stx {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .stx strong {
        font-size: 18px;
      }
      .stx span {
        font-size: 13.5px;
        color: rgba(255, 255, 255, 0.75);
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.7);
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
      .list.now {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px 14px;
        height: 150px;
        box-sizing: border-box;
      }
      .empty {
        margin: 0;
        padding: 16px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
      }
      .hb {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 84px;
        padding: 12px 14px 4px;
      }
      .hb div {
        flex: 1;
        display: flex;
        flex-direction: column-reverse;
        gap: 1px;
        height: 100%;
      }
      .hb i {
        display: block;
        border-radius: 2px;
      }
      .hb .z {
        height: 3px;
        background: rgba(255, 255, 255, 0.14);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        padding: 0 14px 10px;
      }
      .row {
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
      .row .ci {
        width: 34px;
        height: 34px;
      }
      .row .nm {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
        min-width: 0;
      }
      .row .nm small {
        font-size: 12.5px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .row .bar {
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.12);
        margin-top: 5px;
        overflow: hidden;
      }
      .row .bar i {
        display: block;
        height: 100%;
        border-radius: 2px;
      }
      .row .v {
        font-size: 15px;
        font-weight: 700;
        text-align: right;
        white-space: nowrap;
      }
      .row .v small {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
      }
      .wk {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 110px;
        padding: 12px 14px 8px;
        box-sizing: border-box;
      }
      .wk > div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
      }
      .wk .col {
        width: 100%;
        max-width: 26px;
        display: flex;
        flex-direction: column-reverse;
        gap: 2px;
      }
      .wk .col i {
        display: block;
        border-radius: 3px;
      }
      .wk span {
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
    `,
  ];
}

export function openEnergyDialog(hass: HomeAssistant, config: EnergyConfig, name: string, onSettings?: () => void) {
  document.querySelector("terral-energy-dialog")?.remove();
  const el = document.createElement("terral-energy-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.name = name;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

export function updateEnergyDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-energy-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-energy-dialog": TerralEnergyDialog;
  }
}
