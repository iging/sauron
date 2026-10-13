---
name: brand-ibm
description: '"An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident accent, and a deliberately flat-square aesthetic where corners stay at 04px. Type runs IBM Plex Sans at light weight 300 for display sizes (a brand signature) and 400/600 for body and emphasis. Cards live as thin-bordered tiles with no shadow; sections separate via subtle gray rows. The chrome is square, the typography is light, and the only color in the system is one assertive blue  -  the result reads as old-world enterprise gravitas reframed for the cloud era."'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-ibm
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0f62fe" on-primary: "#ffffff" ink: "#161616" ink-muted: "#525252" ink-subtle: "#8c8c8c" canvas: "#ffffff" surface-1: "#f4f4f4" surface-2: "#e0e0e0" inverse-canvas: "#161616" inverse-surface-1: "#262626" inverse-ink: "#ffffff" inverse-ink-muted: "#c6c6c6" hairline: "#e0e0e0" hairline-strong: "#161616" blue-60: "#0043ce" blue-80: "#002d9c" blue-hover: "#0050e6" semantic-success: "#24a148" semantic-warning: "#f1c21b" semantic-error: "#da1e28" semantic-info: "#0f62fe"'
typography: "display-xl: fontFamily: IBM Plex Sans fontSize: 76px fontWeight: 300 lineHeight: 1.17 letterSpacing: -0.5px display-lg: fontFamily: IBM Plex Sans fontSize: 60px fontWeight: 300 lineHeight: 1.17 letterSpacing: -0.4px display-md: fontFamily: IBM Plex Sans fontSize: 42px fontWeight: 300 lineHeight: 1.20 letterSpacing: 0 headline: fontFamily: IBM Plex Sans fontSize: 32px fontWeight: 400 lineHeight: 1.25 letterSpacing: 0 card-title: fontFamily: IBM Plex Sans fontSize: 24px fontWeight: 400 lineHeight: 1.33 letterSpacing: 0 subhead: fontFamily: IBM Plex Sans fontSize: 20px fontWeight: 400 lineHeight: 1.40 letterSpacing: 0 body-lg: fontFamily: IBM Plex Sans fontSize: 18px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0 body: fontFamily: IBM Plex Sans fontSize: 16px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0.16px body-sm: fontFamily: IBM Plex Sans fontSize: 14px fontWeight: 400 lineHeight: 1.29 letterSpacing: 0.16px body-emphasis: fontFamily: IBM Plex Sans fontSize: 14px fontWeight: 600 lineHeight: 1.29 letterSpacing: 0.16px caption: fontFamily: IBM Plex Sans fontSize: 12px fontWeight: 400 lineHeight: 1.33 letterSpacing: 0.32px button: fontFamily: IBM Plex Sans fontSize: 14px fontWeight: 400 lineHeight: 1.29 letterSpacing: 0.16px eyebrow: fontFamily: IBM Plex Sans fontSize: 14px fontWeight: 400 lineHeight: 1.29 letterSpacing: 0.16px"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `ibm`

Apply the `ibm`-inspired visual language to a project.

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
