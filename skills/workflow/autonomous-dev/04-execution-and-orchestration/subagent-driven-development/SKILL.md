---
name: subagent-driven-development
description: "Use when an approved plan has mostly independent tasks and subagents are available, to run each task in a fresh context with a separate review before it counts as complete. Excludes plans with tightly coupled tasks and runtimes with no subagent tool."
department: workflow
ownerAgent: frodo
triggerCommand: /subagent-driven-development
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
---

# Subagent-Driven Development Orchestration Protocol

## 0. Identity

- **Role:** Autonomous Subagent Multi-Agent Orchestrator.
- **Prime rule:** No task is complete until a separate reviewer approves both spec compliance and code quality.
- **Authority:** Controls dispatching fresh-context implementer subagents and reviewer subagents.
- **Must not define:** Direct production code edits within orchestrator context, delegates to subagents.
- **Normative base:** `core/fellowship/frodo.md`, `rules/languages/typescript-strict.md`, `rules/common/code-style-standards.md`, `rules/engineering/architecture-boundaries.md`, `rules/engineering/defensive-programming.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1, AP-2, AP-3, AP-4, AP-26, AP-28, AP-44, and AP-45.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                      |
| --- | ---------------- | ------------------------------------------------------------------------------------------ |
| 1   | Task             | Execute plan tasks using fresh-context implementers and two-stage reviewer subagents.      |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, or raw API.        |
| 3   | Output Format    | Tested code changes with completed plan checklist updates.                                 |
| 4   | Constraints      | Implementers must operate in fresh context. Reviewers must evaluate Spec and Code Quality. |
| 5   | Input            | Implementation plan path from `docs/plans/`.                                   |
| 6   | Context          | Prevents context degradation, dirtying main context, and unreviewed changes.               |
| 7   | Audience         | Developers and autonomous multi-agent execution systems.                                   |
| 8   | Success Criteria | All plan tasks implemented, reviewed, and verified by passing test suite.                  |
| 9   | Examples         | See Section 10.                                                                            |

## 2. Trigger Matrix

| Trigger                                                  | Fire? | Notes                         |
| -------------------------------------------------------- | ----- | ----------------------------- |
| Implementation plan ready in `docs/plans/`   | YES   | Core trigger.                 |
| User requests autonomous plan execution with subagents   | YES   | Core trigger.                 |
| Single small task best suited for direct batch execution | NO    | Use `executing-plans.md`.     |
| No implementation plan exists                            | NO    | Run `writing-plans.md` first. |

## 3. Execution Workflow

### Step 1: Initialize Orchestration Session

- **Action:** Load implementation plan. Verify clean git status and passing baseline tests.
- **Input:** Plan file path.
- **Stop Condition:** Halt if baseline tests fail.
- **Validation:** Plan tasks identified and baseline verified.

### Step 2: Dispatch Implementer Subagent

- **Action:** Spawn fresh-context implementer subagent with task prompt template (`skills/workflow/autonomous-dev/references/builder-brief.md`).
- **Input:** Task details, target file paths, and test requirements.
- **Stop Condition:** If implementer fails task, retry once or halt for user review.
- **Validation:** Implementer returns deliverable report and updated diff.

### Step 3: Dispatch Skeptical Reviewer Subagent

- **Action:** Spawn fresh-context reviewer subagent with reviewer prompt (`skills/workflow/autonomous-dev/references/task-review-brief.md`).
- **Input:** Task brief and git diff.
- **Stop Condition:** If reviewer returns REJECTED status, send feedback to implementer.
- **Validation:** Reviewer returns APPROVED status for both Spec Compliance and Code Quality.

### Step 4: Mark Completed & Proceed

- **Action:** Update plan checkbox (`[x]`). Commit task changes to git.
- **Input:** Approved task diff.
- **Stop Condition:** Halts after each task batch if human review requested.
- **Validation:** Task marked complete and clean commit created.

### Step 5: Fix Loop Cap

- **Action:** When the reviewer rejects a task, return the findings to the builder and recheck only the changed lines with `skills/workflow/autonomous-dev/references/recheck-brief.md`. Count the rounds per task.
- **Input:** Reviewer findings and the fix diff.
- **Stop Condition:** After three rejected rounds on one task, stop. Report the task, the open findings, and the three attempts to the user. Never fix findings in the coordinating session (AP-48, AP-52).
- **Validation:** Round count recorded per task.

## 4. Output Specification

```json
{
  "orchestration_status": "COMPLETED",
  "tasks_executed": 4,
  "tasks_approved": 4,
  "commits_created": 4,
  "final_test_status": "PASSED"
}
```

## 5. Validation Gate

- [ ] Every task implemented in a fresh subagent context.
- [ ] Spec compliance verified before code quality evaluation.
- [ ] Zero un-reviewed commits pushed to target branch.
- [ ] Full test suite passes at workflow completion.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Running all tasks in single long context window leads to degradation.
- **Over-execution threshold:** Spawning subagents for minor single-line typo edits.
- **Calibration default:** Standard execution path for complex multi-task feature plans.

### 6.1 Bypass Excuses

Source: pressure run on 2026-10-05.

| Excuse | Why it fails | Required action |
| ------ | ------------ | --------------- |
| "Tests pass is our gate. Review happens while task 5 runs. Parallel work beats sequential gatekeeping when we are behind." | Passing tests show the code runs, not that it matches the spec. Task 5 then builds on unreviewed work, and a rejection forces both to be redone. | Dispatch the review now. Start task 5 after approval. |
| "I can skim the diff and patch minor issues right now. Formal review is overhead when time is short." | The coordinating session loses its clean context, and the author of the patch reviews their own work. | Keep the coordinator out of the code. Send findings back to the builder. |

## 7. Anti-Pattern Compliance

| Step | Prevents AP              | Mechanism                                             |
| ---- | ------------------------ | ----------------------------------------------------- |
| 2    | AP-2 (context pollution) | Spawns fresh context subagents for each task.         |
| 3    | AP-45 (no human review)  | Evaluates spec compliance and quality before merging. |
| 4    | AP-9 (no verification)   | Re-runs full test suite before updating checklist.    |

## 8. Versioning & Changelog

- **Version:** 1.1.0
- **Changelog:**
  - `1.1.0` (2026-10-05) - Added Prime rule and Section 6.1 Bypass Excuses from a recorded pressure run. Description now states when to use the skill.
  - `1.0.0` : Enterprise standard Tier-5 creation.

## 9. Portability Matrix

| Runtime     | Status   | Notes                              |
| ----------- | -------- | ---------------------------------- |
| Claude Code | verified | Native subagent tool invocation.   |
| Cursor      | verified | Agent subprocess support.          |
| Copilot     | verified | Agent subprocess support.          |
| Windsurf    | verified | Cascade execution.                 |
| Kiro        | verified | Agent tool support.                |
| Cline       | verified | Sub-task runner.                   |
| Raw API     | verified | Model-agnostic multi-agent runner. |

## 10. Examples

**Input:** "Execute plan docs/plans/2026-08-14-user-search.md using subagents."
**Output:** All tasks executed, reviewed, and committed with green test suite.
