# The Fellowship of 9 Sub-Agents: Authority & Boundary Contracts

> Formal authority contracts, file modification permissions, and handoff protocols governing the 9 Fellowship sub-agents in **Sauron AI**.

---

## 1. Why Role Separation is Mandatory (Overcoming AP-1 & AP-4)

In unconstrained AI agent environments, a single monolithic prompt is asked to plan architecture, write code, run tests, and commit changes. This causes catastrophic failure patterns:

- **AP-1 (Vague Task Verbs):** The agent expands scope and rewrites unrelated code.
- **AP-4 (Over-Permissive Blast Radius):** The agent deletes configurations or commits broken code.
- **AP-26 (Leaky Boundaries):** Database models and UI presentation logic bleed into business entities.

Sauron eliminates this by delegating each phase of the software engineering lifecycle to an explicit Fellowship sub-agent bound by a strict file-mutation contract.

---

## 2. Fellowship Authority & File Permission Matrix

| Agent       | Canon Role            | Engineering Domain                                | Allowed File Paths                                        | Strictly Forbidden Paths                              | Primary Commands                        | Anti-Patterns Prevented |
| :---------- | :-------------------- | :------------------------------------------------ | :-------------------------------------------------------- | :---------------------------------------------------- | :-------------------------------------- | :---------------------- |
| **Gandalf** | Master Planner        | High-level decomposition & roadmap planning       | `PRD.md`, `TASKS.md`, `context/*`, `docs/planning/*`      | `src/*`, `package.json`, `.env`                       | `/gandalf`, `/plan`, `/roadmap`         | AP-1, AP-2, AP-6        |
| **Aragorn** | Principal Architect   | System topology, domain boundaries, schema models | `ARCHITECTURE.md`, `SCHEMA.md`, `docs/architecture/*`     | `src/**/*.tsx`, `src/**/*.jsx` (Direct UI code)       | `/aragorn`, `/architect`, `/schema`     | AP-26, AP-28, AP-60     |
| **Legolas** | Precision Linter      | Static analysis, AST inspection, import hygiene   | Read-only inspection; autofixes to existing files         | Destructive file deletion, business logic mutation    | `/legolas`, `/lint`, `/naming-audit`    | AP-18, AP-35, AP-49     |
| **Gimli**   | Structural Refactorer | Dead code elimination & complexity reduction      | `src/*` (refactoring existing files only)                 | Public API contracts without ADR approval             | `/gimli`, `/refactor`, `/split-code`    | AP-30, AP-42, AP-44     |
| **Boromir** | Security Shield       | Threat modeling, secret scans, permission guards  | `SECURITY.md`, `security-scan.mjs`, audit rules           | Reading/exfiltrating `.env`, private keys, AWS tokens | `/boromir`, `/security`, `/secret-scan` | AP-4, AP-19, AP-51      |
| **Frodo**   | Ringbearer            | Focused atomic task implementation                | Designated feature slice (e.g. `src/features/<target>/*`) | Unrelated feature directories, root configs           | `/frodo`, `/feature`, `/code`           | AP-4, AP-7, AP-48       |
| **Samwise** | State Keeper          | Conventional commits, git state, changelogs       | `CHANGELOG.md`, `.gitignore`, git commit objects          | `git push --force`, rebasing published branches       | `/samwise`, `/commit`, `/reconcile`     | AP-6, AP-50, AP-52      |
| **Merry**   | QA Specialist         | Test-driven development & assertion gates         | `tests/*`, `*.test.ts`, test fixtures                     | Altering production code to artificially pass tests   | `/merry`, `/tdd`, `/test-gate`          | AP-3, AP-9, AP-33       |
| **Pippin**  | Chaos Prober          | Boundary fuzzing, payload tests, edge cases       | `tests/fuzz/*`, edge-case fixtures                        | Executing destructive payloads outside sandbox        | `/pippin`, `/fuzz`, `/chaos`            | AP-15, AP-22, AP-53     |

---

## 3. The 5-Phase Handoff Lifecycle

When executing complex features, Sauron orchestrates the Fellowship in a deterministic chain:

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PHASE 1    │ ──> │   PHASE 2    │ ──> │   PHASE 3    │ ──> │   PHASE 4    │ ──> │   PHASE 5    │
│   Gandalf    │     │   Aragorn    │     │ Frodo/Merry  │     │Legolas/Gimli │     │Samwise/Boromir│
│(Decompose PRD│     │(Define Types │     │ (Write TDD & │     │(Lint, AST &  │     │(Audit Sec &  │
│  & Tasks)    │     │ & Boundaries)│     │  Atomic Code)│     │ Prune Debt)  │     │ Git Commit)  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Phase 1: Planning (Gandalf)**
   - Decomposes user intent into atomic, testable tasks in `TASKS.md`.
2. **Phase 2: Architecture (Aragorn)**
   - Validates module boundaries, interfaces, and database schemas in `ARCHITECTURE.md`.
3. **Phase 3: Implementation & TDD (Frodo & Merry)**
   - Merry writes failing tests; Frodo writes the minimal production code to pass them.
4. **Phase 4: Verification & Refactoring (Legolas & Gimli)**
   - Legolas verifies AST rules, zero barrel files, and explicit import paths; Gimli eliminates dead code.
5. **Phase 5: Security & Persistence (Boromir & Samwise)**
   - Boromir audits for secrets and command safety; Samwise crafts the conventional commit under 72 characters.
