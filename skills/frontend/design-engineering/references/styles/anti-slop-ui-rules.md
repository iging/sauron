# Anti-Slop Design Calibration

Depth reference for `02-styles/anti-slop-ui-builder`. The skill owns the workflow. This file owns the specifics: what to read in a brief, what each dial value changes, the hard rules, and the catalogue of machine-default tells with their replacements.

Line-level compliance (labels, focus, forms, hydration) is not repeated here. It lives in `../audit/ui-code-linter-rules.md`.

## 0. Load With This File

The foundation files hold the house defaults. Load `../foundations/README.md` first; it lists every file and where each rule lives. This file adds the judgement on top.

- `../foundations/design-tokens-sheet.md`
- `../foundations/layout-and-spacing-system.md`
- `../foundations/type-system.md`
- `../foundations/colour-system.md`
- `../foundations/surface-and-depth-system.md`
- `../foundations/icon-and-image-system.md`
- `../foundations/component-specs.md`
- `../foundations/motion-basics.md`
- `../foundations/ux-copy-guide.md`
- `../foundations/accessibility-baseline.md`
- `../foundations/platform-adaptation.md`
- `../foundations/platform-code-examples.md`

## 1. Design Read

Read seven signals before choosing anything visual.

| Signal           | Look for                                               | It decides                                  |
| ---------------- | ------------------------------------------------------ | ------------------------------------------- |
| Page job         | Sell, explain, onboard, operate, document              | Section order and density                   |
| Audience         | Trade customer, developer, executive buyer, consumer   | Vocabulary, type size, proof style          |
| Brand maturity   | Existing logo, palette, tone, or nothing yet           | Whether to extend a system or found one     |
| Content on hand  | Real copy, real photos, real numbers, or none          | Imagery strategy and how much copy to write |
| Named reference  | A site, brand, or style the user points at             | Starting preset or token pack               |
| Target platform | Web, iOS, Android, desktop app, or business system | Units, navigation, sizes: see `../foundations/platform-adaptation.md` |
| Stack and limits | Framework, plain HTML, motion library allowed, hosting | What motion and components are possible     |

Emit one sentence before any code, in this shape:

> Design Read: [page job] for [audience], [brand maturity], leaning [direction], because [one reason from the brief].

Ask one question, and only one, when two readings would produce visibly different pages (for example "luxury" against "budget friendly" for the same business). Never ask about anything a sensible default covers.

**Anti-default rule.** After the read, name the first idea that came to mind and reject it if it would fit any other business in the same category. Keep it only when the brief itself asks for the conventional answer.

## 2. The Three Dials

Each dial runs 1 to 10. Record all three numbers with the Design Read.

### DESIGN_VARIANCE: how far layout departs from the expected grid

| Band | Layout behaviour                                                                | Typical use                        |
| ---- | ------------------------------------------------------------------------------- | ---------------------------------- |
| 1-3  | Symmetric, centred or strict 12-column, predictable section order               | Government, banking, documentation |
| 4-6  | One asymmetric split per page, offset grids, a single oversized element         | SaaS, local services, clinics      |
| 7-8  | Broken grid, overlap, mixed column counts between sections, type as image       | Portfolio, agency, fashion         |
| 9-10 | Experimental navigation, non-rectangular regions, layout that changes on scroll | Art, launch microsites             |

### MOTION_INTENSITY: how much the page moves

| Band | Motion behaviour                                           | Budget                               |
| ---- | ---------------------------------------------------------- | ------------------------------------ |
| 1-3  | State transitions only: hover, press, focus, disclosure    | 150 to 200 ms, no scroll effects     |
| 4-6  | One entrance per section, one signature moment on the page | 240 to 600 ms, transform and opacity |
| 7-8  | Scroll-linked sequences, pinned sections, staggered groups | One pinned sequence per page         |
| 9-10 | Continuous choreography, page transitions, canvas or WebGL | Requires a reduced-motion variant    |

### VISUAL_DENSITY: how much sits in one viewport

| Band | Density behaviour                                       | Spacing                             |
| ---- | ------------------------------------------------------- | ----------------------------------- |
| 1-3  | One idea per viewport, large type, wide margins         | Section padding 96 to 160 px        |
| 4-6  | Two or three grouped ideas per viewport, cards with air | Section padding 64 to 96 px         |
| 7-8  | Tables, multi-column lists, compact cards, smaller type | Section padding 32 to 64 px         |
| 9-10 | Console layouts, split panes, data first                | 4 and 8 px rhythm, 13 to 14 px body |

