# Open Items

Things not finished or not decided. Update before every stop. See [[claude]] and [[status]].
Last updated: 2026-10-27.

## Remaining release verification

- omp is merged in PR #9. Release commit and tag are pushed.
- Real-terminal test of the arrow-key `init` in Git Bash and PowerShell.
- 3.1.0 is published and verified as npm `latest`. Registry checksum matches the tarball.
- Do not repeat `release:minor`. The version is already 3.1.0.
- Full steps: [[release-and-publish]].

## Not verified yet

- Sauron output inside a real Claude Code session: `/agents`, `/gandalf`, `/output-style`,
  `/plan-feature`.
- omp output inside a real omp session (`/extensions` should list `.agents/skills/`).
- pnpm (`pnpm dlx sauron-ai init`) and both install scripts were only syntax-checked.
- Runtime paths still unverified: Trae, Pi, Kimi, Hermes, OpenClaw, AdaL. Antigravity has
  no adapter. See `docs/runtime-scaffolds.md`.

## Known gaps

- A skill and a command share a name (`caveman`, `handoff`, and others). Check which wins in
  Claude Code, then rename or dedupe.
- Interactive re-run of `init` shows Recommended, not the saved choices.
- `.cursor/rules/README.md` may load as a Cursor rule. Move it to `.cursor/README.md`.
- `references/runtime-matrix.md` table has 18 rows and some stale paths. Rebuild it from
  `docs/runtime-scaffolds.md`.
- `token-benchmarks.md` and `faq.md` claim 60% to 85% savings with no benchmark. Remove the
  figures or build a real benchmark.

## Housekeeping

- Retired follower update is archived and removed. See [[cleanup-record]].
- Vault and cleanup changes await pull request review from `docs/portable-second-brain`.
- Older gaps: [[historical-open-items]].
- Sauron Obsidian UI check remains pending. Disk checks are separate.
- Remove the locked worktree `fix-readline-types` after closing its session.
- Landing site still shows `npx sauron init`, which installs a different package.
  Signal to start: `go landing v3`.

## Roadmap (after 3.1.0)

- Batch research, then `/plan-feature` Part 1 (product roadmap) and Part 2 (Agent
  Engineering Track). Briefs: `docs/handoffs/2026-10-20-sauron-v3-release-and-roadmap.md`
  sections 9 to 11. See [[roadmap-brief]]. Old PRD and TASKS are archived and removed.
  Create new local planning files only when the user requests that work.
- Candidate highlights: `sauron doctor`, `sauron uninstall`, Claude Code plugin, remote skill
  registry, subagents for other runtimes, MCP sync, CI matrix with npm provenance,
  `CHANGELOG.md` from Conventional Commits.
