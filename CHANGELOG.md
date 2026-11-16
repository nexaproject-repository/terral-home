# Changelog

All notable changes to Terral Home. Versions follow `MAJOR.MINOR.PATCH`; while the project is in `0.x`, minor versions may change behaviour.

## 0.16.0 — 2026-11-16
- **Home consumption card** (`terral-home-energy`): the main meter split into the consumers you choose and "rest of the house". Sizes 1/1, 2/1, 2/2 and 4/2.
- Three views chosen in its settings — **flow** (dots from the grid to each consumer), **ring** (a band of light running along each segment) and **bars** (running stripes) — with movement faster the more each one uses; it can be turned off.
- Window: power now, today per hour stacked by consumer, each consumer today and the last 7 days (from Home Assistant's long-term statistics).
- Settings: main meter (or none: the total is the sum of the consumers), consumers with their sensor, name, colour and icon (add, remove, reorder), rest of the house and movement.

## 0.15.4 — 2026-11-16
- Pages: the round **+** really is centred now (the icon is placed in the middle of the circle instead of relying on the button layout).

## 0.15.3 — 2026-11-16
- Pages: the round **+** is centred in its circle on every browser.
- Switch card: the mosquito icon is now a simple mosquito crossed out (for bug zappers and repellents).

## 0.15.2 — 2026-11-16
- Pages: in move mode, the button to add a page is now a round **+** (the "Página" label was drawn badly).

## 0.15.1 — 2026-11-16
- Switch card: the price of a kWh and the cost are gone from its settings and window.

## 0.15.0 — 2026-11-16
- **Switch card** (`terral-home-switch`) for a water heater, bug zapper, plug…: sizes 1/1, 2/1 and 2/2; the icon switches it, the rest opens the window.
- Chosen in its settings: one of 15 **icons** (guessed from the name otherwise), one of 8 **colours** (strong on the icon, soft on the background), the **2/2 view** (A · Data, B · Consumption, C · Timeline of the day), the power / energy sensors (automatic from the same device) and the price of a kWh.
- **Window**: state (no extra on/off button, the icon does it), today (timeline, time on, consumption, cost), last 7 days (kWh or hours on without a meter) and the log of every on / off with who did it (automation, script, you or someone from Home Assistant).

## 0.14.0 — 2026-11-16
- **Pages** inside a dashboard, chosen with pills under the title; each page has its own favourites, sections and address (`/terral-home/<page>`). In move mode: **+ Página**, page settings on the active pill (name, before/after, delete keeping or removing its cards) and drop a card on a pill to move it there.
- **Main dashboard**: in Dashboard settings, "Use as my main dashboard" (the signed-in user, all their devices), "Main for the whole house" (admins) and "Only this dashboard in my sidebar" (hides every other sidebar entry for that user), so for example a non-admin user only ever sees their own dashboard.

## 0.13.0 — 2026-11-16
- **Several dashboards.** Each one is its own entry in Home Assistant's sidebar with its own name, icon and layout, so it can be the main dashboard of a device. **···** → **New dashboard** (admins) and **Dashboard settings** (name, icon, admins only, delete). The existing layout is the first dashboard and is kept as it was.
- **Favourites strip** on tablets and computers: the cards without a section run across every column on top, 1 row (1/1 cards) or 2 rows (1/1, 2/1, 2/2), and slide sideways when they don't fit. On phones they stay the first block.

## 0.12.0 — 2026-11-16
- **Section quick actions**: round buttons on the right of a section title. Lights (on by default): amber with how many are on; a tap turns them all off, or all on. Climate (opt-in): the same for the section's climate devices. Hidden in move mode.
- **Section settings** from a gear on the title in move mode: name, quick actions and remove section.

## 0.11.0 — 2026-11-16
- **Same card size on phone, tablet and PC.** Columns keep a phone-like width; every section is 2 columns wide and wider screens show several sections side by side, each in the shortest column, instead of stretching the cards.
- Move mode: sections can be dragged to another column.

## 0.10.0 — 2026-11-16
- **Robot vacuum card** (Roborock or any vacuum) in 1/1, 2/1 and 2/2, with a round floor-robot icon. Waiting: the 2/2 shows the 3 main routines and the icon opens every routine. Cleaning: the icon pauses, progress / area / time, pause and back to the dock. Stuck: red tint and a red "!" on the icon. Battery in the text with a level icon that changes colour.
- Robot window: vacuum / mop / both, suction, water, mop mode, rooms (Roborock), start / pause / dock / locate and routines; controls that don't apply are dimmed with the reason.
- Settings: routines on the card (up to 3, in order), robot scripts included.

## 0.9.1 — 2026-11-16
- Documentation: README rewritten (cards, usage, YAML options, privacy, roadmap), this changelog and `docs/architecture.md`.
- Code: removed the unused preview from the settings sheet; updated file headers.

## 0.9.0 — 2026-11-16
- **Weather card "Cielo"** for Met.no or any weather entity, in 1/1, 2/1, 2/2 and 4/2: the card is the sky (gradient per condition and day/night), with falling rain or snow. Live hourly and daily forecasts.
- Weather window with current details, 24 hours and 5 or 7 days; settings for the 2/2 forecast, animation, details and days.

## 0.8.2 — 2026-11-16
- Move mode: swiping scrolls the page; a card is picked up after resting a finger on it for a moment (the mouse still picks it up at once).

## 0.8.1 — 2026-11-16
- Mode and fan menus blur the page behind them; a tap outside only closes the menu.
- No ring around the climate card's icon.

## 0.8.0 — 2026-11-16
- **Climate card** for any climate entity, with a draggable dial on 4/2, mode and fan buttons that dim when the mode doesn't use them, and the mode button hidden for single-mode units.
- Settings: minimum / maximum temperature, steps, what to show in each mode, show swing.

## 0.7.1 — 2026-11-16
- Settings sheet without preview or size picker; the alarm asks only for a name.

## 0.7.0 — 2026-11-16
- **Add cards by type**, then device and name. Devices are filtered per card type and grouped by area; the alarm is greyed out when there is no alarm.
- Gear in every card's window opening the same settings, with **Remove card**.
- Chargers are matched by device, so other appliances no longer appear.

## 0.6.0 — 2026-11-15
- **EV charger card** with configurable lock entity and **Invert**, sensors detected on the same device, state colours, last-hour chart and charge history.

## 0.5.3 — 2026-11-15
- Leaving Terral Home only restores the styles it changed, so a theme or dark mode applied meanwhile is kept (fixes a half light, half dark sidebar).

## 0.5.2 — 2026-11-15
- Cards fade out as they scroll under the bottom edge.

## 0.5.1 — 2026-11-15
- Top and bottom edges blend into the colour the Companion app paints its bars with.

## 0.5.0 — 2026-11-15
- **Alarm card** for Alarmo: enabled modes, arming countdown, disarm only once armed, code pad, "arm anyway" when something is open, entry delay and triggered states.
- Alarm window; code sheet whose keys shrink on short screens.

## 0.4.0 — 2026-11-15
- **Sections** on the home: titles, move a whole section, drag cards between sections, remove a section keeping or removing its cards, create sections from areas.

## 0.3.2 — 2026-11-15
- Paints the notch and home-bar areas with the Terral background.

## 0.3.1 — 2026-11-15
- Resize by dragging the card's corner; rows at 85 % of a square; safe-area fix.

## 0.3.0 — 2026-11-15
- Terral Home becomes its **own full-screen panel**. The layout is stored by the integration and shared by the household; the home starts empty and cards are added with **+**.

## 0.2.0 — 2026-11-15
- First view and **light card** (sizes 1/1 to 4/2, light window, groups).

## 0.1.0 — 2026-11-15
- Integration skeleton, frontend bundle (Lit + Vite), brand and HACS setup.
