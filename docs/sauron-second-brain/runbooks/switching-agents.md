# Switching Agents

How to continue Sauron work in another AI agent without setup pain. See [[claude]].

## How each agent finds this vault

| Agent | Reads first | Finds the vault through |
| :-- | :-- | :-- |
| Claude Code | `CLAUDE.md` | The Second Brain rule in `CLAUDE.md` |
| Codex, OpenCode, omp, Cursor, Copilot, Windsurf, Cline, Kiro, Zed | `AGENTS.md` | The Second Brain rule in `AGENTS.md` |
| Gemini CLI | `GEMINI.md` | The Second Brain rule in `GEMINI.md` |
| Any other chat or agent | nothing | Paste the opening prompt below |

On a Windows checkout, Claude Code may also load `claude.md` in this folder by itself, since
file names are not case sensitive there. Other agents must be told to read it.

## Opening prompt (paste in a new agent session)

```text
Read docs/sauron-second-brain/claude.md and its small startup read set.
Use project/task-file-map.md for files needed by my named task.
Preserve local edits, stashes, and other worktrees. Do not scan the full repository.
Tell me the current state and next step.
```

## Before you leave an agent

1. Update [[status]] and [[open-items]] with what changed.
2. Add new lessons to [[lessons]].
3. Add a session note in `sessions/` when real work was done.
4. For a long stop, ask for a handoff. See [[handoffs-index]].

## Agent-specific memory

- Claude Code also keeps a private memory outside the repo. Anything another agent needs must
  be written here, not only there.
- Skills: every agent that reads `.agents/skills/` gets the same Sauron skills. Claude Code
  uses `.claude/skills/`. See [[agent-runtimes]].

## Open the vault in Obsidian

Open the folder `docs/sauron-second-brain` as a vault. `.obsidian/` is git ignored, so each
person keeps their own layout. Use the graph view to see how notes link.

## Minimum context

Start with [[resume-brief]] and [[task-file-map]]. Load [[history-index]] on demand.
Some runtimes do not discover root instructions. Paste the prompt above and confirm
the entry note loads. Token limits and memory support vary by runtime.
