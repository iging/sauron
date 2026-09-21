#!/usr/bin/env bash
# ===================================================================
# Sauron Pre-Execution Agent Guard Hook for Claude Code
# Blocks destructive actions and credential leakage
# ===================================================================
set -euo pipefail

COMMAND="${1:-}"

if [ -z "${COMMAND}" ]; then
  exit 0
fi

# Hard block credentials access
if echo "${COMMAND}" | grep -E -i '(\.env|id_rsa|id_ed25519|credentials\.json|\.pem|\.key)' >/dev/null; then
  printf "[AGENT GUARD] BLOCKED: Command attempts to access credentials or environment secret files.\n" >&2
  exit 1
fi

# Hard block destructive git commands
if echo "${COMMAND}" | grep -E -i '(git\s+push\s+.*(--force|-f)|git\s+reset\s+--hard)' >/dev/null; then
  printf "[AGENT GUARD] BLOCKED: Destructive git command detected.\n" >&2
  exit 1
fi

# Hard block recursive filesystem wipes
if echo "${COMMAND}" | grep -E -i '(rm\s+-[a-zA-Z]*r[a-zA-Z]*f\s+[/~.]|rmdir\s+/s\s+/q)' >/dev/null; then
  printf "[AGENT GUARD] BLOCKED: Dangerous recursive filesystem deletion detected.\n" >&2
  exit 1
fi

exit 0
