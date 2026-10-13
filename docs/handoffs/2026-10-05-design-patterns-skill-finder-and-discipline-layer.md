# Handoff: Design Patterns Skill, Skill Finder, and Skill Discipline Layer

2026-10-05 · Added the `design-patterns` skill, the `sauron find-skill` command, and a discipline layer on the 14 autonomous development skills. Nothing is committed.

Recipient: a new AI session in `C:\Users\IGING\Documents\GitHub\sauron`.

## 1. Objective

Three additions to Sauron, each written from a blank file in the Tier-5 template:

1. A language-neutral design patterns skill.
2. A ranked local skill search, so an agent reads a few files instead of the catalog.
3. Enforcement mechanics for `skills/workflow/autonomous-dev/`: a session hook, a Prime rule and an excuse table per skill, and pressure scenarios.

## 2. Current State

- **Branch:** `main`. Working tree only. Zero commits made this session. About 54 changed or new paths, mixed with earlier uncommitted work (the `openclaude` to `openclaw` rename and runtime docs).
- **Verification, run 2026-10-05:** `npm test` 64 pass, 0 fail. `npx tsc --noEmit` exit 0. Tests import from `dist/`, so run `npm run build` before `npm test` after any change in `adapters/`.
- **Design patterns:** `skills/architecture/design-patterns/` with `SKILL.md` and three references. Mirrored to `vetted-studio/.agents/skills/architecture/design-patterns/` and `vetted-studio/.claude/skills/design-patterns/`.
- **Skill finder:** `adapters/skill-finder.ts`, command `find-skill` in `bin/sauron.mjs`, `tests/unit/skill-finder.test.mjs` (20 tests), `skills/workflow/find-skill/SKILL.md`, `.claude/commands/find-skill.md`, `scripts/skills/measure-finder.mjs`, and a section in `docs/01-getting-started/cli-reference.md`.
- **Discipline layer:**
  - Template `skills/_template/skill-name/SKILL.md` is version 1.1.0, with optional `Prime rule` and Section 6.1 Bypass Excuses.
  - `08-meta-and-bootstrap/using-superpowers` is now `skill-first-protocol`, trigger `/skill-first`, fully rewritten.
  - All 14 skills carry a Prime rule, Section 6.1, and a when-to-use description.
  - `brainstorming` has three tracks: Probe, Patch, Blueprint.
  - `systematic-debugging` and `subagent-driven-development` stop after three failed fixes.
  - Briefs in `skills/workflow/autonomous-dev/references/`: `builder-brief.md`, `task-review-brief.md`, `recheck-brief.md`.
  - `scripts/hooks/session-bootstrap.mjs` plus a `SessionStart` hook (`startup|compact`) in `.claude/settings.json`.
- **Deleted this session:** the whole `projects/` folder and its entry in `.gitignore`, the plan file under `docs/plans/`, the pressure scenario files under `tests/skills/`, and `handoff-dev-teammate.md`. The pressure run record no longer exists on disk. A summary for followers is in `docs/updates/2026-10-05-sauron-update.md`. The Next.js Norpac project lives at `github.com/iging/norpac`. The Astro version had no repository and is gone.

## 3. Key Decisions and Rationale

- **Re-author, never copy.** Reference repositories were read for ideas only. No text, table, or script was copied, and no attribution files were added. Reason: the owner wants the content to be his own work in Sauron style.
- **No index file for the finder.** A full scan and rank of 375 skills takes about 0.15 seconds per CLI call. A cache adds a stale-data risk for no visible gain. The command writes nothing.
- **Keyword scoring (weighted BM25), no embeddings.** Deterministic, offline, zero model cost. Weights: name 3, trigger phrases 2, description 1.
- **Only the branded folder was renamed.** The other 13 names, such as `test-driven-development`, are plain industry terms. Owner approved.
- **Names approved by the owner:** `skill-first-protocol`, `Prime rule`, `Bypass Excuses`.
- **User instruction outranks skills.** Order of authority: user, then process skills, then domain skills. A plain-word user waiver of a skill step is valid. A rushed tone is not a waiver.
- **Pressure runs came before the excuse tables.** Tables written without a run contain guesses.
- **Design patterns skill starts from the smell.** It tries a language feature before a pattern, and "no pattern" is a valid result.

## 4. Dead Ends (Do Not Retry)

- **Inline `node -e` or heredoc scripts that contain regex backslashes.** Git Bash strips them and corrupts the target file. Write the script with the Write tool, then run it.
- **String anchors that assume LF.** Many files here are CRLF. Normalize on read and restore on write.
- **Giving a pressure-test agent the scenario file.** The file names the expected choice.
- **`scripts/audit-compliance.js`.** Several skills name it. It does not exist in this repository.
- **The reference finder's deep verification mode and its savings figures.** The mode depends on an undefined external tool, and the figures have no stated measurement method.

## 5. Open Items

