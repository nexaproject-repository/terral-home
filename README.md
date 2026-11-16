<p align="center"><img src="custom_components/terral_home/brand/icon@2x.png" alt="Terral Home" width="128"></p>

# Terral Home

**Dashboard, Theme, Cards & Notifications for Home Assistant**

*Nexa Projects by Manuel Escaño*

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)
[![Validate](https://github.com/nexaproject-repository/terral-home/actions/workflows/validate.yml/badge.svg)](https://github.com/nexaproject-repository/terral-home/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🚧 Early development (v0.17.2). It works day to day, but things still change between versions.

Terral Home gives Home Assistant a clean, glass-style home screen inspired by modern mobile home apps: a full-screen page of its own, cards you add and arrange by touch, and windows for every device. A notification system that knows whether you are home, away or asleep is planned.

- [What you get today](#what-you-get-today)
- [Installation](#installation-hacs)
- [Using Terral Home](#using-terral-home)
- [Cards](#cards)
- [Using the cards in other dashboards](#using-the-cards-in-other-dashboards)
- [Privacy](#privacy)
- [Roadmap](#roadmap)
- [Development](#development)
- [Español](#español)

## What you get today

- **Several dashboards**, each its own entry in Home Assistant's sidebar (name and icon of your choice), so each device can open its own one.
- **Terral Home page** in the sidebar: full screen, no Home Assistant toolbar, with the "crepúsculo" background and the phone's status and home bars blended in.
- **Same card size on every screen**: columns are about as wide as on a phone, every section is 2 columns wide, and tablets and computers place more sections side by side (each in the shortest column) instead of stretching the cards. Card sizes (height/width): **1/1, 2/1, 2/2 and 4/2**.
- **Add cards by type** (light, alarm, EV charger, climate, weather, robot vacuum, switch, home consumption, doors and windows), then choose the device and name.
- **Arrange by touch**: long-press a card to move it, drag the bottom-right corner to resize, remove with **−**.
- **Pages** inside a dashboard, chosen with pills under the title, each with its own favourites and sections.
- **Main dashboard per user**: open it at sign-in, and optionally show only that dashboard in the user's sidebar.
- **Favourites strip** on tablets and computers: the cards without a section run across every column on top, 1 row of 1/1 cards or 2 rows mixing 1/1, 2/1 and 2/2; swipe sideways when they don't fit.
- **Sections** with titles; move a whole section at once, or create one per Home Assistant area.
- **Quick actions** on the right of each section title: turn every light of the section on or off (and, if you enable it, every climate device).
- **A window for every card** with all its controls, and a **gear** for the card settings.
- **One shared layout** for the whole household, stored by the integration.
- Spanish and English.

## Installation (HACS)

Requires Home Assistant **2026.3** or newer.

1. HACS → ⋮ → **Custom repositories**.
2. Add `https://github.com/nexaproject-repository/terral-home` as **Integration**.
3. Install **Terral Home** and **restart Home Assistant**.
4. **Settings → Devices & services → Add integration → Terral Home**.

**Terral Home** then appears in the sidebar.

To update: HACS → Terral Home → **Redownload**, restart Home Assistant, then fully close and reopen the Companion app (it caches the page).

## Using Terral Home

| Action | How |
| --- | --- |
| Add a card | **+** (top right) → pick the type → pick the device (or the alarm / weather) and the name → **Add** |
| Open a card's window | Tap the card |
| Quick action | Tap the card's icon (switch a light, lock the charger, turn the climate on or off, pause the robot or pick one of its routines, switch the water heater…) |
| Card settings | Gear in the card's window → **Save**, or **Remove card** |
| Move mode | Long-press any card. In move mode, swipe to scroll; rest a finger on a card for a moment to pick it up |
| Resize | In move mode, drag the arc at the bottom-right corner |
| Remove | In move mode, **−** on the card |
| Sections | In move mode: **Add section**, tap a title to rename it, drag its three lines to move the block, **−** removes it (you choose whether its cards stay) |
| Section quick actions | Round buttons on the right of a section title. Lights: amber with how many are on; a tap turns them all off, or all on when every light is off. In move mode, the gear on the title opens the section settings: name, which quick actions show (lights, climate) and **Remove section** |
| Dashboard settings | **···** → **Dashboard settings**: name and icon in the sidebar, admins only, favourites strip (on/off, 1 or 2 rows), **Delete dashboard** (not the first one) |
| New dashboard | **···** → **New dashboard** (admins): name and icon; it appears in the sidebar at once with an empty page |
| Pages | In move mode: the round **+** after the pills adds a page; tap the active pill (gear) to rename it, move it before/after or delete it (its cards go to the first page or away). Drop a card on a pill to move it to that page. Every page has its own address (`/terral-home/<page>`) |
| Main dashboard of a user | Sign in as that user → open the dashboard → **···** → **Dashboard settings** → **Use as my main dashboard** (and, if wanted, **Only this dashboard in my sidebar**). Admins can also make it the main one for the whole house. Mark the other dashboards **Admins only** so non-admin users can't open them |
| Sections per room | **···** → **Create sections by room** |
| Finish | **Done** |

## Cards

All cards share the same look: an icon circle, name and status, and a tinted background when the device is active. Their settings are opened from the gear in the window.

### Light

For a light or a Home Assistant light group.

- **Sizes**: 1/1, 2/1, 2/2 and 4/2 (4/2 for colour, temperature and group lights).
- **Icon** switches it on or off; the card tints with the light's real colour.
- **Window**: brightness, temperature, colours and, for groups, each member.
- **Settings**: device (light groups listed apart), which light of the device, tint with the light colour.

### Alarm

For [Alarmo](https://github.com/nielsfaber/alarmo) or any alarm panel. 2/2.

- One button per enabled mode (away, home, vacation). While arming, an amber ring empties and the seconds blink; once armed only **Disarm** shows.
- A code pad when the alarm needs a code; **Arm anyway** when Alarmo finds something open.
- Entry delay counts down in red; a triggered alarm flashes.
- **Window**: every mode (night and custom too), skip the delay, open and bypassed sensors.
- **Settings**: name only (the alarm is picked automatically; a picker shows if there is more than one). The type is greyed out with "Alarmo is not installed" when there is no alarm.

### EV charger

Lock and unlock the charger and follow the charge.

- **Sizes**: 1/1, 2/1, 2/2 and 4/2 (4/2 adds the last-hour power chart).
- **Colours**: green while charging; warm cream with an orange icon and a dark red lock when the car is plugged in but the charger is locked; sky blue when ready; glass with a grey lock when locked without a car.
- **Window**: last 7 days and recent charges (from the power sensor's history).
- **Settings**: charger device, the switch / lock / `input_boolean` that blocks charging, **Invert** (with an explanation of what on and off mean), status / power / energy sensors (detected on the same device), maximum power.

### Climate

For any climate entity: air conditioning (split or ducted), heating, heat pump.

- **Sizes**: 1/1, 2/1, 2/2 and 4/2.
- **Icon** turns it on and off (back to the last mode); "off" is never listed as a mode.
- **2/2**: mode · − temperature + · fan speed. **4/2**: a large draggable dial, mode bottom-left, fan bottom-right.
- Temperature and fan dim in the modes that don't use them; the mode button is hidden when the unit has a single mode.
- **Window**: temperature, modes, fan speed (with the reason when it is fixed), swing (only if enabled in the settings), presets.
- **Settings**: device and name, minimum / maximum temperature and steps (0.5° or 1°), what to show in each mode, show swing.

### Weather ("Cielo")

For Met.no or any weather entity.

- **Sizes**: 1/1, 2/1, 2/2 and 4/2.
- The card is the sky: a gradient that follows the weather and the time of day (sun below the horizon), with falling rain or snow.
- **2/2**: next 6 hours (or days). **4/2**: next hours and 3 days with min–max bars.
- **Window**: humidity, wind and direction, pressure, clouds, dew point, rain today, 24 hours and 5 or 7 days.
- **Settings**: name, hours or days on 2/2, rain/snow animation, current details, forecast days.

### Robot vacuum

For a robot that vacuums and/or mops. Made for [Roborock](https://www.home-assistant.io/integrations/roborock/), works with any vacuum entity (what the robot doesn't report is simply not shown).

- **Sizes**: 1/1, 2/1 and 2/2. The icon is a round floor robot.
- **Waiting** (docked or idle, glass card): 2/2 shows your **3 main routines** as buttons; the robot icon opens **every routine** (also on 1/1 and 2/1).
- **Cleaning** (teal): the icon pauses; 2/2 shows progress, area and time, pause and back to the dock. **Going home**: sky blue.
- **Stuck / error** (red): the icon stays the same with a red **!** at its bottom-right; 2/2 offers resume, back to the dock and locate.
- **Battery** in the text, with a small battery icon that empties by steps and turns amber below 40 % and red below 20 % (a bolt while charging on the dock).
- **Window**: what to do (vacuum, mop or both), suction, water, mop mode, where (whole home or rooms), start / pause / dock / locate and every routine. Controls that do nothing right now are dimmed, with the reason: water and mop mode only when mopping, suction off when only mopping, pause only while running, "to the dock" not when it's already there.
- **Settings**: device and name, and the routines on the card (pick up to 3, numbered in the order you pick them; scripts that look like robot scripts can be added too).

How it reads Roborock: battery, progress, area, time, current room and error come from the sensors on the robot's device; water and mop mode are its `select` entities; Roborock has no "mode" entity, so *mop only* is suction `off` and *vacuum only* is water `off`; each routine of the Roborock app is a `button` on the device; rooms come from the `roborock.get_maps` action and a room clean is sent as `app_segment_clean`.

### Doors and windows

For a door / window contact sensor (`binary_sensor` with `device_class` door, window, garage_door or opening), or a group of them.

- **Closed**: glass. **Open**: orange, with the icon swung open and the time it has been open.
- **Ventilation / tilted**: for windows whose sensor has X / Y / Z axes. In the settings, put the window in each position (closed, ventilation, tilted) and tap **Record**; the card then recognises the position from the axes and shows it in blue, even though the contact reads closed (so it doesn't get in the way of the alarm).
- **What it is**: door, window, balcony door or garage (changes the icon; guessed from the device class and the name).
- **One sensor**: 1/1, 2/1 and 2/2 (today's open periods on a line, temperature, battery and openings today, from the same device).
- **Group**: add more sensors in the settings and the card sums them up ("2 open · 5 closed"), the open ones first; every size up to 4/2. A row opens that sensor.
- **Window**: state, a warning while an alarm is armed, today (timeline, openings, time open, longest), the openings of the last 7 days and the sensor's data (temperature, vibration, tamper, battery, Z-Wave node status).

### Home consumption

Where the electricity of the house is going right now: the main meter split into the consumers you choose (car charger, air conditioning, water heater…) and **rest of the house** (meter − consumers).

- **Sizes**: 1/1, 2/1, 2/2 and 4/2. A tap opens the window.
- **Three views**, chosen in the settings, the same on every size and in the window:
  - **Flow**: the grid on top and dots running down a cable to each consumer; thicker cables and faster, more dots the more it uses.
  - **Ring**: a donut split by consumer with the total in the middle; a band of light runs along each segment, faster the more it uses.
  - **Bars**: one bar per consumer with its kW and share; the stripes run faster the more it uses.
- The 4/2 also shows today's kWh per consumer as a coloured bar.
- **Window**: power now (in the chosen view), today per hour stacked by consumer, each consumer today (kWh and share) and the last 7 days.
- **Settings**: the main meter (a power sensor, or an energy counter in kWh: its power is worked out from how fast it grows; or "no main meter", then the total is the sum of the consumers and there is no "rest"), the view, the **consumers** (each with its power sensor, name, colour and icon; add, remove, move up / down), rest of the house on/off and the movement on/off.
- History comes from Home Assistant's long-term statistics (hourly mean power), so a week of a meter that reports every few seconds stays light; the current hour comes from the state history.

### Switch

For anything on a switch: a water heater, a bug zapper, a plug, a fan… (`switch`, `input_boolean`; `light` and `fan` entities also work from YAML).

- **Sizes**: 1/1, 2/1 and 2/2. The **icon** switches it on and off; a tap anywhere else opens the window.
- **Icon**: 15 to choose from in the settings (water heater, crossed-out mosquito, bug-zapper lamp, plug, fan, coffee machine, radiator, heater, dehumidifier, pump, Christmas tree, router, washing machine, TV, water). Without a choice, it's guessed from the name ("Termo" → water heater).
- **Colour when on**: 8 colours (amber, orange, red, pink, violet, blue, teal, green), strong on the icon and soft on the card background. Amber is the light card's look. Off, the card is glass like every other.
- **2/2 view**, chosen in the settings:
  - **A · Data**: since when · power now · today (kWh, or time on without a meter).
  - **B · Consumption**: the power (or today's kWh / time on) in big, with today's consumption per hour as bars.
  - **C · Timeline of the day** (default): today's on periods from 0 to 24 h, with a mark for now.
- **Window**: the state (the icon switches it; there's no extra button), **today** (timeline, time on and consumption), the **last 7 days** (kWh per day, or hours on without a meter) and the **log**: every on and off with its time, how long it was on, what it used, and who did it (an automation or script by name, you, or someone from Home Assistant; read from the logbook).
- **Settings**: device and name, colour (with a preview of the card on and off), 2/2 view, icon, power and energy sensors (automatic: the ones on the same device).

## Using the cards in other dashboards

The cards are also registered for normal Lovelace dashboards. Settings made in the gear are saved only inside the Terral Home page; in other dashboards use YAML.

```yaml
type: custom:terral-home-light
entity: light.living_room
name: Living room           # optional
use_light_color: true       # tint with the light colour
group_by_area: auto         # auto | always | never (group window)
```

```yaml
type: custom:terral-home-alarm
entity: alarm_control_panel.alarmo
name: Alarm                 # optional
```

```yaml
type: custom:terral-home-charger
entity: switch.charger_lock # switch, lock or input_boolean
invert: true                # on = locked
status_entity: sensor.charger_status   # optional, "none" to hide
power_entity: sensor.charger_power     # optional
energy_entity: sensor.charger_energy   # optional
max_power: 7.4                         # kW, optional
```

```yaml
type: custom:terral-home-climate
entity: climate.air_conditioning
min_temp: 17                # optional, within the unit's limits
max_temp: 28
temp_step: 0.5              # 0.5 or 1
show_swing: false
mode_rules:                 # optional: what each mode shows
  dry: { t: false, f: false }   # t = temperature, f = fan speed
```

```yaml
type: custom:terral-home-weather
entity: weather.home
forecast_2x2: hourly        # hourly | daily
animate: true
show_details: true
forecast_days: 7            # 5 | 7
```

```yaml
type: custom:terral-home-vacuum
entity: vacuum.roborock
routines:                   # optional: the 3 buttons on the 2/2 card, in order
  - button.roborock_daily   # a Roborock routine button…
  - script.vacuum_kitchen   # …or a script
```

```yaml
type: custom:terral-home-switch
entity: switch.water_heater
icon: boiler                # boiler | mosquito | zapper | plug | fan | coffee | radiator | heater | dehumidifier | pump | tree | router | washer | tv | water
color: orange               # amber | orange | red | pink | violet | blue | teal | green
style: c                    # 2/2 view: a (data) | b (consumption) | c (timeline of the day)
power_entity: sensor.water_heater_power    # optional: found on the same device when missing
energy_entity: sensor.water_heater_energy  # optional
```

```yaml
type: custom:terral-home-energy
entity: sensor.house_power           # the main meter (power, W or kW)
view: flow                           # flow | ring | bars
consumers:
  - entity: sensor.charger_power
    name: Car charger
    icon: car                        # car | snow | home | boiler | washer | heater | … (the switch icons)
    color: green                     # amber | orange | red | pink | violet | blue | teal | green
  - entity: sensor.air_conditioning_power
    name: Air conditioning
    icon: snow
    color: blue
rest: true                           # rest of the house = meter − consumers
animate: true
```

```yaml
type: custom:terral-home-contact
entity: binary_sensor.balcony_door
kind: balcony                 # door | window | balcony | garage
positions:                    # recorded with "Record" in the settings
  binary_sensor.balcony_door:
    closed: { x: 22, y: 967, z: -4 }
    vent: { x: 175, y: 955, z: -38 }
show_temp: true
show_battery: true
group:                        # optional: a group card with these too
  - binary_sensor.front_door
  - binary_sensor.bathroom_window
```

## Privacy

Everything stays in your Home Assistant. The layout is saved in Home Assistant's storage (`.storage/terral_home.layout`); the cards only read entity states and history and call Home Assistant services. Terral Home sends nothing to outside services.

## Roadmap

- Own navigation menu (phone button, compact sidebar on tablets).
- Terral Home settings: general colour palette, 10 backgrounds, theme.
- More cards: covers, sensors, scenes, cameras, appliances.
- Robot vacuum: live map of the cleaning.
- Notifications routed by house state (asleep → silent push, at home → Alexa and/or phone, away → phone; critical alerts always through) and appliance detectors (dishwasher, washing machine, oven…).
- Collapsible sections.

## Development

See **[docs/architecture.md](docs/architecture.md)** for how the integration and the frontend fit together, the websocket API, the layout format, the card contract and the release steps. Changes per version are in **[CHANGELOG.md](CHANGELOG.md)**.

Quick start:

```bash
cd frontend
npm install
npm run build      # type-checks and writes custom_components/terral_home/www/terral-home.js
```

---

## Español

Terral Home da a Home Assistant una pantalla de inicio limpia, con efecto cristal, inspirada en las apps de casa de los móviles: una página propia a pantalla completa, tarjetas que añades y colocas con el dedo y una ventana para cada dispositivo.

- **Instalación**: en HACS añade este repositorio como **repositorio personalizado** de tipo **Integración**, instala **Terral Home**, reinicia y añade la integración desde **Ajustes → Dispositivos y servicios**. Aparecerá **Terral Home** en la barra lateral.
- **Añadir una tarjeta**: **+** → tipo de tarjeta (luz, alarma, cargador, clima, tiempo, robot aspirador, interruptor, consumo de la casa, puertas y ventanas) → dispositivo y nombre → **Añadir**.
- **Puertas y ventanas**: cerrada en cristal y abierta en naranja con el tiempo. Si el sensor tiene ejes X, Y, Z, en los ajustes pones la ventana en **ventilación** (o abatida), pulsas **Grabar** y la tarjeta la mostrará en azul como «Ventilación» aunque el contacto diga cerrada. Puede ser un solo sensor o un grupo («2 abiertas · 5 cerradas»). La ventana tiene las aperturas del día y de la semana y los datos del sensor.
- **Consumo de la casa**: el contador general repartido entre los consumidores que elijas (cargador, aire…) y el **resto de la casa**. Tres vistas a elegir en los ajustes: **Flujo** (puntos que van de la red a cada consumidor), **Anillo** y **Barras**, con movimiento más rápido cuanto más gasta cada uno. La ventana tiene el consumo de hoy por horas, por consumidor y de los últimos 7 días.
- **Interruptor** (termo, matamosquitos, enchufe…): el icono lo enciende y apaga; en los ajustes eliges el **icono** (15), el **color** al encender (8: fuerte en el icono y suave de fondo) y qué muestra la **2/2** (A · Datos, B · Consumo o C · Línea del día). La ventana tiene el día de hoy, el consumo de los últimos 7 días y el **registro** de encendidos y apagados con quién lo hizo. Sin medidor de consumo muestra horas encendido.
- **Robot aspirador** (Roborock u otros): en espera, la 2/2 muestra tus 3 rutinas principales (se eligen en los ajustes) y el icono abre todas; limpiando, el icono pausa y se ve el progreso; atascado, sale una **!** roja sobre el icono. La batería va en el texto. En la ventana: aspirar / fregar / ambos, potencia, agua, modo de mopa, habitaciones y rutinas; lo que no aplica se apaga.
- **Ordenar**: pulsación larga en una tarjeta para entrar en modo mover; desliza para desplazarte y deja el dedo quieto un instante sobre una tarjeta para agarrarla. La esquina inferior derecha cambia el tamaño y **−** la quita.
- **Mismo tamaño en móvil, tablet y PC**: cada apartado ocupa 2 columnas y en pantallas anchas se ponen varios apartados uno al lado de otro (cada uno en la columna más corta).
- **Accesos rápidos** a la derecha del título de cada apartado: encienden o apagan todas sus luces (y, si lo activas, el clima). Se configuran con el engranaje del apartado en modo mover.
- **Varios dashboards**: **···** → **Nuevo dashboard**. Cada uno es una entrada propia del menú de Home Assistant, con su nombre e icono, para ponerlo como principal en cada dispositivo. Sus ajustes (nombre, icono, favoritos) están en **···** → **Ajustes del dashboard**.
- **Favoritos** en tablet y PC: las tarjetas sin apartado van arriba, a todo el ancho, en 1 fila (tarjetas 1/1) o 2 filas (1/1, 2/1 y 2/2); si no caben, se deslizan.
- **Páginas** dentro de un dashboard: píldoras bajo el título. En modo mover, el **+** redondo tras las píldoras crea una; la píldora activa (engranaje) la renombra, la mueve o la elimina. Arrastra una tarjeta a una píldora para pasarla a esa página.
- **Un dashboard para cada persona** (por ejemplo, Natalia, que no es administradora): crea su dashboard y marca los demás como **Solo administradores**. Después, entrando con el usuario de Natalia, abre su dashboard → **···** → **Ajustes del dashboard** → **Usar como mi dashboard principal** y **Solo este dashboard en mi menú**. Al entrar verá solo el suyo.
- **Apartados**: en modo mover, **Añadir apartado**; toca el título para renombrarlo y arrastra las tres líneas para moverlo entero. También puedes crearlos por habitación desde **···**.
- **Ajustes de cada tarjeta**: engranaje en su ventana.
- **Actualizar**: HACS → **Volver a descargar**, reiniciar Home Assistant y cerrar y abrir la app.

## License

[MIT](LICENSE) © 2026 Manuel Escaño (Nexa Projects)
