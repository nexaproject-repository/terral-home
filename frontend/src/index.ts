// Terral Home frontend entry point.
// Nexa Projects by Manuel Escaño · MIT License.
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export const VERSION = "0.1.0";

@customElement("terral-home-view")
export class TerralHomeView extends LitElement {
  // Set by Home Assistant on every state change.
  @property({ attribute: false }) hass: unknown;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      padding: 56px 16px;
      box-sizing: border-box;
      color: #fff;
      font-family: Inter, system-ui, sans-serif;
      background:
        radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84, 64, 127, 0) 60%),
        radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62, 79, 140, 0) 70%),
        linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%);
    }
    h1 { margin: 0 0 8px; font-size: 34px; font-weight: 700; }
    p { margin: 0; opacity: 0.75; }
  `;

  render() {
    return html`
      <h1>Terral Home</h1>
      <p>v${VERSION} · la vista y las tarjetas llegarán en las próximas versiones.</p>
    `;
  }
}

console.info(
  `%c TERRAL HOME %c v${VERSION} `,
  "background:#ffb020;color:#3a2a10;font-weight:700",
  "",
);
