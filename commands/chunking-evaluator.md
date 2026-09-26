# /chunking-evaluator Command

Compares chunking methods on quality and cost to select the cheapest winner.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** retrieval-tester
- **Category:** Testing

---

## 2. Trigger Syntax

```bash
/chunking-evaluator <corpus>
```

---

## 3. Workflow Protocol

1. **Step 1:** Lock token chunking as baseline with NDCG and Recall metrics.
2. **Step 2:** Measure candidates on identical setup with throughput and memory columns.
3. **Step 3:** Select by quality per cost for approval before index changes.

---

## 4. Hard Verification Gates

- Measure every candidate on the same query set.
- Verify human approval before index changes.
