# Session 2026-11-07: Phase 4 Install Lifecycle

Claude Code built Phase 4 of 4.0.0 while Codex usage was out. See [[status]] and [[open-items]].

## Done

- `adapters/lifecycle.ts`: `inspectInstall`, `doctorFindings`, `planUninstall`, `applyUninstall`.
  File states are clean, edited, merged, missing, and unsafe.
- `ConflictManager` gains `removeManagedBlock`, `forgetFile`, and `pruneEmptyParents`. Every disk
  change still goes through it, with a backup.
- CLI commands: `list-installed`, `doctor`, `repair`, `uninstall`. `uninstall` previews unless
  `--yes`. `repair` reuses `sync` with saved choices, then runs `doctor`.
- Uninstall keeps edited files, merged JSON, `sauron.config.yaml`, `.sauron/`, and any manifest
  path that leaves the workspace.
- Docs: `docs/01-getting-started/install-lifecycle.md`, CLI reference, README, CHANGELOG.
- Tests: `tests/unit/lifecycle.test.mjs` (10) and `tests/e2e/lifecycle.test.mjs` (4).

## Checks

- Node 24.15.0: build, typecheck, strict CLI check, doc gate, and 194 tests pass.
- Not run here: Node 20 and 22. Hosted CI runs them on the pull request.
- Not run: `uninstall --yes` on a real project with user edits. Miguel checks one.

## Decisions

- `doctor` exits 1 only on errors. Warnings and info exit 0.
- A damaged manifest stops `repair` and `uninstall`. The user restores it from version control.
- Empty folders are removed only above files uninstall removed.
