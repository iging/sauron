# Responsive Fix Playbook

Diagnosis and repair guide for `06-audit/responsive-layout-fixer`. Each entry maps a symptom seen at a check width to its usual root cause and the fix that removes the cause. The layout rules behind every fix are in `../foundations/layout-and-spacing-system.md`, Sections 4 and 8.

The six check widths are **320, 375, 425, 768, 1024, 1440**. A fix is finished only when all six pass again, because a repair at one width often breaks another.

## 1. Method

1. **Find the cause, not the pixel.** A symptom at 320 is usually a rule written for 1440. Fix the rule.
2. **Fix the narrowest failing width first.** Mobile-first rules flow upward; desktop patches do not flow down.
3. **Prefer one fluid rule to several breakpoint patches.** `minmax()`, `clamp()`, `flex-wrap`, and `auto-fill` remove whole classes of defect.
4. **Change the fewest lines that remove the cause.** Do not restyle.
5. **Re-check all six widths after every fix.**

## 2. Finding the Culprit for Sideways Scroll

Sideways scroll means one element is wider than the viewport. Find it before changing anything.

```js
const limit = document.documentElement.clientWidth;
const wide = [...document.querySelectorAll("*")]
  .map((el) => ({ el, right: el.getBoundingClientRect().right }))
  .filter(({ right }) => right > limit + 1)
  .sort((a, b) => b.right - a.right);
console.table(
  wide.slice(0, 5).map(({ el, right }) => ({
    node:
      el.tagName.toLowerCase() +
      (el.className ? "." + String(el.className).split(" ")[0] : ""),
    overflowBy: Math.round(right - limit),
  })),
);
```

The first row is usually a descendant of the real culprit. Walk up until the parent fits; the last element that does not fit is the one to fix.

## 3. Banned Fixes

These hide the symptom and keep the defect.

| Banned                                                    | Why                                                       |
| --------------------------------------------------------- | --------------------------------------------------------- |
| `overflow-x: hidden` on `html`, `body`, or a page wrapper | Clips content, breaks sticky positioning, hides the cause |
| Hiding content on small screens to make room              | Mobile users lose information desktop users get           |
| Shrinking body text below 16 px                           | Trades a layout defect for a readability defect           |
| `zoom`, `transform: scale()`, or viewport tricks to fit   | Breaks text scaling and tap targets                       |
| A new fixed width at each breakpoint                      | Fails at every width in between                           |
| `!important` to win over the broken rule                  | Leaves the broken rule in place                           |
| Disabling pinch zoom                                      | Accessibility failure                                     |
| Removing wrapping with `white-space: nowrap` on long text | Creates the overflow it was meant to cure                 |

Hiding is allowed only for duplicated controls (a call bar that repeats header actions) and for decorative elements.

## 4. Symptoms at 320, 375, 425 (phones)

| Symptom                                                | Usual cause                                                                                          | Fix                                                                                                                  |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Page scrolls sideways                                  | Fixed `width` or `min-width`; a grid track of bare `1fr` holding long content; an unwrapped flex row | Replace with `max-inline-size` or `min()`; use `minmax(0, 1fr)`; add `flex-wrap: wrap`                               |
| Text runs off the edge                                 | Long word, email, or URL with no break opportunity                                                   | `overflow-wrap: anywhere` on that element                                                                            |
| Text in a flex row does not truncate or wrap           | Flex child cannot shrink below its content                                                           | `min-inline-size: 0` on the child                                                                                    |
| Headline too big, breaks mid-word or one word per line | Fixed desktop font size; column too narrow                                                           | Fluid size with `clamp()` from `../foundations/type-system.md`; widen the column                                     |
| Two buttons side by side overflow or squash            | Row with no wrap and fixed padding                                                                   | `flex-wrap: wrap` with `flex: 1 1 100%` below 30rem                                                                  |
| Multi-column grid stays multi-column                   | Desktop-first columns with no mobile rule                                                            | Start single column; add columns at `min-width` breakpoints, or use `auto-fill` with `minmax(min(100%, 18rem), 1fr)` |
| Card content cramped against edges                     | Padding and gutter not fluid                                                                         | `clamp()` padding; gutter token                                                                                      |
| Image wider than the screen                            | No `max-inline-size: 100%`; fixed pixel width attribute styled as layout                             | Global `img { max-inline-size: 100%; block-size: auto; }`; frame with `aspect-ratio`                                 |
| Table breaks the layout                                | Table wider than the viewport                                                                        | Wrap in a focusable scroll region with a label, or reflow rows to cards                                              |
| Navigation links wrap into several rows                | Full nav shown before it fits                                                                        | Keep the menu button until the links fit on one row                                                                  |
| Opening the menu pushes the page down                  | Menu is in flow inside the header                                                                    | Position the menu as an overlay below the header                                                                     |
| Fixed bottom bar covers the last content               | No space reserved                                                                                    | Pad the page by the bar height plus the safe-area inset                                                              |
| Form inputs trigger zoom on focus                      | Input font size under 16 px                                                                          | Inputs at 16 px or more                                                                                              |
| Tap targets too small or too close                     | Desktop control sizes                                                                                | 44 px minimum height and 8 px gaps                                                                                   |
| Full-height hero cut off by browser bars               | `100vh`                                                                                              | `100dvh`, or let content set the height                                                                              |
| Only 320 fails                                         | A minimum width between 321 and 375 somewhere (button, input, chip row)                              | Find it with Section 2; let it shrink or wrap                                                                        |

