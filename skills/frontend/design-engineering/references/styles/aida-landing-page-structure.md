# AIDA Landing Structure

Depth reference for `02-styles/aida-landing-page-structure`. It defines the seed method, the job of each AIDA stage, hero and grid rules, and scroll choreography skeletons.

General anti-default rules live in `anti-slop-ui-rules.md`. Motion standards live in `../motion/animation-standards.md`.

## 1. Seeded Selection

Models repeat their favourite layout unless something forces a different pick. A seed derived from the brief forces it, and makes the pick reproducible.

**Compute the seed.** Count the characters in the user's brief. Add the number of words. The total is the seed. State it in the plan.

**Pick by remainder.** For each table below, take the seed modulo the number of rows and add 1. Use that row. If the brief names a requirement that the row violates, move down one row and say so.

### Hero architecture (6)

| #   | Architecture       | Shape                                                             |
| --- | ------------------ | ----------------------------------------------------------------- |
| 1   | Split, media right | 7 and 5 column split, copy left                                   |
| 2   | Split, media left  | 5 and 7 column split, copy right                                  |
| 3   | Poster             | Headline spans the full container, media sits below the fold line |
| 4   | Stacked            | Full-bleed media, copy bottom-left on a contrast layer            |
| 5   | Offset card        | Copy on canvas, product panel overlapping into the next section   |
| 6   | Index              | Headline left, a short numbered list of what follows on the right |

### Type stack (5)

| #   | Display character         | Body character    | Suits                       |
| --- | ------------------------- | ----------------- | --------------------------- |
| 1   | Wide grotesque, heavy     | Neutral grotesque | Product launches, tools     |
| 2   | Geometric sans, medium    | Humanist sans     | Consumer apps, services     |
| 3   | High-contrast serif       | Grotesque         | Finance, law, hospitality   |
| 4   | Slab serif, bold          | Humanist sans     | Trades, manufacturing, food |
| 5   | Condensed sans, uppercase | Mono for labels   | Sport, events, logistics    |

Name actual families only after checking they are available to the project. A stack is a character, not a brand name.

### Interest-stage structures (pick 3 by seed, seed + 1, seed + 2 modulo 7)

1. Gapless bento grid.
2. Feature ladder with alternating media.
3. Tabbed product panel.
4. Comparison table against the old way.
5. Numbered process strip.
6. Sticky side heading with scrolling detail cards.
7. Single large demo with annotated callouts.

### Scroll paradigm (pick 2 by seed and seed + 3 modulo 5)

1. Section entrance stagger.
2. Pinned sequence.
3. Horizontal pan inside a pinned section.
4. Sticky card stack.
5. Scrubbed media (progress tied to scroll).

## 2. The Four Stages

| Stage     | Job                                           | Sections                              | Budget           |
| --------- | --------------------------------------------- | ------------------------------------- | ---------------- |
| Attention | Say what it is and who it is for in 5 seconds | Hero, optional proof band             | 1 viewport       |
| Interest  | Show how it works and what is included        | Two or three of the picked structures | 2 to 4 viewports |
| Desire    | Remove doubt and make the result concrete     | Proof, outcome, pricing or scope, FAQ | 2 to 3 viewports |
| Action    | Make the next step trivial                    | Contact or signup, footer             | 1 viewport       |

Each stage ends by pointing at the action: a button, a link, or a visible path to the form. A reader who is convinced at stage two must not have to scroll to stage four.

Vertical rhythm: section padding steps down as the page goes on (for example 128, 96, 96, 64 px). The hero gets the most air. The closing action gets the least distance between heading and button.

## 3. Hero Rules

- Headline: 2 lines on desktop, 3 at most. If it needs more, the idea is not sharp yet.
- Supporting sentence: one, under 25 words, adding a fact the headline lacks.
- Actions: one primary, one optional secondary in a quieter style. Never three.
- Container: the headline column is wide enough that no line is a single word.
- Height: use `min-block-size: 100dvh` minus the header only when the content truly fills it. Otherwise let content set the height.
- Media: reserve its aspect ratio. The hero must not jump when the media arrives.
- The hero carries one proof point at most (a rating, a client count, a guarantee), and only if it is real.

