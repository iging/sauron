# Handoff: Sauron v3 Release and the v3.1+ Roadmap

2026-10-20 · Shipped Sauron 3.0.0 (19 official runtime scaffolds, safe merge, default-on Caveman, interactive `init`, native Claude Code). An arrow-key `init` awaits release as 3.1.0. The next session runs batch research, then `/plan-feature` for the roadmap.

Recipient: a new AI session in `C:\Users\IGING\Documents\GitHub\sauron`.

## 1. Objective

1. Release 3.1.0 (arrow-key `init`) after a real-terminal test.
2. Research peer tools and standards with `batch-site-research-scaffolder` (Section 9).
3. Run `/plan-feature` Part 1: the product roadmap (Section 10), from the research and the candidate list.
4. Run `batch-site-research-scaffolder` again for Part 2 (the research table in Section 11).
5. Run `/plan-feature` Part 2, a separate topic: the Agent Engineering Track (Section 11), which teaches and applies the 10 core agent concepts in Sauron.
6. Write both parts into `context/PRD.md` and `context/TASKS.md` under separate headings.

Order: research Part 1 → plan Part 1 → research Part 2 → plan Part 2. Each research run waits for owner approval.

## 2. Current State

- **npm:** `sauron-ai@3.0.0` is published. `package.json` version is `3.0.0`.
- **Git:** branch `main`, HEAD `7dc57d4`, pushed. GitHub has only `main`. Commits since v2.0.0 (`ea3fb2a`) start at `5042f46`. The only commit not yet released is `7dc57d4` (the arrow-key `init`).
- **Verification on 2026-10-20:** `npm test` 106 pass, 0 fail. `npx tsc --noEmit` exit 0. Type check of `bin/sauron.mjs` with checkJs plus Node types: 0 errors. Run `npm run build` before `npm test`, because tests import `dist/`.
- **Untracked local files (never `git add`):** `RELEASE-V3-COMMANDS.md`, `RELEASE-V3.1-ARROW-INIT.md`, `RUNTIME-SCAFFOLDS-CHANGES.md`, `TESTING-RUNTIME-SCAFFOLDS.md`, `context/PRD.md`, `context/TASKS.md`. `progress-report-result.md` is gitignored.
- **Leftover:** the local worktree `.claude/worktrees/fix-readline-types` (branch `worktree-fix-readline-types`) is locked by another session. It is clean, and its only commit is already on `main`. It is not on GitHub.
- **Landing site:** `C:\Users\IGING\Documents\GitHub\sauron-landing` is not updated yet. Its plan is `sauron-landing/LANDING-V3-PLAN.md` (signal: `go landing v3`). The landing page still shows `npx sauron init`, which installs a different npm package named `sauron`.

## 3. What v3 Does (for accuracy)

- **`npx sauron-ai init`** (or `pnpm dlx sauron-ai init`): arrow-key setup in a real terminal (`@clack/prompts@0.11.0`).
  - Recommended = shared core + Claude Code + all skills + Fellowship subagents + slash commands + Caveman `full`.
  - Custom = pick runtimes (multi-select), subagents (`fellowship`, `core`, `both`, `none`), skills (all, departments, none), commands (yes or no), and Caveman tier (`off`, `lite`, `full`, `ultra`).
  - A plan summary is shown and nothing is written until the user confirms. Ctrl+C exits with 130 and writes nothing.
- **Flags:** `--yes`, `--runtimes=claude,cursor|all`, `--agents=`, `--skills=all|none|<dept,...>`, `--caveman=`, `--no-commands`, `--interactive` (line prompts for piped input), `--dry-run`. An invalid value exits with 1.
- **Saved choices:** under `init:` in `sauron.config.yaml`. `sauron sync` reuses them without prompts.
- **Shared core, always written:** `AGENTS.md`, `.agents/skills/`, `.agents/anti-patterns.md`.
- **19 runtimes:** each gets its documented scaffold with a README per folder. Sources and verified or unverified status are in `docs/runtime-scaffolds.md`.
- **Claude Code, native:**
  - `.claude/agents/<id>.md` subagents.
  - `.claude/commands/` (114 Sauron commands plus `/gandalf` and the other Fellowship members).
  - `.claude/skills/` (a copy of the skills).
  - `.claude/output-styles/caveman.md` plus `"outputStyle": "Caveman"` in `.claude/settings.json`.
  - `CLAUDE.md` lists only the agents and commands that were installed.
