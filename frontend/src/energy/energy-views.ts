// The three views of the home energy card (flow, ring, bars) at every size,
// shared by the card and the "Ahora" part of the window. Plain SVG / HTML;
// the movement is SVG animation and CSS, faster the more a consumer uses.
import { html, nothing, svg, type TemplateResult } from "lit";
import type { HomeAssistant } from "../ha-types";
import { SWITCH_COLORS, switchIcon } from "../switch/switch-look";
import { type Item, type Live, fmt1, fmtP } from "./energy-model";

// ---- Icons and colours ------------------------------------------------------------

const EXTRA: Record<string, ReturnType<typeof svg>> = {
  car: svg`<path d="M5 16V11l2-5h10l2 5v5"></path><path d="M3 16h18v3H3z"></path><path d="M5 11h14"></path>`,
  snow: svg`<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"></path><path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"></path>`,
  home: svg`<path d="M4 11l8-7 8 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`,
  tower: svg`<path d="M8 21l4-18 4 18M6 8h12M5 13h14M9.5 13l5 8M14.5 13l-5 8"></path>`,
  bolt: svg`<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor" stroke="none"></path>`,
};

/** Icons offered for a consumer (the switch icons plus car, snowflake and house). */
export const ENERGY_ICONS = ["car", "snow", "home", "boiler", "washer", "heater", "radiator", "dehumidifier", "pump", "coffee", "tv", "router", "fan", "plug", "water"];

export function energyIcon(key: string, size = 24) {
  if (!EXTRA[key]) return switchIcon(key, false, size);
  return svg`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EXTRA[key]}</svg>`;
}

export const hexOf = (key: string) => SWITCH_COLORS.find((c) => c.key === key)?.hex ?? key;

/** Icon inside an SVG, centred on (x, y). */
const icoAt = (key: string, x: number, y: number, s: number) =>
  svg`<g transform="translate(${x - s / 2} ${y - s / 2})" color="#fff">${energyIcon(key, s)}</g>`;

// ---- Motion -----------------------------------------------------------------------

/** Seconds a dot takes along a path: faster with more power. */
const pace = (kw: number) => Math.max(0.9, 3.2 - kw * 0.8);

function dots(path: string, color: string, kw: number, r: number, on: boolean) {
  if (!on || kw < 0.01) return nothing;
  const dur = pace(kw);
  const n = kw > 2 ? 4 : kw > 0.8 ? 3 : 2;
  return Array.from({ length: n }, (_, i) => svg`<circle r=${r} fill=${color}>
    <animateMotion dur="${dur.toFixed(2)}s" repeatCount="indefinite" begin="-${((dur / n) * i).toFixed(2)}s" path=${path}></animateMotion></circle>`);
}

const lineW = (kw: number, k: number, base: number) => (base + Math.min(kw, 6) * k).toFixed(1);

// ---- Ring --------------------------------------------------------------------------

let ringSeq = 0;

/** Donut split by item; a band of light runs along each segment. */
function ring(items: Item[], total: number, R: number, sw: number, cx: number, cy: number, on: boolean) {
  const L = 2 * Math.PI * R;
  const id = `er${++ringSeq}`;
  if (total <= 0.001) return svg`<circle cx=${cx} cy=${cy} r=${R} fill="none" stroke="rgba(255,255,255,.18)" stroke-width=${sw}></circle>`;
  const shown = items.filter((x) => x.kw > 0.001);
  const gap = shown.length > 1 ? Math.min(6, L * 0.012) : 0;
  let off = 0;
  return shown.map((x, i) => {
    const len = Math.max(0.5, (x.kw / total) * L - gap);
    const color = hexOf(x.color);
    const a0 = (off / L) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((off + len) / L) * 2 * Math.PI - Math.PI / 2;
    const big = len / L > 0.5 ? 1 : 0;
    const ro = R + sw, ri = Math.max(1, R - sw);
    const P = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
    const clip = `M${P(ri, a0)} L${P(ro, a0)} A${ro} ${ro} 0 ${big} 1 ${P(ro, a1)} L${P(ri, a1)} A${ri} ${ri} 0 ${big} 0 ${P(ri, a0)} Z`;
    const cl = Math.min(len * 0.45, Math.max(8, R * 0.45));
    const n = len > L * 0.4 ? 2 : 1;
    const dur = (len + cl) / ((R / 80) * (55 + x.kw * 35));
    const start = off;
    off += len + gap;
    return svg`
      <clipPath id="${id}-${i}"><path d=${clip}></path></clipPath>
      <circle cx=${cx} cy=${cy} r=${R} fill="none" stroke=${color} stroke-width=${sw}
        stroke-dasharray="${len.toFixed(1)} ${(L - len).toFixed(1)}" stroke-dashoffset=${(-start).toFixed(1)} transform="rotate(-90 ${cx} ${cy})"></circle>
      ${on
        ? Array.from({ length: n }, (_, k) => svg`<circle cx=${cx} cy=${cy} r=${R} fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=${sw}
            stroke-dasharray="${cl.toFixed(1)} ${(L * 2).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})" clip-path="url(#${id}-${i})">
            <animate attributeName="stroke-dashoffset" from=${(-(start - cl)).toFixed(1)} to=${(-(start + len)).toFixed(1)} dur="${dur.toFixed(2)}s"
              begin="-${((dur / n) * k).toFixed(2)}s" repeatCount="indefinite"></animate></circle>`)
        : nothing}`;
  });
}

