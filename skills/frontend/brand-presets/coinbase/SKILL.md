---
name: brand-coinbase
description: An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is pure white; Coinbase Blue (`#0052ff`) is the single brand voltage, used scarcely on primary CTAs, signature glyphs, and inline accent moments. Type runs Coinbase's licensed CoinbaseDisplay (display) and CoinbaseSans (body) at modest weights  -  display sits at weight 400 not 700, signaling editorial calm rather than fintech-bombastic. Page rhythm rotates between bright white sections, soft gray elevation bands, and full-bleed dark editorial heroes (`#0a0b0d`) carrying product-ui mockup cards. Iconography is geometric and minimal; depth comes from card-on-card layering, never decorative shadows.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-coinbase
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0052ff" primary-active: "#003ecc" primary-disabled: "#a8b8cc" ink: "#0a0b0d" body: "#5b616e" body-strong: "#0a0b0d" muted: "#7c828a" muted-soft: "#a8acb3" hairline: "#dee1e6" hairline-soft: "#eef0f3" canvas: "#ffffff" surface-soft: "#f7f7f7" surface-card: "#ffffff" surface-strong: "#eef0f3" surface-dark: "#0a0b0d" surface-dark-elevated: "#16181c" on-primary: "#ffffff" on-dark: "#ffffff" on-dark-soft: "#a8acb3" semantic-up: "#05b169" semantic-down: "#cf202f" accent-yellow: "#f4b000"'
typography: "display-mega: fontFamily: \"'Coinbase Display', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif\" fontSize: 80px fontWeight: 400 lineHeight: 1.0 letterSpacing: -2px display-xl: fontFamily: \"'Coinbase Display', sans-serif\" fontSize: 64px fontWeight: 400 lineHeight: 1.0 letterSpacing: -1.6px display-lg: fontFamily: \"'Coinbase Display', sans-serif\" fontSize: 52px fontWeight: 400 lineHeight: 1.0 letterSpacing: -1.3px display-md: fontFamily: \"'Coinbase Display', sans-serif\" fontSize: 44px fontWeight: 400 lineHeight: 1.09 letterSpacing: -1px display-sm: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 36px fontWeight: 400 lineHeight: 1.11 letterSpacing: -0.5px title-lg: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 32px fontWeight: 400 lineHeight: 1.13 letterSpacing: -0.4px title-md: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 18px fontWeight: 600 lineHeight: 1.33 letterSpacing: 0 title-sm: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 16px fontWeight: 600 lineHeight: 1.25 letterSpacing: 0 body-md: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-strong: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 16px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption-strong: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 12px fontWeight: 600 lineHeight: 1.5 letterSpacing: 0 number-display: fontFamily: \"'Coinbase Mono', 'Coinbase Sans', monospace\" fontSize: 18px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 button: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 16px fontWeight: 600 lineHeight: 1.15 letterSpacing: 0 nav-link: fontFamily: \"'Coinbase Sans', sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px base: 16px md: 20px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `coinbase`

Apply the `coinbase`-inspired visual language to a project.

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
