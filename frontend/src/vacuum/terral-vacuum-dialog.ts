// Robot vacuum window: status (battery, room, area, time, error), what to do
// (vacuum / mop / both), suction power, water, mop mode, where (whole house
// or Roborock rooms), start / pause / dock / locate and every routine.
// Controls that do nothing in the current situation are dimmed, with the
// reason: water and mop mode only when mopping, power off when only mopping,
// pause only while running, "to the dock" not when already there or on the way.
import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity, HomeAssistant } from "../ha-types";
import { t } from "../i18n";
import { exclaimIcon, gearIcon, homeIcon, locateIcon, pauseIcon, playIcon, vacuumIcon } from "../shared/icons";
import { TerralSheet } from "../shared/terral-sheet";
import { batteryBadge, errorText, isTinted, optionName, routineIcon, runFacts, statusText, tint } from "./vacuum-look";
import {
  type CleanMode,
  type Parts,
  type Room,
  type VacuumConfig,
  activity,
  allRoutines,
  cleanRooms,
  errorCode,
  fanList,
  loadRooms,
  locate,
  modeInfo,
  options,
  parts,
  pause,
  routineName,
  confirmRoutine,
  selectOption,
  setCleanMode,
  setFan,
  start,
  supports,
  toBase,
} from "./vacuum-model";

const MODE_KEY = { vacuum: "vac_mode_vacuum", mop: "vac_mode_mop", both: "vac_mode_both" } as const;
/** Values that are not a real choice in the power / water rows (they are what "what to do" switches). */
const HIDDEN = new Set(["off"]);

@customElement("terral-vacuum-dialog")
export class TerralVacuumDialog extends TerralSheet {
  @property({ attribute: false }) config!: VacuumConfig;
  @property() name = "";
  @property({ attribute: false }) onSettings?: () => void;
  @state() private _rooms: Room[] = [];
  @state() private _picked = new Set<number>();
  private _parts?: Parts;

  protected get heading() {
    return this.name;
  }

  protected renderHeaderEnd() {
    if (!this.onSettings) return nothing;
    return html`<button class="hbtn" aria-label=${t(this.hass, "settings")} @click=${() => {
      const go = this.onSettings!;
      this.close();
      go();
    }}>${gearIcon(19)}</button>`;
  }

  private get _e(): HassEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get _p(): Parts {
    if (!this._parts) this._parts = parts(this.hass, this.config.entity);
    return this._parts;
  }

  connectedCallback(): void {
    super.connectedCallback();
    const e = this._e;
    if (e) loadRooms(this.hass, e, this._p).then((r) => (this._rooms = r));
  }

