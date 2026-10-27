# History: Runtime Scaffolds and Releases

See [[history-index]], [[decisions]], and [[status]].

## v3.0.0

- `4a26649`: native runtime scaffolds and shared AGENTS.md core replace legacy output.
- Individual adapter and integration commits remain in the commit ledger.
- `9c110d5`: managed-block merge, user-winning JSON, raw asset preservation,
  and default-on configurable Caveman.
- `a654f65`: Recommended or Custom init, skills, agents, Claude assets, saved choices.
  Recommended selects Claude Code plus shared core.
- `ab7877b`, `f973703`: readline types, installer, Python wrapper, and pnpm work.
- `93a101e`: generated CLAUDE.md lists installed assets and add supports Claude skills.
- `3f6f13d`: v3.0.0 release.

## v3.1.0

- `7dc57d4`: arrow-key init, prompt redraw fix, stdin cleanup.
- `f3b7b31`: galaxy graph layout, active chips, deterministic placement, paused physics.
- `0cab09f`: graph skips framework output and duplicate worktree sources.
- `b6d0355`: visible edges, alias imports, workspace package resolution.
- `15361d3`, PR #8: npm includes scripts required by graph.
- `dd810b8`, `39b26fb`: omp scaffold and count of 20.
  PR #9 integrates them as `26669a8` on main.
- `1a185e9`: 3.1.0 release and tag. npm latest and checksum verified.
- Release session: [[session-2026-10-25-publish-310]].

## Release success does not close these checks

- Real terminal arrows in Git Bash and PowerShell.
- Actual runtime skill and command loading.
- npm publish acceptance can precede registry visibility. Wait before retrying.
- npm version rejects any tracked edit, not only VS Code settings.

Source: `docs/handoffs/2026-10-20-sauron-v3-release-and-roadmap.md`.
