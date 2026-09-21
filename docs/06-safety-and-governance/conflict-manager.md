# Conflict Manager: Zero Destructive Overwrites

A critical failure mode of AI coding agents is unbacked file overwrites. When an agent regenerates configuration files without checking existing contents, manual user customizations are lost.

Sauron prevents this through the **Conflict Manager**, a zero-destructive file mutation engine.

---

## How Conflict Manager Operates

Every file write initiated by Sauron routes through `ConflictManager.safeWriteFile()`:

```text
[Generated Content]
        │
        ▼
   Calculate SHA-256 Digest
        │
        ▼
   File Exists on Disk?
    ├── NO  ──► Action: 'created' (Write file & record manifest)
    └── YES ──► Hash Matches Disk?
                 ├── YES ──► Action: 'unchanged' (Skip disk write)
                 └── NO  ──► Action: 'updated'
                              │
                              ├── 1. Generate Backup: .sauron/backups/<file>.<timestamp>.bak
                              ├── 2. Write New Content
                              └── 3. Update Manifest with Backup Reference
```

---

## State Tracking via Manifest

Sauron stores tamper-evident state records in `.sauron/manifest.json`:

```json
{
  "installedAt": "2026-09-19T10:00:00.000Z",
  "version": "1.0.0",
  "managedFiles": [
    {
      "path": "CLAUDE.md",
      "runtime": "claude",
      "backupPath": ".sauron/backups/CLAUDE.md.1774087200000.bak",
      "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "lastUpdated": "2026-09-19T10:15:00.000Z"
    }
  ]
}
```

---

## Restoring Backups

If an automated synchronization replaces a custom configuration you wish to recover:

1. Locate the backup listed in `.sauron/manifest.json` under `backupPath`.
2. Inspect the diff between the backup file in `.sauron/backups/` and the active file.
3. Copy your custom directives back into your workspace or integrate them into `sauron.config.yaml`.
