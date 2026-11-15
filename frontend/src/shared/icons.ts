import { svg } from "lit";

const BULB_BODY =
  "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z";

/** Bulb: empty when off, filled when on. */
export const bulbIcon = (on: boolean, size = 24) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 21h4"></path>
    <path d=${BULB_BODY} fill=${on ? "currentColor" : "none"}></path>
  </svg>`;

export const powerIcon = (size = 24) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 3v8"></path><path d="M6.3 6.8a8 8 0 1 0 11.4 0"></path>
  </svg>`;

export const closeIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>`;

export const sunIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
  </svg>`;

export const chevronIcon = (open: boolean, size = 16) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${open ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}></path>
  </svg>`;

export const menuIcon = (size = 20) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>`;

export const plusIcon = (size = 20) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>`;

export const pencilIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 20h4L19 9l-4-4L4 16z"></path><path d="M13.5 6.5l4 4"></path></svg>`;

export const trashIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"></path></svg>`;

export const resizeIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"></path></svg>`;

export const gripIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle>
    <circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle>
    <circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>`;

export const dotsIcon = (size = 20) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`;

export const minusIcon = (size = 16) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"></path></svg>`;

export const searchIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>`;

export const checkIcon = (size = 18) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`;

export const gearIcon = (size = 20) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>`;

export const linesIcon = (size = 26) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"></path></svg>`;

export const roomsIcon = (size = 20) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 10.5L12 4l9 6.5"></path><path d="M5 9.5V20h14V9.5"></path><path d="M12 20v-6M5 14h7"></path></svg>`;

// ---- Alarm ----------------------------------------------------------------

const line = (size: number, body: ReturnType<typeof svg>, w = 2) => svg`
  <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width=${w} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const SHIELD = svg`<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"></path>`;
export const shieldIcon = (size = 24) => line(size, SHIELD);
export const shieldCheckIcon = (size = 24) => line(size, svg`${SHIELD}<path d="M9 12l2 2 4-4"></path>`);
export const alertIcon = (size = 24) =>
  line(size, svg`<path d="M12 3.5l9.5 16.5h-19z"></path><path d="M12 10v4.5"></path><path d="M12 17.5h.01"></path>`);
export const awayIcon = (size = 20) =>
  line(size, svg`<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"></path><path d="M9 8l-4 4 4 4"></path><path d="M5 12h10"></path>`);
export const homeIcon = (size = 20) =>
  line(size, svg`<path d="M3.5 11L12 4l8.5 7"></path><path d="M6 9.5V20h12V9.5"></path><path d="M10 20v-5h4v5"></path>`);
export const nightIcon = (size = 20) => line(size, svg`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>`);
export const vacationIcon = (size = 20) =>
  line(size, svg`<rect x="4" y="7.5" width="16" height="12.5" rx="2.5"></rect><path d="M9 7.5V5h6v2.5"></path><path d="M4 13h16"></path>`);
export const customModeIcon = (size = 20) =>
  line(size, svg`<path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle>`);
export const unlockIcon = (size = 20) =>
  line(size, svg`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 7.6-1.8"></path>`);
export const lockIcon = (size = 20) =>
  line(size, svg`<rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>`);
export const backspaceIcon = (size = 24) =>
  line(size, svg`<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"></path><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"></path>`);
export const skipIcon = (size = 20) => line(size, svg`<path d="M5 5l9 7-9 7z"></path><path d="M18 5v14"></path>`);
