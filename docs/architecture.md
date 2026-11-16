# Terral Home — architecture

How the pieces fit together, for anyone changing the code. User-facing documentation is in the [README](../README.md); changes per version in the [CHANGELOG](../CHANGELOG.md).

## Repository layout

```
custom_components/terral_home/   Home Assistant integration (Python)
  __init__.py                    setup: static files, websocket API, panel, JS for dashboards
  layout.py                      layout storage + websocket commands
  const.py, manifest.json        version, URLs, panel settings
  config_flow.py, strings.json,  single-step setup (no options yet)
  translations/
  brand/                         icon / logo shown by Home Assistant and HACS
  www/terral-home.js             built frontend bundle (committed, served as-is)
frontend/                        frontend source (TypeScript + Lit + Vite)
  src/index.ts                   entry: registers every card and the panel
  src/panel/                     the Terral Home page and its sheets
  src/light|alarm|charger|climate|weather|vacuum/   one folder per card
  src/shared/                    sheet base, popover menu, slider, icons, scroll lock, backgrounds
  src/i18n.ts                    Spanish / English strings
  src/ha-types.ts                the small part of HA's frontend types we use
assets/brand/                    brand sources (SVG)
docs/                            this file and notes on Lovelace internals
```

## Integration (backend)

`async_setup_entry` (in `__init__.py`):

1. Serves `www/` at `/terral_home` (registered once per Home Assistant run).
2. Registers the websocket commands from `layout.py` (once per run).
3. Loads the `LayoutStore`.
4. Adds the bundle with `add_extra_js_url`, so the cards also work in normal dashboards.
5. Registers the sidebar panel `terral-home` with `panel_custom` (web component `terral-home-panel`, `require_admin=False`). The module URL carries `?v=<version>` to bust caches, which is why an update needs a restart.

`async_unload_entry` removes the panel and the extra JS URL.

### Layout storage

One layout for the whole household, stored with `homeassistant.helpers.storage.Store` under the key `terral_home.layout` (file `.storage/terral_home.layout`).

```jsonc
{
  "cards": [                      // cards without a section, shown first
    { "id": "k3f9…", "type": "light", "entity": "light.sofa", "w": 1, "h": 2,
      "name": "Sofa", "use_light_color": false }      // extra keys = card settings
  ],
  "sections": [
    { "id": "s1", "title": "Kitchen", "cards": [ /* same card objects */ ] }
  ]
}
```

- `type`: `light`, `alarm`, `charger`, `climate`, `weather` or `vacuum`.
- `w` ∈ {1, 2}, `h` ∈ {1, 2, 4}. Sizes are named height/width: 1/1, 2/1 (`w:1,h:2`), 2/2, 4/2 (`w:2,h:4`).
- Limits: 300 cards, 50 sections. The schema allows extra keys on cards and sections.

### Websocket API

Available to every user (not only admins).

| Command | Payload | Result |
| --- | --- | --- |
| `terral_home/layout/get` | — | the layout |
| `terral_home/layout/save` | `{ "layout": <layout> }` | saves the whole layout and notifies subscribers |
| `terral_home/layout/subscribe` | — | event messages with the new layout after every save |

The panel always saves the **whole** layout (`_update()` clones it, applies the change and saves), so the last writer wins.

## Frontend

Built with Lit 3 and Vite into a single ES module. `npm run build` runs `tsc --noEmit` and then Vite, writing `custom_components/terral_home/www/terral-home.js`.

### The panel (`panel/terral-home-panel.ts`)

- Loads the layout through the websocket, subscribes to changes and renders it.
- **Same size everywhere**: a column is 160–184 px (about a phone column), every block is `SECTION_COLS` = 2 columns wide (a Terral setting may offer 4 later). The cards without a section form the first block (no title); each section is another. `_measure()` works out how many blocks fit side by side ("lanes": 1 on phones, 2 on tablets, 3–5 on computers) and the column width; the page is centred at that width. Row height is 85 % of half a column.
- **Lanes (option A)**: `_rowsOf()` simulates the grid's `row dense` packing to know each block's height, and `_assignLanes()` puts each block, in order, in the shortest lane, so there are no gaps. Dragging a section picks the lane under the finger and the position by the sections' middles (`_hitSection`), shows a line there and moves the section in the list; the lanes are then recomputed.
- Creates the card elements itself (`CARD_TAGS`) and passes `hass` and a config with `view_layout.terral = { w, h }`.
- **Move mode**: entered with a long press on a card (`terral-card-hold`) or from the ··· menu. Cards jiggle; with a finger, a card is picked up after resting ~0.3 s on it (swiping scrolls), with the mouse at once. The corner arc resizes, snapping to the sizes the card offers; **−** removes. Sections have a title (tap to rename), a three-line handle and **−**.
- **Edges**: while open it paints `html`/`body`, sets `meta[name=theme-color]` and the theme variables the Companion app reads (`--app-header-background-color`, `--primary-background-color`), then sends `theme-update` through the external bus. It saves and restores **only** those properties, because Home Assistant applies themes as inline styles on the same elements.
- The background fades into the edge colour at the top and bottom so the phone bars and the page join without a seam.

### Card contract

Every card is a custom element (`terral-home-<type>`) that:

