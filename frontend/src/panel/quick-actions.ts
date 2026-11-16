// Section quick actions: round buttons on the right of a section title that
// act on every device of that kind in the section.
//   lights   — on by default. Amber with the number of lights on; a tap
//              turns them all off, or all on when every light is off.
//              Light groups count their member lights.
//   climate  — opt-in. Same idea for the climate cards (on = any mode but
//              off; turning on uses each unit's last mode).
// Which ones a section shows is stored on the section as `quick` (a list);
// without it, a section shows "lights". Hidden in move mode.
import type { HassEntity, HomeAssistant } from "../ha-types";
import { isOff as climateOff, turnOff as climateTurnOff, turnOn as climateTurnOn } from "../climate/climate-model";

export type QuickKind = "lights" | "climate";
export const QUICK_KINDS: QuickKind[] = ["lights", "climate"];
export const DEFAULT_QUICK: QuickKind[] = ["lights"];

type CardLike = { type: string; entity: string };

export const quickOf = (section: object): QuickKind[] =>
  Array.isArray((section as { quick?: unknown }).quick) ? ((section as { quick: string[] }).quick).filter((k): k is QuickKind => QUICK_KINDS.includes(k as QuickKind)) : DEFAULT_QUICK;

/** Light entities behind the section's light cards (group members expanded). */
export function sectionLights(h: HomeAssistant, cards: CardLike[]): string[] {
  const out = new Set<string>();
  for (const c of cards) {
    if (c.type !== "light" || !h.states[c.entity]) continue;
    const members = h.states[c.entity].attributes.entity_id;
    if (Array.isArray(members) && members.length) members.filter((id: string) => h.states[id]).forEach((id: string) => out.add(id));
    else out.add(c.entity);
  }
  return [...out];
}

export const sectionClimates = (h: HomeAssistant, cards: CardLike[]) =>
  [...new Set(cards.filter((c) => c.type === "climate" && h.states[c.entity]).map((c) => c.entity))];

/** Entities a quick action works on, and how many are on. */
export function quickState(h: HomeAssistant, kind: QuickKind, cards: CardLike[]) {
  const ids = kind === "lights" ? sectionLights(h, cards) : sectionClimates(h, cards);
  const on = ids.filter((id) => (kind === "lights" ? h.states[id].state === "on" : !climateOff(h.states[id] as HassEntity))).length;
  return { ids, on };
}

/** Any on → all off; all off → all on. */
export function runQuick(h: HomeAssistant, kind: QuickKind, cards: CardLike[]) {
  const { ids, on } = quickState(h, kind, cards);
  if (!ids.length) return;
  if (kind === "lights") {
    h.callService("light", on ? "turn_off" : "turn_on", {}, { entity_id: ids });
    return;
  }
  for (const id of ids) {
    const e = h.states[id];
    if (on && !climateOff(e)) climateTurnOff(h, e);
    else if (!on) climateTurnOn(h, e);
  }
}
