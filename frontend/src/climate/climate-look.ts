// Shared bits for the climate card and window: mode icons, colours, texts.
import type { HassEntity, HomeAssistant } from "../ha-types";
import { lang } from "../i18n";
import { climateAutoIcon, coolIcon, dryIcon, fanIcon, heatCoolIcon, heatIcon, powerIcon, thermoIcon } from "../shared/icons";
import { type ClimateConfig, MODE_COLORS, actionName, canTemp, currentHumidity, currentTemp, isOff, isRange, isUnavailable, modeName } from "./climate-model";

export function modeIcon(m: string, size = 22): unknown {
  switch (m) {
    case "auto":
      return climateAutoIcon(size);
    case "cool":
      return coolIcon(size);
    case "heat":
      return heatIcon(size);
    case "dry":
      return dryIcon(size);
    case "fan_only":
      return fanIcon(size);
    case "heat_cool":
      return heatCoolIcon(size);
    case "off":
      return powerIcon(size);
    default:
      return thermoIcon(size);
  }
}

const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const rgb = (c: number[], a?: number) => (a == null ? `rgb(${c.join(",")})` : `rgba(${c.join(",")},${a})`);

/** CSS custom properties for the current mode (empty = glass). */
export function tint(e: HassEntity): string {
  if (isOff(e)) return "";
  const c = MODE_COLORS[e.state] ?? [140, 160, 200];
  return (
    `--bg:${rgb(mix(c, [255, 255, 255], 0.84), 0.95)};--bg-solid:${rgb(mix(c, [255, 255, 255], 0.84))};` +
    `--fg:${rgb(mix(c, [10, 10, 20], 0.82))};--fg2:${rgb(mix(c, [20, 10, 30], 0.7))};--accent:${rgb(c)};--arc:${rgb(c)}`
  );
}

export type Target = number | { low: number; high: number };

export function targetOf(e: HassEntity): Target | null {
  if (isRange(e)) {
    const low = e.attributes.target_temp_low;
    const high = e.attributes.target_temp_high;
    return low != null && high != null ? { low: Number(low), high: Number(high) } : null;
  }
  return e.attributes.temperature != null ? Number(e.attributes.temperature) : null;
}

export const fmtT = (h: HomeAssistant | undefined, n: number) =>
  n.toLocaleString(h?.locale?.language ?? h?.language ?? undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const targetText = (h: HomeAssistant | undefined, t: Target | null) =>
  t == null ? "" : typeof t === "number" ? `${fmtT(h, t)}°` : `${fmtT(h, t.low)}–${fmtT(h, t.high)}°`;

export function statusText(h: HomeAssistant, e: HassEntity, c: ClimateConfig, target: Target | null, short: boolean): string {
  const l = lang(h);
  const cur = currentTemp(e);
  const inside = cur != null ? `${fmtT(h, cur)}° ${l === "es" ? "dentro" : "inside"}` : "";
  if (isUnavailable(e)) return l === "es" ? "Sin respuesta" : "Not responding";
  if (isOff(e)) {
    const off = l === "es" ? "Apagado" : "Off";
    return short || !inside ? off : `${off} · ${inside}`;
  }
  const t = canTemp(e, c) ? targetText(h, target) : "";
  if (short) return t || modeName(l, e.state);
  const head = t ? `${actionName(l, e.state)} ${l === "es" ? "a" : "to"} ${t}` : actionName(l, e.state);
  return inside ? `${head} · ${inside}` : head;
}

export function humidityText(h: HomeAssistant, e: HassEntity): string {
  const hum = currentHumidity(e);
  return hum != null ? `${Math.round(hum)} % ${lang(h) === "es" ? "humedad" : "humidity"}` : "";
}
