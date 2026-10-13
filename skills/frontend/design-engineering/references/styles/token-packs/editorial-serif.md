# Editorial Serif

Magazine pacing: a high-contrast serif at display sizes over a quiet sans.

- **Fits:** Publications, law, wine and food, long-form brand stories, premium services.
- **Avoid for:** Dense dashboards, developer tools.

## Tokens

```yaml
color:
  canvas: "#FBF8F2"
  surface: "#F3EEE4"
  ink: "#1C1915"
  ink-muted: "#6A6359"
  hairline: "#E0D8CA"
  accent: "#7A1F2B"
  on-accent: "#FFFFFF"
type:
  display: "High-contrast serif, regular"
  body: "Humanist sans, regular"
  mono: "Not used"
  scale-ratio: 1.333
  display-weight: 400
  display-tracking: "-0.02em"
shape:
  radius-control: "2px"
  radius-card: "4px"
  radius-container: "6px"
space:
  base: 4px
  section: "112px"
motion: "240ms ease-out, fades only"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Hairlines and surface tint. No shadows.

## Signature Moves

- Large display headline with tight tracking.
- Pull quotes set in the serif at twice body size.
- Hairline rules above section labels.

## Never

- Bold weights on the serif.
- Pill buttons.
- More than one accent.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 16.5 to 1 | 7 to 1   |
| Ink on surface       | 15.1 to 1 | 7 to 1   |
| Muted ink on canvas  | 5.6 to 1  | 4.5 to 1 |
| Muted ink on surface | 5.1 to 1  | 4.5 to 1 |
| On-accent on accent  | 10.2 to 1 | 4.5 to 1 |
| Accent on canvas     | 9.6 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
