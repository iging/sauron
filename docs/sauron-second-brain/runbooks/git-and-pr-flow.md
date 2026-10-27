# Git and Pull Request Flow

Steps for shipping work. Rules are in [[working-rules]]. See [[claude]].

## Flow

1. Build uncommitted. Review happens in chat.
2. Miguel runs `/progress-report`. Run the gates: build, typecheck, test, doc gate.
3. Create the branch. Names look like `feature/short-topic`, `fix/topic`, `docs/topic`.
4. Commit in logical groups. Conventional Commits. Add the Co-Authored-By line.
   The pre-commit hook runs the tests and the doc gate on every commit.
5. Push the branch with `-u`. Give Miguel the compare link.
6. Write `progress-report-result.md` in the root (git ignores it): branch, commits, PR text,
   Google XYZ report. No invented numbers, no line or file counts as metrics.
7. Wait. Miguel opens and merges the pull request, or asks for a direct push to `main`.

## Size

A pull request should stay near 15 files and 500 lines. Larger is allowed when the extra
files are trivial (for example, one-line count edits), but say so in the description.

## Staging

- Stage files by name. Check `git status --short` first.
- Leave out the local-only files listed in [[security-rules]] and any `.vscode/` change.

## After a merge

1. `git switch main`
2. `git pull --ff-only`
3. Check `git status --short` shows only `??` local files.
4. Update [[status]] and [[open-items]].
