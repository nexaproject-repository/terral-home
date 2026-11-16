// Terral Home panel: full-screen page in HA's sidebar (no HA toolbar).
// The integration stores the layout (cards, sizes, order, sections); this
// element shows it on a 2-column (phone) or 4-column (tablet and wider) grid.
//
// - Starts empty, with an "Añadir accesorio" tile.
// - "+" adds a card; "···" opens the Terral menu.
// - Cards without a section go first; each section has a title and its cards.
// - Long press on a card enters move mode (cards jiggle): drag cards (also
//   between sections), "−" removes, the corner grip resizes; sections show
//   "−", a tappable title to rename and three lines to move the whole block.
//   "Listo" exits.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { fireEvent, type HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { areaOf, isGroup } from "../light/light-model";
import { dotsIcon, linesIcon, menuIcon, minusIcon, plusIcon } from "../shared/icons";
import { backgroundCss } from "../shared/backgrounds";
import { openAddSheet } from "./terral-add-sheet";
import { newDraft, openCardConfig, updateCardConfig } from "./terral-card-config";
import { openConfirmSheet } from "./terral-confirm-sheet";
import { openMenuSheet } from "./terral-menu-sheet";
import { VERSION } from "../version";

export interface TerralCard {
  id: string;
  type: "light" | "alarm" | "charger" | "climate";
  entity: string;
  w: 1 | 2;
  h: 1 | 2 | 4;
  [key: string]: unknown;
}

export interface TerralSection {
  id: string;
  title: string;
  cards: TerralCard[];
  [key: string]: unknown;
}

export interface TerralLayout {
  /** Cards without a section, shown first. */
  cards: TerralCard[];
  sections?: TerralSection[];
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

/** "top" = cards without a section; otherwise a section id. */
type ListKey = string;
const TOP: ListKey = "top";

const ALL_SIZES: CellSize[] = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 },
];

const ROW_RATIO = 0.85;

const CARD_TAGS: Record<string, string> = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate",
};

/** Settings a card may store in the layout through "terral-card-config". */
const CONFIG_KEYS = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing"];

// The Companion app paints the notch and home-bar areas with ONE solid colour
// (the theme's primary background). We give it EDGE and fade the panel's
// background into that same colour at the top and bottom, so the bars and
// the page join without a seam.
const EDGE = "#3a4f80";
const EDGE_RGB = "58,79,128";
const EDGE_FADES =
  `linear-gradient(180deg, ${EDGE} 0, rgba(${EDGE_RGB},.6) 36px, rgba(${EDGE_RGB},0) 120px), ` +
  `linear-gradient(0deg, ${EDGE} 0, rgba(${EDGE_RGB},.6) 28px, rgba(${EDGE_RGB},0) 96px), `;
