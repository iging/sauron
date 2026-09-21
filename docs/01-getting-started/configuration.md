# Configuration Reference

Sauron centralizes configuration in a single file: `sauron.config.yaml`. This file defines project properties, enabled AI runtimes, and active Fellowship sub-agents.

---

## File Location and Schema

The configuration file resides at the root of your project:

```text
my-project/
├── sauron.config.yaml
├── .sauron/
│   └── manifest.json
```

Sauron validates this file against the JSON schema located at `schema/sauron.schema.json`.

---

## Configuration Fields

### 1. Project Metadata

The `project` block identifies target stack details:

```yaml
version: "1.0.0"

project:
  name: "my-application"
  description: "Web application orchestrated by Sauron"
  language: "typescript" # typescript | python | rust | go | multi
  framework: "nextjs" # optional framework hint (for example nextjs, react, express)
```

- `name`: Target project identifier.
- `description`: Plain-text project summary for AI agents.
- `language`: Primary programming language.
- `framework`: Primary runtime framework.

### 2. Runtimes

The `runtimes` block enables or disables synchronization targets. Set any runtime to `true` or `false`:

```yaml
runtimes:
  claude: true # Generates CLAUDE.md
  cursor: true # Generates .cursorrules and .cursor/rules/sauron.mdc
  windsurf: true # Generates .windsurfrules
  copilot: true # Generates .github/copilot-instructions.md and hooks
  cline: true # Generates .clinerules
  trae: true # Generates .traerules
  zed: true # Generates .zed/settings.json and .zed/prompts/sauron.md
  codex: true # Generates .codex/instructions.md
  gemini: true # Generates GEMINI.md
  hermes: true # Generates .hermesrules
  kimi: true # Generates .kimi/prompt.md
  kiro: true # Generates .kirorules
  openclaude: true # Generates .openclaude/config.json
  opencode: true # Generates .opencode/instructions.md
  pi: true # Generates .pirules
  qwen: true # Generates .qwen/system.md
  adal: true # Generates .adalrules
  codebuddy: true # Generates .codebuddy/rules.md
```

When you run `sauron sync`, Sauron only touches runtimes marked `true`.

### 3. Fellowship Sub-Agents

The `fellowship` block configures the 9 persona agents:

```yaml
fellowship:
  gandalf:
    enabled: true
    role: "Master Planner and Strategy Guide"
    alias: ["planner", "lead"]
  aragorn:
    enabled: true
    role: "Principal System Architect"
    alias: ["architect", "design"]
  legolas:
    enabled: true
    role: "Precision Linter and Syntax Bug Hunter"
    alias: ["linter", "syntax"]
  gimli:
    enabled: true
    role: "Refactorer and AST Dead Code Slasher"
    alias: ["refactor", "cleanup"]
  boromir:
    enabled: true
    role: "Security Auditor and Shield"
    alias: ["security", "audit"]
  frodo:
    enabled: true
    role: "Core Task Executor and Ringbearer"
    alias: ["executor", "coder"]
  samwise:
    enabled: true
    role: "Git Commits and State Keeper"
    alias: ["commits", "git"]
  merry:
    enabled: true
    role: "QA and TDD Specialist"
    alias: ["qa", "tester"]
  pippin:
    enabled: true
    role: "Edge Case and Chaos Prober"
    alias: ["chaos", "tools"]
```

---

## Applying Changes

After modifying `sauron.config.yaml`, apply changes to all targets:

```bash
node ./bin/sauron.mjs sync
```

To verify intended changes before writing to disk:

```bash
node ./bin/sauron.mjs sync --dry-run
```
