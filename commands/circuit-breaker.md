# /circuit-breaker Command

Wraps third-party network calls in circuit breakers.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** backend-engineer
- **Category:** Backend

---

## 2. Trigger Syntax

```bash
/circuit-breaker <service>
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Resilience Circuit Breaker protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
