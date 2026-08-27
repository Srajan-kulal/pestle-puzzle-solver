# PESTLE Analysis Tool

A single-page web tool for running a structured PESTLE analysis on a problem: manual six-category worksheet, on-screen grid, auto-generated summary, and an exportable report. Data persists in the browser (localStorage) — no accounts or backend.

## Features

### Problem setup
- Header section: problem title, description, and context (industry, region, timeframe).
- Multiple saved analyses: list view to create, rename, duplicate, delete, and switch between analyses.

### PESTLE worksheet (on-screen grid)
- Six color-coded category cards: Political, Economic, Social, Technological, Legal, Environmental.
- Each category shows: guiding prompt questions (to help thinking), an add-factor input, and a list of factors.
- Each factor: text, impact rating (High / Medium / Low), and opportunity vs. threat tag; edit inline, delete.
- Factors draggable/reorderable within a category (simple up/down buttons are acceptable).
- Auto-save to localStorage on every change (debounced).

### Summary & recommendations
- Auto-compiled summary panel: counts per category, high-impact factors highlighted, top opportunities and threats.
- A free-text "Key insights & scoping notes" section for your own conclusions.

### Exportable report
- "Export" button generates a clean, print-ready report (problem header, six sections with factors and ratings, summary, insights).
- Export options: print/save-as-PDF via the browser print dialog (dedicated print stylesheet) and copy-as-Markdown to clipboard.

## Design

- Clean, editorial look: warm off-white background, ink text, one accent color per PESTLE category, serif display headings with a sans body.
- Grid layout: 2-column card grid on desktop, single column on mobile.
- All colors via semantic tokens in src/styles.css; dark mode supported.

## Technical details

- Replace the placeholder `src/routes/index.tsx` with the tool at `/` (single route is enough; list/switcher lives in the page).
- New files: `src/lib/pestle.ts` (types, categories, seed prompt questions), `src/hooks/use-pestle-store.ts` (localStorage-backed state), `src/components/pestle/*` (grid, category card, factor item, summary, report view).
- Report rendering: a printable component + `window.print()` stylesheet; Markdown export built with a small template function and `navigator.clipboard`.
- Update head metadata: unique title/description for the tool; fix the "Lovable App" placeholder meta in `__root.tsx`.
- No Lovable Cloud, no AI gateway calls, no new dependencies beyond what's installed.
