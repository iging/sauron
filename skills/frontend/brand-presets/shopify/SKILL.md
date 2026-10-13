---
name: brand-shopify
description: An interpretation of Shopifi's design language  -  a cinematic commerce platform that runs two parallel design tracks. The marketing-hero and product-narrative pages live on near-black canvases with full-bleed photography of merchants, giant Neue Haas Grotesk display type at thin weights, and a single black-pill CTA stroked in white. The transactional pages (pricing, signup, dashboards) flip to a cream-mint canvas with pastel aloe and pistachio greens, the same pill button vocabulary, and Inter for UI body. The two tracks share typographic DNA but diverge sharply in canvas polarity  -  and that choice is the brand.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-shopify
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" ink: "#000000" on-primary: "#ffffff" on-dark: "#ffffff" canvas-night: "#000000" canvas-night-elevated: "#0a0a0a" canvas-light: "#ffffff" canvas-cream: "#fbfbf5" surface-elevated-dark: "#1e2c31" shade-30: "#d4d4d8" shade-40: "#a1a1aa" shade-50: "#71717a" shade-60: "#52525b" shade-70: "#3f3f46" hairline-light: "#e4e4e7" hairline-dark: "#1e2c31" aloe-10: "#c1fbd4" pistachio-10: "#d4f9e0" link-cool-1: "#9dabad" link-cool-2: "#9797a2" link-cool-3: "#bdbdca" link-mint: "#99b3ad"'
typography: 'display-xxl: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 96px fontWeight: 330 lineHeight: 1.0 letterSpacing: 2.4px fontFeature: ss03 display-xl: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 70px fontWeight: 330 lineHeight: 1.0 letterSpacing: 0 fontFeature: ss03 display-lg: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 55px fontWeight: 330 lineHeight: 1.16 letterSpacing: 0 fontFeature: ss03 display-md: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 48px fontWeight: 330 lineHeight: 1.14 letterSpacing: 0 fontFeature: ss03 heading-xl: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 28px fontWeight: 500 lineHeight: 1.28 letterSpacing: 0.42px fontFeature: ss03 heading-lg: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 24px fontWeight: 400 lineHeight: 1.14 letterSpacing: 0.36px fontFeature: ss03 heading-md: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 20px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.3px fontFeature: ss03 heading-sm: fontFamily: "NeueHaasGrotesk Display, Helvetica, Arial, sans-serif" fontSize: 18px fontWeight: 500 lineHeight: 1.25 letterSpacing: 0.72px fontFeature: ss03 body-lg: fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif" fontSize: 18px fontWeight: 550 lineHeight: 1.56 letterSpacing: 0 fontFeature: ss03 body-md: fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif" fontSize: 16px fontWeight: 420 lineHeight: 1.5 letterSpacing: 0 fontFeature: ss03 body-strong: fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif" fontSize: 16px fontWeight: 550 lineHeight: 1.5 letterSpacing: 0 fontFeature: ss03 caption: fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.49 letterSpacing: 0.28px fontFeature: ss03 micro: fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif" fontSize: 13px fontWeight: 500 lineHeight: 1.5 letterSpacing: -0.13px fontFeature: ss03 eyebrow-cap: fontFamily: "Inter Variable, Inter, Helvetica, Arial, sans-serif" fontSize: 12px fontWeight: 400 lineHeight: 1.2 letterSpacing: 0.72px fontFeature: ss03 code: fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 fontFeature: ss03'
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px huge: 64px"
---

# Brand Preset: `shopify`

Apply the `shopify`-inspired visual language to a project.

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
