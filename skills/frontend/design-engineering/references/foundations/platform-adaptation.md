# Platform Adaptation

The foundation files state each rule once and show its web expression in CSS. This file translates every foundation to the other targets: iOS, Android, desktop apps (Windows and macOS), cross-platform toolkits, and data-dense business systems.

The principle is constant across platforms. The unit, the API, and the native convention change. When a platform convention and a house default disagree, the platform convention wins: users bring habits from every other app on their device.

Platform numbers below reflect vendor guidance at the time of writing. Confirm against the current Apple, Material, and Fluent documentation before treating one as a hard limit.

Stack-specific rules live in `../ui-design/stacks/`. Design-practice notes live in `../design-practice/platform-adaptations.md`.

## 1. Pick the Target First

State the target in the Design Read before any other decision.

| Target                 | Typical stacks                                                | Primary input           | Stack reference                                                         |
| ---------------------- | ------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| Web                    | HTML and CSS, React, Vue, Svelte, Astro, Next.js              | Touch, pointer, keys    | `../ui-design/stacks/html-tailwind.md` and siblings                     |
| iOS and iPadOS         | SwiftUI                                                       | Touch                   | `../ui-design/stacks/swiftui.md`                                        |
| Android                | Jetpack Compose                                               | Touch                   | `../ui-design/stacks/jetpack-compose.md`                                |
| Cross-platform mobile  | Flutter, React Native                                         | Touch                   | `../ui-design/stacks/flutter.md`, `../ui-design/stacks/react-native.md` |
| Windows desktop        | WinUI, WPF, UWP, Uno                                          | Pointer and keys, touch | `../ui-design/stacks/winui.md` and siblings                             |
| macOS desktop          | SwiftUI, AppKit                                               | Pointer and keys        | `../ui-design/stacks/swiftui.md`                                        |
| Cross-platform desktop | Avalonia, JavaFX, Electron or Tauri (web rules)               | Pointer and keys        | `../ui-design/stacks/avalonia.md`, `../ui-design/stacks/javafx.md`      |
| Business system        | Any of the above: admin, point of sale, kiosk, internal tools | Varies                  | Section 9 of this file                                                  |

## 2. Units

| Platform   | Layout unit                    | Text unit                       | Note                                       |
| ---------- | ------------------------------ | ------------------------------- | ------------------------------------------ |
| Web        | CSS px, `rem`                  | `rem`                           | `rem` follows the user's browser font size |
| iOS, macOS | point (pt)                     | point, through text styles      | Text styles follow Dynamic Type            |
| Android    | density-independent pixel (dp) | scalable pixel (sp)             | `sp` follows the user's font scale         |
| Windows    | effective pixel (epx)          | epx, through the type ramp      | Follows system scale and text scaling      |
| Flutter    | logical pixel                  | logical pixel times text scaler | Respect `MediaQuery` text scaling          |

Rule on every platform: text size must follow the user's system text setting. A fixed size that ignores it is a defect.

## 3. Type System

`type-system.md` gives the roles. Map each role to the platform's own scale instead of copying pixel values.

| Role     | Web token        | iOS text style (default pt) | Android Material 3 (sp) | Windows Fluent (epx) |
| -------- | ---------------- | --------------------------- | ----------------------- | -------------------- |
| Display  | `--text-display` | Large Title (34)            | Display Small (36)      | Display (68)         |
| Title 1  | `--text-h1`      | Title 1 (28)                | Headline Large (32)     | Title Large (40)     |
| Title 2  | `--text-h2`      | Title 2 (22)                | Headline Small (24)     | Title (28)           |
| Title 3  | `--text-h3`      | Title 3 (20)                | Title Large (22)        | Subtitle (20)        |
| Emphasis | `--text-h4`      | Headline (17, semibold)     | Title Medium (16)       | Body Strong (14)     |
| Body     | `--text-body`    | Body (17)                   | Body Large (16)         | Body (14)            |
| Small    | `--text-small`   | Subheadline (15)            | Body Medium (14)        | Body (14)            |
| Caption  | `--text-caption` | Caption 1 (12)              | Label Medium (12)       | Caption (12)         |

