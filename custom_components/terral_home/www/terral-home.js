/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = globalThis, ni = We.ShadowRoot && (We.ShadyCSS === void 0 || We.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ai = Symbol(), zi = /* @__PURE__ */ new WeakMap();
let fn = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== ai) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (ni && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = zi.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && zi.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Na = (t) => new fn(typeof t == "string" ? t : t + "", void 0, ai), z = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[a + 1], t[0]);
  return new fn(s, t, ai);
}, La = (t, e) => {
  if (ni) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), n = We.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, t.appendChild(i);
  }
}, Ei = ni ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Na(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ia, defineProperty: Ra, getOwnPropertyDescriptor: Ha, getOwnPropertyNames: Wa, getOwnPropertySymbols: Ua, getPrototypeOf: Ba } = Object, ds = globalThis, Ti = ds.trustedTypes, Fa = Ti ? Ti.emptyScript : "", qa = ds.reactiveElementPolyfillSupport, he = (t, e) => t, Ve = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Fa : null;
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
} }, oi = (t, e) => !Ia(t, e), Di = { attribute: !0, type: String, converter: Ve, reflect: !1, useDefault: !1, hasChanged: oi };
Symbol.metadata ??= Symbol("metadata"), ds.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Tt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Di) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, s);
      n !== void 0 && Ra(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: n, set: a } = Ha(this.prototype, e) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: n, set(o) {
      const c = n?.call(this);
      a?.call(this, o), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Di;
  }
  static _$Ei() {
    if (this.hasOwnProperty(he("elementProperties"))) return;
    const e = Ba(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(he("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(he("properties"))) {
      const s = this.properties, i = [...Wa(s), ...Ua(s)];
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
      for (const n of i) s.unshift(Ei(n));
    } else e !== void 0 && s.push(Ei(e));
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
    return La(e, this.constructor.elementStyles), e;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : Ve).toAttribute(s, i.type);
      this._$Em = e, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Ve;
      this._$Em = n;
      const c = o.fromAttribute(s, a.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, n = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? oi)(a, s) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
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
        const { wrapped: o } = a, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, a, c);
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
Tt.elementStyles = [], Tt.shadowRootOptions = { mode: "open" }, Tt[he("elementProperties")] = /* @__PURE__ */ new Map(), Tt[he("finalized")] = /* @__PURE__ */ new Map(), qa?.({ ReactiveElement: Tt }), (ds.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ri = globalThis, Oi = (t) => t, Ge = ri.trustedTypes, ji = Ge ? Ge.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, mn = "$lit$", tt = `lit$${Math.random().toFixed(9).slice(2)}$`, _n = "?" + tt, Ya = `<${_n}>`, bt = document, _e = () => bt.createComment(""), be = (t) => t === null || typeof t != "object" && typeof t != "function", li = Array.isArray, Va = (t) => li(t) || typeof t?.[Symbol.iterator] == "function", vs = `[ 	
\f\r]`, ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pi = /-->/g, Ni = />/g, pt = RegExp(`>|${vs}(?:([^\\s"'>=/]+)(${vs}*=${vs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Li = /'/g, Ii = /"/g, bn = /^(?:script|style|textarea|title)$/i, xn = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = xn(1), x = xn(2), nt = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Ri = /* @__PURE__ */ new WeakMap(), ft = bt.createTreeWalker(bt, 129);
function yn(t, e) {
  if (!li(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ji !== void 0 ? ji.createHTML(e) : e;
}
const Ga = (t, e) => {
  const s = t.length - 1, i = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = ee;
  for (let c = 0; c < s; c++) {
    const l = t[c];
    let h, p, u = -1, m = 0;
    for (; m < l.length && (o.lastIndex = m, p = o.exec(l), p !== null); ) m = o.lastIndex, o === ee ? p[1] === "!--" ? o = Pi : p[1] !== void 0 ? o = Ni : p[2] !== void 0 ? (bn.test(p[2]) && (n = RegExp("</" + p[2], "g")), o = pt) : p[3] !== void 0 && (o = pt) : o === pt ? p[0] === ">" ? (o = n ?? ee, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, h = p[1], o = p[3] === void 0 ? pt : p[3] === '"' ? Ii : Li) : o === Ii || o === Li ? o = pt : o === Pi || o === Ni ? o = ee : (o = pt, n = void 0);
    const b = o === pt && t[c + 1].startsWith("/>") ? " " : "";
    a += o === ee ? l + Ya : u >= 0 ? (i.push(h), l.slice(0, u) + mn + l.slice(u) + tt + b) : l + tt + (u === -2 ? c : b);
  }
  return [yn(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
let Ns = class vn {
  constructor({ strings: e, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const c = e.length - 1, l = this.parts, [h, p] = Ga(e, s);
    if (this.el = vn.createElement(h, i), ft.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = ft.nextNode()) !== null && l.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(mn)) {
          const m = p[o++], b = n.getAttribute(u).split(tt), f = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: a, name: f[2], strings: b, ctor: f[1] === "." ? Ka : f[1] === "?" ? Qa : f[1] === "@" ? Za : hs }), n.removeAttribute(u);
        } else u.startsWith(tt) && (l.push({ type: 6, index: a }), n.removeAttribute(u));
        if (bn.test(n.tagName)) {
          const u = n.textContent.split(tt), m = u.length - 1;
          if (m > 0) {
            n.textContent = Ge ? Ge.emptyScript : "";
            for (let b = 0; b < m; b++) n.append(u[b], _e()), ft.nextNode(), l.push({ type: 2, index: ++a });
            n.append(u[m], _e());
          }
        }
      } else if (n.nodeType === 8) if (n.data === _n) l.push({ type: 2, index: a });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(tt, u + 1)) !== -1; ) l.push({ type: 7, index: a }), u += tt.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const i = bt.createElement("template");
    return i.innerHTML = e, i;
  }
};
function Lt(t, e, s = t, i) {
  if (e === nt) return e;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const a = be(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(t), n._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = n : s._$Cl = n), n !== void 0 && (e = Lt(t, n._$AS(t, e.values), n, i)), e;
}
class Xa {
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
    const { el: { content: s }, parts: i } = this._$AD, n = (e?.creationScope ?? bt).importNode(s, !0);
    ft.currentNode = n;
    let a = ft.nextNode(), o = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let h;
        l.type === 2 ? h = new Yt(a, a.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (h = new Ja(a, this, e)), this._$AV.push(h), l = i[++c];
      }
      o !== l?.index && (a = ft.nextNode(), o++);
    }
    return ft.currentNode = bt, n;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Yt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, n) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    e = Lt(this, e, s), be(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== nt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Va(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && be(this._$AH) ? this._$AA.nextSibling.data = e : this.T(bt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Ns.createElement(yn(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const a = new Xa(n, this), o = a.u(this.options);
      a.p(s), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let s = Ri.get(e.strings);
    return s === void 0 && Ri.set(e.strings, s = new Ns(e)), s;
  }
  k(e) {
    li(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const a of e) n === s.length ? s.push(i = new Yt(this.O(_e()), this.O(_e()), this, this.options)) : i = s[n], i._$AI(a), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = Oi(e).nextSibling;
      Oi(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class hs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, n, a) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = s, this._$AM = n, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(e, s = this, i, n) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = Lt(this, e, s, 0), o = !be(e) || e !== this._$AH && e !== nt, o && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = a[0], l = 0; l < a.length - 1; l++) h = Lt(this, c[i + l], s, l), h === nt && (h = this._$AH[l]), o ||= !be(h) || h !== this._$AH[l], h === g ? e = g : e !== g && (e += (h ?? "") + a[l + 1]), this._$AH[l] = h;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ka extends hs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class Qa extends hs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class Za extends hs {
  constructor(e, s, i, n, a) {
    super(e, s, i, n, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = Lt(this, e, s, 0) ?? g) === nt) return;
    const i = this._$AH, n = e === g && i !== g || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== g && (i === g || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ja {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Lt(this, e);
  }
}
const to = { I: Yt }, eo = ri.litHtmlPolyfillSupport;
eo?.(Ns, Yt), (ri.litHtmlVersions ??= []).push("3.3.3");
const so = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = s?.renderBefore ?? null;
    i._$litPart$ = n = new Yt(e.insertBefore(_e(), a), a, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ci = globalThis;
let P = class extends Tt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = so(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return nt;
  }
};
P._$litElement$ = !0, P.finalized = !0, ci.litElementHydrateSupport?.({ LitElement: P });
const io = ci.litElementPolyfillSupport;
io?.({ LitElement: P });
(ci.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const no = { attribute: !0, type: String, converter: Ve, reflect: !1, hasChanged: oi }, ao = (t = no, e, s) => {
  const { kind: i, metadata: n } = s;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(s.name, t), i === "accessor") {
    const { name: o } = s;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, t, c), c;
    } };
  }
  if (i === "setter") {
    const { name: o } = s;
    return function(c) {
      const l = this[o];
      e.call(this, c), this.requestUpdate(o, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function v(t) {
  return (e, s) => typeof s == "object" ? ao(t, e, s) : ((i, n, a) => {
    const o = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(t) {
  return v({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oo = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ro(t, e) {
  return (s, i, n) => {
    const a = (o) => o.renderRoot?.querySelector(t) ?? null;
    return oo(s, i, { get() {
      return a(this);
    } });
  };
}
const lo = {
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
}, co = {
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
  let i = (j(t) === "es" ? lo : co)[e] ?? e;
  if (s) for (const [n, a] of Object.entries(s)) i = i.replace(`{${n}}`, String(a));
  return i;
}
function wn(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return r(t, "just_now");
  if (s < 60) return r(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? r(t, "h_ago", { n: i }) : r(t, "days_ago", { n: Math.round(i / 24) });
}
const ho = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", G = (t, e = 24) => x`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${ho} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, $n = (t = 24) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, ps = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, kn = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, Xe = (t, e = 16) => x`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, po = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, Oe = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, uo = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, go = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, Hi = (t = 16) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, Sn = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, Ue = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, Ct = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, fo = (t = 26) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, mo = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, k = (t, e, s = 2) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Cn = x`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, us = (t = 24) => k(t, Cn), Mn = (t = 24) => k(t, x`${Cn}<path d="M9 12l2 2 4-4"></path>`), Ls = (t = 24) => k(t, x`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), _o = (t = 20) => k(t, x`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), Ke = (t = 20) => k(t, x`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), bo = (t = 20) => k(t, x`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), xo = (t = 20) => k(t, x`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), yo = (t = 20) => k(t, x`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), xe = (t = 20) => k(t, x`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), It = (t = 20) => k(t, x`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), vo = (t = 24) => k(t, x`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), wo = (t = 20) => k(t, x`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`), gs = (t = 24) => k(t, x`<path d="M5 21V5.5A2.5 2.5 0 0 1 7.5 3h5A2.5 2.5 0 0 1 15 5.5V21"></path><path d="M3 21h14"></path><path d="M15 10h1.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8.5L19 6"></path><path d="M10.5 6.5L8.6 10h2.8l-1.9 3.5"></path>`, 1.9), $o = (t = 18) => k(t, x`<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>`), Wi = (t = 19) => k(t, x`<rect x="3" y="7" width="16" height="10" rx="2.5"></rect><path d="M21 11v2"></path><path d="M7 10.5v3M10.5 10.5v3"></path>`), ko = (t = 19) => k(t, x`<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>`), So = (t = 20) => k(t, x`<path d="M15 6l-6 6 6 6"></path>`, 2.4), Co = (t = 22) => k(t, x`<circle cx="12" cy="12" r="8.5"></circle><path d="M9 16l3-8 3 8M10 13.5h4"></path>`), Mo = (t = 22) => k(t, x`<path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11"></path><path d="M9.5 4L12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"></path>`), Ao = (t = 22) => k(t, x`<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-3 4-3 6-1-1-2-2-2.5-3.5C7.5 9.5 5 12 5 15a7 7 0 0 0 7 7z"></path>`), zo = (t = 22) => k(t, x`<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path><path d="M9.5 15.5l5-5"></path>`), Is = (t = 22) => k(t, x`<circle cx="12" cy="12" r="1.8"></circle><path d="M12 10.2C11 6 13 3 15.5 4.2S15 9 12 10.2zM13.8 12c4.2-1 7.2 1 6 3.5S15 15 13.8 12zM12 13.8c1 4.2-1 7.2-3.5 6S9 15 12 13.8zM10.2 12c-4.2 1-7.2-1-6-3.5S9 9 10.2 12z"></path>`), Eo = (t = 22) => k(t, x`<path d="M8 20V4M4.5 7.5L8 4l3.5 3.5"></path><path d="M16 4v16M12.5 16.5L16 20l3.5-3.5"></path>`), Rs = (t = 22) => k(t, x`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`), di = (t = 20) => k(t, x`<path d="M6 12h12"></path>`, 2.4), hi = (t = 20) => k(t, x`<path d="M12 6v12M6 12h12"></path>`, 2.4), ye = (t = 24) => k(t, x`<circle cx="12" cy="12" r="9"></circle><path d="M5.6 8.2a8 8 0 0 1 12.8 0"></path><circle cx="12" cy="12.6" r="2.6"></circle><circle cx="15.6" cy="16.8" r=".6" fill="currentColor"></circle>`, 1.9), Be = (t = 20) => k(t, x`<path d="M7 4.5v15l12-7.5z" fill="currentColor"></path>`, 1.6), An = (t = 20) => k(t, x`<path d="M8 5v14M16 5v14"></path>`, 3), zn = (t = 20) => k(t, x`<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path><circle cx="12" cy="10" r="2.3"></circle>`), En = (t = 14) => k(t, x`<path d="M12 5v9"></path><path d="M12 18.5h.01"></path>`, 3.2), To = (t = 18) => k(t, x`<path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8z"></path><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"></path>`), Do = (t = 18) => k(t, x`<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"></path>`), Oo = (t = 18) => k(t, x`<path d="M6 3v7a2 2 0 0 0 2 2v9M8 3v6M10 3v7a2 2 0 0 1-2 2"></path><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"></path>`), jo = (t = 18) => k(t, x`<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"></path><circle cx="7" cy="11.5" r="1.8"></circle>`), Po = (t = 18) => k(t, x`<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"></path><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"></path><path d="M6 18v2M18 18v2"></path>`), No = (t = 18) => k(t, x`<circle cx="7" cy="10" r="1.6"></circle><circle cx="10.5" cy="6.5" r="1.6"></circle><circle cx="14.5" cy="6.5" r="1.6"></circle><circle cx="18" cy="10" r="1.6"></circle><path d="M12.5 12c2.5 0 5 3.3 5 5.5 0 1.6-1.4 2.5-3 2.1-1.3-.3-2.7-.3-4 0-1.6.4-3-.5-3-2.1 0-2.2 2.5-5.5 5-5.5z"></path>`), Lo = (t, e = !1, s = 16) => k(s, x`<rect x="2.5" y="7" width="16.5" height="10" rx="2.5"></rect><path d="M21.5 10.5v3"></path>
    ${e ? x`<path d="M11.5 8.6L8.6 12.4h3.2l-1.3 3" stroke-width="1.8"></path>` : [0, 1, 2, 3].slice(0, t).map((i) => x`<rect x=${4.6 + i * 3.4} y="9.2" width="2.3" height="5.6" rx=".6" fill="currentColor" stroke="none"></rect>`)}`);
var Io = Object.defineProperty, Ro = Object.getOwnPropertyDescriptor, q = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ro(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Io(e, s, n), n;
};
let H = class extends P {
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
        ${this.showValue ? d`<span>${this._shown}${this.suffix ? d`&nbsp;${this.suffix}` : g}</span>` : g}
      </div>
    `;
  }
};
H.styles = z`
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
q([
  v({ type: Number })
], H.prototype, "value", 2);
q([
  v({ type: Number })
], H.prototype, "min", 2);
q([
  v({ type: Number })
], H.prototype, "max", 2);
q([
  v({ type: Boolean, reflect: !0 })
], H.prototype, "vertical", 2);
q([
  v()
], H.prototype, "mode", 2);
q([
  v()
], H.prototype, "label", 2);
q([
  v()
], H.prototype, "suffix", 2);
q([
  v({ type: Boolean, attribute: "show-value" })
], H.prototype, "showValue", 2);
q([
  y()
], H.prototype, "_drag", 2);
H = q([
  E("terral-slider")
], H);
const Tn = ["hs", "rgb", "rgbw", "rgbww", "xy"], pi = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], Hs = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function Dn(t) {
  return t.attributes.supported_color_modes ?? [];
}
function Fe(t) {
  const e = Dn(t);
  return e.some((s) => Tn.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Ho(t) {
  return Dn(t).includes("color_temp");
}
function A(t) {
  return t?.state === "on";
}
function mt(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function gt(t) {
  const e = t.attributes.brightness;
  if (!(!A(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function Y(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function Ui(t) {
  return Y(t).length > 0;
}
function ve(t) {
  return t.attributes.color_temp_kelvin;
}
function Rt(t) {
  if (!A(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !Tn.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const Bi = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, se = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), ie = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, Wo = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, Uo = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function On(t, e) {
  if (!e) return Bi;
  const s = Rt(t);
  if (!s) {
    const a = ve(t);
    return a && t.attributes.color_mode === "color_temp" && a >= 4500 ? Wo : Bi;
  }
  const i = [255, 255, 255], n = Uo(s) > 0.75 ? se(s, [40, 50, 80], 0.45) : s;
  return {
    bg: ie(se(s, i, 0.84), 0.95),
    fg: ie(se(s, [10, 10, 20], 0.82)),
    fg2: ie(se(s, [20, 10, 30], 0.72)),
    accent: ie(n),
    fill: ie(se(n, i, 0.35))
  };
}
function pe(t, e) {
  return t.callService("light", A(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function ws(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function Ws(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function Qe(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, n = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(n, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function Fi(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function Bo(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function U(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function Us(t, e) {
  let s;
  for (const i of pi) {
    const n = i.rgb.reduce((a, o, c) => a + (o - t[c]) ** 2, 0);
    (!s || n < s.d) && (s = { d: n, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function qe(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function qi(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const n = getComputedStyle(i).overflowY;
    if ((n === "auto" || n === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function jn(t) {
  let e = 0;
  const s = (a) => {
    e = a.touches[0]?.clientY ?? 0;
  }, i = (a) => {
    if (!a.cancelable) return;
    const o = a.touches[0]?.clientY ?? e;
    qi(a.composedPath(), t, o - e) || a.preventDefault();
  }, n = (a) => {
    qi(a.composedPath(), t, -a.deltaY) || a.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", n, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", n);
  };
}
var Fo = Object.defineProperty, qo = Object.getOwnPropertyDescriptor, K = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? qo(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Fo(e, s, n), n;
};
let Ht;
function Yo(t, e) {
  Ht?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), Ht = s;
}
function Vo(t) {
  Ht?.isConnected && (Ht.hass = t);
}
let W = class extends P {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = jn(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), Ht === this && (Ht = void 0);
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
    if (mt(t)) return r(this.hass, "unavailable");
    if (!A(t)) return r(this.hass, "off");
    const e = [], s = Y(t);
    if (s.length) {
      const o = s.filter((c) => A(this.hass.states[c])).length;
      e.push(`${o} ${r(this.hass, "of")} ${s.length} ${r(this.hass, "lit")}`);
    }
    const i = gt(t);
    i != null && e.push(`${i} %`);
    const n = Rt(t), a = ve(t);
    if (n) {
      const o = Us(n, j(this.hass));
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
        ${this._wide ? g : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${t ? this._content(t) : d`<p class="empty">${r(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(t) {
    const e = A(t), s = On(t, this.opts.useLightColor !== !1), i = Y(t), n = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, a = this._controls(t), o = i.length ? this._memberList(t, i) : g, c = this._info(t);
    return d`
      <div class="body" style=${n}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${Xe(!1, 18)}
              </button>` : g}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            ?disabled=${mt(t)}
            @click=${() => pe(this.hass, t)}
          >
            ${G(e, this._wide ? 28 : 24)}
            ${i.length && e ? d`<span class="badge">${i.filter((l) => A(this.hass.states[l])).length}</span>` : g}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${qe(this.hass, t.entity_id) ? ` · ${qe(this.hass, t.entity_id)}` : ""}</span>
          </div>
          ${this.opts.onSettings ? d`<button class="round gear" aria-label=${r(this.hass, "settings")} @click=${() => {
      const l = this.opts.onSettings;
      this.close(), l();
    }}>${Ct(this._wide ? 22 : 18)}</button>` : g}
          <button class="round close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>
            ${ps(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? d`<div class="cols">
              <div class="left">${a.main}</div>
              <div class="right">${a.side}${o}${i.length ? g : c}</div>
            </div>` : d`<div class="stack">
              <div class="main-row">${a.main}${a.beside ?? g}</div>
              ${a.side}${o}${i.length ? g : c}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = Fe(t), s = A(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            @click=${() => pe(this.hass, t)}>
            <span>${$n(36)}</span>
          </button>`,
        side: g
      };
    const n = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${gt(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(u) => Ws(this.hass, i, u.detail.value)}
    >${kn(28)}</terral-slider>`, a = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (u) => d`<button class="chip" @click=${() => Ws(this.hass, i, u)}>${u} %</button>`
    )}
    </div>`, o = d`<div class="chips">
      ${Hs.map(
      (u) => d`<button class="chip tinted" style="background:${u.css}" @click=${() => Qe(this.hass, t, u.kelvin)}>
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
        .value=${ve(t) ?? Math.round((u + m) / 2)}
        .label=${r(this.hass, "temperature")}
        @value-changed=${(f) => Qe(this.hass, t, f.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${n}${b}</div>`, side: o } : { main: d`<div class="pair">${n}${b}</div>`, side: o };
    }
    const c = j(this.hass), l = (this.opts.favorites?.length ? this.opts.favorites : pi.map((u) => ({ name: u.name[c], rgb: u.rgb }))).slice(0, 6), h = Rt(t), p = d`
      <p class="lb">${r(this.hass, "favorites")}</p>
      <div class="swatches">
        ${l.map(
      (u) => d`<button
            class="sw ${h && U(h) === U(u.rgb) ? "sel" : ""}"
            style="background:${U(u.rgb)}"
            aria-label=${u.name ?? U(u.rgb)}
            @click=${() => Fi(this.hass, i, u.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${r(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${h ? U(h) : "#ffffff"} @change=${(u) => Fi(this.hass, i, Bo(u.target.value))} />
      ${Ho(t) ? d`<p class="lb">${r(this.hass, "temperature")}</p>${o}` : g}
    `;
    return this._wide ? { main: n, side: p } : { main: n, side: g, beside: d`<div class="beside">${p}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const l of e) {
      const h = qe(this.hass, l) ?? r(this.hass, "other_area");
      i.set(h, [...i.get(h) ?? [], l]);
    }
    const n = s === "always" || s === "auto" && e.length > 8 && i.size > 1, a = e.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => ws(this.hass, t.entity_id, !0)}>${r(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => ws(this.hass, t.entity_id, !1)}>${r(this.hass, "all_off")}</button>
        </div>` : g, o = (l) => {
      const h = this.hass.states[l], p = A(h), u = h ? this.hass.formatEntityName?.(h) ?? h.attributes.friendly_name ?? l : l;
      return d`<div class="mr">
        <button class="mi ${p ? "on" : ""}" ?disabled=${mt(h)}
          aria-label="${p ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${u}"
          @click=${() => h && pe(this.hass, h)}>${G(p, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, l]}>
          <span>${u}</span><small>${h ? this._stateText(h) : r(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, c = (l) => [...l].sort((h, p) => Number(A(this.hass.states[p])) - Number(A(this.hass.states[h])));
    return d`
      ${a}
      <p class="lb">${r(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${n ? [...i.entries()].map(([l, h]) => {
      const p = this._openAreas.has(l), u = h.filter((m) => A(this.hass.states[m])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${u ? "on" : ""}" aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${l}"
                    @click=${() => ws(this.hass, h, u === 0)}>${G(u > 0, 18)}</button>
                  <button class="mt" aria-expanded=${p} @click=${() => {
        const m = new Set(this._openAreas);
        p ? m.delete(l) : m.add(l), this._openAreas = m;
      }}>
                    <span>${l} <small>${u} ${r(this.hass, "of")} ${h.length}</small></span>${Xe(p)}
                  </button>
                </div>
                ${p ? d`<div class="inner">${h.map(o)}</div>` : g}
              </div>`;
    }) : d`<div class="box">${c(e).map(o)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return d`<div class="info">
      <div><span>${r(this.hass, "last_activity")}</span><span>${wn(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
W.styles = z`
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
K([
  v({ attribute: !1 })
], W.prototype, "hass", 2);
K([
  v({ attribute: !1 })
], W.prototype, "opts", 2);
K([
  y()
], W.prototype, "_stack", 2);
K([
  y()
], W.prototype, "_expanded", 2);
K([
  y()
], W.prototype, "_closing", 2);
K([
  y()
], W.prototype, "_wide", 2);
K([
  y()
], W.prototype, "_openAreas", 2);
K([
  ro("input[type=color]")
], W.prototype, "_picker", 2);
W = K([
  E("terral-light-dialog")
], W);
var Go = Object.defineProperty, ui = (t, e, s, i) => {
  for (var n = void 0, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = o(e, s, n) || n);
  return n && Go(e, s, n), n;
};
const Mi = class Mi extends P {
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
    return g;
  }
  renderHeaderEnd() {
    return g;
  }
  connectedCallback() {
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = jn(this);
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
        ${this._wide ? g : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        <header>
          ${this.renderHeaderStart()}
          <h2>${this.heading}</h2>
          ${this.renderHeaderEnd()}
          <button class="close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>${ps(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
Mi.styles = z`
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
let M = Mi;
ui([
  v({ attribute: !1 })
], M.prototype, "hass");
ui([
  y()
], M.prototype, "_wide");
ui([
  y()
], M.prototype, "_closing");
const $s = ["switch", "lock", "input_boolean"], ue = (t) => t.split(".")[0], xt = (t) => ue(t) === "lock";
function Xo(t, e = !1) {
  const s = xt(t.entity_id) ? t.state === "locked" : t.state === "on", i = xt(t.entity_id);
  return s === i !== e;
}
function Bs(t, e, s, i = !1) {
  const n = e.entity_id, a = xt(n) ? !i : i, o = s ? a : !a;
  return xt(n) ? t.callService("lock", o ? "lock" : "unlock", {}, { entity_id: n }) : t.callService(ue(n), o ? "turn_on" : "turn_off", {}, { entity_id: n });
}
const Ko = (t, e = !1) => (xt(t) ? !e : e) ? "active" : "inactive", gi = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function fi(t, e) {
  const s = e ? t.states[e] : void 0;
  if (gi(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kW");
  return n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
function Pn(t, e) {
  const s = e ? t.states[e] : void 0;
  if (gi(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kWh");
  return n === "Wh" ? i / 1e3 : n === "MWh" ? i * 1e3 : i;
}
const Ot = 0.05;
function Qo(t, e) {
  const s = fi(t, e.power), i = e.status ? t.states[e.status] : void 0;
  if (i && !gi(i)) {
    if (i.entity_id.startsWith("binary_sensor."))
      return i.state !== "on" ? "none" : s != null && s > Ot ? "charging" : "connected";
    const n = String(i.state).toLowerCase();
    if (/discharg/.test(n)) return "connected";
    if (/charging|cargando|en carga/.test(n)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(n))
      return s != null && s > Ot ? "charging" : "none";
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(n))
      return s != null && s > Ot ? "charging" : "connected";
  }
  return s != null && s > Ot ? "charging" : "unknown";
}
function Nn(t, e) {
  const s = t.entities?.[e]?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => i !== e && n.device_id === s).map(([i]) => i) : [];
}
const mi = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), Ln = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(mi(t, e)), In = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(mi(t, e)), Rn = (t, e) => {
  const s = t.states[e];
  return s ? e.startsWith("binary_sensor.") ? ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(e) : e.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state)) : !1;
};
function _i(t, e) {
  const s = Nn(t, e.entity), i = (a, o) => {
    const c = s.filter((l) => t.states[l] && a(l));
    return o && c.find((l) => o.test(l)) || c[0];
  }, n = (a, o) => a === "none" ? void 0 : a || o();
  return {
    status: n(e.status_entity, () => i((a) => Rn(t, a), /status|estado/i)),
    power: n(e.power_entity, () => i((a) => Ln(t, a), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: n(e.energy_entity, () => i((a) => In(t, a), /added|session|sesion|sesión|charge|carga/i))
  };
}
function Yi(t, e) {
  if (xt(e)) return !1;
  const s = String(t.states[e]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(e + " " + s);
}
async function Hn(t, e, s) {
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  }), n = mi(t, e), a = n === "W" ? 1 / 1e3 : n === "MW" ? 1e3 : 1;
  return (i[e] ?? []).map((o) => [o.lu * 1e3, Number(o.s) * a]).filter(([, o]) => Number.isFinite(o));
}
function Wn(t, e = Date.now()) {
  const s = [];
  let i;
  for (let n = 0; n < t.length; n++) {
    const [a, o] = t[n], c = n + 1 < t.length ? t[n + 1][0] : e, l = Math.max(0, c - a) / 36e5;
    o > Ot && (i && a - i.end > 15 * 6e4 && (s.push(i), i = void 0), i ??= { start: a, end: a, kwh: 0, maxKw: 0, live: !1 }, i.kwh += o * l, i.end = c, i.maxKw = Math.max(i.maxKw, o));
  }
  return i && (i.live = t.length > 0 && t[t.length - 1][1] > Ot, s.push(i)), s.filter((n) => n.kwh >= 0.05 || n.live);
}
function Un(t, e = 7, s = /* @__PURE__ */ new Date()) {
  const i = [];
  for (let n = e - 1; n >= 0; n--) {
    const a = new Date(s.getFullYear(), s.getMonth(), s.getDate() - n);
    i.push({ day: a, kwh: 0 });
  }
  for (const n of t) {
    const a = new Date(n.start), o = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime(), c = i.find((l) => l.day.getTime() === o);
    c && (c.kwh += n.kwh);
  }
  return i;
}
const B = (t, e, s = 1) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Fs = (t) => {
  const e = Math.max(0, Math.round(t / 6e4));
  return `${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")} min`;
};
var Zo = Object.defineProperty, Jo = Object.getOwnPropertyDescriptor, Bn = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Jo(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Zo(e, s, n), n;
};
let Ze = class extends M {
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
Ze.styles = [
  M.styles,
  z`
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
Bn([
  v({ attribute: !1 })
], Ze.prototype, "options", 2);
Ze = Bn([
  E("terral-confirm-sheet")
], Ze);
function qs(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const Vi = ["auto", "heat_cool", "cool", "heat", "dry", "fan_only"], tr = {
  auto: { t: !0, f: !0 },
  heat_cool: { t: !0, f: !1 },
  cool: { t: !0, f: !0 },
  heat: { t: !0, f: !0 },
  dry: { t: !1, f: !1 },
  fan_only: { t: !1, f: !0 }
}, er = {
  cool: [70, 150, 255],
  heat: [255, 140, 60],
  auto: [52, 199, 123],
  heat_cool: [52, 199, 123],
  dry: [40, 190, 200],
  fan_only: [140, 160, 200]
}, fs = { TARGET: 1, FAN: 8, SWING: 32, TURN_ON: 256 }, ms = (t, e) => (Number(t.attributes.supported_features ?? 0) & e) !== 0, N = (t) => t.state === "off" || t.state === "unavailable" || t.state === "unknown", jt = (t) => t.state === "unavailable" || t.state === "unknown";
function st(t) {
  const e = (t.attributes.hvac_modes ?? []).filter((i) => i !== "off"), s = (i) => Vi.includes(i) ? Vi.indexOf(i) : 99;
  return [...e].sort((i, n) => s(i) - s(n));
}
const we = (t) => ms(t, fs.FAN) || t.attributes.fan_modes ? t.attributes.fan_modes ?? [] : [], sr = (t) => (t.attributes.preset_modes ?? []).filter((e) => e !== "none"), Fn = (t) => ms(t, fs.SWING) || (t.attributes.swing_modes?.length ?? 0) > 0;
function qn(t, e = t.state) {
  return e === "heat_cool" || t.attributes.target_temp_low != null && t.attributes.target_temp_high != null && t.attributes.temperature == null && e !== "off";
}
function Je(t, e) {
  return t.mode_rules?.[e] ?? tr[e] ?? { t: !0, f: !0 };
}
function Pt(t, e) {
  return N(t) || !Je(e, t.state).t ? !1 : qn(t) ? t.attributes.target_temp_low != null : t.attributes.temperature != null || ms(t, fs.TARGET);
}
function Yn(t, e) {
  return !N(t) && Je(e, t.state).f && we(t).length > 0;
}
function ge(t, e) {
  const s = Number(t.attributes.min_temp ?? 7), i = Number(t.attributes.max_temp ?? 35), n = Math.max(s, e.min_temp ?? s), a = Math.min(i, e.max_temp ?? i), o = e.temp_step ?? Number(t.attributes.target_temp_step ?? (t.attributes.temperature_unit === "°F" ? 1 : 0.5));
  return { min: n, max: Math.max(n + o, a), step: o, hwMin: s, hwMax: i };
}
const _t = (t, e) => Math.min(e.max, Math.max(e.min, Math.round(t / e.step) * e.step)), fe = (t) => t.attributes.current_temperature != null ? Number(t.attributes.current_temperature) : null, ir = (t) => t.attributes.current_humidity != null ? Number(t.attributes.current_humidity) : null, Vn = /* @__PURE__ */ new Map(), Gn = (t) => {
  N(t) || Vn.set(t.entity_id, t.state);
};
function Xn(t, e) {
  const s = Vn.get(e.entity_id);
  if (s && st(e).includes(s)) return $e(t, e, s);
  if (ms(e, fs.TURN_ON)) return t.callService("climate", "turn_on", {}, { entity_id: e.entity_id });
  const i = st(e).includes("cool") ? "cool" : st(e)[0];
  return i ? $e(t, e, i) : Promise.resolve();
}
function Kn(t, e) {
  return Gn(e), e.attributes.hvac_modes?.includes("off") ? $e(t, e, "off") : t.callService("climate", "turn_off", {}, { entity_id: e.entity_id });
}
const $e = (t, e, s) => t.callService("climate", "set_hvac_mode", { hvac_mode: s }, { entity_id: e.entity_id }), Qn = (t, e, s) => t.callService("climate", "set_fan_mode", { fan_mode: s }, { entity_id: e.entity_id }), nr = (t, e, s) => t.callService("climate", "set_preset_mode", { preset_mode: s }, { entity_id: e.entity_id });
function ar(t, e, s) {
  const i = e.attributes.swing_modes ?? ["on", "off"], n = s ? i.find((a) => a !== "off") ?? "on" : i.includes("off") ? "off" : i[0];
  return t.callService("climate", "set_swing_mode", { swing_mode: n }, { entity_id: e.entity_id });
}
function Zn(t, e, s) {
  const i = typeof s == "number" ? { temperature: s } : { target_temp_low: s.low, target_temp_high: s.high };
  return t.callService("climate", "set_temperature", i, { entity_id: e.entity_id });
}
const Jn = {
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
}, or = {
  auto: "Auto",
  heat_cool: "Heat/cool",
  cool: "Cool",
  heat: "Heat",
  dry: "Dry",
  fan_only: "Fan only"
}, rr = { cool: "Enfriando", heat: "Calentando", dry: "Deshumidificando", fan_only: "Ventilando", auto: "Automático", heat_cool: "Manteniendo" }, lr = { cool: "Cooling", heat: "Heating", dry: "Drying", fan_only: "Fan", auto: "Auto", heat_cool: "Keeping" }, ta = (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " "), F = (t, e) => (t === "es" ? Jn[e] : or[e]) ?? ta(e), Ys = (t, e) => (t === "es" ? Jn[e.toLowerCase()] : void 0) ?? ta(e), Vs = (t, e) => (t === "es" ? rr[e] : lr[e]) ?? F(t, e);
function cr(t, e) {
  if (!e) return "";
  if (/auto/i.test(e)) return "A";
  const i = t.filter((n) => !/auto/i.test(n)).indexOf(e);
  return i >= 0 ? String(i + 1) : e.charAt(0).toUpperCase();
}
function Nt(t, e = 22) {
  switch (t) {
    case "auto":
      return Co(e);
    case "cool":
      return Mo(e);
    case "heat":
      return Ao(e);
    case "dry":
      return zo(e);
    case "fan_only":
      return Is(e);
    case "heat_cool":
      return Eo(e);
    case "off":
      return $n(e);
    default:
      return Rs(e);
  }
}
const je = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), Et = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function ea(t) {
  if (N(t)) return "";
  const e = er[t.state] ?? [140, 160, 200];
  return `--bg:${Et(je(e, [255, 255, 255], 0.84), 0.95)};--bg-solid:${Et(je(e, [255, 255, 255], 0.84))};--fg:${Et(je(e, [10, 10, 20], 0.82))};--fg2:${Et(je(e, [20, 10, 30], 0.7))};--accent:${Et(e)};--arc:${Et(e)}`;
}
function Gs(t) {
  if (qn(t)) {
    const e = t.attributes.target_temp_low, s = t.attributes.target_temp_high;
    return e != null && s != null ? { low: Number(e), high: Number(s) } : null;
  }
  return t.attributes.temperature != null ? Number(t.attributes.temperature) : null;
}
const it = (t, e) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), ke = (t, e) => e == null ? "" : typeof e == "number" ? `${it(t, e)}°` : `${it(t, e.low)}–${it(t, e.high)}°`;
function Gi(t, e, s, i, n) {
  const a = j(t), o = fe(e), c = o != null ? `${it(t, o)}° ${a === "es" ? "dentro" : "inside"}` : "";
  if (jt(e)) return a === "es" ? "Sin respuesta" : "Not responding";
  if (N(e)) {
    const p = a === "es" ? "Apagado" : "Off";
    return n || !c ? p : `${p} · ${c}`;
  }
  const l = Pt(e, s) ? ke(t, i) : "";
  if (n) return l || F(a, e.state);
  const h = l ? `${Vs(a, e.state)} ${a === "es" ? "a" : "to"} ${l}` : Vs(a, e.state);
  return c ? `${h} · ${c}` : h;
}
function sa(t, e) {
  const s = ir(e);
  return s != null ? `${Math.round(s)} % ${j(t) === "es" ? "humedad" : "humidity"}` : "";
}
const dr = { PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 }, et = (t, e) => ((Number(t.attributes.supported_features) || 0) & dr[e]) !== 0;
function yt(t) {
  if (!t || t.state === "unavailable" || t.state === "unknown") return "unavailable";
  const e = t.state;
  return e === "cleaning" || e === "paused" || e === "returning" || e === "docked" || e === "error" ? e : "idle";
}
const Se = (t, e) => t.entities?.[e];
function ia(t, e) {
  const s = Se(t, e)?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => n.device_id === s && i !== e && t.states[i]).map(([i]) => i) : [];
}
function na(t, e) {
  const s = ia(t, e), i = (a, o, c, l = () => !0) => s.find((h) => h.startsWith(a) && o.includes(String(Se(t, h)?.translation_key)) && l(h)) ?? s.find((h) => h.startsWith(a) && c.test(h) && l(h)), n = (a) => String(t.states[a]?.attributes.unit_of_measurement ?? "");
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
const _s = (t, e) => {
  if (!e) return null;
  const s = parseFloat(t.states[e]?.state ?? "");
  return Number.isFinite(s) ? s : null;
};
function hr(t, e, s) {
  const i = _s(t, s.battery) ?? parseFloat(e.attributes.battery_level);
  return Number.isFinite(i) ? Math.round(i) : null;
}
const bi = (t, e) => {
  const s = _s(t, e.progress);
  return s == null ? null : Math.max(0, Math.min(100, Math.round(s)));
}, pr = (t, e) => _s(t, e.area);
function ur(t, e) {
  const s = _s(t, e.time);
  if (s == null) return null;
  const i = String(t.states[e.time]?.attributes.unit_of_measurement ?? "s");
  return Math.round(i === "h" ? s * 60 : i === "min" ? s : s / 60);
}
function gr(t, e) {
  const s = e.room ? t.states[e.room]?.state : void 0;
  return s && !["unknown", "unavailable", "none", ""].includes(s) ? s : void 0;
}
function aa(t, e, s) {
  const i = s.error ? t.states[s.error]?.state : void 0;
  return i && !["none", "unknown", "unavailable", "ok", ""].includes(i) ? i : yt(e) === "error" && String(e.attributes.error ?? e.attributes.status ?? "") || void 0;
}
const xi = (t) => Array.isArray(t.attributes.fan_speed_list) ? t.attributes.fan_speed_list : [], ts = (t, e) => e && Array.isArray(t.states[e]?.attributes.options) ? t.states[e].attributes.options : [], oa = /* @__PURE__ */ new Map(), ra = /* @__PURE__ */ new Map();
function fr(t, e, s) {
  const i = e.attributes.fan_speed;
  i && i !== "off" && oa.set(e.entity_id, i);
  const n = s.mopIntensity ? t.states[s.mopIntensity]?.state : void 0;
  n && n !== "off" && n !== "unavailable" && ra.set(e.entity_id, n);
}
function mr(t, e, s) {
  const i = xi(e), n = ts(t, s.mopIntensity);
  if (!n.length) return { modes: [], current: "vacuum" };
  const a = i.includes("off"), c = [...n.includes("off") ? ["vacuum"] : [], ...a ? ["mop"] : [], "both"], l = e.attributes.fan_speed === "off", h = t.states[s.mopIntensity]?.state === "off", p = l && !h ? "mop" : h ? "vacuum" : "both";
  return { modes: c.length > 1 ? c : [], current: p };
}
const Xi = (t, e) => e.find((s) => t.includes(s)) ?? t.find((s) => s !== "off");
async function _r(t, e, s, i) {
  const n = xi(e), a = ts(t, s.mopIntensity), o = oa.get(e.entity_id) ?? Xi(n, ["balanced", "standard", "medium"]), c = ra.get(e.entity_id) ?? Xi(a, ["moderate", "medium", "standard", "mild"]), l = (p) => p && e.attributes.fan_speed !== p && t.callService("vacuum", "set_fan_speed", { fan_speed: p }, { entity_id: e.entity_id }), h = (p) => p && s.mopIntensity && t.states[s.mopIntensity]?.state !== p && t.callService("select", "select_option", { option: p }, { entity_id: s.mopIntensity });
  i === "vacuum" ? await Promise.all([h("off"), e.attributes.fan_speed === "off" ? l(o) : void 0]) : i === "mop" ? await Promise.all([l("off"), t.states[s.mopIntensity]?.state === "off" ? h(c) : void 0]) : await Promise.all([e.attributes.fan_speed === "off" ? l(o) : void 0, t.states[s.mopIntensity]?.state === "off" ? h(c) : void 0]);
}
const Vt = (t, e, s, i = {}) => t.callService("vacuum", s, i, { entity_id: e.entity_id }), le = (t, e) => Vt(t, e, "start"), Xs = (t, e) => Vt(t, e, "pause"), Ks = (t, e) => Vt(t, e, "return_to_base"), la = (t, e) => Vt(t, e, "locate"), br = (t, e, s) => Vt(t, e, "set_fan_speed", { fan_speed: s }), Ki = (t, e, s) => t.callService("select", "select_option", { option: s }, { entity_id: e }), xr = (t, e, s) => Vt(t, e, "send_command", { command: "app_segment_clean", params: [{ segments: s, repeat: 1 }] }), Pe = /* @__PURE__ */ new Map();
function yr(t, e, s) {
  if (Se(t, e.entity_id)?.platform !== "roborock") return Promise.resolve([]);
  const i = s.map ? t.states[s.map]?.state : void 0, n = `${e.entity_id}|${i ?? ""}`;
  return Pe.has(n) || Pe.set(
    n,
    t.callWS({
      type: "call_service",
      domain: "roborock",
      service: "get_maps",
      target: { entity_id: e.entity_id },
      return_response: !0
    }).then((a) => {
      const o = a.response?.[e.entity_id]?.maps ?? [], c = o.find((l) => l.name && l.name === i) ?? o[0];
      return Object.entries(c?.rooms ?? {}).map(([l, h]) => ({ id: Number(l), name: h })).filter((l) => Number.isFinite(l.id) && l.name);
    }).catch(() => (Pe.delete(n), []))
  ), Pe.get(n);
}
function yi(t, e) {
  return ia(t, e).filter((s) => s.startsWith("button.") && !Se(t, s)?.entity_category && !Se(t, s)?.hidden);
}
function ca(t, e) {
  const s = yi(t, e.entity), i = (e.routines ?? []).filter((n) => !s.includes(n) && t.states[n]);
  return [...s, ...i];
}
function Qi(t, e) {
  const s = (e.routines ?? []).filter((i) => t.states[i]);
  return (s.length ? s : yi(t, e.entity)).slice(0, 3);
}
const Qs = (t, e) => e.startsWith("script.") ? t.callService("script", "turn_on", {}, { entity_id: e }) : t.callService("button", "press", {}, { entity_id: e });
function es(t, e, s) {
  const i = String(t.states[e]?.attributes.friendly_name ?? e.split(".")[1].replace(/_/g, " "));
  return s && i.toLowerCase().startsWith(s.toLowerCase() + " ") ? i.slice(s.length + 1) : i;
}
const vr = (t, e) => e.startsWith("script.") && /(aspir|robot|vacuum|roborock|limpi|freg|mop|clean)/i.test(e + " " + (t.states[e]?.attributes.friendly_name ?? "")), Ne = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] * (1 - s) + e[i] * s)), ne = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, wr = [34, 165, 135], $r = [90, 157, 240], kr = [224, 86, 75];
function da(t) {
  const e = t === "cleaning" || t === "paused" ? wr : t === "returning" ? $r : t === "error" ? kr : null;
  return e ? `--bg:${ne(Ne(e, [255, 255, 255], 0.86), 0.95)};--bg-solid:${ne(Ne(e, [255, 255, 255], 0.86))};--fg:${ne(Ne(e, [10, 10, 20], 0.8))};--fg2:${ne(Ne(e, [20, 10, 30], 0.68))};--accent:${ne(e)}` : "";
}
const vi = (t) => t === "cleaning" || t === "paused" || t === "returning" || t === "error";
function Sr(t, e) {
  const s = t >= 80 ? 4 : t >= 60 ? 3 : t >= 40 ? 2 : t >= 20 ? 1 : 0, i = t < 20 ? e ? "#a32d2d" : "#ff9b93" : t < 40 ? e ? "#854f0b" : "#ffd27a" : e ? "#0f6e56" : "#9ff0d0";
  return { bars: s, color: i };
}
function ha(t, e, s, i, n = 16) {
  const a = hr(t, e, s);
  if (a == null) return null;
  const o = yt(e), { bars: c, color: l } = Sr(a, vi(o)), h = o === "docked" && a < 100;
  return { pct: a, color: l, icon: Lo(c, h, n), text: i ? `${a} %` : String(a) };
}
const Cr = {
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
function ks(t, e) {
  const s = e.toLowerCase().replace(/[\s-]+/g, "_"), i = Cr[s];
  if (i) return i[j(t) === "es" ? 0 : 1];
  const n = e.replace(/_/g, " ");
  return n.charAt(0).toUpperCase() + n.slice(1);
}
const Mr = [
  [/(cocin|kitchen)/i, Oo],
  [/(dorm|bed|habitac|cuarto)/i, jo],
  [/(salon|salón|living|comedor|sofa)/i, Po],
  [/(freg|mop|agua|water|fondo|deep)/i, Do],
  [/(mascot|pet|pelo|perro|gato)/i, No]
], ss = (t, e = 18) => (Mr.find(([s]) => s.test(t))?.[1] ?? To)(e), Ar = {
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
function pa(t, e) {
  const s = Ar[e];
  if (s) return s[j(t) === "es" ? 0 : 1];
  const i = e.replace(/_/g, " ");
  return i.charAt(0).toUpperCase() + i.slice(1);
}
function Ss(t, e) {
  return r(t, `vac_${e}`);
}
function ua(t, e, s = !0) {
  const i = t.locale?.language ?? t.language, n = bi(t, e), a = pr(t, e), o = ur(t, e);
  return [
    s && n != null ? `${n} %` : "",
    a != null ? `${a.toLocaleString(i, { maximumFractionDigits: 1 })} m²` : "",
    o != null ? `${o} min` : ""
  ].filter(Boolean).join(" · ");
}
function Ye(t, e, s, i = !1) {
  const n = yt(e), a = gr(t, s);
  if (i && n === "cleaning") {
    const o = bi(t, s);
    if (o != null) return `${o} %`;
  }
  if (n === "error" && !i) {
    const o = aa(t, e, s);
    return [Ss(t, n), a ?? (o ? pa(t, o) : "")].filter(Boolean).join(" · ");
  }
  return n === "cleaning" && a && !i ? `${Ss(t, n)} · ${a}` : Ss(t, n);
}
var zr = Object.defineProperty, Er = Object.getOwnPropertyDescriptor, Gt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Er(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && zr(e, s, n), n;
};
const Tr = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate", weather: "type_weather", vacuum: "type_vacuum" }, Dr = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;
let at = class extends M {
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
    return this._sub === "entity" && this.draft.type === "climate" ? r(this.hass, "climate_entity") : this._sub ? r(this.hass, { device: "ch_device", entity: "light_entity", alarm: "type_alarm", weather: "type_weather", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" }[this._sub]) : this.options.mode === "edit" ? r(this.hass, "settings") : r(this.hass, Tr[this.draft.type]);
  }
  renderHeaderStart() {
    return !this._sub && !(this.options.mode === "add" && this.options.onBack) ? g : d`<button class="hbtn" aria-label=${r(this.hass, "back")} @click=${this._back}>${So()}</button>`;
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
      <span class="nm">${t}${i ? d`<small>${i}</small>` : g}</span>
      <span class="val">${e}${Xe(!1, 16)}</span>
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
        ${e === "weather" ? this._weathers().length > 1 ? this._row(r(t, "type_weather"), s.entity ? this._entName(s.entity) : r(t, "choose"), "weather") : g : e === "alarm" ? this._alarms().length > 1 ? this._row(r(t, "type_alarm"), s.entity ? this._entName(s.entity) : r(t, "choose"), "alarm") : g : this._row(r(t, "ch_device"), n ? this._devName(n) : s.entity ? this._entName(s.entity) : r(t, "choose"), "device")}
        <label class="li">
          <span class="nm">${r(t, "name_label")}</span>
          <input class="txt" .value=${s.name ?? ""} placeholder=${this._defaultName()} @input=${(c) => this._set({ name: c.target.value })} />
        </label>
      </div>
    </section>`;
    let o = g;
    if (e === "light" && s.entity) {
      const c = i ? this._entitiesOf(i, (l) => l.startsWith("light.")) : [];
      o = d`<section>
        <h3>${r(t, "type_light")}</h3>
        <div class="list">
          ${c.length > 1 ? this._row(r(t, "light_entity"), this._entName(s.entity), "entity", s.entity) : g}
          <button class="li" role="switch" aria-checked=${s.use_light_color !== !1} @click=${() => this._set({ use_light_color: s.use_light_color === !1 ? void 0 : !1 })}>
            <span class="nm">${r(t, "use_light_color")}</span><span class="tog ${s.use_light_color !== !1 ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
    } else if (e === "weather" && s.entity) {
      const c = (l, h, p) => d`<span class="seg">${h.map(([u, m]) => d`<button class=${l === u ? "sel" : ""} @click=${() => p(u)}>${m}</button>`)}</span>`;
      o = d`
        <section>
          <h3>${r(t, "card_section")}</h3>
          <div class="list">
            <div class="li"><span class="nm">${r(t, "forecast_22")}</span>${c(s.forecast_2x2 ?? "hourly", [["hourly", r(t, "hours_word")], ["daily", r(t, "days_word")]], (l) => this._set({ forecast_2x2: l === "hourly" ? void 0 : l }))}</div>
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
            <div class="li"><span class="nm">${r(t, "forecast_days")}</span>${c(s.forecast_days ?? 7, [[5, "5"], [7, "7"]], (l) => this._set({ forecast_days: l === 7 ? void 0 : l }))}</div>
          </div>
        </section>`;
    } else if (e === "vacuum" && s.entity && t.states[s.entity])
      o = this._vacuumSettings();
    else if (e === "climate" && s.entity && t.states[s.entity])
      o = this._climateSettings(i);
    else if (e === "charger" && s.entity) {
      const c = xt(s.entity), l = r(t, c ? "raw_locked" : "raw_on"), h = r(t, c ? "raw_unlocked" : "raw_off"), p = Ko(s.entity, !!s.invert) === "active", u = r(t, "ch_locked"), m = r(t, "ch_unlocked"), b = _i(t, { entity: s.entity }), f = (_, $) => s[_] === "none" ? r(t, "none") : s[_] ? this._entName(s[_]) : $ ? `${r(t, "auto")} · ${this._entName($)}` : r(t, "auto");
      o = d`
        <section>
          <h3>${r(t, "ch_lock_section")}</h3>
          <div class="list">
            ${this._row(r(t, "ch_lock_entity"), this._entName(s.entity), "lock", s.entity)}
            <button class="li" role="switch" aria-checked=${!!s.invert} @click=${() => this._set({ invert: !s.invert || void 0 })}>
              <span class="nm">${r(t, "ch_invert")}<small>${r(t, "ch_invert_sub", { a: l, b: h })}</small></span>
              <span class="tog ${s.invert ? "on" : ""}"></span>
            </button>
          </div>
        </section>
        <p class="explain">${r(t, "ch_explain", { a: l, la: p ? u : m, b: h, lb: p ? m : u, press: p ? l : h })}</p>
        <section>
          <h3>${r(t, "ch_data")}</h3>
          <div class="list">
            ${this._row(r(t, "ch_status"), f("status_entity", b.status), "status_entity")}
            ${this._row(r(t, "ch_power"), f("power_entity", b.power), "power_entity")}
            ${this._row(r(t, "ch_energy"), f("energy_entity", b.energy), "energy_entity")}
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
        ${this.options.mode === "edit" && this.options.onRemove ? d`<button class="remove" @click=${() => qs(t, {
      heading: r(t, "remove_card_q"),
      actions: [{ label: r(t, "remove_card"), danger: !0, run: () => {
        this.close(), this.options.onRemove?.();
      } }]
    })}>${r(t, "remove_card")}</button>` : g}
      </div>
      <button class="cta" ?disabled=${!s.entity} @click=${() => {
      this.options.onSave(this.draft), this.close();
    }}>${r(t, this.options.mode === "add" ? "add" : "save")}</button>
    `;
  }
  _climateSettings(t) {
    const e = this.hass, s = this.draft.config, i = e.states[s.entity], n = j(e), a = ge(i, s), o = (f) => f.toLocaleString(e.locale?.language ?? e.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), c = t ? this._entitiesOf(t, (f) => f.startsWith("climate.")) : [], l = st(i), h = we(i).length > 0, p = Fn(i), u = (f, _) => {
      const $ = Je(s, f);
      this._set({ mode_rules: { ...s.mode_rules ?? {}, [f]: { ...$, [_]: !$[_] } } });
    }, m = (f, _) => {
      const $ = f === "min_temp" ? a.min : a.max;
      let w = Math.round(($ + _ * a.step) / a.step) * a.step;
      w = f === "min_temp" ? Math.max(a.hwMin, Math.min(a.max - a.step, w)) : Math.min(a.hwMax, Math.max(a.min + a.step, w));
      const D = f === "min_temp" ? a.hwMin : a.hwMax;
      this._set({ [f]: w === D ? void 0 : w });
    }, b = (f) => d`<span class="mini">
      <button aria-label="−" @click=${() => m(f, -1)}>${di(16)}</button>
      <b>${o(f === "min_temp" ? a.min : a.max)}°</b>
      <button aria-label="+" @click=${() => m(f, 1)}>${hi(16)}</button>
    </span>`;
    return d`
      ${c.length > 1 ? d`<section><h3>${r(e, "climate_entity")}</h3><div class="list">${this._row(r(e, "climate_entity"), this._entName(s.entity), "entity", s.entity)}</div></section>` : g}
      <section>
        <h3>${r(e, "temperature")}</h3>
        <div class="list">
          <div class="li"><span class="nm">${r(e, "min_temp_l")}<small>${r(e, "hw_min", { v: o(a.hwMin) })}</small></span>${b("min_temp")}</div>
          <div class="li"><span class="nm">${r(e, "max_temp_l")}<small>${r(e, "hw_max", { v: o(a.hwMax) })}</small></span>${b("max_temp")}</div>
          <div class="li"><span class="nm">${r(e, "temp_step_l")}</span>
            <span class="seg">${[0.5, 1].map((f) => d`<button class=${a.step === f ? "sel" : ""} @click=${() => this._set({ temp_step: f })}>${o(f)}°</button>`)}</span>
          </div>
        </div>
      </section>
      ${l.length ? d`<section>
            <h3>${r(e, "per_mode")}</h3>
            <div class="list">
              <table class="matrix">
                <tr><th>${r(e, "climate_mode")}</th><th>${r(e, "col_temp")}</th>${h ? d`<th>${r(e, "col_fan")}</th>` : g}</tr>
                ${l.map((f) => {
      const _ = Je(s, f);
      return d`<tr>
                    <td><span class="mname">${Nt(f, 18)}${F(n, f)}</span></td>
                    <td><button class="ck ${_.t ? "on" : ""}" role="checkbox" aria-checked=${_.t} @click=${() => u(f, "t")}>${_.t ? Ue(15) : g}</button></td>
                    ${h ? d`<td><button class="ck ${_.f ? "on" : ""}" role="checkbox" aria-checked=${_.f} @click=${() => u(f, "f")}>${_.f ? Ue(15) : g}</button></td>` : g}
                  </tr>`;
    })}
              </table>
            </div>
            ${s.mode_rules ? d`<button class="more" style="margin-top:8px" @click=${() => this._set({ mode_rules: void 0 })}>${r(e, "reset_rules")}</button>` : g}
          </section>` : g}
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
    const t = this.hass, e = this.draft.config, s = e.name || this._entName(e.entity), i = (e.routines ?? []).filter((l) => t.states[l]), n = yi(t, e.entity), a = Object.keys(t.states).filter((l) => (vr(t, l) || i.includes(l)) && !n.includes(l) && this._visible(l)), o = (l) => {
      const h = i.includes(l) ? i.filter((p) => p !== l) : i.length < 3 ? [...i, l] : i;
      this._set({ routines: h.length ? h : void 0 });
    }, c = (l) => {
      const h = es(t, l, s), p = i.indexOf(l), u = p < 0 && i.length >= 3;
      return d`<button class="li" role="checkbox" aria-checked=${p >= 0} ?disabled=${u} style=${u ? "opacity:.45" : ""} @click=${() => o(l)}>
        <span class="ic">${ss(h, 18)}</span>
        <span class="nm">${h}${l.startsWith("script.") ? d`<small>${l}</small>` : g}</span>
        <span class="num ${p >= 0 ? "on" : ""}">${p >= 0 ? p + 1 : g}</span>
      </button>`;
    };
    return d`<section>
        <h3>${r(t, "vac_card_routines")}</h3>
        ${n.length ? d`<div class="list">${n.map(c)}</div>` : d`<p class="note">${r(t, "vac_no_routines")}</p>`}
        <p class="note" style="margin-top:8px">${r(t, "vac_card_routines_sub")}</p>
      </section>
      ${a.length ? d`<section><h3>${r(t, "vac_scripts")}</h3><div class="list">${a.map(c)}</div></section>` : g}`;
  }
  // ---- Sub pages ---------------------------------------------------------------
  _opt(t, e, s, i, n) {
    return d`<button class="opt ${s ? "sel" : ""}" @click=${() => {
      i(), this._sub = void 0, this._q = "";
    }}>
      ${n ? d`<span class="ic">${n}</span>` : g}
      <span class="on">${t}${e ? d`<small>${e}</small>` : g}</span>
      <span class="ck">${Ue(18)}</span>
    </button>`;
  }
  _group(t, e) {
    return e.length ? d`<section><h3>${t}</h3><div class="list">${e}</div></section>` : g;
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
      const h = this._devices.map((f) => ({ d: f, lights: this._entitiesOf(f.id, (_) => _.startsWith("light.")) })).filter((f) => f.lights.length && this._match(this._devName(f.d), ...f.lights.map(this._entName))).sort((f, _) => this._devName(f.d).localeCompare(this._devName(_.d))), p = Object.keys(t.states).filter((f) => f.startsWith("light.") && this._visible(f) && !this._deviceOf(f) && this._match(this._entName(f), f)), u = p.filter((f) => Ui(t.states[f])), m = p.filter((f) => !Ui(t.states[f])), b = (f) => this._set({ entity: f, device: void 0, name: this._entName(f) });
      return d`${this._search()}
        ${this._group(r(t, "light_groups"), u.map((f) => this._opt(this._entName(f), r(t, "group"), s.entity === f, () => b(f), G(!1, 20))))}
        ${this._byArea(h, (f) => f.d.area_id, (f) => this._opt(this._devName(f.d), f.lights.length > 1 ? `${f.lights.length} ${r(t, "lights_word")}` : f.d.model ?? void 0, i === f.d.id, () => this._set({ device: f.d.id, entity: f.lights[0], name: this._devName(f.d) }), G(!1, 20)))}
        ${this._group(r(t, "other_lights"), m.map((f) => this._opt(this._entName(f), f, s.entity === f, () => b(f), G(!1, 20))))}`;
    }
    if (e === "vacuum") {
      const h = this._devices.map((u) => ({ d: u, ents: this._entitiesOf(u.id, (m) => m.startsWith("vacuum.")) })).filter((u) => u.ents.length && this._match(this._devName(u.d), ...u.ents.map(this._entName))).sort((u, m) => this._devName(u.d).localeCompare(this._devName(m.d))), p = Object.keys(t.states).filter((u) => u.startsWith("vacuum.") && this._visible(u) && !this._deviceOf(u) && this._match(this._entName(u), u));
      return d`${this._search()}
        ${this._byArea(h, (u) => u.d.area_id, (u) => this._opt(this._devName(u.d), u.d.model ?? void 0, i === u.d.id, () => this._set({ device: u.d.id, entity: u.ents[0], name: this._devName(u.d), routines: void 0 }), ye(20)))}
        ${this._group(r(t, "other_vacuums"), p.map((u) => this._opt(this._entName(u), u, s.entity === u, () => this._set({ entity: u, device: void 0, name: this._entName(u), routines: void 0 }), ye(20))))}`;
    }
    if (e === "climate") {
      const h = this._devices.map((u) => ({ d: u, ents: this._entitiesOf(u.id, (m) => m.startsWith("climate.")) })).filter((u) => u.ents.length && this._match(this._devName(u.d), ...u.ents.map(this._entName))).sort((u, m) => this._devName(u.d).localeCompare(this._devName(m.d))), p = Object.keys(t.states).filter((u) => u.startsWith("climate.") && this._visible(u) && !this._deviceOf(u) && this._match(this._entName(u), u));
      return d`${this._search()}
        ${this._byArea(h, (u) => u.d.area_id, (u) => this._opt(this._devName(u.d), u.d.model ?? void 0, i === u.d.id, () => this._set({ device: u.d.id, entity: u.ents[0], name: this._devName(u.d) }), Rs(20)))}
        ${this._group(r(t, "other_climates"), p.map((u) => this._opt(this._entName(u), u, s.entity === u, () => this._set({ entity: u, device: void 0, name: this._entName(u) }), Rs(20))))}`;
    }
    const n = this._devices.map((h) => ({ d: h, locks: this._entitiesOf(h.id, (p) => $s.includes(ue(p))) })).filter((h) => h.locks.length), a = (h) => Dr.test([this._devName(h.d), h.d.manufacturer, h.d.model].join(" ")), o = n.filter((h) => (this._allDevices || a(h)) && this._match(this._devName(h.d), h.d.manufacturer, h.d.model)), c = (h) => h.find((p) => /bloq|lock/i.test(p + this._entName(p))) ?? h.find((p) => /paus|stop/i.test(p + this._entName(p))) ?? h[0], l = (h) => {
      const p = c(h.locks);
      this._set({ device: h.d.id, entity: p, invert: Yi(t, p) || void 0, name: this._devName(h.d), status_entity: void 0, power_entity: void 0, energy_entity: void 0 });
    };
    return d`${this._search()}
      ${this._byArea(o, (h) => h.d.area_id, (h) => this._opt(this._devName(h.d), h.locks.map(this._entName).join(" · "), i === h.d.id, () => l(h), gs(20)))}
      ${o.length ? g : d`<p class="note">${r(t, "no_chargers_found")}</p>`}
      ${this._allDevices ? g : d`<button class="more" @click=${() => this._allDevices = !0}>${r(t, "show_all_devices")}</button>`}`;
  }
  _search() {
    return d`<label class="search">${Sn(16)}<input type="search" placeholder=${r(this.hass, "search_entities")} .value=${this._q}
      @input=${(t) => this._q = t.target.value} /></label>`;
  }
  _subPage() {
    const t = this.hass, { config: e } = this.draft, s = this._sub;
    if (s === "device") return d`<div class="scroll">${this._devicePage()}</div>`;
    if (s === "weather") {
      const c = this._weathers();
      return d`<div class="scroll">${this._group(r(t, "type_weather"), c.map((l) => this._opt(this._entName(l), l, e.entity === l, () => this._set({ entity: l }))))}</div>`;
    }
    if (s === "alarm") {
      const c = Object.keys(t.states).filter((l) => l.startsWith("alarm_control_panel.") && this._visible(l));
      return d`<div class="scroll">${this._group(r(t, "type_alarm"), c.map((l) => this._opt(this._entName(l), l, e.entity === l, () => this._set({ entity: l, name: e.name || void 0 }), us(20))))}
        ${c.length ? g : d`<p class="note">${r(t, "no_alarms_found")}</p>`}</div>`;
    }
    const i = e.device ?? this._deviceOf(e.entity);
    if (s === "entity") {
      const c = this.draft.type === "climate" ? "climate." : "light.", l = i ? this._entitiesOf(i, (h) => h.startsWith(c)) : [];
      return d`<div class="scroll">${this._group(r(t, "light_entity"), l.map((h) => this._opt(this._entName(h), h, e.entity === h, () => this._set({ entity: h }))))}</div>`;
    }
    if (s === "lock") {
      const c = i ? this._entitiesOf(i, (l) => $s.includes(ue(l))) : Object.keys(t.states).filter((l) => $s.includes(ue(l)) && this._visible(l) && this._match(this._entName(l), l));
      return d`<div class="scroll">${i ? g : this._search()}${this._group(r(t, "ch_lock_entity"), c.map((l) => this._opt(this._entName(l), l, e.entity === l, () => this._set({ entity: l, invert: Yi(t, l) || void 0 }))))}</div>`;
    }
    const n = s === "status_entity" ? (c) => Rn(t, c) : s === "power_entity" ? (c) => Ln(t, c) : (c) => In(t, c), a = new Set(e.entity ? Nn(t, e.entity) : []), o = Object.keys(t.states).filter((c) => this._visible(c) && n(c) && this._match(this._entName(c), c)).sort((c, l) => Number(a.has(l)) - Number(a.has(c)) || this._entName(c).localeCompare(this._entName(l))).slice(0, 60);
    return d`<div class="scroll">${this._search()}
      <div class="list">
        ${this._opt(r(t, "auto"), void 0, !e[s], () => this._set({ [s]: void 0 }))}
        ${this._opt(r(t, "none"), void 0, e[s] === "none", () => this._set({ [s]: "none" }))}
        ${o.map((c) => this._opt(this._entName(c), c, e[s] === c, () => this._set({ [s]: c })))}
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
at.styles = [
  M.styles,
  z`
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
Gt([
  v({ attribute: !1 })
], at.prototype, "draft", 2);
Gt([
  v({ attribute: !1 })
], at.prototype, "options", 2);
Gt([
  y()
], at.prototype, "_sub", 2);
Gt([
  y()
], at.prototype, "_q", 2);
Gt([
  y()
], at.prototype, "_allDevices", 2);
at = Gt([
  E("terral-card-config")
], at);
function ga(t, e, s) {
  document.querySelector("terral-card-config")?.remove();
  const i = document.createElement("terral-card-config");
  return i.hass = t, i.draft = { ...e, config: { ...e.config } }, i.options = s, document.body.appendChild(i), i;
}
function Xt(t, e, s, i) {
  const { type: n, view_layout: a, ...o } = i, c = a?.terral;
  ga(e, { type: s, config: o, w: c?.w ?? 2, h: c?.h ?? 2 }, {
    mode: "edit",
    onSave: (l) => t.dispatchEvent(new CustomEvent("terral-card-config", { detail: { config: l.config, size: { w: l.w, h: l.h } }, bubbles: !0, composed: !0, cancelable: !0 })),
    onRemove: () => t.dispatchEvent(new CustomEvent("terral-card-remove", { bubbles: !0, composed: !0 }))
  });
}
function Or(t) {
  return { type: t, config: {}, w: t === "light" ? 1 : 2, h: 2 };
}
function jr(t) {
  for (const e of document.querySelectorAll("terral-card-config")) e.hass = t;
}
var Pr = Object.defineProperty, Nr = Object.getOwnPropertyDescriptor, Q = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Nr(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Pr(e, s, n), n;
};
const Lr = "terral-home-light";
let vt = class extends P {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      Yo(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area,
        onSettings: () => this.hass && this._config && Xt(this, this.hass, "light", this._config)
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !mt(e) && pe(this.hass, e);
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
    return t ? Fe(t) === "temperature" || Fe(t) === "color" || Y(t).length > 0 ? e : e.slice(0, 3) : e;
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...Y(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && Vo(this.hass);
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
    if (mt(t)) return r(s, "unavailable");
    const i = Y(t);
    if (i.length) {
      const c = i.filter((p) => A(s.states[p])).length;
      if (!c) return `${i.length} ${r(s, "lights_off")}`;
      const l = gt(t), h = c === i.length && e === "onoff" ? `${r(s, "all_lit")} (${c})` : `${c} ${r(s, "of")} ${i.length} ${r(s, "lit")}`;
      return l != null && this._size !== "s11" ? `${h} · ${l} %` : h;
    }
    if (!A(t)) return r(s, "off");
    const n = [], a = gt(t);
    a != null && n.push(`${a} %`);
    const o = Rt(t);
    if (o) {
      const c = Us(o, j(s));
      c && n.push(c);
    } else if (e === "temperature" || e === "color") {
      const c = ve(t);
      if (c && t.attributes.color_mode === "color_temp") {
        const l = [...Hs].sort((h, p) => Math.abs(h.kelvin - c) - Math.abs(p.kelvin - c))[0];
        n.push(r(s, l.key));
      }
    }
    return n.join(" · ") || r(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${r(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = Fe(t), s = A(t), i = mt(t), n = Y(t), a = On(t, this._config.use_light_color !== !1), o = s ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};--fill:${a.fill}` : "";
    let c = this._size;
    c === "s42" && !this.getTerralSizes().some((p) => p.h === 4) && (c = "s22");
    const l = d`<button
      class="icon"
      aria-label="${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${G(s, c === "s11" ? 20 : 32)}
      ${n.length && s ? d`<span class="badge">${n.filter((p) => A(this.hass.states[p])).length}</span>` : g}
    </button>`, h = d`<div class="text">
      <span class="name">${this._name(t)}</span>
      <span class="state">${this._status(t, e)}</span>
    </div>`;
    return d`<div
      class="card ${c} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
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
      ${c === "s11" || c === "s21" ? d`${l}${h}` : d`<div class="head">${l}${h}${this._quickButton(t, e, c)}</div>
            ${this._body(t, e, c)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !Y(t).length) return g;
    const i = Rt(t), n = i ? Us(i, j(this.hass)) ?? "" : "", a = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? U(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style=${a}></i>${n || (e === "color" ? r(this.hass, "more_colors") : r(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return d`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${gt(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(s) => Ws(this.hass, t.entity_id, s.detail.value)}
    >${kn(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = Y(t);
    if (s === "s42" && i.length) {
      const a = [...i].sort((h, p) => Number(A(this.hass.states[p])) - Number(A(this.hass.states[h]))), o = e === "onoff" ? 5 : 4, c = a.length > o ? a.slice(0, o - 1) : a, l = a.length - c.length;
      return d`
        ${e !== "onoff" ? this._brightness(t) : g}
        <div class="members">
          ${c.map((h) => {
        const p = this.hass.states[h], u = A(p), m = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? h : h;
        return d`<div class="mr">
              <button class="mi ${u ? "lit" : ""}" ?disabled=${mt(p)} aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${m}"
                @click=${(b) => {
          b.stopPropagation(), p && pe(this.hass, p);
        }}>${G(u, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${m}</span><small>${p ? A(p) ? gt(p) != null ? `${gt(p)} %` : r(this.hass, "on") : r(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${l > 0 ? d`<button class="morebtn" @click=${this._openWindow}>+ ${l} ${r(this.hass, "more")}</button>` : g}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? d`<div class="tags">
          ${i.slice(0, 4).map((a) => {
        const o = this.hass.states[a], c = o ? this.hass.formatEntityName?.(o) ?? o.attributes.friendly_name ?? a : a;
        return d`<span class="tag"><i class=${A(o) ? "lit" : ""}></i>${c}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${A(t) ? r(this.hass, "on") : r(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const a = t.attributes.min_color_temp_kelvin ?? 2e3, o = t.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${r(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${r(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${a} .max=${o} .value=${ve(t) ?? 3500}
          .label=${r(this.hass, "temperature")}
          @value-changed=${(c) => Qe(this.hass, t, c.detail.value)}></terral-slider>
        <div class="chips">
          ${Hs.map((c) => d`<button class="chip" style="background:${c.css}" @click=${(l) => {
        l.stopPropagation(), Qe(this.hass, t, c.kelvin);
      }}>${r(this.hass, c.key)}</button>`)}
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
vt.styles = z`
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
Q([
  v({ attribute: !1 })
], vt.prototype, "hass", 2);
Q([
  v({ type: Boolean })
], vt.prototype, "preview", 2);
Q([
  y()
], vt.prototype, "_config", 2);
Q([
  y()
], vt.prototype, "_size", 2);
vt = Q([
  E(Lr)
], vt);
let Wt = class extends P {
  render() {
    if (!this.hass || !this.entity) return g;
    const t = j(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: U(i) })) : Ir[t] ??= Rr(t), s = Rt(this.entity);
    return e.slice(0, 6).map(
      (i) => d`<button
        class=${s && U(s) === U(i.rgb) ? "sel" : ""}
        style="background:${U(i.rgb)}"
        aria-label=${i.name}
        @click=${(n) => {
        n.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
Wt.styles = z`
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
Q([
  v({ attribute: !1 })
], Wt.prototype, "hass", 2);
Q([
  v({ attribute: !1 })
], Wt.prototype, "entity", 2);
Q([
  v({ attribute: !1 })
], Wt.prototype, "colors", 2);
Wt = Q([
  E("terral-light-favs")
], Wt);
const Ir = {}, Rr = (t) => pi.map((e) => ({ rgb: e.rgb, name: e.name[t] })), Hr = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, fa = ["away", "home", "night", "vacation", "custom"], Wr = ["away", "home", "vacation"], Zs = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function wt(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const Cs = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : fa.includes(e) ? e : void 0;
};
function wi(t) {
  return Cs(t.state) ?? Cs(t.attributes.arm_mode) ?? Cs(t.attributes.next_state);
}
function ma(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? fa.filter((s) => e & Hr[s]) : ["away", "home"];
}
function is(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function Ur(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const $i = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, Br = (t) => $i(t) != null && t.attributes.code_arm_required !== !1;
function ns(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function Fr(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const Js = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function qr(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function Yr(t, e, s, i, n = !1) {
  if (qr(t, e)) {
    const o = { entity_id: e.entity_id, mode: s };
    return i && (o.code = i), n && (o.force = !0), t.callService("alarmo", "arm", o);
  }
  const a = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", a, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function Vr(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function Gr(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function _a(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), n = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(n, 150);
    };
    n();
  });
}
function Xr(t, e, s, i, n, a = {}) {
  const o = async (h) => {
    const p = t(), u = p?.states[e];
    if (!p || !u) return { result: "wrong" };
    try {
      await Yr(p, u, s, h, a.force);
    } catch {
      return { result: "wrong", code: h };
    }
    const m = () => t()?.states[e];
    if (await _a(() => {
      const _ = m();
      return !!_ && wt(_) !== "disarmed";
    })) return { result: "armed", code: h };
    const f = m();
    return { result: f && ns(f).length ? "refused" : "wrong", code: h };
  }, c = t()?.states[e];
  if (!c) return;
  const l = $i(c);
  if (a.code != null || !l || !Br(c)) {
    o(a.code).then(n);
    return;
  }
  i(l, async (h) => {
    const p = await o(h);
    return p.result === "wrong" ? !1 : (n(p), !0);
  });
}
function Kr(t, e, s) {
  const i = async (o) => {
    const c = t(), l = c?.states[e];
    if (!c || !l) return !1;
    try {
      await Vr(c, l, o);
    } catch {
      return !1;
    }
    return _a(() => {
      const h = t()?.states[e];
      return !!h && wt(h) === "disarmed";
    });
  }, n = t()?.states[e];
  if (!n) return;
  const a = $i(n);
  if (!a) {
    i();
    return;
  }
  s(a, i);
}
const Ms = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), Le = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function Qr(t) {
  const e = Zs[t];
  return {
    bg: Le(Ms(e, [255, 255, 255], 0.84), 0.95),
    fg: Le(Ms(e, [10, 10, 20], 0.82)),
    fg2: Le(Ms(e, [20, 10, 30], 0.72)),
    accent: Le(e)
  };
}
const Zi = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var Zr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, Kt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Jr(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Zr(e, s, n), n;
};
let ot = class extends M {
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
        <p class="err" aria-live="polite">${this._error ? r(this.hass, "code_wrong") : g}</p>
        <button class="okbtn" ?disabled=${!this._code || this._busy}>${r(this.hass, "ok")}</button>
      </form>`;
    const t = Math.max(4, this._code.length);
    return d`
      <div class="dots ${this._error ? "shake" : ""} ${this._busy ? "busy" : ""}" aria-label="${this._code.length}">
        ${Array.from({ length: t }, (e, s) => d`<i class=${s < this._code.length ? "f" : ""}></i>`)}
      </div>
      <p class="err" aria-live="polite">${this._error ? r(this.hass, "code_wrong") : g}</p>
      <div class="pad">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((e) => d`<button class="key" @click=${() => this._press(e)}>${e}</button>`)}
        <button class="key fn" aria-label=${r(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${vo(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${r(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${Ue(26)}</button>
      </div>
    `;
  }
};
ot.styles = [
  M.styles,
  z`
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
Kt([
  v()
], ot.prototype, "format", 2);
Kt([
  v({ attribute: !1 })
], ot.prototype, "submit", 2);
Kt([
  y()
], ot.prototype, "_code", 2);
Kt([
  y()
], ot.prototype, "_error", 2);
Kt([
  y()
], ot.prototype, "_busy", 2);
ot = Kt([
  E("terral-code-sheet")
], ot);
function ba(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const Ce = /* @__PURE__ */ new Map(), tl = 6e4, Me = "terral-alarm-refusal", xa = () => window.dispatchEvent(new Event(Me));
function as(t) {
  const e = Ce.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > tl || wt(t) !== "disarmed") {
      Ce.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function ki(t) {
  Ce.delete(t) && xa();
}
function os(t, e, s, i = !1) {
  const n = t();
  if (!n) return;
  const a = Ce.get(e), o = i ? { force: !0, code: a?.code } : {};
  ki(e), Xr(
    t,
    e,
    s,
    (c, l) => ba(n, c, l),
    (c) => {
      c.result === "refused" && (Ce.set(e, { mode: s, code: c.code, at: Date.now() }), xa());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    o
  );
}
function me(t, e) {
  const s = t();
  s && Kr(t, e, (i, n) => ba(s, i, n));
}
const el = (t) => t.charAt(0).toLowerCase() + t.slice(1), rs = (t, e) => r(t, `mode_${e}`);
function ya(t, e, s) {
  const i = wt(e), n = wi(e), a = n ? el(rs(t, n)) : "";
  if (as(e)) {
    const c = ns(e);
    return {
      title: r(t, "alarm_failed"),
      status: c.length > 1 ? r(t, "alarm_open_n", { n: c.length }) : r(t, "alarm_open", { name: c[0] ? Js(t, c[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: r(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${r(t, "alarm_arming", { mode: a })} · ${r(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${r(t, "alarm_armed", { mode: a })} · ${r(t, "alarm_since", { t: Zi(t, e.last_changed) })}` };
    case "pending":
      return { title: r(t, "alarm_pending"), status: r(t, "alarm_pending_sub") };
    case "triggered": {
      const c = ns(e), l = c.length ? Js(t, c[0]) + (c.length > 1 ? ` +${c.length - 1}` : "") : s;
      return { title: r(t, "alarm_triggered"), status: `${l} · ${Zi(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: r(t, "unavailable") };
  }
}
const va = (t) => {
  const e = is(t);
  return e == null ? null : Math.ceil(e);
};
var sl = Object.defineProperty, il = Object.getOwnPropertyDescriptor, Ee = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? il(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && sl(e, s, n), n;
};
const wa = (t, e = 20) => ({ away: _o, home: Ke, night: bo, vacation: xo, custom: yo })[t](e);
let $t = class extends M {
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
    }}>${Ct(19)}</button>` : g;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Me, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && is(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Me, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? d`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => d`<div class="row static"><span class="ic">${Ls(18)}</span><span class="nm">${Js(this.hass, s)}</span></div>`)}</div>
    </section>` : g;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = wt(e), n = wi(e), a = as(e), o = va(e), { title: c, status: l } = ya(t, e, this.name), h = i === "armed" && n ? `rgb(${Zs[n].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", p = a || i === "pending" || i === "triggered" ? Ls(30) : i === "armed" ? Mn(32) : us(32), u = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let m = g;
    a ? m = d`<div class="btns">
        <button class="big solid" @click=${() => os(this._getHass, s, a.mode, !0)}>${It()}<span>${r(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => ki(s)}><span>${r(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? m = d`<section>
        <h3>${r(t, "arm_options")}</h3>
        <div class="list">
          ${ma(e).map(
      (f) => d`<button class="row" @click=${() => os(this._getHass, s, f)}>
              <span class="ic" style="color:rgb(${Zs[f].join(",")})">${wa(f)}</span><span class="nm">${rs(t, f)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? m = d`<div class="btns">
        <button class="big" @click=${() => me(this._getHass, s)}>${ps(20)}<span>${r(t, "cancel")}</span></button>
        ${u ? d`<button class="big" @click=${() => Gr(t, e)}>${wo()}<span>${r(t, "skip_delay")}</span></button>` : g}
      </div>` : i !== "unavailable" && (m = d`<div class="btns"><button class="big solid" @click=${() => me(this._getHass, s)}>${xe()}<span>${r(t, "disarm")}</span></button></div>`);
    const b = e.attributes.changed_by;
    return d`
      <div class="status st-${a ? "failed" : i}" style="--ac:${h}">
        <span class="sic">${p}</span>
        <div class="txt"><strong>${c}</strong><span>${l}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : g}
      </div>
      <div class="scroll">
        ${m}
        ${this._sensorList(r(t, "open_sensors"), ns(e))}
        ${i === "armed" ? this._sensorList(r(t, "bypassed_sensors"), Fr(e)) : g}
        <p class="foot">${r(t, "changed_by")}: ${b ? `${b} · ` : ""}${wn(t, e.last_changed)}</p>
      </div>
    `;
  }
};
$t.styles = [
  M.styles,
  z`
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
Ee([
  v()
], $t.prototype, "entityId", 2);
Ee([
  v()
], $t.prototype, "name", 2);
Ee([
  v({ attribute: !1 })
], $t.prototype, "onSettings", 2);
Ee([
  y()
], $t.prototype, "_tick", 2);
$t = Ee([
  E("terral-alarm-dialog")
], $t);
function nl(t, e, s, i) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const n = document.createElement("terral-alarm-dialog");
  return n.hass = t, n.entityId = e, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function al(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var ol = Object.defineProperty, rl = Object.getOwnPropertyDescriptor, bs = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? rl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ol(e, s, n), n;
};
const ll = "terral-home-alarm";
let Ut = class extends P {
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
    super.connectedCallback(), window.addEventListener(Me, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(Me, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
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
    t.has("hass") && this.hass && al(this.hass);
    const e = this._entity, s = !!e && is(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && nl(this.hass, this._config.entity, this._name, () => this.hass && this._config && Xt(this, this.hass, "alarm", this._config));
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = wt(t), i = as(t);
    if (i)
      return d`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => os(this._getHass, e, i.mode, !0))}>${It()}<span>${r(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => ki(e))}><span>${r(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const n = ma(t).filter((a) => Wr.includes(a));
        return d`<div class="row ${n.length > 2 ? "three" : ""}">
          ${n.map(
          (a) => d`<button class="pb" aria-label=${r(this.hass, "arm_mode", { mode: rs(this.hass, a) })} @click=${this._act(() => os(this._getHass, e, a))}>
              ${wa(a)}<span>${rs(this.hass, a)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return d`<div class="row"><button class="pb" @click=${this._act(() => me(this._getHass, e))}>${ps(20)}<span>${r(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return d`<div class="row"><button class="pb" @click=${this._act(() => me(this._getHass, e))}>${xe()}<span>${r(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return d`<div class="row"><button class="pb solid" @click=${this._act(() => me(this._getHass, e))}>${xe()}<span>${r(this.hass, "disarm")}</span></button></div>`;
      default:
        return g;
    }
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${r(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const e = wt(t), s = !!as(t), i = wi(t), n = e === "armed" && !!i, a = n ? Qr(i) : void 0, o = va(t), c = Ur(t), l = is(t), h = l != null && c ? l / c : 0, p = `${a ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};` : ""}--p:${h}`, u = s || e === "pending" || e === "triggered" ? Ls(28) : n ? Mn(30) : us(30), { title: m, status: b } = ya(this.hass, t, this._name);
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
        ${o != null ? d`<span class="secs">${o}</span>` : g}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
Ut.styles = z`
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
bs([
  v({ attribute: !1 })
], Ut.prototype, "hass", 2);
bs([
  y()
], Ut.prototype, "_config", 2);
bs([
  y()
], Ut.prototype, "_tick", 2);
Ut = bs([
  E(ll)
], Ut);
const Ie = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), Dt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, As = [52, 199, 123], cl = [255, 149, 0], Ji = [90, 200, 250], zs = "#b3261e", dl = "#3a3d4a", tn = (t, e, s, i, n) => `--bg:${Dt(Ie(t, [255, 255, 255], e), 0.95)};--bg-solid:${Dt(Ie(t, [255, 255, 255], e))};--fg:${Dt(Ie(i, [10, 10, 20], 0.8))};--fg2:${Dt(Ie(i, [20, 10, 30], 0.7))};--accent:${Dt(s)};--lk:${n}`;
function ce(t, e) {
  const s = t.states[e.entity], i = _i(t, e), n = Qo(t, i), a = fi(t, i.power);
  if (!s || s.state === "unavailable" || s.state === "unknown")
    return { look: "unavailable", locked: !1, car: n, ids: i, kw: a, style: "", tinted: !1 };
  const o = Xo(s, !!e.invert);
  let c;
  o ? c = n === "connected" || n === "charging" ? "warn" : "locked" : n === "charging" ? c = "charging" : n === "connected" ? c = "ready" : c = "none";
  const l = c === "charging" ? tn(As, 0.84, As, As, zs) : c === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${Dt(cl)};--lk:${zs}` : c === "ready" ? tn(Ji, 0.8, Ji, [30, 110, 160], zs) : `--lk:${dl}`;
  return { look: c, locked: o, car: n, ids: i, kw: a, style: l, tinted: c === "charging" || c === "warn" || c === "ready" };
}
function de(t, e, s) {
  const i = e.kw != null ? `${B(t, e.kw)} kW` : "";
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
var hl = Object.defineProperty, pl = Object.getOwnPropertyDescriptor, Qt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? pl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && hl(e, s, n), n;
};
let rt = class extends M {
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
    }}>${Ct(19)}</button>` : g;
  }
  updated() {
    if (!this.hass) return;
    const t = _i(this.hass, this.config).power;
    t && t !== this._histFor && (this._histFor = t, this._load(t));
  }
  async _load(t) {
    try {
      const e = Date.now(), s = await Hn(this.hass, t, new Date(e - 7 * 864e5));
      this._sessions = Wn(s, e), this._histError = !1;
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
    const s = ce(t, this.config), i = Pn(t, s.ids.energy), n = this._sessions?.find((f) => f.live), a = s.look === "charging" && i != null ? r(t, "this_charge", { kwh: `${B(t, i)} kWh`, time: n ? Fs(Date.now() - n.start) : "" }).replace(/ · $/, "") : i != null ? `${r(t, "last_session")}: ${B(t, i)} kWh` : "", o = this._sessions ? Un(this._sessions, 7) : void 0, c = o ? Math.max(...o.map((f) => f.kwh), 0.1) : 1, l = o?.reduce((f, _) => f + _.kwh, 0) ?? 0, h = this._sessions?.length ?? 0, p = [...this._sessions ?? []].reverse().slice(0, 5), u = t.locale?.language ?? t.language ?? void 0, m = (f, _) => _ === 6 ? u?.startsWith("es") ? "Hoy" : "Today" : f.toLocaleDateString(u, { weekday: "narrow" }), b = (f) => {
      const _ = new Date(f), $ = /* @__PURE__ */ new Date(), w = new Date($.getFullYear(), $.getMonth(), $.getDate() - 1), D = _.toLocaleTimeString(u, { hour: "2-digit", minute: "2-digit" }), ht = u?.startsWith("es");
      if (_.toDateString() === $.toDateString()) return `${ht ? "Hoy" : "Today"} · ${D}`;
      if (_.toDateString() === w.toDateString()) return `${ht ? "Ayer" : "Yesterday"} · ${D}`;
      const At = _.toLocaleDateString(u, { weekday: "long", day: "numeric" });
      return `${At.charAt(0).toUpperCase()}${At.slice(1)} · ${D}`;
    };
    return d`
      <div class="status ${s.tinted ? "on" : ""}" style=${s.style}>
        <button class="icon" aria-label=${s.locked ? r(t, "unlock") : r(t, "lock")} @click=${() => Bs(t, e, !s.locked, !!this.config.invert)}>
          ${gs(32)}${s.locked ? d`<span class="lk">${It(14)}</span>` : g}
        </button>
        <div class="txt"><strong>${de(t, s, !1)}</strong>${a ? d`<span>${a}</span>` : g}</div>
      </div>
      ${s.look !== "unavailable" ? d`<button class="big ${s.locked ? "solid" : ""}" @click=${() => Bs(t, e, !s.locked, !!this.config.invert)}>
            ${s.locked ? xe() : It()}<span>${s.locked ? r(t, "unlock") : r(t, "lock")}</span>
          </button>` : g}
      <div class="scroll">
        ${s.ids.power ? d`
              <section>
                <h3>${r(t, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError ? d`<p class="empty">${r(t, "history_unavailable")}</p>` : d`<div class="week">
                          ${(o ?? Array.from({ length: 7 }, (f, _) => ({ day: new Date(Date.now() - (6 - _) * 864e5), kwh: 0 }))).map(
      (f, _) => d`<div>
                              <i class=${_ === 6 ? "today" : f.kwh ? "" : "zero"} style="height:${f.kwh ? Math.max(6, f.kwh / c * 62) : 3}px"></i>
                              <span>${m(f.day, _)}</span>
                            </div>`
    )}
                        </div>
                        <div class="sum"><span>${r(t, "week_total")} <b>${B(t, l)} kWh</b></span><span>${h} ${u?.startsWith("es") ? h === 1 ? "carga" : "cargas" : h === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${r(t, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? d`<p class="empty">…</p>` : g}
                  ${this._sessions && !p.length ? d`<p class="empty">${r(t, "no_history")}</p>` : g}
                  ${p.map(
      (f) => d`<div class="sess">
                      <span class="dot">${$o()}</span>
                      <span class="nm">
                        <span>${b(f.start)}${f.live ? d`<em>${r(t, "charging_now")}</em>` : g}</span>
                        <small>${f.live ? `${r(t, "in_progress")} · ` : ""}${Fs(f.end - f.start)}${f.live ? "" : ` · ${r(t, "max_kw", { kw: `${B(t, f.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${B(t, f.kwh)} kWh</span>
                    </div>`
    )}
                </div>
              </section>` : g}
      </div>
    `;
  }
};
rt.styles = [
  M.styles,
  z`
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
Qt([
  v({ attribute: !1 })
], rt.prototype, "config", 2);
Qt([
  v()
], rt.prototype, "name", 2);
Qt([
  v({ attribute: !1 })
], rt.prototype, "onSettings", 2);
Qt([
  y()
], rt.prototype, "_sessions", 2);
Qt([
  y()
], rt.prototype, "_histError", 2);
rt = Qt([
  E("terral-charger-dialog")
], rt);
function ul(t, e, s, i) {
  document.querySelector("terral-charger-dialog")?.remove();
  const n = document.createElement("terral-charger-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function gl(t) {
  for (const e of document.querySelectorAll("terral-charger-dialog")) e.hass = t;
}
var fl = Object.defineProperty, ml = Object.getOwnPropertyDescriptor, Mt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ml(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && fl(e, s, n), n;
};
const _l = "terral-home-charger";
let X = class extends P {
  constructor() {
    super(...arguments), this._size = "s22", this._spark = [], this._held = !1, this._toggle = (t) => {
      if (t.stopPropagation(), !this.hass || !this._config) return;
      const e = this.hass.states[this._config.entity];
      if (!e) return;
      const s = ce(this.hass, this._config);
      s.look !== "unavailable" && Bs(this.hass, e, !s.locked, !!this._config.invert);
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
    const s = ce(this.hass, this._config).ids;
    return [this._config.entity, s.status, s.power, s.energy].some((i) => i && e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (!this.hass || !this._config) return;
    t.has("hass") && gl(this.hass);
    const e = ce(this.hass, this._config);
    if (this._size === "s42" && e.ids.power) {
      this._histFor !== e.ids.power && (this._histFor = e.ids.power, this._loadHistory(e.ids.power), clearInterval(this._histTimer), this._histTimer = window.setInterval(() => this._loadHistory(e.ids.power), 30 * 6e4));
      const s = fi(this.hass, e.ids.power), i = this._spark[this._spark.length - 1];
      if (s != null && (!i || i[1] !== s)) {
        const n = Date.now();
        this._spark = [...this._spark.filter(([a]) => n - a < 36e5), [n, s]], e.look === "charging" && !this._sessionStart && (this._sessionStart = n), e.look !== "charging" && (this._sessionStart = void 0);
      }
    }
  }
  async _loadHistory(t) {
    if (this.hass)
      try {
        const e = Date.now(), s = await Hn(this.hass, t, new Date(e - 7 * 864e5)), i = Wn(s, e);
        this._week = Un(i, 7).reduce((a, o) => a + o.kwh, 0);
        const n = i.find((a) => a.live);
        this._sessionStart = n?.start, this._spark = s.filter(([a]) => e - a < 36e5);
      } catch {
        this._week = void 0;
      }
  }
  _openWindow(t = "main") {
    if (!this.hass || !this._config) return;
    const e = () => this.hass && this._config && Xt(this, this.hass, "charger", this._config);
    if (t === "settings") return e();
    ul(this.hass, this._config, this._name, e);
  }
  // ---- Render ---------------------------------------------------------------
  _icon(t, e) {
    return d`<button class="icon" aria-label=${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")} ?disabled=${t.look === "unavailable"} @click=${this._toggle}>
      ${gs(e)}
      ${t.locked ? d`<span class="lk">${It(14)}</span>` : g}
    </button>`;
  }
  _lockBtn(t) {
    return t.look === "unavailable" ? g : d`<button class="pb ${t.locked && t.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${t.locked ? xe(19) : It(19)}<span>${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")}</span>
    </button>`;
  }
  _sparkline() {
    const t = this._spark;
    if (t.length < 2) return g;
    const e = 300, s = 58, i = Date.now(), n = Math.max(this._config?.max_power ?? 0, ...t.map((l) => l[1]), 1), a = t.map(([l, h]) => [Math.max(0, e - (i - l) / 36e5 * e), s - 4 - h / n * (s - 10)]);
    a.push([e, a[a.length - 1][1]]);
    const o = a.map((l, h) => `${h ? "L" : "M"}${l[0].toFixed(1)} ${l[1].toFixed(1)}`).join(" "), c = a[a.length - 1];
    return x`<svg class="spark" viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${o} L${e} ${s} L${a[0][0]} ${s}Z"></path><path class="l" d=${o}></path><circle cx=${c[0]} cy=${c[1]} r="4"></circle></svg>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass;
    if (!t.states[this._config.entity])
      return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = ce(t, this._config), i = this._size, n = Pn(t, s.ids.energy), a = s.kw != null ? `${B(t, s.kw)} kW` : "", o = n != null ? `${B(t, n)} kWh` : "", c = s.look === "charging", l = this._name;
    let h;
    if (i === "s11")
      h = d`${this._icon(s, 22)}<div class="text"><span class="name">${l}</span><span class="state">${de(t, s, !0)}</span></div>`;
    else if (i === "s21") {
      const p = c && o ? [a, o].filter(Boolean).join(" · ") : de(t, s, !0);
      h = d`${this._icon(s, 32)}<div class="text"><span class="name">${l}</span><span class="state">${p}</span></div>`;
    } else {
      const p = d`<div class="head">${this._icon(s, 32)}<div class="text"><span class="name">${l}</span><span class="state">${de(t, s, !1)}</span></div></div>`;
      if (i === "s22")
        h = d`${p}<div class="row">
          ${c && (a || o) ? d`${a ? d`<div class="pb static"><span>${a}</span></div>` : g}
                ${o ? d`<div class="pb static">${Wi()}<span>${o}</span></div>` : g}` : this._lockBtn(s)}
        </div>`;
      else {
        const u = this._sessionStart ?? (s.ids.status ? new Date(t.states[s.ids.status]?.last_changed ?? Date.now()).getTime() : void 0);
        h = d`${p}
          ${c ? d`<div class="chart flow">
                  <div class="chead"><span class="big">${s.kw != null ? B(t, s.kw) : "–"}<small>kW</small></span><span class="state">${r(t, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${o ? d`<div class="pb static">${Wi()}<span>${o}</span></div>` : g}
                  ${u ? d`<div class="pb static">${ko()}<span>${Fs(Date.now() - u)}</span></div>` : g}
                </div>` : d`<div class="stats">
                ${o ? d`<div class="stat"><b>${o}</b><span>${r(t, "last_session")}</span></div>` : g}
                ${this._week != null ? d`<div class="stat"><b>${B(t, this._week)} kWh</b><span>${r(t, "this_week")}</span></div>` : g}
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
      aria-label=${`${l}, ${de(t, s, !1)}`}
      @click=${this._cardClick}
      @keydown=${(p) => {
      (p.key === "Enter" || p.key === " ") && p.target === p.currentTarget && (p.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(p) => p.preventDefault()}
    >${h}</div>`;
  }
};
X.styles = z`
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
Mt([
  v({ attribute: !1 })
], X.prototype, "hass", 2);
Mt([
  y()
], X.prototype, "_config", 2);
Mt([
  y()
], X.prototype, "_size", 2);
Mt([
  y()
], X.prototype, "_spark", 2);
Mt([
  y()
], X.prototype, "_week", 2);
Mt([
  y()
], X.prototype, "_sessionStart", 2);
X = Mt([
  E(_l)
], X);
var bl = Object.defineProperty, xl = Object.getOwnPropertyDescriptor, xs = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? xl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && bl(e, s, n), n;
};
let Bt = class extends P {
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
      }}>${t.icon ?? g}<span>${t.label}</span></button>`
    )}
    </div>`;
  }
};
Bt.styles = z`
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
xs([
  v({ attribute: !1 })
], Bt.prototype, "items", 2);
xs([
  v({ attribute: !1 })
], Bt.prototype, "anchor", 2);
xs([
  v()
], Bt.prototype, "align", 2);
Bt = xs([
  E("terral-pop")
], Bt);
function ti(t, e, s = "left") {
  document.querySelector("terral-pop")?.remove();
  const i = document.createElement("terral-pop");
  return i.items = e, i.anchor = t.getBoundingClientRect(), i.align = s, document.body.appendChild(i), i;
}
var yl = Object.defineProperty, vl = Object.getOwnPropertyDescriptor, Te = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? vl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && yl(e, s, n), n;
};
let kt = class extends M {
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
    }}>${Ct(19)}</button>` : g;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  _step(t, e) {
    const s = ge(t, this.config), i = this._pending ?? Gs(t);
    if (i == null) return;
    const n = typeof i == "number" ? _t(i + e * s.step, s) : e > 0 ? { low: i.low, high: _t(i.high + s.step, s) } : { low: _t(i.low - s.step, s), high: i.high };
    this._pending = n, clearTimeout(this._timer), this._timer = window.setTimeout(() => {
      Zn(this.hass, t, n), window.setTimeout(() => this._pending = void 0, 2500);
    }, 650);
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = j(t), i = N(e), n = Pt(e, this.config), a = Yn(e, this.config), o = this._pending ?? Gs(e), c = fe(e), l = we(e), h = st(e), p = sr(e), u = this.config.show_swing === !0 && Fn(e), m = e.attributes.swing_mode != null && e.attributes.swing_mode !== "off", b = [c != null ? `${s === "es" ? "Dentro" : "Inside"} ${it(t, c)}°` : "", sa(t, e)].filter(Boolean).join(" · ");
    return d`
      <div class="status ${i ? "" : "on"}" style=${ea(e)}>
        <button class="icon" aria-label=${i ? r(t, "turn_on") : r(t, "turn_off")} ?disabled=${jt(e)} @click=${() => i ? Xn(t, e) : Kn(t, e)}>
          ${Nt(i ? "off" : e.state, 30)}
        </button>
        <div class="txt">
          <strong>${i ? s === "es" ? "Apagado" : "Off" : n ? `${F(s, e.state)} · ${ke(t, o)}` : F(s, e.state)}</strong>
          ${b ? d`<span>${b}</span>` : g}
        </div>
      </div>
      <div class="scroll">
        <section class=${n ? "" : "dim"}>
          <h3>${r(t, "temperature")}</h3>
          <div class="wstep">
            <button aria-label="−" ?disabled=${!n} @click=${() => this._step(e, -1)}>${di()}</button>
            <span class="v">${n ? ke(t, o) : i ? "—" : r(t, "no_temperature")}</span>
            <button aria-label="+" ?disabled=${!n} @click=${() => this._step(e, 1)}>${hi()}</button>
          </div>
        </section>
        ${h.length > 1 ? d`<section>
              <h3>${r(t, "climate_mode")}</h3>
              <div class="grid">
                ${h.map((f) => d`<button class="opt ${!i && e.state === f ? "sel" : ""}" @click=${() => $e(t, e, f)}>${Nt(f, 22)}<span>${F(s, f)}</span></button>`)}
              </div>
            </section>` : g}
        ${l.length ? d`<section class=${a ? "" : "dim"}>
              <h3>${r(t, "climate_fan")}</h3>
              <div class="grid small" style="grid-template-columns:repeat(${Math.min(l.length, 4)},1fr)">
                ${l.map((f) => d`<button class="opt ${e.attributes.fan_mode === f ? "sel" : ""}" ?disabled=${!a} @click=${() => Qn(t, e, f)}><span>${Ys(s, f)}</span></button>`)}
              </div>
              ${a ? g : d`<p class="note">${i ? r(t, "climate_off_note") : r(t, "fan_fixed", { mode: F(s, e.state) })}</p>`}
            </section>` : g}
        ${u ? d`<div class="list"><button class="li" role="switch" aria-checked=${m} ?disabled=${i} @click=${() => ar(t, e, !m)}>
              <span class="nm">${r(t, "swing")}</span><span class="tog ${m ? "on" : ""}"></span>
            </button></div>` : g}
        ${p.length ? d`<section>
              <h3>${r(t, "presets")}</h3>
              <div class="grid small">
                ${p.map((f) => d`<button class="opt ${e.attributes.preset_mode === f ? "sel" : ""}" ?disabled=${i} @click=${() => nr(t, e, f)}><span>${Ys(s, f)}</span></button>`)}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
kt.styles = [
  M.styles,
  z`
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
Te([
  v({ attribute: !1 })
], kt.prototype, "config", 2);
Te([
  v()
], kt.prototype, "name", 2);
Te([
  v({ attribute: !1 })
], kt.prototype, "onSettings", 2);
Te([
  y()
], kt.prototype, "_pending", 2);
kt = Te([
  E("terral-climate-dialog")
], kt);
function wl(t, e, s, i) {
  document.querySelector("terral-climate-dialog")?.remove();
  const n = document.createElement("terral-climate-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function $l(t) {
  for (const e of document.querySelectorAll("terral-climate-dialog")) e.hass = t;
}
var kl = Object.defineProperty, Sl = Object.getOwnPropertyDescriptor, De = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Sl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && kl(e, s, n), n;
};
const Cl = "terral-home-climate";
class Ml {
  constructor(e) {
    this.onChange = e;
  }
  set(e, s, i) {
    this.value = i, this.onChange(), clearTimeout(this.timer), this.timer = window.setTimeout(() => {
      Zn(e, s, i), window.setTimeout(() => {
        this.value = void 0, this.onChange();
      }, 2500);
    }, 650);
  }
}
let St = class extends P {
  constructor() {
    super(...arguments), this._size = "s22", this._tick = 0, this._pending = new Ml(() => this._tick++), this._held = !1, this._dragging = !1, this._power = (t) => {
      t.stopPropagation();
      const e = this._entity;
      !e || !this.hass || jt(e) || (N(e) ? Xn(this.hass, e) : Kn(this.hass, e));
    }, this._modeMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = j(this.hass);
      ti(t.currentTarget, st(e).map((i) => ({
        label: F(s, i),
        icon: Nt(i, 21),
        selected: !N(e) && e.state === i,
        run: () => $e(this.hass, e, i)
      })));
    }, this._fanMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = j(this.hass);
      ti(t.currentTarget, we(e).map((i) => ({
        label: Ys(s, i),
        icon: Is(21),
        selected: e.attributes.fan_mode === i,
        run: () => Qn(this.hass, e, i)
      })), "right");
    }, this._dialDown = (t) => {
      const e = this._entity;
      !e || !this._config || !Pt(e, this._config) || (t.stopPropagation(), this._cancelHold(), this._dragging = !0, t.currentTarget.setPointerCapture(t.pointerId), this._dialMove(t));
    }, this._dialMove = (t) => {
      if (!this._dragging || !this.hass || !this._config) return;
      const e = this._entity;
      if (!e) return;
      const s = t.currentTarget.getBoundingClientRect(), i = s.left + s.width / 2, n = s.top + s.height * 100 / 180;
      let o = 225 - Math.atan2(n - t.clientY, t.clientX - i) * 180 / Math.PI;
      o < 0 && (o += 360), o > 300 && (o = 0);
      const c = ge(e, this._config), l = _t(c.min + Math.min(1, o / 270) * (c.max - c.min), c), h = this._target(e);
      h != null && typeof h == "object" ? this._pending.set(this.hass, e, { low: Math.min(h.low, l - c.step), high: l }) : this._pending.set(this.hass, e, l);
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
      $l(this.hass);
      const e = this._entity;
      e && Gn(e);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  _target(t) {
    return this._pending.value ?? Gs(t);
  }
  _step(t) {
    return (e) => {
      e.stopPropagation();
      const s = this._entity;
      if (!s || !this.hass || !this._config) return;
      const i = ge(s, this._config), n = this._target(s);
      n != null && (typeof n == "number" ? this._pending.set(this.hass, s, _t(n + t * i.step, i)) : t > 0 ? this._pending.set(this.hass, s, { low: n.low, high: _t(n.high + i.step, i) }) : this._pending.set(this.hass, s, { low: _t(n.low - i.step, i), high: n.high }));
    };
  }
  _openWindow() {
    !this.hass || !this._config || wl(this.hass, this._config, this._name, () => this.hass && this._config && Xt(this, this.hass, "climate", this._config));
  }
  // ---- Render -------------------------------------------------------------------
  _pct(t) {
    if (!this._config || !Pt(t, this._config)) return 0;
    const e = ge(t, this._config), s = this._target(t);
    if (s == null) return 0;
    const i = typeof s == "number" ? s : s.high;
    return Math.max(0, Math.min(1, (i - e.min) / (e.max - e.min)));
  }
  _icon(t, e) {
    return d`<button class="icon" aria-label=${N(t) ? r(this.hass, "turn_on") : r(this.hass, "turn_off")} ?disabled=${jt(t)} @click=${this._power}>
      ${Nt(N(t) ? "off" : t.state, e)}
    </button>`;
  }
  _modeBtn(t) {
    return st(t).length < 2 ? g : d`<button class="rbtn" aria-label=${r(this.hass, "climate_mode")} ?disabled=${jt(t)} @click=${this._modeMenu}>
      ${Nt(N(t) ? st(t)[0] ?? "off" : t.state, 22)}
    </button>`;
  }
  _fanBtn(t) {
    const e = we(t);
    if (!e.length) return g;
    const s = Yn(t, this._config), i = t.attributes.fan_mode;
    return d`<button class="rbtn" aria-label=${r(this.hass, "climate_fan")} ?disabled=${!s} @click=${this._fanMenu}>
      ${Is(22)}${i ? d`<span class="tag">${cr(e, i)}</span>` : g}
    </button>`;
  }
  _stepper(t) {
    const e = this.hass, s = Pt(t, this._config), i = this._target(t), n = fe(t), a = s ? d`<span class="v ${typeof i == "object" ? "range" : ""}">${ke(e, i)}</span>` : d`<span class="v muted">${N(t) ? n != null ? `${it(e, n)}° ${j(e) === "es" ? "dentro" : "inside"}` : "—" : r(e, "no_temperature")}</span>`;
    return d`<div class="step ${s ? "" : "dis"}">
      <button aria-label="−" ?disabled=${!s} @click=${this._step(-1)}>${di()}</button>
      ${a}
      <button aria-label="+" ?disabled=${!s} @click=${this._step(1)}>${hi()}</button>
    </div>`;
  }
  _dial(t) {
    const e = this.hass, s = j(e), i = 86, n = 2 * Math.PI * i, a = n * 0.75, o = this._pct(t), c = (225 - o * 270) * Math.PI / 180, l = 114 + i * Math.cos(c), h = 100 - i * Math.sin(c), p = Pt(t, this._config), u = fe(t), m = u != null ? `${it(e, u)}°` : "—", b = this._target(t), f = p ? ke(e, b) : m, _ = N(t) ? `${s === "es" ? "dentro · apagado" : "inside · off"}` : p ? `${F(s, t.state)} · ${s === "es" ? "dentro" : "inside"} ${m}` : `${F(s, t.state)} · ${s === "es" ? "dentro" : "inside"}`;
    return d`<div class="dial ${p ? "" : "disabled"}" @pointerdown=${this._dialDown} @pointermove=${this._dialMove} @pointerup=${this._dialUp} @pointercancel=${this._dialUp}>
      ${x`<svg viewBox="0 0 228 180" aria-hidden="true">
        <circle class="trk" cx="114" cy="100" r=${i} stroke-dasharray="${a} ${n}" transform="rotate(135 114 100)"></circle>
        ${o ? x`<circle class="val" cx="114" cy="100" r=${i} stroke-dasharray="${a * o} ${n}" transform="rotate(135 114 100)"></circle>
          <circle class="thumb" cx=${l} cy=${h} r="12"></circle>` : g}
      </svg>`}
      <div class="mid"><b class=${typeof b == "object" && p ? "range" : ""}>${f}</b><span>${_}</span></div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const s = this._size, i = this._name, n = this._target(e), a = N(e), o = Gi(t, e, this._config, n, !1), c = Gi(t, e, this._config, n, !0), l = j(t);
    let h;
    if (s === "s11")
      h = d`${this._icon(e, 21)}<div class="text"><span class="name">${i}</span><span class="state">${c}</span></div>`;
    else if (s === "s21") {
      const p = fe(e), u = p != null ? ` · ${it(t, p)}° ${l === "es" ? "dentro" : "inside"}` : "";
      h = d`${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${a ? o : c + u}</span></div>`;
    } else if (s === "s22")
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${o}</span></div></div>
        <div class="row">${this._modeBtn(e)}${this._stepper(e)}${this._fanBtn(e)}</div>`;
    else {
      const p = sa(t, e), u = a ? l === "es" ? "Apagado" : "Off" : [Vs(l, e.state), p].filter(Boolean).join(" · ");
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${u}</span></div></div>
        ${this._dial(e)}
        <div class="bottom">${this._modeBtn(e) === g ? d`<span></span>` : this._modeBtn(e)}${this._fanBtn(e)}</div>`;
    }
    return d`<div
      class="card ${s} ${a ? "off" : "on"} ${jt(e) ? "unavailable" : ""}"
      style=${ea(e)}
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
St.styles = z`
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
De([
  v({ attribute: !1 })
], St.prototype, "hass", 2);
De([
  y()
], St.prototype, "_config", 2);
De([
  y()
], St.prototype, "_size", 2);
De([
  y()
], St.prototype, "_tick", 2);
St = De([
  E(Cl)
], St);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $a = { CHILD: 2 }, ka = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Sa = class {
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
class ei extends Sa {
  constructor(e) {
    if (super(e), this.it = g, e.type !== $a.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === g || e == null) return this._t = void 0, this.it = e;
    if (e === nt) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const s = [e];
    return s.raw = s, this._t = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
}
ei.directiveName = "unsafeHTML", ei.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let si = class extends ei {
};
si.directiveName = "unsafeSVG", si.resultType = 2;
const Al = ka(si), zl = (t, e) => `<svg width="${t}" height="${t}" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Es = (t = 24, e = 24, s = 9) => `<circle cx="${t}" cy="${e}" r="${s}" fill="#FFD25A"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((i) => {
  const n = i * Math.PI / 180, a = (o) => `${(t + Math.cos(n) * o).toFixed(1)} ${(e + Math.sin(n) * o).toFixed(1)}`;
  return `<path d="M${a(s + 4)}L${a(s + 8)}" stroke="#FFD25A" stroke-width="3"/>`;
}).join(""), Ts = (t = 24, e = 22) => `<path d="M${t + 10} ${e + 6}A12 12 0 1 1 ${t - 2} ${e - 11}a9.5 9.5 0 0 0 12 17z" fill="#F4E9B8"/>`, R = (t = 0, e = "#fff") => `<path d="M14 ${36 + t}h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 7.5 7.5 0 0 0-1 18z" fill="${e}"/>`, Re = (t = "#7fc8ff", e = [14, 23, 32]) => e.map((s) => `<path d="M${s} 40l-2 5" stroke="${t}" stroke-width="3"/>`).join(""), en = (t = [14, 24, 34]) => t.map((e) => `<circle cx="${e}" cy="42" r="2.2" fill="#fff"/>`).join(""), sn = '<path d="M25 30l-5 8h6l-4 8" stroke="#FFD25A" stroke-width="3"/>', El = '<path d="M6 18h24a5 5 0 1 0-5-5M6 26h32a5 5 0 1 1-5 5M6 34h16" stroke="#dfe7f3" stroke-width="3.2"/>';
function Tl(t, e) {
  switch (t) {
    case "sunny":
      return e ? Ts() : Es();
    case "clear-night":
      return Ts();
    case "partlycloudy":
      return (e ? Ts(20, 15) : Es(18, 17, 7)) + R(2);
    case "cloudy":
      return R(-6, "#cfd8e6") + R(0);
    case "rainy":
      return R(-6) + Re();
    case "pouring":
      return R(-6, "#b9c4d6") + Re("#5fb4ff", [12, 18, 24, 30, 36]);
    case "lightning":
      return R(-6, "#b9c4d6") + sn;
    case "lightning-rainy":
      return R(-6, "#b9c4d6") + sn + Re("#7fc8ff", [14, 34]);
    case "snowy":
      return R(-6) + en();
    case "snowy-rainy":
      return R(-6) + en([14, 34]) + Re("#7fc8ff", [24]);
    case "hail":
      return R(-6, "#b9c4d6") + [14, 24, 34].map((s) => `<circle cx="${s}" cy="42" r="2.6" fill="#dfe9ff" stroke="#9fb7e0" stroke-width="1"/>`).join("");
    case "fog":
      return R(-8, "#cfd8e6") + '<path d="M10 36h28M14 42h22" stroke="#cfd8e6" stroke-width="3"/>';
    case "windy":
      return El;
    case "windy-variant":
      return R(-8, "#cfd8e6") + '<path d="M8 38h22a4 4 0 1 0-4-4M8 44h14" stroke="#dfe7f3" stroke-width="3"/>';
    default:
      return Es(24, 24, 7) + R(4, "#cfd8e6");
  }
}
const V = (t, e = 32, s = !1) => Al(zl(e, Tl(t, s))), nn = {
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
}, an = {
  sunny: "linear-gradient(180deg,#0e1739,#283a6e)",
  "clear-night": "linear-gradient(180deg,#0e1739,#283a6e)",
  partlycloudy: "linear-gradient(180deg,#141d40,#36477a)",
  cloudy: "linear-gradient(180deg,#232a3b,#454f65)",
  rainy: "linear-gradient(180deg,#1b2233,#394459)",
  pouring: "linear-gradient(180deg,#151b29,#2f394c)",
  snowy: "linear-gradient(180deg,#2a3550,#56688a)",
  fog: "linear-gradient(180deg,#2c3340,#525b6a)"
};
function Ca(t, e) {
  return e ? an[t] ?? an.cloudy : nn[t] ?? nn.partlycloudy;
}
const Ma = (t) => ["rainy", "pouring", "lightning-rainy", "snowy-rainy", "hail"].includes(t), Aa = (t) => t === "snowy" || t === "snowy-rainy", on = { DAILY: 1, HOURLY: 2 }, ls = (t, e) => (Number(t.attributes.supported_features ?? 0) & (e === "daily" ? on.DAILY : on.HOURLY)) !== 0, Ds = /* @__PURE__ */ new Map();
function cs(t, e, s, i) {
  const n = `${e}|${s}`;
  let a = Ds.get(n);
  if (!a) {
    a = { listeners: /* @__PURE__ */ new Set() }, Ds.set(n, a);
    const c = a;
    c.unsub = t.connection.subscribeMessage(
      (l) => {
        c.data = l.forecast ?? [];
        for (const h of c.listeners) h(c.data);
      },
      { type: "weather/subscribe_forecast", forecast_type: s, entity_id: e }
    ).catch(() => {
      c.data = [];
      for (const l of c.listeners) l([]);
      return async () => {
      };
    });
  }
  a.listeners.add(i), a.data && i(a.data);
  const o = a;
  return () => {
    o.listeners.delete(i), o.listeners.size || (Ds.delete(n), o.unsub?.then((c) => c()).catch(() => {
    }));
  };
}
function za(t, e) {
  if (e.state === "clear-night") return !0;
  const s = t.states["sun.sun"];
  if (s) return s.state === "below_horizon";
  const i = (/* @__PURE__ */ new Date()).getHours();
  return i < 7 || i >= 21;
}
const C = (t) => t == null || t === "" || Number.isNaN(Number(t)) ? null : Number(t), Dl = (t) => String(t.attributes.wind_speed_unit ?? "km/h"), Ol = (t) => String(t.attributes.pressure_unit ?? "hPa"), rn = (t) => String(t.attributes.precipitation_unit ?? "mm");
function Ea(t) {
  const e = t?.[0];
  return { hi: C(e?.temperature), lo: C(e?.templow) };
}
function jl(t, e) {
  if (t?.length) {
    const s = (/* @__PURE__ */ new Date()).toDateString(), i = t.filter((n) => new Date(n.datetime).toDateString() === s).map((n) => C(n.precipitation) ?? 0);
    if (i.length) return i.reduce((n, a) => n + a, 0);
  }
  return C(e?.[0]?.precipitation);
}
const Pl = {
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
}, Nl = {
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
}, Ta = (t, e) => (t === "es" ? Pl : Nl)[e] ?? e, L = (t, e, s = 0) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Da = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit" }).replace(/\s?h$/, "");
function ii(t, e, s) {
  const i = new Date(e);
  if (i.toDateString() === (/* @__PURE__ */ new Date()).toDateString()) return s;
  const n = i.toLocaleDateString(t?.locale?.language ?? t?.language ?? void 0, { weekday: "short" }).replace(".", "");
  return n.charAt(0).toUpperCase() + n.slice(1);
}
var Ll = Object.defineProperty, Il = Object.getOwnPropertyDescriptor, Zt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Il(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Ll(e, s, n), n;
};
let lt = class extends M {
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
    }}>${Ct(19)}</button>` : g;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this.hass?.states[this.config.entity];
    t && (ls(t, "hourly") && this._unsubs.push(cs(this.hass, t.entity_id, "hourly", (e) => this._hourly = e)), ls(t, "daily") && this._unsubs.push(cs(this.hass, t.entity_id, "daily", (e) => this._daily = e)));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this._unsubs) t();
    this._unsubs = [];
  }
  renderContent() {
    const t = this.hass, e = t.states[this.config.entity];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = j(t), i = e.state, n = za(t, e), a = C(e.attributes.temperature), { hi: o, lo: c } = Ea(this._daily), l = (O) => O != null ? `${L(t, Math.round(O))}°` : "–", h = this.config.animate !== !1, p = this.config.show_details !== !1, u = C(e.attributes.humidity), m = C(e.attributes.wind_speed), b = C(e.attributes.wind_bearing), f = C(e.attributes.pressure), _ = C(e.attributes.cloud_coverage), $ = C(e.attributes.dew_point), w = jl(this._hourly, this._daily), D = [];
    u != null && D.push([r(t, "humidity"), `${L(t, u)} %`]), m != null && D.push([r(t, "wind"), d`${b != null ? d`<span class="arrow" style="transform:rotate(${b + 180}deg)">↑</span>` : g}${L(t, m)} ${Dl(e)}`]), f != null && D.push([r(t, "pressure"), `${L(t, f)} ${Ol(e)}`]), _ != null && D.push([r(t, "clouds"), `${L(t, _)} %`]), $ != null && D.push([r(t, "dew_point"), `${L(t, $, 1)}°`]), w != null && D.push([r(t, "rain_today"), `${L(t, w, 1)} ${rn(e)}`]);
    const ht = (this._daily ?? []).slice(0, this.config.forecast_days ?? 7), At = Math.min(...ht.map((O) => C(O.templow) ?? C(O.temperature) ?? 0)), ja = Math.max(...ht.map((O) => C(O.temperature) ?? 0)), Ai = Math.max(1, ja - At), Pa = r(t, "today");
    return d`
      <div class="hero" style="background:${Ca(i, n)}">
        ${h && Ma(i) ? d`<span class="rainfx"></span>` : h && Aa(i) ? d`<span class="snowfx"></span>` : g}
        ${V(i, 64, n)}
        <div class="htxt">
          <span class="temp">${l(a)}</span>
          <strong>${Ta(s, i)}</strong>
          <span>${r(t, "max_short")} ${l(o)} · ${r(t, "min_short")} ${l(c)}</span>
        </div>
      </div>
      <div class="scroll">
        ${p && D.length ? d`<div class="tiles">${D.map(([O, Z]) => d`<div class="tile"><small>${O}</small><b>${Z}</b></div>`)}</div>` : g}
        ${this._hourly?.length ? d`<section>
              <h3>${r(t, "next_hours")}</h3>
              <div class="list"><div class="hscroll">
                ${this._hourly.slice(0, 24).map((O, Z) => {
      const zt = C(O.precipitation);
      return d`<div class="hour">
                    <span class="h">${Z === 0 ? r(t, "now") : Da(t, O.datetime)}</span>
                    ${V(O.condition ?? "", 26, O.is_daytime === !1)}
                    <span class="t">${l(C(O.temperature))}</span>
                    <span class="p">${zt ? `${L(t, zt, 1)} ${rn(e)}` : ""}</span>
                  </div>`;
    })}
              </div></div>
            </section>` : g}
        ${ht.length ? d`<section>
              <h3>${r(t, "next_days")}</h3>
              <div class="list days">
                ${ht.map((O) => {
      const Z = C(O.templow), zt = C(O.temperature);
      return d`<div class="day">
                    <span>${ii(t, O.datetime, Pa)}</span>${V(O.condition ?? "", 24)}
                    <span class="lo">${Z != null ? l(Z) : ""}</span>
                    <span class="bar"><i style="left:${Z != null ? (Z - At) / Ai * 100 : 0}%;right:${zt != null ? 100 - (zt - At) / Ai * 100 : 0}%"></i></span>
                    <span>${l(zt)}</span>
                  </div>`;
    })}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
lt.styles = [
  M.styles,
  z`
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
Zt([
  v({ attribute: !1 })
], lt.prototype, "config", 2);
Zt([
  v()
], lt.prototype, "name", 2);
Zt([
  v({ attribute: !1 })
], lt.prototype, "onSettings", 2);
Zt([
  y()
], lt.prototype, "_hourly", 2);
Zt([
  y()
], lt.prototype, "_daily", 2);
lt = Zt([
  E("terral-weather-dialog")
], lt);
function Rl(t, e, s, i) {
  document.querySelector("terral-weather-dialog")?.remove();
  const n = document.createElement("terral-weather-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Hl(t) {
  for (const e of document.querySelectorAll("terral-weather-dialog")) e.hass = t;
}
var Wl = Object.defineProperty, Ul = Object.getOwnPropertyDescriptor, Jt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ul(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Wl(e, s, n), n;
};
const Bl = "terral-home-weather";
let ct = class extends P {
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
    t.has("hass") && Hl(this.hass);
    const e = this._entity;
    !e || !this.isConnected || this._subFor !== e.entity_id && (this._unsubscribe(), this._subFor = e.entity_id, ls(e, "daily") && this._unsubs.push(cs(this.hass, e.entity_id, "daily", (s) => this._daily = s)), ls(e, "hourly") && this._size !== "s11" && this._unsubs.push(cs(this.hass, e.entity_id, "hourly", (s) => this._hourly = s)));
  }
  // ---- Interaction ----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || Rl(this.hass, this._config, this._name, () => this.hass && this._config && Xt(this, this.hass, "weather", this._config));
  }
  // ---- Render ---------------------------------------------------------------------
  _hoursRow(t) {
    const e = this.hass, s = this._config?.forecast_2x2 === "daily" && this._size === "s22", i = s ? this._daily : this._hourly ?? this._daily;
    if (!i?.length) return d`<div class="hours empty"></div>`;
    const n = s || !this._hourly, a = r(e, "today");
    return d`<div class="hours">
      ${i.slice(0, 6).map((o, c) => {
      const l = n ? ii(e, o.datetime, a) : c === 0 ? r(e, "now") : Da(e, o.datetime), h = !n && o.is_daytime === !1 ? !0 : !n && c === 0 ? t : !1, p = C(o.temperature);
      return d`<div class="hour"><span class="h">${l}</span>${V(o.condition ?? "", 22, h)}<span class="t">${p != null ? `${L(e, p)}°` : "–"}</span></div>`;
    })}
    </div>`;
  }
  _daysList(t) {
    const e = this.hass, s = this._daily?.slice(0, t) ?? [];
    if (!s.length) return g;
    const i = this._daily.slice(0, 7), n = Math.min(...i.map((l) => C(l.templow) ?? C(l.temperature) ?? 0)), a = Math.max(...i.map((l) => C(l.temperature) ?? 0)), o = Math.max(1, a - n), c = r(e, "today");
    return d`<div class="days">
      ${s.map((l) => {
      const h = C(l.templow), p = C(l.temperature), u = h != null ? (h - n) / o * 100 : 0, m = p != null ? 100 - (p - n) / o * 100 : 0;
      return d`<div class="day">
          <span>${ii(e, l.datetime, c)}</span>${V(l.condition ?? "", 22)}
          <span class="lo">${h != null ? `${L(e, h)}°` : ""}</span>
          <span class="bar"><i style="left:${u}%;right:${m}%"></i></span>
          <span>${p != null ? `${L(e, p)}°` : ""}</span>
        </div>`;
    })}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = j(t), i = e.state, n = za(t, e), a = C(e.attributes.temperature), o = a != null ? `${L(t, Math.round(a))}°` : "–", { hi: c, lo: l } = Ea(this._daily), h = c != null || l != null ? `${r(t, "max_short")} ${c != null ? `${L(t, Math.round(c))}°` : "–"} · ${r(t, "min_short")} ${l != null ? `${L(t, Math.round(l))}°` : "–"}` : "", p = e.state === "unavailable" ? r(t, "unavailable") : Ta(s, i), u = this._name, m = this._config.animate !== !1, b = m && Ma(i) ? d`<span class="rainfx"></span>` : m && Aa(i) ? d`<span class="snowfx"></span>` : g, f = this._size;
    let _;
    if (f === "s11")
      _ = d`${V(i, 34, n)}<div class="text"><span class="name">${o} · ${u}</span><span class="state">${p}</span></div>`;
    else if (f === "s21")
      _ = d`${b}<div class="top"><span class="temp">${o}</span>${V(i, 40, n)}</div>
        <div class="text"><span class="name">${u}</span><span class="state">${p}</span>${h ? d`<span class="hl">${h}</span>` : g}</div>`;
    else {
      const $ = f === "s42";
      _ = d`${b}
        <div class="top">
          <div class="text"><span class="name">${u}</span><span class="temp ${$ ? "xl" : "md"}">${o}</span></div>
          <div class="right">${V(i, $ ? 34 : 30, n)}<span class="cond">${p}</span>${h ? d`<span class="hl">${h}</span>` : g}</div>
        </div>
        ${this._hoursRow(n)}
        ${$ ? d`<div class="sep"></div>${this._daysList(3)}` : g}`;
    }
    return d`<div
      class="card ${f}"
      style="background:${Ca(i, n)}"
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
ct.styles = z`
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
Jt([
  v({ attribute: !1 })
], ct.prototype, "hass", 2);
Jt([
  y()
], ct.prototype, "_config", 2);
Jt([
  y()
], ct.prototype, "_size", 2);
Jt([
  y()
], ct.prototype, "_hourly", 2);
Jt([
  y()
], ct.prototype, "_daily", 2);
ct = Jt([
  E(Bl)
], ct);
var Fl = Object.defineProperty, ql = Object.getOwnPropertyDescriptor, te = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ql(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Fl(e, s, n), n;
};
const Yl = { vacuum: "vac_mode_vacuum", mop: "vac_mode_mop", both: "vac_mode_both" }, ln = /* @__PURE__ */ new Set(["off"]);
let dt = class extends M {
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
    }}>${Ct(19)}</button>` : g;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  get _p() {
    return this._parts || (this._parts = na(this.hass, this.config.entity)), this._parts;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this._e;
    t && yr(this.hass, t, this._p).then((e) => this._rooms = e);
  }
  _toggleRoom(t) {
    const e = new Set(this._picked);
    e.has(t) ? e.delete(t) : e.add(t), this._picked = e;
  }
  _start(t) {
    yt(t) !== "paused" && this._picked.size ? xr(this.hass, t, [...this._picked]) : le(this.hass, t);
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
    const s = this._p, i = yt(e), n = i === "unavailable", a = i === "cleaning" || i === "returning", o = mr(t, e, s), c = xi(e).filter((w) => !ln.has(w)), l = ts(t, s.mopIntensity).filter((w) => !ln.has(w)), h = ts(t, s.mopMode), p = o.current !== "vacuum" || !o.modes.length, u = o.current !== "mop", m = ha(t, e, s, !0, 15), b = aa(t, e, s), f = ua(t, s), _ = ca(t, this.config), $ = (w) => d`<em>${r(t, w)}</em>`;
    return d`
      <div class="status ${vi(i) ? "on" : ""}" style=${da(i)}>
        <span class="icon">${ye(30)}${i === "error" ? d`<span class="err">${En(14)}</span>` : g}</span>
        <div class="txt">
          <strong>${Ye(t, e, s)}</strong>
          <span>${m ? d`<b class="bat" style="color:${m.color}">${m.icon}${m.text}</b>` : g}${f && (a || i === "paused") ? d` · ${f}` : g}</span>
        </div>
      </div>
      ${i === "error" && b ? d`<p class="alert">${pa(t, b)}</p>` : g}
      <div class="scroll">
        ${o.modes.length ? d`<section>
              <h3>${r(t, "vac_what")}</h3>
              ${this._seg(o.modes, o.current, (w) => r(t, Yl[w]), (w) => _r(t, e, s, w), n)}
            </section>` : g}
        ${c.length && et(e, "FAN") ? d`<section class=${u ? "" : "dim"}>
              <h3>${r(t, "vac_power")}${u ? g : $("vac_power_off")}</h3>
              ${this._seg(c, e.attributes.fan_speed, (w) => ks(t, w), (w) => br(t, e, w), n || !u)}
            </section>` : g}
        ${l.length ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_water")}${p ? g : $("vac_only_mop")}</h3>
              ${this._seg(l, t.states[s.mopIntensity]?.state, (w) => ks(t, w), (w) => Ki(t, s.mopIntensity, w), n || !p)}
            </section>` : g}
        ${h.length ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_mop_mode")}${p ? g : $("vac_only_mop")}</h3>
              ${this._seg(h, t.states[s.mopMode]?.state, (w) => ks(t, w), (w) => Ki(t, s.mopMode, w), n || !p)}
            </section>` : g}
        ${this._rooms.length ? d`<section class=${a || i === "paused" ? "dim" : ""}>
              <h3>${r(t, "vac_where")}${a || i === "paused" ? $("vac_rooms_next") : g}</h3>
              <div class="chips">
                <button class=${this._picked.size ? "" : "sel"} ?disabled=${a} @click=${() => this._picked = /* @__PURE__ */ new Set()}>${r(t, "vac_whole_home")}</button>
                ${this._rooms.map((w) => d`<button class=${this._picked.has(w.id) ? "sel" : ""} ?disabled=${a} @click=${() => this._toggleRoom(w.id)}>${w.name}</button>`)}
              </div>
            </section>` : g}
        <div class="actions">
          <button class="go" ?disabled=${n || i === "cleaning"} @click=${() => this._start(e)}>
            ${Be(18)}${r(t, i === "paused" ? "vac_resume" : this._picked.size ? "vac_start_rooms" : "vac_start_clean", { n: this._picked.size })}
          </button>
          ${et(e, "PAUSE") ? d`<button class="rb" aria-label=${r(t, "vac_pause")} ?disabled=${!a} @click=${() => Xs(t, e)}>${An(18)}</button>` : g}
          ${et(e, "RETURN") ? d`<button class="rb" aria-label=${r(t, "vac_to_base")} ?disabled=${n || i === "docked" || i === "returning"} @click=${() => Ks(t, e)}>${Ke(19)}</button>` : g}
          ${et(e, "LOCATE") ? d`<button class="rb" aria-label=${r(t, "vac_locate")} ?disabled=${n} @click=${() => la(t, e)}>${zn(19)}</button>` : g}
        </div>
        ${i === "docked" ? d`<p class="note">${r(t, "vac_docked_note")}</p>` : i === "cleaning" ? d`<p class="note">${r(t, "vac_cleaning_note")}</p>` : g}
        ${_.length ? d`<section>
              <h3>${r(t, "vac_routines")}</h3>
              <div class="chips">
                ${_.map((w) => {
      const D = es(t, w, this.name);
      return d`<button ?disabled=${n || i === "cleaning"} @click=${() => Qs(t, w)}>${ss(D, 16)}${D}</button>`;
    })}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
dt.styles = [
  M.styles,
  z`
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
te([
  v({ attribute: !1 })
], dt.prototype, "config", 2);
te([
  v()
], dt.prototype, "name", 2);
te([
  v({ attribute: !1 })
], dt.prototype, "onSettings", 2);
te([
  y()
], dt.prototype, "_rooms", 2);
te([
  y()
], dt.prototype, "_picked", 2);
dt = te([
  E("terral-vacuum-dialog")
], dt);
function Vl(t, e, s, i) {
  document.querySelector("terral-vacuum-dialog")?.remove();
  const n = document.createElement("terral-vacuum-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Gl(t) {
  for (const e of document.querySelectorAll("terral-vacuum-dialog")) e.hass = t;
}
var Xl = Object.defineProperty, Kl = Object.getOwnPropertyDescriptor, ys = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Kl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Xl(e, s, n), n;
};
const Ql = "terral-home-vacuum";
let Ft = class extends P {
  constructor() {
    super(...arguments), this._size = "s22", this._held = !1, this._iconTap = (t) => {
      t.stopPropagation();
      const e = this._entity, s = this.hass;
      if (!e || !s) return;
      const i = yt(e);
      i === "cleaning" || i === "returning" ? Xs(s, e) : i === "paused" ? le(s, e) : i === "docked" || i === "idle" ? this._routinesMenu(t.currentTarget) : this._openWindow();
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
    return !this._parts && this.hass && this._config && (this._parts = na(this.hass, this._config.entity)), this._parts ?? {};
  }
  get _name() {
    return this._config?.name || this._entity?.attributes.friendly_name || r(this.hass, "type_vacuum");
  }
  /** Redraw only when the robot or one of its own sensors changed. */
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || !this.hass ? !0 : [this._config.entity, ...Object.values(this._p), ...Qi(this.hass, this._config)].filter(Boolean).some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (t.has("hass") && this.hass) {
      Gl(this.hass);
      const e = this._entity;
      e && fr(this.hass, e, this._p);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  // ---- Actions -----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || Vl(this.hass, this._config, this._name, () => this.hass && this._config && Xt(this, this.hass, "vacuum", this._config));
  }
  _routinesMenu(t) {
    const e = this.hass, s = ca(e, this._config);
    if (!s.length) return this._openWindow();
    ti(t, s.map((i) => {
      const n = es(e, i, this._name);
      return { label: n, icon: ss(n, 21), run: () => Qs(e, i) };
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
      ${ye(s)}
      ${e === "error" ? d`<span class="err">${En(this._size === "s11" ? 11 : 14)}</span>` : g}
    </button>`;
  }
  _battery(t, e) {
    const s = ha(this.hass, t, this._p, e);
    return s ? d`<span class="bat" style="color:${s.color}" aria-label=${`${r(this.hass, "battery")} ${s.pct} %`}>${s.icon}${s.text}</span>` : g;
  }
  _bottom22(t, e) {
    const s = this.hass, i = this._config;
    if (e === "docked" || e === "idle" || e === "unavailable") {
      const o = Qi(s, i);
      return o.length ? d`<div class="pills" style="grid-template-columns:repeat(${o.length},minmax(0,1fr))">
        ${o.map((c) => {
        const l = es(s, c, this._name);
        return d`<button class="pb" ?disabled=${e === "unavailable"} @click=${(h) => {
          h.stopPropagation(), Qs(s, c);
        }}>${ss(l, 16)}<span>${l}</span></button>`;
      })}
      </div>` : d`<div class="pills one"><button class="pb" ?disabled=${e === "unavailable"} @click=${this._act(le)}>${Be(16)}${r(s, "vac_start")}</button></div>`;
    }
    if (e === "error")
      return d`<div class="row">
        <button class="pb grow" @click=${this._act(le)}>${Be(16)}<span>${r(s, "vac_resume")}</span></button>
        ${et(t, "RETURN") ? d`<button class="pb grow" @click=${this._act(Ks)}>${Ke(17)}<span>${r(s, "vac_to_base")}</span></button>` : g}
        ${et(t, "LOCATE") ? d`<button class="rb" aria-label=${r(s, "vac_locate")} @click=${this._act(la)}>${zn(19)}</button>` : g}
      </div>`;
    const n = bi(s, this._p), a = ua(s, this._p);
    return d`<div class="row">
      <div class="info">
        ${n != null && e !== "returning" ? d`<div class="track"><i style="width:${n}%"></i></div>` : g}
        <span class="facts">${a || Ye(s, t, this._p)}</span>
      </div>
      ${e === "paused" ? d`<button class="rb on" aria-label=${r(s, "vac_resume")} @click=${this._act(le)}>${Be(18)}</button>` : et(t, "PAUSE") ? d`<button class="rb on" aria-label=${r(s, "vac_pause")} @click=${this._act(Xs)}>${An(18)}</button>` : g}
      ${et(t, "RETURN") ? d`<button class="rb" aria-label=${r(s, "vac_to_base")} ?disabled=${e === "returning"} @click=${this._act(Ks)}>${Ke(19)}</button>` : g}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = yt(e), i = this._size, n = this._name, a = Ye(t, e, this._p);
    let o;
    return i === "s11" ? o = d`${this._icon(e, s, 22)}<div class="text"><span class="name">${n}</span>
        <span class="state line"><span class="grow">${Ye(t, e, this._p, !0)}</span>${this._battery(e, !1)}</span></div>` : i === "s21" ? o = d`${this._icon(e, s, 32)}<div class="text"><span class="name">${n}</span><span class="state">${a}</span>
        <span class="state">${this._battery(e, !0)}</span></div>` : o = d`<div class="head">${this._icon(e, s, 32)}<div class="text"><span class="name">${n}</span><span class="state">${a}</span></div>
          <span class="top">${this._battery(e, !0)}</span></div>
        ${this._bottom22(e, s)}`, d`<div
      class="card ${i} ${vi(s) ? "on" : "off"} ${s === "unavailable" ? "unavailable" : ""}"
      style=${da(s)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${n}, ${a}`}
      @click=${this._cardClick}
      @keydown=${(c) => {
      (c.key === "Enter" || c.key === " ") && c.target === c.currentTarget && (c.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(c) => c.preventDefault()}
    >${o}</div>`;
  }
};
Ft.styles = z`
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
ys([
  v({ attribute: !1 })
], Ft.prototype, "hass", 2);
ys([
  y()
], Ft.prototype, "_config", 2);
ys([
  y()
], Ft.prototype, "_size", 2);
Ft = ys([
  E(Ql)
], Ft);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Zl } = to, cn = (t) => t, dn = () => document.createComment(""), ae = (t, e, s) => {
  const i = t._$AA.parentNode, n = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const a = i.insertBefore(dn(), n), o = i.insertBefore(dn(), n);
    s = new Zl(a, o, t, t.options);
  } else {
    const a = s._$AB.nextSibling, o = s._$AM, c = o !== t;
    if (c) {
      let l;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (l = t._$AU) !== o._$AU && s._$AP(l);
    }
    if (a !== n || c) {
      let l = s._$AA;
      for (; l !== a; ) {
        const h = cn(l).nextSibling;
        cn(i).insertBefore(l, n), l = h;
      }
    }
  }
  return s;
}, ut = (t, e, s = t) => (t._$AI(e, s), t), Jl = {}, tc = (t, e = Jl) => t._$AH = e, ec = (t) => t._$AH, Os = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hn = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= s; n++) i.set(t[n], n);
  return i;
}, pn = ka(class extends Sa {
  constructor(t) {
    if (super(t), t.type !== $a.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const n = [], a = [];
    let o = 0;
    for (const c of t) n[o] = i ? i(c, o) : o, a[o] = s(c, o), o++;
    return { values: a, keys: n };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const n = ec(t), { values: a, keys: o } = this.dt(e, s, i);
    if (!Array.isArray(n)) return this.ut = o, a;
    const c = this.ut ??= [], l = [];
    let h, p, u = 0, m = n.length - 1, b = 0, f = a.length - 1;
    for (; u <= m && b <= f; ) if (n[u] === null) u++;
    else if (n[m] === null) m--;
    else if (c[u] === o[b]) l[b] = ut(n[u], a[b]), u++, b++;
    else if (c[m] === o[f]) l[f] = ut(n[m], a[f]), m--, f--;
    else if (c[u] === o[f]) l[f] = ut(n[u], a[f]), ae(t, l[f + 1], n[u]), u++, f--;
    else if (c[m] === o[b]) l[b] = ut(n[m], a[b]), ae(t, n[u], n[m]), m--, b++;
    else if (h === void 0 && (h = hn(o, b, f), p = hn(c, u, m)), h.has(c[u])) if (h.has(c[m])) {
      const _ = p.get(o[b]), $ = _ !== void 0 ? n[_] : null;
      if ($ === null) {
        const w = ae(t, n[u]);
        ut(w, a[b]), l[b] = w;
      } else l[b] = ut($, a[b]), ae(t, n[u], $), n[_] = null;
      b++;
    } else Os(n[m]), m--;
    else Os(n[u]), u++;
    for (; b <= f; ) {
      const _ = ae(t, l[f + 1]);
      ut(_, a[b]), l[b++] = _;
    }
    for (; u <= m; ) {
      const _ = n[u++];
      _ !== null && Os(_);
    }
    return this.ut = o, tc(t, l), nt;
  }
});
function sc(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const ic = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function nc(t) {
  return ic[t];
}
var ac = Object.defineProperty, oc = Object.getOwnPropertyDescriptor, Si = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? oc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ac(e, s, n), n;
};
const rc = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>`, lc = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M5 4v12M19 4v12M5 8h14M5 12h14M5 16h14M12 16v4"></path></svg>`, cc = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"></path><path d="M12 18l4-6"></path></svg>`, dc = [
  { type: "light", name: "type_light", desc: "type_light_desc", icon: () => G(!0, 20), color: "#ffb020" },
  { type: "alarm", name: "type_alarm", desc: "type_alarm_desc", icon: () => us(20), color: "rgba(255,255,255,.18)" },
  { type: "charger", name: "ev_charger", desc: "type_charger_desc", icon: () => gs(20), color: "#34c77b" },
  { type: "climate", name: "type_climate", desc: "type_climate_desc", icon: () => rc(), color: "#4696ff" },
  { type: "weather", name: "type_weather", desc: "type_weather_desc", icon: () => V("partlycloudy", 26), color: "linear-gradient(180deg,#3a8ee6,#7cc0f5)" },
  { type: "vacuum", name: "type_vacuum", desc: "type_vacuum_desc", icon: () => ye(21), color: "#22a587" }
], hc = [
  { name: "type_cover", icon: () => lc() },
  { name: "type_sensor", icon: () => cc() }
];
let Ae = class extends M {
  constructor() {
    super(...arguments), this._q = "";
  }
  get heading() {
    return r(this.hass, "add_card");
  }
  renderContent() {
    const t = this._q.trim().toLowerCase(), e = (a, o) => !t || r(this.hass, a).toLowerCase().includes(t) || o && r(this.hass, o).toLowerCase().includes(t), s = dc.filter((a) => e(a.name, a.desc)), i = (a) => a === "alarm" && !Object.keys(this.hass.states).some((o) => o.startsWith("alarm_control_panel.")) ? "alarm_missing" : a === "climate" && !Object.keys(this.hass.states).some((o) => o.startsWith("climate.")) ? "climate_missing" : a === "weather" && !Object.keys(this.hass.states).some((o) => o.startsWith("weather.")) ? "weather_missing" : a === "vacuum" && !Object.keys(this.hass.states).some((o) => o.startsWith("vacuum.")) ? "vacuum_missing" : void 0, n = hc.filter((a) => e(a.name));
    return d`
      <label class="search">
        ${Sn()}
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
                    ${o ? g : d`<span class="chev">${Xe(!1, 16)}</span>`}
                  </button>`;
    })}
              </div>
            </section>` : g}
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
            </section>` : g}
      </div>
    `;
  }
};
Ae.styles = [
  M.styles,
  z`
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
Si([
  v({ attribute: !1 })
], Ae.prototype, "onType", 2);
Si([
  y()
], Ae.prototype, "_q", 2);
Ae = Si([
  E("terral-add-sheet")
], Ae);
function pc(t, e) {
  const s = document.createElement("terral-add-sheet");
  return s.hass = t, s.onType = e, document.body.appendChild(s), s;
}
var uc = Object.defineProperty, gc = Object.getOwnPropertyDescriptor, Ci = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? gc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && uc(e, s, n), n;
};
let ze = class extends M {
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
          <span class="ic">${uo()}</span><span class="nm">${r(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${mo()}</span>
          <span class="nm">${r(this.hass, "by_rooms")}<small>${r(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" disabled>
          <span class="ic">${Ct()}</span>
          <span class="nm">${r(this.hass, "terral_settings")}<small>${r(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
ze.styles = [
  M.styles,
  z`
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
Ci([
  v({ attribute: !1 })
], ze.prototype, "actions", 2);
Ci([
  v()
], ze.prototype, "version", 2);
ze = Ci([
  E("terral-menu-sheet")
], ze);
function fc(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const Oa = "0.11.0";
var mc = Object.defineProperty, _c = Object.getOwnPropertyDescriptor, T = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? _c(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && mc(e, s, n), n;
};
const oe = "top", un = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], bc = 0.85, J = 2, xc = 160, yc = 184, vc = 10, re = 22, gn = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate",
  weather: "terral-home-weather",
  vacuum: "terral-home-vacuum"
}, wc = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing", "forecast_2x2", "animate", "show_details", "forecast_days", "routines"], qt = "#3a4f80", He = "58,79,128", $c = `linear-gradient(180deg, ${qt} 0, rgba(${He},.6) 36px, rgba(${He},0) 120px), linear-gradient(0deg, ${qt} 0, rgba(${He},.6) 28px, rgba(${He},0) 96px), `, js = qt, kc = qt, Ps = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let S = class extends P {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._lanes = 1, this._laneW = 358, this._pad = 16, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || pc(this.hass, (t) => {
        ga(this.hass, Or(t), {
          mode: "add",
          onBack: () => this._add(),
          onSave: (e) => {
            const s = { id: Ps(), type: e.type, ...e.config, w: e.w, h: e.h };
            this._update((i) => i.cards.push(s));
          }
        });
      });
    }, this._menu = () => {
      this.hass && fc(this.hass, this.panel?.config?.version ?? Oa, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms()
      });
    }, this._addSection = () => {
      const t = Ps();
      this._update((e) => e.sections.push({ id: t, title: r(this.hass, "new_section"), cards: [] })), this._renaming = t;
    }, this._onCardConfig = (t) => {
      const e = t.target, s = [...this._els].find(([, a]) => a === e)?.[0];
      if (!s) return;
      t.preventDefault();
      const { config: i, size: n } = t.detail;
      this._update((a) => {
        for (const o of [a.cards, ...a.sections.map((c) => c.cards)]) {
          const c = o.find((l) => l.id === s);
          if (c) {
            for (const l of wc)
              i[l] === void 0 || i[l] === "" ? delete c[l] : c[l] = i[l];
            n && (c.w = n.w, c.h = n.h);
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
    if (t.has("hass") && this.hass) {
      !this._layout && !this._loading && this._load();
      for (const e of this._els.values()) e.hass = this.hass;
      jr(this.hass);
    }
    if (t.has("_renaming") && this._renaming) {
      const e = this.renderRoot.querySelector("input.rename");
      e?.focus(), e?.select();
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
      [s, "background", qt],
      [i, "background", qt],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", js],
      [i, "--app-theme-color", js],
      [i, "--primary-background-color", kc]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: n.map(([a, o]) => [a, o, a.style.getPropertyValue(o), a.style.getPropertyPriority(o)])
      };
      for (const [a, o, c] of n) a.style.setProperty(o, c);
      e && (e.content = js), this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [a, o, c, l] of this._chromeSaved.props)
        c ? a.style.setProperty(o, c, l) : a.style.removeProperty(o);
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
  async _load() {
    if (this.hass) {
      this._loading = !0;
      try {
        this._layout = await this.hass.callWS({ type: "terral_home/layout/get" }), this._error = void 0, this._unsub = this.hass.connection.subscribeMessage(
          (t) => {
            !this._pending && !this._drag && !this._resize && (this._layout = t);
          },
          { type: "terral_home/layout/subscribe" }
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
        await this.hass.callWS({ type: "terral_home/layout/save", layout: t }), this._error = void 0;
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
    return e === oe ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: oe, card: e };
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
    const e = t < 600 ? 16 : 24, s = vc, i = t - 2 * e, n = J * xc + (J - 1) * s, a = Math.max(1, Math.floor((i + re) / (n + re))), o = (i - (a - 1) * re) / a, c = Math.min(yc, (o - (J - 1) * s) / J), l = window.__terralRowRatio ?? bc, h = Math.max(48, Math.round((c - s) / 2 * l));
    this._colW = c, this._gap = s;
    const p = Math.round(J * c + (J - 1) * s);
    J !== this._cols && (this._cols = J), h !== this._rowH && (this._rowH = h), a !== this._lanes && (this._lanes = a), p !== this._laneW && (this._laneW = p), e !== this._pad && (this._pad = e);
  }
  /** Rows a list of cards takes in its 2-column grid (same "row dense" packing as CSS). */
  _rowsOf(t) {
    const e = [], s = (n, a, o, c) => {
      for (let l = n; l < n + c; l++) for (let h = a; h < a + o; h++) if (h >= this._cols || e[l]?.[h]) return !1;
      return !0;
    };
    let i = 0;
    for (const n of t) {
      const { w: a, h: o } = this._sizeOf(n);
      for (let c = 0; ; c++) {
        const l = [...Array(this._cols - a + 1).keys()].find((h) => s(c, h, a, o));
        if (l != null) {
          for (let h = c; h < c + o; h++) for (let p = l; p < l + a; p++) (e[h] ??= [])[p] = !0;
          i = Math.max(i, c + o);
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
  _sizeOf(t) {
    const e = t.h === 1 || t.h === 4 ? t.h : 2, s = e === 4 || t.w === 2 ? 2 : 1;
    return { w: Math.min(s, this._cols), h: e };
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t) {
    return (this._els.get(t.id)?.getTerralSizes?.() ?? un).filter((s) => s.w <= this._cols).length > 1;
  }
  _element(t) {
    let e = this._els.get(t.id);
    e || (e = document.createElement(gn[t.type] ?? "terral-home-light"), this._els.set(t.id, e));
    const { id: s, type: i, w: n, h: a, ...o } = t, c = { ...o, type: `custom:${gn[t.type] ?? "terral-home-light"}`, view_layout: { terral: { w: n, h: a } } }, l = JSON.stringify(c);
    if (e.dataset.cfg !== l) {
      try {
        e.setConfig(c);
      } catch (h) {
        console.warn("Terral Home:", h);
      }
      e.dataset.cfg = l;
    }
    return this.hass && e.hass !== this.hass && (e.hass = this.hass), e;
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
      const o = a.sections.findIndex((l) => l.id === t);
      if (o < 0) return;
      const [c] = a.sections.splice(o, 1);
      n ? (o > 0 ? a.sections[o - 1].cards : a.cards).push(...c.cards) : c.cards.forEach((l) => this._els.delete(l.id));
    });
    if (!s.cards.length) return i(!1);
    qs(this.hass, {
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
    this.hass && qs(this.hass, {
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
        for (const c of [...o]) {
          const l = qe(t, c.entity);
          l && (n.push([c, l]), o.splice(o.indexOf(c), 1));
        }
      const a = [...new Set(n.map(([, o]) => o))].filter((o) => !s.has(o.toLowerCase())).sort((o, c) => o.localeCompare(c));
      for (const o of a) {
        const c = { id: Ps(), title: o, cards: [] };
        e.sections.push(c), s.set(o.toLowerCase(), c);
      }
      for (const [o, c] of n) s.get(c.toLowerCase()).cards.push(o);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), n = (this._els.get(e.id)?.getTerralSizes?.() ?? un).filter((o) => o.w <= this._cols);
    this._resizeOrigin = { left: i.left, top: i.top, sizes: n };
    const a = this._sizeOf(e);
    this._resize = { id: e.id, w: a.w, h: a.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let n = e.sizes[0], a = 1 / 0;
    for (const o of e.sizes) {
      const c = (o.w - s) ** 2 + (o.h - i) ** 2;
      c < a && ([n, a] = [o, c]);
    }
    (n.w !== this._resize.w || n.h !== this._resize.h) && (this._resize = { ...this._resize, w: n.w, h: n.h }, navigator.vibrate?.(6));
  }
  _resizeUp() {
    const t = this._resize;
    if (this._resize = void 0, this._resizeOrigin = void 0, !t) return;
    const e = this._findCard(t.id);
    if (!e) return;
    const s = this._sizeOf(e.card);
    s.w === t.w && s.h === t.h || this._update((i) => {
      const n = S._list(i, e.key)?.find((a) => a.id === t.id);
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
    }, o = n.reduce((h, p) => a(p) < a(h) ? p : h), c = [...o.querySelectorAll("section[data-sid]")].filter((h) => h.dataset.sid !== s), l = c.find((h) => {
      const p = h.getBoundingClientRect();
      return p.top + p.height / 2 > e;
    });
    if (l)
      this._dropSection = i.indexOf(l.dataset.sid), this._dropMark = { sid: l.dataset.sid };
    else if (c.length) {
      const h = c[c.length - 1].dataset.sid;
      this._dropSection = i.indexOf(h) + 1, this._dropMark = { sid: h, after: !0 };
    } else
      this._dropSection = i.length, this._dropMark = { lane: n.indexOf(o) };
  }
  _moveCard(t, e, s) {
    const i = this._findCard(t);
    !i || s === t || this._update((n) => {
      const a = S._list(n, i.key), o = a.findIndex((m) => m.id === t), c = s ? a.findIndex((m) => m.id === s) : -1, [l] = a.splice(o, 1), h = S._list(n, e);
      if (!h) {
        a.splice(o, 0, l);
        return;
      }
      if (!s) {
        h.push(l);
        return;
      }
      const p = h.findIndex((m) => m.id === s), u = i.key === e && c > o;
      h.splice(p < 0 ? h.length : p + (u ? 1 : 0), 0, l);
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
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, n = e && !this._allCards.length, a = this._drag?.kind === "card", o = this._drag?.kind === "section", c = s.length > 0 || n || t && (a || !i.length), l = [];
    c && l.push({ item: { kind: "top" }, rows: Math.max(this._rowsOf(s), n || t && !i.length ? 2 : 1), titled: !1 });
    for (const b of i) (t || b.cards.length) && l.push({ item: { kind: "sec", s: b }, rows: this._rowsOf(b.cards), titled: !0 });
    const h = this._assignLanes(l), p = this._dropMark, u = d`<div class="dropline"></div>`, m = this._lanes * this._laneW + (this._lanes - 1) * re;
    return d`
      <div class="scroller" style="background:${$c}${nc("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${t ? "editing" : ""}" style="max-width:${m + 2 * this._pad}px">
          <div class="top">
            <button class="glass round" aria-label=${r(this.hass, "menu")} @click=${() => sc(this, "hass-toggle-menu")}>
              ${po()}
            </button>
            <span class="spacer"></span>
            ${t ? d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} @click=${this._add}>${Oe(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${r(this.hass, "done")}</button>
                </div>` : d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${Oe(22)}</button>
                  <button class="pbtn" aria-label=${r(this.hass, "more_options")} @click=${this._menu}>${go(22)}</button>
                </div>`}
          </div>
          <h1>${r(this.hass, "home_title")}</h1>
          ${this._error ? d`<p class="notice">${r(this.hass, "panel_error")} (${this._error})</p>` : g}
          <div class="lanes" style="--lane-gap:${re}px">
            ${h.map(
      (b, f) => d`<div class="lane" style="width:${this._laneW}px">
                ${pn(
        b,
        (_) => _.kind === "top" ? oe : _.s.id,
        (_) => {
          if (_.kind === "top")
            return d`<div class="topblock">${this._grid(oe, s, t, n || t && !i.length, s.length === 0 && t ? r(this.hass, "no_section") : void 0)}</div>`;
          const $ = _.s, w = o && this._drag?.id === $.id, D = o && !w && p?.sid === $.id;
          return d`${D && !p?.after ? u : g}${this._section($, t, w)}${D && p?.after ? u : g}`;
        }
      )}
                ${o && p?.lane === f ? u : g}
              </div>`
    )}
          </div>
          ${t && e ? d`<button class="addsec" @click=${this._addSection}>${Oe(20)}<span>${r(this.hass, "add_section")}</span></button>` : g}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, n = s ? `translate:${this._dragDx}px ${this._dragDy}px` : "";
    return d`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${n}>
      <header>
        ${e ? d`<button class="sdel" aria-label=${r(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${Hi()}</button>` : g}
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
        ${e ? d`<button
              class="handle"
              aria-label=${r(this.hass, "move_section")}
              @pointerdown=${(a) => this._handleDown(a, t.id)}
            >${fo()}</button>` : g}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? r(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  _grid(t, e, s, i, n) {
    const a = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId;
    return d`<div
      class="grid ${a ? "zone-target" : ""} ${t === oe ? "top-grid" : ""}"
      data-zone=${t}
      style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px;gap:${this._gap}px"
    >
      ${pn(e, (o) => o.id, (o, c) => this._cell(t, o, c, s))}
      ${n && !e.length ? d`<div class="placeholder" style="grid-column:1/-1">${n}</div>` : g}
      ${i ? d`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${Oe(26)}</span><span>${r(this.hass, "add_accessory")}</span>
          </button>` : g}
    </div>`;
  }
  _cell(t, e, s, i) {
    const { w: n, h: a } = this._sizeOf(e), o = this._drag?.kind === "card" && this._drag.id === e.id, c = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, l = `grid-column:span ${n};grid-row:span ${a};--d:${s % 5 * -0.07}s;${o ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return d`<div class="cell ${o ? "dragging" : ""} ${c ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${l}>
      ${this._element(e)}
      ${i ? d`<div class="overlay" @pointerdown=${(h) => this._overlayDown(h, e.id)}>
            <button class="del" aria-label=${r(this.hass, "delete")} @click=${() => this._remove(e.id)}>${Hi()}</button>
            ${this._canResize(e) ? d`<button
              class="corner"
              aria-label=${r(this.hass, "resize")}
              @pointerdown=${(h) => this._resizeDown(h, e)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>` : g}
          </div>` : g}
      ${this._resize?.id === e.id ? d`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>` : g}
    </div>`;
  }
};
S.styles = z`
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
  v({ attribute: !1 })
], S.prototype, "hass", 2);
T([
  v({ type: Boolean })
], S.prototype, "narrow", 2);
T([
  v({ attribute: !1 })
], S.prototype, "route", 2);
T([
  v({ attribute: !1 })
], S.prototype, "panel", 2);
T([
  y()
], S.prototype, "_layout", 2);
T([
  y()
], S.prototype, "_error", 2);
T([
  y()
], S.prototype, "_edit", 2);
T([
  y()
], S.prototype, "_cols", 2);
T([
  y()
], S.prototype, "_rowH", 2);
T([
  y()
], S.prototype, "_drag", 2);
T([
  y()
], S.prototype, "_dropCard", 2);
T([
  y()
], S.prototype, "_dropSection", 2);
T([
  y()
], S.prototype, "_dragDx", 2);
T([
  y()
], S.prototype, "_dragDy", 2);
T([
  y()
], S.prototype, "_resize", 2);
T([
  y()
], S.prototype, "_renaming", 2);
T([
  y()
], S.prototype, "_lanes", 2);
T([
  y()
], S.prototype, "_laneW", 2);
T([
  y()
], S.prototype, "_pad", 2);
T([
  y()
], S.prototype, "_dropMark", 2);
S = T([
  E("terral-home-panel")
], S);
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
  `%c TERRAL HOME %c v${Oa} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  Oa as VERSION
};
