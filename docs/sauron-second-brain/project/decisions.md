# Decisions Log

Short record of decisions and why. See [[claude]] and [[project-overview]].

## Versions

- 3.0.0 was MAJOR: `init` stopped writing 12 legacy files (`.cursorrules`, `.windsurfrules`,
  `.clinerules`, and others).
- 3.1.0 is MINOR: arrow-key UI, omp runtime, and fixes. Flags, `sync`, and saved choices
  behave the same.
- `@clack/prompts` stays at 0.11.0. Version 1.x needs Node 20.12 or newer, and Sauron
  supports Node 18.

## Init

- Recommended targets Claude Code only. Other tools still get `AGENTS.md`, which most
  runtimes read. This avoids clutter.
- Skills are copied to `.agents/skills/` and `.claude/skills/`, because Claude Code reading
  `.agents/skills/` is not verified. Cost is about 21 MB for Recommended.

## Runtimes

- Each runtime gets only its officially documented paths. Unverified paths carry an
  `<!-- unverified: <source> -->` note.
- The runtime count is the number of ids in `RUNTIME_IDS`: 20 since 2026-10-25. Docs, CLI,
  and manifests use that number. Before, docs said 17 and the CLI said 19.
- omp (2026-10-25): native `.omp/` scaffold with `.omp/mcp.json`. No `.omp/AGENTS.md`,
  because it would shadow the root `AGENTS.md`. No skill copy into `.omp/skills/`, because
  omp already reads `.agents/skills/`. TTSR rules, hooks, and `config.yml` are left to users.

## Docs and claims

- Unverified savings claims were removed from the README and config. No figure returns
  without a benchmark script and raw data.
- Handoffs stay in `docs/handoffs/`. The shipped `handoff` skill and two core agents write
  there for every Sauron user, so the folder is not moved into this vault.
- This vault lives in `docs/sauron-second-brain/` with `claude.md` as the entry note, the same
  layout as the vault in `vetted-studio`.

## Native subagents, 2026-11-01

- OpenCode and omp come first. Their formats are documented and close to Claude Code files.
- 3.2.0 is MINOR. Reasoning: [[plan-native-subagents]].
- `nativeRuntimes` is saved so `sync` never adds native files that a user did not choose.
- Commands shadowed by omp built-ins are left out, not renamed.

## Scaffold notes and outside tools, 2026-11-01

- OpenCode and omp keep one note at their root. Their loaders read every Markdown file in the
  agent and command folders.
- Removing a retired file needs Sauron ownership, a matching checksum, and a backup.
- Static inspection lives inside Sauron, with no external tool. See [[plan-sauron-eye]].
- Any reverse-engineering skill puts authorization first and refuses DRM, license, and
  anti-cheat bypass.

## Licensing and launch, 2026-11-01

- Sauron offers a choice of MIT, Apache-2.0, or the Unlicense. Users pick one.
- Public contact is GitHub only. No personal email appears in the repo or on the site.
- The landing page uses Vercel Web Analytics, with no cookies and no banner. Recheck after deploy.
- Checklist items that need a sale, form, or email list are skipped, not faked.
- Miguel chose on 2026-11-02: Eye and roadmap stay plan-only, and all other work ships in 3.2.0.
- `docs/handoffs/` and this vault leave the npm package, because `npm publish` packs what is on
  disk and these notes are for the project, not for users.

## Portable memory, 2026-10-25

- Startup reads the resume brief and task map. History and full handoffs load on demand.
- Initial cleanup keeps owner drafts. The user later authorizes their removal on 2026-10-25.
  Archive the old PRD and TASKS. Future planning can create fresh files at those paths.
- Archive obsolete reports and packages before removing their working copies.
- Preserve runtime files, stashes, and other worktrees until removal safety is established.
