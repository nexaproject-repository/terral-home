// Climate helpers for any climate entity (split, ducted, heater, heat pump…).
// "off" is not a mode on Terral cards: the icon turns the machine on and off.
import type { HassEntity, HomeAssistant } from "../ha-types";

export interface ModeRule {
  /** Show the temperature control in this mode. */
  t: boolean;
  /** Show the fan speed control in this mode. */
  f: boolean;
}

export interface ClimateConfig {
  entity: string;
  name?: string;
  device?: string;
  min_temp?: number;
  max_temp?: number;
  temp_step?: number;
  /** Per-mode overrides of what is shown. */
  mode_rules?: Record<string, ModeRule>;
  show_swing?: boolean;
}

export const MODE_ORDER = ["auto", "heat_cool", "cool", "heat", "dry", "fan_only"];
export const DEFAULT_RULES: Record<string, ModeRule> = {
  auto: { t: true, f: true },
  heat_cool: { t: true, f: false },
  cool: { t: true, f: true },
  heat: { t: true, f: true },
  dry: { t: false, f: false },
  fan_only: { t: false, f: true },
};
export const MODE_COLORS: Record<string, [number, number, number]> = {
  cool: [70, 150, 255],
  heat: [255, 140, 60],
  auto: [52, 199, 123],
  heat_cool: [52, 199, 123],
  dry: [40, 190, 200],
  fan_only: [140, 160, 200],
};

const FEATURE = { TARGET: 1, RANGE: 2, FAN: 8, PRESET: 16, SWING: 32, TURN_OFF: 128, TURN_ON: 256 };
const feat = (e: HassEntity, f: number) => (Number(e.attributes.supported_features ?? 0) & f) !== 0;

export const isOff = (e: HassEntity) => e.state === "off" || e.state === "unavailable" || e.state === "unknown";
export const isUnavailable = (e: HassEntity) => e.state === "unavailable" || e.state === "unknown";

/** Modes the machine has, without "off", in a stable order. */
export function modes(e: HassEntity): string[] {
  const list = ((e.attributes.hvac_modes as string[] | undefined) ?? []).filter((m) => m !== "off");
  const rank = (m: string) => (MODE_ORDER.includes(m) ? MODE_ORDER.indexOf(m) : 99);
  return [...list].sort((a, b) => rank(a) - rank(b));
}

export const fanModes = (e: HassEntity): string[] => (feat(e, FEATURE.FAN) || e.attributes.fan_modes ? ((e.attributes.fan_modes as string[]) ?? []) : []);
export const presetModes = (e: HassEntity): string[] => ((e.attributes.preset_modes as string[]) ?? []).filter((p) => p !== "none");
export const swingSupported = (e: HassEntity) => feat(e, FEATURE.SWING) || ((e.attributes.swing_modes as string[] | undefined)?.length ?? 0) > 0;

/** True when the current (or given) mode uses a low/high range. */
export function isRange(e: HassEntity, mode = e.state): boolean {
  return mode === "heat_cool" || (e.attributes.target_temp_low != null && e.attributes.target_temp_high != null && e.attributes.temperature == null && mode !== "off");
}

export function rules(c: ClimateConfig, mode: string): ModeRule {
  return c.mode_rules?.[mode] ?? DEFAULT_RULES[mode] ?? { t: true, f: true };
}

/** Temperature control available right now (config rule + what the machine reports). */
export function canTemp(e: HassEntity, c: ClimateConfig): boolean {
  if (isOff(e) || !rules(c, e.state).t) return false;
  if (isRange(e)) return e.attributes.target_temp_low != null;
  return e.attributes.temperature != null || feat(e, FEATURE.TARGET);
}

export function canFan(e: HassEntity, c: ClimateConfig): boolean {
  return !isOff(e) && rules(c, e.state).f && fanModes(e).length > 0;
}

export function limits(e: HassEntity, c: ClimateConfig) {
  const hwMin = Number(e.attributes.min_temp ?? 7);
  const hwMax = Number(e.attributes.max_temp ?? 35);
  const min = Math.max(hwMin, c.min_temp ?? hwMin);
  const max = Math.min(hwMax, c.max_temp ?? hwMax);
  const step = c.temp_step ?? Number(e.attributes.target_temp_step ?? (e.attributes.temperature_unit === "°F" ? 1 : 0.5));
  return { min, max: Math.max(min + step, max), step, hwMin, hwMax };
}

export const snap = (v: number, l: { min: number; max: number; step: number }) =>
  Math.min(l.max, Math.max(l.min, Math.round(v / l.step) * l.step));

