---
name: brand-ollama
description: '| An almost defiantly minimal documentation-first system that treats the home page like a Markdown README  -  paper-white canvas, 36px center-aligned heading, a single black pill CTA, an inline terminal install snippet, and a hand-drawn llama mascot as the only ornamental element. No gradient, no hero photography, no marketing pyrotechnics. The chrome is a tiny utility palette of pure black, pure white, and three neutral grays; every interactive element is fully rounded into a pill (`{rounded.full}`); typography is SF Pro Rounded for headings paired with system sans for body and ui-monospace for code. Pricing tiers, FAQs, and "your data stays yours" guarantees all sit on the same flat canvas inside thin-border cards  -  the system is the documentation, and the documentation is the system.'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-ollama
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" on-primary: "#ffffff" ink: "#000000" ink-deep: "#090909" charcoal: "#525252" body: "#737373" mute: "#a3a3a3" canvas: "#ffffff" surface-soft: "#fafafa" surface-card: "#ffffff" hairline: "#e5e5e5" hairline-strong: "#d4d4d4" on-dark: "#ffffff" on-dark-mute: "rgba(255,255,255,0.7)" surface-dark: "#171717" focus-ring: "rgba(59,130,246,0.5)" link: "#000000" link-mute: "#737373" terminal-red: "#ff5f56" terminal-yellow: "#ffbd2e" terminal-green: "#27c93f"'
typography: "display-xl: fontFamily: SF Pro Rounded fontSize: 36px fontWeight: 500 lineHeight: 1.11 letterSpacing: 0 display-lg: fontFamily: SF Pro Rounded fontSize: 30px fontWeight: 500 lineHeight: 1.2 letterSpacing: 0 heading-lg: fontFamily: SF Pro Rounded fontSize: 24px fontWeight: 600 lineHeight: 1.33 letterSpacing: 0 heading-md: fontFamily: ui-sans-serif fontSize: 20px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 heading-sm: fontFamily: ui-sans-serif fontSize: 18px fontWeight: 500 lineHeight: 1.56 letterSpacing: 0 body-md: fontFamily: ui-sans-serif fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-strong: fontFamily: ui-sans-serif fontSize: 16px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: ui-sans-serif fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 body-sm-strong: fontFamily: ui-sans-serif fontSize: 14px fontWeight: 500 lineHeight: 1.43 letterSpacing: 0 caption-sm: fontFamily: ui-sans-serif fontSize: 12px fontWeight: 400 lineHeight: 1.33 letterSpacing: 0 code-md: fontFamily: ui-monospace fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 code-sm: fontFamily: ui-monospace fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 button-md: fontFamily: ui-sans-serif fontSize: 14px fontWeight: 500 lineHeight: 1 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 88px"
---

# Brand Preset: `ollama`

Apply the `ollama`-inspired visual language to a project.

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
