---
name: brand-raycast
description: "| Raycast's marketing system reads like an extended product screenshot. The chrome IS the in-product chrome at marketing scale: pure-near-black canvas, hairline 1px borders, command-palette-style cards, Inter typography with the ss03 stylistic set enabled site-wide, white CTA pill, and a small set of saturated category accent colors (yellow / red / green / blue) reserved for extension and feature illustrations. Section rhythm is generous (~96px) but the page never breaks tonal continuity  -  the whole site sits in one continuous dark mode."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-raycast
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ffffff" primary-pressed: "#e8e8e8" on-primary: "#000000" ink: "#f4f4f6" body: "#cdcdcd" charcoal: "#d3d3d4" mute: "#9c9c9d" ash: "#6a6b6c" stone: "#434345" on-dark: "#ffffff" on-dark-mute: "rgba(255,255,255,0.72)" canvas: "#07080a" surface: "#0d0d0d" surface-elevated: "#101111" surface-card: "#121212" button-fg: "#18191a" hairline: "#242728" hairline-soft: "rgba(255,255,255,0.08)" hairline-strong: "rgba(255,255,255,0.16)" accent-blue: "#57c1ff" accent-blue-soft: "rgba(87,193,255,0.15)" accent-red: "#ff6161" accent-red-soft: "rgba(255,97,97,0.15)" accent-green: "#59d499" accent-green-soft: "rgba(89,212,153,0.15)" accent-yellow: "#ffc533" accent-yellow-soft: "rgba(255,197,51,0.15)" hero-stripe-start: "#ff5757" hero-stripe-end: "#a1131a" key-bg-start: "#121212" key-bg-end: "#0d0d0d"'
typography: "display-xl: fontFamily: Inter fontSize: 64px fontWeight: 600 lineHeight: 1.1 letterSpacing: 0 fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' display-lg: fontFamily: Inter fontSize: 56px fontWeight: 500 lineHeight: 1.17 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' heading-xl: fontFamily: Inter fontSize: 24px fontWeight: 500 lineHeight: 1.6 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' heading-lg: fontFamily: Inter fontSize: 22px fontWeight: 500 lineHeight: 1.15 letterSpacing: 0 fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' heading-md: fontFamily: Inter fontSize: 20px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' heading-sm: fontFamily: Inter fontSize: 18px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' body-lg: fontFamily: Inter fontSize: 18px fontWeight: 400 lineHeight: 1.6 letterSpacing: 0 fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' body-md: fontFamily: Inter fontSize: 16px fontWeight: 400 lineHeight: 1.6 letterSpacing: 0 fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' body-strong: fontFamily: Inter fontSize: 16px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' body-sm: fontFamily: Inter fontSize: 14px fontWeight: 400 lineHeight: 1.6 letterSpacing: 0 fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' body-sm-strong: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.6 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' caption-md: fontFamily: Inter fontSize: 13px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0.1px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' caption-sm: fontFamily: Inter fontSize: 12px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.4px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' link-md: fontFamily: Inter fontSize: 16px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.3px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"' button-md: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.6 letterSpacing: 0.2px fontFeature: '\"calt\", \"kern\", \"liga\", \"ss03\"'"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 96px"
---

# Brand Preset: `raycast`

Apply the `raycast`-inspired visual language to a project.

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
