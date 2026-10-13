---
name: brand-cohere
description: Cohere's 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, soft mineral surfaces, rounded media cards, and a distinctive type split between monospaced-feeling display headlines and precise Unica77 UI text.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-cohere
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#17171c" cohere-black: "#000000" ink: "#212121" deep-green: "#003c33" dark-navy: "#071829" canvas: "#ffffff" soft-stone: "#eeece7" pale-green: "#edfce9" pale-blue: "#f1f5ff" hairline: "#d9d9dd" border-light: "#e5e7eb" card-border: "#f2f2f2" muted: "#93939f" slate: "#75758a" body-muted: "#616161" action-blue: "#1863dc" focus-blue: "#4c6ee6" coral: "#ff7759" coral-soft: "#ffad9b" form-focus: "#9b60aa" on-primary: "#ffffff" on-dark: "#ffffff" error: "#b30000"'
typography: "hero-display: fontFamily: CohereText fontSize: 96px fontWeight: 400 lineHeight: 1 letterSpacing: -1.92px product-display: fontFamily: CohereText fontSize: 72px fontWeight: 400 lineHeight: 1 letterSpacing: -1.44px section-display: fontFamily: Unica77 Cohere Web fontSize: 60px fontWeight: 400 lineHeight: 1 letterSpacing: -1.2px section-heading: fontFamily: Unica77 Cohere Web fontSize: 48px fontWeight: 400 lineHeight: 1.2 letterSpacing: -0.48px card-heading: fontFamily: Unica77 Cohere Web fontSize: 32px fontWeight: 400 lineHeight: 1.2 letterSpacing: -0.32px feature-heading: fontFamily: Unica77 Cohere Web fontSize: 24px fontWeight: 400 lineHeight: 1.3 letterSpacing: 0 body-large: fontFamily: Unica77 Cohere Web fontSize: 18px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 body: fontFamily: Unica77 Cohere Web fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button: fontFamily: Unica77 Cohere Web fontSize: 14px fontWeight: 500 lineHeight: 1.71 letterSpacing: 0 caption: fontFamily: Unica77 Cohere Web fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 mono-label: fontFamily: CohereMono fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0.28px micro: fontFamily: Unica77 Cohere Web fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0"
spacing: "xxs: 2px xs: 6px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 80px"
---

# Brand Preset: `cohere`

Apply the `cohere`-inspired visual language to a project.

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
