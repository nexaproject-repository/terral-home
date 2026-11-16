// Door / window helpers: open or closed, what it is (door, window, balcony
// door, garage), the sibling sensors of the same device (tamper, vibration,
// temperature, battery, Z-Wave node status, X / Y / Z axes) and the recorded
// ventilation / tilt positions.
import { svg } from "lit";
import type { HassEntity, HomeAssistant } from "../ha-types";
import { siblings } from "../charger/charger-model";
import { t } from "../i18n";

export type ContactKind = "door" | "window" | "balcony" | "garage";
export type PositionKey = "closed" | "vent" | "tilt";
export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export interface ContactConfig {
  entity: string;
  name?: string;
  kind?: ContactKind;
  /**
   * Recorded accelerometer readings per sensor and position, for windows with
   * a tilt sensor (X / Y / Z axes): "closed", "vent" (ventilation) and "tilt".
   * The card shows the position whose reading is closest to the current one.
   */
  positions?: Record<string, Partial<Record<PositionKey, XYZ>>>;
  show_temp?: boolean;
  show_battery?: boolean;
  /** Other door / window sensors: the card becomes a group card. */
  group?: string[];
}

export const CONTACT_CLASSES = ["door", "window", "garage_door", "opening"];

export const isContact = (h: HomeAssistant, id: string) => {
  if (!id.startsWith("binary_sensor.")) return false;
  const dc = String(h.states[id]?.attributes.device_class ?? "");
  if (CONTACT_CLASSES.includes(dc)) return true;
  return !dc && /(puerta|ventana|balcon|door|window|contact|contacto|apertura)/i.test(`${id} ${h.states[id]?.attributes.friendly_name ?? ""}`);
};

export const isOpen = (e?: HassEntity) => e?.state === "on";
export const isUnavailable = (e?: HassEntity) => !e || e.state === "unavailable" || e.state === "unknown";

export function kindOf(h: HomeAssistant, c: { entity: string; kind?: ContactKind; name?: string }): ContactKind {
  if (c.kind) return c.kind;
  const e = h.states[c.entity];
  const dc = String(e?.attributes.device_class ?? "");
  const n = `${c.name ?? ""} ${e?.attributes.friendly_name ?? ""} ${c.entity}`.toLowerCase();
  if (dc === "garage_door" || /garaje|garage|cochera/.test(n)) return "garage";
  if (/balcon|terraza|corredera|patio/.test(n)) return "balcony";
  if (dc === "window" || /ventana|window/.test(n)) return "window";
  return "door";
}

// ---- Sibling sensors --------------------------------------------------------------

export interface Parts {
  tamper?: string;
  vibration?: string;
  temperature?: string;
  battery?: string;
  node?: string;
  x?: string;
  y?: string;
  z?: string;
}

const name = (h: HomeAssistant, id: string) => `${id} ${h.states[id]?.attributes.friendly_name ?? ""}`.toLowerCase();
const dcOf = (h: HomeAssistant, id: string) => String(h.states[id]?.attributes.device_class ?? "");

export function parts(h: HomeAssistant, id: string): Parts {
  const sib = siblings(h, id).filter((x) => h.states[x]);
  const find = (test: (x: string) => boolean) => sib.find(test);
  return {
    tamper: find((x) => x.startsWith("binary_sensor.") && (dcOf(h, x) === "tamper" || /tamper|manipul|cover/.test(name(h, x)))),
    vibration: find((x) => x.startsWith("binary_sensor.") && (["vibration", "moving"].includes(dcOf(h, x)) || /vibra|movimiento|moving/.test(name(h, x)))),
    temperature: find((x) => x.startsWith("sensor.") && dcOf(h, x) === "temperature"),
    battery:
      find((x) => x.startsWith("sensor.") && dcOf(h, x) === "battery") ??
      find((x) => x.startsWith("binary_sensor.") && dcOf(h, x) === "battery"),
    node: find((x) => x.startsWith("sensor.") && /_node_status$/.test(x)),
    x: find((x) => x.startsWith("sensor.") && /(x[ _-]?axis|eje[ _-]?x|_x$)/.test(name(h, x))),
    y: find((x) => x.startsWith("sensor.") && /(y[ _-]?axis|eje[ _-]?y|_y$)/.test(name(h, x))),
    z: find((x) => x.startsWith("sensor.") && /(z[ _-]?axis|eje[ _-]?z|_z$)/.test(name(h, x))),
  };
}

