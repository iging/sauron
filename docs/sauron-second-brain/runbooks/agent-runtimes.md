# Agent Runtimes

The 20 runtimes Sauron writes for, and how to add one. See [[claude]] and [[decisions]].
Paths, sources, and verified status: `docs/runtime-scaffolds.md`.

## The list (order of `RUNTIME_IDS`)

claude, cursor, windsurf, copilot, vscode, cline, trae, zed, codex, gemini, qwen, kimi, kiro,
hermes, openclaw, opencode, pi, omp, adal, codebuddy. Plus the shared `agents` core.

## Who reads the shared core

- `AGENTS.md`: Codex, Cursor, GitHub Copilot, Windsurf, Cline, OpenCode, Kiro, Zed, CodeBuddy,
  Pi, and omp.
- `.agents/skills/` verified: Cursor, GitHub Copilot, Windsurf, Gemini CLI, omp.
- Claude Code reads `CLAUDE.md` and `.claude/`, not `AGENTS.md`. Gemini reads `GEMINI.md`.

## Add a runtime (checklist from the omp work, 2026-10-25)

1. Read the official docs. Note project paths, frontmatter, and what the tool already reads
   from other tools (to avoid duplicate files).
2. New `adapters/<id>.ts`. Copy the shape of `adapters/opencode.ts`: a `FOLDERS` list and one
   `README.md` per folder. `targetFiles` must equal the emitted paths.
3. Register it: import and add to `adapterList` in `adapters/transpiler.ts`, add the id to
   `RUNTIME_IDS` in `adapters/init-plan.ts`, add rows to `RUNTIMES` and `RUNTIME_HINTS` in
   `bin/sauron.mjs`.
4. Add the id to both schemas (`schema/` and `config/schema/`) and both config templates.
5. If it reads `AGENTS.md`, update the reader lists in `adapters/agents-md.ts` and the
   matching test in `tests/unit/agents-md.test.mjs`.
6. Tests: a new `tests/unit/<id>-scaffold.test.mjs`, the `expectedPaths` list in
   `tests/unit/transpiler.test.mjs`, the counts in the CLI and e2e tests.
7. Docs: `docs/runtime-scaffolds.md` row, `docs/04-runtime-adapters/` section, the README list.
8. Update the runtime count everywhere: `git grep -nE "\b(19|20) (AI |coding )?runtime"`.

## Test gotchas

- The transpiler and e2e tests require files longer than 50 characters with the word
  "Sauron". A small JSON file (for example `.omp/mcp.json`) needs its own assertion.
- JSON outputs are deep-merged by `ConflictManager`. Test a re-run with a user key added.

## Switching runtimes

To move work to another agent, see [[switching-agents]].
