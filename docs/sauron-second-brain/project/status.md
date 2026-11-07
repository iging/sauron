# Status

Where the project stands. Update this note before every stop. See [[claude]].
Last updated: 2026-11-07.

## Phase 0 of 4.0.0

- Branch: `codex/4.0.0-phase-0-baseline`. Miguel authorizes commit and push.
- Node 20.12.0 baseline, exact Clack 1.8.1 pin, dependency cleanup, CI matrix, and metadata align.
- Node 20.20.2, 22.23.4, and 24.15.0 each pass build, typecheck, doc gate, and 138 tests.
- Runtime audit finds zero vulnerabilities. Packed version, status, and init dry run pass.
- Real-terminal arrows and stdin exit remain Miguel's checks. See
  [[session-2026-11-07-phase-0-baseline]]. No release runs.

## npm

- Published: `sauron-ai@3.1.0` on 2026-10-25. npm `latest` is `3.1.0`.
- Local version is `3.1.0`. Release commit `1a185e9` and tag `v3.1.0` are pushed.

## Git

- `main` on GitHub is at `73350d9` (PR #10). Release tag `v3.1.0` is at `1a185e9`.
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

## In progress: 3.2.0 (not released)

- Native subagents and commands for OpenCode and omp are built.
  See [[plan-native-subagents]] and [[session-2026-11-01-native-subagents]].
- The scanned-folder README fix, the license and policy work, and two launch skills are built.
- Miguel chose on 2026-11-02: Eye and roadmap stay plan-only, and the rest ships in 3.2.0.
- Both launch skills ran on the landing page for the first time on 2026-11-02.
- [[plan-sauron-eye]] is approved for 3.3.0, not built.
- `package.json` stays at 3.1.0 until the release. Order: [[implementation-order]].
- Waiting on Miguel: legal review, `init` and OpenCode tests, merge, and the npm OTP.

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

1. Release 3.1.0 is live. Registry checksum matches the tested tarball.
2. Real-terminal test of the arrow-key `init` (Git Bash and PowerShell).
3. Roadmap research and `/plan-feature` Parts 1 and 2. See [[open-items]].