### Starting presets

| Brief                           | Variance | Motion | Density |
| ------------------------------- | -------- | ------ | ------- |
| Local trade or service business | 4        | 3      | 4       |
| B2B SaaS landing                | 5        | 5      | 5       |
| Developer tool                  | 4        | 4      | 6       |
| Personal portfolio              | 7        | 6      | 3       |
| Creative agency                 | 8        | 8      | 3       |
| Luxury or hospitality           | 6        | 5      | 2       |
| Online shop                     | 4        | 4      | 6       |
| Editorial or blog               | 5        | 2      | 4       |
| Internal dashboard              | 2        | 2      | 8       |
| Public sector or healthcare     | 2        | 1      | 4       |

Move a dial by at most 2 from the preset without a reason from the brief. State the reason when you move further.

## 3. Typography

Sizing, weights, line height, tracking, and line clamping follow `../foundations/type-system.md`. Load it with this file. The points below cover choice and character.

- Pick the display face for the subject, then say why in one clause. A slab for a builder, a high-contrast serif for a law firm, a grotesque for a logistics tool. "It is the default" is not a reason.
- Two families at most, plus a mono only when code or figures need it.
- Use a modular scale and stay on it. Ratio 1.2 for dense interfaces, 1.25 for marketing pages, 1.333 for editorial and display-led pages.
- Body text 16 px minimum on mobile, 17 to 18 px on marketing pages. Line height 1.5 to 1.7 for body, 1.0 to 1.15 for display.
- Measure 60 to 72 characters for body copy. Constrain it with `max-inline-size` in `ch`.
- Tighten tracking on large display type (about -0.02em at 48 px and up). Open tracking on small uppercase labels (0.08 to 0.14em).
- The page title should survive at 320 px wide without a mid-word break and without dropping below 32 px.
- Hierarchy must read with colour removed. If size and weight alone do not separate three levels, fix that before touching colour.

## 4. Colour

- One accent. A second hue is allowed only for semantic states (success, warning, danger).
- Tint the neutrals toward the accent hue. Pure grey beside a warm accent looks unrelated.
- Never pure black on pure white. Use an ink near 15 percent lightness and a canvas with a trace of the accent hue.
- Area split near 60 canvas, 30 surface and ink, 10 accent. If the accent covers more than a tenth of the page it stops reading as an accent.
- Define colours as a ramp in a perceptual space (OKLCH), then map semantic roles to ramp steps. Follow `skills/quality/design-tokens/SKILL.md` for the tier rules.
- Check every text and surface pair: 4.5 to 1 for body text, 3 to 1 for large text and for the boundary of controls.
- Gradients need a job: depth on a surface, direction toward an action, or atmosphere behind a hero. A gradient applied to text, or a two-hue diagonal behind every section, has no job.

## 5. Layout Hard Rules

Failing any of these means the page is not finished.

1. The first viewport shows the headline, one sentence of support, and the primary action without scrolling, at 320, 768, and 1440 wide.
2. The headline is at most 3 lines on desktop and 4 on mobile.
3. One primary action per viewport. A secondary action must look secondary.
4. No horizontal scroll at any width from 320 up.
5. Consecutive sections do not share the same layout. Alternate alignment, column count, or surface.
6. A row of equal cards is a choice, not a default. If the items differ in importance, their size differs too.
7. Cards in one row share a height. Media in one grid shares an aspect ratio.
8. Text never sits on an image without a guaranteed contrast layer.
9. Sticky and fixed layers never cover content or focus. Offset anchor scrolling by the header height.
10. Spacing comes from the scale. No one-off pixel values.

## 6. Surfaces, Shadows, Cards

- Choose one depth language for the page: borders, or shadows, or surface tint. Mixing all three on one card reads as indecision.
- Tint shadows with the ink hue at low alpha. Neutral black shadows look pasted on over a tinted canvas.
- Radius comes from a three-step scale (control, card, container). Nested radii shrink by the padding between them.
- A card must earn its box. If removing the border and background loses nothing, it was a list item.
- Never nest a card inside a card inside a card. Two levels at most.

## 7. States

