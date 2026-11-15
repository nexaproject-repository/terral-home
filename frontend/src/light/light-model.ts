// What a light (or HA light group) can do, and how to show it.
import type { HassEntity, HomeAssistant } from "../ha-types";

export type LightKind = "onoff" | "dimmable" | "temperature" | "color";

const COLOR_MODES = ["hs", "rgb", "rgbw", "rgbww", "xy"];

export type RGB = [number, number, number];

export const DEFAULT_FAVORITES: { name: { es: string; en: string }; rgb: RGB }[] = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] },
];

export const TEMP_PRESETS = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6000, css: "#bcd8ff" },
] as const;

export function supportedModes(e: HassEntity): string[] {
  return (e.attributes.supported_color_modes as string[] | undefined) ?? [];
}

export function lightKind(e: HassEntity): LightKind {
  const modes = supportedModes(e);
  if (modes.some((m) => COLOR_MODES.includes(m))) return "color";
  if (modes.includes("color_temp")) return "temperature";
  if (modes.some((m) => m !== "onoff")) return "dimmable";
  return "onoff";
}

export function supportsTemp(e: HassEntity): boolean {
  return supportedModes(e).includes("color_temp");
}

export function isOn(e?: HassEntity): boolean {
  return e?.state === "on";
}

export function isUnavailable(e?: HassEntity): boolean {
  return !e || e.state === "unavailable" || e.state === "unknown";
}

/** 0–100, or undefined when off or not dimmable. */
export function brightnessPct(e: HassEntity): number | undefined {
  const b = e.attributes.brightness as number | undefined;
  if (!isOn(e) || b == null) return undefined;
  return Math.max(1, Math.round((b / 255) * 100));
}

/** Members of an HA light group (attribute entity_id), else []. */
export function groupMembers(e: HassEntity): string[] {
  const ids = e.attributes.entity_id;
  return Array.isArray(ids) ? (ids as string[]).filter((id) => id !== e.entity_id) : [];
}

export function isGroup(e: HassEntity): boolean {
  return groupMembers(e).length > 0;
}

export function kelvin(e: HassEntity): number | undefined {
  return e.attributes.color_temp_kelvin as number | undefined;
}

/** The colour the light is actually showing, when it's a real colour. */
export function currentRgb(e: HassEntity): RGB | undefined {
  if (!isOn(e)) return undefined;
  const mode = e.attributes.color_mode as string | undefined;
  if (!mode || !COLOR_MODES.includes(mode)) return undefined;
  const rgb = e.attributes.rgb_color as RGB | undefined;
  return rgb && rgb.length === 3 ? rgb : undefined;
}

/** Approximate RGB of a colour temperature, for tinting. */
export function kelvinToRgb(k: number): RGB {
  const t = k / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
    b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  } else {
    r = 329.7 * Math.pow(t - 60, -0.1332);
    g = 288.12 * Math.pow(t - 60, -0.0755);
    b = 255;
  }
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return [c(r), c(g), c(b)];
}

export interface Tint {
  /** Card background when on. */
  bg: string;
  /** Text colour on that background. */
  fg: string;
  /** Secondary text colour. */
  fg2: string;
  /** Icon circle / accents. */
  accent: string;
  /** Slider fill. */
  fill: string;
}

const AMBER: Tint = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d",
};

const mix = (a: RGB, b: RGB, t: number): RGB =>
  [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as RGB;
const css = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const COLD: Tint = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff",
};

const luminance = (c: RGB) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

/** Colours for an "on" card, following the light's real colour if asked. */
export function tintFor(e: HassEntity, useLightColor: boolean): Tint {
  if (!useLightColor) return AMBER;
  const base = currentRgb(e);
  if (!base) {
    const k = kelvin(e);
    return k && e.attributes.color_mode === "color_temp" && k >= 4500 ? COLD : AMBER;
  }
  const white: RGB = [255, 255, 255];
  // Very pale colours would give a white icon on a white card: darken the accent.
  const accent = luminance(base) > 0.75 ? mix(base, [40, 50, 80], 0.45) : base;
  return {
    bg: css(mix(base, white, 0.84), 0.95),
    fg: css(mix(base, [10, 10, 20], 0.82)),
    fg2: css(mix(base, [20, 10, 30], 0.72)),
    accent: css(accent),
    fill: css(mix(accent, white, 0.35)),
  };
}

// ---- Service calls -------------------------------------------------------

export function toggle(hass: HomeAssistant, e: HassEntity): Promise<unknown> {
  return hass.callService("light", isOn(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}

export function setPower(hass: HomeAssistant, ids: string | string[], on: boolean) {
  return hass.callService("light", on ? "turn_on" : "turn_off", {}, { entity_id: ids });
}

export function setBrightness(hass: HomeAssistant, id: string, pct: number) {
  if (pct <= 0) return hass.callService("light", "turn_off", {}, { entity_id: id });
  return hass.callService("light", "turn_on", { brightness_pct: Math.round(pct) }, { entity_id: id });
}

export function setKelvin(hass: HomeAssistant, e: HassEntity, k: number) {
  const min = (e.attributes.min_color_temp_kelvin as number) ?? 2000;
  const max = (e.attributes.max_color_temp_kelvin as number) ?? 6500;
  return hass.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(max, Math.max(min, k))) },
    { entity_id: e.entity_id },
  );
}

export function setRgb(hass: HomeAssistant, id: string, rgb: RGB) {
  return hass.callService("light", "turn_on", { rgb_color: rgb }, { entity_id: id });
}

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(c: RGB): string {
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** Closest favourite name for a colour, if any is near. */
export function colorName(rgb: RGB, lng: "es" | "en"): string | undefined {
  let best: { d: number; n: string } | undefined;
  for (const f of DEFAULT_FAVORITES) {
    const d = f.rgb.reduce((s, v, i) => s + (v - rgb[i]) ** 2, 0);
    if (!best || d < best.d) best = { d, n: f.name[lng] };
  }
  return best && best.d < 9000 ? best.n : undefined;
}

export function areaOf(hass: HomeAssistant, entityId: string): string | undefined {
  const ent = hass.entities?.[entityId];
  const areaId = ent?.area_id ?? (ent?.device_id ? hass.devices?.[ent.device_id]?.area_id : undefined);
  return areaId ? hass.areas?.[areaId]?.name ?? undefined : undefined;
}
