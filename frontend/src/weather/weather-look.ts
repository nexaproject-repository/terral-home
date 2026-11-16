// Weather icons (coloured SVG) and sky backgrounds.
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

const S = (w: number, inner: string) =>
  `<svg width="${w}" height="${w}" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const SUN = (cx = 24, cy = 24, r = 9) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFD25A"/>` +
  [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => {
      const t = (a * Math.PI) / 180;
      const p = (k: number) => `${(cx + Math.cos(t) * k).toFixed(1)} ${(cy + Math.sin(t) * k).toFixed(1)}`;
      return `<path d="M${p(r + 4)}L${p(r + 8)}" stroke="#FFD25A" stroke-width="3"/>`;
    })
    .join("");
const MOON = (cx = 24, cy = 22) => `<path d="M${cx + 10} ${cy + 6}A12 12 0 1 1 ${cx - 2} ${cy - 11}a9.5 9.5 0 0 0 12 17z" fill="#F4E9B8"/>`;
const CLOUD = (y = 0, c = "#fff") => `<path d="M14 ${36 + y}h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 7.5 7.5 0 0 0-1 18z" fill="${c}"/>`;
const DROPS = (c = "#7fc8ff", xs = [14, 23, 32]) => xs.map((x) => `<path d="M${x} 40l-2 5" stroke="${c}" stroke-width="3"/>`).join("");
const FLAKES = (xs = [14, 24, 34]) => xs.map((x) => `<circle cx="${x}" cy="42" r="2.2" fill="#fff"/>`).join("");
const BOLT = `<path d="M25 30l-5 8h6l-4 8" stroke="#FFD25A" stroke-width="3"/>`;
const WIND = `<path d="M6 18h24a5 5 0 1 0-5-5M6 26h32a5 5 0 1 1-5 5M6 34h16" stroke="#dfe7f3" stroke-width="3.2"/>`;

function svgFor(c: string, night: boolean): string {
  switch (c) {
    case "sunny":
      return night ? MOON() : SUN();
    case "clear-night":
      return MOON();
    case "partlycloudy":
      return (night ? MOON(20, 15) : SUN(18, 17, 7)) + CLOUD(2);
    case "cloudy":
      return CLOUD(-6, "#cfd8e6") + CLOUD(0);
    case "rainy":
      return CLOUD(-6) + DROPS();
    case "pouring":
      return CLOUD(-6, "#b9c4d6") + DROPS("#5fb4ff", [12, 18, 24, 30, 36]);
    case "lightning":
      return CLOUD(-6, "#b9c4d6") + BOLT;
    case "lightning-rainy":
      return CLOUD(-6, "#b9c4d6") + BOLT + DROPS("#7fc8ff", [14, 34]);
    case "snowy":
      return CLOUD(-6) + FLAKES();
    case "snowy-rainy":
      return CLOUD(-6) + FLAKES([14, 34]) + DROPS("#7fc8ff", [24]);
    case "hail":
      return CLOUD(-6, "#b9c4d6") + [14, 24, 34].map((x) => `<circle cx="${x}" cy="42" r="2.6" fill="#dfe9ff" stroke="#9fb7e0" stroke-width="1"/>`).join("");
    case "fog":
      return CLOUD(-8, "#cfd8e6") + `<path d="M10 36h28M14 42h22" stroke="#cfd8e6" stroke-width="3"/>`;
    case "windy":
      return WIND;
    case "windy-variant":
      return CLOUD(-8, "#cfd8e6") + `<path d="M8 38h22a4 4 0 1 0-4-4M8 44h14" stroke="#dfe7f3" stroke-width="3"/>`;
    default:
      return SUN(24, 24, 7) + CLOUD(4, "#cfd8e6");
  }
}

export const weatherIcon = (c: string, size = 32, night = false) => unsafeSVG(S(size, svgFor(c, night)));

const DAY: Record<string, string> = {
  sunny: "linear-gradient(180deg,#3a8ee6,#7cc0f5)",
  partlycloudy: "linear-gradient(180deg,#4a8bd0,#9cc4e6)",
  cloudy: "linear-gradient(180deg,#6a7c93,#a2b1c3)",
  rainy: "linear-gradient(180deg,#43546d,#73859c)",
  pouring: "linear-gradient(180deg,#2f3d52,#56677f)",
  lightning: "linear-gradient(180deg,#262c46,#4c4f72)",
  "lightning-rainy": "linear-gradient(180deg,#262c46,#4c4f72)",
  snowy: "linear-gradient(180deg,#7f95b2,#b8c8dc)",
  "snowy-rainy": "linear-gradient(180deg,#6f839d,#a6b6ca)",
  hail: "linear-gradient(180deg,#56657d,#8e9db2)",
  fog: "linear-gradient(180deg,#7d8897,#aab3be)",
  windy: "linear-gradient(180deg,#5a86b8,#9fbad6)",
  "windy-variant": "linear-gradient(180deg,#5f7ea3,#9fb3cc)",
};
const NIGHT: Record<string, string> = {
  sunny: "linear-gradient(180deg,#0e1739,#283a6e)",
  "clear-night": "linear-gradient(180deg,#0e1739,#283a6e)",
  partlycloudy: "linear-gradient(180deg,#141d40,#36477a)",
  cloudy: "linear-gradient(180deg,#232a3b,#454f65)",
  rainy: "linear-gradient(180deg,#1b2233,#394459)",
  pouring: "linear-gradient(180deg,#151b29,#2f394c)",
  snowy: "linear-gradient(180deg,#2a3550,#56688a)",
  fog: "linear-gradient(180deg,#2c3340,#525b6a)",
};

export function sky(c: string, night: boolean): string {
  if (night) return NIGHT[c] ?? NIGHT.cloudy;
  return DAY[c] ?? DAY.partlycloudy;
}

export const hasRain = (c: string) => ["rainy", "pouring", "lightning-rainy", "snowy-rainy", "hail"].includes(c);
export const hasSnow = (c: string) => c === "snowy" || c === "snowy-rainy";
