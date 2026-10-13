# Enterprise Console

Dark, dense, calm. Built for people who keep it open all day.

- **Fits:** Admin panels, observability, developer platforms, B2B dashboards.
- **Avoid for:** Marketing pages for the general public, brands that need warmth.

## Tokens

```yaml
color:
  canvas: "#0B0D10"
  surface: "#14181D"
  ink: "#E8EBEF"
  ink-muted: "#9AA4B1"
  hairline: "#252B33"
  accent: "#3B82F6"
  on-accent: "#0B0D10"
type:
  display: "Neutral grotesque, semibold"
  body: "Neutral grotesque, regular"
  mono: "Monospace for ids, code, and figures"
  scale-ratio: 1.2
  display-weight: 600
  display-tracking: "-0.01em"
shape:
  radius-control: "4px"
  radius-card: "6px"
  radius-container: "8px"
space:
  base: 4px
  section: "48px"
motion: "120ms ease-out, no entrance animation"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Surface steps and 1px borders. One shadow level for menus.

## Signature Moves

- Tabular numerals in every table and stat.
- Status as word plus shape plus colour.
- Keyboard shortcut hints beside actions.

## Never

- Gradients as decoration.
- Large hero type.
- Colour as the only status signal.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 16.3 to 1 | 7 to 1   |
| Ink on surface       | 14.9 to 1 | 7 to 1   |
| Muted ink on canvas  | 7.7 to 1  | 4.5 to 1 |
| Muted ink on surface | 7.1 to 1  | 4.5 to 1 |
| On-accent on accent  | 5.3 to 1  | 4.5 to 1 |
| Accent on canvas     | 5.3 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
