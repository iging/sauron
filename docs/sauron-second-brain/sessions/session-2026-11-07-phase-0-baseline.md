# Session: Phase 0 Baseline

2026-11-07. See [[status]], [[open-items]], and [[commands-and-stack]].

## Scope and state

- Follow the approved 4.0.0 handoff, Phase 0 only.
- Branch: `codex/4.0.0-phase-0-baseline`, based on local HEAD `98dcfd8`.
- Keep the existing bin path fix, vault edits, local notes, four stashes, and both worktrees.
- Protected manifest and VS Code settings retain their starting SHA-256 hashes.
- Manual source writes use ConflictManager with an in-memory batch and backed replacements.
  The batch never persists the installation manifest.
- Miguel authorizes a named-file Phase 0 commit and branch push after the first report.
- Keep protected paths, local-only files, and unrelated vault edits out of the index.
- No pull request, version bump, or publish occurs.

## Changes

- Require Node 20.12.0 and add CI for Node 20, 22, and 24 with strict npm ci.
- Upgrade Clack from 0.11.0 to exact 1.8.1. Remove unused chalk and commander.
- Keep the existing Node 20 type package. The old Dependabot holds for #16 and #17 end.
- Align plugin, Python, POSIX, and PowerShell installer versions to package version 3.2.0.
- Both installers enforce the new Node floor. Update README and Unreleased changelog.

## Checks

- Build, typecheck, doc gate, and 138 tests pass on Node 20.20.2, 22.23.4, and 24.15.0.
- Clack imports and cancellation API pass on exact Node 20.12.0.
- Scripted select, down arrow, multiselect, confirm, decline, and cancel pass on Node 24.
- Backspace uses readline setPrompt and prompt. Arrow setup retains stdin pause and unref.
- PowerShell installer parses. Its boundary comparison rejects 18.20.0 and 20.11.1,
  and accepts 20.12.0, 20.12.1, 22.0.0, and 24.0.0.
- Runtime dependency audit finds zero vulnerabilities.
- Pack dry run lists 1068 files and no named local-only notes.
- Packed install passes version, status, and a Claude init dry run without writing output.
- Upstream compatibility reference: [Clack releases](https://github.com/bombshell-dev/clack/releases).

## Pending

- Miguel checks init arrows, backspace, cancel, decline, and process exit in both terminals.
- GitHub CI still needs an actual pull request run. Miguel opens the pull request.
