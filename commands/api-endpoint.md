# /api-endpoint Command

Scaffolds typed backend endpoints with Zod runtime validation.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** api-scaffolder
- **Category:** Backend

---

## 2. Trigger Syntax

```bash
/api-endpoint <route-path>
```

---

## 3. Workflow Protocol

1. **Step 1:** Define request input and response output schemas with Zod.
2. **Step 2:** Scaffold route handler with domain error boundaries.
3. **Step 3:** Export client request types.

---

## 4. Hard Verification Gates

- Parse request payloads at boundary before execution.
