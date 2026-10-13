---
name: brand-stripe
description: An interpretation of Stripi's design language  -  a financial-infrastructure brand built on a deep navy ink, an electric indigo primary, and a recurring atmospheric gradient mesh that occupies the upper third of nearly every marketing page. The system pairs the proprietary Sohne family at thin (300) weights with negative letter-spacing for editorial-density display headlines, and uses tabular-figure body type where money and numerics matter. Buttons are tight-radius pills, cards live on near-white surfaces, and the dashboard track flips polarity to a familiar dark-app shell.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-stripe
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#533afd" primary-deep: "#4434d4" primary-press: "#2e2b8c" primary-soft: "#665efd" primary-bg-subdued-hover: "#b9b9f9" brand-dark-900: "#1c1e54" ink: "#0d253d" ink-secondary: "#273951" ink-mute: "#64748d" ink-mute-2: "#61718a" on-primary: "#ffffff" canvas: "#ffffff" canvas-soft: "#f6f9fc" canvas-cream: "#f5e9d4" hairline: "#e3e8ee" hairline-input: "#a8c3de" ruby: "#ea2261" magenta: "#f96bee" lemon: "#9b6829" shadow-blue: "#003770"'
typography: "display-xxl: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 56px fontWeight: 300 lineHeight: 1.03 letterSpacing: -1.4px fontFeature: ss01 display-xl: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 48px fontWeight: 300 lineHeight: 1.15 letterSpacing: -0.96px fontFeature: ss01 display-lg: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 32px fontWeight: 300 lineHeight: 1.1 letterSpacing: -0.64px fontFeature: ss01 display-md: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 26px fontWeight: 300 lineHeight: 1.12 letterSpacing: -0.26px fontFeature: ss01 heading-lg: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 22px fontWeight: 300 lineHeight: 1.1 letterSpacing: -0.22px fontFeature: ss01 heading-md: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 20px fontWeight: 300 lineHeight: 1.4 letterSpacing: -0.2px fontFeature: ss01 heading-sm: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 18px fontWeight: 300 lineHeight: 1.4 letterSpacing: 0 fontFeature: ss01 body-lg: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 16px fontWeight: 300 lineHeight: 1.4 letterSpacing: 0 fontFeature: ss01 body-md: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 15px fontWeight: 300 lineHeight: 1.4 letterSpacing: 0 fontFeature: ss01 body-tabular: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 14px fontWeight: 300 lineHeight: 1.4 letterSpacing: -0.42px fontFeature: tnum button-md: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.0 letterSpacing: 0 fontFeature: ss01 button-sm: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.0 letterSpacing: 0 fontFeature: ss01 caption: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.4 letterSpacing: -0.39px fontFeature: tnum micro: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 11px fontWeight: 300 lineHeight: 1.4 letterSpacing: 0 fontFeature: ss01 micro-cap: fontFamily: \"sohne-var, 'SF Pro Display', system-ui, -apple-system, sans-serif\" fontSize: 10px fontWeight: 400 lineHeight: 1.15 letterSpacing: 0.1px fontFeature: ss01"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px huge: 64px"
---

# Brand Preset: `stripe`

Apply the `stripe`-inspired visual language to a project.

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
