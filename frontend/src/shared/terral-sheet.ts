// Base for Terral overlays: a bottom sheet on phones, a centred modal on
// tablets and wider. Subclasses implement renderContent() and may add styles.
import { LitElement, css, html, nothing, type CSSResultGroup, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { closeIcon } from "./icons";
import { lockBackgroundScroll } from "./scroll-lock";

export abstract class TerralSheet extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() protected _wide = window.matchMedia("(min-width: 600px)").matches;
  @state() private _closing = false;

  private _mq = window.matchMedia("(min-width: 600px)");
  private _unlock?: () => void;
  private _grabY?: number;

  protected abstract get heading(): string;
  protected abstract renderContent(): TemplateResult | typeof nothing;

  connectedCallback(): void {
    super.connectedCallback();
    this._mq.addEventListener("change", this._onMq);
    window.addEventListener("keydown", this._onKey);
    this._unlock = lockBackgroundScroll(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mq.removeEventListener("change", this._onMq);
    window.removeEventListener("keydown", this._onKey);
    this._unlock?.();
  }

  private _onMq = (e: MediaQueryListEvent) => (this._wide = e.matches);
  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.close();
  };

  close() {
    if (this._closing) return;
    this._closing = true;
    setTimeout(() => this.remove(), 180);
  }

  private _grabDown = (ev: PointerEvent) => {
    this._grabY = ev.clientY;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  };

  private _grabUp = (ev: PointerEvent) => {
    if (this._grabY == null) return;
    const dy = ev.clientY - this._grabY;
    this._grabY = undefined;
    if (dy > 60) this.close();
  };

  render() {
    const cls = `${this._wide ? "modal" : "sheet"} ${this._closing ? "closing" : ""}`;
    return html`
      <div class="backdrop ${this._closing ? "closing" : ""}" @click=${() => this.close()}></div>
      <div class="panel ${cls}" role="dialog" aria-modal="true" aria-label=${this.heading}>
        ${this._wide ? nothing : html`<div class="grab" @pointerdown=${this._grabDown} @pointerup=${this._grabUp}><span></span></div>`}
        <header>
          <h2>${this.heading}</h2>
          <button class="close" aria-label=${t(this.hass, "close")} @click=${() => this.close()}>${closeIcon(this._wide ? 22 : 18)}</button>
        </header>
        <div class="content">${this.renderContent()}</div>
      </div>
    `;
  }

  static styles: CSSResultGroup = css`
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
}