// ---- Bars --------------------------------------------------------------------------

function barRow(h: HomeAssistant, x: Item, total: number, scaleKw: number, small: boolean, on: boolean, pctOn: boolean) {
  const w = Math.max(x.kw > 0.001 ? 6 : 0, Math.min(100, (x.kw / scaleKw) * 100));
  return html`<div class="lb">
    <span class="ci" style="background:${hexOf(x.color)}">${energyIcon(x.icon, small ? 15 : 18)}</span>
    <div class="lbt">
      <div class="lbn"><span>${x.name}</span><b>${fmtP(h, x)}${pctOn && total > 0 ? html`<small> · ${Math.round((x.kw / total) * 100)} %</small>` : nothing}</b></div>
      <div class="trk"><i class=${on && x.kw > 0.01 ? "mv" : ""} style="width:${w}%;--c:${hexOf(x.color)};animation-duration:${pace(x.kw).toFixed(2)}s"></i></div>
    </div>
  </div>`;
}

const scaleOf = (items: Item[]) => Math.max(1, ...items.map((x) => x.kw)) * 1.15;

// ---- Sizes -------------------------------------------------------------------------

export interface ViewArgs {
  h: HomeAssistant;
  live: Live;
  view: "flow" | "ring" | "bars";
  animate: boolean;
  title: string;
  /** "hoy 18,4 kWh" when known. */
  todayText?: string;
  /** kWh today per item key, for the bottom stack of the 4/2. */
  today?: Record<string, number>;
  labels: { now: string; grid: string; kwNow: string };
}

const head = (a: ViewArgs, big = true) => html`<div class="ehead ${big ? "" : "sm"}">
  <span class="eic">${energyIcon("bolt", big ? 30 : 18)}</span>
  <span class="txt"><span class="name">${a.title}</span><span class="state">${a.todayText ?? a.labels.now}</span></span>
  ${a.view === "ring" && big ? nothing : html`<span class="tot">${fmt1(a.h, a.live.total)}<small> kW</small></span>`}
</div>`;

function stack(a: ViewArgs) {
  const t = a.today;
  if (!t) return nothing;
  const items = a.live.items.filter((x) => (t[x.key] ?? 0) > 0.005);
  if (!items.length) return nothing;
  return html`<div class="stack">${items.map((x) => html`<i style="flex:${t[x.key]};background:${hexOf(x.color)}"></i>`)}</div>
    ${a.view !== "ring" && items.length <= 4
      ? html`<div class="legend">${items.map((x) => html`<span><b style="background:${hexOf(x.color)}"></b>${fmt1(a.h, t[x.key])} kWh</span>`)}</div>`
      : nothing}`;
}

