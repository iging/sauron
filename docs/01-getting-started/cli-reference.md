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
node ./bin/sauron.mjs init [options]
```

**Actions Performed:**

1. Verifies existing project configuration. If missing, writes a default `sauron.config.yaml`.
2. Transpiles universal instructions to all enabled target runtimes.
3. Records written files, SHA-256 hashes, and timestamps in `.sauron/manifest.json`.

**Options:**

- `--dry-run`: Simulates the initialization without writing files or modifying git state.

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