## 4. Gapless Bento Grid

A bento grid is gapless when every row sums to the full column count and no cell is left empty at any breakpoint.

- Use a 12-column grid on desktop, 6 on tablet, 1 or 2 on mobile.
- Plan spans per row. Valid desktop rows: 8 + 4, 4 + 8, 6 + 6, 4 + 4 + 4, 7 + 5, 3 + 6 + 3.
- Vary row height with content, not with arbitrary pixel values. Two row heights are enough.
- The largest cell holds the most important claim. Size follows importance.
- Each cell has one job: a claim, a number, a demo fragment, or a quote. Never a heading plus paragraph plus button plus image in every cell.
- At the mobile breakpoint, order cells by importance, not by their desktop position.
- Do not use `grid-auto-flow: dense` to hide a planning gap. It reorders content away from source order and breaks keyboard and screen-reader sequence.

## 5. Scroll Choreography Skeletons

Load the motion library only when MOTION_INTENSITY is 6 or higher. Below that, use an IntersectionObserver entrance. Every skeleton sits inside a reduced-motion guard.

### Guard and setup

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const media = gsap.matchMedia();

media.add("(prefers-reduced-motion: no-preference)", () => {
  // Register every scroll effect inside this callback.
  // matchMedia reverts them when the preference changes.
});
```

### Section entrance stagger

```js
gsap.utils.toArray("[data-stagger]").forEach((group) => {
  gsap.from(group.children, {
    opacity: 0,
    y: 24,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: { trigger: group, start: "top 80%", once: true },
  });
});
```

### Pinned sequence

```js
const steps = gsap.utils.toArray("[data-pin-step]");

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: "[data-pin]",
    start: "top top",
    end: () => `+=${steps.length * window.innerHeight * 0.6}`,
    pin: true,
    scrub: 0.5,
    invalidateOnRefresh: true,
  },
});

steps.forEach((step, index) => {
  if (index === 0) return;
  timeline
    .to(steps[index - 1], { opacity: 0, y: -24, duration: 0.4 })
    .fromTo(
      step,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.4 },
      "<0.1",
    );
});
```

### Horizontal pan

```js
const track = document.querySelector("[data-pan-track]");
const distance = () => track.scrollWidth - window.innerWidth;

gsap.to(track, {
  x: () => -distance(),
  ease: "none",
  scrollTrigger: {
    trigger: "[data-pan]",
    start: "top top",
    end: () => `+=${distance()}`,
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
  },
});
```

Rules for all three:

- Pinned content must be reachable without the effect. In the reduced-motion branch, and on small screens, lay the steps out as a normal vertical list.
- One pinned section per page. Two make the page feel stuck.
- Keep pin distance under three viewport heights.
- Recalculate on resize (`invalidateOnRefresh`) and call `ScrollTrigger.refresh()` after fonts and images load.
- Kill triggers on route change in single-page apps.

## 6. Hover Physics

- Apply pointer effects only inside `@media (hover: hover) and (pointer: fine)`.
- Lift: translate by 2 to 4 px with a matching shadow change, 150 to 200 ms, ease-out.
- Magnetic pull: move the element at most 8 px toward the pointer, and return with a spring. Never move the hit area away from the pointer.
- Image reveal: scale the image inside a clipped frame from 1 to 1.04. Do not scale the frame.
- Every hover effect has a focus-visible equivalent.

## 7. Bans

- A hero headline longer than 3 desktop lines.
- A bento grid with an empty cell or a ragged last row.
- More than one pinned section.
- Scroll effects with no reduced-motion layout.
- Stage order rearranged for novelty (action before attention).
- Stock imagery and invented proof. Use the imagery ladder in `anti-slop-ui-rules.md`.

## 8. Design Plan Template

Emit this block before code.

```text
DESIGN PLAN
Seed: [number] (brief length [n] characters + [n] words)
Hero: [architecture name]
Type: [display character] with [body character]
Interest structures: [a], [b], [c]
Scroll paradigms: [a], [b]
Stages: Attention [sections] / Interest [sections] / Desire [sections] / Action [sections]
Bento rows (desktop): [for example 8+4, 4+4+4]
Overrides: [any row moved and why, or "none"]
```
