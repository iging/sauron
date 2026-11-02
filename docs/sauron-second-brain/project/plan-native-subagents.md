# Plan: Native Subagents for OpenCode and omp

Status: approved and built on 2026-11-01, uncommitted on `main`. Target version: 3.2.0.
Candidate: other-runtime subagents in [[roadmap-brief]]. Results:
[[session-2026-11-01-native-subagents]].

**Why:** Sauron advertises one harness across 20 runtimes, but `buildInstallOutputs` returns
early when `claude` is not selected, so other runtimes get no subagents or commands.
`vetted-studio` needed a 209-line `scripts/agents/sync-runtimes.mjs` to work around this.

## Why MINOR, not PATCH or MAJOR

Sauron versions are MAJOR.MINOR.PATCH. The bump depends on what existing users experience,
not on how much code changes. 3.1.0 becomes 3.2.0.

| Bump          | Rule                                              | Fits? | Reason                 |
| :------------ | :------------------------------------------------ | :---- | :--------------------- |
| PATCH (3.1.1) | Fixes something that fails to work as promised    | No    | This adds a capability |
| MINOR (3.2.0) | Adds a capability, and existing use keeps working | Yes   | See below              |
| MAJOR (4.0.0) | Users must change something, or lose something    | No    | Nothing is removed     |

**Why not PATCH.** No promised behavior is broken today. `--help` says subagents go to
`.claude/agents/`, so OpenCode and omp users are getting what is documented. This work adds
new output folders, makes setup questions appear for more runtimes, and changes help text.
A patch must be safe to take without noticing. A new set of files in a project is noticeable.

**Why not MAJOR.** 3.0.0 was major because `init` stopped writing 12 legacy files, so users
lost output they relied on. This plan removes nothing. Flags keep their names and values,
`--runtimes=claude` output stays identical, Recommended stays Claude-only, and saved configs
stay valid. Existing user files are not overwritten, because an edited file is `SKIPPED`.

**The condition that keeps it MINOR.** `init --yes --runtimes=opencode` saves
`agents: fellowship` and `commands: true` today, even though nothing is installed from them.
Without a guard, the next `sauron sync` would add 132 files per runtime that the user never
chose. This comes from reading `adapters/init-plan.ts` and `bin/sauron.mjs`, not from a run.
That surprise would weaken the MINOR claim, so the guard below is required.

**What would change the answer.** Removing the guard, making Recommended install for other
runtimes, or renaming a flag means re-checking the bump, and may make it MAJOR.

## Scope

**Includes:**

- `adapters/installer.ts`: split agent parsing from rendering, remove the `!claude` return.
- `bin/sauron.mjs`: ask subagent and command questions for the three runtimes below, and make
  the prompt, help, and summary text runtime-neutral.
- `adapters/init-plan.ts`: add a saved `nativeRuntimes` list. A saved `init:` block without
  this key keeps the Claude-only install.
- `tests/e2e/init-presets.test.mjs` and a new `tests/unit/installer-runtimes.test.mjs`.
- `docs/runtime-scaffolds.md`, `docs/04-runtime-adapters/cli-agents.md`,
  `docs/01-getting-started/cli-reference.md`, and [[agent-runtimes]].

| Runtime     | Subagents           | Commands              | Format change                  |
| :---------- | :------------------ | :-------------------- | :----------------------------- |
| Claude Code | `.claude/agents/`   | `.claude/commands/`   | None                           |
| OpenCode    | `.opencode/agents/` | `.opencode/commands/` | Adds `mode: subagent`          |
| omp         | `.omp/agents/`      | `.omp/prompts/`       | Keeps `name` and `description` |

**Excludes:** Codex (TOML), Copilot, Gemini, Cursor, and other runtimes. Hooks, MCP sync, and
permission rules. Skill copies. Recommended preset. The README scaffolds in
`adapters/opencode.ts` and `adapters/omp.ts`. Version bump and publishing.

## Done when

- [x] `init --yes --runtimes=opencode --agents=fellowship --skills=none` writes 9 subagents
      and 123 commands. omp gets 9 and 119, in its own folders.
- [x] `--no-commands` and `--agents=none` write none of those files for all three runtimes.
- [x] Output for `--runtimes=claude` stays identical to 3.1.0.
- [x] `sync` on an old saved `init:` block adds no OpenCode or omp subagents or commands.
- [x] A user-edited subagent is `SKIPPED` on `sync`, and its content is unchanged.
- [x] Build, typecheck, tests, and the doc gate pass.
- [ ] One subagent and one command load in real OpenCode and omp sessions. OpenCode
      subagents pass. OpenCode commands and all of omp remain open.

## Checks made before coding

- Bundled commands: only `progress-report` names a Claude file. None set `allowed-tools`.
- `argument-hint` is kept out of OpenCode and omp files, so its support no longer matters.
- omp built-ins shadow four commands, which changes the omp count from 123 to 119.
