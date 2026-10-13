---
name: brand-replicate
description: "| Replicate's marketing surfaces pair the warm-cream developer-tools aesthetic of an indie ML playground with a confident hot-orange brand accent and a signature display typeface (rb-freigeist-neue) sized aggressively large at 72px+. The system reads as \"AI lab notebook crossed with print magazine\": cream and bone surfaces, dark ink type, monospace code wells, irregular hand-drawn-feeling diagrams, and a rich orange used scarcely on the most consequential CTA. Photography of contributors and example outputs is square-ish with mid-radius corners; everything else is borderless or hairline."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-replicate
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ea2804" primary-deep: "#c01f00" on-primary: "#ffffff" ink: "#202020" body: "#3a3a3a" charcoal: "#575757" mute: "#646464" ash: "#8d8d8d" stone: "#bbbbbb" on-dark: "#fcfcfc" on-dark-mute: "rgba(252,252,252,0.72)" canvas: "#f9f7f3" surface-bone: "#f3f0e8" surface-card: "#ffffff" surface-dark: "#202020" surface-deep: "#000000" hairline: "rgba(32,32,32,0.12)" hairline-strong: "#202020" divider-dark: "rgba(255,255,255,0.2)" hero-warm: "#ea2804" hero-glow: "#ff6a3d" hero-pink: "#f4a8a0" badge-success: "#2b9a66" link: "#ea2804" ring-focus: "rgba(59,130,246,0.5)" github-dark: "#24292e"'
typography: "display-xxl: fontFamily: rb-freigeist-neue fontSize: 128px fontWeight: 700 lineHeight: 1.0 letterSpacing: -3px display-xl: fontFamily: rb-freigeist-neue fontSize: 72px fontWeight: 700 lineHeight: 1.0 letterSpacing: -1.8px display-lg: fontFamily: rb-freigeist-neue fontSize: 48px fontWeight: 700 lineHeight: 1.0 letterSpacing: -1px display-md: fontFamily: rb-freigeist-neue fontSize: 30px fontWeight: 600 lineHeight: 1.2 letterSpacing: -0.5px heading-lg: fontFamily: basier-square fontSize: 38.4px fontWeight: 600 lineHeight: 0.83 letterSpacing: -0.5px heading-md: fontFamily: basier-square fontSize: 24px fontWeight: 600 lineHeight: 1.33 letterSpacing: -0.35px heading-sm: fontFamily: basier-square fontSize: 20px fontWeight: 600 lineHeight: 1.4 letterSpacing: -0.3px subtitle: fontFamily: rb-freigeist-neue fontSize: 18px fontWeight: 600 lineHeight: 1.56 letterSpacing: 0 body-lg: fontFamily: basier-square fontSize: 18px fontWeight: 400 lineHeight: 1.56 letterSpacing: 0 body-md: fontFamily: basier-square fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: basier-square fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 button-md: fontFamily: basier-square fontSize: 16px fontWeight: 600 lineHeight: 1.0 letterSpacing: 0 button-sm: fontFamily: basier-square fontSize: 14px fontWeight: 600 lineHeight: 1.0 letterSpacing: 0 caption: fontFamily: basier-square fontSize: 12px fontWeight: 400 lineHeight: 1.33 letterSpacing: 0 caption-tight: fontFamily: basier-square fontSize: 14px fontWeight: 600 lineHeight: 1.43 letterSpacing: -0.35px code-md: fontFamily: jetbrains-mono fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 code-sm: fontFamily: jetbrains-mono fontSize: 11px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px xxxl: 48px section: 96px band: 160px"
---

# Brand Preset: `replicate`

Apply the `replicate`-inspired visual language to a project.

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
