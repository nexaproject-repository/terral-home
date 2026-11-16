// Robot vacuum / mop logic, shared by the card, its window and the settings.
// Written for Roborock (sensors, selects and routine buttons on the same
// device) but works with any vacuum entity: whatever the device lacks is
// simply not shown.
//
//   Activity    vacuum state: cleaning, paused, returning, docked, idle, error.
//   What to do  Roborock has no "mode" entity: mopping only = fan speed "off",
//               vacuuming only = mop intensity "off", both = neither off.
//   Routines    the Roborock integration creates one button per routine of
//               the Roborock app (on the vacuum's device, no entity category).
//               Scripts can be added in the card settings.
//   Rooms       read once with the roborock.get_maps action; a room clean is
//               sent with vacuum.send_command app_segment_clean.
import type { HassEntity, HomeAssistant } from "../ha-types";

export interface VacuumConfig {
  entity: string;
  name?: string;
  /** Routines shown on the 2/2 card, in order (button.* or script.*). Max 3 are shown. */
  routines?: string[];
}

export type Activity = "cleaning" | "paused" | "returning" | "docked" | "idle" | "error" | "unavailable";
export type CleanMode = "vacuum" | "mop" | "both";

/** vacuum supported_features bits. */
const F = { PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 };
export const supports = (e: HassEntity, bit: keyof typeof F) => ((Number(e.attributes.supported_features) || 0) & F[bit]) !== 0;

export function activity(e?: HassEntity): Activity {
  if (!e || e.state === "unavailable" || e.state === "unknown") return "unavailable";
  const s = e.state;
  if (s === "cleaning" || s === "paused" || s === "returning" || s === "docked" || s === "error") return s;
  return "idle";
}

export const isRunning = (a: Activity) => a === "cleaning" || a === "returning";

// ---- Entities on the same device ------------------------------------------------

type Reg = { device_id?: string | null; entity_category?: string | null; translation_key?: string | null; platform?: string; hidden?: boolean };

const reg = (h: HomeAssistant, id: string) => h.entities?.[id] as Reg | undefined;

export function deviceEntities(h: HomeAssistant, vacuumId: string): string[] {
  const dev = reg(h, vacuumId)?.device_id;
  if (!dev) return [];
  return Object.entries(h.entities ?? {})
    .filter(([id, r]) => (r as Reg).device_id === dev && id !== vacuumId && h.states[id])
    .map(([id]) => id);
}

export interface Parts {
  battery?: string;
  progress?: string;
  area?: string;
  time?: string;
  error?: string;
  room?: string;
  mopIntensity?: string;
  mopMode?: string;
  map?: string;
}

/** Finds the useful sensors / selects of the vacuum's device, by translation key first, then by id. */
export function parts(h: HomeAssistant, vacuumId: string): Parts {
  const ids = deviceEntities(h, vacuumId);
  const find = (domain: string, keys: string[], re: RegExp, test: (id: string) => boolean = () => true) =>
    ids.find((id) => id.startsWith(domain) && keys.includes(String(reg(h, id)?.translation_key)) && test(id)) ??
    ids.find((id) => id.startsWith(domain) && re.test(id) && test(id));
  const unit = (id: string) => String(h.states[id]?.attributes.unit_of_measurement ?? "");
  return {
    battery: ids.find((id) => id.startsWith("sensor.") && h.states[id].attributes.device_class === "battery"),
    progress: find("sensor.", ["cleaning_progress", "clean_percent"], /(progress|percent|progreso)/, (id) => unit(id) === "%" && h.states[id].attributes.device_class !== "battery"),
    area: find("sensor.", ["cleaning_area"], /(cleaning_area|clean_area|area_limpi)/, (id) => !/total/.test(id)),
    time: find("sensor.", ["cleaning_time"], /(cleaning_time|clean_time|tiempo_de_limpieza)/, (id) => !/total/.test(id)),
    error: find("sensor.", ["vacuum_error"], /(vacuum_error|_error$)/, (id) => !/dock/.test(id)),
    room: find("sensor.", ["current_room"], /(current_room|habitacion_actual)/),
    mopIntensity: find("select.", ["mop_intensity"], /(mop_intensity|water|agua|intensidad)/),
    mopMode: find("select.", ["mop_mode"], /(mop_mode|modo_de_mopa|modo_mopa)/),
    map: find("select.", ["selected_map"], /(selected_map|mapa)/),
  };
}

const num = (h: HomeAssistant, id?: string): number | null => {
  if (!id) return null;
  const n = parseFloat(h.states[id]?.state ?? "");
  return Number.isFinite(n) ? n : null;
};

