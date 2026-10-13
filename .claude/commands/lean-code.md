---
description: Checks a seven-rung reuse ladder before writing code, or reviews a diff or folder for unnecessary code.
---

Apply the Sauron lean-code skill at `skills/workflow/lean-code/SKILL.md` to: $ARGUMENTS

1. No argument or a coding task: build mode. Read the target file, its neighbors, and the dependency manifest first. Give each requirement a ladder rung before writing.
2. `review`: check the current diff against the review checks. Report findings. Change nothing.
3. `audit <dir>`: check one directory. Report at most 15 candidates. Delete nothing.
4. `debt`: return the ledger of deferred items and deliberate shortcuts from this session.
5. `lite`, `full`, `ultra`: set intensity. `off`: end the mode.
6. Never cut validation, security, data safety, accessibility, or tests.
7. End build mode with the Lean Report table.
