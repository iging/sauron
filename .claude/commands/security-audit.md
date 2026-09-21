---
description: Audits the workspace against OWASP Top 10 vulnerabilities, dependency CVEs, and secret leakage.
---

Execute the Sauron security audit protocol:

1. Run dependency audit commands (`npm audit`, `pip-audit`, or `cargo audit`).
2. Scan source files for SQL injection, raw shell execution, and untyped ingestion sinks.
3. Scan for hardcoded credentials, access keys, and high-entropy secrets.
4. Verify authentication and authorization checks on all API route handlers.
5. Halt execution if any high or critical vulnerability is detected.
