// EV charger helpers: lock state (with "invert"), car state, sensor
// auto-detection on the same device, and charging history.
import type { HassEntity, HomeAssistant } from "../ha-types";

export interface ChargerConfig {
  entity: string;
  name?: string;
  /** Flip the meaning of on / off (or locked / unlocked). */
  invert?: boolean;
  status_entity?: string;
  power_entity?: string;
  energy_entity?: string;
  /** kW, for the power bar. */
  max_power?: number;
}

export type CarState = "none" | "connected" | "charging" | "unknown";

export const LOCK_DOMAINS = ["switch", "lock", "input_boolean"];
export const domainOf = (id: string) => id.split(".")[0];
export const isLockDomain = (id: string) => domainOf(id) === "lock";

const KEYWORDS = /(wallbox|charger|cargador|evse|ev_|_ev|easee|zappi|ocpp|pulsar|wall_box|recarga)/i;
export const looksLikeCharger = (id: string, name: string) => KEYWORDS.test(id) || KEYWORDS.test(name);

/**
 * True when the charger is blocked.
 * Default meaning: switch / input_boolean ON = charging allowed (unlocked);
 * lock LOCKED = blocked. `invert` flips it.
 */
export function isLocked(e: HassEntity, invert = false): boolean {
  const active = isLockDomain(e.entity_id) ? e.state === "locked" : e.state === "on";
  const lockedWhenActive = isLockDomain(e.entity_id);
  return (active === lockedWhenActive) !== invert;
}

export function setLocked(h: HomeAssistant, e: HassEntity, locked: boolean, invert = false) {
  const id = e.entity_id;
  // Which raw state means "locked" with this configuration?
  const lockedRawActive = isLockDomain(id) ? !invert : invert;
  const wantActive = locked ? lockedRawActive : !lockedRawActive;
  if (isLockDomain(id)) return h.callService("lock", wantActive ? "lock" : "unlock", {}, { entity_id: id });
  return h.callService(domainOf(id), wantActive ? "turn_on" : "turn_off", {}, { entity_id: id });
}

/** Words that describe what pressing Bloquear does, for the settings explanation. */
export function rawWords(id: string) {
  return isLockDomain(id) ? { active: "locked", inactive: "unlocked" } : { active: "on", inactive: "off" };
}

/** Raw state that means "locked" with this configuration ("active" or "inactive"). */
export const lockedRaw = (id: string, invert = false): "active" | "inactive" =>
  (isLockDomain(id) ? !invert : invert) ? "active" : "inactive";

const unavailable = (e?: HassEntity) => !e || e.state === "unavailable" || e.state === "unknown";

/** Power in kW, or null. */
export function powerKw(h: HomeAssistant, id?: string): number | null {
  const e = id ? h.states[id] : undefined;
  if (unavailable(e)) return null;
  const v = Number(e!.state);
  if (!Number.isFinite(v)) return null;
  const unit = String(e!.attributes.unit_of_measurement ?? "kW");
  return unit === "W" ? v / 1000 : unit === "MW" ? v * 1000 : v;
}

/** Energy in kWh, or null. */
export function energyKwh(h: HomeAssistant, id?: string): number | null {
  const e = id ? h.states[id] : undefined;
  if (unavailable(e)) return null;
  const v = Number(e!.state);
  if (!Number.isFinite(v)) return null;
  const unit = String(e!.attributes.unit_of_measurement ?? "kWh");
  return unit === "Wh" ? v / 1000 : unit === "MWh" ? v * 1000 : v;
}

const CHARGING_W = 0.05; // kW

/** Car state from the status sensor (text or plug binary_sensor), falling back to power. */
export function carState(h: HomeAssistant, ids: Resolved): CarState {
  const p = powerKw(h, ids.power);
  const st = ids.status ? h.states[ids.status] : undefined;
  if (st && !unavailable(st)) {
    if (st.entity_id.startsWith("binary_sensor.")) {
      if (st.state !== "on") return "none";
      return p != null && p > CHARGING_W ? "charging" : "connected";
    }
    const s = String(st.state).toLowerCase();
    if (/discharg/.test(s)) return "connected";
    if (/charging|cargando|en carga/.test(s)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(s)) {
      return p != null && p > CHARGING_W ? "charging" : "none";
    }
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(s)) {
      return p != null && p > CHARGING_W ? "charging" : "connected";
    }
  }
  if (p != null) return p > CHARGING_W ? "charging" : "unknown";
  return "unknown";
}

// ---- Auto-detection --------------------------------------------------------

export interface Resolved {
  status?: string;
  power?: string;
  energy?: string;
}

type Reg = { device_id?: string | null; hidden?: boolean; entity_category?: string | null };

