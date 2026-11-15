/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = globalThis, Tt = gt.ShadowRoot && (gt.ShadyCSS === void 0 || gt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ot = Symbol(), qt = /* @__PURE__ */ new WeakMap();
let he = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== Ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Tt && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = qt.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && qt.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ae = (t) => new he(typeof t == "string" ? t : t + "", void 0, Ot), T = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new he(s, t, Ot);
}, Ce = (t, e) => {
  if (Tt) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), r = gt.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, t.appendChild(i);
  }
}, Yt = Tt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Ae(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: Ee, getOwnPropertyDescriptor: Me, getOwnPropertyNames: ze, getOwnPropertySymbols: Pe, getPrototypeOf: Te } = Object, $t = globalThis, Wt = $t.trustedTypes, Oe = Wt ? Wt.emptyScript : "", De = $t.reactiveElementPolyfillSupport, rt = (t, e) => t, _t = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Oe : null;
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
} }, Dt = (t, e) => !Se(t, e), Vt = { attribute: !0, type: String, converter: _t, reflect: !1, useDefault: !1, hasChanged: Dt };
Symbol.metadata ??= Symbol("metadata"), $t.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let W = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Vt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, s);
      r !== void 0 && Ee(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: r, set: o } = Me(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: r, set(n) {
      const a = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Vt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(rt("elementProperties"))) return;
    const e = Te(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(rt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(rt("properties"))) {
      const s = this.properties, i = [...ze(s), ...Pe(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) s.unshift(Yt(r));
    } else e !== void 0 && s.push(Yt(e));
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
    return Ce(e, this.constructor.elementStyles), e;
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
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : _t).toAttribute(s, i.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : _t;
      this._$Em = r;
      const a = n.fromAttribute(s, o.type);
      this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? Dt)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, a = this[r];
        n !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
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
W.elementStyles = [], W.shadowRootOptions = { mode: "open" }, W[rt("elementProperties")] = /* @__PURE__ */ new Map(), W[rt("finalized")] = /* @__PURE__ */ new Map(), De?.({ ReactiveElement: W }), ($t.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = globalThis, Ft = (t) => t, bt = Lt.trustedTypes, Kt = bt ? bt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, de = "$lit$", L = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + L, Le = `<${pe}>`, B = document, at = () => B.createComment(""), lt = (t) => t === null || typeof t != "object" && typeof t != "function", jt = Array.isArray, je = (t) => jt(t) || typeof t?.[Symbol.iterator] == "function", At = `[ 	
\f\r]`, tt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Xt = /-->/g, Gt = />/g, H = RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Qt = /'/g, Jt = /"/g, ue = /^(?:script|style|textarea|title)$/i, ge = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), h = ge(1), w = ge(2), q = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Zt = /* @__PURE__ */ new WeakMap(), U = B.createTreeWalker(B, 129);
function fe(t, e) {
  if (!jt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Kt !== void 0 ? Kt.createHTML(e) : e;
}
const He = (t, e) => {
  const s = t.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = tt;
  for (let a = 0; a < s; a++) {
    const l = t[a];
    let p, u, d = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, u = n.exec(l), u !== null); ) f = n.lastIndex, n === tt ? u[1] === "!--" ? n = Xt : u[1] !== void 0 ? n = Gt : u[2] !== void 0 ? (ue.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = H) : u[3] !== void 0 && (n = H) : n === H ? u[0] === ">" ? (n = r ?? tt, d = -1) : u[1] === void 0 ? d = -2 : (d = n.lastIndex - u[2].length, p = u[1], n = u[3] === void 0 ? H : u[3] === '"' ? Jt : Qt) : n === Jt || n === Qt ? n = H : n === Xt || n === Gt ? n = tt : (n = H, r = void 0);
    const _ = n === H && t[a + 1].startsWith("/>") ? " " : "";
    o += n === tt ? l + Le : d >= 0 ? (i.push(p), l.slice(0, d) + de + l.slice(d) + L + _) : l + L + (d === -2 ? a : _);
  }
  return [fe(t, o + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class ct {
  constructor({ strings: e, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const a = e.length - 1, l = this.parts, [p, u] = He(e, s);
    if (this.el = ct.createElement(p, i), U.currentNode = this.el.content, s === 2 || s === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = U.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(de)) {
          const f = u[n++], _ = r.getAttribute(d).split(L), $ = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: o, name: $[2], strings: _, ctor: $[1] === "." ? Ie : $[1] === "?" ? Ue : $[1] === "@" ? Ne : yt }), r.removeAttribute(d);
        } else d.startsWith(L) && (l.push({ type: 6, index: o }), r.removeAttribute(d));
        if (ue.test(r.tagName)) {
          const d = r.textContent.split(L), f = d.length - 1;
          if (f > 0) {
            r.textContent = bt ? bt.emptyScript : "";
            for (let _ = 0; _ < f; _++) r.append(d[_], at()), U.nextNode(), l.push({ type: 2, index: ++o });
            r.append(d[f], at());
          }
        }
      } else if (r.nodeType === 8) if (r.data === pe) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(L, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += L.length - 1;
      }
      o++;
    }
  }
  static createElement(e, s) {
    const i = B.createElement("template");
    return i.innerHTML = e, i;
  }
}
function F(t, e, s = t, i) {
  if (e === q) return e;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = lt(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (e = F(t, r._$AS(t, e.values), r, i)), e;
}
class Re {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (e?.creationScope ?? B).importNode(s, !0);
    U.currentNode = r;
    let o = U.nextNode(), n = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let p;
        l.type === 2 ? p = new Z(o, o.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (p = new Be(o, this, e)), this._$AV.push(p), l = i[++a];
      }
      n !== l?.index && (o = U.nextNode(), n++);
    }
    return U.currentNode = B, r;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, r) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = F(this, e, s), lt(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== q && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : je(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && lt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(B.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = ct.createElement(fe(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const o = new Re(r, this), n = o.u(this.options);
      o.p(s), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let s = Zt.get(e.strings);
    return s === void 0 && Zt.set(e.strings, s = new ct(e)), s;
  }
  k(e) {
    jt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const o of e) r === s.length ? s.push(i = new Z(this.O(at()), this.O(at()), this, this.options)) : i = s[r], i._$AI(o), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = Ft(e).nextSibling;
      Ft(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class yt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, r, o) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(e, s = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = F(this, e, s, 0), n = !lt(e) || e !== this._$AH && e !== q, n && (this._$AH = e);
    else {
      const a = e;
      let l, p;
      for (e = o[0], l = 0; l < o.length - 1; l++) p = F(this, a[i + l], s, l), p === q && (p = this._$AH[l]), n ||= !lt(p) || p !== this._$AH[l], p === g ? e = g : e !== g && (e += (p ?? "") + o[l + 1]), this._$AH[l] = p;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ie extends yt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class Ue extends yt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class Ne extends yt {
  constructor(e, s, i, r, o) {
    super(e, s, i, r, o), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = F(this, e, s, 0) ?? g) === q) return;
    const i = this._$AH, r = e === g && i !== g || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== g && (i === g || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Be {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    F(this, e);
  }
}
const qe = { I: Z }, Ye = Lt.litHtmlPolyfillSupport;
Ye?.(ct, Z), (Lt.litHtmlVersions ??= []).push("3.3.3");
const We = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = r = new Z(e.insertBefore(at(), o), o, void 0, s ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = globalThis;
let E = class extends W {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = We(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return q;
  }
};
E._$litElement$ = !0, E.finalized = !0, Ht.litElementHydrateSupport?.({ LitElement: E });
const Ve = Ht.litElementPolyfillSupport;
Ve?.({ LitElement: E });
(Ht.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = { attribute: !0, type: String, converter: _t, reflect: !1, hasChanged: Dt }, Ke = (t = Fe, e, s) => {
  const { kind: i, metadata: r } = s;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(s.name, t), i === "accessor") {
    const { name: n } = s;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(n, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, t, a), a;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(a) {
      const l = this[n];
      e.call(this, a), this.requestUpdate(n, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function b(t) {
  return (e, s) => typeof s == "object" ? Ke(t, e, s) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(t) {
  return b({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xe = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ge(t, e) {
  return (s, i, r) => {
    const o = (n) => n.renderRoot?.querySelector(t) ?? null;
    return Xe(s, i, { get() {
      return o(this);
    } });
  };
}
const Qe = {
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
}, Je = {
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
function K(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function c(t, e, s) {
  let i = (K(t) === "es" ? Qe : Je)[e] ?? e;
  if (s) for (const [r, o] of Object.entries(s)) i = i.replace(`{${r}}`, String(o));
  return i;
}
function Ze(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return c(t, "just_now");
  if (s < 60) return c(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? c(t, "h_ago", { n: i }) : c(t, "days_ago", { n: Math.round(i / 24) });
}
const ts = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", V = (t, e = 24) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${ts} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, es = (t = 24) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, _e = (t = 18) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, be = (t = 18) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, te = (t, e = 16) => w`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, ss = (t = 20) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, pt = (t = 20) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, is = (t = 18) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, rs = (t = 20) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, ee = (t = 16) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, os = (t = 18) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, ns = (t = 18) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, as = (t = 20) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, ls = (t = 26) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, cs = (t = 20) => w`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`;
var hs = Object.defineProperty, ds = Object.getOwnPropertyDescriptor, M = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ds(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && hs(e, s, r), r;
};
let k = class extends E {
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
      const r = Math.max(this.min, Math.min(this.max, Math.round(this.value + (s ? e : -e))));
      this._commit(r);
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
    return h`
      ${e ? h`<div class="fill" style=${this.vertical ? `height:${t}%` : `width:${t}%`}></div>` : h`<div class="thumb" style=${this.vertical ? `bottom:${t}%` : `left:${t}%`}></div>`}
      <div class="label">
        <slot></slot>
        ${this.showValue ? h`<span>${this._shown}${this.suffix ? h`&nbsp;${this.suffix}` : g}</span>` : g}
      </div>
    `;
  }
};
k.styles = T`
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
M([
  b({ type: Number })
], k.prototype, "value", 2);
M([
  b({ type: Number })
], k.prototype, "min", 2);
M([
  b({ type: Number })
], k.prototype, "max", 2);
M([
  b({ type: Boolean, reflect: !0 })
], k.prototype, "vertical", 2);
M([
  b()
], k.prototype, "mode", 2);
M([
  b()
], k.prototype, "label", 2);
M([
  b()
], k.prototype, "suffix", 2);
M([
  b({ type: Boolean, attribute: "show-value" })
], k.prototype, "showValue", 2);
M([
  x()
], k.prototype, "_drag", 2);
k = M([
  j("terral-slider")
], k);
const me = ["hs", "rgb", "rgbw", "rgbww", "xy"], Rt = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], Mt = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function xe(t) {
  return t.attributes.supported_color_modes ?? [];
}
function ft(t) {
  const e = xe(t);
  return e.some((s) => me.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function ps(t) {
  return xe(t).includes("color_temp");
}
function m(t) {
  return t?.state === "on";
}
function N(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function I(t) {
  const e = t.attributes.brightness;
  if (!(!m(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function P(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function ve(t) {
  return P(t).length > 0;
}
function ht(t) {
  return t.attributes.color_temp_kelvin;
}
function X(t) {
  if (!m(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !me.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const se = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, et = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), st = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, us = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, gs = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function $e(t, e) {
  if (!e) return se;
  const s = X(t);
  if (!s) {
    const o = ht(t);
    return o && t.attributes.color_mode === "color_temp" && o >= 4500 ? us : se;
  }
  const i = [255, 255, 255], r = gs(s) > 0.75 ? et(s, [40, 50, 80], 0.45) : s;
  return {
    bg: st(et(s, i, 0.84), 0.95),
    fg: st(et(s, [10, 10, 20], 0.82)),
    fg2: st(et(s, [20, 10, 30], 0.72)),
    accent: st(r),
    fill: st(et(r, i, 0.35))
  };
}
function ot(t, e) {
  return t.callService("light", m(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function Ct(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function zt(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function mt(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, r = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(r, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function ie(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function fs(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function S(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function Pt(t, e) {
  let s;
  for (const i of Rt) {
    const r = i.rgb.reduce((o, n, a) => o + (n - t[a]) ** 2, 0);
    (!s || r < s.d) && (s = { d: r, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function nt(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function re(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const r = getComputedStyle(i).overflowY;
    if ((r === "auto" || r === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function ye(t) {
  let e = 0;
  const s = (o) => {
    e = o.touches[0]?.clientY ?? 0;
  }, i = (o) => {
    if (!o.cancelable) return;
    const n = o.touches[0]?.clientY ?? e;
    re(o.composedPath(), t, n - e) || o.preventDefault();
  }, r = (o) => {
    re(o.composedPath(), t, -o.deltaY) || o.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", r, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", r);
  };
}
var _s = Object.defineProperty, bs = Object.getOwnPropertyDescriptor, O = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? bs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && _s(e, s, r), r;
};
let G;
function ms(t, e) {
  G?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), G = s;
}
function xs(t) {
  G?.isConnected && (G.hass = t);
}
let A = class extends E {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = ye(this);
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
  _name(t) {
    return !this._stack.length && this.opts.name ? this.opts.name : this.hass.formatEntityName?.(t) ?? t.attributes.friendly_name ?? t.entity_id;
  }
  _stateText(t) {
    if (N(t)) return c(this.hass, "unavailable");
    if (!m(t)) return c(this.hass, "off");
    const e = [], s = P(t);
    if (s.length) {
      const n = s.filter((a) => m(this.hass.states[a])).length;
      e.push(`${n} ${c(this.hass, "of")} ${s.length} ${c(this.hass, "lit")}`);
    }
    const i = I(t);
    i != null && e.push(`${i} %`);
    const r = X(t), o = ht(t);
    if (r) {
      const n = Pt(r, K(this.hass));
      n && e.push(n);
    } else o && t.attributes.color_mode === "color_temp" && e.push(`${o} K`);
    return e.length || e.push(c(this.hass, "on")), e.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this.hass.states[this._entityId], e = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return h`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${t ? this._name(t) : this._entityId}>
        ${this._wide ? g : h`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${t ? this._content(t) : h`<p class="empty">${c(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(t) {
    const e = m(t), s = $e(t, this.opts.useLightColor !== !1), i = P(t), r = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, o = this._controls(t), n = i.length ? this._memberList(t, i) : g, a = this._info(t);
    return h`
      <div class="body" style=${r}>
        <header>
          ${this._stack.length ? h`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${te(!1, 18)}
              </button>` : g}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? c(this.hass, "turn_off") : c(this.hass, "turn_on")}
            ?disabled=${N(t)}
            @click=${() => ot(this.hass, t)}
          >
            ${V(e, this._wide ? 28 : 24)}
            ${i.length && e ? h`<span class="badge">${i.filter((l) => m(this.hass.states[l])).length}</span>` : g}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${nt(this.hass, t.entity_id) ? ` · ${nt(this.hass, t.entity_id)}` : ""}</span>
          </div>
          <button class="round close" aria-label=${c(this.hass, "close")} @click=${() => this.close()}>
            ${_e(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? h`<div class="cols">
              <div class="left">${o.main}</div>
              <div class="right">${o.side}${n}${i.length ? g : a}</div>
            </div>` : h`<div class="stack">
              <div class="main-row">${o.main}${o.beside ?? g}</div>
              ${o.side}${n}${i.length ? g : a}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = ft(t), s = m(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: h`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? c(this.hass, "turn_off") : c(this.hass, "turn_on")}
            @click=${() => ot(this.hass, t)}>
            <span>${es(36)}</span>
          </button>`,
        side: g
      };
    const r = h`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${I(t) ?? 0}
      .label=${c(this.hass, "brightness")}
      @value-changed=${(d) => zt(this.hass, i, d.detail.value)}
    >${be(28)}</terral-slider>`, o = h`<div class="chips">
      ${[25, 50, 75, 100].map(
      (d) => h`<button class="chip" @click=${() => zt(this.hass, i, d)}>${d} %</button>`
    )}
    </div>`, n = h`<div class="chips">
      ${Mt.map(
      (d) => h`<button class="chip tinted" style="background:${d.css}" @click=${() => mt(this.hass, t, d.kelvin)}>
          ${c(this.hass, d.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: r, side: o };
    if (e === "temperature") {
      const d = t.attributes.min_color_temp_kelvin ?? 2e3, f = t.attributes.max_color_temp_kelvin ?? 6500, _ = h`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${d}
        .max=${f}
        .value=${ht(t) ?? Math.round((d + f) / 2)}
        .label=${c(this.hass, "temperature")}
        @value-changed=${($) => mt(this.hass, t, $.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: h`<div class="pair">${r}${_}</div>`, side: n } : { main: h`<div class="pair">${r}${_}</div>`, side: n };
    }
    const a = K(this.hass), l = (this.opts.favorites?.length ? this.opts.favorites : Rt.map((d) => ({ name: d.name[a], rgb: d.rgb }))).slice(0, 6), p = X(t), u = h`
      <p class="lb">${c(this.hass, "favorites")}</p>
      <div class="swatches">
        ${l.map(
      (d) => h`<button
            class="sw ${p && S(p) === S(d.rgb) ? "sel" : ""}"
            style="background:${S(d.rgb)}"
            aria-label=${d.name ?? S(d.rgb)}
            @click=${() => ie(this.hass, i, d.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${c(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${p ? S(p) : "#ffffff"} @change=${(d) => ie(this.hass, i, fs(d.target.value))} />
      ${ps(t) ? h`<p class="lb">${c(this.hass, "temperature")}</p>${n}` : g}
    `;
    return this._wide ? { main: r, side: u } : { main: r, side: g, beside: h`<div class="beside">${u}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const l of e) {
      const p = nt(this.hass, l) ?? c(this.hass, "other_area");
      i.set(p, [...i.get(p) ?? [], l]);
    }
    const r = s === "always" || s === "auto" && e.length > 8 && i.size > 1, o = e.length > 8 ? h`<div class="chips">
          <button class="chip" @click=${() => Ct(this.hass, t.entity_id, !0)}>${c(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => Ct(this.hass, t.entity_id, !1)}>${c(this.hass, "all_off")}</button>
        </div>` : g, n = (l) => {
      const p = this.hass.states[l], u = m(p), d = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? l : l;
      return h`<div class="mr">
        <button class="mi ${u ? "on" : ""}" ?disabled=${N(p)}
          aria-label="${u ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${d}"
          @click=${() => p && ot(this.hass, p)}>${V(u, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, l]}>
          <span>${d}</span><small>${p ? this._stateText(p) : c(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, a = (l) => [...l].sort((p, u) => Number(m(this.hass.states[u])) - Number(m(this.hass.states[p])));
    return h`
      ${o}
      <p class="lb">${c(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${r ? [...i.entries()].map(([l, p]) => {
      const u = this._openAreas.has(l), d = p.filter((f) => m(this.hass.states[f])).length;
      return h`<div class="box">
                <div class="sec">
                  <button class="mi ${d ? "on" : ""}" aria-label="${d ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${l}"
                    @click=${() => Ct(this.hass, p, d === 0)}>${V(d > 0, 18)}</button>
                  <button class="mt" aria-expanded=${u} @click=${() => {
        const f = new Set(this._openAreas);
        u ? f.delete(l) : f.add(l), this._openAreas = f;
      }}>
                    <span>${l} <small>${d} ${c(this.hass, "of")} ${p.length}</small></span>${te(u)}
                  </button>
                </div>
                ${u ? h`<div class="inner">${p.map(n)}</div>` : g}
              </div>`;
    }) : h`<div class="box">${a(e).map(n)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return h`<div class="info">
      <div><span>${c(this.hass, "last_activity")}</span><span>${Ze(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
A.styles = T`
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
O([
  b({ attribute: !1 })
], A.prototype, "hass", 2);
O([
  b({ attribute: !1 })
], A.prototype, "opts", 2);
O([
  x()
], A.prototype, "_stack", 2);
O([
  x()
], A.prototype, "_expanded", 2);
O([
  x()
], A.prototype, "_closing", 2);
O([
  x()
], A.prototype, "_wide", 2);
O([
  x()
], A.prototype, "_openAreas", 2);
O([
  Ge("input[type=color]")
], A.prototype, "_picker", 2);
A = O([
  j("terral-light-dialog")
], A);
var vs = Object.defineProperty, $s = Object.getOwnPropertyDescriptor, D = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? $s(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && vs(e, s, r), r;
};
const ys = "terral-home-light";
let Y = class extends E {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      ms(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !N(e) && ot(this.hass, e);
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
    return t ? ft(t) === "temperature" || ft(t) === "color" || P(t).length > 0 ? e : e.slice(0, 3) : e;
  }
  static getStubConfig(t, e = [], s = []) {
    return { entity: [...e, ...s].find((r) => r.startsWith("light.")) ?? Object.keys(t?.states ?? {}).find((r) => r.startsWith("light.")) ?? "light.example" };
  }
  static getConfigForm() {
    const t = (e) => c(void 0, e);
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...P(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && xs(this.hass);
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
    if (N(t)) return c(s, "unavailable");
    const i = P(t);
    if (i.length) {
      const a = i.filter((u) => m(s.states[u])).length;
      if (!a) return `${i.length} ${c(s, "lights_off")}`;
      const l = I(t), p = a === i.length && e === "onoff" ? `${c(s, "all_lit")} (${a})` : `${a} ${c(s, "of")} ${i.length} ${c(s, "lit")}`;
      return l != null && this._size !== "s11" ? `${p} · ${l} %` : p;
    }
    if (!m(t)) return c(s, "off");
    const r = [], o = I(t);
    o != null && r.push(`${o} %`);
    const n = X(t);
    if (n) {
      const a = Pt(n, K(s));
      a && r.push(a);
    } else if (e === "temperature" || e === "color") {
      const a = ht(t);
      if (a && t.attributes.color_mode === "color_temp") {
        const l = [...Mt].sort((p, u) => Math.abs(p.kelvin - a) - Math.abs(u.kelvin - a))[0];
        r.push(c(s, l.key));
      }
    }
    return r.join(" · ") || c(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return h`<div class="card off missing"><span>${c(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = ft(t), s = m(t), i = N(t), r = P(t), o = $e(t, this._config.use_light_color !== !1), n = s ? `--bg:${o.bg};--fg:${o.fg};--fg2:${o.fg2};--accent:${o.accent};--fill:${o.fill}` : "";
    let a = this._size;
    a === "s42" && !this.getTerralSizes().some((u) => u.h === 4) && (a = "s22");
    const l = h`<button
      class="icon"
      aria-label="${s ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${V(s, a === "s11" ? 20 : 32)}
      ${r.length && s ? h`<span class="badge">${r.filter((u) => m(this.hass.states[u])).length}</span>` : g}
    </button>`, p = h`<div class="text">
      <span class="name">${this._name(t)}</span>
      <span class="state">${this._status(t, e)}</span>
    </div>`;
    return h`<div
      class="card ${a} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${n}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${this._name(t)}
      @click=${this._cardClick}
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >
      ${a === "s11" || a === "s21" ? h`${l}${p}` : h`<div class="head">${l}${p}${this._quickButton(t, e, a)}</div>
            ${this._body(t, e, a)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !P(t).length) return g;
    const i = X(t), r = i ? Pt(i, K(this.hass)) ?? "" : "", o = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? S(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return h`<button class="pb" @click=${(n) => {
      n.stopPropagation(), this._openWindow();
    }}><i style=${o}></i>${r || (e === "color" ? c(this.hass, "more_colors") : c(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return h`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${I(t) ?? 0}
      .label=${c(this.hass, "brightness")}
      @value-changed=${(s) => zt(this.hass, t.entity_id, s.detail.value)}
    >${be(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = P(t);
    if (s === "s42" && i.length) {
      const o = [...i].sort((p, u) => Number(m(this.hass.states[u])) - Number(m(this.hass.states[p]))), n = e === "onoff" ? 5 : 4, a = o.length > n ? o.slice(0, n - 1) : o, l = o.length - a.length;
      return h`
        ${e !== "onoff" ? this._brightness(t) : g}
        <div class="members">
          ${a.map((p) => {
        const u = this.hass.states[p], d = m(u), f = u ? this.hass.formatEntityName?.(u) ?? u.attributes.friendly_name ?? p : p;
        return h`<div class="mr">
              <button class="mi ${d ? "lit" : ""}" ?disabled=${N(u)} aria-label="${d ? c(this.hass, "turn_off") : c(this.hass, "turn_on")} ${f}"
                @click=${(_) => {
          _.stopPropagation(), u && ot(this.hass, u);
        }}>${V(d, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${f}</span><small>${u ? m(u) ? I(u) != null ? `${I(u)} %` : c(this.hass, "on") : c(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${l > 0 ? h`<button class="morebtn" @click=${this._openWindow}>+ ${l} ${c(this.hass, "more")}</button>` : g}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? h`<div class="tags">
          ${i.slice(0, 4).map((o) => {
        const n = this.hass.states[o], a = n ? this.hass.formatEntityName?.(n) ?? n.attributes.friendly_name ?? o : o;
        return h`<span class="tag"><i class=${m(n) ? "lit" : ""}></i>${a}</span>`;
      })}
        </div>` : h`<div class="since">
        <span><b>${m(t) ? c(this.hass, "on") : c(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const o = t.attributes.min_color_temp_kelvin ?? 2e3, n = t.attributes.max_color_temp_kelvin ?? 6500;
      return h`
        <p class="lbl">${c(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${c(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${o} .max=${n} .value=${ht(t) ?? 3500}
          .label=${c(this.hass, "temperature")}
          @value-changed=${(a) => mt(this.hass, t, a.detail.value)}></terral-slider>
        <div class="chips">
          ${Mt.map((a) => h`<button class="chip" style="background:${a.css}" @click=${(l) => {
        l.stopPropagation(), mt(this.hass, t, a.kelvin);
      }}>${c(this.hass, a.key)}</button>`)}
        </div>
      `;
    }
    const r = this._config?.favorite_colors?.map((o) => Array.isArray(o) ? o : o.rgb) ?? void 0;
    return h`
      <p class="lbl">${c(this.hass, "brightness")}</p>
      ${this._brightness(t, !0)}
      <p class="lbl">${c(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${t} .colors=${r}></terral-light-favs>
      <button class="pb wide" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${c(this.hass, "more_colors")}</button>
    `;
  }
};
Y.styles = T`
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
D([
  b({ attribute: !1 })
], Y.prototype, "hass", 2);
D([
  b({ type: Boolean })
], Y.prototype, "preview", 2);
D([
  x()
], Y.prototype, "_config", 2);
D([
  x()
], Y.prototype, "_size", 2);
Y = D([
  j(ys)
], Y);
let Q = class extends E {
  render() {
    if (!this.hass || !this.entity) return g;
    const t = K(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: S(i) })) : ws[t] ??= ks(t), s = X(this.entity);
    return e.slice(0, 6).map(
      (i) => h`<button
        class=${s && S(s) === S(i.rgb) ? "sel" : ""}
        style="background:${S(i.rgb)}"
        aria-label=${i.name}
        @click=${(r) => {
        r.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
Q.styles = T`
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
D([
  b({ attribute: !1 })
], Q.prototype, "hass", 2);
D([
  b({ attribute: !1 })
], Q.prototype, "entity", 2);
D([
  b({ attribute: !1 })
], Q.prototype, "colors", 2);
Q = D([
  j("terral-light-favs")
], Q);
const ws = {}, ks = (t) => Rt.map((e) => ({ rgb: e.rgb, name: e.name[t] }));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const As = { CHILD: 2 }, Cs = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ss = class {
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
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Es } = qe, oe = (t) => t, ne = () => document.createComment(""), it = (t, e, s) => {
  const i = t._$AA.parentNode, r = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const o = i.insertBefore(ne(), r), n = i.insertBefore(ne(), r);
    s = new Es(o, n, t, t.options);
  } else {
    const o = s._$AB.nextSibling, n = s._$AM, a = n !== t;
    if (a) {
      let l;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (l = t._$AU) !== n._$AU && s._$AP(l);
    }
    if (o !== r || a) {
      let l = s._$AA;
      for (; l !== o; ) {
        const p = oe(l).nextSibling;
        oe(i).insertBefore(l, r), l = p;
      }
    }
  }
  return s;
}, R = (t, e, s = t) => (t._$AI(e, s), t), Ms = {}, zs = (t, e = Ms) => t._$AH = e, Ps = (t) => t._$AH, St = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let r = e; r <= s; r++) i.set(t[r], r);
  return i;
}, le = Cs(class extends Ss {
  constructor(t) {
    if (super(t), t.type !== As.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const r = [], o = [];
    let n = 0;
    for (const a of t) r[n] = i ? i(a, n) : n, o[n] = s(a, n), n++;
    return { values: o, keys: r };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const r = Ps(t), { values: o, keys: n } = this.dt(e, s, i);
    if (!Array.isArray(r)) return this.ut = n, o;
    const a = this.ut ??= [], l = [];
    let p, u, d = 0, f = r.length - 1, _ = 0, $ = o.length - 1;
    for (; d <= f && _ <= $; ) if (r[d] === null) d++;
    else if (r[f] === null) f--;
    else if (a[d] === n[_]) l[_] = R(r[d], o[_]), d++, _++;
    else if (a[f] === n[$]) l[$] = R(r[f], o[$]), f--, $--;
    else if (a[d] === n[$]) l[$] = R(r[d], o[$]), it(t, l[$ + 1], r[d]), d++, $--;
    else if (a[f] === n[_]) l[_] = R(r[f], o[_]), it(t, r[d], r[f]), f--, _++;
    else if (p === void 0 && (p = ae(n, _, $), u = ae(a, d, f)), p.has(a[d])) if (p.has(a[f])) {
      const z = u.get(n[_]), kt = z !== void 0 ? r[z] : null;
      if (kt === null) {
        const Bt = it(t, r[d]);
        R(Bt, o[_]), l[_] = Bt;
      } else l[_] = R(kt, o[_]), it(t, r[d], kt), r[z] = null;
      _++;
    } else St(r[f]), f--;
    else St(r[d]), d++;
    for (; _ <= $; ) {
      const z = it(t, l[$ + 1]);
      R(z, o[_]), l[_++] = z;
    }
    for (; d <= f; ) {
      const z = r[d++];
      z !== null && St(z);
    }
    return this.ut = n, zs(t, l), q;
  }
});
function Ts(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const Os = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function Ds(t) {
  return Os[t];
}
var Ls = Object.defineProperty, It = (t, e, s, i) => {
  for (var r = void 0, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = n(e, s, r) || r);
  return r && Ls(e, s, r), r;
};
const Nt = class Nt extends E {
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
  connectedCallback() {
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = ye(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.();
  }
  close() {
    this._closing || (this._closing = !0, setTimeout(() => this.remove(), 180));
  }
  render() {
    const e = `${this._wide ? "modal" : "sheet"} ${this._closing ? "closing" : ""}`;
    return h`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${this.heading}>
        ${this._wide ? g : h`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        <header>
          <h2>${this.heading}</h2>
          <button class="close" aria-label=${c(this.hass, "close")} @click=${() => this.close()}>${_e(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
Nt.styles = T`
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
let C = Nt;
It([
  b({ attribute: !1 })
], C.prototype, "hass");
It([
  x()
], C.prototype, "_wide");
It([
  x()
], C.prototype, "_closing");
var js = Object.defineProperty, Hs = Object.getOwnPropertyDescriptor, wt = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Hs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && js(e, s, r), r;
};
let J = class extends C {
  constructor() {
    super(...arguments), this.existing = /* @__PURE__ */ new Set(), this._q = "";
  }
  get heading() {
    return c(this.hass, "add_accessory");
  }
  _rows() {
    const t = this.hass, e = [];
    for (const [i, r] of Object.entries(t.states)) {
      if (!i.startsWith("light.")) continue;
      const o = t.entities?.[i];
      o?.hidden || o?.entity_category || e.push({
        id: i,
        name: t.formatEntityName?.(r) || r.attributes.friendly_name || i,
        area: nt(t, i) ?? c(t, "other_area"),
        group: ve(r),
        on: m(r)
      });
    }
    const s = this._q.trim().toLowerCase();
    return e.filter((i) => !s || i.name.toLowerCase().includes(s) || i.area.toLowerCase().includes(s)).sort((i, r) => Number(r.group) - Number(i.group) || i.area.localeCompare(r.area) || i.name.localeCompare(r.name));
  }
  renderContent() {
    const t = this._rows(), e = t.filter((i) => i.group), s = /* @__PURE__ */ new Map();
    for (const i of t.filter((r) => !r.group))
      s.has(i.area) || s.set(i.area, []), s.get(i.area).push(i);
    return h`
      <label class="search">
        ${os()}
        <input
          type="search"
          placeholder=${c(this.hass, "search_lights")}
          .value=${this._q}
          @input=${(i) => this._q = i.target.value}
        />
      </label>
      <div class="scroll">
        ${t.length ? g : h`<p class="empty">${c(this.hass, "no_lights")}</p>`}
        ${e.length ? this._section(c(this.hass, "light_groups"), e) : g}
        ${[...s].map(([i, r]) => this._section(i, r))}
      </div>
    `;
  }
  _section(t, e) {
    return h`<section>
      <h3>${t}</h3>
      <div class="list">
        ${e.map((s) => {
      const i = this.existing.has(s.id);
      return h`<button class="row" ?disabled=${i} @click=${() => this._pick(s.id)}>
            <span class="ic ${s.on ? "on" : ""}">${V(s.on, 20)}</span>
            <span class="nm">${s.name}${s.group ? h`<small>${c(this.hass, "group")}</small>` : g}</span>
            ${i ? h`<span class="added">${ns(16)} ${c(this.hass, "added")}</span>` : g}
          </button>`;
    })}
      </div>
    </section>`;
  }
  _pick(t) {
    this.onPick?.(t), this.close();
  }
};
J.styles = [
  C.styles,
  T`
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
wt([
  b({ attribute: !1 })
], J.prototype, "existing", 2);
wt([
  b({ attribute: !1 })
], J.prototype, "onPick", 2);
wt([
  x()
], J.prototype, "_q", 2);
J = wt([
  j("terral-add-sheet")
], J);
function Rs(t, e, s) {
  const i = document.createElement("terral-add-sheet");
  return i.hass = t, i.existing = e, i.onPick = s, document.body.appendChild(i), i;
}
var Is = Object.defineProperty, Us = Object.getOwnPropertyDescriptor, we = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Us(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && Is(e, s, r), r;
};
let xt = class extends C {
  constructor() {
    super(...arguments), this.options = { heading: "", actions: [] };
  }
  get heading() {
    return this.options.heading;
  }
  renderContent() {
    return h`
      ${this.options.message ? h`<p class="msg">${this.options.message}</p>` : ""}
      <div class="list">
        ${this.options.actions.map(
      (t) => h`<button class="row ${t.danger ? "danger" : ""}" @click=${() => {
        t.run(), this.close();
      }}><span>${t.label}</span>${t.sub ? h`<small>${t.sub}</small>` : ""}</button>`
    )}
      </div>
      <button class="cancel" @click=${() => this.close()}>${c(this.hass, "cancel")}</button>
    `;
  }
};
xt.styles = [
  C.styles,
  T`
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
we([
  b({ attribute: !1 })
], xt.prototype, "options", 2);
xt = we([
  j("terral-confirm-sheet")
], xt);
function ce(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
var Ns = Object.defineProperty, Bs = Object.getOwnPropertyDescriptor, Ut = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Bs(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && Ns(e, s, r), r;
};
let dt = class extends C {
  constructor() {
    super(...arguments), this.actions = {}, this.version = "";
  }
  get heading() {
    return "Terral Home";
  }
  renderContent() {
    return h`
      <div class="list">
        <button class="row" @click=${() => {
      this.actions.onEdit?.(), this.close();
    }}>
          <span class="ic">${is()}</span><span class="nm">${c(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${cs()}</span>
          <span class="nm">${c(this.hass, "by_rooms")}<small>${c(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" disabled>
          <span class="ic">${as()}</span>
          <span class="nm">${c(this.hass, "terral_settings")}<small>${c(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
dt.styles = [
  C.styles,
  T`
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
Ut([
  b({ attribute: !1 })
], dt.prototype, "actions", 2);
Ut([
  b()
], dt.prototype, "version", 2);
dt = Ut([
  j("terral-menu-sheet")
], dt);
function qs(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const ke = "0.4.0";
var Ys = Object.defineProperty, Ws = Object.getOwnPropertyDescriptor, y = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ws(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && Ys(e, s, r), r;
};
const ut = "top", Vs = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], Fs = 0.85, Ks = "#453f77", Xs = "#2f5f89", Et = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let v = class extends E {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || Rs(this.hass, new Set(this._allCards.map((t) => t.entity)), (t) => {
        const e = this.hass?.states[t], s = { id: Et(), type: "light", entity: t, w: e && ve(e) ? 2 : 1, h: 2 };
        this._update((i) => i.cards.push(s));
      });
    }, this._menu = () => {
      this.hass && qs(this.hass, this.panel?.config?.version ?? ke, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms()
      });
    }, this._addSection = () => {
      const t = Et();
      this._update((e) => e.sections.push({ id: t, title: c(this.hass, "new_section"), cards: [] })), this._renaming = t;
    }, this._onHold = (t) => {
      const e = t.detail, s = t.composedPath().find((i) => i instanceof HTMLElement && i.dataset.cid != null);
      s && (t.preventDefault(), this._edit = !0, navigator.vibrate?.(12), this._startDrag("card", s.dataset.cid, e.x, e.y));
    }, this._dragMove = (t) => {
      !this._drag || !this._dragStart || (this._dragDx = t.clientX - this._dragStart.x, this._dragDy = t.clientY - this._dragStart.y, this._drag.kind === "card" ? this._hitCard(t.clientX, t.clientY) : this._hitSection(t.clientY), this._autoScroll(t.clientY));
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
    }), this._unsub = void 0, this._loading = !1, this._endDrag();
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
    }
    if (t.has("_renaming") && this._renaming) {
      const e = this.renderRoot.querySelector("input.rename");
      e?.focus(), e?.select();
    }
  }
  _paintChrome(t) {
    const e = document.querySelector('meta[name="theme-color"]'), s = [document.documentElement, document.body];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = { meta: e?.content ?? null, styles: s.map((i) => [i, i.getAttribute("style") ?? ""]) };
      for (const i of s)
        i.style.backgroundColor = Xs, i.style.backgroundImage = "linear-gradient(90deg, #53407e, #423f76 50%, #3b4074), linear-gradient(90deg, #2f688c, #2e5a86)", i.style.backgroundSize = "100% 50%, 100% 100%", i.style.backgroundRepeat = "no-repeat", i.style.backgroundPosition = "top, bottom", i.style.backgroundAttachment = "fixed";
      e && (e.content = Ks);
    } else if (this._chromeSaved) {
      for (const [i, r] of this._chromeSaved.styles)
        r ? i.setAttribute("style", r) : i.removeAttribute("style");
      e && this._chromeSaved.meta != null && (e.content = this._chromeSaved.meta), this._chromeSaved = void 0;
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
    return e === ut ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: ut, card: e };
    for (const s of this._sections) {
      const i = s.cards.find((r) => r.id === t);
      if (i) return { key: s.id, card: i };
    }
  }
  // ---- Layout -------------------------------------------------------------
  _measure(t) {
    const e = t < 600 ? 16 : 24, s = t < 600 ? 10 : 14, i = Math.min(t, 1180) - 2 * e, r = t < 600 ? 2 : 4, o = (i - s * (r - 1)) / r, n = window.__terralRowRatio ?? Fs, a = Math.max(48, Math.round((o - s) / 2 * n));
    this._colW = o, this._gap = s, r !== this._cols && (this._cols = r), a !== this._rowH && (this._rowH = a);
  }
  _sizeOf(t) {
    const e = t.h === 1 || t.h === 4 ? t.h : 2, s = e === 4 || t.w === 2 ? 2 : 1;
    return { w: Math.min(s, this._cols), h: e };
  }
  _element(t) {
    let e = this._els.get(t.id);
    e || (e = document.createElement("terral-home-light"), this._els.set(t.id, e));
    const { id: s, type: i, w: r, h: o, ...n } = t, a = { ...n, type: "custom:terral-home-light", view_layout: { terral: { w: r, h: o } } }, l = JSON.stringify(a);
    if (e.dataset.cfg !== l) {
      try {
        e.setConfig(a);
      } catch (p) {
        console.warn("Terral Home:", p);
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
    const s = e.trim(), i = this._sections.find((r) => r.id === t);
    !i || !s || s === i.title || this._update((r) => {
      const o = r.sections.find((n) => n.id === t);
      o && (o.title = s);
    });
  }
  _removeSection(t) {
    const e = this._sections.findIndex((r) => r.id === t), s = this._sections[e];
    if (!s || !this.hass) return;
    const i = (r) => this._update((o) => {
      const n = o.sections.findIndex((l) => l.id === t);
      if (n < 0) return;
      const [a] = o.sections.splice(n, 1);
      r ? (n > 0 ? o.sections[n - 1].cards : o.cards).push(...a.cards) : a.cards.forEach((l) => this._els.delete(l.id));
    });
    if (!s.cards.length) return i(!1);
    ce(this.hass, {
      heading: c(this.hass, "delete_section_q", { name: s.title }),
      message: c(this.hass, "delete_section_msg", { n: s.cards.length }),
      actions: [
        { label: c(this.hass, "keep_cards"), sub: c(this.hass, e > 0 ? "keep_cards_sub" : "keep_cards_sub_top"), run: () => i(!0) },
        { label: c(this.hass, "remove_cards"), danger: !0, run: () => i(!1) }
      ]
    });
  }
  /** One section per HA area; each card with an area moves into it. */
  _confirmRooms() {
    this.hass && ce(this.hass, {
      heading: c(this.hass, "by_rooms"),
      message: c(this.hass, "by_rooms_msg"),
      actions: [{ label: c(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }]
    });
  }
  _sectionsFromRooms() {
    const t = this.hass;
    t && (this._update((e) => {
      const s = new Map(e.sections.map((n) => [n.title.toLowerCase(), n])), i = [e.cards, ...e.sections.map((n) => n.cards)], r = [];
      for (const n of i)
        for (const a of [...n]) {
          const l = nt(t, a.entity);
          l && (r.push([a, l]), n.splice(n.indexOf(a), 1));
        }
      const o = [...new Set(r.map(([, n]) => n))].filter((n) => !s.has(n.toLowerCase())).sort((n, a) => n.localeCompare(a));
      for (const n of o) {
        const a = { id: Et(), title: n, cards: [] };
        e.sections.push(a), s.set(n.toLowerCase(), a);
      }
      for (const [n, a] of r) s.get(a.toLowerCase()).cards.push(n);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), r = (this._els.get(e.id)?.getTerralSizes?.() ?? Vs).filter((n) => n.w <= this._cols);
    this._resizeOrigin = { left: i.left, top: i.top, sizes: r };
    const o = this._sizeOf(e);
    this._resize = { id: e.id, w: o.w, h: o.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let r = e.sizes[0], o = 1 / 0;
    for (const n of e.sizes) {
      const a = (n.w - s) ** 2 + (n.h - i) ** 2;
      a < o && ([r, o] = [n, a]);
    }
    (r.w !== this._resize.w || r.h !== this._resize.h) && (this._resize = { ...this._resize, w: r.w, h: r.h }, navigator.vibrate?.(6));
  }
  _resizeUp() {
    const t = this._resize;
    if (this._resize = void 0, this._resizeOrigin = void 0, !t) return;
    const e = this._findCard(t.id);
    if (!e) return;
    const s = this._sizeOf(e.card);
    s.w === t.w && s.h === t.h || this._update((i) => {
      const r = v._list(i, e.key)?.find((o) => o.id === t.id);
      r && Object.assign(r, { w: t.w, h: t.h });
    });
  }
  _span(t, e) {
    return t * e + (t - 1) * this._gap;
  }
  _overlayDown(t, e) {
    t.target.closest("button") || (t.preventDefault(), this._startDrag("card", e, t.clientX, t.clientY));
  }
  _handleDown(t, e) {
    t.preventDefault(), this._renaming = void 0, this._startDrag("section", e, t.clientX, t.clientY);
  }
  _startDrag(t, e, s, i) {
    this._drag = { kind: t, id: e }, this._dropCard = void 0, this._dropSection = void 0, this._dragStart = { x: s, y: i }, this._dragDx = this._dragDy = 0, window.addEventListener("pointermove", this._dragMove), window.addEventListener("pointerup", this._dragUp), window.addEventListener("pointercancel", this._dragUp);
  }
  _hitCard(t, e) {
    const s = this.shadowRoot?.elementsFromPoint(t, e) ?? [], i = s.find((o) => o.dataset?.cid != null && o.dataset.cid !== this._drag?.id);
    if (i) {
      this._dropCard = { key: i.dataset.key, targetId: i.dataset.cid };
      return;
    }
    const r = s.find((o) => o.dataset?.zone != null);
    r && (this._dropCard = { key: r.dataset.zone });
  }
  _hitSection(t) {
    const e = [...this.renderRoot.querySelectorAll("section[data-sid]")].filter(
      (s) => s.dataset.sid !== this._drag?.id
    );
    this._dropSection = e.filter((s) => {
      const i = s.getBoundingClientRect();
      return i.top + i.height / 2 < t;
    }).length;
  }
  _moveCard(t, e, s) {
    const i = this._findCard(t);
    !i || s === t || this._update((r) => {
      const o = v._list(r, i.key), n = o.findIndex((f) => f.id === t), a = s ? o.findIndex((f) => f.id === s) : -1, [l] = o.splice(n, 1), p = v._list(r, e);
      if (!p) {
        o.splice(n, 0, l);
        return;
      }
      if (!s) {
        p.push(l);
        return;
      }
      const u = p.findIndex((f) => f.id === s), d = i.key === e && a > n;
      p.splice(u < 0 ? p.length : u + (d ? 1 : 0), 0, l);
    });
  }
  _moveSection(t, e) {
    const s = this._sections.findIndex((i) => i.id === t);
    s < 0 || s === e || this._update((i) => {
      const r = i.sections.findIndex((n) => n.id === t), [o] = i.sections.splice(r, 1);
      i.sections.splice(Math.min(e, i.sections.length), 0, o);
    });
  }
  _endDrag() {
    window.removeEventListener("pointermove", this._dragMove), window.removeEventListener("pointerup", this._dragUp), window.removeEventListener("pointercancel", this._dragUp), this._drag = void 0, this._dropCard = void 0, this._dropSection = void 0, this._dragStart = void 0, this._dragDx = this._dragDy = 0;
  }
  /** Scroll when dragging near the top or bottom edge. */
  _autoScroll(t) {
    const e = this.renderRoot.querySelector(".scroller");
    if (!e || !this._dragStart) return;
    const s = e.getBoundingClientRect(), i = t < s.top + 70 ? -12 : t > s.bottom - 70 ? 12 : 0;
    if (!i) return;
    const r = e.scrollTop;
    e.scrollTop += i;
    const o = e.scrollTop - r;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - o }, this._dragDy += o;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, r = e && !this._allCards.length, o = this._drag?.kind === "card", n = this._drag?.kind === "section", a = s.length > 0 || r || t && (o || !i.length);
    let l = 0;
    return h`
      <div class="scroller" style="background:${Ds("crepusculo")}" @terral-card-hold=${this._onHold}>
        <div class="wrap ${t ? "editing" : ""}">
          <div class="top">
            <button class="glass round" aria-label=${c(this.hass, "menu")} @click=${() => Ts(this, "hass-toggle-menu")}>
              ${ss()}
            </button>
            <span class="spacer"></span>
            ${t ? h`<div class="glass pill">
                  <button class="pbtn" aria-label=${c(this.hass, "add_accessory")} @click=${this._add}>${pt(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${c(this.hass, "done")}</button>
                </div>` : h`<div class="glass pill">
                  <button class="pbtn" aria-label=${c(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${pt(22)}</button>
                  <button class="pbtn" aria-label=${c(this.hass, "more_options")} @click=${this._menu}>${rs(22)}</button>
                </div>`}
          </div>
          <h1>${c(this.hass, "home_title")}</h1>
          ${this._error ? h`<p class="notice">${c(this.hass, "panel_error")} (${this._error})</p>` : g}
          ${a ? this._grid(ut, s, t, r || t && !i.length, s.length === 0 && t ? c(this.hass, "no_section") : void 0) : g}
          ${le(
      i,
      (p) => p.id,
      (p) => {
        const u = n && this._drag?.id === p.id, d = n && !u && this._dropSection === l;
        return u || l++, !t && !p.cards.length ? g : h`${d ? h`<div class="dropline"></div>` : g}${this._section(p, t, u)}`;
      }
    )}
          ${n && this._dropSection === l ? h`<div class="dropline"></div>` : g}
          ${t && e ? h`<button class="addsec" @click=${this._addSection}>${pt(20)}<span>${c(this.hass, "add_section")}</span></button>` : g}
        </div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, r = s ? `translate:0 ${this._dragDy}px` : "";
    return h`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${r}>
      <header>
        ${e ? h`<button class="sdel" aria-label=${c(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${ee()}</button>` : g}
        ${i ? h`<input
              class="rename"
              .value=${t.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(o) => {
      o.key === "Enter" && this._commitRename(t.id, o.target.value), o.key === "Escape" && (this._renaming = void 0);
    }}
              @blur=${(o) => this._commitRename(t.id, o.target.value)}
            />` : e ? h`<button class="title" aria-label=${c(this.hass, "rename_section")} @click=${() => this._renaming = t.id}>${t.title}</button>` : h`<h2>${t.title}</h2>`}
        ${e ? h`<button
              class="handle"
              aria-label=${c(this.hass, "move_section")}
              @pointerdown=${(o) => this._handleDown(o, t.id)}
            >${ls()}</button>` : g}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? c(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  _grid(t, e, s, i, r) {
    const o = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId;
    return h`<div
      class="grid ${o ? "zone-target" : ""} ${t === ut ? "top-grid" : ""}"
      data-zone=${t}
      style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
    >
      ${le(e, (n) => n.id, (n, a) => this._cell(t, n, a, s))}
      ${r && !e.length ? h`<div class="placeholder" style="grid-column:1/-1">${r}</div>` : g}
      ${i ? h`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${pt(26)}</span><span>${c(this.hass, "add_accessory")}</span>
          </button>` : g}
    </div>`;
  }
  _cell(t, e, s, i) {
    const { w: r, h: o } = this._sizeOf(e), n = this._drag?.kind === "card" && this._drag.id === e.id, a = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, l = `grid-column:span ${r};grid-row:span ${o};--d:${s % 5 * -0.07}s;${n ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return h`<div class="cell ${n ? "dragging" : ""} ${a ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${l}>
      ${this._element(e)}
      ${i ? h`<div class="overlay" @pointerdown=${(p) => this._overlayDown(p, e.id)}>
            <button class="del" aria-label=${c(this.hass, "delete")} @click=${() => this._remove(e.id)}>${ee()}</button>
            <button
              class="corner"
              aria-label=${c(this.hass, "resize")}
              @pointerdown=${(p) => this._resizeDown(p, e)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>
          </div>` : g}
      ${this._resize?.id === e.id ? h`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>` : g}
    </div>`;
  }
};
v.styles = T`
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
y([
  b({ attribute: !1 })
], v.prototype, "hass", 2);
y([
  b({ type: Boolean })
], v.prototype, "narrow", 2);
y([
  b({ attribute: !1 })
], v.prototype, "route", 2);
y([
  b({ attribute: !1 })
], v.prototype, "panel", 2);
y([
  x()
], v.prototype, "_layout", 2);
y([
  x()
], v.prototype, "_error", 2);
y([
  x()
], v.prototype, "_edit", 2);
y([
  x()
], v.prototype, "_cols", 2);
y([
  x()
], v.prototype, "_rowH", 2);
y([
  x()
], v.prototype, "_drag", 2);
y([
  x()
], v.prototype, "_dropCard", 2);
y([
  x()
], v.prototype, "_dropSection", 2);
y([
  x()
], v.prototype, "_dragDx", 2);
y([
  x()
], v.prototype, "_dragDy", 2);
y([
  x()
], v.prototype, "_resize", 2);
y([
  x()
], v.prototype, "_renaming", 2);
v = y([
  j("terral-home-panel")
], v);
const vt = window;
vt.customCards = vt.customCards || [];
vt.customCards.some((t) => t.type === "terral-home-light") || vt.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: e } } : null
});
console.info(
  `%c TERRAL HOME %c v${ke} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  ke as VERSION
};
