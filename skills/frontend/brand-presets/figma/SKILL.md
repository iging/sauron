---
name: brand-figma
description: '"A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome  -  figmaSans variable type, pure white surfaces, pure black ink, pill-shaped CTAs  -  while each story section drops the page into a saturated lime, lavender, cream, mint, or pink panel that reads like a sticky note placed on a clean desk. The result is a design system that feels both technical and joyful  -  a tool for serious work, made by people who like color."'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-figma
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" on-primary: "#ffffff" ink: "#000000" canvas: "#ffffff" inverse-canvas: "#000000" inverse-ink: "#ffffff" on-inverse-soft: "#ffffff" hairline: "#e6e6e6" hairline-soft: "#f1f1f1" surface-soft: "#f7f7f5" block-lime: "#dceeb1" block-lilac: "#c5b0f4" block-cream: "#f4ecd6" block-pink: "#efd4d4" block-mint: "#c8e6cd" block-coral: "#f3c9b6" block-navy: "#1f1d3d" accent-magenta: "#ff3d8b" semantic-success: "#1ea64a" overlay-scrim: "#000000"'
typography: "display-xl: fontFamily: figmaSans fontSize: 86px fontWeight: 340 lineHeight: 1.00 letterSpacing: -1.72px fontFeature: kern display-lg: fontFamily: figmaSans fontSize: 64px fontWeight: 340 lineHeight: 1.10 letterSpacing: -0.96px fontFeature: kern headline: fontFamily: figmaSans fontSize: 26px fontWeight: 540 lineHeight: 1.35 letterSpacing: -0.26px fontFeature: kern subhead: fontFamily: figmaSans fontSize: 26px fontWeight: 340 lineHeight: 1.35 letterSpacing: -0.26px fontFeature: kern card-title: fontFamily: figmaSans fontSize: 24px fontWeight: 700 lineHeight: 1.45 letterSpacing: 0 fontFeature: kern body-lg: fontFamily: figmaSans fontSize: 20px fontWeight: 330 lineHeight: 1.40 letterSpacing: -0.14px fontFeature: kern body: fontFamily: figmaSans fontSize: 18px fontWeight: 320 lineHeight: 1.45 letterSpacing: -0.26px fontFeature: kern body-sm: fontFamily: figmaSans fontSize: 16px fontWeight: 330 lineHeight: 1.45 letterSpacing: -0.14px fontFeature: kern link: fontFamily: figmaSans fontSize: 20px fontWeight: 480 lineHeight: 1.40 letterSpacing: -0.10px fontFeature: kern button: fontFamily: figmaSans fontSize: 20px fontWeight: 480 lineHeight: 1.40 letterSpacing: -0.10px fontFeature: kern eyebrow: fontFamily: figmaMono fontSize: 18px fontWeight: 400 lineHeight: 1.30 letterSpacing: 0.54px fontFeature: kern caption: fontFamily: figmaMono fontSize: 12px fontWeight: 400 lineHeight: 1.00 letterSpacing: 0.60px fontFeature: kern"
spacing: "hair: 1px xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `figma`

Apply the `figma`-inspired visual language to a project.

## How to Use

1. Read `DESIGN.md` in this folder in full. It is the complete specification: token values, component definitions, layout, elevation, responsive behaviour, and the do and do-not rules.
2. Copy its tokens into the semantic tier of the project token set. The frontmatter above repeats the core colour, type, and spacing values for quick lookup.
3. Build components from the `components` definitions in `DESIGN.md`. Do not invent variants it does not define.
4. Replace licensed typefaces with the fallbacks named in `DESIGN.md`.
5. Run `ui-code-linter` on the result. A preset sets the look; it does not waive contrast or accessibility rules.

## Boundaries

- This preset is a style reference for look and feel. Do not reproduce the company's logo, name, or trademarks, and do not present the result as that company's product.
- Where a preset value fails WCAG 2.2 AA contrast, adjust the value and record the change.
- For a style that is not tied to a company, use `skills/frontend/design-engineering/references/styles/token-packs/`.
