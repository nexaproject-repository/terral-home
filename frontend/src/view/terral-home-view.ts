// Terral Home view: type "custom:terral-home-view".
// HA creates the cards; we lay them out on a 2-column (phone) or 4-column
// (tablet and wider) grid and, in edit mode, let the user move, resize,
// edit, delete and add cards. Sizes live in card.view_layout.terral.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  fireEvent,
  type HomeAssistant,
  type HuiCard,
  type Lovelace,
  type LovelaceCardConfig,
  type LovelaceViewConfig,
} from "../ha-types";
import { t } from "../i18n";
import { gripIcon, menuIcon, pencilIcon, plusIcon, resizeIcon, trashIcon } from "../shared/icons";
import { backgroundCss } from "./backgrounds";

interface TerralViewConfig extends LovelaceViewConfig {
  /** Built-in key (crepusculo, terral, mar), an image URL or any CSS background. */
  background?: string;
}

interface CellSize {
  w: number;
  h: number;
}

const ALL_SIZES: CellSize[] = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 },
];

@customElement("terral-home-view")
export class TerralHomeView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) lovelace?: Lovelace;
  @property({ type: Boolean }) narrow = false;
  @property({ type: Number }) index?: number;
  @property({ attribute: false }) path?: (string | number)[];
  @property({ attribute: false }) cards: HuiCard[] = [];
  @property({ attribute: false }) badges: unknown[] = [];
  @property({ attribute: false }) sections: unknown[] = [];
  @property({ type: Boolean }) isStrategy = false;

  @state() private _config?: TerralViewConfig;
  @state() private _cols = 2;
  @state() private _rowH = 82;
  @state() private _dragFrom?: number;
  @state() private _dropAt?: number;
  @state() private _dragDx = 0;
  @state() private _dragDy = 0;
  @state() private _saving = false;

  /** HA waits on this before hiding its loading state. */
  public initialRenderComplete: Promise<void>;
  private _resolveInitial!: () => void;
  private _ro?: ResizeObserver;
  private _dragStart?: { x: number; y: number };

  constructor() {
    super();
    this.initialRenderComplete = new Promise((r) => (this._resolveInitial = r));
  }

  setConfig(config: TerralViewConfig): void {
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("card-visibility-changed", this._onVisibility);
    this._ro = new ResizeObserver(([entry]) => this._measure(entry.contentRect.width));
    this._ro.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("card-visibility-changed", this._onVisibility);
    this._ro?.disconnect();
  }

  protected firstUpdated(): void {
    this._resolveInitial();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("cards")) {
      for (const card of this.cards) card.layout = "grid";
    }
  }

  private _onVisibility = () => this.requestUpdate();

  private _measure(width: number) {
    const inner = Math.min(width, 1180) - 2 * this._pad(width);
    const cols = width < 600 ? 2 : 4;
    const gap = this._gap(width);
    const colW = (inner - gap * (cols - 1)) / cols;
    const rowH = Math.max(56, Math.round((colW - gap) / 2));
    if (cols !== this._cols) this._cols = cols;
    if (rowH !== this._rowH) this._rowH = rowH;
  }

  private _gap(width = this.clientWidth) {
    return width < 600 ? 10 : 14;
  }

  private _pad(width = this.clientWidth) {
    return width < 600 ? 16 : 24;
  }

  private get _editMode(): boolean {
    return !!this.lovelace?.editMode && !this.isStrategy;
  }

  private get _canSave(): boolean {
    return this._editMode && this.lovelace?.mode !== "yaml";
  }

  // ---- Sizes ---------------------------------------------------------------

  private _sizeOf(config?: LovelaceCardConfig): CellSize {
    const s = config?.view_layout?.terral;
    let w = s?.w === 2 ? 2 : 1;
    let h = s?.h === 1 || s?.h === 4 ? s.h : 2;
    if (!s) {
      h = 2;
      w = 1;
    }
    if (h === 4) w = 2;
    return { w: Math.min(w, this._cols), h };
  }

  private _allowedSizes(card: HuiCard): CellSize[] {
    const inner = (card.firstElementChild ?? card.shadowRoot?.firstElementChild) as
      | (HTMLElement & { getTerralSizes?: () => CellSize[] })
      | null;
    return inner?.getTerralSizes?.() ?? ALL_SIZES;
  }

  // ---- Config writes ------------------------------------------------------

  private async _writeCards(mutate: (cards: LovelaceCardConfig[]) => void) {
    if (!this._canSave || this.index == null || !this.lovelace) return;
    const config = structuredClone(this.lovelace.config);
    const view = config.views[this.index];
    if (!view) return;
    view.cards = [...(view.cards ?? [])];
    mutate(view.cards);
    this._saving = true;
    try {
      await this.lovelace.saveConfig(config);
    } finally {
      this._saving = false;
    }
  }

  private _cycleSize(i: number) {
    const card = this.cards[i];
    const sizes = this._allowedSizes(card).filter((s) => s.w <= this._cols);
    const cur = this._sizeOf(card.config);
    const idx = sizes.findIndex((s) => s.w === cur.w && s.h === cur.h);
    const next = sizes[(idx + 1) % sizes.length];
    this._writeCards((cards) => {
      const c = { ...cards[i] };
      c.view_layout = { ...(c.view_layout ?? {}), terral: { w: next.w, h: next.h } };
      cards[i] = c;
    });
  }

  private _move(from: number, to: number) {
    if (from === to) return;
    this._writeCards((cards) => {
      const [c] = cards.splice(from, 1);
      cards.splice(to, 0, c);
    });
  }

  private _edit(i: number) {
    fireEvent(this, "ll-edit-card", { path: [this.index, i] });
  }

  private _delete(i: number) {
    fireEvent(this, "ll-delete-card", { path: [this.index, i], silent: false });
  }

  private _add() {
    const [y, m] = (this.hass?.config?.version ?? "2026.11").split(".").map(Number);
    const modern = y > 2026 || (y === 2026 && m >= 11);
    fireEvent(this, "ll-create-card", { path: modern ? ["views", this.index, "cards"] : [this.index] });
  }

  // ---- Drag to reorder ----------------------------------------------------

  private _dragDown(ev: PointerEvent, i: number) {
    if (!this._canSave) return;
    ev.preventDefault();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    this._dragFrom = i;
    this._dropAt = i;
    this._dragStart = { x: ev.clientX, y: ev.clientY };
    this._dragDx = this._dragDy = 0;
  }

  private _dragMove(ev: PointerEvent) {
    if (this._dragFrom == null || !this._dragStart) return;
    this._dragDx = ev.clientX - this._dragStart.x;
    this._dragDy = ev.clientY - this._dragStart.y;
    const hit = this.shadowRoot
      ?.elementsFromPoint(ev.clientX, ev.clientY)
      .find((el) => el instanceof HTMLElement && el.dataset.i != null && el.dataset.i !== String(this._dragFrom)) as
      | HTMLElement
      | undefined;
    if (hit) this._dropAt = Number(hit.dataset.i);
  }

  private _dragUp() {
    const from = this._dragFrom;
    const to = this._dropAt;
    this._dragFrom = this._dropAt = undefined;
    this._dragStart = undefined;
    this._dragDx = this._dragDy = 0;
    if (from != null && to != null) this._move(from, to);
  }

  // ---- Render -------------------------------------------------------------

  render() {
    const edit = this._editMode;
    const gap = this._gap();
    const title = (this._config?.title as string | undefined) || t(this.hass, "home_title");
    return html`
      <div class="bg" style="background:${backgroundCss(this._config?.background)}"></div>
      <div class="wrap" style="--gap:${gap}px;--pad:${this._pad()}px">
        <div class="top">
          <button class="glass round" aria-label=${t(this.hass, "menu")} @click=${() => fireEvent(this, "hass-toggle-menu")}>
            ${menuIcon()}
          </button>
        </div>
        <h1>${title}</h1>
        ${edit && this.lovelace?.mode === "yaml" ? html`<p class="notice">${t(this.hass, "yaml_mode")}</p>` : nothing}
        <div
          class="grid ${edit ? "editing" : ""} ${this._saving ? "saving" : ""}"
          style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
          @pointermove=${this._dragMove}
          @pointerup=${this._dragUp}
          @pointercancel=${this._dragUp}
        >
          ${this.cards.map((card, i) => this._cell(card, i, edit))}
          ${edit
            ? html`<button class="add glass" @click=${this._add} style="grid-row:span 1">
                ${plusIcon()}<span>${t(this.hass, "add_card")}</span>
              </button>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _cell(card: HuiCard, i: number, edit: boolean) {
    if (!edit && card.hidden) return nothing;
    const { w, h } = this._sizeOf(card.config);
    const dragging = this._dragFrom === i;
    const target = this._dropAt === i && this._dragFrom != null && !dragging;
    const style = `grid-column:span ${w};grid-row:span ${h};${
      dragging ? `transform:translate(${this._dragDx}px,${this._dragDy}px);z-index:5` : ""
    }`;
    return html`<div class="cell ${dragging ? "dragging" : ""} ${target ? "target" : ""}" data-i=${i} style=${style}>
      ${card}
      ${edit
        ? html`<div class="overlay ${card.hidden ? "is-hidden" : ""}">
            <div class="tools">
              ${this._canSave
                ? html`<button class="tool grip" aria-label=${t(this.hass, "drag")} @pointerdown=${(ev: PointerEvent) => this._dragDown(ev, i)}>
                    ${gripIcon()}
                  </button>`
                : nothing}
              <span class="spacer"></span>
              ${this._canSave
                ? html`<button class="tool" aria-label="${t(this.hass, "size")} ${h}/${w}" @click=${() => this._cycleSize(i)}>
                    ${resizeIcon()}<small>${h}/${w}</small>
                  </button>`
                : nothing}
              <button class="tool" aria-label=${t(this.hass, "edit")} @click=${() => this._edit(i)}>${pencilIcon()}</button>
              <button class="tool" aria-label=${t(this.hass, "delete")} @click=${() => this._delete(i)}>${trashIcon()}</button>
            </div>
          </div>`
        : nothing}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      min-height: calc(100vh - var(--header-height, 56px));
      color: #fff;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      isolation: isolate;
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
    svg {
      display: block;
    }
    .bg {
      position: fixed;
      inset: 0;
      z-index: -1;
    }
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 16px var(--pad) 48px;
      box-sizing: border-box;
    }
    .glass {
      background: rgba(255, 255, 255, 0.13);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }
    .top {
      display: flex;
      align-items: center;
      height: 44px;
    }
    .round {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    h1 {
      margin: 14px 0 18px;
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -0.6px;
    }
    .notice {
      margin: -6px 0 16px;
      font-size: 13px;
      opacity: 0.85;
    }
    .grid {
      display: grid;
      gap: var(--gap);
      grid-auto-flow: row dense;
    }
    .grid.saving {
      opacity: 0.7;
      pointer-events: none;
    }
    .cell {
      position: relative;
      min-width: 0;
      min-height: 0;
    }
    .cell > :first-child {
      display: block;
      height: 100%;
    }
    .editing .cell > :first-child {
      pointer-events: none;
    }
    .cell.dragging {
      opacity: 0.85;
      transition: none;
    }
    .cell.target::after {
      content: "";
      position: absolute;
      inset: -4px;
      border: 2px dashed rgba(255, 255, 255, 0.85);
      border-radius: 24px;
      pointer-events: none;
    }
    .overlay {
      position: absolute;
      inset: 0;
      border-radius: 22px;
      outline: 2px dashed rgba(255, 255, 255, 0.45);
      outline-offset: 2px;
    }
    .overlay.is-hidden {
      background: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.18) 0 8px, transparent 8px 16px);
    }
    .tools {
      position: absolute;
      left: 6px;
      right: 6px;
      top: 6px;
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .spacer {
      flex: 1;
    }
    .tool {
      height: 34px;
      min-width: 34px;
      padding: 0 8px;
      box-sizing: border-box;
      border-radius: 17px;
      background: rgba(20, 22, 44, 0.72);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
    }
    .grip {
      cursor: grab;
      touch-action: none;
    }
    .add {
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      border-style: dashed;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-view": TerralHomeView;
  }
}
