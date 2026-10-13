---
name: brand-dell-retro-1996
description: An interpretation of Dell.com's 1996 design language  -  a catalog-era enterprise web design built around a literal black page frame, vivid flat color-block "ribbon cards" tinted in sage, salmon, periwinkle, sky, peach and lime, chunky Helvetica-Black display titles, Times Roman body copy, and an entire visual vocabulary of pre-Photoshop hand-cut GIF stickers (NEW! bursts, award seals, beveled product photos).
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-dell-retro-1996
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#e91d2a" on-primary: "#ffffff" canvas: "#ffffff" surface: "#ffffff" ink: "#000000" frame-ink: "#000000" yellow-sticker: "#fcc20f" purple-stripe: "#6a26a4" link: "#0000ee"  # Ribbon-card tint family (one per product line) tint-olive: "#8e8a25" tint-sage: "#b3bd95" tint-salmon: "#d77a7a" tint-peach: "#e6915d" tint-lime: "#c0d4a7" tint-sky: "#9ab6c8" tint-steel: "#a5b8c0" tint-periwinkle: "#8c9ae0"'
typography: "display: fontFamily: Arial Black fontSize: 36px fontWeight: 900 lineHeight: 1.0 letterSpacing: 0 heading-1: fontFamily: Arial Black fontSize: 24px fontWeight: 900 lineHeight: 1.05 letterSpacing: 0 heading-2: fontFamily: Helvetica fontSize: 16px fontWeight: 700 lineHeight: 1.2 letterSpacing: 0 heading-3: fontFamily: Helvetica fontSize: 14px fontWeight: 700 lineHeight: 1.2 letterSpacing: 0 body: fontFamily: Times New Roman fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 body-sm: fontFamily: Times New Roman fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 caption: fontFamily: Times New Roman fontSize: 11px fontWeight: 400 lineHeight: 1.35 letterSpacing: 0 button: fontFamily: Helvetica fontSize: 12px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0 link: fontFamily: Times New Roman fontSize: 14px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 ui-label: fontFamily: Helvetica fontSize: 12px fontWeight: 700 lineHeight: 1.0 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px s: 6px sm: 8px m: 10px md: 12px lg: 16px xl: 20px xxl: 24px section-sm: 32px section: 40px section-lg: 48px"
---

# Brand Preset: `dell-retro-1996`

Apply the `dell-retro-1996`-inspired visual language to a project.

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
