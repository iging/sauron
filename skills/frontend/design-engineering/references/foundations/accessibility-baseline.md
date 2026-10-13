# Accessibility Baseline

The accessibility floor for every interface built with this suite, on one page. It targets WCAG 2.2 level AA. Deeper auditing and remediation live in `skills/frontend/accessibility-auditor/SKILL.md`; code-level checks live in `../audit/ui-code-linter-rules.md`.

> **Platforms.** The requirements hold for web, mobile, and desktop. Each platform has its own API for names, roles, and settings; see `platform-adaptation.md`, Section 10.

## 1. The Twelve Requirements

| #   | Requirement                                                                                                   | Check                                     |
| --- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | **Text contrast** is 4.5 to 1, or 3 to 1 for large text                                                       | Measure every text and surface pair       |
| 2   | **Non-text contrast** is 3 to 1 for control boundaries, icons that carry meaning, and focus rings             | Measure inputs, icon buttons, focus       |
| 3   | **Colour is never the only signal** for state, status, links in text, or chart series                         | View in greyscale                         |
| 4   | **Everything works by keyboard**, in a logical order, with no trap                                            | Tab through the whole screen              |
| 5   | **Focus is always visible** and never hidden behind a sticky or floating layer                                | Watch the ring on every stop              |
| 6   | **Every control has a name**: visible label, or an accessible name for icon-only controls                     | Read the controls list in a screen reader |
| 7   | **Structure is real**: one main heading, levels in order, landmarks, lists and tables marked up as such       | Navigate by headings and landmarks        |
| 8   | **Targets are large enough**: 44 by 44 on touch, 8 between neighbours                                         | Measure the smallest control              |
| 9   | **Text can grow**: 200 percent zoom on the web, the largest system text size in apps, with no loss of content | Zoom and scale                            |
| 10  | **Motion can be turned off**, nothing flashes more than three times a second, auto-play can be paused         | Enable reduce motion                      |
| 11  | **Errors are announced, explained, and fixable**; nothing important appears only as a toast                   | Submit an empty form with a screen reader |
| 12  | **Media has alternatives**: alt text, captions, transcripts                                                   | Turn images and sound off                 |

## 2. Keyboard and Focus

- Tab order follows visual order. Do not use positive `tabindex`.
- Enter and Space activate buttons; Escape closes the top layer; arrow keys move inside composite widgets (tabs, menus, radio groups).
- Opening a dialog moves focus into it and traps it there. Closing returns focus to the trigger.
- A skip link is the first focusable element on a page with navigation.
- Anchored scrolling leaves the target clear of sticky headers.
- Drag actions have a click or keyboard alternative.

## 3. Names, Roles, States

- Use the native element first: it brings role, name, state, and keyboard behaviour.
- Icons beside a label are hidden from assistive tech; icon-only controls are named.
- State is exposed, not only shown: expanded, selected, pressed, checked, invalid, busy, current.
- Changes that happen without a page load are announced through a live region: results count, validation, saved status.
- The page declares its language. Passages in another language are marked.

## 4. Forms

- Every field has a visible, persistent label. Placeholders are examples only.
- Required and optional are stated in text.
- Errors appear next to the field, are linked to it, say how to fix the problem, and do not clear the user's input.
- Fields use correct types and autocomplete tokens so browsers and password managers can help.
- Authentication does not depend on a memory or puzzle test; paste is never blocked.

## 5. Content

- Link and button text makes sense out of context.
- Headings describe the section beneath them.
- Reading level is plain. Abbreviations are expanded on first use.
- Instructions do not rely on shape, colour, position, or sound alone ("the green button on the right").
- Time limits can be extended; sessions warn before expiring.

## 6. What a Screenshot Cannot Prove

A visual check confirms contrast, target size, visible focus, and reflow. It cannot confirm names, roles, announcements, or keyboard order. Test those with a keyboard and at least one screen reader, and say so when they were not tested.

## 7. Checklist

- Twelve requirements checked, with the method used.
- Keyboard pass completed end to end.
- Screen-reader pass completed on the primary task, or stated as not done.
- Zoom or largest text size checked.
- Reduce motion checked.
- Known gaps listed with an owner.
