# Ethereal Glass Agency Aesthetic

Depth reference for `02-styles/style-glass-agency`. It gives token tables for the three texture profiles, construction recipes for the signature components, and the performance limits that keep the look affordable.

## 1. Texture Profiles

Commit to one profile per project.

### Ethereal Glass (dark)

| Role       | Value                                                  | Note                                     |
| ---------- | ------------------------------------------------------ | ---------------------------------------- |
| Canvas     | `#050505` to `#0A0A0B`                                 | Near black, never pure                   |
| Surface    | white at 4 to 6 percent alpha                          | Layer over the canvas                    |
| Hairline   | white at 8 to 12 percent alpha                         | 1 px, the main structural line           |
| Ink        | `#F5F5F4`                                              | Body on dark                             |
| Ink muted  | white at 60 percent alpha                              | Check 4.5 to 1 against the real backdrop |
| Accent     | one saturated hue, used on under 5 percent of the page | Glow is allowed on the accent only       |
| Atmosphere | one mesh gradient, fixed, behind content               | Two or three soft colour fields          |

### Editorial Luxury (light)

| Role       | Value                                         | Note                          |
| ---------- | --------------------------------------------- | ----------------------------- |
| Canvas     | `#FDFBF7`                                     | Warm cream                    |
| Surface    | `#F6F1E8`                                     | One step darker               |
| Hairline   | ink at 12 percent alpha                       |                               |
| Ink        | `#1A1814`                                     | Warm near-black               |
| Accent     | a deep single hue (oxblood, forest, ink blue) | Used for links and one action |
| Atmosphere | fine paper grain at 3 to 5 percent opacity    | A static SVG noise layer      |
| Display    | variable serif, light to regular weight       | Large sizes, tight tracking   |

### Soft Structuralism (light, neutral)

| Role    | Value                                                                           | Note                                 |
| ------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| Canvas  | `#ECECEA` to `#F2F2F0`                                                          | Silver grey                          |
| Surface | `#FAFAF9`                                                                       | Raised panels                        |
| Shadow  | two layers: a tight contact shadow and a wide ambient one, both tinted with ink | No hard edges                        |
| Ink     | `#18181B`                                                                       |                                      |
| Accent  | one muted hue                                                                   | Appears on controls only             |
| Radius  | 20 to 28 px on containers                                                       | Nested radius shrinks by the padding |

## 2. Layout Archetypes

Pick one for the page.

- **Asymmetric bento.** Unequal cells on a 12-column grid, one hero cell at least twice the area of the next. Rows follow the gapless rules in `aida-landing-page-structure.md`.
- **Z-axis cascade.** Panels overlap with a consistent offset and depth order. Three depth levels at most. Each level changes shadow or blur, not both.
- **Editorial split.** A fixed heading column and a scrolling content column on desktop. On mobile it becomes a single column with the heading first.

Mobile fallback for all three: a single column in source order, full-width panels, and `min-block-size: 100dvh` only on the hero.

## 3. Signature Components

### Double bezel

A panel inside a panel. The outer shell is the frame; the inner core holds content. The narrow band between them reads as a machined edge.

```css
.bezel {
  padding: 6px;
  border-radius: 28px;
  background: color-mix(in oklab, white 5%, transparent);
  border: 1px solid color-mix(in oklab, white 10%, transparent);
}

.bezel__core {
  border-radius: 22px; /* outer radius minus the padding */
  background: color-mix(in oklab, white 3%, #0a0a0b);
  border: 1px solid color-mix(in oklab, white 8%, transparent);
  padding: clamp(1.25rem, 1rem + 1.5vw, 2rem);
}
```

Rules: the gap is 4 to 8 px, never wider. The inner radius equals the outer radius minus the gap. Use it on the two or three most important panels, not every card.

### Island button

A pill-shaped action with a nested circular icon chip at its trailing edge.

- Height 48 px. Label padding 20 px leading, 6 px trailing.
- The chip is a 36 px circle in a contrasting surface, holding an arrow.
- On hover, the chip's arrow translates 2 px along its direction. The pill does not grow.
- The whole pill is the hit target. The chip is decoration and is hidden from assistive tech.

### Hairline system

Structure comes from 1 px lines at low alpha, not from filled borders. Use a top highlight line (lighter) and a bottom shade line (darker) on raised dark panels to imply a light source from above. Keep the light direction the same across the page.

## 4. Spatial Rhythm

