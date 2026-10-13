# Swiss Minimal

Grid-led, typographic, almost colourless, with one blunt signal colour.

- **Fits:** Studios, architecture, documentation, portfolios, product pages that sell by clarity.
- **Avoid for:** Playful consumer brands, anything that needs warmth.

## Tokens

```yaml
color:
  canvas: "#FAFAF8"
  surface: "#FFFFFF"
  ink: "#111111"
  ink-muted: "#5C5C5C"
  hairline: "#E2E2DE"
  accent: "#D4001A"
  on-accent: "#FFFFFF"
type:
  display: "Neutral grotesque, bold"
  body: "Neutral grotesque, regular"
  mono: "Plain monospace for figures"
  scale-ratio: 1.25
  display-weight: 700
  display-tracking: "-0.02em"
shape:
  radius-control: "0"
  radius-card: "2px"
  radius-container: "4px"
space:
  base: 4px
  section: "96px"
motion: "150ms ease-out, colour and opacity only"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Rules and white space only. No shadows.

## Signature Moves

- Visible column grid with content snapping to it.
- Flush-left headlines with a ragged right edge.
- The signal colour on exactly one element per viewport.

## Never

- Centred layouts.
- Rounded cards.
- Decorative icons.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 18.1 to 1 | 7 to 1   |
| Ink on surface       | 18.9 to 1 | 7 to 1   |
| Muted ink on canvas  | 6.4 to 1  | 4.5 to 1 |
| Muted ink on surface | 6.7 to 1  | 4.5 to 1 |
| On-accent on accent  | 5.5 to 1  | 4.5 to 1 |
| Accent on canvas     | 5.3 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
