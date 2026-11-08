---
name: folder-structure-advisor
description: Propose a project folder structure from approved domain context, stack, product stage, team ownership, and app surfaces. Writes a decision proposal only. Excludes application scaffolding, file moves, and infrastructure provisioning.
department: architecture
ownerAgent: aragorn
triggerCommand: /folder-structure-advisor
antiPatternsPrevented:
  - AP-1
  - AP-3
  - AP-6
  - AP-26
  - AP-28
  - AP-44
  - AP-45
---

# Folder Structure Advisor

## 0. Identity

- **Role:** System Architect. Owns proposed project shape, dependency boundaries, and recorded trade-offs. Hands implementation and file moves to the approved execution workflow.
- **Role source:** Appendix A of skills/\_template/skill-name/SKILL.md (System Architect).
- **Authority:** Tier-5 architecture workflow. Writes only the folder-structure.md proposal inside the named project's existing context directory.
- **Must not define:** Application implementation, database schemas, deployment resources, or migration execution.
- **Normative base:** core/fellowship/aragorn.md, rules/engineering/architecture-boundaries.md, references/anti-patterns.md, and the project's own agent guides and approved context.
- **Judgment:** Prefer the smallest layout which expresses current ownership and dependency rules. Record why alternatives lose. Reject speculative layers and empty placeholder folders.
- **Anti-pattern gate:** Require a named project, explicit evidence, one output path, reviewable choices, and a stop condition.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                         |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Task             | Produce an evidence-backed folder proposal after domain or enterprise context definition.                     |
| 2   | Target Tool      | Any agent runtime with Markdown reading and scoped document writing.                                          |
| 3   | Output Format    | projects/<project-name>/context/core-domains/folder-structure.md.                                             |
| 4   | Constraints      | Proposal only. No application directories, source files, file moves, or empty placeholders.                   |
| 5   | Input            | Approved context, stack, product stage, team size/ownership, app surfaces, and domain language.               |
| 6   | Context          | Align project shape with current complexity without imposing a framework by habit.                            |
| 7   | Audience         | Project owners, architects, and the agents who later implement an approved plan.                              |
| 8   | Success Criteria | Chosen pattern, alternatives, annotated tree, dependency rules, and brownfield migration path are reviewable. |
| 9   | Examples         | Section 10 contains greenfield and brownfield examples.                                                       |

## 2. Trigger Matrix

| Trigger                                                 | Fire? | Action                                                                     |
| ------------------------------------------------------- | ----- | -------------------------------------------------------------------------- |
| /folder-structure-advisor                               | YES   | Build a proposal from the named project context.                           |
| End of define-core-domains or define-enterprise-context | YES   | Automatically run the final proposal step with the already gathered facts. |
| Choose a folder layout for an approved product          | YES   | Compare patterns using the decision inputs.                                |
| Move these files now                                    | NO    | Route to skills/workflow/repo-reorganizer/SKILL.md after approval.         |
| Generate the application or create src/                 | NO    | Route to the implementation workflow after context review.                 |
| Specify an API or database schema                       | NO    | Route to the matching domain skill.                                        |

## 3. Execution Workflow

### Step 1: Lock the proposal boundary

- **Action:** Resolve one project name and the exact output path. Read its local agent guides before choosing names or public entry points.
- **Input:** Existing projects/<project-name>/context/core-domains/ and any approved context under projects/<project-name>/context/software-engineering/.
- **Stop Condition:** If the project or output parent is missing, return the expected path to the caller. This skill does not create directories. The parent context workflow prepares its approved documentation container first.
- **Validation:** Only folder-structure.md is writable. Reject traversal and paths outside the named project's context. Preserve any existing proposal through a reviewed, backed update.

### Step 2: Read the smallest relevant context set

- **Action:** Read product-requirements.md, system-architecture.md, glossary.md, engineering-rules.md, and task-backlog.md when present. For enterprise context, read the relevant architecture, decisions, frontend/mobile, and development specifications instead of all domain folders.
- **Input:** Record the stack and its actual constraints, product stage, team size with owners, app surfaces, and domain language. Cite the source path or confirmed answer for each input.
- **Stop Condition:** Ask one narrow clarification if a missing fact changes the pattern choice. Keep non-blocking unknowns visible. Never infer a large team, independent release needs, or multiple apps from a framework name.
- **Validation:** Inspect only named manifests and a bounded top-level layout for a brownfield project. Do not scan the whole repository to fill a matrix.

### Step 3: Compare patterns and choose one

- **Action:** First check [the industry-standard layouts](references/industry-standards.md). When the stack has an official or tool-enforced layout, keep it as the base and cite its source. Then apply [the decision matrix](references/decision-matrix.md) inside that base. Compare at least the chosen pattern and two credible alternatives, or state why only one fits a hard project constraint.
- **Input:** Current evidence, ownership boundaries, expected change paths, and project-specific constraints.
- **Stop Condition:** Resolve conflicts with approved architecture before writing. Record an open decision rather than inventing a requirement.
- **Validation:** A primary pattern is named. Any hybrid or add-on has a concrete reason. State what future change would justify revisiting the decision.

### Step 4: Draft the tree and dependency rules

