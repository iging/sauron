---
name: brand-nvidia
description: "| An engineering-grade marketing system organized around two surface modes  -  a deep black canvas for hero and footer chapters and a flat paper-white canvas for body content  -  connected by a single, almost violently saturated NVIDIA Green accent that carries every CTA, every active tab, and the small decorative corner squares that mark out cards. The system is unapologetically angular: 2px radius across every surface, tight bold sans-serif typography in NVIDIA's proprietary EMEA cut, and a hairline gray rule that separates dense multi-column technical content. There is no decorative gradient, no atmospheric mesh, no soft drop shadow  -  just black, white, gray, and green stacked into a structured editorial grid that scales from product cards to massive industry landing pages without bending its rules."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-nvidia
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#76b900" on-primary: "#000000" primary-dark: "#5a8d00" ink: "#000000" canvas: "#ffffff" surface-dark: "#000000" surface-soft: "#f7f7f7" surface-elevated: "#1a1a1a" hairline: "#cccccc" hairline-strong: "#5e5e5e" body: "#1a1a1a" mute: "#757575" stone: "#898989" ash: "#a7a7a7" on-dark: "#ffffff" on-dark-mute: "rgba(255,255,255,0.7)" link-blue: "#0046a4" blue-700: "#0046a4" error: "#e52020" error-deep: "#650b0b" warning: "#df6500" warning-bright: "#ef9100" success-deep: "#3f8500" accent-yellow-pale: "#feeeb2" accent-purple: "#952fc6" accent-purple-deep: "#4d1368" accent-purple-pale: "#f9d4ff" accent-green-pale: "#bff230"'
typography: "display-xl: fontFamily: NVIDIA-EMEA fontSize: 48px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 display-lg: fontFamily: NVIDIA-EMEA fontSize: 36px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 heading-xl: fontFamily: NVIDIA-EMEA fontSize: 24px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 heading-lg: fontFamily: NVIDIA-EMEA fontSize: 22px fontWeight: 400 lineHeight: 1.75 letterSpacing: 0 heading-md: fontFamily: NVIDIA-EMEA fontSize: 20px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 heading-sm: fontFamily: NVIDIA-EMEA fontSize: 18px fontWeight: 700 lineHeight: 1.4 letterSpacing: 0 card-title: fontFamily: NVIDIA-EMEA fontSize: 17px fontWeight: 700 lineHeight: 1.47 letterSpacing: 0 body-md: fontFamily: NVIDIA-EMEA fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-strong: fontFamily: NVIDIA-EMEA fontSize: 16px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: NVIDIA-EMEA fontSize: 15px fontWeight: 400 lineHeight: 1.67 letterSpacing: 0 button-lg: fontFamily: NVIDIA-EMEA fontSize: 18px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 button-md: fontFamily: NVIDIA-EMEA fontSize: 16px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0 button-sm: fontFamily: NVIDIA-EMEA fontSize: 14.4px fontWeight: 700 lineHeight: 1 letterSpacing: 0.144px link-md: fontFamily: NVIDIA-EMEA fontSize: 15px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption-md: fontFamily: NVIDIA-EMEA fontSize: 14px fontWeight: 700 lineHeight: 1.43 letterSpacing: 0 textTransform: uppercase caption-sm: fontFamily: NVIDIA-EMEA fontSize: 12px fontWeight: 400 lineHeight: 1.25 letterSpacing: 0 caption-xs: fontFamily: NVIDIA-EMEA fontSize: 11px fontWeight: 700 lineHeight: 1 letterSpacing: 0 utility-xs: fontFamily: NVIDIA-EMEA fontSize: 10px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0 textTransform: uppercase"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 64px"
---

# Brand Preset: `nvidia`

Apply the `nvidia`-inspired visual language to a project.

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
