# Phase 6: Codex and Copilot Agents

Date: 2026-11-07. Base: main at ea347ee, Phase 5b merged in PR #25.
Branch: codex/4.0.0-phase-6-codex-copilot-agents. Miguel authorizes commit, push, PR, and gated merge.

## Built

- Native Codex TOML and Copilot .agent.md installs for fellowship, core, both, and none.
- Reuse agent-access.ts for shell intents, model tiers, and Access instructions.
- Codex uses standalone name, description, and developer_instructions with no config registration.
- Copilot uses explicit tool aliases. Reviewers have no edit tool. No-shell specs omit execute.
- Models inherit unless configured. Both schema copies accept the new model and native ids.
- Saved native choices stay authoritative. Missing v2 lists keep pre-Phase 6 targets only.
- Agent-only targets skip command output and the interactive slash-command question.
- Raw files use existing ConflictManager tracking, repair, and uninstall behavior.

## Decisions and limits

- Follow current official standalone Codex docs, not older role-registration examples.
- Codex inherits parent permissions. No-shell specs disable features.shell_tool.
- No documented Codex edit allowlist or per-agent permission override is emitted.
- Path scopes, shell command limits, and Samwise's no-push rule remain body instructions.
- Copilot alias lists restrict tools, but not edit paths or individual shell commands.
- Neither target gets command wrappers. Portable Copilot command support is not established.
- Both runtimes remain beta. Sources and manual checks are in the public agent guide.

## Verified

- Node 20.20.2, 22.23.4, and 24.15.0: build, typecheck, doc gate, and all 228 tests pass.
- Strict CLI, unused-code checks, and strict checks of both new test files pass.
- Python tomllib parses all 78 packed Codex files plus the parent config.
- All 78 Copilot files parse. Longest prompt is 2083 characters, below the 30000 limit.
- Packed init, sync preview, and doctor pass. Internal notes and local-only files stay excluded.
- Numbered agent selection and decline pass without an unsupported commands question.
- All 156 packed agent files match current source output with the same project context.
- Root manifest hash stays unchanged. Local VS Code and vault entry edits stay untouched.
- Four original stashes and other worktrees remain intact.
- Local artifacts: .sauron/phase-6-codex-copilot/. Do not stage them.

## Pending

- Miguel verifies discovery, model selection, and tool restrictions in real Codex and Copilot.
- Phase 5b tool refusal and plugin real-session checks remain open.
- Phase 7 waits for the Phase 6 and install-fix pull request to pass checks and merge.
