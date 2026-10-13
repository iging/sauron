# Interface Compliance Rules

Rule catalogue for `06-audit/ui-code-linter`. Each rule is a check that can be confirmed by reading source code, with no browser, no device, and no design judgment. Sections 1 to 11 are written for web code; Section 12 covers native and desktop toolkits.

This file avoids restating guidance that already lives elsewhere in the suite. A rule marked **Ref** is defined in an existing reference and only indexed here. A rule marked **Own** is defined in this file because no other reference covers it.

## Severity

| Level   | Meaning                                                                  | Merge policy            |
| ------- | ------------------------------------------------------------------------ | ----------------------- |
| Blocker | Locks a user out, loses their data, or breaks the page for a whole group | Fix before merge        |
| Major   | Works, but degrades a core task or fails WCAG 2.2 AA                     | Fix in the same release |
| Minor   | Polish gap a careful reviewer would notice                               | Batch into cleanup      |

## How to cite an existing rule

`UXG-n` means row `n` of `../ui-design/core/ux-guidelines.md`. `ANIM` means `../motion/animation-standards.md`. `CRAFT` means `../motion/high-craft-principles.md`. `EVAL` means `../design-practice/evaluation.md`. Load the cited file only when a finding needs the full rationale.

## 1. Semantics and Names

| ID     | Check                                                                                                  | Severity | Source         |
| ------ | ------------------------------------------------------------------------------------------------------ | -------- | -------------- |
| SEM-01 | A click handler sits on a `div` or `span` instead of a `button` or anchor                              | Blocker  | UXG-42         |
| SEM-02 | Navigation is done by a script handler with no anchor, so new-tab and middle-click fail                | Major    | Own            |
| SEM-03 | An icon-only control has no accessible name                                                            | Blocker  | UXG-40         |
| SEM-04 | A form control has no associated label                                                                 | Blocker  | UXG-43         |
| SEM-05 | A content image has no `alt`, or a decorative one lacks `alt=""`                                       | Major    | UXG-38         |
| SEM-06 | A decorative icon is exposed to assistive tech (no `aria-hidden="true"`)                               | Minor    | Own            |
| SEM-07 | Heading levels skip, or the page has no skip link to main content                                      | Major    | UXG-39, UXG-45 |
| SEM-08 | Status that changes after load (toast, validation, result count) is not in a live region               | Major    | UXG-44         |
| SEM-09 | ARIA role recreates something a native element already provides                                        | Minor    | EVAL           |
| SEM-10 | An in-page anchor target can land under a sticky header (no scroll margin or scroll padding)           | Minor    | Own            |
| SEM-11 | Audio or video that carries meaning has no captions, transcript, or text description                   | Major    | Own            |
| SEM-12 | Custom media controls cannot be operated by keyboard, or decorative media is exposed to assistive tech | Major    | Own            |

**SEM-02 detail.** Search for router pushes or `location` assignments inside click handlers on non-anchor elements. A real anchor keeps the browser's own link behaviours: open in new tab, copy address, status bar preview.

**SEM-10 detail.** Pass when the scroll container sets `scroll-padding-block-start`, or when targets set `scroll-margin-block-start`, to at least the sticky header height.

## 2. Focus and Keyboard

| ID     | Check                                                                                      | Severity | Source |
| ------ | ------------------------------------------------------------------------------------------ | -------- | ------ |
| FOC-01 | An outline is removed with no visible replacement                                          | Blocker  | UXG-28 |
| FOC-02 | Focus styling uses `:focus` where `:focus-visible` is meant, so rings flash on mouse click | Minor    | Own    |
| FOC-03 | A compound control (search field with button, segmented input) shows no group focus        | Minor    | Own    |
| FOC-04 | A sticky or fixed layer can cover the element that holds focus                             | Major    | Own    |
| FOC-05 | A custom interactive element has pointer handlers but no keyboard path                     | Blocker  | UXG-41 |
| FOC-06 | `autofocus` is used on mobile, or on more than one field, or without a stated reason       | Minor    | Own    |

