# Security Skills

The Security domain houses skills that govern vulnerability scanning, OWASP Top 10 compliance, supply-chain auditing, pre-execution command shields, and incident management.

---

## Standalone Security Skills

| Skill                       | Owner   | Command                    | Purpose                                                                                    |
| --------------------------- | ------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| **security-auditor**        | Boromir | `/security-auditor`        | Scans code line by line against OWASP Top 10 and produces structured CWE findings.         |
| **agent-guard**             | Boromir | `/agent-guard`             | Enforces runtime pre-execution validation to block destructive terminal commands.          |
| **incident-response**       | Boromir | `/incident-response`       | Triage protocols, token revocation checklists, and post-mortem incident reporting.         |
| **security-best-practices** | Boromir | `/security-best-practices` | Establishes defense-in-depth conventions, authentication standards, and secret management. |

---

## The Security Gate Protocol

Boromir executes security audits through a 4-step gate:

1. **Input Analysis**: Inspects package manifests, environment variable templates, and entrypoint routes.
2. **Line-by-Line Scan**: Checks for:
   - Injection risks (SQL injection, shell execution injection).
   - Broken authentication or authorization checks.
   - Sensitive data exposure (unmasked passwords, secret keys in source files).
   - Insecure direct object references (IDOR).
3. **CWE Mapping**: Formats every verified finding with a Common Weakness Enumeration ID, OWASP Top 10 category, risk rating (Critical, High, Medium, Low), and exact file line numbers.
4. **Approval Gate**: Boromir never commits patches automatically. You must review and approve all proposed remediation code.
