/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis, yt = ot.ShadowRoot && (ot.ShadyCSS === void 0 || ot.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wt = Symbol(), Mt = /* @__PURE__ */ new WeakMap();
let Wt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== wt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (yt && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = Mt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Mt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Qt = (e) => new Wt(typeof e == "string" ? e : e + "", void 0, wt), st = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new Wt(s, e, wt);
}, te = (e, t) => {
  if (yt) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = ot.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, zt = yt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Qt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ee, defineProperty: se, getOwnPropertyDescriptor: ie, getOwnPropertyNames: re, getOwnPropertySymbols: ne, getPrototypeOf: oe } = Object, pt = globalThis, Pt = pt.trustedTypes, ae = Pt ? Pt.emptyScript : "", le = pt.reactiveElementPolyfillSupport, K = (e, t) => e, lt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ae : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, kt = (e, t) => !ee(e, t), Tt = { attribute: !0, type: String, converter: lt, reflect: !1, useDefault: !1, hasChanged: kt };
Symbol.metadata ??= Symbol("metadata"), pt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = Tt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && se(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = ie(this.prototype, t) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: r, set(o) {
      const a = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(K("elementProperties"))) return;
    const t = oe(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(K("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(K("properties"))) {
      const s = this.properties, i = [...re(s), ...ne(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) s.unshift(zt(r));
    } else t !== void 0 && s.push(zt(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return te(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : lt).toAttribute(s, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : lt;
      this._$Em = r;
      const a = o.fromAttribute(s, n.type);
      this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? kt)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? s ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, n] of i) {
        const { wrapped: o } = n, a = this[r];
        o !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, n, a);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[K("elementProperties")] = /* @__PURE__ */ new Map(), N[K("finalized")] = /* @__PURE__ */ new Map(), le?.({ ReactiveElement: N }), (pt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const At = globalThis, Ot = (e) => e, ht = At.trustedTypes, jt = ht ? ht.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Vt = "$lit$", P = `lit$${Math.random().toFixed(9).slice(2)}$`, Yt = "?" + P, he = `<${Yt}>`, D = document, J = () => D.createComment(""), Q = (e) => e === null || typeof e != "object" && typeof e != "function", Et = Array.isArray, ce = (e) => Et(e) || typeof e?.[Symbol.iterator] == "function", ft = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Lt = /-->/g, Dt = />/g, T = RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ht = /'/g, Ut = /"/g, qt = /^(?:script|style|textarea|title)$/i, Ft = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), d = Ft(1), A = Ft(2), R = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), j = D.createTreeWalker(D, 129);
function Xt(e, t) {
  if (!Et(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return jt !== void 0 ? jt.createHTML(t) : t;
}
const de = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = q;
  for (let a = 0; a < s; a++) {
    const l = e[a];
    let p, u, c = -1, b = 0;
    for (; b < l.length && (o.lastIndex = b, u = o.exec(l), u !== null); ) b = o.lastIndex, o === q ? u[1] === "!--" ? o = Lt : u[1] !== void 0 ? o = Dt : u[2] !== void 0 ? (qt.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = T) : u[3] !== void 0 && (o = T) : o === T ? u[0] === ">" ? (o = r ?? q, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? T : u[3] === '"' ? Ut : Ht) : o === Ut || o === Ht ? o = T : o === Lt || o === Dt ? o = q : (o = T, r = void 0);
    const v = o === T && e[a + 1].startsWith("/>") ? " " : "";
    n += o === q ? l + he : c >= 0 ? (i.push(p), l.slice(0, c) + Vt + l.slice(c) + P + v) : l + P + (c === -2 ? a : v);
  }
  return [Xt(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class tt {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, l = this.parts, [p, u] = de(t, s);
    if (this.el = tt.createElement(p, i), j.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = j.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Vt)) {
          const b = u[o++], v = r.getAttribute(c).split(P), U = /([.?@])?(.*)/.exec(b);
          l.push({ type: 1, index: n, name: U[2], strings: v, ctor: U[1] === "." ? ue : U[1] === "?" ? fe : U[1] === "@" ? ge : ut }), r.removeAttribute(c);
        } else c.startsWith(P) && (l.push({ type: 6, index: n }), r.removeAttribute(c));
        if (qt.test(r.tagName)) {
          const c = r.textContent.split(P), b = c.length - 1;
          if (b > 0) {
            r.textContent = ht ? ht.emptyScript : "";
            for (let v = 0; v < b; v++) r.append(c[v], J()), j.nextNode(), l.push({ type: 2, index: ++n });
            r.append(c[b], J());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Yt) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(P, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += P.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = D.createElement("template");
    return i.innerHTML = t, i;
  }
}
function I(e, t, s = e, i) {
  if (t === R) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = Q(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = I(e, r._$AS(e, t.values), r, i)), t;
}
class pe {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? D).importNode(s, !0);
    j.currentNode = r;
    let n = j.nextNode(), o = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let p;
        l.type === 2 ? p = new it(n, n.nextSibling, this, t) : l.type === 1 ? p = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (p = new me(n, this, t)), this._$AV.push(p), l = i[++a];
      }
      o !== l?.index && (n = j.nextNode(), o++);
    }
    return j.currentNode = D, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class it {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = I(this, t, s), Q(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ce(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && Q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(D.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = tt.createElement(Xt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const n = new pe(r, this), o = n.u(this.options);
      n.p(s), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = Nt.get(t.strings);
    return s === void 0 && Nt.set(t.strings, s = new tt(t)), s;
  }
  k(t) {
    Et(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new it(this.O(J()), this.O(J()), this, this.options)) : i = s[r], i._$AI(n), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = Ot(t).nextSibling;
      Ot(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ut {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, n) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = f;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = I(this, t, s, 0), o = !Q(t) || t !== this._$AH && t !== R, o && (this._$AH = t);
    else {
      const a = t;
      let l, p;
      for (t = n[0], l = 0; l < n.length - 1; l++) p = I(this, a[i + l], s, l), p === R && (p = this._$AH[l]), o ||= !Q(p) || p !== this._$AH[l], p === f ? t = f : t !== f && (t += (p ?? "") + n[l + 1]), this._$AH[l] = p;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ue extends ut {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class fe extends ut {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class ge extends ut {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = I(this, t, s, 0) ?? f) === R) return;
    const i = this._$AH, r = t === f && i !== f || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== f && (i === f || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class me {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    I(this, t);
  }
}
const be = At.litHtmlPolyfillSupport;
be?.(tt, it), (At.litHtmlVersions ??= []).push("3.3.3");
const _e = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = r = new it(t.insertBefore(J(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = globalThis;
class C extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = _e(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return R;
  }
}
C._$litElement$ = !0, C.finalized = !0, St.litElementHydrateSupport?.({ LitElement: C });
const $e = St.litElementPolyfillSupport;
$e?.({ LitElement: C });
(St.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = { attribute: !0, type: String, converter: lt, reflect: !1, hasChanged: kt }, ve = (e = xe, t, s) => {
  const { kind: i, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), i === "accessor") {
    const { name: o } = s;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (i === "setter") {
    const { name: o } = s;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function g(e) {
  return (t, s) => typeof s == "object" ? ve(e, t, s) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(e) {
  return g({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = (e, t, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function we(e, t) {
  return (s, i, r) => {
    const n = (o) => o.renderRoot?.querySelector(e) ?? null;
    return ye(s, i, { get() {
      return n(this);
    } });
  };
}
function nt(e, t, s) {
  e.dispatchEvent(
    new CustomEvent(t, { detail: s, bubbles: !0, composed: !0 })
  );
}
const ke = {
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
  drag: "Arrastrar para mover",
  yaml_mode: "Este dashboard está en modo YAML: no se puede mover ni redimensionar desde aquí.",
  menu: "Menú",
  home_title: "Mi casa",
  // Editor
  entity: "Luz o grupo de luces",
  name: "Nombre (opcional)",
  icon: "Icono (opcional)",
  use_light_color: "Teñir la tarjeta con el color real de la luz",
  group_by_area: "Agrupar la lista por habitación",
  group_auto: "Automático",
  group_always: "Siempre",
  group_never: "Nunca"
}, Ae = {
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
  drag: "Drag to move",
  yaml_mode: "This dashboard is in YAML mode: cards can't be moved or resized here.",
  menu: "Menu",
  home_title: "My home",
  entity: "Light or light group",
  name: "Name (optional)",
  icon: "Icon (optional)",
  use_light_color: "Tint the card with the light's real colour",
  group_by_area: "Group the list by room",
  group_auto: "Automatic",
  group_always: "Always",
  group_never: "Never"
};
function B(e) {
  return (e?.locale?.language ?? e?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function h(e, t, s) {
  let i = (B(e) === "es" ? ke : Ae)[t] ?? t;
  if (s) for (const [r, n] of Object.entries(s)) i = i.replace(`{${r}}`, String(n));
  return i;
}
function Ee(e, t) {
  const s = Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 6e4));
  if (s < 1) return h(e, "just_now");
  if (s < 60) return h(e, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? h(e, "h_ago", { n: i }) : h(e, "days_ago", { n: Math.round(i / 24) });
}
const Se = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", G = (e, t = 24) => A`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${Se} fill=${e ? "currentColor" : "none"}></path>
  </svg>`, Ce = (e = 24) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, Me = (e = 18) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, Kt = (e = 18) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, Rt = (e, t = 16) => A`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${e ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, ze = (e = 20) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, Pe = (e = 20) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, Te = (e = 18) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 20h4L19 9l-4-4L4 16z"></path><path d="M13.5 6.5l4 4"></path></svg>`, Oe = (e = 18) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"></path></svg>`, je = (e = 18) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"></path></svg>`, Le = (e = 18) => A`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, gt = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function De(e) {
  return e ? gt[e] ? gt[e] : /^(https?:|\/|data:image)/.test(e) ? `center / cover no-repeat url("${e.replace(/"/g, "%22")}")` : e : gt.crepusculo;
}
var He = Object.defineProperty, Ue = Object.getOwnPropertyDescriptor, $ = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ue(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && He(t, s, r), r;
};
const Ne = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
];
let _ = class extends C {
  constructor() {
    super(), this.narrow = !1, this.cards = [], this.badges = [], this.sections = [], this.isStrategy = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._saving = !1, this._onVisibility = () => this.requestUpdate(), this.initialRenderComplete = new Promise((e) => this._resolveInitial = e);
  }
  setConfig(e) {
    this._config = e;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("card-visibility-changed", this._onVisibility), this._ro = new ResizeObserver(([e]) => this._measure(e.contentRect.width)), this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("card-visibility-changed", this._onVisibility), this._ro?.disconnect();
  }
  firstUpdated() {
    this._resolveInitial();
  }
  willUpdate(e) {
    if (e.has("cards"))
      for (const t of this.cards) t.layout = "grid";
  }
  _measure(e) {
    const t = Math.min(e, 1180) - 2 * this._pad(e), s = e < 600 ? 2 : 4, i = this._gap(e), r = (t - i * (s - 1)) / s, n = Math.max(56, Math.round((r - i) / 2));
    s !== this._cols && (this._cols = s), n !== this._rowH && (this._rowH = n);
  }
  _gap(e = this.clientWidth) {
    return e < 600 ? 10 : 14;
  }
  _pad(e = this.clientWidth) {
    return e < 600 ? 16 : 24;
  }
  get _editMode() {
    return !!this.lovelace?.editMode && !this.isStrategy;
  }
  get _canSave() {
    return this._editMode && this.lovelace?.mode !== "yaml";
  }
  // ---- Sizes ---------------------------------------------------------------
  _sizeOf(e) {
    const t = e?.view_layout?.terral;
    let s = t?.w === 2 ? 2 : 1, i = t?.h === 1 || t?.h === 4 ? t.h : 2;
    return t || (i = 2, s = 1), i === 4 && (s = 2), { w: Math.min(s, this._cols), h: i };
  }
  _allowedSizes(e) {
    return (e.firstElementChild ?? e.shadowRoot?.firstElementChild)?.getTerralSizes?.() ?? Ne;
  }
  // ---- Config writes ------------------------------------------------------
  async _writeCards(e) {
    if (!this._canSave || this.index == null || !this.lovelace) return;
    const t = structuredClone(this.lovelace.config), s = t.views[this.index];
    if (s) {
      s.cards = [...s.cards ?? []], e(s.cards), this._saving = !0;
      try {
        await this.lovelace.saveConfig(t);
      } finally {
        this._saving = !1;
      }
    }
  }
  _cycleSize(e) {
    const t = this.cards[e], s = this._allowedSizes(t).filter((o) => o.w <= this._cols), i = this._sizeOf(t.config), r = s.findIndex((o) => o.w === i.w && o.h === i.h), n = s[(r + 1) % s.length];
    this._writeCards((o) => {
      const a = { ...o[e] };
      a.view_layout = { ...a.view_layout ?? {}, terral: { w: n.w, h: n.h } }, o[e] = a;
    });
  }
  _move(e, t) {
    e !== t && this._writeCards((s) => {
      const [i] = s.splice(e, 1);
      s.splice(t, 0, i);
    });
  }
  _edit(e) {
    nt(this, "ll-edit-card", { path: [this.index, e] });
  }
  _delete(e) {
    nt(this, "ll-delete-card", { path: [this.index, e], silent: !1 });
  }
  _add() {
    const [e, t] = (this.hass?.config?.version ?? "2026.11").split(".").map(Number), s = e > 2026 || e === 2026 && t >= 11;
    nt(this, "ll-create-card", { path: s ? ["views", this.index, "cards"] : [this.index] });
  }
  // ---- Drag to reorder ----------------------------------------------------
  _dragDown(e, t) {
    this._canSave && (e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), this._dragFrom = t, this._dropAt = t, this._dragStart = { x: e.clientX, y: e.clientY }, this._dragDx = this._dragDy = 0);
  }
  _dragMove(e) {
    if (this._dragFrom == null || !this._dragStart) return;
    this._dragDx = e.clientX - this._dragStart.x, this._dragDy = e.clientY - this._dragStart.y;
    const t = this.shadowRoot?.elementsFromPoint(e.clientX, e.clientY).find((s) => s instanceof HTMLElement && s.dataset.i != null && s.dataset.i !== String(this._dragFrom));
    t && (this._dropAt = Number(t.dataset.i));
  }
  _dragUp() {
    const e = this._dragFrom, t = this._dropAt;
    this._dragFrom = this._dropAt = void 0, this._dragStart = void 0, this._dragDx = this._dragDy = 0, e != null && t != null && this._move(e, t);
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const e = this._editMode, t = this._gap(), s = this._config?.title || h(this.hass, "home_title");
    return d`
      <div class="bg" style="background:${De(this._config?.background)}"></div>
      <div class="wrap" style="--gap:${t}px;--pad:${this._pad()}px">
        <div class="top">
          <button class="glass round" aria-label=${h(this.hass, "menu")} @click=${() => nt(this, "hass-toggle-menu")}>
            ${ze()}
          </button>
        </div>
        <h1>${s}</h1>
        ${e && this.lovelace?.mode === "yaml" ? d`<p class="notice">${h(this.hass, "yaml_mode")}</p>` : f}
        <div
          class="grid ${e ? "editing" : ""} ${this._saving ? "saving" : ""}"
          style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
          @pointermove=${this._dragMove}
          @pointerup=${this._dragUp}
          @pointercancel=${this._dragUp}
        >
          ${this.cards.map((i, r) => this._cell(i, r, e))}
          ${e ? d`<button class="add glass" @click=${this._add} style="grid-row:span 1">
                ${Pe()}<span>${h(this.hass, "add_card")}</span>
              </button>` : f}
        </div>
      </div>
    `;
  }
  _cell(e, t, s) {
    if (!s && e.hidden) return f;
    const { w: i, h: r } = this._sizeOf(e.config), n = this._dragFrom === t, o = this._dropAt === t && this._dragFrom != null && !n, a = `grid-column:span ${i};grid-row:span ${r};${n ? `transform:translate(${this._dragDx}px,${this._dragDy}px);z-index:5` : ""}`;
    return d`<div class="cell ${n ? "dragging" : ""} ${o ? "target" : ""}" data-i=${t} style=${a}>
      ${e}
      ${s ? d`<div class="overlay ${e.hidden ? "is-hidden" : ""}">
            <div class="tools">
              ${this._canSave ? d`<button class="tool grip" aria-label=${h(this.hass, "drag")} @pointerdown=${(l) => this._dragDown(l, t)}>
                    ${Le()}
                  </button>` : f}
              <span class="spacer"></span>
              ${this._canSave ? d`<button class="tool" aria-label="${h(this.hass, "size")} ${r}/${i}" @click=${() => this._cycleSize(t)}>
                    ${je()}<small>${r}/${i}</small>
                  </button>` : f}
              <button class="tool" aria-label=${h(this.hass, "edit")} @click=${() => this._edit(t)}>${Te()}</button>
              <button class="tool" aria-label=${h(this.hass, "delete")} @click=${() => this._delete(t)}>${Oe()}</button>
            </div>
          </div>` : f}
    </div>`;
  }
};
_.styles = st`
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
$([
  g({ attribute: !1 })
], _.prototype, "hass", 2);
$([
  g({ attribute: !1 })
], _.prototype, "lovelace", 2);
$([
  g({ type: Boolean })
], _.prototype, "narrow", 2);
$([
  g({ type: Number })
], _.prototype, "index", 2);
$([
  g({ attribute: !1 })
], _.prototype, "path", 2);
$([
  g({ attribute: !1 })
], _.prototype, "cards", 2);
$([
  g({ attribute: !1 })
], _.prototype, "badges", 2);
$([
  g({ attribute: !1 })
], _.prototype, "sections", 2);
$([
  g({ type: Boolean })
], _.prototype, "isStrategy", 2);
$([
  x()
], _.prototype, "_config", 2);
$([
  x()
], _.prototype, "_cols", 2);
$([
  x()
], _.prototype, "_rowH", 2);
$([
  x()
], _.prototype, "_dragFrom", 2);
$([
  x()
], _.prototype, "_dropAt", 2);
$([
  x()
], _.prototype, "_dragDx", 2);
$([
  x()
], _.prototype, "_dragDy", 2);
$([
  x()
], _.prototype, "_saving", 2);
_ = $([
  rt("terral-home-view")
], _);
var Re = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, S = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ie(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && Re(t, s, r), r;
};
let y = class extends C {
  constructor() {
    super(...arguments), this.value = 0, this.min = 0, this.max = 100, this.vertical = !1, this.mode = "fill", this.label = "", this.suffix = "%", this.showValue = !1, this._startX = 0, this._startY = 0, this._active = !1, this._down = (e) => {
      e.stopPropagation(), this._startX = e.clientX, this._startY = e.clientY, this._active = this.vertical, this._active && (this.setPointerCapture(e.pointerId), this._drag = this._valueAt(e)), this.addEventListener("pointermove", this._move), this.addEventListener("pointerup", this._up), this.addEventListener("pointercancel", this._cancel);
    }, this._move = (e) => {
      if (!this._active) {
        const t = Math.abs(e.clientX - this._startX), s = Math.abs(e.clientY - this._startY);
        if (s > 8 && s > t) return this._cancel();
        if (t < 6) return;
        this._active = !0, this.setPointerCapture(e.pointerId);
      }
      this._drag = this._valueAt(e), this.dispatchEvent(new CustomEvent("value-input", { detail: { value: this._drag } }));
    }, this._up = (e) => {
      const s = !this._active ? this._valueAt(e) : this._drag;
      this._cleanup(), s != null && this._commit(s);
    }, this._cancel = () => {
      this._cleanup(), this._drag = void 0;
    }, this._key = (e) => {
      const t = (this.max - this.min) / 20, s = ["ArrowUp", "ArrowRight"].includes(e.key), i = ["ArrowDown", "ArrowLeft"].includes(e.key);
      if (!s && !i) return;
      e.preventDefault();
      const r = Math.max(this.min, Math.min(this.max, Math.round(this.value + (s ? t : -t))));
      this._commit(r);
    };
  }
  get _shown() {
    return this._drag ?? this.value;
  }
  _pct(e) {
    return (e - this.min) / (this.max - this.min) * 100;
  }
  _valueAt(e) {
    const t = this.getBoundingClientRect(), s = this.vertical ? 1 - (e.clientY - t.top) / t.height : (e.clientX - t.left) / t.width, i = this.min + Math.max(0, Math.min(1, s)) * (this.max - this.min);
    return Math.round(i);
  }
  connectedCallback() {
    super.connectedCallback(), this.tabIndex = 0, this.setAttribute("role", "slider"), this.addEventListener("pointerdown", this._down), this.addEventListener("keydown", this._key), this.addEventListener("click", (e) => e.stopPropagation());
  }
  updated() {
    this.setAttribute("aria-label", this.label), this.setAttribute("aria-valuemin", String(this.min)), this.setAttribute("aria-valuemax", String(this.max)), this.setAttribute("aria-valuenow", String(this._shown)), this.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
  }
  _cleanup() {
    this._active = !1, this.removeEventListener("pointermove", this._move), this.removeEventListener("pointerup", this._up), this.removeEventListener("pointercancel", this._cancel);
  }
  _commit(e) {
    this._drag = void 0, this.value = e, this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: e } }));
  }
  render() {
    const e = this._pct(this._shown), t = this.mode === "fill";
    return d`
      ${t ? d`<div class="fill" style=${this.vertical ? `height:${e}%` : `width:${e}%`}></div>` : d`<div class="thumb" style=${this.vertical ? `bottom:${e}%` : `left:${e}%`}></div>`}
      <div class="label">
        <slot></slot>
        ${this.showValue ? d`<span>${this._shown}${this.suffix ? d`&nbsp;${this.suffix}` : f}</span>` : f}
      </div>
    `;
  }
};
y.styles = st`
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
S([
  g({ type: Number })
], y.prototype, "value", 2);
S([
  g({ type: Number })
], y.prototype, "min", 2);
S([
  g({ type: Number })
], y.prototype, "max", 2);
S([
  g({ type: Boolean, reflect: !0 })
], y.prototype, "vertical", 2);
S([
  g()
], y.prototype, "mode", 2);
S([
  g()
], y.prototype, "label", 2);
S([
  g()
], y.prototype, "suffix", 2);
S([
  g({ type: Boolean, attribute: "show-value" })
], y.prototype, "showValue", 2);
S([
  x()
], y.prototype, "_drag", 2);
y = S([
  rt("terral-slider")
], y);
const Gt = ["hs", "rgb", "rgbw", "rgbww", "xy"], Ct = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], _t = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function Zt(e) {
  return e.attributes.supported_color_modes ?? [];
}
function at(e) {
  const t = Zt(e);
  return t.some((s) => Gt.includes(s)) ? "color" : t.includes("color_temp") ? "temperature" : t.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Be(e) {
  return Zt(e).includes("color_temp");
}
function m(e) {
  return e?.state === "on";
}
function L(e) {
  return !e || e.state === "unavailable" || e.state === "unknown";
}
function O(e) {
  const t = e.attributes.brightness;
  if (!(!m(e) || t == null))
    return Math.max(1, Math.round(t / 255 * 100));
}
function w(e) {
  const t = e.attributes.entity_id;
  return Array.isArray(t) ? t.filter((s) => s !== e.entity_id) : [];
}
function et(e) {
  return e.attributes.color_temp_kelvin;
}
function W(e) {
  if (!m(e)) return;
  const t = e.attributes.color_mode;
  if (!t || !Gt.includes(t)) return;
  const s = e.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const It = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, F = (e, t, s) => [0, 1, 2].map((i) => Math.round(e[i] + (t[i] - e[i]) * s)), X = (e, t = 1) => `rgba(${e[0]},${e[1]},${e[2]},${t})`, We = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, Ve = (e) => (0.2126 * e[0] + 0.7152 * e[1] + 0.0722 * e[2]) / 255;
function Jt(e, t) {
  if (!t) return It;
  const s = W(e);
  if (!s) {
    const n = et(e);
    return n && e.attributes.color_mode === "color_temp" && n >= 4500 ? We : It;
  }
  const i = [255, 255, 255], r = Ve(s) > 0.75 ? F(s, [40, 50, 80], 0.45) : s;
  return {
    bg: X(F(s, i, 0.84), 0.95),
    fg: X(F(s, [10, 10, 20], 0.82)),
    fg2: X(F(s, [20, 10, 30], 0.72)),
    accent: X(r),
    fill: X(F(r, i, 0.35))
  };
}
function Z(e, t) {
  return e.callService("light", m(t) ? "turn_off" : "turn_on", {}, { entity_id: t.entity_id });
}
function mt(e, t, s) {
  return e.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: t });
}
function $t(e, t, s) {
  return s <= 0 ? e.callService("light", "turn_off", {}, { entity_id: t }) : e.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: t });
}
function ct(e, t, s) {
  const i = t.attributes.min_color_temp_kelvin ?? 2e3, r = t.attributes.max_color_temp_kelvin ?? 6500;
  return e.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(r, Math.max(i, s))) },
    { entity_id: t.entity_id }
  );
}
function Bt(e, t, s) {
  return e.callService("light", "turn_on", { rgb_color: s }, { entity_id: t });
}
function Ye(e) {
  const t = parseInt(e.replace("#", ""), 16);
  return [t >> 16 & 255, t >> 8 & 255, t & 255];
}
function E(e) {
  return "#" + e.map((t) => t.toString(16).padStart(2, "0")).join("");
}
function xt(e, t) {
  let s;
  for (const i of Ct) {
    const r = i.rgb.reduce((n, o, a) => n + (o - e[a]) ** 2, 0);
    (!s || r < s.d) && (s = { d: r, n: i.name[t] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function bt(e, t) {
  const s = e.entities?.[t], i = s?.area_id ?? (s?.device_id ? e.devices?.[s.device_id]?.area_id : void 0);
  return i ? e.areas?.[i]?.name ?? void 0 : void 0;
}
var qe = Object.defineProperty, Fe = Object.getOwnPropertyDescriptor, M = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Fe(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && qe(t, s, r), r;
};
let V;
function Xe(e, t) {
  V?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = e, s.opts = t, document.body.appendChild(s), V = s;
}
function Ke(e) {
  V?.isConnected && (V.hass = e);
}
let k = class extends C {
  constructor() {
    super(...arguments), this._stack = [], this._expanded = !1, this._closing = !1, this._wide = window.matchMedia("(min-width: 600px)").matches, this._openAreas = /* @__PURE__ */ new Set(), this._mq = window.matchMedia("(min-width: 600px)"), this._onMq = (e) => this._wide = e.matches, this._onKey = (e) => {
      e.key === "Escape" && this.close();
    }, this._grabDown = (e) => {
      this._grabY = e.clientY, e.currentTarget.setPointerCapture(e.pointerId);
    }, this._grabUp = (e) => {
      if (this._grabY == null) return;
      const t = e.clientY - this._grabY;
      this._grabY = void 0, t < -40 ? this._expanded = !0 : t > 80 ? this._expanded ? this._expanded = !1 : this.close() : Math.abs(t) < 6 && (this._expanded = !this._expanded);
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), V === this && (V = void 0);
  }
  close() {
    this._closing || (this._closing = !0, setTimeout(() => this.remove(), 180));
  }
  get _entityId() {
    return this._stack[this._stack.length - 1] ?? this.opts.entity;
  }
  _name(e) {
    return !this._stack.length && this.opts.name ? this.opts.name : this.hass.formatEntityName?.(e) ?? e.attributes.friendly_name ?? e.entity_id;
  }
  _stateText(e) {
    if (L(e)) return h(this.hass, "unavailable");
    if (!m(e)) return h(this.hass, "off");
    const t = [], s = w(e);
    if (s.length) {
      const o = s.filter((a) => m(this.hass.states[a])).length;
      t.push(`${o} ${h(this.hass, "of")} ${s.length} ${h(this.hass, "lit")}`);
    }
    const i = O(e);
    i != null && t.push(`${i} %`);
    const r = W(e), n = et(e);
    if (r) {
      const o = xt(r, B(this.hass));
      o && t.push(o);
    } else n && e.attributes.color_mode === "color_temp" && t.push(`${n} K`);
    return t.length || t.push(h(this.hass, "on")), t.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const e = this.hass.states[this._entityId], t = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return d`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${t}" role="dialog" aria-modal="true" aria-label=${e ? this._name(e) : this._entityId}>
        ${this._wide ? f : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${e ? this._content(e) : d`<p class="empty">${h(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(e) {
    const t = m(e), s = Jt(e, this.opts.useLightColor !== !1), i = w(e), r = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, n = this._controls(e), o = i.length ? this._memberList(e, i) : f, a = this._info(e);
    return d`
      <div class="body" style=${r}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${Rt(!1, 18)}
              </button>` : f}
          <button
            class="icon ${t ? "on" : ""}"
            aria-label=${t ? h(this.hass, "turn_off") : h(this.hass, "turn_on")}
            ?disabled=${L(e)}
            @click=${() => Z(this.hass, e)}
          >
            ${G(t, this._wide ? 28 : 24)}
            ${i.length && t ? d`<span class="badge">${i.filter((l) => m(this.hass.states[l])).length}</span>` : f}
          </button>
          <div class="title">
            <strong>${this._name(e)}</strong>
            <span>${this._stateText(e)}${bt(this.hass, e.entity_id) ? ` · ${bt(this.hass, e.entity_id)}` : ""}</span>
          </div>
          <button class="round close" aria-label=${h(this.hass, "close")} @click=${() => this.close()}>
            ${Me(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? d`<div class="cols">
              <div class="left">${n.main}</div>
              <div class="right">${n.side}${o}${i.length ? f : a}</div>
            </div>` : d`<div class="stack">
              <div class="main-row">${n.main}${n.beside ?? f}</div>
              ${n.side}${o}${i.length ? f : a}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(e) {
    const t = at(e), s = m(e), i = e.entity_id;
    if (t === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? h(this.hass, "turn_off") : h(this.hass, "turn_on")}
            @click=${() => Z(this.hass, e)}>
            <span>${Ce(36)}</span>
          </button>`,
        side: f
      };
    const r = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${O(e) ?? 0}
      .label=${h(this.hass, "brightness")}
      @value-changed=${(c) => $t(this.hass, i, c.detail.value)}
    >${Kt(28)}</terral-slider>`, n = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (c) => d`<button class="chip" @click=${() => $t(this.hass, i, c)}>${c} %</button>`
    )}
    </div>`, o = d`<div class="chips">
      ${_t.map(
      (c) => d`<button class="chip tinted" style="background:${c.css}" @click=${() => ct(this.hass, e, c.kelvin)}>
          ${h(this.hass, c.key)}
        </button>`
    )}
    </div>`;
    if (t === "dimmable") return { main: r, side: n };
    if (t === "temperature") {
      const c = e.attributes.min_color_temp_kelvin ?? 2e3, b = e.attributes.max_color_temp_kelvin ?? 6500, v = d`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${c}
        .max=${b}
        .value=${et(e) ?? Math.round((c + b) / 2)}
        .label=${h(this.hass, "temperature")}
        @value-changed=${(U) => ct(this.hass, e, U.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${r}${v}</div>`, side: o } : { main: d`<div class="pair">${r}${v}</div>`, side: o };
    }
    const a = B(this.hass), l = (this.opts.favorites?.length ? this.opts.favorites : Ct.map((c) => ({ name: c.name[a], rgb: c.rgb }))).slice(0, 6), p = W(e), u = d`
      <p class="lb">${h(this.hass, "favorites")}</p>
      <div class="swatches">
        ${l.map(
      (c) => d`<button
            class="sw ${p && E(p) === E(c.rgb) ? "sel" : ""}"
            style="background:${E(c.rgb)}"
            aria-label=${c.name ?? E(c.rgb)}
            @click=${() => Bt(this.hass, i, c.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${h(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${p ? E(p) : "#ffffff"} @change=${(c) => Bt(this.hass, i, Ye(c.target.value))} />
      ${Be(e) ? d`<p class="lb">${h(this.hass, "temperature")}</p>${o}` : f}
    `;
    return this._wide ? { main: r, side: u } : { main: r, side: f, beside: d`<div class="beside">${u}</div>` };
  }
  _memberList(e, t) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const l of t) {
      const p = bt(this.hass, l) ?? h(this.hass, "other_area");
      i.set(p, [...i.get(p) ?? [], l]);
    }
    const r = s === "always" || s === "auto" && t.length > 8 && i.size > 1, n = t.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => mt(this.hass, e.entity_id, !0)}>${h(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => mt(this.hass, e.entity_id, !1)}>${h(this.hass, "all_off")}</button>
        </div>` : f, o = (l) => {
      const p = this.hass.states[l], u = m(p), c = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? l : l;
      return d`<div class="mr">
        <button class="mi ${u ? "on" : ""}" ?disabled=${L(p)}
          aria-label="${u ? h(this.hass, "turn_off") : h(this.hass, "turn_on")} ${c}"
          @click=${() => p && Z(this.hass, p)}>${G(u, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, l]}>
          <span>${c}</span><small>${p ? this._stateText(p) : h(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, a = (l) => [...l].sort((p, u) => Number(m(this.hass.states[u])) - Number(m(this.hass.states[p])));
    return d`
      ${n}
      <p class="lb">${h(this.hass, "lights_in_group")} (${t.length})</p>
      <div class="list">
        ${r ? [...i.entries()].map(([l, p]) => {
      const u = this._openAreas.has(l), c = p.filter((b) => m(this.hass.states[b])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${c ? "on" : ""}" aria-label="${c ? h(this.hass, "turn_off") : h(this.hass, "turn_on")} ${l}"
                    @click=${() => mt(this.hass, p, c === 0)}>${G(c > 0, 18)}</button>
                  <button class="mt" aria-expanded=${u} @click=${() => {
        const b = new Set(this._openAreas);
        u ? b.delete(l) : b.add(l), this._openAreas = b;
      }}>
                    <span>${l} <small>${c} ${h(this.hass, "of")} ${p.length}</small></span>${Rt(u)}
                  </button>
                </div>
                ${u ? d`<div class="inner">${p.map(o)}</div>` : f}
              </div>`;
    }) : d`<div class="box">${a(t).map(o)}</div>`}
      </div>
    `;
  }
  _info(e) {
    return d`<div class="info">
      <div><span>${h(this.hass, "last_activity")}</span><span>${Ee(this.hass, e.last_changed)}</span></div>
    </div>`;
  }
};
k.styles = st`
    :host {
      position: fixed;
      inset: 0;
      z-index: 9999;
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
M([
  g({ attribute: !1 })
], k.prototype, "hass", 2);
M([
  g({ attribute: !1 })
], k.prototype, "opts", 2);
M([
  x()
], k.prototype, "_stack", 2);
M([
  x()
], k.prototype, "_expanded", 2);
M([
  x()
], k.prototype, "_closing", 2);
M([
  x()
], k.prototype, "_wide", 2);
M([
  x()
], k.prototype, "_openAreas", 2);
M([
  we("input[type=color]")
], k.prototype, "_picker", 2);
k = M([
  rt("terral-light-dialog")
], k);
var Ge = Object.defineProperty, Ze = Object.getOwnPropertyDescriptor, z = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ze(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && Ge(t, s, r), r;
};
const Je = "terral-home-light";
let H = class extends C {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const e = this._config.favorite_colors?.map((t) => Array.isArray(t) ? { rgb: t } : t);
      Xe(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: e,
        groupByArea: this._config.group_by_area
      });
    }, this._toggle = (e) => {
      e.stopPropagation();
      const t = this._entity;
      t && this.hass && !L(t) && Z(this.hass, t);
    }, this._down = (e) => {
      this._held = !1, this._holdStart = { x: e.clientX, y: e.clientY }, clearTimeout(this._holdTimer), this._holdTimer = window.setTimeout(() => {
        this._held = !0, this._openWindow();
      }, 550);
    }, this._move = (e) => {
      this._holdStart && Math.hypot(e.clientX - this._holdStart.x, e.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._clickCapture = (e) => {
      this._held && (e.stopPropagation(), e.preventDefault(), this._held = !1);
    };
  }
  // ---- Lovelace card API -------------------------------------------------
  setConfig(e) {
    if (!e?.entity || !String(e.entity).startsWith("light."))
      throw new Error("Terral · Luz: 'entity' must be a light (light.xxx)");
    this._config = e;
    const t = e.view_layout?.terral;
    t && (this._size = t.h === 1 ? "s11" : t.h === 4 ? "s42" : t.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }
  /** Sizes the Terral view should offer for this card (w/h in cells). */
  getTerralSizes() {
    const e = this._entity, t = [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 }
    ];
    return e ? at(e) === "temperature" || at(e) === "color" || w(e).length > 0 ? t : t.slice(0, 3) : t;
  }
  static getStubConfig(e, t = [], s = []) {
    return { entity: [...t, ...s].find((r) => r.startsWith("light.")) ?? Object.keys(e?.states ?? {}).find((r) => r.startsWith("light.")) ?? "light.example" };
  }
  static getConfigForm() {
    const e = (t) => h(void 0, t);
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
                { value: "auto", label: e("group_auto") },
                { value: "always", label: e("group_always") },
                { value: "never", label: e("group_never") }
              ]
            }
          }
        }
      ],
      computeLabel: (t) => ({
        entity: e("entity"),
        name: e("name"),
        use_light_color: e("use_light_color"),
        group_by_area: e("group_by_area")
      })[t.name] ?? t.name
    };
  }
  // ---- Lifecycle ---------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(([e]) => {
      if (this._config?.view_layout?.terral) return;
      const { width: t, height: s } = e.contentRect;
      if (!t || !s) return;
      let i;
      s < 120 ? i = "s11" : t < s * 1.4 ? i = t > 260 && s > 260 ? "s42" : "s21" : i = "s22", i !== this._size && (this._size = i);
    }), this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  shouldUpdate(e) {
    if (e.size > 1 || !e.has("hass")) return !0;
    const t = e.get("hass");
    return !t || !this.hass || !this._config || t.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...w(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => t.states[i] !== this.hass.states[i]);
  }
  updated(e) {
    e.has("hass") && this.hass && Ke(this.hass);
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  // ---- Render ------------------------------------------------------------
  _name(e) {
    return this._config?.name || this.hass?.formatEntityName?.(e) || e.attributes.friendly_name || e.entity_id;
  }
  _status(e, t) {
    const s = this.hass;
    if (L(e)) return h(s, "unavailable");
    const i = w(e);
    if (i.length) {
      const a = i.filter((u) => m(s.states[u])).length;
      if (!a) return `${i.length} ${h(s, "lights_off")}`;
      const l = O(e), p = a === i.length && t === "onoff" ? `${h(s, "all_lit")} (${a})` : `${a} ${h(s, "of")} ${i.length} ${h(s, "lit")}`;
      return l != null && this._size !== "s11" ? `${p} · ${l} %` : p;
    }
    if (!m(e)) return h(s, "off");
    const r = [], n = O(e);
    n != null && r.push(`${n} %`);
    const o = W(e);
    if (o) {
      const a = xt(o, B(s));
      a && r.push(a);
    } else if (t === "temperature" || t === "color") {
      const a = et(e);
      if (a && e.attributes.color_mode === "color_temp") {
        const l = [..._t].sort((p, u) => Math.abs(p.kelvin - a) - Math.abs(u.kelvin - a))[0];
        r.push(h(s, l.key));
      }
    }
    return r.join(" · ") || h(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return f;
    const e = this._entity;
    if (!e)
      return d`<div class="card off missing"><span>${h(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const t = at(e), s = m(e), i = L(e), r = w(e), n = Jt(e, this._config.use_light_color !== !1), o = s ? `--bg:${n.bg};--fg:${n.fg};--fg2:${n.fg2};--accent:${n.accent};--fill:${n.fill}` : "";
    let a = this._size;
    a === "s42" && !this.getTerralSizes().some((u) => u.h === 4) && (a = "s22");
    const l = d`<button
      class="icon"
      aria-label="${s ? h(this.hass, "turn_off") : h(this.hass, "turn_on")} ${this._name(e)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${G(s, a === "s11" ? 20 : 32)}
      ${r.length && s ? d`<span class="badge">${r.filter((u) => m(this.hass.states[u])).length}</span>` : f}
    </button>`, p = d`<button class="text" @click=${this._openWindow}>
      <span class="name">${this._name(e)}</span>
      <span class="state">${this._status(e, t)}</span>
    </button>`;
    return d`<div
      class="card ${a} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${o}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      @click=${this._clickCapture}
      @contextmenu=${(u) => u.preventDefault()}
    >
      ${a === "s11" || a === "s21" ? d`${l}${p}` : d`<div class="head">${l}${p}${this._quickButton(e, t, a)}</div>
            ${this._body(e, t, a)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(e, t, s) {
    if (t !== "color" && t !== "temperature" || s === "s42" && !w(e).length) return f;
    const i = W(e), r = i ? xt(i, B(this.hass)) ?? "" : "", n = t === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? E(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style=${n}></i>${r || (t === "color" ? h(this.hass, "more_colors") : h(this.hass, "temperature"))}</button>`;
  }
  _brightness(e, t = !1) {
    return d`<terral-slider
      class="bar ${t ? "big" : ""}"
      .value=${O(e) ?? 0}
      .label=${h(this.hass, "brightness")}
      @value-changed=${(s) => $t(this.hass, e.entity_id, s.detail.value)}
    >${Kt(18)}</terral-slider>`;
  }
  _body(e, t, s) {
    const i = w(e);
    if (s === "s42" && i.length) {
      const n = [...i].sort((p, u) => Number(m(this.hass.states[u])) - Number(m(this.hass.states[p]))), o = t === "onoff" ? 5 : 4, a = n.length > o ? n.slice(0, o - 1) : n, l = n.length - a.length;
      return d`
        ${t !== "onoff" ? this._brightness(e) : f}
        <div class="members">
          ${a.map((p) => {
        const u = this.hass.states[p], c = m(u), b = u ? this.hass.formatEntityName?.(u) ?? u.attributes.friendly_name ?? p : p;
        return d`<div class="mr">
              <button class="mi ${c ? "lit" : ""}" ?disabled=${L(u)} aria-label="${c ? h(this.hass, "turn_off") : h(this.hass, "turn_on")} ${b}"
                @click=${(v) => {
          v.stopPropagation(), u && Z(this.hass, u);
        }}>${G(c, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${b}</span><small>${u ? m(u) ? O(u) != null ? `${O(u)} %` : h(this.hass, "on") : h(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${l > 0 ? d`<button class="morebtn" @click=${this._openWindow}>+ ${l} ${h(this.hass, "more")}</button>` : f}
        </div>
      `;
    }
    if (t === "onoff")
      return i.length ? d`<div class="tags">
          ${i.slice(0, 4).map((n) => {
        const o = this.hass.states[n], a = o ? this.hass.formatEntityName?.(o) ?? o.attributes.friendly_name ?? n : n;
        return d`<span class="tag"><i class=${m(o) ? "lit" : ""}></i>${a}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${m(e) ? h(this.hass, "on") : h(this.hass, "off")}</b>${new Date(e.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(e);
    if (t === "temperature") {
      const n = e.attributes.min_color_temp_kelvin ?? 2e3, o = e.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${h(this.hass, "brightness")}</p>
        ${this._brightness(e, !0)}
        <p class="lbl">${h(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${n} .max=${o} .value=${et(e) ?? 3500}
          .label=${h(this.hass, "temperature")}
          @value-changed=${(a) => ct(this.hass, e, a.detail.value)}></terral-slider>
        <div class="chips">
          ${_t.map((a) => d`<button class="chip" style="background:${a.css}" @click=${(l) => {
        l.stopPropagation(), ct(this.hass, e, a.kelvin);
      }}>${h(this.hass, a.key)}</button>`)}
        </div>
      `;
    }
    const r = this._config?.favorite_colors?.map((n) => Array.isArray(n) ? n : n.rgb) ?? void 0;
    return d`
      <p class="lbl">${h(this.hass, "brightness")}</p>
      ${this._brightness(e, !0)}
      <p class="lbl">${h(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${e} .colors=${r}></terral-light-favs>
      <button class="pb wide" @click=${(n) => {
      n.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${h(this.hass, "more_colors")}</button>
    `;
  }
};
H.styles = st`
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
z([
  g({ attribute: !1 })
], H.prototype, "hass", 2);
z([
  g({ type: Boolean })
], H.prototype, "preview", 2);
z([
  x()
], H.prototype, "_config", 2);
z([
  x()
], H.prototype, "_size", 2);
H = z([
  rt(Je)
], H);
let Y = class extends C {
  render() {
    if (!this.hass || !this.entity) return f;
    const e = B(this.hass), t = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: E(i) })) : Qe[e] ??= ts(e), s = W(this.entity);
    return t.slice(0, 6).map(
      (i) => d`<button
        class=${s && E(s) === E(i.rgb) ? "sel" : ""}
        style="background:${E(i.rgb)}"
        aria-label=${i.name}
        @click=${(r) => {
        r.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
Y.styles = st`
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
z([
  g({ attribute: !1 })
], Y.prototype, "hass", 2);
z([
  g({ attribute: !1 })
], Y.prototype, "entity", 2);
z([
  g({ attribute: !1 })
], Y.prototype, "colors", 2);
Y = z([
  rt("terral-light-favs")
], Y);
const Qe = {}, ts = (e) => Ct.map((t) => ({ rgb: t.rgb, name: t.name[e] }));
class es extends HTMLElement {
  static async generate(t, s) {
    const i = Object.values(s.states).filter((r) => r.entity_id.startsWith("light.") && !r.attributes.hidden).sort((r, n) => +(w(n).length > 0) - +(w(r).length > 0));
    return {
      title: "Terral Home",
      views: [
        {
          type: "custom:terral-home-view",
          title: s.language?.startsWith("es") ? "Mi casa" : "My home",
          path: "inicio",
          cards: i.map((r) => ({
            type: "custom:terral-home-light",
            entity: r.entity_id,
            view_layout: { terral: w(r).length ? { w: 2, h: 2 } : { w: 1, h: 2 } }
          }))
        }
      ]
    };
  }
}
customElements.get("ll-strategy-dashboard-terral-home") || customElements.define("ll-strategy-dashboard-terral-home", es);
const vt = window;
vt.customStrategies = vt.customStrategies || [];
vt.customStrategies.push({
  type: "terral-home",
  strategyType: "dashboard",
  name: "Terral Home",
  description: "Dashboard Terral Home con todas tus luces / Terral Home dashboard with all your lights",
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
const ss = "0.2.0", dt = window;
dt.customCards = dt.customCards || [];
dt.customCards.some((e) => e.type === "terral-home-light") || dt.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (e, t) => t.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: t } } : null
});
console.info(
  `%c TERRAL HOME %c v${ss} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  ss as VERSION
};