**FOC-03 detail.** The wrapper should respond to `:focus-within` so the whole control reads as focused, not only the inner input.

**FOC-04 detail.** WCAG 2.2 "Focus Not Obscured". Pass when the scroll container reserves space for fixed layers (scroll padding), or when overlays are dismissed before focus moves beneath them.

## 3. Forms

| ID     | Check                                                                                       | Severity | Source         |
| ------ | ------------------------------------------------------------------------------------------- | -------- | -------------- |
| FRM-01 | A field lacks a meaningful `name` or a correct `autocomplete` token                         | Major    | UXG-58         |
| FRM-02 | Input `type` or `inputmode` does not match the data (email, tel, url, numeric)              | Major    | UXG-57, UXG-63 |
| FRM-03 | Paste is blocked on any field                                                               | Blocker  | Own            |
| FRM-04 | Spellcheck is left on for emails, codes, usernames, or other identifiers                    | Minor    | Own            |
| FRM-05 | A checkbox or radio and its label are separate hit targets with a dead gap between them     | Minor    | Own            |
| FRM-06 | The submit control is disabled before the request starts, or shows no in-flight state       | Major    | UXG-32, UXG-61 |
| FRM-07 | Errors are grouped away from their fields, or submit does not move focus to the first error | Major    | UXG-55         |
| FRM-08 | A placeholder stands in for the label, or gives no example of the expected format           | Major    | UXG-54         |
| FRM-09 | A long form can be abandoned with unsaved input and no warning                              | Major    | Own            |
| FRM-10 | A non-credential field triggers the password manager because `autocomplete` is unset        | Minor    | Own            |

**FRM-03 detail.** Flag any paste listener that cancels the event. Blocking paste breaks password managers and one-time-code autofill, and gives no security benefit.

**FRM-06 detail.** Keeping submit enabled until the request begins lets validation run on click and report what is wrong. A button that is disabled from the start gives the user nothing to act on.

**FRM-09 detail.** Pass when a dirty-state flag drives a `beforeunload` listener or a router leave guard, and the listener is removed once the form is saved.

## 4. Motion

| ID     | Check                                                                                       | Severity | Source |
| ------ | ------------------------------------------------------------------------------------------- | -------- | ------ |
| MOT-01 | Motion has no `prefers-reduced-motion` branch                                               | Major    | UXG-9  |
| MOT-02 | A layout property (width, height, top, left, margin) is animated                            | Major    | UXG-13 |
| MOT-03 | `transition: all` or a utility equivalent is used                                           | Minor    | ANIM   |
| MOT-04 | A scaling or rotating element relies on the default `transform-origin` where it reads wrong | Minor    | ANIM   |
| MOT-05 | An SVG part is transformed directly instead of through a group with a box-relative origin   | Minor    | Own    |
| MOT-06 | An animation ignores input until it completes                                               | Major    | CRAFT  |
| MOT-07 | Motion that starts by itself and runs longer than 5 seconds has no pause, stop, or hide     | Major    | Own    |
| MOT-08 | A looping decorative animation keeps running under reduced motion                           | Major    | UXG-12 |

**MOT-05 detail.** SVG children resolve `transform-origin` against the SVG viewport by default. Wrap the part in a `g`, then set `transform-box: fill-box` and `transform-origin: center` on that group.

**MOT-07 detail.** WCAG 2.2 "Pause, Stop, Hide". Applies to carousels, tickers, background video, and animated illustrations that sit beside other content.

## 5. Text and Copy

