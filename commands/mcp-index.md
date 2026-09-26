# /mcp-index Command

Emits the MCP skill index with skill resource URIs for client discovery.

---

## 1. Identity & Execution

- **Lead Agent:** Pippin
- **Specialist Agent:** mcp-specialist
- **Category:** Tooling

---

## 2. Trigger Syntax

```bash
/mcp-index
```

---

## 3. Workflow Protocol

1. **Step 1:** Scan registered skill domains and collect names with descriptions.
2. **Step 2:** Build canonical `skill://` resource URIs and assemble the sorted index document.
3. **Step 3:** Emit index JSON for MCP client consumption and validate URI-to-name matches.

---

## 4. Hard Verification Gates

- Validate every index URL parses back to its skill name.
- Verify zero empty names or descriptions before emission.
