# Image to Code Extraction

Depth reference for `05-image-to-code/image-to-code-builder`. It defines how to turn a comp image into measured values and then into code that matches it, and how to stop the build drifting back to defaults.

Prompt writing for the comps themselves lives in `web-page-image-prompts.md` and `app-screen-image-prompts.md`.

## 1. Pipeline

| Stage | Name       | Output                                                      |
| ----- | ---------- | ----------------------------------------------------------- |
| 1     | Comp       | One image per section, from a shared design bible           |
| 2     | Analysis   | A filled worksheet per image (Section 3)                    |
| 3     | Tokens     | One token set reconciled across all worksheets              |
| 4     | Build      | Semantic markup and styles that consume only those tokens   |
| 5     | Comparison | A side-by-side check against each comp, with drift recorded |

Do not skip to stage 4. Code written from a glance at an image reverts to the model's habits within a few components.

## 2. Comp Rules

- Generate images first when the brief has no visual reference. Build from supplied designs when it has one.
- One section per image. Minimum set for a landing page is four; use eight for a standard page.
- If a section needs more detail (a complex card, a nav state), generate a closer image of that part. Do not enlarge a crop.
- If a comp is wrong, regenerate it. Never build from a comp you intend to "fix in code": the mismatch becomes drift.
- Keep every comp from the same bible so tokens reconcile.

## 3. Analysis Worksheet

Fill one per image before writing code. Record what is seen, not what is expected.

### Frame

| Field            | Record                                                    |
| ---------------- | --------------------------------------------------------- |
| Image size       | Width and height in pixels                                |
| Assumed viewport | The viewport width the comp represents (for example 1440) |
| Scale factor     | Image width divided by assumed viewport width             |

Every later measurement is taken in image pixels and divided by the scale factor.

### Text

List every string exactly as rendered, top to bottom. Mark any that the model garbled and write the intended text beside it. The build uses the intended text.

### Type

| Element | Height of capitals (px) | Derived font size | Weight | Family character | Line height | Tracking |
| ------- | ----------------------- | ----------------- | ------ | ---------------- | ----------- | -------- |

Derive font size as capital height divided by 0.7 for most sans faces and 0.66 for most serifs, then snap to the type scale. Identify the family by character (slab, grotesque, serif), then map it to a face the project can load.

### Spacing

| Measurement             | Image px | CSS px | Token |
| ----------------------- | -------- | ------ | ----- |
| Container side margin   |          |        |       |
| Section padding, top    |          |        |       |
| Section padding, bottom |          |        |       |
| Heading to body gap     |          |        |       |
| Body to action gap      |          |        |       |
| Grid gap                |          |        |       |
| Card padding            |          |        |       |

Snap each value to the nearest step on a 4 px scale and record the token. If two measurements differ by 2 px or less they are the same token.

### Colour

Sample from flat regions, away from edges and compression artefacts. Record canvas, each surface, each ink level, the accent, and borders. Check contrast for each text and surface pair and adjust the sampled ink if it fails; a comp is not evidence that contrast passes.

### Components

| Component | Width and height | Radius | Border | Fill | Label style | States visible |
| --------- | ---------------- | ------ | ------ | ---- | ----------- | -------------- |

A comp shows one state. Derive hover, pressed, focus, and disabled from the token set and the rules in `../styles/anti-slop-ui-rules.md`, Section 7.

### Layout

Record column count, the span of each block, alignment, and what is anchored to which edge. Sketch the grid as spans (for example "7 + 5", "4 + 4 + 4").

## 4. Reconciling Tokens

Across all worksheets:

- One canvas, one ink, one accent. If comps disagree, the hero wins.
- One type scale. List every derived size, cluster them, and keep five to seven steps.
- One spacing scale. Same method.
- One radius scale of three steps.
- Write the tokens once, in three tiers, following `skills/quality/design-tokens/SKILL.md`.

## 5. Build Rules

- Copy text from the worksheet's intended column. Do not rewrite it during the build.
- Use only tokens. A raw pixel or hex value in a component is drift.
- Build structure with semantic elements and grid, matching the recorded spans.
- Media sits in a frame with the comp's aspect ratio (`aspect-ratio` plus `object-fit: cover`), so replacing the image never changes layout.
- Reproduce decorative imagery from the comp as SVG or CSS when it is geometric; otherwise leave a labelled slot with the right ratio.
- Do not add elements the comp does not show: no extra badges, icons, gradients, or sections.
- Do not nest boxes the comp does not nest. A comp that shows text on the canvas does not get a card.

## 6. Anti-Drift

Drift is the build sliding toward generic defaults. Check for each cause.

| Drift                                          | Check                                                          |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Headline smaller than the comp                 | Compare derived size to the built size at the assumed viewport |
| Narrower headline column, extra line breaks    | Compare line count and break positions                         |
| Spacing collapsed to a uniform value           | Compare the three largest gaps                                 |
| Default font substituted                       | Confirm the loaded family matches the recorded character       |
| Radius and shadow reverted to library defaults | Compare each component against its worksheet row               |
| Extra wrappers and cards                       | Count nesting levels against the comp                          |
| Accent used more widely than in the comp       | Count accent-coloured elements                                 |

## 7. Missing Detail

A comp never shows everything. Resolve gaps in this order:

1. Another comp from the same bible that shows the detail.
2. The bible line itself.
3. The token set (derive, do not invent).
4. The project's existing design system.
5. A stated assumption, listed in the handoff.

## 8. Responsive First View

A desktop comp says nothing about small screens. Derive them deliberately:

- Keep the hierarchy: the same element is largest at every width.
- Stack split layouts with copy first, media second, unless the media is the message.
- Scale display type with `clamp()` between the mobile minimum and the comp's size.
- Keep section order. Reorder only cells inside a grid, by importance.
- The first viewport at 320 px still shows headline, one line of support, and the primary action.
- Check 320, 375, 425, 768, 1024, and 1440.

## 9. Comparison Pass

For each section, place the comp beside a screenshot of the build at the assumed viewport and check:

1. Same line breaks in the headline.
2. Same relative size between the three largest text elements.
3. Same column spans.
4. Same order of surfaces (light, dark, accent).
5. Same component shapes.
6. Largest gaps within 8 px of the measured values.
7. Nothing present in the build that is absent from the comp.

Record each difference as fixed or as a deliberate deviation with a reason.

## 10. Handoff Format

```text
EXTRACTION SUMMARY
Comps analysed: [n], assumed viewport [width]
Tokens: canvas [hex], ink [hex], accent [hex]; type scale [list]; spacing scale [list]; radius [list]
Fonts: [recorded character] mapped to [loaded family]
Assumptions: [list, or "none"]
Deviations from comp: [list with reasons, or "none"]
Not verified in a browser: [list, or "none"]
```
