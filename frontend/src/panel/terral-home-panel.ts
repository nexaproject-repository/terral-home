// Terral Home panel: full-screen page in HA's sidebar (no HA toolbar).
// The integration stores the layout (cards, sizes, order, sections); this
// element shows it. Cards are the same size on every screen: columns are
// about a phone column wide, every block is 2 columns wide, and wider
// screens place more blocks side by side ("lanes", each block in the
// shortest lane) instead of stretching the cards.
//
// - Starts empty, with an "Añadir accesorio" tile.
// - "+" adds a card; "···" opens the Terral menu.
// - Cards without a section go first (a block without title); each section
//   is a block with a title and its cards.
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
import { bulbIcon, dotsIcon, gearIcon, linesIcon, menuIcon, minusIcon, plusIcon, thermoIcon } from "../shared/icons";
import { DEFAULT_QUICK, quickOf, quickState, runQuick } from "./quick-actions";
import { openSectionSheet } from "./terral-section-sheet";
import { type DashboardInfo, navigate, openDashboardSheet } from "./terral-dashboard-sheet";
import { openPageSheet, pageSlug } from "./terral-page-sheet";
import { backgroundCss } from "../shared/backgrounds";
import { openAddSheet } from "./terral-add-sheet";
import { newDraft, openCardConfig, updateCardConfig } from "./terral-card-config";
import { openConfirmSheet } from "./terral-confirm-sheet";
import { openMenuSheet } from "./terral-menu-sheet";
import { VERSION } from "../version";

export interface TerralCard {
  id: string;
  type: "light" | "alarm" | "charger" | "climate" | "weather" | "vacuum" | "switch";
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

/** An extra page of a dashboard (the first page is the layout itself). */
export interface TerralPage {
  id: string;
  title: string;
  cards: TerralCard[];
  sections?: TerralSection[];
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

/** Columns per section. Fixed at 2 for now; a Terral setting may offer 4 later. */
const SECTION_COLS = 2;
/** Column width range: about the width of a column on a phone. */
const COL_MIN = 160;
const COL_MAX = 184;
const GAP = 10;
/** Space between blocks placed side by side. */
const LANE_GAP = 22;

const CARD_TAGS: Record<string, string> = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate",
  weather: "terral-home-weather",
  vacuum: "terral-home-vacuum",
  switch: "terral-home-switch",
};

/** Settings a card may store in the layout through "terral-card-config". */
const CONFIG_KEYS = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing", "forecast_2x2", "animate", "show_details", "forecast_days", "routines", "icon", "color", "style"];

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
  /** Home Assistant's route: prefix = this panel's URL, path = "/<page id>" or "". */
  @property({ attribute: false }) route?: { prefix?: string; path?: string };
  @property({ attribute: false }) panel?: { config?: { version?: string; dashboard?: string; title?: string | null } };

  @state() private _layout?: TerralLayout;
  @state() private _error?: string;
  @state() private _edit = false;
  @state() private _cols = 2;
  @state() private _rowH = 82;
  @state() private _drag?: { kind: "card" | "section"; id: string };
  @state() private _dropCard?: { key: ListKey; targetId?: string; page?: string };
  @state() private _dropSection?: number;
  @state() private _dragDx = 0;
  @state() private _dragDy = 0;
  @state() private _resize?: { id: string; w: number; h: number };
  @state() private _renaming?: string;
  /** Blocks side by side (1 on phones) and the width of each. */
  @state() private _lanes = 1;
  @state() private _laneW = 358;
  @state() private _pad = 16;
  /** Where the dragged section would land: before / after a section, or at the end of an empty lane. */
  @state() private _dropMark?: { sid?: string; after?: boolean; lane?: number };

