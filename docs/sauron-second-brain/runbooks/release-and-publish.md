# Release and Publish

How to ship a new `sauron-ai` version to npm. See [[status]] and [[security-rules]].
Root release guides are retired. See [[verification-checklist]] for test steps.

## Pick the bump

- PATCH: fixes only (`npm run release:patch`).
- MINOR: new features, nothing breaks (`npm run release:minor`).
- MAJOR: a flag, file, or behavior users rely on changes (`npm run release:major`).

Each script runs tests, the doc gate, and the build, then `npm version`, `npm publish`, and
`git push origin main --tags`. It must run on `main` with every change merged.

## 1. Checks on `main`

`npm ci`, `npm run build`, `npx tsc --noEmit`, `npm test`,
`npm run check-docs -- --pre-push`, `node bin/sauron.mjs status`.

## 2. Test the packed tarball

1. `npm pack` in the repo root.
2. In an empty folder: `npm init -y`, then `npm install <repo>/sauron-ai-<version>.tgz`.
3. Run `npx sauron --help`, `npx sauron status`,
   `npx sauron init --yes --runtimes=omp,claude --skills=none`, and `npx sauron graph .`.
4. Delete the folder and the `.tgz`.

Do not use `npx <path-to-tgz> init` on Windows. It exits 0 and runs nothing.

## 3. Real terminal test

Run `node <repo>/bin/sauron.mjs init` in Git Bash and PowerShell. Arrows move, Space toggles,
Enter confirms, Ctrl+C writes nothing, and the terminal returns after "Yes".

## 4. Publish

1. Check all tracked edits with `git status --short`. Preserve them in named stashes.
   VS Code settings alone do not cover other tracked edits. Use `git stash list`
   to find the right stash after newer stashes change the numbering.
2. `npm whoami`. If it errors, `npm login`.
3. `npm run release:<bump>`.
4. If publish fails with `EOTP`, do not re-run the script. The commit and tag exist. Run
   `npm publish --otp=<code>`, then `git push origin main --tags`.

## 5. Verify and announce

- `npm view sauron-ai version` and `npm view sauron-ai dist-tags`.
- In an empty folder: `npx sauron-ai@<version> status`.
- `gh release create v<version> --title "..." --notes-file <notes.md>`.

## Rollback

- Wrong version within 72 hours: `npm unpublish sauron-ai@<version>`. Later: ship a patch.
- Inspect local version, tag, and registry before rollback. Preserve local work.
  Never use hard reset as routine release recovery.

## Resume a failed publish

Check version, commit, tag, and registry first. Do not repeat a successful version bump.
Browser authentication may follow npm whoami success. The user completes login or OTP.
Accepted packages can take time to appear. Publish the tested tarball, verify version,
latest tag and checksum, then apply the correct named stashes. Keep backups until checked.
Version 3.1.0 is already published.
