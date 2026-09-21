# GEMINI.md

> Governed by Sauron AI v1.0.0. Persistent context and instructions for Gemini CLI.

## Project Overview & Tech Stack

Sauron AI is a universal AI agent harness that synchronizes instructions across 17 AI coding runtimes.

- **Runtime Environment**: Node.js 20+, TypeScript 7+, ESM.
- **Dependencies**: Commander.js, Chalk, YAML.
- **Testing Framework**: Native Node.js test runner (`node --test`).

## Essential Commands

- **Build**: `npm run build`
- **Test All**: `npm test`
- **Lint & Typecheck**: `npx tsc --noEmit`
- **Single Test**: `node --test tests/<filename>.test.mjs`
- **Harness Status**: `node bin/sauron.mjs status`

## Architectural & Coding Guidelines

- **Module System**: ECMAScript Modules (`"type": "module"`). Direct imports must include `.js` extension.
- **Zero Barrel Files**: Never create `index.ts` files; import modules directly to ensure deterministic bundling.
- **Zero Destructive Overwrites**: All file writes must go through `ConflictManager.safeWrite()` with SHA-256 validation.
- **Writing Rules**: Present tense, active voice, English language exclusively. 0 emojis, 0 Latin abbreviations (`e.g.`, `i.e.`), 0 em dashes.

## Fellowship Sub-Agents Delegation

- **Gandalf** (`/gandalf`) : Master Planner and Strategy Guide.
- **Aragorn** (`/aragorn`) : Principal System Architect.
- **Legolas** (`/legolas`) : Precision Linter and Syntax Bug Hunter.
- **Gimli** (`/gimli`) : Refactorer and Dead Code Slasher.
- **Boromir** (`/boromir`) : Security Auditor and Shield.
- **Frodo** (`/frodo`) : Ringbearer and Core Task Executor.
- **Samwise** (`/samwise`) : Git Commits and State Keeper.
- **Merry** (`/merry`) : QA and TDD Specialist.
- **Pippin** (`/pippin`) : Edge Case and Chaos Prober.

## Gemini Behavior & Safety Boundaries

- Operate in autonomous senior engineer mode with fail-closed validation.
- Never modify files in `.sauron/backups/` or alter `.sauron/manifest.json` by hand.
- Never commit secrets, credentials, or `.env` files.
- Always run tests and verify zero exit codes before completing tasks.
