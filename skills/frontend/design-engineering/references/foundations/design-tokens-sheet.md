# Design Tokens Sheet

Every default token from the foundation files, in one place. Copy this block to start a project, then change values to fit the brand. The rules behind each group stay in the file named beside it.

> **Platforms.** This sheet is the web expression. To write the same tokens in SwiftUI, Compose, Flutter, or XAML, follow `platform-code-examples.md`.

## 1. Where Each Group Comes From

| Group                  | Defined in                     | Change it when                                  |
| ---------------------- | ------------------------------ | ----------------------------------------------- |
| Colour                 | `colour-system.md`             | Always: every brand has its own ramp            |
| Type                   | `type-system.md`               | The display face or density changes             |
| Space, layout          | `layout-and-spacing-system.md` | Rarely: the scale is meant to stay              |
| Radius, border, shadow | `surface-and-depth-system.md`  | The shape personality or depth language changes |
| Icons                  | `icon-and-image-system.md`     | Rarely                                          |
| Motion                 | `motion-basics.md`             | The motion dial is very low or very high        |

Token tier rules (primitive, semantic, component) are in `skills/quality/design-tokens/SKILL.md`. Components read semantic and component tokens only.

## 2. The Sheet

```css
:root {
  color-scheme: light;

  /* ---- Colour: primitives (replace with the brand ramp) ---- */
  --neutral-50: oklch(0.98 0.008 85);
  --neutral-100: oklch(0.955 0.014 82);
  --neutral-200: oklch(0.9 0.02 80);
  --neutral-500: oklch(0.6 0.012 60);
  --neutral-600: oklch(0.5 0.012 60);
  --neutral-800: oklch(0.34 0.012 60);
  --neutral-950: oklch(0.18 0.008 60);
  --accent-600: oklch(0.52 0.13 37);
  --accent-700: oklch(0.43 0.12 37);
  --accent-800: oklch(0.34 0.1 37);

  /* ---- Colour: semantic roles ---- */
  --color-canvas: var(--neutral-50);
  --color-surface: var(--neutral-100);
  --color-surface-raised: #ffffff;
  --color-hairline: var(--neutral-200);
  --color-border-control: var(--neutral-500);
  --color-text-strong: var(--neutral-950);
  --color-text: var(--neutral-800);
  --color-text-muted: var(--neutral-600);
  --color-action: var(--accent-600);
  --color-action-hover: var(--accent-700);
  --color-action-pressed: var(--accent-800);
  --color-on-action: var(--neutral-50);
  --color-focus: var(--accent-700);
  --color-success: oklch(0.45 0.11 150);
  --color-warning: oklch(0.5 0.12 75);
  --color-danger: oklch(0.5 0.17 27);

  /* ---- Type ---- */
  --font-display: "Display Face", Georgia, serif;
  --font-body: "Body Face", system-ui, sans-serif;
  --font-mono: ui-monospace, "Cascadia Code", Menlo, monospace;

  --text-display: clamp(2.75rem, 1.8214rem + 4.6429vw, 6rem);
  --text-h1: clamp(2.25rem, 1.6071rem + 3.2143vw, 4.5rem);
  --text-h2: clamp(1.875rem, 1.5536rem + 1.6071vw, 3rem);
  --text-h3: clamp(1.5rem, 1.3571rem + 0.7143vw, 2rem);
  --text-h4: clamp(1.25rem, 1.1786rem + 0.3571vw, 1.5rem);
  --text-lead: clamp(1.125rem, 1.0893rem + 0.1786vw, 1.25rem);
  --text-body: clamp(1rem, 0.9643rem + 0.1786vw, 1.125rem);
  --text-small: 0.875rem;
  --text-caption: 0.8125rem;

  --weight-body: 400;
  --weight-emphasis: 500;
  --weight-strong: 600;
  --weight-heading: 700;

  --leading-display: 1.05;
  --leading-heading: 1.15;
  --leading-title: 1.3;
  --leading-body: 1.6;

  --tracking-display: -0.025em;
  --tracking-heading: -0.015em;
  --tracking-label: 0.1em;

  --measure-body: 65ch;
  --measure-lead: 55ch;

  /* ---- Space ---- */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --space-gutter: clamp(1rem, 4vw, 2rem);
  --space-section: clamp(3.5rem, 2rem + 6vw, 6rem);

  /* ---- Layout ---- */
  --container: 75rem;
  --container-wide: 90rem;
  --container-text: 65ch;
  --size-header: 4rem;
  --size-touch: 3rem;
  --size-control-dense: 2.5rem;

  --z-base: 0;
  --z-sticky: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;

  /* ---- Radius ---- */
  --radius-tag: 0.25rem;
  --radius-control: 0.5rem;
  --radius-card: 0.75rem;
  --radius-container: 1rem;
  --radius-pill: 999px;

  /* ---- Border ---- */
  --border-hairline: 1px solid var(--color-hairline);
  --border-control: 1.5px solid var(--color-border-control);
  --border-strong: 2px solid var(--color-text-strong);

  /* ---- Shadow ---- */
  --shadow-color: 30 20% 12%;
  --shadow-1:
    0 1px 2px hsl(var(--shadow-color) / 0.06),
    0 1px 1px hsl(var(--shadow-color) / 0.04);
  --shadow-2:
    0 2px 4px hsl(var(--shadow-color) / 0.06),
    0 4px 8px hsl(var(--shadow-color) / 0.06);
  --shadow-3:
    0 4px 8px hsl(var(--shadow-color) / 0.06),
    0 12px 24px hsl(var(--shadow-color) / 0.1);
  --shadow-4:
    0 8px 16px hsl(var(--shadow-color) / 0.08),
    0 24px 48px hsl(var(--shadow-color) / 0.14);
  --scrim: hsl(var(--shadow-color) / 0.5);

  /* ---- Icons ---- */
  --icon-sm: 1rem;
  --icon-md: 1.25rem;
  --icon-lg: 1.5rem;
  --icon-xl: 2rem;

  /* ---- Motion ---- */
  --dur-instant: 100ms;
  --dur-fast: 150ms;
  --dur-base: 240ms;
  --dur-slow: 400ms;
  --dur-signature: 600ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

The colour primitives above are a warm placeholder ramp. Replace them using the recipe in `colour-system.md`, then re-check contrast; do not assume the semantic pairs still pass after a hue or lightness change.

## 3. Breakpoints

Custom properties cannot be used inside media query conditions, so breakpoints are a fixed convention, not tokens.

| Name | Min width    |
| ---- | ------------ |
| `sm` | 40rem (640)  |
| `md` | 48rem (768)  |
| `lg` | 64rem (1024) |
| `xl` | 80rem (1280) |

Check widths: 320, 375, 425, 768, 1024, 1440.

## 4. Rules for Using the Sheet

1. A value that is not on the sheet is added to the sheet first, then used. No one-off values in components.
2. Change a semantic token, not the components that read it.
3. A dark theme overrides the semantic colour roles and the shadow approach only. Everything else stays.
4. Record every change from these defaults in the project `DESIGN.md`, with the reason.
