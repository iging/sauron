# Session 2026-11-07: Phase 5b Agent Tools and Models

Claude Code built Phase 5b of 4.0.0. See [[status]] and [[open-items]].

## Done

- All 78 specs in `core/fellowship/` and `core/agents/` gained `toolset`, `shell`, and `model`.
  Fellowship values match the approved table. Counts: 27 builder, 18 reviewer, 15 planner,
  13 tester, 5 git.
- `adapters/agent-access.ts`: toolsets, shell intents, model tiers, `detectShellCommands`,
  `modelsFromConfig`, and one renderer per runtime. Bad fields throw. Missing fields get the
  least access.
- `adapters/installer.ts`: agents render with access fields and an `## Access` body section.
  `buildInstallOutputs` takes an optional context of commands and models.
- `agents.models` added to both schema copies. Docs: `docs/02-fellowship-agents/agent-access.md`.
- Tests: `tests/unit/agent-access.test.mjs` (14). One installer test updated for the new
  OpenCode frontmatter.

## Checks

- Node 24.15.0: build, typecheck, strict CLI check with unused locals and parameters, doc gate,
  and 218 tests pass.
- `opencode debug agents` parsed Samwise's rules exactly, after OpenCode's own defaults.
- `claude plugin validate` passes on the plugin with the new agent fields.
- Not run: a Claude Code agent refusing a missing tool, omp reading `tools`, Node 20 and 22.

## Decisions

- Toolsets, models, and edit scopes live as typed constants in `adapters/agent-access.ts`, not in
  YAML files under `config/`. One source, checked by the compiler. Users override models only.
- Claude Code: bare tool names. Bash is all or nothing per agent, so command limits come from
  its permission prompts and the Access section.
- OpenCode: V2 `permissions` list. Shell asks by default, listed commands allow, `git push` deny.
- omp: `tools` only for read-only agents, using the names its docs show. Others inherit.
- Default models: Claude Code aliases only. OpenCode and omp inherit until the user sets ids.
- The `git` toolset edits docs, so Samwise can update `CHANGELOG.md`.
