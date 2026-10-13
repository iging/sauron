---
name: brand-bmw
description: BMW's corporate site  -  distinct from BMW M's motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On a light (cream-tinted white) canvas, BMW corporate blue (#1c69d4) carries every primary CTA; dark navy hero bands frame model photography. BMW Type Next Latin sets the entire hierarchy on two weights  -  heavy 700 display and Light 300 body. Configuration and reservation flows ride a card-based 4-up grid, where each card holds a model render, a name, and a "Learn More" link.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-bmw
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#1c69d4" primary-active: "#0653b6" primary-disabled: "#d6d6d6" ink: "#262626" body: "#3c3c3c" body-strong: "#1a1a1a" muted: "#6b6b6b" muted-soft: "#9a9a9a" hairline: "#e6e6e6" hairline-strong: "#cccccc" canvas: "#ffffff" surface-soft: "#f7f7f7" surface-card: "#fafafa" surface-strong: "#ebebeb" surface-dark: "#1a2129" surface-dark-elevated: "#262e38" on-primary: "#ffffff" on-dark: "#ffffff" on-dark-soft: "#bbbbbb" m-blue-light: "#0066b1" m-blue-dark: "#1c69d4" m-red: "#e22718" success: "#22c55e" warning: "#f59e0b" error: "#dc2626"'
typography: "display-xl: fontFamily: \"'BMW Type Next Latin', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\" fontSize: 64px fontWeight: 700 lineHeight: 1.05 letterSpacing: 0 display-lg: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 48px fontWeight: 700 lineHeight: 1.1 letterSpacing: 0 display-md: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 32px fontWeight: 700 lineHeight: 1.15 letterSpacing: 0 display-sm: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 24px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 title-lg: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 20px fontWeight: 700 lineHeight: 1.3 letterSpacing: 0 title-md: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 18px fontWeight: 700 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 16px fontWeight: 700 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 16px fontWeight: 300 lineHeight: 1.55 letterSpacing: 0 body-sm: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 14px fontWeight: 300 lineHeight: 1.55 letterSpacing: 0 caption: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0.5px label-uppercase: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 13px fontWeight: 700 lineHeight: 1.3 letterSpacing: 1.5px textTransform: uppercase button: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 14px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0.5px nav-link: fontFamily: \"'BMW Type Next Latin', sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0.3px"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 80px"
---

# Brand Preset: `bmw`

Apply the `bmw`-inspired visual language to a project.

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
