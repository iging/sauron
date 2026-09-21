# /code-review Command

Conducts line-by-line inspection of diffs with structured findings.

---

## 1. Identity & Execution

- **Lead Agent:** Legolas
- **Specialist Agent:** code-reviewer
- **Category:** Review

---

## 2. Trigger Syntax

```bash
/code-review [branch-or-diff]
```

---

## 3. Workflow Protocol

1. **Step 1:** Collect git diff across modified files.
2. **Step 2:** Inspect for type safety, unhandled async, and anti-patterns.
3. **Step 3:** Output findings categorized into Blockers, Warnings, and Notes.

---

## 4. Hard Verification Gates

- Flag promises missing error handlers.
- Prohibit approval if tests are omitted.
