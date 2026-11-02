# Session 2026-11-01: Native Subagents for OpenCode and omp

Dated note. Not edited later. See [[plan-native-subagents]], [[status]], [[agent-runtimes]].

## The short version

Before this work, Sauron installed real subagents and slash commands for Claude Code only.
Every other runtime got instruction files and README notes. Now OpenCode and omp also get
the Fellowship subagents and the slash commands as real files in their own folders.

## What changed for a user

Run this in a project:

`npx sauron-ai init --yes --runtimes=opencode,omp --skills=none`

| Runtime  | Subagents                | Commands                     |
| :------- | :----------------------- | :--------------------------- |
| OpenCode | 9 in `.opencode/agents/` | 123 in `.opencode/commands/` |
| omp      | 9 in `.omp/agents/`      | 119 in `.omp/prompts/`       |

123 is the 114 bundled commands plus one per Fellowship member. Claude Code output stays the
same, and Recommended stays Claude-only.

## How it works

- One spec, many renderers: `adapters/installer.ts` reads each agent once, then renders it per
  runtime through `NATIVE_TARGETS`. Adding a runtime is one more table entry.
- OpenCode takes the agent name from the file name and needs `mode: subagent`. omp and Claude
  Code need `name` and `description`.
- `argument-hint` stays in Claude Code files only. The other two do not document it.
- omp built-ins always beat prompt templates, so `/handoff`, `/loop`, `/plan`, and `/security`
  are not written to `.omp/prompts/`. They could never run there.

## Why `nativeRuntimes` exists

`init --yes --runtimes=opencode` already saved `agents: fellowship` and `commands: true`, even
though those values installed nothing. Without a guard, the next `sauron sync` would add 132
files that the user never chose. So `init` now saves a `nativeRuntimes` list.

- A config without that key came from before 3.2.0, and it keeps the Claude-only install.
- To opt in, run `init` again with an explicit `--runtimes=` list.

This guard is what keeps the release MINOR. The full reasoning is in [[plan-native-subagents]].

## Verification

- Build and typecheck pass. `npm test`: 129 pass, 0 fail (116 before this work).
- Compared with the published `sauron-ai@3.1.0` on two `--runtimes=claude` runs (514 and 460
  files). Same file lists and contents, apart from the new `nativeRuntimes` line and
  `.sauron/manifest.json`.
- Real OpenCode 2.1.4: `opencode debug agents` lists all 9 Fellowship agents as `subagent`.

## Not verified

- Slash commands in real OpenCode. `opencode run` treats `/gandalf` as plain text, and a made-up
  command gave the same reply, so that test proves nothing. Check in the OpenCode TUI.
- Anything in real omp. It is not installed on this machine.
- The arrow-key prompts in a real terminal after the text changes.

## Found along the way

`.opencode/agents/README.md` loads in real OpenCode as a primary agent named `README`. It comes
from the 3.0.0 scaffold, so this work did not cause it. `.opencode/commands/README.md` and the
omp README files may have the same problem. The approved scope excluded those scaffolds, so
the fix is an open item. See [[open-items]].

## Later the same day

- README fix: OpenCode and omp now use one root note. `sauron sync` removes the old folder
  notes while Sauron owns them. In real OpenCode, a fresh folder lists 16 agents with all 9
  Fellowship agents and no `README`. A control with the old note lists 17, with `README`.
- Wrote the ECC-inspired roadmap. See [[roadmap-ecc]].
- `npm test`: 138 pass, 0 fail.
- Planned Sauron Eye. See [[plan-sauron-eye]].
- State at stop: uncommitted on `main`. No version bump and no publish.
