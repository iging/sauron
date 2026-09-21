# Contributing to Sauron AI

Thank you for your interest in contributing to **Sauron AI** — the universal AI coding agent harness and skills ecosystem for 17 AI coding runtimes!

Sauron is a free, local-first, open-source project licensed under MIT and Apache 2.0. We welcome contributions from developers, AI engineers, and open-source practitioners worldwide.

---

## 1. Core Principles & Philosophy

Before contributing, please review our foundational tenets:

- **Local-First & Privacy:** All transpilation, parsing, and rule generation occurs entirely on the developer's local machine with zero external telemetry.
- **Zero-Destructive Operations:** Never overwrite existing user rules or files destructively; changes must pass through the `ConflictManager` to produce timestamped backups.
- **Anti-Pattern Prevention:** All skills, prompts, and agent rules must be audited against the 50 credit-killing anti-patterns documented in [`references/anti-patterns.md`](./references/anti-patterns.md).
- **Spartan & Signal-Dense:** Documentation and agent outputs must be telegraphic, accurate, and free of conversational fluff.

---

## 2. Local Development Setup

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git:** 2.30 or higher

### Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/sauron.git
   cd sauron
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run automated test suites:**
   ```bash
   npm test
   ```
4. **Run documentation integrity check:**
   ```bash
   npm run check-docs
   ```

---

## 3. How to Contribute

### 3.1 Adding a New Skill

All skills in Sauron reside under one of the 9 engineering departments in `skills/`:

- `architecture/`, `backend/`, `database/`, `devops/`, `frontend/`, `quality/`, `security/`, `workflow/`.

To add a new skill:

1. Create a folder under the appropriate department using kebab-case (e.g. `skills/frontend/my-new-skill/`).
2. Copy `skills/_template/SKILL.md` as your starting point.
3. Ensure the YAML frontmatter includes:
   ```yaml
   ---
   name: my-new-skill
   description: High-signal, actionable description of what this skill does.
   department: frontend
   ownerAgent: aragorn
   triggerCommand: /my-new-skill
   antiPatternsPrevented:
     - AP-1
     - AP-4
   ---
   ```
4. Verify your skill against [`skills/workflow/writing-rules/SKILL.md`](./skills/workflow/writing-rules/SKILL.md).
5. Run the validation check:
   ```bash
   npm run check-docs
   ```

### 3.2 Enhancing 17-Runtime Transpilers

Transpilers and adapters live under `core/` and `src/adapters/`.

- Every adapter must generate valid, native rule syntax for its specific runtime (e.g. `.cursorrules`, `CLAUDE.md`, `.windsurfrules`).
- Always run `npm test` to verify that all 17 runtimes generate without regression.

### 3.3 Adding or Updating Commands

CLI commands live in `commands/` and `bin/sauron.mjs`. Commands must adhere to the single-responsibility principle and document trigger syntax, target agent, and verification gates.

---

## 4. Git & Pull Request Workflow

1. **Branch Naming Conventions:**
   - Features: `feature/short-description`
   - Bug fixes: `fix/issue-description`
   - Documentation & Skills: `docs/skill-name` o `skills/department-name`
   - Refactoring: `refactor/subsystem`

2. **Commit Message Format (Conventional Commits):**

   ```text
   feat(skills): add nextjs-app-router skill to frontend
   fix(transpiler): resolve cursorrules multiline indent bug
   docs(readme): update installation guide and context links
   test(core): add unit tests for conflict backup creation
   ```

3. **Submitting a Pull Request:**
   - Push your branch to your fork.
   - Open a PR targeting the `main` branch.
   - In the PR description, explain:
     - What problem this PR solves.
     - Which files or skills were added/modified.
     - Confirmation that `npm test` and `npm run check-docs` both pass.

4. **Add Yourself to `CONTRIBUTORS.md`:**
   - In your PR, feel free to add your name and GitHub handle to [`CONTRIBUTORS.md`](./CONTRIBUTORS.md) under Community Contributors!

---

## 5. Community & Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Treat every fellow contributor with respect and professionalism.
