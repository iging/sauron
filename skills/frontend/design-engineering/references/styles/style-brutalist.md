# Industrial Brutalist and Telemetry Aesthetic

Depth reference for `02-styles/style-brutalist`. It specifies the two archetypes, the type system, grid construction, the symbol set, and texture effects, along with the readability limits this style tends to break.

## 1. Archetypes

Commit to one per project. They do not mix.

### Swiss Industrial Print (light)

| Role      | Value                              | Note                                |
| --------- | ---------------------------------- | ----------------------------------- |
| Substrate | `#F1EFE8` or `#EDEBE4`             | Newsprint, never white              |
| Ink       | `#0E0E0E`                          | One black                           |
| Signal    | `#E10600` or one equally blunt hue | Used on under 5 percent of the page |
| Rule      | ink, 1 px and 2 px                 | Visible structure                   |
| Texture   | optional halftone or paper grain   | Static                              |
| Character | Poster, timetable, specimen sheet  |                                     |

### Tactical Telemetry (dark)

| Role      | Value                                   | Note                             |
| --------- | --------------------------------------- | -------------------------------- |
| Substrate | `#050607`                               | Near black                       |
| Phosphor  | one of `#7CFFB2`, `#FFB000`, `#E8E8E8`  | Pick one tube colour and keep it |
| Dim       | phosphor at 45 to 60 percent alpha      | Secondary data; check contrast   |
| Alert     | `#FF3B30`                               | Reserved for real warnings       |
| Rule      | phosphor at 20 percent alpha, 1 px      | Grid and frames                  |
| Texture   | scanlines, slight glow on key figures   | See Section 6                    |
| Character | Instrument panel, terminal, flight data |                                  |

## 2. Type System

### Macro type: structural headers

- A heavy grotesque or an extended display face, uppercase.
- Size by viewport: `clamp(3rem, 2rem + 8vw, 11rem)` for the lead line.
- Line height 0.85 to 0.92. Tracking -0.03 to -0.05em.
- Let the headline touch or cross a grid line. Type is the image here.
- Break lines by hand for shape. Do not let the browser decide.

### Micro type: data and labels

- Monospace, uppercase, 11 to 12 px, tracking 0.06 to 0.1em.
- Use it for labels, coordinates, indices, timestamps, and units.
- **Readability limit:** 11 px is for metadata only. Anything a user must read to complete a task (body copy, form labels, error text) is 14 px or larger.

### Textural contrast

One deliberate disruption per page: a single serif italic word in a grotesque headline, a hand-set numeral at ten times body size, or one rotated label running up the page edge. One, not several.

## 3. Colour Rules

- Two colours plus the signal. No tints, no gradients, no shadows.
- Fill areas are flat. Depth comes from overlap and rule weight.
- The signal colour marks one thing per viewport: the action, the alert, or the index.
- Inversion (ink block with substrate-coloured text) is the main emphasis device.
- Body text contrast stays at 7 to 1 or better; the palette makes that easy, so do not waste it on dim text.

## 4. Grid and Space

- The grid is visible. Draw column and row rules at 1 px.
- No rounded corners anywhere. Radius is 0.
- Cells share borders; do not double them. Use border on two sides and let neighbours supply the rest, or collapse with a negative 1 px margin.
- Mix dense cells with one large empty cell. Emptiness is a compositional element, not a gap to fill.
- Padding inside cells is tight and consistent (12 or 16 px).
- Mark intersections with small registration crosses where it helps the composition, not at every junction.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  border-block-start: 1px solid var(--rule);
  border-inline-start: 1px solid var(--rule);
}

