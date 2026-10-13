---
name: brand-renault
description: "| Renault's web presence pairs the freshly-modernised Renault diamond (the 2021 flat-line rhombus mark) with a stark black-and-white canvas, a signature Sunlight Yellow accent, and the proprietary NouvelR display typeface. The system reads as confident, photography-first automotive  -  large hero cars on neutral or atmospheric backdrops, square-edged or barely-rounded containers, and a small disciplined palette where every coloured element is intentional. Tile grids, full-bleed banners, and a recurring \"configurator\" surface (white card, yellow accent dots, neutral product chrome) carry the mass-market dealership tone without crossing into luxury."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-renault
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ffed00" primary-deep: "#e6d200" on-primary: "#000000" ink: "#000000" body: "#222222" charcoal: "#333333" mute: "#666666" ash: "#8a8a8a" stone: "#c4c4c4" on-dark: "#ffffff" on-dark-mute: "rgba(255,255,255,0.72)" canvas: "#ffffff" surface-soft: "#f7f7f7" surface-card: "#ffffff" surface-dark: "#000000" surface-deep: "#111111" hairline: "#f2f2f2" hairline-strong: "#000000" divider-dark: "rgba(255,255,255,0.16)" badge-new: "#ffed00" link: "#0000ee" error: "#be6464" warning: "#f0ad4e" success: "#8dc572" info: "#337ab7"'
typography: "display-xl: fontFamily: NouvelR fontSize: 56px fontWeight: 700 lineHeight: 0.95 letterSpacing: 0 display-lg: fontFamily: NouvelR fontSize: 40px fontWeight: 700 lineHeight: 0.95 letterSpacing: 0 display-md: fontFamily: NouvelR fontSize: 32px fontWeight: 700 lineHeight: 0.95 letterSpacing: 0 heading-lg: fontFamily: NouvelR fontSize: 24px fontWeight: 700 lineHeight: 0.95 letterSpacing: 0 heading-md: fontFamily: NouvelR fontSize: 20px fontWeight: 700 lineHeight: 0.95 letterSpacing: 0 heading-sm: fontFamily: NouvelR fontSize: 18px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0 subtitle: fontFamily: NouvelR fontSize: 19.2px fontWeight: 600 lineHeight: 1.3 letterSpacing: 0 body-lg: fontFamily: NouvelR fontSize: 18px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-md: fontFamily: NouvelR fontSize: 16px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 body-sm: fontFamily: NouvelR fontSize: 14px fontWeight: 400 lineHeight: 1.57 letterSpacing: 0 button-lg: fontFamily: NouvelR fontSize: 16px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0 button-md: fontFamily: NouvelR fontSize: 14.4px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0.144px button-sm: fontFamily: NouvelR fontSize: 13px fontWeight: 600 lineHeight: 1.2 letterSpacing: 0.13px caption: fontFamily: NouvelR fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 overline: fontFamily: NouvelR fontSize: 10px fontWeight: 700 lineHeight: 1.45 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section: 80px"
---

# Brand Preset: `renault`

Apply the `renault`-inspired visual language to a project.

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
