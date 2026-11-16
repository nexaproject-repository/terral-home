// Home energy helpers: the configured consumers, live power of each one,
// "rest of the house" (total − measured consumers) and the history the card
// and the window show (kWh per hour today and per day for 7 days).
import type { HomeAssistant } from "../ha-types";
import { guessIcon } from "../switch/switch-look";

export type EnergyView = "flow" | "ring" | "bars";

export interface Consumer {
  entity: string;
  name?: string;
  icon?: string;
  color?: string;
}

export interface EnergyConfig {
  /** Power sensor of the whole house (the main meter). */
  entity: string;
  name?: string;
  /** No main meter: the total is the sum of the consumers (then there is no "rest"). */
  sum_only?: boolean;
  consumers?: Consumer[];
  /** Show "rest of the house" (total − consumers). Default on. */
  rest?: boolean;
  view?: EnergyView;
  /** Moving dots / bands / stripes. Default on. */
  animate?: boolean;
}

export const REST_COLOR = "amber";
/** Colours given to new consumers, in order (rest of the house is amber). */
export const CONSUMER_COLORS = ["green", "blue", "violet", "red", "teal", "pink", "orange"];

export interface Item {
  key: string;
  name: string;
  icon: string;
  color: string;
  kw: number;
  entity?: string;
  rest?: boolean;
  /** The sensor is unavailable / unknown: shown as "—", not as 0. */
  missing?: boolean;
}

export interface Live {
  total: number;
  items: Item[];
}

const unit = (h: HomeAssistant, id: string) => String(h.states[id]?.attributes.unit_of_measurement ?? "");

export const isPower = (h: HomeAssistant, id: string) => id.startsWith("sensor.") && ["W", "kW", "MW"].includes(unit(h, id));
/** An energy counter (kWh that only grows): its power is worked out from how fast it grows. */
export const isEnergy = (h: HomeAssistant, id: string) => id.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(unit(h, id));
export const isMeter = (h: HomeAssistant, id: string) => isPower(h, id) || isEnergy(h, id);

const kwhFactor = (u: string) => (u === "Wh" ? 1 / 1000 : u === "MWh" ? 1000 : 1);

// Recent readings of energy counters, to derive their power.
const samples = new Map<string, { t: number; v: number }[]>();
const RATE_WINDOW = 15 * 60_000;

function remember(id: string, t: number, v: number) {
  const list = samples.get(id) ?? [];
  if (!list.some((s) => s.t === t)) {
    list.push({ t, v });
    list.sort((a, b) => a.t - b.t);
  }
  const cut = Date.now() - 2 * RATE_WINDOW;
  samples.set(id, list.filter((s, i) => s.t >= cut || i === list.length - 1));
}

/** kW of an energy counter: growth over the last minutes (0 when it hasn't grown for 10 min). */
function rateKw(id: string): number | null {
  const list = samples.get(id) ?? [];
  const last = list[list.length - 1];
  if (!last) return null;
  if (Date.now() - last.t > 10 * 60_000) return 0;
  const base = list.find((s) => last.t - s.t <= RATE_WINDOW && last.t - s.t >= 60_000);
  if (!base) return list.length > 1 ? Math.max(0, (last.v - list[0].v) / Math.max(1 / 60, (last.t - list[0].t) / H)) : null;
  return Math.max(0, (last.v - base.v) / ((last.t - base.t) / H));
}

/** Power in kW (null when unknown). Energy counters give their recent growth rate. */
export function kwOf(h: HomeAssistant, id?: string): number | null {
  const e = id ? h.states[id] : undefined;
  if (!e || e.state === "unavailable" || e.state === "unknown") return null;
  const v = Number(e.state);
  if (!Number.isFinite(v)) return null;
  const u = unit(h, e.entity_id);
  if (isEnergy(h, e.entity_id)) {
    remember(e.entity_id, new Date(e.last_updated ?? e.last_changed).getTime(), v * kwhFactor(u));
    return rateKw(e.entity_id);
  }
  return u === "W" ? v / 1000 : u === "MW" ? v * 1000 : v;
}

