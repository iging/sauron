# Status

Where the project stands. Update this note before every stop. See [[claude]].
Last updated: 2026-11-07.

## Phase 4 of 4.0.0

- Branch `codex/4.0.0-phase-4-install-lifecycle` adds `list-installed`, `doctor`, `repair`,
  and `uninstall`. Built by Claude Code on 2026-11-07 while Codex usage was out. Not merged.
- Node 24.15.0 passes build, typecheck, strict CLI check, doc gate, and 194 tests.
- Node 20 and 22 were not run locally. Hosted CI covers them on the pull request.
- See [[session-2026-11-07-phase-4-install-lifecycle]].

## Phase 3 of 4.0.0

- Phases 0 through 3 are merged. Main is pulled to `748ca5a` with fast-forward only.
- Current branch: `main`, matching origin/main. Phase 3 includes CLI follow-up `410d780`.
- Shared picker flow supports departments, individual skills, another department, Back, and Done.
- Frontmatter names and hints load on demand. Saved subsets and empty choices survive revisits.
- Picker saves explicit ids. Arrows use Backspace to return. Numbered input accepts back or 0.
- Node 20.20.2, 22.23.4, and 24.15.0 each pass build, typecheck, doc gate, and 180 tests.
- Scripted arrows and packed picker/install/sync preview pass. Real-terminal checks stay open.
- See [[session-2026-11-07-phase-3-skill-picker]]. Package version remains 3.2.0.

- Post-push CLI type fixes pass strict JS checks and 180 tests. Empty test folder stays locked.
- See [[session-2026-11-07-cli-lint-cleanup]]. Follow-up `410d780` is committed and pushed.

## npm

- Published: `sauron-ai@3.2.0` on 2026-11-02. npm `latest` is `3.2.0`.
- Local version is `3.2.0`. Release commit `de9de83` and tag `v3.2.0` are pushed.
- Published shasum `9c77c9e` comes from a tree with `npm pkg fix` applied to `bin` paths.

## Git

- Main is pulled to `748ca5a` after the Phase 3 merge. Release tag `v3.2.0` stays at `de9de83`.
- omp is merged through PR #9 at `26669a8`.
- Local worktree `.claude/worktrees/fix-readline-types` still exists. Its commit is on `main`.
- Build, typecheck, 116 tests, and the pre-push documentation gate pass on 2026-10-27.

## What 3.1.0 contains

| Change | Commit |
| :-- | :-- |
| Arrow-key `init` with `@clack/prompts@0.11.0` | `7dc57d4` |
| Graph galaxy layout and active department chips | `f3b7b31` |
| Graph skips framework build output | `0cab09f` |
| Graph import lines and alias-aware imports | `b6d0355` |
| `scripts/` included in the published files | `15361d3` |
| omp (oh-my-pi) runtime, 20 runtimes everywhere | `dd810b8`, `39b26fb` |

## Released: 3.2.0

- Native subagents and commands for OpenCode and omp are built.
  See [[plan-native-subagents]] and [[session-2026-11-01-native-subagents]].
- The scanned-folder README fix, the license and policy work, and two launch skills are built.
- Miguel chose on 2026-11-02: Eye and roadmap stay plan-only, and the rest ships in 3.2.0.
- Both launch skills ran on the landing page for the first time on 2026-11-02.
- [[plan-sauron-eye]] is approved for 3.3.0, not built.
- Order of the next work: [[implementation-order]].
- Registry install checked: `--version`, `status`, license file, and no internal notes.
- Not confirmed by this session: legal review, `init` terminal tests, and the OpenCode test.
- The GitHub release for `v3.2.0` is not created. This machine's shell has no `gh`.

## Numbers (checked 2026-11-02)

- `npm test`: 138 pass, 0 fail. `npx tsc --noEmit`: 0 errors.
- Runtimes registered: 20, plus the shared `AGENTS.md` core. See [[agent-runtimes]].
- Packed tarball smoke test passed: `status`, `init --runtimes=omp,opencode,claude`, `graph .`.
- Packed `init` writes 9 agents each, 123 OpenCode commands, and 119 omp prompts.

## Portable memory and cleanup

- [[resume-brief]] and [[task-file-map]] define the small startup read set.
- [[history-index]] indexes 66 branch/tag-reachable commits and three handoffs.
- [[cleanup-record]] records eleven recoverably removed files.
- Vault audit: 35 notes, 193 wiki links, zero missing links or duplicate note names.
- Vault, root entry points, ignore rules, and cleanup changes are prepared for review.

## Next

1. Release 3.2.0 is live. Create the GitHub release.
2. Real-terminal test of the arrow-key `init` (Git Bash and PowerShell).
3. Miguel opens and merges the Phase 4 pull request. Then Phase 5: profiles, plugin, and tiers.
