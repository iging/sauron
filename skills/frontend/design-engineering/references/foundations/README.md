# Foundations

Everything a UI build needs by default, in one folder. Load these for any page, screen, or window, whichever skill is running. A brand preset or style token pack may change values; it may not remove a rule.

## Start Here

1. `design-tokens-sheet.md` for every token in one block.
2. The file for the topic at hand, from the table below.
3. `platform-adaptation.md` when the target is not a web page.

## Files

| File                           | Covers                                                                                | Answers                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `design-tokens-sheet.md`       | Every default token in one copy-ready block                                           | What are all the token names and default values?                                                 |
| `layout-and-spacing-system.md` | Visual hierarchy, spacing, grid, flex and grid use, breakpoints, the six check widths | How do I build hierarchy? What spacing, grid, and breakpoints? How do I avoid hard-coded layout? |
| `type-system.md`               | Type scale, fluid `clamp()` sizes, weights, line height, line clamping                | Which font sizes, weights, and line heights? When may I clamp lines?                             |
| `colour-system.md`             | Colour ramps, semantic roles, dark theme, contrast proof                              | How do I build a palette, a dark theme, and prove contrast?                                      |
| `surface-and-depth-system.md`  | Border radius, borders, shadows, elevation, overlays, focus rings                     | Which radius, border, and shadow? How do nested corners and elevation work?                      |
| `icon-and-image-system.md`     | Icon sizes and rules, image ratios, formats, alt text                                 | Which icon size? What image ratio and format? How do I stop images breaking layout?              |
| `component-specs.md`           | Component anatomy, sizes, states, and native equivalents                              | How big is a button or input? Which states must exist?                                           |
| `motion-basics.md`             | Duration and easing tokens, what to animate, reduced motion                           | How long, which curve, and when is motion off?                                                   |
| `ux-copy-guide.md`             | Headlines, buttons, errors, empty states                                              | How do I write headlines, buttons, errors, and empty states?                                     |
| `accessibility-baseline.md`    | The twelve accessibility requirements on one page                                     | What is the accessibility floor and how do I check it?                                           |
| `platform-adaptation.md`       | Translating all of the above to iOS, Android, desktop apps, and business systems      | How does each rule translate to other platforms?                                                 |
| `platform-code-examples.md`    | The same tokens written in CSS, SwiftUI, Compose, Flutter, and XAML                   | What does the same token set look like in each toolkit?                                          |

## Find It Fast

| Looking for                                  | File and section                             |
| -------------------------------------------- | -------------------------------------------- |
| Border radius, nested corners                | `surface-and-depth-system.md`, Section 2     |
| Shadows and elevation levels                 | `surface-and-depth-system.md`, Section 4     |
| Borders and dividers                         | `surface-and-depth-system.md`, Section 3     |
| Focus ring                                   | `surface-and-depth-system.md`, Section 6     |
| Spacing scale                                | `layout-and-spacing-system.md`, Section 2    |
| Flex or grid, and avoiding hard-coded layout | `layout-and-spacing-system.md`, Section 8    |
| Breakpoints and the six check widths         | `layout-and-spacing-system.md`, Section 4    |
| How to fix a layout that breaks at one width | `../audit/responsive-fix-playbook.md` |
| Visual hierarchy                             | `layout-and-spacing-system.md`, Section 1    |
| Font sizes and `clamp()`                     | `type-system.md`, Section 2                  |
| Font weights                                 | `type-system.md`, Section 3                  |
| Line clamping                                | `type-system.md`, Section 7                  |
| Palette and dark theme                       | `colour-system.md`, Sections 2 to 4          |
| Contrast minimums                            | `colour-system.md`, Section 6                |
| Button, input, card, nav, dialog sizes       | `component-specs.md`, Sections 2 to 6        |
| Icon sizes                                   | `icon-and-image-system.md`, Section 1        |
| Image aspect ratios and formats              | `icon-and-image-system.md`, Sections 3 and 4 |
| Animation durations and easing               | `motion-basics.md`, Section 2                |
| Button and error wording                     | `ux-copy-guide.md`, Sections 3 and 5         |
| Touch target sizes per platform              | `platform-adaptation.md`, Section 5          |
| Native code for tokens                       | `platform-code-examples.md`                  |
