---
name: responsive-layout-fixer
description: Repairs layout defects across all six check widths (320, 375, 425, 768, 1024, 1440) by finding the root cause in code, applying the smallest fluid fix, and re-checking every width until all pass. Covers web pages and, with the platform size set, mobile and desktop apps. Excludes visual redesign and new features.
department: frontend
ownerAgent: frodo
triggerCommand: /responsive-layout-fixer
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-18
  - AP-26
  - AP-28
---

# Responsive Layout Fixer

## 0. Identity

- **Role:** Interface Builder. Owns the repair of layout defects until the interface holds at every supported width.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Interface Builder).
- **Seniority bar:** Staff (Appendix B). Records why root-cause fixes beat symptom patches (one fluid rule removes a class of defects, rejected `overflow-x: hidden` and per-breakpoint widths), why every width is re-checked after each fix (a repair at 320 routinely breaks 768, rejected single-width verification), and why the loop has a hard stop (unbounded retries hide a structural problem, rejected endless patching).
- **Authority:** Tier-5 normative skill for `skills/frontend/design-engineering/06-audit/responsive-layout-fixer/`. Owns the fix loop and the playbook at `../../references/audit/responsive-fix-playbook.md`.
- **Must not define:** Visual direction, palette, type choices, or copy. Those belong to the 02 Styles skills and the foundations. Must not add features or restyle components beyond what the fix needs.
- **Normative base:** `core/fellowship/frodo.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-4 (over-permissive agent), AP-18 (unstructured output), AP-26 (no scope boundary), and AP-28 (no stop condition).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                              |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Task             | Make a page or screen pass at all six widths by fixing causes in code and proving the result.                      |
| 2   | Target Tool      | Any agent runtime with file edit access and a headless browser or simulator.                                       |
| 3   | Output Format    | A before and after table per width, the list of fixes with file and line, and what was not verified.               |
| 4   | Constraints      | All six widths every round. No banned fixes. Smallest change that removes the cause. Three rounds at most. Zero em dashes. |
| 5   | Input            | A served URL or runnable build, the source files, and optionally a defect list from `responsive-screenshot-check`. |
| 6   | Context          | Ends the cycle of fixing one width and breaking another.                                                           |
| 7   | Audience         | Anyone with a layout that breaks on some screens.                                                                  |
| 8   | Success Criteria | Zero overflow and zero defects at 320, 375, 425, 768, 1024, and 1440, with nothing hidden or clipped to get there. |
| 9   | Examples         | See Section 10.                                                                                                    |

## 2. Trigger Matrix

| Trigger                                                     | Fire? | Notes                                                              |
| ----------------------------------------------------------- | ----- | ------------------------------------------------------------------ |
| "Fix the responsive layout" or "it breaks on mobile"        | YES   | Core trigger.                                                      |
| A `responsive-screenshot-check` report with a FAIL verdict  | YES   | Use its defect list as the starting point.                         |
| "/responsive-layout-fixer http://localhost:4173"            | YES   | Slash command trigger.                                             |
| "The nav wraps at tablet" or "there is sideways scroll"     | YES   | Fix that defect, then verify all six widths anyway.                |
| "Just tell me what is broken"                               | NO    | Route to `responsive-screenshot-check`.                            |
| "Make it look better" or "redesign this"                    | NO    | Route to `visual-redesign-upgrade`.                                |
| "Fix the accessibility of this component"                   | NO    | Route to `component-audit-and-fix`.                                |
| "Build this page from scratch"                              | NO    | Route to `anti-slop-ui-builder`.                                   |

## 3. Execution Workflow

### Step 0: Set the Target Platform

- **Action:** Name the target (web, iOS, Android, cross-platform mobile, desktop app, or business system) and its toolkit. For a web page the size set is 320, 375, 425, 768, 1024, 1440. For any other target, load `../../references/foundations/platform-adaptation.md` and use the size set in its Section 11, plus the largest system text size.
- **Input:** User request and the project's files.
- **Stop Condition:** Ask one question when the target cannot be inferred from the request or the codebase.
- **Validation:** Target, toolkit, and size set recorded before Step 1.

### Step 1: Baseline at Every Width

- **Action:** Run `../responsive-screenshot-check/SKILL.md` to capture all six widths and measure overflow. Reuse a supplied report only if the code has not changed since it was made. Record the result per width as the baseline.
- **Input:** Served URL or runnable build.
- **Stop Condition:** Halt if the page cannot be served or rendered. Do not edit layout code blind.
- **Validation:** Six baseline rows exist, each with an overflow value and a defect list.

### Step 2: Diagnose the Cause

- **Action:** Load `../../references/audit/responsive-fix-playbook.md` and `../../references/foundations/layout-and-spacing-system.md`, Sections 4 and 8. For each defect, locate the rule that causes it. For sideways scroll, find the widest element with the script in the playbook, Section 2. Group defects that share one cause.
- **Input:** Baseline defects and source files.
- **Stop Condition:** Halt and report when a defect comes from content that cannot fit by nature (a fixed-size embed, a third-party widget). Offer options instead of forcing it.
- **Validation:** Every defect is tied to a file, a line, and a named cause.

### Step 3: Fix Mobile First

- **Action:** Fix causes in order of the narrowest failing width. Replace the faulty rule with a fluid one (`minmax()`, `clamp()`, wrapping, `auto-fill`, a moved breakpoint) before adding any breakpoint patch. Change only what the cause requires. Never use a fix from the playbook's banned list.
- **Input:** Cause list from Step 2.
- **Stop Condition:** Halt before any change that hides content, clips the page, shrinks body text below 16 px, or alters the visual design. Ask the user instead.
- **Validation:** Each edit names the cause it removes.

### Step 4: Re-check Every Width

- **Action:** Capture all six widths again and measure overflow. Compare each width with its baseline. A width that passed before and fails now is a regression and takes priority over remaining defects.
- **Input:** Edited files.
- **Stop Condition:** None.
- **Validation:** Six new rows recorded. No width is skipped because "it was not touched".

### Step 5: Loop or Stop

- **Action:** If any width still fails, return to Step 2 with the remaining defects. Stop when all six pass, or after three full rounds.
- **Input:** Results from Step 4.
- **Stop Condition:** After three rounds with failures remaining, stop editing. Report what is fixed, what remains, and the structural reason it resists a local fix.
- **Validation:** Round count recorded.

### Step 6: Report

- **Action:** Emit the Section 4 report. State what the screenshots cannot prove (menu toggling, form behaviour, real devices) under "Not verified".
- **Input:** Baseline, final results, and the fix list.
- **Stop Condition:** Stop after the report.
- **Validation:** The verdict is FIXED only when all six widths show zero overflow and zero defects.

## 4. Output Specification

```text
# Responsive Fix: http://localhost:4173/

