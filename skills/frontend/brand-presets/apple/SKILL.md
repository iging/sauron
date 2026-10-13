---
name: brand-apple
description: A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF Pro Display headlines with negative letter-spacing and a single Action Blue (#0066cc) interactive color. UI chrome recedes so the product can speak  -  no decorative gradients, no shadows on chrome, only the one signature drop-shadow under product imagery resting on a surface.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-apple
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0066cc" primary-focus: "#0071e3" primary-on-dark: "#2997ff" ink: "#1d1d1f" body: "#1d1d1f" body-on-dark: "#ffffff" body-muted: "#cccccc" ink-muted-80: "#333333" ink-muted-48: "#7a7a7a" divider-soft: "#f0f0f0" hairline: "#e0e0e0" canvas: "#ffffff" canvas-parchment: "#f5f5f7" surface-pearl: "#fafafc" surface-tile-1: "#272729" surface-tile-2: "#2a2a2c" surface-tile-3: "#252527" surface-black: "#000000" surface-chip-translucent: "#d2d2d7" on-primary: "#ffffff" on-dark: "#ffffff"'
typography: 'hero-display: fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" fontSize: 56px fontWeight: 600 lineHeight: 1.07 letterSpacing: -0.28px display-lg: fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" fontSize: 40px fontWeight: 600 lineHeight: 1.1 letterSpacing: 0 display-md: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 34px fontWeight: 600 lineHeight: 1.47 letterSpacing: -0.374px lead: fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" fontSize: 28px fontWeight: 400 lineHeight: 1.14 letterSpacing: 0.196px lead-airy: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 24px fontWeight: 300 lineHeight: 1.5 letterSpacing: 0 tagline: fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif" fontSize: 21px fontWeight: 600 lineHeight: 1.19 letterSpacing: 0.231px body-strong: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 17px fontWeight: 600 lineHeight: 1.24 letterSpacing: -0.374px body: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 17px fontWeight: 400 lineHeight: 1.47 letterSpacing: -0.374px dense-link: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 17px fontWeight: 400 lineHeight: 2.41 letterSpacing: 0 caption: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: -0.224px caption-strong: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 14px fontWeight: 600 lineHeight: 1.29 letterSpacing: -0.224px button-large: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 18px fontWeight: 300 lineHeight: 1.0 letterSpacing: 0 button-utility: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.29 letterSpacing: -0.224px fine-print: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 12px fontWeight: 400 lineHeight: 1.0 letterSpacing: -0.12px micro-legal: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 10px fontWeight: 400 lineHeight: 1.3 letterSpacing: -0.08px nav-link: fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif" fontSize: 12px fontWeight: 400 lineHeight: 1.0 letterSpacing: -0.12px'
spacing: "xxs: 4px xs: 8px sm: 12px md: 17px lg: 24px xl: 32px xxl: 48px section: 80px"
---

# Brand Preset: `apple`

Apply the `apple`-inspired visual language to a project.

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
