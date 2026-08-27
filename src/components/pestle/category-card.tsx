import { useState } from "react";
import type { Category, Factor } from "@/lib/pestle";

interface Props {
  category: Category;
  factors: Factor[];
  onAdd: (text: string) => void;
  onUpdate: (id: string, patch: Partial<Factor>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

const accentClass: Record<string, string> = {
  political: "bg-pestle-political",
  economic: "bg-pestle-economic",
  social: "bg-pestle-social",
  technological: "bg-pestle-technological",
  legal: "bg-pestle-legal",
  environmental: "bg-pestle-environmental",
};

const impactStyles: Record<Factor["impact"], string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-secondary text-secondary-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

export function CategoryCard({
  category,
  factors,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
}: Props) {
  const [draft, setDraft] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft("");
  };

  return (
    <section className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-lg font-semibold text-white ${accentClass[category.key]}`}
        >
          {category.letter}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight text-card-foreground">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground">{category.tagline}</p>
        </div>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {factors.length}
        </span>
      </header>

      <div className="px-5 pt-3">
        <button
          type="button"
          onClick={() => setShowPrompts((v) => !v)}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {showPrompts ? "Hide guiding questions" : "Need ideas? Show guiding questions"}
        </button>
        {showPrompts && (
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
            {category.prompts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      <ul className="flex-1 space-y-2 px-5 py-4">
        {factors.length === 0 && (
          <li className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No factors yet — add your first below.
          </li>
        )}
        {factors.map((f, i) => (
          <li
            key={f.id}
            className="group rounded-lg border border-border bg-background p-3"
          >
            <textarea
              value={f.text}
              onChange={(e) => onUpdate(f.id, { text: e.target.value })}
              rows={2}
              className="w-full resize-none bg-transparent text-sm leading-snug text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Describe the factor…"
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <select
                value={f.impact}
                onChange={(e) =>
                  onUpdate(f.id, { impact: e.target.value as Factor["impact"] })
                }
                className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${impactStyles[f.impact]}`}
                aria-label="Impact"
              >
                <option value="high">High impact</option>
                <option value="medium">Medium impact</option>
                <option value="low">Low impact</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  onUpdate(f.id, {
                    kind: f.kind === "threat" ? "opportunity" : "threat",
                  })
                }
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                  f.kind === "opportunity"
                    ? "border-pestle-economic/40 bg-pestle-economic/10 text-pestle-economic"
                    : "border-pestle-political/40 bg-pestle-political/10 text-pestle-political"
                }`}
                title="Toggle opportunity / threat"
              >
                {f.kind === "opportunity" ? "Opportunity" : "Threat"}
              </button>
              <span className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onMove(f.id, -1)}
                  disabled={i === 0}
                  className="rounded px-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMove(f.id, 1)}
                  disabled={i === factors.length - 1}
                  className="rounded px-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(f.id)}
                  className="rounded px-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete factor"
                >
                  ✕
                </button>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <footer className="border-t border-border px-5 py-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={`Add ${/^[aeiou]/i.test(category.name) ? "an" : "a"} ${category.name.toLowerCase()} factor…`}
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim()}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </footer>
    </section>
  );
}
