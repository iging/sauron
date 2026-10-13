---
name: brand-composio
description: A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single deep-electric-blue voltage (`#0007cd`). The page floor is near-black (`#0f0f0f`); cards float above on subtle gray-tinted surfaces. abcDiatype carries display and body in a single sans family with weights 400-600. The brand's strongest visual signature is a four-pane terminal-style mockup (a 22 grid of dark code/output panels) with a central blue spotlight glow  -  used as the homepage hero anchor.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-composio
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0007cd" primary-active: "#0005a3" primary-glow: "#1a26ff" ink: "#ffffff" body: "#a8a8a8" body-strong: "#ffffff" muted: "#888888" muted-soft: "#666666" hairline: "#222222" hairline-soft: "#1a1a1a" hairline-strong: "#333333" canvas: "#0f0f0f" canvas-deep: "#000000" surface-card: "#181818" surface-card-elevated: "#222222" surface-strong: "#2a2a2a" on-primary: "#ffffff" on-dark: "#ffffff" accent-cyan: "#00d4ff" accent-violet: "#7b3aed" semantic-error: "#ff4d4d" semantic-success: "#33d17a"'
typography: "display-mega: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 72px fontWeight: 500 lineHeight: 1.05 letterSpacing: -2.16px display-xl: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 56px fontWeight: 500 lineHeight: 1.05 letterSpacing: -1.68px display-lg: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 44px fontWeight: 500 lineHeight: 1.1 letterSpacing: -1.32px display-md: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 32px fontWeight: 500 lineHeight: 1.15 letterSpacing: -0.96px display-sm: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 24px fontWeight: 500 lineHeight: 1.25 letterSpacing: -0.5px title-md: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 18px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 caption-uppercase: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 11px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0.88px textTransform: uppercase code: fontFamily: \"'JetBrains Mono', 'Fira Code', monospace\" fontSize: 13px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 nav-link: fontFamily: \"'abcDiatype', ui-sans-serif, system-ui, sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px base: 16px md: 20px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `composio`

Apply the `composio`-inspired visual language to a project.

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
