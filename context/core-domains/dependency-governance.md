# DEPENDENCIES — Dependency Governance & Module Boundaries

> **Purpose:** Canonical policies for third-party package evaluation, version locking, license compliance, vulnerability thresholds, and boundary encapsulation. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Package Evaluation & Approval Criteria

Before introducing any new third-party dependency into `package.json` or `pyproject.toml`, the package must satisfy the following criteria:

| Evaluation Criterion     | Minimum Acceptable Threshold           | Rationale                                             |
| :----------------------- | :------------------------------------- | :---------------------------------------------------- |
| **Maintenance Activity** | Active commit within the last 6 months | Prevents adopting abandoned or unpatched software.    |
| **Weekly Downloads**     | Minimum 50,000 weekly downloads        | Verifies broad community testing and issue discovery. |
| **Bundle Impact**        | `< 25KB` minified + gzipped            | Protects browser client latency and bundle budgets.   |
| **Approved License**     | MIT, Apache-2.0, BSD-2/3-Clause, ISC   | Eliminates viral copyleft legal hazards (GPL/AGPL).   |

---

## 2. Version Locking & Manifest Discipline

- **Exact Version Pinning:** Never use floating ranges (`^` or `~`) in production lockfiles. Every dependency version must be exact.
- **Single Package Manager:** Enforce a single deterministic package manager across the repository (e.g. `npm` with `package-lock.json`, or `pnpm` with `pnpm-lock.yaml`).
- **Automated Security Auditing:** CI pipelines must execute automated dependency audits (`npm audit --audit-level=high`) and fail immediately if high or critical CVEs are detected.

---

## 3. Dependency Encapsulation & Wrapper Pattern

Directly importing third-party libraries across feature business logic is strictly prohibited. Wrap third-party SDKs in internal adapter modules:

```typescript
// Good: Internal wrapper encapsulating third-party email provider
export interface MailerPort {
  sendMail(to: string, subject: string, html: string): Promise<void>;
}

// In infrastructure/resend-mailer.ts
export class ResendMailerAdapter implements MailerPort {
  constructor(private readonly client: ResendClient) {}

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.client.emails.send({ to, subject, html });
  }
}
```
