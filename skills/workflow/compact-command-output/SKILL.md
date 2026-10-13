---
name: compact-command-output
description: Makes shell commands return short, useful output before the agent reads it, using each tool's own quiet flags, filters, grouping, and limits. Use when running git, file listing, search, tests, builds, linters, package managers, containers, or logs in an agent session, or when the user asks to save tokens on command output. Excludes compression of the agent's own replies.
department: workflow
ownerAgent: legolas
triggerCommand: /compact-command-output
antiPatternsPrevented:
  - AP-1
  - AP-16
  - AP-18
  - AP-26
  - AP-57
---

# Compact Command Output

## 0. Identity

- **Role:** Output Optimizer. Owns how much shell output enters the agent's context for each command.
- **Prime rule:** Ask the tool for less before reading more. A failure, its message, and the exit code are never trimmed away.
- **Role source:** Appendix A of `skills/_template/skill-name/SKILL.md` (Output Optimizer).
- **Seniority bar:** Staff (Appendix B). Records why shaping output at the source beats summarising it afterwards (the tokens are never spent, rejected read-then-condense), why native flags beat a wrapper binary as the default (nothing to install, works on every runtime and shell, rejected a hard dependency), and why the full output stays one command away (compact output that hides a cause costs more than it saved, rejected irreversible trimming).
- **Authority:** Tier-5 normative skill for `skills/workflow/compact-command-output/`. Owns the four strategies, the safety rules, and the recipe catalogue at `references/command-recipes.md`.
- **Must not define:** Compression of the agent's replies (see `skills/workflow/caveman/SKILL.md`), what belongs in the context window overall (see `skills/ai-engineering/context-engineering/SKILL.md`), or how much code to write (see `skills/workflow/lean-code/SKILL.md`).
- **Normative base:** `core/fellowship/legolas.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1 (vague task), AP-16 (context dump), AP-18 (unstructured output), AP-26 (no scope boundary), and AP-57 (dishonest completion).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                                                |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Task             | Choose the form of each shell command so its output is the smallest that still answers the question being asked.                     |
| 2   | Target Tool      | Any agent runtime with a shell: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline. Bash and PowerShell.                            |
| 3   | Output Format    | The commands themselves, run in compact form. On request, a short report of what was trimmed.                                        |
| 4   | Constraints      | Exit codes preserved. Errors and warnings never filtered out. Full output re-run when the compact form is ambiguous. Zero em dashes. |
| 5   | Input            | The command the agent is about to run and the question that command must answer.                                                     |
| 6   | Context          | Raw command output is often mostly noise: progress bars, passing tests, unchanged files, repeated log lines.                         |
| 7   | Audience         | The agent running commands, and the developer paying for and waiting on the session.                                                 |
| 8   | Success Criteria | Each command's output answers its question, shows its exit status, and holds no block of noise that a flag would have removed.       |
| 9   | Examples         | See Section 10.                                                                                                                      |

## 2. Trigger Matrix

| Trigger                                                                | Fire? | Notes                                                          |
| ---------------------------------------------------------------------- | ----- | -------------------------------------------------------------- |
| About to run git, ls, find, grep, a test runner, a build, or a linter  | YES   | Core trigger. Applies quietly on every such command.           |
| "Save tokens on command output" or "the logs are flooding the context" | YES   | Core trigger.                                                  |
| "/compact-command-output"                                              | YES   | Slash command trigger. Stays on for the session.               |
| A long agent run with many shell calls                                 | YES   | Turn on at the start.                                          |
| "Make your replies shorter"                                            | NO    | Route to `skills/workflow/caveman/SKILL.md`.                   |
| "Decide what to load into context"                                     | NO    | Route to `skills/ai-engineering/context-engineering/SKILL.md`. |
| The user asks to see the full raw output                               | NO    | Run the plain command. An explicit request wins.               |
| Debugging a failure whose cause is not in the compact output           | NO    | Re-run that one command in full, then return to compact form.  |

## 3. Execution Workflow

### Step 1: Name the Question

- **Action:** Before running a command, state to yourself what it must answer: "which files changed", "did the tests pass and which failed", "where is this symbol defined". The question decides how much output is needed.
- **Input:** The intended command.
- **Stop Condition:** If the question is "show me everything", run the plain command and skip the rest.
- **Validation:** One question per command.

### Step 2: Pick the Compact Form

- **Action:** Load `references/command-recipes.md` and use the recipe for the tool. When no recipe exists, apply the four strategies in order: ask for a quiet or short format with the tool's own flags; filter to the lines that answer the question; group repeats into counts; limit what remains to a fixed number of lines.
- **Input:** The question and the tool.
- **Stop Condition:** Halt and use the plain command when the only way to shorten the output would hide errors or change the exit code.
- **Validation:** The chosen form uses a native flag before a pipe, and a pipe before a wrapper.

### Step 3: Keep the Failure Signal

- **Action:** Make sure the exit status survives. In Bash, a pipeline reports the last command's status unless `set -o pipefail` is on, so `test | head` can report success for a failing test run. Prefer flags to pipes for commands that can fail, or capture the status explicitly. For builds and tests, keep the tail of the output, not the head: the cause is at the end.
- **Input:** The compact command.
- **Stop Condition:** Halt on any form that would report success for a failed command.
- **Validation:** Pass or fail, and the count of failures, are visible in the output.

### Step 4: Read, Then Widen Only If Needed

- **Action:** Read the compact output. If it answers the question, continue. If it is ambiguous or a failure lacks its cause, re-run only that command with more detail: a wider line limit, one file, one test, or the plain form.
- **Input:** Compact output.
- **Stop Condition:** Never guess at a cause that the compact output does not show.
- **Validation:** Any widened command targets the smallest scope that resolves the ambiguity.

### Step 5: Report on Request

- **Action:** When the user asks what was saved, list the commands run in compact form and what each left out, in the Section 4 format. Give line counts only when they were measured. Do not quote a percentage that was not measured.
- **Input:** The session's commands.
- **Stop Condition:** None.
- **Validation:** Every figure in the report was observed in this session.

## 4. Output Specification

Applied silently, the skill produces no extra text: only the compact commands.

On request, the report follows this shape:

```text
# Compact Output Report

