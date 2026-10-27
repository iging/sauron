# Team Onboarding

For a contributor who continues the work. See [[claude]].

## First hour

1. Read [[project-overview]], [[status]], and [[open-items]].
2. Read [[working-rules]] and [[security-rules]].
3. Clone `https://github.com/iging/sauron`. Use Node 18 or newer.
4. Run `npm ci`, `npm run build`, `npx tsc --noEmit`, and `npm test`. All must pass.
5. Run `node bin/sauron.mjs status` and try `init` on a scratch folder. See
   [[commands-and-stack]].

## Good first tasks

- Verify an unverified runtime path and update `docs/runtime-scaffolds.md`.
- Rebuild the `references/runtime-matrix.md` table.
- Pick an item from [[open-items]] under "Known gaps".

## How we work

- Branch only for a reviewed change. Miguel merges. See [[git-and-pr-flow]].
- Every change in `adapters/`, `bin/`, `skills/`, or `core/` ships with docs.
- New runtime? Follow the checklist in [[agent-runtimes]].
- Contributor guide: `CONTRIBUTING.md`.

## Where to ask

Miguel decides product and releases. Bring a recommendation with each question.
