---
name: brand-hashicorp
description: '"An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors  -  Terraform purple, Vault yellow, Consul pink, Waypoint cyan, Vagrant blue  -  that act as identity tokens rather than decorative palette. Display type is hashicorpSans set in 600/700 with tight 1.171.21 line-heights; body type runs the same family at 500 weight with relaxed 1.501.71 line-heights. Cards live as charcoal surfaces with 1px translucent gray borders; product showcase cards lift into per-product chromatic gradients. The system reads as confident, technical, and intentionally multi-product  -  every section quietly signals which HashiCorp tool it represents."'
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-hashicorp
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#000000" on-primary: "#ffffff" accent-blue: "#2b89ff" ink: "#ffffff" ink-muted: "#b2b6bd" ink-subtle: "#656a76" canvas: "#000000" surface-1: "#15181e" surface-2: "#1f232b" surface-3: "#3b3d45" hairline: "#3b3d45" hairline-soft: "#252830" inverse-canvas: "#ffffff" inverse-ink: "#000000" product-terraform: "#7b42bc" product-terraform-bright: "#911ced" product-vault: "#ffcf25" product-consul: "#e62b1e" product-waypoint: "#14c6cb" product-waypoint-deep: "#12b6bb" product-vagrant: "#1868f2" product-nomad: "#00ca8e" product-boundary: "#f24c53" amber-100: "#fbeabf" amber-200: "#bb5a00" blue-7: "#101a59" semantic-success: "#00ca8e" semantic-warning: "#ffcf25" semantic-error: "#e62b1e" semantic-visited: "#a737ff"'
typography: "display-xl: fontFamily: hashicorpSans fontSize: 80px fontWeight: 700 lineHeight: 1.17 letterSpacing: -2.5px display-lg: fontFamily: hashicorpSans fontSize: 56px fontWeight: 700 lineHeight: 1.18 letterSpacing: -1.6px display-md: fontFamily: hashicorpSans fontSize: 40px fontWeight: 600 lineHeight: 1.19 letterSpacing: -1.0px headline: fontFamily: hashicorpSans fontSize: 28px fontWeight: 600 lineHeight: 1.21 letterSpacing: -0.6px card-title: fontFamily: hashicorpSans fontSize: 22px fontWeight: 600 lineHeight: 1.18 letterSpacing: -0.4px subhead: fontFamily: hashicorpSans fontSize: 20px fontWeight: 600 lineHeight: 1.35 letterSpacing: -0.2px body-lg: fontFamily: hashicorpSans fontSize: 18px fontWeight: 500 lineHeight: 1.69 letterSpacing: 0 body: fontFamily: hashicorpSans fontSize: 16px fontWeight: 500 lineHeight: 1.50 letterSpacing: 0 body-sm: fontFamily: hashicorpSans fontSize: 14px fontWeight: 500 lineHeight: 1.71 letterSpacing: 0 caption: fontFamily: hashicorpSans fontSize: 13px fontWeight: 500 lineHeight: 1.38 letterSpacing: 0.2px button: fontFamily: hashicorpSans fontSize: 14px fontWeight: 600 lineHeight: 1.29 letterSpacing: 0 eyebrow: fontFamily: hashicorpSans fontSize: 12px fontWeight: 600 lineHeight: 1.23 letterSpacing: 0.6px"
spacing: "hair: 1px xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `hashicorp`

Apply the `hashicorp`-inspired visual language to a project.

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