Every interactive component defines six states: default, hover, pressed, focus-visible, disabled, and busy. Every async region defines four: loading, empty, error, success. Design the empty and error states with the same care as the happy path; they are often the first thing a new user sees.

## 8. Content

- Write real copy in the client's own vocabulary. Lift phrases from their existing material when it exists.
- Never invent proof. Reviews, client logos, counts, years in business, and awards come from the client or are left as a marked slot: `[PLACEHOLDER: three customer reviews]`.
- Sample names, places, and prices must be plausible for the locale. No "John Doe", no "Acme", no round figures like 10,000 users.
- Headings state a benefit or a fact. A heading that could sit above any section ("Our Features", "Why Choose Us") is filler.
- Buttons name their outcome. "Get a free quote" beats "Submit".
- Icons are drawn glyphs from one set. Emoji are not icons.
- Density of copy follows the density dial. At low density, cut every sentence that repeats the heading.

## 9. Imagery Strategy

Use the highest rung available.

1. Real client assets, optimised and sized.
2. A drawn motif from the subject's own world, built in SVG or CSS (a bond pattern for a bricklayer, a waveform for a studio).
3. A labelled slot with a reserved aspect ratio and a caption that says what goes there.

Never hotlink stock photography. Never ship an image of generic people shaking hands. Every image has intrinsic dimensions, a format suited to its content, and a lazy flag when below the fold.

## 10. Theme Lock

Pick the page theme once: light, dark, or both through tokens. A page that is light in the hero, dark in features, and light again needs a stated rhythm (alternating bands with a consistent pair of surfaces), not accident. When both themes ship, test both before finishing and declare `color-scheme`.

## 11. Motion by Dial

- At every dial value: transform and opacity only, a reduced-motion branch, and no animation that blocks input.
- Easing: ease-out for entrances, ease-in for exits, a spring or soft overshoot only for physical objects (drawers, toggles, cards being moved).
- One signature moment per page. If everything animates, nothing is the signature.
- Full motion standards live in `../motion/animation-standards.md`. Craft rationale lives in `../motion/high-craft-principles.md`.

Forbidden at any dial value:

- Entrance animation on every element of a section in the same style.
- Looping decoration (bounce, pulse, float) on anything that is not a loading indicator.
- Scroll hijacking that changes how far one wheel tick travels.
- Parallax on text.
- Cursor replacement without a pointer-fine guard and a keyboard-equivalent state.

## 12. Performance Guardrails

| Budget                    | Target                      |
| ------------------------- | --------------------------- |
| Largest Contentful Paint  | under 2.5 s on mid-tier 4G  |
| Cumulative Layout Shift   | under 0.1                   |
| Interaction to Next Paint | under 200 ms                |
| Web font files            | 2 families, 4 files at most |
| Stacking layers           | a named z-index scale of 5  |

Blur and backdrop filters are expensive. Limit them to small, fixed layers and never animate their radius.

## 13. Machine-Default Tells

Each tell has a replacement. Remove the tell and apply the replacement; do not just delete.

### Visual

| Tell                                   | Replace with                                                  |
| -------------------------------------- | ------------------------------------------------------------- |
| Violet-to-blue gradient as the brand   | One accent taken from the subject's world                     |
| Gradient-filled headline text          | Solid ink, with emphasis by weight or by accent on one phrase |
| Glowing blobs behind the hero          | A subject motif or a plain confident surface                  |
| Glass cards on a busy gradient         | Opaque surfaces with one depth language                       |
| Identical soft shadow on every element | Depth only where something actually floats                    |
| Every corner at the same large radius  | A three-step radius scale                                     |

### Typography

| Tell                                                       | Replace with                                      |
| ---------------------------------------------------------- | ------------------------------------------------- |
| The same neutral sans for display and body with no reason  | A display face chosen for the subject             |
| Tiny uppercase eyebrow above every heading                 | Eyebrows only where they add information          |
| Centred paragraph text wider than 70 characters            | Left-aligned copy on a 60 to 72 character measure |
| Headline that wraps to five short lines in a narrow column | A wider container or a shorter headline           |

### Layout

| Tell                                                       | Replace with                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| Hero, three equal cards, testimonial strip, call to action | A section order derived from the page job                     |
| Everything centred                                         | A dominant alignment with deliberate exceptions               |
| Bento grid used because it is fashionable                  | A grid whose cell sizes follow content importance             |
| Sections separated only by more white space                | Surface, alignment, or density changes that mark each section |
| Stat row of four round numbers                             | Real figures, or no stat row                                  |