| Width | Before                    | After | Overflow px |
| ----- | ------------------------- | ----- | ----------- |
| 320   | sideways scroll, 2 defects | pass  | 0           |
| 375   | 1 defect                  | pass  | 0           |
| 425   | pass                      | pass  | 0           |
| 768   | nav wraps                 | pass  | 0           |
| 1024  | pass                      | pass  | 0           |
| 1440  | orphan card               | pass  | 0           |

Fixes (2 rounds)
- css/styles.css:212  grid track `1fr` held a long email -> `minmax(0, 1fr)` plus `overflow-wrap: anywhere`  (320, 375)
- css/styles.css:148  desktop nav enabled at 48rem without room -> breakpoint moved to 56rem  (768)
- css/styles.css:301  four columns with six items -> three columns from 64rem  (1440)

Not changed: colours, type, copy, component styling.
Not verified: menu open and close, form submission, real devices.
Verdict: FIXED (6 of 6 widths pass)
```

Verdicts: FIXED when all six pass. PARTIAL when some remain after three rounds, with the reason. BLOCKED when the page could not be rendered or a fix needs a design decision.

## 5. Validation Gate

- [ ] Target platform and size set recorded (Step 0).
- [ ] Baseline captured at all six widths before any edit.
- [ ] Every defect tied to a file, a line, and a cause.
- [ ] No banned fix used: no page-level `overflow-x: hidden`, no hidden content, no shrunken body text.
- [ ] All six widths re-checked after every round, including widths that passed before.
- [ ] No regression left in place.
- [ ] Three rounds at most.
- [ ] Visual design unchanged.
- [ ] "Not verified" list present.
- [ ] Zero em dashes in deliverable.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Fixing the one width the user named and reporting done without checking the other five.
- **Over-execution threshold:** Restyling, rewriting components, or adding breakpoints for widths that already pass.
- **Calibration default:** One fluid rule beats three breakpoint patches. When a fix needs a design choice, stop and ask.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                  | Mechanism                                                      |
| ---- | ---------------------------- | -------------------------------------------------------------- |
| 1    | AP-1 (vague task)            | Requires a measured baseline at six widths before editing.     |
| 2    | AP-18 (unstructured output)  | Ties each defect to a file, a line, and a cause.               |
| 3    | AP-4 (over-permissive agent) | Limits edits to the cause and bans symptom-hiding fixes.       |
| 3    | AP-26 (no scope boundary)    | Halts before any change to visual design or content.           |
| 5    | AP-28 (no stop condition)    | Stops at all-pass or after three rounds.                       |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-10-10) - Initial Tier-5 release with the six-width fix loop and the responsive fix playbook.

## 9. Portability Matrix

| Runtime     | Status   | Notes                                              |
| ----------- | -------- | -------------------------------------------------- |
| Claude Code | untested | Needs file edit access and a headless browser.     |
| Cursor      | untested | Needs file edit access and a headless browser.     |
| Copilot     | untested | Needs file edit access and a headless browser.     |
| Windsurf    | untested | Needs file edit access and a headless browser.     |
| Kiro        | untested | Needs file edit access and a headless browser.     |
| Cline       | untested | Needs file edit access and a headless browser.     |
| Raw API     | untested | Not applicable without tool access.                |

## 10. Examples

**Input:** "/responsive-layout-fixer http://localhost:4173"
**Output:** The Section 4 report: baseline and final result for all six widths, three fixes with file and line, verdict FIXED.

**Failure case:** The user says "the hero overflows on my phone". The agent adds `overflow-x: hidden` to `body`, checks 375 only, and reports it fixed. Refuse that path: the fix is banned, the cause is still in the code, and five widths were never checked.
