# Workflow Skills

The Workflow domain houses skills that govern project lifecycles, feature decomposition, engineering loop stages, session handoffs, and career advancement.

---

## Major Workflow Suites

### 1. Autonomous Dev (`autonomous-dev`)

- **Owner**: Frodo
- **Trigger**: `/autonomous-dev`
- **Description**: 8-stage end-to-end development suite governing ideation, workspace isolation, task decomposition, execution, quality testing, debugging, code review, and bootstraping.

### 2. Engineering Loop (`engineering-loop`)

- **Owner**: Frodo
- **Trigger**: `/engineering-loop`
- **Description**: 5-stage engineering loop designed to keep features aligned with architecture.
  - **Stage 1 (`blueprint-session`)**: Mandates pre-coding alignment on terminology, architecture, and major decisions.
  - **Stage 2 (`ui-snapshot-tokens`)**: Extracts design tokens and color palettes directly from visual comps.
  - **Stage 3 (`code-inspection`)**: Audits implementation code line by line against the pre-coding blueprint.
  - **Stage 4 (`context-checkpoint`)**: Saves session state, active decisions, and immediate next steps to disk.
  - **Stage 5 (`failure-triage`)**: Diagnoses complex build failures and runtime bugs.

### 3. Career & Job Search (`career-and-job-search`)

- **Owner**: Samwise
- **Trigger**: `/career-and-job-search`
- **Description**: 4-phase professional workflow covering resume optimization, job targeting, technical interview preparation, and offer negotiation.

### 4. Caveman (`caveman`)

- **Owner**: Legolas
- **Trigger**: `/caveman`
- **Description**: Token conservation engine that compresses agent communication across commit messages, pull request reviews, document compression, and quick help.

---

## Standalone Workflow Skills

| Skill                                       | Owner   | Command                                    | Purpose                                                                             |
| ------------------------------------------- | ------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| **prd-generator**                           | Gandalf | `/prd-generator`                           | Converts product ideas into structured product requirement documents.               |
| **plan-feature**                            | Gandalf | `/plan-feature`                            | Decomposes features into phased implementation plans.                               |
| **project-onboarding-audit**                | Gandalf | `/project-onboarding-audit`                | Audits codebases and generates architecture orientation guides.                     |
| **define-enterprise-context** | Gandalf | `/define-enterprise-context` | Scaffolds standard engineering context files.                                       |
| **write-a-skill**                           | Gandalf | `/write-a-skill`                           | Creates standard SKILL.md documents following the 9-dimension intent model.         |
| **define-core-domains**                     | Gandalf | `/define-core-domains`                     | Defines project-scoped core domain specs, architectural blueprints, and rules.      |
| **handoff**                                 | Samwise | `/handoff`                                 | Packages session context and next steps for team handoffs.                          |
| **repo-reorganizer**                        | Samwise | `/repo-reorganizer`                        | Cleans up and structures directories according to standard patterns.                |
| **spec-reviewer**                           | Legolas | `/spec-reviewer`                           | Audits markdown documentation against writing rules and anti-patterns.              |
| **split-file**                              | Legolas | `/split-file`                              | Refactors large, unwieldy source files into smaller, focused modules.               |
| **prompt-auditor**                          | Legolas | `/prompt-auditor`                          | Evaluates prompts for clarity, constraints, and scope boundaries.                   |
| **evaluate-pr-suggestions**                 | Legolas | `/evaluate-pr-suggestions`                 | Evaluates pull request comments and categorizes actionable changes.                 |
| **radon-mcp**                               | Pippin  | `/radon-mcp`                               | Integrates Model Context Protocol tools to probe components, logs, and screenshots. |
| **adapt-project**                           | Frodo   | `/adapt-project`                           | Converts projects into standardized modular configurations.                         |
