# Lessons Learned

What went wrong and what we do now. Add new lessons at the top. See [[claude]].

## Release scope

- Run the packed CLI on the exact release tarball before publication. Verify registry
  integrity against that tarball after publish.

- When dropping a distribution channel, remove its commands, packaged files and release checks
  together. Keep the verification that still applies to the remaining artifacts.

## 2026-11-09

- Verify the opened PR's base and head commit against the progress report before reporting CI.

- Check the staged names against the explicit allowlist before committing packaging work.

- Record terminal input paths separately. Decline and cancellation preserve fixtures, while a
  saved-subset installation and rerun require their own evidence.
- A real plugin installation or agent listing does not verify a live model session.

- Rebuilds produce new executable identities. Earlier smoke success does not close a new
  Windows Application Control block. Record the exact blocked artifact and never bypass policy.
- Catalog generation must share installable-owner depth and reject invalid metadata before output.
- Derive public count labels from generated data, and run catalog fixtures before the site build.
- Replace stale active roadmap directions while retaining historical source and session context.

- Sync checks must compare the destination with current repo files, not only a prepared snapshot.
- Normalize CRLF before reporting content drift. Then compare actual version and behavior text.
- A green test suite does not close catalog regeneration, cross-repo synchronization or manual gates.
- Check recorded decisions before calling a planned file missing: Phase 5b uses typed constants.


- Portable release allowlists need credential-filename exclusions inside allowed folders too.
- Test executable upgrade dry-run, backup bytes, migration report and subsequent sync together.


- Windows checkouts may turn fixture Markdown into CRLF. Normalize test reads before anchors.
- A copied signed Node binary cannot retain its signature after SEA injection. Mark it unsigned.
- Smoke-test the extracted zip from another cwd with Node absent from PATH and verify asset hashes.
- Contributor readability needs stage spacing and useful contract comments, not only line wrapping.
- Compare parsed syntax and retain original comments during broad formatting passes.

## 2026-11-08

- Re-read PR state before the final report. A human can merge while reporting finishes.


- Validate local reference targets against the Git index, not existence alone. Untracked files can
  make local tests pass while clean CI checkouts fail. Recheck concurrent source additions.


- Additive parsers must validate complete headers before classifying declared format evidence.
- A reuse cache is untrusted input: refuse links/special files and verify freshly inspected evidence.
- Markdown contract tests must accept formatter padding and validate actual heading targets.
- Local app links can treat fragments as filename characters. Use plain file links plus section labels.
- Count installable skills with listSkills. Recursive supporting SKILL.md files inflate landing counts.
- Record unavailable real-world fixtures as unverified even when synthetic coverage passes.

## 2026-11-07

- Read-only scanners still need byte, entry, depth, alias, and file-count limits.
- Never echo parser exceptions or source values. Keep incomplete coverage distinct from findings.
- Refuse an explicit linked scan root as well as linked descendants.

- Native Windows execution verifies junction rejection when the sandbox cannot create the fixture.
- Persistent project knowledge must stay outside runtime uninstall tracking.

- Windows sandbox may deny junction creation before a safety test reaches the feature.
  Record the environment failure separately from verified path-rejection behavior.

- Recheck a previously blocked PR before resuming. A merge can happen outside this session.

- Green checks and MERGEABLE do not satisfy required reviews. Stop on REVIEW_REQUIRED/BLOCKED.
- Docker transfer bytes can be incremental. Measure the full filtered context independently.

- Codex standalone agents inherit parent permissions. Do not emit sandbox overrides as enforcement.
- Copilot tool aliases restrict tools, not paths or shell commands. Keep limits explicit.
- Node 20 test runs need explicit file paths because its test runner does not expand the glob.

- OpenCode moved to V2 `permissions` lists. `opencode debug agents` shows the parsed rules, and
  its own defaults come first, so Sauron rules placed after them win.
- Claude Code subagent `tools` takes bare names only. Per-command Bash rules live in settings.

- `claude plugin validate` is available locally. Run it on generated plugins. It flags
  commands with no frontmatter, a missing README, and a missing icon.
