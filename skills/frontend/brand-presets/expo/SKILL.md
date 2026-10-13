---
name: brand-expo
description: A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white with a soft sky-blue gradient atmospheric wash behind the hero; near-black ink (`#171717`) carries body and display alike. The single brand voltage is **pure black** (`#000000`) for primary CTAs  -  minimal and editorial-feeling, paired with a small blue text-link accent (`#0d74ce`) reserved for inline body links. Type pairs Inter at modest weights (display 600, body 400) with JetBrains Mono on every code surface. The brand's strongest visual signature is the **device-mockup hero**  -  a centered MacBook + iPhone composite showing real Expo dev surfaces  -  over the gradient sky wash.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-expo
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" primary-active: "#1a1a1a" text-link: "#0d74ce" text-link-secondary: "#476cff" ink: "#171717" body: "#60646c" body-strong: "#171717" muted: "#999999" muted-soft: "#cccccc" hairline: "#f0f0f3" hairline-soft: "#f5f5f7" hairline-strong: "#dcdee0" canvas: "#ffffff" canvas-soft: "#fafafa" surface-card: "#ffffff" surface-strong: "#f0f0f3" surface-dark: "#171717" surface-dark-elevated: "#1a1a1a" on-primary: "#ffffff" on-dark: "#ffffff" on-dark-soft: "#b0b4ba" gradient-sky-light: "#cfe7ff" gradient-sky-mid: "#a8c8e8" accent-warning: "#ab6400" accent-preview: "#8145b5" accent-link-bright: "#47c2ff" semantic-error: "#eb8e90" semantic-success: "#16a34a"'
typography: "display-mega: fontFamily: \"'Inter', -apple-system, system-ui, sans-serif\" fontSize: 64px fontWeight: 600 lineHeight: 1.05 letterSpacing: -1.92px display-xl: fontFamily: \"'Inter', sans-serif\" fontSize: 48px fontWeight: 600 lineHeight: 1.1 letterSpacing: -1.44px display-lg: fontFamily: \"'Inter', sans-serif\" fontSize: 36px fontWeight: 600 lineHeight: 1.15 letterSpacing: -1.08px display-md: fontFamily: \"'Inter', sans-serif\" fontSize: 28px fontWeight: 600 lineHeight: 1.2 letterSpacing: -0.84px display-sm: fontFamily: \"'Inter', sans-serif\" fontSize: 22px fontWeight: 600 lineHeight: 1.25 letterSpacing: -0.5px title-md: fontFamily: \"'Inter', sans-serif\" fontSize: 18px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: \"'Inter', sans-serif\" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: \"'Inter', sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: \"'Inter', sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: \"'Inter', sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 caption-uppercase: fontFamily: \"'Inter', sans-serif\" fontSize: 11px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0.88px textTransform: uppercase code: fontFamily: \"'JetBrains Mono', 'Fira Code', monospace\" fontSize: 13px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button: fontFamily: \"'Inter', sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 nav-link: fontFamily: \"'Inter', sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px base: 16px md: 20px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `expo`

Apply the `expo`-inspired visual language to a project.

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