.grid > * {
  border-block-end: 1px solid var(--rule);
  border-inline-end: 1px solid var(--rule);
  padding: 1rem;
  border-radius: 0;
}
```

## 5. Components and Symbols

| Component | Construction                                                                  |
| --------- | ----------------------------------------------------------------------------- |
| Button    | Rectangular, 1 px or 2 px rule, uppercase mono label, inverts on hover        |
| Input     | Bottom rule only or full rectangle, mono label above, no placeholder as label |
| Tag       | Bracketed text such as `[ LIVE ]`, no pill                                    |
| Index     | Zero-padded numerals: `01`, `02`, `03`                                        |
| Meter     | Segmented blocks, not a smooth bar                                            |
| Table     | Full rules, mono figures, right-aligned numbers, tabular numerals             |
| Divider   | A rule with a label breaking it                                               |
| Status    | A text word plus a shape; never colour alone                                  |

Symbol set, used sparingly: registration cross, corner brackets, arrows drawn from straight strokes, a blinking block cursor on one live value. Decorative symbols are hidden from assistive tech.

Interactive states still apply. Focus is a 2 px signal-colour outline with 2 px offset; hover is inversion; pressed shifts the element 1 px; disabled uses a diagonal hatch plus the disabled attribute.

## 6. Texture Effects

Apply as overlays with `pointer-events: none`. Each is optional. Use two at most.

### Scanlines

```css
.scanlines::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    rgb(0 0 0 / 0.18) 2px 3px
  );
  mix-blend-mode: multiply;
}
```

### Phosphor glow

Apply a soft `text-shadow` in the phosphor colour to a few key figures only. Glow on body text destroys legibility.

### Grain and halftone

A small tiling noise image at 4 to 8 percent opacity for print. A radial-gradient dot pattern for halftone blocks behind large type.

### Flicker

One element may flicker on load for under 600 ms. Continuous flicker is banned: it is a seizure and distraction risk. Remove all flicker under reduced motion.

## 7. Engineering Directives

- Motion is mechanical: steps, hard cuts, and short linear moves. Use `steps()` timing for counters and reveals. No springs, no easing flourishes.
- Durations stay under 200 ms except for one typed or counted intro.
- Numbers that update use tabular numerals so they do not shift.
- Overlays are fixed layers, never per-element filters.
- Lay out with grid. Avoid absolute positioning for anything that holds text.
- At mobile widths, keep the rules and drop the columns: a single column of full-width ruled cells.

## 8. Checklist

- One archetype, one signal colour.
- Radius 0 everywhere; rules visible and not doubled.
- Macro headline line-broken by hand.
- Mono micro type used for metadata only; task text at 14 px or more.
- Status never by colour alone.
- Two texture overlays at most, none continuous under reduced motion.
- Focus outline visible in the signal colour.

## 9. On Other Platforms

| Element            | iOS and macOS                               | Android                                    | Flutter                               | Windows                                |
| ------------------ | ------------------------------------------- | ------------------------------------------ | ------------------------------------- | -------------------------------------- |
| Zero radius        | `Rectangle` shapes, custom button styles    | `RectangleShape` in the shape scheme       | `BorderRadius.zero` in theme shapes   | `CornerRadius="0"` in control styles   |
| Visible grid rules | 1 pt dividers and overlay borders           | `Divider` and 1 dp borders                 | `Border` on containers, `Divider`     | 1 epx `Border` strokes                 |
| Macro type         | Heavy custom display font, tight tracking   | Display roles with a heavy custom font     | Display styles with negative letter spacing | Title styles with a heavy custom font |
| Micro type         | Monospaced design of the system font        | Monospace family in label roles            | Monospace `TextStyle`                 | Monospace font family resource         |
| Inversion on press | Custom `ButtonStyle` swapping fill and ink  | Custom interaction colours                 | `ButtonStyle` with state-resolved colours | Visual states swapping brushes      |
| Scanlines, grain   | One overlay image, non-interactive          | One overlay drawn in a `Canvas`            | One `IgnorePointer` overlay           | One overlay image, hit-test off        |

Keep: one archetype, two colours plus the signal, the visible grid, hand-broken headlines.

Guard: the 11 px metadata size is not readable on phones. Use the platform's caption style (12 pt or 12 sp) as the floor, let it scale with the system text size, and keep task text at the body size. Replace flicker and scanline animation with static overlays when reduce-motion is on.
