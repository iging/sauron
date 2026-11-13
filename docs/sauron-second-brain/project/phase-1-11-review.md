# Phases 1 to 11 implementation review

Updated: 2026-11-11. Phase 11 merges through PR #30 at 28d9269.
Scope: approved phase implementations, follow-up fixes and current product/vault documentation.
Four confirmed source gaps are fixed. The landing changes are verified locally.
Remaining manual verification and release work are tracked in [[open-items]].

## Resolved findings

1. Runtime matrix: corrected 248 installable skills, five native-agent runtimes and three
   command-wrapper runtimes. Source: references/runtime-matrix.md, adapters/installer.ts.
2. Landing advisor: synced current 1.2.0 SKILL.md including the industry-standard base rule.
   Source: skills/architecture/folder-structure-advisor/SKILL.md and landing content copy.
3. Landing compiler: replaced recursive supporting-file discovery with installable-owner
   discovery. All 248 generated entries match canonical YAML metadata. Build regenerates it,
   count label derives from JSON, and regression fixtures cover depth and invalid metadata.
4. Docker naming: docker-compose.yml now uses sauron-ai and sauron-ai:local.
   README and docker/README.md match. Compose config, build and default-entrypoint status pass.

## Additional fixes

- Installer tests support pwsh or powershell.exe, with an explicit skip if neither exists.
- CLI help lists all five native-agent targets and no duplicate sync command.
- Graph assets pin vis-network 10.1.5. Both asset URLs return 200.
- Public quickstart, FAQ, config and CLI docs correct Node floor, counts, choices and migration.
- Documentation portal removes unsupported savings claims and links the new feature guides.
- Current vault startup/order/roadmap notes no longer direct agents to obsolete minor releases.
- Historical session notes and the approved plan text remain unchanged.

## Phase coverage

| Phase | Evidence | Closure |
| :-- | :-- | :-- |
| 1 | Runtime-root notes, aliases, installable catalog | Source gaps fixed |
| 2 | config.ts, schemas, upgrade backups/reports | Fixtures and earlier native smoke pass |
| 3 | skill-picker.ts, arrow/numbered flows | Git Bash and PowerShell picker checks pass |
| 4 | lifecycle.ts, doctor/repair/uninstall | Real edited-project check open |
| 5 | Profiles, plugin/marketplace, support tiers | Real plugin/runtime checks open |
| 5b | 78 agent specs, access renderers and models | Documented runtime limits |
| 6 | Codex TOML and Copilot agents | Real-tool checks open, beta |
| 7 | memory.ts, create-only vault | Human/Obsidian review open |
| 8 | Selected-path scan, JSON/SARIF | Real finding review open |
| 9 | Bounded parsers, ledger, diff/export/reuse/MCP | Real build/HAR explicitly deferred |
| 10 | Advisor, patterns/samples, context handoffs | Repo and landing copy aligned |
| 10b | Attributed re-authoring, idea map, guides | Implementation and compared sync present |
| 11 | Original standalone Windows distribution | Removed from 4.0.0 scope |

Phase 5b uses typed constants in agent-access.ts instead of the planned YAML files, by the
recorded session decision. Instruction-only restrictions are not runtime enforcement.
OpenCode remains the only stable runtime. No missing file is inferred from old plan names.

## Verification and remaining gates

- Build/typecheck/strict CLI/packaging/doc gate pass. Node 20/22/24 each pass all 384 tests.
- Landing: 248 canonical entries, three tests, typecheck, lint and static build pass.
- Selected product local links and current vault wiki-note targets resolve.
- Docker config/build/status pass. Miguel's build shows 1.31 MB context transferred.
- PowerShell decline/exit and Git Bash Backspace/cancel preserve their fixtures.
- Claude plugin validates and installs in isolated local state. OpenCode discovers agents.
  Git Bash and PowerShell install and reload 11 selected skills. Live sessions stay open.
- npm pack preview excludes internal/local notes.
- Real Eye build/HAR, live runtime sessions and landing
  browser/deployment checks remain unverified. See [[open-items]].
- Phase 12 docs readiness advances, but release execution still needs Miguel's signal.