/** Seeds the readings of energy counters with the last minutes of history. */
export async function seedCounters(h: HomeAssistant, ids: string[]) {
  const counters = ids.filter((id) => isEnergy(h, id) && (samples.get(id)?.length ?? 0) < 2);
  if (!counters.length) return;
  const res = await h.callWS<Record<string, HistPoint[]>>({
    type: "history/history_during_period",
    start_time: new Date(Date.now() - RATE_WINDOW).toISOString(),
    entity_ids: counters,
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  for (const id of counters) {
    const k = kwhFactor(unit(h, id));
    for (const p of res[id] ?? []) {
      const v = Number(p.s);
      if (Number.isFinite(v)) remember(id, p.lu * 1000, v * k);
    }
  }
}

export function consumerIcon(c: Consumer, name: string): string {
  if (c.icon) return c.icon;
  const n = `${name} ${c.entity}`.toLowerCase();
  if (/coche|wallbox|cargador|charger|\bev\b|veh[ií]culo/.test(n)) return "car";
  if (/aire|clima|split|\bac\b|aerotermia|bomba de calor|heat pump/.test(n)) return "snow";
  return guessIcon(n);
}

export const consumerName = (h: HomeAssistant, c: Consumer) =>
  c.name || String(h.states[c.entity]?.attributes.friendly_name ?? c.entity);

export const showRest = (c: EnergyConfig) => !c.sum_only && c.rest !== false;

/** Live power of every consumer, plus "rest", and the total. */
export function live(h: HomeAssistant, c: EnergyConfig, restName: string): Live {
  const items: Item[] = (c.consumers ?? []).map((x, i) => {
    const name = consumerName(h, x);
    return {
      key: `c${i}`,
      name,
      icon: consumerIcon(x, name),
      color: x.color ?? CONSUMER_COLORS[i % CONSUMER_COLORS.length],
      kw: Math.max(0, kwOf(h, x.entity) ?? 0),
      entity: x.entity,
      missing: kwOf(h, x.entity) == null,
    };
  });
  const sum = items.reduce((a, x) => a + x.kw, 0);
  const meter = c.sum_only ? null : kwOf(h, c.entity);
  // A meter that lags (or a counter between readings) never shows less than what the consumers add up to.
  const total = meter != null ? Math.max(meter, sum) : sum;
  if (showRest(c)) items.push({ key: "rest", name: restName, icon: "home", color: REST_COLOR, kw: Math.max(0, total - sum), rest: true });
  return { total, items };
}

// ---- History ------------------------------------------------------------------------

export interface EnergyUsage {
  /** kWh per item key, per hour of today (24 values). */
  hourly: Record<string, number[]>;
  /** kWh per item key, per day (oldest first). */
  days: { day: Date; kwh: Record<string, number> }[];
  /** kWh today per item key. */
  today: Record<string, number>;
  todayTotal: number;
}

type HistPoint = { s: string; lu: number };
type StatRow = { start: number | string; end?: number | string; mean?: number | null; change?: number | null };

const ts = (v: number | string) => (typeof v === "number" ? v : new Date(v).getTime());
const H = 3_600_000;

/** kWh per hour (key = hour start ms) of each power sensor or energy counter since `from`. */
async function hourlyKwh(h: HomeAssistant, ids: string[], from: Date): Promise<Record<string, Map<number, number>>> {
  const out: Record<string, Map<number, number>> = {};
  for (const id of ids) out[id] = new Map();
  // Long-term statistics: hourly mean power (kW × 1 h = kWh) or hourly growth of
  // an energy counter. Light even for a week of data.
  const stat = async (list: string[], types: string[], units: Record<string, string>) => {
    if (!list.length) return {} as Record<string, StatRow[]>;
    try {
      return await h.callWS<Record<string, StatRow[]>>({
        type: "recorder/statistics_during_period",
        start_time: from.toISOString(),
        statistic_ids: list,
        period: "hour",
        types,
        units,
      });
    } catch {
      return {} as Record<string, StatRow[]>;
    }
  };
  const counters = new Set(ids.filter((id) => isEnergy(h, id)));
  const stats = {
    ...(await stat(ids.filter((id) => !counters.has(id)), ["mean"], { power: "kW" })),
    ...(await stat([...counters], ["change"], { energy: "kWh" })),
  };
  let lastHour = from.getTime();
  for (const id of ids) {
    for (const r of stats[id] ?? []) {
      const v = counters.has(id) ? r.change : r.mean;
      if (v == null) continue;
      const s = ts(r.start);
      out[id].set(s, Math.max(0, v));
      lastHour = Math.max(lastHour, s + H);
    }
  }
  // The hours statistics don't cover yet (the current one, or sensors without
  // statistics): integrate the state history instead.
  const now = Date.now();
  const missing = ids.filter((id) => !(stats[id]?.length));
  const recentFrom = new Date(Math.min(...ids.map((id) => (stats[id]?.length ? lastHour : from.getTime()))));
  const need = ids.filter((id) => missing.includes(id) || lastHour < now);
  if (need.length) {
    const hist = await h.callWS<Record<string, HistPoint[]>>({
      type: "history/history_during_period",
      start_time: recentFrom.toISOString(),
      entity_ids: need,
      minimal_response: true,
      no_attributes: true,
      significant_changes_only: false,
    });
    for (const id of need) {
      const start = missing.includes(id) ? from.getTime() : lastHour;
      if (counters.has(id)) {
        // A counter: every increase goes to the hour it happened in.
        const k = kwhFactor(unit(h, id));
        const pts = (hist[id] ?? []).map((p) => [p.lu * 1000, Number(p.s) * k] as [number, number]).filter(([, v]) => Number.isFinite(v));
        for (let i = 1; i < pts.length; i++) {
          const d = pts[i][1] - pts[i - 1][1];
          if (d <= 0 || pts[i][0] < start) continue;
          const hs = Math.floor(pts[i][0] / H) * H;
          out[id].set(hs, (out[id].get(hs) ?? 0) + d);
        }
        continue;
      }
      const u = unit(h, id);
      const k = u === "W" ? 1 / 1000 : u === "MW" ? 1000 : 1;
      const pts = (hist[id] ?? []).map((p) => [p.lu * 1000, Number(p.s) * k] as [number, number]).filter(([, v]) => Number.isFinite(v));
      for (let i = 0; i < pts.length; i++) {
        let t0 = Math.max(pts[i][0], start);
        const t1 = i + 1 < pts.length ? pts[i + 1][0] : now;
        const kw = Math.max(0, pts[i][1]);
        while (t0 < t1) {
          const hs = Math.floor(t0 / H) * H;
          const he = Math.min(hs + H, t1);
          out[id].set(hs, (out[id].get(hs) ?? 0) + kw * ((he - t0) / H));
          t0 = he;
        }
      }
    }
  }
  return out;
}

export async function loadEnergy(h: HomeAssistant, c: EnergyConfig, days = 1): Promise<EnergyUsage> {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1));
  const cons = (c.consumers ?? []).filter((x) => x.entity);
  const ids = [...new Set([...(c.sum_only ? [] : [c.entity]), ...cons.map((x) => x.entity)])].filter((id) => h.states[id]);
  await seedCounters(h, ids).catch(() => undefined);
  const per = await hourlyKwh(h, ids, from);
  const keyOf = (i: number) => `c${i}`;
  const hours = (start: number, n: number) => Array.from({ length: n }, (_, i) => start + i * H);
  const bucket = (hs: number) => {
    const r: Record<string, number> = {};
    let sum = 0;
    (c.consumers ?? []).forEach((x, i) => {
      const v = per[x.entity]?.get(hs) ?? 0;
      r[keyOf(i)] = v;
      sum += v;
    });
    if (showRest(c)) r.rest = Math.max(0, (per[c.entity]?.get(hs) ?? 0) - sum);
    return r;
  };
  const keys = [...(c.consumers ?? []).map((_, i) => keyOf(i)), ...(showRest(c) ? ["rest"] : [])];
  const hourly: Record<string, number[]> = Object.fromEntries(keys.map((k) => [k, []]));
  for (const hs of hours(today.getTime(), 24)) {
    const b = bucket(hs);
    for (const k of keys) hourly[k].push(b[k] ?? 0);
  }
  const list: EnergyUsage["days"] = [];
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - d);
    const kwh: Record<string, number> = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const hs of hours(day.getTime(), 24)) {
      const b = bucket(hs);
      for (const k of keys) kwh[k] += b[k] ?? 0;
    }
    list.push({ day, kwh });
  }
  const todayKwh = Object.fromEntries(keys.map((k) => [k, hourly[k].reduce((a, v) => a + v, 0)]));
  return { hourly, days: list, today: todayKwh, todayTotal: Object.values(todayKwh).reduce((a, v) => a + v, 0) };
}

