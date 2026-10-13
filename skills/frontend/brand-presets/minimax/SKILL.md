---
name: brand-minimax
description: MiniMax presents itself as a premium AI infrastructure brand through a striking duality  -  bold black-pill CTAs and stark white canvas for marketing, paired with vibrant gradient product cards (orange-red, magenta-pink, purple, blue) that turn each model release into a distinctive visual identity. The system uses DM Sans across all surfaces, employs an oversized 80px hero display, anchors major actions in deep near-black pills, and layers content density via a 3-column documentation grid with sidebar nav, prose body, and TOC. Coverage spans the marketing homepage, model showcase pages, developer documentation, and platform pricing surfaces.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-minimax
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0a0a0a" on-primary: "#ffffff" primary-soft: "#181e25" brand-coral: "#ff5530" brand-magenta: "#ea5ec1" brand-blue: "#1456f0" brand-blue-mid: "#3b82f6" brand-blue-deep: "#1d4ed8" brand-blue-700: "#17437d" brand-cyan: "#3daeff" brand-blue-200: "#bfdbfe" brand-purple: "#a855f7" canvas: "#ffffff" surface: "#f7f8fa" surface-soft: "#f2f3f5" hairline: "#e5e7eb" hairline-soft: "#eaecf0" ink: "#0a0a0a" ink-strong: "#000000" charcoal: "#222222" slate: "#45515e" steel: "#5f5f5f" stone: "#8e8e93" muted: "#a8aab2" success-bg: "#e8ffea" success-text: "#1ba673" on-dark: "#ffffff" footer-bg: "#0a0a0a"'
typography: "hero-display: fontFamily: DM Sans fontSize: 80px fontWeight: 600 lineHeight: 1.10 letterSpacing: -2px display-lg: fontFamily: DM Sans fontSize: 56px fontWeight: 600 lineHeight: 1.10 letterSpacing: -1.5px heading-lg: fontFamily: DM Sans fontSize: 40px fontWeight: 600 lineHeight: 1.20 letterSpacing: -1px heading-md: fontFamily: DM Sans fontSize: 32px fontWeight: 600 lineHeight: 1.25 letterSpacing: -0.5px heading-sm: fontFamily: DM Sans fontSize: 24px fontWeight: 600 lineHeight: 1.30 card-title: fontFamily: DM Sans fontSize: 20px fontWeight: 600 lineHeight: 1.40 subtitle: fontFamily: DM Sans fontSize: 18px fontWeight: 500 lineHeight: 1.50 body-md: fontFamily: DM Sans fontSize: 16px fontWeight: 400 lineHeight: 1.50 body-md-bold: fontFamily: DM Sans fontSize: 16px fontWeight: 700 lineHeight: 1.50 body-sm: fontFamily: DM Sans fontSize: 14px fontWeight: 400 lineHeight: 1.50 body-sm-medium: fontFamily: DM Sans fontSize: 14px fontWeight: 500 lineHeight: 1.50 caption: fontFamily: DM Sans fontSize: 13px fontWeight: 400 lineHeight: 1.70 caption-bold: fontFamily: DM Sans fontSize: 13px fontWeight: 600 lineHeight: 1.50 micro: fontFamily: DM Sans fontSize: 12px fontWeight: 400 lineHeight: 1.50 button-md: fontFamily: DM Sans fontSize: 14px fontWeight: 600 lineHeight: 1.40"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 80px hero: 96px"
---

# Brand Preset: `minimax`

Apply the `minimax`-inspired visual language to a project.

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
