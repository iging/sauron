# Project Overview

What Sauron is. See [[claude]] and [[status]].

## One line

Sauron AI is a universal AI agent harness. One master config becomes the native instruction
files, skills, subagents, and commands of 20 AI coding runtimes.

## Identity

- npm package: `sauron-ai`. Bins: `sauron` and `sauron-ai`.
- Repo: `https://github.com/iging/sauron`. Owner and lead: Miguel (`@iging`).
- Install: `npx sauron-ai init` or `pnpm dlx sauron-ai init`. Node 18 or newer.
- Python entry point `sauron.py` forwards every command to the Node CLI.
- Landing site: sibling repo `../sauron-landing` (plan: `LANDING-V3-PLAN.md`).

## Main parts

- `adapters/`: one adapter per runtime, plus the transpiler, `ConflictManager`, installer,
  init plan, and helpers. See [[agent-runtimes]].
- `bin/sauron.mjs`: the CLI. Commands are in [[commands-and-stack]].
- `core/`: Fellowship subagents (Gandalf, Aragorn, Legolas, Gimli, Boromir, Frodo, Samwise,
  Merry, Pippin) and the larger core agent set.
- `skills/`: modular skills in departments (ai-engineering, architecture, backend, database,
  devops, frontend, quality, security, workflow).
- `scripts/`: doc gate, security scan, skill ingest, graph generator.
- `tests/`: Node test runner. Unit, integration, e2e, and sandbox.

## What `init` does

- Arrow-key setup: Recommended (shared core, Claude Code, all skills, Fellowship, commands,
  Caveman `full`) or Custom (pick runtimes, subagents, skills, commands, Caveman tier).
- Always writes the shared core: `AGENTS.md`, `.agents/skills/`, `.agents/anti-patterns.md`.
- Saves choices under `init:` in `sauron.config.yaml`. `sauron sync` reuses them.
- Safe merge: Sauron owns only the `sauron:start` and `sauron:end` blocks. JSON is
  deep-merged with user keys winning. Every change is backed up to `.sauron/backups/`.

## Caveman Mode

Output compression with tiers `off`, `lite`, `full`, `ultra`, written into every runtime's
instruction file so it applies from the first reply.
