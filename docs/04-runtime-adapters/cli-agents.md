# CLI Coding Agent Adapters

This guide covers Sauron's integration with terminal-based autonomous coding agents.

---

## 1. Claude Code

- **Generated File**: `CLAUDE.md` at project root.
- **Behavior**:
  - Claude Code reads `CLAUDE.md` on every startup and before executing commands.
  - Contains setup commands (`npm run build`, `npm test`, `npx tsc --noEmit`), style guidelines, and Fellowship agent triggers.
  - Documents Caveman mode directives to conserve Claude Code token limits.

---

## 2. Cline

- **Generated Files**: `.cline/rules/sauron.md` plus scaffold READMEs in `.cline/`, `.cline/workflows/`, `.cline/skills/`, `.cline/hooks/`. Rules go to `.cline/rules/` (not `.clinerules/`) so a legacy `.clinerules` file never collides; move custom content from it into `.cline/rules/` and delete it.
- **Behavior**:
  - Cline loads every Markdown file in `.cline/rules/` to enforce strict tool use, file access boundaries, and test verification before completion.

---

## 3. OpenAI Codex

- **Generated Files**: `.codex/config.toml` (commented template) and `.codex/README.md`.
- **Behavior**:
  - Codex reads rules from `AGENTS.md` and skills from `.agents/skills`; `.codex/` holds only project config.

---

## 4. OpenCode & OpenClaw

- **Generated Files**:
  - OpenCode: `.opencode/instructions.md`.
  - OpenClaw: `.openclaw/config.json`.
- **Behavior**:
  - Provides structured instructions and JSON configuration for open-source terminal agents.

---

## 5. Pi

- **Generated File**: `.pirules`.
- **Behavior**:
  - Configures terminal agents running the Pi agent framework with strict verification gates.

---

## 6. omp (oh-my-pi)

- **Generated Files**: `.omp/mcp.json`, `.omp/skills/README.md`, `.omp/prompts/README.md`, `.omp/agents/README.md`.
- **Behavior**:
  - omp is a Rust-core terminal coding agent forked from Pi. It reads project instructions from the shared `AGENTS.md` core, so Sauron does not emit `.omp/AGENTS.md` (that file would shadow the root one).
  - `.omp/mcp.json` starts as `{ "mcpServers": {} }` and is deep-merged on re-runs, so servers you add are kept.
  - omp also discovers `.agents/skills/` and `.claude/skills/`, so Sauron skills reach it without a second copy.
  - Reactive TTSR rules (`.omp/rules/`), hooks (`.omp/hooks/`), and `.omp/config.yml` are left for you to author.
- **Docs**: https://omp.sh/docs/context-files, https://omp.sh/docs/skills, https://omp.sh/docs/prompt-templates, https://omp.sh/docs/subagent-authoring, https://omp.sh/docs/mcp
