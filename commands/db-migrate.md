# /db-migrate Command

Plans and executes multi-phase schema migrations with type sync.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** database-admin
- **Category:** Database

---

## 2. Trigger Syntax

```bash
/db-migrate <migration-name>
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze schema diff against context/SCHEMA.md.
2. **Step 2:** Structure breaking changes into expand-contract phases.
3. **Step 3:** Generate migration script with safe column defaults.
4. **Step 4:** Regenerate client ORM types across codebase.

---

## 4. Hard Verification Gates

- Destructive commands require explicit confirmation.
- Dependent types must never remain desynchronized.