  private _toggleRoom(id: number) {
    const next = new Set(this._picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._picked = next;
  }

  private _start(e: HassEntity) {
    const a = activity(e);
    if (a !== "paused" && this._picked.size) cleanRooms(this.hass, e, [...this._picked]);
    else start(this.hass, e);
  }

  private _seg<T extends string>(values: T[], cur: string | undefined, label: (v: T) => string, pick: (v: T) => void, disabled = false) {
    // Up to 4 in a row; 5 or more wrap in rows of 3 so long names still fit.
    const cols = values.length <= 4 ? values.length : 3;
    return html`<div class="seg" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">
      ${values.map((v) => html`<button class=${cur === v ? "sel" : ""} ?disabled=${disabled} @click=${() => pick(v)}>${label(v)}</button>`)}
    </div>`;
  }

  protected renderContent() {
    const h = this.hass;
    const e = this._e;
    if (!e) return html`<p>${t(h, "not_found")}</p>`;
    const p = this._p;
    const a = activity(e);
    const off = a === "unavailable";
    const running = a === "cleaning" || a === "returning";
    const mi = modeInfo(h, e, p);
    const fans = fanList(e).filter((v) => !HIDDEN.has(v));
    const water = options(h, p.mopIntensity).filter((v) => !HIDDEN.has(v));
    const mops = options(h, p.mopMode);
    const mopping = mi.current !== "vacuum" || !mi.modes.length;
    const vacuuming = mi.current !== "mop";
    const bat = batteryBadge(h, e, p, true, 15);
    const code = errorCode(h, e, p);
    const facts = runFacts(h, p);
    const routines = allRoutines(h, this.config);
    const note = (k: Parameters<typeof t>[1]) => html`<em>${t(h, k)}</em>`;

    return html`
      <div class="status ${isTinted(a) ? "on" : ""}" style=${tint(a)}>
        <span class="icon">${vacuumIcon(30)}${a === "error" ? html`<span class="err">${exclaimIcon(14)}</span>` : nothing}</span>
        <div class="txt">
          <strong>${statusText(h, e, p)}</strong>
          <span>${bat ? html`<b class="bat" style="color:${bat.color}">${bat.icon}${bat.text}</b>` : nothing}${facts && (running || a === "paused") ? html` · ${facts}` : nothing}</span>
        </div>
      </div>
      ${a === "error" && code ? html`<p class="alert">${errorText(h, code)}</p>` : nothing}
      <div class="scroll">
        ${mi.modes.length
          ? html`<section>
              <h3>${t(h, "vac_what")}</h3>
              ${this._seg(mi.modes, mi.current, (m: CleanMode) => t(h, MODE_KEY[m]), (m) => setCleanMode(h, e, p, m), off)}
            </section>`
          : nothing}
        ${fans.length && supports(e, "FAN")
          ? html`<section class=${vacuuming ? "" : "dim"}>
              <h3>${t(h, "vac_power")}${vacuuming ? nothing : note("vac_power_off")}</h3>
              ${this._seg(fans, e.attributes.fan_speed, (v) => optionName(h, v), (v) => setFan(h, e, v), off || !vacuuming)}
            </section>`
          : nothing}
        ${water.length
          ? html`<section class=${mopping ? "" : "dim"}>
              <h3>${t(h, "vac_water")}${mopping ? nothing : note("vac_only_mop")}</h3>
              ${this._seg(water, h.states[p.mopIntensity!]?.state, (v) => optionName(h, v), (v) => selectOption(h, p.mopIntensity!, v), off || !mopping)}
            </section>`
          : nothing}
        ${mops.length
          ? html`<section class=${mopping ? "" : "dim"}>
              <h3>${t(h, "vac_mop_mode")}${mopping ? nothing : note("vac_only_mop")}</h3>
              ${this._seg(mops, h.states[p.mopMode!]?.state, (v) => optionName(h, v), (v) => selectOption(h, p.mopMode!, v), off || !mopping)}
            </section>`
          : nothing}
        ${this._rooms.length
          ? html`<section class=${running || a === "paused" ? "dim" : ""}>
              <h3>${t(h, "vac_where")}${running || a === "paused" ? note("vac_rooms_next") : nothing}</h3>
              <div class="chips">
                <button class=${this._picked.size ? "" : "sel"} ?disabled=${running} @click=${() => (this._picked = new Set())}>${t(h, "vac_whole_home")}</button>
                ${this._rooms.map((r) => html`<button class=${this._picked.has(r.id) ? "sel" : ""} ?disabled=${running} @click=${() => this._toggleRoom(r.id)}>${r.name}</button>`)}
              </div>
            </section>`
          : nothing}
        <div class="actions">
          <button class="go" ?disabled=${off || a === "cleaning"} @click=${() => this._start(e)}>
            ${playIcon(18)}${t(h, a === "paused" ? "vac_resume" : this._picked.size ? "vac_start_rooms" : "vac_start_clean", { n: this._picked.size })}
          </button>
          ${supports(e, "PAUSE") ? html`<button class="rb" aria-label=${t(h, "vac_pause")} ?disabled=${!running} @click=${() => pause(h, e)}>${pauseIcon(18)}</button>` : nothing}
          ${supports(e, "RETURN") ? html`<button class="rb" aria-label=${t(h, "vac_to_base")} ?disabled=${off || a === "docked" || a === "returning"} @click=${() => toBase(h, e)}>${homeIcon(19)}</button>` : nothing}
          ${supports(e, "LOCATE") ? html`<button class="rb" aria-label=${t(h, "vac_locate")} ?disabled=${off} @click=${() => locate(h, e)}>${locateIcon(19)}</button>` : nothing}
        </div>
        ${a === "docked" ? html`<p class="note">${t(h, "vac_docked_note")}</p>` : a === "cleaning" ? html`<p class="note">${t(h, "vac_cleaning_note")}</p>` : nothing}
        ${routines.length
          ? html`<section>
              <h3>${t(h, "vac_routines")}</h3>
              <div class="chips">
                ${routines.map((id) => {
                  const n = routineName(h, id, this.name);
                  return html`<button ?disabled=${off || a === "cleaning"} @click=${() => confirmRoutine(h, id, n, this.name)}>${routineIcon(n, 16)}${n}</button>`;
                })}
              </div>
            </section>`
          : nothing}
      </div>
    `;
  }

  static styles = [
    TerralSheet.styles,
    css`
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
    `,
  ];
}

export function openVacuumDialog(hass: HomeAssistant, config: VacuumConfig, name: string, onSettings?: () => void) {
  document.querySelector("terral-vacuum-dialog")?.remove();
  const el = document.createElement("terral-vacuum-dialog");
  el.hass = hass;
  el.config = { ...config };
  el.name = name;
  el.onSettings = onSettings;
  document.body.appendChild(el);
  return el;
}

export function updateVacuumDialog(hass: HomeAssistant) {
  for (const el of document.querySelectorAll("terral-vacuum-dialog")) el.hass = hass;
}

declare global {
  interface HTMLElementTagNameMap {
    "terral-vacuum-dialog": TerralVacuumDialog;
  }
}
