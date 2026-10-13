# Web Comp Prompting

Depth reference for `05-image-to-code/web-page-image-prompts`. It defines how to write image-generation prompts that produce usable desktop landing page comps: the prompt anatomy, a variation engine, slicing rules, and the defects to exclude.

A comp is a design reference, not a deliverable. Its job is to give the build step something concrete to measure. `image-to-code-extraction.md` covers what happens next.

## 1. Output Rule

Produce one prompt per page section, not one prompt for the whole page. A single tall image of an entire site comes out blurry, with illegible text and collapsed spacing. Section-sized comps keep type readable and detail measurable.

State the frame in words every time: "desktop browser viewport, 16:9, straight-on, flat screenshot". Add a model-specific aspect flag (for example `--ar 16:9`) only when the target model is known to accept it.

## 2. Prompt Anatomy

Write each prompt in this order. Earlier slots carry more weight in most models.

| Slot | Content              | Example                                                 |
| ---- | -------------------- | ------------------------------------------------------- |
| 1    | Artifact and frame   | Desktop website hero section, flat UI screenshot, 16:9  |
| 2    | Subject and audience | For a family-run bricklaying business in Adelaide       |
| 3    | Composition          | Headline left on 7 columns, illustration right on 5     |
| 4    | Exact text           | Headline reads "Quality work. Built to last."           |
| 5    | Type character       | Bold slab serif headline, humanist sans body            |
| 6    | Palette and surface  | Warm cream background, terracotta accent, charcoal text |
| 7    | Components present   | One solid button, one outline button, slim top nav      |
| 8    | Imagery direction    | Flat vector brick wall under construction, no people    |
| 9    | Density and spacing  | Generous margins, one idea, large type                  |
| 10   | Exclusions           | No device frame, no perspective tilt, no gradient text  |

Quote the exact words you want rendered and keep them short. Image models garble long passages; give body copy as "two lines of small body text" unless the wording matters.

## 3. Brief to Direction

Before writing prompts, fix a direction in one line: page job, audience, and the single feeling the page should give. Then choose one row from each table below. Record the choices as the design bible (Section 9) so every section prompt uses the same ones.

### Theme

| Option       | Description                                           |
| ------------ | ----------------------------------------------------- |
| Light warm   | Cream or bone canvas, dark warm ink                   |
| Light cool   | Off-white with a blue-grey cast, crisp                |
| Dark         | Near-black canvas, light ink, one luminous accent     |
| Banded       | Alternating light and dark sections in a fixed rhythm |
| Colour field | A saturated brand colour as the main surface          |

### Background character

Plain confident surface, fine paper grain, soft mesh atmosphere, visible grid lines, or full-bleed photography with a contrast layer.

### Type character

Wide grotesque, geometric sans, high-contrast serif, slab serif, condensed uppercase, or mono-led technical.

### Hero architecture

Split with media right, split with media left, poster headline, stacked full-bleed, offset product panel, or index hero. Definitions are in `../styles/aida-landing-page-structure.md`.

### Section system

Feature ladder, gapless bento, numbered process, comparison table, tabbed panel, or annotated demo.

### Signature component

Pick one that recurs across sections: a double-bezel panel, a ruled table, a tag system, a numbered index, an island button, or a drawn subject motif.

### Composition anchor, per section

Left-weighted, right-weighted, centred poster, or edge-bleeding. Do not repeat the same anchor in consecutive sections.

### Call-to-action treatment

Solid button, button with icon chip, inline text link with arrow, or a full-width action band. One treatment per page.

## 4. Hero Rules

- The headline is the largest thing in the frame and takes 2 lines, 3 at most.
- One supporting sentence. One primary action, one optional secondary.
- The navigation is slim and holds five items or fewer.
- No floating badges, no stat chips, no avatar piles, no "trusted by" row inside the hero unless the brief supplies real proof.
- Leave real empty space. A hero filled edge to edge with small UI reads as clutter at build time.
- The headline column is wide enough that no line is one word.

