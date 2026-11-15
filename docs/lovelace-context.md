# Contexto Lovelace para Terral Home

Resumen de la documentación oficial y del código del frontend de Home Assistant que afecta a Terral Home. Revisado el **2026-11-15**.

Fuentes:
- Documentación para desarrolladores: <https://contributors.home-assistant.io/frontend/custom-ui/>. La antigua `developers.home-assistant.io/docs/frontend/...` ahora redirige aquí.
- Código: `home-assistant/frontend`, rama `dev`, commit [`2d6ebd2`](https://github.com/home-assistant/frontend/tree/2d6ebd26d995ccb6c2445af0bbb305cdcca58cfa). En adelante, `FE/<ruta>` es una ruta dentro de ese commit.
- Documentación de usuario: <https://www.home-assistant.io/dashboards/>.

Leyenda: **[Doc]** está en la documentación oficial · **[Código]** sale del código fuente y no está documentado (puede cambiar) · **[?]** sin confirmar.

---

## 1. Reglas generales

- **[Doc]** Todo elemento personalizado (tarjeta, vista, badge, card feature, estrategia, panel) es un custom element. Se usa como `type: custom:<tag>`.
- **[Doc]** `setConfig(config)` debe validar y lanzar un `Error` si la configuración es inválida; HA lo muestra como tarjeta de error.
- **[Doc]** `hass` llega como un objeto nuevo con cada cambio de estado de toda la casa. Hay que actualizar solo lo necesario, comparando por referencia (`newHass.states[id] !== oldHass.states[id]`).
- **[Doc]** **No hay librería pública de componentes.** Los elementos `ha-*` (incluido `ha-card`) pueden cambiar en cualquier versión. Para controles y pickers: implementación propia empaquetada en nuestro bundle.
  - Cambios recientes: 2026.6 (`ha-radio`), 2026.7 (tamaños de `ha-button`/`ha-slider`) y 2026.11 (se eliminan `ha-md-list` y `ha-formfield`; los `--md-*` dejan de tener efecto).
- **[Doc]** Para mostrar textos: `hass.formatEntityState(stateObj)` y `hass.formatEntityName(stateObj, name?, options?)`, en vez del estado en bruto.
- **[Doc]** Alternativa al setter `hass`: Context API (evento `context-request` con `states`, `entities`, `hassApi`, `hassInternationalization`). Hay contextos antiguos obsoletos desde 2026.5.
- **[Doc]** `window.loadCardHelpers()` da acceso a `createCardElement` y a diálogos (`showConfirmationDialog`…) una vez cargado el panel de dashboards.

## 2. Vista personalizada `custom:terral-home-view`

### 2.1 Creación

- **[Código]** `custom:terral-home-view` → se quita el prefijo → `document.createElement("terral-home-view")` → `setConfig(viewConfig)`. Ver `FE/src/panels/lovelace/create-element/create-element-base.ts`.
- **[Código]** Si el elemento aún no está definido, HA muestra un error oculto durante 2 s y, cuando se define, dispara `ll-rebuild` y recrea la vista. Debemos **definir los elementos lo antes posible**; ya lo hacemos con `add_extra_js_url`.
- **[Código]** **No existe un registro de vistas personalizadas** ni aparecen en el selector de tipo del editor de vista, que solo ofrece las 4 integradas (`FE/.../view-editor/hui-view-editor.ts`). Hay que poner el tipo en YAML o en el editor de configuración en bruto.
  - **Plan:** una **estrategia de dashboard** (`window.customStrategies`, ver §6) que cree el panel con un clic.
  - **[?]** No sabemos si abrir "Editar vista" en la interfaz conserva el tipo personalizado. Hay que probarlo.

### 2.2 Contrato del elemento

Interfaz `LovelaceViewElement` (`FE/src/data/lovelace.ts`):

```ts
interface LovelaceViewElement extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: Lovelace;          // config, editMode, saveConfig…
  narrow?: boolean;
  index?: number;               // "compatibilidad temporal"
  path?: ConfigPath;            // ["views", i]  (≥ 2026.11)
  cards?: HuiCard[];            // tarjetas YA creadas
  badges?: HuiBadge[];
  sections?: HuiSection[];
  isStrategy: boolean;
  initialRenderComplete?: Promise<void>;
  setConfig(config: LovelaceViewConfig): void;
}
```

- **[Código]** Orden en que HA asigna las propiedades: `isStrategy`, `hass`, `narrow`, `lovelace`, `index`, `path`, `cards`, `badges`, `sections`. Después sigue actualizando `hass`, `narrow`, `lovelace` y `cards`.
- **[Código]** **Hay que exponer `initialRenderComplete` y resolverla tras el primer render.** Si no, el panel puede quedarse en estado de carga (`FE/.../hui-view.ts#L601-L612`).
- **[Código]** **Cada vez que se guarda la configuración, HA recrea todas las tarjetas** y nos entrega un array `cards` nuevo. No hay que guardar referencias a elementos entre guardados: se identifican por índice o por config.

### 2.3 Tarjetas que recibimos (`HuiCard`)

- **[Doc]** HA crea y actualiza las tarjetas; la vista solo las coloca.
- **[Código]** Cada una es un envoltorio `hui-card` con `hass`, `preview` (igual a `lovelace.editMode`), `config` y `layout`:
  - **`card.layout = "grid"`** indica a la tarjeta que está en una rejilla. Lo usaremos para que las tarjetas nativas, como la de tile, rellenen su celda.
  - **Visibilidad:** el envoltorio evalúa `visibility` y `disabled`, se pone `hidden` y dispara `card-visibility-changed`. Fuera de edición hay que ocultar la celda si `card.hidden`. En edición, las tarjetas se ven siempre.
  - `card.getGridOptions()` combina lo que declara la tarjeta con `config.grid_options`; manda la config.

### 2.4 Tamaño y posición de cada tarjeta

- **[Doc]** El sitio previsto para datos de posición o tamaño propios de una vista es la clave **`view_layout`** de cada tarjeta. HA la guarda y la ignora.
- **Decisión Terral:** `view_layout: { terral: { w: 1|2, h: 1|2|4 } }`. El orden es el del array `cards`. Si falta, usamos un tamaño por defecto según el tipo de tarjeta o sus `grid_options`.

### 2.5 Modo edición

- **[Código]** El modo edición es `lovelace.editMode && !isStrategy`. En vistas generadas por estrategia no se edita.
- **[Doc/Código]** Eventos que hay que disparar con `bubbles: true, composed: true`. Los escucha `<hui-view>`, el padre de nuestra vista.

| Acción | Evento | `detail` |
|---|---|---|
| Añadir tarjeta (abre el selector) | `ll-create-card` | `{ path: ["views", index, "cards"] }` |
| Editar tarjeta | `ll-edit-card` | `{ path: [index, i] }` ⚠️ |
| Borrar (con deshacer) | `ll-delete-card` | `{ path: [index, i], silent: false }` ⚠️ |
| Duplicar, copiar, cortar, pegar | `ll-duplicate-card`, `ll-copy-card`, `ll-cut-card`, `ll-paste-card` | `{ path }` |

- ⚠️ **[Código] Cambio en 2026.11:** las rutas pasaron de tuplas numéricas a rutas genéricas (`["views",0,"cards",3]`).
  - **Para funcionar en 2026.10 y en 2026.11+**, usamos la tupla antigua `[viewIndex, cardIndex]` en editar y borrar: la versión nueva la convierte (`normalizeCardPath`) y la antigua la entiende.
  - Revisar cuando HA retire la "compatibilidad temporal".
- **[Código] Mover y redimensionar no tienen evento:** lo hace la vista escribiendo la configuración, igual que la vista de secciones:
  1. clonar `lovelace.config`;
  2. cambiar el orden de `views[index].cards` o su `view_layout`;
  3. `await lovelace.saveConfig(nuevaConfig)`.
  - `saveConfig` recibe **el dashboard completo**.
  - En modo YAML (`lovelace.mode === "yaml"`) no se puede guardar.
- **[Código]** El diálogo de edición de tarjeta **solo muestra la pestaña "Diseño" (tamaño) dentro de la vista de secciones**. En nuestra vista, el cambio de tamaño lo hace nuestra propia interfaz (arrastrar y soltar o asas), que es justo lo que queremos.
- **[Código]** `hui-card-edit-mode`, `hui-card-options`, `ha-sortable`, `moveAtPath`/`setAtPath` y los `show*Dialog` son internos. **No los usamos:** empaquetamos SortableJS o lógica de puntero propia, y escribimos nuestras utilidades de ruta.

### 2.6 Referencia: rejilla de la vista de secciones

Referencia útil para que nuestras tarjetas también funcionen en vistas nativas:

- **[Doc/Código]** 12 columnas por sección, de 320 a 500 px de ancho. Filas de **56 px** con huecos de **8 px**, así que una tarjeta de `rows` filas mide `rows·64 − 8` px.
- Variables: `--ha-section-grid-row-height`, `--ha-section-grid-row-gap`, `--ha-section-grid-column-gap`, `--ha-view-sections-*`.
- La tarjeta tile devuelve `{columns: 6, rows: 1, min_columns: 6}`.
- La vista de secciones no tiene redimensionado arrastrando; solo lo hace desde el diálogo.

## 3. Tarjetas Terral (`custom:terral-home-*`)

- **[Doc]** API obligatoria y recomendada:
  - `setConfig(config)` (obligatorio, valida y lanza error);
  - `set hass`;
  - `getCardSize()` (solo para masonry; 1 = 50 px);
  - **`getGridOptions()`**, que devuelve `{ columns, rows, min_columns, max_columns, min_rows, max_rows }`;
  - `preview`, que es `true` dentro del editor.
- **[Doc]** `getLayoutOptions()` está **obsoleto**: solo implementamos `getGridOptions()`.
- **[Doc]** Editor visual:
  - `static getConfigForm()` → `{ schema, computeLabel?, computeHelper?, assertConfig? }`, con los mismos selectores que los blueprints y grupos `grid`/`expandable`. Desde 2026.8, `visible` admite operadores (`eq`, `in`, `exists`… y `and`/`or`/`not`).
  - O `static getConfigElement()`, un editor propio que dispara `config-changed` con `{ config }` completo. Si existen los dos, gana `getConfigElement`.
- **[Doc]** `static getStubConfig(hass, entities, entitiesFallback)` devuelve una config por defecto sin `type`. Hay que contemplar que las dos listas lleguen vacías.
- **[Doc]** Registro en el selector de tarjetas (sin el prefijo `custom:`):

  ```js
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "terral-home-light", name: "Terral · Luz", description: "…",
    preview: true, documentationURL: "https://github.com/nexaproject-repository/terral-home",
    getEntitySuggestion: (hass, entityId) => null | { config, label? } | [...], // ≥ 2026.6
  });
  ```

- **[Doc]** No hay mecanismo de traducciones para tarjetas personalizadas: llevamos nuestros propios textos (es/en) en el bundle.
- **[Doc]** Hay que manejar entidades que no existen (mostrar "no encontrada" en lugar de romper).

## 4. Card features y badges (opcional)

- **[Doc]** Card feature: `window.customCardFeatures.push({ type, name, isSupported(hass, context), configurable })`, con `setConfig`, `hass` y `context` (`{entity_id}` o `{area_id}`). En los clics hay que llamar a `ev.stopPropagation()`. Variables `--feature-height` (42 px), `--feature-border-radius` (12 px).
- **[Doc]** Badge: `window.customBadges.push({...})`, con la misma API que una tarjeta.

## 5. Tema y fondos

- **[Doc]** Tema en YAML (`frontend: themes:`) con `modes: { light, dark }`. Acciones: `frontend.reload_themes` y `frontend.set_theme`.
- **[Código]** Las claves del tema se convierten en variables CSS (`--clave`, y `--rgb-clave` si el valor es hex). El tema por vista se aplica al contenedor de la vista y nuestra vista lo hereda.
- **[Código]** Variables de `ha-card` (`FE/src/components/ha-card.ts`):
  - `--ha-card-background`
  - **`--ha-card-backdrop-filter`** (existe: sirve para el efecto cristal)
  - `--ha-card-box-shadow`
  - `--ha-card-border-radius`
  - `--ha-card-border-width`
  - `--ha-card-border-color`
  - `--ha-card-header-*`
- **[Doc]** Colores y fondos:
  - `--primary-color`, `--primary-text-color`, `--secondary-text-color`, `--card-background-color`;
  - colores por estado: `state-{dominio}-{device_class}-{estado}-color`;
  - fondo: `--lovelace-background`, y desde **2026.11** `--ha-panel-background`, `--ha-panel-toolbar-background`.
- **[Doc]** Tokens de diseño: `--ha-space-*` (pasos de 4 px), `--ha-border-radius-*`, `--ha-font-*`, `--ha-color-*`. Desde 2026.11, `--mdc-typography-*` ya no tiene efecto.
- **[Doc]** El fondo de una vista (`background: {image, opacity, size, alignment, repeat, attachment}`) tiene prioridad sobre el del dashboard y este sobre el del tema. Nuestros fondos se pintarán dentro de la propia vista Terral.

## 6. Estrategia de dashboard (instalación con un clic)

- **[Doc]** `customElements.define("ll-strategy-dashboard-terral-home", …)` con `static async generate(config, hass)`, que devuelve `{ title, views: [{ type: "custom:terral-home-view", … }] }`.
- **[Doc]** Registro desde 2026.4–2026.5:

  ```js
  window.customStrategies.push({ type: "terral-home", strategyType: "dashboard", name, description, documentationURL });
  ```

  Métodos estáticos: `getCreateSuggestions`, `getStubConfig`, `configRequired`, `registryDependencies`, `shouldRegenerate`.
- **Ojo:** mientras una vista la genera una estrategia, no se puede editar (`isStrategy`). Para que el usuario pueda personalizar la vista, la estrategia solo crea el panel inicial y después el usuario lo "toma el control", que lo convierte en config normal.

## 7. Integración: servir el frontend y el logo

- **[Doc]** `hass.http.async_register_static_paths([StaticPathConfig(url, ruta, cache_headers)])`. La versión síncrona antigua ya no existe.
- **[?]** `frontend.add_extra_js_url(hass, url)` no aparece en la documentación, pero lo usa el propio HACS. Su equivalente documentado en YAML es `frontend: extra_module_url`. Lo mantenemos, con `?v=<versión>` para invalidar la caché.
- **[Doc]** Recursos de Lovelace: el tipo `module` es el recomendado y `js` está obsoleto. En modo seguro no se carga ningún recurso.
- **[Doc]** Logo: desde **2026.3**, carpeta `custom_components/terral_home/brand/` (ya creada). Se sirve en `/api/brands/integration/terral_home/...` con token; nunca usar URLs fijas de `brands.home-assistant.io`.
- **[Doc]** HACS: un solo archivo JS con todo empaquetado (Lit incluido), el README con capturas, y la acción de validación en verde (ya lo está).

## 8. Decisiones derivadas para Terral Home

1. **Versión mínima de HA: 2026.3** (logo local y `getGridOptions` estable). Hay que actualizar `hacs.json`, que ahora pone 2025.1.0. El código tolera las rutas de 2026.10 y de 2026.11+.
2. **Vista:**
   - Elemento `terral-home-view` con `initialRenderComplete`.
   - Coloca las `HuiCard` recibidas con `layout = "grid"` y respeta `hidden` y `card-visibility-changed`.
   - Guarda el tamaño en `view_layout.terral` y el orden en el array.
3. **Edición:**
   - Barra propia: añadir (`ll-create-card`), editar (`ll-edit-card`), borrar (`ll-delete-card`).
   - Arrastrar y redimensionar con lógica propia, guardando con `lovelace.saveConfig`.
   - No disponible en modo YAML ni en vistas de estrategia.
4. **Tarjetas Terral:**
   - `getGridOptions()` para que también funcionen en la vista de secciones.
   - `getConfigForm()` siempre que se pueda; `getConfigElement()` solo si hace falta algo más rico.
   - `getStubConfig()`, `customCards` con `getEntitySuggestion`, y formateadores `hass.format*`.
5. **Nada de `ha-*` internos.** Si en algún momento se usa `ha-card`, que sea solo como contenedor y estilizado por sus variables.
6. **Tema `Terral Home`**, con variables `ha-card-*` (incluido `ha-card-backdrop-filter`) y `ha-panel-background`.
7. **Estrategia de dashboard** `custom:terral-home` para crear el panel con un clic, y después "tomar el control" para editarlo.

## 9. Pendiente de comprobar en una instalación real

- [ ] Si "Editar vista" desde la interfaz conserva `type: custom:terral-home-view`.
- [ ] Que `add_extra_js_url` y la detección de HACS no carguen el bundle dos veces.
- [ ] El comportamiento en HA 2026.3–2026.9, porque el código solo se revisó en 2026.10/11.
- [ ] El rendimiento de `backdrop-filter` en tablets antiguas y en Fully Kiosk.
