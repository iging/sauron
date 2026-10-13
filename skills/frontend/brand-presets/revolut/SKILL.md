---
name: brand-revolut
description: "| Revolut's marketing surfaces pair a stark black canvas with the brand's cobalt-violet (`#494fdf`) and a wide accent palette of deep, fully-saturated product colours  -  teal, light-blue, deep pink, light-green, warning orange. The system reads as fintech-meets-product-brochure: oversized 80px136px Aeonik Pro display headlines, generous whitespace, photography-led hero bands, and full-width product mockups (cards, phones, terminals) shown as hero objects inside near-black sections. Most surfaces are either black or off-white; pill-shaped buttons and rounded-12/20px content cards carry the consumer-financial-app feel without crossing into playful territory."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-revolut
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#494fdf" primary-bright: "#4f55f1" primary-deep: "#3a40c4" on-primary: "#ffffff" ink: "#191c1f" body: "#1f2226" charcoal: "#3a3d40" mute: "#505a63" ash: "#5c5e60" stone: "#8d969e" faint: "#c9c9cd" on-dark: "#ffffff" on-dark-mute: "rgba(255,255,255,0.72)" canvas-light: "#ffffff" canvas-dark: "#000000" surface-soft: "#f4f4f4" surface-card: "#ffffff" surface-deep: "#0a0a0a" surface-elevated: "#16181a" hairline-light: "#e2e2e7" hairline-dark: "rgba(255,255,255,0.12)" hairline-strong: "#191c1f" divider-soft: "rgba(255,255,255,0.06)" accent-teal: "#00a87e" accent-blue-link: "#376cd5" accent-light-blue: "#007bc2" accent-light-green: "#428619" accent-green-text: "#006400" accent-yellow: "#b09000" accent-warning: "#ec7e00" accent-pink: "#e61e49" accent-danger: "#e23b4a" accent-deep-red: "#8b0000" accent-brown: "#936d62" link: "#376cd5"'
typography: "display-xxl: fontFamily: Aeonik Pro fontSize: 136px fontWeight: 500 lineHeight: 1.0 letterSpacing: -2.72px display-xl: fontFamily: Aeonik Pro fontSize: 80px fontWeight: 500 lineHeight: 1.0 letterSpacing: -0.8px display-lg: fontFamily: Aeonik Pro fontSize: 48px fontWeight: 500 lineHeight: 1.21 letterSpacing: -0.48px display-md: fontFamily: Aeonik Pro fontSize: 40px fontWeight: 500 lineHeight: 1.2 letterSpacing: -0.4px heading-lg: fontFamily: Aeonik Pro fontSize: 32px fontWeight: 500 lineHeight: 1.19 letterSpacing: -0.32px heading-md: fontFamily: Aeonik Pro fontSize: 24px fontWeight: 500 lineHeight: 1.33 letterSpacing: 0 heading-sm: fontFamily: Aeonik Pro fontSize: 20px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 body-lg: fontFamily: Inter fontSize: 18px fontWeight: 400 lineHeight: 1.56 letterSpacing: -0.09px body-md: fontFamily: Inter fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.24px body-md-bold: fontFamily: Inter fontSize: 16px fontWeight: 600 lineHeight: 1.5 letterSpacing: 0.16px body-sm: fontFamily: Inter fontSize: 14px fontWeight: 400 lineHeight: 1.43 button-lg: fontFamily: Aeonik Pro fontSize: 20px fontWeight: 500 lineHeight: 1.4 button-md: fontFamily: Inter fontSize: 16px fontWeight: 600 lineHeight: 1.5 letterSpacing: 0.24px button-sm: fontFamily: Inter fontSize: 14px fontWeight: 600 lineHeight: 1.43 caption: fontFamily: Inter fontSize: 13px fontWeight: 400 lineHeight: 1.4 link-emph: fontFamily: Inter fontSize: 16px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0.24px"
spacing: "xxs: 4px xs: 6px sm: 8px md: 14px lg: 16px xl: 24px xxl: 32px xxxl: 48px block: 80px section: 88px band: 120px"
---

# Brand Preset: `revolut`

Apply the `revolut`-inspired visual language to a project.

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
