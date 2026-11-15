// Arm / disarm actions shared by the alarm card and its window, plus the
// "refused because something is open" memory both of them show.
import type { HassEntity, HomeAssistant } from "../ha-types";
import { t, type StringKey } from "../i18n";
import {
  type AlarmMode,
  currentMode,
  entityName,
  openSensors,
  phase,
  secondsLeft,
  startArm,
  startDisarm,
  timeOf,
} from "./alarm-model";
import { openCodeSheet } from "./terral-code-sheet";

export interface Refusal {
  mode: AlarmMode;
  code?: string;
  at: number;
}

const refusals = new Map<string, Refusal>();
const REFUSAL_TTL = 60_000;
export const REFUSAL_EVENT = "terral-alarm-refusal";

const notify = () => window.dispatchEvent(new Event(REFUSAL_EVENT));

export function refusalFor(e: HassEntity): Refusal | undefined {
  const r = refusals.get(e.entity_id);
  if (!r) return undefined;
  if (Date.now() - r.at > REFUSAL_TTL || phase(e) !== "disarmed") {
    refusals.delete(e.entity_id);
    return undefined;
  }
  return r;
}

export function clearRefusal(id: string) {
  if (refusals.delete(id)) notify();
}

export function arm(getHass: () => HomeAssistant | undefined, id: string, mode: AlarmMode, force = false) {
  const h = getHass();
  if (!h) return;
  const prev = refusals.get(id);
  const opts = force ? { force: true, code: prev?.code } : {};
  clearRefusal(id);
  startArm(
    getHass,
    id,
    mode,
    (fmt, submit) => openCodeSheet(h, fmt, submit),
    (r) => {
      if (r.result === "refused") {
        refusals.set(id, { mode, code: r.code, at: Date.now() });
        notify();
      }
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    opts,
  );
}

export function disarm(getHass: () => HomeAssistant | undefined, id: string) {
  const h = getHass();
  if (!h) return;
  startDisarm(getHass, id, (fmt, submit) => openCodeSheet(h, fmt, submit));
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const modeLabel = (h: HomeAssistant | undefined, m: AlarmMode) => t(h, `mode_${m}` as StringKey);

/** Title and status line, shared by card and window. */
export function alarmTexts(h: HomeAssistant, e: HassEntity, name: string): { title: string; status: string } {
  const ph = phase(e);
  const mode = currentMode(e);
  const ml = mode ? lower(modeLabel(h, mode)) : "";
  const refused = refusalFor(e);
  if (refused) {
    const open = openSensors(e);
    return {
      title: t(h, "alarm_failed"),
      status: open.length > 1 ? t(h, "alarm_open_n", { n: open.length }) : t(h, "alarm_open", { name: open[0] ? entityName(h, open[0]) : "?" }),
    };
  }
  switch (ph) {
    case "disarmed":
      return { title: name, status: t(h, "alarm_disarmed") };
    case "arming":
      return { title: name, status: `${t(h, "alarm_arming", { mode: ml })} · ${t(h, "alarm_leave")}` };
    case "armed":
      return { title: name, status: `${t(h, "alarm_armed", { mode: ml })} · ${t(h, "alarm_since", { t: timeOf(h, e.last_changed) })}` };
    case "pending":
      return { title: t(h, "alarm_pending"), status: t(h, "alarm_pending_sub") };
    case "triggered": {
      const open = openSensors(e);
      const who = open.length ? entityName(h, open[0]) + (open.length > 1 ? ` +${open.length - 1}` : "") : name;
      return { title: t(h, "alarm_triggered"), status: `${who} · ${timeOf(h, e.last_changed)}` };
    }
    default:
      return { title: name, status: t(h, "unavailable") };
  }
}

/** Whole seconds left for the on-screen counter, or null when there is no delay. */
export const countdown = (e: HassEntity) => {
  const s = secondsLeft(e);
  return s == null ? null : Math.ceil(s);
};
