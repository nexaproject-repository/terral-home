// Terral Home frontend entry point.
// Nexa Projects by Manuel Escaño · MIT License.
import "./light/terral-light-card";
import "./alarm/terral-alarm-card";
import "./charger/terral-charger-card";
import "./climate/terral-climate-card";
import "./panel/terral-home-panel";
import type { HomeAssistant } from "./ha-types";

import { VERSION } from "./version";

export { VERSION };

interface CustomCardEntry {
  type: string;
  name: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
  getEntitySuggestion?: (hass: HomeAssistant, entityId: string) => unknown;
}

const w = window as unknown as { customCards?: CustomCardEntry[] };
w.customCards = w.customCards || [];
if (!w.customCards.some((c) => c.type === "terral-home-light")) {
  w.customCards.push({
    type: "terral-home-light",
    name: "Terral · Luz",
    description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
    preview: true,
    documentationURL: "https://github.com/nexaproject-repository/terral-home",
    getEntitySuggestion: (_hass, entityId) =>
      entityId.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: entityId } } : null,
  });
}

if (!w.customCards.some((c) => c.type === "terral-home-alarm")) {
  w.customCards.push({
    type: "terral-home-alarm",
    name: "Terral · Alarma",
    description: "Alarma (Alarmo u otra) al estilo Terral Home / Terral Home alarm (Alarmo or any alarm panel)",
    preview: true,
    documentationURL: "https://github.com/nexaproject-repository/terral-home",
    getEntitySuggestion: (_hass, entityId) =>
      entityId.startsWith("alarm_control_panel.") ? { config: { type: "custom:terral-home-alarm", entity: entityId } } : null,
  });
}

if (!w.customCards.some((c) => c.type === "terral-home-charger")) {
  w.customCards.push({
    type: "terral-home-charger",
    name: "Terral · Cargador",
    description: "Cargador de coche eléctrico al estilo Terral Home / Terral Home EV charger",
    preview: true,
    documentationURL: "https://github.com/nexaproject-repository/terral-home",
  });
}

if (!w.customCards.some((c) => c.type === "terral-home-climate")) {
  w.customCards.push({
    type: "terral-home-climate",
    name: "Terral · Clima",
    description: "Aire acondicionado, calefacción o bomba de calor al estilo Terral Home / Terral Home climate",
    preview: true,
    documentationURL: "https://github.com/nexaproject-repository/terral-home",
  });
}

console.info(
  `%c TERRAL HOME %c v${VERSION} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  "",
);
