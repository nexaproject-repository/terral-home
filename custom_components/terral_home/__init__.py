"""Terral Home — Dashboard, Theme, Cards & Notifications for Home Assistant.

Nexa Projects by Manuel Escaño.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.frontend import add_extra_js_url, remove_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_SCRIPT,
    FRONTEND_URL_BASE,
    NAME,
    PANEL_ICON,
    PANEL_URL_PATH,
    VERSION,
)
from .layout import LayoutStore, async_register_websocket

_STATIC_REGISTERED = f"{DOMAIN}_static_registered"


def _script_url() -> str:
    # The version query string busts the browser cache after each update.
    return f"{FRONTEND_URL_BASE}/{FRONTEND_SCRIPT}?v={VERSION}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Serve the frontend, register the Terral Home panel and its storage."""
    # Static paths and websocket commands cannot be unregistered,
    # so register them only once per run.
    if not hass.data.get(_STATIC_REGISTERED):
        www = Path(__file__).parent / "www"
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_URL_BASE, str(www), cache_headers=False)]
        )
        async_register_websocket(hass)
        hass.data[_STATIC_REGISTERED] = True

    store = LayoutStore(hass)
    await store.async_load()
    hass.data.setdefault(DOMAIN, {})["layout"] = store

    # Cards stay available in regular dashboards too.
    add_extra_js_url(hass, _script_url())

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name="terral-home-panel",
        sidebar_title=NAME,
        sidebar_icon=PANEL_ICON,
        module_url=_script_url(),
        embed_iframe=False,
        require_admin=False,
        config={"version": VERSION},
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panel and stop loading the frontend bundle."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    remove_extra_js_url(hass, _script_url())
    hass.data.get(DOMAIN, {}).pop("layout", None)
    return True
