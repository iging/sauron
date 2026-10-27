# Cleanup Record

2026-10-25. User requests root cleanup and portable project memory.
See [[resume-brief]] and [[history-index]].

## Removed from working locations

- `RELEASE-V3-COMMANDS.md` (3467 bytes).
- `RELEASE-V3.1-ARROW-INIT.md` (15602 bytes).
- `RUNTIME-SCAFFOLDS-CHANGES.md` (8390 bytes).
- `TESTING-RUNTIME-SCAFFOLDS.md` (5453 bytes).
- `progress-report-result.md` (5956 bytes).
- `sauron-ai-3.0.0.tgz` (2293678 bytes).
- `sauron-ai-3.1.0.tgz` (2351981 bytes).
- `docs/updates/2026-10-05-sauron-update.md` (15145 bytes).
- `docs/sauron-second-brain/welcome.md` (209 bytes).

11 files, 4717768 bytes removed from working locations.
Recoverable copies remain under ignored .sauron/cleanup-archives/2026-10-25/.
Cleanup routes through a local ConflictManager subclass. Archive bytes are checked
before each original is removed. Tarball copies use Base64. Decode to restore binaries.
This cleans working locations, not total disk usage. Git retains tracked history.

## Additional user-authorized cleanup

- `context/PRD.md` (7465 bytes).
- `context/TASKS.md` (10422 bytes).

The user authorizes these deletions after the initial cleanup. Main init features ship,
but this does not mark all old draft acceptance gates complete.

## Information retained

- Release flow: [[release-and-publish]]. Tests: [[verification-checklist]].
- Runtime changes: [[history-releases-and-init]] and [[agent-runtimes]].
- Follower update: [[history-skills-and-discipline]].
- Git metadata: [[history-index]]. Original handoffs stay in docs/handoffs/.

## Kept deliberately

- Owner drafts remain during initial cleanup, then retire with explicit user authorization.
- Runtime instructions, dependencies, compiled output, graph, user VS Code settings.
- Every stash and the additional readline worktree.
- ConflictManager backups and state manifest.

Only the retired follower update is a tracked source deletion. Changes stay uncommitted.

Obsidian workspace keeps its layout. References to retired welcome.md now target claude.md.
