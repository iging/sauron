# PRD: Product Requirements Document: Sauron AI

> **Purpose:** Defines the overarching vision, root problem, architecture philosophy, target personas, scope boundaries, and verification criteria for `Sauron AI`, the open-source universal AI agent harness for 17 coding runtimes.

_Last updated: 2026-09-20_

---

## 1. Executive Summary & Foundational Vision

Sauron AI is a free, open-source universal AI coding agent harness and orchestration standard inspired by the Lord of the Rings motif: _"One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them."_

### The Core Genesis and Origin

Modern AI-assisted software engineering suffers from fragmentation, instability, and lack of discipline. The creation of Sauron is founded on two core objectives:

1. **Eliminate Runtime Configuration Fragmentation:** Every editor and terminal assistant requires isolated configuration formats (`CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.clinerules`, `.traerules`, and others). When rules change in one environment, engineers must manually synchronize instructions across all tools. Sauron provides a single authoritative specification (`sauron.config.yaml`) that compiles and synchronizes to 17 native runtimes in milliseconds.
2. **Eliminate Undisciplined, Unverified Code Generation:** Generic AI agents acting without explicit boundaries or verification gates produce chaotic codebases, violate layered architecture, generate security vulnerabilities, and introduce regressions. Sauron introduces **The Fellowship** (9 specialized sub-agents with strict authority boundaries) backed by an enterprise-grade catalog of over 500 modular skills. Every code modification requires explicit architectural alignment, linting, security scans, and test-driven assertions before completion.

Distributed via instant CLI commands (`npx sauron init`, `pip install sauron-ai`, and zero-dependency shell scripts), Sauron is 100 percent free, local-first, telemetry-free, and open source under MIT and Apache 2.0 licenses.

---

## 2. Problem Statement and Architectural Context

### 1. Fragmentation and Configuration Drift

Developers regularly alternate between terminal agents (Claude Code), visual editors (Cursor, Windsurf, Trae, VS Code), and specialized autonomous environments (Cline). Without a unified orchestration engine, rules drift across tools. An instruction enforced in Cursor is ignored in Claude Code, resulting in inconsistent code quality, conflicting conventions, and wasted engineering effort.

### 2. Failure of Single-Agent Prompts

A single generic AI prompt cannot simultaneously act as system architect, implementer, static analyzer, security auditor, and test engineer. Monolithic agent execution triggers systemic failures:

- **AP-1 (Vague task verbs):** Agents invent scope when boundaries are loose.
- **AP-4 (Over-permissive blast radius):** Agents rewrite unrelated files or alter package manifests without consent.
- **AP-26 (Leaky architecture boundaries):** Framework details and database models bleed into business domain entities.
- **AP-60 (Specification drift):** Agents forget constraints over long context windows.

Sauron enforces strict role separation where each phase of the engineering lifecycle is governed by an explicit agent persona with hard pass/fail verification gates.

### 3. Destructive Overwrite Hazards

Existing AI scaffolding tools blindly overwrite existing project configurations without backing up prior rules or inspecting local diffs. Sauron guarantees zero unbacked destructive overwrites via an automated `ConflictManager` that creates timestamped backups before writing to disk.

---

## 3. Core Goals and Objectives

- **Goal 1 (Universal Portability Across 17 Runtimes):** Transpile the single master configuration (`sauron.config.yaml`) into production-grade native rule and command files for 17 runtimes in under 50 milliseconds locally.
- **Goal 2 (Nine-Agent Fellowship Governance):** Orchestrate all engineering workflows through nine specialized personas with strict ownership boundaries:
  - Planning (`gandalf`) -> System Architecture (`aragorn`) -> Syntax Linting (`legolas`) -> Refactoring (`gimli`) -> Security Auditing (`boromir`) -> Task Execution (`frodo`) -> Conventional Commits (`samwise`) -> Test-Driven Verification (`merry`) -> Fuzzing and Chaos (`pippin`).
- **Goal 3 (Enterprise Skill Standardization):** Provide over 500 production-ready skills organized across 8 departments (Architecture, Backend, Database, DevOps, Frontend, Quality, Security, Workflow).
- **Goal 4 (Zero-Destructive Operations):** Ensure that no configuration file is modified or overwritten without generating an automated, timestamped `.bak` file in `.sauron/backups/`.
- **Goal 5 (Zero-Friction Multi-Ecosystem Distribution):** Enable single-command installation across Node.js (`npx sauron`), Python (`pip install sauron-ai`), and shell scripts (`curl` and `irm`).
- **Goal 6 (Local-First Privacy & Zero Telemetry):** All transpilation, parsing, and rule generation occurs entirely on the developer's local machine with zero external network dependencies.

---

## 4. Target Users and Personas

