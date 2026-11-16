/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = globalThis, cs = fe.ShadowRoot && (fe.ShadyCSS === void 0 || fe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, hs = Symbol(), Ts = /* @__PURE__ */ new WeakMap();
let oi = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== hs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (cs && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = Ts.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ts.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const en = (t) => new oi(typeof t == "string" ? t : t + "", void 0, hs), A = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, n, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[a + 1], t[0]);
  return new oi(s, t, hs);
}, sn = (t, e) => {
  if (cs) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), n = fe.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, t.appendChild(i);
  }
}, Ds = cs ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return en(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: nn, defineProperty: an, getOwnPropertyDescriptor: rn, getOwnPropertyNames: on, getOwnPropertySymbols: ln, getPrototypeOf: cn } = Object, ze = globalThis, Os = ze.trustedTypes, hn = Os ? Os.emptyScript : "", dn = ze.reactiveElementPolyfillSupport, Ht = (t, e) => t, xe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? hn : null;
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
} }, ds = (t, e) => !nn(t, e), Ps = { attribute: !0, type: String, converter: xe, reflect: !1, useDefault: !1, hasChanged: ds };
Symbol.metadata ??= Symbol("metadata"), ze.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let gt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Ps) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, s);
      n !== void 0 && an(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: n, set: a } = rn(this.prototype, e) ?? { get() {
      return this[s];
    }, set(r) {
      this[s] = r;
    } };
    return { get: n, set(r) {
      const l = n?.call(this);
      a?.call(this, r), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ps;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ht("elementProperties"))) return;
    const e = cn(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ht("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ht("properties"))) {
      const s = this.properties, i = [...on(s), ...ln(s)];
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
      for (const n of i) s.unshift(Ds(n));
    } else e !== void 0 && s.push(Ds(e));
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
    return sn(e, this.constructor.elementStyles), e;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : xe).toAttribute(s, i.type);
      this._$Em = e, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : xe;
      this._$Em = n;
      const l = r.fromAttribute(s, a.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, n = !1, a) {
    if (e !== void 0) {
      const r = this.constructor;
      if (n === !1 && (a = this[e]), i ??= r.getPropertyOptions(e), !((i.hasChanged ?? ds)(a, s) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: n, wrapped: a }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? s ?? this[e]), a !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        const { wrapped: r } = a, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, a, l);
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
gt.elementStyles = [], gt.shadowRootOptions = { mode: "open" }, gt[Ht("elementProperties")] = /* @__PURE__ */ new Map(), gt[Ht("finalized")] = /* @__PURE__ */ new Map(), dn?.({ ReactiveElement: gt }), (ze.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ps = globalThis, js = (t) => t, ve = ps.trustedTypes, Ns = ve ? ve.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, li = "$lit$", Y = `lit$${Math.random().toFixed(9).slice(2)}$`, ci = "?" + Y, pn = `<${ci}>`, nt = document, Ft = () => nt.createComment(""), Yt = (t) => t === null || typeof t != "object" && typeof t != "function", us = Array.isArray, un = (t) => us(t) || typeof t?.[Symbol.iterator] == "function", Ie = `[ 	
\f\r]`, Ot = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ls = /-->/g, Is = />/g, Z = RegExp(`>|${Ie}(?:([^\\s"'>=/]+)(${Ie}*=${Ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Hs = /'/g, Rs = /"/g, hi = /^(?:script|style|textarea|title)$/i, di = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), h = di(1), x = di(2), at = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), Us = /* @__PURE__ */ new WeakMap(), et = nt.createTreeWalker(nt, 129);
function pi(t, e) {
  if (!us(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ns !== void 0 ? Ns.createHTML(e) : e;
}
const gn = (t, e) => {
  const s = t.length - 1, i = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Ot;
  for (let l = 0; l < s; l++) {
    const c = t[l];
    let d, u, p = -1, m = 0;
    for (; m < c.length && (r.lastIndex = m, u = r.exec(c), u !== null); ) m = r.lastIndex, r === Ot ? u[1] === "!--" ? r = Ls : u[1] !== void 0 ? r = Is : u[2] !== void 0 ? (hi.test(u[2]) && (n = RegExp("</" + u[2], "g")), r = Z) : u[3] !== void 0 && (r = Z) : r === Z ? u[0] === ">" ? (r = n ?? Ot, p = -1) : u[1] === void 0 ? p = -2 : (p = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? Z : u[3] === '"' ? Rs : Hs) : r === Rs || r === Hs ? r = Z : r === Ls || r === Is ? r = Ot : (r = Z, n = void 0);
    const _ = r === Z && t[l + 1].startsWith("/>") ? " " : "";
    a += r === Ot ? c + pn : p >= 0 ? (i.push(d), c.slice(0, p) + li + c.slice(p) + Y + _) : c + Y + (p === -2 ? l : _);
  }
  return [pi(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Vt {
  constructor({ strings: e, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let a = 0, r = 0;
    const l = e.length - 1, c = this.parts, [d, u] = gn(e, s);
    if (this.el = Vt.createElement(d, i), et.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = et.nextNode()) !== null && c.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(li)) {
          const m = u[r++], _ = n.getAttribute(p).split(Y), g = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: a, name: g[2], strings: _, ctor: g[1] === "." ? mn : g[1] === "?" ? _n : g[1] === "@" ? bn : Te }), n.removeAttribute(p);
        } else p.startsWith(Y) && (c.push({ type: 6, index: a }), n.removeAttribute(p));
        if (hi.test(n.tagName)) {
          const p = n.textContent.split(Y), m = p.length - 1;
          if (m > 0) {
            n.textContent = ve ? ve.emptyScript : "";
            for (let _ = 0; _ < m; _++) n.append(p[_], Ft()), et.nextNode(), c.push({ type: 2, index: ++a });
            n.append(p[m], Ft());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ci) c.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(Y, p + 1)) !== -1; ) c.push({ type: 7, index: a }), p += Y.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const i = nt.createElement("template");
    return i.innerHTML = e, i;
  }
}
function vt(t, e, s = t, i) {
  if (e === at) return e;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const a = Yt(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(t), n._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = n : s._$Cl = n), n !== void 0 && (e = vt(t, n._$AS(t, e.values), n, i)), e;
}
class fn {
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
    const { el: { content: s }, parts: i } = this._$AD, n = (e?.creationScope ?? nt).importNode(s, !0);
    et.currentNode = n;
    let a = et.nextNode(), r = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let d;
        c.type === 2 ? d = new Mt(a, a.nextSibling, this, e) : c.type === 1 ? d = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (d = new xn(a, this, e)), this._$AV.push(d), c = i[++l];
      }
      r !== c?.index && (a = et.nextNode(), r++);
    }
    return et.currentNode = nt, n;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Mt {
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
    e = vt(this, e, s), Yt(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== at && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : un(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && Yt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(nt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Vt.createElement(pi(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const a = new fn(n, this), r = a.u(this.options);
      a.p(s), this.T(r), this._$AH = a;
    }
  }
  _$AC(e) {
    let s = Us.get(e.strings);
    return s === void 0 && Us.set(e.strings, s = new Vt(e)), s;
  }
  k(e) {
    us(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const a of e) n === s.length ? s.push(i = new Mt(this.O(Ft()), this.O(Ft()), this, this.options)) : i = s[n], i._$AI(a), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = js(e).nextSibling;
      js(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Te {
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
    let r = !1;
    if (a === void 0) e = vt(this, e, s, 0), r = !Yt(e) || e !== this._$AH && e !== at, r && (this._$AH = e);
    else {
      const l = e;
      let c, d;
      for (e = a[0], c = 0; c < a.length - 1; c++) d = vt(this, l[i + c], s, c), d === at && (d = this._$AH[c]), r ||= !Yt(d) || d !== this._$AH[c], d === f ? e = f : e !== f && (e += (d ?? "") + a[c + 1]), this._$AH[c] = d;
    }
    r && !n && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class mn extends Te {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class _n extends Te {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class bn extends Te {
  constructor(e, s, i, n, a) {
    super(e, s, i, n, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = vt(this, e, s, 0) ?? f) === at) return;
    const i = this._$AH, n = e === f && i !== f || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== f && (i === f || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class xn {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    vt(this, e);
  }
}
const vn = { I: Mt }, yn = ps.litHtmlPolyfillSupport;
yn?.(Vt, Mt), (ps.litHtmlVersions ??= []).push("3.3.3");
const wn = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = s?.renderBefore ?? null;
    i._$litPart$ = n = new Mt(e.insertBefore(Ft(), a), a, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gs = globalThis;
let D = class extends gt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = wn(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return at;
  }
};
D._$litElement$ = !0, D.finalized = !0, gs.litElementHydrateSupport?.({ LitElement: D });
const $n = gs.litElementPolyfillSupport;
$n?.({ LitElement: D });
(gs.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kn = { attribute: !0, type: String, converter: xe, reflect: !1, hasChanged: ds }, Cn = (t = kn, e, s) => {
  const { kind: i, metadata: n } = s;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(s.name, t), i === "accessor") {
    const { name: r } = s;
    return { set(l) {
      const c = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(r, c, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, t, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = s;
    return function(l) {
      const c = this[r];
      e.call(this, l), this.requestUpdate(r, c, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function v(t) {
  return (e, s) => typeof s == "object" ? Cn(t, e, s) : ((i, n, a) => {
    const r = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, i), r ? Object.getOwnPropertyDescriptor(n, a) : void 0;
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
const Sn = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function An(t, e) {
  return (s, i, n) => {
    const a = (r) => r.renderRoot?.querySelector(t) ?? null;
    return Sn(s, i, { get() {
      return a(this);
    } });
  };
}
const Mn = {
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
  group_never: "Nunca"
}, En = {
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
  group_never: "Never"
};
function z(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function o(t, e, s) {
  let i = (z(t) === "es" ? Mn : En)[e] ?? e;
  if (s) for (const [n, a] of Object.entries(s)) i = i.replace(`{${n}}`, String(a));
  return i;
}
function ui(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return o(t, "just_now");
  if (s < 60) return o(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? o(t, "h_ago", { n: i }) : o(t, "days_ago", { n: Math.round(i / 24) });
}
const zn = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", I = (t, e = 24) => x`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${zn} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, gi = (t = 24) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, De = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, fi = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, ye = (t, e = 16) => x`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, Tn = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, ce = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, Dn = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, On = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, Ws = (t = 16) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, mi = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, me = (t = 18) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, ae = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, Pn = (t = 26) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, jn = (t = 20) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, w = (t, e, s = 2) => x`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, _i = x`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, Gt = (t = 24) => w(t, _i), bi = (t = 24) => w(t, x`${_i}<path d="M9 12l2 2 4-4"></path>`), Ke = (t = 24) => w(t, x`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), Nn = (t = 20) => w(t, x`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), Ln = (t = 20) => w(t, x`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), In = (t = 20) => w(t, x`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), Hn = (t = 20) => w(t, x`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), Rn = (t = 20) => w(t, x`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), Kt = (t = 20) => w(t, x`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), yt = (t = 20) => w(t, x`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), Un = (t = 24) => w(t, x`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), Wn = (t = 20) => w(t, x`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`), Xt = (t = 24) => w(t, x`<path d="M5 21V5.5A2.5 2.5 0 0 1 7.5 3h5A2.5 2.5 0 0 1 15 5.5V21"></path><path d="M3 21h14"></path><path d="M15 10h1.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8.5L19 6"></path><path d="M10.5 6.5L8.6 10h2.8l-1.9 3.5"></path>`, 1.9), Bn = (t = 18) => w(t, x`<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>`), Bs = (t = 19) => w(t, x`<rect x="3" y="7" width="16" height="10" rx="2.5"></rect><path d="M21 11v2"></path><path d="M7 10.5v3M10.5 10.5v3"></path>`), qn = (t = 19) => w(t, x`<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>`), Fn = (t = 20) => w(t, x`<path d="M15 6l-6 6 6 6"></path>`, 2.4), Yn = (t = 22) => w(t, x`<circle cx="12" cy="12" r="8.5"></circle><path d="M9 16l3-8 3 8M10 13.5h4"></path>`), Vn = (t = 22) => w(t, x`<path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11"></path><path d="M9.5 4L12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"></path>`), Gn = (t = 22) => w(t, x`<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-3 4-3 6-1-1-2-2-2.5-3.5C7.5 9.5 5 12 5 15a7 7 0 0 0 7 7z"></path>`), Kn = (t = 22) => w(t, x`<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path><path d="M9.5 15.5l5-5"></path>`), Xe = (t = 22) => w(t, x`<circle cx="12" cy="12" r="1.8"></circle><path d="M12 10.2C11 6 13 3 15.5 4.2S15 9 12 10.2zM13.8 12c4.2-1 7.2 1 6 3.5S15 15 13.8 12zM12 13.8c1 4.2-1 7.2-3.5 6S9 15 12 13.8zM10.2 12c-4.2 1-7.2-1-6-3.5S9 9 10.2 12z"></path>`), Xn = (t = 22) => w(t, x`<path d="M8 20V4M4.5 7.5L8 4l3.5 3.5"></path><path d="M16 4v16M12.5 16.5L16 20l3.5-3.5"></path>`), Qe = (t = 22) => w(t, x`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`), fs = (t = 20) => w(t, x`<path d="M6 12h12"></path>`, 2.4), ms = (t = 20) => w(t, x`<path d="M12 6v12M6 12h12"></path>`, 2.4);
var Qn = Object.defineProperty, Zn = Object.getOwnPropertyDescriptor, U = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Zn(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && Qn(e, s, n), n;
};
let O = class extends D {
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
    return h`
      ${e ? h`<div class="fill" style=${this.vertical ? `height:${t}%` : `width:${t}%`}></div>` : h`<div class="thumb" style=${this.vertical ? `bottom:${t}%` : `left:${t}%`}></div>`}
      <div class="label">
        <slot></slot>
        ${this.showValue ? h`<span>${this._shown}${this.suffix ? h`&nbsp;${this.suffix}` : f}</span>` : f}
      </div>
    `;
  }
};
O.styles = A`
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
U([
  v({ type: Number })
], O.prototype, "value", 2);
U([
  v({ type: Number })
], O.prototype, "min", 2);
U([
  v({ type: Number })
], O.prototype, "max", 2);
U([
  v({ type: Boolean, reflect: !0 })
], O.prototype, "vertical", 2);
U([
  v()
], O.prototype, "mode", 2);
U([
  v()
], O.prototype, "label", 2);
U([
  v()
], O.prototype, "suffix", 2);
U([
  v({ type: Boolean, attribute: "show-value" })
], O.prototype, "showValue", 2);
U([
  y()
], O.prototype, "_drag", 2);
O = U([
  M("terral-slider")
], O);
const xi = ["hs", "rgb", "rgbw", "rgbww", "xy"], _s = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], Ze = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function vi(t) {
  return t.attributes.supported_color_modes ?? [];
}
function _e(t) {
  const e = vi(t);
  return e.some((s) => xi.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Jn(t) {
  return vi(t).includes("color_temp");
}
function $(t) {
  return t?.state === "on";
}
function st(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function tt(t) {
  const e = t.attributes.brightness;
  if (!(!$(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function W(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function qs(t) {
  return W(t).length > 0;
}
function Qt(t) {
  return t.attributes.color_temp_kelvin;
}
function wt(t) {
  if (!$(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !xi.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const Fs = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, Pt = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), jt = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, ta = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, ea = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function yi(t, e) {
  if (!e) return Fs;
  const s = wt(t);
  if (!s) {
    const a = Qt(t);
    return a && t.attributes.color_mode === "color_temp" && a >= 4500 ? ta : Fs;
  }
  const i = [255, 255, 255], n = ea(s) > 0.75 ? Pt(s, [40, 50, 80], 0.45) : s;
  return {
    bg: jt(Pt(s, i, 0.84), 0.95),
    fg: jt(Pt(s, [10, 10, 20], 0.82)),
    fg2: jt(Pt(s, [20, 10, 30], 0.72)),
    accent: jt(n),
    fill: jt(Pt(n, i, 0.35))
  };
}
function Rt(t, e) {
  return t.callService("light", $(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function He(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function Je(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function we(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, n = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(n, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function Ys(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function sa(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function N(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function ts(t, e) {
  let s;
  for (const i of _s) {
    const n = i.rgb.reduce((a, r, l) => a + (r - t[l]) ** 2, 0);
    (!s || n < s.d) && (s = { d: n, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function be(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function Vs(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const n = getComputedStyle(i).overflowY;
    if ((n === "auto" || n === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function wi(t) {
  let e = 0;
  const s = (a) => {
    e = a.touches[0]?.clientY ?? 0;
  }, i = (a) => {
    if (!a.cancelable) return;
    const r = a.touches[0]?.clientY ?? e;
    Vs(a.composedPath(), t, r - e) || a.preventDefault();
  }, n = (a) => {
    Vs(a.composedPath(), t, -a.deltaY) || a.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", n, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", n);
  };
}
var ia = Object.defineProperty, na = Object.getOwnPropertyDescriptor, q = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? na(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && ia(e, s, n), n;
};
let $t;
function aa(t, e) {
  $t?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), $t = s;
}
function ra(t) {
  $t?.isConnected && ($t.hass = t);
}
let P = class extends D {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = wi(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), $t === this && ($t = void 0);
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
    if (st(t)) return o(this.hass, "unavailable");
    if (!$(t)) return o(this.hass, "off");
    const e = [], s = W(t);
    if (s.length) {
      const r = s.filter((l) => $(this.hass.states[l])).length;
      e.push(`${r} ${o(this.hass, "of")} ${s.length} ${o(this.hass, "lit")}`);
    }
    const i = tt(t);
    i != null && e.push(`${i} %`);
    const n = wt(t), a = Qt(t);
    if (n) {
      const r = ts(n, z(this.hass));
      r && e.push(r);
    } else a && t.attributes.color_mode === "color_temp" && e.push(`${a} K`);
    return e.length || e.push(o(this.hass, "on")), e.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this.hass.states[this._entityId], e = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return h`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${t ? this._name(t) : this._entityId}>
        ${this._wide ? f : h`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${t ? this._content(t) : h`<p class="empty">${o(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(t) {
    const e = $(t), s = yi(t, this.opts.useLightColor !== !1), i = W(t), n = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, a = this._controls(t), r = i.length ? this._memberList(t, i) : f, l = this._info(t);
    return h`
      <div class="body" style=${n}>
        <header>
          ${this._stack.length ? h`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${ye(!1, 18)}
              </button>` : f}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? o(this.hass, "turn_off") : o(this.hass, "turn_on")}
            ?disabled=${st(t)}
            @click=${() => Rt(this.hass, t)}
          >
            ${I(e, this._wide ? 28 : 24)}
            ${i.length && e ? h`<span class="badge">${i.filter((c) => $(this.hass.states[c])).length}</span>` : f}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${be(this.hass, t.entity_id) ? ` · ${be(this.hass, t.entity_id)}` : ""}</span>
          </div>
          ${this.opts.onSettings ? h`<button class="round gear" aria-label=${o(this.hass, "settings")} @click=${() => {
      const c = this.opts.onSettings;
      this.close(), c();
    }}>${ae(this._wide ? 22 : 18)}</button>` : f}
          <button class="round close" aria-label=${o(this.hass, "close")} @click=${() => this.close()}>
            ${De(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? h`<div class="cols">
              <div class="left">${a.main}</div>
              <div class="right">${a.side}${r}${i.length ? f : l}</div>
            </div>` : h`<div class="stack">
              <div class="main-row">${a.main}${a.beside ?? f}</div>
              ${a.side}${r}${i.length ? f : l}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = _e(t), s = $(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: h`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? o(this.hass, "turn_off") : o(this.hass, "turn_on")}
            @click=${() => Rt(this.hass, t)}>
            <span>${gi(36)}</span>
          </button>`,
        side: f
      };
    const n = h`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${tt(t) ?? 0}
      .label=${o(this.hass, "brightness")}
      @value-changed=${(p) => Je(this.hass, i, p.detail.value)}
    >${fi(28)}</terral-slider>`, a = h`<div class="chips">
      ${[25, 50, 75, 100].map(
      (p) => h`<button class="chip" @click=${() => Je(this.hass, i, p)}>${p} %</button>`
    )}
    </div>`, r = h`<div class="chips">
      ${Ze.map(
      (p) => h`<button class="chip tinted" style="background:${p.css}" @click=${() => we(this.hass, t, p.kelvin)}>
          ${o(this.hass, p.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: n, side: a };
    if (e === "temperature") {
      const p = t.attributes.min_color_temp_kelvin ?? 2e3, m = t.attributes.max_color_temp_kelvin ?? 6500, _ = h`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${p}
        .max=${m}
        .value=${Qt(t) ?? Math.round((p + m) / 2)}
        .label=${o(this.hass, "temperature")}
        @value-changed=${(g) => we(this.hass, t, g.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: h`<div class="pair">${n}${_}</div>`, side: r } : { main: h`<div class="pair">${n}${_}</div>`, side: r };
    }
    const l = z(this.hass), c = (this.opts.favorites?.length ? this.opts.favorites : _s.map((p) => ({ name: p.name[l], rgb: p.rgb }))).slice(0, 6), d = wt(t), u = h`
      <p class="lb">${o(this.hass, "favorites")}</p>
      <div class="swatches">
        ${c.map(
      (p) => h`<button
            class="sw ${d && N(d) === N(p.rgb) ? "sel" : ""}"
            style="background:${N(p.rgb)}"
            aria-label=${p.name ?? N(p.rgb)}
            @click=${() => Ys(this.hass, i, p.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${o(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${d ? N(d) : "#ffffff"} @change=${(p) => Ys(this.hass, i, sa(p.target.value))} />
      ${Jn(t) ? h`<p class="lb">${o(this.hass, "temperature")}</p>${r}` : f}
    `;
    return this._wide ? { main: n, side: u } : { main: n, side: f, beside: h`<div class="beside">${u}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const c of e) {
      const d = be(this.hass, c) ?? o(this.hass, "other_area");
      i.set(d, [...i.get(d) ?? [], c]);
    }
    const n = s === "always" || s === "auto" && e.length > 8 && i.size > 1, a = e.length > 8 ? h`<div class="chips">
          <button class="chip" @click=${() => He(this.hass, t.entity_id, !0)}>${o(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => He(this.hass, t.entity_id, !1)}>${o(this.hass, "all_off")}</button>
        </div>` : f, r = (c) => {
      const d = this.hass.states[c], u = $(d), p = d ? this.hass.formatEntityName?.(d) ?? d.attributes.friendly_name ?? c : c;
      return h`<div class="mr">
        <button class="mi ${u ? "on" : ""}" ?disabled=${st(d)}
          aria-label="${u ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${p}"
          @click=${() => d && Rt(this.hass, d)}>${I(u, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, c]}>
          <span>${p}</span><small>${d ? this._stateText(d) : o(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, l = (c) => [...c].sort((d, u) => Number($(this.hass.states[u])) - Number($(this.hass.states[d])));
    return h`
      ${a}
      <p class="lb">${o(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${n ? [...i.entries()].map(([c, d]) => {
      const u = this._openAreas.has(c), p = d.filter((m) => $(this.hass.states[m])).length;
      return h`<div class="box">
                <div class="sec">
                  <button class="mi ${p ? "on" : ""}" aria-label="${p ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${c}"
                    @click=${() => He(this.hass, d, p === 0)}>${I(p > 0, 18)}</button>
                  <button class="mt" aria-expanded=${u} @click=${() => {
        const m = new Set(this._openAreas);
        u ? m.delete(c) : m.add(c), this._openAreas = m;
      }}>
                    <span>${c} <small>${p} ${o(this.hass, "of")} ${d.length}</small></span>${ye(u)}
                  </button>
                </div>
                ${u ? h`<div class="inner">${d.map(r)}</div>` : f}
              </div>`;
    }) : h`<div class="box">${l(e).map(r)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return h`<div class="info">
      <div><span>${o(this.hass, "last_activity")}</span><span>${ui(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
P.styles = A`
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
q([
  v({ attribute: !1 })
], P.prototype, "hass", 2);
q([
  v({ attribute: !1 })
], P.prototype, "opts", 2);
q([
  y()
], P.prototype, "_stack", 2);
q([
  y()
], P.prototype, "_expanded", 2);
q([
  y()
], P.prototype, "_closing", 2);
q([
  y()
], P.prototype, "_wide", 2);
q([
  y()
], P.prototype, "_openAreas", 2);
q([
  An("input[type=color]")
], P.prototype, "_picker", 2);
P = q([
  M("terral-light-dialog")
], P);
var oa = Object.defineProperty, bs = (t, e, s, i) => {
  for (var n = void 0, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = r(e, s, n) || n);
  return n && oa(e, s, n), n;
};
const Ms = class Ms extends D {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = wi(this);
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
        ${this._wide ? f : h`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        <header>
          ${this.renderHeaderStart()}
          <h2>${this.heading}</h2>
          ${this.renderHeaderEnd()}
          <button class="close" aria-label=${o(this.hass, "close")} @click=${() => this.close()}>${De(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
Ms.styles = A`
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
let C = Ms;
bs([
  v({ attribute: !1 })
], C.prototype, "hass");
bs([
  y()
], C.prototype, "_wide");
bs([
  y()
], C.prototype, "_closing");
const Re = ["switch", "lock", "input_boolean"], Ut = (t) => t.split(".")[0], rt = (t) => Ut(t) === "lock";
function la(t, e = !1) {
  const s = rt(t.entity_id) ? t.state === "locked" : t.state === "on", i = rt(t.entity_id);
  return s === i !== e;
}
function es(t, e, s, i = !1) {
  const n = e.entity_id, a = rt(n) ? !i : i, r = s ? a : !a;
  return rt(n) ? t.callService("lock", r ? "lock" : "unlock", {}, { entity_id: n }) : t.callService(Ut(n), r ? "turn_on" : "turn_off", {}, { entity_id: n });
}
const ca = (t, e = !1) => (rt(t) ? !e : e) ? "active" : "inactive", xs = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function vs(t, e) {
  const s = e ? t.states[e] : void 0;
  if (xs(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kW");
  return n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
function $i(t, e) {
  const s = e ? t.states[e] : void 0;
  if (xs(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kWh");
  return n === "Wh" ? i / 1e3 : n === "MWh" ? i * 1e3 : i;
}
const mt = 0.05;
function ha(t, e) {
  const s = vs(t, e.power), i = e.status ? t.states[e.status] : void 0;
  if (i && !xs(i)) {
    if (i.entity_id.startsWith("binary_sensor."))
      return i.state !== "on" ? "none" : s != null && s > mt ? "charging" : "connected";
    const n = String(i.state).toLowerCase();
    if (/discharg/.test(n)) return "connected";
    if (/charging|cargando|en carga/.test(n)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(n))
      return s != null && s > mt ? "charging" : "none";
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(n))
      return s != null && s > mt ? "charging" : "connected";
  }
  return s != null && s > mt ? "charging" : "unknown";
}
function ki(t, e) {
  const s = t.entities?.[e]?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => i !== e && n.device_id === s).map(([i]) => i) : [];
}
const ys = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), Ci = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(ys(t, e)), Si = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(ys(t, e)), Ai = (t, e) => {
  const s = t.states[e];
  return s ? e.startsWith("binary_sensor.") ? ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(e) : e.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state)) : !1;
};
function ws(t, e) {
  const s = ki(t, e.entity), i = (a, r) => {
    const l = s.filter((c) => t.states[c] && a(c));
    return r && l.find((c) => r.test(c)) || l[0];
  }, n = (a, r) => a === "none" ? void 0 : a || r();
  return {
    status: n(e.status_entity, () => i((a) => Ai(t, a), /status|estado/i)),
    power: n(e.power_entity, () => i((a) => Ci(t, a), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: n(e.energy_entity, () => i((a) => Si(t, a), /added|session|sesion|sesión|charge|carga/i))
  };
}
function Gs(t, e) {
  if (rt(e)) return !1;
  const s = String(t.states[e]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(e + " " + s);
}
async function Mi(t, e, s) {
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  }), n = ys(t, e), a = n === "W" ? 1 / 1e3 : n === "MW" ? 1e3 : 1;
  return (i[e] ?? []).map((r) => [r.lu * 1e3, Number(r.s) * a]).filter(([, r]) => Number.isFinite(r));
}
function Ei(t, e = Date.now()) {
  const s = [];
  let i;
  for (let n = 0; n < t.length; n++) {
    const [a, r] = t[n], l = n + 1 < t.length ? t[n + 1][0] : e, c = Math.max(0, l - a) / 36e5;
    r > mt && (i && a - i.end > 15 * 6e4 && (s.push(i), i = void 0), i ??= { start: a, end: a, kwh: 0, maxKw: 0, live: !1 }, i.kwh += r * c, i.end = l, i.maxKw = Math.max(i.maxKw, r));
  }
  return i && (i.live = t.length > 0 && t[t.length - 1][1] > mt, s.push(i)), s.filter((n) => n.kwh >= 0.05 || n.live);
}
function zi(t, e = 7, s = /* @__PURE__ */ new Date()) {
  const i = [];
  for (let n = e - 1; n >= 0; n--) {
    const a = new Date(s.getFullYear(), s.getMonth(), s.getDate() - n);
    i.push({ day: a, kwh: 0 });
  }
  for (const n of t) {
    const a = new Date(n.start), r = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime(), l = i.find((c) => c.day.getTime() === r);
    l && (l.kwh += n.kwh);
  }
  return i;
}
const L = (t, e, s = 1) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), ss = (t) => {
  const e = Math.max(0, Math.round(t / 6e4));
  return `${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")} min`;
};
var da = Object.defineProperty, pa = Object.getOwnPropertyDescriptor, Ti = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? pa(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && da(e, s, n), n;
};
let $e = class extends C {
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
      <button class="cancel" @click=${() => this.close()}>${o(this.hass, "cancel")}</button>
    `;
  }
};
$e.styles = [
  C.styles,
  A`
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
Ti([
  v({ attribute: !1 })
], $e.prototype, "options", 2);
$e = Ti([
  M("terral-confirm-sheet")
], $e);
function is(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const Ks = ["auto", "heat_cool", "cool", "heat", "dry", "fan_only"], ua = {
  auto: { t: !0, f: !0 },
  heat_cool: { t: !0, f: !1 },
  cool: { t: !0, f: !0 },
  heat: { t: !0, f: !0 },
  dry: { t: !1, f: !1 },
  fan_only: { t: !1, f: !0 }
}, ga = {
  cool: [70, 150, 255],
  heat: [255, 140, 60],
  auto: [52, 199, 123],
  heat_cool: [52, 199, 123],
  dry: [40, 190, 200],
  fan_only: [140, 160, 200]
}, Oe = { TARGET: 1, FAN: 8, SWING: 32, TURN_ON: 256 }, Pe = (t, e) => (Number(t.attributes.supported_features ?? 0) & e) !== 0, T = (t) => t.state === "off" || t.state === "unavailable" || t.state === "unknown", _t = (t) => t.state === "unavailable" || t.state === "unknown";
function V(t) {
  const e = (t.attributes.hvac_modes ?? []).filter((i) => i !== "off"), s = (i) => Ks.includes(i) ? Ks.indexOf(i) : 99;
  return [...e].sort((i, n) => s(i) - s(n));
}
const Zt = (t) => Pe(t, Oe.FAN) || t.attributes.fan_modes ? t.attributes.fan_modes ?? [] : [], fa = (t) => (t.attributes.preset_modes ?? []).filter((e) => e !== "none"), Di = (t) => Pe(t, Oe.SWING) || (t.attributes.swing_modes?.length ?? 0) > 0;
function Oi(t, e = t.state) {
  return e === "heat_cool" || t.attributes.target_temp_low != null && t.attributes.target_temp_high != null && t.attributes.temperature == null && e !== "off";
}
function ke(t, e) {
  return t.mode_rules?.[e] ?? ua[e] ?? { t: !0, f: !0 };
}
function bt(t, e) {
  return T(t) || !ke(e, t.state).t ? !1 : Oi(t) ? t.attributes.target_temp_low != null : t.attributes.temperature != null || Pe(t, Oe.TARGET);
}
function Pi(t, e) {
  return !T(t) && ke(e, t.state).f && Zt(t).length > 0;
}
function Wt(t, e) {
  const s = Number(t.attributes.min_temp ?? 7), i = Number(t.attributes.max_temp ?? 35), n = Math.max(s, e.min_temp ?? s), a = Math.min(i, e.max_temp ?? i), r = e.temp_step ?? Number(t.attributes.target_temp_step ?? (t.attributes.temperature_unit === "°F" ? 1 : 0.5));
  return { min: n, max: Math.max(n + r, a), step: r, hwMin: s, hwMax: i };
}
const it = (t, e) => Math.min(e.max, Math.max(e.min, Math.round(t / e.step) * e.step)), Bt = (t) => t.attributes.current_temperature != null ? Number(t.attributes.current_temperature) : null, ma = (t) => t.attributes.current_humidity != null ? Number(t.attributes.current_humidity) : null, ji = /* @__PURE__ */ new Map(), Ni = (t) => {
  T(t) || ji.set(t.entity_id, t.state);
};
function Li(t, e) {
  const s = ji.get(e.entity_id);
  if (s && V(e).includes(s)) return Jt(t, e, s);
  if (Pe(e, Oe.TURN_ON)) return t.callService("climate", "turn_on", {}, { entity_id: e.entity_id });
  const i = V(e).includes("cool") ? "cool" : V(e)[0];
  return i ? Jt(t, e, i) : Promise.resolve();
}
function Ii(t, e) {
  return Ni(e), e.attributes.hvac_modes?.includes("off") ? Jt(t, e, "off") : t.callService("climate", "turn_off", {}, { entity_id: e.entity_id });
}
const Jt = (t, e, s) => t.callService("climate", "set_hvac_mode", { hvac_mode: s }, { entity_id: e.entity_id }), Hi = (t, e, s) => t.callService("climate", "set_fan_mode", { fan_mode: s }, { entity_id: e.entity_id }), _a = (t, e, s) => t.callService("climate", "set_preset_mode", { preset_mode: s }, { entity_id: e.entity_id });
function ba(t, e, s) {
  const i = e.attributes.swing_modes ?? ["on", "off"], n = s ? i.find((a) => a !== "off") ?? "on" : i.includes("off") ? "off" : i[0];
  return t.callService("climate", "set_swing_mode", { swing_mode: n }, { entity_id: e.entity_id });
}
function Ri(t, e, s) {
  const i = typeof s == "number" ? { temperature: s } : { target_temp_low: s.low, target_temp_high: s.high };
  return t.callService("climate", "set_temperature", i, { entity_id: e.entity_id });
}
const Ui = {
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
}, xa = {
  auto: "Auto",
  heat_cool: "Heat/cool",
  cool: "Cool",
  heat: "Heat",
  dry: "Dry",
  fan_only: "Fan only"
}, va = { cool: "Enfriando", heat: "Calentando", dry: "Deshumidificando", fan_only: "Ventilando", auto: "Automático", heat_cool: "Manteniendo" }, ya = { cool: "Cooling", heat: "Heating", dry: "Drying", fan_only: "Fan", auto: "Auto", heat_cool: "Keeping" }, Wi = (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " "), H = (t, e) => (t === "es" ? Ui[e] : xa[e]) ?? Wi(e), ns = (t, e) => (t === "es" ? Ui[e.toLowerCase()] : void 0) ?? Wi(e), as = (t, e) => (t === "es" ? va[e] : ya[e]) ?? H(t, e);
function wa(t, e) {
  if (!e) return "";
  if (/auto/i.test(e)) return "A";
  const i = t.filter((n) => !/auto/i.test(n)).indexOf(e);
  return i >= 0 ? String(i + 1) : e.charAt(0).toUpperCase();
}
function xt(t, e = 22) {
  switch (t) {
    case "auto":
      return Yn(e);
    case "cool":
      return Vn(e);
    case "heat":
      return Gn(e);
    case "dry":
      return Kn(e);
    case "fan_only":
      return Xe(e);
    case "heat_cool":
      return Xn(e);
    case "off":
      return gi(e);
    default:
      return Qe(e);
  }
}
const he = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), ut = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function Bi(t) {
  if (T(t)) return "";
  const e = ga[t.state] ?? [140, 160, 200];
  return `--bg:${ut(he(e, [255, 255, 255], 0.84), 0.95)};--bg-solid:${ut(he(e, [255, 255, 255], 0.84))};--fg:${ut(he(e, [10, 10, 20], 0.82))};--fg2:${ut(he(e, [20, 10, 30], 0.7))};--accent:${ut(e)};--arc:${ut(e)}`;
}
function rs(t) {
  if (Oi(t)) {
    const e = t.attributes.target_temp_low, s = t.attributes.target_temp_high;
    return e != null && s != null ? { low: Number(e), high: Number(s) } : null;
  }
  return t.attributes.temperature != null ? Number(t.attributes.temperature) : null;
}
const G = (t, e) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), te = (t, e) => e == null ? "" : typeof e == "number" ? `${G(t, e)}°` : `${G(t, e.low)}–${G(t, e.high)}°`;
function Xs(t, e, s, i, n) {
  const a = z(t), r = Bt(e), l = r != null ? `${G(t, r)}° ${a === "es" ? "dentro" : "inside"}` : "";
  if (_t(e)) return a === "es" ? "Sin respuesta" : "Not responding";
  if (T(e)) {
    const u = a === "es" ? "Apagado" : "Off";
    return n || !l ? u : `${u} · ${l}`;
  }
  const c = bt(e, s) ? te(t, i) : "";
  if (n) return c || H(a, e.state);
  const d = c ? `${as(a, e.state)} ${a === "es" ? "a" : "to"} ${c}` : as(a, e.state);
  return l ? `${d} · ${l}` : d;
}
function qi(t, e) {
  const s = ma(e);
  return s != null ? `${Math.round(s)} % ${z(t) === "es" ? "humedad" : "humidity"}` : "";
}
var $a = Object.defineProperty, ka = Object.getOwnPropertyDescriptor, Et = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ka(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && $a(e, s, n), n;
};
const Ue = { light: "terral-home-light", alarm: "terral-home-alarm", charger: "terral-home-charger", climate: "terral-home-climate" }, Ca = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate" }, Sa = (t, e) => e === 4 ? "4/2" : e === 1 ? "1/1" : t === 2 ? "2/2" : "2/1", Aa = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;
let K = class extends C {
  constructor() {
    super(...arguments), this._q = "", this._allDevices = !1, this._back = () => {
      if (this._sub) {
        this._sub = void 0, this._q = "";
        return;
      }
      this.close(), this.options.onBack?.();
    }, this._devName = (t) => t.name_by_user || t.name || t.id, this._entName = (t) => String(this.hass.states[t]?.attributes.friendly_name ?? t), this._area = (t) => (t ? this.hass.areas?.[t]?.name : void 0) ?? o(this.hass, "other_area"), this._visible = (t) => {
      const e = this.hass.entities?.[t];
      return !!this.hass.states[t] && !e?.hidden && !e?.entity_category;
    };
  }
  get heading() {
    return this._sub === "entity" && this.draft.type === "climate" ? o(this.hass, "climate_entity") : this._sub ? o(this.hass, { device: "ch_device", entity: "light_entity", alarm: "type_alarm", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" }[this._sub]) : this.options.mode === "edit" ? o(this.hass, "settings") : o(this.hass, Ca[this.draft.type]);
  }
  renderHeaderStart() {
    return !this._sub && !(this.options.mode === "add" && this.options.onBack) ? f : h`<button class="hbtn" aria-label=${o(this.hass, "back")} @click=${this._back}>${Fn()}</button>`;
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
  // ---- Preview -----------------------------------------------------------------
  _sizes() {
    const t = this._preview?.getTerralSizes?.();
    return t?.length ? t : [{ w: 2, h: 2 }];
  }
  _renderPreview() {
    const { type: t, config: e, w: s, h: i } = this.draft;
    if (!e.entity)
      return h`<div class="prev"><div class="pgrid"><div class="cell" style="grid-column:span 2;grid-row:span 2">
        <div class="ph">${t === "alarm" ? Gt(26) : t === "charger" ? Xt(26) : I(!1, 26)}<span>${o(this.hass, t === "alarm" ? "pick_alarm" : "pick_device")}</span></div>
      </div></div></div>`;
    (!this._preview || this._preview.localName !== Ue[t]) && (this._preview = document.createElement(Ue[t]));
    try {
      this._preview.setConfig({ ...e, type: `custom:${Ue[t]}`, view_layout: { terral: { w: s, h: i } } });
    } catch {
    }
    this._preview.hass = this.hass;
    const n = this._sizes();
    return h`<div class="prev">
      <div class="pgrid"><div class="cell" style="grid-column:span ${s};grid-row:span ${i === 4 ? 4 : i}">${this._preview}</div></div>
      ${n.length > 1 ? h`<div class="sizes">${n.map(
      (a) => h`<button class="sz ${a.w === s && a.h === i ? "on" : ""}" @click=${() => this.draft = { ...this.draft, w: a.w, h: a.h }}>${Sa(a.w, a.h)}</button>`
    )}</div>` : f}
    </div>`;
  }
  // ---- Main page ---------------------------------------------------------------
  _row(t, e, s, i) {
    return h`<button class="li" @click=${() => {
      this._sub = s, this._q = "";
    }}>
      <span class="nm">${t}${i ? h`<small>${i}</small>` : f}</span>
      <span class="val">${e}${ye(!1, 16)}</span>
    </button>`;
  }
  _defaultName() {
    const t = this.draft.config;
    if (this.draft.type === "alarm") return o(this.hass, "alarm");
    const e = t.device ? this.hass.devices?.[t.device] : void 0;
    return e ? this._devName(e) : t.entity ? this._entName(t.entity) : "";
  }
  _main() {
    const t = this.hass, { type: e, config: s } = this.draft, i = s.device ?? this._deviceOf(s.entity), n = i ? t.devices?.[i] : void 0, a = h`<section>
      <h3>${o(t, "general")}</h3>
      <div class="list">
        ${e === "alarm" ? this._alarms().length > 1 ? this._row(o(t, "type_alarm"), s.entity ? this._entName(s.entity) : o(t, "choose"), "alarm") : f : this._row(o(t, "ch_device"), n ? this._devName(n) : s.entity ? this._entName(s.entity) : o(t, "choose"), "device")}
        <label class="li">
          <span class="nm">${o(t, "name_label")}</span>
          <input class="txt" .value=${s.name ?? ""} placeholder=${this._defaultName()} @input=${(l) => this._set({ name: l.target.value })} />
        </label>
      </div>
    </section>`;
    let r = f;
    if (e === "light" && s.entity) {
      const l = i ? this._entitiesOf(i, (c) => c.startsWith("light.")) : [];
      r = h`<section>
        <h3>${o(t, "type_light")}</h3>
        <div class="list">
          ${l.length > 1 ? this._row(o(t, "light_entity"), this._entName(s.entity), "entity", s.entity) : f}
          <button class="li" role="switch" aria-checked=${s.use_light_color !== !1} @click=${() => this._set({ use_light_color: s.use_light_color === !1 ? void 0 : !1 })}>
            <span class="nm">${o(t, "use_light_color")}</span><span class="tog ${s.use_light_color !== !1 ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
    } else if (e === "climate" && s.entity && t.states[s.entity])
      r = this._climateSettings(i);
    else if (e === "charger" && s.entity) {
      const l = rt(s.entity), c = o(t, l ? "raw_locked" : "raw_on"), d = o(t, l ? "raw_unlocked" : "raw_off"), u = ca(s.entity, !!s.invert) === "active", p = o(t, "ch_locked"), m = o(t, "ch_unlocked"), _ = ws(t, { entity: s.entity }), g = (b, S) => s[b] === "none" ? o(t, "none") : s[b] ? this._entName(s[b]) : S ? `${o(t, "auto")} · ${this._entName(S)}` : o(t, "auto");
      r = h`
        <section>
          <h3>${o(t, "ch_lock_section")}</h3>
          <div class="list">
            ${this._row(o(t, "ch_lock_entity"), this._entName(s.entity), "lock", s.entity)}
            <button class="li" role="switch" aria-checked=${!!s.invert} @click=${() => this._set({ invert: !s.invert || void 0 })}>
              <span class="nm">${o(t, "ch_invert")}<small>${o(t, "ch_invert_sub", { a: c, b: d })}</small></span>
              <span class="tog ${s.invert ? "on" : ""}"></span>
            </button>
          </div>
        </section>
        <p class="explain">${o(t, "ch_explain", { a: c, la: u ? p : m, b: d, lb: u ? m : p, press: u ? c : d })}</p>
        <section>
          <h3>${o(t, "ch_data")}</h3>
          <div class="list">
            ${this._row(o(t, "ch_status"), g("status_entity", _.status), "status_entity")}
            ${this._row(o(t, "ch_power"), g("power_entity", _.power), "power_entity")}
            ${this._row(o(t, "ch_energy"), g("energy_entity", _.energy), "energy_entity")}
            <label class="li">
              <span class="nm">${o(t, "ch_max")}</span>
              <input class="num" type="number" inputmode="decimal" min="1" max="50" step="0.1" placeholder="7,4"
                .value=${s.max_power != null ? String(s.max_power) : ""}
                @change=${(b) => {
        const S = parseFloat(b.target.value.replace(",", "."));
        this._set({ max_power: Number.isFinite(S) && S > 0 ? S : void 0 });
      }} />
            </label>
          </div>
        </section>`;
    }
    return h`
      <div class="scroll">
        ${a}
        ${r}
        ${this.options.mode === "edit" && this.options.onRemove ? h`<button class="remove" @click=${() => is(t, {
      heading: o(t, "remove_card_q"),
      actions: [{ label: o(t, "remove_card"), danger: !0, run: () => {
        this.close(), this.options.onRemove?.();
      } }]
    })}>${o(t, "remove_card")}</button>` : f}
      </div>
      <button class="cta" ?disabled=${!s.entity} @click=${() => {
      this.options.onSave(this.draft), this.close();
    }}>${o(t, this.options.mode === "add" ? "add" : "save")}</button>
    `;
  }
  _climateSettings(t) {
    const e = this.hass, s = this.draft.config, i = e.states[s.entity], n = z(e), a = Wt(i, s), r = (g) => g.toLocaleString(e.locale?.language ?? e.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), l = t ? this._entitiesOf(t, (g) => g.startsWith("climate.")) : [], c = V(i), d = Zt(i).length > 0, u = Di(i), p = (g, b) => {
      const S = ke(s, g);
      this._set({ mode_rules: { ...s.mode_rules ?? {}, [g]: { ...S, [b]: !S[b] } } });
    }, m = (g, b) => {
      const S = g === "min_temp" ? a.min : a.max;
      let j = Math.round((S + b * a.step) / a.step) * a.step;
      j = g === "min_temp" ? Math.max(a.hwMin, Math.min(a.max - a.step, j)) : Math.min(a.hwMax, Math.max(a.min + a.step, j));
      const Dt = g === "min_temp" ? a.hwMin : a.hwMax;
      this._set({ [g]: j === Dt ? void 0 : j });
    }, _ = (g) => h`<span class="mini">
      <button aria-label="−" @click=${() => m(g, -1)}>${fs(16)}</button>
      <b>${r(g === "min_temp" ? a.min : a.max)}°</b>
      <button aria-label="+" @click=${() => m(g, 1)}>${ms(16)}</button>
    </span>`;
    return h`
      ${l.length > 1 ? h`<section><h3>${o(e, "climate_entity")}</h3><div class="list">${this._row(o(e, "climate_entity"), this._entName(s.entity), "entity", s.entity)}</div></section>` : f}
      <section>
        <h3>${o(e, "temperature")}</h3>
        <div class="list">
          <div class="li"><span class="nm">${o(e, "min_temp_l")}<small>${o(e, "hw_min", { v: r(a.hwMin) })}</small></span>${_("min_temp")}</div>
          <div class="li"><span class="nm">${o(e, "max_temp_l")}<small>${o(e, "hw_max", { v: r(a.hwMax) })}</small></span>${_("max_temp")}</div>
          <div class="li"><span class="nm">${o(e, "temp_step_l")}</span>
            <span class="seg">${[0.5, 1].map((g) => h`<button class=${a.step === g ? "sel" : ""} @click=${() => this._set({ temp_step: g })}>${r(g)}°</button>`)}</span>
          </div>
        </div>
      </section>
      ${c.length ? h`<section>
            <h3>${o(e, "per_mode")}</h3>
            <div class="list">
              <table class="matrix">
                <tr><th>${o(e, "climate_mode")}</th><th>${o(e, "col_temp")}</th>${d ? h`<th>${o(e, "col_fan")}</th>` : f}</tr>
                ${c.map((g) => {
      const b = ke(s, g);
      return h`<tr>
                    <td><span class="mname">${xt(g, 18)}${H(n, g)}</span></td>
                    <td><button class="ck ${b.t ? "on" : ""}" role="checkbox" aria-checked=${b.t} @click=${() => p(g, "t")}>${b.t ? me(15) : f}</button></td>
                    ${d ? h`<td><button class="ck ${b.f ? "on" : ""}" role="checkbox" aria-checked=${b.f} @click=${() => p(g, "f")}>${b.f ? me(15) : f}</button></td>` : f}
                  </tr>`;
    })}
              </table>
            </div>
            ${s.mode_rules ? h`<button class="more" style="margin-top:8px" @click=${() => this._set({ mode_rules: void 0 })}>${o(e, "reset_rules")}</button>` : f}
          </section>` : f}
      <section>
        <h3>${o(e, "window_section")}</h3>
        <div class="list">
          <button class="li" role="switch" aria-checked=${!!s.show_swing && u} ?disabled=${!u} style=${u ? "" : "opacity:.5"} @click=${() => this._set({ show_swing: !s.show_swing || void 0 })}>
            <span class="nm">${o(e, "show_swing")}<small>${o(e, u ? "show_swing_sub" : "no_swing")}</small></span>
            <span class="tog ${s.show_swing && u ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
  }
  // ---- Sub pages ---------------------------------------------------------------
  _opt(t, e, s, i, n) {
    return h`<button class="opt ${s ? "sel" : ""}" @click=${() => {
      i(), this._sub = void 0, this._q = "";
    }}>
      ${n ? h`<span class="ic">${n}</span>` : f}
      <span class="on">${t}${e ? h`<small>${e}</small>` : f}</span>
      <span class="ck">${me(18)}</span>
    </button>`;
  }
  _group(t, e) {
    return e.length ? h`<section><h3>${t}</h3><div class="list">${e}</div></section>` : f;
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
      const d = this._devices.map((g) => ({ d: g, lights: this._entitiesOf(g.id, (b) => b.startsWith("light.")) })).filter((g) => g.lights.length && this._match(this._devName(g.d), ...g.lights.map(this._entName))).sort((g, b) => this._devName(g.d).localeCompare(this._devName(b.d))), u = Object.keys(t.states).filter((g) => g.startsWith("light.") && this._visible(g) && !this._deviceOf(g) && this._match(this._entName(g), g)), p = u.filter((g) => qs(t.states[g])), m = u.filter((g) => !qs(t.states[g])), _ = (g) => this._set({ entity: g, device: void 0, name: this._entName(g) });
      return h`${this._search()}
        ${this._group(o(t, "light_groups"), p.map((g) => this._opt(this._entName(g), o(t, "group"), s.entity === g, () => _(g), I(!1, 20))))}
        ${this._byArea(d, (g) => g.d.area_id, (g) => this._opt(this._devName(g.d), g.lights.length > 1 ? `${g.lights.length} ${o(t, "lights_word")}` : g.d.model ?? void 0, i === g.d.id, () => this._set({ device: g.d.id, entity: g.lights[0], name: this._devName(g.d) }), I(!1, 20)))}
        ${this._group(o(t, "other_lights"), m.map((g) => this._opt(this._entName(g), g, s.entity === g, () => _(g), I(!1, 20))))}`;
    }
    if (e === "climate") {
      const d = this._devices.map((p) => ({ d: p, ents: this._entitiesOf(p.id, (m) => m.startsWith("climate.")) })).filter((p) => p.ents.length && this._match(this._devName(p.d), ...p.ents.map(this._entName))).sort((p, m) => this._devName(p.d).localeCompare(this._devName(m.d))), u = Object.keys(t.states).filter((p) => p.startsWith("climate.") && this._visible(p) && !this._deviceOf(p) && this._match(this._entName(p), p));
      return h`${this._search()}
        ${this._byArea(d, (p) => p.d.area_id, (p) => this._opt(this._devName(p.d), p.d.model ?? void 0, i === p.d.id, () => this._set({ device: p.d.id, entity: p.ents[0], name: this._devName(p.d) }), Qe(20)))}
        ${this._group(o(t, "other_climates"), u.map((p) => this._opt(this._entName(p), p, s.entity === p, () => this._set({ entity: p, device: void 0, name: this._entName(p) }), Qe(20))))}`;
    }
    const n = this._devices.map((d) => ({ d, locks: this._entitiesOf(d.id, (u) => Re.includes(Ut(u))) })).filter((d) => d.locks.length), a = (d) => Aa.test([this._devName(d.d), d.d.manufacturer, d.d.model].join(" ")), r = n.filter((d) => (this._allDevices || a(d)) && this._match(this._devName(d.d), d.d.manufacturer, d.d.model)), l = (d) => d.find((u) => /bloq|lock/i.test(u + this._entName(u))) ?? d.find((u) => /paus|stop/i.test(u + this._entName(u))) ?? d[0], c = (d) => {
      const u = l(d.locks);
      this._set({ device: d.d.id, entity: u, invert: Gs(t, u) || void 0, name: this._devName(d.d), status_entity: void 0, power_entity: void 0, energy_entity: void 0 });
    };
    return h`${this._search()}
      ${this._byArea(r, (d) => d.d.area_id, (d) => this._opt(this._devName(d.d), d.locks.map(this._entName).join(" · "), i === d.d.id, () => c(d), Xt(20)))}
      ${r.length ? f : h`<p class="note">${o(t, "no_chargers_found")}</p>`}
      ${this._allDevices ? f : h`<button class="more" @click=${() => this._allDevices = !0}>${o(t, "show_all_devices")}</button>`}`;
  }
  _search() {
    return h`<label class="search">${mi(16)}<input type="search" placeholder=${o(this.hass, "search_entities")} .value=${this._q}
      @input=${(t) => this._q = t.target.value} /></label>`;
  }
  _subPage() {
    const t = this.hass, { config: e } = this.draft, s = this._sub;
    if (s === "device") return h`<div class="scroll">${this._devicePage()}</div>`;
    if (s === "alarm") {
      const l = Object.keys(t.states).filter((c) => c.startsWith("alarm_control_panel.") && this._visible(c));
      return h`<div class="scroll">${this._group(o(t, "type_alarm"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, name: e.name || void 0 }), Gt(20))))}
        ${l.length ? f : h`<p class="note">${o(t, "no_alarms_found")}</p>`}</div>`;
    }
    const i = e.device ?? this._deviceOf(e.entity);
    if (s === "entity") {
      const l = this.draft.type === "climate" ? "climate." : "light.", c = i ? this._entitiesOf(i, (d) => d.startsWith(l)) : [];
      return h`<div class="scroll">${this._group(o(t, "light_entity"), c.map((d) => this._opt(this._entName(d), d, e.entity === d, () => this._set({ entity: d }))))}</div>`;
    }
    if (s === "lock") {
      const l = i ? this._entitiesOf(i, (c) => Re.includes(Ut(c))) : Object.keys(t.states).filter((c) => Re.includes(Ut(c)) && this._visible(c) && this._match(this._entName(c), c));
      return h`<div class="scroll">${i ? f : this._search()}${this._group(o(t, "ch_lock_entity"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, invert: Gs(t, c) || void 0 }))))}</div>`;
    }
    const n = s === "status_entity" ? (l) => Ai(t, l) : s === "power_entity" ? (l) => Ci(t, l) : (l) => Si(t, l), a = new Set(e.entity ? ki(t, e.entity) : []), r = Object.keys(t.states).filter((l) => this._visible(l) && n(l) && this._match(this._entName(l), l)).sort((l, c) => Number(a.has(c)) - Number(a.has(l)) || this._entName(l).localeCompare(this._entName(c))).slice(0, 60);
    return h`<div class="scroll">${this._search()}
      <div class="list">
        ${this._opt(o(t, "auto"), void 0, !e[s], () => this._set({ [s]: void 0 }))}
        ${this._opt(o(t, "none"), void 0, e[s] === "none", () => this._set({ [s]: "none" }))}
        ${r.map((l) => this._opt(this._entName(l), l, e[s] === l, () => this._set({ [s]: l })))}
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
  willUpdate() {
    if (this.draft.type === "alarm" && !this.draft.config.entity && this.hass) {
      const t = this._alarms()[0];
      t && (this.draft = { ...this.draft, config: { ...this.draft.config, entity: t } });
    }
  }
};
K.styles = [
  C.styles,
  A`
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
      .prev {
        flex: none;
        padding: 14px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      /* Same proportions as the home grid on a phone. */
      .pgrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 62px;
        gap: 10px;
        pointer-events: none;
      }
      .ph {
        height: 100%;
        border-radius: 22px;
        border: 2px dashed rgba(255, 255, 255, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.65);
        box-sizing: border-box;
      }
      .sizes {
        display: flex;
        gap: 6px;
        justify-content: center;
      }
      .sz {
        height: 30px;
        padding: 0 12px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.1);
        font-size: 12.5px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.75);
      }
      .sz.on {
        background: #fff;
        color: #23233a;
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
Et([
  v({ attribute: !1 })
], K.prototype, "draft", 2);
Et([
  v({ attribute: !1 })
], K.prototype, "options", 2);
Et([
  y()
], K.prototype, "_sub", 2);
Et([
  y()
], K.prototype, "_q", 2);
Et([
  y()
], K.prototype, "_allDevices", 2);
K = Et([
  M("terral-card-config")
], K);
function Fi(t, e, s) {
  document.querySelector("terral-card-config")?.remove();
  const i = document.createElement("terral-card-config");
  return i.hass = t, i.draft = { ...e, config: { ...e.config } }, i.options = s, document.body.appendChild(i), i;
}
function je(t, e, s, i) {
  const { type: n, view_layout: a, ...r } = i, l = a?.terral;
  Fi(e, { type: s, config: r, w: l?.w ?? 2, h: l?.h ?? 2 }, {
    mode: "edit",
    onSave: (c) => t.dispatchEvent(new CustomEvent("terral-card-config", { detail: { config: c.config, size: { w: c.w, h: c.h } }, bubbles: !0, composed: !0, cancelable: !0 })),
    onRemove: () => t.dispatchEvent(new CustomEvent("terral-card-remove", { bubbles: !0, composed: !0 }))
  });
}
function Ma(t) {
  return { type: t, config: {}, w: t === "light" ? 1 : 2, h: 2 };
}
function Ea(t) {
  for (const e of document.querySelectorAll("terral-card-config")) e.hass = t;
}
var za = Object.defineProperty, Ta = Object.getOwnPropertyDescriptor, F = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ta(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && za(e, s, n), n;
};
const Da = "terral-home-light";
let ot = class extends D {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      aa(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area,
        onSettings: () => this.hass && this._config && je(this, this.hass, "light", this._config)
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !st(e) && Rt(this.hass, e);
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
    return t ? _e(t) === "temperature" || _e(t) === "color" || W(t).length > 0 ? e : e.slice(0, 3) : e;
  }
  static getStubConfig(t, e = [], s = []) {
    return { entity: [...e, ...s].find((n) => n.startsWith("light.")) ?? Object.keys(t?.states ?? {}).find((n) => n.startsWith("light.")) ?? "light.example" };
  }
  static getConfigForm() {
    const t = (e) => o(void 0, e);
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...W(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && ra(this.hass);
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
    if (st(t)) return o(s, "unavailable");
    const i = W(t);
    if (i.length) {
      const l = i.filter((u) => $(s.states[u])).length;
      if (!l) return `${i.length} ${o(s, "lights_off")}`;
      const c = tt(t), d = l === i.length && e === "onoff" ? `${o(s, "all_lit")} (${l})` : `${l} ${o(s, "of")} ${i.length} ${o(s, "lit")}`;
      return c != null && this._size !== "s11" ? `${d} · ${c} %` : d;
    }
    if (!$(t)) return o(s, "off");
    const n = [], a = tt(t);
    a != null && n.push(`${a} %`);
    const r = wt(t);
    if (r) {
      const l = ts(r, z(s));
      l && n.push(l);
    } else if (e === "temperature" || e === "color") {
      const l = Qt(t);
      if (l && t.attributes.color_mode === "color_temp") {
        const c = [...Ze].sort((d, u) => Math.abs(d.kelvin - l) - Math.abs(u.kelvin - l))[0];
        n.push(o(s, c.key));
      }
    }
    return n.join(" · ") || o(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this._entity;
    if (!t)
      return h`<div class="card off missing"><span>${o(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = _e(t), s = $(t), i = st(t), n = W(t), a = yi(t, this._config.use_light_color !== !1), r = s ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};--fill:${a.fill}` : "";
    let l = this._size;
    l === "s42" && !this.getTerralSizes().some((u) => u.h === 4) && (l = "s22");
    const c = h`<button
      class="icon"
      aria-label="${s ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${I(s, l === "s11" ? 20 : 32)}
      ${n.length && s ? h`<span class="badge">${n.filter((u) => $(this.hass.states[u])).length}</span>` : f}
    </button>`, d = h`<div class="text">
      <span class="name">${this._name(t)}</span>
      <span class="state">${this._status(t, e)}</span>
    </div>`;
    return h`<div
      class="card ${l} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${r}
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
      ${l === "s11" || l === "s21" ? h`${c}${d}` : h`<div class="head">${c}${d}${this._quickButton(t, e, l)}</div>
            ${this._body(t, e, l)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !W(t).length) return f;
    const i = wt(t), n = i ? ts(i, z(this.hass)) ?? "" : "", a = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? N(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return h`<button class="pb" @click=${(r) => {
      r.stopPropagation(), this._openWindow();
    }}><i style=${a}></i>${n || (e === "color" ? o(this.hass, "more_colors") : o(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return h`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${tt(t) ?? 0}
      .label=${o(this.hass, "brightness")}
      @value-changed=${(s) => Je(this.hass, t.entity_id, s.detail.value)}
    >${fi(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = W(t);
    if (s === "s42" && i.length) {
      const a = [...i].sort((d, u) => Number($(this.hass.states[u])) - Number($(this.hass.states[d]))), r = e === "onoff" ? 5 : 4, l = a.length > r ? a.slice(0, r - 1) : a, c = a.length - l.length;
      return h`
        ${e !== "onoff" ? this._brightness(t) : f}
        <div class="members">
          ${l.map((d) => {
        const u = this.hass.states[d], p = $(u), m = u ? this.hass.formatEntityName?.(u) ?? u.attributes.friendly_name ?? d : d;
        return h`<div class="mr">
              <button class="mi ${p ? "lit" : ""}" ?disabled=${st(u)} aria-label="${p ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${m}"
                @click=${(_) => {
          _.stopPropagation(), u && Rt(this.hass, u);
        }}>${I(p, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${m}</span><small>${u ? $(u) ? tt(u) != null ? `${tt(u)} %` : o(this.hass, "on") : o(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${c > 0 ? h`<button class="morebtn" @click=${this._openWindow}>+ ${c} ${o(this.hass, "more")}</button>` : f}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? h`<div class="tags">
          ${i.slice(0, 4).map((a) => {
        const r = this.hass.states[a], l = r ? this.hass.formatEntityName?.(r) ?? r.attributes.friendly_name ?? a : a;
        return h`<span class="tag"><i class=${$(r) ? "lit" : ""}></i>${l}</span>`;
      })}
        </div>` : h`<div class="since">
        <span><b>${$(t) ? o(this.hass, "on") : o(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const a = t.attributes.min_color_temp_kelvin ?? 2e3, r = t.attributes.max_color_temp_kelvin ?? 6500;
      return h`
        <p class="lbl">${o(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${o(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${a} .max=${r} .value=${Qt(t) ?? 3500}
          .label=${o(this.hass, "temperature")}
          @value-changed=${(l) => we(this.hass, t, l.detail.value)}></terral-slider>
        <div class="chips">
          ${Ze.map((l) => h`<button class="chip" style="background:${l.css}" @click=${(c) => {
        c.stopPropagation(), we(this.hass, t, l.kelvin);
      }}>${o(this.hass, l.key)}</button>`)}
        </div>
      `;
    }
    const n = this._config?.favorite_colors?.map((a) => Array.isArray(a) ? a : a.rgb) ?? void 0;
    return h`
      <p class="lbl">${o(this.hass, "brightness")}</p>
      ${this._brightness(t, !0)}
      <p class="lbl">${o(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${t} .colors=${n}></terral-light-favs>
      <button class="pb wide" @click=${(a) => {
      a.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${o(this.hass, "more_colors")}</button>
    `;
  }
};
ot.styles = A`
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
F([
  v({ attribute: !1 })
], ot.prototype, "hass", 2);
F([
  v({ type: Boolean })
], ot.prototype, "preview", 2);
F([
  y()
], ot.prototype, "_config", 2);
F([
  y()
], ot.prototype, "_size", 2);
ot = F([
  M(Da)
], ot);
let kt = class extends D {
  render() {
    if (!this.hass || !this.entity) return f;
    const t = z(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: N(i) })) : Oa[t] ??= Pa(t), s = wt(this.entity);
    return e.slice(0, 6).map(
      (i) => h`<button
        class=${s && N(s) === N(i.rgb) ? "sel" : ""}
        style="background:${N(i.rgb)}"
        aria-label=${i.name}
        @click=${(n) => {
        n.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
kt.styles = A`
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
F([
  v({ attribute: !1 })
], kt.prototype, "hass", 2);
F([
  v({ attribute: !1 })
], kt.prototype, "entity", 2);
F([
  v({ attribute: !1 })
], kt.prototype, "colors", 2);
kt = F([
  M("terral-light-favs")
], kt);
const Oa = {}, Pa = (t) => _s.map((e) => ({ rgb: e.rgb, name: e.name[t] })), ja = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, Yi = ["away", "home", "night", "vacation", "custom"], Na = ["away", "home", "vacation"], os = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function lt(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const We = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : Yi.includes(e) ? e : void 0;
};
function $s(t) {
  return We(t.state) ?? We(t.attributes.arm_mode) ?? We(t.attributes.next_state);
}
function Vi(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? Yi.filter((s) => e & ja[s]) : ["away", "home"];
}
function Ce(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function La(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const ks = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, Ia = (t) => ks(t) != null && t.attributes.code_arm_required !== !1;
function Se(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function Ha(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const ls = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function Ra(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function Ua(t, e, s, i, n = !1) {
  if (Ra(t, e)) {
    const r = { entity_id: e.entity_id, mode: s };
    return i && (r.code = i), n && (r.force = !0), t.callService("alarmo", "arm", r);
  }
  const a = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", a, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function Wa(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function Ba(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function Gi(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), n = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(n, 150);
    };
    n();
  });
}
function qa(t, e, s, i, n, a = {}) {
  const r = async (d) => {
    const u = t(), p = u?.states[e];
    if (!u || !p) return { result: "wrong" };
    try {
      await Ua(u, p, s, d, a.force);
    } catch {
      return { result: "wrong", code: d };
    }
    const m = () => t()?.states[e];
    if (await Gi(() => {
      const b = m();
      return !!b && lt(b) !== "disarmed";
    })) return { result: "armed", code: d };
    const g = m();
    return { result: g && Se(g).length ? "refused" : "wrong", code: d };
  }, l = t()?.states[e];
  if (!l) return;
  const c = ks(l);
  if (a.code != null || !c || !Ia(l)) {
    r(a.code).then(n);
    return;
  }
  i(c, async (d) => {
    const u = await r(d);
    return u.result === "wrong" ? !1 : (n(u), !0);
  });
}
function Fa(t, e, s) {
  const i = async (r) => {
    const l = t(), c = l?.states[e];
    if (!l || !c) return !1;
    try {
      await Wa(l, c, r);
    } catch {
      return !1;
    }
    return Gi(() => {
      const d = t()?.states[e];
      return !!d && lt(d) === "disarmed";
    });
  }, n = t()?.states[e];
  if (!n) return;
  const a = ks(n);
  if (!a) {
    i();
    return;
  }
  s(a, i);
}
const Be = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), de = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function Ya(t) {
  const e = os[t];
  return {
    bg: de(Be(e, [255, 255, 255], 0.84), 0.95),
    fg: de(Be(e, [10, 10, 20], 0.82)),
    fg2: de(Be(e, [20, 10, 30], 0.72)),
    accent: de(e)
  };
}
const Qs = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var Va = Object.defineProperty, Ga = Object.getOwnPropertyDescriptor, zt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ga(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && Va(e, s, n), n;
};
let X = class extends C {
  constructor() {
    super(...arguments), this.format = "number", this._code = "", this._error = !1, this._busy = !1, this._onKeyboard = (t) => {
      this.format !== "number" || this._busy || (/^[0-9]$/.test(t.key) ? this._press(t.key) : t.key === "Backspace" ? this._erase() : t.key === "Enter" && this._send());
    };
  }
  get heading() {
    return o(this.hass, "code_title");
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
      return h`<form class="text" @submit=${(e) => {
        e.preventDefault(), this._send();
      }}>
        <input
          type="password"
          autocomplete="off"
          placeholder=${o(this.hass, "code_placeholder")}
          .value=${this._code}
          @input=${(e) => {
        this._error = !1, this._code = e.target.value;
      }}
        />
        <p class="err" aria-live="polite">${this._error ? o(this.hass, "code_wrong") : f}</p>
        <button class="okbtn" ?disabled=${!this._code || this._busy}>${o(this.hass, "ok")}</button>
      </form>`;
    const t = Math.max(4, this._code.length);
    return h`
      <div class="dots ${this._error ? "shake" : ""} ${this._busy ? "busy" : ""}" aria-label="${this._code.length}">
        ${Array.from({ length: t }, (e, s) => h`<i class=${s < this._code.length ? "f" : ""}></i>`)}
      </div>
      <p class="err" aria-live="polite">${this._error ? o(this.hass, "code_wrong") : f}</p>
      <div class="pad">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((e) => h`<button class="key" @click=${() => this._press(e)}>${e}</button>`)}
        <button class="key fn" aria-label=${o(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${Un(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${o(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${me(26)}</button>
      </div>
    `;
  }
};
X.styles = [
  C.styles,
  A`
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
zt([
  v()
], X.prototype, "format", 2);
zt([
  v({ attribute: !1 })
], X.prototype, "submit", 2);
zt([
  y()
], X.prototype, "_code", 2);
zt([
  y()
], X.prototype, "_error", 2);
zt([
  y()
], X.prototype, "_busy", 2);
X = zt([
  M("terral-code-sheet")
], X);
function Ki(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const ee = /* @__PURE__ */ new Map(), Ka = 6e4, se = "terral-alarm-refusal", Xi = () => window.dispatchEvent(new Event(se));
function Ae(t) {
  const e = ee.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > Ka || lt(t) !== "disarmed") {
      ee.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function Cs(t) {
  ee.delete(t) && Xi();
}
function Me(t, e, s, i = !1) {
  const n = t();
  if (!n) return;
  const a = ee.get(e), r = i ? { force: !0, code: a?.code } : {};
  Cs(e), qa(
    t,
    e,
    s,
    (l, c) => Ki(n, l, c),
    (l) => {
      l.result === "refused" && (ee.set(e, { mode: s, code: l.code, at: Date.now() }), Xi());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    r
  );
}
function qt(t, e) {
  const s = t();
  s && Fa(t, e, (i, n) => Ki(s, i, n));
}
const Xa = (t) => t.charAt(0).toLowerCase() + t.slice(1), Ee = (t, e) => o(t, `mode_${e}`);
function Qi(t, e, s) {
  const i = lt(e), n = $s(e), a = n ? Xa(Ee(t, n)) : "";
  if (Ae(e)) {
    const l = Se(e);
    return {
      title: o(t, "alarm_failed"),
      status: l.length > 1 ? o(t, "alarm_open_n", { n: l.length }) : o(t, "alarm_open", { name: l[0] ? ls(t, l[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: o(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${o(t, "alarm_arming", { mode: a })} · ${o(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${o(t, "alarm_armed", { mode: a })} · ${o(t, "alarm_since", { t: Qs(t, e.last_changed) })}` };
    case "pending":
      return { title: o(t, "alarm_pending"), status: o(t, "alarm_pending_sub") };
    case "triggered": {
      const l = Se(e), c = l.length ? ls(t, l[0]) + (l.length > 1 ? ` +${l.length - 1}` : "") : s;
      return { title: o(t, "alarm_triggered"), status: `${c} · ${Qs(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: o(t, "unavailable") };
  }
}
const Zi = (t) => {
  const e = Ce(t);
  return e == null ? null : Math.ceil(e);
};
var Qa = Object.defineProperty, Za = Object.getOwnPropertyDescriptor, re = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Za(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && Qa(e, s, n), n;
};
const Ji = (t, e = 20) => ({ away: Nn, home: Ln, night: In, vacation: Hn, custom: Rn })[t](e);
let ct = class extends C {
  constructor() {
    super(...arguments), this.entityId = "", this.name = "", this._tick = 0, this._refresh = () => this.requestUpdate(), this._getHass = () => this.hass;
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? h`<button class="hbtn" aria-label=${o(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${ae(19)}</button>` : f;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(se, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && Ce(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(se, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? h`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => h`<div class="row static"><span class="ic">${Ke(18)}</span><span class="nm">${ls(this.hass, s)}</span></div>`)}</div>
    </section>` : f;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return h`<p>${o(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = lt(e), n = $s(e), a = Ae(e), r = Zi(e), { title: l, status: c } = Qi(t, e, this.name), d = i === "armed" && n ? `rgb(${os[n].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", u = a || i === "pending" || i === "triggered" ? Ke(30) : i === "armed" ? bi(32) : Gt(32), p = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let m = f;
    a ? m = h`<div class="btns">
        <button class="big solid" @click=${() => Me(this._getHass, s, a.mode, !0)}>${yt()}<span>${o(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => Cs(s)}><span>${o(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? m = h`<section>
        <h3>${o(t, "arm_options")}</h3>
        <div class="list">
          ${Vi(e).map(
      (g) => h`<button class="row" @click=${() => Me(this._getHass, s, g)}>
              <span class="ic" style="color:rgb(${os[g].join(",")})">${Ji(g)}</span><span class="nm">${Ee(t, g)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? m = h`<div class="btns">
        <button class="big" @click=${() => qt(this._getHass, s)}>${De(20)}<span>${o(t, "cancel")}</span></button>
        ${p ? h`<button class="big" @click=${() => Ba(t, e)}>${Wn()}<span>${o(t, "skip_delay")}</span></button>` : f}
      </div>` : i !== "unavailable" && (m = h`<div class="btns"><button class="big solid" @click=${() => qt(this._getHass, s)}>${Kt()}<span>${o(t, "disarm")}</span></button></div>`);
    const _ = e.attributes.changed_by;
    return h`
      <div class="status st-${a ? "failed" : i}" style="--ac:${d}">
        <span class="sic">${u}</span>
        <div class="txt"><strong>${l}</strong><span>${c}</span></div>
        ${r != null ? h`<span class="secs">${r}</span>` : f}
      </div>
      <div class="scroll">
        ${m}
        ${this._sensorList(o(t, "open_sensors"), Se(e))}
        ${i === "armed" ? this._sensorList(o(t, "bypassed_sensors"), Ha(e)) : f}
        <p class="foot">${o(t, "changed_by")}: ${_ ? `${_} · ` : ""}${ui(t, e.last_changed)}</p>
      </div>
    `;
  }
};
ct.styles = [
  C.styles,
  A`
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
re([
  v()
], ct.prototype, "entityId", 2);
re([
  v()
], ct.prototype, "name", 2);
re([
  v({ attribute: !1 })
], ct.prototype, "onSettings", 2);
re([
  y()
], ct.prototype, "_tick", 2);
ct = re([
  M("terral-alarm-dialog")
], ct);
function Ja(t, e, s, i) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const n = document.createElement("terral-alarm-dialog");
  return n.hass = t, n.entityId = e, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function tr(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var er = Object.defineProperty, sr = Object.getOwnPropertyDescriptor, Ne = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? sr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && er(e, s, n), n;
};
const ir = "terral-home-alarm";
let Ct = class extends D {
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
      computeLabel: (t) => o(void 0, t.name === "entity" ? "alarm_entity" : "name")
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(se, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(se, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  get _name() {
    return this._config?.name || o(this.hass, "alarm");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || e.states[this._config.entity] !== this._entity;
  }
  updated(t) {
    t.has("hass") && this.hass && tr(this.hass);
    const e = this._entity, s = !!e && Ce(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && Ja(this.hass, this._config.entity, this._name, () => this.hass && this._config && je(this, this.hass, "alarm", this._config));
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = lt(t), i = Ae(t);
    if (i)
      return h`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => Me(this._getHass, e, i.mode, !0))}>${yt()}<span>${o(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => Cs(e))}><span>${o(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const n = Vi(t).filter((a) => Na.includes(a));
        return h`<div class="row ${n.length > 2 ? "three" : ""}">
          ${n.map(
          (a) => h`<button class="pb" aria-label=${o(this.hass, "arm_mode", { mode: Ee(this.hass, a) })} @click=${this._act(() => Me(this._getHass, e, a))}>
              ${Ji(a)}<span>${Ee(this.hass, a)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return h`<div class="row"><button class="pb" @click=${this._act(() => qt(this._getHass, e))}>${De(20)}<span>${o(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return h`<div class="row"><button class="pb" @click=${this._act(() => qt(this._getHass, e))}>${Kt()}<span>${o(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return h`<div class="row"><button class="pb solid" @click=${this._act(() => qt(this._getHass, e))}>${Kt()}<span>${o(this.hass, "disarm")}</span></button></div>`;
      default:
        return f;
    }
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this._entity;
    if (!t)
      return h`<div class="card off missing"><span>${o(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const e = lt(t), s = !!Ae(t), i = $s(t), n = e === "armed" && !!i, a = n ? Ya(i) : void 0, r = Zi(t), l = La(t), c = Ce(t), d = c != null && l ? c / l : 0, u = `${a ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};` : ""}--p:${d}`, p = s || e === "pending" || e === "triggered" ? Ke(28) : n ? bi(30) : Gt(30), { title: m, status: _ } = Qi(this.hass, t, this._name);
    return h`<div
      class="card ${n ? "on" : "off"} st-${s ? "failed" : e}"
      style=${u}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${m}, ${_}`}
      @click=${this._cardClick}
      @keydown=${(b) => {
      (b.key === "Enter" || b.key === " ") && b.target === b.currentTarget && (b.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(b) => b.preventDefault()}
    >
      <div class="head">
        <span class="icon">${p}</span>
        <div class="text"><span class="name">${m}</span><span class="state">${_}</span></div>
        ${r != null ? h`<span class="secs">${r}</span>` : f}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
Ct.styles = A`
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
Ne([
  v({ attribute: !1 })
], Ct.prototype, "hass", 2);
Ne([
  y()
], Ct.prototype, "_config", 2);
Ne([
  y()
], Ct.prototype, "_tick", 2);
Ct = Ne([
  M(ir)
], Ct);
const pe = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), ft = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, qe = [52, 199, 123], nr = [255, 149, 0], Zs = [90, 200, 250], Fe = "#b3261e", ar = "#3a3d4a", Js = (t, e, s, i, n) => `--bg:${ft(pe(t, [255, 255, 255], e), 0.95)};--bg-solid:${ft(pe(t, [255, 255, 255], e))};--fg:${ft(pe(i, [10, 10, 20], 0.8))};--fg2:${ft(pe(i, [20, 10, 30], 0.7))};--accent:${ft(s)};--lk:${n}`;
function Lt(t, e) {
  const s = t.states[e.entity], i = ws(t, e), n = ha(t, i), a = vs(t, i.power);
  if (!s || s.state === "unavailable" || s.state === "unknown")
    return { look: "unavailable", locked: !1, car: n, ids: i, kw: a, style: "", tinted: !1 };
  const r = la(s, !!e.invert);
  let l;
  r ? l = n === "connected" || n === "charging" ? "warn" : "locked" : n === "charging" ? l = "charging" : n === "connected" ? l = "ready" : l = "none";
  const c = l === "charging" ? Js(qe, 0.84, qe, qe, Fe) : l === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${ft(nr)};--lk:${Fe}` : l === "ready" ? Js(Zs, 0.8, Zs, [30, 110, 160], Fe) : `--lk:${ar}`;
  return { look: l, locked: r, car: n, ids: i, kw: a, style: c, tinted: l === "charging" || l === "warn" || l === "ready" };
}
function It(t, e, s) {
  const i = e.kw != null ? `${L(t, e.kw)} kW` : "";
  switch (e.look) {
    case "charging":
      return s ? i || o(t, "ch_charging") : i ? `${o(t, "ch_charging")} · ${i}` : o(t, "ch_charging");
    case "warn":
      return s ? o(t, "ch_locked") : o(t, "ch_locked_car");
    case "ready":
      return s ? o(t, "ch_connected") : o(t, "ch_ready");
    case "locked":
      return o(t, "ch_locked");
    case "unavailable":
      return o(t, "unavailable");
    default:
      return e.car === "none" ? o(t, "ch_none") : o(t, "ch_unlocked");
  }
}
var rr = Object.defineProperty, or = Object.getOwnPropertyDescriptor, Tt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? or(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && rr(e, s, n), n;
};
let Q = class extends C {
  constructor() {
    super(...arguments), this.name = "", this._histError = !1;
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? h`<button class="hbtn" aria-label=${o(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${ae(19)}</button>` : f;
  }
  updated() {
    if (!this.hass) return;
    const t = ws(this.hass, this.config).power;
    t && t !== this._histFor && (this._histFor = t, this._load(t));
  }
  async _load(t) {
    try {
      const e = Date.now(), s = await Mi(this.hass, t, new Date(e - 7 * 864e5));
      this._sessions = Ei(s, e), this._histError = !1;
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
    if (!e) return h`<p>${o(t, "not_found")}</p>`;
    const s = Lt(t, this.config), i = $i(t, s.ids.energy), n = this._sessions?.find((g) => g.live), a = s.look === "charging" && i != null ? o(t, "this_charge", { kwh: `${L(t, i)} kWh`, time: n ? ss(Date.now() - n.start) : "" }).replace(/ · $/, "") : i != null ? `${o(t, "last_session")}: ${L(t, i)} kWh` : "", r = this._sessions ? zi(this._sessions, 7) : void 0, l = r ? Math.max(...r.map((g) => g.kwh), 0.1) : 1, c = r?.reduce((g, b) => g + b.kwh, 0) ?? 0, d = this._sessions?.length ?? 0, u = [...this._sessions ?? []].reverse().slice(0, 5), p = t.locale?.language ?? t.language ?? void 0, m = (g, b) => b === 6 ? p?.startsWith("es") ? "Hoy" : "Today" : g.toLocaleDateString(p, { weekday: "narrow" }), _ = (g) => {
      const b = new Date(g), S = /* @__PURE__ */ new Date(), j = new Date(S.getFullYear(), S.getMonth(), S.getDate() - 1), Dt = b.toLocaleTimeString(p, { hour: "2-digit", minute: "2-digit" }), Es = p?.startsWith("es");
      if (b.toDateString() === S.toDateString()) return `${Es ? "Hoy" : "Today"} · ${Dt}`;
      if (b.toDateString() === j.toDateString()) return `${Es ? "Ayer" : "Yesterday"} · ${Dt}`;
      const zs = b.toLocaleDateString(p, { weekday: "long", day: "numeric" });
      return `${zs.charAt(0).toUpperCase()}${zs.slice(1)} · ${Dt}`;
    };
    return h`
      <div class="status ${s.tinted ? "on" : ""}" style=${s.style}>
        <button class="icon" aria-label=${s.locked ? o(t, "unlock") : o(t, "lock")} @click=${() => es(t, e, !s.locked, !!this.config.invert)}>
          ${Xt(32)}${s.locked ? h`<span class="lk">${yt(14)}</span>` : f}
        </button>
        <div class="txt"><strong>${It(t, s, !1)}</strong>${a ? h`<span>${a}</span>` : f}</div>
      </div>
      ${s.look !== "unavailable" ? h`<button class="big ${s.locked ? "solid" : ""}" @click=${() => es(t, e, !s.locked, !!this.config.invert)}>
            ${s.locked ? Kt() : yt()}<span>${s.locked ? o(t, "unlock") : o(t, "lock")}</span>
          </button>` : f}
      <div class="scroll">
        ${s.ids.power ? h`
              <section>
                <h3>${o(t, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError ? h`<p class="empty">${o(t, "history_unavailable")}</p>` : h`<div class="week">
                          ${(r ?? Array.from({ length: 7 }, (g, b) => ({ day: new Date(Date.now() - (6 - b) * 864e5), kwh: 0 }))).map(
      (g, b) => h`<div>
                              <i class=${b === 6 ? "today" : g.kwh ? "" : "zero"} style="height:${g.kwh ? Math.max(6, g.kwh / l * 62) : 3}px"></i>
                              <span>${m(g.day, b)}</span>
                            </div>`
    )}
                        </div>
                        <div class="sum"><span>${o(t, "week_total")} <b>${L(t, c)} kWh</b></span><span>${d} ${p?.startsWith("es") ? d === 1 ? "carga" : "cargas" : d === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${o(t, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? h`<p class="empty">…</p>` : f}
                  ${this._sessions && !u.length ? h`<p class="empty">${o(t, "no_history")}</p>` : f}
                  ${u.map(
      (g) => h`<div class="sess">
                      <span class="dot">${Bn()}</span>
                      <span class="nm">
                        <span>${_(g.start)}${g.live ? h`<em>${o(t, "charging_now")}</em>` : f}</span>
                        <small>${g.live ? `${o(t, "in_progress")} · ` : ""}${ss(g.end - g.start)}${g.live ? "" : ` · ${o(t, "max_kw", { kw: `${L(t, g.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${L(t, g.kwh)} kWh</span>
                    </div>`
    )}
                </div>
              </section>` : f}
      </div>
    `;
  }
};
Q.styles = [
  C.styles,
  A`
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
Tt([
  v({ attribute: !1 })
], Q.prototype, "config", 2);
Tt([
  v()
], Q.prototype, "name", 2);
Tt([
  v({ attribute: !1 })
], Q.prototype, "onSettings", 2);
Tt([
  y()
], Q.prototype, "_sessions", 2);
Tt([
  y()
], Q.prototype, "_histError", 2);
Q = Tt([
  M("terral-charger-dialog")
], Q);
function lr(t, e, s, i) {
  document.querySelector("terral-charger-dialog")?.remove();
  const n = document.createElement("terral-charger-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function cr(t) {
  for (const e of document.querySelectorAll("terral-charger-dialog")) e.hass = t;
}
var hr = Object.defineProperty, dr = Object.getOwnPropertyDescriptor, pt = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? dr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && hr(e, s, n), n;
};
const pr = "terral-home-charger";
let B = class extends D {
  constructor() {
    super(...arguments), this._size = "s22", this._spark = [], this._held = !1, this._toggle = (t) => {
      if (t.stopPropagation(), !this.hass || !this._config) return;
      const e = this.hass.states[this._config.entity];
      if (!e) return;
      const s = Lt(this.hass, this._config);
      s.look !== "unavailable" && es(this.hass, e, !s.locked, !!this._config.invert);
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
      computeLabel: (t) => o(void 0, { entity: "charger_entity", invert: "ch_invert", name: "name", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy", max_power: "ch_max" }[t.name] ?? "name")
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._histTimer), this._histTimer = void 0, this._histFor = void 0, this._cancelHold();
  }
  /** Opens the window straight on its settings page (used right after adding the card). */
  openSettings() {
    this._openWindow("settings");
  }
  get _name() {
    return this._config?.name || o(this.hass, "charger");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1 || !this._config) return !0;
    const e = t.get("hass");
    if (!e || !this.hass) return !0;
    const s = Lt(this.hass, this._config).ids;
    return [this._config.entity, s.status, s.power, s.energy].some((i) => i && e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (!this.hass || !this._config) return;
    t.has("hass") && cr(this.hass);
    const e = Lt(this.hass, this._config);
    if (this._size === "s42" && e.ids.power) {
      this._histFor !== e.ids.power && (this._histFor = e.ids.power, this._loadHistory(e.ids.power), clearInterval(this._histTimer), this._histTimer = window.setInterval(() => this._loadHistory(e.ids.power), 30 * 6e4));
      const s = vs(this.hass, e.ids.power), i = this._spark[this._spark.length - 1];
      if (s != null && (!i || i[1] !== s)) {
        const n = Date.now();
        this._spark = [...this._spark.filter(([a]) => n - a < 36e5), [n, s]], e.look === "charging" && !this._sessionStart && (this._sessionStart = n), e.look !== "charging" && (this._sessionStart = void 0);
      }
    }
  }
  async _loadHistory(t) {
    if (this.hass)
      try {
        const e = Date.now(), s = await Mi(this.hass, t, new Date(e - 7 * 864e5)), i = Ei(s, e);
        this._week = zi(i, 7).reduce((a, r) => a + r.kwh, 0);
        const n = i.find((a) => a.live);
        this._sessionStart = n?.start, this._spark = s.filter(([a]) => e - a < 36e5);
      } catch {
        this._week = void 0;
      }
  }
  _openWindow(t = "main") {
    if (!this.hass || !this._config) return;
    const e = () => this.hass && this._config && je(this, this.hass, "charger", this._config);
    if (t === "settings") return e();
    lr(this.hass, this._config, this._name, e);
  }
  // ---- Render ---------------------------------------------------------------
  _icon(t, e) {
    return h`<button class="icon" aria-label=${t.locked ? o(this.hass, "unlock") : o(this.hass, "lock")} ?disabled=${t.look === "unavailable"} @click=${this._toggle}>
      ${Xt(e)}
      ${t.locked ? h`<span class="lk">${yt(14)}</span>` : f}
    </button>`;
  }
  _lockBtn(t) {
    return t.look === "unavailable" ? f : h`<button class="pb ${t.locked && t.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${t.locked ? Kt(19) : yt(19)}<span>${t.locked ? o(this.hass, "unlock") : o(this.hass, "lock")}</span>
    </button>`;
  }
  _sparkline() {
    const t = this._spark;
    if (t.length < 2) return f;
    const e = 300, s = 58, i = Date.now(), n = Math.max(this._config?.max_power ?? 0, ...t.map((c) => c[1]), 1), a = t.map(([c, d]) => [Math.max(0, e - (i - c) / 36e5 * e), s - 4 - d / n * (s - 10)]);
    a.push([e, a[a.length - 1][1]]);
    const r = a.map((c, d) => `${d ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" "), l = a[a.length - 1];
    return x`<svg class="spark" viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${r} L${e} ${s} L${a[0][0]} ${s}Z"></path><path class="l" d=${r}></path><circle cx=${l[0]} cy=${l[1]} r="4"></circle></svg>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass;
    if (!t.states[this._config.entity])
      return h`<div class="card off missing"><span>${o(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = Lt(t, this._config), i = this._size, n = $i(t, s.ids.energy), a = s.kw != null ? `${L(t, s.kw)} kW` : "", r = n != null ? `${L(t, n)} kWh` : "", l = s.look === "charging", c = this._name;
    let d;
    if (i === "s11")
      d = h`${this._icon(s, 22)}<div class="text"><span class="name">${c}</span><span class="state">${It(t, s, !0)}</span></div>`;
    else if (i === "s21") {
      const u = l && r ? [a, r].filter(Boolean).join(" · ") : It(t, s, !0);
      d = h`${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${u}</span></div>`;
    } else {
      const u = h`<div class="head">${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${It(t, s, !1)}</span></div></div>`;
      if (i === "s22")
        d = h`${u}<div class="row">
          ${l && (a || r) ? h`${a ? h`<div class="pb static"><span>${a}</span></div>` : f}
                ${r ? h`<div class="pb static">${Bs()}<span>${r}</span></div>` : f}` : this._lockBtn(s)}
        </div>`;
      else {
        const p = this._sessionStart ?? (s.ids.status ? new Date(t.states[s.ids.status]?.last_changed ?? Date.now()).getTime() : void 0);
        d = h`${u}
          ${l ? h`<div class="chart flow">
                  <div class="chead"><span class="big">${s.kw != null ? L(t, s.kw) : "–"}<small>kW</small></span><span class="state">${o(t, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${r ? h`<div class="pb static">${Bs()}<span>${r}</span></div>` : f}
                  ${p ? h`<div class="pb static">${qn()}<span>${ss(Date.now() - p)}</span></div>` : f}
                </div>` : h`<div class="stats">
                ${r ? h`<div class="stat"><b>${r}</b><span>${o(t, "last_session")}</span></div>` : f}
                ${this._week != null ? h`<div class="stat"><b>${L(t, this._week)} kWh</b><span>${o(t, "this_week")}</span></div>` : f}
              </div>`}
          <div class="spacer"></div>
          <div class="row">${this._lockBtn(s)}</div>`;
      }
    }
    return h`<div
      class="card ${i} ${s.tinted ? "on" : "off"} look-${s.look}"
      style=${s.style}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${c}, ${It(t, s, !1)}`}
      @click=${this._cardClick}
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >${d}</div>`;
  }
};
B.styles = A`
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
pt([
  v({ attribute: !1 })
], B.prototype, "hass", 2);
pt([
  y()
], B.prototype, "_config", 2);
pt([
  y()
], B.prototype, "_size", 2);
pt([
  y()
], B.prototype, "_spark", 2);
pt([
  y()
], B.prototype, "_week", 2);
pt([
  y()
], B.prototype, "_sessionStart", 2);
B = pt([
  M(pr)
], B);
var ur = Object.defineProperty, gr = Object.getOwnPropertyDescriptor, Le = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? gr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && ur(e, s, n), n;
};
let St = class extends D {
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
    return h`<div class="backdrop" @pointerdown=${this._swallow} @touchmove=${this._swallow} @wheel=${this._swallow} @click=${this._backdropClick}></div>
      <div class="pop" role="menu">
      ${this.items.map(
      (t) => h`<button role="menuitemradio" aria-checked=${!!t.selected} class=${t.selected ? "sel" : ""} @click=${() => {
        t.run(), this.remove();
      }}>${t.icon ?? f}<span>${t.label}</span></button>`
    )}
    </div>`;
  }
};
St.styles = A`
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
Le([
  v({ attribute: !1 })
], St.prototype, "items", 2);
Le([
  v({ attribute: !1 })
], St.prototype, "anchor", 2);
Le([
  v()
], St.prototype, "align", 2);
St = Le([
  M("terral-pop")
], St);
function ti(t, e, s = "left") {
  document.querySelector("terral-pop")?.remove();
  const i = document.createElement("terral-pop");
  return i.items = e, i.anchor = t.getBoundingClientRect(), i.align = s, document.body.appendChild(i), i;
}
var fr = Object.defineProperty, mr = Object.getOwnPropertyDescriptor, oe = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? mr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && fr(e, s, n), n;
};
let ht = class extends C {
  constructor() {
    super(...arguments), this.name = "";
  }
  get heading() {
    return this.name;
  }
  renderHeaderEnd() {
    return this.onSettings ? h`<button class="hbtn" aria-label=${o(this.hass, "settings")} @click=${() => {
      const t = this.onSettings;
      this.close(), t();
    }}>${ae(19)}</button>` : f;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  _step(t, e) {
    const s = Wt(t, this.config), i = this._pending ?? rs(t);
    if (i == null) return;
    const n = typeof i == "number" ? it(i + e * s.step, s) : e > 0 ? { low: i.low, high: it(i.high + s.step, s) } : { low: it(i.low - s.step, s), high: i.high };
    this._pending = n, clearTimeout(this._timer), this._timer = window.setTimeout(() => {
      Ri(this.hass, t, n), window.setTimeout(() => this._pending = void 0, 2500);
    }, 650);
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return h`<p>${o(t, "not_found")}</p>`;
    const s = z(t), i = T(e), n = bt(e, this.config), a = Pi(e, this.config), r = this._pending ?? rs(e), l = Bt(e), c = Zt(e), d = V(e), u = fa(e), p = this.config.show_swing === !0 && Di(e), m = e.attributes.swing_mode != null && e.attributes.swing_mode !== "off", _ = [l != null ? `${s === "es" ? "Dentro" : "Inside"} ${G(t, l)}°` : "", qi(t, e)].filter(Boolean).join(" · ");
    return h`
      <div class="status ${i ? "" : "on"}" style=${Bi(e)}>
        <button class="icon" aria-label=${i ? o(t, "turn_on") : o(t, "turn_off")} ?disabled=${_t(e)} @click=${() => i ? Li(t, e) : Ii(t, e)}>
          ${xt(i ? "off" : e.state, 30)}
        </button>
        <div class="txt">
          <strong>${i ? s === "es" ? "Apagado" : "Off" : n ? `${H(s, e.state)} · ${te(t, r)}` : H(s, e.state)}</strong>
          ${_ ? h`<span>${_}</span>` : f}
        </div>
      </div>
      <div class="scroll">
        <section class=${n ? "" : "dim"}>
          <h3>${o(t, "temperature")}</h3>
          <div class="wstep">
            <button aria-label="−" ?disabled=${!n} @click=${() => this._step(e, -1)}>${fs()}</button>
            <span class="v">${n ? te(t, r) : i ? "—" : o(t, "no_temperature")}</span>
            <button aria-label="+" ?disabled=${!n} @click=${() => this._step(e, 1)}>${ms()}</button>
          </div>
        </section>
        ${d.length > 1 ? h`<section>
              <h3>${o(t, "climate_mode")}</h3>
              <div class="grid">
                ${d.map((g) => h`<button class="opt ${!i && e.state === g ? "sel" : ""}" @click=${() => Jt(t, e, g)}>${xt(g, 22)}<span>${H(s, g)}</span></button>`)}
              </div>
            </section>` : f}
        ${c.length ? h`<section class=${a ? "" : "dim"}>
              <h3>${o(t, "climate_fan")}</h3>
              <div class="grid small" style="grid-template-columns:repeat(${Math.min(c.length, 4)},1fr)">
                ${c.map((g) => h`<button class="opt ${e.attributes.fan_mode === g ? "sel" : ""}" ?disabled=${!a} @click=${() => Hi(t, e, g)}><span>${ns(s, g)}</span></button>`)}
              </div>
              ${a ? f : h`<p class="note">${i ? o(t, "climate_off_note") : o(t, "fan_fixed", { mode: H(s, e.state) })}</p>`}
            </section>` : f}
        ${p ? h`<div class="list"><button class="li" role="switch" aria-checked=${m} ?disabled=${i} @click=${() => ba(t, e, !m)}>
              <span class="nm">${o(t, "swing")}</span><span class="tog ${m ? "on" : ""}"></span>
            </button></div>` : f}
        ${u.length ? h`<section>
              <h3>${o(t, "presets")}</h3>
              <div class="grid small">
                ${u.map((g) => h`<button class="opt ${e.attributes.preset_mode === g ? "sel" : ""}" ?disabled=${i} @click=${() => _a(t, e, g)}><span>${ns(s, g)}</span></button>`)}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
ht.styles = [
  C.styles,
  A`
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
oe([
  v({ attribute: !1 })
], ht.prototype, "config", 2);
oe([
  v()
], ht.prototype, "name", 2);
oe([
  v({ attribute: !1 })
], ht.prototype, "onSettings", 2);
oe([
  y()
], ht.prototype, "_pending", 2);
ht = oe([
  M("terral-climate-dialog")
], ht);
function _r(t, e, s, i) {
  document.querySelector("terral-climate-dialog")?.remove();
  const n = document.createElement("terral-climate-dialog");
  return n.hass = t, n.config = { ...e }, n.name = s, n.onSettings = i, document.body.appendChild(n), n;
}
function br(t) {
  for (const e of document.querySelectorAll("terral-climate-dialog")) e.hass = t;
}
var xr = Object.defineProperty, vr = Object.getOwnPropertyDescriptor, le = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? vr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && xr(e, s, n), n;
};
const yr = "terral-home-climate";
class wr {
  constructor(e) {
    this.onChange = e;
  }
  set(e, s, i) {
    this.value = i, this.onChange(), clearTimeout(this.timer), this.timer = window.setTimeout(() => {
      Ri(e, s, i), window.setTimeout(() => {
        this.value = void 0, this.onChange();
      }, 2500);
    }, 650);
  }
}
let dt = class extends D {
  constructor() {
    super(...arguments), this._size = "s22", this._tick = 0, this._pending = new wr(() => this._tick++), this._held = !1, this._dragging = !1, this._power = (t) => {
      t.stopPropagation();
      const e = this._entity;
      !e || !this.hass || _t(e) || (T(e) ? Li(this.hass, e) : Ii(this.hass, e));
    }, this._modeMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = z(this.hass);
      ti(t.currentTarget, V(e).map((i) => ({
        label: H(s, i),
        icon: xt(i, 21),
        selected: !T(e) && e.state === i,
        run: () => Jt(this.hass, e, i)
      })));
    }, this._fanMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = z(this.hass);
      ti(t.currentTarget, Zt(e).map((i) => ({
        label: ns(s, i),
        icon: Xe(21),
        selected: e.attributes.fan_mode === i,
        run: () => Hi(this.hass, e, i)
      })), "right");
    }, this._dialDown = (t) => {
      const e = this._entity;
      !e || !this._config || !bt(e, this._config) || (t.stopPropagation(), this._cancelHold(), this._dragging = !0, t.currentTarget.setPointerCapture(t.pointerId), this._dialMove(t));
    }, this._dialMove = (t) => {
      if (!this._dragging || !this.hass || !this._config) return;
      const e = this._entity;
      if (!e) return;
      const s = t.currentTarget.getBoundingClientRect(), i = s.left + s.width / 2, n = s.top + s.height * 100 / 180;
      let r = 225 - Math.atan2(n - t.clientY, t.clientX - i) * 180 / Math.PI;
      r < 0 && (r += 360), r > 300 && (r = 0);
      const l = Wt(e, this._config), c = it(l.min + Math.min(1, r / 270) * (l.max - l.min), l), d = this._target(e);
      d != null && typeof d == "object" ? this._pending.set(this.hass, e, { low: Math.min(d.low, c - l.step), high: c }) : this._pending.set(this.hass, e, c);
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
    return this._config?.name || this._entity?.attributes.friendly_name || o(this.hass, "type_climate");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || e.states[this._config.entity] !== this._entity;
  }
  updated(t) {
    if (t.has("hass") && this.hass) {
      br(this.hass);
      const e = this._entity;
      e && Ni(e);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  _target(t) {
    return this._pending.value ?? rs(t);
  }
  _step(t) {
    return (e) => {
      e.stopPropagation();
      const s = this._entity;
      if (!s || !this.hass || !this._config) return;
      const i = Wt(s, this._config), n = this._target(s);
      n != null && (typeof n == "number" ? this._pending.set(this.hass, s, it(n + t * i.step, i)) : t > 0 ? this._pending.set(this.hass, s, { low: n.low, high: it(n.high + i.step, i) }) : this._pending.set(this.hass, s, { low: it(n.low - i.step, i), high: n.high }));
    };
  }
  _openWindow() {
    !this.hass || !this._config || _r(this.hass, this._config, this._name, () => this.hass && this._config && je(this, this.hass, "climate", this._config));
  }
  // ---- Render -------------------------------------------------------------------
  _pct(t) {
    if (!this._config || !bt(t, this._config)) return 0;
    const e = Wt(t, this._config), s = this._target(t);
    if (s == null) return 0;
    const i = typeof s == "number" ? s : s.high;
    return Math.max(0, Math.min(1, (i - e.min) / (e.max - e.min)));
  }
  _icon(t, e) {
    return h`<button class="icon" aria-label=${T(t) ? o(this.hass, "turn_on") : o(this.hass, "turn_off")} ?disabled=${_t(t)} @click=${this._power}>
      ${xt(T(t) ? "off" : t.state, e)}
    </button>`;
  }
  _modeBtn(t) {
    return V(t).length < 2 ? f : h`<button class="rbtn" aria-label=${o(this.hass, "climate_mode")} ?disabled=${_t(t)} @click=${this._modeMenu}>
      ${xt(T(t) ? V(t)[0] ?? "off" : t.state, 22)}
    </button>`;
  }
  _fanBtn(t) {
    const e = Zt(t);
    if (!e.length) return f;
    const s = Pi(t, this._config), i = t.attributes.fan_mode;
    return h`<button class="rbtn" aria-label=${o(this.hass, "climate_fan")} ?disabled=${!s} @click=${this._fanMenu}>
      ${Xe(22)}${i ? h`<span class="tag">${wa(e, i)}</span>` : f}
    </button>`;
  }
  _stepper(t) {
    const e = this.hass, s = bt(t, this._config), i = this._target(t), n = Bt(t), a = s ? h`<span class="v ${typeof i == "object" ? "range" : ""}">${te(e, i)}</span>` : h`<span class="v muted">${T(t) ? n != null ? `${G(e, n)}° ${z(e) === "es" ? "dentro" : "inside"}` : "—" : o(e, "no_temperature")}</span>`;
    return h`<div class="step ${s ? "" : "dis"}">
      <button aria-label="−" ?disabled=${!s} @click=${this._step(-1)}>${fs()}</button>
      ${a}
      <button aria-label="+" ?disabled=${!s} @click=${this._step(1)}>${ms()}</button>
    </div>`;
  }
  _dial(t) {
    const e = this.hass, s = z(e), i = 86, n = 2 * Math.PI * i, a = n * 0.75, r = this._pct(t), l = (225 - r * 270) * Math.PI / 180, c = 114 + i * Math.cos(l), d = 100 - i * Math.sin(l), u = bt(t, this._config), p = Bt(t), m = p != null ? `${G(e, p)}°` : "—", _ = this._target(t), g = u ? te(e, _) : m, b = T(t) ? `${s === "es" ? "dentro · apagado" : "inside · off"}` : u ? `${H(s, t.state)} · ${s === "es" ? "dentro" : "inside"} ${m}` : `${H(s, t.state)} · ${s === "es" ? "dentro" : "inside"}`;
    return h`<div class="dial ${u ? "" : "disabled"}" @pointerdown=${this._dialDown} @pointermove=${this._dialMove} @pointerup=${this._dialUp} @pointercancel=${this._dialUp}>
      ${x`<svg viewBox="0 0 228 180" aria-hidden="true">
        <circle class="trk" cx="114" cy="100" r=${i} stroke-dasharray="${a} ${n}" transform="rotate(135 114 100)"></circle>
        ${r ? x`<circle class="val" cx="114" cy="100" r=${i} stroke-dasharray="${a * r} ${n}" transform="rotate(135 114 100)"></circle>
          <circle class="thumb" cx=${c} cy=${d} r="12"></circle>` : f}
      </svg>`}
      <div class="mid"><b class=${typeof _ == "object" && u ? "range" : ""}>${g}</b><span>${b}</span></div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return f;
    const t = this.hass, e = this._entity;
    if (!e) return h`<div class="card off missing"><span>${o(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const s = this._size, i = this._name, n = this._target(e), a = T(e), r = Xs(t, e, this._config, n, !1), l = Xs(t, e, this._config, n, !0), c = z(t);
    let d;
    if (s === "s11")
      d = h`${this._icon(e, 21)}<div class="text"><span class="name">${i}</span><span class="state">${l}</span></div>`;
    else if (s === "s21") {
      const u = Bt(e), p = u != null ? ` · ${G(t, u)}° ${c === "es" ? "dentro" : "inside"}` : "";
      d = h`${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${a ? r : l + p}</span></div>`;
    } else if (s === "s22")
      d = h`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${r}</span></div></div>
        <div class="row">${this._modeBtn(e)}${this._stepper(e)}${this._fanBtn(e)}</div>`;
    else {
      const u = qi(t, e), p = a ? c === "es" ? "Apagado" : "Off" : [as(c, e.state), u].filter(Boolean).join(" · ");
      d = h`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${p}</span></div></div>
        ${this._dial(e)}
        <div class="bottom">${this._modeBtn(e) === f ? h`<span></span>` : this._modeBtn(e)}${this._fanBtn(e)}</div>`;
    }
    return h`<div
      class="card ${s} ${a ? "off" : "on"} ${_t(e) ? "unavailable" : ""}"
      style=${Bi(e)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${i}, ${r}`}
      @click=${this._cardClick}
      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && u.target === u.currentTarget && (u.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(u) => u.preventDefault()}
    >${d}</div>`;
  }
};
dt.styles = A`
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
le([
  v({ attribute: !1 })
], dt.prototype, "hass", 2);
le([
  y()
], dt.prototype, "_config", 2);
le([
  y()
], dt.prototype, "_size", 2);
le([
  y()
], dt.prototype, "_tick", 2);
dt = le([
  M(yr)
], dt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $r = { CHILD: 2 }, kr = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Cr = class {
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
const { I: Sr } = vn, ei = (t) => t, si = () => document.createComment(""), Nt = (t, e, s) => {
  const i = t._$AA.parentNode, n = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const a = i.insertBefore(si(), n), r = i.insertBefore(si(), n);
    s = new Sr(a, r, t, t.options);
  } else {
    const a = s._$AB.nextSibling, r = s._$AM, l = r !== t;
    if (l) {
      let c;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (c = t._$AU) !== r._$AU && s._$AP(c);
    }
    if (a !== n || l) {
      let c = s._$AA;
      for (; c !== a; ) {
        const d = ei(c).nextSibling;
        ei(i).insertBefore(c, n), c = d;
      }
    }
  }
  return s;
}, J = (t, e, s = t) => (t._$AI(e, s), t), Ar = {}, Mr = (t, e = Ar) => t._$AH = e, Er = (t) => t._$AH, Ye = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ii = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= s; n++) i.set(t[n], n);
  return i;
}, ni = kr(class extends Cr {
  constructor(t) {
    if (super(t), t.type !== $r.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const n = [], a = [];
    let r = 0;
    for (const l of t) n[r] = i ? i(l, r) : r, a[r] = s(l, r), r++;
    return { values: a, keys: n };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const n = Er(t), { values: a, keys: r } = this.dt(e, s, i);
    if (!Array.isArray(n)) return this.ut = r, a;
    const l = this.ut ??= [], c = [];
    let d, u, p = 0, m = n.length - 1, _ = 0, g = a.length - 1;
    for (; p <= m && _ <= g; ) if (n[p] === null) p++;
    else if (n[m] === null) m--;
    else if (l[p] === r[_]) c[_] = J(n[p], a[_]), p++, _++;
    else if (l[m] === r[g]) c[g] = J(n[m], a[g]), m--, g--;
    else if (l[p] === r[g]) c[g] = J(n[p], a[g]), Nt(t, c[g + 1], n[p]), p++, g--;
    else if (l[m] === r[_]) c[_] = J(n[m], a[_]), Nt(t, n[p], n[m]), m--, _++;
    else if (d === void 0 && (d = ii(r, _, g), u = ii(l, p, m)), d.has(l[p])) if (d.has(l[m])) {
      const b = u.get(r[_]), S = b !== void 0 ? n[b] : null;
      if (S === null) {
        const j = Nt(t, n[p]);
        J(j, a[_]), c[_] = j;
      } else c[_] = J(S, a[_]), Nt(t, n[p], S), n[b] = null;
      _++;
    } else Ye(n[m]), m--;
    else Ye(n[p]), p++;
    for (; _ <= g; ) {
      const b = Nt(t, c[g + 1]);
      J(b, a[_]), c[_++] = b;
    }
    for (; p <= m; ) {
      const b = n[p++];
      b !== null && Ye(b);
    }
    return this.ut = r, Mr(t, c), at;
  }
});
function zr(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const Tr = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function Dr(t) {
  return Tr[t];
}
var Or = Object.defineProperty, Pr = Object.getOwnPropertyDescriptor, Ss = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Pr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && Or(e, s, n), n;
};
const jr = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>`, Nr = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M5 4v12M19 4v12M5 8h14M5 12h14M5 16h14M12 16v4"></path></svg>`, Lr = (t = 20) => x`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"></path><path d="M12 18l4-6"></path></svg>`, Ir = [
  { type: "light", name: "type_light", desc: "type_light_desc", icon: () => I(!0, 20), color: "#ffb020" },
  { type: "alarm", name: "type_alarm", desc: "type_alarm_desc", icon: () => Gt(20), color: "rgba(255,255,255,.18)" },
  { type: "charger", name: "ev_charger", desc: "type_charger_desc", icon: () => Xt(20), color: "#34c77b" },
  { type: "climate", name: "type_climate", desc: "type_climate_desc", icon: () => jr(), color: "#4696ff" }
], Hr = [
  { name: "type_cover", icon: () => Nr() },
  { name: "type_sensor", icon: () => Lr() }
];
let ie = class extends C {
  constructor() {
    super(...arguments), this._q = "";
  }
  get heading() {
    return o(this.hass, "add_card");
  }
  renderContent() {
    const t = this._q.trim().toLowerCase(), e = (a, r) => !t || o(this.hass, a).toLowerCase().includes(t) || r && o(this.hass, r).toLowerCase().includes(t), s = Ir.filter((a) => e(a.name, a.desc)), i = (a) => a === "alarm" && !Object.keys(this.hass.states).some((r) => r.startsWith("alarm_control_panel.")) ? "alarm_missing" : a === "climate" && !Object.keys(this.hass.states).some((r) => r.startsWith("climate.")) ? "climate_missing" : void 0, n = Hr.filter((a) => e(a.name));
    return h`
      <label class="search">
        ${mi()}
        <input type="search" placeholder=${o(this.hass, "search_card_types")} .value=${this._q}
          @input=${(a) => this._q = a.target.value} />
      </label>
      <div class="scroll">
        ${s.length ? h`<section>
              <h3>${o(this.hass, "available")}</h3>
              <div class="list">
                ${s.map((a) => {
      const r = i(a.type);
      return h`<button class="row ${r ? "soon" : ""}" ?disabled=${!!r} @click=${() => {
        this.close(), this.onType?.(a.type);
      }}>
                    <span class="ic" style="background:${r ? "rgba(255,255,255,.14)" : a.color}">${a.icon()}</span>
                    <span class="nm">${o(this.hass, a.name)}<small>${o(this.hass, r ?? a.desc)}</small></span>
                    ${r ? f : h`<span class="chev">${ye(!1, 16)}</span>`}
                  </button>`;
    })}
              </div>
            </section>` : f}
        ${n.length ? h`<section>
              <h3>${o(this.hass, "coming_soon")}</h3>
              <div class="list">
                ${n.map(
      (a) => h`<div class="row soon">
                    <span class="ic">${a.icon()}</span>
                    <span class="nm">${o(this.hass, a.name)}<small>${o(this.hass, "coming_soon")}</small></span>
                  </div>`
    )}
              </div>
            </section>` : f}
      </div>
    `;
  }
};
ie.styles = [
  C.styles,
  A`
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
Ss([
  v({ attribute: !1 })
], ie.prototype, "onType", 2);
Ss([
  y()
], ie.prototype, "_q", 2);
ie = Ss([
  M("terral-add-sheet")
], ie);
function Rr(t, e) {
  const s = document.createElement("terral-add-sheet");
  return s.hass = t, s.onType = e, document.body.appendChild(s), s;
}
var Ur = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, As = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Wr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && Ur(e, s, n), n;
};
let ne = class extends C {
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
          <span class="ic">${Dn()}</span><span class="nm">${o(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${jn()}</span>
          <span class="nm">${o(this.hass, "by_rooms")}<small>${o(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" disabled>
          <span class="ic">${ae()}</span>
          <span class="nm">${o(this.hass, "terral_settings")}<small>${o(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
ne.styles = [
  C.styles,
  A`
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
As([
  v({ attribute: !1 })
], ne.prototype, "actions", 2);
As([
  v()
], ne.prototype, "version", 2);
ne = As([
  M("terral-menu-sheet")
], ne);
function Br(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const tn = "0.8.2";
var qr = Object.defineProperty, Fr = Object.getOwnPropertyDescriptor, E = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Fr(e, s) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (n = (i ? r(e, s, n) : r(n)) || n);
  return i && n && qr(e, s, n), n;
};
const ue = "top", ai = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], Yr = 0.85, ri = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate"
}, Vr = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing"], At = "#3a4f80", ge = "58,79,128", Gr = `linear-gradient(180deg, ${At} 0, rgba(${ge},.6) 36px, rgba(${ge},0) 120px), linear-gradient(0deg, ${At} 0, rgba(${ge},.6) 28px, rgba(${ge},0) 96px), `, Ve = At, Kr = At, Ge = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let k = class extends D {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || Rr(this.hass, (t) => {
        Fi(this.hass, Ma(t), {
          mode: "add",
          onBack: () => this._add(),
          onSave: (e) => {
            const s = { id: Ge(), type: e.type, ...e.config, w: e.w, h: e.h };
            this._update((i) => i.cards.push(s));
          }
        });
      });
    }, this._menu = () => {
      this.hass && Br(this.hass, this.panel?.config?.version ?? tn, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms()
      });
    }, this._addSection = () => {
      const t = Ge();
      this._update((e) => e.sections.push({ id: t, title: o(this.hass, "new_section"), cards: [] })), this._renaming = t;
    }, this._onCardConfig = (t) => {
      const e = t.target, s = [...this._els].find(([, a]) => a === e)?.[0];
      if (!s) return;
      t.preventDefault();
      const { config: i, size: n } = t.detail;
      this._update((a) => {
        for (const r of [a.cards, ...a.sections.map((l) => l.cards)]) {
          const l = r.find((c) => c.id === s);
          if (l) {
            for (const c of Vr)
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
      Ea(this.hass);
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
      [s, "background", At],
      [i, "background", At],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", Ve],
      [i, "--app-theme-color", Ve],
      [i, "--primary-background-color", Kr]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: n.map(([a, r]) => [a, r, a.style.getPropertyValue(r), a.style.getPropertyPriority(r)])
      };
      for (const [a, r, l] of n) a.style.setProperty(r, l);
      e && (e.content = Ve), this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [a, r, l, c] of this._chromeSaved.props)
        l ? a.style.setProperty(r, l, c) : a.style.removeProperty(r);
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
    return e === ue ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: ue, card: e };
    for (const s of this._sections) {
      const i = s.cards.find((n) => n.id === t);
      if (i) return { key: s.id, card: i };
    }
  }
  // ---- Layout -------------------------------------------------------------
  _measure(t) {
    const e = t < 600 ? 16 : 24, s = t < 600 ? 10 : 14, i = Math.min(t, 1180) - 2 * e, n = t < 600 ? 2 : 4, a = (i - s * (n - 1)) / n, r = window.__terralRowRatio ?? Yr, l = Math.max(48, Math.round((a - s) / 2 * r));
    this._colW = a, this._gap = s, n !== this._cols && (this._cols = n), l !== this._rowH && (this._rowH = l);
  }
  _sizeOf(t) {
    const e = t.h === 1 || t.h === 4 ? t.h : 2, s = e === 4 || t.w === 2 ? 2 : 1;
    return { w: Math.min(s, this._cols), h: e };
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t) {
    return (this._els.get(t.id)?.getTerralSizes?.() ?? ai).filter((s) => s.w <= this._cols).length > 1;
  }
  _element(t) {
    let e = this._els.get(t.id);
    e || (e = document.createElement(ri[t.type] ?? "terral-home-light"), this._els.set(t.id, e));
    const { id: s, type: i, w: n, h: a, ...r } = t, l = { ...r, type: `custom:${ri[t.type] ?? "terral-home-light"}`, view_layout: { terral: { w: n, h: a } } }, c = JSON.stringify(l);
    if (e.dataset.cfg !== c) {
      try {
        e.setConfig(l);
      } catch (d) {
        console.warn("Terral Home:", d);
      }
      e.dataset.cfg = c;
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
      const a = n.sections.find((r) => r.id === t);
      a && (a.title = s);
    });
  }
  _removeSection(t) {
    const e = this._sections.findIndex((n) => n.id === t), s = this._sections[e];
    if (!s || !this.hass) return;
    const i = (n) => this._update((a) => {
      const r = a.sections.findIndex((c) => c.id === t);
      if (r < 0) return;
      const [l] = a.sections.splice(r, 1);
      n ? (r > 0 ? a.sections[r - 1].cards : a.cards).push(...l.cards) : l.cards.forEach((c) => this._els.delete(c.id));
    });
    if (!s.cards.length) return i(!1);
    is(this.hass, {
      heading: o(this.hass, "delete_section_q", { name: s.title }),
      message: o(this.hass, "delete_section_msg", { n: s.cards.length }),
      actions: [
        { label: o(this.hass, "keep_cards"), sub: o(this.hass, e > 0 ? "keep_cards_sub" : "keep_cards_sub_top"), run: () => i(!0) },
        { label: o(this.hass, "remove_cards"), danger: !0, run: () => i(!1) }
      ]
    });
  }
  /** One section per HA area; each card with an area moves into it. */
  _confirmRooms() {
    this.hass && is(this.hass, {
      heading: o(this.hass, "by_rooms"),
      message: o(this.hass, "by_rooms_msg"),
      actions: [{ label: o(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }]
    });
  }
  _sectionsFromRooms() {
    const t = this.hass;
    t && (this._update((e) => {
      const s = new Map(e.sections.map((r) => [r.title.toLowerCase(), r])), i = [e.cards, ...e.sections.map((r) => r.cards)], n = [];
      for (const r of i)
        for (const l of [...r]) {
          const c = be(t, l.entity);
          c && (n.push([l, c]), r.splice(r.indexOf(l), 1));
        }
      const a = [...new Set(n.map(([, r]) => r))].filter((r) => !s.has(r.toLowerCase())).sort((r, l) => r.localeCompare(l));
      for (const r of a) {
        const l = { id: Ge(), title: r, cards: [] };
        e.sections.push(l), s.set(r.toLowerCase(), l);
      }
      for (const [r, l] of n) s.get(l.toLowerCase()).cards.push(r);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), n = (this._els.get(e.id)?.getTerralSizes?.() ?? ai).filter((r) => r.w <= this._cols);
    this._resizeOrigin = { left: i.left, top: i.top, sizes: n };
    const a = this._sizeOf(e);
    this._resize = { id: e.id, w: a.w, h: a.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let n = e.sizes[0], a = 1 / 0;
    for (const r of e.sizes) {
      const l = (r.w - s) ** 2 + (r.h - i) ** 2;
      l < a && ([n, a] = [r, l]);
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
      const n = k._list(i, e.key)?.find((a) => a.id === t.id);
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
    !i || s === t || this._update((n) => {
      const a = k._list(n, i.key), r = a.findIndex((m) => m.id === t), l = s ? a.findIndex((m) => m.id === s) : -1, [c] = a.splice(r, 1), d = k._list(n, e);
      if (!d) {
        a.splice(r, 0, c);
        return;
      }
      if (!s) {
        d.push(c);
        return;
      }
      const u = d.findIndex((m) => m.id === s), p = i.key === e && l > r;
      d.splice(u < 0 ? d.length : u + (p ? 1 : 0), 0, c);
    });
  }
  _moveSection(t, e) {
    const s = this._sections.findIndex((i) => i.id === t);
    s < 0 || s === e || this._update((i) => {
      const n = i.sections.findIndex((r) => r.id === t), [a] = i.sections.splice(n, 1);
      i.sections.splice(Math.min(e, i.sections.length), 0, a);
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
    const n = e.scrollTop;
    e.scrollTop += i;
    const a = e.scrollTop - n;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - a }, this._dragDy += a;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, n = e && !this._allCards.length, a = this._drag?.kind === "card", r = this._drag?.kind === "section", l = s.length > 0 || n || t && (a || !i.length);
    let c = 0;
    return h`
      <div class="scroller" style="background:${Gr}${Dr("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${t ? "editing" : ""}">
          <div class="top">
            <button class="glass round" aria-label=${o(this.hass, "menu")} @click=${() => zr(this, "hass-toggle-menu")}>
              ${Tn()}
            </button>
            <span class="spacer"></span>
            ${t ? h`<div class="glass pill">
                  <button class="pbtn" aria-label=${o(this.hass, "add_accessory")} @click=${this._add}>${ce(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${o(this.hass, "done")}</button>
                </div>` : h`<div class="glass pill">
                  <button class="pbtn" aria-label=${o(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${ce(22)}</button>
                  <button class="pbtn" aria-label=${o(this.hass, "more_options")} @click=${this._menu}>${On(22)}</button>
                </div>`}
          </div>
          <h1>${o(this.hass, "home_title")}</h1>
          ${this._error ? h`<p class="notice">${o(this.hass, "panel_error")} (${this._error})</p>` : f}
          ${l ? this._grid(ue, s, t, n || t && !i.length, s.length === 0 && t ? o(this.hass, "no_section") : void 0) : f}
          ${ni(
      i,
      (d) => d.id,
      (d) => {
        const u = r && this._drag?.id === d.id, p = r && !u && this._dropSection === c;
        return u || c++, !t && !d.cards.length ? f : h`${p ? h`<div class="dropline"></div>` : f}${this._section(d, t, u)}`;
      }
    )}
          ${r && this._dropSection === c ? h`<div class="dropline"></div>` : f}
          ${t && e ? h`<button class="addsec" @click=${this._addSection}>${ce(20)}<span>${o(this.hass, "add_section")}</span></button>` : f}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, n = s ? `translate:0 ${this._dragDy}px` : "";
    return h`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${n}>
      <header>
        ${e ? h`<button class="sdel" aria-label=${o(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${Ws()}</button>` : f}
        ${i ? h`<input
              class="rename"
              .value=${t.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(a) => {
      a.key === "Enter" && this._commitRename(t.id, a.target.value), a.key === "Escape" && (this._renaming = void 0);
    }}
              @blur=${(a) => this._commitRename(t.id, a.target.value)}
            />` : e ? h`<button class="title" aria-label=${o(this.hass, "rename_section")} @click=${() => this._renaming = t.id}>${t.title}</button>` : h`<h2>${t.title}</h2>`}
        ${e ? h`<button
              class="handle"
              aria-label=${o(this.hass, "move_section")}
              @pointerdown=${(a) => this._handleDown(a, t.id)}
            >${Pn()}</button>` : f}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? o(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  _grid(t, e, s, i, n) {
    const a = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId;
    return h`<div
      class="grid ${a ? "zone-target" : ""} ${t === ue ? "top-grid" : ""}"
      data-zone=${t}
      style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
    >
      ${ni(e, (r) => r.id, (r, l) => this._cell(t, r, l, s))}
      ${n && !e.length ? h`<div class="placeholder" style="grid-column:1/-1">${n}</div>` : f}
      ${i ? h`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${ce(26)}</span><span>${o(this.hass, "add_accessory")}</span>
          </button>` : f}
    </div>`;
  }
  _cell(t, e, s, i) {
    const { w: n, h: a } = this._sizeOf(e), r = this._drag?.kind === "card" && this._drag.id === e.id, l = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, c = `grid-column:span ${n};grid-row:span ${a};--d:${s % 5 * -0.07}s;${r ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return h`<div class="cell ${r ? "dragging" : ""} ${l ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${c}>
      ${this._element(e)}
      ${i ? h`<div class="overlay" @pointerdown=${(d) => this._overlayDown(d, e.id)}>
            <button class="del" aria-label=${o(this.hass, "delete")} @click=${() => this._remove(e.id)}>${Ws()}</button>
            ${this._canResize(e) ? h`<button
              class="corner"
              aria-label=${o(this.hass, "resize")}
              @pointerdown=${(d) => this._resizeDown(d, e)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>` : f}
          </div>` : f}
      ${this._resize?.id === e.id ? h`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>` : f}
    </div>`;
  }
};
k.styles = A`
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
E([
  v({ attribute: !1 })
], k.prototype, "hass", 2);
E([
  v({ type: Boolean })
], k.prototype, "narrow", 2);
E([
  v({ attribute: !1 })
], k.prototype, "route", 2);
E([
  v({ attribute: !1 })
], k.prototype, "panel", 2);
E([
  y()
], k.prototype, "_layout", 2);
E([
  y()
], k.prototype, "_error", 2);
E([
  y()
], k.prototype, "_edit", 2);
E([
  y()
], k.prototype, "_cols", 2);
E([
  y()
], k.prototype, "_rowH", 2);
E([
  y()
], k.prototype, "_drag", 2);
E([
  y()
], k.prototype, "_dropCard", 2);
E([
  y()
], k.prototype, "_dropSection", 2);
E([
  y()
], k.prototype, "_dragDx", 2);
E([
  y()
], k.prototype, "_dragDy", 2);
E([
  y()
], k.prototype, "_resize", 2);
E([
  y()
], k.prototype, "_renaming", 2);
k = E([
  M("terral-home-panel")
], k);
const R = window;
R.customCards = R.customCards || [];
R.customCards.some((t) => t.type === "terral-home-light") || R.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: e } } : null
});
R.customCards.some((t) => t.type === "terral-home-alarm") || R.customCards.push({
  type: "terral-home-alarm",
  name: "Terral · Alarma",
  description: "Alarma (Alarmo u otra) al estilo Terral Home / Terral Home alarm (Alarmo or any alarm panel)",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("alarm_control_panel.") ? { config: { type: "custom:terral-home-alarm", entity: e } } : null
});
R.customCards.some((t) => t.type === "terral-home-charger") || R.customCards.push({
  type: "terral-home-charger",
  name: "Terral · Cargador",
  description: "Cargador de coche eléctrico al estilo Terral Home / Terral Home EV charger",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
R.customCards.some((t) => t.type === "terral-home-climate") || R.customCards.push({
  type: "terral-home-climate",
  name: "Terral · Clima",
  description: "Aire acondicionado, calefacción o bomba de calor al estilo Terral Home / Terral Home climate",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
console.info(
  `%c TERRAL HOME %c v${tn} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  tn as VERSION
};
