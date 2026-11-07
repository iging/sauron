# Install Review Fixes

Date: 2026-11-07. Branch: codex/4.0.0-phase-6-codex-copilot-agents.
Miguel requests one PR with two commits: Phase 6, then these install fixes.

## Eight review items

1. All four installers require Node 20.12.0. The scripts/install checks already match.
   Update bin checks and test both POSIX predicates and both PowerShell prerequisite blocks.
2. Remove the absent landing service and its Dockerfile. The landing repository is separate.
3. Use SAURON_WORKSPACE for the user-project bind mount. Document its clone-directory default.
4. Removing the landing Dockerfile also removes the masked build failure.
5. Keep only the root Compose file and update README and docker/README.md.
6. Copy package-lock.json before dependency installation and use npm ci without fallback.
7. Invoke Node directly in the image. Add LF attributes for .mjs and .sh source files.
8. Exclude worktrees, runtime state, editor files, internal notes, and local-only drafts.

## Verified

- Build, typecheck, strict CLI check, doc gate, and 231 tests pass on Node 24.15.0.
- All 231 tests also pass on Node 20.20.2 and 22.23.4.
- Docker Desktop engine 29.7.2 answers. docker compose config passes with the test-project mount.
- docker compose build sauron passes with npm ci. No dependency fallback runs.
- docker compose run --rm sauron status prints S A U R O N and STATUS with no entrypoint override.
- Independent scratch export measures 65268489 bytes of full filtered context, below 182 MB.
- The ordinary build transfers 471.58 kB of incremental context, a separate measurement.
- Local artifacts and report stay under .sauron/install-review/ and progress-report-result.md.

## Follow-up

- Actual Codex/Copilot discovery, models, and tool behavior remain unverified in real sessions.
- Real global-installer writes and Linux bind-mount mutation permissions remain unchecked.
- GitHub authentication, hosted checks, conflict/review state, and merge are checked after push.
