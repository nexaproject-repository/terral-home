/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = globalThis, ui = Ge.ShadowRoot && (Ge.ShadyCSS === void 0 || Ge.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, gi = Symbol(), Wi = /* @__PURE__ */ new WeakMap();
let Aa = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== gi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (ui && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = Wi.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Wi.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Xn = (t) => new Aa(typeof t == "string" ? t : t + "", void 0, gi), A = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, a, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[n + 1], t[0]);
  return new Aa(s, t, gi);
}, Kn = (t, e) => {
  if (ui) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), a = Ge.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = s.cssText, t.appendChild(i);
  }
}, qi = ui ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Xn(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Qn, defineProperty: Zn, getOwnPropertyDescriptor: Jn, getOwnPropertyNames: to, getOwnPropertySymbols: eo, getPrototypeOf: so } = Object, ms = globalThis, Ui = ms.trustedTypes, io = Ui ? Ui.emptyScript : "", ao = ms.reactiveElementPolyfillSupport, me = (t, e) => t, ts = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? io : null;
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
} }, fi = (t, e) => !Qn(t, e), Bi = { attribute: !0, type: String, converter: ts, reflect: !1, useDefault: !1, hasChanged: fi };
Symbol.metadata ??= Symbol("metadata"), ms.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let jt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Bi) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(e, i, s);
      a !== void 0 && Zn(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: a, set: n } = Jn(this.prototype, e) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: a, set(o) {
      const l = a?.call(this);
      n?.call(this, o), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Bi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(me("elementProperties"))) return;
    const e = so(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(me("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(me("properties"))) {
      const s = this.properties, i = [...to(s), ...eo(s)];
      for (const a of i) this.createProperty(a, s[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, a] of s) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const a = this._$Eu(s, i);
      a !== void 0 && this._$Eh.set(a, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) s.unshift(qi(a));
    } else e !== void 0 && s.push(qi(e));
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
    return Kn(e, this.constructor.elementStyles), e;
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
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : ts).toAttribute(s, i.type);
      this._$Em = e, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const n = i.getPropertyOptions(a), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ts;
      this._$Em = a;
      const l = o.fromAttribute(s, n.type);
      this[a] = l ?? this._$Ej?.get(a) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, a = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (a === !1 && (n = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? fi)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: a, wrapped: n }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? s ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, n] of i) {
        const { wrapped: o } = n, l = this[a];
        o !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, n, l);
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
jt.elementStyles = [], jt.shadowRootOptions = { mode: "open" }, jt[me("elementProperties")] = /* @__PURE__ */ new Map(), jt[me("finalized")] = /* @__PURE__ */ new Map(), ao?.({ ReactiveElement: jt }), (ms.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _i = globalThis, Fi = (t) => t, es = _i.trustedTypes, Yi = es ? es.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, za = "$lit$", ot = `lit$${Math.random().toFixed(9).slice(2)}$`, Ea = "?" + ot, no = `<${Ea}>`, kt = document, $e = () => kt.createComment(""), ke = (t) => t === null || typeof t != "object" && typeof t != "function", mi = Array.isArray, oo = (t) => mi(t) || typeof t?.[Symbol.iterator] == "function", zs = `[ 	
\f\r]`, le = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Vi = /-->/g, Gi = />/g, bt = RegExp(`>|${zs}(?:([^\\s"'>=/]+)(${zs}*=${zs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Xi = /'/g, Ki = /"/g, Ta = /^(?:script|style|textarea|title)$/i, Da = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), d = Da(1), y = Da(2), dt = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Qi = /* @__PURE__ */ new WeakMap(), vt = kt.createTreeWalker(kt, 129);
function Oa(t, e) {
  if (!mi(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Yi !== void 0 ? Yi.createHTML(e) : e;
}
const ro = (t, e) => {
  const s = t.length - 1, i = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = le;
  for (let l = 0; l < s; l++) {
    const c = t[l];
    let h, p, u = -1, _ = 0;
    for (; _ < c.length && (o.lastIndex = _, p = o.exec(c), p !== null); ) _ = o.lastIndex, o === le ? p[1] === "!--" ? o = Vi : p[1] !== void 0 ? o = Gi : p[2] !== void 0 ? (Ta.test(p[2]) && (a = RegExp("</" + p[2], "g")), o = bt) : p[3] !== void 0 && (o = bt) : o === bt ? p[0] === ">" ? (o = a ?? le, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, h = p[1], o = p[3] === void 0 ? bt : p[3] === '"' ? Ki : Xi) : o === Ki || o === Xi ? o = bt : o === Vi || o === Gi ? o = le : (o = bt, a = void 0);
    const x = o === bt && t[l + 1].startsWith("/>") ? " " : "";
    n += o === le ? c + no : u >= 0 ? (i.push(h), c.slice(0, u) + za + c.slice(u) + ot + x) : c + ot + (u === -2 ? l : x);
  }
  return [Oa(t, n + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
let Fs = class Pa {
  constructor({ strings: e, _$litType$: s }, i) {
    let a;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, c = this.parts, [h, p] = ro(e, s);
    if (this.el = Pa.createElement(h, i), vt.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (a = vt.nextNode()) !== null && c.length < l; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const u of a.getAttributeNames()) if (u.endsWith(za)) {
          const _ = p[o++], x = a.getAttribute(u).split(ot), f = /([.?@])?(.*)/.exec(_);
          c.push({ type: 1, index: n, name: f[2], strings: x, ctor: f[1] === "." ? co : f[1] === "?" ? ho : f[1] === "@" ? po : bs }), a.removeAttribute(u);
        } else u.startsWith(ot) && (c.push({ type: 6, index: n }), a.removeAttribute(u));
        if (Ta.test(a.tagName)) {
          const u = a.textContent.split(ot), _ = u.length - 1;
          if (_ > 0) {
            a.textContent = es ? es.emptyScript : "";
            for (let x = 0; x < _; x++) a.append(u[x], $e()), vt.nextNode(), c.push({ type: 2, index: ++n });
            a.append(u[_], $e());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Ea) c.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = a.data.indexOf(ot, u + 1)) !== -1; ) c.push({ type: 7, index: n }), u += ot.length - 1;
      }
      n++;
    }
  }
  static createElement(e, s) {
    const i = kt.createElement("template");
    return i.innerHTML = e, i;
  }
};
function qt(t, e, s = t, i) {
  if (e === dt) return e;
  let a = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = ke(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== n && (a?._$AO?.(!1), n === void 0 ? a = void 0 : (a = new n(t), a._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = a : s._$Cl = a), a !== void 0 && (e = qt(t, a._$AS(t, e.values), a, i)), e;
}
class lo {
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
    const { el: { content: s }, parts: i } = this._$AD, a = (e?.creationScope ?? kt).importNode(s, !0);
    vt.currentNode = a;
    let n = vt.nextNode(), o = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let h;
        c.type === 2 ? h = new Zt(n, n.nextSibling, this, e) : c.type === 1 ? h = new c.ctor(n, c.name, c.strings, this, e) : c.type === 6 && (h = new uo(n, this, e)), this._$AV.push(h), c = i[++l];
      }
      o !== c?.index && (n = vt.nextNode(), o++);
    }
    return vt.currentNode = kt, a;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class Zt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, a) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
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
    e = qt(this, e, s), ke(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== dt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : oo(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && ke(this._$AH) ? this._$AA.nextSibling.data = e : this.T(kt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Fs.createElement(Oa(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(s);
    else {
      const n = new lo(a, this), o = n.u(this.options);
      n.p(s), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let s = Qi.get(e.strings);
    return s === void 0 && Qi.set(e.strings, s = new Fs(e)), s;
  }
  k(e) {
    mi(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, a = 0;
    for (const n of e) a === s.length ? s.push(i = new Zt(this.O($e()), this.O($e()), this, this.options)) : i = s[a], i._$AI(n), a++;
    a < s.length && (this._$AR(i && i._$AB.nextSibling, a), s.length = a);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = Fi(e).nextSibling;
      Fi(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class bs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, a, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = s, this._$AM = a, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(e, s = this, i, a) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = qt(this, e, s, 0), o = !ke(e) || e !== this._$AH && e !== dt, o && (this._$AH = e);
    else {
      const l = e;
      let c, h;
      for (e = n[0], c = 0; c < n.length - 1; c++) h = qt(this, l[i + c], s, c), h === dt && (h = this._$AH[c]), o ||= !ke(h) || h !== this._$AH[c], h === g ? e = g : e !== g && (e += (h ?? "") + n[c + 1]), this._$AH[c] = h;
    }
    o && !a && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class co extends bs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class ho extends bs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class po extends bs {
  constructor(e, s, i, a, n) {
    super(e, s, i, a, n), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = qt(this, e, s, 0) ?? g) === dt) return;
    const i = this._$AH, a = e === g && i !== g || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== g && (i === g || a);
    a && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class uo {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    qt(this, e);
  }
}
const go = { I: Zt }, fo = _i.litHtmlPolyfillSupport;
fo?.(Fs, Zt), (_i.litHtmlVersions ??= []).push("3.3.3");
const _o = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = a = new Zt(e.insertBefore($e(), n), n, void 0, s ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bi = globalThis;
let N = class extends jt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = _o(s, this.renderRoot, this.renderOptions);
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
N._$litElement$ = !0, N.finalized = !0, bi.litElementHydrateSupport?.({ LitElement: N });
const mo = bi.litElementPolyfillSupport;
mo?.({ LitElement: N });
(bi.litElementVersions ??= []).push("4.2.2");
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
const bo = { attribute: !0, type: String, converter: ts, reflect: !1, hasChanged: fi }, xo = (t = bo, e, s) => {
  const { kind: i, metadata: a } = s;
  let n = globalThis.litPropertyMetadata.get(a);
  if (n === void 0 && globalThis.litPropertyMetadata.set(a, n = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(s.name, t), i === "accessor") {
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
function v(t) {
  return (e, s) => typeof s == "object" ? xo(t, e, s) : ((i, a, n) => {
    const o = a.hasOwnProperty(n);
    return a.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(a, n) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return v({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yo = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function vo(t, e) {
  return (s, i, a) => {
    const n = (o) => o.renderRoot?.querySelector(t) ?? null;
    return yo(s, i, { get() {
      return n(this);
    } });
  };
}
const wo = {
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
}, $o = {
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
function P(t) {
  return (t?.locale?.language ?? t?.language ?? navigator.language)?.toLowerCase().startsWith("es") ? "es" : "en";
}
function r(t, e, s) {
  let i = (P(t) === "es" ? wo : $o)[e] ?? e;
  if (s) for (const [a, n] of Object.entries(s)) i = i.replace(`{${a}}`, String(n));
  return i;
}
function ja(t, e) {
  const s = Math.max(0, Math.round((Date.now() - new Date(e).getTime()) / 6e4));
  if (s < 1) return r(t, "just_now");
  if (s < 60) return r(t, "min_ago", { n: s });
  const i = Math.round(s / 60);
  return i < 48 ? r(t, "h_ago", { n: i }) : r(t, "days_ago", { n: Math.round(i / 24) });
}
const ko = "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z", U = (t, e = 24) => y`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${ko} fill=${t ? "currentColor" : "none"}></path>
  </svg>`, Na = (t = 24) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`, xs = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`, La = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`, ss = (t, e = 16) => y`
  <svg width=${e} height=${e} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${t ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`, So = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`, Nt = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`, Co = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`, Mo = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`, Zi = (t = 16) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`, Ia = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`, Xe = (t = 18) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`, K = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`, Ao = (t = 26) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`, zo = (t = 20) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`, k = (t, e, s = 2) => y`
  <svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Ra = y`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`, ys = (t = 24) => k(t, Ra), Ha = (t = 24) => k(t, y`${Ra}<path d="M9 12l2 2 4-4"></path>`), Ys = (t = 24) => k(t, y`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`), Eo = (t = 20) => k(t, y`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`), is = (t = 20) => k(t, y`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`), To = (t = 20) => k(t, y`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`), Do = (t = 20) => k(t, y`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`), Oo = (t = 20) => k(t, y`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`), Se = (t = 20) => k(t, y`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`), Ut = (t = 20) => k(t, y`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`), Po = (t = 24) => k(t, y`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`), jo = (t = 20) => k(t, y`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`), vs = (t = 24) => k(t, y`<path d="M5 21V5.5A2.5 2.5 0 0 1 7.5 3h5A2.5 2.5 0 0 1 15 5.5V21"></path><path d="M3 21h14"></path><path d="M15 10h1.5a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8.5L19 6"></path><path d="M10.5 6.5L8.6 10h2.8l-1.9 3.5"></path>`, 1.9), No = (t = 18) => k(t, y`<path d="M13 2L4 14h7l-1 8 9-12h-7z"></path>`), Ji = (t = 19) => k(t, y`<rect x="3" y="7" width="16" height="10" rx="2.5"></rect><path d="M21 11v2"></path><path d="M7 10.5v3M10.5 10.5v3"></path>`), Lo = (t = 19) => k(t, y`<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>`), Io = (t = 20) => k(t, y`<path d="M15 6l-6 6 6 6"></path>`, 2.4), Ro = (t = 22) => k(t, y`<circle cx="12" cy="12" r="8.5"></circle><path d="M9 16l3-8 3 8M10 13.5h4"></path>`), Ho = (t = 22) => k(t, y`<path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11"></path><path d="M9.5 4L12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"></path>`), Wo = (t = 22) => k(t, y`<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2 2-3 4-3 6-1-1-2-2-2.5-3.5C7.5 9.5 5 12 5 15a7 7 0 0 0 7 7z"></path>`), qo = (t = 22) => k(t, y`<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path><path d="M9.5 15.5l5-5"></path>`), Vs = (t = 22) => k(t, y`<circle cx="12" cy="12" r="1.8"></circle><path d="M12 10.2C11 6 13 3 15.5 4.2S15 9 12 10.2zM13.8 12c4.2-1 7.2 1 6 3.5S15 15 13.8 12zM12 13.8c1 4.2-1 7.2-3.5 6S9 15 12 13.8zM10.2 12c-4.2 1-7.2-1-6-3.5S9 9 10.2 12z"></path>`), Uo = (t = 22) => k(t, y`<path d="M8 20V4M4.5 7.5L8 4l3.5 3.5"></path><path d="M16 4v16M12.5 16.5L16 20l3.5-3.5"></path>`), Ce = (t = 22) => k(t, y`<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path>`), xi = (t = 20) => k(t, y`<path d="M6 12h12"></path>`, 2.4), yi = (t = 20) => k(t, y`<path d="M12 6v12M6 12h12"></path>`, 2.4), Me = (t = 24) => k(t, y`<circle cx="12" cy="12" r="9"></circle><path d="M5.6 8.2a8 8 0 0 1 12.8 0"></path><circle cx="12" cy="12.6" r="2.6"></circle><circle cx="15.6" cy="16.8" r=".6" fill="currentColor"></circle>`, 1.9), Ke = (t = 20) => k(t, y`<path d="M7 4.5v15l12-7.5z" fill="currentColor"></path>`, 1.6), Wa = (t = 20) => k(t, y`<path d="M8 5v14M16 5v14"></path>`, 3), qa = (t = 20) => k(t, y`<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path><circle cx="12" cy="10" r="2.3"></circle>`), Ua = (t = 14) => k(t, y`<path d="M12 5v9"></path><path d="M12 18.5h.01"></path>`, 3.2), Bo = (t = 18) => k(t, y`<path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8z"></path><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"></path>`), Fo = (t = 18) => k(t, y`<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"></path>`), Yo = (t = 18) => k(t, y`<path d="M6 3v7a2 2 0 0 0 2 2v9M8 3v6M10 3v7a2 2 0 0 1-2 2"></path><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"></path>`), Vo = (t = 18) => k(t, y`<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"></path><circle cx="7" cy="11.5" r="1.8"></circle>`), Go = (t = 18) => k(t, y`<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"></path><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"></path><path d="M6 18v2M18 18v2"></path>`), Xo = (t = 18) => k(t, y`<circle cx="7" cy="10" r="1.6"></circle><circle cx="10.5" cy="6.5" r="1.6"></circle><circle cx="14.5" cy="6.5" r="1.6"></circle><circle cx="18" cy="10" r="1.6"></circle><path d="M12.5 12c2.5 0 5 3.3 5 5.5 0 1.6-1.4 2.5-3 2.1-1.3-.3-2.7-.3-4 0-1.6.4-3-.5-3-2.1 0-2.2 2.5-5.5 5-5.5z"></path>`), Ko = (t, e = !1, s = 16) => k(s, y`<rect x="2.5" y="7" width="16.5" height="10" rx="2.5"></rect><path d="M21.5 10.5v3"></path>
    ${e ? y`<path d="M11.5 8.6L8.6 12.4h3.2l-1.3 3" stroke-width="1.8"></path>` : [0, 1, 2, 3].slice(0, t).map((i) => y`<rect x=${4.6 + i * 3.4} y="9.2" width="2.3" height="5.6" rx=".6" fill="currentColor" stroke="none"></rect>`)}`);
var Qo = Object.defineProperty, Zo = Object.getOwnPropertyDescriptor, Q = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Zo(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Qo(e, s, a), a;
};
let W = class extends N {
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
      const a = Math.max(this.min, Math.min(this.max, Math.round(this.value + (s ? e : -e))));
      this._commit(a);
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
W.styles = A`
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
Q([
  v({ type: Number })
], W.prototype, "value", 2);
Q([
  v({ type: Number })
], W.prototype, "min", 2);
Q([
  v({ type: Number })
], W.prototype, "max", 2);
Q([
  v({ type: Boolean, reflect: !0 })
], W.prototype, "vertical", 2);
Q([
  v()
], W.prototype, "mode", 2);
Q([
  v()
], W.prototype, "label", 2);
Q([
  v()
], W.prototype, "suffix", 2);
Q([
  v({ type: Boolean, attribute: "show-value" })
], W.prototype, "showValue", 2);
Q([
  b()
], W.prototype, "_drag", 2);
W = Q([
  z("terral-slider")
], W);
const Ba = ["hs", "rgb", "rgbw", "rgbww", "xy"], vi = [
  { name: { es: "Rosa", en: "Pink" }, rgb: [232, 80, 138] },
  { name: { es: "Rojo", en: "Red" }, rgb: [255, 90, 74] },
  { name: { es: "Naranja", en: "Orange" }, rgb: [255, 157, 58] },
  { name: { es: "Verde", en: "Green" }, rgb: [76, 208, 122] },
  { name: { es: "Azul", en: "Blue" }, rgb: [74, 125, 255] },
  { name: { es: "Violeta", en: "Violet" }, rgb: [154, 108, 255] }
], Gs = [
  { key: "warm", kelvin: 2700, css: "#ffb45c" },
  { key: "neutral", kelvin: 3500, css: "#ffe9c4" },
  { key: "day", kelvin: 4500, css: "#eaf3ff" },
  { key: "cold", kelvin: 6e3, css: "#bcd8ff" }
];
function Fa(t) {
  return t.attributes.supported_color_modes ?? [];
}
function Qe(t) {
  const e = Fa(t);
  return e.some((s) => Ba.includes(s)) ? "color" : e.includes("color_temp") ? "temperature" : e.some((s) => s !== "onoff") ? "dimmable" : "onoff";
}
function Jo(t) {
  return Fa(t).includes("color_temp");
}
function E(t) {
  return t?.state === "on";
}
function wt(t) {
  return !t || t.state === "unavailable" || t.state === "unknown";
}
function yt(t) {
  const e = t.attributes.brightness;
  if (!(!E(t) || e == null))
    return Math.max(1, Math.round(e / 255 * 100));
}
function J(t) {
  const e = t.attributes.entity_id;
  return Array.isArray(e) ? e.filter((s) => s !== t.entity_id) : [];
}
function ta(t) {
  return J(t).length > 0;
}
function Ae(t) {
  return t.attributes.color_temp_kelvin;
}
function Bt(t) {
  if (!E(t)) return;
  const e = t.attributes.color_mode;
  if (!e || !Ba.includes(e)) return;
  const s = t.attributes.rgb_color;
  return s && s.length === 3 ? s : void 0;
}
const ea = {
  bg: "rgba(255,247,232,.95)",
  fg: "#3a2a10",
  fg2: "#6b5428",
  accent: "#ffb020",
  fill: "#ffc04d"
}, ce = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * s)), de = (t, e = 1) => `rgba(${t[0]},${t[1]},${t[2]},${e})`, tr = {
  bg: "rgba(236,244,255,.95)",
  fg: "#1f3550",
  fg2: "#3d5878",
  accent: "#5a9df0",
  fill: "#a9cdff"
}, er = (t) => (0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]) / 255;
function Ya(t, e) {
  if (!e) return ea;
  const s = Bt(t);
  if (!s) {
    const n = Ae(t);
    return n && t.attributes.color_mode === "color_temp" && n >= 4500 ? tr : ea;
  }
  const i = [255, 255, 255], a = er(s) > 0.75 ? ce(s, [40, 50, 80], 0.45) : s;
  return {
    bg: de(ce(s, i, 0.84), 0.95),
    fg: de(ce(s, [10, 10, 20], 0.82)),
    fg2: de(ce(s, [20, 10, 30], 0.72)),
    accent: de(a),
    fill: de(ce(a, i, 0.35))
  };
}
function be(t, e) {
  return t.callService("light", E(e) ? "turn_off" : "turn_on", {}, { entity_id: e.entity_id });
}
function Es(t, e, s) {
  return t.callService("light", s ? "turn_on" : "turn_off", {}, { entity_id: e });
}
function Xs(t, e, s) {
  return s <= 0 ? t.callService("light", "turn_off", {}, { entity_id: e }) : t.callService("light", "turn_on", { brightness_pct: Math.round(s) }, { entity_id: e });
}
function as(t, e, s) {
  const i = e.attributes.min_color_temp_kelvin ?? 2e3, a = e.attributes.max_color_temp_kelvin ?? 6500;
  return t.callService(
    "light",
    "turn_on",
    { color_temp_kelvin: Math.round(Math.min(a, Math.max(i, s))) },
    { entity_id: e.entity_id }
  );
}
function sa(t, e, s) {
  return t.callService("light", "turn_on", { rgb_color: s }, { entity_id: e });
}
function sr(t) {
  const e = parseInt(t.replace("#", ""), 16);
  return [e >> 16 & 255, e >> 8 & 255, e & 255];
}
function V(t) {
  return "#" + t.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function Ks(t, e) {
  let s;
  for (const i of vi) {
    const a = i.rgb.reduce((n, o, l) => n + (o - t[l]) ** 2, 0);
    (!s || a < s.d) && (s = { d: a, n: i.name[e] });
  }
  return s && s.d < 9e3 ? s.n : void 0;
}
function Ze(t, e) {
  const s = t.entities?.[e], i = s?.area_id ?? (s?.device_id ? t.devices?.[s.device_id]?.area_id : void 0);
  return i ? t.areas?.[i]?.name ?? void 0 : void 0;
}
function ia(t, e, s) {
  for (const i of t) {
    if (i === e) break;
    if (!(i instanceof HTMLElement)) continue;
    const a = getComputedStyle(i).overflowY;
    if ((a === "auto" || a === "scroll") && i.scrollHeight > i.clientHeight + 1 && (s > 0 && i.scrollTop > 0 || s < 0 && i.scrollTop + i.clientHeight < i.scrollHeight - 1 || s === 0))
      return !0;
  }
  return !1;
}
function Va(t) {
  let e = 0;
  const s = (n) => {
    e = n.touches[0]?.clientY ?? 0;
  }, i = (n) => {
    if (!n.cancelable) return;
    const o = n.touches[0]?.clientY ?? e;
    ia(n.composedPath(), t, o - e) || n.preventDefault();
  }, a = (n) => {
    ia(n.composedPath(), t, -n.deltaY) || n.preventDefault();
  };
  return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", i, { passive: !1 }), t.addEventListener("wheel", a, { passive: !1 }), () => {
    t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", i), t.removeEventListener("wheel", a);
  };
}
var ir = Object.defineProperty, ar = Object.getOwnPropertyDescriptor, st = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ar(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && ir(e, s, a), a;
};
let Ft;
function nr(t, e) {
  Ft?.close();
  const s = document.createElement("terral-light-dialog");
  s.hass = t, s.opts = e, document.body.appendChild(s), Ft = s;
}
function or(t) {
  Ft?.isConnected && (Ft.hass = t);
}
let B = class extends N {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = Va(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mq.removeEventListener("change", this._onMq), window.removeEventListener("keydown", this._onKey), this._unlock?.(), Ft === this && (Ft = void 0);
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
    const e = [], s = J(t);
    if (s.length) {
      const o = s.filter((l) => E(this.hass.states[l])).length;
      e.push(`${o} ${r(this.hass, "of")} ${s.length} ${r(this.hass, "lit")}`);
    }
    const i = yt(t);
    i != null && e.push(`${i} %`);
    const a = Bt(t), n = Ae(t);
    if (a) {
      const o = Ks(a, P(this.hass));
      o && e.push(o);
    } else n && t.attributes.color_mode === "color_temp" && e.push(`${n} K`);
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
    const e = E(t), s = Ya(t, this.opts.useLightColor !== !1), i = J(t), a = `--accent:${s.accent};--fill:${s.fill};--onbg:${s.bg};--onfg:${s.fg}`, n = this._controls(t), o = i.length ? this._memberList(t, i) : g, l = this._info(t);
    return d`
      <div class="body" style=${a}>
        <header>
          ${this._stack.length ? d`<button class="round back" aria-label="←" @click=${() => this._stack = this._stack.slice(0, -1)}>
                ${ss(!1, 18)}
              </button>` : g}
          <button
            class="icon ${e ? "on" : ""}"
            aria-label=${e ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            ?disabled=${wt(t)}
            @click=${() => be(this.hass, t)}
          >
            ${U(e, this._wide ? 28 : 24)}
            ${i.length && e ? d`<span class="badge">${i.filter((c) => E(this.hass.states[c])).length}</span>` : g}
          </button>
          <div class="title">
            <strong>${this._name(t)}</strong>
            <span>${this._stateText(t)}${Ze(this.hass, t.entity_id) ? ` · ${Ze(this.hass, t.entity_id)}` : ""}</span>
          </div>
          ${this.opts.onSettings ? d`<button class="round gear" aria-label=${r(this.hass, "settings")} @click=${() => {
      const c = this.opts.onSettings;
      this.close(), c();
    }}>${K(this._wide ? 22 : 18)}</button>` : g}
          <button class="round close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>
            ${xs(this._wide ? 22 : 16)}
          </button>
        </header>
        ${this._wide ? d`<div class="cols">
              <div class="left">${n.main}</div>
              <div class="right">${n.side}${o}${i.length ? g : l}</div>
            </div>` : d`<div class="stack">
              <div class="main-row">${n.main}${n.beside ?? g}</div>
              ${n.side}${o}${i.length ? g : l}
            </div>`}
      </div>
    `;
  }
  /** main = big control; side = presets/colours; beside = phone-only column next to main. */
  _controls(t) {
    const e = Qe(t), s = E(t), i = t.entity_id;
    if (e === "onoff")
      return {
        main: d`<button class="switch ${s ? "on" : ""}" aria-pressed=${s} aria-label=${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")}
            @click=${() => be(this.hass, t)}>
            <span>${Na(36)}</span>
          </button>`,
        side: g
      };
    const a = d`<terral-slider
      class="pill"
      vertical
      show-value
      .value=${yt(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(u) => Xs(this.hass, i, u.detail.value)}
    >${La(28)}</terral-slider>`, n = d`<div class="chips">
      ${[25, 50, 75, 100].map(
      (u) => d`<button class="chip" @click=${() => Xs(this.hass, i, u)}>${u} %</button>`
    )}
    </div>`, o = d`<div class="chips">
      ${Gs.map(
      (u) => d`<button class="chip tinted" style="background:${u.css}" @click=${() => as(this.hass, t, u.kelvin)}>
          ${r(this.hass, u.key)}
        </button>`
    )}
    </div>`;
    if (e === "dimmable") return { main: a, side: n };
    if (e === "temperature") {
      const u = t.attributes.min_color_temp_kelvin ?? 2e3, _ = t.attributes.max_color_temp_kelvin ?? 6500, x = d`<terral-slider
        class="pill temp"
        vertical
        mode="thumb"
        .min=${u}
        .max=${_}
        .value=${Ae(t) ?? Math.round((u + _) / 2)}
        .label=${r(this.hass, "temperature")}
        @value-changed=${(f) => as(this.hass, t, f.detail.value)}
      ></terral-slider>`;
      return this._wide ? { main: d`<div class="pair">${a}${x}</div>`, side: o } : { main: d`<div class="pair">${a}${x}</div>`, side: o };
    }
    const l = P(this.hass), c = (this.opts.favorites?.length ? this.opts.favorites : vi.map((u) => ({ name: u.name[l], rgb: u.rgb }))).slice(0, 6), h = Bt(t), p = d`
      <p class="lb">${r(this.hass, "favorites")}</p>
      <div class="swatches">
        ${c.map(
      (u) => d`<button
            class="sw ${h && V(h) === V(u.rgb) ? "sel" : ""}"
            style="background:${V(u.rgb)}"
            aria-label=${u.name ?? V(u.rgb)}
            @click=${() => sa(this.hass, i, u.rgb)}
          ></button>`
    )}
      </div>
      <button class="more" @click=${() => this._picker?.click()}>
        <span class="wheel"></span>${r(this.hass, "more_colors")}
      </button>
      <input type="color" .value=${h ? V(h) : "#ffffff"} @change=${(u) => sa(this.hass, i, sr(u.target.value))} />
      ${Jo(t) ? d`<p class="lb">${r(this.hass, "temperature")}</p>${o}` : g}
    `;
    return this._wide ? { main: a, side: p } : { main: a, side: g, beside: d`<div class="beside">${p}</div>` };
  }
  _memberList(t, e) {
    const s = this.opts.groupByArea ?? "auto", i = /* @__PURE__ */ new Map();
    for (const c of e) {
      const h = Ze(this.hass, c) ?? r(this.hass, "other_area");
      i.set(h, [...i.get(h) ?? [], c]);
    }
    const a = s === "always" || s === "auto" && e.length > 8 && i.size > 1, n = e.length > 8 ? d`<div class="chips">
          <button class="chip" @click=${() => Es(this.hass, t.entity_id, !0)}>${r(this.hass, "all_on")}</button>
          <button class="chip" @click=${() => Es(this.hass, t.entity_id, !1)}>${r(this.hass, "all_off")}</button>
        </div>` : g, o = (c) => {
      const h = this.hass.states[c], p = E(h), u = h ? this.hass.formatEntityName?.(h) ?? h.attributes.friendly_name ?? c : c;
      return d`<div class="mr">
        <button class="mi ${p ? "on" : ""}" ?disabled=${wt(h)}
          aria-label="${p ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${u}"
          @click=${() => h && be(this.hass, h)}>${U(p, 18)}</button>
        <button class="mt" @click=${() => this._stack = [...this._stack, c]}>
          <span>${u}</span><small>${h ? this._stateText(h) : r(this.hass, "not_found")}</small>
        </button>
      </div>`;
    }, l = (c) => [...c].sort((h, p) => Number(E(this.hass.states[p])) - Number(E(this.hass.states[h])));
    return d`
      ${n}
      <p class="lb">${r(this.hass, "lights_in_group")} (${e.length})</p>
      <div class="list">
        ${a ? [...i.entries()].map(([c, h]) => {
      const p = this._openAreas.has(c), u = h.filter((_) => E(this.hass.states[_])).length;
      return d`<div class="box">
                <div class="sec">
                  <button class="mi ${u ? "on" : ""}" aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${c}"
                    @click=${() => Es(this.hass, h, u === 0)}>${U(u > 0, 18)}</button>
                  <button class="mt" aria-expanded=${p} @click=${() => {
        const _ = new Set(this._openAreas);
        p ? _.delete(c) : _.add(c), this._openAreas = _;
      }}>
                    <span>${c} <small>${u} ${r(this.hass, "of")} ${h.length}</small></span>${ss(p)}
                  </button>
                </div>
                ${p ? d`<div class="inner">${h.map(o)}</div>` : g}
              </div>`;
    }) : d`<div class="box">${l(e).map(o)}</div>`}
      </div>
    `;
  }
  _info(t) {
    return d`<div class="info">
      <div><span>${r(this.hass, "last_activity")}</span><span>${ja(this.hass, t.last_changed)}</span></div>
    </div>`;
  }
};
B.styles = A`
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
st([
  v({ attribute: !1 })
], B.prototype, "hass", 2);
st([
  v({ attribute: !1 })
], B.prototype, "opts", 2);
st([
  b()
], B.prototype, "_stack", 2);
st([
  b()
], B.prototype, "_expanded", 2);
st([
  b()
], B.prototype, "_closing", 2);
st([
  b()
], B.prototype, "_wide", 2);
st([
  b()
], B.prototype, "_openAreas", 2);
st([
  vo("input[type=color]")
], B.prototype, "_picker", 2);
B = st([
  z("terral-light-dialog")
], B);
var rr = Object.defineProperty, wi = (t, e, s, i) => {
  for (var a = void 0, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = o(e, s, a) || a);
  return a && rr(e, s, a), a;
};
const Ri = class Ri extends N {
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
    super.connectedCallback(), this._mq.addEventListener("change", this._onMq), window.addEventListener("keydown", this._onKey), this._unlock = Va(this);
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
          <button class="close" aria-label=${r(this.hass, "close")} @click=${() => this.close()}>${xs(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }
};
Ri.styles = A`
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
let S = Ri;
wi([
  v({ attribute: !1 })
], S.prototype, "hass");
wi([
  b()
], S.prototype, "_wide");
wi([
  b()
], S.prototype, "_closing");
const Ts = ["switch", "lock", "input_boolean"], xe = (t) => t.split(".")[0], St = (t) => xe(t) === "lock";
function lr(t, e = !1) {
  const s = St(t.entity_id) ? t.state === "locked" : t.state === "on", i = St(t.entity_id);
  return s === i !== e;
}
function Qs(t, e, s, i = !1) {
  const a = e.entity_id, n = St(a) ? !i : i, o = s ? n : !n;
  return St(a) ? t.callService("lock", o ? "lock" : "unlock", {}, { entity_id: a }) : t.callService(xe(a), o ? "turn_on" : "turn_off", {}, { entity_id: a });
}
const cr = (t, e = !1) => (St(t) ? !e : e) ? "active" : "inactive", $i = (t) => !t || t.state === "unavailable" || t.state === "unknown";
function ki(t, e) {
  const s = e ? t.states[e] : void 0;
  if ($i(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const a = String(s.attributes.unit_of_measurement ?? "kW");
  return a === "W" ? i / 1e3 : a === "MW" ? i * 1e3 : i;
}
function Ga(t, e) {
  const s = e ? t.states[e] : void 0;
  if ($i(s)) return null;
  const i = Number(s.state);
  if (!Number.isFinite(i)) return null;
  const a = String(s.attributes.unit_of_measurement ?? "kWh");
  return a === "Wh" ? i / 1e3 : a === "MWh" ? i * 1e3 : i;
}
const It = 0.05;
function dr(t, e) {
  const s = ki(t, e.power), i = e.status ? t.states[e.status] : void 0;
  if (i && !$i(i)) {
    if (i.entity_id.startsWith("binary_sensor."))
      return i.state !== "on" ? "none" : s != null && s > It ? "charging" : "connected";
    const a = String(i.state).toLowerCase();
    if (/discharg/.test(a)) return "connected";
    if (/charging|cargando|en carga/.test(a)) return "charging";
    if (/disconnect|desconect|unplug|no car|sin coche|ready|available|disponible|libre|idle/.test(a))
      return s != null && s > It ? "charging" : "none";
    if (/connect|conectad|plugged|enchufad|waiting|esperando|paus|schedul|programad|demand|locked, car|suspended/.test(a))
      return s != null && s > It ? "charging" : "connected";
  }
  return s != null && s > It ? "charging" : "unknown";
}
function Xa(t, e) {
  const s = t.entities?.[e]?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, a]) => i !== e && a.device_id === s).map(([i]) => i) : [];
}
const Si = (t, e) => String(t.states[e]?.attributes.unit_of_measurement ?? ""), Ka = (t, e) => e.startsWith("sensor.") && ["W", "kW", "MW"].includes(Si(t, e)), Qa = (t, e) => e.startsWith("sensor.") && ["Wh", "kWh", "MWh"].includes(Si(t, e)), Za = (t, e) => {
  const s = t.states[e];
  return s ? e.startsWith("binary_sensor.") ? ["plug", "connectivity", "battery_charging"].includes(String(s.attributes.device_class ?? "")) || /plug|enchuf|connect|conect/i.test(e) : e.startsWith("sensor.") && !s.attributes.unit_of_measurement && Number.isNaN(Number(s.state)) : !1;
};
function Ci(t, e) {
  const s = Xa(t, e.entity), i = (n, o) => {
    const l = s.filter((c) => t.states[c] && n(c));
    return o && l.find((c) => o.test(c)) || l[0];
  }, a = (n, o) => n === "none" ? void 0 : n || o();
  return {
    status: a(e.status_entity, () => i((n) => Za(t, n), /status|estado/i)),
    power: a(e.power_entity, () => i((n) => Ka(t, n), /charging_power|potencia_de_carga|power|potencia/i)),
    energy: a(e.energy_entity, () => i((n) => Qa(t, n), /added|session|sesion|sesión|charge|carga/i))
  };
}
function aa(t, e) {
  if (St(e)) return !1;
  const s = String(t.states[e]?.attributes.friendly_name ?? "");
  return /lock|bloq|pause|paus|stop/i.test(e + " " + s);
}
async function Ja(t, e, s) {
  const i = await t.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1
  }), a = Si(t, e), n = a === "W" ? 1 / 1e3 : a === "MW" ? 1e3 : 1;
  return (i[e] ?? []).map((o) => [o.lu * 1e3, Number(o.s) * n]).filter(([, o]) => Number.isFinite(o));
}
function tn(t, e = Date.now()) {
  const s = [];
  let i;
  for (let a = 0; a < t.length; a++) {
    const [n, o] = t[a], l = a + 1 < t.length ? t[a + 1][0] : e, c = Math.max(0, l - n) / 36e5;
    o > It && (i && n - i.end > 15 * 6e4 && (s.push(i), i = void 0), i ??= { start: n, end: n, kwh: 0, maxKw: 0, live: !1 }, i.kwh += o * c, i.end = l, i.maxKw = Math.max(i.maxKw, o));
  }
  return i && (i.live = t.length > 0 && t[t.length - 1][1] > It, s.push(i)), s.filter((a) => a.kwh >= 0.05 || a.live);
}
function en(t, e = 7, s = /* @__PURE__ */ new Date()) {
  const i = [];
  for (let a = e - 1; a >= 0; a--) {
    const n = new Date(s.getFullYear(), s.getMonth(), s.getDate() - a);
    i.push({ day: n, kwh: 0 });
  }
  for (const a of t) {
    const n = new Date(a.start), o = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime(), l = i.find((c) => c.day.getTime() === o);
    l && (l.kwh += a.kwh);
  }
  return i;
}
const G = (t, e, s = 1) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Zs = (t) => {
  const e = Math.max(0, Math.round(t / 6e4));
  return `${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")} min`;
};
var hr = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, sn = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? pr(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && hr(e, s, a), a;
};
let ns = class extends S {
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
ns.styles = [
  S.styles,
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
sn([
  v({ attribute: !1 })
], ns.prototype, "options", 2);
ns = sn([
  z("terral-confirm-sheet")
], ns);
function ze(t, e) {
  const s = document.createElement("terral-confirm-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const na = ["auto", "heat_cool", "cool", "heat", "dry", "fan_only"], ur = {
  auto: { t: !0, f: !0 },
  heat_cool: { t: !0, f: !1 },
  cool: { t: !0, f: !0 },
  heat: { t: !0, f: !0 },
  dry: { t: !1, f: !1 },
  fan_only: { t: !1, f: !0 }
}, gr = {
  cool: [70, 150, 255],
  heat: [255, 140, 60],
  auto: [52, 199, 123],
  heat_cool: [52, 199, 123],
  dry: [40, 190, 200],
  fan_only: [140, 160, 200]
}, ws = { TARGET: 1, FAN: 8, SWING: 32, TURN_ON: 256 }, $s = (t, e) => (Number(t.attributes.supported_features ?? 0) & e) !== 0, j = (t) => t.state === "off" || t.state === "unavailable" || t.state === "unknown", Rt = (t) => t.state === "unavailable" || t.state === "unknown";
function lt(t) {
  const e = (t.attributes.hvac_modes ?? []).filter((i) => i !== "off"), s = (i) => na.includes(i) ? na.indexOf(i) : 99;
  return [...e].sort((i, a) => s(i) - s(a));
}
const Ee = (t) => $s(t, ws.FAN) || t.attributes.fan_modes ? t.attributes.fan_modes ?? [] : [], fr = (t) => (t.attributes.preset_modes ?? []).filter((e) => e !== "none"), an = (t) => $s(t, ws.SWING) || (t.attributes.swing_modes?.length ?? 0) > 0;
function nn(t, e = t.state) {
  return e === "heat_cool" || t.attributes.target_temp_low != null && t.attributes.target_temp_high != null && t.attributes.temperature == null && e !== "off";
}
function os(t, e) {
  return t.mode_rules?.[e] ?? ur[e] ?? { t: !0, f: !0 };
}
function Ht(t, e) {
  return j(t) || !os(e, t.state).t ? !1 : nn(t) ? t.attributes.target_temp_low != null : t.attributes.temperature != null || $s(t, ws.TARGET);
}
function on(t, e) {
  return !j(t) && os(e, t.state).f && Ee(t).length > 0;
}
function ye(t, e) {
  const s = Number(t.attributes.min_temp ?? 7), i = Number(t.attributes.max_temp ?? 35), a = Math.max(s, e.min_temp ?? s), n = Math.min(i, e.max_temp ?? i), o = e.temp_step ?? Number(t.attributes.target_temp_step ?? (t.attributes.temperature_unit === "°F" ? 1 : 0.5));
  return { min: a, max: Math.max(a + o, n), step: o, hwMin: s, hwMax: i };
}
const $t = (t, e) => Math.min(e.max, Math.max(e.min, Math.round(t / e.step) * e.step)), ve = (t) => t.attributes.current_temperature != null ? Number(t.attributes.current_temperature) : null, _r = (t) => t.attributes.current_humidity != null ? Number(t.attributes.current_humidity) : null, rn = /* @__PURE__ */ new Map(), ln = (t) => {
  j(t) || rn.set(t.entity_id, t.state);
};
function Mi(t, e) {
  const s = rn.get(e.entity_id);
  if (s && lt(e).includes(s)) return Te(t, e, s);
  if ($s(e, ws.TURN_ON)) return t.callService("climate", "turn_on", {}, { entity_id: e.entity_id });
  const i = lt(e).includes("cool") ? "cool" : lt(e)[0];
  return i ? Te(t, e, i) : Promise.resolve();
}
function Ai(t, e) {
  return ln(e), e.attributes.hvac_modes?.includes("off") ? Te(t, e, "off") : t.callService("climate", "turn_off", {}, { entity_id: e.entity_id });
}
const Te = (t, e, s) => t.callService("climate", "set_hvac_mode", { hvac_mode: s }, { entity_id: e.entity_id }), cn = (t, e, s) => t.callService("climate", "set_fan_mode", { fan_mode: s }, { entity_id: e.entity_id }), mr = (t, e, s) => t.callService("climate", "set_preset_mode", { preset_mode: s }, { entity_id: e.entity_id });
function br(t, e, s) {
  const i = e.attributes.swing_modes ?? ["on", "off"], a = s ? i.find((n) => n !== "off") ?? "on" : i.includes("off") ? "off" : i[0];
  return t.callService("climate", "set_swing_mode", { swing_mode: a }, { entity_id: e.entity_id });
}
function dn(t, e, s) {
  const i = typeof s == "number" ? { temperature: s } : { target_temp_low: s.low, target_temp_high: s.high };
  return t.callService("climate", "set_temperature", i, { entity_id: e.entity_id });
}
const hn = {
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
}, xr = {
  auto: "Auto",
  heat_cool: "Heat/cool",
  cool: "Cool",
  heat: "Heat",
  dry: "Dry",
  fan_only: "Fan only"
}, yr = { cool: "Enfriando", heat: "Calentando", dry: "Deshumidificando", fan_only: "Ventilando", auto: "Automático", heat_cool: "Manteniendo" }, vr = { cool: "Cooling", heat: "Heating", dry: "Drying", fan_only: "Fan", auto: "Auto", heat_cool: "Keeping" }, pn = (t) => t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " "), X = (t, e) => (t === "es" ? hn[e] : xr[e]) ?? pn(e), Js = (t, e) => (t === "es" ? hn[e.toLowerCase()] : void 0) ?? pn(e), ti = (t, e) => (t === "es" ? yr[e] : vr[e]) ?? X(t, e);
function wr(t, e) {
  if (!e) return "";
  if (/auto/i.test(e)) return "A";
  const i = t.filter((a) => !/auto/i.test(a)).indexOf(e);
  return i >= 0 ? String(i + 1) : e.charAt(0).toUpperCase();
}
function Wt(t, e = 22) {
  switch (t) {
    case "auto":
      return Ro(e);
    case "cool":
      return Ho(e);
    case "heat":
      return Wo(e);
    case "dry":
      return qo(e);
    case "fan_only":
      return Vs(e);
    case "heat_cool":
      return Uo(e);
    case "off":
      return Na(e);
    default:
      return Ce(e);
  }
}
const We = (t, e, s) => t.map((i, a) => Math.round(i + (e[a] - i) * s)), Pt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function un(t) {
  if (j(t)) return "";
  const e = gr[t.state] ?? [140, 160, 200];
  return `--bg:${Pt(We(e, [255, 255, 255], 0.84), 0.95)};--bg-solid:${Pt(We(e, [255, 255, 255], 0.84))};--fg:${Pt(We(e, [10, 10, 20], 0.82))};--fg2:${Pt(We(e, [20, 10, 30], 0.7))};--accent:${Pt(e)};--arc:${Pt(e)}`;
}
function ei(t) {
  if (nn(t)) {
    const e = t.attributes.target_temp_low, s = t.attributes.target_temp_high;
    return e != null && s != null ? { low: Number(e), high: Number(s) } : null;
  }
  return t.attributes.temperature != null ? Number(t.attributes.temperature) : null;
}
const ct = (t, e) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), De = (t, e) => e == null ? "" : typeof e == "number" ? `${ct(t, e)}°` : `${ct(t, e.low)}–${ct(t, e.high)}°`;
function oa(t, e, s, i, a) {
  const n = P(t), o = ve(e), l = o != null ? `${ct(t, o)}° ${n === "es" ? "dentro" : "inside"}` : "";
  if (Rt(e)) return n === "es" ? "Sin respuesta" : "Not responding";
  if (j(e)) {
    const p = n === "es" ? "Apagado" : "Off";
    return a || !l ? p : `${p} · ${l}`;
  }
  const c = Ht(e, s) ? De(t, i) : "";
  if (a) return c || X(n, e.state);
  const h = c ? `${ti(n, e.state)} ${n === "es" ? "a" : "to"} ${c}` : ti(n, e.state);
  return l ? `${h} · ${l}` : h;
}
function gn(t, e) {
  const s = _r(e);
  return s != null ? `${Math.round(s)} % ${P(t) === "es" ? "humedad" : "humidity"}` : "";
}
const $r = { PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 }, rt = (t, e) => ((Number(t.attributes.supported_features) || 0) & $r[e]) !== 0;
function Ct(t) {
  if (!t || t.state === "unavailable" || t.state === "unknown") return "unavailable";
  const e = t.state;
  return e === "cleaning" || e === "paused" || e === "returning" || e === "docked" || e === "error" ? e : "idle";
}
const Oe = (t, e) => t.entities?.[e];
function fn(t, e) {
  const s = Oe(t, e)?.device_id;
  return s ? Object.entries(t.entities ?? {}).filter(([i, a]) => a.device_id === s && i !== e && t.states[i]).map(([i]) => i) : [];
}
function _n(t, e) {
  const s = fn(t, e), i = (n, o, l, c = () => !0) => s.find((h) => h.startsWith(n) && o.includes(String(Oe(t, h)?.translation_key)) && c(h)) ?? s.find((h) => h.startsWith(n) && l.test(h) && c(h)), a = (n) => String(t.states[n]?.attributes.unit_of_measurement ?? "");
  return {
    battery: s.find((n) => n.startsWith("sensor.") && t.states[n].attributes.device_class === "battery"),
    progress: i("sensor.", ["cleaning_progress", "clean_percent"], /(progress|percent|progreso)/, (n) => a(n) === "%" && t.states[n].attributes.device_class !== "battery"),
    area: i("sensor.", ["cleaning_area"], /(cleaning_area|clean_area|area_limpi)/, (n) => !/total/.test(n)),
    time: i("sensor.", ["cleaning_time"], /(cleaning_time|clean_time|tiempo_de_limpieza)/, (n) => !/total/.test(n)),
    error: i("sensor.", ["vacuum_error"], /(vacuum_error|_error$)/, (n) => !/dock/.test(n)),
    room: i("sensor.", ["current_room"], /(current_room|habitacion_actual)/),
    mopIntensity: i("select.", ["mop_intensity"], /(mop_intensity|water|agua|intensidad)/),
    mopMode: i("select.", ["mop_mode"], /(mop_mode|modo_de_mopa|modo_mopa)/),
    map: i("select.", ["selected_map"], /(selected_map|mapa)/)
  };
}
const ks = (t, e) => {
  if (!e) return null;
  const s = parseFloat(t.states[e]?.state ?? "");
  return Number.isFinite(s) ? s : null;
};
function kr(t, e, s) {
  const i = ks(t, s.battery) ?? parseFloat(e.attributes.battery_level);
  return Number.isFinite(i) ? Math.round(i) : null;
}
const zi = (t, e) => {
  const s = ks(t, e.progress);
  return s == null ? null : Math.max(0, Math.min(100, Math.round(s)));
}, Sr = (t, e) => ks(t, e.area);
function Cr(t, e) {
  const s = ks(t, e.time);
  if (s == null) return null;
  const i = String(t.states[e.time]?.attributes.unit_of_measurement ?? "s");
  return Math.round(i === "h" ? s * 60 : i === "min" ? s : s / 60);
}
function Mr(t, e) {
  const s = e.room ? t.states[e.room]?.state : void 0;
  return s && !["unknown", "unavailable", "none", ""].includes(s) ? s : void 0;
}
function mn(t, e, s) {
  const i = s.error ? t.states[s.error]?.state : void 0;
  return i && !["none", "unknown", "unavailable", "ok", ""].includes(i) ? i : Ct(e) === "error" && String(e.attributes.error ?? e.attributes.status ?? "") || void 0;
}
const Ei = (t) => Array.isArray(t.attributes.fan_speed_list) ? t.attributes.fan_speed_list : [], rs = (t, e) => e && Array.isArray(t.states[e]?.attributes.options) ? t.states[e].attributes.options : [], bn = /* @__PURE__ */ new Map(), xn = /* @__PURE__ */ new Map();
function Ar(t, e, s) {
  const i = e.attributes.fan_speed;
  i && i !== "off" && bn.set(e.entity_id, i);
  const a = s.mopIntensity ? t.states[s.mopIntensity]?.state : void 0;
  a && a !== "off" && a !== "unavailable" && xn.set(e.entity_id, a);
}
function zr(t, e, s) {
  const i = Ei(e), a = rs(t, s.mopIntensity);
  if (!a.length) return { modes: [], current: "vacuum" };
  const n = i.includes("off"), l = [...a.includes("off") ? ["vacuum"] : [], ...n ? ["mop"] : [], "both"], c = e.attributes.fan_speed === "off", h = t.states[s.mopIntensity]?.state === "off", p = c && !h ? "mop" : h ? "vacuum" : "both";
  return { modes: l.length > 1 ? l : [], current: p };
}
const ra = (t, e) => e.find((s) => t.includes(s)) ?? t.find((s) => s !== "off");
async function Er(t, e, s, i) {
  const a = Ei(e), n = rs(t, s.mopIntensity), o = bn.get(e.entity_id) ?? ra(a, ["balanced", "standard", "medium"]), l = xn.get(e.entity_id) ?? ra(n, ["moderate", "medium", "standard", "mild"]), c = (p) => p && e.attributes.fan_speed !== p && t.callService("vacuum", "set_fan_speed", { fan_speed: p }, { entity_id: e.entity_id }), h = (p) => p && s.mopIntensity && t.states[s.mopIntensity]?.state !== p && t.callService("select", "select_option", { option: p }, { entity_id: s.mopIntensity });
  i === "vacuum" ? await Promise.all([h("off"), e.attributes.fan_speed === "off" ? c(o) : void 0]) : i === "mop" ? await Promise.all([c("off"), t.states[s.mopIntensity]?.state === "off" ? h(l) : void 0]) : await Promise.all([e.attributes.fan_speed === "off" ? c(o) : void 0, t.states[s.mopIntensity]?.state === "off" ? h(l) : void 0]);
}
const Jt = (t, e, s, i = {}) => t.callService("vacuum", s, i, { entity_id: e.entity_id }), ge = (t, e) => Jt(t, e, "start"), si = (t, e) => Jt(t, e, "pause"), ii = (t, e) => Jt(t, e, "return_to_base"), yn = (t, e) => Jt(t, e, "locate"), Tr = (t, e, s) => Jt(t, e, "set_fan_speed", { fan_speed: s }), la = (t, e, s) => t.callService("select", "select_option", { option: s }, { entity_id: e }), Dr = (t, e, s) => Jt(t, e, "send_command", { command: "app_segment_clean", params: [{ segments: s, repeat: 1 }] }), qe = /* @__PURE__ */ new Map();
function Or(t, e, s) {
  if (Oe(t, e.entity_id)?.platform !== "roborock") return Promise.resolve([]);
  const i = s.map ? t.states[s.map]?.state : void 0, a = `${e.entity_id}|${i ?? ""}`;
  return qe.has(a) || qe.set(
    a,
    t.callWS({
      type: "call_service",
      domain: "roborock",
      service: "get_maps",
      target: { entity_id: e.entity_id },
      return_response: !0
    }).then((n) => {
      const o = n.response?.[e.entity_id]?.maps ?? [], l = o.find((c) => c.name && c.name === i) ?? o[0];
      return Object.entries(l?.rooms ?? {}).map(([c, h]) => ({ id: Number(c), name: h })).filter((c) => Number.isFinite(c.id) && c.name);
    }).catch(() => (qe.delete(a), []))
  ), qe.get(a);
}
function Ti(t, e) {
  return fn(t, e).filter((s) => s.startsWith("button.") && !Oe(t, s)?.entity_category && !Oe(t, s)?.hidden);
}
function vn(t, e) {
  const s = Ti(t, e.entity), i = (e.routines ?? []).filter((a) => !s.includes(a) && t.states[a]);
  return [...s, ...i];
}
function ca(t, e) {
  const s = (e.routines ?? []).filter((i) => t.states[i]);
  return (s.length ? s : Ti(t, e.entity)).slice(0, 3);
}
const ai = (t, e) => e.startsWith("script.") ? t.callService("script", "turn_on", {}, { entity_id: e }) : t.callService("button", "press", {}, { entity_id: e });
function ls(t, e, s) {
  const i = String(t.states[e]?.attributes.friendly_name ?? e.split(".")[1].replace(/_/g, " "));
  return s && i.toLowerCase().startsWith(s.toLowerCase() + " ") ? i.slice(s.length + 1) : i;
}
const Pr = (t, e) => e.startsWith("script.") && /(aspir|robot|vacuum|roborock|limpi|freg|mop|clean)/i.test(e + " " + (t.states[e]?.attributes.friendly_name ?? "")), Ue = (t, e, s) => [0, 1, 2].map((i) => Math.round(t[i] * (1 - s) + e[i] * s)), he = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, jr = [34, 165, 135], Nr = [90, 157, 240], Lr = [224, 86, 75];
function wn(t) {
  const e = t === "cleaning" || t === "paused" ? jr : t === "returning" ? Nr : t === "error" ? Lr : null;
  return e ? `--bg:${he(Ue(e, [255, 255, 255], 0.86), 0.95)};--bg-solid:${he(Ue(e, [255, 255, 255], 0.86))};--fg:${he(Ue(e, [10, 10, 20], 0.8))};--fg2:${he(Ue(e, [20, 10, 30], 0.68))};--accent:${he(e)}` : "";
}
const Di = (t) => t === "cleaning" || t === "paused" || t === "returning" || t === "error";
function Ir(t, e) {
  const s = t >= 80 ? 4 : t >= 60 ? 3 : t >= 40 ? 2 : t >= 20 ? 1 : 0, i = t < 20 ? e ? "#a32d2d" : "#ff9b93" : t < 40 ? e ? "#854f0b" : "#ffd27a" : e ? "#0f6e56" : "#9ff0d0";
  return { bars: s, color: i };
}
function $n(t, e, s, i, a = 16) {
  const n = kr(t, e, s);
  if (n == null) return null;
  const o = Ct(e), { bars: l, color: c } = Ir(n, Di(o)), h = o === "docked" && n < 100;
  return { pct: n, color: c, icon: Ko(l, h, a), text: i ? `${n} %` : String(n) };
}
const Rr = {
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
function Ds(t, e) {
  const s = e.toLowerCase().replace(/[\s-]+/g, "_"), i = Rr[s];
  if (i) return i[P(t) === "es" ? 0 : 1];
  const a = e.replace(/_/g, " ");
  return a.charAt(0).toUpperCase() + a.slice(1);
}
const Hr = [
  [/(cocin|kitchen)/i, Yo],
  [/(dorm|bed|habitac|cuarto)/i, Vo],
  [/(salon|salón|living|comedor|sofa)/i, Go],
  [/(freg|mop|agua|water|fondo|deep)/i, Fo],
  [/(mascot|pet|pelo|perro|gato)/i, Xo]
], cs = (t, e = 18) => (Hr.find(([s]) => s.test(t))?.[1] ?? Bo)(e), Wr = {
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
function kn(t, e) {
  const s = Wr[e];
  if (s) return s[P(t) === "es" ? 0 : 1];
  const i = e.replace(/_/g, " ");
  return i.charAt(0).toUpperCase() + i.slice(1);
}
function Os(t, e) {
  return r(t, `vac_${e}`);
}
function Sn(t, e, s = !0) {
  const i = t.locale?.language ?? t.language, a = zi(t, e), n = Sr(t, e), o = Cr(t, e);
  return [
    s && a != null ? `${a} %` : "",
    n != null ? `${n.toLocaleString(i, { maximumFractionDigits: 1 })} m²` : "",
    o != null ? `${o} min` : ""
  ].filter(Boolean).join(" · ");
}
function Je(t, e, s, i = !1) {
  const a = Ct(e), n = Mr(t, s);
  if (i && a === "cleaning") {
    const o = zi(t, s);
    if (o != null) return `${o} %`;
  }
  if (a === "error" && !i) {
    const o = mn(t, e, s);
    return [Os(t, a), n ?? (o ? kn(t, o) : "")].filter(Boolean).join(" · ");
  }
  return a === "cleaning" && n && !i ? `${Os(t, a)} · ${n}` : Os(t, a);
}
var qr = Object.defineProperty, Ur = Object.getOwnPropertyDescriptor, te = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Ur(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && qr(e, s, a), a;
};
const Br = { light: "type_light", alarm: "type_alarm", charger: "ev_charger", climate: "type_climate", weather: "type_weather", vacuum: "type_vacuum" }, Fr = /(wallbox|charger|cargador|evse|easee|zappi|ocpp|pulsar|recarga|wall box|ev charg|copper|commander|go-e|keba|alfen|zaptec|myenergi|ohme|v2c|circontrol)/i;
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
    return this._sub === "entity" && this.draft.type === "climate" ? r(this.hass, "climate_entity") : this._sub ? r(this.hass, { device: "ch_device", entity: "light_entity", alarm: "type_alarm", weather: "type_weather", lock: "ch_lock_entity", status_entity: "ch_status", power_entity: "ch_power", energy_entity: "ch_energy" }[this._sub]) : this.options.mode === "edit" ? r(this.hass, "settings") : r(this.hass, Br[this.draft.type]);
  }
  renderHeaderStart() {
    return !this._sub && !(this.options.mode === "add" && this.options.onBack) ? g : d`<button class="hbtn" aria-label=${r(this.hass, "back")} @click=${this._back}>${Io()}</button>`;
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
      <span class="val">${e}${ss(!1, 16)}</span>
    </button>`;
  }
  _defaultName() {
    const t = this.draft.config;
    if (this.draft.type === "alarm") return r(this.hass, "alarm");
    const e = t.device ? this.hass.devices?.[t.device] : void 0;
    return e ? this._devName(e) : t.entity ? this._entName(t.entity) : "";
  }
  _main() {
    const t = this.hass, { type: e, config: s } = this.draft, i = s.device ?? this._deviceOf(s.entity), a = i ? t.devices?.[i] : void 0, n = d`<section>
      <h3>${r(t, "general")}</h3>
      <div class="list">
        ${e === "weather" ? this._weathers().length > 1 ? this._row(r(t, "type_weather"), s.entity ? this._entName(s.entity) : r(t, "choose"), "weather") : g : e === "alarm" ? this._alarms().length > 1 ? this._row(r(t, "type_alarm"), s.entity ? this._entName(s.entity) : r(t, "choose"), "alarm") : g : this._row(r(t, "ch_device"), a ? this._devName(a) : s.entity ? this._entName(s.entity) : r(t, "choose"), "device")}
        <label class="li">
          <span class="nm">${r(t, "name_label")}</span>
          <input class="txt" .value=${s.name ?? ""} placeholder=${this._defaultName()} @input=${(l) => this._set({ name: l.target.value })} />
        </label>
      </div>
    </section>`;
    let o = g;
    if (e === "light" && s.entity) {
      const l = i ? this._entitiesOf(i, (c) => c.startsWith("light.")) : [];
      o = d`<section>
        <h3>${r(t, "type_light")}</h3>
        <div class="list">
          ${l.length > 1 ? this._row(r(t, "light_entity"), this._entName(s.entity), "entity", s.entity) : g}
          <button class="li" role="switch" aria-checked=${s.use_light_color !== !1} @click=${() => this._set({ use_light_color: s.use_light_color === !1 ? void 0 : !1 })}>
            <span class="nm">${r(t, "use_light_color")}</span><span class="tog ${s.use_light_color !== !1 ? "on" : ""}"></span>
          </button>
        </div>
      </section>`;
    } else if (e === "weather" && s.entity) {
      const l = (c, h, p) => d`<span class="seg">${h.map(([u, _]) => d`<button class=${c === u ? "sel" : ""} @click=${() => p(u)}>${_}</button>`)}</span>`;
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
      const l = St(s.entity), c = r(t, l ? "raw_locked" : "raw_on"), h = r(t, l ? "raw_unlocked" : "raw_off"), p = cr(s.entity, !!s.invert) === "active", u = r(t, "ch_locked"), _ = r(t, "ch_unlocked"), x = Ci(t, { entity: s.entity }), f = (m, $) => s[m] === "none" ? r(t, "none") : s[m] ? this._entName(s[m]) : $ ? `${r(t, "auto")} · ${this._entName($)}` : r(t, "auto");
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
        <p class="explain">${r(t, "ch_explain", { a: c, la: p ? u : _, b: h, lb: p ? _ : u, press: p ? c : h })}</p>
        <section>
          <h3>${r(t, "ch_data")}</h3>
          <div class="list">
            ${this._row(r(t, "ch_status"), f("status_entity", x.status), "status_entity")}
            ${this._row(r(t, "ch_power"), f("power_entity", x.power), "power_entity")}
            ${this._row(r(t, "ch_energy"), f("energy_entity", x.energy), "energy_entity")}
            <label class="li">
              <span class="nm">${r(t, "ch_max")}</span>
              <input class="num" type="number" inputmode="decimal" min="1" max="50" step="0.1" placeholder="7,4"
                .value=${s.max_power != null ? String(s.max_power) : ""}
                @change=${(m) => {
        const $ = parseFloat(m.target.value.replace(",", "."));
        this._set({ max_power: Number.isFinite($) && $ > 0 ? $ : void 0 });
      }} />
            </label>
          </div>
        </section>`;
    }
    return d`
      <div class="scroll">
        ${n}
        ${o}
        ${this.options.mode === "edit" && this.options.onRemove ? d`<button class="remove" @click=${() => ze(t, {
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
    const e = this.hass, s = this.draft.config, i = e.states[s.entity], a = P(e), n = ye(i, s), o = (f) => f.toLocaleString(e.locale?.language ?? e.language ?? void 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), l = t ? this._entitiesOf(t, (f) => f.startsWith("climate.")) : [], c = lt(i), h = Ee(i).length > 0, p = an(i), u = (f, m) => {
      const $ = os(s, f);
      this._set({ mode_rules: { ...s.mode_rules ?? {}, [f]: { ...$, [m]: !$[m] } } });
    }, _ = (f, m) => {
      const $ = f === "min_temp" ? n.min : n.max;
      let w = Math.round(($ + m * n.step) / n.step) * n.step;
      w = f === "min_temp" ? Math.max(n.hwMin, Math.min(n.max - n.step, w)) : Math.min(n.hwMax, Math.max(n.min + n.step, w));
      const D = f === "min_temp" ? n.hwMin : n.hwMax;
      this._set({ [f]: w === D ? void 0 : w });
    }, x = (f) => d`<span class="mini">
      <button aria-label="−" @click=${() => _(f, -1)}>${xi(16)}</button>
      <b>${o(f === "min_temp" ? n.min : n.max)}°</b>
      <button aria-label="+" @click=${() => _(f, 1)}>${yi(16)}</button>
    </span>`;
    return d`
      ${l.length > 1 ? d`<section><h3>${r(e, "climate_entity")}</h3><div class="list">${this._row(r(e, "climate_entity"), this._entName(s.entity), "entity", s.entity)}</div></section>` : g}
      <section>
        <h3>${r(e, "temperature")}</h3>
        <div class="list">
          <div class="li"><span class="nm">${r(e, "min_temp_l")}<small>${r(e, "hw_min", { v: o(n.hwMin) })}</small></span>${x("min_temp")}</div>
          <div class="li"><span class="nm">${r(e, "max_temp_l")}<small>${r(e, "hw_max", { v: o(n.hwMax) })}</small></span>${x("max_temp")}</div>
          <div class="li"><span class="nm">${r(e, "temp_step_l")}</span>
            <span class="seg">${[0.5, 1].map((f) => d`<button class=${n.step === f ? "sel" : ""} @click=${() => this._set({ temp_step: f })}>${o(f)}°</button>`)}</span>
          </div>
        </div>
      </section>
      ${c.length ? d`<section>
            <h3>${r(e, "per_mode")}</h3>
            <div class="list">
              <table class="matrix">
                <tr><th>${r(e, "climate_mode")}</th><th>${r(e, "col_temp")}</th>${h ? d`<th>${r(e, "col_fan")}</th>` : g}</tr>
                ${c.map((f) => {
      const m = os(s, f);
      return d`<tr>
                    <td><span class="mname">${Wt(f, 18)}${X(a, f)}</span></td>
                    <td><button class="ck ${m.t ? "on" : ""}" role="checkbox" aria-checked=${m.t} @click=${() => u(f, "t")}>${m.t ? Xe(15) : g}</button></td>
                    ${h ? d`<td><button class="ck ${m.f ? "on" : ""}" role="checkbox" aria-checked=${m.f} @click=${() => u(f, "f")}>${m.f ? Xe(15) : g}</button></td>` : g}
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
    const t = this.hass, e = this.draft.config, s = e.name || this._entName(e.entity), i = (e.routines ?? []).filter((c) => t.states[c]), a = Ti(t, e.entity), n = Object.keys(t.states).filter((c) => (Pr(t, c) || i.includes(c)) && !a.includes(c) && this._visible(c)), o = (c) => {
      const h = i.includes(c) ? i.filter((p) => p !== c) : i.length < 3 ? [...i, c] : i;
      this._set({ routines: h.length ? h : void 0 });
    }, l = (c) => {
      const h = ls(t, c, s), p = i.indexOf(c), u = p < 0 && i.length >= 3;
      return d`<button class="li" role="checkbox" aria-checked=${p >= 0} ?disabled=${u} style=${u ? "opacity:.45" : ""} @click=${() => o(c)}>
        <span class="ic">${cs(h, 18)}</span>
        <span class="nm">${h}${c.startsWith("script.") ? d`<small>${c}</small>` : g}</span>
        <span class="num ${p >= 0 ? "on" : ""}">${p >= 0 ? p + 1 : g}</span>
      </button>`;
    };
    return d`<section>
        <h3>${r(t, "vac_card_routines")}</h3>
        ${a.length ? d`<div class="list">${a.map(l)}</div>` : d`<p class="note">${r(t, "vac_no_routines")}</p>`}
        <p class="note" style="margin-top:8px">${r(t, "vac_card_routines_sub")}</p>
      </section>
      ${n.length ? d`<section><h3>${r(t, "vac_scripts")}</h3><div class="list">${n.map(l)}</div></section>` : g}`;
  }
  // ---- Sub pages ---------------------------------------------------------------
  _opt(t, e, s, i, a) {
    return d`<button class="opt ${s ? "sel" : ""}" @click=${() => {
      i(), this._sub = void 0, this._q = "";
    }}>
      ${a ? d`<span class="ic">${a}</span>` : g}
      <span class="on">${t}${e ? d`<small>${e}</small>` : g}</span>
      <span class="ck">${Xe(18)}</span>
    </button>`;
  }
  _group(t, e) {
    return e.length ? d`<section><h3>${t}</h3><div class="list">${e}</div></section>` : g;
  }
  _byArea(t, e, s) {
    const i = /* @__PURE__ */ new Map();
    for (const a of t) {
      const n = this._area(e(a));
      i.has(n) || i.set(n, []), i.get(n).push(a);
    }
    return [...i].sort((a, n) => a[0].localeCompare(n[0])).map(([a, n]) => this._group(a, n.map(s)));
  }
  _devicePage() {
    const t = this.hass, { type: e, config: s } = this.draft, i = s.device ?? this._deviceOf(s.entity);
    if (e === "light") {
      const h = this._devices.map((f) => ({ d: f, lights: this._entitiesOf(f.id, (m) => m.startsWith("light.")) })).filter((f) => f.lights.length && this._match(this._devName(f.d), ...f.lights.map(this._entName))).sort((f, m) => this._devName(f.d).localeCompare(this._devName(m.d))), p = Object.keys(t.states).filter((f) => f.startsWith("light.") && this._visible(f) && !this._deviceOf(f) && this._match(this._entName(f), f)), u = p.filter((f) => ta(t.states[f])), _ = p.filter((f) => !ta(t.states[f])), x = (f) => this._set({ entity: f, device: void 0, name: this._entName(f) });
      return d`${this._search()}
        ${this._group(r(t, "light_groups"), u.map((f) => this._opt(this._entName(f), r(t, "group"), s.entity === f, () => x(f), U(!1, 20))))}
        ${this._byArea(h, (f) => f.d.area_id, (f) => this._opt(this._devName(f.d), f.lights.length > 1 ? `${f.lights.length} ${r(t, "lights_word")}` : f.d.model ?? void 0, i === f.d.id, () => this._set({ device: f.d.id, entity: f.lights[0], name: this._devName(f.d) }), U(!1, 20)))}
        ${this._group(r(t, "other_lights"), _.map((f) => this._opt(this._entName(f), f, s.entity === f, () => x(f), U(!1, 20))))}`;
    }
    if (e === "vacuum") {
      const h = this._devices.map((u) => ({ d: u, ents: this._entitiesOf(u.id, (_) => _.startsWith("vacuum.")) })).filter((u) => u.ents.length && this._match(this._devName(u.d), ...u.ents.map(this._entName))).sort((u, _) => this._devName(u.d).localeCompare(this._devName(_.d))), p = Object.keys(t.states).filter((u) => u.startsWith("vacuum.") && this._visible(u) && !this._deviceOf(u) && this._match(this._entName(u), u));
      return d`${this._search()}
        ${this._byArea(h, (u) => u.d.area_id, (u) => this._opt(this._devName(u.d), u.d.model ?? void 0, i === u.d.id, () => this._set({ device: u.d.id, entity: u.ents[0], name: this._devName(u.d), routines: void 0 }), Me(20)))}
        ${this._group(r(t, "other_vacuums"), p.map((u) => this._opt(this._entName(u), u, s.entity === u, () => this._set({ entity: u, device: void 0, name: this._entName(u), routines: void 0 }), Me(20))))}`;
    }
    if (e === "climate") {
      const h = this._devices.map((u) => ({ d: u, ents: this._entitiesOf(u.id, (_) => _.startsWith("climate.")) })).filter((u) => u.ents.length && this._match(this._devName(u.d), ...u.ents.map(this._entName))).sort((u, _) => this._devName(u.d).localeCompare(this._devName(_.d))), p = Object.keys(t.states).filter((u) => u.startsWith("climate.") && this._visible(u) && !this._deviceOf(u) && this._match(this._entName(u), u));
      return d`${this._search()}
        ${this._byArea(h, (u) => u.d.area_id, (u) => this._opt(this._devName(u.d), u.d.model ?? void 0, i === u.d.id, () => this._set({ device: u.d.id, entity: u.ents[0], name: this._devName(u.d) }), Ce(20)))}
        ${this._group(r(t, "other_climates"), p.map((u) => this._opt(this._entName(u), u, s.entity === u, () => this._set({ entity: u, device: void 0, name: this._entName(u) }), Ce(20))))}`;
    }
    const a = this._devices.map((h) => ({ d: h, locks: this._entitiesOf(h.id, (p) => Ts.includes(xe(p))) })).filter((h) => h.locks.length), n = (h) => Fr.test([this._devName(h.d), h.d.manufacturer, h.d.model].join(" ")), o = a.filter((h) => (this._allDevices || n(h)) && this._match(this._devName(h.d), h.d.manufacturer, h.d.model)), l = (h) => h.find((p) => /bloq|lock/i.test(p + this._entName(p))) ?? h.find((p) => /paus|stop/i.test(p + this._entName(p))) ?? h[0], c = (h) => {
      const p = l(h.locks);
      this._set({ device: h.d.id, entity: p, invert: aa(t, p) || void 0, name: this._devName(h.d), status_entity: void 0, power_entity: void 0, energy_entity: void 0 });
    };
    return d`${this._search()}
      ${this._byArea(o, (h) => h.d.area_id, (h) => this._opt(this._devName(h.d), h.locks.map(this._entName).join(" · "), i === h.d.id, () => c(h), vs(20)))}
      ${o.length ? g : d`<p class="note">${r(t, "no_chargers_found")}</p>`}
      ${this._allDevices ? g : d`<button class="more" @click=${() => this._allDevices = !0}>${r(t, "show_all_devices")}</button>`}`;
  }
  _search() {
    return d`<label class="search">${Ia(16)}<input type="search" placeholder=${r(this.hass, "search_entities")} .value=${this._q}
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
      return d`<div class="scroll">${this._group(r(t, "type_alarm"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, name: e.name || void 0 }), ys(20))))}
        ${l.length ? g : d`<p class="note">${r(t, "no_alarms_found")}</p>`}</div>`;
    }
    const i = e.device ?? this._deviceOf(e.entity);
    if (s === "entity") {
      const l = this.draft.type === "climate" ? "climate." : "light.", c = i ? this._entitiesOf(i, (h) => h.startsWith(l)) : [];
      return d`<div class="scroll">${this._group(r(t, "light_entity"), c.map((h) => this._opt(this._entName(h), h, e.entity === h, () => this._set({ entity: h }))))}</div>`;
    }
    if (s === "lock") {
      const l = i ? this._entitiesOf(i, (c) => Ts.includes(xe(c))) : Object.keys(t.states).filter((c) => Ts.includes(xe(c)) && this._visible(c) && this._match(this._entName(c), c));
      return d`<div class="scroll">${i ? g : this._search()}${this._group(r(t, "ch_lock_entity"), l.map((c) => this._opt(this._entName(c), c, e.entity === c, () => this._set({ entity: c, invert: aa(t, c) || void 0 }))))}</div>`;
    }
    const a = s === "status_entity" ? (l) => Za(t, l) : s === "power_entity" ? (l) => Ka(t, l) : (l) => Qa(t, l), n = new Set(e.entity ? Xa(t, e.entity) : []), o = Object.keys(t.states).filter((l) => this._visible(l) && a(l) && this._match(this._entName(l), l)).sort((l, c) => Number(n.has(c)) - Number(n.has(l)) || this._entName(l).localeCompare(this._entName(c))).slice(0, 60);
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
te([
  v({ attribute: !1 })
], ht.prototype, "draft", 2);
te([
  v({ attribute: !1 })
], ht.prototype, "options", 2);
te([
  b()
], ht.prototype, "_sub", 2);
te([
  b()
], ht.prototype, "_q", 2);
te([
  b()
], ht.prototype, "_allDevices", 2);
ht = te([
  z("terral-card-config")
], ht);
function Cn(t, e, s) {
  document.querySelector("terral-card-config")?.remove();
  const i = document.createElement("terral-card-config");
  return i.hass = t, i.draft = { ...e, config: { ...e.config } }, i.options = s, document.body.appendChild(i), i;
}
function ee(t, e, s, i) {
  const { type: a, view_layout: n, ...o } = i, l = n?.terral;
  Cn(e, { type: s, config: o, w: l?.w ?? 2, h: l?.h ?? 2 }, {
    mode: "edit",
    onSave: (c) => t.dispatchEvent(new CustomEvent("terral-card-config", { detail: { config: c.config, size: { w: c.w, h: c.h } }, bubbles: !0, composed: !0, cancelable: !0 })),
    onRemove: () => t.dispatchEvent(new CustomEvent("terral-card-remove", { bubbles: !0, composed: !0 }))
  });
}
function Yr(t) {
  return { type: t, config: {}, w: t === "light" ? 1 : 2, h: 2 };
}
function Vr(t) {
  for (const e of document.querySelectorAll("terral-card-config")) e.hass = t;
}
var Gr = Object.defineProperty, Xr = Object.getOwnPropertyDescriptor, it = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Xr(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Gr(e, s, a), a;
};
const Kr = "terral-home-light";
let Mt = class extends N {
  constructor() {
    super(...arguments), this.preview = !1, this._size = "s21", this._held = !1, this._openWindow = () => {
      if (!this.hass || !this._config) return;
      const t = this._config.favorite_colors?.map((e) => Array.isArray(e) ? { rgb: e } : e);
      nr(this.hass, {
        entity: this._config.entity,
        name: this._config.name,
        useLightColor: this._config.use_light_color !== !1,
        favorites: t,
        groupByArea: this._config.group_by_area,
        onSettings: () => this.hass && this._config && ee(this, this.hass, "light", this._config)
      });
    }, this._toggle = (t) => {
      t.stopPropagation();
      const e = this._entity;
      e && this.hass && !wt(e) && be(this.hass, e);
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
    return t ? Qe(t) === "temperature" || Qe(t) === "color" || J(t).length > 0 ? e : e.slice(0, 3) : e;
  }
  static getStubConfig(t, e = [], s = []) {
    return { entity: [...e, ...s].find((a) => a.startsWith("light.")) ?? Object.keys(t?.states ?? {}).find((a) => a.startsWith("light.")) ?? "light.example" };
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
    return !e || !this.hass || !this._config || e.locale?.language !== this.hass.locale?.language ? !0 : [this._config.entity, ...J(this.hass.states[this._config.entity] ?? { attributes: {} })].some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    t.has("hass") && this.hass && or(this.hass);
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
    const i = J(t);
    if (i.length) {
      const l = i.filter((p) => E(s.states[p])).length;
      if (!l) return `${i.length} ${r(s, "lights_off")}`;
      const c = yt(t), h = l === i.length && e === "onoff" ? `${r(s, "all_lit")} (${l})` : `${l} ${r(s, "of")} ${i.length} ${r(s, "lit")}`;
      return c != null && this._size !== "s11" ? `${h} · ${c} %` : h;
    }
    if (!E(t)) return r(s, "off");
    const a = [], n = yt(t);
    n != null && a.push(`${n} %`);
    const o = Bt(t);
    if (o) {
      const l = Ks(o, P(s));
      l && a.push(l);
    } else if (e === "temperature" || e === "color") {
      const l = Ae(t);
      if (l && t.attributes.color_mode === "color_temp") {
        const c = [...Gs].sort((h, p) => Math.abs(h.kelvin - l) - Math.abs(p.kelvin - l))[0];
        a.push(r(s, c.key));
      }
    }
    return a.join(" · ") || r(s, "on");
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this._entity;
    if (!t)
      return d`<div class="card off missing"><span>${r(this.hass, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const e = Qe(t), s = E(t), i = wt(t), a = J(t), n = Ya(t, this._config.use_light_color !== !1), o = s ? `--bg:${n.bg};--fg:${n.fg};--fg2:${n.fg2};--accent:${n.accent};--fill:${n.fill}` : "";
    let l = this._size;
    l === "s42" && !this.getTerralSizes().some((p) => p.h === 4) && (l = "s22");
    const c = d`<button
      class="icon"
      aria-label="${s ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${this._name(t)}"
      ?disabled=${i}
      @click=${this._toggle}
    >
      ${U(s, l === "s11" ? 20 : 32)}
      ${a.length && s ? d`<span class="badge">${a.filter((p) => E(this.hass.states[p])).length}</span>` : g}
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
    if (e !== "color" && e !== "temperature" || s === "s42" && !J(t).length) return g;
    const i = Bt(t), a = i ? Ks(i, P(this.hass)) ?? "" : "", n = e === "color" ? `background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a);box-shadow:inset 0 0 0 6px ${i ? V(i) : "#fff"}` : "background:linear-gradient(135deg,#ffb45c,#fff1dc 50%,#a9cdff)";
    return d`<button class="pb" @click=${(o) => {
      o.stopPropagation(), this._openWindow();
    }}><i style=${n}></i>${a || (e === "color" ? r(this.hass, "more_colors") : r(this.hass, "temperature"))}</button>`;
  }
  _brightness(t, e = !1) {
    return d`<terral-slider
      class="bar ${e ? "big" : ""}"
      .value=${yt(t) ?? 0}
      .label=${r(this.hass, "brightness")}
      @value-changed=${(s) => Xs(this.hass, t.entity_id, s.detail.value)}
    >${La(18)}</terral-slider>`;
  }
  _body(t, e, s) {
    const i = J(t);
    if (s === "s42" && i.length) {
      const n = [...i].sort((h, p) => Number(E(this.hass.states[p])) - Number(E(this.hass.states[h]))), o = e === "onoff" ? 5 : 4, l = n.length > o ? n.slice(0, o - 1) : n, c = n.length - l.length;
      return d`
        ${e !== "onoff" ? this._brightness(t) : g}
        <div class="members">
          ${l.map((h) => {
        const p = this.hass.states[h], u = E(p), _ = p ? this.hass.formatEntityName?.(p) ?? p.attributes.friendly_name ?? h : h;
        return d`<div class="mr">
              <button class="mi ${u ? "lit" : ""}" ?disabled=${wt(p)} aria-label="${u ? r(this.hass, "turn_off") : r(this.hass, "turn_on")} ${_}"
                @click=${(x) => {
          x.stopPropagation(), p && be(this.hass, p);
        }}>${U(u, 16)}</button>
              <button class="mt" @click=${this._openWindow}><span>${_}</span><small>${p ? E(p) ? yt(p) != null ? `${yt(p)} %` : r(this.hass, "on") : r(this.hass, "off") : "—"}</small></button>
            </div>`;
      })}
          ${c > 0 ? d`<button class="morebtn" @click=${this._openWindow}>+ ${c} ${r(this.hass, "more")}</button>` : g}
        </div>
      `;
    }
    if (e === "onoff")
      return i.length ? d`<div class="tags">
          ${i.slice(0, 4).map((n) => {
        const o = this.hass.states[n], l = o ? this.hass.formatEntityName?.(o) ?? o.attributes.friendly_name ?? n : n;
        return d`<span class="tag"><i class=${E(o) ? "lit" : ""}></i>${l}</span>`;
      })}
        </div>` : d`<div class="since">
        <span><b>${E(t) ? r(this.hass, "on") : r(this.hass, "off")}</b>${new Date(t.last_changed).toLocaleTimeString(this.hass?.locale?.language, { hour: "2-digit", minute: "2-digit" })}</span>
      </div>`;
    if (s !== "s42") return this._brightness(t);
    if (e === "temperature") {
      const n = t.attributes.min_color_temp_kelvin ?? 2e3, o = t.attributes.max_color_temp_kelvin ?? 6500;
      return d`
        <p class="lbl">${r(this.hass, "brightness")}</p>
        ${this._brightness(t, !0)}
        <p class="lbl">${r(this.hass, "temperature")}</p>
        <terral-slider class="temp" mode="thumb" .min=${n} .max=${o} .value=${Ae(t) ?? 3500}
          .label=${r(this.hass, "temperature")}
          @value-changed=${(l) => as(this.hass, t, l.detail.value)}></terral-slider>
        <div class="chips">
          ${Gs.map((l) => d`<button class="chip" style="background:${l.css}" @click=${(c) => {
        c.stopPropagation(), as(this.hass, t, l.kelvin);
      }}>${r(this.hass, l.key)}</button>`)}
        </div>
      `;
    }
    const a = this._config?.favorite_colors?.map((n) => Array.isArray(n) ? n : n.rgb) ?? void 0;
    return d`
      <p class="lbl">${r(this.hass, "brightness")}</p>
      ${this._brightness(t, !0)}
      <p class="lbl">${r(this.hass, "favorites")}</p>
      <terral-light-favs .hass=${this.hass} .entity=${t} .colors=${a}></terral-light-favs>
      <button class="pb wide" @click=${(n) => {
      n.stopPropagation(), this._openWindow();
    }}><i style="background:conic-gradient(#ff5a5a,#ffd35a,#6ee07a,#5ac8fa,#8a6cff,#ff5ac8,#ff5a5a)"></i>${r(this.hass, "more_colors")}</button>
    `;
  }
};
Mt.styles = A`
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
it([
  v({ attribute: !1 })
], Mt.prototype, "hass", 2);
it([
  v({ type: Boolean })
], Mt.prototype, "preview", 2);
it([
  b()
], Mt.prototype, "_config", 2);
it([
  b()
], Mt.prototype, "_size", 2);
Mt = it([
  z(Kr)
], Mt);
let Yt = class extends N {
  render() {
    if (!this.hass || !this.entity) return g;
    const t = P(this.hass), e = this.colors?.length ? this.colors.map((i) => ({ rgb: i, name: V(i) })) : Qr[t] ??= Zr(t), s = Bt(this.entity);
    return e.slice(0, 6).map(
      (i) => d`<button
        class=${s && V(s) === V(i.rgb) ? "sel" : ""}
        style="background:${V(i.rgb)}"
        aria-label=${i.name}
        @click=${(a) => {
        a.stopPropagation(), this.hass.callService("light", "turn_on", { rgb_color: i.rgb }, { entity_id: this.entity.entity_id });
      }}
      ></button>`
    );
  }
};
Yt.styles = A`
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
it([
  v({ attribute: !1 })
], Yt.prototype, "hass", 2);
it([
  v({ attribute: !1 })
], Yt.prototype, "entity", 2);
it([
  v({ attribute: !1 })
], Yt.prototype, "colors", 2);
Yt = it([
  z("terral-light-favs")
], Yt);
const Qr = {}, Zr = (t) => vi.map((e) => ({ rgb: e.rgb, name: e.name[t] })), Jr = { home: 1, away: 2, night: 4, custom: 16, vacation: 32 }, Mn = ["away", "home", "night", "vacation", "custom"], tl = ["away", "home", "vacation"], ni = {
  away: [255, 122, 107],
  home: [90, 200, 250],
  night: [130, 140, 255],
  vacation: [195, 155, 255],
  custom: [255, 190, 90]
};
function At(t) {
  const e = t.state;
  return e === "disarmed" || e === "disarming" ? "disarmed" : e === "arming" ? "arming" : e === "pending" ? "pending" : e === "triggered" ? "triggered" : e.startsWith("armed_") ? "armed" : "unavailable";
}
const Ps = (t) => {
  if (typeof t != "string") return;
  const e = t.replace(/^armed_/, "");
  return e === "custom_bypass" ? "custom" : Mn.includes(e) ? e : void 0;
};
function Oi(t) {
  return Ps(t.state) ?? Ps(t.attributes.arm_mode) ?? Ps(t.attributes.next_state);
}
function An(t) {
  const e = Number(t.attributes.supported_features ?? 0);
  return e ? Mn.filter((s) => e & Jr[s]) : ["away", "home"];
}
function ds(t, e = Date.now()) {
  const s = Number(t.attributes.delay);
  if (!s || !(t.state === "arming" || t.state === "pending")) return null;
  const i = new Date(t.last_changed).getTime() + s * 1e3;
  return Math.max(0, (i - e) / 1e3);
}
function el(t) {
  const e = Number(t.attributes.delay);
  return e > 0 ? e : null;
}
const Pi = (t) => {
  const e = t.attributes.code_format;
  return e === "number" || e === "text" ? e : null;
}, sl = (t) => Pi(t) != null && t.attributes.code_arm_required !== !1;
function hs(t) {
  const e = t.attributes.open_sensors;
  return e ? Array.isArray(e) ? e.map(String) : typeof e == "object" ? Object.keys(e) : [] : [];
}
function il(t) {
  const e = t.attributes.bypassed_sensors;
  return Array.isArray(e) ? e.map(String) : [];
}
const oi = (t, e) => {
  const s = t.states[e];
  return s && (t.formatEntityName?.(s) || s.attributes.friendly_name) || e;
};
function al(t, e) {
  const s = t.entities?.[e.entity_id];
  return s?.platform ? s.platform === "alarmo" : "arm_mode" in e.attributes || "next_state" in e.attributes;
}
function nl(t, e, s, i, a = !1) {
  if (al(t, e)) {
    const o = { entity_id: e.entity_id, mode: s };
    return i && (o.code = i), a && (o.force = !0), t.callService("alarmo", "arm", o);
  }
  const n = `alarm_arm_${s === "custom" ? "custom_bypass" : s}`;
  return t.callService("alarm_control_panel", n, i ? { code: i } : {}, { entity_id: e.entity_id });
}
function ol(t, e, s) {
  return t.callService("alarm_control_panel", "alarm_disarm", s ? { code: s } : {}, { entity_id: e.entity_id });
}
function rl(t, e) {
  return t.callService("alarmo", "skip_delay", { entity_id: e.entity_id });
}
function zn(t, e = 2500) {
  return new Promise((s) => {
    const i = Date.now(), a = () => {
      if (t()) return s(!0);
      if (Date.now() - i > e) return s(!1);
      setTimeout(a, 150);
    };
    a();
  });
}
function ll(t, e, s, i, a, n = {}) {
  const o = async (h) => {
    const p = t(), u = p?.states[e];
    if (!p || !u) return { result: "wrong" };
    try {
      await nl(p, u, s, h, n.force);
    } catch {
      return { result: "wrong", code: h };
    }
    const _ = () => t()?.states[e];
    if (await zn(() => {
      const m = _();
      return !!m && At(m) !== "disarmed";
    })) return { result: "armed", code: h };
    const f = _();
    return { result: f && hs(f).length ? "refused" : "wrong", code: h };
  }, l = t()?.states[e];
  if (!l) return;
  const c = Pi(l);
  if (n.code != null || !c || !sl(l)) {
    o(n.code).then(a);
    return;
  }
  i(c, async (h) => {
    const p = await o(h);
    return p.result === "wrong" ? !1 : (a(p), !0);
  });
}
function cl(t, e, s) {
  const i = async (o) => {
    const l = t(), c = l?.states[e];
    if (!l || !c) return !1;
    try {
      await ol(l, c, o);
    } catch {
      return !1;
    }
    return zn(() => {
      const h = t()?.states[e];
      return !!h && At(h) === "disarmed";
    });
  }, a = t()?.states[e];
  if (!a) return;
  const n = Pi(a);
  if (!n) {
    i();
    return;
  }
  s(n, i);
}
const js = (t, e, s) => t.map((i, a) => Math.round(i + (e[a] - i) * s)), Be = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`;
function dl(t) {
  const e = ni[t];
  return {
    bg: Be(js(e, [255, 255, 255], 0.84), 0.95),
    fg: Be(js(e, [10, 10, 20], 0.82)),
    fg2: Be(js(e, [20, 10, 30], 0.72)),
    accent: Be(e)
  };
}
const da = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit", minute: "2-digit" });
var hl = Object.defineProperty, pl = Object.getOwnPropertyDescriptor, se = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? pl(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && hl(e, s, a), a;
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
        <button class="key fn" aria-label=${r(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${Po(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${r(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${Xe(26)}</button>
      </div>
    `;
  }
};
pt.styles = [
  S.styles,
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
se([
  v()
], pt.prototype, "format", 2);
se([
  v({ attribute: !1 })
], pt.prototype, "submit", 2);
se([
  b()
], pt.prototype, "_code", 2);
se([
  b()
], pt.prototype, "_error", 2);
se([
  b()
], pt.prototype, "_busy", 2);
pt = se([
  z("terral-code-sheet")
], pt);
function En(t, e, s) {
  const i = document.createElement("terral-code-sheet");
  return i.hass = t, i.format = e, i.submit = s, document.body.appendChild(i), i;
}
const Pe = /* @__PURE__ */ new Map(), ul = 6e4, je = "terral-alarm-refusal", Tn = () => window.dispatchEvent(new Event(je));
function ps(t) {
  const e = Pe.get(t.entity_id);
  if (e) {
    if (Date.now() - e.at > ul || At(t) !== "disarmed") {
      Pe.delete(t.entity_id);
      return;
    }
    return e;
  }
}
function ji(t) {
  Pe.delete(t) && Tn();
}
function us(t, e, s, i = !1) {
  const a = t();
  if (!a) return;
  const n = Pe.get(e), o = i ? { force: !0, code: n?.code } : {};
  ji(e), ll(
    t,
    e,
    s,
    (l, c) => En(a, l, c),
    (l) => {
      l.result === "refused" && (Pe.set(e, { mode: s, code: l.code, at: Date.now() }), Tn());
    },
    // Forcing reuses the code typed a moment ago; without one, it asks again.
    o
  );
}
function we(t, e) {
  const s = t();
  s && cl(t, e, (i, a) => En(s, i, a));
}
const gl = (t) => t.charAt(0).toLowerCase() + t.slice(1), gs = (t, e) => r(t, `mode_${e}`);
function Dn(t, e, s) {
  const i = At(e), a = Oi(e), n = a ? gl(gs(t, a)) : "";
  if (ps(e)) {
    const l = hs(e);
    return {
      title: r(t, "alarm_failed"),
      status: l.length > 1 ? r(t, "alarm_open_n", { n: l.length }) : r(t, "alarm_open", { name: l[0] ? oi(t, l[0]) : "?" })
    };
  }
  switch (i) {
    case "disarmed":
      return { title: s, status: r(t, "alarm_disarmed") };
    case "arming":
      return { title: s, status: `${r(t, "alarm_arming", { mode: n })} · ${r(t, "alarm_leave")}` };
    case "armed":
      return { title: s, status: `${r(t, "alarm_armed", { mode: n })} · ${r(t, "alarm_since", { t: da(t, e.last_changed) })}` };
    case "pending":
      return { title: r(t, "alarm_pending"), status: r(t, "alarm_pending_sub") };
    case "triggered": {
      const l = hs(e), c = l.length ? oi(t, l[0]) + (l.length > 1 ? ` +${l.length - 1}` : "") : s;
      return { title: r(t, "alarm_triggered"), status: `${c} · ${da(t, e.last_changed)}` };
    }
    default:
      return { title: s, status: r(t, "unavailable") };
  }
}
const On = (t) => {
  const e = ds(t);
  return e == null ? null : Math.ceil(e);
};
var fl = Object.defineProperty, _l = Object.getOwnPropertyDescriptor, Ie = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? _l(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && fl(e, s, a), a;
};
const Pn = (t, e = 20) => ({ away: Eo, home: is, night: To, vacation: Do, custom: Oo })[t](e);
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
    }}>${K(19)}</button>` : g;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(je, this._refresh), this._timer = window.setInterval(() => {
      const t = this.hass?.states[this.entityId];
      t && ds(t) != null && this._tick++;
    }, 250);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(je, this._refresh), clearInterval(this._timer);
  }
  _sensorList(t, e) {
    return e.length ? d`<section>
      <h3>${t}</h3>
      <div class="list">${e.map((s) => d`<div class="row static"><span class="ic">${Ys(18)}</span><span class="nm">${oi(this.hass, s)}</span></div>`)}</div>
    </section>` : g;
  }
  renderContent() {
    const t = this.hass, e = t?.states[this.entityId];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    this._tick;
    const s = this.entityId, i = At(e), a = Oi(e), n = ps(e), o = On(e), { title: l, status: c } = Dn(t, e, this.name), h = i === "armed" && a ? `rgb(${ni[a].join(",")})` : i === "arming" ? "#ffb45c" : i === "pending" || i === "triggered" ? "#ff453a" : "rgba(255,255,255,.16)", p = n || i === "pending" || i === "triggered" ? Ys(30) : i === "armed" ? Ha(32) : ys(32), u = "arm_mode" in e.attributes || "next_state" in e.attributes;
    let _ = g;
    n ? _ = d`<div class="btns">
        <button class="big solid" @click=${() => us(this._getHass, s, n.mode, !0)}>${Ut()}<span>${r(t, "arm_anyway")}</span></button>
        <button class="big" @click=${() => ji(s)}><span>${r(t, "cancel")}</span></button>
      </div>` : i === "disarmed" ? _ = d`<section>
        <h3>${r(t, "arm_options")}</h3>
        <div class="list">
          ${An(e).map(
      (f) => d`<button class="row" @click=${() => us(this._getHass, s, f)}>
              <span class="ic" style="color:rgb(${ni[f].join(",")})">${Pn(f)}</span><span class="nm">${gs(t, f)}</span>
            </button>`
    )}
        </div>
      </section>` : i === "arming" ? _ = d`<div class="btns">
        <button class="big" @click=${() => we(this._getHass, s)}>${xs(20)}<span>${r(t, "cancel")}</span></button>
        ${u ? d`<button class="big" @click=${() => rl(t, e)}>${jo()}<span>${r(t, "skip_delay")}</span></button>` : g}
      </div>` : i !== "unavailable" && (_ = d`<div class="btns"><button class="big solid" @click=${() => we(this._getHass, s)}>${Se()}<span>${r(t, "disarm")}</span></button></div>`);
    const x = e.attributes.changed_by;
    return d`
      <div class="status st-${n ? "failed" : i}" style="--ac:${h}">
        <span class="sic">${p}</span>
        <div class="txt"><strong>${l}</strong><span>${c}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : g}
      </div>
      <div class="scroll">
        ${_}
        ${this._sensorList(r(t, "open_sensors"), hs(e))}
        ${i === "armed" ? this._sensorList(r(t, "bypassed_sensors"), il(e)) : g}
        <p class="foot">${r(t, "changed_by")}: ${x ? `${x} · ` : ""}${ja(t, e.last_changed)}</p>
      </div>
    `;
  }
};
zt.styles = [
  S.styles,
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
Ie([
  v()
], zt.prototype, "entityId", 2);
Ie([
  v()
], zt.prototype, "name", 2);
Ie([
  v({ attribute: !1 })
], zt.prototype, "onSettings", 2);
Ie([
  b()
], zt.prototype, "_tick", 2);
zt = Ie([
  z("terral-alarm-dialog")
], zt);
function ml(t, e, s, i) {
  document.querySelector("terral-alarm-dialog")?.remove();
  const a = document.createElement("terral-alarm-dialog");
  return a.hass = t, a.entityId = e, a.name = s, a.onSettings = i, document.body.appendChild(a), a;
}
function bl(t) {
  for (const e of document.querySelectorAll("terral-alarm-dialog")) e.hass = t;
  for (const e of document.querySelectorAll("terral-code-sheet")) e.hass = t;
}
var xl = Object.defineProperty, yl = Object.getOwnPropertyDescriptor, Ss = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? yl(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && xl(e, s, a), a;
};
const vl = "terral-home-alarm";
let Vt = class extends N {
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
    super.connectedCallback(), window.addEventListener(je, this._refresh);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(je, this._refresh), clearInterval(this._timer), this._timer = void 0, this._cancelHold();
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
    t.has("hass") && this.hass && bl(this.hass);
    const e = this._entity, s = !!e && ds(e) != null;
    s && !this._timer && (this._timer = window.setInterval(() => this._tick++, 250)), !s && this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _openWindow() {
    this.hass && this._config && ml(this.hass, this._config.entity, this._name, () => this.hass && this._config && ee(this, this.hass, "alarm", this._config));
  }
  _act(t) {
    return (e) => {
      e.stopPropagation(), t();
    };
  }
  // ---- Render ---------------------------------------------------------------
  _row(t) {
    const e = t.entity_id, s = At(t), i = ps(t);
    if (i)
      return d`<div class="row">
        <button class="pb solid grow" @click=${this._act(() => us(this._getHass, e, i.mode, !0))}>${Ut()}<span>${r(this.hass, "arm_anyway")}</span></button>
        <button class="pb" @click=${this._act(() => ji(e))}><span>${r(this.hass, "cancel")}</span></button>
      </div>`;
    switch (s) {
      case "disarmed": {
        const a = An(t).filter((n) => tl.includes(n));
        return d`<div class="row ${a.length > 2 ? "three" : ""}">
          ${a.map(
          (n) => d`<button class="pb" aria-label=${r(this.hass, "arm_mode", { mode: gs(this.hass, n) })} @click=${this._act(() => us(this._getHass, e, n))}>
              ${Pn(n)}<span>${gs(this.hass, n)}</span>
            </button>`
        )}
        </div>`;
      }
      case "arming":
        return d`<div class="row"><button class="pb" @click=${this._act(() => we(this._getHass, e))}>${xs(20)}<span>${r(this.hass, "cancel")}</span></button></div>`;
      case "armed":
        return d`<div class="row"><button class="pb" @click=${this._act(() => we(this._getHass, e))}>${Se()}<span>${r(this.hass, "disarm")}</span></button></div>`;
      case "pending":
      case "triggered":
        return d`<div class="row"><button class="pb solid" @click=${this._act(() => we(this._getHass, e))}>${Se()}<span>${r(this.hass, "disarm")}</span></button></div>`;
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
    const e = At(t), s = !!ps(t), i = Oi(t), a = e === "armed" && !!i, n = a ? dl(i) : void 0, o = On(t), l = el(t), c = ds(t), h = c != null && l ? c / l : 0, p = `${n ? `--bg:${n.bg};--fg:${n.fg};--fg2:${n.fg2};--accent:${n.accent};` : ""}--p:${h}`, u = s || e === "pending" || e === "triggered" ? Ys(28) : a ? Ha(30) : ys(30), { title: _, status: x } = Dn(this.hass, t, this._name);
    return d`<div
      class="card ${a ? "on" : "off"} st-${s ? "failed" : e}"
      style=${p}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${_}, ${x}`}
      @click=${this._cardClick}
      @keydown=${(m) => {
      (m.key === "Enter" || m.key === " ") && m.target === m.currentTarget && (m.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(m) => m.preventDefault()}
    >
      <div class="head">
        <span class="icon">${u}</span>
        <div class="text"><span class="name">${_}</span><span class="state">${x}</span></div>
        ${o != null ? d`<span class="secs">${o}</span>` : g}
      </div>
      ${this._row(t)}
    </div>`;
  }
};
Vt.styles = A`
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
Ss([
  v({ attribute: !1 })
], Vt.prototype, "hass", 2);
Ss([
  b()
], Vt.prototype, "_config", 2);
Ss([
  b()
], Vt.prototype, "_tick", 2);
Vt = Ss([
  z(vl)
], Vt);
const Fe = (t, e, s) => t.map((i, a) => Math.round(i + (e[a] - i) * s)), Lt = (t, e) => e == null ? `rgb(${t.join(",")})` : `rgba(${t.join(",")},${e})`, Ns = [52, 199, 123], wl = [255, 149, 0], ha = [90, 200, 250], Ls = "#b3261e", $l = "#3a3d4a", pa = (t, e, s, i, a) => `--bg:${Lt(Fe(t, [255, 255, 255], e), 0.95)};--bg-solid:${Lt(Fe(t, [255, 255, 255], e))};--fg:${Lt(Fe(i, [10, 10, 20], 0.8))};--fg2:${Lt(Fe(i, [20, 10, 30], 0.7))};--accent:${Lt(s)};--lk:${a}`;
function fe(t, e) {
  const s = t.states[e.entity], i = Ci(t, e), a = dr(t, i), n = ki(t, i.power);
  if (!s || s.state === "unavailable" || s.state === "unknown")
    return { look: "unavailable", locked: !1, car: a, ids: i, kw: n, style: "", tinted: !1 };
  const o = lr(s, !!e.invert);
  let l;
  o ? l = a === "connected" || a === "charging" ? "warn" : "locked" : a === "charging" ? l = "charging" : a === "connected" ? l = "ready" : l = "none";
  const c = l === "charging" ? pa(Ns, 0.84, Ns, Ns, Ls) : l === "warn" ? `--bg:rgba(255,247,232,.95);--bg-solid:#fff7e8;--fg:#3a2a10;--fg2:#6b5428;--accent:${Lt(wl)};--lk:${Ls}` : l === "ready" ? pa(ha, 0.8, ha, [30, 110, 160], Ls) : `--lk:${$l}`;
  return { look: l, locked: o, car: a, ids: i, kw: n, style: c, tinted: l === "charging" || l === "warn" || l === "ready" };
}
function _e(t, e, s) {
  const i = e.kw != null ? `${G(t, e.kw)} kW` : "";
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
var kl = Object.defineProperty, Sl = Object.getOwnPropertyDescriptor, ie = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Sl(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && kl(e, s, a), a;
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
    }}>${K(19)}</button>` : g;
  }
  updated() {
    if (!this.hass) return;
    const t = Ci(this.hass, this.config).power;
    t && t !== this._histFor && (this._histFor = t, this._load(t));
  }
  async _load(t) {
    try {
      const e = Date.now(), s = await Ja(this.hass, t, new Date(e - 7 * 864e5));
      this._sessions = tn(s, e), this._histError = !1;
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
    const s = fe(t, this.config), i = Ga(t, s.ids.energy), a = this._sessions?.find((f) => f.live), n = s.look === "charging" && i != null ? r(t, "this_charge", { kwh: `${G(t, i)} kWh`, time: a ? Zs(Date.now() - a.start) : "" }).replace(/ · $/, "") : i != null ? `${r(t, "last_session")}: ${G(t, i)} kWh` : "", o = this._sessions ? en(this._sessions, 7) : void 0, l = o ? Math.max(...o.map((f) => f.kwh), 0.1) : 1, c = o?.reduce((f, m) => f + m.kwh, 0) ?? 0, h = this._sessions?.length ?? 0, p = [...this._sessions ?? []].reverse().slice(0, 5), u = t.locale?.language ?? t.language ?? void 0, _ = (f, m) => m === 6 ? u?.startsWith("es") ? "Hoy" : "Today" : f.toLocaleDateString(u, { weekday: "narrow" }), x = (f) => {
      const m = new Date(f), $ = /* @__PURE__ */ new Date(), w = new Date($.getFullYear(), $.getMonth(), $.getDate() - 1), D = m.toLocaleTimeString(u, { hour: "2-digit", minute: "2-digit" }), F = u?.startsWith("es");
      if (m.toDateString() === $.toDateString()) return `${F ? "Hoy" : "Today"} · ${D}`;
      if (m.toDateString() === w.toDateString()) return `${F ? "Ayer" : "Yesterday"} · ${D}`;
      const Z = m.toLocaleDateString(u, { weekday: "long", day: "numeric" });
      return `${Z.charAt(0).toUpperCase()}${Z.slice(1)} · ${D}`;
    };
    return d`
      <div class="status ${s.tinted ? "on" : ""}" style=${s.style}>
        <button class="icon" aria-label=${s.locked ? r(t, "unlock") : r(t, "lock")} @click=${() => Qs(t, e, !s.locked, !!this.config.invert)}>
          ${vs(32)}${s.locked ? d`<span class="lk">${Ut(14)}</span>` : g}
        </button>
        <div class="txt"><strong>${_e(t, s, !1)}</strong>${n ? d`<span>${n}</span>` : g}</div>
      </div>
      ${s.look !== "unavailable" ? d`<button class="big ${s.locked ? "solid" : ""}" @click=${() => Qs(t, e, !s.locked, !!this.config.invert)}>
            ${s.locked ? Se() : Ut()}<span>${s.locked ? r(t, "unlock") : r(t, "lock")}</span>
          </button>` : g}
      <div class="scroll">
        ${s.ids.power ? d`
              <section>
                <h3>${r(t, "last_7_days")}</h3>
                <div class="list">
                  ${this._histError ? d`<p class="empty">${r(t, "history_unavailable")}</p>` : d`<div class="week">
                          ${(o ?? Array.from({ length: 7 }, (f, m) => ({ day: new Date(Date.now() - (6 - m) * 864e5), kwh: 0 }))).map(
      (f, m) => d`<div>
                              <i class=${m === 6 ? "today" : f.kwh ? "" : "zero"} style="height:${f.kwh ? Math.max(6, f.kwh / l * 62) : 3}px"></i>
                              <span>${_(f.day, m)}</span>
                            </div>`
    )}
                        </div>
                        <div class="sum"><span>${r(t, "week_total")} <b>${G(t, c)} kWh</b></span><span>${h} ${u?.startsWith("es") ? h === 1 ? "carga" : "cargas" : h === 1 ? "charge" : "charges"}</span></div>`}
                </div>
              </section>
              <section>
                <h3>${r(t, "recent_charges")}</h3>
                <div class="list">
                  ${!this._sessions && !this._histError ? d`<p class="empty">…</p>` : g}
                  ${this._sessions && !p.length ? d`<p class="empty">${r(t, "no_history")}</p>` : g}
                  ${p.map(
      (f) => d`<div class="sess">
                      <span class="dot">${No()}</span>
                      <span class="nm">
                        <span>${x(f.start)}${f.live ? d`<em>${r(t, "charging_now")}</em>` : g}</span>
                        <small>${f.live ? `${r(t, "in_progress")} · ` : ""}${Zs(f.end - f.start)}${f.live ? "" : ` · ${r(t, "max_kw", { kw: `${G(t, f.maxKw)} kW` })}`}</small>
                      </span>
                      <span class="kwh">${G(t, f.kwh)} kWh</span>
                    </div>`
    )}
                </div>
              </section>` : g}
      </div>
    `;
  }
};
ut.styles = [
  S.styles,
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
ie([
  v({ attribute: !1 })
], ut.prototype, "config", 2);
ie([
  v()
], ut.prototype, "name", 2);
ie([
  v({ attribute: !1 })
], ut.prototype, "onSettings", 2);
ie([
  b()
], ut.prototype, "_sessions", 2);
ie([
  b()
], ut.prototype, "_histError", 2);
ut = ie([
  z("terral-charger-dialog")
], ut);
function Cl(t, e, s, i) {
  document.querySelector("terral-charger-dialog")?.remove();
  const a = document.createElement("terral-charger-dialog");
  return a.hass = t, a.config = { ...e }, a.name = s, a.onSettings = i, document.body.appendChild(a), a;
}
function Ml(t) {
  for (const e of document.querySelectorAll("terral-charger-dialog")) e.hass = t;
}
var Al = Object.defineProperty, zl = Object.getOwnPropertyDescriptor, Dt = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? zl(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Al(e, s, a), a;
};
const El = "terral-home-charger";
let et = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._spark = [], this._held = !1, this._toggle = (t) => {
      if (t.stopPropagation(), !this.hass || !this._config) return;
      const e = this.hass.states[this._config.entity];
      if (!e) return;
      const s = fe(this.hass, this._config);
      s.look !== "unavailable" && Qs(this.hass, e, !s.locked, !!this._config.invert);
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
    t.has("hass") && Ml(this.hass);
    const e = fe(this.hass, this._config);
    if (this._size === "s42" && e.ids.power) {
      this._histFor !== e.ids.power && (this._histFor = e.ids.power, this._loadHistory(e.ids.power), clearInterval(this._histTimer), this._histTimer = window.setInterval(() => this._loadHistory(e.ids.power), 30 * 6e4));
      const s = ki(this.hass, e.ids.power), i = this._spark[this._spark.length - 1];
      if (s != null && (!i || i[1] !== s)) {
        const a = Date.now();
        this._spark = [...this._spark.filter(([n]) => a - n < 36e5), [a, s]], e.look === "charging" && !this._sessionStart && (this._sessionStart = a), e.look !== "charging" && (this._sessionStart = void 0);
      }
    }
  }
  async _loadHistory(t) {
    if (this.hass)
      try {
        const e = Date.now(), s = await Ja(this.hass, t, new Date(e - 7 * 864e5)), i = tn(s, e);
        this._week = en(i, 7).reduce((n, o) => n + o.kwh, 0);
        const a = i.find((n) => n.live);
        this._sessionStart = a?.start, this._spark = s.filter(([n]) => e - n < 36e5);
      } catch {
        this._week = void 0;
      }
  }
  _openWindow(t = "main") {
    if (!this.hass || !this._config) return;
    const e = () => this.hass && this._config && ee(this, this.hass, "charger", this._config);
    if (t === "settings") return e();
    Cl(this.hass, this._config, this._name, e);
  }
  // ---- Render ---------------------------------------------------------------
  _icon(t, e) {
    return d`<button class="icon" aria-label=${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")} ?disabled=${t.look === "unavailable"} @click=${this._toggle}>
      ${vs(e)}
      ${t.locked ? d`<span class="lk">${Ut(14)}</span>` : g}
    </button>`;
  }
  _lockBtn(t) {
    return t.look === "unavailable" ? g : d`<button class="pb ${t.locked && t.look === "warn" ? "primary" : ""}" @click=${this._toggle}>
      ${t.locked ? Se(19) : Ut(19)}<span>${t.locked ? r(this.hass, "unlock") : r(this.hass, "lock")}</span>
    </button>`;
  }
  _sparkline() {
    const t = this._spark;
    if (t.length < 2) return g;
    const e = 300, s = 58, i = Date.now(), a = Math.max(this._config?.max_power ?? 0, ...t.map((c) => c[1]), 1), n = t.map(([c, h]) => [Math.max(0, e - (i - c) / 36e5 * e), s - 4 - h / a * (s - 10)]);
    n.push([e, n[n.length - 1][1]]);
    const o = n.map((c, h) => `${h ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" "), l = n[n.length - 1];
    return y`<svg class="spark" viewBox="0 0 ${e} ${s}" preserveAspectRatio="none" aria-hidden="true">
      <path class="a" d="${o} L${e} ${s} L${n[0][0]} ${s}Z"></path><path class="l" d=${o}></path><circle cx=${l[0]} cy=${l[1]} r="4"></circle></svg>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass;
    if (!t.states[this._config.entity])
      return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = fe(t, this._config), i = this._size, a = Ga(t, s.ids.energy), n = s.kw != null ? `${G(t, s.kw)} kW` : "", o = a != null ? `${G(t, a)} kWh` : "", l = s.look === "charging", c = this._name;
    let h;
    if (i === "s11")
      h = d`${this._icon(s, 22)}<div class="text"><span class="name">${c}</span><span class="state">${_e(t, s, !0)}</span></div>`;
    else if (i === "s21") {
      const p = l && o ? [n, o].filter(Boolean).join(" · ") : _e(t, s, !0);
      h = d`${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${p}</span></div>`;
    } else {
      const p = d`<div class="head">${this._icon(s, 32)}<div class="text"><span class="name">${c}</span><span class="state">${_e(t, s, !1)}</span></div></div>`;
      if (i === "s22")
        h = d`${p}<div class="row">
          ${l && (n || o) ? d`${n ? d`<div class="pb static"><span>${n}</span></div>` : g}
                ${o ? d`<div class="pb static">${Ji()}<span>${o}</span></div>` : g}` : this._lockBtn(s)}
        </div>`;
      else {
        const u = this._sessionStart ?? (s.ids.status ? new Date(t.states[s.ids.status]?.last_changed ?? Date.now()).getTime() : void 0);
        h = d`${p}
          ${l ? d`<div class="chart flow">
                  <div class="chead"><span class="big">${s.kw != null ? G(t, s.kw) : "–"}<small>kW</small></span><span class="state">${r(t, "last_hour")}</span></div>
                  ${this._sparkline()}
                </div>
                <div class="row">
                  ${o ? d`<div class="pb static">${Ji()}<span>${o}</span></div>` : g}
                  ${u ? d`<div class="pb static">${Lo()}<span>${Zs(Date.now() - u)}</span></div>` : g}
                </div>` : d`<div class="stats">
                ${o ? d`<div class="stat"><b>${o}</b><span>${r(t, "last_session")}</span></div>` : g}
                ${this._week != null ? d`<div class="stat"><b>${G(t, this._week)} kWh</b><span>${r(t, "this_week")}</span></div>` : g}
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
      aria-label=${`${c}, ${_e(t, s, !1)}`}
      @click=${this._cardClick}
      @keydown=${(p) => {
      (p.key === "Enter" || p.key === " ") && p.target === p.currentTarget && (p.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(p) => p.preventDefault()}
    >${h}</div>`;
  }
};
et.styles = A`
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
  v({ attribute: !1 })
], et.prototype, "hass", 2);
Dt([
  b()
], et.prototype, "_config", 2);
Dt([
  b()
], et.prototype, "_size", 2);
Dt([
  b()
], et.prototype, "_spark", 2);
Dt([
  b()
], et.prototype, "_week", 2);
Dt([
  b()
], et.prototype, "_sessionStart", 2);
et = Dt([
  z(El)
], et);
var Tl = Object.defineProperty, Dl = Object.getOwnPropertyDescriptor, Cs = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Dl(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Tl(e, s, a), a;
};
let Gt = class extends N {
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
    const e = this.anchor, s = t.offsetWidth, i = t.offsetHeight, a = this.align === "left" ? e.left : e.right - s;
    t.style.left = `${Math.max(8, Math.min(window.innerWidth - s - 8, a))}px`, t.style.top = `${e.top - i - 8 > 8 ? e.top - i - 8 : Math.min(window.innerHeight - i - 8, e.bottom + 8)}px`;
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
Gt.styles = A`
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
Cs([
  v({ attribute: !1 })
], Gt.prototype, "items", 2);
Cs([
  v({ attribute: !1 })
], Gt.prototype, "anchor", 2);
Cs([
  v()
], Gt.prototype, "align", 2);
Gt = Cs([
  z("terral-pop")
], Gt);
function ri(t, e, s = "left") {
  document.querySelector("terral-pop")?.remove();
  const i = document.createElement("terral-pop");
  return i.items = e, i.anchor = t.getBoundingClientRect(), i.align = s, document.body.appendChild(i), i;
}
var Ol = Object.defineProperty, Pl = Object.getOwnPropertyDescriptor, Re = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Pl(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Ol(e, s, a), a;
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
    }}>${K(19)}</button>` : g;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  _step(t, e) {
    const s = ye(t, this.config), i = this._pending ?? ei(t);
    if (i == null) return;
    const a = typeof i == "number" ? $t(i + e * s.step, s) : e > 0 ? { low: i.low, high: $t(i.high + s.step, s) } : { low: $t(i.low - s.step, s), high: i.high };
    this._pending = a, clearTimeout(this._timer), this._timer = window.setTimeout(() => {
      dn(this.hass, t, a), window.setTimeout(() => this._pending = void 0, 2500);
    }, 650);
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = P(t), i = j(e), a = Ht(e, this.config), n = on(e, this.config), o = this._pending ?? ei(e), l = ve(e), c = Ee(e), h = lt(e), p = fr(e), u = this.config.show_swing === !0 && an(e), _ = e.attributes.swing_mode != null && e.attributes.swing_mode !== "off", x = [l != null ? `${s === "es" ? "Dentro" : "Inside"} ${ct(t, l)}°` : "", gn(t, e)].filter(Boolean).join(" · ");
    return d`
      <div class="status ${i ? "" : "on"}" style=${un(e)}>
        <button class="icon" aria-label=${i ? r(t, "turn_on") : r(t, "turn_off")} ?disabled=${Rt(e)} @click=${() => i ? Mi(t, e) : Ai(t, e)}>
          ${Wt(i ? "off" : e.state, 30)}
        </button>
        <div class="txt">
          <strong>${i ? s === "es" ? "Apagado" : "Off" : a ? `${X(s, e.state)} · ${De(t, o)}` : X(s, e.state)}</strong>
          ${x ? d`<span>${x}</span>` : g}
        </div>
      </div>
      <div class="scroll">
        <section class=${a ? "" : "dim"}>
          <h3>${r(t, "temperature")}</h3>
          <div class="wstep">
            <button aria-label="−" ?disabled=${!a} @click=${() => this._step(e, -1)}>${xi()}</button>
            <span class="v">${a ? De(t, o) : i ? "—" : r(t, "no_temperature")}</span>
            <button aria-label="+" ?disabled=${!a} @click=${() => this._step(e, 1)}>${yi()}</button>
          </div>
        </section>
        ${h.length > 1 ? d`<section>
              <h3>${r(t, "climate_mode")}</h3>
              <div class="grid">
                ${h.map((f) => d`<button class="opt ${!i && e.state === f ? "sel" : ""}" @click=${() => Te(t, e, f)}>${Wt(f, 22)}<span>${X(s, f)}</span></button>`)}
              </div>
            </section>` : g}
        ${c.length ? d`<section class=${n ? "" : "dim"}>
              <h3>${r(t, "climate_fan")}</h3>
              <div class="grid small" style="grid-template-columns:repeat(${Math.min(c.length, 4)},1fr)">
                ${c.map((f) => d`<button class="opt ${e.attributes.fan_mode === f ? "sel" : ""}" ?disabled=${!n} @click=${() => cn(t, e, f)}><span>${Js(s, f)}</span></button>`)}
              </div>
              ${n ? g : d`<p class="note">${i ? r(t, "climate_off_note") : r(t, "fan_fixed", { mode: X(s, e.state) })}</p>`}
            </section>` : g}
        ${u ? d`<div class="list"><button class="li" role="switch" aria-checked=${_} ?disabled=${i} @click=${() => br(t, e, !_)}>
              <span class="nm">${r(t, "swing")}</span><span class="tog ${_ ? "on" : ""}"></span>
            </button></div>` : g}
        ${p.length ? d`<section>
              <h3>${r(t, "presets")}</h3>
              <div class="grid small">
                ${p.map((f) => d`<button class="opt ${e.attributes.preset_mode === f ? "sel" : ""}" ?disabled=${i} @click=${() => mr(t, e, f)}><span>${Js(s, f)}</span></button>`)}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
Et.styles = [
  S.styles,
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
Re([
  v({ attribute: !1 })
], Et.prototype, "config", 2);
Re([
  v()
], Et.prototype, "name", 2);
Re([
  v({ attribute: !1 })
], Et.prototype, "onSettings", 2);
Re([
  b()
], Et.prototype, "_pending", 2);
Et = Re([
  z("terral-climate-dialog")
], Et);
function jl(t, e, s, i) {
  document.querySelector("terral-climate-dialog")?.remove();
  const a = document.createElement("terral-climate-dialog");
  return a.hass = t, a.config = { ...e }, a.name = s, a.onSettings = i, document.body.appendChild(a), a;
}
function Nl(t) {
  for (const e of document.querySelectorAll("terral-climate-dialog")) e.hass = t;
}
var Ll = Object.defineProperty, Il = Object.getOwnPropertyDescriptor, He = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Il(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Ll(e, s, a), a;
};
const Rl = "terral-home-climate";
class Hl {
  constructor(e) {
    this.onChange = e;
  }
  set(e, s, i) {
    this.value = i, this.onChange(), clearTimeout(this.timer), this.timer = window.setTimeout(() => {
      dn(e, s, i), window.setTimeout(() => {
        this.value = void 0, this.onChange();
      }, 2500);
    }, 650);
  }
}
let Tt = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._tick = 0, this._pending = new Hl(() => this._tick++), this._held = !1, this._dragging = !1, this._power = (t) => {
      t.stopPropagation();
      const e = this._entity;
      !e || !this.hass || Rt(e) || (j(e) ? Mi(this.hass, e) : Ai(this.hass, e));
    }, this._modeMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = P(this.hass);
      ri(t.currentTarget, lt(e).map((i) => ({
        label: X(s, i),
        icon: Wt(i, 21),
        selected: !j(e) && e.state === i,
        run: () => Te(this.hass, e, i)
      })));
    }, this._fanMenu = (t) => {
      t.stopPropagation();
      const e = this._entity;
      if (!e || !this.hass) return;
      const s = P(this.hass);
      ri(t.currentTarget, Ee(e).map((i) => ({
        label: Js(s, i),
        icon: Vs(21),
        selected: e.attributes.fan_mode === i,
        run: () => cn(this.hass, e, i)
      })), "right");
    }, this._dialDown = (t) => {
      const e = this._entity;
      !e || !this._config || !Ht(e, this._config) || (t.stopPropagation(), this._cancelHold(), this._dragging = !0, t.currentTarget.setPointerCapture(t.pointerId), this._dialMove(t));
    }, this._dialMove = (t) => {
      if (!this._dragging || !this.hass || !this._config) return;
      const e = this._entity;
      if (!e) return;
      const s = t.currentTarget.getBoundingClientRect(), i = s.left + s.width / 2, a = s.top + s.height * 100 / 180;
      let o = 225 - Math.atan2(a - t.clientY, t.clientX - i) * 180 / Math.PI;
      o < 0 && (o += 360), o > 300 && (o = 0);
      const l = ye(e, this._config), c = $t(l.min + Math.min(1, o / 270) * (l.max - l.min), l), h = this._target(e);
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
      Nl(this.hass);
      const e = this._entity;
      e && ln(e);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  _target(t) {
    return this._pending.value ?? ei(t);
  }
  _step(t) {
    return (e) => {
      e.stopPropagation();
      const s = this._entity;
      if (!s || !this.hass || !this._config) return;
      const i = ye(s, this._config), a = this._target(s);
      a != null && (typeof a == "number" ? this._pending.set(this.hass, s, $t(a + t * i.step, i)) : t > 0 ? this._pending.set(this.hass, s, { low: a.low, high: $t(a.high + i.step, i) }) : this._pending.set(this.hass, s, { low: $t(a.low - i.step, i), high: a.high }));
    };
  }
  _openWindow() {
    !this.hass || !this._config || jl(this.hass, this._config, this._name, () => this.hass && this._config && ee(this, this.hass, "climate", this._config));
  }
  // ---- Render -------------------------------------------------------------------
  _pct(t) {
    if (!this._config || !Ht(t, this._config)) return 0;
    const e = ye(t, this._config), s = this._target(t);
    if (s == null) return 0;
    const i = typeof s == "number" ? s : s.high;
    return Math.max(0, Math.min(1, (i - e.min) / (e.max - e.min)));
  }
  _icon(t, e) {
    return d`<button class="icon" aria-label=${j(t) ? r(this.hass, "turn_on") : r(this.hass, "turn_off")} ?disabled=${Rt(t)} @click=${this._power}>
      ${Wt(j(t) ? "off" : t.state, e)}
    </button>`;
  }
  _modeBtn(t) {
    return lt(t).length < 2 ? g : d`<button class="rbtn" aria-label=${r(this.hass, "climate_mode")} ?disabled=${Rt(t)} @click=${this._modeMenu}>
      ${Wt(j(t) ? lt(t)[0] ?? "off" : t.state, 22)}
    </button>`;
  }
  _fanBtn(t) {
    const e = Ee(t);
    if (!e.length) return g;
    const s = on(t, this._config), i = t.attributes.fan_mode;
    return d`<button class="rbtn" aria-label=${r(this.hass, "climate_fan")} ?disabled=${!s} @click=${this._fanMenu}>
      ${Vs(22)}${i ? d`<span class="tag">${wr(e, i)}</span>` : g}
    </button>`;
  }
  _stepper(t) {
    const e = this.hass, s = Ht(t, this._config), i = this._target(t), a = ve(t), n = s ? d`<span class="v ${typeof i == "object" ? "range" : ""}">${De(e, i)}</span>` : d`<span class="v muted">${j(t) ? a != null ? `${ct(e, a)}° ${P(e) === "es" ? "dentro" : "inside"}` : "—" : r(e, "no_temperature")}</span>`;
    return d`<div class="step ${s ? "" : "dis"}">
      <button aria-label="−" ?disabled=${!s} @click=${this._step(-1)}>${xi()}</button>
      ${n}
      <button aria-label="+" ?disabled=${!s} @click=${this._step(1)}>${yi()}</button>
    </div>`;
  }
  _dial(t) {
    const e = this.hass, s = P(e), i = 86, a = 2 * Math.PI * i, n = a * 0.75, o = this._pct(t), l = (225 - o * 270) * Math.PI / 180, c = 114 + i * Math.cos(l), h = 100 - i * Math.sin(l), p = Ht(t, this._config), u = ve(t), _ = u != null ? `${ct(e, u)}°` : "—", x = this._target(t), f = p ? De(e, x) : _, m = j(t) ? `${s === "es" ? "dentro · apagado" : "inside · off"}` : p ? `${X(s, t.state)} · ${s === "es" ? "dentro" : "inside"} ${_}` : `${X(s, t.state)} · ${s === "es" ? "dentro" : "inside"}`;
    return d`<div class="dial ${p ? "" : "disabled"}" @pointerdown=${this._dialDown} @pointermove=${this._dialMove} @pointerup=${this._dialUp} @pointercancel=${this._dialUp}>
      ${y`<svg viewBox="0 0 228 180" aria-hidden="true">
        <circle class="trk" cx="114" cy="100" r=${i} stroke-dasharray="${n} ${a}" transform="rotate(135 114 100)"></circle>
        ${o ? y`<circle class="val" cx="114" cy="100" r=${i} stroke-dasharray="${n * o} ${a}" transform="rotate(135 114 100)"></circle>
          <circle class="thumb" cx=${c} cy=${h} r="12"></circle>` : g}
      </svg>`}
      <div class="mid"><b class=${typeof x == "object" && p ? "range" : ""}>${f}</b><span>${m}</span></div>
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    this._tick;
    const s = this._size, i = this._name, a = this._target(e), n = j(e), o = oa(t, e, this._config, a, !1), l = oa(t, e, this._config, a, !0), c = P(t);
    let h;
    if (s === "s11")
      h = d`${this._icon(e, 21)}<div class="text"><span class="name">${i}</span><span class="state">${l}</span></div>`;
    else if (s === "s21") {
      const p = ve(e), u = p != null ? ` · ${ct(t, p)}° ${c === "es" ? "dentro" : "inside"}` : "";
      h = d`${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${n ? o : l + u}</span></div>`;
    } else if (s === "s22")
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${o}</span></div></div>
        <div class="row">${this._modeBtn(e)}${this._stepper(e)}${this._fanBtn(e)}</div>`;
    else {
      const p = gn(t, e), u = n ? c === "es" ? "Apagado" : "Off" : [ti(c, e.state), p].filter(Boolean).join(" · ");
      h = d`<div class="head">${this._icon(e, 30)}<div class="text"><span class="name">${i}</span><span class="state">${u}</span></div></div>
        ${this._dial(e)}
        <div class="bottom">${this._modeBtn(e) === g ? d`<span></span>` : this._modeBtn(e)}${this._fanBtn(e)}</div>`;
    }
    return d`<div
      class="card ${s} ${n ? "off" : "on"} ${Rt(e) ? "unavailable" : ""}"
      style=${un(e)}
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
Tt.styles = A`
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
He([
  v({ attribute: !1 })
], Tt.prototype, "hass", 2);
He([
  b()
], Tt.prototype, "_config", 2);
He([
  b()
], Tt.prototype, "_size", 2);
He([
  b()
], Tt.prototype, "_tick", 2);
Tt = He([
  z(Rl)
], Tt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jn = { CHILD: 2 }, Nn = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ln = class {
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
class li extends Ln {
  constructor(e) {
    if (super(e), this.it = g, e.type !== jn.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === g || e == null) return this._t = void 0, this.it = e;
    if (e === dt) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const s = [e];
    return s.raw = s, this._t = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
}
li.directiveName = "unsafeHTML", li.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ci = class extends li {
};
ci.directiveName = "unsafeSVG", ci.resultType = 2;
const Wl = Nn(ci), ql = (t, e) => `<svg width="${t}" height="${t}" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, Is = (t = 24, e = 24, s = 9) => `<circle cx="${t}" cy="${e}" r="${s}" fill="#FFD25A"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((i) => {
  const a = i * Math.PI / 180, n = (o) => `${(t + Math.cos(a) * o).toFixed(1)} ${(e + Math.sin(a) * o).toFixed(1)}`;
  return `<path d="M${n(s + 4)}L${n(s + 8)}" stroke="#FFD25A" stroke-width="3"/>`;
}).join(""), Rs = (t = 24, e = 22) => `<path d="M${t + 10} ${e + 6}A12 12 0 1 1 ${t - 2} ${e - 11}a9.5 9.5 0 0 0 12 17z" fill="#F4E9B8"/>`, H = (t = 0, e = "#fff") => `<path d="M14 ${36 + t}h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 7.5 7.5 0 0 0-1 18z" fill="${e}"/>`, Ye = (t = "#7fc8ff", e = [14, 23, 32]) => e.map((s) => `<path d="M${s} 40l-2 5" stroke="${t}" stroke-width="3"/>`).join(""), ua = (t = [14, 24, 34]) => t.map((e) => `<circle cx="${e}" cy="42" r="2.2" fill="#fff"/>`).join(""), ga = '<path d="M25 30l-5 8h6l-4 8" stroke="#FFD25A" stroke-width="3"/>', Ul = '<path d="M6 18h24a5 5 0 1 0-5-5M6 26h32a5 5 0 1 1-5 5M6 34h16" stroke="#dfe7f3" stroke-width="3.2"/>';
function Bl(t, e) {
  switch (t) {
    case "sunny":
      return e ? Rs() : Is();
    case "clear-night":
      return Rs();
    case "partlycloudy":
      return (e ? Rs(20, 15) : Is(18, 17, 7)) + H(2);
    case "cloudy":
      return H(-6, "#cfd8e6") + H(0);
    case "rainy":
      return H(-6) + Ye();
    case "pouring":
      return H(-6, "#b9c4d6") + Ye("#5fb4ff", [12, 18, 24, 30, 36]);
    case "lightning":
      return H(-6, "#b9c4d6") + ga;
    case "lightning-rainy":
      return H(-6, "#b9c4d6") + ga + Ye("#7fc8ff", [14, 34]);
    case "snowy":
      return H(-6) + ua();
    case "snowy-rainy":
      return H(-6) + ua([14, 34]) + Ye("#7fc8ff", [24]);
    case "hail":
      return H(-6, "#b9c4d6") + [14, 24, 34].map((s) => `<circle cx="${s}" cy="42" r="2.6" fill="#dfe9ff" stroke="#9fb7e0" stroke-width="1"/>`).join("");
    case "fog":
      return H(-8, "#cfd8e6") + '<path d="M10 36h28M14 42h22" stroke="#cfd8e6" stroke-width="3"/>';
    case "windy":
      return Ul;
    case "windy-variant":
      return H(-8, "#cfd8e6") + '<path d="M8 38h22a4 4 0 1 0-4-4M8 44h14" stroke="#dfe7f3" stroke-width="3"/>';
    default:
      return Is(24, 24, 7) + H(4, "#cfd8e6");
  }
}
const tt = (t, e = 32, s = !1) => Wl(ql(e, Bl(t, s))), fa = {
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
}, _a = {
  sunny: "linear-gradient(180deg,#0e1739,#283a6e)",
  "clear-night": "linear-gradient(180deg,#0e1739,#283a6e)",
  partlycloudy: "linear-gradient(180deg,#141d40,#36477a)",
  cloudy: "linear-gradient(180deg,#232a3b,#454f65)",
  rainy: "linear-gradient(180deg,#1b2233,#394459)",
  pouring: "linear-gradient(180deg,#151b29,#2f394c)",
  snowy: "linear-gradient(180deg,#2a3550,#56688a)",
  fog: "linear-gradient(180deg,#2c3340,#525b6a)"
};
function In(t, e) {
  return e ? _a[t] ?? _a.cloudy : fa[t] ?? fa.partlycloudy;
}
const Rn = (t) => ["rainy", "pouring", "lightning-rainy", "snowy-rainy", "hail"].includes(t), Hn = (t) => t === "snowy" || t === "snowy-rainy", ma = { DAILY: 1, HOURLY: 2 }, fs = (t, e) => (Number(t.attributes.supported_features ?? 0) & (e === "daily" ? ma.DAILY : ma.HOURLY)) !== 0, Hs = /* @__PURE__ */ new Map();
function _s(t, e, s, i) {
  const a = `${e}|${s}`;
  let n = Hs.get(a);
  if (!n) {
    n = { listeners: /* @__PURE__ */ new Set() }, Hs.set(a, n);
    const l = n;
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
  n.listeners.add(i), n.data && i(n.data);
  const o = n;
  return () => {
    o.listeners.delete(i), o.listeners.size || (Hs.delete(a), o.unsub?.then((l) => l()).catch(() => {
    }));
  };
}
function Wn(t, e) {
  if (e.state === "clear-night") return !0;
  const s = t.states["sun.sun"];
  if (s) return s.state === "below_horizon";
  const i = (/* @__PURE__ */ new Date()).getHours();
  return i < 7 || i >= 21;
}
const M = (t) => t == null || t === "" || Number.isNaN(Number(t)) ? null : Number(t), Fl = (t) => String(t.attributes.wind_speed_unit ?? "km/h"), Yl = (t) => String(t.attributes.pressure_unit ?? "hPa"), ba = (t) => String(t.attributes.precipitation_unit ?? "mm");
function qn(t) {
  const e = t?.[0];
  return { hi: M(e?.temperature), lo: M(e?.templow) };
}
function Vl(t, e) {
  if (t?.length) {
    const s = (/* @__PURE__ */ new Date()).toDateString(), i = t.filter((a) => new Date(a.datetime).toDateString() === s).map((a) => M(a.precipitation) ?? 0);
    if (i.length) return i.reduce((a, n) => a + n, 0);
  }
  return M(e?.[0]?.precipitation);
}
const Gl = {
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
}, Xl = {
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
}, Un = (t, e) => (t === "es" ? Gl : Xl)[e] ?? e, L = (t, e, s = 0) => e.toLocaleString(t?.locale?.language ?? t?.language ?? void 0, { minimumFractionDigits: s, maximumFractionDigits: s }), Bn = (t, e) => new Date(e).toLocaleTimeString(t?.locale?.language ?? t?.language ?? void 0, { hour: "2-digit" }).replace(/\s?h$/, "");
function di(t, e, s) {
  const i = new Date(e);
  if (i.toDateString() === (/* @__PURE__ */ new Date()).toDateString()) return s;
  const a = i.toLocaleDateString(t?.locale?.language ?? t?.language ?? void 0, { weekday: "short" }).replace(".", "");
  return a.charAt(0).toUpperCase() + a.slice(1);
}
var Kl = Object.defineProperty, Ql = Object.getOwnPropertyDescriptor, ae = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Ql(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Kl(e, s, a), a;
};
let gt = class extends S {
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
    }}>${K(19)}</button>` : g;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this.hass?.states[this.config.entity];
    t && (fs(t, "hourly") && this._unsubs.push(_s(this.hass, t.entity_id, "hourly", (e) => this._hourly = e)), fs(t, "daily") && this._unsubs.push(_s(this.hass, t.entity_id, "daily", (e) => this._daily = e)));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of this._unsubs) t();
    this._unsubs = [];
  }
  renderContent() {
    const t = this.hass, e = t.states[this.config.entity];
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = P(t), i = e.state, a = Wn(t, e), n = M(e.attributes.temperature), { hi: o, lo: l } = qn(this._daily), c = (O) => O != null ? `${L(t, Math.round(O))}°` : "–", h = this.config.animate !== !1, p = this.config.show_details !== !1, u = M(e.attributes.humidity), _ = M(e.attributes.wind_speed), x = M(e.attributes.wind_bearing), f = M(e.attributes.pressure), m = M(e.attributes.cloud_coverage), $ = M(e.attributes.dew_point), w = Vl(this._hourly, this._daily), D = [];
    u != null && D.push([r(t, "humidity"), `${L(t, u)} %`]), _ != null && D.push([r(t, "wind"), d`${x != null ? d`<span class="arrow" style="transform:rotate(${x + 180}deg)">↑</span>` : g}${L(t, _)} ${Fl(e)}`]), f != null && D.push([r(t, "pressure"), `${L(t, f)} ${Yl(e)}`]), m != null && D.push([r(t, "clouds"), `${L(t, m)} %`]), $ != null && D.push([r(t, "dew_point"), `${L(t, $, 1)}°`]), w != null && D.push([r(t, "rain_today"), `${L(t, w, 1)} ${ba(e)}`]);
    const F = (this._daily ?? []).slice(0, this.config.forecast_days ?? 7), Z = Math.min(...F.map((O) => M(O.templow) ?? M(O.temperature) ?? 0)), Vn = Math.max(...F.map((O) => M(O.temperature) ?? 0)), Hi = Math.max(1, Vn - Z), Gn = r(t, "today");
    return d`
      <div class="hero" style="background:${In(i, a)}">
        ${h && Rn(i) ? d`<span class="rainfx"></span>` : h && Hn(i) ? d`<span class="snowfx"></span>` : g}
        ${tt(i, 64, a)}
        <div class="htxt">
          <span class="temp">${c(n)}</span>
          <strong>${Un(s, i)}</strong>
          <span>${r(t, "max_short")} ${c(o)} · ${r(t, "min_short")} ${c(l)}</span>
        </div>
      </div>
      <div class="scroll">
        ${p && D.length ? d`<div class="tiles">${D.map(([O, at]) => d`<div class="tile"><small>${O}</small><b>${at}</b></div>`)}</div>` : g}
        ${this._hourly?.length ? d`<section>
              <h3>${r(t, "next_hours")}</h3>
              <div class="list"><div class="hscroll">
                ${this._hourly.slice(0, 24).map((O, at) => {
      const Ot = M(O.precipitation);
      return d`<div class="hour">
                    <span class="h">${at === 0 ? r(t, "now") : Bn(t, O.datetime)}</span>
                    ${tt(O.condition ?? "", 26, O.is_daytime === !1)}
                    <span class="t">${c(M(O.temperature))}</span>
                    <span class="p">${Ot ? `${L(t, Ot, 1)} ${ba(e)}` : ""}</span>
                  </div>`;
    })}
              </div></div>
            </section>` : g}
        ${F.length ? d`<section>
              <h3>${r(t, "next_days")}</h3>
              <div class="list days">
                ${F.map((O) => {
      const at = M(O.templow), Ot = M(O.temperature);
      return d`<div class="day">
                    <span>${di(t, O.datetime, Gn)}</span>${tt(O.condition ?? "", 24)}
                    <span class="lo">${at != null ? c(at) : ""}</span>
                    <span class="bar"><i style="left:${at != null ? (at - Z) / Hi * 100 : 0}%;right:${Ot != null ? 100 - (Ot - Z) / Hi * 100 : 0}%"></i></span>
                    <span>${c(Ot)}</span>
                  </div>`;
    })}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
gt.styles = [
  S.styles,
  A`
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
ae([
  v({ attribute: !1 })
], gt.prototype, "config", 2);
ae([
  v()
], gt.prototype, "name", 2);
ae([
  v({ attribute: !1 })
], gt.prototype, "onSettings", 2);
ae([
  b()
], gt.prototype, "_hourly", 2);
ae([
  b()
], gt.prototype, "_daily", 2);
gt = ae([
  z("terral-weather-dialog")
], gt);
function Zl(t, e, s, i) {
  document.querySelector("terral-weather-dialog")?.remove();
  const a = document.createElement("terral-weather-dialog");
  return a.hass = t, a.config = { ...e }, a.name = s, a.onSettings = i, document.body.appendChild(a), a;
}
function Jl(t) {
  for (const e of document.querySelectorAll("terral-weather-dialog")) e.hass = t;
}
var tc = Object.defineProperty, ec = Object.getOwnPropertyDescriptor, ne = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ec(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && tc(e, s, a), a;
};
const sc = "terral-home-weather";
let ft = class extends N {
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
    t.has("hass") && Jl(this.hass);
    const e = this._entity;
    !e || !this.isConnected || this._subFor !== e.entity_id && (this._unsubscribe(), this._subFor = e.entity_id, fs(e, "daily") && this._unsubs.push(_s(this.hass, e.entity_id, "daily", (s) => this._daily = s)), fs(e, "hourly") && this._size !== "s11" && this._unsubs.push(_s(this.hass, e.entity_id, "hourly", (s) => this._hourly = s)));
  }
  // ---- Interaction ----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || Zl(this.hass, this._config, this._name, () => this.hass && this._config && ee(this, this.hass, "weather", this._config));
  }
  // ---- Render ---------------------------------------------------------------------
  _hoursRow(t) {
    const e = this.hass, s = this._config?.forecast_2x2 === "daily" && this._size === "s22", i = s ? this._daily : this._hourly ?? this._daily;
    if (!i?.length) return d`<div class="hours empty"></div>`;
    const a = s || !this._hourly, n = r(e, "today");
    return d`<div class="hours">
      ${i.slice(0, 6).map((o, l) => {
      const c = a ? di(e, o.datetime, n) : l === 0 ? r(e, "now") : Bn(e, o.datetime), h = !a && o.is_daytime === !1 ? !0 : !a && l === 0 ? t : !1, p = M(o.temperature);
      return d`<div class="hour"><span class="h">${c}</span>${tt(o.condition ?? "", 22, h)}<span class="t">${p != null ? `${L(e, p)}°` : "–"}</span></div>`;
    })}
    </div>`;
  }
  _daysList(t) {
    const e = this.hass, s = this._daily?.slice(0, t) ?? [];
    if (!s.length) return g;
    const i = this._daily.slice(0, 7), a = Math.min(...i.map((c) => M(c.templow) ?? M(c.temperature) ?? 0)), n = Math.max(...i.map((c) => M(c.temperature) ?? 0)), o = Math.max(1, n - a), l = r(e, "today");
    return d`<div class="days">
      ${s.map((c) => {
      const h = M(c.templow), p = M(c.temperature), u = h != null ? (h - a) / o * 100 : 0, _ = p != null ? 100 - (p - a) / o * 100 : 0;
      return d`<div class="day">
          <span>${di(e, c.datetime, l)}</span>${tt(c.condition ?? "", 22)}
          <span class="lo">${h != null ? `${L(e, h)}°` : ""}</span>
          <span class="bar"><i style="left:${u}%;right:${_}%"></i></span>
          <span>${p != null ? `${L(e, p)}°` : ""}</span>
        </div>`;
    })}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = P(t), i = e.state, a = Wn(t, e), n = M(e.attributes.temperature), o = n != null ? `${L(t, Math.round(n))}°` : "–", { hi: l, lo: c } = qn(this._daily), h = l != null || c != null ? `${r(t, "max_short")} ${l != null ? `${L(t, Math.round(l))}°` : "–"} · ${r(t, "min_short")} ${c != null ? `${L(t, Math.round(c))}°` : "–"}` : "", p = e.state === "unavailable" ? r(t, "unavailable") : Un(s, i), u = this._name, _ = this._config.animate !== !1, x = _ && Rn(i) ? d`<span class="rainfx"></span>` : _ && Hn(i) ? d`<span class="snowfx"></span>` : g, f = this._size;
    let m;
    if (f === "s11")
      m = d`${tt(i, 34, a)}<div class="text"><span class="name">${o} · ${u}</span><span class="state">${p}</span></div>`;
    else if (f === "s21")
      m = d`${x}<div class="top"><span class="temp">${o}</span>${tt(i, 40, a)}</div>
        <div class="text"><span class="name">${u}</span><span class="state">${p}</span>${h ? d`<span class="hl">${h}</span>` : g}</div>`;
    else {
      const $ = f === "s42";
      m = d`${x}
        <div class="top">
          <div class="text"><span class="name">${u}</span><span class="temp ${$ ? "xl" : "md"}">${o}</span></div>
          <div class="right">${tt(i, $ ? 34 : 30, a)}<span class="cond">${p}</span>${h ? d`<span class="hl">${h}</span>` : g}</div>
        </div>
        ${this._hoursRow(a)}
        ${$ ? d`<div class="sep"></div>${this._daysList(3)}` : g}`;
    }
    return d`<div
      class="card ${f}"
      style="background:${In(i, a)}"
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
    >${m}</div>`;
  }
};
ft.styles = A`
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
ne([
  v({ attribute: !1 })
], ft.prototype, "hass", 2);
ne([
  b()
], ft.prototype, "_config", 2);
ne([
  b()
], ft.prototype, "_size", 2);
ne([
  b()
], ft.prototype, "_hourly", 2);
ne([
  b()
], ft.prototype, "_daily", 2);
ft = ne([
  z(sc)
], ft);
var ic = Object.defineProperty, ac = Object.getOwnPropertyDescriptor, oe = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ac(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && ic(e, s, a), a;
};
const nc = { vacuum: "vac_mode_vacuum", mop: "vac_mode_mop", both: "vac_mode_both" }, xa = /* @__PURE__ */ new Set(["off"]);
let _t = class extends S {
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
    }}>${K(19)}</button>` : g;
  }
  get _e() {
    return this.hass?.states[this.config.entity];
  }
  get _p() {
    return this._parts || (this._parts = _n(this.hass, this.config.entity)), this._parts;
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this._e;
    t && Or(this.hass, t, this._p).then((e) => this._rooms = e);
  }
  _toggleRoom(t) {
    const e = new Set(this._picked);
    e.has(t) ? e.delete(t) : e.add(t), this._picked = e;
  }
  _start(t) {
    Ct(t) !== "paused" && this._picked.size ? Dr(this.hass, t, [...this._picked]) : ge(this.hass, t);
  }
  _seg(t, e, s, i, a = !1) {
    const n = t.length <= 4 ? t.length : 3;
    return d`<div class="seg" style="grid-template-columns:repeat(${n},minmax(0,1fr))">
      ${t.map((o) => d`<button class=${e === o ? "sel" : ""} ?disabled=${a} @click=${() => i(o)}>${s(o)}</button>`)}
    </div>`;
  }
  renderContent() {
    const t = this.hass, e = this._e;
    if (!e) return d`<p>${r(t, "not_found")}</p>`;
    const s = this._p, i = Ct(e), a = i === "unavailable", n = i === "cleaning" || i === "returning", o = zr(t, e, s), l = Ei(e).filter((w) => !xa.has(w)), c = rs(t, s.mopIntensity).filter((w) => !xa.has(w)), h = rs(t, s.mopMode), p = o.current !== "vacuum" || !o.modes.length, u = o.current !== "mop", _ = $n(t, e, s, !0, 15), x = mn(t, e, s), f = Sn(t, s), m = vn(t, this.config), $ = (w) => d`<em>${r(t, w)}</em>`;
    return d`
      <div class="status ${Di(i) ? "on" : ""}" style=${wn(i)}>
        <span class="icon">${Me(30)}${i === "error" ? d`<span class="err">${Ua(14)}</span>` : g}</span>
        <div class="txt">
          <strong>${Je(t, e, s)}</strong>
          <span>${_ ? d`<b class="bat" style="color:${_.color}">${_.icon}${_.text}</b>` : g}${f && (n || i === "paused") ? d` · ${f}` : g}</span>
        </div>
      </div>
      ${i === "error" && x ? d`<p class="alert">${kn(t, x)}</p>` : g}
      <div class="scroll">
        ${o.modes.length ? d`<section>
              <h3>${r(t, "vac_what")}</h3>
              ${this._seg(o.modes, o.current, (w) => r(t, nc[w]), (w) => Er(t, e, s, w), a)}
            </section>` : g}
        ${l.length && rt(e, "FAN") ? d`<section class=${u ? "" : "dim"}>
              <h3>${r(t, "vac_power")}${u ? g : $("vac_power_off")}</h3>
              ${this._seg(l, e.attributes.fan_speed, (w) => Ds(t, w), (w) => Tr(t, e, w), a || !u)}
            </section>` : g}
        ${c.length ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_water")}${p ? g : $("vac_only_mop")}</h3>
              ${this._seg(c, t.states[s.mopIntensity]?.state, (w) => Ds(t, w), (w) => la(t, s.mopIntensity, w), a || !p)}
            </section>` : g}
        ${h.length ? d`<section class=${p ? "" : "dim"}>
              <h3>${r(t, "vac_mop_mode")}${p ? g : $("vac_only_mop")}</h3>
              ${this._seg(h, t.states[s.mopMode]?.state, (w) => Ds(t, w), (w) => la(t, s.mopMode, w), a || !p)}
            </section>` : g}
        ${this._rooms.length ? d`<section class=${n || i === "paused" ? "dim" : ""}>
              <h3>${r(t, "vac_where")}${n || i === "paused" ? $("vac_rooms_next") : g}</h3>
              <div class="chips">
                <button class=${this._picked.size ? "" : "sel"} ?disabled=${n} @click=${() => this._picked = /* @__PURE__ */ new Set()}>${r(t, "vac_whole_home")}</button>
                ${this._rooms.map((w) => d`<button class=${this._picked.has(w.id) ? "sel" : ""} ?disabled=${n} @click=${() => this._toggleRoom(w.id)}>${w.name}</button>`)}
              </div>
            </section>` : g}
        <div class="actions">
          <button class="go" ?disabled=${a || i === "cleaning"} @click=${() => this._start(e)}>
            ${Ke(18)}${r(t, i === "paused" ? "vac_resume" : this._picked.size ? "vac_start_rooms" : "vac_start_clean", { n: this._picked.size })}
          </button>
          ${rt(e, "PAUSE") ? d`<button class="rb" aria-label=${r(t, "vac_pause")} ?disabled=${!n} @click=${() => si(t, e)}>${Wa(18)}</button>` : g}
          ${rt(e, "RETURN") ? d`<button class="rb" aria-label=${r(t, "vac_to_base")} ?disabled=${a || i === "docked" || i === "returning"} @click=${() => ii(t, e)}>${is(19)}</button>` : g}
          ${rt(e, "LOCATE") ? d`<button class="rb" aria-label=${r(t, "vac_locate")} ?disabled=${a} @click=${() => yn(t, e)}>${qa(19)}</button>` : g}
        </div>
        ${i === "docked" ? d`<p class="note">${r(t, "vac_docked_note")}</p>` : i === "cleaning" ? d`<p class="note">${r(t, "vac_cleaning_note")}</p>` : g}
        ${m.length ? d`<section>
              <h3>${r(t, "vac_routines")}</h3>
              <div class="chips">
                ${m.map((w) => {
      const D = ls(t, w, this.name);
      return d`<button ?disabled=${a || i === "cleaning"} @click=${() => ai(t, w)}>${cs(D, 16)}${D}</button>`;
    })}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
_t.styles = [
  S.styles,
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
oe([
  v({ attribute: !1 })
], _t.prototype, "config", 2);
oe([
  v()
], _t.prototype, "name", 2);
oe([
  v({ attribute: !1 })
], _t.prototype, "onSettings", 2);
oe([
  b()
], _t.prototype, "_rooms", 2);
oe([
  b()
], _t.prototype, "_picked", 2);
_t = oe([
  z("terral-vacuum-dialog")
], _t);
function oc(t, e, s, i) {
  document.querySelector("terral-vacuum-dialog")?.remove();
  const a = document.createElement("terral-vacuum-dialog");
  return a.hass = t, a.config = { ...e }, a.name = s, a.onSettings = i, document.body.appendChild(a), a;
}
function rc(t) {
  for (const e of document.querySelectorAll("terral-vacuum-dialog")) e.hass = t;
}
var lc = Object.defineProperty, cc = Object.getOwnPropertyDescriptor, Ms = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? cc(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && lc(e, s, a), a;
};
const dc = "terral-home-vacuum";
let Xt = class extends N {
  constructor() {
    super(...arguments), this._size = "s22", this._held = !1, this._iconTap = (t) => {
      t.stopPropagation();
      const e = this._entity, s = this.hass;
      if (!e || !s) return;
      const i = Ct(e);
      i === "cleaning" || i === "returning" ? si(s, e) : i === "paused" ? ge(s, e) : i === "docked" || i === "idle" ? this._routinesMenu(t.currentTarget) : this._openWindow();
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
    return !this._parts && this.hass && this._config && (this._parts = _n(this.hass, this._config.entity)), this._parts ?? {};
  }
  get _name() {
    return this._config?.name || this._entity?.attributes.friendly_name || r(this.hass, "type_vacuum");
  }
  /** Redraw only when the robot or one of its own sensors changed. */
  shouldUpdate(t) {
    if (!t.has("hass") || t.size > 1) return !0;
    const e = t.get("hass");
    return !e || !this._config || !this.hass ? !0 : [this._config.entity, ...Object.values(this._p), ...ca(this.hass, this._config)].filter(Boolean).some((i) => e.states[i] !== this.hass.states[i]);
  }
  updated(t) {
    if (t.has("hass") && this.hass) {
      rc(this.hass);
      const e = this._entity;
      e && Ar(this.hass, e, this._p);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._cancelHold();
  }
  // ---- Actions -----------------------------------------------------------------
  _openWindow() {
    !this.hass || !this._config || oc(this.hass, this._config, this._name, () => this.hass && this._config && ee(this, this.hass, "vacuum", this._config));
  }
  _routinesMenu(t) {
    const e = this.hass, s = vn(e, this._config);
    if (!s.length) return this._openWindow();
    ri(t, s.map((i) => {
      const a = ls(e, i, this._name);
      return { label: a, icon: cs(a, 21), run: () => ai(e, i) };
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
      ${Me(s)}
      ${e === "error" ? d`<span class="err">${Ua(this._size === "s11" ? 11 : 14)}</span>` : g}
    </button>`;
  }
  _battery(t, e) {
    const s = $n(this.hass, t, this._p, e);
    return s ? d`<span class="bat" style="color:${s.color}" aria-label=${`${r(this.hass, "battery")} ${s.pct} %`}>${s.icon}${s.text}</span>` : g;
  }
  _bottom22(t, e) {
    const s = this.hass, i = this._config;
    if (e === "docked" || e === "idle" || e === "unavailable") {
      const o = ca(s, i);
      return o.length ? d`<div class="pills" style="grid-template-columns:repeat(${o.length},minmax(0,1fr))">
        ${o.map((l) => {
        const c = ls(s, l, this._name);
        return d`<button class="pb" ?disabled=${e === "unavailable"} @click=${(h) => {
          h.stopPropagation(), ai(s, l);
        }}>${cs(c, 16)}<span>${c}</span></button>`;
      })}
      </div>` : d`<div class="pills one"><button class="pb" ?disabled=${e === "unavailable"} @click=${this._act(ge)}>${Ke(16)}${r(s, "vac_start")}</button></div>`;
    }
    if (e === "error")
      return d`<div class="row">
        <button class="pb grow" @click=${this._act(ge)}>${Ke(16)}<span>${r(s, "vac_resume")}</span></button>
        ${rt(t, "RETURN") ? d`<button class="pb grow" @click=${this._act(ii)}>${is(17)}<span>${r(s, "vac_to_base")}</span></button>` : g}
        ${rt(t, "LOCATE") ? d`<button class="rb" aria-label=${r(s, "vac_locate")} @click=${this._act(yn)}>${qa(19)}</button>` : g}
      </div>`;
    const a = zi(s, this._p), n = Sn(s, this._p);
    return d`<div class="row">
      <div class="info">
        ${a != null && e !== "returning" ? d`<div class="track"><i style="width:${a}%"></i></div>` : g}
        <span class="facts">${n || Je(s, t, this._p)}</span>
      </div>
      ${e === "paused" ? d`<button class="rb on" aria-label=${r(s, "vac_resume")} @click=${this._act(ge)}>${Ke(18)}</button>` : rt(t, "PAUSE") ? d`<button class="rb on" aria-label=${r(s, "vac_pause")} @click=${this._act(si)}>${Wa(18)}</button>` : g}
      ${rt(t, "RETURN") ? d`<button class="rb" aria-label=${r(s, "vac_to_base")} ?disabled=${e === "returning"} @click=${this._act(ii)}>${is(19)}</button>` : g}
    </div>`;
  }
  render() {
    if (!this._config || !this.hass) return g;
    const t = this.hass, e = this._entity;
    if (!e) return d`<div class="card off missing"><span>${r(t, "not_found")}</span><small>${this._config.entity}</small></div>`;
    const s = Ct(e), i = this._size, a = this._name, n = Je(t, e, this._p);
    let o;
    return i === "s11" ? o = d`${this._icon(e, s, 22)}<div class="text"><span class="name">${a}</span>
        <span class="state line"><span class="grow">${Je(t, e, this._p, !0)}</span>${this._battery(e, !1)}</span></div>` : i === "s21" ? o = d`${this._icon(e, s, 32)}<div class="text"><span class="name">${a}</span><span class="state">${n}</span>
        <span class="state">${this._battery(e, !0)}</span></div>` : o = d`<div class="head">${this._icon(e, s, 32)}<div class="text"><span class="name">${a}</span><span class="state">${n}</span></div>
          <span class="top">${this._battery(e, !0)}</span></div>
        ${this._bottom22(e, s)}`, d`<div
      class="card ${i} ${Di(s) ? "on" : "off"} ${s === "unavailable" ? "unavailable" : ""}"
      style=${wn(s)}
      @pointerdown=${this._down}
      @pointermove=${this._move}
      @pointerup=${this._cancelHold}
      @pointercancel=${this._cancelHold}
      @pointerleave=${this._cancelHold}
      role="button"
      tabindex="0"
      aria-label=${`${a}, ${n}`}
      @click=${this._cardClick}
      @keydown=${(l) => {
      (l.key === "Enter" || l.key === " ") && l.target === l.currentTarget && (l.preventDefault(), this._openWindow());
    }}
      @contextmenu=${(l) => l.preventDefault()}
    >${o}</div>`;
  }
};
Xt.styles = A`
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
Ms([
  v({ attribute: !1 })
], Xt.prototype, "hass", 2);
Ms([
  b()
], Xt.prototype, "_config", 2);
Ms([
  b()
], Xt.prototype, "_size", 2);
Xt = Ms([
  z(dc)
], Xt);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: hc } = go, ya = (t) => t, va = () => document.createComment(""), pe = (t, e, s) => {
  const i = t._$AA.parentNode, a = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const n = i.insertBefore(va(), a), o = i.insertBefore(va(), a);
    s = new hc(n, o, t, t.options);
  } else {
    const n = s._$AB.nextSibling, o = s._$AM, l = o !== t;
    if (l) {
      let c;
      s._$AQ?.(t), s._$AM = t, s._$AP !== void 0 && (c = t._$AU) !== o._$AU && s._$AP(c);
    }
    if (n !== a || l) {
      let c = s._$AA;
      for (; c !== n; ) {
        const h = ya(c).nextSibling;
        ya(i).insertBefore(c, a), c = h;
      }
    }
  }
  return s;
}, xt = (t, e, s = t) => (t._$AI(e, s), t), pc = {}, uc = (t, e = pc) => t._$AH = e, gc = (t) => t._$AH, Ws = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wa = (t, e, s) => {
  const i = /* @__PURE__ */ new Map();
  for (let a = e; a <= s; a++) i.set(t[a], a);
  return i;
}, $a = Nn(class extends Ln {
  constructor(t) {
    if (super(t), t.type !== jn.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let i;
    s === void 0 ? s = e : e !== void 0 && (i = e);
    const a = [], n = [];
    let o = 0;
    for (const l of t) a[o] = i ? i(l, o) : o, n[o] = s(l, o), o++;
    return { values: n, keys: a };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, i]) {
    const a = gc(t), { values: n, keys: o } = this.dt(e, s, i);
    if (!Array.isArray(a)) return this.ut = o, n;
    const l = this.ut ??= [], c = [];
    let h, p, u = 0, _ = a.length - 1, x = 0, f = n.length - 1;
    for (; u <= _ && x <= f; ) if (a[u] === null) u++;
    else if (a[_] === null) _--;
    else if (l[u] === o[x]) c[x] = xt(a[u], n[x]), u++, x++;
    else if (l[_] === o[f]) c[f] = xt(a[_], n[f]), _--, f--;
    else if (l[u] === o[f]) c[f] = xt(a[u], n[f]), pe(t, c[f + 1], a[u]), u++, f--;
    else if (l[_] === o[x]) c[x] = xt(a[_], n[x]), pe(t, a[u], a[_]), _--, x++;
    else if (h === void 0 && (h = wa(o, x, f), p = wa(l, u, _)), h.has(l[u])) if (h.has(l[_])) {
      const m = p.get(o[x]), $ = m !== void 0 ? a[m] : null;
      if ($ === null) {
        const w = pe(t, a[u]);
        xt(w, n[x]), c[x] = w;
      } else c[x] = xt($, n[x]), pe(t, a[u], $), a[m] = null;
      x++;
    } else Ws(a[_]), _--;
    else Ws(a[u]), u++;
    for (; x <= f; ) {
      const m = pe(t, c[f + 1]);
      xt(m, n[x]), c[x++] = m;
    }
    for (; u <= _; ) {
      const m = a[u++];
      m !== null && Ws(m);
    }
    return this.ut = o, uc(t, c), dt;
  }
});
function fc(t, e, s) {
  t.dispatchEvent(
    new CustomEvent(e, { detail: s, bubbles: !0, composed: !0 })
  );
}
const hi = ["lights", "climate"], pi = ["lights"], Fn = (t) => Array.isArray(t.quick) ? t.quick.filter((e) => hi.includes(e)) : pi;
function _c(t, e) {
  const s = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.type !== "light" || !t.states[i.entity]) continue;
    const a = t.states[i.entity].attributes.entity_id;
    Array.isArray(a) && a.length ? a.filter((n) => t.states[n]).forEach((n) => s.add(n)) : s.add(i.entity);
  }
  return [...s];
}
const mc = (t, e) => [...new Set(e.filter((s) => s.type === "climate" && t.states[s.entity]).map((s) => s.entity))];
function Ni(t, e, s) {
  const i = e === "lights" ? _c(t, s) : mc(t, s), a = i.filter((n) => e === "lights" ? t.states[n].state === "on" : !j(t.states[n])).length;
  return { ids: i, on: a };
}
function bc(t, e, s) {
  const { ids: i, on: a } = Ni(t, e, s);
  if (i.length) {
    if (e === "lights") {
      t.callService("light", a ? "turn_off" : "turn_on", {}, { entity_id: i });
      return;
    }
    for (const n of i) {
      const o = t.states[n];
      a && !j(o) ? Ai(t, o) : a || Mi(t, o);
    }
  }
}
var xc = Object.defineProperty, yc = Object.getOwnPropertyDescriptor, re = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? yc(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && xc(e, s, a), a;
};
let mt = class extends S {
  constructor() {
    super(...arguments), this._title = "", this._quick = [];
  }
  connectedCallback() {
    super.connectedCallback(), this._title = this.section.title, this._quick = Fn(this.section);
  }
  get heading() {
    return this._title || this.section.title;
  }
  _toggle(t) {
    const e = this._quick.includes(t);
    this._quick = hi.filter((s) => s === t ? !e : this._quick.includes(s));
  }
  renderContent() {
    const t = this.hass, e = (s) => {
      const i = Ni(t, s, this.section.cards).ids.length, a = this._quick.includes(s) && i > 0;
      return d`<button class="li" role="switch" aria-checked=${a} ?disabled=${!i} @click=${() => this._toggle(s)}>
        <span class="ic">${s === "lights" ? U(!1, 20) : Ce(20)}</span>
        <span class="nm">${r(t, s === "lights" ? "quick_lights" : "quick_climate")}<small>${i ? r(t, s === "lights" ? "quick_lights_sub" : "quick_climate_sub", { n: i }) : r(t, "quick_none")}</small></span>
        <span class="tog ${a ? "on" : ""}"></span>
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
          <div class="list">${hi.map(e)}</div>
          <p class="note">${r(t, "quick_note")}</p>
        </section>
        ${this.onRemove ? d`<button class="remove" @click=${() => {
      this.close(), this.onRemove();
    }}>${r(t, "delete_section")}</button>` : g}
      </div>
      <button class="cta" @click=${() => {
      this.onSave?.({ title: this._title.trim() || this.section.title, quick: this._quick }), this.close();
    }}>${r(t, "save")}</button>
    `;
  }
};
mt.styles = [
  S.styles,
  A`
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
re([
  v({ attribute: !1 })
], mt.prototype, "section", 2);
re([
  v({ attribute: !1 })
], mt.prototype, "onSave", 2);
re([
  v({ attribute: !1 })
], mt.prototype, "onRemove", 2);
re([
  b()
], mt.prototype, "_title", 2);
re([
  b()
], mt.prototype, "_quick", 2);
mt = re([
  z("terral-section-sheet")
], mt);
function vc(t, e, s, i) {
  document.querySelector("terral-section-sheet")?.remove();
  const a = document.createElement("terral-section-sheet");
  return a.hass = t, a.section = e, a.onSave = s, a.onRemove = i, document.body.appendChild(a), a;
}
var wc = Object.defineProperty, $c = Object.getOwnPropertyDescriptor, q = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? $c(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && wc(e, s, a), a;
};
const kc = [
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
function qs(t) {
  window.history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
let I = class extends S {
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
    } catch (a) {
      this._err = a?.message ?? String(a);
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
                @input=${(a) => {
      this._title = a.target.value, this._err = void 0;
    }} />
            </label>
            ${i && !s ? d`<button class="li" role="switch" aria-checked=${this._admin} @click=${() => this._admin = !this._admin}>
                  <span class="nm">${r(t, "dash_admin")}<small>${r(t, "dash_admin_sub")}</small></span><span class="tog ${this._admin ? "on" : ""}"></span>
                </button>` : g}
          </div>
          ${i ? d`<div class="icons">
                ${kc.map(
      (a) => d`<button class="icon ${this._icon === a || !this._icon && this._isHome && a === "mdi:home-roof" ? "sel" : ""}" aria-label=${a} @click=${() => this._icon = a}>
                    <ha-icon .icon=${a}></ha-icon>
                  </button>`
    )}
              </div>` : g}
          <p class="note">${r(t, "dash_sidebar_note")}</p>
        </section>
        ${s ? g : d`<section>
              <h3>${r(t, "fav_title")}</h3>
              <div class="list">
                <button class="li" role="switch" aria-checked=${this._favOn} @click=${() => this._favOn = !this._favOn}>
                  <span class="nm">${r(t, "fav_strip")}<small>${r(t, "fav_strip_sub")}</small></span><span class="tog ${this._favOn ? "on" : ""}"></span>
                </button>
                <div class="li ${this._favOn ? "" : "dim"}">
                  <span class="nm">${r(t, "fav_rows")}<small>${r(t, "fav_rows_sub")}</small></span>
                  <span class="seg">${[1, 2].map((a) => d`<button class=${this._rows === a ? "sel" : ""} ?disabled=${!this._favOn} @click=${() => this._rows = a}>${a}</button>`)}</span>
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
                    </button>` : g}
                ${e.admin && this._sysMain ? d`<button class="li" role="switch" aria-checked=${this._sysMain?.default_panel === e.panelUrl}
                      @click=${() => this._setMain("system", this._sysMain?.default_panel !== e.panelUrl)}>
                      <span class="nm">${r(t, "dash_main_all")}<small>${r(t, "dash_main_all_sub")}</small></span>
                      <span class="tog ${this._sysMain?.default_panel === e.panelUrl ? "on" : ""}"></span>
                    </button>` : g}
                ${this._sidebar !== null && this._sidebar !== void 0 ? d`<button class="li" role="switch" aria-checked=${this._onlyThis} @click=${() => this._setOnlyThis(!this._onlyThis)}>
                      <span class="nm">${r(t, "dash_only")}<small>${r(t, "dash_only_sub")}</small></span>
                      <span class="tog ${this._onlyThis ? "on" : ""}"></span>
                    </button>` : g}
              </div>
              <p class="note">${r(t, "dash_main_note")}</p>
            </section>` : g}
        ${this._err ? d`<p class="err">${this._err}</p>` : g}
        ${!s && e.onDelete && i ? d`<button class="remove" @click=${() => ze(t, {
      heading: r(t, "dash_delete_q", { name: this._title || this.options.info.id }),
      message: r(t, "dash_delete_msg"),
      actions: [{ label: r(t, "dash_delete"), danger: !0, run: async () => {
        this.close(), await e.onDelete?.();
      } }]
    })}>${r(t, "dash_delete")}</button>` : g}
      </div>
      <button class="cta" ?disabled=${this._busy} @click=${() => this._save()}>${r(t, s ? "dash_create" : "save")}</button>
    `;
  }
};
I.styles = [
  S.styles,
  A`
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
q([
  v({ attribute: !1 })
], I.prototype, "options", 2);
q([
  b()
], I.prototype, "_title", 2);
q([
  b()
], I.prototype, "_icon", 2);
q([
  b()
], I.prototype, "_admin", 2);
q([
  b()
], I.prototype, "_favOn", 2);
q([
  b()
], I.prototype, "_rows", 2);
q([
  b()
], I.prototype, "_busy", 2);
q([
  b()
], I.prototype, "_err", 2);
q([
  b()
], I.prototype, "_userMain", 2);
q([
  b()
], I.prototype, "_sysMain", 2);
q([
  b()
], I.prototype, "_sidebar", 2);
I = q([
  z("terral-dashboard-sheet")
], I);
function ka(t, e) {
  document.querySelector("terral-dashboard-sheet")?.remove();
  const s = document.createElement("terral-dashboard-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
var Sc = Object.defineProperty, Cc = Object.getOwnPropertyDescriptor, As = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Cc(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Sc(e, s, a), a;
};
function Mc(t, e) {
  const s = t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30) || "pagina";
  let i = s;
  for (let a = 2; e.includes(i); a++) i = `${s}-${a}`;
  return i;
}
let Kt = class extends S {
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
                </div>` : g}
          </div>
          ${this._err ? d`<p class="err">${this._err}</p>` : g}
        </section>
        ${s && e.address ? d`<section>
              <h3>${r(t, "page_address")}</h3>
              <div class="list"><div class="li"><span class="nm">${e.address}<small>${r(t, "page_address_sub")}</small></span></div></div>
            </section>` : g}
        ${s && !e.first && e.onDelete ? d`<button class="remove" @click=${() => {
      const i = this._title || e.title, a = (n) => {
        this.close(), e.onDelete?.(n);
      };
      if (!e.cards) {
        a(!1);
        return;
      }
      ze(t, {
        heading: r(t, "page_delete_q", { name: i }),
        message: r(t, "page_delete_msg", { n: e.cards }),
        actions: [
          { label: r(t, "page_keep", { home: e.homeTitle }), sub: r(t, "page_keep_sub"), run: () => a(!0) },
          { label: r(t, "page_remove_all"), danger: !0, run: () => a(!1) }
        ]
      });
    }}>${r(t, "page_delete")}</button>` : g}
      </div>
      <button class="cta" @click=${() => this._save()}>${r(t, s ? "save" : "page_create")}</button>
    `;
  }
};
Kt.styles = [
  S.styles,
  A`
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
As([
  v({ attribute: !1 })
], Kt.prototype, "options", 2);
As([
  b()
], Kt.prototype, "_title", 2);
As([
  b()
], Kt.prototype, "_err", 2);
Kt = As([
  z("terral-page-sheet")
], Kt);
function Sa(t, e) {
  document.querySelector("terral-page-sheet")?.remove();
  const s = document.createElement("terral-page-sheet");
  return s.hass = t, s.options = e, document.body.appendChild(s), s;
}
const Ac = {
  crepusculo: "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral: "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar: "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)"
};
function zc(t) {
  return Ac[t];
}
var Ec = Object.defineProperty, Tc = Object.getOwnPropertyDescriptor, Li = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Tc(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Ec(e, s, a), a;
};
const Dc = (t = 20) => y`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"></path></svg>`, Oc = (t = 20) => y`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M5 4v12M19 4v12M5 8h14M5 12h14M5 16h14M12 16v4"></path></svg>`, Pc = (t = 20) => y`<svg width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a8 8 0 1 1 16 0"></path><path d="M12 18l4-6"></path></svg>`, jc = [
  { type: "light", name: "type_light", desc: "type_light_desc", icon: () => U(!0, 20), color: "#ffb020" },
  { type: "alarm", name: "type_alarm", desc: "type_alarm_desc", icon: () => ys(20), color: "rgba(255,255,255,.18)" },
  { type: "charger", name: "ev_charger", desc: "type_charger_desc", icon: () => vs(20), color: "#34c77b" },
  { type: "climate", name: "type_climate", desc: "type_climate_desc", icon: () => Dc(), color: "#4696ff" },
  { type: "weather", name: "type_weather", desc: "type_weather_desc", icon: () => tt("partlycloudy", 26), color: "linear-gradient(180deg,#3a8ee6,#7cc0f5)" },
  { type: "vacuum", name: "type_vacuum", desc: "type_vacuum_desc", icon: () => Me(21), color: "#22a587" }
], Nc = [
  { name: "type_cover", icon: () => Oc() },
  { name: "type_sensor", icon: () => Pc() }
];
let Ne = class extends S {
  constructor() {
    super(...arguments), this._q = "";
  }
  get heading() {
    return r(this.hass, "add_card");
  }
  renderContent() {
    const t = this._q.trim().toLowerCase(), e = (n, o) => !t || r(this.hass, n).toLowerCase().includes(t) || o && r(this.hass, o).toLowerCase().includes(t), s = jc.filter((n) => e(n.name, n.desc)), i = (n) => n === "alarm" && !Object.keys(this.hass.states).some((o) => o.startsWith("alarm_control_panel.")) ? "alarm_missing" : n === "climate" && !Object.keys(this.hass.states).some((o) => o.startsWith("climate.")) ? "climate_missing" : n === "weather" && !Object.keys(this.hass.states).some((o) => o.startsWith("weather.")) ? "weather_missing" : n === "vacuum" && !Object.keys(this.hass.states).some((o) => o.startsWith("vacuum.")) ? "vacuum_missing" : void 0, a = Nc.filter((n) => e(n.name));
    return d`
      <label class="search">
        ${Ia()}
        <input type="search" placeholder=${r(this.hass, "search_card_types")} .value=${this._q}
          @input=${(n) => this._q = n.target.value} />
      </label>
      <div class="scroll">
        ${s.length ? d`<section>
              <h3>${r(this.hass, "available")}</h3>
              <div class="list">
                ${s.map((n) => {
      const o = i(n.type);
      return d`<button class="row ${o ? "soon" : ""}" ?disabled=${!!o} @click=${() => {
        this.close(), this.onType?.(n.type);
      }}>
                    <span class="ic" style="background:${o ? "rgba(255,255,255,.14)" : n.color}">${n.icon()}</span>
                    <span class="nm">${r(this.hass, n.name)}<small>${r(this.hass, o ?? n.desc)}</small></span>
                    ${o ? g : d`<span class="chev">${ss(!1, 16)}</span>`}
                  </button>`;
    })}
              </div>
            </section>` : g}
        ${a.length ? d`<section>
              <h3>${r(this.hass, "coming_soon")}</h3>
              <div class="list">
                ${a.map(
      (n) => d`<div class="row soon">
                    <span class="ic">${n.icon()}</span>
                    <span class="nm">${r(this.hass, n.name)}<small>${r(this.hass, "coming_soon")}</small></span>
                  </div>`
    )}
              </div>
            </section>` : g}
      </div>
    `;
  }
};
Ne.styles = [
  S.styles,
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
Li([
  v({ attribute: !1 })
], Ne.prototype, "onType", 2);
Li([
  b()
], Ne.prototype, "_q", 2);
Ne = Li([
  z("terral-add-sheet")
], Ne);
function Lc(t, e) {
  const s = document.createElement("terral-add-sheet");
  return s.hass = t, s.onType = e, document.body.appendChild(s), s;
}
var Ic = Object.defineProperty, Rc = Object.getOwnPropertyDescriptor, Ii = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Rc(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Ic(e, s, a), a;
};
let Le = class extends S {
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
          <span class="ic">${Co()}</span><span class="nm">${r(this.hass, "edit_home")}</span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onRooms?.();
    }}>
          <span class="ic">${zo()}</span>
          <span class="nm">${r(this.hass, "by_rooms")}<small>${r(this.hass, "by_rooms_sub")}</small></span>
        </button>
        <button class="row" @click=${() => {
      this.close(), this.actions.onDashboard?.();
    }}>
          <span class="ic">${K()}</span>
          <span class="nm">${r(this.hass, "dash_settings")}<small>${r(this.hass, "dash_settings_sub")}</small></span>
        </button>
        ${this.actions.onNewDashboard ? d`<button class="row" @click=${() => {
      this.close(), this.actions.onNewDashboard?.();
    }}>
              <span class="ic">${Nt(20)}</span>
              <span class="nm">${r(this.hass, "dash_new")}<small>${r(this.hass, "dash_new_sub")}</small></span>
            </button>` : ""}
        <button class="row" disabled>
          <span class="ic">${K()}</span>
          <span class="nm">${r(this.hass, "terral_settings")}<small>${r(this.hass, "coming_soon")}</small></span>
        </button>
      </div>
      <p class="foot">Terral Home v${this.version}<br />Nexa Projects by Manuel Escaño</p>
    `;
  }
};
Le.styles = [
  S.styles,
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
Ii([
  v({ attribute: !1 })
], Le.prototype, "actions", 2);
Ii([
  v()
], Le.prototype, "version", 2);
Le = Ii([
  z("terral-menu-sheet")
], Le);
function Hc(t, e, s) {
  const i = document.createElement("terral-menu-sheet");
  return i.hass = t, i.version = e, i.actions = s, document.body.appendChild(i), i;
}
const Yn = "0.14.0";
var Wc = Object.defineProperty, qc = Object.getOwnPropertyDescriptor, T = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? qc(e, s) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (i ? o(e, s, a) : o(a)) || a);
  return i && a && Wc(e, s, a), a;
};
const Y = "top", Ca = [
  { w: 1, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
  { w: 2, h: 4 }
], Uc = 0.85, nt = 2, Bc = 160, Fc = 184, Yc = 10, ue = 22, Ma = {
  light: "terral-home-light",
  alarm: "terral-home-alarm",
  charger: "terral-home-charger",
  climate: "terral-home-climate",
  weather: "terral-home-weather",
  vacuum: "terral-home-vacuum"
}, Vc = ["entity", "device", "name", "invert", "use_light_color", "status_entity", "power_entity", "energy_entity", "max_power", "min_temp", "max_temp", "temp_step", "mode_rules", "show_swing", "forecast_2x2", "animate", "show_details", "forecast_days", "routines"], Qt = "#3a4f80", Ve = "58,79,128", Gc = `linear-gradient(180deg, ${Qt} 0, rgba(${Ve},.6) 36px, rgba(${Ve},0) 120px), linear-gradient(0deg, ${Qt} 0, rgba(${Ve},.6) 28px, rgba(${Ve},0) 96px), `, Us = Qt, Xc = Qt, Bs = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
let C = class extends N {
  constructor() {
    super(...arguments), this.narrow = !1, this._edit = !1, this._cols = 2, this._rowH = 82, this._dragDx = 0, this._dragDy = 0, this._lanes = 1, this._laneW = 358, this._pad = 16, this._strip = 0, this._colW = 160, this._gap = 10, this._els = /* @__PURE__ */ new Map(), this._loading = !1, this._pending = 0, this._onKey = (t) => {
      t.key !== "Escape" || this._renaming || this._edit && !document.querySelector("terral-add-sheet, terral-menu-sheet, terral-confirm-sheet, terral-card-config, terral-section-sheet, terral-dashboard-sheet, terral-page-sheet") && (this._edit = !1);
    }, this._add = () => {
      !this.hass || !this._layout || Lc(this.hass, (t) => {
        Cn(this.hass, Yr(t), {
          mode: "add",
          onBack: () => this._add(),
          onSave: (e) => {
            const s = { id: Bs(), type: e.type, ...e.config, w: e.w, h: e.h };
            this._update((i) => i.cards.push(s));
          }
        });
      });
    }, this._menu = () => {
      if (!this.hass) return;
      const t = this.hass.user?.is_admin !== !1;
      Hc(this.hass, this.panel?.config?.version ?? Yn, {
        onEdit: () => this._edit = !0,
        onRooms: () => this._confirmRooms(),
        onDashboard: () => this._dashboardSettings(),
        onNewDashboard: t ? () => this._newDashboard() : void 0
      });
    }, this._addSection = () => {
      const t = Bs();
      this._update((e) => e.sections.push({ id: t, title: r(this.hass, "new_section"), cards: [] })), this._renaming = t;
    }, this._onCardConfig = (t) => {
      const e = t.target, s = [...this._els].find(([, n]) => n === e)?.[0];
      if (!s) return;
      t.preventDefault();
      const { config: i, size: a } = t.detail;
      this._update((n) => {
        for (const o of [n.cards, ...n.sections.map((l) => l.cards)]) {
          const l = o.find((c) => c.id === s);
          if (l) {
            for (const c of Vc)
              i[c] === void 0 || i[c] === "" ? delete l[c] : l[c] = i[c];
            a && (l.w = a.w, l.h = a.h);
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
    if (t.has("panel") && this._dashLoaded && this._dashLoaded !== this._dash && (this._unsub?.then((s) => s()).catch(() => {
    }), this._unsub = void 0, this._layout = void 0, this._loading = !1, this._edit = !1, this._els.clear()), (t.has("hass") || t.has("panel")) && this.hass) {
      !this._layout && !this._loading && this._load();
      for (const s of this._els.values()) s.hass = this.hass;
      Vr(this.hass);
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
    const e = document.querySelector('meta[name="theme-color"]'), s = document.documentElement, i = document.body, a = [
      [s, "background", Qt],
      [i, "background", Qt],
      // The Companion app paints the status-bar and home-bar areas natively
      // from these theme variables; point them at our edge colour.
      [i, "--app-header-background-color", Us],
      [i, "--app-theme-color", Us],
      [i, "--primary-background-color", Xc]
    ];
    if (t) {
      if (this._chromeSaved) return;
      this._chromeSaved = {
        meta: e?.content ?? null,
        props: a.map(([n, o]) => [n, o, n.style.getPropertyValue(o), n.style.getPropertyPriority(o)])
      };
      for (const [n, o, l] of a) n.style.setProperty(o, l);
      e && (e.content = Us), this._themeUpdate();
    } else if (this._chromeSaved) {
      for (const [n, o, l, c] of this._chromeSaved.props)
        l ? n.style.setProperty(o, l, c) : n.style.removeProperty(o);
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
      const i = e ? s.pages.find((a) => a.id === e) : s;
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
    qs(t ? `${this._prefix}/${t}` : this._prefix);
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
    return e === Y ? t.cards : t.sections.find((s) => s.id === e)?.cards;
  }
  _findCard(t) {
    const e = this._top.find((s) => s.id === t);
    if (e) return { key: Y, card: e };
    for (const s of this._sections) {
      const i = s.cards.find((a) => a.id === t);
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
    const e = t < 600 ? 16 : 24, s = Yc, i = t - 2 * e, a = nt * Bc + (nt - 1) * s, n = Math.max(1, Math.floor((i + ue) / (a + ue))), o = (i - (n - 1) * ue) / n, l = Math.min(Fc, (o - (nt - 1) * s) / nt), c = window.__terralRowRatio ?? Uc, h = Math.max(48, Math.round((l - s) / 2 * c));
    this._colW = l, this._gap = s;
    const p = Math.round(nt * l + (nt - 1) * s);
    nt !== this._cols && (this._cols = nt), h !== this._rowH && (this._rowH = h), n !== this._lanes && (this._lanes = n), p !== this._laneW && (this._laneW = p), e !== this._pad && (this._pad = e);
  }
  /** Rows a list of cards takes in its 2-column grid (same "row dense" packing as CSS). */
  _rowsOf(t) {
    const e = [], s = (a, n, o, l) => {
      for (let c = a; c < a + l; c++) for (let h = n; h < n + o; h++) if (h >= this._cols || e[c]?.[h]) return !1;
      return !0;
    };
    let i = 0;
    for (const a of t) {
      const { w: n, h: o } = this._sizeOf(a);
      for (let l = 0; ; l++) {
        const c = [...Array(this._cols - n + 1).keys()].find((h) => s(l, h, n, o));
        if (c != null) {
          for (let h = l; h < l + o; h++) for (let p = c; p < c + n; p++) (e[h] ??= [])[p] = !0;
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
      const i = e.reduce((a, n) => n.h < a.h - 0.01 ? n : a);
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
    return t === Y && this._strip > 0;
  }
  /** The corner grip only shows when the card has more than one size to offer. */
  _canResize(t, e = !1) {
    return e && this._strip === 1 ? !1 : (this._els.get(t.id)?.getTerralSizes?.() ?? Ca).filter((i) => i.w <= this._cols && (!e || i.h <= this._strip)).length > 1;
  }
  _element(t, e) {
    let s = this._els.get(t.id);
    s || (s = document.createElement(Ma[t.type] ?? "terral-home-light"), this._els.set(t.id, s));
    const { id: i, type: a, w: n, h: o, ...l } = t, { w: c, h } = e ?? { w: n, h: o }, p = { ...l, type: `custom:${Ma[t.type] ?? "terral-home-light"}`, view_layout: { terral: { w: c, h } } }, u = JSON.stringify(p);
    if (s.dataset.cfg !== u) {
      try {
        s.setConfig(p);
      } catch (_) {
        console.warn("Terral Home:", _);
      }
      s.dataset.cfg = u;
    }
    return this.hass && s.hass !== this.hass && (s.hass = this.hass), s;
  }
  // ---- Pages ----------------------------------------------------------------
  /** Page pills under the title: shown with 2+ pages, or in move mode (to add one). */
  _pills(t) {
    const e = this._pages;
    if (!this._layout || !e.length && !t) return g;
    const s = this._pageId, i = this._drag?.kind === "card" ? this._dropCard?.page : void 0, a = (n, o) => {
      const l = n === s;
      return d`<button
        class="pg ${l ? "on" : ""} ${i === n && !l ? "drop" : ""}"
        data-page=${n}
        aria-current=${l ? "page" : "false"}
        @click=${() => l ? t && this._pageSettings() : this._goPage(n)}
      >${o}${l && t ? d`<span class="pgear" aria-label=${r(this.hass, "page_settings")}>${K(15)}</span>` : g}</button>`;
    };
    return d`<nav class="pills" aria-label=${r(this.hass, "pages")}>
      ${a("", this._homeTitle)}
      ${e.map((n) => a(n.id, n.title))}
      ${t ? d`<button class="pg add" @click=${() => this._addPage()}>${Nt(16)}${r(this.hass, "page_add")}</button>` : g}
    </nav>`;
  }
  _addPage() {
    this.hass && Sa(this.hass, {
      mode: "create",
      title: "",
      first: !1,
      homeTitle: this._homeTitle,
      onSave: (t) => {
        const e = Mc(t, this._pages.map((s) => s.id));
        this._updateRoot((s) => {
          s.pages = [...s.pages ?? [], { id: e, title: t, cards: [], sections: [] }];
        }), this._goPage(e);
      }
    });
  }
  _pageSettings() {
    if (!this.hass) return;
    const t = this._pageId, e = this._pages, s = e.findIndex((n) => n.id === t), i = s >= 0 ? e[s] : void 0, a = (i?.cards?.length ?? 0) + (i?.sections ?? []).reduce((n, o) => n + o.cards.length, 0);
    Sa(this.hass, {
      mode: "edit",
      title: i ? i.title : this._layout?.page_title ?? "",
      first: !i,
      index: s + 2,
      count: e.length + 1,
      address: i ? `${this._prefix}/${i.id}` : this._prefix,
      cards: a,
      homeTitle: this._homeTitle,
      onSave: (n) => this._updateRoot((o) => {
        if (!i) {
          n ? o.page_title = n : delete o.page_title;
          return;
        }
        const l = o.pages.find((c) => c.id === t);
        l && n && (l.title = n);
      }),
      onMove: (n) => {
        this._updateRoot((o) => {
          const l = o.pages, c = l.findIndex((p) => p.id === t), h = c + n;
          c < 0 || h < 0 || h >= l.length || ([l[c], l[h]] = [l[h], l[c]]);
        }), document.querySelector("terral-page-sheet")?.close();
      },
      onDelete: (n) => {
        this._updateRoot((o) => {
          const l = o.pages, c = l.findIndex((p) => p.id === t);
          if (c < 0) return;
          const [h] = l.splice(c, 1);
          n ? (o.cards.push(...h.cards ?? []), o.sections.push(...h.sections ?? [])) : [...h.cards ?? [], ...(h.sections ?? []).flatMap((p) => p.cards)].forEach((p) => this._els.delete(p.id)), l.length || delete o.pages;
        }), this._goPage("");
      }
    });
  }
  /** Move a card to the favourites of another page (dropped on its pill). */
  _moveCardToPage(t, e) {
    const s = this._findCard(t), i = this._pageId;
    !s || e === i || this._updateRoot((a) => {
      const n = (u) => u ? a.pages.find((_) => _.id === u) : a, o = n(i), l = n(e);
      if (!o || !l) return;
      const c = s.key === Y ? o.cards : (o.sections ?? []).find((u) => u.id === s.key)?.cards, h = c?.findIndex((u) => u.id === t) ?? -1;
      if (!c || h < 0) return;
      const [p] = c.splice(h, 1);
      (l.cards ??= []).push(p);
    });
  }
  // ---- Dashboards -----------------------------------------------------------
  async _dashboardSettings() {
    const t = this.hass;
    if (!t) return;
    const s = (await t.callWS({ type: "terral_home/dashboards/list" }).catch(() => [])).find((i) => i.id === this._dash) ?? { id: this._dash };
    ka(t, {
      mode: "edit",
      info: s,
      panelUrl: this._prefix.replace(/^\//, ""),
      favorites: this._favorites,
      admin: t.user?.is_admin !== !1,
      onSave: async ({ title: i, icon: a, require_admin: n, favorites: o }) => {
        const l = this._favorites;
        (o.enabled !== l.enabled || o.rows !== l.rows) && this._updateRoot((c) => {
          const h = {};
          o.enabled || (h.enabled = !1), o.rows === 1 && (h.rows = 1), Object.keys(h).length ? c.favorites = h : delete c.favorites;
        }), ((i ?? "") !== (s.title ?? "") || (a ?? "") !== (s.icon ?? "") || !!n != !!s.require_admin) && (await t.callWS({ type: "terral_home/dashboards/update", dashboard: this._dash, title: i || null, icon: a || null, require_admin: !!n }), this._titleOverride = i || void 0);
      },
      onDelete: this._dash === "home" ? void 0 : async () => {
        await t.callWS({ type: "terral_home/dashboards/delete", dashboard: this._dash }), qs("/terral-home");
      }
    });
  }
  _newDashboard() {
    const t = this.hass;
    t && ka(t, {
      mode: "create",
      info: { id: "" },
      favorites: { enabled: !0, rows: 2 },
      admin: !0,
      onSave: async ({ title: e, icon: s }) => {
        const i = await t.callWS({ type: "terral_home/dashboards/create", title: e, icon: s });
        window.setTimeout(() => qs(`/terral-home-${i.id}`), 300);
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
    const s = e.trim(), i = this._sections.find((a) => a.id === t);
    !i || !s || s === i.title || this._update((a) => {
      const n = a.sections.find((o) => o.id === t);
      n && (n.title = s);
    });
  }
  _removeSection(t) {
    const e = this._sections.findIndex((a) => a.id === t), s = this._sections[e];
    if (!s || !this.hass) return;
    const i = (a) => this._update((n) => {
      const o = n.sections.findIndex((c) => c.id === t);
      if (o < 0) return;
      const [l] = n.sections.splice(o, 1);
      a ? (o > 0 ? n.sections[o - 1].cards : n.cards).push(...l.cards) : l.cards.forEach((c) => this._els.delete(c.id));
    });
    if (!s.cards.length) return i(!1);
    ze(this.hass, {
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
    this.hass && ze(this.hass, {
      heading: r(this.hass, "by_rooms"),
      message: r(this.hass, "by_rooms_msg"),
      actions: [{ label: r(this.hass, "by_rooms_go"), run: () => this._sectionsFromRooms() }]
    });
  }
  _sectionsFromRooms() {
    const t = this.hass;
    t && (this._update((e) => {
      const s = new Map(e.sections.map((o) => [o.title.toLowerCase(), o])), i = [e.cards, ...e.sections.map((o) => o.cards)], a = [];
      for (const o of i)
        for (const l of [...o]) {
          const c = Ze(t, l.entity);
          c && (a.push([l, c]), o.splice(o.indexOf(l), 1));
        }
      const n = [...new Set(a.map(([, o]) => o))].filter((o) => !s.has(o.toLowerCase())).sort((o, l) => o.localeCompare(l));
      for (const o of n) {
        const l = { id: Bs(), title: o, cards: [] };
        e.sections.push(l), s.set(o.toLowerCase(), l);
      }
      for (const [o, l] of a) s.get(l.toLowerCase()).cards.push(o);
    }), this._edit = !0);
  }
  // ---- Resize from the bottom-right corner --------------------------------
  _resizeDown(t, e) {
    t.preventDefault(), t.stopPropagation();
    const s = t.currentTarget, i = s.closest(".cell").getBoundingClientRect(), a = this._findCard(e.id)?.key === Y && this._strip > 0, n = (this._els.get(e.id)?.getTerralSizes?.() ?? Ca).filter((l) => l.w <= this._cols && (!a || l.h <= this._strip));
    this._resizeOrigin = { left: i.left, top: i.top, sizes: n };
    const o = this._sizeOf(e, a);
    this._resize = { id: e.id, w: o.w, h: o.h }, s.setPointerCapture(t.pointerId);
  }
  _resizeMove(t) {
    const e = this._resizeOrigin;
    if (!this._resize || !e) return;
    const s = (t.clientX - e.left + this._gap) / (this._colW + this._gap), i = (t.clientY - e.top + this._gap) / (this._rowH + this._gap);
    let a = e.sizes[0], n = 1 / 0;
    for (const o of e.sizes) {
      const l = (o.w - s) ** 2 + (o.h - i) ** 2;
      l < n && ([a, n] = [o, l]);
    }
    (a.w !== this._resize.w || a.h !== this._resize.h) && (this._resize = { ...this._resize, w: a.w, h: a.h }, navigator.vibrate?.(6));
  }
  _resizeUp() {
    const t = this._resize;
    if (this._resize = void 0, this._resizeOrigin = void 0, !t) return;
    const e = this._findCard(t.id);
    if (!e) return;
    const s = this._sizeOf(e.card, this._inStrip(e.key));
    s.w === t.w && s.h === t.h || this._update((i) => {
      const a = C._list(i, e.key)?.find((n) => n.id === t.id);
      a && Object.assign(a, { w: t.w, h: t.h });
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
      this._dropCard = { key: Y, page: i.dataset.page };
      return;
    }
    const a = s.find((o) => o.dataset?.cid != null && o.dataset.cid !== this._drag?.id);
    if (a) {
      this._dropCard = { key: a.dataset.key, targetId: a.dataset.cid };
      return;
    }
    const n = s.find((o) => o.dataset?.zone != null);
    n && (this._dropCard = { key: n.dataset.zone });
  }
  /** Section drop target: the lane under the finger, then before the first section whose middle is below it. */
  _hitSection(t, e) {
    const s = this._drag?.id, i = this._sections.filter((h) => h.id !== s).map((h) => h.id), a = [...this.renderRoot.querySelectorAll(".lane")];
    if (!a.length) return;
    const n = (h) => {
      const p = h.getBoundingClientRect();
      return Math.abs(t - (p.left + p.width / 2));
    }, o = a.reduce((h, p) => n(p) < n(h) ? p : h), l = [...o.querySelectorAll("section[data-sid]")].filter((h) => h.dataset.sid !== s), c = l.find((h) => {
      const p = h.getBoundingClientRect();
      return p.top + p.height / 2 > e;
    });
    if (c)
      this._dropSection = i.indexOf(c.dataset.sid), this._dropMark = { sid: c.dataset.sid };
    else if (l.length) {
      const h = l[l.length - 1].dataset.sid;
      this._dropSection = i.indexOf(h) + 1, this._dropMark = { sid: h, after: !0 };
    } else
      this._dropSection = i.length, this._dropMark = { lane: a.indexOf(o) };
  }
  _moveCard(t, e, s) {
    const i = this._findCard(t);
    !i || s === t || this._update((a) => {
      const n = C._list(a, i.key), o = n.findIndex((_) => _.id === t), l = s ? n.findIndex((_) => _.id === s) : -1, [c] = n.splice(o, 1), h = C._list(a, e);
      if (!h) {
        n.splice(o, 0, c);
        return;
      }
      if (!s) {
        h.push(c);
        return;
      }
      const p = h.findIndex((_) => _.id === s), u = i.key === e && l > o;
      h.splice(p < 0 ? h.length : p + (u ? 1 : 0), 0, c);
    });
  }
  _moveSection(t, e) {
    const s = this._sections.findIndex((i) => i.id === t);
    s < 0 || s === e || this._update((i) => {
      const a = i.sections.findIndex((o) => o.id === t), [n] = i.sections.splice(a, 1);
      i.sections.splice(Math.min(e, i.sections.length), 0, n);
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
    const a = e.scrollTop;
    e.scrollTop += i;
    const n = e.scrollTop - a;
    this._dragStart = { x: this._dragStart.x, y: this._dragStart.y - n }, this._dragDy += n;
  }
  // ---- Render -------------------------------------------------------------
  render() {
    const t = this._edit, e = !!this._layout, s = this._top, i = this._sections, a = e && !this._allCards.length, n = this._drag?.kind === "card", o = this._drag?.kind === "section", l = s.length > 0 || a || t && (n || !i.length), c = this._favorites, h = c.enabled && this._lanes > 1 && !a && (s.length > 0 || t && i.length > 0);
    this._strip = h ? c.rows : 0;
    const p = [];
    l && !h && p.push({ item: { kind: "top" }, rows: Math.max(this._rowsOf(s), a || t && !i.length ? 2 : 1), titled: !1 });
    for (const m of i) (t || m.cards.length) && p.push({ item: { kind: "sec", s: m }, rows: this._rowsOf(m.cards), titled: !0 });
    const u = this._assignLanes(p), _ = this._dropMark, x = d`<div class="dropline"></div>`, f = this._lanes * this._laneW + (this._lanes - 1) * ue;
    return d`
      <div class="scroller" style="background:${Gc}${zc("crepusculo")}" @terral-card-hold=${this._onHold} @terral-card-config=${this._onCardConfig} @terral-card-remove=${this._onCardRemove}>
        <div class="wrap ${t ? "editing" : ""}" style="max-width:${f + 2 * this._pad}px">
          <div class="top">
            <button class="glass round" aria-label=${r(this.hass, "menu")} @click=${() => fc(this, "hass-toggle-menu")}>
              ${So()}
            </button>
            <span class="spacer"></span>
            ${t ? d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} @click=${this._add}>${Nt(22)}</button>
                  <button class="pbtn done" @click=${() => this._edit = !1}>${r(this.hass, "done")}</button>
                </div>` : d`<div class="glass pill">
                  <button class="pbtn" aria-label=${r(this.hass, "add_accessory")} ?disabled=${!e} @click=${this._add}>${Nt(22)}</button>
                  <button class="pbtn" aria-label=${r(this.hass, "more_options")} @click=${this._menu}>${Mo(22)}</button>
                </div>`}
          </div>
          <h1>${this._title}</h1>
          ${this._pills(t)}
          ${this._error ? d`<p class="notice">${r(this.hass, "panel_error")} (${this._error})</p>` : g}
          ${h ? d`<div class="favs">${this._grid(Y, s, t, !1, s.length === 0 && t ? r(this.hass, "fav_drop") : void 0)}</div>` : g}
          <div class="lanes" style="--lane-gap:${ue}px">
            ${u.map(
      (m, $) => d`<div class="lane" style="width:${this._laneW}px">
                ${$a(
        m,
        (w) => w.kind === "top" ? Y : w.s.id,
        (w) => {
          if (w.kind === "top")
            return d`<div class="topblock">${this._grid(Y, s, t, a || t && !i.length, s.length === 0 && t ? r(this.hass, "no_section") : void 0)}</div>`;
          const D = w.s, F = o && this._drag?.id === D.id, Z = o && !F && _?.sid === D.id;
          return d`${Z && !_?.after ? x : g}${this._section(D, t, F)}${Z && _?.after ? x : g}`;
        }
      )}
                ${o && _?.lane === $ ? x : g}
              </div>`
    )}
          </div>
          ${t && e ? d`<button class="addsec" @click=${this._addSection}>${Nt(20)}<span>${r(this.hass, "add_section")}</span></button>` : g}
        </div>
        <div class="fade" aria-hidden="true"></div>
      </div>
    `;
  }
  _section(t, e, s) {
    const i = this._renaming === t.id, a = s ? `translate:${this._dragDx}px ${this._dragDy}px` : "";
    return d`<section class="sec ${s ? "lifted" : ""}" data-sid=${t.id} style=${a}>
      <header>
        ${e ? d`<button class="sdel" aria-label=${r(this.hass, "delete_section")} @click=${() => this._removeSection(t.id)}>${Zi()}</button>` : g}
        ${i ? d`<input
              class="rename"
              .value=${t.title}
              maxlength="40"
              enterkeyhint="done"
              @keydown=${(n) => {
      n.key === "Enter" && this._commitRename(t.id, n.target.value), n.key === "Escape" && (this._renaming = void 0);
    }}
              @blur=${(n) => this._commitRename(t.id, n.target.value)}
            />` : e ? d`<button class="title" aria-label=${r(this.hass, "rename_section")} @click=${() => this._renaming = t.id}>${t.title}</button>` : d`<h2>${t.title}</h2>`}
        ${e ? d`<button class="sgear" aria-label=${r(this.hass, "section_settings")} @click=${() => this._sectionSettings(t)}>${K(18)}</button>` : this._quickButtons(t)}
        ${e ? d`<button
              class="handle"
              aria-label=${r(this.hass, "move_section")}
              @pointerdown=${(n) => this._handleDown(n, t.id)}
            >${Ao()}</button>` : g}
      </header>
      ${this._grid(t.id, t.cards, e, !1, e && !t.cards.length ? r(this.hass, "drop_here") : void 0)}
    </section>`;
  }
  /** Quick actions on the right of a section title (hidden in move mode). */
  _quickButtons(t) {
    const e = this.hass;
    if (!e) return g;
    const s = Fn(t).map((i) => ({ k: i, ...Ni(e, i, t.cards) })).filter((i) => i.ids.length);
    return s.length ? d`<div class="quick">
      ${s.map(
      (i) => d`<button
          class="qb ${i.on ? "on" : ""} ${i.k}"
          aria-label=${r(e, i.k === "lights" ? i.on ? "quick_lights_off" : "quick_lights_on" : i.on ? "quick_climate_off" : "quick_climate_on")}
          @click=${() => bc(e, i.k, t.cards)}
        >${i.k === "lights" ? U(i.on > 0, 21) : Ce(20)}${i.on ? d`<span class="n">${i.on}</span>` : g}</button>`
    )}
    </div>` : g;
  }
  _sectionSettings(t) {
    this.hass && vc(
      this.hass,
      t,
      ({ title: e, quick: s }) => this._update((i) => {
        const a = i.sections.find((n) => n.id === t.id);
        a && (a.title = e, s.length === pi.length && s.every((n) => pi.includes(n)) ? delete a.quick : a.quick = s);
      }),
      () => this._removeSection(t.id)
    );
  }
  _grid(t, e, s, i, a) {
    const n = this._drag?.kind === "card" && this._dropCard?.key === t && !this._dropCard.targetId && this._dropCard.page == null, o = this._inStrip(t), l = o ? `grid-auto-flow:column dense;grid-template-rows:repeat(${this._strip},${this._rowH}px);grid-auto-columns:${this._colW}px;gap:${this._gap}px` : `grid-template-columns:repeat(${this._cols},minmax(0,1fr));grid-auto-rows:${this._rowH}px;gap:${this._gap}px`;
    return d`<div
      class="grid ${n ? "zone-target" : ""} ${t === Y ? "top-grid" : ""} ${o ? "strip" : ""}"
      data-zone=${t}
      style=${l}
    >
      ${$a(e, (c) => c.id, (c, h) => this._cell(t, c, h, s))}
      ${a && !e.length ? d`<div class="placeholder" style=${o ? `grid-row:1/-1;width:${this._laneW}px` : "grid-column:1/-1"}>${a}</div>` : g}
      ${i ? d`<button class="add" style="grid-row:span 2" @click=${this._add}>
            <span class="addic">${Nt(26)}</span><span>${r(this.hass, "add_accessory")}</span>
          </button>` : g}
    </div>`;
  }
  _cell(t, e, s, i) {
    const a = this._sizeOf(e, this._inStrip(t)), { w: n, h: o } = a, l = this._drag?.kind === "card" && this._drag.id === e.id, c = this._drag?.kind === "card" && this._dropCard?.targetId === e.id, h = `grid-column:span ${n};grid-row:span ${o};--d:${s % 5 * -0.07}s;${l ? `translate:${this._dragDx}px ${this._dragDy}px;z-index:5` : ""}`;
    return d`<div class="cell ${l ? "dragging" : ""} ${c ? "target" : ""}" data-cid=${e.id} data-key=${t} style=${h}>
      ${this._element(e, a)}
      ${i ? d`<div class="overlay" @pointerdown=${(p) => this._overlayDown(p, e.id)}>
            <button class="del" aria-label=${r(this.hass, "delete")} @click=${() => this._remove(e.id)}>${Zi()}</button>
            ${this._canResize(e, this._inStrip(t)) ? d`<button
              class="corner"
              aria-label=${r(this.hass, "resize")}
              @pointerdown=${(p) => this._resizeDown(p, e)}
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
C.styles = A`
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
      padding: 0 14px;
      gap: 6px;
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
T([
  v({ attribute: !1 })
], C.prototype, "hass", 2);
T([
  v({ type: Boolean })
], C.prototype, "narrow", 2);
T([
  v({ attribute: !1 })
], C.prototype, "route", 2);
T([
  v({ attribute: !1 })
], C.prototype, "panel", 2);
T([
  b()
], C.prototype, "_layout", 2);
T([
  b()
], C.prototype, "_error", 2);
T([
  b()
], C.prototype, "_edit", 2);
T([
  b()
], C.prototype, "_cols", 2);
T([
  b()
], C.prototype, "_rowH", 2);
T([
  b()
], C.prototype, "_drag", 2);
T([
  b()
], C.prototype, "_dropCard", 2);
T([
  b()
], C.prototype, "_dropSection", 2);
T([
  b()
], C.prototype, "_dragDx", 2);
T([
  b()
], C.prototype, "_dragDy", 2);
T([
  b()
], C.prototype, "_resize", 2);
T([
  b()
], C.prototype, "_renaming", 2);
T([
  b()
], C.prototype, "_lanes", 2);
T([
  b()
], C.prototype, "_laneW", 2);
T([
  b()
], C.prototype, "_pad", 2);
T([
  b()
], C.prototype, "_dropMark", 2);
T([
  b()
], C.prototype, "_titleOverride", 2);
C = T([
  z("terral-home-panel")
], C);
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
R.customCards.some((t) => t.type === "terral-home-weather") || R.customCards.push({
  type: "terral-home-weather",
  name: "Terral · Tiempo",
  description: "El tiempo y su previsión al estilo Terral Home / Terral Home weather and forecast",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home"
});
R.customCards.some((t) => t.type === "terral-home-vacuum") || R.customCards.push({
  type: "terral-home-vacuum",
  name: "Terral · Robot",
  description: "Robot aspirador / friegasuelos (Roborock y otros) al estilo Terral Home / Terral Home robot vacuum",
  preview: !0,
  documentationURL: "https://github.com/nexaproject-repository/terral-home",
  getEntitySuggestion: (t, e) => e.startsWith("vacuum.") ? { config: { type: "custom:terral-home-vacuum", entity: e } } : null
});
console.info(
  `%c TERRAL HOME %c v${Yn} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  ""
);
export {
  Yn as VERSION
};
