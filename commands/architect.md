# /architect Command

Defines system boundaries, module contracts, and design tokens.

---

## 1. Identity & Execution

- **Lead Agent:** Aragorn
- **Specialist Agent:** architect
- **Category:** Architecture

---

## 2. Trigger Syntax

```bash
/architect <subsystem-name>
```

---

## 3. Workflow Protocol

1. **Step 1:** Assess dependency boundaries and layer isolation.
2. **Step 2:** Define clean interface contracts and DTO schemas.
3. **Step 3:** Document architectural choices in context/ARCHITECTURE.md.

---

## 4. Hard Verification Gates

- Prohibit circular imports across modules.
- Reject barrel files (index.ts).
