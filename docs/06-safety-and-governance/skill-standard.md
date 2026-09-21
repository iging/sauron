# Enterprise Skill Standard

_Last updated: 2026-09-21 · v1.0.0_

The canonical yardstick for elevating skills to enterprise, production-grade, cross-agent quality in Sauron. Every skill in `skills/` must conform to this standard. `skills/_template/skill-name/SKILL.md` is the executable embodiment of this document.

---

## 1. Role / Authority

- **Role:** Defines the minimum structural and behavioral requirements for every skill in Sauron, and the repeatable pipeline for elevating skills to compliance.
- **Authority:** Normative for all `skills/` content. Supersedes ad-hoc skill formats.
- **Must not define:** Application code standards (see `rules/languages/` and `rules/engineering/`). Fellowship agent roles (see `core/fellowship/`). Project-specific rules (see `projects/<project-name>/context/`).
- **Normative base:** `core/fellowship/gandalf.md`, `rules/engineering/architecture-boundaries.md`, `references/anti-patterns.md`, and `skills/_template/skill-name/SKILL.md`.

---

## 2. Definition: Enterprise-Grade Skill

A skill is enterprise-grade if and only if it satisfies all nine requirements:

| #   | Requirement                          | Evidence in file                                                | Failure mode if missing                                                            |
| :-- | :----------------------------------- | :-------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| 1   | **Explicit ownership boundaries**    | Section 0: Role, Authority, Must not define, Normative base     | Agent drifts into out-of-scope tasks; creates contradictory code (AP-26)           |
| 2   | **Full 9-dimension intent model**    | Section 1: All 9 rows populated with concrete criteria          | Model guesses intent, hallucinates formats, ignores constraints (AP-1, AP-2, AP-6) |
| 3   | **Binary trigger matrix**            | Section 2: Exact triggers + negative triggers                   | False activation or failure to trigger when needed (AP-21)                         |
| 4   | **Deterministic execution workflow** | Section 3: Ordered steps, explicit Stop Conditions              | Runaway execution; agent attempts impossible tasks indefinitely (AP-28)            |
| 5   | **Structured output specification**  | Section 4: Exact deliverable format (Markdown / JSON / diff)    | Output format varies per invocation; downstream tools fail (AP-4, AP-18)           |
| 6   | **Validation gate checklist**        | Section 5: Binary pass/fail checklist                           | Incomplete or broken deliverables accepted without verification (AP-3, AP-43)      |
| 7   | **Anti-pattern compliance audit**    | Section 0 + Section 7: Explicit AP IDs blocked with mechanisms  | Skill encodes anti-patterns it was meant to prevent (all 53 APs)                   |
| 8   | **Anti-trigger calibration**         | Section 6: Explicit under/over-execution thresholds             | Silent over-execution or refusal to act on ambiguous inputs (AP-21, AP-26)         |
| 9   | **Portability matrix**               | Section 9: Compatibility status across major agent environments | Skill relies on IDE-specific behavior; breaks in other runtimes                    |

---

## 3. Structural Specification

Every `SKILL.md` must contain the following frontmatter and sections in exact order:

### 3.1 YAML Frontmatter

```yaml
---
name: skill-name # string (kebab-case only, no brackets)
description: "Single trigger-optimized sentence describing what it does, department, and explicit exclusions." # string
department: architecture # architecture | backend | database | devops | frontend | quality | security | workflow
ownerAgent: gandalf # gandalf | aragorn | legolas | gimli | boromir | frodo | samwise | merry | pippin
triggerCommand: /command-name
antiPatternsPrevented:
  - AP-1
  - AP-6
---
```

### 3.2 Required Sections

