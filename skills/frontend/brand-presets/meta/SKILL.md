---
name: brand-meta
description: Meta's design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising voice. The system pairs a stark white canvas with full-bleed photographic product cards, a confident Optimistic VF wordmark/headline face, dual-CTA hero patterns (black primary + outlined secondary), and a saturated cobalt blue (#0064E0) for in-product purchase actions. Pill-shaped 100px-radius buttons, generous 24-32px card rounding, and tight three-tier text hierarchy carry across homepage, product detail (PDP), buy-now configurator, and accessory subpages.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-meta
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0064e0" primary-deep: "#0457cb" primary-soft: "#0091ff" on-primary: "#ffffff" ink-button: "#000000" on-ink-button: "#ffffff" fb-blue: "#1876f2" meta-link: "#385898" oculus-purple: "#a121ce" success: "#31a24c" success-bg: "#24e400" attention: "#f2a918" warning: "#f7b928" warning-bg: "#ffe200" critical: "#e41e3f" critical-strong: "#f0284a" canvas: "#ffffff" surface-soft: "#f1f4f7" ink-deep: "#0a1317" ink: "#1c1e21" charcoal: "#444950" slate: "#4b4c4f" steel: "#5d6c7b" stone: "#8595a4" hairline: "#ced0d4" hairline-soft: "#dee3e9" disabled-text: "#bcc0c4"'
typography: 'hero-display: fontFamily: Optimistic VF fontSize: 64px fontWeight: 500 lineHeight: 1.16 fontFeature: "ss01, ss02" display-lg: fontFamily: Optimistic VF fontSize: 48px fontWeight: 500 lineHeight: 1.17 fontFeature: "ss01, ss02" heading-lg: fontFamily: Optimistic VF fontSize: 36px fontWeight: 500 lineHeight: 1.28 fontFeature: "ss01, ss02" heading-md: fontFamily: Optimistic VF fontSize: 28px fontWeight: 300 lineHeight: 1.21 fontFeature: "ss01, ss02" heading-sm: fontFamily: Optimistic VF fontSize: 24px fontWeight: 500 lineHeight: 1.25 fontFeature: "ss01, ss02" subtitle-lg: fontFamily: Optimistic VF fontSize: 18px fontWeight: 700 lineHeight: 1.44 subtitle-md: fontFamily: Optimistic VF fontSize: 18px fontWeight: 400 lineHeight: 1.44 body-md-bold: fontFamily: Optimistic VF fontSize: 16px fontWeight: 700 lineHeight: 1.50 letterSpacing: -0.16px body-md: fontFamily: Optimistic VF fontSize: 16px fontWeight: 400 lineHeight: 1.50 letterSpacing: -0.16px body-sm-bold: fontFamily: Optimistic VF fontSize: 14px fontWeight: 700 lineHeight: 1.43 letterSpacing: -0.14px body-sm: fontFamily: Optimistic VF fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: -0.14px caption-bold: fontFamily: Optimistic VF fontSize: 12px fontWeight: 700 lineHeight: 1.33 caption: fontFamily: Optimistic VF fontSize: 12px fontWeight: 400 lineHeight: 1.33 button-md: fontFamily: Optimistic VF fontSize: 14px fontWeight: 700 lineHeight: 1.43 letterSpacing: -0.14px link-md: fontFamily: Optimistic VF fontSize: 16px fontWeight: 700 lineHeight: 1.50 letterSpacing: -0.16px'
spacing: "xxs: 4px xs: 8px sm: 10px md: 12px base: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 80px hero: 120px"
---

# Brand Preset: `meta`

Apply the `meta`-inspired visual language to a project.

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
