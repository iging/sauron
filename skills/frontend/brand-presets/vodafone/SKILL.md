---
name: brand-vodafone
description: An interpretation of Vodafone's design language  -  a telecom super-brand whose web surface alternates between editorial photography hero bands with massive uppercase display headlines and clean white content bands, anchored by the company's signature scarlet red CTA and the proprietary Vodafone display sans set at impossibly heavy 800 weight.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-vodafone
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#e60000" on-primary: "#ffffff" ink: "#25282b" body: "#7e7e7e" mute: "#bebebe" canvas: "#ffffff" canvas-soft: "#f2f2f2" on-dark: "#ffffff"'
typography: "display-hero: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 144px fontWeight: 800 lineHeight: 114px letterSpacing: -1px display-xxl: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 126px fontWeight: 800 lineHeight: 113px letterSpacing: -1px display-xl: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 90px fontWeight: 800 lineHeight: 84px display-lg: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 48px fontWeight: 300 lineHeight: 52px display-md: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 40px fontWeight: 300 lineHeight: 44px display-sm: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 32px fontWeight: 700 lineHeight: 40px display-xs: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 24px fontWeight: 700 lineHeight: 24px eyebrow-uppercase: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 800 lineHeight: 24px body-lg: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 22px fontWeight: 400 lineHeight: 24px body-md: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 28px body-md-strong: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 600 lineHeight: 28px body-sm: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 20px body-sm-strong: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 16px fontWeight: 700 lineHeight: 22px caption: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 16px caption-strong: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 14px fontWeight: 700 lineHeight: 21px caption-uppercase: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 12px fontWeight: 600 lineHeight: 16px letterSpacing: 0.5691px button-md: fontFamily: Vodafone, Vodafone Rg, Helvetica Neue, Arial, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 28px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 20px 2xl: 24px 3xl: 32px"
---

# Brand Preset: `vodafone`

Apply the `vodafone`-inspired visual language to a project.

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
