# /trace-report Command

Summarizes Fellowship trace events into per-agent cost and failure totals.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** trace-diagnostician
- **Category:** Debugging

---

## 2. Trigger Syntax

```bash
/trace-report [path]
```

---

## 3. Workflow Protocol

1. **Step 1:** Load the trace JSON file and validate every event against the trace schema.
2. **Step 2:** Aggregate input and output tokens per agent with failed and retried counts.
3. **Step 3:** Render the summary with per-agent lines for cost and reliability review.

---

## 4. Hard Verification Gates

- Reject malformed trace files before analysis.
- Verify token counts are non-negative integers.
