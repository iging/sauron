# Layout and Spacing System

Default rules for visual hierarchy, spacing, grids, breakpoints, and responsive behaviour. Apply to every interface built with this suite unless a brand preset or token pack overrides a value.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

Type sizing lives in `type-system.md`. Colour lives in `colour-system.md`. Radius, borders, and shadows live in `surface-and-depth-system.md`.

## 1. Visual Hierarchy

Hierarchy is the order in which the eye reads a screen. Build it on purpose with five tools, strongest first.

| Tool     | How it ranks                                              |
| -------- | --------------------------------------------------------- |
| Size     | Larger reads first                                        |
| Weight   | Heavier reads before lighter at the same size             |
| Contrast | Ink on canvas beats muted ink; the accent beats both      |
| Space    | An element with room around it reads as more important    |
| Position | Top and leading edge read before bottom and trailing edge |

Rules:

1. One focal point per viewport. Decide what it is before placing anything else.
2. Three levels are enough: primary (one), secondary (a few), tertiary (the rest). A fourth level usually means two things are competing.
3. Use at least two tools to separate adjacent levels. Size alone or colour alone is fragile.
4. The primary action is the only filled, accent-coloured control in view.
5. Squint test: blur the screen or step back. The focal point, then the primary action, should still be findable. If everything blurs to the same grey, the hierarchy is flat.
6. Related items sit closer together than unrelated items. Proximity groups before borders do.
7. Align to a small number of shared edges. Every extra alignment line adds noise.

## 2. Spacing Scale

Base unit 4 px. Use only these steps.

| Token        | Value  | Typical use                                        |
| ------------ | ------ | -------------------------------------------------- |
| `--space-1`  | 4 px   | Icon to label, tight inline gaps                   |
| `--space-2`  | 8 px   | Between related controls, chip padding             |
| `--space-3`  | 12 px  | Input padding, small card gaps                     |
| `--space-4`  | 16 px  | Default gap, mobile gutter, card padding (compact) |
| `--space-5`  | 20 px  | Button inline padding                              |
| `--space-6`  | 24 px  | Card padding, gap between cards                    |
| `--space-8`  | 32 px  | Between groups inside a section                    |
| `--space-10` | 40 px  | Heading block to content                           |
| `--space-12` | 48 px  | Between large groups                               |
| `--space-16` | 64 px  | Section padding on mobile                          |
| `--space-24` | 96 px  | Section padding on desktop                         |
| `--space-32` | 128 px | Hero and feature sections with extra air           |

Three ranges, three jobs:

- **Inside a component:** 4 to 16 px.
- **Between components:** 16 to 32 px.
- **Between sections:** 64 to 128 px.

Keep the ranges apart. When the gap between two cards equals the padding inside them, the grouping disappears.

Fluid values for the two that change most with the viewport:

```css
:root {
  --space-gutter: clamp(1rem, 4vw, 2rem);
  --space-section: clamp(3.5rem, 2rem + 6vw, 6rem);
}
```

## 3. Containers and Grid

| Token              | Value | Use                              |
| ------------------ | ----- | -------------------------------- |
| `--container`      | 75rem | Default page container (1200 px) |
| `--container-wide` | 90rem | Dashboards and galleries         |
| `--container-text` | 65ch  | Articles and long copy           |

```css
.container {
  inline-size: min(100% - 2 * var(--space-gutter), var(--container));
  margin-inline: auto;
}
```

- Columns: 4 on phones, 8 on tablets, 12 on desktop. Gap 16 px on phones, 24 px from tablet up.
- Prefer unequal splits (7 and 5, 8 and 4) to halves when one side matters more.
- Every row of a grid fills its columns. No orphan cell in the last row; change the span or the count.
- Cards in a row share a height: stretch the row and let the card fill it. Do not clamp text to force equality.
- Media in a grid shares one aspect ratio, set with `aspect-ratio` and `object-fit: cover`.

Intrinsic grid for card lists, no media query needed:

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-6);
}
```

## 4. Breakpoints

Write mobile first. Add a breakpoint where the layout breaks, not at a device name. These four cover most pages:

| Name | Min width    | Usual change                                    |
| ---- | ------------ | ----------------------------------------------- |
| `sm` | 40rem (640)  | Two-column card grids, inline form rows         |
| `md` | 48rem (768)  | Mobile call bar hidden, multi-column footers    |
| `lg` | 64rem (1024) | Split hero, three-column grids, full navigation |
| `xl` | 80rem (1280) | Wider gaps, four-column grids                   |

Full navigation needs room. If the links and the action do not fit on one row at 768, keep the menu button until they do.

### Check widths

Every build is checked at these six widths before it is called done: **320, 375, 425, 768, 1024, 1440**.

At each width confirm:

1. No horizontal scroll.
2. The first viewport shows the headline, one line of support, and the primary action.
3. Headline line count is within limit and no line is a single word.
4. Touch targets are at least 44 by 44 px below 1024.
5. Grid rows are full and cards in a row are equal height.
6. Fixed and sticky layers cover no content.

`../../06-audit/responsive-screenshot-check/SKILL.md` automates the capture.

## 5. Container Queries

Use a container query when a component must adapt to the space it is given rather than to the viewport: a card that appears in a sidebar and in a main column, a media object inside a resizable panel.

```css
.card-slot {
  container-type: inline-size;
}

