# Surface and Depth System

Default rules for corner radius, borders, shadows, elevation, overlays, and blur: everything that gives a surface its shape and its height above the page.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

Colour lives in `colour-system.md`. Component sizes live in `component-specs.md`.

## 1. Pick One Depth Language

A page separates surfaces in one of three ways. Choose one as the main language and use the others only where stated.

| Language     | How surfaces separate                    | Suits                                        |
| ------------ | ---------------------------------------- | -------------------------------------------- |
| Borders      | 1 px hairlines, no shadow                | Dense tools, minimal and editorial styles    |
| Surface tint | Each level is a different surface colour | Warm brand sites, dark themes                |
| Shadow       | Soft shadows under raised surfaces       | Friendly consumer products, card-led layouts |

Rules:

1. A resting card uses the main language only. A border plus a tint plus a shadow on one card reads as indecision.
2. Layers that float above the page (menus, dialogs, toasts) always get a shadow, whatever the main language is, because they must separate from anything beneath them.
3. In a dark theme, height is shown by lighter surfaces. Shadows barely register on dark.

## 2. Radius

### Scale

```css
:root {
  --radius-tag: 0.25rem; /* 4px: tags, badges, small chips */
  --radius-control: 0.5rem; /* 8px: buttons, inputs, menu items */
  --radius-card: 0.75rem; /* 12px: cards, panels, images */
  --radius-container: 1rem; /* 16px: sections, dialogs, hero media */
  --radius-pill: 999px; /* avatars, status dots, pills when the style uses them */
}
```

### Shape personality

Radius is a brand decision. Pick one row and keep it across the product.

| Personality | Tag | Control | Card | Container | Reads as                       |
| ----------- | --- | ------- | ---- | --------- | ------------------------------ |
| Sharp       | 0   | 0       | 0    | 0         | Technical, editorial, brutal   |
| Crisp       | 2   | 4       | 6    | 8         | Precise, professional, dense   |
| Soft        | 4   | 8       | 12   | 16        | Friendly, modern (the default) |
| Round       | 8   | 12      | 20   | 28        | Playful, consumer, soft        |

### Rules

1. **Size follows the element.** Small things get small radii. A 24 px radius on a 32 px button turns it into a pill by accident.
2. **Nested radius.** Inner radius equals outer radius minus the gap between them. A 16 px container with 8 px padding holds 8 px children. Equal radii on parent and child make the corner gap look swollen.
3. **One personality.** Do not mix sharp cards with round buttons unless the style defines that contrast on purpose.
4. **Clip the contents.** A rounded card with an image on top needs `overflow: hidden` (or the image takes the top radii), or the image corners poke out.
5. **Edge-attached surfaces round only free corners.** A bottom sheet rounds its top corners. A menu attached to a button may square the joined corner.
6. **Pills are deliberate.** Use the pill radius for avatars, status dots, and chips. Use it for buttons only when the style calls for it.
7. **Full-bleed sections have no radius.** A band that touches both screen edges is square.

## 3. Borders

```css
:root {
  --border-hairline: 1px solid var(--color-hairline);
  --border-control: 1.5px solid var(--color-border-control);
  --border-strong: 2px solid var(--color-text-strong);
}
```

| Use                           | Token               | Note                                   |
| ----------------------------- | ------------------- | -------------------------------------- |
| Card edge, divider, table row | `--border-hairline` | Decorative: may be low contrast        |
| Input, select, checkbox       | `--border-control`  | Functional: 3 to 1 against the surface |
| Emphasis, secondary button    | `--border-strong`   | Use sparingly                          |

Rules:

1. A divider is a last resort. Try space first; add a line only when space alone does not separate.
2. Adjacent bordered cells share one line. Do not double borders; collapse them or draw on two sides only.
3. An accent edge (a coloured top or leading border on a card) is one signature device. Use it on one component type, not everywhere.
4. Error and focus change the border colour and width, and never rely on colour alone.
5. Borders are part of the box. Use `box-sizing: border-box` so a thicker state border does not shift layout; or reserve the width with a transparent border.

## 4. Shadows and Elevation

### Levels

```css
:root {
  --shadow-color: 30 20% 12%; /* hue and tone taken from the ink, as HSL parts */

  --shadow-1:
    0 1px 2px hsl(var(--shadow-color) / 0.06),
    0 1px 1px hsl(var(--shadow-color) / 0.04);
  --shadow-2:
    0 2px 4px hsl(var(--shadow-color) / 0.06),
    0 4px 8px hsl(var(--shadow-color) / 0.06);
  --shadow-3:
    0 4px 8px hsl(var(--shadow-color) / 0.06),
    0 12px 24px hsl(var(--shadow-color) / 0.1);
  --shadow-4:
    0 8px 16px hsl(var(--shadow-color) / 0.08),
    0 24px 48px hsl(var(--shadow-color) / 0.14);
}
```

