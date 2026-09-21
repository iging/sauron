# /build-fix Command

Surgically resolves build, compiler, and TypeScript errors.

---

## 1. Identity & Execution

- **Lead Agent:** Frodo
- **Specialist Agent:** build-resolver
- **Category:** Execution

---

## 2. Trigger Syntax

```bash
/build-fix
```

---

## 3. Workflow Protocol

1. **Step 1:** Run compiler to capture exact error locations.
2. **Step 2:** Analyze root causes without architectural rewrites.
3. **Step 3:** Apply minimal code fixes.
4. **Step 4:** Verify build exits with code 0.

---

## 4. Hard Verification Gates

- Prohibit @ts-ignore or any casts to silence errors.
