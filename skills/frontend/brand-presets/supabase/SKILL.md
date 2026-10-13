---
name: brand-supabase
description: "An interpretation of Supabaze's design language  -  an open-source database platform built on a clean white-and-near-black system with a single signature emerald-green CTA, a custom humanist sans display tier, and dense product UI mockups composited above the hero. The brand reads as quietly technical: minimal chrome, a near-monochrome palette, and the green primary acting as the only chromatic event on the page."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-supabase
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#3ecf8e" primary-deep: "#24b47e" primary-soft: "#4ade80" ink: "#171717" ink-secondary: "#212121" ink-mute: "#707070" ink-mute-2: "#9a9a9a" ink-faint: "#b2b2b2" on-primary: "#171717" on-dark: "#ffffff" canvas: "#ffffff" canvas-soft: "#fafafa" canvas-night: "#1c1c1c" canvas-night-soft: "#202020" hairline: "#dfdfdf" hairline-strong: "#c7c7c7" hairline-cool: "#ededed" hairline-cool-2: "#efefef" hairline-cool-3: "#d4d4d4" accent-purple: "#6b01c2" accent-violet: "#644fc1" accent-purple-soft: "#eddbf9" accent-yellow: "#ffdb13" accent-tomato: "#ff2201" accent-pink: "#c7007e" accent-indigo: "#054cff" accent-crimson: "#e2005a"'
typography: "display-xxl: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 64px fontWeight: 500 lineHeight: 1.1 letterSpacing: -1.92px display-xl: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 48px fontWeight: 500 lineHeight: 1.1 letterSpacing: -1.44px display-lg: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 36px fontWeight: 500 lineHeight: 1.15 letterSpacing: -0.72px display-md: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 28px fontWeight: 500 lineHeight: 1.2 letterSpacing: -0.42px heading-lg: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 22px fontWeight: 500 lineHeight: 1.2 letterSpacing: 0 heading-md: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 18px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 body-lg: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 18px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 body-md: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button-md: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 caption: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.45 letterSpacing: 0 micro: fontFamily: \"Circular, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 12px fontWeight: 400 lineHeight: 1.45 letterSpacing: 0 code: fontFamily: \"ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', monospace\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px huge: 64px"
---

# Brand Preset: `supabase`

Apply the `supabase`-inspired visual language to a project.

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