| Command                          | Compact form                           | Left out                          |
| -------------------------------- | -------------------------------------- | --------------------------------- |
| git status                       | git status --short --branch            | Hints and section headings        |
| npm test                         | node --test --test-reporter=dot        | Passing test names (64 passed)    |
| npm install                      | npm install --no-audit --no-fund --loglevel=error | Progress, audit, funding notes |

Re-run in full: 1 (the failing test file, to read its stack trace)
Measured: output lines only. Token and cost effect not measured.
```

## 5. Validation Gate

- [ ] Each command had one stated question.
- [ ] A native quiet or short flag was used where the tool offers one.
- [ ] Exit status preserved; no pipe masks a failure.
- [ ] Errors and warnings appear in full.
- [ ] Builds and tests keep the tail of their output.
- [ ] Ambiguous output was widened by re-running, not by guessing.
- [ ] No saving is claimed that was not measured.
- [ ] Zero em dashes in deliverable.

## 6. Anti-Triggers and Calibration

- **Under-execution threshold:** Running `git log`, `npm install`, or a full test suite in default verbose form during a long session.
- **Over-execution threshold:** Trimming until a failure's cause is gone, piping a failing command through `head`, or hiding warnings to look clean.
- **Calibration default:** Compact first, full on demand. When in doubt about whether a line matters, keep it.

## 7. Anti-Pattern Compliance

| Step | Prevents AP                  | Mechanism                                                           |
| ---- | ---------------------------- | ------------------------------------------------------------------- |
| 1    | AP-1 (vague task)            | Requires a stated question before each command.                     |
| 2    | AP-16 (context dump)         | Shapes output at the source so noise never enters the window.       |
| 2    | AP-26 (no scope boundary)    | Limits the skill to shell output; replies and context go elsewhere. |
| 3    | AP-57 (dishonest completion) | Forbids forms that report success for a failed command.             |
| 5    | AP-18 (unstructured output)  | Fixes the report shape and bans unmeasured figures.                 |

## 8. Versioning & Changelog

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-10-12) - Initial Tier-5 release with four strategies, safety rules, and a recipe catalogue for Bash and PowerShell.

## 9. Portability Matrix

| Runtime     | Status   | Notes                                                         |
| ----------- | -------- | ------------------------------------------------------------- |
| Claude Code | untested | Applies to Bash tool calls; built-in file tools are separate. |
| Cursor      | untested | Applies to terminal commands.                                 |
| Copilot     | untested | Applies to terminal commands.                                 |
| Windsurf    | untested | Applies to terminal commands.                                 |
| Kiro        | untested | Applies to terminal commands.                                 |
| Cline       | untested | Applies to terminal commands.                                 |
| Raw API     | untested | Applies when the caller executes commands for the model.      |

## 10. Examples

**Input:** The agent needs to know whether the test suite passes after an edit.
**Output:** It runs `node --test --test-reporter=dot` instead of `npm test`, reads a row of dots and a summary, sees one failure, then re-runs only that test file in full to read the assertion.

**Failure case:** The agent runs `npm test | head -20`, sees twenty passing lines, and reports the suite green while the failures and the non-zero exit code were cut off. Refuse that form: use the runner's quiet reporter, or capture the status and keep the tail.
