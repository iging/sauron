---
name: shell-scripting-principles
description: Baseline standard for POSIX-compliant, secure, and robust Bash shell scripting, strict error handling, defensive quoting, and anti-malware execution defense.
origin: sauron
department: devops
---

# Shell Scripting Principles

Enforce disciplined, portable, and secure shell scripting across Linux, macOS, and POSIX-compatible runtime environments. Eliminate word-splitting bugs, enforce strict error escalation, and prevent malicious script injection vectors.

## When to Activate

- Authoring, modifying, or reviewing Bash or POSIX shell scripts (`.sh`).
- Scaffolding CI/CD automation, server provisioning, container entrypoints, and build hooks.
- Auditing shell scripts for injection risks, unquoted variables, or silent failure modes.

## Core Concepts

### 1. Robust Execution Preamble and Error Escalation

- Always begin non-POSIX Bash scripts with `#!/usr/bin/env bash` for maximum environment portability.
- Immediately enforce the strict execution preamble on line 2 of every script:

  ```bash
  set -euo pipefail
  IFS=$'\n\t'
  ```

  - `-e`: Exit immediately if a pipeline, list, or simple command returns a non-zero exit status.
  - `-u`: Treat unset variables and parameters as an error during parameter expansion.
  - `-o pipefail`: Return the exit status of the last command in the pipeline that failed, rather than the exit status of the very last command.
  - `IFS=$'\n\t'`: Restrict the Internal Field Separator to newlines and tabs, eliminating whitespace word-splitting hazards.

### 2. Defensive Quoting and Expansion

- Double-quote every variable and parameter expansion (`"${variable}"`, `"${1}"`). Unquoted expansions cause accidental word-splitting, unexpected globbing, and path injection vulnerabilities.
- Prefer modern `[[ ... ]]` condition syntax over legacy `[ ... ]` in Bash scripts to gain enhanced string comparison and regex matching capabilities without subshell overhead.
- Use `$(( ... ))` for integer arithmetic rather than obsolete `expr` commands.

### 3. Cleanup and Signal Handling with Traps

- Always register an `EXIT` trap to guarantee that temporary files, background jobs, and lock files are cleaned up reliably on exit, regardless of whether termination was graceful or caused by an unhandled error:
  ```bash
  trap 'cleanup' EXIT INT TERM
  ```
- Generate temporary files and directories exclusively using `mktemp` or `mktemp -d`. Never invent predictable temporary paths in `/tmp` to avoid symlink race condition attacks.

## Security and Anti-Malware Directives

1. **Absolute Ban on `curl | bash`:** Never author or execute pipelines that pipe unverified remote URLs into a shell (`curl -s <url> | bash` or `wget -O - <url> | sh`). Remote execution without signature verification allows malicious man-in-the-middle payloads to execute with the user permissions.
2. **Mandate Cryptographic Hash Verification:** If a script must download and execute a remote binary or script, download it to an isolated directory, compute its SHA256 checksum, verify it against an immutable pinned hash, and abort immediately on mismatch before setting execution flags (`chmod +x`).
3. **Absolute Ban on `eval`:** Never pass dynamic strings, user inputs, or environment variables to the `eval` command. `eval` is the primary mechanism for shell code injection vulnerabilities.
4. **Command Injection Prevention in Parameterized Calls:** Avoid building commands by concatenating strings into a variable and then executing that variable. Store arguments in typed Bash arrays (`args=("-a" "-b")`) and execute via `command "${args[@]}"`.
5. **Path Traversal Containment:** Canonicalize paths using `realpath` or `readlink -f`. Validate that the target path does not escape the approved parent directory before invoking destructive operations (`rm`, `mv`).

## Code Examples

### Hardened Production Bash Script Example

```bash
#!/usr/bin/env bash
# ===================================================================
# Secure build pipeline script following Sauron Shell Scripting Principles
# ===================================================================

set -euo pipefail
IFS=$'\n\t'

# Script directory resolution
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Temporary directory management with guaranteed cleanup
TMP_DIR="$(mktemp -d -t sauron-build-XXXXXX)"
readonly TMP_DIR

cleanup() {
  local exit_code=$?
  if [ -d "${TMP_DIR}" ]; then
    rm -rf "${TMP_DIR}"
  fi
  exit "${exit_code}"
}
trap cleanup EXIT INT TERM

log_info() {
  printf "[INFO] %s\n" "${1}"
}

log_error() {
  printf "[ERROR] %s\n" "${1}" >&2
}

build_artifacts() {
  local target_version="${1}"
  local output_tar="${TMP_DIR}/package-${target_version}.tar.gz"

  # Validate input format with regex
  if [[ ! "${target_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_error "Invalid semantic version format: ${target_version}"
    return 1
  fi

  log_info "Creating build archive for version ${target_version}..."

  # Build command using array to prevent argument injection
  local tar_args=(
    "-czf"
    "${output_tar}"
    "-C"
    "${WORKSPACE_ROOT}"
    "dist"
    "package.json"
  )

  tar "${tar_args[@]}"

  # Verify file creation
  if [ ! -f "${output_tar}" ]; then
    log_error "Archive generation failed."
    return 1
  fi

  log_info "Build completed successfully: ${output_tar}"
}

main() {
  if [ "$#" -lt 1 ]; then
    log_error "Usage: $0 <version>"
    exit 1
  fi

  local version="${1}"
  build_artifacts "${version}"
}

main "$@"
```

## Anti-Patterns

- **AP-14 (Leaking secrets):** Printing full environment lists (`env`, `printenv`) in scripts or logs.
- **AP-20 (Untracked work):** Relying on uncommitted build scripts that depend on undocumented machine state.
- **AP-57 (Untracked side effect in CI):** Mutating global machine paths outside the designated workspace directory.

## Best Practices

- Validate every script using ShellCheck (`shellcheck script.sh`) before committing.
- Ensure scripts pass ShellCheck with zero errors and zero warnings.
- Restrict file permissions on generated scripts (`chmod 755` for executables, `chmod 644` for sourced libraries).

## Related Skills

- [powershell-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/powershell-principles/SKILL.md)
- [git-bash-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/git-bash-principles/SKILL.md)
- [docker-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/docker-principles/SKILL.md)
