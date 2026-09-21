---
id: plan-feature
name: Feature Planning and Intent Decomposition
department: architecture
owner_agent: gandalf
trigger_command: /plan-feature
version: 1.0.0
---

# Feature Planning and Intent Decomposition

Deconstruct high-level user feature requests into deterministic, verifiable, and atomic execution steps. Align every planned change with project architecture, acceptance criteria, and explicit stop conditions.

## When to Activate

- Initiating a new multi-file feature, module, or user story.
- Receiving ambiguous or broad user requests (for example "add authentication" or "build payment processing").
- Updating `context/PRD.md` and `context/TASKS.md` with new work items.
- Breaking down monolithic requests before delegating implementation to execution agents.

## Core Intent and Authority

- **Owner Agent:** `gandalf` (Master Planner).
- **Authority Boundary:** Writes and updates `context/PRD.md`, `context/TASKS.md`, and roadmap files. Must never write application code or edit build files.
- **Execution Rule:** Produce single-sentence, numbered tasks with binary pass or fail acceptance criteria.

## Nine-Dimension Intent Decomposition Protocol

Every feature request must undergo analysis across nine structured dimensions before task generation:

| Dimension               | Description                       | Required Analysis                                                           |
| :---------------------- | :-------------------------------- | :-------------------------------------------------------------------------- |
| **1. Goal**             | The singular business outcome     | What exact user capability does this deliver?                               |
| **2. Scope**            | Strict operational boundaries     | What files, modules, and directories are in scope versus out of scope?      |
| **3. Preconditions**    | Required system state             | What dependencies, configurations, or schemas must exist beforehand?        |
| **4. Invariants**       | Immutable project rules           | What existing behaviors, interfaces, or performance budgets must not break? |
| **5. Inputs**           | Incoming data payloads            | What parameters, schemas, or network events enter the system?               |
| **6. Outputs**          | Outgoing responses and artifacts  | What status codes, schemas, or files leave the system?                      |
| **7. Error Modes**      | Expected and adversarial failures | What validation, network, or business rule errors must be handled?          |
| **8. Testing Strategy** | Verification mechanics            | What unit, integration, or fuzz tests prove completion?                     |
| **9. Stop Condition**   | Concrete termination gate         | What binary criteria signal that the feature is 100 percent complete?       |

## Execution Workflow

1. **Step 1: Ingest and Validate:** Parse user feature request. Check for conflicting requirements or ambiguous verbs (AP-1, AP-2). If ambiguous, halt and prompt user for clarification.
2. **Step 2: Architecture Alignment:** Inspect existing schemas and architectural boundaries. Confirm whether feature requires schema alterations, new API endpoints, or UI updates.
3. **Step 3: Document PRD Story:** Append structured user story, functional requirements, and non-functional requirements to `context/PRD.md`.
4. **Step 4: Generate Atomic Tasks:** Decompose the feature into numbered items in `context/TASKS.md`. Ensure each item addresses one component and takes no more than one sentence.
5. **Step 5: Define Verification Gate:** Append exact verification commands (for example `npm test`, `cargo check`, `pytest`) to the task definition.
6. **Step 6: Hand Off:** Hand execution authority to `frodo` for atomic coding and `merry` for test-driven verification.

## Output Contract

Every plan-feature run must produce or append the following structure in `context/TASKS.md`:

```markdown
### Feature: [Feature Name]

- Preconditions: [Required state or dependencies]
- Target Modules: [Paths of files to touch]

Tasks:

- [ ] X.1 Create schema migration and entity types in [file path]
- [ ] X.2 Implement core domain logic and validation in [file path]
- [ ] X.3 Implement HTTP route handler and error mapping in [file path]
- [ ] X.4 Write unit tests with 100 percent branch coverage in [test path]
- [ ] X.5 Run full verification gate and confirm all tests pass
```

## Hard Verification Gates

- Stop immediately if any task description contains compound clauses joined by "and also" or "then also".
- Stop immediately if a task lacks an explicit file path target.
- Reject requests that attempt to build frontend and backend in a single atomic task without decomposition.

## Anti-Patterns Prevented

- **AP-1 (Vague task verb):** Eliminates indefinite instructions like "set up auth" by forcing explicit dimension breakdown.
- **AP-2 (Ambiguous ownership):** Enforces single-agent ownership and explicit file boundaries.
- **AP-6 (Monolithic prompt):** Prevents "build-the-whole-thing" prompts from executing without atomic breakdown.
- **AP-28 (No stop condition):** Defines binary pass or fail verification gates for every task item.
- **AP-54 (Compounding context drift):** Anchors all work to `context/PRD.md` and `context/TASKS.md` files.

## Related Skills

- [schema-design.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/architecture/schema-design.md)
- [tdd-runner.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/qa/tdd-runner.md)
- [gandalf.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/gandalf.md)
