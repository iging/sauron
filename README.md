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

[![npm version](https://img.shields.io/npm/v/sauron-ai.svg?color=cb3837&logo=npm)](https://www.npmjs.com/package/sauron-ai)
[![npm downloads](https://img.shields.io/npm/dm/sauron-ai.svg)](https://www.npmjs.com/package/sauron-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./licenses/LICENSE-MIT)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./licenses/LICENSE-APACHE-2.0)
[![Status: Open Source](https://img.shields.io/badge/Status-100%25%20Free%20%26%20Open%20Source-green.svg)](./licenses/)

---

## Overview

**Sauron AI** is an open-source, universal AI agent harness inspired by the legendary lore of _The Lord of the Rings_. Just as the One Ring was forged to bring unity and dominion over fragmented powers, Sauron AI was built to solve the two biggest crises in modern AI-assisted software development:

1. **The Tool Fragmentation & Manual Setup Nightmare**:
   Today, engineering teams and individual developers use multiple AI tools simultaneously—Claude Code, Cursor, Copilot, Windsurf, Cline, Gemini, Zed, and others. Configuring each tool requires manually writing, syncing, and constantly updating fragmented prompt files (`CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, etc.). When rules or architectural constraints change, synchronizing them by hand across every developer's IDE is tedious, error-prone, and unsustainable.

   **Sauron solves this with One Universal Harness**: You define your architectural rules, safety boundaries, and skill contracts once in a master specification, and Sauron automatically transpiles and synchronizes them deterministically across **17 AI coding runtimes**.

2. **The "Vibe Coding" Crisis**:
   **Vibe coding is a recipe for disaster.** Prompting AI assistants to generate features without architectural blueprints, data invariants, or test criteria produces immediate gratification followed by rapid failure—hallucinated libraries, silent security holes, state corruptions, and unmaintainable spaghetti code.

   **Sauron transforms vibe coding into a disciplined Agentic Workflow**:
   Instead of blind prompting, Sauron orchestrates a **Fellowship of 9 Specialized Sub-Agents** (Gandalf for planning, Aragorn for system architecture, Legolas for linting, Boromir for security, Frodo for atomic execution, Merry for TDD QA, and more). Every task routes through structured domain blueprints, token-efficient communication (`/caveman`), and rigorous test verification before a single line of code reaches your git history.

---

## Quickstart

You can use Sauron in two ways: **Modular Mode** (zero-install: add individual skills to any codebase without token bloat) or **Full Harness Mode** (transpile and synchronize rules across all 17 AI runtimes).

### 1. Modular Skills (Zero-Install via NPX)

Add specific skills directly into your local project workspace without installing dependencies:

```bash
# Add an individual skill (e.g. plan-feature, clean-architecture, security-auditor)
npx sauron-ai add plan-feature
npx sauron-ai add clean-architecture

# Add to specific directory (default: .agents/skills)
npx sauron-ai add tdd-workflow --to .claude/skills
npx sauron-ai add tailwind-principles --to .cursor/rules

# Browse all available skills across 9 domains
npx sauron-ai list-skills
```

> **Prefer Global CLI?** Install once with `npm install -g sauron-ai` and run `sauron add <skill>` anywhere.

### 2. Full Harness Synchronization (All 17 Runtimes & Fellowship)

Synchronize the master specification and generate native instruction files (`CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`, etc.) across your entire repo:

```bash
# Using NPX (Zero-install, recommended for web developers)
npx sauron-ai init

# Or install globally
npm install -g sauron-ai
sauron init

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
  npx sauron-ai init --dry-run
  ```
- Run in a container sandbox:
  ```bash
  docker run --rm -it -v $(pwd):/workspace node:20-alpine npx sauron-ai init
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

## Flagship Engineering Capabilities

Sauron ships with 45 modular skills across 7 functional departments. Four flagship capability pillars anchor the developer and agent experience:

---

### 1. Token Optimization Engine (Caveman Mode)

Long-running agent sessions suffer from context window bloat caused by conversational filler, repetitive apologies, and pleasantries. This burns LLM API credits and causes attention degradation over time.

Sauron embeds **Caveman Mode** as its flagship token conservation suite to preserve technical precision while saving up to 75% of response tokens.

| Command                         | Action                                                                    | Token Savings |
| :------------------------------ | :------------------------------------------------------------------------ | :------------ |
| `/caveman` (or `/caveman full`) | Activates default full compression (spartan, terse fragments)             | ~60%          |
| `/caveman lite`                 | Eliminates filler while preserving complete grammatical sentences         | ~40%          |
| `/caveman ultra`                | Extreme compression with minimal words for maximum context conservation   | ~75%          |
| `/caveman-commit`               | Generates strict Conventional Commits under 70 characters without padding | Zero bloat    |
| `/caveman-review`               | Emits dense, one-line actionable PR review findings                       | High density  |
| `/caveman-compress`             | Compresses Markdown documentation without losing technical requirements   | ~50%          |
| `/caveman off`                  | Restores standard conversational mode                                     | Baseline      |

---

### 2. Codebase Knowledge Graph (`sauron graph`)

AI agents often burn thousands of tokens dumping raw source files just to understand project topology. Sauron includes a local, deterministic **Polyglot Knowledge Graph Engine** that maps codebase architecture into three standard artifacts:

- `.sauron/graph/graph.json` — Structured AST nodes, dependencies, and cycle metrics for programmatic agent queries.
- `.sauron/graph/graph-report.md` — Quantitative architectural health report detailing god modules and circular dependencies.
- `.sauron/graph/graph.html` — Interactive in-browser force-directed visualizer built with a Linear-craft design preset.

```bash
# Using NPX (Zero-install in any project)
npx sauron-ai graph .

# If installed globally (npm install -g sauron-ai)
sauron graph .

# Or from local sauron clone
node bin/sauron.mjs graph .

# Open visualizer in browser
start .sauron/graph/graph.html   # Windows
open .sauron/graph/graph.html    # macOS
```

| Feature              | Specification                                                                         |
| :------------------- | :------------------------------------------------------------------------------------ |
| **Polyglot Support** | TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, PHP, Ruby, C/C++, C#          |
| **Performance**      | Sub-second extraction for 100+ files via local static AST parsing                     |
| **Visual Interface** | Physics simulation, live search, department clustering, and deep AST symbol inspector |

---

### 3. Design Engineering & Craftsmanship (`design-engineering`)

Modern web applications require deliberate craft: cohesive color palettes, consistent spatial grids, fluid typography, and accessible keyboard navigation. Without explicit design constraints, automated code generation often defaults to unrefined templates—such as stark pitch-black surfaces, disconnected accent gradients, and missing interaction feedback.

For developers and designers aiming for top-tier execution, Sauron provides an end-to-end **Design Engineering Suite** (`skills/frontend/design-engineering/`) that bridges the gap between design vision and production-grade Web standards. It combines `ui-ux-principles`, `html-css-principles`, `javascript-principles`, and `frontend-development` into a cohesive aesthetic and accessibility pipeline:

#### The 6-Stage Design Engineering Pipeline:

- **1. Foundations & Tokens (`01-foundations-and-systems`)**:
  - **Overview**: Establishes Nielsen heuristics, accessible color tokens, and layout wireframes.
  - **Why it matters**: Eliminates arbitrary styling values by enforcing a mathematically harmonious 4px baseline rhythm, fluid typography scales (`clamp()`), and semantic surface hierarchies.

- **2. Aesthetic Engines & Anti-Slop Tuning (`02-aesthetic-engines-and-styles`)**:
  - **Overview**: Replaces generic templates with signature agency-grade styles: _Ethereal Glass_ ($150k+ studio look), _Swiss Print Brutalism_, _Utilitarian Minimalist_, and _Apple Human Interface Spring Physics_.
  - **Anti-Slop Tuning**: Regulates visual complexity via 3 dials: **Information Density**, **Visual Polish / Restraint**, and **Motion Budget**.

- **3. Curated Brand Presets (`03-brand-presets-and-visual-identity`)**:
  - **Overview**: Ships with 65+ production-tested brand identities.
  - **Pre-configured styles**: Linear, Vercel, Stripe, Raycast, Warp, Apple HIG, Cursor, GitHub Dark Pro, and Tailwind UI. Agents adopt exact typography stacks, border radiuses, and border contrasts matching the chosen brand.

- **4. Micro-Interactions & Spring Motion (`04-motion-and-interaction`)**:
  - **Overview**: Replaces clumsy CSS linear transitions with GPU-accelerated hardware springs (`transform`, `opacity`).
  - **Tactile feedback**: Implements tactile micro-scale clicks (`transform: scale(0.97)`), spring-driven drawer transitions, and strict `prefers-reduced-motion` fallbacks.

- **5. Vision & Comp Translation (`05-vision-and-code-generation`)**:
  - **Overview**: Ingests UI screenshots or Figma mockups and translates them directly into semantic, responsive HTML/Tailwind/React code with zero hallucinated placeholders.

- **6. Code Quality & WCAG 2.2 Gatekeeper (`06-audit-refactor-and-enforcement`)**:
  - **Overview**: Audits frontend code for accessibility and clean architecture.
  - **Enforcement rules**: 44px minimum touch targets, proper heading hierarchies (`h1` through `h6`), `:focus-visible` ring offsets, zero clickable `div`s, and full screen reader compatibility.

---

### 4. Zero-Trust Security & Static SAST Shield (`agent-guard`)

Autonomous AI agents must operate inside strict safety boundaries. Sauron embeds proactive static application security testing (SAST) and secret leak detection:

- **Pre-Commit Secret Shield**: Scans for private keys, AWS access keys, bearer tokens, and credentials before code reaches git history.
- **Unsafe Sink Detection**: Flags dangerous dynamic code evaluation (`eval()`, dynamic execution sinks) across JavaScript, TypeScript, and Python.
- **Audit Command**: Run `npm run security-scan` or activate `@boromir` to perform pre-merge vulnerability inspections.

---

### 5. Anti-Vibe-Coding Context Engine (`context/`)

**Vibe coding is a recipe for disaster.** Prompting AI agents to build production features without architectural blueprints, state invariants, or test criteria leads to catastrophic technical debt, security breaches, and unmaintainable spaghetti code that breaks the moment it scales.

Sauron eliminates vibe coding by connecting the AI directly to persistent, structured specifications under `context/`. Three core workflow skills enforce this discipline:

- **`define-core-domains` (`/define-core-domains`) — Grounding Ideas into Architecture**:
  - **Overview**: Prevents AI from prematurely writing implementation code from raw ideas or unstructured notes.
  - **Mechanism**: Conducts a structured 3-round alignment interview clarifying core entities, user journeys, and module boundaries.
  - **Output**: Generates a verified PRD (`prd.md`), domain models (`domains.md`), and system architecture blueprints in `context/core-domains/` before writing any application code.

- **`define-enterprise-context` (`/define-enterprise-context`) — Production Hardening & Standards**:
  - **Overview**: Ensures the system meets enterprise production standards rather than remaining an unhardened MVP.
  - **Mechanism**: Scaffolds 23 software engineering domains across 45 production specification templates covering disaster recovery, auth/RBAC matrices, rate limiting, audit logging, and observability thresholds.
  - **Output**: Establishes a comprehensive enterprise reference under `context/software-engineering/` to prevent AI agents from generating insecure or non-compliant patterns.

- **`engineering-loop` (`/engineering-loop`) — Safe Feature Execution & Test Gates**:
  - **Overview**: Provides strict guardrails for routine feature development and refactoring without breaking existing codebase state.
  - **Mechanism**: Enforces the 5-stage engineering lifecycle (**Blueprint -> UI Tokens -> Code Inspection -> Context Checkpoint -> Failure Triage**).
  - **Output**: Blocks unverified code mutations. All changes route through an architectural blueprint and automated failure triage in `context/engineering-loop/`.

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
- [runtime-matrix.md](./references/runtime-matrix.md): Complete technical comparison table across all 17 supported runtimes.
- [fellowship-contracts.md](./references/fellowship-contracts.md): Explicit authority boundaries and handoff protocols for the 9 sub-agents.
- [anti-patterns.md](./references/anti-patterns.md): The 60 credit-killing patterns reference used to audit all skills.
- [faq.md](./docs/01-getting-started/faq.md): Frequently asked questions, safety guarantees, and migration guide.
- [writing-rules.md](./skills/workflow/writing-rules/SKILL.md): Style rules, truth protocol, and readability standards.

---

## Licenses

Sauron is released under multiple open-source licenses:

- [MIT License](./licenses/LICENSE-MIT)
- [Apache License 2.0](./licenses/LICENSE-APACHE-2.0)
- [The Unlicense](./licenses/LICENSE-UNLICENSE)
