# Type System

Default typographic system for any interface built with this suite: a fluid type scale, weight roles, line height, tracking, measure, and line clamping. Apply it unless a brand preset or style token pack overrides a value.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

Face selection and pairing live in `../ui-design/tokens/typography.md` and `../styles/anti-slop-ui-rules.md`, Section 3. This file covers sizing and setting.

## 1. Vocabulary

| Term             | Meaning                                                            |
| ---------------- | ------------------------------------------------------------------ |
| Type scale       | The fixed list of font sizes a project may use                     |
| Fluid typography | Sizes that grow smoothly with the viewport, set with CSS `clamp()` |
| Weight role      | The job each font weight has (body, emphasis, heading)             |
| Leading          | Line height                                                        |
| Tracking         | Letter spacing                                                     |
| Measure          | Line length in characters                                          |
| Line clamping    | Cutting text off after a set number of lines, with `line-clamp`    |

## 2. Fluid Scale

Each step has a minimum (at a 320 px viewport) and a maximum (at 1440 px). Between them the size scales in a straight line. Below 320 and above 1440 it stays fixed.

| Token            | 320 px | 1440 px | Value                                            | Use                              |
| ---------------- | ------ | ------- | ------------------------------------------------ | -------------------------------- |
| `--text-display` | 44     | 96      | `clamp(2.75rem, 1.8214rem + 4.6429vw, 6rem)`     | Poster headlines only            |
| `--text-h1`      | 36     | 72      | `clamp(2.25rem, 1.6071rem + 3.2143vw, 4.5rem)`   | Page title, one per page         |
| `--text-h2`      | 30     | 48      | `clamp(1.875rem, 1.5536rem + 1.6071vw, 3rem)`    | Section headings                 |
| `--text-h3`      | 24     | 32      | `clamp(1.5rem, 1.3571rem + 0.7143vw, 2rem)`      | Sub-section and feature headings |
| `--text-h4`      | 20     | 24      | `clamp(1.25rem, 1.1786rem + 0.3571vw, 1.5rem)`   | Card titles                      |
| `--text-lead`    | 18     | 20      | `clamp(1.125rem, 1.0893rem + 0.1786vw, 1.25rem)` | Intro paragraph under a heading  |
| `--text-body`    | 16     | 18      | `clamp(1rem, 0.9643rem + 0.1786vw, 1.125rem)`    | Running text                     |
| `--text-small`   | 14     | 14      | `0.875rem`                                       | Secondary text, form help        |
| `--text-caption` | 13     | 13      | `0.8125rem`                                      | Captions, labels, legal          |

Dense interfaces (dashboards, admin tools) do not use the fluid steps above `--text-h3`. Use fixed sizes of 13, 14, 16, 20, and 24 px there.

### Building a clamp value

```text
slope     = (max - min) / (1440 - 320)        in px per px of viewport
intercept = min - slope * 320                 in px
value     = clamp(min in rem, intercept in rem + slope * 100 vw, max in rem)
```

Rules for every fluid size:

1. The middle term always mixes `rem` and `vw`. A pure `vw` size ignores browser zoom and the user's font-size setting.
2. Minimum and maximum are in `rem`, never `px`.
3. The maximum is at most 2.5 times the minimum, so text can still be enlarged to 200 percent.
4. Body text is never below 16 px. Nothing a user must read is below 13 px.
5. Sizes come only from the scale. A one-off `font-size` is a defect.
6. Adjacent steps must stay visibly different at every width. If two steps come within 2 px of each other at 320 px, merge them on mobile.

## 3. Weight Roles

| Role          | Weight     | Where                                                 |
| ------------- | ---------- | ----------------------------------------------------- |
| Body          | 400        | Paragraphs, descriptions, table cells                 |
| Emphasis      | 500        | Labels, navigation, form labels, inline emphasis      |
| Strong        | 600        | Buttons, card titles, `h3` and `h4`                   |
| Heading       | 600 to 700 | `h1` and `h2` in sans and slab faces                  |
| Display serif | 400 to 500 | High-contrast serifs at large sizes; do not bold them |

