---
name: brand-webflow
description: An interpretation of Webflow's design language  -  a visual web development platform whose surface contrasts a deep near-black `#080808` primary against a generous white canvas, broken by a five-stop chromatic accent system (purple / pink / blue / orange / green) that maps to the brand's product categories, and anchored by the proprietary WF Visual Sans family used at restrained 500 / 600 weights with negative tracking.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-webflow
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#080808" on-primary: "#ffffff" ink: "#080808" ink-strong: "#222222" body: "#363636" body-mid: "#5a5a5a" mute: "#898989" mute-soft: "#ababab" hairline: "#d8d8d8" canvas: "#ffffff" accent-purple: "#7a3dff" accent-pink: "#ed52cb" accent-blue: "#3b89ff" accent-blue-deep: "#006acc" accent-blue-info: "#146ef5" accent-orange: "#ff6b00" accent-green: "#00d722" accent-yellow: "#ffae13" accent-red: "#ee1d36"'
typography: "display-xxl: fontFamily: WF Visual Sans Variable, Inter, system-ui, -apple-system, sans-serif fontSize: 80px fontWeight: 600 lineHeight: 83.2px letterSpacing: -0.8px display-xl: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 56px fontWeight: 600 lineHeight: 58.24px display-lg: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 44.8px fontWeight: 600 lineHeight: 46.6px display-md: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 32px fontWeight: 500 lineHeight: 41.6px display-sm: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 24px fontWeight: 500 lineHeight: 31.2px display-xs: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 20px fontWeight: 500 lineHeight: 28px eyebrow-uppercase: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 15px fontWeight: 500 lineHeight: 19.5px letterSpacing: 1.5px eyebrow-uppercase-sm: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 12px fontWeight: 500 lineHeight: 12px letterSpacing: 0.6px body-lg: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 28.8px fontWeight: 400 lineHeight: 46.08px letterSpacing: -0.288px body-md: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 16px fontWeight: 400 lineHeight: 25.6px letterSpacing: -0.16px body-md-strong: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 16px fontWeight: 500 lineHeight: 25.6px letterSpacing: -0.16px body-sm: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 22.4px body-sm-strong: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 14px fontWeight: 500 lineHeight: 22.4px caption: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 12.8px fontWeight: 550 lineHeight: 15.36px caption-mono: fontFamily: WFVisualSans-Mono, Inconsolata, ui-monospace, SFMono-Regular, Menlo, monospace fontSize: 12px fontWeight: 400 lineHeight: 18px button-md: fontFamily: WF Visual Sans Variable, Inter, system-ui, sans-serif fontSize: 16px fontWeight: 500 lineHeight: 25.6px letterSpacing: -0.16px"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 20px 2xl: 24px 3xl: 32px"
---

# Brand Preset: `webflow`

Apply the `webflow`-inspired visual language to a project.

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
