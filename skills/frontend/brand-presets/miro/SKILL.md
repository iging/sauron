---
name: brand-miro
description: Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice  -  anchored by its signature canary yellow ({colors.brand-yellow}) wordmark over white canvas, broken open by colorful pastel feature tints (rose, teal, coral, orange, mint) that echo the actual sticky-note color palette used on the live whiteboard. Black-pill primary buttons dominate marketing, real Miro-board mockups serve as feature illustrations, and a 4-tier pricing grid leads into a dense comparison table. Roobert PRO carries display headlines; the system supports homepage, pricing, AI Workflows product page, agile vertical, and customer stories surfaces.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-miro
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#1c1c1e" on-primary: "#ffffff" brand-yellow: "#ffd02f" brand-yellow-deep: "#fcb900" yellow-light: "#fff4c4" yellow-dark: "#746019" brand-blue: "#4262ff" blue-450: "#5b76fe" blue-pressed: "#2a41b6" brand-coral: "#ff9999" coral-light: "#ffc6c6" coral-dark: "#600000" brand-rose: "#ffd8f4" rose-light: "#fde0f0" brand-pink: "#fde0f0" brand-teal: "#0fbcb0" teal-light: "#c3faf5" moss-dark: "#187574" brand-orange-light: "#ffe6cd" brand-red: "#fbd4d4" brand-red-dark: "#e3c5c5" success-accent: "#00b473" canvas: "#ffffff" surface: "#f7f8fa" surface-soft: "#fafbfc" surface-yellow: "#fff8e0" surface-pricing-featured: "#f5f3ff" hairline: "#e0e2e8" hairline-soft: "#eef0f3" hairline-strong: "#c7cad5" ink-deep: "#050038" ink: "#1c1c1e" charcoal: "#2c2c34" slate: "#555a6a" steel: "#6b6f7e" stone: "#8e91a0" muted: "#a5a8b5" on-dark: "#ffffff" on-dark-muted: "#a5a8b5" footer-bg: "#1c1c1e"'
typography: "hero-display: fontFamily: Roobert PRO fontSize: 80px fontWeight: 500 lineHeight: 1.05 letterSpacing: -2px display-lg: fontFamily: Roobert PRO fontSize: 60px fontWeight: 500 lineHeight: 1.10 letterSpacing: -1.5px heading-1: fontFamily: Roobert PRO fontSize: 48px fontWeight: 500 lineHeight: 1.15 letterSpacing: -1px heading-2: fontFamily: Roobert PRO fontSize: 36px fontWeight: 500 lineHeight: 1.20 letterSpacing: -0.5px heading-3: fontFamily: Roobert PRO fontSize: 28px fontWeight: 500 lineHeight: 1.25 heading-4: fontFamily: Roobert PRO fontSize: 22px fontWeight: 500 lineHeight: 1.30 heading-5: fontFamily: Roobert PRO fontSize: 18px fontWeight: 500 lineHeight: 1.40 subtitle: fontFamily: Roobert PRO fontSize: 18px fontWeight: 400 lineHeight: 1.50 body-md: fontFamily: Roobert PRO fontSize: 16px fontWeight: 400 lineHeight: 1.50 body-md-medium: fontFamily: Roobert PRO fontSize: 16px fontWeight: 500 lineHeight: 1.50 body-sm: fontFamily: Roobert PRO fontSize: 14px fontWeight: 400 lineHeight: 1.50 body-sm-medium: fontFamily: Roobert PRO fontSize: 14px fontWeight: 500 lineHeight: 1.50 caption: fontFamily: Roobert PRO fontSize: 13px fontWeight: 400 lineHeight: 1.40 caption-bold: fontFamily: Roobert PRO fontSize: 13px fontWeight: 600 lineHeight: 1.40 micro: fontFamily: Roobert PRO fontSize: 12px fontWeight: 500 lineHeight: 1.40 micro-uppercase: fontFamily: Roobert PRO fontSize: 11px fontWeight: 600 lineHeight: 1.40 letterSpacing: 0.5px button-md: fontFamily: Roobert PRO fontSize: 14px fontWeight: 500 lineHeight: 1.30 stat-display: fontFamily: Roobert PRO fontSize: 64px fontWeight: 500 lineHeight: 1.10 letterSpacing: -1.5px"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 96px hero: 120px"
---

# Brand Preset: `miro`

Apply the `miro`-inspired visual language to a project.

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
