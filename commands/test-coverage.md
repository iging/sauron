# /test-coverage Command

Measures test coverage and generates tests for untested branches.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** coverage-analyst
- **Category:** Testing

---

## 2. Trigger Syntax

```bash
/test-coverage
```

---

## 3. Workflow Protocol

1. **Step 1:** Run coverage reporter across target package.
2. **Step 2:** Identify untested error paths and branches.
3. **Step 3:** Author targeted tests to reach coverage threshold.

---

## 4. Hard Verification Gates

- Enforce coverage baseline without asserting implementation details.
