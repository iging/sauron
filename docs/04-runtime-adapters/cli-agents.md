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

- **Generated File**: `.clinerules` at project root.
- **Behavior**:
  - Cline reads `.clinerules` to enforce strict tool use, file access boundaries, and test verification before completion.

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
