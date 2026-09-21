---
id: ci-generator
name: Continuous Integration Pipeline Generator
department: devsecops
owner_agent: samwise
trigger_command: /ci-generator
version: 1.0.0
---

# Continuous Integration Pipeline Generator

Generate deterministic, secure, and reproducible Continuous Integration (CI) workflows for GitHub Actions, GitLab CI, and automated deployment systems. Implement strict verification gates encompassing linting, type checking, security auditing, and test suites.

## When to Activate

- Scaffolding new CI workflows for greenfield repositories.
- Adding automated pull request verification checks and branch protection rules.
- Upgrading CI dependencies, package caching strategies, or Node.js/Python runtimes.
- Setting up automated security audits and secret detection gates in CI.

## Core Intent and Authority

- **Owner Agent:** `samwise` (Git Commits and State Keeper).
- **Authority Boundary:** Owns `.github/workflows/`, `.gitlab-ci.yml`, and pipeline build configurations. Prohibits non-deterministic scripts and unpinned actions.
- **Execution Rule:** If a CI pipeline cannot run deterministically in an isolated sandbox, the pipeline is invalid.

## Standard Verification Pipeline Architecture

Every production CI pipeline must execute the following sequential stages:

```text
[Stage 1: Lint & Typecheck] -> Syntax check, ESLint/Biome, TSC / Mypy
            │
            ▼
[Stage 2: Security Audit]   -> Dependency vulnerability check, Secret scanning
            │
            ▼
[Stage 3: Test Execution]   -> Unit tests, Integration tests, Coverage gates
            │
            ▼
[Stage 4: Build Artifact]   -> Compile production bundle, verify clean output
```

## Security Rules for CI Pipelines

1. **Pin GitHub Actions to Full Commit SHAs:** Never use mutable tags like `@v4` or `@master` in production pipelines. Pin to exact 40-character commit hashes to defend against supply-chain attacks.
2. **Read-Only Default Permissions:** Declare `permissions: contents: read` at the top of the workflow file. Grant write permissions only to jobs that require them explicitly.
3. **Deterministic Dependency Installation:** Use `npm ci` (or `pnpm install --frozen-lockfile` or `poetry install --no-root`). Never execute `npm install` in CI environments.
4. **Isolated Secrets:** Inject secrets into environment variables for individual steps only, never globally across the entire workflow.

## Production GitHub Actions Workflow Example

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  verify:
    name: Verify Code Quality, Security, and Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Check out repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0

      - name: Set up Node.js runtime
        uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af # v4.1.0
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies strictly
        run: npm ci

      - name: Run type checking
        run: npm run typecheck

      - name: Run linter and style check
        run: npm run lint

      - name: Run dependency security audit
        run: npm audit --audit-level=high

      - name: Execute automated test suite
        run: npm test -- --coverage
```

## Hard Verification Gates

- Reject any workflow file that uses unpinned third-party actions without a SHA-1 hash.
- Reject workflows that run `npm install` instead of `npm ci`.
- Ensure all workflows set an explicit job-level timeout (maximum 20 minutes) to prevent runaway billed runners.
- Ensure automated tests run in parallel across isolated job matrices when testing multi-platform support.

## Anti-Patterns Prevented

- **AP-57 (Untracked side effect in CI):** Eliminates mutable environments and unsanctioned network side effects.
- **AP-58 (Unpinned dependency in CI):** Prevents supply-chain injection by mandating frozen lockfiles and action SHA pinning.
- **AP-60 (Slow unbuffered CI):** Optimizes pipeline duration using native dependency caching.

## Related Skills

- [conventional-commit.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/devsecops/conventional-commit.md)
- [security-audit.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/security/security-audit.md)
- [tdd-runner.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/qa/tdd-runner.md)
