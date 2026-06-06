# Visual System

Use this reference when choosing the deck look: palette, typography, surfaces,
and asset style.

## Palette

Foundation:

| Role | Hex | Use |
|---|---:|---|
| Canvas | `#FEFEFC` | slide base |
| Paper | `#FBFBF8` | neutral content surface |
| Observed panel | `#F7FAF5` | state or observed regions |
| Formula wash | `#EDF4FA` | rare formula safe areas or derivation emphasis |
| Border | `#D7DAD4` | hairlines and component outlines |
| Arrow | `#8B8D8C` | connectors |
| Main text | `#323232` | titles and primary text |
| Math text | `#282A2E` | formulas |
| Main blue | `#4D7CC6` | default accent for simple labels |

Semantic fills:

| Role | Fill | Strong text |
|---|---:|---:|
| State / observed | `#D5E3C8` | `#608343` |
| Action / intervention | `#F9DBC1` | `#9A6238` |
| Reward / return | `#DDE6F0` | `#4D7CC6` |
| Scalar reward | `#FEE082` | `#8C7524` |
| Value estimate | `#D9CAE5` | `#78649A` |
| Prompt / source | `#FEDDD8` | `#9A5A63` |
| Model / generated | `#CFE2C1` | `#608343` |
| Probability | `#CAE8FF` | `#4D7CC6` |
| Unknown / prior | `#D9DDE8` | `#66708D` |

Use color only when it does work: distinguishing entities in a diagram, showing
state, or matching formula terms to explanations. Do not make every symbol a
different hue just to add color.

## Typography

Use system fonts for text and KaTeX for math.

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
  "PingFang SC", "Segoe UI", Arial, sans-serif;
--font-mono: "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

Suggested sizes:

- slide title: `48-64px`, weight `300-400`
- section title: `22-30px`, weight `700-800`
- body annotation: `18-24px`
- compact labels: `13-18px`
- display formula: `32-46px`
- code/tensor labels: `16-22px`

Keep line length under control. In compact panels, use smaller headings instead
of hero-scale type.

## Surfaces

- small blocks: `10-14px` radius
- panels: `14-22px` radius
- use subtle borders, pale fills, and dark text
- avoid heavy shadows, stock decorations, bokeh, and decorative gradients
- do not use pure black or pure white when a tinted neutral is available

Use filled blocks for objects, states, and tokens. Use colored text for role
labels or headings that merely name a concept.

Surfaces are not the default unit of design. Begin with unframed typography,
alignment, direct SVG shapes, and whitespace. Add a surface only when it marks a
real object, a grouped subsystem, or a formula safe region. Do not use cards as
general-purpose spacing tools.

Prefer colored text over filled chips for labels that only name a role, category,
or formula term. Prefer one semantic block over a neutral card containing a
colored chip.

Formulas are not panels by default. A formula usually needs strong KaTeX
typesetting, a small colored title, and enough whitespace. Use `#EDF4FA` behind
math only when the background carries real structure: a multi-line derivation, a
safe measured region for tall operators, or a deliberate emphasis. If most
formulas on a slide have blue backgrounds, remove the backgrounds first.

## Gradients

Default to no gradients. If a gradient is required for special emphasis, build
it from the semantic palette and keep it subtle. Never use black/gray vignette
fades as ordinary slide backgrounds.

## Assets

Use Google Noto Emoji only for small object metaphors such as a robot, coin,
document, person, computer, chart, microscope, DNA, or test tube.

Do not use emoji assets for structural concepts such as neural networks,
embedding blocks, model layers, token sequences, arrows, or formula panels.
Build structural concepts with local SVG/CSS components.

Use imagegen-generated bitmap assets when a structural concept would be costly
or visually weak to draw by hand, such as a full transformer stack, model
interior, lab setup, hardware-like system, or conceptual machine. Treat the
generated image as an illustration layer, not the source of truth.

The generated result must actually look like a bitmap illustration. Reject
raster assets that read as hand-authored SVG flowcharts, crisp UI mockups,
ordinary rounded-card diagrams, or code-native boxes with sharp arrows. Those
should either be rebuilt directly in HTML/SVG or regenerated with a stronger
illustration prompt.

Generated side token streams are a common failure point. For token or embedding
sequences, prefer the code-native `TokenSequence` style. If a generated bitmap
includes input/output streams, they must match the NicePre language: flat 2D
rounded blocks, pale semantic fills, and no glossy cubes, bead strings, or 3D
token tiles.

Rules for generated assets:

- request text-free or near-text-free images when labels are not needed
- ask for the NicePre palette, flat light academic style, and clean whitespace
- avoid generated formulas, variable names, dense legends, and small technical
  text
- avoid generated side token sequences unless they match the code-native token
  style exactly; otherwise omit them and use soft flow ribbons
- allow style-native arrows, broad module captions, and simple block names when
  they are part of a generated visual sequence and can be inspected
- place precise formulas in separate unframed KaTeX formula areas near the image
- do not hand-overlay decorative or approximate arrows/labels on the bitmap;
  generate those as part of the image when needed
- if exact arrows, exact labels, or exact architecture geometry are required,
  build a code-native SVG diagram instead
- keep the bitmap visually subordinate to the formula/explanation layer

For progressive sequence slides, use the previous generated image as a visual
reference for the next stage. Example: first generate an embedding module, then
use that image to generate an expanded embedding + transformer block stage, then
use that image to generate embedding + transformer block + linear head. Preserve
camera, palette, spacing, object shapes, and visual language across stages.
