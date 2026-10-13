---
name: brand-elevenlabs
description: 'A voice-AI brand whose marketing surfaces read like a quietly editorial print magazine. The base canvas is off-white (`#f5f5f5`) holding warm near-black ink (`#292524`); the brand voltage is photographic, not chromatic  -  soft pastel atmospheric gradient orbs (mint  peach  lavender  sky) drift through the page as the only "color" moments. Display runs Waldenburg Light at weight 300  -  the editorial signature. Inter carries body, navigation, captions. CTAs are subtle: a near-black ink pill is the primary, a transparent outline is the secondary. The brand trusts atmospheric photography and modest type weights to do all of the brand work; there is no neon accent, no saturated CTA color, no developer-tools dark canvas.'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-elevenlabs
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#292524" primary-active: "#0c0a09" ink: "#0c0a09" body: "#4e4e4e" body-strong: "#292524" muted: "#777169" muted-soft: "#a8a29e" hairline: "#e7e5e4" hairline-soft: "#f0efed" hairline-strong: "#d6d3d1" canvas: "#f5f5f5" canvas-soft: "#fafafa" canvas-deep: "#0c0a09" surface-card: "#ffffff" surface-strong: "#f0efed" surface-dark: "#0c0a09" surface-dark-elevated: "#1c1917" on-primary: "#ffffff" on-dark: "#ffffff" on-dark-soft: "#a8a29e" gradient-mint: "#a7e5d3" gradient-peach: "#f4c5a8" gradient-lavender: "#c8b8e0" gradient-sky: "#a8c8e8" gradient-rose: "#e8b8c4" semantic-error: "#dc2626" semantic-success: "#16a34a"'
typography: "display-mega: fontFamily: \"'Waldenburg', 'Times New Roman', serif\" fontSize: 64px fontWeight: 300 lineHeight: 1.05 letterSpacing: -1.92px display-xl: fontFamily: \"'Waldenburg', serif\" fontSize: 48px fontWeight: 300 lineHeight: 1.08 letterSpacing: -0.96px display-lg: fontFamily: \"'Waldenburg', serif\" fontSize: 36px fontWeight: 300 lineHeight: 1.17 letterSpacing: -0.36px display-md: fontFamily: \"'Waldenburg', serif\" fontSize: 32px fontWeight: 300 lineHeight: 1.13 letterSpacing: -0.32px display-sm: fontFamily: \"'Waldenburg', serif\" fontSize: 24px fontWeight: 300 lineHeight: 1.2 letterSpacing: 0 title-md: fontFamily: \"'Inter', sans-serif\" fontSize: 20px fontWeight: 500 lineHeight: 1.35 letterSpacing: 0 title-sm: fontFamily: \"'Inter', sans-serif\" fontSize: 18px fontWeight: 500 lineHeight: 1.44 letterSpacing: 0.18px body-md: fontFamily: \"'Inter', sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.16px body-strong: fontFamily: \"'Inter', sans-serif\" fontSize: 16px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0.16px body-sm: fontFamily: \"'Inter', sans-serif\" fontSize: 15px fontWeight: 400 lineHeight: 1.47 letterSpacing: 0.15px caption: fontFamily: \"'Inter', sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption-uppercase: fontFamily: \"'Inter', sans-serif\" fontSize: 12px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0.96px textTransform: uppercase button: fontFamily: \"'Inter', sans-serif\" fontSize: 15px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 nav-link: fontFamily: \"'Inter', sans-serif\" fontSize: 15px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px base: 16px md: 20px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `elevenlabs`

Apply the `elevenlabs`-inspired visual language to a project.

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
