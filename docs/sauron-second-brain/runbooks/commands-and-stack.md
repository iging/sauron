# Commands and Stack

See [[claude]] and [[git-and-pr-flow]].

## Stack

- Node 20.12.0 or newer. TypeScript 7 strict, ES modules. `tsc` builds `adapters/` into `dist/`.
- Dependencies: `@clack/prompts` 1.x and `yaml`. Dev: `@types/node` major 20, `husky`,
  `typescript`.
- Tests: native `node --test`. They import from `dist/`, so build first.

## Repo commands

| Command | What it does |
| :-- | :-- |
| `npm ci` | Clean install from the lockfile |
| `npm run build` | Compile TypeScript into `dist/` |
| `npx tsc --noEmit` | Typecheck only |
| `npm test` | Every `tests/**/*.test.mjs` |
| `node --test tests/unit/<name>.test.mjs` | One test file |
| `npm run check-docs -- --pre-push` | Doc gate, the same check CI runs |
| `npm run security-scan` | Static scan for secrets and unsafe sinks |
| `node bin/sauron.mjs status` | Runtimes, Fellowship, skills |
| `npm run release:minor` | Release. See [[release-and-publish]] |

## Git hooks (husky)

- pre-commit: `npm test`, then `check-docs --pre-commit`.
- pre-push: `check-docs --pre-push`.
- Doc gate: a staged change in `adapters/`, `bin/`, `skills/`, or `core/` needs a staged doc
  change, or an entry in `docs/pending-docs.md`.

## CLI commands (from `sauron --help`)

- `init`: setup. Flags `--yes`, `--runtimes=a,b|all`, `--agents=fellowship|core|both|none`,
  `--skills=all|none|<dept,dept/skill,...>`, `--caveman=off|lite|full|ultra`, `--no-commands`,
  `--interactive`, `--dry-run`.
- `upgrade`: migrate config with backup and report. Flags `--dry-run`, `--to=1|2`.
- `sync`: apply v2 runtime toggles and skill choices. `add <skill>`: add skills (`--to <dir>`).
- `graph [path]`: code graph into `.sauron/graph/` (json, md, html).
- `list-skills`, `find-skill <task>`, `diff`, `mcp-index`, `trace-report`, `fitness`,
  `worktree-plan`, `slop-scan`, `import`, `registry-build`.

## Try the CLI on a scratch folder

Run from any empty folder. `$S` is the repo path.

- `node $S/bin/sauron.mjs init --dry-run --yes --runtimes=claude`: plan only.
- `node $S/bin/sauron.mjs init --yes --runtimes=omp --skills=none`: small real run.

## Slash commands in this repo

`.claude/commands/` holds `/progress-report`, `/commit`, `/plan-feature`, `/gandalf`,
`/test-gate`, `/security-audit`, `/lean-code`, `/find-skill`, `/codebase-graph`, `/adhd`,
`/browser-operator`.
