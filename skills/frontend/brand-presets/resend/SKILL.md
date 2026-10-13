---
name: brand-resend
description: "| Resend's marketing surfaces sit on a near-pure black canvas with off-white text and a single signature color  -  the deep editorial-serif Domaine Display headline mark  -  that gives an otherwise utilitarian developer-tool brand its print-magazine confidence. The system pairs Domaine Display (oversized 76px96px serif, ss01/ss04/ss11 features on) with ABC Favorit for body and Inter for UI. Surfaces rely on subtle 69% opacity gradient glows, hairline 1px borders made from translucent white, and a strict rounded-12px container vocabulary. There is no decorative chrome  -  just type, code, and atmospheric depth."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-resend
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#fcfdff" primary-on: "#000000" ink: "#fcfdff" body: "rgba(252,253,255,0.86)" charcoal: "rgba(252,253,255,0.7)" mute: "#a1a4a5" ash: "#888e90" stone: "#464a4d" on-light: "#000000" on-light-mute: "rgba(0,0,51,0.7)" canvas: "#000000" surface-card: "#0a0a0c" surface-elevated: "#101012" surface-deep: "#06060a" hairline: "rgba(255,255,255,0.06)" hairline-strong: "rgba(255,255,255,0.14)" divider-soft: "rgba(255,255,255,0.04)" accent-orange: "#ff801f" accent-orange-glow: "rgba(255,89,0,0.22)" accent-yellow: "#ffc53d" accent-blue: "#3b9eff" accent-blue-glow: "rgba(0,117,255,0.34)" accent-green: "#11ff99" accent-green-glow: "rgba(34,255,153,0.18)" accent-red: "#ff2047" accent-red-glow: "rgba(255,32,71,0.34)" link: "#3b9eff" surface-light: "#f1f7fe"'
typography: 'display-xxl: fontFamily: Domaine Display fontSize: 96px fontWeight: 400 lineHeight: 1.0 letterSpacing: -0.96px fontFeature: "ss01, ss04, ss11" display-xl: fontFamily: Domaine Display fontSize: 76.8px fontWeight: 400 lineHeight: 1.0 letterSpacing: -0.768px fontFeature: "ss01, ss04, ss11" display-lg: fontFamily: ABC Favorit fontSize: 56px fontWeight: 400 lineHeight: 1.2 letterSpacing: -2.8px fontFeature: "ss01, ss04, ss11" heading-md: fontFamily: Inter fontSize: 24px fontWeight: 500 lineHeight: 1.5 letterSpacing: -0.4px heading-sm: fontFamily: Inter fontSize: 20px fontWeight: 500 lineHeight: 1.3 letterSpacing: -0.3px subtitle: fontFamily: ABC Favorit fontSize: 20px fontWeight: 400 lineHeight: 1.3 fontFeature: "ss01, ss04, ss11" body-lg: fontFamily: Inter fontSize: 18px fontWeight: 400 lineHeight: 1.5 body-md: fontFamily: ABC Favorit fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: -0.8px fontFeature: "ss01, ss04, ss11" body-sm: fontFamily: Inter fontSize: 14px fontWeight: 400 lineHeight: 1.43 button-md: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.43 button-sm: fontFamily: ABC Favorit fontSize: 14px fontWeight: 500 lineHeight: 1.43 letterSpacing: 0.35px fontFeature: "ss01, ss03, ss04" caption: fontFamily: Inter fontSize: 12px fontWeight: 400 lineHeight: 1.5 caption-emph: fontFamily: Helvetica fontSize: 14px fontWeight: 600 lineHeight: 1.0 code-md: fontFamily: Geist Mono fontSize: 13px fontWeight: 400 lineHeight: 1.6'
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px xxxl: 48px section: 96px band: 128px"
---

# Brand Preset: `resend`

Apply the `resend`-inspired visual language to a project.

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
