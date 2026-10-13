---
name: brand-warp
description: An interpretation of Warp's design language  -  an agentic terminal-and-development-environment brand whose surface is a warm near-charcoal canvas (a tint warmer than pure black), broken only by clean Inter typography, the occasional Instrument Serif italic moment, and dense terminal-mockup imagery; CTAs are unusually understated, with shape geometry running tighter than most marketing sites.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-warp
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#f7f5f0" on-primary: "#2b2622" ink: "#f7f5f0" body: "#c9c0ad" body-strong: "#dad2c1" mute: "#aea69c" canvas: "#2b2622" canvas-soft: "#383330" hairline: "#3f3a36"'
typography: 'display-xl: fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif fontSize: 64px fontWeight: 400 lineHeight: 70.4px letterSpacing: -1.6px display-lg: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 48px fontWeight: 400 lineHeight: 52.8px letterSpacing: -1.2px display-md: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 32px fontWeight: 500 lineHeight: 40px letterSpacing: -0.8px display-sm: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 24px fontWeight: 500 lineHeight: 32px letterSpacing: -0.4px display-serif: fontFamily: Instrument Serif, Georgia, "Times New Roman", serif fontSize: 48px fontWeight: 400 lineHeight: 52px letterSpacing: -0.5px body-lg: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 28px body-md: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 24px body-md-strong: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 16px fontWeight: 500 lineHeight: 24px body-sm: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 20px body-sm-strong: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 14px fontWeight: 500 lineHeight: 20px caption: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 12px fontWeight: 400 lineHeight: 16px code: fontFamily: DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace fontSize: 13px fontWeight: 400 lineHeight: 18px code-md: fontFamily: DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace fontSize: 14px fontWeight: 400 lineHeight: 20px button-md: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 14px fontWeight: 500 lineHeight: 20px'
spacing: "xxs: 2px xs: 4px sm: 8px md: 10px lg: 16px xl: 24px 2xl: 32px 3xl: 48px 4xl: 64px 5xl: 96px"
---

# Brand Preset: `warp`

Apply the `warp`-inspired visual language to a project.

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
