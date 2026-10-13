---
name: brand-cal
description: A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The system reads as friendly modern SaaS  -  generous whitespace, soft-rounded cards (~12px), product UI fragments shown directly inside cards, and a dark navy footer that visually closes long-scroll pages. Brand voltage comes from the Cal Sans display headline (a custom geometric face) and from product UI artifacts shown in-card rather than from accent colors.
department: frontend
ownerAgent: aragorn
triggerCommand: /brand-cal
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
colors: 'primary: "#111111" primary-active: "#242424" primary-disabled: "#e5e7eb" ink: "#111111" body: "#374151" muted: "#6b7280" muted-soft: "#898989" hairline: "#e5e7eb" hairline-soft: "#f3f4f6" canvas: "#ffffff" surface-soft: "#f8f9fa" surface-card: "#f5f5f5" surface-strong: "#e5e7eb" surface-dark: "#101010" surface-dark-elevated: "#1a1a1a" on-primary: "#ffffff" on-dark: "#ffffff" on-dark-soft: "#a1a1aa" brand-accent: "#3b82f6" success: "#10b981" warning: "#f59e0b" error: "#ef4444" badge-orange: "#fb923c" badge-pink: "#ec4899" badge-violet: "#8b5cf6" badge-emerald: "#34d399"'
typography: 'display-xl: fontFamily: "Cal Sans, Inter, sans-serif" fontSize: 64px fontWeight: 600 lineHeight: 1.05 letterSpacing: -2px display-lg: fontFamily: "Cal Sans, Inter, sans-serif" fontSize: 48px fontWeight: 600 lineHeight: 1.1 letterSpacing: -1.5px display-md: fontFamily: "Cal Sans, Inter, sans-serif" fontSize: 36px fontWeight: 600 lineHeight: 1.15 letterSpacing: -1px display-sm: fontFamily: "Cal Sans, Inter, sans-serif" fontSize: 28px fontWeight: 600 lineHeight: 1.2 letterSpacing: -0.5px title-lg: fontFamily: "Inter, sans-serif" fontSize: 22px fontWeight: 600 lineHeight: 1.3 letterSpacing: -0.3px title-md: fontFamily: "Inter, sans-serif" fontSize: 18px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 title-sm: fontFamily: "Inter, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1.4 letterSpacing: 0 body-md: fontFamily: "Inter, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 body-sm: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 caption: fontFamily: "Inter, sans-serif" fontSize: 13px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0 code: fontFamily: "JetBrains Mono, ui-monospace, monospace" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0 button: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 600 lineHeight: 1 letterSpacing: 0 nav-link: fontFamily: "Inter, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0'
spacing: "xxs: 4px xs: 8px sm: 12px md: 16px lg: 24px xl: 32px xxl: 48px section: 96px"
---

# Brand Preset: `cal`

Apply the `cal`-inspired visual language to a project.

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
