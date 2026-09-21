# /flaky-fix Command

Runs tests in loop to isolate race conditions.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** flaky-test-hunter
- **Category:** Testing

---

## 2. Trigger Syntax

```bash
/flaky-fix <test-file>
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Flaky Test Hunter & Eliminator protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
