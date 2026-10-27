# Security Rules

What must never leak or break. See [[working-rules]] and [[claude]].

## Secrets

- Never write an npm token, OTP, API key, or password in a note, commit, or chat.
- If Miguel pastes a secret in chat, remind Miguel to rotate it.
- npm 2FA OTPs are typed by Miguel only, at publish time. See [[release-and-publish]].

## Guard hook

`.claude/hooks/guard.sh` blocks risky Bash commands. Do not work around it.

- Blocked: destructive git (`push --delete`, branch deletion, force push), credential reads,
  and any command that contains `process.env`.
- Ask Miguel to run a blocked command with a leading `!`.
- See [[lessons]] for commands that hang or break in Git Bash.

## Never commit

- Owner drafts: `context/PRD.md` and `context/TASKS.md`.
- Cleanup archives in `.sauron/cleanup-archives/`, tarballs, and temporary reports.
- Ignored by git already: `progress-report-result.md`, `.sauron/graph/`,
  `.claude/worktrees/`, `docs/sauron-second-brain/.obsidian/`.
- Packed tarballs (`sauron-ai-*.tgz`) and screenshots in the repo root.
- `.vscode/settings.json` changes, unless Miguel asks.

## Published package

- `package.json` `files` decides what ships. A missing folder breaks users (the `scripts/`
  bug fixed in `15361d3`). Test the packed tarball before every release.
- Adapters must fail closed: invalid JSON is skipped, never replaced. User edits win.
