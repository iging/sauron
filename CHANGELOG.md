# Changelog

Notable changes to Sauron. Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Require Node.js 20.12.0 or newer and verify CI on Node 20, 22, and 24.
- Pin `@clack/prompts` to 1.8.1 and keep `@types/node` on major 20.
- Align plugin, Python, and installer versions with package version 3.2.0.

### Fixed

- Keep normalized npm executable paths without a leading `./`.

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
