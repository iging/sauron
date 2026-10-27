# History: Skills and Discipline

October 5 and 6 handoff, integrated into v2 through `4890722`. See [[history-index]].

## Decisions retained

- Design patterns starts from a smell. Try a language feature first. No pattern is valid.
- Finder uses offline weighted BM25. Name, trigger, description weights: 3, 2, 1.
- No finder cache: the recorded scan cost does not justify stale-index risk.
- Skills are re-authored from ideas, not copied from another author's text.
- Discipline adds Prime rule and Bypass Excuses to autonomous development skills.
- Skill-first protocol replaces the earlier branded bootstrap skill.
- Brainstorming tracks: Probe, Patch, Blueprint.
- Three failed fixes trigger renewed investigation in the documented workflows.
- Claude SessionStart bootstrap is configured for startup and compaction.
- Lean-code applies its reuse ladder per requirement and lists deferred work.
- Keep validation, security, data safety, errors, accessibility, and tests.

## Unresolved evidence

- A fresh real-session bootstrap observation is not recorded as verified.
- Thirteen of fourteen baseline pressure scenarios pass without skills.
  Those scenarios do not establish behavioral improvement.
- Lean-code compares one model and near-identical tasks. Its rerun line count
  is agent-reported. It is not a general benchmark.
- General language rows, short finder queries, role titles, and task-review brief
  need follow-up. See [[historical-open-items]].
- Cross-runtime hooks and cross-project mirrors need separate verification.
- Removed pressure scenarios cannot be reproduced from handoff text alone.

## Later changes supersede session state

- `4890722` integrates v2. Do not rebuild features because the handoff says uncommitted.
- Retired follower update findings remain here and in the local cleanup archive.

Source: `docs/handoffs/2026-10-05-design-patterns-skill-finder-and-discipline-layer.md`.
