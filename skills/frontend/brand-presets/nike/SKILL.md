---
name: brand-nike
description: "| A photography-first commerce system built on extreme typographic contrast  -  towering uppercase Futura display lockups burned into editorial campaign imagery, sitting above a dense, neutral, near-monochrome retail chrome of pill-shaped black CTAs, gray search and tag pills, and tight 8px-grid product cards. The brand's voice is athletic, kinetic, and absolute: pure black, pure white, a single soft surface gray, and a deliberately small set of semantic accents (sale red, success green, restrained category tints)  -  every chromatic moment is reserved for editorial photography or pricing signal, never decorative chrome."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-nike
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#111111" on-primary: "#ffffff" canvas: "#ffffff" soft-cloud: "#f5f5f5" ink: "#111111" charcoal: "#39393b" ash: "#4b4b4d" mute: "#707072" stone: "#9e9ea0" hairline: "#cacacb" hairline-soft: "#e5e5e5" sale: "#d30005" sale-deep: "#780700" success: "#007d48" success-bright: "#1eaa52" info: "#1151ff" info-deep: "#0034e3" accent-pink: "#ed1aa0" accent-pink-soft: "#ffb0dd" accent-purple-soft: "#beaffd" accent-purple-pale: "#d6d1ff" accent-teal: "#0a7281" accent-pink-deep: "#4c012d"'
typography: "display-campaign: fontFamily: Nike Futura ND fontSize: 96px fontWeight: 500 lineHeight: 0.9 letterSpacing: 0 textTransform: uppercase heading-xl: fontFamily: Helvetica Now Display Medium fontSize: 32px fontWeight: 500 lineHeight: 1.2 letterSpacing: 0 heading-lg: fontFamily: Helvetica Now Display Medium fontSize: 24px fontWeight: 500 lineHeight: 1.2 letterSpacing: 0 heading-md: fontFamily: Helvetica Now Display Medium fontSize: 16px fontWeight: 500 lineHeight: 1.75 letterSpacing: 0 body-md: fontFamily: Helvetica Now Text fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-strong: fontFamily: Helvetica Now Text Medium fontSize: 16px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 button-lg: fontFamily: Helvetica Now Display Medium fontSize: 24px fontWeight: 500 lineHeight: 1.2 letterSpacing: 0 button-md: fontFamily: Helvetica Now Text Medium fontSize: 16px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 button-sm: fontFamily: Helvetica Now Text Medium fontSize: 14px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 link-md: fontFamily: Helvetica Now Text fontSize: 16px fontWeight: 500 lineHeight: 1.75 letterSpacing: 0 textDecoration: underline caption-md: fontFamily: Helvetica Now Text Medium fontSize: 14px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 caption-sm: fontFamily: Helvetica Now Text Medium fontSize: 12px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 utility-xs: fontFamily: Helvetica Neue fontSize: 9px fontWeight: 500 lineHeight: 1.75 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 18px xl: 24px xxl: 30px section: 48px"
---

# Brand Preset: `nike`

Apply the `nike`-inspired visual language to a project.

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
