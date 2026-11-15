// Stops touch drags on an overlay (sheet, modal, backdrop) from scrolling the
// page behind it. On iOS a fixed overlay does not block scrolling by itself.
// Drags still scroll any scrollable area inside the overlay (e.g. a list),
// until it reaches its end.

function scrollableIn(path: EventTarget[], host: Element, dy: number): boolean {
  for (const node of path) {
    if (node === host) break;
    if (!(node instanceof HTMLElement)) continue;
    const oy = getComputedStyle(node).overflowY;
    if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 1) {
      // dy > 0: finger moves down → content scrolls up.
      if (dy > 0 && node.scrollTop > 0) return true;
      if (dy < 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
      if (dy === 0) return true;
    }
  }
  return false;
}

/** Attach to an overlay host. Returns a function that detaches it. */
export function lockBackgroundScroll(host: HTMLElement): () => void {
  let startY = 0;
  const onStart = (ev: TouchEvent) => {
    startY = ev.touches[0]?.clientY ?? 0;
  };
  const onMove = (ev: TouchEvent) => {
    if (!ev.cancelable) return;
    const y = ev.touches[0]?.clientY ?? startY;
    if (!scrollableIn(ev.composedPath(), host, y - startY)) ev.preventDefault();
  };
  const onWheel = (ev: WheelEvent) => {
    if (!scrollableIn(ev.composedPath(), host, -ev.deltaY)) ev.preventDefault();
  };
  host.addEventListener("touchstart", onStart, { passive: true });
  host.addEventListener("touchmove", onMove, { passive: false });
  host.addEventListener("wheel", onWheel, { passive: false });
  return () => {
    host.removeEventListener("touchstart", onStart);
    host.removeEventListener("touchmove", onMove);
    host.removeEventListener("wheel", onWheel);
  };
}
