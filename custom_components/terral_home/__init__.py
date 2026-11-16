"""Terral Home — Dashboard, Theme, Cards & Notifications for Home Assistant.

Nexa Projects by Manuel Escaño.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.frontend import add_extra_js_url, remove_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DASHBOARD_ICON,
    DOMAIN,
    FRONTEND_SCRIPT,
    FRONTEND_URL_BASE,
    NAME,
    PANEL_ICON,
    PANEL_URL_PATH,
    VERSION,
)
from .layout import HOME, Dashboards, async_register_websocket

_STATIC_REGISTERED = f"{DOMAIN}_static_registered"


def _script_url() -> str:
    # The version query string busts the browser cache after each update.
    return f"{FRONTEND_URL_BASE}/{FRONTEND_SCRIPT}?v={VERSION}"


def panel_url(dashboard: str) -> str:
    """Sidebar URL of a dashboard: /terral-home for the first one, /terral-home-<id> for the rest."""
    return PANEL_URL_PATH if dashboard == HOME else f"{PANEL_URL_PATH}-{dashboard}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Serve the frontend, load the dashboards and register one sidebar panel per dashboard."""
    # Static paths and websocket commands cannot be unregistered,
    # so register them only once per run.
    if not hass.data.get(_STATIC_REGISTERED):
        www = Path(__file__).parent / "www"
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_URL_BASE, str(www), cache_headers=False)]
        )
        async_register_websocket(hass)
        hass.data[_STATIC_REGISTERED] = True

    async def register_panel(dash: dict[str, Any], update: bool = False) -> None:
        # Same panel config panel_custom builds, registered directly so a renamed
        # dashboard can be updated in place (the open page doesn't lose its panel).
        home = dash["id"] == HOME
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title=dash.get("title") or NAME,
            sidebar_icon=dash.get("icon") or (PANEL_ICON if home else DASHBOARD_ICON),
            frontend_url_path=panel_url(dash["id"]),
            config={
                "version": VERSION,
                "dashboard": dash["id"],
                "title": dash.get("title"),
                "_panel_custom": {
                    "name": "terral-home-panel",
                    "embed_iframe": False,
                    "trust_external": False,
                    "module_url": _script_url(),
                },
            },
            require_admin=bool(dash.get("require_admin")),
            update=update,
        )

    def remove_panel(dashboard: str) -> None:
        frontend.async_remove_panel(hass, panel_url(dashboard))

    dashboards = Dashboards(hass, register_panel, remove_panel)
    await dashboards.async_load()
    hass.data.setdefault(DOMAIN, {})["dashboards"] = dashboards

    # Cards stay available in regular dashboards too.
    add_extra_js_url(hass, _script_url())
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panels and stop loading the frontend bundle."""
    dashboards: Dashboards | None = hass.data.get(DOMAIN, {}).pop("dashboards", None)
    if dashboards:
        dashboards.unload()
    remove_extra_js_url(hass, _script_url())
    return True
