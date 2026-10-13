---
name: ui-code-linter
description: Read-only lint pass over UI source files for web, mobile, and desktop toolkits that reports code-verifiable interface defects (semantics, focus, forms, motion, copy, media, state, touch, theming, locale, hydration, native platform rules) as file and line findings with rule IDs. Excludes visual taste critique and code rewriting.
department: frontend
ownerAgent: legolas
triggerCommand: /ui-code-linter
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-18
  - AP-26
  - AP-28
---

# Interface Compliance Code Linter

## 0. Identity

- **Role:** Syntax Reviewer. Owns line-level interface compliance findings for UI source code.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Syntax Reviewer).
- **Seniority bar:** Staff (Appendix B). Records why line-anchored findings beat narrative audits (a reviewer can act on each one in seconds, rejected prose reports), why a read-only pass beats audit-plus-rewrite (findings stay reviewable and diffs stay small, rejected silent refactors), and why an indexed rule catalogue beats a restated one (one definition per rule, rejected duplicated guidance).
- **Authority:** Tier-5 normative skill for `skills/frontend/design-engineering/06-audit/ui-code-linter/`. Owns the finding format and the rule catalogue at `../../references/audit/ui-code-linter-rules.md`.
- **Must not define:** Visual direction, brand choices, or aesthetic scoring. Those belong to `visual-redesign-upgrade` and `design-critique-scorecard`. Must not rewrite code; fixes belong to `component-audit-and-fix`.
- **Normative base:** `core/fellowship/legolas.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-4 (over-permissive agent), AP-18 (unstructured output), AP-26 (no scope boundary), and AP-28 (no stop condition).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                         |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Task             | Check named UI files against the interface compliance catalogue and report each defect with file and line.    |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API.                              |
| 3   | Output Format    | Findings grouped by file, one line each, followed by a severity tally.                                        |
| 4   | Constraints      | Read-only. Every finding carries a rule ID and a line number. No finding without evidence. Zero em dashes.    |
| 5   | Input            | File paths or a glob, plus the stack when it cannot be inferred.                                              |
| 6   | Context          | Catches defects that pass visual review: missing names, blocked paste, frozen inputs, lost state, zoom locks. |
| 7   | Audience         | Frontend engineers and reviewers gating a pull request.                                                       |
| 8   | Success Criteria | Every in-scope file is reported as findings or as a pass; zero findings lack a rule ID or line.               |
| 9   | Examples         | See Section 10.                                                                                               |

## 2. Trigger Matrix

| Trigger                                              | Fire? | Notes                                          |
| ---------------------------------------------------- | ----- | ---------------------------------------------- |
| "Lint these components against interface guidelines" | YES   | Core trigger.                                  |
| "Check this page for accessibility and form defects" | YES   | Core trigger.                                  |
| "/ui-code-linter src/\*_/_.tsx"    | YES   | Slash command trigger.                         |
| "Gate this pull request on UI compliance"            | YES   | Lint only the changed UI files.                |
| "Audit and fix this component"                       | NO    | Route to `component-audit-and-fix`.     |
| "This page looks generic, redesign it"               | NO    | Route to `visual-redesign-upgrade`. |
| "Review the animation quality in this pull request"  | NO    | Route to `motion-pr-review`.    |
| "Score this interface against Nielsen heuristics"    | NO    | Route to `design-critique-scorecard`.    |

## 3. Execution Workflow

### Step 0: Set the Target Platform

- **Action:** Name the target (web, iOS, Android, cross-platform mobile, desktop app, or business system) and its toolkit. For any target other than a web page, load `../../references/foundations/platform-adaptation.md` and express every unit, size, component, and navigation choice in that platform's terms. Section 12 of the rule catalogue holds the native and desktop rules.
- **Input:** User request and the project's files.
- **Stop Condition:** Ask one question when the target cannot be inferred from the request or the codebase.
- **Validation:** Target platform and toolkit recorded before Step 1.

### Step 1: Fix the Scope

- **Action:** Resolve the file list from the given paths or glob. Keep markup, style, and component files; drop tests, stories, generated output, and vendored code. Detect the stack from file extensions and imports.
- **Input:** Paths or glob from the user.
- **Stop Condition:** Halt and ask which files to lint when no path is given. Halt when the resolved list exceeds 60 files and ask the user to narrow it or approve batches.
- **Validation:** File list and stack recorded before any rule is applied.

### Step 2: Load the Catalogue

- **Action:** Read `../../references/audit/ui-code-linter-rules.md`. Enable Section 11 only for stacks that hydrate server markup. For native and desktop toolkits (SwiftUI, Compose, Flutter, React Native, WinUI, WPF, Avalonia, JavaFX), enable Section 12 and apply Sections 1 to 10 only where the same defect exists in that toolkit. Skip sections with no matching surface (no forms means no FRM rules).
- **Input:** Stack from Step 1.
- **Stop Condition:** Halt if the catalogue cannot be read. Do not lint from memory.
- **Validation:** Active section list recorded.

### Step 3: Scan and Collect Evidence

- **Action:** Read each file in full. For every active rule, record a finding only when a specific line shows the defect. When a rule depends on a second file (a label defined elsewhere, a global reduced-motion block, a root layout meta tag), read that file before deciding.
- **Input:** File list and active rules.
- **Stop Condition:** Halt on a rule that cannot be confirmed from source. Report it under "Needs runtime check" instead of guessing.
- **Validation:** Each finding holds file, line, rule ID, and severity.

### Step 4: Report and Hand Back

- **Action:** Emit the report in the Section 4 format. Order files by highest severity found. Within a file, order by line. State the tally and the verdict.
- **Input:** Findings from Step 3.
- **Stop Condition:** Stop after the report. Apply no edits. Offer the fix route only when the user asks.
- **Validation:** Every scoped file appears once, as findings or as a pass.

## 4. Output Specification

```text
# Interface Compliance Report

