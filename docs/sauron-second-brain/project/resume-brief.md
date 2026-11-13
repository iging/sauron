# Resume Brief

Snapshot: 2026-11-11. Start after [[claude]]. Current source wins over older plans.

## Current truth

- Sauron translates config into instructions and assets for 20 coding runtimes.
- Package version remains 3.2.0. The approved development target is one 4.0.0 release.
- Phases 0 through 11 are merged. Phase 11 PR #30 merges at 28d9269.
- See [[phase-1-11-review]] for phase coverage and [[status]] for current evidence.
- The catalog has 248 installable skills across nine departments.
- Native agents: Claude Code, OpenCode, omp, Codex, Copilot. Commands: the first three.
- npm/shell installs require Node 20.12.0.
- Preserve local edits, four original stashes and the other worktree.

## Small startup read set

1. Read [[status]], [[open-items]], [[working-rules]],
   and [[communication]].
2. Identify the named task and read its row in [[task-file-map]].
3. Check git status and branch. Do not scan all code, skills, history or other worktrees.
4. Read relevant implementation and tests only. Build before tests that import dist.
5. Before stopping, update status, open items, lessons and the current session.

## Next work

- Phase 11 CI passes. Verify the npm tarball on the final release candidate.
- Phase 12 documentation readiness can be reviewed now. Release execution is not authorized.
- Real terminal/runtime/plugin and Eye real-file checks stay explicit in [[open-items]].
- Follow the remaining release sequence in [[open-items]] and [[release-and-publish]].
- Older one-minor-at-a-time plans and their release numbers are superseded.