### Content

| Tell                                                | Replace with                                |
| --------------------------------------------------- | ------------------------------------------- |
| "Elevate", "seamless", "unleash", "next-generation" | Plain statements of what the business does  |
| Invented testimonials with stock avatars            | Real quotes or a marked placeholder         |
| Three-word benefit headings in a triplet            | One specific claim with evidence            |
| Emoji as bullets or icons                           | One icon set, or plain list markers         |
| Long dash characters in copy                        | Commas, periods, or a restructured sentence |

### Components and resources

| Tell                                               | Replace with                                                  |
| -------------------------------------------------- | ------------------------------------------------------------- |
| A component library's default theme left untouched | Tokens overridden to the page palette, radius, and type       |
| Imports of packages that were never checked        | Confirm each dependency exists in the project before using it |
| Hotlinked placeholder images                       | The imagery ladder in Section 9                               |

## 14. Pre-Flight Checklist

1. Design Read and three dial values are written down.
2. The display face has a stated reason.
3. One accent; neutrals tinted toward it.
4. Contrast checked for every text and surface pair.
5. First viewport passes Layout Rule 1 at three widths.
6. No two consecutive sections share a layout.
7. Six component states and four async states exist.
8. No invented proof; placeholders are marked.
9. Imagery follows the ladder, with reserved dimensions.
10. Motion uses transform and opacity, with a reduced-motion branch.
11. One signature moment, not many.
12. No row from the tells tables remains.
13. No horizontal scroll from 320 px up.
14. Output is complete: no truncated blocks, no "rest of code here".

## 15. Pattern Vocabulary

Shared names so a brief and an implementation mean the same thing.

- **Split hero:** copy on one side, media on the other, unequal columns.
- **Poster hero:** type fills the viewport and acts as the image.
- **Stacked hero:** full-bleed media with copy overlaid on a contrast layer.
- **Running-bond grid:** rows offset by half a cell, like brickwork.
- **Feature ladder:** alternating media and copy rows stepping down the page.
- **Proof band:** a slim strip of facts or logos between two heavier sections.
- **Pinned sequence:** a section held in place while its content advances on scroll.
- **Sticky stack:** cards that pin and overlap as the next one arrives.
- **Marquee:** a horizontally looping strip; needs a pause control past 5 seconds.
- **Island nav:** a floating, rounded navigation bar detached from the page edge.
- **Disclosure nav:** a menu that overlays the page instead of pushing content.
- **Call bar:** a fixed mobile strip holding the two most valuable actions.

## 16. On Other Platforms

Sections 1 to 15 use web vocabulary. The judgement transfers; these are the substitutions.

| Web concept                 | App equivalent                                                              |
| --------------------------- | --------------------------------------------------------------------------- |
| First viewport and hero     | The first screen: one purpose, one primary action, in the top third and thumb zone |
| Section rhythm              | Screen-to-screen variety: list, detail, form, and media screens differ      |
| Header navigation           | Tab bar, navigation rail, or sidebar per `../foundations/platform-adaptation.md` |
| Breakpoint checks           | The size set for the target, at the largest system text size                |
| Fluid `clamp()` type        | Platform text styles that follow the system text setting                    |
| Hover effects               | Pressed states on touch; hover only on pointer devices                      |
| Scroll-linked sequences     | Platform navigation transitions and shared-element moves                    |
| Core Web Vitals             | Launch time, frame rate while scrolling, input latency                      |

Machine-default tells in apps:

| Tell                                                        | Replace with                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| A web page layout squeezed into a phone frame               | Native navigation and list patterns                            |
| Four stat cards in a grid on the home screen                | The one thing the user came to do, first                       |
| Custom-drawn controls that mimic another platform           | The platform's own components, themed                          |
| A hamburger menu as the only navigation on a phone          | A tab bar or navigation bar with three to five destinations    |
| Gradient cards and glow on every surface                    | The platform's elevation or material language                  |
| Fixed font sizes that ignore the system setting             | Text styles that scale                                         |
| A desktop app that is one centred column with huge margins  | Panes, a sidebar, and density suited to a pointer              |
| "Welcome back, User" with invented data                     | Realistic content, or a designed empty state                   |

The dials still apply. Density runs higher on desktop and in business systems; motion runs lower.
