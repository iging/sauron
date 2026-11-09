# Config v2 and Migration

Config version `2.0.0` controls runtime and skill selection. It is separate from the npm package
version, which stays at 3.2.0 until the approved 4.0.0 release.

## Existing projects

```bash
sauron upgrade --dry-run
sauron upgrade
sauron sync --dry-run
sauron sync
```

A v1 `init` or `sync` fails with an upgrade instruction, including dry runs. Malformed YAML,
unknown schema fields, invalid toggles, and unknown skill selectors fail before writes.
An upgrade changes the config only. It does not install or remove runtime files.

Each migration keeps the exact previous config in a ConflictManager backup and writes a JSON
report under `.sauron/upgrade-reports/`. The console prints both paths. Reports contain the
versions, checksums, backup path, and change descriptions. They do not copy config values.
A dry run creates no config changes, backups, manifest changes, or report files.
Running upgrade on a valid config already at the requested version leaves it byte-identical.

## Canonical choices

```yaml
version: "2.0.0"
project:
  name: my-project
runtimes:
  claude: true
  cursor: false
skills: [workflow]
init:
  agents: fellowship
  commands: true
  nativeRuntimes: [claude]
caveman:
  default_mode: full
```

- `runtimes`: boolean toggles for the 20 known runtime ids. Omitted ids are disabled.
- `skills`: `all`, `none`, or a non-empty list mixing departments and `department/skill` entries.
  The installer deduplicates overlap between a department and one of its individual skills.
- `init.agents`: `fellowship`, `core`, `both`, or `none`.
- `init.commands`: whether to install bundled command wrappers.
- `init.nativeRuntimes`: native-agent opt-in for enabled Claude Code, OpenCode, omp, Codex, or Copilot targets.
  Command wrappers are available for Claude Code, OpenCode, and omp.
- `caveman.default_mode`: `off`, `lite`, `full`, or `ultra`.

An empty runtime mapping, or all-false toggles, still generates the shared core. Existing output
from a disabled runtime stays on disk. Use [uninstall](install-lifecycle.md) to remove unchanged managed output.

Use actual names from `sauron list-skills` for an individual entry. The department is shown
above each skill list. [Interactive picking](skill-picker.md) saves the checked individual ids.
Config and script flags also accept individual entries.

## Preserved choices

Saved v1 `init.runtimes` and `init.skills` move to their top-level v2 fields. They take precedence
over the formerly unused root runtime toggles. Without saved init choices, existing root toggles
become active, while skills, agents, and commands remain disabled. If no toggles exist, the
legacy all-runtime scaffold selection is retained. Old configs without native-runtime opt-in
keep their earlier Claude-only native behavior. Migration does not add OpenCode or omp assets.

Project metadata, security settings, unrelated YAML comments, and line-ending style remain.
Saving init choices checks the original config checksum before replacing it and keeps a backup.
If the file changes while prompts are open, setup fails so you rerun it against the new content.

Both interactive flows default to saved choices on rerun. Custom prompts offer saved runtime,
agent, skill, command, and Caveman defaults. Explicit flags override the saved choices.

## Restore config v1

```bash
sauron upgrade --to=1 --dry-run
sauron upgrade --to=1
```

The reverse conversion also creates a backup and report. It restores legacy init choices.
Config v1 cannot represent an individual skill selection or an empty runtime list. Conversion
fails rather than broadening those selections. Select departments and at least one runtime first,
or restore the earlier backup with your file tools. Runtime files do not change during conversion.
Use a legacy CLI with v1, or run upgrade again before this CLI's init and sync commands.

## Verification still done by hand

Check saved defaults, arrows, backspace, cancellation, decline, and process exit in Git Bash
and PowerShell. Automated piped-input tests exercise the numbered flow, not a real terminal.
