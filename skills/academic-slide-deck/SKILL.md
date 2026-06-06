---
name: academic-slide-deck
description: Create and refine polished light academic/technical presentation decks with fixed HTML/CSS/SVG slides, KaTeX math, reusable diagram components, semantic color, rendered screenshots, contact sheets, and visual QA. Use when Codex is asked to build, reproduce, improve, audit, or package slides for research talks, ML/RL/LLM explanations, formula-heavy diagrams, token/model/embedding flows, algorithm walkthroughs, or any deck where final visual layout matters.
---

# Academic Slide Deck

## Workflow

Use fixed HTML/CSS/SVG as the source format unless the user explicitly asks for
LaTeX, PPTX, or another format. Prefer `1600x900` or `1920x1080`, one slide per
fixed 16:9 viewport.

1. Clarify the deck goal only if the topic, audience, or output format is
   genuinely missing.
2. Build the deck as real renderable files, not as imagined source.
3. Use KaTeX for formulas and math labels. Keep formula source as TeX strings.
4. Build repeated diagrams from semantic data specs and reusable components.
5. Render every slide, export PNGs, generate a contact sheet, and inspect the
   rendered output before reporting completion.
6. Iterate on concrete visual failures: overflow, clipping, overlap, empty
   containers, awkward arrows, wrong color emphasis, and bad formula placement.

Read `references/visual-system.md` before choosing colors, typography, or
container style. Read `references/layout-components.md` before building diagrams
with arrows, formulas, tokens, multi-row structures, or panels. Read
`references/qa-checks.md` before final delivery or when a screenshot reveals a
layout bug.

## Output Contract

For a substantial deck, deliver:

- source files, normally `index.html`, `styles.css`, and one script file
- exported slide PNGs
- a contact sheet PNG or HTML
- a short note on what was visually checked

Do not claim the deck is visually finished without rendered output. If visual
checking could not run, say exactly why.

## Rendering Script

Use `scripts/render-deck.mjs` when the deck is a fixed HTML slide deck:

```bash
node path/to/academic-slide-deck/scripts/render-deck.mjs \
  slides/my-deck/index.html \
  --out slides/my-deck/export \
  --slides ".slide" \
  --width 1600 \
  --height 900 \
  --ready "body.math-ready"
```

The script exports `slide-01.png`, `contact-sheet.html`, optional
`contact-sheet.png`, and `render-report.json`. It also checks common issues such
as slide overflow, row-label/arrow collisions, and formula-title overlap.

If Playwright or Sharp cannot be imported, install them in the project or use a
runtime that already provides them. Sharp is optional; without it, the script
still writes screenshots and an HTML contact sheet.

When the user asks Codex to build or render slides, configure the active
workspace yourself: install missing Node dependencies when the environment
allows it, then run the renderer. Ask the user to run setup only when package
installation or browser access is blocked by the environment.

## Implementation Rules

- Keep the first screen as the actual slide, not a landing page.
- Use flat light surfaces. Avoid gradients unless the user explicitly asks for a
  special emphasis treatment.
- Use semantic color sparingly. Default ordinary symbols, role labels, page
  numbers, and simple headings to the main blue accent.
- Avoid wrapping simple text notes, page numbers, legends, or role labels in
  large cards or pills.
- Size containers to content density. A short list should not sit inside a huge
  empty panel.
- Use KaTeX for variables, subscripts, superscripts, sums, aligned formulas, and
  inline math labels.
- Let components compute layout after fonts and KaTeX render. Do not hand-place
  every arrow or formula by eye.
- Treat visual bugs as component-rule bugs when they could recur.

## Common Failure Response

When a user points at a visual defect, answer with the cause and then update the
generation rule, component, or QA check so the failure is less likely to recur.
Examples:

- labels blocked by arrows -> split label and connector lanes
- many arrows pointing to one target -> fan-in connector with one arrowhead
- formula close to panel bottom -> measure visible KaTeX descendants and center
  inside a safe region
- sparse panel -> shrink the container or switch to unframed typography
