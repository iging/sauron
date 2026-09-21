---
id: edge-fuzzer
name: Edge Fuzzing and Chaos Stress Testing
department: qa_testing
owner_agent: pippin
trigger_command: /edge-fuzzer
version: 1.0.0
---

# Edge Fuzzing and Chaos Stress Testing

Probe critical application paths, parser functions, and API inputs with adversarial boundary conditions, random mutations, and chaos stimuli. Uncover unhandled exceptions, memory leaks, race conditions, and infinite recursion before production deployment.

## When to Activate

- Testing parsers, encoders, decoders, and input sanitizers.
- Validating authentication, payment, or rate-limiting thresholds.
- Stress testing async pipelines, queues, or concurrent database updates.
- Verifying error recovery and graceful degradation under abnormal loads.

## Core Intent and Authority

- **Owner Agent:** `pippin` (Edge Case and Chaos Prober).
- **Authority Boundary:** Injects adversarial inputs into test suites and test fixtures. Does not write production code or alter deployment pipelines.
- **Execution Rule:** If a function cannot handle extreme edge cases without crashing the process, the function is broken.

## Boundary Mutation Matrix

Test harnesses must subject every input argument to the following category mutations:

| Category               | Test Inputs and Payloads                                                                                                                                                                                |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Numeric Extremes**   | `0`, `-0`, `1`, `-1`, `NaN`, `Infinity`, `-Infinity`, `Number.MAX_SAFE_INTEGER`, `Number.MIN_SAFE_INTEGER`, float precision drifts (`0.1 + 0.2`)                                                        |
| **String Extremes**    | Empty string `""`, whitespace only `"   "`, multiline strings, null byte injection (`"\0"`), extreme lengths (100,000 characters), four-byte UTF-8 emoji strings, bidirectional text control characters |
| **Structure Extremes** | `null`, `undefined`, empty object `{}`, deeply nested objects (depth > 500), circular object references, empty array `[]`, sparse arrays `new Array(1000)`                                              |
| **Security Payloads**  | SQL injection sequences (`' OR '1'='1`), path traversal (`../../../../etc/passwd`), shell expansions (`$(whoami)`), XSS vectors (`<script>alert(1)</script>`)                                           |
| **Temporal Anomalies** | Expired timestamps, leap seconds, year 2038 epoch rollovers, reverse timestamps (end time before start time)                                                                                            |

## Chaos Fuzzing Protocol

1. **Step 1: Identify Ingestion Boundary:** Target public API controllers, CLI argument parsers, or serialization decoders.
2. **Step 2: Generate Property-Based Tests:** Employ fast-check, hypothesis, or custom property-based generators to run at least 1,000 randomized iterations per test run.
3. **Step 3: Concurrency Race Probing:** Fire 50 concurrent requests against stateful endpoints with identical keys to identify race conditions or dirty reads.
4. **Step 4: Measure Memory and Event Loop Latency:** Verify that processing abnormal payloads does not block the Node.js event loop or cause memory consumption spikes.
5. **Step 5: Record Crashing Seeds:** Persist any failing input payload to a regression test file (`tests/fixtures/fuzz-failures.json`) to prevent future regressions.

## Property-Based Test Example (TypeScript / fast-check)

```typescript
// tests/fuzz/order-parser.fuzz.test.ts
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { parseOrderPayload } from "../../src/parsers/order-parser.js";

describe("parseOrderPayload Fuzzing", () => {
  it("never throws unhandled exceptions regardless of arbitrary string input", () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (rawPayload) => {
        const result = parseOrderPayload(rawPayload);

        // Function must either return a valid parsed order or a structured error
        expect(result).toHaveProperty("success");
        if (!result.success) {
          expect(typeof result.errorMessage).toBe("string");
        }
      }),
      { numRuns: 1000 },
    );
  });

  it("handles extreme integer quantities safely without integer overflow", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -2147483648, max: 2147483647 }),
        (quantity) => {
          const payload = JSON.stringify({ itemId: "item_123", quantity });
          const result = parseOrderPayload(payload);

          if (quantity <= 0) {
            expect(result.success).toBe(false);
          }
        },
      ),
      { numRuns: 500 },
    );
  });
});
```

## Hard Verification Gates

- Fail immediately if any adversarial input results in an uncaught `TypeError`, unhandled promise rejection, or process crash (`SIGSEGV` or `SIGABRT`).
- Fail if response time for invalid payloads exceeds 200 milliseconds (indicating denial-of-service vulnerability).
- Guarantee that all error responses return sanitized messages without leaking stack traces or database schema details.

## Anti-Patterns Prevented

- **AP-3 (Missing acceptance criteria):** Enforces boundary definitions for all invalid and out-of-range inputs.
- **AP-11 (Silent error swallowing):** Exposes empty `catch` blocks that hide invalid parsing states.
- **AP-45 (Unbounded input):** Catches missing payload size checks, infinite loops, and stack overflows.
- **AP-50 (Unchecked promise race):** Identifies race conditions caused by non-atomic database transactions.

## Related Skills

- [tdd-runner.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/qa/tdd-runner.md)
- [pippin.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/pippin.md)
- [security-audit.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/security/security-audit.md)
