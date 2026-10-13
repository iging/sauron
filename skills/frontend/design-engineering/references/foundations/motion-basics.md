# Motion Basics

The minimum motion rules every interface follows: what to animate, how long, with which curve, and when to turn it off. This is the foundation layer; the full standards live in `../motion/animation-standards.md`, and the per-platform API mapping lives in `../motion/motion-across-platforms.md`.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For other targets use `../motion/motion-across-platforms.md`.

## 1. Why Anything Moves

Motion earns its place by doing one of four jobs.

| Job        | Example                                                      |
| ---------- | ------------------------------------------------------------ |
| Feedback   | A button responds the instant it is pressed                  |
| Continuity | A panel slides from where it was opened                      |
| Attention  | One new item fades in so it is noticed                       |
| Character  | One signature moment that makes the product feel like itself |

If a motion does none of these, remove it.

## 2. Tokens

```css
:root {
  --dur-instant: 100ms; /* press, toggle, hover colour */
  --dur-fast: 150ms; /* small state changes, tooltips */
  --dur-base: 240ms; /* menus, disclosure, cards */
  --dur-slow: 400ms; /* sheets, dialogs, page-level entrances */
  --dur-signature: 600ms; /* the one hero moment */

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* entering, responding */
  --ease-in: cubic-bezier(0.4, 0, 1, 1); /* leaving */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* moving between two places */
}
```

| Situation                        | Duration                         | Easing          |
| -------------------------------- | -------------------------------- | --------------- |
| Hover, press, focus              | `--dur-instant`                  | `--ease-out`    |
| Tooltip, small toggle            | `--dur-fast`                     | `--ease-out`    |
| Menu, accordion, card change     | `--dur-base`                     | `--ease-out`    |
| Dialog, drawer, sheet in         | `--dur-slow`                     | `--ease-out`    |
| Anything leaving                 | About two thirds of its entrance | `--ease-in`     |
| Element moving across the screen | `--dur-base` to `--dur-slow`     | `--ease-in-out` |

Larger things and longer distances take longer. Exits are quicker than entrances. Nothing routine exceeds 400 ms.

## 3. Rules

1. **Animate transform and opacity.** Avoid animating width, height, top, left, margin, and large shadows or blurs.
2. **Name the properties.** Never `transition: all`.
3. **Respond instantly.** Feedback starts within 100 ms of the input.
4. **Stay interruptible.** A new input takes over mid-animation; nothing blocks interaction until it finishes.
5. **One entrance per section, one signature per screen.** If everything animates, nothing stands out.
6. **Stagger sparingly.** 60 to 90 ms between siblings, five items at most.
7. **No looping decoration.** Continuous motion is for progress indicators. Anything else that moves for more than 5 seconds needs a pause control.
8. **Match origin to cause.** A menu grows from its button; a dialog from the centre or its trigger.
9. **Hover is an enhancement.** Touch users never see it. No information or action lives only in a hover state.
10. **Less on desktop and in business systems.** People repeat those actions all day.

## 4. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    transition-duration: 0.01ms;
    scroll-behavior: auto;
  }
}
```

- Reduced motion removes movement, parallax, zoom, and auto-play. A short opacity fade may stay.
- Content revealed by animation must be visible without it. Scope "hidden until revealed" styles so a failed script or a reduced-motion setting still shows everything.
- Honour the system setting on every platform, not only in browsers.

## 5. Common Patterns

| Pattern          | Recipe                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| Button press     | Scale to 0.98 or shift 1 px, `--dur-instant`                                         |
| Card hover       | Lift 2 to 4 px and raise shadow one level, `--dur-fast`, pointer devices only        |
| Section entrance | Fade in and rise 16 to 24 px, `--dur-slow`, once                                     |
| Menu open        | Fade and scale from 0.96 at the trigger's corner, `--dur-base`                       |
| Dialog open      | Scrim fades, dialog fades and rises 8 px, `--dur-slow`                               |
| Accordion        | Animate grid rows from `0fr` to `1fr`, or fade content; never animate a fixed height |
| Skeleton         | Static, or a slow shimmer that stops under reduced motion                            |
| Toast            | Slide in from its edge, hold 4 to 6 seconds, fade out                                |

## 6. Checklist

- Every animation has one of the four jobs.
- Durations and easings from the tokens.
- Transform and opacity only; properties named.
- Interruptible; feedback within 100 ms.
- One signature moment per screen.
- Reduced-motion branch present and content visible without motion.
