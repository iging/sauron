# A11Y-I18N — Accessibility & Internationalization

> **Purpose:** Canonical standards for WCAG 2.2 AA accessibility compliance, screen reader behavior, keyboard navigation contracts, locale handling, and dynamic translation workflows. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Accessibility Standards (WCAG 2.2 Level AA)

1. **Color Contrast:** Minimum `4.5:1` contrast ratio for body text against backgrounds; minimum `3.0:1` for large text (>= 18pt or 14pt bold) and active UI component borders.
2. **Keyboard Focus:** Every interactive control must be reachable via `Tab` navigation and render an unambiguous focus ring (`outline: 2px solid var(--color-primary)`).
3. **Form Accessibility:** Every form input must be linked to a `<label>` element using matching `id`/`htmlFor` attributes. Error messages must associate to inputs via `aria-describedby`.
4. **Accessible Icons & Modals:** Icon buttons must provide `aria-label` text. Modals must trap keyboard focus within the dialog container and close on `Escape`.

---

## 2. Internationalization & Locale Management

- **Default Locale:** `en-US` (ISO 639-1 language code + ISO 3166-1 alpha-2 country code).
- **Externalized Copy:** Hardcoded user-facing strings in UI component templates are strictly banned. All text must resolve via translation keys (e.g. `t('auth.login_title')`).
- **Formatting Standards:**
  - Dates and times must format using native `Intl.DateTimeFormat`.
  - Currency amounts must format using `Intl.NumberFormat` with explicit currency ISO codes (`USD`, `EUR`, `PHP`).
- **Right-to-Left (RTL) Support:** Layout primitives must utilize logical CSS properties (`padding-inline-start`, `margin-inline-end`) rather than physical left/right rules to support RTL languages cleanly.
