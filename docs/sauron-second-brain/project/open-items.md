# Open Items

Updated: 2026-11-11. Current evidence: [[status]], [[phase-1-11-review]].
Release procedure: [[release-and-publish]].

## Local delivery

- Phase 11 merges through PR #30 at 28d9269.
- PR #30 hosted Node 20/22/24 pass at e181c59.
- Phase 12 release execution stays pending. No version bump or publish now.
- Rebuild release artifacts and validate final hashes after the final approved release tree.
- Docker config validates with sauron-ai project and sauron-ai:local image.
- Docker build/status pass. Miguel's build log reports 1.31 MB transferred, below 182 MB.
  A local rerun prints the status banner with the default entrypoint.

## Real-tool gates

- UNVERIFIED: Eye on Miguel's own build and svla HAR. Miguel explicitly defers both
  on 2026-11-08 because paths are unavailable. Do not execute the build. Redact HAR reports.
- Picker: PowerShell arrow navigation and decline/exit pass. Git Bash arrows, Space,
  Backspace and Ctrl+C cancellation pass without writes. Git Bash also installs 11 selected
  skills and preselects the same saved plan on rerun. PowerShell repeats that 11-skill test.
- Uninstall on a real project with user edits. Synthetic preservation tests are separate.
- Claude Code plugin validates, installs and lists as enabled in isolated local state.
  Live /agents, /gandalf, /output-style and /plan-feature sessions remain open.
- OpenCode debug agents discovers Gandalf, Frodo and Samwise from the fixture.
  Real OpenCode slash command and refusal of a missing tool remain open.
- Real Claude Code missing-tool refusal. Bash command limits are not enforced by agent files.
- Real omp discovery and tools fields, plus Codex/Copilot discovery, models and tools.
- Runtime note/alias loading in Claude, Pi, Windsurf, Cline, Cursor, OpenCode and omp.
- Beta runtime promotion needs evidence. OpenCode remains the only stable tier.
- Memory starter human review and Sauron Obsidian UI check remain pending.
- Real-project security scan findings need human review.
- pnpm dlx and both install scripts need real installation checks.
- Unverified runtime paths: Trae, Pi, Kimi, Hermes, OpenClaw and AdaL.
  See docs/runtime-scaffolds.md. Antigravity has no adapter.

## Landing and launch

- Advisor 1.2.0 is synced. Compiler now indexes 248 installable owners, not supporting files.
- Catalog regression tests, typecheck, lint and static export pass locally.
- Landing browser/UI review and deployment remain unverified. No landing commit/push.
- Prior landing launch audit remains historical:
  ../sauron-landing/launch-audit-2026-11-02.md.
- Trademark/license/legal review and GitHub private vulnerability reporting need the owner.
- Optional plugin icon remains a follow-up, not evidence of a verified plugin install.
- Separate launch gaps: breach runbook, error alerts, CSP, X-Content-Type-Options and
  primary-action event. These are not missing Phase 1-11 implementations.
- Do not assume live privacy links or deployed data match local files without a live check.
- sauron-ai.vercel.app ownership remains unknown. Use the configured sauron-cli site.

## Closed implementation gaps

- Runtime matrix: 248 skills, five native-agent runtimes, three command runtimes.
- Landing advisor drift and recursive catalog overcount.
- Docker project/image naming and matching public documentation.
- Graph library CDN version is pinned. Fonts and library still load over the network.
- PowerShell installer tests fall back to powershell.exe when pwsh is unavailable.
- Public startup docs and current vault plans now follow the approved 4.0.0 scope.
- Chalk/commander removal and Clack 1.8.1 pin are complete.
- No Caveman savings benchmark exists. Publish no percentage without measured raw data.
- Preserve local edits, four stashes, and fix-readline-types worktree.
- Older release and research context: [[historical-open-items]], [[roadmap-brief]].
