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

The repository schema lives at `schema/sauron.schema.json`. The CLI validates against its
bundled copy at `config/schema/sauron.schema.json`, then checks runtime ids and skill selectors.
See [Config v2 and migration](config-v2.md) before syncing an existing v1 project.

---

## Configuration Fields

### 1. Project Metadata

The `project` block identifies target stack details:

```yaml
version: "2.0.0"

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
  claude: true # CLAUDE.md and .claude/
  cursor: false # .cursor/rules/sauron.mdc and .cursor/README.md
  windsurf: false # .windsurf/rules/sauron.md and .windsurf/README.md
  opencode: false # opencode.json and .opencode/
  omp: false # .omp/mcp.json and .omp/
  pi: false # .pi/README.md

```

When you run `sauron sync`, only runtime ids marked `true` receive output. Omitted ids are
disabled. The shared `AGENTS.md` core always applies, even when all runtime toggles are false.
Disabling a runtime does not delete its existing output. See [runtime paths](../runtime-scaffolds.md)
for all 20 supported ids.

### 3. Install Choices

`skills` accepts `all`, `none`, or a list of departments and `department/skill` entries.
Use exact entries from `sauron list-skills`. The same selections work with `--skills=`.

```yaml
skills: [security, workflow/caveman]
init:
  agents: fellowship
  commands: true
  nativeRuntimes: [claude]
```

Invalid selectors fail before writes. `init.nativeRuntimes` preserves opt-in to native assets for Claude Code,
OpenCode, omp, Codex, and Copilot. Command wrappers install only for the first three.
It is filtered to enabled runtimes. `init.runtimes` and `init.skills`
belong to config v1 and are rejected in v2. Interactive init offers saved choices first.

### 4. Fellowship Sub-Agents

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
