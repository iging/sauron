---
name: brand-airbnb
description: A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries every primary CTA, search-button orb, and rating dot. Type runs Airbnb Cereal VF at modest weights  -  display sits at 2228px in weight 500/600 rather than the heavy 700+ that fintech and enterprise systems use; the brand trusts photography and generous whitespace over typographic muscle. Three product entries (Homes, Experiences, Services) sit in the top nav with hand-illustrated 32-icon glyphs and "NEW" badges, signaling a marketplace expansion rather than a feature dump. Pill-shaped search bars (`{rounded.full}`), softly rounded property cards (`{rounded.lg}` ~14px), and 32px button radii read as friendly and human  -  there is no hard corner anywhere except the body grid.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-airbnb
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#ff385c" primary-active: "#e00b41" primary-disabled: "#ffd1da" primary-error-text: "#c13515" primary-error-text-hover: "#b32505" luxe: "#460479" plus: "#92174d" ink: "#222222" body: "#3f3f3f" muted: "#6a6a6a" muted-soft: "#929292" hairline: "#dddddd" hairline-soft: "#ebebeb" border-strong: "#c1c1c1" canvas: "#ffffff" surface-soft: "#f7f7f7" surface-card: "#ffffff" surface-strong: "#f2f2f2" on-primary: "#ffffff" on-dark: "#ffffff" legal-link: "#428bff" star-rating: "#222222" scrim: "#000000"'
typography: 'display-xl: fontFamily: "''Airbnb Cereal VF'', Circular, -apple-system, system-ui, Roboto, ''Helvetica Neue'', sans-serif" fontSize: 28px fontWeight: 700 lineHeight: 1.43 letterSpacing: 0 display-lg: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 22px fontWeight: 500 lineHeight: 1.18 letterSpacing: -0.44px display-md: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 21px fontWeight: 700 lineHeight: 1.43 letterSpacing: 0 display-sm: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 20px fontWeight: 600 lineHeight: 1.20 letterSpacing: -0.18px title-md: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.25 letterSpacing: 0 title-sm: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 16px fontWeight: 500 lineHeight: 1.25 letterSpacing: 0 rating-display: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 64px fontWeight: 700 lineHeight: 1.1 letterSpacing: -1px body-md: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 caption: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.29 letterSpacing: 0 caption-sm: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 13px fontWeight: 400 lineHeight: 1.23 letterSpacing: 0 badge: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 11px fontWeight: 600 lineHeight: 1.18 letterSpacing: 0 micro-label: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 12px fontWeight: 700 lineHeight: 1.33 letterSpacing: 0 uppercase-tag: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 8px fontWeight: 700 lineHeight: 1.25 letterSpacing: 0.32px textTransform: uppercase button-md: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 16px fontWeight: 500 lineHeight: 1.25 letterSpacing: 0 button-sm: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.29 letterSpacing: 0 link: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.43 letterSpacing: 0 nav-link: fontFamily: "''Airbnb Cereal VF'', Circular, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.25 letterSpacing: 0'
spacing: "xxs: 2px xs: 4px sm: 8px md: 12px base: 16px lg: 24px xl: 32px xxl: 48px section: 64px"
---

# Brand Preset: `airbnb`

Apply the `airbnb`-inspired visual language to a project.

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
