# Session: Phase 1 Fixes

2026-11-07. See [[status]], [[open-items]], and [[decisions]].

## State

- Miguel reports the Phase 0 pull request merged and requests main, pull, then continuation.
- Switch initially refuses three locally edited vault notes. A temporary named stash preserves
  those files. Main pulls with fast-forward only to `5dda456`.
- The temporary stash applies successfully and is dropped. All four original stashes remain.
- Branch: `codex/4.0.0-phase-1-fixes`. Miguel requests progress-report, commit, and push.
- Stage named Phase 1 files only. Keep unrelated vault edits and local-only state unstaged.
- No release or pull request creation occurs.
- Protected manifest and VS Code settings keep their prior hashes. Other worktrees stay intact.

## Changes

- Pi, Claude Code, Windsurf, Cline, and Cursor consolidate setup notes at their runtime roots.
- Existing retiredFiles and ConflictManager retireFile handle old notes. Edited notes stay.
- Twelve command names overlap installable skills. Stable `sauron-` wrapper aliases preserve
  both entry points. Reserved omp built-ins remain excluded.
- Alias collisions fail closed. Old wrappers stay when edited or when the alias cannot install.
- CLI status, listing, MCP index inputs, installer, and generated references share listSkills.
- The catalog has 245 installable entries across nine departments. Containers and nested
  supporting skill files do not count as separate entries.
- Runtime matrix now mirrors all 20 rows from the scaffold source, with verification labels.
- README, root guides, quickstart, catalog overview, changelog, and loader evidence update.

## Verification

- Node 20.20.2, 22.23.4, and 24.15.0 each pass build, typecheck, doc gate, and 147 tests.
- Tests cover five note migrations, dry runs, user edits, alias conflicts, blocked replacements,
  re-run behavior, and parity between catalog enumeration and CLI output.
- Pack dry run lists 1068 files and zero named internal or local-only notes.
- A packed install for seven runtimes verifies root notes and aliases. Packed status reports 245.
- Generated smoke files stay local under `.sauron/phase-1-fixes/`.
- Official loader sources are linked in `docs/runtime-scaffolds.md`.

## Open

- Miguel checks note discovery and skill or alias invocation in the real tools.
- The landing page still needs its count changed to 245. Its repository is outside the allowed
  workspace, so it is not edited here. Do not claim cross-repository count parity yet.
- Miguel opens the Phase 1 pull request after the authorized branch push. Hosted CI follows.
