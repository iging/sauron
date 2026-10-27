# Architecture Map

Orientation, not a full source listing. See [[task-file-map]].

## Main flow

1. `bin/sauron.mjs` dispatches commands and resolves the package asset root.
2. `adapters/init-plan.ts` validates choices and registered runtime IDs.
3. Prompts build a plan. Confirmation precedes writes.
4. `adapters/transpiler.ts` loads config and renders selected adapters.
5. Runtime adapters produce file paths and text, not raw disk mutations.
6. ConflictManager merges, backs up, and records managed output.
7. `adapters/installer.ts` installs selected skills, agents, and commands.
8. Saved `init:` choices let sync repeat setup without prompts.

## Write invariants

- Markdown retains user text outside the Sauron managed block.
- TOML and YAML use comment markers. Markdown uses HTML comment markers.
- JSON deep merge keeps user values. Invalid JSON is skipped.
- User-edited raw assets are skipped, not overwritten.
- Checksums avoid redundant writes. Changes receive backups first.
- Batched manifests reduce disk writes.
- Only ConflictManager manages its backups and state manifest.

## Assets and discovery

- `skills/`: workflows. Read the matching skill, not the catalog.
- `core/fellowship/`, `core/agents/`: agent specifications.
- `commands/`: installable slash commands.
- `rules/`, `references/`: shared constraints and reference material.
- `adapters/skill-finder.ts`: offline weighted BM25 over metadata.
- `scripts/graph/generate-graph.mjs`: imports and HTML, JSON, Markdown reports.
- Registry, MCP, fitness, tracing, and worktree helpers live in adapters.
  File existence does not prove full integration. Check the caller first.

## Packaging and validation

- TypeScript strict, ES modules, relative `.js` imports, no barrel files.
- Build compiles adapters to `dist/`. Node tests cover unit, integration, and e2e.
- Package `files` controls npm assets. Graph needs shipped `scripts/`.
- Both schemas and both config templates must agree on runtime toggles.
- CI uses Node 22. A wider runtime and package-manager matrix is a candidate.

Sources: selected current entry points and [[history-index]]. Read code before changing it.
