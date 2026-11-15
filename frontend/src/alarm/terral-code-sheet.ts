// Alarm code sheet: number pad (or a text field for text codes).
// Keys shrink on short screens so nothing ever overlaps.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { backspaceIcon, checkIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";

@customElement("terral-code-sheet")
export class TerralCodeSheet extends TerralSheet {
  @property() format: "number" | "text" = "number";
  @property({ attribute: false }) submit?: (code: string) => Promise<boolean>;
  @state() private _code = "";
  @state() private _error = false;
  @state() private _busy = false;

  protected get heading() {
    return t(this.hass, "code_title");
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKeyboard);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKeyboard);
  }

  private _onKeyboard = (ev: KeyboardEvent) => {
    if (this.format !== "number" || this._busy) return;
    if (/^[0-9]$/.test(ev.key)) this._press(ev.key);
    else if (ev.key === "Backspace") this._erase();
    else if (ev.key === "Enter") this._send();
  };

  private _press(d: string) {
    if (this._busy || this._code.length >= 12) return;
    this._error = false;
    this._code += d;
  }

  private _erase() {
    this._error = false;
    this._code = this._code.slice(0, -1);
  }

  private async _send() {
    if (!this._code || this._busy || !this.submit) return;
    this._busy = true;
    const ok = await this.submit(this._code).catch(() => false);
    this._busy = false;
    if (ok) {
      this.close();
      return;
    }
    this._error = true;
    this._code = "";
  }

  protected renderContent() {
    if (this.format === "text") {
      return html`<form class="text" @submit=${(ev: Event) => {
        ev.preventDefault();
        this._send();
      }}>
        <input
          type="password"
          autocomplete="off"
          placeholder=${t(this.hass, "code_placeholder")}
          .value=${this._code}
          @input=${(ev: Event) => {
            this._error = false;
            this._code = (ev.target as HTMLInputElement).value;
          }}
        />
        <p class="err" aria-live="polite">${this._error ? t(this.hass, "code_wrong") : nothing}</p>
        <button class="okbtn" ?disabled=${!this._code || this._busy}>${t(this.hass, "ok")}</button>
      </form>`;
    }
    const n = Math.max(4, this._code.length);
    return html`
      <div class="dots ${this._error ? "shake" : ""} ${this._busy ? "busy" : ""}" aria-label="${this._code.length}">
        ${Array.from({ length: n }, (_, i) => html`<i class=${i < this._code.length ? "f" : ""}></i>`)}
      </div>
      <p class="err" aria-live="polite">${this._error ? t(this.hass, "code_wrong") : nothing}</p>
      <div class="pad">
        ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => html`<button class="key" @click=${() => this._press(d)}>${d}</button>`)}
        <button class="key fn" aria-label=${t(this.hass, "erase")} ?disabled=${!this._code} @click=${() => this._erase()}>${backspaceIcon(26)}</button>
        <button class="key" @click=${() => this._press("0")}>0</button>
        <button class="key ok" aria-label=${t(this.hass, "ok")} ?disabled=${!this._code || this._busy} @click=${() => this._send()}>${checkIcon(26)}</button>
      </div>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
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
    `,
  ];
}

export function openCodeSheet(hass: HomeAssistant, format: "number" | "text", submit: (code: string) => Promise<boolean>) {
  const el = document.createElement("terral-code-sheet");
  el.hass = hass;
  el.format = format;
  el.submit = submit;
  document.body.appendChild(el);
  return el;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-code-sheet": TerralCodeSheet;
  }
}