| Section # | Header Name                       | Mandatory Content                                                                                            |
| :-------- | :-------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `## 0`    | **Identity**                      | Role, Authority, Must not define, Normative base, Anti-pattern gate checklist                                |
| `## 1`    | **Intent (9 Dimensions)**         | Complete table: Task, Target Tool, Output, Constraints, Input, Context, Audience, Success Criteria, Examples |
| `## 2`    | **Trigger Matrix**                | Positive and negative trigger conditions with target routing                                                 |
| `## 3`    | **Execution Workflow**            | Numbered steps with Action, Input, Stop Condition, and Validation                                            |
| `## 4`    | **Output Specification**          | Concrete deliverable format template (Markdown, code diff, or JSON)                                          |
| `## 5`    | **Validation Gate**               | Binary pass/fail checklist before handoff                                                                    |
| `## 6`    | **Anti-Triggers and Calibration** | Under-execution threshold, over-execution threshold, calibration default                                     |
| `## 7`    | **Anti-Pattern Compliance**       | Mapping table: Step vs AP prevented vs Enforcement mechanism                                                 |
| `## 8`    | **Versioning & Changelog**        | Semantic version, date, and concise summary of changes                                                       |
| `## 9`    | **Portability Matrix**            | Compatibility table: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, Raw API                            |
| `## 10`   | **Examples**                      | Concrete before/after pair or annotated execution flow                                                       |

---

## 4. Skill Elevation Pipeline

When creating or upgrading a skill, execute this 6-stage pipeline:

```
Stage 1: Structural Audit
  ↳ Check YAML frontmatter (kebab-case, department, ownerAgent, triggerCommand).
  ↳ Check presence of all 11 required sections (## 0 through ## 10).

Stage 2: Authority & Domain Isolation
  ↳ Verify Role, Authority, and Must not define boundaries.
  ↳ Verify Normative base paths exist in Sauron (no broken paths, no foreign spec paths).
  ↳ Map owner agent to core/fellowship/[agent].md.

Stage 3: Anti-Pattern Gating
  ↳ Cross-reference against references/anti-patterns.md (53 AP catalogue).
  ↳ Ensure explicit prevention mechanisms exist in Section 0 and Section 7.

Stage 4: Execution Workflow Verification
  ↳ Ensure every step specifies an explicit Stop Condition (prevents AP-28).
  ↳ Ensure validation criteria are binary and testable (prevents AP-3).

Stage 5: Path & Reference Integrity
  ↳ Target project contexts strictly to projects/<project-name>/context/.
  ↳ Cross-skill references must point to existing skills in skills/[dept]/[name]/SKILL.md.
  ↳ Rule references must point to valid rules/ files.

Stage 6: Verification & Test Suite
  ↳ Run npm test to verify zero broken imports or structural validation errors.
```

---

## 5. Department Ownership Mapping

Every skill must be classified under an official department and owned by a fellowship agent:

| Department     | Primary OwnerAgent  | Domain Focus                                                           |
| :------------- | :------------------ | :--------------------------------------------------------------------- |
| `architecture` | `gandalf`           | System design, ADRs, boundaries, module structure                      |
| `backend`      | `aragorn`           | Server logic, API design, database queries, business transactions      |
| `database`     | `gimli`             | Schema migrations, indexing, relational models, query performance      |
| `devops`       | `boromir`           | CI/CD pipelines, Docker, Kubernetes, infrastructure as code            |
| `frontend`     | `legolas`           | UI/UX components, state management, client performance, styling        |
| `quality`      | `merry`             | Automated testing, E2E suites, integration tests, test harnesses       |
| `security`     | `pippin`            | Penetration testing, auth audits, secret hygiene, vulnerability triage |
| `workflow`     | `frodo` / `samwise` | Multi-agent orchestration, repository management, developer loop       |

---

## 6. Prohibited Anti-Patterns

A skill violating any of these patterns fails validation immediately:

- **AP-1 (Vague Task Verb):** Using unbounded verbs like "improve", "clean up", "optimize" without concrete deliverables.
- **AP-6 (Conversational Filler):** Including pleasantries, preambles, or apologetic conversational tone.
- **AP-18 (Unstructured Output):** Outputting conversational summaries instead of the strict deliverable format in Section 4.
- **AP-26 (Scope Creep):** Modifying files or context outside the skill's explicit domain boundaries.
- **AP-28 (No Stop Condition):** Loops or steps that lack a deterministic condition to halt and notify the user.
- **AP-44 (Root Directory Pollution):** Creating files directly in project root instead of structured subdirectories.
