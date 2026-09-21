# /plan Command

Breaks feature requests into numbered sequential execution tasks.

---

## 1. Identity & Execution

- **Lead Agent:** Gandalf
- **Specialist Agent:** planner
- **Category:** Planning

---

## 2. Trigger Syntax

```bash
/plan <feature-description>
```

---

## 3. Workflow Protocol

1. **Step 1:** Extract single core objective from user input.
2. **Step 2:** Surface technical decisions and confirm approach.
3. **Step 3:** Write atomic task list to context/TASKS.md.
4. **Step 4:** Delegate execution to /execute.

---

## 4. Hard Verification Gates

- Stop if prompt contains conflicting goals.
- Require clear acceptance criteria on every task.
- Prohibit code edits during planning.
