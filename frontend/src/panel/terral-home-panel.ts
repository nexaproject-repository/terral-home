// Terral Home panel: full-screen page in HA's sidebar (no HA toolbar).
// The integration stores the layout (cards, sizes, order); this element
// shows it on a 2-column (phone) or 4-column (tablet and wider) grid.
//
// - Starts empty, with an "Añadir accesorio" tile.
// - "+" adds a card; "···" opens the Terral menu.
// - Long press on a card enters move mode (cards jiggle): drag to reorder,
//   "−" removes, the corner grip resizes, "Listo" exits.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { fireEvent, type HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { isGroup } from "../light/light-model";
import { dotsIcon, menuIcon, minusIcon, plusIcon } from "../shared/icons";
import { backgroundCss } from "../shared/backgrounds";
import { openAddSheet } from "./terral-add-sheet";
import { openMenuSheet } from "./terral-menu-sheet";
import { VERSION } from "../version";

export interface TerralCard {
  id: string;
  type: "light";
  entity: string;
  w: 1 | 2;
  h: 1 | 2 | 4;
  [key: string]: unknown;
}

export interface TerralLayout {
  cards: TerralCard[];
  [key: string]: unknown;
}

interface CellSize {
  w: number;
  h: number;
}

type CardEl = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(c: Record<string, unknown>): void;
  getTerralSizes?: () => CellSize[];
};

const ALL_SIZES: CellSize[] = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 },
];

const ROW_RATIO = 0.85;

const uid =() => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

