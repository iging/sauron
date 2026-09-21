---
id: secrets-scan
name: Secret Detection and High-Entropy Credential Scanning
department: security
owner_agent: boromir
trigger_command: /secrets-scan
version: 1.0.0
---

# Secret Detection and High-Entropy Credential Scanning

Detect, intercept, and purge hardcoded credentials, API keys, private keys, database connection strings, and high-entropy secrets before they enter git version control or production artifacts.

## When to Activate

- Pre-commit git hooks and pull request scanning.
- Reviewing environment variable configuration files (`.env.example`).
- Scanning application logs, build artifacts, and test fixture files.
- Incident remediation following accidental credential exposure.

## Core Intent and Authority

- **Owner Agent:** `boromir` (Security Auditor and Shield).
- **Authority Boundary:** Enforces secret scanning rules across repository trees and pre-commit hooks. Immediately halts execution if raw secrets are detected in tracked files.
- **Execution Rule:** Zero committed secrets. If a secret enters git history, treat that secret as permanently compromised and rotate immediately.

## Credential Detection Signatures

Scan all non-ignored files against the following regex pattern categories and Shannon entropy thresholds:

| Secret Type                | Example Key / Pattern Description | Regex Signature                                                              |
| :------------------------- | :-------------------------------- | :--------------------------------------------------------------------------- | ------------------------- | ----------------------------------- |
| **AWS Access Key**         | Standard 20-character key ID      | `AKIA[0-9A-Z]{16}`                                                           |
| **GitHub Token**           | Personal access and OAuth tokens  | `gh[pousr]_[A-Za-z0-9_]{36,255}`                                             |
| **Generic Private Key**    | OpenSSH, RSA, EC private keys     | `-----BEGIN[ A-Z0-9_-]+PRIVATE KEY-----`                                     |
| **OpenAI / Anthropic Key** | Provider API keys                 | `sk-[a-zA-Z0-9]{20,}` or `sk-ant-[a-zA-Z0-9_-]{20,}`                         |
| **Stripe API Key**         | Secret and restricted keys        | `(?:sk_live                                                                  | rk*live)*[0-9a-zA-Z]{24}` |
| **Slack Webhook**          | Inbound webhook endpoints         | `https://hooks.slack.com/services/T[0-9A-Z]{8}/B[0-9A-Z]{8}/[0-9A-Za-z]{24}` |
| **Database URI**           | Connection strings with passwords | `(?:postgres                                                                 | mysql                     | mongodb)://[^:]+:[^@]+@[^/]+/[^?]+` |

## High-Entropy Detection Standard

Beyond static regex matching, scan string literals for Shannon entropy exceeding 4.5 bits per character for base64 strings and 3.0 bits per character for hex strings.

Shannon entropy formula:

```text
H = - sum( p(x) * log2( p(x) ) )
```

Strings exceeding 20 characters with high entropy and variable assignments matching `secret`, `key`, `password`, `credential`, or `token` are flagged as high-risk anomalies.

## Secret Incident Remediation Workflow

When a secret is detected in git history or working tree:

```text
[Step 1: Halt Pipeline]     -> Terminate commit or build immediately
           │
           ▼
[Step 2: Revoke & Rotate]   -> Revoke compromised key in the provider dashboard
           │
           ▼
[Step 3: Scrub Git History] -> Purge commit using git-filter-repo or BFG Repo-Cleaner
           │
           ▼
[Step 4: Environment Shift] -> Relocate key to secret manager or local .env file
           │
           ▼
[Step 5: Verify Purge]      -> Re-scan repository and confirm zero residual entropy
```

## Concrete Implementation: Pre-Commit Secret Scanner Hook

```bash
#!/usr/bin/env bash
# .sauron/hooks/pre-commit-secrets.sh
set -euo pipefail

# Scan staged files only
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# Search for common secret patterns in staged content
SUSPICIOUS_SECRETS=$(git diff --cached | grep -E -i \
  "(AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{36}|sk-(?:ant-)?[a-zA-Z0-9]{20,}|-----BEGIN[ A-Z0-9_-]+PRIVATE KEY-----)" || true)

if [ -n "$SUSPICIOUS_SECRETS" ]; then
  echo "ERROR: Hardcoded secret detected in git staged diff."
  echo "Commit blocked by Sauron Secrets Scanner."
  echo "Inspect staged changes and relocate secrets to environment variables."
  exit 1
fi

exit 0
```

## Hard Verification Gates

- Block any commit containing unencrypted files named `.env`, `id_rsa`, `id_ed25519`, `credentials.json`, or `secrets.yaml`.
- Ensure `.gitignore` explicitly includes `.env`, `.env.local`, `.env.*.local`, and `*.pem`.
- Enforce that `.env.example` contains only variable names with empty or dummy values.

## Anti-Patterns Prevented

- **AP-14 (Leaking secrets):** Blocks secrets from entering commits, diffs, and pull requests.
- **AP-29 (Uncommitted env file):** Ensures `.env` files are tracked in `.gitignore` rather than committed inadvertently.
- **AP-35 (Permissive credentials):** Prevents embedding admin credentials into client-facing bundles.

## Related Skills

- [security-audit.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/security/security-audit.md)
- [boromir.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/boromir.md)
- [conventional-commit.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/devsecops/conventional-commit.md)
