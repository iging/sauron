# Open Items

Things not finished or not decided. Update before every stop. See [[claude]] and [[status]].
Last updated: 2026-11-07.

## Phase 2 review

- Phase 1 is merged and pulled. Phase 2 is ready. See [[session-2026-11-07-phase-2-config-v2]].
- Miguel checks saved defaults, arrows, backspace, cancel, decline, and exit in both terminals.
- Miguel verifies root notes and skill or command invocation in the real tools.
- Landing page still needs the 245 installable-skill count. Its repo is outside this workspace.
- Miguel authorizes the Phase 2 report, commit, and push. Pull request and hosted CI stay pending.

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
- `pnpm dlx sauron-ai` works for `--version` and an `init` dry run. Install scripts are unrun.
- Runtime paths still unverified: Trae, Pi, Kimi, Hermes, OpenClaw, AdaL. Antigravity has
  no adapter. See `docs/runtime-scaffolds.md`.

## Known gaps

- Collision aliases and note migration are built. Confirm them in Claude Code, Pi,
  Windsurf, Cline, Cursor, OpenCode, and omp before calling real-tool checks complete.
- Saved-choice defaults are built and piped-input tested. Real arrow-key checks remain.
- Caveman savings have no benchmark. Publish a figure only with a script and raw data.
- `graph.html` loads `vis-network` from unpkg with no version pin. Pin it or bundle it.

## Housekeeping

- Retired follower update is archived and removed. See [[cleanup-record]].
- Order of all planned work: [[implementation-order]].
- `launch-compliance-audit` has 44 items, and `website-launch-audit` has 40. Both ran on the
  landing page on 2026-11-02. The report is local: `../sauron-landing/launch-audit-2026-11-02.md`.
- Landing gaps from that run: no trademark search record, no breach runbook, no error alerts,
  no CSP or `X-Content-Type-Options`, and no event for the primary action.
- CLI and repo docs count 245 installable skills. The landing page count still needs its own update.
- Phase 0 removes `chalk` and `commander`. Dependabot #13 and #18 stay closed.
- Old holds for #16 and #17 end. Clack is pinned to 1.8.1 and `@types/node` stays on major 20.
- Plugin, Python, and installer versions now match 3.2.0. Future releases must keep them aligned.
- Older gaps: [[historical-open-items]].
- Sauron Obsidian UI check remains pending. Disk checks are separate.
- Remove the locked worktree `fix-readline-types` after closing its session.
- Landing launch work is live through PR #2. Analytics reports, and no cookies are set.
  `/privacy` links to `PRIVACY.md`, which returns 404 until the Sauron work merges.
- Turn on private vulnerability reporting in the GitHub repository security settings.
  `sauron-ai.vercel.app` is an unrelated placeholder. Ownership is unknown.
  Update `SKILL_COUNT_LABEL` in `src/constants/stats.ts` after each skill sync.

## Roadmap (after 3.1.0)

- Built for 3.2.0, uncommitted on `main`: [[plan-native-subagents]]. Run `/progress-report`.
  Open checks: slash commands in the OpenCode TUI, all of omp, arrow prompts in a terminal.
- README notes for OpenCode and omp now sit at `.opencode/README.md` and `.omp/README.md`.
  Same check still open for Pi, Claude Code, Windsurf, Cline, and Cursor. See [[roadmap-ecc]].
- [[plan-sauron-eye]] is approved for 3.3.0, not built. Future Eye work is listed in that note.
- Proposed roadmap, awaiting approval one tier at a time: [[roadmap-ecc]].
- Same native install for Codex (TOML) and Copilot, after OpenCode and omp are proven.
- Batch research, then `/plan-feature` Part 1 (product roadmap) and Part 2 (Agent
  Engineering Track). Briefs: `docs/handoffs/2026-10-20-sauron-v3-release-and-roadmap.md`
  sections 9 to 11. See [[roadmap-brief]]. Old PRD and TASKS are archived and removed.
  Create new local planning files only when the user requests that work.
- Candidate highlights: `sauron doctor`, `sauron uninstall`, Claude Code plugin, remote skill
  registry, subagents for other runtimes, MCP sync, CI matrix with npm provenance,
  `CHANGELOG.md` from Conventional Commits.