| ID     | Check                                                                         | Severity | Source |
| ------ | ----------------------------------------------------------------------------- | -------- | ------ |
| TXT-01 | Three periods are typed where the single ellipsis character belongs           | Minor    | Own    |
| TXT-02 | Straight quotes appear in user-facing prose                                   | Minor    | Own    |
| TXT-03 | A value and its unit, a shortcut, or a brand name can break across two lines  | Minor    | Own    |
| TXT-04 | A column of figures that users compare is not set in tabular numerals         | Minor    | CRAFT  |
| TXT-05 | Headings are left with default wrapping and can strand a single word          | Minor    | CRAFT  |
| TXT-06 | A text container has no plan for long content (wrap, clamp, or truncate)      | Major    | UXG-84 |
| TXT-07 | A flex or grid child holding text cannot shrink, so truncation never triggers | Major    | Own    |
| TXT-08 | An in-progress label does not signal that work is continuing                  | Minor    | Own    |
| TXT-09 | A button label names no outcome ("Continue", "Submit", "OK")                  | Minor    | Own    |
| TXT-10 | An error message states the problem and gives no next step                    | Major    | UXG-80 |
| TXT-11 | Heading and button capitalisation is inconsistent across the product          | Minor    | Own    |
| TXT-12 | Instructions are written in passive voice or first person                     | Minor    | Own    |

**TXT-03 detail.** Join with a non-breaking space: `10&nbsp;MB`, `Ctrl&nbsp;K`, a two-word product name.

**TXT-07 detail.** Flex and grid items default to a minimum size equal to their content. Set `min-inline-size: 0` (or the utility equivalent) on the child that should truncate.

**TXT-08 detail.** In-flight labels end with the ellipsis character: "Saving…", "Loading…". The same label without it reads as a command.

**TXT-11 detail.** This suite does not mandate one style. Pass when the project declares one (title case or sentence case) and every heading and button follows it. Record the declared style in the project `DESIGN.md`.

**TXT-12 detail.** Address the reader directly and lead with the verb: "Install the CLI", not "The CLI will be installed". Use numerals for counts.

## 6. Media and Loading

| ID     | Check                                                                                | Severity | Source |
| ------ | ------------------------------------------------------------------------------------ | -------- | ------ |
| MED-01 | An image has no intrinsic `width` and `height` and no reserved aspect ratio          | Major    | UXG-19 |
| MED-02 | A below-fold image loads eagerly                                                     | Minor    | UXG-47 |
| MED-03 | The largest above-fold image is lazy, or carries no high fetch priority              | Major    | Own    |
| MED-04 | A third-party asset origin has no `preconnect` hint                                  | Minor    | Own    |
| MED-05 | A critical web font is neither preloaded nor set to swap                             | Minor    | UXG-50 |
| MED-06 | An animated GIF is used where a muted inline video would be far smaller              | Minor    | Own    |
| MED-09 | A decorative video loop has no still fallback, or keeps playing under reduced motion | Major    | Own    |
| MED-07 | A list of more than about 50 rows renders every row                                  | Major    | Own    |
| MED-08 | Layout is read during render, or reads and writes are interleaved in a loop          | Major    | CRAFT  |

**MED-03 detail.** The image that defines Largest Contentful Paint must not be lazy. Mark it `fetchpriority="high"`, or use the framework's priority flag.

**MED-09 detail.** Provide a poster image, mark the video muted and inline, and swap to the still when `prefers-reduced-motion: reduce` matches.

**MED-07 detail.** Pass when the list is windowed, or when off-screen rows use `content-visibility: auto` with a size hint.

## 7. State and Navigation

| ID     | Check                                                                              | Severity | Source |
| ------ | ---------------------------------------------------------------------------------- | -------- | ------ |
| NAV-01 | Filters, tabs, pagination, or open panels live only in memory and vanish on reload | Major    | UXG-5  |
| NAV-02 | A destructive action runs at once, with no confirmation and no undo window         | Blocker  | UXG-35 |
| NAV-03 | A collection renders a blank region when it is empty                               | Major    | UXG-79 |
| NAV-04 | An async region lacks one of loading, empty, error, or success                     | Major    | Own    |

**NAV-04 detail.** Defined in full by `skills/frontend/frontend-development/SKILL.md` (four-state rule). Indexed here so the linter reports it with a line number.

## 8. Touch and Viewport

