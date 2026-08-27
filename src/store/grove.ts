import { create } from "zustand";
import { DEFAULT_PALETTE_ID } from "@/lib/tree/palettes";
import { STARTING, growthCap } from "@/lib/tree/kinds";
import type { FractalKind, OverlayMode } from "@/lib/tree/types";

const DEFAULT_SEED = 20461;

function randomSeed() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return 100000 + (buf[0] % 900000);
  }
  return 100000 + Math.floor(Math.random() * 900000);
}

function clampExpansion(kind: FractalKind, depth: number, length: number, expansion: number) {
  return Math.min(expansion, growthCap(kind, depth, length));
}

export type GroveState = {
  seed: number;
  kind: FractalKind;
  angle: number;
  depth: number;
  length: number;
  wind: number;
  overlay: OverlayMode;
  paletteId: string;
  generation: number;
  expansion: number;
  expandPulse: boolean;
  regenerate: () => void;
  growAgain: () => void;
  setKind: (kind: FractalKind) => void;
  setAngle: (angle: number) => void;
  setDepth: (depth: number) => void;
  setLength: (length: number) => void;
  setWind: (wind: number) => void;
  setOverlay: (overlay: OverlayMode) => void;
  setPaletteId: (paletteId: string) => void;
};

export const useGroveStore = create<GroveState>((set) => ({
  seed: DEFAULT_SEED,
  kind: "grove",
  angle: STARTING.angle,
  depth: STARTING.depth,
  length: STARTING.length,
  wind: STARTING.wind,
  overlay: STARTING.overlay,
  paletteId: DEFAULT_PALETTE_ID,
  generation: 0,
  expansion: 0,
  expandPulse: false,
  regenerate: () =>
    set((s) => ({
      seed: randomSeed(),
      expansion: 0,
      expandPulse: false,
      generation: s.generation + 1,
    })),
  growAgain: () =>
    set((s) => {
      const cap = growthCap(s.kind, s.depth, s.length);
      return {
        expansion: Math.min(cap, s.expansion + 1),
        expandPulse: true,
        generation: s.generation + 1,
      };
    }),
  setKind: (kind) =>
    set((s) => ({
      kind,
      expansion: 0,
      expandPulse: false,
      generation: s.generation + 1,
    })),
  setAngle: (angle) => set({ angle }),
  setDepth: (depth) =>
    set((s) => ({
      depth,
      expansion: clampExpansion(s.kind, depth, s.length, s.expansion),
    })),
  setLength: (length) =>
    set((s) => ({
      length,
      expansion: clampExpansion(s.kind, s.depth, length, s.expansion),
    })),
  setWind: (wind) => set({ wind }),
  setOverlay: (overlay) => set({ overlay }),
  setPaletteId: (paletteId) => set({ paletteId }),
}));
