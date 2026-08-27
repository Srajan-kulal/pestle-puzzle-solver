import { CATEGORIES, type Analysis } from "@/lib/pestle";

/** Print-only report view — hidden on screen, shown by the print stylesheet. */
export function ReportView({ analysis }: { analysis: Analysis }) {
  const total = CATEGORIES.reduce(
    (n, c) => n + analysis.factors[c.key].length,
    0,
  );
  const highs = CATEGORIES.flatMap((c) =>
    analysis.factors[c.key]
      .filter((f) => f.impact === "high")
      .map((f) => ({ ...f, category: c.name })),
  );

  return (
    <div className="pestle-report hidden print:block">
      <h1>PESTLE Analysis: {analysis.title || "Untitled"}</h1>
      {analysis.description && <p className="lead">{analysis.description}</p>}
      {(analysis.industry || analysis.region || analysis.timeframe) && (
        <p className="meta">
          {[
            analysis.industry && `Industry: ${analysis.industry}`,
            analysis.region && `Region: ${analysis.region}`,
            analysis.timeframe && `Timeframe: ${analysis.timeframe}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
      <p className="meta">
        Generated {new Date().toLocaleDateString()} · {total} factors
      </p>

      {CATEGORIES.map((c) => (
        <section key={c.key}>
          <h2>
            {c.letter} — {c.name}
          </h2>
          {analysis.factors[c.key].length === 0 ? (
            <p className="empty">No factors recorded.</p>
          ) : (
            <ul>
              {analysis.factors[c.key].map((f) => (
                <li key={f.id}>
                  {f.text}{" "}
                  <span className="tag">
                    [{f.impact} impact · {f.kind}]
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section>
        <h2>Summary</h2>
        <p>
          {total} factors across 6 categories; {highs.length} rated high
          impact.
        </p>
        {highs.length > 0 && (
          <>
            <h3>High-impact factors</h3>
            <ul>
              {highs.map((f) => (
                <li key={f.id}>
                  <strong>{f.category}:</strong> {f.text}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {analysis.insights.trim() && (
        <section>
          <h2>Key insights & scoping notes</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{analysis.insights.trim()}</p>
        </section>
      )}
    </div>
  );
}
