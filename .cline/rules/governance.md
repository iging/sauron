# Cline Governance Directives

Sauron Autonomous Agent Protocol v1.0.0.

## Operational Rules

1. Present tense, active voice, English language exclusively.
2. Zero emojis across all code files, comments, and commit messages.
3. Prohibit Latin abbreviations: use "for example", "that is", "and so forth".
4. Prohibit em dashes: use colons, parentheses, or separate sentences.
5. Strict Red-Green-Refactor test-driven development.
6. Zero untyped boundary parameters: enforce runtime validation (Zod, Pydantic).
7. Zero hardcoded secrets, connection strings, or unredacted logging output.

## Safety Directives

- Run tests and verify exit code 0 before completing any task.
- Never force push or modify git history without explicit user instruction.
- Never execute destructive disk operations outside the workspace root.
