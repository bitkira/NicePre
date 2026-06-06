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

## Composition Ladder

Default to the least framed solution that still communicates the structure.

1. Unframed typography: colored heading or label, math, spacing, and alignment.
2. Direct semantic object: one filled token/block/node that is itself an object.
3. Group region: one pale panel when several objects form a visible subsystem.
4. Formula group: usually unframed KaTeX with a small title, spacing, and
   baseline alignment; use a pale panel only for true safe areas or derivations.
5. Hybrid raster asset: a generated bitmap for complex visual texture, with
   precise formulas placed nearby as code.

Do not skip directly to cards and pills. A component is not the same thing as a
wrapper: a good component can generate unframed labels, direct SVG geometry, and
spatial layout without drawing a box around every idea.

Use this wrapper test before drawing a border or fill:

- Does the boundary encode membership, state, or object identity?
- Does the box prevent ambiguity that spacing/alignment cannot solve?
- Is the content dense enough to justify the surface area?
- Would removing the box change what the reader understands?

If the answer is mostly no, remove the wrapper.

## Generated Raster Assets

Use a generated bitmap when the slide needs a rich object that is not primarily
a formal diagram: transformer internals, a neural-processing machine, a lab
setup, a compressed model stack, or an abstract system metaphor.

Keep the explanatory contract in code:

- the bitmap should contain no required text or formulas
- reserve clean space around the image for formula groups
- render formulas with KaTeX in adjacent unframed bands by default, never as
  baked-in image text
- do not hand-place decorative callouts directly on the bitmap
- when a visual sequence needs arrows, broad module captions, or simple block
  names, generate them inside the image so the whole state shares one style
- if exact arrows, brackets, labels, or architecture geometry are essential,
  switch back to a code-native SVG/HTML diagram

Do not use a generated image when the visual is mostly a graph, matrix, table,
token sequence, equation, or exact architecture diagram. Build those directly as
SVG/HTML so they remain precise.

## Progressive Imagegen Sequences

For slides that reveal a system stage by stage, use imagegen as a state
evolution tool instead of hand-overlaying each new visual element.

Workflow:

1. Generate stage 1 as a clean base visual.
2. Use stage 1 as an image reference for stage 2, asking imagegen to preserve
   style and add only the next visual element.
3. Repeat for later stages, keeping camera, palette, block shapes, whitespace,
   and line language consistent.
4. Put exact formulas in adjacent KaTeX groups, not inside the generated image.

Good cases:

- embedding block -> embedding + transformer block -> embedding + transformer +
  linear head
- prompt tokens -> model interior -> response states
- prior visual object -> same object with one highlighted mechanism added

Bad cases:

- exact matrices or token ids
- equations inside the image
- tiny technical labels that must be spelled perfectly
- diagrams where arrow anchor positions must be mathematically precise

## Math

Use KaTeX by default. Render after the DOM is created, wait for fonts, then
measure visible math before final layout.

Default formula composition:

- unframed formula group
- small colored title or term label
- large readable KaTeX
- aligned baselines and generous whitespace
- optional hairline divider when a row needs structure
- display style for sums, products, integrals, fractions, limits, and tall
  operators
- explicit `\limits` on standalone big operators when their bounds should sit
  above or below the operator, such as `\sum\limits_i`

Do not wrap every formula in a blue rounded rectangle. Use a pale formula panel
only when the formula needs a safe measured area, belongs to a multi-step
derivation, or must be emphasized as a primary object.

For display-style, aligned, or multi-line formulas:

- force `\displaystyle` or KaTeX `displayMode: true` for sums, products,
  integrals, fractions, limits, and tall operators
- add `\limits` for standalone sums/products/argmax/argmin when the bound
  belongs under/over the operator; display size alone is not enough if the
  subscript remains at the lower right
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

For process flows, the arrow path and spatial ordering already express
sequence. Do not put every step in a separate card unless each step is a real
object with internal structure. A short step label can be unframed colored text
next to a symbol or anchor.

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
an object or group. Treat every wrapper as visual debt: it must earn its border,
fill, padding, and occupied area.

- page numbers: plain tabular text, no pill
- glossary terms: often unframed typography
- role labels: usually colored text, not filled chips
- compact comparisons: content-adaptive panel height
- large pale panels: useful for real grouping, not for short sparse notes
- formulas: usually unframed; blue formula panels are exceptional, not default
- symbol + label: usually one semantic block or unframed label, not chip inside
  card
- formula term explanation: often colored math term plus short inline label, not
  a separate card for each term

When content is sparse, shrink the panel or remove the frame.