  /** Rows of the favourites strip being drawn (0 = no strip: phone, or switched off). */
  private _strip = 0;
  private _dashLoaded?: string;
  @state() private _titleOverride?: string;

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
    this._cancelPick();
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
    // Home Assistant may reuse this element for another Terral dashboard: start over.
    if (changed.has("panel") && this._dashLoaded && this._dashLoaded !== this._dash) {
      this._unsub?.then((u) => u()).catch(() => undefined);
      this._unsub = undefined;
      this._layout = undefined;
      this._loading = false;
      this._edit = false;
      this._els.clear();
    }
    if ((changed.has("hass") || changed.has("panel")) && this.hass) {
      if (!this._layout && !this._loading) this._load();
      for (const el of this._els.values()) el.hass = this.hass;
      updateCardConfig(this.hass);
    }
    const strip = this.renderRoot.querySelector<HTMLElement>(".grid.strip");
    strip?.classList.toggle("more", strip.scrollWidth - strip.scrollLeft - strip.clientWidth > 4);
    if (strip && !strip.dataset.watch) {
      strip.dataset.watch = "1";
      strip.addEventListener("scroll", () => strip.classList.toggle("more", strip.scrollWidth - strip.scrollLeft - strip.clientWidth > 4), { passive: true });
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
    if (this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config, terral-section-sheet, terral-dashboard-sheet, terral-page-sheet")) this._edit = false;
  };

  // ---- Data ---------------------------------------------------------------

  /** Big title: the dashboard's name, or "Mi casa" for the first dashboard until it is renamed. */
  private get _title(): string {
    return this._titleOverride ?? this.panel?.config?.title ?? t(this.hass, "home_title");
  }

  /** Favourites strip settings of this dashboard (on, 2 rows by default). */
  private get _favorites(): { enabled: boolean; rows: 1 | 2 } {
    const f = (this._layout?.favorites ?? {}) as { enabled?: boolean; rows?: number };
    return { enabled: f.enabled !== false, rows: f.rows === 1 ? 1 : 2 };
  }

  /** Which dashboard this panel shows ("home" is the first one). */
  private get _dash(): string {
    return this.panel?.config?.dashboard ?? "home";
  }

  private async _load() {
    if (!this.hass) return;
    this._loading = true;
    this._dashLoaded = this._dash;
    try {
      this._layout = await this.hass.callWS<TerralLayout>({ type: "terral_home/layout/get", dashboard: this._dash });
      this._error = undefined;
      this._unsub = this.hass.connection.subscribeMessage<TerralLayout>(
        (layout) => {
          if (!this._pending && !this._drag && !this._resize) this._layout = layout;
        },
        { type: "terral_home/layout/subscribe", dashboard: this._dash },
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
      await this.hass.callWS({ type: "terral_home/layout/save", dashboard: this._dash, layout });
      this._error = undefined;
    } catch (err) {
      this._error = (err as { message?: string })?.message ?? String(err);
    } finally {
      this._pending--;
    }
  }

  /** Apply a change to a copy of the page shown (cards and sections) and save the layout. */
  private _update(change: (l: TerralLayout & { sections: TerralSection[] }) => void) {
    const id = this._pageId;
    this._updateRoot((root) => {
      const pg = id ? (root.pages as TerralPage[]).find((x) => x.id === id) : root;
      if (!pg) return;
      pg.cards ??= [];
      pg.sections ??= [];
      change(pg as TerralLayout & { sections: TerralSection[] });
    });
  }

  /** Apply a change to a copy of the whole layout (pages, favourites…) and save it. */
  private _updateRoot(change: (l: TerralLayout & { sections: TerralSection[] }) => void) {
    const l = structuredClone(this._layout ?? { cards: [] }) as TerralLayout & { sections: TerralSection[] };
    l.cards ??= [];
    l.sections ??= [];
    change(l);
    this._save(l);
  }

  // ---- Pages: the first page is the layout itself, the rest are in layout.pages.

  private get _pages(): TerralPage[] {
    return (this._layout?.pages as TerralPage[] | undefined) ?? [];
  }

  /** Page shown: the first segment of the route, if it is one of the pages ("" = first page). */
  private get _pageId(): string {
    const seg = (this.route?.path ?? "").split("/").filter(Boolean)[0] ?? "";
    return this._pages.some((pg) => pg.id === seg) ? seg : "";
  }

  private get _page(): { cards?: TerralCard[]; sections?: TerralSection[] } {
    const id = this._pageId;
    return (id && this._pages.find((pg) => pg.id === id)) || this._layout || { cards: [] };
  }

  private get _homeTitle(): string {
    return (this._layout?.page_title as string | undefined) || t(this.hass, "page_home");
  }

  /** URL of this panel ("/terral-home", "/terral-home-cocina"…). */
  private get _prefix(): string {
    return this.route?.prefix || `/${location.pathname.split("/")[1] ?? "terral-home"}`;
  }

  private _goPage(id: string) {
    navigate(id ? `${this._prefix}/${id}` : this._prefix);
  }

  private get _top(): TerralCard[] {
    return this._page.cards ?? [];
  }

  private get _sections(): TerralSection[] {
    return this._page.sections ?? [];
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

  /**
   * Cards are the same size on phone, tablet and PC: a column is always about
   * as wide as on a phone (COL_MIN–COL_MAX px). Every block (the cards without
   * a section, and each section) is SECTION_COLS columns wide; wider screens
   * fit more blocks side by side ("lanes") instead of stretching the cards.
   */
  private _measure(width: number) {
    const pad = width < 600 ? 16 : 24;
    const gap = GAP;
    const avail = width - 2 * pad;
    const blockMin = SECTION_COLS * COL_MIN + (SECTION_COLS - 1) * gap;
    const lanes = Math.max(1, Math.floor((avail + LANE_GAP) / (blockMin + LANE_GAP)));
    const perLane = (avail - (lanes - 1) * LANE_GAP) / lanes;
    const colW = Math.min(COL_MAX, (perLane - (SECTION_COLS - 1) * gap) / SECTION_COLS);
    // ROW_RATIO < 1 makes cards shorter than square (2 rows = colW × ratio).
    const ratio = (window as unknown as { __terralRowRatio?: number }).__terralRowRatio ?? ROW_RATIO;
    const rowH = Math.max(48, Math.round(((colW - gap) / 2) * ratio));
    this._colW = colW;
    this._gap = gap;
    const laneW = Math.round(SECTION_COLS * colW + (SECTION_COLS - 1) * gap);
    if (SECTION_COLS !== this._cols) this._cols = SECTION_COLS;
    if (rowH !== this._rowH) this._rowH = rowH;
    if (lanes !== this._lanes) this._lanes = lanes;
    if (laneW !== this._laneW) this._laneW = laneW;
    if (pad !== this._pad) this._pad = pad;
  }

  /** Rows a list of cards takes in its 2-column grid (same "row dense" packing as CSS). */
  private _rowsOf(cards: TerralCard[]): number {
    const used: boolean[][] = [];
    const free = (r: number, c: number, w: number, h: number) => {
      for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) if (x >= this._cols || used[y]?.[x]) return false;
      return true;
    };
    let rows = 0;
    for (const card of cards) {
      const { w, h } = this._sizeOf(card);
      for (let r = 0; ; r++) {
        const c = [...Array(this._cols - w + 1).keys()].find((x) => free(r, x, w, h));
        if (c == null) continue;
        for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) (used[y] ??= [])[x] = true;
        rows = Math.max(rows, r + h);
        break;
      }
    }
    return rows;
  }

  /** Option A: each block goes to the shortest lane, in order, so there are no gaps. */
  private _assignLanes<T>(blocks: { item: T; rows: number; titled: boolean }[]): T[][] {
    const lanes = Array.from({ length: this._lanes }, () => ({ h: 0, items: [] as T[] }));
    for (const b of blocks) {
      const lane = lanes.reduce((a, l) => (l.h < a.h - 0.01 ? l : a));
      lane.items.push(b.item);
      lane.h += Math.max(1, b.rows) * (this._rowH + this._gap) + (b.titled ? 60 : 0);
    }
    return lanes.map((l) => l.items);
  }

  private _sizeOf(c: TerralCard, inStrip = false): CellSize {
    const h = c.h === 1 || c.h === 4 ? c.h : 2;
    const w = h === 4 ? 2 : c.w === 2 ? 2 : 1;
    if (inStrip && this._strip) {
      // Favourites strip: 1 row only fits 1/1 cards; 2 rows fit 1/1, 2/1 and 2/2.
      return this._strip === 1 ? { w: 1, h: 1 } : { w: Math.min(w, 2), h: Math.min(h, 2) };
    }
    return { w: Math.min(w, this._cols), h };
  }

  /** Cards without a section are in the favourites strip right now. */
  private _inStrip(key: ListKey) {
    return key === TOP && this._strip > 0;
  }

  /** The corner grip only shows when the card has more than one size to offer. */
  private _canResize(c: TerralCard, inStrip = false): boolean {
    if (inStrip && this._strip === 1) return false;
    const sizes = this._els.get(c.id)?.getTerralSizes?.() ?? ALL_SIZES;
    return sizes.filter((s) => s.w <= this._cols && (!inStrip || s.h <= this._strip)).length > 1;
  }

  private _element(c: TerralCard, size?: CellSize): CardEl {
    let el = this._els.get(c.id);
    if (!el) {
      el = document.createElement(CARD_TAGS[c.type] ?? "terral-home-light") as unknown as CardEl;
      this._els.set(c.id, el);
    }
    const { id: _id, type: _type, w: cw, h: ch, ...rest } = c;
    const { w, h } = size ?? { w: cw, h: ch };
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
    const admin = this.hass.user?.is_admin !== false;
    openMenuSheet(this.hass, this.panel?.config?.version ?? VERSION, {
      onEdit: () => (this._edit = true),
      onRooms: () => this._confirmRooms(),
      onDashboard: () => this._dashboardSettings(),
      onNewDashboard: admin ? () => this._newDashboard() : undefined,
    });
  };

  // ---- Pages ----------------------------------------------------------------

  /** Page pills under the title: shown with 2+ pages, or in move mode (to add one). */
  private _pills(edit: boolean) {
    const pages = this._pages;
    if (!this._layout || (!pages.length && !edit)) return nothing;
    const cur = this._pageId;
    const dropOn = this._drag?.kind === "card" ? this._dropCard?.page : undefined;
    const pill = (id: string, title: string) => {
      const on = id === cur;
      return html`<button
        class="pg ${on ? "on" : ""} ${dropOn === id && !on ? "drop" : ""}"
        data-page=${id}
        aria-current=${on ? "page" : "false"}
        @click=${() => (on ? edit && this._pageSettings() : this._goPage(id))}
      >${title}${on && edit ? html`<span class="pgear" aria-label=${t(this.hass, "page_settings")}>${gearIcon(15)}</span>` : nothing}</button>`;
    };
    return html`<nav class="pills" aria-label=${t(this.hass, "pages")}>
      ${pill("", this._homeTitle)}
      ${pages.map((pg) => pill(pg.id, pg.title))}
      ${edit ? html`<button class="pg add" @click=${() => this._addPage()}>${plusIcon(16)}${t(this.hass, "page_add")}</button>` : nothing}
    </nav>`;
  }

  private _addPage() {
    if (!this.hass) return;
    openPageSheet(this.hass, {
      mode: "create",
      title: "",
      first: false,
      homeTitle: this._homeTitle,
      onSave: (title) => {
        const id = pageSlug(title, this._pages.map((pg) => pg.id));
        this._updateRoot((l) => {
          l.pages = [...((l.pages as TerralPage[] | undefined) ?? []), { id, title, cards: [], sections: [] }];
        });
        this._goPage(id);
      },
    });
  }

  private _pageSettings() {
    if (!this.hass) return;
    const id = this._pageId;
    const pages = this._pages;
    const idx = pages.findIndex((pg) => pg.id === id);
    const pg = idx >= 0 ? pages[idx] : undefined;
    const count = (pg?.cards?.length ?? 0) + (pg?.sections ?? []).reduce((n, s) => n + s.cards.length, 0);
    openPageSheet(this.hass, {
      mode: "edit",
      title: pg ? pg.title : ((this._layout?.page_title as string | undefined) ?? ""),
      first: !pg,
      index: idx + 2,
      count: pages.length + 1,
      address: pg ? `${this._prefix}/${pg.id}` : this._prefix,
      cards: count,
      homeTitle: this._homeTitle,
      onSave: (title) =>
        this._updateRoot((l) => {
          if (!pg) {
            if (title) l.page_title = title;
            else delete l.page_title;
            return;
          }
          const target = (l.pages as TerralPage[]).find((x) => x.id === id);
          if (target && title) target.title = title;
        }),
      onMove: (dir) => {
        this._updateRoot((l) => {
          const list = l.pages as TerralPage[];
          const i = list.findIndex((x) => x.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= list.length) return;
          [list[i], list[j]] = [list[j], list[i]];
        });
        document.querySelector("terral-page-sheet")?.close();
      },
      onDelete: (keep) => {
        this._updateRoot((l) => {
          const list = l.pages as TerralPage[];
          const i = list.findIndex((x) => x.id === id);
          if (i < 0) return;
          const [gone] = list.splice(i, 1);
          if (keep) {
            l.cards.push(...(gone.cards ?? []));
            l.sections.push(...(gone.sections ?? []));
          } else {
            [...(gone.cards ?? []), ...(gone.sections ?? []).flatMap((s) => s.cards)].forEach((c) => this._els.delete(c.id));
          }
          if (!list.length) delete l.pages;
        });
        this._goPage("");
      },
    });
  }

  /** Move a card to the favourites of another page (dropped on its pill). */
  private _moveCardToPage(id: string, pageId: string) {
    const from = this._findCard(id);
    const cur = this._pageId;
    if (!from || pageId === cur) return;
    this._updateRoot((l) => {
      const pageOf = (pid: string) => (pid ? (l.pages as TerralPage[]).find((x) => x.id === pid) : l);
      const src = pageOf(cur);
      const dst = pageOf(pageId);
      if (!src || !dst) return;
      const list = from.key === TOP ? src.cards : (src.sections ?? []).find((s) => s.id === from.key)?.cards;
      const i = list?.findIndex((c) => c.id === id) ?? -1;
      if (!list || i < 0) return;
      const [card] = list.splice(i, 1);
      (dst.cards ??= []).push(card);
    });
  }

  // ---- Dashboards -----------------------------------------------------------

  private async _dashboardSettings() {
    const h = this.hass;
    if (!h) return;
    const list = await h.callWS<DashboardInfo[]>({ type: "terral_home/dashboards/list" }).catch(() => [] as DashboardInfo[]);
    const info: DashboardInfo = list.find((d) => d.id === this._dash) ?? { id: this._dash };
    openDashboardSheet(h, {
      mode: "edit",
      info,
      panelUrl: this._prefix.replace(/^\//, ""),
      favorites: this._favorites,
      admin: h.user?.is_admin !== false,
      onSave: async ({ title, icon, require_admin, favorites }) => {
        const f = this._favorites;
        if (favorites.enabled !== f.enabled || favorites.rows !== f.rows) {
          this._updateRoot((l) => {
            const next: Record<string, unknown> = {};
            if (!favorites.enabled) next.enabled = false;
            if (favorites.rows === 1) next.rows = 1;
            if (Object.keys(next).length) l.favorites = next;
            else delete l.favorites;
          });
        }
        if ((title ?? "") !== (info.title ?? "") || (icon ?? "") !== (info.icon ?? "") || !!require_admin !== !!info.require_admin) {
          await h.callWS({ type: "terral_home/dashboards/update", dashboard: this._dash, title: title || null, icon: icon || null, require_admin: !!require_admin });
          this._titleOverride = title || undefined;
        }
      },
      onDelete:
        this._dash === "home"
          ? undefined
          : async () => {
              await h.callWS({ type: "terral_home/dashboards/delete", dashboard: this._dash });
              navigate("/terral-home");
            },
    });
  }

  private _newDashboard() {
    const h = this.hass;
    if (!h) return;
    openDashboardSheet(h, {
      mode: "create",
      info: { id: "" },
      favorites: { enabled: true, rows: 2 },
      admin: true,
      onSave: async ({ title, icon }) => {
        const d = await h.callWS<DashboardInfo>({ type: "terral_home/dashboards/create", title, icon });
        // The new panel is in the sidebar now; open it.
        window.setTimeout(() => navigate(`/terral-home-${d.id}`), 300);
      },
    });
  }

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
    const inStrip = this._findCard(c.id)?.key === TOP && this._strip > 0;
    const sizes = (this._els.get(c.id)?.getTerralSizes?.() ?? ALL_SIZES).filter((s) => s.w <= this._cols && (!inStrip || s.h <= this._strip));
    this._resizeOrigin = { left: r.left, top: r.top, sizes };
    const cur = this._sizeOf(c, inStrip);
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
    const cur = this._sizeOf(found.card, this._inStrip(found.key));
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

  /**
   * In move mode the page must still scroll: with a finger, a card is only
   * picked up after resting on it for a moment; moving earlier scrolls.
   * The mouse picks it up straight away.
   */
  private _pickTimer?: number;
  private _pickStart?: { x: number; y: number };

  private _overlayDown(ev: PointerEvent, id: string) {
    if ((ev.target as HTMLElement).closest("button")) return;
    if (ev.pointerType === "mouse") {
      ev.preventDefault();
      this._startDrag("card", id, ev.clientX, ev.clientY);
      return;
    }
    this._cancelPick();
    this._pickStart = { x: ev.clientX, y: ev.clientY };
    const start = { x: ev.clientX, y: ev.clientY };
    window.addEventListener("pointermove", this._pickMove);
    window.addEventListener("pointerup", this._cancelPick);
    window.addEventListener("pointercancel", this._cancelPick);
    this._pickTimer = window.setTimeout(() => {
      this._cancelPick();
      navigator.vibrate?.(10);
      this._startDrag("card", id, start.x, start.y);
    }, 280);
  }

  private _pickMove = (ev: PointerEvent) => {
    if (this._pickStart && Math.hypot(ev.clientX - this._pickStart.x, ev.clientY - this._pickStart.y) > 8) this._cancelPick();
  };

  private _cancelPick = () => {
    clearTimeout(this._pickTimer);
    this._pickTimer = undefined;
    this._pickStart = undefined;
    window.removeEventListener("pointermove", this._pickMove);
    window.removeEventListener("pointerup", this._cancelPick);
    window.removeEventListener("pointercancel", this._cancelPick);
  };

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
    else this._hitSection(ev.clientX, ev.clientY);
    this._autoScroll(ev.clientY);
  };

  private _hitCard(x: number, y: number) {
    const els = (this.shadowRoot?.elementsFromPoint(x, y) ?? []) as HTMLElement[];
    const pill = els.find((el) => el.dataset?.page != null);
    if (pill) {
      this._dropCard = { key: TOP, page: pill.dataset.page };
      return;
    }
    const cell = els.find((el) => el.dataset?.cid != null && el.dataset.cid !== this._drag?.id);
    if (cell) {
      this._dropCard = { key: cell.dataset.key!, targetId: cell.dataset.cid };
      return;
    }
    const zone = els.find((el) => el.dataset?.zone != null);
    if (zone) this._dropCard = { key: zone.dataset.zone! };
  }

  /** Section drop target: the lane under the finger, then before the first section whose middle is below it. */
  private _hitSection(x: number, y: number) {
    const dragId = this._drag?.id;
    const order = this._sections.filter((s) => s.id !== dragId).map((s) => s.id);
    const lanes = [...this.renderRoot.querySelectorAll<HTMLElement>(".lane")];
    if (!lanes.length) return;
    const centre = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return Math.abs(x - (r.left + r.width / 2));
    };
    const lane = lanes.reduce((a, b) => (centre(b) < centre(a) ? b : a));
    const inLane = [...lane.querySelectorAll<HTMLElement>("section[data-sid]")].filter((el) => el.dataset.sid !== dragId);
    const before = inLane.find((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 > y;
    });
    if (before) {
      this._dropSection = order.indexOf(before.dataset.sid!);
      this._dropMark = { sid: before.dataset.sid };
    } else if (inLane.length) {
      const last = inLane[inLane.length - 1].dataset.sid!;
      this._dropSection = order.indexOf(last) + 1;
      this._dropMark = { sid: last, after: true };
    } else {
      this._dropSection = order.length;
      this._dropMark = { lane: lanes.indexOf(lane) };
    }
  }

