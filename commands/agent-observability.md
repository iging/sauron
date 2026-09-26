# /agent-observability Command

Defines trace capture, cost dashboards, and privacy policy for agent fleets.

---

## 1. Identity & Execution

- **Lead Agent:** Boromir
- **Specialist Agent:** telemetry-auditor
- **Category:** Security

---

## 2. Trigger Syntax

```bash
/agent-observability <fleet>
```

---

## 3. Workflow Protocol

1. **Step 1:** Record dashboard questions for cost, tool use, and failures.
2. **Step 2:** Specify trace schema with redaction and retention policy.
3. **Step 3:** Present the observability plan for approval before capture.

---

## 4. Hard Verification Gates

- Default to metadata-only capture with signed privacy policy.
- Verify human approval before enabling capture.
