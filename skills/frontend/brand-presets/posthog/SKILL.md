---
name: brand-posthog
description: "| A playful developer-tools system rendered on a warm cream canvas with hand-drawn hedgehog mascots dotted across every page like marginalia in a sketchbook. The chrome reads like a friendly engineering blog: olive-gray ink (#4d4f46) for body, deep olive-charcoal (#23251d) for headlines, IBM Plex Sans Variable typography in tight 1.43-line-height paragraphs, and a single saturated yellow-orange CTA pill (#f7a501) carrying every primary action. The system actively rejects the genre's typical somber dark-tech aesthetic in favor of a creamy, textbook-illustration sensibility  -  bordered cards stack on the cream canvas with 46px radii, doc sidebars use rounded outline-icon mini-illustrations, and the home page leans on cartoon characters (hedgehogs in lab coats, hedgehogs at terminals, hedgehogs in lounge chairs) as its signature decoration. Code samples and product analytics charts live inside white-on-cream cards with thin olive borders; the contrast between the playful illustration and the data-dense product imagery is the brand's signature voice."
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-posthog
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#f7a501" primary-pressed: "#dd9001" primary-active: "#b17816" on-primary: "#23251d" ink: "#23251d" body: "#4d4f46" charcoal: "#33342d" mute: "#6c6e63" ash: "#9b9c92" stone: "#b6b7af" hairline: "#bfc1b7" hairline-soft: "#dcdfd2" on-dark: "#ffffff" canvas: "#eeefe9" surface-soft: "#e5e7e0" surface-card: "#ffffff" surface-doc: "#fcfcfa" surface-dark: "#23251d" link-blue: "#1d4ed8" link-teal: "#1078a3" accent-blue: "#2c84e0" accent-blue-soft: "#dceaf6" accent-red: "#cd4239" accent-red-soft: "#f7d6d3" accent-green: "#2c8c66" accent-green-soft: "#d9eddf" accent-purple: "#7c44a6" accent-purple-soft: "#e7d8ee" focus-ring: "rgba(59,130,246,0.5)"'
typography: "display-xl: fontFamily: IBM Plex Sans Variable fontSize: 36px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0 display-lg: fontFamily: IBM Plex Sans Variable fontSize: 24px fontWeight: 800 lineHeight: 1.33 letterSpacing: -0.6px heading-lg: fontFamily: IBM Plex Sans Variable fontSize: 21px fontWeight: 700 lineHeight: 1.4 letterSpacing: -0.5px heading-md: fontFamily: IBM Plex Sans Variable fontSize: 20px fontWeight: 700 lineHeight: 1.4 letterSpacing: 0 heading-sm: fontFamily: IBM Plex Sans Variable fontSize: 18px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0 textTransform: uppercase heading-sm-mixed: fontFamily: IBM Plex Sans Variable fontSize: 18px fontWeight: 600 lineHeight: 1.56 letterSpacing: 0 body-md: fontFamily: IBM Plex Sans Variable fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-strong: fontFamily: IBM Plex Sans Variable fontSize: 16px fontWeight: 600 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: IBM Plex Sans Variable fontSize: 15px fontWeight: 400 lineHeight: 1.71 letterSpacing: 0 body-sm-strong: fontFamily: IBM Plex Sans Variable fontSize: 15px fontWeight: 600 lineHeight: 1.71 letterSpacing: 0 body-xs: fontFamily: IBM Plex Sans Variable fontSize: 14px fontWeight: 500 lineHeight: 1.43 letterSpacing: 0 caption-md: fontFamily: IBM Plex Sans Variable fontSize: 14px fontWeight: 700 lineHeight: 1.71 letterSpacing: 0 caption-sm: fontFamily: IBM Plex Sans Variable fontSize: 13px fontWeight: 500 lineHeight: 1.5 letterSpacing: 0 caption-xs: fontFamily: IBM Plex Sans Variable fontSize: 12px fontWeight: 600 lineHeight: 1.33 letterSpacing: 0 textTransform: uppercase utility-xs: fontFamily: IBM Plex Sans Variable fontSize: 12px fontWeight: 700 lineHeight: 1.33 letterSpacing: 0 textTransform: uppercase link-md: fontFamily: IBM Plex Sans Variable fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button-md: fontFamily: IBM Plex Sans Variable fontSize: 14px fontWeight: 700 lineHeight: 1.5 letterSpacing: 0 button-sm: fontFamily: IBM Plex Sans Variable fontSize: 13px fontWeight: 500 lineHeight: 1 letterSpacing: 0 code-sm: fontFamily: ui-monospace fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 code-xs: fontFamily: Source Code Pro fontSize: 14px fontWeight: 500 lineHeight: 1.43 letterSpacing: 0"
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px lg: 16px xl: 24px xxl: 32px section: 80px"
---

# Brand Preset: `posthog`

Apply the `posthog`-inspired visual language to a project.

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
