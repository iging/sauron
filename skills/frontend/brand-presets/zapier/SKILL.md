---
name: brand-zapier
description: An interpretation of Zapier's design language  -  a workflow-automation platform whose surface combines warm-cream neutrals (`#fffefb` canvas, `#f8f4f0` soft cream) with deep coffee ink (`#201515`) and a single saturated orange CTA accent (`#ff4f00`); typography pairs the proprietary Degular Display family at hero scale with Inter for sub-displays and body, giving the brand a confident-warm rather than cool-tech voice.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-zapier
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ff4f00" on-primary: "#fffefb" ink: "#201515" ink-soft: "#2f2a26" ink-mid: "#36342e" body: "#605d52" body-mid: "#939084" mute: "#c5c0b1" canvas: "#fffefb" canvas-soft: "#f8f4f0"'
typography: "display-xl: fontFamily: Degular Display, Inter, system-ui, -apple-system, sans-serif fontSize: 56px fontWeight: 500 lineHeight: 56px display-lg: fontFamily: Degular Display, Inter, system-ui, sans-serif fontSize: 48px fontWeight: 500 lineHeight: 48px display-md: fontFamily: Degular Display, Inter, system-ui, sans-serif fontSize: 32px fontWeight: 500 lineHeight: 36px letterSpacing: 1px display-sub-lg: fontFamily: Inter, system-ui, sans-serif fontSize: 48px fontWeight: 500 lineHeight: 49.92px display-sub-md: fontFamily: Inter, system-ui, sans-serif fontSize: 32px fontWeight: 400 lineHeight: 40px display-sub-sm: fontFamily: Inter, system-ui, sans-serif fontSize: 24px fontWeight: 600 lineHeight: 30px letterSpacing: -0.6px display-xs: fontFamily: Inter, system-ui, sans-serif fontSize: 20px fontWeight: 700 lineHeight: 25px letterSpacing: -0.5px body-lg: fontFamily: Inter, system-ui, sans-serif fontSize: 20px fontWeight: 400 lineHeight: 30px letterSpacing: -0.2px body-md: fontFamily: Inter, system-ui, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 27px body-md-strong: fontFamily: Inter, system-ui, sans-serif fontSize: 18px fontWeight: 600 lineHeight: 27px body-sm: fontFamily: Inter, system-ui, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 24px body-sm-strong: fontFamily: Inter, system-ui, sans-serif fontSize: 16px fontWeight: 600 lineHeight: 24px caption: fontFamily: Inter, system-ui, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 21px eyebrow-uppercase: fontFamily: Degular Display, Inter, system-ui, sans-serif fontSize: 14px fontWeight: 500 lineHeight: 14px letterSpacing: 1px button-md: fontFamily: Inter, system-ui, sans-serif fontSize: 18px fontWeight: 600 lineHeight: 27px button-sm: fontFamily: Inter, system-ui, sans-serif fontSize: 14.4px fontWeight: 700 lineHeight: 14.4px letterSpacing: 0.144px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px 2xl: 32px 3xl: 48px 4xl: 64px"
---

# Brand Preset: `zapier`

Apply the `zapier`-inspired visual language to a project.

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
