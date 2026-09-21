---
id: tdd-runner
name: TDD Runner and Assertion Gate
department: qa_testing
owner_agent: merry
trigger_command: /test-gate
version: 1.0.0
---

# TDD Runner and Assertion Gate

Enforce strict Test-Driven Development (TDD) across all code additions and modifications. Guarantee that tests fail for the intended reason before implementation begins, verify assertion coverage, and prevent regression bugs.

## When to Activate

- Implementing any new business logic, domain service, or utility function.
- Fixing reported bugs or resolving security vulnerabilities.
- Validating pull request candidates before committing or pushing changes.
- Reviewing code coverage metrics to identify untested branches.

## Core Intent and Authority

- **Owner Agent:** `merry` (QA and TDD Specialist).
- **Authority Boundary:** Owns test files in `tests/`, `spec/`, and `__tests__/`. Authorizes or blocks implementation handoffs based on test execution results.
- **Execution Rule:** Code without a failing test written beforehand is unverified code and must not be merged.

## The Three-Phase TDD Execution Cycle

```text
[RED PHASE]     -> Write test demonstrating missing behavior or reproducing bug (MUST FAIL)
       │
       ▼
[GREEN PHASE]   -> Write minimal production code to pass the test (MUST PASS)
       │
       ▼
[REFACTOR PHASE]-> Clean code, eliminate duplication, verify test suite remains GREEN
```

### 1. Phase 1: Red (Write Failing Test First)

1. Write a test describing the precise expected behavior.
2. Run the test suite against the target test file.
3. Verify that the test fails with the expected error message (for example "function not defined" or "received 404, expected 200").
4. If the test passes immediately without code changes, the test is invalid or asserts existing behavior. Rewrite the test before proceeding.

### 2. Phase 2: Green (Minimal Implementation)

1. Implement only the necessary code required to satisfy the failing test assertion.
2. Avoid speculative logic, extraneous helper functions, or unrequested features (YAGNI).
3. Re-run the test suite and confirm that the target test passes cleanly.

### 3. Phase 3: Refactor (Clean and Optimize)

1. Improve code structure, variable naming, and readability.
2. Remove duplicated expressions or dead branches.
3. Re-run tests continuously during refactoring to guarantee zero behavioral regressions.

## Assertion and Mocking Standards

- **Strict Assertions:** Use explicit assertions (`toBe`, `toEqual`, `toThrow`). Never use weak truthy checks (`toBeTruthy`) on structured data.
- **Hermetic Unit Tests:** Unit tests must never initiate real network requests, open external database connections, or mutate shared system files.
- **Mock Cleanup:** Always restore or clear mocks after each test execution (`vi.restoreAllMocks()` or `jest.restoreAllMocks()`).
- **Deterministic Clocks:** Freeze timers when testing time-dependent logic (`vi.useFakeTimers()`).

## Concrete Code Example (Vitest / Jest)

```typescript
// tests/services/billing-calculator.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { calculateDiscountedTotal } from "../../src/services/billing-calculator.js";

describe("calculateDiscountedTotal", () => {
  it("applies 20 percent discount when user has VIP tier", () => {
    const cart = { items: [{ price: 100, quantity: 2 }] };
    const user = { tier: "VIP" as const };

    const total = calculateDiscountedTotal(cart, user);

    // Assert exact expected discount: 200 - 20% = 160
    expect(total).toBe(160);
  });

  it("throws error when cart contains negative item prices", () => {
    const invalidCart = { items: [{ price: -50, quantity: 1 }] };
    const user = { tier: "standard" as const };

    expect(() => calculateDiscountedTotal(invalidCart, user)).toThrow(
      "Item price cannot be negative",
    );
  });
});
```

## Hard Verification Gates

- Stop immediately if any test file contains an empty test block (`it.todo` or empty callback).
- Stop immediately if tests pass without ever producing an initial failure.
- Fail verification if branch coverage drops below 85 percent for the target module.
- Reject all tests that disable type checking using `@ts-ignore` or `any`.

## Anti-Patterns Prevented

- **AP-17 (Skipping tests):** Prohibits committing code without running and proving test execution.
- **AP-43 (Assertion-free tests):** Rejects tests that execute code without asserting expected return values or side effects.
- **AP-48 (Fragile mocks):** Prevents over-mocking internal implementation details instead of testing public contracts.
- **AP-52 (Fake fix):** Catches fixes that merely silence errors rather than solving the underlying defect.

## Related Skills

- [edge-fuzzer.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/qa/edge-fuzzer.md)
- [merry.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/merry.md)
- [plan-feature.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/architecture/plan-feature.md)
