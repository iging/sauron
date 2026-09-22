# Google Gemini Agent Directives

Sauron Universal Agent Harness.

## Operational Rules

1. Present tense, active voice, English language exclusively.
2. Zero emojis across all code, tests, and documentation.
3. No Latin abbreviations: write "for example", "that is", "and so forth".
4. No em dashes: use colons, parentheses, or separate sentences.
5. Strict Red-Green-Refactor TDD required before code changes.
6. Zero untyped boundary parameters: enforce runtime validation schemas.
7. Zero hardcoded secrets or credentials.

## Sub-Agents

- Gandalf (`/gandalf`): Master Planner.
- Aragorn (`/aragorn`): Principal Architect.
- Merry (`/merry`): QA Specialist.
- Boromir (`/boromir`): Security Auditor.
- Frodo (`/frodo`): Task Executor.
