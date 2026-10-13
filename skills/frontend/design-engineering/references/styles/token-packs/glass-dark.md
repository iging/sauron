# Glass Dark

Near-black canvas, hairline structure, translucent panels, one luminous accent.

- **Fits:** Product launches, AI tools, agencies, premium SaaS marketing.
- **Avoid for:** Content-heavy sites, low-power devices, public sector.

## Tokens

```yaml
color:
  canvas: "#060608"
  surface: "#121216"
  ink: "#F4F4F5"
  ink-muted: "#A1A1AA"
  hairline: "#26262C"
  accent: "#8EE3C8"
  on-accent: "#06120E"
type:
  display: "Geometric sans, medium"
  body: "Neutral sans, regular"
  mono: "Monospace for labels"
  scale-ratio: 1.25
  display-weight: 500
  display-tracking: "-0.03em"
shape:
  radius-control: "10px"
  radius-card: "18px"
  radius-container: "28px"
space:
  base: 4px
  section: "128px"
motion: "500ms cubic-bezier(0.16, 1, 0.3, 1), transform and opacity"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Hairlines at low alpha, blur on three layers at most.

## Signature Moves

- Double-bezel panel on the hero artefact.
- Floating island navigation.
- One fixed mesh atmosphere behind content.

## Never

- Blur on full-screen layers.
- Glow on body text.
- More than one accent hue.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 18.4 to 1 | 7 to 1   |
| Ink on surface       | 17.0 to 1 | 7 to 1   |
| Muted ink on canvas  | 7.9 to 1  | 4.5 to 1 |
| Muted ink on surface | 7.3 to 1  | 4.5 to 1 |
| On-accent on accent  | 12.7 to 1 | 4.5 to 1 |
| Accent on canvas     | 13.5 to 1 | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
