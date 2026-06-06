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
| Formula panel | `#EDF4FA` | formulas and derivations |
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
