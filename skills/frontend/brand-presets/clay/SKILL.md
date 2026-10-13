---
name: brand-clay
description: A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTAs, custom rounded display type, and saturated single-color feature cards  -  hot pink, deep teal, lavender, peach, ochre  -  that punctuate long-scroll explainer pages. Brand voltage comes from 3D-rendered claymation illustrations (mountains, characters, mascots) used as full-bleed hero artifacts and the bright multi-color card surfaces showing product UI fragments.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-clay
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0a0a0a" primary-active: "#1f1f1f" primary-disabled: "#e5e5e5" ink: "#0a0a0a" body: "#3a3a3a" body-strong: "#1a1a1a" muted: "#6a6a6a" muted-soft: "#9a9a9a" hairline: "#e5e5e5" hairline-soft: "#f0f0f0" canvas: "#fffaf0" surface-soft: "#faf5e8" surface-card: "#f5f0e0" surface-strong: "#ebe6d6" surface-dark: "#0a1a1a" surface-dark-elevated: "#1a2a2a" on-primary: "#ffffff" on-dark: "#ffffff" on-dark-soft: "#a0a0a0" brand-pink: "#ff4d8b" brand-teal: "#1a3a3a" brand-lavender: "#b8a4ed" brand-peach: "#ffb084" brand-ochre: "#e8b94a" brand-mint: "#a4d4c5" brand-coral: "#ff6b5a" success: "#22c55e" warning: "#f59e0b" error: "#ef4444"'
typography: 'display-xl: fontFamily: "Plain Black, Inter, sans-serif" fontSize: 72px fontWeight: 500 lineHeight: 1 letterSpacing: -2.5px display-lg: fontFamily: "Plain Black, Inter, sans-serif" fontSize: 56px fontWeight: 500 lineHeight: 1.05 letterSpacing: -2px display-md: fontFamily: "Plain Black, Inter, sans-serif" fontSize: 40px fontWeight: 500 lineHeight: 1.1 letterSpacing: -1px display-sm: fontFamily: "Plain Black, Inter, sans-serif" fontSize: 32px fontWeight: 500 lineHeight: 1.15 letterSpacing: -0.5px title-lg: fontFamily: "Inter, sans-serif" fontSize: 24px fontWeight: 600 lineHeight: 1.3 letterSpacing: -0.3px title-md: fontFamily: "Inter, sans-serif" fontSize: 18px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: "Inter, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: "Inter, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 body-sm: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 caption: fontFamily: "Inter, sans-serif" fontSize: 13px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 caption-uppercase: fontFamily: "Inter, sans-serif" fontSize: 12px fontWeight: 600 lineHeight: 1.4 letterSpacing: 1.5px button: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 600 lineHeight: 1 letterSpacing: 0 nav-link: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `clay`

Apply the `clay`-inspired visual language to a project.

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
