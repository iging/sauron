---
name: brand-intercom
description: "\"An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom's proprietary geometric sans), and a single confident Fin Orange (#ff5600) reserved for the Fin AI brand. Cards live as floating white tiles with thin hairline borders and minimal radii (816px). Display headlines run Saans at weight 500 with measured negative tracking. The system reads as a careful, product-led publication: product screenshots dominate, ornament is rare, and the only place chromatic energy enters is the Fin Orange CTA.\""
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-intercom
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#111111" on-primary: "#ffffff" ink: "#111111" ink-muted: "#626260" ink-subtle: "#7b7b78" ink-tertiary: "#9c9fa5" canvas: "#f5f1ec" surface-1: "#ffffff" surface-2: "#ebe7e1" inverse-canvas: "#000000" inverse-surface-1: "#313130" inverse-ink: "#ffffff" inverse-ink-muted: "#9c9fa5" hairline: "#d3cec6" hairline-soft: "#ebe7e1" fin-orange: "#ff5600" report-orange: "#fe4c02" report-blue: "#65b5ff" report-green: "#0bdf50" report-pink: "#ff2067" report-lime: "#b3e01c" report-cyan: "#03b2cb" brand-blue: "#0007cb" semantic-error: "#c41c1c" semantic-success: "#0bdf50"'
typography: "display-xl: fontFamily: Saans fontSize: 72px fontWeight: 500 lineHeight: 1.05 letterSpacing: -2.0px display-lg: fontFamily: Saans fontSize: 56px fontWeight: 500 lineHeight: 1.10 letterSpacing: -1.4px display-md: fontFamily: Saans fontSize: 40px fontWeight: 500 lineHeight: 1.15 letterSpacing: -0.8px headline: fontFamily: Saans fontSize: 28px fontWeight: 500 lineHeight: 1.20 letterSpacing: -0.5px card-title: fontFamily: Saans fontSize: 22px fontWeight: 500 lineHeight: 1.25 letterSpacing: -0.3px subhead: fontFamily: Saans fontSize: 20px fontWeight: 400 lineHeight: 1.40 letterSpacing: -0.2px body-lg: fontFamily: Saans fontSize: 18px fontWeight: 400 lineHeight: 1.50 letterSpacing: -0.1px body: fontFamily: Saans fontSize: 16px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0 body-sm: fontFamily: Saans fontSize: 14px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0 caption: fontFamily: Saans fontSize: 12px fontWeight: 400 lineHeight: 1.40 letterSpacing: 0 button: fontFamily: Saans fontSize: 15px fontWeight: 500 lineHeight: 1.20 letterSpacing: 0 eyebrow: fontFamily: Saans fontSize: 14px fontWeight: 500 lineHeight: 1.30 letterSpacing: 0 mono: fontFamily: SaansMono fontSize: 13px fontWeight: 400 lineHeight: 1.50 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `intercom`

Apply the `intercom`-inspired visual language to a project.

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
