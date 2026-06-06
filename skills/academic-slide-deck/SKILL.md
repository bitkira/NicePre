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
`references/imagegen-prompts.md` before generating bitmap illustration assets.
Read
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

Do not require the user to download this skill repository's `node_modules`.
Treat the skill repository as instructions, examples, and helper scripts. Runtime
dependencies belong in the current target workspace that is being rendered, or
in an available shared runtime.

## Implementation Rules

- Keep the first screen as the actual slide, not a landing page.
- Use flat light surfaces. Avoid gradients unless the user explicitly asks for a
  special emphasis treatment.
- Use semantic color sparingly. Default ordinary symbols, role labels, page
  numbers, and simple headings to the main blue accent.
- Start unframed. Use whitespace, alignment, colored text, math baselines, and
  arrows before adding cards, panels, or pills.
- Add a wrapper only when it carries semantic meaning: an object boundary, a
  true grouped region, a formula safe area, or an interactive/movable visual
  unit. If removing the border/fill does not change the reader's understanding,
  remove the wrapper.
- Avoid wrapping simple text notes, page numbers, legends, role labels, and
  short explanations in cards or pills. Prefer unframed typography.
- Do not nest wrappers by default. A colored symbol chip inside a neutral card
  is usually worse than one semantic block containing the symbol and label.
- Size containers to content density. A short list should not sit inside a huge
  empty panel.
- Use KaTeX for variables, subscripts, superscripts, sums, aligned formulas, and
  inline math labels.
- Display formulas containing `\sum`, `\prod`, `\int`, `\frac`, limits, or
  other tall operators with KaTeX display style. Do not leave these as cramped
  inline math; use `\displaystyle` or `displayMode: true` and then measure the
  rendered result.
- When a standalone big operator has bounds that belong above or below the
  symbol, force limits explicitly, for example `\sum\limits_i` or
  `\sum\limits_{i \in S(x)}`. A large `\sum_i` with the index at the lower
  right is still wrong for this style.
- Do not put formulas in blue boxes by default. Prefer unframed formula groups:
  a small colored title, strong KaTeX math, baseline alignment, and whitespace or
  a hairline divider. Use a pale formula background only when it is truly a
  formula safe area, a multi-step derivation group, or a deliberate emphasis.
- For visually complex structures such as full transformer blocks, model
  internals, hardware-like systems, or conceptual machinery, consider a hybrid
  raster path: generate a complete style-native illustration with imagegen, then
  place beautiful formulas nearby with KaTeX. For progressive visual sequences,
  generate each stage from the previous image as a reference so additions such
  as embeddings, transformer blocks, linear heads, broad arrows, and simple
  module labels share one visual style. Do not hand-overlay these visual
  callouts with HTML/SVG unless the user asks for an exact code-native diagram.
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
- wrapper abuse -> remove non-semantic panels/chips and re-express hierarchy
  with spacing, text color, alignment, and direct labels
- formula box abuse -> remove default blue formula backgrounds; use unframed
  KaTeX groups unless a true safe area or derivation group is needed