- Fluid `clamp()` is a web technique. Native platforms do not scale type with window width. They switch layout at size classes and scale type with the user's text setting.
- Use the platform text styles so scaling, weight, and tracking come for free.
- Test at the largest accessibility text size. Layouts must reflow, not truncate.
- Desktop body text is smaller (13 to 14) because viewing distance is fixed and density matters. Do not import mobile sizes.
- Weight roles, measure, and the line-clamp rules in `type-system.md` apply everywhere.

## 4. Layout and Adaptivity

`layout-and-spacing-system.md` gives hierarchy, the 4-unit spacing scale, and grid rules. Those apply everywhere, in the platform's unit. What replaces web breakpoints:

| Platform | Mechanism                   | Classes                                                        |
| -------- | --------------------------- | -------------------------------------------------------------- |
| Web      | Media and container queries | 40rem, 48rem, 64rem, 80rem                                     |
| iOS      | Size classes                | Compact and Regular, per axis                                  |
| Android  | Window size classes (width) | Compact under 600 dp, Medium 600 to 839, Expanded 840 and up   |
| Windows  | Window width breakpoints    | Small under 641 epx, Medium 641 to 1007, Large 1008 and up     |
| Desktop  | Free window resizing        | Define a minimum window size; adapt between it and full screen |

Structural changes by class:

| Size     | Navigation                        | Content                              |
| -------- | --------------------------------- | ------------------------------------ |
| Compact  | Bottom bar, 3 to 5 destinations   | Single pane, stacked                 |
| Medium   | Navigation rail                   | Two panes where list and detail pair |
| Expanded | Rail or permanent drawer, sidebar | List and detail side by side         |
| Desktop  | Sidebar plus toolbar or menu bar  | Multi-pane, resizable splits         |

Also account for: orientation changes, split-screen and multi-window, foldable hinges, and an on-screen keyboard that covers the lower third.

## 5. Targets and Input

| Platform | Minimum target                               | Notes                                              |
| -------- | -------------------------------------------- | -------------------------------------------------- |
| Web      | 44 by 44 CSS px on touch                     | 24 px is the WCAG floor; 44 is the house default   |
| iOS      | 44 by 44 pt                                  |                                                    |
| Android  | 48 by 48 dp                                  | Visual size may be smaller if the touch area is 48 |
| Windows  | About 40 by 40 epx for touch, 32 for pointer | Offer compact density for pointer-first apps       |
| macOS    | Standard control sizes                       | Pointer-first; do not enlarge to touch sizes       |

Input rules:

- **Touch:** primary actions in thumb reach; no hover-only information; gestures always have a visible alternative.
- **Pointer:** hover states, right-click context menus, precise smaller targets, drag with a keyboard alternative.
- **Keyboard:** every action reachable; visible focus; documented shortcuts on desktop; logical tab order; Escape closes overlays.
- **Other:** game controller, remote, stylus, and voice where the device has them. Focus-based navigation needs a clear focused state at distance.

## 6. Navigation Conventions

| Platform | Primary pattern                              | Back                                 | Do not                                               |
| -------- | -------------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| iOS      | Tab bar, navigation stack with large titles  | Top-left control and edge swipe      | Block the edge swipe; add a hamburger as primary nav |
| Android  | Navigation bar, rail, or drawer; top app bar | System back gesture                  | Break system back; copy iOS tab bar styling          |
| Windows  | Navigation view (left or top), command bar   | In-app back button in the title area | Hide commands only in gestures                       |
| macOS    | Sidebar, toolbar, menu bar                   | Toolbar back and forward             | Omit menu bar commands and shortcuts                 |
| Web      | Header links, overlay menu on small screens  | Browser back; state in the URL       | Break the back button or deep links                  |

Use native components for native patterns. A custom control must match the platform's behaviour exactly, including accessibility, or it should not replace the native one.

## 7. Colour, Theme, and Depth

`colour-system.md` applies everywhere: tiers, one accent, tinted neutrals, contrast proof.

