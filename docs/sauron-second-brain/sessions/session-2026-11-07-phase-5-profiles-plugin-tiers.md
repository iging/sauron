# Session 2026-11-07: Phase 5 Profiles, Plugin, and Tiers

Claude Code built Phase 5 of 4.0.0. See [[status]] and [[open-items]].

## Done

- `INSTALL_PROFILES` and `parseProfile` in `adapters/init-plan.ts`: minimal, recommended,
  frontend, backend, full. `init --profile=<name>` skips the questions. Other flags still win.
- `RUNTIME_SUPPORT` in `adapters/init-plan.ts`: one tier and evidence per runtime. OpenCode is
  stable, 14 runtimes are beta, and Trae, Kimi, Hermes, OpenClaw, and AdaL are instruction-only.
  `sauron status` prints the tier.
- `adapters/plugin.ts` and `sauron plugin [--out <dir>]`: a Claude Code plugin with agents,
  commands, skills, and a README, plus a local marketplace. Commands with no frontmatter get a
  `description` from their first heading. Output stays inside the current folder.
- Docs: `profiles-and-plugin.md`, `runtime-tiers.md`, CLI reference, README, CHANGELOG.
- Tests: `tests/unit/profiles-plugin.test.mjs` (9) and `tests/e2e/profiles-plugin.test.mjs` (4).

## Checks

- Node 24.15.0: build, typecheck, strict CLI check with unused locals and parameters, doc gate,
  and 207 tests pass.
- `claude plugin validate` passes on the marketplace and the plugin. One warning: no icon.
- Not run: plugin install in a real Claude Code session, Node 20 and 22 locally.

## Decisions

- Plugin format verified against the Claude Code plugin docs on 2026-11-07.
- "One skill copy" already holds: only Claude Code gets a second copy, because it does not read
  `.agents/skills/`. Other runtimes that read it get none.
- Profiles are not saved by name. Their resolved choices are saved, so `sync` works unchanged.
