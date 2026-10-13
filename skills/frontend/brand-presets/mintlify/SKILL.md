---
name: brand-mintlify
description: Mintlify presents documentation infrastructure with a dual-mode aesthetic  -  atmospheric sky-gradient marketing heroes (cloud illustration backdrops, soft cream-to-blue washes) paired with dense developer-grade documentation surfaces. The system uses Inter for UI prose, Geist Mono for code, and a signature Mintlify green ({colors.brand-green}) reserved for accent CTAs and active states. Black-pill primary buttons dominate marketing, white-on-dark inversions appear on dark hero bands, and a 3-column documentation layout (sidebar / prose / TOC) anchors the developer experience. Coverage spans homepage, startups program, pricing comparison, and the live tabs documentation page.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-mintlify
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#0a0a0a" on-primary: "#ffffff" brand-green: "#00d4a4" brand-green-deep: "#00b48a" brand-green-soft: "#7cebcb" brand-tag: "#3772cf" brand-warn: "#c37d0d" brand-annotate: "#1ba673" brand-error: "#d45656" brand-cursor: "#888888" hero-sky-from: "#87a8c8" hero-sky-to: "#f5e9d8" hero-dark-from: "#1a3d4a" hero-dark-to: "#2d5a4f" testimonial-orange: "#f55a3c" testimonial-orange-deep: "#cc3a1f" canvas: "#ffffff" canvas-dark: "#0a0a0a" surface: "#f7f7f7" surface-soft: "#fafafa" surface-code: "#1c1c1e" hairline: "#e5e5e5" hairline-soft: "#ededed" hairline-dark: "#1f1f1f" ink: "#0a0a0a" charcoal: "#1c1c1e" slate: "#3a3a3c" steel: "#5a5a5c" stone: "#888888" muted: "#a8a8aa" on-dark: "#ffffff" on-dark-muted: "#b3b3b3"'
typography: "hero-display: fontFamily: Inter fontSize: 72px fontWeight: 600 lineHeight: 1.05 letterSpacing: -2px display-lg: fontFamily: Inter fontSize: 56px fontWeight: 600 lineHeight: 1.10 letterSpacing: -1.5px heading-1: fontFamily: Inter fontSize: 48px fontWeight: 600 lineHeight: 1.10 letterSpacing: -1px heading-2: fontFamily: Inter fontSize: 36px fontWeight: 600 lineHeight: 1.20 letterSpacing: -0.5px heading-3: fontFamily: Inter fontSize: 28px fontWeight: 600 lineHeight: 1.25 heading-4: fontFamily: Inter fontSize: 22px fontWeight: 600 lineHeight: 1.30 heading-5: fontFamily: Inter fontSize: 18px fontWeight: 600 lineHeight: 1.40 subtitle: fontFamily: Inter fontSize: 18px fontWeight: 400 lineHeight: 1.50 body-md: fontFamily: Inter fontSize: 16px fontWeight: 400 lineHeight: 1.50 body-md-medium: fontFamily: Inter fontSize: 16px fontWeight: 500 lineHeight: 1.50 body-sm: fontFamily: Inter fontSize: 14px fontWeight: 400 lineHeight: 1.50 body-sm-medium: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.50 caption: fontFamily: Inter fontSize: 13px fontWeight: 400 lineHeight: 1.40 caption-bold: fontFamily: Inter fontSize: 13px fontWeight: 600 lineHeight: 1.40 micro: fontFamily: Inter fontSize: 12px fontWeight: 500 lineHeight: 1.40 micro-uppercase: fontFamily: Inter fontSize: 11px fontWeight: 600 lineHeight: 1.40 letterSpacing: 0.5px button-md: fontFamily: Inter fontSize: 14px fontWeight: 500 lineHeight: 1.30 code-md: fontFamily: Geist Mono fontSize: 14px fontWeight: 400 lineHeight: 1.50 code-sm: fontFamily: Geist Mono fontSize: 13px fontWeight: 400 lineHeight: 1.40 code-inline: fontFamily: Geist Mono fontSize: 13px fontWeight: 500 lineHeight: 1.30"
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 20px xl: 24px xxl: 32px xxxl: 40px section-sm: 48px section: 64px section-lg: 96px hero: 120px"
---

# Brand Preset: `mintlify`

Apply the `mintlify`-inspired visual language to a project.

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
