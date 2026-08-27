import { mulberry32 } from "./rng";
import { css, ink, mix, recede, wash } from "./color";
import type { Branch, DrawState, Foliage, Grove, Palette, RGB } from "./types";
import { emergeParams, getKind } from "./kinds";
import {
  drawBolt,
  drawCrystal,
  drawDelta,
  drawFeather,
  drawFlame,
  drawFrost,
  drawMycelium,
  drawShell,
} from "./draw-kinds";

type Node = {
  x: number;
  y: number;
  angle: number;
  drawn: number;
  growth: number;
};

function easeOutCubic(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return 1 - (1 - x) ** 3;
}

function branchGrowth(b: Branch, wave: number) {
  return easeOutCubic((wave - b.startT) / b.duration);
}

function layout(
  grove: Grove,
  wave: number,
  wind: number,
  time: number,
  ox: number,
  oy: number,
  scale: number,
): Node[] {
  const nodes: Node[] = new Array(grove.branches.length);
  const depthNorm = 1 / Math.max(1, grove.maxDepth);

  for (let i = 0; i < grove.branches.length; i++) {
    const b = grove.branches[i];
    const g = branchGrowth(b, wave);
    let x: number;
    let y: number;
    let base: number;

    if (b.parent < 0) {
      x = ox;
      y = oy;
      base = b.angle;
    } else {
      const p = nodes[b.parent];
      if (!p) {
        x = ox;
        y = oy;
        base = b.angle;
      } else {
        x = p.x + Math.cos(p.angle) * p.drawn;
        y = p.y + Math.sin(p.angle) * p.drawn;
        base = p.angle + b.angle;
      }
    }

    const tip = (b.depth * depthNorm) ** 1.35;
    const sway =
      Math.sin(time * 0.72 + b.windPhase) * wind * 0.26 * (0.18 + tip) * b.windAmp;
    const gust =
      Math.sin(time * 0.33 + b.windPhase * 1.7) * wind * 0.09 * tip;
    const angle = base + (sway + gust) * g;

    nodes[i] = {
      x,
      y,
      angle,
      drawn: b.length * scale * g,
      growth: g,
    };
  }

  return nodes;
}

function pointOnQuadratic(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  t: number,
) {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  };
}

function tangentOnQuadratic(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  t: number,
) {
  const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
  const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
  return Math.atan2(dy, dx);
}

function fillSky(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, css(p.skyTop));
  g.addColorStop(0.55, css(mix(p.skyTop, p.skyBottom, 0.55)));
  g.addColorStop(1, css(p.skyBottom));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const haze = ctx.createRadialGradient(w * 0.5, h * 0.42, 20, w * 0.5, h * 0.55, w * 0.72);
  haze.addColorStop(0, css(p.haze, 0.22));
  haze.addColorStop(1, css(p.haze, 0));
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, w, h);
}