Pre-output check for the hero prompt: could this exact prompt describe a competitor's site? If yes, slot 2 and slot 8 are too generic. Rewrite them with details from the brief.

## 5. Slicing and Continuity

| Page size | Prompts | Typical sections                                                              |
| --------- | ------- | ----------------------------------------------------------------------------- |
| Short     | 4       | Hero, services or features, proof, contact                                    |
| Standard  | 8       | Hero, proof band, features, process, showcase, pricing or scope, FAQ, contact |
| Long      | 12      | Standard plus story, comparison, team or about, secondary showcase            |

- Sections vary in height. A proof band is short; a showcase is tall. Say so in slot 1 ("short wide band", "tall section").
- Each prompt repeats the design bible line verbatim, so palette, type, radius, and component style match.
- Name what sits above and below ("follows a dark features section") so surfaces alternate on purpose.
- Regenerate a section rather than cropping a different image to fit. Cropped comps carry the wrong spacing.

## 6. Escalating Creativity

When a first set looks generic, change one of these, in order, and regenerate:

1. The subject motif (make it specific to the business).
2. The hero architecture.
3. The type character.
4. The theme.

Do not escalate by adding effects. Glow, glass, and 3D objects make comps look impressive and build badly.

## 7. Exclusions

Add these to slot 10 as needed.

- **Layout:** device frames, tilted or isometric perspective, multiple screens in one image, floating UI fragments with no page around them, three identical cards as the only structure.
- **Visual:** violet-to-blue gradients, glowing orbs, glass panels over busy backgrounds, heavy drop shadows, neon outlines, 3D blobs.
- **Type:** gradient text, more than two families, tiny unreadable body text, headline wrapped to five lines.
- **Content:** lorem ipsum, invented company logos, fake review stars, stock people, charts with meaningless data.
- **Density:** micro-labels on every element, badge clusters, decorative icons in every card, a marquee with no purpose.

## 8. Colour and Material

- Three colours and two neutrals at most. Name them by role: canvas, ink, accent.
- Give hex values when the brand has them; otherwise name the hue precisely ("terracotta", not "orange").
- A background image must leave a calm region for text, or sit under a solid contrast layer.
- One material language per page: flat, paper, glass, or metal. State it once in the bible.
- Gradients need a described purpose ("soft vertical fade from cream to sand behind the hero"). Otherwise exclude them.

## 9. Design Bible

One line, pasted at the top of every section prompt.

```text
BIBLE: [theme], [background character], [type character], canvas [colour], ink [colour], accent [colour],
radius [none / small / large], [material], signature component [name], CTA as [treatment].
```

## 10. Clarity Check

Run on every prompt before delivering.

1. Frame and aspect stated in words.
2. Exact headline text quoted, under 8 words per line.
3. One composition anchor named.
4. Palette named by role.
5. Components listed, five or fewer.
6. Imagery is specific to the subject.
7. Exclusions present.
8. Bible line matches the other sections.
9. No request the build step cannot honour (unlicensed fonts, impossible 3D).

## 11. Template

```text
BIBLE: Light warm, plain surface, slab serif display with humanist sans, canvas cream #FAF7F0,
ink charcoal #1F1B18, accent terracotta #A4482B, small radius, flat, signature drawn brick motif, CTA as solid button.

SECTION 1 OF 4, HERO. Desktop website hero section, flat UI screenshot, 16:9, straight-on.
For a bricklaying business in Adelaide. Headline on the left 7 columns reads "Quality work. Built to last."
in a bold slab serif, with one line of small body text below and two buttons: solid "Get a free quote",
outline "Call 0410 522 678". Slim top navigation with a small brick logo and four links.
Right 5 columns: a flat vector brick wall under construction with a string line and a spirit level.
Generous margins, large type, calm.
Exclude: device frame, perspective, gradients, people, badges, stat chips.
```

Deliver each section prompt in its own fenced block, numbered, with nothing between them but the section name.
