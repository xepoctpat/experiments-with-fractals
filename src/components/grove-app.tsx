import { Expand, Shuffle } from "lucide-react";
import { ControlPanel } from "@/components/control-panel";
import { GroveCanvas } from "@/components/grove-canvas";
import { Button } from "@/components/ui/button";
import { handleGrovePointer } from "@/lib/grove-actions";
import { getKind, growthCap } from "@/lib/tree/kinds";
import { useGroveStore } from "@/store/grove";

export function GroveApp() {
  const seed = useGroveStore((s) => s.seed);
  const kind = useGroveStore((s) => s.kind);
  const expansion = useGroveStore((s) => s.expansion);
  const depth = useGroveStore((s) => s.depth);
  const length = useGroveStore((s) => s.length);
  const meta = getKind(kind);
  const cap = growthCap(kind, depth, length);

  return (
    <main className="grove-shell bg-bg text-fg">
      <header className="grove-chrome flex flex-col gap-3 p-3 md:flex-row md:items-start md:justify-between md:p-4">
        <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="font-display italic text-2xl leading-none tracking-tight text-fg md:text-3xl">
            Sylva
          </p>
          <p className="mt-2 text-xs tracking-wide text-muted">
            {meta.name}
            <span className="font-mono tabular-nums text-subtle">
              {" "}
              · № {seed}
              {expansion > 0 ? ` · grown ${expansion}/${cap}` : ""}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full md:w-auto"
            data-grove-action="grow"
            aria-label="Expand further"
            title={
              expansion >= cap
                ? "Fully grown from this start"
                : "Let it put out more"
            }
            onPointerUp={handleGrovePointer}
            onClick={handleGrovePointer}
          >
            <Expand />
            Grow
          </Button>
          <Button
            type="button"
            variant="default"
            className="min-h-11 w-full md:w-auto"
            data-grove-action="regen"
            aria-label="New specimen"
            title="Same start, different life"
            onPointerUp={handleGrovePointer}
            onClick={handleGrovePointer}
          >
            <Shuffle />
            New
          </Button>
        </div>
      </header>

      <section className="grove-stage" aria-hidden="true">
        <GroveCanvas />
      </section>

      <div className="grove-chrome grove-panel p-3 pb-16 md:p-4 md:pb-5">
        <div className="mx-auto w-full md:mx-0 md:max-w-96">
          <ControlPanel />
        </div>
      </div>
    </main>
  );
}
