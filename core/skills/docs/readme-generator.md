---
id: readme-generator
name: README Specification and Documentation Generator
department: documentation
owner_agent: gandalf
trigger_command: /readme-gen
version: 1.0.0
---

# README Specification and Documentation Generator

Generate crystal-clear, structured, and developer-focused repository README documentation. Deliver immediate value comprehension, verifiable quickstart sequences, architectural diagrams, sandboxing security notices, and licensing transparency.

## When to Activate

- Initializing repository README for greenfield projects.
- Updating documentation following major architecture refactors or new releases.
- Synchronizing CLI flags, runtime options, and environment variables with active code.
- Standardizing open-source repository documentation for public launch.

## Core Intent and Authority

- **Owner Agent:** `gandalf` (Master Planner and Strategy Guide).
- **Authority Boundary:** Owns root `README.md` and top-level user onboarding documents. Ensures technical accuracy and forbids marketing fluff or vague claims.
- **Execution Rule:** Every terminal command listed in a README must execute successfully in a clean container without undocumented steps.

## Canonical README Section Structure

A compliant `README.md` must follow this sequential section hierarchy:

1. **Project Title and Tagline:** State the project name and a single-sentence value proposition.
2. **Key Capabilities:** Enumerate 3 to 5 concrete technical capabilities without marketing jargon.
3. **Architecture Overview:** Provide an ASCII or Mermaid diagram illustrating system components and data flow.
4. **Prerequisites:** List required runtime versions, package managers, and system dependencies.
5. **Quickstart / Installation:** Provide copy-pasteable terminal commands to clone, install, configure, and execute.
6. **Configuration Reference:** Detail environment variables and configuration files with defaults.
7. **Security and Sandboxing Notice:** Explain execution boundaries, safe modes, and vulnerability reporting procedures.
8. **Contributing and License:** Link to contribution guidelines and the governing software license.

## Generation Standard Template

```markdown
# [Project Name]

> [Single-sentence technical value proposition explaining what the project does]

## Overview

[Detailed 2-3 paragraph explanation of the system, problem domain, and architectural approach]

## Architecture

\`\`\`mermaid
flowchart LR
Client[Client App] --> API[API Gateway]
API --> Service[Core Engine]
Service --> DB[(Database)]
\`\`\`

## Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

## Quickstart

\`\`\`bash

# 1. Clone repository

git clone https://github.com/[owner]/[repo].git
cd [repo]

# 2. Install dependencies

npm ci

# 3. Configure environment

cp .env.example .env

# 4. Start development server

npm run dev
\`\`\`

## Security and Sandboxing

[Explain permissions, network isolation, and credential handling policies]

## License

Distributed under the [License Name] license. See [LICENSE](LICENSE) for details.
```

## Hard Verification Gates

- Prohibit emojis across all headers, bullet points, and code comments.
- Verify that every listed shell command passes when run in a clean environment.
- Reject any README that omits the Prerequisites or License sections.
- Ensure all relative file links resolve to existing files in the repository.

## Anti-Patterns Prevented

- **AP-1 (Vague task verb):** Eliminates vague documentation by mandating explicit step-by-step commands.
- **AP-27 (Missing setup instructions):** Prevents broken onboarding by validating prerequisites and setup commands.
- **AP-46 (Outdated documentation):** Synchronizes README instructions with current configuration schemas and scripts.

## Related Skills

- [api-doc-gen.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/docs/api-doc-gen.md)
- [gandalf.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/gandalf.md)
- [plan-feature.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/architecture/plan-feature.md)
