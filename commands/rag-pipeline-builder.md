# /rag-pipeline-builder Command

Designs staged RAG pipelines with contracts and isolated evaluation hooks.

---

## 1. Identity & Execution

- **Lead Agent:** Aragorn
- **Specialist Agent:** rag-architect
- **Category:** Architecture

---

## 2. Trigger Syntax

```bash
/rag-pipeline-builder <corpus>
```

---

## 3. Workflow Protocol

1. **Step 1:** Profile corpus structure and classify query types with examples.
2. **Step 2:** Specify chunking, embedding, hybrid retrieval, rerank, and generation contracts.
3. **Step 3:** Attach retrieval and generation eval hooks for approval before coding.

---

## 4. Hard Verification Gates

- Evaluate retrieval and generation stages separately.
- Verify human approval before implementation.
