---
name: brand-mistral
description: Mistral AI brands itself with a singular signature  -  atmospheric sunset gradients (mustard, orange, deep red) layered over photography of mountains, plus a horizontal "sunset stripe" bar that closes every page. The system pairs warm cream-yellow surfaces ({colors.cream}) with a saturated orange primary CTA ({colors.primary}) and uses an near-serif voice for hero displays. Coverage spans homepage (Frontier AI hero), Le Studio product page, Coding solutions, news article surfaces, contact form, and services tier page  -  all anchored by the signature gradient closing band.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-mistral
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#fa520f" primary-deep: "#cc3a05" on-primary: "#ffffff" sunshine-300: "#ffd06a" sunshine-500: "#ffb83e" sunshine-700: "#ffa110" sunshine-800: "#ff8105" sunshine-900: "#ff8a00" yellow-saturated: "#ffd900" cream: "#fff8e0" cream-light: "#fffaeb" cream-deeper: "#fff0c2" beige-deep: "#e6d5a8" block-5: "#ffe295" block-6: "#ffd900" block-7: "#ff8105" ink: "#1f1f1f" ink-tint: "#3d3d3d" charcoal: "#2c2c2c" slate: "#4a4a4a" steel: "#6a6a6a" stone: "#8a8a8a" muted: "#a8a8a8" hairline: "#e5e5e5" hairline-soft: "#ededed" hairline-strong: "#c7c7c7" canvas: "#ffffff" surface: "#fafafa" surface-cream: "#fff8e0" surface-cream-soft: "#fffaeb" surface-code: "#1c1c1e" on-dark: "#ffffff" on-dark-muted: "#a8a8a8" on-cream: "#1f1f1f" footer-cream: "#fff8e0" link: "#fa520f"'
typography: "hero-display: fontFamily: PP Editorial Old fontSize: 84px fontWeight: 400 lineHeight: 1.05 letterSpacing: -1.5px display-lg: fontFamily: PP Editorial Old fontSize: 64px fontWeight: 400 lineHeight: 1.10 letterSpacing: -1px heading-1: fontFamily: PP Editorial Old fontSize: 52px fontWeight: 400 lineHeight: 1.15 letterSpacing: -0.5px heading-2: fontFamily: Inter fontSize: 36px fontWeight: 500 lineHeight: 1.20 letterSpacing: -0.5px heading-3: fontFamily: Inter fontSize: 28px fontWeight: 500 lineHeight: 1.25 heading-4: fontFamily: Inter fontSize: 22px fontWeight: 500 lineHeight: 1.30 heading-5: fontFamily: Inter fontSize: 18px fontWeight: 500 lineHeight: 1.40 subtitle: fontFamily: Inter fontSize: 18px fontWeight: 400 lineHeight: 1.50 body-md: fontFamily: Inter fontSize: 16px fontWeight: 400 lineHeight: 1.55 body-md-medium: fontFamily: Inter fontSize: 16px fontWeight: 500 lineHeight: 1.55 body-sm: fontFamily: Inter fontSize: 14px fontWeight: 400 lineHeight: 1.50 body-sm-medium: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.50 caption: fontFamily: Inter fontSize: 13px fontWeight: 400 lineHeight: 1.40 caption-bold: fontFamily: Inter fontSize: 13px fontWeight: 600 lineHeight: 1.40 micro: fontFamily: Inter fontSize: 12px fontWeight: 500 lineHeight: 1.40 micro-uppercase: fontFamily: Inter fontSize: 11px fontWeight: 600 lineHeight: 1.40 letterSpacing: 1px button-md: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.30 stat-display: fontFamily: PP Editorial Old fontSize: 56px fontWeight: 400 lineHeight: 1.10 letterSpacing: -1px code-md: fontFamily: JetBrains Mono fontSize: 14px fontWeight: 400 lineHeight: 1.50"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 96px hero: 120px"
---

# Brand Preset: `mistral`

Apply the `mistral`-inspired visual language to a project.

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
