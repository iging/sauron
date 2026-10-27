# Session 2026-10-25: omp Runtime and Second Brain

Dated note. Not edited later. See [[status]], [[lessons]], and [[agent-runtimes]].

## What was asked

1. Add omp (oh-my-pi, `https://omp.sh`) as a runtime for 3.1.0.
2. Commit, push to a branch, and write the full 3.1.0 test and publish commands.
3. Set up this vault the same way as `vetted-studio/docs/second-brain`.

## What was done

- Read the omp docs: context files, skills, prompt templates, subagents, settings, MCP,
  TTSR rules, and hooks.
- New `adapters/omp.ts`: `.omp/mcp.json` plus READMEs in `.omp/skills`, `.omp/prompts`,
  `.omp/agents`. Registered across the transpiler, CLI, schemas, and config templates.
- Found the count drift (docs 17, CLI 19). Miguel chose 20 everywhere.
- Added the missing `vscode` toggle to the schemas and config templates.
- Commits `dd810b8` and `39b26fb` on `feature/omp-runtime`, pushed. No pull request yet.
- Rewrote the local `RELEASE-V3.1-ARROW-INIT.md` as a runbook (Steps 0 to 6 and rollback).
- Wrote this vault and pointed `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` at it.

## Verification

- `npm run build` and `npx tsc --noEmit`: clean. `npm test`: 116 pass, 0 fail.
- `npm run check-docs -- --pre-push`: passed.
- Packed tarball in a clean folder: `status` shows 20 runtimes, `init --runtimes=omp,claude`
  writes `.omp/`, `graph .` works.
- `.omp/mcp.json` kept a user-added server after a second `init` (`[MERGED]`).

## Not done

- Real-terminal arrow-key test, real omp session test, and the release itself.
- The vault is not committed.
