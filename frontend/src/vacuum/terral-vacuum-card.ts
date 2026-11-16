// Terral · Robot — card for a robot vacuum / mop (1/1, 2/1, 2/2), made for
// Roborock but fine with any vacuum entity.
//   Waiting (docked / idle): glass. 2/2 shows the 3 main routines (chosen in
//     the settings); the icon opens every routine (also on 1/1 and 2/1).
//   Cleaning: teal; the icon pauses; 2/2 shows progress, area, time, pause
//     and back to the dock. Going home: sky blue.
//   Stuck / error: red tint and a red "!" on the icon (like the charger's
//     lock); 2/2 offers resume, back to the dock and locate.
//   Battery: in the text, with a small battery that empties and changes colour.
// A tap anywhere else opens the window; a long press moves the card.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { t } from "../i18n";
import { exclaimIcon, homeIcon, locateIcon, pauseIcon, playIcon, vacuumIcon } from "../shared/icons";
import { openPop } from "../shared/terral-pop";
import { openCardSettings } from "../panel/terral-card-config";
import { batteryBadge, isTinted, routineIcon, runFacts, statusText, tint } from "./vacuum-look";
import {
  type Activity,
  type Parts,
  type VacuumConfig,
  activity,
  allRoutines,
  favourites,
  parts,
  pause,
  progress,
  remember,
  routineName,
  confirmRoutine,
  start,
  supports,
  toBase,
  locate,
} from "./vacuum-model";
import { openVacuumDialog, updateVacuumDialog } from "./terral-vacuum-dialog";

export type TerralVacuumCardConfig = LovelaceCardConfig & VacuumConfig;
type Size = "s11" | "s21" | "s22";

export const VACUUM_CARD_TAG = "terral-home-vacuum";

