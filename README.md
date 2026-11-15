<p align="center"><img src="custom_components/terral_home/brand/icon@2x.png" alt="Terral Home" width="128"></p>

# Terral Home

**Dashboard, Theme, Cards & Notifications for Home Assistant**

*Nexa Projects by Manuel Escaño*

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)
[![Validate](https://github.com/nexaproject-repository/terral-home/actions/workflows/validate.yml/badge.svg)](https://github.com/nexaproject-repository/terral-home/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🚧 Early development (v0.2.0). Not ready for daily use yet.

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

## Getting started (v0.2)

v0.2 brings the **Terral view** and the **light card** (lights and HA light groups).

**One-click dashboard.** Settings → Dashboards → Add dashboard → **Terral Home**. It creates a dashboard with all your lights. To move or resize cards, open it, ⋮ → **Edit dashboard** → **Take control**.

If Terral Home doesn't show up in that list, create an empty dashboard, open ⋮ → Edit dashboard → ⋮ → **Raw configuration editor** and paste:

```yaml
strategy:
  type: custom:terral-home
```

**Manual view.** Any view can use the Terral layout:

```yaml
views:
  - type: custom:terral-home-view
    title: Mi casa
    background: crepusculo   # crepusculo | terral | mar | image URL
    cards:
      - type: custom:terral-home-light
        entity: light.kitchen
        view_layout:
          terral: { w: 1, h: 2 }   # h/w: 1/1, 2/1, 2/2 or 4/2
```

In edit mode each card shows a toolbar: drag handle, size (cycles 1/1 → 2/1 → 2/2 → 4/2), edit and delete.

## Development

- `custom_components/terral_home/`: the integration (Python). It also serves the frontend.
- `frontend/`: view, cards and editors (TypeScript + Lit + Vite). `npm install && npm run build` writes the bundle to `custom_components/terral_home/www/terral-home.js`.

---

## Español

Terral Home da a Home Assistant un aspecto limpio, con efecto cristal, inspirado en las apps de casa de los móviles actuales. Además incluye un sistema de avisos que sabe si estáis en casa, fuera o durmiendo.

Instalación: añade este repositorio en HACS como **repositorio personalizado** de tipo **Integración**, instala **Terral Home**, reinicia y añade la integración desde **Ajustes → Dispositivos y servicios**.

## License

[MIT](LICENSE) © 2026 Manuel Escaño (Nexa Projects)
