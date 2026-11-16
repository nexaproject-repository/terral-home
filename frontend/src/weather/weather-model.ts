// Weather helpers (Met.no or any weather entity): forecast subscriptions
// shared between cards, day / night, units and labels.
import type { HassEntity, HomeAssistant } from "../ha-types";

export interface WeatherConfig {
  entity: string;
  name?: string;
  /** What the 2/2 card shows under the current weather. */
  forecast_2x2?: "hourly" | "daily";
  /** Falling rain / snow on the card. */
  animate?: boolean;
  /** Humidity, wind, pressure… in the window. */
  show_details?: boolean;
  forecast_days?: 5 | 7;
}

export interface ForecastItem {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  wind_speed?: number;
  wind_bearing?: number;
  is_daytime?: boolean;
}

export type ForecastType = "hourly" | "daily";

const FEATURE = { DAILY: 1, HOURLY: 2, TWICE_DAILY: 4 };
export const supports = (e: HassEntity, type: ForecastType) =>
  (Number(e.attributes.supported_features ?? 0) & (type === "daily" ? FEATURE.DAILY : FEATURE.HOURLY)) !== 0;

// ---- Shared subscriptions -----------------------------------------------------

interface Sub {
  data?: ForecastItem[];
  listeners: Set<(f: ForecastItem[]) => void>;
  unsub?: Promise<() => Promise<void>>;
}
const subs = new Map<string, Sub>();

/** Live forecast for an entity; returns the unsubscribe function. */
export function subscribeForecast(h: HomeAssistant, entityId: string, type: ForecastType, cb: (f: ForecastItem[]) => void): () => void {
  const key = `${entityId}|${type}`;
  let s = subs.get(key);
  if (!s) {
    s = { listeners: new Set() };
    subs.set(key, s);
    const entry = s;
    entry.unsub = h.connection
      .subscribeMessage<{ forecast?: ForecastItem[] }>(
        (msg) => {
          entry.data = msg.forecast ?? [];
          for (const l of entry.listeners) l(entry.data);
        },
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: entityId },
      )
      .catch(() => {
        entry.data = [];
        for (const l of entry.listeners) l([]);
        return async () => undefined;
      });
  }
  s.listeners.add(cb);
  if (s.data) cb(s.data);
  const entry = s;
  return () => {
    entry.listeners.delete(cb);
    if (!entry.listeners.size) {
      subs.delete(key);
      entry.unsub?.then((u) => u()).catch(() => undefined);
    }
  };
}

// ---- Day / night ----------------------------------------------------------------

export function isNight(h: HomeAssistant, e: HassEntity): boolean {
  if (e.state === "clear-night") return true;
  const sun = h.states["sun.sun"];
  if (sun) return sun.state === "below_horizon";
  const hr = new Date().getHours();
  return hr < 7 || hr >= 21;
}

// ---- Values ---------------------------------------------------------------------

export const num = (v: unknown): number | null => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
export const tempUnit = (e: HassEntity) => String(e.attributes.temperature_unit ?? "°C");
export const windUnit = (e: HassEntity) => String(e.attributes.wind_speed_unit ?? "km/h");
export const pressureUnit = (e: HassEntity) => String(e.attributes.pressure_unit ?? "hPa");
export const precipUnit = (e: HassEntity) => String(e.attributes.precipitation_unit ?? "mm");

/** Today's max / min from the daily forecast. */
export function todayRange(daily?: ForecastItem[]): { hi: number | null; lo: number | null } {
  const d = daily?.[0];
  return { hi: num(d?.temperature), lo: num(d?.templow) };
}

/** Rain expected today, from the hourly forecast (or the daily one). */
export function rainToday(hourly?: ForecastItem[], daily?: ForecastItem[]): number | null {
  if (hourly?.length) {
    const today = new Date().toDateString();
    const vals = hourly.filter((f) => new Date(f.datetime).toDateString() === today).map((f) => num(f.precipitation) ?? 0);
    if (vals.length) return vals.reduce((a, b) => a + b, 0);
  }
  return num(daily?.[0]?.precipitation);
}

// ---- Labels ---------------------------------------------------------------------

const COND_ES: Record<string, string> = {
  "clear-night": "Despejado", cloudy: "Nublado", exceptional: "Excepcional", fog: "Niebla", hail: "Granizo", lightning: "Tormenta eléctrica",
  "lightning-rainy": "Tormenta", partlycloudy: "Parcialmente nublado", pouring: "Lluvia fuerte", rainy: "Lluvia", snowy: "Nieve",
  "snowy-rainy": "Aguanieve", sunny: "Soleado", windy: "Viento", "windy-variant": "Viento y nubes",
};
const COND_EN: Record<string, string> = {
  "clear-night": "Clear", cloudy: "Cloudy", exceptional: "Exceptional", fog: "Fog", hail: "Hail", lightning: "Lightning",
  "lightning-rainy": "Thunderstorm", partlycloudy: "Partly cloudy", pouring: "Heavy rain", rainy: "Rain", snowy: "Snow",
  "snowy-rainy": "Sleet", sunny: "Sunny", windy: "Windy", "windy-variant": "Windy and cloudy",
};
export const conditionName = (lang: "es" | "en", c: string) => (lang === "es" ? COND_ES : COND_EN)[c] ?? c;

export const fmt = (h: HomeAssistant | undefined, n: number, d = 0) =>
  n.toLocaleString(h?.locale?.language ?? h?.language ?? undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export const hourLabel = (h: HomeAssistant | undefined, iso: string) =>
  new Date(iso).toLocaleTimeString(h?.locale?.language ?? h?.language ?? undefined, { hour: "2-digit" }).replace(/\s?h$/, "");

export function dayLabel(h: HomeAssistant | undefined, iso: string, todayWord: string) {
  const d = new Date(iso);
  if (d.toDateString() === new Date().toDateString()) return todayWord;
  const s = d.toLocaleDateString(h?.locale?.language ?? h?.language ?? undefined, { weekday: "short" }).replace(".", "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
