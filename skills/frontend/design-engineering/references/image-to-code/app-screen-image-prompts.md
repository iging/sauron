# App Screen Prompting

Depth reference for `05-image-to-code/app-screen-image-prompts`. It covers platform modes for phones, tablets, and desktop windows, the app design bible, which screens to generate for a flow, and the rules that keep generated screens legible and buildable.

Web comp rules that also apply here (prompt anatomy, exclusions, escalation) live in `web-page-image-prompts.md`. This file adds what is specific to phones.

## 1. Platform Mode

Choose one before writing any prompt. It changes navigation, controls, type, and corner shapes.

| Aspect         | iOS mode                              | Android mode                               | Neutral mode             |
| -------------- | ------------------------------------- | ------------------------------------------ | ------------------------ |
| Navigation     | Bottom tab bar, large-title top bar   | Bottom navigation bar or rail, top app bar | Bottom bar with labels   |
| Primary action | Top-right text or bottom sheet button | Floating action button or filled button    | Full-width bottom button |
| Back           | Top-left chevron, edge swipe          | System back gesture, top-left arrow        | Top-left arrow           |
| Controls       | Switches, segmented controls, sheets  | Material switches, chips, snackbars        | Simple toggles and chips |
| Corners        | Continuous large radius               | Shape scale, medium radius                 | Medium radius            |
| Type feel      | System sans, tight and quiet          | System sans, slightly larger labels        | A chosen brand sans      |

Do not mix modes in one flow. Native guideline detail lives in `../motion/apple-guidelines.md` and `../design-practice/platform-adaptations.md`.

## 2. Screen-First Rule

One prompt per screen, one screen per image. State the frame in words: "single mobile app screen, portrait, 9:19.5, straight-on". A sheet of many phones produces unreadable type and cannot be measured.

Device frame: off by default for build references (frames steal pixels and distort proportions). Turn it on only for presentation boards, and then use a plain, unbranded frame, one device per image, no hands, no tilt.

## 3. Which Screens to Generate

| Flow       | Screens                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| Core set   | Home, primary list, detail, primary task, profile or settings                 |
| Onboarding | Value screen, permission ask with reason, account creation, first empty state |
| Commerce   | Catalogue, product, cart, checkout, order confirmation                        |
| Content    | Feed, item, search with results, saved items                                  |
| Utility    | Dashboard, entry form, history, insight                                       |

Always include one empty state and one error state. They expose whether the system holds together without data.

Screens must follow one another logically: a detail screen shows an item that appeared in the list; a confirmation reflects the totals from checkout. State the link in the prompt ("detail view of the second card from the home screen").

## 4. App Design Bible

One line pasted at the top of every screen prompt.

```text
BIBLE: [platform mode], [theme], canvas [colour], surface [colour], ink [colour], accent [colour],
type [character], radius [value], icons [line or filled, stroke weight], spacing base [4 or 8],
navigation [pattern with the item labels], signature [one recurring element].
```

Navigation item labels are part of the bible. A tab bar that changes labels between screens is the most common consistency failure.

## 5. First Screen Cleanliness

- One clear purpose, visible in the top third.
- One primary action.
- Three content groups at most.
- No promotional banners stacked above content.
- No floating elements other than the platform's own action button.
- Thumb zone holds the main actions; the top holds orientation.

## 6. Safe Areas and System Regions

State these in the prompt so the model leaves room.

- Status bar region at the top stays clear, with only time, signal, and battery.
- Home indicator region at the bottom stays clear; bottom bars sit above it.
- Content does not run under the notch or dynamic island.
- Bottom sheets have a grab handle and rounded top corners only.

## 7. Text Legibility

Generated screens fail most often on type that is too small.

- Body text at about 4.2 percent of frame width (16 pt on a 390 pt frame). Say "body text clearly readable, at least 16 point".
- Screen titles at 7 to 9 percent of frame width.
- Nothing below 12 pt, and that size only for captions and tab labels.
- Quote exact text for titles, tab labels, and primary buttons. Describe the rest by amount ("two lines of body text").
- Line length 30 to 40 characters on a phone.
- Text over an image needs a solid or gradient contrast layer; ask for it explicitly.

## 8. Layout and Density

- Side margins 16 or 20 pt, the same on every screen.
- Touch targets 44 pt (iOS) or 48 dp (Android), with 8 pt between adjacent targets.
- Lists use dividers or spacing, not both.
- Cards are full-width or in a 2-column grid. Three columns of cards is too tight on a phone.
- One level of card nesting at most.
- Vary screens within the system: a list screen, a media-led screen, a form screen. Identical card stacks on every screen read as a template.

