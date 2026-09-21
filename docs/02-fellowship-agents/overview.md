# Fellowship Sub-Agents Overview

The Fellowship of 9 represents Sauron's multi-agent coordination architecture. Instead of relying on a single monolithic model to plan, code, test, and review, Sauron divides responsibilities across 9 specialized persona agents with clear boundaries.

---

## The Fellowship Roster

| Agent       | Canonical Name             | Title                             | Primary Authority                                 | Slash Command |
| ----------- | -------------------------- | --------------------------------- | ------------------------------------------------- | ------------- |
| **Gandalf** | Mithrandir                 | Master Planner and Strategy Guide | `context/PRD.md`, `context/TASKS.md`              | `/gandalf`    |
| **Aragorn** | Elessar                    | Principal System Architect        | `context/ARCHITECTURE.md`, design engineering     | `/aragorn`    |
| **Legolas** | Greenleaf                  | Precision Linter and Bug Hunter   | Linting, syntax review, Caveman compression       | `/legolas`    |
| **Gimli**   | Lockbearer                 | Refactorer and Dead Code Slasher  | Backend routes, database migrations, schema sync  | `/gimli`      |
| **Boromir** | Captain of the White Tower | Security Auditor and Shield       | OWASP scans, security gate, incident response     | `/boromir`    |
| **Frodo**   | Ringbearer                 | Core Task Executor                | Autonomous execution, 5-stage engineering loop    | `/frodo`      |
| **Samwise** | Gamgee                     | Git Commits and State Keeper      | Git history, repo organization, session handoffs  | `/samwise`    |
| **Merry**   | Brandybuck                 | QA and TDD Specialist             | Unit, integration, and E2E automated test suites  | `/merry`      |
| **Pippin**  | Took                       | Edge Case and Chaos Prober        | MCP tools, edge case detection, exploratory tests | `/pippin`     |

---

## Coordination and Handoff Flow

The Fellowship collaborates through a deterministic lifecycle pipeline:

```text
[User Request]
       │
       ▼
   Gandalf (Plan & Decompose)
       │
       ▼
   Aragorn (Architect & Design)
       │
       ▼
    Frodo (Execute & Implement)
       │
       ▼
    Merry (Verify with TDD Tests)
       │
       ▼
   Legolas (Lint & Style Audit)
       │
       ▼
   Boromir (Security Gate Review)
       │
       ▼
   Samwise (Atomic Commit & Handoff)
```

---

## Core Operational Rules

1. **Strict Authority Boundaries**: An agent must not modify files outside its declared authority. Gandalf plans but never writes code. Frodo writes code but never alters foundational architecture without Aragorn.
2. **Explicit Handoff Protocols**: When an agent completes its phase, it passes control to the designated downstream specialist.
3. **Fail-Closed Gates**: If a security violation, test failure, or syntax issue occurs, the pipeline pauses immediately until resolved.

---

## Complete Specialist Agent Matrix (69 Agents across 9 Guilds)

Every Fellowship leader commands specialized domain agents housed in `core/agents/`:

### 1. Gandalf Guild (Planning & Strategy)
- `planner.md`: Master iteration planner and breakdown specialist.
- `chief-of-staff.md`: Executive orchestrator and multi-agent coordinator.
- `requirements-analyst.md`: PRD requirements validator and user story parser.
- `monorepo-architect.md`: Workspace boundary and package structure strategist.
- `migration-planner.md`: Technical stack and breaking migration planner.
- `domain-modeler.md`: Business logic and entity relationship modeler.
- `api-designer.md`: REST, GraphQL, and RPC specification author.
- `task-decomposer.md`: Atomic work item generator and task graph scheduler.

### 2. Aragorn Guild (Frontend & System Architecture)
- `architect.md`: System boundary authority and architectural guardian.
- `design-engineer.md`: Design token, layout, and UI system author.
- `frontend-developer.md`: Core client application and state engineer.
- `motion-specialist.md`: Micro-interaction and web animation engineer.
- `css-architect.md`: Responsive design, token, and theme architect.
- `tailwind-expert.md`: Utility class and Tailwind engine specialist.
- `nextjs-architect.md`: App Router, Server Components, and SSR architect.
- `mobile-rn-developer.md`: React Native, Expo, and cross-platform builder.

