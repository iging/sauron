# Working Rules

How work is done in this repository. Set by Miguel. See [[claude]] for the map.

## Git and pull requests

Full steps are in [[git-and-pr-flow]].

- Work stays uncommitted while building. Create a branch and commit only when Miguel runs
  `/progress-report` or asks for a commit.
- Push the branch with `-u`. Do not open or merge the pull request unless Miguel asks.
- Switch back to `main` and pull only when Miguel says so.
- Before a push: `npm run build`, `npx tsc --noEmit`, `npm test`, and the doc gate must pass.
- Commit messages follow Conventional Commits and end with the Co-Authored-By line given by
  the session. Pull request text ends with the Claude Code line.
- Stage files by name. Never `git add .` (local-only files sit in the root).

## Scope and decisions

- Stay in the scope named. Decide, note it in [[decisions]], move on.
- Miguel decides product, release timing, and what is published.
- Business or market questions use cited sources, never memory.
- Plan big changes first. Name the blast radius and impacted files before editing.

## Code

- TypeScript strict, ES modules, explicit `.js` import paths, no barrel `index.ts` files.
- Route every file write in adapters through `ConflictManager`. Never overwrite user files.
- Lean by default: reuse first, no option or abstraction without a caller.
- A change in `adapters/`, `bin/`, `skills/`, or `core/` needs a doc change in the same commit
  (the pre-commit doc gate). See [[commands-and-stack]].
- Tests import from `dist/`. Run `npm run build` before `npm test`.
- Spawn subagents only when Miguel asks.

## Skills

- Skills brought in from other authors are re-authored in Sauron style from the ideas. No
  verbatim copies, no NOTICE files, no original author names.
- The design-engineering suite must serve web, mobile, desktop, and business systems.
  New skills there start with "Step 0: Set the Target Platform".
- UI builds always meet the baseline: clear hierarchy, a type scale with `clamp()`, and
  responsive checks at 320, 375, 425, 768, 1024, and 1440 pixels.

## Safety

See [[security-rules]]. Confirm before publishing, deleting branches, or force pushing.
