import { CATEGORIES, type Analysis } from "@/lib/pestle";

export function SummaryPanel({
  analysis,
  onInsightsChange,
}: {
  analysis: Analysis;
  onInsightsChange: (v: string) => void;
}) {
  const total = CATEGORIES.reduce(
    (n, c) => n + analysis.factors[c.key].length,
    0,
  );
  const highs = CATEGORIES.flatMap((c) =>
    analysis.factors[c.key]
      .filter((f) => f.impact === "high")
      .map((f) => ({ ...f, category: c.name })),
  );
  const opportunities = CATEGORIES.flatMap((c) =>
    analysis.factors[c.key]
      .filter((f) => f.kind === "opportunity")
      .map((f) => ({ ...f, category: c.name })),
  );
  const threats = CATEGORIES.flatMap((c) =>
    analysis.factors[c.key]
      .filter((f) => f.kind === "threat")
      .map((f) => ({ ...f, category: c.name })),
  );

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-display text-2xl font-semibold text-card-foreground">
        Summary & recommendations
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total factors", value: total },
          { label: "High impact", value: highs.length },
          { label: "Opportunities", value: opportunities.length },
          { label: "Threats", value: threats.length },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-muted px-4 py-3 text-center"
          >
            <div className="font-display text-2xl font-semibold text-foreground">
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <div
            key={c.key}
            className="rounded-lg border border-border px-3 py-2 text-center"
          >
            <div className="text-sm font-semibold text-foreground">
              {analysis.factors[c.key].length}
            </div>
            <div className="text-xs text-muted-foreground">{c.name}</div>
          </div>
        ))}
      </div>

      {highs.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-foreground">
            High-impact factors
          </h3>
          <ul className="mt-2 space-y-1.5">
            {highs.map((f) => (
              <li
                key={f.id}
                className="flex items-start gap-2 rounded-lg bg-destructive/5 px-3 py-2 text-sm text-foreground"
              >
                <span className="mt-0.5 shrink-0 rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                  {f.category}
                </span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <label
          htmlFor="insights"
          className="text-sm font-semibold text-foreground"
        >
          Key insights & scoping notes
        </label>
        <textarea
          id="insights"
          value={analysis.insights}
          onChange={(e) => onInsightsChange(e.target.value)}
          rows={5}
          placeholder="Distill what this analysis tells you: which forces matter most, what scope a solution should have, what to tackle first…"
          className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus:border-ring"
        />
      </div>
    </section>
  );
}
