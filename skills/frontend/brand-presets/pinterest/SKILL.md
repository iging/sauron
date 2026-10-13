---
name: brand-pinterest
description: "| A photography-first discovery system organized around the Pinterest Red CTA, the masonry pin grid, and a soft warm-cream chrome that gets out of the imagery's way. The home page is a content-discovery tool wearing the chrome of a magazine publisher: 70px display headlines, friendly Pin Sans typography, fully-rounded pill buttons (16px) on a cream-tinted neutral palette, and a sticky red \"Sign up\" CTA that anchors every viewport. Pin imagery is the system's load-bearing visual element  -  square, portrait, and landscape pins tile in a column-based masonry grid where each tile is a fully-rounded 16px-radius card, separated by tight 8px gutters. The chrome is otherwise quiet: warm grays, true whites, and a single saturated red  -  no decorative gradients, no atmospheric backgrounds, no shadows beyond a soft modal scrim."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-pinterest
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#e60023" on-primary: "#ffffff" primary-pressed: "#cc001f" ink: "#000000" ink-soft: "#211922" body: "#33332e" charcoal: "#262622" mute: "#62625b" ash: "#91918c" stone: "#c8c8c1" hairline: "#dadad3" hairline-soft: "#e5e5e0" on-secondary: "#000000" secondary-bg: "#e5e5e0" secondary-pressed: "#c8c8c1" canvas: "#ffffff" surface-soft: "#fbfbf9" surface-card: "#f6f6f3" surface-elevated: "#ffffff" on-dark: "#ffffff" on-dark-mute: "rgba(255,255,255,0.7)" surface-dark: "#262622" focus-outer: "#435ee5" focus-inner: "#ffffff" accent-pressed-blue: "#617bff" accent-purple: "#7e238b" accent-purple-deep: "#6845ab" success-deep: "#103c25" success-pale: "#c7f0da" error: "#9e0a0a" error-deep: "#cc001f"'
typography: "display-xl: fontFamily: Pin Sans fontSize: 70px fontWeight: 600 lineHeight: 1.1 letterSpacing: -1.2px display-lg: fontFamily: Pin Sans fontSize: 44px fontWeight: 700 lineHeight: 1.15 letterSpacing: -0.8px heading-xl: fontFamily: Pin Sans fontSize: 28px fontWeight: 700 lineHeight: 1.2 letterSpacing: -1.2px heading-lg: fontFamily: Pin Sans fontSize: 22px fontWeight: 600 lineHeight: 1.25 letterSpacing: 0 heading-md: fontFamily: Pin Sans fontSize: 18px fontWeight: 600 lineHeight: 1.3 letterSpacing: 0 body-md: fontFamily: Pin Sans fontSize: 16px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 body-strong: fontFamily: Pin Sans fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 body-sm: fontFamily: Pin Sans fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 body-sm-strong: fontFamily: Pin Sans fontSize: 14px fontWeight: 700 lineHeight: 1.4 letterSpacing: 0 caption-md: fontFamily: Pin Sans fontSize: 12px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 caption-sm: fontFamily: Pin Sans fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 link-md: fontFamily: Pin Sans fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 button-md: fontFamily: Pin Sans fontSize: 14px fontWeight: 700 lineHeight: 1 letterSpacing: 0 button-sm: fontFamily: Pin Sans fontSize: 12px fontWeight: 700 lineHeight: 1 letterSpacing: 0"
spacing: "xxs: 4px xs: 6px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 64px"
---

# Brand Preset: `pinterest`

Apply the `pinterest`-inspired visual language to a project.

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
