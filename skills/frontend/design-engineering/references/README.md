# References Map

Reference files hold the detail. Skills hold the workflow. Open a folder by what you need.

| Folder | What is inside | Used by |
| --- | --- | --- |
| `foundations/` | House defaults: tokens sheet, layout and spacing, type, colour, surface and depth, icons and images, components, motion basics, UX copy, accessibility baseline, platform adaptation and code examples | Every UI build |
| `styles/` | Rules for each 02 Styles skill, plus `token-packs/` with 15 ready-made style token sets | 02 Styles |
| `motion/` | Animation standards, glossary, audit checklist, plan template, craft principles, Apple guidelines, motion across platforms | 04 Motion |
| `image-to-code/` | Prompt writing for web and mobile comps, and how to extract measurements from an image | 05 Image to code |
| `audit/` | The rule catalogue for `ui-code-linter` and the fix playbook for `responsive-layout-fixer` | 06 Audit |
| `design-practice/` | How to critique, refine, enhance, and adapt a design across platforms | 01 Foundations |
| `prototyping/` | The variant picker used when comparing several versions | 01 Foundations |
| `ui-design/` | Large lookup tables: product types, landing patterns, UX guidelines, palettes, styles, stack rules | Any skill |

## Foundations at a glance

The full index with a "find it fast" table is `foundations/README.md`.

| File | Answers |
| --- | --- |
| `foundations/design-tokens-sheet.md` | What are all the token names and default values? |
| `foundations/layout-and-spacing-system.md` | How do I build hierarchy? What spacing, grid, and breakpoints? How do I avoid hard-coded layout? |
| `foundations/type-system.md` | Which font sizes, weights, and line heights? When may I clamp lines? |
| `foundations/colour-system.md` | How do I build a palette, a dark theme, and prove contrast? |
| `foundations/surface-and-depth-system.md` | Which radius, border, and shadow? How do nested corners and elevation work? |
| `foundations/icon-and-image-system.md` | Which icon size? What image ratio and format? How do I stop images breaking layout? |
| `foundations/component-specs.md` | How big is a button or input? Which states must exist? |
| `foundations/motion-basics.md` | How long, which curve, and when is motion off? |
| `foundations/ux-copy-guide.md` | How do I write headlines, buttons, errors, and empty states? |
| `foundations/accessibility-baseline.md` | What is the accessibility floor and how do I check it? |
| `foundations/platform-adaptation.md` | How does each rule translate to other platforms? |
| `foundations/platform-code-examples.md` | What does the same token set look like in each toolkit? |

## Naming rules for this folder

- Kebab-case, lower case, no abbreviations a newcomer would not know.
- A file name says what the file answers, not which tool inspired it.
- A style file shares its name with the skill that uses it (`style-brutalist.md` serves `style-brutalist`).
- One topic per file. If a file needs "and" twice in its name, split it.
