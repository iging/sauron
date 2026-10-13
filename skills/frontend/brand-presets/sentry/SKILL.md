---
name: brand-sentry
description: An interpretation of Sentri's design language  -  a developer-tools brand built on a deep purple-violet midnight canvas, electric lime accents, and a slightly subversive illustrated personality. The system pairs a custom display sans (chunky, playful, near-condensed) with the open Rubik family for UI copy and Monaco for code, then leans on dark-on-light pricing surfaces, sticker-style mascots, and a single-color CTA hierarchy where black-violet buttons read as the primary action against either polarity.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-sentry
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#150f23" ink-deep: "#1f1633" on-primary: "#ffffff" accent-lime: "#c2ef4e" accent-pink: "#fa7faa" accent-violet: "#6a5fc1" accent-violet-deep: "#422082" accent-violet-mid: "#79628c" surface-canvas-dark: "#1f1633" surface-canvas-light: "#ffffff" surface-night: "#150f23" surface-press-light: "#f0f0f0" surface-press-stronger: "#efefef" hairline-violet: "#362d59" hairline-cool: "#cfcfdb" hairline-cloud: "#e5e7eb" ink: "#1f1633" ink-press: "#1a1a1a" on-dark-muted: "#bdb8c0" on-dark-faint: "#3f3849" ring-focus: "#9dc1f5"'
typography: 'display-hero: fontFamily: "Sentri Display, Rubik, system-ui, sans-serif" fontSize: 88px fontWeight: 700 lineHeight: 1.2 letterSpacing: 0 display-large: fontFamily: "Sentri Display, Rubik, system-ui, sans-serif" fontSize: 60px fontWeight: 500 lineHeight: 1.1 letterSpacing: 0 heading-xl: fontFamily: "Rubik, -apple-system, system-ui, Segoe UI, Helvetica, Arial, sans-serif" fontSize: 30px fontWeight: 500 lineHeight: 1.2 letterSpacing: 0 heading-lg: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 27px fontWeight: 500 lineHeight: 1.25 letterSpacing: 0 heading-md: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 24px fontWeight: 500 lineHeight: 1.25 letterSpacing: 0 heading-sm: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 20px fontWeight: 600 lineHeight: 1.25 letterSpacing: 0 body-lg: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 2.0 letterSpacing: 0 body-strong: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.5 letterSpacing: 0 body-md: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 16px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 eyebrow: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 15px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 button-cap: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 14px fontWeight: 700 lineHeight: 1.14 letterSpacing: 0.2px button-cap-light: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.29 letterSpacing: 0.2px caption: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 micro-cap: fontFamily: "Rubik, -apple-system, system-ui, sans-serif" fontSize: 10px fontWeight: 600 lineHeight: 1.8 letterSpacing: 0.25px code: fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 code-strong: fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace" fontSize: 16px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0'
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 96px"
---

# Brand Preset: `sentry`

Apply the `sentry`-inspired visual language to a project.

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
