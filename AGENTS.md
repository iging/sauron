# AGENTS.md

> Universal AI Agent Harness for 17 runtimes. Governed by Sauron AI v1.0.0.

## Setup commands

- Install dependencies: `npm install`
- Build engine: `npm run build`
- Run test suite: `npm test`
- Typecheck & Lint: `npx tsc --noEmit`
- Run single test: `node --test tests/<filename>.test.mjs`

## Code style

- **Language & Module System**: TypeScript 7+ in strict mode using ECMAScript Modules (`"type": "module"`).
- **Import Rules**: Explicit relative paths with `.js` extensions for local imports. Zero barrel files (`index.ts` is prohibited).
- **Write Safety**: Zero unbacked destructive overwrites. All file mutations must route through `ConflictManager`.
- **Error Handling**: Fail-closed validation; no empty catch blocks or unsafe type casts (`as any`).
- **Communication Style**: Present tense, active voice, English language exclusively across code, comments, and commit messages.
- **Token Efficiency**: Activate `/caveman` to eliminate conversational padding and maximize context window longevity.

## Project structure

- `adapters/` : 17 runtime transpilation adapters, types, and safe conflict manager.
- `bin/` : CLI orchestrator (`sauron.mjs`).
- `config/` : Master workspace configuration (`sauron.config.yaml`) and JSON schemas.
- `core/` : Fellowship agent specifications and department skill metadata.
- `skills/` : 44 ECC-standard modular skills across 7 functional departments.
- `tests/` : Automated test suite executed with native Node.js test runner.

## Boundaries & Safety

- **Workspace Scope**: Modify files exclusively within the designated workspace root.
- **Protected Paths**: Do not alter `.sauron/backups/` or `.sauron/manifest.json` directly.
- **Zero Secrets**: Never commit `.env`, private keys, authentication tokens, or unredacted credentials.
- **Atomic Operations**: Decompose complex tasks into verifiable steps with test verification before completion.
