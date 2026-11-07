# Session: Phase 2 Config v2

2026-11-07. See [[status]], [[open-items]], and [[decisions]].

## State

- Miguel requests main, pull, Phase 2, then progress-report, commit, and branch push.
- A temporary stash preserves only three vault notes. Main pulls to `6e4b3de`.
- The temporary stash applies and is dropped. Four original stashes and both worktrees remain.
- Branch: `codex/4.0.0-phase-2-config-v2`. No release or pull request creation occurs.
- Protected manifest and VS Code settings retain their original hashes.

## Implementation

- Config `version: 2.0.0` is separate from the package version, which remains 3.2.0.
- Both schema copies validate v1 and v2. V2 rejects old init runtime and skill locations.
- Top-level runtime toggles and skills control init/sync. An empty runtime set emits shared core.
- Skills accept all, none, or mixed department and individual entries from the real catalog.
- Minimal individual-skill installation and flag support move ahead of Phase 3 so v2 is usable.
  Per-skill interactive picking stays in Phase 3.
- Upgrade previews or converts with an exact backup and a JSON report. It does not sync output.
- Reverse conversion restores v1 choices and rejects individual skills or empty runtime sets.
- V1 init/sync fail with an upgrade instruction. Unknown fields and invalid values fail closed.
- YAML edits preserve unrelated comments and values. Checked config replacements keep backups
  and reject changes made while confirmation is open.
- Interactive reruns offer saved choices first. Custom prompts inherit saved defaults.

## Verification

- Node 20.20.2, 22.23.4, and 24.15.0 each pass build, typecheck, doc gate, and 166 tests.
- New tests cover migration both ways, native opt-in, invalid YAML/schema/catalog values,
  comments and CRLF, dry runs, runtime toggles, mixed skill selection, and prompt defaults.
- A child-process test edits config during confirmation and verifies no overwrite or output.
- Pack dry run lists 1071 files and zero named internal or local-only notes.
- Packed fresh init and sync preview pass. Packed forward/reverse migration, exact backups,
  reports, and selected-runtime sync pass under `.sauron/phase-2-config-v2/`.

## Delivery and follow-up

- Run the requested progress-report, stage named Phase 2 files, commit, and push this branch.
- Keep unrelated vault edits, protected paths, local-only plans, handoffs, and smoke state out.
- Miguel verifies saved defaults and terminal controls in Git Bash and PowerShell.
- Hosted CI follows a pull request. The landing page count update remains in its separate repo.
- Phase 3 adds the per-skill interactive picker after this phase merges.
