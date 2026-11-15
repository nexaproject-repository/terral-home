// Terral Home frontend entry point.
// Nexa Projects by Manuel Escaño · MIT License.
import "./light/terral-light-card";
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

console.info(
  `%c TERRAL HOME %c v${VERSION} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  "",
);