| ID     | Check                                                                                             | Severity | Source |
| ------ | ------------------------------------------------------------------------------------------------- | -------- | ------ |
| TCH-01 | The viewport meta tag disables zoom                                                               | Blocker  | Own    |
| TCH-02 | A touch target is smaller than 44 by 44 CSS pixels                                                | Major    | UXG-22 |
| TCH-03 | Tappable controls lack `touch-action: manipulation`                                               | Minor    | UXG-25 |
| TCH-04 | The mobile tap highlight is left at the browser default on custom controls                        | Minor    | Own    |
| TCH-05 | A modal, drawer, or sheet lets scroll chain to the page behind it                                 | Major    | UXG-26 |
| TCH-06 | A fixed or full-bleed layer ignores safe-area insets                                              | Major    | Own    |
| TCH-07 | The page scrolls sideways at any supported width                                                  | Major    | UXG-69 |
| TCH-08 | An action is reachable only by drag, swipe, or pinch                                              | Blocker  | Own    |
| TCH-09 | A dragged element stays selectable or interactive during the drag                                 | Minor    | Own    |
| TCH-10 | Layout that CSS can express is measured and set by script                                         | Minor    | Own    |
| TCH-11 | Page overscroll is suppressed for touch users, which removes pull-to-refresh and swipe navigation | Minor    | Own    |
| TCH-12 | A fixed pixel width or height is set on a layout container or on an element that holds text | Major | Own |
| TCH-13 | Content is placed with absolute positioning, offsets, or negative margins where flex or grid would place it | Major | Own |
| TCH-14 | Spacing between siblings uses per-child margins, spacer elements, or one-off values instead of `gap` and scale tokens | Minor | Own |

**TCH-12, TCH-13, TCH-14 detail.** Defined in `../foundations/layout-and-spacing-system.md`, Section 8, with the fix for each smell. Positioning is allowed for layers that float above the page: menus, corner badges, sticky bars. In native toolkits the same defects are fixed frames, offsets, and absolute placement; report them under NAT-13.

**TCH-01 detail.** Flag `user-scalable=no` and `maximum-scale=1`. Pinch zoom is an accessibility requirement, not a layout bug to suppress.

**TCH-06 detail.** Fixed bars and edge-to-edge layers add `env(safe-area-inset-*)` to their padding so content clears notches and the home indicator.

**TCH-11 detail.** If rubber-band suppression is wanted on desktop, set `overscroll-behavior: none` on the root only inside `@media (pointer: fine)`. Leave coarse-pointer devices on the browser default.

**TCH-08 detail.** WCAG 2.2 "Dragging Movements". Every gesture needs a single-tap and a keyboard route to the same result, unless the gesture is the point (a signature pad).

## 9. Theming

| ID     | Check                                                                                | Severity | Source         |
| ------ | ------------------------------------------------------------------------------------ | -------- | -------------- |
| THM-01 | A dark theme does not declare `color-scheme`, so native controls render light        | Major    | Own            |
| THM-02 | `theme-color` is missing or does not match the page background                       | Minor    | Own            |
| THM-03 | A native `select` relies on inherited colours and turns unreadable in a forced theme | Major    | Own            |
| THM-04 | Hover, active, and focus states do not add contrast over the resting state           | Minor    | UXG-29, UXG-30 |
| THM-05 | State is signalled by colour alone                                                   | Major    | UXG-37         |

**THM-01 detail.** `color-scheme` on the root tells the browser to theme scrollbars, form controls, and the default canvas. Without it a dark page shows white scrollbars and light inputs.

## 10. Locale

| ID     | Check                                                                             | Severity | Source                             |
| ------ | --------------------------------------------------------------------------------- | -------- | ---------------------------------- |
| LOC-01 | A date or time is formatted by string concatenation or a fixed pattern            | Major    | UXG-85                             |
| LOC-02 | A number or currency is formatted by hand                                         | Major    | UXG-86                             |
| LOC-03 | Language is chosen from IP location instead of the browser's stated preference    | Major    | Own                                |
| LOC-04 | A brand name, code token, or identifier can be machine-translated                 | Minor    | Own                                |
| LOC-05 | A text container is fixed-width and cannot absorb a 30 percent longer translation | Minor    | `../design-practice/refinement.md` |

