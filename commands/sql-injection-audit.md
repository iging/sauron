# /sql-injection-audit Command

Verifies all SQL operations use parameterized queries.

---

## 1. Identity & Execution

- **Lead Agent:** Boromir
- **Specialist Agent:** owasp-scanner
- **Category:** Security

---

## 2. Trigger Syntax

```bash
/sql-injection-audit
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute SQL Injection Audit Inspector protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
