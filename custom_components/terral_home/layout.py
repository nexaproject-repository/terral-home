"""Dashboards and their layouts for the Terral Home panels.

Terral Home can have several dashboards. Each one is its own entry in Home
Assistant's sidebar (so it can be made the main dashboard of a device) and
keeps its own list of cards (which entity, which size, in which order, in
which section) in Home Assistant's storage, never in a Lovelace dashboard.

Storage:
  terral_home.dashboards        the list of dashboards (id, title, icon, admin only)
  terral_home.layout            the layout of the first dashboard, "home"
  terral_home.layout_<id>       the layout of every other dashboard

A layout is the dashboard's first page (cards, sections); its other pages,
each with its own cards and sections, are in "pages".

The "home" dashboard always exists; it is the one Terral Home had before
dashboards existed, so older layouts keep working unchanged.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util import slugify

from .const import DOMAIN

STORAGE_VERSION = 1
LAYOUT_KEY = f"{DOMAIN}.layout"
DASHBOARDS_KEY = f"{DOMAIN}.dashboards"
HOME = "home"
MAX_CARDS = 300
MAX_SECTIONS = 50
MAX_DASHBOARDS = 20
MAX_PAGES = 12

CARD_SCHEMA = vol.Schema(
    {
        vol.Required("id"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Required("type"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Required("entity"): vol.All(str, vol.Length(min=1, max=255)),
        vol.Required("w"): vol.In([1, 2]),
        vol.Required("h"): vol.In([1, 2, 4]),
    },
    extra=vol.ALLOW_EXTRA,
)

SECTION_SCHEMA = vol.Schema(
    {
        vol.Required("id"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Required("title"): vol.All(str, vol.Length(max=80)),
        vol.Required("cards"): vol.All([CARD_SCHEMA], vol.Length(max=MAX_CARDS)),
    },
    extra=vol.ALLOW_EXTRA,
)

PAGE_SCHEMA = vol.Schema(
    {
        vol.Required("id"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Required("title"): vol.All(str, vol.Length(max=40)),
        vol.Required("cards"): vol.All([CARD_SCHEMA], vol.Length(max=MAX_CARDS)),
        vol.Optional("sections"): vol.All([SECTION_SCHEMA], vol.Length(max=MAX_SECTIONS)),
    },
    extra=vol.ALLOW_EXTRA,
)

LAYOUT_SCHEMA = vol.Schema(
    {
        # Cards without a section: shown first, or as the favourites strip.
        vol.Required("cards"): vol.All([CARD_SCHEMA], vol.Length(max=MAX_CARDS)),
        vol.Optional("sections"): vol.All([SECTION_SCHEMA], vol.Length(max=MAX_SECTIONS)),
        # Extra pages (the layout itself is the first page, titled page_title or "Inicio").
        vol.Optional("pages"): vol.All([PAGE_SCHEMA], vol.Length(max=MAX_PAGES)),
        vol.Optional("page_title"): vol.All(str, vol.Length(max=40)),
        # Favourites strip on tablets and computers: {"enabled": bool, "rows": 1 | 2}.
        vol.Optional("favorites"): vol.Schema(
            {vol.Optional("enabled"): bool, vol.Optional("rows"): vol.In([1, 2])}, extra=vol.ALLOW_EXTRA
        ),
    },
    extra=vol.ALLOW_EXTRA,
)

DASHBOARD_ID = vol.All(str, vol.Length(min=1, max=40))
TITLE = vol.All(str, vol.Length(min=1, max=40))
ICON = vol.All(str, vol.Length(max=64))


class LayoutStore:
    """Loads, saves and broadcasts the layout of one dashboard."""

    def __init__(self, hass: HomeAssistant, dashboard: str) -> None:
        key = LAYOUT_KEY if dashboard == HOME else f"{LAYOUT_KEY}_{dashboard}"
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, key)
        self._listeners: set[Callable[[dict[str, Any]], None]] = set()
        self.data: dict[str, Any] = {"cards": []}

    async def async_load(self) -> None:
        self.data = await self._store.async_load() or {"cards": []}

    async def async_save(self, data: dict[str, Any]) -> None:
        self.data = data
        await self._store.async_save(data)
        for listener in list(self._listeners):
            listener(data)

    async def async_remove(self) -> None:
        await self._store.async_remove()

    @callback
    def async_listen(self, listener: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)


class Dashboards:
    """The list of dashboards, their layouts and their sidebar panels."""

    def __init__(
        self,
        hass: HomeAssistant,
        register_panel: Callable[[dict[str, Any], bool], Awaitable[None]],
        remove_panel: Callable[[str], None],
    ) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, DASHBOARDS_KEY)
        self._register_panel = register_panel
        self._remove_panel = remove_panel
        self._layouts: dict[str, LayoutStore] = {}
        self.items: list[dict[str, Any]] = []

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        items = [d for d in data.get("dashboards", []) if isinstance(d, dict) and d.get("id")]
        if not any(d["id"] == HOME for d in items):
            items.insert(0, {"id": HOME})
        self.items = items
        for dash in self.items:
            await self._register_panel(dash)

    async def _async_persist(self) -> None:
        await self._store.async_save({"dashboards": self.items})

    def get(self, dashboard: str) -> dict[str, Any] | None:
        return next((d for d in self.items if d["id"] == dashboard), None)

    async def async_layout(self, dashboard: str) -> LayoutStore | None:
        if self.get(dashboard) is None:
            return None
        store = self._layouts.get(dashboard)
        if store is None:
            store = LayoutStore(self.hass, dashboard)
            await store.async_load()
            self._layouts[dashboard] = store
        return store

    async def async_create(self, title: str, icon: str | None) -> dict[str, Any]:
        title = title.strip() or "Dashboard"
        base = slugify(title, separator="-")[:24] or "dashboard"
        dashboard_id, n = base, 2
        while self.get(dashboard_id) is not None or dashboard_id == HOME:
            dashboard_id, n = f"{base}-{n}", n + 1
        dash = {"id": dashboard_id, "title": title, "icon": icon or "mdi:view-dashboard"}
        self.items.append(dash)
        await self._async_persist()
        await self._register_panel(dash)
        return dash

    async def async_update(self, dashboard: str, changes: dict[str, Any]) -> dict[str, Any] | None:
        dash = self.get(dashboard)
        if dash is None:
            return None
        if isinstance(changes.get("title"), str):
            changes["title"] = changes["title"].strip()
        for key in ("title", "icon", "require_admin"):
            if key in changes:
                if changes[key] in (None, ""):
                    dash.pop(key, None)
                else:
                    dash[key] = changes[key]
        await self._async_persist()
        await self._register_panel(dash, True)
        return dash

    async def async_delete(self, dashboard: str) -> bool:
        dash = self.get(dashboard)
        if dash is None or dashboard == HOME:
            return False
        self.items.remove(dash)
        await self._async_persist()
        self._remove_panel(dashboard)
        store = self._layouts.pop(dashboard, None) or LayoutStore(self.hass, dashboard)
        await store.async_remove()
        return True

    def unload(self) -> None:
        for dash in self.items:
            self._remove_panel(dash["id"])


def _get(hass: HomeAssistant) -> Dashboards | None:
    return hass.data.get(DOMAIN, {}).get("dashboards")


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    for command in (ws_get_layout, ws_save_layout, ws_subscribe_layout, ws_list_dashboards, ws_create_dashboard, ws_update_dashboard, ws_delete_dashboard):
        websocket_api.async_register_command(hass, command)


def _not_loaded(connection: websocket_api.ActiveConnection, msg: dict) -> None:
    connection.send_error(msg["id"], "not_found", "Terral Home dashboard not found")


# ---- Layouts (every user) -----------------------------------------------------------


@websocket_api.websocket_command({vol.Required("type"): "terral_home/layout/get", vol.Optional("dashboard", default=HOME): DASHBOARD_ID})
@websocket_api.async_response
async def ws_get_layout(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    store = await dashboards.async_layout(msg["dashboard"]) if dashboards else None
    if store is None:
        _not_loaded(connection, msg)
        return
    connection.send_result(msg["id"], store.data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "terral_home/layout/save",
        vol.Optional("dashboard", default=HOME): DASHBOARD_ID,
        vol.Required("layout"): LAYOUT_SCHEMA,
    }
)
@websocket_api.async_response
async def ws_save_layout(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    store = await dashboards.async_layout(msg["dashboard"]) if dashboards else None
    if store is None:
        _not_loaded(connection, msg)
        return
    await store.async_save(msg["layout"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "terral_home/layout/subscribe", vol.Optional("dashboard", default=HOME): DASHBOARD_ID})
@websocket_api.async_response
async def ws_subscribe_layout(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    store = await dashboards.async_layout(msg["dashboard"]) if dashboards else None
    if store is None:
        _not_loaded(connection, msg)
        return

    @callback
    def forward(data: dict[str, Any]) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], data))

    connection.subscriptions[msg["id"]] = store.async_listen(forward)
    connection.send_result(msg["id"])


# ---- Dashboards (list: every user; changes: admins) ------------------------------------


@websocket_api.websocket_command({vol.Required("type"): "terral_home/dashboards/list"})
@callback
def ws_list_dashboards(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    connection.send_result(msg["id"], dashboards.items if dashboards else [])


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "terral_home/dashboards/create", vol.Required("title"): TITLE, vol.Optional("icon"): ICON})
@websocket_api.async_response
async def ws_create_dashboard(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    if dashboards is None:
        _not_loaded(connection, msg)
        return
    if len(dashboards.items) >= MAX_DASHBOARDS:
        connection.send_error(msg["id"], "too_many", f"At most {MAX_DASHBOARDS} dashboards")
        return
    connection.send_result(msg["id"], await dashboards.async_create(msg["title"], msg.get("icon")))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "terral_home/dashboards/update",
        vol.Required("dashboard"): DASHBOARD_ID,
        vol.Optional("title"): vol.Any(None, vol.All(str, vol.Length(max=40))),
        vol.Optional("icon"): vol.Any(None, ICON),
        vol.Optional("require_admin"): bool,
    }
)
@websocket_api.async_response
async def ws_update_dashboard(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    changes = {k: msg[k] for k in ("title", "icon", "require_admin") if k in msg}
    dash = await dashboards.async_update(msg["dashboard"], changes) if dashboards else None
    if dash is None:
        _not_loaded(connection, msg)
        return
    connection.send_result(msg["id"], dash)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "terral_home/dashboards/delete", vol.Required("dashboard"): DASHBOARD_ID})
@websocket_api.async_response
async def ws_delete_dashboard(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    dashboards = _get(hass)
    if not dashboards or not await dashboards.async_delete(msg["dashboard"]):
        connection.send_error(msg["id"], "not_allowed", "This dashboard can't be deleted")
        return
    connection.send_result(msg["id"])
