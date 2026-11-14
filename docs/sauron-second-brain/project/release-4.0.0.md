# Sauron 4.0.0 release overview

Status: 4.0.0 release candidate. See the changelog and release verification notes.

Sauron 4.0.0 lets teams configure 20 coding runtimes from one project config, choose
individual skills, and manage what Sauron installs. It also adds tools to inspect
project agent configuration and analyze files without executing them.

## Breaking changes

- **Node.js 20.12.0 or newer.** Update Node before installing via npm or the shell
  installers. Docker includes Node.
- **Config v2.** Run `sauron upgrade` before using `init` or `sync` on an existing
  v1 config. In v2, top-level runtime toggles and skill selections control which
  files Sauron generates.
- **Command and scaffold paths.** Bundled command wrappers that collide with a
  skill use the `sauron-` prefix. Skill names stay the same. Sync retires eligible
  old files with backups and preserves files users edited.

Preview the migration from the project folder before applying it:

```sh
sauron upgrade --dry-run
sauron upgrade
sauron sync --dry-run
sauron sync
```

Migration backs up the original config and writes a report. See the
[config v2 migration guide](../../01-getting-started/config-v2.md).

## What ships

| Area                         | Changes in 4.0.0                                                                                                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setup and catalog            | Interactive per-skill picker in arrow-key and numbered modes, saved choices, mixed department and individual selectors, and five named setup profiles. One catalog reports 248 installable skills across nine departments. |
| Install lifecycle            | `list-installed` shows managed files and their state. `doctor` reports problems. `repair` restores missing files from saved choices. `uninstall` previews changes and preserves user-edited files.                         |
| Native agents                | Codex TOML and GitHub Copilot agent files join Claude Code, OpenCode, and omp. Agent specs define toolsets, shell intents, and model tiers. Enforcement depends on the runtime. Support tiers appear in `sauron status`.   |
| Claude Code plugin           | `sauron plugin` builds a plugin and local marketplace with Sauron agents, commands, and skills.                                                                                                                            |
| Second brain                 | `sauron memory init` creates a starter vault with an index and log. Existing destinations are preserved, and the vault stays outside uninstall tracking.                                                                   |
| Agent configuration review   | `sauron scan` checks selected prompts, hooks, MCP configuration, and permissions. It reports findings and scan limits in text, JSON, or SARIF.                                                                             |
| Sauron Eye                   | Bounded static inspection of formats including HAR, JavaScript, archives, and executables. Reports include evidence and limits. Supports comparison, report export and reuse, and MCP over stdio.                          |
| New skills and workflows     | `folder-structure-advisor` proposes project layouts from context. `llm-wiki` supports source-linked wiki maintenance. The context workflows can hand off to the folder advisor.                                            |
| Distribution and maintenance | npm, shell installers, Docker, and the existing GitHub harness bundle. The Docker CLI supports an explicit project mount. Adapter source is easier to read, and the graph viewer uses a pinned library version.            |

See the [changelog](../../../CHANGELOG.md) for the full change list and the
[CLI reference](../../01-getting-started/cli-reference.md) for commands.

## Before publication

- Verify the npm release and record the landing rollout separately.
- Run CI and install and smoke-test the exact 4.0.0 npm tarball. The earlier
  successful tarball rehearsal used version 3.2.0.
- Record the remaining real-tool checks, including OpenCode slash commands and
  Codex/Copilot agent behavior. The real Eye build and HAR checks are deferred
  until the input files are available. See [open items](open-items.md).
