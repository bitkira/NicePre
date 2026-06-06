# Imagegen Asset Prompts

Use this reference when a slide needs a generated bitmap illustration layer:
transformer internals, model machinery, lab-like systems, conceptual devices, or
other visual objects that would be costly or weak as hand-authored SVG.

The generated image is never the source of truth. It is an atmospheric or object
layer. The precise explanatory layer should usually be beautiful KaTeX formulas
placed near the image. For visual sequence slides, imagegen may also generate
the stage-specific visual elements such as broad arrows, module captions, and
simple block names so the picture remains stylistically unified.

## Decision Rule

Use imagegen when:

- the slide needs a rich visual object, not an exact diagram
- the result should visibly be a generated bitmap illustration layer, not a
  code-native flowchart rendered as pixels
- the object can be text-free, or uses only large simple labels that can be
  visually checked
- the reader can still understand exact meaning from adjacent formulas or
  code-native diagrams
- a generated bitmap will improve visual quality more than a hand-authored SVG
- a progressive slide needs the same object evolving across stages

Do not use imagegen when:

- the visual is mostly an equation, graph, matrix, table, exact architecture, or
  token sequence
- the desired output is rigid boxes, sharp arrows, UI-like cards, or a precise
  flowchart that would be cleaner as HTML/SVG
- exact text accuracy matters inside the bitmap
- the asset must remain fully editable as vector source

## Prompt Template

```text
Use case: scientific-educational
Asset type: bitmap illustration layer for a fixed 16:9 academic slide
Primary request: Create a clean text-free illustration of {subject}.

Style:
Light academic presentation aesthetic. Flat, airy, polished, restrained.
Canvas-like off-white background (#FEFEFC). Soft pale surfaces using the NicePre
palette: blue #EDF4FA / #4D7CC6, green #D5E3C8 / #608343, peach #F9DBC1,
lavender #D9CAE5, yellow #FEE082, neutral border #D7DAD4. Low to medium
saturation, high lightness, no heavy shadows.

Composition:
16:9 horizontal. Keep the subject around 45-60% of the canvas. Leave generous
negative space around the subject for adjacent unframed formula areas in the
slide layout. Prefer simple rounded blocks, soft translucent planes, subtle
connectors, and quiet geometric rhythm. The image should read as a refined
academic visual object, not a finished diagram.

Subject requirements:
{specific visual object, physical metaphor, or technical structure}

Precision safety:
No formulas, no variable names, no dense legends, no tiny glyphs, no watermark.
If labels are needed, use only large simple module captions that can be checked
visually. Do not include pseudo-text or fake symbols. Broad style-native arrows
are allowed only when they are part of the generated visual state, not exact
technical connectors.

Avoid:
dark background, neon colors, purple/blue gradient dominance, corporate 3D,
stock illustration, dense infographic, realistic UI screenshot, chalkboard,
paper texture, bokeh, decorative blobs, heavy shadows, clutter.
```

## Transformer / Model Internals Example

```text
Use case: scientific-educational
Asset type: bitmap illustration layer for a fixed 16:9 academic slide
Primary request: Create a clean text-free illustration of a transformer model
interior as a calm stack of attention and feed-forward layers.

Style:
Light academic presentation aesthetic. Flat, airy, polished, restrained.
Canvas-like off-white background (#FEFEFC). Soft pale surfaces using the NicePre
palette: blue #EDF4FA / #4D7CC6, green #D5E3C8 / #608343, peach #F9DBC1,
lavender #D9CAE5, yellow #FEE082, neutral border #D7DAD4. Low to medium
saturation, high lightness, no heavy shadows.

Composition:
16:9 horizontal. A central layered transformer block stack occupies about half
the canvas. Abstract token streams enter from the left as small pale rounded
rectangles and leave to the right as quieter aligned blocks. Include subtle
attention-like arcs and translucent layer planes, but keep wide whitespace above
and below for unframed formula bands in the slide layout.

Formula safety:
No formulas, no variable names, no dense legends, no tiny glyphs, no watermark.
Large simple module captions are acceptable only if requested and must be
checked after generation. Avoid exact arrows; use only soft visual flow unless a
stage explicitly needs broad style-native arrows.

Avoid:
dark background, neon colors, sci-fi glow, corporate 3D, dense infographic,
realistic UI screenshot, fake text, pseudo-code, chalkboard, paper texture,
decorative blobs, heavy shadows, clutter.
```

## Prompt Generation Steps

1. Classify whether the requested subject is a generated object layer or an
   exact code-native diagram.
2. Name the subject in physical visual terms, not only abstract theory.
3. Preserve the NicePre palette and flat light surface rules.
4. Reserve empty space around the image for unframed formula groups.
5. Ban formulas, variable names, pseudo-text, dense legends, and watermark.
   Permit only large simple module captions when the visual sequence needs them.
6. After generation, inspect the image before using it. Reject assets with
   hallucinated text, wrong palette, dark backgrounds, clutter, or baked-in
   arrows that conflict with the formula-first composition.
7. Reject outputs that look like hand-authored SVG, UI mockups, or exact
   flowcharts. The raster layer should have bitmap illustration qualities:
   gentle translucency, soft object texture, organic flow, and no pseudo-text.

## Progressive Sequence Prompt

Use this when a deck needs multiple slides showing the same system gradually
gaining parts.

```text
Use case: scientific-educational
Asset type: progressive bitmap illustration stage for a fixed 16:9 academic
slide
Input image: use the previous stage as the visual reference. Preserve camera,
palette, spacing, rounded geometry, line style, object proportions, and
background.

Primary request:
Create the next stage of the same NicePre-style academic visual sequence.
Keep all existing objects from the reference image stable. Add only:
{new element, e.g. transformer block, linear head, attention path, broad
style-native arrow}.

Style:
Light academic presentation aesthetic. Flat, airy, polished, restrained.
Canvas-like off-white background (#FEFEFC). Soft pale surfaces using the NicePre
palette: blue #EDF4FA / #4D7CC6, green #D5E3C8 / #608343, peach #F9DBC1,
lavender #D9CAE5, yellow #FEE082, neutral border #D7DAD4. Low to medium
saturation, high lightness, no heavy shadows.

Label policy:
No formulas, no variable names, no small text, no dense legends, no watermark.
If module labels are needed, use only large simple captions such as Embedding,
Transformer, Linear, Attn, or FFN. They must be clear and sparse. No
pseudo-text.

Composition:
Keep the reference image's layout and visual rhythm. Make the new element feel
drawn by the same hand and palette. Leave whitespace for separate KaTeX formulas
outside the image.

Avoid:
dark background, neon colors, corporate 3D, dense infographic, fake text,
pseudo-code, overlaid UI, heavy shadows, clutter, changing the existing objects.
```