/** Current accelerometer reading of a sensor's device, or undefined. */
export function xyzOf(h: HomeAssistant, id: string): XYZ | undefined {
  const p = parts(h, id);
  if (!p.x || !p.y || !p.z) return undefined;
  const v = [p.x, p.y, p.z].map((s) => Number(h.states[s!]?.state));
  if (v.some((n) => !Number.isFinite(n))) return undefined;
  return { x: v[0], y: v[1], z: v[2] };
}

const dist = (a: XYZ, b: XYZ) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/**
 * Position from the recorded readings: the closest one wins, as long as it is
 * clearly closer than the others (or, alone, within a small margin).
 */
export function positionOf(h: HomeAssistant, c: ContactConfig, id: string): PositionKey | undefined {
  const refs = c.positions?.[id];
  if (!refs || !(refs.vent || refs.tilt)) return undefined;
  const now = xyzOf(h, id);
  if (!now) return undefined;
  const list = (Object.entries(refs) as [PositionKey, XYZ][]).filter(([, v]) => v).map(([k, v]) => ({ k, d: dist(now, v), v }));
  list.sort((a, b) => a.d - b.d);
  const best = list[0];
  const second = list[1];
  const margin = second ? Math.max(40, dist(best.v, second.v) * 0.5) : 60;
  return best.d <= margin ? best.k : undefined;
}

export type Look = "closed" | "open" | "vent" | "tilt" | "unavailable";

/** Open beats everything; a recorded ventilation / tilt position comes next. */
export function lookOf(h: HomeAssistant, c: ContactConfig, id = c.entity): Look {
  const e = h.states[id];
  if (isUnavailable(e)) return "unavailable";
  if (isOpen(e)) return "open";
  const pos = positionOf(h, c, id);
  if (pos === "vent" || pos === "tilt") return pos;
  return "closed";
}

/** "Abierta", "Ventilación", "Abatida", "Cerrada". */
export const lookWord = (h: HomeAssistant, look: Look) =>
  t(h, look === "open" ? "ct_open" : look === "vent" ? "ct_vent" : look === "tilt" ? "ct_tilt" : look === "unavailable" ? "unavailable" : "ct_closed");

/** Minutes in the current state. */
export const minutesIn = (e?: HassEntity) => (e ? (Date.now() - new Date(e.last_changed).getTime()) / 60_000 : 0);

// ---- Icons --------------------------------------------------------------------------

