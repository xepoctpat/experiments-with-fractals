import type { Palette, RGB } from "./types";

export function css(c: RGB, a = 1): string {
  if (a >= 1) return `rgb(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0})`;
  return `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${Math.max(0, Math.min(1, a))})`;
}

export function mix(a: RGB, b: RGB, t: number): RGB {
  const u = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
    a[2] + (b[2] - a[2]) * u,
  ];
}

export function luma(c: RGB) {
  return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
}

export function skyLuma(p: Palette) {
  return luma(mix(p.skyTop, p.skyBottom, 0.42));
}

/** Bark/stroke that stays readable on the current sky. */
export function ink(p: Palette): RGB {
  const sky = skyLuma(p);
  if (sky > 0.58) return mix(p.bark, [32, 24, 18], 0.4);
  return mix(p.bark, p.celestialColor, 0.2);
}

/** Lift or deepen a fill so it doesn't dissolve into the ambient. */
export function wash(p: Palette, c: RGB): RGB {
  const sky = skyLuma(p);
  if (sky < 0.28) return mix(c, p.celestialColor, 0.22);
  if (sky > 0.62) return mix(c, p.bark, 0.16);
  return mix(c, p.haze, 0.08);
}

export function recede(p: Palette, c: RGB, t = 0.24): RGB {
  return mix(c, p.skyBottom, t);
}