export function siblings(h: HomeAssistant, id: string): string[] {
  const dev = (h.entities?.[id] as Reg | undefined)?.device_id;
  if (!dev) return [];
  return Object.entries(h.entities ?? {})
    .filter(([eid, r]) => eid !== id && (r as Reg).device_id === dev)
    .map(([eid]) => eid);
}

const unitOf = (h: HomeAssistant, id: string) => String(h.states[id]?.attributes.unit_of_measurement ?? "");
export const isPowerSensor = (h: HomeAssistant, id: string) => id.startsWith("sensor.") && ["W", "kW", "MW"].includes(unitOf(h, id));
export const isEnergySensor = (h: HomeAssistant, id: string) => id.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(unitOf(h, id));
export const isStatusSensor = (h: HomeAssistant, id: string) => {
  const s = h.states[id];
  if (!s) return false;
  if (id.startsWith("binary_sensor.")) return ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(id);
  return id.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state));
};

/** Config entities, falling back to sensors of the same device. */
export function resolveEntities(h: HomeAssistant, c: ChargerConfig): Resolved {
  const sib = siblings(h, c.entity);
  const pick = (test: (id: string) => boolean, prefer?: RegExp) => {
    const list = sib.filter((id) => h.states[id] && test(id));
    return (prefer && list.find((id) => prefer.test(id))) || list[0];
  };
  // "none" = the user chose not to use that data at all.
  const choose = (v: string | undefined, auto: () => string | undefined) => (v === "none" ? undefined : v || auto());
  return {
    status: choose(c.status_entity, () => pick((id) => isStatusSensor(h, id), /status|estado/i)),
    power: choose(c.power_entity, () => pick((id) => isPowerSensor(h, id), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: choose(c.energy_entity, () => pick((id) => isEnergySensor(h, id), /added|session|sesion|sesión|charge|carga/i)),
  };
}

/** Guess for a freshly added charger: switches called "…lock…" mean on = locked. */
export function guessInvert(h: HomeAssistant, id: string): boolean {
  if (isLockDomain(id)) return false;
  const name = String(h.states[id]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(id + " " + name);
}

// ---- History ---------------------------------------------------------------

export interface Session {
  start: number;
  end: number;
  kwh: number;
  maxKw: number;
  live: boolean;
}

type HistPoint = { s: string; lu: number };

/** Power history (kW) for one entity since `from`. */
export async function powerHistory(h: HomeAssistant, id: string, from: Date): Promise<[number, number][]> {
  const res = await h.callWS<Record<string, HistPoint[]>>({
    type: "history/history_during_period",
    start_time: from.toISOString(),
    entity_ids: [id],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  const unit = unitOf(h, id);
  const k = unit === "W" ? 1 / 1000 : unit === "MW" ? 1000 : 1;
  return (res[id] ?? [])
    .map((p) => [p.lu * 1000, Number(p.s) * k] as [number, number])
    .filter(([, v]) => Number.isFinite(v));
}

/** Charging sessions: power above the threshold, gaps under 15 min merged. */
export function sessionsFrom(points: [number, number][], now = Date.now()): Session[] {
  const out: Session[] = [];
  let cur: Session | undefined;
  for (let i = 0; i < points.length; i++) {
    const [t, v] = points[i];
    const next = i + 1 < points.length ? points[i + 1][0] : now;
    const dt = Math.max(0, next - t) / 3_600_000;
    if (v > CHARGING_W) {
      if (cur && t - cur.end > 15 * 60_000) {
        out.push(cur);
        cur = undefined;
      }
      cur ??= { start: t, end: t, kwh: 0, maxKw: 0, live: false };
      cur.kwh += v * dt;
      cur.end = next;
      cur.maxKw = Math.max(cur.maxKw, v);
    }
  }
  if (cur) {
    cur.live = points.length > 0 && points[points.length - 1][1] > CHARGING_W;
    out.push(cur);
  }
  return out.filter((s) => s.kwh >= 0.05 || s.live);
}

/** kWh per calendar day for the last `days` days (oldest first). */
export function perDay(sessions: Session[], days = 7, now = new Date()): { day: Date; kwh: number }[] {
  const res: { day: Date; kwh: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    res.push({ day: d, kwh: 0 });
  }
  for (const s of sessions) {
    const d = new Date(s.start);
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const slot = res.find((r) => r.day.getTime() === key);
    if (slot) slot.kwh += s.kwh;
  }
  return res;
}

export const fmtNum = (h: HomeAssistant | undefined, n: number, d = 1) =>
  n.toLocaleString(h?.locale?.language ?? h?.language ?? undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export const fmtDuration = (ms: number) => {
  const m = Math.max(0, Math.round(ms / 60000));
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`;
};
