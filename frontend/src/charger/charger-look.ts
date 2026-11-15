// Colours and texts for each charger state, shared by the card and its window.
//   Charging            → green tint (like a lit light)
//   Car connected+locked → warm cream (the lit-light amber), orange icon, dark red lock
//   Connected, unlocked → light sky blue, sky icon
//   Locked, no car      → glass, dark grey lock
//   No car              → glass
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { type CarState, type ChargerConfig, type Resolved, carState, fmtNum, isLocked, powerKw, resolveEntities } from "./charger-model";

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, k: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * k)) as RGB;
const rgb = (c: RGB, a?: number) => (a == null ? `rgb(${c.join(",")})` : `rgba(${c.join(",")},${a})`);

const GREEN: RGB = [52, 199, 123];
const ORANGE: RGB = [255, 149, 0];
const SKY: RGB = [90, 200, 250];
const DARK_RED = "#b3261e";
const DARK_GREY = "#3a3d4a";

const tint = (bg: RGB, w: number, accent: RGB, fgBase: RGB, lk: string) =>
  `--bg:${rgb(mix(bg, [255, 255, 255], w), 0.95)};--bg-solid:${rgb(mix(bg, [255, 255, 255], w))};` +
  `--fg:${rgb(mix(fgBase, [10, 10, 20], 0.8))};--fg2:${rgb(mix(fgBase, [20, 10, 30], 0.7))};--accent:${rgb(accent)};--lk:${lk}`;

export type Look = "charging" | "warn" | "ready" | "locked" | "none" | "unavailable";

export interface ChargerView {
  look: Look;
  locked: boolean;
  car: CarState;
  ids: Resolved;
  kw: number | null;
  /** CSS custom properties for the card / status block. */
  style: string;
  tinted: boolean;
}

export function chargerView(h: HomeAssistant, c: ChargerConfig): ChargerView {
  const e = h.states[c.entity];
  const ids = resolveEntities(h, c);
  const car = carState(h, ids);
  const kw = powerKw(h, ids.power);
  if (!e || e.state === "unavailable" || e.state === "unknown") {
    return { look: "unavailable", locked: false, car, ids, kw, style: "", tinted: false };
  }
  const locked = isLocked(e, !!c.invert);
  let look: Look;
  if (locked) look = car === "connected" || car === "charging" ? "warn" : "locked";
  else if (car === "charging") look = "charging";
  else if (car === "connected") look = "ready";
  else look = "none";
  const style =
    look === "charging" ? tint(GREEN, 0.84, GREEN, GREEN, DARK_RED)
    : look === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${rgb(ORANGE)};--lk:${DARK_RED}`
    : look === "ready" ? tint(SKY, 0.8, SKY, [30, 110, 160], DARK_RED)
    : `--lk:${DARK_GREY}`;
  return { look, locked, car, ids, kw, style, tinted: look === "charging" || look === "warn" || look === "ready" };
}

export function statusText(h: HomeAssistant, v: ChargerView, short: boolean): string {
  const kw = v.kw != null ? `${fmtNum(h, v.kw)} kW` : "";
  switch (v.look) {
    case "charging":
      return short ? kw || t(h, "ch_charging") : kw ? `${t(h, "ch_charging")} · ${kw}` : t(h, "ch_charging");
    case "warn":
      return short ? t(h, "ch_locked") : t(h, "ch_locked_car");
    case "ready":
      return short ? t(h, "ch_connected") : t(h, "ch_ready");
    case "locked":
      return t(h, "ch_locked");
    case "unavailable":
      return t(h, "unavailable");
    default:
      return v.car === "none" ? t(h, "ch_none") : t(h, "ch_unlocked");
  }
}
