# Soft Neumorphic

Low-contrast surfaces shaped by paired light and dark shadows.

- **Fits:** Device controls, audio and smart-home panels, calculators, small tool surfaces.
- **Avoid for:** Text-heavy pages, forms with many fields, anything needing strong hierarchy.

## Tokens

```yaml
color:
  canvas: "#E9ECF1"
  surface: "#EEF1F5"
  ink: "#1E2530"
  ink-muted: "#566173"
  hairline: "#D5DAE2"
  accent: "#3D5AFE"
  on-accent: "#FFFFFF"
type:
  display: "Rounded sans, semibold"
  body: "Rounded or humanist sans"
  mono: "Not used"
  scale-ratio: 1.2
  display-weight: 600
  display-tracking: "-0.01em"
shape:
  radius-control: "12px"
  radius-card: "16px"
  radius-container: "24px"
space:
  base: 4px
  section: "72px"
motion: "150ms ease-out, shadow swap on press"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

Dual shadow: light from top-left, dark to bottom-right. Inset for pressed.

## Signature Moves

- Raised controls that sink when pressed.
- A single filled accent control per view.
- Dials and sliders as primary inputs.

## Never

- Relying on shadow alone to mark an input.
- Low-contrast body text.
- Using it for a whole content site.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 13.0 to 1 | 7 to 1   |
| Ink on surface       | 13.6 to 1 | 7 to 1   |
| Muted ink on canvas  | 5.3 to 1  | 4.5 to 1 |
| Muted ink on surface | 5.5 to 1  | 4.5 to 1 |
| On-accent on accent  | 5.1 to 1  | 4.5 to 1 |
| Accent on canvas     | 4.3 to 1  | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
