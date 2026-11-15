// Alarm helpers: reading an alarm_control_panel entity (Alarmo or any other
// integration) and running the arm / disarm flows, including the code sheet
// and Alarmo's "open sensors" refusal.
import type { HassEntity, HomeAssistant } from "../ha-types";

export type AlarmMode = "away" | "home" | "night" | "vacation" | "custom";

/** alarm_control_panel supported_features bits. */
const FEATURE: Record<AlarmMode, number> = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 };
const ORDER: AlarmMode[] = ["away", "home", "night", "vacation", "custom"];
/** Modes the 2/2 card shows as buttons; the rest live in the window. */
export const CARD_MODES: AlarmMode[] = ["away", "home", "vacation"];

export type RGB = [number, number, number];
export const MODE_COLORS: Record<AlarmMode, RGB> = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90],
};

export type Phase = "disarmed" | "arming" | "armed" | "pending" | "triggered" | "unavailable";

export function phase(e: HassEntity): Phase {
  const s = e.state;
  if (s === "disarmed" || s === "disarming") return "disarmed";
  if (s === "arming") return "arming";
  if (s === "pending") return "pending";
  if (s === "triggered") return "triggered";
  if (s.startsWith("armed_")) return "armed";
  return "unavailable";
}

const toMode = (s: unknown): AlarmMode | undefined => {
  if (typeof s !== "string") return undefined;
  const m = s.replace(/^armed_/, "");
  if (m === "custom_bypass") return "custom";
  return (ORDER as string[]).includes(m) ? (m as AlarmMode) : undefined;
};

/** Mode the alarm is armed in, or is arming / about to trigger in. */
export function currentMode(e: HassEntity): AlarmMode | undefined {
  return toMode(e.state) ?? toMode(e.attributes.arm_mode) ?? toMode(e.attributes.next_state);
}

/** Modes switched on in the integration (Alarmo reports them as supported features). */
export function enabledModes(e: HassEntity): AlarmMode[] {
  const f = Number(e.attributes.supported_features ?? 0);
  if (!f) return ["away", "home"];
  return ORDER.filter((m) => f & FEATURE[m]);
}

/** Seconds left of the exit / entry delay (Alarmo's `delay` attribute), or null. */
export function secondsLeft(e: HassEntity, now = Date.now()): number | null {
  const delay = Number(e.attributes.delay);
  if (!delay || !(e.state === "arming" || e.state === "pending")) return null;
  const end = new Date(e.last_changed).getTime() + delay * 1000;
  return Math.max(0, (end - now) / 1000);
}

export function delayTotal(e: HassEntity): number | null {
  const d = Number(e.attributes.delay);
  return d > 0 ? d : null;
}

export const codeFormat = (e: HassEntity): "number" | "text" | null => {
  const f = e.attributes.code_format;
  return f === "number" || f === "text" ? f : null;
};
const needsArmCode = (e: HassEntity) => codeFormat(e) != null && e.attributes.code_arm_required !== false;

/** Entity ids Alarmo says are open (failed arm or trigger). */
export function openSensors(e: HassEntity): string[] {
  const o = e.attributes.open_sensors;
  if (!o) return [];
  if (Array.isArray(o)) return o.map(String);
  if (typeof o === "object") return Object.keys(o);
  return [];
}

export function bypassedSensors(e: HassEntity): string[] {
  const b = e.attributes.bypassed_sensors;
  return Array.isArray(b) ? b.map(String) : [];
}

export const entityName = (h: HomeAssistant, id: string) => {
  const s = h.states[id];
  return (s && (h.formatEntityName?.(s) || (s.attributes.friendly_name as string))) || id;
};

function isAlarmo(h: HomeAssistant, e: HassEntity): boolean {
  const reg = h.entities?.[e.entity_id] as { platform?: string } | undefined;
  if (reg?.platform) return reg.platform === "alarmo";
  return "arm_mode" in e.attributes || "next_state" in e.attributes;
}

// ---- Service calls -------------------------------------------------------

