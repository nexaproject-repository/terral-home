// The light window: bottom sheet on phones, centred modal on tablets and PC.
// It lives on document.body so it sits above HA's toolbar and our view.
import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant } from "../ha-types";
import { lang, relativeTime, t } from "../i18n";
import { bulbIcon, chevronIcon, closeIcon, powerIcon, sunIcon } from "../shared/icons";
import "../shared/terral-slider";
import { lockBackgroundScroll } from "../shared/scroll-lock";
import {
  DEFAULT_FAVORITES,
  TEMP_PRESETS,
  areaOf,
  brightnessPct,
  colorName,
  currentRgb,
  groupMembers,
  hexToRgb,
  isOn,
  isUnavailable,
  kelvin,
  lightKind,
  rgbToHex,
  setBrightness,
  setKelvin,
  setPower,
  setRgb,
  supportsTemp,
  tintFor,
  toggle,
  type RGB,
} from "./light-model";

export interface LightDialogOptions {
  entity: string;
  name?: string;
  useLightColor?: boolean;
  favorites?: { name?: string; rgb: RGB }[];
  groupByArea?: "auto" | "always" | "never";
}

let current: TerralLightDialog | undefined;

export function openLightDialog(hass: HomeAssistant, opts: LightDialogOptions) {
  current?.close();
  const d = document.createElement("terral-light-dialog");
  d.hass = hass;
  d.opts = opts;
  document.body.appendChild(d);
  current = d;
}

/** Cards call this on every hass update so an open window stays live. */
export function updateLightDialog(hass: HomeAssistant) {
  if (current?.isConnected) current.hass = hass;
}

