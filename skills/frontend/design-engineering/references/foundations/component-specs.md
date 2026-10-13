# Component Specs

Default anatomy, sizes, and states for the components most pages need. Values use the tokens from `layout-and-spacing-system.md`, `type-system.md`, and `colour-system.md`. A brand preset or token pack may change colour, radius, and type; it may not remove a state or shrink a target.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

## 1. States Every Interactive Component Has

| State         | Requirement                                                   |
| ------------- | ------------------------------------------------------------- |
| Default       | Recognisable as interactive without hovering                  |
| Hover         | Visible change, pointer devices only                          |
| Pressed       | Immediate feedback within 100 ms                              |
| Focus-visible | 2 to 3 px outline, offset 2 px, 3 to 1 contrast               |
| Disabled      | Lower contrast, `disabled` attribute, no pointer events       |
| Busy          | `aria-busy="true"`, a progress cue, repeat activation blocked |

Async regions add four more: loading (skeleton shaped like the content), empty (what goes here and how to add it), error (what failed and what to do), success.

## 2. Actions

| Component        | Size                                                | Construction                                                  |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| Primary button   | 48 px tall touch, 40 px dense; inline padding 20 px | Accent fill, on-accent label, weight 600, control radius      |
| Secondary button | Same                                                | Transparent or surface fill, 1.5 px border, strong-text label |
| Text button      | Same hit height                                     | No fill, action-colour label, underline on hover              |
| Icon button      | 44 by 44 px minimum                                 | Icon 20 to 24 px, accessible name required                    |
| Link             | Inline                                              | Action colour, underlined in body copy, offset 0.2em          |

- One primary button per view. Labels name the outcome ("Send quote request").
- A button with an icon keeps 8 px between icon and label.
- Buttons do not change width between default and busy; reserve the space.
- `button` for actions, anchor for navigation.

## 3. Form Controls

| Component       | Size                                        | Construction                                                       |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Text input      | 48 px tall, padding 12 by 16                | Surface fill, 1.5 px border at 3 to 1, control radius, label above |
| Textarea        | Minimum 120 px tall                         | Same as input, vertical resize only                                |
| Select          | 48 px tall                                  | Native element, explicit background and text colour                |
| Checkbox, radio | 20 px box inside a 44 px target             | Label is part of the hit target                                    |
| Switch          | 44 by 24 px track                           | For settings that apply at once; a checkbox for forms that submit  |
| Field group     | 8 px label to control, 20 px between fields | Help text below the control, error text below help                 |

- Every control has a visible label. A placeholder is an example, never the label.
- Mark optional fields, not required ones, when most are required.
- Errors appear under the field in danger colour with an icon, linked by `aria-describedby`, and say how to fix the problem.
- Validate on blur, re-validate on input once a field has shown an error.
- On submit, focus the first invalid field. Keep what the user typed.
- Use `type`, `inputmode`, and `autocomplete` that match the data.

Deeper form rules: `skills/frontend/forms-validation/SKILL.md`.

## 4. Containers

| Component  | Construction                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- |
| Card       | Surface fill or hairline, card radius, padding 24 px (16 px compact), one depth language      |
| Media card | Fixed-ratio media on top, caption block below; the caption block stretches to equalise height |
| Section    | Section padding token, a heading block capped at 62ch, then content                           |
| Callout    | Accent or tinted fill, container radius, padding 32 to 48 px, one action                      |
| Divider    | 1 px hairline; prefer space to a line when space is enough                                    |

- A card that is one link makes the whole card the target, with one accessible name.
- Two levels of nesting at most.
- If removing the box loses nothing, remove the box.

## 5. Navigation

| Component   | Construction                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Header      | 64 px tall, sticky, canvas fill with a hairline; brand left, links, one action                                                         |
| Nav link    | 44 px hit height, weight 500; current item marked by colour plus underline or weight                                                   |
| Mobile menu | Opened by a labelled button with `aria-expanded`; overlays the page; closes on Escape, on link activation, and when the viewport grows |
| Footer      | Dark or tinted band; contact details, key links, legal line                                                                            |
| Breadcrumbs | Only for three or more levels; current page is text, not a link                                                                        |
| Tabs        | `role="tablist"`, arrow keys move between tabs, the active tab is in the URL                                                           |
| Pagination  | Previous and next always present; current page marked; state in the URL                                                                |
| Call bar    | Phones only; two actions; fixed bottom with safe-area padding                                                                          |