**LOC-01 and LOC-02 detail.** Use the platform formatters (`Intl.DateTimeFormat`, `Intl.NumberFormat`) with the user's locale.

**LOC-04 detail.** Wrap the term in an element with `translate="no"`.

## 11. Server-Rendered Frameworks

Apply this section only when the stack hydrates server markup (Next.js, Nuxt, SvelteKit, Astro islands, Remix).

| ID     | Check                                                                              | Severity | Source |
| ------ | ---------------------------------------------------------------------------------- | -------- | ------ |
| SSR-01 | A controlled input has a value and no change handler, so it is frozen              | Blocker  | Own    |
| SSR-02 | A date, time, or random value renders differently on server and client             | Major    | Own    |
| SSR-03 | A hydration warning is suppressed broadly instead of on the one node that needs it | Minor    | Own    |
| SSR-04 | An input is controlled when nothing reads its value per keystroke                  | Minor    | Own    |

**SSR-02 detail.** Render a stable placeholder on the server and fill the locale-dependent value after mount, or format on the server with an explicit locale and time zone.

## 12. Native and Desktop Apps

Apply this section when the files are SwiftUI, Jetpack Compose, Flutter, React Native, WinUI, WPF, Avalonia, JavaFX, or another non-browser toolkit. Sections 1 to 10 still apply in spirit; these rules name the native form of each defect. Platform values come from `../foundations/platform-adaptation.md`.

| ID     | Check                                                                                          | Severity | Source |
| ------ | ---------------------------------------------------------------------------------------------- | -------- | ------ |
| NAT-01 | An icon-only control has no accessibility label or content description                         | Blocker  | Own    |
| NAT-02 | Text uses a fixed size that ignores the system text setting (no text style, `dp` instead of `sp`) | Major | Own    |
| NAT-03 | A layout truncates or overlaps at the largest system text size                                 | Major    | Own    |
| NAT-04 | A touch target is below the platform minimum (44 pt on iOS, 48 dp on Android)                  | Major    | Own    |
| NAT-05 | Content is drawn under the notch, status bar, home indicator, or window chrome                 | Major    | Own    |
| NAT-06 | System back (gesture, button, or edge swipe) is blocked or does something unexpected           | Blocker  | Own    |
| NAT-07 | Colours are hard-coded, so the system dark theme or high-contrast mode is ignored              | Major    | Own    |
| NAT-08 | Animation ignores the system reduce-motion setting                                             | Major    | Own    |
| NAT-09 | A long list builds every row instead of using a lazy or virtualised list                       | Major    | Own    |
| NAT-10 | User-facing strings are hard-coded instead of coming from localised resources                  | Major    | Own    |
| NAT-11 | A desktop action has no keyboard path, or a window has no logical tab order                    | Blocker  | Own    |
| NAT-12 | A desktop window has no minimum size and its layout breaks when made small                     | Major    | Own    |
| NAT-13 | Layout uses fixed pixel positions instead of the toolkit's adaptive layout                     | Major    | Own    |
| NAT-14 | A custom control replaces a native one without matching its accessibility and behaviour        | Major    | Own    |
| NAT-15 | The on-screen keyboard covers the focused field or the submit action                           | Major    | Own    |
| NAT-16 | A gesture is the only way to reach an action                                                   | Blocker  | Own    |

**NAT-02 detail.** SwiftUI: use text styles such as `.font(.body)`, or scaled metrics for custom sizes. Compose: `sp` for text, never `dp`. Flutter: do not clamp the text scaler to 1.0. WinUI and WPF: use the type ramp resources.

**NAT-07 detail.** Read colours from the theme (Material colour scheme, asset catalogue colours, theme resources). A literal hex in a view is the defect.

**NAT-14 detail.** Prefer the native control. When a custom one is justified, it must expose the same role, name, state, and keyboard behaviour.

## Coverage Map

Rules marked **Own** in this file: 65. Rules indexed from existing references: 40. When an **Own** rule is later absorbed into another reference, change its source cell and delete its detail note here so the definition lives in one place.
