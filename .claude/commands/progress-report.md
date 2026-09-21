---
name: progress-report
description: Analyzes active Git workspace changes and generates structured branch names, commit commands, PR descriptions, and Google XYZ progress reports in progress-report-result.md.
metadata:
  short-description: Generate branch, commit, PR, and Google XYZ report
---

Analyzes active Git workspace changes and writes a structured progress summary to `progress-report-result.md`.

This command applies the prompt specifications defined in:

- `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/git-analyzer-and-progress-report-generator/SKILL.md`
- `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/commit-message-generator/SKILL.md`
- `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/pull-request-description-generator/SKILL.md`

## Workflow Steps

### 1. Workspace Inspection

Inspect active workspace changes using non-interactive Git commands:

- Run `git status` to identify modified, staged, and untracked files.
- Run `git diff` and `git diff --cached` to review exact code and documentation modifications.

### 2. Fact Extraction and Anti-Hallucination Constraints

Extract technical facts directly from the Git inspection output:

- Base all statements on verified code and documentation changes.
- Never speculate, invent, or guess changes not present in the Git diff.
- Do not use lines of code, files changed, or directories created as quantitative "Y" metrics in Google XYZ statements.
- When quantitative business or performance metrics are absent, write precise technical accomplishment bullets instead of fabricating metrics (Option B fallback).

### 3. Output Generation

Format the required sections according to the prompt specifications:

- **Branch Name**: Suggest a Git branch name matching repository conventions (for example: `feature/short-description`, `fix/issue-description`, `docs/topic-name`, `refactor/scope`, or `chore/task`).
- **Commit Commands**: Provide conventional commit commands formatted per `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/commit-message-generator/SKILL.md` (for example: `git commit -m "feat(scope): add progress report command"`).
- **Pull Request Description**: Provide a PR description formatted per `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/pull-request-description-generator/SKILL.md` with a title under 70 characters (`category: brief description`) and a body summarizing changes, modified files, and compliance status. Enforce the PR ceiling of approximately 15 files and 500 lines of code.
- **Google XYZ Progress Report**: Write accomplishment statements per `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/git-analyzer-and-progress-report-generator/SKILL.md` using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" (or Option B fallback when metrics are absent).

### 4. File Output

Write the formatted results directly to `progress-report-result.md` in the repository root.

## References

- `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/git-analyzer-and-progress-report-generator/SKILL.md`
- `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/commit-message-generator/SKILL.md`
- `skills/workflow/prompt-engineering/prompts-by-category/dev-workflow/pull-request-description-generator/SKILL.md`
- `skills/workflow/define-core-domains/references/writing-rules.md`
- `references/anti-patterns.md`
- `AGENTS.md`
- `CLAUDE.md`
