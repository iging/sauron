# Clay Playful

Chunky, rounded, friendly shapes with soft inner highlights.

- **Fits:** Kids and education, habit apps, casual games, friendly onboarding.
- **Avoid for:** Enterprise, legal, luxury.

## Tokens

```yaml
color:
  canvas: "#FFF4EC"
  surface: "#FFFFFF"
  ink: "#2B1D3A"
  ink-muted: "#6B5A7A"
  hairline: "#F0DCCB"
  accent: "#7C4DFF"
  on-accent: "#FFFFFF"
type:
  display: "Rounded sans, extra bold"
  body: "Rounded sans, medium"
  mono: "Not used"
  scale-ratio: 1.25
  display-weight: 800
  display-tracking: "-0.01em"
shape:
  radius-control: "16px"
  radius-card: "24px"
  radius-container: "32px"
space:
  base: 4px
  section: "80px"
motion: "200ms with a soft overshoot on press and release"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Outer soft shadow plus an inner top highlight and inner bottom shade.

## Signature Moves

- Buttons that squash slightly on press.
- Illustrated empty states.
- Large friendly numerals for progress.

## Never

- Thin hairlines.
- Sharp corners.
- Dense tables.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 14.5 to 1 | 7 to 1   |
| Ink on surface       | 15.7 to 1 | 7 to 1   |
| Muted ink on canvas  | 5.8 to 1  | 4.5 to 1 |
| Muted ink on surface | 6.2 to 1  | 4.5 to 1 |
| On-accent on accent  | 4.8 to 1  | 4.5 to 1 |
| Accent on canvas     | 4.4 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