export function view42(a: ViewArgs): TemplateResult {
  const { h, live, animate } = a;
  const items = live.items.slice(0, 6);
  if (a.view === "bars") {
    return html`${head(a)}<div class="lbars">${items.map((x) => barRow(h, x, live.total, scaleOf(items), false, animate, true))}</div>${stack(a)}`;
  }
  if (a.view === "ring") {
    const rows = items.slice(0, 5);
    const step = rows.length > 3 ? 40 : 58;
    const y0 = 103 - ((rows.length - 1) * step) / 2;
    return html`${head(a)}
      <svg class="flow" viewBox="0 0 322 206" preserveAspectRatio="xMidYMid meet">
        ${ring(items, live.total, 80, 18, 100, 103, animate)}
        <text x="100" y="104" text-anchor="middle" class="big">${fmt1(h, live.total)}</text>
        <text x="100" y="126" text-anchor="middle" class="t2">${a.labels.kwNow}</text>
        ${rows.map((x, i) => svg`<circle cx="212" cy=${y0 + i * step} r="15" fill=${hexOf(x.color)}></circle>${icoAt(x.icon, 212, y0 + i * step, 18)}
          <text x="236" y=${y0 + i * step - 5} class="t1">${short(x.name)}</text>
          <text x="236" y=${y0 + i * step + 13} class="t2">${fmtP(h, x)}${live.total > 0 ? ` · ${Math.round((x.kw / live.total) * 100)} %` : ""}</text>`)}
      </svg>${stack(a)}`;
  }
  // flow
  const n = items.length;
  const xs = items.map((_, i) => (n === 1 ? 160 : 48 + (224 / (n - 1)) * i));
  const top = 54, bot = 146;
  const paths = xs.map((x) => `M160 ${top} C160 ${top + 40}, ${x} ${bot - 60}, ${x} ${bot - 24}`);
  const r = n > 4 ? 18 : 24;
  return html`${head(a)}
    <svg class="flow" viewBox="0 0 320 206" preserveAspectRatio="xMidYMid meet">
      ${paths.map((d, i) => svg`<path d=${d} fill="none" stroke="rgba(255,255,255,.16)" stroke-width=${lineW(items[i].kw, 2.6, 3)} stroke-linecap="round"></path>`)}
      ${paths.map((d, i) => dots(d, hexOf(items[i].color), items[i].kw, 4.2, animate))}
      <circle cx="160" cy="28" r="26" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.35)"></circle>${icoAt("tower", 160, 28, 26)}
      <text x="194" y="24" class="t1">${a.labels.grid}</text><text x="194" y="41" class="t2">${fmt1(h, live.total)} kW</text>
      ${xs.map((x, i) => svg`<circle cx=${x} cy=${bot} r=${r} fill=${hexOf(items[i].color)}></circle>${icoAt(items[i].icon, x, bot, r)}
        <text x=${x} y=${bot + 42} class="t1 ${n > 4 ? "sm" : ""}" text-anchor="middle">${short(items[i].name)}</text>
        <text x=${x} y=${bot + 59} class="t2" text-anchor="middle">${fmtP(h, items[i])}${n <= 3 && live.total > 0 ? ` · ${Math.round((items[i].kw / live.total) * 100)} %` : ""}</text>`)}
    </svg>${stack(a)}`;
}

export function view22(a: ViewArgs): TemplateResult {
  const { h, live, animate } = a;
  const items = live.items.slice(0, a.view === "bars" ? 3 : 4);
  if (a.view === "bars") {
    return html`<div class="lbn top"><span>${a.title}</span><b>${fmt1(h, live.total)} kW${a.todayText ? html`<small> · ${a.todayText}</small>` : nothing}</b></div>
      <div class="lbars sm">${items.map((x) => barRow(h, x, live.total, scaleOf(items), true, animate, false))}</div>`;
  }
  if (a.view === "ring") {
    const step = items.length > 3 ? 29 : 39;
    const y0 = 61 - ((items.length - 1) * step) / 2;
    return html`<svg class="flow" viewBox="0 0 322 122" preserveAspectRatio="xMidYMid meet">
      ${ring(live.items, live.total, 48, 12, 58, 61, animate)}
      <text x="58" y="62" text-anchor="middle" class="mid">${fmt1(h, live.total)}</text>
      <text x="58" y="78" text-anchor="middle" class="t2 xs">kW</text>
      ${items.map((x, i) => svg`<circle cx="140" cy=${y0 + i * step} r="12" fill=${hexOf(x.color)}></circle>${icoAt(x.icon, 140, y0 + i * step, 15)}
        <text x="160" y=${y0 + i * step + 5} class="t1 sm">${short(x.name)}</text><text x="320" y=${y0 + i * step + 5} class="t1 sm" text-anchor="end">${fmtP(h, x)}</text>`)}
    </svg>`;
  }
  const n = items.length;
  const ys = items.map((_, i) => (n === 1 ? 44 : 13 + (62 / (n - 1)) * i));
  const paths = ys.map((y) => `M46 44 C88 44, 96 ${y}, 136 ${y}`);
  return html`${head(a, false)}
    <svg class="flow" viewBox="0 0 322 88" preserveAspectRatio="xMidYMid meet">
      ${paths.map((d, i) => svg`<path d=${d} fill="none" stroke="rgba(255,255,255,.16)" stroke-width=${lineW(items[i].kw, 1.8, 2.5)} stroke-linecap="round"></path>`)}
      ${paths.map((d, i) => dots(d, hexOf(items[i].color), items[i].kw, 3, animate))}
      <circle cx="24" cy="44" r="22" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.35)"></circle>${icoAt("tower", 24, 44, 22)}
      ${ys.map((y, i) => svg`<circle cx="150" cy=${y} r="13" fill=${hexOf(items[i].color)}></circle>${icoAt(items[i].icon, 150, y, 16)}
        <text x="171" y=${y + 5} class="t1 sm">${short(items[i].name)}</text><text x="320" y=${y + 5} class="t1 sm" text-anchor="end">${fmtP(h, items[i])}</text>`)}
    </svg>`;
}