Scope: 3 files, stack React with server rendering
Verdict: FAIL (1 Blocker, 2 Major, 1 Minor)

## src/checkout/PaymentForm.tsx
src/checkout/PaymentForm.tsx:41  FRM-03 Blocker  paste cancelled on card field -> remove the paste listener
src/checkout/PaymentForm.tsx:58  FRM-02 Major    card number uses type="text" -> add inputmode="numeric"
src/checkout/PaymentForm.tsx:90  TXT-08 Minor    "Saving..." -> use the ellipsis character

## src/checkout/Summary.tsx
src/checkout/Summary.tsx:17  MED-01 Major  product image has no width or height

## src/checkout/Totals.tsx
pass

## Needs runtime check
TCH-02 src/checkout/PaymentForm.tsx:72  icon button size depends on computed padding
```

Verdict rules: any Blocker gives FAIL. No Blocker and at least one Major gives REVIEW. Otherwise PASS.

## 5. Validation Gate

- [ ] Target platform and toolkit recorded (Step 0).
- [ ] Scope and stack recorded before scanning.
- [ ] Catalogue loaded from `../../references/audit/ui-code-linter-rules.md`.
- [ ] Every finding has file, line, rule ID, and severity.
- [ ] Rules that need a browser are listed under "Needs runtime check", not asserted.
- [ ] Every scoped file reported once.
- [ ] No file modified.
- [ ] Zero em dashes in deliverable.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Reporting "looks accessible" with no rule IDs, or skipping files past the first few.
- **Over-execution threshold:** Rewriting components, critiquing colour and layout taste, or flagging rules from sections with no matching surface.
- **Calibration default:** Report what a line proves. When evidence is partial, move the item to "Needs runtime check".

## 7. Anti-Pattern Compliance

| Step | Prevents AP                  | Mechanism                                               |
| ---- | ---------------------------- | ------------------------------------------------------- |
| 1    | AP-1 (vague task)            | Demands an explicit file list before any rule runs.     |
| 1    | AP-26 (no scope boundary)    | Caps a run at 60 files and drops non-UI files.          |
| 3    | AP-18 (unstructured output)  | Requires file, line, rule ID, and severity per finding. |
| 4    | AP-4 (over-permissive agent) | Read-only pass; fixes route to a separate skill.        |
| 4    | AP-28 (no stop condition)    | Stops after the report with a three-state verdict.      |

## 8. Versioning & Changelog

- **Version:** 1.3.0
- **Changelog:**
  - `1.3.0` : Added hard-coded layout rules (TCH-12 to TCH-14). Catalogue now holds 105 rules.
  - `1.2.0` : Added Step 0 so the skill adapts to web, mobile, desktop, and business-system targets.
  - `1.1.0` : Added native and desktop rules (Section 12). Catalogue now holds 102 rules across 12 sections.
  - `1.0.0` (2026-10-10) - Initial Tier-5 release with an 86-rule catalogue across 11 sections, 46 defined locally and 40 indexed from existing references.

## 9. Portability Matrix

| Runtime     | Status   | Notes                                     |
| ----------- | -------- | ----------------------------------------- |
| Claude Code | untested | Slash command with path or glob argument. |
| Cursor      | untested | Rules and prompt loading.                 |
| Copilot     | untested | Custom instructions support.              |
| Windsurf    | untested | Cascade flow integration.                 |
| Kiro        | untested | Steering model execution.                 |
| Cline       | untested | Task step-by-step flow.                   |
| Raw API     | untested | Catalogue and files passed in the prompt. |

## 10. Examples

**Input:** "/ui-code-linter src/checkout/\*.tsx"
**Output:** The Section 4 report: three files scanned, findings anchored to lines with rule IDs, one runtime-only item listed apart, verdict FAIL.

**Failure case:** The user asks "make this form accessible" and the agent returns a lint report with no fixes. That request wants changes, so route it to `component-audit-and-fix` and offer this linter as the check that runs afterwards.