export function battery(h: HomeAssistant, e: HassEntity, p: Parts): number | null {
  const n = num(h, p.battery) ?? parseFloat(e.attributes.battery_level);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export const progress = (h: HomeAssistant, p: Parts) => {
  const n = num(h, p.progress);
  return n == null ? null : Math.max(0, Math.min(100, Math.round(n)));
};

export const area = (h: HomeAssistant, p: Parts) => num(h, p.area);

/** Cleaning time in minutes, whatever unit the sensor reports. */
export function minutes(h: HomeAssistant, p: Parts): number | null {
  const n = num(h, p.time);
  if (n == null) return null;
  const u = String(h.states[p.time!]?.attributes.unit_of_measurement ?? "s");
  return Math.round(u === "h" ? n * 60 : u === "min" ? n : n / 60);
}

export function currentRoom(h: HomeAssistant, p: Parts): string | undefined {
  const s = p.room ? h.states[p.room]?.state : undefined;
  return s && !["unknown", "unavailable", "none", ""].includes(s) ? s : undefined;
}

/** Error code from the error sensor ("none" means no error), or undefined. */
export function errorCode(h: HomeAssistant, e: HassEntity, p: Parts): string | undefined {
  const s = p.error ? h.states[p.error]?.state : undefined;
  if (s && !["none", "unknown", "unavailable", "ok", ""].includes(s)) return s;
  return activity(e) === "error" ? String(e.attributes.error ?? e.attributes.status ?? "") || undefined : undefined;
}

// ---- What to do: vacuum / mop / both ---------------------------------------------

export const fanList = (e: HassEntity): string[] => (Array.isArray(e.attributes.fan_speed_list) ? e.attributes.fan_speed_list : []);
export const options = (h: HomeAssistant, id?: string): string[] => (id && Array.isArray(h.states[id]?.attributes.options) ? h.states[id].attributes.options : []);

const lastFan = new Map<string, string>();
const lastWater = new Map<string, string>();

/** Keeps the last non-"off" fan speed / water so "both" can bring them back. */
export function remember(h: HomeAssistant, e: HassEntity, p: Parts) {
  const f = e.attributes.fan_speed as string | undefined;
  if (f && f !== "off") lastFan.set(e.entity_id, f);
  const w = p.mopIntensity ? h.states[p.mopIntensity]?.state : undefined;
  if (w && w !== "off" && w !== "unavailable") lastWater.set(e.entity_id, w);
}

export interface ModeInfo {
  /** Modes that can be chosen on this robot. Empty = no "what to do" row. */
  modes: CleanMode[];
  current: CleanMode;
}

export function modeInfo(h: HomeAssistant, e: HassEntity, p: Parts): ModeInfo {
  const fans = fanList(e);
  const water = options(h, p.mopIntensity);
  if (!water.length) return { modes: [], current: "vacuum" };
  const canMopOnly = fans.includes("off");
  const canVacOnly = water.includes("off");
  const modes: CleanMode[] = [...(canVacOnly ? (["vacuum"] as const) : []), ...(canMopOnly ? (["mop"] as const) : []), "both"];
  const fanOff = e.attributes.fan_speed === "off";
  const waterOff = h.states[p.mopIntensity!]?.state === "off";
  const current: CleanMode = fanOff && !waterOff ? "mop" : waterOff ? "vacuum" : "both";
  return { modes: modes.length > 1 ? modes : [], current };
}

const firstOn = (list: string[], prefer: string[]) => prefer.find((x) => list.includes(x)) ?? list.find((x) => x !== "off");

export async function setCleanMode(h: HomeAssistant, e: HassEntity, p: Parts, m: CleanMode) {
  const fans = fanList(e);
  const water = options(h, p.mopIntensity);
  const fan = lastFan.get(e.entity_id) ?? firstOn(fans, ["balanced", "standard", "medium"]);
  const wet = lastWater.get(e.entity_id) ?? firstOn(water, ["moderate", "medium", "standard", "mild"]);
  const setFan = (v?: string) => v && e.attributes.fan_speed !== v && h.callService("vacuum", "set_fan_speed", { fan_speed: v }, { entity_id: e.entity_id });
  const setWater = (v?: string) => v && p.mopIntensity && h.states[p.mopIntensity]?.state !== v && h.callService("select", "select_option", { option: v }, { entity_id: p.mopIntensity });
  if (m === "vacuum") await Promise.all([setWater("off"), e.attributes.fan_speed === "off" ? setFan(fan) : undefined]);
  else if (m === "mop") await Promise.all([setFan("off"), h.states[p.mopIntensity!]?.state === "off" ? setWater(wet) : undefined]);
  else await Promise.all([e.attributes.fan_speed === "off" ? setFan(fan) : undefined, h.states[p.mopIntensity!]?.state === "off" ? setWater(wet) : undefined]);
}

// ---- Commands ----------------------------------------------------------------------

const call = (h: HomeAssistant, e: HassEntity, service: string, data: Record<string, unknown> = {}) =>
  h.callService("vacuum", service, data, { entity_id: e.entity_id });

export const start = (h: HomeAssistant, e: HassEntity) => call(h, e, "start");
export const pause = (h: HomeAssistant, e: HassEntity) => call(h, e, "pause");
export const toBase = (h: HomeAssistant, e: HassEntity) => call(h, e, "return_to_base");
export const locate = (h: HomeAssistant, e: HassEntity) => call(h, e, "locate");
export const setFan = (h: HomeAssistant, e: HassEntity, v: string) => call(h, e, "set_fan_speed", { fan_speed: v });
export const selectOption = (h: HomeAssistant, id: string, v: string) => h.callService("select", "select_option", { option: v }, { entity_id: id });

/** Cleans only these Roborock rooms (segment ids). */
export const cleanRooms = (h: HomeAssistant, e: HassEntity, rooms: number[]) =>
  call(h, e, "send_command", { command: "app_segment_clean", params: [{ segments: rooms, repeat: 1 }] });

// ---- Rooms (Roborock) -----------------------------------------------------------------

export interface Room {
  id: number;
  name: string;
}

const roomCache = new Map<string, Promise<Room[]>>();

/** Rooms of the map in use, from roborock.get_maps. Empty for other vacuums or on error. */
export function loadRooms(h: HomeAssistant, e: HassEntity, p: Parts): Promise<Room[]> {
  if (reg(h, e.entity_id)?.platform !== "roborock") return Promise.resolve([]);
  const map = p.map ? h.states[p.map]?.state : undefined;
  const key = `${e.entity_id}|${map ?? ""}`;
  if (!roomCache.has(key)) {
    roomCache.set(
      key,
      h
        .callWS<{ response?: Record<string, { maps?: { name?: string; rooms?: Record<string, string> }[] }> }>({
          type: "call_service",
          domain: "roborock",
          service: "get_maps",
          target: { entity_id: e.entity_id },
          return_response: true,
        })
        .then((res) => {
          const maps = res.response?.[e.entity_id]?.maps ?? [];
          const m = maps.find((x) => x.name && x.name === map) ?? maps[0];
          return Object.entries(m?.rooms ?? {})
            .map(([id, name]) => ({ id: Number(id), name }))
            .filter((r) => Number.isFinite(r.id) && r.name);
        })
        .catch(() => {
          roomCache.delete(key);
          return [];
        }),
    );
  }
  return roomCache.get(key)!;
}

// ---- Routines -------------------------------------------------------------------------

/** Routine buttons of the device (no entity category: the reset-consumable buttons have one). */
export function deviceRoutines(h: HomeAssistant, vacuumId: string): string[] {
  return deviceEntities(h, vacuumId).filter((id) => id.startsWith("button.") && !reg(h, id)?.entity_category && !reg(h, id)?.hidden);
}

/** Every routine to offer: the device's, plus scripts / buttons added in the settings. */
export function allRoutines(h: HomeAssistant, c: VacuumConfig): string[] {
  const dev = deviceRoutines(h, c.entity);
  const extra = (c.routines ?? []).filter((id) => !dev.includes(id) && h.states[id]);
  return [...dev, ...extra];
}

/** The (up to) 3 routines shown on the 2/2 card. */
export function favourites(h: HomeAssistant, c: VacuumConfig): string[] {
  const chosen = (c.routines ?? []).filter((id) => h.states[id]);
  return (chosen.length ? chosen : deviceRoutines(h, c.entity)).slice(0, 3);
}

export const runRoutine = (h: HomeAssistant, id: string) =>
  id.startsWith("script.") ? h.callService("script", "turn_on", {}, { entity_id: id }) : h.callService("button", "press", {}, { entity_id: id });

/** Routine name without the robot's name in front ("Roborock S8 Diaria" → "Diaria"). */
export function routineName(h: HomeAssistant, id: string, robotName?: string): string {
  const n = String(h.states[id]?.attributes.friendly_name ?? id.split(".")[1].replace(/_/g, " "));
  if (robotName && n.toLowerCase().startsWith(robotName.toLowerCase() + " ")) return n.slice(robotName.length + 1);
  return n;
}

/** Vacuum-ish scripts offered in the settings next to the device routines. */
export const isVacuumScript = (h: HomeAssistant, id: string) =>
  id.startsWith("script.") && /(aspir|robot|vacuum|roborock|limpi|freg|mop|clean)/i.test(id + " " + (h.states[id]?.attributes.friendly_name ?? ""));