export function view21(a: ViewArgs): TemplateResult {
  const { h, live, animate } = a;
  if (a.view === "ring") {
    return html`<svg class="flow" viewBox="0 0 150 112" preserveAspectRatio="xMidYMid meet">
        ${ring(live.items, live.total, 46, 12, 75, 56, animate)}
        <text x="75" y="60" text-anchor="middle" class="mid">${fmt1(h, live.total)}</text>
        <text x="75" y="76" text-anchor="middle" class="t2 xs">kW</text>
      </svg>
      <span class="txt"><span class="name">${a.title}</span><span class="state">${a.todayText ?? a.labels.now}</span></span>`;
  }
  if (a.view === "bars") {
    const items = live.items.slice(0, 3);
    const sc = scaleOf(items);
    return html`<span class="txt"><span class="name">${a.title}</span><span class="state">${fmt1(h, live.total)} kW</span></span>
      <div class="mini">${items.map((x) => html`<div class="mr">
        <span class="ci xs" style="background:${hexOf(x.color)}">${energyIcon(x.icon, 12)}</span>
        <div class="trk"><i class=${animate && x.kw > 0.01 ? "mv" : ""} style="width:${Math.max(x.kw > 0.001 ? 8 : 0, (x.kw / sc) * 100)}%;--c:${hexOf(x.color)};animation-duration:${pace(x.kw).toFixed(2)}s"></i></div>
        <b>${fmt1(h, x.kw)}</b></div>`)}</div>`;
  }
  return html`<span class="eic">${energyIcon("bolt", 30)}</span>
    <div class="vstack">${live.items.filter((x) => x.kw > 0.001).map((x) => html`<i style="flex:${x.kw};background:${hexOf(x.color)}"></i>`)}</div>
    <span class="txt"><span class="name">${a.title}</span><span class="state">${fmt1(h, live.total)} kW</span></span>`;
}

export function view11(a: ViewArgs): TemplateResult {
  const { h, live, animate } = a;
  const icon = a.view === "ring"
    ? html`<svg width="40" height="40" viewBox="0 0 40 40" style="flex:none">${ring(live.items, live.total, 15, 6, 20, 20, animate)}</svg>`
    : html`<span class="eic sm">${energyIcon("bolt", 20)}</span>`;
  return html`${icon}<span class="txt"><span class="name">${a.title}</span><span class="state">${fmt1(h, live.total)} kW</span></span>
    ${a.view === "ring" ? nothing : html`<div class="hbar">${live.items.filter((x) => x.kw > 0.001).map((x) =>
      html`<i class=${animate && a.view === "bars" ? "mv" : ""} style="flex:${x.kw};background-color:${hexOf(x.color)};animation-duration:${pace(x.kw).toFixed(2)}s"></i>`)}</div>`}`;
}

/** Shorter names for the diagrams: "Cargador del coche" → "Cargador". */
export function short(name: string): string {
  const w = name.trim().split(/\s+/);
  return w.length > 1 && name.length > 11 ? w[0] : name;
}