- **Safe merge (`adapters/conflict-manager.ts`):**
  - Text files keep Sauron content inside `sauron:start` and `sauron:end` blocks, placed after any frontmatter (`#` markers for TOML and YAML).
  - A user file gets the block appended. Only the block is updated later.
  - JSON is deep-merged and user keys win. Invalid JSON is skipped.
  - Copied skills, agents, and commands are verbatim (`raw`). A file the user edited is reported `SKIPPED`.
  - Every change is backed up to `.sauron/backups/`. Manifest writes are batched.
- **`sauron add <skill>`:** writes through ConflictManager into `.agents/skills/` and also into `.claude/skills/` when Claude Code is in use. Edited files are kept and reported `PARTIAL`.
- **Installers:** `bin/install.sh` and `bin/install.ps1` handle a local clone (build `dist/` when missing) or a remote install (pnpm, then npm). `sauron.py` forwards every command to the Node CLI. Node 18+ is required everywhere.

## 4. Key Decisions and Rationale

- **v3.0.0 is MAJOR:** `init` stopped writing 12 legacy files (`.cursorrules`, `.windsurfrules`, `.clinerules`, and others).
- **The arrow-key `init` is MINOR (3.1.0):** new UI plus fixes. Flags, `sync`, and saved choices behave the same.
- **`@clack/prompts` 0.11.0, not 1.x:** 1.x requires Node 20.12+, and Sauron supports Node 18.
- **Recommended targets Claude Code only:** users of other tools still get `AGENTS.md`, which most runtimes read. This avoids clutter, which was the owner's main complaint.
- **Skills are copied twice (`.agents/skills/` and `.claude/skills/`):** Claude Code reads `.claude/skills/`. Reading `.agents/skills/` is not verified for Claude Code. Cost: about 21 MB for Recommended.
- **Unverified savings claims were removed:** the README and config no longer claim 40% to 75%. No benchmark script or raw data exists.
- **Only official paths per runtime:** unverified paths (Trae, Pi) carry an `<!-- unverified -->` note. Kimi, Hermes, OpenClaw, and AdaL were left unchanged.

## 5. Dead Ends (Do Not Retry)

- **`npx <path-to-tgz> init` on Windows:** exits 0 silently and runs nothing. Use `npm exec --yes --package=<tgz> -- sauron-ai init`.
- **Inline `node -e` or heredoc edits:** many files are CRLF and Git Bash mangles backslashes. Use the Edit or Write tool.
- **Commands that contain `process.env`, credential reads, or destructive git (`push --delete`, branch deletion):** `.claude/hooks/guard.sh` blocks them. Ask the owner to run them with a leading `!`.
- **Writing the prompt with `process.stdout.write` before `rl.question`:** backspace erases the question. Use `rl.setPrompt()` plus `rl.prompt()`.
- **Leaving stdin open after clack prompts:** the terminal hangs. Call `process.stdin.pause()` and `unref()`.
- **`scripts/audit-compliance.js`:** named in several skills, including `batch-site-research-scaffolder`. It does not exist. Skip that gate and say so.

## 6. Verbatim Essentials

- Package `sauron-ai`, bins `sauron` and `sauron-ai`, repo `https://github.com/iging/sauron`.
- Release: `npm run release:minor` for 3.1.0 (tests, doc gate, build, bump, publish, push tags). The owner runs it, and 2FA may ask for an OTP.
- Pre-commit doc gate: any change in `adapters/` or `bin/` needs a staged doc change (`docs/` or a `SKILL.md`), or an entry in `docs/pending-docs.md`.
- Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Conventional Commits.

