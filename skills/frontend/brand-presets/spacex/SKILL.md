---
name: brand-spacex
description: An interpretation of Spasex's design language  -  a mission-oriented aerospace brand built on pure black canvas, full-bleed photographic and video heroes of rockets and Mars landscapes, and uppercase D-DIN display type set in tight vertical leading. UI chrome is intentionally minimal a single ghost outlined pill button per band, all-caps eyebrow microtext, and a fixed top nav over photography. The system is unapologetically austere  -  black, white, and the imagery itself.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-spacex
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" ink: "#000000" on-primary: "#ffffff" on-primary-mute: "#f0f0fa" canvas-night: "#000000" canvas-night-soft: "#0a0a0a" canvas-light: "#ffffff" canvas-cool: "#f0f0fa" hairline-on-dark: "#3a3a3f" hairline-on-light: "#e0e0e8" link-on-dark: "#ffffff" link-blue-fallback: "#0000ee" ink-mute: "#5a5a5f"'
typography: 'display-xxl: fontFamily: "D-DIN-Bold, Arial Narrow, Arial, Verdana, sans-serif" fontSize: 80px fontWeight: 700 lineHeight: 0.95 letterSpacing: 1.6px display-xl: fontFamily: "D-DIN-Bold, Arial Narrow, Arial, Verdana, sans-serif" fontSize: 60px fontWeight: 700 lineHeight: 1.2 letterSpacing: 1.2px display-lg: fontFamily: "D-DIN-Bold, Arial Narrow, Arial, Verdana, sans-serif" fontSize: 48px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0.96px body-lg: fontFamily: "D-DIN, Arial, Verdana, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.7 letterSpacing: 0.32px body-md: fontFamily: "D-DIN, Arial, Verdana, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.32px button-cap: fontFamily: "D-DIN, Arial, Verdana, sans-serif" fontSize: 13.008px fontWeight: 700 lineHeight: 0.94 letterSpacing: 1.17px micro-cap: fontFamily: "D-DIN, Arial, Verdana, sans-serif" fontSize: 12px fontWeight: 400 lineHeight: 2.0 letterSpacing: 0.96px caption: fontFamily: "D-DIN, Arial, Verdana, sans-serif" fontSize: 13.008px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 18px xl: 24px xxl: 32px huge: 48px"
---

# Brand Preset: `spacex`

Apply the `spacex`-inspired visual language to a project.

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
