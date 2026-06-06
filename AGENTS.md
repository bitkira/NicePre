# NicePre Agent Instructions

This repository is for building a reusable academic presentation style system.
These instructions capture the current working decisions. Treat them as the
default unless the user explicitly overrides them.

## Goal

Create light, polished academic presentations and diagrams for RL, LLM, MDP,
PPO, reward model, embedding, token flow, and related technical topics.

The target look is a pale academic slide style:

- high lightness
- low to medium saturation
- colored fills with dark text
- restrained vector objects
- clear hierarchy
- no noisy decoration

## Authoring Format

Use fixed-canvas HTML/CSS/SVG as the source format for presentation work.

Preferred canvas:

- `1600x900` or `1920x1080`
- one slide per fixed 16:9 viewport
- HTML/CSS/SVG for layout, diagrams, formulas, icons, and tokens
- export screenshots/contact sheets for visual review
- export final deck to PDF, and to PPTX only when explicitly needed

Avoid using these as the primary source format unless the user asks:

- LaTeX/Beamer
- PPTX as the only editable source
- pure Markdown/Marp for visually complex decks

Reason: fixed HTML/CSS/SVG can be rendered, screenshotted, and visually checked
before handoff. Do not rely on source-code imagination for final layout.

## Visual QA Workflow

For substantial presentation work:

1. Render the deck locally.
2. Capture every slide as PNG.
3. Generate a contact sheet.
4. Inspect for overflow, clipping, unreadable text, misalignment, and awkward spacing.
5. Iterate before reporting completion.

Do not claim a deck is visually finished without seeing rendered output.

## Color System

Use a light academic palette based on the reference slides.

### Foundation

| Role | Hex | Use |
|---|---:|---|
| Canvas | `#FEFEFC` | page / slide base |
| Paper | `#FBFBF8` | content surface |
| Observed panel | `#F7FAF5` | observed / state region background |
| Formula wash | `#EDF4FA` | rare formula safe areas or derivation emphasis |
| Border | `#D7DAD4` | hairlines, grid, component outlines |
| Arrow | `#8B8D8C` | connectors and arrows |
| Main text | `#323232` | titles and primary text |
| Math text | `#282A2E` | formulas and math notation |

### Semantic Colors

| Role | Fill | Strong text / accent |
|---|---:|---:|
| State / observed | `#D5E3C8` | `#608343` |
| Action / intervention | `#F9DBC1` | `#9A6238` |
| Reward / return block | `#DDE6F0` | `#4D7CC6` |
| Scalar reward | `#FEE082` | `#8C7524` |
| Value estimate | `#D9CAE5` | `#78649A` |
| Prompt / source token | `#FEDDD8` | `#9A5A63` |
| Model / generated token | `#CFE2C1` | `#608343` |
| Probability token | `#CAE8FF` | `#4D7CC6` |
| Active probability | `#60C9EF` | `#1E6D8A` |
| Unknown / prior | `#D9DDE8` | `#66708D` |

Use color semantically. Do not assign arbitrary colors just to make a slide
more colorful.

Default symbol, role-label, legend-label, and simple heading accents should use
the main blue accent (`#4D7CC6`). Use other semantic hues only when they do real
work, such as distinguishing visual entities inside a diagram, encoding
positive/negative/data states, or matching colored terms in a formula
explanation.

### Gradient Policy

Do not use gradients by default. Most slides should use flat, light surfaces
from the palette above.

Avoid gray, black, or vignette-like fades in ordinary slide backgrounds. If a
gradient is explicitly needed for special emphasis, build it from the semantic
palette and keep it subtle enough that text and formulas remain the visual
priority.

## Token And Block States

For embedding, token, model-layer, or block sequences, keep one hue per semantic
stream and express state through tint depth, border weight, or one active block.

Use this state ladder:

- `ghost`: very pale, placeholder or inactive
- `base`: normal block
- `selected`: slightly deeper fill or border
- `active`: strongest fill, reserved for the current block

Do not give every token a different hue. The color should identify the stream;
state should be shown by shade, border, opacity, or annotation.

## Typography

Use these font roles:

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
  "PingFang SC", "Segoe UI", Arial, sans-serif;

--font-mono: "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

--font-math: "Latin Modern Math", "STIX Two Math",
  "Cambria Math", "Times New Roman", serif;
