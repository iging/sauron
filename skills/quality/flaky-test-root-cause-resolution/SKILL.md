---
name: flaky-test-root-cause-resolution
description: Systematic detection, quarantine, and root-cause remediation of asynchronous race conditions and timing leaks in test suites.
department: quality
ownerAgent: merry
triggerCommand: /flaky-test-root-cause-resolution
antiPatternsPrevented:
  - AP-1
  - AP-6
  - AP-18
  - AP-26
---

# Flaky Test Root Cause Resolution

## 0. Identity

- **Role:** Test Reliability Engineer. Quarantines non-deterministic test cases and eliminates timing-dependent assertions.
- **Authority:** Normative specification under `skills/quality/flaky-test-root-cause-resolution/`.
- **Must not define:** Production business domain logic.
- **Normative base:** `core/fellowship/merry.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`, `context/core-domains/testing-strategy.md`.

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                          |
| --- | ---------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Task             | Detect, quarantine, diagnose, and remediate non-deterministic flaky automated tests.           |
| 2   | Target Tool      | Jest, Vitest, Playwright, Mocha, Stress-test repeaters.                                        |
| 3   | Output Format    | Remediated test files, quarantine tags, and root cause post-mortem documentation.              |
| 4   | Constraints      | Strictly ban arbitrary sleep timers (`setTimeout(500)`). Always use condition polling.         |
| 5   | Input            | Flaky test error traces, CI run logs, reproduction command scripts.                            |
| 6   | Context          | Prevents broken deployment pipelines, lost developer trust in CI, and missed real regressions. |
| 7   | Audience         | Software engineers, test automation engineers, and build reliability teams.                    |
| 8   | Success Criteria | Target test runs 100 times consecutively in parallel with zero failures.                       |
| 9   | Examples         | See Section 5.                                                                                 |

## 2. Remediation Directives

1. **Ban Fixed Sleep Timers:** Replace arbitrary delays (`sleep(500)`) with event-driven predicates and explicit wait assertions.
2. **Shared State Isolation:** Guarantee hermetic test environments with dedicated database schemas and mock server state resets.
3. **Asynchronous Race Detection:** Stress-test suspected flakiness by executing targeted test suites 50 times in parallel under artificial load.
4. **Quarantine Protocol:** Move flaky tests immediately to a separate non-blocking `@quarantine` suite while investigations proceed.

## 3. Anti-Pattern & Refactor Example

```typescript
// ANTI-PATTERN: Brittle timing-dependent sleep
test("submits form and displays success banner", async ({ page }) => {
  await page.click("#submit");
  await page.waitForTimeout(1000); // FLAKY: Network latency or slow CPU causes failure
  expect(await page.isVisible("#banner")).toBe(true);
});

// REMEDIATION: Event-driven assertion with auto-polling
test("submits form and displays success banner", async ({ page }) => {
  const responsePromise = page.waitForResponse(
    (resp) => resp.url().includes("/api/submit") && resp.status() === 200,
  );
  await page.click("#submit");
  await responsePromise;
  await expect(page.locator("#banner")).toBeVisible({ timeout: 5000 });
});
```
