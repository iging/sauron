# Runtime Scaffolds

Research date: 2026-10-19. Each Sauron adapter emits the project scaffold that its runtime officially documents. Every emitted folder contains a `README.md` that explains how to extend it.

**V** means the path is verified in official documentation. **U** means the path is unverified (for example, it comes only from blogs or community sources). Sauron emits U paths only with a `<!-- unverified: <source> -->` note.

## Shared Core

`AGENTS.md` and `.agents/skills/` form the shared core. Codex, Cursor, OpenCode, Kiro, Zed, CodeBuddy, Pi, omp, and Gemini (via its alias) read these paths. Sauron emits them once from the `agents` adapter.

## Findings

| Runtime | Sauron primary path | Scaffold | Status | Source |
|---|---|---|---|---|
| Shared core | `AGENTS.md` | `AGENTS.md`, `.agents/skills/` | V (AGENTS.md) | https://learn.chatgpt.com/docs/agent-configuration/agents-md |
| Claude Code | `CLAUDE.md` | `CLAUDE.md`, `.claude/{rules,skills,agents,workflows,output-styles,agent-memory,docs}/`, `.claude/settings.json`, `.mcp.json`. `commands/` is legacy and replaced by skills. | V | https://code.claude.com/docs/en/claude-directory |
| Codex | `.codex/config.toml` | `AGENTS.md` (V), `.agents/skills/` (U), `.codex/config.toml` (U) | V/U | https://learn.chatgpt.com/docs/agent-configuration/agents-md |
| Cursor | `.cursor/rules/sauron.mdc` | `.cursor/rules/*.mdc` (`description`, `globs`, `alwaysApply`), `.cursor/skills/`. Also reads `AGENTS.md` and `.agents/skills`. `.cursorrules` is legacy. | V | https://cursor.com/docs/context/rules |
| GitHub Copilot | `.github/copilot-instructions.md` | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.github/prompts/*.prompt.md`, `.github/agents/*.agent.md`, `.github/skills/` | V | https://code.visualstudio.com/docs/copilot/customization/overview |
| VS Code | `.vscode/settings.json` | Uses the `.github/` Copilot scaffold above. | V | https://code.visualstudio.com/docs/copilot/customization/overview |
| Windsurf (Devin Desktop) | `.windsurf/rules/sauron.md` | `.windsurf/rules/*.md` (`trigger:` frontmatter), `.windsurf/workflows/`, `.windsurf/skills/`. These paths are legacy but still read. `.devin/` is the preferred path. | V | https://docs.devin.ai/desktop/cascade/memories |
| Cline | `.cline/rules/sauron.md` | `.clinerules/` directory **or** `.cline/rules/`, plus `.cline/{workflows,skills,hooks}/` | V | https://docs.cline.bot/features/cline-rules |
| Gemini CLI | `GEMINI.md` | `GEMINI.md`, `.gemini/skills/` (alias `.agents/skills/`) (V). `.gemini/settings.json` and `.gemini/commands/*.toml` (U). The free tier moved to Antigravity CLI on 2026-06-18. | V/U | https://geminicli.com/docs/cli/gemini-md |
| Qwen Code | `QWEN.md` | `.qwen/skills/` (V). `QWEN.md` and `.qwen/{settings.json,agents,commands}` (U). | V/U | https://qwenlm.github.io/qwen-code-docs |
| OpenCode | `opencode.json` | `AGENTS.md`, `opencode.json`, `.opencode/{agents,commands,skills,modes,plugins,tools}/` | V | https://opencode.ai/docs/rules |
| Kiro | `.kiro/steering/sauron.md` | `.kiro/steering/*.md` (`inclusion:`), `.kiro/skills/`. Also reads `AGENTS.md`. | V | https://kiro.dev/docs/steering |
| CodeBuddy | `.codebuddy/rules/sauron.md` | `CODEBUDDY.md` (falls back to `AGENTS.md`), `.codebuddy/rules/`, `.codebuddy/skills/<n>/SKILL.md` | V | https://www.tencentcloud.com/document/product/1256/77282 |
| Zed | `.rules` | Reads the first match of `.rules`, …, `AGENTS.md` (V). `.zed/settings.json` (U). | V/U | https://zed.dev/docs/ai/rules |
| Trae | `.trae/rules/project_rules.md` | `.trae/rules/project_rules.md` (multiple unofficial sources) | U | none (needs an official source) |
| Pi | `.pi/prompts/README.md` | `AGENTS.md`, `.pi/skills`, `.agents/skills`, `.pi/prompts/` | U | none (needs an official source) |
| omp (oh-my-pi) | `.omp/mcp.json` | `AGENTS.md`, `.omp/skills/<n>/SKILL.md`, `.omp/prompts/*.md`, `.omp/agents/*.md`, `.omp/mcp.json`. Also discovers `.agents/skills/` and `.claude/skills/`. `.omp/rules/` (TTSR) and `.omp/hooks/` are not scaffolded. | V | https://omp.sh/docs/context-files |
| Kimi | `.kimi/prompt.md` | Legacy path kept | U | none |
| Hermes | `.hermesrules` | Legacy path kept | U | none |
| OpenClaw | `.openclaw/config.json` | Legacy path kept | U | none |
| AdaL | `.adalrules` | Legacy path kept | U | none |

## Needs Verification

These runtimes have no reliable repo-level paths in official documentation. Sauron keeps their legacy paths unchanged, and each one needs to be checked by hand:

- **Kimi**: `.kimi/prompt.md`
- **Hermes**: `.hermesrules`
- **OpenClaw**: `.openclaw/config.json`
- **AdaL**: `.adalrules`
- **Antigravity**: no adapter yet. It replaces the Gemini CLI free tier, and its project paths have not been documented.
