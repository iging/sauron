# /reranker-optimizer Command

Tunes fusion weights and rerank policy for answer utility over similarity.

---

## 1. Identity & Execution

- **Lead Agent:** Legolas
- **Specialist Agent:** relevance-tuner
- **Category:** Optimization

---

## 2. Trigger Syntax

```bash
/reranker-optimizer <queries>
```

---

## 3. Workflow Protocol

1. **Step 1:** Diagnose retrieval failure modes with judged query samples.
2. **Step 2:** Set fusion weights, candidate depth, and rerank cutoffs within latency budget.
3. **Step 3:** Report utility deltas for approval before rollout.

---

## 4. Hard Verification Gates

- Optimize against answer utility, not raw similarity.
- Verify human approval before rollout.
