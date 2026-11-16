// Weather window: current weather on its sky, details (humidity, wind,
// pressure, clouds, dew point, rain today), next hours and next days.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { lang, t } from "../i18n";
import { gearIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { hasRain, hasSnow, sky, weatherIcon } from "./weather-look";
import {
  type ForecastItem,
  type WeatherConfig,
  conditionName,
  dayLabel,
  fmt,
  hourLabel,
  isNight,
  num,
  precipUnit,
  pressureUnit,
  rainToday,
  subscribeForecast,
  supports,
  todayRange,
  windUnit,
} from "./weather-model";

@customElement("terral-weather-dialog")
export class TerralWeatherDialog extends TerralSheet {
  @property({ attribute: false }) config!: WeatherConfig;
  @property() name = "";
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _hourly?: ForecastItem[];
  @state() private _daily?: ForecastItem[];
  private _unsubs: (() => void)[] = [];

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

  connectedCallback(): void {
    super.connectedCallback();
    const e = this.hass?.states[this.config.entity];
    if (!e) return;
    if (supports(e, "hourly")) this._unsubs.push(subscribeForecast(this.hass, e.entity_id, "hourly", (f) => (this._hourly = f)));
    if (supports(e, "daily")) this._unsubs.push(subscribeForecast(this.hass, e.entity_id, "daily", (f) => (this._daily = f)));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const u of this._unsubs) u();
    this._unsubs = [];
  }

  protected renderContent() {
    const h = this.hass;
    const e = h.states[this.config.entity];
    if (!e) return html`<p>${t(h, "not_found")}</p>`;
    const l = lang(h);
    const c = e.state;
    const night = isNight(h, e);
    const cur = num(e.attributes.temperature);
    const { hi, lo } = todayRange(this._daily);
    const deg = (v: number | null) => (v != null ? `${fmt(h, Math.round(v))}°` : "–");
    const animate = this.config.animate !== false;
    const details = this.config.show_details !== false;
    const hum = num(e.attributes.humidity);
    const wind = num(e.attributes.wind_speed);
    const bearing = num(e.attributes.wind_bearing);
    const pres = num(e.attributes.pressure);
    const cloud = num(e.attributes.cloud_coverage);
    const dew = num(e.attributes.dew_point);
    const rain = rainToday(this._hourly, this._daily);
    const tiles: [string, unknown][] = [];
    if (hum != null) tiles.push([t(h, "humidity"), `${fmt(h, hum)} %`]);
    if (wind != null)
      tiles.push([t(h, "wind"), html`${bearing != null ? html`<span class="arrow" style="transform:rotate(${bearing + 180}deg)">↑</span>` : nothing}${fmt(h, wind)} ${windUnit(e)}`]);
    if (pres != null) tiles.push([t(h, "pressure"), `${fmt(h, pres)} ${pressureUnit(e)}`]);
    if (cloud != null) tiles.push([t(h, "clouds"), `${fmt(h, cloud)} %`]);
    if (dew != null) tiles.push([t(h, "dew_point"), `${fmt(h, dew, 1)}°`]);
    if (rain != null) tiles.push([t(h, "rain_today"), `${fmt(h, rain, 1)} ${precipUnit(e)}`]);

    const days = (this._daily ?? []).slice(0, this.config.forecast_days ?? 7);
    const min = Math.min(...days.map((d) => num(d.templow) ?? num(d.temperature) ?? 0));
    const max = Math.max(...days.map((d) => num(d.temperature) ?? 0));
    const span = Math.max(1, max - min);
    const today = t(h, "today");

    return html`
      <div class="hero" style="background:${sky(c, night)}">
        ${animate && hasRain(c) ? html`<span class="rainfx"></span>` : animate && hasSnow(c) ? html`<span class="snowfx"></span>` : nothing}
        ${weatherIcon(c, 64, night)}
        <div class="htxt">
          <span class="temp">${deg(cur)}</span>
          <strong>${conditionName(l, c)}</strong>
          <span>${t(h, "max_short")} ${deg(hi)} · ${t(h, "min_short")} ${deg(lo)}</span>
        </div>
      </div>
      <div class="scroll">
        ${details && tiles.length ? html`<div class="tiles">${tiles.map(([k, v]) => html`<div class="tile"><small>${k}</small><b>${v}</b></div>`)}</div>` : nothing}
        ${this._hourly?.length
          ? html`<section>
              <h3>${t(h, "next_hours")}</h3>
              <div class="list"><div class="hscroll">
                ${this._hourly.slice(0, 24).map((f, i) => {
                  const p = num(f.precipitation);
                  return html`<div class="hour">
                    <span class="h">${i === 0 ? t(h, "now") : hourLabel(h, f.datetime)}</span>
                    ${weatherIcon(f.condition ?? "", 26, f.is_daytime === false)}
                    <span class="t">${deg(num(f.temperature))}</span>
                    <span class="p">${p ? `${fmt(h, p, 1)} ${precipUnit(e)}` : ""}</span>
                  </div>`;
                })}
              </div></div>
            </section>`
          : nothing}
        ${days.length
          ? html`<section>
              <h3>${t(h, "next_days")}</h3>
              <div class="list days">
                ${days.map((d) => {
                  const dlo = num(d.templow);
                  const dhi = num(d.temperature);
                  return html`<div class="day">
                    <span>${dayLabel(h, d.datetime, today)}</span>${weatherIcon(d.condition ?? "", 24)}
                    <span class="lo">${dlo != null ? deg(dlo) : ""}</span>
                    <span class="bar"><i style="left:${dlo != null ? ((dlo - min) / span) * 100 : 0}%;right:${dhi != null ? 100 - ((dhi - min) / span) * 100 : 0}%"></i></span>
                    <span>${deg(dhi)}</span>
                  </div>`;
                })}
              </div>
            </section>`
          : nothing}
      </div>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
      .hero {
        position: relative;
        overflow: hidden;
        flex: none;
        border-radius: 24px;
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 16px;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
      }
      .hero > * {
        position: relative;
      }
      .htxt {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .htxt .temp {
        font-size: 52px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.03em;
        font-variant-numeric: tabular-nums;
      }
      .htxt strong {
        font-size: 16px;
      }
      .htxt span:last-child {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.88);
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
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .tile {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }
      .tile small {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: rgba(255, 255, 255, 0.6);
      }
      .tile b {
        font-size: 16px;
        font-variant-numeric: tabular-nums;
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }
      .arrow {
        display: inline-block;
        font-size: 15px;
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .hscroll {
        display: flex;
        gap: 14px;
        overflow-x: auto;
        padding: 12px 14px;
        scrollbar-width: none;
        overscroll-behavior-x: contain;
      }
      .hour {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        min-width: 40px;
        font-size: 12px;
        font-weight: 600;
      }
      .hour .h {
        color: rgba(255, 255, 255, 0.7);
      }
      .hour .t {
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .hour .p {
        height: 12px;
        font-size: 10.5px;
        color: #8fd0ff;
        white-space: nowrap;
      }
      .days {
        padding: 6px 14px 10px;
      }
      .day {
        display: grid;
        grid-template-columns: 52px 28px 36px 1fr 36px;
        align-items: center;
        gap: 8px;
        height: 34px;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .day .lo {
        text-align: right;
        color: rgba(255, 255, 255, 0.7);
      }
      .bar {
        height: 5px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.18);
        position: relative;
      }
      .bar i {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 3px;
        background: linear-gradient(90deg, #7fd3ff, #ffd36b, #ff9a56);
      }
      .rainfx {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: repeating-linear-gradient(105deg, transparent 0 14px, rgba(255, 255, 255, 0.14) 14px 15px);
        background-size: 40px 40px;
        animation: rain 0.6s linear infinite;
      }
      @keyframes rain {
        to {
          background-position: -8px 40px;
        }
      }
      .snowfx {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.8;
        background-image: radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 52%), radial-gradient(2px 2px at 70% 60%, #fff 50%, transparent 52%);
        background-size: 120px 120px;
        animation: snow 6s linear infinite;
      }
      @keyframes snow {
        to {
          background-position: 0 120px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .rainfx,
        .snowfx {
          animation: none;
        }
      }
    `,
  ];
}

export function openWeatherDialog(hass: HomeAssistant, config: WeatherConfig, name: string, onSettings?: () => void) {
  document.querySelector("terral-weather-dialog")?.remove();
  const el = document.createElement("terral-weather-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.name = name;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

export function updateWeatherDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-weather-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-weather-dialog": TerralWeatherDialog;
  }
}
