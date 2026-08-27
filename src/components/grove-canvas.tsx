import { useEffect, useRef } from "react";
import { css } from "@/lib/tree/color";
import { drawGrove, growthDurationMs } from "@/lib/tree/draw";
import { generateGrove } from "@/lib/tree/generate";
import { emergeParams } from "@/lib/tree/kinds";
import { getPalette } from "@/lib/tree/palettes";
import type { Grove } from "@/lib/tree/types";
import { useGroveStore } from "@/store/grove";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function treeForm(kind: string): "grove" | null {
  return kind === "grove" ? "grove" : null;
}

export function GroveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seed = useGroveStore((s) => s.seed);
  const kind = useGroveStore((s) => s.kind);
  const angle = useGroveStore((s) => s.angle);
  const depth = useGroveStore((s) => s.depth);
  const length = useGroveStore((s) => s.length);
  const wind = useGroveStore((s) => s.wind);
  const overlay = useGroveStore((s) => s.overlay);
  const paletteId = useGroveStore((s) => s.paletteId);
  const generation = useGroveStore((s) => s.generation);
  const expansion = useGroveStore((s) => s.expansion);

  const groveRef = useRef<Grove | null>(null);
  const growthRef = useRef(0);
  const growFromRef = useRef(0);
  const growUntilRef = useRef(0);
  const growStartRef = useRef(0);
  const replayRef = useRef(true);
  const paramsRef = useRef({
    overlay,
    wind,
    paletteId,
    length,
    seed,
    kind,
    angle,
    depth,
    expansion,
  });
  const timeRef = useRef(0);
  const zoomRef = useRef(1);
  const focusRef = useRef({ x: 0.5, y: 0.58 });

  useEffect(() => {
    const form = treeForm(kind);
    if (form) {
      const emerged = emergeParams(kind, angle, depth, length, wind);
      groveRef.current = generateGrove({
        seed,
        angle: emerged.angle,
        depth: emerged.depth,
        expansion,
        form,
      });
    } else {
      groveRef.current = null;
    }
  }, [seed, angle, depth, length, wind, kind, expansion]);

  useEffect(() => {
    paramsRef.current = {
      overlay,
      wind,
      paletteId,
      length,
      seed,
      kind,
      angle,
      depth,
      expansion,
    };
  }, [overlay, wind, paletteId, length, seed, kind, angle, depth, expansion]);

  useEffect(() => {
    replayRef.current = true;
    growStartRef.current = useGroveStore.getState().expandPulse ? 0.5 : 0;
    growthRef.current = growStartRef.current;
    zoomRef.current = 1;
    focusRef.current = { x: 0.5, y: 0.58 };
  }, [generation, seed, kind]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let last = performance.now();
    let reduced = prefersReducedMotion();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduced = media.matches;
    };
    media.addEventListener("change", onMotion);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = Math.max(1, parent.clientWidth);
      const h = Math.max(1, parent.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);
    window.addEventListener("resize", resize);

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      timeRef.current += dt;
      const p = paramsRef.current;

      if (treeForm(p.kind) && !groveRef.current) {
        const emerged = emergeParams(p.kind, p.angle, p.depth, p.length, p.wind);
        groveRef.current = generateGrove({
          seed: p.seed,
          angle: emerged.angle,
          depth: emerged.depth,
          expansion: p.expansion,
          form: treeForm(p.kind) ?? "grove",
        });
      }

      if (replayRef.current) {
        replayRef.current = false;
        const pulse = useGroveStore.getState().expandPulse;
        growFromRef.current = now;
        growUntilRef.current =
          now + growthDurationMs(useGroveStore.getState().depth, reduced, pulse);
        growthRef.current = reduced ? 1 : growStartRef.current;
      }

      const span = Math.max(1, growUntilRef.current - growFromRef.current);
      if (now < growUntilRef.current) {
        const t = (now - growFromRef.current) / span;
        const eased = 1 - (1 - t) ** 3;
        const start = growStartRef.current;
        growthRef.current = start + (1 - start) * eased;
      } else {
        growthRef.current = 1;
      }

      const cssW = Math.max(
        1,
        canvas.parentElement?.clientWidth || canvas.clientWidth || 1,
      );
      const cssH = Math.max(
        1,
        canvas.parentElement?.clientHeight || canvas.clientHeight || 1,
      );
      try {
        const zoom = zoomRef.current;
        const focus = focusRef.current;
        const palette = getPalette(p.paletteId);
        ctx.fillStyle = css(palette.skyBottom);
        ctx.fillRect(0, 0, cssW, cssH);
        ctx.save();
        ctx.translate(cssW * focus.x, cssH * focus.y);
        ctx.scale(zoom, zoom);
        ctx.translate(-cssW * focus.x, -cssH * focus.y);
        drawGrove(
          ctx,
          cssW,
          cssH,
          {
            grove: groveRef.current,
            kind: p.kind,
            palette,
            overlay: p.overlay,
            wind: p.wind,
            time: timeRef.current,
            growth: growthRef.current,
            reducedMotion: reduced,
            length: p.length,
            seed: p.seed,
            angle: p.angle,
            depth: p.depth,
            expansion: p.expansion,
          },
          p.seed,
          p.length,
        );
        ctx.restore();
      } catch {
        // keep the RAF loop alive if a frame fails
      }

      frame = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width);
      const y = (e.clientY - rect.top) / Math.max(1, rect.height);
      const old = zoomRef.current;
      const next = Math.max(0.55, Math.min(3.2, old * (e.deltaY < 0 ? 1.08 : 0.93)));
      const f = focusRef.current;
      f.x = f.x + (x - f.x) * (1 - old / next);
      f.y = f.y + (y - f.y) * (1 - old / next);
      zoomRef.current = next;
    };
    const onDbl = () => {
      zoomRef.current = 1;
      focusRef.current = { x: 0.5, y: 0.58 };
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDbl);

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", onMotion);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDbl);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="grove-canvas"
      aria-hidden="true"
    />
  );
}
