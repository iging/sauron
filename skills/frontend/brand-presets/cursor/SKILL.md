---
name: brand-cursor
description: An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (`#f7f7f4`) instead of the typical dark IDE atmosphere. Near-black warm ink (`#26251e`) carries body and display alike  -  display sits at weight 400 with negative letter-spacing for a magazine feel rather than a bold tech voice. The single brand voltage is **Cursor Orange** (`#f54e00`) reserved for primary CTAs and the wordmark. A signature pastel timeline palette (peach, mint, blue, lavender, gold) marks AI-action stages (Thinking / Reading / Editing / Grepping / Done)  -  only inside in-product timeline visualizations. Cards use minimal hairlines, no shadows, generous 80px section rhythm. CursorGothic for display/body, JetBrains Mono on every code surface (which is roughly half the page).
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-cursor
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#f54e00" primary-active: "#d04200" ink: "#26251e" body: "#5a5852" body-strong: "#26251e" muted: "#807d72" muted-soft: "#a09c92" hairline: "#e6e5e0" hairline-soft: "#efeee8" hairline-strong: "#cfcdc4" canvas: "#f7f7f4" canvas-soft: "#fafaf7" surface-card: "#ffffff" surface-strong: "#e6e5e0" on-primary: "#ffffff" timeline-thinking: "#dfa88f" timeline-grep: "#9fc9a2" timeline-read: "#9fbbe0" timeline-edit: "#c0a8dd" timeline-done: "#c08532" semantic-error: "#cf2d56" semantic-success: "#1f8a65"'
typography: "display-mega: fontFamily: \"'CursorGothic', system-ui, 'Helvetica Neue', Helvetica, Arial, sans-serif\" fontSize: 72px fontWeight: 400 lineHeight: 1.1 letterSpacing: -2.16px display-lg: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 36px fontWeight: 400 lineHeight: 1.2 letterSpacing: -0.72px display-md: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 26px fontWeight: 400 lineHeight: 1.25 letterSpacing: -0.325px display-sm: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 22px fontWeight: 400 lineHeight: 1.3 letterSpacing: -0.11px title-md: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 18px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-tracked: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.08px body-sm: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 13px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 caption-uppercase: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 11px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0.88px textTransform: uppercase code: fontFamily: \"'JetBrains Mono', 'Fira Code', monospace\" fontSize: 13px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.0 letterSpacing: 0 nav-link: fontFamily: \"'CursorGothic', sans-serif\" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0"
spacing: "xxs: 4px xs: 8px sm: 12px base: 16px md: 20px lg: 24px xl: 32px xxl: 48px section: 80px"
---

# Brand Preset: `cursor`

Apply the `cursor`-inspired visual language to a project.

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
