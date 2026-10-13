---
name: brainstorming
description: "Use when the user asks to build, add, or redesign a feature, component, or system and the requirements are not yet agreed, including when the user says to start coding right away. Sizes the work, asks the questions that decide the design, and gets approval before any code. Excludes typo fixes and work that already has an approved spec."
department: workflow
ownerAgent: frodo
triggerCommand: /brainstorming
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
---

# Socratic Brainstorming & Specification Generator

## 0. Identity

- **Role:** Product & System Architect Specialist.
- **Prime rule:** No implementation action before the user approves a design sized to the work.
- **Authority:** Directs feature design, requirements gathering, and design specification creation.
- **Must not define:** Production code implementation or test writing, hands off to `writing-plans.md`.
- **Normative base:** `core/fellowship/frodo.md`, `rules/languages/typescript-strict.md`, `rules/common/code-style-standards.md`, `rules/engineering/architecture-boundaries.md`, `rules/engineering/defensive-programming.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-4 (over-permissive agent), AP-6 (build-the-whole-thing), AP-26 (no scope boundary), and AP-45 (no human review trigger).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                               |
| --- | ---------------- | ----------------------------------------------------------------------------------- |
| 1   | Task             | Refine rough ideas into approved design specs using Socratic questioning.           |
| 2   | Target Tool      | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, or raw API. |
| 3   | Output Format    | Design document saved to `docs/specs/YYYY-MM-DD-<topic>-design.md`.     |
| 4   | Constraints      | No code execution or file scaffolding until design spec is approved by user.        |
| 5   | Input            | User feature request, bug architectural goal, or component idea.                    |
| 6   | Context          | Prevents writing code based on ambiguous or incomplete requirements.                |
| 7   | Audience         | Product managers, developers, and downstream planning skills.                       |
| 8   | Success Criteria | Approved design specification written to `docs/specs/`.                 |
| 9   | Examples         | See Section 10.                                                                     |

## 2. Trigger Matrix

| Trigger                                              | Fire? | Notes                          |
| ---------------------------------------------------- | ----- | ------------------------------ |
| New feature request or architectural redesign        | YES   | Core trigger.                  |
| Building new components or modifying system behavior | YES   | Core trigger.                  |
| Single-line typo fix or bug with clear fix           | NO    | Skip design phase.             |
| Task already has an approved design spec             | NO    | Proceed to `writing-plans.md`. |

### 2.1 Tracks

Size the work before Step 2. State the track to the user in one line.

| Track | Use when | Steps that apply | Gate before implementation |
| ----- | -------- | ---------------- | -------------------------- |
| Probe | The question is whether something is feasible | Step 1, then a probe plan of two or three sentences | User approves the probe plan. The result is a recommendation, not shipped code. |
| Patch | A bounded change inside existing code | Steps 1 to 3, with the design kept in chat | User approves the in-chat design. No spec document is written. |
| Blueprint | A new system, a new component set, or a restructuring | Steps 1 to 4 | User approves each section and the written spec. Then hand off to `writing-plans` only. |

When unsure between two tracks, choose the larger one.

## 3. Execution Workflow

### Step 1: Autonomous Reconnaissance

- **Action:** Inspect codebase, existing architecture, and dependencies.
- **Input:** Local repository files.
- **Stop Condition:** None.
- **Validation:** Existing patterns and file structure identified.

### Step 2: Socratic Investigation

- **Action:** Ask clarifying questions one at a time. Present clear trade-offs.
- **Input:** User responses.
- **Stop Condition:** Stop after each question and wait for user reply.
- **Validation:** Key requirements and constraints documented.

### Step 3: Incremental Design Draft

- **Action:** Present design spec in digestible sections (200-300 words).
- **Input:** Requirements gathered.
- **Stop Condition:** Stop after each section for user validation.
- **Validation:** Every section validated by user.

### Step 4: Write Specification Document

- **Action:** Save complete design spec to `docs/specs/YYYY-MM-DD-<topic>-design.md`.
- **Input:** Approved design sections.
- **Stop Condition:** Halts if user rejects final draft.
- **Validation:** File exists on disk and links to `writing-plans.md`.

## 4. Output Specification

Design spec document template (`docs/specs/YYYY-MM-DD-<topic>-design.md`):

```markdown
# Design Specification: [Feature Name]

## 1. Overview & Goals

[Summary of target feature and business outcome.]

## 2. Architecture & Interfaces

[System design, data flow, API contracts.]

## 3. Technical Constraints

[Stack constraints, security rules, performance bounds.]

## 4. Verification Plan

[Test criteria and acceptance validation steps.]
```

## 5. Validation Gate

- [ ] No implementation code written during design session.
- [ ] Questions asked one at a time.
- [ ] User approved design specification before saving.
- [ ] Design document saved to `docs/specs/`.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Skipping design causes architectural drift and bloated rewrites.
- **Over-execution threshold:** Running full design ceremony for one-line variable renames.
- **Calibration default:** Mandatory for new features, components, and schema changes.

### 6.1 Bypass Excuses

Source: pressure run on 2026-10-05.

| Excuse | Why it fails | Required action |
| ------ | ------------ | --------------- |
| "The user said they trust me and wants to see code now. Sensible defaults show momentum and are easy to refactor." | Three unknowns here decide the architecture. A wrong default costs hours of rework, and the questions cost minutes. | Ask only the questions that change the design. Present the short design. Wait for approval. |
| "A thorough design document shows professionalism and prevents rework." | A long document written without answers encodes guesses at length. | Pick the track first. A Patch needs a few lines in chat, not a document. |

## 7. Anti-Pattern Compliance

| Step         | Prevents AP              | Mechanism                                  |
| ------------ | ------------------------ | ------------------------------------------ |
| 2 (Socratic) | AP-1 (vague task)        | Clarifies intent before drafting.          |
| 3 (Draft)    | AP-45 (no human review)  | Requires section-by-section approval.      |
| 4 (Save)     | AP-6 (build-whole-thing) | Decouples design spec from implementation. |

## 8. Versioning & Changelog

- **Version:** 1.1.0
- **Changelog:**
  - `1.1.0` (2026-10-05) - Added Prime rule and Section 6.1 Bypass Excuses from a recorded pressure run. Description now states when to use the skill.
  - `1.0.0` : Enterprise standard Tier-5 creation.

## 9. Portability Matrix

| Runtime     | Status   | Notes                            |
| ----------- | -------- | -------------------------------- |
| Claude Code | verified | Interactive questioning.         |
| Cursor      | verified | Standard chat mode.              |
| Copilot     | verified | Interactive mode.                |
| Windsurf    | verified | Cascade chat.                    |
| Kiro        | verified | Interaction mode.                |
| Cline       | verified | Task execution mode.             |
| Raw API     | verified | Model-agnostic design generator. |

## 10. Examples

**Input:** "Add a user search feature with filters."
**Output:** Approved spec at `docs/specs/2026-08-14-user-search-design.md`.
