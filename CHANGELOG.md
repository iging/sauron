# Changelog

Notable changes to Sauron. Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [4.0.0] - 2026-11-14

### Changed

- Expand adapter source spacing and parser declarations, preserving comments and executable syntax.
- Document evidence contracts, parser boundaries and contributor conventions in focused comments.


- Use config v2 runtime toggles and top-level skill selections as the install source of truth.
- Require existing v1 projects to run `sauron upgrade` before `init` or `sync`.
- Preselect saved choices when interactive `init` runs again.

- Keep scaffold notes at the Pi, Claude Code, Windsurf, Cline, and Cursor runtime roots.
- Use one installable catalog for status, skill lists, and generated skill references: 248 skills
  across nine departments. Rebuild the 20-runtime matrix from the scaffold reference.
- Prefix colliding bundled command wrappers with `sauron-` while keeping skill names unchanged.
- Retire unchanged old notes and command wrappers during sync, with backups. Keep user edits.

- Require Node.js 20.12.0 or newer and verify CI on Node 20, 22, and 24.
- Pin `@clack/prompts` to 1.8.1 and keep `@types/node` on major 20.
- Align plugin, Python, and installer versions with the npm package.

### Fixed

- Correct runtime counts, migration guidance, CLI native-agent help, and Docker project/image names.
- Pin the graph library CDN assets to vis-network 10.1.5.
- Fall back to Windows PowerShell for installer checks when pwsh is unavailable.



- Align all installers with Node 20.12.0 and use one CLI-only Docker Compose configuration.
- Select the user-project mount with SAURON_WORKSPACE, lock Docker installs to npm ci, invoke
  Node directly on Windows clones, and exclude local state and worktrees from build contexts.

- Correct CLI picker JSDoc and narrow Clack cancellation symbols during JavaScript type checks.
- Remove an unused `yaml` import from the CLI entry point.

- Keep normalized npm executable paths without a leading `./`.

### Added



- Add Sauron Eye with bounded static parsers, evidence ledgers, diff/export/reuse and MCP stdio.
- Add folder-structure-advisor and its proposal step after both context workflows.
- Add the attributed, re-authored llm-wiki skill and selected-install guide pointers.

- Add read-only sauron scan for selected agent prompts, hooks, MCP config, and permissions.
- Emit redacted text, JSON, and SARIF review hints, explicit coverage diagnostics, and CI exits
  with bounded file traversal and no execution, network access, or repair actions.

- Add sauron memory init with a portable second-brain startup set, index, and append-only log.
- Create new vaults exclusively through ConflictManager, preserve existing destinations, and
  keep user knowledge outside runtime install tracking so uninstall cannot delete it.

- Native Codex TOML and Copilot .agent.md subagents, with shared access notes and model tiers.
- Preserve saved native opt-ins and edited agents across sync, repair, and uninstall.

- Agent specs state a toolset, shell intents, and a model tier. Claude Code agents get `tools`
  and `model`, OpenCode agents get `permissions` rules, omp read-only agents get `tools`, and
  every agent gets an Access section. Shell intents resolve to the project's own commands.
- `agents.models` in `sauron.config.yaml` sets the real model per runtime and tier.

- `init --profile=minimal|recommended|frontend|backend|full`, named setups that skip the questions.
- Runtime support tiers (stable, beta, instruction-only) with evidence, shown by `sauron status`.
- `sauron plugin`, which builds a Claude Code plugin and a local marketplace that pass
  `claude plugin validate`.

- `sauron list-installed` and `sauron doctor`, read-only checks of Node, config, manifest, and
  installed files. `doctor` exits with code 1 on an error.
- `sauron repair`, which applies saved choices again so missing files and blocks come back.
- `sauron uninstall`, a preview by default. With `--yes` it removes unchanged Sauron files and
  managed blocks, keeps edited files, config, and `.sauron/`, and backs up every change.

- Per-skill interactive init in both arrow-key and numbered flows, with frontmatter names
  and description hints. Revisit departments, keep checked subsets, select none, or cancel.
- Backspace returns from an arrow skill list to departments. Numbered input accepts back or 0.
- Save picker choices as explicit skill ids so future sync does not widen a checked subset.

- `sauron upgrade` with dry-run preview, exact config backups, and migration reports.
- `sauron upgrade --to=1` for reversible department-based configs, with lossy conversion refused.
- Schema and catalog validation before configuration or runtime writes.
- Mixed department and individual skill selections in config and script flags.

### Removed

- Unused `chalk` and `commander` dependencies.

## [3.2.0] - 2026-11-02

### Added

- Native Fellowship subagents and slash commands for OpenCode and omp.
- `nativeRuntimes` in saved `init:` choices. A config saved before this change stays Claude-only on `sync`.
- `launch-compliance-audit` and `website-launch-audit` skills.
- `LICENSE`, `PRIVACY.md`, `DISCLAIMER.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`, this changelog, and GitHub issue and pull request templates.

### Changed

- The published package now includes its license files.
- Package metadata states the license choice: MIT, Apache-2.0, or the Unlicense.
- Internal project notes in `docs/handoffs/` and `docs/sauron-second-brain/` no longer ship in the npm package.

### Fixed

- OpenCode and omp notes moved to `.opencode/README.md` and `.omp/README.md`. In `agents/` or `commands/`, a note loaded as an agent or a command. `sync` removes the old notes unless you edited them.
- `licenses/LICENSE-APACHE-2.0` now holds the full license text.

### Removed

- Token savings figures that had no benchmark behind them.

## [3.1.0] - 2026-10-25

### Added

- Arrow-key `init` setup.
- `omp` (oh-my-pi) runtime, for 20 runtimes in total.
- Graph galaxy layout and active department chips.

### Fixed

- Backspace no longer erases the setup question.
- The terminal returns after setup finishes.
- `sauron graph` works from the npm package, because `scripts/` is now published.
- The graph skips framework build output and resolves path aliases and workspace imports.

## [3.0.0] - 2026-10-20

### Changed

- `init` writes each runtime's documented scaffold, and stopped writing 12 legacy files such as `.cursorrules`.
- Writes merge into existing files and keep backups in `.sauron/backups/`.
- Caveman Mode is on by default.
- Claude Code gets native subagents, slash commands, and skills.
