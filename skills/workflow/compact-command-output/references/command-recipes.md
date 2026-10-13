# Command Recipes

Compact forms for the commands agents run most. Each recipe uses the tool's own flags first, then a filter, then a limit. Recipes are written for Bash; Section 12 gives the PowerShell equivalents.

Flag names can change between tool versions. If a flag is rejected, run the tool's `--help` once and adjust.

## 1. The Four Strategies

| Order | Strategy | Meaning                                      | Example                       |
| ----- | -------- | -------------------------------------------- | ----------------------------- |
| 1     | Quiet    | Ask the tool for its short or machine format | `git status --short`          |
| 2     | Filter   | Keep only lines that answer the question     | `rg -l pattern`               |
| 3     | Group    | Turn repeats into counts                     | `sort \| uniq -c \| sort -rn` |
| 4     | Limit    | Cap what remains at a fixed number of lines  | `tail -n 60`                  |

Use them in that order. A quiet flag cannot hide a failure; a careless limit can.

## 2. Safety Rules

1. **Keep the exit status.** In Bash, `cmd | head` reports the status of `head`. Either avoid the pipe, or start the script with `set -o pipefail`, or capture the status: `cmd > out.txt 2>&1; code=$?`.
2. **Tail for builds and tests, head for listings.** Causes sit at the end of build and test output.
3. **Never filter out errors or warnings.** Filter out progress, passing items, and unchanged items.
4. **Merge the error stream when filtering** (`2>&1`), or errors bypass the filter and arrive out of order.
5. **Full output is one command away.** When the compact form does not show a cause, re-run that single command plainly.
6. **Do not compact confirmations for destructive commands.** Read what a delete, reset, force-push, or migration says in full.

Failures-only wrapper that preserves the status:

```bash
out=$(some-command 2>&1); code=$?
if [ "$code" -eq 0 ]; then
  echo "ok ($(printf '%s\n' "$out" | wc -l) lines not shown)"
else
  printf '%s\n' "$out" | tail -n 60
fi
exit "$code"
```

## 3. Git

| Question                          | Compact form                                          |
| --------------------------------- | ----------------------------------------------------- |
| What changed in the working tree? | `git status --short --branch`                         |
| Which files differ?               | `git diff --name-only` or `git diff --stat`           |
| What changed in one file?         | `git diff -U1 -- path/to/file`                        |
| What is staged?                   | `git diff --cached --stat`                            |
| Recent history?                   | `git log --oneline -n 15`                             |
| Who and when?                     | `git log --format='%h %ad %an %s' --date=short -n 15` |
| What did one commit touch?        | `git show --stat --format='%h %s' <rev>`              |
| Which branches exist?             | `git branch --format='%(refname:short)'`              |
| Commit, push, pull, fetch         | Add `-q`. Errors still print.                         |
| Is the tree clean?                | `git status --porcelain \| wc -l`                     |

Start with `--stat` or `--name-only`, then open the one diff that matters. A full `git diff` across a large change is rarely the right first read.

## 4. Files and Directories

| Question                    | Compact form                                                                    |
| --------------------------- | ------------------------------------------------------------------------------- |
| What is in this folder?     | `ls -1`                                                                         |
| What is the project shape?  | `git ls-files \| cut -d/ -f1,2 \| sort -u \| head -60`                          |
| How many files per folder?  | `git ls-files \| cut -d/ -f1 \| sort \| uniq -c \| sort -rn`                    |
| Two levels, no vendor noise | `find . -maxdepth 2 -not -path './node_modules/*' -not -path './.git/*'`        |
| How big is this file?       | `wc -l path/to/file`                                                            |
| What does this file define? | `grep -n -E '^(export \|class \|function \|def \|func \|pub fn )' path/to/file` |
| One part of a file          | `sed -n '40,80p' path/to/file`                                                  |

Check the size before reading a file. Read the outline, then the range that answers the question. Skip generated folders: `node_modules`, `dist`, `build`, `target`, `.git`, lock files.

## 5. Search

| Question                 | Compact form                                        |
| ------------------------ | --------------------------------------------------- |
| Which files mention it?  | `rg -l pattern`                                     |
| How often, per file?     | `rg -c pattern`                                     |
| Where, briefly?          | `rg -n --max-count 5 --max-columns 160 pattern`     |
| Only in one kind of file | `rg -n -t ts pattern` or `rg -n -g '*.md' pattern`  |
| Without ripgrep          | `grep -rn --include='*.ts' pattern src \| head -40` |

Search for file names first, then open matches. Long minified lines are the usual cause of a flooded search; `--max-columns` removes them.

## 6. Tests

| Runner           | Compact form                                            | Shows                           |
| ---------------- | ------------------------------------------------------- | ------------------------------- |
| Node test runner | `node --test --test-reporter=dot`                       | Dots, then failures and summary |
| Vitest           | `npx vitest run --reporter=dot`                         | Dots, then failures             |
| Jest             | `npx jest --silent`                                     | Suites, no console noise        |
| Pytest           | `pytest -q --tb=short --no-header`                      | Failures with short tracebacks  |
| Cargo            | `cargo test --quiet`                                    | Failures and totals             |
| Go               | `go test ./... 2>&1 \| grep -v -E '^ok\|no test files'` | Failing packages only           |
| .NET             | `dotnet test --nologo --verbosity quiet`                | Failures and totals             |

