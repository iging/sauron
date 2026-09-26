# /context-engineering Command

Sets context budgets, compaction rules, and memory tiers for long runs.

---

## 1. Identity & Execution

- **Lead Agent:** Gandalf
- **Specialist Agent:** context-steward
- **Category:** Optimization

---

## 2. Trigger Syntax

```bash
/context-engineering <task>
```

---

## 3. Workflow Protocol

1. **Step 1:** Write the source-of-truth map before loading deep context.
2. **Step 2:** Set per-turn token budgets with headroom for tools and reasoning.
3. **Step 3:** Define compaction triggers that preserve decisions for approval.

---

## 4. Hard Verification Gates

- Cap planned context within window with headroom.
- Verify human approval before enforcement.
