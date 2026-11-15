/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis, Mt = dt.ShadowRoot && (dt.ShadyCSS === void 0 || dt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zt = Symbol(), Nt = /* @__PURE__ */ new WeakMap();
let re = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== zt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (Mt && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = Nt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Nt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const me = (e) => new re(typeof e == "string" ? e : e + "", void 0, zt), D = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new re(s, e, zt);
}, xe = (e, t) => {
  if (Mt) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = dt.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, It = Mt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return me(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ve, defineProperty: $e, getOwnPropertyDescriptor: ye, getOwnPropertyNames: we, getOwnPropertySymbols: ke, getPrototypeOf: Ae } = Object, mt = globalThis, Bt = mt.trustedTypes, Ee = Bt ? Bt.emptyScript : "", Se = mt.reactiveElementPolyfillSupport, rt = (e, t) => e, gt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ee : null;
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
} }, Pt = (e, t) => !ve(e, t), Yt = { attribute: !0, type: String, converter: gt, reflect: !1, useDefault: !1, hasChanged: Pt };
Symbol.metadata ??= Symbol("metadata"), mt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let W = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = Yt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && $e(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: o } = ye(this.prototype, t) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: r, set(n) {
      const a = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Yt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(rt("elementProperties"))) return;
    const t = Ae(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(rt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(rt("properties"))) {
      const s = this.properties, i = [...we(s), ...ke(s)];
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
      for (const r of i) s.unshift(It(r));
    } else t !== void 0 && s.push(It(t));
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
    return xe(t, this.constructor.elementStyles), t;
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
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : gt).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : gt;
      this._$Em = r;
      const a = n.fromAttribute(s, o.type);
      this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? Pt)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? s ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, a = this[r];
        n !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
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
W.elementStyles = [], W.shadowRootOptions = { mode: "open" }, W[rt("elementProperties")] = /* @__PURE__ */ new Map(), W[rt("finalized")] = /* @__PURE__ */ new Map(), Se?.({ ReactiveElement: W }), (mt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = globalThis, qt = (e) => e, ft = Tt.trustedTypes, Wt = ft ? ft.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, oe = "$lit$", L = `lit$${Math.random().toFixed(9).slice(2)}$`, ne = "?" + L, Ce = `<${ne}>`, I = document, nt = () => I.createComment(""), at = (e) => e === null || typeof e != "object" && typeof e != "function", Ot = Array.isArray, Me = (e) => Ot(e) || typeof e?.[Symbol.iterator] == "function", yt = `[ 	
\f\r]`, tt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ft = /-->/g, Vt = />/g, j = RegExp(`>|${yt}(?:([^\\s"'>=/]+)(${yt}*=${yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Kt = /'/g, Xt = /"/g, ae = /^(?:script|style|textarea|title)$/i, le = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), d = le(1), w = le(2), B = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Gt = /* @__PURE__ */ new WeakMap(), R = I.createTreeWalker(I, 129);
function ce(e, t) {
  if (!Ot(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Wt !== void 0 ? Wt.createHTML(t) : t;
}
const ze = (e, t) => {
  const s = e.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = tt;
  for (let a = 0; a < s; a++) {
    const l = e[a];
    let p, u, h = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, u = n.exec(l), u !== null); ) f = n.lastIndex, n === tt ? u[1] === "!--" ? n = Ft : u[1] !== void 0 ? n = Vt : u[2] !== void 0 ? (ae.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = j) : u[3] !== void 0 && (n = j) : n === j ? u[0] === ">" ? (n = r ?? tt, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, p = u[1], n = u[3] === void 0 ? j : u[3] === '"' ? Xt : Kt) : n === Xt || n === Kt ? n = j : n === Ft || n === Vt ? n = tt : (n = j, r = void 0);
    const b = n === j && e[a + 1].startsWith("/>") ? " " : "";
    o += n === tt ? l + Ce : h >= 0 ? (i.push(p), l.slice(0, h) + oe + l.slice(h) + L + b) : l + L + (h === -2 ? a : b);
  }
  return [ce(e, o + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class lt {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const a = t.length - 1, l = this.parts, [p, u] = ze(t, s);
    if (this.el = lt.createElement(p, i), R.currentNode = this.el.content, s === 2 || s === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = R.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(oe)) {
          const f = u[n++], b = r.getAttribute(h).split(L), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: o, name: v[2], strings: b, ctor: v[1] === "." ? Te : v[1] === "?" ? Oe : v[1] === "@" ? Le : xt }), r.removeAttribute(h);
        } else h.startsWith(L) && (l.push({ type: 6, index: o }), r.removeAttribute(h));
        if (ae.test(r.tagName)) {
          const h = r.textContent.split(L), f = h.length - 1;
          if (f > 0) {
            r.textContent = ft ? ft.emptyScript : "";
            for (let b = 0; b < f; b++) r.append(h[b], nt()), R.nextNode(), l.push({ type: 2, index: ++o });
            r.append(h[f], nt());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ne) l.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(L, h + 1)) !== -1; ) l.push({ type: 7, index: o }), h += L.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const i = I.createElement("template");
    return i.innerHTML = t, i;
  }
}
function V(e, t, s = e, i) {
  if (t === B) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = at(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = V(e, r._$AS(e, t.values), r, i)), t;
}
class Pe {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? I).importNode(s, !0);
    R.currentNode = r;
    let o = R.nextNode(), n = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let p;
        l.type === 2 ? p = new Q(o, o.nextSibling, this, t) : l.type === 1 ? p = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (p = new De(o, this, t)), this._$AV.push(p), l = i[++a];
      }
      n !== l?.index && (o = R.nextNode(), n++);
    }
    return R.currentNode = I, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class Q {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = V(this, t, s), at(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== B && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Me(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && at(this._$AH) ? this._$AA.nextSibling.data = t : this.T(I.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = lt.createElement(ce(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const o = new Pe(r, this), n = o.u(this.options);
      o.p(s), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = Gt.get(t.strings);
    return s === void 0 && Gt.set(t.strings, s = new lt(t)), s;
  }
  k(t) {
    Ot(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const o of t) r === s.length ? s.push(i = new Q(this.O(nt()), this.O(nt()), this, this.options)) : i = s[r], i._$AI(o), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = qt(t).nextSibling;
      qt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class xt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, o) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(t, s = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = V(this, t, s, 0), n = !at(t) || t !== this._$AH && t !== B, n && (this._$AH = t);
    else {
      const a = t;
      let l, p;
      for (t = o[0], l = 0; l < o.length - 1; l++) p = V(this, a[i + l], s, l), p === B && (p = this._$AH[l]), n ||= !at(p) || p !== this._$AH[l], p === g ? t = g : t !== g && (t += (p ?? "") + o[l + 1]), this._$AH[l] = p;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Te extends xt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class Oe extends xt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class Le extends xt {
  constructor(t, s, i, r, o) {
    super(t, s, i, r, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = V(this, t, s, 0) ?? g) === B) return;
    const i = this._$AH, r = t === g && i !== g || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== g && (i === g || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class De {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    V(this, t);
  }
}
const je = { I: Q }, He = Tt.litHtmlPolyfillSupport;
He?.(lt, Q), (Tt.litHtmlVersions ??= []).push("3.3.3");
const Ue = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = r = new Q(t.insertBefore(nt(), o), o, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = globalThis;
let S = class extends W {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ue(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return B;
  }
};
S._$litElement$ = !0, S.finalized = !0, Lt.litElementHydrateSupport?.({ LitElement: S });
const Re = Lt.litElementPolyfillSupport;
Re?.({ LitElement: S });
(Lt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = { attribute: !0, type: String, converter: gt, reflect: !1, hasChanged: Pt }, Ie = (e = Ne, t, s) => {
  const { kind: i, metadata: r } = s;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(s.name, e), i === "accessor") {
    const { name: n } = s;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(n, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, e, a), a;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(a) {
      const l = this[n];
      t.call(this, a), this.requestUpdate(n, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function _(e) {
  return (t, s) => typeof s == "object" ? Ie(e, t, s) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(e) {
  return _({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Be = (e, t, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ye(e, t) {
  return (s, i, r) => {
    const o = (n) => n.renderRoot?.querySelector(e) ?? null;
    return Be(s, i, { get() {
      return o(this);
    } });
  };
}
const qe = {
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
  search_lights: "Buscar luces",
  no_lights: "No hay luces que añadir",
  light_groups: "Grupos de luces",
  group: "Grupo",
  added: "Añadida",
  edit_home: "Editar inicio",
  terral_settings: "Ajustes de Terral Home",
  coming_soon: "Próximamente",
  done: "Listo",
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
  group_never: "Nunca"
}, We = {
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
  search_lights: "Search lights",
  no_lights: "No lights to add",
  light_groups: "Light groups",
  group: "Group",
  added: "Added",
  edit_home: "Edit home",
  terral_settings: "Terral Home settings",
  coming_soon: "Coming soon",
  done: "Done",
  more_options: "More options",
  panel_error: "Couldn't read the Terral Home layout. Did you restart after updating?",
  entity: "Light or light group",
  name: "Name (optional)",
  icon: "Icon (optional)",
  use_light_color: "Tint the card with the light's real colour",
  group_by_area: "Group the list by room",
  group_auto: "Automatic",
  group_always: "Always",
  group_never: "Never"
};
function K(e) {
  return (e?.locale?.language ?? e?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function c(e, t, s) {
  let i = (K(e) === "es" ? qe : We)[t] ?? t;
  if (s) for (const [r, o] of Object.entries(s)) i = i.replace(`{${r}}`, String(o));
  return i;
}
function Fe(e, t) {
  const s = Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 6e4));
  if (s < 1) return c(e, "just_now");
  if (s < 60) return c(e, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? c(e, "h_ago", { n: i }) : c(e, "days_ago", { n: Math.round(i / 24) });
}
const Ve = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", F = (e, t = 24) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${Ve} fill=${e ? "currentColor" : "none"}></path>
  </svg>`, Ke = (e = 24) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, he = (e = 18) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, de = (e = 18) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, Jt = (e, t = 16) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${e ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, Xe = (e = 20) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, wt = (e = 20) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, Ge = (e = 18) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, Je = (e = 20) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, Ze = (e = 16) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, Qe = (e = 18) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, ts = (e = 18) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, es = (e = 20) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`;
var ss = Object.defineProperty, is = Object.getOwnPropertyDescriptor, C = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? is(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && ss(t, s, r), r;
};
let k = class extends S {
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
        ${this.showValue ? d`<span>${this._shown}${this.suffix ? d`&nbsp;${this.suffix}` : g}</span>` : g}
      </div>
    `;
  }
};
k.styles = D`
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
C([
  _({ type: Number })
], k.prototype, "value", 2);
C([
  _({ type: Number })
], k.prototype, "min", 2);
C([
  _({ type: Number })
], k.prototype, "max", 2);
C([
  _({ type: Boolean, reflect: !0 })
], k.prototype, "vertical", 2);
C([
  _()
], k.prototype, "mode", 2);
C([
  _()
], k.prototype, "label", 2);
C([
  _()
], k.prototype, "suffix", 2);
C([
  _({ type: Boolean, attribute: "show-value" })
], k.prototype, "showValue", 2);
C([
  x()
], k.prototype, "_drag", 2);
k = C([
  q("terral-slider")
], k);
const pe = ["hs", "rgb", "rgbw", "rgbww", "xy"], Dt = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], Et = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function ue(e) {
  return e.attributes.supported_color_modes ?? [];
}
function pt(e) {
  const t = ue(e);
  return t.some((s) => pe.includes(s)) ? "color" : t.includes("color_temp") ? "temperature" : t.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function rs(e) {
  return ue(e).includes("color_temp");
}
function m(e) {
  return e?.state === "on";
}
function N(e) {
  return !e || e.state === "unavailable" || e.state === "unknown";
}
function U(e) {
  const t = e.attributes.brightness;
  if (!(!m(e) || t == null))
    return Math.max(1, Math.round(t / 255 * 100));
}
function z(e) {
  const t = e.attributes.entity_id;
  return Array.isArray(t) ? t.filter((s) => s !== e.entity_id) : [];
}
function ge(e) {
  return z(e).length > 0;
}
function ct(e) {
  return e.attributes.color_temp_kelvin;
}
function X(e) {
  if (!m(e)) return;
  const t = e.attributes.color_mode;
  if (!t || !pe.includes(t)) return;
  const s = e.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const Zt = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, et = (e, t, s) => [0, 1, 2].map((i) => Math.round(e[i] + (t[i] - e[i]) * s)), st = (e, t = 1) => `rgba(${e[0]},${e[1]},${e[2]},${t})`, os = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, ns = (e) => (0.2126 * e[0] + 0.7152 * e[1] + 0.0722 * e[2]) / 255;
function fe(e, t) {
  if (!t) return Zt;
  const s = X(e);
  if (!s) {
    const o = ct(e);
    return o && e.attributes.color_mode === "color_temp" && o >= 4500 ? os : Zt;
  }
  const i = [255, 255, 255], r = ns(s) > 0.75 ? et(s, [40, 50, 80], 0.45) : s;
  return {
    bg: st(et(s, i, 0.84), 0.95),
    fg: st(et(s, [10, 10, 20], 0.82)),
    fg2: st(et(s, [20, 10, 30], 0.72)),
    accent: st(r),
    fill: st(et(r, i, 0.35))
  };
}
function ot(e, t) {
  return e.callService("light", m(t) ? "turn_off" : "turn_on", {}, { entity_id: t.entity_id });
}
function kt(e, t, s) {
  return e.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: t });
}
function St(e, t, s) {
  return s <= 0 ? e.callService("light", "turn_off", {}, { entity_id: t }) : e.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: t });
}
function bt(e, t, s) {
  const i = t.attributes.min_color_temp_kelvin ?? 2e3, r = t.attributes.max_color_temp_kelvin ?? 6500;
  return e.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(r, Math.max(i, s))) },
    { entity_id: t.entity_id }
  );
}
function Qt(e, t, s) {
  return e.callService("light", "turn_on", { rgb_color: s }, { entity_id: t });
}
function as(e) {
  const t = parseInt(e.replace("#", ""), 16);
  return [t >> 16 & 255, t >> 8 & 255, t & 255];
}
function E(e) {
  return "#" + e.map((t) => t.toString(16).padStart(2, "0")).join("");
}
function Ct(e, t) {
  let s;
  for (const i of Dt) {
    const r = i.rgb.reduce((o, n, a) => o + (n - e[a]) ** 2, 0);
    (!s || r < s.d) && (s = { d: r, n: i.name[t] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function ut(e, t) {
  const s = e.entities?.[t], i = s?.area_id ?? (s?.device_id ? e.devices?.[s.device_id]?.area_id : void 0);
  return i ? e.areas?.[i]?.name ?? void 0 : void 0;
}
function te(e, t, s) {
  for (const i of e) {
    if (i === t) break;
    if (!(i instanceof HTMLElement)) continue;
    const r = getComputedStyle(i).overflowY;
    if ((r === "auto" || r === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function be(e) {
  let t = 0;
  const s = (o) => {
    t = o.touches[0]?.clientY ?? 0;
  }, i = (o) => {
    if (!o.cancelable) return;
    const n = o.touches[0]?.clientY ?? t;
    te(o.composedPath(), e, n - t) || o.preventDefault();
  }, r = (o) => {
    te(o.composedPath(), e, -o.deltaY) || o.preventDefault();
  };
  return e.addEventListener("touchstart", s, { passive: !0 }), e.addEventListener("touchmove", i, { passive: !1 }), e.addEventListener("wheel", r, { passive: !1 }), () => {
    e.removeEventListener("touchstart", s), e.removeEventListener("touchmove", i), e.removeEventListener("wheel", r);
  };
}
var ls = Object.defineProperty, cs = Object.getOwnPropertyDescriptor, T = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? cs(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && ls(t, s, r), r;
};
let G;
function hs(e, t) {
  G?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = e, s.opts = t, document.body.appendChild(s), G = s;
}
function ds(e) {
  G?.isConnected && (G.hass = e);
}
let A = class extends S {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = be(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), G === this && (G = void 0);
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
    if (N(e)) return c(this.hass, "unavailable");
    if (!m(e)) return c(this.hass, "off");
    const t = [], s = z(e);
    if (s.length) {
      const n = s.filter((a) => m(this.hass.states[a])).length;
      t.push(`${n} ${c(this.hass, "of")} ${s.length} ${c(this.hass, "lit")}`);
    }
    const i = U(e);
    i != null && t.push(`${i} %`);
    const r = X(e), o = ct(e);
    if (r) {
      const n = Ct(r, K(this.hass));
      n && t.push(n);
    } else o && e.attributes.color_mode === "color_temp" && t.push(`${o} K`);
    return t.length || t.push(c(this.hass, "on")), t.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const e = this.hass.states[this._entityId], t = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return d`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${t}" role="dialog" aria-modal="true" aria-label=${e ? this._name(e) : this._entityId}>
        ${this._wide ? g : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${e ? this._content(e) : d`<p class="empty">${c(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(e) {
    const t = m(e), s = fe(e, this.opts.useLightColor !== !1), i = z(e), r = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, o = this._controls(e), n = i.length ? this._memberList(e, i) : g, a = this._info(e);
    return d`
      <div class="body" style=${r}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${Jt(!1, 18)}
              </button>` : g}
          <button
            class="icon ${t ? "on" : ""}"
            aria-label=${t ? c(this.hass, "turn_off") : c(this.hass, "turn_on")}
            ?disabled=${N(e)}
            @click=${() => ot(this.hass, e)}
          >
            ${F(t, this._wide ? 28 : 24)}
            ${i.length && t ? d`<span class="badge">${i.filter((l) => m(this.hass.states[l])).length}</span>` : g}
          </button>
          <div class="title">
            <strong>${this._name(e)}</strong>
            <span>${this._stateText(e)}${ut(this.hass, e.entity_id) ? ` · ${ut(this.hass, e.entity_id)}` : ""}</span>
          </div>
          <button class="round close" aria-label=${c(this.hass, "close")} @click=${() => this.close()}>
            ${he(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? d`<div class="cols">
              <div class="left">${o.main}</div>
              <div class="right">${o.side}${n}${i.length ? g : a}</div>
            </div>` : d`<div class="stack">
              <div class="main-row">${o.main}${o.beside ?? g}</div>
              ${o.side}${n}${i.length ? g : a}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(e) {
    const t = pt(e), s = m(e), i = e.entity_id;
    if (t === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? c(this.hass, "turn_off") : c(this.hass, "turn_on")}
            @click=${() => ot(this.hass, e)}>
            <span>${Ke(36)}</span>
          </button>`,
        side: g
      };
    const r = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${U(e) ?? 0}
      .label=${c(this.hass, "brightness")}
      @value-changed=${(h) => St(this.hass, i, h.detail.value)}
    >${de(28)}</terral-slider>`, o = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (h) => d`<button class="chip" @click=${() => St(this.hass, i, h)}>${h} %</button>`
    )}
    </div>`, n = d`<div class="chips">
      ${Et.map(
      (h) => d`<button class="chip tinted" style="background:${h.css}" @click=${() => bt(this.hass, e, h.kelvin)}>
          ${c(this.hass, h.key)}
        </button>`
    )}
    </div>`;
    if (t === "dimmable") return { main: r, side: o };
    if (t === "temperature") {
      const h = e.attributes.min_color_temp_kelvin ?? 2e3, f = e.attributes.max_color_temp_kelvin ?? 6500, b = d`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${h}
        .max=${f}
        .value=${ct(e) ?? Math.round((h + f) / 2)}
        .label=${c(this.hass, "temperature")}
        @value-changed=${(v) => bt(this.hass, e, v.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${r}${b}</div>`, side: n } : { main: d`<div class="pair">${r}${b}</div>`, side: n };
    }
    const a = K(this.hass), l = (this.opts.favorites?.length ? this.opts.favorites : Dt.map((h) => ({ name: h.name[a], rgb: h.rgb }))).slice(0, 6), p = X(e), u = d`
      <p class="lb">${c(this.hass, "favorites")}</p>
      <div class="swatches">
        ${l.map(
      (h) => d`<button
            class="sw ${p && E(p) === E(h.rgb) ? "sel" : ""}"
            style="background:${E(h.rgb)}"
            aria-label=${h.name ?? E(h.rgb)}
            @click=${() => Qt(this.hass, i, h.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${c(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${p ? E(p) : "#ffffff"} @change=${(h) => Qt(this.hass, i, as(h.target.value))} />
      ${rs(e) ? d`<p class="lb">${c(this.hass, "temperature")}</p>${n}` : g}
    `;
    return this._wide ? { main: r, side: u } : { main: r, side: g, beside: d`<div class="beside">${u}</div>` };
  }
  _memberList(e, t) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const l of t) {
      const p = ut(this.hass, l) ?? c(this.hass, "other_area");
      i.set(p, [...i.get(p) ?? [], l]);
    }
    const r = s === "always" || s === "auto" && t.length > 8 && i.size > 1, o = t.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => kt(this.hass, e.entity_id, !0)}>${c(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => kt(this.hass, e.entity_id, !1)}>${c(this.hass, "all_off")}</button>
        </div>` : g, n = (l) => {
      const p = this.hass.states[l], u = m(p), h = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? l : l;
      return d`<div class="mr">
        <button class="mi ${u ? "on" : ""}" ?disabled=${N(p)}
          aria-label="${u ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${h}"
          @click=${() => p && ot(this.hass, p)}>${F(u, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, l]}>
          <span>${h}</span><small>${p ? this._stateText(p) : c(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, a = (l) => [...l].sort((p, u) => Number(m(this.hass.states[u])) - Number(m(this.hass.states[p])));
    return d`
      ${o}
      <p class="lb">${c(this.hass, "lights_in_group")} (${t.length})</p>
      <div class="list">
        ${r ? [...i.entries()].map(([l, p]) => {
      const u = this._openAreas.has(l), h = p.filter((f) => m(this.hass.states[f])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${h ? "on" : ""}" aria-label="${h ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${l}"
                    @click=${() => kt(this.hass, p, h === 0)}>${F(h > 0, 18)}</button>
                  <button class="mt" aria-expanded=${u} @click=${() => {
        const f = new Set(this._openAreas);
        u ? f.delete(l) : f.add(l), this._openAreas = f;
      }}>
                    <span>${l} <small>${h} ${c(this.hass, "of")} ${p.length}</small></span>${Jt(u)}
                  </button>
                </div>
                ${u ? d`<div class="inner">${p.map(n)}</div>` : g}
              </div>`;
    }) : d`<div class="box">${a(t).map(n)}</div>`}
      </div>
    `;
  }
  _info(e) {
    return d`<div class="info">
      <div><span>${c(this.hass, "last_activity")}</span><span>${Fe(this.hass, e.last_changed)}</span></div>
    </div>`;
  }
};
A.styles = D`
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
T([
  _({ attribute: !1 })
], A.prototype, "hass", 2);
T([
  _({ attribute: !1 })
], A.prototype, "opts", 2);
T([
  x()
], A.prototype, "_stack", 2);
T([
  x()
], A.prototype, "_expanded", 2);
T([
  x()
], A.prototype, "_closing", 2);
T([
  x()
], A.prototype, "_wide", 2);
T([
  x()
], A.prototype, "_openAreas", 2);
T([
  Ye("input[type=color]")
], A.prototype, "_picker", 2);
A = T([
  q("terral-light-dialog")
], A);
var ps = Object.defineProperty, us = Object.getOwnPropertyDescriptor, O = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? us(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && ps(t, s, r), r;
};
const gs = "terral-home-light";
let Y = class extends S {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const e = this._config.favorite_colors?.map((t) => Array.isArray(t) ? { rgb: t } : t);
      hs(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: e,
        groupByArea: this._config.group_by_area
      });
    }, this._toggle = (e) => {
      e.stopPropagation();
      const t = this._entity;
      t && this.hass && !N(t) && ot(this.hass, t);
    }, this._down = (e) => {
      this._held = !1, this._holdStart = { x: e.clientX, y: e.clientY }, clearTimeout(this._holdTimer);
      const t = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
      this._holdTimer = window.setTimeout(() => {
        this._held = !0;
        const s = new CustomEvent("terral-card-hold", {
          detail: t,
          bubbles: !0,
          composed: !0,
          cancelable: !0
        });
        this.dispatchEvent(s) && this._openWindow();
      }, 500);
    }, this._move = (e) => {
      this._holdStart && Math.hypot(e.clientX - this._holdStart.x, e.clientY - this._holdStart.y) > 10 && this._cancelHold();
    }, this._cancelHold = () => {
      clearTimeout(this._holdTimer), this._holdStart = void 0;
    }, this._cardClick = (e) => {
      if (this._held) {
        e.stopPropagation(), e.preventDefault(), this._held = !1;
        return;
      }
      const t = e.currentTarget;
      for (const s of e.composedPath()) {
        if (s === t) break;
        if (s instanceof HTMLElement && /^(BUTTON|INPUT|TERRAL-SLIDER|TERRAL-LIGHT-FAVS|A)$/.test(s.tagName)) return;
      }
      this._openWindow();
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
    return e ? pt(e) === "temperature" || pt(e) === "color" || z(e).length > 0 ? t : t.slice(0, 3) : t;
  }
  static getStubConfig(e, t = [], s = []) {
    return { entity: [...t, ...s].find((r) => r.startsWith("light.")) ?? Object.keys(e?.states ?? {}).find((r) => r.startsWith("light.")) ?? "light.example" };
  }
  static getConfigForm() {
    const e = (t) => c(void 0, t);
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
    return !t || !this.hass || !this._config || t.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...z(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => t.states[i] !== this.hass.states[i]);
  }
  updated(e) {
    e.has("hass") && this.hass && ds(this.hass);
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
    if (N(e)) return c(s, "unavailable");
    const i = z(e);
    if (i.length) {
      const a = i.filter((u) => m(s.states[u])).length;
      if (!a) return `${i.length} ${c(s, "lights_off")}`;
      const l = U(e), p = a === i.length && t === "onoff" ? `${c(s, "all_lit")} (${a})` : `${a} ${c(s, "of")} ${i.length} ${c(s, "lit")}`;
      return l != null && this._size !== "s11" ? `${p} · ${l} %` : p;
    }
    if (!m(e)) return c(s, "off");
    const r = [], o = U(e);
    o != null && r.push(`${o} %`);
    const n = X(e);
    if (n) {
      const a = Ct(n, K(s));
      a && r.push(a);
    } else if (t === "temperature" || t === "color") {
      const a = ct(e);
      if (a && e.attributes.color_mode === "color_temp") {
        const l = [...Et].sort((p, u) => Math.abs(p.kelvin - a) - Math.abs(u.kelvin - a))[0];
        r.push(c(s, l.key));
      }
    }
    return r.join(" · ") || c(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return g;
    const e = this._entity;
    if (!e)
      return d`<div class="card off missing"><span>${c(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const t = pt(e), s = m(e), i = N(e), r = z(e), o = fe(e, this._config.use_light_color !== !1), n = s ? `--bg:${o.bg};--fg:${o.fg};--fg2:${o.fg2};--accent:${o.accent};--fill:${o.fill}` : "";
    let a = this._size;
    a === "s42" && !this.getTerralSizes().some((u) => u.h === 4) && (a = "s22");
    const l = d`<button
      class="icon"
      aria-label="${s ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${this._name(e)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${F(s, a === "s11" ? 20 : 32)}
      ${r.length && s ? d`<span class="badge">${r.filter((u) => m(this.hass.states[u])).length}</span>` : g}
    </button>`, p = d`<div class="text">
      <span class="name">${this._name(e)}</span>
      <span class="state">${this._status(e, t)}</span>
    </div>`;
    return d`<div
      class="card ${a} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${n}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${this._name(e)}
      @click=${this._cardClick}
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >
      ${a === "s11" || a === "s21" ? d`${l}${p}` : d`<div class="head">${l}${p}${this._quickButton(e, t, a)}</div>
            ${this._body(e, t, a)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(e, t, s) {
    if (t !== "color" && t !== "temperature" || s === "s42" && !z(e).length) return g;
    const i = X(e), r = i ? Ct(i, K(this.hass)) ?? "" : "", o = t === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? E(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(n) => {
      n.stopPropagation(), this._openWindow();
    }}><i style=${o}></i>${r || (t === "color" ? c(this.hass, "more_colors") : c(this.hass, "temperature"))}</button>`;
  }
  _brightness(e, t = !1) {
    return d`<terral-slider
      class="bar ${t ? "big" : ""}"
      .value=${U(e) ?? 0}
      .label=${c(this.hass, "brightness")}
      @value-changed=${(s) => St(this.hass, e.entity_id, s.detail.value)}
    >${de(18)}</terral-slider>`;
  }
  _body(e, t, s) {
    const i = z(e);
    if (s === "s42" && i.length) {
      const o = [...i].sort((p, u) => Number(m(this.hass.states[u])) - Number(m(this.hass.states[p]))), n = t === "onoff" ? 5 : 4, a = o.length > n ? o.slice(0, n - 1) : o, l = o.length - a.length;
      return d`
        ${t !== "onoff" ? this._brightness(e) : g}
        <div class="members">
          ${a.map((p) => {
        const u = this.hass.states[p], h = m(u), f = u ? this.hass.formatEntityName?.(u) ?? u.attributes.friendly_name ?? p : p;
        return d`<div class="mr">
              <button class="mi ${h ? "lit" : ""}" ?disabled=${N(u)} aria-label="${h ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${f}"
                @click=${(b) => {
          b.stopPropagation(), u && ot(this.hass, u);
        }}>${F(h, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${f}</span><small>${u ? m(u) ? U(u) != null ? `${U(u)} %` : c(this.hass, "on") : c(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${l > 0 ? d`<button class="morebtn" @click=${this._openWindow}>+ ${l} ${c(this.hass, "more")}</button>` : g}
        </div>
      `;
    }
    if (t === "onoff")
      return i.length ? d`<div class="tags">
          ${i.slice(0, 4).map((o) => {
        const n = this.hass.states[o], a = n ? this.hass.formatEntityName?.(n) ?? n.attributes.friendly_name ?? o : o;
        return d`<span class="tag"><i class=${m(n) ? "lit" : ""}></i>${a}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${m(e) ? c(this.hass, "on") : c(this.hass, "off")}</b>${new Date(e.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(e);
    if (t === "temperature") {
      const o = e.attributes.min_color_temp_kelvin ?? 2e3, n = e.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${c(this.hass, "brightness")}</p>
        ${this._brightness(e, !0)}
        <p class="lbl">${c(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${o} .max=${n} .value=${ct(e) ?? 3500}
          .label=${c(this.hass, "temperature")}
          @value-changed=${(a) => bt(this.hass, e, a.detail.value)}></terral-slider>
        <div class="chips">
          ${Et.map((a) => d`<button class="chip" style="background:${a.css}" @click=${(l) => {
        l.stopPropagation(), bt(this.hass, e, a.kelvin);
      }}>${c(this.hass, a.key)}</button>`)}
        </div>
      `;
    }
    const r = this._config?.favorite_colors?.map((o) => Array.isArray(o) ? o : o.rgb) ?? void 0;
    return d`
      <p class="lbl">${c(this.hass, "brightness")}</p>
      ${this._brightness(e, !0)}
      <p class="lbl">${c(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${e} .colors=${r}></terral-light-favs>
      <button class="pb wide" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${c(this.hass, "more_colors")}</button>
    `;
  }
};
Y.styles = D`
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
O([
  _({ attribute: !1 })
], Y.prototype, "hass", 2);
O([
  _({ type: Boolean })
], Y.prototype, "preview", 2);
O([
  x()
], Y.prototype, "_config", 2);
O([
  x()
], Y.prototype, "_size", 2);
Y = O([
  q(gs)
], Y);
let J = class extends S {
  render() {
    if (!this.hass || !this.entity) return g;
    const e = K(this.hass), t = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: E(i) })) : fs[e] ??= bs(e), s = X(this.entity);
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
J.styles = D`
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
O([
  _({ attribute: !1 })
], J.prototype, "hass", 2);
O([
  _({ attribute: !1 })
], J.prototype, "entity", 2);
O([
  _({ attribute: !1 })
], J.prototype, "colors", 2);
J = O([
  q("terral-light-favs")
], J);
const fs = {}, bs = (e) => Dt.map((t) => ({ rgb: t.rgb, name: t.name[e] }));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _s = { CHILD: 2 }, ms = (e) => (...t) => ({ _$litDirective$: e, values: t });
let xs = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, s, i) {
    this._$Ct = t, this._$AM = s, this._$Ci = i;
  }
  _$AS(t, s) {
    return this.update(t, s);
  }
  update(t, s) {
    return this.render(...s);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: vs } = je, ee = (e) => e, se = () => document.createComment(""), it = (e, t, s) => {
  const i = e._$AA.parentNode, r = t === void 0 ? e._$AB : t._$AA;
  if (s === void 0) {
    const o = i.insertBefore(se(), r), n = i.insertBefore(se(), r);
    s = new vs(o, n, e, e.options);
  } else {
    const o = s._$AB.nextSibling, n = s._$AM, a = n !== e;
    if (a) {
      let l;
      s._$AQ?.(e), s._$AM = e, s._$AP !== void 0 && (l = e._$AU) !== n._$AU && s._$AP(l);
    }
    if (o !== r || a) {
      let l = s._$AA;
      for (; l !== o; ) {
        const p = ee(l).nextSibling;
        ee(i).insertBefore(l, r), l = p;
      }
    }
  }
  return s;
}, H = (e, t, s = e) => (e._$AI(t, s), e), $s = {}, ys = (e, t = $s) => e._$AH = t, ws = (e) => e._$AH, At = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = (e, t, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let r = t; r <= s; r++) i.set(e[r], r);
  return i;
}, ks = ms(class extends xs {
  constructor(e) {
    if (super(e), e.type !== _s.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, s) {
    let i;
    s === void 0 ? s = t : t !== void 0 && (i = t);
    const r = [], o = [];
    let n = 0;
    for (const a of e) r[n] = i ? i(a, n) : n, o[n] = s(a, n), n++;
    return { values: o, keys: r };
  }
  render(e, t, s) {
    return this.dt(e, t, s).values;
  }
  update(e, [t, s, i]) {
    const r = ws(e), { values: o, keys: n } = this.dt(t, s, i);
    if (!Array.isArray(r)) return this.ut = n, o;
    const a = this.ut ??= [], l = [];
    let p, u, h = 0, f = r.length - 1, b = 0, v = o.length - 1;
    for (; h <= f && b <= v; ) if (r[h] === null) h++;
    else if (r[f] === null) f--;
    else if (a[h] === n[b]) l[b] = H(r[h], o[b]), h++, b++;
    else if (a[f] === n[v]) l[v] = H(r[f], o[v]), f--, v--;
    else if (a[h] === n[v]) l[v] = H(r[h], o[v]), it(e, l[v + 1], r[h]), h++, v--;
    else if (a[f] === n[b]) l[b] = H(r[f], o[b]), it(e, r[h], r[f]), f--, b++;
    else if (p === void 0 && (p = ie(n, b, v), u = ie(a, h, f)), p.has(a[h])) if (p.has(a[f])) {
      const M = u.get(n[b]), $t = M !== void 0 ? r[M] : null;
      if ($t === null) {
        const Rt = it(e, r[h]);
        H(Rt, o[b]), l[b] = Rt;
      } else l[b] = H($t, o[b]), it(e, r[h], $t), r[M] = null;
      b++;
    } else At(r[f]), f--;
    else At(r[h]), h++;
    for (; b <= v; ) {
      const M = it(e, l[v + 1]);
      H(M, o[b]), l[b++] = M;
    }
    for (; h <= f; ) {
      const M = r[h++];
      M !== null && At(M);
    }
    return this.ut = n, ys(e, l), B;
  }
});
function As(e, t, s) {
  e.dispatchEvent(
    new CustomEvent(t, { detail: s, bubbles: !0, composed: !0 })
  );
}
const Es = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function Ss(e) {
  return Es[e];
}
var Cs = Object.defineProperty, jt = (e, t, s, i) => {
  for (var r = void 0, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = n(t, s, r) || r);
  return r && Cs(t, s, r), r;
};
const Ut = class Ut extends S {
  constructor() {
    super(...arguments), this._wide = window.matchMedia("(min-width: 600px)").matches, this._closing = !1, this._mq = window.matchMedia("(min-width: 600px)"), this._onMq = (t) => this._wide = t.matches, this._onKey = (t) => {
      t.key === "Escape" && this.close();
    }, this._grabDown = (t) => {
      this._grabY = t.clientY, t.currentTarget.setPointerCapture(t.pointerId);
    }, this._grabUp = (t) => {
      if (this._grabY == null) return;
      const s = t.clientY - this._grabY;
      this._grabY = void 0, s > 60 && this.close();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = be(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.();
  }
  close() {
    this._closing || (this._closing = !0, setTimeout(() => this.remove(), 180));
  }
  render() {
    const t = `${this._wide ? "modal" : "sheet"} ${this._closing ? "closing" : ""}`;
    return d`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${t}" role="dialog" aria-modal="true" aria-label=${this.heading}>
        ${this._wide ? g : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        <header>
          <h2>${this.heading}</h2>
          <button class="close" aria-label=${c(this.hass, "close")} @click=${() => this.close()}>${he(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
Ut.styles = D`
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
    .modal .close {
      width: 52px;
      height: 52px;
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
let P = Ut;
jt([
  _({ attribute: !1 })
], P.prototype, "hass");
jt([
  x()
], P.prototype, "_wide");
jt([
  x()
], P.prototype, "_closing");
var Ms = Object.defineProperty, zs = Object.getOwnPropertyDescriptor, vt = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? zs(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Ms(t, s, r), r;
};
let Z = class extends P {
  constructor() {
    super(...arguments), this.existing = /* @__PURE__ */ new Set(), this._q = "";
  }
  get heading() {
    return c(this.hass, "add_accessory");
  }
  _rows() {
    const e = this.hass, t = [];
    for (const [i, r] of Object.entries(e.states)) {
      if (!i.startsWith("light.")) continue;
      const o = e.entities?.[i];
      o?.hidden || o?.entity_category || t.push({
        id: i,
        name: e.formatEntityName?.(r) || r.attributes.friendly_name || i,
        area: ut(e, i) ?? c(e, "other_area"),
        group: ge(r),
        on: m(r)
      });
    }
    const s = this._q.trim().toLowerCase();
    return t.filter((i) => !s || i.name.toLowerCase().includes(s) || i.area.toLowerCase().includes(s)).sort((i, r) => Number(r.group) - Number(i.group) || i.area.localeCompare(r.area) || i.name.localeCompare(r.name));
  }
  renderContent() {
    const e = this._rows(), t = e.filter((i) => i.group), s = /* @__PURE__ */ new Map();
    for (const i of e.filter((r) => !r.group))
      s.has(i.area) || s.set(i.area, []), s.get(i.area).push(i);
    return d`
      <label class="search">
        ${Qe()}
        <input
          type="search"
          placeholder=${c(this.hass, "search_lights")}
          .value=${this._q}
          @input=${(i) => this._q = i.target.value}
        />
      </label>
      <div class="scroll">
        ${e.length ? g : d`<p class="empty">${c(this.hass, "no_lights")}</p>`}
        ${t.length ? this._section(c(this.hass, "light_groups"), t) : g}
        ${[...s].map(([i, r]) => this._section(i, r))}
      </div>
    `;
  }
  _section(e, t) {
    return d`<section>
      <h3>${e}</h3>
      <div class="list">
        ${t.map((s) => {
      const i = this.existing.has(s.id);
      return d`<button class="row" ?disabled=${i} @click=${() => this._pick(s.id)}>
            <span class="ic ${s.on ? "on" : ""}">${F(s.on, 20)}</span>
            <span class="nm">${s.name}${s.group ? d`<small>${c(this.hass, "group")}</small>` : g}</span>
            ${i ? d`<span class="added">${ts(16)} ${c(this.hass, "added")}</span>` : g}
          </button>`;
    })}
      </div>
    </section>`;
  }
  _pick(e) {
    this.onPick?.(e), this.close();
  }
};
Z.styles = [
  P.styles,
  D`
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
        min-height: 56px;
        box-sizing: border-box;
      }
      .row + .row {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .row:active:not(:disabled) {
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
      .ic.on {
        background: #f3b24a;
        color: #fff;
      }
      .nm {
        flex: 1;
        min-width: 0;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        flex-direction: column;
      }
      .nm small {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .added {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }
      .row:disabled .ic,
      .row:disabled .nm {
        opacity: 0.55;
      }
      .empty {
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        margin: 30px 0;
      }
    `
];
vt([
  _({ attribute: !1 })
], Z.prototype, "existing", 2);
vt([
  _({ attribute: !1 })
], Z.prototype, "onPick", 2);
vt([
  x()
], Z.prototype, "_q", 2);
Z = vt([
  q("terral-add-sheet")
], Z);
function Ps(e, t, s) {
  const i = document.createElement("terral-add-sheet");
  return i.hass = e, i.existing = t, i.onPick = s, document.body.appendChild(i), i;
}
var Ts = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, Ht = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Os(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Ts(t, s, r), r;
};
let ht = class extends P {
  constructor() {
    super(...arguments), this.version = "";
  }
  get heading() {
    return "Terral Home";
  }
  renderContent() {
    return d`
      <div class="list">
        <button class="row" @click=${() => {
      this.onEdit?.(), this.close();
    }}>
          <span class="ic">${Ge()}</span><span class="nm">${c(this.hass, "edit_home")}</span>
        </button>
        <button class="row" disabled>
          <span class="ic">${es()}</span>
          <span class="nm">${c(this.hass, "terral_settings")}<small>${c(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
ht.styles = [
  P.styles,
  D`
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
Ht([
  _({ attribute: !1 })
], ht.prototype, "onEdit", 2);
Ht([
  _()
], ht.prototype, "version", 2);
ht = Ht([
  q("terral-menu-sheet")
], ht);
function Ls(e, t, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = e, i.version = t, i.onEdit = s, document.body.appendChild(i), i;
}
const _e = "0.3.2";
var Ds = Object.defineProperty, js = Object.getOwnPropertyDescriptor, y = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? js(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Ds(t, s, r), r;
};
const Hs = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], Us = 0.85, Rs = "#453f77", Ns = "#2f5f89", Is = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let $ = class extends S {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (e) => {
      e.key === "Escape" && this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || Ps(this.hass, new Set(this._cards.map((e) => e.entity)), (e) => {
        const t = this.hass?.states[e], s = { id: Is(), type: "light", entity: e, w: t && ge(t) ? 2 : 1, h: 2 };
        this._save([...this._cards, s]);
      });
    }, this._menu = () => {
      this.hass && Ls(this.hass, this.panel?.config?.version ?? _e, () => this._edit = !0);
    }, this._onHold = (e) => {
      const t = e.detail, s = e.composedPath().find((i) => i instanceof HTMLElement && i.dataset.i != null);
      s && (e.preventDefault(), this._edit = !0, navigator.vibrate?.(12), this._startDrag(Number(s.dataset.i), t.x, t.y));
    }, this._dragMove = (e) => {
      if (this._dragFrom == null || !this._dragStart) return;
      this._dragDx = e.clientX - this._dragStart.x, this._dragDy = e.clientY - this._dragStart.y;
      const t = this.shadowRoot?.elementsFromPoint(e.clientX, e.clientY).find((s) => s instanceof HTMLElement && s.dataset.i != null && s.dataset.i !== String(this._dragFrom));
      t && (this._dropAt = Number(t.dataset.i)), this._autoScroll(e.clientY);
    }, this._dragUp = () => {
      const e = this._dragFrom, t = this._dropAt, s = Math.hypot(this._dragDx, this._dragDy) > 8;
      if (this._endDrag(), e != null && t != null && e !== t && s) {
        const i = [...this._cards], [r] = i.splice(e, 1);
        i.splice(t, 0, r), this._save(i);
      }
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver(([e]) => this._measure(e.contentRect.width)), this._ro.observe(this), this._paintChrome(!0), window.addEventListener("keydown", this._onKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect(), window.removeEventListener("keydown", this._onKey), this._paintChrome(!1), this._unsub?.then((e) => e()).catch(() => {
    }), this._unsub = void 0, this._loading = !1, this._endDrag();
  }
  firstUpdated() {
    this.renderRoot.querySelector(".grid")?.addEventListener(
      "touchmove",
      (e) => {
        this._dragFrom != null && e.cancelable && e.preventDefault();
      },
      { passive: !1 }
    );
  }
  updated(e) {
    if (e.has("hass") && this.hass) {
      !this._layout && !this._loading && this._load();
      for (const t of this._els.values()) t.hass = this.hass;
    }
  }
  _paintChrome(e) {
    const t = document.querySelector('meta[name="theme-color"]'), s = [document.documentElement, document.body];
    if (e) {
      if (this._chromeSaved) return;
      this._chromeSaved = { meta: t?.content ?? null, styles: s.map((i) => [i, i.getAttribute("style") ?? ""]) };
      for (const i of s)
        i.style.backgroundColor = Ns, i.style.backgroundImage = "linear-gradient(90deg, #53407e, #423f76 50%, #3b4074), linear-gradient(90deg, #2f688c, #2e5a86)", i.style.backgroundSize = "100% 50%, 100% 100%", i.style.backgroundRepeat = "no-repeat", i.style.backgroundPosition = "top, bottom", i.style.backgroundAttachment = "fixed";
      t && (t.content = Rs);
    } else if (this._chromeSaved) {
      for (const [i, r] of this._chromeSaved.styles)
        r ? i.setAttribute("style", r) : i.removeAttribute("style");
      t && this._chromeSaved.meta != null && (t.content = this._chromeSaved.meta), this._chromeSaved = void 0;
    }
  }
  // ---- Data ---------------------------------------------------------------
  async _load() {
    if (this.hass) {
      this._loading = !0;
      try {
        this._layout = await this.hass.callWS({ type: "terral_home/layout/get" }), this._error = void 0, this._unsub = this.hass.connection.subscribeMessage(
          (e) => {
            !this._pending && this._dragFrom == null && (this._layout = e);
          },
          { type: "terral_home/layout/subscribe" }
        );
      } catch (e) {
        this._error = e?.message ?? String(e), this._loading = !1;
      }
    }
  }
  async _save(e) {
    if (this.hass) {
      this._layout = { ...this._layout ?? {}, cards: e }, this._pending++;
      try {
        await this.hass.callWS({ type: "terral_home/layout/save", layout: this._layout }), this._error = void 0;
      } catch (t) {
        this._error = t?.message ?? String(t);
      } finally {
        this._pending--;
      }
    }
  }
  get _cards() {
    return this._layout?.cards ?? [];
  }
  // ---- Layout -------------------------------------------------------------
  _measure(e) {
    const t = e < 600 ? 16 : 24, s = e < 600 ? 10 : 14, i = Math.min(e, 1180) - 2 * t, r = e < 600 ? 2 : 4, o = (i - s * (r - 1)) / r, n = window.__terralRowRatio ?? Us, a = Math.max(48, Math.round((o - s) / 2 * n));
    this._colW = o, this._gap = s, r !== this._cols && (this._cols = r), a !== this._rowH && (this._rowH = a);
  }
  _sizeOf(e) {
    const t = e.h === 1 || e.h === 4 ? e.h : 2, s = t === 4 || e.w === 2 ? 2 : 1;
    return { w: Math.min(s, this._cols), h: t };
  }
  _element(e) {
    let t = this._els.get(e.id);
    t || (t = document.createElement("terral-home-light"), this._els.set(e.id, t));
    const { id: s, type: i, w: r, h: o, ...n } = e, a = { ...n, type: "custom:terral-home-light", view_layout: { terral: { w: r, h: o } } }, l = JSON.stringify(a);
    if (t.dataset.cfg !== l) {
      try {
        t.setConfig(a);
      } catch (p) {
        console.warn("Terral Home:", p);
      }
      t.dataset.cfg = l;
    }
    return this.hass && t.hass !== this.hass && (t.hass = this.hass), t;
  }
  _remove(e) {
    const t = [...this._cards], [s] = t.splice(e, 1);
    s && this._els.delete(s.id), this._save(t);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(e, t) {
    e.preventDefault(), e.stopPropagation();
    const s = e.currentTarget, i = s.closest(".cell").getBoundingClientRect(), r = this._cards[t], o = (this._els.get(r.id)?.getTerralSizes?.() ?? Hs).filter((a) => a.w <= this._cols);
    this._resizeOrigin = { left: i.left, top: i.top, sizes: o };
    const n = this._sizeOf(r);
    this._resize = { i: t, w: n.w, h: n.h }, s.setPointerCapture(e.pointerId);
  }
  _resizeMove(e) {
    const t = this._resizeOrigin;
    if (!this._resize || !t) return;
    const s = (e.clientX - t.left + this._gap) / (this._colW + this._gap), i = (e.clientY - t.top + this._gap) / (this._rowH + this._gap);
    let r = t.sizes[0], o = 1 / 0;
    for (const n of t.sizes) {
      const a = (n.w - s) ** 2 + (n.h - i) ** 2;
      a < o && ([r, o] = [n, a]);
    }
    (r.w !== this._resize.w || r.h !== this._resize.h) && (this._resize = { ...this._resize, w: r.w, h: r.h }, navigator.vibrate?.(6));
  }
  _resizeUp() {
    const e = this._resize;
    if (this._resize = void 0, this._resizeOrigin = void 0, !e) return;
    const t = this._cards[e.i], s = this._sizeOf(t);
    if (s.w === e.w && s.h === e.h) return;
    const i = [...this._cards];
    i[e.i] = { ...t, w: e.w, h: e.h }, this._save(i);
  }
  _span(e, t) {
    return e * t + (e - 1) * this._gap;
  }
  _overlayDown(e, t) {
    e.target.closest("button") || (e.preventDefault(), this._startDrag(t, e.clientX, e.clientY));
  }
  _startDrag(e, t, s) {
    this._dragFrom = e, this._dropAt = e, this._dragStart = { x: t, y: s }, this._dragDx = this._dragDy = 0, window.addEventListener("pointermove", this._dragMove), window.addEventListener("pointerup", this._dragUp), window.addEventListener("pointercancel", this._dragUp);
  }
  _endDrag() {
    window.removeEventListener("pointermove", this._dragMove), window.removeEventListener("pointerup", this._dragUp), window.removeEventListener("pointercancel", this._dragUp), this._dragFrom = this._dropAt = void 0, this._dragStart = void 0, this._dragDx = this._dragDy = 0;
  }
  /** Scroll when dragging near the top or bottom edge. */
  _autoScroll(e) {
    const t = this.renderRoot.querySelector(".scroller");
    if (!t || !this._dragStart) return;
    const s = t.getBoundingClientRect(), i = e < s.top + 70 ? -12 : e > s.bottom - 70 ? 12 : 0;
    if (!i) return;
    const r = t.scrollTop;
    t.scrollTop += i;
    const o = t.scrollTop - r;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - o }, this._dragDy += o;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const e = this._cards, t = this._edit, s = !!this._layout;
    return d`
      <div class="scroller" style="background:${Ss("crepusculo")}" @terral-card-hold=${this._onHold}>
        <div class="wrap">
          <div class="top">
            <button class="glass round" aria-label=${c(this.hass, "menu")} @click=${() => As(this, "hass-toggle-menu")}>
              ${Xe()}
            </button>
            <span class="spacer"></span>
            ${t ? d`<div class="glass pill">
                  <button class="pbtn" aria-label=${c(this.hass, "add_accessory")} @click=${this._add}>${wt(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${c(this.hass, "done")}</button>
                </div>` : d`<div class="glass pill">
                  <button class="pbtn" aria-label=${c(this.hass, "add_accessory")} ?disabled=${!s} @click=${this._add}>${wt(22)}</button>
                  <button class="pbtn" aria-label=${c(this.hass, "more_options")} @click=${this._menu}>${Je(22)}</button>
                </div>`}
          </div>
          <h1>${c(this.hass, "home_title")}</h1>
          ${this._error ? d`<p class="notice">${c(this.hass, "panel_error")} (${this._error})</p>` : g}
          <div
            class="grid ${t ? "editing" : ""}"
            style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
          >
            ${ks(e, (i) => i.id, (i, r) => this._cell(i, r, t))}
            ${s && (t || !e.length) ? d`<button class="add" style="grid-row:span 2" @click=${this._add}>
                  <span class="addic">${wt(26)}</span><span>${c(this.hass, "add_accessory")}</span>
                </button>` : g}
          </div>
        </div>
      </div>
    `;
  }
  _cell(e, t, s) {
    const { w: i, h: r } = this._sizeOf(e), o = this._dragFrom === t, n = this._dropAt === t && this._dragFrom != null && !o, a = `grid-column:span ${i};grid-row:span ${r};--d:${t % 5 * -0.07}s;${o ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return d`<div class="cell ${o ? "dragging" : ""} ${n ? "target" : ""}" data-i=${t} style=${a}>
      ${this._element(e)}
      ${s ? d`<div class="overlay" @pointerdown=${(l) => this._overlayDown(l, t)}>
            <button class="del" aria-label=${c(this.hass, "delete")} @click=${() => this._remove(t)}>${Ze()}</button>
            <button
              class="corner"
              aria-label=${c(this.hass, "resize")}
              @pointerdown=${(l) => this._resizeDown(l, t)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>
          </div>` : g}
      ${this._resize?.i === t ? d`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>` : g}
    </div>`;
  }
};
$.styles = D`
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
y([
  _({ attribute: !1 })
], $.prototype, "hass", 2);
y([
  _({ type: Boolean })
], $.prototype, "narrow", 2);
y([
  _({ attribute: !1 })
], $.prototype, "route", 2);
y([
  _({ attribute: !1 })
], $.prototype, "panel", 2);
y([
  x()
], $.prototype, "_layout", 2);
y([
  x()
], $.prototype, "_error", 2);
y([
  x()
], $.prototype, "_edit", 2);
y([
  x()
], $.prototype, "_cols", 2);
y([
  x()
], $.prototype, "_rowH", 2);
y([
  x()
], $.prototype, "_dragFrom", 2);
y([
  x()
], $.prototype, "_dropAt", 2);
y([
  x()
], $.prototype, "_dragDx", 2);
y([
  x()
], $.prototype, "_dragDy", 2);
y([
  x()
], $.prototype, "_resize", 2);
$ = y([
  q("terral-home-panel")
], $);
const _t = window;
_t.customCards = _t.customCards || [];
_t.customCards.some((e) => e.type === "terral-home-light") || _t.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (e, t) => t.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: t } } : null
});
console.info(
  `%c TERRAL HOME %c v${_e} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  _e as VERSION
};
