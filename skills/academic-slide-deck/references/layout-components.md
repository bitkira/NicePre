# Layout And Components

Use this reference before building technical diagrams, formula panels, arrows,
or repeated structures.

## Authoring

Use semantic data specs for repeated structures. Generate DOM/SVG from the data
instead of writing one-off coordinates for each row, token, block, or arrow.

Good specs define:

- node id
- semantic role
- visible label or TeX
- state, such as `ghost`, `base`, `selected`, or `active`
- allowed connector anchors

## Math

Use KaTeX by default. Render after the DOM is created, wait for fonts, then
measure visible math before final layout.

For display-style, aligned, or multi-line formulas:

- measure the union of visible `.katex` descendants, not just the top wrapper
- include attached term labels and formula captions in the measured group
- position the formula body inside a safe vertical region
- avoid title badges by measuring title and math overlap, not just overflow

Use manual `sub` / `sup` only for tiny non-math labels.

## Arrows

Derive arrows from rendered element bounding boxes after KaTeX and fonts are
ready.

Rules:

- connectors target specific anchors such as `completion-text`, `score`,
  `token-3`, or `layer-2`, not broad wrapper rows
- arrow padding is proportional to actual source/target gap
- labels such as `o_i`, token ids, or step ids are non-connectable labels
- row labels live in a label lane; arrows live in a connector lane
- many-to-one connectors use fan-in: branches merge into a collector lane, then
  one main arrowhead points to the target
- never stack multiple arrowheads at one destination

Treat arrow bugs as component bugs. If a connector overlaps a label or produces
reversed arrows, change the generator or validation rule.

## Flow Nodes

Avoid a neutral card wrapped around a colored symbol chip when one semantic
block is enough. Prefer:

- one filled block
- one KaTeX symbol
- one short label

Use semantic fills only when the fill identifies the object in the diagram.
Ordinary text labels can use the main blue accent.

## Token And Embedding Blocks

Keep one hue per stream. Express state through tint depth, border weight, or one
active block:

- `ghost`: placeholder or inactive
- `base`: normal
- `selected`: deeper fill or stronger border
- `active`: strongest fill, reserved for the current item

Do not give every token a separate hue.

## Containers

Do not wrap everything. Use cards and panels only when the content behaves like
an object or group.

- page numbers: plain tabular text, no pill
- glossary terms: often unframed typography
- role labels: usually colored text, not filled chips
- compact comparisons: content-adaptive panel height
- large pale panels: useful for real grouping, not for short sparse notes

When content is sparse, shrink the panel or remove the frame.
