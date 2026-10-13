---
name: brand-voltagent
description: An interpretation of Voltagent's design language  -  a developer-focused AI agent engineering platform whose surface is an unrelenting near-black canvas broken only by a single electric-green brand accent, code-editor mockups inside the hero, and a precise grid of dark feature cards that read like a documentation site dressed as marketing.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-voltagent
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#00d992" primary-soft: "#2fd6a1" primary-deep: "#10b981" on-primary: "#101010" ink: "#f2f2f2" ink-strong: "#ffffff" body: "#bdbdbd" mute: "#8b949e" hairline: "#3d3a39" hairline-soft: "#b8b3b0" canvas: "#101010" canvas-soft: "#1a1a1a" canvas-text-soft: "#f5f6f7"'
typography: "display-xl: fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif fontSize: 60px fontWeight: 400 lineHeight: 60px letterSpacing: -0.65px display-lg: fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif fontSize: 36px fontWeight: 400 lineHeight: 40px letterSpacing: -0.9px display-md: fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif fontSize: 24px fontWeight: 700 lineHeight: 32px letterSpacing: -0.6px display-sm: fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif fontSize: 20px fontWeight: 600 lineHeight: 28px eyebrow-mono: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 14px fontWeight: 600 lineHeight: 20px letterSpacing: 2.52px eyebrow-uppercase: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 18px fontWeight: 600 lineHeight: 28px letterSpacing: 0.45px body-lg: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 18px fontWeight: 400 lineHeight: 28px body-md: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 26px body-md-strong: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 16px fontWeight: 600 lineHeight: 24px body-sm: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 20px body-sm-strong: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 14px fontWeight: 600 lineHeight: 23px caption: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 12px fontWeight: 400 lineHeight: 16px caption-strong: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 12px fontWeight: 500 lineHeight: 16px code: fontFamily: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace fontSize: 13px fontWeight: 400 lineHeight: 18px code-strong: fontFamily: SFMono-Regular, Menlo, Monaco, Consolas, monospace fontSize: 13px fontWeight: 550 lineHeight: 16px button-md: fontFamily: Inter, system-ui, -apple-system, sans-serif fontSize: 16px fontWeight: 600 lineHeight: 24px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 20px 2xl: 24px 3xl: 32px 4xl: 40px 5xl: 48px 6xl: 64px"
---

# Brand Preset: `voltagent`

Apply the `voltagent`-inspired visual language to a project.

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
