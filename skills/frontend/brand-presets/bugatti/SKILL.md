---
name: brand-bugatti
description: An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive photography as the only voltage. The system runs three custom Bugatti typefaces  -  Bugatti Display, Bugatti Text Regular, and Bugatti Monospace  -  and combines them at modest weights with wide tracking to feel European-engineered, hyper-minimal, and quietly expensive. There is no accent color, no decorative element, no chrome  -  only photography, typography, and the brand wordmark.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-bugatti
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ffffff" ink: "#ffffff" body: "#cccccc" body-strong: "#e6e6e6" muted: "#999999" muted-soft: "#666666" hairline: "#262626" hairline-strong: "#3a3a3a" canvas: "#000000" surface-soft: "#0d0d0d" surface-card: "#141414" surface-elevated: "#1f1f1f" on-primary: "#000000" on-dark: "#ffffff" on-photo: "#ffffff" link: "#c3d9f3" warning: "#d4a017" success: "#5fa657"'
typography: 'display-xl: fontFamily: "Bugatti Display, sans-serif" fontSize: 64px fontWeight: 400 lineHeight: 1.1 letterSpacing: 4px display-lg: fontFamily: "Bugatti Display, sans-serif" fontSize: 48px fontWeight: 400 lineHeight: 1.15 letterSpacing: 3px display-md: fontFamily: "Bugatti Display, sans-serif" fontSize: 32px fontWeight: 400 lineHeight: 1.2 letterSpacing: 2px display-sm: fontFamily: "Bugatti Display, sans-serif" fontSize: 24px fontWeight: 400 lineHeight: 1.3 letterSpacing: 1.5px wordmark: fontFamily: "Bugatti Display, serif" fontSize: 14px fontWeight: 400 lineHeight: 1 letterSpacing: 6px title-md: fontFamily: "Bugatti Display, sans-serif" fontSize: 20px fontWeight: 400 lineHeight: 1.3 letterSpacing: 1px title-sm: fontFamily: "Bugatti Display, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.3 letterSpacing: 1.5px caption-uppercase: fontFamily: "Bugatti Monospace, ui-monospace, monospace" fontSize: 11px fontWeight: 400 lineHeight: 1.4 letterSpacing: 2px body-md: fontFamily: "Bugatti Text Regular, serif" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: "Bugatti Text Regular, serif" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button: fontFamily: "Bugatti Monospace, ui-monospace, monospace" fontSize: 14px fontWeight: 400 lineHeight: 1 letterSpacing: 2.5px nav-link: fontFamily: "Bugatti Monospace, ui-monospace, monospace" fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 2px'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 40px xxl: 64px section: 120px"
---

# Brand Preset: `bugatti`

Apply the `bugatti`-inspired visual language to a project.

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