@container (inline-size >= 30rem) {
  .card {
    grid-template-columns: auto 1fr;
  }
}
```

Page-level structure (header, hero split, section columns) stays on media queries.

## 6. Responsive Patterns

| Pattern        | Behaviour                                                              |
| -------------- | ---------------------------------------------------------------------- |
| Stack          | Columns become rows; copy before media unless the media is the message |
| Reflow grid    | Column count drops: 4, 3, 2, 1                                         |
| Sidebar        | Sidebar moves above content or into a drawer                           |
| Priority nav   | Links collapse into a menu; the primary action stays visible           |
| Overlay menu   | The mobile menu floats over the page and never pushes content          |
| Table to cards | Each row becomes a labelled card, or the table scrolls inside a region |
| Call bar       | The two most valuable actions pin to the bottom on phones              |

Keep section order the same at every width. Reorder only cells inside a grid, and only by importance.

## 7. Layers, Radius, Targets

```css
:root {
  --z-base: 0;
  --z-sticky: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;

  --radius-control: 0.5rem;
  --radius-card: 0.75rem;
  --radius-container: 1rem;

  --size-touch: 3rem;
}
```

- Five z-index steps. Never a raw number.
- A nested radius equals the outer radius minus the padding between them. Full radius, border, and shadow rules are in `surface-and-depth-system.md`.
- Controls are 48 px tall on touch layouts and 40 px on dense desktop layouts. Adjacent targets have 8 px between them.
- Full-height sections use `dvh`, not `vh`.
- Fixed bars add `env(safe-area-inset-bottom)` to their padding, and the page reserves their height so the last content is reachable.
- Anchored scrolling is offset by the sticky header height (`scroll-padding-block-start`).
- Use logical properties (`inline`, `block`) so layouts mirror for right-to-left languages.

## 8. Flex and Grid Without Hard-Coded Layout

A layout is hard-coded when it only works at the size it was written for: fixed pixel widths, fixed heights around text, absolute positions, and one-off margins that nudge things into place. Let the layout engine do the arithmetic instead.

### Which tool

| Need                                                         | Use                   | Why                                          |
| ------------------------------------------------------------ | --------------------- | -------------------------------------------- |
| Items in one row or one column                               | Flex                  | Content decides each item's size             |
| Rows and columns that must line up                           | Grid                  | The container decides the tracks             |
| Page structure: header, sidebar, main, footer                | Grid                  | Named areas, one place to change             |
| A toolbar, a nav row, a button group, an icon beside a label | Flex                  | One axis, wrapping allowed                   |
| A card list with an unknown number of items                  | Grid with `auto-fill` | Column count adapts with no media query      |
| Children that must align across sibling cards                | Subgrid               | Titles and actions share the parent's tracks |
| Overlapping layers (text over an image)                      | Grid, same cell       | No absolute positioning needed               |

Rule of thumb: one direction is flex, two directions is grid. When a flex layout needs wrapped rows to line up in columns, it has become a grid.

### Sizing rules

1. **Size from content or from the container, not from a number.** Use `fr`, `auto`, `min-content`, `max-content`, `minmax()`, and percentages before a pixel value.
2. **Constrain with limits, not fixed sizes.** Write `max-inline-size`, `min-block-size`, and `clamp()`. A fixed `width` or `height` on anything that holds text is a defect.
3. **Space with `gap`.** Not margins on children, not spacer elements, not `:last-child` resets. Gap values come from the spacing scale.
4. **Never set a height to make things match.** Stretch the row (`align-items: stretch`, the grid default) and let each item fill it.
5. **Push with auto margins and alignment.** `margin-inline-start: auto` or `justify-content: space-between` moves an item to the far edge. Do not calculate the distance.
6. **Let items shrink.** Flex and grid children default to a minimum of their content. Set `min-inline-size: 0` on a child that should truncate or scroll.
7. **Keep the document in flow.** Absolute and fixed positioning are for layers that float above the page (menus, badges on a corner, sticky bars), never for arranging content.
8. **Keep source order as reading order.** Avoid `order` and `grid-auto-flow: dense` for meaningful content; they break keyboard and screen-reader sequence.
9. **No magic numbers.** If a value such as `margin-top: 37px` or `left: -3px` exists only to make one screen look right, the layout rule above it is wrong.

### Patterns

```css
/* Row that wraps, items keep their natural size */
.cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