## 9. Variation Engine

Choose one per row, record them in the bible.

| Dimension      | Options                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| Theme          | Light neutral, light warm, dark, high-contrast, colour field                    |
| Type character | System-like, rounded friendly, editorial serif accents, condensed sporty        |
| Structure bias | List-led, card-led, media-led, data-led                                         |
| Surface        | Flat, soft elevation, tinted panels, fine grain                                 |
| Palette logic  | Monochrome with one accent, analogous pair, category colour coding              |
| Signature      | A custom chart style, a progress ring, an illustrated empty state, a tag system |
| Motion implied | Calm fades, springy sheets, shared-element continuity                           |

## 10. Category Bias

| Category           | Lean toward                                           | Avoid                                  |
| ------------------ | ----------------------------------------------------- | -------------------------------------- |
| Finance            | Tabular figures, calm palette, explicit confirmation  | Playful colour, hidden fees, tiny type |
| Health and fitness | Large progress visuals, encouraging tone, one metric  | Dense dashboards, alarm colours        |
| Productivity       | List clarity, quick capture, keyboard-friendly forms  | Decorative cards, long onboarding      |
| Social             | Media first, clear identity, visible safety controls  | Chrome heavier than content            |
| Commerce           | Honest product imagery, price clarity, short checkout | Carousels as the only navigation       |
| Wellness           | Soft palette, slow rhythm, generous space             | Notification clutter, streak pressure  |

## 11. Mobile Tells to Exclude

- **Visual:** neon gradients, glass over busy photos, glow on icons, 3D emoji-style illustrations.
- **Layout:** four stat cards in a grid on the home screen, floating bars that overlap content, tab bars with six or more items.
- **Copy:** "Welcome back, User", invented balances with round numbers, placeholder names.
- **Clutter:** badges on every tab, chips above every list, icon buttons with no labels, a banner above the title.

## 12. Regeneration Rule

When a screen is wrong, regenerate that screen with a corrected prompt. Do not crop, stretch, or stitch another image. Change one variable at a time so the cause of a difference is known.

## 13. Quality Check

1. Platform mode consistent with the bible.
2. One screen per image, portrait, straight-on.
3. Navigation labels identical across screens.
4. Body text readable at the stated size.
5. Safe areas clear.
6. One primary action per screen.
7. Empty and error states present.
8. Screens link logically.
9. No row from the tells list.

## 14. Template

```text
BIBLE: iOS mode, light warm, canvas #FAF8F4, surface #FFFFFF, ink #1C1A17, accent #A4482B,
type system-like, radius 14, line icons 1.5 stroke, spacing base 8,
bottom tab bar with Home, Jobs, Quotes, Profile, signature progress ring.

SCREEN 2 OF 5, JOB LIST. Single mobile app screen, portrait, 9:19.5, straight-on, no device frame.
Large title "Jobs" top left. A segmented control with "Active" and "Done". Four full-width job cards,
each with a job name, suburb, a status word with a small shape, and a progress ring on the right.
Body text clearly readable, at least 16 point. Bottom tab bar from the bible with Jobs selected.
Status bar and home indicator regions clear.
Exclude: gradients, glow, badges, floating buttons, tilt, hands.
```

## 15. Tablet and Desktop Window Modes

Sections 1 to 14 assume a phone. For larger targets change the frame, the navigation, and the density.

| Aspect        | Tablet                                         | Desktop window                                              |
| ------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| Frame         | "single tablet app screen, 4:3, straight-on"   | "desktop application window, 16:10, straight-on, with a title bar" |
| Navigation    | Rail or sidebar; tab bar only in portrait      | Sidebar plus toolbar; menu bar on macOS                     |
| Layout        | Two panes: list and detail                     | Two or three resizable panes                                |
| Body text     | 16 to 17 pt                                    | 13 to 14 pt                                                 |
| Targets       | 44 pt or 48 dp                                 | Pointer-sized controls, 28 to 32 tall                       |
| Density       | Comfortable                                    | Compact rows, tables, keyboard shortcut hints               |
| Extras        | Split-screen half-width variant                | Minimum-size variant and a full-screen variant              |

Rules:

- Do not stretch a phone layout. A wider screen shows more at once: add a pane instead of widening one.
- Desktop comps show window chrome so title bar and toolbar space are accounted for.
- Generate the smallest supported window as well as a large one. The small one exposes what must collapse.
- Business systems (admin, point of sale) follow `../foundations/platform-adaptation.md`, Section 9: dense tables, visible status, large targets only on touch hardware.
- The bible line names the mode: `[platform mode: iOS phone / iPad / Android tablet / Windows desktop / macOS desktop]`.
