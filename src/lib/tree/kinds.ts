import type { FractalKind, OverlayMode } from "./types";

export type SliderKey = "angle" | "depth" | "length" | "wind";

export type SliderDef = {
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
};

export type KindMeta = {
  id: FractalKind;
  name: string;
  blurb: string;
  landscape: boolean;
  foliage: boolean;
  cutaway?: boolean;
  ceiling: number;
  load: (depth: number, length: number) => number;
  overlay: OverlayMode;
};

const REACH_MIN = 12;
const REACH_MAX = 46;
const AGE_MIN = 5;
const AGE_MAX = 11;

export const CONDITIONS: SliderDef[] = [
  {
    key: "angle",
    label: "Reach",
    min: REACH_MIN,
    max: REACH_MAX,
    step: 1,
    format: (v) => (v < 20 ? "narrow" : v > 34 ? "wide" : "open"),
  },
  {
    key: "depth",
    label: "Age",
    min: AGE_MIN,
    max: AGE_MAX,
    step: 1,
    format: (v) => `${Math.round(v)} seasons`,
  },
  {
    key: "length",
    label: "Vigor",
    min: 0.7,
    max: 1.4,
    step: 0.01,
    format: (v) => (v < 0.88 ? "spare" : v > 1.18 ? "vigorous" : "steady"),
  },
  {
    key: "wind",
    label: "Weather",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => (v < 0.22 ? "still" : v > 0.62 ? "rough" : "light"),
  },
];

export const STARTING = {
  angle: 26,
  depth: 9,
  length: 1,
  wind: 0.42,
  overlay: "leaves" as OverlayMode,
};

export const FRACTAL_KINDS: KindMeta[] = [
  {
    id: "grove",
    name: "Grove",
    blurb: "a branching tree",
    landscape: true,
    foliage: true,
    ceiling: 13,
    load: (d, l) => Math.round(d) + (l > 1.2 ? 1 : 0),
    overlay: "leaves",
  },
  {
    id: "flame",
    name: "Flame",
    blurb: "a tongue of fire",
    landscape: true,
    foliage: false,
    ceiling: 10,
    load: (d) => Math.round(d),
    overlay: "bare",
  },
  {
    id: "frost",
    name: "Frost",
    blurb: "an ice crystal",
    landscape: false,
    foliage: false,
    ceiling: 8,
    load: (d) => Math.round(d),
    overlay: "bare",
  },
  {
    id: "bolt",
    name: "Bolt",
    blurb: "a lightning fork",
    landscape: true,
    foliage: false,
    ceiling: 9,
    load: (d) => Math.round(d),
    overlay: "bare",
  },
  {
    id: "delta",
    name: "Delta",
    blurb: "a river branching to the sea",
    landscape: true,
    foliage: false,
    ceiling: 10,
    load: (d) => Math.round(d),
    overlay: "bare",
  },
  {
    id: "crystal",
    name: "Crystal",
    blurb: "a mineral cluster",
    landscape: true,
    foliage: false,
    ceiling: 8,
    load: (d) => Math.round(d),
    overlay: "bare",
  },
  {
    id: "shell",
    name: "Shell",
    blurb: "a chambered spiral",
    landscape: true,
    foliage: false,
    ceiling: 12,
    load: (d) => Math.round(d),
    overlay: "bare",
  },
  {
    id: "mycelium",
    name: "Mycelium",
    blurb: "an underground network",
    landscape: true,
    foliage: true,
    cutaway: true,
    ceiling: 11,
    load: (d) => Math.round(d),
    overlay: "blossoms",
  },
  {
    id: "feather",
    name: "Feather",
    blurb: "a pinnate vane",
    landscape: true,
    foliage: true,
    ceiling: 10,
    load: (d) => Math.round(d),
    overlay: "leaves",
  },
];

export function getKind(id: string): KindMeta {
  return FRACTAL_KINDS.find((k) => k.id === id) ?? FRACTAL_KINDS[0];
}

export function growthCap(kind: string, depth: number, length: number) {
  const meta = getKind(kind);
  return Math.max(1, meta.ceiling - meta.load(depth, length));
}

function map(v: number, a0: number, a1: number, b0: number, b1: number) {
  const t = (v - a0) / Math.max(1e-6, a1 - a0);
  return b0 + Math.max(0, Math.min(1, t)) * (b1 - b0);
}

/** Map shared starting conditions into the math each form actually uses. */
export function emergeParams(
  kind: FractalKind,
  angle: number,
  depth: number,
  length: number,
  wind: number,
) {
  switch (kind) {
    case "frost":
      return {
        angle: Math.round(map(angle, REACH_MIN, REACH_MAX, 4, 8)),
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 2, 6)),
        length,
        wind,
      };
    case "flame":
      return {
        angle: map(angle, REACH_MIN, REACH_MAX, 10, 38),
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 4, 9)),
        length,
        wind,
      };
    case "bolt":
      return {
        angle,
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 3, 8)),
        length,
        wind,
      };
    case "delta":
      return {
        angle: map(angle, REACH_MIN, REACH_MAX, 12, 42),
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 3, 8)),
        length,
        wind,
      };
    case "crystal":
      return {
        angle: Math.round(map(angle, REACH_MIN, REACH_MAX, 4, 8)),
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 2, 6)),
        length,
        wind,
      };
    case "shell":
      return {
        angle: map(angle, REACH_MIN, REACH_MAX, 0.12, 0.28),
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 8, 18)),
        length,
        wind,
      };
    case "mycelium":
      return {
        angle,
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 3, 9)),
        length,
        wind,
      };
    case "feather":
      return {
        angle: map(angle, REACH_MIN, REACH_MAX, 12, 42),
        depth: Math.round(map(depth, AGE_MIN, AGE_MAX, 4, 10)),
        length,
        wind,
      };
    default:
      return { angle, depth, length, wind };
  }
}

export function describeConditions(angle: number, depth: number, length: number, wind: number) {
  const reach = angle < 20 ? "narrow" : angle > 34 ? "wide" : "open";
  const age = depth <= 6 ? "young" : depth >= 10 ? "old" : "grown";
  const vigor = length < 0.88 ? "spare" : length > 1.18 ? "vigorous" : "steady";
  const weather = wind < 0.22 ? "still air" : wind > 0.62 ? "rough weather" : "a light wind";
  const article = reach === "open" ? "An" : "A";
  return `${article} ${reach}, ${age}, ${vigor} start in ${weather}.`;
}
