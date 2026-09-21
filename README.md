# Sauron AI

```text
Three Prompts for the Frontier Models in the cloud,
Seven Rules for the Local IDEs in their desktop shells,
Nine Skills for Vibe Coders doomed to debug,
One Harness for the Root Terminal on its master throne:

One Harness to rule them all,
One Harness to prompt them,
One Harness to sync them all,
and in your codebase bind them.
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./licenses/LICENSE-MIT)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./licenses/LICENSE-APACHE-2.0)
[![Status: Open Source](https://img.shields.io/badge/Status-100%25%20Free%20%26%20Open%20Source-green.svg)](./licenses/)

Sauron AI is an open-source universal AI agent harness. It prevents unverified coding practices across 17 AI coding runtimes using one master specification. It organizes a 9-agent Fellowship across your engineering workflow and synchronizes rules directly.

---

## Quickstart

You can use Sauron in two ways: **Modular Mode** (add individual skills to an existing codebase without token bloat) or **Full Harness Mode** (transpile rules across all 17 AI runtimes).

### 1. Modular Skills

Add specific skills directly into your local project workspace:

```bash
# Add an individual skill (e.g. plan-feature, clean-architecture, security-auditor)
npx sauron add plan-feature
npx sauron add clean-architecture

# Add to specific directory (default: .agents/skills)
npx sauron add tdd-workflow --to .claude/skills

# Browse all available skills across 9 domains
npx sauron list-skills
```

### 2. Full Harness Synchronization (All 17 Runtimes & Fellowship)

Synchronize the master specification and generate instruction files (`CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`, etc.) across your entire repo:

```bash
# Using NPX (Recommended for Node & Web Developers)
npx sauron init

# Using Python PIP
pip install sauron-ai && sauron init

# Direct Git Clone
git clone https://github.com/iging/sauron.git
cd sauron && npm install && npm run build
```

### 3. Standalone One-Liner Installers

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/sauron-ai/sauron/main/bin/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/sauron-ai/sauron/main/bin/install.ps1 | iex
```

### 4. Running via Docker (Zero Local Node.js Required)

For zero-dependency execution without installing Node.js on your machine:

```bash
# Check Sauron status
docker compose run --rm sauron status

# Add a modular skill to your workspace
docker compose run --rm sauron add api-design

# Run the Sauron landing page locally
docker compose up sauron-landing
```

See [`docker/README.md`](./docker/README.md) for full container architecture and hardening details.

---

## Sandboxing and Security Notice

Sauron executes locally and provides full source transparency:

- Zero remote telemetry. The tool transpiles all rules on your local machine. It sends no code or prompts to external servers.
- Non-destructive backups. The tool creates a `.bak` copy before modifying any existing configuration file.
- Inspect before applying. Run dry-run mode to inspect diffs:
  ```bash
  npx sauron init --dry-run
  ```
- Run in a container sandbox:
  ```bash
  docker run --rm -it -v $(pwd):/workspace node:20-alpine npx sauron init
  ```

---

## The 17 Runtimes Configured by Sauron

Sauron generates native configuration files for:

1. Claude Code (`CLAUDE.md`, `.claude/commands/`)
2. Cursor (`.cursorrules`, `.cursor/rules/*.mdc`)
3. Windsurf (`.windsurfrules`)
4. GitHub Copilot and VSCode (`.github/copilot-instructions.md`)
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
17. Adal and CodeBuddy (`.adalrules`, `.codebuddy.md`)

---

## The Fellowship of 9 Sub-Agents

| Agent       | Canon Role            | Engineering Authority                                              | Invocation               |
| :---------- | :-------------------- | :----------------------------------------------------------------- | :----------------------- |
| **Gandalf** | Master Planner        | High-level decomposition and roadmap planning                      | `/gandalf` or `@gandalf` |
| **Aragorn** | Principal Architect   | System topology and module boundary enforcement                    | `/aragorn` or `@aragorn` |
| **Legolas** | Precision Linter      | Static analysis, AST inspection, and syntax error detection        | `/legolas` or `@legolas` |
| **Gimli**   | Structural Refactorer | Performance tuning and dead code elimination                       | `/gimli` or `@gimli`     |
| **Boromir** | Security Shield       | Threat modeling, vulnerability scanning, and secret leak detection | `/boromir` or `@boromir` |
| **Frodo**   | Ringbearer            | Focused atomic task execution without scope expansion              | `/frodo` or `@frodo`     |
| **Samwise** | State Keeper          | Conventional commits, changelogs, and session state                | `/samwise` or `@samwise` |
| **Merry**   | QA Specialist         | Test-driven development gatekeeper and assertions                  | `/merry` or `@merry`     |
| **Pippin**  | Chaos Prober          | Boundary fuzzing, payload tests, and edge case exploration         | `/pippin` or `@pippin`   |

---

## Token Optimization Engine (Caveman Mode)

Long-running agent sessions suffer from context window bloat caused by polite conversational filler, repetitive summaries, and unnecessary pleasantries. This burns LLM API credits and degrades attention mechanisms over time.

Sauron embeds **Caveman Mode** as its flagship token conservation suite to preserve technical precision while saving up to 70% of response tokens.

### Available Commands

| Command                         | Action                                                                    | Token Savings |
| :------------------------------ | :------------------------------------------------------------------------ | :------------ |
| `/caveman` (or `/caveman full`) | Activates default full compression (spartan, terse fragments)             | ~60%          |
| `/caveman lite`                 | Eliminates filler while preserving complete grammatical sentences         | ~40%          |
| `/caveman ultra`                | Extreme compression with minimal words for maximum context conservation   | ~75%          |
| `/caveman-commit`               | Generates strict Conventional Commits under 70 characters without padding | Zero bloat    |
| `/caveman-review`               | Emits dense, one-line actionable PR review findings                       | High density  |
| `/caveman-compress`             | Compresses Markdown documentation without losing technical requirements   | ~50%          |
| `/caveman off`                  | Restores standard conversational mode                                     | Baseline      |

> **Directive:** Use `/caveman` across long engineering sessions to keep the context window focused on production code, test assertions, and system architecture.

## Project Foundation and Specifications

All core engineering specifications are documented under `.agents/context/`:

- [product-requirements.md](./.agents/context/product-requirements.md): Product requirements, verification metrics, and scope.
- [system-architecture.md](./.agents/context/system-architecture.md): Transpiler topology, adapter matrix, and data flow.
- [schema-definitions.md](./.agents/context/schema-definitions.md): Configuration YAML, agent specification, and conflict schemas.

---

## Contributing and Community

We welcome contributions from the community to expand the Sauron harness, runtime adapters, and skills catalog!

- [CONTRIBUTING.md](./CONTRIBUTING.md): Comprehensive guide on local development, adding skills, and PR guidelines.
- [CONTRIBUTORS.md](./CONTRIBUTORS.md): The official Sauron Fellowship & Contributors Roll.
- [anti-patterns.md](./references/anti-patterns.md): The 50 credit-killing patterns reference used to audit all skills.
- [writing-rules.md](./skills/workflow/writing-rules/SKILL.md): Style rules, truth protocol, and readability standards.

---

## Licenses

Sauron is released under multiple open-source licenses:

- [MIT License](./licenses/LICENSE-MIT)
- [Apache License 2.0](./licenses/LICENSE-APACHE-2.0)
- [The Unlicense](./licenses/LICENSE-UNLICENSE)
