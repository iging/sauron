# /vector-db-selector Command

Recommends one vector engine with index parameters justified by workload facts.

---

## 1. Identity & Execution

- **Lead Agent:** Aragorn
- **Specialist Agent:** retrieval-architect
- **Category:** Database

---

## 2. Trigger Syntax

```bash
/vector-db-selector <workload>
```

---

## 3. Workflow Protocol

1. **Step 1:** Capture corpus size, query rate, filter fields, and hybrid search needs.
2. **Step 2:** Apply the decision framework and justify the rejected engines.
3. **Step 3:** Emit index parameters with cost model for approval before provisioning.

---

## 4. Hard Verification Gates

- Require corpus size and filter fields before recommendation.
- Verify human approval before any provisioning.