function callArm(h: HomeAssistant, e: HassEntity, mode: AlarmMode, code?: string, force = false) {
  if (isAlarmo(h, e)) {
    const data: Record<string, unknown> = { entity_id: e.entity_id, mode };
    if (code) data.code = code;
    if (force) data.force = true;
    return h.callService("alarmo", "arm", data);
  }
  const svc = `alarm_arm_${mode === "custom" ? "custom_bypass" : mode}`;
  return h.callService("alarm_control_panel", svc, code ? { code } : {}, { entity_id: e.entity_id });
}

function callDisarm(h: HomeAssistant, e: HassEntity, code?: string) {
  return h.callService("alarm_control_panel", "alarm_disarm", code ? { code } : {}, { entity_id: e.entity_id });
}

export function skipDelay(h: HomeAssistant, e: HassEntity) {
  return h.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}

/** Resolves true as soon as cond() holds, false after `ms`. */
function waitFor(cond: () => boolean, ms = 2500): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (cond()) return resolve(true);
      if (Date.now() - start > ms) return resolve(false);
      setTimeout(tick, 150);
    };
    tick();
  });
}

// ---- Flows ---------------------------------------------------------------

export type GetHass = () => HomeAssistant | undefined;
export type AskCode = (format: "number" | "text", submit: (code: string) => Promise<boolean>) => void;

export interface ArmResult {
  /** "armed": arming started; "refused": open sensors; "wrong": state did not change. */
  result: "armed" | "refused" | "wrong";
  code?: string;
}

/** Arms (asking for the code if needed); `done` gets the outcome unless the user cancels the code sheet. */
export function startArm(
  getHass: GetHass,
  id: string,
  mode: AlarmMode,
  askCode: AskCode,
  done: (r: ArmResult) => void,
  opts: { force?: boolean; code?: string } = {},
) {
  const attempt = async (code?: string): Promise<ArmResult> => {
    const h = getHass();
    const e = h?.states[id];
    if (!h || !e) return { result: "wrong" };
    try {
      await callArm(h, e, mode, code, opts.force);
    } catch {
      return { result: "wrong", code };
    }
    const cur = () => getHass()?.states[id];
    const ok = await waitFor(() => {
      const s = cur();
      return !!s && phase(s) !== "disarmed";
    });
    if (ok) return { result: "armed", code };
    const s = cur();
    return { result: s && openSensors(s).length ? "refused" : "wrong", code };
  };

  const e = getHass()?.states[id];
  if (!e) return;
  const fmt = codeFormat(e);
  if (opts.code != null || !fmt || !needsArmCode(e)) {
    attempt(opts.code).then(done);
    return;
  }
  askCode(fmt, async (code) => {
    const r = await attempt(code);
    if (r.result === "wrong") return false;
    done(r);
    return true;
  });
}

/** Disarms, asking for the code if the alarm has one. */
export function startDisarm(getHass: GetHass, id: string, askCode: AskCode) {
  const attempt = async (code?: string) => {
    const h = getHass();
    const e = h?.states[id];
    if (!h || !e) return false;
    try {
      await callDisarm(h, e, code);
    } catch {
      return false;
    }
    return waitFor(() => {
      const s = getHass()?.states[id];
      return !!s && phase(s) === "disarmed";
    });
  };
  const e = getHass()?.states[id];
  if (!e) return;
  const fmt = codeFormat(e);
  if (!fmt) {
    attempt();
    return;
  }
  askCode(fmt, attempt);
}

// ---- Colours (same maths as the light card's tint) ------------------------

const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
const rgb = (c: RGB, a?: number) => (a == null ? `rgb(${c.join(",")})` : `rgba(${c.join(",")},${a})`);

export function modeTint(mode: AlarmMode) {
  const base = MODE_COLORS[mode];
  return {
    bg: rgb(mix(base, [255, 255, 255], 0.84), 0.95),
    fg: rgb(mix(base, [10, 10, 20], 0.82)),
    fg2: rgb(mix(base, [20, 10, 30], 0.72)),
    accent: rgb(base),
  };
}

export const timeOf = (h: HomeAssistant | undefined, iso: string) =>
  new Date(iso).toLocaleTimeString(h?.locale?.language ?? h?.language ?? undefined, { hour: "2-digit", minute: "2-digit" });
