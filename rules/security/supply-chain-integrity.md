# Supply Chain Integrity and Dependency Auditing

Defines policies governing third-party libraries, lockfile immutability, and automated vulnerability scanning.

---

## 1. Lockfile Immutability

- **Strict Installation:** In CI/CD pipelines and production builds, install dependencies strictly using immutable lockfile commands (for example `npm ci` rather than `npm install`).
- **Committed Lockfiles:** Never ignore or discard `package-lock.json`, `pnpm-lock.yaml`, or `Cargo.lock`. All lockfiles must be tracked in version control.

---

## 2. Dependency Auditing and CVE Mitigation

- **Automated Scanning:** Run automated vulnerability scans (for example `npm audit`, `cargo audit`, or Snyk) on every pull request.
- **Zero High/Critical CVEs:** Prohibit merging code with unresolved high or critical vulnerabilities in direct dependencies.
- **Pin Direct Dependencies:** Avoid loose range specifiers (`*` or `>=`) on sensitive production dependencies. Pin exact semantic versions where possible.