export const currentTemp = (e: HassEntity): number | null => (e.attributes.current_temperature != null ? Number(e.attributes.current_temperature) : null);
export const currentHumidity = (e: HassEntity): number | null => (e.attributes.current_humidity != null ? Number(e.attributes.current_humidity) : null);

// ---- Service calls -------------------------------------------------------------

const lastMode = new Map<string, string>();
export const rememberMode = (e: HassEntity) => {
  if (!isOff(e)) lastMode.set(e.entity_id, e.state);
};

export function turnOn(h: HomeAssistant, e: HassEntity) {
  const m = lastMode.get(e.entity_id);
  if (m && modes(e).includes(m)) return setMode(h, e, m);
  if (feat(e, FEATURE.TURN_ON)) return h.callService("climate", "turn_on", {}, { entity_id: e.entity_id });
  const first = modes(e).includes("cool") ? "cool" : modes(e)[0];
  return first ? setMode(h, e, first) : Promise.resolve();
}

export function turnOff(h: HomeAssistant, e: HassEntity) {
  rememberMode(e);
  if ((e.attributes.hvac_modes as string[] | undefined)?.includes("off")) return setMode(h, e, "off");
  return h.callService("climate", "turn_off", {}, { entity_id: e.entity_id });
}

export const setMode = (h: HomeAssistant, e: HassEntity, mode: string) =>
  h.callService("climate", "set_hvac_mode", { hvac_mode: mode }, { entity_id: e.entity_id });
export const setFan = (h: HomeAssistant, e: HassEntity, fan: string) =>
  h.callService("climate", "set_fan_mode", { fan_mode: fan }, { entity_id: e.entity_id });
export const setPreset = (h: HomeAssistant, e: HassEntity, preset: string) =>
  h.callService("climate", "set_preset_mode", { preset_mode: preset }, { entity_id: e.entity_id });
export function setSwing(h: HomeAssistant, e: HassEntity, on: boolean) {
  const list = (e.attributes.swing_modes as string[] | undefined) ?? ["on", "off"];
  const target = on ? list.find((m) => m !== "off") ?? "on" : list.includes("off") ? "off" : list[0];
  return h.callService("climate", "set_swing_mode", { swing_mode: target }, { entity_id: e.entity_id });
}
export function setTemp(h: HomeAssistant, e: HassEntity, value: number | { low: number; high: number }) {
  const data = typeof value === "number" ? { temperature: value } : { target_temp_low: value.low, target_temp_high: value.high };
  return h.callService("climate", "set_temperature", data, { entity_id: e.entity_id });
}

// ---- Labels --------------------------------------------------------------------

const ES: Record<string, string> = {
  auto: "Auto", heat_cool: "Frío/calor", cool: "Frío", heat: "Calor", dry: "Deshumidificar", fan_only: "Solo ventilador",
  low: "Bajo", medium: "Medio", mid: "Medio", high: "Alto", middle: "Medio", quiet: "Silencio", silent: "Silencio", turbo: "Turbo",
  focus: "Enfoque", diffuse: "Difuso", on: "Sí", off: "No", eco: "Eco", comfort: "Confort", away: "Ausente", home: "En casa",
  sleep: "Noche", boost: "Turbo", activity: "Actividad",
};
const EN: Record<string, string> = {
  auto: "Auto", heat_cool: "Heat/cool", cool: "Cool", heat: "Heat", dry: "Dry", fan_only: "Fan only",
};
const ACTION_ES: Record<string, string> = { cool: "Enfriando", heat: "Calentando", dry: "Deshumidificando", fan_only: "Ventilando", auto: "Automático", heat_cool: "Manteniendo" };
const ACTION_EN: Record<string, string> = { cool: "Cooling", heat: "Heating", dry: "Drying", fan_only: "Fan", auto: "Auto", heat_cool: "Keeping" };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
export const modeName = (lang: "es" | "en", m: string) => (lang === "es" ? ES[m] : EN[m]) ?? cap(m);
/** Fan / preset names: translated when known, otherwise as the integration sends them. */
export const optionName = (lang: "es" | "en", v: string) => (lang === "es" ? ES[v.toLowerCase()] : undefined) ?? cap(v);
export const actionName = (lang: "es" | "en", m: string) => (lang === "es" ? ACTION_ES[m] : ACTION_EN[m]) ?? modeName(lang, m);
/** Short tag for the fan button: A, 1, 2, 3… */
export function fanTag(list: string[], v?: string): string {
  if (!v) return "";
  if (/auto/i.test(v)) return "A";
  const speeds = list.filter((f) => !/auto/i.test(f));
  const i = speeds.indexOf(v);
  return i >= 0 ? String(i + 1) : v.charAt(0).toUpperCase();
}
