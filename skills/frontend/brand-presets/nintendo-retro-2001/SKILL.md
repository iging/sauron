---
name: brand-nintendo-retro-2001
description: An analysis of Nintendo.com's 2001 design language  -  a brushed-periwinkle "console chrome" interface where every panel is a beveled metal plate, navigation glows amber over a halftone-dotted carbon bar, and bold outlined display type sits on circuit-board hero fields. A Y2K hardware aesthetic that treats the web page like the faceplate of a game system.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-nintendo-retro-2001
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#e60012" # Nintendo Red — racetrack logo, alert signal: "#f68d1f" # Signal Orange — forward cues, submit, "Play It On" amber: "#ecab37" # Amber — utility buttons, info-box tabs, badges nav-gold: "#e48600" # Nav Gold — top-nav menu links canvas: "#7a8aba" # Periwinkle metallic — primary interface body canvas-soft: "#9fbee7" # Pale Sky — secondary-nav strip, light inset panels sky: "#9fbee7" # Pale Sky alias lavender: "#acace7" # Pale Lavender — home hero field ice: "#c0d5e6" # Pale Ice — news hero field periwinkle: "#8ba1d4" # Light Periwinkle — raised mid panels chrome-indigo: "#3d4f97" # Chrome Indigo — beveled borders, tab edges muted-indigo: "#60619c" # Muted Indigo — inactive tabs, secondary chrome platinum: "#dedede" # Platinum Gray — list-row / inset content surface surface: "#ffffff" # White — content cards, list-row highlight carbon: "#21242e" # Carbon Navy — nav bar, dark buttons, footer, ink hairline: "#5a5f8c" # blended bevel divider ink: "#21242e" # primary text on light ink-soft: "#3d4f97" # secondary text / chrome labels on-primary: "#ffffff" # text on dark/red/orange chrome systems-teal: "#206479" # Systems hero circuit-board cyan games-red: "#a7282b" # Games F-1 racing hero error: "#e60012" # validation / destructive (shares brand red)'
typography: "nav-link: fontFamily: Arial fontSize: 13px fontWeight: 700 lineHeight: 1 letterSpacing: 0.5px ui-label: fontFamily: Arial fontSize: 11px fontWeight: 700 lineHeight: 1.1 letterSpacing: 0.5px display: fontFamily: Arial Black fontSize: 44px fontWeight: 900 lineHeight: 1 letterSpacing: 0 hero-tagline: fontFamily: Arial fontSize: 15px fontWeight: 700 lineHeight: 1.3 letterSpacing: 0 body: fontFamily: Arial fontSize: 12px fontWeight: 400 lineHeight: 1.4 letterSpacing: 0 link: fontFamily: Arial fontSize: 12px fontWeight: 700 lineHeight: 1.4 letterSpacing: 0 micro: fontFamily: Arial fontSize: 10px fontWeight: 400 lineHeight: 1.3 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 48px"
---

# Brand Preset: `nintendo-retro-2001`

Apply the `nintendo-retro-2001`-inspired visual language to a project.

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
