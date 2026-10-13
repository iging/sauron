---
name: brand-uber
description: An interpretation of Uber's design language  -  a transportation-and-delivery super-app brand whose web surface is a black-and-white duet, framed by a custom geometric display sans, accented by a single signature pill shape (radius 999px) on every interactive element, and decorated only by editorial 4:3 illustrations of riders, drivers, and city objects.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-uber
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" on-primary: "#ffffff" ink: "#000000" body: "#5e5e5e" mute: "#afafaf" hairline-mid: "#4b4b4b" canvas: "#ffffff" canvas-soft: "#efefef" canvas-softer: "#f3f3f3" surface-pressed: "#e2e2e2" link: "#0000ee" on-dark: "#ffffff" black-elevated: "#282828"'
typography: "display-xxl: fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 52px fontWeight: 700 lineHeight: 64px display-xl: fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 36px fontWeight: 700 lineHeight: 44px display-lg: fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 32px fontWeight: 700 lineHeight: 40px display-md: fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 24px fontWeight: 700 lineHeight: 32px display-sm: fontFamily: UberMove, UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 20px fontWeight: 700 lineHeight: 28px body-lg: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 500 lineHeight: 24px body-md: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 24px body-md-strong: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 500 lineHeight: 20px body-sm: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 20px body-sm-strong: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 14px fontWeight: 500 lineHeight: 16px caption: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 12px fontWeight: 400 lineHeight: 20px button-large: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 500 lineHeight: 24px button-md: fontFamily: UberMoveText, system-ui, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 500 lineHeight: 20px"
spacing: "xxs: 4px xs: 6px sm: 8px md: 12px lg: 16px xl: 20px 2xl: 24px 3xl: 32px"
---

# Brand Preset: `uber`

Apply the `uber`-inspired visual language to a project.

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
