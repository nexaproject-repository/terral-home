/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = globalThis, ae = Et.ShadowRoot && (Et.ShadyCSS === void 0 || Et.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ne = Symbol(), ye = /* @__PURE__ */ new WeakMap();
let qe = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== ne) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (ae && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = ye.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ye.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ms = (t) => new qe(typeof t == "string" ? t : t + "", void 0, ne), S = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, r, a) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[a + 1], t[0]);
  return new qe(s, t, ne);
}, _s = (t, e) => {
  if (ae) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), r = Et.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, t.appendChild(i);
  }
}, ve = ae ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return ms(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: bs, defineProperty: xs, getOwnPropertyDescriptor: ys, getOwnPropertyNames: vs, getOwnPropertySymbols: $s, getPrototypeOf: ws } = Object, Rt = globalThis, $e = Rt.trustedTypes, ks = $e ? $e.emptyScript : "", As = Rt.reactiveElementPolyfillSupport, pt = (t, e) => t, zt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ks : null;
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
} }, oe = (t, e) => !bs(t, e), we = { attribute: !0, type: String, converter: zt, reflect: !1, useDefault: !1, hasChanged: oe };
Symbol.metadata ??= Symbol("metadata"), Rt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let K = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = we) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, s);
      r !== void 0 && xs(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: r, set: a } = ys(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: r, set(n) {
      const o = r?.call(this);
      a?.call(this, n), this.requestUpdate(e, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? we;
  }
  static _$Ei() {
    if (this.hasOwnProperty(pt("elementProperties"))) return;
    const e = ws(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(pt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(pt("properties"))) {
      const s = this.properties, i = [...vs(s), ...$s(s)];
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
      for (const r of i) s.unshift(ve(r));
    } else e !== void 0 && s.push(ve(e));
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
    return _s(e, this.constructor.elementStyles), e;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : zt).toAttribute(s, i.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = i.getPropertyOptions(r), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : zt;
      this._$Em = r;
      const o = n.fromAttribute(s, a.type);
      this[r] = o ?? this._$Ej?.get(r) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, r = !1, a) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (a = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? oe)(a, s) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: r, wrapped: a }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), a !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, a] of i) {
        const { wrapped: n } = a, o = this[r];
        n !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, a, o);
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
K.elementStyles = [], K.shadowRootOptions = { mode: "open" }, K[pt("elementProperties")] = /* @__PURE__ */ new Map(), K[pt("finalized")] = /* @__PURE__ */ new Map(), As?.({ ReactiveElement: K }), (Rt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis, ke = (t) => t, Tt = le.trustedTypes, Ae = Tt ? Tt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, We = "$lit$", H = `lit$${Math.random().toFixed(9).slice(2)}$`, Ye = "?" + H, Cs = `<${Ye}>`, W = document, mt = () => W.createComment(""), _t = (t) => t === null || typeof t != "object" && typeof t != "function", ce = Array.isArray, Ss = (t) => ce(t) || typeof t?.[Symbol.iterator] == "function", Vt = `[ 	
\f\r]`, lt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ce = /-->/g, Se = />/g, R = RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ee = /'/g, Me = /"/g, Ve = /^(?:script|style|textarea|title)$/i, Fe = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = Fe(1), y = Fe(2), Y = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), ze = /* @__PURE__ */ new WeakMap(), B = W.createTreeWalker(W, 129);
function Ke(t, e) {
  if (!ce(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ae !== void 0 ? Ae.createHTML(e) : e;
}
const Es = (t, e) => {
  const s = t.length - 1, i = [];
  let r, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = lt;
  for (let o = 0; o < s; o++) {
    const c = t[o];
    let h, u, p = -1, f = 0;
    for (; f < c.length && (n.lastIndex = f, u = n.exec(c), u !== null); ) f = n.lastIndex, n === lt ? u[1] === "!--" ? n = Ce : u[1] !== void 0 ? n = Se : u[2] !== void 0 ? (Ve.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = R) : u[3] !== void 0 && (n = R) : n === R ? u[0] === ">" ? (n = r ?? lt, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? R : u[3] === '"' ? Me : Ee) : n === Me || n === Ee ? n = R : n === Ce || n === Se ? n = lt : (n = R, r = void 0);
    const m = n === R && t[o + 1].startsWith("/>") ? " " : "";
    a += n === lt ? c + Cs : p >= 0 ? (i.push(h), c.slice(0, p) + We + c.slice(p) + H + m) : c + H + (p === -2 ? o : m);
  }
  return [Ke(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class bt {
  constructor({ strings: e, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let a = 0, n = 0;
    const o = e.length - 1, c = this.parts, [h, u] = Es(e, s);
    if (this.el = bt.createElement(h, i), B.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = B.nextNode()) !== null && c.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(We)) {
          const f = u[n++], m = r.getAttribute(p).split(H), b = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: a, name: b[2], strings: m, ctor: b[1] === "." ? zs : b[1] === "?" ? Ts : b[1] === "@" ? Ps : Nt }), r.removeAttribute(p);
        } else p.startsWith(H) && (c.push({ type: 6, index: a }), r.removeAttribute(p));
        if (Ve.test(r.tagName)) {
          const p = r.textContent.split(H), f = p.length - 1;
          if (f > 0) {
            r.textContent = Tt ? Tt.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(p[m], mt()), B.nextNode(), c.push({ type: 2, index: ++a });
            r.append(p[f], mt());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ye) c.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(H, p + 1)) !== -1; ) c.push({ type: 7, index: a }), p += H.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const i = W.createElement("template");
    return i.innerHTML = e, i;
  }
}
function X(t, e, s = t, i) {
  if (e === Y) return e;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const a = _t(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(t), r._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (e = X(t, r._$AS(t, e.values), r, i)), e;
}
class Ms {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (e?.creationScope ?? W).importNode(s, !0);
    B.currentNode = r;
    let a = B.nextNode(), n = 0, o = 0, c = i[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let h;
        c.type === 2 ? h = new nt(a, a.nextSibling, this, e) : c.type === 1 ? h = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (h = new Ds(a, this, e)), this._$AV.push(h), c = i[++o];
      }
      n !== c?.index && (a = B.nextNode(), n++);
    }
    return B.currentNode = W, r;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class nt {
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
    e = X(this, e, s), _t(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== Y && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ss(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && _t(this._$AH) ? this._$AA.nextSibling.data = e : this.T(W.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = bt.createElement(Ke(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const a = new Ms(r, this), n = a.u(this.options);
      a.p(s), this.T(n), this._$AH = a;
    }
  }
  _$AC(e) {
    let s = ze.get(e.strings);
    return s === void 0 && ze.set(e.strings, s = new bt(e)), s;
  }
  k(e) {
    ce(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const a of e) r === s.length ? s.push(i = new nt(this.O(mt()), this.O(mt()), this, this.options)) : i = s[r], i._$AI(a), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = ke(e).nextSibling;
      ke(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Nt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, r, a) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(e, s = this, i, r) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) e = X(this, e, s, 0), n = !_t(e) || e !== this._$AH && e !== Y, n && (this._$AH = e);
    else {
      const o = e;
      let c, h;
      for (e = a[0], c = 0; c < a.length - 1; c++) h = X(this, o[i + c], s, c), h === Y && (h = this._$AH[c]), n ||= !_t(h) || h !== this._$AH[c], h === g ? e = g : e !== g && (e += (h ?? "") + a[c + 1]), this._$AH[c] = h;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class zs extends Nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class Ts extends Nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class Ps extends Nt {
  constructor(e, s, i, r, a) {
    super(e, s, i, r, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = X(this, e, s, 0) ?? g) === Y) return;
    const i = this._$AH, r = e === g && i !== g || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== g && (i === g || r);
    r && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ds {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    X(this, e);
  }
}
const Os = { I: nt }, Ls = le.litHtmlPolyfillSupport;
Ls?.(bt, nt), (le.litHtmlVersions ??= []).push("3.3.3");
const js = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const a = s?.renderBefore ?? null;
    i._$litPart$ = r = new nt(e.insertBefore(mt(), a), a, void 0, s ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis;
let M = class extends K {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = js(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Y;
  }
};
M._$litElement$ = !0, M.finalized = !0, de.litElementHydrateSupport?.({ LitElement: M });
const Hs = de.litElementPolyfillSupport;
Hs?.({ LitElement: M });
(de.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Is = { attribute: !0, type: String, converter: zt, reflect: !1, hasChanged: oe }, Rs = (t = Is, e, s) => {
  const { kind: i, metadata: r } = s;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(s.name, t), i === "accessor") {
    const { name: n } = s;
    return { set(o) {
      const c = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(n, c, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, t, o), o;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(o) {
      const c = this[n];
      e.call(this, o), this.requestUpdate(n, c, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function _(t) {
  return (e, s) => typeof s == "object" ? Rs(t, e, s) : ((i, r, a) => {
    const n = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, i), n ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(t) {
  return _({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ns = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Us(t, e) {
  return (s, i, r) => {
    const a = (n) => n.renderRoot?.querySelector(t) ?? null;
    return Ns(s, i, { get() {
      return a(this);
    } });
  };
}
const Bs = {
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
}, qs = {
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
function Q(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function l(t, e, s) {
  let i = (Q(t) === "es" ? Bs : qs)[e] ?? e;
  if (s) for (const [r, a] of Object.entries(s)) i = i.replace(`{${r}}`, String(a));
  return i;
}
function Ge(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return l(t, "just_now");
  if (s < 60) return l(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? l(t, "h_ago", { n: i }) : l(t, "days_ago", { n: Math.round(i / 24) });
}
const Ws = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", G = (t, e = 24) => y`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${Ws} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, Ys = (t = 24) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, Ut = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, Xe = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, Te = (t, e = 16) => y`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, Vs = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, wt = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, Fs = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, Ks = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, Pe = (t = 16) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, Gs = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, Qe = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, Xs = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, Qs = (t = 26) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, Js = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, E = (t, e, s = 2) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Je = y`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, he = (t = 24) => E(t, Je), Ze = (t = 24) => E(t, y`${Je}<path d="M9 12l2 2 4-4"></path>`), Jt = (t = 24) => E(t, y`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), Zs = (t = 20) => E(t, y`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), ti = (t = 20) => E(t, y`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), ei = (t = 20) => E(t, y`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), si = (t = 20) => E(t, y`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), ii = (t = 20) => E(t, y`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), Zt = (t = 20) => E(t, y`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), ts = (t = 20) => E(t, y`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), ri = (t = 24) => E(t, y`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), ai = (t = 20) => E(t, y`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`);
var ni = Object.defineProperty, oi = Object.getOwnPropertyDescriptor, D = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? oi(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && ni(e, s, r), r;
};
let C = class extends M {
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
    return d`
      ${e ? d`<div class="fill" style=${this.vertical ? `height:${t}%` : `width:${t}%`}></div>` : d`<div class="thumb" style=${this.vertical ? `bottom:${t}%` : `left:${t}%`}></div>`}
      <div class="label">
        <slot></slot>
        ${this.showValue ? d`<span>${this._shown}${this.suffix ? d`&nbsp;${this.suffix}` : g}</span>` : g}
      </div>
    `;
  }
};
C.styles = S`
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
D([
  _({ type: Number })
], C.prototype, "value", 2);
D([
  _({ type: Number })
], C.prototype, "min", 2);
D([
  _({ type: Number })
], C.prototype, "max", 2);
D([
  _({ type: Boolean, reflect: !0 })
], C.prototype, "vertical", 2);
D([
  _()
], C.prototype, "mode", 2);
D([
  _()
], C.prototype, "label", 2);
D([
  _()
], C.prototype, "suffix", 2);
D([
  _({ type: Boolean, attribute: "show-value" })
], C.prototype, "showValue", 2);
D([
  x()
], C.prototype, "_drag", 2);
C = D([
  T("terral-slider")
], C);
const es = ["hs", "rgb", "rgbw", "rgbww", "xy"], pe = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], te = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function ss(t) {
  return t.attributes.supported_color_modes ?? [];
}
function Mt(t) {
  const e = ss(t);
  return e.some((s) => es.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function li(t) {
  return ss(t).includes("color_temp");
}
function v(t) {
  return t?.state === "on";
}
function q(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function U(t) {
  const e = t.attributes.brightness;
  if (!(!v(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function O(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function is(t) {
  return O(t).length > 0;
}
function xt(t) {
  return t.attributes.color_temp_kelvin;
}
function J(t) {
  if (!v(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !es.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const De = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, ct = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), dt = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, ci = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, di = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function rs(t, e) {
  if (!e) return De;
  const s = J(t);
  if (!s) {
    const a = xt(t);
    return a && t.attributes.color_mode === "color_temp" && a >= 4500 ? ci : De;
  }
  const i = [255, 255, 255], r = di(s) > 0.75 ? ct(s, [40, 50, 80], 0.45) : s;
  return {
    bg: dt(ct(s, i, 0.84), 0.95),
    fg: dt(ct(s, [10, 10, 20], 0.82)),
    fg2: dt(ct(s, [20, 10, 30], 0.72)),
    accent: dt(r),
    fill: dt(ct(r, i, 0.35))
  };
}
function ut(t, e) {
  return t.callService("light", v(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function Ft(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function ee(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function Pt(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, r = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(r, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function Oe(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function hi(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function P(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function se(t, e) {
  let s;
  for (const i of pe) {
    const r = i.rgb.reduce((a, n, o) => a + (n - t[o]) ** 2, 0);
    (!s || r < s.d) && (s = { d: r, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function gt(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function Le(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const r = getComputedStyle(i).overflowY;
    if ((r === "auto" || r === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function as(t) {
  let e = 0;
  const s = (a) => {
    e = a.touches[0]?.clientY ?? 0;
  }, i = (a) => {
    if (!a.cancelable) return;
    const n = a.touches[0]?.clientY ?? e;
    Le(a.composedPath(), t, n - e) || a.preventDefault();
  }, r = (a) => {
    Le(a.composedPath(), t, -a.deltaY) || a.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", r, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", r);
  };
}
var pi = Object.defineProperty, ui = Object.getOwnPropertyDescriptor, L = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ui(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && pi(e, s, r), r;
};
let Z;
function gi(t, e) {
  Z?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), Z = s;
}
function fi(t) {
  Z?.isConnected && (Z.hass = t);
}
let z = class extends M {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = as(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), Z === this && (Z = void 0);
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
    if (q(t)) return l(this.hass, "unavailable");
    if (!v(t)) return l(this.hass, "off");
    const e = [], s = O(t);
    if (s.length) {
      const n = s.filter((o) => v(this.hass.states[o])).length;
      e.push(`${n} ${l(this.hass, "of")} ${s.length} ${l(this.hass, "lit")}`);
    }
    const i = U(t);
    i != null && e.push(`${i} %`);
    const r = J(t), a = xt(t);
    if (r) {
      const n = se(r, Q(this.hass));
      n && e.push(n);
    } else a && t.attributes.color_mode === "color_temp" && e.push(`${a} K`);
    return e.length || e.push(l(this.hass, "on")), e.join(" · ");
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this.hass.states[this._entityId], e = [this._wide ? "modal" : "sheet", this._expanded ? "expanded" : "", this._closing ? "closing" : ""].join(" ");
    return d`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${e}" role="dialog" aria-modal="true" aria-label=${t ? this._name(t) : this._entityId}>
        ${this._wide ? g : d`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        ${t ? this._content(t) : d`<p class="empty">${l(this.hass, "not_found")}</p>`}
      </div>
    `;
  }
  _content(t) {
    const e = v(t), s = rs(t, this.opts.useLightColor !== !1), i = O(t), r = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, a = this._controls(t), n = i.length ? this._memberList(t, i) : g, o = this._info(t);
    return d`
      <div class="body" style=${r}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${Te(!1, 18)}
              </button>` : g}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? l(this.hass, "turn_off") : l(this.hass, "turn_on")}
            ?disabled=${q(t)}
            @click=${() => ut(this.hass, t)}
          >
            ${G(e, this._wide ? 28 : 24)}
            ${i.length && e ? d`<span class="badge">${i.filter((c) => v(this.hass.states[c])).length}</span>` : g}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${gt(this.hass, t.entity_id) ? ` · ${gt(this.hass, t.entity_id)}` : ""}</span>
          </div>
          <button class="round close" aria-label=${l(this.hass, "close")} @click=${() => this.close()}>
            ${Ut(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? d`<div class="cols">
              <div class="left">${a.main}</div>
              <div class="right">${a.side}${n}${i.length ? g : o}</div>
            </div>` : d`<div class="stack">
              <div class="main-row">${a.main}${a.beside ?? g}</div>
              ${a.side}${n}${i.length ? g : o}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = Mt(t), s = v(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? l(this.hass, "turn_off") : l(this.hass, "turn_on")}
            @click=${() => ut(this.hass, t)}>
            <span>${Ys(36)}</span>
          </button>`,
        side: g
      };
    const r = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${U(t) ?? 0}
      .label=${l(this.hass, "brightness")}
      @value-changed=${(p) => ee(this.hass, i, p.detail.value)}
    >${Xe(28)}</terral-slider>`, a = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (p) => d`<button class="chip" @click=${() => ee(this.hass, i, p)}>${p} %</button>`
    )}
    </div>`, n = d`<div class="chips">
      ${te.map(
      (p) => d`<button class="chip tinted" style="background:${p.css}" @click=${() => Pt(this.hass, t, p.kelvin)}>
          ${l(this.hass, p.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: r, side: a };
    if (e === "temperature") {
      const p = t.attributes.min_color_temp_kelvin ?? 2e3, f = t.attributes.max_color_temp_kelvin ?? 6500, m = d`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${p}
        .max=${f}
        .value=${xt(t) ?? Math.round((p + f) / 2)}
        .label=${l(this.hass, "temperature")}
        @value-changed=${(b) => Pt(this.hass, t, b.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${r}${m}</div>`, side: n } : { main: d`<div class="pair">${r}${m}</div>`, side: n };
    }
    const o = Q(this.hass), c = (this.opts.favorites?.length ? this.opts.favorites : pe.map((p) => ({ name: p.name[o], rgb: p.rgb }))).slice(0, 6), h = J(t), u = d`
      <p class="lb">${l(this.hass, "favorites")}</p>
      <div class="swatches">
        ${c.map(
      (p) => d`<button
            class="sw ${h && P(h) === P(p.rgb) ? "sel" : ""}"
            style="background:${P(p.rgb)}"
            aria-label=${p.name ?? P(p.rgb)}
            @click=${() => Oe(this.hass, i, p.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${l(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${h ? P(h) : "#ffffff"} @change=${(p) => Oe(this.hass, i, hi(p.target.value))} />
      ${li(t) ? d`<p class="lb">${l(this.hass, "temperature")}</p>${n}` : g}
    `;
    return this._wide ? { main: r, side: u } : { main: r, side: g, beside: d`<div class="beside">${u}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const c of e) {
      const h = gt(this.hass, c) ?? l(this.hass, "other_area");
      i.set(h, [...i.get(h) ?? [], c]);
    }
    const r = s === "always" || s === "auto" && e.length > 8 && i.size > 1, a = e.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => Ft(this.hass, t.entity_id, !0)}>${l(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => Ft(this.hass, t.entity_id, !1)}>${l(this.hass, "all_off")}</button>
        </div>` : g, n = (c) => {
      const h = this.hass.states[c], u = v(h), p = h ? this.hass.formatEntityName?.(h) ?? h.attributes.friendly_name ?? c : c;
      return d`<div class="mr">
        <button class="mi ${u ? "on" : ""}" ?disabled=${q(h)}
          aria-label="${u ? l(this.hass, "turn_off") : l(this.hass, "turn_on")} ${p}"
          @click=${() => h && ut(this.hass, h)}>${G(u, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, c]}>
          <span>${p}</span><small>${h ? this._stateText(h) : l(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, o = (c) => [...c].sort((h, u) => Number(v(this.hass.states[u])) - Number(v(this.hass.states[h])));
    return d`
      ${a}
      <p class="lb">${l(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${r ? [...i.entries()].map(([c, h]) => {
      const u = this._openAreas.has(c), p = h.filter((f) => v(this.hass.states[f])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${p ? "on" : ""}" aria-label="${p ? l(this.hass, "turn_off") : l(this.hass, "turn_on")} ${c}"
                    @click=${() => Ft(this.hass, h, p === 0)}>${G(p > 0, 18)}</button>
                  <button class="mt" aria-expanded=${u} @click=${() => {
        const f = new Set(this._openAreas);
        u ? f.delete(c) : f.add(c), this._openAreas = f;
      }}>
                    <span>${c} <small>${p} ${l(this.hass, "of")} ${h.length}</small></span>${Te(u)}
                  </button>
                </div>
                ${u ? d`<div class="inner">${h.map(n)}</div>` : g}
              </div>`;
    }) : d`<div class="box">${o(e).map(n)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return d`<div class="info">
      <div><span>${l(this.hass, "last_activity")}</span><span>${Ge(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
z.styles = S`
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
L([
  _({ attribute: !1 })
], z.prototype, "hass", 2);
L([
  _({ attribute: !1 })
], z.prototype, "opts", 2);
L([
  x()
], z.prototype, "_stack", 2);
L([
  x()
], z.prototype, "_expanded", 2);
L([
  x()
], z.prototype, "_closing", 2);
L([
  x()
], z.prototype, "_wide", 2);
L([
  x()
], z.prototype, "_openAreas", 2);
L([
  Us("input[type=color]")
], z.prototype, "_picker", 2);
z = L([
  T("terral-light-dialog")
], z);
var mi = Object.defineProperty, _i = Object.getOwnPropertyDescriptor, j = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? _i(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && mi(e, s, r), r;
};
const bi = "terral-home-light";
let V = class extends M {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      gi(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !q(e) && ut(this.hass, e);
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
    return t ? Mt(t) === "temperature" || Mt(t) === "color" || O(t).length > 0 ? e : e.slice(0, 3) : e;
  }
  static getStubConfig(t, e = [], s = []) {
    return { entity: [...e, ...s].find((r) => r.startsWith("light.")) ?? Object.keys(t?.states ?? {}).find((r) => r.startsWith("light.")) ?? "light.example" };
  }
  static getConfigForm() {
    const t = (e) => l(void 0, e);
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...O(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && fi(this.hass);
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
    if (q(t)) return l(s, "unavailable");
    const i = O(t);
    if (i.length) {
      const o = i.filter((u) => v(s.states[u])).length;
      if (!o) return `${i.length} ${l(s, "lights_off")}`;
      const c = U(t), h = o === i.length && e === "onoff" ? `${l(s, "all_lit")} (${o})` : `${o} ${l(s, "of")} ${i.length} ${l(s, "lit")}`;
      return c != null && this._size !== "s11" ? `${h} · ${c} %` : h;
    }
    if (!v(t)) return l(s, "off");
    const r = [], a = U(t);
    a != null && r.push(`${a} %`);
    const n = J(t);
    if (n) {
      const o = se(n, Q(s));
      o && r.push(o);
    } else if (e === "temperature" || e === "color") {
      const o = xt(t);
      if (o && t.attributes.color_mode === "color_temp") {
        const c = [...te].sort((h, u) => Math.abs(h.kelvin - o) - Math.abs(u.kelvin - o))[0];
        r.push(l(s, c.key));
      }
    }
    return r.join(" · ") || l(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${l(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = Mt(t), s = v(t), i = q(t), r = O(t), a = rs(t, this._config.use_light_color !== !1), n = s ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};--fill:${a.fill}` : "";
    let o = this._size;
    o === "s42" && !this.getTerralSizes().some((u) => u.h === 4) && (o = "s22");
    const c = d`<button
      class="icon"
      aria-label="${s ? l(this.hass, "turn_off") : l(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${G(s, o === "s11" ? 20 : 32)}
      ${r.length && s ? d`<span class="badge">${r.filter((u) => v(this.hass.states[u])).length}</span>` : g}
    </button>`, h = d`<div class="text">
      <span class="name">${this._name(t)}</span>
      <span class="state">${this._status(t, e)}</span>
    </div>`;
    return d`<div
      class="card ${o} ${s ? "on" : "off"} ${i ? "unavailable" : ""}"
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
      ${o === "s11" || o === "s21" ? d`${c}${h}` : d`<div class="head">${c}${h}${this._quickButton(t, e, o)}</div>
            ${this._body(t, e, o)}`}
    </div>`;
  }
  /** Top-right button on 2/2 and 4/2 for colour or temperature. */
  _quickButton(t, e, s) {
    if (e !== "color" && e !== "temperature" || s === "s42" && !O(t).length) return g;
    const i = J(t), r = i ? se(i, Q(this.hass)) ?? "" : "", a = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? P(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(n) => {
      n.stopPropagation(), this._openWindow();
    }}><i style=${a}></i>${r || (e === "color" ? l(this.hass, "more_colors") : l(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return d`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${U(t) ?? 0}
      .label=${l(this.hass, "brightness")}
      @value-changed=${(s) => ee(this.hass, t.entity_id, s.detail.value)}
    >${Xe(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = O(t);
    if (s === "s42" && i.length) {
      const a = [...i].sort((h, u) => Number(v(this.hass.states[u])) - Number(v(this.hass.states[h]))), n = e === "onoff" ? 5 : 4, o = a.length > n ? a.slice(0, n - 1) : a, c = a.length - o.length;
      return d`
        ${e !== "onoff" ? this._brightness(t) : g}
        <div class="members">
          ${o.map((h) => {
        const u = this.hass.states[h], p = v(u), f = u ? this.hass.formatEntityName?.(u) ?? u.attributes.friendly_name ?? h : h;
        return d`<div class="mr">
              <button class="mi ${p ? "lit" : ""}" ?disabled=${q(u)} aria-label="${p ? l(this.hass, "turn_off") : l(this.hass, "turn_on")} ${f}"
                @click=${(m) => {
          m.stopPropagation(), u && ut(this.hass, u);
        }}>${G(p, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${f}</span><small>${u ? v(u) ? U(u) != null ? `${U(u)} %` : l(this.hass, "on") : l(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${c > 0 ? d`<button class="morebtn" @click=${this._openWindow}>+ ${c} ${l(this.hass, "more")}</button>` : g}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? d`<div class="tags">
          ${i.slice(0, 4).map((a) => {
        const n = this.hass.states[a], o = n ? this.hass.formatEntityName?.(n) ?? n.attributes.friendly_name ?? a : a;
        return d`<span class="tag"><i class=${v(n) ? "lit" : ""}></i>${o}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${v(t) ? l(this.hass, "on") : l(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const a = t.attributes.min_color_temp_kelvin ?? 2e3, n = t.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${l(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${l(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${a} .max=${n} .value=${xt(t) ?? 3500}
          .label=${l(this.hass, "temperature")}
          @value-changed=${(o) => Pt(this.hass, t, o.detail.value)}></terral-slider>
        <div class="chips">
          ${te.map((o) => d`<button class="chip" style="background:${o.css}" @click=${(c) => {
        c.stopPropagation(), Pt(this.hass, t, o.kelvin);
      }}>${l(this.hass, o.key)}</button>`)}
        </div>
      `;
    }
    const r = this._config?.favorite_colors?.map((a) => Array.isArray(a) ? a : a.rgb) ?? void 0;
    return d`
      <p class="lbl">${l(this.hass, "brightness")}</p>
      ${this._brightness(t, !0)}
      <p class="lbl">${l(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${t} .colors=${r}></terral-light-favs>
      <button class="pb wide" @click=${(a) => {
      a.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${l(this.hass, "more_colors")}</button>
    `;
  }
};
V.styles = S`
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
j([
  _({ attribute: !1 })
], V.prototype, "hass", 2);
j([
  _({ type: Boolean })
], V.prototype, "preview", 2);
j([
  x()
], V.prototype, "_config", 2);
j([
  x()
], V.prototype, "_size", 2);
V = j([
  T(bi)
], V);
let tt = class extends M {
  render() {
    if (!this.hass || !this.entity) return g;
    const t = Q(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: P(i) })) : xi[t] ??= yi(t), s = J(this.entity);
    return e.slice(0, 6).map(
      (i) => d`<button
        class=${s && P(s) === P(i.rgb) ? "sel" : ""}
        style="background:${P(i.rgb)}"
        aria-label=${i.name}
        @click=${(r) => {
        r.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
tt.styles = S`
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
j([
  _({ attribute: !1 })
], tt.prototype, "hass", 2);
j([
  _({ attribute: !1 })
], tt.prototype, "entity", 2);
j([
  _({ attribute: !1 })
], tt.prototype, "colors", 2);
tt = j([
  T("terral-light-favs")
], tt);
const xi = {}, yi = (t) => pe.map((e) => ({ rgb: e.rgb, name: e.name[t] })), vi = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, ns = ["away", "home", "night", "vacation", "custom"], $i = ["away", "home", "vacation"], ie = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function F(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const Kt = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : ns.includes(e) ? e : void 0;
};
function ue(t) {
  return Kt(t.state) ?? Kt(t.attributes.arm_mode) ?? Kt(t.attributes.next_state);
}
function os(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? ns.filter((s) => e & vi[s]) : ["away", "home"];
}
function Dt(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function wi(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const ge = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, ki = (t) => ge(t) != null && t.attributes.code_arm_required !== !1;
function Ot(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function Ai(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const re = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function Ci(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function Si(t, e, s, i, r = !1) {
  if (Ci(t, e)) {
    const n = { entity_id: e.entity_id, mode: s };
    return i && (n.code = i), r && (n.force = !0), t.callService("alarmo", "arm", n);
  }
  const a = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", a, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function Ei(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function Mi(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function ls(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), r = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(r, 150);
    };
    r();
  });
}
function zi(t, e, s, i, r, a = {}) {
  const n = async (h) => {
    const u = t(), p = u?.states[e];
    if (!u || !p) return { result: "wrong" };
    try {
      await Si(u, p, s, h, a.force);
    } catch {
      return { result: "wrong", code: h };
    }
    const f = () => t()?.states[e];
    if (await ls(() => {
      const w = f();
      return !!w && F(w) !== "disarmed";
    })) return { result: "armed", code: h };
    const b = f();
    return { result: b && Ot(b).length ? "refused" : "wrong", code: h };
  }, o = t()?.states[e];
  if (!o) return;
  const c = ge(o);
  if (a.code != null || !c || !ki(o)) {
    n(a.code).then(r);
    return;
  }
  i(c, async (h) => {
    const u = await n(h);
    return u.result === "wrong" ? !1 : (r(u), !0);
  });
}
function Ti(t, e, s) {
  const i = async (n) => {
    const o = t(), c = o?.states[e];
    if (!o || !c) return !1;
    try {
      await Ei(o, c, n);
    } catch {
      return !1;
    }
    return ls(() => {
      const h = t()?.states[e];
      return !!h && F(h) === "disarmed";
    });
  }, r = t()?.states[e];
  if (!r) return;
  const a = ge(r);
  if (!a) {
    i();
    return;
  }
  s(a, i);
}
const Gt = (t, e, s) => t.map((i, r) => Math.round(i + (e[r] - i) * s)), kt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function Pi(t) {
  const e = ie[t];
  return {
    bg: kt(Gt(e, [255, 255, 255], 0.84), 0.95),
    fg: kt(Gt(e, [10, 10, 20], 0.82)),
    fg2: kt(Gt(e, [20, 10, 30], 0.72)),
    accent: kt(e)
  };
}
const je = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var Di = Object.defineProperty, fe = (t, e, s, i) => {
  for (var r = void 0, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = n(e, s, r) || r);
  return r && Di(e, s, r), r;
};
const be = class be extends M {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = as(this);
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
          <button class="close" aria-label=${l(this.hass, "close")} @click=${() => this.close()}>${Ut(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
be.styles = S`
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
let A = be;
fe([
  _({ attribute: !1 })
], A.prototype, "hass");
fe([
  x()
], A.prototype, "_wide");
fe([
  x()
], A.prototype, "_closing");
var Oi = Object.defineProperty, Li = Object.getOwnPropertyDescriptor, ot = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Li(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && Oi(e, s, r), r;
};
let I = class extends A {
  constructor() {
    super(...arguments), this.format = "number", this._code = "", this._error = !1, this._busy = !1, this._onKeyboard = (t) => {
      this.format !== "number" || this._busy || (/^[0-9]$/.test(t.key) ? this._press(t.key) : t.key === "Backspace" ? this._erase() : t.key === "Enter" && this._send());
    };
  }
  get heading() {
    return l(this.hass, "code_title");
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
          placeholder=${l(this.hass, "code_placeholder")}
          .value=${this._code}
          @input=${(e) => {
        this._error = !1, this._code = e.target.value;
      }}
        />
        <p class="err" aria-live="polite">${this._error ? l(this.hass, "code_wrong") : g}</p>
        <button class="okbtn" ?disabled=${!this._code || this._busy}>${l(this.hass, "ok")}</button>
      </form>`;
    const t = Math.max(4, this._code.length);
    return d`
      <div class="dots ${this._error ? "shake" : ""} ${this._busy ? "busy" : ""}" aria-label="${this._code.length}">
        ${Array.from({ length: t }, (e, s) => d`<i class=${s < this._code.length ? "f" : ""}></i>`)}
      </div>
      <p class="err" aria-live="polite">${this._error ? l(this.hass, "code_wrong") : g}</p>
      <div class="pad">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((e) => d`<button class="key" @click=${() => this._press(e)}>${e}</button>`)}
        <button class="key fn" aria-label=${l(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${ri(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${l(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${Qe(26)}</button>
      </div>
    `;
  }
};
I.styles = [
  A.styles,
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
ot([
  _()
], I.prototype, "format", 2);
ot([
  _({ attribute: !1 })
], I.prototype, "submit", 2);
ot([
  x()
], I.prototype, "_code", 2);
ot([
  x()
], I.prototype, "_error", 2);
ot([
  x()
], I.prototype, "_busy", 2);
I = ot([
  T("terral-code-sheet")
], I);
function cs(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const yt = /* @__PURE__ */ new Map(), ji = 6e4, vt = "terral-alarm-refusal", ds = () => window.dispatchEvent(new Event(vt));
function Lt(t) {
  const e = yt.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > ji || F(t) !== "disarmed") {
      yt.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function me(t) {
  yt.delete(t) && ds();
}
function jt(t, e, s, i = !1) {
  const r = t();
  if (!r) return;
  const a = yt.get(e), n = i ? { force: !0, code: a?.code } : {};
  me(e), zi(
    t,
    e,
    s,
    (o, c) => cs(r, o, c),
    (o) => {
      o.result === "refused" && (yt.set(e, { mode: s, code: o.code, at: Date.now() }), ds());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    n
  );
}
function ft(t, e) {
  const s = t();
  s && Ti(t, e, (i, r) => cs(s, i, r));
}
const Hi = (t) => t.charAt(0).toLowerCase() + t.slice(1), Ht = (t, e) => l(t, `mode_${e}`);
function hs(t, e, s) {
  const i = F(e), r = ue(e), a = r ? Hi(Ht(t, r)) : "";
  if (Lt(e)) {
    const o = Ot(e);
    return {
      title: l(t, "alarm_failed"),
      status: o.length > 1 ? l(t, "alarm_open_n", { n: o.length }) : l(t, "alarm_open", { name: o[0] ? re(t, o[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: l(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${l(t, "alarm_arming", { mode: a })} · ${l(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${l(t, "alarm_armed", { mode: a })} · ${l(t, "alarm_since", { t: je(t, e.last_changed) })}` };
    case "pending":
      return { title: l(t, "alarm_pending"), status: l(t, "alarm_pending_sub") };
    case "triggered": {
      const o = Ot(e), c = o.length ? re(t, o[0]) + (o.length > 1 ? ` +${o.length - 1}` : "") : s;
      return { title: l(t, "alarm_triggered"), status: `${c} · ${je(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: l(t, "unavailable") };
  }
}
const ps = (t) => {
  const e = Dt(t);
  return e == null ? null : Math.ceil(e);
};
var Ii = Object.defineProperty, Ri = Object.getOwnPropertyDescriptor, Bt = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ri(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && Ii(e, s, r), r;
};
const us = (t, e = 20) => ({ away: Zs, home: ti, night: ei, vacation: si, custom: ii })[t](e);
let et = class extends A {
  constructor() {
    super(...arguments), this.entityId = "", this.name = "", this._tick = 0, this._refresh = () => this.requestUpdate(), this._getHass = () => this.hass;
  }
  get heading() {
    return this.name;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(vt, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && Dt(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(vt, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? d`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => d`<div class="row static"><span class="ic">${Jt(18)}</span><span class="nm">${re(this.hass, s)}</span></div>`)}</div>
    </section>` : g;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return d`<p>${l(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = F(e), r = ue(e), a = Lt(e), n = ps(e), { title: o, status: c } = hs(t, e, this.name), h = i === "armed" && r ? `rgb(${ie[r].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", u = a || i === "pending" || i === "triggered" ? Jt(30) : i === "armed" ? Ze(32) : he(32), p = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let f = g;
    a ? f = d`<div class="btns">
        <button class="big solid" @click=${() => jt(this._getHass, s, a.mode, !0)}>${ts()}<span>${l(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => me(s)}><span>${l(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? f = d`<section>
        <h3>${l(t, "arm_options")}</h3>
        <div class="list">
          ${os(e).map(
      (b) => d`<button class="row" @click=${() => jt(this._getHass, s, b)}>
              <span class="ic" style="color:rgb(${ie[b].join(",")})">${us(b)}</span><span class="nm">${Ht(t, b)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? f = d`<div class="btns">
        <button class="big" @click=${() => ft(this._getHass, s)}>${Ut(20)}<span>${l(t, "cancel")}</span></button>
        ${p ? d`<button class="big" @click=${() => Mi(t, e)}>${ai()}<span>${l(t, "skip_delay")}</span></button>` : g}
      </div>` : i !== "unavailable" && (f = d`<div class="btns"><button class="big solid" @click=${() => ft(this._getHass, s)}>${Zt()}<span>${l(t, "disarm")}</span></button></div>`);
    const m = e.attributes.changed_by;
    return d`
      <div class="status st-${a ? "failed" : i}" style="--ac:${h}">
        <span class="sic">${u}</span>
        <div class="txt"><strong>${o}</strong><span>${c}</span></div>
        ${n != null ? d`<span class="secs">${n}</span>` : g}
      </div>
      <div class="scroll">
        ${f}
        ${this._sensorList(l(t, "open_sensors"), Ot(e))}
        ${i === "armed" ? this._sensorList(l(t, "bypassed_sensors"), Ai(e)) : g}
        <p class="foot">${l(t, "changed_by")}: ${m ? `${m} · ` : ""}${Ge(t, e.last_changed)}</p>
      </div>
    `;
  }
};
et.styles = [
  A.styles,
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
Bt([
  _()
], et.prototype, "entityId", 2);
Bt([
  _()
], et.prototype, "name", 2);
Bt([
  x()
], et.prototype, "_tick", 2);
et = Bt([
  T("terral-alarm-dialog")
], et);
function Ni(t, e, s) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const i = document.createElement("terral-alarm-dialog");
  return i.hass = t, i.entityId = e, i.name = s, document.body.appendChild(i), i;
}
function Ui(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var Bi = Object.defineProperty, qi = Object.getOwnPropertyDescriptor, qt = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? qi(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && Bi(e, s, r), r;
};
const Wi = "terral-home-alarm";
let st = class extends M {
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
      computeLabel: (t) => l(void 0, t.name === "entity" ? "alarm_entity" : "name")
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(vt, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(vt, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
  }
  get _entity() {
    return this._config ? this.hass?.states[this._config.entity] : void 0;
  }
  get _name() {
    return this._config?.name || l(this.hass, "alarm");
  }
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || e.states[this._config.entity] !== this._entity;
  }
  updated(t) {
    t.has("hass") && this.hass && Ui(this.hass);
    const e = this._entity, s = !!e && Dt(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && Ni(this.hass, this._config.entity, this._name);
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = F(t), i = Lt(t);
    if (i)
      return d`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => jt(this._getHass, e, i.mode, !0))}>${ts()}<span>${l(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => me(e))}><span>${l(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const r = os(t).filter((a) => $i.includes(a));
        return d`<div class="row ${r.length > 2 ? "three" : ""}">
          ${r.map(
          (a) => d`<button class="pb" aria-label=${l(this.hass, "arm_mode", { mode: Ht(this.hass, a) })} @click=${this._act(() => jt(this._getHass, e, a))}>
              ${us(a)}<span>${Ht(this.hass, a)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return d`<div class="row"><button class="pb" @click=${this._act(() => ft(this._getHass, e))}>${Ut(20)}<span>${l(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return d`<div class="row"><button class="pb" @click=${this._act(() => ft(this._getHass, e))}>${Zt()}<span>${l(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return d`<div class="row"><button class="pb solid" @click=${this._act(() => ft(this._getHass, e))}>${Zt()}<span>${l(this.hass, "disarm")}</span></button></div>`;
      default:
        return g;
    }
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${l(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const e = F(t), s = !!Lt(t), i = ue(t), r = e === "armed" && !!i, a = r ? Pi(i) : void 0, n = ps(t), o = wi(t), c = Dt(t), h = c != null && o ? c / o : 0, u = `${a ? `--bg:${a.bg};--fg:${a.fg};--fg2:${a.fg2};--accent:${a.accent};` : ""}--p:${h}`, p = s || e === "pending" || e === "triggered" ? Jt(28) : r ? Ze(30) : he(30), { title: f, status: m } = hs(this.hass, t, this._name);
    return d`<div
      class="card ${r ? "on" : "off"} st-${s ? "failed" : e}"
      style=${u}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${f}, ${m}`}
      @click=${this._cardClick}
      @keydown=${(w) => {
      (w.key === "Enter" || w.key === " ") && w.target === w.currentTarget && (w.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(w) => w.preventDefault()}
    >
      <div class="head">
        <span class="icon">${p}</span>
        <div class="text"><span class="name">${f}</span><span class="state">${m}</span></div>
        ${n != null ? d`<span class="secs">${n}</span>` : g}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
st.styles = S`
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
qt([
  _({ attribute: !1 })
], st.prototype, "hass", 2);
qt([
  x()
], st.prototype, "_config", 2);
qt([
  x()
], st.prototype, "_tick", 2);
st = qt([
  T(Wi)
], st);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yi = { CHILD: 2 }, Vi = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Fi = class {
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
const { I: Ki } = Os, He = (t) => t, Ie = () => document.createComment(""), ht = (t, e, s) => {
  const i = t._$AA.parentNode, r = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const a = i.insertBefore(Ie(), r), n = i.insertBefore(Ie(), r);
    s = new Ki(a, n, t, t.options);
  } else {
    const a = s._$AB.nextSibling, n = s._$AM, o = n !== t;
    if (o) {
      let c;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (c = t._$AU) !== n._$AU && s._$AP(c);
    }
    if (a !== r || o) {
      let c = s._$AA;
      for (; c !== a; ) {
        const h = He(c).nextSibling;
        He(i).insertBefore(c, r), c = h;
      }
    }
  }
  return s;
}, N = (t, e, s = t) => (t._$AI(e, s), t), Gi = {}, Xi = (t, e = Gi) => t._$AH = e, Qi = (t) => t._$AH, Xt = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let r = e; r <= s; r++) i.set(t[r], r);
  return i;
}, Ne = Vi(class extends Fi {
  constructor(t) {
    if (super(t), t.type !== Yi.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const r = [], a = [];
    let n = 0;
    for (const o of t) r[n] = i ? i(o, n) : n, a[n] = s(o, n), n++;
    return { values: a, keys: r };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const r = Qi(t), { values: a, keys: n } = this.dt(e, s, i);
    if (!Array.isArray(r)) return this.ut = n, a;
    const o = this.ut ??= [], c = [];
    let h, u, p = 0, f = r.length - 1, m = 0, b = a.length - 1;
    for (; p <= f && m <= b; ) if (r[p] === null) p++;
    else if (r[f] === null) f--;
    else if (o[p] === n[m]) c[m] = N(r[p], a[m]), p++, m++;
    else if (o[f] === n[b]) c[b] = N(r[f], a[b]), f--, b--;
    else if (o[p] === n[b]) c[b] = N(r[p], a[b]), ht(t, c[b + 1], r[p]), p++, b--;
    else if (o[f] === n[m]) c[m] = N(r[f], a[m]), ht(t, r[p], r[f]), f--, m++;
    else if (h === void 0 && (h = Re(n, m, b), u = Re(o, p, f)), h.has(o[p])) if (h.has(o[f])) {
      const w = u.get(n[m]), Yt = w !== void 0 ? r[w] : null;
      if (Yt === null) {
        const xe = ht(t, r[p]);
        N(xe, a[m]), c[m] = xe;
      } else c[m] = N(Yt, a[m]), ht(t, r[p], Yt), r[w] = null;
      m++;
    } else Xt(r[f]), f--;
    else Xt(r[p]), p++;
    for (; m <= b; ) {
      const w = ht(t, c[b + 1]);
      N(w, a[m]), c[m++] = w;
    }
    for (; p <= f; ) {
      const w = r[p++];
      w !== null && Xt(w);
    }
    return this.ut = n, Xi(t, c), Y;
  }
});
function Ji(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const Zi = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function tr(t) {
  return Zi[t];
}
var er = Object.defineProperty, sr = Object.getOwnPropertyDescriptor, Wt = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? sr(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && er(e, s, r), r;
};
let it = class extends A {
  constructor() {
    super(...arguments), this.existing = /* @__PURE__ */ new Set(), this._q = "";
  }
  get heading() {
    return l(this.hass, "add_accessory");
  }
  _rows() {
    const t = this.hass, e = [];
    for (const [i, r] of Object.entries(t.states)) {
      const a = i.startsWith("alarm_control_panel.");
      if (!a && !i.startsWith("light.")) continue;
      const n = t.entities?.[i];
      n?.hidden || n?.entity_category || e.push({
        id: i,
        name: t.formatEntityName?.(r) || r.attributes.friendly_name || i,
        area: gt(t, i) ?? l(t, "other_area"),
        group: !a && is(r),
        on: !a && v(r),
        alarm: a
      });
    }
    const s = this._q.trim().toLowerCase();
    return e.filter((i) => !s || i.name.toLowerCase().includes(s) || i.area.toLowerCase().includes(s)).sort((i, r) => Number(r.group) - Number(i.group) || i.area.localeCompare(r.area) || i.name.localeCompare(r.name));
  }
  renderContent() {
    const t = this._rows(), e = t.filter((r) => r.alarm), s = t.filter((r) => r.group), i = /* @__PURE__ */ new Map();
    for (const r of t.filter((a) => !a.group && !a.alarm))
      i.has(r.area) || i.set(r.area, []), i.get(r.area).push(r);
    return d`
      <label class="search">
        ${Gs()}
        <input
          type="search"
          placeholder=${l(this.hass, "search_lights")}
          .value=${this._q}
          @input=${(r) => this._q = r.target.value}
        />
      </label>
      <div class="scroll">
        ${t.length ? g : d`<p class="empty">${l(this.hass, "no_lights")}</p>`}
        ${e.length ? this._section(l(this.hass, "security"), e) : g}
        ${s.length ? this._section(l(this.hass, "light_groups"), s) : g}
        ${[...i].map(([r, a]) => this._section(r, a))}
      </div>
    `;
  }
  _section(t, e) {
    return d`<section>
      <h3>${t}</h3>
      <div class="list">
        ${e.map((s) => {
      const i = this.existing.has(s.id);
      return d`<button class="row" ?disabled=${i} @click=${() => this._pick(s.id)}>
            <span class="ic ${s.on ? "on" : ""}">${s.alarm ? he(20) : G(s.on, 20)}</span>
            <span class="nm">${s.name}${s.group ? d`<small>${l(this.hass, "group")}</small>` : g}</span>
            ${i ? d`<span class="added">${Qe(16)} ${l(this.hass, "added")}</span>` : g}
          </button>`;
    })}
      </div>
    </section>`;
  }
  _pick(t) {
    this.onPick?.(t), this.close();
  }
};
it.styles = [
  A.styles,
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
      .empty {
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        margin: 30px 0;
      }
    `
];
Wt([
  _({ attribute: !1 })
], it.prototype, "existing", 2);
Wt([
  _({ attribute: !1 })
], it.prototype, "onPick", 2);
Wt([
  x()
], it.prototype, "_q", 2);
it = Wt([
  T("terral-add-sheet")
], it);
function ir(t, e, s) {
  const i = document.createElement("terral-add-sheet");
  return i.hass = t, i.existing = e, i.onPick = s, document.body.appendChild(i), i;
}
var rr = Object.defineProperty, ar = Object.getOwnPropertyDescriptor, gs = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ar(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && rr(e, s, r), r;
};
let It = class extends A {
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
      <button class="cancel" @click=${() => this.close()}>${l(this.hass, "cancel")}</button>
    `;
  }
};
It.styles = [
  A.styles,
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
gs([
  _({ attribute: !1 })
], It.prototype, "options", 2);
It = gs([
  T("terral-confirm-sheet")
], It);
function Ue(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
var nr = Object.defineProperty, or = Object.getOwnPropertyDescriptor, _e = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? or(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && nr(e, s, r), r;
};
let $t = class extends A {
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
          <span class="ic">${Fs()}</span><span class="nm">${l(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${Js()}</span>
          <span class="nm">${l(this.hass, "by_rooms")}<small>${l(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" disabled>
          <span class="ic">${Xs()}</span>
          <span class="nm">${l(this.hass, "terral_settings")}<small>${l(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
$t.styles = [
  A.styles,
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
_e([
  _({ attribute: !1 })
], $t.prototype, "actions", 2);
_e([
  _()
], $t.prototype, "version", 2);
$t = _e([
  T("terral-menu-sheet")
], $t);
function lr(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const fs = "0.5.3";
var cr = Object.defineProperty, dr = Object.getOwnPropertyDescriptor, k = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? dr(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && cr(e, s, r), r;
};
const At = "top", Be = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], hr = 0.85, rt = "#3a4f80", Ct = "58,79,128", pr = `linear-gradient(180deg, ${rt} 0, rgba(${Ct},.6) 36px, rgba(${Ct},0) 120px), linear-gradient(0deg, ${rt} 0, rgba(${Ct},.6) 28px, rgba(${Ct},0) 96px), `, Qt = rt, ur = rt, St = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let $ = class extends M {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || ir(this.hass, new Set(this._allCards.map((t) => t.entity)), (t) => {
        const e = this.hass?.states[t], s = t.startsWith("alarm_control_panel.") ? { id: St(), type: "alarm", entity: t, w: 2, h: 2 } : { id: St(), type: "light", entity: t, w: e && is(e) ? 2 : 1, h: 2 };
        this._update((i) => i.cards.push(s));
      });
    }, this._menu = () => {
      this.hass && lr(this.hass, this.panel?.config?.version ?? fs, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms()
      });
    }, this._addSection = () => {
      const t = St();
      this._update((e) => e.sections.push({ id: t, title: l(this.hass, "new_section"), cards: [] })), this._renaming = t;
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
    const e = document.querySelector('meta[name="theme-color"]'), s = document.documentElement, i = document.body, r = [
      [s, "background", rt],
      [i, "background", rt],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", Qt],
      [i, "--app-theme-color", Qt],
      [i, "--primary-background-color", ur]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: r.map(([a, n]) => [a, n, a.style.getPropertyValue(n), a.style.getPropertyPriority(n)])
      };
      for (const [a, n, o] of r) a.style.setProperty(n, o);
      e && (e.content = Qt), this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [a, n, o, c] of this._chromeSaved.props)
        o ? a.style.setProperty(n, o, c) : a.style.removeProperty(n);
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
    return e === At ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: At, card: e };
    for (const s of this._sections) {
      const i = s.cards.find((r) => r.id === t);
      if (i) return { key: s.id, card: i };
    }
  }
  // ---- Layout -------------------------------------------------------------
  _measure(t) {
    const e = t < 600 ? 16 : 24, s = t < 600 ? 10 : 14, i = Math.min(t, 1180) - 2 * e, r = t < 600 ? 2 : 4, a = (i - s * (r - 1)) / r, n = window.__terralRowRatio ?? hr, o = Math.max(48, Math.round((a - s) / 2 * n));
    this._colW = a, this._gap = s, r !== this._cols && (this._cols = r), o !== this._rowH && (this._rowH = o);
  }
  _sizeOf(t) {
    const e = t.h === 1 || t.h === 4 ? t.h : 2, s = e === 4 || t.w === 2 ? 2 : 1;
    return { w: Math.min(s, this._cols), h: e };
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t) {
    return (this._els.get(t.id)?.getTerralSizes?.() ?? Be).filter((s) => s.w <= this._cols).length > 1;
  }
  _element(t) {
    let e = this._els.get(t.id);
    e || (e = document.createElement(t.type === "alarm" ? "terral-home-alarm" : "terral-home-light"), this._els.set(t.id, e));
    const { id: s, type: i, w: r, h: a, ...n } = t, o = { ...n, type: t.type === "alarm" ? "custom:terral-home-alarm" : "custom:terral-home-light", view_layout: { terral: { w: r, h: a } } }, c = JSON.stringify(o);
    if (e.dataset.cfg !== c) {
      try {
        e.setConfig(o);
      } catch (h) {
        console.warn("Terral Home:", h);
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
    const s = e.trim(), i = this._sections.find((r) => r.id === t);
    !i || !s || s === i.title || this._update((r) => {
      const a = r.sections.find((n) => n.id === t);
      a && (a.title = s);
    });
  }
  _removeSection(t) {
    const e = this._sections.findIndex((r) => r.id === t), s = this._sections[e];
    if (!s || !this.hass) return;
    const i = (r) => this._update((a) => {
      const n = a.sections.findIndex((c) => c.id === t);
      if (n < 0) return;
      const [o] = a.sections.splice(n, 1);
      r ? (n > 0 ? a.sections[n - 1].cards : a.cards).push(...o.cards) : o.cards.forEach((c) => this._els.delete(c.id));
    });
    if (!s.cards.length) return i(!1);
    Ue(this.hass, {
      heading: l(this.hass, "delete_section_q", { name: s.title }),
      message: l(this.hass, "delete_section_msg", { n: s.cards.length }),
      actions: [
        { label: l(this.hass, "keep_cards"), sub: l(this.hass, e > 0 ? "keep_cards_sub" : "keep_cards_sub_top"), run: () => i(!0) },
        { label: l(this.hass, "remove_cards"), danger: !0, run: () => i(!1) }
      ]
    });
  }
  /** One section per HA area; each card with an area moves into it. */
  _confirmRooms() {
    this.hass && Ue(this.hass, {
      heading: l(this.hass, "by_rooms"),
      message: l(this.hass, "by_rooms_msg"),
      actions: [{ label: l(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }]
    });
  }
  _sectionsFromRooms() {
    const t = this.hass;
    t && (this._update((e) => {
      const s = new Map(e.sections.map((n) => [n.title.toLowerCase(), n])), i = [e.cards, ...e.sections.map((n) => n.cards)], r = [];
      for (const n of i)
        for (const o of [...n]) {
          const c = gt(t, o.entity);
          c && (r.push([o, c]), n.splice(n.indexOf(o), 1));
        }
      const a = [...new Set(r.map(([, n]) => n))].filter((n) => !s.has(n.toLowerCase())).sort((n, o) => n.localeCompare(o));
      for (const n of a) {
        const o = { id: St(), title: n, cards: [] };
        e.sections.push(o), s.set(n.toLowerCase(), o);
      }
      for (const [n, o] of r) s.get(o.toLowerCase()).cards.push(n);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), r = (this._els.get(e.id)?.getTerralSizes?.() ?? Be).filter((n) => n.w <= this._cols);
    this._resizeOrigin = { left: i.left, top: i.top, sizes: r };
    const a = this._sizeOf(e);
    this._resize = { id: e.id, w: a.w, h: a.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let r = e.sizes[0], a = 1 / 0;
    for (const n of e.sizes) {
      const o = (n.w - s) ** 2 + (n.h - i) ** 2;
      o < a && ([r, a] = [n, o]);
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
      const r = $._list(i, e.key)?.find((a) => a.id === t.id);
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
    const s = this.shadowRoot?.elementsFromPoint(t, e) ?? [], i = s.find((a) => a.dataset?.cid != null && a.dataset.cid !== this._drag?.id);
    if (i) {
      this._dropCard = { key: i.dataset.key, targetId: i.dataset.cid };
      return;
    }
    const r = s.find((a) => a.dataset?.zone != null);
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
      const a = $._list(r, i.key), n = a.findIndex((f) => f.id === t), o = s ? a.findIndex((f) => f.id === s) : -1, [c] = a.splice(n, 1), h = $._list(r, e);
      if (!h) {
        a.splice(n, 0, c);
        return;
      }
      if (!s) {
        h.push(c);
        return;
      }
      const u = h.findIndex((f) => f.id === s), p = i.key === e && o > n;
      h.splice(u < 0 ? h.length : u + (p ? 1 : 0), 0, c);
    });
  }
  _moveSection(t, e) {
    const s = this._sections.findIndex((i) => i.id === t);
    s < 0 || s === e || this._update((i) => {
      const r = i.sections.findIndex((n) => n.id === t), [a] = i.sections.splice(r, 1);
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
    const r = e.scrollTop;
    e.scrollTop += i;
    const a = e.scrollTop - r;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - a }, this._dragDy += a;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, r = e && !this._allCards.length, a = this._drag?.kind === "card", n = this._drag?.kind === "section", o = s.length > 0 || r || t && (a || !i.length);
    let c = 0;
    return d`
      <div class="scroller" style="background:${pr}${tr("crepusculo")}" @terral-card-hold=${this._onHold}>
        <div class="wrap ${t ? "editing" : ""}">
          <div class="top">
            <button class="glass round" aria-label=${l(this.hass, "menu")} @click=${() => Ji(this, "hass-toggle-menu")}>
              ${Vs()}
            </button>
            <span class="spacer"></span>
            ${t ? d`<div class="glass pill">
                  <button class="pbtn" aria-label=${l(this.hass, "add_accessory")} @click=${this._add}>${wt(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${l(this.hass, "done")}</button>
                </div>` : d`<div class="glass pill">
                  <button class="pbtn" aria-label=${l(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${wt(22)}</button>
                  <button class="pbtn" aria-label=${l(this.hass, "more_options")} @click=${this._menu}>${Ks(22)}</button>
                </div>`}
          </div>
          <h1>${l(this.hass, "home_title")}</h1>
          ${this._error ? d`<p class="notice">${l(this.hass, "panel_error")} (${this._error})</p>` : g}
          ${o ? this._grid(At, s, t, r || t && !i.length, s.length === 0 && t ? l(this.hass, "no_section") : void 0) : g}
          ${Ne(
      i,
      (h) => h.id,
      (h) => {
        const u = n && this._drag?.id === h.id, p = n && !u && this._dropSection === c;
        return u || c++, !t && !h.cards.length ? g : d`${p ? d`<div class="dropline"></div>` : g}${this._section(h, t, u)}`;
      }
    )}
          ${n && this._dropSection === c ? d`<div class="dropline"></div>` : g}
          ${t && e ? d`<button class="addsec" @click=${this._addSection}>${wt(20)}<span>${l(this.hass, "add_section")}</span></button>` : g}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, r = s ? `translate:0 ${this._dragDy}px` : "";
    return d`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${r}>
      <header>
        ${e ? d`<button class="sdel" aria-label=${l(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${Pe()}</button>` : g}
        ${i ? d`<input
              class="rename"
              .value=${t.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(a) => {
      a.key === "Enter" && this._commitRename(t.id, a.target.value), a.key === "Escape" && (this._renaming = void 0);
    }}
              @blur=${(a) => this._commitRename(t.id, a.target.value)}
            />` : e ? d`<button class="title" aria-label=${l(this.hass, "rename_section")} @click=${() => this._renaming = t.id}>${t.title}</button>` : d`<h2>${t.title}</h2>`}
        ${e ? d`<button
              class="handle"
              aria-label=${l(this.hass, "move_section")}
              @pointerdown=${(a) => this._handleDown(a, t.id)}
            >${Qs()}</button>` : g}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? l(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  _grid(t, e, s, i, r) {
    const a = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId;
    return d`<div
      class="grid ${a ? "zone-target" : ""} ${t === At ? "top-grid" : ""}"
      data-zone=${t}
      style="grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px"
    >
      ${Ne(e, (n) => n.id, (n, o) => this._cell(t, n, o, s))}
      ${r && !e.length ? d`<div class="placeholder" style="grid-column:1/-1">${r}</div>` : g}
      ${i ? d`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${wt(26)}</span><span>${l(this.hass, "add_accessory")}</span>
          </button>` : g}
    </div>`;
  }
  _cell(t, e, s, i) {
    const { w: r, h: a } = this._sizeOf(e), n = this._drag?.kind === "card" && this._drag.id === e.id, o = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, c = `grid-column:span ${r};grid-row:span ${a};--d:${s % 5 * -0.07}s;${n ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return d`<div class="cell ${n ? "dragging" : ""} ${o ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${c}>
      ${this._element(e)}
      ${i ? d`<div class="overlay" @pointerdown=${(h) => this._overlayDown(h, e.id)}>
            <button class="del" aria-label=${l(this.hass, "delete")} @click=${() => this._remove(e.id)}>${Pe()}</button>
            ${this._canResize(e) ? d`<button
              class="corner"
              aria-label=${l(this.hass, "resize")}
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
$.styles = S`
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
k([
  _({ attribute: !1 })
], $.prototype, "hass", 2);
k([
  _({ type: Boolean })
], $.prototype, "narrow", 2);
k([
  _({ attribute: !1 })
], $.prototype, "route", 2);
k([
  _({ attribute: !1 })
], $.prototype, "panel", 2);
k([
  x()
], $.prototype, "_layout", 2);
k([
  x()
], $.prototype, "_error", 2);
k([
  x()
], $.prototype, "_edit", 2);
k([
  x()
], $.prototype, "_cols", 2);
k([
  x()
], $.prototype, "_rowH", 2);
k([
  x()
], $.prototype, "_drag", 2);
k([
  x()
], $.prototype, "_dropCard", 2);
k([
  x()
], $.prototype, "_dropSection", 2);
k([
  x()
], $.prototype, "_dragDx", 2);
k([
  x()
], $.prototype, "_dragDy", 2);
k([
  x()
], $.prototype, "_resize", 2);
k([
  x()
], $.prototype, "_renaming", 2);
$ = k([
  T("terral-home-panel")
], $);
const at = window;
at.customCards = at.customCards || [];
at.customCards.some((t) => t.type === "terral-home-light") || at.customCards.push({
  type: "terral-home-light",
  name: "Terral · Luz",
  description: "Luz o grupo de luces al estilo Terral Home / Terral Home light or light group",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("light.") ? { config: { type: "custom:terral-home-light", entity: e } } : null
});
at.customCards.some((t) => t.type === "terral-home-alarm") || at.customCards.push({
  type: "terral-home-alarm",
  name: "Terral · Alarma",
  description: "Alarma (Alarmo u otra) al estilo Terral Home / Terral Home alarm (Alarmo or any alarm panel)",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("alarm_control_panel.") ? { config: { type: "custom:terral-home-alarm", entity: e } } : null
});
console.info(
  `%c TERRAL HOME %c v${fs} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  fs as VERSION
};
