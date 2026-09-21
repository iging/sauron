# /tdd Command

Authors failing tests before implementation code is written.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** qa-specialist
- **Category:** Testing

---

## 2. Trigger Syntax

```bash
/tdd <unit-or-feature>
```

---

## 3. Workflow Protocol

1. **Step 1:** Classify requirement as unit, integration, or E2E.
2. **Step 2:** Write deterministic test asserting target behavior.
3. **Step 3:** Run test to verify failure (Red).
4. **Step 4:** Hand off to /execute to implement minimal code (Green).

---

## 4. Hard Verification Gates

- Prohibit arbitrary sleep timeouts in tests.
- Use user-facing accessibility locators.
