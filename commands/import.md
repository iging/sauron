# /import Command

Detects platform configs and previews migration into Sauron source.

---

## 1. Identity & Execution

- **Lead Agent:** Samwise
- **Specialist Agent:** migration-scout
- **Category:** Workflow

---

## 2. Trigger Syntax

```bash
/import --dry-run
```

---

## 3. Workflow Protocol

1. **Step 1:** Detect Cursor, Copilot, Windsurf, Claude, and Codex signal files in the workspace.
2. **Step 2:** Build the sorted import plan mapping sources to Sauron destinations.
3. **Step 3:** Preview conversions with dry-run first and backup notice before apply.

---

## 4. Hard Verification Gates

- Preview every migration with dry-run before writing.
- Verify backup coverage on existing files before apply.