const CHROME_TOP = EDGE;
const CHROME_BOTTOM = EDGE;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

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
  @state() private _drag?: { kind: "card" | "section"; id: string };
  @state() private _dropCard?: { key: ListKey; targetId?: string };
  @state() private _dropSection?: number;
  @state() private _dragDx = 0;
  @state() private _dragDy = 0;
  @state() private _resize?: { id: string; w: number; h: number };
  @state() private _renaming?: string;

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
    this._paintChrome(true);
    window.addEventListener("keydown", this._onKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    window.removeEventListener("keydown", this._onKey);
    this._paintChrome(false);
    this._unsub?.then((u) => u()).catch(() => undefined);
    this._unsub = undefined;
    this._loading = false;
    this._endDrag();
  }

  protected firstUpdated(): void {
    // Block page scroll while something is being dragged (incl. right after a long press).
    this.renderRoot.querySelector(".scroller")?.addEventListener(
      "touchmove",
      (ev) => {
        if ((this._drag || this._resize) && ev.cancelable) ev.preventDefault();
      },
      { passive: false },
    );
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
      if (!this._layout && !this._loading) this._load();
      for (const el of this._els.values()) el.hass = this.hass;
      updateCardConfig(this.hass);
    }
    if (changed.has("_renaming") && this._renaming) {
      const input = this.renderRoot.querySelector<HTMLInputElement>("input.rename");
      input?.focus();
      input?.select();
    }
  }

  /**
   * HA leaves the notch and home-bar areas outside the panel and paints them
   * with the theme colour. While Terral is open, paint them with our
   * background instead (page background + the app's theme-color), and put
   * everything back when leaving.
   */
  private _chromeSaved?: { meta: string | null; props: [HTMLElement, string, string, string][] };

  /**
   * Only the properties we set are saved and put back, one by one. HA applies
   * its themes (and dark mode) as inline styles on these same elements, so
   * restoring whole style attributes would wipe a theme applied while Terral
   * was open — that left the sidebar half light, half dark.
   */
  private _paintChrome(on: boolean) {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const html = document.documentElement;
    const body = document.body;
    const set: [HTMLElement, string, string][] = [
      [html, "background", EDGE],
      [body, "background", EDGE],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [body, "--app-header-background-color", CHROME_TOP],
      [body, "--app-theme-color", CHROME_TOP],
      [body, "--primary-background-color", CHROME_BOTTOM],
    ];
    if (on) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: meta?.content ?? null,
        props: set.map(([el, prop]) => [el, prop, el.style.getPropertyValue(prop), el.style.getPropertyPriority(prop)]),
      };
      for (const [el, prop, value] of set) el.style.setProperty(prop, value);
      if (meta) meta.content = CHROME_TOP;
      this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [el, prop, value, prio] of this._chromeSaved.props) {
        if (value) el.style.setProperty(prop, value, prio);
        else el.style.removeProperty(prop);
      }
      if (meta && this._chromeSaved.meta != null) meta.content = this._chromeSaved.meta;
      this._chromeSaved = undefined;
      this._themeUpdate();
    }
  }

  /** Same message HA's frontend sends after applying a theme. */
  private _themeUpdate() {
    const ext = (this.hass as unknown as { auth?: { external?: { fireMessage?: (m: object) => void } } })?.auth?.external;
    try {
      ext?.fireMessage?.({ type: "theme-update" });
    } catch {
      /* not in the Companion app */
    }
  }

  private _onKey = (ev: KeyboardEvent) => {
    if (ev.key !== "Escape" || this._renaming) return;
    if (this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config")) this._edit = false;
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
          if (!this._pending && !this._drag && !this._resize) this._layout = layout;
        },
        { type: "terral_home/layout/subscribe" },
      );
    } catch (err) {
      this._error = (err as { message?: string })?.message ?? String(err);
      this._loading = false;
    }
  }

  private async _save(layout: TerralLayout) {
    if (!this.hass) return;
    this._layout = layout;
    this._pending++;
    try {
      await this.hass.callWS({ type: "terral_home/layout/save", layout });
      this._error = undefined;
    } catch (err) {
      this._error = (err as { message?: string })?.message ?? String(err);
    } finally {
      this._pending--;
    }
  }

  /** Apply a change to a copy of the layout and save it. */
  private _update(change: (l: TerralLayout & { sections: TerralSection[] }) => void) {
    const l = structuredClone(this._layout ?? { cards: [] }) as TerralLayout & { sections: TerralSection[] };
    l.cards ??= [];
    l.sections ??= [];
    change(l);
    this._save(l);
  }

  private get _top(): TerralCard[] {
    return this._layout?.cards ?? [];
  }

  private get _sections(): TerralSection[] {
    return this._layout?.sections ?? [];
  }

  private get _allCards(): TerralCard[] {
    return [...this._top, ...this._sections.flatMap((s) => s.cards)];
  }

  private static _list(l: TerralLayout & { sections: TerralSection[] }, key: ListKey): TerralCard[] | undefined {
    return key === TOP ? l.cards : l.sections.find((s) => s.id === key)?.cards;
  }

  private _findCard(id: string): { key: ListKey; card: TerralCard } | undefined {
    const top = this._top.find((c) => c.id === id);
    if (top) return { key: TOP, card: top };
    for (const s of this._sections) {
      const card = s.cards.find((c) => c.id === id);
      if (card) return { key: s.id, card };
    }
    return undefined;
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

  /** The corner grip only shows when the card has more than one size to offer. */
  private _canResize(c: TerralCard): boolean {
    const sizes = this._els.get(c.id)?.getTerralSizes?.() ?? ALL_SIZES;
    return sizes.filter((s) => s.w <= this._cols).length > 1;
  }

  private _element(c: TerralCard): CardEl {
    let el = this._els.get(c.id);
    if (!el) {
      el = document.createElement(CARD_TAGS[c.type] ?? "terral-home-light") as unknown as CardEl;
      this._els.set(c.id, el);
    }
    const { id: _id, type: _type, w, h, ...rest } = c;
    const config = { ...rest, type: `custom:${CARD_TAGS[c.type] ?? "terral-home-light"}`, view_layout: { terral: { w, h } } };
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

  // ---- Card actions -------------------------------------------------------

  private _add = () => {
    if (!this.hass || !this._layout) return;
    openAddSheet(this.hass, (type) => {
      openCardConfig(this.hass!, newDraft(type), {
        mode: "add",
        onBack: () => this._add(),
        onSave: (d) => {
          const card = { id: uid(), type: d.type, ...d.config, w: d.w, h: d.h } as TerralCard;
          this._update((l) => l.cards.push(card));
        },
      });
    });
  };

  private _menu = () => {
    if (!this.hass) return;
    openMenuSheet(this.hass, this.panel?.config?.version ?? VERSION, {
      onEdit: () => (this._edit = true),
      onRooms: () => this._confirmRooms(),
    });
  };

  private _remove(id: string) {
    this._els.delete(id);
    this._update((l) => {
      l.cards = l.cards.filter((c) => c.id !== id);
      for (const s of l.sections) s.cards = s.cards.filter((c) => c.id !== id);
    });
  }

  // ---- Section actions ----------------------------------------------------

  private _addSection = () => {
    const id = uid();
    this._update((l) => l.sections.push({ id, title: t(this.hass, "new_section"), cards: [] }));
    this._renaming = id;
  };

  private _commitRename(id: string, value: string) {
    if (this._renaming !== id) return;
    this._renaming = undefined;
    const title = value.trim();
    const cur = this._sections.find((s) => s.id === id);
    if (!cur || !title || title === cur.title) return;
    this._update((l) => {
      const s = l.sections.find((x) => x.id === id);
      if (s) s.title = title;
    });
  }

  private _removeSection(id: string) {
    const idx = this._sections.findIndex((s) => s.id === id);
    const sec = this._sections[idx];
    if (!sec || !this.hass) return;
    const drop = (keepCards: boolean) =>
      this._update((l) => {
        const i = l.sections.findIndex((s) => s.id === id);
        if (i < 0) return;
        const [gone] = l.sections.splice(i, 1);
        if (keepCards) (i > 0 ? l.sections[i - 1].cards : l.cards).push(...gone.cards);
        else gone.cards.forEach((c) => this._els.delete(c.id));
      });
    if (!sec.cards.length) return drop(false);
    openConfirmSheet(this.hass, {
      heading: t(this.hass, "delete_section_q", { name: sec.title }),
      message: t(this.hass, "delete_section_msg", { n: sec.cards.length }),
      actions: [
        { label: t(this.hass, "keep_cards"), sub: t(this.hass, idx > 0 ? "keep_cards_sub" : "keep_cards_sub_top"), run: () => drop(true) },
        { label: t(this.hass, "remove_cards"), danger: true, run: () => drop(false) },
      ],
    });
  }

  /** One section per HA area; each card with an area moves into it. */
  private _confirmRooms() {
    if (!this.hass) return;
    openConfirmSheet(this.hass, {
      heading: t(this.hass, "by_rooms"),
      message: t(this.hass, "by_rooms_msg"),
      actions: [{ label: t(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }],
    });
  }

  private _sectionsFromRooms() {
    const hass = this.hass;
    if (!hass) return;
    this._update((l) => {
      const byTitle = new Map(l.sections.map((s) => [s.title.toLowerCase(), s]));
      const lists: TerralCard[][] = [l.cards, ...l.sections.map((s) => s.cards)];
      const moves: [TerralCard, string][] = [];
      for (const list of lists) {
        for (const c of [...list]) {
          const area = areaOf(hass, c.entity);
          if (!area) continue;
          moves.push([c, area]);
          list.splice(list.indexOf(c), 1);
        }
      }
      const fresh = [...new Set(moves.map(([, a]) => a))]
        .filter((a) => !byTitle.has(a.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
      for (const area of fresh) {
        const s: TerralSection = { id: uid(), title: area, cards: [] };
        l.sections.push(s);
        byTitle.set(area.toLowerCase(), s);
      }
      for (const [c, area] of moves) byTitle.get(area.toLowerCase())!.cards.push(c);
    });
    this._edit = true;
  }

  // ---- Resize from the bottom-right corner --------------------------------

  private _resizeDown(ev: PointerEvent, c: TerralCard) {
    ev.preventDefault();
    ev.stopPropagation();
    const handle = ev.currentTarget as HTMLElement;
    const r = (handle.closest(".cell") as HTMLElement).getBoundingClientRect();
    const sizes = (this._els.get(c.id)?.getTerralSizes?.() ?? ALL_SIZES).filter((s) => s.w <= this._cols);
    this._resizeOrigin = { left: r.left, top: r.top, sizes };
    const cur = this._sizeOf(c);
    this._resize = { id: c.id, w: cur.w, h: cur.h };
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
    const found = this._findCard(r.id);
    if (!found) return;
    const cur = this._sizeOf(found.card);
    if (cur.w === r.w && cur.h === r.h) return;
    this._update((l) => {
      const c = TerralHomePanel._list(l, found.key)?.find((x) => x.id === r.id);
      if (c) Object.assign(c, { w: r.w, h: r.h });
    });
  }

  private _span(n: number, unit: number) {
    return n * unit + (n - 1) * this._gap;
  }

  // ---- Long press & drag --------------------------------------------------

  /** A card changed its own settings (e.g. the charger's lock entity): store them. */
  private _onCardConfig = (ev: Event) => {
    const el = ev.target as HTMLElement;
    const id = [...this._els].find(([, v]) => v === el)?.[0];
    if (!id) return;
    ev.preventDefault();
    const { config: cfg, size } = (ev as CustomEvent<{ config: Record<string, unknown>; size?: { w: number; h: number } }>).detail;
    this._update((l) => {
      for (const list of [l.cards, ...l.sections.map((s) => s.cards)]) {
        const c = list.find((x) => x.id === id);
        if (!c) continue;
        for (const k of CONFIG_KEYS) {
          if (cfg[k] === undefined || cfg[k] === "") delete c[k];
          else c[k] = cfg[k];
        }
        if (size) {
          c.w = size.w as 1 | 2;
          c.h = size.h as 1 | 2 | 4;
        }
      }
    });
  };

  private _onCardRemove = (ev: Event) => {
    const id = [...this._els].find(([, v]) => v === ev.target)?.[0];
    if (id) this._remove(id);
  };

  private _onHold = (ev: Event) => {
    const detail = (ev as CustomEvent<{ x: number; y: number }>).detail;
    const cell = ev.composedPath().find((n) => n instanceof HTMLElement && n.dataset.cid != null) as HTMLElement | undefined;
    if (!cell) return;
    ev.preventDefault();
    this._edit = true;
    navigator.vibrate?.(12);
    this._startDrag("card", cell.dataset.cid!, detail.x, detail.y);
  };

  private _overlayDown(ev: PointerEvent, id: string) {
    if ((ev.target as HTMLElement).closest("button")) return;
    ev.preventDefault();
    this._startDrag("card", id, ev.clientX, ev.clientY);
  }

  private _handleDown(ev: PointerEvent, id: string) {
    ev.preventDefault();
    this._renaming = undefined;
    this._startDrag("section", id, ev.clientX, ev.clientY);
  }

  private _startDrag(kind: "card" | "section", id: string, x: number, y: number) {
    this._drag = { kind, id };
    this._dropCard = undefined;
    this._dropSection = undefined;
    this._dragStart = { x, y };
    this._dragDx = this._dragDy = 0;
    window.addEventListener("pointermove", this._dragMove);
    window.addEventListener("pointerup", this._dragUp);
    window.addEventListener("pointercancel", this._dragUp);
  }

  private _dragMove = (ev: PointerEvent) => {
    if (!this._drag || !this._dragStart) return;
    this._dragDx = ev.clientX - this._dragStart.x;
    this._dragDy = ev.clientY - this._dragStart.y;
    if (this._drag.kind === "card") this._hitCard(ev.clientX, ev.clientY);
    else this._hitSection(ev.clientY);
    this._autoScroll(ev.clientY);
  };

  private _hitCard(x: number, y: number) {
    const els = (this.shadowRoot?.elementsFromPoint(x, y) ?? []) as HTMLElement[];
    const cell = els.find((el) => el.dataset?.cid != null && el.dataset.cid !== this._drag?.id);
    if (cell) {
      this._dropCard = { key: cell.dataset.key!, targetId: cell.dataset.cid };
      return;
    }
    const zone = els.find((el) => el.dataset?.zone != null);
    if (zone) this._dropCard = { key: zone.dataset.zone! };
  }

  private _hitSection(y: number) {
    const boxes = [...this.renderRoot.querySelectorAll<HTMLElement>("section[data-sid]")].filter(
      (el) => el.dataset.sid !== this._drag?.id,
    );
    this._dropSection = boxes.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 < y;
    }).length;
  }

  private _dragUp = () => {
    const drag = this._drag;
    const moved = Math.hypot(this._dragDx, this._dragDy) > 8;
    const dropCard = this._dropCard;
    const dropSection = this._dropSection;
    this._endDrag();
    if (!drag || !moved) return;
    if (drag.kind === "card" && dropCard) this._moveCard(drag.id, dropCard.key, dropCard.targetId);
    if (drag.kind === "section" && dropSection != null) this._moveSection(drag.id, dropSection);
  };

  private _moveCard(id: string, key: ListKey, targetId?: string) {
    const from = this._findCard(id);
    if (!from || targetId === id) return;
    this._update((l) => {
      const src = TerralHomePanel._list(l, from.key)!;
      const fromIdx = src.findIndex((c) => c.id === id);
      const origTarget = targetId ? src.findIndex((c) => c.id === targetId) : -1;
      const [card] = src.splice(fromIdx, 1);
      const dst = TerralHomePanel._list(l, key);
      if (!dst) {
        src.splice(fromIdx, 0, card);
        return;
      }
      if (!targetId) {
        dst.push(card);
        return;
      }
      const idx = dst.findIndex((c) => c.id === targetId);
      // Same list, moving forward: take the target's place (land after it).
      const after = from.key === key && origTarget > fromIdx;
      dst.splice(idx < 0 ? dst.length : idx + (after ? 1 : 0), 0, card);
    });
  }

  private _moveSection(id: string, index: number) {
    const cur = this._sections.findIndex((s) => s.id === id);
    if (cur < 0 || cur === index) return;
    this._update((l) => {
      const i = l.sections.findIndex((s) => s.id === id);
      const [s] = l.sections.splice(i, 1);
      l.sections.splice(Math.min(index, l.sections.length), 0, s);
    });
  }

  private _endDrag() {
    window.removeEventListener("pointermove", this._dragMove);
    window.removeEventListener("pointerup", this._dragUp);
    window.removeEventListener("pointercancel", this._dragUp);
    this._drag = undefined;
    this._dropCard = undefined;
    this._dropSection = undefined;
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
    const edit = this._edit;
    const loaded = !!this._layout;
    const top = this._top;
    const sections = this._sections;
    const empty = loaded && !this._allCards.length;
    const draggingCard = this._drag?.kind === "card";
    const draggingSection = this._drag?.kind === "section";
    const showTop = top.length > 0 || empty || (edit && (draggingCard || !sections.length));
    let shown = 0;
    return html`
      <div class="scroller" style="background:${EDGE_FADES}${backgroundCss("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${edit ? "editing" : ""}">
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
          ${showTop
            ? this._grid(TOP, top, edit, empty || (edit && !sections.length), top.length === 0 && edit ? t(this.hass, "no_section") : undefined)
            : nothing}
          ${repeat(
            sections,
            (s) => s.id,
            (s) => {
              const lifted = draggingSection && this._drag?.id === s.id;
              const lineBefore = draggingSection && !lifted && this._dropSection === shown;
              if (!lifted) shown++;
              if (!edit && !s.cards.length) return nothing;
              return html`${lineBefore ? html`<div class="dropline"></div>` : nothing}${this._section(s, edit, lifted)}`;
            },
          )}
          ${draggingSection && this._dropSection === shown ? html`<div class="dropline"></div>` : nothing}
          ${edit && loaded
            ? html`<button class="addsec" @click=${this._addSection}>${plusIcon(20)}<span>${t(this.hass, "add_section")}</span></button>`
            : nothing}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }

  private _section(s: TerralSection, edit: boolean, lifted: boolean) {
    const renaming = this._renaming === s.id;
    const style = lifted ? `translate:0 ${this._dragDy}px` : "";
    return html`<section class="sec ${lifted ? "lifted" : ""}" data-sid=${s.id} style=${style}>
      <header>
        ${edit ? html`<button class="sdel" aria-label=${t(this.hass, "delete_section")} @click=${() => this._removeSection(s.id)}>${minusIcon()}</button>` : nothing}
        ${renaming
          ? html`<input
              class="rename"
              .value=${s.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(ev: KeyboardEvent) => {
                if (ev.key === "Enter") this._commitRename(s.id, (ev.target as HTMLInputElement).value);
                if (ev.key === "Escape") this._renaming = undefined;
              }}
              @blur=${(ev: FocusEvent) => this._commitRename(s.id, (ev.target as HTMLInputElement).value)}
            />`
          : edit
            ? html`<button class="title" aria-label=${t(this.hass, "rename_section")} @click=${() => (this._renaming = s.id)}>${s.title}</button>`
            : html`<h2>${s.title}</h2>`}
        ${edit
          ? html`<button
              class="handle"
              aria-label=${t(this.hass, "move_section")}
              @pointerdown=${(ev: PointerEvent) => this._handleDown(ev, s.id)}
            >${linesIcon()}</button>`
          : nothing}
      </header>
      ${this._grid(s.id, s.cards, edit, false, edit && !s.cards.length ? t(this.hass, "drop_here") : undefined)}
    </section>`;
  }

  private _grid(key: ListKey, cards: TerralCard[], edit: boolean, addTile: boolean, placeholder?: string) {
    const zoneTarget = this._drag?.kind === "card" && this._dropCard?.key === key && !this._dropCard.targetId;
    return html`<div
      class="grid ${zoneTarget ? "zone-target" : ""} ${key === TOP ? "top-grid" : ""}"
      data-zone=${key}
      style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
    >
      ${repeat(cards, (c) => c.id, (c, i) => this._cell(key, c, i, edit))}
      ${placeholder && !cards.length ? html`<div class="placeholder" style="grid-column:1/-1">${placeholder}</div>` : nothing}
      ${addTile
        ? html`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${plusIcon(26)}</span><span>${t(this.hass, "add_accessory")}</span>
          </button>`
        : nothing}
    </div>`;
  }

  private _cell(key: ListKey, c: TerralCard, i: number, edit: boolean) {
    const { w, h } = this._sizeOf(c);
    const dragging = this._drag?.kind === "card" && this._drag.id === c.id;
    const target = this._drag?.kind === "card" && this._dropCard?.targetId === c.id;
    const style = `grid-column:span ${w};grid-row:span ${h};--d:${(i % 5) * -0.07}s;${
      dragging ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""
    }`;
    return html`<div class="cell ${dragging ? "dragging" : ""} ${target ? "target" : ""}" data-cid=${c.id} data-key=${key} style=${style}>
      ${this._element(c)}
      ${edit
        ? html`<div class="overlay" @pointerdown=${(ev: PointerEvent) => this._overlayDown(ev, c.id)}>
            <button class="del" aria-label=${t(this.hass, "delete")} @click=${() => this._remove(c.id)}>${minusIcon()}</button>
            ${this._canResize(c) ? html`<button
              class="corner"
              aria-label=${t(this.hass, "resize")}
              @pointerdown=${(ev: PointerEvent) => this._resizeDown(ev, c)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>` : nothing}
          </div>`
        : nothing}
      ${this._resize?.id === c.id
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
    /* Cards dissolve into the bottom edge as they scroll under it. */
    .fade {
      position: sticky;
      bottom: 0;
      height: 110px;
      margin-top: -110px;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(58, 79, 128, 0) 0, rgba(58, 79, 128, 0.55) 45%, rgba(58, 79, 128, 0.92) 80%, #3a4f80 100%);
    }
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 12px 16px 110px;
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
    section.sec {
      margin-top: 18px;
      position: relative;
      border-radius: 26px;
    }
    .editing section.sec {
      margin: 14px -8px 0;
      padding: 4px 8px 10px;
      outline: 2px dashed rgba(255, 255, 255, 0.28);
    }
    section.sec.lifted {
      z-index: 8;
      scale: 1.02;
      background: rgba(40, 44, 90, 0.55);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      outline: 2px solid rgba(255, 255, 255, 0.7);
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
    }
    section.sec.lifted .cell {
      animation: none;
    }
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      margin-bottom: 4px;
    }
    h2,
    .title {
      margin: 0;
      flex: 1;
      min-width: 0;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: -0.2px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .title {
      text-decoration: underline dotted rgba(255, 255, 255, 0.45);
      text-decoration-thickness: 2px;
      text-underline-offset: 6px;
    }
    input.rename {
      flex: 1;
      min-width: 0;
      height: 38px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.18);
      border: 2px solid rgba(255, 255, 255, 0.75);
      color: #fff;
      font: inherit;
      font-size: 19px;
      font-weight: 700;
      padding: 0 10px;
      outline: none;
      box-sizing: border-box;
    }
    .sdel {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(60, 62, 80, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .handle {
      width: 48px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 4px;
      box-sizing: border-box;
      touch-action: none;
      cursor: grab;
      flex: none;
    }
    .dropline {
      height: 5px;
      border-radius: 3px;
      background: #fff;
      margin: 12px 4px -6px;
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
    }
    .grid.zone-target {
      outline: 2px dashed rgba(255, 255, 255, 0.85);
      outline-offset: 4px;
      border-radius: 20px;
    }
    .placeholder {
      min-height: 64px;
      border-radius: 20px;
      border: 2px dashed rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
    .addsec {
      margin-top: 18px;
      width: 100%;
      height: 54px;
      border-radius: 20px;
      border: 2px dashed rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-home-panel": TerralHomePanel;
  }
}
