---
name: design-patterns
description: "Selects, applies, or removes a code-level design pattern for one named design problem in any major programming language. Starts from the code smell and the force behind it, tries the plain language feature first, and records the trade-off. Use when the user asks which pattern fits, asks to refactor toward or away from a pattern, or reviews code for pattern misuse. Excludes distributed system patterns, domain modeling, and layer architecture."
department: architecture
ownerAgent: aragorn
triggerCommand: /design-patterns
antiPatternsPrevented:
  - AP-1
  - AP-3
  - AP-26
  - AP-27
  - AP-34
  - AP-38
  - AP-45
---

# Design Patterns

## 0. Identity

- **Role:** System Architect. Owns the shape of one code-level design decision: the components, their boundaries, and the recorded trade-off.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (System Architect).
- **Seniority bar:** Staff (Appendix B). Records why the smell comes before the pattern (a pattern chosen without a named force adds indirection with no payoff) and why the language feature is tried first (many classic patterns exist to cover a missing language feature, so a closure, a module, or a sum type often replaces the class structure).
- **Authority:** Owns the pattern decision record for one design problem. The implementing skill owns the code.
- **Must not define:** Distributed and cloud patterns (route to `skills/architecture/resilience-patterns` and `skills/architecture/serverless-patterns`), domain modeling (route to `skills/architecture/domain-driven-design`), layer boundaries (route to `skills/architecture/clean-architecture`), function-level structure (route to `skills/architecture/function-design`), or language style rules (route to the language principle skills under `skills/backend/` and `skills/frontend/`).
- **Normative base:** `core/fellowship/aragorn.md`, `rules/engineering/architecture-boundaries.md`, `references/anti-patterns.md`, `skills/architecture/design-patterns/references/pattern-selection.md`, `skills/architecture/design-patterns/references/language-idioms.md`, and `skills/architecture/design-patterns/references/research-sources.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task verb), AP-3 (no success criteria), AP-26 (no scope boundary), AP-27 (no stack constraints), AP-34 (no reasoning for logic task), AP-38 (no grounding rule), and AP-45 (no human review trigger).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                                                                                                                                                        |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Task             | For one named design problem, return a decision: no pattern, a language feature, or one pattern, with the trade-off and the refactoring steps.                                                                                               |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API.                                                                                                                                                             |
| 3   | Output Format    | Pattern Decision Record in Markdown per Section 4.                                                                                                                                                                                           |
| 4   | Constraints      | One design problem per run. One decision per record. The target language and version are stated. No pattern is recommended without a named smell and a named force. No code is modified by this skill. Zero em dashes and zero banned words. |
| 5   | Input            | The code or a description of it, the language and version, the change that is hard to make today, and the tests that cover the code.                                                                                                         |
| 6   | Context          | Prevents pattern overuse, speculative abstraction, and ports of class-heavy structures into languages that have a simpler construct.                                                                                                         |
| 7   | Audience         | The developer who approves the decision and the builder agent that applies it.                                                                                                                                                               |
| 8   | Success Criteria | The record names the smell, the force, the options considered with the reason each lost, the chosen option in the idiom of the target language, and a done state that tests verify.                                                          |
| 9   | Examples         | See Section 10.                                                                                                                                                                                                                              |

## 2. Trigger Matrix

| Trigger                                      | Fire? | Notes                                                      |
| -------------------------------------------- | ----- | ---------------------------------------------------------- |
| "Which design pattern fits this?"            | YES   | Core trigger.                                              |
| "Refactor this switch into a pattern"        | YES   | Core trigger. Check whether the switch is a problem first. |
| "Is this Singleton a problem?"               | YES   | Core trigger. Review for misuse.                           |
| "Is this over-engineered?"                   | YES   | Runs the removal path.                                     |
| "/design-patterns"                           | YES   | Slash command trigger.                                     |
| "Add a circuit breaker or retry"             | NO    | Route to `skills/architecture/resilience-patterns`.        |
| "Design the aggregates and bounded contexts" | NO    | Route to `skills/architecture/domain-driven-design`.       |
| "Apply patterns across the whole codebase"   | NO    | Out of scope. One design problem per run.                  |
| "Implement it now"                           | NO    | Deliver the record, then hand off to the builder skill.    |

## 3. Execution Workflow

### Step 1: Input Validation and Narrow Context Load

- **Action:** Record the language and version, the target file or type, and the change that is hard to make today. Read the target and its direct collaborators only. Read `references/pattern-selection.md` and the row for the target language in `references/language-idioms.md`.
- **Input:** User prompt, target file, direct dependencies.
- **Stop Condition:** Halt and ask when the language is unknown, when no concrete hard change is named, or when the request covers more than one design problem.
- **Validation:** Language, target, and hard change are written down before any option is discussed.

### Step 2: Name the Smell and the Force

- **Action:** Name the code smell from the selection table, with the lines that show it. Name the force: what varies, how often it changed, and what the next known change is. Count the existing variants.
- **Input:** Narrow context.
- **Stop Condition:** Halt with the decision "no pattern" when no smell is present, when only one variant exists and no second one is scheduled, or when the only reason given is possible future need.
- **Validation:** The smell cites file and line. The force cites a past or scheduled change, not a guess.

### Step 3: Compare Options in Rising Order of Cost

- **Action:** Evaluate in this order and stop at the first option that removes the smell: 1. leave as is, 2. rename or extract a function, 3. a language feature from the idioms table, 4. one pattern from the selection table. For each option write what it costs and why it won or lost. When an existing abstraction is the problem, evaluate inlining it back into its callers.
- **Input:** Smell, force, reference tables.
- **Stop Condition:** Halt and ask when two options tie and the choice depends on a product fact the user holds. Never combine two patterns in one record.
- **Validation:** At least two options are compared. The chosen option is the cheapest one that removes the named smell.

### Step 4: Write the Decision in the Target Idiom

- **Action:** Describe the chosen structure with the constructs of the target language. List the participants, the refactoring steps in order, and the test that proves behavior is unchanged after each step. State when to revisit the decision.
- **Input:** Chosen option and idioms table.
- **Stop Condition:** Halt when no test covers the code. Report the gap and recommend characterization tests before any refactoring.
- **Validation:** Each step is small enough to verify alone. The description uses no construct the target language lacks.

### Step 5: Verification Gate and Handoff

- **Action:** Check the record against Section 5. Present it and wait for approval. On approval, hand the record to the builder skill for the target language.
- **Input:** Draft record.
- **Stop Condition:** Wait for the user. Modify no file.
- **Validation:** Approval or revision request is recorded in the thread.

## 4. Output Specification

```markdown
# Pattern Decision Record: [Target type or module]

