---
name: skill-name
description: "A clear, trigger-optimized sentence describing what this skill does, its department, and explicit exclusions."
department: architecture
ownerAgent: gandalf
triggerCommand: /command-name
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
  - AP-28
---

# [Skill Title]

## 0. Identity

- **Role:** [Defines the skill's explicit operational role and job title]
- **Authority:** [Normative tier level and exact ownership boundaries within Sauron]
- **Must not define:** [Clear boundaries of what this skill does not own; cross-references to other skills/rules]
- **Normative base:** `core/fellowship/[ownerAgent].md`, `rules/engineering/architecture-boundaries.md`, `references/anti-patterns.md`, and applicable project context in `projects/<project-name>/context/`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-3 (no success criteria), AP-26 (no scope boundary), AP-28 (no stop condition), AP-44 (unlocked filesystem), and AP-45 (no human review trigger).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                  |
| --- | ---------------- | -------------------------------------------------------------------------------------- |
| 1   | Task             | [Explicit, measurable task statement]                                                  |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API.       |
| 3   | Output Format    | [Structured deliverable format: Markdown, code diff, JSON, or chat summary]            |
| 4   | Constraints      | [Hard constraints: file bounds, tone, no em dashes, no banned words, zero root sprawl] |
| 5   | Input            | [Required inputs and files]                                                            |
| 6   | Context          | [Anti-patterns prevented and architectural context]                                    |
| 7   | Audience         | [Requesting developer, team leads, downstream fellowship agents]                       |
| 8   | Success Criteria | [Binary, testable verification conditions]                                             |
| 9   | Examples         | See Section 10.                                                                        |

## 2. Trigger Matrix

| Trigger                         | Fire? | Notes                                        |
| ------------------------------- | ----- | -------------------------------------------- |
| "[Exact user prompt trigger 1]" | YES   | Core trigger.                                |
| "[Exact user prompt trigger 2]" | YES   | Core trigger.                                |
| "/[command-name]"               | YES   | Slash command trigger.                       |
| "[Out of scope scenario 1]"     | NO    | Route to `skills/[department]/[other-skill]` |
| "[Out of scope scenario 2]"     | NO    | Out of scope.                                |

## 3. Execution Workflow

### Step 1: Input Validation & Context Discovery

- **Action:** Inspect inputs, verify parameters, and load required context without whole-repo scanning.
- **Input:** User prompt and workspace files.
- **Stop Condition:** Halt and ask user if required inputs are missing or ambiguous.
- **Validation:** Baseline parameters verified before execution begins.

### Step 2: Core Processing & Verification

- **Action:** Execute the specialized skill transformation or analysis.
- **Input:** Validated parameters and loaded context.
- **Stop Condition:** Halt if unexpected state or failure is detected.
- **Validation:** Step deliverables satisfy functional invariants.

### Step 3: Synthesis & Verification Gate

- **Action:** Check deliverable against Section 5 Validation Gate before presenting to user.
- **Input:** Generated artifact.
- **Stop Condition:** If validation checks fail, correct before proceeding.
- **Validation:** All criteria pass.

### Step 4: Handoff & Human Review

- **Action:** Present output summary and request explicit user review where required.
- **Input:** Final verified deliverable.
- **Stop Condition:** Await user command or next action.
- **Validation:** Human approval recorded.

## 4. Output Specification

```markdown
# [Deliverable Title]

- **Target:** [Path or scope]
- **Status:** [Status]
- **Summary:** [Dense, technical summary without conversational filler]
```

## 5. Validation Gate

- [ ] All inputs validated before execution.
- [ ] No uncontained files written outside project-scoped directories (`projects/<project-name>/`).
- [ ] Zero em dashes, banned words, or conversational padding in deliverables.
- [ ] Deliverable conforms strictly to Section 4 format.
- [ ] Explicit user confirmation recorded prior to destructive modifications.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Providing vague, unverified advice without inspecting code or context.
- **Over-execution threshold:** Modifying files outside the declared scope or executing tasks owned by other departments.
- **Calibration default:** Keep changes tightly scoped, deterministic, and traceable to explicit user requests.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                | Mechanism                                                   |
| ---- | -------------------------- | ----------------------------------------------------------- |
| 1    | AP-1 (vague task verb)     | Enforces parameter validation and explicit context loading. |
| 2    | AP-26 (no scope boundary)  | Isolates execution to declared target domain.               |
| 3    | AP-3 (no success criteria) | Enforces deterministic validation gate checks.              |
| 4    | AP-45 (no human review)    | Halts for user confirmation prior to marking task complete. |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-09-21) - Initial enterprise Tier-5 standard release for Sauron.

## 9. Portability Matrix

| Runtime     | Status   | Notes                           |
| ----------- | -------- | ------------------------------- |
| Claude Code | verified | Direct slash command execution. |
| Cursor      | verified | Rules and prompt loading.       |
| Copilot     | verified | Custom instructions support.    |
| Windsurf    | verified | Cascade flow integration.       |
| Kiro        | verified | Steering model execution.       |
| Cline       | verified | Task step-by-step flow.         |
| Raw API     | verified | Model-agnostic execution.       |

## 10. Examples

**Input:** "[Sample user prompt]"
**Output:** [Concrete sample output demonstrating proper agent execution]
