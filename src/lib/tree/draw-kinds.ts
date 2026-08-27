import { mulberry32, randRange } from "./rng";
import { css, ink, mix, wash } from "./color";
import type { DrawState, Palette } from "./types";

function sway(wind: number, time: number, phase: number) {
  return Math.sin(time * 0.7 + phase) * wind * 0.18;
}

function extra(s: DrawState) {
  return Math.max(0, s.expansion | 0);
}

function frostArm(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ang: number,
  len: number,
  depth: number,
  order: number,
  t: number,
  palette: Palette,
  wind: number,
  time: number,
  fork: number,
) {
  if (depth > order || t <= 0 || len < 3) return;
  const wobble = Math.sin(time * 0.9 + depth) * wind * 0.12;
  const x2 = x + Math.cos(ang + wobble) * len;
  const y2 = y + Math.sin(ang + wobble) * len;
  ctx.strokeStyle = css(
    wash(palette, mix(palette.celestialColor, palette.leafA, depth / (order + 1))),
    0.4 + t * 0.55,
  );
  ctx.lineWidth = Math.max(0.6, 2.4 - depth * 0.28);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const next = len * 0.52;
  frostArm(ctx, x2, y2, ang - fork, next, depth + 1, order, t - 0.12, palette, wind, time, fork);
  frostArm(ctx, x2, y2, ang + fork, next, depth + 1, order, t - 0.12, palette, wind, time, fork);
  frostArm(ctx, x2, y2, ang, next * 1.08, depth + 1, order, t - 0.08, palette, wind, time, fork);
}

export function drawFrost(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const ox = w * 0.5;
  const oy = h * 0.48;
  const arms = Math.max(4, Math.min(8, Math.round(s.angle)));
  const fork = 0.48 + rng() * 0.22;
  const order = Math.max(2, Math.min(7, Math.round(s.depth) + extra(s)));
  const span = Math.min(w, h) * 0.22 * s.length;
  const spin = rng() * Math.PI;
  ctx.lineCap = "round";
  for (let i = 0; i < arms; i++) {
    const ang = spin + (i / arms) * Math.PI * 2;
    frostArm(ctx, ox, oy, ang, span, 0, order, s.growth, s.palette, s.wind, s.time, fork);
  }
  ctx.fillStyle = css(s.palette.celestialColor, 0.85);
  ctx.beginPath();
  ctx.arc(ox, oy, 3.2, 0, Math.PI * 2);
  ctx.fill();
}

function lightning(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  jag: number,
  depth: number,
  fork: number,
  rng: () => number,
  palette: Palette,
  t: number,
) {
  if (t <= 0) return;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy);
  if (depth <= 0 || dist < 8) {
    ctx.strokeStyle = css(palette.celestialColor, 0.5 + t * 0.5);
    ctx.lineWidth = Math.max(1.4, 7 - depth);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    return;
  }
  const mx = (x0 + x1) / 2 + (rng() - 0.5) * jag * dist;
  const my = (y0 + y1) / 2 + (rng() - 0.5) * jag * dist * 0.55;
  lightning(ctx, x0, y0, mx, my, jag * 0.7, depth - 1, fork, rng, palette, t);
  lightning(ctx, mx, my, x1, y1, jag * 0.7, depth - 1, fork, rng, palette, t - 0.04);
  if (rng() < fork && depth > 1) {
    const ang = Math.atan2(dy, dx) + (rng() - 0.5) * 1.4;
    const fl = dist * randRange(rng, 0.28, 0.55);
    lightning(
      ctx,
      mx,
      my,
      mx + Math.cos(ang) * fl,
      my + Math.sin(ang) * fl,
      jag * 0.6,
      depth - 2,
      fork * 0.6,
      rng,
      palette,
      t - 0.12,
    );
  }
}

