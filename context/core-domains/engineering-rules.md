# RULES — Engineering Invariants & Hard Constraints

> **Purpose:** Specify universal non-negotiable coding standards, defensive security policies, architectural boundaries, and operational constraints so all code generation remains clean, robust, and free of architectural regressions. Tier-3 template — fill it in for your project.

_Last updated: [DATE]_

---

## 1. Non-Negotiable Engineering Rules (The Red Lines)

Any pull request or generated code change that violates these rules must be blocked immediately:

1. **Zero Unbacked Destructive Overwrites:** Never overwrite or mutate existing project files without backup snapshots or verifiable user approval.
2. **Zero `any` in Production Code:** The `any` type is banned. Use strictly typed generics, discriminated unions, or `unknown` with runtime type narrowing.
3. **Zero Leaky Architectural Abstractions:** Domain core business entities must not import ORM packages, database drivers, or HTTP request/response frameworks.
4. **Zero Unauthenticated State Mutations:** Any endpoint altering database records must enforce explicit authorization and CSRF validation.
5. **Zero Secrets in Code or Logs:** Never commit API keys, private tokens, passwords, or log unredacted credentials to stdout.

---

## 2. Code Craftsmanship & Modularity

- **Cognitive Complexity:** Keep function cognitive complexity strictly `<= 15`. Break complex loops and deeply nested conditionals into private helper functions.
- **Single Level of Abstraction (SLA):** Each function must execute logic at a uniform level of abstraction. High-level orchestrators should not mix with low-level byte/string manipulation.
- **Options Parameter Bundling:** Functions accepting 3 or more arguments must bundle parameters into a typed, readonly options object.
- **Fail-Closed Guards:** Place validation guards at the top of functions with early returns. Eliminate defensive `else` blocks when an early return has terminated execution.
- **Prohibition of Barrel Files:** Never author or import from `index.ts` barrel files. Import directly from specific source files to prevent circular dependencies and broken tree-shaking.

---

## 3. Defensive Programming & Error Handling

- **Parse, Don't Validate:** Validate untrusted payloads at the external boundary using schemas (e.g. Zod), transforming unknown inputs into branded, typed internal domain objects.
- **Sanitized Error Envelopes:** Never expose database error codes, SQL queries, or internal stack traces in HTTP responses to external clients. Map internal exceptions to deterministic error codes (`RESOURCE_NOT_FOUND`, `INVALID_PAYLOAD`, `UNAUTHORIZED`).
- **Never Swallow Errors:** Empty `catch` blocks are strictly prohibited. Caught errors must be rethrown, wrapped in a domain-specific error class with cause chains intact, or explicitly logged with contextual metadata.

---

## 4. Database & Concurrency Invariants

- **Parameterized Queries Exclusively:** Raw string interpolation in SQL queries (`SELECT * FROM table WHERE id = '${id}'`) is strictly forbidden. Parameterized bindings are mandatory.
- **Explicit Transaction Boundaries:** Any business workflow mutating more than one database table or record must execute inside an explicit database transaction block.
- **SARGable Query Predicates:** Never wrap indexed query columns in runtime SQL functions (e.g. `WHERE DATE(created_at) = ...`), as this invalidates index usage and forces expensive full-table scans.

---

## 5. Security & Dependency Discipline

- **Dependency Pinning:** All third-party dependencies must be pinned to exact versions in lockfiles. Floating dependency ranges (`^` or `*`) are prohibited in production lockfiles.
- **Supply Chain Integrity:** Scan dependencies for known CVEs before merging code (`npm audit`, `pip-audit`, `cargo audit`).
- **Least Privilege Access:** Cloud resources, API tokens, and database connection strings must operate with the minimal permissions necessary to perform their designated functions.
