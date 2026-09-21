---
name: unified-memory-vault
description: Cross-agent context sharing, inspectable handoff contracts, and portable memory persistence across multiple AI harnesses with scoped vaults and fail-closed isolation.
department: workflow
ownerAgent: gandalf
triggerCommand: /unified-memory-vault
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-18
  - AP-26
  - AP-53
---

# Unified Memory Vault

## 0. Identity

- **Role:** Autonomous Memory and Handoff Custodian. Manages durable, inspectable session context, multi-agent task handoffs, and vault scope boundaries across agent runs.
- **Authority:** Normative tier-4 standard for cross-session and cross-harness memory under `skills/workflow/unified-memory-vault/`.
- **Normative base:** `core/fellowship/gandalf.md`, `core/fellowship/frodo.md`, `core/fellowship/samwise.md`, `rules/engineering/architecture-boundaries.md`, and `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-26 (leaking secrets in context) and AP-53 (treating recalled memory as unquestioned fact).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                             |
| --- | ---------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Task             | Store, search, recall, and hand off structured agent context across development sessions.         |
| 2   | Target Tool      | Sauron Fellowship agents, Claude Code, Codex, Cursor, Windsurf, Antigravity.                      |
| 3   | Output Format    | Markdown documents adhering to portable vault schemas with metadata frontmatter.                  |
| 4   | Constraints      | Banish passwords and tokens. Scopes must fail-closed. Recalled text is evidence, not certainty.   |
| 5   | Input            | Task summaries, verified test outcomes, architecture decisions, unresolved questions.             |
| 6   | Context          | Prevents context loss between agent handoffs, repetitive re-discovery, and contradictory actions. |
| 7   | Audience         | Autonomous agents, pair programming engineers, multi-agent coordinators.                          |
| 8   | Success Criteria | 100 percent verifiable handoff packages; zero secret leaks; fail-closed gitignore protection.     |
| 9   | Examples         | See Section 5.                                                                                    |

## 2. Trigger Matrix

| Trigger Condition                                        | Fire? | Action / Route                                        |
| -------------------------------------------------------- | ----- | ----------------------------------------------------- |
| Handing off task state to another agent or session       | YES   | Generate structured handoff markdown in vault.        |
| Resuming multi-phase project and searching prior choices | YES   | Execute scoped search across project and team vaults. |
| Storing transient debug logs or oversized process traces | NO    | Reject; store only distilled, high-signal findings.   |
| Managing application database migrations                 | NO    | Route to `skills/database/database-migration/`.       |

## 3. Core Architectural Directives

1. **Three-Tier Vault Scope Model:**
   - `project`: `<repo>/.sauron/memory/project/` (Repo-local, protected by fail-closed `.gitignore`).
   - `team`: `<repo>/.sauron/memory/team/` (Tracked in version control after human review).
   - `user`: `~/.sauron/memory/` (Operator-specific across multiple repositories).
2. **Recall as Evidence, Never Certainty:** Recalled memories indicate past observations, not immutable truth. Always verify claims against current repository files and test suites before making decisions.
3. **Strict Secrets Exclusion:** Ban API keys, access tokens, credentials, and customer personal information from memory vaults.
4. **Structured Handoff Contracts:** Every handoff package must state the core objective, current progress, commands already executed, modified files, remaining blockers, and the next concrete step.

## 4. Execution Workflow

### Step 1: Pre-Execution Recall

- **Action:** Query the local memory vault for existing decisions or prior investigations on the topic.
- **Stop Condition:** Halt if vault permissions are missing or if unreadable files are found; repair first.
- **Validation:** Synthesize findings while noting observation timestamps.

### Step 2: Handoff Formulation

- **Action:** At session completion or prior to delegation, author a concise handoff document.
- **Stop Condition:** Halt if unverified hypotheses are presented as confirmed facts.
- **Validation:** Handoff includes explicit next actions and file paths.

### Step 3: Vault Validation Gate

- **Action:** Audit vault directory to guarantee `.gitignore` protection is active on project-level memory.
- **Validation:** Vault state verified and clean.

## 5. Reference Implementation

### Standard Agent Handoff Specification

```markdown
# Handoff: Authentication Flow Hardening

- **Source Agent:** Gimli (Backend Specialist)
- **Target Agent:** Gandalf (Architect)
- **Timestamp:** 2026-09-20T01:20:00Z
- **Scope:** project

## 1. Objective & Current State

- Objective: Migrate session tokens from localStorage to HttpOnly SameSite=Strict cookies.
- Current Status: Cookie middleware implemented; integration tests passing in isolation.

## 2. Evidence & Executed Commands

- Executed `npm test -- tests/auth/cookie.test.ts`: 4 passed, 0 failed.
- Inspected response headers with curl: 'Set-Cookie' header verified with Secure and HttpOnly flags.

## 3. Touched Files

- `src/middleware/auth.middleware.ts` (Updated cookie parser and validator)
- `tests/auth/cookie.test.ts` (Added suite for expired and missing cookies)

## 4. Remaining Blockers & Next Action

- Blocker: Frontend client still attempts to read token from window storage.
- Next Concrete Step: Update frontend auth client in `src/lib/api-client.ts` to rely on cookie transport.
```

## 6. Validation Gate

Run before saving or passing memory handoffs:

- [ ] All sensitive credentials, tokens, and secrets are excluded.
- [ ] Project vault is enclosed within a fail-closed `.gitignore`.
- [ ] Recalled statements are cross-referenced with actual disk state.
- [ ] Handoff clearly separates verified facts from pending experiments.
- [ ] Concrete next steps and target files are explicitly specified.

## 7. Versioning & Portability Matrix

- **Version:** 1.0.0
- **Changelog:**
  - `1.0.0` (2026-09-20): Created Sauron Tier-5 skill aligned with ECC unified-memory patterns.

| Runtime / Harness | Status   | Notes                    |
| ----------------- | -------- | ------------------------ |
| Claude Code       | verified | Fully supported.         |
| Cursor            | verified | Tested with local vault. |
| Windsurf          | verified | Fully supported.         |
| Antigravity       | verified | Certified.               |
