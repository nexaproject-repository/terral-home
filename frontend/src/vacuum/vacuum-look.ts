// Robot vacuum look: colours per activity, battery icon / colour, names of
// the fan, water and mop options, routine icons and the status line.
import type { HassEntity, HomeAssistant } from "../ha-types";
import { lang, t } from "../i18n";
import { batteryLevelIcon, bedIcon, dropIcon, kitchenIcon, pawIcon, sofaIcon, sparklesIcon } from "../shared/icons";
import { type Activity, type Parts, activity, area, battery, currentRoom, errorCode, minutes, progress } from "./vacuum-model";

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, w: number): RGB => [0, 1, 2].map((i) => Math.round(a[i] * (1 - w) + b[i] * w)) as RGB;
const rgb = (c: RGB, a?: number) => (a == null ? `rgb(${c.join(",")})` : `rgba(${c.join(",")},${a})`);

const TEAL: RGB = [34, 165, 135];
const SKY: RGB = [90, 157, 240];
const RED: RGB = [224, 86, 75];

/** Card style for the activity: teal while cleaning, sky blue going home, red when stuck, glass otherwise. */
export function tint(a: Activity): string {
  const c = a === "cleaning" || a === "paused" ? TEAL : a === "returning" ? SKY : a === "error" ? RED : null;
  if (!c) return "";
  return (
    `--bg:${rgb(mix(c, [255, 255, 255], 0.86), 0.95)};--bg-solid:${rgb(mix(c, [255, 255, 255], 0.86))};` +
    `--fg:${rgb(mix(c, [10, 10, 20], 0.8))};--fg2:${rgb(mix(c, [20, 10, 30], 0.68))};--accent:${rgb(c)}`
  );
}

export const isTinted = (a: Activity) => a === "cleaning" || a === "paused" || a === "returning" || a === "error";

/** Battery bars (0–4) and colour; the colour is darker on the light (tinted) cards. */
export function batteryLook(pct: number, onLight: boolean) {
  const bars = pct >= 80 ? 4 : pct >= 60 ? 3 : pct >= 40 ? 2 : pct >= 20 ? 1 : 0;
  const color = pct < 20 ? (onLight ? "#a32d2d" : "#ff9b93") : pct < 40 ? (onLight ? "#854f0b" : "#ffd27a") : onLight ? "#0f6e56" : "#9ff0d0";
  return { bars, color };
}

export function batteryBadge(h: HomeAssistant, e: HassEntity, p: Parts, withUnit: boolean, size = 16) {
  const pct = battery(h, e, p);
  if (pct == null) return null;
  const a = activity(e);
  const { bars, color } = batteryLook(pct, isTinted(a));
  const charging = a === "docked" && pct < 100;
  return { pct, color, icon: batteryLevelIcon(bars, charging, size), text: withUnit ? `${pct} %` : String(pct) };
}

const OPTION: Record<string, [string, string]> = {
  off: ["Apagado", "Off"],
  quiet: ["Silencioso", "Quiet"],
  silent: ["Silencioso", "Silent"],
  gentle: ["Suave", "Gentle"],
  balanced: ["Equilibrado", "Balanced"],
  standard: ["Estándar", "Standard"],
  medium: ["Media", "Medium"],
  turbo: ["Turbo", "Turbo"],
  strong: ["Fuerte", "Strong"],
  max: ["Máx", "Max"],
  max_plus: ["Máx+", "Max+"],
  custom: ["Personalizado", "Custom"],
  smart_mode: ["Inteligente", "Smart"],
  mild: ["Baja", "Low"],
  low: ["Baja", "Low"],
  moderate: ["Media", "Medium"],
  intense: ["Alta", "High"],
  high: ["Alta", "High"],
  extreme: ["Extrema", "Extreme"],
  custom_water_flow: ["Personalizada", "Custom"],
  deep: ["A fondo", "Deep"],
  deep_plus: ["A fondo+", "Deep+"],
  fast: ["Rápido", "Fast"],
};

export function optionName(h: HomeAssistant, v: string): string {
  const k = v.toLowerCase().replace(/[\s-]+/g, "_");
  const hit = OPTION[k];
  if (hit) return hit[lang(h) === "es" ? 0 : 1];
  const s = v.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const ROUTINE_ICONS: [RegExp, (s?: number) => unknown][] = [
  [/(cocin|kitchen)/i, kitchenIcon],
  [/(dorm|bed|habitac|cuarto)/i, bedIcon],
  [/(salon|salón|living|comedor|sofa)/i, sofaIcon],
  [/(freg|mop|agua|water|fondo|deep)/i, dropIcon],
  [/(mascot|pet|pelo|perro|gato)/i, pawIcon],
];
export const routineIcon = (name: string, size = 18) => (ROUTINE_ICONS.find(([re]) => re.test(name))?.[1] ?? sparklesIcon)(size);

const ERRORS: Record<string, [string, string]> = {
  main_brush_jammed: ["Cepillo principal atascado", "Main brush jammed"],
  side_brush_jammed: ["Cepillo lateral atascado", "Side brush jammed"],
  wheels_jammed: ["Ruedas atascadas", "Wheels jammed"],
  wheels_suspended: ["Ruedas en el aire", "Wheels suspended"],
  robot_trapped: ["Atrapado", "Trapped"],
  stuck: ["Atascado", "Stuck"],
  clean_box_full: ["Depósito lleno", "Bin full"],
  water_box_empty: ["Depósito de agua vacío", "Water tank empty"],
  low_battery: ["Batería baja", "Low battery"],
  cliff_sensor_error: ["Sensor de caída", "Cliff sensor"],
  laser_sensor_fault: ["Fallo del láser", "Laser sensor fault"],
  bumper_stuck: ["Parachoques atascado", "Bumper stuck"],
  filter_blocked: ["Filtro obstruido", "Filter blocked"],
  mop_pad_missing: ["Falta la mopa", "Mop pad missing"],
};

export function errorText(h: HomeAssistant, code: string): string {
  const hit = ERRORS[code];
  if (hit) return hit[lang(h) === "es" ? 0 : 1];
  const s = code.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function activityName(h: HomeAssistant, a: Activity): string {
  return t(h, (`vac_${a}` as const));
}

/** "58 % · 24 m² · 18 min" with whatever the robot reports. */
export function runFacts(h: HomeAssistant, p: Parts, withProgress = true): string {
  const loc = h.locale?.language ?? h.language;
  const pr = progress(h, p);
  const ar = area(h, p);
  const mn = minutes(h, p);
  return [
    withProgress && pr != null ? `${pr} %` : "",
    ar != null ? `${ar.toLocaleString(loc, { maximumFractionDigits: 1 })} m²` : "",
    mn != null ? `${mn} min` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Status line: "Limpiando · Cocina", "Atascado · Pasillo", "En la base"… */
export function statusText(h: HomeAssistant, e: HassEntity, p: Parts, short = false): string {
  const a = activity(e);
  const room = currentRoom(h, p);
  if (short && a === "cleaning") {
    const pr = progress(h, p);
    if (pr != null) return `${pr} %`;
  }
  if (a === "error" && !short) {
    const code = errorCode(h, e, p);
    return [activityName(h, a), room ?? (code ? errorText(h, code) : "")].filter(Boolean).join(" · ");
  }
  if (a === "cleaning" && room && !short) return `${activityName(h, a)} · ${room}`;
  return activityName(h, a);
}
