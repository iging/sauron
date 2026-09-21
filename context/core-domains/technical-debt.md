# TECH-DEBT — Technical Debt & Refactoring Backlog

> **Purpose:** Canonical registry for tracking architectural shortcuts, deprecation schedules, pending refactors, and technical debt interest to prevent codebase decay. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Technical Debt Classification Matrix

Every tracked item must be categorized by impact and risk:

| Debt Category            | Description                                                                    | Remediation SLA                                |
| :----------------------- | :----------------------------------------------------------------------------- | :--------------------------------------------- |
| **`Architectural Debt`** | Boundary violations, leaky abstractions, or circular dependencies.             | Remediation within 2 milestones.               |
| **`Test Debt`**          | Missing test coverage on critical edge cases or flaky integration suites.      | Immediate remediation before new feature work. |
| **`Dependency Debt`**    | Deprecated library versions, unmaintained packages, or pending major upgrades. | Scheduled quarterly review.                    |
| **`Documentation Debt`** | Stale API contracts, out-of-date schema docs, or missing runbooks.             | Updated during active sprint.                  |

---

## 2. Active Technical Debt Registry

| ID      | Domain     | Description & Technical Impact                                                                                  | Interest / Risk Level           | Target Release | Owner    |
| :------ | :--------- | :-------------------------------------------------------------------------------------------------------------- | :------------------------------ | :------------- | :------- |
| `TD-01` | `Database` | `[PLACEHOLDER: Replace legacy raw SQL queries in reporting service with type-safe Drizzle repository methods.]` | `High (Slow full table scans)`  | `v1.2.0`       | `[Name]` |
| `TD-02` | `Auth`     | `[PLACEHOLDER: Deprecate legacy SHA-256 session token hashing in favor of Argon2id.]`                           | `Critical (Security liability)` | `v1.1.0`       | `[Name]` |
| `TD-03` | `Frontend` | `[PLACEHOLDER: Remove deprecated legacy CSS styles in favor of unified design tokens in DESIGN.md.]`            | `Medium (CSS bundle bloat)`     | `v1.3.0`       | `[Name]` |

---

## 3. Deprecation & Retirement Policies

1. **Explicit Deprecation Notices:** When deprecating an API endpoint, service method, or data model, annotate the code with `@deprecated` comments specifying the target removal version and replacement alternative.
2. **20% Refactoring Rule:** Engineering teams should allocate approximately 20% of engineering bandwidth per iteration to resolving high-interest technical debt items from this backlog.
3. **Delete Dead Code Aggressively:** When replacing a component or service, delete the legacy implementation immediately. Never leave commented-out code blocks or orphan helper files in the repository.
