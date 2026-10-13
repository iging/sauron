---
name: brand-ferrari
description: A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is **near-black** (`#181818`) holding pure white display type; white-canvas bands appear only inside specific editorial contexts (preowned listings, pricing tables). The single brand voltage is **Rosso Corsa** (`#da291c`)  -  the iconic Ferrari racing red  -  used scarcely on primary CTAs, the Cavallino mark, and Formula 1 race-position highlights. Type runs **FerrariSans** at modest weights (display 500, body 400)  -  never bombastic. Spacing follows an explicit 8px token ladder (`xxxs` 4px through `super` 128px); generous editorial pacing throughout. The brand's strongest visual signature is the **full-bleed cinematic hero photograph** that fills the viewport top with car photography, model details, or trackside livery  -  followed by a tighter editorial body layout below.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-ferrari
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#da291c" primary-active: "#b01e0a" primary-hover: "#9d2211" ink: "#ffffff" body: "#969696" body-strong: "#ffffff" body-on-light: "#181818" muted: "#666666" muted-soft: "#8f8f8f" hairline: "#303030" hairline-on-light: "#d2d2d2" hairline-soft: "#ebebeb" canvas: "#181818" canvas-elevated: "#303030" canvas-light: "#ffffff" surface-card: "#303030" surface-soft-light: "#f7f7f7" surface-strong-light: "#ebebeb" on-primary: "#ffffff" on-dark: "#ffffff" on-light: "#181818" accent-yellow-hypersail: "#fff200" accent-yellow: "#f6e500" semantic-info: "#4c98b9" semantic-success: "#03904a" semantic-warning: "#f13a2c"'
typography: "display-mega: fontFamily: \"'FerrariSans', -apple-system, system-ui, sans-serif\" fontSize: 80px fontWeight: 500 lineHeight: 1.05 letterSpacing: -1.6px display-xl: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 56px fontWeight: 500 lineHeight: 1.1 letterSpacing: -1.12px display-lg: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 36px fontWeight: 500 lineHeight: 1.2 letterSpacing: -0.36px display-md: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 26px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0.195px title-md: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 18px fontWeight: 700 lineHeight: 1.2 letterSpacing: 0 title-sm: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 16px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.08px body-md: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 caption-uppercase: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 11px fontWeight: 600 lineHeight: 1.4 letterSpacing: 1.1px textTransform: uppercase button: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 14px fontWeight: 700 lineHeight: 1.0 letterSpacing: 1.4px textTransform: uppercase nav-link: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 13px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0.65px textTransform: uppercase number-display: fontFamily: \"'FerrariSans', sans-serif\" fontSize: 80px fontWeight: 700 lineHeight: 1.0 letterSpacing: -1.6px"
spacing: "xxxs: 4px xxs: 8px xs: 16px sm: 24px md: 32px lg: 48px xl: 64px xxl: 96px super: 128px"
---

# Brand Preset: `ferrari`

Apply the `ferrari`-inspired visual language to a project.

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
