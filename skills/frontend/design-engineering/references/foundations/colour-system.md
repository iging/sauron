# Colour System

How to build a palette that holds together: perceptual ramps, semantic roles, a derived dark theme, state colours, and contrast proof. Token tier rules live in `skills/quality/design-tokens/SKILL.md`. Product-category palettes live in `../ui-design/tokens/colors.md`.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

## 1. Structure

Three tiers. Components read only the last one.

| Tier      | Example          | Rule                                         |
| --------- | ---------------- | -------------------------------------------- |
| Primitive | `--brick-600`    | Raw ramp steps. Never used in components.    |
| Semantic  | `--color-action` | A role. Points at a primitive.               |
| Component | `--btn-bg`       | A component slot. Points at a semantic role. |

A palette needs: one neutral ramp, one accent ramp, and three small semantic ramps (success, warning, danger). Add a second accent only with a stated reason.

## 2. Building a Ramp in OKLCH

OKLCH separates lightness, chroma, and hue, so steps look evenly spaced and one hue does not drift toward another.

```css
/* oklch(lightness chroma hue) */
--accent-600: oklch(0.49 0.13 37);
```

Recipe for an 11-step ramp:

| Step | Lightness | Chroma (share of peak) | Typical role                 |
| ---- | --------- | ---------------------- | ---------------------------- |
| 50   | 0.98      | 10 percent             | Tinted canvas                |
| 100  | 0.95      | 20 percent             | Subtle fill, hover on canvas |
| 200  | 0.90      | 35 percent             | Borders on tinted surfaces   |
| 300  | 0.82      | 55 percent             | Disabled accents             |
| 400  | 0.72      | 80 percent             | Decorative accents on dark   |
| 500  | 0.62      | 100 percent            | Accent on dark themes        |
| 600  | 0.52      | 100 percent            | Accent on light themes       |
| 700  | 0.43      | 90 percent             | Hover on the accent          |
| 800  | 0.34      | 75 percent             | Pressed on the accent        |
| 900  | 0.26      | 55 percent             | Text on tinted surfaces      |
| 950  | 0.18      | 35 percent             | Deepest ink                  |

1. Choose the hue from the subject. Keep it constant across the ramp, or shift it by at most 10 degrees toward warm at the dark end.
2. Choose the peak chroma: 0.10 to 0.14 for calm brands, 0.16 to 0.22 for loud ones. Stay inside the sRGB gamut; if a step clips, lower its chroma.
3. Fill the table. Adjust one step at a time only where contrast proof demands it.

**Neutrals.** Use the same recipe with the accent's hue and a peak chroma of 0.008 to 0.02. Tinted neutrals sit with the accent; pure grey fights it.

## 3. Semantic Roles

| Role                     | Light theme         | Dark theme  |
| ------------------------ | ------------------- | ----------- |
| `--color-canvas`         | neutral 50          | neutral 950 |
| `--color-surface`        | neutral 100         | neutral 900 |
| `--color-surface-raised` | white or neutral 50 | neutral 800 |
| `--color-hairline`       | neutral 200         | neutral 800 |
| `--color-border-control` | neutral 500         | neutral 500 |
| `--color-text-strong`    | neutral 950         | neutral 50  |
| `--color-text`           | neutral 800         | neutral 200 |
| `--color-text-muted`     | neutral 600         | neutral 400 |
| `--color-action`         | accent 600          | accent 500  |
| `--color-action-hover`   | accent 700          | accent 400  |
| `--color-action-pressed` | accent 800          | accent 300  |
| `--color-on-action`      | neutral 50          | neutral 950 |
| `--color-focus`          | accent 700          | accent 300  |
| `--color-success`        | success 700         | success 400 |
| `--color-warning`        | warning 700         | warning 400 |
| `--color-danger`         | danger 600          | danger 400  |

Area guide: about 60 percent canvas and surface, 30 percent ink, 10 percent accent. The accent marks actions and one emphasis per view.

## 4. Dark Theme

A dark theme is derived, not inverted.

- The canvas is near black with a trace of the hue (lightness 0.16 to 0.20), not `#000000`.
- Elevation gets lighter as it rises. Shadows barely show on dark; use surface steps.
- Lower the accent's chroma slightly and raise its lightness (step 500 or 400). A light-theme accent glows uncomfortably on dark.
- Body text is neutral 200, not pure white. Reserve neutral 50 for headings.
- Borders carry more of the structure than on light.
- Images and illustrations may need a dimmed or alternate version.
- Declare `color-scheme: light dark` (or the single scheme in use) on the root so native controls and scrollbars match.
- Set `theme-color` to the canvas of each scheme.

Ship one of: light only, dark only, or both through semantic tokens. A page that mixes light and dark sections uses a fixed pair of surfaces in a stated rhythm.

## 5. State Colours

| State         | Rule                                                           |
| ------------- | -------------------------------------------------------------- |
| Hover         | One ramp step toward more contrast                             |
| Pressed       | Two ramp steps toward more contrast                            |
| Focus-visible | A 2 to 3 px outline in `--color-focus`, offset 2 px, at 3 to 1 |
| Disabled      | Lower contrast plus the disabled attribute; never colour alone |
| Selected      | Surface tint plus a non-colour marker (check, weight, border)  |
| Error         | Danger border and text plus an icon and a message              |

Status is never signalled by colour alone. Pair it with a word, an icon, or a shape.

## 6. Contrast Proof

| Pair                                              | Minimum                       |
| ------------------------------------------------- | ----------------------------- |
| Body text on its surface                          | 4.5 to 1                      |
| Large text (24 px, or 19 px bold) on its surface  | 3 to 1                        |
| Control boundary or essential icon on its surface | 3 to 1                        |
| Focus indicator against adjacent colours          | 3 to 1                        |
| Placeholder text                                  | 4.5 to 1                      |
| Disabled controls                                 | exempt, but keep them legible |

Record the ratio for every text and surface pair in the project `DESIGN.md`. Check text over images against the lightest and darkest pixel it can cover, or put a solid layer behind it. White text on a mid-tone accent often fails: test it, and darken the accent or switch to dark text when it does.

## 7. Gradients and Imagery

- A gradient needs a job: depth on a surface, direction toward an action, or atmosphere behind a hero.
- Interpolate in a perceptual space (`linear-gradient(in oklch, ...)`) to avoid a grey band in the middle.
- No gradient on body text. No two-hue diagonal behind every section.
- Photography is graded to sit with the palette: warm neutrals want warm images.

## 8. Checklist

- Three tiers; components read semantic or component tokens only.
- One accent ramp, neutrals tinted to its hue.
- Light and dark role tables filled, or one theme stated.
- Hover, pressed, focus, disabled, selected, and error defined.
- Contrast recorded for every text and surface pair.
- No state signalled by colour alone.
- `color-scheme` and `theme-color` set.
