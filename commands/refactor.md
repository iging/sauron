# /refactor Command

Eliminates dead code and simplifies bloated functions safely.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** refactorer
- **Category:** Architecture

---

## 2. Trigger Syntax

```bash
/refactor <target-file>
```

---

## 3. Workflow Protocol

1. **Step 1:** Run tests to establish green baseline.
2. **Step 2:** Scan for unused exports and redundant helper functions.
3. **Step 3:** Flatten complexity and remove duplicate logic.
4. **Step 4:** Verify tests pass with zero regressions.

---

## 4. Hard Verification Gates

- Stop if any test fails following refactor.
