---
name: brand-wired
description: An interpretation of Wired's design language  -  a flagship technology-magazine brand whose surface is a strict editorial duet of stark black wordmark on white canvas, anchored by a tall narrow custom display serif for hero headlines, a humanist serif body face for long-form reading, and a clean sans face for metadata; layout reads like a printed magazine ported to the web with very little marketing chrome.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-wired
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" on-primary: "#ffffff" ink: "#000000" ink-soft: "#1a1a1a" body: "#757575" hairline: "#e0e0e0" canvas: "#ffffff" canvas-soft: "#f5f5f5" link: "#057dbc"'
typography: 'display-hero: fontFamily: WiredDisplay, "Times New Roman", Georgia, serif fontSize: 64px fontWeight: 400 lineHeight: 59.52px letterSpacing: -0.5px display-lg: fontFamily: WiredDisplay, "Times New Roman", Georgia, serif fontSize: 48px fontWeight: 400 lineHeight: 50.4px letterSpacing: -0.4px display-md: fontFamily: WiredDisplay, "Times New Roman", Georgia, serif fontSize: 32px fontWeight: 400 lineHeight: 35.2px letterSpacing: -0.3px display-sm: fontFamily: WiredDisplay, "Times New Roman", Georgia, serif fontSize: 26px fontWeight: 400 lineHeight: 28.08px display-xs: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 20px fontWeight: 700 lineHeight: 24px letterSpacing: -0.28px body-serif-lg: fontFamily: BreveText, Georgia, "Times New Roman", serif fontSize: 19px fontWeight: 400 lineHeight: 27.93px letterSpacing: 0.108px body-serif-md: fontFamily: BreveText, Georgia, "Times New Roman", serif fontSize: 16px fontWeight: 400 lineHeight: 24px letterSpacing: 0.09px body-md: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 17px fontWeight: 400 lineHeight: 20px body-md-strong: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 17px fontWeight: 700 lineHeight: 22px letterSpacing: -0.144px body-sm: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 14px fontWeight: 400 lineHeight: 18px letterSpacing: 0.4px body-sm-strong: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 14px fontWeight: 700 lineHeight: 18px letterSpacing: 0.4px byline: fontFamily: BreveText, Georgia, "Times New Roman", serif fontSize: 12.73px fontWeight: 700 lineHeight: 28px letterSpacing: 0.108px caption: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 12px fontWeight: 400 lineHeight: 16px button-md: fontFamily: Apercu, "Helvetica Neue", Helvetica, Arial, sans-serif fontSize: 16px fontWeight: 700 lineHeight: 20px letterSpacing: 0.3px'
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 20px 2xl: 24px 3xl: 32px 4xl: 48px"
---

# Brand Preset: `wired`

Apply the `wired`-inspired visual language to a project.

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
