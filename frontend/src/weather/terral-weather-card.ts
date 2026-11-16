// Terral · Weather card ("Cielo"): the card is the sky — a gradient that
// follows the weather and the time of day, with falling rain or snow.
//   1/1 icon + temperature · 2/1 big temperature · 2/2 + next 6 hours (or days)
//   4/2 + next 6 hours and 3 days. Tap = window; long press = move.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { lang, t } from "../i18n";
import { openCardSettings } from "../panel/terral-card-config";
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
  subscribeForecast,
  supports,
  todayRange,
} from "./weather-model";
import { openWeatherDialog, updateWeatherDialog } from "./terral-weather-dialog";

export type TerralWeatherCardConfig = LovelaceCardConfig & WeatherConfig;
type Size = "s11" | "s21" | "s22" | "s42";

export const WEATHER_CARD_TAG = "terral-home-weather";

@customElement(WEATHER_CARD_TAG)
export class TerralWeatherCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralWeatherCardConfig;
  @state() private _size: Size = "s22";
  @state() private _hourly?: ForecastItem[];
  @state() private _daily?: ForecastItem[];

  private _unsubs: (() => void)[] = [];
  private _subFor?: string;
  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;

  setConfig(config: TerralWeatherCardConfig): void {
    if (!config?.entity || !String(config.entity).startsWith("weather.")) {
      throw new Error("Terral · Tiempo: 'entity' must be a weather entity (weather.xxx)");
    }
    this._config = config;
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.h === 4 ? "s42" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s42" ? 4 : 2;
  }

  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 },
    ];
  }

  static getStubConfig(hass: HomeAssistant) {
    return { entity: Object.keys(hass?.states ?? {}).find((id) => id.startsWith("weather.")) ?? "weather.home" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
        { name: "name", selector: { text: {} } },
      ],
    };
  }

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  private get _name() {
    return this._config?.name || (this._entity?.attributes.friendly_name as string) || t(this.hass, "type_weather");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._subFor = undefined;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe();
    this._cancelHold();
  }

  private _unsubscribe() {
    for (const u of this._unsubs) u();
    this._unsubs = [];
    this._subFor = undefined;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    return !old || !this._config || old.states[this._config.entity] !== this._entity || old.states["sun.sun"] !== this.hass?.states["sun.sun"];
  }

  protected updated(changed: PropertyValues): void {
    if (!this.hass || !this._config) return;
    if (changed.has("hass")) updateWeatherDialog(this.hass);
    const e = this._entity;
    if (!e || !this.isConnected) return;
    if (this._subFor !== e.entity_id) {
      this._unsubscribe();
      this._subFor = e.entity_id;
      if (supports(e, "daily")) this._unsubs.push(subscribeForecast(this.hass, e.entity_id, "daily", (f) => (this._daily = f)));
      if (supports(e, "hourly") && this._size !== "s11") {
        this._unsubs.push(subscribeForecast(this.hass, e.entity_id, "hourly", (f) => (this._hourly = f)));
      }
    }
  }

  // ---- Interaction ----------------------------------------------------------------

  private _openWindow() {
    if (!this.hass || !this._config) return;
    openWeatherDialog(this.hass, this._config, this._name, () => this.hass && this._config && openCardSettings(this, this.hass, "weather", this._config));
  }

  private _down = (ev: PointerEvent) => {
    this._held = false;
    this._holdStart = { x: ev.clientX, y: ev.clientY };
    clearTimeout(this._holdTimer);
    const start = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId };
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      const hold = new CustomEvent("terral-card-hold", { detail: start, bubbles: true, composed: true, cancelable: true });
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
    this._openWindow();
  };

  // ---- Render ---------------------------------------------------------------------

  private _hoursRow(night: boolean) {
    const h = this.hass!;
    const useDays = this._config?.forecast_2x2 === "daily" && this._size === "s22";
    const list = useDays ? this._daily : this._hourly ?? this._daily;
    if (!list?.length) return html`<div class="hours empty"></div>`;
    const isDaily = useDays || !this._hourly;
    const today = t(h, "today");
    return html`<div class="hours">
      ${list.slice(0, 6).map((f, i) => {
        const label = isDaily ? dayLabel(h, f.datetime, today) : i === 0 ? t(h, "now") : hourLabel(h, f.datetime);
        const n = !isDaily && f.is_daytime === false ? true : !isDaily && i === 0 ? night : false;
        const tmp = num(f.temperature);
        return html`<div class="hour"><span class="h">${label}</span>${weatherIcon(f.condition ?? "", 22, n)}<span class="t">${tmp != null ? `${fmt(h, tmp)}°` : "–"}</span></div>`;
      })}
    </div>`;
  }

  private _daysList(n: number) {
    const h = this.hass!;
    const days = this._daily?.slice(0, n) ?? [];
    if (!days.length) return nothing;
    const all = this._daily!.slice(0, 7);
    const min = Math.min(...all.map((d) => num(d.templow) ?? num(d.temperature) ?? 0));
    const max = Math.max(...all.map((d) => num(d.temperature) ?? 0));
    const span = Math.max(1, max - min);
    const today = t(h, "today");
    return html`<div class="days">
      ${days.map((d) => {
        const lo = num(d.templow);
        const hi = num(d.temperature);
        const left = lo != null ? ((lo - min) / span) * 100 : 0;
        const right = hi != null ? 100 - ((hi - min) / span) * 100 : 0;
        return html`<div class="day">
          <span>${dayLabel(h, d.datetime, today)}</span>${weatherIcon(d.condition ?? "", 22)}
          <span class="lo">${lo != null ? `${fmt(h, lo)}°` : ""}</span>
          <span class="bar"><i style="left:${left}%;right:${right}%"></i></span>
          <span>${hi != null ? `${fmt(h, hi)}°` : ""}</span>
        </div>`;
      })}
    </div>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const h = this.hass;
    const e = this._entity;
    if (!e) return html`<div class="card missing"><span>${t(h, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const l = lang(h);
    const c = e.state;
    const night = isNight(h, e);
    const cur = num(e.attributes.temperature);
    const temp = cur != null ? `${fmt(h, Math.round(cur))}°` : "–";
    const { hi, lo } = todayRange(this._daily);
    const hilo = hi != null || lo != null ? `${t(h, "max_short")} ${hi != null ? `${fmt(h, Math.round(hi))}°` : "–"} · ${t(h, "min_short")} ${lo != null ? `${fmt(h, Math.round(lo))}°` : "–"}` : "";
    const cond = e.state === "unavailable" ? t(h, "unavailable") : conditionName(l, c);
    const name = this._name;
    const animate = this._config.animate !== false;
    const fx = animate && hasRain(c) ? html`<span class="rainfx"></span>` : animate && hasSnow(c) ? html`<span class="snowfx"></span>` : nothing;
    const size = this._size;

    let body;
    if (size === "s11") {
      body = html`${weatherIcon(c, 34, night)}<div class="text"><span class="name">${temp} · ${name}</span><span class="state">${cond}</span></div>`;
    } else if (size === "s21") {
      body = html`${fx}<div class="top"><span class="temp">${temp}</span>${weatherIcon(c, 40, night)}</div>
        <div class="text"><span class="name">${name}</span><span class="state">${cond}</span>${hilo ? html`<span class="hl">${hilo}</span>` : nothing}</div>`;
    } else {
      const big = size === "s42";
      body = html`${fx}
        <div class="top">
          <div class="text"><span class="name">${name}</span><span class="temp ${big ? "xl" : "md"}">${temp}</span></div>
          <div class="right">${weatherIcon(c, big ? 34 : 30, night)}<span class="cond">${cond}</span>${hilo ? html`<span class="hl">${hilo}</span>` : nothing}</div>
        </div>
        ${this._hoursRow(night)}
        ${big ? html`<div class="sep"></div>${this._daysList(3)}` : nothing}`;
    }

    return html`<div
      class="card ${size}"
      style="background:${sky(c, night)}"
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${name}, ${temp}, ${cond}`}
      @click=${this._click}
      @keydown=${(ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >${body}</div>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    svg {
      display: block;
      flex: none;
    }
    .card {
      box-sizing: border-box;
      height: 100%;
      border-radius: var(--ha-card-border-radius, 22px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      position: relative;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      cursor: pointer;
      outline: none;
      --fg2: rgba(255, 255, 255, 0.85);
    }
    .missing {
      background: rgba(255, 255, 255, 0.13);
      justify-content: center;
      align-items: center;
      font-size: 13px;
    }
    .card > *:not(.rainfx):not(.snowfx) {
      position: relative;
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state,
    .cond {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cond {
      font-weight: 600;
      color: #fff;
    }
    .hl {
      font-size: 13px;
      font-weight: 600;
      color: var(--fg2);
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .temp {
      font-size: 46px;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .temp.md {
      font-size: 34px;
      margin-top: 1px;
    }
    .temp.xl {
      font-size: 52px;
      font-weight: 300;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      text-align: right;
      min-width: 0;
    }
    .s11 {
      flex-direction: row;
      align-items: center;
      padding: 0 12px;
      gap: 10px;
      border-radius: 20px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .s21 {
      justify-content: space-between;
    }
    .s22 {
      justify-content: space-between;
      padding: 12px 14px;
      gap: 4px;
    }
    .s42 {
      padding: 16px;
    }
    .hours {
      display: flex;
      justify-content: space-between;
      gap: 2px;
      margin-top: auto;
      flex: none;
    }
    .hours.empty {
      height: 56px;
    }
    .hour {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      min-width: 0;
    }
    .hour .h {
      color: var(--fg2);
    }
    .hour .t {
      font-size: 14px;
      font-variant-numeric: tabular-nums;
    }
    .sep {
      height: 1px;
      background: rgba(255, 255, 255, 0.22);
      flex: none;
    }
    .days {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: none;
    }
    .day {
      display: grid;
      grid-template-columns: 46px 26px 34px 1fr 34px;
      align-items: center;
      gap: 8px;
      height: 26px;
      font-size: 13.5px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .day .lo {
      color: var(--fg2);
      text-align: right;
    }
    .bar {
      height: 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.22);
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
      -webkit-mask: linear-gradient(transparent, #000 40%);
      mask: linear-gradient(transparent, #000 40%);
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
      background-image: radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 52%), radial-gradient(2px 2px at 70% 60%, #fff 50%, transparent 52%),
        radial-gradient(1.6px 1.6px at 45% 80%, #fff 50%, transparent 52%), radial-gradient(1.6px 1.6px at 85% 20%, #fff 50%, transparent 52%);
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-weather": TerralWeatherCard;
  }
}
