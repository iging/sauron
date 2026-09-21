# /execute Command

Implements the next unchecked item from the active task list.

---

## 1. Identity & Execution

- **Lead Agent:** Frodo
- **Specialist Agent:** executor
- **Category:** Execution

---

## 2. Trigger Syntax

```bash
/execute [task-id]
```

---

## 3. Workflow Protocol

1. **Step 1:** Read next item from context/TASKS.md.
2. **Step 2:** Verify prerequisite context and test fixtures.
3. **Step 3:** Write minimal complete implementation code.
4. **Step 4:** Pass to /tdd and /code-review for verification.

---

## 4. Hard Verification Gates

- Stop if implementation exceeds active task scope.
- Verify compilation before declaring completion.
