# CLI Type Checks and Local Test Cleanup

Date: 2026-11-07. Branch: codex/4.0.0-phase-3-skill-picker.

## Changes

- Add numbered-picker parameter and return types, plus arrow keypress types.
- Use Clack's exact cancellation symbol type in generic prompt helpers.
- Fix all 12 diagnostics reported against bin/sauron.mjs by the strict JS check.
- Keep runtime behavior unchanged. Document the fix in CHANGELOG.md.
- Retire 369 untracked generated test files with ConflictManager backups.
- Root test directory is empty but Windows refuses deletion or rename due to a process lock.
- Backup paths are recorded in .sauron/cli-lint-cleanup/test-retirement.json.

## Verification

- Strict allowJs/checkJs CLI check passes with NodeNext and ES2023.
- Adding noUncheckedIndexedAccess reports zero CLI errors, but ten existing graph-script errors.
- Graph-script diagnostics stay outside this task. The ordinary adapter typecheck passes.
- Build, ordinary typecheck, documentation gate, and all 180 tests pass on Node 24.15.0.
- Protected root manifest and VS Code settings hashes remain unchanged.
- Four stashes remain intact. Other worktrees are untouched.
- Miguel authorizes a follow-up commit and push on the current Phase 3 branch.

## Open

- Close the process holding the empty test directory, then remove that directory.
- Real-terminal picker checks remain pending.
