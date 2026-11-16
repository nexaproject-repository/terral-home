// Switch card looks: the icons to choose from and the 8 colours.
// Each colour gives a strong tone for the icon and a soft one for the card
// background (same recipe as the robot and the charger tints).
import { svg } from "lit";
import type { StringKey } from "../i18n";

// ---- Icons --------------------------------------------------------------------

/** Inner SVG of every icon; `on` fills the part that "lights up" (flame, body…). */
const PATHS: Record<string, (on: boolean) => ReturnType<typeof svg>> = {
  plug: () => svg`<path d="M9 3v5M15 3v5"></path><path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0z"></path><path d="M12 16.5V21"></path>`,
  boiler: (on) => svg`<rect x="6" y="2.5" width="12" height="16.5" rx="5"></rect><path d="M9.5 19v2.5M14.5 19v2.5"></path><path d="M12 7.6c1.5 1.6 2.2 2.7 2.2 3.9a2.2 2.2 0 0 1-4.4 0c0-1.2.7-2.3 2.2-3.9z" fill=${on ? "currentColor" : "none"}></path>`,
  // A simple mosquito (body, head, wings), crossed out; the bar has a gap cut around it.
  mosquito: (on) => svg`<defs><mask id="tsw-mq" maskUnits="userSpaceOnUse"><rect x="-2" y="-2" width="28" height="28" fill="#fff"></rect><path d="M4 3.5l16.5 17" stroke="#000" stroke-width="4"></path></mask></defs><g mask="url(#tsw-mq)"><ellipse cx="12" cy="14" rx="1.9" ry="5" fill=${on ? "currentColor" : "none"}></ellipse><circle cx="12" cy="7" r="1.7" fill="currentColor"></circle><path d="M10.4 11.6C7.3 8.4 3.5 8.7 3.5 10.8c0 1.8 3.6 2.4 6.9 1.9"></path><path d="M13.6 11.6c3.1-3.2 6.9-2.9 6.9-.8 0 1.8-3.6 2.4-6.9 1.9"></path></g><path d="M4 3.5l16.5 17"></path>`,
  zapper: (on) => svg`<rect x="5.5" y="4.5" width="13" height="15" rx="3.5"></rect><path d="M9 4.5V2.5h6v2"></path><path d="M8.5 9h7M8.5 12h7M8.5 15h7"></path>${on ? svg`<path d="M12.6 7.2l-1.8 3.3h2.4l-1.8 3.3" stroke-width="2.4"></path>` : nothing_}`,
  fan: () => svg`<circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-3.4.4-6.4 3-6.4 2.4 0 2.6 3.6-1.4 6.6M13.6 12.6c3.2 1.2 5.3 3.6 4 5.8-1.2 2-4.4.4-5.3-4.4M10.6 12.8c-2.6 2.2-5.7 2.8-7 .6-1.2-2 1.8-4 6.4-2.4"></path>`,
  coffee: () => svg`<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"></path><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"></path><path d="M8.5 3c-.6 1 .6 1.8 0 3M12 3c-.6 1 .6 1.8 0 3"></path><path d="M4 21h14"></path>`,
  radiator: () => svg`<path d="M6 5v14M10 5v14M14 5v14M18 5v14"></path><path d="M4 8h16M4 16h16"></path><path d="M6 19v2M18 19v2"></path>`,
  heater: () => svg`<rect x="4" y="5" width="16" height="12" rx="3"></rect><path d="M8 9c1 1 1 2 0 3M12 9c1 1 1 2 0 3M16 9c1 1 1 2 0 3"></path><path d="M7 17v3M17 17v3"></path>`,
  dehumidifier: (on) => svg`<rect x="6" y="2.5" width="12" height="19" rx="3"></rect><path d="M9 6h6"></path><path d="M12 10.5c1.6 1.8 2.4 3 2.4 4.1a2.4 2.4 0 0 1-4.8 0c0-1.1.8-2.3 2.4-4.1z" fill=${on ? "currentColor" : "none"}></path>`,
  pump: () => svg`<circle cx="10" cy="13" r="5"></circle><path d="M15 13h4.5M19.5 10v6M10 8V4h-4"></path><path d="M10 13l2-2"></path>`,
  tree: () => svg`<path d="M12 3l-5 6h3l-4 5h4l-4 5h12l-4-5h4l-4-5h3z"></path><path d="M12 19v2"></path>`,
  router: () => svg`<rect x="3.5" y="13" width="17" height="6" rx="2"></rect><path d="M7 16h.01M10.5 16h.01"></path><path d="M16 13V9M8.7 7.7a5 5 0 0 1 7.3 0M6.4 5.4a8.2 8.2 0 0 1 11.9 0"></path>`,
  washer: () => svg`<rect x="4.5" y="3" width="15" height="18" rx="3"></rect><path d="M4.5 7.5h15M8 5.2h.01M11 5.2h.01"></path><circle cx="12" cy="14" r="4"></circle>`,
  tv: () => svg`<rect x="3" y="5" width="18" height="12" rx="2.5"></rect><path d="M8 21h8M12 17v4"></path>`,
  water: (on) => svg`<path d="M12 3.5c3.2 3.6 5 6.3 5 8.8a5 5 0 0 1-10 0c0-2.5 1.8-5.2 5-8.8z" fill=${on ? "currentColor" : "none"}></path>`,
};
const nothing_ = svg``;

