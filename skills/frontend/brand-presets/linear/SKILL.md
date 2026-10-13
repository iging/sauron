---
name: brand-linear
description: '"A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text (#f7f8f8), and the signature Linear lavender-blue (#5e6ad2) used as the single chromatic accent. The system reads as software documentation: dense, technical, and quietly. Display type is set in the Linear custom sans (SF Pro Display fallback) at 500700 with measured negative tracking. Cards live as charcoal panels (#0f1011) with hairline borders. The accent lavender appears on the brand mark, focus rings, and a few intentional CTAs  -  never decoratively. Page rhythm leans on product UI screenshots framed in dark panels rather than atmospheric color."'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-linear
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#5e6ad2" on-primary: "#ffffff" primary-hover: "#828fff" primary-focus: "#5e69d1" ink: "#f7f8f8" ink-muted: "#d0d6e0" ink-subtle: "#8a8f98" ink-tertiary: "#62666d" canvas: "#010102" surface-1: "#0f1011" surface-2: "#141516" surface-3: "#18191a" surface-4: "#191a1b" hairline: "#23252a" hairline-strong: "#34343a" hairline-tertiary: "#3e3e44" inverse-canvas: "#ffffff" inverse-surface-1: "#f5f6f6" inverse-surface-2: "#f6f7f7" inverse-ink: "#000000" brand-secure: "#7a7fad" semantic-success: "#27a644" semantic-overlay: "#000000"'
typography: "display-xl: fontFamily: Linear Display fontSize: 80px fontWeight: 600 lineHeight: 1.05 letterSpacing: -3.0px display-lg: fontFamily: Linear Display fontSize: 56px fontWeight: 600 lineHeight: 1.10 letterSpacing: -1.8px display-md: fontFamily: Linear Display fontSize: 40px fontWeight: 600 lineHeight: 1.15 letterSpacing: -1.0px headline: fontFamily: Linear Display fontSize: 28px fontWeight: 600 lineHeight: 1.20 letterSpacing: -0.6px card-title: fontFamily: Linear Display fontSize: 22px fontWeight: 500 lineHeight: 1.25 letterSpacing: -0.4px subhead: fontFamily: Linear Display fontSize: 20px fontWeight: 400 lineHeight: 1.40 letterSpacing: -0.2px body-lg: fontFamily: Linear Text fontSize: 18px fontWeight: 400 lineHeight: 1.50 letterSpacing: -0.1px body: fontFamily: Linear Text fontSize: 16px fontWeight: 400 lineHeight: 1.50 letterSpacing: -0.05px body-sm: fontFamily: Linear Text fontSize: 14px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0 caption: fontFamily: Linear Text fontSize: 12px fontWeight: 400 lineHeight: 1.40 letterSpacing: 0 button: fontFamily: Linear Text fontSize: 14px fontWeight: 500 lineHeight: 1.20 letterSpacing: 0 eyebrow: fontFamily: Linear Text fontSize: 13px fontWeight: 500 lineHeight: 1.30 letterSpacing: 0.4px mono: fontFamily: Linear Mono fontSize: 13px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `linear`

Apply the `linear`-inspired visual language to a project.

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