- Prettier warns on CRLF working copies from `core.autocrlf`. Check committed content before
  calling it a lint error.

- Inserting a function between a JSDoc block and its function moves the types. Run the strict
  JavaScript check after every edit near a doc comment.
- Uninstall must keep `sauron.config.yaml` and `.sauron/`, because `upgrade` records them as
  managed files.

- When local notes block checkout, stash only those paths and verify restoration before dropping it.

- Adapter-only typechecks miss CLI JavaScript. Check the entry point with allowJs and checkJs.
- Generic Clack helpers must use its exact CANCEL_SYMBOL type, not the broader symbol type.

- Empty picker selections are choices. Preserve them on revisits instead of rechecking all skills.
- Keep Back navigation outside installable values. Scope key listeners to one prompt and remove them.
- Scripted arrow streams verify wiring. Real Git Bash and PowerShell checks remain separate.

- Config format versions differ from package versions. Validate config before output writes.
- YAML setIn needs collection nodes. Use createNode when adding an empty mapping.
- Save a reviewed config with a checked checksum and backup. Test edits made during confirmation.
- Empty runtime selection means shared core only. Never turn it into an all-runtime fallback.

- Count installable entries with listSkills. Counting folders misses nested suites and adds containers.
- Retire a renamed wrapper only after its replacement installs. An edited alias blocks retirement.
- A README can become a rule, prompt, or output style. Keep setup notes outside loader folders.

- Pin prompt upgrades exactly when requested and keep the root lockfile spec in sync.
- Clack 1.8.1 needs Node 20.12.0. Check the exact floor, not only a supported major.
- Scripted prompt input checks API compatibility. Real-terminal checks remain separate.
- Use `npm pack --ignore-scripts` for isolated inspection when prepare would write Git config.

## 2026-11-02

- npm warns "script name was invalid and removed" for a `./` bin path. npm keeps the entry and
  only trims the prefix. Read the source before treating a warning as a real failure.
- A guard regex can match `-F` after `git push` in one command. Keep pushes in their own command.

- `npm publish` packs what is on disk, including untracked files. Leaving a note uncommitted does
  not keep it out of the package. Exclude it in `files`, then confirm with `npm pack --dry-run`.
- An audit checklist must handle a product with no forms, signup, or image hero. Run it on a real
  site before trusting the wording.

## 2026-11-01

- Saved defaults can be armed but unused. Check what `sync` does before widening an install.
- Compare new output with the published package, not only with tests. See [[release-and-publish]].
- OpenCode loads project agents only inside a git repository. An empty list may mean no repo.
- Use a negative control. `opencode run` answered a made-up slash command the same way.
- Folder scanners may load `README.md` as content. Check scaffolds in the real tool.
- Git Bash rewrites `/path` arguments. Set `MSYS_NO_PATHCONV=1` for API-style paths.
- Many repo files are CRLF. Normalize before matching multi-line text in a script.
- OpenCode returns empty on the first call for a new directory, and caches the directory.
  Use a fresh folder per test and read the second result.
- An empty result is not proof of a fix. Keep a control that shows the bug can still appear.
- `MSYS_NO_PATHCONV=1` also stops `/c/...` conversion. Use `C:/...` paths with it.
- The safety check blocks `rm -rf` on a variable path. Use fresh folders in the scratchpad.
- Check a public name for trademarks before proposing it. `palantir` failed that check.
- Test install commands against the registry. `npx sauron` runs an unrelated npm package.
- Bash guard blocks `Object.keys` as `.key`. Put such checks in a script file.
- Hard-coded counts drift. Landing counts now come from `src/constants/stats.ts`.
- HTTP 200 does not prove a site is yours. Check the title and content.
- Read every claim in docs against the code. A results table can exist with no data behind it.
- Check a shipped package for license text. `npm pack --dry-run` shows what users receive.
- Run `npm audit --omit=dev` when touching dependencies. It found a critical Next.js advisory.
- A focus test needs a real Tab key. Scripted focus does not open keyboard tooltips.

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
