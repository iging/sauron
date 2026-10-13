---
name: brand-hp
description: An interpretation of HP's design language  -  a white-paper enterprise-consumer system anchored by HP Electric Blue (`#024ad8`) as the lone signal CTA, near-black ink (`#1a1a1a`) for headlines, geometric Forma-DJR sans throughout, and angular blue-chevron decorations that nod to the HP wordmark's slashes. Cards round at 816px, photos sit in soft 16px frames, and dark navy slabs anchor the customer-story and "how can we help" closing bands.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-hp
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#024ad8" primary-bright: "#296ef9" primary-deep: "#0e3191" primary-soft: "#c9e0fc" on-primary: "#ffffff" ink: "#1a1a1a" ink-deep: "#000000" ink-soft: "#292929" on-ink: "#ffffff" canvas: "#ffffff" paper: "#ffffff" cloud: "#f7f7f7" fog: "#e8e8e8" steel: "#c2c2c2" graphite: "#636363" charcoal: "#3d3d3d" hairline: "#e8e8e8" hairline-strong: "#c2c2c2" link: "#024ad8" link-pressed: "#0e3191" bloom-coral: "#ff5050" bloom-rose: "#f9d4d2" bloom-deep: "#b3262b" bloom-wine: "#5a1313" storm-mist: "#8ebdce" storm-sea: "#7fadbe" storm-deep: "#356373" error: "#b3262b"'
typography: "display-xxl: fontFamily: Forma DJR Micro fontSize: 72px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 display-xl: fontFamily: Forma DJR Micro fontSize: 56px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 display-lg: fontFamily: Forma DJR Micro fontSize: 44px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 display-md: fontFamily: Forma DJR Micro fontSize: 32px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 display-sm: fontFamily: Forma DJR Micro fontSize: 24px fontWeight: 500 lineHeight: 1.17 letterSpacing: 0 display-xs: fontFamily: Forma DJR Micro fontSize: 20px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 body-lg: fontFamily: Forma DJR Micro fontSize: 18px fontWeight: 400 lineHeight: 1.33 letterSpacing: 0 body-md: fontFamily: Forma DJR Micro fontSize: 16px fontWeight: 400 lineHeight: 1.38 letterSpacing: 0 body-emphasis: fontFamily: Forma DJR Micro fontSize: 16px fontWeight: 500 lineHeight: 1.38 letterSpacing: 0 caption-md: fontFamily: Forma DJR Micro fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption-sm: fontFamily: Forma DJR Micro fontSize: 12px fontWeight: 400 lineHeight: 1.33 letterSpacing: 0 caption-bold: fontFamily: Forma DJR Micro fontSize: 14px fontWeight: 700 lineHeight: 1.3 letterSpacing: 0 link-md: fontFamily: Forma DJR Micro fontSize: 16px fontWeight: 500 lineHeight: 1.38 letterSpacing: 0 button-md: fontFamily: Forma DJR Micro fontSize: 14px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0.7px textTransform: uppercase button-sm: fontFamily: Forma DJR Micro fontSize: 12.6px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0.126px price-md: fontFamily: Forma DJR Micro fontSize: 24px fontWeight: 500 lineHeight: 1.17 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px section: 80px"
---

# Brand Preset: `hp`

Apply the `hp`-inspired visual language to a project.

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
