# Anti-Pattern Guard

AI agents frequently encounter recurring behavioral traps that consume tokens, introduce security vulnerabilities, or break working codebases.

Sauron actively prevents **53 credit-killing anti-patterns** cataloged in the Linux Foundation Agentic AI standard.

---

## High-Risk Anti-Patterns Prevented

### 1. AP-1: Vague Task Verb

- **Problem**: User prompts like "help me build this" cause agents to guess requirements, burning context.
- **Sauron Defense**: Gandalf pauses and requests specific acceptance criteria before creating implementation tasks.

### 2. AP-4: Over-Permissive Execution

- **Problem**: Agents run destructive shell commands or overwrite production data without verification.
- **Sauron Defense**: Boromir and Gimli gate all destructive operations behind explicit approval prompts.

### 3. AP-6: Build-The-Whole-Thing Monolith

- **Problem**: Agents attempt to write an entire multi-file feature in a single turn, resulting in incomplete files and truncated code.
- **Sauron Defense**: Frodo enforces atomic execution, implementing one task item at a time with test verification.

### 4. AP-18: Over-Reliance on Internal State

- **Problem**: Agents assume context persists across session restarts, leading to hallucinations when context windows reset.
- **Sauron Defense**: Samwise records session checkpoints, decisions, and immediate next steps directly to disk.

### 5. AP-26: No Scope Boundary

- **Problem**: Agents modify files unrelated to the active task, causing unexpected regressions.
- **Sauron Defense**: Each Fellowship agent operates under strict file path boundaries.

### 6. AP-28: No Stop Condition

- **Problem**: Agents loop indefinitely, generating speculative code without human confirmation.
- **Sauron Defense**: Every skill defines a deterministic stop condition and exit checklist.

### 7. AP-53: Tool Trust Without Validation

- **Problem**: Agents trust unvalidated outputs from tools or external APIs, introducing injection bugs.
- **Sauron Defense**: Gimli enforces runtime schema validation using Zod or Pydantic at all boundaries.
