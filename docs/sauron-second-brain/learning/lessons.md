# Lessons Learned

What went wrong and what we do now. Add new lessons at the top. See [[claude]].

## 2026-10-27

- A progress-report commit must exclude protected manifest state and local editor settings.
  Stage named files only, then confirm the two local changes remain unstaged.

## 2026-10-25

- Retiring a shipped feature draft does not prove every proposed acceptance gate passed.
  Archive the draft, retain unverified checks, and update current notes to avoid missing reads.

- Keep a small resume brief and task map. History is reference material,
  not mandatory startup context. Preserve unresolved older handoff items.
- Archive and verify candidates before cleanup. Plans, runtime configs,
  and worktrees are not junk merely because they look old.

- Stashing VS Code settings alone leaves other tracked edits. Check all tracked files
  before `npm version`. Keep named stashes until restored work is verified.
- npm browser authentication may follow `npm whoami` success. Miguel completes it.
- npm may accept a publish before registry queries show it. Wait before retrying.
  Version 3.1.0 initially returns 404, then appears as `latest` with the matching checksum.

- The runtime count drifted (docs 17, CLI 19, code 20). Take the count from `RUNTIME_IDS`
  and grep every doc when it changes. See [[agent-runtimes]].
- A config schema with `additionalProperties: false` missed `vscode`. Add new ids to both
  schema copies and both config templates.
- `release:*` scripts push `main`. Merge the feature branch first.
- `npm version` refuses a tree with tracked changes. Stash local edits before releasing.
- In Git Bash, `cat > file` with no input waits forever. Python reading `/dev/stdin` fails on
  Windows. Pass a real file path, or use the Write and Edit tools.
- Check what a tool already reads (omp reads `.claude/skills/` and `.agents/skills/`) before
  copying files into its own folder.

## 2026-10-20 and earlier

- `npx <path-to-tgz> init` on Windows exits 0 and runs nothing. Use
  `npm exec --yes --package=<tgz> -- sauron-ai init`, or install the tarball in a folder.
- Many files are CRLF. Inline `node -e`, `sed` with backslashes, and heredocs with
  apostrophes break in Git Bash. Use the Edit or Write tool.
- Writing a prompt with `process.stdout.write` before `rl.question` lets backspace erase the
  question. Use `rl.setPrompt()` and `rl.prompt()`.
- Leaving stdin open after clack prompts hangs the terminal. Call `process.stdin.pause()` and
  `unref()`.
- `scripts/audit-compliance.js` is named in several skills but does not exist. Skip that gate
  and say so.
- The fake-terminal harness is not a real terminal. Always test arrow keys by hand.
- `package.json` `files` left out `scripts/`, so `sauron graph` failed for npm users. Test the
  packed tarball, not only the repo.
- The graph counted `.next` build files and `.claude/worktrees/` copies as modules. Skip
  build output and worktrees when scanning.

## Working with Miguel

- Miguel pauses and resumes often. Keep state in this vault so a stop costs nothing.
- Miguel wants copy-paste commands in one file before a release, with checkboxes.
- Report unverified items plainly. Never state a figure that was not measured.

## Registry smoke test on Windows

- `npm exec --package=sauron-ai@3.1.0` cannot resolve the bin in this source checkout.
  A separate registry installation and direct Node CLI invocation pass.
