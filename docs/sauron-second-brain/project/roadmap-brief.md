# Roadmap Brief

Planning context only. Reading this does not authorize new research or implementation.
Source: October 20 handoff, sections 9 through 11. See [[handoffs-index]].

## Retired local drafts

- The user authorizes removing `context/PRD.md` and `context/TASKS.md` on 2026-10-25.
- Both earlier interactive-init drafts are archived locally. See [[cleanup-record]].
- They are absent from the working tree. Do not request them just to resume.
- Draft Node 20, 17-runtime, and proposed-flag statements are not current behavior.
- Use [[commands-and-stack]] and [[agent-runtimes]] for current implementation context.
- Main init features ship in 3.0.0 and 3.1.0. Unchecked draft gates do not prove completion.
- pnpm execution, installer runs, real runtime loading, and terminal checks remain open.
- Other proposed draft details, including package-manager helpers, CI matrix, optional
  CLAUDE.md flags, and per-agent memory seeds, require a fresh scope check before adoption.

## Order when roadmap work starts

1. Research Part 1, Developer Tooling, one cohort of 12 targets.
2. Present its blueprint for owner approval as the handoff requires.
3. Plan Part 1 from research, nine intent dimensions, and binary gates.
4. Research Part 2 separately, Agent Engineering, one cohort of 12 targets.
5. Present its blueprint for approval, then plan Part 2 separately.
6. Decide skills, modules, or hybrid with the owner before Part 2 tasks.
7. When planning is requested, create new local PRD and TASKS at the conventional paths.
   Use separate Part 1 and Part 2 headings. Recover old drafts only if needed.

Source URLs are research inputs, not verified current facts.
The referenced audit-compliance script does not exist. Report that gate unavailable.

## Part 1 candidates

- CLI: doctor, manifest-safe uninstall or remove, saved-choice preselection,
  diff preview, legacy upgrade, and optional backup ignore rule.
- Distribution: Claude plugin, remote registry and lockfile, fewer skill copies,
  other-runtime subagents, MCP sync, and installable hooks.
- Quality: reproducible benchmark, terminal e2e, wider CI and trusted publishing,
  runtime path research, and skill or command collision cleanup.
- Docs: landing v3, follower guide, generated changelog.
- Re-rank after research and label patch, minor, or major.
- Existing helper files do not establish that a candidate is fully finished.

## Part 2 concepts

1. Harness Engineering. 2. Loop Engineering. 3. Context Engineering. 4. Tool Design.
5. Memory Architecture. 6. Orchestration Patterns. 7. Guardrails and Permissions.
8. Evals for Agents. 9. Human-in-the-Loop Design. 10. Observability and Tracing.

Read the source concept-to-path table only when Part 2 starts.
