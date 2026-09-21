---
id: conventional-commit
name: Conventional Commits and Atomic Staging
department: devsecops
owner_agent: samwise
trigger_command: /commit
version: 1.0.0
---

# Conventional Commits and Atomic Staging

Format all repository commits according to the Conventional Commits 1.0.0 specification. Package changes into single-purpose, atomic units with descriptive semantic headers, explanatory bodies, and explicit breaking change notices.

## When to Activate

- Creating git commits after implementing or fixing code.
- Staging modified files for pull requests or release tagging.
- Enforcing git commit message linters in pre-commit hooks or continuous integration.
- Preparing release notes and changelog generations.

## Core Intent and Authority

- **Owner Agent:** `samwise` (Git Commits and State Keeper).
- **Authority Boundary:** Owns git commit execution, staging commands, and commit message formatting. Refuses to stage unrelated files in a single commit.
- **Execution Rule:** One logical concern per commit. Never combine feature additions, bug fixes, and formatting adjustments into a single commit.

## Conventional Commits 1.0.0 Specification

Commit messages must conform to the following structural format:

```text
<type>(<scope>): <short summary in imperative mood>

[optional body explaining motivation and architectural context]

[optional footer(s) for issue tracking or breaking changes]
```

### Commit Types Matrix

| Type         | Purpose and Permitted Usage                                | Triggers SemVer Bump |
| :----------- | :--------------------------------------------------------- | :------------------- |
| **feat**     | Adds a new capability, endpoint, or user-facing feature    | MINOR                |
| **fix**      | Resolves a bug, defect, or unexpected exception            | PATCH                |
| **refactor** | Code changes that neither fix a bug nor add a feature      | None / PATCH         |
| **perf**     | Code changes that improve performance or reduce memory     | PATCH                |
| **test**     | Adds missing tests or corrects existing test assertions    | None                 |
| **docs**     | Documentation only updates (README, API docs, guides)      | None                 |
| **style**    | Formatting, semicolons, whitespace (no logic changes)      | None                 |
| **ci**       | CI/CD pipeline and automated workflow configurations       | None                 |
| **build**    | Changes that affect build systems or external dependencies | PATCH                |
| **chore**    | Routine maintenance, version bumps, or license tasks       | None                 |

## Atomic Staging Rules

1. **Rule 1: Isolate Unrelated Changes:** If three files are edited for three distinct purposes (for example one schema change, one bug fix, and one test adjustment), create three separate commits using `git add <file>`.
2. **Rule 2: Imperative Present Tense:** Write commit headers in the imperative mood. Write "add user authentication" rather than "added user authentication" or "adds user authentication".
3. **Rule 3: Under 72 Characters:** The header line must not exceed 72 characters in total length.
4. **Rule 4: Breaking Changes Header:** If a change breaks backward compatibility, append an exclamation mark after the type or scope (`feat(api)!: drop legacy endpoint`) and document details in the `BREAKING CHANGE:` footer.

## Valid Commit Examples

### Standard Feature Commit

```text
feat(auth): add Argon2id password hashing and session rotation

Implement secure password hashing using Argon2id with 64MB memory cost.
Rotate session identifiers upon successful login to prevent session fixation.

Closes #104
```

### Breaking Change Commit

```text
feat(api)!: migrate billing webhook payload to v2 schema

BREAKING CHANGE: The 'customer_token' field is replaced by 'customer_id' (UUID).
Consumers must update webhook ingestion handlers before upgrading.
```

### Bug Fix Commit

```text
fix(parser): prevent null reference when processing empty order payload

Handle cases where payload.items is null by defaulting to an empty array.
Add regression test covering empty order payloads.

Fixes #142
```

## Hard Verification Gates

- Reject commit messages that contain generic summaries like "fix bugs", "update files", "wip", or "cleanup".
- Reject commit messages ending with a period (`.`) in the header line.
- Reject commits that stage more than 15 files unless categorized as a bulk mechanical refactor or automated dependency upgrade.

## Anti-Patterns Prevented

- **AP-18 (Non-atomic commit):** Prohibits mega-commits that bundle disparate changes into a single opaque history entry.
- **AP-19 (Uninformative commit message):** Rejects commit messages lacking semantic type and scope context.
- **AP-20 (Untracked work):** Ensures every code change maps directly to a discrete, traceable commit.
- **AP-56 (Opaque breaking changes):** Enforces explicit breaking change indicators in commit headers and footers.

## Related Skills

- [ci-generator.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/devsecops/ci-generator.md)
- [samwise.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/samwise.md)
- [tdd-runner.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/qa/tdd-runner.md)