  private _dragUp = () => {
    const drag = this._drag;
    const moved = Math.hypot(this._dragDx, this._dragDy) > 8;
    const dropCard = this._dropCard;
    const dropSection = this._dropSection;
    this._endDrag();
    if (!drag || !moved) return;
    if (drag.kind === "card" && dropCard?.page != null) this._moveCardToPage(drag.id, dropCard.page);
    else if (drag.kind === "card" && dropCard) this._moveCard(drag.id, dropCard.key, dropCard.targetId);
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
    this._dropMark = undefined;
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
    // Favourites strip: on tablets and computers the cards without a section run
    // across every column, 1 row (1/1 cards) or 2 rows (1/1, 2/1, 2/2) high.
    const fav = this._favorites;
    const strip = fav.enabled && this._lanes > 1 && !empty && (top.length > 0 || (edit && sections.length > 0));
    this._strip = strip ? fav.rows : 0;
    // Blocks: the cards without a section first, then each section; spread over the lanes.
    type Block = { kind: "top" } | { kind: "sec"; s: TerralSection };
    const blocks: { item: Block; rows: number; titled: boolean }[] = [];
    if (showTop && !strip) blocks.push({ item: { kind: "top" }, rows: Math.max(this._rowsOf(top), empty || (edit && !sections.length) ? 2 : 1), titled: false });
    for (const s of sections) if (edit || s.cards.length) blocks.push({ item: { kind: "sec", s }, rows: this._rowsOf(s.cards), titled: true });
    const lanes = this._assignLanes(blocks);
    const mark = this._dropMark;
    const line = html`<div class="dropline"></div>`;
    const contentW = this._lanes * this._laneW + (this._lanes - 1) * LANE_GAP;
    return html`
      <div class="scroller" style="background:${EDGE_FADES}${backgroundCss("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${edit ? "editing" : ""}" style="max-width:${contentW + 2 * this._pad}px">
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
          <h1>${this._title}</h1>
          ${this._pills(edit)}
          ${this._error ? html`<p class="notice">${t(this.hass, "panel_error")} (${this._error})</p>` : nothing}
          ${strip
            ? html`<div class="favs">${this._grid(TOP, top, edit, false, top.length === 0 && edit ? t(this.hass, "fav_drop") : undefined)}</div>`
            : nothing}
          <div class="lanes" style="--lane-gap:${LANE_GAP}px">
            ${lanes.map(
              (items, li) => html`<div class="lane" style="width:${this._laneW}px">
                ${repeat(
                  items,
                  (b) => (b.kind === "top" ? TOP : b.s.id),
                  (b) => {
                    if (b.kind === "top") {
                      return html`<div class="topblock">${this._grid(TOP, top, edit, empty || (edit && !sections.length), top.length === 0 && edit ? t(this.hass, "no_section") : undefined)}</div>`;
                    }
                    const s = b.s;
                    const lifted = draggingSection && this._drag?.id === s.id;
                    const here = draggingSection && !lifted && mark?.sid === s.id;
                    return html`${here && !mark?.after ? line : nothing}${this._section(s, edit, lifted)}${here && mark?.after ? line : nothing}`;
                  },
                )}
                ${draggingSection && mark?.lane === li ? line : nothing}
              </div>`,
            )}
          </div>
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
    const style = lifted ? `translate:${this._dragDx}px ${this._dragDy}px` : "";
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
          ? html`<button class="sgear" aria-label=${t(this.hass, "section_settings")} @click=${() => this._sectionSettings(s)}>${gearIcon(18)}</button>`
          : this._quickButtons(s)}
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

  /** Quick actions on the right of a section title (hidden in move mode). */
  private _quickButtons(s: TerralSection) {
    const h = this.hass;
    if (!h) return nothing;
    const btns = quickOf(s)
      .map((k) => ({ k, ...quickState(h, k, s.cards) }))
      .filter((q) => q.ids.length);
    if (!btns.length) return nothing;
    return html`<div class="quick">
      ${btns.map(
        (q) => html`<button
          class="qb ${q.on ? "on" : ""} ${q.k}"
          aria-label=${t(h, q.k === "lights" ? (q.on ? "quick_lights_off" : "quick_lights_on") : q.on ? "quick_climate_off" : "quick_climate_on")}
          @click=${() => runQuick(h, q.k, s.cards)}
        >${q.k === "lights" ? bulbIcon(q.on > 0, 21) : thermoIcon(20)}${q.on ? html`<span class="n">${q.on}</span>` : nothing}</button>`,
      )}
    </div>`;
  }

  private _sectionSettings(s: TerralSection) {
    if (!this.hass) return;
    openSectionSheet(
      this.hass,
      s,
      ({ title, quick }) =>
        this._update((l) => {
          const sec = l.sections.find((x) => x.id === s.id);
          if (!sec) return;
          sec.title = title;
          if (quick.length === DEFAULT_QUICK.length && quick.every((k) => DEFAULT_QUICK.includes(k))) delete sec.quick;
          else sec.quick = quick;
        }),
      () => this._removeSection(s.id),
    );
  }

  private _grid(key: ListKey, cards: TerralCard[], edit: boolean, addTile: boolean, placeholder?: string) {
    const zoneTarget = this._drag?.kind === "card" && this._dropCard?.key === key && !this._dropCard.targetId && this._dropCard.page == null;
    const strip = this._inStrip(key);
    // The strip flows sideways (swipe for more); every other grid is 2 columns wide.
    const style = strip
      ? `grid-auto-flow:column dense;grid-template-rows:repeat(${this._strip},${this._rowH}px);grid-auto-columns:${this._colW}px;gap:${this._gap}px`
      : `grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px;gap:${this._gap}px`;
    return html`<div
      class="grid ${zoneTarget ? "zone-target" : ""} ${key === TOP ? "top-grid" : ""} ${strip ? "strip" : ""}"
      data-zone=${key}
      style=${style}
    >
      ${repeat(cards, (c) => c.id, (c, i) => this._cell(key, c, i, edit))}
      ${placeholder && !cards.length ? html`<div class="placeholder" style=${strip ? `grid-row:1/-1;width:${this._laneW}px` : "grid-column:1/-1"}>${placeholder}</div>` : nothing}
      ${addTile
        ? html`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${plusIcon(26)}</span><span>${t(this.hass, "add_accessory")}</span>
          </button>`
        : nothing}
    </div>`;
  }

  private _cell(key: ListKey, c: TerralCard, i: number, edit: boolean) {
    const size = this._sizeOf(c, this._inStrip(key));
    const { w, h } = size;
    const dragging = this._drag?.kind === "card" && this._drag.id === c.id;
    const target = this._drag?.kind === "card" && this._dropCard?.targetId === c.id;
    const style = `grid-column:span ${w};grid-row:span ${h};--d:${(i % 5) * -0.07}s;${
      dragging ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""
    }`;
    return html`<div class="cell ${dragging ? "dragging" : ""} ${target ? "target" : ""}" data-cid=${c.id} data-key=${key} style=${style}>
      ${this._element(c, size)}
      ${edit
        ? html`<div class="overlay" @pointerdown=${(ev: PointerEvent) => this._overlayDown(ev, c.id)}>
            <button class="del" aria-label=${t(this.hass, "delete")} @click=${() => this._remove(c.id)}>${minusIcon()}</button>
            ${this._canResize(c, this._inStrip(key)) ? html`<button
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
      grid-auto-flow: row dense;
    }
    /* Page pills under the title (scroll sideways when there are many). */
    .pills {
      display: flex;
      gap: 8px;
      margin: -6px -16px 20px;
      padding: 4px 16px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .pills::-webkit-scrollbar {
      display: none;
    }
    .pg {
      height: 36px;
      padding: 0 16px;
      border-radius: 18px;
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      color: #fff;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.13);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transition: transform 0.15s;
    }
    .pg.on {
      background: #fff;
      color: #23233a;
      border-color: #fff;
      box-shadow: none;
    }
    .editing .pg.on {
      padding-right: 6px;
    }
    .pgear {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(35, 35, 58, 0.1);
    }
    .pg.add {
      background: none;
      box-shadow: none;
      border: 2px dashed rgba(255, 255, 255, 0.45);
      padding: 0 14px;
      gap: 6px;
    }
    .pg.drop {
      outline: 2px dashed rgba(255, 255, 255, 0.95);
      outline-offset: 3px;
      transform: scale(1.06);
    }
    /* Favourites strip: across every column, scrolls sideways when it doesn't fit. */
    .favs {
      margin: 0 0 22px;
    }
    .grid.strip {
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      /* Room for the move-mode badges, which stick out of the cards. */
      padding: 12px 12px;
      margin: -12px -12px;
    }
    .grid.strip::-webkit-scrollbar {
      display: none;
    }
    .grid.strip.more {
      -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 64px), transparent);
      mask-image: linear-gradient(90deg, #000 calc(100% - 64px), transparent);
    }
    /* Blocks (cards without a section, sections) side by side, each in the shortest lane. */
    .lanes {
      display: flex;
      align-items: flex-start;
      gap: var(--lane-gap);
    }
    .lane {
      flex: none;
      min-width: 0;
    }
    .lane > section.sec:first-child,
    .lane > .dropline:first-child + section.sec {
      margin-top: 0;
    }
    .topblock + section.sec {
      margin-top: 18px;
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
      /* Vertical swipes scroll the page; a card is picked up after a short rest. */
      touch-action: pan-y;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
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
    /* Section quick actions (lights, climate) and the move-mode gear. */
    .quick {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: none;
    }
    .qb {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: relative;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.13);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transition: background 0.2s;
    }
    .qb.lights.on {
      background: #ffb020;
      border-color: rgba(255, 255, 255, 0.7);
      box-shadow: none;
    }
    .qb.climate.on {
      background: #4696ff;
      border-color: rgba(255, 255, 255, 0.7);
      box-shadow: none;
    }
    .qb .n {
      position: absolute;
      right: -4px;
      top: -4px;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      padding: 0 5px;
      box-sizing: border-box;
      background: #fff;
      color: #2a2a3a;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    }
    .sgear {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.22);
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
