---
name: responsive-screenshot-check
description: Captures a built interface at the fixed size set for its target (web widths 320, 375, 425, 768, 1024, 1440; device and window sizes for mobile and desktop apps), measures overflow, and reports layout defects per size before a build is called done. Excludes regression suites and code fixes.
department: frontend
ownerAgent: merry
triggerCommand: /responsive-screenshot-check
antiPatternsPrevented:
  - AP-1
  - AP-18
  - AP-26
  - AP-28
---

# Responsive Screenshot Check

## 0. Identity

- **Role:** Quality Gatekeeper. Owns the visual proof that a page holds at every supported width.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Quality Gatekeeper).
- **Seniority bar:** Staff (Appendix B). Records why six fixed widths beat "looks fine on my screen" (defects cluster at the narrow end and at the tablet boundary, rejected single-viewport sign-off), why a measured overflow value beats eyeballing (one stray pixel still produces a scrollbar, rejected visual-only checks), and why claims stay limited to what was captured (a screenshot proves layout, not interaction, rejected "tested" without scope).
- **Authority:** Tier-5 normative skill for `skills/frontend/design-engineering/06-audit/responsive-screenshot-check/`. Owns the width list and the per-width checklist.
- **Must not define:** Baseline snapshot storage, pixel-diff thresholds, or CI wiring. Those belong to `skills/quality/playwright-visual-testing-fixtures/SKILL.md`. Must not edit the page under test.
- **Normative base:** `core/fellowship/merry.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-18 (unstructured output), AP-26 (no scope boundary), and AP-28 (no stop condition).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                               |
| --- | ---------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Task             | Capture one page at six widths, measure overflow, and report defects per width.                     |
| 2   | Target Tool      | Any agent runtime with a headless browser: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline.     |
| 3   | Output Format    | A per-width result table, a defect list, and the paths of the captured images.                      |
| 4   | Constraints      | Web widths fixed at 320, 375, 425, 768, 1024, 1440. Apps use the size set in `platform-adaptation.md`, Section 11. Read-only. State what was not checked. Zero em dashes. |
| 5   | Input            | A served URL or a local path to the built page.                                                     |
| 6   | Context          | Stops pages shipping with clipped text, sideways scroll, wrapped navigation, or uneven cards.        |
| 7   | Audience         | Anyone about to report a UI build as finished.                                                      |
| 8   | Success Criteria | Six captures viewed, overflow measured at each, every defect tied to a width.                       |
| 9   | Examples         | See Section 10.                                                                                     |

## 2. Trigger Matrix

| Trigger                                                    | Fire? | Notes                                                           |
| ---------------------------------------------------------- | ----- | --------------------------------------------------------------- |
| A UI build is about to be reported as done                 | YES   | Core trigger. Run before the final report.                      |
| "Check this page on mobile, tablet, and desktop"           | YES   | Core trigger.                                                   |
| "/responsive-screenshot-check http://localhost:4173"       | YES   | Slash command trigger.                                          |
| "Check this app screen on small and large phones"           | YES   | Use the phone size set from `platform-adaptation.md`.           |
| "Set up visual regression tests in CI"                     | NO    | Route to `skills/quality/playwright-visual-testing-fixtures/SKILL.md`. |
| "Lint this component's code"                               | NO    | Route to `ui-code-linter`.                                      |
| "Fix the layout at 320" | NO | Route to `responsive-layout-fixer`, which re-runs this check. |

## 3. Execution Workflow

### Step 0: Set the Target Platform

- **Action:** Name the target (web, iOS, Android, cross-platform mobile, desktop app, or business system) and its toolkit. For any target other than a web page, load `../../references/foundations/platform-adaptation.md` and express every unit, size, component, and navigation choice in that platform's terms. Step 2 covers web pages and Step 2b covers apps.
- **Input:** User request and the project's files.
- **Stop Condition:** Ask one question when the target cannot be inferred from the request or the codebase.
- **Validation:** Target platform and toolkit recorded before Step 1.

### Step 1: Serve the Page

- **Action:** Confirm the page is reachable over HTTP. Pages that load ES modules or fetch data do not work from a `file:` path, so start a local static server when given a folder.
- **Input:** URL or local path.
- **Stop Condition:** Halt if the page returns an error or renders blank; report that instead of capturing.
- **Validation:** The URL answers with status 200.

### Step 2: Capture Six Widths

- **Action:** Load `../../references/foundations/layout-and-spacing-system.md`, Section 4. Capture the full page at 320, 375, 425, 768, 1024, and 1440 wide. Many headless browsers refuse windows narrower than about 500 px; for the three phone widths, load the page inside an `iframe` of the exact width so media queries see the true size. Make the frame tall enough that scroll-triggered content has entered view.
- **Input:** Served URL.
- **Stop Condition:** Halt if a capture is cropped by the browser's minimum window size; switch to the frame method.
- **Validation:** Six images exist and each was opened and looked at.

### Step 2b: Apps That Are Not Web Pages

- **Action:** For a mobile or desktop app, load `../../references/foundations/platform-adaptation.md`, Section 11, and capture the size set for the target with the platform's own tool: simulator or emulator screenshots, a preview canvas, or resized desktop windows. Capture each size in light and dark and once at the largest system text size.
- **Input:** A runnable build or preview.
- **Stop Condition:** Halt and report when no simulator, emulator, or preview is available. Do not substitute a web capture for a native screen.
- **Validation:** Every size in the target's set was captured or listed as not captured.

### Step 3: Measure Overflow

- **Action:** At each width, read `document.documentElement.scrollWidth - window.innerWidth`. Any value above 0 is horizontal overflow. When it is, find the widest element.
- **Input:** The page at each width.
- **Stop Condition:** None.
- **Validation:** One overflow number recorded per width.

### Step 4: Inspect Each Capture

- **Action:** Check every image against the six points: no sideways scroll; headline, support line, and primary action in the first viewport; headline line count and no single-word line; grid rows full and cards equal height; navigation on one row or collapsed to a menu; fixed layers covering nothing.
- **Input:** Six captures.
- **Stop Condition:** Halt on a capture that shows hidden or unstyled content; that is a load failure, not a layout result.
- **Validation:** Each defect names its width and the element.

### Step 5: Report

- **Action:** Emit the Section 4 report. List what a screenshot cannot prove (menu toggling, form submission, hover and focus states, real-device rendering) under "Not checked".
- **Input:** Measurements and defects.
- **Stop Condition:** Stop after the report. Change nothing.
- **Validation:** Verdict is PASS only when all six widths have zero overflow and zero defects.

## 4. Output Specification

```text
# Responsive Check: http://localhost:4173/