- **Lead Architects and Engineering Managers:** Seeking to enforce universal coding standards, architectural boundaries, and security policies across diverse engineering teams.
- **Full-Stack Developers and Multi-IDE Users:** Engineers who write code across Cursor and VS Code while managing CLI operations through Claude Code, demanding unified instructions everywhere.
- **Independent Builders and Solo Developers:** Developers who require principal-engineer rigor, test-driven development, and automated task planning without manual overhead.
- **DevSecOps and Security Engineers:** Teams demanding strict OWASP ASVS verification, secret scanning, software bill of materials (SBOM), and isolated Docker sandboxing.

---

## 5. Scope and Feature Matrix

### 1. Universal Transpiler Engine (P0)

Translates `sauron.config.yaml` into native rule and command configurations across 17 runtimes:

1. Claude Code (`CLAUDE.md`, `.claude/commands/`)
2. Cursor (`.cursorrules`, `.cursor/rules/*.mdc`)
3. Windsurf (`.windsurfrules`)
4. GitHub Copilot & VS Code (`.github/copilot-instructions.md`, `.vscode/settings.json`)
5. Cline (`.clinerules`)
6. Trae (`.traerules`, `.trae/`)
7. Zed (`.zed/prompts/`, `.zed/settings.json`)
8. Codex (`.codex/instructions.md`)
9. Gemini (`GEMINI.md`)
10. Hermes (`.hermesrules`)
11. Kimi (`.kimi/prompt.md`)
12. Kiro (`.kirorules`)
13. OpenClaude (`.openclaude/config.json`)
14. OpenCode (`.opencode/instructions.md`)
15. Pi (`.pirules`)
16. Qwen (`.qwen/system.md`)
17. Adal and CodeBuddy (`.adalrules`, `.codebuddy_rules.md`)

### 2. The 9 Fellowship Sub-Agents (P0)

1. `gandalf`: Master Planner, Requirements Decomposition, PRD/TASKS custodian.
2. `aragorn`: Principal System Architect, Layer Boundaries, Schema Modeler.
3. `legolas`: AST Linter, Syntax Inspector, Import Hygiene Guardian.
4. `gimli`: AST Refactorer, Dead-Code Pruner, Cognitive Complexity Reducer.
5. `boromir`: Threat Modeler, Security Shield, Secret Leak Sentinel.
6. `frodo`: Core Ringbearer, Atomic Task Implementer.
7. `samwise`: Git Conventional Commits, Worktree Manager, State Keeper.
8. `merry`: Test-Driven Development Specialist, Test Coverage Auditor.
9. `pippin`: Chaos Prober, Boundary Edge-Case Hunter, Fuzzing Engine.

### 3. Universal Command Palette (94 Slash Commands) (P0)

Direct invocation mapping across terminal and IDE platforms:

- Architecture: `/plan`, `/architect`, `/schema-design`, `/api-endpoint`, `/graphql-schema`, `/adr`.
- Code Quality: `/refactor`, `/split-code`, `/naming-audit`, `/clean-deps`, `/audit-deps`.
- Testing: `/tdd`, `/test-unit`, `/test-e2e`, `/test-coverage`, `/flaky-fix`, `/contract-test`.
- Security: `/security`, `/secret-scan`, `/owasp-check`, `/csrf-shield`, `/csp-header`, `/rbac-guard`.
- Git & DevOps: `/commit`, `/git-reconcile`, `/dockerfile`, `/docker-compose`, `/ci-workflow`, `/cd-deploy`.

### 4. Safety and Sandboxing Controls (P0)

- `ConflictManager`: Compares source content against target content, evaluates MD5/SHA256 checksums, and creates timestamped `.bak` files when changes differ.
- Sandbox validation test suites providing reproducible Docker container isolation.

---

## 6. Success Metrics and Verification Standards

- **Transpiler Latency:** Evaluates and generates configurations for all 17 runtimes in under 50 milliseconds.
- **Safety Guarantee:** Exactly zero unbacked destructive file overwrites.
- **Test Integrity:** 100 percent pass rate across automated regression test suites (`npm test`).
- **Code Standard:** Zero barrel files (`index.ts` is strictly prohibited), strict ESM relative imports with explicit extensions, cognitive complexity capped under 15.

---

## 7. Technical Specifications

- **Engine:** Node.js 18+ ESM native, TypeScript 7+ in strict mode.
- **Configuration Master:** YAML (`sauron.config.yaml`) validated by JSON Schema (`schema/sauron.schema.json`).
- **Automated Verification:** Native Node.js test runner (`node --test`).
- **Package Distribution:** npm (`npx sauron`), PyPI (`sauron-ai`), standalone shell installers (`install.sh`, `install.ps1`).
