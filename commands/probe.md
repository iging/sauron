# /probe Command

Probes boundary inputs, network drops, and obscure failure modes.

---

## 1. Identity & Execution

- **Lead Agent:** Pippin
- **Specialist Agent:** chaos-prober
- **Category:** Tooling

---

## 2. Trigger Syntax

```bash
/probe <endpoint-or-function>
```

---

## 3. Workflow Protocol

1. **Step 1:** Inject extreme boundary values and malformed payloads.
2. **Step 2:** Simulate high latency and unexpected network drops.
3. **Step 3:** Document unhandled exceptions for remediation.

---

## 4. Hard Verification Gates

- Prohibit testing against live production databases.
