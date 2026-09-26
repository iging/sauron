# /slop-scan Command

Scores packages against the supply-chain gate and scans files for unsafe sinks.

---

## 1. Identity & Execution

- **Lead Agent:** Boromir
- **Specialist Agent:** supply-chain-guard
- **Category:** Security

---

## 2. Trigger Syntax

```bash
/slop-scan <package|file...>
```

---

## 3. Workflow Protocol

1. **Step 1:** Score each package by registry existence, age, downloads, and maintainers with fail-closed blocks.
2. **Step 2:** Scan file targets for unsafe sinks while skipping comment lines.
3. **Step 3:** Emit SARIF output for CI upload and block verdicts for hallucinated packages.

---

## 4. Hard Verification Gates

- Block packages missing from the registry with risk verdicts.
- Verify SARIF version and finding locations before emission.
