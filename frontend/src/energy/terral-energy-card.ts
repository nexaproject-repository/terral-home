// Terral · Energía — where the electricity of the house is going right now:
// the main meter split into the consumers you choose (car charger, air
// conditioning…) and "rest of the house" (meter − consumers).
// Three views, chosen in the settings: flow (dots running from the grid to
// each consumer), ring (a donut with a band of light running along each
// segment) and bars (stripes running along each bar). Faster the more a
// consumer uses. Sizes 1/1, 2/1, 2/2 and 4/2. A tap opens the window (today
// per hour and per consumer, last 7 days); a long press moves the card.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { t } from "../i18n";
import { openCardSettings } from "../panel/terral-card-config";
import { type EnergyConfig, type EnergyUsage, fmt1, live, todayEnergy } from "./energy-model";
import { energyStyles } from "./energy-style";
import { type ViewArgs, view11, view21, view22, view42 } from "./energy-views";
import { openEnergyDialog, updateEnergyDialog } from "./terral-energy-dialog";

export type TerralEnergyCardConfig = LovelaceCardConfig & EnergyConfig;
type Size = "s11" | "s21" | "s22" | "s42";

export const ENERGY_CARD_TAG = "terral-home-energy";

@customElement(ENERGY_CARD_TAG)
export class TerralEnergyCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralEnergyCardConfig;
  @state() private _size: Size = "s42";
  @state() private _usage?: EnergyUsage;

  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;
  private _tick?: number;
  private _loaded = "";

  setConfig(config: TerralEnergyCardConfig): void {
    if (!config?.entity) throw new Error("Terral · Energía: 'entity' must be the power sensor of the house");
    this._config = config;
    this._loaded = "";
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.h === 4 ? "s42" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s42" ? 4 : this._size === "s11" ? 1 : 2;
  }

  getGridOptions() {
    return { columns: 12, rows: 4, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 },
    ];
  }

  static getStubConfig(hass: HomeAssistant) {
    const id = Object.keys(hass?.states ?? {}).find((x) => x.startsWith("sensor.") && ["W", "kW"].includes(String(hass.states[x].attributes.unit_of_measurement)));
    return { entity: id ?? "sensor.house_power", consumers: [] };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "sensor", device_class: "power" } } },
        { name: "name", selector: { text: {} } },
        { name: "view", selector: { select: { mode: "dropdown", options: ["flow", "ring", "bars"] } } },
      ],
    };
  }

  private get _title() {
    return this._config?.name || t(this.hass, "en_title");
  }

  // ---- Lifecycle -------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    this._tick = window.setInterval(() => {
      this._loaded = "";
      this._load();
    }, 5 * 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this._tick);
    this._cancelHold();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this._config || !this.hass) return true;
    const ids = [this._config.entity, ...(this._config.consumers ?? []).map((c) => c.entity)];
    return ids.some((id) => old.states[id] !== this.hass!.states[id]);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) updateEnergyDialog(this.hass);
    this._load();
  }

  private _load() {
    const h = this.hass;
    const c = this._config;
    if (!h || !c) return;
    const key = JSON.stringify([c.entity, c.sum_only, c.rest, c.consumers]);
    if (key === this._loaded) return;
    this._loaded = key;
    todayEnergy(h, c).then((u) => (this._usage = u)).catch(() => undefined);
  }

  // ---- Actions -------------------------------------------------------------------

  private _openWindow() {
    if (!this.hass || !this._config) return;
    openEnergyDialog(this.hass, this._config, this._title, () => this.hass && this._config && openCardSettings(this, this.hass, "energy", this._config));
  }

  private _down = (ev: PointerEvent) => {
    this._held = false;
    this._holdStart = { x: ev.clientX, y: ev.clientY };
    clearTimeout(this._holdTimer);
    const startAt = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId };
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      const hold = new CustomEvent("terral-card-hold", { detail: startAt, bubbles: true, composed: true, cancelable: true });
      if (this.dispatchEvent(hold)) this._openWindow();
    }, 500);
  };

  private _move = (ev: PointerEvent) => {
    if (!this._holdStart) return;
    if (Math.hypot(ev.clientX - this._holdStart.x, ev.clientY - this._holdStart.y) > 10) this._cancelHold();
  };

  private _cancelHold = () => {
    clearTimeout(this._holdTimer);
    this._holdStart = undefined;
  };

  private _click = (ev: Event) => {
    if (this._held) {
      ev.stopPropagation();
      ev.preventDefault();
      this._held = false;
      return;
    }
    this._openWindow();
  };

  // ---- Render -------------------------------------------------------------------------

  render() {
    if (!this._config || !this.hass) return nothing;
    const h = this.hass;
    const c = this._config;
    const unavailable = !c.sum_only && !h.states[c.entity];
    if (unavailable) return html`<div class="card missing"><span>${t(h, "not_found")}</span><small>${c.entity}</small></div>`;
    const a: ViewArgs = {
      h,
      live: live(h, c, t(h, "en_rest")),
      view: c.view ?? "flow",
      animate: c.animate !== false,
      title: this._size === "s42" ? this._title : this._config.name || t(h, "en_short"),
      todayText: this._usage ? `${t(h, "sw_today_l")} ${fmt1(h, this._usage.todayTotal)} kWh` : undefined,
      today: this._usage?.today,
      labels: { now: t(h, "en_now"), grid: t(h, "en_grid"), kwNow: t(h, "en_kw_now") },
    };
    if (this._size === "s22" && a.view !== "bars") a.title = t(h, "en_consumption");
    const body = this._size === "s42" ? view42(a) : this._size === "s22" ? view22(a) : this._size === "s21" ? view21(a) : view11(a);
    return html`<div
      class="card ${this._size}"
      role="button"
      tabindex="0"
      aria-label="${this._title}: ${fmt1(h, a.live.total)} kW"
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      @click=${this._click}
      @keydown=${(ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >${body}</div>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        height: 100%;
        font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
        -webkit-tap-highlight-color: transparent;
      }
      svg {
        display: block;
        flex: none;
      }
      .card {
        box-sizing: border-box;
        height: 100%;
        min-height: 64px;
        border-radius: var(--ha-card-border-radius, 22px);
        padding: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 12px;
        overflow: hidden;
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        cursor: pointer;
        outline: none;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
        background: var(--ha-card-background, rgba(255, 255, 255, 0.13));
        -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
        backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      }
      .missing {
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 13px;
      }
      .s11 {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 0 12px;
        gap: 10px;
        border-radius: 20px;
      }
      .s11 .name {
        font-size: 14px;
      }
      .s11 .state {
        font-size: 12px;
      }
      .s21 .name,
      .s21 .ehead .name {
        font-size: 16px;
      }
      .s21 .txt {
        flex: none;
      }
      .s21 > .eic {
        align-self: flex-start;
      }
    `,
    energyStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-energy": TerralEnergyCard;
  }
}
