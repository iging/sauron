# /diff Command

Shows drift between lockfile pins and workspace skill checksums.

---

## 1. Identity & Execution

- **Lead Agent:** Samwise
- **Specialist Agent:** lockfile-keeper
- **Category:** Workflow

---

## 2. Trigger Syntax

```bash
/diff
```

---

## 3. Workflow Protocol

1. **Step 1:** Load `sauron-skills.lock.json` and validate pins with fail-closed checks.
2. **Step 2:** Compare pinned checksums against workspace state and classify missing, changed, untracked, and outdated entries.
3. **Step 3:** Render the drift report for review before any sync or apply action.

---

## 4. Hard Verification Gates

- Read-only execution; zero files written by this command.
- Verify lockfile schema version before comparison.