Mark the current section only while it is in view. Clear the mark when none is.

## 6. Overlays

| Component | Construction                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------- |
| Dialog    | Native `dialog` element; focus moves in and is trapped; Escape closes; focus returns to the trigger |
| Drawer    | Same behaviour as a dialog; slides from an edge; `overscroll-behavior: contain`                     |
| Menu      | Opens on activation, arrow keys move, Escape closes, one soft shadow                                |
| Tooltip   | Supplementary text only; appears on hover and on focus; never holds an action                       |
| Toast     | Live region; auto-dismisses after 4 to 6 seconds; never the only place an error appears             |

A destructive action confirms first or offers undo. The confirm button names the action ("Delete project"), not "OK".

## 7. Data Display

| Component  | Construction                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- |
| Table      | Real `table` markup; header row; numbers right-aligned in tabular numerals; row dividers only |
| Wide table | Scrolls inside a focusable region with a label, or reflows to cards on phones                 |
| List row   | 48 px minimum height; primary text, one line of secondary text, trailing action or value      |
| Badge      | Small label, 4 px 8 px padding, word plus colour                                              |
| Stat       | One number, one label, optional change; real figures only                                     |
| Avatar     | Circle, 32 to 48 px, initials fallback, alt text or decorative                                |
| Progress   | Determinate bar when the total is known; label the value                                      |

## 8. Feedback Placeholders

| Component    | Construction                                                                     |
| ------------ | -------------------------------------------------------------------------------- |
| Skeleton     | Grey shapes matching the final layout; no shimmer under reduced motion           |
| Empty state  | One line on what belongs here, one action to add it, optional small illustration |
| Error state  | What failed, in plain words, with a retry action and a second route (contact)    |
| Inline alert | Icon, short message, optional action; colour plus icon                           |

## 9. Native Equivalents

Use the platform's component before building one. The specs above describe behaviour every version must have.

| Component        | SwiftUI                            | Compose (Material 3)      | Flutter                   | WinUI                       |
| ---------------- | ---------------------------------- | ------------------------- | ------------------------- | --------------------------- |
| Primary button   | `Button` with `.borderedProminent` | `Button`                  | `FilledButton`            | `Button` with accent style  |
| Secondary button | `Button` with `.bordered`          | `OutlinedButton`          | `OutlinedButton`          | `Button`                    |
| Text input       | `TextField`                        | `OutlinedTextField`       | `TextField`               | `TextBox`                   |
| Select           | `Picker`                           | `ExposedDropdownMenuBox`  | `DropdownMenu`            | `ComboBox`                  |
| Switch           | `Toggle`                           | `Switch`                  | `Switch`                  | `ToggleSwitch`              |
| List             | `List`                             | `LazyColumn`              | `ListView.builder`        | `ListView`                  |
| Tabs             | `TabView`                          | `NavigationBar`, `TabRow` | `NavigationBar`, `TabBar` | `NavigationView`, `TabView` |
| Dialog           | `alert`, `confirmationDialog`      | `AlertDialog`             | `AlertDialog`             | `ContentDialog`             |
| Sheet or drawer  | `sheet`                            | `ModalBottomSheet`        | `showModalBottomSheet`    | `SplitView`, flyout         |
| Toast            | No system toast; use a banner      | `Snackbar`                | `SnackBar`                | `InfoBar`                   |
| Progress         | `ProgressView`                     | `LinearProgressIndicator` | `LinearProgressIndicator` | `ProgressBar`               |
| Table            | `Table`                            | Lazy list with row layout | `DataTable`               | `DataGrid`                  |

Component names can change between toolkit versions; confirm in the project's version.

## 10. Checklist

- Six states on every interactive component.
- Four states on every async region.
- Targets 44 px or more; 8 px between neighbours.
- Labels on every control and icon button.
- One primary button per view, named for its outcome.
- Overlays manage focus and close on Escape.
- Tables use table markup and tabular numerals.