/* Two columns that become one when either would be too narrow */
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.switcher > * {
  flex: 1 1 20rem;
}

/* Content with a sidebar: sidebar keeps its size, content takes the rest */
.with-sidebar {
  display: grid;
  gap: var(--space-8);
  grid-template-columns: minmax(0, 1fr);
}

@media (width >= 64rem) {
  .with-sidebar {
    grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
  }
}

/* Card whose footer always sits at the bottom */
.card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  block-size: 100%;
}

/* Text over an image without absolute positioning */
.overlay {
  display: grid;
}

.overlay > * {
  grid-area: 1 / 1;
}

/* Page shell */
.shell {
  display: grid;
  min-block-size: 100dvh;
  grid-template-rows: auto 1fr auto;
}
```

Use `minmax(0, 1fr)` instead of a bare `1fr` when a track holds long text or wide media; a bare `1fr` cannot shrink below its content and causes sideways scroll.

### Hard-coded smells and their fixes

| Smell                                             | Fix                                                        |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `width: 1200px` on a wrapper                      | `inline-size: min(100% - 2 * gutter, 75rem)`               |
| `width: 33.33%` with floats or inline-block       | Grid with `repeat(3, minmax(0, 1fr))` or `auto-fill`       |
| `height: 400px` on a card with text               | Remove it; stretch the row, set `min-block-size` if needed |
| `margin-right` on every item but the last         | `gap` on the parent                                        |
| `position: absolute; top; left` to place content  | Grid placement or flex alignment                           |
| `margin-top: -20px` to pull something up          | Fix the spacing above it, or overlap in a shared grid cell |
| A different fixed width at every media query      | One fluid rule with `minmax()`, `clamp()`, or `flex-basis` |
| `calc(100vw - 280px)` for the main column         | Grid tracks: `18rem minmax(0, 1fr)`                        |
| Empty spacer elements                             | `gap` or auto margins                                      |
| Line breaks and non-breaking spaces to align text | A grid with aligned tracks                                 |

### On other platforms

The same idea holds everywhere: describe relationships, not coordinates.

| Web               | SwiftUI                                                 | Compose                                                         | Flutter                                                           | WinUI                                                          |
| ----------------- | ------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Flex row          | `HStack`                                                | `Row`                                                           | `Row`                                                             | `StackPanel` horizontal                                        |
| Flex column       | `VStack`                                                | `Column`                                                        | `Column`                                                          | `StackPanel` vertical                                          |
| `flex: 1`         | `.frame(maxWidth: .infinity)`, `Spacer`                 | `Modifier.weight(1f)`                                           | `Expanded`, `Flexible`                                            | Star sizing (`*`) in a `Grid`                                  |
| `gap`             | The stack's `spacing`                                   | `Arrangement.spacedBy()`                                        | `spacing` on `Row`, `Column`, `Wrap`                              | `Spacing`, `RowSpacing`, `ColumnSpacing`                       |
| Grid              | `Grid`, `LazyVGrid` with adaptive columns               | `LazyVerticalGrid` with `GridCells.Adaptive`                    | `GridView` with max cross-axis extent                             | `Grid`, `ItemsRepeater` with a uniform grid layout             |
| Wrapping row      | A flow `Layout`                                         | `FlowRow`                                                       | `Wrap`                                                            | A wrap layout in `ItemsRepeater`                               |
| Same-cell overlap | `ZStack`                                                | `Box`                                                           | `Stack`                                                           | Children in one `Grid` cell                                    |
| Hard-coded smell  | `.frame(width:height:)` on text, `.offset`, `.position` | Fixed `Modifier.size` on text, `offset`, absolute padding hacks | `SizedBox` with fixed sizes around text, `Positioned` for content | Fixed `Width`, `Height`, `Margin` nudges, `Canvas` for content |

Native layouts must also survive the largest system text size, which a fixed frame never does.

## 9. Checklist

- One focal point and one primary action per viewport.
- Every gap is a scale token; the three spacing ranges do not overlap.
- Container and gutter tokens used; no fixed pixel widths on text containers.
- One-axis layouts use flex, two-axis layouts use grid; spacing is `gap`.
- No fixed width or height around text, no absolute positioning for content, no magic-number margins.
- Grid rows full, cards equal height, media one ratio.
- Mobile first; breakpoints placed where content breaks.
- Checked at 320, 375, 425, 768, 1024, and 1440.
- Overlay menu does not shift content; fixed layers cover nothing.
