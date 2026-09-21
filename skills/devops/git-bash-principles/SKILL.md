---
name: git-bash-principles
description: Baseline standard for Git Bash (MSYS2 / MinGW) environment compatibility, Windows-to-POSIX path conversion, line ending discipline, and cross-platform scripting security.
origin: sauron
---

# Git Bash Engineering Principles

Enforce cross-platform compatibility, line-ending hygiene, and safe path translation for scripts executing within Git Bash (MSYS2 / MinGW) on Windows. Prevent execution anomalies caused by automatic path conversion and carriage return corruption.

## When to Activate

- Writing or executing Bash scripts in Git Bash on Windows hosts.
- Debugging path translation issues between Windows format (`C:\path`) and POSIX format (`/c/path`).
- Resolving line-ending parse errors (`\r`: command not found) in cross-platform CI pipelines and repositories.
- Bridging Windows executables (`node.exe`, `git.exe`, `powershell.exe`) with POSIX shell scripts.

## Core Concepts

### 1. Windows vs POSIX Path Translation Discipline

- Git Bash runs an MSYS2 translation layer that automatically converts POSIX-style paths (`/c/Users`) to Windows-style paths (`C:\Users`) when passing arguments to native Windows programs.
- When invoking Windows native executables with slash-style command flags (such as `/s`, `/v`, or `/debug`), MSYS2 may mistakenly convert these flags into filesystem paths (such as `C:\s`). Disable path conversion for such calls using the environment variable:
  ```bash
  MSYS_NO_PATHCONV=1 native-command.exe /flag
  ```
- Use `cygpath` to convert between Windows and POSIX path representations programmatically when calling cross-boundary tools:
  ```bash
  windows_path="$(cygpath -w "${posix_path}")"
  posix_path="$(cygpath -u "${windows_path}")"
  ```

### 2. Line Ending (CRLF vs LF) Hygiene

- Git Bash executes shell scripts strictly expecting UNIX line endings (`LF`). If a script contains Windows carriage returns (`CRLF`), the Bash interpreter encounters syntax failures such as `\r: command not found`.
- Configure Git repositories with a strict `.gitattributes` file enforcing `eol=lf` on all `.sh`, `.bash`, `.py`, and `.md` files.
- Run `dos2unix` on shell scripts if carriage return corruption occurs during Windows checkouts.

### 3. Subshell and Terminal Differences

- Git Bash on Windows typically runs inside `mintty`. Some interactive commands (such as `node` in interactive REPL mode, `python`, or `winpty`) may require a pseudo-terminal wrapper (`winpty node.exe`).
- In non-interactive automated scripts, invoke Node and Python directly without `winpty` to preserve standard input and output pipe buffering.

## Security and Anti-Malware Directives

1. **Path Quoting Across Environments:** Paths on Windows machines frequently contain spaces (such as `/c/Program Files` or `/c/Users/First Last`). Double-quote every variable expansion (`"${target_dir}"`) to prevent split-word execution vulnerabilities.
2. **Prevent Dangerous Environment Inheritance:** Git Bash inherits all Windows system and user environment variables. Do not dump or export the full environment blindly (`env > out.txt`) to avoid exposing sensitive Windows registry tokens, machine passwords, or user profile directories.
3. **Prohibit Unauthenticated Remote Execution:** Never execute remote shell scripts piped into Git Bash without prior signature and hash verification (`curl -s <url> | bash` is strictly prohibited).
4. **Execution Permissions Management:** Windows filesystems (NTFS) do not natively store POSIX executable bit flags (`chmod +x`). Git stores executable permissions via file mode `100755` in the git index. Use `git update-index --chmod=+x <script.sh>` to mark scripts executable in the git index without relying on local filesystem metadata.

## Code Examples

### Cross-Platform Git Bash Wrapper Script Example

```bash
#!/usr/bin/env bash
# ===================================================================
# Cross-platform orchestrator runner compatible with Git Bash & POSIX
# ===================================================================

set -euo pipefail
IFS=$'\n\t'

# Determine if running under Git Bash / MSYS2
IS_MSYS=false
if [[ "$(uname -s)" =~ ^(MINGW|MSYS|CYGWIN) ]]; then
  IS_MSYS=true
fi

# Resolve directory safely
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Resolve path for Node execution
NODE_CMD="node"
if ! command -v "${NODE_CMD}" >/dev/null 2>&1; then
  printf "[ERROR] Node.js executable not found in PATH.\n" >&2
  exit 1
fi

TARGET_SCRIPT="${WORKSPACE_ROOT}/bin/sauron.mjs"

# On MSYS/Git Bash, translate path safely if needed
if [ "${IS_MSYS}" = true ]; then
  # Translate to Windows native path format for Node if required
  NATIVE_TARGET="$(cygpath -w "${TARGET_SCRIPT}")"
else
  NATIVE_TARGET="${TARGET_SCRIPT}"
fi

printf "[INFO] Invoking Sauron orchestrator via Git Bash wrapper...\n"

# Execute with preserved argument array
"${NODE_CMD}" "${NATIVE_TARGET}" "$@"
```

## Anti-Patterns

- **AP-14 (Leaking secrets):** Committing Windows system profile variables or credentials into tracked repositories.
- **AP-27 (Missing setup instructions):** Authoring shell scripts that fail on Windows checkouts due to unhandled `CRLF` line endings.
- **AP-58 (Unpinned dependency in CI):** Relying on unpinned global tools installed in the Windows host PATH.

## Best Practices

- Standardize all repository shell scripts to UNIX line endings (`LF`) using `.gitattributes`.
- Test all shell scripts under both Linux/macOS Bash and Windows Git Bash before merging.
- Use `cygpath` defensively rather than attempting string replacement on drive letters.

## Related Skills

- [shell-scripting-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/shell-scripting-principles/SKILL.md)
- [windows-cmd-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/windows-cmd-principles/SKILL.md)
- [powershell-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/powershell-principles/SKILL.md)