- Three weights per family at most. Load only the files you use.
- Bigger type needs less weight. A 72 px headline at 800 usually reads heavier than intended; try 600 first.
- Do not signal hierarchy with weight alone between adjacent levels. Pair it with size.
- Never fake a weight. If the family has no 600, choose a loaded weight; browser-synthesised bold looks smeared.

## 4. Leading

| Size range      | Line height  |
| --------------- | ------------ |
| 48 px and above | 1.0 to 1.1   |
| 30 to 47 px     | 1.1 to 1.2   |
| 20 to 29 px     | 1.25 to 1.35 |
| 16 to 19 px     | 1.5 to 1.7   |
| 13 to 15 px     | 1.4 to 1.5   |

Use unitless values so line height scales with the font size. Longer lines need more leading; a wide measure sits at the top of its range.

## 5. Tracking

| Text                          | Letter spacing     |
| ----------------------------- | ------------------ |
| Display and `h1`              | -0.02em to -0.03em |
| `h2` and `h3`                 | -0.01em to -0.02em |
| Body                          | 0                  |
| Uppercase labels, 12 to 14 px | 0.08em to 0.14em   |
| Monospace                     | 0                  |

Set tracking in `em` so it scales with size. Never track lowercase body text wider.

## 6. Measure and Wrapping

- Body copy: 60 to 72 characters. Set `max-inline-size: 65ch` on text containers.
- Lead paragraphs: 45 to 60 characters.
- Headings: `text-wrap: balance`. Paragraphs: `text-wrap: pretty`.
- Left-align anything longer than three lines. Centre only short headings and single sentences.
- A heading belongs to what follows it: more space above than below.
- Join a value to its unit with a non-breaking space so they never split across lines.
- Use `overflow-wrap: break-word` on containers that can receive long unbroken strings (emails, URLs).

## 7. Line Clamping

Clamp only text that is a preview of something available in full elsewhere.

```css
.clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
```

| Element                  | Lines |
| ------------------------ | ----- |
| Card title               | 2     |
| Card description         | 3     |
| List row, secondary text | 1     |
| Table cell               | 1     |

- Never clamp headings on a detail page, body copy, form labels, error messages, or prices.
- A clamped element links to, or expands into, the full text.
- A flex or grid child must be allowed to shrink (`min-inline-size: 0`) or truncation never triggers.
- Design cards to an equal height by layout (stretch the row), not by clamping text until they match.

## 8. Numerals and Details

- Tabular numerals for tables, prices in a column, timers, and anything that updates in place.
- Use the single ellipsis character and typographic quotes in user-facing copy.
- One `h1` per page. Heading levels follow document structure, not visual size; style a level with a scale token when it needs to look different.

## 9. Token Block

```css
:root {
  --text-display: clamp(2.75rem, 1.8214rem + 4.6429vw, 6rem);
  --text-h1: clamp(2.25rem, 1.6071rem + 3.2143vw, 4.5rem);
  --text-h2: clamp(1.875rem, 1.5536rem + 1.6071vw, 3rem);
  --text-h3: clamp(1.5rem, 1.3571rem + 0.7143vw, 2rem);
  --text-h4: clamp(1.25rem, 1.1786rem + 0.3571vw, 1.5rem);
  --text-lead: clamp(1.125rem, 1.0893rem + 0.1786vw, 1.25rem);
  --text-body: clamp(1rem, 0.9643rem + 0.1786vw, 1.125rem);
  --text-small: 0.875rem;
  --text-caption: 0.8125rem;

  --weight-body: 400;
  --weight-emphasis: 500;
  --weight-strong: 600;
  --weight-heading: 700;

  --leading-display: 1.05;
  --leading-heading: 1.15;
  --leading-title: 1.3;
  --leading-body: 1.6;

  --tracking-display: -0.025em;
  --tracking-heading: -0.015em;
  --tracking-label: 0.1em;

  --measure-body: 65ch;
  --measure-lead: 55ch;
}
```

## 10. Checklist

- Every font size is a scale token.
- Fluid sizes mix `rem` and `vw`, with `rem` limits.
- Body at 16 px or more at 320 px wide.
- Three weights or fewer per family, each with a role.
- Leading and tracking follow the tables.
- Body measure capped near 65 characters.
- Clamping only on previews, with a route to the full text.
- Hierarchy still reads at 320, 375, 425, 768, 1024, and 1440 px.
