// Pill slider used for brightness and colour temperature.
// Horizontal sliders keep vertical page scrolling (touch-action: pan-y);
// vertical ones are only used inside the light window, which doesn't scroll.
import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("terral-slider")
export class TerralSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean, reflect: true }) vertical = false;
  /** "fill" draws a bar from the start; "thumb" draws a marker (temperature). */
  @property() mode: "fill" | "thumb" = "fill";
  @property() label = "";
  @property() suffix = "%";
  @property({ type: Boolean, attribute: "show-value" }) showValue = false;

  @state() private _drag?: number;
  private _startX = 0;
  private _startY = 0;
  private _active = false;

  static styles = css`
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

  private get _shown(): number {
    return this._drag ?? this.value;
  }

  private _pct(v: number): number {
    return ((v - this.min) / (this.max - this.min)) * 100;
  }

  private _valueAt(ev: PointerEvent): number {
    const r = this.getBoundingClientRect();
    const f = this.vertical ? 1 - (ev.clientY - r.top) / r.height : (ev.clientX - r.left) / r.width;
    const v = this.min + Math.max(0, Math.min(1, f)) * (this.max - this.min);
    return Math.round(v);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.tabIndex = 0;
    this.setAttribute("role", "slider");
    this.addEventListener("pointerdown", this._down);
    this.addEventListener("keydown", this._key);
    this.addEventListener("click", (e) => e.stopPropagation());
  }

  updated(): void {
    this.setAttribute("aria-label", this.label);
    this.setAttribute("aria-valuemin", String(this.min));
    this.setAttribute("aria-valuemax", String(this.max));
    this.setAttribute("aria-valuenow", String(this._shown));
    this.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
  }

  private _down = (ev: PointerEvent) => {
    ev.stopPropagation();
    this._startX = ev.clientX;
    this._startY = ev.clientY;
    // Vertical sliders grab at once; horizontal ones wait to see the gesture
    // direction so a vertical swipe still scrolls the page.
    this._active = this.vertical;
    if (this._active) {
      this.setPointerCapture(ev.pointerId);
      this._drag = this._valueAt(ev);
    }
    this.addEventListener("pointermove", this._move);
    this.addEventListener("pointerup", this._up);
    this.addEventListener("pointercancel", this._cancel);
  };

  private _move = (ev: PointerEvent) => {
    if (!this._active) {
      const dx = Math.abs(ev.clientX - this._startX);
      const dy = Math.abs(ev.clientY - this._startY);
      if (dy > 8 && dy > dx) return this._cancel();
      if (dx < 6) return;
      this._active = true;
      this.setPointerCapture(ev.pointerId);
    }
    this._drag = this._valueAt(ev);
    this.dispatchEvent(new CustomEvent("value-input", { detail: { value: this._drag } }));
  };

  private _up = (ev: PointerEvent) => {
    const tap = !this._active;
    const v = tap ? this._valueAt(ev) : this._drag;
    this._cleanup();
    if (v != null) this._commit(v);
  };

  private _cancel = () => {
    this._cleanup();
    this._drag = undefined;
  };

  private _cleanup() {
    this._active = false;
    this.removeEventListener("pointermove", this._move);
    this.removeEventListener("pointerup", this._up);
    this.removeEventListener("pointercancel", this._cancel);
  }

  private _commit(v: number) {
    this._drag = undefined;
    this.value = v;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: v } }));
  }

  private _key = (ev: KeyboardEvent) => {
    const step = (this.max - this.min) / 20;
    const up = ["ArrowUp", "ArrowRight"].includes(ev.key);
    const down = ["ArrowDown", "ArrowLeft"].includes(ev.key);
    if (!up && !down) return;
    ev.preventDefault();
    const v = Math.max(this.min, Math.min(this.max, Math.round(this.value + (up ? step : -step))));
    this._commit(v);
  };

  render() {
    const p = this._pct(this._shown);
    const fill = this.mode === "fill";
    return html`
      ${fill
        ? html`<div class="fill" style=${this.vertical ? `height:${p}%` : `width:${p}%`}></div>`
        : html`<div class="thumb" style=${this.vertical ? `bottom:${p}%` : `left:${p}%`}></div>`}
      <div class="label">
        <slot></slot>
        ${this.showValue ? html`<span>${this._shown}${this.suffix ? html`&nbsp;${this.suffix}` : nothing}</span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-slider": TerralSlider;
  }
}
