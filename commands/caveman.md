# /caveman Command

Activates conversational compression to save context tokens.

---

## 1. Identity & Execution

- **Lead Agent:** Legolas
- **Specialist Agent:** token-optimizer
- **Category:** Optimization

---

## 2. Trigger Syntax

```bash
/caveman [lite|full|ultra|off]
```

---

## 3. Workflow Protocol

1. **Step 1:** Strip greetings, pleasantries, and tool narration.
2. **Step 2:** Format output as [subject] [action] [rationale]. [next step].
3. **Step 3:** Conserve up to 75% of context window tokens.

---

## 4. Hard Verification Gates

- Never drop code invariants, paths, or qualifiers.
