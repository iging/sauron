# Task to File Map

Read one row after [[resume-brief]]. Paths are repository-relative.

| Task | First source files | Vault context |
| :-- | :-- | :-- |
| CLI prompts and flags | `bin/sauron.mjs`, `adapters/init-plan.ts` | [[architecture-map]] |
| Runtime output | `adapters/<id>.ts`, `docs/runtime-scaffolds.md` | [[agent-runtimes]] |
| Runtime registry | `adapters/transpiler.ts`, `adapters/init-plan.ts` | [[agent-runtimes]] |
| Safe writes | `adapters/conflict-manager.ts` | [[architecture-map]] |
| Skill installation | `adapters/installer.ts`, `bin/sauron.mjs` | [[architecture-map]] |
| Skill lookup | `adapters/skill-finder.ts` | [[history-skills-and-discipline]] |
| Graph | `scripts/graph/generate-graph.mjs` | [[history-releases-and-init]] |
| Config | `config/`, `schema/`, `sauron.config.yaml` | [[decisions]] |
| New skill | `skills/_template/skill-name/SKILL.md` | [[working-rules]] |
| Fellowship | `core/fellowship/<name>.md` | [[project-overview]] |
| Release | `package.json`, `package-lock.json` | [[release-and-publish]] |
| Runtime tests | `tests/unit/<id>-scaffold.test.mjs` | [[verification-checklist]] |
| Planning | New local drafts only when requested | [[roadmap-brief]] |
| Historical decision | Exact commit or handoff section | [[history-index]] |
| Cleanup | Exact file and its callers | [[cleanup-record]] |

## Targeted inspection

- `rg -n "<symbol>" adapters bin tests` for code ownership.
- `git log --oneline -- <path>` for one component's history.
- `git show <commit> -- <path>` for one change.
- Tests import `dist/`. Build before testing adapter changes.
- Checkout runtime instructions differ from adapter output for users.
  Do not delete them merely because the adapter now emits another path.