## 7. Working Preferences

- Reply in caveman ultra, in Tagalog and English. Files on disk follow the Sauron writing rules: zero em dashes, zero banned words, zero Latin abbreviations, zero prose semicolons.
- Release notes, test guides, and change summaries go in local md files. Never commit them.
- Confirm before publishing, deleting branches, or force pushing. The owner merges to `main` and has allowed direct pushes. Branch protection is bypassed as admin.
- Report unverified items plainly. Never state an unmeasured figure.
- Spawn subagents only when the owner asks.

## 8. Open Items

| #   | Item                                                                   | Next action                                                                                                                                                                                                                                                                                                         |
| :-- | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 3.1.0 not released                                                     | Real-terminal test, then `npm run release:minor` (`RELEASE-V3.1-ARROW-INIT.md`)                                                                                                                                                                                                                                     |
| 2   | Never run inside a real Claude Code session                            | Smoke test: `/agents`, `/gandalf`, `/output-style`, `/plan-feature` (`TESTING-RUNTIME-SCAFFOLDS.md`)                                                                                                                                                                                                                |
| 3   | Same name for a skill and a command (`caveman`, `handoff`, and others) | Check which one wins in Claude Code. Rename or dedupe                                                                                                                                                                                                                                                               |
| 4   | Landing site outdated, wrong `npx sauron` command                      | `go landing v3` (`sauron-landing/LANDING-V3-PLAN.md`)                                                                                                                                                                                                                                                               |
| 5   | pnpm and the install scripts only syntax-checked                       | `npm i -g pnpm`, then test `pnpm dlx`. Run both installers in a scratch user                                                                                                                                                                                                                                        |
| 6   | `token-benchmarks.md` and `faq.md` claim 60% to 85%                    | Remove the figures, or build a real benchmark (candidate C1)                                                                                                                                                                                                                                                        |
| 7   | Kimi, Hermes, OpenClaw, AdaL, Antigravity paths unverified             | Covered by research cohort A                                                                                                                                                                                                                                                                                        |
| 8   | Interactive re-run shows Recommended, not saved choices                | Preselect saved `init:` values (candidate A3)                                                                                                                                                                                                                                                                       |
| 9   | `.cursor/rules/README.md` may load as a Cursor rule                    | Move it to `.cursor/README.md`                                                                                                                                                                                                                                                                                      |
| 10  | Locked local worktree `fix-readline-types`                             | Close the other session, then `git worktree remove --force` it                                                                                                                                                                                                                                                      |
| 11  | `docs/updates/` is not needed (owner decision, 2026-10-20)             | Delete the folder (one tracked file: `docs/updates/2026-10-05-sauron-update.md`) with `git rm -r docs/updates`, commit, push after confirmation. Only the old handoff `2026-10-05-design-patterns-skill-finder-and-discipline-layer.md` mentions it. Leave that handoff as is, since handoffs are immutable records |

## 9. Research Brief: `batch-site-research-scaffolder` (run first)

Skill: `skills/workflow/research-and-productivity/research/batch-site-research-scaffolder/SKILL.md`. One cohort, tag **Developer Tooling**, 12 targets. Dimensions: what each tool does that Sauron lacks, distribution model, config format, and verified runtime paths. Present the blueprint in chat and wait for approval. Save findings into this handoff's addendum or `docs/research/`, not `context/SITE_INDEX.md`, unless the owner says otherwise. Skip the missing `audit-compliance.js` gate.

