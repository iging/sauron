---
name: brand-wise
description: An interpretation of Wise's design language  -  a global money-transfer brand whose surface combines an unusually heavy near-black display sans (weight 900 at 64126 px) with a vivid lime-green brand accent, sage-tinted surface neutrals, and rounded white cards on a pale green-tinted canvas; the whole system reads more like a Scandinavian fintech magazine than a bank.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-wise
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#9fe870" on-primary: "#0e0f0c" primary-active: "#cdffad" primary-neutral: "#c5edab" primary-pale: "#e2f6d5" ink: "#0e0f0c" ink-deep: "#163300" body: "#454745" mute: "#868685" canvas: "#ffffff" canvas-soft: "#e8ebe6" positive: "#2ead4b" positive-deep: "#054d28" warning: "#ffd11a" warning-deep: "#b86700" warning-content: "#4a3b1c" negative: "#d03238" negative-deep: "#a72027" negative-darkest: "#a7000d" negative-bg: "#320707" accent-orange: "#ffc091" accent-cyan: "#38c8ff"'
typography: "display-mega: fontFamily: Wise Sans, Inter, system-ui, -apple-system, sans-serif fontSize: 126px fontWeight: 900 lineHeight: 107.1px display-xxl: fontFamily: Wise Sans, Inter, system-ui, sans-serif fontSize: 96px fontWeight: 900 lineHeight: 81.6px display-xl: fontFamily: Wise Sans, Inter, system-ui, sans-serif fontSize: 64px fontWeight: 900 lineHeight: 54.4px display-lg: fontFamily: Wise Sans, Inter, system-ui, sans-serif fontSize: 47px fontWeight: 400 lineHeight: 70.5px letterSpacing: -0.108px display-md: fontFamily: Wise Sans, Inter, system-ui, sans-serif fontSize: 40px fontWeight: 900 lineHeight: 34px display-sm: fontFamily: Inter, system-ui, sans-serif fontSize: 32px fontWeight: 600 lineHeight: 38.4px letterSpacing: -0.96px display-xs: fontFamily: Inter, system-ui, sans-serif fontSize: 24px fontWeight: 600 lineHeight: 31.2px letterSpacing: -0.48px body-lg: fontFamily: Inter, system-ui, sans-serif fontSize: 20px fontWeight: 400 lineHeight: 30px body-md: fontFamily: Inter, system-ui, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 24px body-md-strong: fontFamily: Inter, system-ui, sans-serif fontSize: 16px fontWeight: 600 lineHeight: 24px body-sm: fontFamily: Inter, system-ui, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 20px body-sm-strong: fontFamily: Inter, system-ui, sans-serif fontSize: 14px fontWeight: 600 lineHeight: 20px caption: fontFamily: Inter, system-ui, sans-serif fontSize: 12px fontWeight: 400 lineHeight: 16px button-md: fontFamily: Inter, system-ui, sans-serif fontSize: 16px fontWeight: 600 lineHeight: 24px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px 2xl: 32px 3xl: 48px"
---

# Brand Preset: `wise`

Apply the `wise`-inspired visual language to a project.

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
