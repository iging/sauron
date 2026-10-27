# Resume Brief

Snapshot: 2026-10-25, release commit `1a185e9`. Start after [[claude]].

## Current truth

- Sauron translates one config into instructions and assets for 20 coding runtimes.
- npm package: `sauron-ai`. Version and last verified npm latest: 3.1.0.
- Branch: `main`. omp merges in PR #9 at `26669a8`. Release tag: `v3.1.0`.
- Release build, typecheck, doc gate, and 116 tests pass on 2026-10-25.
- Packed setup and graph checks pass. Fresh registry installation reports 20 runtimes.
- Vault and cleanup changes stay uncommitted. Check `git status --short`.
- Local VS Code edits, stashes, and the extra worktree are user state. Preserve them.

## Small startup read set

1. Read [[status]], [[open-items]], [[working-rules]], and [[communication]].
2. Identify the user's task. Read one relevant row in [[task-file-map]].
3. Run `git status --short` and `git log -5 --oneline` for drift.
4. Read only the relevant implementation, test, and source section before editing.
5. Stop expanding context once the task, constraints, evidence, and next action are clear.

Do not scan all code, all skills, all history, or other worktrees at startup.
History pages are reference material. A normal resume does not require reading them.
Use `node bin/sauron.mjs find-skill "<task>"` to locate a specific workflow.

## Next work when requested

- Real-terminal arrows in Git Bash and PowerShell, then runtime session checks.
- Roadmap starts from [[roadmap-brief]], with two separate research and plan runs.
- Or pick a known gap from [[open-items]]. Do not bump or publish merely to resume.

## Portable opening prompt

`Read docs/sauron-second-brain/claude.md and follow its small startup read set.
Use the vault to identify the next step. Read only files needed for my named task.
Preserve local edits and stashes. Report uncertainty instead of scanning the repository.`
