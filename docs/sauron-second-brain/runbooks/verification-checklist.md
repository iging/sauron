# Verification Checklist

Unfinished runtime checks from retired root guides. See [[status]] and [[open-items]].

## Automated baseline

1. Build before tests. Run typecheck, Node tests, and the pre-push doc gate.
2. Test the packed package in a scratch directory, not this checkout.
3. Status reports the correct version and runtime count.
4. omp and Claude init write native assets. Graph writes three reports.
5. Add a user MCP key through ConflictManager and rerun. The user key survives.
6. Invalid flags fail closed. Dry-run, cancel, and rejected confirmation write nothing.

## Real terminal, still unverified

- Git Bash and PowerShell: arrows move, Space toggles, Enter confirms.
- Custom runtimes include omp after Pi.
- Ctrl+C cancels without generated files.
- After confirmation, setup exits and the terminal prompt returns by itself.

## Real runtime, still unverified

- Claude Code: /agents, /gandalf, /plan-feature, /output-style, /memory.
- Check which asset wins when a skill and command share a name.
- omp: loaded root AGENTS.md and discovery of shared skills.
- Cursor rules, Copilot instruction references, Gemini memory context.
- pnpm dlx and both installers in a separate scratch user or project.

## Existing-project safety

- User source, manifest, lockfile, and Sauron config retain user changes.
- Edited raw assets are skipped. Markdown outside managed blocks survives.
- JSON user keys survive. Invalid JSON is left untouched.
- Legacy files remain until user-authorized removal.
- Backups and merge actions are reported. An unchanged second run is idempotent.

Old guide statements about replacing files predate safe merge. Follow current tests.