## 5. Symptoms at 768 (tablet)

This width fails most often, because it is neither the phone layout nor the desktop one.

| Symptom                                                  | Usual cause                                      | Fix                                                                      |
| -------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| Navigation wraps under the logo                          | Desktop nav enabled at 768 with not enough room  | Move the nav breakpoint up to where it fits (often 56rem to 64rem)       |
| Three columns of very narrow cards                       | Desktop column count applied too early           | Two columns at this width; three from 64rem                              |
| One orphan card on the last row                          | Item count not divisible by the column count     | Let the last item span the row, or change the count at this width        |
| Split hero with a tiny headline column                   | 50/50 split applied too early                    | Stay stacked until 64rem, with media capped and centred                  |
| Huge empty margins around a narrow column                | Phone layout stretched with no intermediate rule | Add a two-column step or a wider container at this width                 |
| Mobile-only bar and desktop nav both visible, or neither | Two components using different breakpoints       | Use the same breakpoint value for both                                   |
| Hover-only controls unreachable                          | Tablet treated as a pointer device               | Do not gate actions on hover; use `(hover: hover)` for enhancements only |

## 6. Symptoms at 1024 and 1440 (laptop and desktop)

| Symptom                                | Usual cause                                       | Fix                                                        |
| -------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| Content stretches edge to edge at 1440 | No container limit                                | Container token: `min(100% - 2 * gutter, 75rem)`           |
| Lines of text far too long             | No measure on text blocks                         | `max-inline-size: 65ch`                                    |
| Layout tight at 1024 but fine at 1440  | Desktop rules tuned for wide screens only         | Reduce gaps or column count at 64rem; widen again at 80rem |
| Headline dwarfs the page at 1440       | Fluid size with no maximum                        | `clamp()` with a maximum in `rem`                          |
| Cards in a row at different heights    | Row items not stretched, or text clamped unevenly | Stretch the row; card as grid with `auto 1fr` rows         |
| Images blurry or upscaled              | Source smaller than the display size              | Supply a larger source or cap the frame                    |
| Large empty band beside a short column | Unequal content in an equal split                 | Use an unequal split (7 and 5) or align to the top         |
| Sticky header covers anchored headings | No scroll offset                                  | `scroll-padding-block-start` equal to the header height    |

## 7. Symptoms at Every Width

| Symptom                                | Usual cause                                   | Fix                                                        |
| -------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| Layout jumps while loading             | Images or embeds with no reserved space       | Intrinsic dimensions or `aspect-ratio`                     |
| Content invisible until a script runs  | Reveal styles not scoped to a script-on class | Scope hidden states; show content by default               |
| Element positioned with offsets drifts | Absolute positioning used for content         | Flex or grid placement                                     |
| Spacing uneven between breakpoints     | One-off margins per breakpoint                | `gap` and fluid spacing tokens                             |
| A fix at one width breaks another      | A patch, not a rule                           | Replace the patch with one fluid rule and re-check all six |

## 8. Native and Desktop Apps

The same method applies with the platform's size set from `../foundations/platform-adaptation.md`, Section 11.

| Symptom                                               | Usual cause                                | Fix                                                                   |
| ----------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| Text truncated on a small phone or at large text size | Fixed frame or fixed height around text    | Remove the fixed size; let the text wrap; use a scroll container      |
| Row overflows on a small phone                        | Fixed-width children in a horizontal stack | Weights or flexible children; switch to a vertical stack when compact |
| Content under the notch or home indicator             | Safe area ignored                          | Respect safe-area insets                                              |
| Phone layout stretched on a tablet                    | No size-class branch                       | Add a two-pane layout for regular or expanded width                   |
| Desktop window breaks when small                      | No minimum window size, fixed panes        | Set a minimum size; make panes resizable or collapsible               |
| Keyboard covers the field                             | No keyboard avoidance                      | Scroll the focused field into view; pad for the keyboard inset        |

## 9. Verification After Each Fix

1. Re-capture all six widths (or the platform's full size set).
2. Overflow is 0 at each.
3. The original defect is gone at its width.
4. No new defect at the other five.
5. Nothing was hidden, clipped, or shrunk to pass.
