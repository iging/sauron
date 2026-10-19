# CLI Command Reference

The Sauron command-line interface provides tools to initialize, inspect, and synchronize multi-runtime configurations.

---

## Global Syntax

```bash
node ./bin/sauron.mjs <command> [options]
```

Or if installed globally or aliased:

```bash
sauron <command> [options]
```

---

## Commands

### `init`

Initializes the Sauron harness within the current working directory.

```bash
npx sauron-ai init [options]        # or: pnpm dlx sauron-ai init
```

In a terminal, `init` asks a few questions, shows a plan, and writes nothing until you confirm:

```
? Setup        1) Recommended  2) Custom
? Runtimes     claude, cursor, ... or all          (Custom)
? Subagents    fellowship | core | both | none     (Custom, Claude Code)
? Skills       all | none | <departments>          (Custom)
? Commands     y | n                               (Custom, Claude Code)
? Caveman tier off | lite | full | ultra
? Write these files (y/n)
```

**Recommended** installs the shared `AGENTS.md` core, Claude Code, every skill, and the 9 Fellowship subagents.

**Actions Performed:**

1. Resolves the plan from prompts, flags, or the saved `init:` section of `sauron.config.yaml`.
2. Writes `AGENTS.md`, `.agents/skills/`, `.agents/anti-patterns.md`, and the scaffold of each selected runtime.
3. With Claude Code selected: installs skills into `.claude/skills/`, subagents into `.claude/agents/`, slash commands into `.claude/commands/`, and the Caveman output style.
4. Merges into existing files instead of replacing them (managed `sauron:start/end` blocks; JSON keys you set always win). Copied skills you edited are skipped. Every change is backed up to `.sauron/backups/`.
5. Saves the choices under `init:` in `sauron.config.yaml` and records files in `.sauron/manifest.json`.

**Options:**

- `--yes`, `-y`: No prompts. Uses the saved choices, or the Recommended preset.
- `--runtimes=claude,cursor` or `--runtimes=all`: Runtimes to generate. `AGENTS.md` is always included.
- `--agents=fellowship|core|both|none`: Subagents for `.claude/agents/`.
- `--skills=all|none|<dept,...>`: Skills to install.
- `--caveman=off|lite|full|ultra`: Default Caveman tier.
- `--no-commands`: Skip `.claude/commands/`.
- `--interactive`: Ask the questions even without a terminal (piped answers).
- `--dry-run`: Simulates the initialization without writing files.

Without a terminal and without flags, `init` uses the Recommended preset and prints a notice. An invalid flag value exits with code 1.

### `sync`

Re-applies the saved `init:` choices without prompts. Files you edited are merged or skipped, never replaced.

```bash
npx sauron-ai sync
```

---

### `status`

Displays runtime bindings, Fellowship sub-agent status, and skill metrics.

```bash
node ./bin/sauron.mjs status
```

**Information Displayed:**

- Harness version and header banner.
- All 17 runtimes with target configuration paths and sync states.
- Fellowship agents with assigned titles and roles.
- Skill ecosystem count across all 8 functional domains.

---

### `list-skills`

Lists all registered skills organized by functional domain.

```bash
node ./bin/sauron.mjs list-skills
```

**Output Structure:**
Displays alphabetical domains (Architecture, Backend, Database, DevOps, Frontend, Quality, Security, Workflow) alongside all active skills within each domain.

---

### `find-skill`

Ranks local skills against a task description and prints the files to read.

```bash
node ./bin/sauron.mjs find-skill "<task>" [--limit n] [--json] [--root dir]
```

**Options:**

- `--limit n`: Maximum results. Default 5.
- `--json`: Machine-readable output with `indexed`, `rejected`, and `results`.
- `--root dir`: Skills directory to search. Default order: `.agents/skills` in the working directory, then `skills`, then the skills bundled with Sauron.

**Output Structure:**
Each result shows name, score, trigger command, path, and description. The last line is a paste-ready instruction that names the top file. Scoring is weighted BM25 over skill name, Trigger Matrix phrases marked YES, and description. The command reads files only and writes nothing.

---

### `sync`

Synchronizes changes from `sauron.config.yaml` and skill directories into all enabled runtime adapter files.

```bash
node ./bin/sauron.mjs sync [options]
```

**Actions Performed:**

1. Reads `sauron.config.yaml`.
2. Evaluates diffs between existing runtime instructions and current specifications.
3. Routes all file writes through `ConflictManager`.
4. Creates timestamped backups in `.sauron/backups/` if existing files were manually edited.
5. Updates `.sauron/manifest.json`.

**Options:**

- `--dry-run`: Calculates and displays file actions (`created`, `updated`, `unchanged`) without modifying files on disk.

---

## Global Flags

- `--version`: Displays the current version of the Sauron engine.
- `--help`: Displays the CLI help menu and usage instructions.
