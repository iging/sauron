---
name: brand-clickhouse
description: A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in confident sans, yellow CTAs, and yellow-text stat numbers carry the brand voice across every page. Code blocks and product UI fragments embed directly in dark cards. The yellow + black pairing (and yellow used scarcely as accent) is the system's signature  -  brand identity without atmospheric decoration.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-clickhouse
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#faff69" primary-active: "#e6eb52" primary-disabled: "#3a3a1f" ink: "#ffffff" body: "#cccccc" body-strong: "#e6e6e6" muted: "#888888" muted-soft: "#5a5a5a" hairline: "#2a2a2a" hairline-strong: "#3a3a3a" canvas: "#0a0a0a" surface-soft: "#121212" surface-card: "#1a1a1a" surface-elevated: "#242424" surface-yellow-band: "#faff69" on-primary: "#0a0a0a" on-dark: "#ffffff" on-yellow: "#0a0a0a" accent-emerald: "#22c55e" accent-rose: "#ef4444" accent-blue: "#3b82f6" success: "#22c55e" warning: "#f59e0b" error: "#ef4444"'
typography: 'display-xl: fontFamily: "Inter, sans-serif" fontSize: 72px fontWeight: 700 lineHeight: 1.05 letterSpacing: -2.5px display-lg: fontFamily: "Inter, sans-serif" fontSize: 56px fontWeight: 700 lineHeight: 1.1 letterSpacing: -2px display-md: fontFamily: "Inter, sans-serif" fontSize: 40px fontWeight: 700 lineHeight: 1.15 letterSpacing: -1.5px display-sm: fontFamily: "Inter, sans-serif" fontSize: 32px fontWeight: 700 lineHeight: 1.2 letterSpacing: -1px title-lg: fontFamily: "Inter, sans-serif" fontSize: 24px fontWeight: 700 lineHeight: 1.3 letterSpacing: -0.3px title-md: fontFamily: "Inter, sans-serif" fontSize: 18px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: "Inter, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 stat-display: fontFamily: "Inter, sans-serif" fontSize: 56px fontWeight: 700 lineHeight: 1.0 letterSpacing: -1.5px body-md: fontFamily: "Inter, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 body-sm: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 caption: fontFamily: "Inter, sans-serif" fontSize: 13px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 caption-uppercase: fontFamily: "Inter, sans-serif" fontSize: 12px fontWeight: 600 lineHeight: 1.4 letterSpacing: 1.5px code: fontFamily: "JetBrains Mono, ui-monospace, monospace" fontSize: 14px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 button: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 600 lineHeight: 1 letterSpacing: 0 nav-link: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `clickhouse`

Apply the `clickhouse`-inspired visual language to a project.

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
