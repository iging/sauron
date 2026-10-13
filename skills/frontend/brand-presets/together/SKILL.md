---
name: brand-together
description: An interpretation of Together AI's design language  -  an AI infrastructure platform whose surface alternates between near-black hero bands (with a three-color orange-magenta-periwinkle gradient as the single piece of brand chrome) and bright white research / pricing / docs bands, knit together by a custom display sans and an uppercase mono eyebrow face.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-together
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" on-primary: "#ffffff" ink: "#000000" body: "#959494" hairline: "#959494" canvas: "#ffffff" canvas-dark: "#010120" surface-dark-soft: "#313641" on-dark: "#ffffff" accent-orange: "#fc4c02" accent-magenta: "#ef2cc1" accent-periwinkle: "#bdbbff" accent-mint: "#c8f6f9"'
typography: "display-xxl: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 64px fontWeight: 500 lineHeight: 70.4px letterSpacing: -1.92px display-xl: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 40px fontWeight: 500 lineHeight: 48px letterSpacing: -0.8px display-lg: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 28px fontWeight: 500 lineHeight: 32.2px letterSpacing: -0.42px display-md: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 22px fontWeight: 500 lineHeight: 25.3px letterSpacing: -0.22px body-lg: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 23.4px letterSpacing: -0.18px body-lg-strong: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 500 lineHeight: 23.4px letterSpacing: -0.18px body-md: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 20.8px letterSpacing: -0.16px body-md-strong: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 500 lineHeight: 20.8px letterSpacing: -0.16px caption: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 19.6px caption-strong: fontFamily: The Future, Inter, Helvetica Neue, Arial, sans-serif fontSize: 14px fontWeight: 500 lineHeight: 19.6px mono-caps-button: fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace fontSize: 16px fontWeight: 500 lineHeight: 16px letterSpacing: 0.08px mono-caps-eyebrow: fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace fontSize: 11px fontWeight: 500 lineHeight: 11px letterSpacing: 0.55px mono-caps-label: fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace fontSize: 11px fontWeight: 500 lineHeight: 15.4px letterSpacing: 0.055px mono-caption: fontFamily: PP Neue Montreal Mono, ui-monospace, SF Mono, Menlo, monospace fontSize: 10px fontWeight: 400 lineHeight: 14px letterSpacing: 0.05px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 20px 2xl: 24px 3xl: 32px 4xl: 44px 5xl: 48px 6xl: 55.2px section: 80px"
---

# Brand Preset: `together`

Apply the `together`-inspired visual language to a project.

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