- **Action:** Use [the proposal template](references/proposal-template.md). Start from the matching tree in [the sample structures](references/sample-structures.md), then cut it down to the project's evidence. Mark the tree as text only. Explain the purpose, owner, and first real file for each proposed directory. Omit directories with no current responsibility.
- **Input:** The chosen pattern, existing conventions, use cases, and confirmed app surfaces.
- **Stop Condition:** Do not create any proposed application folders or files. Do not introduce barrel files or index.ts when the project forbids them.
- **Validation:** Respect [clean-architecture](../clean-architecture/SKILL.md), [monorepo-architecture](../monorepo-architecture/SKILL.md), and [module-organization](../module-organization/SKILL.md). Dependency direction points inward where the project uses domain layers. Public module APIs use explicit contract modules or allowed package exports, never an assumed barrel convention.

### Step 5: Record adoption and hand off

- **Action:** For brownfield projects, include an incremental old-to-new mapping, dependency/import checks, tests, checkpoints, and rollback. Route actual moves to skills/workflow/repo-reorganizer/SKILL.md. For greenfield projects, list the first implementation slice and defer unused layers.
- **Input:** Existing paths, verified behavior, and the proposal.
- **Stop Condition:** Stop after writing and validating the proposal. Human review precedes implementation or migration. Existing authorization to generate context permits this proposal, not application changes.
- **Validation:** Return the single proposal path, primary decision, rejected alternatives, and open questions to the caller's final review. Do not demand a second approval merely to run this already authorized proposal step.

## 4. Output Specification

Write one document at projects/<project-name>/context/core-domains/folder-structure.md using references/proposal-template.md.

The document contains:

- Input evidence and unknowns for product stage, team ownership, app surfaces, domain language, and stack.
- The chosen pattern, rejected alternatives, reasons, and a revisit trigger.
- An annotated textual tree with file purposes, ownership, and dependency directions.
- Shared types and configuration placement only where needed.
- A brownfield migration path with old/new mappings, checks, and rollback, or a first greenfield slice.
- Open decisions, validation results, and a human review status.

## 5. Validation Gate

- [ ] The output is the single project-scoped folder-structure.md proposal.
- [ ] Required inputs trace to confirmed context or explicit unknowns.
- [ ] Pattern comparison records reasons and rejected alternatives.
- [ ] Every proposed directory owns a current responsibility and a first concrete file.
- [ ] Dependency rules, public APIs, no-empty-folder policy, and project barrel-file rules hold.
- [ ] The advisor creates no application source, folders, package manifests, or migrations.
- [ ] Brownfield adoption includes import checks, tests, checkpoints, rollback, and the repo-reorganizer handoff.
- [ ] The caller presents the proposal for human review before implementation.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** A generic tree with no input evidence, owners, rejected alternatives, or migration path.
- **Over-execution threshold:** Moving files, creating src/, generating packages, or treating team size as sufficient evidence for microservices.
- **Calibration default:** Start with the smallest structure serving the current product and team. More folders require a current boundary or change-path reason.

## 7. Anti-Pattern Compliance

| Step | Prevents           | Mechanism                                                      |
| ---- | ------------------ | -------------------------------------------------------------- |
| 1    | AP-1, AP-26, AP-44 | One project, one output file, and a locked write boundary.     |
| 2    | AP-3, AP-6         | Evidence precedes layout and speculative complexity stays out. |
| 3    | AP-6               | Alternatives and a revisit trigger expose trade-offs.          |
| 4    | AP-26, AP-28       | Text-only tree and checked dependency directions.              |
| 5    | AP-45              | Reviewable adoption plan before any implementation or move.    |

## 8. Versioning & Changelog

- **Version:** 1.2.0
- **Changelog:**
  - 1.2.0 (2026-11-08) adds industry-standard layouts for 21 stacks and the rule that a tool-enforced layout stays the base.
  - 1.1.0 (2026-11-08) adds sample trees for every pattern, add-on, and platform.
  - 1.0.0 (2026-11-08) adds proposal-only folder advice and automatic context-workflow handoff.

## 9. Portability Matrix

| Runtime                        | Status           | Notes                                                                                         |
| ------------------------------ | ---------------- | --------------------------------------------------------------------------------------------- |
| Claude Code, Codex, Cursor     | instruction-only | Read the skill and references with scoped file tools. Native loading needs a real-tool check. |
| Copilot, Windsurf, Kiro, Cline | instruction-only | The workflow uses Markdown and the project's own context paths.                               |
| Other runtimes or raw API      | instruction-only | Read the inputs and return the proposal text if no file writer is available.                  |

## 10. Examples

### Solo greenfield MVP

**Input:** A solo developer has an approved TypeScript API MVP for orders and payments. One API surface ships first. The team confirms no independent package releases.

**Decision:** Start flat with progressive nesting. Feature modules remain a revisit option when a use case gains several collaborating files. Reject a monorepo because there is one deployable surface and no separate package ownership. Reject a four-layer tree because the current implementation slice does not need those boundaries.

**Output:** projects/orders/context/core-domains/folder-structure.md proposes a text-only tree:

```text
src/
  orders.ts       # Order use cases, one owner
  payments.ts     # Payment adapter boundary
  config.ts       # Validated startup configuration
  main.ts         # Composition entry point
```

The proposal states the first tests and keeps framework-specific code out of domain functions. It creates none of these paths.

### Existing web and mobile product

**Input:** Eight developers maintain a billing product with web, mobile, and an API. Approved context names separate app release paths and a shared billing vocabulary.

**Decision:** Propose monorepo workspaces for the app surfaces and feature modules within each app. A billing contract package is an add-on only if both clients already consume the same contract. Reject a single global components folder because ownership and change paths follow app boundaries. Do not infer microservices from the team size.

**Output:** The proposal maps current billing files to candidate module paths, lists explicit contracts.ts imports or allowed package exports, and records staged import/test checks plus rollback. Actual moves wait for approval and run through repo-reorganizer.
