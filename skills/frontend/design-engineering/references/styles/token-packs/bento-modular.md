# Bento Modular

Gapless grid of unequal cells, each carrying one claim.

- **Fits:** Feature overviews, product pages, personal sites, showcase dashboards.
- **Avoid for:** Linear stories, long-form reading.

## Tokens

```yaml
color:
  canvas: "#F4F4F2"
  surface: "#FFFFFF"
  ink: "#18181B"
  ink-muted: "#63636B"
  hairline: "#E4E4E0"
  accent: "#0F766E"
  on-accent: "#FFFFFF"
type:
  display: "Geometric sans, semibold"
  body: "Neutral sans, regular"
  mono: "Monospace for figures"
  scale-ratio: 1.25
  display-weight: 600
  display-tracking: "-0.02em"
shape:
  radius-control: "8px"
  radius-card: "16px"
  radius-container: "24px"
space:
  base: 4px
  section: "80px"
motion: "200ms ease-out; cells scale to 1.01 on hover behind a pointer-fine guard"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

White cells on a tinted canvas with a hairline. No shadows.

## Signature Moves

- Rows that always sum to twelve columns.
- One accent-filled cell per grid.
- A cell that holds only a large number.

## Never

- Empty cells.
- Equal cells throughout.
- A heading, text, image, and button in every cell.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 16.1 to 1 | 7 to 1   |
| Ink on surface       | 17.7 to 1 | 7 to 1   |
| Muted ink on canvas  | 5.4 to 1  | 4.5 to 1 |
| Muted ink on surface | 6.0 to 1  | 4.5 to 1 |
| On-accent on accent  | 5.5 to 1  | 4.5 to 1 |
| Accent on canvas     | 5.0 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
