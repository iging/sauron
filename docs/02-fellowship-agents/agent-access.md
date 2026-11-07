# Agent Tools, Commands, and Models

Every Sauron agent, the 9 Fellowship members and the 69 specialists, states what it may touch. Each
spec in `core/fellowship/` and `core/agents/` has three fields:

```yaml
toolset: builder # planner | reviewer | builder | tester | git
shell: [test, build] # command intents, not raw commands
model: balanced # fast | balanced | deep
```

## Toolsets

| Toolset    | Read and search | Edit and write            | Shell                   |
| :--------- | :-------------- | :------------------------ | :---------------------- |
| `planner`  | yes             | docs and context only     | its intents             |
| `reviewer` | yes             | no                        | its intents             |
| `builder`  | yes             | yes                       | its intents             |
| `tester`   | yes             | test files only           | its intents             |
| `git`      | yes             | docs only, for changelogs | its intents, never push |

## Shell intents

`init` and `sync` turn each intent into this project's commands. Intents with no matching tool are
left out.

| Intent      | Example commands                                |
| :---------- | :---------------------------------------------- |
| `test`      | `npm test`, `pnpm test`, `pytest`               |
| `lint`      | `npm run lint`, `ruff check`                    |
| `typecheck` | `npm run typecheck`, `npx tsc --noEmit`, `mypy` |
| `build`     | `npm run build`                                 |
| `audit`     | `npm audit`, `pip-audit`                        |
| `git-read`  | `git status`, `git diff`, `git log`, `git show` |
| `git-write` | `git add`, `git commit`                         |

## Fellowship

| Agent   | Toolset  | Shell                        | Model    |
| :------ | :------- | :--------------------------- | :------- |
| Gandalf | planner  | git-read                     | deep     |
| Aragorn | planner  | git-read                     | deep     |
| Boromir | reviewer | audit, git-read              | deep     |
| Legolas | reviewer | lint, typecheck, git-read    | balanced |
| Frodo   | builder  | test, build, lint, typecheck | balanced |
| Gimli   | builder  | test, typecheck              | balanced |
| Merry   | tester   | test                         | balanced |
| Pippin  | tester   | test                         | balanced |
| Samwise | git      | git-read, git-write          | fast     |

## What each runtime receives

| Runtime     | Tools                                                               | Commands                                                                                                 | Model                                           |
| :---------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| Claude Code | `tools:` with Read, Grep, Glob, plus Edit, Write, Bash when allowed | Bash is all or nothing in an agent file. Each command still goes through Claude Code permission prompts. | `fast: haiku`, `balanced: sonnet`, `deep: opus` |
| OpenCode    | `permissions:` denies edits, or limits them to docs or tests        | Shell asks by default. Listed commands are allowed. `git push` is denied for `git`.                      | Inherits unless set in config                   |
| omp         | `tools: [read, grep, glob]` for read-only agents only               | omp has no per-command rule in agent files                                                               | Inherits unless set in config                   |
| Codex | No per-tool allowlist. No-shell specs disable features.shell_tool. | Parent permissions inherited. Path and command limits are instructions. | Inherits unless set in config |
| Copilot | Explicit read, search, edit, execute aliases by toolset | Shell is all or nothing. Path and command limits are instructions. | Inherits unless set in config |

Every runtime also gets an `## Access` section in the agent body that states the same limits.
OpenCode's parsing of these rules was checked with `opencode debug agents` on 2026-11-07.

## Choose models

OpenCode and omp need a provider model id, which depends on your account. Set one per tier in
`sauron.config.yaml`, then run `sauron sync`:

```yaml
agents:
  models:
    claude:
      deep: claude-opus-5-5
    opencode:
      fast: anthropic/claude-haiku-5-5
      balanced: anthropic/claude-sonnet-5-5
      deep: anthropic/claude-opus-5-5
```

A tier you do not set keeps the default, or inherits the session model.
Codex and Copilot accept the same tier mappings under agents.models.codex and agents.models.copilot.
See [Codex and Copilot agents](codex-copilot-agents.md) for native formats and limits.
