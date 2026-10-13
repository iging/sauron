---
name: brand-notion
description: Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice  -  anchored by a deep navy hero band ({colors.brand-navy}) decorated with brand-colored sticky-note dots and mesh wire illustrations, a signature purple pill primary CTA ({colors.primary}), and a rich palette of pastel-tinted feature cards that echo the colorful database properties of the live product. The system uses a Notion-Sans (Inter-based) typeface across every UI surface, anchors a 4-tier pricing comparison (Free / Plus / Business / Enterprise), and presents the live workspace UI mockup directly inside the hero band. Coverage spans homepage, Enterprise, Product AI, Product Agents, Startups, and Pricing surfaces.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-notion
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#5645d4" primary-pressed: "#4534b3" primary-deep: "#3a2a99" on-primary: "#ffffff" brand-navy: "#0a1530" brand-navy-deep: "#070f24" brand-navy-mid: "#1a2a52" link-blue: "#0075de" link-blue-pressed: "#005bab" brand-orange: "#dd5b00" brand-orange-deep: "#793400" brand-pink: "#ff64c8" brand-pink-deep: "#a02e6d" brand-purple: "#7b3ff2" brand-purple-300: "#d6b6f6" brand-purple-800: "#391c57" brand-teal: "#2a9d99" brand-green: "#1aae39" brand-yellow: "#f5d75e" brand-brown: "#523410" card-tint-peach: "#ffe8d4" card-tint-rose: "#fde0ec" card-tint-mint: "#d9f3e1" card-tint-lavender: "#e6e0f5" card-tint-sky: "#dcecfa" card-tint-yellow: "#fef7d6" card-tint-yellow-bold: "#f9e79f" card-tint-cream: "#f8f5e8" card-tint-gray: "#f0eeec" canvas: "#ffffff" surface: "#f6f5f4" surface-soft: "#fafaf9" hairline: "#e5e3df" hairline-soft: "#ede9e4" hairline-strong: "#c8c4be" ink-deep: "#000000" ink: "#1a1a1a" charcoal: "#37352f" slate: "#5d5b54" steel: "#787671" stone: "#a4a097" muted: "#bbb8b1" on-dark: "#ffffff" on-dark-muted: "#a4a097" semantic-success: "#1aae39" semantic-warning: "#dd5b00" semantic-error: "#e03131"'
typography: "hero-display: fontFamily: Notion Sans fontSize: 80px fontWeight: 600 lineHeight: 1.05 letterSpacing: -2px display-lg: fontFamily: Notion Sans fontSize: 56px fontWeight: 600 lineHeight: 1.10 letterSpacing: -1px heading-1: fontFamily: Notion Sans fontSize: 48px fontWeight: 600 lineHeight: 1.15 letterSpacing: -0.5px heading-2: fontFamily: Notion Sans fontSize: 36px fontWeight: 600 lineHeight: 1.20 letterSpacing: -0.5px heading-3: fontFamily: Notion Sans fontSize: 28px fontWeight: 600 lineHeight: 1.25 heading-4: fontFamily: Notion Sans fontSize: 22px fontWeight: 600 lineHeight: 1.30 heading-5: fontFamily: Notion Sans fontSize: 18px fontWeight: 600 lineHeight: 1.40 subtitle: fontFamily: Notion Sans fontSize: 18px fontWeight: 400 lineHeight: 1.50 body-md: fontFamily: Notion Sans fontSize: 16px fontWeight: 400 lineHeight: 1.55 body-md-medium: fontFamily: Notion Sans fontSize: 16px fontWeight: 500 lineHeight: 1.55 body-sm: fontFamily: Notion Sans fontSize: 14px fontWeight: 400 lineHeight: 1.50 body-sm-medium: fontFamily: Notion Sans fontSize: 14px fontWeight: 500 lineHeight: 1.50 caption: fontFamily: Notion Sans fontSize: 13px fontWeight: 400 lineHeight: 1.40 caption-bold: fontFamily: Notion Sans fontSize: 13px fontWeight: 600 lineHeight: 1.40 micro: fontFamily: Notion Sans fontSize: 12px fontWeight: 500 lineHeight: 1.40 micro-uppercase: fontFamily: Notion Sans fontSize: 11px fontWeight: 600 lineHeight: 1.40 letterSpacing: 1px button-md: fontFamily: Notion Sans fontSize: 14px fontWeight: 500 lineHeight: 1.30"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 96px hero: 120px"
---

# Brand Preset: `notion`

Apply the `notion`-inspired visual language to a project.

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
