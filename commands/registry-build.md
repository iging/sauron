# /registry-build Command

Exports the governed catalog from approved registry entries only.

---

## 1. Identity & Execution

- **Lead Agent:** Gandalf
- **Specialist Agent:** registry-curator
- **Category:** Planning

---

## 2. Trigger Syntax

```bash
/registry-build
```

---

## 3. Workflow Protocol

1. **Step 1:** Load registry entries and validate slugs, versions, commits, and scores.
2. **Step 2:** Filter to published entries and exclude drifted slugs from export.
3. **Step 3:** Emit the static catalog with export timestamp for agent consumption.

---

## 4. Hard Verification Gates

- Export published entries only; drafts never ship.
- Verify zero drifted entries in the final catalog.
