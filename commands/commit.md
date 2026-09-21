# /commit Command

Generates atomic conventional commit messages from staged diffs.

---

## 1. Identity & Execution

- **Lead Agent:** Samwise
- **Specialist Agent:** state-keeper
- **Category:** Workflow

---

## 2. Trigger Syntax

```bash
/commit
```

---

## 3. Workflow Protocol

1. **Step 1:** Inspect staged files and isolate single logical change.
2. **Step 2:** Generate message in format type(scope): description.
3. **Step 3:** Execute git commit.

---

## 4. Hard Verification Gates

- Prohibit multi-purpose commits covering unrelated domains.
