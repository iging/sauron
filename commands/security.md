# /security Command

Scans codebase line by line for injection, auth, and secret leaks.

---

## 1. Identity & Execution

- **Lead Agent:** Boromir
- **Specialist Agent:** security-shield
- **Category:** Security

---

## 2. Trigger Syntax

```bash
/security [path-or-scope]
```

---

## 3. Workflow Protocol

1. **Step 1:** Inspect source code for injection vectors and IDOR flaws.
2. **Step 2:** Scan package manifests for known CVEs.
3. **Step 3:** Produce structured audit report with CWE classifications.

---

## 4. Hard Verification Gates

- Never commit security patches without user sign-off.
