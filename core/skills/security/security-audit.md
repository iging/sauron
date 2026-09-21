---
id: security-audit
name: Security Audit and Vulnerability Assessment
department: security
owner_agent: boromir
trigger_command: /security-audit
version: 1.0.0
---

# Security Audit and Vulnerability Assessment

Conduct rigorous vulnerability assessments across source code, dependencies, network boundaries, and access control configurations. Defend against OWASP Top 10 attack vectors, insecure direct object references, and privilege escalation vulnerabilities.

## When to Activate

- Auditing code prior to production deployment or release tagging.
- Adding authentication, authorization, or session management logic.
- Integrating third-party APIs, webhooks, or external data ingestion points.
- Running routine dependency vulnerability scans and threat models.

## Core Intent and Authority

- **Owner Agent:** `boromir` (Security Auditor and Shield).
- **Authority Boundary:** Owns security policies, vulnerability reports, and audit gates. Exercises veto authority over pull requests and deployment candidates containing critical or high severity findings.
- **Execution Rule:** Zero tolerance for unmitigated high or critical CVE vulnerabilities and unauthenticated private routes.

## OWASP Top 10 Audit Checklist

Evaluate every application component against these primary vulnerability classes:

| Vulnerability Class                  | Audit Target                            | Required Control                                                                                                                                |
| :----------------------------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **A01: Broken Access Control**       | Route handlers, multi-tenant queries    | Enforce tenant ID filtering and role-based access checks at the database query layer, not only in route middleware.                             |
| **A02: Cryptographic Failures**      | Data at rest and in transit             | Use Argon2id or bcrypt (cost factor >= 12) for password hashing. Mandate TLS 1.3 for all external HTTP traffic.                                 |
| **A03: Injection**                   | SQL queries, shell commands, LDAP       | Use parameterized queries exclusively. Prohibit dynamic string concatenation in database calls and command execution.                           |
| **A04: Insecure Design**             | Rate limits, business logic             | Apply token-bucket rate limiters on login, registration, and payment endpoints. Implement account lockout after repeated failures.              |
| **A05: Security Misconfiguration**   | HTTP response headers, CORS             | Enable strict Content Security Policy (CSP), HSTS, X-Frame-Options, and X-Content-Type-Options. Restrict CORS origins explicitly.               |
| **A06: Vulnerable Components**       | Dependencies (`package.json`, `go.mod`) | Run automated audit commands (`npm audit`, `cargo audit`, `pip-audit`). Block builds containing high or critical advisories.                    |
| **A07: Identification Failures**     | Session tokens, JWTs                    | Issue HTTP-only, Secure, SameSite cookies for sessions. Enforce short JWT expiration windows (maximum 15 minutes) with rotating refresh tokens. |
| **A08: Software and Data Integrity** | CI pipelines, package integrity         | Pin dependency versions to exact hashes or release tags. Verify checksums of downloaded binaries.                                               |
| **A09: Logging Failures**            | Audit trails, error logs                | Log security-critical events (login failures, permission changes, password resets). Strip passwords, tokens, and PII from all logs.             |
| **A10: SSRF**                        | Webhook callers, image downloaders      | Restrict outbound HTTP requests to an allowlist of domains. Block requests targeting RFC 1918 private IP ranges and localhost.                  |

## Audit Execution Sequence

```text
[Step 1: Dependency Audit] -> Scan manifest files for known CVEs
             │
             ▼
[Step 2: Static Analysis]  -> Inspect AST for raw SQL, eval(), and dangerous sinks
             │
             ▼
[Step 3: Route Authorization] -> Verify every endpoint requires explicit role or session
             │
             ▼
[Step 4: Output Sanitization] -> Ensure responses strip sensitive internal fields
             │
             ▼
[Step 5: Audit Certification] -> Issue pass or fail security verdict
```

## Concrete Code Example: Safe Parameterized Database Access

```typescript
// src/repositories/user-repository.ts
import { sql } from "drizzle-orm";
import { db } from "../infrastructure/database.js";
import { users } from "../schema/users.js";

export class UserRepository {
  // SECURE: Parameterized query prevents SQL injection
  async findByEmailAndTenant(email: string, tenantId: string) {
    return await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email} AND ${users.tenantId} = ${tenantId}`)
      .limit(1);
  }

  // INSECURE: Do not write queries using string interpolation
  // async badFind(email: string) {
  //   return await db.execute(`SELECT * FROM users WHERE email = '${email}'`);
  // }
}
```

## Hard Verification Gates

- Halt the build immediately if `npm audit --audit-level=high` or equivalent fails with exit code greater than zero.
- Block merging if any API response serializes database fields matching `password`, `hash`, `salt`, `secret`, or `token`.
- Block any route handler that receives user input without passing it through a runtime validation schema (Zod or Pydantic).

## Anti-Patterns Prevented

- **AP-14 (Leaking secrets):** Catches exposed keys and unredacted logging output.
- **AP-15 (Over-privileged role):** Prohibits granting blanket admin permissions or bypass flags.
- **AP-16 (Bypassing auth middleware):** Disallows registering API routes outside authentication guards.
- **AP-35 (Permissive CORS):** Eliminates `Access-Control-Allow-Origin: *` in authenticated production APIs.
- **AP-41 (Unparameterized query):** Identifies raw string queries that introduce SQL injection vectors.

## Related Skills

- [secrets-scan.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/security/secrets-scan.md)
- [boromir.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/boromir.md)
- [schema-design.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/architecture/schema-design.md)