```

Recommended sizes:

- slide title: `48-64px`, weight `300-400`, color `#323232`
- section title: `22-30px`, weight `700-800`
- body annotation: `13-16px`, color `#3E403D`
- category label: `20-24px`, bold, semantic strong color
- formula: `32-46px`, math font, color `#282A2E`
- code / tensor label: `16-22px`, mono font

Keep text within its container. If text overflows, reduce copy, resize the
component, or split the content. Do not let slide elements overlap.

## Math Rendering

Use KaTeX by default for formulas and math labels.

- keep formula source as TeX strings
- render with a local, pinned `katex` package
- do not use CDN assets for deck rendering
- do not hand-build formulas with ordinary HTML `sub` / `sup` unless it is a
  tiny non-math label
- wait for KaTeX and web fonts before taking screenshots
- use MathJax only when KaTeX lacks required TeX support
- use `\displaystyle` or KaTeX `displayMode: true` for standalone formulas with
  `\sum`, `\prod`, `\int`, `\frac`, limits, or other tall operators; inline
  mode makes these look cramped and misaligned
- force explicit limits for standalone big operators whose bounds should sit
  above or below the operator, for example `\sum\limits_i` or
  `\sum\limits_{i \in S(x)}`; do not accept a lower-right side index when the
  notation should read as a displayed sum
- for display-style, aligned, or multi-line KaTeX formulas, measure the union of
  visible KaTeX descendant boxes, not just the top-level `.katex` wrapper

For highlighted math fragments, keep the math itself in TeX and wrap the
rendered fragment in a local visual component, such as `RewardBadge` or
`FormulaHighlight`.

Do not put formulas in blue boxes by default. Prefer unframed formula groups:
small colored title, large KaTeX, baseline alignment, and whitespace or a
hairline divider. Use `#EDF4FA` behind math only for true derivation groups,
tall display formulas that need safe measured space, or deliberate emphasis.
If most formulas on a slide have blue backgrounds, remove the backgrounds.

## Object And Icon Assets

For now, use Google Noto Emoji as the only external object-metaphor asset source.

Use Noto Emoji for:

- robot
- brain
- coin
- document / memo
- person / technologist
- computer
- chart
- microscope
- DNA / test tube

Do not force Noto Emoji to represent structural concepts such as:

- neural network
- embedding block
- model layer
- token sequence
- arrows
- formula panels

Build those as local SVG components using the palette above.

For complex visual objects that would be expensive or weak as hand-authored
SVG, use a hybrid raster path: generate a clean bitmap asset with imagegen, then
place exact formulas nearby with KaTeX.
This is appropriate for full transformer internals, model machinery, lab-like
systems, or conceptual devices. It is not appropriate for exact equations,
token sequences, matrices, tables, or architecture diagrams where precision is
the main point.

Generated assets should be text-free or near-text-free. Do not trust imagegen
for formulas, variable names, legends, or small technical text. Avoid detailed
hand-overlaid labels, arrows, and callouts on top of bitmaps. For visual
sequence diagrams, let imagegen generate the arrows, broad module captions, or
new blocks as part of the next image stage, using the previous image as a
reference. If exact geometry or exact text is required, build a code-native
SVG/HTML diagram instead.

Reject imagegen assets that look like hand-authored SVG flowcharts or crisp UI
mockups. A useful raster layer should have generated bitmap illustration
quality: soft translucent surfaces, organic visual flow, and text-free object
metaphor. If the result is mostly rigid boxes, exact arrows, pseudo-text, or
code-like diagram geometry, rebuild it natively or regenerate a more
illustrative bitmap.

When using Noto assets in a reusable or open-source package, include the
appropriate license/notice from the Noto Emoji repository. Avoid flag assets
unless their licensing has been checked separately.

## Diagram Components

Prefer reusable SVG/CSS components for:

- `TokenBlock`
- `TokenSequence`
- `ModelBlock`
- `DocumentObject`
- `DocumentStack`
- `RewardBadge`
- `FormulaPanel`
- `Arrow`
- `RegionPanel`
- `GridWorld`

Components should not imply wrappers. A component may generate unframed labels,
math, SVG geometry, anchors, and alignment rules without drawing a card around
the content.

Component style:

- 10-14px radius for small blocks
- 14-22px radius for panels
- pale semantic fill
- subtle gray border
- dark label text
- minimal inner detail
- no heavy shadows
- no decorative gradients

