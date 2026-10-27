# Handoffs Index

Snapshots of where work stood at the end of a session. See [[claude]].

## Where handoffs live

Handoff files stay in `docs/handoffs/`, not in this vault. The shipped `handoff` skill and
the `handoff-specialist` and `state-keeper` agents write there for every Sauron user, so the
path is part of the product. See [[decisions]].

## Rules

1. Never overwrite a handoff. Each session writes a new dated file.
2. File name: `docs/handoffs/YYYY-MM-DD-topic-slug.md`, lowercase kebab case.
3. Add a row to `docs/handoffs/README.md` and a line to the list below.
4. Facts in old handoffs go out of date. The notes in this vault win.

## Index (newest first)

- 2026-10-20: `docs/handoffs/2026-10-20-sauron-v3-release-and-roadmap.md`
  3.0.0 shipped, 3.1.0 plan, research briefs, `/plan-feature` Parts 1 and 2.
- 2026-10-05: `docs/handoffs/2026-10-05-design-patterns-skill-finder-and-discipline-layer.md`
  Design patterns skill, skill finder, skill discipline layer.
- 2026-09-21: `docs/handoffs/2026-09-21-skills-audit-and-modular-cli.md`
  Skills audit, script cleanup, modular `add` CLI.

## How to resume

1. Read [[claude]], [[status]], and [[open-items]].
2. Read [[resume-brief]] first. Load one handoff section only when the task needs it.
3. Check [[lessons]] before running commands.

## Current synthesis

[[history-index]] summarizes the three handoffs and indexes available commit history.
[[roadmap-brief]] retains the October 20 planning order.
[[historical-open-items]] retains October 5 and 6 verification gaps.