- Follow the system light or dark setting by default; offer an in-app override only when there is a reason.
- Express the brand through the platform's theming system (Material colour roles, SwiftUI tint and asset colours, Fluent theme resources). Do not fight the component library.
- Honour system high-contrast or increased-contrast modes.
- Dynamic colour (Android) and accent colour (Windows, macOS) come from the user. Decide deliberately whether the brand accent or the user's accent leads.
- Depth conventions differ: Material uses tonal elevation, Apple uses materials and blur, Fluent uses layering and subtle shadow. Use the platform's own.

## 8. Motion and Feedback

- Honour the system reduce-motion setting on every platform, not only `prefers-reduced-motion` on the web.
- Use platform transitions for navigation (push, sheet, shared axis). Custom transitions are for content inside a screen.
- Durations: touch platforms 200 to 400 ms for screen changes; desktop shorter, 100 to 250 ms.
- Haptics on mobile: confirmations and errors only. Never on every tap.
- Sound is off by default.

Full motion standards: `../motion/animation-standards.md`. Apple specifics: `../motion/apple-guidelines.md`.

## 9. Business Systems

Admin panels, point of sale, kiosks, back-office and internal tools share needs that marketing pages do not.

| Concern          | Rule                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Density          | Compact rows (32 to 40), 13 to 14 body, tabular numerals; offer comfortable and compact   |
| Speed            | Keyboard-first: shortcuts, type-ahead, bulk actions, no animation on routine tasks        |
| Tables           | Sticky header, sort, filter, column resize, saved views, state in the URL or user profile |
| Forms            | Long forms in sections with autosave or draft; errors summarised and inline               |
| Status           | Word plus shape plus colour; timestamps with time zone; last-updated shown                |
| Destructive acts | Confirm with the object's name, or provide undo; log who did what                         |
| Roles            | Hide what a role cannot do, or show it disabled with the reason                           |
| Offline, latency | Show sync state; queue actions; never lose typed input                                    |
| Kiosk and POS    | Targets 56 or larger, high contrast, timeout to a safe screen, no hidden gestures         |
| Long sessions    | Calm palette, dark theme available, no attention-seeking motion                           |

Hierarchy still applies: one primary action per view, even on a dense screen.

## 10. Accessibility APIs

| Platform | Screen reader | What to set                                                   |
| -------- | ------------- | ------------------------------------------------------------- |
| Web      | Any           | Semantic HTML first, then ARIA names, roles, states           |
| iOS      | VoiceOver     | Accessibility label, value, traits; grouping; Dynamic Type    |
| Android  | TalkBack      | Content description, state description, semantics, font scale |
| Windows  | Narrator      | UI Automation name, control type, patterns; keyboard access   |
| macOS    | VoiceOver     | Accessibility label and role; full keyboard access            |

Every platform: names on icon-only controls, state never by colour alone, contrast as in `colour-system.md`, focus order that matches reading order.

## 11. Check Sizes by Target

`../../06-audit/responsive-screenshot-check/SKILL.md` uses these sets.

| Target         | Check at                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Web            | 320, 375, 425, 768, 1024, 1440 wide                                                                |
| Phone app      | 320 by 568 (smallest), 390 by 844 (common), 430 by 932 (large), each also at the largest text size |
| Tablet app     | 768 by 1024 portrait, 1180 by 820 landscape, and one split-screen half                             |
| Android extras | 360 by 800, a foldable unfolded at about 840 wide                                                  |
| Desktop app    | The minimum window size, 1366 by 768, 1920 by 1080, and one 200 percent scale                      |
| Kiosk or POS   | The exact device resolution in its fixed orientation                                               |

On every target also check light and dark, and the system's largest text size.

## 12. Checklist

- Target platform stated before design decisions.
- Text follows the user's system text size.
- Layout adapts by the platform's own size mechanism.
- Targets meet the platform minimum for the primary input.
- Navigation and back behaviour are the platform's own.
- System theme, contrast, and reduce-motion settings honoured.
- Accessibility names and states set through the platform API.
- Checked at the size set for the target, in light and dark, at the largest text size.
