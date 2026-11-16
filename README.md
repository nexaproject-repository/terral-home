<p align="center"><img src="custom_components/terral_home/brand/icon@2x.png" alt="Terral Home" width="128"></p>

# Terral Home

**Dashboard, Theme, Cards & Notifications for Home Assistant**

*Nexa Projects by Manuel Escaño*

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)
[![Validate](https://github.com/nexaproject-repository/terral-home/actions/workflows/validate.yml/badge.svg)](https://github.com/nexaproject-repository/terral-home/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🚧 Early development (v0.8.2). Not ready for daily use yet.

Terral Home brings a clean, glass-style look to Home Assistant, inspired by modern mobile home apps, plus a smart notification system that knows whether you are home, away or asleep.

## What it will include

- **Dashboard view** with a 2-column grid on phones and 4 columns on tablets. Card sizes (height/width): 1/1, 2/1, 2/2 and 4/2.
- **Cards** for lights, switches, climate, covers, scenes, sensors, cameras and appliances, all with a visual editor (no YAML).
- **Drag and resize** cards directly on the dashboard.
- **Navigation menu**: hidden behind a button on phones; a compact sidebar on tablets that expands over the cards with a swipe.
- **Backgrounds**: 10 built-in wallpapers for phone, tablet and desktop, plus your own.
- **Theme** that matches Home Assistant's own dialogs and menus.
- **Notifications** routed by house state:
  - asleep → silent push to the phone, seen in the morning;
  - at home → Alexa, or Alexa + phone;
  - away → phone only;
  - critical alerts always get through.
- **Appliance detectors** (dishwasher, washing machine, oven…) based on power or state.

## Installation (HACS)

1. HACS → ⋮ → **Custom repositories**.
2. Add `https://github.com/nexaproject-repository/terral-home` as **Integration**.
3. Install **Terral Home** and restart Home Assistant.
4. **Settings → Devices & services → Add integration → Terral Home**.

## Getting started (v0.8)

After adding the integration, **Terral Home** appears in the sidebar. It is a full-screen page of its own (no Home Assistant toolbar):

- It starts empty. Tap **+** (top right) to add a card: pick the kind of card (light, alarm, EV charger), then its device and name in the settings sheet (resize later with the corner). Every card's window has a **gear** that opens the same settings (and **Quitar tarjeta**).
- Tap a card to open its window; tap the bulb to switch it on or off.
- **Long-press** a card to arrange the home: drag cards to reorder, **−** removes one, drag the bottom-right corner to resize (1/1, 2/1, 2/2, 4/2), **Listo** finishes.
- **Sections**: in move mode, **Añadir apartado** adds a titled section. Tap a section title to rename it, drag its three lines to move the whole block, drag cards between sections, **−** removes a section (you choose whether its cards stay).
- **Alarm card** (2/2, works with [Alarmo](https://github.com/nielsfaber/alarmo) and any alarm panel): one button per enabled mode (away, home, vacation), a blinking countdown while arming, only **Desarmar** once armed, a code pad when the alarm needs a code, and **Armar igualmente** when Alarmo finds something open. Tap the card for night/custom modes, skipping the delay and open sensors.
- **EV charger card** (all sizes): the icon locks or unlocks the charger. Pick the switch, lock or `input_boolean` that blocks or enables charging and use **Invertir** if on means locked; the settings explain what each state does. Status, power and session energy are detected from the same device. Colours: green while charging, warm cream with a red lock when the car is plugged in but the charger is locked, sky blue when ready. Tap the card for the last 7 days and recent charges; the gear opens the settings.
- **Climate card** (all sizes, any climate entity: air conditioning, ducted, heating, heat pump): the icon turns it on and off; 2/2 has mode, − temperature + and fan speed; 4/2 a big draggable dial with mode and fan at the bottom. Temperature and fan dim in modes that don't use them (configurable per mode), the mode button hides when there is only one mode, and min / max temperature and steps are set in the card settings. Swing shows in the window only when enabled there.
- **···** opens the Terral menu: create sections from your Home Assistant areas (settings are coming).

The layout is stored by the integration and shared by everyone in the house.

The cards can also be used in any regular dashboard as `custom:terral-home-light`, `custom:terral-home-alarm`, `custom:terral-home-charger` and `custom:terral-home-climate`.

## Development

- `custom_components/terral_home/`: the integration (Python). It also serves the frontend.
- `frontend/`: view, cards and editors (TypeScript + Lit + Vite). `npm install && npm run build` writes the bundle to `custom_components/terral_home/www/terral-home.js`.

---

## Español

Terral Home da a Home Assistant un aspecto limpio, con efecto cristal, inspirado en las apps de casa de los móviles actuales. Además incluye un sistema de avisos que sabe si estáis en casa, fuera o durmiendo.

Instalación: añade este repositorio en HACS como **repositorio personalizado** de tipo **Integración**, instala **Terral Home**, reinicia y añade la integración desde **Ajustes → Dispositivos y servicios**.

## License

[MIT](LICENSE) © 2026 Manuel Escaño (Nexa Projects)
