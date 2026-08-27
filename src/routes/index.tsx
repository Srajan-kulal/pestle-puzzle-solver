import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, buildMarkdown } from "@/lib/pestle";
import { usePestleStore } from "@/hooks/use-pestle-store";
import { CategoryCard } from "@/components/pestle/category-card";
import { SummaryPanel } from "@/components/pestle/summary-panel";
import { ReportView } from "@/components/pestle/report";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PESTLE Analysis Tool — Scope any problem" },
      {
        name: "description",
        content:
          "A structured PESTLE worksheet: capture Political, Economic, Social, Technological, Legal and Environmental factors, rate their impact, and export a print-ready report.",
      },
      { property: "og:title", content: "PESTLE Analysis Tool — Scope any problem" },
      {
        property: "og:description",
        content:
          "Map the six macro forces around your problem, rate their impact, and export a report.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { ready, analyses, active, actions } = usePestleStore();
  const [copied, setCopied] = useState(false);

  if (!ready || !active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown(active));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Clipboard access was blocked by the browser.");
    }
  };

  return (
    <>
      <div className="pestle-screen min-h-screen bg-background">
        {/* Top bar */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
                P6
              </span>
              <span className="font-display text-lg font-semibold text-foreground">
                PESTLE Analysis Tool
              </span>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select
                value={active.id}
                onChange={(e) => actions.selectAnalysis(e.target.value)}
                className="max-w-48 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none"
                aria-label="Select analysis"
              >
                {analyses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title || "Untitled analysis"}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={actions.createAnalysis}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
              >
                New
              </button>
              <button
                type="button"
                onClick={() => actions.duplicateAnalysis(active.id)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
              >
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this analysis? This cannot be undone."))
                    actions.deleteAnalysis(active.id);
                }}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={copyMarkdown}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
              >
                {copied ? "Copied!" : "Copy Markdown"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Export report
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Problem definition */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-card-foreground">
              The problem
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Define what you're analyzing before mapping the forces around it.
            </p>
            <input
              value={active.title}
              onChange={(e) => actions.updateMeta({ title: e.target.value })}
              placeholder="Problem title, e.g. “High customer churn in our SaaS product”"
              className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 font-display text-lg font-medium outline-none placeholder:text-muted-foreground focus:border-ring"
            />
            <textarea
              value={active.description}
              onChange={(e) =>
                actions.updateMeta({ description: e.target.value })
              }
              rows={2}
              placeholder="Brief description of the problem and why it matters…"
              className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <input
                value={active.industry}
                onChange={(e) => actions.updateMeta({ industry: e.target.value })}
                placeholder="Industry / sector"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <input
                value={active.region}
                onChange={(e) => actions.updateMeta({ region: e.target.value })}
                placeholder="Region / market"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <input
                value={active.timeframe}
                onChange={(e) =>
                  actions.updateMeta({ timeframe: e.target.value })
                }
                placeholder="Timeframe, e.g. 2026–2028"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
          </section>

          {/* PESTLE grid */}
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
            {CATEGORIES.map((c) => (
              <CategoryCard
                key={c.key}
                category={c}
                factors={active.factors[c.key]}
                onAdd={(text) => actions.addFactor(c.key, text)}
                onUpdate={(id, patch) => actions.updateFactor(c.key, id, patch)}
                onRemove={(id) => actions.removeFactor(c.key, id)}
                onMove={(id, dir) => actions.moveFactor(c.key, id, dir)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6">
            <SummaryPanel
              analysis={active}
              onInsightsChange={(v) => actions.updateMeta({ insights: v })}
            />
          </div>

          <footer className="mt-10 pb-6 text-center text-xs text-muted-foreground">
            Analyses are saved automatically in your browser — nothing leaves
            this device.
          </footer>
        </main>
      </div>

      <ReportView analysis={active} />
    </>
  );
}