- Section padding is large and uneven on purpose: more above a heading than below it, so the heading belongs to what follows.
- Pair one very large element with small precise labels. The tension between scales is the look; mid-sized everything kills it.
- Margins at the container edge stay generous (at least 24 px on mobile, 64 px on desktop).

## 5. Motion Choreography

### Easing

Use one expressive curve for entrances and layout shifts: `cubic-bezier(0.16, 1, 0.3, 1)`. Durations 400 to 700 ms for large panels, 200 to 300 ms for controls. List the animated properties explicitly; never animate `all`.

```css
.panel {
  transition:
    transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Floating island navigation

- The nav is a rounded bar detached from the top edge by 12 to 16 px, centred, with a blurred translucent surface.
- On scroll down it may shrink its padding slightly. It never disappears completely on desktop.
- The mobile menu expands from the island itself as an overlay. It must not push page content. Trap focus inside while open, close on Escape, and return focus to the toggle.

### Magnetic hover

```js
const strength = 0.25;
const limit = 8;

/**
 * Pulls an element a few pixels toward the pointer and springs it back on leave.
 * @param {HTMLElement} element
 * @returns {void}
 */
export function makeMagnetic(element) {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || calm.matches) return;

  element.addEventListener("pointermove", (event) => {
    const box = element.getBoundingClientRect();
    const dx = (event.clientX - (box.left + box.width / 2)) * strength;
    const dy = (event.clientY - (box.top + box.height / 2)) * strength;
    const clamp = (value) => Math.max(-limit, Math.min(limit, value));
    element.style.transform = `translate(${clamp(dx)}px, ${clamp(dy)}px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
}
```

Give the element a `transform` transition with the expressive curve so the return reads as a spring.

### Scroll entry

Panels rise 24 to 40 px and fade in once. Stagger siblings by 60 to 90 ms. Blur-in is allowed on one hero element only.

## 6. Performance Limits

- Backdrop blur on at most 3 elements in view, each small and not full-screen.
- Never animate blur radius, shadow spread, or gradient stops. Animate opacity of a pre-blurred layer instead.
- The atmosphere gradient is one fixed layer. It does not move with scroll.
- Grain is a single small tiling image or inline SVG filter at low opacity, with `pointer-events: none`.
- Test on a mid-range phone. If scrolling drops frames, remove blur before removing anything else.

## 7. Accessibility Counters

This aesthetic fails contrast easily. Guard against it.

- Translucent text is measured against the darkest and lightest backdrop it can sit on.
- Hairlines alone cannot mark an input. Inputs need a 3 to 1 boundary or a filled surface.
- Focus rings use the accent at full opacity, 2 px, offset 2 px. They must be visible on glass.
- Declare `color-scheme: dark` for the dark profile so native controls match.

## 8. Checklist

- One texture profile, one layout archetype.
- One accent, under 5 percent of the page.
- Double bezel on three panels at most; inner radius computed from the gap.
- Explicit transition properties, expressive curve, reduced-motion branch.
- Blur count within the limit.
- Contrast measured on real backdrops.
- Navigation overlay does not shift content.

## 9. On Other Platforms

| Element            | iOS and macOS                               | Android                                         | Flutter                                  | Windows                                  |
| ------------------ | ------------------------------------------- | ----------------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Translucent panel  | System materials (`.ultraThinMaterial`)     | Tonal surface; blur only on recent OS versions  | `BackdropFilter`, used sparingly         | Acrylic or Mica backdrop                 |
| Hairline           | 1 pt separator at low opacity               | Outline variant colour, 1 dp                    | `Border` at low alpha                    | 1 epx stroke from theme resources        |
| Double bezel       | Nested rounded rectangles, continuous corners | Nested `Surface` with shape tokens            | Nested `DecoratedBox`                    | Nested `Border` elements                 |
| Island navigation  | Floating tab bar or toolbar where the OS provides one | Floating toolbar or navigation bar    | Custom floating bar with safe-area padding | Not idiomatic; use a navigation view   |
| Atmosphere         | One static gradient behind content          | One static gradient                             | One static gradient                      | Mica already supplies it                 |

Keep: the dark canvas, the single accent, the generous spacing, the expressive entrance curve mapped through `../motion/motion-across-platforms.md`.

Drop: magnetic hover on touch devices, cursor effects, and any blur the platform cannot render at 60 frames per second on a mid-range device. Prefer the platform's own material to a hand-built blur.