@customElement("terral-home-panel")
export class TerralHomePanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) route?: unknown;
  @property({ attribute: false }) panel?: { config?: { version?: string } };

  @state() private _layout?: TerralLayout;
  @state() private _error?: string;
  @state() private _edit = false;
  @state() private _cols = 2;
  @state() private _rowH = 82;
  @state() private _dragFrom?: number;
  @state() private _dropAt?: number;
  @state() private _dragDx = 0;
  @state() private _dragDy = 0;
  @state() private _resize?: { i: number; w: number; h: number };

  private _colW = 160;
  private _gap = 10;
  private _resizeOrigin?: { left: number; top: number; sizes: CellSize[] };
  private _els = new Map<string, CardEl>();
  private _ro?: ResizeObserver;
  private _unsub?: Promise<() => Promise<void>>;
  private _loading = false;
  private _pending = 0;
  private _dragStart?: { x: number; y: number };

  connectedCallback(): void {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => this._measure(entry.contentRect.width));
    this._ro.observe(this);
    window.addEventListener("keydown", this._onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    window.removeEventListener("keydown", this._onKey);
    this._unsub?.then((u) => u()).catch(() => undefined);
    this._unsub = undefined;
    this._loading = false;
    this._endDrag();
  }

  protected firstUpdated(): void {
    // Block page scroll while a card is being dragged (incl. right after a long press).
    this.renderRoot.querySelector(".grid")?.addEventListener(
      "touchmove",
      (ev) => {
        if (this._dragFrom != null && ev.cancelable) ev.preventDefault();
      },
      { passive: false },
    );
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
      if (!this._layout && !this._loading) this._load();
      for (const el of this._els.values()) el.hass = this.hass;
    }
  }

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet")) this._edit = false;
  };

  // ---- Data ---------------------------------------------------------------

  private async _load() {
    if (!this.hass) return;
    this._loading = true;
    try {
      this._layout = await this.hass.callWS<TerralLayout>({ type: "terral_home/layout/get" });
      this._error = undefined;
      this._unsub = this.hass.connection.subscribeMessage<TerralLayout>(
        (layout) => {
          if (!this._pending && this._dragFrom == null) this._layout = layout;
        },
        { type: "terral_home/layout/subscribe" },
      );
    } catch (err) {
      this._error = (err as { message?: string })?.message ?? String(err);
      this._loading = false;
    }
  }

  private async _save(cards: TerralCard[]) {
    if (!this.hass) return;
    this._layout = { ...(this._layout ?? {}), cards };
    this._pending++;
    try {
      await this.hass.callWS({ type: "terral_home/layout/save", layout: this._layout });
      this._error = undefined;
    } catch (err) {
      this._error = (err as { message?: string })?.message ?? String(err);
    } finally {
      this._pending--;
    }
  }

  private get _cards(): TerralCard[] {
    return this._layout?.cards ?? [];
  }

  // ---- Layout -------------------------------------------------------------

  private _measure(width: number) {
    const pad = width < 600 ? 16 : 24;
    const gap = width < 600 ? 10 : 14;
    const inner = Math.min(width, 1180) - 2 * pad;
    const cols = width < 600 ? 2 : 4;
    const colW = (inner - gap * (cols - 1)) / cols;
    // ROW_RATIO < 1 makes cards shorter than square (2 rows = colW × ratio).
    const ratio = (window as unknown as { __terralRowRatio?: number }).__terralRowRatio ?? ROW_RATIO;
    const rowH = Math.max(48, Math.round(((colW - gap) / 2) * ratio));
    this._colW = colW;
    this._gap = gap;
    if (cols !== this._cols) this._cols = cols;
    if (rowH !== this._rowH) this._rowH = rowH;
  }

  private _sizeOf(c: TerralCard): CellSize {
    const h = c.h === 1 || c.h === 4 ? c.h : 2;
    const w = h === 4 ? 2 : c.w === 2 ? 2 : 1;
    return { w: Math.min(w, this._cols), h };
  }

  private _element(c: TerralCard): CardEl {
    let el = this._els.get(c.id);
    if (!el) {
      el = document.createElement("terral-home-light") as unknown as CardEl;
      this._els.set(c.id, el);
    }
    const { id: _id, type: _type, w, h, ...rest } = c;
    const config = { ...rest, type: "custom:terral-home-light", view_layout: { terral: { w, h } } };
    const key = JSON.stringify(config);
    if (el.dataset.cfg !== key) {
      try {
        el.setConfig(config);
      } catch (err) {
        console.warn("Terral Home:", err);
      }
      el.dataset.cfg = key;
    }
    if (this.hass && el.hass !== this.hass) el.hass = this.hass;
    return el;
  }

  // ---- Actions ------------------------------------------------------------

  private _add = () => {
    if (!this.hass || !this._layout) return;
    openAddSheet(this.hass, new Set(this._cards.map((c) => c.entity)), (entity) => {
      const e = this.hass?.states[entity];
      const card: TerralCard = { id: uid(), type: "light", entity, w: e && isGroup(e) ? 2 : 1, h: 2 };
      this._save([...this._cards, card]);
    });
  };

  private _menu = () => {
    if (!this.hass) return;
    openMenuSheet(this.hass, this.panel?.config?.version ?? VERSION, () => (this._edit = true));
  };

  private _remove(i: number) {
    const cards = [...this._cards];
    const [gone] = cards.splice(i, 1);
    if (gone) this._els.delete(gone.id);
    this._save(cards);
  }

  // ---- Resize from the bottom-right corner --------------------------------

  private _resizeDown(ev: PointerEvent, i: number) {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget as HTMLElement;
    const r = (handle.closest(".cell") as HTMLElement).getBoundingClientRect();
    const c = this._cards[i];
    const sizes = (this._els.get(c.id)?.getTerralSizes?.() ?? ALL_SIZES).filter((s) => s.w <= this._cols);
    this._resizeOrigin = { left: r.left, top: r.top, sizes };
    const cur = this._sizeOf(c);
    this._resize = { i, w: cur.w, h: cur.h };
    handle.setPointerCapture(ev.pointerId);
  }

  private _resizeMove(ev: PointerEvent) {
    const o = this._resizeOrigin;
    if (!this._resize || !o) return;
    // Continuous size in cells under the finger, snapped to the closest allowed size.
    const cw = (ev.clientX - o.left + this._gap) / (this._colW + this._gap);
    const ch = (ev.clientY - o.top + this._gap) / (this._rowH + this._gap);
    let best = o.sizes[0];
    let bestD = Infinity;
    for (const s of o.sizes) {
      const d = (s.w - cw) ** 2 + (s.h - ch) ** 2;
      if (d < bestD) [best, bestD] = [s, d];
    }
    if (best.w !== this._resize.w || best.h !== this._resize.h) {
      this._resize = { ...this._resize, w: best.w, h: best.h };
      navigator.vibrate?.(6);
    }
  }

  private _resizeUp() {
    const r = this._resize;
    this._resize = undefined;
    this._resizeOrigin = undefined;
    if (!r) return;
    const c = this._cards[r.i];
    const cur = this._sizeOf(c);
    if (cur.w === r.w && cur.h === r.h) return;
    const cards = [...this._cards];
    cards[r.i] = { ...c, w: r.w as 1 | 2, h: r.h as 1 | 2 | 4 };
    this._save(cards);
  }

  private _span(n: number, unit: number) {
    return n * unit + (n - 1) * this._gap;
  }

  // ---- Long press & drag --------------------------------------------------

  private _onHold = (ev: Event) => {
    const detail = (ev as CustomEvent<{ x: number; y: number }>).detail;
    const cell = ev.composedPath().find((n) => n instanceof HTMLElement && n.dataset.i != null) as HTMLElement | undefined;
    if (!cell) return;
    ev.preventDefault();
    this._edit = true;
    navigator.vibrate?.(12);
    this._startDrag(Number(cell.dataset.i), detail.x, detail.y);
  };

  private _overlayDown(ev: PointerEvent, i: number) {
    if ((ev.target as HTMLElement).closest("button")) return;
    ev.preventDefault();
    this._startDrag(i, ev.clientX, ev.clientY);
  }

  private _startDrag(i: number, x: number, y: number) {
    this._dragFrom = i;
    this._dropAt = i;
    this._dragStart = { x, y };
    this._dragDx = this._dragDy = 0;
    window.addEventListener("pointermove", this._dragMove);
    window.addEventListener("pointerup", this._dragUp);
    window.addEventListener("pointercancel", this._dragUp);
  }

  private _dragMove = (ev: PointerEvent) => {
    if (this._dragFrom == null || !this._dragStart) return;
    this._dragDx = ev.clientX - this._dragStart.x;
    this._dragDy = ev.clientY - this._dragStart.y;
    const hit = this.shadowRoot
      ?.elementsFromPoint(ev.clientX, ev.clientY)
      .find((el) => el instanceof HTMLElement && el.dataset.i != null && el.dataset.i !== String(this._dragFrom)) as
      | HTMLElement
      | undefined;
    if (hit) this._dropAt = Number(hit.dataset.i);
    this._autoScroll(ev.clientY);
  };

  private _dragUp = () => {
    const from = this._dragFrom;
    const to = this._dropAt;
    const moved = Math.hypot(this._dragDx, this._dragDy) > 8;
    this._endDrag();
    if (from != null && to != null && from !== to && moved) {
      const cards = [...this._cards];
      const [c] = cards.splice(from, 1);
      cards.splice(to, 0, c);
      this._save(cards);
    }
  };

  private _endDrag() {
    window.removeEventListener("pointermove", this._dragMove);
    window.removeEventListener("pointerup", this._dragUp);
    window.removeEventListener("pointercancel", this._dragUp);
    this._dragFrom = this._dropAt = undefined;
    this._dragStart = undefined;
    this._dragDx = this._dragDy = 0;
  }

  /** Scroll when dragging near the top or bottom edge. */
  private _autoScroll(y: number) {
    const sc = this.renderRoot.querySelector(".scroller") as HTMLElement | null;
    if (!sc || !this._dragStart) return;
    const r = sc.getBoundingClientRect();
    const step = y < r.top + 70 ? -12 : y > r.bottom - 70 ? 12 : 0;
    if (!step) return;
    const before = sc.scrollTop;
    sc.scrollTop += step;
    const d = sc.scrollTop - before;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - d };
    this._dragDy += d;
  }

  // ---- Render -------------------------------------------------------------

  render() {
    const cards = this._cards;
    const edit = this._edit;
    const loaded = !!this._layout;
    return html`
      <div class="scroller" style="background:${backgroundCss("crepusculo")}" @terral-card-hold=${this._onHold}>
        <div class="wrap">
          <div class="top">
            <button class="glass round" aria-label=${t(this.hass, "menu")} @click=${() => fireEvent(this, "hass-toggle-menu")}>
              ${menuIcon()}
            </button>
            <span class="spacer"></span>
            ${edit
              ? html`<div class="glass pill">
                  <button class="pbtn" aria-label=${t(this.hass, "add_accessory")} @click=${this._add}>${plusIcon(22)}</button>
                  <button class="pbtn done" @click=${() => (this._edit = false)}>${t(this.hass, "done")}</button>
                </div>`
              : html`<div class="glass pill">
                  <button class="pbtn" aria-label=${t(this.hass, "add_accessory")} ?disabled=${!loaded} @click=${this._add}>${plusIcon(22)}</button>
                  <button class="pbtn" aria-label=${t(this.hass, "more_options")} @click=${this._menu}>${dotsIcon(22)}</button>
                </div>`}
          </div>
          <h1>${t(this.hass, "home_title")}</h1>
          ${this._error ? html`<p class="notice">${t(this.hass, "panel_error")} (${this._error})</p>` : nothing}
          <div
            class="grid ${edit ? "editing" : ""}"
            style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
          >
            ${repeat(cards, (c) => c.id, (c, i) => this._cell(c, i, edit))}
            ${loaded && (edit || !cards.length)
              ? html`<button class="add" style="grid-row:span 2" @click=${this._add}>
                  <span class="addic">${plusIcon(26)}</span><span>${t(this.hass, "add_accessory")}</span>
                </button>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private _cell(c: TerralCard, i: number, edit: boolean) {
    const { w, h } = this._sizeOf(c);
    const dragging = this._dragFrom === i;
    const target = this._dropAt === i && this._dragFrom != null && !dragging;
    const style = `grid-column:span ${w};grid-row:span ${h};--d:${(i % 5) * -0.07}s;${
      dragging ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""
    }`;
    return html`<div class="cell ${dragging ? "dragging" : ""} ${target ? "target" : ""}" data-i=${i} style=${style}>
      ${this._element(c)}
      ${edit
        ? html`<div class="overlay" @pointerdown=${(ev: PointerEvent) => this._overlayDown(ev, i)}>
            <button class="del" aria-label=${t(this.hass, "delete")} @click=${() => this._remove(i)}>${minusIcon()}</button>
            <button
              class="corner"
              aria-label=${t(this.hass, "resize")}
              @pointerdown=${(ev: PointerEvent) => this._resizeDown(ev, i)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>
          </div>`
        : nothing}
      ${this._resize?.i === i
        ? html`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>`
        : nothing}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      color: #fff;
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
      opacity: 0.5;
      cursor: default;
    }
    svg {
      display: block;
    }
    /* HA already pads the app for the notch and home bar; fill what's left. */
    .scroller {
      height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      overflow-y: auto;
      overscroll-behavior-y: contain;
      -webkit-overflow-scrolling: touch;
      background-size: cover;
    }
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 12px 16px 48px;
      box-sizing: border-box;
    }
    @media (min-width: 600px) {
      .wrap {
        padding-left: 24px;
        padding-right: 24px;
      }
    }
    .glass {
      background: rgba(255, 255, 255, 0.13);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      box-sizing: border-box;
    }
    .top {
      display: flex;
      align-items: center;
      height: 48px;
    }
    .spacer {
      flex: 1;
    }
    .round {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pill {
      height: 46px;
      border-radius: 23px;
      display: flex;
      align-items: center;
      padding: 0 4px;
    }
    .pbtn {
      height: 40px;
      min-width: 48px;
      padding: 0 10px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .pbtn:active:not(:disabled) {
      background: rgba(255, 255, 255, 0.14);
    }
    .done {
      font-size: 15px;
      font-weight: 600;
      padding: 0 14px;
    }
    h1 {
      margin: 12px 0 18px;
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
      gap: 10px;
      grid-auto-flow: row dense;
    }
    @media (min-width: 600px) {
      .grid {
        gap: 14px;
      }
    }
    .cell {
      position: relative;
      min-width: 0;
      min-height: 0;
      transition: translate 0s;
    }
    .cell > :first-child {
      display: block;
      height: 100%;
    }
    .editing .cell {
      animation: jiggle 0.26s ease-in-out infinite alternate;
      animation-delay: var(--d, 0s);
    }
    .editing .cell > :first-child {
      pointer-events: none;
    }
    .cell.dragging {
      animation: none;
      scale: 1.04;
      opacity: 0.92;
      filter: drop-shadow(0 16px 30px rgba(0, 0, 0, 0.35));
    }
    .cell.target::after {
      content: "";
      position: absolute;
      inset: -4px;
      border: 2px dashed rgba(255, 255, 255, 0.85);
      border-radius: 26px;
      pointer-events: none;
    }
    @keyframes jiggle {
      from {
        rotate: -0.7deg;
      }
      to {
        rotate: 0.7deg;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .editing .cell {
        animation: none;
      }
    }
    .overlay {
      position: absolute;
      inset: 0;
      border-radius: 22px;
      touch-action: none;
      cursor: grab;
    }
    .del {
      position: absolute;
      left: -7px;
      top: -7px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(60, 62, 80, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    /* Corner grip: an arc hugging the card's bottom-right corner. */
    .corner {
      position: absolute;
      right: -6px;
      bottom: -6px;
      width: 46px;
      height: 46px;
      touch-action: none;
      cursor: nwse-resize;
      z-index: 2;
    }
    .corner span {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 26px;
      height: 26px;
      box-sizing: border-box;
      border-right: 5px solid #fff;
      border-bottom: 5px solid #fff;
      border-bottom-right-radius: 22px;
      filter: drop-shadow(0 0 1px rgba(20, 22, 44, 0.9)) drop-shadow(0 0 1px rgba(20, 22, 44, 0.9))
        drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
    }
    .ghost {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 6;
      border-radius: 22px;
      border: 2px dashed rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.12);
      pointer-events: none;
      transition: width 0.12s ease, height 0.12s ease;
    }
    .add {
      border-radius: 22px;
      background: rgba(20, 20, 45, 0.45);
      -webkit-backdrop-filter: blur(24px);
      backdrop-filter: blur(24px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 14px;
      box-sizing: border-box;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
    }
    .addic {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-panel": TerralHomePanel;
  }
}
