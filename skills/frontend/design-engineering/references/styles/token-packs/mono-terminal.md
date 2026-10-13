# Mono Terminal

Phosphor on near-black, monospace throughout, box-drawn structure.

- **Fits:** CLI tools, developer products, security, changelogs, personal technical sites.
- **Avoid for:** Consumer commerce, hospitality, anything image-led.

## Tokens

```yaml
color:
  canvas: "#0C0F0C"
  surface: "#121612"
  ink: "#D7F5D0"
  ink-muted: "#8FB389"
  hairline: "#233023"
  accent: "#7CFFB2"
  on-accent: "#06120A"
type:
  display: "Monospace, bold"
  body: "Monospace, regular"
  mono: "The same monospace"
  scale-ratio: 1.2
  display-weight: 700
  display-tracking: "0"
shape:
  radius-control: "0"
  radius-card: "0"
  radius-container: "2px"
space:
  base: 4px
  section: "56px"
motion: "steps() timing; one typed line on load, under 600ms"
```

The type entries name a character, not a licensed family. Map each to a face the project can load, then record the choice in the project `DESIGN.md`.

## Depth

1px phosphor rules. No shadows, no blur.

## Signature Moves

- Prompt-style headings with a leading symbol.
- Bracketed tags such as [ OK ].
- A single block cursor on one live value.

## Never

- Continuous flicker.
- Body text below 14px.
- More than one phosphor colour.

## Contrast Evidence

| Pair                 | Ratio     | Required |
| -------------------- | --------- | -------- |
| Ink on canvas        | 16.4 to 1 | 7 to 1   |
| Ink on surface       | 15.5 to 1 | 7 to 1   |
| Muted ink on canvas  | 8.2 to 1  | 4.5 to 1 |
| Muted ink on surface | 7.8 to 1  | 4.5 to 1 |
| On-accent on accent  | 15.3 to 1 | 4.5 to 1 |
| Accent on canvas     | 15.4 to 1 | 3 to 1   |

Semantic colours (success, warning, danger) are not part of a pack. Take them from the project token set and check them against this canvas.
