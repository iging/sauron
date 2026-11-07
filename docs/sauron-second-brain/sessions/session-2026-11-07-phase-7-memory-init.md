# Phase 7: Memory Init

Date: 2026-11-07. Base: main at c348db5 after PR #26.
Branch: codex/4.0.0-phase-7-memory-init. Miguel authorizes report, commit, push, and PR creation.

## Done

- sauron memory init defaults to docs/second-brain, with --path and --dry-run.
- Twelve linked starter notes include index, append-only log, startup guide, resume brief,
  status, open items, decisions, task map, lessons, rules, and the initial session.
- ConflictManager.createOnlyTree reserves a new destination and uses exclusive file writes.
- Existing destinations stay unchanged, including empty, incomplete, and edited vaults.
- Vault data is user knowledge outside installation tracking, so uninstall leaves it intact.
- Validate paths, protected locations, symlink ancestors, duplicate paths, and path collisions.
- Update README, command guide, CHANGELOG, and the task-to-file map.

## Verified

- Node 20.20.2, 22.23.4, and 24.15.0: build, typecheck, doc gate, and 245 tests pass per version.
- Strict CLI and both new test files pass JavaScript checking. Unused-code checks pass.
- All 14 memory tests pass, including junction rejection and concurrent creation.
- The earlier sandbox EPERM is resolved by native execution. No test is skipped or weakened.
- Tests verify wiki links, dates, existing-path preservation, custom paths, invalid options,
  manifest preservation, and survival through init, repair, and uninstall.
- Packed smoke passes dry-run, creation, no-op rerun, and uninstall persistence.
- Packed internal notes and local-only files remain excluded.
- Local artifacts: .sauron/phase-7-memory/. Do not stage that folder.

## Limits and follow-up

- I/O failures after reservation can leave a partial new vault. A rerun still keeps it unchanged.
- Parent-link checks are not an OS sandbox against another process changing parent paths.
- Obsidian UI rendering and human use of the starter are not verified here.
- Hosted checks and PR review follow the push. No release or automatic merge is part of this task.
