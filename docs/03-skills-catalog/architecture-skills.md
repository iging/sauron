# Architecture Skills

## Folder Structure Advisor

Owner: Aragorn, System Architect. Trigger: /folder-structure-advisor.
Chooses layer, feature, use-case, modular, workspace or progressive-flat organization from
product stage, team size, app surfaces, domain language and stack.
Proposes projects/<name>/context/core-domains/folder-structure.md with a tree and migration
rationale. Creates no application layout. Routes existing-file moves to repo-reorganizer.
Runs as the final proposal step in define-core-domains and define-enterprise-context.
Preserves dependency rules, public APIs, no-empty-folder and project-specific barrel rules.

The advisor starts from sourced industry-standard or tool-enforced layouts, then applies the
chosen generic pattern within those constraints. Its reference distinguishes official layouts
from community conventions and links to their primary sources.
