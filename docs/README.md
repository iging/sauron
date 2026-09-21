# Sauron Documentation Portal

> Universal AI Agent Harness for 17 runtimes. Governed by Sauron v1.0.0.

Welcome to the Sauron documentation portal. This directory provides complete, structured guides covering the Sauron architecture, Fellowship sub-agents, skill ecosystem, runtime adapters, token conservation engine, and safety mechanisms.

---

## Documentation Structure

Browse the documentation by topic:

### [01. Getting Started](01-getting-started/quickstart.md)

- [Quickstart Guide](01-getting-started/quickstart.md) : System prerequisites, installation, initialization, and verification.
- [Configuration Reference](01-getting-started/configuration.md) : Master configuration schema (`sauron.config.yaml`), project flags, and adapter toggles.
- [CLI Command Reference](01-getting-started/cli-reference.md) : Syntax, flags, and options for `init`, `status`, `list-skills`, and `sync`.

### [02. The Fellowship of 9 Sub-Agents](02-fellowship-agents/overview.md)

- [Fellowship Overview](02-fellowship-agents/overview.md) : Multi-agent coordination model, authority boundaries, and handoff protocols.
- [Gandalf (Master Planner)](02-fellowship-agents/gandalf.md) : Strategy guide, requirements extraction, and task decomposition.
- [Aragorn (System Architect)](02-fellowship-agents/aragorn.md) : Foundation standards, design engineering, and structural consistency.
- [Legolas (Precision Linter)](02-fellowship-agents/legolas.md) : Lint review, syntax bug detection, Caveman token compression, and accessibility.
- [Gimli (Backend & Database)](02-fellowship-agents/gimli.md) : API endpoint scaffolding, database migrations, and schema sync.
- [Boromir (Security Shield)](02-fellowship-agents/boromir.md) : Vulnerability scanning, OWASP Top 10 compliance, and guardrails.
- [Frodo (Core Task Executor)](02-fellowship-agents/frodo.md) : Ringbearer, autonomous dev execution, and engineering loop progression.
- [Samwise (State Keeper)](02-fellowship-agents/samwise.md) : Git commits, workspace organization, handoff state, and career search.
- [Merry (QA & TDD Specialist)](02-fellowship-agents/merry.md) : Test-driven development, deterministic unit, integration, and E2E test suites.
- [Pippin (Chaos & Tooling Prober)](02-fellowship-agents/pippin.md) : MCP tool testing, edge case detection, and exploratory probing.

### [03. Skills Catalog](03-skills-catalog/overview.md)

- [Skills Overview](03-skills-catalog/overview.md) : Standard SKILL.md format, trigger matrix conventions, and 8 functional domains.
- [Workflow Skills](03-skills-catalog/workflow-skills.md) : Autonomous development, 5-stage engineering loop, PRD generator, and project onboarding.
- [Frontend Skills](03-skills-catalog/frontend-skills.md) : Design engineering, visual token extractors, accessibility auditing, and UI principles.
- [Backend Skills](03-skills-catalog/backend-skills.md) : API endpoint generator, route validation, database principles, and language standards.
- [Database Skills](03-skills-catalog/database-skills.md) : Database migration workflows, zero-downtime execution, and type synchronization.
- [Quality Skills](03-skills-catalog/quality-skills.md) : Automated test generation, testing pyramid discipline, and error handling.
- [Security Skills](03-skills-catalog/security-skills.md) : Security auditor, Agent Guard shields, and incident response procedures.
- [DevOps Skills](03-skills-catalog/devops-skills.md) : CI/CD deployment, Docker orchestration, and shell scripting principles.

### [04. Runtime Adapters](04-runtime-adapters/overview.md)

- [Adapters Overview](04-runtime-adapters/overview.md) : Universal transpilation pipeline and single-source-of-truth doctrine.
- [Desktop and IDE Tools](04-runtime-adapters/desktop-and-ide.md) : Cursor, Windsurf, Trae, Zed, VS Code, and Kiro.
- [CLI Coding Agents](04-runtime-adapters/cli-agents.md) : Claude Code, Cline, Codex, OpenCode, OpenClaude, and Pi.
- [Web and Model Interfaces](04-runtime-adapters/web-and-models.md) : Gemini, Copilot, Hermes, Kimi, Qwen, and Adal / CodeBuddy.

### [05. Token Optimization (Caveman Mode)](05-token-optimization/caveman-mode.md)

- [Caveman Mode Guide](05-token-optimization/caveman-mode.md) : Conversational compression engine, compression levels (Lite, Full, Ultra), and sub-skills.
- [Token Benchmarks](05-token-optimization/token-benchmarks.md) : Empirical measurements showing 60% to 75% conversational token reduction.

### [06. Safety and Governance](06-safety-and-governance/conflict-manager.md)

- [Conflict Manager](06-safety-and-governance/conflict-manager.md) : Zero unbacked destructive overwrites, SHA-256 validation, and timestamped backups.
- [Anti-Pattern Guard](06-safety-and-governance/anti-pattern-guard.md) : Prevention of 53 credit-killing anti-patterns and deterministic validation gates.

### [07. References & Authoritative Matrices](../references/)

- [The 17-Runtime Matrix](../references/runtime-matrix.md) : Complete comparison table of file paths, formats, frontmatter support, and slash command mappings.
- [Fellowship Authority Contracts](../references/fellowship-contracts.md) : Formal authority boundaries, file modification rules, and 5-phase handoff lifecycle.
- [Anti-Patterns Reference](../references/anti-patterns.md) : Comprehensive guide to the 60 credit-killing patterns across AI engineering workflows.

### [08. Frequently Asked Questions & Container Sandboxing](faq.md)

- [Frequently Asked Questions (FAQ)](faq.md) : Common questions on backups, zero-telemetry, migration, and multi-IDE synchronization.
- [Docker Architecture & Sandboxing](../docker/README.md) : Production-grade, non-root isolated container instructions.