@customElement(VACUUM_CARD_TAG)
export class TerralVacuumCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: TerralVacuumCardConfig;
  @state() private _size: Size = "s22";

  private _parts?: Parts;
  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;

  setConfig(config: TerralVacuumCardConfig): void {
    if (!config?.entity || !String(config.entity).startsWith("vacuum.")) {
      throw new Error("Terral · Robot: 'entity' must be a vacuum entity (vacuum.xxx)");
    }
    this._config = config;
    this._parts = undefined;
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return this._size === "s11" ? 1 : 2;
  }

  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1 };
  }

  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
    ];
  }

  static getStubConfig(hass: HomeAssistant) {
    return { entity: Object.keys(hass?.states ?? {}).find((id) => id.startsWith("vacuum.")) ?? "vacuum.example" };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "vacuum" } } },
        { name: "name", selector: { text: {} } },
        { name: "routines", selector: { entity: { multiple: true, domain: ["button", "script"] } } },
      ],
    };
  }

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  /** Sensors / selects of the robot's device (looked up once). */
  private get _p(): Parts {
    if (!this._parts && this.hass && this._config) this._parts = parts(this.hass, this._config.entity);
    return this._parts ?? {};
  }

  private get _name() {
    return this._config?.name || (this._entity?.attributes.friendly_name as string) || t(this.hass, "type_vacuum");
  }

  /** Redraw only when the robot or one of its own sensors changed. */
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this._config || !this.hass) return true;
    const ids = [this._config.entity, ...Object.values(this._p), ...favourites(this.hass, this._config)].filter(Boolean) as string[];
    return ids.some((id) => old.states[id] !== this.hass!.states[id]);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
      updateVacuumDialog(this.hass);
      const e = this._entity;
      if (e) remember(this.hass, e, this._p);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cancelHold();
  }

  // ---- Actions -----------------------------------------------------------------

  private _openWindow() {
    if (!this.hass || !this._config) return;
    openVacuumDialog(this.hass, this._config, this._name, () => this.hass && this._config && openCardSettings(this, this.hass, "vacuum", this._config));
  }

  private _routinesMenu(anchor: Element) {
    const h = this.hass!;
    const list = allRoutines(h, this._config!);
    if (!list.length) return this._openWindow();
    openPop(anchor, list.map((id) => {
      const n = routineName(h, id, this._name);
      return { label: n, icon: routineIcon(n, 21), run: () => confirmRoutine(h, id, n, this._name) };
    }));
  }

  /** The icon: pause while running, resume when paused, routines while waiting. */
  private _iconTap = (ev: Event) => {
    ev.stopPropagation();
    const e = this._entity;
    const h = this.hass;
    if (!e || !h) return;
    const a = activity(e);
    if (a === "cleaning" || a === "returning") pause(h, e);
    else if (a === "paused") start(h, e);
    else if (a === "docked" || a === "idle") this._routinesMenu(ev.currentTarget as Element);
    else this._openWindow();
  };

  private _act(fn: (h: HomeAssistant, e: HassEntity) => unknown) {
    return (ev: Event) => {
      ev.stopPropagation();
      if (this.hass && this._entity) fn(this.hass, this._entity);
    };
  }

  // ---- Hold / click (same rules as the other cards) ---------------------------------

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

  private _cardClick = (ev: Event) => {
    if (this._held) {
      ev.stopPropagation();
      ev.preventDefault();
      this._held = false;
      return;
    }
    const root = ev.currentTarget;
    for (const node of ev.composedPath()) {
      if (node === root) break;
      if (node instanceof HTMLElement && node.tagName === "BUTTON") return;
    }
    this._openWindow();
  };

  // ---- Render -------------------------------------------------------------------

  private _icon(e: HassEntity, a: Activity, size: number) {
    const label = a === "cleaning" || a === "returning" ? t(this.hass, "vac_pause") : a === "paused" ? t(this.hass, "vac_resume") : t(this.hass, "vac_routines");
    return html`<button class="icon" aria-label=${label} ?disabled=${a === "unavailable"} @click=${this._iconTap}>
      ${vacuumIcon(size)}
      ${a === "error" ? html`<span class="err">${exclaimIcon(this._size === "s11" ? 11 : 14)}</span>` : nothing}
    </button>`;
  }

  private _battery(e: HassEntity, withUnit: boolean) {
    const b = batteryBadge(this.hass!, e, this._p, withUnit);
    if (!b) return nothing;
    return html`<span class="bat" style="color:${b.color}" aria-label=${`${t(this.hass, "battery")} ${b.pct} %`}>${b.icon}${b.text}</span>`;
  }

  private _bottom22(e: HassEntity, a: Activity) {
    const h = this.hass!;
    const c = this._config!;
    if (a === "docked" || a === "idle" || a === "unavailable") {
      const favs = favourites(h, c);
      if (!favs.length) {
        return html`<div class="pills one"><button class="pb" ?disabled=${a === "unavailable"} @click=${this._act(start)}>${playIcon(16)}${t(h, "vac_start")}</button></div>`;
      }
      return html`<div class="pills" style="grid-template-columns:repeat(${favs.length},minmax(0,1fr))">
        ${favs.map((id) => {
          const n = routineName(h, id, this._name);
          return html`<button class="pb" ?disabled=${a === "unavailable"} @click=${(ev: Event) => {
            ev.stopPropagation();
            confirmRoutine(h, id, n, this._name);
          }}>${routineIcon(n, 16)}<span>${n}</span></button>`;
        })}
      </div>`;
    }
    if (a === "error") {
      return html`<div class="row">
        <button class="pb grow" @click=${this._act(start)}>${playIcon(16)}<span>${t(h, "vac_resume")}</span></button>
        ${supports(e, "RETURN") ? html`<button class="pb grow" @click=${this._act(toBase)}>${homeIcon(17)}<span>${t(h, "vac_to_base")}</span></button>` : nothing}
        ${supports(e, "LOCATE") ? html`<button class="rb" aria-label=${t(h, "vac_locate")} @click=${this._act(locate)}>${locateIcon(19)}</button>` : nothing}
      </div>`;
    }
    const pr = progress(h, this._p);
    const facts = runFacts(h, this._p);
    return html`<div class="row">
      <div class="info">
        ${pr != null && a !== "returning" ? html`<div class="track"><i style="width:${pr}%"></i></div>` : nothing}
        <span class="facts">${facts || statusText(h, e, this._p)}</span>
      </div>
      ${a === "paused"
        ? html`<button class="rb on" aria-label=${t(h, "vac_resume")} @click=${this._act(start)}>${playIcon(18)}</button>`
        : supports(e, "PAUSE")
          ? html`<button class="rb on" aria-label=${t(h, "vac_pause")} @click=${this._act(pause)}>${pauseIcon(18)}</button>`
          : nothing}
      ${supports(e, "RETURN") ? html`<button class="rb" aria-label=${t(h, "vac_to_base")} ?disabled=${a === "returning"} @click=${this._act(toBase)}>${homeIcon(19)}</button>` : nothing}
    </div>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const h = this.hass;
    const e = this._entity;
    if (!e) return html`<div class="card off missing"><span>${t(h, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const a = activity(e);
    const size = this._size;
    const name = this._name;
    const st = statusText(h, e, this._p);
    let body;
    if (size === "s11") {
      body = html`${this._icon(e, a, 22)}<div class="text"><span class="name">${name}</span>
        <span class="state line"><span class="grow">${statusText(h, e, this._p, true)}</span>${this._battery(e, false)}</span></div>`;
    } else if (size === "s21") {
      body = html`${this._icon(e, a, 32)}<div class="text"><span class="name">${name}</span><span class="state">${st}</span>
        <span class="state">${this._battery(e, true)}</span></div>`;
    } else {
      body = html`<div class="head">${this._icon(e, a, 32)}<div class="text"><span class="name">${name}</span><span class="state">${st}</span></div>
          <span class="top">${this._battery(e, true)}</span></div>
        ${this._bottom22(e, a)}`;
    }
    return html`<div
      class="card ${size} ${isTinted(a) ? "on" : "off"} ${a === "unavailable" ? "unavailable" : ""}"
      style=${tint(a)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${name}, ${st}`}
      @click=${this._cardClick}
      @keydown=${(ev: KeyboardEvent) => {
        if ((ev.key === "Enter" || ev.key === " ") && ev.target === ev.currentTarget) {
          ev.preventDefault();
          this._openWindow();
        }
      }}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >${body}</div>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    button {
      font: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
    }
    button:disabled {
      cursor: default;
    }
    svg {
      display: block;
      flex: none;
    }
    .card {
      box-sizing: border-box;
      height: 100%;
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
      transition: background 0.25s, color 0.25s;
      --fg: #fff;
      --fg2: rgba(255, 255, 255, 0.75);
      color: var(--fg);
    }
    .off {
      background: var(--ha-card-background, rgba(255, 255, 255, 0.13));
      -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
      backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }
    .on {
      background: var(--bg);
      border: 1px solid rgba(255, 255, 255, 0.7);
    }
    .unavailable {
      opacity: 0.55;
    }
    .missing {
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 13px;
    }
    .icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      flex: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    .on .icon {
      background: var(--accent);
    }
    .err {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #b3261e;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.25);
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .s22 .name {
      font-size: 17px;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .line {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .grow {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bat {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .top {
      align-self: flex-start;
      font-size: 13px;
      margin-top: 4px;
    }
    .s11 {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0 12px;
      gap: 10px;
      border-radius: 20px;
    }
    .s11 .icon {
      width: 40px;
      height: 40px;
    }
    .s11 .err {
      width: 19px;
      height: 19px;
      right: -5px;
      bottom: -5px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .s11 .bat svg {
      width: 14px;
      height: 14px;
    }
    .pills {
      display: grid;
      gap: 6px;
      flex: none;
    }
    .pills.one {
      grid-template-columns: 1fr;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: none;
      min-width: 0;
    }
    .pb {
      height: 40px;
      min-width: 0;
      border-radius: 20px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .pb span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pb:disabled {
      opacity: 0.45;
    }
    .pb.grow {
      flex: 1;
    }
    .rb {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .rb.on {
      background: var(--accent, rgba(255, 255, 255, 0.3));
      color: #fff;
    }
    .rb:disabled {
      opacity: 0.4;
    }
    .info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .track {
      height: 8px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--fg) 14%, transparent);
      overflow: hidden;
    }
    .track i {
      display: block;
      height: 100%;
      border-radius: 4px;
      background: var(--accent);
      transition: width 0.4s;
    }
    .facts {
      font-size: 12px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-vacuum": TerralVacuumCard;
  }
}
