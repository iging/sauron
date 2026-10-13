---
name: brand-framer
description: '"A confident dark-canvas builder marketing site that treats the page like a working artboard  -  pure black surfaces, white display type set in GT Walsheim Medium with aggressive negative tracking, and a single confident blue (#0099ff) reserved for hyperlinks and selection states. The page rhythm is broken by oversized vibrant gradient atmosphere panels  -  magenta, violet, orange spotlights  -  that act as living showcase tiles, not decoration. Every CTA is a white pill on dark; every card is a translucent or charcoal surface; every section title pulls letter-spacing tight enough to feel like a poster."'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-framer
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ffffff" on-primary: "#000000" accent-blue: "#0099ff" ink: "#ffffff" ink-muted: "#999999" canvas: "#090909" surface-1: "#141414" surface-2: "#1c1c1c" hairline: "#262626" hairline-soft: "#1a1a1a" inverse-canvas: "#ffffff" inverse-ink: "#000000" gradient-magenta: "#d44df0" gradient-violet: "#6a4cf5" gradient-orange: "#ff7a3d" gradient-coral: "#ff5577" semantic-success: "#22c55e"'
typography: "display-xxl: fontFamily: GT Walsheim Framer Medium fontSize: 110px fontWeight: 500 lineHeight: 0.85 letterSpacing: -5.5px display-xl: fontFamily: GT Walsheim Medium fontSize: 85px fontWeight: 500 lineHeight: 0.95 letterSpacing: -4.25px fontFeature: ss02 display-lg: fontFamily: GT Walsheim Medium fontSize: 62px fontWeight: 500 lineHeight: 1.00 letterSpacing: -3.1px fontFeature: ss02 display-md: fontFamily: GT Walsheim Medium fontSize: 32px fontWeight: 500 lineHeight: 1.13 letterSpacing: -1.0px headline: fontFamily: Inter fontSize: 22px fontWeight: 700 lineHeight: 1.20 letterSpacing: -0.8px fontFeature: cv05 subhead: fontFamily: Inter Variable fontSize: 24px fontWeight: 400 lineHeight: 1.30 letterSpacing: -0.01px fontFeature: cv11 body-lg: fontFamily: Inter Variable fontSize: 18px fontWeight: 400 lineHeight: 1.30 letterSpacing: -0.18px fontFeature: cv11 body: fontFamily: Inter Variable fontSize: 15px fontWeight: 400 lineHeight: 1.30 letterSpacing: -0.15px fontFeature: cv11 body-sm: fontFamily: Inter Variable fontSize: 14px fontWeight: 500 lineHeight: 1.40 letterSpacing: -0.14px fontFeature: cv11 caption: fontFamily: Inter Variable fontSize: 13px fontWeight: 500 lineHeight: 1.20 letterSpacing: -0.13px fontFeature: cv11 micro: fontFamily: Inter Variable fontSize: 12px fontWeight: 400 lineHeight: 1.20 letterSpacing: -0.12px fontFeature: cv11 button: fontFamily: Inter Variable fontSize: 14px fontWeight: 500 lineHeight: 1.0 letterSpacing: -0.14px fontFeature: cv11"
spacing: "hair: 1px xxs: 4px xs: 8px sm: 12px md: 15px lg: 20px xl: 30px xxl: 40px section: 96px"
---

# Brand Preset: `framer`

Apply the `framer`-inspired visual language to a project.

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
