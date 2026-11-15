"""Terral Home — Dashboard, Theme, Cards & Notifications for Home Assistant.

Nexa Projects by Manuel Escaño.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url, remove_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FRONTEND_SCRIPT, FRONTEND_URL_BASE, VERSION

_STATIC_REGISTERED = f"{DOMAIN}_static_registered"


def _script_url() -> str:
    # The version query string busts the browser cache after each update.
    return f"{FRONTEND_URL_BASE}/{FRONTEND_SCRIPT}?v={VERSION}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Serve the frontend bundle and load it in every dashboard."""
    # Static paths cannot be unregistered, so register them only once per run.
    if not hass.data.get(_STATIC_REGISTERED):
        www = Path(__file__).parent / "www"
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_URL_BASE, str(www), cache_headers=False)]
        )
        hass.data[_STATIC_REGISTERED] = True

    add_extra_js_url(hass, _script_url())
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Stop loading the frontend bundle."""
    remove_extra_js_url(hass, _script_url())
    return True