function drawCelestial(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
  if (p.celestial === "none") return;
  const cx = w * (p.celestial === "sun" ? 0.78 : 0.74);
  const cy = h * (p.celestial === "sun" ? 0.78 : 0.18);
  const r = p.celestial === "sun" ? Math.min(w, h) * 0.16 : Math.min(w, h) * 0.07;

  const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 4.2);
  glow.addColorStop(0, css(p.celestialColor, p.celestial === "sun" ? 0.35 : 0.2));
  glow.addColorStop(1, css(p.celestialColor, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 4.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = css(p.celestialColor, p.celestial === "sun" ? 0.95 : 0.88);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  if (p.celestial === "moon") {
    ctx.fillStyle = css(p.skyTop, 0.55);
    ctx.beginPath();
    ctx.arc(cx + r * 0.38, cy - r * 0.18, r * 0.82, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSoilCutaway(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
  const gy = h * 0.4;

  ctx.fillStyle = css(recede(p, p.hillFar, 0.35), 0.85);
  ctx.beginPath();
  ctx.moveTo(0, gy);
  ctx.lineTo(0, gy - h * 0.12);
  ctx.quadraticCurveTo(w * 0.3, gy - h * 0.2, w * 0.62, gy - h * 0.1);
  ctx.quadraticCurveTo(w * 0.85, gy - h * 0.04, w, gy - h * 0.14);
  ctx.lineTo(w, gy);
  ctx.closePath();
  ctx.fill();

  const soil = ctx.createLinearGradient(0, gy, 0, h);
  soil.addColorStop(0, css(mix(p.ground, p.bark, 0.18)));
  soil.addColorStop(0.35, css(mix(p.ground, p.bark, 0.45)));
  soil.addColorStop(1, css(mix(p.bark, [12, 8, 6], 0.35)));
  ctx.fillStyle = soil;
  ctx.fillRect(0, gy, w, h - gy);

  for (let i = 1; i <= 4; i++) {
    const y = gy + ((h - gy) * i) / 5;
    ctx.strokeStyle = css(p.bark, 0.08);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(w * 0.5, y + (i % 2 === 0 ? 6 : -5), w, y);
    ctx.stroke();
  }

  ctx.fillStyle = css(p.hillNear);
  ctx.beginPath();
  ctx.moveTo(0, gy + 7);
  ctx.quadraticCurveTo(w * 0.35, gy - 10, w * 0.7, gy + 4);
  ctx.quadraticCurveTo(w * 0.88, gy + 10, w, gy - 2);
  ctx.lineTo(w, gy + 14);
  ctx.lineTo(0, gy + 14);
  ctx.closePath();
  ctx.fill();

  const lip = ctx.createLinearGradient(0, gy - 2, 0, gy + 18);
  lip.addColorStop(0, css(p.ground, 0));
  lip.addColorStop(0.45, css(p.ground, 0.7));
  lip.addColorStop(1, css(mix(p.ground, p.bark, 0.3), 0.9));
  ctx.fillStyle = lip;
  ctx.fillRect(0, gy - 2, w, 22);
}

function drawHills(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
  ctx.fillStyle = css(recede(p, p.hillFar, 0.28), 0.92);
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.72);
  ctx.quadraticCurveTo(w * 0.22, h * 0.62, w * 0.48, h * 0.7);
  ctx.quadraticCurveTo(w * 0.72, h * 0.78, w, h * 0.66);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = css(recede(p, p.hillNear, 0.12));
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.84);
  ctx.quadraticCurveTo(w * 0.3, h * 0.76, w * 0.58, h * 0.86);
  ctx.quadraticCurveTo(w * 0.8, h * 0.92, w, h * 0.8);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  const ground = ctx.createLinearGradient(0, h * 0.86, 0, h);
  ground.addColorStop(0, css(p.ground, 0));
  ground.addColorStop(0.35, css(p.ground, 0.85));
  ground.addColorStop(1, css(p.ground));
  ctx.fillStyle = ground;
  ctx.fillRect(0, h * 0.86, w, h * 0.14);
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Palette,
  time: number,
  seed: number,
) {
  if (p.particleCount <= 0) return;
  const rng = mulberry32((seed ^ 0x9e3779b9) >>> 0);
  ctx.save();
  for (let i = 0; i < p.particleCount; i++) {
    const px = rng();
    const py = rng() * 0.78;
    const r = 0.6 + rng() * 1.6;
    const phase = rng() * Math.PI * 2;
    const speed = 0.04 + rng() * 0.08;
    const bob = Math.sin(time * speed + phase);
    const drift = ((time * (0.008 + rng() * 0.012) + px) % 1 + 1) % 1;
    const x = drift * w;
    const y = py * h + bob * 10;
    const a = 0.18 + (0.35 + rng() * 0.25) * (0.5 + 0.5 * Math.sin(time * 0.7 + phase));
    ctx.fillStyle = css(p.particle, a);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function controlPoint(node: Node, b: Branch) {
  const ex = node.x + Math.cos(node.angle) * node.drawn;
  const ey = node.y + Math.sin(node.angle) * node.drawn;
  const nx = -Math.sin(node.angle);
  const ny = Math.cos(node.angle);
  const mag = b.curve * node.drawn;
  return {
    ex,
    ey,
    cx: (node.x + ex) / 2 + nx * mag,
    cy: (node.y + ey) / 2 + ny * mag,
  };
}

function drawBranches(
  ctx: CanvasRenderingContext2D,
  grove: Grove,
  nodes: Node[],
  palette: Palette,
) {
  for (let i = 0; i < grove.branches.length; i++) {
    const b = grove.branches[i];
    const n = nodes[i];
    if (n.growth <= 0.001) continue;
    const { ex, ey, cx, cy } = controlPoint(n, b);
    const t = b.depth / Math.max(1, grove.maxDepth);
    const color = mix(ink(palette), wash(palette, palette.barkTip), t);
    ctx.strokeStyle = css(color);
    ctx.lineWidth = Math.max(0.65, b.width * Math.max(0.25, n.growth));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(n.x, n.y);
    ctx.quadraticCurveTo(cx, cy, ex, ey);
    ctx.stroke();
  }
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number,
  color: RGB,
  alpha: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = css(color);
  ctx.beginPath();
  ctx.ellipse(size * 0.55, 0, size, size * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBlossom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  spin: number,
  petals: number,
  petal: RGB,
  center: RGB,
  alpha: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.globalAlpha = alpha;
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    ctx.fillStyle = css(petal);
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(a) * size * 0.42,
      Math.sin(a) * size * 0.42,
      size * 0.42,
      size * 0.24,
      a,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = css(center);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFoliage(
  ctx: CanvasRenderingContext2D,
  grove: Grove,
  nodes: Node[],
  palette: Palette,
  overlay: DrawState["overlay"],
  time: number,
  want: Foliage["kind"],
) {
  const showLeaves = overlay === "leaves" || overlay === "both";
  const showBlossoms = overlay === "blossoms" || overlay === "both";
  if (want === "leaf" && !showLeaves) return;
  if (want === "blossom" && !showBlossoms) return;

  for (let i = 0; i < grove.branches.length; i++) {
    const b = grove.branches[i];
    const n = nodes[i];
    if (n.growth < 0.55) continue;
    const { ex, ey, cx, cy } = controlPoint(n, b);

    for (const f of b.foliage) {
      if (f.kind !== want) continue;
      const appear = Math.max(0, Math.min(1, (n.growth - 0.62) / 0.38));
      if (appear <= 0) continue;
      const pt = pointOnQuadratic(n.x, n.y, cx, cy, ex, ey, f.t);
      const tan = tangentOnQuadratic(n.x, n.y, cx, cy, ex, ey, f.t);
      const breathe = 1 + Math.sin(time * 1.1 + f.spin) * 0.04;
      const size = f.size * appear * breathe;

      if (f.kind === "leaf") {
        const color = wash(palette, mix(palette.leafA, palette.leafB, f.colorT));
        drawLeaf(ctx, pt.x, pt.y, tan + f.tilt + f.side * 0.35, size, color, 0.55 + appear * 0.4);
      } else {
        const petal = wash(palette, mix(palette.blossom, palette.blossomAlt, f.colorT));
        drawBlossom(
          ctx,
          pt.x,
          pt.y,
          size,
          f.spin + tan * 0.2,
          f.petals,
          petal,
          palette.blossomCenter,
          0.65 + appear * 0.35,
        );
      }
    }
  }
}

function drawPlate(
  ctx: CanvasRenderingContext2D,
  p: Palette,
  cx: number,
  cy: number,
  r: number,
) {
  const g = ctx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
  g.addColorStop(0, css(mix(p.haze, p.celestialColor, 0.25), 0.2));
  g.addColorStop(0.55, css(p.haze, 0.08));
  g.addColorStop(1, css(p.haze, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawContact(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  p: Palette,
  scale: number,
) {
  ctx.fillStyle = css(p.ground, 0.35);
  ctx.beginPath();
  ctx.ellipse(ox, oy + 4, 28 * scale, 6 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawRootFlare(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  palette: Palette,
  growth: number,
  width: number,
) {
  if (growth < 0.05) return;
  ctx.fillStyle = css(ink(palette), 0.95);
  ctx.beginPath();
  ctx.moveTo(ox - width * 1.15, oy + 6);
  ctx.quadraticCurveTo(ox, oy - width * 0.2, ox + width * 1.15, oy + 6);
  ctx.quadraticCurveTo(ox, oy + 14, ox - width * 1.15, oy + 6);
  ctx.fill();
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, p: Palette) {
  const g = ctx.createRadialGradient(w * 0.5, h * 0.48, Math.min(w, h) * 0.25, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
  g.addColorStop(0, css(p.vignette, 0));
  g.addColorStop(1, css(p.vignette, 0.38));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function drawGrove(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: DrawState,
  seed: number,
  length: number,
) {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const kind = getKind(state.kind);
  const emerged = emergeParams(
    state.kind,
    state.angle,
    state.depth,
    state.length,
    state.wind,
  );
  const mapped: DrawState = { ...state, ...emerged, length: emerged.length };

  fillSky(ctx, w, h, mapped.palette);
  drawCelestial(ctx, w, h, mapped.palette);
  if (kind.cutaway) drawSoilCutaway(ctx, w, h, mapped.palette);
  else if (kind.landscape) drawHills(ctx, w, h, mapped.palette);

  const time = mapped.reducedMotion ? 0 : mapped.time;
  const wind = mapped.reducedMotion ? 0 : emerged.wind;
  const live: DrawState = { ...mapped, time, wind, length: emerged.length, seed };

  const plateR = Math.min(w, h) * 0.42 * Math.max(0.7, emerged.length);
  if (state.kind === "frost") {
    drawPlate(ctx, mapped.palette, w * 0.5, h * 0.48, plateR);
  } else if (kind.cutaway) {
    drawPlate(ctx, mapped.palette, w * 0.5, h * 0.68, plateR * 0.9);
  } else if (kind.landscape) {
    drawPlate(ctx, mapped.palette, w * 0.5, h * 0.58, plateR);
  }

  switch (state.kind) {
    case "frost":
      drawFrost(ctx, w, h, live);
      break;
    case "bolt":
      drawBolt(ctx, w, h, live);
      break;
    case "flame":
      drawFlame(ctx, w, h, live);
      break;
    case "delta":
      drawDelta(ctx, w, h, live);
      break;
    case "crystal":
      drawCrystal(ctx, w, h, live);
      break;
    case "shell":
      drawShell(ctx, w, h, live);
      break;
    case "mycelium":
      drawMycelium(ctx, w, h, live);
      break;
    case "feather":
      drawFeather(ctx, w, h, live);
      break;
    default: {
      const grove = state.grove;
      if (grove) {
        const ox = w * 0.5;
        const oy = h * 0.88;
        const trunkPx = Math.min(w, h) * (0.2 * Math.max(0.2, emerged.length));
        const scale = trunkPx / Math.max(1, grove.trunkLength);
        const wave = state.growth * (grove.maxEnd + 0.04);
        const nodes = layout(grove, wave, wind, time, ox, oy, scale);
        drawContact(ctx, ox, oy, mapped.palette, Math.max(0.4, emerged.length));
        const trunk = grove.branches[0];
        if (trunk) {
          drawRootFlare(ctx, ox, oy, mapped.palette, branchGrowth(trunk, wave), trunk.width);
        }
        drawBranches(ctx, grove, nodes, mapped.palette);
        drawFoliage(ctx, grove, nodes, mapped.palette, state.overlay, time, "leaf");
        drawFoliage(ctx, grove, nodes, mapped.palette, state.overlay, time, "blossom");
      }
    }
  }

  if (state.kind !== "frost") {
    drawParticles(ctx, w, h, mapped.palette, time, seed);
  }
  drawVignette(ctx, w, h, mapped.palette);
}

export function growthDurationMs(depth: number, reduced: boolean, expand = false) {
  if (reduced) return 0;
  if (expand) return 1200 + depth * 70;
  return 2400 + depth * 140;
}
