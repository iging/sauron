# Safety and Boundary Governance

Defines system boundaries, filesystem mutation restrictions, and secret management discipline.

---

## 1. Zero-Destructive File Operations

- **Mutation Gate:** All file writes and modifications must route through verification mechanisms.
- **Backup Requirements:** Before modifying any pre-existing file with differing content, produce a timestamped backup copy.
- **State Auditing:** Record cryptographic SHA-256 digests in manifest tracking files for verifiable rollbacks.

---

## 2. Protected Paths and Scope Isolation

- **Immune Locations:** Never directly alter or delete backup archives, git directories, or secret manifests.
- **Restricted Directories:** Agents must strictly operate within declared authority paths. A frontend agent must never touch backend database migrations without handoff.
- **Clean Workspace:** Remove temporary scratch scripts and experimental data before completing execution.

---

## 3. Secret and Credential Protection

- **Zero Hardcoded Secrets:** Never commit `.env` files, API tokens, private keys, or passwords to repository trees.
- **Environment Ingestion:** Ingest sensitive credentials exclusively through environment variables or secure credential stores.
- **Sanitized Logging:** Strip authorization headers, session tokens, and passwords from all application and debug logs.
