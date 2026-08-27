import { Flower2, GitBranch, Leaf, Trees } from "lucide-react";
import { handleGrovePointer } from "@/lib/grove-actions";
import {
  CONDITIONS,
  FRACTAL_KINDS,
  describeConditions,
  getKind,
} from "@/lib/tree/kinds";
import { PALETTES } from "@/lib/tree/palettes";
import { css } from "@/lib/tree/color";
import type { OverlayMode } from "@/lib/tree/types";
import { cn } from "@/lib/utils";
import { useGroveStore } from "@/store/grove";

const OVERLAYS: { id: OverlayMode; label: string; icon: typeof Leaf }[] = [
  { id: "bare", label: "Bare", icon: GitBranch },
  { id: "leaves", label: "Leaves", icon: Leaf },
  { id: "blossoms", label: "Blossoms", icon: Flower2 },
  { id: "both", label: "Both", icon: Trees },
];

function RangeRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted">
          {label}
        </span>
        <span className="text-xs tracking-wide text-fg">{display}</span>
      </span>
      <input
        type="range"
        className="grove-range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onInput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function ControlPanel() {
  const kind = useGroveStore((s) => s.kind);
  const angle = useGroveStore((s) => s.angle);
  const depth = useGroveStore((s) => s.depth);
  const length = useGroveStore((s) => s.length);
  const wind = useGroveStore((s) => s.wind);
  const overlay = useGroveStore((s) => s.overlay);
  const paletteId = useGroveStore((s) => s.paletteId);
  const setAngle = useGroveStore((s) => s.setAngle);
  const setDepth = useGroveStore((s) => s.setDepth);
  const setLength = useGroveStore((s) => s.setLength);
  const setWind = useGroveStore((s) => s.setWind);
  const meta = getKind(kind);
  const values = { angle, depth, length, wind };
  const setters = {
    angle: setAngle,
    depth: setDepth,
    length: setLength,
    wind: setWind,
  };

  return (
    <section
      aria-label="Starting conditions"
      className="flex w-full flex-col gap-3 rounded-3xl bg-surface p-3 shadow-[var(--shadow-border)] md:p-4"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-wide text-muted">
          Starting conditions
        </p>
        <p className="font-display italic text-sm leading-snug text-fg">
          {describeConditions(angle, depth, length, wind)}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {CONDITIONS.map((slider) => {
            const raw = values[slider.key];
            const value = Math.min(slider.max, Math.max(slider.min, raw));
            return (
              <RangeRow
                key={slider.key}
                label={slider.label}
                display={slider.format(value)}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={setters[slider.key]}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-wide text-muted">
          What emerges
        </p>
        <div
          role="radiogroup"
          aria-label="What emerges"
          className="grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1 sm:grid-cols-5"
        >
          {FRACTAL_KINDS.map((item) => {
            const active = kind === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={item.name}
                title={item.blurb}
                data-grove-action="kind"
                data-grove-value={item.id}
                onPointerUp={handleGrovePointer}
                onClick={handleGrovePointer}
                className={cn(
                  "flex h-11 items-center justify-center rounded-md px-1 text-xs font-medium tracking-wide",
                  active ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-subtle">
          {meta.blurb} from the same start
        </p>
      </div>

      {meta.foliage ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted">Foliage</p>
          <div
            role="radiogroup"
            aria-label="Foliage overlay"
            className="grid grid-cols-4 gap-1 rounded-lg bg-surface-2 p-1"
          >
            {OVERLAYS.map((item) => {
              const Icon = item.icon;
              const active = overlay === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  data-grove-action="overlay"
                  data-grove-value={item.id}
                  onPointerUp={handleGrovePointer}
                  onClick={handleGrovePointer}
                  className={cn(
                    "flex h-11 flex-col items-center justify-center gap-0.5 rounded-md text-xs font-medium tracking-wide",
                    active ? "bg-fg text-bg" : "text-muted hover:text-fg",
                  )}
                >
                  <Icon className="pointer-events-none size-3.5" strokeWidth={1.75} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-wide text-muted">Palette</p>
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((p) => {
            const active = paletteId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-label={p.name}
                aria-pressed={active}
                title={p.name}
                data-grove-action="palette"
                data-grove-value={p.id}
                onPointerUp={handleGrovePointer}
                onClick={handleGrovePointer}
                className={cn(
                  "flex h-12 flex-col overflow-hidden rounded-md",
                  active
                    ? "ring-2 ring-fg ring-offset-2 ring-offset-surface"
                    : "shadow-[var(--shadow-border)] hover:opacity-90",
                )}
              >
                <span className="pointer-events-none flex min-h-0 flex-1">
                  <span className="flex-1" style={{ background: css(p.skyTop) }} />
                  <span className="flex-1" style={{ background: css(p.bark) }} />
                  <span className="flex-1" style={{ background: css(p.leafA) }} />
                  <span className="flex-1" style={{ background: css(p.blossom) }} />
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-subtle">
          {PALETTES.find((p) => p.id === paletteId)?.name}
        </p>
      </div>
    </section>
  );
}