export function drawBolt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const fork = s.angle / 80;
  const bolts = 1 + extra(s) + (rng() < fork ? 1 : 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let b = 0; b < bolts; b++) {
    const x0 = w * (0.22 + rng() * 0.56);
    const y0 = h * 0.04;
    const x1 = x0 + (rng() - 0.5) * w * 0.42 + sway(s.wind, s.time, b) * 90;
    const y1 = h * (0.5 + s.length * 0.32);
    ctx.shadowColor = css(s.palette.celestialColor, 0.8);
    ctx.shadowBlur = 28;
    lightning(
      ctx,
      x0,
      y0,
      x1,
      y1,
      0.16 + s.depth * 0.03 + rng() * 0.06,
      Math.max(3, Math.round(s.depth) + extra(s)),
      fork + extra(s) * 0.05,
      rng,
      s.palette,
      s.growth,
    );
  }
  ctx.shadowBlur = 0;
}

export function drawSpiral(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const n = Math.floor(140 + s.depth * 70 + extra(s) * 90);
  const shown = Math.floor(n * s.growth);
  const golden = (s.angle * Math.PI) / 180;
  const c = Math.min(w, h) * 0.012 * s.length * (1 + extra(s) * 0.04);
  const ox = w * 0.5;
  const oy = h * 0.52;
  const showLeaf = s.overlay === "leaves" || s.overlay === "both" || s.overlay === "bare";
  const showBloom = s.overlay === "blossoms" || s.overlay === "both";
  for (let i = 0; i < shown; i++) {
    const r = c * Math.sqrt(i);
    const a = i * golden + sway(s.wind, s.time, i * 0.01);
    const x = ox + Math.cos(a) * r;
    const y = oy + Math.sin(a) * r;
    const size = 2.2 + (1 - i / n) * 7 * s.length;
    if (showBloom && i % 7 === 0) {
      ctx.fillStyle = css(wash(s.palette, mix(s.palette.blossom, s.palette.blossomAlt, (i % 13) / 13)), 0.78);
      ctx.beginPath();
      ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (showLeaf) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = css(wash(s.palette, mix(s.palette.leafA, s.palette.leafB, (i % 9) / 9)), 0.78);
      ctx.beginPath();
      ctx.ellipse(size * 0.4, 0, size, size * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

function hypha(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ang: number,
  len: number,
  depth: number,
  maxD: number,
  s: DrawState,
  rng: () => number,
  t: number,
  groundY: number,
  floorY: number,
  width: number,
  fruit: Array<{ x: number; y: number }>,
) {
  if (depth > maxD || t <= 0 || len < 3) return;
  const pulse = 0.4 + 0.5 * Math.sin(s.time * (0.7 + s.wind) + depth + x * 0.01);
  let nextAng = ang + randRange(rng, -s.angle / 55, s.angle / 55);
  let x2 = x + Math.cos(nextAng) * len;
  let y2 = y + Math.sin(nextAng) * len;
  if (y2 < groundY + 6) {
    y2 = groundY + 6 + (groundY + 6 - y2) * 0.4;
    nextAng = Math.PI / 2 + randRange(rng, -1.1, 1.1);
    x2 = x + Math.cos(nextAng) * len;
    y2 = Math.max(groundY + 6, y + Math.sin(nextAng) * len);
    if (depth > 1 && rng() < 0.12) fruit.push({ x, y: groundY });
  }
  if (y2 > floorY) {
    y2 = floorY - rng() * 8;
    nextAng = -Math.PI / 2 + randRange(rng, -1.2, 1.2);
  }
  if (x2 < 8) x2 = 8 + rng() * 6;
  if (x2 > width - 8) x2 = width - 8 - rng() * 6;
  ctx.strokeStyle = css(
    mix(s.palette.celestialColor, s.palette.leafA, 0.35 + (depth / maxD) * 0.4),
    0.55 + t * 0.4 * pulse,
  );
  ctx.lineWidth = Math.max(0.9, 3.1 - depth * 0.24);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(
    (x + x2) / 2 + Math.sin(nextAng) * 4,
    (y + y2) / 2,
    x2,
    y2,
  );
  ctx.stroke();
  if (depth >= maxD - 1 || rng() < 0.16) {
    ctx.fillStyle = css(s.palette.celestialColor, 0.22 + pulse * 0.45);
    ctx.beginPath();
    ctx.arc(x2, y2, 1.4 + rng() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  const forks = 1 + (rng() < s.angle / 65 ? 1 : 0) + (rng() < 0.22 ? 1 : 0);
  for (let i = 0; i < forks; i++) {
    hypha(
      ctx,
      x2,
      y2,
      nextAng + randRange(rng, -s.angle / 48, s.angle / 48),
      len * randRange(rng, 0.58, 0.82),
      depth + 1,
      maxD,
      s,
      rng,
      t - 0.08,
      groundY,
      floorY,
      width,
      fruit,
    );
  }
}

function drawMushroom(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  s: DrawState,
  bloom: boolean,
) {
  const size = (bloom ? 7 : 5) * s.length;
  const stemH = size * (bloom ? 2.1 : 1.5);
  ctx.strokeStyle = css(ink(s.palette), 0.85);
  ctx.lineWidth = Math.max(1.2, size * 0.28);
  ctx.beginPath();
  ctx.moveTo(x, groundY + 4);
  ctx.lineTo(x, groundY - stemH);
  ctx.stroke();
  ctx.fillStyle = css(wash(s.palette, bloom ? s.palette.blossom : s.palette.leafA), 0.9);
  ctx.beginPath();
  ctx.ellipse(x, groundY - stemH, size, size * 0.55, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  if (bloom) {
    ctx.fillStyle = css(s.palette.blossomCenter, 0.7);
    ctx.beginPath();
    ctx.ellipse(x, groundY - stemH + 1, size * 0.45, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawMycelium(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const groundY = h * 0.4;
  const floorY = h * 0.96;
  const origins = 5 + extra(s) + Math.floor(rng() * 3);
  const maxD = Math.max(3, Math.round(s.depth) + extra(s));
  const fruit: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < origins; i++) {
    const x = w * (0.08 + (i / Math.max(1, origins - 1)) * 0.84);
    const y = groundY + 18 + rng() * (h * 0.12);
    const shoots = 3 + Math.floor(rng() * 3);
    for (let k = 0; k < shoots; k++) {
      const ang = randRange(rng, 0.15, Math.PI - 0.15);
      hypha(
        ctx,
        x,
        y,
        ang,
        Math.min(w, h) * 0.055 * s.length,
        0,
        maxD,
        s,
        rng,
        s.growth,
        groundY,
        floorY,
        w,
        fruit,
      );
    }
  }
  const showLeaf = s.overlay === "leaves" || s.overlay === "both";
  const showBloom = s.overlay === "blossoms" || s.overlay === "both";
  const nFruit = Math.min(fruit.length, 4 + extra(s) * 2);
  for (let i = 0; i < nFruit; i++) {
    if (s.growth < 0.55) break;
    if (showBloom) drawMushroom(ctx, fruit[i].x, groundY, s, true);
    else if (showLeaf) drawMushroom(ctx, fruit[i].x, groundY, s, false);
  }
}

function heartLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ang: number,
  size: number,
  color: ReturnType<typeof mix>,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = css(color, 0.88);
  ctx.beginPath();
  ctx.moveTo(0, size * 0.55);
  ctx.bezierCurveTo(-size * 1.05, size * 0.05, -size * 0.55, -size * 0.75, 0, -size * 0.12);
  ctx.bezierCurveTo(size * 0.55, -size * 0.75, size * 1.05, size * 0.05, 0, size * 0.55);
  ctx.fill();
  ctx.restore();
}

export function drawIvy(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const wallL = w * 0.18;
  const wallR = w * 0.88;
  const wallT = h * 0.1;
  const wallB = h * 0.88;
  const grout = mix(s.palette.bark, s.palette.skyBottom, 0.2);
  ctx.fillStyle = css(mix(s.palette.ground, s.palette.bark, 0.35), 0.94);
  ctx.beginPath();
  ctx.moveTo(wallL, wallB);
  ctx.lineTo(wallL, wallT + 18);
  ctx.lineTo(wallL + 14, wallT);
  ctx.lineTo(wallR, wallT + 10);
  ctx.lineTo(wallR + 8, wallB);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = css(grout, 0.35);
  ctx.lineWidth = 1;
  const rows = 9;
  const cols = 6;
  for (let r = 0; r < rows; r++) {
    const y = wallT + 16 + ((wallB - wallT - 24) * r) / rows;
    const ox = r % 2 === 0 ? 0 : (wallR - wallL) / (cols * 2);
    for (let c = 0; c < cols; c++) {
      const x = wallL + 10 + ox + ((wallR - wallL - 24) * c) / cols;
      ctx.strokeRect(x, y, (wallR - wallL) / cols - 8, (wallB - wallT) / rows - 6);
    }
  }

  const vines = Math.max(4, Math.round(s.depth) + extra(s));
  const wander = (s.angle * Math.PI) / 180;
  const showLeaf = s.overlay === "leaves" || s.overlay === "both" || s.overlay === "bare";
  const showBloom = s.overlay === "blossoms" || s.overlay === "both";
  const maxD = Math.max(4, Math.round(s.depth) + extra(s));
  const climb = (wallB - wallT) * 0.12 * s.length;

  function tendril(x: number, y: number, ang: number, len: number, depth: number, t: number) {
    if (depth > maxD || t <= 0 || len < 4) return;
    let a = ang + sway(s.wind, s.time, depth + x * 0.02) * 0.45;
    let x2 = x + Math.cos(a) * len;
    let y2 = y + Math.sin(a) * len;
    if (x2 < wallL + 8) {
      x2 = wallL + 8;
      a = -Math.PI / 2 + randRange(rng, -0.4, 0.6);
    }
    if (x2 > wallR - 6) {
      x2 = wallR - 6;
      a = -Math.PI / 2 + randRange(rng, -0.6, 0.4);
    }
    if (y2 < wallT + 8) y2 = wallT + 8;
    if (y2 > wallB) y2 = wallB;
    ctx.strokeStyle = css(ink(s.palette), 0.8);
    ctx.lineWidth = Math.max(0.7, 2.6 - depth * 0.22);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (showLeaf && rng() < 0.72) {
      heartLeaf(
        ctx,
        x2,
        y2,
        a + randRange(rng, -0.7, 0.7),
        5.5 * s.length * (1 - depth / (maxD + 2)),
        wash(s.palette, mix(s.palette.leafA, s.palette.leafB, rng())),
      );
    }
    if (showBloom && rng() < 0.08) {
      ctx.fillStyle = css(wash(s.palette, s.palette.blossom), 0.85);
      ctx.beginPath();
      ctx.arc(x2, y2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    const forks = 1 + (rng() < 0.55 ? 1 : 0);
    for (let i = 0; i < forks; i++) {
      tendril(
        x2,
        y2,
        -Math.PI / 2 + randRange(rng, -wander, wander),
        len * randRange(rng, 0.7, 0.9),
        depth + 1,
        t - 0.07,
      );
    }
  }

  for (let i = 0; i < vines; i++) {
    const x = wallL + 16 + ((wallR - wallL - 32) * i) / Math.max(1, vines - 1);
    tendril(x, wallB, -Math.PI / 2 + randRange(rng, -0.25, 0.25), climb, 0, s.growth);
  }
}

export function drawFeather(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const ox = w * 0.5;
  const oy = h * 0.9;
  const lean = (rng() - 0.5) * 0.3;
  const span = Math.min(w, h) * 0.72 * s.length;
  const barbs = Math.max(10, Math.round(s.depth) * 3 + extra(s) * 4);
  const shown = Math.max(2, Math.floor(barbs * s.growth));
  const ang0 = -Math.PI / 2 + lean;
  const tipX = ox + Math.cos(ang0) * span;
  const tipY = oy + Math.sin(ang0) * span;
  const flutter = s.wind;
  const showVane = s.overlay !== "bare";
  const showAfter = s.overlay === "blossoms" || s.overlay === "both";

  ctx.strokeStyle = css(ink(s.palette), 0.95);
  ctx.lineWidth = 3.2 * s.length;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  const spread = (s.angle * Math.PI) / 180;
  for (let i = 1; i <= shown; i++) {
    const t = i / (barbs + 1);
    const bx = ox + (tipX - ox) * t;
    const by = oy + (tipY - oy) * t;
    const side = i % 2 === 0 ? 1 : -1;
    const wave = Math.sin(s.time * 1.2 + i * 0.35) * flutter * 0.18;
    const barbAng = ang0 + side * (spread * (0.55 + t * 0.5) + wave);
    const barbLen = span * 0.38 * (1 - t * 0.55) * s.length;
    const ex = bx + Math.cos(barbAng) * barbLen;
    const ey = by + Math.sin(barbAng) * barbLen;
    ctx.strokeStyle = css(wash(s.palette, mix(s.palette.leafA, s.palette.leafB, t)), 0.85);
    ctx.lineWidth = Math.max(0.7, 2.1 * (1 - t));
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(
      bx + Math.cos(barbAng - side * 0.25) * barbLen * 0.45,
      by + Math.sin(barbAng - side * 0.25) * barbLen * 0.45,
      ex,
      ey,
    );
    ctx.stroke();
    if (showVane && i % 2 === 0) {
      const sub = 3 + extra(s);
      for (let k = 1; k <= sub; k++) {
        const u = k / (sub + 1);
        const sx = bx + (ex - bx) * u;
        const sy = by + (ey - by) * u;
        const sl = barbLen * 0.18 * (1 - u);
        ctx.strokeStyle = css(wash(s.palette, s.palette.leafB), 0.45);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(
          sx + Math.cos(barbAng + side * 0.7) * sl,
          sy + Math.sin(barbAng + side * 0.7) * sl,
        );
        ctx.stroke();
      }
    }
    if (showAfter && i % 5 === 0) {
      ctx.fillStyle = css(wash(s.palette, s.palette.blossom), 0.7);
      ctx.beginPath();
      ctx.arc(ex, ey, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawFlame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const spread = (s.angle * Math.PI) / 180;
  const maxD = Math.max(3, Math.round(s.depth) + extra(s));
  const tongues = 3 + extra(s) + (rng() < 0.4 ? 1 : 0);
  ctx.lineCap = "round";
  ctx.globalCompositeOperation = "lighter";

  function tongue(
    x: number,
    y: number,
    ang: number,
    len: number,
    width: number,
    depth: number,
    t: number,
  ) {
    if (depth > maxD || t <= 0 || len < 4) return;
    const flick = Math.sin(s.time * (6 + s.wind * 8) + depth * 1.7 + x * 0.02) * s.wind * 0.35;
    const x2 = x + Math.cos(ang + flick) * len;
    const y2 = y + Math.sin(ang + flick) * len;
    const heat = depth / maxD;
    ctx.strokeStyle = css(
      mix(s.palette.bark, mix(s.palette.blossom, s.palette.celestialColor, heat), 0.35 + heat * 0.65),
      0.35 + t * 0.5,
    );
    ctx.lineWidth = Math.max(0.8, width);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      (x + x2) / 2 + Math.sin(ang) * len * 0.15,
      (y + y2) / 2,
      x2,
      y2,
    );
    ctx.stroke();
    const split = 1 + (rng() < 0.55 ? 1 : 0);
    for (let i = 0; i < split; i++) {
      tongue(
        x2,
        y2,
        ang + randRange(rng, -spread, spread),
        len * randRange(rng, 0.62, 0.82),
        Math.max(0.8, width * 0.7),
        depth + 1,
        t - 0.08,
      );
    }
  }

  for (let i = 0; i < tongues; i++) {
    const t = tongues === 1 ? 0.5 : i / (tongues - 1);
    const x = w * (0.38 + t * 0.24);
    tongue(
      x,
      h * 0.9,
      -Math.PI / 2 + randRange(rng, -0.2, 0.2),
      Math.min(w, h) * 0.11 * s.length,
      10 * s.length,
      0,
      s.growth,
    );
  }
  ctx.globalCompositeOperation = "source-over";
}

export function drawDelta(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const splay = (s.angle * Math.PI) / 180;
  const maxD = Math.max(3, Math.round(s.depth) + extra(s));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  function channel(
    x: number,
    y: number,
    ang: number,
    len: number,
    width: number,
    depth: number,
    t: number,
  ) {
    if (depth > maxD || t <= 0 || len < 5) return;
    const drift = sway(s.wind, s.time, depth + x * 0.01) * 0.5;
    const x2 = x + Math.cos(ang + drift) * len;
    const y2 = y + Math.sin(ang + drift) * len;
    ctx.strokeStyle = css(
      wash(s.palette, mix(s.palette.leafA, s.palette.celestialColor, depth / maxD)),
      0.55 + t * 0.4,
    );
    ctx.lineWidth = Math.max(1.1, width);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo((x + x2) / 2 + Math.sin(ang) * 6, (y + y2) / 2, x2, y2);
    ctx.stroke();
    const forks = 2 + (rng() < 0.28 ? 1 : 0);
    for (let i = 0; i < forks; i++) {
      const u = forks === 1 ? 0 : i / (forks - 1);
      channel(
        x2,
        y2,
        ang - splay + u * 2 * splay + randRange(rng, -0.12, 0.12),
        len * randRange(rng, 0.62, 0.82),
        Math.max(1.1, width * 0.68),
        depth + 1,
        t - 0.09,
      );
    }
  }

  channel(
    w * (0.42 + rng() * 0.16),
    h * 0.16,
    Math.PI / 2 + randRange(rng, -0.12, 0.12),
    Math.min(w, h) * 0.12 * s.length,
    11 * s.length,
    0,
    s.growth,
  );
}

function hexagon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rot: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = rot + (i * Math.PI) / 3;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function drawCrystal(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const facets = Math.max(4, Math.round(s.angle));
  const order = Math.max(2, Math.round(s.depth) + extra(s));
  const ox = w * 0.5;
  const oy = h * 0.82;

  function cluster(x: number, y: number, r: number, rot: number, depth: number, t: number) {
    if (depth > order || t <= 0 || r < 4) return;
    const fill = wash(
      s.palette,
      mix(s.palette.celestialColor, s.palette.leafA, depth / (order + 1)),
    );
    ctx.fillStyle = css(fill, 0.18 + t * 0.28);
    ctx.strokeStyle = css(ink(s.palette), 0.55 + t * 0.35);
    ctx.lineWidth = Math.max(0.6, 2.2 - depth * 0.25);
    hexagon(ctx, x, y, r, rot);
    ctx.fill();
    ctx.stroke();
    const n = depth === 0 ? facets : 2 + (rng() < 0.5 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2 + randRange(rng, -0.15, 0.15);
      cluster(
        x + Math.cos(a) * r * 0.95,
        y + Math.sin(a) * r * 0.72 - r * 0.15,
        r * randRange(rng, 0.42, 0.58),
        a,
        depth + 1,
        t - 0.1,
      );
    }
  }

  cluster(ox, oy, Math.min(w, h) * 0.11 * s.length, rng() * 0.4, 0, s.growth);
}

export function drawShell(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: DrawState,
) {
  const rng = mulberry32(s.seed >>> 0);
  const b = Math.max(0.12, s.angle);
  const chambers = Math.max(8, Math.round(s.depth) + extra(s) * 2);
  const shown = Math.max(3, Math.floor(chambers * Math.max(0.15, s.growth)));
  const ox = w * 0.5;
  const oy = h * 0.6;
  const a0 = Math.min(w, h) * 0.007 * s.length;
  const spin = rng() * 0.6 + sway(s.wind, s.time, 0.3) * 0.12;
  const pts: Array<{ x: number; y: number; r: number; th: number }> = [];
  for (let i = 0; i <= shown; i++) {
    const th = spin + i * 0.38;
    const r = a0 * Math.exp(b * i * 1.15);
    pts.push({
      x: ox + Math.cos(th) * r,
      y: oy + Math.sin(th) * r * 0.9,
      r,
      th,
    });
  }

  const nacre = wash(s.palette, mix(s.palette.blossom, s.palette.leafB, 0.35));
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    ctx.lineTo(ox + Math.cos(p.th) * p.r * 0.18, oy + Math.sin(p.th) * p.r * 0.16);
  }
  ctx.closePath();
  ctx.fillStyle = css(nacre, 0.42);
  ctx.fill();
  ctx.strokeStyle = css(ink(s.palette), 0.9);
  ctx.lineWidth = 1.8 * s.length;
  ctx.stroke();

  ctx.strokeStyle = css(ink(s.palette), 0.4);
  ctx.lineWidth = 0.9;
  for (let i = 2; i < pts.length; i += 1) {
    const p = pts[i];
    ctx.beginPath();
    ctx.moveTo(ox + Math.cos(p.th) * p.r * 0.2, oy + Math.sin(p.th) * p.r * 0.18);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
}
