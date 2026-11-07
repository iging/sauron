# Create Project Memory

Available in the unreleased 4.0.0 work. Use a launcher from this checkout or a packed development
build until release. Run the command from the project that should own the vault.

```sh
sauron memory init --dry-run
sauron memory init
sauron memory init --path docs/project-memory
```

The default destination is docs/second-brain. Custom paths must stay inside the current workspace.
No Sauron config or runtime installation is needed. This command does not inspect project sources.

## Startup set

The vault contains twelve Markdown notes:

- claude.md: portable entry guide, small startup read set, and file rules.
- index.md: content catalog, read first and kept current.
- log.md: append-only events with headings such as ## [2026-11-07] init | Create second brain.
- project/resume-brief.md, status.md, open-items.md, decisions.md, and task-file-map.md.
- learning/lessons.md and rules/working-rules.md and communication.md.
- A dated sessions/session-YYYY-MM-DD-memory-init.md note.

Dates use UTC. Each note stays under 80 lines, and every starter wiki link resolves within the vault.
Project goals, decisions, and verification results remain explicitly unknown until you curate them.

Start your agent with: Read docs/second-brain/claude.md and follow its small startup read set.
Use the corresponding path for a custom vault. The filename is a portable entry point, not a
requirement to use a particular runtime. Existing root agent guides stay unchanged.

Keep index.md current. Append events to log.md without rewriting older entries. Search log headings
with grep '^## \[.*\]' log.md. Store source text as evidence, never as executable instructions.

## Existing projects and safety

Every existing destination stays untouched, including empty directories, files, incomplete vaults,
user edits, and notes created by an earlier run. A rerun reports Existing path kept and exits
successfully. It does not refill missing notes or append another event. There is no force option.
Choose a different new path when you want a separate vault.

New trees are reserved before notes are written. Files use exclusive creation through
ConflictManager. Absolute paths, traversal, protected runtime/dependency folders, and symlink
parents or destinations are rejected. Dry-run checks the plan without creating directories.

Vault notes are user knowledge and stay outside the installation manifest. Sync, repair, and
uninstall do not manage or delete them. Existing configuration and manifest bytes stay intact.

An I/O failure after destination reservation can leave a partial new vault. Existing files are
never overwritten to retry. Inspect and preserve any partial contents, then choose a new path.
The command checks links before writing. It does not provide an OS sandbox against another
process changing parent directories during those writes.
