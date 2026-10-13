# Utilitarian Minimalism

Depth reference for `02-styles/style-minimalist`. It fixes the palette, the type pairing, and the exact construction of each component, so that "minimal" means precise instead of empty.

## 1. Principle

Remove decoration, keep information. Every remaining element must be doing work: naming, grouping, ordering, or inviting an action. If the page feels bare, the fix is better content and sharper hierarchy, not an added gradient.

## 2. Palette

### Neutrals (warm monochrome)

| Role         | Value     | Use                         |
| ------------ | --------- | --------------------------- |
| Canvas       | `#F7F6F3` | Page background             |
| Surface      | `#FFFFFF` | Cards, inputs, menus        |
| Surface sunk | `#F1F0EC` | Code, quotes, table headers |
| Hairline     | `#E6E4DF` | 1 px borders and dividers   |
| Ink          | `#1F1E1C` | Headings and primary text   |
| Ink body     | `#3A3936` | Running text                |
| Ink muted    | `#6F6D68` | Secondary text, captions    |

### Spot pastels

Each pastel is a pair: a pale fill and a dark text colour from the same hue. Use them for tags, callouts, and one highlighted cell. Never for large backgrounds.

| Name   | Fill      | Text      |
| ------ | --------- | --------- |
| Red    | `#FDEBEC` | `#8C2F32` |
| Amber  | `#FBF3DB` | `#7A5B12` |
| Green  | `#EDF3EC` | `#2F5D3A` |
| Blue   | `#E1F3FE` | `#1F5B80` |
| Violet | `#F1ECF9` | `#553A86` |

Rules: two pastels per view at most. The primary action is ink on canvas inverted (dark button, light label), not a pastel.

## 3. Type

| Role    | Face character       | Size and weight                                  |
| ------- | -------------------- | ------------------------------------------------ |
| Display | Editorial serif      | 40 to 64 px, weight 400 to 500, tracking -0.02em |
| Heading | Serif or the UI sans | 24 to 32 px, weight 500 to 600                   |
| Body    | Clean UI sans        | 16 to 17 px, weight 400, line height 1.6         |
| Label   | UI sans              | 13 to 14 px, weight 500                          |
| Mono    | A quiet monospace    | 13 to 14 px, for code and figures                |

- The serif appears in display sizes only. Small serif UI text looks fussy.
- Hierarchy uses size and weight, then ink level. Colour is the last tool.
- Numbers in tables and prices use tabular numerals.

## 4. Component Specifications

| Component      | Construction                                                                              |
| -------------- | ----------------------------------------------------------------------------------------- |
| Primary button | Ink fill, canvas-colour label, radius 6 px, height 40 px (48 px on touch), no shadow      |
| Secondary      | Surface fill, 1 px hairline, ink label, same radius and height                            |
| Text button    | No fill, ink label, underline on hover                                                    |
| Card           | Surface fill, 1 px hairline, radius 8 px, padding 20 to 24 px, no shadow                  |
| Input          | Surface fill, 1 px border at 3 to 1 contrast, radius 6 px, label above, helper text below |
| Tag            | Pastel pair, radius 4 px, padding 2 px 8 px, 12 to 13 px label                            |
| Table          | Row dividers only, no column rules, sunk header row, right-aligned numbers                |
| Divider        | 1 px hairline with 24 to 32 px of space on each side                                      |
| Menu           | Surface, hairline, one soft shadow (the only shadow in the system), radius 8 px           |
| Callout        | Pastel fill, matching text, a leading icon, no border                                     |

Radius scale is 4, 6, 8 px. No pills except avatars and status dots. Shadows appear only on layers that float above the page (menus, dialogs, toasts).

### Flat bento

Cells are cards with the same hairline and radius, in a gapless grid (see `aida-landing-page-structure.md`, Section 4). One cell may take a pastel fill. Cell content is typographic first: a number, a sentence, a small diagram.

## 5. Icons and Imagery

- One line-icon set, 1.5 px stroke, 16 or 20 px, drawn in `currentColor`.
- Icons accompany labels; they rarely replace them.
- Photography is desaturated slightly or duotoned to sit with the neutrals. Frame images with the hairline and the card radius.
- Diagrams use ink and one pastel. No illustration clutter.

## 6. Motion

- Durations 120 to 200 ms. Ease-out.
- Hover changes fill or border, not position. No lift, no scale.
- Disclosure (accordion, menu) animates opacity and a 4 px offset.
- Page-level entrance animation is off by default. One subtle fade for the first viewport is the ceiling.
- All motion is removed under reduced motion; nothing depends on it.

## 7. Banned Elements

- Gradients of any kind, including on text.
- Shadows on cards and buttons.
- Pill buttons and fully rounded containers.
- More than two pastels in a view, or a pastel used as a section background.
- Emoji and decorative illustrations.
- Centred body paragraphs.
- Icon-only navigation without labels.
- Decorative eyebrows above every heading.

## 8. Execution Order

1. Set canvas, surface, hairline, and the three ink levels as tokens.
2. Set the type scale and confirm hierarchy in greyscale.
3. Lay out with generous, consistent spacing on an 8 px rhythm.
4. Build components from Section 4 with no additions.
5. Add at most two pastels where they carry meaning.
6. Remove anything that does no work.

## 9. Checklist

- Canvas is warm off-white, not `#FFFFFF` edge to edge.
- Serif used only at display sizes.
- No gradient, no card shadow, no pill.
- Two pastels or fewer per view, each as a fill and text pair.
- Inputs have a visible 3 to 1 boundary and a label above.
- Every icon has a label nearby or an accessible name.
- Motion under 200 ms and fully optional.

## 10. On Other Platforms

This style transfers almost unchanged, because it relies on type, spacing, and restraint rather than effects.

| Element          | iOS and macOS                              | Android                                    | Flutter                              | Windows                                 |
| ---------------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------ | --------------------------------------- |
| Canvas and ink   | Asset catalogue colours, light and dark    | Material colour scheme: background, onBackground | `ColorScheme` surface and onSurface | Theme dictionary brushes                |
| Display serif    | A serif custom font registered with text styles | A serif in the `Typography` display roles | Serif in `TextTheme` display styles | Serif on title styles only              |
| Cards            | Grouped list or plain rounded rectangle, no shadow | Outlined card                       | `Card` with elevation 0 and a border | `Border` with a 1 epx stroke            |
| Tags             | Small capsule with tinted fill             | Assist or suggestion chip, tonal           | `Chip` with a pastel background      | Small `Border` with tinted fill         |
| Tables           | Native list or table                       | Lazy column with dividers                  | `DataTable` or list with dividers    | `DataGrid` with row lines only          |

Keep: warm off-white canvas, three ink levels, two pastels at most, no gradients, motion under 200 ms.

Adjust: use the platform's corner radii and native controls; the 4, 6, 8 radius scale is a web default, not a rule to force onto system components.
