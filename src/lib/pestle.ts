export type Impact = "high" | "medium" | "low";
export type FactorKind = "opportunity" | "threat";

export interface Factor {
  id: string;
  text: string;
  impact: Impact;
  kind: FactorKind;
}

export type CategoryKey =
  | "political"
  | "economic"
  | "social"
  | "technological"
  | "legal"
  | "environmental";

export interface Category {
  key: CategoryKey;
  letter: string;
  name: string;
  tagline: string;
  prompts: string[];
}

export interface Analysis {
  id: string;
  title: string;
  description: string;
  industry: string;
  region: string;
  timeframe: string;
  insights: string;
  factors: Record<CategoryKey, Factor[]>;
  createdAt: number;
  updatedAt: number;
}

export const CATEGORIES: Category[] = [
  {
    key: "political",
    letter: "P",
    name: "Political",
    tagline: "Government, policy & stability",
    prompts: [
      "Which government policies or regulations shape this problem?",
      "Are there upcoming elections or policy shifts that matter?",
      "How stable is the political environment in the affected regions?",
      "Are there trade, tax, or funding programs at play?",
    ],
  },
  {
    key: "economic",
    letter: "E",
    name: "Economic",
    tagline: "Markets, costs & growth",
    prompts: [
      "How do inflation, interest rates, or growth affect this problem?",
      "What budget or funding constraints exist?",
      "How does the labor market or wage level factor in?",
      "What is the economic cost of not solving this?",
    ],
  },
  {
    key: "social",
    letter: "S",
    name: "Social",
    tagline: "People, culture & demographics",
    prompts: [
      "Which demographic or population trends are relevant?",
      "What cultural attitudes or behaviors drive this problem?",
      "Who are the stakeholders and what do they care about?",
      "Are there education, health, or lifestyle shifts underway?",
    ],
  },
  {
    key: "technological",
    letter: "T",
    name: "Technological",
    tagline: "Innovation, tools & infrastructure",
    prompts: [
      "Which emerging technologies could change this space?",
      "What infrastructure or tooling gaps exist today?",
      "How fast is the relevant technology evolving?",
      "Are there automation or digitization opportunities?",
    ],
  },
  {
    key: "legal",
    letter: "L",
    name: "Legal",
    tagline: "Laws, compliance & liability",
    prompts: [
      "Which laws or regulations constrain a solution?",
      "Are there compliance, licensing, or standards requirements?",
      "What liability or IP considerations exist?",
      "Are any legal changes on the horizon?",
    ],
  },
  {
    key: "environmental",
    letter: "E",
    name: "Environmental",
    tagline: "Sustainability & the physical world",
    prompts: [
      "How does climate or weather affect this problem?",
      "Are there sustainability requirements or expectations?",
      "What geographic or physical constraints exist?",
      "What is the environmental footprint of solving (or not solving) this?",
    ],
  },
];

export const emptyFactors = (): Record<CategoryKey, Factor[]> => ({
  political: [],
  economic: [],
  social: [],
  technological: [],
  legal: [],
  environmental: [],
});

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export function createAnalysis(title = "Untitled analysis"): Analysis {
  const now = Date.now();
  return {
    id: uid(),
    title,
    description: "",
    industry: "",
    region: "",
    timeframe: "",
    insights: "",
    factors: emptyFactors(),
    createdAt: now,
    updatedAt: now,
  };
}

export function buildMarkdown(a: Analysis): string {
  const lines: string[] = [];
  lines.push(`# PESTLE Analysis: ${a.title || "Untitled"}`);
  lines.push("");
  if (a.description) {
    lines.push(a.description);
    lines.push("");
  }
  const ctx = [
    a.industry && `**Industry:** ${a.industry}`,
    a.region && `**Region:** ${a.region}`,
    a.timeframe && `**Timeframe:** ${a.timeframe}`,
  ].filter(Boolean);
  if (ctx.length) {
    lines.push(ctx.join(" · "));
    lines.push("");
  }
  for (const c of CATEGORIES) {
    lines.push(`## ${c.name}`);
    const fs = a.factors[c.key];
    if (!fs.length) {
      lines.push("_No factors recorded._");
    } else {
      for (const f of fs) {
        lines.push(
          `- ${f.text} — _${f.impact} impact, ${f.kind}_`,
        );
      }
    }
    lines.push("");
  }
  const highs = CATEGORIES.flatMap((c) =>
    a.factors[c.key]
      .filter((f) => f.impact === "high")
      .map((f) => ({ ...f, category: c.name })),
  );
  lines.push("## Summary");
  lines.push(
    `- **${CATEGORIES.reduce((n, c) => n + a.factors[c.key].length, 0)}** factors across 6 categories`,
  );
  lines.push(`- **${highs.length}** high-impact factors`);
  if (highs.length) {
    lines.push("");
    lines.push("### High-impact factors");
    for (const h of highs) lines.push(`- **${h.category}:** ${h.text}`);
  }
  if (a.insights.trim()) {
    lines.push("");
    lines.push("## Key insights & scoping notes");
    lines.push(a.insights.trim());
  }
  return lines.join("\n");
}
