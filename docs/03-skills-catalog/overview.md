# Skills Catalog Overview

Sauron equips AI coding agents with a structured library of modular skills organized across 8 functional domains. Each skill adheres to the Everything Claude Code (ECC) specification and Linux Foundation Agentic AI standards.

---

## The 8 Functional Domains

Sauron divides engineering capabilities into these dedicated domains:

1. **Workflow**: End-to-end development lifecycles, 5-stage engineering loops, PRD generation, task planning, and session checkpoints.
2. **Frontend**: Design engineering, aesthetic tuning, visual token extraction, UI component principles, and accessibility audits.
3. **Backend**: API route scaffolding, runtime validation, caching strategies, and server-side language conventions.
4. **Database**: Zero-downtime database schema migrations, query optimization, and type synchronization.
5. **Quality**: Automated unit, integration, and E2E test generation, testing pyramid discipline, and error handling.
6. **Security**: OWASP vulnerability audits, Agent Guard execution shields, and incident response runbooks.
7. **DevOps**: CI/CD pipelines, Docker containerization, performance tuning, and cross-platform shell scripting.
8. **Architecture**: Clean architecture enforcement, API design, and architecture decision records.

---

## SKILL.md Standard Format

Every skill is a dedicated folder containing a `SKILL.md` instruction file. Each file contains structured YAML frontmatter and normative markdown sections:

```markdown
---
name: my-skill
description: Plain-text summary of when to execute this skill.
department: workflow
ownerAgent: frodo
triggerCommand: /my-skill
antiPatternsPrevented:
  - AP-1
  - AP-6
---

# My Skill Title

## 0. Identity

- Role, authority, and boundaries.

## 1. Intent (9 Dimensions)

- Task, target tool, format, constraints, inputs, context, audience, success criteria, examples.

## 2. Trigger Matrix

- Table defining when this skill fires and when it refuses execution.

## 3. Execution Workflow

- Step-by-step numbered protocol with inputs, stop conditions, and validation gates.

## 4. Anti-Patterns Enforced

- Explicit mechanisms preventing specific anti-patterns.
```

---

## Triggering Skills

You can trigger skills in three ways:

1. **Slash Commands**: Type the registered slash command (for example `/engineering-loop`, `/database-migration`, `/caveman`).
2. **Agent Persona Delegation**: Ask a Fellowship agent to handle the task (for example "@gandalf create a PRD for user authentication").
3. **Natural Language Triggers**: Provide a prompt matching the intent defined in the skill's Trigger Matrix.
