# Visual QA Checks

Use this before final delivery and whenever a user points to a visual defect.

## Required Pass

For every substantial deck:

1. Render every slide as PNG.
2. Create a contact sheet.
3. Inspect the contact sheet at slide scale and at thumbnail scale.
4. Fix visible problems before reporting completion.

Common problems:

- slide overflow or clipped elements
- text too large for its container
- formula title overlapping visible math
- formula too close to panel bottom
- arrows crossing labels
- multiple arrowheads stacked at one target
- reversed arrows caused by fixed padding
- huge empty panels around short content
- unnecessary cards, pills, and nested wrappers
- default blue boxes around ordinary formulas
- arbitrary color use that does not encode meaning

Run a wrapper audit after the first render:

- remove boxes around page numbers, role labels, legends, and short notes
- collapse chip-inside-card structures into one semantic object
- replace sparse panels with unframed headings, aligned labels, or direct arrows
- keep only boundaries that encode membership, state, object identity, or formula
  safe space

Run a formula-box audit:

- remove blue rounded backgrounds from ordinary formulas
- keep formula titles as small colored text, not title badges inside boxes
- use whitespace, baseline alignment, and hairlines before formula panels
- keep pale formula backgrounds only for true derivation groups, tall operators
  needing safe space, or deliberate emphasis

For imagegen-backed slides, run an asset audit:

- no baked-in formulas, variable names, or important labels
- no hallucinated text, pseudo-letters, or unreadable legends
- generated broad arrows or module captions, if present, match the intended
  stage and visual style
- generated image stays subordinate to the formula/explanation layer
- side token/input/output streams, if present, match the NicePre token style;
  reject glossy cubes, bead strings, 3D blocks, or mismatched side sequences
- formulas are readable in separate KaTeX areas near the image, preferably
  unframed
- avoid hand-overlaid decorative labels and arrows on top of the bitmap; generate
  them as part of the image or use a code-native SVG diagram for exact geometry
- crop and aspect ratio do not hide the generated subject

For progressive imagegen sequences:

- adjacent stages preserve palette, camera, shape language, and spacing
- each stage adds only the intended visual element
- no unwanted extra labels, fake text, or diagram clutter appear
- formula meaning remains outside the bitmap in KaTeX

## Automatic Checks

Use `scripts/render-deck.mjs` for a first pass. It writes:

- slide PNGs
- `contact-sheet.html`
- optional `contact-sheet.png`
- `render-report.json`

Treat any nonzero issue count as a reason to inspect the rendered output.
Automated checks are not a substitute for looking at screenshots.

## Formula QA

Formula layout should be checked after KaTeX and fonts are ready.

- sums, products, integrals, limits, and fractions use display style when shown
  as standalone formulas
- standalone big-operator bounds are in the correct limit position; for example
  the lower bound of a displayed `\sum` sits under the sigma, not at its lower
  right
- measure visible KaTeX descendants
- include formula captions and term labels
- check overlap between formula title and actual visible math
- check bottom safe padding for display sums, fractions, and aligned formulas
- avoid treating KaTeX internal glyphs or generated SVG paths as independent
  slide-overflow elements; check the rendered formula wrapper and visible math
  union instead

Overflow-free does not mean visually correct.

## Connector QA

For connector-heavy slides:

- sample SVG paths and verify they do not enter row-label bounding boxes
- count arrowheads near shared targets; many-to-one targets should normally have
  one arrowhead
- verify arrows target payload anchors, not broad rows
- confirm row labels are non-connectable

When a failure appears, update the component rule, not just the one slide.
