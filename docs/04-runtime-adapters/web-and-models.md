# Web & Model Interface Adapters

This guide covers Sauron's adapters for web-based AI coding interfaces, hosted models, and editor plugins.

---

## 1. Google Gemini

- **Generated File**: `GEMINI.md` at project root.
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

- **Generated File**: `.qwen/system.md`.
- **Behavior**:
  - Sets system-level instructions for Qwen coding models.

---

## 5. Adal & CodeBuddy

- **Generated Files**:
  - Adal: `.adalrules`.
  - CodeBuddy: `.codebuddy/rules.md`.
- **Behavior**:
  - Configures lightweight developer extensions with Sauron rules and safety boundaries.
