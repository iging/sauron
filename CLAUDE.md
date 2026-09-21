# CLAUDE.md

> Managed by Sauron AI v1.0.0. Persistent instruction manual for Claude Code.

## Common Commands

- **Build Engine**: `npm run build`
- **Run Test Suite**: `npm test`
- **Typecheck**: `npx tsc --noEmit`
- **Run Single Test**: `node --test tests/<filename>.test.mjs`
- **Check Status**: `node bin/sauron.mjs status`

## Architecture & Code Organization

- `adapters/` : 17 runtime transpilation adapters, types, and safe conflict manager.
- `bin/` : CLI orchestrator and runtime entry points.
- `core/` : Fellowship sub-agent specifications and department skill metadata.
- `skills/` : 44 ECC-standard modular skills across 7 functional departments.
- `tests/` : Automated test suite executed with native Node.js test runner.

## Code Style & Conventions

- TypeScript 7+ in strict mode using ECMAScript Modules (`"type": "module"`).
- Explicit relative paths with `.js` extensions for internal imports.
- Zero barrel files (`index.ts` is strictly prohibited).
- Route all file mutations through `ConflictManager` to prevent destructive overwrites.
- Strict fail-closed error handling; zero untyped boundary parameters.

## Fellowship Sub-Agents

- **Gandalf** (`/gandalf`) : Master Planner and Strategy Guide (PRD, TASKS).
- **Aragorn** (`/aragorn`) : Principal System Architect (SCHEMA, ARCHITECTURE).
- **Legolas** (`/legolas`) : Precision Linter and Syntax Bug Hunter.
- **Gimli** (`/gimli`) : Refactorer and Dead Code Slasher.
- **Boromir** (`/boromir`) : Security Auditor and Shield.
- **Frodo** (`/frodo`) : Ringbearer and Core Task Executor.
- **Samwise** (`/samwise`) : Git Commits and State Keeper.
- **Merry** (`/merry`) : QA and TDD Specialist.
- **Pippin** (`/pippin`) : Edge Case and Chaos Prober.

## Claude-Specific Behaviors

- Use adaptive reasoning natively; avoid redundant scratchpad scaffolding.
- For complex refactoring, outline blast radius and impacted files before modifying code.
- Always verify changes with `npm test` and `npx tsc --noEmit` before concluding.
