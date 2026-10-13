---
name: brand-mongodb
description: MongoDB carries a strong dual-mode visual identity  -  dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired with stark white documentation surfaces. The signature green pill button is unmistakable across product, pricing, learning, and AI use-case surfaces. The system uses Euclid Circular A as its display face, anchors a 3-tier pricing comparison (Free / Flex / Dedicated), and presents extensive course catalogs in card grids with colored category tags. Coverage spans homepage, Atlas product page, Community Edition, MongoDB University, AI use cases, and pricing.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-mongodb
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#00ed64" primary-deep: "#00b545" primary-pressed: "#008c34" on-primary: "#001e2b" brand-green: "#00ed64" brand-green-dark: "#00684a" brand-green-mid: "#00a35c" brand-green-soft: "#c3f0d2" brand-teal-deep: "#001e2b" brand-teal: "#003d4f" brand-teal-mid: "#00684a" accent-purple: "#7b3ff2" accent-orange: "#fa6e39" accent-pink: "#f06bb8" accent-blue: "#3d4f9f" semantic-warning-bg: "#fff8e0" semantic-warning-text: "#946f3f" canvas: "#ffffff" canvas-dark: "#001e2b" surface: "#f9fbfa" surface-soft: "#f4f7f6" surface-feature: "#e3fcef" hairline: "#e1e5e8" hairline-soft: "#eceff1" hairline-strong: "#c1ccd6" hairline-dark: "#1c2d38" ink: "#001e2b" charcoal: "#1c2d38" slate: "#3d4f5b" steel: "#5c6c7a" stone: "#7c8c9a" muted: "#a8b3bc" on-dark: "#ffffff" on-dark-muted: "#a8b3bc"'
typography: "hero-display: fontFamily: Euclid Circular A fontSize: 72px fontWeight: 500 lineHeight: 1.10 letterSpacing: -1.5px display-lg: fontFamily: Euclid Circular A fontSize: 56px fontWeight: 500 lineHeight: 1.15 letterSpacing: -1px heading-1: fontFamily: Euclid Circular A fontSize: 48px fontWeight: 500 lineHeight: 1.20 letterSpacing: -0.5px heading-2: fontFamily: Euclid Circular A fontSize: 36px fontWeight: 500 lineHeight: 1.25 letterSpacing: -0.5px heading-3: fontFamily: Euclid Circular A fontSize: 28px fontWeight: 500 lineHeight: 1.30 heading-4: fontFamily: Euclid Circular A fontSize: 22px fontWeight: 500 lineHeight: 1.35 heading-5: fontFamily: Euclid Circular A fontSize: 18px fontWeight: 600 lineHeight: 1.40 subtitle: fontFamily: Euclid Circular A fontSize: 18px fontWeight: 400 lineHeight: 1.50 body-md: fontFamily: Euclid Circular A fontSize: 16px fontWeight: 400 lineHeight: 1.55 body-md-medium: fontFamily: Euclid Circular A fontSize: 16px fontWeight: 500 lineHeight: 1.55 body-sm: fontFamily: Euclid Circular A fontSize: 14px fontWeight: 400 lineHeight: 1.50 body-sm-medium: fontFamily: Euclid Circular A fontSize: 14px fontWeight: 500 lineHeight: 1.50 caption: fontFamily: Euclid Circular A fontSize: 13px fontWeight: 400 lineHeight: 1.40 caption-bold: fontFamily: Euclid Circular A fontSize: 13px fontWeight: 600 lineHeight: 1.40 micro: fontFamily: Euclid Circular A fontSize: 12px fontWeight: 500 lineHeight: 1.40 micro-uppercase: fontFamily: Euclid Circular A fontSize: 11px fontWeight: 600 lineHeight: 1.40 letterSpacing: 1px button-md: fontFamily: Euclid Circular A fontSize: 14px fontWeight: 600 lineHeight: 1.30 code-md: fontFamily: Source Code Pro fontSize: 14px fontWeight: 400 lineHeight: 1.55"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 96px hero: 120px"
---

# Brand Preset: `mongodb`

Apply the `mongodb`-inspired visual language to a project.

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