| #   | Target                                             | Why                                                                |
| :-- | :------------------------------------------------- | :----------------------------------------------------------------- |
| 1   | https://agents.md                                  | AGENTS.md standard: nesting, precedence, adopters                  |
| 2   | https://agentskills.io                             | Agent Skills spec: which runtimes read `.agents/skills/`           |
| 3   | https://github.com/intellectronica/ruler           | Direct peer: multi-runtime rules sync                              |
| 4   | https://github.com/dyoshikawa/rulesync             | Direct peer: rules, MCP, and commands sync across tools            |
| 5   | https://ui.shadcn.com/docs/registry                | Registry model for a Sauron skill registry and `add`               |
| 6   | https://code.claude.com/docs/en/plugins            | Claude Code plugins and marketplaces as a distribution channel     |
| 7   | https://code.claude.com/docs/en/hooks              | Hooks Sauron could install (guard, session bootstrap)              |
| 8   | https://modelcontextprotocol.io                    | MCP config sync across runtimes                                    |
| 9   | https://github.com/affaan-m/everything-claude-code | The ECC standard Sauron cites                                      |
| 10  | https://github.com/vercel-labs/skills              | Skills package manager (`npx skills add`)                          |
| 11  | https://github.com/obra/superpowers                | Skill discipline patterns (source of `skill-first-protocol` ideas) |
| 12  | https://docs.npmjs.com/trusted-publishers          | Release hardening: provenance and OIDC publish from CI             |

## 10. Plan-Feature Part 1: Product Roadmap (run second)

Run `/plan-feature` (`skills/workflow/plan-feature/SKILL.md`) on "Sauron v3.1+ roadmap". Use the nine intent dimensions. Write user stories to `context/PRD.md` and atomic tasks with binary gates to `context/TASKS.md`. Implementation goes to `@frodo` and verification to `@merry`. Both files are local-only and owner-edited, so read them first and extend them. Do not overwrite them. Re-rank the candidates below with the research findings. Each candidate needs a version label (patch, minor, or major).

**A. Init and CLI**

- A1 `sauron doctor`: checks each runtime scaffold, broken links, stale blocks, Node version.
- A2 `sauron uninstall` and `sauron remove <skill>`: delete only manifest-owned files and keep user edits.
- A3 Interactive re-run preselects the saved `init:` choices.
- A4 `sauron diff`: preview what `sync` would change.
- A5 `sauron upgrade`: migrate v2 legacy files (`.cursorrules` and others) with a backup and a report.
- A6 A `.gitignore` entry for `.sauron/backups/` in user projects (asked in `init`).

**B. Distribution and Ecosystem**

