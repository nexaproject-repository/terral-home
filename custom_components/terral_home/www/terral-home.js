/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bs = globalThis, Tn = Bs.ShadowRoot && (Bs.ShadyCSS === void 0 || Bs.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Dn = Symbol(), pa = /* @__PURE__ */ new WeakMap();
let io = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== Dn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Tn && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = pa.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && pa.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Er = (t) => new io(typeof t == "string" ? t : t + "", void 0, Dn), E = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[a + 1], t[0]);
  return new io(s, t, Dn);
}, jr = (t, e) => {
  if (Tn) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), n = Bs.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, t.appendChild(i);
  }
}, ua = Tn ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Er(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Nr, defineProperty: Pr, getOwnPropertyDescriptor: Lr, getOwnPropertyNames: Wr, getOwnPropertySymbols: Ir, getPrototypeOf: Hr } = Object, mi = globalThis, ga = mi.trustedTypes, Rr = ga ? ga.emptyScript : "", qr = mi.reactiveElementPolyfillSupport, os = (t, e) => t, Qs = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Rr : null;
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
} }, On = (t, e) => !Nr(t, e), fa = { attribute: !0, type: String, converter: Qs, reflect: !1, useDefault: !1, hasChanged: On };
Symbol.metadata ??= Symbol("metadata"), mi.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ge = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = fa) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, s);
      n !== void 0 && Pr(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: n, set: a } = Lr(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? fa;
  }
  static _$Ei() {
    if (this.hasOwnProperty(os("elementProperties"))) return;
    const e = Hr(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(os("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(os("properties"))) {
      const s = this.properties, i = [...Wr(s), ...Ir(s)];
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
      for (const n of i) s.unshift(ua(n));
    } else e !== void 0 && s.push(ua(e));
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
    return jr(e, this.constructor.elementStyles), e;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : Qs).toAttribute(s, i.type);
      this._$Em = e, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Qs;
      this._$Em = n;
      const l = o.fromAttribute(s, a.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, n = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? On)(a, s) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
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
ge.elementStyles = [], ge.shadowRootOptions = { mode: "open" }, ge[os("elementProperties")] = /* @__PURE__ */ new Map(), ge[os("finalized")] = /* @__PURE__ */ new Map(), qr?.({ ReactiveElement: ge }), (mi.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const En = globalThis, _a = (t) => t, Zs = En.trustedTypes, ma = Zs ? Zs.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, no = "$lit$", Mt = `lit$${Math.random().toFixed(9).slice(2)}$`, ao = "?" + Mt, Ur = `<${ao}>`, Zt = document, gs = () => Zt.createComment(""), fs = (t) => t === null || typeof t != "object" && typeof t != "function", jn = Array.isArray, Fr = (t) => jn(t) || typeof t?.[Symbol.iterator] == "function", Oi = `[ 	
\f\r]`, Xe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ba = /-->/g, xa = />/g, Rt = RegExp(`>|${Oi}(?:([^\\s"'>=/]+)(${Oi}*=${Oi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ya = /'/g, va = /"/g, oo = /^(?:script|style|textarea|title)$/i, ro = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = ro(1), x = ro(2), Ot = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), wa = /* @__PURE__ */ new WeakMap(), Bt = Zt.createTreeWalker(Zt, 129);
function lo(t, e) {
  if (!jn(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ma !== void 0 ? ma.createHTML(e) : e;
}
const Br = (t, e) => {
  const s = t.length - 1, i = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Xe;
  for (let l = 0; l < s; l++) {
    const c = t[l];
    let h, u, p = -1, _ = 0;
    for (; _ < c.length && (o.lastIndex = _, u = o.exec(c), u !== null); ) _ = o.lastIndex, o === Xe ? u[1] === "!--" ? o = ba : u[1] !== void 0 ? o = xa : u[2] !== void 0 ? (oo.test(u[2]) && (n = RegExp("</" + u[2], "g")), o = Rt) : u[3] !== void 0 && (o = Rt) : o === Rt ? u[0] === ">" ? (o = n ?? Xe, p = -1) : u[1] === void 0 ? p = -2 : (p = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? Rt : u[3] === '"' ? va : ya) : o === va || o === ya ? o = Rt : o === ba || o === xa ? o = Xe : (o = Rt, n = void 0);
    const b = o === Rt && t[l + 1].startsWith("/>") ? " " : "";
    a += o === Xe ? c + Ur : p >= 0 ? (i.push(h), c.slice(0, p) + no + c.slice(p) + Mt + b) : c + Mt + (p === -2 ? l : b);
  }
  return [lo(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
let en = class co {
  constructor({ strings: e, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const l = e.length - 1, c = this.parts, [h, u] = Br(e, s);
    if (this.el = co.createElement(h, i), Bt.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = Bt.nextNode()) !== null && c.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(no)) {
          const _ = u[o++], b = n.getAttribute(p).split(Mt), g = /([.?@])?(.*)/.exec(_);
          c.push({ type: 1, index: a, name: g[2], strings: b, ctor: g[1] === "." ? Yr : g[1] === "?" ? Gr : g[1] === "@" ? Xr : bi }), n.removeAttribute(p);
        } else p.startsWith(Mt) && (c.push({ type: 6, index: a }), n.removeAttribute(p));
        if (oo.test(n.tagName)) {
          const p = n.textContent.split(Mt), _ = p.length - 1;
          if (_ > 0) {
            n.textContent = Zs ? Zs.emptyScript : "";
            for (let b = 0; b < _; b++) n.append(p[b], gs()), Bt.nextNode(), c.push({ type: 2, index: ++a });
            n.append(p[_], gs());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ao) c.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(Mt, p + 1)) !== -1; ) c.push({ type: 7, index: a }), p += Mt.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const i = Zt.createElement("template");
    return i.innerHTML = e, i;
  }
};
function Ce(t, e, s = t, i) {
  if (e === Ot) return e;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const a = fs(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(t), n._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = n : s._$Cl = n), n !== void 0 && (e = Ce(t, n._$AS(t, e.values), n, i)), e;
}
class Vr {
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
    const { el: { content: s }, parts: i } = this._$AD, n = (e?.creationScope ?? Zt).importNode(s, !0);
    Bt.currentNode = n;
    let a = Bt.nextNode(), o = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let h;
        c.type === 2 ? h = new Ie(a, a.nextSibling, this, e) : c.type === 1 ? h = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (h = new Kr(a, this, e)), this._$AV.push(h), c = i[++l];
      }
      o !== c?.index && (a = Bt.nextNode(), o++);
    }
    return Bt.currentNode = Zt, n;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Ie {
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
    e = Ce(this, e, s), fs(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== Ot && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Fr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && fs(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Zt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = en.createElement(lo(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const a = new Vr(n, this), o = a.u(this.options);
      a.p(s), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let s = wa.get(e.strings);
    return s === void 0 && wa.set(e.strings, s = new en(e)), s;
  }
  k(e) {
    jn(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const a of e) n === s.length ? s.push(i = new Ie(this.O(gs()), this.O(gs()), this, this.options)) : i = s[n], i._$AI(a), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = _a(e).nextSibling;
      _a(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
let bi = class {
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
    if (a === void 0) e = Ce(this, e, s, 0), o = !fs(e) || e !== this._$AH && e !== Ot, o && (this._$AH = e);
    else {
      const l = e;
      let c, h;
      for (e = a[0], c = 0; c < a.length - 1; c++) h = Ce(this, l[i + c], s, c), h === Ot && (h = this._$AH[c]), o ||= !fs(h) || h !== this._$AH[c], h === f ? e = f : e !== f && (e += (h ?? "") + a[c + 1]), this._$AH[c] = h;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class Yr extends bi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class Gr extends bi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class Xr extends bi {
  constructor(e, s, i, n, a) {
    super(e, s, i, n, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = Ce(this, e, s, 0) ?? f) === Ot) return;
    const i = this._$AH, n = e === f && i !== f || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== f && (i === f || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Kr {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Ce(this, e);
  }
}
const Qr = { I: Ie }, Zr = En.litHtmlPolyfillSupport;
Zr?.(en, Ie), (En.litHtmlVersions ??= []).push("3.3.3");
const Jr = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = s?.renderBefore ?? null;
    i._$litPart$ = n = new Ie(e.insertBefore(gs(), a), a, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nn = globalThis;
let B = class extends ge {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Jr(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Ot;
  }
};
B._$litElement$ = !0, B.finalized = !0, Nn.litElementHydrateSupport?.({ LitElement: B });
const tl = Nn.litElementPolyfillSupport;
tl?.({ LitElement: B });
(Nn.litElementVersions ??= []).push("4.2.2");
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
const el = { attribute: !0, type: String, converter: Qs, reflect: !1, hasChanged: On }, sl = (t = el, e, s) => {
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
function $(t) {
  return (e, s) => typeof s == "object" ? sl(t, e, s) : ((i, n, a) => {
    const o = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(t) {
  return $({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const il = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function nl(t, e) {
  return (s, i, n) => {
    const a = (o) => o.renderRoot?.querySelector(t) ?? null;
    return il(s, i, { get() {
      return a(this);
    } });
  };
}
const al = {
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
  // Pages and main dashboard
  pages: "Páginas",
  page_home: "Inicio",
  page_new: "Nueva página",
  page_add: "Página",
  page_settings: "Página",
  page_name_ph: "Luces",
  page_position: "Posición",
  page_pos_of: "{n} de {m}",
  page_before: "‹ Antes",
  page_after: "Después ›",
  page_address: "Dirección",
  page_address_sub: "Para abrir esta página directamente o desde una automatización",
  page_delete: "Eliminar página",
  page_delete_q: "¿Eliminar «{name}»?",
  page_delete_msg: "Tiene {n} tarjetas. ¿Qué hacemos con ellas?",
  page_keep: "Pasarlas a {home}",
  page_keep_sub: "Los apartados se mantienen",
  page_remove_all: "Eliminarlas también",
  page_create: "Crear",
  dash_main: "Dashboard principal",
  dash_main_me: "Usar como mi dashboard principal",
  dash_main_me_sub: "Para tu usuario, en todos tus dispositivos",
  dash_main_all: "Principal para toda la casa",
  dash_main_all_sub: "Para quien no haya elegido otro",
  dash_only: "Solo este dashboard en mi menú",
  dash_only_sub: "Oculta el resto de entradas del menú para tu usuario",
  dash_main_note: "Estas opciones son de cada usuario: entra con el suyo (por ejemplo, en su móvil o en la tablet) y actívalas aquí. Para que no vea otros dashboards de Terral, márcalos como «Solo administradores».",
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
  dash_sidebar_note: "Cada dashboard es una entrada propia del menú de Home Assistant. Para que sea el que se abre al entrar, usa «Dashboard principal» más abajo.",
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
  // Doors and windows
  type_contact: "Puertas y ventanas",
  type_contact_desc: "Abierta o cerrada, avisos y aperturas del día",
  contact_missing: "No hay ningún sensor de puerta o ventana en Home Assistant",
  other_contacts: "Otros sensores",
  ct_open: "Abierta",
  ct_closed: "Cerrada",
  ct_ago: "hace {t}",
  ct_since: "desde {t}",
  ct_since_at: "Desde las {t}",
  ct_tampered: "Manipulada",
  ct_opens: "{n} aperturas hoy",
  ct_opens_one: "1 apertura hoy",
  ct_bat_low: "Baja",
  ct_bat_ok: "Bien",
  ct_group_title: "Puertas y ventanas",
  ct_open_n: "{n} abiertas",
  ct_open_one: "1 abierta",
  ct_closed_n: "{n} cerradas",
  ct_closed_one: "1 cerrada",
  ct_all_closed: "Todo cerrado",
  ct_alarm_hint: "Si se arma la alarma con esto abierto, la tarjeta se pondrá roja.",
  ct_alarm_now: "La alarma está armada y esto sigue abierto.",
  ct_openings: "Aperturas",
  ct_time_open: "Abierta",
  ct_longest: "La más larga",
  ct_no_openings: "Sin aperturas en los últimos 7 días",
  ct_open_now: "Abierta ahora",
  ct_was_open: "Cerrada · estuvo abierta {t}",
  ct_sensor: "Sensor",
  ct_vibration: "Vibración",
  ct_vibration_sub: "Golpes o movimiento",
  ct_tamper: "Manipulación",
  ct_tamper_sub: "Tapa del sensor",
  ct_detected: "Detectada",
  ct_not_detected: "No detectada",
  ct_still: "No se mueve",
  ct_node: "Estado",
  ct_node_sub: "Z-Wave · {s}",
  ct_node_ok: "Responde",
  ct_node_dead: "Sin respuesta",
  ct_sensor_entity: "Sensor",
  ct_kind: "Qué es",
  ct_kind_door: "Puerta",
  ct_kind_window: "Ventana",
  ct_kind_balcony: "Balconera",
  ct_kind_garage: "Garaje",
  ct_alerts: "Avisos",
  ct_alert_after: "Avisar si sigue abierta",
  ct_alert_after_sub: "La tarjeta se pone roja y cuenta el tiempo",
  ct_never: "No",
  ct_alarm_warn: "Avisar con la alarma armada",
  ct_alarm_warn_sub: "Roja si está abierta mientras la alarma está armada",
  ct_tamper_warn: "Manipulación y vibración",
  ct_tamper_warn_sub: "Insignia «!» roja en el icono",
  ct_show: "Qué mostrar",
  ct_show_temp: "Temperatura",
  ct_show_battery: "Batería",
  ct_vent: "Ventilación",
  ct_tilt: "Abatida",
  ct_vent_n: "{n} en ventilación",
  ct_positions: "Posiciones",
  ct_pos_now: "Ahora",
  ct_pos_closed: "Cerrada",
  ct_pos_vent: "Ventilación",
  ct_pos_tilt: "Abatida",
  ct_pos_none: "Sin grabar",
  ct_record: "Grabar",
  ct_rerecord: "Volver a grabar",
  ct_positions_note: "Pon la ventana en cada posición y pulsa Grabar: se guarda lo que marcan sus ejes X, Y, Z. La tarjeta mostrará «Ventilación» o «Abatida» aunque el contacto diga cerrada. Graba también «Cerrada» para distinguirlas mejor.",
  ct_group: "Tarjeta de grupo",
  ct_group_add: "Añadir otro sensor",
  ct_remove: "Quitar",
  ct_group_note: "Con más de un sensor la tarjeta resume todos: las abiertas primero. Permite el tamaño 4/2.",
  // Energy
  type_energy: "Consumo de la casa",
  type_energy_desc: "A dónde va la electricidad: cargador, aire y resto",
  energy_missing: "No hay ningún sensor de potencia en Home Assistant",
  en_title: "Consumo de la casa",
  en_short: "Casa",
  en_consumption: "Consumo",
  en_now: "Ahora",
  en_now_l: "ahora",
  en_kw_now: "kW ahora",
  en_grid: "Red",
  en_rest: "Resto de la casa",
  en_rest_sub: "Calculado: total − consumidores",
  en_rest_off: "Sin contador general no se puede calcular",
  en_today_hours: "Hoy · por horas",
  en_by_consumer: "Por consumidor · hoy",
  en_view: "Vista",
  en_view_flow: "Flujo",
  en_view_ring: "Anillo",
  en_view_bars: "Barras",
  en_view_note: "La misma vista en todos los tamaños de la tarjeta y en la ventana.",
  en_total: "Consumo total de la casa",
  en_total_none: "Sin contador general",
  en_total_none_sub: "El total será la suma de los consumidores",
  en_consumers: "Consumidores",
  en_add: "Añadir consumidor",
  en_consumer: "Consumidor",
  en_color: "Color",
  en_counter: "contador kWh, se calcula la potencia",
  en_sensor: "Sensor de potencia",
  en_move_up: "Subir",
  en_move_down: "Bajar",
  en_remove: "Quitar consumidor",
  en_choose_sensor: "Elige su sensor",
  en_animate: "Movimiento",
  en_animate_sub: "Más rápido cuanto más gasta",
  en_consumers_note: "Cada consumidor con su sensor de potencia, nombre, icono y color.",
  // Switch
  type_switch: "Interruptor",
  type_switch_desc: "Termo, enchufe, matamosquitos… con registro y consumo",
  switch_missing: "No hay ningún interruptor en Home Assistant",
  other_switches: "Otros interruptores",
  sw_entity: "Interruptor",
  sw_on: "Encendido",
  sw_off: "Apagado",
  sw_since: "Desde",
  sw_since_at: "Desde las {t}",
  sw_now: "Ahora",
  sw_today_l: "hoy",
  yesterday: "Ayer",
  sw_on_time: "Encendido",
  sw_consumption: "Consumo",
  sw_times: "Veces",
  sw_week_kwh: "Consumo · últimos 7 días",
  sw_week_hours: "Horas encendido · últimos 7 días",
  sw_no_meter: "sin medidor de consumo",
  sw_log: "Registro",
  sw_no_log: "Sin cambios en los últimos 7 días",
  sw_lasted: "estuvo {d}",
  sw_running: "en curso",
  sw_by_automation: "por automatización «{n}»",
  sw_by_script: "por script «{n}»",
  sw_by_you: "por ti",
  sw_by_ha: "desde Home Assistant",
  sw_color: "Color al encender",
  sw_color_note: "El color fuerte va en el icono y uno suave en el fondo de la tarjeta.",
  sw_style: "Tarjeta grande (2/2)",
  sw_style_a: "A · Datos",
  sw_style_a_sub: "Desde · Ahora · Hoy",
  sw_style_b: "B · Consumo",
  sw_style_b_sub: "Potencia en grande y consumo por horas",
  sw_style_c: "C · Línea del día",
  sw_style_c_sub: "Ratos encendido de hoy, de 0 a 24 h",
  sw_icon: "Icono",
  sw_meter: "Consumo",
  sw_power: "Potencia",
  sw_energy: "Energía",
  sw_meter_note: "Si el enchufe no mide consumo, la ventana muestra horas encendido en lugar de kWh.",
  col_amber: "Ámbar",
  col_orange: "Naranja",
  col_red: "Rojo",
  col_pink: "Rosa",
  col_violet: "Violeta",
  col_blue: "Azul",
  col_teal: "Turquesa",
  col_green: "Verde",
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
}, ol = {
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
  // Pages and main dashboard
  pages: "Pages",
  page_home: "Home",
  page_new: "New page",
  page_add: "Page",
  page_settings: "Page",
  page_name_ph: "Lights",
  page_position: "Position",
  page_pos_of: "{n} of {m}",
  page_before: "‹ Before",
  page_after: "After ›",
  page_address: "Address",
  page_address_sub: "To open this page directly or from an automation",
  page_delete: "Delete page",
  page_delete_q: "Delete “{name}”?",
  page_delete_msg: "It has {n} cards. What should happen to them?",
  page_keep: "Move them to {home}",
  page_keep_sub: "Sections are kept",
  page_remove_all: "Delete them too",
  page_create: "Create",
  dash_main: "Main dashboard",
  dash_main_me: "Use as my main dashboard",
  dash_main_me_sub: "For your user, on all your devices",
  dash_main_all: "Main for the whole house",
  dash_main_all_sub: "For whoever hasn't chosen another one",
  dash_only: "Only this dashboard in my sidebar",
  dash_only_sub: "Hides every other sidebar entry for your user",
  dash_main_note: 'These options belong to each user: sign in with theirs (on their phone or the tablet, for example) and turn them on here. To keep other Terral dashboards out of their reach, mark those "Admins only".',
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
  dash_sidebar_note: `Every dashboard is its own entry in Home Assistant's sidebar. To make it the one that opens first, use "Main dashboard" below.`,
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
  // Doors and windows
  type_contact: "Doors and windows",
  type_contact_desc: "Open or closed, alerts and today's openings",
  contact_missing: "No door or window sensor in Home Assistant",
  other_contacts: "Other sensors",
  ct_open: "Open",
  ct_closed: "Closed",
  ct_ago: "for {t}",
  ct_since: "since {t}",
  ct_since_at: "Since {t}",
  ct_tampered: "Tampered",
  ct_opens: "{n} openings today",
  ct_opens_one: "1 opening today",
  ct_bat_low: "Low",
  ct_bat_ok: "OK",
  ct_group_title: "Doors and windows",
  ct_open_n: "{n} open",
  ct_open_one: "1 open",
  ct_closed_n: "{n} closed",
  ct_closed_one: "1 closed",
  ct_all_closed: "All closed",
  ct_alarm_hint: "If the alarm is armed with this open, the card turns red.",
  ct_alarm_now: "The alarm is armed and this is still open.",
  ct_openings: "Openings",
  ct_time_open: "Open for",
  ct_longest: "Longest",
  ct_no_openings: "No openings in the last 7 days",
  ct_open_now: "Open now",
  ct_was_open: "Closed · was open {t}",
  ct_sensor: "Sensor",
  ct_vibration: "Vibration",
  ct_vibration_sub: "Knocks or movement",
  ct_tamper: "Tampering",
  ct_tamper_sub: "Sensor cover",
  ct_detected: "Detected",
  ct_not_detected: "Not detected",
  ct_still: "Still",
  ct_node: "Status",
  ct_node_sub: "Z-Wave · {s}",
  ct_node_ok: "Responding",
  ct_node_dead: "Not responding",
  ct_sensor_entity: "Sensor",
  ct_kind: "What it is",
  ct_kind_door: "Door",
  ct_kind_window: "Window",
  ct_kind_balcony: "Balcony door",
  ct_kind_garage: "Garage",
  ct_alerts: "Alerts",
  ct_alert_after: "Alert if still open",
  ct_alert_after_sub: "The card turns red and counts the time",
  ct_never: "No",
  ct_alarm_warn: "Alert with the alarm armed",
  ct_alarm_warn_sub: "Red if open while the alarm is armed",
  ct_tamper_warn: "Tampering and vibration",
  ct_tamper_warn_sub: 'Red "!" on the icon',
  ct_show: "What to show",
  ct_show_temp: "Temperature",
  ct_show_battery: "Battery",
  ct_vent: "Ventilation",
  ct_tilt: "Tilted",
  ct_vent_n: "{n} in ventilation",
  ct_positions: "Positions",
  ct_pos_now: "Now",
  ct_pos_closed: "Closed",
  ct_pos_vent: "Ventilation",
  ct_pos_tilt: "Tilted",
  ct_pos_none: "Not recorded",
  ct_record: "Record",
  ct_rerecord: "Record again",
  ct_positions_note: 'Put the window in each position and tap Record: its X, Y, Z axes are saved. The card then shows "Ventilation" or "Tilted" even though the contact reads closed. Record "Closed" too to tell them apart better.',
  ct_group: "Group card",
  ct_group_add: "Add another sensor",
  ct_remove: "Remove",
  ct_group_note: "With more than one sensor the card sums them all up, open ones first. Allows the 4/2 size.",
  // Energy
  type_energy: "Home consumption",
  type_energy_desc: "Where the electricity goes: charger, air conditioning and the rest",
  energy_missing: "No power sensor in Home Assistant",
  en_title: "Home consumption",
  en_short: "Home",
  en_consumption: "Consumption",
  en_now: "Now",
  en_now_l: "now",
  en_kw_now: "kW now",
  en_grid: "Grid",
  en_rest: "Rest of the house",
  en_rest_sub: "Worked out: total − consumers",
  en_rest_off: "Needs a main meter",
  en_today_hours: "Today · per hour",
  en_by_consumer: "Per consumer · today",
  en_view: "View",
  en_view_flow: "Flow",
  en_view_ring: "Ring",
  en_view_bars: "Bars",
  en_view_note: "The same view on every card size and in the window.",
  en_total: "Total consumption of the house",
  en_total_none: "No main meter",
  en_total_none_sub: "The total will be the sum of the consumers",
  en_consumers: "Consumers",
  en_add: "Add consumer",
  en_consumer: "Consumer",
  en_color: "Colour",
  en_counter: "kWh counter, power worked out",
  en_sensor: "Power sensor",
  en_move_up: "Move up",
  en_move_down: "Move down",
  en_remove: "Remove consumer",
  en_choose_sensor: "Choose its sensor",
  en_animate: "Movement",
  en_animate_sub: "Faster the more it uses",
  en_consumers_note: "Each consumer with its power sensor, name, icon and colour.",
  // Switch
  type_switch: "Switch",
  type_switch_desc: "Water heater, plug, bug zapper… with log and consumption",
  switch_missing: "No switch in Home Assistant",
  other_switches: "Other switches",
  sw_entity: "Switch",
  sw_on: "On",
  sw_off: "Off",
  sw_since: "Since",
  sw_since_at: "Since {t}",
  sw_now: "Now",
  sw_today_l: "today",
  yesterday: "Yesterday",
  sw_on_time: "On for",
  sw_consumption: "Consumption",
  sw_times: "Times",
  sw_week_kwh: "Consumption · last 7 days",
  sw_week_hours: "Hours on · last 7 days",
  sw_no_meter: "no energy meter",
  sw_log: "Log",
  sw_no_log: "No changes in the last 7 days",
  sw_lasted: "was on {d}",
  sw_running: "running",
  sw_by_automation: 'by automation "{n}"',
  sw_by_script: 'by script "{n}"',
  sw_by_you: "by you",
  sw_by_ha: "from Home Assistant",
  sw_color: "Colour when on",
  sw_color_note: "The strong tone goes on the icon and a soft one on the card background.",
  sw_style: "Large card (2/2)",
  sw_style_a: "A · Data",
  sw_style_a_sub: "Since · Now · Today",
  sw_style_b: "B · Consumption",
  sw_style_b_sub: "Big power figure and consumption per hour",
  sw_style_c: "C · Timeline of the day",
  sw_style_c_sub: "Today's on periods, from 0 to 24 h",
  sw_icon: "Icon",
  sw_meter: "Consumption",
  sw_power: "Power",
  sw_energy: "Energy",
  sw_meter_note: "If the plug doesn't measure consumption, the window shows hours on instead of kWh.",
  col_amber: "Amber",
  col_orange: "Orange",
  col_red: "Red",
  col_pink: "Pink",
  col_violet: "Violet",
  col_blue: "Blue",
  col_teal: "Teal",
  col_green: "Green",
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
function F(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function r(t, e, s) {
  let i = (F(t) === "es" ? al : ol)[e] ?? e;
  if (s) for (const [n, a] of Object.entries(s)) i = i.replace(`{${n}}`, String(a));
  return i;
}
function ho(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return r(t, "just_now");
  if (s < 60) return r(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? r(t, "h_ago", { n: i }) : r(t, "days_ago", { n: Math.round(i / 24) });
}
const rl = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", it = (t, e = 24) => x`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${rl} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, Pn = (t = 24) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, xi = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, po = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, _s = (t, e = 16) => x`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, ll = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, St = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, cl = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, dl = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, $a = (t = 16) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, uo = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, Ut = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, Q = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, hl = (t = 26) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, pl = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, A = (t, e, s = 2) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, go = x`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, yi = (t = 24) => A(t, go), fo = (t = 24) => A(t, x`${go}<path d="M9 12l2 2 4-4"></path>`), sn = (t = 24) => A(t, x`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), ul = (t = 20) => A(t, x`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), Js = (t = 20) => A(t, x`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), gl = (t = 20) => A(t, x`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), fl = (t = 20) => A(t, x`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), _l = (t = 20) => A(t, x`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), ms = (t = 20) => A(t, x`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), ze = (t = 20) => A(t, x`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), ml = (t = 24) => A(t, x`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), bl = (t = 20) => A(t, x`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`), vi = (t = 24) => A(t, x`<path d="M5 21V5.5A2.5 2.5 0 0 1 7.5 3h5A2.5 2.5 0 0 1 15 5.5V21"></path><path d="M3 21h14"></path><path d="M15 10h1.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8.5L19 6"></path><path d="M10.5 6.5L8.6 10h2.8l-1.9 3.5"></path>`, 1.9), xl = (t = 18) => A(t, x`<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>`), ka = (t = 19) => A(t, x`<rect x="3" y="7" width="16" height="10" rx="2.5"></rect><path d="M21 11v2"></path><path d="M7 10.5v3M10.5 10.5v3"></path>`), yl = (t = 19) => A(t, x`<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>`), _o = (t = 20) => A(t, x`<path d="M15 6l-6 6 6 6"></path>`, 2.4), vl = (t = 22) => A(t, x`<circle cx="12" cy="12" r="8.5"></circle><path d="M9 16l3-8 3 8M10 13.5h4"></path>`), wl = (t = 22) => A(t, x`<path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11"></path><path d="M9.5 4L12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"></path>`), $l = (t = 22) => A(t, x`<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-3 4-3 6-1-1-2-2-2.5-3.5C7.5 9.5 5 12 5 15a7 7 0 0 0 7 7z"></path>`), kl = (t = 22) => A(t, x`<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path><path d="M9.5 15.5l5-5"></path>`), nn = (t = 22) => A(t, x`<circle cx="12" cy="12" r="1.8"></circle><path d="M12 10.2C11 6 13 3 15.5 4.2S15 9 12 10.2zM13.8 12c4.2-1 7.2 1 6 3.5S15 15 13.8 12zM12 13.8c1 4.2-1 7.2-3.5 6S9 15 12 13.8zM10.2 12c-4.2 1-7.2-1-6-3.5S9 9 10.2 12z"></path>`), Ml = (t = 22) => A(t, x`<path d="M8 20V4M4.5 7.5L8 4l3.5 3.5"></path><path d="M16 4v16M12.5 16.5L16 20l3.5-3.5"></path>`), bs = (t = 22) => A(t, x`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`), Ln = (t = 20) => A(t, x`<path d="M6 12h12"></path>`, 2.4), Wn = (t = 20) => A(t, x`<path d="M12 6v12M6 12h12"></path>`, 2.4), xs = (t = 24) => A(t, x`<circle cx="12" cy="12" r="9"></circle><path d="M5.6 8.2a8 8 0 0 1 12.8 0"></path><circle cx="12" cy="12.6" r="2.6"></circle><circle cx="15.6" cy="16.8" r=".6" fill="currentColor"></circle>`, 1.9), Vs = (t = 20) => A(t, x`<path d="M7 4.5v15l12-7.5z" fill="currentColor"></path>`, 1.6), mo = (t = 20) => A(t, x`<path d="M8 5v14M16 5v14"></path>`, 3), bo = (t = 20) => A(t, x`<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path><circle cx="12" cy="10" r="2.3"></circle>`), xo = (t = 14) => A(t, x`<path d="M12 5v9"></path><path d="M12 18.5h.01"></path>`, 3.2), Sl = (t = 18) => A(t, x`<path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8z"></path><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"></path>`), Cl = (t = 18) => A(t, x`<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"></path>`), zl = (t = 18) => A(t, x`<path d="M6 3v7a2 2 0 0 0 2 2v9M8 3v6M10 3v7a2 2 0 0 1-2 2"></path><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"></path>`), Al = (t = 18) => A(t, x`<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"></path><circle cx="7" cy="11.5" r="1.8"></circle>`), Tl = (t = 18) => A(t, x`<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"></path><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"></path><path d="M6 18v2M18 18v2"></path>`), Dl = (t = 18) => A(t, x`<circle cx="7" cy="10" r="1.6"></circle><circle cx="10.5" cy="6.5" r="1.6"></circle><circle cx="14.5" cy="6.5" r="1.6"></circle><circle cx="18" cy="10" r="1.6"></circle><path d="M12.5 12c2.5 0 5 3.3 5 5.5 0 1.6-1.4 2.5-3 2.1-1.3-.3-2.7-.3-4 0-1.6.4-3-.5-3-2.1 0-2.2 2.5-5.5 5-5.5z"></path>`), Ol = (t, e = !1, s = 16) => A(s, x`<rect x="2.5" y="7" width="16.5" height="10" rx="2.5"></rect><path d="M21.5 10.5v3"></path>
    ${e ? x`<path d="M11.5 8.6L8.6 12.4h3.2l-1.3 3" stroke-width="1.8"></path>` : [0, 1, 2, 3].slice(0, t).map((i) => x`<rect x=${4.6 + i * 3.4} y="9.2" width="2.3" height="5.6" rx=".6" fill="currentColor" stroke="none"></rect>`)}`);
var El = Object.defineProperty, jl = Object.getOwnPropertyDescriptor, ht = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? jl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && El(e, s, n), n;
};
let tt = class extends B {
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
tt.styles = E`
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
ht([
  $({ type: Number })
], tt.prototype, "value", 2);
ht([
  $({ type: Number })
], tt.prototype, "min", 2);
ht([
  $({ type: Number })
], tt.prototype, "max", 2);
ht([
  $({ type: Boolean, reflect: !0 })
], tt.prototype, "vertical", 2);
ht([
  $()
], tt.prototype, "mode", 2);
ht([
  $()
], tt.prototype, "label", 2);
ht([
  $()
], tt.prototype, "suffix", 2);
ht([
  $({ type: Boolean, attribute: "show-value" })
], tt.prototype, "showValue", 2);
ht([
  w()
], tt.prototype, "_drag", 2);
tt = ht([
  j("terral-slider")
], tt);
const yo = ["hs", "rgb", "rgbw", "rgbww", "xy"], In = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], an = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function vo(t) {
  return t.attributes.supported_color_modes ?? [];
}
function Ys(t) {
  const e = vo(t);
  return e.some((s) => yo.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Nl(t) {
  return vo(t).includes("color_temp");
}
function I(t) {
  return t?.state === "on";
}
function Vt(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function Ft(t) {
  const e = t.attributes.brightness;
  if (!(!I(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function ut(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function Ma(t) {
  return ut(t).length > 0;
}
function ys(t) {
  return t.attributes.color_temp_kelvin;
}
function Ae(t) {
  if (!I(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !yo.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const Sa = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, Ke = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), Qe = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, Pl = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, Ll = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function wo(t, e) {
  if (!e) return Sa;
  const s = Ae(t);
  if (!s) {
    const a = ys(t);
    return a && t.attributes.color_mode === "color_temp" && a >= 4500 ? Pl : Sa;
  }
  const i = [255, 255, 255], n = Ll(s) > 0.75 ? Ke(s, [40, 50, 80], 0.45) : s;
  return {
    bg: Qe(Ke(s, i, 0.84), 0.95),
    fg: Qe(Ke(s, [10, 10, 20], 0.82)),
    fg2: Qe(Ke(s, [20, 10, 30], 0.72)),
    accent: Qe(n),
    fill: Qe(Ke(n, i, 0.35))
  };
}
function rs(t, e) {
  return t.callService("light", I(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function Ei(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function on(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function ti(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, n = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(n, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function Ca(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function Wl(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function rt(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function rn(t, e) {
  let s;
  for (const i of In) {
    const n = i.rgb.reduce((a, o, l) => a + (o - t[l]) ** 2, 0);
    (!s || n < s.d) && (s = { d: n, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function Gs(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function za(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const n = getComputedStyle(i).overflowY;
    if ((n === "auto" || n === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function $o(t) {
  let e = 0;
  const s = (a) => {
    e = a.touches[0]?.clientY ?? 0;
  }, i = (a) => {
    if (!a.cancelable) return;
    const o = a.touches[0]?.clientY ?? e;
    za(a.composedPath(), t, o - e) || a.preventDefault();
  }, n = (a) => {
    za(a.composedPath(), t, -a.deltaY) || a.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", n, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", n);
  };
}
var Il = Object.defineProperty, Hl = Object.getOwnPropertyDescriptor, yt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Hl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Il(e, s, n), n;
};
let Te;
function Rl(t, e) {
  Te?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), Te = s;
}
function ql(t) {
  Te?.isConnected && (Te.hass = t);
}
let nt = class extends B {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = $o(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), Te === this && (Te = void 0);
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
    if (Vt(t)) return r(this.hass, "unavailable");
    if (!I(t)) return r(this.hass, "off");
    const e = [], s = ut(t);
    if (s.length) {
      const o = s.filter((l) => I(this.hass.states[l])).length;
      e.push(`${o} ${r(this.hass, "of")} ${s.length} ${r(this.hass, "lit")}`);
    }
    const i = Ft(t);
    i != null && e.push(`${i} %`);
    const n = Ae(t), a = ys(t);
    if (n) {
      const o = rn(n, F(this.hass));
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
    const e = I(t), s = wo(t, this.opts.useLightColor !== !1), i = ut(t), n = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, a = this._controls(t), o = i.length ? this._memberList(t, i) : f, l = this._info(t);
    return d`
      <div class="body" style=${n}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${_s(!1, 18)}
              </button>` : f}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            ?disabled=${Vt(t)}
            @click=${() => rs(this.hass, t)}
          >
            ${it(e, this._wide ? 28 : 24)}
            ${i.length && e ? d`<span class="badge">${i.filter((c) => I(this.hass.states[c])).length}</span>` : f}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${Gs(this.hass, t.entity_id) ? ` · ${Gs(this.hass, t.entity_id)}` : ""}</span>
          </div>
          ${this.opts.onSettings ? d`<button class="round gear" aria-label=${r(this.hass, "settings")} @click=${() => {
      const c = this.opts.onSettings;
      this.close(), c();
    }}>${Q(this._wide ? 22 : 18)}</button>` : f}
          <button class="round close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>
            ${xi(this._wide ? 22 : 16)}
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
    const e = Ys(t), s = I(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            @click=${() => rs(this.hass, t)}>
            <span>${Pn(36)}</span>
          </button>`,
        side: f
      };
    const n = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${Ft(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(p) => on(this.hass, i, p.detail.value)}
    >${po(28)}</terral-slider>`, a = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (p) => d`<button class="chip" @click=${() => on(this.hass, i, p)}>${p} %</button>`
    )}
    </div>`, o = d`<div class="chips">
      ${an.map(
      (p) => d`<button class="chip tinted" style="background:${p.css}" @click=${() => ti(this.hass, t, p.kelvin)}>
          ${r(this.hass, p.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: n, side: a };
    if (e === "temperature") {
      const p = t.attributes.min_color_temp_kelvin ?? 2e3, _ = t.attributes.max_color_temp_kelvin ?? 6500, b = d`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${p}
        .max=${_}
        .value=${ys(t) ?? Math.round((p + _) / 2)}
        .label=${r(this.hass, "temperature")}
        @value-changed=${(g) => ti(this.hass, t, g.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${n}${b}</div>`, side: o } : { main: d`<div class="pair">${n}${b}</div>`, side: o };
    }
    const l = F(this.hass), c = (this.opts.favorites?.length ? this.opts.favorites : In.map((p) => ({ name: p.name[l], rgb: p.rgb }))).slice(0, 6), h = Ae(t), u = d`
      <p class="lb">${r(this.hass, "favorites")}</p>
      <div class="swatches">
        ${c.map(
      (p) => d`<button
            class="sw ${h && rt(h) === rt(p.rgb) ? "sel" : ""}"
            style="background:${rt(p.rgb)}"
            aria-label=${p.name ?? rt(p.rgb)}
            @click=${() => Ca(this.hass, i, p.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${r(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${h ? rt(h) : "#ffffff"} @change=${(p) => Ca(this.hass, i, Wl(p.target.value))} />
      ${Nl(t) ? d`<p class="lb">${r(this.hass, "temperature")}</p>${o}` : f}
    `;
    return this._wide ? { main: n, side: u } : { main: n, side: f, beside: d`<div class="beside">${u}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const c of e) {
      const h = Gs(this.hass, c) ?? r(this.hass, "other_area");
      i.set(h, [...i.get(h) ?? [], c]);
    }
    const n = s === "always" || s === "auto" && e.length > 8 && i.size > 1, a = e.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => Ei(this.hass, t.entity_id, !0)}>${r(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => Ei(this.hass, t.entity_id, !1)}>${r(this.hass, "all_off")}</button>
        </div>` : f, o = (c) => {
      const h = this.hass.states[c], u = I(h), p = h ? this.hass.formatEntityName?.(h) ?? h.attributes.friendly_name ?? c : c;
      return d`<div class="mr">
        <button class="mi ${u ? "on" : ""}" ?disabled=${Vt(h)}
          aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${p}"
          @click=${() => h && rs(this.hass, h)}>${it(u, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, c]}>
          <span>${p}</span><small>${h ? this._stateText(h) : r(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, l = (c) => [...c].sort((h, u) => Number(I(this.hass.states[u])) - Number(I(this.hass.states[h])));
    return d`
      ${a}
      <p class="lb">${r(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${n ? [...i.entries()].map(([c, h]) => {
      const u = this._openAreas.has(c), p = h.filter((_) => I(this.hass.states[_])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${p ? "on" : ""}" aria-label="${p ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${c}"
                    @click=${() => Ei(this.hass, h, p === 0)}>${it(p > 0, 18)}</button>
                  <button class="mt" aria-expanded=${u} @click=${() => {
        const _ = new Set(this._openAreas);
        u ? _.delete(c) : _.add(c), this._openAreas = _;
      }}>
                    <span>${c} <small>${p} ${r(this.hass, "of")} ${h.length}</small></span>${_s(u)}
                  </button>
                </div>
                ${u ? d`<div class="inner">${h.map(o)}</div>` : f}
              </div>`;
    }) : d`<div class="box">${l(e).map(o)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return d`<div class="info">
      <div><span>${r(this.hass, "last_activity")}</span><span>${ho(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
nt.styles = E`
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
yt([
  $({ attribute: !1 })
], nt.prototype, "hass", 2);
yt([
  $({ attribute: !1 })
], nt.prototype, "opts", 2);
yt([
  w()
], nt.prototype, "_stack", 2);
yt([
  w()
], nt.prototype, "_expanded", 2);
yt([
  w()
], nt.prototype, "_closing", 2);
yt([
  w()
], nt.prototype, "_wide", 2);
yt([
  w()
], nt.prototype, "_openAreas", 2);
yt([
  nl("input[type=color]")
], nt.prototype, "_picker", 2);
nt = yt([
  j("terral-light-dialog")
], nt);
var Ul = Object.defineProperty, Hn = (t, e, s, i) => {
  for (var n = void 0, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = o(e, s, n) || n);
  return n && Ul(e, s, n), n;
};
const da = class da extends B {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = $o(this);
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
          <button class="close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>${xi(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
da.styles = E`
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
let D = da;
Hn([
  $({ attribute: !1 })
], D.prototype, "hass");
Hn([
  w()
], D.prototype, "_wide");
Hn([
  w()
], D.prototype, "_closing");
const ji = ["switch", "lock", "input_boolean"], ls = (t) => t.split(".")[0], Jt = (t) => ls(t) === "lock";
function Fl(t, e = !1) {
  const s = Jt(t.entity_id) ? t.state === "locked" : t.state === "on", i = Jt(t.entity_id);
  return s === i !== e;
}
function ln(t, e, s, i = !1) {
  const n = e.entity_id, a = Jt(n) ? !i : i, o = s ? a : !a;
  return Jt(n) ? t.callService("lock", o ? "lock" : "unlock", {}, { entity_id: n }) : t.callService(ls(n), o ? "turn_on" : "turn_off", {}, { entity_id: n });
}
const Bl = (t, e = !1) => (Jt(t) ? !e : e) ? "active" : "inactive", Rn = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function qn(t, e) {
  const s = e ? t.states[e] : void 0;
  if (Rn(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kW");
  return n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
function ko(t, e) {
  const s = e ? t.states[e] : void 0;
  if (Rn(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kWh");
  return n === "Wh" ? i / 1e3 : n === "MWh" ? i * 1e3 : i;
}
const be = 0.05;
function Vl(t, e) {
  const s = qn(t, e.power), i = e.status ? t.states[e.status] : void 0;
  if (i && !Rn(i)) {
    if (i.entity_id.startsWith("binary_sensor."))
      return i.state !== "on" ? "none" : s != null && s > be ? "charging" : "connected";
    const n = String(i.state).toLowerCase();
    if (/discharg/.test(n)) return "connected";
    if (/charging|cargando|en carga/.test(n)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(n))
      return s != null && s > be ? "charging" : "none";
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(n))
      return s != null && s > be ? "charging" : "connected";
  }
  return s != null && s > be ? "charging" : "unknown";
}
function wi(t, e) {
  const s = t.entities?.[e]?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => i !== e && n.device_id === s).map(([i]) => i) : [];
}
const Un = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), Fn = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(Un(t, e)), Bn = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(Un(t, e)), Mo = (t, e) => {
  const s = t.states[e];
  return s ? e.startsWith("binary_sensor.") ? ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(e) : e.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state)) : !1;
};
function Vn(t, e) {
  const s = wi(t, e.entity), i = (a, o) => {
    const l = s.filter((c) => t.states[c] && a(c));
    return o && l.find((c) => o.test(c)) || l[0];
  }, n = (a, o) => a === "none" ? void 0 : a || o();
  return {
    status: n(e.status_entity, () => i((a) => Mo(t, a), /status|estado/i)),
    power: n(e.power_entity, () => i((a) => Fn(t, a), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: n(e.energy_entity, () => i((a) => Bn(t, a), /added|session|sesion|sesión|charge|carga/i))
  };
}
function Aa(t, e) {
  if (Jt(e)) return !1;
  const s = String(t.states[e]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(e + " " + s);
}
async function So(t, e, s) {
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  }), n = Un(t, e), a = n === "W" ? 1 / 1e3 : n === "MW" ? 1e3 : 1;
  return (i[e] ?? []).map((o) => [o.lu * 1e3, Number(o.s) * a]).filter(([, o]) => Number.isFinite(o));
}
function Co(t, e = Date.now()) {
  const s = [];
  let i;
  for (let n = 0; n < t.length; n++) {
    const [a, o] = t[n], l = n + 1 < t.length ? t[n + 1][0] : e, c = Math.max(0, l - a) / 36e5;
    o > be && (i && a - i.end > 15 * 6e4 && (s.push(i), i = void 0), i ??= { start: a, end: a, kwh: 0, maxKw: 0, live: !1 }, i.kwh += o * c, i.end = l, i.maxKw = Math.max(i.maxKw, o));
  }
  return i && (i.live = t.length > 0 && t[t.length - 1][1] > be, s.push(i)), s.filter((n) => n.kwh >= 0.05 || n.live);
}
function zo(t, e = 7, s = /* @__PURE__ */ new Date()) {
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
const lt = (t, e, s = 1) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), cn = (t) => {
  const e = Math.max(0, Math.round(t / 6e4));
  return `${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")} min`;
};
var Yl = Object.defineProperty, Gl = Object.getOwnPropertyDescriptor, Ao = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Gl(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Yl(e, s, n), n;
};
let ei = class extends D {
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
ei.styles = [
  D.styles,
  E`
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
Ao([
  $({ attribute: !1 })
], ei.prototype, "options", 2);
ei = Ao([
  j("terral-confirm-sheet")
], ei);
function vs(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const Ta = ["auto", "heat_cool", "cool", "heat", "dry", "fan_only"], Xl = {
  auto: { t: !0, f: !0 },
  heat_cool: { t: !0, f: !1 },
  cool: { t: !0, f: !0 },
  heat: { t: !0, f: !0 },
  dry: { t: !1, f: !1 },
  fan_only: { t: !1, f: !0 }
}, Kl = {
  cool: [70, 150, 255],
  heat: [255, 140, 60],
  auto: [52, 199, 123],
  heat_cool: [52, 199, 123],
  dry: [40, 190, 200],
  fan_only: [140, 160, 200]
}, $i = { TARGET: 1, FAN: 8, SWING: 32, TURN_ON: 256 }, ki = (t, e) => (Number(t.attributes.supported_features ?? 0) & e) !== 0, Y = (t) => t.state === "off" || t.state === "unavailable" || t.state === "unknown", xe = (t) => t.state === "unavailable" || t.state === "unknown";
function Tt(t) {
  const e = (t.attributes.hvac_modes ?? []).filter((i) => i !== "off"), s = (i) => Ta.includes(i) ? Ta.indexOf(i) : 99;
  return [...e].sort((i, n) => s(i) - s(n));
}
const ws = (t) => ki(t, $i.FAN) || t.attributes.fan_modes ? t.attributes.fan_modes ?? [] : [], Ql = (t) => (t.attributes.preset_modes ?? []).filter((e) => e !== "none"), To = (t) => ki(t, $i.SWING) || (t.attributes.swing_modes?.length ?? 0) > 0;
function Do(t, e = t.state) {
  return e === "heat_cool" || t.attributes.target_temp_low != null && t.attributes.target_temp_high != null && t.attributes.temperature == null && e !== "off";
}
function si(t, e) {
  return t.mode_rules?.[e] ?? Xl[e] ?? { t: !0, f: !0 };
}
function ye(t, e) {
  return Y(t) || !si(e, t.state).t ? !1 : Do(t) ? t.attributes.target_temp_low != null : t.attributes.temperature != null || ki(t, $i.TARGET);
}
function Oo(t, e) {
  return !Y(t) && si(e, t.state).f && ws(t).length > 0;
}
function cs(t, e) {
  const s = Number(t.attributes.min_temp ?? 7), i = Number(t.attributes.max_temp ?? 35), n = Math.max(s, e.min_temp ?? s), a = Math.min(i, e.max_temp ?? i), o = e.temp_step ?? Number(t.attributes.target_temp_step ?? (t.attributes.temperature_unit === "°F" ? 1 : 0.5));
  return { min: n, max: Math.max(n + o, a), step: o, hwMin: s, hwMax: i };
}
const Yt = (t, e) => Math.min(e.max, Math.max(e.min, Math.round(t / e.step) * e.step)), ds = (t) => t.attributes.current_temperature != null ? Number(t.attributes.current_temperature) : null, Zl = (t) => t.attributes.current_humidity != null ? Number(t.attributes.current_humidity) : null, Eo = /* @__PURE__ */ new Map(), jo = (t) => {
  Y(t) || Eo.set(t.entity_id, t.state);
};
function Yn(t, e) {
  const s = Eo.get(e.entity_id);
  if (s && Tt(e).includes(s)) return $s(t, e, s);
  if (ki(e, $i.TURN_ON)) return t.callService("climate", "turn_on", {}, { entity_id: e.entity_id });
  const i = Tt(e).includes("cool") ? "cool" : Tt(e)[0];
  return i ? $s(t, e, i) : Promise.resolve();
}
function Gn(t, e) {
  return jo(e), e.attributes.hvac_modes?.includes("off") ? $s(t, e, "off") : t.callService("climate", "turn_off", {}, { entity_id: e.entity_id });
}
const $s = (t, e, s) => t.callService("climate", "set_hvac_mode", { hvac_mode: s }, { entity_id: e.entity_id }), No = (t, e, s) => t.callService("climate", "set_fan_mode", { fan_mode: s }, { entity_id: e.entity_id }), Jl = (t, e, s) => t.callService("climate", "set_preset_mode", { preset_mode: s }, { entity_id: e.entity_id });
function tc(t, e, s) {
  const i = e.attributes.swing_modes ?? ["on", "off"], n = s ? i.find((a) => a !== "off") ?? "on" : i.includes("off") ? "off" : i[0];
  return t.callService("climate", "set_swing_mode", { swing_mode: n }, { entity_id: e.entity_id });
}
function Po(t, e, s) {
  const i = typeof s == "number" ? { temperature: s } : { target_temp_low: s.low, target_temp_high: s.high };
  return t.callService("climate", "set_temperature", i, { entity_id: e.entity_id });
}
const Lo = {
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
}, ec = {
  auto: "Auto",
  heat_cool: "Heat/cool",
  cool: "Cool",
  heat: "Heat",
  dry: "Dry",
  fan_only: "Fan only"
}, sc = { cool: "Enfriando", heat: "Calentando", dry: "Deshumidificando", fan_only: "Ventilando", auto: "Automático", heat_cool: "Manteniendo" }, ic = { cool: "Cooling", heat: "Heating", dry: "Drying", fan_only: "Fan", auto: "Auto", heat_cool: "Keeping" }, Wo = (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " "), ct = (t, e) => (t === "es" ? Lo[e] : ec[e]) ?? Wo(e), dn = (t, e) => (t === "es" ? Lo[e.toLowerCase()] : void 0) ?? Wo(e), hn = (t, e) => (t === "es" ? sc[e] : ic[e]) ?? ct(t, e);
function nc(t, e) {
  if (!e) return "";
  if (/auto/i.test(e)) return "A";
  const i = t.filter((n) => !/auto/i.test(n)).indexOf(e);
  return i >= 0 ? String(i + 1) : e.charAt(0).toUpperCase();
}
function ve(t, e = 22) {
  switch (t) {
    case "auto":
      return vl(e);
    case "cool":
      return wl(e);
    case "heat":
      return $l(e);
    case "dry":
      return kl(e);
    case "fan_only":
      return nn(e);
    case "heat_cool":
      return Ml(e);
    case "off":
      return Pn(e);
    default:
      return bs(e);
  }
}
const Ws = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), ue = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function Io(t) {
  if (Y(t)) return "";
  const e = Kl[t.state] ?? [140, 160, 200];
  return `--bg:${ue(Ws(e, [255, 255, 255], 0.84), 0.95)};--bg-solid:${ue(Ws(e, [255, 255, 255], 0.84))};--fg:${ue(Ws(e, [10, 10, 20], 0.82))};--fg2:${ue(Ws(e, [20, 10, 30], 0.7))};--accent:${ue(e)};--arc:${ue(e)}`;
}
function pn(t) {
  if (Do(t)) {
    const e = t.attributes.target_temp_low, s = t.attributes.target_temp_high;
    return e != null && s != null ? { low: Number(e), high: Number(s) } : null;
  }
  return t.attributes.temperature != null ? Number(t.attributes.temperature) : null;
}
const Dt = (t, e) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), ks = (t, e) => e == null ? "" : typeof e == "number" ? `${Dt(t, e)}°` : `${Dt(t, e.low)}–${Dt(t, e.high)}°`;
function Da(t, e, s, i, n) {
  const a = F(t), o = ds(e), l = o != null ? `${Dt(t, o)}° ${a === "es" ? "dentro" : "inside"}` : "";
  if (xe(e)) return a === "es" ? "Sin respuesta" : "Not responding";
  if (Y(e)) {
    const u = a === "es" ? "Apagado" : "Off";
    return n || !l ? u : `${u} · ${l}`;
  }
  const c = ye(e, s) ? ks(t, i) : "";
  if (n) return c || ct(a, e.state);
  const h = c ? `${hn(a, e.state)} ${a === "es" ? "a" : "to"} ${c}` : hn(a, e.state);
  return l ? `${h} · ${l}` : h;
}
function Ho(t, e) {
  const s = Zl(e);
  return s != null ? `${Math.round(s)} % ${F(t) === "es" ? "humedad" : "humidity"}` : "";
}
const ac = { PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 }, At = (t, e) => ((Number(t.attributes.supported_features) || 0) & ac[e]) !== 0;
function te(t) {
  if (!t || t.state === "unavailable" || t.state === "unknown") return "unavailable";
  const e = t.state;
  return e === "cleaning" || e === "paused" || e === "returning" || e === "docked" || e === "error" ? e : "idle";
}
const Ms = (t, e) => t.entities?.[e];
function Ro(t, e) {
  const s = Ms(t, e)?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => n.device_id === s && i !== e && t.states[i]).map(([i]) => i) : [];
}
function qo(t, e) {
  const s = Ro(t, e), i = (a, o, l, c = () => !0) => s.find((h) => h.startsWith(a) && o.includes(String(Ms(t, h)?.translation_key)) && c(h)) ?? s.find((h) => h.startsWith(a) && l.test(h) && c(h)), n = (a) => String(t.states[a]?.attributes.unit_of_measurement ?? "");
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
const Mi = (t, e) => {
  if (!e) return null;
  const s = parseFloat(t.states[e]?.state ?? "");
  return Number.isFinite(s) ? s : null;
};
function oc(t, e, s) {
  const i = Mi(t, s.battery) ?? parseFloat(e.attributes.battery_level);
  return Number.isFinite(i) ? Math.round(i) : null;
}
const Xn = (t, e) => {
  const s = Mi(t, e.progress);
  return s == null ? null : Math.max(0, Math.min(100, Math.round(s)));
}, rc = (t, e) => Mi(t, e.area);
function lc(t, e) {
  const s = Mi(t, e.time);
  if (s == null) return null;
  const i = String(t.states[e.time]?.attributes.unit_of_measurement ?? "s");
  return Math.round(i === "h" ? s * 60 : i === "min" ? s : s / 60);
}
function cc(t, e) {
  const s = e.room ? t.states[e.room]?.state : void 0;
  return s && !["unknown", "unavailable", "none", ""].includes(s) ? s : void 0;
}
function Uo(t, e, s) {
  const i = s.error ? t.states[s.error]?.state : void 0;
  return i && !["none", "unknown", "unavailable", "ok", ""].includes(i) ? i : te(e) === "error" && String(e.attributes.error ?? e.attributes.status ?? "") || void 0;
}
const Kn = (t) => Array.isArray(t.attributes.fan_speed_list) ? t.attributes.fan_speed_list : [], ii = (t, e) => e && Array.isArray(t.states[e]?.attributes.options) ? t.states[e].attributes.options : [], Fo = /* @__PURE__ */ new Map(), Bo = /* @__PURE__ */ new Map();
function dc(t, e, s) {
  const i = e.attributes.fan_speed;
  i && i !== "off" && Fo.set(e.entity_id, i);
  const n = s.mopIntensity ? t.states[s.mopIntensity]?.state : void 0;
  n && n !== "off" && n !== "unavailable" && Bo.set(e.entity_id, n);
}
function hc(t, e, s) {
  const i = Kn(e), n = ii(t, s.mopIntensity);
  if (!n.length) return { modes: [], current: "vacuum" };
  const a = i.includes("off"), l = [...n.includes("off") ? ["vacuum"] : [], ...a ? ["mop"] : [], "both"], c = e.attributes.fan_speed === "off", h = t.states[s.mopIntensity]?.state === "off", u = c && !h ? "mop" : h ? "vacuum" : "both";
  return { modes: l.length > 1 ? l : [], current: u };
}
const Oa = (t, e) => e.find((s) => t.includes(s)) ?? t.find((s) => s !== "off");
async function pc(t, e, s, i) {
  const n = Kn(e), a = ii(t, s.mopIntensity), o = Fo.get(e.entity_id) ?? Oa(n, ["balanced", "standard", "medium"]), l = Bo.get(e.entity_id) ?? Oa(a, ["moderate", "medium", "standard", "mild"]), c = (u) => u && e.attributes.fan_speed !== u && t.callService("vacuum", "set_fan_speed", { fan_speed: u }, { entity_id: e.entity_id }), h = (u) => u && s.mopIntensity && t.states[s.mopIntensity]?.state !== u && t.callService("select", "select_option", { option: u }, { entity_id: s.mopIntensity });
  i === "vacuum" ? await Promise.all([h("off"), e.attributes.fan_speed === "off" ? c(o) : void 0]) : i === "mop" ? await Promise.all([c("off"), t.states[s.mopIntensity]?.state === "off" ? h(l) : void 0]) : await Promise.all([e.attributes.fan_speed === "off" ? c(o) : void 0, t.states[s.mopIntensity]?.state === "off" ? h(l) : void 0]);
}
const He = (t, e, s, i = {}) => t.callService("vacuum", s, i, { entity_id: e.entity_id }), is = (t, e) => He(t, e, "start"), un = (t, e) => He(t, e, "pause"), gn = (t, e) => He(t, e, "return_to_base"), Vo = (t, e) => He(t, e, "locate"), uc = (t, e, s) => He(t, e, "set_fan_speed", { fan_speed: s }), Ea = (t, e, s) => t.callService("select", "select_option", { option: s }, { entity_id: e }), gc = (t, e, s) => He(t, e, "send_command", { command: "app_segment_clean", params: [{ segments: s, repeat: 1 }] }), Is = /* @__PURE__ */ new Map();
function fc(t, e, s) {
  if (Ms(t, e.entity_id)?.platform !== "roborock") return Promise.resolve([]);
  const i = s.map ? t.states[s.map]?.state : void 0, n = `${e.entity_id}|${i ?? ""}`;
  return Is.has(n) || Is.set(
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
    }).catch(() => (Is.delete(n), []))
  ), Is.get(n);
}
function Qn(t, e) {
  return Ro(t, e).filter((s) => s.startsWith("button.") && !Ms(t, s)?.entity_category && !Ms(t, s)?.hidden);
}
function Yo(t, e) {
  const s = Qn(t, e.entity), i = (e.routines ?? []).filter((n) => !s.includes(n) && t.states[n]);
  return [...s, ...i];
}
function ja(t, e) {
  const s = (e.routines ?? []).filter((i) => t.states[i]);
  return (s.length ? s : Qn(t, e.entity)).slice(0, 3);
}
const fn = (t, e) => e.startsWith("script.") ? t.callService("script", "turn_on", {}, { entity_id: e }) : t.callService("button", "press", {}, { entity_id: e });
function ni(t, e, s) {
  const i = String(t.states[e]?.attributes.friendly_name ?? e.split(".")[1].replace(/_/g, " "));
  return s && i.toLowerCase().startsWith(s.toLowerCase() + " ") ? i.slice(s.length + 1) : i;
}
const _c = (t, e) => e.startsWith("script.") && /(aspir|robot|vacuum|roborock|limpi|freg|mop|clean)/i.test(e + " " + (t.states[e]?.attributes.friendly_name ?? "")), Hs = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] * (1 - s) + e[i] * s)), Ze = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, mc = [34, 165, 135], bc = [90, 157, 240], xc = [224, 86, 75];
function Go(t) {
  const e = t === "cleaning" || t === "paused" ? mc : t === "returning" ? bc : t === "error" ? xc : null;
  return e ? `--bg:${Ze(Hs(e, [255, 255, 255], 0.86), 0.95)};--bg-solid:${Ze(Hs(e, [255, 255, 255], 0.86))};--fg:${Ze(Hs(e, [10, 10, 20], 0.8))};--fg2:${Ze(Hs(e, [20, 10, 30], 0.68))};--accent:${Ze(e)}` : "";
}
const Zn = (t) => t === "cleaning" || t === "paused" || t === "returning" || t === "error";
function yc(t, e) {
  const s = t >= 80 ? 4 : t >= 60 ? 3 : t >= 40 ? 2 : t >= 20 ? 1 : 0, i = t < 20 ? e ? "#a32d2d" : "#ff9b93" : t < 40 ? e ? "#854f0b" : "#ffd27a" : e ? "#0f6e56" : "#9ff0d0";
  return { bars: s, color: i };
}
function Xo(t, e, s, i, n = 16) {
  const a = oc(t, e, s);
  if (a == null) return null;
  const o = te(e), { bars: l, color: c } = yc(a, Zn(o)), h = o === "docked" && a < 100;
  return { pct: a, color: c, icon: Ol(l, h, n), text: i ? `${a} %` : String(a) };
}
const vc = {
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
function Ni(t, e) {
  const s = e.toLowerCase().replace(/[\s-]+/g, "_"), i = vc[s];
  if (i) return i[F(t) === "es" ? 0 : 1];
  const n = e.replace(/_/g, " ");
  return n.charAt(0).toUpperCase() + n.slice(1);
}
const wc = [
  [/(cocin|kitchen)/i, zl],
  [/(dorm|bed|habitac|cuarto)/i, Al],
  [/(salon|salón|living|comedor|sofa)/i, Tl],
  [/(freg|mop|agua|water|fondo|deep)/i, Cl],
  [/(mascot|pet|pelo|perro|gato)/i, Dl]
], ai = (t, e = 18) => (wc.find(([s]) => s.test(t))?.[1] ?? Sl)(e), $c = {
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
function Ko(t, e) {
  const s = $c[e];
  if (s) return s[F(t) === "es" ? 0 : 1];
  const i = e.replace(/_/g, " ");
  return i.charAt(0).toUpperCase() + i.slice(1);
}
function Pi(t, e) {
  return r(t, `vac_${e}`);
}
function Qo(t, e, s = !0) {
  const i = t.locale?.language ?? t.language, n = Xn(t, e), a = rc(t, e), o = lc(t, e);
  return [
    s && n != null ? `${n} %` : "",
    a != null ? `${a.toLocaleString(i, { maximumFractionDigits: 1 })} m²` : "",
    o != null ? `${o} min` : ""
  ].filter(Boolean).join(" · ");
}
function Xs(t, e, s, i = !1) {
  const n = te(e), a = cc(t, s);
  if (i && n === "cleaning") {
    const o = Xn(t, s);
    if (o != null) return `${o} %`;
  }
  if (n === "error" && !i) {
    const o = Uo(t, e, s);
    return [Pi(t, n), a ?? (o ? Ko(t, o) : "")].filter(Boolean).join(" · ");
  }
  return n === "cleaning" && a && !i ? `${Pi(t, n)} · ${a}` : Pi(t, n);
}
const Na = {
  plug: () => x`<path d="M9 3v5M15 3v5"></path><path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0z"></path><path d="M12 16.5V21"></path>`,
  boiler: (t) => x`<rect x="6" y="2.5" width="12" height="16.5" rx="5"></rect><path d="M9.5 19v2.5M14.5 19v2.5"></path><path d="M12 7.6c1.5 1.6 2.2 2.7 2.2 3.9a2.2 2.2 0 0 1-4.4 0c0-1.2.7-2.3 2.2-3.9z" fill=${t ? "currentColor" : "none"}></path>`,
  // A simple mosquito (body, head, wings), crossed out; the bar has a gap cut around it.
  mosquito: (t) => x`<defs><mask id="tsw-mq" maskUnits="userSpaceOnUse"><rect x="-2" y="-2" width="28" height="28" fill="#fff"></rect><path d="M4 3.5l16.5 17" stroke="#000" stroke-width="4"></path></mask></defs><g mask="url(#tsw-mq)"><ellipse cx="12" cy="14" rx="1.9" ry="5" fill=${t ? "currentColor" : "none"}></ellipse><circle cx="12" cy="7" r="1.7" fill="currentColor"></circle><path d="M10.4 11.6C7.3 8.4 3.5 8.7 3.5 10.8c0 1.8 3.6 2.4 6.9 1.9"></path><path d="M13.6 11.6c3.1-3.2 6.9-2.9 6.9-.8 0 1.8-3.6 2.4-6.9 1.9"></path></g><path d="M4 3.5l16.5 17"></path>`,
  zapper: (t) => x`<rect x="5.5" y="4.5" width="13" height="15" rx="3.5"></rect><path d="M9 4.5V2.5h6v2"></path><path d="M8.5 9h7M8.5 12h7M8.5 15h7"></path>${t ? x`<path d="M12.6 7.2l-1.8 3.3h2.4l-1.8 3.3" stroke-width="2.4"></path>` : kc}`,
  fan: () => x`<circle cx="12" cy="12" r="1.6"></circle><path d="M12 10.4c-.6-3.4.4-6.4 3-6.4 2.4 0 2.6 3.6-1.4 6.6M13.6 12.6c3.2 1.2 5.3 3.6 4 5.8-1.2 2-4.4.4-5.3-4.4M10.6 12.8c-2.6 2.2-5.7 2.8-7 .6-1.2-2 1.8-4 6.4-2.4"></path>`,
  coffee: () => x`<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"></path><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"></path><path d="M8.5 3c-.6 1 .6 1.8 0 3M12 3c-.6 1 .6 1.8 0 3"></path><path d="M4 21h14"></path>`,
  radiator: () => x`<path d="M6 5v14M10 5v14M14 5v14M18 5v14"></path><path d="M4 8h16M4 16h16"></path><path d="M6 19v2M18 19v2"></path>`,
  heater: () => x`<rect x="4" y="5" width="16" height="12" rx="3"></rect><path d="M8 9c1 1 1 2 0 3M12 9c1 1 1 2 0 3M16 9c1 1 1 2 0 3"></path><path d="M7 17v3M17 17v3"></path>`,
  dehumidifier: (t) => x`<rect x="6" y="2.5" width="12" height="19" rx="3"></rect><path d="M9 6h6"></path><path d="M12 10.5c1.6 1.8 2.4 3 2.4 4.1a2.4 2.4 0 0 1-4.8 0c0-1.1.8-2.3 2.4-4.1z" fill=${t ? "currentColor" : "none"}></path>`,
  pump: () => x`<circle cx="10" cy="13" r="5"></circle><path d="M15 13h4.5M19.5 10v6M10 8V4h-4"></path><path d="M10 13l2-2"></path>`,
  tree: () => x`<path d="M12 3l-5 6h3l-4 5h4l-4 5h12l-4-5h4l-4-5h3z"></path><path d="M12 19v2"></path>`,
  router: () => x`<rect x="3.5" y="13" width="17" height="6" rx="2"></rect><path d="M7 16h.01M10.5 16h.01"></path><path d="M16 13V9M8.7 7.7a5 5 0 0 1 7.3 0M6.4 5.4a8.2 8.2 0 0 1 11.9 0"></path>`,
  washer: () => x`<rect x="4.5" y="3" width="15" height="18" rx="3"></rect><path d="M4.5 7.5h15M8 5.2h.01M11 5.2h.01"></path><circle cx="12" cy="14" r="4"></circle>`,
  tv: () => x`<rect x="3" y="5" width="18" height="12" rx="2.5"></rect><path d="M8 21h8M12 17v4"></path>`,
  water: (t) => x`<path d="M12 3.5c3.2 3.6 5 6.3 5 8.8a5 5 0 0 1-10 0c0-2.5 1.8-5.2 5-8.8z" fill=${t ? "currentColor" : "none"}></path>`
}, kc = x``, Mc = ["boiler", "mosquito", "zapper", "plug", "fan", "coffee", "radiator", "heater", "dehumidifier", "pump", "tree", "router", "washer", "tv", "water"], gt = (t, e, s = 24) => x`
  <svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(Na[t ?? ""] ?? Na.plug)(e)}</svg>`;
function we(t) {
  const e = t.toLowerCase();
  return [
    [/termo|boiler|calentador|water heater|acs/, "boiler"],
    [/mosquit|insect/, "mosquito"],
    [/ventil|\bfan\b/, "fan"],
    [/caf[eé]|coffee|nespresso/, "coffee"],
    [/radiador|radiator|toallero/, "radiator"],
    [/estufa|calefact|heater|brasero/, "heater"],
    [/deshum|dehum/, "dehumidifier"],
    [/bomba|pump|piscina|pool|depurad/, "pump"],
    [/[aá]rbol|navidad|bel[eé]n|christmas|tree/, "tree"],
    [/router|wifi|modem|módem|fibra/, "router"],
    [/lavadora|secadora|washer|dryer|lavavajillas/, "washer"],
    [/\btv\b|tele|televis/, "tv"],
    [/riego|agua|water|fuente|aljibe/, "water"]
  ].find(([i]) => i.test(e))?.[1] ?? "plug";
}
const Ss = [
  { key: "amber", hex: "#ffb020", name: "col_amber" },
  { key: "orange", hex: "#ff7a2f", name: "col_orange" },
  { key: "red", hex: "#f04848", name: "col_red" },
  { key: "pink", hex: "#ec4f9a", name: "col_pink" },
  { key: "violet", hex: "#8b5cf6", name: "col_violet" },
  { key: "blue", hex: "#3b82f6", name: "col_blue" },
  { key: "teal", hex: "#14b8a6", name: "col_teal" },
  { key: "green", hex: "#34c77b", name: "col_green" }
], Sc = (t) => [1, 3, 5].map((e) => parseInt(t.slice(e, e + 2), 16)), Li = (t, e, s) => t.map((i, n) => Math.round(i * (1 - s) + e[n] * s)), Wi = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function hs(t) {
  const e = Ss.find((i) => i.key === t) ?? Ss[0];
  if (e.key === "amber") return { bg: "rgba(255,247,232,.95)", fg: "#3a2a10", fg2: "#6b5428", accent: e.hex };
  const s = Sc(e.hex);
  return { bg: Wi(Li(s, [255, 255, 255], 0.86), 0.95), fg: Wi(Li(s, [10, 10, 20], 0.8)), fg2: Wi(Li(s, [20, 10, 30], 0.66)), accent: e.hex };
}
const Cc = (t) => `--bg:${t.bg};--fg:${t.fg};--fg2:${t.fg2};--accent:${t.accent}`, zc = ["switch", "input_boolean", "light", "fan"], Ac = (t) => zc.includes(t.split(".")[0]), Jn = (t) => t?.state === "on", Xt = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function Zo(t, e) {
  const s = e.entity_id.split(".")[0];
  return t.callService(s, Jn(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function Kt(t, e) {
  const s = wi(t, e.entity).filter((a) => t.states[a]), i = (a, o) => {
    const l = s.filter(a);
    return l.find((c) => o.test(c)) ?? l[0];
  }, n = (a, o) => a === "none" ? void 0 : a || o();
  return {
    power: n(e.power_entity, () => i((a) => Fn(t, a), /power|potencia|consumo/i)),
    energy: n(e.energy_entity, () => i((a) => Bn(t, a), /energy|energ|consum|total/i))
  };
}
const _n = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? "");
function mn(t, e) {
  const s = e ? t.states[e] : void 0;
  if (!s || Xt(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = _n(t, s.entity_id);
  return n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
async function Tc(t, e, s) {
  return t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: e,
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  });
}
const Jo = (t = /* @__PURE__ */ new Date()) => new Date(t.getFullYear(), t.getMonth(), t.getDate());
function Dc(t, e) {
  const s = [];
  let i;
  for (const n of t) {
    const a = n.lu * 1e3;
    n.s === "on" ? i || (i = { start: a, end: e, live: !0 }) : i && n.s !== "unavailable" && n.s !== "unknown" && (i.end = a, i.live = !1, s.push(i), i = void 0);
  }
  return i && s.push(i), s;
}
const Ii = (t, e, s) => Math.max(0, Math.min(t.end, s) - Math.max(t.start, e));
function Oc(t, e, s, i) {
  if (e.power && s[e.power]?.length) {
    const n = _n(t, e.power), a = n === "W" ? 1 / 1e3 : n === "MW" ? 1e3 : 1, o = s[e.power].map((l) => [l.lu * 1e3, Number(l.s) * a]).filter(([, l]) => Number.isFinite(l));
    return (l, c) => {
      let h = 0;
      for (let u = 0; u < o.length; u++) {
        const p = o[u][0], _ = u + 1 < o.length ? o[u + 1][0] : i, b = Math.max(0, Math.min(_, c) - Math.max(p, l));
        b > 0 && (h += Math.max(0, o[u][1]) * (b / 36e5));
      }
      return h;
    };
  }
  if (e.energy && s[e.energy]?.length) {
    const n = _n(t, e.energy), a = n === "Wh" ? 1 / 1e3 : n === "MWh" ? 1e3 : 1, o = s[e.energy].map((l) => [l.lu * 1e3, Number(l.s) * a]).filter(([, l]) => Number.isFinite(l));
    return (l, c) => {
      let h = 0;
      for (let u = 1; u < o.length; u++) {
        const p = o[u][1] - o[u - 1][1];
        p > 0 && o[u][0] >= l && o[u][0] < c && (h += p);
      }
      return h;
    };
  }
  return null;
}
async function ta(t, e, s = 1) {
  const i = Date.now(), n = Jo(), a = new Date(n.getFullYear(), n.getMonth(), n.getDate() - (s - 1)), o = Kt(t, e), l = [e.entity, o.power ?? o.energy].filter(Boolean), c = await Tc(t, l, a), h = Dc(c[e.entity] ?? [], i), u = Oc(t, o, c, i), p = n.getTime(), _ = u ? Array.from({ length: 24 }, (m, y) => u(p + y * 36e5, p + (y + 1) * 36e5)) : null, b = Array.from({ length: 24 }, (m, y) => h.reduce((v, k) => v + Ii(k, p + y * 36e5, p + (y + 1) * 36e5), 0) / 6e4), g = [];
  if (s > 1)
    for (let m = s - 1; m >= 0; m--) {
      const y = new Date(n.getFullYear(), n.getMonth(), n.getDate() - m), v = y.getTime(), k = new Date(y.getFullYear(), y.getMonth(), y.getDate() + 1).getTime();
      g.push({ day: y, kwh: u ? u(v, k) : null, onMs: h.reduce((C, S) => C + Ii(S, v, k), 0) });
    }
  return {
    spans: h,
    hourly: _,
    hourlyOn: b,
    kwhToday: u ? u(p, i) : null,
    onToday: h.reduce((m, y) => m + Ii(y, p, i), 0),
    days: g,
    kwhBetween: (m, y) => u ? u(m, y) : null
  };
}
const Hi = /* @__PURE__ */ new Map();
function tr(t, e) {
  const s = t.states[e.entity], i = Kt(t, e), n = `${s?.last_changed}|${i.power}|${i.energy}|${Jo().getTime()}`, a = Hi.get(e.entity);
  if (a && a.key === n && Date.now() - a.at < 5 * 6e4) return a.p;
  const o = ta(t, e, 1);
  return Hi.set(e.entity, { at: Date.now(), key: n, p: o }), o.catch(() => Hi.delete(e.entity)), o;
}
async function Ec(t, e, s) {
  const i = await t.callWS({
    type: "logbook/get_events",
    start_time: s.toISOString(),
    end_time: (/* @__PURE__ */ new Date()).toISOString(),
    entity_ids: [e]
  }), n = t.user?.id;
  return (i ?? []).map((a) => {
    const o = a.context_name || a.context_entity_id_name || a.context_entity_id;
    let l = { kind: "unknown" };
    return a.context_event_type === "automation_triggered" || a.context_domain === "automation" ? l = { kind: "automation", name: o } : a.context_event_type === "script_started" || a.context_domain === "script" ? l = { kind: "script", name: o } : a.context_user_id && (l = { kind: a.context_user_id === n ? "you" : "user" }), { t: a.when * 1e3, state: a.state, cause: l };
  });
}
const Ct = (t, e) => `${e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: e < 10 ? 1 : 0, maximumFractionDigits: e < 10 ? 1 : 0 })} kWh`, fe = (t, e) => e < 1 ? `${Math.round(e * 1e3).toLocaleString(t?.locale?.language ?? void 0)} W` : `${e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`;
function ft(t) {
  const e = Math.max(0, Math.round(t / 6e4)), s = Math.floor(e / 60), i = e % 60;
  return s ? i ? `${s} h ${i} min` : `${s} h` : `${i} min`;
}
const dt = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" }), jc = "amber", kt = ["green", "blue", "violet", "red", "teal", "pink", "orange"], De = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), er = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(De(t, e)), ee = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(De(t, e)), sr = (t, e) => er(t, e) || ee(t, e), ea = (t) => t === "Wh" ? 1 / 1e3 : t === "MWh" ? 1e3 : 1, oi = /* @__PURE__ */ new Map(), sa = 15 * 6e4;
function ir(t, e, s) {
  const i = oi.get(t) ?? [];
  i.some((a) => a.t === e) || (i.push({ t: e, v: s }), i.sort((a, o) => a.t - o.t));
  const n = Date.now() - 2 * sa;
  oi.set(t, i.filter((a, o) => a.t >= n || o === i.length - 1));
}
function Nc(t) {
  const e = oi.get(t) ?? [], s = e[e.length - 1];
  if (!s) return null;
  if (Date.now() - s.t > 10 * 6e4) return 0;
  const i = e.find((n) => s.t - n.t <= sa && s.t - n.t >= 6e4);
  return i ? Math.max(0, (s.v - i.v) / ((s.t - i.t) / ot)) : e.length > 1 ? Math.max(0, (s.v - e[0].v) / Math.max(1 / 60, (s.t - e[0].t) / ot)) : null;
}
function Ri(t, e) {
  const s = e ? t.states[e] : void 0;
  if (!s || s.state === "unavailable" || s.state === "unknown") return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = De(t, s.entity_id);
  return ee(t, s.entity_id) ? (ir(s.entity_id, new Date(s.last_updated ?? s.last_changed).getTime(), i * ea(n)), Nc(s.entity_id)) : n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
async function Pc(t, e) {
  const s = e.filter((n) => ee(t, n) && (oi.get(n)?.length ?? 0) < 2);
  if (!s.length) return;
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: new Date(Date.now() - sa).toISOString(),
    entity_ids: s,
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  });
  for (const n of s) {
    const a = ea(De(t, n));
    for (const o of i[n] ?? []) {
      const l = Number(o.s);
      Number.isFinite(l) && ir(n, o.lu * 1e3, l * a);
    }
  }
}
function bn(t, e) {
  if (t.icon) return t.icon;
  const s = `${e} ${t.entity}`.toLowerCase();
  return /coche|wallbox|cargador|charger|\bev\b|veh[ií]culo/.test(s) ? "car" : /aire|clima|split|\bac\b|aerotermia|bomba de calor|heat pump/.test(s) ? "snow" : we(s);
}
const xn = (t, e) => e.name || String(t.states[e.entity]?.attributes.friendly_name ?? e.entity), yn = (t) => !t.sum_only && t.rest !== !1;
function nr(t, e, s) {
  const i = (e.consumers ?? []).map((l, c) => {
    const h = xn(t, l);
    return {
      key: `c${c}`,
      name: h,
      icon: bn(l, h),
      color: l.color ?? kt[c % kt.length],
      kw: Math.max(0, Ri(t, l.entity) ?? 0),
      entity: l.entity,
      missing: Ri(t, l.entity) == null
    };
  }), n = i.reduce((l, c) => l + c.kw, 0), a = e.sum_only ? null : Ri(t, e.entity), o = a != null ? Math.max(a, n) : n;
  return yn(e) && i.push({ key: "rest", name: s, icon: "home", color: jc, kw: Math.max(0, o - n), rest: !0 }), { total: o, items: i };
}
const Lc = (t) => typeof t == "number" ? t : new Date(t).getTime(), ot = 36e5;
async function Wc(t, e, s) {
  const i = {};
  for (const _ of e) i[_] = /* @__PURE__ */ new Map();
  const n = async (_, b, g) => {
    if (!_.length) return {};
    try {
      return await t.callWS({
        type: "recorder/statistics_during_period",
        start_time: s.toISOString(),
        statistic_ids: _,
        period: "hour",
        types: b,
        units: g
      });
    } catch {
      return {};
    }
  }, a = new Set(e.filter((_) => ee(t, _))), o = {
    ...await n(e.filter((_) => !a.has(_)), ["mean"], { power: "kW" }),
    ...await n([...a], ["change"], { energy: "kWh" })
  };
  let l = s.getTime();
  for (const _ of e)
    for (const b of o[_] ?? []) {
      const g = a.has(_) ? b.change : b.mean;
      if (g == null) continue;
      const m = Lc(b.start);
      i[_].set(m, Math.max(0, g)), l = Math.max(l, m + ot);
    }
  const c = Date.now(), h = e.filter((_) => !o[_]?.length), u = new Date(Math.min(...e.map((_) => o[_]?.length ? l : s.getTime()))), p = e.filter((_) => h.includes(_) || l < c);
  if (p.length) {
    const _ = await t.callWS({
      type: "history/history_during_period",
      start_time: u.toISOString(),
      entity_ids: p,
      minimal_response: !0,
      no_attributes: !0,
      significant_changes_only: !1
    });
    for (const b of p) {
      const g = h.includes(b) ? s.getTime() : l;
      if (a.has(b)) {
        const k = ea(De(t, b)), C = (_[b] ?? []).map((S) => [S.lu * 1e3, Number(S.s) * k]).filter(([, S]) => Number.isFinite(S));
        for (let S = 1; S < C.length; S++) {
          const L = C[S][1] - C[S - 1][1];
          if (L <= 0 || C[S][0] < g) continue;
          const M = Math.floor(C[S][0] / ot) * ot;
          i[b].set(M, (i[b].get(M) ?? 0) + L);
        }
        continue;
      }
      const m = De(t, b), y = m === "W" ? 1 / 1e3 : m === "MW" ? 1e3 : 1, v = (_[b] ?? []).map((k) => [k.lu * 1e3, Number(k.s) * y]).filter(([, k]) => Number.isFinite(k));
      for (let k = 0; k < v.length; k++) {
        let C = Math.max(v[k][0], g);
        const S = k + 1 < v.length ? v[k + 1][0] : c, L = Math.max(0, v[k][1]);
        for (; C < S; ) {
          const M = Math.floor(C / ot) * ot, O = Math.min(M + ot, S);
          i[b].set(M, (i[b].get(M) ?? 0) + L * ((O - C) / ot)), C = O;
        }
      }
    }
  }
  return i;
}
async function ar(t, e, s = 1) {
  const i = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)), n = new Date(i.getFullYear(), i.getMonth(), i.getDate() - (s - 1)), a = (e.consumers ?? []).filter((m) => m.entity), o = [.../* @__PURE__ */ new Set([...e.sum_only ? [] : [e.entity], ...a.map((m) => m.entity)])].filter((m) => t.states[m]);
  await Pc(t, o).catch(() => {
  });
  const l = await Wc(t, o, n), c = (m) => `c${m}`, h = (m, y) => Array.from({ length: y }, (v, k) => m + k * ot), u = (m) => {
    const y = {};
    let v = 0;
    return (e.consumers ?? []).forEach((k, C) => {
      const S = l[k.entity]?.get(m) ?? 0;
      y[c(C)] = S, v += S;
    }), yn(e) && (y.rest = Math.max(0, (l[e.entity]?.get(m) ?? 0) - v)), y;
  }, p = [...(e.consumers ?? []).map((m, y) => c(y)), ...yn(e) ? ["rest"] : []], _ = Object.fromEntries(p.map((m) => [m, []]));
  for (const m of h(i.getTime(), 24)) {
    const y = u(m);
    for (const v of p) _[v].push(y[v] ?? 0);
  }
  const b = [];
  for (let m = s - 1; m >= 0; m--) {
    const y = new Date(i.getFullYear(), i.getMonth(), i.getDate() - m), v = Object.fromEntries(p.map((k) => [k, 0]));
    for (const k of h(y.getTime(), 24)) {
      const C = u(k);
      for (const S of p) v[S] += C[S] ?? 0;
    }
    b.push({ day: y, kwh: v });
  }
  const g = Object.fromEntries(p.map((m) => [m, _[m].reduce((y, v) => y + v, 0)]));
  return { hourly: _, days: b, today: g, todayTotal: Object.values(g).reduce((m, y) => m + y, 0) };
}
const qi = /* @__PURE__ */ new Map();
function Ic(t, e) {
  const s = JSON.stringify([e.entity, e.sum_only, e.rest, (e.consumers ?? []).map((a) => a.entity), (/* @__PURE__ */ new Date()).toDateString()]), i = qi.get(s);
  if (i && Date.now() - i.at < 5 * 6e4) return i.p;
  const n = ar(t, e, 1);
  return qi.set(s, { at: Date.now(), p: n }), n.catch(() => qi.delete(s)), n;
}
const Oe = (t, e) => e.missing ? "—" : e.kw < 1 ? `${Math.round(e.kw * 1e3).toLocaleString(t?.locale?.language ?? void 0)} W` : `${V(t, e.kw)} kW`, V = (t, e) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function Hc(t) {
  const e = [...Object.keys(t.states).filter((i) => er(t, i)), ...Object.keys(t.states).filter((i) => ee(t, i))], s = (i) => `${i} ${t.states[i]?.attributes.friendly_name ?? ""}`.toLowerCase();
  return e.find((i) => /(general|total|casa|home|house|vivienda|grid|red|import|contador|main)/.test(s(i))) ?? void 0;
}
const Pa = {
  car: x`<path d="M5 16V11l2-5h10l2 5v5"></path><path d="M3 16h18v3H3z"></path><path d="M5 11h14"></path>`,
  snow: x`<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"></path><path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"></path>`,
  home: x`<path d="M4 11l8-7 8 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`,
  tower: x`<path d="M8 21l4-18 4 18M6 8h12M5 13h14M9.5 13l5 8M14.5 13l-5 8"></path>`,
  bolt: x`<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor" stroke="none"></path>`
}, Rc = ["car", "snow", "home", "boiler", "washer", "heater", "radiator", "dehumidifier", "pump", "coffee", "tv", "router", "fan", "plug", "water"];
function J(t, e = 24) {
  return Pa[t] ? x`<svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Pa[t]}</svg>` : gt(t, !1, e);
}
const q = (t) => Ss.find((e) => e.key === t)?.hex ?? t, $e = (t, e, s, i) => x`<g transform="translate(${e - i / 2} ${s - i / 2})" color="#fff">${J(t, i)}</g>`, Si = (t) => Math.max(0.9, 3.2 - t * 0.8);
function or(t, e, s, i, n) {
  if (!n || s < 0.01) return f;
  const a = Si(s), o = s > 2 ? 4 : s > 0.8 ? 3 : 2;
  return Array.from({ length: o }, (l, c) => x`<circle r=${i} fill=${e}>
    <animateMotion dur="${a.toFixed(2)}s" repeatCount="indefinite" begin="-${(a / o * c).toFixed(2)}s" path=${t}></animateMotion></circle>`);
}
const rr = (t, e, s) => (s + Math.min(t, 6) * e).toFixed(1);
let qc = 0;
function Ci(t, e, s, i, n, a, o) {
  const l = 2 * Math.PI * s, c = `er${++qc}`;
  if (e <= 1e-3) return x`<circle cx=${n} cy=${a} r=${s} fill="none" stroke="rgba(255,255,255,.18)" stroke-width=${i}></circle>`;
  const h = t.filter((_) => _.kw > 1e-3), u = h.length > 1 ? Math.min(6, l * 0.012) : 0;
  let p = 0;
  return h.map((_, b) => {
    const g = Math.max(0.5, _.kw / e * l - u), m = q(_.color), y = p / l * 2 * Math.PI - Math.PI / 2, v = (p + g) / l * 2 * Math.PI - Math.PI / 2, k = g / l > 0.5 ? 1 : 0, C = s + i, S = Math.max(1, s - i), L = (R, Z) => `${(n + R * Math.cos(Z)).toFixed(2)} ${(a + R * Math.sin(Z)).toFixed(2)}`, M = `M${L(S, y)} L${L(C, y)} A${C} ${C} 0 ${k} 1 ${L(C, v)} L${L(S, v)} A${S} ${S} 0 ${k} 0 ${L(S, y)} Z`, O = Math.min(g * 0.45, Math.max(8, s * 0.45)), T = g > l * 0.4 ? 2 : 1, W = (g + O) / (s / 80 * (55 + _.kw * 35)), z = p;
    return p += g + u, x`
      <clipPath id="${c}-${b}"><path d=${M}></path></clipPath>
      <circle cx=${n} cy=${a} r=${s} fill="none" stroke=${m} stroke-width=${i}
        stroke-dasharray="${g.toFixed(1)} ${(l - g).toFixed(1)}" stroke-dashoffset=${(-z).toFixed(1)} transform="rotate(-90 ${n} ${a})"></circle>
      ${o ? Array.from({ length: T }, (R, Z) => x`<circle cx=${n} cy=${a} r=${s} fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=${i}
            stroke-dasharray="${O.toFixed(1)} ${(l * 2).toFixed(1)}" transform="rotate(-90 ${n} ${a})" clip-path="url(#${c}-${b})">
            <animate attributeName="stroke-dashoffset" from=${(-(z - O)).toFixed(1)} to=${(-(z + g)).toFixed(1)} dur="${W.toFixed(2)}s"
              begin="-${(W / T * Z).toFixed(2)}s" repeatCount="indefinite"></animate></circle>`) : f}`;
  });
}
function lr(t, e, s, i, n, a, o) {
  const l = Math.max(e.kw > 1e-3 ? 6 : 0, Math.min(100, e.kw / i * 100));
  return d`<div class="lb">
    <span class="ci" style="background:${q(e.color)}">${J(e.icon, n ? 15 : 18)}</span>
    <div class="lbt">
      <div class="lbn"><span>${e.name}</span><b>${Oe(t, e)}${o && s > 0 ? d`<small> · ${Math.round(e.kw / s * 100)} %</small>` : f}</b></div>
      <div class="trk"><i class=${a && e.kw > 0.01 ? "mv" : ""} style="width:${l}%;--c:${q(e.color)};animation-duration:${Si(e.kw).toFixed(2)}s"></i></div>
    </div>
  </div>`;
}
const ia = (t) => Math.max(1, ...t.map((e) => e.kw)) * 1.15, Ks = (t, e = !0) => d`<div class="ehead ${e ? "" : "sm"}">
  <span class="eic">${J("bolt", e ? 30 : 18)}</span>
  <span class="txt"><span class="name">${t.title}</span><span class="state">${t.todayText ?? t.labels.now}</span></span>
  ${t.view === "ring" && e ? f : d`<span class="tot">${V(t.h, t.live.total)}<small> kW</small></span>`}
</div>`;
function Ui(t) {
  const e = t.today;
  if (!e) return f;
  const s = t.live.items.filter((i) => (e[i.key] ?? 0) > 5e-3);
  return s.length ? d`<div class="stack">${s.map((i) => d`<i style="flex:${e[i.key]};background:${q(i.color)}"></i>`)}</div>
    ${t.view !== "ring" && s.length <= 4 ? d`<div class="legend">${s.map((i) => d`<span><b style="background:${q(i.color)}"></b>${V(t.h, e[i.key])} kWh</span>`)}</div>` : f}` : f;
}
function Uc(t) {
  const { h: e, live: s, animate: i } = t, n = s.items.slice(0, 6);
  if (t.view === "bars")
    return d`${Ks(t)}<div class="lbars">${n.map((p) => lr(e, p, s.total, ia(n), !1, i, !0))}</div>${Ui(t)}`;
  if (t.view === "ring") {
    const p = n.slice(0, 5), _ = p.length > 3 ? 40 : 58, b = 103 - (p.length - 1) * _ / 2;
    return d`${Ks(t)}
      <svg class="flow" viewBox="0 0 322 206" preserveAspectRatio="xMidYMid meet">
        ${Ci(n, s.total, 80, 18, 100, 103, i)}
        <text x="100" y="104" text-anchor="middle" class="big">${V(e, s.total)}</text>
        <text x="100" y="126" text-anchor="middle" class="t2">${t.labels.kwNow}</text>
        ${p.map((g, m) => x`<circle cx="212" cy=${b + m * _} r="15" fill=${q(g.color)}></circle>${$e(g.icon, 212, b + m * _, 18)}
          <text x="236" y=${b + m * _ - 5} class="t1">${ri(g.name)}</text>
          <text x="236" y=${b + m * _ + 13} class="t2">${Oe(e, g)}${s.total > 0 ? ` · ${Math.round(g.kw / s.total * 100)} %` : ""}</text>`)}
      </svg>${Ui(t)}`;
  }
  const a = n.length, o = n.map((p, _) => a === 1 ? 160 : 48 + 224 / (a - 1) * _), l = 54, c = 146, h = o.map((p) => `M160 ${l} C160 ${l + 40}, ${p} ${c - 60}, ${p} ${c - 24}`), u = a > 4 ? 18 : 24;
  return d`${Ks(t)}
    <svg class="flow" viewBox="0 0 320 206" preserveAspectRatio="xMidYMid meet">
      ${h.map((p, _) => x`<path d=${p} fill="none" stroke="rgba(255,255,255,.16)" stroke-width=${rr(n[_].kw, 2.6, 3)} stroke-linecap="round"></path>`)}
      ${h.map((p, _) => or(p, q(n[_].color), n[_].kw, 4.2, i))}
      <circle cx="160" cy="28" r="26" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.35)"></circle>${$e("tower", 160, 28, 26)}
      <text x="194" y="24" class="t1">${t.labels.grid}</text><text x="194" y="41" class="t2">${V(e, s.total)} kW</text>
      ${o.map((p, _) => x`<circle cx=${p} cy=${c} r=${u} fill=${q(n[_].color)}></circle>${$e(n[_].icon, p, c, u)}
        <text x=${p} y=${c + 42} class="t1 ${a > 4 ? "sm" : ""}" text-anchor="middle">${ri(n[_].name)}</text>
        <text x=${p} y=${c + 59} class="t2" text-anchor="middle">${Oe(e, n[_])}${a <= 3 && s.total > 0 ? ` · ${Math.round(n[_].kw / s.total * 100)} %` : ""}</text>`)}
    </svg>${Ui(t)}`;
}
function cr(t) {
  const { h: e, live: s, animate: i } = t, n = s.items.slice(0, t.view === "bars" ? 3 : 4);
  if (t.view === "bars")
    return d`<div class="lbn top"><span>${t.title}</span><b>${V(e, s.total)} kW${t.todayText ? d`<small> · ${t.todayText}</small>` : f}</b></div>
      <div class="lbars sm">${n.map((c) => lr(e, c, s.total, ia(n), !0, i, !1))}</div>`;
  if (t.view === "ring") {
    const c = n.length > 3 ? 29 : 39, h = 61 - (n.length - 1) * c / 2;
    return d`<svg class="flow" viewBox="0 0 322 122" preserveAspectRatio="xMidYMid meet">
      ${Ci(s.items, s.total, 48, 12, 58, 61, i)}
      <text x="58" y="62" text-anchor="middle" class="mid">${V(e, s.total)}</text>
      <text x="58" y="78" text-anchor="middle" class="t2 xs">kW</text>
      ${n.map((u, p) => x`<circle cx="140" cy=${h + p * c} r="12" fill=${q(u.color)}></circle>${$e(u.icon, 140, h + p * c, 15)}
        <text x="160" y=${h + p * c + 5} class="t1 sm">${ri(u.name)}</text><text x="320" y=${h + p * c + 5} class="t1 sm" text-anchor="end">${Oe(e, u)}</text>`)}
    </svg>`;
  }
  const a = n.length, o = n.map((c, h) => a === 1 ? 44 : 13 + 62 / (a - 1) * h), l = o.map((c) => `M46 44 C88 44, 96 ${c}, 136 ${c}`);
  return d`${Ks(t, !1)}
    <svg class="flow" viewBox="0 0 322 88" preserveAspectRatio="xMidYMid meet">
      ${l.map((c, h) => x`<path d=${c} fill="none" stroke="rgba(255,255,255,.16)" stroke-width=${rr(n[h].kw, 1.8, 2.5)} stroke-linecap="round"></path>`)}
      ${l.map((c, h) => or(c, q(n[h].color), n[h].kw, 3, i))}
      <circle cx="24" cy="44" r="22" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.35)"></circle>${$e("tower", 24, 44, 22)}
      ${o.map((c, h) => x`<circle cx="150" cy=${c} r="13" fill=${q(n[h].color)}></circle>${$e(n[h].icon, 150, c, 16)}
        <text x="171" y=${c + 5} class="t1 sm">${ri(n[h].name)}</text><text x="320" y=${c + 5} class="t1 sm" text-anchor="end">${Oe(e, n[h])}</text>`)}
    </svg>`;
}
function Fc(t) {
  const { h: e, live: s, animate: i } = t;
  if (t.view === "ring")
    return d`<svg class="flow" viewBox="0 0 150 112" preserveAspectRatio="xMidYMid meet">
        ${Ci(s.items, s.total, 46, 12, 75, 56, i)}
        <text x="75" y="60" text-anchor="middle" class="mid">${V(e, s.total)}</text>
        <text x="75" y="76" text-anchor="middle" class="t2 xs">kW</text>
      </svg>
      <span class="txt"><span class="name">${t.title}</span><span class="state">${t.todayText ?? t.labels.now}</span></span>`;
  if (t.view === "bars") {
    const n = s.items.slice(0, 3), a = ia(n);
    return d`<span class="txt"><span class="name">${t.title}</span><span class="state">${V(e, s.total)} kW</span></span>
      <div class="mini">${n.map((o) => d`<div class="mr">
        <span class="ci xs" style="background:${q(o.color)}">${J(o.icon, 12)}</span>
        <div class="trk"><i class=${i && o.kw > 0.01 ? "mv" : ""} style="width:${Math.max(o.kw > 1e-3 ? 8 : 0, o.kw / a * 100)}%;--c:${q(o.color)};animation-duration:${Si(o.kw).toFixed(2)}s"></i></div>
        <b>${V(e, o.kw)}</b></div>`)}</div>`;
  }
  return d`<span class="eic">${J("bolt", 30)}</span>
    <div class="vstack">${s.items.filter((n) => n.kw > 1e-3).map((n) => d`<i style="flex:${n.kw};background:${q(n.color)}"></i>`)}</div>
    <span class="txt"><span class="name">${t.title}</span><span class="state">${V(e, s.total)} kW</span></span>`;
}
function Bc(t) {
  const { h: e, live: s, animate: i } = t, n = t.view === "ring" ? d`<svg width="40" height="40" viewBox="0 0 40 40" style="flex:none">${Ci(s.items, s.total, 15, 6, 20, 20, i)}</svg>` : d`<span class="eic sm">${J("bolt", 20)}</span>`;
  return d`${n}<span class="txt"><span class="name">${t.title}</span><span class="state">${V(e, s.total)} kW</span></span>
    ${t.view === "ring" ? f : d`<div class="hbar">${s.items.filter((a) => a.kw > 1e-3).map((a) => d`<i class=${i && t.view === "bars" ? "mv" : ""} style="flex:${a.kw};background-color:${q(a.color)};animation-duration:${Si(a.kw).toFixed(2)}s"></i>`)}</div>`}`;
}
function ri(t) {
  const e = t.trim().split(/\s+/);
  return e.length > 1 && t.length > 11 ? e[0] : t;
}
const Vc = ["door", "window", "garage_door", "opening"], _e = (t, e) => {
  if (!e.startsWith("binary_sensor.")) return !1;
  const s = String(t.states[e]?.attributes.device_class ?? "");
  return Vc.includes(s) ? !0 : !s && /(puerta|ventana|balcon|door|window|contact|contacto|apertura)/i.test(`${e} ${t.states[e]?.attributes.friendly_name ?? ""}`);
}, Cs = (t) => t?.state === "on", ke = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function st(t, e) {
  if (e.kind) return e.kind;
  const s = t.states[e.entity], i = String(s?.attributes.device_class ?? ""), n = `${e.name ?? ""} ${s?.attributes.friendly_name ?? ""} ${e.entity}`.toLowerCase();
  return i === "garage_door" || /garaje|garage|cochera/.test(n) ? "garage" : /balcon|terraza|corredera|patio/.test(n) ? "balcony" : i === "window" || /ventana|window/.test(n) ? "window" : "door";
}
const Je = (t, e) => `${e} ${t.states[e]?.attributes.friendly_name ?? ""}`.toLowerCase(), ts = (t, e) => String(t.states[e]?.attributes.device_class ?? "");
function ps(t, e) {
  const s = wi(t, e).filter((n) => t.states[n]), i = (n) => s.find(n);
  return {
    tamper: i((n) => n.startsWith("binary_sensor.") && (ts(t, n) === "tamper" || /tamper|manipul|cover/.test(Je(t, n)))),
    vibration: i((n) => n.startsWith("binary_sensor.") && (["vibration", "moving"].includes(ts(t, n)) || /vibra|movimiento|moving/.test(Je(t, n)))),
    temperature: i((n) => n.startsWith("sensor.") && ts(t, n) === "temperature"),
    battery: i((n) => n.startsWith("sensor.") && ts(t, n) === "battery") ?? i((n) => n.startsWith("binary_sensor.") && ts(t, n) === "battery"),
    node: i((n) => n.startsWith("sensor.") && /_node_status$/.test(n)),
    x: i((n) => n.startsWith("sensor.") && /(x[ _-]?axis|eje[ _-]?x|_x$)/.test(Je(t, n))),
    y: i((n) => n.startsWith("sensor.") && /(y[ _-]?axis|eje[ _-]?y|_y$)/.test(Je(t, n))),
    z: i((n) => n.startsWith("sensor.") && /(z[ _-]?axis|eje[ _-]?z|_z$)/.test(Je(t, n)))
  };
}
function vn(t, e) {
  const s = ps(t, e);
  if (!s.x || !s.y || !s.z) return;
  const i = [s.x, s.y, s.z].map((n) => Number(t.states[n]?.state));
  if (!i.some((n) => !Number.isFinite(n)))
    return { x: i[0], y: i[1], z: i[2] };
}
const La = (t, e) => Math.hypot(t.x - e.x, t.y - e.y, t.z - e.z);
function dr(t, e, s) {
  const i = e.positions?.[s];
  if (!i || !(i.vent || i.tilt)) return;
  const n = vn(t, s);
  if (!n) return;
  const a = Object.entries(i).filter(([, h]) => h).map(([h, u]) => ({ k: h, d: La(n, u), v: u }));
  a.sort((h, u) => h.d - u.d);
  const o = a[0], l = a[1], c = l ? Math.max(40, La(o.v, l.v) * 0.5) : 60;
  return o.d <= c ? o.k : void 0;
}
function Gt(t, e, s = e.entity) {
  const i = t.states[s];
  if (ke(i)) return "unavailable";
  if (Cs(i)) return "open";
  const n = dr(t, e, s);
  return n === "vent" || n === "tilt" ? n : "closed";
}
const Me = (t, e) => r(t, e === "open" ? "ct_open" : e === "vent" ? "ct_vent" : e === "tilt" ? "ct_tilt" : e === "unavailable" ? "unavailable" : "ct_closed"), li = (t) => t ? (Date.now() - new Date(t.last_changed).getTime()) / 6e4 : 0, Wa = {
  doorC: x`<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21"></path><path d="M3 21h18"></path><circle cx="15.5" cy="12.5" r=".9" fill="currentColor"></circle>`,
  doorO: x`<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21" opacity=".45"></path><path d="M3 21h18"></path><path d="M5 3l8 2.5V21L5 21z" fill="currentColor" fill-opacity=".25"></path><circle cx="11" cy="13" r=".9" fill="currentColor"></circle>`,
  windowC: x`<rect x="4" y="3" width="16" height="18" rx="1.5"></rect><path d="M12 3v18M4 12h16"></path>`,
  windowO: x`<rect x="4" y="3" width="16" height="18" rx="1.5" opacity=".45"></rect><path d="M12 3v18"></path><path d="M12 3l6.5 2.5v15L12 21" fill="currentColor" fill-opacity=".25"></path>`,
  balconyC: x`<rect x="5" y="2.5" width="14" height="19" rx="1.5"></rect><path d="M12 2.5v19"></path><path d="M10 12h.01M14 12h.01"></path>`,
  balconyO: x`<rect x="5" y="2.5" width="14" height="19" rx="1.5" opacity=".45"></rect><path d="M12 2.5v19"></path><path d="M12 2.5l5.5 2.2v14.6L12 21.5" fill="currentColor" fill-opacity=".25"></path>`,
  windowV: x`<rect x="4" y="3" width="16" height="18" rx="1.5"></rect><path d="M12 3v18M4 12h16" opacity=".45"></path><path d="M4 3l3 3.2h10L20 3" fill="currentColor" fill-opacity=".3"></path><path d="M12 7.5v3M10.5 9 12 7.5 13.5 9"></path>`,
  balconyV: x`<rect x="5" y="2.5" width="14" height="19" rx="1.5"></rect><path d="M12 2.5v19" opacity=".45"></path><path d="M5 2.5l2.4 3h9.2L19 2.5" fill="currentColor" fill-opacity=".3"></path><path d="M12 7v3.5M10.5 8.5 12 7l1.5 1.5"></path>`,
  garageC: x`<path d="M3 21V9l9-5 9 5v12"></path><path d="M6.5 21v-9h11v9M6.5 15h11M6.5 18h11"></path>`,
  garageO: x`<path d="M3 21V9l9-5 9 5v12"></path><path d="M6.5 21v-9h11M6.5 15h11" opacity=".45"></path>`,
  thermo: x`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`,
  battery: x`<rect x="2" y="7" width="18" height="10" rx="2.5"></rect><path d="M22 10.5v3"></path><rect x="4.5" y="9.5" width="13" height="5" rx="1" fill="currentColor" stroke="none"></rect>`,
  vibration: x`<rect x="8" y="4" width="8" height="16" rx="2"></rect><path d="M4.5 8v8M2 10v4M19.5 8v8M22 10v4"></path>`,
  shield: x`<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"></path><path d="M9 12l2 2 4-4"></path>`,
  sleep: x`<path d="M4 13h5l-5 6h5M13 5h4l-4 5h4M19 10h3l-3 4h3"></path>`,
  bell: x`<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"></path><path d="M10 20.5a2 2 0 0 0 4 0"></path>`,
  check: x`<path d="M5 12.5l4.5 4.5L19 7.5"></path>`
};
function Qt(t, e = 24) {
  return x`<svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Wa[t] ?? Wa.doorC}</svg>`;
}
const zt = (t, e, s = 24) => Qt(`${t}${e ? "O" : "C"}`, s), Se = (t, e, s = 24) => e === "vent" || e === "tilt" ? Qt(t === "window" || t === "balcony" ? `${t}V` : `${t}O`, s) : zt(t, e === "open", s), Yc = "--bg:rgba(255,240,232,.95);--fg:#3d1c10;--fg2:#7a4a38;--accent:#ff7a2f", Gc = "--bg:rgba(235,243,255,.95);--fg:#0f2547;--fg2:#44608a;--accent:#3b82f6", ci = (t) => t === "open" ? Yc : t === "vent" || t === "tilt" ? Gc : "";
function pt(t) {
  const e = Math.max(0, Math.floor(t));
  if (e < 60) return `${e} min`;
  const s = Math.floor(e / 60);
  return e % 60 ? `${s} h ${e % 60} min` : `${s} h`;
}
var Xc = Object.defineProperty, Kc = Object.getOwnPropertyDescriptor, de = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Kc(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Xc(e, s, n), n;
};
const Qc = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate", weather: "type_weather", vacuum: "type_vacuum", switch: "type_switch", energy: "type_energy", contact: "type_contact" }, Zc = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;
let mt = class extends D {
  constructor() {
    super(...arguments), this._q = "", this._allDevices = !1, this._ci = 0, this._back = () => {
      if (this._sub === "consumer_entity" && this._ci < (this.draft.config.consumers ?? []).length) {
        this._sub = "consumer", this._q = "";
        return;
      }
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
    return this._sub === "entity" && this.draft.type === "climate" ? r(this.hass, "climate_entity") : this._sub === "entity" && this.draft.type === "switch" ? r(this.hass, "sw_entity") : this._sub === "total" ? r(this.hass, "en_total") : this._sub === "entity" && this.draft.type === "contact" ? r(this.hass, "ct_sensor_entity") : this._sub === "group_entity" ? r(this.hass, "ct_group_add") : this._sub === "consumer" ? r(this.hass, "en_consumer") : this._sub === "consumer_entity" ? r(this.hass, "en_sensor") : this.draft.type === "switch" && this._sub === "power_entity" ? r(this.hass, "sw_power") : this.draft.type === "switch" && this._sub === "energy_entity" ? r(this.hass, "sw_energy") : this._sub ? r(this.hass, { device: "ch_device", entity: "light_entity", alarm: "type_alarm", weather: "type_weather", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" }[this._sub]) : this.options.mode === "edit" ? r(this.hass, "settings") : r(this.hass, Qc[this.draft.type]);
  }
  renderHeaderStart() {
    return !this._sub && !(this.options.mode === "add" && this.options.onBack) ? f : d`<button class="hbtn" aria-label=${r(this.hass, "back")} @click=${this._back}>${_o()}</button>`;
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
      <span class="val">${e}${_s(!1, 16)}</span>
    </button>`;
  }
  _defaultName() {
    const t = this.draft.config;
    if (this.draft.type === "alarm") return r(this.hass, "alarm");
    if (this.draft.type === "energy") return r(this.hass, "en_title");
    const e = t.device ? this.hass.devices?.[t.device] : void 0;
    return e ? this._devName(e) : t.entity ? this._entName(t.entity) : "";
  }
  _main() {
    const t = this.hass, { type: e, config: s } = this.draft, i = s.device ?? this._deviceOf(s.entity), n = i ? t.devices?.[i] : void 0, a = d`<section>
      <h3>${r(t, "general")}</h3>
      <div class="list">
        ${e === "energy" ? this._row(r(t, "en_total"), s.sum_only ? r(t, "en_total_none") : s.entity ? this._entName(s.entity) : r(t, "choose"), "total", s.sum_only ? void 0 : s.entity) : e === "weather" ? this._weathers().length > 1 ? this._row(r(t, "type_weather"), s.entity ? this._entName(s.entity) : r(t, "choose"), "weather") : f : e === "alarm" ? this._alarms().length > 1 ? this._row(r(t, "type_alarm"), s.entity ? this._entName(s.entity) : r(t, "choose"), "alarm") : f : this._row(r(t, "ch_device"), n ? this._devName(n) : s.entity ? this._entName(s.entity) : r(t, "choose"), "device")}
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
      const l = (c, h, u) => d`<span class="seg">${h.map(([p, _]) => d`<button class=${c === p ? "sel" : ""} @click=${() => u(p)}>${_}</button>`)}</span>`;
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
    else if (e === "switch" && s.entity)
      o = this._switchSettings(i);
    else if (e === "energy")
      o = this._energySettings();
    else if (e === "contact" && s.entity)
      o = this._contactSettings(i);
    else if (e === "climate" && s.entity && t.states[s.entity])
      o = this._climateSettings(i);
    else if (e === "charger" && s.entity) {
      const l = Jt(s.entity), c = r(t, l ? "raw_locked" : "raw_on"), h = r(t, l ? "raw_unlocked" : "raw_off"), u = Bl(s.entity, !!s.invert) === "active", p = r(t, "ch_locked"), _ = r(t, "ch_unlocked"), b = Vn(t, { entity: s.entity }), g = (m, y) => s[m] === "none" ? r(t, "none") : s[m] ? this._entName(s[m]) : y ? `${r(t, "auto")} · ${this._entName(y)}` : r(t, "auto");
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
        <p class="explain">${r(t, "ch_explain", { a: c, la: u ? p : _, b: h, lb: u ? _ : p, press: u ? c : h })}</p>
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
                @change=${(m) => {
        const y = parseFloat(m.target.value.replace(",", "."));
        this._set({ max_power: Number.isFinite(y) && y > 0 ? y : void 0 });
      }} />
            </label>
          </div>
        </section>`;
    }
    return d`
      <div class="scroll">
        ${a}
        ${o}
        ${this.options.mode === "edit" && this.options.onRemove ? d`<button class="remove" @click=${() => vs(t, {
      heading: r(t, "remove_card_q"),
      actions: [{ label: r(t, "remove_card"), danger: !0, run: () => {
        this.close(), this.options.onRemove?.();
      } }]
    })}>${r(t, "remove_card")}</button>` : f}
      </div>
      <button class="cta" ?disabled=${!s.entity || e === "energy" && s.sum_only && !(s.consumers ?? []).length} @click=${() => {
      this.options.onSave(this.draft), this.close();
    }}>${r(t, this.options.mode === "add" ? "add" : "save")}</button>
    `;
  }
  _climateSettings(t) {
    const e = this.hass, s = this.draft.config, i = e.states[s.entity], n = F(e), a = cs(i, s), o = (g) => g.toLocaleString(e.locale?.language ?? e.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), l = t ? this._entitiesOf(t, (g) => g.startsWith("climate.")) : [], c = Tt(i), h = ws(i).length > 0, u = To(i), p = (g, m) => {
      const y = si(s, g);
      this._set({ mode_rules: { ...s.mode_rules ?? {}, [g]: { ...y, [m]: !y[m] } } });
    }, _ = (g, m) => {
      const y = g === "min_temp" ? a.min : a.max;
      let v = Math.round((y + m * a.step) / a.step) * a.step;
      v = g === "min_temp" ? Math.max(a.hwMin, Math.min(a.max - a.step, v)) : Math.min(a.hwMax, Math.max(a.min + a.step, v));
      const k = g === "min_temp" ? a.hwMin : a.hwMax;
      this._set({ [g]: v === k ? void 0 : v });
    }, b = (g) => d`<span class="mini">
      <button aria-label="−" @click=${() => _(g, -1)}>${Ln(16)}</button>
      <b>${o(g === "min_temp" ? a.min : a.max)}°</b>
      <button aria-label="+" @click=${() => _(g, 1)}>${Wn(16)}</button>
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
      const m = si(s, g);
      return d`<tr>
                    <td><span class="mname">${ve(g, 18)}${ct(n, g)}</span></td>
                    <td><button class="ck ${m.t ? "on" : ""}" role="checkbox" aria-checked=${m.t} @click=${() => p(g, "t")}>${m.t ? Ut(15) : f}</button></td>
                    ${h ? d`<td><button class="ck ${m.f ? "on" : ""}" role="checkbox" aria-checked=${m.f} @click=${() => p(g, "f")}>${m.f ? Ut(15) : f}</button></td>` : f}
                  </tr>`;
    })}
              </table>
            </div>
            ${s.mode_rules ? d`<button class="more" style="margin-top:8px" @click=${() => this._set({ mode_rules: void 0 })}>${r(e, "reset_rules")}</button>` : f}
          </section>` : f}
      <section>
        <h3>${r(e, "window_section")}</h3>
        <div class="list">
          <button class="li" role="switch" aria-checked=${!!s.show_swing && u} ?disabled=${!u} style=${u ? "" : "opacity:.5"} @click=${() => this._set({ show_swing: !s.show_swing || void 0 })}>
            <span class="nm">${r(e, "show_swing")}<small>${r(e, u ? "show_swing_sub" : "no_swing")}</small></span>
            <span class="tog ${s.show_swing && u ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
  }
  /** Up to 3 routines for the 2/2 card, numbered in the order they were picked. */
  _vacuumSettings() {
    const t = this.hass, e = this.draft.config, s = e.name || this._entName(e.entity), i = (e.routines ?? []).filter((c) => t.states[c]), n = Qn(t, e.entity), a = Object.keys(t.states).filter((c) => (_c(t, c) || i.includes(c)) && !n.includes(c) && this._visible(c)), o = (c) => {
      const h = i.includes(c) ? i.filter((u) => u !== c) : i.length < 3 ? [...i, c] : i;
      this._set({ routines: h.length ? h : void 0 });
    }, l = (c) => {
      const h = ni(t, c, s), u = i.indexOf(c), p = u < 0 && i.length >= 3;
      return d`<button class="li" role="checkbox" aria-checked=${u >= 0} ?disabled=${p} style=${p ? "opacity:.45" : ""} @click=${() => o(c)}>
        <span class="ic">${ai(h, 18)}</span>
        <span class="nm">${h}${c.startsWith("script.") ? d`<small>${c}</small>` : f}</span>
        <span class="num ${u >= 0 ? "on" : ""}">${u >= 0 ? u + 1 : f}</span>
      </button>`;
    };
    return d`<section>
        <h3>${r(t, "vac_card_routines")}</h3>
        ${n.length ? d`<div class="list">${n.map(l)}</div>` : d`<p class="note">${r(t, "vac_no_routines")}</p>`}
        <p class="note" style="margin-top:8px">${r(t, "vac_card_routines_sub")}</p>
      </section>
      ${a.length ? d`<section><h3>${r(t, "vac_scripts")}</h3><div class="list">${a.map(l)}</div></section>` : f}`;
  }
  // ---- Doors and windows ----------------------------------------------------------
  _contactSettings(t) {
    const e = this.hass, s = this.draft.config, i = st(e, { entity: s.entity, kind: s.kind, name: s.name }), n = t ? this._entitiesOf(t, (c) => _e(e, c)) : [], a = s.group ?? [], o = [s.entity, ...a].filter((c) => vn(e, c)), l = (c, h, u) => d`<button class="li" role="switch" aria-checked=${s[c] !== !1}
      @click=${() => this._set({ [c]: s[c] === !1 ? void 0 : !1 })}>
      <span class="nm">${h}${f}</span><span class="tog ${s[c] !== !1 ? "on" : ""}"></span></button>`;
    return d`
      ${n.length > 1 ? d`<section><div class="list">${this._row(r(e, "ct_sensor_entity"), this._entName(s.entity), "entity", s.entity)}</div></section>` : f}
      <section>
        <h3>${r(e, "ct_kind")}</h3>
        <div class="list"><div class="views four">
          ${["door", "window", "balcony", "garage"].map((c) => d`<button class="vw ${i === c ? "sel" : ""}" aria-pressed=${i === c} @click=${() => this._set({ kind: c })}>
            ${zt(c, !1, 26)}${r(e, `ct_kind_${c}`)}</button>`)}
        </div></div>
      </section>
      ${o.map((c) => this._positions(c, o.length > 1))}
      <section>
        <h3>${r(e, "ct_show")}</h3>
        <div class="list">${l("show_temp", r(e, "ct_show_temp"))}${l("show_battery", r(e, "ct_show_battery"))}</div>
      </section>
      <section>
        <h3>${r(e, "ct_group")}</h3>
        <div class="list">
          ${a.map((c) => d`<div class="li">
            <span class="ic">${zt(st(e, { entity: c }), !1, 18)}</span>
            <span class="nm">${this._entName(c)}<small>${c}</small></span>
            <button class="x" aria-label=${r(e, "ct_remove")} @click=${() => this._set({ group: a.filter((h) => h !== c).length ? a.filter((h) => h !== c) : void 0 })}>×</button>
          </div>`)}
          <button class="li addc" @click=${() => {
      this._sub = "group_entity", this._q = "";
    }}><span class="ic dash">${St(18)}</span><span class="nm">${r(e, "ct_group_add")}</span></button>
        </div>
        <p class="note" style="margin-top:8px">${r(e, "ct_group_note")}</p>
      </section>`;
  }
  /**
   * Recorded positions of one sensor with X / Y / Z axes: put the window in a
   * position and record; the card then recognises it (ventilation / tilt even
   * though the contact reads closed).
   */
  _positions(t, e) {
    const s = this.hass, i = this.draft.config, n = i.positions ?? {}, a = n[t] ?? {}, o = vn(s, t), l = st(s, { entity: t, kind: t === i.entity ? i.kind : void 0 }), c = dr(s, i, t), h = (_, b) => {
      const g = { ...a, [_]: b };
      b || delete g[_];
      const m = { ...n, [t]: g };
      Object.keys(g).length || delete m[t], this._set({ positions: Object.keys(m).length ? m : void 0 });
    }, u = (_) => `X ${Math.round(_.x)} · Y ${Math.round(_.y)} · Z ${Math.round(_.z)}`, p = (_) => d`<div class="li">
      <span class="ic">${Se(l, _ === "closed" ? "closed" : _, 18)}</span>
      <span class="nm">${r(s, `ct_pos_${_}`)}<small>${a[_] ? u(a[_]) : r(s, "ct_pos_none")}</small></span>
      ${a[_] ? d`<button class="x" aria-label=${r(s, "ct_remove")} @click=${() => h(_)}>×</button>` : f}
      <button class="rec" ?disabled=${!o} @click=${() => o && h(_, o)}>${r(s, a[_] ? "ct_rerecord" : "ct_record")}</button>
    </div>`;
    return d`<section>
      <h3>${r(s, "ct_positions")}${e ? ` · ${this._entName(t)}` : ""}</h3>
      <div class="list">
        <div class="li now"><span class="nm">${r(s, "ct_pos_now")}<small>${o ? u(o) : "—"}</small></span>
          <span class="val">${c ? r(s, `ct_pos_${c}`) : Me(s, s.states[t]?.state === "on" ? "open" : "closed")}</span></div>
        ${p("closed")}${p("vent")}${p("tilt")}
      </div>
      <p class="note" style="margin-top:8px">${r(s, "ct_positions_note")}</p>
    </section>`;
  }
  // ---- Home energy ----------------------------------------------------------------
  get _consumers() {
    return this.draft.config.consumers ?? [];
  }
  _setConsumers(t) {
    const e = this.draft.config, s = { consumers: t };
    e.sum_only && (s.entity = t[0]?.entity ?? "none"), this._set(s);
  }
  _thumb(t) {
    const e = ["green", "blue", "amber"].map(q);
    return t === "flow" ? d`<svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true"><path d="M32 9 C32 20, 12 18, 12 32" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3.5" stroke-linecap="round"/><path d="M32 9 L32 32" stroke="rgba(255,255,255,.3)" stroke-width="2.6"/><path d="M32 9 C32 20, 52 18, 52 32" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2"/><circle cx="32" cy="8" r="5.5" fill="rgba(255,255,255,.5)"/><circle cx="12" cy="35" r="6" fill=${e[0]}/><circle cx="32" cy="35" r="6" fill=${e[1]}/><circle cx="52" cy="35" r="6" fill=${e[2]}/></svg>` : t === "ring" ? d`<svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true"><g transform="rotate(-90 22 22)"><circle cx="22" cy="22" r="15" fill="none" stroke=${e[0]} stroke-width="6" stroke-dasharray="55 40"/><circle cx="22" cy="22" r="15" fill="none" stroke=${e[1]} stroke-width="6" stroke-dasharray="22 73" stroke-dashoffset="-58"/><circle cx="22" cy="22" r="15" fill="none" stroke=${e[2]} stroke-width="6" stroke-dasharray="11 84" stroke-dashoffset="-83"/></g><rect x="44" y="9" width="14" height="4" rx="2" fill=${e[0]}/><rect x="44" y="20" width="14" height="4" rx="2" fill=${e[1]}/><rect x="44" y="31" width="14" height="4" rx="2" fill=${e[2]}/></svg>` : d`<svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true">${[40, 18, 9].map((s, i) => x`<circle cx="7" cy=${9 + i * 13} r="4.5" fill=${e[i]}/><rect x="16" y=${7 + i * 13} width="44" height="4.5" rx="2.2" fill="rgba(255,255,255,.15)"/><rect x="16" y=${7 + i * 13} width=${s} height="4.5" rx="2.2" fill=${e[i]}/>`)}</svg>`;
  }
  /** Energy: view, consumers (each opens its own page), rest of the house and movement. */
  _energySettings() {
    const t = this.hass, e = this.draft.config, s = e.view ?? "flow", i = this._consumers;
    return d`
      <section>
        <h3>${r(t, "en_view")}</h3>
        <div class="list"><div class="views">
          ${["flow", "ring", "bars"].map((n) => d`<button class="vw ${s === n ? "sel" : ""}" aria-pressed=${s === n} @click=${() => this._set({ view: n === "flow" ? void 0 : n })}>
            ${this._thumb(n)}${r(t, `en_view_${n}`)}</button>`)}
        </div></div>
        <p class="note" style="margin-top:8px">${r(t, "en_view_note")}</p>
      </section>
      <section>
        <h3>${r(t, "en_consumers")}</h3>
        <div class="list">
          ${i.map((n, a) => {
      const o = xn(t, n);
      return d`<button class="li" @click=${() => {
        this._ci = a, this._sub = "consumer";
      }}>
              <span class="ic" style="background:${q(n.color ?? kt[a % kt.length])}">${J(bn(n, o), 18)}</span>
              <span class="nm">${o}<small>${n.entity}</small></span>
              ${_s(!1, 16)}
            </button>`;
    })}
          <button class="li" role="switch" aria-checked=${!e.sum_only && e.rest !== !1} ?disabled=${!!e.sum_only} style=${e.sum_only ? "opacity:.5" : ""}
            @click=${() => this._set({ rest: e.rest === !1 ? void 0 : !1 })}>
            <span class="ic" style="background:${q("amber")}">${J("home", 18)}</span>
            <span class="nm">${r(t, "en_rest")}<small>${r(t, e.sum_only ? "en_rest_off" : "en_rest_sub")}</small></span>
            <span class="tog ${!e.sum_only && e.rest !== !1 ? "on" : ""}"></span>
          </button>
          <button class="li addc" @click=${() => {
      this._ci = i.length, this._sub = "consumer_entity", this._q = "";
    }}><span class="ic dash">${St(18)}</span><span class="nm">${r(t, "en_add")}</span></button>
        </div>
        <p class="note" style="margin-top:8px">${r(t, "en_consumers_note")}</p>
      </section>
      <section>
        <h3>${r(t, "window_section")}</h3>
        <div class="list">
          <button class="li" role="switch" aria-checked=${e.animate !== !1} @click=${() => this._set({ animate: e.animate === !1 ? void 0 : !1 })}>
            <span class="nm">${r(t, "en_animate")}<small>${r(t, "en_animate_sub")}</small></span><span class="tog ${e.animate !== !1 ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
  }
  /** One consumer: sensor, name, colour, icon, order, remove. */
  _consumerPage() {
    const t = this.hass, e = this._consumers, s = this._ci, i = e[s];
    if (!i) return d`<div class="scroll"></div>`;
    const n = xn(t, i), a = i.color ?? kt[s % kt.length], o = bn(i, n), l = (h) => {
      const u = e.map((p, _) => _ === s ? { ...p, ...h } : p);
      for (const p of u) for (const _ of Object.keys(p)) (p[_] === void 0 || p[_] === "") && delete p[_];
      this._setConsumers(u);
    }, c = (h) => {
      const u = s + h;
      if (u < 0 || u >= e.length) return;
      const p = [...e];
      [p[s], p[u]] = [p[u], p[s]], this._setConsumers(p), this._ci = u;
    };
    return d`<div class="scroll">
      <section>
        <div class="list">
          ${this._row(r(t, "en_sensor"), this._entName(i.entity), "consumer_entity", i.entity)}
          <label class="li"><span class="nm">${r(t, "name_label")}</span>
            <input class="txt" .value=${i.name ?? ""} placeholder=${String(t.states[i.entity]?.attributes.friendly_name ?? "")} @input=${(h) => l({ name: h.target.value })} /></label>
        </div>
      </section>
      <section>
        <h3>${r(t, "en_color")}</h3>
        <div class="list"><div class="sws">
          ${Ss.map((h) => d`<button class="sw ${a === h.key ? "sel" : ""}" aria-label=${r(t, h.name)} @click=${() => l({ color: h.key })}>
            <i style="background:${hs(h.key).bg}"><b style="background:${h.hex}">${a === h.key ? Ut(16) : f}</b></i><span>${r(t, h.name)}</span></button>`)}
        </div></div>
      </section>
      <section>
        <h3>${r(t, "sw_icon")}</h3>
        <div class="list"><div class="igrid">
          ${Rc.map((h) => d`<button class="gi ${o === h ? "sel" : ""}" aria-label=${h} @click=${() => l({ icon: h })}>${J(h, 22)}</button>`)}
        </div></div>
      </section>
      <section>
        <div class="list">
          <button class="li" ?disabled=${s === 0} style=${s === 0 ? "opacity:.45" : ""} @click=${() => c(-1)}><span class="nm">${r(t, "en_move_up")}</span></button>
          <button class="li" ?disabled=${s === e.length - 1} style=${s === e.length - 1 ? "opacity:.45" : ""} @click=${() => c(1)}><span class="nm">${r(t, "en_move_down")}</span></button>
        </div>
      </section>
      <button class="remove" @click=${() => {
      this._setConsumers(e.filter((h, u) => u !== s)), this._sub = void 0;
    }}>${r(t, "en_remove")}</button>
    </div>`;
  }
  /** Power sensors for the main meter or a consumer (the ones already used last). */
  _powerList() {
    const t = this.hass, e = new Set(this._consumers.map((s) => s.entity));
    return Object.keys(t.states).filter((s) => sr(t, s) && this._visible(s) && this._match(this._entName(s), s)).sort((s, i) => Number(e.has(s)) - Number(e.has(i)) || this._entName(s).localeCompare(this._entName(i))).slice(0, 80);
  }
  /** Switch: colour (with a preview), 2/2 view, icon and consumption sensors. */
  _switchSettings(t) {
    const e = this.hass, s = this.draft.config, i = s.name || this._defaultName(), n = s.icon || we(`${i} ${s.entity}`), a = hs(s.color), o = t ? this._entitiesOf(t, (p) => /^(switch|input_boolean)\./.test(p)) : [], l = Kt(e, { entity: s.entity }), c = (p, _) => s[p] === "none" ? r(e, "none") : s[p] ? this._entName(s[p]) : _ ? `${r(e, "auto")} · ${this._entName(_)}` : r(e, "auto"), h = s.style ?? "c", u = (p) => d`<button class="opt ${h === p ? "sel" : ""}" @click=${() => this._set({ style: p === "c" ? void 0 : p })}>
      <span class="on">${r(e, `sw_style_${p}`)}<small>${r(e, `sw_style_${p}_sub`)}</small></span>
      <span class="ck">${Ut(18)}</span>
    </button>`;
    return d`
      ${o.length > 1 ? d`<section><h3>${r(e, "sw_entity")}</h3><div class="list">${this._row(r(e, "sw_entity"), this._entName(s.entity), "entity", s.entity)}</div></section>` : f}
      <section>
        <h3>${r(e, "sw_color")}</h3>
        <div class="list">
          <div class="sws">
            ${Ss.map((p) => {
      const _ = (s.color ?? "amber") === p.key;
      return d`<button class="sw ${_ ? "sel" : ""}" aria-label=${r(e, p.name)} aria-pressed=${_} @click=${() => this._set({ color: p.key === "amber" ? void 0 : p.key })}>
                <i style="background:${hs(p.key).bg}"><b style="background:${p.hex}">${_ ? Ut(16) : f}</b></i>
                <span>${r(e, p.name)}</span>
              </button>`;
    })}
          </div>
          <div class="prev">
            <span class="pc" style="background:${a.bg};color:${a.fg}"><i style="background:${a.accent}">${gt(n, !0, 20)}</i><span>${i}<small style="color:${a.fg2}">${r(e, "sw_on")}</small></span></span>
            <span class="pc off"><i>${gt(n, !1, 20)}</i><span>${i}<small>${r(e, "sw_off")}</small></span></span>
          </div>
        </div>
        <p class="note" style="margin-top:8px">${r(e, "sw_color_note")}</p>
      </section>
      <section>
        <h3>${r(e, "sw_style")}</h3>
        <div class="list">${u("a")}${u("b")}${u("c")}</div>
      </section>
      <section>
        <h3>${r(e, "sw_icon")}</h3>
        <div class="list">
          <div class="igrid">
            ${Mc.map((p) => d`<button class="gi ${n === p ? "sel" : ""}" aria-label=${p} aria-pressed=${n === p} @click=${() => this._set({ icon: p })}>${gt(p, !1, 22)}</button>`)}
          </div>
        </div>
      </section>
      <section>
        <h3>${r(e, "sw_meter")}</h3>
        <div class="list">
          ${this._row(r(e, "sw_power"), c("power_entity", l.power), "power_entity")}
          ${this._row(r(e, "sw_energy"), c("energy_entity", l.energy), "energy_entity")}
        </div>
        <p class="note" style="margin-top:8px">${r(e, "sw_meter_note")}</p>
      </section>`;
  }
  // ---- Sub pages ---------------------------------------------------------------
  _opt(t, e, s, i, n) {
    return d`<button class="opt ${s ? "sel" : ""}" @click=${() => {
      i(), this._sub = void 0, this._q = "";
    }}>
      ${n ? d`<span class="ic">${n}</span>` : f}
      <span class="on">${t}${e ? d`<small>${e}</small>` : f}</span>
      <span class="ck">${Ut(18)}</span>
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
      const h = this._devices.map((g) => ({ d: g, lights: this._entitiesOf(g.id, (m) => m.startsWith("light.")) })).filter((g) => g.lights.length && this._match(this._devName(g.d), ...g.lights.map(this._entName))).sort((g, m) => this._devName(g.d).localeCompare(this._devName(m.d))), u = Object.keys(t.states).filter((g) => g.startsWith("light.") && this._visible(g) && !this._deviceOf(g) && this._match(this._entName(g), g)), p = u.filter((g) => Ma(t.states[g])), _ = u.filter((g) => !Ma(t.states[g])), b = (g) => this._set({ entity: g, device: void 0, name: this._entName(g) });
      return d`${this._search()}
        ${this._group(r(t, "light_groups"), p.map((g) => this._opt(this._entName(g), r(t, "group"), s.entity === g, () => b(g), it(!1, 20))))}
        ${this._byArea(h, (g) => g.d.area_id, (g) => this._opt(this._devName(g.d), g.lights.length > 1 ? `${g.lights.length} ${r(t, "lights_word")}` : g.d.model ?? void 0, i === g.d.id, () => this._set({ device: g.d.id, entity: g.lights[0], name: this._devName(g.d) }), it(!1, 20)))}
        ${this._group(r(t, "other_lights"), _.map((g) => this._opt(this._entName(g), g, s.entity === g, () => b(g), it(!1, 20))))}`;
    }
    if (e === "vacuum") {
      const h = this._devices.map((p) => ({ d: p, ents: this._entitiesOf(p.id, (_) => _.startsWith("vacuum.")) })).filter((p) => p.ents.length && this._match(this._devName(p.d), ...p.ents.map(this._entName))).sort((p, _) => this._devName(p.d).localeCompare(this._devName(_.d))), u = Object.keys(t.states).filter((p) => p.startsWith("vacuum.") && this._visible(p) && !this._deviceOf(p) && this._match(this._entName(p), p));
      return d`${this._search()}
        ${this._byArea(h, (p) => p.d.area_id, (p) => this._opt(this._devName(p.d), p.d.model ?? void 0, i === p.d.id, () => this._set({ device: p.d.id, entity: p.ents[0], name: this._devName(p.d), routines: void 0 }), xs(20)))}
        ${this._group(r(t, "other_vacuums"), u.map((p) => this._opt(this._entName(p), p, s.entity === p, () => this._set({ entity: p, device: void 0, name: this._entName(p), routines: void 0 }), xs(20))))}`;
    }
    if (e === "contact") {
      const h = this._devices.map((p) => ({ d: p, ents: this._entitiesOf(p.id, (_) => _e(t, _)) })).filter((p) => p.ents.length && this._match(this._devName(p.d), ...p.ents.map(this._entName))).sort((p, _) => this._devName(p.d).localeCompare(this._devName(_.d))), u = Object.keys(t.states).filter((p) => _e(t, p) && this._visible(p) && !this._deviceOf(p) && this._match(this._entName(p), p));
      return d`${this._search()}
        ${this._byArea(h, (p) => p.d.area_id, (p) => this._opt(
        this._devName(p.d),
        p.d.model ?? void 0,
        i === p.d.id,
        () => this._set({ device: p.d.id, entity: p.ents[0], name: this._devName(p.d), kind: void 0 }),
        zt(st(t, { entity: p.ents[0], name: this._devName(p.d) }), !1, 20)
      ))}
        ${this._group(r(t, "other_contacts"), u.map((p) => this._opt(
        this._entName(p),
        p,
        s.entity === p,
        () => this._set({ entity: p, device: void 0, name: this._entName(p), kind: void 0 }),
        zt(st(t, { entity: p }), !1, 20)
      )))}`;
    }
    if (e === "switch") {
      const h = (b) => /^(switch|input_boolean)\./.test(b), u = this._devices.map((b) => ({ d: b, ents: this._entitiesOf(b.id, h) })).filter((b) => b.ents.length && this._match(this._devName(b.d), ...b.ents.map(this._entName))).sort((b, g) => this._devName(b.d).localeCompare(this._devName(g.d))), p = Object.keys(t.states).filter((b) => h(b) && this._visible(b) && !this._deviceOf(b) && this._match(this._entName(b), b)), _ = { power_entity: void 0, energy_entity: void 0, icon: void 0 };
      return d`${this._search()}
        ${this._byArea(u, (b) => b.d.area_id, (b) => this._opt(this._devName(b.d), b.ents.length > 1 ? b.ents.map(this._entName).join(" · ") : b.d.model ?? void 0, i === b.d.id, () => this._set({ device: b.d.id, entity: b.ents[0], name: this._devName(b.d), ..._ }), gt(we(this._devName(b.d)), !1, 20)))}
        ${this._group(r(t, "other_switches"), p.map((b) => this._opt(this._entName(b), b, s.entity === b, () => this._set({ entity: b, device: void 0, name: this._entName(b), ..._ }), gt(we(this._entName(b)), !1, 20))))}`;
    }
    if (e === "climate") {
      const h = this._devices.map((p) => ({ d: p, ents: this._entitiesOf(p.id, (_) => _.startsWith("climate.")) })).filter((p) => p.ents.length && this._match(this._devName(p.d), ...p.ents.map(this._entName))).sort((p, _) => this._devName(p.d).localeCompare(this._devName(_.d))), u = Object.keys(t.states).filter((p) => p.startsWith("climate.") && this._visible(p) && !this._deviceOf(p) && this._match(this._entName(p), p));
      return d`${this._search()}
        ${this._byArea(h, (p) => p.d.area_id, (p) => this._opt(this._devName(p.d), p.d.model ?? void 0, i === p.d.id, () => this._set({ device: p.d.id, entity: p.ents[0], name: this._devName(p.d) }), bs(20)))}
        ${this._group(r(t, "other_climates"), u.map((p) => this._opt(this._entName(p), p, s.entity === p, () => this._set({ entity: p, device: void 0, name: this._entName(p) }), bs(20))))}`;
    }
    const n = this._devices.map((h) => ({ d: h, locks: this._entitiesOf(h.id, (u) => ji.includes(ls(u))) })).filter((h) => h.locks.length), a = (h) => Zc.test([this._devName(h.d), h.d.manufacturer, h.d.model].join(" ")), o = n.filter((h) => (this._allDevices || a(h)) && this._match(this._devName(h.d), h.d.manufacturer, h.d.model)), l = (h) => h.find((u) => /bloq|lock/i.test(u + this._entName(u))) ?? h.find((u) => /paus|stop/i.test(u + this._entName(u))) ?? h[0], c = (h) => {
      const u = l(h.locks);
      this._set({ device: h.d.id, entity: u, invert: Aa(t, u) || void 0, name: this._devName(h.d), status_entity: void 0, power_entity: void 0, energy_entity: void 0 });
    };
    return d`${this._search()}
      ${this._byArea(o, (h) => h.d.area_id, (h) => this._opt(this._devName(h.d), h.locks.map(this._entName).join(" · "), i === h.d.id, () => c(h), vi(20)))}
      ${o.length ? f : d`<p class="note">${r(t, "no_chargers_found")}</p>`}
      ${this._allDevices ? f : d`<button class="more" @click=${() => this._allDevices = !0}>${r(t, "show_all_devices")}</button>`}`;
  }
  _search() {
    return d`<label class="search">${uo(16)}<input type="search" placeholder=${r(this.hass, "search_entities")} .value=${this._q}
      @input=${(t) => this._q = t.target.value} /></label>`;
  }
  _subPage() {
    const t = this.hass, { config: e } = this.draft, s = this._sub;
    if (s === "device") return d`<div class="scroll">${this._devicePage()}</div>`;
    if (s === "consumer") return this._consumerPage();
    if (s === "group_entity") {
      const l = e.group ?? [], c = Object.keys(t.states).filter((h) => _e(t, h) && h !== e.entity && !l.includes(h) && this._visible(h) && this._match(this._entName(h), h)).sort((h, u) => this._entName(h).localeCompare(this._entName(u)));
      return d`<div class="scroll">${this._search()}<div class="list">
        ${c.map((h) => this._opt(this._entName(h), h, !1, () => this._set({ group: [...l, h] }), zt(st(t, { entity: h }), !1, 20)))}
      </div></div>`;
    }
    if (s === "total")
      return d`<div class="scroll">${this._search()}
        <div class="list">
          ${this._opt(r(t, "en_total_none"), r(t, "en_total_none_sub"), !!e.sum_only, () => this._set({ sum_only: !0, entity: this._consumers[0]?.entity ?? "none" }))}
          ${this._powerList().map((l) => this._opt(this._entName(l), ee(t, l) ? `${l} · ${r(t, "en_counter")}` : l, !e.sum_only && e.entity === l, () => this._set({ sum_only: void 0, entity: l })))}
        </div></div>`;
    if (s === "consumer_entity") {
      const l = this._ci, c = this._consumers;
      return d`<div class="scroll">${this._search()}
        <div class="list">${this._powerList().filter((h) => e.sum_only || h !== e.entity).map((h) => this._opt(this._entName(h), ee(t, h) ? `${h} · ${r(t, "en_counter")}` : h, c[l]?.entity === h, () => {
        l < c.length ? this._setConsumers(c.map((u, p) => p === l ? { ...u, entity: h } : u)) : this._setConsumers([...c, { entity: h, color: kt[c.length % kt.length] }]), queueMicrotask(() => this._sub = "consumer");
      }))}</div></div>`;
    }
    if (s === "weather") {
      const l = this._weathers();
      return d`<div class="scroll">${this._group(r(t, "type_weather"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c }))))}</div>`;
    }
    if (s === "alarm") {
      const l = Object.keys(t.states).filter((c) => c.startsWith("alarm_control_panel.") && this._visible(c));
      return d`<div class="scroll">${this._group(r(t, "type_alarm"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, name: e.name || void 0 }), yi(20))))}
        ${l.length ? f : d`<p class="note">${r(t, "no_alarms_found")}</p>`}</div>`;
    }
    const i = e.device ?? this._deviceOf(e.entity);
    if (s === "entity") {
      const l = this.draft.type === "climate" ? "climate." : "light.", c = this.draft.type === "switch" ? (u) => /^(switch|input_boolean)\./.test(u) : this.draft.type === "contact" ? (u) => _e(t, u) : (u) => u.startsWith(l), h = i ? this._entitiesOf(i, c) : [];
      return d`<div class="scroll">${this._group(r(t, "light_entity"), h.map((u) => this._opt(this._entName(u), u, e.entity === u, () => this._set({ entity: u }))))}</div>`;
    }
    if (s === "lock") {
      const l = i ? this._entitiesOf(i, (c) => ji.includes(ls(c))) : Object.keys(t.states).filter((c) => ji.includes(ls(c)) && this._visible(c) && this._match(this._entName(c), c));
      return d`<div class="scroll">${i ? f : this._search()}${this._group(r(t, "ch_lock_entity"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, invert: Aa(t, c) || void 0 }))))}</div>`;
    }
    const n = s === "status_entity" ? (l) => Mo(t, l) : s === "power_entity" ? (l) => Fn(t, l) : (l) => Bn(t, l), a = new Set(e.entity ? wi(t, e.entity) : []), o = Object.keys(t.states).filter((l) => this._visible(l) && n(l) && this._match(this._entName(l), l)).sort((l, c) => Number(a.has(c)) - Number(a.has(l)) || this._entName(l).localeCompare(this._entName(c))).slice(0, 60);
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
    if (this.draft.type === "energy" && !this.draft.config.entity && this.hass) {
      const t = Hc(this.hass);
      t && (this.draft = { ...this.draft, config: { ...this.draft.config, entity: t } });
    }
    if (this.draft.type === "alarm" && !this.draft.config.entity && this.hass) {
      const t = this._alarms()[0];
      t && (this.draft = { ...this.draft, config: { ...this.draft.config, entity: t } });
    }
  }
};
mt.styles = [
  D.styles,
  E`
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 4px;
      }
      .sws {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px 8px;
        padding: 14px 12px 12px;
      }
      .sw {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
      .sw i {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sw b {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .sw.sel i {
        box-shadow: 0 0 0 3px #fff;
      }
      .sw.sel span {
        color: #fff;
      }
      .prev {
        display: flex;
        gap: 12px;
        padding: 12px 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      }
      .pc {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 16px;
        padding: 10px;
        font-size: 15px;
        font-weight: 600;
      }
      .pc > span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pc i {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .pc small {
        display: block;
        font-size: 12px;
        font-weight: 400;
      }
      .pc.off {
        background: rgba(255, 255, 255, 0.12);
      }
      .pc.off i {
        background: rgba(255, 255, 255, 0.18);
      }
      .pc.off small {
        color: rgba(255, 255, 255, 0.65);
      }
      .views {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        padding: 10px;
      }
      .vw {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px 6px 10px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        border: 2px solid transparent;
      }
      .rec {
        height: 32px;
        padding: 0 12px;
        border-radius: 16px;
        background: #fff;
        color: #23233a;
        font-size: 13px;
        font-weight: 700;
        flex: none;
      }
      .rec:disabled {
        opacity: 0.4;
      }
      .views.four {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .x {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        font-size: 18px;
        line-height: 1;
        flex: none;
      }
      .vw.sel {
        background: rgba(255, 255, 255, 0.14);
        border-color: #fff;
        color: #fff;
      }
      .ic.dash {
        background: none;
        border: 2px dashed rgba(255, 255, 255, 0.45);
        box-sizing: border-box;
      }
      .addc .nm {
        font-weight: 600;
      }
      .li .ic {
        color: #fff;
      }
      .igrid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
        padding: 12px;
      }
      .gi {
        aspect-ratio: 1;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gi.sel {
        background: #fff;
        color: #23233a;
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
de([
  $({ attribute: !1 })
], mt.prototype, "draft", 2);
de([
  $({ attribute: !1 })
], mt.prototype, "options", 2);
de([
  w()
], mt.prototype, "_sub", 2);
de([
  w()
], mt.prototype, "_q", 2);
de([
  w()
], mt.prototype, "_allDevices", 2);
de([
  w()
], mt.prototype, "_ci", 2);
mt = de([
  j("terral-card-config")
], mt);
function hr(t, e, s) {
  document.querySelector("terral-card-config")?.remove();
  const i = document.createElement("terral-card-config");
  return i.hass = t, i.draft = { ...e, config: { ...e.config } }, i.options = s, document.body.appendChild(i), i;
}
function vt(t, e, s, i) {
  const { type: n, view_layout: a, ...o } = i, l = a?.terral;
  hr(e, { type: s, config: o, w: l?.w ?? 2, h: l?.h ?? 2 }, {
    mode: "edit",
    onSave: (c) => t.dispatchEvent(new CustomEvent("terral-card-config", { detail: { config: c.config, size: { w: c.w, h: c.h } }, bubbles: !0, composed: !0, cancelable: !0 })),
    onRemove: () => t.dispatchEvent(new CustomEvent("terral-card-remove", { bubbles: !0, composed: !0 }))
  });
}
function Jc(t) {
  return { type: t, config: t === "energy" ? { consumers: [] } : {}, w: t === "light" ? 1 : 2, h: t === "energy" ? 4 : 2 };
}
function td(t) {
  for (const e of document.querySelectorAll("terral-card-config")) e.hass = t;
}
var ed = Object.defineProperty, sd = Object.getOwnPropertyDescriptor, wt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? sd(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ed(e, s, n), n;
};
const id = "terral-home-light";
let se = class extends B {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      Rl(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area,
        onSettings: () => this.hass && this._config && vt(this, this.hass, "light", this._config)
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !Vt(e) && rs(this.hass, e);
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
    return t ? Ys(t) === "temperature" || Ys(t) === "color" || ut(t).length > 0 ? e : e.slice(0, 3) : e;
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...ut(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && ql(this.hass);
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
    if (Vt(t)) return r(s, "unavailable");
    const i = ut(t);
    if (i.length) {
      const l = i.filter((u) => I(s.states[u])).length;
      if (!l) return `${i.length} ${r(s, "lights_off")}`;
      const c = Ft(t), h = l === i.length && e === "onoff" ? `${r(s, "all_lit")} (${l})` : `${l} ${r(s, "of")} ${i.length} ${r(s, "lit")}`;
      return c != null && this._size !== "s11" ? `${h} · ${c} %` : h;
    }
    if (!I(t)) return r(s, "off");
    const n = [], a = Ft(t);
    a != null && n.push(`${a} %`);
    const o = Ae(t);
    if (o) {
      const l = rn(o, F(s));
      l && n.push(l);
    } else if (e === "temperature" || e === "color") {
      const l = ys(t);
      if (l && t.attributes.color_mode === "color_temp") {
        const c = [...an].sort((h, u) => Math.abs(h.kelvin - l) - Math.abs(u.kelvin - l))[0];
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
    const e = Ys(t), s = I(t), i = Vt(t), n = ut(t), a = wo(t, this._config.use_light_color !== !1), o = s ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};--fill:${a.fill}` : "";
    let l = this._size;
    l === "s42" && !this.getTerralSizes().some((u) => u.h === 4) && (l = "s22");
    const c = d`<button
      class="icon"
      aria-label="${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${it(s, l === "s11" ? 20 : 32)}
      ${n.length && s ? d`<span class="badge">${n.filter((u) => I(this.hass.states[u])).length}</span>` : f}
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
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >
      ${l === "s11" || l === "s21" ? d`${c}${h}` : d`<div class="head">${c}${h}${this._quickButton(t, e, l)}</div>
            ${this._body(t, e, l)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !ut(t).length) return f;
    const i = Ae(t), n = i ? rn(i, F(this.hass)) ?? "" : "", a = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? rt(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style=${a}></i>${n || (e === "color" ? r(this.hass, "more_colors") : r(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return d`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${Ft(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(s) => on(this.hass, t.entity_id, s.detail.value)}
    >${po(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = ut(t);
    if (s === "s42" && i.length) {
      const a = [...i].sort((h, u) => Number(I(this.hass.states[u])) - Number(I(this.hass.states[h]))), o = e === "onoff" ? 5 : 4, l = a.length > o ? a.slice(0, o - 1) : a, c = a.length - l.length;
      return d`
        ${e !== "onoff" ? this._brightness(t) : f}
        <div class="members">
          ${l.map((h) => {
        const u = this.hass.states[h], p = I(u), _ = u ? this.hass.formatEntityName?.(u) ?? u.attributes.friendly_name ?? h : h;
        return d`<div class="mr">
              <button class="mi ${p ? "lit" : ""}" ?disabled=${Vt(u)} aria-label="${p ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${_}"
                @click=${(b) => {
          b.stopPropagation(), u && rs(this.hass, u);
        }}>${it(p, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${_}</span><small>${u ? I(u) ? Ft(u) != null ? `${Ft(u)} %` : r(this.hass, "on") : r(this.hass, "off") : "—"}</small></button>
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
        return d`<span class="tag"><i class=${I(o) ? "lit" : ""}></i>${l}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${I(t) ? r(this.hass, "on") : r(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const a = t.attributes.min_color_temp_kelvin ?? 2e3, o = t.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${r(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${r(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${a} .max=${o} .value=${ys(t) ?? 3500}
          .label=${r(this.hass, "temperature")}
          @value-changed=${(l) => ti(this.hass, t, l.detail.value)}></terral-slider>
        <div class="chips">
          ${an.map((l) => d`<button class="chip" style="background:${l.css}" @click=${(c) => {
        c.stopPropagation(), ti(this.hass, t, l.kelvin);
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
se.styles = E`
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
wt([
  $({ attribute: !1 })
], se.prototype, "hass", 2);
wt([
  $({ type: Boolean })
], se.prototype, "preview", 2);
wt([
  w()
], se.prototype, "_config", 2);
wt([
  w()
], se.prototype, "_size", 2);
se = wt([
  j(id)
], se);
let Ee = class extends B {
  render() {
    if (!this.hass || !this.entity) return f;
    const t = F(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: rt(i) })) : nd[t] ??= ad(t), s = Ae(this.entity);
    return e.slice(0, 6).map(
      (i) => d`<button
        class=${s && rt(s) === rt(i.rgb) ? "sel" : ""}
        style="background:${rt(i.rgb)}"
        aria-label=${i.name}
        @click=${(n) => {
        n.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
Ee.styles = E`
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
wt([
  $({ attribute: !1 })
], Ee.prototype, "hass", 2);
wt([
  $({ attribute: !1 })
], Ee.prototype, "entity", 2);
wt([
  $({ attribute: !1 })
], Ee.prototype, "colors", 2);
Ee = wt([
  j("terral-light-favs")
], Ee);
const nd = {}, ad = (t) => In.map((e) => ({ rgb: e.rgb, name: e.name[t] })), od = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, pr = ["away", "home", "night", "vacation", "custom"], rd = ["away", "home", "vacation"], wn = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function ie(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const Fi = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : pr.includes(e) ? e : void 0;
};
function na(t) {
  return Fi(t.state) ?? Fi(t.attributes.arm_mode) ?? Fi(t.attributes.next_state);
}
function ur(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? pr.filter((s) => e & od[s]) : ["away", "home"];
}
function di(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function ld(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const aa = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, cd = (t) => aa(t) != null && t.attributes.code_arm_required !== !1;
function hi(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function dd(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const $n = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function hd(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function pd(t, e, s, i, n = !1) {
  if (hd(t, e)) {
    const o = { entity_id: e.entity_id, mode: s };
    return i && (o.code = i), n && (o.force = !0), t.callService("alarmo", "arm", o);
  }
  const a = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", a, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function ud(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function gd(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function gr(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), n = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(n, 150);
    };
    n();
  });
}
function fd(t, e, s, i, n, a = {}) {
  const o = async (h) => {
    const u = t(), p = u?.states[e];
    if (!u || !p) return { result: "wrong" };
    try {
      await pd(u, p, s, h, a.force);
    } catch {
      return { result: "wrong", code: h };
    }
    const _ = () => t()?.states[e];
    if (await gr(() => {
      const m = _();
      return !!m && ie(m) !== "disarmed";
    })) return { result: "armed", code: h };
    const g = _();
    return { result: g && hi(g).length ? "refused" : "wrong", code: h };
  }, l = t()?.states[e];
  if (!l) return;
  const c = aa(l);
  if (a.code != null || !c || !cd(l)) {
    o(a.code).then(n);
    return;
  }
  i(c, async (h) => {
    const u = await o(h);
    return u.result === "wrong" ? !1 : (n(u), !0);
  });
}
function _d(t, e, s) {
  const i = async (o) => {
    const l = t(), c = l?.states[e];
    if (!l || !c) return !1;
    try {
      await ud(l, c, o);
    } catch {
      return !1;
    }
    return gr(() => {
      const h = t()?.states[e];
      return !!h && ie(h) === "disarmed";
    });
  }, n = t()?.states[e];
  if (!n) return;
  const a = aa(n);
  if (!a) {
    i();
    return;
  }
  s(a, i);
}
const Bi = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), Rs = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function md(t) {
  const e = wn[t];
  return {
    bg: Rs(Bi(e, [255, 255, 255], 0.84), 0.95),
    fg: Rs(Bi(e, [10, 10, 20], 0.82)),
    fg2: Rs(Bi(e, [20, 10, 30], 0.72)),
    accent: Rs(e)
  };
}
const Ia = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var bd = Object.defineProperty, xd = Object.getOwnPropertyDescriptor, Re = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? xd(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && bd(e, s, n), n;
};
let Et = class extends D {
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
        <button class="key fn" aria-label=${r(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${ml(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${r(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${Ut(26)}</button>
      </div>
    `;
  }
};
Et.styles = [
  D.styles,
  E`
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
Re([
  $()
], Et.prototype, "format", 2);
Re([
  $({ attribute: !1 })
], Et.prototype, "submit", 2);
Re([
  w()
], Et.prototype, "_code", 2);
Re([
  w()
], Et.prototype, "_error", 2);
Re([
  w()
], Et.prototype, "_busy", 2);
Et = Re([
  j("terral-code-sheet")
], Et);
function fr(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const zs = /* @__PURE__ */ new Map(), yd = 6e4, As = "terral-alarm-refusal", _r = () => window.dispatchEvent(new Event(As));
function pi(t) {
  const e = zs.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > yd || ie(t) !== "disarmed") {
      zs.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function oa(t) {
  zs.delete(t) && _r();
}
function ui(t, e, s, i = !1) {
  const n = t();
  if (!n) return;
  const a = zs.get(e), o = i ? { force: !0, code: a?.code } : {};
  oa(e), fd(
    t,
    e,
    s,
    (l, c) => fr(n, l, c),
    (l) => {
      l.result === "refused" && (zs.set(e, { mode: s, code: l.code, at: Date.now() }), _r());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    o
  );
}
function us(t, e) {
  const s = t();
  s && _d(t, e, (i, n) => fr(s, i, n));
}
const vd = (t) => t.charAt(0).toLowerCase() + t.slice(1), gi = (t, e) => r(t, `mode_${e}`);
function mr(t, e, s) {
  const i = ie(e), n = na(e), a = n ? vd(gi(t, n)) : "";
  if (pi(e)) {
    const l = hi(e);
    return {
      title: r(t, "alarm_failed"),
      status: l.length > 1 ? r(t, "alarm_open_n", { n: l.length }) : r(t, "alarm_open", { name: l[0] ? $n(t, l[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: r(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${r(t, "alarm_arming", { mode: a })} · ${r(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${r(t, "alarm_armed", { mode: a })} · ${r(t, "alarm_since", { t: Ia(t, e.last_changed) })}` };
    case "pending":
      return { title: r(t, "alarm_pending"), status: r(t, "alarm_pending_sub") };
    case "triggered": {
      const l = hi(e), c = l.length ? $n(t, l[0]) + (l.length > 1 ? ` +${l.length - 1}` : "") : s;
      return { title: r(t, "alarm_triggered"), status: `${c} · ${Ia(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: r(t, "unavailable") };
  }
}
const br = (t) => {
  const e = di(t);
  return e == null ? null : Math.ceil(e);
};
var wd = Object.defineProperty, $d = Object.getOwnPropertyDescriptor, Os = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? $d(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && wd(e, s, n), n;
};
const xr = (t, e = 20) => ({ away: ul, home: Js, night: gl, vacation: fl, custom: _l })[t](e);
let ne = class extends D {
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
    }}>${Q(19)}</button>` : f;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(As, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && di(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(As, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? d`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => d`<div class="row static"><span class="ic">${sn(18)}</span><span class="nm">${$n(this.hass, s)}</span></div>`)}</div>
    </section>` : f;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = ie(e), n = na(e), a = pi(e), o = br(e), { title: l, status: c } = mr(t, e, this.name), h = i === "armed" && n ? `rgb(${wn[n].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", u = a || i === "pending" || i === "triggered" ? sn(30) : i === "armed" ? fo(32) : yi(32), p = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let _ = f;
    a ? _ = d`<div class="btns">
        <button class="big solid" @click=${() => ui(this._getHass, s, a.mode, !0)}>${ze()}<span>${r(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => oa(s)}><span>${r(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? _ = d`<section>
        <h3>${r(t, "arm_options")}</h3>
        <div class="list">
          ${ur(e).map(
      (g) => d`<button class="row" @click=${() => ui(this._getHass, s, g)}>
              <span class="ic" style="color:rgb(${wn[g].join(",")})">${xr(g)}</span><span class="nm">${gi(t, g)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? _ = d`<div class="btns">
        <button class="big" @click=${() => us(this._getHass, s)}>${xi(20)}<span>${r(t, "cancel")}</span></button>
        ${p ? d`<button class="big" @click=${() => gd(t, e)}>${bl()}<span>${r(t, "skip_delay")}</span></button>` : f}
      </div>` : i !== "unavailable" && (_ = d`<div class="btns"><button class="big solid" @click=${() => us(this._getHass, s)}>${ms()}<span>${r(t, "disarm")}</span></button></div>`);
    const b = e.attributes.changed_by;
    return d`
      <div class="status st-${a ? "failed" : i}" style="--ac:${h}">
        <span class="sic">${u}</span>
        <div class="txt"><strong>${l}</strong><span>${c}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : f}
      </div>
      <div class="scroll">
        ${_}
        ${this._sensorList(r(t, "open_sensors"), hi(e))}
        ${i === "armed" ? this._sensorList(r(t, "bypassed_sensors"), dd(e)) : f}
        <p class="foot">${r(t, "changed_by")}: ${b ? `${b} · ` : ""}${ho(t, e.last_changed)}</p>
      </div>
    `;
  }
};
ne.styles = [
  D.styles,
  E`
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
Os([
  $()
], ne.prototype, "entityId", 2);
Os([
  $()
], ne.prototype, "name", 2);
Os([
  $({ attribute: !1 })
], ne.prototype, "onSettings", 2);
Os([
  w()
], ne.prototype, "_tick", 2);
ne = Os([
  j("terral-alarm-dialog")
], ne);
function kd(t, e, s, i) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const n = document.createElement("terral-alarm-dialog");
  return n.hass = t, n.entityId = e, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Md(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var Sd = Object.defineProperty, Cd = Object.getOwnPropertyDescriptor, zi = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Cd(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Sd(e, s, n), n;
};
const zd = "terral-home-alarm";
let je = class extends B {
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
    super.connectedCallback(), window.addEventListener(As, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(As, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
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
    t.has("hass") && this.hass && Md(this.hass);
    const e = this._entity, s = !!e && di(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && kd(this.hass, this._config.entity, this._name, () => this.hass && this._config && vt(this, this.hass, "alarm", this._config));
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = ie(t), i = pi(t);
    if (i)
      return d`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => ui(this._getHass, e, i.mode, !0))}>${ze()}<span>${r(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => oa(e))}><span>${r(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const n = ur(t).filter((a) => rd.includes(a));
        return d`<div class="row ${n.length > 2 ? "three" : ""}">
          ${n.map(
          (a) => d`<button class="pb" aria-label=${r(this.hass, "arm_mode", { mode: gi(this.hass, a) })} @click=${this._act(() => ui(this._getHass, e, a))}>
              ${xr(a)}<span>${gi(this.hass, a)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return d`<div class="row"><button class="pb" @click=${this._act(() => us(this._getHass, e))}>${xi(20)}<span>${r(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return d`<div class="row"><button class="pb" @click=${this._act(() => us(this._getHass, e))}>${ms()}<span>${r(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return d`<div class="row"><button class="pb solid" @click=${this._act(() => us(this._getHass, e))}>${ms()}<span>${r(this.hass, "disarm")}</span></button></div>`;
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
    const e = ie(t), s = !!pi(t), i = na(t), n = e === "armed" && !!i, a = n ? md(i) : void 0, o = br(t), l = ld(t), c = di(t), h = c != null && l ? c / l : 0, u = `${a ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};` : ""}--p:${h}`, p = s || e === "pending" || e === "triggered" ? sn(28) : n ? fo(30) : yi(30), { title: _, status: b } = mr(this.hass, t, this._name);
    return d`<div
      class="card ${n ? "on" : "off"} st-${s ? "failed" : e}"
      style=${u}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${_}, ${b}`}
      @click=${this._cardClick}
      @keydown=${(m) => {
      (m.key === "Enter" || m.key === " ") && m.target === m.currentTarget && (m.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(m) => m.preventDefault()}
    >
      <div class="head">
        <span class="icon">${p}</span>
        <div class="text"><span class="name">${_}</span><span class="state">${b}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : f}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
je.styles = E`
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
zi([
  $({ attribute: !1 })
], je.prototype, "hass", 2);
zi([
  w()
], je.prototype, "_config", 2);
zi([
  w()
], je.prototype, "_tick", 2);
je = zi([
  j(zd)
], je);
const qs = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), me = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, Vi = [52, 199, 123], Ad = [255, 149, 0], Ha = [90, 200, 250], Yi = "#b3261e", Td = "#3a3d4a", Ra = (t, e, s, i, n) => `--bg:${me(qs(t, [255, 255, 255], e), 0.95)};--bg-solid:${me(qs(t, [255, 255, 255], e))};--fg:${me(qs(i, [10, 10, 20], 0.8))};--fg2:${me(qs(i, [20, 10, 30], 0.7))};--accent:${me(s)};--lk:${n}`;
function ns(t, e) {
  const s = t.states[e.entity], i = Vn(t, e), n = Vl(t, i), a = qn(t, i.power);
  if (!s || s.state === "unavailable" || s.state === "unknown")
    return { look: "unavailable", locked: !1, car: n, ids: i, kw: a, style: "", tinted: !1 };
  const o = Fl(s, !!e.invert);
  let l;
  o ? l = n === "connected" || n === "charging" ? "warn" : "locked" : n === "charging" ? l = "charging" : n === "connected" ? l = "ready" : l = "none";
  const c = l === "charging" ? Ra(Vi, 0.84, Vi, Vi, Yi) : l === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${me(Ad)};--lk:${Yi}` : l === "ready" ? Ra(Ha, 0.8, Ha, [30, 110, 160], Yi) : `--lk:${Td}`;
  return { look: l, locked: o, car: n, ids: i, kw: a, style: c, tinted: l === "charging" || l === "warn" || l === "ready" };
}
function as(t, e, s) {
  const i = e.kw != null ? `${lt(t, e.kw)} kW` : "";
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
var Dd = Object.defineProperty, Od = Object.getOwnPropertyDescriptor, qe = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Od(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Dd(e, s, n), n;
};
let jt = class extends D {
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
    }}>${Q(19)}</button>` : f;
  }
  updated() {
    if (!this.hass) return;
    const t = Vn(this.hass, this.config).power;
    t && t !== this._histFor && (this._histFor = t, this._load(t));
  }
  async _load(t) {
    try {
      const e = Date.now(), s = await So(this.hass, t, new Date(e - 7 * 864e5));
      this._sessions = Co(s, e), this._histError = !1;
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
    const s = ns(t, this.config), i = ko(t, s.ids.energy), n = this._sessions?.find((g) => g.live), a = s.look === "charging" && i != null ? r(t, "this_charge", { kwh: `${lt(t, i)} kWh`, time: n ? cn(Date.now() - n.start) : "" }).replace(/ · $/, "") : i != null ? `${r(t, "last_session")}: ${lt(t, i)} kWh` : "", o = this._sessions ? zo(this._sessions, 7) : void 0, l = o ? Math.max(...o.map((g) => g.kwh), 0.1) : 1, c = o?.reduce((g, m) => g + m.kwh, 0) ?? 0, h = this._sessions?.length ?? 0, u = [...this._sessions ?? []].reverse().slice(0, 5), p = t.locale?.language ?? t.language ?? void 0, _ = (g, m) => m === 6 ? p?.startsWith("es") ? "Hoy" : "Today" : g.toLocaleDateString(p, { weekday: "narrow" }), b = (g) => {
      const m = new Date(g), y = /* @__PURE__ */ new Date(), v = new Date(y.getFullYear(), y.getMonth(), y.getDate() - 1), k = m.toLocaleTimeString(p, { hour: "2-digit", minute: "2-digit" }), C = p?.startsWith("es");
      if (m.toDateString() === y.toDateString()) return `${C ? "Hoy" : "Today"} · ${k}`;
      if (m.toDateString() === v.toDateString()) return `${C ? "Ayer" : "Yesterday"} · ${k}`;
      const S = m.toLocaleDateString(p, { weekday: "long", day: "numeric" });
      return `${S.charAt(0).toUpperCase()}${S.slice(1)} · ${k}`;
    };
    return d`
      <div class="status ${s.tinted ? "on" : ""}" style=${s.style}>
        <button class="icon" aria-label=${s.locked ? r(t, "unlock") : r(t, "lock")} @click=${() => ln(t, e, !s.locked, !!this.config.invert)}>
          ${vi(32)}${s.locked ? d`<span class="lk">${ze(14)}</span>` : f}
        </button>
        <div class="txt"><strong>${as(t, s, !1)}</strong>${a ? d`<span>${a}</span>` : f}</div>
      </div>
      ${s.look !== "unavailable" ? d`<button class="big ${s.locked ? "solid" : ""}" @click=${() => ln(t, e, !s.locked, !!this.config.invert)}>
            ${s.locked ? ms() : ze()}<span>${s.locked ? r(t, "unlock") : r(t, "lock")}</span>
          </button>` : f}
      <div class="scroll">
        ${s.ids.power ? d`
              <section>
                <h3>${r(t, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError ? d`<p class="empty">${r(t, "history_unavailable")}</p>` : d`<div class="week">
                          ${(o ?? Array.from({ length: 7 }, (g, m) => ({ day: new Date(Date.now() - (6 - m) * 864e5), kwh: 0 }))).map(
      (g, m) => d`<div>
                              <i class=${m === 6 ? "today" : g.kwh ? "" : "zero"} style="height:${g.kwh ? Math.max(6, g.kwh / l * 62) : 3}px"></i>
                              <span>${_(g.day, m)}</span>
                            </div>`
    )}
                        </div>
                        <div class="sum"><span>${r(t, "week_total")} <b>${lt(t, c)} kWh</b></span><span>${h} ${p?.startsWith("es") ? h === 1 ? "carga" : "cargas" : h === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${r(t, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? d`<p class="empty">…</p>` : f}
                  ${this._sessions && !u.length ? d`<p class="empty">${r(t, "no_history")}</p>` : f}
                  ${u.map(
      (g) => d`<div class="sess">
                      <span class="dot">${xl()}</span>
                      <span class="nm">
                        <span>${b(g.start)}${g.live ? d`<em>${r(t, "charging_now")}</em>` : f}</span>
                        <small>${g.live ? `${r(t, "in_progress")} · ` : ""}${cn(g.end - g.start)}${g.live ? "" : ` · ${r(t, "max_kw", { kw: `${lt(t, g.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${lt(t, g.kwh)} kWh</span>
                    </div>`
    )}
                </div>
              </section>` : f}
      </div>
    `;
  }
};
jt.styles = [
  D.styles,
  E`
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
qe([
  $({ attribute: !1 })
], jt.prototype, "config", 2);
qe([
  $()
], jt.prototype, "name", 2);
qe([
  $({ attribute: !1 })
], jt.prototype, "onSettings", 2);
qe([
  w()
], jt.prototype, "_sessions", 2);
qe([
  w()
], jt.prototype, "_histError", 2);
jt = qe([
  j("terral-charger-dialog")
], jt);
function Ed(t, e, s, i) {
  document.querySelector("terral-charger-dialog")?.remove();
  const n = document.createElement("terral-charger-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function jd(t) {
  for (const e of document.querySelectorAll("terral-charger-dialog")) e.hass = t;
}
var Nd = Object.defineProperty, Pd = Object.getOwnPropertyDescriptor, he = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Pd(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Nd(e, s, n), n;
};
const Ld = "terral-home-charger";
let bt = class extends B {
  constructor() {
    super(...arguments), this._size = "s22", this._spark = [], this._held = !1, this._toggle = (t) => {
      if (t.stopPropagation(), !this.hass || !this._config) return;
      const e = this.hass.states[this._config.entity];
      if (!e) return;
      const s = ns(this.hass, this._config);
      s.look !== "unavailable" && ln(this.hass, e, !s.locked, !!this._config.invert);
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
    const s = ns(this.hass, this._config).ids;
    return [this._config.entity, s.status, s.power, s.energy].some((i) => i && e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (!this.hass || !this._config) return;
    t.has("hass") && jd(this.hass);
    const e = ns(this.hass, this._config);
    if (this._size === "s42" && e.ids.power) {
      this._histFor !== e.ids.power && (this._histFor = e.ids.power, this._loadHistory(e.ids.power), clearInterval(this._histTimer), this._histTimer = window.setInterval(() => this._loadHistory(e.ids.power), 30 * 6e4));
      const s = qn(this.hass, e.ids.power), i = this._spark[this._spark.length - 1];
      if (s != null && (!i || i[1] !== s)) {
        const n = Date.now();
        this._spark = [...this._spark.filter(([a]) => n - a < 36e5), [n, s]], e.look === "charging" && !this._sessionStart && (this._sessionStart = n), e.look !== "charging" && (this._sessionStart = void 0);
      }
    }
  }
  async _loadHistory(t) {
    if (this.hass)
      try {
        const e = Date.now(), s = await So(this.hass, t, new Date(e - 7 * 864e5)), i = Co(s, e);
        this._week = zo(i, 7).reduce((a, o) => a + o.kwh, 0);
        const n = i.find((a) => a.live);
        this._sessionStart = n?.start, this._spark = s.filter(([a]) => e - a < 36e5);
      } catch {
        this._week = void 0;
      }
  }
  _openWindow(t = "main") {
    if (!this.hass || !this._config) return;
    const e = () => this.hass && this._config && vt(this, this.hass, "charger", this._config);
    if (t === "settings") return e();
    Ed(this.hass, this._config, this._name, e);
  }
  // ---- Render ---------------------------------------------------------------
  _icon(t, e) {
    return d`<button class="icon" aria-label=${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")} ?disabled=${t.look === "unavailable"} @click=${this._toggle}>
      ${vi(e)}
      ${t.locked ? d`<span class="lk">${ze(14)}</span>` : f}
    </button>`;
  }
  _lockBtn(t) {
    return t.look === "unavailable" ? f : d`<button class="pb ${t.locked && t.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${t.locked ? ms(19) : ze(19)}<span>${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")}</span>
    </button>`;
  }
  _sparkline() {
    const t = this._spark;
    if (t.length < 2) return f;
    const e = 300, s = 58, i = Date.now(), n = Math.max(this._config?.max_power ?? 0, ...t.map((c) => c[1]), 1), a = t.map(([c, h]) => [Math.max(0, e - (i - c) / 36e5 * e), s - 4 - h / n * (s - 10)]);
    a.push([e, a[a.length - 1][1]]);
    const o = a.map((c, h) => `${h ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" "), l = a[a.length - 1];
    return x`<svg class="spark" viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${o} L${e} ${s} L${a[0][0]} ${s}Z"></path><path class="l" d=${o}></path><circle cx=${l[0]} cy=${l[1]} r="4"></circle></svg>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass;
    if (!t.states[this._config.entity])
      return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = ns(t, this._config), i = this._size, n = ko(t, s.ids.energy), a = s.kw != null ? `${lt(t, s.kw)} kW` : "", o = n != null ? `${lt(t, n)} kWh` : "", l = s.look === "charging", c = this._name;
    let h;
    if (i === "s11")
      h = d`${this._icon(s, 22)}<div class="text"><span class="name">${c}</span><span class="state">${as(t, s, !0)}</span></div>`;
    else if (i === "s21") {
      const u = l && o ? [a, o].filter(Boolean).join(" · ") : as(t, s, !0);
      h = d`${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${u}</span></div>`;
    } else {
      const u = d`<div class="head">${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${as(t, s, !1)}</span></div></div>`;
      if (i === "s22")
        h = d`${u}<div class="row">
          ${l && (a || o) ? d`${a ? d`<div class="pb static"><span>${a}</span></div>` : f}
                ${o ? d`<div class="pb static">${ka()}<span>${o}</span></div>` : f}` : this._lockBtn(s)}
        </div>`;
      else {
        const p = this._sessionStart ?? (s.ids.status ? new Date(t.states[s.ids.status]?.last_changed ?? Date.now()).getTime() : void 0);
        h = d`${u}
          ${l ? d`<div class="chart flow">
                  <div class="chead"><span class="big">${s.kw != null ? lt(t, s.kw) : "–"}<small>kW</small></span><span class="state">${r(t, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${o ? d`<div class="pb static">${ka()}<span>${o}</span></div>` : f}
                  ${p ? d`<div class="pb static">${yl()}<span>${cn(Date.now() - p)}</span></div>` : f}
                </div>` : d`<div class="stats">
                ${o ? d`<div class="stat"><b>${o}</b><span>${r(t, "last_session")}</span></div>` : f}
                ${this._week != null ? d`<div class="stat"><b>${lt(t, this._week)} kWh</b><span>${r(t, "this_week")}</span></div>` : f}
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
      aria-label=${`${c}, ${as(t, s, !1)}`}
      @click=${this._cardClick}
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >${h}</div>`;
  }
};
bt.styles = E`
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
he([
  $({ attribute: !1 })
], bt.prototype, "hass", 2);
he([
  w()
], bt.prototype, "_config", 2);
he([
  w()
], bt.prototype, "_size", 2);
he([
  w()
], bt.prototype, "_spark", 2);
he([
  w()
], bt.prototype, "_week", 2);
he([
  w()
], bt.prototype, "_sessionStart", 2);
bt = he([
  j(Ld)
], bt);
var Wd = Object.defineProperty, Id = Object.getOwnPropertyDescriptor, Ai = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Id(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Wd(e, s, n), n;
};
let Ne = class extends B {
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
Ne.styles = E`
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
Ai([
  $({ attribute: !1 })
], Ne.prototype, "items", 2);
Ai([
  $({ attribute: !1 })
], Ne.prototype, "anchor", 2);
Ai([
  $()
], Ne.prototype, "align", 2);
Ne = Ai([
  j("terral-pop")
], Ne);
function kn(t, e, s = "left") {
  document.querySelector("terral-pop")?.remove();
  const i = document.createElement("terral-pop");
  return i.items = e, i.anchor = t.getBoundingClientRect(), i.align = s, document.body.appendChild(i), i;
}
var Hd = Object.defineProperty, Rd = Object.getOwnPropertyDescriptor, Es = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Rd(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Hd(e, s, n), n;
};
let ae = class extends D {
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
    }}>${Q(19)}</button>` : f;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  _step(t, e) {
    const s = cs(t, this.config), i = this._pending ?? pn(t);
    if (i == null) return;
    const n = typeof i == "number" ? Yt(i + e * s.step, s) : e > 0 ? { low: i.low, high: Yt(i.high + s.step, s) } : { low: Yt(i.low - s.step, s), high: i.high };
    this._pending = n, clearTimeout(this._timer), this._timer = window.setTimeout(() => {
      Po(this.hass, t, n), window.setTimeout(() => this._pending = void 0, 2500);
    }, 650);
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = F(t), i = Y(e), n = ye(e, this.config), a = Oo(e, this.config), o = this._pending ?? pn(e), l = ds(e), c = ws(e), h = Tt(e), u = Ql(e), p = this.config.show_swing === !0 && To(e), _ = e.attributes.swing_mode != null && e.attributes.swing_mode !== "off", b = [l != null ? `${s === "es" ? "Dentro" : "Inside"} ${Dt(t, l)}°` : "", Ho(t, e)].filter(Boolean).join(" · ");
    return d`
      <div class="status ${i ? "" : "on"}" style=${Io(e)}>
        <button class="icon" aria-label=${i ? r(t, "turn_on") : r(t, "turn_off")} ?disabled=${xe(e)} @click=${() => i ? Yn(t, e) : Gn(t, e)}>
          ${ve(i ? "off" : e.state, 30)}
        </button>
        <div class="txt">
          <strong>${i ? s === "es" ? "Apagado" : "Off" : n ? `${ct(s, e.state)} · ${ks(t, o)}` : ct(s, e.state)}</strong>
          ${b ? d`<span>${b}</span>` : f}
        </div>
      </div>
      <div class="scroll">
        <section class=${n ? "" : "dim"}>
          <h3>${r(t, "temperature")}</h3>
          <div class="wstep">
            <button aria-label="−" ?disabled=${!n} @click=${() => this._step(e, -1)}>${Ln()}</button>
            <span class="v">${n ? ks(t, o) : i ? "—" : r(t, "no_temperature")}</span>
            <button aria-label="+" ?disabled=${!n} @click=${() => this._step(e, 1)}>${Wn()}</button>
          </div>
        </section>
        ${h.length > 1 ? d`<section>
              <h3>${r(t, "climate_mode")}</h3>
              <div class="grid">
                ${h.map((g) => d`<button class="opt ${!i && e.state === g ? "sel" : ""}" @click=${() => $s(t, e, g)}>${ve(g, 22)}<span>${ct(s, g)}</span></button>`)}
              </div>
            </section>` : f}
        ${c.length ? d`<section class=${a ? "" : "dim"}>
              <h3>${r(t, "climate_fan")}</h3>
              <div class="grid small" style="grid-template-columns:repeat(${Math.min(c.length, 4)},1fr)">
                ${c.map((g) => d`<button class="opt ${e.attributes.fan_mode === g ? "sel" : ""}" ?disabled=${!a} @click=${() => No(t, e, g)}><span>${dn(s, g)}</span></button>`)}
              </div>
              ${a ? f : d`<p class="note">${i ? r(t, "climate_off_note") : r(t, "fan_fixed", { mode: ct(s, e.state) })}</p>`}
            </section>` : f}
        ${p ? d`<div class="list"><button class="li" role="switch" aria-checked=${_} ?disabled=${i} @click=${() => tc(t, e, !_)}>
              <span class="nm">${r(t, "swing")}</span><span class="tog ${_ ? "on" : ""}"></span>
            </button></div>` : f}
        ${u.length ? d`<section>
              <h3>${r(t, "presets")}</h3>
              <div class="grid small">
                ${u.map((g) => d`<button class="opt ${e.attributes.preset_mode === g ? "sel" : ""}" ?disabled=${i} @click=${() => Jl(t, e, g)}><span>${dn(s, g)}</span></button>`)}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
ae.styles = [
  D.styles,
  E`
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
Es([
  $({ attribute: !1 })
], ae.prototype, "config", 2);
Es([
  $()
], ae.prototype, "name", 2);
Es([
  $({ attribute: !1 })
], ae.prototype, "onSettings", 2);
Es([
  w()
], ae.prototype, "_pending", 2);
ae = Es([
  j("terral-climate-dialog")
], ae);
function qd(t, e, s, i) {
  document.querySelector("terral-climate-dialog")?.remove();
  const n = document.createElement("terral-climate-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Ud(t) {
  for (const e of document.querySelectorAll("terral-climate-dialog")) e.hass = t;
}
var Fd = Object.defineProperty, Bd = Object.getOwnPropertyDescriptor, js = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Bd(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Fd(e, s, n), n;
};
const Vd = "terral-home-climate";
class Yd {
  constructor(e) {
    this.onChange = e;
  }
  set(e, s, i) {
    this.value = i, this.onChange(), clearTimeout(this.timer), this.timer = window.setTimeout(() => {
      Po(e, s, i), window.setTimeout(() => {
        this.value = void 0, this.onChange();
      }, 2500);
    }, 650);
  }
}
let oe = class extends B {
  constructor() {
    super(...arguments), this._size = "s22", this._tick = 0, this._pending = new Yd(() => this._tick++), this._held = !1, this._dragging = !1, this._power = (t) => {
      t.stopPropagation();
      const e = this._entity;
      !e || !this.hass || xe(e) || (Y(e) ? Yn(this.hass, e) : Gn(this.hass, e));
    }, this._modeMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = F(this.hass);
      kn(t.currentTarget, Tt(e).map((i) => ({
        label: ct(s, i),
        icon: ve(i, 21),
        selected: !Y(e) && e.state === i,
        run: () => $s(this.hass, e, i)
      })));
    }, this._fanMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = F(this.hass);
      kn(t.currentTarget, ws(e).map((i) => ({
        label: dn(s, i),
        icon: nn(21),
        selected: e.attributes.fan_mode === i,
        run: () => No(this.hass, e, i)
      })), "right");
    }, this._dialDown = (t) => {
      const e = this._entity;
      !e || !this._config || !ye(e, this._config) || (t.stopPropagation(), this._cancelHold(), this._dragging = !0, t.currentTarget.setPointerCapture(t.pointerId), this._dialMove(t));
    }, this._dialMove = (t) => {
      if (!this._dragging || !this.hass || !this._config) return;
      const e = this._entity;
      if (!e) return;
      const s = t.currentTarget.getBoundingClientRect(), i = s.left + s.width / 2, n = s.top + s.height * 100 / 180;
      let o = 225 - Math.atan2(n - t.clientY, t.clientX - i) * 180 / Math.PI;
      o < 0 && (o += 360), o > 300 && (o = 0);
      const l = cs(e, this._config), c = Yt(l.min + Math.min(1, o / 270) * (l.max - l.min), l), h = this._target(e);
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
      Ud(this.hass);
      const e = this._entity;
      e && jo(e);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  _target(t) {
    return this._pending.value ?? pn(t);
  }
  _step(t) {
    return (e) => {
      e.stopPropagation();
      const s = this._entity;
      if (!s || !this.hass || !this._config) return;
      const i = cs(s, this._config), n = this._target(s);
      n != null && (typeof n == "number" ? this._pending.set(this.hass, s, Yt(n + t * i.step, i)) : t > 0 ? this._pending.set(this.hass, s, { low: n.low, high: Yt(n.high + i.step, i) }) : this._pending.set(this.hass, s, { low: Yt(n.low - i.step, i), high: n.high }));
    };
  }
  _openWindow() {
    !this.hass || !this._config || qd(this.hass, this._config, this._name, () => this.hass && this._config && vt(this, this.hass, "climate", this._config));
  }
  // ---- Render -------------------------------------------------------------------
  _pct(t) {
    if (!this._config || !ye(t, this._config)) return 0;
    const e = cs(t, this._config), s = this._target(t);
    if (s == null) return 0;
    const i = typeof s == "number" ? s : s.high;
    return Math.max(0, Math.min(1, (i - e.min) / (e.max - e.min)));
  }
  _icon(t, e) {
    return d`<button class="icon" aria-label=${Y(t) ? r(this.hass, "turn_on") : r(this.hass, "turn_off")} ?disabled=${xe(t)} @click=${this._power}>
      ${ve(Y(t) ? "off" : t.state, e)}
    </button>`;
  }
  _modeBtn(t) {
    return Tt(t).length < 2 ? f : d`<button class="rbtn" aria-label=${r(this.hass, "climate_mode")} ?disabled=${xe(t)} @click=${this._modeMenu}>
      ${ve(Y(t) ? Tt(t)[0] ?? "off" : t.state, 22)}
    </button>`;
  }
  _fanBtn(t) {
    const e = ws(t);
    if (!e.length) return f;
    const s = Oo(t, this._config), i = t.attributes.fan_mode;
    return d`<button class="rbtn" aria-label=${r(this.hass, "climate_fan")} ?disabled=${!s} @click=${this._fanMenu}>
      ${nn(22)}${i ? d`<span class="tag">${nc(e, i)}</span>` : f}
    </button>`;
  }
  _stepper(t) {
    const e = this.hass, s = ye(t, this._config), i = this._target(t), n = ds(t), a = s ? d`<span class="v ${typeof i == "object" ? "range" : ""}">${ks(e, i)}</span>` : d`<span class="v muted">${Y(t) ? n != null ? `${Dt(e, n)}° ${F(e) === "es" ? "dentro" : "inside"}` : "—" : r(e, "no_temperature")}</span>`;
    return d`<div class="step ${s ? "" : "dis"}">
      <button aria-label="−" ?disabled=${!s} @click=${this._step(-1)}>${Ln()}</button>
      ${a}
      <button aria-label="+" ?disabled=${!s} @click=${this._step(1)}>${Wn()}</button>
    </div>`;
  }
  _dial(t) {
    const e = this.hass, s = F(e), i = 86, n = 2 * Math.PI * i, a = n * 0.75, o = this._pct(t), l = (225 - o * 270) * Math.PI / 180, c = 114 + i * Math.cos(l), h = 100 - i * Math.sin(l), u = ye(t, this._config), p = ds(t), _ = p != null ? `${Dt(e, p)}°` : "—", b = this._target(t), g = u ? ks(e, b) : _, m = Y(t) ? `${s === "es" ? "dentro · apagado" : "inside · off"}` : u ? `${ct(s, t.state)} · ${s === "es" ? "dentro" : "inside"} ${_}` : `${ct(s, t.state)} · ${s === "es" ? "dentro" : "inside"}`;
    return d`<div class="dial ${u ? "" : "disabled"}" @pointerdown=${this._dialDown} @pointermove=${this._dialMove} @pointerup=${this._dialUp} @pointercancel=${this._dialUp}>
      ${x`<svg viewBox="0 0 228 180" aria-hidden="true">
        <circle class="trk" cx="114" cy="100" r=${i} stroke-dasharray="${a} ${n}" transform="rotate(135 114 100)"></circle>
        ${o ? x`<circle class="val" cx="114" cy="100" r=${i} stroke-dasharray="${a * o} ${n}" transform="rotate(135 114 100)"></circle>
          <circle class="thumb" cx=${c} cy=${h} r="12"></circle>` : f}
      </svg>`}
      <div class="mid"><b class=${typeof b == "object" && u ? "range" : ""}>${g}</b><span>${m}</span></div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const s = this._size, i = this._name, n = this._target(e), a = Y(e), o = Da(t, e, this._config, n, !1), l = Da(t, e, this._config, n, !0), c = F(t);
    let h;
    if (s === "s11")
      h = d`${this._icon(e, 21)}<div class="text"><span class="name">${i}</span><span class="state">${l}</span></div>`;
    else if (s === "s21") {
      const u = ds(e), p = u != null ? ` · ${Dt(t, u)}° ${c === "es" ? "dentro" : "inside"}` : "";
      h = d`${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${a ? o : l + p}</span></div>`;
    } else if (s === "s22")
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${o}</span></div></div>
        <div class="row">${this._modeBtn(e)}${this._stepper(e)}${this._fanBtn(e)}</div>`;
    else {
      const u = Ho(t, e), p = a ? c === "es" ? "Apagado" : "Off" : [hn(c, e.state), u].filter(Boolean).join(" · ");
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${p}</span></div></div>
        ${this._dial(e)}
        <div class="bottom">${this._modeBtn(e) === f ? d`<span></span>` : this._modeBtn(e)}${this._fanBtn(e)}</div>`;
    }
    return d`<div
      class="card ${s} ${a ? "off" : "on"} ${xe(e) ? "unavailable" : ""}"
      style=${Io(e)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${i}, ${o}`}
      @click=${this._cardClick}
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >${h}</div>`;
  }
};
oe.styles = E`
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
js([
  $({ attribute: !1 })
], oe.prototype, "hass", 2);
js([
  w()
], oe.prototype, "_config", 2);
js([
  w()
], oe.prototype, "_size", 2);
js([
  w()
], oe.prototype, "_tick", 2);
oe = js([
  j(Vd)
], oe);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yr = { CHILD: 2 }, vr = (t) => (...e) => ({ _$litDirective$: t, values: e });
let wr = class {
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
class Mn extends wr {
  constructor(e) {
    if (super(e), this.it = f, e.type !== yr.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === f || e == null) return this._t = void 0, this.it = e;
    if (e === Ot) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const s = [e];
    return s.raw = s, this._t = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
}
Mn.directiveName = "unsafeHTML", Mn.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Sn = class extends Mn {
};
Sn.directiveName = "unsafeSVG", Sn.resultType = 2;
const Gd = vr(Sn), Xd = (t, e) => `<svg width="${t}" height="${t}" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Gi = (t = 24, e = 24, s = 9) => `<circle cx="${t}" cy="${e}" r="${s}" fill="#FFD25A"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((i) => {
  const n = i * Math.PI / 180, a = (o) => `${(t + Math.cos(n) * o).toFixed(1)} ${(e + Math.sin(n) * o).toFixed(1)}`;
  return `<path d="M${a(s + 4)}L${a(s + 8)}" stroke="#FFD25A" stroke-width="3"/>`;
}).join(""), Xi = (t = 24, e = 22) => `<path d="M${t + 10} ${e + 6}A12 12 0 1 1 ${t - 2} ${e - 11}a9.5 9.5 0 0 0 12 17z" fill="#F4E9B8"/>`, K = (t = 0, e = "#fff") => `<path d="M14 ${36 + t}h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 7.5 7.5 0 0 0-1 18z" fill="${e}"/>`, Us = (t = "#7fc8ff", e = [14, 23, 32]) => e.map((s) => `<path d="M${s} 40l-2 5" stroke="${t}" stroke-width="3"/>`).join(""), qa = (t = [14, 24, 34]) => t.map((e) => `<circle cx="${e}" cy="42" r="2.2" fill="#fff"/>`).join(""), Ua = '<path d="M25 30l-5 8h6l-4 8" stroke="#FFD25A" stroke-width="3"/>', Kd = '<path d="M6 18h24a5 5 0 1 0-5-5M6 26h32a5 5 0 1 1-5 5M6 34h16" stroke="#dfe7f3" stroke-width="3.2"/>';
function Qd(t, e) {
  switch (t) {
    case "sunny":
      return e ? Xi() : Gi();
    case "clear-night":
      return Xi();
    case "partlycloudy":
      return (e ? Xi(20, 15) : Gi(18, 17, 7)) + K(2);
    case "cloudy":
      return K(-6, "#cfd8e6") + K(0);
    case "rainy":
      return K(-6) + Us();
    case "pouring":
      return K(-6, "#b9c4d6") + Us("#5fb4ff", [12, 18, 24, 30, 36]);
    case "lightning":
      return K(-6, "#b9c4d6") + Ua;
    case "lightning-rainy":
      return K(-6, "#b9c4d6") + Ua + Us("#7fc8ff", [14, 34]);
    case "snowy":
      return K(-6) + qa();
    case "snowy-rainy":
      return K(-6) + qa([14, 34]) + Us("#7fc8ff", [24]);
    case "hail":
      return K(-6, "#b9c4d6") + [14, 24, 34].map((s) => `<circle cx="${s}" cy="42" r="2.6" fill="#dfe9ff" stroke="#9fb7e0" stroke-width="1"/>`).join("");
    case "fog":
      return K(-8, "#cfd8e6") + '<path d="M10 36h28M14 42h22" stroke="#cfd8e6" stroke-width="3"/>';
    case "windy":
      return Kd;
    case "windy-variant":
      return K(-8, "#cfd8e6") + '<path d="M8 38h22a4 4 0 1 0-4-4M8 44h14" stroke="#dfe7f3" stroke-width="3"/>';
    default:
      return Gi(24, 24, 7) + K(4, "#cfd8e6");
  }
}
const _t = (t, e = 32, s = !1) => Gd(Xd(e, Qd(t, s))), Fa = {
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
}, Ba = {
  sunny: "linear-gradient(180deg,#0e1739,#283a6e)",
  "clear-night": "linear-gradient(180deg,#0e1739,#283a6e)",
  partlycloudy: "linear-gradient(180deg,#141d40,#36477a)",
  cloudy: "linear-gradient(180deg,#232a3b,#454f65)",
  rainy: "linear-gradient(180deg,#1b2233,#394459)",
  pouring: "linear-gradient(180deg,#151b29,#2f394c)",
  snowy: "linear-gradient(180deg,#2a3550,#56688a)",
  fog: "linear-gradient(180deg,#2c3340,#525b6a)"
};
function $r(t, e) {
  return e ? Ba[t] ?? Ba.cloudy : Fa[t] ?? Fa.partlycloudy;
}
const kr = (t) => ["rainy", "pouring", "lightning-rainy", "snowy-rainy", "hail"].includes(t), Mr = (t) => t === "snowy" || t === "snowy-rainy", Va = { DAILY: 1, HOURLY: 2 }, fi = (t, e) => (Number(t.attributes.supported_features ?? 0) & (e === "daily" ? Va.DAILY : Va.HOURLY)) !== 0, Ki = /* @__PURE__ */ new Map();
function _i(t, e, s, i) {
  const n = `${e}|${s}`;
  let a = Ki.get(n);
  if (!a) {
    a = { listeners: /* @__PURE__ */ new Set() }, Ki.set(n, a);
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
    o.listeners.delete(i), o.listeners.size || (Ki.delete(n), o.unsub?.then((l) => l()).catch(() => {
    }));
  };
}
function Sr(t, e) {
  if (e.state === "clear-night") return !0;
  const s = t.states["sun.sun"];
  if (s) return s.state === "below_horizon";
  const i = (/* @__PURE__ */ new Date()).getHours();
  return i < 7 || i >= 21;
}
const P = (t) => t == null || t === "" || Number.isNaN(Number(t)) ? null : Number(t), Zd = (t) => String(t.attributes.wind_speed_unit ?? "km/h"), Jd = (t) => String(t.attributes.pressure_unit ?? "hPa"), Ya = (t) => String(t.attributes.precipitation_unit ?? "mm");
function Cr(t) {
  const e = t?.[0];
  return { hi: P(e?.temperature), lo: P(e?.templow) };
}
function th(t, e) {
  if (t?.length) {
    const s = (/* @__PURE__ */ new Date()).toDateString(), i = t.filter((n) => new Date(n.datetime).toDateString() === s).map((n) => P(n.precipitation) ?? 0);
    if (i.length) return i.reduce((n, a) => n + a, 0);
  }
  return P(e?.[0]?.precipitation);
}
const eh = {
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
}, sh = {
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
}, zr = (t, e) => (t === "es" ? eh : sh)[e] ?? e, G = (t, e, s = 0) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Ar = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit" }).replace(/\s?h$/, "");
function Cn(t, e, s) {
  const i = new Date(e);
  if (i.toDateString() === (/* @__PURE__ */ new Date()).toDateString()) return s;
  const n = i.toLocaleDateString(t?.locale?.language ?? t?.language ?? void 0, { weekday: "short" }).replace(".", "");
  return n.charAt(0).toUpperCase() + n.slice(1);
}
var ih = Object.defineProperty, nh = Object.getOwnPropertyDescriptor, Ue = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? nh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && ih(e, s, n), n;
};
let Nt = class extends D {
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
    }}>${Q(19)}</button>` : f;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this.hass?.states[this.config.entity];
    t && (fi(t, "hourly") && this._unsubs.push(_i(this.hass, t.entity_id, "hourly", (e) => this._hourly = e)), fi(t, "daily") && this._unsubs.push(_i(this.hass, t.entity_id, "daily", (e) => this._daily = e)));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this._unsubs) t();
    this._unsubs = [];
  }
  renderContent() {
    const t = this.hass, e = t.states[this.config.entity];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = F(t), i = e.state, n = Sr(t, e), a = P(e.attributes.temperature), { hi: o, lo: l } = Cr(this._daily), c = (T) => T != null ? `${G(t, Math.round(T))}°` : "–", h = this.config.animate !== !1, u = this.config.show_details !== !1, p = P(e.attributes.humidity), _ = P(e.attributes.wind_speed), b = P(e.attributes.wind_bearing), g = P(e.attributes.pressure), m = P(e.attributes.cloud_coverage), y = P(e.attributes.dew_point), v = th(this._hourly, this._daily), k = [];
    p != null && k.push([r(t, "humidity"), `${G(t, p)} %`]), _ != null && k.push([r(t, "wind"), d`${b != null ? d`<span class="arrow" style="transform:rotate(${b + 180}deg)">↑</span>` : f}${G(t, _)} ${Zd(e)}`]), g != null && k.push([r(t, "pressure"), `${G(t, g)} ${Jd(e)}`]), m != null && k.push([r(t, "clouds"), `${G(t, m)} %`]), y != null && k.push([r(t, "dew_point"), `${G(t, y, 1)}°`]), v != null && k.push([r(t, "rain_today"), `${G(t, v, 1)} ${Ya(e)}`]);
    const C = (this._daily ?? []).slice(0, this.config.forecast_days ?? 7), S = Math.min(...C.map((T) => P(T.templow) ?? P(T.temperature) ?? 0)), L = Math.max(...C.map((T) => P(T.temperature) ?? 0)), M = Math.max(1, L - S), O = r(t, "today");
    return d`
      <div class="hero" style="background:${$r(i, n)}">
        ${h && kr(i) ? d`<span class="rainfx"></span>` : h && Mr(i) ? d`<span class="snowfx"></span>` : f}
        ${_t(i, 64, n)}
        <div class="htxt">
          <span class="temp">${c(a)}</span>
          <strong>${zr(s, i)}</strong>
          <span>${r(t, "max_short")} ${c(o)} · ${r(t, "min_short")} ${c(l)}</span>
        </div>
      </div>
      <div class="scroll">
        ${u && k.length ? d`<div class="tiles">${k.map(([T, W]) => d`<div class="tile"><small>${T}</small><b>${W}</b></div>`)}</div>` : f}
        ${this._hourly?.length ? d`<section>
              <h3>${r(t, "next_hours")}</h3>
              <div class="list"><div class="hscroll">
                ${this._hourly.slice(0, 24).map((T, W) => {
      const z = P(T.precipitation);
      return d`<div class="hour">
                    <span class="h">${W === 0 ? r(t, "now") : Ar(t, T.datetime)}</span>
                    ${_t(T.condition ?? "", 26, T.is_daytime === !1)}
                    <span class="t">${c(P(T.temperature))}</span>
                    <span class="p">${z ? `${G(t, z, 1)} ${Ya(e)}` : ""}</span>
                  </div>`;
    })}
              </div></div>
            </section>` : f}
        ${C.length ? d`<section>
              <h3>${r(t, "next_days")}</h3>
              <div class="list days">
                ${C.map((T) => {
      const W = P(T.templow), z = P(T.temperature);
      return d`<div class="day">
                    <span>${Cn(t, T.datetime, O)}</span>${_t(T.condition ?? "", 24)}
                    <span class="lo">${W != null ? c(W) : ""}</span>
                    <span class="bar"><i style="left:${W != null ? (W - S) / M * 100 : 0}%;right:${z != null ? 100 - (z - S) / M * 100 : 0}%"></i></span>
                    <span>${c(z)}</span>
                  </div>`;
    })}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
Nt.styles = [
  D.styles,
  E`
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
Ue([
  $({ attribute: !1 })
], Nt.prototype, "config", 2);
Ue([
  $()
], Nt.prototype, "name", 2);
Ue([
  $({ attribute: !1 })
], Nt.prototype, "onSettings", 2);
Ue([
  w()
], Nt.prototype, "_hourly", 2);
Ue([
  w()
], Nt.prototype, "_daily", 2);
Nt = Ue([
  j("terral-weather-dialog")
], Nt);
function ah(t, e, s, i) {
  document.querySelector("terral-weather-dialog")?.remove();
  const n = document.createElement("terral-weather-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function oh(t) {
  for (const e of document.querySelectorAll("terral-weather-dialog")) e.hass = t;
}
var rh = Object.defineProperty, lh = Object.getOwnPropertyDescriptor, Fe = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? lh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && rh(e, s, n), n;
};
const ch = "terral-home-weather";
let Pt = class extends B {
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
    t.has("hass") && oh(this.hass);
    const e = this._entity;
    !e || !this.isConnected || this._subFor !== e.entity_id && (this._unsubscribe(), this._subFor = e.entity_id, fi(e, "daily") && this._unsubs.push(_i(this.hass, e.entity_id, "daily", (s) => this._daily = s)), fi(e, "hourly") && this._size !== "s11" && this._unsubs.push(_i(this.hass, e.entity_id, "hourly", (s) => this._hourly = s)));
  }
  // ---- Interaction ----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || ah(this.hass, this._config, this._name, () => this.hass && this._config && vt(this, this.hass, "weather", this._config));
  }
  // ---- Render ---------------------------------------------------------------------
  _hoursRow(t) {
    const e = this.hass, s = this._config?.forecast_2x2 === "daily" && this._size === "s22", i = s ? this._daily : this._hourly ?? this._daily;
    if (!i?.length) return d`<div class="hours empty"></div>`;
    const n = s || !this._hourly, a = r(e, "today");
    return d`<div class="hours">
      ${i.slice(0, 6).map((o, l) => {
      const c = n ? Cn(e, o.datetime, a) : l === 0 ? r(e, "now") : Ar(e, o.datetime), h = !n && o.is_daytime === !1 ? !0 : !n && l === 0 ? t : !1, u = P(o.temperature);
      return d`<div class="hour"><span class="h">${c}</span>${_t(o.condition ?? "", 22, h)}<span class="t">${u != null ? `${G(e, u)}°` : "–"}</span></div>`;
    })}
    </div>`;
  }
  _daysList(t) {
    const e = this.hass, s = this._daily?.slice(0, t) ?? [];
    if (!s.length) return f;
    const i = this._daily.slice(0, 7), n = Math.min(...i.map((c) => P(c.templow) ?? P(c.temperature) ?? 0)), a = Math.max(...i.map((c) => P(c.temperature) ?? 0)), o = Math.max(1, a - n), l = r(e, "today");
    return d`<div class="days">
      ${s.map((c) => {
      const h = P(c.templow), u = P(c.temperature), p = h != null ? (h - n) / o * 100 : 0, _ = u != null ? 100 - (u - n) / o * 100 : 0;
      return d`<div class="day">
          <span>${Cn(e, c.datetime, l)}</span>${_t(c.condition ?? "", 22)}
          <span class="lo">${h != null ? `${G(e, h)}°` : ""}</span>
          <span class="bar"><i style="left:${p}%;right:${_}%"></i></span>
          <span>${u != null ? `${G(e, u)}°` : ""}</span>
        </div>`;
    })}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = F(t), i = e.state, n = Sr(t, e), a = P(e.attributes.temperature), o = a != null ? `${G(t, Math.round(a))}°` : "–", { hi: l, lo: c } = Cr(this._daily), h = l != null || c != null ? `${r(t, "max_short")} ${l != null ? `${G(t, Math.round(l))}°` : "–"} · ${r(t, "min_short")} ${c != null ? `${G(t, Math.round(c))}°` : "–"}` : "", u = e.state === "unavailable" ? r(t, "unavailable") : zr(s, i), p = this._name, _ = this._config.animate !== !1, b = _ && kr(i) ? d`<span class="rainfx"></span>` : _ && Mr(i) ? d`<span class="snowfx"></span>` : f, g = this._size;
    let m;
    if (g === "s11")
      m = d`${_t(i, 34, n)}<div class="text"><span class="name">${o} · ${p}</span><span class="state">${u}</span></div>`;
    else if (g === "s21")
      m = d`${b}<div class="top"><span class="temp">${o}</span>${_t(i, 40, n)}</div>
        <div class="text"><span class="name">${p}</span><span class="state">${u}</span>${h ? d`<span class="hl">${h}</span>` : f}</div>`;
    else {
      const y = g === "s42";
      m = d`${b}
        <div class="top">
          <div class="text"><span class="name">${p}</span><span class="temp ${y ? "xl" : "md"}">${o}</span></div>
          <div class="right">${_t(i, y ? 34 : 30, n)}<span class="cond">${u}</span>${h ? d`<span class="hl">${h}</span>` : f}</div>
        </div>
        ${this._hoursRow(n)}
        ${y ? d`<div class="sep"></div>${this._daysList(3)}` : f}`;
    }
    return d`<div
      class="card ${g}"
      style="background:${$r(i, n)}"
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${p}, ${o}, ${u}`}
      @click=${this._click}
      @keydown=${(y) => {
      (y.key === "Enter" || y.key === " ") && (y.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(y) => y.preventDefault()}
    >${m}</div>`;
  }
};
Pt.styles = E`
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
Fe([
  $({ attribute: !1 })
], Pt.prototype, "hass", 2);
Fe([
  w()
], Pt.prototype, "_config", 2);
Fe([
  w()
], Pt.prototype, "_size", 2);
Fe([
  w()
], Pt.prototype, "_hourly", 2);
Fe([
  w()
], Pt.prototype, "_daily", 2);
Pt = Fe([
  j(ch)
], Pt);
var dh = Object.defineProperty, hh = Object.getOwnPropertyDescriptor, Be = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? hh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && dh(e, s, n), n;
};
const ph = { vacuum: "vac_mode_vacuum", mop: "vac_mode_mop", both: "vac_mode_both" }, Ga = /* @__PURE__ */ new Set(["off"]);
let Lt = class extends D {
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
    }}>${Q(19)}</button>` : f;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  get _p() {
    return this._parts || (this._parts = qo(this.hass, this.config.entity)), this._parts;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this._e;
    t && fc(this.hass, t, this._p).then((e) => this._rooms = e);
  }
  _toggleRoom(t) {
    const e = new Set(this._picked);
    e.has(t) ? e.delete(t) : e.add(t), this._picked = e;
  }
  _start(t) {
    te(t) !== "paused" && this._picked.size ? gc(this.hass, t, [...this._picked]) : is(this.hass, t);
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
    const s = this._p, i = te(e), n = i === "unavailable", a = i === "cleaning" || i === "returning", o = hc(t, e, s), l = Kn(e).filter((v) => !Ga.has(v)), c = ii(t, s.mopIntensity).filter((v) => !Ga.has(v)), h = ii(t, s.mopMode), u = o.current !== "vacuum" || !o.modes.length, p = o.current !== "mop", _ = Xo(t, e, s, !0, 15), b = Uo(t, e, s), g = Qo(t, s), m = Yo(t, this.config), y = (v) => d`<em>${r(t, v)}</em>`;
    return d`
      <div class="status ${Zn(i) ? "on" : ""}" style=${Go(i)}>
        <span class="icon">${xs(30)}${i === "error" ? d`<span class="err">${xo(14)}</span>` : f}</span>
        <div class="txt">
          <strong>${Xs(t, e, s)}</strong>
          <span>${_ ? d`<b class="bat" style="color:${_.color}">${_.icon}${_.text}</b>` : f}${g && (a || i === "paused") ? d` · ${g}` : f}</span>
        </div>
      </div>
      ${i === "error" && b ? d`<p class="alert">${Ko(t, b)}</p>` : f}
      <div class="scroll">
        ${o.modes.length ? d`<section>
              <h3>${r(t, "vac_what")}</h3>
              ${this._seg(o.modes, o.current, (v) => r(t, ph[v]), (v) => pc(t, e, s, v), n)}
            </section>` : f}
        ${l.length && At(e, "FAN") ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_power")}${p ? f : y("vac_power_off")}</h3>
              ${this._seg(l, e.attributes.fan_speed, (v) => Ni(t, v), (v) => uc(t, e, v), n || !p)}
            </section>` : f}
        ${c.length ? d`<section class=${u ? "" : "dim"}>
              <h3>${r(t, "vac_water")}${u ? f : y("vac_only_mop")}</h3>
              ${this._seg(c, t.states[s.mopIntensity]?.state, (v) => Ni(t, v), (v) => Ea(t, s.mopIntensity, v), n || !u)}
            </section>` : f}
        ${h.length ? d`<section class=${u ? "" : "dim"}>
              <h3>${r(t, "vac_mop_mode")}${u ? f : y("vac_only_mop")}</h3>
              ${this._seg(h, t.states[s.mopMode]?.state, (v) => Ni(t, v), (v) => Ea(t, s.mopMode, v), n || !u)}
            </section>` : f}
        ${this._rooms.length ? d`<section class=${a || i === "paused" ? "dim" : ""}>
              <h3>${r(t, "vac_where")}${a || i === "paused" ? y("vac_rooms_next") : f}</h3>
              <div class="chips">
                <button class=${this._picked.size ? "" : "sel"} ?disabled=${a} @click=${() => this._picked = /* @__PURE__ */ new Set()}>${r(t, "vac_whole_home")}</button>
                ${this._rooms.map((v) => d`<button class=${this._picked.has(v.id) ? "sel" : ""} ?disabled=${a} @click=${() => this._toggleRoom(v.id)}>${v.name}</button>`)}
              </div>
            </section>` : f}
        <div class="actions">
          <button class="go" ?disabled=${n || i === "cleaning"} @click=${() => this._start(e)}>
            ${Vs(18)}${r(t, i === "paused" ? "vac_resume" : this._picked.size ? "vac_start_rooms" : "vac_start_clean", { n: this._picked.size })}
          </button>
          ${At(e, "PAUSE") ? d`<button class="rb" aria-label=${r(t, "vac_pause")} ?disabled=${!a} @click=${() => un(t, e)}>${mo(18)}</button>` : f}
          ${At(e, "RETURN") ? d`<button class="rb" aria-label=${r(t, "vac_to_base")} ?disabled=${n || i === "docked" || i === "returning"} @click=${() => gn(t, e)}>${Js(19)}</button>` : f}
          ${At(e, "LOCATE") ? d`<button class="rb" aria-label=${r(t, "vac_locate")} ?disabled=${n} @click=${() => Vo(t, e)}>${bo(19)}</button>` : f}
        </div>
        ${i === "docked" ? d`<p class="note">${r(t, "vac_docked_note")}</p>` : i === "cleaning" ? d`<p class="note">${r(t, "vac_cleaning_note")}</p>` : f}
        ${m.length ? d`<section>
              <h3>${r(t, "vac_routines")}</h3>
              <div class="chips">
                ${m.map((v) => {
      const k = ni(t, v, this.name);
      return d`<button ?disabled=${n || i === "cleaning"} @click=${() => fn(t, v)}>${ai(k, 16)}${k}</button>`;
    })}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
Lt.styles = [
  D.styles,
  E`
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
Be([
  $({ attribute: !1 })
], Lt.prototype, "config", 2);
Be([
  $()
], Lt.prototype, "name", 2);
Be([
  $({ attribute: !1 })
], Lt.prototype, "onSettings", 2);
Be([
  w()
], Lt.prototype, "_rooms", 2);
Be([
  w()
], Lt.prototype, "_picked", 2);
Lt = Be([
  j("terral-vacuum-dialog")
], Lt);
function uh(t, e, s, i) {
  document.querySelector("terral-vacuum-dialog")?.remove();
  const n = document.createElement("terral-vacuum-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function gh(t) {
  for (const e of document.querySelectorAll("terral-vacuum-dialog")) e.hass = t;
}
var fh = Object.defineProperty, _h = Object.getOwnPropertyDescriptor, Ti = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? _h(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && fh(e, s, n), n;
};
const mh = "terral-home-vacuum";
let Pe = class extends B {
  constructor() {
    super(...arguments), this._size = "s22", this._held = !1, this._iconTap = (t) => {
      t.stopPropagation();
      const e = this._entity, s = this.hass;
      if (!e || !s) return;
      const i = te(e);
      i === "cleaning" || i === "returning" ? un(s, e) : i === "paused" ? is(s, e) : i === "docked" || i === "idle" ? this._routinesMenu(t.currentTarget) : this._openWindow();
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
    return !this._parts && this.hass && this._config && (this._parts = qo(this.hass, this._config.entity)), this._parts ?? {};
  }
  get _name() {
    return this._config?.name || this._entity?.attributes.friendly_name || r(this.hass, "type_vacuum");
  }
  /** Redraw only when the robot or one of its own sensors changed. */
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || !this.hass ? !0 : [this._config.entity, ...Object.values(this._p), ...ja(this.hass, this._config)].filter(Boolean).some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (t.has("hass") && this.hass) {
      gh(this.hass);
      const e = this._entity;
      e && dc(this.hass, e, this._p);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  // ---- Actions -----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || uh(this.hass, this._config, this._name, () => this.hass && this._config && vt(this, this.hass, "vacuum", this._config));
  }
  _routinesMenu(t) {
    const e = this.hass, s = Yo(e, this._config);
    if (!s.length) return this._openWindow();
    kn(t, s.map((i) => {
      const n = ni(e, i, this._name);
      return { label: n, icon: ai(n, 21), run: () => fn(e, i) };
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
      ${xs(s)}
      ${e === "error" ? d`<span class="err">${xo(this._size === "s11" ? 11 : 14)}</span>` : f}
    </button>`;
  }
  _battery(t, e) {
    const s = Xo(this.hass, t, this._p, e);
    return s ? d`<span class="bat" style="color:${s.color}" aria-label=${`${r(this.hass, "battery")} ${s.pct} %`}>${s.icon}${s.text}</span>` : f;
  }
  _bottom22(t, e) {
    const s = this.hass, i = this._config;
    if (e === "docked" || e === "idle" || e === "unavailable") {
      const o = ja(s, i);
      return o.length ? d`<div class="pills" style="grid-template-columns:repeat(${o.length},minmax(0,1fr))">
        ${o.map((l) => {
        const c = ni(s, l, this._name);
        return d`<button class="pb" ?disabled=${e === "unavailable"} @click=${(h) => {
          h.stopPropagation(), fn(s, l);
        }}>${ai(c, 16)}<span>${c}</span></button>`;
      })}
      </div>` : d`<div class="pills one"><button class="pb" ?disabled=${e === "unavailable"} @click=${this._act(is)}>${Vs(16)}${r(s, "vac_start")}</button></div>`;
    }
    if (e === "error")
      return d`<div class="row">
        <button class="pb grow" @click=${this._act(is)}>${Vs(16)}<span>${r(s, "vac_resume")}</span></button>
        ${At(t, "RETURN") ? d`<button class="pb grow" @click=${this._act(gn)}>${Js(17)}<span>${r(s, "vac_to_base")}</span></button>` : f}
        ${At(t, "LOCATE") ? d`<button class="rb" aria-label=${r(s, "vac_locate")} @click=${this._act(Vo)}>${bo(19)}</button>` : f}
      </div>`;
    const n = Xn(s, this._p), a = Qo(s, this._p);
    return d`<div class="row">
      <div class="info">
        ${n != null && e !== "returning" ? d`<div class="track"><i style="width:${n}%"></i></div>` : f}
        <span class="facts">${a || Xs(s, t, this._p)}</span>
      </div>
      ${e === "paused" ? d`<button class="rb on" aria-label=${r(s, "vac_resume")} @click=${this._act(is)}>${Vs(18)}</button>` : At(t, "PAUSE") ? d`<button class="rb on" aria-label=${r(s, "vac_pause")} @click=${this._act(un)}>${mo(18)}</button>` : f}
      ${At(t, "RETURN") ? d`<button class="rb" aria-label=${r(s, "vac_to_base")} ?disabled=${e === "returning"} @click=${this._act(gn)}>${Js(19)}</button>` : f}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = te(e), i = this._size, n = this._name, a = Xs(t, e, this._p);
    let o;
    return i === "s11" ? o = d`${this._icon(e, s, 22)}<div class="text"><span class="name">${n}</span>
        <span class="state line"><span class="grow">${Xs(t, e, this._p, !0)}</span>${this._battery(e, !1)}</span></div>` : i === "s21" ? o = d`${this._icon(e, s, 32)}<div class="text"><span class="name">${n}</span><span class="state">${a}</span>
        <span class="state">${this._battery(e, !0)}</span></div>` : o = d`<div class="head">${this._icon(e, s, 32)}<div class="text"><span class="name">${n}</span><span class="state">${a}</span></div>
          <span class="top">${this._battery(e, !0)}</span></div>
        ${this._bottom22(e, s)}`, d`<div
      class="card ${i} ${Zn(s) ? "on" : "off"} ${s === "unavailable" ? "unavailable" : ""}"
      style=${Go(s)}
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
Pe.styles = E`
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
Ti([
  $({ attribute: !1 })
], Pe.prototype, "hass", 2);
Ti([
  w()
], Pe.prototype, "_config", 2);
Ti([
  w()
], Pe.prototype, "_size", 2);
Pe = Ti([
  j(mh)
], Pe);
var bh = Object.defineProperty, xh = Object.getOwnPropertyDescriptor, pe = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? xh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && bh(e, s, n), n;
};
let xt = class extends D {
  constructor() {
    super(...arguments), this.name = "", this._causes = [], this._error = !1, this._loadedFor = "";
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Q(19)}</button>` : f;
  }
  updated() {
    const t = this.hass?.states[this.config.entity];
    if (!t) return;
    const e = t.last_changed;
    if (e === this._loadedFor) return;
    this._loadedFor = e;
    const s = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0) - 6 * 864e5);
    ta(this.hass, this.config, 7).then((i) => {
      this._usage = i, this._error = !1;
    }).catch(() => this._error = !0), Ec(this.hass, this.config.entity, s).then((i) => this._causes = i).catch(() => {
    });
  }
  _causeText(t) {
    const e = this.hass;
    return t ? t.kind === "automation" ? r(e, "sw_by_automation", { n: t.name ?? "" }) : t.kind === "script" ? r(e, "sw_by_script", { n: t.name ?? "" }) : t.kind === "you" ? r(e, "sw_by_you") : t.kind === "user" ? r(e, "sw_by_ha") : "" : "";
  }
  /** On / off rows, newest first, with the logbook cause matched by time. */
  _log() {
    const t = this._usage;
    if (!t) return [];
    const e = [], s = (i, n) => this._causes.find((a) => Math.abs(a.t - i) < 5e3 && (!a.state || a.state === "on" === n))?.cause;
    for (const i of t.spans)
      e.push({ t: i.start, on: !0, live: i.live, cause: s(i.start, !0) }), i.live || e.push({ t: i.end, on: !1, ms: i.end - i.start, kwh: t.kwhBetween(i.start, i.end), cause: s(i.end, !1) });
    return e.sort((i, n) => n.t - i.t).slice(0, 12);
  }
  _when(t) {
    const e = this.hass, s = e.locale?.language ?? e.language ?? void 0, i = new Date(t), n = /* @__PURE__ */ new Date(), a = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1), o = dt(e, t);
    if (i.toDateString() === n.toDateString()) return `${r(e, "today")} · ${o}`;
    if (i.toDateString() === a.toDateString()) return `${r(e, "yesterday")} · ${o}`;
    const l = i.toLocaleDateString(s, { weekday: "long", day: "numeric" });
    return `${l.charAt(0).toUpperCase()}${l.slice(1)} · ${o}`;
  }
  renderContent() {
    const t = this.hass, e = this.config, s = t.states[e.entity];
    if (!s) return d`<p class="empty">${r(t, "not_found")}</p>`;
    const i = Jn(s), n = hs(e.color), a = e.icon || we(`${this.name} ${e.entity}`), o = Kt(t, e), l = i ? mn(t, o.power) : null, c = this._usage, h = !!(o.power || o.energy), u = t.locale?.language ?? t.language ?? void 0, p = Date.now() - new Date(s.last_changed).getTime(), _ = Xt(s) ? r(t, "unavailable") : `${r(t, i ? "sw_on" : "sw_off")}${l != null ? ` · ${fe(t, l)}` : ""}`, b = Xt(s) ? "" : `${r(t, "sw_since_at", { t: dt(t, s.last_changed) })} · ${ft(p)}`, g = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).getTime(), m = 864e5, y = (Date.now() - g) / m * 100, v = (c?.spans ?? []).filter((z) => z.end > g), k = v.filter((z) => z.start >= g).length + (v.some((z) => z.start < g) ? 1 : 0), C = c?.days ?? [], S = C.map((z) => h ? z.kwh ?? 0 : z.onMs / 36e5), L = Math.max(...S, h ? 0.1 : 1), M = C.reduce((z, R) => z + (R.kwh ?? 0), 0), O = C.reduce((z, R) => z + R.onMs, 0), T = (z, R) => R === C.length - 1 ? r(t, "today") : z.toLocaleDateString(u, { weekday: "narrow" }), W = this._log();
    return d`
      <div class="status ${i ? "on" : ""}" style=${i ? `--bg:${n.bg};--fg:${n.fg};--fg2:${n.fg2};--accent:${n.accent}` : ""}>
        <button class="icon" aria-label=${i ? r(t, "turn_off") : r(t, "turn_on")} ?disabled=${Xt(s)} @click=${() => Zo(t, s)}>
          ${gt(a, i, 32)}
        </button>
        <div class="txt"><strong>${_}</strong>${b ? d`<span>${b}</span>` : f}</div>
      </div>
      <div class="scroll" style="--accent:${n.accent}">
        ${this._error ? d`<div class="list"><p class="empty">${r(t, "history_unavailable")}</p></div>` : f}
        <section>
          <h3>${r(t, "today")}</h3>
          <div class="list">
            <div class="tlw">
              <div class="tl">
                ${v.map((z) => {
      const R = Math.max(0, (z.start - g) / m) * 100, Z = Math.min(100, (z.end - g) / m * 100);
      return d`<i style="left:${R}%;width:${Math.max(0.6, Z - R)}%"></i>`;
    })}
                <b style="left:${y}%"></b>
              </div>
              <div class="ticks"><span>0 h</span><span>6</span><span>12</span><span>18</span><span>24 h</span></div>
              <div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
                <div>${r(t, "sw_on_time")}<b>${c ? ft(c.onToday) : "…"}</b></div>
                ${h ? d`<div>${r(t, "sw_consumption")}<b>${c?.kwhToday != null ? Ct(t, c.kwhToday) : "…"}</b></div>` : d`<div>${r(t, "sw_times")}<b>${c ? k : "…"}</b></div>`}
              </div>
            </div>
          </div>
        </section>
        <section>
          <h3>${r(t, h ? "sw_week_kwh" : "sw_week_hours")}</h3>
          <div class="list">
            <div class="week">
              ${(C.length ? C : Array.from({ length: 7 }, (z, R) => ({ day: new Date(g - (6 - R) * m), kwh: 0, onMs: 0 }))).map((z, R) => {
      const Z = S[R] ?? 0;
      return d`<div>
                  <i class=${R === 6 ? "today" : Z ? "" : "zero"} style="height:${Z ? Math.max(6, Z / L * 62) : 3}px"></i>
                  <span>${T(z.day, R)}</span>
                </div>`;
    })}
            </div>
            <div class="sum">
              <span>${r(t, "week_total")} <b>${c ? h ? Ct(t, M) : ft(O) : "…"}</b></span>
              ${h ? f : d`<span>${r(t, "sw_no_meter")}</span>`}
            </div>
          </div>
        </section>
        <section>
          <h3>${r(t, "sw_log")}</h3>
          <div class="list">
            ${!c && !this._error ? d`<p class="empty">…</p>` : f}
            ${c && !W.length ? d`<p class="empty">${r(t, "sw_no_log")}</p>` : f}
            ${W.map((z) => {
      const R = this._causeText(z.cause), Z = z.on ? r(t, "sw_on") : `${r(t, "sw_off")} · ${r(t, "sw_lasted", { d: ft(z.ms ?? 0) })}`, ha = z.live ? r(t, "sw_running") : !z.on && z.kwh != null && h ? Ct(t, z.kwh) : !z.on && !h ? ft(z.ms ?? 0) : "";
      return d`<div class="sess">
                <span class="dot ${z.on ? "on" : ""}">${Pn(16)}</span>
                <span class="nm"><span>${this._when(z.t)}</span><small>${Z}${R ? ` · ${R}` : ""}</small></span>
                ${ha ? d`<span class="kwh">${ha}</span>` : f}
              </div>`;
    })}
          </div>
        </section>
      </div>
    `;
  }
};
xt.styles = [
  D.styles,
  E`
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
      .tlw {
        padding: 14px 14px 12px;
      }
      .tl {
        position: relative;
        height: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .tl i {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 8px;
        background: var(--accent);
      }
      .tl b {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 2px;
        background: #fff;
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 6px;
      }
      .stats {
        display: grid;
        gap: 8px;
        margin-top: 12px;
      }
      .stats div {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.07);
        padding: 9px 10px;
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.65);
        min-width: 0;
      }
      .stats b {
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        background: color-mix(in srgb, var(--accent) 70%, transparent);
      }
      .week i.today {
        background: var(--accent);
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
        gap: 10px;
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
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .dot.on {
        background: var(--accent);
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
      .kwh {
        font-size: 15px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    `
];
pe([
  $({ attribute: !1 })
], xt.prototype, "config", 2);
pe([
  $()
], xt.prototype, "name", 2);
pe([
  $({ attribute: !1 })
], xt.prototype, "onSettings", 2);
pe([
  w()
], xt.prototype, "_usage", 2);
pe([
  w()
], xt.prototype, "_causes", 2);
pe([
  w()
], xt.prototype, "_error", 2);
xt = pe([
  j("terral-switch-dialog")
], xt);
function yh(t, e, s, i) {
  document.querySelector("terral-switch-dialog")?.remove();
  const n = document.createElement("terral-switch-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function vh(t) {
  for (const e of document.querySelectorAll("terral-switch-dialog")) e.hass = t;
}
var wh = Object.defineProperty, $h = Object.getOwnPropertyDescriptor, Ns = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? $h(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && wh(e, s, n), n;
};
const kh = "terral-home-switch";
let re = class extends B {
  constructor() {
    super(...arguments), this._size = "s22", this._held = !1, this._loadKey = "", this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !Xt(e) && Zo(this.hass, e);
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
    if (!t?.entity || !Ac(String(t.entity)))
      throw new Error("Terral · Interruptor: 'entity' must be a switch, input_boolean, light or fan");
    this._config = t, this._loadKey = "";
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s11" ? 1 : 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }
  getTerralSizes() {
    return [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 }
    ];
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((e) => e.startsWith("switch.")) ?? "switch.example" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } } },
        { name: "name", selector: { text: {} } },
        { name: "style", selector: { select: { mode: "dropdown", options: ["a", "b", "c"] } } }
      ]
    };
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  get _name() {
    return this._config?.name || this.hass?.formatEntityName?.(this._entity) || this._entity?.attributes.friendly_name || this._config?.entity || "";
  }
  get _icon() {
    return this._config?.icon || we(`${this._name} ${this._config?.entity ?? ""}`);
  }
  // ---- Lifecycle ---------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._tick = window.setInterval(() => {
      this._loadKey = "", this._load();
    }, 5 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._tick), this._cancelHold();
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    if (!e || !this._config || !this.hass) return !0;
    const s = Kt(this.hass, this._config);
    return [this._config.entity, s.power, s.energy].some((i) => i && e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && vh(this.hass), this._load();
  }
  /** Today's history: only the 2/2 (and the 2/1 state line) need it. */
  _load() {
    const t = this.hass, e = this._config, s = this._entity;
    if (!t || !e || !s || this._size === "s11") return;
    const i = `${s.last_changed}|${this._size}|${e.power_entity}|${e.energy_entity}`;
    i !== this._loadKey && (this._loadKey = i, tr(t, e).then((n) => this._usage = n).catch(() => {
    }));
  }
  // ---- Actions -------------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || yh(this.hass, this._config, this._name, () => this.hass && this._config && vt(this, this.hass, "switch", this._config));
  }
  // ---- Texts -----------------------------------------------------------------------
  _status(t, e) {
    const s = this.hass;
    if (Xt(t)) return r(s, "unavailable");
    const i = this._config.style ?? "c", n = e ? mn(s, Kt(s, this._config).power) : null, a = this._usage, o = a ? a.kwhToday != null ? Ct(s, a.kwhToday) : ft(a.onToday) : "", l = r(s, e ? "sw_on" : "sw_off");
    if (this._size === "s11") return l;
    if (this._size === "s21") return n != null && n > 1e-3 ? fe(s, n) : l;
    if (i === "a") return n != null && e ? `${l} · ${fe(s, n)}` : l;
    if (i === "b") {
      if (!e) return o ? `${l} · ${r(s, "sw_today_l")} ${o}` : l;
      const c = `${r(s, "sw_since")} ${dt(s, t.last_changed)}`;
      return a?.kwhToday != null ? `${c} · ${r(s, "sw_today_l")} ${Ct(s, a.kwhToday)}` : c;
    }
    return e ? n != null && a?.kwhToday != null ? `${fe(s, n)} · ${r(s, "sw_today_l")} ${Ct(s, a.kwhToday)}` : a ? `${r(s, "sw_since")} ${dt(s, t.last_changed)} · ${r(s, "sw_today_l")} ${ft(a.onToday)}` : `${r(s, "sw_since")} ${dt(s, t.last_changed)}` : o ? `${l} · ${r(s, "sw_today_l")} ${o}` : l;
  }
  // ---- Render ------------------------------------------------------------------------
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = Jn(e), i = Xt(e), n = this._size, a = d`<button class="icon" aria-label="${s ? r(t, "turn_off") : r(t, "turn_on")} ${this._name}" ?disabled=${i} @click=${this._toggle}>
      ${gt(this._icon, s, n === "s11" ? 20 : 32)}
    </button>`, o = d`<div class="text"><span class="name">${this._name}</span><span class="state">${this._status(e, s)}</span></div>`;
    return d`<div
      class="card ${n} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${s ? Cc(hs(this._config.color)) : ""}
      role="button"
      tabindex="0"
      aria-label=${this._name}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      @click=${this._cardClick}
      @keydown=${(l) => {
      (l.key === "Enter" || l.key === " ") && l.target === l.currentTarget && (l.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(l) => l.preventDefault()}
    >
      ${n === "s22" ? d`<div class="head">${a}${o}</div>${this._body(e, s)}` : d`${a}${o}`}
    </div>`;
  }
  _body(t, e) {
    const s = this.hass, i = this._config, n = this._usage, a = i.style ?? "c", o = e ? mn(s, Kt(s, i).power) : null;
    if (a === "a")
      return d`<div class="since">
        <span><b>${r(s, e ? "sw_since" : "sw_off")}</b>${dt(s, t.last_changed)}</span>
        ${o != null ? d`<span><b>${r(s, "sw_now")}</b>${fe(s, o)}</span>` : f}
        ${n ? d`<span><b>${r(s, "today")}</b>${n.kwhToday != null ? Ct(s, n.kwhToday) : ft(n.onToday)}</span>` : f}
      </div>`;
    if (a === "b") {
      const p = n ? n.hourly ?? n.hourlyOn : Array(24).fill(0), _ = Math.max(...p, n?.hourly ? 0.05 : 15), b = (/* @__PURE__ */ new Date()).getHours();
      let g;
      if (o != null && e) {
        const m = fe(s, o).split(" ");
        g = [m[0], m[1]];
      } else if (n?.kwhToday != null) g = [Ct(s, n.kwhToday).split(" ")[0], "kWh"];
      else {
        const m = ft(n?.onToday ?? 0), y = m.match(/^(.*?)\s*(min|h)$/);
        g = y ? [y[1], y[2]] : [m, ""];
      }
      return d`<div class="cons">
        <span class="big">${g[0]}<small> ${g[1]}</small></span>
        <span class="bars" aria-hidden="true">${p.map((m, y) => d`<i class=${m > 0 ? y === b ? "now" : "" : "z"} style="height:${m > 0 ? Math.max(4, m / _ * 34) : 3}px"></i>`)}</span>
      </div>`;
    }
    const l = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).getTime(), c = 864e5, h = (Date.now() - l) / c * 100, u = (n?.spans ?? []).filter((p) => p.end > l);
    return d`<div class="line">
      <div class="tl">
        ${u.map((p) => {
      const _ = Math.max(0, (p.start - l) / c) * 100, b = Math.min(100, (p.end - l) / c * 100);
      return d`<i style="left:${_}%;width:${Math.max(0.8, b - _)}%"></i>`;
    })}
        <b style="left:${h}%"></b>
      </div>
      <div class="ticks"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`;
  }
};
re.styles = E`
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
      min-height: 64px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
      transition: background 0.25s;
    }
    .on .icon {
      background: var(--accent);
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
    }
    .head .text {
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
    .s21 .icon {
      align-self: flex-start;
    }
    /* a · data */
    .since {
      display: flex;
      gap: 18px;
      font-size: 12px;
      color: var(--fg2);
      flex: none;
    }
    .since b {
      display: block;
      font-size: 15px;
      color: var(--fg);
    }
    /* b · consumption */
    .cons {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 12px;
      flex: none;
    }
    .big {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .big small {
      font-size: 15px;
      font-weight: 600;
      color: var(--fg2);
      letter-spacing: 0;
    }
    .bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 34px;
      width: 46%;
    }
    .bars i {
      flex: 1;
      border-radius: 3px 3px 1px 1px;
      background: var(--accent, rgba(255, 255, 255, 0.85));
      opacity: 0.8;
    }
    .bars i.now {
      opacity: 1;
    }
    .bars i.z {
      background: color-mix(in srgb, var(--fg) 14%, transparent);
      opacity: 1;
    }
    /* c · timeline */
    .line {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: none;
    }
    .tl {
      position: relative;
      height: 12px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      overflow: hidden;
    }
    .tl i {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 6px;
      background: var(--accent, #fff);
    }
    .off .tl i {
      background: rgba(255, 255, 255, 0.6);
    }
    .tl b {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--fg);
      opacity: 0.7;
    }
    .ticks {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      font-weight: 600;
      color: var(--fg2);
    }
  `;
Ns([
  $({ attribute: !1 })
], re.prototype, "hass", 2);
Ns([
  w()
], re.prototype, "_config", 2);
Ns([
  w()
], re.prototype, "_size", 2);
Ns([
  w()
], re.prototype, "_usage", 2);
re = Ns([
  j(kh)
], re);
const Tr = E`
  .ehead {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: none;
    min-width: 0;
  }
  .ehead.sm {
    gap: 10px;
  }
  .eic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #ffb020;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  .ehead.sm .eic {
    width: 34px;
    height: 34px;
  }
  .eic.sm {
    width: 40px;
    height: 40px;
  }
  .txt {
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
  .ehead.sm .name {
    font-size: 15px;
  }
  .state {
    font-size: 13px;
    color: var(--fg2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tot {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .ehead.sm .tot {
    font-size: 24px;
  }
  .tot small {
    font-size: 14px;
    font-weight: 600;
    color: var(--fg2);
    letter-spacing: 0;
  }
  svg.flow {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: visible;
  }
  .t1 {
    font: 600 14px Inter, system-ui, sans-serif;
    fill: #fff;
  }
  .t1.sm {
    font-size: 13.5px;
  }
  .t2 {
    font: 500 12.5px Inter, system-ui, sans-serif;
    fill: rgba(255, 255, 255, 0.72);
  }
  .t2.xs {
    font-size: 11px;
  }
  .big {
    font: 700 30px Inter, system-ui, sans-serif;
    fill: #fff;
    letter-spacing: -0.5px;
  }
  .mid {
    font: 700 21px Inter, system-ui, sans-serif;
    fill: #fff;
  }
  .stack,
  .hbar {
    display: flex;
    height: 10px;
    border-radius: 5px;
    overflow: hidden;
    gap: 2px;
    flex: none;
  }
  .hbar {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 7px;
    height: 4px;
    gap: 1px;
  }
  .hbar i {
    background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 4px, transparent 4px 8px);
    background-size: 11.3px 11.3px;
  }
  .hbar i:not(.mv) {
    background-image: none;
  }
  .legend {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--fg2);
    flex: none;
    margin-top: -4px;
  }
  .legend b {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .vstack {
    position: absolute;
    right: 14px;
    top: 14px;
    bottom: 14px;
    width: 12px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column-reverse;
    gap: 2px;
    background: rgba(255, 255, 255, 0.12);
  }
  /* bars */
  .lbars {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    justify-content: center;
    min-height: 0;
  }
  .lbars.sm {
    gap: 7px;
  }
  .lb {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .lbars.sm .lb {
    gap: 9px;
  }
  .ci {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex: none;
  }
  .lbars.sm .ci {
    width: 26px;
    height: 26px;
  }
  .ci.xs {
    width: 20px;
    height: 20px;
  }
  .lbt {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .lbars.sm .lbt {
    gap: 3px;
  }
  .lbn {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 14.5px;
    font-weight: 600;
    min-width: 0;
  }
  .lbn span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lbn b {
    white-space: nowrap;
  }
  .lbn.top {
    flex: none;
    font-size: 15px;
  }
  .lbars.sm .lbn {
    font-size: 13px;
  }
  .lbn small {
    font-weight: 500;
    color: var(--fg2);
  }
  .trk {
    height: 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.12);
    overflow: hidden;
    flex: 1;
    min-width: 0;
  }
  .lbars.sm .trk {
    height: 7px;
  }
  .trk i {
    display: block;
    height: 100%;
    border-radius: 6px;
    background: var(--c);
    transition: width 0.6s;
  }
  .trk i.mv,
  .hbar i.mv {
    background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 7px, transparent 7px 14px);
    background-size: 19.8px 19.8px;
    animation: e-stripes linear infinite;
  }
  .hbar i.mv {
    background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 4px, transparent 4px 8px);
    background-size: 11.3px 11.3px;
    animation-name: e-stripes-s;
  }
  @keyframes e-stripes {
    to {
      background-position: 19.8px 0;
    }
  }
  @keyframes e-stripes-s {
    to {
      background-position: 11.3px 0;
    }
  }
  .mini {
    display: flex;
    flex-direction: column;
    gap: 9px;
    flex: none;
  }
  .mr {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .mr .trk {
    height: 7px;
  }
  .mr b {
    font-size: 12px;
    min-width: 30px;
    text-align: right;
  }
  @media (prefers-reduced-motion: reduce) {
    .trk i.mv,
    .hbar i.mv {
      animation: none;
    }
  }
`;
var Mh = Object.defineProperty, Sh = Object.getOwnPropertyDescriptor, Ve = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Sh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Mh(e, s, n), n;
};
let Wt = class extends D {
  constructor() {
    super(...arguments), this.name = "", this._error = !1, this._started = !1;
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Q(19)}</button>` : f;
  }
  updated() {
    this._started || !this.hass || (this._started = !0, ar(this.hass, this.config, 7).then((t) => this._usage = t).catch(() => this._error = !0));
  }
  renderContent() {
    const t = this.hass, e = this.config, s = nr(t, e, r(t, "en_rest")), i = this._usage, n = t.locale?.language ?? t.language ?? void 0, a = s.items.map((g) => g.key), o = Object.fromEntries(s.items.map((g) => [g.key, q(g.color)])), l = Array.from({ length: 24 }, (g, m) => a.reduce((y, v) => y + (i?.hourly[v]?.[m] ?? 0), 0)), c = Math.max(0.2, ...l), h = (i?.days ?? []).map((g) => a.reduce((m, y) => m + (g.kwh[y] ?? 0), 0)), u = Math.max(0.5, ...h), p = h.reduce((g, m) => g + m, 0), _ = a.map((g) => ({ k: g, v: (i?.days ?? []).reduce((m, y) => m + (y.kwh[g] ?? 0), 0) })), b = Object.fromEntries(s.items.map((g) => [g.key, g.name]));
    return d`
      <div class="status">
        <span class="eic">${J("bolt", 30)}</span>
        <div class="stx"><strong>${V(t, s.total)} kW ${r(t, "en_now_l")}</strong>${i ? d`<span>${r(t, "today")} ${V(t, i.todayTotal)} kWh</span>` : f}</div>
      </div>
      <div class="scroll">
        ${this._error ? d`<div class="list"><p class="empty">${r(t, "history_unavailable")}</p></div>` : f}
        <section>
          <h3>${r(t, "en_now")}</h3>
          <div class="list now">${cr({
      h: t,
      live: s,
      view: e.view ?? "flow",
      animate: e.animate !== !1,
      title: r(t, "en_consumption"),
      labels: { now: r(t, "en_now"), grid: r(t, "en_grid"), kwNow: r(t, "en_kw_now") }
    })}</div>
        </section>
        <section>
          <h3>${r(t, "en_today_hours")}</h3>
          <div class="list">
            <div class="hb">${l.map((g, m) => g > 1e-3 ? d`<div>${a.map((y) => {
      const v = i?.hourly[y]?.[m] ?? 0;
      return v > 1e-3 ? d`<i style="height:${v / c * 72}px;background:${o[y]}"></i>` : f;
    })}</div>` : d`<div><i class="z"></i></div>`)}</div>
            <div class="ticks"><span>0 h</span><span>6</span><span>12</span><span>18</span><span>24 h</span></div>
          </div>
        </section>
        <section>
          <h3>${r(t, "en_by_consumer")}</h3>
          <div class="list">
            ${s.items.map((g) => {
      const m = i?.today[g.key] ?? 0, y = i && i.todayTotal > 0 ? Math.round(m / i.todayTotal * 100) : 0;
      return d`<div class="row">
                <span class="ci" style="background:${q(g.color)}">${J(g.icon, 18)}</span>
                <span class="nm">${g.name}<small>${Oe(t, g)} ${r(t, "en_now_l")}</small><span class="bar"><i style="width:${y}%;background:${q(g.color)}"></i></span></span>
                <span class="v">${i ? `${V(t, m)} kWh` : "…"}<small>${i ? `${y} %` : ""}</small></span>
              </div>`;
    })}
          </div>
        </section>
        <section>
          <h3>${r(t, "last_7_days")}</h3>
          <div class="list">
            <div class="wk">${(i?.days ?? Array.from({ length: 7 }, (g, m) => ({ day: new Date(Date.now() - (6 - m) * 864e5), kwh: {} }))).map((g, m, y) => d`<div>
              <span class="col">${a.map((v) => (g.kwh[v] ?? 0) > 1e-3 ? d`<i style="height:${(g.kwh[v] ?? 0) / u * 80}px;background:${o[v]}"></i>` : f)}</span>
              <span>${m === y.length - 1 ? r(t, "today") : g.day.toLocaleDateString(n, { weekday: "narrow" })}</span>
            </div>`)}</div>
            <div class="sum"><span>${r(t, "week_total")} <b>${i ? `${V(t, p)} kWh` : "…"}</b></span>
              <span>${i && p > 0 ? _.filter((g) => g.v > 0).map((g) => `${b[g.k].split(" ")[0]} ${Math.round(g.v / p * 100)} %`).join(" · ") : ""}</span></div>
          </div>
        </section>
      </div>
    `;
  }
};
Wt.styles = [
  D.styles,
  Tr,
  E`
      .status {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.08);
        flex: none;
        --fg2: rgba(255, 255, 255, 0.75);
      }
      .stx {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .stx strong {
        font-size: 18px;
      }
      .stx span {
        font-size: 13.5px;
        color: rgba(255, 255, 255, 0.75);
      }
      .scroll {
        display: flex;
        flex-direction: column;
        gap: 16px;
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.7);
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
      .list.now {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px 14px;
        height: 150px;
        box-sizing: border-box;
      }
      .empty {
        margin: 0;
        padding: 16px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
      }
      .hb {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 84px;
        padding: 12px 14px 4px;
      }
      .hb div {
        flex: 1;
        display: flex;
        flex-direction: column-reverse;
        gap: 1px;
        height: 100%;
      }
      .hb i {
        display: block;
        border-radius: 2px;
      }
      .hb .z {
        height: 3px;
        background: rgba(255, 255, 255, 0.14);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        padding: 0 14px 10px;
      }
      .row {
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
      .row .ci {
        width: 34px;
        height: 34px;
      }
      .row .nm {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
        min-width: 0;
      }
      .row .nm small {
        font-size: 12.5px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .row .bar {
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.12);
        margin-top: 5px;
        overflow: hidden;
      }
      .row .bar i {
        display: block;
        height: 100%;
        border-radius: 2px;
      }
      .row .v {
        font-size: 15px;
        font-weight: 700;
        text-align: right;
        white-space: nowrap;
      }
      .row .v small {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
      }
      .wk {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 110px;
        padding: 12px 14px 8px;
        box-sizing: border-box;
      }
      .wk > div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
      }
      .wk .col {
        width: 100%;
        max-width: 26px;
        display: flex;
        flex-direction: column-reverse;
        gap: 2px;
      }
      .wk .col i {
        display: block;
        border-radius: 3px;
      }
      .wk span {
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: capitalize;
      }
      .sum {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding: 0 14px 12px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }
      .sum b {
        color: #fff;
      }
    `
];
Ve([
  $({ attribute: !1 })
], Wt.prototype, "config", 2);
Ve([
  $()
], Wt.prototype, "name", 2);
Ve([
  $({ attribute: !1 })
], Wt.prototype, "onSettings", 2);
Ve([
  w()
], Wt.prototype, "_usage", 2);
Ve([
  w()
], Wt.prototype, "_error", 2);
Wt = Ve([
  j("terral-energy-dialog")
], Wt);
function Ch(t, e, s, i) {
  document.querySelector("terral-energy-dialog")?.remove();
  const n = document.createElement("terral-energy-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function zh(t) {
  for (const e of document.querySelectorAll("terral-energy-dialog")) e.hass = t;
}
var Ah = Object.defineProperty, Th = Object.getOwnPropertyDescriptor, Ps = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Th(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Ah(e, s, n), n;
};
const Dh = "terral-home-energy";
let le = class extends B {
  constructor() {
    super(...arguments), this._size = "s42", this._held = !1, this._loaded = "", this._down = (t) => {
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
    if (!t?.entity) throw new Error("Terral · Energía: 'entity' must be the power sensor of the house");
    this._config = t, this._loaded = "";
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.h === 4 ? "s42" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s42" ? 4 : this._size === "s11" ? 1 : 2;
  }
  getGridOptions() {
    return { columns: 12, rows: 4, min_columns: 3, min_rows: 1 };
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
    return { entity: Object.keys(t?.states ?? {}).find((s) => s.startsWith("sensor.") && ["W", "kW"].includes(String(t.states[s].attributes.unit_of_measurement))) ?? "sensor.house_power", consumers: [] };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "sensor", device_class: "power" } } },
        { name: "name", selector: { text: {} } },
        { name: "view", selector: { select: { mode: "dropdown", options: ["flow", "ring", "bars"] } } }
      ]
    };
  }
  get _title() {
    return this._config?.name || r(this.hass, "en_title");
  }
  // ---- Lifecycle -------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._tick = window.setInterval(() => {
      this._loaded = "", this._load();
    }, 5 * 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._tick), this._cancelHold();
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || !this.hass ? !0 : [this._config.entity, ...(this._config.consumers ?? []).map((i) => i.entity)].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && zh(this.hass), this._load();
  }
  _load() {
    const t = this.hass, e = this._config;
    if (!t || !e) return;
    const s = JSON.stringify([e.entity, e.sum_only, e.rest, e.consumers]);
    s !== this._loaded && (this._loaded = s, Ic(t, e).then((i) => this._usage = i).catch(() => {
    }));
  }
  // ---- Actions -------------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || Ch(this.hass, this._config, this._title, () => this.hass && this._config && vt(this, this.hass, "energy", this._config));
  }
  // ---- Render -------------------------------------------------------------------------
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._config;
    if (!e.sum_only && !t.states[e.entity]) return d`<div class="card missing"><span>${r(t, "not_found")}</span><small>${e.entity}</small></div>`;
    const i = {
      h: t,
      live: nr(t, e, r(t, "en_rest")),
      view: e.view ?? "flow",
      animate: e.animate !== !1,
      title: this._size === "s42" ? this._title : this._config.name || r(t, "en_short"),
      todayText: this._usage ? `${r(t, "sw_today_l")} ${V(t, this._usage.todayTotal)} kWh` : void 0,
      today: this._usage?.today,
      labels: { now: r(t, "en_now"), grid: r(t, "en_grid"), kwNow: r(t, "en_kw_now") }
    };
    this._size === "s22" && i.view !== "bars" && (i.title = r(t, "en_consumption"));
    const n = this._size === "s42" ? Uc(i) : this._size === "s22" ? cr(i) : this._size === "s21" ? Fc(i) : Bc(i);
    return d`<div
      class="card ${this._size}"
      role="button"
      tabindex="0"
      aria-label="${this._title}: ${V(t, i.live.total)} kW"
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      @click=${this._click}
      @keydown=${(a) => {
      (a.key === "Enter" || a.key === " ") && (a.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(a) => a.preventDefault()}
    >${n}</div>`;
  }
};
le.styles = [
  E`
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
        min-height: 64px;
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
        --fg: #fff;
        --fg2: rgba(255, 255, 255, 0.75);
        color: var(--fg);
        background: var(--ha-card-background, rgba(255, 255, 255, 0.13));
        -webkit-backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
        backdrop-filter: var(--ha-card-backdrop-filter, blur(24px) saturate(170%));
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
      }
      .missing {
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 13px;
      }
      .s11 {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
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
      .s21 .name,
      .s21 .ehead .name {
        font-size: 16px;
      }
      .s21 .txt {
        flex: none;
      }
      .s21 > .eic {
        align-self: flex-start;
      }
    `,
  Tr
];
Ps([
  $({ attribute: !1 })
], le.prototype, "hass", 2);
Ps([
  w()
], le.prototype, "_config", 2);
Ps([
  w()
], le.prototype, "_size", 2);
Ps([
  w()
], le.prototype, "_usage", 2);
le = Ps([
  j(Dh)
], le);
var Oh = Object.defineProperty, Eh = Object.getOwnPropertyDescriptor, Ye = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Eh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Oh(e, s, n), n;
};
let It = class extends D {
  constructor() {
    super(...arguments), this._error = !1, this._loadedFor = "";
  }
  get _ids() {
    return [this.config.entity, ...this.config.group ?? []].filter((t, e, s) => s.indexOf(t) === e);
  }
  _name(t) {
    const e = this.hass.states[t];
    return t === this.config.entity && this.config.name && !(this.config.group ?? []).length ? this.config.name : (e ? this.hass.formatEntityName?.(e) : void 0) || String(e?.attributes.friendly_name ?? t);
  }
  get heading() {
    return this.sensor ? this._name(this.sensor) : this.config.name || r(this.hass, "ct_group_title");
  }
  renderHeaderStart() {
    return !this.sensor || !(this.config.group ?? []).length ? f : d`<button class="hbtn" aria-label=${r(this.hass, "back")} @click=${() => {
      this.sensor = void 0, this._usage = void 0, this._loadedFor = "";
    }}>${_o()}</button>`;
  }
  renderHeaderEnd() {
    return this.onSettings ? d`<button class="hbtn" aria-label=${r(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${Q(19)}</button>` : f;
  }
  updated() {
    const t = this.sensor;
    if (!t || !this.hass) return;
    const e = `${t}|${this.hass.states[t]?.last_changed}`;
    e !== this._loadedFor && (this._loadedFor = e, ta(this.hass, { entity: t, power_entity: "none", energy_entity: "none" }, 7).then((s) => {
      this._usage = s, this._error = !1;
    }).catch(() => this._error = !0));
  }
  renderContent() {
    return this.sensor ? this._detail(this.sensor) : this._list();
  }
  _list() {
    const t = this.hass, e = this._ids.filter((i) => t.states[i]), s = (i) => ({ open: 0, vent: 1, tilt: 1, unavailable: 2, closed: 3 })[Gt(t, this.config, i)];
    return d`<div class="scroll"><div class="list">
      ${[...e].sort((i, n) => s(i) - s(n) || this._name(i).localeCompare(this._name(n))).map((i) => {
      const n = t.states[i], a = Gt(t, this.config, i);
      return d`<button class="sess" @click=${() => this.sensor = i}>
          <span class="dot ${a}">${Se(st(t, { entity: i, kind: i === this.config.entity ? this.config.kind : void 0 }), a, 17)}</span>
          <span class="nm"><span>${this._name(i)}</span><small>${this._stateLine(i)}</small></span>
          <span class="kwh">${a === "open" ? pt(li(n)) : a === "vent" || a === "tilt" ? Me(t, a) : a === "unavailable" ? "—" : Qt("check", 16)}</span>
        </button>`;
    })}
    </div></div>`;
  }
  _stateLine(t) {
    const e = this.hass, s = e.states[t];
    if (ke(s)) return r(e, "unavailable");
    const i = Gt(e, this.config, t);
    return i === "vent" || i === "tilt" ? Me(e, i) : Cs(s) ? `${r(e, "ct_open")} · ${r(e, "ct_ago", { t: pt(li(s)) })}` : `${r(e, "ct_closed")} · ${r(e, "ct_since", { t: dt(e, s.last_changed) })}`;
  }
  _when(t) {
    const e = this.hass, s = e.locale?.language ?? e.language ?? void 0, i = new Date(t), n = /* @__PURE__ */ new Date(), a = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1), o = dt(e, t);
    if (i.toDateString() === n.toDateString()) return `${r(e, "today")} · ${o}`;
    if (i.toDateString() === a.toDateString()) return `${r(e, "yesterday")} · ${o}`;
    const l = i.toLocaleDateString(s, { weekday: "long", day: "numeric" });
    return `${l.charAt(0).toUpperCase()}${l.slice(1)} · ${o}`;
  }
  _detail(t) {
    const e = this.hass, s = this.config, i = e.states[t];
    if (!i) return d`<p class="empty">${r(e, "not_found")}</p>`;
    Cs(i);
    const n = Gt(e, s, t), a = st(e, { entity: t, kind: t === s.entity ? s.kind : void 0 }), o = ps(e, t), l = this._usage, c = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).getTime(), h = 864e5, u = (l?.spans ?? []).filter((M) => M.end > c), p = u.filter((M) => M.start >= c).length, _ = u.reduce((M, O) => Math.max(M, Math.min(O.end, Date.now()) - Math.max(O.start, c)), 0), b = [...l?.spans ?? []].reverse().slice(0, 10), g = (M) => M ? e.states[M] : void 0, m = (M, O, T, W, z = !1) => d`<div class="src">
      <span class="ci">${Qt(M, 17)}</span><span class="nm">${O}${T ? d`<small>${T}</small>` : f}</span><span class="v ${z ? "ok" : ""}">${W}</span></div>`, y = g(o.tamper), v = g(o.vibration), k = g(o.temperature), C = g(o.battery), S = g(o.node), L = S ? S.state === "dead" ? r(e, "ct_node_dead") : r(e, "ct_node_ok") : "";
    return d`
      <div class="status ${ci(n) ? "on" : ""}" style=${ci(n)}>
        <span class="icon">${Se(a, n, 32)}</span>
        <div class="txt"><strong>${Me(e, n)}</strong>
          <span>${ke(i) ? "" : `${r(e, "ct_since_at", { t: dt(e, i.last_changed) })} · ${pt((Date.now() - new Date(i.last_changed).getTime()) / 6e4)}`}</span></div>
      </div>
      <div class="scroll">
        ${this._error ? d`<div class="list"><p class="empty">${r(e, "history_unavailable")}</p></div>` : f}
        <section>
          <h3>${r(e, "today")}</h3>
          <div class="list">
            <div class="tlw">
              <div class="tl">${u.map((M) => {
      const O = Math.max(0, (M.start - c) / h) * 100, T = Math.min(100, (M.end - c) / h * 100);
      return d`<i style="left:${O}%;width:${Math.max(0.6, T - O)}%"></i>`;
    })}<b style="left:${(Date.now() - c) / h * 100}%"></b></div>
              <div class="ticks"><span>0 h</span><span>6</span><span>12</span><span>18</span><span>24 h</span></div>
            </div>
            <div class="st3">
              <div>${r(e, "ct_openings")}<b>${l ? p : "…"}</b></div>
              <div>${r(e, "ct_time_open")}<b>${l ? pt(l.onToday / 6e4) : "…"}</b></div>
              <div>${r(e, "ct_longest")}<b>${l ? pt(_ / 6e4) : "…"}</b></div>
            </div>
          </div>
        </section>
        <section>
          <h3>${r(e, "ct_openings")}</h3>
          <div class="list">
            ${!l && !this._error ? d`<p class="empty">…</p>` : f}
            ${l && !b.length ? d`<p class="empty">${r(e, "ct_no_openings")}</p>` : f}
            ${b.map((M) => d`<div class="sess">
              <span class="dot ${M.live ? "open" : ""}">${zt(a, M.live, 17)}</span>
              <span class="nm"><span>${this._when(M.start)}</span><small>${M.live ? r(e, "ct_open_now") : r(e, "ct_was_open", { t: pt((M.end - M.start) / 6e4) })}</small></span>
              <span class="kwh">${pt((Math.min(M.end, Date.now()) - M.start) / 6e4)}</span>
            </div>`)}
          </div>
        </section>
        ${k || v || y || C || S ? d`<section>
              <h3>${r(e, "ct_sensor")}</h3>
              <div class="list">
                ${k ? m("thermo", r(e, "temperature"), "", `${Number(k.state).toLocaleString(e.locale?.language, { maximumFractionDigits: 1 })} °C`) : f}
                ${v ? m("vibration", r(e, "ct_vibration"), r(e, "ct_vibration_sub"), r(e, v.state === "on" ? "ct_detected" : "ct_still"), v.state !== "on") : f}
                ${y ? m("shield", r(e, "ct_tamper"), r(e, "ct_tamper_sub"), r(e, y.state === "on" ? "ct_detected" : "ct_not_detected"), y.state !== "on") : f}
                ${C ? m("battery", r(e, "battery"), "", C.entity_id.startsWith("binary_sensor.") ? r(e, C.state === "on" ? "ct_bat_low" : "ct_bat_ok") : `${Math.round(Number(C.state))} %`) : f}
                ${S ? m("sleep", r(e, "ct_node"), r(e, "ct_node_sub", { s: S.state }), L, S.state !== "dead") : f}
              </div>
            </section>` : f}
      </div>`;
  }
};
It.styles = [
  D.styles,
  E`
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
      .warn {
        margin: 0;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 122, 47, 0.16);
        border: 1px solid rgba(255, 122, 47, 0.4);
        font-size: 13.5px;
        line-height: 1.45;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      .tlw {
        padding: 14px 14px 4px;
      }
      .tl {
        position: relative;
        height: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .tl i {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 8px;
        background: #ff7a2f;
      }
      .tl b {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 2px;
        background: #fff;
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 6px;
      }
      .st3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        padding: 10px 14px 14px;
      }
      .st3 div {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.07);
        padding: 9px 10px;
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.65);
        min-width: 0;
      }
      .st3 b {
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sess {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 56px;
        box-sizing: border-box;
        text-align: left;
      }
      .sess + .sess {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .dot {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .dot.open {
        background: #ff7a2f;
      }
      .dot.vent,
      .dot.tilt {
        background: #3b82f6;
      }
      .sess .nm,
      .src .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 600;
      }
      .sess .nm small,
      .src .nm small {
        font-size: 12.5px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .kwh {
        font-size: 15px;
        font-weight: 700;
        white-space: nowrap;
      }
      .src {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        min-height: 54px;
        box-sizing: border-box;
      }
      .src + .src {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .ci {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
      }
      .v {
        font-size: 14px;
        font-weight: 700;
        white-space: nowrap;
      }
      .v.ok {
        color: #5be39a;
      }
    `
];
Ye([
  $({ attribute: !1 })
], It.prototype, "config", 2);
Ye([
  $()
], It.prototype, "sensor", 2);
Ye([
  $({ attribute: !1 })
], It.prototype, "onSettings", 2);
Ye([
  w()
], It.prototype, "_usage", 2);
Ye([
  w()
], It.prototype, "_error", 2);
It = Ye([
  j("terral-contact-dialog")
], It);
function jh(t, e, s, i) {
  document.querySelector("terral-contact-dialog")?.remove();
  const n = document.createElement("terral-contact-dialog");
  return n.hass = t, n.config = { ...e }, n.sensor = s, n.onSettings = i, document.body.appendChild(n), n;
}
function Nh(t) {
  for (const e of document.querySelectorAll("terral-contact-dialog")) e.hass = t;
}
var Ph = Object.defineProperty, Lh = Object.getOwnPropertyDescriptor, Ls = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Lh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Ph(e, s, n), n;
};
const Wh = "terral-home-contact";
let ce = class extends B {
  constructor() {
    super(...arguments), this._size = "s22", this._held = !1, this._loaded = "", this._down = (t) => {
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
      for (const e of t.composedPath()) {
        if (e === t.currentTarget) break;
        if (e instanceof HTMLElement && e.dataset.id) return this._openWindow(e.dataset.id);
      }
      this._openWindow();
    };
  }
  setConfig(t) {
    if (!t?.entity) throw new Error("Terral · Puertas y ventanas: 'entity' must be a door / window sensor");
    this._config = t, this._loaded = "";
    const e = t.view_layout?.terral;
    e && (this._size = e.h === 1 ? "s11" : e.h === 4 ? "s42" : e.w === 2 ? "s22" : "s21");
  }
  getCardSize() {
    return this._size === "s42" ? 4 : this._size === "s11" ? 1 : 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 3, min_rows: 1 };
  }
  getTerralSizes() {
    const t = [
      { w: 1, h: 1 },
      { w: 1, h: 2 },
      { w: 2, h: 2 },
      { w: 2, h: 4 }
    ];
    return this._isGroup ? t : t.slice(0, 3);
  }
  static getStubConfig(t) {
    return { entity: Object.keys(t?.states ?? {}).find((s) => s.startsWith("binary_sensor.") && ["door", "window"].includes(String(t.states[s].attributes.device_class))) ?? "binary_sensor.door" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: !0, selector: { entity: { domain: "binary_sensor" } } },
        { name: "name", selector: { text: {} } },
        { name: "kind", selector: { select: { mode: "dropdown", options: ["door", "window", "balcony", "garage"] } } },
        { name: "group", selector: { entity: { domain: "binary_sensor", multiple: !0 } } }
      ]
    };
  }
  get _isGroup() {
    return (this._config?.group ?? []).length > 0;
  }
  get _ids() {
    const t = this._config;
    return [t.entity, ...t.group ?? []].filter((e, s, i) => i.indexOf(e) === s);
  }
  _nameOf(t) {
    const e = this._config;
    if (t === e.entity && e.name && !this._isGroup) return e.name;
    const s = this.hass?.states[t];
    return (s ? this.hass?.formatEntityName?.(s) : void 0) || String(s?.attributes.friendly_name ?? t);
  }
  // ---- Lifecycle -----------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._tick = window.setInterval(() => {
      this.hass && this._config && this._ids.some((t) => Cs(this.hass.states[t])) && this.requestUpdate();
    }, 3e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._tick), this._cancelHold();
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    if (!e || !this._config || !this.hass) return !0;
    const s = ps(this.hass, this._config.entity), i = this._ids.flatMap((n) => {
      const a = n === this._config.entity ? s : ps(this.hass, n);
      return [a.x, a.y, a.z];
    });
    return [...this._ids, ...Object.values(s), ...i].some((n) => n && e.states[n] !== this.hass.states[n]);
  }
  updated(t) {
    t.has("hass") && this.hass && Nh(this.hass);
    const e = this.hass, s = this._config;
    if (!e || !s || this._isGroup || this._size !== "s22") return;
    const i = `${e.states[s.entity]?.last_changed}`;
    i !== this._loaded && (this._loaded = i, tr(e, { entity: s.entity, power_entity: "none", energy_entity: "none" }).then((n) => this._usage = n).catch(() => {
    }));
  }
  // ---- Actions ---------------------------------------------------------------------
  _openWindow(t) {
    !this.hass || !this._config || jh(this.hass, this._config, t ?? (this._isGroup ? void 0 : this._config.entity), () => this.hass && this._config && vt(this, this.hass, "contact", this._config));
  }
  // ---- Render ------------------------------------------------------------------------
  _stateText(t, e = !1) {
    const s = this.hass, i = s.states[t];
    if (ke(i)) return r(s, "unavailable");
    const n = Gt(s, this._config, t), a = Me(s, n);
    return e ? a : n === "open" ? `${a} · ${r(s, "ct_ago", { t: pt(li(i)) })}` : n === "closed" ? `${a} · ${r(s, "ct_since", { t: dt(s, i.last_changed) })}` : a;
  }
  render() {
    return !this._config || !this.hass ? f : this._isGroup ? this._group() : this._single();
  }
  _wrap(t, e, s, i) {
    return d`<div class="card ${this._size} ${t}" style=${e} role="button" tabindex="0" aria-label=${i}
      @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._cancelHold} @pointercancel=${this._cancelHold} @pointerleave=${this._cancelHold}
      @click=${this._click}
      @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && n.target === n.currentTarget && (n.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(n) => n.preventDefault()}>${s}</div>`;
  }
  _single() {
    const t = this.hass, e = this._config, s = t.states[e.entity];
    if (!s) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${e.entity}</small></div>`;
    const i = Gt(t, e), n = Cs(s), a = st(t, e), o = ps(t, e.entity), l = ci(i), c = this._size === "s42" ? "s22" : this._size, h = d`<span class="icon">${Se(a, i, c === "s11" ? 20 : 32)}</span>`, u = this._nameOf(e.entity), p = this._stateText(e.entity, c !== "s22"), _ = d`<span class="txt"><span class="name">${u}</span><span class="state">${p}</span></span>`;
    let b = d`${h}${_}`;
    if (c === "s22") {
      const g = this._usage, m = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).getTime(), y = g ? g.spans.filter((M) => M.start >= m).length : void 0, v = e.show_temp !== !1 && o.temperature ? t.states[o.temperature] : void 0, k = e.show_battery !== !1 && o.battery ? t.states[o.battery] : void 0, C = k ? k.entity_id.startsWith("binary_sensor.") ? r(t, k.state === "on" ? "ct_bat_low" : "ct_bat_ok") : `${Math.round(Number(k.state))} %` : "", S = d`${v && !ke(v) ? d`<span class="chip">${Qt("thermo", 14)}${Number(v.state).toLocaleString(t.locale?.language, { maximumFractionDigits: 1 })}°</span>` : f}
        ${k && !ke(k) ? d`<span class="chip">${Qt("battery", 14)}${C}</span>` : f}
        ${y != null ? d`<span class="chip">${r(t, y === 1 ? "ct_opens_one" : "ct_opens", { n: y })}</span>` : f}`, L = 864e5;
      b = d`<div class="head">${h}${_}</div>
        <div class="foot">
          ${n || g && g.spans.some((M) => M.end > m) ? d`<div class="tl">${(g?.spans ?? []).filter((M) => M.end > m).map((M) => {
        const O = Math.max(0, (M.start - m) / L) * 100, T = Math.min(100, (M.end - m) / L * 100);
        return d`<i style="left:${O}%;width:${Math.max(0.8, T - O)}%"></i>`;
      })}<b style="left:${(Date.now() - m) / L * 100}%"></b></div>` : f}
          <div class="chips">${S}</div>
        </div>`;
    }
    return this._wrap(`${l ? "on" : "off"} ${i === "unavailable" ? "unavailable" : ""}`, l, b, `${u}: ${p}`);
  }
  _group() {
    const t = this.hass, e = this._config, s = this._ids.filter((M) => t.states[M]), i = Object.fromEntries(s.map((M) => [M, Gt(t, e, M)])), n = s.filter((M) => i[M] === "open"), a = s.filter((M) => i[M] === "vent" || i[M] === "tilt"), o = s.length - n.length - a.length, l = n.length ? "open" : a.length ? "vent" : "closed", c = ci(l), h = e.name || r(t, "ct_group_title"), u = [
      n.length ? r(t, n.length === 1 ? "ct_open_one" : "ct_open_n", { n: n.length }) : "",
      a.length ? r(t, "ct_vent_n", { n: a.length }) : "",
      o && (n.length || a.length) ? r(t, o === 1 ? "ct_closed_one" : "ct_closed_n", { n: o }) : ""
    ].filter(Boolean), p = u.length ? u.join(" · ") : r(t, "ct_all_closed"), _ = n[0] ?? a[0] ?? s[0] ?? e.entity, b = st(t, { entity: _, kind: _ === e.entity ? e.kind : void 0 }), g = this._size, m = n.length || a.length, y = d`<span class="icon">${Se(b, l, g === "s11" ? 20 : 32)}
      ${m ? d`<i class="cnt">${m}</i>` : f}</span>`, v = d`<span class="txt"><span class="name">${h}</span><span class="state">${p}</span></span>`;
    if (g === "s11" || g === "s21") return this._wrap(n.length ? "on" : "off", c, d`${y}${v}`, `${h}: ${p}`);
    const k = [...s].sort((M, O) => {
      const T = (W) => i[W] === "open" ? 0 : i[W] === "vent" || i[W] === "tilt" ? 1 : i[W] === "unavailable" ? 2 : 3;
      return T(M) - T(O) || this._nameOf(M).localeCompare(this._nameOf(O));
    }), C = g === "s42" ? 4 : 2, S = k.slice(0, k.length > C ? C - 1 : C), L = k.length - S.length;
    return this._wrap(n.length ? "on" : "off", c, d`<div class="head">${y}${v}</div>
      <div class="rows">
        ${S.map((M) => {
      const O = i[M], T = t.states[M], W = O === "open" ? pt(li(T)) : O === "vent" || O === "tilt" ? Me(t, O) : O === "unavailable" ? "—" : "";
      return d`<button class="row ${O}" data-id=${M}>
            <span class="ri">${Se(st(t, { entity: M, kind: M === e.entity ? e.kind : void 0 }), O, 18)}</span>
            <span class="rn">${this._nameOf(M)}<small>${this._stateText(M)}</small></span>
            <b>${W || Qt("check", 16)}</b>
          </button>`;
    })}
        ${L > 0 ? d`<span class="more">+ ${L} ${r(t, "more")}</span>` : f}
      </div>`, `${h}: ${p}`);
  }
};
ce.styles = E`
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
    svg {
      display: block;
      flex: none;
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
    .bd {
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
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
    }
    .cnt {
      position: absolute;
      right: -4px;
      top: -4px;
      min-width: 22px;
      height: 22px;
      padding: 0 5px;
      box-sizing: border-box;
      border-radius: 11px;
      background: #fff;
      color: #3d1c10;
      font-size: 12px;
      font-weight: 700;
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    }
    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .txt {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .s21 .txt {
      flex: none;
    }
    .s21 .icon {
      align-self: flex-start;
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
    .s11 .bd {
      width: 18px;
      height: 18px;
      right: -5px;
      bottom: -5px;
    }
    .s11 .cnt {
      min-width: 18px;
      height: 18px;
      font-size: 10.5px;
      right: -6px;
      top: -6px;
    }
    .s11 .name {
      font-size: 14px;
    }
    .s11 .state {
      font-size: 12px;
    }
    .foot {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: none;
    }
    .tl {
      position: relative;
      height: 10px;
      border-radius: 5px;
      background: color-mix(in srgb, var(--fg) 12%, transparent);
      overflow: hidden;
    }
    .tl i {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 5px;
      background: var(--accent, rgba(255, 255, 255, 0.65));
    }
    .off .tl i {
      background: rgba(255, 255, 255, 0.65);
    }
    .tl b {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--fg);
      opacity: 0.7;
    }
    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      max-height: 28px;
      overflow: hidden;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 10px;
      border-radius: 14px;
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-height: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: 14px;
      min-width: 0;
    }
    .ri {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      background: color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .row.open .ri {
      background: #ff7a2f;
      color: #fff;
    }
    .row.vent .ri,
    .row.tilt .ri {
      background: #3b82f6;
      color: #fff;
    }
    .row.open,
    .row.vent,
    .row.tilt {
      background: color-mix(in srgb, var(--fg) 6%, transparent);
    }
    .rn {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .rn small {
      font-size: 12px;
      font-weight: 400;
      color: var(--fg2);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row b {
      font-size: 13px;
      white-space: nowrap;
    }
    .more {
      margin: 2px 8px 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--fg2);
    }
  `;
Ls([
  $({ attribute: !1 })
], ce.prototype, "hass", 2);
Ls([
  w()
], ce.prototype, "_config", 2);
Ls([
  w()
], ce.prototype, "_size", 2);
Ls([
  w()
], ce.prototype, "_usage", 2);
ce = Ls([
  j(Wh)
], ce);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Ih } = Qr, Xa = (t) => t, Ka = () => document.createComment(""), es = (t, e, s) => {
  const i = t._$AA.parentNode, n = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const a = i.insertBefore(Ka(), n), o = i.insertBefore(Ka(), n);
    s = new Ih(a, o, t, t.options);
  } else {
    const a = s._$AB.nextSibling, o = s._$AM, l = o !== t;
    if (l) {
      let c;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (c = t._$AU) !== o._$AU && s._$AP(c);
    }
    if (a !== n || l) {
      let c = s._$AA;
      for (; c !== a; ) {
        const h = Xa(c).nextSibling;
        Xa(i).insertBefore(c, n), c = h;
      }
    }
  }
  return s;
}, qt = (t, e, s = t) => (t._$AI(e, s), t), Hh = {}, Rh = (t, e = Hh) => t._$AH = e, qh = (t) => t._$AH, Qi = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qa = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= s; n++) i.set(t[n], n);
  return i;
}, Za = vr(class extends wr {
  constructor(t) {
    if (super(t), t.type !== yr.CHILD) throw Error("repeat() can only be used in text expressions");
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
    const n = qh(t), { values: a, keys: o } = this.dt(e, s, i);
    if (!Array.isArray(n)) return this.ut = o, a;
    const l = this.ut ??= [], c = [];
    let h, u, p = 0, _ = n.length - 1, b = 0, g = a.length - 1;
    for (; p <= _ && b <= g; ) if (n[p] === null) p++;
    else if (n[_] === null) _--;
    else if (l[p] === o[b]) c[b] = qt(n[p], a[b]), p++, b++;
    else if (l[_] === o[g]) c[g] = qt(n[_], a[g]), _--, g--;
    else if (l[p] === o[g]) c[g] = qt(n[p], a[g]), es(t, c[g + 1], n[p]), p++, g--;
    else if (l[_] === o[b]) c[b] = qt(n[_], a[b]), es(t, n[p], n[_]), _--, b++;
    else if (h === void 0 && (h = Qa(o, b, g), u = Qa(l, p, _)), h.has(l[p])) if (h.has(l[_])) {
      const m = u.get(o[b]), y = m !== void 0 ? n[m] : null;
      if (y === null) {
        const v = es(t, n[p]);
        qt(v, a[b]), c[b] = v;
      } else c[b] = qt(y, a[b]), es(t, n[p], y), n[m] = null;
      b++;
    } else Qi(n[_]), _--;
    else Qi(n[p]), p++;
    for (; b <= g; ) {
      const m = es(t, c[g + 1]);
      qt(m, a[b]), c[b++] = m;
    }
    for (; p <= _; ) {
      const m = n[p++];
      m !== null && Qi(m);
    }
    return this.ut = o, Rh(t, c), Ot;
  }
});
function Uh(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const zn = ["lights", "climate"], An = ["lights"], Dr = (t) => Array.isArray(t.quick) ? t.quick.filter((e) => zn.includes(e)) : An;
function Fh(t, e) {
  const s = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.type !== "light" || !t.states[i.entity]) continue;
    const n = t.states[i.entity].attributes.entity_id;
    Array.isArray(n) && n.length ? n.filter((a) => t.states[a]).forEach((a) => s.add(a)) : s.add(i.entity);
  }
  return [...s];
}
const Bh = (t, e) => [...new Set(e.filter((s) => s.type === "climate" && t.states[s.entity]).map((s) => s.entity))];
function ra(t, e, s) {
  const i = e === "lights" ? Fh(t, s) : Bh(t, s), n = i.filter((a) => e === "lights" ? t.states[a].state === "on" : !Y(t.states[a])).length;
  return { ids: i, on: n };
}
function Vh(t, e, s) {
  const { ids: i, on: n } = ra(t, e, s);
  if (i.length) {
    if (e === "lights") {
      t.callService("light", n ? "turn_off" : "turn_on", {}, { entity_id: i });
      return;
    }
    for (const a of i) {
      const o = t.states[a];
      n && !Y(o) ? Gn(t, o) : n || Yn(t, o);
    }
  }
}
var Yh = Object.defineProperty, Gh = Object.getOwnPropertyDescriptor, Ge = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Gh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Yh(e, s, n), n;
};
let Ht = class extends D {
  constructor() {
    super(...arguments), this._title = "", this._quick = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._title = this.section.title, this._quick = Dr(this.section);
  }
  get heading() {
    return this._title || this.section.title;
  }
  _toggle(t) {
    const e = this._quick.includes(t);
    this._quick = zn.filter((s) => s === t ? !e : this._quick.includes(s));
  }
  renderContent() {
    const t = this.hass, e = (s) => {
      const i = ra(t, s, this.section.cards).ids.length, n = this._quick.includes(s) && i > 0;
      return d`<button class="li" role="switch" aria-checked=${n} ?disabled=${!i} @click=${() => this._toggle(s)}>
        <span class="ic">${s === "lights" ? it(!1, 20) : bs(20)}</span>
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
          <div class="list">${zn.map(e)}</div>
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
Ht.styles = [
  D.styles,
  E`
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
Ge([
  $({ attribute: !1 })
], Ht.prototype, "section", 2);
Ge([
  $({ attribute: !1 })
], Ht.prototype, "onSave", 2);
Ge([
  $({ attribute: !1 })
], Ht.prototype, "onRemove", 2);
Ge([
  w()
], Ht.prototype, "_title", 2);
Ge([
  w()
], Ht.prototype, "_quick", 2);
Ht = Ge([
  j("terral-section-sheet")
], Ht);
function Xh(t, e, s, i) {
  document.querySelector("terral-section-sheet")?.remove();
  const n = document.createElement("terral-section-sheet");
  return n.hass = t, n.section = e, n.onSave = s, n.onRemove = i, document.body.appendChild(n), n;
}
var Kh = Object.defineProperty, Qh = Object.getOwnPropertyDescriptor, et = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Qh(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Kh(e, s, n), n;
};
const Zh = [
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
function Zi(t) {
  window.history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
let X = class extends D {
  constructor() {
    super(...arguments), this._title = "", this._icon = "", this._admin = !1, this._favOn = !0, this._rows = 2, this._busy = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadMain();
    const t = this.options;
    this._title = t.info.title ?? "", this._icon = t.info.icon ?? (t.mode === "create" ? "mdi:view-dashboard" : ""), this._admin = !!t.info.require_admin, this._favOn = t.favorites.enabled, this._rows = t.favorites.rows;
  }
  get heading() {
    return r(this.hass, this.options.mode === "create" ? "dash_new" : "dash_settings");
  }
  /** Current default panels (user and, for admins, the whole house). */
  async _loadMain() {
    if (this.options.mode !== "edit" || !this.options.panelUrl) return;
    const t = (e) => this.hass.callWS({ type: e, key: "core" }).then((s) => s?.value ?? {}).catch(() => null);
    this._userMain = await t("frontend/get_user_data"), this._sidebar = await this.hass.callWS({ type: "frontend/get_user_data", key: "sidebar" }).then((e) => e?.value ?? {}).catch(() => null), this.options.admin && (this._sysMain = await t("frontend/get_system_data"));
  }
  async _setMain(t, e) {
    const i = { ...(t === "user" ? this._userMain : this._sysMain) ?? {} };
    e ? i.default_panel = this.options.panelUrl : delete i.default_panel;
    try {
      await this.hass.callWS({ type: t === "user" ? "frontend/set_user_data" : "frontend/set_system_data", key: "core", value: i }), t === "user" ? this._userMain = i : this._sysMain = i;
    } catch (n) {
      this._err = n?.message ?? String(n);
    }
  }
  /** Sidebar entries that can be hidden: everything with a title but this dashboard and Settings. */
  get _others() {
    const t = /* @__PURE__ */ new Set([this.options.panelUrl, "config", "developer-tools", "profile"]);
    return Object.values(this.hass.panels ?? {}).filter((e) => e.title && !t.has(e.url_path)).map((e) => e.url_path);
  }
  get _onlyThis() {
    const t = new Set(this._sidebar?.hiddenPanels ?? []), e = this._others;
    return e.length > 0 && e.every((s) => t.has(s)) && !t.has(this.options.panelUrl ?? "");
  }
  async _setOnlyThis(t) {
    const e = { ...this._sidebar ?? {} };
    e.hiddenPanels = t ? this._others : [];
    try {
      await this.hass.callWS({ type: "frontend/set_user_data", key: "sidebar", value: e }), this._sidebar = e;
    } catch (s) {
      this._err = s?.message ?? String(s);
    }
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
                ${Zh.map(
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
        ${!s && e.panelUrl && this._userMain !== void 0 ? d`<section>
              <h3>${r(t, "dash_main")}</h3>
              <div class="list">
                ${this._userMain !== null ? d`<button class="li" role="switch" aria-checked=${this._userMain?.default_panel === e.panelUrl}
                      @click=${() => this._setMain("user", this._userMain?.default_panel !== e.panelUrl)}>
                      <span class="nm">${r(t, "dash_main_me")}<small>${r(t, "dash_main_me_sub")}</small></span>
                      <span class="tog ${this._userMain?.default_panel === e.panelUrl ? "on" : ""}"></span>
                    </button>` : f}
                ${e.admin && this._sysMain ? d`<button class="li" role="switch" aria-checked=${this._sysMain?.default_panel === e.panelUrl}
                      @click=${() => this._setMain("system", this._sysMain?.default_panel !== e.panelUrl)}>
                      <span class="nm">${r(t, "dash_main_all")}<small>${r(t, "dash_main_all_sub")}</small></span>
                      <span class="tog ${this._sysMain?.default_panel === e.panelUrl ? "on" : ""}"></span>
                    </button>` : f}
                ${this._sidebar !== null && this._sidebar !== void 0 ? d`<button class="li" role="switch" aria-checked=${this._onlyThis} @click=${() => this._setOnlyThis(!this._onlyThis)}>
                      <span class="nm">${r(t, "dash_only")}<small>${r(t, "dash_only_sub")}</small></span>
                      <span class="tog ${this._onlyThis ? "on" : ""}"></span>
                    </button>` : f}
              </div>
              <p class="note">${r(t, "dash_main_note")}</p>
            </section>` : f}
        ${this._err ? d`<p class="err">${this._err}</p>` : f}
        ${!s && e.onDelete && i ? d`<button class="remove" @click=${() => vs(t, {
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
X.styles = [
  D.styles,
  E`
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
et([
  $({ attribute: !1 })
], X.prototype, "options", 2);
et([
  w()
], X.prototype, "_title", 2);
et([
  w()
], X.prototype, "_icon", 2);
et([
  w()
], X.prototype, "_admin", 2);
et([
  w()
], X.prototype, "_favOn", 2);
et([
  w()
], X.prototype, "_rows", 2);
et([
  w()
], X.prototype, "_busy", 2);
et([
  w()
], X.prototype, "_err", 2);
et([
  w()
], X.prototype, "_userMain", 2);
et([
  w()
], X.prototype, "_sysMain", 2);
et([
  w()
], X.prototype, "_sidebar", 2);
X = et([
  j("terral-dashboard-sheet")
], X);
function Ja(t, e) {
  document.querySelector("terral-dashboard-sheet")?.remove();
  const s = document.createElement("terral-dashboard-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
var Jh = Object.defineProperty, tp = Object.getOwnPropertyDescriptor, Di = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? tp(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && Jh(e, s, n), n;
};
function ep(t, e) {
  const s = t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30) || "pagina";
  let i = s;
  for (let n = 2; e.includes(i); n++) i = `${s}-${n}`;
  return i;
}
let Le = class extends D {
  constructor() {
    super(...arguments), this._title = "";
  }
  connectedCallback() {
    super.connectedCallback(), this._title = this.options.title;
  }
  get heading() {
    return r(this.hass, this.options.mode === "create" ? "page_new" : "page_settings");
  }
  _save() {
    const t = this._title.trim();
    if (!t && !this.options.first) {
      this._err = r(this.hass, "dash_name_needed");
      return;
    }
    this.options.onSave(t), this.close();
  }
  renderContent() {
    const t = this.hass, e = this.options, s = e.mode === "edit";
    return d`
      <div class="scroll">
        <section>
          <h3>${r(t, "general")}</h3>
          <div class="list">
            <label class="li">
              <span class="nm">${r(t, "name_label")}</span>
              <input class="txt" maxlength="30" .value=${this._title} placeholder=${e.first ? r(t, "page_home") : r(t, "page_name_ph")}
                @input=${(i) => {
      this._title = i.target.value, this._err = void 0;
    }}
                @keydown=${(i) => i.key === "Enter" && this._save()} />
            </label>
            ${s && !e.first && e.index && e.count ? d`<div class="li">
                  <span class="nm">${r(t, "page_position")}<small>${r(t, "page_pos_of", { n: e.index, m: e.count })}</small></span>
                  <span class="seg">
                    <button ?disabled=${e.index <= 2} @click=${() => e.onMove?.(-1)}>${r(t, "page_before")}</button>
                    <button ?disabled=${e.index >= e.count} @click=${() => e.onMove?.(1)}>${r(t, "page_after")}</button>
                  </span>
                </div>` : f}
          </div>
          ${this._err ? d`<p class="err">${this._err}</p>` : f}
        </section>
        ${s && e.address ? d`<section>
              <h3>${r(t, "page_address")}</h3>
              <div class="list"><div class="li"><span class="nm">${e.address}<small>${r(t, "page_address_sub")}</small></span></div></div>
            </section>` : f}
        ${s && !e.first && e.onDelete ? d`<button class="remove" @click=${() => {
      const i = this._title || e.title, n = (a) => {
        this.close(), e.onDelete?.(a);
      };
      if (!e.cards) {
        n(!1);
        return;
      }
      vs(t, {
        heading: r(t, "page_delete_q", { name: i }),
        message: r(t, "page_delete_msg", { n: e.cards }),
        actions: [
          { label: r(t, "page_keep", { home: e.homeTitle }), sub: r(t, "page_keep_sub"), run: () => n(!0) },
          { label: r(t, "page_remove_all"), danger: !0, run: () => n(!1) }
        ]
      });
    }}>${r(t, "page_delete")}</button>` : f}
      </div>
      <button class="cta" @click=${() => this._save()}>${r(t, s ? "save" : "page_create")}</button>
    `;
  }
};
Le.styles = [
  D.styles,
  E`
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
      }
      .li + .li {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nm {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .nm small {
        font-size: 12px;
        font-weight: 400;
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
        padding: 0 12px;
        border-radius: 15px;
        font-size: 13.5px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.12);
      }
      .seg button:disabled {
        opacity: 0.35;
      }
      .err {
        margin: 8px 4px 0;
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
    `
];
Di([
  $({ attribute: !1 })
], Le.prototype, "options", 2);
Di([
  w()
], Le.prototype, "_title", 2);
Di([
  w()
], Le.prototype, "_err", 2);
Le = Di([
  j("terral-page-sheet")
], Le);
function to(t, e) {
  document.querySelector("terral-page-sheet")?.remove();
  const s = document.createElement("terral-page-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const sp = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function ip(t) {
  return sp[t];
}
var np = Object.defineProperty, ap = Object.getOwnPropertyDescriptor, la = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ap(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && np(e, s, n), n;
};
const op = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>`, rp = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M5 4v12M19 4v12M5 8h14M5 12h14M5 16h14M12 16v4"></path></svg>`, lp = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"></path><path d="M12 18l4-6"></path></svg>`, cp = [
  { type: "light", name: "type_light", desc: "type_light_desc", icon: () => it(!0, 20), color: "#ffb020" },
  { type: "alarm", name: "type_alarm", desc: "type_alarm_desc", icon: () => yi(20), color: "rgba(255,255,255,.18)" },
  { type: "charger", name: "ev_charger", desc: "type_charger_desc", icon: () => vi(20), color: "#34c77b" },
  { type: "climate", name: "type_climate", desc: "type_climate_desc", icon: () => op(), color: "#4696ff" },
  { type: "weather", name: "type_weather", desc: "type_weather_desc", icon: () => _t("partlycloudy", 26), color: "linear-gradient(180deg,#3a8ee6,#7cc0f5)" },
  { type: "vacuum", name: "type_vacuum", desc: "type_vacuum_desc", icon: () => xs(21), color: "#22a587" },
  { type: "switch", name: "type_switch", desc: "type_switch_desc", icon: () => gt("plug", !0, 20), color: "#ff7a2f" },
  { type: "energy", name: "type_energy", desc: "type_energy_desc", icon: () => J("bolt", 20), color: "#ffb020" },
  { type: "contact", name: "type_contact", desc: "type_contact_desc", icon: () => zt("balcony", !1, 20), color: "#ff7a2f" }
], dp = [
  { name: "type_cover", icon: () => rp() },
  { name: "type_sensor", icon: () => lp() }
];
let Ts = class extends D {
  constructor() {
    super(...arguments), this._q = "";
  }
  get heading() {
    return r(this.hass, "add_card");
  }
  renderContent() {
    const t = this._q.trim().toLowerCase(), e = (a, o) => !t || r(this.hass, a).toLowerCase().includes(t) || o && r(this.hass, o).toLowerCase().includes(t), s = cp.filter((a) => e(a.name, a.desc)), i = (a) => a === "alarm" && !Object.keys(this.hass.states).some((o) => o.startsWith("alarm_control_panel.")) ? "alarm_missing" : a === "climate" && !Object.keys(this.hass.states).some((o) => o.startsWith("climate.")) ? "climate_missing" : a === "weather" && !Object.keys(this.hass.states).some((o) => o.startsWith("weather.")) ? "weather_missing" : a === "vacuum" && !Object.keys(this.hass.states).some((o) => o.startsWith("vacuum.")) ? "vacuum_missing" : a === "switch" && !Object.keys(this.hass.states).some((o) => o.startsWith("switch.") || o.startsWith("input_boolean.")) ? "switch_missing" : a === "energy" && !Object.keys(this.hass.states).some((o) => sr(this.hass, o)) ? "energy_missing" : a === "contact" && !Object.keys(this.hass.states).some((o) => _e(this.hass, o)) ? "contact_missing" : void 0, n = dp.filter((a) => e(a.name));
    return d`
      <label class="search">
        ${uo()}
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
                    ${o ? f : d`<span class="chev">${_s(!1, 16)}</span>`}
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
Ts.styles = [
  D.styles,
  E`
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
la([
  $({ attribute: !1 })
], Ts.prototype, "onType", 2);
la([
  w()
], Ts.prototype, "_q", 2);
Ts = la([
  j("terral-add-sheet")
], Ts);
function hp(t, e) {
  const s = document.createElement("terral-add-sheet");
  return s.hass = t, s.onType = e, document.body.appendChild(s), s;
}
var pp = Object.defineProperty, up = Object.getOwnPropertyDescriptor, ca = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? up(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && pp(e, s, n), n;
};
let Ds = class extends D {
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
          <span class="ic">${cl()}</span><span class="nm">${r(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${pl()}</span>
          <span class="nm">${r(this.hass, "by_rooms")}<small>${r(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onDashboard?.();
    }}>
          <span class="ic">${Q()}</span>
          <span class="nm">${r(this.hass, "dash_settings")}<small>${r(this.hass, "dash_settings_sub")}</small></span>
        </button>
        ${this.actions.onNewDashboard ? d`<button class="row" @click=${() => {
      this.close(), this.actions.onNewDashboard?.();
    }}>
              <span class="ic">${St(20)}</span>
              <span class="nm">${r(this.hass, "dash_new")}<small>${r(this.hass, "dash_new_sub")}</small></span>
            </button>` : ""}
        <button class="row" disabled>
          <span class="ic">${Q()}</span>
          <span class="nm">${r(this.hass, "terral_settings")}<small>${r(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
Ds.styles = [
  D.styles,
  E`
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
ca([
  $({ attribute: !1 })
], Ds.prototype, "actions", 2);
ca([
  $()
], Ds.prototype, "version", 2);
Ds = ca([
  j("terral-menu-sheet")
], Ds);
function gp(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const Or = "0.17.1";
var fp = Object.defineProperty, _p = Object.getOwnPropertyDescriptor, H = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? _p(e, s) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (n = (i ? o(e, s, n) : o(n)) || n);
  return i && n && fp(e, s, n), n;
};
const at = "top", eo = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], mp = 0.85, $t = 2, bp = 160, xp = 184, yp = 10, ss = 22, so = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate",
  weather: "terral-home-weather",
  vacuum: "terral-home-vacuum",
  switch: "terral-home-switch",
  energy: "terral-home-energy",
  contact: "terral-home-contact"
}, vp = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing", "forecast_2x2", "animate", "show_details", "forecast_days", "routines", "icon", "color", "style", "sum_only", "consumers", "rest", "view", "animate", "kind", "positions", "show_temp", "show_battery", "group"], We = "#3a4f80", Fs = "58,79,128", wp = `linear-gradient(180deg, ${We} 0, rgba(${Fs},.6) 36px, rgba(${Fs},0) 120px), linear-gradient(0deg, ${We} 0, rgba(${Fs},.6) 28px, rgba(${Fs},0) 96px), `, Ji = We, $p = We, tn = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let N = class extends B {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._lanes = 1, this._laneW = 358, this._pad = 16, this._strip = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config, terral-section-sheet, terral-dashboard-sheet, terral-page-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || hp(this.hass, (t) => {
        hr(this.hass, Jc(t), {
          mode: "add",
          onBack: () => this._add(),
          onSave: (e) => {
            const s = { id: tn(), type: e.type, ...e.config, w: e.w, h: e.h };
            this._update((i) => i.cards.push(s));
          }
        });
      });
    }, this._menu = () => {
      if (!this.hass) return;
      const t = this.hass.user?.is_admin !== !1;
      gp(this.hass, this.panel?.config?.version ?? Or, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms(),
        onDashboard: () => this._dashboardSettings(),
        onNewDashboard: t ? () => this._newDashboard() : void 0
      });
    }, this._addSection = () => {
      const t = tn();
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
            for (const c of vp)
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
      this._endDrag(), !(!t || !e) && (t.kind === "card" && s?.page != null ? this._moveCardToPage(t.id, s.page) : t.kind === "card" && s && this._moveCard(t.id, s.key, s.targetId), t.kind === "section" && i != null && this._moveSection(t.id, i));
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
    if (t.has("panel") && this._dashLoaded && this._dashLoaded !== this._dash && (this._unsub?.then((i) => i()).catch(() => {
    }), this._unsub = void 0, this._layout = void 0, this._loading = !1, this._edit = !1, this._els.clear()), (t.has("hass") || t.has("panel")) && this.hass) {
      !this._layout && !this._loading && this._load();
      for (const i of this._els.values()) i.hass = this.hass;
      td(this.hass);
    }
    const e = this.renderRoot.querySelector(".grid.strip");
    e?.classList.toggle("more", e.scrollWidth - e.scrollLeft - e.clientWidth > 4), e && !e.dataset.watch && (e.dataset.watch = "1", e.addEventListener("scroll", () => e.classList.toggle("more", e.scrollWidth - e.scrollLeft - e.clientWidth > 4), { passive: !0 }));
    const s = this.renderRoot.querySelector(".pills");
    if (s) {
      const i = () => {
        const n = s.scrollLeft > 4, a = s.scrollWidth - s.scrollLeft - s.clientWidth > 4;
        s.style.setProperty("--l", n ? "40px" : "0px"), s.style.setProperty("--r", a ? "56px" : "0px");
      };
      i(), s.dataset.watch || (s.dataset.watch = "1", s.addEventListener("scroll", i, { passive: !0 }), new ResizeObserver(i).observe(s));
    }
    if (t.has("_renaming") && this._renaming) {
      const i = this.renderRoot.querySelector("input.rename");
      i?.focus(), i?.select();
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
      [s, "background", We],
      [i, "background", We],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", Ji],
      [i, "--app-theme-color", Ji],
      [i, "--primary-background-color", $p]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: n.map(([a, o]) => [a, o, a.style.getPropertyValue(o), a.style.getPropertyPriority(o)])
      };
      for (const [a, o, l] of n) a.style.setProperty(o, l);
      e && (e.content = Ji), this._themeUpdate();
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
  /** Apply a change to a copy of the page shown (cards and sections) and save the layout. */
  _update(t) {
    const e = this._pageId;
    this._updateRoot((s) => {
      const i = e ? s.pages.find((n) => n.id === e) : s;
      i && (i.cards ??= [], i.sections ??= [], t(i));
    });
  }
  /** Apply a change to a copy of the whole layout (pages, favourites…) and save it. */
  _updateRoot(t) {
    const e = structuredClone(this._layout ?? { cards: [] });
    e.cards ??= [], e.sections ??= [], t(e), this._save(e);
  }
  // ---- Pages: the first page is the layout itself, the rest are in layout.pages.
  get _pages() {
    return this._layout?.pages ?? [];
  }
  /** Page shown: the first segment of the route, if it is one of the pages ("" = first page). */
  get _pageId() {
    const t = (this.route?.path ?? "").split("/").filter(Boolean)[0] ?? "";
    return this._pages.some((e) => e.id === t) ? t : "";
  }
  get _page() {
    const t = this._pageId;
    return t && this._pages.find((e) => e.id === t) || this._layout || { cards: [] };
  }
  get _homeTitle() {
    return this._layout?.page_title || r(this.hass, "page_home");
  }
  /** URL of this panel ("/terral-home", "/terral-home-cocina"…). */
  get _prefix() {
    return this.route?.prefix || `/${location.pathname.split("/")[1] ?? "terral-home"}`;
  }
  _goPage(t) {
    Zi(t ? `${this._prefix}/${t}` : this._prefix);
  }
  get _top() {
    return this._page.cards ?? [];
  }
  get _sections() {
    return this._page.sections ?? [];
  }
  get _allCards() {
    return [...this._top, ...this._sections.flatMap((t) => t.cards)];
  }
  static _list(t, e) {
    return e === at ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: at, card: e };
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
    const e = t < 600 ? 16 : 24, s = yp, i = t - 2 * e, n = $t * bp + ($t - 1) * s, a = Math.max(1, Math.floor((i + ss) / (n + ss))), o = (i - (a - 1) * ss) / a, l = Math.min(xp, (o - ($t - 1) * s) / $t), c = window.__terralRowRatio ?? mp, h = Math.max(48, Math.round((l - s) / 2 * c));
    this._colW = l, this._gap = s;
    const u = Math.round($t * l + ($t - 1) * s);
    $t !== this._cols && (this._cols = $t), h !== this._rowH && (this._rowH = h), a !== this._lanes && (this._lanes = a), u !== this._laneW && (this._laneW = u), e !== this._pad && (this._pad = e);
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
          for (let h = l; h < l + o; h++) for (let u = c; u < c + a; u++) (e[h] ??= [])[u] = !0;
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
    return t === at && this._strip > 0;
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t, e = !1) {
    return e && this._strip === 1 ? !1 : (this._els.get(t.id)?.getTerralSizes?.() ?? eo).filter((i) => i.w <= this._cols && (!e || i.h <= this._strip)).length > 1;
  }
  _element(t, e) {
    let s = this._els.get(t.id);
    s || (s = document.createElement(so[t.type] ?? "terral-home-light"), this._els.set(t.id, s));
    const { id: i, type: n, w: a, h: o, ...l } = t, { w: c, h } = e ?? { w: a, h: o }, u = { ...l, type: `custom:${so[t.type] ?? "terral-home-light"}`, view_layout: { terral: { w: c, h } } }, p = JSON.stringify(u);
    if (s.dataset.cfg !== p) {
      try {
        s.setConfig(u);
      } catch (_) {
        console.warn("Terral Home:", _);
      }
      s.dataset.cfg = p;
    }
    return this.hass && s.hass !== this.hass && (s.hass = this.hass), s;
  }
  // ---- Pages ----------------------------------------------------------------
  /** Page pills under the title: shown with 2+ pages, or in move mode (to add one). */
  _pills(t) {
    const e = this._pages;
    if (!this._layout || !e.length && !t) return f;
    const s = this._pageId, i = this._drag?.kind === "card" ? this._dropCard?.page : void 0, n = (a, o) => {
      const l = a === s;
      return d`<button
        class="pg ${l ? "on" : ""} ${i === a && !l ? "drop" : ""}"
        data-page=${a}
        aria-current=${l ? "page" : "false"}
        @click=${() => l ? t && this._pageSettings() : this._goPage(a)}
      >${o}${l && t ? d`<span class="pgear" aria-label=${r(this.hass, "page_settings")}>${Q(15)}</span>` : f}</button>`;
    };
    return d`<nav class="pills" aria-label=${r(this.hass, "pages")}>
      ${n("", this._homeTitle)}
      ${e.map((a) => n(a.id, a.title))}
      ${t ? d`<button class="pg add" aria-label=${r(this.hass, "page_add")} title=${r(this.hass, "page_add")} @click=${() => this._addPage()}>${St(18)}</button>` : f}
    </nav>`;
  }
  _addPage() {
    this.hass && to(this.hass, {
      mode: "create",
      title: "",
      first: !1,
      homeTitle: this._homeTitle,
      onSave: (t) => {
        const e = ep(t, this._pages.map((s) => s.id));
        this._updateRoot((s) => {
          s.pages = [...s.pages ?? [], { id: e, title: t, cards: [], sections: [] }];
        }), this._goPage(e);
      }
    });
  }
  _pageSettings() {
    if (!this.hass) return;
    const t = this._pageId, e = this._pages, s = e.findIndex((a) => a.id === t), i = s >= 0 ? e[s] : void 0, n = (i?.cards?.length ?? 0) + (i?.sections ?? []).reduce((a, o) => a + o.cards.length, 0);
    to(this.hass, {
      mode: "edit",
      title: i ? i.title : this._layout?.page_title ?? "",
      first: !i,
      index: s + 2,
      count: e.length + 1,
      address: i ? `${this._prefix}/${i.id}` : this._prefix,
      cards: n,
      homeTitle: this._homeTitle,
      onSave: (a) => this._updateRoot((o) => {
        if (!i) {
          a ? o.page_title = a : delete o.page_title;
          return;
        }
        const l = o.pages.find((c) => c.id === t);
        l && a && (l.title = a);
      }),
      onMove: (a) => {
        this._updateRoot((o) => {
          const l = o.pages, c = l.findIndex((u) => u.id === t), h = c + a;
          c < 0 || h < 0 || h >= l.length || ([l[c], l[h]] = [l[h], l[c]]);
        }), document.querySelector("terral-page-sheet")?.close();
      },
      onDelete: (a) => {
        this._updateRoot((o) => {
          const l = o.pages, c = l.findIndex((u) => u.id === t);
          if (c < 0) return;
          const [h] = l.splice(c, 1);
          a ? (o.cards.push(...h.cards ?? []), o.sections.push(...h.sections ?? [])) : [...h.cards ?? [], ...(h.sections ?? []).flatMap((u) => u.cards)].forEach((u) => this._els.delete(u.id)), l.length || delete o.pages;
        }), this._goPage("");
      }
    });
  }
  /** Move a card to the favourites of another page (dropped on its pill). */
  _moveCardToPage(t, e) {
    const s = this._findCard(t), i = this._pageId;
    !s || e === i || this._updateRoot((n) => {
      const a = (p) => p ? n.pages.find((_) => _.id === p) : n, o = a(i), l = a(e);
      if (!o || !l) return;
      const c = s.key === at ? o.cards : (o.sections ?? []).find((p) => p.id === s.key)?.cards, h = c?.findIndex((p) => p.id === t) ?? -1;
      if (!c || h < 0) return;
      const [u] = c.splice(h, 1);
      (l.cards ??= []).push(u);
    });
  }
  // ---- Dashboards -----------------------------------------------------------
  async _dashboardSettings() {
    const t = this.hass;
    if (!t) return;
    const s = (await t.callWS({ type: "terral_home/dashboards/list" }).catch(() => [])).find((i) => i.id === this._dash) ?? { id: this._dash };
    Ja(t, {
      mode: "edit",
      info: s,
      panelUrl: this._prefix.replace(/^\//, ""),
      favorites: this._favorites,
      admin: t.user?.is_admin !== !1,
      onSave: async ({ title: i, icon: n, require_admin: a, favorites: o }) => {
        const l = this._favorites;
        (o.enabled !== l.enabled || o.rows !== l.rows) && this._updateRoot((c) => {
          const h = {};
          o.enabled || (h.enabled = !1), o.rows === 1 && (h.rows = 1), Object.keys(h).length ? c.favorites = h : delete c.favorites;
        }), ((i ?? "") !== (s.title ?? "") || (n ?? "") !== (s.icon ?? "") || !!a != !!s.require_admin) && (await t.callWS({ type: "terral_home/dashboards/update", dashboard: this._dash, title: i || null, icon: n || null, require_admin: !!a }), this._titleOverride = i || void 0);
      },
      onDelete: this._dash === "home" ? void 0 : async () => {
        await t.callWS({ type: "terral_home/dashboards/delete", dashboard: this._dash }), Zi("/terral-home");
      }
    });
  }
  _newDashboard() {
    const t = this.hass;
    t && Ja(t, {
      mode: "create",
      info: { id: "" },
      favorites: { enabled: !0, rows: 2 },
      admin: !0,
      onSave: async ({ title: e, icon: s }) => {
        const i = await t.callWS({ type: "terral_home/dashboards/create", title: e, icon: s });
        window.setTimeout(() => Zi(`/terral-home-${i.id}`), 300);
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
    vs(this.hass, {
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
    this.hass && vs(this.hass, {
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
          const c = Gs(t, l.entity);
          c && (n.push([l, c]), o.splice(o.indexOf(l), 1));
        }
      const a = [...new Set(n.map(([, o]) => o))].filter((o) => !s.has(o.toLowerCase())).sort((o, l) => o.localeCompare(l));
      for (const o of a) {
        const l = { id: tn(), title: o, cards: [] };
        e.sections.push(l), s.set(o.toLowerCase(), l);
      }
      for (const [o, l] of n) s.get(l.toLowerCase()).cards.push(o);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), n = this._findCard(e.id)?.key === at && this._strip > 0, a = (this._els.get(e.id)?.getTerralSizes?.() ?? eo).filter((l) => l.w <= this._cols && (!n || l.h <= this._strip));
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
      const n = N._list(i, e.key)?.find((a) => a.id === t.id);
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
    const s = this.shadowRoot?.elementsFromPoint(t, e) ?? [], i = s.find((o) => o.dataset?.page != null);
    if (i) {
      this._dropCard = { key: at, page: i.dataset.page };
      return;
    }
    const n = s.find((o) => o.dataset?.cid != null && o.dataset.cid !== this._drag?.id);
    if (n) {
      this._dropCard = { key: n.dataset.key, targetId: n.dataset.cid };
      return;
    }
    const a = s.find((o) => o.dataset?.zone != null);
    a && (this._dropCard = { key: a.dataset.zone });
  }
  /** Section drop target: the lane under the finger, then before the first section whose middle is below it. */
  _hitSection(t, e) {
    const s = this._drag?.id, i = this._sections.filter((h) => h.id !== s).map((h) => h.id), n = [...this.renderRoot.querySelectorAll(".lane")];
    if (!n.length) return;
    const a = (h) => {
      const u = h.getBoundingClientRect();
      return Math.abs(t - (u.left + u.width / 2));
    }, o = n.reduce((h, u) => a(u) < a(h) ? u : h), l = [...o.querySelectorAll("section[data-sid]")].filter((h) => h.dataset.sid !== s), c = l.find((h) => {
      const u = h.getBoundingClientRect();
      return u.top + u.height / 2 > e;
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
      const a = N._list(n, i.key), o = a.findIndex((_) => _.id === t), l = s ? a.findIndex((_) => _.id === s) : -1, [c] = a.splice(o, 1), h = N._list(n, e);
      if (!h) {
        a.splice(o, 0, c);
        return;
      }
      if (!s) {
        h.push(c);
        return;
      }
      const u = h.findIndex((_) => _.id === s), p = i.key === e && l > o;
      h.splice(u < 0 ? h.length : u + (p ? 1 : 0), 0, c);
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
    const u = [];
    l && !h && u.push({ item: { kind: "top" }, rows: Math.max(this._rowsOf(s), n || t && !i.length ? 2 : 1), titled: !1 });
    for (const m of i) (t || m.cards.length) && u.push({ item: { kind: "sec", s: m }, rows: this._rowsOf(m.cards), titled: !0 });
    const p = this._assignLanes(u), _ = this._dropMark, b = d`<div class="dropline"></div>`, g = this._lanes * this._laneW + (this._lanes - 1) * ss;
    return d`
      <div class="scroller" style="background:${wp}${ip("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${t ? "editing" : ""}" style="max-width:${g + 2 * this._pad}px">
          <div class="top">
            <button class="glass round" aria-label=${r(this.hass, "menu")} @click=${() => Uh(this, "hass-toggle-menu")}>
              ${ll()}
            </button>
            <span class="spacer"></span>
            ${t ? d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} @click=${this._add}>${St(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${r(this.hass, "done")}</button>
                </div>` : d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${St(22)}</button>
                  <button class="pbtn" aria-label=${r(this.hass, "more_options")} @click=${this._menu}>${dl(22)}</button>
                </div>`}
          </div>
          <h1>${this._title}</h1>
          ${this._pills(t)}
          ${this._error ? d`<p class="notice">${r(this.hass, "panel_error")} (${this._error})</p>` : f}
          ${h ? d`<div class="favs">${this._grid(at, s, t, !1, s.length === 0 && t ? r(this.hass, "fav_drop") : void 0)}</div>` : f}
          <div class="lanes" style="--lane-gap:${ss}px">
            ${p.map(
      (m, y) => d`<div class="lane" style="width:${this._laneW}px">
                ${Za(
        m,
        (v) => v.kind === "top" ? at : v.s.id,
        (v) => {
          if (v.kind === "top")
            return d`<div class="topblock">${this._grid(at, s, t, n || t && !i.length, s.length === 0 && t ? r(this.hass, "no_section") : void 0)}</div>`;
          const k = v.s, C = o && this._drag?.id === k.id, S = o && !C && _?.sid === k.id;
          return d`${S && !_?.after ? b : f}${this._section(k, t, C)}${S && _?.after ? b : f}`;
        }
      )}
                ${o && _?.lane === y ? b : f}
              </div>`
    )}
          </div>
          ${t && e ? d`<button class="addsec" @click=${this._addSection}>${St(20)}<span>${r(this.hass, "add_section")}</span></button>` : f}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, n = s ? `translate:${this._dragDx}px ${this._dragDy}px` : "";
    return d`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${n}>
      <header>
        ${e ? d`<button class="sdel" aria-label=${r(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${$a()}</button>` : f}
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
        ${e ? d`<button class="sgear" aria-label=${r(this.hass, "section_settings")} @click=${() => this._sectionSettings(t)}>${Q(18)}</button>` : this._quickButtons(t)}
        ${e ? d`<button
              class="handle"
              aria-label=${r(this.hass, "move_section")}
              @pointerdown=${(a) => this._handleDown(a, t.id)}
            >${hl()}</button>` : f}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? r(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  /** Quick actions on the right of a section title (hidden in move mode). */
  _quickButtons(t) {
    const e = this.hass;
    if (!e) return f;
    const s = Dr(t).map((i) => ({ k: i, ...ra(e, i, t.cards) })).filter((i) => i.ids.length);
    return s.length ? d`<div class="quick">
      ${s.map(
      (i) => d`<button
          class="qb ${i.on ? "on" : ""} ${i.k}"
          aria-label=${r(e, i.k === "lights" ? i.on ? "quick_lights_off" : "quick_lights_on" : i.on ? "quick_climate_off" : "quick_climate_on")}
          @click=${() => Vh(e, i.k, t.cards)}
        >${i.k === "lights" ? it(i.on > 0, 21) : bs(20)}${i.on ? d`<span class="n">${i.on}</span>` : f}</button>`
    )}
    </div>` : f;
  }
  _sectionSettings(t) {
    this.hass && Xh(
      this.hass,
      t,
      ({ title: e, quick: s }) => this._update((i) => {
        const n = i.sections.find((a) => a.id === t.id);
        n && (n.title = e, s.length === An.length && s.every((a) => An.includes(a)) ? delete n.quick : n.quick = s);
      }),
      () => this._removeSection(t.id)
    );
  }
  _grid(t, e, s, i, n) {
    const a = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId && this._dropCard.page == null, o = this._inStrip(t), l = o ? `grid-auto-flow:column dense;grid-template-rows:repeat(${this._strip},${this._rowH}px);grid-auto-columns:${this._colW}px;gap:${this._gap}px` : `grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px;gap:${this._gap}px`;
    return d`<div
      class="grid ${a ? "zone-target" : ""} ${t === at ? "top-grid" : ""} ${o ? "strip" : ""}"
      data-zone=${t}
      style=${l}
    >
      ${Za(e, (c) => c.id, (c, h) => this._cell(t, c, h, s))}
      ${n && !e.length ? d`<div class="placeholder" style=${o ? `grid-row:1/-1;width:${this._laneW}px` : "grid-column:1/-1"}>${n}</div>` : f}
      ${i ? d`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${St(26)}</span><span>${r(this.hass, "add_accessory")}</span>
          </button>` : f}
    </div>`;
  }
  _cell(t, e, s, i) {
    const n = this._sizeOf(e, this._inStrip(t)), { w: a, h: o } = n, l = this._drag?.kind === "card" && this._drag.id === e.id, c = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, h = `grid-column:span ${a};grid-row:span ${o};--d:${s % 5 * -0.07}s;${l ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return d`<div class="cell ${l ? "dragging" : ""} ${c ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${h}>
      ${this._element(e, n)}
      ${i ? d`<div class="overlay" @pointerdown=${(u) => this._overlayDown(u, e.id)}>
            <button class="del" aria-label=${r(this.hass, "delete")} @click=${() => this._remove(e.id)}>${$a()}</button>
            ${this._canResize(e, this._inStrip(t)) ? d`<button
              class="corner"
              aria-label=${r(this.hass, "resize")}
              @pointerdown=${(u) => this._resizeDown(u, e)}
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
N.styles = E`
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
      /* --l / --r are set from the scroll position: a fade only where pills are hidden */
      --l: 0px;
      --r: 0px;
      -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 var(--l), #000 calc(100% - var(--r)), transparent 100%);
      mask-image: linear-gradient(90deg, transparent 0, #000 var(--l), #000 calc(100% - var(--r)), transparent 100%);
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
      width: 36px;
      min-width: 36px;
      padding: 0;
      display: block;
      position: relative;
      flex: none;
      box-sizing: border-box;
      -webkit-appearance: none;
      appearance: none;
      text-indent: 0;
      line-height: 0;
    }
    .pg.add svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: block;
      margin: 0;
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
H([
  $({ attribute: !1 })
], N.prototype, "hass", 2);
H([
  $({ type: Boolean })
], N.prototype, "narrow", 2);
H([
  $({ attribute: !1 })
], N.prototype, "route", 2);
H([
  $({ attribute: !1 })
], N.prototype, "panel", 2);
H([
  w()
], N.prototype, "_layout", 2);
H([
  w()
], N.prototype, "_error", 2);
H([
  w()
], N.prototype, "_edit", 2);
H([
  w()
], N.prototype, "_cols", 2);
H([
  w()
], N.prototype, "_rowH", 2);
H([
  w()
], N.prototype, "_drag", 2);
H([
  w()
], N.prototype, "_dropCard", 2);
H([
  w()
], N.prototype, "_dropSection", 2);
H([
  w()
], N.prototype, "_dragDx", 2);
H([
  w()
], N.prototype, "_dragDy", 2);
H([
  w()
], N.prototype, "_resize", 2);
H([
  w()
], N.prototype, "_renaming", 2);
H([
  w()
], N.prototype, "_lanes", 2);
H([
  w()
], N.prototype, "_laneW", 2);
H([
  w()
], N.prototype, "_pad", 2);
H([
  w()
], N.prototype, "_dropMark", 2);
H([
  w()
], N.prototype, "_titleOverride", 2);
N = H([
  j("terral-home-panel")
], N);
const U = window;
U.customCards = U.customCards || [];
U.customCards.some((t) => t.type === "terral-home-light") || U.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: e } } : null
});
U.customCards.some((t) => t.type === "terral-home-alarm") || U.customCards.push({
  type: "terral-home-alarm",
  name: "Terral · Alarma",
  description: "Alarma (Alarmo u otra) al estilo Terral Home / Terral Home alarm (Alarmo or any alarm panel)",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("alarm_control_panel.") ? { config: { type: "custom:terral-home-alarm", entity: e } } : null
});
U.customCards.some((t) => t.type === "terral-home-charger") || U.customCards.push({
  type: "terral-home-charger",
  name: "Terral · Cargador",
  description: "Cargador de coche eléctrico al estilo Terral Home / Terral Home EV charger",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
U.customCards.some((t) => t.type === "terral-home-climate") || U.customCards.push({
  type: "terral-home-climate",
  name: "Terral · Clima",
  description: "Aire acondicionado, calefacción o bomba de calor al estilo Terral Home / Terral Home climate",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
U.customCards.some((t) => t.type === "terral-home-weather") || U.customCards.push({
  type: "terral-home-weather",
  name: "Terral · Tiempo",
  description: "El tiempo y su previsión al estilo Terral Home / Terral Home weather and forecast",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
U.customCards.some((t) => t.type === "terral-home-vacuum") || U.customCards.push({
  type: "terral-home-vacuum",
  name: "Terral · Robot",
  description: "Robot aspirador / friegasuelos (Roborock y otros) al estilo Terral Home / Terral Home robot vacuum",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("vacuum.") ? { config: { type: "custom:terral-home-vacuum", entity: e } } : null
});
U.customCards.some((t) => t.type === "terral-home-switch") || U.customCards.push({
  type: "terral-home-switch",
  name: "Terral · Interruptor",
  description: "Termo, enchufe, matamosquitos… con icono y color a elegir, registro y consumo / Terral Home switch",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("switch.") || e.startsWith("input_boolean.") ? { config: { type: "custom:terral-home-switch", entity: e } } : null
});
U.customCards.some((t) => t.type === "terral-home-energy") || U.customCards.push({
  type: "terral-home-energy",
  name: "Terral · Energía",
  description: "Consumo de la casa repartido por consumidores, con animación / Terral Home energy flow",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
U.customCards.some((t) => t.type === "terral-home-contact") || U.customCards.push({
  type: "terral-home-contact",
  name: "Terral · Puertas y ventanas",
  description: "Sensor de puerta o ventana, o un grupo de ellos, con avisos / Terral Home door & window",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
console.info(
  `%c TERRAL HOME %c v${Or} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  Or as VERSION
};
