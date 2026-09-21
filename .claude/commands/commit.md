---
description: Packages atomic git commits following Conventional Commits 1.0.0 specification.
---

Package the current workspace changes into an atomic Conventional Commit:

1. Inspect git status and isolate changes to one logical concern.
2. Format the header line in the imperative mood under 72 characters (`<type>(<scope>): <summary>`).
3. Add explanatory body detailing motivation and architectural context.
4. Document breaking changes explicitly in the header (`!`) and footer (`BREAKING CHANGE:`).
5. Verify tests and linting pass before committing.
