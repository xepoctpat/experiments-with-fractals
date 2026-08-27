import { FRACTAL_KINDS } from "@/lib/tree/kinds";
import { useGroveStore } from "@/store/grove";
import type { FractalKind, OverlayMode } from "@/lib/tree/types";

const OVERLAYS = new Set<OverlayMode>(["bare", "leaves", "blossoms", "both"]);
const KINDS = new Set<FractalKind>(FRACTAL_KINDS.map((k) => k.id));

let lastAt = 0;
let lastKey = "";

export function runGroveAction(action: string, value?: string) {
  const key = `${action}:${value ?? ""}`;
  const now = performance.now();
  if (key === lastKey && now - lastAt < 280) return false;
  lastKey = key;
  lastAt = now;

  const store = useGroveStore.getState();
  switch (action) {
    case "grow":
      store.growAgain();
      return true;
    case "regen":
      store.regenerate();
      return true;
    case "kind":
      if (value && KINDS.has(value as FractalKind)) {
        store.setKind(value as FractalKind);
        return true;
      }
      return false;
    case "overlay":
      if (value && OVERLAYS.has(value as OverlayMode)) {
        store.setOverlay(value as OverlayMode);
        return true;
      }
      return false;
    case "palette":
      if (value) {
        store.setPaletteId(value);
        return true;
      }
      return false;
    default:
      return false;
  }
}

export function handleGrovePointer(event: {
  button?: number;
  currentTarget: EventTarget;
}) {
  if (event.button && event.button > 0) return;
  const el = event.currentTarget;
  if (!(el instanceof HTMLElement)) return;
  const action = el.dataset.groveAction;
  if (!action) return;
  runGroveAction(action, el.dataset.groveValue);
}
