# Session: Phase 3 Skill Picker

2026-11-07. See [[status]], [[open-items]], and [[decisions]].

## State

- Miguel requests main, pull, Phase 3, progress-report, commit, and branch push.
- A temporary stash preserves three vault notes. Main pulls to `8e0a482`.
- The temporary stash applies and is dropped. Four original stashes and both worktrees remain.
- Branch: `codex/4.0.0-phase-3-skill-picker`. No release or pull request creation occurs.
- Protected manifest and VS Code settings retain their original hashes.

## Implementation

- One shared picker state flow serves arrow and numbered interfaces.
- Select departments, pick skills, then choose another department, Back, or Done.
- Fresh departments start fully checked. Revisited subsets and empty selections stay selected.
- Removing a department removes its draft choices. Cancelling or declining saves no draft.
- Frontmatter names and folded descriptions supply labels and hints only for opened departments.
- Arrow Backspace aborts the current list and returns to departments, with key-listener cleanup.
  Numbered input supports back or 0, all, none, numbers, exact ids, and cancel.
- Explicit ids persist checked choices without following future department additions.
- Mixed flags and individual installation reuse Phase 2 support and gain CLI regression coverage.

## Verification

- Node 20.20.2, 22.23.4, and 24.15.0 each pass build, typecheck, doc gate, and 180 tests.
- Tests cover metadata, fresh defaults, saved subsets, empty choices, another department, Back,
  cancellation, invalid ids, exact installation, mixed flags, and saved config parity.
- A scripted Clack stream checks Backspace, returning to departments, subset selection, and exit.
  It does not verify real-terminal behavior.
- Catalog metadata validates for 245 installable skills across nine departments.
- Pack dry run lists 1074 files and zero named internal or local-only notes.
- Packed numbered selection installs only the checked skill and saves its exact id. Sync preview
  passes. Generated smoke artifacts remain local under `.sauron/phase-3-skill-picker/`.

## Delivery and follow-up

- Run the requested report, stage named Phase 3 files, commit, and push this branch.
- Keep unrelated vault edits, protected paths, local-only plans, handoffs, and smoke state out.
- Miguel checks rendering and controls in real Git Bash and PowerShell terminals.
- Hosted CI follows a pull request. The landing page count remains a separate-repo follow-up.
- Phase 4 adds install lifecycle commands after this phase merges.
