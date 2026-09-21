# DESIGN — Design System & UI/UX Standards

> **Purpose:** Define visual identity, semantic design tokens, component styling primitives, responsive layout boundaries, and accessibility standards so user interface implementation is consistent, performant, and compliant with WCAG 2.2 AA. Tier-3 template — fill it in for your project.

_Last updated: [DATE]_

---

## 1. Visual Identity & Art Direction

[PLACEHOLDER: Document product visual tone, design philosophy, aesthetic principles, and emotional resonance.]

- **Visual Tone:** Professional, restrained, modern, data-dense, and highly readable.
- **Design Philosophy:** Content-first clarity, crisp typographic hierarchy, micro-interactions with immediate feedback, zero gratuitous decorative elements.
- **Theme Support:** Native first-class Light Mode and Dark Mode support with automatic system preference detection (`prefers-color-scheme`).

---

## 2. Design Tokens & CSS Variables

All UI styling must strictly consume design tokens. Hardcoded hex colors, arbitrary pixel paddings, or magic numbers are strictly banned in component styles.

### 2.1 Color Palette & Semantic Tokens

```css
:root {
  /* Base Neutral Scales */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;
  --color-neutral-950: #020617;

  /* Brand Accents */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;

  /* Semantic Feedback States */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #0284c7;

  /* Light Theme Surface Mappings */
  --bg-canvas: var(--color-neutral-0);
  --bg-surface: var(--color-neutral-50);
  --bg-overlay: var(--color-neutral-100);
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-700);
  --border-subtle: var(--color-neutral-200);
}

[data-theme="dark"] {
  /* Dark Theme Surface Mappings */
  --bg-canvas: var(--color-neutral-950);
  --bg-surface: var(--color-neutral-900);
  --bg-overlay: var(--color-neutral-800);
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-200);
  --border-subtle: var(--color-neutral-800);
}
```

---

## 3. Typography Scale & Font Hierarchy

- **Primary UI Font Stack:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace Code Font Stack:** `JetBrains Mono, "Fira Code", ui-monospace, monospace`

| Token          | Size              | Line Height | Weight           | Typical Usage                                         |
| :------------- | :---------------- | :---------- | :--------------- | :---------------------------------------------------- |
| `text-display` | `32px / 2.0rem`   | `1.2`       | `700 (Bold)`     | Primary landing headings and empty state hero titles. |
| `text-h1`      | `24px / 1.5rem`   | `1.3`       | `600 (SemiBold)` | Page titles and primary screen headings.              |
| `text-h2`      | `20px / 1.25rem`  | `1.35`      | `600 (SemiBold)` | Card headers, modal titles, and section dividers.     |
| `text-body`    | `14px / 0.875rem` | `1.5`       | `400 (Regular)`  | Standard copy, table records, and form input values.  |
| `text-caption` | `12px / 0.75rem`  | `1.4`       | `500 (Medium)`   | Timestamps, metadata badges, and form helper text.    |

---

## 4. Spacing, Elevation & Layout Primitives

Deterministic 4px grid system.

- **Spacing Scale:**
  - `space-1`: `4px` (Tight padding between icons and text)
  - `space-2`: `8px` (Button internal padding, chip spacing)
  - `space-4`: `16px` (Default container padding, grid gaps)
  - `space-6`: `24px` (Card internal padding, section margins)
  - `space-8`: `32px` (Major layout gaps)
- **Border Radii:**
  - `radius-sm`: `4px` (Badges, tags, tooltips)
  - `radius-md`: `8px` (Buttons, form inputs, dropdowns)
  - `radius-lg`: `12px` (Modals, cards, floating panels)

---

## 5. Accessibility & Interaction Contracts (WCAG 2.2 AA)

1. **Color Contrast:** Normal text must achieve a minimum contrast ratio of `4.5:1` against its background surface. Large text (>= 18pt or 14pt bold) must achieve at least `3:1`.
2. **Keyboard Focus Rings:** Every interactive element (`<button>`, `<a>`, `<input>`, `<select>`) must display a visible, high-contrast focus indicator (`outline: 2px solid var(--color-primary); outline-offset: 2px`). Never suppress `:focus` or `outline` without an accessible alternative.
3. **Screen Reader Semantics:** Every icon button lacking visible text must provide an explicit `aria-label`. Form inputs must be programmatically associated with `<label>` elements via `htmlFor`/`id`.
4. **Motion Safety:** All animations and transitions must honor the user's motion preference via `@media (prefers-reduced-motion: reduce)`. When reduced motion is requested, animation durations must collapse to `0ms`.
