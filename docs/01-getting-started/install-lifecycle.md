# Install Lifecycle

Four commands look after what Sauron installed. They read `.sauron/manifest.json`, which records
every file Sauron wrote and its checksum.

## File states

| State     | Meaning                                                                    |
| :-------- | :------------------------------------------------------------------------- |
| `clean`   | Sauron wrote the whole file, and nobody changed it.                        |
| `edited`  | Sauron wrote the whole file, and you changed it since.                     |
| `merged`  | Sauron content sits inside your own file, as a managed block or JSON keys. |
| `missing` | The file is gone.                                                          |
| `unsafe`  | The recorded path leaves the project folder. Sauron never touches it.      |

## `list-installed`

Lists every recorded file by runtime, with its state. It writes nothing.

```bash
npx sauron-ai list-installed
npx sauron-ai list-installed --json
```

## `doctor`

Checks the Node.js version, the config version, the manifest, and each recorded file. It writes
nothing. It exits with code 1 when it finds an error, so CI can use it.

```bash
npx sauron-ai doctor
npx sauron-ai doctor --json
```

| Level   | Examples                                                                        |
| :------ | :------------------------------------------------------------------------------ |
| `error` | Node.js below 20.12.0, a damaged manifest or config, a path outside the project |
| `warn`  | No config, config v1, a missing file, a removed managed block                   |
| `info`  | Files you changed. Sauron keeps them as they are                                |

## `repair`

Applies your saved choices again, like `sync`. Missing files and removed managed blocks come
back. Files you changed are kept. Then `doctor` runs again.

```bash
npx sauron-ai repair --dry-run
npx sauron-ai repair
```

A damaged manifest stops `repair`. Restore `.sauron/manifest.json` from version control first.

## `uninstall`

Shows a preview by default. Nothing changes until you add `--yes`.

```bash
npx sauron-ai uninstall
npx sauron-ai uninstall --yes
```

| File                                | What uninstall does                    |
| :---------------------------------- | :------------------------------------- |
| `clean`                             | Removed                                |
| `merged` text file                  | Managed block removed, your lines kept |
| `merged` JSON file                  | Kept, because the keys cannot be split |
| `edited`                            | Kept                                   |
| `missing`                           | Dropped from the manifest              |
| `sauron.config.yaml` and `.sauron/` | Kept                                   |

Every removal and change keeps a copy in `.sauron/backups/`. Folders left empty by a removal are
removed. A file that changes between the preview and `--yes` is kept.