| Level | Token        | What sits here                                                     |
| ----- | ------------ | ------------------------------------------------------------------ |
| 0     | none         | Page, sections, resting cards in border or tint languages          |
| 1     | `--shadow-1` | Resting cards in the shadow language, sticky headers once scrolled |
| 2     | `--shadow-2` | Hovered cards, dropdowns, popovers, tooltips                       |
| 3     | `--shadow-3` | Dialogs, drawers, floating action buttons                          |
| 4     | `--shadow-4` | Toasts, dragged items                                              |

### Rules

1. **One light source.** Every shadow falls the same way: straight down or slightly down. Mixed directions look broken.
2. **Two layers per shadow.** A tight contact shadow plus a wide ambient one reads as real. A single blurry shadow reads as a glow.
3. **Tint the shadow.** Take the hue from the ink or the surface beneath. Neutral black looks pasted on over a warm or cool canvas.
4. **Height means blur and offset grow together, opacity stays low.** Higher is softer and wider, not darker.
5. **Shadows show height, not decoration.** If an element is not above something, it has no shadow.
6. **Hover raises by one level.** Never jump two.
7. **Pressed lowers.** A pressed control loses its shadow or drops a level.
8. **No shadow on text** except a subtle one to hold text over imagery, and prefer a solid layer there.
9. **Glow is a different thing.** A coloured glow is a style device for specific looks (glass, neon). It is never a default.
10. **Animate with care.** Transitioning `box-shadow` repaints. For hover lifts, cross-fade the opacity of a pre-drawn shadow layer or keep the change small.

### Dark theme

| Level | Light theme  | Dark theme                                               |
| ----- | ------------ | -------------------------------------------------------- |
| 0     | Canvas       | Canvas                                                   |
| 1     | `--shadow-1` | Surface one step lighter                                 |
| 2     | `--shadow-2` | Surface two steps lighter, hairline edge                 |
| 3     | `--shadow-3` | Surface two steps lighter, stronger edge, a faint shadow |

## 5. Overlays, Scrims, and Blur

```css
:root {
  --scrim: hsl(var(--shadow-color) / 0.5);
  --scrim-light: hsl(var(--shadow-color) / 0.3);
  --blur-surface: 12px;
}
```

- A dialog or drawer sits on a scrim that dims the page. The scrim closes the layer when clicked, unless the task is destructive.
- Text over an image needs a solid or gradient layer behind it that guarantees contrast at every image crop.
- Backdrop blur is expensive. Use it on at most three small layers in view, never full-screen, and never animate its radius.
- Opacity is not a colour system. Disabled states may lower opacity; hierarchy between text levels uses real ink colours.

## 6. Focus Rings

A focus ring is a depth cue for keyboard users and has the highest priority of all edge treatments.

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
```

- 2 to 3 px wide, offset 2 px, 3 to 1 against whatever is behind it.
- Follows the element's radius.
- Never removed without a replacement. Never hidden by `overflow: hidden` on a parent; give the parent padding or use an inset ring.
- On dark or coloured surfaces, switch the ring to a light colour.

## 7. On Other Platforms

| Concept       | iOS and macOS                                                           | Android (Material 3)                                                      | Flutter                                          | Windows (Fluent)                               |
| ------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Radius        | Continuous corners: `RoundedRectangle(cornerRadius:style: .continuous)` | Shape scheme: extra small 4, small 8, medium 12, large 16, extra large 28 | `BorderRadius` in theme shapes                   | `CornerRadius`: 4 for controls, 8 for overlays |
| Nested radius | `ContainerRelativeShape` inside a container                             | Smaller shape token on the child                                          | Compute inner radius from the padding            | Smaller `CornerRadius` on the child            |
| Elevation     | Materials and subtle shadows; depth mostly by layering                  | Tonal elevation: higher surfaces take a tint, shadow is secondary         | `elevation` and `surfaceTintColor` on `Material` | Layering with Mica and Acrylic, `ThemeShadow`  |
| Hairline      | `Divider`, separator colour                                             | `HorizontalDivider`, outline variant colour                               | `Divider`                                        | 1 epx stroke brushes from theme resources      |
| Scrim         | Dimming view supplied by sheets and alerts                              | Scrim supplied by dialogs and sheets                                      | `ModalBarrier`, barrier colour                   | Smoke layer supplied by `ContentDialog`        |
| Focus ring    | System focus ring                                                       | Focus indication on components                                            | Focus highlight on Material widgets              | System focus visual                            |

Use the platform's own corner values and elevation model for system components. Apply the brand's shape personality to custom surfaces (cards, media, containers), and keep it close to the platform's range so the app does not look foreign.

## 8. Checklist

- One depth language chosen for resting surfaces.
- One shape personality; radius from the scale; nested radii computed.
- Rounded containers clip their contents.
- No doubled borders; dividers only where space fails.
- Shadows two-layered, tinted, one direction, from the four levels.
- Floating layers have a shadow in every theme and style.
- Dark theme shows height with lighter surfaces.
- Text over imagery has a guaranteed contrast layer.
- Focus ring visible on every surface colour and never clipped.
