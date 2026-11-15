/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yt = globalThis, Se = Yt.ShadowRoot && (Yt.ShadyCSS === void 0 || Yt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ee = Symbol(), Ve = /* @__PURE__ */ new WeakMap();
let ys = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== Ee) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Se && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = Ve.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ve.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const si = (t) => new ys(typeof t == "string" ? t : t + "", void 0, Ee), S = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, n, r) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[r + 1], t[0]);
  return new ys(s, t, Ee);
}, ii = (t, e) => {
  if (Se) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), n = Yt.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, t.appendChild(i);
  }
}, Ke = Se ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return si(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ni, defineProperty: ri, getOwnPropertyDescriptor: ai, getOwnPropertyNames: oi, getOwnPropertySymbols: li, getPrototypeOf: ci } = Object, ie = globalThis, Ge = ie.trustedTypes, hi = Ge ? Ge.emptyScript : "", di = ie.reactiveElementPolyfillSupport, At = (t, e) => t, Vt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? hi : null;
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
} }, ze = (t, e) => !ni(t, e), Xe = { attribute: !0, type: String, converter: Vt, reflect: !1, useDefault: !1, hasChanged: ze };
Symbol.metadata ??= Symbol("metadata"), ie.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let it = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Xe) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, s);
      n !== void 0 && ri(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: n, set: r } = ai(this.prototype, e) ?? { get() {
      return this[s];
    }, set(a) {
      this[s] = a;
    } };
    return { get: n, set(a) {
      const l = n?.call(this);
      r?.call(this, a), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Xe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(At("elementProperties"))) return;
    const e = ci(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(At("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(At("properties"))) {
      const s = this.properties, i = [...oi(s), ...li(s)];
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
      for (const n of i) s.unshift(Ke(n));
    } else e !== void 0 && s.push(Ke(e));
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
    return ii(e, this.constructor.elementStyles), e;
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
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : Vt).toAttribute(s, i.type);
      this._$Em = e, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const r = i.getPropertyOptions(n), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Vt;
      this._$Em = n;
      const l = a.fromAttribute(s, r.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, n = !1, r) {
    if (e !== void 0) {
      const a = this.constructor;
      if (n === !1 && (r = this[e]), i ??= a.getPropertyOptions(e), !((i.hasChanged ?? ze)(r, s) || i.useDefault && i.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: n, wrapped: r }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? s ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: a } = r, l = this[n];
        a !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
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
it.elementStyles = [], it.shadowRootOptions = { mode: "open" }, it[At("elementProperties")] = /* @__PURE__ */ new Map(), it[At("finalized")] = /* @__PURE__ */ new Map(), di?.({ ReactiveElement: it }), (ie.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis, Qe = (t) => t, Kt = Me.trustedTypes, Ze = Kt ? Kt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, vs = "$lit$", W = `lit$${Math.random().toFixed(9).slice(2)}$`, $s = "?" + W, pi = `<${$s}>`, X = document, Mt = () => X.createComment(""), Dt = (t) => t === null || typeof t != "object" && typeof t != "function", De = Array.isArray, ui = (t) => De(t) || typeof t?.[Symbol.iterator] == "function", ce = `[ 	
\f\r]`, bt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Je = /-->/g, ts = />/g, Y = RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), es = /'/g, ss = /"/g, ws = /^(?:script|style|textarea|title)$/i, ks = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), h = ks(1), v = ks(2), Q = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), is = /* @__PURE__ */ new WeakMap(), K = X.createTreeWalker(X, 129);
function As(t, e) {
  if (!De(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ze !== void 0 ? Ze.createHTML(e) : e;
}
const gi = (t, e) => {
  const s = t.length - 1, i = [];
  let n, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = bt;
  for (let l = 0; l < s; l++) {
    const c = t[l];
    let d, p, u = -1, f = 0;
    for (; f < c.length && (a.lastIndex = f, p = a.exec(c), p !== null); ) f = a.lastIndex, a === bt ? p[1] === "!--" ? a = Je : p[1] !== void 0 ? a = ts : p[2] !== void 0 ? (ws.test(p[2]) && (n = RegExp("</" + p[2], "g")), a = Y) : p[3] !== void 0 && (a = Y) : a === Y ? p[0] === ">" ? (a = n ?? bt, u = -1) : p[1] === void 0 ? u = -2 : (u = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? Y : p[3] === '"' ? ss : es) : a === ss || a === es ? a = Y : a === Je || a === ts ? a = bt : (a = Y, n = void 0);
    const _ = a === Y && t[l + 1].startsWith("/>") ? " " : "";
    r += a === bt ? c + pi : u >= 0 ? (i.push(d), c.slice(0, u) + vs + c.slice(u) + W + _) : c + W + (u === -2 ? l : _);
  }
  return [As(t, r + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Tt {
  constructor({ strings: e, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const l = e.length - 1, c = this.parts, [d, p] = gi(e, s);
    if (this.el = Tt.createElement(d, i), K.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = K.nextNode()) !== null && c.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(vs)) {
          const f = p[a++], _ = n.getAttribute(u).split(W), m = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: r, name: m[2], strings: _, ctor: m[1] === "." ? mi : m[1] === "?" ? _i : m[1] === "@" ? bi : ne }), n.removeAttribute(u);
        } else u.startsWith(W) && (c.push({ type: 6, index: r }), n.removeAttribute(u));
        if (ws.test(n.tagName)) {
          const u = n.textContent.split(W), f = u.length - 1;
          if (f > 0) {
            n.textContent = Kt ? Kt.emptyScript : "";
            for (let _ = 0; _ < f; _++) n.append(u[_], Mt()), K.nextNode(), c.push({ type: 2, index: ++r });
            n.append(u[f], Mt());
          }
        }
      } else if (n.nodeType === 8) if (n.data === $s) c.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(W, u + 1)) !== -1; ) c.push({ type: 7, index: r }), u += W.length - 1;
      }
      r++;
    }
  }
  static createElement(e, s) {
    const i = X.createElement("template");
    return i.innerHTML = e, i;
  }
}
function ot(t, e, s = t, i) {
  if (e === Q) return e;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const r = Dt(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(t), n._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = n : s._$Cl = n), n !== void 0 && (e = ot(t, n._$AS(t, e.values), n, i)), e;
}
class fi {
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
    const { el: { content: s }, parts: i } = this._$AD, n = (e?.creationScope ?? X).importNode(s, !0);
    K.currentNode = n;
    let r = K.nextNode(), a = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let d;
        c.type === 2 ? d = new mt(r, r.nextSibling, this, e) : c.type === 1 ? d = new c.ctor(r, c.name, c.strings, this, e) : c.type === 6 && (d = new xi(r, this, e)), this._$AV.push(d), c = i[++l];
      }
      a !== c?.index && (r = K.nextNode(), a++);
    }
    return K.currentNode = X, n;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class mt {
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
    e = ot(this, e, s), Dt(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== Q && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ui(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && Dt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(X.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Tt.createElement(As(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const r = new fi(n, this), a = r.u(this.options);
      r.p(s), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let s = is.get(e.strings);
    return s === void 0 && is.set(e.strings, s = new Tt(e)), s;
  }
  k(e) {
    De(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const r of e) n === s.length ? s.push(i = new mt(this.O(Mt()), this.O(Mt()), this, this.options)) : i = s[n], i._$AI(r), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = Qe(e).nextSibling;
      Qe(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ne {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, n, r) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = s, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(e, s = this, i, n) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = ot(this, e, s, 0), a = !Dt(e) || e !== this._$AH && e !== Q, a && (this._$AH = e);
    else {
      const l = e;
      let c, d;
      for (e = r[0], c = 0; c < r.length - 1; c++) d = ot(this, l[i + c], s, c), d === Q && (d = this._$AH[c]), a ||= !Dt(d) || d !== this._$AH[c], d === g ? e = g : e !== g && (e += (d ?? "") + r[c + 1]), this._$AH[c] = d;
    }
    a && !n && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class mi extends ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class _i extends ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class bi extends ne {
  constructor(e, s, i, n, r) {
    super(e, s, i, n, r), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = ot(this, e, s, 0) ?? g) === Q) return;
    const i = this._$AH, n = e === g && i !== g || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== g && (i === g || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class xi {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ot(this, e);
  }
}
const yi = { I: mt }, vi = Me.litHtmlPolyfillSupport;
vi?.(Tt, mt), (Me.litHtmlVersions ??= []).push("3.3.3");
const $i = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = s?.renderBefore ?? null;
    i._$litPart$ = n = new mt(e.insertBefore(Mt(), r), r, void 0, s ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = globalThis;
let z = class extends it {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = $i(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Q;
  }
};
z._$litElement$ = !0, z.finalized = !0, Te.litElementHydrateSupport?.({ LitElement: z });
const wi = Te.litElementPolyfillSupport;
wi?.({ LitElement: z });
(Te.litElementVersions ??= []).push("4.2.2");
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
const ki = { attribute: !0, type: String, converter: Vt, reflect: !1, hasChanged: ze }, Ai = (t = ki, e, s) => {
  const { kind: i, metadata: n } = s;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(s.name, t), i === "accessor") {
    const { name: a } = s;
    return { set(l) {
      const c = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, c, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, t, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = s;
    return function(l) {
      const c = this[a];
      e.call(this, l), this.requestUpdate(a, c, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function x(t) {
  return (e, s) => typeof s == "object" ? Ai(t, e, s) : ((i, n, r) => {
    const a = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), a ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return x({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ci = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Si(t, e) {
  return (s, i, n) => {
    const r = (a) => a.renderRoot?.querySelector(t) ?? null;
    return Ci(s, i, { get() {
      return r(this);
    } });
  };
}
const Ei = {
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
}, zi = {
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
function lt(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function o(t, e, s) {
  let i = (lt(t) === "es" ? Ei : zi)[e] ?? e;
  if (s) for (const [n, r] of Object.entries(s)) i = i.replace(`{${n}}`, String(r));
  return i;
}
function Cs(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return o(t, "just_now");
  if (s < 60) return o(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? o(t, "h_ago", { n: i }) : o(t, "days_ago", { n: Math.round(i / 24) });
}
const Mi = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", at = (t, e = 24) => v`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${Mi} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, Di = (t = 24) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, re = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, Ss = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, _e = (t, e = 16) => v`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, Ti = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, Nt = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, Oi = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, Pi = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, ns = (t = 16) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, Es = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, Ct = (t = 18) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, zs = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, Li = (t = 26) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, ji = (t = 20) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, A = (t, e, s = 2) => v`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Ms = v`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, Oe = (t = 24) => A(t, Ms), Ds = (t = 24) => A(t, v`${Ms}<path d="M9 12l2 2 4-4"></path>`), be = (t = 24) => A(t, v`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), Hi = (t = 20) => A(t, v`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), Ii = (t = 20) => A(t, v`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), Ri = (t = 20) => A(t, v`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), Ni = (t = 20) => A(t, v`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), Ui = (t = 20) => A(t, v`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), Ot = (t = 20) => A(t, v`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), ct = (t = 20) => A(t, v`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), Wi = (t = 24) => A(t, v`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), Bi = (t = 20) => A(t, v`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`), Gt = (t = 24) => A(t, v`<path d="M5 21V5.5A2.5 2.5 0 0 1 7.5 3h5A2.5 2.5 0 0 1 15 5.5V21"></path><path d="M3 21h14"></path><path d="M15 10h1.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8.5L19 6"></path><path d="M10.5 6.5L8.6 10h2.8l-1.9 3.5"></path>`, 1.9), qi = (t = 18) => A(t, v`<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>`), rs = (t = 19) => A(t, v`<rect x="3" y="7" width="16" height="10" rx="2.5"></rect><path d="M21 11v2"></path><path d="M7 10.5v3M10.5 10.5v3"></path>`), Yi = (t = 19) => A(t, v`<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>`), Fi = (t = 20) => A(t, v`<path d="M15 6l-6 6 6 6"></path>`, 2.4);
var Vi = Object.defineProperty, Ki = Object.getOwnPropertyDescriptor, L = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Ki(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && Vi(e, s, n), n;
};
let M = class extends z {
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
        ${this.showValue ? h`<span>${this._shown}${this.suffix ? h`&nbsp;${this.suffix}` : g}</span>` : g}
      </div>
    `;
  }
};
M.styles = S`
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
L([
  x({ type: Number })
], M.prototype, "value", 2);
L([
  x({ type: Number })
], M.prototype, "min", 2);
L([
  x({ type: Number })
], M.prototype, "max", 2);
L([
  x({ type: Boolean, reflect: !0 })
], M.prototype, "vertical", 2);
L([
  x()
], M.prototype, "mode", 2);
L([
  x()
], M.prototype, "label", 2);
L([
  x()
], M.prototype, "suffix", 2);
L([
  x({ type: Boolean, attribute: "show-value" })
], M.prototype, "showValue", 2);
L([
  b()
], M.prototype, "_drag", 2);
M = L([
  E("terral-slider")
], M);
const Ts = ["hs", "rgb", "rgbw", "rgbww", "xy"], Pe = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], xe = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function Os(t) {
  return t.attributes.supported_color_modes ?? [];
}
function Ft(t) {
  const e = Os(t);
  return e.some((s) => Ts.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Gi(t) {
  return Os(t).includes("color_temp");
}
function $(t) {
  return t?.state === "on";
}
function G(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function V(t) {
  const e = t.attributes.brightness;
  if (!(!$(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function H(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function Ps(t) {
  return H(t).length > 0;
}
function Pt(t) {
  return t.attributes.color_temp_kelvin;
}
function ht(t) {
  if (!$(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !Ts.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const as = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, xt = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), yt = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, Xi = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, Qi = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function Ls(t, e) {
  if (!e) return as;
  const s = ht(t);
  if (!s) {
    const r = Pt(t);
    return r && t.attributes.color_mode === "color_temp" && r >= 4500 ? Xi : as;
  }
  const i = [255, 255, 255], n = Qi(s) > 0.75 ? xt(s, [40, 50, 80], 0.45) : s;
  return {
    bg: yt(xt(s, i, 0.84), 0.95),
    fg: yt(xt(s, [10, 10, 20], 0.82)),
    fg2: yt(xt(s, [20, 10, 30], 0.72)),
    accent: yt(n),
    fill: yt(xt(n, i, 0.35))
  };
}
function St(t, e) {
  return t.callService("light", $(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function he(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function ye(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function Xt(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, n = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(n, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function os(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function Zi(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function O(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function ve(t, e) {
  let s;
  for (const i of Pe) {
    const n = i.rgb.reduce((r, a, l) => r + (a - t[l]) ** 2, 0);
    (!s || n < s.d) && (s = { d: n, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function Et(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function ls(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const n = getComputedStyle(i).overflowY;
    if ((n === "auto" || n === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function js(t) {
  let e = 0;
  const s = (r) => {
    e = r.touches[0]?.clientY ?? 0;
  }, i = (r) => {
    if (!r.cancelable) return;
    const a = r.touches[0]?.clientY ?? e;
    ls(r.composedPath(), t, a - e) || r.preventDefault();
  }, n = (r) => {
    ls(r.composedPath(), t, -r.deltaY) || r.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", n, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", n);
  };
}
var Ji = Object.defineProperty, tn = Object.getOwnPropertyDescriptor, R = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? tn(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && Ji(e, s, n), n;
};
let dt;
function en(t, e) {
  dt?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), dt = s;
}
function sn(t) {
  dt?.isConnected && (dt.hass = t);
}
let T = class extends z {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = js(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), dt === this && (dt = void 0);
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
    if (G(t)) return o(this.hass, "unavailable");
    if (!$(t)) return o(this.hass, "off");
    const e = [], s = H(t);
    if (s.length) {
      const a = s.filter((l) => $(this.hass.states[l])).length;
      e.push(`${a} ${o(this.hass, "of")} ${s.length} ${o(this.hass, "lit")}`);
    }
    const i = V(t);
    i != null && e.push(`${i} %`);
    const n = ht(t), r = Pt(t);
    if (n) {
      const a = ve(n, lt(this.hass));
      a && e.push(a);
    } else r && t.attributes.color_mode === "color_temp" && e.push(`${r} K`);
    return e.length || e.push(o(this.hass, "on")), e.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this.hass.states[this._entityId], e = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return h`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${t ? this._name(t) : this._entityId}>
        ${this._wide ? g : h`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${t ? this._content(t) : h`<p class="empty">${o(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(t) {
    const e = $(t), s = Ls(t, this.opts.useLightColor !== !1), i = H(t), n = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, r = this._controls(t), a = i.length ? this._memberList(t, i) : g, l = this._info(t);
    return h`
      <div class="body" style=${n}>
        <header>
          ${this._stack.length ? h`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${_e(!1, 18)}
              </button>` : g}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? o(this.hass, "turn_off") : o(this.hass, "turn_on")}
            ?disabled=${G(t)}
            @click=${() => St(this.hass, t)}
          >
            ${at(e, this._wide ? 28 : 24)}
            ${i.length && e ? h`<span class="badge">${i.filter((c) => $(this.hass.states[c])).length}</span>` : g}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${Et(this.hass, t.entity_id) ? ` · ${Et(this.hass, t.entity_id)}` : ""}</span>
          </div>
          <button class="round close" aria-label=${o(this.hass, "close")} @click=${() => this.close()}>
            ${re(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? h`<div class="cols">
              <div class="left">${r.main}</div>
              <div class="right">${r.side}${a}${i.length ? g : l}</div>
            </div>` : h`<div class="stack">
              <div class="main-row">${r.main}${r.beside ?? g}</div>
              ${r.side}${a}${i.length ? g : l}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = Ft(t), s = $(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: h`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? o(this.hass, "turn_off") : o(this.hass, "turn_on")}
            @click=${() => St(this.hass, t)}>
            <span>${Di(36)}</span>
          </button>`,
        side: g
      };
    const n = h`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${V(t) ?? 0}
      .label=${o(this.hass, "brightness")}
      @value-changed=${(u) => ye(this.hass, i, u.detail.value)}
    >${Ss(28)}</terral-slider>`, r = h`<div class="chips">
      ${[25, 50, 75, 100].map(
      (u) => h`<button class="chip" @click=${() => ye(this.hass, i, u)}>${u} %</button>`
    )}
    </div>`, a = h`<div class="chips">
      ${xe.map(
      (u) => h`<button class="chip tinted" style="background:${u.css}" @click=${() => Xt(this.hass, t, u.kelvin)}>
          ${o(this.hass, u.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: n, side: r };
    if (e === "temperature") {
      const u = t.attributes.min_color_temp_kelvin ?? 2e3, f = t.attributes.max_color_temp_kelvin ?? 6500, _ = h`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${u}
        .max=${f}
        .value=${Pt(t) ?? Math.round((u + f) / 2)}
        .label=${o(this.hass, "temperature")}
        @value-changed=${(m) => Xt(this.hass, t, m.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: h`<div class="pair">${n}${_}</div>`, side: a } : { main: h`<div class="pair">${n}${_}</div>`, side: a };
    }
    const l = lt(this.hass), c = (this.opts.favorites?.length ? this.opts.favorites : Pe.map((u) => ({ name: u.name[l], rgb: u.rgb }))).slice(0, 6), d = ht(t), p = h`
      <p class="lb">${o(this.hass, "favorites")}</p>
      <div class="swatches">
        ${c.map(
      (u) => h`<button
            class="sw ${d && O(d) === O(u.rgb) ? "sel" : ""}"
            style="background:${O(u.rgb)}"
            aria-label=${u.name ?? O(u.rgb)}
            @click=${() => os(this.hass, i, u.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${o(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${d ? O(d) : "#ffffff"} @change=${(u) => os(this.hass, i, Zi(u.target.value))} />
      ${Gi(t) ? h`<p class="lb">${o(this.hass, "temperature")}</p>${a}` : g}
    `;
    return this._wide ? { main: n, side: p } : { main: n, side: g, beside: h`<div class="beside">${p}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const c of e) {
      const d = Et(this.hass, c) ?? o(this.hass, "other_area");
      i.set(d, [...i.get(d) ?? [], c]);
    }
    const n = s === "always" || s === "auto" && e.length > 8 && i.size > 1, r = e.length > 8 ? h`<div class="chips">
          <button class="chip" @click=${() => he(this.hass, t.entity_id, !0)}>${o(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => he(this.hass, t.entity_id, !1)}>${o(this.hass, "all_off")}</button>
        </div>` : g, a = (c) => {
      const d = this.hass.states[c], p = $(d), u = d ? this.hass.formatEntityName?.(d) ?? d.attributes.friendly_name ?? c : c;
      return h`<div class="mr">
        <button class="mi ${p ? "on" : ""}" ?disabled=${G(d)}
          aria-label="${p ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${u}"
          @click=${() => d && St(this.hass, d)}>${at(p, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, c]}>
          <span>${u}</span><small>${d ? this._stateText(d) : o(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, l = (c) => [...c].sort((d, p) => Number($(this.hass.states[p])) - Number($(this.hass.states[d])));
    return h`
      ${r}
      <p class="lb">${o(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${n ? [...i.entries()].map(([c, d]) => {
      const p = this._openAreas.has(c), u = d.filter((f) => $(this.hass.states[f])).length;
      return h`<div class="box">
                <div class="sec">
                  <button class="mi ${u ? "on" : ""}" aria-label="${u ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${c}"
                    @click=${() => he(this.hass, d, u === 0)}>${at(u > 0, 18)}</button>
                  <button class="mt" aria-expanded=${p} @click=${() => {
        const f = new Set(this._openAreas);
        p ? f.delete(c) : f.add(c), this._openAreas = f;
      }}>
                    <span>${c} <small>${u} ${o(this.hass, "of")} ${d.length}</small></span>${_e(p)}
                  </button>
                </div>
                ${p ? h`<div class="inner">${d.map(a)}</div>` : g}
              </div>`;
    }) : h`<div class="box">${l(e).map(a)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return h`<div class="info">
      <div><span>${o(this.hass, "last_activity")}</span><span>${Cs(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
T.styles = S`
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
R([
  x({ attribute: !1 })
], T.prototype, "hass", 2);
R([
  x({ attribute: !1 })
], T.prototype, "opts", 2);
R([
  b()
], T.prototype, "_stack", 2);
R([
  b()
], T.prototype, "_expanded", 2);
R([
  b()
], T.prototype, "_closing", 2);
R([
  b()
], T.prototype, "_wide", 2);
R([
  b()
], T.prototype, "_openAreas", 2);
R([
  Si("input[type=color]")
], T.prototype, "_picker", 2);
T = R([
  E("terral-light-dialog")
], T);
var nn = Object.defineProperty, rn = Object.getOwnPropertyDescriptor, N = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? rn(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && nn(e, s, n), n;
};
const an = "terral-home-light";
let Z = class extends z {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      en(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !G(e) && St(this.hass, e);
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
    return t ? Ft(t) === "temperature" || Ft(t) === "color" || H(t).length > 0 ? e : e.slice(0, 3) : e;
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...H(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && sn(this.hass);
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
    if (G(t)) return o(s, "unavailable");
    const i = H(t);
    if (i.length) {
      const l = i.filter((p) => $(s.states[p])).length;
      if (!l) return `${i.length} ${o(s, "lights_off")}`;
      const c = V(t), d = l === i.length && e === "onoff" ? `${o(s, "all_lit")} (${l})` : `${l} ${o(s, "of")} ${i.length} ${o(s, "lit")}`;
      return c != null && this._size !== "s11" ? `${d} · ${c} %` : d;
    }
    if (!$(t)) return o(s, "off");
    const n = [], r = V(t);
    r != null && n.push(`${r} %`);
    const a = ht(t);
    if (a) {
      const l = ve(a, lt(s));
      l && n.push(l);
    } else if (e === "temperature" || e === "color") {
      const l = Pt(t);
      if (l && t.attributes.color_mode === "color_temp") {
        const c = [...xe].sort((d, p) => Math.abs(d.kelvin - l) - Math.abs(p.kelvin - l))[0];
        n.push(o(s, c.key));
      }
    }
    return n.join(" · ") || o(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return h`<div class="card off missing"><span>${o(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = Ft(t), s = $(t), i = G(t), n = H(t), r = Ls(t, this._config.use_light_color !== !1), a = s ? `--bg:${r.bg};--fg:${r.fg};--fg2:${r.fg2};--accent:${r.accent};--fill:${r.fill}` : "";
    let l = this._size;
    l === "s42" && !this.getTerralSizes().some((p) => p.h === 4) && (l = "s22");
    const c = h`<button
      class="icon"
      aria-label="${s ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${at(s, l === "s11" ? 20 : 32)}
      ${n.length && s ? h`<span class="badge">${n.filter((p) => $(this.hass.states[p])).length}</span>` : g}
    </button>`, d = h`<div class="text">
      <span class="name">${this._name(t)}</span>
      <span class="state">${this._status(t, e)}</span>
    </div>`;
    return h`<div
      class="card ${l} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
      style=${a}
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
      ${l === "s11" || l === "s21" ? h`${c}${d}` : h`<div class="head">${c}${d}${this._quickButton(t, e, l)}</div>
            ${this._body(t, e, l)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !H(t).length) return g;
    const i = ht(t), n = i ? ve(i, lt(this.hass)) ?? "" : "", r = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? O(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return h`<button class="pb" @click=${(a) => {
      a.stopPropagation(), this._openWindow();
    }}><i style=${r}></i>${n || (e === "color" ? o(this.hass, "more_colors") : o(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return h`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${V(t) ?? 0}
      .label=${o(this.hass, "brightness")}
      @value-changed=${(s) => ye(this.hass, t.entity_id, s.detail.value)}
    >${Ss(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = H(t);
    if (s === "s42" && i.length) {
      const r = [...i].sort((d, p) => Number($(this.hass.states[p])) - Number($(this.hass.states[d]))), a = e === "onoff" ? 5 : 4, l = r.length > a ? r.slice(0, a - 1) : r, c = r.length - l.length;
      return h`
        ${e !== "onoff" ? this._brightness(t) : g}
        <div class="members">
          ${l.map((d) => {
        const p = this.hass.states[d], u = $(p), f = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? d : d;
        return h`<div class="mr">
              <button class="mi ${u ? "lit" : ""}" ?disabled=${G(p)} aria-label="${u ? o(this.hass, "turn_off") : o(this.hass, "turn_on")} ${f}"
                @click=${(_) => {
          _.stopPropagation(), p && St(this.hass, p);
        }}>${at(u, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${f}</span><small>${p ? $(p) ? V(p) != null ? `${V(p)} %` : o(this.hass, "on") : o(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${c > 0 ? h`<button class="morebtn" @click=${this._openWindow}>+ ${c} ${o(this.hass, "more")}</button>` : g}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? h`<div class="tags">
          ${i.slice(0, 4).map((r) => {
        const a = this.hass.states[r], l = a ? this.hass.formatEntityName?.(a) ?? a.attributes.friendly_name ?? r : r;
        return h`<span class="tag"><i class=${$(a) ? "lit" : ""}></i>${l}</span>`;
      })}
        </div>` : h`<div class="since">
        <span><b>${$(t) ? o(this.hass, "on") : o(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const r = t.attributes.min_color_temp_kelvin ?? 2e3, a = t.attributes.max_color_temp_kelvin ?? 6500;
      return h`
        <p class="lbl">${o(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${o(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${r} .max=${a} .value=${Pt(t) ?? 3500}
          .label=${o(this.hass, "temperature")}
          @value-changed=${(l) => Xt(this.hass, t, l.detail.value)}></terral-slider>
        <div class="chips">
          ${xe.map((l) => h`<button class="chip" style="background:${l.css}" @click=${(c) => {
        c.stopPropagation(), Xt(this.hass, t, l.kelvin);
      }}>${o(this.hass, l.key)}</button>`)}
        </div>
      `;
    }
    const n = this._config?.favorite_colors?.map((r) => Array.isArray(r) ? r : r.rgb) ?? void 0;
    return h`
      <p class="lbl">${o(this.hass, "brightness")}</p>
      ${this._brightness(t, !0)}
      <p class="lbl">${o(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${t} .colors=${n}></terral-light-favs>
      <button class="pb wide" @click=${(r) => {
      r.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${o(this.hass, "more_colors")}</button>
    `;
  }
};
Z.styles = S`
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
N([
  x({ attribute: !1 })
], Z.prototype, "hass", 2);
N([
  x({ type: Boolean })
], Z.prototype, "preview", 2);
N([
  b()
], Z.prototype, "_config", 2);
N([
  b()
], Z.prototype, "_size", 2);
Z = N([
  E(an)
], Z);
let pt = class extends z {
  render() {
    if (!this.hass || !this.entity) return g;
    const t = lt(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: O(i) })) : on[t] ??= ln(t), s = ht(this.entity);
    return e.slice(0, 6).map(
      (i) => h`<button
        class=${s && O(s) === O(i.rgb) ? "sel" : ""}
        style="background:${O(i.rgb)}"
        aria-label=${i.name}
        @click=${(n) => {
        n.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
pt.styles = S`
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
N([
  x({ attribute: !1 })
], pt.prototype, "hass", 2);
N([
  x({ attribute: !1 })
], pt.prototype, "entity", 2);
N([
  x({ attribute: !1 })
], pt.prototype, "colors", 2);
pt = N([
  E("terral-light-favs")
], pt);
const on = {}, ln = (t) => Pe.map((e) => ({ rgb: e.rgb, name: e.name[t] })), cn = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, Hs = ["away", "home", "night", "vacation", "custom"], hn = ["away", "home", "vacation"], $e = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function J(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const de = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : Hs.includes(e) ? e : void 0;
};
function Le(t) {
  return de(t.state) ?? de(t.attributes.arm_mode) ?? de(t.attributes.next_state);
}
function Is(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? Hs.filter((s) => e & cn[s]) : ["away", "home"];
}
function Qt(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function dn(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const je = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, pn = (t) => je(t) != null && t.attributes.code_arm_required !== !1;
function Zt(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function un(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const we = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function gn(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function fn(t, e, s, i, n = !1) {
  if (gn(t, e)) {
    const a = { entity_id: e.entity_id, mode: s };
    return i && (a.code = i), n && (a.force = !0), t.callService("alarmo", "arm", a);
  }
  const r = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", r, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function mn(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function _n(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function Rs(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), n = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(n, 150);
    };
    n();
  });
}
function bn(t, e, s, i, n, r = {}) {
  const a = async (d) => {
    const p = t(), u = p?.states[e];
    if (!p || !u) return { result: "wrong" };
    try {
      await fn(p, u, s, d, r.force);
    } catch {
      return { result: "wrong", code: d };
    }
    const f = () => t()?.states[e];
    if (await Rs(() => {
      const y = f();
      return !!y && J(y) !== "disarmed";
    })) return { result: "armed", code: d };
    const m = f();
    return { result: m && Zt(m).length ? "refused" : "wrong", code: d };
  }, l = t()?.states[e];
  if (!l) return;
  const c = je(l);
  if (r.code != null || !c || !pn(l)) {
    a(r.code).then(n);
    return;
  }
  i(c, async (d) => {
    const p = await a(d);
    return p.result === "wrong" ? !1 : (n(p), !0);
  });
}
function xn(t, e, s) {
  const i = async (a) => {
    const l = t(), c = l?.states[e];
    if (!l || !c) return !1;
    try {
      await mn(l, c, a);
    } catch {
      return !1;
    }
    return Rs(() => {
      const d = t()?.states[e];
      return !!d && J(d) === "disarmed";
    });
  }, n = t()?.states[e];
  if (!n) return;
  const r = je(n);
  if (!r) {
    i();
    return;
  }
  s(r, i);
}
const pe = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), Ut = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function yn(t) {
  const e = $e[t];
  return {
    bg: Ut(pe(e, [255, 255, 255], 0.84), 0.95),
    fg: Ut(pe(e, [10, 10, 20], 0.82)),
    fg2: Ut(pe(e, [20, 10, 30], 0.72)),
    accent: Ut(e)
  };
}
const cs = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var vn = Object.defineProperty, He = (t, e, s, i) => {
  for (var n = void 0, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = a(e, s, n) || n);
  return n && vn(e, s, n), n;
};
const qe = class qe extends z {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = js(this);
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
          ${this.renderHeaderStart()}
          <h2>${this.heading}</h2>
          ${this.renderHeaderEnd()}
          <button class="close" aria-label=${o(this.hass, "close")} @click=${() => this.close()}>${re(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
qe.styles = S`
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
let k = qe;
He([
  x({ attribute: !1 })
], k.prototype, "hass");
He([
  b()
], k.prototype, "_wide");
He([
  b()
], k.prototype, "_closing");
var $n = Object.defineProperty, wn = Object.getOwnPropertyDescriptor, _t = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? wn(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && $n(e, s, n), n;
};
let B = class extends k {
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
        <p class="err" aria-live="polite">${this._error ? o(this.hass, "code_wrong") : g}</p>
        <button class="okbtn" ?disabled=${!this._code || this._busy}>${o(this.hass, "ok")}</button>
      </form>`;
    const t = Math.max(4, this._code.length);
    return h`
      <div class="dots ${this._error ? "shake" : ""} ${this._busy ? "busy" : ""}" aria-label="${this._code.length}">
        ${Array.from({ length: t }, (e, s) => h`<i class=${s < this._code.length ? "f" : ""}></i>`)}
      </div>
      <p class="err" aria-live="polite">${this._error ? o(this.hass, "code_wrong") : g}</p>
      <div class="pad">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((e) => h`<button class="key" @click=${() => this._press(e)}>${e}</button>`)}
        <button class="key fn" aria-label=${o(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${Wi(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${o(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${Ct(26)}</button>
      </div>
    `;
  }
};
B.styles = [
  k.styles,
  S`
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
_t([
  x()
], B.prototype, "format", 2);
_t([
  x({ attribute: !1 })
], B.prototype, "submit", 2);
_t([
  b()
], B.prototype, "_code", 2);
_t([
  b()
], B.prototype, "_error", 2);
_t([
  b()
], B.prototype, "_busy", 2);
B = _t([
  E("terral-code-sheet")
], B);
function Ns(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const Lt = /* @__PURE__ */ new Map(), kn = 6e4, jt = "terral-alarm-refusal", Us = () => window.dispatchEvent(new Event(jt));
function Jt(t) {
  const e = Lt.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > kn || J(t) !== "disarmed") {
      Lt.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function Ie(t) {
  Lt.delete(t) && Us();
}
function te(t, e, s, i = !1) {
  const n = t();
  if (!n) return;
  const r = Lt.get(e), a = i ? { force: !0, code: r?.code } : {};
  Ie(e), bn(
    t,
    e,
    s,
    (l, c) => Ns(n, l, c),
    (l) => {
      l.result === "refused" && (Lt.set(e, { mode: s, code: l.code, at: Date.now() }), Us());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    a
  );
}
function zt(t, e) {
  const s = t();
  s && xn(t, e, (i, n) => Ns(s, i, n));
}
const An = (t) => t.charAt(0).toLowerCase() + t.slice(1), ee = (t, e) => o(t, `mode_${e}`);
function Ws(t, e, s) {
  const i = J(e), n = Le(e), r = n ? An(ee(t, n)) : "";
  if (Jt(e)) {
    const l = Zt(e);
    return {
      title: o(t, "alarm_failed"),
      status: l.length > 1 ? o(t, "alarm_open_n", { n: l.length }) : o(t, "alarm_open", { name: l[0] ? we(t, l[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: o(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${o(t, "alarm_arming", { mode: r })} · ${o(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${o(t, "alarm_armed", { mode: r })} · ${o(t, "alarm_since", { t: cs(t, e.last_changed) })}` };
    case "pending":
      return { title: o(t, "alarm_pending"), status: o(t, "alarm_pending_sub") };
    case "triggered": {
      const l = Zt(e), c = l.length ? we(t, l[0]) + (l.length > 1 ? ` +${l.length - 1}` : "") : s;
      return { title: o(t, "alarm_triggered"), status: `${c} · ${cs(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: o(t, "unavailable") };
  }
}
const Bs = (t) => {
  const e = Qt(t);
  return e == null ? null : Math.ceil(e);
};
var Cn = Object.defineProperty, Sn = Object.getOwnPropertyDescriptor, ae = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Sn(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && Cn(e, s, n), n;
};
const qs = (t, e = 20) => ({ away: Hi, home: Ii, night: Ri, vacation: Ni, custom: Ui })[t](e);
let ut = class extends k {
  constructor() {
    super(...arguments), this.entityId = "", this.name = "", this._tick = 0, this._refresh = () => this.requestUpdate(), this._getHass = () => this.hass;
  }
  get heading() {
    return this.name;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(jt, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && Qt(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(jt, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? h`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => h`<div class="row static"><span class="ic">${be(18)}</span><span class="nm">${we(this.hass, s)}</span></div>`)}</div>
    </section>` : g;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return h`<p>${o(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = J(e), n = Le(e), r = Jt(e), a = Bs(e), { title: l, status: c } = Ws(t, e, this.name), d = i === "armed" && n ? `rgb(${$e[n].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", p = r || i === "pending" || i === "triggered" ? be(30) : i === "armed" ? Ds(32) : Oe(32), u = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let f = g;
    r ? f = h`<div class="btns">
        <button class="big solid" @click=${() => te(this._getHass, s, r.mode, !0)}>${ct()}<span>${o(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => Ie(s)}><span>${o(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? f = h`<section>
        <h3>${o(t, "arm_options")}</h3>
        <div class="list">
          ${Is(e).map(
      (m) => h`<button class="row" @click=${() => te(this._getHass, s, m)}>
              <span class="ic" style="color:rgb(${$e[m].join(",")})">${qs(m)}</span><span class="nm">${ee(t, m)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? f = h`<div class="btns">
        <button class="big" @click=${() => zt(this._getHass, s)}>${re(20)}<span>${o(t, "cancel")}</span></button>
        ${u ? h`<button class="big" @click=${() => _n(t, e)}>${Bi()}<span>${o(t, "skip_delay")}</span></button>` : g}
      </div>` : i !== "unavailable" && (f = h`<div class="btns"><button class="big solid" @click=${() => zt(this._getHass, s)}>${Ot()}<span>${o(t, "disarm")}</span></button></div>`);
    const _ = e.attributes.changed_by;
    return h`
      <div class="status st-${r ? "failed" : i}" style="--ac:${d}">
        <span class="sic">${p}</span>
        <div class="txt"><strong>${l}</strong><span>${c}</span></div>
        ${a != null ? h`<span class="secs">${a}</span>` : g}
      </div>
      <div class="scroll">
        ${f}
        ${this._sensorList(o(t, "open_sensors"), Zt(e))}
        ${i === "armed" ? this._sensorList(o(t, "bypassed_sensors"), un(e)) : g}
        <p class="foot">${o(t, "changed_by")}: ${_ ? `${_} · ` : ""}${Cs(t, e.last_changed)}</p>
      </div>
    `;
  }
};
ut.styles = [
  k.styles,
  S`
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
ae([
  x()
], ut.prototype, "entityId", 2);
ae([
  x()
], ut.prototype, "name", 2);
ae([
  b()
], ut.prototype, "_tick", 2);
ut = ae([
  E("terral-alarm-dialog")
], ut);
function En(t, e, s) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const i = document.createElement("terral-alarm-dialog");
  return i.hass = t, i.entityId = e, i.name = s, document.body.appendChild(i), i;
}
function zn(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var Mn = Object.defineProperty, Dn = Object.getOwnPropertyDescriptor, oe = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Dn(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && Mn(e, s, n), n;
};
const Tn = "terral-home-alarm";
let gt = class extends z {
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
    super.connectedCallback(), window.addEventListener(jt, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(jt, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
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
    t.has("hass") && this.hass && zn(this.hass);
    const e = this._entity, s = !!e && Qt(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && En(this.hass, this._config.entity, this._name);
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = J(t), i = Jt(t);
    if (i)
      return h`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => te(this._getHass, e, i.mode, !0))}>${ct()}<span>${o(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => Ie(e))}><span>${o(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const n = Is(t).filter((r) => hn.includes(r));
        return h`<div class="row ${n.length > 2 ? "three" : ""}">
          ${n.map(
          (r) => h`<button class="pb" aria-label=${o(this.hass, "arm_mode", { mode: ee(this.hass, r) })} @click=${this._act(() => te(this._getHass, e, r))}>
              ${qs(r)}<span>${ee(this.hass, r)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return h`<div class="row"><button class="pb" @click=${this._act(() => zt(this._getHass, e))}>${re(20)}<span>${o(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return h`<div class="row"><button class="pb" @click=${this._act(() => zt(this._getHass, e))}>${Ot()}<span>${o(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return h`<div class="row"><button class="pb solid" @click=${this._act(() => zt(this._getHass, e))}>${Ot()}<span>${o(this.hass, "disarm")}</span></button></div>`;
      default:
        return g;
    }
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return h`<div class="card off missing"><span>${o(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const e = J(t), s = !!Jt(t), i = Le(t), n = e === "armed" && !!i, r = n ? yn(i) : void 0, a = Bs(t), l = dn(t), c = Qt(t), d = c != null && l ? c / l : 0, p = `${r ? `--bg:${r.bg};--fg:${r.fg};--fg2:${r.fg2};--accent:${r.accent};` : ""}--p:${d}`, u = s || e === "pending" || e === "triggered" ? be(28) : n ? Ds(30) : Oe(30), { title: f, status: _ } = Ws(this.hass, t, this._name);
    return h`<div
      class="card ${n ? "on" : "off"} st-${s ? "failed" : e}"
      style=${p}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${f}, ${_}`}
      @click=${this._cardClick}
      @keydown=${(y) => {
      (y.key === "Enter" || y.key === " ") && y.target === y.currentTarget && (y.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(y) => y.preventDefault()}
    >
      <div class="head">
        <span class="icon">${u}</span>
        <div class="text"><span class="name">${f}</span><span class="state">${_}</span></div>
        ${a != null ? h`<span class="secs">${a}</span>` : g}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
gt.styles = S`
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
oe([
  x({ attribute: !1 })
], gt.prototype, "hass", 2);
oe([
  b()
], gt.prototype, "_config", 2);
oe([
  b()
], gt.prototype, "_tick", 2);
gt = oe([
  E(Tn)
], gt);
const On = ["switch", "lock", "input_boolean"], Re = (t) => t.split(".")[0], tt = (t) => Re(t) === "lock", hs = /(wallbox|charger|cargador|evse|ev_|_ev|easee|zappi|ocpp|pulsar|wall_box|recarga|carga)/i, Ys = (t, e) => hs.test(t) || hs.test(e);
function Pn(t, e = !1) {
  const s = tt(t.entity_id) ? t.state === "locked" : t.state === "on", i = tt(t.entity_id);
  return s === i !== e;
}
function ke(t, e, s, i = !1) {
  const n = e.entity_id, r = tt(n) ? !i : i, a = s ? r : !r;
  return tt(n) ? t.callService("lock", a ? "lock" : "unlock", {}, { entity_id: n }) : t.callService(Re(n), a ? "turn_on" : "turn_off", {}, { entity_id: n });
}
const Ln = (t, e = !1) => (tt(t) ? !e : e) ? "active" : "inactive", Ne = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function Ue(t, e) {
  const s = e ? t.states[e] : void 0;
  if (Ne(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kW");
  return n === "W" ? i / 1e3 : n === "MW" ? i * 1e3 : i;
}
function Fs(t, e) {
  const s = e ? t.states[e] : void 0;
  if (Ne(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const n = String(s.attributes.unit_of_measurement ?? "kWh");
  return n === "Wh" ? i / 1e3 : n === "MWh" ? i * 1e3 : i;
}
const rt = 0.05;
function jn(t, e) {
  const s = Ue(t, e.power), i = e.status ? t.states[e.status] : void 0;
  if (i && !Ne(i)) {
    if (i.entity_id.startsWith("binary_sensor."))
      return i.state !== "on" ? "none" : s != null && s > rt ? "charging" : "connected";
    const n = String(i.state).toLowerCase();
    if (/discharg/.test(n)) return "connected";
    if (/charging|cargando|en carga/.test(n)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(n))
      return s != null && s > rt ? "charging" : "none";
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(n))
      return s != null && s > rt ? "charging" : "connected";
  }
  return s != null && s > rt ? "charging" : "unknown";
}
function Vs(t, e) {
  const s = t.entities?.[e]?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, n]) => i !== e && n.device_id === s).map(([i]) => i) : [];
}
const We = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), Ks = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(We(t, e)), Gs = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(We(t, e)), Xs = (t, e) => {
  const s = t.states[e];
  return s ? e.startsWith("binary_sensor.") ? ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(e) : e.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state)) : !1;
};
function Ae(t, e) {
  const s = Vs(t, e.entity), i = (r, a) => {
    const l = s.filter((c) => t.states[c] && r(c));
    return a && l.find((c) => a.test(c)) || l[0];
  }, n = (r, a) => r === "none" ? void 0 : r || a();
  return {
    status: n(e.status_entity, () => i((r) => Xs(t, r), /status|estado/i)),
    power: n(e.power_entity, () => i((r) => Ks(t, r), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: n(e.energy_entity, () => i((r) => Gs(t, r), /added|session|sesion|sesión|charge|carga/i))
  };
}
function Hn(t, e) {
  if (tt(e)) return !1;
  const s = String(t.states[e]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(e + " " + s);
}
async function Qs(t, e, s) {
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  }), n = We(t, e), r = n === "W" ? 1 / 1e3 : n === "MW" ? 1e3 : 1;
  return (i[e] ?? []).map((a) => [a.lu * 1e3, Number(a.s) * r]).filter(([, a]) => Number.isFinite(a));
}
function Zs(t, e = Date.now()) {
  const s = [];
  let i;
  for (let n = 0; n < t.length; n++) {
    const [r, a] = t[n], l = n + 1 < t.length ? t[n + 1][0] : e, c = Math.max(0, l - r) / 36e5;
    a > rt && (i && r - i.end > 15 * 6e4 && (s.push(i), i = void 0), i ??= { start: r, end: r, kwh: 0, maxKw: 0, live: !1 }, i.kwh += a * c, i.end = l, i.maxKw = Math.max(i.maxKw, a));
  }
  return i && (i.live = t.length > 0 && t[t.length - 1][1] > rt, s.push(i)), s.filter((n) => n.kwh >= 0.05 || n.live);
}
function Js(t, e = 7, s = /* @__PURE__ */ new Date()) {
  const i = [];
  for (let n = e - 1; n >= 0; n--) {
    const r = new Date(s.getFullYear(), s.getMonth(), s.getDate() - n);
    i.push({ day: r, kwh: 0 });
  }
  for (const n of t) {
    const r = new Date(n.start), a = new Date(r.getFullYear(), r.getMonth(), r.getDate()).getTime(), l = i.find((c) => c.day.getTime() === a);
    l && (l.kwh += n.kwh);
  }
  return i;
}
const P = (t, e, s = 1) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Ce = (t) => {
  const e = Math.max(0, Math.round(t / 6e4));
  return `${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")} min`;
}, Wt = (t, e, s) => t.map((i, n) => Math.round(i + (e[n] - i) * s)), nt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, ue = [52, 199, 123], In = [255, 149, 0], ds = [90, 200, 250], ge = "#b3261e", Rn = "#3a3d4a", ps = (t, e, s, i, n) => `--bg:${nt(Wt(t, [255, 255, 255], e), 0.95)};--bg-solid:${nt(Wt(t, [255, 255, 255], e))};--fg:${nt(Wt(i, [10, 10, 20], 0.8))};--fg2:${nt(Wt(i, [20, 10, 30], 0.7))};--accent:${nt(s)};--lk:${n}`;
function wt(t, e) {
  const s = t.states[e.entity], i = Ae(t, e), n = jn(t, i), r = Ue(t, i.power);
  if (!s || s.state === "unavailable" || s.state === "unknown")
    return { look: "unavailable", locked: !1, car: n, ids: i, kw: r, style: "", tinted: !1 };
  const a = Pn(s, !!e.invert);
  let l;
  a ? l = n === "connected" || n === "charging" ? "warn" : "locked" : n === "charging" ? l = "charging" : n === "connected" ? l = "ready" : l = "none";
  const c = l === "charging" ? ps(ue, 0.84, ue, ue, ge) : l === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${nt(In)};--lk:${ge}` : l === "ready" ? ps(ds, 0.8, ds, [30, 110, 160], ge) : `--lk:${Rn}`;
  return { look: l, locked: a, car: n, ids: i, kw: r, style: c, tinted: l === "charging" || l === "warn" || l === "ready" };
}
function kt(t, e, s) {
  const i = e.kw != null ? `${P(t, e.kw)} kW` : "";
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
var Nn = Object.defineProperty, Un = Object.getOwnPropertyDescriptor, j = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Un(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && Nn(e, s, n), n;
};
let D = class extends k {
  constructor() {
    super(...arguments), this.name = "", this.view = "main", this._histError = !1, this._q = "", this._localOnly = !1;
  }
  get heading() {
    return this.view === "settings" ? o(this.hass, "settings") : this.name;
  }
  renderHeaderStart() {
    return this.view !== "settings" ? g : h`<button class="hbtn" aria-label=${o(this.hass, "back")} @click=${() => this.view = "main"}>${Fi()}</button>`;
  }
  renderHeaderEnd() {
    return this.view === "settings" ? g : h`<button class="hbtn" aria-label=${o(this.hass, "settings")} @click=${() => this.view = "settings"}>${zs(19)}</button>`;
  }
  updated() {
    if (this.view !== "main" || !this.hass) return;
    const t = Ae(this.hass, this.config).power;
    t && t !== this._histFor && (this._histFor = t, this._load(t));
  }
  async _load(t) {
    try {
      const e = Date.now(), s = await Qs(this.hass, t, new Date(e - 7 * 864e5));
      this._sessions = Zs(s, e), this._histError = !1;
    } catch {
      this._histError = !0;
    }
  }
  _save(t) {
    const e = { ...this.config, ...t };
    for (const i of Object.keys(e)) (e[i] === void 0 || e[i] === "") && delete e[i];
    this.config = e, this._histFor = void 0;
    const s = this.onConfig?.(e) ?? !1;
    this._localOnly = !s;
  }
  renderContent() {
    return this.view === "settings" ? this._settings() : this._main();
  }
  // ---- Main ---------------------------------------------------------------------
  _main() {
    const t = this.hass, e = t.states[this.config.entity];
    if (!e) return h`<p>${o(t, "not_found")}</p>`;
    const s = wt(t, this.config), i = Fs(t, s.ids.energy), n = this._sessions?.find((m) => m.live), r = s.look === "charging" && i != null ? o(t, "this_charge", { kwh: `${P(t, i)} kWh`, time: n ? Ce(Date.now() - n.start) : "" }).replace(/ · $/, "") : i != null ? `${o(t, "last_session")}: ${P(t, i)} kWh` : "", a = this._sessions ? Js(this._sessions, 7) : void 0, l = a ? Math.max(...a.map((m) => m.kwh), 0.1) : 1, c = a?.reduce((m, y) => m + y.kwh, 0) ?? 0, d = this._sessions?.length ?? 0, p = [...this._sessions ?? []].reverse().slice(0, 5), u = t.locale?.language ?? t.language ?? void 0, f = (m, y) => y === 6 ? u?.startsWith("es") ? "Hoy" : "Today" : m.toLocaleDateString(u, { weekday: "narrow" }), _ = (m) => {
      const y = new Date(m), U = /* @__PURE__ */ new Date(), Rt = new Date(U.getFullYear(), U.getMonth(), U.getDate() - 1), le = y.toLocaleTimeString(u, { hour: "2-digit", minute: "2-digit" }), Ye = u?.startsWith("es");
      if (y.toDateString() === U.toDateString()) return `${Ye ? "Hoy" : "Today"} · ${le}`;
      if (y.toDateString() === Rt.toDateString()) return `${Ye ? "Ayer" : "Yesterday"} · ${le}`;
      const Fe = y.toLocaleDateString(u, { weekday: "long", day: "numeric" });
      return `${Fe.charAt(0).toUpperCase()}${Fe.slice(1)} · ${le}`;
    };
    return h`
      <div class="status ${s.tinted ? "on" : ""}" style=${s.style}>
        <button class="icon" aria-label=${s.locked ? o(t, "unlock") : o(t, "lock")} @click=${() => ke(t, e, !s.locked, !!this.config.invert)}>
          ${Gt(32)}${s.locked ? h`<span class="lk">${ct(14)}</span>` : g}
        </button>
        <div class="txt"><strong>${kt(t, s, !1)}</strong>${r ? h`<span>${r}</span>` : g}</div>
      </div>
      ${s.look !== "unavailable" ? h`<button class="big ${s.locked ? "solid" : ""}" @click=${() => ke(t, e, !s.locked, !!this.config.invert)}>
            ${s.locked ? Ot() : ct()}<span>${s.locked ? o(t, "unlock") : o(t, "lock")}</span>
          </button>` : g}
      <div class="scroll">
        ${s.ids.power ? h`
              <section>
                <h3>${o(t, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError ? h`<p class="empty">${o(t, "history_unavailable")}</p>` : h`<div class="week">
                          ${(a ?? Array.from({ length: 7 }, (m, y) => ({ day: new Date(Date.now() - (6 - y) * 864e5), kwh: 0 }))).map(
      (m, y) => h`<div>
                              <i class=${y === 6 ? "today" : m.kwh ? "" : "zero"} style="height:${m.kwh ? Math.max(6, m.kwh / l * 62) : 3}px"></i>
                              <span>${f(m.day, y)}</span>
                            </div>`
    )}
                        </div>
                        <div class="sum"><span>${o(t, "week_total")} <b>${P(t, c)} kWh</b></span><span>${d} ${u?.startsWith("es") ? d === 1 ? "carga" : "cargas" : d === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${o(t, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? h`<p class="empty">…</p>` : g}
                  ${this._sessions && !p.length ? h`<p class="empty">${o(t, "no_history")}</p>` : g}
                  ${p.map(
      (m) => h`<div class="sess">
                      <span class="dot">${qi()}</span>
                      <span class="nm">
                        <span>${_(m.start)}${m.live ? h`<em>${o(t, "charging_now")}</em>` : g}</span>
                        <small>${m.live ? `${o(t, "in_progress")} · ` : ""}${Ce(m.end - m.start)}${m.live ? "" : ` · ${o(t, "max_kw", { kw: `${P(t, m.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${P(t, m.kwh)} kWh</span>
                    </div>`
    )}
                </div>
              </section>` : g}
      </div>
    `;
  }
  // ---- Settings -----------------------------------------------------------------
  _candidates(t) {
    const e = this.hass, s = {
      entity: (a) => On.includes(Re(a)),
      status_entity: (a) => Xs(e, a),
      power_entity: (a) => Ks(e, a),
      energy_entity: (a) => Gs(e, a)
    }, i = new Set(Vs(e, this.config.entity)), n = (a) => String(e.states[a]?.attributes.friendly_name ?? a), r = this._q.trim().toLowerCase();
    return Object.keys(e.states).filter((a) => !e.entities?.[a]?.hidden && s[t](a)).filter((a) => !r || a.toLowerCase().includes(r) || n(a).toLowerCase().includes(r)).sort((a, l) => {
      const c = (d) => i.has(d) || d === this.config.entity ? 0 : Ys(d, n(d)) ? 1 : 2;
      return c(a) - c(l) || n(a).localeCompare(n(l));
    }).slice(0, 60);
  }
  _picker(t) {
    const e = this.hass, s = this._candidates(t), i = this.config[t], n = (a) => String(e.states[a]?.attributes.friendly_name ?? a), r = (a) => {
      this._save({ [t]: a }), this._pick = void 0, this._q = "";
    };
    return h`<div class="picker">
      <label class="search">${Es(16)}<input
        type="search"
        placeholder=${o(e, "search_entities")}
        .value=${this._q}
        @input=${(a) => this._q = a.target.value}
      /></label>
      ${t !== "entity" ? h`<button class="opt ${i ? "" : "sel"}" @click=${() => r(void 0)}><span>${o(e, "auto")}</span><span class="ck">${Ct(18)}</span></button>
            <button class="opt ${i === "none" ? "sel" : ""}" @click=${() => r("none")}><span>${o(e, "none")}</span><span class="ck">${Ct(18)}</span></button>` : g}
      ${s.map(
      (a) => h`<button class="opt ${i === a ? "sel" : ""}" @click=${() => r(a)}>
          <span>${n(a)}<small>${a}</small></span><span class="ck">${Ct(18)}</span>
        </button>`
    )}
    </div>`;
  }
  _row(t, e, s) {
    const i = this.hass, n = this.config[t], r = n === "none" ? o(i, "none") : n ? String(i.states[n]?.attributes.friendly_name ?? n) : s ? `${o(i, "auto")} · ${i.states[s]?.attributes.friendly_name ?? s}` : o(i, "auto"), a = this._pick === t;
    return h`<button class="li" aria-expanded=${a} @click=${() => {
      this._pick = a ? void 0 : t, this._q = "";
    }}>
      <span class="nm">${e}${t === "entity" && n ? h`<small>${n}</small>` : g}</span>
      <span class="val">${r}${_e(a, 16)}</span>
    </button>
    ${a ? this._picker(t) : g}`;
  }
  _settings() {
    const t = this.hass, e = this.config.entity, s = tt(e), i = o(t, s ? "raw_locked" : "raw_on"), n = o(t, s ? "raw_unlocked" : "raw_off"), r = Ln(e, !!this.config.invert) === "active", a = o(t, "ch_locked"), l = o(t, "ch_unlocked"), c = Ae(t, { entity: e });
    return h`<div class="scroll">
      <section>
        <h3>${o(t, "ch_lock_section")}</h3>
        <div class="list">
          ${this._row("entity", o(t, "ch_entity"))}
          <button class="li" role="switch" aria-checked=${!!this.config.invert} @click=${() => this._save({ invert: !this.config.invert })}>
            <span class="nm">${o(t, "ch_invert")}<small>${o(t, "ch_invert_sub", { a: i, b: n })}</small></span>
            <span class="tog ${this.config.invert ? "on" : ""}"></span>
          </button>
        </div>
      </section>
      <p class="explain">${o(t, "ch_explain", { a: i, la: r ? a : l, b: n, lb: r ? l : a, press: r ? i : n })}</p>
      <section>
        <h3>${o(t, "ch_data")}</h3>
        <div class="list">
          ${this._row("status_entity", o(t, "ch_status"), c.status)}
          ${this._row("power_entity", o(t, "ch_power"), c.power)}
          ${this._row("energy_entity", o(t, "ch_energy"), c.energy)}
          <label class="li">
            <span class="nm">${o(t, "ch_max")}</span>
            <input
              class="num"
              type="number"
              inputmode="decimal"
              min="1"
              max="50"
              step="0.1"
              placeholder="7,4"
              .value=${this.config.max_power != null ? String(this.config.max_power) : ""}
              @change=${(d) => {
      const p = parseFloat(d.target.value.replace(",", "."));
      this._save({ max_power: Number.isFinite(p) && p > 0 ? p : void 0 });
    }}
            />
          </label>
        </div>
      </section>
      ${this._localOnly ? h`<p class="note">${o(t, "save_local")}</p>` : g}
    </div>`;
  }
};
D.styles = [
  k.styles,
  S`
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
j([
  x({ attribute: !1 })
], D.prototype, "config", 2);
j([
  x()
], D.prototype, "name", 2);
j([
  x()
], D.prototype, "view", 2);
j([
  x({ attribute: !1 })
], D.prototype, "onConfig", 2);
j([
  b()
], D.prototype, "_sessions", 2);
j([
  b()
], D.prototype, "_histError", 2);
j([
  b()
], D.prototype, "_pick", 2);
j([
  b()
], D.prototype, "_q", 2);
j([
  b()
], D.prototype, "_localOnly", 2);
D = j([
  E("terral-charger-dialog")
], D);
function Wn(t, e, s, i, n) {
  document.querySelector("terral-charger-dialog")?.remove();
  const r = document.createElement("terral-charger-dialog");
  return r.hass = t, r.config = { ...e }, r.name = s, r.view = i, r.onConfig = n, document.body.appendChild(r), r;
}
function Bn(t) {
  for (const e of document.querySelectorAll("terral-charger-dialog")) e.hass = t;
}
var qn = Object.defineProperty, Yn = Object.getOwnPropertyDescriptor, st = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Yn(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && qn(e, s, n), n;
};
const Fn = "terral-home-charger";
let I = class extends z {
  constructor() {
    super(...arguments), this._size = "s22", this._spark = [], this._held = !1, this._toggle = (t) => {
      if (t.stopPropagation(), !this.hass || !this._config) return;
      const e = this.hass.states[this._config.entity];
      if (!e) return;
      const s = wt(this.hass, this._config);
      s.look !== "unavailable" && ke(this.hass, e, !s.locked, !!this._config.invert);
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
    const s = wt(this.hass, this._config).ids;
    return [this._config.entity, s.status, s.power, s.energy].some((i) => i && e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (!this.hass || !this._config) return;
    t.has("hass") && Bn(this.hass);
    const e = wt(this.hass, this._config);
    if (this._size === "s42" && e.ids.power) {
      this._histFor !== e.ids.power && (this._histFor = e.ids.power, this._loadHistory(e.ids.power), clearInterval(this._histTimer), this._histTimer = window.setInterval(() => this._loadHistory(e.ids.power), 30 * 6e4));
      const s = Ue(this.hass, e.ids.power), i = this._spark[this._spark.length - 1];
      if (s != null && (!i || i[1] !== s)) {
        const n = Date.now();
        this._spark = [...this._spark.filter(([r]) => n - r < 36e5), [n, s]], e.look === "charging" && !this._sessionStart && (this._sessionStart = n), e.look !== "charging" && (this._sessionStart = void 0);
      }
    }
  }
  async _loadHistory(t) {
    if (this.hass)
      try {
        const e = Date.now(), s = await Qs(this.hass, t, new Date(e - 7 * 864e5)), i = Zs(s, e);
        this._week = Js(i, 7).reduce((r, a) => r + a.kwh, 0);
        const n = i.find((r) => r.live);
        this._sessionStart = n?.start, this._spark = s.filter(([r]) => e - r < 36e5);
      } catch {
        this._week = void 0;
      }
  }
  _openWindow(t = "main") {
    !this.hass || !this._config || Wn(this.hass, this._config, this._name, t, (e) => this._applyConfig(e));
  }
  /** Settings changed in the window: tell the Terral panel to store them. */
  _applyConfig(t) {
    this._config = { ...this._config, ...t }, this._histFor = void 0;
    const e = new CustomEvent("terral-card-config", { detail: { config: t }, bubbles: !0, composed: !0, cancelable: !0 });
    return this.dispatchEvent(e), e.defaultPrevented;
  }
  // ---- Render ---------------------------------------------------------------
  _icon(t, e) {
    return h`<button class="icon" aria-label=${t.locked ? o(this.hass, "unlock") : o(this.hass, "lock")} ?disabled=${t.look === "unavailable"} @click=${this._toggle}>
      ${Gt(e)}
      ${t.locked ? h`<span class="lk">${ct(14)}</span>` : g}
    </button>`;
  }
  _lockBtn(t) {
    return t.look === "unavailable" ? g : h`<button class="pb ${t.locked && t.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${t.locked ? Ot(19) : ct(19)}<span>${t.locked ? o(this.hass, "unlock") : o(this.hass, "lock")}</span>
    </button>`;
  }
  _sparkline() {
    const t = this._spark;
    if (t.length < 2) return g;
    const e = 300, s = 58, i = Date.now(), n = Math.max(this._config?.max_power ?? 0, ...t.map((c) => c[1]), 1), r = t.map(([c, d]) => [Math.max(0, e - (i - c) / 36e5 * e), s - 4 - d / n * (s - 10)]);
    r.push([e, r[r.length - 1][1]]);
    const a = r.map((c, d) => `${d ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" "), l = r[r.length - 1];
    return v`<svg class="spark" viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${a} L${e} ${s} L${r[0][0]} ${s}Z"></path><path class="l" d=${a}></path><circle cx=${l[0]} cy=${l[1]} r="4"></circle></svg>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass;
    if (!t.states[this._config.entity])
      return h`<div class="card off missing"><span>${o(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = wt(t, this._config), i = this._size, n = Fs(t, s.ids.energy), r = s.kw != null ? `${P(t, s.kw)} kW` : "", a = n != null ? `${P(t, n)} kWh` : "", l = s.look === "charging", c = this._name;
    let d;
    if (i === "s11")
      d = h`${this._icon(s, 22)}<div class="text"><span class="name">${c}</span><span class="state">${kt(t, s, !0)}</span></div>`;
    else if (i === "s21") {
      const p = l && a ? [r, a].filter(Boolean).join(" · ") : kt(t, s, !0);
      d = h`${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${p}</span></div>`;
    } else {
      const p = h`<div class="head">${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${kt(t, s, !1)}</span></div></div>`;
      if (i === "s22")
        d = h`${p}<div class="row">
          ${l && (r || a) ? h`${r ? h`<div class="pb static"><span>${r}</span></div>` : g}
                ${a ? h`<div class="pb static">${rs()}<span>${a}</span></div>` : g}` : this._lockBtn(s)}
        </div>`;
      else {
        const u = this._sessionStart ?? (s.ids.status ? new Date(t.states[s.ids.status]?.last_changed ?? Date.now()).getTime() : void 0);
        d = h`${p}
          ${l ? h`<div class="chart flow">
                  <div class="chead"><span class="big">${s.kw != null ? P(t, s.kw) : "–"}<small>kW</small></span><span class="state">${o(t, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${a ? h`<div class="pb static">${rs()}<span>${a}</span></div>` : g}
                  ${u ? h`<div class="pb static">${Yi()}<span>${Ce(Date.now() - u)}</span></div>` : g}
                </div>` : h`<div class="stats">
                ${a ? h`<div class="stat"><b>${a}</b><span>${o(t, "last_session")}</span></div>` : g}
                ${this._week != null ? h`<div class="stat"><b>${P(t, this._week)} kWh</b><span>${o(t, "this_week")}</span></div>` : g}
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
      aria-label=${`${c}, ${kt(t, s, !1)}`}
      @click=${this._cardClick}
      @keydown=${(p) => {
      (p.key === "Enter" || p.key === " ") && p.target === p.currentTarget && (p.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(p) => p.preventDefault()}
    >${d}</div>`;
  }
};
I.styles = S`
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
st([
  x({ attribute: !1 })
], I.prototype, "hass", 2);
st([
  b()
], I.prototype, "_config", 2);
st([
  b()
], I.prototype, "_size", 2);
st([
  b()
], I.prototype, "_spark", 2);
st([
  b()
], I.prototype, "_week", 2);
st([
  b()
], I.prototype, "_sessionStart", 2);
I = st([
  E(Fn)
], I);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vn = { CHILD: 2 }, Kn = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Gn = class {
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
const { I: Xn } = yi, us = (t) => t, gs = () => document.createComment(""), vt = (t, e, s) => {
  const i = t._$AA.parentNode, n = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const r = i.insertBefore(gs(), n), a = i.insertBefore(gs(), n);
    s = new Xn(r, a, t, t.options);
  } else {
    const r = s._$AB.nextSibling, a = s._$AM, l = a !== t;
    if (l) {
      let c;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (c = t._$AU) !== a._$AU && s._$AP(c);
    }
    if (r !== n || l) {
      let c = s._$AA;
      for (; c !== r; ) {
        const d = us(c).nextSibling;
        us(i).insertBefore(c, n), c = d;
      }
    }
  }
  return s;
}, F = (t, e, s = t) => (t._$AI(e, s), t), Qn = {}, Zn = (t, e = Qn) => t._$AH = e, Jn = (t) => t._$AH, fe = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fs = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= s; n++) i.set(t[n], n);
  return i;
}, ms = Kn(class extends Gn {
  constructor(t) {
    if (super(t), t.type !== Vn.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const n = [], r = [];
    let a = 0;
    for (const l of t) n[a] = i ? i(l, a) : a, r[a] = s(l, a), a++;
    return { values: r, keys: n };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const n = Jn(t), { values: r, keys: a } = this.dt(e, s, i);
    if (!Array.isArray(n)) return this.ut = a, r;
    const l = this.ut ??= [], c = [];
    let d, p, u = 0, f = n.length - 1, _ = 0, m = r.length - 1;
    for (; u <= f && _ <= m; ) if (n[u] === null) u++;
    else if (n[f] === null) f--;
    else if (l[u] === a[_]) c[_] = F(n[u], r[_]), u++, _++;
    else if (l[f] === a[m]) c[m] = F(n[f], r[m]), f--, m--;
    else if (l[u] === a[m]) c[m] = F(n[u], r[m]), vt(t, c[m + 1], n[u]), u++, m--;
    else if (l[f] === a[_]) c[_] = F(n[f], r[_]), vt(t, n[u], n[f]), f--, _++;
    else if (d === void 0 && (d = fs(a, _, m), p = fs(l, u, f)), d.has(l[u])) if (d.has(l[f])) {
      const y = p.get(a[_]), U = y !== void 0 ? n[y] : null;
      if (U === null) {
        const Rt = vt(t, n[u]);
        F(Rt, r[_]), c[_] = Rt;
      } else c[_] = F(U, r[_]), vt(t, n[u], U), n[y] = null;
      _++;
    } else fe(n[f]), f--;
    else fe(n[u]), u++;
    for (; _ <= m; ) {
      const y = vt(t, c[m + 1]);
      F(y, r[_]), c[_++] = y;
    }
    for (; u <= f; ) {
      const y = n[u++];
      y !== null && fe(y);
    }
    return this.ut = a, Zn(t, c), Q;
  }
});
function tr(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const er = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function sr(t) {
  return er[t];
}
var ir = Object.defineProperty, nr = Object.getOwnPropertyDescriptor, It = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? nr(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && ir(e, s, n), n;
};
let et = class extends k {
  constructor() {
    super(...arguments), this.existing = /* @__PURE__ */ new Set(), this._q = "", this._allChargers = !1;
  }
  get heading() {
    return o(this.hass, "add_accessory");
  }
  _rows() {
    const t = this.hass, e = [];
    for (const [i, n] of Object.entries(t.states)) {
      const r = i.startsWith("alarm_control_panel."), a = /^(switch|lock|input_boolean)\./.test(i), l = String(n.attributes.friendly_name ?? i), c = a && (this._allChargers || Ys(i, l));
      if (!r && !c && !i.startsWith("light.")) continue;
      const d = t.entities?.[i];
      d?.hidden || d?.entity_category || e.push({
        id: i,
        name: t.formatEntityName?.(n) || n.attributes.friendly_name || i,
        area: Et(t, i) ?? o(t, "other_area"),
        group: !r && !c && Ps(n),
        on: !r && !c && $(n),
        alarm: r,
        charger: c
      });
    }
    const s = this._q.trim().toLowerCase();
    return e.filter((i) => !s || i.name.toLowerCase().includes(s) || i.area.toLowerCase().includes(s)).sort((i, n) => Number(n.group) - Number(i.group) || i.area.localeCompare(n.area) || i.name.localeCompare(n.name));
  }
  renderContent() {
    const t = this._rows(), e = t.filter((r) => r.alarm), s = t.filter((r) => r.charger), i = t.filter((r) => r.group), n = /* @__PURE__ */ new Map();
    for (const r of t.filter((a) => !a.group && !a.alarm && !a.charger))
      n.has(r.area) || n.set(r.area, []), n.get(r.area).push(r);
    return h`
      <label class="search">
        ${Es()}
        <input
          type="search"
          placeholder=${o(this.hass, "search_lights")}
          .value=${this._q}
          @input=${(r) => this._q = r.target.value}
        />
      </label>
      <div class="scroll">
        ${t.length ? g : h`<p class="empty">${o(this.hass, "no_lights")}</p>`}
        ${e.length ? this._section(o(this.hass, "security"), e) : g}
        ${s.length ? this._section(o(this.hass, "ev_charger"), s) : g}
        ${i.length ? this._section(o(this.hass, "light_groups"), i) : g}
        ${[...n].map(([r, a]) => this._section(r, a))}
        ${this._allChargers ? g : h`<button class="more" @click=${() => this._allChargers = !0}>${Gt(18)}<span>${o(this.hass, "add_charger_other")}</span></button>`}
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
            <span class="ic ${s.on ? "on" : ""}">${s.alarm ? Oe(20) : s.charger ? Gt(20) : at(s.on, 20)}</span>
            <span class="nm">${s.name}${s.group ? h`<small>${o(this.hass, "group")}</small>` : g}</span>
            ${i ? h`<span class="added">${Ct(16)} ${o(this.hass, "added")}</span>` : g}
          </button>`;
    })}
      </div>
    </section>`;
  }
  _pick(t) {
    this.onPick?.(t), this.close();
  }
};
et.styles = [
  k.styles,
  S`
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
      .more {
        width: 100%;
        margin-top: 16px;
        min-height: 48px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.85);
      }
      .empty {
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        margin: 30px 0;
      }
    `
];
It([
  x({ attribute: !1 })
], et.prototype, "existing", 2);
It([
  x({ attribute: !1 })
], et.prototype, "onPick", 2);
It([
  b()
], et.prototype, "_q", 2);
It([
  b()
], et.prototype, "_allChargers", 2);
et = It([
  E("terral-add-sheet")
], et);
function rr(t, e, s) {
  const i = document.createElement("terral-add-sheet");
  return i.hass = t, i.existing = e, i.onPick = s, document.body.appendChild(i), i;
}
var ar = Object.defineProperty, or = Object.getOwnPropertyDescriptor, ti = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? or(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && ar(e, s, n), n;
};
let se = class extends k {
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
se.styles = [
  k.styles,
  S`
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
ti([
  x({ attribute: !1 })
], se.prototype, "options", 2);
se = ti([
  E("terral-confirm-sheet")
], se);
function _s(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
var lr = Object.defineProperty, cr = Object.getOwnPropertyDescriptor, Be = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? cr(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && lr(e, s, n), n;
};
let Ht = class extends k {
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
          <span class="ic">${Oi()}</span><span class="nm">${o(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${ji()}</span>
          <span class="nm">${o(this.hass, "by_rooms")}<small>${o(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" disabled>
          <span class="ic">${zs()}</span>
          <span class="nm">${o(this.hass, "terral_settings")}<small>${o(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
Ht.styles = [
  k.styles,
  S`
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
Be([
  x({ attribute: !1 })
], Ht.prototype, "actions", 2);
Be([
  x()
], Ht.prototype, "version", 2);
Ht = Be([
  E("terral-menu-sheet")
], Ht);
function hr(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const ei = "0.6.0";
var dr = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, C = (t, e, s, i) => {
  for (var n = i > 1 ? void 0 : i ? pr(e, s) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (n = (i ? a(e, s, n) : a(n)) || n);
  return i && n && dr(e, s, n), n;
};
const Bt = "top", bs = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], ur = 0.85, xs = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger"
}, gr = ["entity", "name", "invert", "status_entity", "power_entity", "energy_entity", "max_power"], ft = "#3a4f80", qt = "58,79,128", fr = `linear-gradient(180deg, ${ft} 0, rgba(${qt},.6) 36px, rgba(${qt},0) 120px), linear-gradient(0deg, ${ft} 0, rgba(${qt},.6) 28px, rgba(${qt},0) 96px), `, me = ft, mr = ft, $t = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let w = class extends z {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || rr(this.hass, new Set(this._allCards.map((t) => t.entity)), (t) => {
        const e = this.hass?.states[t], s = t.split(".")[0], i = s === "alarm_control_panel" ? { id: $t(), type: "alarm", entity: t, w: 2, h: 2 } : s === "light" ? { id: $t(), type: "light", entity: t, w: e && Ps(e) ? 2 : 1, h: 2 } : { id: $t(), type: "charger", entity: t, w: 2, h: 2, invert: Hn(this.hass, t) };
        this._update((n) => n.cards.push(i)), i.type === "charger" && setTimeout(() => this._els.get(i.id)?.openSettings?.(), 400);
      });
    }, this._menu = () => {
      this.hass && hr(this.hass, this.panel?.config?.version ?? ei, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms()
      });
    }, this._addSection = () => {
      const t = $t();
      this._update((e) => e.sections.push({ id: t, title: o(this.hass, "new_section"), cards: [] })), this._renaming = t;
    }, this._onCardConfig = (t) => {
      const e = t.target, s = [...this._els].find(([, n]) => n === e)?.[0];
      if (!s) return;
      t.preventDefault();
      const i = t.detail.config;
      this._update((n) => {
        for (const r of [n.cards, ...n.sections.map((a) => a.cards)]) {
          const a = r.find((l) => l.id === s);
          if (a)
            for (const l of gr)
              i[l] === void 0 || i[l] === "" ? delete a[l] : a[l] = i[l];
        }
      });
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
  /**
   * Only the properties we set are saved and put back, one by one. HA applies
   * its themes (and dark mode) as inline styles on these same elements, so
   * restoring whole style attributes would wipe a theme applied while Terral
   * was open — that left the sidebar half light, half dark.
   */
  _paintChrome(t) {
    const e = document.querySelector('meta[name="theme-color"]'), s = document.documentElement, i = document.body, n = [
      [s, "background", ft],
      [i, "background", ft],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", me],
      [i, "--app-theme-color", me],
      [i, "--primary-background-color", mr]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: n.map(([r, a]) => [r, a, r.style.getPropertyValue(a), r.style.getPropertyPriority(a)])
      };
      for (const [r, a, l] of n) r.style.setProperty(a, l);
      e && (e.content = me), this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [r, a, l, c] of this._chromeSaved.props)
        l ? r.style.setProperty(a, l, c) : r.style.removeProperty(a);
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
    return e === Bt ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: Bt, card: e };
    for (const s of this._sections) {
      const i = s.cards.find((n) => n.id === t);
      if (i) return { key: s.id, card: i };
    }
  }
  // ---- Layout -------------------------------------------------------------
  _measure(t) {
    const e = t < 600 ? 16 : 24, s = t < 600 ? 10 : 14, i = Math.min(t, 1180) - 2 * e, n = t < 600 ? 2 : 4, r = (i - s * (n - 1)) / n, a = window.__terralRowRatio ?? ur, l = Math.max(48, Math.round((r - s) / 2 * a));
    this._colW = r, this._gap = s, n !== this._cols && (this._cols = n), l !== this._rowH && (this._rowH = l);
  }
  _sizeOf(t) {
    const e = t.h === 1 || t.h === 4 ? t.h : 2, s = e === 4 || t.w === 2 ? 2 : 1;
    return { w: Math.min(s, this._cols), h: e };
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t) {
    return (this._els.get(t.id)?.getTerralSizes?.() ?? bs).filter((s) => s.w <= this._cols).length > 1;
  }
  _element(t) {
    let e = this._els.get(t.id);
    e || (e = document.createElement(xs[t.type] ?? "terral-home-light"), this._els.set(t.id, e));
    const { id: s, type: i, w: n, h: r, ...a } = t, l = { ...a, type: `custom:${xs[t.type] ?? "terral-home-light"}`, view_layout: { terral: { w: n, h: r } } }, c = JSON.stringify(l);
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
      const r = n.sections.find((a) => a.id === t);
      r && (r.title = s);
    });
  }
  _removeSection(t) {
    const e = this._sections.findIndex((n) => n.id === t), s = this._sections[e];
    if (!s || !this.hass) return;
    const i = (n) => this._update((r) => {
      const a = r.sections.findIndex((c) => c.id === t);
      if (a < 0) return;
      const [l] = r.sections.splice(a, 1);
      n ? (a > 0 ? r.sections[a - 1].cards : r.cards).push(...l.cards) : l.cards.forEach((c) => this._els.delete(c.id));
    });
    if (!s.cards.length) return i(!1);
    _s(this.hass, {
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
    this.hass && _s(this.hass, {
      heading: o(this.hass, "by_rooms"),
      message: o(this.hass, "by_rooms_msg"),
      actions: [{ label: o(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }]
    });
  }
  _sectionsFromRooms() {
    const t = this.hass;
    t && (this._update((e) => {
      const s = new Map(e.sections.map((a) => [a.title.toLowerCase(), a])), i = [e.cards, ...e.sections.map((a) => a.cards)], n = [];
      for (const a of i)
        for (const l of [...a]) {
          const c = Et(t, l.entity);
          c && (n.push([l, c]), a.splice(a.indexOf(l), 1));
        }
      const r = [...new Set(n.map(([, a]) => a))].filter((a) => !s.has(a.toLowerCase())).sort((a, l) => a.localeCompare(l));
      for (const a of r) {
        const l = { id: $t(), title: a, cards: [] };
        e.sections.push(l), s.set(a.toLowerCase(), l);
      }
      for (const [a, l] of n) s.get(l.toLowerCase()).cards.push(a);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), n = (this._els.get(e.id)?.getTerralSizes?.() ?? bs).filter((a) => a.w <= this._cols);
    this._resizeOrigin = { left: i.left, top: i.top, sizes: n };
    const r = this._sizeOf(e);
    this._resize = { id: e.id, w: r.w, h: r.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let n = e.sizes[0], r = 1 / 0;
    for (const a of e.sizes) {
      const l = (a.w - s) ** 2 + (a.h - i) ** 2;
      l < r && ([n, r] = [a, l]);
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
      const n = w._list(i, e.key)?.find((r) => r.id === t.id);
      n && Object.assign(n, { w: t.w, h: t.h });
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
    const s = this.shadowRoot?.elementsFromPoint(t, e) ?? [], i = s.find((r) => r.dataset?.cid != null && r.dataset.cid !== this._drag?.id);
    if (i) {
      this._dropCard = { key: i.dataset.key, targetId: i.dataset.cid };
      return;
    }
    const n = s.find((r) => r.dataset?.zone != null);
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
      const r = w._list(n, i.key), a = r.findIndex((f) => f.id === t), l = s ? r.findIndex((f) => f.id === s) : -1, [c] = r.splice(a, 1), d = w._list(n, e);
      if (!d) {
        r.splice(a, 0, c);
        return;
      }
      if (!s) {
        d.push(c);
        return;
      }
      const p = d.findIndex((f) => f.id === s), u = i.key === e && l > a;
      d.splice(p < 0 ? d.length : p + (u ? 1 : 0), 0, c);
    });
  }
  _moveSection(t, e) {
    const s = this._sections.findIndex((i) => i.id === t);
    s < 0 || s === e || this._update((i) => {
      const n = i.sections.findIndex((a) => a.id === t), [r] = i.sections.splice(n, 1);
      i.sections.splice(Math.min(e, i.sections.length), 0, r);
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
    const r = e.scrollTop - n;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - r }, this._dragDy += r;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, n = e && !this._allCards.length, r = this._drag?.kind === "card", a = this._drag?.kind === "section", l = s.length > 0 || n || t && (r || !i.length);
    let c = 0;
    return h`
      <div class="scroller" style="background:${fr}${sr("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig}>
        <div class="wrap ${t ? "editing" : ""}">
          <div class="top">
            <button class="glass round" aria-label=${o(this.hass, "menu")} @click=${() => tr(this, "hass-toggle-menu")}>
              ${Ti()}
            </button>
            <span class="spacer"></span>
            ${t ? h`<div class="glass pill">
                  <button class="pbtn" aria-label=${o(this.hass, "add_accessory")} @click=${this._add}>${Nt(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${o(this.hass, "done")}</button>
                </div>` : h`<div class="glass pill">
                  <button class="pbtn" aria-label=${o(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${Nt(22)}</button>
                  <button class="pbtn" aria-label=${o(this.hass, "more_options")} @click=${this._menu}>${Pi(22)}</button>
                </div>`}
          </div>
          <h1>${o(this.hass, "home_title")}</h1>
          ${this._error ? h`<p class="notice">${o(this.hass, "panel_error")} (${this._error})</p>` : g}
          ${l ? this._grid(Bt, s, t, n || t && !i.length, s.length === 0 && t ? o(this.hass, "no_section") : void 0) : g}
          ${ms(
      i,
      (d) => d.id,
      (d) => {
        const p = a && this._drag?.id === d.id, u = a && !p && this._dropSection === c;
        return p || c++, !t && !d.cards.length ? g : h`${u ? h`<div class="dropline"></div>` : g}${this._section(d, t, p)}`;
      }
    )}
          ${a && this._dropSection === c ? h`<div class="dropline"></div>` : g}
          ${t && e ? h`<button class="addsec" @click=${this._addSection}>${Nt(20)}<span>${o(this.hass, "add_section")}</span></button>` : g}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, n = s ? `translate:0 ${this._dragDy}px` : "";
    return h`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${n}>
      <header>
        ${e ? h`<button class="sdel" aria-label=${o(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${ns()}</button>` : g}
        ${i ? h`<input
              class="rename"
              .value=${t.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(r) => {
      r.key === "Enter" && this._commitRename(t.id, r.target.value), r.key === "Escape" && (this._renaming = void 0);
    }}
              @blur=${(r) => this._commitRename(t.id, r.target.value)}
            />` : e ? h`<button class="title" aria-label=${o(this.hass, "rename_section")} @click=${() => this._renaming = t.id}>${t.title}</button>` : h`<h2>${t.title}</h2>`}
        ${e ? h`<button
              class="handle"
              aria-label=${o(this.hass, "move_section")}
              @pointerdown=${(r) => this._handleDown(r, t.id)}
            >${Li()}</button>` : g}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? o(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  _grid(t, e, s, i, n) {
    const r = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId;
    return h`<div
      class="grid ${r ? "zone-target" : ""} ${t === Bt ? "top-grid" : ""}"
      data-zone=${t}
      style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
    >
      ${ms(e, (a) => a.id, (a, l) => this._cell(t, a, l, s))}
      ${n && !e.length ? h`<div class="placeholder" style="grid-column:1/-1">${n}</div>` : g}
      ${i ? h`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${Nt(26)}</span><span>${o(this.hass, "add_accessory")}</span>
          </button>` : g}
    </div>`;
  }
  _cell(t, e, s, i) {
    const { w: n, h: r } = this._sizeOf(e), a = this._drag?.kind === "card" && this._drag.id === e.id, l = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, c = `grid-column:span ${n};grid-row:span ${r};--d:${s % 5 * -0.07}s;${a ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return h`<div class="cell ${a ? "dragging" : ""} ${l ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${c}>
      ${this._element(e)}
      ${i ? h`<div class="overlay" @pointerdown=${(d) => this._overlayDown(d, e.id)}>
            <button class="del" aria-label=${o(this.hass, "delete")} @click=${() => this._remove(e.id)}>${ns()}</button>
            ${this._canResize(e) ? h`<button
              class="corner"
              aria-label=${o(this.hass, "resize")}
              @pointerdown=${(d) => this._resizeDown(d, e)}
              @pointermove=${this._resizeMove}
              @pointerup=${this._resizeUp}
              @pointercancel=${this._resizeUp}
            ><span></span></button>` : g}
          </div>` : g}
      ${this._resize?.id === e.id ? h`<div
            class="ghost"
            style="width:${this._span(this._resize.w, this._colW)}px;height:${this._span(this._resize.h, this._rowH)}px"
          ></div>` : g}
    </div>`;
  }
};
w.styles = S`
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
C([
  x({ attribute: !1 })
], w.prototype, "hass", 2);
C([
  x({ type: Boolean })
], w.prototype, "narrow", 2);
C([
  x({ attribute: !1 })
], w.prototype, "route", 2);
C([
  x({ attribute: !1 })
], w.prototype, "panel", 2);
C([
  b()
], w.prototype, "_layout", 2);
C([
  b()
], w.prototype, "_error", 2);
C([
  b()
], w.prototype, "_edit", 2);
C([
  b()
], w.prototype, "_cols", 2);
C([
  b()
], w.prototype, "_rowH", 2);
C([
  b()
], w.prototype, "_drag", 2);
C([
  b()
], w.prototype, "_dropCard", 2);
C([
  b()
], w.prototype, "_dropSection", 2);
C([
  b()
], w.prototype, "_dragDx", 2);
C([
  b()
], w.prototype, "_dragDy", 2);
C([
  b()
], w.prototype, "_resize", 2);
C([
  b()
], w.prototype, "_renaming", 2);
w = C([
  E("terral-home-panel")
], w);
const q = window;
q.customCards = q.customCards || [];
q.customCards.some((t) => t.type === "terral-home-light") || q.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: e } } : null
});
q.customCards.some((t) => t.type === "terral-home-alarm") || q.customCards.push({
  type: "terral-home-alarm",
  name: "Terral · Alarma",
  description: "Alarma (Alarmo u otra) al estilo Terral Home / Terral Home alarm (Alarmo or any alarm panel)",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("alarm_control_panel.") ? { config: { type: "custom:terral-home-alarm", entity: e } } : null
});
q.customCards.some((t) => t.type === "terral-home-charger") || q.customCards.push({
  type: "terral-home-charger",
  name: "Terral · Cargador",
  description: "Cargador de coche eléctrico al estilo Terral Home / Terral Home EV charger",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
console.info(
  `%c TERRAL HOME %c v${ei} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  ei as VERSION
};
