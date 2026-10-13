---
name: brand-slack
description: An interpretation of Slacc's design language  -  a workplace messaging brand built on a deep aubergine primary, with cream-lavender hero gradients, blue inline links, and pill CTAs. The system pairs a proprietary humanist sans for display with a separate utility sans for body, and stages product UI mockups inside soft pastel-mesh hero composites that act as both decoration and feature explanation.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-slack
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#4a154b" primary-deep: "#481a54" primary-press: "#611f69" primary-tint: "#592466" on-primary: "#ffffff" ink: "#1d1d1d" ink-mute: "#696969" link-blue: "#1264a3" link-hover: "#3860be" canvas: "#ffffff" canvas-cream: "#f4ede4" canvas-lavender: "#f9f0ff" surface-elev: "#ffffff" surface-aubergine: "#4a154b" hairline: "#e6e6e6" hairline-strong: "#000000" semantic-error: "#cc4117" semantic-success: "#007a5a" on-aubergine-mute: "#d9bdde"'
typography: 'display-xxl: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 64px fontWeight: 700 lineHeight: 1.12 letterSpacing: -0.768px display-xl: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 58px fontWeight: 600 lineHeight: 1.25 letterSpacing: -0.464px display-lg: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 50px fontWeight: 700 lineHeight: 1.12 letterSpacing: -0.6px display-md: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 32px fontWeight: 700 lineHeight: 1.25 letterSpacing: -0.256px heading-lg: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 24px fontWeight: 700 lineHeight: 1.33 letterSpacing: -0.096px heading-md: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 22px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 heading-sm: fontFamily: "Salesforce-Avant-Garde, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontSize: 18px fontWeight: 600 lineHeight: 1.56 letterSpacing: -0.0216px body-lg: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 18px fontWeight: 400 lineHeight: 1.55 letterSpacing: -0.0216px body-md: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.55 letterSpacing: 0 body-strong: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 16px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0.16px button-lg: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 18px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0 button-md: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 16px fontWeight: 700 lineHeight: 1.38 letterSpacing: 0.2px button-cap: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 14.4px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0.144px caption: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0.1px micro-cap: fontFamily: "Salesforce-Sans, system-ui, -apple-system, sans-serif" fontSize: 12px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0.96px'
spacing: "xs: 4px sm: 8px md: 12px lg: 16px xl: 20px xxl: 24px huge: 28px"
---

# Brand Preset: `slack`

Apply the `slack`-inspired visual language to a project.

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
