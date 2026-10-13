---
name: brand-bmw-motorsport
description: A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE. The brand carries no decorative voltage  -  its energy comes from full-bleed automotive photography (cars on tracks, driver-cockpit shots, carbon-fiber detail) and the iconic M tricolor stripe (light blue  dark blue  red) used sparingly as a brand signature on logos, dividers, and motorsport chrome. Type stays light to medium weight to feel European-engineered, never American-bombastic.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-bmw-motorsport
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ffffff" ink: "#ffffff" body: "#bbbbbb" body-strong: "#e6e6e6" muted: "#7e7e7e" hairline: "#3c3c3c" hairline-strong: "#262626" canvas: "#000000" surface-card: "#1a1a1a" surface-elevated: "#262626" surface-soft: "#0d0d0d" on-primary: "#000000" on-dark: "#ffffff" m-blue-light: "#0066b1" m-blue-dark: "#1c69d4" m-red: "#e22718" bmw-blue: "#1c69d4" electric-blue: "#0653b6" carbon-gray: "#2b2b2b" warning: "#f4b400" success: "#0fa336"'
typography: 'display-xl: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 80px fontWeight: 700 lineHeight: 1 letterSpacing: 0 display-lg: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 56px fontWeight: 700 lineHeight: 1.05 letterSpacing: 0 display-md: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 40px fontWeight: 700 lineHeight: 1.1 letterSpacing: 0 display-sm: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 32px fontWeight: 700 lineHeight: 1.15 letterSpacing: 0 title-lg: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 24px fontWeight: 700 lineHeight: 1.3 letterSpacing: 0 title-md: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 20px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 18px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 label-uppercase: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 14px fontWeight: 700 lineHeight: 1.3 letterSpacing: 1.5px body-md: fontFamily: "BMWTypeNextLatin Light, BMWTypeNextLatin, sans-serif" fontSize: 16px fontWeight: 300 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: "BMWTypeNextLatin Light, sans-serif" fontSize: 14px fontWeight: 300 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0.5px button: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 14px fontWeight: 700 lineHeight: 1 letterSpacing: 1.5px nav-link: fontFamily: "BMWTypeNextLatin, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0.5px'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 40px xxl: 64px section: 96px"
---

# Brand Preset: `bmw-motorsport`

Apply the `bmw-motorsport`-inspired visual language to a project.

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
