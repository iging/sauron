# Retro Neon

Deep violet night, hot magenta signal, grid horizons, arcade energy.

- **Fits:** Music, games, nightlife, event microsites, nostalgia campaigns.
- **Avoid for:** Professional services, healthcare, long reading.

## Tokens

```yaml
color:
  canvas: "#0D0221"
  surface: "#190B37"
  ink: "#F6F0FF"
  ink-muted: "#B7A6D9"
  hairline: "#2E1A5C"
  accent: "#FF2E97"
  on-accent: "#0D0221"
type:
  display: "Condensed display, heavy, uppercase"
  body: "Geometric sans, regular"
  mono: "Monospace for counters"
  scale-ratio: 1.333
  display-weight: 800
  display-tracking: "0.01em"
shape:
  radius-control: "2px"
  radius-card: "4px"
  radius-container: "8px"
space:
  base: 4px
  section: "96px"
motion: "300ms ease-out; any looping element needs a pause control"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Accent glow on two elements at most. Flat elsewhere.

## Signature Moves

- Perspective grid floor in the hero.
- Outlined display type.
- Scanline overlay at low opacity.

## Never

- Glow on paragraphs.
- Three neon hues at once.
- A light theme.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 18.0 to 1 | 7 to 1   |
| Ink on surface       | 16.5 to 1 | 7 to 1   |
| Muted ink on canvas  | 9.0 to 1  | 4.5 to 1 |
| Muted ink on surface | 8.3 to 1  | 4.5 to 1 |
| On-accent on accent  | 5.8 to 1  | 4.5 to 1 |
| Accent on canvas     | 5.8 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