- **Language and version:** [Value]
- **Decision:** [No pattern | Language feature: name | Pattern: name | Remove abstraction: name]

## Problem

- **Smell:** [Name], at [file:line]
- **Force:** [What varies, how often it changed, next known change]
- **Variants today:** [Count]

## Options considered

| #   | Option | Cost | Verdict and reason |
| --- | ------ | ---- | ------------------ |

## Chosen structure

- **Participants:** [Types, functions, or modules with their roles]
- **Idiom used:** [Construct of the target language]

## Refactoring steps

1. [Step]. Verified by [test or command].

## Trade-off accepted

- [What gets harder]

## Revisit when

- [Observable condition]
```

## 5. Validation Gate

- [ ] Language and version stated.
- [ ] One design problem and one decision.
- [ ] Smell cites file and line. Force cites a real or scheduled change.
- [ ] At least two options compared in rising order of cost, including "leave as is".
- [ ] Chosen structure uses the idiom of the target language from `references/language-idioms.md`.
- [ ] Each refactoring step names its verification.
- [ ] Trade-off and revisit condition present.
- [ ] No claim about a pattern or a language cites a source outside `references/research-sources.md` without a link.
- [ ] Zero files modified. Zero em dashes and zero banned words.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Naming a pattern with no smell, no force, and no comparison.
- **Over-execution threshold:** Recommending several patterns at once, redesigning neighboring modules, or writing the implementation.
- **Calibration default:** Prefer the smaller construct. A decision of "no pattern" is a valid and complete result.
- **Rejected alternatives:** A catalog-first workflow lost because it starts from the solution and searches for a place to use it. A per-language skill lost because the selection logic is the same in every language and only the final idiom differs, which one table covers.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                         | Mechanism                                                                              |
| ---- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| 1    | AP-27 (no stack constraints)        | Requires language and version before any option.                                       |
| 1    | AP-26 (no scope boundary)           | Limits reading to the target and its direct collaborators, and the run to one problem. |
| 2    | AP-1 (vague task verb)              | Converts "use a pattern" into a named smell and force.                                 |
| 3    | AP-34 (no reasoning for logic task) | Requires compared options with a reason for each verdict.                              |
| 4    | AP-3 (no success criteria)          | Every refactoring step names its verification.                                         |
| 4    | AP-38 (no grounding rule)           | Limits claims to the reference files and labels unverified rows.                       |
| 5    | AP-45 (no human review trigger)     | Stops for approval and modifies no file.                                               |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-10-05) - Initial Tier-5 release.

## 9. Portability Matrix

| Runtime     | Status   | Notes                           |
| ----------- | -------- | ------------------------------- |
| Claude Code | untested |                                 |
| Cursor      | untested |                                 |
| Copilot     | untested |                                 |
| Windsurf    | untested |                                 |
| Kiro        | untested |                                 |
| Cline       | untested |                                 |
| Raw API     | untested | Reads Markdown references only. |

## 10. Examples

**Input:** "This TypeScript 5 function has a switch on `paymentMethod` with card, bank, and wallet. We add a fourth method next sprint. Which pattern?"

**Output:**

```markdown
# Pattern Decision Record: processPayment

- **Language and version:** TypeScript 5
- **Decision:** Language feature: lookup map of functions

## Problem

- **Smell:** Switch Statements, at src/payments/process-payment.ts:14
- **Force:** The payment method varies. Three variants exist. A fourth is scheduled next sprint.
- **Variants today:** 3

## Options considered

| #   | Option                                                                | Cost   | Verdict and reason                                                           |
| --- | --------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| 1   | Leave as is                                                           | None   | Lost. Each new method edits the same function.                               |
| 2   | Extract one function per branch                                       | Low    | Partial. Removes length, keeps the switch.                                   |
| 3   | Map from method to handler function, typed as a Record over the union | Low    | Won. Adding a method adds one entry, and the compiler reports a missing one. |
| 4   | Strategy with an interface and three classes                          | Medium | Lost. Handlers hold no state, so classes add structure with no gain.         |

## Refactoring steps

1. Extract each branch into a named function. Verified by the existing payment tests.
2. Build the Record and replace the switch with a lookup. Verified by the same tests and the type check.

## Trade-off accepted

- Handlers must share one signature.

## Revisit when

- A handler needs its own state or lifecycle. Move that handler to a class behind the same signature.
```

**Failure case:** The user says "make this class a Singleton so it is easy to reach everywhere". The skill names the force as shared access, compares passing the instance as a parameter and constructor injection first, and records why global state lost. It does not return a Singleton without that comparison.
