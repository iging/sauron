# Paper Print

Uncoated stock, ink blue, letterpress restraint.

- **Fits:** Bookshops, stationers, newsletters, museums, archives.
- **Avoid for:** Apps with dense interaction, dark-theme products.

## Tokens

```yaml
color:
  canvas: "#F4F0E6"
  surface: "#FBF8F1"
  ink: "#22201C"
  ink-muted: "#6B665C"
  hairline: "#D9D2C2"
  accent: "#1D4E89"
  on-accent: "#FFFFFF"
type:
  display: "Old-style serif, regular"
  body: "Old-style serif or humanist sans"
  mono: "Typewriter-style monospace for captions"
  scale-ratio: 1.25
  display-weight: 400
  display-tracking: "-0.01em"
shape:
  radius-control: "0"
  radius-card: "2px"
  radius-container: "4px"
space:
  base: 4px
  section: "96px"
motion: "200ms fade; no movement"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Fine grain overlay and hairline rules. No shadows.

## Signature Moves

- Small caps for labels.
- Numbered marginal notes.
- A single ink-blue stamp or seal motif.

## Never

- Glossy gradients.
- Rounded pills.
- Bright multi-colour palettes.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 14.3 to 1 | 7 to 1   |
| Ink on surface       | 15.3 to 1 | 7 to 1   |
| Muted ink on canvas  | 5.0 to 1  | 4.5 to 1 |
| Muted ink on surface | 5.4 to 1  | 4.5 to 1 |
| On-accent on accent  | 8.4 to 1  | 4.5 to 1 |
| Accent on canvas     | 7.4 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
