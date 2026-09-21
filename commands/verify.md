# /verify Command

Runs full verification: build, typecheck, test suites, and doc gate.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** qa-specialist
- **Category:** Testing

---

## 2. Trigger Syntax

```bash
/verify
```

---

## 3. Workflow Protocol

1. **Step 1:** Run TypeScript compilation (npm run build).
2. **Step 2:** Run automated test suites (npm test).
3. **Step 3:** Run documentation compliance audit.

---

## 4. Hard Verification Gates

- All checks must pass with exit code 0.