/** Icons in the order the settings grid shows them. */
export const SWITCH_ICONS = ["boiler", "mosquito", "zapper", "plug", "fan", "coffee", "radiator", "heater", "dehumidifier", "pump", "tree", "router", "washer", "tv", "water"];

export const switchIcon = (key: string | undefined, on: boolean, size = 24) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(PATHS[key ?? ""] ?? PATHS.plug)(on)}</svg>`;

/** Icon guessed from the name when none was chosen. */
export function guessIcon(name: string): string {
  const n = name.toLowerCase();
  const rules: [RegExp, string][] = [
    [/termo|boiler|calentador|water heater|acs/, "boiler"],
    [/mosquit|insect/, "mosquito"],
    [/ventil|\bfan\b/, "fan"],
    [/caf[eé]|coffee|nespresso/, "coffee"],
    [/radiador|radiator|toallero/, "radiator"],
    [/estufa|calefact|heater|brasero/, "heater"],
    [/deshum|dehum/, "dehumidifier"],
    [/bomba|pump|piscina|pool|depurad/, "pump"],
    [/[aá]rbol|navidad|bel[eé]n|christmas|tree/, "tree"],
    [/router|wifi|modem|módem|fibra/, "router"],
    [/lavadora|secadora|washer|dryer|lavavajillas/, "washer"],
    [/\btv\b|tele|televis/, "tv"],
    [/riego|agua|water|fuente|aljibe/, "water"],
  ];
  return rules.find(([r]) => r.test(n))?.[1] ?? "plug";
}

// ---- Colours ------------------------------------------------------------------

export const SWITCH_COLORS: { key: string; hex: string; name: StringKey }[] = [
  { key: "amber", hex: "#ffb020", name: "col_amber" },
  { key: "orange", hex: "#ff7a2f", name: "col_orange" },
  { key: "red", hex: "#f04848", name: "col_red" },
  { key: "pink", hex: "#ec4f9a", name: "col_pink" },
  { key: "violet", hex: "#8b5cf6", name: "col_violet" },
  { key: "blue", hex: "#3b82f6", name: "col_blue" },
  { key: "teal", hex: "#14b8a6", name: "col_teal" },
  { key: "green", hex: "#34c77b", name: "col_green" },
];

export interface SwitchTint {
  bg: string;
  fg: string;
  fg2: string;
  accent: string;
}

type RGB = [number, number, number];
const hexRgb = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, w: number): RGB => a.map((v, i) => Math.round(v * (1 - w) + b[i] * w)) as RGB;
const rgb = (c: RGB, a?: number) => (a == null ? `rgb(${c.join(",")})` : `rgba(${c.join(",")},${a})`);

export function switchTint(key?: string): SwitchTint {
  const col = SWITCH_COLORS.find((c) => c.key === key) ?? SWITCH_COLORS[0];
  // Amber is exactly the light card's "on" look.
  if (col.key === "amber") return { bg: "rgba(255,247,232,.95)", fg: "#3a2a10", fg2: "#6b5428", accent: col.hex };
  const c = hexRgb(col.hex);
  return { bg: rgb(mix(c, [255, 255, 255], 0.86), 0.95), fg: rgb(mix(c, [10, 10, 20], 0.8)), fg2: rgb(mix(c, [20, 10, 30], 0.66)), accent: col.hex };
}

export const tintStyle = (t: SwitchTint) => `--bg:${t.bg};--fg:${t.fg};--fg2:${t.fg2};--accent:${t.accent}`;
