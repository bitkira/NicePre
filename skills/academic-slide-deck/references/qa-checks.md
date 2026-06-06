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
- arbitrary color use that does not encode meaning

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

- measure visible KaTeX descendants
- include formula captions and term labels
- check overlap between formula title and actual visible math
- check bottom safe padding for display sums, fractions, and aligned formulas

Overflow-free does not mean visually correct.

## Connector QA

For connector-heavy slides:

- sample SVG paths and verify they do not enter row-label bounding boxes
- count arrowheads near shared targets; many-to-one targets should normally have
  one arrowhead
- verify arrows target payload anchors, not broad rows
- confirm row labels are non-connectable

When a failure appears, update the component rule, not just the one slide.
