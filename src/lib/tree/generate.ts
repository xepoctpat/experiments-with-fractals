import { mulberry32, randRange } from "./rng";
import type { Branch, Foliage, Grove } from "./types";

export type GenerateParams = {
  seed: number;
  angle: number;
  depth: number;
  expansion?: number;
  form?: "grove" | "willow" | "pine";
};

function pushFoliage(
  list: Foliage[],
  rng: () => number,
  kind: Foliage["kind"],
  t: number,
) {
  list.push({
    t,
    side: rng() < 0.5 ? 1 : -1,
    size: kind === "blossom" ? randRange(rng, 4.6, 8) : randRange(rng, 8, 15),
    tilt: randRange(rng, -0.55, 0.55),
    colorT: rng(),
    kind,
    petals: rng() < 0.2 ? 4 : 5,
    spin: rng() * Math.PI * 2,
  });
}

export function generateGrove(params: GenerateParams): Grove {
  const extra = Math.max(0, Math.round(params.expansion ?? 0));
  const willow = params.form === "willow";
  const pine = params.form === "pine";
  const rng = mulberry32(params.seed >>> 0);
  const branches: Branch[] = [];
  const depthCap = pine ? 11 : willow ? 12 : 13;
  const maxDepth = Math.min(depthCap, Math.round(params.depth) + extra);
  const spread = willow
    ? 0.36 + rng() * 0.14
    : (params.angle * Math.PI) / 180 * (pine ? 0.72 : 1);
  const weep = willow ? (params.angle * Math.PI) / 180 : 0;

  function addBranch(
    parent: number,
    length: number,
    width: number,
    angle: number,
    depth: number,
  ): number {
    const i = branches.length;
    const parentBranch = parent < 0 ? null : branches[parent];
    const startT = parentBranch
      ? parentBranch.startT + parentBranch.duration * 0.58
      : 0;
    const duration = 0.09 + 0.055 * (1 - depth / Math.max(1, maxDepth));
    const foliage: Foliage[] = [];

    const nearTip = depth >= maxDepth - 1 || length < 14;
    const midCanopy = depth >= Math.max(2, maxDepth - 4);

    if (nearTip) {
      pushFoliage(foliage, rng, "leaf", 1);
      if (rng() < (willow ? 0.4 : 0.72)) pushFoliage(foliage, rng, "blossom", 1);
      if (rng() < 0.35) pushFoliage(foliage, rng, "leaf", 0.82);
    } else if (midCanopy && rng() < (willow ? 0.7 : 0.58)) {
      const count = 1 + Math.floor(rng() * (willow ? 3 : 2));
      for (let n = 0; n < count; n++) {
        pushFoliage(
          foliage,
          rng,
          rng() < 0.18 ? "blossom" : "leaf",
          randRange(rng, 0.45, 0.95),
        );
      }
    }

    branches.push({
      parent,
      length,
      width,
      angle,
      depth,
      curve: randRange(rng, willow ? 0.05 : -0.22, willow ? 0.42 : 0.22),
      windPhase: rng() * Math.PI * 2,
      windAmp: randRange(rng, 0.45, 1),
      startT,
      duration,
      foliage,
    });

    if (depth >= maxDepth || length < 9) return i;

    const childWidth = Math.max(0.7, width * randRange(rng, willow ? 0.55 : 0.62, willow ? 0.68 : 0.72));
    const shrink = randRange(rng, willow ? 0.7 : 0.66, willow ? 0.86 : 0.78);
    const jitter = () => randRange(rng, -0.14, 0.14);
    const split = spread * randRange(rng, 0.82, 1.18);
    const droop = weep * (0.25 + depth / Math.max(1, maxDepth));

    const ternary = !willow && !pine && depth > 1 && depth < maxDepth - 1 && rng() < 0.08 + extra * 0.07;
    if (pine && depth < maxDepth) {
      const count = depth === 0 ? 2 : 3 + (rng() < 0.4 ? 1 : 0);
      for (let k = 0; k < count; k++) {
        const t = count === 1 ? 0.5 : k / (count - 1);
        addBranch(
          i,
          length * shrink * randRange(rng, 0.7, 0.88),
          childWidth,
          -split + t * 2 * split + jitter(),
          depth + 1,
        );
      }
      if (depth >= maxDepth - 2) {
        for (let n = 0; n < 4; n++) {
          addBranch(
            i,
            length * randRange(rng, 0.16, 0.28),
            childWidth * 0.4,
            randRange(rng, -1.05, 1.05),
            maxDepth,
          );
        }
      }
    } else if (ternary) {
      addBranch(i, length * shrink * randRange(rng, 0.92, 1.05), childWidth, -split + jitter(), depth + 1);
      addBranch(i, length * shrink * randRange(rng, 0.78, 0.95), childWidth * 0.9, jitter() * 0.4, depth + 1);
      addBranch(i, length * shrink * randRange(rng, 0.92, 1.05), childWidth, split + jitter(), depth + 1);
    } else {
      addBranch(
        i,
        length * shrink * randRange(rng, 0.9, 1.08),
        childWidth,
        -split * randRange(rng, 0.78, 1.12) - droop + jitter(),
        depth + 1,
      );
      addBranch(
        i,
        length * shrink * randRange(rng, 0.9, 1.08),
        childWidth,
        split * randRange(rng, 0.78, 1.12) + droop + jitter(),
        depth + 1,
      );
    }

    if (depth > 1 && depth < maxDepth - 1 && rng() < (willow ? 0.42 : 0.22) + extra * 0.08) {
      const dir = rng() < 0.5 ? -1 : 1;
      addBranch(
        i,
        length * randRange(rng, willow ? 0.34 : 0.28, willow ? 0.58 : 0.44),
        childWidth * 0.7,
        dir * randRange(rng, 0.7, 1.25) + dir * droop,
        maxDepth,
      );
    }

    return i;
  }

  const trunkLen = pine ? 158 : willow ? 132 : 150;
  const trunkWidth = randRange(rng, pine ? 11 : willow ? 10 : 12, pine ? 16 : willow ? 16 : 19);
  const lean = randRange(rng, willow ? -0.12 : -0.2, willow ? 0.12 : 0.2);
  addBranch(-1, trunkLen, trunkWidth, -Math.PI / 2 + lean, 0);
  if (!willow && !pine && rng() < 0.16 + extra * 0.04) {
    addBranch(
      -1,
      trunkLen * randRange(rng, 0.55, 0.78),
      trunkWidth * 0.62,
      -Math.PI / 2 + randRange(rng, -0.55, 0.55),
      1,
    );
  }

  let maxEnd = 0;
  for (const b of branches) {
    maxEnd = Math.max(maxEnd, b.startT + b.duration);
  }

  return {
    branches,
    maxEnd,
    maxDepth,
    trunkLength: trunkLen,
  };
}
