// Dashboard strategy "custom:terral-home": creates a Terral dashboard in one
// click. Strategy views can't be edited, so after creating it the user picks
// "Take control" in HA to turn it into a normal, editable dashboard.
import type { HomeAssistant, LovelaceConfig } from "./ha-types";
import { groupMembers } from "./light/light-model";

class TerralHomeDashboardStrategy extends HTMLElement {
  static async generate(_config: unknown, hass: HomeAssistant): Promise<LovelaceConfig> {
    const lights = Object.values(hass.states)
      .filter((e) => e.entity_id.startsWith("light.") && !e.attributes.hidden)
      .sort((a, b) => Number(groupMembers(b).length > 0) - Number(groupMembers(a).length > 0));
    return {
      title: "Terral Home",
      views: [
        {
          type: "custom:terral-home-view",
          title: hass.language?.startsWith("es") ? "Mi casa" : "My home",
          path: "inicio",
          cards: lights.map((e) => ({
            type: "custom:terral-home-light",
            entity: e.entity_id,
            view_layout: { terral: groupMembers(e).length ? { w: 2, h: 2 } : { w: 1, h: 2 } },
          })),
        },
      ],
    };
  }
}

customElements.get("ll-strategy-dashboard-terral-home") ||
  customElements.define("ll-strategy-dashboard-terral-home", TerralHomeDashboardStrategy);

const w = window as unknown as { customStrategies?: unknown[] };
w.customStrategies = w.customStrategies || [];
w.customStrategies.push({
  type: "terral-home",
  strategyType: "dashboard",
  name: "Terral Home",
  description: "Dashboard Terral Home con todas tus luces / Terral Home dashboard with all your lights",
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
});