| Width | Overflow px | First viewport | Grids | Nav        | Result |
| ----- | ----------- | -------------- | ----- | ---------- | ------ |
| 320   | 0           | ok             | ok    | menu       | pass   |
| 375   | 0           | ok             | ok    | menu       | pass   |
| 425   | 0           | ok             | ok    | menu       | pass   |
| 768   | 0           | ok             | ok    | wraps      | FAIL   |
| 1024  | 0           | ok             | ok    | one row    | pass   |
| 1440  | 0           | ok             | orphan card | one row | FAIL |

Defects
- 768: navigation wraps to a second row under the logo
- 1440: gallery last row holds 2 of 4 cards

Not checked: menu open and close, form submission, hover and focus states, real devices.
Captures: [paths]
Verdict: FAIL (2 defects)
```

Capture script, for runtimes with Playwright available:

```js
import { chromium } from "playwright";

const WIDTHS = Object.freeze([320, 375, 425, 768, 1024, 1440]);
const [url, outDir = "."] = process.argv.slice(2);

const browser = await chromium.launch();
try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    await page.screenshot({ path: `${outDir}/w${width}.png`, fullPage: true });
    console.log(`${width}\toverflow ${overflow}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
```

## 5. Validation Gate

- [ ] Target platform and toolkit recorded (Step 0).
- [ ] Page served over HTTP and loaded without error.
- [ ] Six widths captured: 320, 375, 425, 768, 1024, 1440.
- [ ] Every capture opened and inspected.
- [ ] Overflow measured at each width.
- [ ] Each defect tied to a width and an element.
- [ ] "Not checked" list present.
- [ ] No file under test modified.
- [ ] Zero em dashes in deliverable.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Capturing one desktop width, or capturing six and not looking at them.
- **Over-execution threshold:** Building a regression suite, or fixing defects inside this skill.
- **Calibration default:** Report only what the captures show. A screenshot is evidence of layout at one moment, nothing more.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                 | Mechanism                                              |
| ---- | --------------------------- | ------------------------------------------------------ |
| 1    | AP-1 (vague task)           | Requires a reachable URL before capture.               |
| 2    | AP-26 (no scope boundary)   | Fixes the width list at six.                           |
| 4    | AP-18 (unstructured output) | Ties each defect to a width and an element.            |
| 5    | AP-28 (no stop condition)   | Stops at the report with a two-state verdict.          |

## 8. Versioning & Changelog

- **Version:** 1.3.0
- **Changelog:**
  - `1.3.0` : Layout fixes now route to `responsive-layout-fixer`.
  - `1.2.0` : Added Step 0 so the skill adapts to web, mobile, desktop, and business-system targets.
  - `1.1.0` : Added size sets and a capture step for mobile and desktop apps.
  - `1.0.0` (2026-10-10) - Initial Tier-5 release.

## 9. Portability Matrix

| Runtime     | Status   | Notes                                                    |
| ----------- | -------- | -------------------------------------------------------- |
| Claude Code | verified | Run by hand with headless Chrome and the frame method.   |
| Cursor      | untested | Needs a headless browser in the environment.             |
| Copilot     | untested | Needs a headless browser in the environment.             |
| Windsurf    | untested | Needs a headless browser in the environment.             |
| Kiro        | untested | Needs a headless browser in the environment.             |
| Cline       | untested | Needs a headless browser in the environment.             |
| Raw API     | untested | Not applicable without tool access.                      |

## 10. Examples

**Input:** "/responsive-screenshot-check http://localhost:4173"
**Output:** The Section 4 report: six rows, two defects named by width, a "Not checked" list, verdict FAIL.

**Failure case:** The agent captures at 1440 only and reports "responsive verified". Refuse that claim: the verdict requires all six widths, and the report must say which were captured.