- accepts `setConfig(config)` and throws on an invalid entity;
- reads its size from `config.view_layout.terral` (`s11`, `s21`, `s22`, `s42`);
- receives `hass` and re-renders only when its own entities change (`shouldUpdate`);
- returns `getTerralSizes()` (the sizes the corner may snap to), plus the usual `getCardSize`, `getGridOptions`, `getStubConfig` and `getConfigForm` for normal dashboards;
- uses the same touch rules: icon = quick action, tap = window, long press = `terral-card-hold`.

Events a card dispatches (`bubbles` + `composed`):

| Event | Detail | Who handles it |
| --- | --- | --- |
| `terral-card-hold` | `{ x, y, pointerId }`, cancelable | the panel calls `preventDefault()` and starts move mode; if nobody does, the card opens its window |
| `terral-card-config` | `{ config, size? }`, cancelable | the panel copies the allowed keys (`CONFIG_KEYS`) and the size into the layout |
| `terral-card-remove` | — | the panel removes the card |

### Sheets and windows

- `shared/terral-sheet.ts` is the base for every overlay: a bottom sheet on phones, a centred modal from 600 px. It locks background scrolling (`shared/scroll-lock.ts`), closes with the grab handle, Escape or the backdrop, and offers `renderHeaderStart()` / `renderHeaderEnd()` for back and gear buttons.
- Each card has a window (`terral-<type>-dialog.ts`) appended to `document.body` so it sits above everything; the card calls `update<Type>Dialog(hass)` on every update to keep it live.
- `panel/terral-add-sheet.ts` lists card types (greyed out with a reason when Home Assistant has nothing for them).
- `panel/terral-card-config.ts` is the shared settings sheet, used when adding a card and from every window's gear (`openCardSettings`). It filters Home Assistant devices per card type and groups them by area; the alarm and the weather pick their entity directly because they have no device.
- `shared/terral-pop.ts` is the floating menu (climate mode and fan) with a blurred backdrop that swallows outside taps.

### Card notes

- **Light** (`light/`): `light-model.ts` works out what a light can do (on/off, brightness, temperature, colour, group) and the tint.
- **Alarm** (`alarm/`): enabled modes from `supported_features`; arming countdown from the `delay` attribute and `last_changed`; arming uses `alarmo.arm` when the entity belongs to Alarmo, otherwise `alarm_control_panel.*`. A refusal (open sensors) is detected when the state stays `disarmed` with `open_sensors` set, and offers a forced arm.
- **Charger** (`charger/`): `isLocked` / `setLocked` handle switches, locks and `input_boolean` with `invert`. Status, power and energy sensors are auto-detected on the same device. Charge history is rebuilt from the power sensor's history (`history/history_during_period`): sessions above 0.05 kW, gaps under 15 min merged.
- **Climate** (`climate/`): modes from `hvac_modes` without `off`; what each mode shows comes from `DEFAULT_RULES`, the card's `mode_rules` and what the unit reports. Temperature changes are sent after a 650 ms pause.
- **Weather** (`weather/`): forecasts through `weather/subscribe_forecast`, shared between cards per entity and type; night comes from `sun.sun`.
- **Robot vacuum** (`vacuum/`): `vacuum-model.ts` finds the robot's sensors and selects on the same device (by `translation_key`, then by entity id): battery (`device_class: battery`), cleaning progress / area / time, current room, error, mop intensity, mop mode and selected map. "What to do" has no entity in Roborock: mop only = fan speed `off`, vacuum only = mop intensity `off`; the last non-off values are remembered so "both" can restore them. Routines are the device's `button` entities without an entity category (the reset buttons have one) plus the scripts / buttons listed in the card's `routines`; the card shows the first 3 of `routines` (or of the device's). Rooms are read once per robot and map with `call_service` `roborock.get_maps` (`return_response`) and cleaned with `vacuum.send_command` `app_segment_clean`. The card redraws only when the robot, one of those entities or a favourite routine changes.

### Strings

`i18n.ts` holds Spanish and English dictionaries (English is the fallback); `t(hass, key, vars)` picks the language from the user's Home Assistant locale. Add every new key to both.

## Adding a card type

1. Create `frontend/src/<type>/` with the card (`terral-home-<type>`), its window and any model helpers.
2. Import it in `src/index.ts` and add it to `window.customCards`.
3. In `panel/terral-home-panel.ts`: extend `TerralCard.type`, `CARD_TAGS` and `CONFIG_KEYS` with its settings.
4. In `panel/terral-add-sheet.ts`: add it to `TYPES` (and a "missing" reason if needed).
5. In `panel/terral-card-config.ts`: extend `CardType`, `TYPE_LABEL`, `newDraft()`, the device or entity picker and its settings section.
6. Add the strings in Spanish and English, and document it in the README and the CHANGELOG.

## Releasing

1. Bump the version in `custom_components/terral_home/const.py`, `custom_components/terral_home/manifest.json`, `frontend/package.json`, `frontend/src/version.ts` and the README status line.
2. `cd frontend && npm run build` and commit the source together with the rebuilt `www/terral-home.js`.
3. Tag `vX.Y.Z` and push `main` and the tag. HACS shows the commit until a GitHub release is published for the tag.
4. Users update with HACS → Redownload, restart Home Assistant and reopen the app.

## Testing

There are no automated tests in the repository yet. Changes have been checked with a local page that loads the bundle with a mocked `hass` (states, services, websocket) in a headless browser, and then on a real Home Assistant with the Companion app on iPhone.
