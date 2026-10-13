---
name: brand-x-ai
description: An interpretation of xAI's design language  -  Elon Musk's frontier-AI company whose web surface is a strict near-black canvas broken only by white pill outlines, occasional warm sunset / dusk gradient accents, a custom geometric sans (Universal Sans) for display, and an uppercase tracked monospace caption face; the whole system reads as engineered-cosmic, unmarketed.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-x-ai
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ffffff" on-primary: "#0a0a0a" ink: "#ffffff" ink-hover: "#fafaf7" body: "#dadbdf" body-mid: "#7d8187" mute: "#7d8187" hairline: "#212327" canvas: "#0a0a0a" canvas-soft: "#1a1c20" canvas-card: "#191919" canvas-mid: "#363a3f" accent-sunset: "#ff7a17" accent-sunset-soft: "#ffc285" accent-dusk: "#7c3aed" accent-twilight: "#c4b5fd" accent-breeze: "#a0c3ec" accent-midnight: "#0d1726"'
typography: "display-xl: fontFamily: universalSans, Inter, system-ui, -apple-system, sans-serif fontSize: 96px fontWeight: 400 lineHeight: 96px letterSpacing: -2.4px display-lg: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 72px fontWeight: 400 lineHeight: 72px letterSpacing: -1.8px display-md: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 48px fontWeight: 400 lineHeight: 48px letterSpacing: -1.2px display-sm: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 32px fontWeight: 400 lineHeight: 36px letterSpacing: -0.6px display-xs: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 20px fontWeight: 400 lineHeight: 28px body-lg: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 28px body-md: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 24px body-sm: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 20px caption-mono: fontFamily: GeistMono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace fontSize: 14px fontWeight: 400 lineHeight: 20px letterSpacing: 1.4px caption-mono-sm: fontFamily: GeistMono, ui-monospace, SFMono-Regular, Menlo, monospace fontSize: 12px fontWeight: 400 lineHeight: 16px letterSpacing: 1.2px button-md: fontFamily: universalSans, Inter, system-ui, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 20px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px 2xl: 32px 3xl: 48px 4xl: 64px"
---

# Brand Preset: `x-ai`

Apply the `x-ai`-inspired visual language to a project.

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