const PATHS: Record<string, ReturnType<typeof svg>> = {
  doorC: svg`<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21"></path><path d="M3 21h18"></path><circle cx="15.5" cy="12.5" r=".9" fill="currentColor"></circle>`,
  doorO: svg`<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21" opacity=".45"></path><path d="M3 21h18"></path><path d="M5 3l8 2.5V21L5 21z" fill="currentColor" fill-opacity=".25"></path><circle cx="11" cy="13" r=".9" fill="currentColor"></circle>`,
  windowC: svg`<rect x="4" y="3" width="16" height="18" rx="1.5"></rect><path d="M12 3v18M4 12h16"></path>`,
  windowO: svg`<rect x="4" y="3" width="16" height="18" rx="1.5" opacity=".45"></rect><path d="M12 3v18"></path><path d="M12 3l6.5 2.5v15L12 21" fill="currentColor" fill-opacity=".25"></path>`,
  balconyC: svg`<rect x="5" y="2.5" width="14" height="19" rx="1.5"></rect><path d="M12 2.5v19"></path><path d="M10 12h.01M14 12h.01"></path>`,
  balconyO: svg`<rect x="5" y="2.5" width="14" height="19" rx="1.5" opacity=".45"></rect><path d="M12 2.5v19"></path><path d="M12 2.5l5.5 2.2v14.6L12 21.5" fill="currentColor" fill-opacity=".25"></path>`,
  windowV: svg`<rect x="4" y="3" width="16" height="18" rx="1.5"></rect><path d="M12 3v18M4 12h16" opacity=".45"></path><path d="M4 3l3 3.2h10L20 3" fill="currentColor" fill-opacity=".3"></path><path d="M12 7.5v3M10.5 9 12 7.5 13.5 9"></path>`,
  balconyV: svg`<rect x="5" y="2.5" width="14" height="19" rx="1.5"></rect><path d="M12 2.5v19" opacity=".45"></path><path d="M5 2.5l2.4 3h9.2L19 2.5" fill="currentColor" fill-opacity=".3"></path><path d="M12 7v3.5M10.5 8.5 12 7l1.5 1.5"></path>`,
  garageC: svg`<path d="M3 21V9l9-5 9 5v12"></path><path d="M6.5 21v-9h11v9M6.5 15h11M6.5 18h11"></path>`,
  garageO: svg`<path d="M3 21V9l9-5 9 5v12"></path><path d="M6.5 21v-9h11M6.5 15h11" opacity=".45"></path>`,
  thermo: svg`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`,
  battery: svg`<rect x="2" y="7" width="18" height="10" rx="2.5"></rect><path d="M22 10.5v3"></path><rect x="4.5" y="9.5" width="13" height="5" rx="1" fill="currentColor" stroke="none"></rect>`,
  vibration: svg`<rect x="8" y="4" width="8" height="16" rx="2"></rect><path d="M4.5 8v8M2 10v4M19.5 8v8M22 10v4"></path>`,
  shield: svg`<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"></path><path d="M9 12l2 2 4-4"></path>`,
  sleep: svg`<path d="M4 13h5l-5 6h5M13 5h4l-4 5h4M19 10h3l-3 4h3"></path>`,
  bell: svg`<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"></path><path d="M10 20.5a2 2 0 0 0 4 0"></path>`,
  check: svg`<path d="M5 12.5l4.5 4.5L19 7.5"></path>`,
};

export function contactIcon(key: string, size = 24) {
  return svg`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[key] ?? PATHS.doorC}</svg>`;
}

export const kindIcon = (kind: ContactKind, open: boolean, size = 24) => contactIcon(`${kind}${open ? "O" : "C"}`, size);
/** Icon for a look: closed, open, or ventilation / tilt (windows and balcony doors). */
export const lookIcon = (kind: ContactKind, look: string, size = 24) =>
  look === "vent" || look === "tilt" ? contactIcon(kind === "window" || kind === "balcony" ? `${kind}V` : `${kind}O`, size) : kindIcon(kind, look === "open", size);

export const TINT_OPEN = "--bg:rgba(255,240,232,.95);--fg:#3d1c10;--fg2:#7a4a38;--accent:#ff7a2f";
/** Ventilation / tilted: a calm blue, it's a normal position. */
export const TINT_VENT = "--bg:rgba(235,243,255,.95);--fg:#0f2547;--fg2:#44608a;--accent:#3b82f6";
export const tintOf = (look: Look) => (look === "open" ? TINT_OPEN : look === "vent" || look === "tilt" ? TINT_VENT : "");

export function fmtMins(min: number): string {
  const m = Math.max(0, Math.floor(min));
  if (m < 60) return `${m} min`;
  const hh = Math.floor(m / 60);
  return m % 60 ? `${hh} h ${m % 60} min` : `${hh} h`;
}
