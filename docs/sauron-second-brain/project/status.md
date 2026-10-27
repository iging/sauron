# Status

Where the project stands. Update this note before every stop. See [[claude]].
Last updated: 2026-10-27.

## npm

- Published: `sauron-ai@3.1.0` on 2026-10-25. npm `latest` is `3.1.0`.
- Local version is `3.1.0`. Release commit `1a185e9` and tag `v3.1.0` are pushed.

## Git

- `main` on GitHub is at `1a185e9` (3.1.0 release).
- omp is merged through PR #9 at `26669a8`.
- Local worktree `.claude/worktrees/fix-readline-types` still exists. Its commit is on `main`.
- Branch `docs/portable-second-brain` contains the vault and cleanup documentation work.
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

## Numbers (checked 2026-10-25)

- `npm test`: 116 pass, 0 fail. `npx tsc --noEmit`: 0 errors.
- Runtimes registered: 20, plus the shared `AGENTS.md` core. See [[agent-runtimes]].
- Packed tarball smoke test passed: `status`, `init --runtimes=omp,claude`, `graph .`.

## Portable memory and cleanup

- [[resume-brief]] and [[task-file-map]] define the small startup read set.
- [[history-index]] indexes 66 branch/tag-reachable commits and three handoffs.
- [[cleanup-record]] records eleven recoverably removed files.
- Vault audit: 35 notes, 193 wiki links, zero missing links or duplicate note names.
- Vault, root entry points, ignore rules, and cleanup changes are prepared for review.

## Next

1. Release 3.1.0 is live. Registry checksum matches the tested tarball.
2. Real-terminal test of the arrow-key `init` (Git Bash and PowerShell).
3. Roadmap research and `/plan-feature` Parts 1 and 2. See [[open-items]].
