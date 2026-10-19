# Runtime Scaffolds: Summary of Changes

Branch: `feat/runtime-scaffolds` → `main` · Date: 2026-10-19

## Version Bump: MAJOR (2.0.0 → 3.0.0)

This is a **breaking change**:
- `init` no longer generates `.cursorrules`, `.windsurfrules`, `.clinerules`, `.traerules`, `.kirorules`, `.pirules`, `.codex/instructions.md`, `.opencode/instructions.md`, `.qwen/system.md`, `.codebuddy/rules.md`, `.zed/prompts/sauron.md`, or `.vscode/sauron.instructions.md`. Users who rely on these files will stop getting updates.
- Codex, OpenCode, and Pi now get their instructions from `AGENTS.md` instead of their own file.

It is more than a MINOR change because existing behavior changed, not just new features. Release command: `npm run release:major`. Test first using `TESTING-RUNTIME-SCAFFOLDS.md`.

## Why

Before this change, `sauron init` wrote one legacy or invented file per runtime, such as `.codex/instructions.md`, `.kirorules`, and `.clinerules`. Most AI coding tools now read folders instead: rules, skills, agents, commands, and workflows. Most also read `AGENTS.md`. Sauron now writes each runtime's real scaffold, based on its official docs, with a `README.md` in every folder that explains how to add your own files.

## The Big Change: Shared Core

`init` now always writes these three files:

| File | Purpose |
|---|---|
| `AGENTS.md` | Main instructions. Read by Codex, Cursor, Copilot, Windsurf, Cline, OpenCode, Kiro, Zed, CodeBuddy, and Pi. |
| `.agents/skills/README.md` | Shared skills folder (`<name>/SKILL.md`). Read by Cursor, Copilot, Windsurf, and Gemini. |
| `.agents/anti-patterns.md` | Copy of `references/anti-patterns.md` |

## Per-Runtime Changes

| Runtime | Before | Now |
|---|---|---|
| Claude Code | `CLAUDE.md` | `CLAUDE.md`, `.claude/README.md`, `.claude/settings.json`, and a README in `rules/ skills/ agents/ workflows/ output-styles/ agent-memory/ docs/` |
| Codex | `.codex/instructions.md` | `.codex/config.toml` (commented template), `.codex/README.md`. Instructions come from `AGENTS.md`. |
| Cursor | `.cursorrules`, `.cursor/rules/sauron.mdc` | `.cursor/rules/sauron.mdc` (valid `alwaysApply: true` frontmatter), `.cursor/rules/README.md`, `.cursor/skills/README.md` |
| Copilot | `.github/copilot-instructions.md` | Same file, plus `.github/instructions/sauron.instructions.md` (`applyTo: "**"`) and READMEs in `instructions/ prompts/ agents/ skills/` |
| VS Code | `.vscode/settings.json`, `.vscode/sauron.instructions.md` | `.vscode/settings.json` only (duplicate removed) |
| Windsurf | `.windsurfrules` | `.windsurf/rules/sauron.md` (`trigger: always_on`, ≤12k chars), READMEs in `workflows/` and `skills/` |
| Cline | `.clinerules` | `.cline/rules/sauron.md`, `.cline/README.md`, READMEs in `workflows/ skills/ hooks/`. An existing `.clinerules` is left untouched. |
| Gemini | `GEMINI.md` | `GEMINI.md`, `.gemini/settings.json` (also loads `AGENTS.md`), `.gemini/README.md` |
| Qwen | `.qwen/system.md` | `QWEN.md`, `.qwen/skills/README.md` |
| OpenCode | `.opencode/instructions.md` | `opencode.json` (schema only), READMEs in `.opencode/agents/ commands/ skills/` |
| Kiro | `.kirorules` | `.kiro/steering/sauron.md` (`inclusion: always`), `.kiro/skills/README.md` |
| CodeBuddy | `.codebuddy/rules.md` | `.codebuddy/rules/sauron.md`, `.codebuddy/skills/README.md` |
| Zed | `.zed/settings.json`, `.zed/prompts/sauron.md` | `.zed/settings.json`, `.rules` |
| Trae ⚠️ | `.traerules` | `.trae/rules/project_rules.md` |
| Pi ⚠️ | `.pirules` | `.pi/prompts/README.md`, `.pi/skills/README.md` |
| Kimi, Hermes, OpenClaw, AdaL | unchanged | unchanged. Their docs need manual verification. |

⚠️ = The path came from unofficial sources. The file has an `<!-- unverified -->` note.

## Other Changes

- **`bin/sauron.mjs` `RUNTIMES`:** now lists 19 runtimes plus the `AGENTS.md` shared core. Added `vscode` and `codebuddy`, and AdaL is now its own entry.
- **`docs/runtime-scaffolds.md` (new):** the research table, with official source links and verified/unverified marks for each runtime.
- **Tests:** went from 64 to 86. There is a new scaffold test for each runtime, and the transpiler and e2e tests no longer check legacy paths.
- **Bug fixes:**
  - Cursor `globs: *` was invalid YAML.
  - The Copilot frontmatter broke when the project name contained a quote.

## Verification

- `npm run build`, `npx tsc --noEmit`, and `npm test` (86/86) all pass.
- E2E: `sauron init` in an empty folder creates the full tree, 57 files. Running it again reports UNCHANGED. A user file at one of these paths is backed up to `.sauron/backups/` before it is replaced.

## Known Issues (follow-ups)

1. **Existing user files are replaced.** If a user already has their own `.claude/settings.json`, `.gemini/settings.json`, `.zed/settings.json`, `opencode.json`, or `AGENTS.md`, `init` replaces it. There is a backup, but their own setup stops applying. Planned fix: deep-merge JSON configs, and use a `<!-- sauron:start/end -->` section in markdown files.
2. Cursor may read `.cursor/rules/README.md` as a rule. Consider moving it to `.cursor/README.md`.
3. `.cursorrules` still appears in `README.md`, `quickstart.md`, and `faq.md`.
4. Kimi, Hermes, OpenClaw, AdaL, and Antigravity still need manual verification against official docs.
