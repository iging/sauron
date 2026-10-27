# Session 2026-10-25: Publish 3.1.0

See [[status]], [[open-items]], and [[lessons]].

- Miguel authorizes publishing 3.1.0 after npm rejects a dirty working tree.
- Four tracked Second Brain edits cause the error. VS Code settings alone are stashed.
- Preserve tracked edits and the uncommitted vault in two named stashes.
- Build, typecheck, 116 tests, and the doc gate pass.
- Commit `1a185e9` bumps package and lockfile to 3.1.0. Tag `v3.1.0` is pushed.
- Install the packed tarball in an isolated folder. Status reports 20 runtimes.
- omp and Claude init pass. Graph generates all three output files.
- Local vault and Obsidian layout stay out of the tarball.
- Miguel completes npm browser authentication. npm accepts 3.1.0.
- Registry initially returns 404 during processing, then confirms 3.1.0 as `latest`.
- Registry SHA-1 matches the tested tarball: `177dde1a2521c672904296219bda620f3939e257`.
- Restore tracked edits and the vault. Retain all three stashes, including VS Code.
- Remove the isolated smoke-test folder. Keep the tested tarball locally.
- Real-terminal Git Bash and PowerShell arrow-key checks remain unverified.

- Fresh registry installation runs `status`: version 3.1.0, 20 runtimes, omp included.
- `npm exec` from the source repo cannot resolve either bin alias in this environment.
  Direct execution of the registry-installed CLI passes.
