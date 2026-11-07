# Runtime Support Tiers

Each runtime has a tier that says how far Sauron's output for it is proven. `sauron status` shows
the tier next to each runtime. The source of truth is `RUNTIME_SUPPORT` in
`adapters/init-plan.ts`.

| Tier               | Meaning                                                                 |
| :----------------- | :---------------------------------------------------------------------- |
| `stable`           | A recorded check in the real tool shows it loads Sauron's files.        |
| `beta`             | Paths follow the tool's official docs. No recorded run in the tool yet. |
| `instruction-only` | No official source. Sauron writes an instruction file and nothing more. |

## Current tiers

| Tier               | Runtimes                                                                                                          |
| :----------------- | :---------------------------------------------------------------------------------------------------------------- |
| `stable`           | OpenCode                                                                                                          |
| `beta`             | Claude Code, Cursor, Windsurf, GitHub Copilot, VS Code, Cline, Zed, Codex, Gemini, Qwen, Kiro, Pi, omp, CodeBuddy |
| `instruction-only` | Trae, Kimi, Hermes, OpenClaw, AdaL                                                                                |

## Recorded checks

| Date       | Runtime  | Check                                                           |
| :--------- | :------- | :-------------------------------------------------------------- |
| 2026-11-01 | OpenCode | `opencode debug agents` listed the installed Fellowship agents. |

## Promote a runtime

1. Run `sauron init` with that runtime in a fresh Git repository.
2. Open the real tool and confirm it loads the rules, skills, agents, or commands Sauron wrote.
3. Add a row to Recorded checks with the date and the exact check.
4. Change the tier and evidence in `RUNTIME_SUPPORT`, then run the tests.

A runtime moves from `instruction-only` to `beta` only when an official source documents its paths.
See [Runtime Scaffolds](../runtime-scaffolds.md).