@customElement("terral-light-dialog")
export class TerralLightDialog extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) opts!: LightDialogOptions;

  /** Member windows opened from a group's list (back arrow returns). */
  @state() private _stack: string[] = [];
  @state() private _expanded = false;
  @state() private _closing = false;
  @state() private _wide = window.matchMedia("(min-width: 600px)").matches;
  @state() private _openAreas = new Set<string>();

  @query("input[type=color]") private _picker?: HTMLInputElement;

  private _mq = window.matchMedia("(min-width: 600px)");
  private _unlock?: () => void;
  private _grabY?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this._mq.addEventListener("change", this._onMq);
    window.addEventListener("keydown", this._onKey);
    this._unlock = lockBackgroundScroll(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mq.removeEventListener("change", this._onMq);
    window.removeEventListener("keydown", this._onKey);
    this._unlock?.();
    if (current === this) current = undefined;
  }

  private _onMq = (e: MediaQueryListEvent) => (this._wide = e.matches);
  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.close();
  };

  close() {
    if (this._closing) return;
    this._closing = true;
    setTimeout(() => this.remove(), 180);
  }

  private get _entityId(): string {
    return this._stack[this._stack.length - 1] ?? this.opts.entity;
  }

  private _name(e: HassEntity): string {
    if (!this._stack.length && this.opts.name) return this.opts.name;
    return this.hass.formatEntityName?.(e) ?? (e.attributes.friendly_name as string) ?? e.entity_id;
  }

  private _stateText(e: HassEntity): string {
    if (isUnavailable(e)) return t(this.hass, "unavailable");
    if (!isOn(e)) return t(this.hass, "off");
    const parts: string[] = [];
    const members = groupMembers(e);
    if (members.length) {
      const on = members.filter((id) => isOn(this.hass.states[id])).length;
      parts.push(`${on} ${t(this.hass, "of")} ${members.length} ${t(this.hass, "lit")}`);
    }
    const b = brightnessPct(e);
    if (b != null) parts.push(`${b} %`);
    const rgb = currentRgb(e);
    const k = kelvin(e);
    if (rgb) {
      const n = colorName(rgb, lang(this.hass));
      if (n) parts.push(n);
    } else if (k && e.attributes.color_mode === "color_temp") parts.push(`${k} K`);
    if (!parts.length) parts.push(t(this.hass, "on"));
    return parts.join(" · ");
  }

  // ---- Sheet gestures (phone) -------------------------------------------

  private _grabDown = (ev: PointerEvent) => {
    this._grabY = ev.clientY;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  };

  private _grabUp = (ev: PointerEvent) => {
    if (this._grabY == null) return;
    const dy = ev.clientY - this._grabY;
    this._grabY = undefined;
    if (dy < -40) this._expanded = true;
    else if (dy > 80) this._expanded ? (this._expanded = false) : this.close();
    else if (Math.abs(dy) < 6) this._expanded = !this._expanded;
  };

  // ---- Render -------------------------------------------------------------

  render() {
    const e = this.hass.states[this._entityId];
    const cls = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return html`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${cls}" role="dialog" aria-modal="true" aria-label=${e ? this._name(e) : this._entityId}>
        ${this._wide
          ? nothing
          : html`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${e ? this._content(e) : html`<p class="empty">${t(this.hass, "not_found")}</p>`}
      </div>
    `;
  }

  private _content(e: HassEntity) {
    const on = isOn(e);
    const tint = tintFor(e, this.opts.useLightColor !== false);
    const members = groupMembers(e);
    const style = `--accent:${tint.accent};--fill:${tint.fill};--onbg:${tint.bg};--onfg:${tint.fg}`;
    const controls = this._controls(e);
    const list = members.length ? this._memberList(e, members) : nothing;
    const info = this._info(e);
    return html`
      <div class="body" style=${style}>
        <header>
          ${this._stack.length
            ? html`<button class="round back" aria-label="←" @click=${() => (this._stack = this._stack.slice(0, -1))}>
                ${chevronIcon(false, 18)}
              </button>`
            : nothing}
          <button
            class="icon ${on ? "on" : ""}"
            aria-label=${on ? t(this.hass, "turn_off") : t(this.hass, "turn_on")}
            ?disabled=${isUnavailable(e)}
            @click=${() => toggle(this.hass, e)}
          >
            ${bulbIcon(on, this._wide ? 28 : 24)}
            ${members.length && on
              ? html`<span class="badge">${members.filter((id) => isOn(this.hass.states[id])).length}</span>`
              : nothing}
          </button>
          <div class="title">
            <strong>${this._name(e)}</strong>
            <span>${this._stateText(e)}${areaOf(this.hass, e.entity_id) ? ` · ${areaOf(this.hass, e.entity_id)}` : ""}</span>
          </div>
          <button class="round close" aria-label=${t(this.hass, "close")} @click=${() => this.close()}>
            ${closeIcon(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide
          ? html`<div class="cols">
              <div class="left">${controls.main}</div>
              <div class="right">${controls.side}${list}${members.length ? nothing : info}</div>
            </div>`
          : html`<div class="stack">
              <div class="main-row">${controls.main}${controls.beside ?? nothing}</div>
              ${controls.side}${list}${members.length ? nothing : info}
            </div>`}
      </div>
    `;
  }

  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  private _controls(e: HassEntity): { main: TemplateResult; side: TemplateResult | typeof nothing; beside?: TemplateResult } {
    const kind = lightKind(e);
    const on = isOn(e);
    const id = e.entity_id;

    if (kind === "onoff") {
      return {
        main: html`<button class="switch ${on ? "on" : ""}" aria-pressed=${on} aria-label=${on ? t(this.hass, "turn_off") : t(this.hass, "turn_on")}
            @click=${() => toggle(this.hass, e)}>
            <span>${powerIcon(36)}</span>
          </button>`,
        side: nothing,
      };
    }

    const bright = html`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${brightnessPct(e) ?? 0}
      .label=${t(this.hass, "brightness")}
      @value-changed=${(ev: CustomEvent) => setBrightness(this.hass, id, ev.detail.value)}
    >${sunIcon(28)}</terral-slider>`;

    const presets = html`<div class="chips">
      ${[25, 50, 75, 100].map(
        (p) => html`<button class="chip" @click=${() => setBrightness(this.hass, id, p)}>${p} %</button>`,
      )}
    </div>`;

    const tempPresets = html`<div class="chips">
      ${TEMP_PRESETS.map(
        (p) => html`<button class="chip tinted" style="background:${p.css}" @click=${() => setKelvin(this.hass, e, p.kelvin)}>
          ${t(this.hass, p.key)}
        </button>`,
      )}
    </div>`;

    if (kind === "dimmable") return { main: bright, side: presets };

    if (kind === "temperature") {
      const min = (e.attributes.min_color_temp_kelvin as number) ?? 2000;
      const max = (e.attributes.max_color_temp_kelvin as number) ?? 6500;
      const temp = html`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${min}
        .max=${max}
        .value=${kelvin(e) ?? Math.round((min + max) / 2)}
        .label=${t(this.hass, "temperature")}
        @value-changed=${(ev: CustomEvent) => setKelvin(this.hass, e, ev.detail.value)}
      ></terral-slider>`;
      return this._wide
        ? { main: html`<div class="pair">${bright}${temp}</div>`, side: tempPresets }
        : { main: html`<div class="pair">${bright}${temp}</div>`, side: tempPresets };
    }

    // colour
    const lng = lang(this.hass);
    const favs = (this.opts.favorites?.length ? this.opts.favorites : DEFAULT_FAVORITES.map((f) => ({ name: f.name[lng], rgb: f.rgb }))).slice(0, 6);
    const cur = currentRgb(e);
    const swatches = html`
      <p class="lb">${t(this.hass, "favorites")}</p>
      <div class="swatches">
        ${favs.map(
          (f) => html`<button
            class="sw ${cur && rgbToHex(cur) === rgbToHex(f.rgb) ? "sel" : ""}"
            style="background:${rgbToHex(f.rgb)}"
            aria-label=${f.name ?? rgbToHex(f.rgb)}
            @click=${() => setRgb(this.hass, id, f.rgb)}
          ></button>`,
        )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${t(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${cur ? rgbToHex(cur) : "#ffffff"} @change=${(ev: Event) =>
        setRgb(this.hass, id, hexToRgb((ev.target as HTMLInputElement).value))} />
      ${supportsTemp(e) ? html`<p class="lb">${t(this.hass, "temperature")}</p>${tempPresets}` : nothing}
    `;
    return this._wide
      ? { main: bright, side: swatches }
      : { main: bright, side: nothing, beside: html`<div class="beside">${swatches}</div>` };
  }

  private _memberList(group: HassEntity, members: string[]) {
    const mode = this.opts.groupByArea ?? "auto";
    const areas = new Map<string, string[]>();
    for (const id of members) {
      const a = areaOf(this.hass, id) ?? t(this.hass, "other_area");
      areas.set(a, [...(areas.get(a) ?? []), id]);
    }
    const byArea = mode === "always" || (mode === "auto" && members.length > 8 && areas.size > 1);
    const quick = members.length > 8
      ? html`<div class="chips">
          <button class="chip" @click=${() => setPower(this.hass, group.entity_id, true)}>${t(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => setPower(this.hass, group.entity_id, false)}>${t(this.hass, "all_off")}</button>
        </div>`
      : nothing;

    const row = (id: string) => {
      const m = this.hass.states[id];
      const mOn = isOn(m);
      const name = m ? this.hass.formatEntityName?.(m) ?? (m.attributes.friendly_name as string) ?? id : id;
      return html`<div class="mr">
        <button class="mi ${mOn ? "on" : ""}" ?disabled=${isUnavailable(m)}
          aria-label="${mOn ? t(this.hass, "turn_off") : t(this.hass, "turn_on")} ${name}"
          @click=${() => m && toggle(this.hass, m)}>${bulbIcon(mOn, 18)}</button>
        <button class="mt" @click=${() => (this._stack = [...this._stack, id])}>
          <span>${name}</span><small>${m ? this._stateText(m) : t(this.hass, "not_found")}</small>
        </button>
      </div>`;
    };

    const sorted = (ids: string[]) => [...ids].sort((a, b) => Number(isOn(this.hass.states[b])) - Number(isOn(this.hass.states[a])));

    return html`
      ${quick}
      <p class="lb">${t(this.hass, "lights_in_group")} (${members.length})</p>
      <div class="list">
        ${byArea
          ? [...areas.entries()].map(([area, ids]) => {
              const open = this._openAreas.has(area);
              const onCount = ids.filter((id) => isOn(this.hass.states[id])).length;
              return html`<div class="box">
                <div class="sec">
                  <button class="mi ${onCount ? "on" : ""}" aria-label="${onCount ? t(this.hass, "turn_off") : t(this.hass, "turn_on")} ${area}"
                    @click=${() => setPower(this.hass, ids, onCount === 0)}>${bulbIcon(onCount > 0, 18)}</button>
                  <button class="mt" aria-expanded=${open} @click=${() => {
                    const s = new Set(this._openAreas);
                    open ? s.delete(area) : s.add(area);
                    this._openAreas = s;
                  }}>
                    <span>${area} <small>${onCount} ${t(this.hass, "of")} ${ids.length}</small></span>${chevronIcon(open)}
                  </button>
                </div>
                ${open ? html`<div class="inner">${ids.map(row)}</div>` : nothing}
              </div>`;
            })
          : html`<div class="box">${sorted(members).map(row)}</div>`}
      </div>
    `;
  }

  private _info(e: HassEntity) {
    return html`<div class="info">
      <div><span>${t(this.hass, "last_activity")}</span><span>${relativeTime(this.hass, e.last_changed)}</span></div>
    </div>`;
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 9999;
      overscroll-behavior: contain;
      -webkit-user-select: none;
      user-select: none;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      color: #fff;
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
      opacity: 0.5;
      cursor: default;
    }
    svg {
      display: block;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 12, 30, 0.4);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      animation: fade 0.18s ease-out;
    }
    .backdrop.closing {
      opacity: 0;
      transition: opacity 0.18s;
    }
    .panel {
      position: absolute;
      background: rgba(36, 38, 66, 0.72);
      -webkit-backdrop-filter: blur(40px) saturate(160%);
      backdrop-filter: blur(40px) saturate(160%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .sheet {
      left: 0;
      right: 0;
      bottom: 0;
      max-height: calc(100% - 96px);
      border-radius: 34px 34px 0 0;
      border-width: 1px 0 0;
      padding: 0 20px calc(24px + env(safe-area-inset-bottom));
      animation: up 0.22s ease-out;
      transition: max-height 0.22s ease, transform 0.18s ease;
    }
    .sheet.expanded {
      top: 54px;
      max-height: none;
    }
    .sheet.closing {
      transform: translateY(100%);
    }
    .modal {
      left: 50%;
      top: 50%;
      width: min(700px, calc(100% - 48px));
      max-height: min(680px, calc(100% - 48px));
      transform: translate(-50%, -50%);
      border-radius: 34px;
      padding: 24px 28px 28px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
      animation: pop 0.2s ease-out;
    }
    .modal.closing {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.96);
      transition: opacity 0.18s, transform 0.18s;
    }
    @keyframes fade { from { opacity: 0; } }
    @keyframes up { from { transform: translateY(100%); } }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); } }

    .grab {
      flex: none;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      touch-action: none;
    }
    .grab span {
      width: 40px;
      height: 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.35);
    }
    .body {
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-height: 0;
      flex: 1;
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: none;
    }
    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.16);
      position: relative;
      flex: none;
    }
    .modal .icon {
      width: 56px;
      height: 56px;
    }
    .icon.on {
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
      color: #3a2a10;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      box-sizing: border-box;
    }
    .title {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .title strong {
      font-size: 19px;
      font-weight: 600;
    }
    .modal .title strong {
      font-size: 22px;
    }
    .title span {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.75);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .round {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .modal .close {
      width: 52px;
      height: 52px;
    }
    .back svg {
      transform: rotate(180deg);
    }

    .stack {
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow-y: auto;
      min-height: 0;
      overscroll-behavior: contain;
    }
    .main-row {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex: none;
    }
    .beside {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 0;
    }
    .cols {
      display: flex;
      gap: 30px;
      min-height: 0;
      flex: 1;
    }
    .left {
      display: flex;
      flex: none;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .pill {
      --terral-slider-track: rgba(255, 255, 255, 0.14);
      --terral-slider-fill: var(--fill);
      --terral-slider-text: #3a2a10;
      --terral-slider-size: 120px;
      height: 260px;
      color: #3a2a10;
    }
    .modal .pill {
      --terral-slider-size: 150px;
      height: auto;
      min-height: 300px;
    }
    .pair {
      display: flex;
      gap: 18px;
    }
    .pair .pill {
      --terral-slider-size: 104px;
    }
    .modal .pair .pill {
      --terral-slider-size: 120px;
    }
    .pill.temp {
      --terral-slider-track: linear-gradient(0deg, #ffa94d, #ffe7c2 45%, #eaf3ff 75%, #a9cdff);
    }
    .switch {
      width: 130px;
      height: 280px;
      border-radius: 38px;
      background: rgba(255, 255, 255, 0.14);
      position: relative;
      margin: 0 auto;
    }
    .switch span {
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 8px;
      height: calc(50% - 8px);
      border-radius: 31px;
      background: rgba(255, 255, 255, 0.22);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: bottom 0.2s, background 0.2s;
    }
    .switch.on span {
      bottom: calc(50%);
      background: #fff7e8;
      color: var(--accent);
    }

    .chips {
      display: flex;
      gap: 8px;
      flex: none;
    }
    .chip {
      flex: 1;
      height: 40px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.14);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
    }
    .chip.tinted {
      color: #2a2a3a;
    }
    .beside .chips {
      flex-wrap: wrap;
    }
    .beside .chip {
      flex: 1 1 40%;
      height: 36px;
    }
    .lb {
      margin: 0 0 -6px;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
    }
    .swatches {
      display: grid;
      grid-template-columns: repeat(3, 40px);
      justify-content: space-between;
      gap: 12px;
    }
    .modal .swatches {
      grid-template-columns: repeat(6, 46px);
    }
    .sw {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .modal .sw {
      width: 46px;
      height: 46px;
    }
    .sw.sel {
      box-shadow: 0 0 0 2px #262842, 0 0 0 4px #fff;
    }
    .more {
      height: 44px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      flex: none;
    }
    .wheel {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: conic-gradient(#ff5a5a, #ffd35a, #6ee07a, #5ac8fa, #8a6cff, #ff5ac8, #ff5a5a);
    }
    input[type="color"] {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      pointer-events: none;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .box,
    .info {
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      flex: none;
    }
    .mr,
    .sec {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 52px;
      padding: 0 14px;
    }
    .mr + .mr,
    .inner {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .inner .mr {
      padding-left: 30px;
    }
    .mi {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: rgba(255, 255, 255, 0.14);
    }
    .mi.on {
      background: #ffb020;
    }
    .mt {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      font-size: 15px;
      font-weight: 500;
      min-width: 0;
    }
    .mt small {
      font-size: 13px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
    }
    .info div {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      height: 44px;
      align-items: center;
      font-size: 14px;
    }
    .info div span:last-child {
      color: rgba(255, 255, 255, 0.72);
    }
    .empty {
      padding: 40px 0;
      text-align: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-light-dialog": TerralLightDialog;
  }
}
