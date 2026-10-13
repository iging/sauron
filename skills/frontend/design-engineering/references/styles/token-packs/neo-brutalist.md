# Neo Brutalist

Loud, flat, outlined. Hard offset shadows and thick borders.

- **Fits:** Creator tools, indie products, events, youth brands.
- **Avoid for:** Finance, healthcare, anything where calm is trust.

## Tokens

```yaml
color:
  canvas: "#FFF8E7"
  surface: "#FFFFFF"
  ink: "#0A0A0A"
  ink-muted: "#4A4A4A"
  hairline: "#0A0A0A"
  accent: "#FFD400"
  on-accent: "#0A0A0A"
type:
  display: "Heavy grotesque"
  body: "Grotesque, medium"
  mono: "Monospace for tags"
  scale-ratio: 1.333
  display-weight: 800
  display-tracking: "-0.02em"
shape:
  radius-control: "0"
  radius-card: "0"
  radius-container: "6px"
space:
  base: 4px
  section: "80px"
motion: "100ms linear; the pressed state removes the shadow and shifts 4px"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

2px to 3px ink borders with a hard 4px 4px 0 ink shadow. No blur.

## Signature Moves

- Offset hard shadow that collapses on press.
- Flat colour blocks behind sections.
- Oversized uppercase labels.

## Never

- Soft shadows.
- Gradients.
- Thin grey borders.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 18.7 to 1 | 7 to 1   |
| Ink on surface       | 19.8 to 1 | 7 to 1   |
| Muted ink on canvas  | 8.4 to 1  | 4.5 to 1 |
| Muted ink on surface | 8.9 to 1  | 4.5 to 1 |
| On-accent on accent  | 13.8 to 1 | 4.5 to 1 |
| Accent on canvas     | 1.4 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.

The accent does not reach 3 to 1 against the canvas. In this pack the accent is only ever a fill inside an ink border, so the ink border supplies the boundary contrast. Never use the accent for text or for an unbordered control.
