# Web & Model Interface Adapters

This guide covers Sauron's adapters for web-based AI coding interfaces, hosted models, and editor plugins.

---

## 1. Google Gemini

- **Generated Files**: `GEMINI.md` at project root, plus `.gemini/settings.json` (`context.fileName` loads `GEMINI.md` and `AGENTS.md`) and `.gemini/README.md` (skills alias `.agents/skills/`, Antigravity CLI note).
- **Behavior**:
  - Gemini loads `GEMINI.md` to ground its large context window in project architecture and Fellowship agent directives.

---

## 2. GitHub Copilot

- **Generated Files**:
  - `.github/copilot-instructions.md`: Master instructions for GitHub Copilot Chat and coding assistants.
  - `.github/hooks/agent-guard.json`: Hook definitions restricting hazardous command executions.

---

## 3. Hermes & Kimi

- **Generated Files**:
  - Hermes: `.hermesrules`.
  - Moonshot Kimi: `.kimi/prompt.md`.
- **Behavior**:
  - Formats instructions cleanly for long-context inference and multi-turn pair programming.

---

## 4. Qwen

- **Generated Files**: `QWEN.md` at project root (replaces legacy `.qwen/system.md`) and `.qwen/skills/README.md` (layout unverified against official docs).
- **Behavior**:
  - Sets system-level instructions for Qwen coding models.

---

## 5. Adal & CodeBuddy

- **Generated Files**:
  - Adal: `.adalrules`.
  - CodeBuddy: `.codebuddy/rules/sauron.md`, `.codebuddy/skills/README.md` (skills go in `.codebuddy/skills/<name>/SKILL.md`).
- **Behavior**:
  - Configures lightweight developer extensions with Sauron rules and safety boundaries.
