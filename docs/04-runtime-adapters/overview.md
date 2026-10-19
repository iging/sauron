# Runtime Adapters Overview

Sauron operates as a single source of truth for AI instructions. Instead of manually maintaining separate instruction files across Cursor, Claude Code, Windsurf, Copilot, and other tools, you define rules once. Sauron transpiles them into runtime-specific files for 17 distinct AI environments.

---

## Supported Runtimes

Sauron supports 17 runtimes grouped into three operational categories:

1. **Desktop & IDE Environments**:
   - Cursor (`.cursor/rules/sauron.mdc`, `.cursor/rules/README.md`, `.cursor/skills/README.md`)
   - Windsurf (`.windsurfrules`)
   - Trae (`.traerules`)
   - Zed (`.zed/settings.json`, `.zed/prompts/sauron.md`)
   - VS Code (`.vscode/settings.json`)
   - Kiro (`.kirorules`)

2. **CLI Coding Agents**:
   - Claude Code (`CLAUDE.md`)
   - Cline (`.clinerules`)
   - OpenAI Codex (`.codex/config.toml`, `.codex/README.md`)
   - OpenCode (`.opencode/instructions.md`)
   - OpenClaw (`.openclaw/config.json`)
   - Pi (`.pirules`)

3. **Web & Model Interfaces**:
   - Google Gemini (`GEMINI.md`)
   - GitHub Copilot (`.github/copilot-instructions.md`, hooks, `.github/{instructions,prompts,agents,skills}/` with READMEs and a sample `sauron.instructions.md`)
   - Hermes (`.hermesrules`)
   - Moonshot Kimi (`.kimi/prompt.md`)
   - Qwen (`.qwen/system.md`)
   - Adal / CodeBuddy (`.adalrules`, `.codebuddy/rules.md`)

### Shared AGENTS.md Core

The `agents-md` adapter emits files shared across runtimes:

- `AGENTS.md`: root instructions (rules, Caveman Mode, Fellowship, anti-pattern guardrails). Read by Codex, Cursor, GitHub Copilot, Windsurf, Cline, OpenCode, Kiro, Zed, CodeBuddy, and Pi.
- `.agents/skills/README.md`: explains the Agent Skills format (`<name>/SKILL.md` with `name` and `description` frontmatter) and how `sauron add <skill>` installs there.
- `.agents/anti-patterns.md`: copy of `references/anti-patterns.md`. Omitted when that reference is missing.

---

## The Transpilation Engine

The transpiler reads:

1. `sauron.config.yaml`: Master configuration specifying project details and enabled runtimes.
2. `core/`: Base instructions and Fellowship persona definitions.
3. `skills/`: Capability skill instructions and trigger matrices.

The transpiler formats output according to the syntax expected by each target runtime (for example JSON settings for Zed, markdown system prompts for Gemini, YAML-wrapped frontmatter rules for Cursor).

---

## Safe Synchronization Pipeline

All transpiler outputs pass through `ConflictManager`:

1. Calculates a SHA-256 digest of generated content.
2. Compares against existing files on disk.
3. If content is identical, skips disk write.
4. If content differs, generates a timestamped backup in `.sauron/backups/` before writing.
5. Updates cryptographic audit records in `.sauron/manifest.json`.
