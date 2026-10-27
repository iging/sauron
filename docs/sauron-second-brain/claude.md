# Second Brain: Start Here

Memory of the Sauron project for any AI agent or teammate. Read this note first.
Last updated: 2026-10-25.

## How to use this vault

1. Read [[resume-brief]], then [[status]] and [[open-items]].
2. Read [[working-rules]] and [[communication]] before you change anything.
3. Read [[task-file-map]] and only sources for the named task.
   Open a handoff only when the brief lacks a needed decision.
4. Moving to another AI agent? Read [[switching-agents]].
5. New to the project? Read [[team-onboarding]].
6. Before you stop: update [[status]], [[open-items]], and [[lessons]]. Add a session note
   when real work was done. Write a handoff when Miguel asks for one.

Do not scan the full codebase, skill catalog, history, or other worktrees to resume.
Current notes provide context. Check relevant code before changing behavior.

## File rules

- One topic per note. Under 80 lines. Under 100 characters per line where you can.
- Link notes with a note name in double square brackets. Note names are unique in the vault.
- Never write a password, key, token, or OTP. Name the variable only.
- Dated notes (sessions) are not edited after their day. Other notes stay current.
- Follow the writing rules in [[communication]].

## Map

- Rules: [[working-rules]], [[communication]], [[security-rules]].
- Project: [[project-overview]], [[status]], [[open-items]], [[decisions]].
- Runbooks: [[commands-and-stack]], [[git-and-pr-flow]], [[release-and-publish]],
  [[agent-runtimes]], [[switching-agents]].
- Learning: [[lessons]] and the dated notes in `sessions/`, starting with
  [[session-2026-10-25-omp-and-second-brain]].
- Handoffs: [[handoffs-index]].
- Team: [[team-onboarding]].
- Routing: [[task-file-map]], [[architecture-map]].
- History: [[history-index]]. Planning: [[roadmap-brief]].
- Checks: [[verification-checklist]]. Obsidian: [[obsidian-use]].
- Cleanup: [[cleanup-record]].

## Where the full documents are

This vault is a summary and a memory. The sources of truth stay in the repo:

- Root guides: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `README.md`.
- Product docs: `docs/` (getting started, Fellowship, skills, runtimes, safety).
- Runtime paths and sources: `docs/runtime-scaffolds.md`.
- Handoffs: `docs/handoffs/` (kept there, see [[handoffs-index]]).
- Agent context: `.agents/context/` (requirements, architecture, schema).

When this vault and the repo disagree, the repo wins. Fix the vault.
