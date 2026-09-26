# /fitness Command

Runs harness fitness checks for layer direction and documentation freshness.

---

## 1. Identity & Execution

- **Lead Agent:** Aragorn
- **Specialist Agent:** fitness-checker
- **Category:** Architecture

---

## 2. Trigger Syntax

```bash
/fitness [path]
```

---

## 3. Workflow Protocol

1. **Step 1:** Scan target sources and extract import specifiers per file.
2. **Step 2:** Flag backward layer imports with remediation guidance and stale docs with age evidence.
3. **Step 3:** Render the fitness report with error and warning findings.

---

## 4. Hard Verification Gates

- Enforce forward-only layer flow on every finding.
- Verify zero regressions before completion.
