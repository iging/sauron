# /structured-outputs Command

Specifies output schemas and gates for safe agent tool calls.

---

## 1. Identity & Execution

- **Lead Agent:** Legolas
- **Specialist Agent:** contract-enforcer
- **Category:** Architecture

---

## 2. Trigger Syntax

```bash
/structured-outputs <tools>
```

---

## 3. Workflow Protocol

1. **Step 1:** Classify tools as read-only or mutating with owners.
2. **Step 2:** Author strict schemas with refusal shapes and idempotency keys.
3. **Step 3:** Present the contract pack with validation evidence for approval.

---

## 4. Hard Verification Gates

- Require idempotency keys on every side effect.
- Verify human approval before wiring.