const cache = new Map<string, { at: number; p: Promise<EnergyUsage> }>();

/** Today's kWh (shared between cards with the same setup, refreshed every 5 minutes). */
export function todayEnergy(h: HomeAssistant, c: EnergyConfig): Promise<EnergyUsage> {
  const key = JSON.stringify([c.entity, c.sum_only, c.rest, (c.consumers ?? []).map((x) => x.entity), new Date().toDateString()]);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 5 * 60_000) return hit.p;
  const p = loadEnergy(h, c, 1);
  cache.set(key, { at: Date.now(), p });
  p.catch(() => cache.delete(key));
  return p;
}

/** Power of an item: watts under 1 kW (so 80 W doesn't read as 0,0 kW), "—" without data. */
export const fmtP = (h: HomeAssistant | undefined, x: { kw: number; missing?: boolean }) =>
  x.missing ? "—" : x.kw < 1 ? `${Math.round(x.kw * 1000).toLocaleString(h?.locale?.language ?? undefined)} W` : `${fmt1(h, x.kw)} kW`;

export const fmt1 = (h: HomeAssistant | undefined, n: number) =>
  n.toLocaleString(h?.locale?.language ?? h?.language ?? undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Guess of the main meter: a power sensor called total / general / house… */
export function guessTotal(h: HomeAssistant): string | undefined {
  const list = [...Object.keys(h.states).filter((id) => isPower(h, id)), ...Object.keys(h.states).filter((id) => isEnergy(h, id))];
  const name = (id: string) => `${id} ${h.states[id]?.attributes.friendly_name ?? ""}`.toLowerCase();
  return (
    list.find((id) => /(general|total|casa|home|house|vivienda|grid|red|import|contador|main)/.test(name(id))) ?? undefined
  );
}