Then, for a failure, run only that file or that test in full: `node --test path/to/file.test.mjs`, `pytest path::test_name -x`, `cargo test test_name`.

The Go recipe filters passing packages; an empty result with exit status 0 means all passed. Confirm with the status, not the silence.

## 7. Build, Typecheck, Lint

| Tool       | Compact form                                  |
| ---------- | --------------------------------------------- |
| TypeScript | `npx tsc --noEmit --pretty false`             |
| ESLint     | `npx eslint . --quiet --format unix`          |
| Ruff       | `ruff check --output-format concise`          |
| Cargo      | `cargo build --quiet`, `cargo clippy --quiet` |
| Make       | `make -s`                                     |
| Gradle     | `./gradlew build --quiet --console=plain`     |
| Any build  | The failures-only wrapper in Section 2        |

To see where errors cluster before reading them: `npx tsc --noEmit --pretty false | cut -d'(' -f1 | sort | uniq -c | sort -rn | head -15`.

`--quiet` on a linter hides warnings by design. Use it to answer "are there errors", and run without it when warnings are the question.

## 8. Package Managers

| Tool  | Compact form                                                         |
| ----- | -------------------------------------------------------------------- |
| npm   | `npm install --no-audit --no-fund --loglevel=error`                  |
| npm   | `npm ls --depth=0` for the top-level tree                            |
| npm   | `npm outdated` already prints a table; add `--json` to select fields |
| pnpm  | `pnpm install --reporter=silent`                                     |
| pip   | `pip install -q package`, `pip list --format=freeze`                 |
| Cargo | `cargo add package --quiet`                                          |

Skipping the audit summary on install does not skip security: run the audit as its own command when that is the question.

## 9. Containers and Clusters

| Question                | Compact form                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| What is running?        | `docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'`  |
| Which images?           | `docker images --format '{{.Repository}}:{{.Tag}}\t{{.Size}}'`    |
| Recent logs             | `docker logs --tail 50 <container>`                               |
| Build                   | `docker build -q .` prints only the image id on success           |
| Pods not healthy        | `kubectl get pods --field-selector=status.phase!=Running`         |
| Pod logs                | `kubectl logs --tail=50 <pod>`                                    |
| One field of a resource | `kubectl get deploy <name> -o jsonpath='{.status.readyReplicas}'` |

## 10. Logs and Repeated Lines

| Question                     | Compact form                                                          |
| ---------------------------- | --------------------------------------------------------------------- |
| Latest entries               | `tail -n 50 app.log`                                                  |
| Only problems                | `grep -n -i -E 'error\|fail\|panic\|exception' app.log \| tail -n 30` |
| Which messages repeat most   | `sort app.log \| uniq -c \| sort -rn \| head -20`                     |
| Repeats, ignoring timestamps | `cut -d' ' -f3- app.log \| sort \| uniq -c \| sort -rn \| head -20`   |
| Around one match             | `grep -n -C 3 'pattern' app.log \| head -40`                          |

Collapsing repeats into counts is usually the largest single saving on logs.

## 11. APIs, JSON, and GitHub CLI

| Question                 | Compact form                                                                     |
| ------------------------ | -------------------------------------------------------------------------------- |
| What shape is this JSON? | `jq 'keys' file.json` or `jq '.[0] \| keys' file.json`                           |
| A few fields only        | `jq '.items[] \| {id, name, status}' file.json`                                  |
| HTTP status only         | `curl -s -o /dev/null -w '%{http_code}\n' URL`                                   |
| Open pull requests       | `gh pr list --limit 10 --json number,title --jq '.[] \| "\(.number) \(.title)"'` |
| Why did CI fail?         | `gh run view <id> --log-failed \| tail -n 60`                                    |
| Checks on a pull request | `gh pr checks <number>`                                                          |

Always pass `-s` to `curl` in agent sessions; the progress meter is pure noise.

## 12. PowerShell Equivalents

| Bash                               | PowerShell                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `ls -1`                            | `Get-ChildItem -Name`                                                        |
| `head -n 40 file`                  | `Get-Content file -TotalCount 40`                                            |
| `tail -n 50 file`                  | `Get-Content file -Tail 50`                                                  |
| `sed -n '40,80p' file`             | `(Get-Content file)[39..79]`                                                 |
| `wc -l file`                       | `(Get-Content file).Count`                                                   |
| `grep -n pattern file \| head -5`  | `Select-String -Path file -Pattern pattern \| Select-Object -First 5`        |
| `cmd \| tail -n 60`                | `cmd \| Select-Object -Last 60`                                              |
| `sort \| uniq -c \| sort -rn`      | `Group-Object \| Sort-Object Count -Descending \| Select-Object Count, Name` |
| `2>&1`                             | `2>&1`                                                                       |
| Exit status after a native command | `$LASTEXITCODE`                                                              |

In PowerShell a pipeline does not change `$LASTEXITCODE` of the native command, so read it right after the command. The tool flags in Sections 3 to 11 are the same on every shell.

## 13. When No Recipe Fits

1. Read the tool's help once for `--quiet`, `--short`, `--porcelain`, `--format`, `--json`, `--reporter`, `--no-progress`, `--silent`.
2. Prefer a machine format with a field selector to a human format with a text filter.
3. If only a filter is possible, merge the error stream and keep the tail.
4. Record the form that worked in the project's notes so the next session starts with it.
