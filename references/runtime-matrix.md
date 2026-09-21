# The 17 AI Coding Runtime Adapter Matrix

> Authoritative specification and feature parity matrix for the 17 AI coding runtimes supported by **Sauron AI**.

---

## 1. Overview & Single-Source-of-Truth Doctrine

Modern AI-assisted engineering suffers from runtime fragmentation. When development teams use disparate IDEs and CLI agents—such as Cursor, Windsurf, Claude Code, and GitHub Copilot—rules drift, architectural constraints are forgotten, and security policies are bypassed.

Sauron solves this by compiling a single declarative configuration (`sauron.config.yaml`) into native instructions tailored to each runtime's parser, token window, and file structure.

---

## 2. Comprehensive 17-Runtime Comparison Table

| #   | Runtime / Tool       | Primary Configuration File        | Additional Paths / Commands | Format          | Frontmatter MDC | Slash Commands | Output Strategy                                           |
| :-- | :------------------- | :-------------------------------- | :-------------------------- | :-------------- | :-------------: | :------------: | :-------------------------------------------------------- |
| 1   | **Claude Code**      | `CLAUDE.md`                       | `.claude/commands/`         | Markdown        |       ❌        |   ✅ Native    | Compact root Markdown with modular sub-command scripts    |
| 2   | **Cursor**           | `.cursorrules`                    | `.cursor/rules/*.mdc`       | Markdown / MDC  |    ✅ Native    |    ✅ Rules    | Hierarchical glob-matched `.mdc` rules with root fallback |
| 3   | **Windsurf**         | `.windsurfrules`                  | `.windsurf/memories/`       | Markdown        |       ❌        |  ✅ Workflows  | Signal-dense Markdown with Cascade memory hooks           |
| 4   | **GitHub Copilot**   | `.github/copilot-instructions.md` | `.vscode/settings.json`     | Markdown        |       ❌        |   🟡 Limited   | Repository-wide custom instructions for VS Code & CLI     |
| 5   | **Cline**            | `.clinerules`                     | `.cline/room-rules/`        | Markdown        |       ❌        |   ✅ Custom    | Strict autonomous boundary instructions                   |
| 6   | **Trae**             | `.traerules`                      | `.trae/`                    | Markdown        |       ❌        |  ✅ Workflows  | Adaptive workspace rules for ByteDance Trae               |
| 7   | **Zed**              | `.zed/settings.json`              | `.zed/prompts/`             | JSON / Prompts  |       ❌        |   ✅ Prompts   | Structured prompt templates and editor setting overrides  |
| 8   | **Codex**            | `.codex/instructions.md`          | `.codex/tasks/`             | Markdown        |       ❌        |   🟡 Limited   | Deterministic instruction set for OpenAI Codex CLI        |
| 9   | **Gemini CLI**       | `GEMINI.md`                       | `.gemini/commands/`         | Markdown        |       ❌        |    ✅ Slash    | Persistent high-context instructions for Google Gemini    |
| 10  | **Hermes**           | `.hermesrules`                    | `.hermes/`                  | Markdown        |       ❌        |   🟡 Limited   | Spartan execution rules for Hermes agent harness          |
| 11  | **Kimi**             | `.kimi/prompt.md`                 | `.kimi/context/`            | Markdown        |       ❌        |   🟡 Limited   | High-density long-context prompt for Moonshot Kimi        |
| 12  | **Kiro**             | `.kirorules`                      | `.kiro/hooks/`              | Markdown        |       ❌        |    ✅ Hooks    | Autonomous agent guidelines and execution bounds          |
| 13  | **OpenClaude**       | `.openclaude/config.json`         | `.openclaude/instructions/` | JSON / Markdown |       ❌        |  ✅ Commands   | Open-source Claude API harness instructions               |
| 14  | **OpenCode**         | `.opencode/instructions.md`       | `.opencode/rules/`          | Markdown        |       ❌        |    ✅ Modes    | Universal open-source terminal coding harness             |
| 15  | **Pi**               | `.pirules`                        | `.pi/`                      | Plaintext       |       ❌        |   🟡 Limited   | Spartan plain-text instruction constraints                |
| 16  | **Qwen**             | `.qwen/system.md`                 | `.qwen/`                    | Markdown        |       ❌        |   🟡 Limited   | System instructions optimized for Alibaba Qwen-Coder      |
| 17  | **Adal & CodeBuddy** | `.adalrules`                      | `.codebuddy_rules.md`       | Markdown        |       ❌        |   🟡 Limited   | Dual-engine rules for enterprise CodeBuddy environments   |

---

## 3. Transpilation & Synchronization Pipeline

```text
       sauron.config.yaml (Master Spec)
                      │
                      ▼
           Sauron Transpiler Engine
                      │
    ┌─────────────────┴─────────────────┐
    ▼                                   ▼
Text-Based Runtimes             Frontmatter / MDC Runtimes
- CLAUDE.md                     - .cursor/rules/*.mdc
- .windsurfrules                - .trae/
- .github/copilot-instructions.md
                      │
                      ▼
           ConflictManager Audit
           - Checks SHA-256 diff
           - Backs up existing files (.bak)
                      │
                      ▼
            Local Disk Mutation
```

---

## 4. Execution Strategies by Environment

### 4.1 CLI Terminal Agents (Claude Code, Gemini CLI, OpenCode)

- Injected with explicit slash commands (`/plan`, `/commit`, `/refactor`, `/caveman`).
- Enforces strict shell boundaries to prevent unverified bash execution.
- Intercepted by `scripts/hooks/agent-guard.mjs`.

### 4.2 Visual Editors (Cursor, Windsurf, Trae, VS Code)

- Injected with file-glob matching rules.
- Scoped rules ensure backend rules only activate on backend files, frontend rules on frontend components.
- Zero barrel-file (`index.ts`) rules enforced via editor linters.

### 4.3 Containerized / Headless Agents (Docker, CI/CD)

- Injected with non-root UID 10001 execution constraints.
- Sandboxed filesystem targets only designated mounted volumes.