- B1 Publish Sauron as a Claude Code plugin and marketplace (skills, agents, commands, hooks in one install).
- B2 Remote skill registry, shadcn style (`sauron add <url|namespace/skill>`), with a lockfile using `adapters/skills-lock.ts`.
- B3 One skill copy: symlink or `.agents/skills/` only for runtimes verified to read it, to cut the 21 MB.
- B4 Subagents for other runtimes: Copilot `.github/agents/*.agent.md`, OpenCode `.opencode/agents/`, Gemini.
- B5 MCP server config sync across runtimes (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`, `opencode.json`).
- B6 Installable hooks: agent-guard and session bootstrap for Claude Code, and equivalents where supported.

**C. Quality and Trust**

- C1 Reproducible Caveman benchmark script with raw data, before any savings figure returns to the README or landing.
- C2 Real-terminal e2e for the arrow UI (node-pty in CI on Windows, macOS, Linux).
- C3 CI matrix: Node 18, 20, 22 and npm or pnpm. npm provenance and trusted publishing.
- C4 Verify the remaining runtime paths (Kimi, Hermes, OpenClaw, AdaL, Antigravity) and update `docs/runtime-scaffolds.md`.
- C5 Dedupe skill and command names that collide in Claude Code.

**D. Docs and Growth**

- D1 Landing v3 (`LANDING-V3-PLAN.md`).
- D2 A follower guide in Taglish: install, choices, first commands.
- D3 `CHANGELOG.md` generated from Conventional Commits.

## 11. Plan-Feature Part 2: Agent Engineering Track (separate from Part 1)

Part 1 (Section 10) is the product roadmap: CLI, distribution, quality. **Part 2 is a different topic.** It covers teaching and applying the 10 core concepts behind every working AI agent, so Sauron users learn them and use them. Run `/plan-feature` for Part 2 as its own run, after Part 1, and keep its stories and tasks under a separate `Part 2` heading in `context/PRD.md` and `context/TASKS.md`.

The 10 concepts, as given by the owner:

1. Harness Engineering
2. Loop Engineering
3. Context Engineering
4. Tool Design
5. Memory Architecture
6. Orchestration Patterns
7. Guardrails and Permissions
8. Evals for Agents
9. Human-in-the-Loop Design
10. Observability and Tracing

**Research first (same as Part 1).** Before `/plan-feature` Part 2, run `batch-site-research-scaffolder` again as its own run. Use one cohort, tag **Agent Engineering**, 12 targets. For each concept, research the current best practice, the source that defines it, and how a harness like Sauron can teach and apply it. Show the blueprint in chat and wait for approval. Save the findings as a Part 2 addendum or in `docs/research/`. Skip the missing `audit-compliance.js` gate. The URLs below were not fetched this session. Validate each in Step 1 of the skill, and replace any dead link with the official page on the same topic.

| #   | Target                                                                            | Concepts                                       |
| :-- | :-------------------------------------------------------------------------------- | :--------------------------------------------- |
| 1   | https://www.anthropic.com/engineering/building-effective-agents                   | 1 Harness, 2 Loop, 6 Orchestration             |
| 2   | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | 3 Context                                      |
| 3   | https://www.anthropic.com/engineering/writing-tools-for-agents                    | 4 Tool Design                                  |
| 4   | https://code.claude.com/docs/en/hooks                                             | 7 Guardrails, 9 Human-in-the-Loop              |
| 5   | https://github.com/humanlayer/12-factor-agents                                    | 2 Loop, 3 Context, 9 Human-in-the-Loop         |
| 6   | https://openai.github.io/openai-agents-python/                                    | 6 Orchestration, 7 Guardrails, 10 Tracing      |
| 7   | https://github.com/langchain-ai/langgraph                                         | 5 Memory, 6 Orchestration, 9 Human-in-the-Loop |
| 8   | https://docs.letta.com                                                            | 5 Memory                                       |
| 9   | https://modelcontextprotocol.io/specification                                     | 4 Tool Design                                  |
| 10  | https://www.promptfoo.dev/docs/intro/                                             | 8 Evals                                        |
| 11  | https://opentelemetry.io/docs/specs/semconv/gen-ai/                               | 10 Observability and Tracing                   |
| 12  | https://langfuse.com/docs                                                         | 8 Evals, 10 Observability                      |

**Existing Sauron coverage.** This is a starting map only, to be verified by reading each path:

| #   | Concept                    | Already in Sauron                                                                                                         | Gap                                          |
| :-- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------- |
| 1   | Harness Engineering        | Sauron itself: `adapters/transpiler.ts`, the `AGENTS.md` core, 19 runtime scaffolds                                       | No guide that explains a harness to users    |
| 2   | Loop Engineering           | `skills/workflow/autonomous-dev/04-execution-and-orchestration/`, the 3-failure stop, `skills/workflow/engineering-loop/` | No concept guide, no loop design checklist   |
| 3   | Context Engineering        | `skills/ai-engineering/context-engineering/`, Caveman, `handoff`, `find-skill`                                            | Not tied together as one concept             |
| 4   | Tool Design                | `skills/ai-engineering/structured-outputs-and-tool-calling/`, `adapters/mcp-skills.ts`                                    | No tool design review skill                  |
| 5   | Memory Architecture        | `skills/workflow/unified-memory-vault/`, `.claude/agent-memory/` scaffold                                                 | No memory design guide per runtime           |
| 6   | Orchestration Patterns     | Fellowship subagents, `skills/ai-engineering/langgraph-orchestrator/`, `adapters/worktree.ts`                             | No pattern catalog (router, pipeline, swarm) |
| 7   | Guardrails and Permissions | `skills/security/agent-guard/`, `.claude/hooks/guard.sh`, `adapters/slopsquat.ts`                                         | Not installed by `init` yet (candidate B6)   |
| 8   | Evals for Agents           | `skills/ai-engineering/promptfoo-eval-runner/`, `adapters/fitness.ts`                                                     | No agent eval harness for Sauron skills (C1) |
| 9   | Human-in-the-Loop Design   | Confirmation gates in `init` and in skills (for example `batch-site-research-scaffolder` Step 4), `test-gate`             | No HITL design guide                         |
| 10  | Observability and Tracing  | `skills/ai-engineering/agent-observability/`, `adapters/tracing.ts`, `skills/workflow/trace-analyst/`                     | No end-to-end tracing recipe for runtimes    |

**Packaging question for `/plan-feature` to decide: skill, module, or both?**

| Option                  | Shape                                                                                                                                               | Good for                                             | Risk                                                    |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- | :------------------------------------------------------ |
| A. Skills only          | New department `skills/agent-engineering/` with one skill per concept                                                                               | Agents can run them (`/loop-engineering` and others) | Skills are for doing, so the concept teaching gets thin |
| B. Docs module only     | New `docs/07-agent-engineering/` with one guide per concept                                                                                         | People learn the ideas                               | Agents cannot run a guide, so it is passive             |
| C. Hybrid (recommended) | Docs module to learn (what and why) + one router skill `agent-engineering` that maps each concept to the existing skills above and to an audit step | Both people and agents. Reuses existing skills       | Needs clear links so the docs and skills stay in sync   |

Recommendation: **Option C.** Add new skills only for the gaps in the table, and reuse what exists. Follow `lean-code`: the reuse ladder comes before new files.

**Possible deliverables to plan (each with a binary gate):**

- `docs/07-agent-engineering/README.md` plus 10 concept guides: definition, why it matters, how Sauron does it, and a checklist.
- Router skill `skills/agent-engineering/SKILL.md` (Tier-5 template) that points each concept to its skill or guide.
- Gap skills only where none exists, for example `tool-design-review`, `memory-architecture`, `orchestration-patterns`, `hitl-design`, `agent-evals`.
- An `init` option ("Include the Agent Engineering track?") or an `add` bundle (`sauron add agent-engineering`).
- A `sauron audit-agent` command (optional) that scores a project against the 10 concepts.
- Landing and README section: "10 concepts behind every working AI agent, and where Sauron covers each".
- Version label: minor (new skills and docs, nothing breaks).

**Rules for Part 2:** Re-author in Sauron style and never copy the source post text (`feedback_reauthor_imported_skills` memory). Every new skill follows `skills/_template/skill-name/SKILL.md`. Make no claims without a source.

## 12. Opening Prompt for the Next Session

```text
Continue Sauron from docs/handoffs/2026-10-20-sauron-v3-release-and-roadmap.md. Read it first.
Then run batch-site-research-scaffolder on Section 9 (one cohort, 12 targets). Show the blueprint in chat and wait for my approval before writing any file.
After approval, run /plan-feature Part 1 with the Section 10 brief plus the research findings.
Then run batch-site-research-scaffolder again on the Section 11 research table (Part 2, one cohort, 12 targets). Show that blueprint and wait for my approval.
Then run /plan-feature Part 2 (Section 11, Agent Engineering Track) as a separate run, using the Part 2 findings. Decide skill vs module vs hybrid with me before writing tasks.
Extend context/PRD.md and context/TASKS.md under separate Part 1 and Part 2 headings (read them first, never overwrite them, never commit them).
Reply in caveman ultra. Do not publish, delete branches, or push without my confirmation.
```
