// Terral · Luz — card for a light or an HA light group.
// Two touch zones: the icon toggles, the text opens the light window.
// Holding anywhere on the card also opens the window.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant, LovelaceCardConfig } from "../ha-types";
import { lang, t } from "../i18n";
import { bulbIcon, sunIcon } from "../shared/icons";
import "../shared/terral-slider";
import {
  DEFAULT_FAVORITES,
  TEMP_PRESETS,
  brightnessPct,
  colorName,
  currentRgb,
  groupMembers,
  isOn,
  isUnavailable,
  kelvin,
  lightKind,
  rgbToHex,
  setBrightness,
  setKelvin,
  tintFor,
  toggle,
  type LightKind,
  type RGB,
} from "./light-model";
import { openLightDialog, updateLightDialog } from "./terral-light-dialog";

export interface TerralLightCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  use_light_color?: boolean;
  group_by_area?: "auto" | "always" | "never";
  favorite_colors?: ({ name?: string; rgb: RGB } | RGB)[];
}

/** Layout chosen from the card's real size: 1/1, 2/1, 2/2 or 4/2. */
type Size = "s11" | "s21" | "s22" | "s42";

export const LIGHT_CARD_TAG = "terral-home-light";

@customElement(LIGHT_CARD_TAG)
export class TerralLightCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) preview = false;
  @state() private _config?: TerralLightCardConfig;
  @state() private _size: Size = "s21";

  private _ro?: ResizeObserver;
  private _holdTimer?: number;
  private _holdStart?: { x: number; y: number };
  private _held = false;

  // ---- Lovelace card API -------------------------------------------------

  setConfig(config: TerralLightCardConfig): void {
    if (!config?.entity || !String(config.entity).startsWith("light.")) {
      throw new Error("Terral · Luz: 'entity' must be a light (light.xxx)");
    }
    this._config = config;
    // Inside the Terral view the size comes from the config; elsewhere
    // (e.g. HA's sections view) we measure the card instead.
    const s = config.view_layout?.terral;
    if (s) this._size = s.h === 1 ? "s11" : s.h === 4 ? "s42" : s.w === 2 ? "s22" : "s21";
  }

  getCardSize(): number {
    return 2;
  }

  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }

  /** Sizes the Terral view should offer for this card (w/h in cells). */
  getTerralSizes(): { w: number; h: number }[] {
    const e = this._entity;
    const all = [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 },
    ];
    if (!e) return all;
    const big = lightKind(e) === "temperature" || lightKind(e) === "color" || groupMembers(e).length > 0;
    return big ? all : all.slice(0, 3);
  }

  static getStubConfig(hass: HomeAssistant, entities: string[] = [], fallback: string[] = []) {
    const pick = [...entities, ...fallback].find((id) => id.startsWith("light."))
      ?? Object.keys(hass?.states ?? {}).find((id) => id.startsWith("light."))
      ?? "light.example";
    return { entity: pick };
  }

  static getConfigForm() {
    const l = (k: Parameters<typeof t>[1]) => t(undefined, k);
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "light" } } },
        { name: "name", selector: { text: {} } },
        { name: "use_light_color", default: true, selector: { boolean: {} } },
        {
          name: "group_by_area",
          default: "auto",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: l("group_auto") },
                { value: "always", label: l("group_always") },
                { value: "never", label: l("group_never") },
              ],
            },
          },
        },
      ],
      computeLabel: (s: { name: string }) =>
        ({
          entity: l("entity"),
          name: l("name"),
          use_light_color: l("use_light_color"),
          group_by_area: l("group_by_area"),
        })[s.name] ?? s.name,
    };
  }

  // ---- Lifecycle ---------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => {
      if (this._config?.view_layout?.terral) return;
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      let s: Size;
      if (h < 120) s = "s11";
      else if (w < h * 1.4) s = w > 260 && h > 260 ? "s42" : "s21";
      else s = "s22";
      if (s !== this._size) this._size = s;
    });
    this._ro.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has("hass")) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this.hass || !this._config) return true;
    if (old.locale?.language !== this.hass.locale?.language) return true;
    const ids = [this._config.entity, ...groupMembers(this.hass.states[this._config.entity] ?? ({ attributes: {} } as HassEntity))];
    return ids.some((id) => old.states[id] !== this.hass!.states[id]);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) updateLightDialog(this.hass);
  }

  private get _entity(): HassEntity | undefined {
    return this._config ? this.hass?.states[this._config.entity] : undefined;
  }

  // ---- Actions -----------------------------------------------------------

  private _openWindow = () => {
    if (!this.hass || !this._config) return;
    const favs = this._config.favorite_colors?.map((f) => (Array.isArray(f) ? { rgb: f as RGB } : f));
    openLightDialog(this.hass, {
      entity: this._config.entity,
      name: this._config.name,
      useLightColor: this._config.use_light_color !== false,
      favorites: favs,
      groupByArea: this._config.group_by_area,
    });
  };

  private _toggle = (ev: Event) => {
    ev.stopPropagation();
    const e = this._entity;
    if (e && this.hass && !isUnavailable(e)) toggle(this.hass, e);
  };

  private _down = (ev: PointerEvent) => {
    this._held = false;
    this._holdStart = { x: ev.clientX, y: ev.clientY };
    clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      this._openWindow();
    }, 550);
  };

  private _move = (ev: PointerEvent) => {
    if (!this._holdStart) return;
    if (Math.hypot(ev.clientX - this._holdStart.x, ev.clientY - this._holdStart.y) > 10) this._cancelHold();
  };

  private _cancelHold = () => {
    clearTimeout(this._holdTimer);
    this._holdStart = undefined;
  };

  /** Swallow the click that follows a long press. */
  private _clickCapture = (ev: Event) => {
    if (this._held) {
      ev.stopPropagation();
      ev.preventDefault();
      this._held = false;
    }
  };

  // ---- Render ------------------------------------------------------------

  private _name(e: HassEntity): string {
    return this._config?.name || this.hass?.formatEntityName?.(e) || (e.attributes.friendly_name as string) || e.entity_id;
  }

  private _status(e: HassEntity, kind: LightKind): string {
    const h = this.hass;
    if (isUnavailable(e)) return t(h, "unavailable");
    const members = groupMembers(e);
    if (members.length) {
      const on = members.filter((id) => isOn(h!.states[id])).length;
      if (!on) return `${members.length} ${t(h, "lights_off")}`;
      const b = brightnessPct(e);
      const base = on === members.length && kind === "onoff"
        ? `${t(h, "all_lit")} (${on})`
        : `${on} ${t(h, "of")} ${members.length} ${t(h, "lit")}`;
      return b != null && this._size !== "s11" ? `${base} · ${b} %` : base;
    }
    if (!isOn(e)) return t(h, "off");
    const parts: string[] = [];
    const b = brightnessPct(e);
    if (b != null) parts.push(`${b} %`);
    const rgb = currentRgb(e);
    if (rgb) {
      const n = colorName(rgb, lang(h));
      if (n) parts.push(n);
    } else if (kind === "temperature" || kind === "color") {
      const k = kelvin(e);
      if (k && e.attributes.color_mode === "color_temp") {
        const p = [...TEMP_PRESETS].sort((a, b2) => Math.abs(a.kelvin - k) - Math.abs(b2.kelvin - k))[0];
        parts.push(t(h, p.key));
      }
    }
    return parts.join(" · ") || t(h, "on");
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const e = this._entity;
    if (!e) {
      return html`<div class="card off missing"><span>${t(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    }
    const kind = lightKind(e);
    const on = isOn(e);
    const unavailable = isUnavailable(e);
    const members = groupMembers(e);
    const tint = tintFor(e, this._config.use_light_color !== false);
    const style = on ? `--bg:${tint.bg};--fg:${tint.fg};--fg2:${tint.fg2};--accent:${tint.accent};--fill:${tint.fill}` : "";
    let size = this._size;
    if (size === "s42" && !this.getTerralSizes().some((s) => s.h === 4)) size = "s22";

    const icon = html`<button
      class="icon"
      aria-label="${on ? t(this.hass, "turn_off") : t(this.hass, "turn_on")} ${this._name(e)}"
      ?disabled=${unavailable}
      @click=${this._toggle}
    >
      ${bulbIcon(on, size === "s11" ? 20 : 32)}
      ${members.length && on ? html`<span class="badge">${members.filter((id) => isOn(this.hass!.states[id])).length}</span>` : nothing}
    </button>`;

    const text = html`<button class="text" @click=${this._openWindow}>
      <span class="name">${this._name(e)}</span>
      <span class="state">${this._status(e, kind)}</span>
    </button>`;

    return html`<div
      class="card ${size} ${on ? "on" : "off"} ${unavailable ? "unavailable" : ""}"
      style=${style}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      @click=${this._clickCapture}
      @contextmenu=${(ev: Event) => ev.preventDefault()}
    >
      ${size === "s11" || size === "s21"
        ? html`${icon}${text}`
        : html`<div class="head">${icon}${text}${this._quickButton(e, kind, size)}</div>
            ${this._body(e, kind, size)}`}
    </div>`;
  }

  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  private _quickButton(e: HassEntity, kind: LightKind, size: Size) {
    if (kind !== "color" && kind !== "temperature") return nothing;
    if (size === "s42" && !groupMembers(e).length) return nothing;
    const rgb = currentRgb(e);
    const label = rgb ? colorName(rgb, lang(this.hass)) ?? "" : "";
    const swatch = kind === "color"
      ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${rgb ? rgbToHex(rgb) : "#fff"}`
      : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return html`<button class="pb" @click=${(ev: Event) => {
      ev.stopPropagation();
      this._openWindow();
    }}><i style=${swatch}></i>${label || (kind === "color" ? t(this.hass, "more_colors") : t(this.hass, "temperature"))}</button>`;
  }

  private _brightness(e: HassEntity, big = false) {
    return html`<terral-slider
      class="bar ${big ? "big" : ""}"
      .value=${brightnessPct(e) ?? 0}
      .label=${t(this.hass, "brightness")}
      @value-changed=${(ev: CustomEvent) => setBrightness(this.hass!, e.entity_id, ev.detail.value)}
    >${sunIcon(18)}</terral-slider>`;
  }

  private _body(e: HassEntity, kind: LightKind, size: Size) {
    const members = groupMembers(e);

    if (size === "s42" && members.length) {
      const sorted = [...members].sort((a, b) => Number(isOn(this.hass!.states[b])) - Number(isOn(this.hass!.states[a])));
      const max = kind === "onoff" ? 5 : 4;
      const shown = sorted.length > max ? sorted.slice(0, max - 1) : sorted;
      const rest = sorted.length - shown.length;
      return html`
        ${kind !== "onoff" ? this._brightness(e) : nothing}
        <div class="members">
          ${shown.map((id) => {
            const m = this.hass!.states[id];
            const mOn = isOn(m);
            const name = m ? this.hass!.formatEntityName?.(m) ?? (m.attributes.friendly_name as string) ?? id : id;
            return html`<div class="mr">
              <button class="mi ${mOn ? "lit" : ""}" ?disabled=${isUnavailable(m)} aria-label="${mOn ? t(this.hass, "turn_off") : t(this.hass, "turn_on")} ${name}"
                @click=${(ev: Event) => {
                  ev.stopPropagation();
                  m && toggle(this.hass!, m);
                }}>${bulbIcon(mOn, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${name}</span><small>${m ? (isOn(m) ? brightnessPct(m) != null ? `${brightnessPct(m)} %` : t(this.hass, "on") : t(this.hass, "off")) : "—"}</small></button>
            </div>`;
          })}
          ${rest > 0 ? html`<button class="morebtn" @click=${this._openWindow}>+ ${rest} ${t(this.hass, "more")}</button>` : nothing}
        </div>
      `;
    }

    if (kind === "onoff") {
      if (members.length) {
        return html`<div class="tags">
          ${members.slice(0, 4).map((id) => {
            const m = this.hass!.states[id];
            const name = m ? this.hass!.formatEntityName?.(m) ?? (m.attributes.friendly_name as string) ?? id : id;
            return html`<span class="tag"><i class=${isOn(m) ? "lit" : ""}></i>${name}</span>`;
          })}
        </div>`;
      }
      return html`<div class="since">
        <span><b>${isOn(e) ? t(this.hass, "on") : t(this.hass, "off")}</b>${new Date(e.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    }

    if (size !== "s42") return this._brightness(e);

    // 4/2 of a single temperature or colour light
    if (kind === "temperature") {
      const min = (e.attributes.min_color_temp_kelvin as number) ?? 2000;
      const max = (e.attributes.max_color_temp_kelvin as number) ?? 6500;
      return html`
        <p class="lbl">${t(this.hass, "brightness")}</p>
        ${this._brightness(e, true)}
        <p class="lbl">${t(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${min} .max=${max} .value=${kelvin(e) ?? 3500}
          .label=${t(this.hass, "temperature")}
          @value-changed=${(ev: CustomEvent) => setKelvin(this.hass!, e, ev.detail.value)}></terral-slider>
        <div class="chips">
          ${TEMP_PRESETS.map((p) => html`<button class="chip" style="background:${p.css}" @click=${(ev: Event) => {
            ev.stopPropagation();
            setKelvin(this.hass!, e, p.kelvin);
          }}>${t(this.hass, p.key)}</button>`)}
        </div>
      `;
    }
    const favs = (this._config?.favorite_colors?.map((f) => (Array.isArray(f) ? (f as RGB) : f.rgb)) ?? undefined);
    return html`
      <p class="lbl">${t(this.hass, "brightness")}</p>
      ${this._brightness(e, true)}
      <p class="lbl">${t(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${e} .colors=${favs}></terral-light-favs>
      <button class="pb wide" @click=${(ev: Event) => {
        ev.stopPropagation();
        this._openWindow();
      }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${t(this.hass, "more_colors")}</button>
    `;
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
      text-align: left;
    }
    button:disabled {
      cursor: default;
    }
    svg {
      display: block;
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
      user-select: none;
      -webkit-user-select: none;
      transition: background 0.25s, color 0.25s;
      --fg: #fff;
      --fg2: rgba(255, 255, 255, 0.75);
    }
    .off {
      background: var(--ha-card-background, rgba(255, 255, 255, 0.13));
      -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
      backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      color: var(--fg);
    }
    .on {
      background: var(--bg);
      color: var(--fg);
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
    .missing small {
      opacity: 0.7;
    }

    .icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      position: relative;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    .on .icon {
      background: var(--accent);
    }
    .badge {
      position: absolute;
      right: -4px;
      top: -4px;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      background: #fff;
      color: var(--fg);
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      box-sizing: border-box;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 1/1: icon left, text right */
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
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .s11 .text {
      flex: 1;
    }

    /* 2/2 and 4/2 */
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .head .text {
      flex: 1;
    }
    .s22 .name,
    .s42 .name {
      font-size: 17px;
    }
    .s42 {
      justify-content: flex-start;
      gap: 14px;
      padding: 16px;
    }
    .lbl {
      margin: 0 0 -6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--fg2);
    }
    .pb {
      height: 40px;
      border-radius: 20px;
      padding: 0 14px 0 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      flex: none;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
      white-space: nowrap;
    }
    .pb i {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      flex: none;
    }
    .pb.wide {
      justify-content: center;
      margin-top: auto;
    }
    .bar {
      --terral-slider-track: color-mix(in srgb, var(--fg) 12%, transparent);
      --terral-slider-fill: var(--fill, rgba(255, 255, 255, 0.35));
      --terral-slider-text: var(--fg);
      flex: none;
    }
    .bar.big {
      --terral-slider-size: 48px;
    }
    .temp {
      --terral-slider-track: linear-gradient(90deg, #ffa94d, #ffe7c2, #eaf3ff, #a9cdff);
      --terral-slider-size: 32px;
      --terral-slider-radius: 16px;
      flex: none;
    }
    .chips {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }
    .chip {
      flex: 1;
      height: 36px;
      border-radius: 18px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      color: #2a2a3a;
    }
    .since {
      display: flex;
      gap: 22px;
      font-size: 12px;
      color: var(--fg2);
    }
    .since b {
      display: block;
      font-size: 15px;
      color: var(--fg);
    }
    .tags {
      display: flex;
      gap: 8px;
      overflow: hidden;
    }
    .tag {
      flex: 1;
      min-width: 0;
      height: 36px;
      border-radius: 18px;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 8px;
      white-space: nowrap;
      overflow: hidden;
    }
    .tag i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
      background: color-mix(in srgb, var(--fg) 30%, transparent);
    }
    .tag i.lit {
      background: #ffb020;
    }
    .members {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .mr {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 42px;
      flex: none;
    }
    .mr + .mr {
      border-top: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .mi {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .mi.lit {
      background: #ffb020;
      color: #fff;
    }
    .mt {
      flex: 1;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      min-width: 0;
    }
    .mt span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mt small {
      color: var(--fg2);
      font-size: 13px;
      white-space: nowrap;
    }
    .morebtn {
      margin-top: 6px;
      height: 36px;
      border-radius: 18px;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
    }
  `;
}

/** Row of favourite colour swatches used on the 4/2 colour card. */
@customElement("terral-light-favs")
export class TerralLightFavs extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) entity?: HassEntity;
  @property({ attribute: false }) colors?: RGB[];

  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
    }
    button {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 0;
      padding: 0;
      cursor: pointer;
    }
    .sel {
      box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 0, 0, 0.35);
    }
  `;

  render() {
    if (!this.hass || !this.entity) return nothing;
    const lng = lang(this.hass);
    const list: { rgb: RGB; name: string }[] = this.colors?.length
      ? this.colors.map((c) => ({ rgb: c, name: rgbToHex(c) }))
      : (DEFAULT_FAVS_CACHE[lng] ??= defaultFavs(lng));
    const cur = currentRgb(this.entity);
    return list.slice(0, 6).map(
      (c) => html`<button
        class=${cur && rgbToHex(cur) === rgbToHex(c.rgb) ? "sel" : ""}
        style="background:${rgbToHex(c.rgb)}"
        aria-label=${c.name}
        @click=${(ev: Event) => {
          ev.stopPropagation();
          this.hass!.callService("light", "turn_on", { rgb_color: c.rgb }, { entity_id: this.entity!.entity_id });
        }}
      ></button>`,
    );
  }
}

const DEFAULT_FAVS_CACHE: Partial<Record<"es" | "en", { rgb: RGB; name: string }[]>> = {};
const defaultFavs = (lng: "es" | "en") => DEFAULT_FAVORITES.map((f) => ({ rgb: f.rgb, name: f.name[lng] }));

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-light": TerralLightCard;
    "terral-light-favs": TerralLightFavs;
  }
}
