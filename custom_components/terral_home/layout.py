"""Home layout storage for the Terral Home panel.

The panel keeps its own list of cards (which entity, which size, in which
order) in Home Assistant's storage, so it never depends on a Lovelace
dashboard or its edit mode. One layout is shared by the whole household.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import DOMAIN

STORAGE_KEY = f"{DOMAIN}.layout"
STORAGE_VERSION = 1
MAX_CARDS = 300

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

LAYOUT_SCHEMA = vol.Schema(
    {
        vol.Required("cards"): vol.All([CARD_SCHEMA], vol.Length(max=MAX_CARDS)),
    },
    extra=vol.ALLOW_EXTRA,
)


class LayoutStore:
    """Loads, saves and broadcasts the panel layout."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._listeners: set[Callable[[dict[str, Any]], None]] = set()
        self.data: dict[str, Any] = {"cards": []}

    async def async_load(self) -> None:
        self.data = await self._store.async_load() or {"cards": []}

    async def async_save(self, data: dict[str, Any]) -> None:
        self.data = data
        await self._store.async_save(data)
        for listener in list(self._listeners):
            listener(data)

    @callback
    def async_listen(self, listener: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)


def _get_store(hass: HomeAssistant) -> LayoutStore | None:
    return hass.data.get(DOMAIN, {}).get("layout")


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_layout)
    websocket_api.async_register_command(hass, ws_save_layout)
    websocket_api.async_register_command(hass, ws_subscribe_layout)


@websocket_api.websocket_command({vol.Required("type"): "terral_home/layout/get"})
@callback
def ws_get_layout(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    store = _get_store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Terral Home is not set up")
        return
    connection.send_result(msg["id"], store.data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "terral_home/layout/save",
        vol.Required("layout"): LAYOUT_SCHEMA,
    }
)
@websocket_api.async_response
async def ws_save_layout(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    store = _get_store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Terral Home is not set up")
        return
    await store.async_save(msg["layout"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "terral_home/layout/subscribe"})
@callback
def ws_subscribe_layout(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    store = _get_store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Terral Home is not set up")
        return

    @callback
    def forward(data: dict[str, Any]) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], data))

    connection.subscriptions[msg["id"]] = store.async_listen(forward)
    connection.send_result(msg["id"])
