/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = globalThis, di = Ye.ShadowRoot && (Ye.ShadyCSS === void 0 || Ye.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, hi = Symbol(), Ii = /* @__PURE__ */ new WeakMap();
let Cn = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== hi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (di && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = Ii.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ii.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ya = (t) => new Cn(typeof t == "string" ? t : t + "", void 0, hi), M = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[a + 1], t[0]);
  return new Cn(s, t, hi);
}, Va = (t, e) => {
  if (di) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), n = Ye.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, t.appendChild(i);
  }
}, Hi = di ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Ya(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ga, defineProperty: Xa, getOwnPropertyDescriptor: Ka, getOwnPropertyNames: Qa, getOwnPropertySymbols: Za, getPrototypeOf: Ja } = Object, ms = globalThis, Ri = ms.trustedTypes, to = Ri ? Ri.emptyScript : "", eo = ms.reactiveElementPolyfillSupport, me = (t, e) => t, Ze = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? to : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, pi = (t, e) => !Ga(t, e), Wi = { attribute: !0, type: String, converter: Ze, reflect: !1, useDefault: !1, hasChanged: pi };
Symbol.metadata ??= Symbol("metadata"), ms.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Pt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Wi) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, s);
      n !== void 0 && Xa(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: n, set: a } = Ka(this.prototype, e) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: n, set(o) {
      const l = n?.call(this);
      a?.call(this, o), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Wi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(me("elementProperties"))) return;
    const e = Ja(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(me("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(me("properties"))) {
      const s = this.properties, i = [...Qa(s), ...Za(s)];
      for (const n of i) this.createProperty(n, s[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, n] of s) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const n = this._$Eu(s, i);
      n !== void 0 && this._$Eh.set(n, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i) s.unshift(Hi(n));
    } else e !== void 0 && s.push(Hi(e));
    return s;
  }
  static _$Eu(e, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Va(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, s, i) {
    this._$AK(e, i);
  }
  _$ET(e, s) {
    const i = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, i);
    if (n !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : Ze).toAttribute(s, i.type);
      this._$Em = e, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Ze;
      this._$Em = n;
      const l = o.fromAttribute(s, a.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, n = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? pi)(a, s) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: n, wrapped: a }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? s ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, a] of i) {
        const { wrapped: o } = a, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, a, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Pt.elementStyles = [], Pt.shadowRootOptions = { mode: "open" }, Pt[me("elementProperties")] = /* @__PURE__ */ new Map(), Pt[me("finalized")] = /* @__PURE__ */ new Map(), eo?.({ ReactiveElement: Pt }), (ms.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ui = globalThis, qi = (t) => t, Je = ui.trustedTypes, Ui = Je ? Je.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, An = "$lit$", ot = `lit$${Math.random().toFixed(9).slice(2)}$`, Mn = "?" + ot, so = `<${Mn}>`, kt = document, we = () => kt.createComment(""), $e = (t) => t === null || typeof t != "object" && typeof t != "function", fi = Array.isArray, io = (t) => fi(t) || typeof t?.[Symbol.iterator] == "function", As = `[ 	
\f\r]`, oe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Bi = /-->/g, Fi = />/g, bt = RegExp(`>|${As}(?:([^\\s"'>=/]+)(${As}*=${As}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Yi = /'/g, Vi = /"/g, zn = /^(?:script|style|textarea|title)$/i, En = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = En(1), v = En(2), dt = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), Gi = /* @__PURE__ */ new WeakMap(), yt = kt.createTreeWalker(kt, 129);
function Tn(t, e) {
  if (!fi(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ui !== void 0 ? Ui.createHTML(e) : e;
}
const no = (t, e) => {
  const s = t.length - 1, i = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = oe;
  for (let l = 0; l < s; l++) {
    const c = t[l];
    let h, p, u = -1, m = 0;
    for (; m < c.length && (o.lastIndex = m, p = o.exec(c), p !== null); ) m = o.lastIndex, o === oe ? p[1] === "!--" ? o = Bi : p[1] !== void 0 ? o = Fi : p[2] !== void 0 ? (zn.test(p[2]) && (n = RegExp("</" + p[2], "g")), o = bt) : p[3] !== void 0 && (o = bt) : o === bt ? p[0] === ">" ? (o = n ?? oe, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, h = p[1], o = p[3] === void 0 ? bt : p[3] === '"' ? Vi : Yi) : o === Vi || o === Yi ? o = bt : o === Bi || o === Fi ? o = oe : (o = bt, n = void 0);
    const b = o === bt && t[l + 1].startsWith("/>") ? " " : "";
    a += o === oe ? c + so : u >= 0 ? (i.push(h), c.slice(0, u) + An + c.slice(u) + ot + b) : c + ot + (u === -2 ? l : b);
  }
  return [Tn(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
let qs = class Dn {
  constructor({ strings: e, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const l = e.length - 1, c = this.parts, [h, p] = no(e, s);
    if (this.el = Dn.createElement(h, i), yt.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = yt.nextNode()) !== null && c.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(An)) {
          const m = p[o++], b = n.getAttribute(u).split(ot), g = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: a, name: g[2], strings: b, ctor: g[1] === "." ? oo : g[1] === "?" ? ro : g[1] === "@" ? lo : _s }), n.removeAttribute(u);
        } else u.startsWith(ot) && (c.push({ type: 6, index: a }), n.removeAttribute(u));
        if (zn.test(n.tagName)) {
          const u = n.textContent.split(ot), m = u.length - 1;
          if (m > 0) {
            n.textContent = Je ? Je.emptyScript : "";
            for (let b = 0; b < m; b++) n.append(u[b], we()), yt.nextNode(), c.push({ type: 2, index: ++a });
            n.append(u[m], we());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Mn) c.push({ type: 2, index: a });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(ot, u + 1)) !== -1; ) c.push({ type: 7, index: a }), u += ot.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const i = kt.createElement("template");
    return i.innerHTML = e, i;
  }
};
function Wt(t, e, s = t, i) {
  if (e === dt) return e;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const a = $e(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(t), n._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = n : s._$Cl = n), n !== void 0 && (e = Wt(t, n._$AS(t, e.values), n, i)), e;
}
class ao {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: i } = this._$AD, n = (e?.creationScope ?? kt).importNode(s, !0);
    yt.currentNode = n;
    let a = yt.nextNode(), o = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let h;
        c.type === 2 ? h = new Kt(a, a.nextSibling, this, e) : c.type === 1 ? h = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (h = new co(a, this, e)), this._$AV.push(h), c = i[++l];
      }
      o !== c?.index && (a = yt.nextNode(), o++);
    }
    return yt.currentNode = kt, n;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Kt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, n) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && e?.nodeType === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = Wt(this, e, s), $e(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== dt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : io(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && $e(this._$AH) ? this._$AA.nextSibling.data = e : this.T(kt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = qs.createElement(Tn(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const a = new ao(n, this), o = a.u(this.options);
      a.p(s), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let s = Gi.get(e.strings);
    return s === void 0 && Gi.set(e.strings, s = new qs(e)), s;
  }
  k(e) {
    fi(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const a of e) n === s.length ? s.push(i = new Kt(this.O(we()), this.O(we()), this, this.options)) : i = s[n], i._$AI(a), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = qi(e).nextSibling;
      qi(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class _s {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, n, a) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = e, this.name = s, this._$AM = n, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = f;
  }
  _$AI(e, s = this, i, n) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = Wt(this, e, s, 0), o = !$e(e) || e !== this._$AH && e !== dt, o && (this._$AH = e);
    else {
      const l = e;
      let c, h;
      for (e = a[0], c = 0; c < a.length - 1; c++) h = Wt(this, l[i + c], s, c), h === dt && (h = this._$AH[c]), o ||= !$e(h) || h !== this._$AH[c], h === f ? e = f : e !== f && (e += (h ?? "") + a[c + 1]), this._$AH[c] = h;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class oo extends _s {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class ro extends _s {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class lo extends _s {
  constructor(e, s, i, n, a) {
    super(e, s, i, n, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = Wt(this, e, s, 0) ?? f) === dt) return;
    const i = this._$AH, n = e === f && i !== f || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== f && (i === f || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class co {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Wt(this, e);
  }
}
const ho = { I: Kt }, po = ui.litHtmlPolyfillSupport;
po?.(qs, Kt), (ui.litHtmlVersions ??= []).push("3.3.3");
const uo = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = s?.renderBefore ?? null;
    i._$litPart$ = n = new Kt(e.insertBefore(we(), a), a, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gi = globalThis;
let N = class extends Pt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = uo(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return dt;
  }
};
N._$litElement$ = !0, N.finalized = !0, gi.litElementHydrateSupport?.({ LitElement: N });
const fo = gi.litElementPolyfillSupport;
fo?.({ LitElement: N });
(gi.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const go = { attribute: !0, type: String, converter: Ze, reflect: !1, hasChanged: pi }, mo = (t = go, e, s) => {
  const { kind: i, metadata: n } = s;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(s.name, t), i === "accessor") {
    const { name: o } = s;
    return { set(l) {
      const c = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(o, c, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, t, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = s;
    return function(l) {
      const c = this[o];
      e.call(this, l), this.requestUpdate(o, c, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function y(t) {
  return (e, s) => typeof s == "object" ? mo(t, e, s) : ((i, n, a) => {
    const o = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(t) {
  return y({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _o = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function bo(t, e) {
  return (s, i, n) => {
    const a = (o) => o.renderRoot?.querySelector(t) ?? null;
    return _o(s, i, { get() {
      return a(this);
    } });
  };
}
const xo = {
  on: "Encendida",
  off: "Apagada",
  unavailable: "Sin respuesta",
  not_found: "Entidad no encontrada",
  turn_on: "Encender",
  turn_off: "Apagar",
  close: "Cerrar",
  brightness: "Brillo",
  temperature: "Temperatura",
  favorites: "Favoritos",
  more_colors: "Más colores",
  warm: "Cálida",
  neutral: "Neutra",
  day: "Día",
  cold: "Fría",
  last_activity: "Última actividad",
  lights_in_group: "Luces del grupo",
  all_on: "Encender todas",
  all_off: "Apagar todas",
  more: "más · ver todas",
  of: "de",
  lit: "encendidas",
  all_lit: "Todas encendidas",
  lights_off: "luces · apagadas",
  no_color: "sin color",
  just_now: "Ahora mismo",
  min_ago: "Hace {n} min",
  h_ago: "Hace {n} h",
  days_ago: "Hace {n} d",
  other_area: "Sin habitación",
  add_card: "Añadir tarjeta",
  edit: "Editar",
  delete: "Borrar",
  size: "Tamaño",
  resize: "Arrastra para cambiar el tamaño",
  drag: "Arrastrar para mover",
  yaml_mode: "Este dashboard está en modo YAML: no se puede mover ni redimensionar desde aquí.",
  menu: "Menú",
  home_title: "Mi casa",
  add_accessory: "Añadir accesorio",
  search_lights: "Buscar accesorios",
  no_lights: "No hay accesorios que añadir",
  light_groups: "Grupos de luces",
  group: "Grupo",
  added: "Añadida",
  edit_home: "Editar inicio",
  terral_settings: "Ajustes de Terral Home",
  coming_soon: "Próximamente",
  done: "Listo",
  new_section: "Nuevo apartado",
  add_section: "Añadir apartado",
  delete_section: "Quitar apartado",
  delete_section_q: "¿Quitar «{name}»?",
  delete_section_msg: "Tiene {n} tarjetas. ¿Qué hacemos con ellas?",
  keep_cards: "Mantener las tarjetas",
  keep_cards_sub: "Pasan al apartado de arriba",
  keep_cards_sub_top: "Pasan arriba, sin apartado",
  remove_cards: "Quitarlas también",
  cancel: "Cancelar",
  rename_section: "Cambiar el nombre",
  move_section: "Mover apartado",
  drop_here: "Arrastra tarjetas aquí",
  no_section: "Arrastra aquí las tarjetas sin apartado",
  by_rooms: "Crear apartados por habitación",
  by_rooms_sub: "Cada luz pasa al apartado de su habitación",
  by_rooms_msg: "Se crea un apartado por cada habitación de Home Assistant y cada luz pasa al suyo. Las luces sin habitación se quedan donde están.",
  by_rooms_go: "Crear apartados",
  alarm: "Alarma",
  alarm_disarmed: "Desarmada",
  alarm_arming: "Armando {mode}",
  alarm_leave: "sal ya",
  alarm_armed: "Armada {mode}",
  alarm_since: "desde las {t}",
  alarm_failed: "No se ha armado",
  alarm_open: "Abierto: {name}",
  alarm_open_n: "{n} sensores abiertos",
  alarm_pending: "Entrada detectada",
  alarm_pending_sub: "Desarma antes de que salte",
  alarm_triggered: "¡Alarma!",
  mode_away: "Ausente",
  mode_home: "En casa",
  mode_night: "Noche",
  mode_vacation: "Vacaciones",
  mode_custom: "Personalizado",
  arm_mode: "Armar: {mode}",
  arm_anyway: "Armar igualmente",
  disarm: "Desarmar",
  code_title: "Código de la alarma",
  code_wrong: "Código incorrecto",
  code_placeholder: "Código",
  erase: "Borrar",
  ok: "Aceptar",
  skip_delay: "Saltar la espera",
  open_sensors: "Sensores abiertos",
  bypassed_sensors: "Sensores anulados",
  changed_by: "Último cambio",
  arm_options: "Armar",
  security: "Seguridad",
  alarm_entity: "Alarma (alarm_control_panel)",
  charger: "Cargador",
  ev_charger: "Cargador de coche",
  ch_none: "Sin coche",
  ch_connected: "Conectado",
  ch_ready: "Conectado · listo para cargar",
  ch_charging: "Cargando",
  ch_locked: "Bloqueado",
  ch_locked_car: "Coche conectado · bloqueado",
  ch_unlocked: "Desbloqueado",
  lock: "Bloquear",
  unlock: "Desbloquear",
  last_session: "Última sesión",
  this_week: "Esta semana",
  last_hour: "última hora",
  this_charge: "{kwh} en esta carga · {time}",
  last_7_days: "Últimos 7 días",
  week_total: "Semana",
  recent_charges: "Últimas cargas",
  charging_now: "CARGANDO",
  in_progress: "En curso",
  max_kw: "máx. {kw}",
  no_history: "Sin cargas en los últimos 7 días",
  history_unavailable: "No se pudo leer el historial",
  settings: "Ajustes",
  back: "Volver",
  ch_lock_section: "Bloqueo del cargador",
  ch_entity: "Entidad",
  ch_invert: "Invertir",
  ch_invert_sub: "Cambia qué significa {a} y {b}",
  ch_explain: "Con esta configuración: {a} = {la} · {b} = {lb}. Al pulsar Bloquear, Terral pondrá la entidad en {press}.",
  ch_data: "Datos (opcionales, se detectan solos)",
  ch_status: "Estado del coche",
  ch_power: "Potencia",
  ch_energy: "Energía de la sesión",
  ch_max: "Potencia máxima (kW)",
  auto: "Automático",
  none: "Ninguno",
  raw_on: "encendido",
  raw_off: "apagado",
  raw_locked: "cerrado",
  raw_unlocked: "abierto",
  save_local: "Estos ajustes solo se guardan desde el panel de Terral Home",
  add_charger_other: "Elegir otra entidad para un cargador",
  search_entities: "Buscar entidad",
  charger_entity: "Interruptor o candado del cargador",
  type_weather: "Tiempo",
  type_weather_desc: "Met.no u otro servicio del tiempo",
  weather_missing: "No hay ningún servicio del tiempo en Home Assistant",
  now: "Ahora",
  today: "Hoy",
  max_short: "Máx.",
  min_short: "Mín.",
  humidity: "Humedad",
  wind: "Viento",
  pressure: "Presión",
  clouds: "Nubes",
  dew_point: "Punto de rocío",
  rain_today: "Lluvia hoy",
  next_hours: "Próximas horas",
  next_days: "Próximos días",
  card_section: "Tarjeta",
  forecast_22: "Previsión en 2/2",
  hours_word: "Horas",
  days_word: "Días",
  animate_fx: "Animación de lluvia y nieve",
  show_details: "Datos actuales",
  show_details_sub: "Humedad, viento, presión, nubes, rocío",
  forecast_days: "Días de previsión",
  type_climate_desc: "Aire acondicionado, calefacción o bomba de calor",
  climate_missing: "No hay climatizadores en Home Assistant",
  climate_mode: "Modo",
  climate_fan: "Ventilador",
  no_temperature: "Sin temperatura",
  climate_off_note: "La máquina está apagada.",
  fan_fixed: "En {mode} la velocidad es fija.",
  swing: "Oscilación",
  presets: "Modo de uso",
  min_temp_l: "Mínima",
  max_temp_l: "Máxima",
  hw_min: "La máquina admite desde {v}°",
  hw_max: "La máquina admite hasta {v}°",
  temp_step_l: "Saltos",
  per_mode: "Qué mostrar en cada modo",
  col_temp: "Temperatura",
  col_fan: "Velocidad",
  window_section: "Ventana",
  show_swing: "Mostrar oscilación",
  show_swing_sub: "Solo si tu máquina la tiene",
  no_swing: "Esta máquina no tiene oscilación",
  climate_entity: "Climatizador",
  other_climates: "Otros climatizadores",
  reset_rules: "Volver a los valores automáticos",
  search_card_types: "Buscar tipo de tarjeta",
  available: "Disponibles",
  type_light: "Luz",
  type_light_desc: "Luces y grupos de luces",
  type_alarm: "Alarma",
  type_alarm_desc: "Alarmo u otra alarma",
  type_charger_desc: "Bloquear y ver la carga",
  type_climate: "Clima",
  type_cover: "Persiana",
  type_sensor: "Sensor",
  alarm_missing: "Alarmo no está instalado",
  general: "General",
  ch_device: "Dispositivo",
  name_label: "Nombre",
  choose: "Elegir",
  light_entity: "Luz",
  ch_lock_entity: "Interruptor de bloqueo",
  pick_device: "Elige un dispositivo",
  pick_alarm: "Elige la alarma",
  alarm_no_settings: "La alarma no necesita más ajustes: los modos activos y el código se leen de Alarmo.",
  remove_card: "Quitar tarjeta",
  remove_card_q: "¿Quitar esta tarjeta del inicio?",
  add: "Añadir",
  save: "Guardar",
  lights_word: "luces",
  other_lights: "Otras luces",
  no_chargers_found: "No se ha encontrado ningún cargador. Prueba con «Mostrar todos los dispositivos».",
  show_all_devices: "Mostrar todos los dispositivos con interruptor",
  no_alarms_found: "No hay ninguna alarma en Home Assistant.",
  more_options: "Más opciones",
  panel_error: "No se pudo leer la configuración de Terral Home. ¿Has reiniciado tras actualizar?",
  // Editor
  entity: "Luz o grupo de luces",
  name: "Nombre (opcional)",
  icon: "Icono (opcional)",
  use_light_color: "Teñir la tarjeta con el color real de la luz",
  group_by_area: "Agrupar la lista por habitación",
  group_auto: "Automático",
  group_always: "Siempre",
  group_never: "Nunca",
  // Dashboards and favourites
  dash_settings: "Ajustes del dashboard",
  dash_settings_sub: "Nombre, icono y favoritos",
  dash_new: "Nuevo dashboard",
  dash_new_sub: "Otra entrada en el menú de Home Assistant",
  dash_name_needed: "Ponle un nombre",
  dash_sidebar: "En el menú de Home Assistant",
  dash_name_ph: "Planta alta",
  dash_admin: "Solo administradores",
  dash_admin_sub: "Los demás usuarios no lo ven en el menú",
  dash_sidebar_note: "Cada dashboard es una entrada propia del menú. En cada dispositivo puedes ponerlo como principal desde tu perfil de Home Assistant.",
  dash_delete: "Eliminar dashboard",
  dash_delete_q: "¿Eliminar «{name}»?",
  dash_delete_msg: "Se borran su entrada del menú y todas sus tarjetas. No se puede deshacer.",
  dash_create: "Crear",
  fav_title: "Favoritos",
  fav_strip: "Panel de favoritos",
  fav_strip_sub: "En tablet y PC: arriba, sin título, a todo el ancho",
  fav_rows: "Altura",
  fav_rows_sub: "1 fila: tarjetas 1/1 · 2 filas: 1/1, 2/1 y 2/2",
  fav_note: "Los favoritos son las tarjetas sin apartado. Si no caben, se deslizan a los lados. En el móvil se ven todas.",
  fav_drop: "Arrastra aquí tus favoritos",
  // Section quick actions
  section_settings: "Ajustes del apartado",
  quick_actions: "Accesos rápidos",
  quick_lights: "Todas las luces",
  quick_lights_sub: "Luces del apartado: {n}",
  quick_climate: "Clima",
  quick_climate_sub: "Climatizadores del apartado: {n}",
  quick_none: "No hay ninguno en este apartado",
  quick_note: "Salen a la derecha del título: si hay alguno encendido, el botón los apaga todos; si no, los enciende. En modo edición se ocultan.",
  quick_lights_off: "Apagar todas las luces",
  quick_lights_on: "Encender todas las luces",
  quick_climate_off: "Apagar el clima",
  quick_climate_on: "Encender el clima",
  // Robot vacuum
  type_vacuum: "Robot aspirador",
  type_vacuum_desc: "Aspira y/o friega: Roborock u otros",
  vacuum_missing: "No hay ningún robot aspirador en Home Assistant",
  other_vacuums: "Otros robots",
  battery: "Batería",
  vac_cleaning: "Limpiando",
  vac_paused: "En pausa",
  vac_returning: "Volviendo a la base",
  vac_docked: "En la base",
  vac_idle: "En espera",
  vac_error: "Atascado",
  vac_unavailable: "Sin respuesta",
  vac_pause: "Pausar",
  vac_resume: "Reanudar",
  vac_routines: "Rutinas",
  vac_start: "Iniciar limpieza",
  vac_start_clean: "Iniciar limpieza",
  vac_start_rooms: "Limpiar selección ({n})",
  vac_to_base: "A la base",
  vac_locate: "Localizar",
  vac_what: "Qué hacer",
  vac_mode_vacuum: "Aspirar",
  vac_mode_mop: "Fregar",
  vac_mode_both: "Ambos",
  vac_power: "Potencia",
  vac_power_off: "apagada al fregar",
  vac_water: "Agua",
  vac_only_mop: "solo al fregar",
  vac_mop_mode: "Modo de mopa",
  vac_where: "Dónde",
  vac_rooms_next: "para la próxima limpieza",
  vac_whole_home: "Toda la casa",
  vac_docked_note: "Pausa y «a la base» no hacen falta: ya está en la base.",
  vac_cleaning_note: "Ya está limpiando: puedes pausarlo o mandarlo a la base.",
  vac_card_routines: "Rutinas de la tarjeta",
  vac_card_routines_sub: "Elige hasta 3, en el orden en que quieres verlas en la tarjeta 2/2. El icono del robot muestra todas.",
  vac_no_routines: "Este robot no tiene rutinas. Créalas en la app de Roborock o añade un script.",
  vac_scripts: "Scripts",
  vac_entity: "Robot"
}, vo = {
  on: "On",
  off: "Off",
  unavailable: "Not responding",
  not_found: "Entity not found",
  turn_on: "Turn on",
  turn_off: "Turn off",
  close: "Close",
  brightness: "Brightness",
  temperature: "Temperature",
  favorites: "Favourites",
  more_colors: "More colours",
  warm: "Warm",
  neutral: "Neutral",
  day: "Daylight",
  cold: "Cool",
  last_activity: "Last activity",
  lights_in_group: "Lights in group",
  all_on: "Turn all on",
  all_off: "Turn all off",
  more: "more · see all",
  of: "of",
  lit: "on",
  all_lit: "All on",
  lights_off: "lights · off",
  no_color: "no colour",
  just_now: "Just now",
  min_ago: "{n} min ago",
  h_ago: "{n} h ago",
  days_ago: "{n} d ago",
  other_area: "No room",
  add_card: "Add card",
  edit: "Edit",
  delete: "Delete",
  size: "Size",
  resize: "Drag to resize",
  drag: "Drag to move",
  yaml_mode: "This dashboard is in YAML mode: cards can't be moved or resized here.",
  menu: "Menu",
  home_title: "My home",
  add_accessory: "Add accessory",
  search_lights: "Search accessories",
  no_lights: "No accessories to add",
  light_groups: "Light groups",
  group: "Group",
  added: "Added",
  edit_home: "Edit home",
  terral_settings: "Terral Home settings",
  coming_soon: "Coming soon",
  done: "Done",
  new_section: "New section",
  add_section: "Add section",
  delete_section: "Remove section",
  delete_section_q: "Remove “{name}”?",
  delete_section_msg: "It has {n} cards. What should happen to them?",
  keep_cards: "Keep the cards",
  keep_cards_sub: "They move to the section above",
  keep_cards_sub_top: "They move to the top, without a section",
  remove_cards: "Remove them too",
  cancel: "Cancel",
  rename_section: "Rename",
  move_section: "Move section",
  drop_here: "Drag cards here",
  no_section: "Drag cards without a section here",
  by_rooms: "Create sections by room",
  by_rooms_sub: "Each light moves to its room's section",
  by_rooms_msg: "A section is created for each Home Assistant area and every light moves into its own. Lights without an area stay where they are.",
  by_rooms_go: "Create sections",
  alarm: "Alarm",
  alarm_disarmed: "Disarmed",
  alarm_arming: "Arming {mode}",
  alarm_leave: "leave now",
  alarm_armed: "Armed {mode}",
  alarm_since: "since {t}",
  alarm_failed: "Not armed",
  alarm_open: "Open: {name}",
  alarm_open_n: "{n} sensors open",
  alarm_pending: "Entry detected",
  alarm_pending_sub: "Disarm before it goes off",
  alarm_triggered: "Alarm!",
  mode_away: "Away",
  mode_home: "Home",
  mode_night: "Night",
  mode_vacation: "Vacation",
  mode_custom: "Custom",
  arm_mode: "Arm: {mode}",
  arm_anyway: "Arm anyway",
  disarm: "Disarm",
  code_title: "Alarm code",
  code_wrong: "Wrong code",
  code_placeholder: "Code",
  erase: "Delete",
  ok: "OK",
  skip_delay: "Skip the delay",
  open_sensors: "Open sensors",
  bypassed_sensors: "Bypassed sensors",
  changed_by: "Last change",
  arm_options: "Arm",
  security: "Security",
  alarm_entity: "Alarm (alarm_control_panel)",
  charger: "Charger",
  ev_charger: "EV charger",
  ch_none: "No car",
  ch_connected: "Connected",
  ch_ready: "Connected · ready to charge",
  ch_charging: "Charging",
  ch_locked: "Locked",
  ch_locked_car: "Car connected · locked",
  ch_unlocked: "Unlocked",
  lock: "Lock",
  unlock: "Unlock",
  last_session: "Last session",
  this_week: "This week",
  last_hour: "last hour",
  this_charge: "{kwh} this charge · {time}",
  last_7_days: "Last 7 days",
  week_total: "Week",
  recent_charges: "Recent charges",
  charging_now: "CHARGING",
  in_progress: "In progress",
  max_kw: "max {kw}",
  no_history: "No charges in the last 7 days",
  history_unavailable: "Couldn't read the history",
  settings: "Settings",
  back: "Back",
  ch_lock_section: "Charger lock",
  ch_entity: "Entity",
  ch_invert: "Invert",
  ch_invert_sub: "Swaps what {a} and {b} mean",
  ch_explain: "With this setup: {a} = {la} · {b} = {lb}. Pressing Lock will set the entity to {press}.",
  ch_data: "Data (optional, detected automatically)",
  ch_status: "Car status",
  ch_power: "Power",
  ch_energy: "Session energy",
  ch_max: "Maximum power (kW)",
  auto: "Automatic",
  none: "None",
  raw_on: "on",
  raw_off: "off",
  raw_locked: "locked",
  raw_unlocked: "unlocked",
  save_local: "These settings are only saved from the Terral Home panel",
  add_charger_other: "Pick another entity for a charger",
  search_entities: "Search entity",
  charger_entity: "Charger switch or lock",
  type_weather: "Weather",
  type_weather_desc: "Met.no or another weather service",
  weather_missing: "No weather service in Home Assistant",
  now: "Now",
  today: "Today",
  max_short: "H",
  min_short: "L",
  humidity: "Humidity",
  wind: "Wind",
  pressure: "Pressure",
  clouds: "Clouds",
  dew_point: "Dew point",
  rain_today: "Rain today",
  next_hours: "Next hours",
  next_days: "Next days",
  card_section: "Card",
  forecast_22: "Forecast on 2/2",
  hours_word: "Hours",
  days_word: "Days",
  animate_fx: "Rain and snow animation",
  show_details: "Current details",
  show_details_sub: "Humidity, wind, pressure, clouds, dew point",
  forecast_days: "Forecast days",
  type_climate_desc: "Air conditioning, heating or heat pump",
  climate_missing: "No climate devices in Home Assistant",
  climate_mode: "Mode",
  climate_fan: "Fan",
  no_temperature: "No temperature",
  climate_off_note: "The unit is off.",
  fan_fixed: "In {mode} the fan speed is fixed.",
  swing: "Swing",
  presets: "Preset",
  min_temp_l: "Minimum",
  max_temp_l: "Maximum",
  hw_min: "The unit allows from {v}°",
  hw_max: "The unit allows up to {v}°",
  temp_step_l: "Steps",
  per_mode: "What to show in each mode",
  col_temp: "Temperature",
  col_fan: "Speed",
  window_section: "Window",
  show_swing: "Show swing",
  show_swing_sub: "Only if your unit has it",
  no_swing: "This unit has no swing",
  climate_entity: "Climate entity",
  other_climates: "Other climate devices",
  reset_rules: "Back to automatic values",
  search_card_types: "Search card type",
  available: "Available",
  type_light: "Light",
  type_light_desc: "Lights and light groups",
  type_alarm: "Alarm",
  type_alarm_desc: "Alarmo or another alarm",
  type_charger_desc: "Lock it and follow the charge",
  type_climate: "Climate",
  type_cover: "Blind",
  type_sensor: "Sensor",
  alarm_missing: "Alarmo is not installed",
  general: "General",
  ch_device: "Device",
  name_label: "Name",
  choose: "Choose",
  light_entity: "Light",
  ch_lock_entity: "Lock switch",
  pick_device: "Choose a device",
  pick_alarm: "Choose the alarm",
  alarm_no_settings: "The alarm needs nothing else: modes and code come from Alarmo.",
  remove_card: "Remove card",
  remove_card_q: "Remove this card from the home?",
  add: "Add",
  save: "Save",
  lights_word: "lights",
  other_lights: "Other lights",
  no_chargers_found: "No charger found. Try “Show all devices”.",
  show_all_devices: "Show all devices with a switch",
  no_alarms_found: "There is no alarm in Home Assistant.",
  more_options: "More options",
  panel_error: "Couldn't read the Terral Home layout. Did you restart after updating?",
  entity: "Light or light group",
  name: "Name (optional)",
  icon: "Icon (optional)",
  use_light_color: "Tint the card with the light's real colour",
  group_by_area: "Group the list by room",
  group_auto: "Automatic",
  group_always: "Always",
  group_never: "Never",
  // Dashboards and favourites
  dash_settings: "Dashboard settings",
  dash_settings_sub: "Name, icon and favourites",
  dash_new: "New dashboard",
  dash_new_sub: "Another entry in Home Assistant's sidebar",
  dash_name_needed: "Give it a name",
  dash_sidebar: "In Home Assistant's sidebar",
  dash_name_ph: "Upstairs",
  dash_admin: "Admins only",
  dash_admin_sub: "Other users don't see it in the sidebar",
  dash_sidebar_note: "Every dashboard is its own sidebar entry. On each device you can make it the main dashboard from your Home Assistant profile.",
  dash_delete: "Delete dashboard",
  dash_delete_q: "Delete “{name}”?",
  dash_delete_msg: "Its sidebar entry and all its cards are deleted. This can't be undone.",
  dash_create: "Create",
  fav_title: "Favourites",
  fav_strip: "Favourites strip",
  fav_strip_sub: "On tablets and computers: on top, no title, full width",
  fav_rows: "Height",
  fav_rows_sub: "1 row: 1/1 cards · 2 rows: 1/1, 2/1 and 2/2",
  fav_note: "Favourites are the cards without a section. If they don't fit, swipe sideways. On phones you see them all.",
  fav_drop: "Drag your favourites here",
  // Section quick actions
  section_settings: "Section settings",
  quick_actions: "Quick actions",
  quick_lights: "All lights",
  quick_lights_sub: "Lights in the section: {n}",
  quick_climate: "Climate",
  quick_climate_sub: "Climate devices in the section: {n}",
  quick_none: "None in this section",
  quick_note: "They show on the right of the title: if any is on, the button turns them all off; otherwise it turns them on. Hidden in move mode.",
  quick_lights_off: "Turn off all lights",
  quick_lights_on: "Turn on all lights",
  quick_climate_off: "Turn off climate",
  quick_climate_on: "Turn on climate",
  // Robot vacuum
  type_vacuum: "Robot vacuum",
  type_vacuum_desc: "Vacuums and/or mops: Roborock or others",
  vacuum_missing: "No robot vacuum in Home Assistant",
  other_vacuums: "Other robots",
  battery: "Battery",
  vac_cleaning: "Cleaning",
  vac_paused: "Paused",
  vac_returning: "Returning to the dock",
  vac_docked: "Docked",
  vac_idle: "Idle",
  vac_error: "Stuck",
  vac_unavailable: "Not responding",
  vac_pause: "Pause",
  vac_resume: "Resume",
  vac_routines: "Routines",
  vac_start: "Start cleaning",
  vac_start_clean: "Start cleaning",
  vac_start_rooms: "Clean selection ({n})",
  vac_to_base: "To the dock",
  vac_locate: "Locate",
  vac_what: "What to do",
  vac_mode_vacuum: "Vacuum",
  vac_mode_mop: "Mop",
  vac_mode_both: "Both",
  vac_power: "Suction",
  vac_power_off: "off while mopping",
  vac_water: "Water",
  vac_only_mop: "only when mopping",
  vac_mop_mode: "Mop mode",
  vac_where: "Where",
  vac_rooms_next: "for the next clean",
  vac_whole_home: "Whole home",
  vac_docked_note: `Pause and "to the dock" aren't needed: it's already docked.`,
  vac_cleaning_note: "It's already cleaning: you can pause it or send it to the dock.",
  vac_card_routines: "Routines on the card",
  vac_card_routines_sub: "Pick up to 3, in the order you want them on the 2/2 card. The robot icon shows them all.",
  vac_no_routines: "This robot has no routines. Create them in the Roborock app or add a script.",
  vac_scripts: "Scripts",
  vac_entity: "Robot"
};
function j(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function r(t, e, s) {
  let i = (j(t) === "es" ? xo : vo)[e] ?? e;
  if (s) for (const [n, a] of Object.entries(s)) i = i.replace(`{${n}}`, String(a));
  return i;
}
function On(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return r(t, "just_now");
  if (s < 60) return r(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? r(t, "h_ago", { n: i }) : r(t, "days_ago", { n: Math.round(i / 24) });
}
const yo = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", W = (t, e = 24) => v`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${yo} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, jn = (t = 24) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, bs = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, Pn = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, ts = (t, e = 16) => v`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, wo = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, pe = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, $o = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, ko = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, Xi = (t = 16) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, Nn = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, Ve = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, Z = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, So = (t = 26) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, Co = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, k = (t, e, s = 2) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Ln = v`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, xs = (t = 24) => k(t, Ln), In = (t = 24) => k(t, v`${Ln}<path d="M9 12l2 2 4-4"></path>`), Us = (t = 24) => k(t, v`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), Ao = (t = 20) => k(t, v`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), es = (t = 20) => k(t, v`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), Mo = (t = 20) => k(t, v`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), zo = (t = 20) => k(t, v`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), Eo = (t = 20) => k(t, v`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), ke = (t = 20) => k(t, v`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), qt = (t = 20) => k(t, v`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), To = (t = 24) => k(t, v`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), Do = (t = 20) => k(t, v`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`), vs = (t = 24) => k(t, v`<path d="M5 21V5.5A2.5 2.5 0 0 1 7.5 3h5A2.5 2.5 0 0 1 15 5.5V21"></path><path d="M3 21h14"></path><path d="M15 10h1.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8.5L19 6"></path><path d="M10.5 6.5L8.6 10h2.8l-1.9 3.5"></path>`, 1.9), Oo = (t = 18) => k(t, v`<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>`), Ki = (t = 19) => k(t, v`<rect x="3" y="7" width="16" height="10" rx="2.5"></rect><path d="M21 11v2"></path><path d="M7 10.5v3M10.5 10.5v3"></path>`), jo = (t = 19) => k(t, v`<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>`), Po = (t = 20) => k(t, v`<path d="M15 6l-6 6 6 6"></path>`, 2.4), No = (t = 22) => k(t, v`<circle cx="12" cy="12" r="8.5"></circle><path d="M9 16l3-8 3 8M10 13.5h4"></path>`), Lo = (t = 22) => k(t, v`<path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11"></path><path d="M9.5 4L12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"></path>`), Io = (t = 22) => k(t, v`<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-3 4-3 6-1-1-2-2-2.5-3.5C7.5 9.5 5 12 5 15a7 7 0 0 0 7 7z"></path>`), Ho = (t = 22) => k(t, v`<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path><path d="M9.5 15.5l5-5"></path>`), Bs = (t = 22) => k(t, v`<circle cx="12" cy="12" r="1.8"></circle><path d="M12 10.2C11 6 13 3 15.5 4.2S15 9 12 10.2zM13.8 12c4.2-1 7.2 1 6 3.5S15 15 13.8 12zM12 13.8c1 4.2-1 7.2-3.5 6S9 15 12 13.8zM10.2 12c-4.2 1-7.2-1-6-3.5S9 9 10.2 12z"></path>`), Ro = (t = 22) => k(t, v`<path d="M8 20V4M4.5 7.5L8 4l3.5 3.5"></path><path d="M16 4v16M12.5 16.5L16 20l3.5-3.5"></path>`), Se = (t = 22) => k(t, v`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`), mi = (t = 20) => k(t, v`<path d="M6 12h12"></path>`, 2.4), _i = (t = 20) => k(t, v`<path d="M12 6v12M6 12h12"></path>`, 2.4), Ce = (t = 24) => k(t, v`<circle cx="12" cy="12" r="9"></circle><path d="M5.6 8.2a8 8 0 0 1 12.8 0"></path><circle cx="12" cy="12.6" r="2.6"></circle><circle cx="15.6" cy="16.8" r=".6" fill="currentColor"></circle>`, 1.9), Ge = (t = 20) => k(t, v`<path d="M7 4.5v15l12-7.5z" fill="currentColor"></path>`, 1.6), Hn = (t = 20) => k(t, v`<path d="M8 5v14M16 5v14"></path>`, 3), Rn = (t = 20) => k(t, v`<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path><circle cx="12" cy="10" r="2.3"></circle>`), Wn = (t = 14) => k(t, v`<path d="M12 5v9"></path><path d="M12 18.5h.01"></path>`, 3.2), Wo = (t = 18) => k(t, v`<path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8z"></path><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"></path>`), qo = (t = 18) => k(t, v`<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"></path>`), Uo = (t = 18) => k(t, v`<path d="M6 3v7a2 2 0 0 0 2 2v9M8 3v6M10 3v7a2 2 0 0 1-2 2"></path><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"></path>`), Bo = (t = 18) => k(t, v`<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"></path><circle cx="7" cy="11.5" r="1.8"></circle>`), Fo = (t = 18) => k(t, v`<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"></path><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"></path><path d="M6 18v2M18 18v2"></path>`), Yo = (t = 18) => k(t, v`<circle cx="7" cy="10" r="1.6"></circle><circle cx="10.5" cy="6.5" r="1.6"></circle><circle cx="14.5" cy="6.5" r="1.6"></circle><circle cx="18" cy="10" r="1.6"></circle><path d="M12.5 12c2.5 0 5 3.3 5 5.5 0 1.6-1.4 2.5-3 2.1-1.3-.3-2.7-.3-4 0-1.6.4-3-.5-3-2.1 0-2.2 2.5-5.5 5-5.5z"></path>`), Vo = (t, e = !1, s = 16) => k(s, v`<rect x="2.5" y="7" width="16.5" height="10" rx="2.5"></rect><path d="M21.5 10.5v3"></path>
    ${e ? v`<path d="M11.5 8.6L8.6 12.4h3.2l-1.3 3" stroke-width="1.8"></path>` : [0, 1, 2, 3].slice(0, t).map((i) => v`<rect x=${4.6 + i * 3.4} y="9.2" width="2.3" height="5.6" rx=".6" fill="currentColor" stroke="none"></rect>`)}`);
var Go = Object.defineProperty, Xo = Object.getOwnPropertyDescriptor, G = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Xo(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Go(e, s, n), n;
};
let R = class extends N {
  constructor() {
    super(...arguments), this.value = 0, this.min = 0, this.max = 100, this.vertical = !1, this.mode = "fill", this.label = "", this.suffix = "%", this.showValue = !1, this._startX = 0, this._startY = 0, this._active = !1, this._down = (t) => {
      t.stopPropagation(), this._startX = t.clientX, this._startY = t.clientY, this._active = this.vertical, this._active && (this.setPointerCapture(t.pointerId), this._drag = this._valueAt(t)), this.addEventListener("pointermove", this._move), this.addEventListener("pointerup", this._up), this.addEventListener("pointercancel", this._cancel);
    }, this._move = (t) => {
      if (!this._active) {
        const e = Math.abs(t.clientX - this._startX), s = Math.abs(t.clientY - this._startY);
        if (s > 8 && s > e) return this._cancel();
        if (e < 6) return;
        this._active = !0, this.setPointerCapture(t.pointerId);
      }
      this._drag = this._valueAt(t), this.dispatchEvent(new CustomEvent("value-input", { detail: { value: this._drag } }));
    }, this._up = (t) => {
      const s = !this._active ? this._valueAt(t) : this._drag;
      this._cleanup(), s != null && this._commit(s);
    }, this._cancel = () => {
      this._cleanup(), this._drag = void 0;
    }, this._key = (t) => {
      const e = (this.max - this.min) / 20, s = ["ArrowUp", "ArrowRight"].includes(t.key), i = ["ArrowDown", "ArrowLeft"].includes(t.key);
      if (!s && !i) return;
      t.preventDefault();
      const n = Math.max(this.min, Math.min(this.max, Math.round(this.value + (s ? e : -e))));
      this._commit(n);
    };
  }
  get _shown() {
    return this._drag ?? this.value;
  }
  _pct(t) {
    return (t - this.min) / (this.max - this.min) * 100;
  }
  _valueAt(t) {
    const e = this.getBoundingClientRect(), s = this.vertical ? 1 - (t.clientY - e.top) / e.height : (t.clientX - e.left) / e.width, i = this.min + Math.max(0, Math.min(1, s)) * (this.max - this.min);
    return Math.round(i);
  }
  connectedCallback() {
    super.connectedCallback(), this.tabIndex = 0, this.setAttribute("role", "slider"), this.addEventListener("pointerdown", this._down), this.addEventListener("keydown", this._key), this.addEventListener("click", (t) => t.stopPropagation());
  }
  updated() {
    this.setAttribute("aria-label", this.label), this.setAttribute("aria-valuemin", String(this.min)), this.setAttribute("aria-valuemax", String(this.max)), this.setAttribute("aria-valuenow", String(this._shown)), this.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
  }
  _cleanup() {
    this._active = !1, this.removeEventListener("pointermove", this._move), this.removeEventListener("pointerup", this._up), this.removeEventListener("pointercancel", this._cancel);
  }
  _commit(t) {
    this._drag = void 0, this.value = t, this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: t } }));
  }
  render() {
    const t = this._pct(this._shown), e = this.mode === "fill";
    return d`
      ${e ? d`<div class="fill" style=${this.vertical ? `height:${t}%` : `width:${t}%`}></div>` : d`<div class="thumb" style=${this.vertical ? `bottom:${t}%` : `left:${t}%`}></div>`}
      <div class="label">
        <slot></slot>
        ${this.showValue ? d`<span>${this._shown}${this.suffix ? d`&nbsp;${this.suffix}` : f}</span>` : f}
      </div>
    `;
  }
};
R.styles = M`
    :host {
      display: block;
      position: relative;
      border-radius: var(--terral-slider-radius, 22px);
      background: var(--terral-slider-track, rgba(0, 0, 0, 0.12));
      overflow: hidden;
      cursor: pointer;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
      height: var(--terral-slider-size, 44px);
      outline: none;
    }
    :host([vertical]) {
      touch-action: none;
      height: auto;
      width: var(--terral-slider-size, 130px);
      border-radius: var(--terral-slider-radius, 38px);
    }
    :host(:focus-visible) {
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.7);
    }
    .fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
      background: var(--terral-slider-fill, #ffc04d);
    }
    :host([vertical]) .fill {
      top: auto;
      right: 0;
      border-radius: 0;
    }
    .thumb {
      position: absolute;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }
    :host(:not([vertical])) .thumb {
      top: 6px;
      bottom: 6px;
      width: 8px;
      margin-left: -4px;
    }
    :host([vertical]) .thumb {
      left: 12px;
      right: 12px;
      height: 8px;
      margin-bottom: -4px;
    }
    .label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      pointer-events: none;
      color: var(--terral-slider-text, inherit);
      font-weight: 700;
      font-size: 14px;
    }
    :host([vertical]) .label {
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 0 20px;
      font-size: 22px;
    }
  `;
G([
  y({ type: Number })
], R.prototype, "value", 2);
G([
  y({ type: Number })
], R.prototype, "min", 2);
G([
  y({ type: Number })
], R.prototype, "max", 2);
G([
  y({ type: Boolean, reflect: !0 })
], R.prototype, "vertical", 2);
G([
  y()
], R.prototype, "mode", 2);
G([
  y()
], R.prototype, "label", 2);
G([
  y()
], R.prototype, "suffix", 2);
G([
  y({ type: Boolean, attribute: "show-value" })
], R.prototype, "showValue", 2);
G([
  x()
], R.prototype, "_drag", 2);
R = G([
  z("terral-slider")
], R);
const qn = ["hs", "rgb", "rgbw", "rgbww", "xy"], bi = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], Fs = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function Un(t) {
  return t.attributes.supported_color_modes ?? [];
}
function Xe(t) {
  const e = Un(t);
  return e.some((s) => qn.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Ko(t) {
  return Un(t).includes("color_temp");
}
function E(t) {
  return t?.state === "on";
}
function wt(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function vt(t) {
  const e = t.attributes.brightness;
  if (!(!E(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function K(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function Qi(t) {
  return K(t).length > 0;
}
function Ae(t) {
  return t.attributes.color_temp_kelvin;
}
function Ut(t) {
  if (!E(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !qn.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const Zi = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, re = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), le = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, Qo = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, Zo = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function Bn(t, e) {
  if (!e) return Zi;
  const s = Ut(t);
  if (!s) {
    const a = Ae(t);
    return a && t.attributes.color_mode === "color_temp" && a >= 4500 ? Qo : Zi;
  }
  const i = [255, 255, 255], n = Zo(s) > 0.75 ? re(s, [40, 50, 80], 0.45) : s;
  return {
    bg: le(re(s, i, 0.84), 0.95),
    fg: le(re(s, [10, 10, 20], 0.82)),
    fg2: le(re(s, [20, 10, 30], 0.72)),
    accent: le(n),
    fill: le(re(n, i, 0.35))
  };
}
function _e(t, e) {
  return t.callService("light", E(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function Ms(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function Ys(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function ss(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, n = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(n, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function Ji(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function Jo(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function F(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function Vs(t, e) {
  let s;
  for (const i of bi) {
    const n = i.rgb.reduce((a, o, l) => a + (o - t[l]) ** 2, 0);
    (!s || n < s.d) && (s = { d: n, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function Ke(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function tn(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const n = getComputedStyle(i).overflowY;
    if ((n === "auto" || n === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function Fn(t) {
  let e = 0;
  const s = (a) => {
    e = a.touches[0]?.clientY ?? 0;
  }, i = (a) => {
    if (!a.cancelable) return;
    const o = a.touches[0]?.clientY ?? e;
    tn(a.composedPath(), t, o - e) || a.preventDefault();
  }, n = (a) => {
    tn(a.composedPath(), t, -a.deltaY) || a.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", n, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", n);
  };
}
var tr = Object.defineProperty, er = Object.getOwnPropertyDescriptor, tt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? er(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && tr(e, s, n), n;
};
let Bt;
function sr(t, e) {
  Bt?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), Bt = s;
}
function ir(t) {
  Bt?.isConnected && (Bt.hass = t);
}
let q = class extends N {
  constructor() {
    super(...arguments), this._stack = [], this._expanded = !1, this._closing = !1, this._wide = window.matchMedia("(min-width: 600px)").matches, this._openAreas = /* @__PURE__ */ new Set(), this._mq = window.matchMedia("(min-width: 600px)"), this._onMq = (t) => this._wide = t.matches, this._onKey = (t) => {
      t.key === "Escape" && this.close();
    }, this._grabDown = (t) => {
      this._grabY = t.clientY, t.currentTarget.setPointerCapture(t.pointerId);
    }, this._grabUp = (t) => {
      if (this._grabY == null) return;
      const e = t.clientY - this._grabY;
      this._grabY = void 0, e < -40 ? this._expanded = !0 : e > 80 ? this._expanded ? this._expanded = !1 : this.close() : Math.abs(e) < 6 && (this._expanded = !this._expanded);
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = Fn(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), Bt === this && (Bt = void 0);
  }
  close() {
    this._closing || (this._closing = !0, setTimeout(() => this.remove(), 180));
  }
  get _entityId() {
    return this._stack[this._stack.length - 1] ?? this.opts.entity;
  }
  _name(t) {
    return !this._stack.length && this.opts.name ? this.opts.name : this.hass.formatEntityName?.(t) ?? t.attributes.friendly_name ?? t.entity_id;
  }
  _stateText(t) {
    if (wt(t)) return r(this.hass, "unavailable");
    if (!E(t)) return r(this.hass, "off");
    const e = [], s = K(t);
    if (s.length) {
      const o = s.filter((l) => E(this.hass.states[l])).length;
      e.push(`${o} ${r(this.hass, "of")} ${s.length} ${r(this.hass, "lit")}`);
    }
    const i = vt(t);
    i != null && e.push(`${i} %`);
    const n = Ut(t), a = Ae(t);
    if (n) {
      const o = Vs(n, j(this.hass));
      o && e.push(o);
    } else a && t.attributes.color_mode === "color_temp" && e.push(`${a} K`);
    return e.length || e.push(r(this.hass, "on")), e.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this.hass.states[this._entityId], e = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return d`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${t ? this._name(t) : this._entityId}>
        ${this._wide ? f : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${t ? this._content(t) : d`<p class="empty">${r(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(t) {
    const e = E(t), s = Bn(t, this.opts.useLightColor !== !1), i = K(t), n = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, a = this._controls(t), o = i.length ? this._memberList(t, i) : f, l = this._info(t);
    return d`
      <div class="body" style=${n}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${ts(!1, 18)}
              </button>` : f}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            ?disabled=${wt(t)}
            @click=${() => _e(this.hass, t)}
          >
            ${W(e, this._wide ? 28 : 24)}
            ${i.length && e ? d`<span class="badge">${i.filter((c) => E(this.hass.states[c])).length}</span>` : f}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${Ke(this.hass, t.entity_id) ? ` · ${Ke(this.hass, t.entity_id)}` : ""}</span>
          </div>
          ${this.opts.onSettings ? d`<button class="round gear" aria-label=${r(this.hass, "settings")} @click=${() => {
      const c = this.opts.onSettings;
      this.close(), c();
    }}>${Z(this._wide ? 22 : 18)}</button>` : f}
          <button class="round close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>
            ${bs(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? d`<div class="cols">
              <div class="left">${a.main}</div>
              <div class="right">${a.side}${o}${i.length ? f : l}</div>
            </div>` : d`<div class="stack">
              <div class="main-row">${a.main}${a.beside ?? f}</div>
              ${a.side}${o}${i.length ? f : l}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = Xe(t), s = E(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            @click=${() => _e(this.hass, t)}>
            <span>${jn(36)}</span>
          </button>`,
        side: f
      };
    const n = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${vt(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(u) => Ys(this.hass, i, u.detail.value)}
    >${Pn(28)}</terral-slider>`, a = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (u) => d`<button class="chip" @click=${() => Ys(this.hass, i, u)}>${u} %</button>`
    )}
    </div>`, o = d`<div class="chips">
      ${Fs.map(
      (u) => d`<button class="chip tinted" style="background:${u.css}" @click=${() => ss(this.hass, t, u.kelvin)}>
          ${r(this.hass, u.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: n, side: a };
    if (e === "temperature") {
      const u = t.attributes.min_color_temp_kelvin ?? 2e3, m = t.attributes.max_color_temp_kelvin ?? 6500, b = d`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${u}
        .max=${m}
        .value=${Ae(t) ?? Math.round((u + m) / 2)}
        .label=${r(this.hass, "temperature")}
        @value-changed=${(g) => ss(this.hass, t, g.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${n}${b}</div>`, side: o } : { main: d`<div class="pair">${n}${b}</div>`, side: o };
    }
    const l = j(this.hass), c = (this.opts.favorites?.length ? this.opts.favorites : bi.map((u) => ({ name: u.name[l], rgb: u.rgb }))).slice(0, 6), h = Ut(t), p = d`
      <p class="lb">${r(this.hass, "favorites")}</p>
      <div class="swatches">
        ${c.map(
      (u) => d`<button
            class="sw ${h && F(h) === F(u.rgb) ? "sel" : ""}"
            style="background:${F(u.rgb)}"
            aria-label=${u.name ?? F(u.rgb)}
            @click=${() => Ji(this.hass, i, u.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${r(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${h ? F(h) : "#ffffff"} @change=${(u) => Ji(this.hass, i, Jo(u.target.value))} />
      ${Ko(t) ? d`<p class="lb">${r(this.hass, "temperature")}</p>${o}` : f}
    `;
    return this._wide ? { main: n, side: p } : { main: n, side: f, beside: d`<div class="beside">${p}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const c of e) {
      const h = Ke(this.hass, c) ?? r(this.hass, "other_area");
      i.set(h, [...i.get(h) ?? [], c]);
    }
    const n = s === "always" || s === "auto" && e.length > 8 && i.size > 1, a = e.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => Ms(this.hass, t.entity_id, !0)}>${r(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => Ms(this.hass, t.entity_id, !1)}>${r(this.hass, "all_off")}</button>
        </div>` : f, o = (c) => {
      const h = this.hass.states[c], p = E(h), u = h ? this.hass.formatEntityName?.(h) ?? h.attributes.friendly_name ?? c : c;
      return d`<div class="mr">
        <button class="mi ${p ? "on" : ""}" ?disabled=${wt(h)}
          aria-label="${p ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${u}"
          @click=${() => h && _e(this.hass, h)}>${W(p, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, c]}>
          <span>${u}</span><small>${h ? this._stateText(h) : r(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, l = (c) => [...c].sort((h, p) => Number(E(this.hass.states[p])) - Number(E(this.hass.states[h])));
    return d`
      ${a}
      <p class="lb">${r(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${n ? [...i.entries()].map(([c, h]) => {
      const p = this._openAreas.has(c), u = h.filter((m) => E(this.hass.states[m])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${u ? "on" : ""}" aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${c}"
                    @click=${() => Ms(this.hass, h, u === 0)}>${W(u > 0, 18)}</button>
                  <button class="mt" aria-expanded=${p} @click=${() => {
        const m = new Set(this._openAreas);
        p ? m.delete(c) : m.add(c), this._openAreas = m;
      }}>
                    <span>${c} <small>${u} ${r(this.hass, "of")} ${h.length}</small></span>${ts(p)}
                  </button>
                </div>
                ${p ? d`<div class="inner">${h.map(o)}</div>` : f}
              </div>`;
    }) : d`<div class="box">${l(e).map(o)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return d`<div class="info">
      <div><span>${r(this.hass, "last_activity")}</span><span>${On(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
q.styles = M`
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
tt([
  y({ attribute: !1 })
], q.prototype, "hass", 2);
tt([
  y({ attribute: !1 })
], q.prototype, "opts", 2);
tt([
  x()
], q.prototype, "_stack", 2);
tt([
  x()
], q.prototype, "_expanded", 2);
tt([
  x()
], q.prototype, "_closing", 2);
tt([
  x()
], q.prototype, "_wide", 2);
tt([
  x()
], q.prototype, "_openAreas", 2);
tt([
  bo("input[type=color]")
], q.prototype, "_picker", 2);
q = tt([
  z("terral-light-dialog")
], q);
var nr = Object.defineProperty, xi = (t, e, s, i) => {
  for (var n = void 0, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = o(e, s, n) || n);
  return n && nr(e, s, n), n;
};
const Ni = class Ni extends N {
  constructor() {
    super(...arguments), this._wide = window.matchMedia("(min-width: 600px)").matches, this._closing = !1, this._mq = window.matchMedia("(min-width: 600px)"), this._onMq = (e) => this._wide = e.matches, this._onKey = (e) => {
      e.key === "Escape" && this.close();
    }, this._grabDown = (e) => {
      this._grabY = e.clientY, e.currentTarget.setPointerCapture(e.pointerId);
    }, this._grabUp = (e) => {
      if (this._grabY == null) return;
      const s = e.clientY - this._grabY;
      this._grabY = void 0, s > 60 && this.close();
    };
  }
  /** Optional buttons before the title (e.g. back) and before the close button (e.g. settings). */
  renderHeaderStart() {
    return f;
  }
  renderHeaderEnd() {
    return f;
  }
  connectedCallback() {
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = Fn(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.();
  }
  close() {
    this._closing || (this._closing = !0, setTimeout(() => this.remove(), 180));
  }
  render() {
    const e = `${this._wide ? "modal" : "sheet"} ${this._closing ? "closing" : ""}`;
    return d`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${this.heading}>
        ${this._wide ? f : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        <header>
          ${this.renderHeaderStart()}
          <h2>${this.heading}</h2>
          ${this.renderHeaderEnd()}
          <button class="close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>${bs(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
Ni.styles = M`
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
      -webkit-tap-highlight-color: transparent;
    }
    button:disabled {
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
      background: rgba(36, 38, 66, 0.78);
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
      max-height: calc(100% - 64px - env(safe-area-inset-top));
      border-radius: 34px 34px 0 0;
      border-width: 1px 0 0;
      padding: 0 20px calc(20px + env(safe-area-inset-bottom));
      animation: up 0.22s ease-out;
      transition: transform 0.18s ease;
    }
    .sheet.closing {
      transform: translateY(100%);
    }
    .modal {
      left: 50%;
      top: 50%;
      width: min(560px, calc(100% - 48px));
      max-height: min(680px, calc(100% - 48px));
      transform: translate(-50%, -50%);
      border-radius: 34px;
      padding: 22px 26px 26px;
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
      touch-action: none;
    }
    .grab span {
      width: 40px;
      height: 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.35);
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: none;
      margin-bottom: 14px;
    }
    h2 {
      flex: 1;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }
    .close {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .modal .close,
    .modal .hbtn {
      width: 52px;
      height: 52px;
    }
    .hbtn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .content {
      min-height: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .scroll {
      overflow-y: auto;
      overscroll-behavior: contain;
      min-height: 0;
      flex: 1;
      -webkit-overflow-scrolling: touch;
    }
  `;
let S = Ni;
xi([
  y({ attribute: !1 })
], S.prototype, "hass");
xi([
  x()
], S.prototype, "_wide");
xi([
  x()
], S.prototype, "_closing");
const zs = ["switch", "lock", "input_boolean"], be = (t) => t.split(".")[0], St = (t) => be(t) === "lock";
function ar(t, e = !1) {
  const s = St(t.entity_id) ? t.state === "locked" : t.state === "on", i = St(t.entity_id);
  return s === i !== e;
}
function Gs(t, e, s, i = !1) {
  const n = e.entity_id, a = St(n) ? !i : i, o = s ? a : !a;
  return St(n) ? t.callService("lock", o ? "lock" : "unlock", {}, { entity_id: n }) : t.callService(be(n), o ? "turn_on" : "turn_off", {}, { entity_id: n });
}
const or = (t, e = !1) => (St(t) ? !e : e) ? "active" : "inactive", vi = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function yi(t, e) {
  const s = e ? t.states[e] : void 0;
  if (vi(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kW");
  return n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
function Yn(t, e) {
  const s = e ? t.states[e] : void 0;
  if (vi(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kWh");
  return n === "Wh" ? i / 1e3 : n === "MWh" ? i * 1e3 : i;
}
const Lt = 0.05;
function rr(t, e) {
  const s = yi(t, e.power), i = e.status ? t.states[e.status] : void 0;
  if (i && !vi(i)) {
    if (i.entity_id.startsWith("binary_sensor."))
      return i.state !== "on" ? "none" : s != null && s > Lt ? "charging" : "connected";
    const n = String(i.state).toLowerCase();
    if (/discharg/.test(n)) return "connected";
    if (/charging|cargando|en carga/.test(n)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(n))
      return s != null && s > Lt ? "charging" : "none";
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(n))
      return s != null && s > Lt ? "charging" : "connected";
  }
  return s != null && s > Lt ? "charging" : "unknown";
}
function Vn(t, e) {
  const s = t.entities?.[e]?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => i !== e && n.device_id === s).map(([i]) => i) : [];
}
const wi = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), Gn = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(wi(t, e)), Xn = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(wi(t, e)), Kn = (t, e) => {
  const s = t.states[e];
  return s ? e.startsWith("binary_sensor.") ? ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(e) : e.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state)) : !1;
};
function $i(t, e) {
  const s = Vn(t, e.entity), i = (a, o) => {
    const l = s.filter((c) => t.states[c] && a(c));
    return o && l.find((c) => o.test(c)) || l[0];
  }, n = (a, o) => a === "none" ? void 0 : a || o();
  return {
    status: n(e.status_entity, () => i((a) => Kn(t, a), /status|estado/i)),
    power: n(e.power_entity, () => i((a) => Gn(t, a), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: n(e.energy_entity, () => i((a) => Xn(t, a), /added|session|sesion|sesión|charge|carga/i))
  };
}
function en(t, e) {
  if (St(e)) return !1;
  const s = String(t.states[e]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(e + " " + s);
}
async function Qn(t, e, s) {
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  }), n = wi(t, e), a = n === "W" ? 1 / 1e3 : n === "MW" ? 1e3 : 1;
  return (i[e] ?? []).map((o) => [o.lu * 1e3, Number(o.s) * a]).filter(([, o]) => Number.isFinite(o));
}
function Zn(t, e = Date.now()) {
  const s = [];
  let i;
  for (let n = 0; n < t.length; n++) {
    const [a, o] = t[n], l = n + 1 < t.length ? t[n + 1][0] : e, c = Math.max(0, l - a) / 36e5;
    o > Lt && (i && a - i.end > 15 * 6e4 && (s.push(i), i = void 0), i ??= { start: a, end: a, kwh: 0, maxKw: 0, live: !1 }, i.kwh += o * c, i.end = l, i.maxKw = Math.max(i.maxKw, o));
  }
  return i && (i.live = t.length > 0 && t[t.length - 1][1] > Lt, s.push(i)), s.filter((n) => n.kwh >= 0.05 || n.live);
}
function Jn(t, e = 7, s = /* @__PURE__ */ new Date()) {
  const i = [];
  for (let n = e - 1; n >= 0; n--) {
    const a = new Date(s.getFullYear(), s.getMonth(), s.getDate() - n);
    i.push({ day: a, kwh: 0 });
  }
  for (const n of t) {
    const a = new Date(n.start), o = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime(), l = i.find((c) => c.day.getTime() === o);
    l && (l.kwh += n.kwh);
  }
  return i;
}
const Y = (t, e, s = 1) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Xs = (t) => {
  const e = Math.max(0, Math.round(t / 6e4));
  return `${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")} min`;
};
var lr = Object.defineProperty, cr = Object.getOwnPropertyDescriptor, ta = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? cr(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && lr(e, s, n), n;
};
let is = class extends S {
  constructor() {
    super(...arguments), this.options = { heading: "", actions: [] };
  }
  get heading() {
    return this.options.heading;
  }
  renderContent() {
    return d`
      ${this.options.message ? d`<p class="msg">${this.options.message}</p>` : ""}
      <div class="list">
        ${this.options.actions.map(
      (t) => d`<button class="row ${t.danger ? "danger" : ""}" @click=${() => {
        t.run(), this.close();
      }}><span>${t.label}</span>${t.sub ? d`<small>${t.sub}</small>` : ""}</button>`
    )}
      </div>
      <button class="cancel" @click=${() => this.close()}>${r(this.hass, "cancel")}</button>
    `;
  }
};
is.styles = [
  S.styles,
  M`
      .msg {
        margin: -4px 0 4px;
        font-size: 15px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.8);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .row {
        width: 100%;
        min-height: 54px;
        padding: 10px 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 16px;
        font-weight: 600;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .row small {
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.65);
      }
      .row:active {
        background: rgba(255, 255, 255, 0.08);
      }
      .danger {
        color: #ff8a80;
      }
      .cancel {
        height: 52px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.12);
        text-align: center;
        font-size: 16px;
        font-weight: 600;
      }
    `
];
ta([
  y({ attribute: !1 })
], is.prototype, "options", 2);
is = ta([
  z("terral-confirm-sheet")
], is);
function ns(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const sn = ["auto", "heat_cool", "cool", "heat", "dry", "fan_only"], dr = {
  auto: { t: !0, f: !0 },
  heat_cool: { t: !0, f: !1 },
  cool: { t: !0, f: !0 },
  heat: { t: !0, f: !0 },
  dry: { t: !1, f: !1 },
  fan_only: { t: !1, f: !0 }
}, hr = {
  cool: [70, 150, 255],
  heat: [255, 140, 60],
  auto: [52, 199, 123],
  heat_cool: [52, 199, 123],
  dry: [40, 190, 200],
  fan_only: [140, 160, 200]
}, ys = { TARGET: 1, FAN: 8, SWING: 32, TURN_ON: 256 }, ws = (t, e) => (Number(t.attributes.supported_features ?? 0) & e) !== 0, P = (t) => t.state === "off" || t.state === "unavailable" || t.state === "unknown", It = (t) => t.state === "unavailable" || t.state === "unknown";
function lt(t) {
  const e = (t.attributes.hvac_modes ?? []).filter((i) => i !== "off"), s = (i) => sn.includes(i) ? sn.indexOf(i) : 99;
  return [...e].sort((i, n) => s(i) - s(n));
}
const Me = (t) => ws(t, ys.FAN) || t.attributes.fan_modes ? t.attributes.fan_modes ?? [] : [], pr = (t) => (t.attributes.preset_modes ?? []).filter((e) => e !== "none"), ea = (t) => ws(t, ys.SWING) || (t.attributes.swing_modes?.length ?? 0) > 0;
function sa(t, e = t.state) {
  return e === "heat_cool" || t.attributes.target_temp_low != null && t.attributes.target_temp_high != null && t.attributes.temperature == null && e !== "off";
}
function as(t, e) {
  return t.mode_rules?.[e] ?? dr[e] ?? { t: !0, f: !0 };
}
function Ht(t, e) {
  return P(t) || !as(e, t.state).t ? !1 : sa(t) ? t.attributes.target_temp_low != null : t.attributes.temperature != null || ws(t, ys.TARGET);
}
function ia(t, e) {
  return !P(t) && as(e, t.state).f && Me(t).length > 0;
}
function xe(t, e) {
  const s = Number(t.attributes.min_temp ?? 7), i = Number(t.attributes.max_temp ?? 35), n = Math.max(s, e.min_temp ?? s), a = Math.min(i, e.max_temp ?? i), o = e.temp_step ?? Number(t.attributes.target_temp_step ?? (t.attributes.temperature_unit === "°F" ? 1 : 0.5));
  return { min: n, max: Math.max(n + o, a), step: o, hwMin: s, hwMax: i };
}
const $t = (t, e) => Math.min(e.max, Math.max(e.min, Math.round(t / e.step) * e.step)), ve = (t) => t.attributes.current_temperature != null ? Number(t.attributes.current_temperature) : null, ur = (t) => t.attributes.current_humidity != null ? Number(t.attributes.current_humidity) : null, na = /* @__PURE__ */ new Map(), aa = (t) => {
  P(t) || na.set(t.entity_id, t.state);
};
function ki(t, e) {
  const s = na.get(e.entity_id);
  if (s && lt(e).includes(s)) return ze(t, e, s);
  if (ws(e, ys.TURN_ON)) return t.callService("climate", "turn_on", {}, { entity_id: e.entity_id });
  const i = lt(e).includes("cool") ? "cool" : lt(e)[0];
  return i ? ze(t, e, i) : Promise.resolve();
}
function Si(t, e) {
  return aa(e), e.attributes.hvac_modes?.includes("off") ? ze(t, e, "off") : t.callService("climate", "turn_off", {}, { entity_id: e.entity_id });
}
const ze = (t, e, s) => t.callService("climate", "set_hvac_mode", { hvac_mode: s }, { entity_id: e.entity_id }), oa = (t, e, s) => t.callService("climate", "set_fan_mode", { fan_mode: s }, { entity_id: e.entity_id }), fr = (t, e, s) => t.callService("climate", "set_preset_mode", { preset_mode: s }, { entity_id: e.entity_id });
function gr(t, e, s) {
  const i = e.attributes.swing_modes ?? ["on", "off"], n = s ? i.find((a) => a !== "off") ?? "on" : i.includes("off") ? "off" : i[0];
  return t.callService("climate", "set_swing_mode", { swing_mode: n }, { entity_id: e.entity_id });
}
function ra(t, e, s) {
  const i = typeof s == "number" ? { temperature: s } : { target_temp_low: s.low, target_temp_high: s.high };
  return t.callService("climate", "set_temperature", i, { entity_id: e.entity_id });
}
const la = {
  auto: "Auto",
  heat_cool: "Frío/calor",
  cool: "Frío",
  heat: "Calor",
  dry: "Deshumidificar",
  fan_only: "Solo ventilador",
  low: "Bajo",
  medium: "Medio",
  mid: "Medio",
  high: "Alto",
  middle: "Medio",
  quiet: "Silencio",
  silent: "Silencio",
  turbo: "Turbo",
  focus: "Enfoque",
  diffuse: "Difuso",
  on: "Sí",
  off: "No",
  eco: "Eco",
  comfort: "Confort",
  away: "Ausente",
  home: "En casa",
  sleep: "Noche",
  boost: "Turbo",
  activity: "Actividad"
}, mr = {
  auto: "Auto",
  heat_cool: "Heat/cool",
  cool: "Cool",
  heat: "Heat",
  dry: "Dry",
  fan_only: "Fan only"
}, _r = { cool: "Enfriando", heat: "Calentando", dry: "Deshumidificando", fan_only: "Ventilando", auto: "Automático", heat_cool: "Manteniendo" }, br = { cool: "Cooling", heat: "Heating", dry: "Drying", fan_only: "Fan", auto: "Auto", heat_cool: "Keeping" }, ca = (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " "), V = (t, e) => (t === "es" ? la[e] : mr[e]) ?? ca(e), Ks = (t, e) => (t === "es" ? la[e.toLowerCase()] : void 0) ?? ca(e), Qs = (t, e) => (t === "es" ? _r[e] : br[e]) ?? V(t, e);
function xr(t, e) {
  if (!e) return "";
  if (/auto/i.test(e)) return "A";
  const i = t.filter((n) => !/auto/i.test(n)).indexOf(e);
  return i >= 0 ? String(i + 1) : e.charAt(0).toUpperCase();
}
function Rt(t, e = 22) {
  switch (t) {
    case "auto":
      return No(e);
    case "cool":
      return Lo(e);
    case "heat":
      return Io(e);
    case "dry":
      return Ho(e);
    case "fan_only":
      return Bs(e);
    case "heat_cool":
      return Ro(e);
    case "off":
      return jn(e);
    default:
      return Se(e);
  }
}
const He = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), jt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function da(t) {
  if (P(t)) return "";
  const e = hr[t.state] ?? [140, 160, 200];
  return `--bg:${jt(He(e, [255, 255, 255], 0.84), 0.95)};--bg-solid:${jt(He(e, [255, 255, 255], 0.84))};--fg:${jt(He(e, [10, 10, 20], 0.82))};--fg2:${jt(He(e, [20, 10, 30], 0.7))};--accent:${jt(e)};--arc:${jt(e)}`;
}
function Zs(t) {
  if (sa(t)) {
    const e = t.attributes.target_temp_low, s = t.attributes.target_temp_high;
    return e != null && s != null ? { low: Number(e), high: Number(s) } : null;
  }
  return t.attributes.temperature != null ? Number(t.attributes.temperature) : null;
}
const ct = (t, e) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), Ee = (t, e) => e == null ? "" : typeof e == "number" ? `${ct(t, e)}°` : `${ct(t, e.low)}–${ct(t, e.high)}°`;
function nn(t, e, s, i, n) {
  const a = j(t), o = ve(e), l = o != null ? `${ct(t, o)}° ${a === "es" ? "dentro" : "inside"}` : "";
  if (It(e)) return a === "es" ? "Sin respuesta" : "Not responding";
  if (P(e)) {
    const p = a === "es" ? "Apagado" : "Off";
    return n || !l ? p : `${p} · ${l}`;
  }
  const c = Ht(e, s) ? Ee(t, i) : "";
  if (n) return c || V(a, e.state);
  const h = c ? `${Qs(a, e.state)} ${a === "es" ? "a" : "to"} ${c}` : Qs(a, e.state);
  return l ? `${h} · ${l}` : h;
}
function ha(t, e) {
  const s = ur(e);
  return s != null ? `${Math.round(s)} % ${j(t) === "es" ? "humedad" : "humidity"}` : "";
}
const vr = { PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 }, rt = (t, e) => ((Number(t.attributes.supported_features) || 0) & vr[e]) !== 0;
function Ct(t) {
  if (!t || t.state === "unavailable" || t.state === "unknown") return "unavailable";
  const e = t.state;
  return e === "cleaning" || e === "paused" || e === "returning" || e === "docked" || e === "error" ? e : "idle";
}
const Te = (t, e) => t.entities?.[e];
function pa(t, e) {
  const s = Te(t, e)?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => n.device_id === s && i !== e && t.states[i]).map(([i]) => i) : [];
}
function ua(t, e) {
  const s = pa(t, e), i = (a, o, l, c = () => !0) => s.find((h) => h.startsWith(a) && o.includes(String(Te(t, h)?.translation_key)) && c(h)) ?? s.find((h) => h.startsWith(a) && l.test(h) && c(h)), n = (a) => String(t.states[a]?.attributes.unit_of_measurement ?? "");
  return {
    battery: s.find((a) => a.startsWith("sensor.") && t.states[a].attributes.device_class === "battery"),
    progress: i("sensor.", ["cleaning_progress", "clean_percent"], /(progress|percent|progreso)/, (a) => n(a) === "%" && t.states[a].attributes.device_class !== "battery"),
    area: i("sensor.", ["cleaning_area"], /(cleaning_area|clean_area|area_limpi)/, (a) => !/total/.test(a)),
    time: i("sensor.", ["cleaning_time"], /(cleaning_time|clean_time|tiempo_de_limpieza)/, (a) => !/total/.test(a)),
    error: i("sensor.", ["vacuum_error"], /(vacuum_error|_error$)/, (a) => !/dock/.test(a)),
    room: i("sensor.", ["current_room"], /(current_room|habitacion_actual)/),
    mopIntensity: i("select.", ["mop_intensity"], /(mop_intensity|water|agua|intensidad)/),
    mopMode: i("select.", ["mop_mode"], /(mop_mode|modo_de_mopa|modo_mopa)/),
    map: i("select.", ["selected_map"], /(selected_map|mapa)/)
  };
}
const $s = (t, e) => {
  if (!e) return null;
  const s = parseFloat(t.states[e]?.state ?? "");
  return Number.isFinite(s) ? s : null;
};
function yr(t, e, s) {
  const i = $s(t, s.battery) ?? parseFloat(e.attributes.battery_level);
  return Number.isFinite(i) ? Math.round(i) : null;
}
const Ci = (t, e) => {
  const s = $s(t, e.progress);
  return s == null ? null : Math.max(0, Math.min(100, Math.round(s)));
}, wr = (t, e) => $s(t, e.area);
function $r(t, e) {
  const s = $s(t, e.time);
  if (s == null) return null;
  const i = String(t.states[e.time]?.attributes.unit_of_measurement ?? "s");
  return Math.round(i === "h" ? s * 60 : i === "min" ? s : s / 60);
}
function kr(t, e) {
  const s = e.room ? t.states[e.room]?.state : void 0;
  return s && !["unknown", "unavailable", "none", ""].includes(s) ? s : void 0;
}
function fa(t, e, s) {
  const i = s.error ? t.states[s.error]?.state : void 0;
  return i && !["none", "unknown", "unavailable", "ok", ""].includes(i) ? i : Ct(e) === "error" && String(e.attributes.error ?? e.attributes.status ?? "") || void 0;
}
const Ai = (t) => Array.isArray(t.attributes.fan_speed_list) ? t.attributes.fan_speed_list : [], os = (t, e) => e && Array.isArray(t.states[e]?.attributes.options) ? t.states[e].attributes.options : [], ga = /* @__PURE__ */ new Map(), ma = /* @__PURE__ */ new Map();
function Sr(t, e, s) {
  const i = e.attributes.fan_speed;
  i && i !== "off" && ga.set(e.entity_id, i);
  const n = s.mopIntensity ? t.states[s.mopIntensity]?.state : void 0;
  n && n !== "off" && n !== "unavailable" && ma.set(e.entity_id, n);
}
function Cr(t, e, s) {
  const i = Ai(e), n = os(t, s.mopIntensity);
  if (!n.length) return { modes: [], current: "vacuum" };
  const a = i.includes("off"), l = [...n.includes("off") ? ["vacuum"] : [], ...a ? ["mop"] : [], "both"], c = e.attributes.fan_speed === "off", h = t.states[s.mopIntensity]?.state === "off", p = c && !h ? "mop" : h ? "vacuum" : "both";
  return { modes: l.length > 1 ? l : [], current: p };
}
const an = (t, e) => e.find((s) => t.includes(s)) ?? t.find((s) => s !== "off");
async function Ar(t, e, s, i) {
  const n = Ai(e), a = os(t, s.mopIntensity), o = ga.get(e.entity_id) ?? an(n, ["balanced", "standard", "medium"]), l = ma.get(e.entity_id) ?? an(a, ["moderate", "medium", "standard", "mild"]), c = (p) => p && e.attributes.fan_speed !== p && t.callService("vacuum", "set_fan_speed", { fan_speed: p }, { entity_id: e.entity_id }), h = (p) => p && s.mopIntensity && t.states[s.mopIntensity]?.state !== p && t.callService("select", "select_option", { option: p }, { entity_id: s.mopIntensity });
  i === "vacuum" ? await Promise.all([h("off"), e.attributes.fan_speed === "off" ? c(o) : void 0]) : i === "mop" ? await Promise.all([c("off"), t.states[s.mopIntensity]?.state === "off" ? h(l) : void 0]) : await Promise.all([e.attributes.fan_speed === "off" ? c(o) : void 0, t.states[s.mopIntensity]?.state === "off" ? h(l) : void 0]);
}
const Qt = (t, e, s, i = {}) => t.callService("vacuum", s, i, { entity_id: e.entity_id }), ue = (t, e) => Qt(t, e, "start"), Js = (t, e) => Qt(t, e, "pause"), ti = (t, e) => Qt(t, e, "return_to_base"), _a = (t, e) => Qt(t, e, "locate"), Mr = (t, e, s) => Qt(t, e, "set_fan_speed", { fan_speed: s }), on = (t, e, s) => t.callService("select", "select_option", { option: s }, { entity_id: e }), zr = (t, e, s) => Qt(t, e, "send_command", { command: "app_segment_clean", params: [{ segments: s, repeat: 1 }] }), Re = /* @__PURE__ */ new Map();
function Er(t, e, s) {
  if (Te(t, e.entity_id)?.platform !== "roborock") return Promise.resolve([]);
  const i = s.map ? t.states[s.map]?.state : void 0, n = `${e.entity_id}|${i ?? ""}`;
  return Re.has(n) || Re.set(
    n,
    t.callWS({
      type: "call_service",
      domain: "roborock",
      service: "get_maps",
      target: { entity_id: e.entity_id },
      return_response: !0
    }).then((a) => {
      const o = a.response?.[e.entity_id]?.maps ?? [], l = o.find((c) => c.name && c.name === i) ?? o[0];
      return Object.entries(l?.rooms ?? {}).map(([c, h]) => ({ id: Number(c), name: h })).filter((c) => Number.isFinite(c.id) && c.name);
    }).catch(() => (Re.delete(n), []))
  ), Re.get(n);
}
function Mi(t, e) {
  return pa(t, e).filter((s) => s.startsWith("button.") && !Te(t, s)?.entity_category && !Te(t, s)?.hidden);
}
function ba(t, e) {
  const s = Mi(t, e.entity), i = (e.routines ?? []).filter((n) => !s.includes(n) && t.states[n]);
  return [...s, ...i];
}
function rn(t, e) {
  const s = (e.routines ?? []).filter((i) => t.states[i]);
  return (s.length ? s : Mi(t, e.entity)).slice(0, 3);
}
const ei = (t, e) => e.startsWith("script.") ? t.callService("script", "turn_on", {}, { entity_id: e }) : t.callService("button", "press", {}, { entity_id: e });
function rs(t, e, s) {
  const i = String(t.states[e]?.attributes.friendly_name ?? e.split(".")[1].replace(/_/g, " "));
  return s && i.toLowerCase().startsWith(s.toLowerCase() + " ") ? i.slice(s.length + 1) : i;
}
const Tr = (t, e) => e.startsWith("script.") && /(aspir|robot|vacuum|roborock|limpi|freg|mop|clean)/i.test(e + " " + (t.states[e]?.attributes.friendly_name ?? "")), We = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] * (1 - s) + e[i] * s)), ce = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, Dr = [34, 165, 135], Or = [90, 157, 240], jr = [224, 86, 75];
function xa(t) {
  const e = t === "cleaning" || t === "paused" ? Dr : t === "returning" ? Or : t === "error" ? jr : null;
  return e ? `--bg:${ce(We(e, [255, 255, 255], 0.86), 0.95)};--bg-solid:${ce(We(e, [255, 255, 255], 0.86))};--fg:${ce(We(e, [10, 10, 20], 0.8))};--fg2:${ce(We(e, [20, 10, 30], 0.68))};--accent:${ce(e)}` : "";
}
const zi = (t) => t === "cleaning" || t === "paused" || t === "returning" || t === "error";
function Pr(t, e) {
  const s = t >= 80 ? 4 : t >= 60 ? 3 : t >= 40 ? 2 : t >= 20 ? 1 : 0, i = t < 20 ? e ? "#a32d2d" : "#ff9b93" : t < 40 ? e ? "#854f0b" : "#ffd27a" : e ? "#0f6e56" : "#9ff0d0";
  return { bars: s, color: i };
}
function va(t, e, s, i, n = 16) {
  const a = yr(t, e, s);
  if (a == null) return null;
  const o = Ct(e), { bars: l, color: c } = Pr(a, zi(o)), h = o === "docked" && a < 100;
  return { pct: a, color: c, icon: Vo(l, h, n), text: i ? `${a} %` : String(a) };
}
const Nr = {
  off: ["Apagado", "Off"],
  quiet: ["Silencioso", "Quiet"],
  silent: ["Silencioso", "Silent"],
  gentle: ["Suave", "Gentle"],
  balanced: ["Equilibrado", "Balanced"],
  standard: ["Estándar", "Standard"],
  medium: ["Media", "Medium"],
  turbo: ["Turbo", "Turbo"],
  strong: ["Fuerte", "Strong"],
  max: ["Máx", "Max"],
  max_plus: ["Máx+", "Max+"],
  custom: ["Personalizado", "Custom"],
  smart_mode: ["Inteligente", "Smart"],
  mild: ["Baja", "Low"],
  low: ["Baja", "Low"],
  moderate: ["Media", "Medium"],
  intense: ["Alta", "High"],
  high: ["Alta", "High"],
  extreme: ["Extrema", "Extreme"],
  custom_water_flow: ["Personalizada", "Custom"],
  deep: ["A fondo", "Deep"],
  deep_plus: ["A fondo+", "Deep+"],
  fast: ["Rápido", "Fast"]
};
function Es(t, e) {
  const s = e.toLowerCase().replace(/[\s-]+/g, "_"), i = Nr[s];
  if (i) return i[j(t) === "es" ? 0 : 1];
  const n = e.replace(/_/g, " ");
  return n.charAt(0).toUpperCase() + n.slice(1);
}
const Lr = [
  [/(cocin|kitchen)/i, Uo],
  [/(dorm|bed|habitac|cuarto)/i, Bo],
  [/(salon|salón|living|comedor|sofa)/i, Fo],
  [/(freg|mop|agua|water|fondo|deep)/i, qo],
  [/(mascot|pet|pelo|perro|gato)/i, Yo]
], ls = (t, e = 18) => (Lr.find(([s]) => s.test(t))?.[1] ?? Wo)(e), Ir = {
  main_brush_jammed: ["Cepillo principal atascado", "Main brush jammed"],
  side_brush_jammed: ["Cepillo lateral atascado", "Side brush jammed"],
  wheels_jammed: ["Ruedas atascadas", "Wheels jammed"],
  wheels_suspended: ["Ruedas en el aire", "Wheels suspended"],
  robot_trapped: ["Atrapado", "Trapped"],
  stuck: ["Atascado", "Stuck"],
  clean_box_full: ["Depósito lleno", "Bin full"],
  water_box_empty: ["Depósito de agua vacío", "Water tank empty"],
  low_battery: ["Batería baja", "Low battery"],
  cliff_sensor_error: ["Sensor de caída", "Cliff sensor"],
  laser_sensor_fault: ["Fallo del láser", "Laser sensor fault"],
  bumper_stuck: ["Parachoques atascado", "Bumper stuck"],
  filter_blocked: ["Filtro obstruido", "Filter blocked"],
  mop_pad_missing: ["Falta la mopa", "Mop pad missing"]
};
function ya(t, e) {
  const s = Ir[e];
  if (s) return s[j(t) === "es" ? 0 : 1];
  const i = e.replace(/_/g, " ");
  return i.charAt(0).toUpperCase() + i.slice(1);
}
function Ts(t, e) {
  return r(t, `vac_${e}`);
}
function wa(t, e, s = !0) {
  const i = t.locale?.language ?? t.language, n = Ci(t, e), a = wr(t, e), o = $r(t, e);
  return [
    s && n != null ? `${n} %` : "",
    a != null ? `${a.toLocaleString(i, { maximumFractionDigits: 1 })} m²` : "",
    o != null ? `${o} min` : ""
  ].filter(Boolean).join(" · ");
}
function Qe(t, e, s, i = !1) {
  const n = Ct(e), a = kr(t, s);
  if (i && n === "cleaning") {
    const o = Ci(t, s);
    if (o != null) return `${o} %`;
  }
  if (n === "error" && !i) {
    const o = fa(t, e, s);
    return [Ts(t, n), a ?? (o ? ya(t, o) : "")].filter(Boolean).join(" · ");
  }
  return n === "cleaning" && a && !i ? `${Ts(t, n)} · ${a}` : Ts(t, n);
}
var Hr = Object.defineProperty, Rr = Object.getOwnPropertyDescriptor, Zt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Rr(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Hr(e, s, n), n;
};
const Wr = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate", weather: "type_weather", vacuum: "type_vacuum" }, qr = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;
let ht = class extends S {
  constructor() {
    super(...arguments), this._q = "", this._allDevices = !1, this._back = () => {
      if (this._sub) {
        this._sub = void 0, this._q = "";
        return;
      }
      this.close(), this.options.onBack?.();
    }, this._devName = (t) => t.name_by_user || t.name || t.id, this._entName = (t) => String(this.hass.states[t]?.attributes.friendly_name ?? t), this._area = (t) => (t ? this.hass.areas?.[t]?.name : void 0) ?? r(this.hass, "other_area"), this._visible = (t) => {
      const e = this.hass.entities?.[t];
      return !!this.hass.states[t] && !e?.hidden && !e?.entity_category;
    };
  }
  get heading() {
    return this._sub === "entity" && this.draft.type === "climate" ? r(this.hass, "climate_entity") : this._sub ? r(this.hass, { device: "ch_device", entity: "light_entity", alarm: "type_alarm", weather: "type_weather", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" }[this._sub]) : this.options.mode === "edit" ? r(this.hass, "settings") : r(this.hass, Wr[this.draft.type]);
  }
  renderHeaderStart() {
    return !this._sub && !(this.options.mode === "add" && this.options.onBack) ? f : d`<button class="hbtn" aria-label=${r(this.hass, "back")} @click=${this._back}>${Po()}</button>`;
  }
  _set(t) {
    const e = { ...this.draft.config, ...t };
    for (const s of Object.keys(e)) (e[s] === void 0 || e[s] === "") && delete e[s];
    this.draft = { ...this.draft, config: e };
  }
  // ---- Registry helpers ------------------------------------------------------
  get _devices() {
    return Object.values(this.hass.devices ?? {});
  }
  _entitiesOf(t, e) {
    return Object.entries(this.hass.entities ?? {}).filter(([s, i]) => i.device_id === t && this._visible(s) && e(s)).map(([s]) => s).sort((s, i) => this._entName(s).localeCompare(this._entName(i)));
  }
  _deviceOf(t) {
    return t ? this.hass.entities?.[t]?.device_id ?? void 0 : void 0;
  }
  _match(...t) {
    const e = this._q.trim().toLowerCase();
    return !e || t.some((s) => s?.toLowerCase().includes(e));
  }
  // ---- Main page ---------------------------------------------------------------
  _row(t, e, s, i) {
    return d`<button class="li" @click=${() => {
      this._sub = s, this._q = "";
    }}>
      <span class="nm">${t}${i ? d`<small>${i}</small>` : f}</span>
      <span class="val">${e}${ts(!1, 16)}</span>
    </button>`;
  }
  _defaultName() {
    const t = this.draft.config;
    if (this.draft.type === "alarm") return r(this.hass, "alarm");
    const e = t.device ? this.hass.devices?.[t.device] : void 0;
    return e ? this._devName(e) : t.entity ? this._entName(t.entity) : "";
  }
  _main() {
    const t = this.hass, { type: e, config: s } = this.draft, i = s.device ?? this._deviceOf(s.entity), n = i ? t.devices?.[i] : void 0, a = d`<section>
      <h3>${r(t, "general")}</h3>
      <div class="list">
        ${e === "weather" ? this._weathers().length > 1 ? this._row(r(t, "type_weather"), s.entity ? this._entName(s.entity) : r(t, "choose"), "weather") : f : e === "alarm" ? this._alarms().length > 1 ? this._row(r(t, "type_alarm"), s.entity ? this._entName(s.entity) : r(t, "choose"), "alarm") : f : this._row(r(t, "ch_device"), n ? this._devName(n) : s.entity ? this._entName(s.entity) : r(t, "choose"), "device")}
        <label class="li">
          <span class="nm">${r(t, "name_label")}</span>
          <input class="txt" .value=${s.name ?? ""} placeholder=${this._defaultName()} @input=${(l) => this._set({ name: l.target.value })} />
        </label>
      </div>
    </section>`;
    let o = f;
    if (e === "light" && s.entity) {
      const l = i ? this._entitiesOf(i, (c) => c.startsWith("light.")) : [];
      o = d`<section>
        <h3>${r(t, "type_light")}</h3>
        <div class="list">
          ${l.length > 1 ? this._row(r(t, "light_entity"), this._entName(s.entity), "entity", s.entity) : f}
          <button class="li" role="switch" aria-checked=${s.use_light_color !== !1} @click=${() => this._set({ use_light_color: s.use_light_color === !1 ? void 0 : !1 })}>
            <span class="nm">${r(t, "use_light_color")}</span><span class="tog ${s.use_light_color !== !1 ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
    } else if (e === "weather" && s.entity) {
      const l = (c, h, p) => d`<span class="seg">${h.map(([u, m]) => d`<button class=${c === u ? "sel" : ""} @click=${() => p(u)}>${m}</button>`)}</span>`;
      o = d`
        <section>
          <h3>${r(t, "card_section")}</h3>
          <div class="list">
            <div class="li"><span class="nm">${r(t, "forecast_22")}</span>${l(s.forecast_2x2 ?? "hourly", [["hourly", r(t, "hours_word")], ["daily", r(t, "days_word")]], (c) => this._set({ forecast_2x2: c === "hourly" ? void 0 : c }))}</div>
            <button class="li" role="switch" aria-checked=${s.animate !== !1} @click=${() => this._set({ animate: s.animate === !1 ? void 0 : !1 })}>
              <span class="nm">${r(t, "animate_fx")}</span><span class="tog ${s.animate !== !1 ? "on" : ""}"></span>
            </button>
          </div>
        </section>
        <section>
          <h3>${r(t, "window_section")}</h3>
          <div class="list">
            <button class="li" role="switch" aria-checked=${s.show_details !== !1} @click=${() => this._set({ show_details: s.show_details === !1 ? void 0 : !1 })}>
              <span class="nm">${r(t, "show_details")}<small>${r(t, "show_details_sub")}</small></span><span class="tog ${s.show_details !== !1 ? "on" : ""}"></span>
            </button>
            <div class="li"><span class="nm">${r(t, "forecast_days")}</span>${l(s.forecast_days ?? 7, [[5, "5"], [7, "7"]], (c) => this._set({ forecast_days: c === 7 ? void 0 : c }))}</div>
          </div>
        </section>`;
    } else if (e === "vacuum" && s.entity && t.states[s.entity])
      o = this._vacuumSettings();
    else if (e === "climate" && s.entity && t.states[s.entity])
      o = this._climateSettings(i);
    else if (e === "charger" && s.entity) {
      const l = St(s.entity), c = r(t, l ? "raw_locked" : "raw_on"), h = r(t, l ? "raw_unlocked" : "raw_off"), p = or(s.entity, !!s.invert) === "active", u = r(t, "ch_locked"), m = r(t, "ch_unlocked"), b = $i(t, { entity: s.entity }), g = (_, $) => s[_] === "none" ? r(t, "none") : s[_] ? this._entName(s[_]) : $ ? `${r(t, "auto")} · ${this._entName($)}` : r(t, "auto");
      o = d`
        <section>
          <h3>${r(t, "ch_lock_section")}</h3>
          <div class="list">
            ${this._row(r(t, "ch_lock_entity"), this._entName(s.entity), "lock", s.entity)}
            <button class="li" role="switch" aria-checked=${!!s.invert} @click=${() => this._set({ invert: !s.invert || void 0 })}>
              <span class="nm">${r(t, "ch_invert")}<small>${r(t, "ch_invert_sub", { a: c, b: h })}</small></span>
              <span class="tog ${s.invert ? "on" : ""}"></span>
            </button>
          </div>
        </section>
        <p class="explain">${r(t, "ch_explain", { a: c, la: p ? u : m, b: h, lb: p ? m : u, press: p ? c : h })}</p>
        <section>
          <h3>${r(t, "ch_data")}</h3>
          <div class="list">
            ${this._row(r(t, "ch_status"), g("status_entity", b.status), "status_entity")}
            ${this._row(r(t, "ch_power"), g("power_entity", b.power), "power_entity")}
            ${this._row(r(t, "ch_energy"), g("energy_entity", b.energy), "energy_entity")}
            <label class="li">
              <span class="nm">${r(t, "ch_max")}</span>
              <input class="num" type="number" inputmode="decimal" min="1" max="50" step="0.1" placeholder="7,4"
                .value=${s.max_power != null ? String(s.max_power) : ""}
                @change=${(_) => {
        const $ = parseFloat(_.target.value.replace(",", "."));
        this._set({ max_power: Number.isFinite($) && $ > 0 ? $ : void 0 });
      }} />
            </label>
          </div>
        </section>`;
    }
    return d`
      <div class="scroll">
        ${a}
        ${o}
        ${this.options.mode === "edit" && this.options.onRemove ? d`<button class="remove" @click=${() => ns(t, {
      heading: r(t, "remove_card_q"),
      actions: [{ label: r(t, "remove_card"), danger: !0, run: () => {
        this.close(), this.options.onRemove?.();
      } }]
    })}>${r(t, "remove_card")}</button>` : f}
      </div>
      <button class="cta" ?disabled=${!s.entity} @click=${() => {
      this.options.onSave(this.draft), this.close();
    }}>${r(t, this.options.mode === "add" ? "add" : "save")}</button>
    `;
  }
  _climateSettings(t) {
    const e = this.hass, s = this.draft.config, i = e.states[s.entity], n = j(e), a = xe(i, s), o = (g) => g.toLocaleString(e.locale?.language ?? e.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), l = t ? this._entitiesOf(t, (g) => g.startsWith("climate.")) : [], c = lt(i), h = Me(i).length > 0, p = ea(i), u = (g, _) => {
      const $ = as(s, g);
      this._set({ mode_rules: { ...s.mode_rules ?? {}, [g]: { ...$, [_]: !$[_] } } });
    }, m = (g, _) => {
      const $ = g === "min_temp" ? a.min : a.max;
      let w = Math.round(($ + _ * a.step) / a.step) * a.step;
      w = g === "min_temp" ? Math.max(a.hwMin, Math.min(a.max - a.step, w)) : Math.min(a.hwMax, Math.max(a.min + a.step, w));
      const D = g === "min_temp" ? a.hwMin : a.hwMax;
      this._set({ [g]: w === D ? void 0 : w });
    }, b = (g) => d`<span class="mini">
      <button aria-label="−" @click=${() => m(g, -1)}>${mi(16)}</button>
      <b>${o(g === "min_temp" ? a.min : a.max)}°</b>
      <button aria-label="+" @click=${() => m(g, 1)}>${_i(16)}</button>
    </span>`;
    return d`
      ${l.length > 1 ? d`<section><h3>${r(e, "climate_entity")}</h3><div class="list">${this._row(r(e, "climate_entity"), this._entName(s.entity), "entity", s.entity)}</div></section>` : f}
      <section>
        <h3>${r(e, "temperature")}</h3>
        <div class="list">
          <div class="li"><span class="nm">${r(e, "min_temp_l")}<small>${r(e, "hw_min", { v: o(a.hwMin) })}</small></span>${b("min_temp")}</div>
          <div class="li"><span class="nm">${r(e, "max_temp_l")}<small>${r(e, "hw_max", { v: o(a.hwMax) })}</small></span>${b("max_temp")}</div>
          <div class="li"><span class="nm">${r(e, "temp_step_l")}</span>
            <span class="seg">${[0.5, 1].map((g) => d`<button class=${a.step === g ? "sel" : ""} @click=${() => this._set({ temp_step: g })}>${o(g)}°</button>`)}</span>
          </div>
        </div>
      </section>
      ${c.length ? d`<section>
            <h3>${r(e, "per_mode")}</h3>
            <div class="list">
              <table class="matrix">
                <tr><th>${r(e, "climate_mode")}</th><th>${r(e, "col_temp")}</th>${h ? d`<th>${r(e, "col_fan")}</th>` : f}</tr>
                ${c.map((g) => {
      const _ = as(s, g);
      return d`<tr>
                    <td><span class="mname">${Rt(g, 18)}${V(n, g)}</span></td>
                    <td><button class="ck ${_.t ? "on" : ""}" role="checkbox" aria-checked=${_.t} @click=${() => u(g, "t")}>${_.t ? Ve(15) : f}</button></td>
                    ${h ? d`<td><button class="ck ${_.f ? "on" : ""}" role="checkbox" aria-checked=${_.f} @click=${() => u(g, "f")}>${_.f ? Ve(15) : f}</button></td>` : f}
                  </tr>`;
    })}
              </table>
            </div>
            ${s.mode_rules ? d`<button class="more" style="margin-top:8px" @click=${() => this._set({ mode_rules: void 0 })}>${r(e, "reset_rules")}</button>` : f}
          </section>` : f}
      <section>
        <h3>${r(e, "window_section")}</h3>
        <div class="list">
          <button class="li" role="switch" aria-checked=${!!s.show_swing && p} ?disabled=${!p} style=${p ? "" : "opacity:.5"} @click=${() => this._set({ show_swing: !s.show_swing || void 0 })}>
            <span class="nm">${r(e, "show_swing")}<small>${r(e, p ? "show_swing_sub" : "no_swing")}</small></span>
            <span class="tog ${s.show_swing && p ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
  }
  /** Up to 3 routines for the 2/2 card, numbered in the order they were picked. */
  _vacuumSettings() {
    const t = this.hass, e = this.draft.config, s = e.name || this._entName(e.entity), i = (e.routines ?? []).filter((c) => t.states[c]), n = Mi(t, e.entity), a = Object.keys(t.states).filter((c) => (Tr(t, c) || i.includes(c)) && !n.includes(c) && this._visible(c)), o = (c) => {
      const h = i.includes(c) ? i.filter((p) => p !== c) : i.length < 3 ? [...i, c] : i;
      this._set({ routines: h.length ? h : void 0 });
    }, l = (c) => {
      const h = rs(t, c, s), p = i.indexOf(c), u = p < 0 && i.length >= 3;
      return d`<button class="li" role="checkbox" aria-checked=${p >= 0} ?disabled=${u} style=${u ? "opacity:.45" : ""} @click=${() => o(c)}>
        <span class="ic">${ls(h, 18)}</span>
        <span class="nm">${h}${c.startsWith("script.") ? d`<small>${c}</small>` : f}</span>
        <span class="num ${p >= 0 ? "on" : ""}">${p >= 0 ? p + 1 : f}</span>
      </button>`;
    };
    return d`<section>
        <h3>${r(t, "vac_card_routines")}</h3>
        ${n.length ? d`<div class="list">${n.map(l)}</div>` : d`<p class="note">${r(t, "vac_no_routines")}</p>`}
        <p class="note" style="margin-top:8px">${r(t, "vac_card_routines_sub")}</p>
      </section>
      ${a.length ? d`<section><h3>${r(t, "vac_scripts")}</h3><div class="list">${a.map(l)}</div></section>` : f}`;
  }
  // ---- Sub pages ---------------------------------------------------------------
  _opt(t, e, s, i, n) {
    return d`<button class="opt ${s ? "sel" : ""}" @click=${() => {
      i(), this._sub = void 0, this._q = "";
    }}>
      ${n ? d`<span class="ic">${n}</span>` : f}
      <span class="on">${t}${e ? d`<small>${e}</small>` : f}</span>
      <span class="ck">${Ve(18)}</span>
    </button>`;
  }
  _group(t, e) {
    return e.length ? d`<section><h3>${t}</h3><div class="list">${e}</div></section>` : f;
  }
  _byArea(t, e, s) {
    const i = /* @__PURE__ */ new Map();
    for (const n of t) {
      const a = this._area(e(n));
      i.has(a) || i.set(a, []), i.get(a).push(n);
    }
    return [...i].sort((n, a) => n[0].localeCompare(a[0])).map(([n, a]) => this._group(n, a.map(s)));
  }
  _devicePage() {
    const t = this.hass, { type: e, config: s } = this.draft, i = s.device ?? this._deviceOf(s.entity);
    if (e === "light") {
      const h = this._devices.map((g) => ({ d: g, lights: this._entitiesOf(g.id, (_) => _.startsWith("light.")) })).filter((g) => g.lights.length && this._match(this._devName(g.d), ...g.lights.map(this._entName))).sort((g, _) => this._devName(g.d).localeCompare(this._devName(_.d))), p = Object.keys(t.states).filter((g) => g.startsWith("light.") && this._visible(g) && !this._deviceOf(g) && this._match(this._entName(g), g)), u = p.filter((g) => Qi(t.states[g])), m = p.filter((g) => !Qi(t.states[g])), b = (g) => this._set({ entity: g, device: void 0, name: this._entName(g) });
      return d`${this._search()}
        ${this._group(r(t, "light_groups"), u.map((g) => this._opt(this._entName(g), r(t, "group"), s.entity === g, () => b(g), W(!1, 20))))}
        ${this._byArea(h, (g) => g.d.area_id, (g) => this._opt(this._devName(g.d), g.lights.length > 1 ? `${g.lights.length} ${r(t, "lights_word")}` : g.d.model ?? void 0, i === g.d.id, () => this._set({ device: g.d.id, entity: g.lights[0], name: this._devName(g.d) }), W(!1, 20)))}
        ${this._group(r(t, "other_lights"), m.map((g) => this._opt(this._entName(g), g, s.entity === g, () => b(g), W(!1, 20))))}`;
    }
    if (e === "vacuum") {
      const h = this._devices.map((u) => ({ d: u, ents: this._entitiesOf(u.id, (m) => m.startsWith("vacuum.")) })).filter((u) => u.ents.length && this._match(this._devName(u.d), ...u.ents.map(this._entName))).sort((u, m) => this._devName(u.d).localeCompare(this._devName(m.d))), p = Object.keys(t.states).filter((u) => u.startsWith("vacuum.") && this._visible(u) && !this._deviceOf(u) && this._match(this._entName(u), u));
      return d`${this._search()}
        ${this._byArea(h, (u) => u.d.area_id, (u) => this._opt(this._devName(u.d), u.d.model ?? void 0, i === u.d.id, () => this._set({ device: u.d.id, entity: u.ents[0], name: this._devName(u.d), routines: void 0 }), Ce(20)))}
        ${this._group(r(t, "other_vacuums"), p.map((u) => this._opt(this._entName(u), u, s.entity === u, () => this._set({ entity: u, device: void 0, name: this._entName(u), routines: void 0 }), Ce(20))))}`;
    }
    if (e === "climate") {
      const h = this._devices.map((u) => ({ d: u, ents: this._entitiesOf(u.id, (m) => m.startsWith("climate.")) })).filter((u) => u.ents.length && this._match(this._devName(u.d), ...u.ents.map(this._entName))).sort((u, m) => this._devName(u.d).localeCompare(this._devName(m.d))), p = Object.keys(t.states).filter((u) => u.startsWith("climate.") && this._visible(u) && !this._deviceOf(u) && this._match(this._entName(u), u));
      return d`${this._search()}
        ${this._byArea(h, (u) => u.d.area_id, (u) => this._opt(this._devName(u.d), u.d.model ?? void 0, i === u.d.id, () => this._set({ device: u.d.id, entity: u.ents[0], name: this._devName(u.d) }), Se(20)))}
        ${this._group(r(t, "other_climates"), p.map((u) => this._opt(this._entName(u), u, s.entity === u, () => this._set({ entity: u, device: void 0, name: this._entName(u) }), Se(20))))}`;
    }
    const n = this._devices.map((h) => ({ d: h, locks: this._entitiesOf(h.id, (p) => zs.includes(be(p))) })).filter((h) => h.locks.length), a = (h) => qr.test([this._devName(h.d), h.d.manufacturer, h.d.model].join(" ")), o = n.filter((h) => (this._allDevices || a(h)) && this._match(this._devName(h.d), h.d.manufacturer, h.d.model)), l = (h) => h.find((p) => /bloq|lock/i.test(p + this._entName(p))) ?? h.find((p) => /paus|stop/i.test(p + this._entName(p))) ?? h[0], c = (h) => {
      const p = l(h.locks);
      this._set({ device: h.d.id, entity: p, invert: en(t, p) || void 0, name: this._devName(h.d), status_entity: void 0, power_entity: void 0, energy_entity: void 0 });
    };
    return d`${this._search()}
      ${this._byArea(o, (h) => h.d.area_id, (h) => this._opt(this._devName(h.d), h.locks.map(this._entName).join(" · "), i === h.d.id, () => c(h), vs(20)))}
      ${o.length ? f : d`<p class="note">${r(t, "no_chargers_found")}</p>`}
      ${this._allDevices ? f : d`<button class="more" @click=${() => this._allDevices = !0}>${r(t, "show_all_devices")}</button>`}`;
  }
  _search() {
    return d`<label class="search">${Nn(16)}<input type="search" placeholder=${r(this.hass, "search_entities")} .value=${this._q}
      @input=${(t) => this._q = t.target.value} /></label>`;
  }
  _subPage() {
    const t = this.hass, { config: e } = this.draft, s = this._sub;
    if (s === "device") return d`<div class="scroll">${this._devicePage()}</div>`;
    if (s === "weather") {
      const l = this._weathers();
      return d`<div class="scroll">${this._group(r(t, "type_weather"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c }))))}</div>`;
    }
    if (s === "alarm") {
      const l = Object.keys(t.states).filter((c) => c.startsWith("alarm_control_panel.") && this._visible(c));
      return d`<div class="scroll">${this._group(r(t, "type_alarm"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, name: e.name || void 0 }), xs(20))))}
        ${l.length ? f : d`<p class="note">${r(t, "no_alarms_found")}</p>`}</div>`;
    }
    const i = e.device ?? this._deviceOf(e.entity);
    if (s === "entity") {
      const l = this.draft.type === "climate" ? "climate." : "light.", c = i ? this._entitiesOf(i, (h) => h.startsWith(l)) : [];
      return d`<div class="scroll">${this._group(r(t, "light_entity"), c.map((h) => this._opt(this._entName(h), h, e.entity === h, () => this._set({ entity: h }))))}</div>`;
    }
    if (s === "lock") {
      const l = i ? this._entitiesOf(i, (c) => zs.includes(be(c))) : Object.keys(t.states).filter((c) => zs.includes(be(c)) && this._visible(c) && this._match(this._entName(c), c));
      return d`<div class="scroll">${i ? f : this._search()}${this._group(r(t, "ch_lock_entity"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, invert: en(t, c) || void 0 }))))}</div>`;
    }
    const n = s === "status_entity" ? (l) => Kn(t, l) : s === "power_entity" ? (l) => Gn(t, l) : (l) => Xn(t, l), a = new Set(e.entity ? Vn(t, e.entity) : []), o = Object.keys(t.states).filter((l) => this._visible(l) && n(l) && this._match(this._entName(l), l)).sort((l, c) => Number(a.has(c)) - Number(a.has(l)) || this._entName(l).localeCompare(this._entName(c))).slice(0, 60);
    return d`<div class="scroll">${this._search()}
      <div class="list">
        ${this._opt(r(t, "auto"), void 0, !e[s], () => this._set({ [s]: void 0 }))}
        ${this._opt(r(t, "none"), void 0, e[s] === "none", () => this._set({ [s]: "none" }))}
        ${o.map((l) => this._opt(this._entName(l), l, e[s] === l, () => this._set({ [s]: l })))}
      </div></div>`;
  }
  renderContent() {
    return this._sub ? this._subPage() : this._main();
  }
  /** Alarm panels in the house, Alarmo's first. */
  _alarms() {
    const t = (e) => this.hass.entities?.[e]?.platform;
    return Object.keys(this.hass.states).filter((e) => e.startsWith("alarm_control_panel.") && this._visible(e)).sort((e, s) => +(t(s) === "alarmo") - +(t(e) === "alarmo"));
  }
  _weathers() {
    return Object.keys(this.hass.states).filter((t) => t.startsWith("weather.") && this._visible(t)).sort();
  }
  willUpdate() {
    if (this.draft.type === "weather" && !this.draft.config.entity && this.hass) {
      const t = this._weathers()[0];
      t && (this.draft = { ...this.draft, config: { ...this.draft.config, entity: t } });
    }
    if (this.draft.type === "alarm" && !this.draft.config.entity && this.hass) {
      const t = this._alarms()[0];
      t && (this.draft = { ...this.draft, config: { ...this.draft.config, entity: t } });
    }
  }
};
ht.styles = [
  S.styles,
  M`
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 4px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
      }
      .li + .li {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .li .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
      }
      .li .nm small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .val {
        max-width: 58%;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
      }
      input {
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      input.txt {
        flex: 1;
        min-width: 0;
        text-align: right;
      }
      input.num {
        width: 80px;
        text-align: right;
        padding: 6px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.12);
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
        transition: background 0.2s;
      }
      .tog::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
      .explain {
        margin: 0;
        border-radius: 16px;
        padding: 12px 14px;
        background: rgba(52, 199, 123, 0.14);
        border: 1px solid rgba(52, 199, 123, 0.35);
        font-size: 14px;
        line-height: 1.5;
      }
      .note {
        margin: 0 4px;
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.6);
      }
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        padding: 0 12px;
        border-radius: 13px;
        background: rgba(255, 255, 255, 0.12);
        flex: none;
      }
      .search input {
        flex: 1;
        min-width: 0;
      }
      .opt {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 52px;
        box-sizing: border-box;
        font-size: 15px;
      }
      .opt + .opt {
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }
      .opt .on {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .opt small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.55);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .opt .ck {
        color: #34c77b;
        opacity: 0;
      }
      .opt.sel .ck {
        opacity: 1;
      }
      .ic {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .mini {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 2px;
      }
      .mini button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .mini b {
        min-width: 52px;
        text-align: center;
        font-variant-numeric: tabular-nums;
        font-size: 15px;
      }
      .seg {
        display: flex;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 3px;
      }
      .seg button {
        height: 30px;
        padding: 0 14px;
        border-radius: 15px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
      .seg button.sel {
        background: #fff;
        color: #23233a;
      }
      .matrix {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      .matrix th {
        font-size: 11.5px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        padding: 10px 6px;
        text-align: center;
      }
      .matrix th:first-child,
      .matrix td:first-child {
        text-align: left;
        padding-left: 14px;
      }
      .matrix td {
        padding: 8px 6px;
        text-align: center;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .mname {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ck {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.35);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
      .ck.on {
        background: #34c77b;
        border-color: #34c77b;
      }
      .num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.35);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
        flex: none;
      }
      .num.on {
        background: #fff;
        border-color: #fff;
        color: #23233a;
      }
      .more,
      .remove {
        width: 100%;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        text-align: center;
        font-size: 14.5px;
        font-weight: 600;
      }
      .remove {
        color: #ff8a80;
      }
      .cta {
        flex: none;
        height: 54px;
        border-radius: 27px;
        background: #fff;
        color: #23233a;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        margin-top: 4px;
      }
      .cta:disabled {
        opacity: 0.4;
      }
    `
];
Zt([
  y({ attribute: !1 })
], ht.prototype, "draft", 2);
Zt([
  y({ attribute: !1 })
], ht.prototype, "options", 2);
Zt([
  x()
], ht.prototype, "_sub", 2);
Zt([
  x()
], ht.prototype, "_q", 2);
Zt([
  x()
], ht.prototype, "_allDevices", 2);
ht = Zt([
  z("terral-card-config")
], ht);
function $a(t, e, s) {
  document.querySelector("terral-card-config")?.remove();
  const i = document.createElement("terral-card-config");
  return i.hass = t, i.draft = { ...e, config: { ...e.config } }, i.options = s, document.body.appendChild(i), i;
}
function Jt(t, e, s, i) {
  const { type: n, view_layout: a, ...o } = i, l = a?.terral;
  $a(e, { type: s, config: o, w: l?.w ?? 2, h: l?.h ?? 2 }, {
    mode: "edit",
    onSave: (c) => t.dispatchEvent(new CustomEvent("terral-card-config", { detail: { config: c.config, size: { w: c.w, h: c.h } }, bubbles: !0, composed: !0, cancelable: !0 })),
    onRemove: () => t.dispatchEvent(new CustomEvent("terral-card-remove", { bubbles: !0, composed: !0 }))
  });
}
function Ur(t) {
  return { type: t, config: {}, w: t === "light" ? 1 : 2, h: 2 };
}
function Br(t) {
  for (const e of document.querySelectorAll("terral-card-config")) e.hass = t;
}
var Fr = Object.defineProperty, Yr = Object.getOwnPropertyDescriptor, et = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Yr(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Fr(e, s, n), n;
};
const Vr = "terral-home-light";
let At = class extends N {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      sr(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area,
        onSettings: () => this.hass && this._config && Jt(this, this.hass, "light", this._config)
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !wt(e) && _e(this.hass, e);
    }, this._down = (t) => {
      this._held = !1, this._holdStart = { x: t.clientX, y: t.clientY }, clearTimeout(this._holdTimer);
      const e = { x: t.clientX, y: t.clientY, pointerId: t.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", {
          detail: e,
          bubbles: !0,
          composed: !0,
          cancelable: !0
        });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (t) => {
      this._holdStart && Math.hypot(t.clientX - this._holdStart.x, t.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._cardClick = (t) => {
      if (this._held) {
        t.stopPropagation(), t.preventDefault(), this._held = !1;
        return;
      }
      const e = t.currentTarget;
      for (const s of t.composedPath()) {
        if (s === e) break;
        if (s instanceof HTMLElement && /^(BUTTON|INPUT|TERRAL-SLIDER|TERRAL-LIGHT-FAVS|A)$/.test(s.tagName)) return;
      }
      this._openWindow();
    };
  }
  // ---- Lovelace card API -------------------------------------------------
  setConfig(t) {
    if (!t?.entity || !String(t.entity).startsWith("light."))
      throw new Error("Terral · Luz: 'entity' must be a light (light.xxx)");
    this._config = t;
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.h === 4 ? "s42" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }
  /** Sizes the Terral view should offer for this card (w/h in cells). */
  getTerralSizes() {
    const t = this._entity, e = [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 }
    ];
    return t ? Xe(t) === "temperature" || Xe(t) === "color" || K(t).length > 0 ? e : e.slice(0, 3) : e;
  }
  static getStubConfig(t, e = [], s = []) {
    return { entity: [...e, ...s].find((n) => n.startsWith("light.")) ?? Object.keys(t?.states ?? {}).find((n) => n.startsWith("light.")) ?? "light.example" };
  }
  static getConfigForm() {
    const t = (e) => r(void 0, e);
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "light" } } },
        { name: "name", selector: { text: {} } },
        { name: "use_light_color", default: !0, selector: { boolean: {} } },
        {
          name: "group_by_area",
          default: "auto",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "auto", label: t("group_auto") },
                { value: "always", label: t("group_always") },
                { value: "never", label: t("group_never") }
              ]
            }
          }
        }
      ],
      computeLabel: (e) => ({
        entity: t("entity"),
        name: t("name"),
        use_light_color: t("use_light_color"),
        group_by_area: t("group_by_area")
      })[e.name] ?? e.name
    };
  }
  // ---- Lifecycle ---------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(([t]) => {
      if (this._config?.view_layout?.terral) return;
      const { width: e, height: s } = t.contentRect;
      if (!e || !s) return;
      let i;
      s < 120 ? i = "s11" : e < s * 1.4 ? i = e > 260 && s > 260 ? "s42" : "s21" : i = "s22", i !== this._size && (this._size = i);
    }), this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  shouldUpdate(t) {
    if (t.size > 1 || !t.has("hass")) return !0;
    const e = t.get("hass");
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...K(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && ir(this.hass);
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  // ---- Render ------------------------------------------------------------
  _name(t) {
    return this._config?.name || this.hass?.formatEntityName?.(t) || t.attributes.friendly_name || t.entity_id;
  }
  _status(t, e) {
    const s = this.hass;
    if (wt(t)) return r(s, "unavailable");
    const i = K(t);
    if (i.length) {
      const l = i.filter((p) => E(s.states[p])).length;
      if (!l) return `${i.length} ${r(s, "lights_off")}`;
      const c = vt(t), h = l === i.length && e === "onoff" ? `${r(s, "all_lit")} (${l})` : `${l} ${r(s, "of")} ${i.length} ${r(s, "lit")}`;
      return c != null && this._size !== "s11" ? `${h} · ${c} %` : h;
    }
    if (!E(t)) return r(s, "off");
    const n = [], a = vt(t);
    a != null && n.push(`${a} %`);
    const o = Ut(t);
    if (o) {
      const l = Vs(o, j(s));
      l && n.push(l);
    } else if (e === "temperature" || e === "color") {
      const l = Ae(t);
      if (l && t.attributes.color_mode === "color_temp") {
        const c = [...Fs].sort((h, p) => Math.abs(h.kelvin - l) - Math.abs(p.kelvin - l))[0];
        n.push(r(s, c.key));
      }
    }
    return n.join(" · ") || r(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${r(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = Xe(t), s = E(t), i = wt(t), n = K(t), a = Bn(t, this._config.use_light_color !== !1), o = s ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};--fill:${a.fill}` : "";
    let l = this._size;
    l === "s42" && !this.getTerralSizes().some((p) => p.h === 4) && (l = "s22");
    const c = d`<button
      class="icon"
      aria-label="${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${W(s, l === "s11" ? 20 : 32)}
      ${n.length && s ? d`<span class="badge">${n.filter((p) => E(this.hass.states[p])).length}</span>` : f}
    </button>`, h = d`<div class="text">
      <span class="name">${this._name(t)}</span>
      <span class="state">${this._status(t, e)}</span>
    </div>`;
    return d`<div
      class="card ${l} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${o}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${this._name(t)}
      @click=${this._cardClick}
      @keydown=${(p) => {
      (p.key === "Enter" || p.key === " ") && p.target === p.currentTarget && (p.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(p) => p.preventDefault()}
    >
      ${l === "s11" || l === "s21" ? d`${c}${h}` : d`<div class="head">${c}${h}${this._quickButton(t, e, l)}</div>
            ${this._body(t, e, l)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !K(t).length) return f;
    const i = Ut(t), n = i ? Vs(i, j(this.hass)) ?? "" : "", a = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? F(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style=${a}></i>${n || (e === "color" ? r(this.hass, "more_colors") : r(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return d`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${vt(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(s) => Ys(this.hass, t.entity_id, s.detail.value)}
    >${Pn(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = K(t);
    if (s === "s42" && i.length) {
      const a = [...i].sort((h, p) => Number(E(this.hass.states[p])) - Number(E(this.hass.states[h]))), o = e === "onoff" ? 5 : 4, l = a.length > o ? a.slice(0, o - 1) : a, c = a.length - l.length;
      return d`
        ${e !== "onoff" ? this._brightness(t) : f}
        <div class="members">
          ${l.map((h) => {
        const p = this.hass.states[h], u = E(p), m = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? h : h;
        return d`<div class="mr">
              <button class="mi ${u ? "lit" : ""}" ?disabled=${wt(p)} aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${m}"
                @click=${(b) => {
          b.stopPropagation(), p && _e(this.hass, p);
        }}>${W(u, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${m}</span><small>${p ? E(p) ? vt(p) != null ? `${vt(p)} %` : r(this.hass, "on") : r(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${c > 0 ? d`<button class="morebtn" @click=${this._openWindow}>+ ${c} ${r(this.hass, "more")}</button>` : f}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? d`<div class="tags">
          ${i.slice(0, 4).map((a) => {
        const o = this.hass.states[a], l = o ? this.hass.formatEntityName?.(o) ?? o.attributes.friendly_name ?? a : a;
        return d`<span class="tag"><i class=${E(o) ? "lit" : ""}></i>${l}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${E(t) ? r(this.hass, "on") : r(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const a = t.attributes.min_color_temp_kelvin ?? 2e3, o = t.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${r(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${r(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${a} .max=${o} .value=${Ae(t) ?? 3500}
          .label=${r(this.hass, "temperature")}
          @value-changed=${(l) => ss(this.hass, t, l.detail.value)}></terral-slider>
        <div class="chips">
          ${Fs.map((l) => d`<button class="chip" style="background:${l.css}" @click=${(c) => {
        c.stopPropagation(), ss(this.hass, t, l.kelvin);
      }}>${r(this.hass, l.key)}</button>`)}
        </div>
      `;
    }
    const n = this._config?.favorite_colors?.map((a) => Array.isArray(a) ? a : a.rgb) ?? void 0;
    return d`
      <p class="lbl">${r(this.hass, "brightness")}</p>
      ${this._brightness(t, !0)}
      <p class="lbl">${r(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${t} .colors=${n}></terral-light-favs>
      <button class="pb wide" @click=${(a) => {
      a.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${r(this.hass, "more_colors")}</button>
    `;
  }
};
At.styles = M`
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
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
      outline: none;
      transition: background 0.25s, color 0.25s, transform 0.12s;
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
et([
  y({ attribute: !1 })
], At.prototype, "hass", 2);
et([
  y({ type: Boolean })
], At.prototype, "preview", 2);
et([
  x()
], At.prototype, "_config", 2);
et([
  x()
], At.prototype, "_size", 2);
At = et([
  z(Vr)
], At);
let Ft = class extends N {
  render() {
    if (!this.hass || !this.entity) return f;
    const t = j(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: F(i) })) : Gr[t] ??= Xr(t), s = Ut(this.entity);
    return e.slice(0, 6).map(
      (i) => d`<button
        class=${s && F(s) === F(i.rgb) ? "sel" : ""}
        style="background:${F(i.rgb)}"
        aria-label=${i.name}
        @click=${(n) => {
        n.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
Ft.styles = M`
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
et([
  y({ attribute: !1 })
], Ft.prototype, "hass", 2);
et([
  y({ attribute: !1 })
], Ft.prototype, "entity", 2);
et([
  y({ attribute: !1 })
], Ft.prototype, "colors", 2);
Ft = et([
  z("terral-light-favs")
], Ft);
const Gr = {}, Xr = (t) => bi.map((e) => ({ rgb: e.rgb, name: e.name[t] })), Kr = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, ka = ["away", "home", "night", "vacation", "custom"], Qr = ["away", "home", "vacation"], si = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function Mt(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const Ds = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : ka.includes(e) ? e : void 0;
};
function Ei(t) {
  return Ds(t.state) ?? Ds(t.attributes.arm_mode) ?? Ds(t.attributes.next_state);
}
function Sa(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? ka.filter((s) => e & Kr[s]) : ["away", "home"];
}
function cs(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function Zr(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const Ti = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, Jr = (t) => Ti(t) != null && t.attributes.code_arm_required !== !1;
function ds(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function tl(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const ii = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function el(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function sl(t, e, s, i, n = !1) {
  if (el(t, e)) {
    const o = { entity_id: e.entity_id, mode: s };
    return i && (o.code = i), n && (o.force = !0), t.callService("alarmo", "arm", o);
  }
  const a = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", a, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function il(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function nl(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function Ca(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), n = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(n, 150);
    };
    n();
  });
}
function al(t, e, s, i, n, a = {}) {
  const o = async (h) => {
    const p = t(), u = p?.states[e];
    if (!p || !u) return { result: "wrong" };
    try {
      await sl(p, u, s, h, a.force);
    } catch {
      return { result: "wrong", code: h };
    }
    const m = () => t()?.states[e];
    if (await Ca(() => {
      const _ = m();
      return !!_ && Mt(_) !== "disarmed";
    })) return { result: "armed", code: h };
    const g = m();
    return { result: g && ds(g).length ? "refused" : "wrong", code: h };
  }, l = t()?.states[e];
  if (!l) return;
  const c = Ti(l);
  if (a.code != null || !c || !Jr(l)) {
    o(a.code).then(n);
    return;
  }
  i(c, async (h) => {
    const p = await o(h);
    return p.result === "wrong" ? !1 : (n(p), !0);
  });
}
function ol(t, e, s) {
  const i = async (o) => {
    const l = t(), c = l?.states[e];
    if (!l || !c) return !1;
    try {
      await il(l, c, o);
    } catch {
      return !1;
    }
    return Ca(() => {
      const h = t()?.states[e];
      return !!h && Mt(h) === "disarmed";
    });
  }, n = t()?.states[e];
  if (!n) return;
  const a = Ti(n);
  if (!a) {
    i();
    return;
  }
  s(a, i);
}
const Os = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), qe = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function rl(t) {
  const e = si[t];
  return {
    bg: qe(Os(e, [255, 255, 255], 0.84), 0.95),
    fg: qe(Os(e, [10, 10, 20], 0.82)),
    fg2: qe(Os(e, [20, 10, 30], 0.72)),
    accent: qe(e)
  };
}
const ln = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var ll = Object.defineProperty, cl = Object.getOwnPropertyDescriptor, te = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? cl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ll(e, s, n), n;
};
let pt = class extends S {
  constructor() {
    super(...arguments), this.format = "number", this._code = "", this._error = !1, this._busy = !1, this._onKeyboard = (t) => {
      this.format !== "number" || this._busy || (/^[0-9]$/.test(t.key) ? this._press(t.key) : t.key === "Backspace" ? this._erase() : t.key === "Enter" && this._send());
    };
  }
  get heading() {
    return r(this.hass, "code_title");
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._onKeyboard);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("keydown", this._onKeyboard);
  }
  _press(t) {
    this._busy || this._code.length >= 12 || (this._error = !1, this._code += t);
  }
  _erase() {
    this._error = !1, this._code = this._code.slice(0, -1);
  }
  async _send() {
    if (!this._code || this._busy || !this.submit) return;
    this._busy = !0;
    const t = await this.submit(this._code).catch(() => !1);
    if (this._busy = !1, t) {
      this.close();
      return;
    }
    this._error = !0, this._code = "";
  }
  renderContent() {
    if (this.format === "text")
      return d`<form class="text" @submit=${(e) => {
        e.preventDefault(), this._send();
      }}>
        <input
          type="password"
          autocomplete="off"
          placeholder=${r(this.hass, "code_placeholder")}
          .value=${this._code}
          @input=${(e) => {
        this._error = !1, this._code = e.target.value;
      }}
        />
        <p class="err" aria-live="polite">${this._error ? r(this.hass, "code_wrong") : f}</p>
        <button class="okbtn" ?disabled=${!this._code || this._busy}>${r(this.hass, "ok")}</button>
      </form>`;
    const t = Math.max(4, this._code.length);
    return d`
      <div class="dots ${this._error ? "shake" : ""} ${this._busy ? "busy" : ""}" aria-label="${this._code.length}">
        ${Array.from({ length: t }, (e, s) => d`<i class=${s < this._code.length ? "f" : ""}></i>`)}
      </div>
      <p class="err" aria-live="polite">${this._error ? r(this.hass, "code_wrong") : f}</p>
      <div class="pad">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((e) => d`<button class="key" @click=${() => this._press(e)}>${e}</button>`)}
        <button class="key fn" aria-label=${r(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${To(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${r(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${Ve(26)}</button>
      </div>
    `;
  }
};
pt.styles = [
  S.styles,
  M`
      .content {
        align-items: center;
        gap: 6px;
        /* Key size: as big as fits between header and home bar, 52–74 px. */
        --k: clamp(52px, calc((100dvh - 390px) / 4.8), 74px);
      }
      .modal .content {
        --k: 70px;
      }
      .dots {
        flex: none;
        height: 18px;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .dots i {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-sizing: border-box;
        transition: background 0.1s;
      }
      .dots i.f {
        background: #fff;
      }
      .dots.busy {
        animation: busy 0.9s ease-in-out infinite;
      }
      .dots.shake {
        animation: shake 0.35s;
      }
      @keyframes busy { 50% { opacity: 0.4; } }
      @keyframes shake {
        20%, 60% { transform: translateX(-8px); }
        40%, 80% { transform: translateX(8px); }
      }
      .err {
        flex: none;
        margin: 0;
        height: 20px;
        font-size: 14px;
        font-weight: 600;
        color: #ff9a90;
      }
      .pad {
        flex: none;
        display: grid;
        grid-template-columns: repeat(3, var(--k));
        grid-auto-rows: var(--k);
        gap: calc(var(--k) * 0.18) calc(var(--k) * 0.36);
        margin-bottom: 4px;
      }
      .key {
        width: var(--k);
        height: var(--k);
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        font-size: calc(var(--k) * 0.4);
        font-weight: 500;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-variant-numeric: tabular-nums;
        transition: background 0.1s, transform 0.08s;
      }
      .key:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.34);
        transform: scale(0.95);
      }
      .key.fn {
        background: none;
      }
      .key.ok {
        background: #fff;
        color: #23233a;
      }
      .key:disabled {
        opacity: 0.35;
      }
      .text {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      input {
        height: 52px;
        border-radius: 16px;
        border: 0;
        outline: none;
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        font: inherit;
        font-size: 18px;
        -webkit-user-select: text;
        user-select: text;
      }
      .okbtn {
        height: 52px;
        border-radius: 18px;
        background: #fff;
        color: #23233a;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
      }
      .okbtn:disabled {
        opacity: 0.4;
      }
    `
];
te([
  y()
], pt.prototype, "format", 2);
te([
  y({ attribute: !1 })
], pt.prototype, "submit", 2);
te([
  x()
], pt.prototype, "_code", 2);
te([
  x()
], pt.prototype, "_error", 2);
te([
  x()
], pt.prototype, "_busy", 2);
pt = te([
  z("terral-code-sheet")
], pt);
function Aa(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const De = /* @__PURE__ */ new Map(), dl = 6e4, Oe = "terral-alarm-refusal", Ma = () => window.dispatchEvent(new Event(Oe));
function hs(t) {
  const e = De.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > dl || Mt(t) !== "disarmed") {
      De.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function Di(t) {
  De.delete(t) && Ma();
}
function ps(t, e, s, i = !1) {
  const n = t();
  if (!n) return;
  const a = De.get(e), o = i ? { force: !0, code: a?.code } : {};
  Di(e), al(
    t,
    e,
    s,
    (l, c) => Aa(n, l, c),
    (l) => {
      l.result === "refused" && (De.set(e, { mode: s, code: l.code, at: Date.now() }), Ma());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    o
  );
}
function ye(t, e) {
  const s = t();
  s && ol(t, e, (i, n) => Aa(s, i, n));
}
const hl = (t) => t.charAt(0).toLowerCase() + t.slice(1), us = (t, e) => r(t, `mode_${e}`);
function za(t, e, s) {
  const i = Mt(e), n = Ei(e), a = n ? hl(us(t, n)) : "";
  if (hs(e)) {
    const l = ds(e);
    return {
      title: r(t, "alarm_failed"),
      status: l.length > 1 ? r(t, "alarm_open_n", { n: l.length }) : r(t, "alarm_open", { name: l[0] ? ii(t, l[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: r(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${r(t, "alarm_arming", { mode: a })} · ${r(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${r(t, "alarm_armed", { mode: a })} · ${r(t, "alarm_since", { t: ln(t, e.last_changed) })}` };
    case "pending":
      return { title: r(t, "alarm_pending"), status: r(t, "alarm_pending_sub") };
    case "triggered": {
      const l = ds(e), c = l.length ? ii(t, l[0]) + (l.length > 1 ? ` +${l.length - 1}` : "") : s;
      return { title: r(t, "alarm_triggered"), status: `${c} · ${ln(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: r(t, "unavailable") };
  }
}
const Ea = (t) => {
  const e = cs(t);
  return e == null ? null : Math.ceil(e);
};
var pl = Object.defineProperty, ul = Object.getOwnPropertyDescriptor, Ne = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ul(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && pl(e, s, n), n;
};
const Ta = (t, e = 20) => ({ away: Ao, home: es, night: Mo, vacation: zo, custom: Eo })[t](e);
let zt = class extends S {
  constructor() {
    super(...arguments), this.entityId = "", this.name = "", this._tick = 0, this._refresh = () => this.requestUpdate(), this._getHass = () => this.hass;
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Z(19)}</button>` : f;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Oe, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && cs(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Oe, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? d`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => d`<div class="row static"><span class="ic">${Us(18)}</span><span class="nm">${ii(this.hass, s)}</span></div>`)}</div>
    </section>` : f;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = Mt(e), n = Ei(e), a = hs(e), o = Ea(e), { title: l, status: c } = za(t, e, this.name), h = i === "armed" && n ? `rgb(${si[n].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", p = a || i === "pending" || i === "triggered" ? Us(30) : i === "armed" ? In(32) : xs(32), u = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let m = f;
    a ? m = d`<div class="btns">
        <button class="big solid" @click=${() => ps(this._getHass, s, a.mode, !0)}>${qt()}<span>${r(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => Di(s)}><span>${r(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? m = d`<section>
        <h3>${r(t, "arm_options")}</h3>
        <div class="list">
          ${Sa(e).map(
      (g) => d`<button class="row" @click=${() => ps(this._getHass, s, g)}>
              <span class="ic" style="color:rgb(${si[g].join(",")})">${Ta(g)}</span><span class="nm">${us(t, g)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? m = d`<div class="btns">
        <button class="big" @click=${() => ye(this._getHass, s)}>${bs(20)}<span>${r(t, "cancel")}</span></button>
        ${u ? d`<button class="big" @click=${() => nl(t, e)}>${Do()}<span>${r(t, "skip_delay")}</span></button>` : f}
      </div>` : i !== "unavailable" && (m = d`<div class="btns"><button class="big solid" @click=${() => ye(this._getHass, s)}>${ke()}<span>${r(t, "disarm")}</span></button></div>`);
    const b = e.attributes.changed_by;
    return d`
      <div class="status st-${a ? "failed" : i}" style="--ac:${h}">
        <span class="sic">${p}</span>
        <div class="txt"><strong>${l}</strong><span>${c}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : f}
      </div>
      <div class="scroll">
        ${m}
        ${this._sensorList(r(t, "open_sensors"), ds(e))}
        ${i === "armed" ? this._sensorList(r(t, "bypassed_sensors"), tl(e)) : f}
        <p class="foot">${r(t, "changed_by")}: ${b ? `${b} · ` : ""}${On(t, e.last_changed)}</p>
      </div>
    `;
  }
};
zt.styles = [
  S.styles,
  M`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
      }
      .sic {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--ac);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .st-arming .sic,
      .st-failed .sic {
        background: rgba(255, 255, 255, 0.16);
        color: #ffb45c;
      }
      .st-arming .sic {
        animation: pulse 1.2s ease-in-out infinite;
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .txt strong {
        font-size: 18px;
      }
      .txt span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.75);
      }
      .secs {
        font-size: 34px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: var(--ac);
        animation: blink 1s ease-in-out infinite;
      }
      .st-pending .secs {
        color: #fff;
      }
      @keyframes blink { 50% { opacity: 0.3; } }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 180, 92, 0.55); }
        60% { box-shadow: 0 0 0 9px rgba(255, 180, 92, 0); }
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      button.row:active {
        background: rgba(255, 255, 255, 0.08);
      }
      .ic {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .nm {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
      }
      .btns {
        display: flex;
        gap: 10px;
      }
      .big {
        flex: 1;
        height: 54px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
      }
      .big.solid {
        background: #fff;
        color: #23233a;
      }
      .foot {
        margin: 0 4px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.55);
      }
      @media (prefers-reduced-motion: reduce) {
        .sic, .secs { animation: none !important; }
      }
    `
];
Ne([
  y()
], zt.prototype, "entityId", 2);
Ne([
  y()
], zt.prototype, "name", 2);
Ne([
  y({ attribute: !1 })
], zt.prototype, "onSettings", 2);
Ne([
  x()
], zt.prototype, "_tick", 2);
zt = Ne([
  z("terral-alarm-dialog")
], zt);
function fl(t, e, s, i) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const n = document.createElement("terral-alarm-dialog");
  return n.hass = t, n.entityId = e, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function gl(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var ml = Object.defineProperty, _l = Object.getOwnPropertyDescriptor, ks = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? _l(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ml(e, s, n), n;
};
const bl = "terral-home-alarm";
let Yt = class extends N {
  constructor() {
    super(...arguments), this._tick = 0, this._held = !1, this._refresh = () => this.requestUpdate(), this._getHass = () => this.hass, this._down = (t) => {
      this._held = !1, this._holdStart = { x: t.clientX, y: t.clientY }, clearTimeout(this._holdTimer);
      const e = { x: t.clientX, y: t.clientY, pointerId: t.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", { detail: e, bubbles: !0, composed: !0, cancelable: !0 });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (t) => {
      this._holdStart && Math.hypot(t.clientX - this._holdStart.x, t.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._cardClick = (t) => {
      if (this._held) {
        t.stopPropagation(), t.preventDefault(), this._held = !1;
        return;
      }
      const e = t.currentTarget;
      for (const s of t.composedPath()) {
        if (s === e) break;
        if (s instanceof HTMLElement && s.tagName === "BUTTON") return;
      }
      this._openWindow();
    };
  }
  setConfig(t) {
    if (!t?.entity || !String(t.entity).startsWith("alarm_control_panel."))
      throw new Error("Terral · Alarma: 'entity' must be an alarm (alarm_control_panel.xxx)");
    this._config = t;
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 6, min_rows: 2 };
  }
  /** Only 2/2 for now. */
  getTerralSizes() {
    return [{ w: 2, h: 2 }];
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((s) => s.startsWith("alarm_control_panel.")) ?? "alarm_control_panel.alarmo" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "alarm_control_panel" } } },
        { name: "name", selector: { text: {} } }
      ],
      computeLabel: (t) => r(void 0, t.name === "entity" ? "alarm_entity" : "name")
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Oe, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Oe, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  get _name() {
    return this._config?.name || r(this.hass, "alarm");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || e.states[this._config.entity] !== this._entity;
  }
  updated(t) {
    t.has("hass") && this.hass && gl(this.hass);
    const e = this._entity, s = !!e && cs(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && fl(this.hass, this._config.entity, this._name, () => this.hass && this._config && Jt(this, this.hass, "alarm", this._config));
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = Mt(t), i = hs(t);
    if (i)
      return d`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => ps(this._getHass, e, i.mode, !0))}>${qt()}<span>${r(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => Di(e))}><span>${r(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const n = Sa(t).filter((a) => Qr.includes(a));
        return d`<div class="row ${n.length > 2 ? "three" : ""}">
          ${n.map(
          (a) => d`<button class="pb" aria-label=${r(this.hass, "arm_mode", { mode: us(this.hass, a) })} @click=${this._act(() => ps(this._getHass, e, a))}>
              ${Ta(a)}<span>${us(this.hass, a)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return d`<div class="row"><button class="pb" @click=${this._act(() => ye(this._getHass, e))}>${bs(20)}<span>${r(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return d`<div class="row"><button class="pb" @click=${this._act(() => ye(this._getHass, e))}>${ke()}<span>${r(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return d`<div class="row"><button class="pb solid" @click=${this._act(() => ye(this._getHass, e))}>${ke()}<span>${r(this.hass, "disarm")}</span></button></div>`;
      default:
        return f;
    }
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${r(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const e = Mt(t), s = !!hs(t), i = Ei(t), n = e === "armed" && !!i, a = n ? rl(i) : void 0, o = Ea(t), l = Zr(t), c = cs(t), h = c != null && l ? c / l : 0, p = `${a ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};` : ""}--p:${h}`, u = s || e === "pending" || e === "triggered" ? Us(28) : n ? In(30) : xs(30), { title: m, status: b } = za(this.hass, t, this._name);
    return d`<div
      class="card ${n ? "on" : "off"} st-${s ? "failed" : e}"
      style=${p}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${m}, ${b}`}
      @click=${this._cardClick}
      @keydown=${(_) => {
      (_.key === "Enter" || _.key === " ") && _.target === _.currentTarget && (_.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(_) => _.preventDefault()}
    >
      <div class="head">
        <span class="icon">${u}</span>
        <div class="text"><span class="name">${m}</span><span class="state">${b}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : f}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
Yt.styles = M`
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
    svg {
      display: block;
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
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      cursor: pointer;
      outline: none;
      transition: background 0.25s, color 0.25s, border-color 0.25s;
      --fg: #fff;
      --fg2: rgba(255, 255, 255, 0.75);
      --ring: transparent;
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
    .missing {
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 13px;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
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
    /* Countdown ring: a conic arc that empties as the delay runs out. */
    .icon::before {
      content: "";
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(var(--ring) calc(var(--p, 0) * 1turn), transparent 0);
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px));
      mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px));
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .name {
      font-size: 17px;
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
    .secs {
      flex: none;
      min-width: 40px;
      text-align: right;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--ring);
      animation: blink 1s ease-in-out infinite;
    }
    .row {
      display: flex;
      gap: 8px;
      flex: none;
    }
    .pb {
      flex: 1;
      min-width: 0;
      height: 48px;
      border-radius: 24px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      transition: transform 0.1s, background 0.2s;
    }
    .pb:active {
      transform: scale(0.97);
    }
    .pb svg {
      width: 20px;
      height: 20px;
      flex: none;
    }
    .pb span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pb.solid {
      background: #fff;
      color: #23233a;
    }
    .pb.grow {
      flex: 1.7;
    }
    .row.three {
      gap: 6px;
    }
    .row.three .pb {
      padding: 0 6px;
      font-size: 13.5px;
    }
    .row.three .pb svg {
      display: none;
    }

    .st-arming {
      --ring: #ffb45c;
    }
    .st-arming .icon {
      color: #ffb45c;
      --pc: #ffb45c;
      animation: pulse 1.2s ease-in-out infinite;
    }
    .st-pending {
      --ring: #fff;
      border-color: rgba(255, 120, 110, 0.9);
      animation: warn 1s ease-in-out infinite;
    }
    .st-pending .icon {
      background: #ff453a;
      --pc: #ff453a;
      animation: pulse 1s ease-in-out infinite;
    }
    .st-triggered {
      background: #ff453a;
      border: 1px solid rgba(255, 255, 255, 0.7);
      animation: flash 0.9s steps(1) infinite;
    }
    .st-triggered .icon {
      background: #fff;
      color: #ff453a;
    }
    .st-triggered .pb.solid {
      color: #b3221b;
    }
    .st-failed .icon {
      color: #ffb45c;
    }
    .st-unavailable {
      opacity: 0.55;
    }
    @keyframes blink {
      50% { opacity: 0.3; }
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--pc) 55%, transparent); }
      60% { box-shadow: 0 0 0 9px color-mix(in srgb, var(--pc) 0%, transparent); }
    }
    @keyframes warn {
      0%, 100% { background: rgba(255, 255, 255, 0.13); }
      50% { background: rgba(255, 69, 58, 0.32); }
    }
    @keyframes flash {
      0%, 100% { background: #ff453a; }
      50% { background: #8f1d17; }
    }
    @media (prefers-reduced-motion: reduce) {
      .card, .card * { animation: none !important; }
    }
  `;
ks([
  y({ attribute: !1 })
], Yt.prototype, "hass", 2);
ks([
  x()
], Yt.prototype, "_config", 2);
ks([
  x()
], Yt.prototype, "_tick", 2);
Yt = ks([
  z(bl)
], Yt);
const Ue = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), Nt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, js = [52, 199, 123], xl = [255, 149, 0], cn = [90, 200, 250], Ps = "#b3261e", vl = "#3a3d4a", dn = (t, e, s, i, n) => `--bg:${Nt(Ue(t, [255, 255, 255], e), 0.95)};--bg-solid:${Nt(Ue(t, [255, 255, 255], e))};--fg:${Nt(Ue(i, [10, 10, 20], 0.8))};--fg2:${Nt(Ue(i, [20, 10, 30], 0.7))};--accent:${Nt(s)};--lk:${n}`;
function fe(t, e) {
  const s = t.states[e.entity], i = $i(t, e), n = rr(t, i), a = yi(t, i.power);
  if (!s || s.state === "unavailable" || s.state === "unknown")
    return { look: "unavailable", locked: !1, car: n, ids: i, kw: a, style: "", tinted: !1 };
  const o = ar(s, !!e.invert);
  let l;
  o ? l = n === "connected" || n === "charging" ? "warn" : "locked" : n === "charging" ? l = "charging" : n === "connected" ? l = "ready" : l = "none";
  const c = l === "charging" ? dn(js, 0.84, js, js, Ps) : l === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${Nt(xl)};--lk:${Ps}` : l === "ready" ? dn(cn, 0.8, cn, [30, 110, 160], Ps) : `--lk:${vl}`;
  return { look: l, locked: o, car: n, ids: i, kw: a, style: c, tinted: l === "charging" || l === "warn" || l === "ready" };
}
function ge(t, e, s) {
  const i = e.kw != null ? `${Y(t, e.kw)} kW` : "";
  switch (e.look) {
    case "charging":
      return s ? i || r(t, "ch_charging") : i ? `${r(t, "ch_charging")} · ${i}` : r(t, "ch_charging");
    case "warn":
      return s ? r(t, "ch_locked") : r(t, "ch_locked_car");
    case "ready":
      return s ? r(t, "ch_connected") : r(t, "ch_ready");
    case "locked":
      return r(t, "ch_locked");
    case "unavailable":
      return r(t, "unavailable");
    default:
      return e.car === "none" ? r(t, "ch_none") : r(t, "ch_unlocked");
  }
}
var yl = Object.defineProperty, wl = Object.getOwnPropertyDescriptor, ee = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? wl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && yl(e, s, n), n;
};
let ut = class extends S {
  constructor() {
    super(...arguments), this.name = "", this._histError = !1;
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Z(19)}</button>` : f;
  }
  updated() {
    if (!this.hass) return;
    const t = $i(this.hass, this.config).power;
    t && t !== this._histFor && (this._histFor = t, this._load(t));
  }
  async _load(t) {
    try {
      const e = Date.now(), s = await Qn(this.hass, t, new Date(e - 7 * 864e5));
      this._sessions = Zn(s, e), this._histError = !1;
    } catch {
      this._histError = !0;
    }
  }
  renderContent() {
    return this._main();
  }
  // ---- Main ---------------------------------------------------------------------
  _main() {
    const t = this.hass, e = t.states[this.config.entity];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = fe(t, this.config), i = Yn(t, s.ids.energy), n = this._sessions?.find((g) => g.live), a = s.look === "charging" && i != null ? r(t, "this_charge", { kwh: `${Y(t, i)} kWh`, time: n ? Xs(Date.now() - n.start) : "" }).replace(/ · $/, "") : i != null ? `${r(t, "last_session")}: ${Y(t, i)} kWh` : "", o = this._sessions ? Jn(this._sessions, 7) : void 0, l = o ? Math.max(...o.map((g) => g.kwh), 0.1) : 1, c = o?.reduce((g, _) => g + _.kwh, 0) ?? 0, h = this._sessions?.length ?? 0, p = [...this._sessions ?? []].reverse().slice(0, 5), u = t.locale?.language ?? t.language ?? void 0, m = (g, _) => _ === 6 ? u?.startsWith("es") ? "Hoy" : "Today" : g.toLocaleDateString(u, { weekday: "narrow" }), b = (g) => {
      const _ = new Date(g), $ = /* @__PURE__ */ new Date(), w = new Date($.getFullYear(), $.getMonth(), $.getDate() - 1), D = _.toLocaleTimeString(u, { hour: "2-digit", minute: "2-digit" }), B = u?.startsWith("es");
      if (_.toDateString() === $.toDateString()) return `${B ? "Hoy" : "Today"} · ${D}`;
      if (_.toDateString() === w.toDateString()) return `${B ? "Ayer" : "Yesterday"} · ${D}`;
      const X = _.toLocaleDateString(u, { weekday: "long", day: "numeric" });
      return `${X.charAt(0).toUpperCase()}${X.slice(1)} · ${D}`;
    };
    return d`
      <div class="status ${s.tinted ? "on" : ""}" style=${s.style}>
        <button class="icon" aria-label=${s.locked ? r(t, "unlock") : r(t, "lock")} @click=${() => Gs(t, e, !s.locked, !!this.config.invert)}>
          ${vs(32)}${s.locked ? d`<span class="lk">${qt(14)}</span>` : f}
        </button>
        <div class="txt"><strong>${ge(t, s, !1)}</strong>${a ? d`<span>${a}</span>` : f}</div>
      </div>
      ${s.look !== "unavailable" ? d`<button class="big ${s.locked ? "solid" : ""}" @click=${() => Gs(t, e, !s.locked, !!this.config.invert)}>
            ${s.locked ? ke() : qt()}<span>${s.locked ? r(t, "unlock") : r(t, "lock")}</span>
          </button>` : f}
      <div class="scroll">
        ${s.ids.power ? d`
              <section>
                <h3>${r(t, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError ? d`<p class="empty">${r(t, "history_unavailable")}</p>` : d`<div class="week">
                          ${(o ?? Array.from({ length: 7 }, (g, _) => ({ day: new Date(Date.now() - (6 - _) * 864e5), kwh: 0 }))).map(
      (g, _) => d`<div>
                              <i class=${_ === 6 ? "today" : g.kwh ? "" : "zero"} style="height:${g.kwh ? Math.max(6, g.kwh / l * 62) : 3}px"></i>
                              <span>${m(g.day, _)}</span>
                            </div>`
    )}
                        </div>
                        <div class="sum"><span>${r(t, "week_total")} <b>${Y(t, c)} kWh</b></span><span>${h} ${u?.startsWith("es") ? h === 1 ? "carga" : "cargas" : h === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${r(t, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? d`<p class="empty">…</p>` : f}
                  ${this._sessions && !p.length ? d`<p class="empty">${r(t, "no_history")}</p>` : f}
                  ${p.map(
      (g) => d`<div class="sess">
                      <span class="dot">${Oo()}</span>
                      <span class="nm">
                        <span>${b(g.start)}${g.live ? d`<em>${r(t, "charging_now")}</em>` : f}</span>
                        <small>${g.live ? `${r(t, "in_progress")} · ` : ""}${Xs(g.end - g.start)}${g.live ? "" : ` · ${r(t, "max_kw", { kw: `${Y(t, g.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${Y(t, g.kwh)} kWh</span>
                    </div>`
    )}
                </div>
              </section>` : f}
      </div>
    `;
  }
};
ut.styles = [
  S.styles,
  M`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
      }
      .status.on {
        background: var(--bg);
      }
      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        position: relative;
      }
      .status.on .icon {
        background: var(--accent);
      }
      .lk {
        position: absolute;
        right: -3px;
        bottom: -3px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: var(--lk, #3a3d4a);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .txt strong {
        font-size: 18px;
      }
      .txt span {
        font-size: 13.5px;
        color: var(--fg2);
      }
      .big {
        flex: none;
        height: 54px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 700;
      }
      .big.solid {
        background: #fff;
        color: #23233a;
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .empty {
        margin: 0;
        padding: 16px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
      }
      .week {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 92px;
        padding: 12px 14px 8px;
        box-sizing: border-box;
      }
      .week div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
      }
      .week i {
        width: 100%;
        max-width: 26px;
        border-radius: 6px 6px 3px 3px;
        background: rgba(52, 199, 123, 0.75);
      }
      .week i.today {
        background: #34c77b;
      }
      .week i.zero {
        background: rgba(255, 255, 255, 0.18);
      }
      .week span {
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: capitalize;
      }
      .sum {
        display: flex;
        justify-content: space-between;
        padding: 0 14px 12px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }
      .sum b {
        color: #fff;
      }
      .sess {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
      }
      .sess + .sess {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .dot {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: #34c77b;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .sess .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
      }
      .sess .nm small {
        font-size: 12.5px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .sess em {
        font-style: normal;
        font-size: 11px;
        font-weight: 700;
        color: #34c77b;
        margin-left: 6px;
      }
      .kwh {
        font-size: 15px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
      }
      .li + .li,
      .picker + .li,
      .li + .picker {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .li .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
      }
      .li .nm small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .val {
        max-width: 55%;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
        transition: background 0.2s;
      }
      .tog::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
      .explain {
        margin: 0;
        border-radius: 16px;
        padding: 12px 14px;
        background: rgba(52, 199, 123, 0.14);
        border: 1px solid rgba(52, 199, 123, 0.35);
        font-size: 14px;
        line-height: 1.5;
      }
      .picker {
        background: rgba(0, 0, 0, 0.12);
        max-height: 320px;
        overflow-y: auto;
        overscroll-behavior: contain;
      }
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 10px;
        height: 40px;
        padding: 0 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.12);
      }
      input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      input.num {
        flex: none;
        width: 80px;
        text-align: right;
        padding: 6px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.12);
      }
      .opt {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        min-height: 48px;
        box-sizing: border-box;
        font-size: 14.5px;
      }
      .opt + .opt {
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }
      .opt small {
        display: block;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.55);
      }
      .opt .ck {
        margin-left: auto;
        color: #34c77b;
        opacity: 0;
      }
      .opt.sel .ck {
        opacity: 1;
      }
      .note {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
      }
    `
];
ee([
  y({ attribute: !1 })
], ut.prototype, "config", 2);
ee([
  y()
], ut.prototype, "name", 2);
ee([
  y({ attribute: !1 })
], ut.prototype, "onSettings", 2);
ee([
  x()
], ut.prototype, "_sessions", 2);
ee([
  x()
], ut.prototype, "_histError", 2);
ut = ee([
  z("terral-charger-dialog")
], ut);
function $l(t, e, s, i) {
  document.querySelector("terral-charger-dialog")?.remove();
  const n = document.createElement("terral-charger-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function kl(t) {
  for (const e of document.querySelectorAll("terral-charger-dialog")) e.hass = t;
}
var Sl = Object.defineProperty, Cl = Object.getOwnPropertyDescriptor, Dt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Cl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Sl(e, s, n), n;
};
const Al = "terral-home-charger";
let J = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._spark = [], this._held = !1, this._toggle = (t) => {
      if (t.stopPropagation(), !this.hass || !this._config) return;
      const e = this.hass.states[this._config.entity];
      if (!e) return;
      const s = fe(this.hass, this._config);
      s.look !== "unavailable" && Gs(this.hass, e, !s.locked, !!this._config.invert);
    }, this._down = (t) => {
      this._held = !1, this._holdStart = { x: t.clientX, y: t.clientY }, clearTimeout(this._holdTimer);
      const e = { x: t.clientX, y: t.clientY, pointerId: t.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", { detail: e, bubbles: !0, composed: !0, cancelable: !0 });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (t) => {
      this._holdStart && Math.hypot(t.clientX - this._holdStart.x, t.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._cardClick = (t) => {
      if (this._held) {
        t.stopPropagation(), t.preventDefault(), this._held = !1;
        return;
      }
      const e = t.currentTarget;
      for (const s of t.composedPath()) {
        if (s === e) break;
        if (s instanceof HTMLElement && s.tagName === "BUTTON") return;
      }
      this._openWindow();
    };
  }
  setConfig(t) {
    if (!t?.entity || !/^(switch|lock|input_boolean)\./.test(String(t.entity)))
      throw new Error("Terral · Cargador: 'entity' must be a switch, lock or input_boolean");
    this._config = t;
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.h === 4 ? "s42" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s42" ? 4 : 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }
  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 }
    ];
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((s) => /^(switch|lock)\./.test(s) && /charg|cargad|wallbox|evse/i.test(s)) ?? "switch.charger" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: ["switch", "lock", "input_boolean"] } } },
        { name: "invert", selector: { boolean: {} } },
        { name: "name", selector: { text: {} } },
        { name: "status_entity", selector: { entity: { domain: ["sensor", "binary_sensor"] } } },
        { name: "power_entity", selector: { entity: { domain: "sensor" } } },
        { name: "energy_entity", selector: { entity: { domain: "sensor" } } },
        { name: "max_power", selector: { number: { min: 1, max: 50, step: 0.1, unit_of_measurement: "kW" } } }
      ],
      computeLabel: (t) => r(void 0, { entity: "charger_entity", invert: "ch_invert", name: "name", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy", max_power: "ch_max" }[t.name] ?? "name")
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._histTimer), this._histTimer = void 0, this._histFor = void 0, this._cancelHold();
  }
  /** Opens the card settings directly, without the window first. */
  openSettings() {
    this._openWindow("settings");
  }
  get _name() {
    return this._config?.name || r(this.hass, "charger");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1 || !this._config) return !0;
    const e = t.get("hass");
    if (!e || !this.hass) return !0;
    const s = fe(this.hass, this._config).ids;
    return [this._config.entity, s.status, s.power, s.energy].some((i) => i && e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (!this.hass || !this._config) return;
    t.has("hass") && kl(this.hass);
    const e = fe(this.hass, this._config);
    if (this._size === "s42" && e.ids.power) {
      this._histFor !== e.ids.power && (this._histFor = e.ids.power, this._loadHistory(e.ids.power), clearInterval(this._histTimer), this._histTimer = window.setInterval(() => this._loadHistory(e.ids.power), 30 * 6e4));
      const s = yi(this.hass, e.ids.power), i = this._spark[this._spark.length - 1];
      if (s != null && (!i || i[1] !== s)) {
        const n = Date.now();
        this._spark = [...this._spark.filter(([a]) => n - a < 36e5), [n, s]], e.look === "charging" && !this._sessionStart && (this._sessionStart = n), e.look !== "charging" && (this._sessionStart = void 0);
      }
    }
  }
  async _loadHistory(t) {
    if (this.hass)
      try {
        const e = Date.now(), s = await Qn(this.hass, t, new Date(e - 7 * 864e5)), i = Zn(s, e);
        this._week = Jn(i, 7).reduce((a, o) => a + o.kwh, 0);
        const n = i.find((a) => a.live);
        this._sessionStart = n?.start, this._spark = s.filter(([a]) => e - a < 36e5);
      } catch {
        this._week = void 0;
      }
  }
  _openWindow(t = "main") {
    if (!this.hass || !this._config) return;
    const e = () => this.hass && this._config && Jt(this, this.hass, "charger", this._config);
    if (t === "settings") return e();
    $l(this.hass, this._config, this._name, e);
  }
  // ---- Render ---------------------------------------------------------------
  _icon(t, e) {
    return d`<button class="icon" aria-label=${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")} ?disabled=${t.look === "unavailable"} @click=${this._toggle}>
      ${vs(e)}
      ${t.locked ? d`<span class="lk">${qt(14)}</span>` : f}
    </button>`;
  }
  _lockBtn(t) {
    return t.look === "unavailable" ? f : d`<button class="pb ${t.locked && t.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${t.locked ? ke(19) : qt(19)}<span>${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")}</span>
    </button>`;
  }
  _sparkline() {
    const t = this._spark;
    if (t.length < 2) return f;
    const e = 300, s = 58, i = Date.now(), n = Math.max(this._config?.max_power ?? 0, ...t.map((c) => c[1]), 1), a = t.map(([c, h]) => [Math.max(0, e - (i - c) / 36e5 * e), s - 4 - h / n * (s - 10)]);
    a.push([e, a[a.length - 1][1]]);
    const o = a.map((c, h) => `${h ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" "), l = a[a.length - 1];
    return v`<svg class="spark" viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${o} L${e} ${s} L${a[0][0]} ${s}Z"></path><path class="l" d=${o}></path><circle cx=${l[0]} cy=${l[1]} r="4"></circle></svg>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass;
    if (!t.states[this._config.entity])
      return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = fe(t, this._config), i = this._size, n = Yn(t, s.ids.energy), a = s.kw != null ? `${Y(t, s.kw)} kW` : "", o = n != null ? `${Y(t, n)} kWh` : "", l = s.look === "charging", c = this._name;
    let h;
    if (i === "s11")
      h = d`${this._icon(s, 22)}<div class="text"><span class="name">${c}</span><span class="state">${ge(t, s, !0)}</span></div>`;
    else if (i === "s21") {
      const p = l && o ? [a, o].filter(Boolean).join(" · ") : ge(t, s, !0);
      h = d`${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${p}</span></div>`;
    } else {
      const p = d`<div class="head">${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${ge(t, s, !1)}</span></div></div>`;
      if (i === "s22")
        h = d`${p}<div class="row">
          ${l && (a || o) ? d`${a ? d`<div class="pb static"><span>${a}</span></div>` : f}
                ${o ? d`<div class="pb static">${Ki()}<span>${o}</span></div>` : f}` : this._lockBtn(s)}
        </div>`;
      else {
        const u = this._sessionStart ?? (s.ids.status ? new Date(t.states[s.ids.status]?.last_changed ?? Date.now()).getTime() : void 0);
        h = d`${p}
          ${l ? d`<div class="chart flow">
                  <div class="chead"><span class="big">${s.kw != null ? Y(t, s.kw) : "–"}<small>kW</small></span><span class="state">${r(t, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${o ? d`<div class="pb static">${Ki()}<span>${o}</span></div>` : f}
                  ${u ? d`<div class="pb static">${jo()}<span>${Xs(Date.now() - u)}</span></div>` : f}
                </div>` : d`<div class="stats">
                ${o ? d`<div class="stat"><b>${o}</b><span>${r(t, "last_session")}</span></div>` : f}
                ${this._week != null ? d`<div class="stat"><b>${Y(t, this._week)} kWh</b><span>${r(t, "this_week")}</span></div>` : f}
              </div>`}
          <div class="spacer"></div>
          <div class="row">${this._lockBtn(s)}</div>`;
      }
    }
    return d`<div
      class="card ${i} ${s.tinted ? "on" : "off"} look-${s.look}"
      style=${s.style}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${c}, ${ge(t, s, !1)}`}
      @click=${this._cardClick}
      @keydown=${(p) => {
      (p.key === "Enter" || p.key === " ") && p.target === p.currentTarget && (p.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(p) => p.preventDefault()}
    >${h}</div>`;
  }
};
J.styles = M`
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
    svg {
      display: block;
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
    .look-unavailable {
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
    .lk {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: var(--lk, #3a3d4a);
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
    .s22 .name,
    .s42 .name {
      font-size: 17px;
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
    .s11 .lk {
      width: 19px;
      height: 19px;
      right: -5px;
      bottom: -5px;
    }
    .s11 .lk svg {
      width: 11px;
      height: 11px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .s42 {
      justify-content: flex-start;
      padding: 16px;
    }
    .spacer {
      flex: 1;
    }
    .row {
      display: flex;
      gap: 8px;
      flex: none;
    }
    .pb {
      flex: 1;
      min-width: 0;
      height: 48px;
      border-radius: 24px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      transition: transform 0.1s;
    }
    button.pb:active {
      transform: scale(0.97);
    }
    .pb.static {
      cursor: inherit;
    }
    .pb svg {
      flex: none;
    }
    .pb span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pb.primary {
      background: var(--fg);
      color: var(--bg-solid, #fff);
    }
    .chart {
      border-radius: 16px;
      padding: 10px 12px;
      background: color-mix(in srgb, var(--fg) 7%, transparent);
    }
    .chead {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .big {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .big small {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0;
      margin-left: 3px;
      color: var(--fg2);
    }
    .spark {
      width: 100%;
      height: 58px;
      margin-top: 4px;
    }
    .spark .l {
      fill: none;
      stroke: #1f9d5e;
      stroke-width: 2.5;
      stroke-linejoin: round;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    .spark .a {
      fill: rgba(52, 199, 123, 0.22);
    }
    .spark circle {
      fill: #1f9d5e;
    }
    /* Moving stripes: only inside the 4/2 chart while charging. */
    .flow {
      position: relative;
      overflow: hidden;
    }
    .flow::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: repeating-linear-gradient(110deg, transparent 0 18px, rgba(30, 160, 95, 0.12) 18px 27px);
      animation: flow 1.2s linear infinite;
    }
    .flow > * {
      position: relative;
      z-index: 1;
    }
    @keyframes flow {
      from { background-position: 0 0; }
      to { background-position: -62px 0; }
    }
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .stat {
      border-radius: 16px;
      background: color-mix(in srgb, var(--fg) 9%, transparent);
      padding: 9px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stat b {
      font-size: 16px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .stat span {
      font-size: 11.5px;
      color: var(--fg2);
      font-weight: 600;
    }
    @media (prefers-reduced-motion: reduce) {
      .flow::after { animation: none; }
    }
  `;
Dt([
  y({ attribute: !1 })
], J.prototype, "hass", 2);
Dt([
  x()
], J.prototype, "_config", 2);
Dt([
  x()
], J.prototype, "_size", 2);
Dt([
  x()
], J.prototype, "_spark", 2);
Dt([
  x()
], J.prototype, "_week", 2);
Dt([
  x()
], J.prototype, "_sessionStart", 2);
J = Dt([
  z(Al)
], J);
var Ml = Object.defineProperty, zl = Object.getOwnPropertyDescriptor, Ss = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? zl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Ml(e, s, n), n;
};
let Vt = class extends N {
  constructor() {
    super(...arguments), this.items = [], this.align = "left", this._key = (t) => t.key === "Escape" && this.remove(), this._swallow = (t) => {
      t.preventDefault(), t.stopPropagation();
    }, this._backdropClick = (t) => {
      this._swallow(t), this.remove();
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._key);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("keydown", this._key);
  }
  updated() {
    const t = this.renderRoot.querySelector(".pop");
    if (!t || !this.anchor) return;
    const e = this.anchor, s = t.offsetWidth, i = t.offsetHeight, n = this.align === "left" ? e.left : e.right - s;
    t.style.left = `${Math.max(8, Math.min(window.innerWidth - s - 8, n))}px`, t.style.top = `${e.top - i - 8 > 8 ? e.top - i - 8 : Math.min(window.innerHeight - i - 8, e.bottom + 8)}px`;
  }
  render() {
    return d`<div class="backdrop" @pointerdown=${this._swallow} @touchmove=${this._swallow} @wheel=${this._swallow} @click=${this._backdropClick}></div>
      <div class="pop" role="menu">
      ${this.items.map(
      (t) => d`<button role="menuitemradio" aria-checked=${!!t.selected} class=${t.selected ? "sel" : ""} @click=${() => {
        t.run(), this.remove();
      }}>${t.icon ?? f}<span>${t.label}</span></button>`
    )}
    </div>`;
  }
};
Vt.styles = M`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(10, 12, 30, 0.35);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      animation: fade 0.15s ease-out;
      touch-action: none;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    .pop {
      position: fixed;
      z-index: 10000;
      min-width: 200px;
      max-height: 60vh;
      overflow-y: auto;
      border-radius: 22px;
      padding: 6px;
      box-sizing: border-box;
      background: rgba(36, 38, 66, 0.94);
      -webkit-backdrop-filter: blur(30px);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
      color: #fff;
    }
    button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border: 0;
      border-radius: 14px;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 15px;
      text-align: left;
      cursor: pointer;
    }
    button.sel {
      background: rgba(255, 255, 255, 0.12);
      font-weight: 700;
    }
    svg {
      display: block;
      flex: none;
    }
  `;
Ss([
  y({ attribute: !1 })
], Vt.prototype, "items", 2);
Ss([
  y({ attribute: !1 })
], Vt.prototype, "anchor", 2);
Ss([
  y()
], Vt.prototype, "align", 2);
Vt = Ss([
  z("terral-pop")
], Vt);
function ni(t, e, s = "left") {
  document.querySelector("terral-pop")?.remove();
  const i = document.createElement("terral-pop");
  return i.items = e, i.anchor = t.getBoundingClientRect(), i.align = s, document.body.appendChild(i), i;
}
var El = Object.defineProperty, Tl = Object.getOwnPropertyDescriptor, Le = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Tl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && El(e, s, n), n;
};
let Et = class extends S {
  constructor() {
    super(...arguments), this.name = "";
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Z(19)}</button>` : f;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  _step(t, e) {
    const s = xe(t, this.config), i = this._pending ?? Zs(t);
    if (i == null) return;
    const n = typeof i == "number" ? $t(i + e * s.step, s) : e > 0 ? { low: i.low, high: $t(i.high + s.step, s) } : { low: $t(i.low - s.step, s), high: i.high };
    this._pending = n, clearTimeout(this._timer), this._timer = window.setTimeout(() => {
      ra(this.hass, t, n), window.setTimeout(() => this._pending = void 0, 2500);
    }, 650);
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = j(t), i = P(e), n = Ht(e, this.config), a = ia(e, this.config), o = this._pending ?? Zs(e), l = ve(e), c = Me(e), h = lt(e), p = pr(e), u = this.config.show_swing === !0 && ea(e), m = e.attributes.swing_mode != null && e.attributes.swing_mode !== "off", b = [l != null ? `${s === "es" ? "Dentro" : "Inside"} ${ct(t, l)}°` : "", ha(t, e)].filter(Boolean).join(" · ");
    return d`
      <div class="status ${i ? "" : "on"}" style=${da(e)}>
        <button class="icon" aria-label=${i ? r(t, "turn_on") : r(t, "turn_off")} ?disabled=${It(e)} @click=${() => i ? ki(t, e) : Si(t, e)}>
          ${Rt(i ? "off" : e.state, 30)}
        </button>
        <div class="txt">
          <strong>${i ? s === "es" ? "Apagado" : "Off" : n ? `${V(s, e.state)} · ${Ee(t, o)}` : V(s, e.state)}</strong>
          ${b ? d`<span>${b}</span>` : f}
        </div>
      </div>
      <div class="scroll">
        <section class=${n ? "" : "dim"}>
          <h3>${r(t, "temperature")}</h3>
          <div class="wstep">
            <button aria-label="−" ?disabled=${!n} @click=${() => this._step(e, -1)}>${mi()}</button>
            <span class="v">${n ? Ee(t, o) : i ? "—" : r(t, "no_temperature")}</span>
            <button aria-label="+" ?disabled=${!n} @click=${() => this._step(e, 1)}>${_i()}</button>
          </div>
        </section>
        ${h.length > 1 ? d`<section>
              <h3>${r(t, "climate_mode")}</h3>
              <div class="grid">
                ${h.map((g) => d`<button class="opt ${!i && e.state === g ? "sel" : ""}" @click=${() => ze(t, e, g)}>${Rt(g, 22)}<span>${V(s, g)}</span></button>`)}
              </div>
            </section>` : f}
        ${c.length ? d`<section class=${a ? "" : "dim"}>
              <h3>${r(t, "climate_fan")}</h3>
              <div class="grid small" style="grid-template-columns:repeat(${Math.min(c.length, 4)},1fr)">
                ${c.map((g) => d`<button class="opt ${e.attributes.fan_mode === g ? "sel" : ""}" ?disabled=${!a} @click=${() => oa(t, e, g)}><span>${Ks(s, g)}</span></button>`)}
              </div>
              ${a ? f : d`<p class="note">${i ? r(t, "climate_off_note") : r(t, "fan_fixed", { mode: V(s, e.state) })}</p>`}
            </section>` : f}
        ${u ? d`<div class="list"><button class="li" role="switch" aria-checked=${m} ?disabled=${i} @click=${() => gr(t, e, !m)}>
              <span class="nm">${r(t, "swing")}</span><span class="tog ${m ? "on" : ""}"></span>
            </button></div>` : f}
        ${p.length ? d`<section>
              <h3>${r(t, "presets")}</h3>
              <div class="grid small">
                ${p.map((g) => d`<button class="opt ${e.attributes.preset_mode === g ? "sel" : ""}" ?disabled=${i} @click=${() => fr(t, e, g)}><span>${Ks(s, g)}</span></button>`)}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
Et.styles = [
  S.styles,
  M`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
      }
      .status.on {
        background: var(--bg);
      }
      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .status.on .icon {
        background: var(--accent);
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .txt strong {
        font-size: 18px;
      }
      .txt span {
        font-size: 13.5px;
        color: var(--fg2);
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .dim {
        opacity: 0.55;
      }
      .wstep {
        height: 54px;
        border-radius: 27px;
        background: rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
      }
      .wstep button {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .wstep .v {
        font-size: 20px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .opt {
        height: 70px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12.5px;
        font-weight: 600;
        text-align: center;
      }
      .grid.small .opt {
        height: 44px;
      }
      .opt.sel {
        background: #fff;
        color: #23233a;
      }
      .note {
        margin: 6px 4px 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.62);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 52px;
        box-sizing: border-box;
      }
      .li .nm {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
      }
      .tog::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
    `
];
Le([
  y({ attribute: !1 })
], Et.prototype, "config", 2);
Le([
  y()
], Et.prototype, "name", 2);
Le([
  y({ attribute: !1 })
], Et.prototype, "onSettings", 2);
Le([
  x()
], Et.prototype, "_pending", 2);
Et = Le([
  z("terral-climate-dialog")
], Et);
function Dl(t, e, s, i) {
  document.querySelector("terral-climate-dialog")?.remove();
  const n = document.createElement("terral-climate-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Ol(t) {
  for (const e of document.querySelectorAll("terral-climate-dialog")) e.hass = t;
}
var jl = Object.defineProperty, Pl = Object.getOwnPropertyDescriptor, Ie = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Pl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && jl(e, s, n), n;
};
const Nl = "terral-home-climate";
class Ll {
  constructor(e) {
    this.onChange = e;
  }
  set(e, s, i) {
    this.value = i, this.onChange(), clearTimeout(this.timer), this.timer = window.setTimeout(() => {
      ra(e, s, i), window.setTimeout(() => {
        this.value = void 0, this.onChange();
      }, 2500);
    }, 650);
  }
}
let Tt = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._tick = 0, this._pending = new Ll(() => this._tick++), this._held = !1, this._dragging = !1, this._power = (t) => {
      t.stopPropagation();
      const e = this._entity;
      !e || !this.hass || It(e) || (P(e) ? ki(this.hass, e) : Si(this.hass, e));
    }, this._modeMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = j(this.hass);
      ni(t.currentTarget, lt(e).map((i) => ({
        label: V(s, i),
        icon: Rt(i, 21),
        selected: !P(e) && e.state === i,
        run: () => ze(this.hass, e, i)
      })));
    }, this._fanMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = j(this.hass);
      ni(t.currentTarget, Me(e).map((i) => ({
        label: Ks(s, i),
        icon: Bs(21),
        selected: e.attributes.fan_mode === i,
        run: () => oa(this.hass, e, i)
      })), "right");
    }, this._dialDown = (t) => {
      const e = this._entity;
      !e || !this._config || !Ht(e, this._config) || (t.stopPropagation(), this._cancelHold(), this._dragging = !0, t.currentTarget.setPointerCapture(t.pointerId), this._dialMove(t));
    }, this._dialMove = (t) => {
      if (!this._dragging || !this.hass || !this._config) return;
      const e = this._entity;
      if (!e) return;
      const s = t.currentTarget.getBoundingClientRect(), i = s.left + s.width / 2, n = s.top + s.height * 100 / 180;
      let o = 225 - Math.atan2(n - t.clientY, t.clientX - i) * 180 / Math.PI;
      o < 0 && (o += 360), o > 300 && (o = 0);
      const l = xe(e, this._config), c = $t(l.min + Math.min(1, o / 270) * (l.max - l.min), l), h = this._target(e);
      h != null && typeof h == "object" ? this._pending.set(this.hass, e, { low: Math.min(h.low, c - l.step), high: c }) : this._pending.set(this.hass, e, c);
    }, this._dialUp = () => {
      this._dragging = !1;
    }, this._down = (t) => {
      this._held = !1, this._holdStart = { x: t.clientX, y: t.clientY }, clearTimeout(this._holdTimer);
      const e = { x: t.clientX, y: t.clientY, pointerId: t.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", { detail: e, bubbles: !0, composed: !0, cancelable: !0 });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (t) => {
      this._holdStart && Math.hypot(t.clientX - this._holdStart.x, t.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._cardClick = (t) => {
      if (this._held) {
        t.stopPropagation(), t.preventDefault(), this._held = !1;
        return;
      }
      const e = t.currentTarget;
      for (const s of t.composedPath()) {
        if (s === e) break;
        if (s instanceof HTMLElement && (s.tagName === "BUTTON" || s.classList.contains("dial"))) return;
      }
      this._openWindow();
    };
  }
  setConfig(t) {
    if (!t?.entity || !String(t.entity).startsWith("climate."))
      throw new Error("Terral · Clima: 'entity' must be a climate entity (climate.xxx)");
    this._config = t;
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.h === 4 ? "s42" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s42" ? 4 : 2;
  }
  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1 };
  }
  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 }
    ];
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("climate.")) ?? "climate.example" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "climate" } } },
        { name: "name", selector: { text: {} } },
        { name: "min_temp", selector: { number: { min: 0, max: 40, step: 0.5 } } },
        { name: "max_temp", selector: { number: { min: 0, max: 40, step: 0.5 } } },
        { name: "temp_step", selector: { select: { options: ["0.5", "1"] } } }
      ]
    };
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  get _name() {
    return this._config?.name || this._entity?.attributes.friendly_name || r(this.hass, "type_climate");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || e.states[this._config.entity] !== this._entity;
  }
  updated(t) {
    if (t.has("hass") && this.hass) {
      Ol(this.hass);
      const e = this._entity;
      e && aa(e);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  _target(t) {
    return this._pending.value ?? Zs(t);
  }
  _step(t) {
    return (e) => {
      e.stopPropagation();
      const s = this._entity;
      if (!s || !this.hass || !this._config) return;
      const i = xe(s, this._config), n = this._target(s);
      n != null && (typeof n == "number" ? this._pending.set(this.hass, s, $t(n + t * i.step, i)) : t > 0 ? this._pending.set(this.hass, s, { low: n.low, high: $t(n.high + i.step, i) }) : this._pending.set(this.hass, s, { low: $t(n.low - i.step, i), high: n.high }));
    };
  }
  _openWindow() {
    !this.hass || !this._config || Dl(this.hass, this._config, this._name, () => this.hass && this._config && Jt(this, this.hass, "climate", this._config));
  }
  // ---- Render -------------------------------------------------------------------
  _pct(t) {
    if (!this._config || !Ht(t, this._config)) return 0;
    const e = xe(t, this._config), s = this._target(t);
    if (s == null) return 0;
    const i = typeof s == "number" ? s : s.high;
    return Math.max(0, Math.min(1, (i - e.min) / (e.max - e.min)));
  }
  _icon(t, e) {
    return d`<button class="icon" aria-label=${P(t) ? r(this.hass, "turn_on") : r(this.hass, "turn_off")} ?disabled=${It(t)} @click=${this._power}>
      ${Rt(P(t) ? "off" : t.state, e)}
    </button>`;
  }
  _modeBtn(t) {
    return lt(t).length < 2 ? f : d`<button class="rbtn" aria-label=${r(this.hass, "climate_mode")} ?disabled=${It(t)} @click=${this._modeMenu}>
      ${Rt(P(t) ? lt(t)[0] ?? "off" : t.state, 22)}
    </button>`;
  }
  _fanBtn(t) {
    const e = Me(t);
    if (!e.length) return f;
    const s = ia(t, this._config), i = t.attributes.fan_mode;
    return d`<button class="rbtn" aria-label=${r(this.hass, "climate_fan")} ?disabled=${!s} @click=${this._fanMenu}>
      ${Bs(22)}${i ? d`<span class="tag">${xr(e, i)}</span>` : f}
    </button>`;
  }
  _stepper(t) {
    const e = this.hass, s = Ht(t, this._config), i = this._target(t), n = ve(t), a = s ? d`<span class="v ${typeof i == "object" ? "range" : ""}">${Ee(e, i)}</span>` : d`<span class="v muted">${P(t) ? n != null ? `${ct(e, n)}° ${j(e) === "es" ? "dentro" : "inside"}` : "—" : r(e, "no_temperature")}</span>`;
    return d`<div class="step ${s ? "" : "dis"}">
      <button aria-label="−" ?disabled=${!s} @click=${this._step(-1)}>${mi()}</button>
      ${a}
      <button aria-label="+" ?disabled=${!s} @click=${this._step(1)}>${_i()}</button>
    </div>`;
  }
  _dial(t) {
    const e = this.hass, s = j(e), i = 86, n = 2 * Math.PI * i, a = n * 0.75, o = this._pct(t), l = (225 - o * 270) * Math.PI / 180, c = 114 + i * Math.cos(l), h = 100 - i * Math.sin(l), p = Ht(t, this._config), u = ve(t), m = u != null ? `${ct(e, u)}°` : "—", b = this._target(t), g = p ? Ee(e, b) : m, _ = P(t) ? `${s === "es" ? "dentro · apagado" : "inside · off"}` : p ? `${V(s, t.state)} · ${s === "es" ? "dentro" : "inside"} ${m}` : `${V(s, t.state)} · ${s === "es" ? "dentro" : "inside"}`;
    return d`<div class="dial ${p ? "" : "disabled"}" @pointerdown=${this._dialDown} @pointermove=${this._dialMove} @pointerup=${this._dialUp} @pointercancel=${this._dialUp}>
      ${v`<svg viewBox="0 0 228 180" aria-hidden="true">
        <circle class="trk" cx="114" cy="100" r=${i} stroke-dasharray="${a} ${n}" transform="rotate(135 114 100)"></circle>
        ${o ? v`<circle class="val" cx="114" cy="100" r=${i} stroke-dasharray="${a * o} ${n}" transform="rotate(135 114 100)"></circle>
          <circle class="thumb" cx=${c} cy=${h} r="12"></circle>` : f}
      </svg>`}
      <div class="mid"><b class=${typeof b == "object" && p ? "range" : ""}>${g}</b><span>${_}</span></div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const s = this._size, i = this._name, n = this._target(e), a = P(e), o = nn(t, e, this._config, n, !1), l = nn(t, e, this._config, n, !0), c = j(t);
    let h;
    if (s === "s11")
      h = d`${this._icon(e, 21)}<div class="text"><span class="name">${i}</span><span class="state">${l}</span></div>`;
    else if (s === "s21") {
      const p = ve(e), u = p != null ? ` · ${ct(t, p)}° ${c === "es" ? "dentro" : "inside"}` : "";
      h = d`${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${a ? o : l + u}</span></div>`;
    } else if (s === "s22")
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${o}</span></div></div>
        <div class="row">${this._modeBtn(e)}${this._stepper(e)}${this._fanBtn(e)}</div>`;
    else {
      const p = ha(t, e), u = a ? c === "es" ? "Apagado" : "Off" : [Qs(c, e.state), p].filter(Boolean).join(" · ");
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${u}</span></div></div>
        ${this._dial(e)}
        <div class="bottom">${this._modeBtn(e) === f ? d`<span></span>` : this._modeBtn(e)}${this._fanBtn(e)}</div>`;
    }
    return d`<div
      class="card ${s} ${a ? "off" : "on"} ${It(e) ? "unavailable" : ""}"
      style=${da(e)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${i}, ${o}`}
      @click=${this._cardClick}
      @keydown=${(p) => {
      (p.key === "Enter" || p.key === " ") && p.target === p.currentTarget && (p.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(p) => p.preventDefault()}
    >${h}</div>`;
  }
};
Tt.styles = M`
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
    .ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      pointer-events: none;
      background: conic-gradient(from 225deg, var(--arc, #fff) calc(var(--p) * 270deg), color-mix(in srgb, var(--fg) 14%, transparent) 0 270deg, transparent 0);
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3.5px));
      mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3.5px));
    }
    .off .ring {
      display: none;
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
    .s22 .name,
    .s42 .name {
      font-size: 17px;
    }
    .state {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    .s11 .ring {
      inset: -3px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: none;
    }
    .rbtn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .rbtn:disabled {
      opacity: 0.4;
    }
    .tag {
      position: absolute;
      right: -2px;
      bottom: -2px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      box-sizing: border-box;
      border-radius: 9px;
      background: var(--fg);
      color: var(--bg-solid, #23233a);
      font-size: 10px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .step {
      flex: 1;
      min-width: 0;
      height: 48px;
      border-radius: 24px;
      padding: 0 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .step.dis {
      opacity: 0.45;
    }
    .step button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .step button:active:not(:disabled) {
      background: color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .v {
      font-size: 18px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .v.range {
      font-size: 15px;
    }
    .v.muted {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--fg2);
    }
    .s42 {
      justify-content: flex-start;
      gap: 8px;
      padding: 16px;
    }
    .dial {
      position: relative;
      width: 228px;
      height: 180px;
      max-width: 100%;
      margin: 0 auto;
      flex: none;
      touch-action: none;
    }
    .dial.disabled {
      cursor: inherit;
    }
    .dial svg {
      width: 100%;
      height: 100%;
    }
    .trk {
      fill: none;
      stroke: color-mix(in srgb, var(--fg) 14%, transparent);
      stroke-width: 13;
      stroke-linecap: round;
    }
    .val {
      fill: none;
      stroke: var(--arc, #fff);
      stroke-width: 13;
      stroke-linecap: round;
    }
    .thumb {
      fill: #fff;
      stroke: rgba(0, 0, 0, 0.15);
      stroke-width: 1;
    }
    .mid {
      position: absolute;
      left: 0;
      right: 0;
      top: 56px;
      text-align: center;
      pointer-events: none;
    }
    .mid b {
      font-size: 46px;
      font-weight: 800;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }
    .mid b.range {
      font-size: 32px;
    }
    .mid span {
      display: block;
      margin-top: 2px;
      font-size: 13px;
      font-weight: 600;
      color: var(--fg2);
    }
    .bottom {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }
    .bottom > * {
      pointer-events: auto;
    }
  `;
Ie([
  y({ attribute: !1 })
], Tt.prototype, "hass", 2);
Ie([
  x()
], Tt.prototype, "_config", 2);
Ie([
  x()
], Tt.prototype, "_size", 2);
Ie([
  x()
], Tt.prototype, "_tick", 2);
Tt = Ie([
  z(Nl)
], Tt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Da = { CHILD: 2 }, Oa = (t) => (...e) => ({ _$litDirective$: t, values: e });
let ja = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, s, i) {
    this._$Ct = e, this._$AM = s, this._$Ci = i;
  }
  _$AS(e, s) {
    return this.update(e, s);
  }
  update(e, s) {
    return this.render(...s);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ai extends ja {
  constructor(e) {
    if (super(e), this.it = f, e.type !== Da.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === f || e == null) return this._t = void 0, this.it = e;
    if (e === dt) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const s = [e];
    return s.raw = s, this._t = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
}
ai.directiveName = "unsafeHTML", ai.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let oi = class extends ai {
};
oi.directiveName = "unsafeSVG", oi.resultType = 2;
const Il = Oa(oi), Hl = (t, e) => `<svg width="${t}" height="${t}" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Ns = (t = 24, e = 24, s = 9) => `<circle cx="${t}" cy="${e}" r="${s}" fill="#FFD25A"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((i) => {
  const n = i * Math.PI / 180, a = (o) => `${(t + Math.cos(n) * o).toFixed(1)} ${(e + Math.sin(n) * o).toFixed(1)}`;
  return `<path d="M${a(s + 4)}L${a(s + 8)}" stroke="#FFD25A" stroke-width="3"/>`;
}).join(""), Ls = (t = 24, e = 22) => `<path d="M${t + 10} ${e + 6}A12 12 0 1 1 ${t - 2} ${e - 11}a9.5 9.5 0 0 0 12 17z" fill="#F4E9B8"/>`, H = (t = 0, e = "#fff") => `<path d="M14 ${36 + t}h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 7.5 7.5 0 0 0-1 18z" fill="${e}"/>`, Be = (t = "#7fc8ff", e = [14, 23, 32]) => e.map((s) => `<path d="M${s} 40l-2 5" stroke="${t}" stroke-width="3"/>`).join(""), hn = (t = [14, 24, 34]) => t.map((e) => `<circle cx="${e}" cy="42" r="2.2" fill="#fff"/>`).join(""), pn = '<path d="M25 30l-5 8h6l-4 8" stroke="#FFD25A" stroke-width="3"/>', Rl = '<path d="M6 18h24a5 5 0 1 0-5-5M6 26h32a5 5 0 1 1-5 5M6 34h16" stroke="#dfe7f3" stroke-width="3.2"/>';
function Wl(t, e) {
  switch (t) {
    case "sunny":
      return e ? Ls() : Ns();
    case "clear-night":
      return Ls();
    case "partlycloudy":
      return (e ? Ls(20, 15) : Ns(18, 17, 7)) + H(2);
    case "cloudy":
      return H(-6, "#cfd8e6") + H(0);
    case "rainy":
      return H(-6) + Be();
    case "pouring":
      return H(-6, "#b9c4d6") + Be("#5fb4ff", [12, 18, 24, 30, 36]);
    case "lightning":
      return H(-6, "#b9c4d6") + pn;
    case "lightning-rainy":
      return H(-6, "#b9c4d6") + pn + Be("#7fc8ff", [14, 34]);
    case "snowy":
      return H(-6) + hn();
    case "snowy-rainy":
      return H(-6) + hn([14, 34]) + Be("#7fc8ff", [24]);
    case "hail":
      return H(-6, "#b9c4d6") + [14, 24, 34].map((s) => `<circle cx="${s}" cy="42" r="2.6" fill="#dfe9ff" stroke="#9fb7e0" stroke-width="1"/>`).join("");
    case "fog":
      return H(-8, "#cfd8e6") + '<path d="M10 36h28M14 42h22" stroke="#cfd8e6" stroke-width="3"/>';
    case "windy":
      return Rl;
    case "windy-variant":
      return H(-8, "#cfd8e6") + '<path d="M8 38h22a4 4 0 1 0-4-4M8 44h14" stroke="#dfe7f3" stroke-width="3"/>';
    default:
      return Ns(24, 24, 7) + H(4, "#cfd8e6");
  }
}
const Q = (t, e = 32, s = !1) => Il(Hl(e, Wl(t, s))), un = {
  sunny: "linear-gradient(180deg,#3a8ee6,#7cc0f5)",
  partlycloudy: "linear-gradient(180deg,#4a8bd0,#9cc4e6)",
  cloudy: "linear-gradient(180deg,#6a7c93,#a2b1c3)",
  rainy: "linear-gradient(180deg,#43546d,#73859c)",
  pouring: "linear-gradient(180deg,#2f3d52,#56677f)",
  lightning: "linear-gradient(180deg,#262c46,#4c4f72)",
  "lightning-rainy": "linear-gradient(180deg,#262c46,#4c4f72)",
  snowy: "linear-gradient(180deg,#7f95b2,#b8c8dc)",
  "snowy-rainy": "linear-gradient(180deg,#6f839d,#a6b6ca)",
  hail: "linear-gradient(180deg,#56657d,#8e9db2)",
  fog: "linear-gradient(180deg,#7d8897,#aab3be)",
  windy: "linear-gradient(180deg,#5a86b8,#9fbad6)",
  "windy-variant": "linear-gradient(180deg,#5f7ea3,#9fb3cc)"
}, fn = {
  sunny: "linear-gradient(180deg,#0e1739,#283a6e)",
  "clear-night": "linear-gradient(180deg,#0e1739,#283a6e)",
  partlycloudy: "linear-gradient(180deg,#141d40,#36477a)",
  cloudy: "linear-gradient(180deg,#232a3b,#454f65)",
  rainy: "linear-gradient(180deg,#1b2233,#394459)",
  pouring: "linear-gradient(180deg,#151b29,#2f394c)",
  snowy: "linear-gradient(180deg,#2a3550,#56688a)",
  fog: "linear-gradient(180deg,#2c3340,#525b6a)"
};
function Pa(t, e) {
  return e ? fn[t] ?? fn.cloudy : un[t] ?? un.partlycloudy;
}
const Na = (t) => ["rainy", "pouring", "lightning-rainy", "snowy-rainy", "hail"].includes(t), La = (t) => t === "snowy" || t === "snowy-rainy", gn = { DAILY: 1, HOURLY: 2 }, fs = (t, e) => (Number(t.attributes.supported_features ?? 0) & (e === "daily" ? gn.DAILY : gn.HOURLY)) !== 0, Is = /* @__PURE__ */ new Map();
function gs(t, e, s, i) {
  const n = `${e}|${s}`;
  let a = Is.get(n);
  if (!a) {
    a = { listeners: /* @__PURE__ */ new Set() }, Is.set(n, a);
    const l = a;
    l.unsub = t.connection.subscribeMessage(
      (c) => {
        l.data = c.forecast ?? [];
        for (const h of l.listeners) h(l.data);
      },
      { type: "weather/subscribe_forecast", forecast_type: s, entity_id: e }
    ).catch(() => {
      l.data = [];
      for (const c of l.listeners) c([]);
      return async () => {
      };
    });
  }
  a.listeners.add(i), a.data && i(a.data);
  const o = a;
  return () => {
    o.listeners.delete(i), o.listeners.size || (Is.delete(n), o.unsub?.then((l) => l()).catch(() => {
    }));
  };
}
function Ia(t, e) {
  if (e.state === "clear-night") return !0;
  const s = t.states["sun.sun"];
  if (s) return s.state === "below_horizon";
  const i = (/* @__PURE__ */ new Date()).getHours();
  return i < 7 || i >= 21;
}
const A = (t) => t == null || t === "" || Number.isNaN(Number(t)) ? null : Number(t), ql = (t) => String(t.attributes.wind_speed_unit ?? "km/h"), Ul = (t) => String(t.attributes.pressure_unit ?? "hPa"), mn = (t) => String(t.attributes.precipitation_unit ?? "mm");
function Ha(t) {
  const e = t?.[0];
  return { hi: A(e?.temperature), lo: A(e?.templow) };
}
function Bl(t, e) {
  if (t?.length) {
    const s = (/* @__PURE__ */ new Date()).toDateString(), i = t.filter((n) => new Date(n.datetime).toDateString() === s).map((n) => A(n.precipitation) ?? 0);
    if (i.length) return i.reduce((n, a) => n + a, 0);
  }
  return A(e?.[0]?.precipitation);
}
const Fl = {
  "clear-night": "Despejado",
  cloudy: "Nublado",
  exceptional: "Excepcional",
  fog: "Niebla",
  hail: "Granizo",
  lightning: "Tormenta eléctrica",
  "lightning-rainy": "Tormenta",
  partlycloudy: "Parcialmente nublado",
  pouring: "Lluvia fuerte",
  rainy: "Lluvia",
  snowy: "Nieve",
  "snowy-rainy": "Aguanieve",
  sunny: "Soleado",
  windy: "Viento",
  "windy-variant": "Viento y nubes"
}, Yl = {
  "clear-night": "Clear",
  cloudy: "Cloudy",
  exceptional: "Exceptional",
  fog: "Fog",
  hail: "Hail",
  lightning: "Lightning",
  "lightning-rainy": "Thunderstorm",
  partlycloudy: "Partly cloudy",
  pouring: "Heavy rain",
  rainy: "Rain",
  snowy: "Snow",
  "snowy-rainy": "Sleet",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy and cloudy"
}, Ra = (t, e) => (t === "es" ? Fl : Yl)[e] ?? e, L = (t, e, s = 0) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Wa = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit" }).replace(/\s?h$/, "");
function ri(t, e, s) {
  const i = new Date(e);
  if (i.toDateString() === (/* @__PURE__ */ new Date()).toDateString()) return s;
  const n = i.toLocaleDateString(t?.locale?.language ?? t?.language ?? void 0, { weekday: "short" }).replace(".", "");
  return n.charAt(0).toUpperCase() + n.slice(1);
}
var Vl = Object.defineProperty, Gl = Object.getOwnPropertyDescriptor, se = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Gl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Vl(e, s, n), n;
};
let ft = class extends S {
  constructor() {
    super(...arguments), this.name = "", this._unsubs = [];
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Z(19)}</button>` : f;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this.hass?.states[this.config.entity];
    t && (fs(t, "hourly") && this._unsubs.push(gs(this.hass, t.entity_id, "hourly", (e) => this._hourly = e)), fs(t, "daily") && this._unsubs.push(gs(this.hass, t.entity_id, "daily", (e) => this._daily = e)));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this._unsubs) t();
    this._unsubs = [];
  }
  renderContent() {
    const t = this.hass, e = t.states[this.config.entity];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = j(t), i = e.state, n = Ia(t, e), a = A(e.attributes.temperature), { hi: o, lo: l } = Ha(this._daily), c = (O) => O != null ? `${L(t, Math.round(O))}°` : "–", h = this.config.animate !== !1, p = this.config.show_details !== !1, u = A(e.attributes.humidity), m = A(e.attributes.wind_speed), b = A(e.attributes.wind_bearing), g = A(e.attributes.pressure), _ = A(e.attributes.cloud_coverage), $ = A(e.attributes.dew_point), w = Bl(this._hourly, this._daily), D = [];
    u != null && D.push([r(t, "humidity"), `${L(t, u)} %`]), m != null && D.push([r(t, "wind"), d`${b != null ? d`<span class="arrow" style="transform:rotate(${b + 180}deg)">↑</span>` : f}${L(t, m)} ${ql(e)}`]), g != null && D.push([r(t, "pressure"), `${L(t, g)} ${Ul(e)}`]), _ != null && D.push([r(t, "clouds"), `${L(t, _)} %`]), $ != null && D.push([r(t, "dew_point"), `${L(t, $, 1)}°`]), w != null && D.push([r(t, "rain_today"), `${L(t, w, 1)} ${mn(e)}`]);
    const B = (this._daily ?? []).slice(0, this.config.forecast_days ?? 7), X = Math.min(...B.map((O) => A(O.templow) ?? A(O.temperature) ?? 0)), Ba = Math.max(...B.map((O) => A(O.temperature) ?? 0)), Li = Math.max(1, Ba - X), Fa = r(t, "today");
    return d`
      <div class="hero" style="background:${Pa(i, n)}">
        ${h && Na(i) ? d`<span class="rainfx"></span>` : h && La(i) ? d`<span class="snowfx"></span>` : f}
        ${Q(i, 64, n)}
        <div class="htxt">
          <span class="temp">${c(a)}</span>
          <strong>${Ra(s, i)}</strong>
          <span>${r(t, "max_short")} ${c(o)} · ${r(t, "min_short")} ${c(l)}</span>
        </div>
      </div>
      <div class="scroll">
        ${p && D.length ? d`<div class="tiles">${D.map(([O, it]) => d`<div class="tile"><small>${O}</small><b>${it}</b></div>`)}</div>` : f}
        ${this._hourly?.length ? d`<section>
              <h3>${r(t, "next_hours")}</h3>
              <div class="list"><div class="hscroll">
                ${this._hourly.slice(0, 24).map((O, it) => {
      const Ot = A(O.precipitation);
      return d`<div class="hour">
                    <span class="h">${it === 0 ? r(t, "now") : Wa(t, O.datetime)}</span>
                    ${Q(O.condition ?? "", 26, O.is_daytime === !1)}
                    <span class="t">${c(A(O.temperature))}</span>
                    <span class="p">${Ot ? `${L(t, Ot, 1)} ${mn(e)}` : ""}</span>
                  </div>`;
    })}
              </div></div>
            </section>` : f}
        ${B.length ? d`<section>
              <h3>${r(t, "next_days")}</h3>
              <div class="list days">
                ${B.map((O) => {
      const it = A(O.templow), Ot = A(O.temperature);
      return d`<div class="day">
                    <span>${ri(t, O.datetime, Fa)}</span>${Q(O.condition ?? "", 24)}
                    <span class="lo">${it != null ? c(it) : ""}</span>
                    <span class="bar"><i style="left:${it != null ? (it - X) / Li * 100 : 0}%;right:${Ot != null ? 100 - (Ot - X) / Li * 100 : 0}%"></i></span>
                    <span>${c(Ot)}</span>
                  </div>`;
    })}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
ft.styles = [
  S.styles,
  M`
      .hero {
        position: relative;
        overflow: hidden;
        flex: none;
        border-radius: 24px;
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 16px;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
      }
      .hero > * {
        position: relative;
      }
      .htxt {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .htxt .temp {
        font-size: 52px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.03em;
        font-variant-numeric: tabular-nums;
      }
      .htxt strong {
        font-size: 16px;
      }
      .htxt span:last-child {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.88);
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .tile {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }
      .tile small {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: rgba(255, 255, 255, 0.6);
      }
      .tile b {
        font-size: 16px;
        font-variant-numeric: tabular-nums;
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }
      .arrow {
        display: inline-block;
        font-size: 15px;
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .hscroll {
        display: flex;
        gap: 14px;
        overflow-x: auto;
        padding: 12px 14px;
        scrollbar-width: none;
        overscroll-behavior-x: contain;
      }
      .hour {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        min-width: 40px;
        font-size: 12px;
        font-weight: 600;
      }
      .hour .h {
        color: rgba(255, 255, 255, 0.7);
      }
      .hour .t {
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .hour .p {
        height: 12px;
        font-size: 10.5px;
        color: #8fd0ff;
        white-space: nowrap;
      }
      .days {
        padding: 6px 14px 10px;
      }
      .day {
        display: grid;
        grid-template-columns: 52px 28px 36px 1fr 36px;
        align-items: center;
        gap: 8px;
        height: 34px;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .day .lo {
        text-align: right;
        color: rgba(255, 255, 255, 0.7);
      }
      .bar {
        height: 5px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.18);
        position: relative;
      }
      .bar i {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 3px;
        background: linear-gradient(90deg, #7fd3ff, #ffd36b, #ff9a56);
      }
      .rainfx {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: repeating-linear-gradient(105deg, transparent 0 14px, rgba(255, 255, 255, 0.14) 14px 15px);
        background-size: 40px 40px;
        animation: rain 0.6s linear infinite;
      }
      @keyframes rain {
        to {
          background-position: -8px 40px;
        }
      }
      .snowfx {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.8;
        background-image: radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 52%), radial-gradient(2px 2px at 70% 60%, #fff 50%, transparent 52%);
        background-size: 120px 120px;
        animation: snow 6s linear infinite;
      }
      @keyframes snow {
        to {
          background-position: 0 120px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .rainfx,
        .snowfx {
          animation: none;
        }
      }
    `
];
se([
  y({ attribute: !1 })
], ft.prototype, "config", 2);
se([
  y()
], ft.prototype, "name", 2);
se([
  y({ attribute: !1 })
], ft.prototype, "onSettings", 2);
se([
  x()
], ft.prototype, "_hourly", 2);
se([
  x()
], ft.prototype, "_daily", 2);
ft = se([
  z("terral-weather-dialog")
], ft);
function Xl(t, e, s, i) {
  document.querySelector("terral-weather-dialog")?.remove();
  const n = document.createElement("terral-weather-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Kl(t) {
  for (const e of document.querySelectorAll("terral-weather-dialog")) e.hass = t;
}
var Ql = Object.defineProperty, Zl = Object.getOwnPropertyDescriptor, ie = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Zl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Ql(e, s, n), n;
};
const Jl = "terral-home-weather";
let gt = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._unsubs = [], this._held = !1, this._down = (t) => {
      this._held = !1, this._holdStart = { x: t.clientX, y: t.clientY }, clearTimeout(this._holdTimer);
      const e = { x: t.clientX, y: t.clientY, pointerId: t.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", { detail: e, bubbles: !0, composed: !0, cancelable: !0 });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (t) => {
      this._holdStart && Math.hypot(t.clientX - this._holdStart.x, t.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._click = (t) => {
      if (this._held) {
        t.stopPropagation(), t.preventDefault(), this._held = !1;
        return;
      }
      this._openWindow();
    };
  }
  setConfig(t) {
    if (!t?.entity || !String(t.entity).startsWith("weather."))
      throw new Error("Terral · Tiempo: 'entity' must be a weather entity (weather.xxx)");
    this._config = t;
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.h === 4 ? "s42" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s42" ? 4 : 2;
  }
  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1 };
  }
  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 }
    ];
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("weather.")) ?? "weather.home" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "weather" } } },
        { name: "name", selector: { text: {} } }
      ]
    };
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  get _name() {
    return this._config?.name || this._entity?.attributes.friendly_name || r(this.hass, "type_weather");
  }
  connectedCallback() {
    super.connectedCallback(), this._subFor = void 0;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribe(), this._cancelHold();
  }
  _unsubscribe() {
    for (const t of this._unsubs) t();
    this._unsubs = [], this._subFor = void 0;
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || e.states[this._config.entity] !== this._entity || e.states["sun.sun"] !== this.hass?.states["sun.sun"];
  }
  updated(t) {
    if (!this.hass || !this._config) return;
    t.has("hass") && Kl(this.hass);
    const e = this._entity;
    !e || !this.isConnected || this._subFor !== e.entity_id && (this._unsubscribe(), this._subFor = e.entity_id, fs(e, "daily") && this._unsubs.push(gs(this.hass, e.entity_id, "daily", (s) => this._daily = s)), fs(e, "hourly") && this._size !== "s11" && this._unsubs.push(gs(this.hass, e.entity_id, "hourly", (s) => this._hourly = s)));
  }
  // ---- Interaction ----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || Xl(this.hass, this._config, this._name, () => this.hass && this._config && Jt(this, this.hass, "weather", this._config));
  }
  // ---- Render ---------------------------------------------------------------------
  _hoursRow(t) {
    const e = this.hass, s = this._config?.forecast_2x2 === "daily" && this._size === "s22", i = s ? this._daily : this._hourly ?? this._daily;
    if (!i?.length) return d`<div class="hours empty"></div>`;
    const n = s || !this._hourly, a = r(e, "today");
    return d`<div class="hours">
      ${i.slice(0, 6).map((o, l) => {
      const c = n ? ri(e, o.datetime, a) : l === 0 ? r(e, "now") : Wa(e, o.datetime), h = !n && o.is_daytime === !1 ? !0 : !n && l === 0 ? t : !1, p = A(o.temperature);
      return d`<div class="hour"><span class="h">${c}</span>${Q(o.condition ?? "", 22, h)}<span class="t">${p != null ? `${L(e, p)}°` : "–"}</span></div>`;
    })}
    </div>`;
  }
  _daysList(t) {
    const e = this.hass, s = this._daily?.slice(0, t) ?? [];
    if (!s.length) return f;
    const i = this._daily.slice(0, 7), n = Math.min(...i.map((c) => A(c.templow) ?? A(c.temperature) ?? 0)), a = Math.max(...i.map((c) => A(c.temperature) ?? 0)), o = Math.max(1, a - n), l = r(e, "today");
    return d`<div class="days">
      ${s.map((c) => {
      const h = A(c.templow), p = A(c.temperature), u = h != null ? (h - n) / o * 100 : 0, m = p != null ? 100 - (p - n) / o * 100 : 0;
      return d`<div class="day">
          <span>${ri(e, c.datetime, l)}</span>${Q(c.condition ?? "", 22)}
          <span class="lo">${h != null ? `${L(e, h)}°` : ""}</span>
          <span class="bar"><i style="left:${u}%;right:${m}%"></i></span>
          <span>${p != null ? `${L(e, p)}°` : ""}</span>
        </div>`;
    })}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = j(t), i = e.state, n = Ia(t, e), a = A(e.attributes.temperature), o = a != null ? `${L(t, Math.round(a))}°` : "–", { hi: l, lo: c } = Ha(this._daily), h = l != null || c != null ? `${r(t, "max_short")} ${l != null ? `${L(t, Math.round(l))}°` : "–"} · ${r(t, "min_short")} ${c != null ? `${L(t, Math.round(c))}°` : "–"}` : "", p = e.state === "unavailable" ? r(t, "unavailable") : Ra(s, i), u = this._name, m = this._config.animate !== !1, b = m && Na(i) ? d`<span class="rainfx"></span>` : m && La(i) ? d`<span class="snowfx"></span>` : f, g = this._size;
    let _;
    if (g === "s11")
      _ = d`${Q(i, 34, n)}<div class="text"><span class="name">${o} · ${u}</span><span class="state">${p}</span></div>`;
    else if (g === "s21")
      _ = d`${b}<div class="top"><span class="temp">${o}</span>${Q(i, 40, n)}</div>
        <div class="text"><span class="name">${u}</span><span class="state">${p}</span>${h ? d`<span class="hl">${h}</span>` : f}</div>`;
    else {
      const $ = g === "s42";
      _ = d`${b}
        <div class="top">
          <div class="text"><span class="name">${u}</span><span class="temp ${$ ? "xl" : "md"}">${o}</span></div>
          <div class="right">${Q(i, $ ? 34 : 30, n)}<span class="cond">${p}</span>${h ? d`<span class="hl">${h}</span>` : f}</div>
        </div>
        ${this._hoursRow(n)}
        ${$ ? d`<div class="sep"></div>${this._daysList(3)}` : f}`;
    }
    return d`<div
      class="card ${g}"
      style="background:${Pa(i, n)}"
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${u}, ${o}, ${p}`}
      @click=${this._click}
      @keydown=${($) => {
      ($.key === "Enter" || $.key === " ") && ($.preventDefault(), this._openWindow());
    }}
      @contextmenu=${($) => $.preventDefault()}
    >${_}</div>`;
  }
};
gt.styles = M`
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
      border-radius: var(--ha-card-border-radius, 22px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      position: relative;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      cursor: pointer;
      outline: none;
      --fg2: rgba(255, 255, 255, 0.85);
    }
    .missing {
      background: rgba(255, 255, 255, 0.13);
      justify-content: center;
      align-items: center;
      font-size: 13px;
    }
    .card > *:not(.rainfx):not(.snowfx) {
      position: relative;
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
    .state,
    .cond {
      font-size: 13px;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cond {
      font-weight: 600;
      color: #fff;
    }
    .hl {
      font-size: 13px;
      font-weight: 600;
      color: var(--fg2);
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .temp {
      font-size: 46px;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .temp.md {
      font-size: 34px;
      margin-top: 1px;
    }
    .temp.xl {
      font-size: 52px;
      font-weight: 300;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      text-align: right;
      min-width: 0;
    }
    .s11 {
      flex-direction: row;
      align-items: center;
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
    .s21 {
      justify-content: space-between;
    }
    .s22 {
      justify-content: space-between;
      padding: 12px 14px;
      gap: 4px;
    }
    .s42 {
      padding: 16px;
    }
    .hours {
      display: flex;
      justify-content: space-between;
      gap: 2px;
      margin-top: auto;
      flex: none;
    }
    .hours.empty {
      height: 56px;
    }
    .hour {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      min-width: 0;
    }
    .hour .h {
      color: var(--fg2);
    }
    .hour .t {
      font-size: 14px;
      font-variant-numeric: tabular-nums;
    }
    .sep {
      height: 1px;
      background: rgba(255, 255, 255, 0.22);
      flex: none;
    }
    .days {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: none;
    }
    .day {
      display: grid;
      grid-template-columns: 46px 26px 34px 1fr 34px;
      align-items: center;
      gap: 8px;
      height: 26px;
      font-size: 13.5px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .day .lo {
      color: var(--fg2);
      text-align: right;
    }
    .bar {
      height: 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.22);
      position: relative;
    }
    .bar i {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 3px;
      background: linear-gradient(90deg, #7fd3ff, #ffd36b, #ff9a56);
    }
    .rainfx {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(105deg, transparent 0 14px, rgba(255, 255, 255, 0.14) 14px 15px);
      background-size: 40px 40px;
      animation: rain 0.6s linear infinite;
      -webkit-mask: linear-gradient(transparent, #000 40%);
      mask: linear-gradient(transparent, #000 40%);
    }
    @keyframes rain {
      to {
        background-position: -8px 40px;
      }
    }
    .snowfx {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.8;
      background-image: radial-gradient(2px 2px at 20% 30%, #fff 50%, transparent 52%), radial-gradient(2px 2px at 70% 60%, #fff 50%, transparent 52%),
        radial-gradient(1.6px 1.6px at 45% 80%, #fff 50%, transparent 52%), radial-gradient(1.6px 1.6px at 85% 20%, #fff 50%, transparent 52%);
      background-size: 120px 120px;
      animation: snow 6s linear infinite;
    }
    @keyframes snow {
      to {
        background-position: 0 120px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .rainfx,
      .snowfx {
        animation: none;
      }
    }
  `;
ie([
  y({ attribute: !1 })
], gt.prototype, "hass", 2);
ie([
  x()
], gt.prototype, "_config", 2);
ie([
  x()
], gt.prototype, "_size", 2);
ie([
  x()
], gt.prototype, "_hourly", 2);
ie([
  x()
], gt.prototype, "_daily", 2);
gt = ie([
  z(Jl)
], gt);
var tc = Object.defineProperty, ec = Object.getOwnPropertyDescriptor, ne = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ec(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && tc(e, s, n), n;
};
const sc = { vacuum: "vac_mode_vacuum", mop: "vac_mode_mop", both: "vac_mode_both" }, _n = /* @__PURE__ */ new Set(["off"]);
let mt = class extends S {
  constructor() {
    super(...arguments), this.name = "", this._rooms = [], this._picked = /* @__PURE__ */ new Set();
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Z(19)}</button>` : f;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  get _p() {
    return this._parts || (this._parts = ua(this.hass, this.config.entity)), this._parts;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this._e;
    t && Er(this.hass, t, this._p).then((e) => this._rooms = e);
  }
  _toggleRoom(t) {
    const e = new Set(this._picked);
    e.has(t) ? e.delete(t) : e.add(t), this._picked = e;
  }
  _start(t) {
    Ct(t) !== "paused" && this._picked.size ? zr(this.hass, t, [...this._picked]) : ue(this.hass, t);
  }
  _seg(t, e, s, i, n = !1) {
    const a = t.length <= 4 ? t.length : 3;
    return d`<div class="seg" style="grid-template-columns:repeat(${a},minmax(0,1fr))">
      ${t.map((o) => d`<button class=${e === o ? "sel" : ""} ?disabled=${n} @click=${() => i(o)}>${s(o)}</button>`)}
    </div>`;
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = this._p, i = Ct(e), n = i === "unavailable", a = i === "cleaning" || i === "returning", o = Cr(t, e, s), l = Ai(e).filter((w) => !_n.has(w)), c = os(t, s.mopIntensity).filter((w) => !_n.has(w)), h = os(t, s.mopMode), p = o.current !== "vacuum" || !o.modes.length, u = o.current !== "mop", m = va(t, e, s, !0, 15), b = fa(t, e, s), g = wa(t, s), _ = ba(t, this.config), $ = (w) => d`<em>${r(t, w)}</em>`;
    return d`
      <div class="status ${zi(i) ? "on" : ""}" style=${xa(i)}>
        <span class="icon">${Ce(30)}${i === "error" ? d`<span class="err">${Wn(14)}</span>` : f}</span>
        <div class="txt">
          <strong>${Qe(t, e, s)}</strong>
          <span>${m ? d`<b class="bat" style="color:${m.color}">${m.icon}${m.text}</b>` : f}${g && (a || i === "paused") ? d` · ${g}` : f}</span>
        </div>
      </div>
      ${i === "error" && b ? d`<p class="alert">${ya(t, b)}</p>` : f}
      <div class="scroll">
        ${o.modes.length ? d`<section>
              <h3>${r(t, "vac_what")}</h3>
              ${this._seg(o.modes, o.current, (w) => r(t, sc[w]), (w) => Ar(t, e, s, w), n)}
            </section>` : f}
        ${l.length && rt(e, "FAN") ? d`<section class=${u ? "" : "dim"}>
              <h3>${r(t, "vac_power")}${u ? f : $("vac_power_off")}</h3>
              ${this._seg(l, e.attributes.fan_speed, (w) => Es(t, w), (w) => Mr(t, e, w), n || !u)}
            </section>` : f}
        ${c.length ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_water")}${p ? f : $("vac_only_mop")}</h3>
              ${this._seg(c, t.states[s.mopIntensity]?.state, (w) => Es(t, w), (w) => on(t, s.mopIntensity, w), n || !p)}
            </section>` : f}
        ${h.length ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_mop_mode")}${p ? f : $("vac_only_mop")}</h3>
              ${this._seg(h, t.states[s.mopMode]?.state, (w) => Es(t, w), (w) => on(t, s.mopMode, w), n || !p)}
            </section>` : f}
        ${this._rooms.length ? d`<section class=${a || i === "paused" ? "dim" : ""}>
              <h3>${r(t, "vac_where")}${a || i === "paused" ? $("vac_rooms_next") : f}</h3>
              <div class="chips">
                <button class=${this._picked.size ? "" : "sel"} ?disabled=${a} @click=${() => this._picked = /* @__PURE__ */ new Set()}>${r(t, "vac_whole_home")}</button>
                ${this._rooms.map((w) => d`<button class=${this._picked.has(w.id) ? "sel" : ""} ?disabled=${a} @click=${() => this._toggleRoom(w.id)}>${w.name}</button>`)}
              </div>
            </section>` : f}
        <div class="actions">
          <button class="go" ?disabled=${n || i === "cleaning"} @click=${() => this._start(e)}>
            ${Ge(18)}${r(t, i === "paused" ? "vac_resume" : this._picked.size ? "vac_start_rooms" : "vac_start_clean", { n: this._picked.size })}
          </button>
          ${rt(e, "PAUSE") ? d`<button class="rb" aria-label=${r(t, "vac_pause")} ?disabled=${!a} @click=${() => Js(t, e)}>${Hn(18)}</button>` : f}
          ${rt(e, "RETURN") ? d`<button class="rb" aria-label=${r(t, "vac_to_base")} ?disabled=${n || i === "docked" || i === "returning"} @click=${() => ti(t, e)}>${es(19)}</button>` : f}
          ${rt(e, "LOCATE") ? d`<button class="rb" aria-label=${r(t, "vac_locate")} ?disabled=${n} @click=${() => _a(t, e)}>${Rn(19)}</button>` : f}
        </div>
        ${i === "docked" ? d`<p class="note">${r(t, "vac_docked_note")}</p>` : i === "cleaning" ? d`<p class="note">${r(t, "vac_cleaning_note")}</p>` : f}
        ${_.length ? d`<section>
              <h3>${r(t, "vac_routines")}</h3>
              <div class="chips">
                ${_.map((w) => {
      const D = rs(t, w, this.name);
      return d`<button ?disabled=${n || i === "cleaning"} @click=${() => ei(t, w)}>${ls(D, 16)}${D}</button>`;
    })}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
mt.styles = [
  S.styles,
  M`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
      }
      .status.on {
        background: var(--bg);
      }
      .icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        position: relative;
      }
      .status.on .icon {
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
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .txt strong {
        font-size: 18px;
      }
      .txt > span {
        font-size: 13.5px;
        color: var(--fg2);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0 4px;
      }
      .bat {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-weight: 600;
      }
      .alert {
        margin: 0;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(224, 86, 75, 0.18);
        border: 1px solid rgba(224, 86, 75, 0.45);
        font-size: 14px;
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      h3 em {
        font-style: normal;
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.5);
      }
      .dim {
        opacity: 0.45;
      }
      .seg {
        display: grid;
        gap: 4px;
        padding: 4px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.1);
      }
      .seg button {
        min-height: 38px;
        border-radius: 18px;
        font-size: 13.5px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        padding: 0 4px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .seg button.sel {
        background: #fff;
        color: #23233a;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chips button {
        height: 40px;
        padding: 0 14px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
      }
      .chips button.sel {
        background: #fff;
        color: #23233a;
      }
      .chips button:disabled {
        opacity: 0.5;
      }
      .actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .go {
        flex: 1;
        min-width: 0;
        height: 50px;
        border-radius: 25px;
        background: #fff;
        color: #23233a;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 15.5px;
        font-weight: 700;
      }
      .rb {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        flex: none;
        background: rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .go:disabled,
      .rb:disabled {
        opacity: 0.35;
      }
      .note {
        margin: -8px 4px 0;
        font-size: 12.5px;
        color: rgba(255, 255, 255, 0.55);
      }
    `
];
ne([
  y({ attribute: !1 })
], mt.prototype, "config", 2);
ne([
  y()
], mt.prototype, "name", 2);
ne([
  y({ attribute: !1 })
], mt.prototype, "onSettings", 2);
ne([
  x()
], mt.prototype, "_rooms", 2);
ne([
  x()
], mt.prototype, "_picked", 2);
mt = ne([
  z("terral-vacuum-dialog")
], mt);
function ic(t, e, s, i) {
  document.querySelector("terral-vacuum-dialog")?.remove();
  const n = document.createElement("terral-vacuum-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function nc(t) {
  for (const e of document.querySelectorAll("terral-vacuum-dialog")) e.hass = t;
}
var ac = Object.defineProperty, oc = Object.getOwnPropertyDescriptor, Cs = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? oc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ac(e, s, n), n;
};
const rc = "terral-home-vacuum";
let Gt = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._held = !1, this._iconTap = (t) => {
      t.stopPropagation();
      const e = this._entity, s = this.hass;
      if (!e || !s) return;
      const i = Ct(e);
      i === "cleaning" || i === "returning" ? Js(s, e) : i === "paused" ? ue(s, e) : i === "docked" || i === "idle" ? this._routinesMenu(t.currentTarget) : this._openWindow();
    }, this._down = (t) => {
      this._held = !1, this._holdStart = { x: t.clientX, y: t.clientY }, clearTimeout(this._holdTimer);
      const e = { x: t.clientX, y: t.clientY, pointerId: t.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", { detail: e, bubbles: !0, composed: !0, cancelable: !0 });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (t) => {
      this._holdStart && Math.hypot(t.clientX - this._holdStart.x, t.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._cardClick = (t) => {
      if (this._held) {
        t.stopPropagation(), t.preventDefault(), this._held = !1;
        return;
      }
      const e = t.currentTarget;
      for (const s of t.composedPath()) {
        if (s === e) break;
        if (s instanceof HTMLElement && s.tagName === "BUTTON") return;
      }
      this._openWindow();
    };
  }
  setConfig(t) {
    if (!t?.entity || !String(t.entity).startsWith("vacuum."))
      throw new Error("Terral · Robot: 'entity' must be a vacuum entity (vacuum.xxx)");
    this._config = t, this._parts = void 0;
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s11" ? 1 : 2;
  }
  getGridOptions() {
    return { columns: 12, rows: 2, min_columns: 3, min_rows: 1 };
  }
  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 }
    ];
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("vacuum.")) ?? "vacuum.example" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "vacuum" } } },
        { name: "name", selector: { text: {} } },
        { name: "routines", selector: { entity: { multiple: !0, domain: ["button", "script"] } } }
      ]
    };
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  /** Sensors / selects of the robot's device (looked up once). */
  get _p() {
    return !this._parts && this.hass && this._config && (this._parts = ua(this.hass, this._config.entity)), this._parts ?? {};
  }
  get _name() {
    return this._config?.name || this._entity?.attributes.friendly_name || r(this.hass, "type_vacuum");
  }
  /** Redraw only when the robot or one of its own sensors changed. */
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || !this.hass ? !0 : [this._config.entity, ...Object.values(this._p), ...rn(this.hass, this._config)].filter(Boolean).some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (t.has("hass") && this.hass) {
      nc(this.hass);
      const e = this._entity;
      e && Sr(this.hass, e, this._p);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  // ---- Actions -----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || ic(this.hass, this._config, this._name, () => this.hass && this._config && Jt(this, this.hass, "vacuum", this._config));
  }
  _routinesMenu(t) {
    const e = this.hass, s = ba(e, this._config);
    if (!s.length) return this._openWindow();
    ni(t, s.map((i) => {
      const n = rs(e, i, this._name);
      return { label: n, icon: ls(n, 21), run: () => ei(e, i) };
    }));
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), this.hass && this._entity && t(this.hass, this._entity);
    };
  }
  // ---- Render -------------------------------------------------------------------
  _icon(t, e, s) {
    const i = e === "cleaning" || e === "returning" ? r(this.hass, "vac_pause") : e === "paused" ? r(this.hass, "vac_resume") : r(this.hass, "vac_routines");
    return d`<button class="icon" aria-label=${i} ?disabled=${e === "unavailable"} @click=${this._iconTap}>
      ${Ce(s)}
      ${e === "error" ? d`<span class="err">${Wn(this._size === "s11" ? 11 : 14)}</span>` : f}
    </button>`;
  }
  _battery(t, e) {
    const s = va(this.hass, t, this._p, e);
    return s ? d`<span class="bat" style="color:${s.color}" aria-label=${`${r(this.hass, "battery")} ${s.pct} %`}>${s.icon}${s.text}</span>` : f;
  }
  _bottom22(t, e) {
    const s = this.hass, i = this._config;
    if (e === "docked" || e === "idle" || e === "unavailable") {
      const o = rn(s, i);
      return o.length ? d`<div class="pills" style="grid-template-columns:repeat(${o.length},minmax(0,1fr))">
        ${o.map((l) => {
        const c = rs(s, l, this._name);
        return d`<button class="pb" ?disabled=${e === "unavailable"} @click=${(h) => {
          h.stopPropagation(), ei(s, l);
        }}>${ls(c, 16)}<span>${c}</span></button>`;
      })}
      </div>` : d`<div class="pills one"><button class="pb" ?disabled=${e === "unavailable"} @click=${this._act(ue)}>${Ge(16)}${r(s, "vac_start")}</button></div>`;
    }
    if (e === "error")
      return d`<div class="row">
        <button class="pb grow" @click=${this._act(ue)}>${Ge(16)}<span>${r(s, "vac_resume")}</span></button>
        ${rt(t, "RETURN") ? d`<button class="pb grow" @click=${this._act(ti)}>${es(17)}<span>${r(s, "vac_to_base")}</span></button>` : f}
        ${rt(t, "LOCATE") ? d`<button class="rb" aria-label=${r(s, "vac_locate")} @click=${this._act(_a)}>${Rn(19)}</button>` : f}
      </div>`;
    const n = Ci(s, this._p), a = wa(s, this._p);
    return d`<div class="row">
      <div class="info">
        ${n != null && e !== "returning" ? d`<div class="track"><i style="width:${n}%"></i></div>` : f}
        <span class="facts">${a || Qe(s, t, this._p)}</span>
      </div>
      ${e === "paused" ? d`<button class="rb on" aria-label=${r(s, "vac_resume")} @click=${this._act(ue)}>${Ge(18)}</button>` : rt(t, "PAUSE") ? d`<button class="rb on" aria-label=${r(s, "vac_pause")} @click=${this._act(Js)}>${Hn(18)}</button>` : f}
      ${rt(t, "RETURN") ? d`<button class="rb" aria-label=${r(s, "vac_to_base")} ?disabled=${e === "returning"} @click=${this._act(ti)}>${es(19)}</button>` : f}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = Ct(e), i = this._size, n = this._name, a = Qe(t, e, this._p);
    let o;
    return i === "s11" ? o = d`${this._icon(e, s, 22)}<div class="text"><span class="name">${n}</span>
        <span class="state line"><span class="grow">${Qe(t, e, this._p, !0)}</span>${this._battery(e, !1)}</span></div>` : i === "s21" ? o = d`${this._icon(e, s, 32)}<div class="text"><span class="name">${n}</span><span class="state">${a}</span>
        <span class="state">${this._battery(e, !0)}</span></div>` : o = d`<div class="head">${this._icon(e, s, 32)}<div class="text"><span class="name">${n}</span><span class="state">${a}</span></div>
          <span class="top">${this._battery(e, !0)}</span></div>
        ${this._bottom22(e, s)}`, d`<div
      class="card ${i} ${zi(s) ? "on" : "off"} ${s === "unavailable" ? "unavailable" : ""}"
      style=${xa(s)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${n}, ${a}`}
      @click=${this._cardClick}
      @keydown=${(l) => {
      (l.key === "Enter" || l.key === " ") && l.target === l.currentTarget && (l.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(l) => l.preventDefault()}
    >${o}</div>`;
  }
};
Gt.styles = M`
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
Cs([
  y({ attribute: !1 })
], Gt.prototype, "hass", 2);
Cs([
  x()
], Gt.prototype, "_config", 2);
Cs([
  x()
], Gt.prototype, "_size", 2);
Gt = Cs([
  z(rc)
], Gt);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: lc } = ho, bn = (t) => t, xn = () => document.createComment(""), de = (t, e, s) => {
  const i = t._$AA.parentNode, n = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const a = i.insertBefore(xn(), n), o = i.insertBefore(xn(), n);
    s = new lc(a, o, t, t.options);
  } else {
    const a = s._$AB.nextSibling, o = s._$AM, l = o !== t;
    if (l) {
      let c;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (c = t._$AU) !== o._$AU && s._$AP(c);
    }
    if (a !== n || l) {
      let c = s._$AA;
      for (; c !== a; ) {
        const h = bn(c).nextSibling;
        bn(i).insertBefore(c, n), c = h;
      }
    }
  }
  return s;
}, xt = (t, e, s = t) => (t._$AI(e, s), t), cc = {}, dc = (t, e = cc) => t._$AH = e, hc = (t) => t._$AH, Hs = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vn = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= s; n++) i.set(t[n], n);
  return i;
}, yn = Oa(class extends ja {
  constructor(t) {
    if (super(t), t.type !== Da.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const n = [], a = [];
    let o = 0;
    for (const l of t) n[o] = i ? i(l, o) : o, a[o] = s(l, o), o++;
    return { values: a, keys: n };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const n = hc(t), { values: a, keys: o } = this.dt(e, s, i);
    if (!Array.isArray(n)) return this.ut = o, a;
    const l = this.ut ??= [], c = [];
    let h, p, u = 0, m = n.length - 1, b = 0, g = a.length - 1;
    for (; u <= m && b <= g; ) if (n[u] === null) u++;
    else if (n[m] === null) m--;
    else if (l[u] === o[b]) c[b] = xt(n[u], a[b]), u++, b++;
    else if (l[m] === o[g]) c[g] = xt(n[m], a[g]), m--, g--;
    else if (l[u] === o[g]) c[g] = xt(n[u], a[g]), de(t, c[g + 1], n[u]), u++, g--;
    else if (l[m] === o[b]) c[b] = xt(n[m], a[b]), de(t, n[u], n[m]), m--, b++;
    else if (h === void 0 && (h = vn(o, b, g), p = vn(l, u, m)), h.has(l[u])) if (h.has(l[m])) {
      const _ = p.get(o[b]), $ = _ !== void 0 ? n[_] : null;
      if ($ === null) {
        const w = de(t, n[u]);
        xt(w, a[b]), c[b] = w;
      } else c[b] = xt($, a[b]), de(t, n[u], $), n[_] = null;
      b++;
    } else Hs(n[m]), m--;
    else Hs(n[u]), u++;
    for (; b <= g; ) {
      const _ = de(t, c[g + 1]);
      xt(_, a[b]), c[b++] = _;
    }
    for (; u <= m; ) {
      const _ = n[u++];
      _ !== null && Hs(_);
    }
    return this.ut = o, dc(t, c), dt;
  }
});
function pc(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const li = ["lights", "climate"], ci = ["lights"], qa = (t) => Array.isArray(t.quick) ? t.quick.filter((e) => li.includes(e)) : ci;
function uc(t, e) {
  const s = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.type !== "light" || !t.states[i.entity]) continue;
    const n = t.states[i.entity].attributes.entity_id;
    Array.isArray(n) && n.length ? n.filter((a) => t.states[a]).forEach((a) => s.add(a)) : s.add(i.entity);
  }
  return [...s];
}
const fc = (t, e) => [...new Set(e.filter((s) => s.type === "climate" && t.states[s.entity]).map((s) => s.entity))];
function Oi(t, e, s) {
  const i = e === "lights" ? uc(t, s) : fc(t, s), n = i.filter((a) => e === "lights" ? t.states[a].state === "on" : !P(t.states[a])).length;
  return { ids: i, on: n };
}
function gc(t, e, s) {
  const { ids: i, on: n } = Oi(t, e, s);
  if (i.length) {
    if (e === "lights") {
      t.callService("light", n ? "turn_off" : "turn_on", {}, { entity_id: i });
      return;
    }
    for (const a of i) {
      const o = t.states[a];
      n && !P(o) ? Si(t, o) : n || ki(t, o);
    }
  }
}
var mc = Object.defineProperty, _c = Object.getOwnPropertyDescriptor, ae = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? _c(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && mc(e, s, n), n;
};
let _t = class extends S {
  constructor() {
    super(...arguments), this._title = "", this._quick = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._title = this.section.title, this._quick = qa(this.section);
  }
  get heading() {
    return this._title || this.section.title;
  }
  _toggle(t) {
    const e = this._quick.includes(t);
    this._quick = li.filter((s) => s === t ? !e : this._quick.includes(s));
  }
  renderContent() {
    const t = this.hass, e = (s) => {
      const i = Oi(t, s, this.section.cards).ids.length, n = this._quick.includes(s) && i > 0;
      return d`<button class="li" role="switch" aria-checked=${n} ?disabled=${!i} @click=${() => this._toggle(s)}>
        <span class="ic">${s === "lights" ? W(!1, 20) : Se(20)}</span>
        <span class="nm">${r(t, s === "lights" ? "quick_lights" : "quick_climate")}<small>${i ? r(t, s === "lights" ? "quick_lights_sub" : "quick_climate_sub", { n: i }) : r(t, "quick_none")}</small></span>
        <span class="tog ${n ? "on" : ""}"></span>
      </button>`;
    };
    return d`
      <div class="scroll">
        <section>
          <h3>${r(t, "general")}</h3>
          <div class="list">
            <label class="li"><span class="nm">${r(t, "name_label")}</span>
              <input class="txt" maxlength="40" .value=${this._title} @input=${(s) => this._title = s.target.value} />
            </label>
          </div>
        </section>
        <section>
          <h3>${r(t, "quick_actions")}</h3>
          <div class="list">${li.map(e)}</div>
          <p class="note">${r(t, "quick_note")}</p>
        </section>
        ${this.onRemove ? d`<button class="remove" @click=${() => {
      this.close(), this.onRemove();
    }}>${r(t, "delete_section")}</button>` : f}
      </div>
      <button class="cta" @click=${() => {
      this.onSave?.({ title: this._title.trim() || this.section.title, quick: this._quick }), this.close();
    }}>${r(t, "save")}</button>
    `;
  }
};
_t.styles = [
  S.styles,
  M`
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
        text-align: left;
      }
      .li + .li {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .li:disabled {
        opacity: 0.45;
      }
      .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
      }
      .nm small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
      .ic {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      input.txt {
        flex: 1;
        min-width: 0;
        text-align: right;
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
        transition: background 0.2s;
      }
      .tog::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
      .note {
        margin: 8px 4px 0;
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.6);
      }
      .remove {
        width: 100%;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        text-align: center;
        font-size: 14.5px;
        font-weight: 600;
        color: #ff8a80;
      }
      .cta {
        flex: none;
        height: 54px;
        border-radius: 27px;
        background: #fff;
        color: #23233a;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        margin-top: 4px;
      }
    `
];
ae([
  y({ attribute: !1 })
], _t.prototype, "section", 2);
ae([
  y({ attribute: !1 })
], _t.prototype, "onSave", 2);
ae([
  y({ attribute: !1 })
], _t.prototype, "onRemove", 2);
ae([
  x()
], _t.prototype, "_title", 2);
ae([
  x()
], _t.prototype, "_quick", 2);
_t = ae([
  z("terral-section-sheet")
], _t);
function bc(t, e, s, i) {
  document.querySelector("terral-section-sheet")?.remove();
  const n = document.createElement("terral-section-sheet");
  return n.hass = t, n.section = e, n.onSave = s, n.onRemove = i, document.body.appendChild(n), n;
}
var xc = Object.defineProperty, vc = Object.getOwnPropertyDescriptor, st = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? vc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && xc(e, s, n), n;
};
const yc = [
  "mdi:home-roof",
  "mdi:home",
  "mdi:view-dashboard",
  "mdi:stairs-up",
  "mdi:stairs-down",
  "mdi:sofa",
  "mdi:bed",
  "mdi:silverware-fork-knife",
  "mdi:tablet",
  "mdi:cellphone",
  "mdi:monitor",
  "mdi:tree",
  "mdi:garage",
  "mdi:account-child",
  "mdi:shield-home",
  "mdi:lightbulb-group"
];
function wn(t) {
  window.history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
let U = class extends S {
  constructor() {
    super(...arguments), this._title = "", this._icon = "", this._admin = !1, this._favOn = !0, this._rows = 2, this._busy = !1;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this.options;
    this._title = t.info.title ?? "", this._icon = t.info.icon ?? (t.mode === "create" ? "mdi:view-dashboard" : ""), this._admin = !!t.info.require_admin, this._favOn = t.favorites.enabled, this._rows = t.favorites.rows;
  }
  get heading() {
    return r(this.hass, this.options.mode === "create" ? "dash_new" : "dash_settings");
  }
  get _isHome() {
    return this.options.info.id === "home";
  }
  async _save() {
    if (this.options.mode === "create" && !this._title.trim()) {
      this._err = r(this.hass, "dash_name_needed");
      return;
    }
    this._busy = !0;
    try {
      await this.options.onSave({
        title: this._title.trim() || void 0,
        icon: this._icon || void 0,
        require_admin: this._admin,
        favorites: { enabled: this._favOn, rows: this._rows }
      }), this.close();
    } catch (e) {
      this._err = e?.message ?? String(e);
    } finally {
      this._busy = !1;
    }
  }
  renderContent() {
    const t = this.hass, e = this.options, s = e.mode === "create", i = e.admin;
    return d`
      <div class="scroll">
        <section>
          <h3>${r(t, "dash_sidebar")}</h3>
          <div class="list">
            <label class="li">
              <span class="nm">${r(t, "name_label")}</span>
              <input class="txt" maxlength="40" .value=${this._title} ?disabled=${!i}
                placeholder=${this._isHome ? "Terral Home" : r(t, "dash_name_ph")}
                @input=${(n) => {
      this._title = n.target.value, this._err = void 0;
    }} />
            </label>
            ${i && !s ? d`<button class="li" role="switch" aria-checked=${this._admin} @click=${() => this._admin = !this._admin}>
                  <span class="nm">${r(t, "dash_admin")}<small>${r(t, "dash_admin_sub")}</small></span><span class="tog ${this._admin ? "on" : ""}"></span>
                </button>` : f}
          </div>
          ${i ? d`<div class="icons">
                ${yc.map(
      (n) => d`<button class="icon ${this._icon === n || !this._icon && this._isHome && n === "mdi:home-roof" ? "sel" : ""}" aria-label=${n} @click=${() => this._icon = n}>
                    <ha-icon .icon=${n}></ha-icon>
                  </button>`
    )}
              </div>` : f}
          <p class="note">${r(t, "dash_sidebar_note")}</p>
        </section>
        ${s ? f : d`<section>
              <h3>${r(t, "fav_title")}</h3>
              <div class="list">
                <button class="li" role="switch" aria-checked=${this._favOn} @click=${() => this._favOn = !this._favOn}>
                  <span class="nm">${r(t, "fav_strip")}<small>${r(t, "fav_strip_sub")}</small></span><span class="tog ${this._favOn ? "on" : ""}"></span>
                </button>
                <div class="li ${this._favOn ? "" : "dim"}">
                  <span class="nm">${r(t, "fav_rows")}<small>${r(t, "fav_rows_sub")}</small></span>
                  <span class="seg">${[1, 2].map((n) => d`<button class=${this._rows === n ? "sel" : ""} ?disabled=${!this._favOn} @click=${() => this._rows = n}>${n}</button>`)}</span>
                </div>
              </div>
              <p class="note">${r(t, "fav_note")}</p>
            </section>`}
        ${this._err ? d`<p class="err">${this._err}</p>` : f}
        ${!s && e.onDelete && i ? d`<button class="remove" @click=${() => ns(t, {
      heading: r(t, "dash_delete_q", { name: this._title || this.options.info.id }),
      message: r(t, "dash_delete_msg"),
      actions: [{ label: r(t, "dash_delete"), danger: !0, run: async () => {
        this.close(), await e.onDelete?.();
      } }]
    })}>${r(t, "dash_delete")}</button>` : f}
      </div>
      <button class="cta" ?disabled=${this._busy} @click=${() => this._save()}>${r(t, s ? "dash_create" : "save")}</button>
    `;
  }
};
U.styles = [
  S.styles,
  M`
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      h3 {
        margin: 2px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .li {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
        text-align: left;
      }
      .li + .li {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .li.dim {
        opacity: 0.45;
      }
      .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
      }
      .nm small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
      input.txt {
        flex: 1;
        min-width: 0;
        text-align: right;
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      input.txt::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      .icons {
        display: grid;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        gap: 6px;
        margin-top: 10px;
      }
      .icon {
        aspect-ratio: 1;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 22px;
      }
      .icon.sel {
        background: #fff;
        color: #23233a;
      }
      .tog {
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        flex: none;
        transition: background 0.2s;
      }
      .tog::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
      .tog.on {
        background: #34c77b;
      }
      .tog.on::after {
        transform: translateX(20px);
      }
      .seg {
        display: flex;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        padding: 3px;
        flex: none;
      }
      .seg button {
        height: 30px;
        min-width: 40px;
        padding: 0 12px;
        border-radius: 15px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
      .seg button.sel {
        background: #fff;
        color: #23233a;
      }
      .note {
        margin: 8px 4px 0;
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.6);
      }
      .err {
        margin: 0 4px;
        font-size: 13.5px;
        color: #ff8a80;
      }
      .remove {
        width: 100%;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        text-align: center;
        font-size: 14.5px;
        font-weight: 600;
        color: #ff8a80;
      }
      .cta {
        flex: none;
        height: 54px;
        border-radius: 27px;
        background: #fff;
        color: #23233a;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        margin-top: 4px;
      }
      .cta:disabled {
        opacity: 0.5;
      }
    `
];
st([
  y({ attribute: !1 })
], U.prototype, "options", 2);
st([
  x()
], U.prototype, "_title", 2);
st([
  x()
], U.prototype, "_icon", 2);
st([
  x()
], U.prototype, "_admin", 2);
st([
  x()
], U.prototype, "_favOn", 2);
st([
  x()
], U.prototype, "_rows", 2);
st([
  x()
], U.prototype, "_busy", 2);
st([
  x()
], U.prototype, "_err", 2);
U = st([
  z("terral-dashboard-sheet")
], U);
function $n(t, e) {
  document.querySelector("terral-dashboard-sheet")?.remove();
  const s = document.createElement("terral-dashboard-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const wc = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function $c(t) {
  return wc[t];
}
var kc = Object.defineProperty, Sc = Object.getOwnPropertyDescriptor, ji = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Sc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && kc(e, s, n), n;
};
const Cc = (t = 20) => v`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>`, Ac = (t = 20) => v`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M5 4v12M19 4v12M5 8h14M5 12h14M5 16h14M12 16v4"></path></svg>`, Mc = (t = 20) => v`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"></path><path d="M12 18l4-6"></path></svg>`, zc = [
  { type: "light", name: "type_light", desc: "type_light_desc", icon: () => W(!0, 20), color: "#ffb020" },
  { type: "alarm", name: "type_alarm", desc: "type_alarm_desc", icon: () => xs(20), color: "rgba(255,255,255,.18)" },
  { type: "charger", name: "ev_charger", desc: "type_charger_desc", icon: () => vs(20), color: "#34c77b" },
  { type: "climate", name: "type_climate", desc: "type_climate_desc", icon: () => Cc(), color: "#4696ff" },
  { type: "weather", name: "type_weather", desc: "type_weather_desc", icon: () => Q("partlycloudy", 26), color: "linear-gradient(180deg,#3a8ee6,#7cc0f5)" },
  { type: "vacuum", name: "type_vacuum", desc: "type_vacuum_desc", icon: () => Ce(21), color: "#22a587" }
], Ec = [
  { name: "type_cover", icon: () => Ac() },
  { name: "type_sensor", icon: () => Mc() }
];
let je = class extends S {
  constructor() {
    super(...arguments), this._q = "";
  }
  get heading() {
    return r(this.hass, "add_card");
  }
  renderContent() {
    const t = this._q.trim().toLowerCase(), e = (a, o) => !t || r(this.hass, a).toLowerCase().includes(t) || o && r(this.hass, o).toLowerCase().includes(t), s = zc.filter((a) => e(a.name, a.desc)), i = (a) => a === "alarm" && !Object.keys(this.hass.states).some((o) => o.startsWith("alarm_control_panel.")) ? "alarm_missing" : a === "climate" && !Object.keys(this.hass.states).some((o) => o.startsWith("climate.")) ? "climate_missing" : a === "weather" && !Object.keys(this.hass.states).some((o) => o.startsWith("weather.")) ? "weather_missing" : a === "vacuum" && !Object.keys(this.hass.states).some((o) => o.startsWith("vacuum.")) ? "vacuum_missing" : void 0, n = Ec.filter((a) => e(a.name));
    return d`
      <label class="search">
        ${Nn()}
        <input type="search" placeholder=${r(this.hass, "search_card_types")} .value=${this._q}
          @input=${(a) => this._q = a.target.value} />
      </label>
      <div class="scroll">
        ${s.length ? d`<section>
              <h3>${r(this.hass, "available")}</h3>
              <div class="list">
                ${s.map((a) => {
      const o = i(a.type);
      return d`<button class="row ${o ? "soon" : ""}" ?disabled=${!!o} @click=${() => {
        this.close(), this.onType?.(a.type);
      }}>
                    <span class="ic" style="background:${o ? "rgba(255,255,255,.14)" : a.color}">${a.icon()}</span>
                    <span class="nm">${r(this.hass, a.name)}<small>${r(this.hass, o ?? a.desc)}</small></span>
                    ${o ? f : d`<span class="chev">${ts(!1, 16)}</span>`}
                  </button>`;
    })}
              </div>
            </section>` : f}
        ${n.length ? d`<section>
              <h3>${r(this.hass, "coming_soon")}</h3>
              <div class="list">
                ${n.map(
      (a) => d`<div class="row soon">
                    <span class="ic">${a.icon()}</span>
                    <span class="nm">${r(this.hass, a.name)}<small>${r(this.hass, "coming_soon")}</small></span>
                  </div>`
    )}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
je.styles = [
  S.styles,
  M`
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.12);
        flex: none;
      }
      input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        background: none;
        color: #fff;
        font: inherit;
        font-size: 16px;
        -webkit-user-select: text;
        user-select: text;
      }
      input::placeholder {
        color: rgba(255, 255, 255, 0.55);
      }
      section + section {
        margin-top: 16px;
      }
      h3 {
        margin: 6px 4px 8px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: rgba(255, 255, 255, 0.6);
      }
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 60px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      button.row:active {
        background: rgba(255, 255, 255, 0.08);
      }
      .soon {
        opacity: 0.45;
      }
      .ic {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .nm {
        flex: 1;
        min-width: 0;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
      }
      .nm small {
        font-size: 13px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .chev {
        opacity: 0.6;
      }
    `
];
ji([
  y({ attribute: !1 })
], je.prototype, "onType", 2);
ji([
  x()
], je.prototype, "_q", 2);
je = ji([
  z("terral-add-sheet")
], je);
function Tc(t, e) {
  const s = document.createElement("terral-add-sheet");
  return s.hass = t, s.onType = e, document.body.appendChild(s), s;
}
var Dc = Object.defineProperty, Oc = Object.getOwnPropertyDescriptor, Pi = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Oc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Dc(e, s, n), n;
};
let Pe = class extends S {
  constructor() {
    super(...arguments), this.actions = {}, this.version = "";
  }
  get heading() {
    return "Terral Home";
  }
  renderContent() {
    return d`
      <div class="list">
        <button class="row" @click=${() => {
      this.actions.onEdit?.(), this.close();
    }}>
          <span class="ic">${$o()}</span><span class="nm">${r(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${Co()}</span>
          <span class="nm">${r(this.hass, "by_rooms")}<small>${r(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onDashboard?.();
    }}>
          <span class="ic">${Z()}</span>
          <span class="nm">${r(this.hass, "dash_settings")}<small>${r(this.hass, "dash_settings_sub")}</small></span>
        </button>
        ${this.actions.onNewDashboard ? d`<button class="row" @click=${() => {
      this.close(), this.actions.onNewDashboard?.();
    }}>
              <span class="ic">${pe(20)}</span>
              <span class="nm">${r(this.hass, "dash_new")}<small>${r(this.hass, "dash_new_sub")}</small></span>
            </button>` : ""}
        <button class="row" disabled>
          <span class="ic">${Z()}</span>
          <span class="nm">${r(this.hass, "terral_settings")}<small>${r(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
Pe.styles = [
  S.styles,
  M`
      .list {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .row {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .row:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
      }
      .row:disabled {
        opacity: 0.55;
      }
      .ic {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .nm {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        flex-direction: column;
      }
      .nm small {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.65);
      }
      .foot {
        margin: 8px 0 0;
        text-align: center;
        font-size: 12px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.5);
      }
    `
];
Pi([
  y({ attribute: !1 })
], Pe.prototype, "actions", 2);
Pi([
  y()
], Pe.prototype, "version", 2);
Pe = Pi([
  z("terral-menu-sheet")
], Pe);
function jc(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const Ua = "0.13.0";
var Pc = Object.defineProperty, Nc = Object.getOwnPropertyDescriptor, T = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Nc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Pc(e, s, n), n;
};
const nt = "top", kn = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], Lc = 0.85, at = 2, Ic = 160, Hc = 184, Rc = 10, he = 22, Sn = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate",
  weather: "terral-home-weather",
  vacuum: "terral-home-vacuum"
}, Wc = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing", "forecast_2x2", "animate", "show_details", "forecast_days", "routines"], Xt = "#3a4f80", Fe = "58,79,128", qc = `linear-gradient(180deg, ${Xt} 0, rgba(${Fe},.6) 36px, rgba(${Fe},0) 120px), linear-gradient(0deg, ${Xt} 0, rgba(${Fe},.6) 28px, rgba(${Fe},0) 96px), `, Rs = Xt, Uc = Xt, Ws = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let C = class extends N {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._lanes = 1, this._laneW = 358, this._pad = 16, this._strip = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config, terral-section-sheet, terral-dashboard-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || Tc(this.hass, (t) => {
        $a(this.hass, Ur(t), {
          mode: "add",
          onBack: () => this._add(),
          onSave: (e) => {
            const s = { id: Ws(), type: e.type, ...e.config, w: e.w, h: e.h };
            this._update((i) => i.cards.push(s));
          }
        });
      });
    }, this._menu = () => {
      if (!this.hass) return;
      const t = this.hass.user?.is_admin !== !1;
      jc(this.hass, this.panel?.config?.version ?? Ua, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms(),
        onDashboard: () => this._dashboardSettings(),
        onNewDashboard: t ? () => this._newDashboard() : void 0
      });
    }, this._addSection = () => {
      const t = Ws();
      this._update((e) => e.sections.push({ id: t, title: r(this.hass, "new_section"), cards: [] })), this._renaming = t;
    }, this._onCardConfig = (t) => {
      const e = t.target, s = [...this._els].find(([, a]) => a === e)?.[0];
      if (!s) return;
      t.preventDefault();
      const { config: i, size: n } = t.detail;
      this._update((a) => {
        for (const o of [a.cards, ...a.sections.map((l) => l.cards)]) {
          const l = o.find((c) => c.id === s);
          if (l) {
            for (const c of Wc)
              i[c] === void 0 || i[c] === "" ? delete l[c] : l[c] = i[c];
            n && (l.w = n.w, l.h = n.h);
          }
        }
      });
    }, this._onCardRemove = (t) => {
      const e = [...this._els].find(([, s]) => s === t.target)?.[0];
      e && this._remove(e);
    }, this._onHold = (t) => {
      const e = t.detail, s = t.composedPath().find((i) => i instanceof HTMLElement && i.dataset.cid != null);
      s && (t.preventDefault(), this._edit = !0, navigator.vibrate?.(12), this._startDrag("card", s.dataset.cid, e.x, e.y));
    }, this._pickMove = (t) => {
      this._pickStart && Math.hypot(t.clientX - this._pickStart.x, t.clientY - this._pickStart.y) > 8 && this._cancelPick();
    }, this._cancelPick = () => {
      clearTimeout(this._pickTimer), this._pickTimer = void 0, this._pickStart = void 0, window.removeEventListener("pointermove", this._pickMove), window.removeEventListener("pointerup", this._cancelPick), window.removeEventListener("pointercancel", this._cancelPick);
    }, this._dragMove = (t) => {
      !this._drag || !this._dragStart || (this._dragDx = t.clientX - this._dragStart.x, this._dragDy = t.clientY - this._dragStart.y, this._drag.kind === "card" ? this._hitCard(t.clientX, t.clientY) : this._hitSection(t.clientX, t.clientY), this._autoScroll(t.clientY));
    }, this._dragUp = () => {
      const t = this._drag, e = Math.hypot(this._dragDx, this._dragDy) > 8, s = this._dropCard, i = this._dropSection;
      this._endDrag(), !(!t || !e) && (t.kind === "card" && s && this._moveCard(t.id, s.key, s.targetId), t.kind === "section" && i != null && this._moveSection(t.id, i));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(([t]) => this._measure(t.contentRect.width)), this._ro.observe(this), this._paintChrome(!0), window.addEventListener("keydown", this._onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), window.removeEventListener("keydown", this._onKey), this._paintChrome(!1), this._unsub?.then((t) => t()).catch(() => {
    }), this._unsub = void 0, this._loading = !1, this._endDrag(), this._cancelPick();
  }
  firstUpdated() {
    this.renderRoot.querySelector(".scroller")?.addEventListener(
      "touchmove",
      (t) => {
        (this._drag || this._resize) && t.cancelable && t.preventDefault();
      },
      { passive: !1 }
    );
  }
  updated(t) {
    if (t.has("panel") && this._dashLoaded && this._dashLoaded !== this._dash && (this._unsub?.then((s) => s()).catch(() => {
    }), this._unsub = void 0, this._layout = void 0, this._loading = !1, this._edit = !1, this._els.clear()), (t.has("hass") || t.has("panel")) && this.hass) {
      !this._layout && !this._loading && this._load();
      for (const s of this._els.values()) s.hass = this.hass;
      Br(this.hass);
    }
    const e = this.renderRoot.querySelector(".grid.strip");
    if (e?.classList.toggle("more", e.scrollWidth - e.scrollLeft - e.clientWidth > 4), e && !e.dataset.watch && (e.dataset.watch = "1", e.addEventListener("scroll", () => e.classList.toggle("more", e.scrollWidth - e.scrollLeft - e.clientWidth > 4), { passive: !0 })), t.has("_renaming") && this._renaming) {
      const s = this.renderRoot.querySelector("input.rename");
      s?.focus(), s?.select();
    }
  }
  /**
   * Only the properties we set are saved and put back, one by one. HA applies
   * its themes (and dark mode) as inline styles on these same elements, so
   * restoring whole style attributes would wipe a theme applied while Terral
   * was open — that left the sidebar half light, half dark.
   */
  _paintChrome(t) {
    const e = document.querySelector('meta[name="theme-color"]'), s = document.documentElement, i = document.body, n = [
      [s, "background", Xt],
      [i, "background", Xt],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", Rs],
      [i, "--app-theme-color", Rs],
      [i, "--primary-background-color", Uc]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: n.map(([a, o]) => [a, o, a.style.getPropertyValue(o), a.style.getPropertyPriority(o)])
      };
      for (const [a, o, l] of n) a.style.setProperty(o, l);
      e && (e.content = Rs), this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [a, o, l, c] of this._chromeSaved.props)
        l ? a.style.setProperty(o, l, c) : a.style.removeProperty(o);
      e && this._chromeSaved.meta != null && (e.content = this._chromeSaved.meta), this._chromeSaved = void 0, this._themeUpdate();
    }
  }
  /** Same message HA's frontend sends after applying a theme. */
  _themeUpdate() {
    const t = this.hass?.auth?.external;
    try {
      t?.fireMessage?.({ type: "theme-update" });
    } catch {
    }
  }
  // ---- Data ---------------------------------------------------------------
  /** Big title: the dashboard's name, or "Mi casa" for the first dashboard until it is renamed. */
  get _title() {
    return this._titleOverride ?? this.panel?.config?.title ?? r(this.hass, "home_title");
  }
  /** Favourites strip settings of this dashboard (on, 2 rows by default). */
  get _favorites() {
    const t = this._layout?.favorites ?? {};
    return { enabled: t.enabled !== !1, rows: t.rows === 1 ? 1 : 2 };
  }
  /** Which dashboard this panel shows ("home" is the first one). */
  get _dash() {
    return this.panel?.config?.dashboard ?? "home";
  }
  async _load() {
    if (this.hass) {
      this._loading = !0, this._dashLoaded = this._dash;
      try {
        this._layout = await this.hass.callWS({ type: "terral_home/layout/get", dashboard: this._dash }), this._error = void 0, this._unsub = this.hass.connection.subscribeMessage(
          (t) => {
            !this._pending && !this._drag && !this._resize && (this._layout = t);
          },
          { type: "terral_home/layout/subscribe", dashboard: this._dash }
        );
      } catch (t) {
        this._error = t?.message ?? String(t), this._loading = !1;
      }
    }
  }
  async _save(t) {
    if (this.hass) {
      this._layout = t, this._pending++;
      try {
        await this.hass.callWS({ type: "terral_home/layout/save", dashboard: this._dash, layout: t }), this._error = void 0;
      } catch (e) {
        this._error = e?.message ?? String(e);
      } finally {
        this._pending--;
      }
    }
  }
  /** Apply a change to a copy of the layout and save it. */
  _update(t) {
    const e = structuredClone(this._layout ?? { cards: [] });
    e.cards ??= [], e.sections ??= [], t(e), this._save(e);
  }
  get _top() {
    return this._layout?.cards ?? [];
  }
  get _sections() {
    return this._layout?.sections ?? [];
  }
  get _allCards() {
    return [...this._top, ...this._sections.flatMap((t) => t.cards)];
  }
  static _list(t, e) {
    return e === nt ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: nt, card: e };
    for (const s of this._sections) {
      const i = s.cards.find((n) => n.id === t);
      if (i) return { key: s.id, card: i };
    }
  }
  // ---- Layout -------------------------------------------------------------
  /**
   * Cards are the same size on phone, tablet and PC: a column is always about
   * as wide as on a phone (COL_MIN–COL_MAX px). Every block (the cards without
   * a section, and each section) is SECTION_COLS columns wide; wider screens
   * fit more blocks side by side ("lanes") instead of stretching the cards.
   */
  _measure(t) {
    const e = t < 600 ? 16 : 24, s = Rc, i = t - 2 * e, n = at * Ic + (at - 1) * s, a = Math.max(1, Math.floor((i + he) / (n + he))), o = (i - (a - 1) * he) / a, l = Math.min(Hc, (o - (at - 1) * s) / at), c = window.__terralRowRatio ?? Lc, h = Math.max(48, Math.round((l - s) / 2 * c));
    this._colW = l, this._gap = s;
    const p = Math.round(at * l + (at - 1) * s);
    at !== this._cols && (this._cols = at), h !== this._rowH && (this._rowH = h), a !== this._lanes && (this._lanes = a), p !== this._laneW && (this._laneW = p), e !== this._pad && (this._pad = e);
  }
  /** Rows a list of cards takes in its 2-column grid (same "row dense" packing as CSS). */
  _rowsOf(t) {
    const e = [], s = (n, a, o, l) => {
      for (let c = n; c < n + l; c++) for (let h = a; h < a + o; h++) if (h >= this._cols || e[c]?.[h]) return !1;
      return !0;
    };
    let i = 0;
    for (const n of t) {
      const { w: a, h: o } = this._sizeOf(n);
      for (let l = 0; ; l++) {
        const c = [...Array(this._cols - a + 1).keys()].find((h) => s(l, h, a, o));
        if (c != null) {
          for (let h = l; h < l + o; h++) for (let p = c; p < c + a; p++) (e[h] ??= [])[p] = !0;
          i = Math.max(i, l + o);
          break;
        }
      }
    }
    return i;
  }
  /** Option A: each block goes to the shortest lane, in order, so there are no gaps. */
  _assignLanes(t) {
    const e = Array.from({ length: this._lanes }, () => ({ h: 0, items: [] }));
    for (const s of t) {
      const i = e.reduce((n, a) => a.h < n.h - 0.01 ? a : n);
      i.items.push(s.item), i.h += Math.max(1, s.rows) * (this._rowH + this._gap) + (s.titled ? 60 : 0);
    }
    return e.map((s) => s.items);
  }
  _sizeOf(t, e = !1) {
    const s = t.h === 1 || t.h === 4 ? t.h : 2, i = s === 4 || t.w === 2 ? 2 : 1;
    return e && this._strip ? this._strip === 1 ? { w: 1, h: 1 } : { w: Math.min(i, 2), h: Math.min(s, 2) } : { w: Math.min(i, this._cols), h: s };
  }
  /** Cards without a section are in the favourites strip right now. */
  _inStrip(t) {
    return t === nt && this._strip > 0;
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t, e = !1) {
    return e && this._strip === 1 ? !1 : (this._els.get(t.id)?.getTerralSizes?.() ?? kn).filter((i) => i.w <= this._cols && (!e || i.h <= this._strip)).length > 1;
  }
  _element(t, e) {
    let s = this._els.get(t.id);
    s || (s = document.createElement(Sn[t.type] ?? "terral-home-light"), this._els.set(t.id, s));
    const { id: i, type: n, w: a, h: o, ...l } = t, { w: c, h } = e ?? { w: a, h: o }, p = { ...l, type: `custom:${Sn[t.type] ?? "terral-home-light"}`, view_layout: { terral: { w: c, h } } }, u = JSON.stringify(p);
    if (s.dataset.cfg !== u) {
      try {
        s.setConfig(p);
      } catch (m) {
        console.warn("Terral Home:", m);
      }
      s.dataset.cfg = u;
    }
    return this.hass && s.hass !== this.hass && (s.hass = this.hass), s;
  }
  // ---- Dashboards -----------------------------------------------------------
  async _dashboardSettings() {
    const t = this.hass;
    if (!t) return;
    const s = (await t.callWS({ type: "terral_home/dashboards/list" }).catch(() => [])).find((i) => i.id === this._dash) ?? { id: this._dash };
    $n(t, {
      mode: "edit",
      info: s,
      favorites: this._favorites,
      admin: t.user?.is_admin !== !1,
      onSave: async ({ title: i, icon: n, require_admin: a, favorites: o }) => {
        const l = this._favorites;
        (o.enabled !== l.enabled || o.rows !== l.rows) && this._update((c) => {
          const h = {};
          o.enabled || (h.enabled = !1), o.rows === 1 && (h.rows = 1), Object.keys(h).length ? c.favorites = h : delete c.favorites;
        }), ((i ?? "") !== (s.title ?? "") || (n ?? "") !== (s.icon ?? "") || !!a != !!s.require_admin) && (await t.callWS({ type: "terral_home/dashboards/update", dashboard: this._dash, title: i || null, icon: n || null, require_admin: !!a }), this._titleOverride = i || void 0);
      },
      onDelete: this._dash === "home" ? void 0 : async () => {
        await t.callWS({ type: "terral_home/dashboards/delete", dashboard: this._dash }), wn("/terral-home");
      }
    });
  }
  _newDashboard() {
    const t = this.hass;
    t && $n(t, {
      mode: "create",
      info: { id: "" },
      favorites: { enabled: !0, rows: 2 },
      admin: !0,
      onSave: async ({ title: e, icon: s }) => {
        const i = await t.callWS({ type: "terral_home/dashboards/create", title: e, icon: s });
        window.setTimeout(() => wn(`/terral-home-${i.id}`), 300);
      }
    });
  }
  _remove(t) {
    this._els.delete(t), this._update((e) => {
      e.cards = e.cards.filter((s) => s.id !== t);
      for (const s of e.sections) s.cards = s.cards.filter((i) => i.id !== t);
    });
  }
  _commitRename(t, e) {
    if (this._renaming !== t) return;
    this._renaming = void 0;
    const s = e.trim(), i = this._sections.find((n) => n.id === t);
    !i || !s || s === i.title || this._update((n) => {
      const a = n.sections.find((o) => o.id === t);
      a && (a.title = s);
    });
  }
  _removeSection(t) {
    const e = this._sections.findIndex((n) => n.id === t), s = this._sections[e];
    if (!s || !this.hass) return;
    const i = (n) => this._update((a) => {
      const o = a.sections.findIndex((c) => c.id === t);
      if (o < 0) return;
      const [l] = a.sections.splice(o, 1);
      n ? (o > 0 ? a.sections[o - 1].cards : a.cards).push(...l.cards) : l.cards.forEach((c) => this._els.delete(c.id));
    });
    if (!s.cards.length) return i(!1);
    ns(this.hass, {
      heading: r(this.hass, "delete_section_q", { name: s.title }),
      message: r(this.hass, "delete_section_msg", { n: s.cards.length }),
      actions: [
        { label: r(this.hass, "keep_cards"), sub: r(this.hass, e > 0 ? "keep_cards_sub" : "keep_cards_sub_top"), run: () => i(!0) },
        { label: r(this.hass, "remove_cards"), danger: !0, run: () => i(!1) }
      ]
    });
  }
  /** One section per HA area; each card with an area moves into it. */
  _confirmRooms() {
    this.hass && ns(this.hass, {
      heading: r(this.hass, "by_rooms"),
      message: r(this.hass, "by_rooms_msg"),
      actions: [{ label: r(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }]
    });
  }
  _sectionsFromRooms() {
    const t = this.hass;
    t && (this._update((e) => {
      const s = new Map(e.sections.map((o) => [o.title.toLowerCase(), o])), i = [e.cards, ...e.sections.map((o) => o.cards)], n = [];
      for (const o of i)
        for (const l of [...o]) {
          const c = Ke(t, l.entity);
          c && (n.push([l, c]), o.splice(o.indexOf(l), 1));
        }
      const a = [...new Set(n.map(([, o]) => o))].filter((o) => !s.has(o.toLowerCase())).sort((o, l) => o.localeCompare(l));
      for (const o of a) {
        const l = { id: Ws(), title: o, cards: [] };
        e.sections.push(l), s.set(o.toLowerCase(), l);
      }
      for (const [o, l] of n) s.get(l.toLowerCase()).cards.push(o);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), n = this._findCard(e.id)?.key === nt && this._strip > 0, a = (this._els.get(e.id)?.getTerralSizes?.() ?? kn).filter((l) => l.w <= this._cols && (!n || l.h <= this._strip));
    this._resizeOrigin = { left: i.left, top: i.top, sizes: a };
    const o = this._sizeOf(e, n);
    this._resize = { id: e.id, w: o.w, h: o.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let n = e.sizes[0], a = 1 / 0;
    for (const o of e.sizes) {
      const l = (o.w - s) ** 2 + (o.h - i) ** 2;
      l < a && ([n, a] = [o, l]);
    }
    (n.w !== this._resize.w || n.h !== this._resize.h) && (this._resize = { ...this._resize, w: n.w, h: n.h }, navigator.vibrate?.(6));
  }
  _resizeUp() {
    const t = this._resize;
    if (this._resize = void 0, this._resizeOrigin = void 0, !t) return;
    const e = this._findCard(t.id);
    if (!e) return;
    const s = this._sizeOf(e.card, this._inStrip(e.key));
    s.w === t.w && s.h === t.h || this._update((i) => {
      const n = C._list(i, e.key)?.find((a) => a.id === t.id);
      n && Object.assign(n, { w: t.w, h: t.h });
    });
  }
  _span(t, e) {
    return t * e + (t - 1) * this._gap;
  }
  _overlayDown(t, e) {
    if (t.target.closest("button")) return;
    if (t.pointerType === "mouse") {
      t.preventDefault(), this._startDrag("card", e, t.clientX, t.clientY);
      return;
    }
    this._cancelPick(), this._pickStart = { x: t.clientX, y: t.clientY };
    const s = { x: t.clientX, y: t.clientY };
    window.addEventListener("pointermove", this._pickMove), window.addEventListener("pointerup", this._cancelPick), window.addEventListener("pointercancel", this._cancelPick), this._pickTimer = window.setTimeout(() => {
      this._cancelPick(), navigator.vibrate?.(10), this._startDrag("card", e, s.x, s.y);
    }, 280);
  }
  _handleDown(t, e) {
    t.preventDefault(), this._renaming = void 0, this._startDrag("section", e, t.clientX, t.clientY);
  }
  _startDrag(t, e, s, i) {
    this._drag = { kind: t, id: e }, this._dropCard = void 0, this._dropSection = void 0, this._dragStart = { x: s, y: i }, this._dragDx = this._dragDy = 0, window.addEventListener("pointermove", this._dragMove), window.addEventListener("pointerup", this._dragUp), window.addEventListener("pointercancel", this._dragUp);
  }
  _hitCard(t, e) {
    const s = this.shadowRoot?.elementsFromPoint(t, e) ?? [], i = s.find((a) => a.dataset?.cid != null && a.dataset.cid !== this._drag?.id);
    if (i) {
      this._dropCard = { key: i.dataset.key, targetId: i.dataset.cid };
      return;
    }
    const n = s.find((a) => a.dataset?.zone != null);
    n && (this._dropCard = { key: n.dataset.zone });
  }
  /** Section drop target: the lane under the finger, then before the first section whose middle is below it. */
  _hitSection(t, e) {
    const s = this._drag?.id, i = this._sections.filter((h) => h.id !== s).map((h) => h.id), n = [...this.renderRoot.querySelectorAll(".lane")];
    if (!n.length) return;
    const a = (h) => {
      const p = h.getBoundingClientRect();
      return Math.abs(t - (p.left + p.width / 2));
    }, o = n.reduce((h, p) => a(p) < a(h) ? p : h), l = [...o.querySelectorAll("section[data-sid]")].filter((h) => h.dataset.sid !== s), c = l.find((h) => {
      const p = h.getBoundingClientRect();
      return p.top + p.height / 2 > e;
    });
    if (c)
      this._dropSection = i.indexOf(c.dataset.sid), this._dropMark = { sid: c.dataset.sid };
    else if (l.length) {
      const h = l[l.length - 1].dataset.sid;
      this._dropSection = i.indexOf(h) + 1, this._dropMark = { sid: h, after: !0 };
    } else
      this._dropSection = i.length, this._dropMark = { lane: n.indexOf(o) };
  }
  _moveCard(t, e, s) {
    const i = this._findCard(t);
    !i || s === t || this._update((n) => {
      const a = C._list(n, i.key), o = a.findIndex((m) => m.id === t), l = s ? a.findIndex((m) => m.id === s) : -1, [c] = a.splice(o, 1), h = C._list(n, e);
      if (!h) {
        a.splice(o, 0, c);
        return;
      }
      if (!s) {
        h.push(c);
        return;
      }
      const p = h.findIndex((m) => m.id === s), u = i.key === e && l > o;
      h.splice(p < 0 ? h.length : p + (u ? 1 : 0), 0, c);
    });
  }
  _moveSection(t, e) {
    const s = this._sections.findIndex((i) => i.id === t);
    s < 0 || s === e || this._update((i) => {
      const n = i.sections.findIndex((o) => o.id === t), [a] = i.sections.splice(n, 1);
      i.sections.splice(Math.min(e, i.sections.length), 0, a);
    });
  }
  _endDrag() {
    window.removeEventListener("pointermove", this._dragMove), window.removeEventListener("pointerup", this._dragUp), window.removeEventListener("pointercancel", this._dragUp), this._drag = void 0, this._dropCard = void 0, this._dropSection = void 0, this._dropMark = void 0, this._dragStart = void 0, this._dragDx = this._dragDy = 0;
  }
  /** Scroll when dragging near the top or bottom edge. */
  _autoScroll(t) {
    const e = this.renderRoot.querySelector(".scroller");
    if (!e || !this._dragStart) return;
    const s = e.getBoundingClientRect(), i = t < s.top + 70 ? -12 : t > s.bottom - 70 ? 12 : 0;
    if (!i) return;
    const n = e.scrollTop;
    e.scrollTop += i;
    const a = e.scrollTop - n;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - a }, this._dragDy += a;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, n = e && !this._allCards.length, a = this._drag?.kind === "card", o = this._drag?.kind === "section", l = s.length > 0 || n || t && (a || !i.length), c = this._favorites, h = c.enabled && this._lanes > 1 && !n && (s.length > 0 || t && i.length > 0);
    this._strip = h ? c.rows : 0;
    const p = [];
    l && !h && p.push({ item: { kind: "top" }, rows: Math.max(this._rowsOf(s), n || t && !i.length ? 2 : 1), titled: !1 });
    for (const _ of i) (t || _.cards.length) && p.push({ item: { kind: "sec", s: _ }, rows: this._rowsOf(_.cards), titled: !0 });
    const u = this._assignLanes(p), m = this._dropMark, b = d`<div class="dropline"></div>`, g = this._lanes * this._laneW + (this._lanes - 1) * he;
    return d`
      <div class="scroller" style="background:${qc}${$c("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${t ? "editing" : ""}" style="max-width:${g + 2 * this._pad}px">
          <div class="top">
            <button class="glass round" aria-label=${r(this.hass, "menu")} @click=${() => pc(this, "hass-toggle-menu")}>
              ${wo()}
            </button>
            <span class="spacer"></span>
            ${t ? d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} @click=${this._add}>${pe(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${r(this.hass, "done")}</button>
                </div>` : d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${pe(22)}</button>
                  <button class="pbtn" aria-label=${r(this.hass, "more_options")} @click=${this._menu}>${ko(22)}</button>
                </div>`}
          </div>
          <h1>${this._title}</h1>
          ${this._error ? d`<p class="notice">${r(this.hass, "panel_error")} (${this._error})</p>` : f}
          ${h ? d`<div class="favs">${this._grid(nt, s, t, !1, s.length === 0 && t ? r(this.hass, "fav_drop") : void 0)}</div>` : f}
          <div class="lanes" style="--lane-gap:${he}px">
            ${u.map(
      (_, $) => d`<div class="lane" style="width:${this._laneW}px">
                ${yn(
        _,
        (w) => w.kind === "top" ? nt : w.s.id,
        (w) => {
          if (w.kind === "top")
            return d`<div class="topblock">${this._grid(nt, s, t, n || t && !i.length, s.length === 0 && t ? r(this.hass, "no_section") : void 0)}</div>`;
          const D = w.s, B = o && this._drag?.id === D.id, X = o && !B && m?.sid === D.id;
          return d`${X && !m?.after ? b : f}${this._section(D, t, B)}${X && m?.after ? b : f}`;
        }
      )}
                ${o && m?.lane === $ ? b : f}
              </div>`
    )}
          </div>
          ${t && e ? d`<button class="addsec" @click=${this._addSection}>${pe(20)}<span>${r(this.hass, "add_section")}</span></button>` : f}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, n = s ? `translate:${this._dragDx}px ${this._dragDy}px` : "";
    return d`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${n}>
      <header>
        ${e ? d`<button class="sdel" aria-label=${r(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${Xi()}</button>` : f}
        ${i ? d`<input
              class="rename"
              .value=${t.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(a) => {
      a.key === "Enter" && this._commitRename(t.id, a.target.value), a.key === "Escape" && (this._renaming = void 0);
    }}
              @blur=${(a) => this._commitRename(t.id, a.target.value)}
            />` : e ? d`<button class="title" aria-label=${r(this.hass, "rename_section")} @click=${() => this._renaming = t.id}>${t.title}</button>` : d`<h2>${t.title}</h2>`}
        ${e ? d`<button class="sgear" aria-label=${r(this.hass, "section_settings")} @click=${() => this._sectionSettings(t)}>${Z(18)}</button>` : this._quickButtons(t)}
        ${e ? d`<button
              class="handle"
              aria-label=${r(this.hass, "move_section")}
              @pointerdown=${(a) => this._handleDown(a, t.id)}
            >${So()}</button>` : f}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? r(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  /** Quick actions on the right of a section title (hidden in move mode). */
  _quickButtons(t) {
    const e = this.hass;
    if (!e) return f;
    const s = qa(t).map((i) => ({ k: i, ...Oi(e, i, t.cards) })).filter((i) => i.ids.length);
    return s.length ? d`<div class="quick">
      ${s.map(
      (i) => d`<button
          class="qb ${i.on ? "on" : ""} ${i.k}"
          aria-label=${r(e, i.k === "lights" ? i.on ? "quick_lights_off" : "quick_lights_on" : i.on ? "quick_climate_off" : "quick_climate_on")}
          @click=${() => gc(e, i.k, t.cards)}
        >${i.k === "lights" ? W(i.on > 0, 21) : Se(20)}${i.on ? d`<span class="n">${i.on}</span>` : f}</button>`
    )}
    </div>` : f;
  }
  _sectionSettings(t) {
    this.hass && bc(
      this.hass,
      t,
      ({ title: e, quick: s }) => this._update((i) => {
        const n = i.sections.find((a) => a.id === t.id);
        n && (n.title = e, s.length === ci.length && s.every((a) => ci.includes(a)) ? delete n.quick : n.quick = s);
      }),
      () => this._removeSection(t.id)
    );
  }
  _grid(t, e, s, i, n) {
    const a = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId, o = this._inStrip(t), l = o ? `grid-auto-flow:column dense;grid-template-rows:repeat(${this._strip},${this._rowH}px);grid-auto-columns:${this._colW}px;gap:${this._gap}px` : `grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px;gap:${this._gap}px`;
    return d`<div
      class="grid ${a ? "zone-target" : ""} ${t === nt ? "top-grid" : ""} ${o ? "strip" : ""}"
      data-zone=${t}
      style=${l}
    >
      ${yn(e, (c) => c.id, (c, h) => this._cell(t, c, h, s))}
      ${n && !e.length ? d`<div class="placeholder" style=${o ? `grid-row:1/-1;width:${this._laneW}px` : "grid-column:1/-1"}>${n}</div>` : f}
      ${i ? d`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${pe(26)}</span><span>${r(this.hass, "add_accessory")}</span>
          </button>` : f}
    </div>`;
  }
  _cell(t, e, s, i) {
    const n = this._sizeOf(e, this._inStrip(t)), { w: a, h: o } = n, l = this._drag?.kind === "card" && this._drag.id === e.id, c = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, h = `grid-column:span ${a};grid-row:span ${o};--d:${s % 5 * -0.07}s;${l ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return d`<div class="cell ${l ? "dragging" : ""} ${c ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${h}>
      ${this._element(e, n)}
      ${i ? d`<div class="overlay" @pointerdown=${(p) => this._overlayDown(p, e.id)}>
            <button class="del" aria-label=${r(this.hass, "delete")} @click=${() => this._remove(e.id)}>${Xi()}</button>
            ${this._canResize(e, this._inStrip(t)) ? d`<button
              class="corner"
              aria-label=${r(this.hass, "resize")}
              @pointerdown=${(p) => this._resizeDown(p, e)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>` : f}
          </div>` : f}
      ${this._resize?.id === e.id ? d`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>` : f}
    </div>`;
  }
};
C.styles = M`
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
T([
  y({ attribute: !1 })
], C.prototype, "hass", 2);
T([
  y({ type: Boolean })
], C.prototype, "narrow", 2);
T([
  y({ attribute: !1 })
], C.prototype, "route", 2);
T([
  y({ attribute: !1 })
], C.prototype, "panel", 2);
T([
  x()
], C.prototype, "_layout", 2);
T([
  x()
], C.prototype, "_error", 2);
T([
  x()
], C.prototype, "_edit", 2);
T([
  x()
], C.prototype, "_cols", 2);
T([
  x()
], C.prototype, "_rowH", 2);
T([
  x()
], C.prototype, "_drag", 2);
T([
  x()
], C.prototype, "_dropCard", 2);
T([
  x()
], C.prototype, "_dropSection", 2);
T([
  x()
], C.prototype, "_dragDx", 2);
T([
  x()
], C.prototype, "_dragDy", 2);
T([
  x()
], C.prototype, "_resize", 2);
T([
  x()
], C.prototype, "_renaming", 2);
T([
  x()
], C.prototype, "_lanes", 2);
T([
  x()
], C.prototype, "_laneW", 2);
T([
  x()
], C.prototype, "_pad", 2);
T([
  x()
], C.prototype, "_dropMark", 2);
T([
  x()
], C.prototype, "_titleOverride", 2);
C = T([
  z("terral-home-panel")
], C);
const I = window;
I.customCards = I.customCards || [];
I.customCards.some((t) => t.type === "terral-home-light") || I.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: e } } : null
});
I.customCards.some((t) => t.type === "terral-home-alarm") || I.customCards.push({
  type: "terral-home-alarm",
  name: "Terral · Alarma",
  description: "Alarma (Alarmo u otra) al estilo Terral Home / Terral Home alarm (Alarmo or any alarm panel)",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("alarm_control_panel.") ? { config: { type: "custom:terral-home-alarm", entity: e } } : null
});
I.customCards.some((t) => t.type === "terral-home-charger") || I.customCards.push({
  type: "terral-home-charger",
  name: "Terral · Cargador",
  description: "Cargador de coche eléctrico al estilo Terral Home / Terral Home EV charger",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
I.customCards.some((t) => t.type === "terral-home-climate") || I.customCards.push({
  type: "terral-home-climate",
  name: "Terral · Clima",
  description: "Aire acondicionado, calefacción o bomba de calor al estilo Terral Home / Terral Home climate",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
I.customCards.some((t) => t.type === "terral-home-weather") || I.customCards.push({
  type: "terral-home-weather",
  name: "Terral · Tiempo",
  description: "El tiempo y su previsión al estilo Terral Home / Terral Home weather and forecast",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
I.customCards.some((t) => t.type === "terral-home-vacuum") || I.customCards.push({
  type: "terral-home-vacuum",
  name: "Terral · Robot",
  description: "Robot aspirador / friegasuelos (Roborock y otros) al estilo Terral Home / Terral Home robot vacuum",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("vacuum.") ? { config: { type: "custom:terral-home-vacuum", entity: e } } : null
});
console.info(
  `%c TERRAL HOME %c v${Ua} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  Ua as VERSION
};
