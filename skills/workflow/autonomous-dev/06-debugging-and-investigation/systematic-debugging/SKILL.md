---
name: systematic-debugging
description: "Use when a test fails, a crash or error appears, behavior is wrong or flaky, or a fix did not work, before proposing any fix. Requires reproduction, isolation, and a tested hypothesis, and stops after three failed fixes. Excludes known one-line typos with an obvious cause."
department: workflow
ownerAgent: frodo
triggerCommand: /systematic-debugging
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
---

# Systematic Debugging & Root Cause Analysis Engine

## 0. Identity

- **Role:** Root Cause Investigation & Debugging Specialist.
- **Prime rule:** No fix before the root cause is shown. Three failed fixes end fixing and reopen investigation.
- **Authority:** Enforces hypothesis-driven debugging and test pollution bisection protocols.
- **Must not define:** Unverified guesses or random trial-and-error code edits.
- **Normative base:** `core/fellowship/frodo.md`, `rules/languages/typescript-strict.md`, `rules/common/code-style-standards.md`, `rules/engineering/architecture-boundaries.md`, `rules/engineering/defensive-programming.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1, AP-4, AP-9, AP-26, AP-28, AP-44, and AP-45.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                   |
| --- | ---------------- | --------------------------------------------------------------------------------------- |
| 1   | Task             | Investigate bugs, test failures, and regressions using systematic 4-phase debugging.    |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, or raw API.     |
| 3   | Output Format    | Minimal reproduction script, isolated root cause analysis, and regression test.         |
| 4   | Constraints      | Must not edit production code until minimal reproduction script is written and fails.   |
| 5   | Input            | Bug description, failing test log, or unexpected behavior report.                       |
| 6   | Context          | Prevents speculative code editing, introducing secondary bugs, and unverified fixes.    |
| 7   | Audience         | Autonomous agents and software engineers.                                               |
| 8   | Success Criteria | Root cause isolated, reproduction test fails initially, fix passes test and full suite. |
| 9   | Examples         | See Section 10.                                                                         |

## 2. Trigger Matrix

| Trigger                                       | Fire? | Notes                                         |
| --------------------------------------------- | ----- | --------------------------------------------- |
| Unexpected test failure, crash, or bug report | YES   | Core trigger.                                 |
| Flaky test or test order pollution failure    | YES   | Core trigger.                                 |
| Feature request with known working code       | NO    | Use `brainstorming.md` or `writing-plans.md`. |
| Implementation task progressing normally      | NO    | Continue TDD cycle.                           |

## 3. Execution Workflow

### Step 1: Minimal Reproduction

- **Action:** Write a minimal automated test or script reproducing the bug deterministically.
- **Input:** Bug report and stack traces.
- **Stop Condition:** Halt if reproduction script cannot reproduce the issue reliably.
- **Validation:** Script fails consistently with target error.

### Step 2: Isolation & Bisection

- **Action:** Trace stack frames backwards or run test bisection (`skills/workflow/autonomous-dev/references/systematic-debugging-tools.md`).
- **Input:** Failing execution trace.
- **Stop Condition:** Halt once exact state divergence line is pinpointed.
- **Validation:** Precise file, line, and state variable identified.

### Step 3: Formulate & Test Hypothesis

- **Action:** State explicit hypothesis for failure mechanism. Test hypothesis using minimal diagnostic edit.
- **Input:** State divergence line.
- **Stop Condition:** If hypothesis test disproves mechanism, reformulate hypothesis before editing code.
- **Validation:** Hypothesis confirmed by diagnostic output.

### Step 4: Targeted Fix & Regression Proof

- **Action:** Apply targeted fix. Verify reproduction test passes and full test suite remains green.
- **Input:** Verified hypothesis.
- **Stop Condition:** Halt if fix causes regressions in external modules.
- **Validation:** Reproduction test passes and complete test runner exits with code 0.

### Step 5: Fix Cap

- **Action:** Count every fix applied for this bug. After the third fix that fails, or that removes one error and reveals another elsewhere, stop fixing. Report the three attempts, what each revealed, and the structural cause they point to. Return to Step 1 or raise the design question with the user.
- **Input:** Fix attempt log.
- **Stop Condition:** Never apply a fourth fix without new evidence from Steps 1 to 3 (AP-48, AP-52).
- **Validation:** Attempt count stated in the report.

## 4. Output Specification

```markdown
# Root Cause Analysis & Resolution

- **Bug Summary:** `TokenValidator throws TypeError on null authorization header`
- **Minimal Reproduction:** `tests/bugs/issue-104.test.ts`
- **Root Cause:** Missing null check on incoming request headers object.
- **Fix Applied:** Added safe navigation check in `src/auth/validator.ts:42`.
- **Regression Verification:** Full test suite passed (52 tests).
```

## 5. Validation Gate

- [ ] Minimal reproduction script created and verified failing before code edit.
- [ ] Root cause state divergence pinpointed to exact file and line number.
- [ ] Explicit hypothesis stated and confirmed before applying permanent fix.
- [ ] Full test suite passes after applying fix.
- [ ] No more than three fix attempts without a return to Step 1.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Applying speculative patches without reproduction introduces secondary bugs.
- **Over-execution threshold:** Running 4-phase bisection for clear syntax errors reported by compiler.
- **Calibration default:** Mandatory for runtime crashes, flaky tests, and logic bugs.

### 6.1 Bypass Excuses

Source: pressure run on 2026-10-05.

| Excuse | Why it fails | Required action |
| ------ | ------------ | --------------- |
| "We are close. One more fix might resolve this, and the manager needs it closed today." | Three fixes that each moved the error to another module show the cause is not where the fixes are. A fourth repeats the pattern (AP-48). | Stop. Report the three attempts and what each revealed. Return to Step 1. |
| "A catch block stops the user-facing error at once while we plan deeper work." | It hides the symptom and leaves corrupted state running in production. | Never suppress an error you have not explained. |

## 7. Anti-Pattern Compliance

| Step | Prevents AP                  | Mechanism                                                     |
| ---- | ---------------------------- | ------------------------------------------------------------- |
| 1    | AP-9 (no verification)       | Enforces deterministic reproduction before editing logic.     |
| 3    | AP-1 (vague task)            | Demands explicit hypothesis formulation and test.             |
| 4    | AP-4 (over-permissive agent) | Validates fix against full test suite to prevent regressions. |

## 8. Versioning & Changelog

- **Version:** 1.1.0
- **Changelog:**
  - `1.1.0` (2026-10-05) - Added Prime rule and Section 6.1 Bypass Excuses from a recorded pressure run. Description now states when to use the skill.
  - `1.0.0` : Enterprise standard Tier-5 creation.

## 9. Portability Matrix

| Runtime     | Status   | Notes                           |
| ----------- | -------- | ------------------------------- |
| Claude Code | verified | Direct terminal execution.      |
| Cursor      | verified | Terminal execution.             |
| Copilot     | verified | Terminal execution.             |
| Windsurf    | verified | Terminal execution.             |
| Kiro        | verified | Execution runner.               |
| Cline       | verified | Execution runner.               |
| Raw API     | verified | Model-agnostic debugging guide. |

## 10. Examples

**Input:** "Debug flaky test failure in user sessions."
**Output:** Test pollution bisected, minimal reproduction created, root cause fixed, test suite green.
