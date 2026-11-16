// Switch helpers: on/off, the meter sensors of the same device, and the history
// the card and the window show (on periods, consumption per hour / day, who
// switched it).
import type { HassEntity, HomeAssistant } from "../ha-types";
import { isEnergySensor, isPowerSensor, siblings } from "../charger/charger-model";

export type SwitchStyle = "a" | "b" | "c";

export interface SwitchConfig {
  entity: string;
  name?: string;
  /** Icon key (switch-look SWITCH_ICONS); guessed from the name when missing. */
  icon?: string;
  /** Colour key (switch-look SWITCH_COLORS); amber when missing. */
  color?: string;
  /** What the 2/2 card shows: a = data, b = consumption, c = timeline of the day (default). */
  style?: SwitchStyle;
  power_entity?: string;
  energy_entity?: string;
}

export const SWITCH_DOMAINS = ["switch", "input_boolean", "light", "fan"];
export const isSwitchEntity = (id: string) => SWITCH_DOMAINS.includes(id.split(".")[0]);

export const isOn = (e?: HassEntity) => e?.state === "on";
export const isUnavailable = (e?: HassEntity) => !e || e.state === "unavailable" || e.state === "unknown";

export function toggle(h: HomeAssistant, e: HassEntity) {
  const domain = e.entity_id.split(".")[0];
  return h.callService(domain, isOn(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}

// ---- Meter sensors ------------------------------------------------------------

export interface Meter {
  power?: string;
  energy?: string;
}

/** Config sensors, falling back to the power / energy sensors of the same device. */
export function meterOf(h: HomeAssistant, c: SwitchConfig): Meter {
  const sib = siblings(h, c.entity).filter((id) => h.states[id]);
  const pick = (test: (id: string) => boolean, prefer: RegExp) => {
    const list = sib.filter(test);
    return list.find((id) => prefer.test(id)) ?? list[0];
  };
  const choose = (v: string | undefined, auto: () => string | undefined) => (v === "none" ? undefined : v || auto());
  return {
    power: choose(c.power_entity, () => pick((id) => isPowerSensor(h, id), /power|potencia|consumo/i)),
    energy: choose(c.energy_entity, () =>
      pick((id) => isEnergySensor(h, id), /energy|energ|consum|total/i)),
  };
}

const unitOf = (h: HomeAssistant, id: string) => String(h.states[id]?.attributes.unit_of_measurement ?? "");

/** Current power in kW, or null. */
export function powerNow(h: HomeAssistant, id?: string): number | null {
  const e = id ? h.states[id] : undefined;
  if (!e || isUnavailable(e)) return null;
  const v = Number(e.state);
  if (!Number.isFinite(v)) return null;
  const u = unitOf(h, e.entity_id);
  return u === "W" ? v / 1000 : u === "MW" ? v * 1000 : v;
}

// ---- History -------------------------------------------------------------------

export interface Span {
  start: number;
  end: number;
  live: boolean;
}

export interface Day {
  day: Date;
  kwh: number | null;
  onMs: number;
}

export interface Usage {
  /** "On" periods since `from`, oldest first. */
  spans: Span[];
  /** kWh in each hour of today (24 values), or null without a meter. */
  hourly: number[] | null;
  /** On-minutes in each hour of today. */
  hourlyOn: number[];
  /** kWh today, or null without a meter. */
  kwhToday: number | null;
  onToday: number;
  /** One entry per day (oldest first), only when asked for several days. */
  days: Day[];
  /** Integrate kWh between two times (null without a meter). */
  kwhBetween: (a: number, b: number) => number | null;
}

type HistPoint = { s: string; lu: number };

async function history(h: HomeAssistant, ids: string[], from: Date): Promise<Record<string, HistPoint[]>> {
  return h.callWS<Record<string, HistPoint[]>>({
    type: "history/history_during_period",
    start_time: from.toISOString(),
    entity_ids: ids,
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
}

const midnight = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** On periods from a state history. */
export function spansFrom(points: HistPoint[], now: number): Span[] {
  const out: Span[] = [];
  let cur: Span | undefined;
  for (const p of points) {
    const t = p.lu * 1000;
    if (p.s === "on") {
      if (!cur) cur = { start: t, end: now, live: true };
    } else if (cur && p.s !== "unavailable" && p.s !== "unknown") {
      cur.end = t;
      cur.live = false;
      out.push(cur);
      cur = undefined;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** Overlap in ms of a span with [a, b). */
const overlap = (s: Span, a: number, b: number) => Math.max(0, Math.min(s.end, b) - Math.max(s.start, a));

/**
 * kWh integrator from either a power history (step, kW) or an energy history
 * (counter: positive steps add up, resets are ignored).
 */
function integrator(h: HomeAssistant, m: Meter, hist: Record<string, HistPoint[]>, now: number) {
  if (m.power && hist[m.power]?.length) {
    const u = unitOf(h, m.power);
    const k = u === "W" ? 1 / 1000 : u === "MW" ? 1000 : 1;
    const pts = hist[m.power].map((p) => [p.lu * 1000, Number(p.s) * k] as [number, number]).filter(([, v]) => Number.isFinite(v));
    return (a: number, b: number) => {
      let kwh = 0;
      for (let i = 0; i < pts.length; i++) {
        const t0 = pts[i][0];
        const t1 = i + 1 < pts.length ? pts[i + 1][0] : now;
        const ms = Math.max(0, Math.min(t1, b) - Math.max(t0, a));
        if (ms > 0) kwh += Math.max(0, pts[i][1]) * (ms / 3_600_000);
      }
      return kwh;
    };
  }
  if (m.energy && hist[m.energy]?.length) {
    const u = unitOf(h, m.energy);
    const k = u === "Wh" ? 1 / 1000 : u === "MWh" ? 1000 : 1;
    const pts = hist[m.energy].map((p) => [p.lu * 1000, Number(p.s) * k] as [number, number]).filter(([, v]) => Number.isFinite(v));
    return (a: number, b: number) => {
      let kwh = 0;
      for (let i = 1; i < pts.length; i++) {
        const d = pts[i][1] - pts[i - 1][1];
        if (d > 0 && pts[i][0] >= a && pts[i][0] < b) kwh += d;
      }
      return kwh;
    };
  }
  return null;
}

/** Usage of the last `days` days (1 = today only). */
export async function loadUsage(h: HomeAssistant, c: SwitchConfig, days = 1): Promise<Usage> {
  const now = Date.now();
  const today = midnight();
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1));
  const m = meterOf(h, c);
  const ids = [c.entity, m.power ?? m.energy].filter(Boolean) as string[];
  const hist = await history(h, ids, from);
  const spans = spansFrom(hist[c.entity] ?? [], now);
  const kwh = integrator(h, m, hist, now);
  const t0 = today.getTime();
  const hourly = kwh ? Array.from({ length: 24 }, (_, i) => kwh(t0 + i * 3_600_000, t0 + (i + 1) * 3_600_000)) : null;
  const hourlyOn = Array.from({ length: 24 }, (_, i) => spans.reduce((a, s) => a + overlap(s, t0 + i * 3_600_000, t0 + (i + 1) * 3_600_000), 0) / 60_000);
  const list: Day[] = [];
  if (days > 1) {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const a = d.getTime();
      const b = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
      list.push({ day: d, kwh: kwh ? kwh(a, b) : null, onMs: spans.reduce((x, s) => x + overlap(s, a, b), 0) });
    }
  }
  return {
    spans,
    hourly,
    hourlyOn,
    kwhToday: kwh ? kwh(t0, now) : null,
    onToday: spans.reduce((a, s) => a + overlap(s, t0, now), 0),
    days: list,
    kwhBetween: (a, b) => (kwh ? kwh(a, b) : null),
  };
}

// Small cache so several cards of the same switch share one request.
const cache = new Map<string, { at: number; key: string; p: Promise<Usage> }>();

/** Today's usage, refreshed when the switch changes or after 5 minutes. */
export function todayUsage(h: HomeAssistant, c: SwitchConfig): Promise<Usage> {
  const e = h.states[c.entity];
  const m = meterOf(h, c);
  const key = `${e?.last_changed}|${m.power}|${m.energy}|${midnight().getTime()}`;
  const hit = cache.get(c.entity);
  if (hit && hit.key === key && Date.now() - hit.at < 5 * 60_000) return hit.p;
  const p = loadUsage(h, c, 1);
  cache.set(c.entity, { at: Date.now(), key, p });
  p.catch(() => cache.delete(c.entity));
  return p;
}

// ---- Who switched it ---------------------------------------------------------------

export interface Cause {
  kind: "automation" | "script" | "you" | "user" | "unknown";
  name?: string;
}

type LogEntry = {
  when: number;
  state?: string;
  context_user_id?: string;
  context_event_type?: string;
  context_domain?: string;
  context_name?: string;
  context_entity_id?: string;
  context_entity_id_name?: string;
};

/** Logbook causes of the switch's changes since `from`, keyed by time (ms). */
export async function loadCauses(h: HomeAssistant, id: string, from: Date): Promise<{ t: number; state?: string; cause: Cause }[]> {
  const res = await h.callWS<LogEntry[]>({
    type: "logbook/get_events",
    start_time: from.toISOString(),
    end_time: new Date().toISOString(),
    entity_ids: [id],
  });
  const me = (h.user as { id?: string } | undefined)?.id;
  return (res ?? []).map((r) => {
    const name = r.context_name || r.context_entity_id_name || r.context_entity_id;
    let cause: Cause = { kind: "unknown" };
    if (r.context_event_type === "automation_triggered" || r.context_domain === "automation") cause = { kind: "automation", name };
    else if (r.context_event_type === "script_started" || r.context_domain === "script") cause = { kind: "script", name };
    else if (r.context_user_id) cause = { kind: r.context_user_id === me ? "you" : "user" };
    return { t: r.when * 1000, state: r.state, cause };
  });
}

// ---- Formatting --------------------------------------------------------------------

export const fmtKwh = (h: HomeAssistant | undefined, n: number) =>
  `${n.toLocaleString(h?.locale?.language ?? h?.language ?? undefined, { minimumFractionDigits: n < 10 ? 1 : 0, maximumFractionDigits: n < 10 ? 1 : 0 })} kWh`;

export const fmtKw = (h: HomeAssistant | undefined, kw: number) =>
  kw < 1
    ? `${Math.round(kw * 1000).toLocaleString(h?.locale?.language ?? undefined)} W`
    : `${kw.toLocaleString(h?.locale?.language ?? h?.language ?? undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`;

/** "2 h 40 min", "35 min", "10 h". */
export function fmtSpan(ms: number): string {
  const m = Math.max(0, Math.round(ms / 60_000));
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  if (!hh) return `${mm} min`;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
}

export const fmtTime = (h: HomeAssistant | undefined, t: number | string) =>
  new Date(t).toLocaleTimeString(h?.locale?.language ?? h?.language ?? undefined, { hour: "2-digit", minute: "2-digit" });
