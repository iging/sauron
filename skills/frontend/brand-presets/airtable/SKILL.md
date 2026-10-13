---
name: brand-airtable
description: A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signature cards in coral, dark green, peach, and dark navy that punctuate long-scroll explainer pages. Primary actions use a near-black pill CTA; secondary actions sit in a white outlined button. Type runs Haas Grotesk in modest weights  -  never bold for its own sake.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-airtable
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#181d26" primary-active: "#0d1218" ink: "#181d26" body: "#333840" muted: "#41454d" hairline: "#dddddd" border-strong: "#9297a0" canvas: "#ffffff" surface-soft: "#f8fafc" surface-strong: "#e0e2e6" surface-dark: "#181d26" surface-dark-elevated: "#1d1f25" signature-coral: "#aa2d00" signature-forest: "#0a2e0e" signature-cream: "#f5e9d4" signature-peach: "#fcab79" signature-mint: "#a8d8c4" signature-yellow: "#f4d35e" signature-mustard: "#d9a441" on-primary: "#ffffff" on-dark: "#ffffff" link: "#1b61c9" link-active: "#1a3866" info: "#254fad" info-border: "#458fff" success: "#006400" success-border: "#39bf45" pricing-ink: "#1d1f25"'
typography: 'display-xl: fontFamily: "Haas Groot Disp, Haas, sans-serif" fontSize: 48px fontWeight: 500 lineHeight: 1.1 letterSpacing: 0 display-lg: fontFamily: "Haas Groot Disp, Haas, sans-serif" fontSize: 40px fontWeight: 400 lineHeight: 1.2 letterSpacing: 0 display-md: fontFamily: "Haas Groot Disp, Haas, sans-serif" fontSize: 32px fontWeight: 400 lineHeight: 1.2 letterSpacing: 0 title-lg: fontFamily: "Haas, sans-serif" fontSize: 24px fontWeight: 400 lineHeight: 1.35 letterSpacing: 0.12px title-md: fontFamily: "Haas Groot Disp, Haas, sans-serif" fontSize: 20px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 title-sm: fontFamily: "Haas, sans-serif" fontSize: 18px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 label-md: fontFamily: "Haas, sans-serif" fontSize: 16px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 button: fontFamily: "Haas, sans-serif" fontSize: 16px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: "Haas, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.25 letterSpacing: 0 caption: fontFamily: "Haas, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.35 letterSpacing: 0.16px legal: fontFamily: "Haas, sans-serif" fontSize: 13.12px fontWeight: 600 lineHeight: 1.2 letterSpacing: 0 pricing-display: fontFamily: "Inter Display, system-ui, sans-serif" fontSize: 44.8px fontWeight: 475 lineHeight: 1.1 letterSpacing: 0 pricing-section: fontFamily: "Inter Display, system-ui, sans-serif" fontSize: 28px fontWeight: 475 lineHeight: 1.2 letterSpacing: 0 pricing-card-title: fontFamily: "Inter Display, system-ui, sans-serif" fontSize: 20px fontWeight: 475 lineHeight: 1.3 letterSpacing: 0'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `airtable`

Apply the `airtable`-inspired visual language to a project.

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