| #   | Item                                                          | Why it matters                                                                                                                                                |
| :-- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Confirm the `SessionStart` hook in a fresh session            | Configured and not yet observed. The bootstrap text (114 words) should appear at startup.                                                                     |
| 2   | Pressure scenarios do not discriminate                        | 13 of 14 baseline agents chose the expected option with no skill loaded. The runs supplied excuse wording only. Open-ended scenarios are the real test.       |
| 3   | Commit the work                                               | Nothing is committed. Suggested split: design patterns, skill finder, discipline layer, earlier `openclaw` rename. Branch first, since the tree is on `main`. |
| 4   | Port `find-skill` and the discipline layer to `vetted-studio` | Only `design-patterns` and `founder-growth` exist there.                                                                                                      |
| 5   | Stale counts                                                  | `README.md` says 374 skills. `CLAUDE.md` and `AGENTS.md` say 44. The finder indexes 375.                                                                      |
| 6   | Non-catalog role titles                                       | Section 0 of the 13 older autonomous-dev skills uses titles outside Appendix A.                                                                               |
| 7   | `task-review-brief.md`                                        | Renamed only. Body not rewritten.                                                                                                                             |
| 8   | Finder weakness                                               | Very short queries such as "is it done" rank poorly. Stop words remove most of the query.                                                                     |
| 9   | `design-patterns` language rows                               | Only Python, Go, and Kotlin rows rest on a fetched source. The rest are labeled `[general]`.                                                                  |
| 10  | `.sauron/backups/.openclaude_config.json.*.bak`               | Last file with the old runtime name. Left in place as a backup.                                                                                               |
| 11  | Hooks for runtimes other than Claude Code                     | Not built.                                                                                                                                                    |

## 6. Working Preferences

- Reply in caveman ultra: bare fragments, no filler. The owner writes in Tagalog and English.
- Files on disk follow the Sauron writing rules, not caveman: zero em dashes, zero banned words, zero Latin abbreviations, zero prose semicolons.
- One task at a time. Confirm before deleting files or changing global or harness configuration.
- Report failures and unverified items plainly. Never state a figure that was not measured or sourced.
- Spawn subagents only when the owner asks or approves.
- Run `npm test` and `npx tsc --noEmit` before concluding.

## 7. Opening Prompt for the Next Session

```text
Continue Sauron work from docs/handoffs/2026-10-05-design-patterns-skill-finder-and-discipline-layer.md.
Read that file first. Read nothing else until I name a task.
State in three lines: what is uncommitted, what is unverified, and which open item you recommend first.
Reply in caveman ultra. Change no file until I confirm.
```

## 8. Addendum: 2026-10-06

### Added

- **`lean-code` skill:** `skills/workflow/lean-code/SKILL.md`, `skills/workflow/lean-code/references/reuse-ladder.md`, `.claude/commands/lean-code.md`. A seven-rung reuse ladder climbed per requirement before new code is written. Modes: build, `review`, `audit <dir>`, `debt`. Intensity: `lite`, `full`, `ultra`, `off`. Owner agent `gimli`.
- **Mirror in `vetted-studio`:** `.agents/skills/workflow/lean-code/`, `.claude/skills/lean-code/`, `.claude/commands/lean-code.md`, and one bullet in `AGENTS.md`.
- **Follower update:** `docs/updates/2026-10-05-sauron-update.md`, Taglish, Section 8 covers this skill.

### Removed

- `docs/plans/`, `tests/skills/`, and `handoff-dev-teammate.md`, at the owner's request. Items in Sections 2 and 5 that point to pressure scenario files or the plan file no longer have files behind them.

### Decisions

- **Ladder per requirement, not per task.** One task in the recorded run held five requirements on four different rungs.
- **Deferred items are listed, never dropped in silence.** A deferral the user cannot see is a missing feature.
- **A new dependency is not a rung.** It needs user approval.
- **No metrics command.** No measuring tool exists yet, so no savings figure is claimed.
- **Never Cut list:** validation, security, data safety, error handling, accessibility, tests.

### Pressure run, one model (Claude Haiku 4.5), one run per condition

| Condition    | Requirements on the lowest available rung | Lines of code                                    |
| :----------- | :---------------------------------------- | :----------------------------------------------- |
| No skill     | 1 of 5                                    | 32, counted from the returned code               |
| Skill loaded | 5 of 5                                    | 9, as reported by the agent. Code not inspected. |

Limits: the two tasks were near-identical and the skill text contains the answers, so this run does not show the skill generalizes. The skill-loaded agent still wrapped single calls in four functions, against Step 3 of the skill.

### Verification

`npm test` 64 pass, 0 fail on 2026-10-06. Nothing is committed.

### New open items

| #   | Item                                                                                                        |
| :-- | :---------------------------------------------------------------------------------------------------------- |
| 12  | Run `lean-code` on a different task in another language to test whether it generalizes.                     |
| 13  | Tighten Step 3 so single-call wrappers are not written.                                                     |
| 14  | Run `lean-code` in a real coding session.                                                                   |
| 15  | `vetted-studio` still lacks `find-skill` and the discipline layer. Its skills have no `sauron` CLI to call. |
