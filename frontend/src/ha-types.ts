// Minimal Home Assistant frontend types used by Terral Home.
// Only the parts we touch; HA's real objects carry much more.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
}

export interface HassDeviceRegistryEntry {
  id: string;
  area_id?: string | null;
}

export interface HassArea {
  area_id: string;
  name: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDeviceRegistryEntry>;
  areas?: Record<string, HassArea>;
  language?: string;
  config?: { version?: string };
  locale?: { language: string };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeMessage<T>(callback: (msg: T) => void, msg: Record<string, unknown>): Promise<() => Promise<void>>;
  };
  formatEntityState?(stateObj: HassEntity, state?: string): string;
  formatEntityName?(stateObj: HassEntity, name?: string): string;
}

export interface LovelaceCardConfig {
  type: string;
  view_layout?: { terral?: { w?: number; h?: number }; [key: string]: unknown };
  [key: string]: unknown;
}

export interface LovelaceViewConfig {
  type?: string;
  title?: string;
  path?: string;
  cards?: LovelaceCardConfig[];
  [key: string]: unknown;
}

export interface LovelaceConfig {
  views: LovelaceViewConfig[];
  [key: string]: unknown;
}

export interface Lovelace {
  config: LovelaceConfig;
  editMode: boolean;
  mode: "storage" | "yaml";
  saveConfig(config: LovelaceConfig): Promise<void>;
  setEditMode?(editMode: boolean): void;
}

/** The `hui-card` wrapper HA hands to a view. */
export interface HuiCard extends HTMLElement {
  hass?: HomeAssistant;
  preview?: boolean;
  layout?: string;
  config?: LovelaceCardConfig;
  hidden: boolean;
}

export function fireEvent(
  node: EventTarget,
  type: string,
  detail?: unknown,
): void {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
}