For repeated structures such as timelines, token sequences, embedding blocks,
layer stacks, and labeled formulas, use constraint-based components instead of
manual per-item coordinates.

- center sequences as a whole inside their panel
- derive arrows from rendered element centers after KaTeX/fonts are ready
- for multi-row diagrams, write a semantic data spec and let the component
  generate rows, anchors, and connectors; do not hand-write per-row arrows or
  coordinates
- at generation time, classify repeated row children into lanes before emitting
  DOM: row labels live in a non-connectable label lane, connector arrows live in
  a connector lane, and payload blocks expose the actual `data-node` anchors
- connectors should target specific anchors such as `completion-text` or
  `score`, not a broad wrapper row, when the visual destination is specific
- when multiple connectors feed one target, draw a fan-in connector: branch
  lines merge into a collector lane, then one main arrow points to the target.
  Do not place separate arrowheads at the same destination.
- row labels such as `o_i`, token ids, or step ids should not sit on the same
  lane as connector arrows. Place labels in a reserved label lane or at the
  row's upper edge, while arrows use the row center or explicit anchors.
- mark row labels as non-connectable and treat any arrow/label overlap as a QA
  failure, even if the slide has no clipping or overflow
- for flow or timeline nodes, avoid nesting a neutral card around a colored
  symbol chip unless the node truly needs separate object framing; prefer one
  semantic-colored block containing the KaTeX symbol and label
- attach labels to the formula terms they describe
- align formula groups by mathematical baselines when formulas sit on the same
  visual row
- for formula panels, measure visible KaTeX nodes and attached labels after
  rendering, then position the formula body automatically with title avoidance
  and bottom safe padding
- do not measure ordinary wrapper boxes as formula truth; wrapper line boxes can
  be larger than the visible math
- check both slide overflow and panel-internal clipping, especially for
  display-style sums with upper/lower limits
- check visual layer overlap, especially formula title badges over visible math
  descendants; overflow-free can still be visually wrong
- reserve manual absolute coordinates for one-off slide-level placement only

## Design Rules

- Start unframed. Use whitespace, alignment, arrows, colored text, and math
  baselines before adding panels, cards, or pills.
- Use large pale surfaces only for real grouping.
- Use dark text for readability.
- Use arrows and neutral structure in gray.
- Use semantic color only when it adds meaning.
- Keep ordinary symbols and labels in the main blue accent by default. Escalate
  to multiple hues only for diagram disambiguation, data state, or formula-term
  cross-reference.
- Add a wrapper only when it carries semantic meaning: object identity,
  membership, state, a formula safe region, or an actual subsystem boundary. If
  removing the fill/border does not change what the reader understands, remove
  it.
- Do not use blue formula boxes as a default formula style. Formulas usually sit
  unframed with small colored titles and strong KaTeX typesetting.
- Do not wrap short explanatory notes, glossary terms, or simple takeaway text in
  large cards. Prefer unframed typographic groups with clear heading color,
  line length, and spacing.
- When a container is necessary, its visual area should match the density of the
  content. Do not stretch a panel to the full slide region when it only contains
  a short list or a compact comparison.
- Do not wrap simple flow symbols twice. A semantic node can directly contain
  the math symbol and label.
- Do not use cards as generic spacing tools. Fix spacing with layout, not
  containers.
- Do not turn role labels, legend labels, or category names into pills by
  default. When the label is only naming a concept, semantic text color is often
  enough; use filled chips only when the label behaves like a token, state, or
  movable object.
- Do not wrap slide/page numbers in pills or badges by default. Page numbers are
  navigation metadata, so plain tabular text in the main blue accent is enough.
- Use Noto Emoji as small object metaphors, not as the entire visual language.
- Keep slides spacious but not sparse.
- Avoid pure black and pure white for designed surfaces when a tinted neutral is available.
- Avoid mixed icon families unless the user explicitly approves.
- Avoid stock-looking illustrations, noisy stickers, and inconsistent pasted assets.
- Avoid gradients in normal slides. Use flat fills unless a gradient has a clear
  semantic or emphasis purpose.

## Delivery Expectations

When producing a deck or visual system artifact, include:

- source files
- rendered slide screenshots
- a contact sheet or preview image
- notes on what was visually checked

If a visual check could not be run, say so explicitly.
