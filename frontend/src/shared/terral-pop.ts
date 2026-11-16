// Small floating menu (mode / fan speed), opened from a button. Everything
// behind it is blurred; a tap outside only closes the menu (it never reaches
// the card underneath).
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface PopItem {
  label: string;
  icon?: unknown;
  selected?: boolean;
  run: () => void;
}

@customElement("terral-pop")
export class TerralPop extends LitElement {
  @property({ attribute: false }) items: PopItem[] = [];
  @property({ attribute: false }) anchor?: DOMRect;
  @property() align: "left" | "right" = "left";

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._key);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._key);
  }

  private _key = (e: KeyboardEvent) => e.key === "Escape" && this.remove();

  /** The backdrop swallows the whole tap and closes on click (not on press),
   *  so the following click can't land on whatever is underneath. */
  private _swallow = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  private _backdropClick = (e: Event) => {
    this._swallow(e);
    this.remove();
  };

  protected updated(): void {
    const box = this.renderRoot.querySelector<HTMLElement>(".pop");
    if (!box || !this.anchor) return;
    const r = this.anchor;
    const w = box.offsetWidth;
    const hgt = box.offsetHeight;
    const left = this.align === "left" ? r.left : r.right - w;
    box.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, left))}px`;
    box.style.top = `${r.top - hgt - 8 > 8 ? r.top - hgt - 8 : Math.min(window.innerHeight - hgt - 8, r.bottom + 8)}px`;
  }

  render() {
    return html`<div class="backdrop" @pointerdown=${this._swallow} @touchmove=${this._swallow} @wheel=${this._swallow} @click=${this._backdropClick}></div>
      <div class="pop" role="menu">
      ${this.items.map(
        (it) => html`<button role="menuitemradio" aria-checked=${!!it.selected} class=${it.selected ? "sel" : ""} @click=${() => {
          it.run();
          this.remove();
        }}>${it.icon ?? nothing}<span>${it.label}</span></button>`,
      )}
    </div>`;
  }

  static styles = css`
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
}

export function openPop(anchor: Element, items: PopItem[], align: "left" | "right" = "left") {
  document.querySelector("terral-pop")?.remove();
  const el = document.createElement("terral-pop");
  el.items = items;
  el.anchor = anchor.getBoundingClientRect();
  el.align = align;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-pop": TerralPop;
  }
}
