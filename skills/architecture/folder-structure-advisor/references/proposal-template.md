# Folder Structure Proposal: <project-name>

Status: Proposed, pending human review.
Target: projects/<project-name>/context/core-domains/folder-structure.md
Scope: This document proposes a tree. It creates no application folders or files.

## Input evidence

| Input                             | Confirmed value or unknown | Source path or answer |
| --------------------------------- | -------------------------- | --------------------- |
| Product stage and current stories |                            |                       |
| Team size and ownership           |                            |                       |
| App surfaces and release paths    |                            |                       |
| Domain language and use cases     |                            |                       |
| Stack and local constraints       |                            |                       |

## Chosen pattern and alternatives

Primary pattern:
Repository/application distinction, if needed:
Reasons tied to the evidence:

| Alternative | Reason not chosen | Trade-off retained |
| ----------- | ----------------- | ------------------ |
|             |                   |                    |
|             |                   |                    |

Revisit trigger:

## Proposed tree, text only

Show only directories with a current responsibility and concrete initial files. Mark an existing path separately from a proposed path. Do not add index.ts or barrel files where forbidden.

```text
<project-root>/
  <current-responsibility>/
    <first-concrete-file>
```

| Directory or module | Purpose | Owner | First real file |
| ------------------- | ------- | ----- | --------------- |
|                     |         |       |                 |

## Dependency and shared-code rules

Allowed dependency directions:
Public API modules or package exports:
Shared types and their current consumers:
Build/runtime configuration placement:
Tests and generated-code boundaries:
Checks for inward dependencies, cycles, empty placeholders, and project import rules:

## Adoption path

Greenfield first implementation slice, or brownfield migration steps:

| Checkpoint | Existing path | Proposed path | Import and behavior checks | Rollback |
| ---------- | ------------- | ------------- | -------------------------- | -------- |
|            |               |               |                            |          |

No migration runs here. After human approval, hand actual moves to repo-reorganizer.

## Validation and open decisions

Evidence-backed choices checked:
Unknowns affecting the decision:
Human reviewer and review state:
Next authorized action:
