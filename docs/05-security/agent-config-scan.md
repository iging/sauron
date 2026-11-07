# Review Agent Configuration

Unreleased 4.0.0 command. Use a launcher from this checkout or a packed development build.

```sh
sauron scan
sauron scan /path/to/project --json
sauron scan --sarif
sauron scan --fail-on=warning
```

The scanner reads selected project instructions, agent/command/skill prompts, hook files,
MCP configuration, and permission declarations. It never executes hooks or commands, connects
to MCP servers, fetches packages, changes configuration, or creates reports on disk.
JSON and SARIF go to stdout. Redirect output yourself if you need an artifact.

## Selection and bounds

The closed path lists live in adapters/security-scan.ts as SCAN_FILES and SCAN_DIRECTORIES.
They include root agent guides, Claude settings and MCP files, Codex project config and agents,
Copilot customization, Cursor config, OpenCode config, omp, Gemini, and Pi project paths.
This is selected-path coverage, not a whole-repository or all-runtime certification.

There is no automatic home/global or other-worktree discovery. Within selected trees, .git,
.sauron, worktrees, dependencies, .env files, and known credential files are excluded. Unknown file extensions are skipped except in hook directories. Symlinks
and junctions are refused. A selected special file is not opened.

Limits: 2000 files, 8000 directory entries, eight nested levels, 1 MiB per file, and 16 MiB total.
JSON/JSONC and YAML are parsed with bounded traversal and YAML aliases. Unknown YAML tags,
malformed config/frontmatter, unsupported text, unreadable paths, and limits produce diagnostics.
TOML is explicitly listed as heuristic coverage and is not syntax or schema validated.
JSON/YAML findings point to the file at line 1. Text findings use the matching source line.

## Review rules

- Sandbox or permission bypass declarations, broad shell/write allow rules, and disabled approvals.
- Remote-code pipes, dynamic shell evaluation, and hook approval declarations needing review.
- MCP inline credentials, non-loopback cleartext endpoints, and floating npx package versions.
- Direct prompt requests to override earlier instructions or export sensitive data.

Rules inspect declarations, not effective merged permissions, conditions, trust, or precedence.
A finding is a review hint. It can have legitimate uses or be an example. Absence of findings
is not proof of safety. Complete means bounded inspection finished within the supported scope.
TOML heuristics, skipped files, and uninspected settings remain outside that assurance.

No source excerpts, commands, URLs, secret values, or parser exception text enter findings.
Reports contain relative file paths, line numbers, static rule ids, and review guidance.
Do not assume filenames themselves are public when sharing a report.

## Exit codes

- 0: inspection completes without an error finding at the chosen threshold.
- 1: findings reach the threshold. Default is error, with --fail-on=warning or none available.
- 2: incomplete inspection or invalid arguments. --fail-on=none never hides incomplete scans.

SARIF reuses the slop-scan representation with the sauron-scan tool name and includes diagnostics.
Link and file-identity checks do not create an OS sandbox against concurrent parent-path changes.

## Rule context

Codex approval and sandbox declarations follow the
[official configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).
Broad Claude allow rules and bypass modes need review under its
[permission model](https://code.claude.com/docs/en/permissions).
