export type RGB = readonly [number, number, number];

export type OverlayMode = "bare" | "leaves" | "blossoms" | "both";

export type FractalKind =
  | "grove"
  | "flame"
  | "frost"
  | "bolt"
  | "delta"
  | "crystal"
  | "shell"
  | "mycelium"
  | "feather";

export type FoliageKind = "leaf" | "blossom";

export type Foliage = {
  t: number;
  side: 1 | -1;
  size: number;
  tilt: number;
  colorT: number;
  kind: FoliageKind;
  petals: number;
  spin: number;
};

export type Branch = {
  parent: number;
  length: number;
  width: number;
  angle: number;
  depth: number;
  curve: number;
  windPhase: number;
  windAmp: number;
  startT: number;
  duration: number;
  foliage: Foliage[];
};

export type Grove = {
  branches: Branch[];
  maxEnd: number;
  maxDepth: number;
  trunkLength: number;
};

export type Palette = {
  id: string;
  name: string;
  skyTop: RGB;
  skyBottom: RGB;
  haze: RGB;
  hillFar: RGB;
  hillNear: RGB;
  ground: RGB;
  bark: RGB;
  barkTip: RGB;
  leafA: RGB;
  leafB: RGB;
  blossom: RGB;
  blossomAlt: RGB;
  blossomCenter: RGB;
  celestial: "moon" | "sun" | "none";
  celestialColor: RGB;
  particle: RGB;
  particleCount: number;
  vignette: RGB;
};

export type DrawState = {
  grove: Grove | null;
  kind: FractalKind;
  palette: Palette;
  overlay: OverlayMode;
  wind: number;
  time: number;
  growth: number;
  reducedMotion: boolean;
  length: number;
  seed: number;
  angle: number;
  depth: number;
  expansion: number;
};
