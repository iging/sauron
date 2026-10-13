---
name: brand-binance
description: A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary CTA, brand accent, and value-claim moment. Type runs Binance's custom BinanceNova / BinancePlex stack at modest weights  -  the system trusts size and yellow voltage over bold weight. Marketing and product surfaces default to the dark theme; transactional surfaces (buy crypto, deposit, exchange) flip to a light theme that shares the same yellow CTAs and gray-blue hairlines. Trading green (up) and red (down) accents thread through both modes for price-direction signals.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-binance
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#fcd535" primary-active: "#f0b90b" primary-disabled: "#3a3a1f" ink: "#181a20" body: "#eaecef" body-on-light: "#181a20" muted: "#707a8a" muted-strong: "#929aa5" hairline-on-light: "#eaecef" hairline-on-dark: "#2b3139" border-strong: "#cdd1d6" canvas-light: "#ffffff" canvas-dark: "#0b0e11" surface-card-dark: "#1e2329" surface-elevated-dark: "#2b3139" surface-soft-light: "#fafafa" surface-strong-light: "#f5f5f5" on-primary: "#181a20" on-dark: "#ffffff" trading-up: "#0ecb81" trading-down: "#f6465d" accent-turquoise: "#2dbdb6" info: "#3b82f6" info-ring: "#3b82f6"'
typography: 'hero-display: fontFamily: "BinanceNova, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 64px fontWeight: 700 lineHeight: 1.1 letterSpacing: -1px display-lg: fontFamily: "BinanceNova, sans-serif" fontSize: 48px fontWeight: 700 lineHeight: 1.1 letterSpacing: -0.5px display-md: fontFamily: "BinanceNova, sans-serif" fontSize: 40px fontWeight: 600 lineHeight: 1.15 letterSpacing: -0.3px display-sm: fontFamily: "BinanceNova, sans-serif" fontSize: 32px fontWeight: 600 lineHeight: 1.2 letterSpacing: 0 title-lg: fontFamily: "BinanceNova, sans-serif" fontSize: 24px fontWeight: 600 lineHeight: 1.3 letterSpacing: 0 title-md: fontFamily: "BinanceNova, sans-serif" fontSize: 20px fontWeight: 600 lineHeight: 1.35 letterSpacing: 0 title-sm: fontFamily: "BinanceNova, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 number-display: fontFamily: "BinancePlex, BinanceNova, sans-serif" fontSize: 40px fontWeight: 700 lineHeight: 1.1 letterSpacing: -0.3px number-md: fontFamily: "BinancePlex, BinanceNova, sans-serif" fontSize: 16px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 number-sm: fontFamily: "BinancePlex, BinanceNova, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: "BinanceNova, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: "BinanceNova, sans-serif" fontSize: 13px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: "BinanceNova, sans-serif" fontSize: 12px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 button: fontFamily: "BinanceNova, sans-serif" fontSize: 14px fontWeight: 600 lineHeight: 1 letterSpacing: 0 nav-link: fontFamily: "BinanceNova, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 80px"
---

# Brand Preset: `binance`

Apply the `binance`-inspired visual language to a project.

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
