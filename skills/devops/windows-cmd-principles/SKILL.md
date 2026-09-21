---
name: windows-cmd-principles
description: Baseline standard for legacy and modern Windows Command Prompt (CMD / Batch) scripting, delayed expansion safety, and anti-malware command injection defense.
origin: sauron
---

# Windows Command Prompt (CMD) Principles

Enforce structured, reliable, and secure batch scripting (`.cmd`, `.bat`) across Windows build environments, legacy runners, and wrapper utilities. Eliminate command injection vectors, enforce explicit error code checks, and preserve environment scope isolation.

## When to Activate

- Authoring, modifying, or reviewing Windows batch files (`.cmd`, `.bat`).
- Creating native wrapper scripts for CLI binaries (such as `sauron.cmd`).
- Troubleshooting path resolution, delayed expansion anomalies, or exit code propagation in CMD environments.

## Core Concepts

### 1. Scope Isolation and Initialization Preamble

- Always initialize batch scripts with `@echo off` to suppress unneeded command echoing in production logs.
- Immediately isolate environment mutations using `setlocal EnableExtensions EnableDelayedExpansion`.
- Guarantee cleanup of local environment variables before script termination by invoking `endlocal`.
- Resolve script directories reliably using `"%~dp0"`. Never assume the working directory matches the script location.

### 2. Exit Code and Error Level Discipline

- Explicitly check the return code after every external command invocation using `if errorlevel 1 goto :error` or `if %ERRORLEVEL% neq 0 goto :error`.
- Avoid ignoring failures in sequential pipelines. Halt batch processing immediately when a command fails unless explicit fallback logic is defined.
- Always exit scripts with an explicit numeric code (`exit /b 0` on success, `exit /b 1` on failure) to ensure parent CI processes and shells receive the correct process status.

### 3. Path Quoting and Variable Expansion

- Always wrap path variables and arguments in double quotes (`"%~1"`, `"%SCRIPT_DIR%dist"`).
- Use `"%~1"` to strip enclosing quotes before re-quoting, preventing double-quote syntax corruption (`""path""`).
- When mutating and reading variables inside code blocks (such as `for` loops or `if` statements), use delayed expansion syntax (`!VAR!`) rather than immediate expansion (`%VAR%`) to avoid stale value evaluations.

## Security and Anti-Malware Directives

1. **Prevent Command Chaining Injection:** User-supplied arguments in CMD can easily execute unintended commands if they contain special characters (`&`, `|`, `&&`, `||`, `>`, `<`). Never pass raw unquoted arguments (`%1`, `%*`) directly to the command line. Strip dangerous characters or validate inputs against a strict alphanumeric allowlist before processing.
2. **Prohibit Insecure Script Downloads:** Never use `bitsadmin` or `certutil` to download unverified remote batch files or executables from the public internet for immediate execution.
3. **Safe Temporary File Creation:** If temporary files are necessary, name them using `%TEMP%\sauron_%RANDOM%.tmp` and ensure the script deletes them in both normal and error exit paths.
4. **Prevent Recursive Batch Execution:** Never call another batch file directly by name without the `call` keyword (`call other.cmd`). Invoking a batch script without `call` permanently transfers execution control away, causing subsequent cleanup steps in the parent script to be bypassed silently.

## Code Examples

### Hardened Production Windows Batch Wrapper Example

```batch
@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: Resolve directory of this script safely
set "SCRIPT_DIR=%~dp0"
set "NODE_EXE=node"

:: Verify Node.js prerequisite
where !NODE_EXE! >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is required but was not found in PATH.
    echo Please install Node.js before running this utility.
    goto :error
)

:: Validate input argument
set "INPUT_ARG=%~1"

if "%INPUT_ARG%"=="" (
    echo Usage: %~nx0 ^<command^>
    goto :error
)

:: Sanitize argument: check for forbidden command injection characters
echo !INPUT_ARG!| findstr /r "[&|><;]" >nul
if not errorlevel 1 (
    echo [ERROR] Illegal characters detected in argument.
    goto :error
)

:: Execute target JavaScript orchestrator using call
set "TARGET_MJS=!SCRIPT_DIR!sauron.mjs"

if not exist "!TARGET_MJS!" (
    echo [ERROR] Orchestrator script not found at "!TARGET_MJS!".
    goto :error
)

call "!NODE_EXE!" "!TARGET_MJS!" %*
if errorlevel 1 (
    echo [ERROR] Command execution failed with code !ERRORLEVEL!.
    goto :error
)

:: Successful termination
endlocal
exit /b 0

:error
endlocal
exit /b 1
```

## Anti-Patterns

- **AP-14 (Leaking secrets):** Storing credentials in batch variables where they can be displayed by `set` dumps.
- **AP-28 (No stop condition):** Infinite `goto` loops without timeout counters or termination branches.
- **AP-52 (Fake fix):** Appending `2>nul` blindly to silence critical disk or permission failures.

## Best Practices

- Use the `.cmd` extension rather than legacy `.bat` for modern Windows NT scripts.
- Validate paths using `exist` before reading or executing target files.
- Always use `exit /b` rather than bare `exit` to avoid prematurely closing the user command prompt window.

## Related Skills

- [powershell-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/powershell-principles/SKILL.md)
- [git-bash-principles](file:///C:/Users/IGING/Documents/GitHub/sauron/skills/devops/git-bash-principles/SKILL.md)
- [security-audit](file:///C:/Users/IGING/Documents/GitHub/sauron/core/skills/security/security-audit.md)
