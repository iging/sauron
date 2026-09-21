# Quickstart Guide

Get started with Sauron in under two minutes. This guide covers prerequisites, installation, initialization, and configuration verification.

---

## Prerequisites

Before using Sauron, verify that your environment meets these requirements:

- **Node.js**: Version 20.0.0 or higher.
- **npm**: Version 9.0.0 or higher.
- **Git**: Working tree initialized with at least one initial commit.
- **AI Coding Runtimes**: Any supported runtime (for example Claude Code, Cursor, Windsurf, Cline, Copilot).

---

## Installation

Install Sauron dependencies from the package root:

```bash
git clone https://github.com/agent-spec/agent-spec.git
cd agent-spec/sauron
npm install
npm run build
```

The build command compiles TypeScript source files in `adapters/` to JavaScript files in `dist/adapters/`.

---

## Initialization

Run the initialization command inside your target project directory:

```bash
node ./bin/sauron.mjs init
```

This command performs three automated actions:

1. Generates `sauron.config.yaml` in your root directory if not present.
2. Transpiles universal instructions to all 17 supported runtime configuration files.
3. Initializes `.sauron/manifest.json` to track file checksums and prevent destructive overwrites.

To preview actions without modifying files, pass the `--dry-run` flag:

```bash
node ./bin/sauron.mjs init --dry-run
```

---

## Verifying Installation

Verify that all runtimes, agents, and skills are active:

```bash
node ./bin/sauron.mjs status
```

Expected output:

```text
===================================================================
                       S A U R O N
  "One Harness to rule them all, One Harness to prompt them,
   One Harness to sync them all, and in your codebase bind them."
===================================================================

[STATUS] sauron v1.0.0

--- The 17 Runtimes Bound by sauron ---
  [OK] Claude Code          -> CLAUDE.md
  [OK] Cursor               -> .cursorrules
  [OK] Windsurf             -> .windsurfrules
  [OK] GitHub Copilot       -> .github/copilot-instructions.md
  ...

--- The Fellowship of 9 Sub-Agents ---
  [OK] Gandalf    : Master Planner and Strategy Guide
  [OK] Aragorn    : Principal System Architect
  [OK] Legolas    : Precision Linter and Bug Hunter
  ...

--- Skill Ecosystem ---
  [OK] 67 ECC-standard skills across 8 domains
```

To list all available skills by domain, run:

```bash
node ./bin/sauron.mjs list-skills
```

---

## Next Steps

- Review [Configuration Reference](configuration.md) to customize runtimes and agents.
- Learn about the 9 specialized agents in [Fellowship Overview](../02-fellowship-agents/overview.md).
- Activate [Caveman Mode](../05-token-optimization/caveman-mode.md) to reduce context consumption by up to 75%.