### 3. Legolas Guild (Quality, Review & Precision)
- `code-reviewer.md`: Principal code reviewer and standard enforcer.
- `typescript-reviewer.md`: Strict typing and generic soundness auditor.
- `a11y-auditor.md`: WCAG 2.2 AA accessibility and screen reader auditor.
- `token-optimizer.md`: Prompt context minimizer and token efficiency analyst.
- `linter-enforcer.md`: ESLint, Biome, and Oxlint static analysis specialist.
- `spec-auditor.md`: Compliance auditor against agent-spec core standards.
- `doc-reviewer.md`: Technical accuracy and documentation clarity reviewer.
- `pr-evaluator.md`: Pull request completeness and blast radius reviewer.

### 4. Gimli Guild (Backend & Infrastructure)
- `refactorer.md`: Structural refactoring and technical debt remover.
- `database-admin.md`: Migration author and schema relational architect.
- `backend-engineer.md`: Service layer, background worker, and API implementer.
- `dead-code-slasher.md`: Unused export and orphaned module purger.
- `sql-optimizer.md`: Query indexing, N+1 query killer, and plan optimizer.
- `caching-specialist.md`: Redis, CDN, and in-memory cache strategist.
- `graphql-architect.md`: Schema, resolver, and federation specialist.
- `api-scaffolder.md`: Endpoint controller and routing generator.

### 5. Boromir Guild (Security & Defensive Shield)
- `security-shield.md`: Primary defensive gatekeeper and vulnerability screener.
- `owasp-scanner.md`: OWASP Top 10 and common vulnerability auditor.
- `secret-guardian.md`: Credential leak preventer and secret scanner.
- `auth-specialist.md`: JWT, OAuth2, and session architecture authority.
- `dependency-auditor.md`: Supply chain and CVE package scanner.
- `incident-responder.md`: Post-mortem and security mitigation coordinator.
- `agent-guard.md`: Prompt injection and subagent perimeter defense.
- `compliance-officer.md`: Regulatory boundary and policy enforcer.

### 6. Frodo Guild (Execution & Build Resolution)
- `executor.md`: Autonomous task implementer across file boundaries.
- `build-resolver.md`: Transpile, compilation, and package error fixer.
- `typescript-fixer.md`: Compiler error and type mismatch eliminator.
- `bundler-debugger.md`: Vite, Turbopack, and Webpack configuration resolver.
- `atomic-implementer.md`: Single-concern atomic diff developer.
- `loop-orchestrator.md`: Autonomous execution loop driver.
- `dependency-resolver.md`: Lockfile conflict and package version mediator.
- `smoke-tester.md`: Post-build execution verification probe.

### 7. Samwise Guild (State, Workspace & Git Handoff)
- `state-keeper.md`: Context snapshot, scratchpad, and state preserver.
- `git-reconciler.md`: Branch rebase, merge resolution, and git tree specialist.
- `checkpoint-author.md`: Handoff documentation and session record author.
- `handoff-specialist.md`: Context packaging specialist across agent transitions.
- `repo-cleaner.md`: Artifact cleanup and workspace hygiene manager.
- `workspace-scaffolder.md`: Monorepo bootstrap and template provisioner.
- `release-manager.md`: Semantic versioning and changelog generator.

### 8. Merry Guild (QA, Testing & Verification)
- `qa-specialist.md`: Test strategy architect and test matrix coordinator.
- `tdd-guide.md`: Test-Driven Development red-green-refactor mentor.
- `e2e-runner.md`: Playwright, Cypress, and user flow automated tester.
- `coverage-analyst.md`: Branch, statement, and path test coverage analyst.
- `flaky-test-hunter.md`: Asynchronous race condition and test stability fixer.
- `mocking-specialist.md`: Test double, spy, stub, and fixture architect.
- `contract-tester.md`: Consumer-driven and API payload boundary tester.

### 9. Pippin Guild (Chaos, Tooling & Diagnostics)
- `chaos-prober.md`: Edge case investigator and fault injection prober.
- `mcp-specialist.md`: Model Context Protocol server and tool integrator.
- `log-inspector.md`: Structured log parser and diagnostic tracer.
- `network-tracer.md`: HTTP request lifecycle and latency debugger.
- `failure-triage.md`: Unhandled exception and crash dump analyst.
- `edge-case-hunter.md`: Boundary condition and malicious input simulator.
- `screenshot-tester.md`: Visual regression and snapshot diff tester.

