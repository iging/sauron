# Folder Pattern Decision Matrix

Use confirmed evidence, not a numeric score invented from missing facts. A project can combine a repository-level pattern with one application-level pattern when both choices have separate reasons.

## Required inputs

| Input                   | Decision question                                                                    | Evidence                                                  |
| ----------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Product stage           | Which current user stories need code now, and which remain deferred?                 | Approved product requirements and task backlog.           |
| Team size and ownership | Who owns each change path, review boundary, and release decision?                    | Confirmed team map, not headcount alone.                  |
| App surfaces            | Which web, mobile, desktop, API, worker, or CLI surfaces exist and ship separately?  | Approved architecture and deployment decisions.           |
| Domain language         | Which business capabilities and use cases have stable names?                         | Glossary and core domain specifications.                  |
| Stack constraints       | Which source roots, test paths, package boundaries, or generated paths are required? | Named manifests, framework rules, and local agent guides. |

## Compare primary patterns

| Pattern                       | Fits when                                                                                        | Cost and reason to reject                                                                                      | Revisit trigger                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Flat with progressive nesting | A small implementation slice has few files and one clear owner.                                  | Reject when unrelated responsibilities already hide in large files. Do not nest solely for future scale.       | A capability needs several collaborating files or a distinct owner.  |
| Layer-based                   | Technical layers have real shared responsibilities and the team changes them together.           | Feature work crosses several directories. Reject if most changes already follow business capabilities.         | Cross-layer edits repeatedly touch the same use case.                |
| Feature-based                 | Product changes and ownership follow business capabilities.                                      | Shared concerns can become dumping grounds. Reject vague features without an approved domain vocabulary.       | A feature needs a stronger internal boundary or independent release. |
| Screaming or use-case         | The directory names should expose business tasks and the project has stable use cases.           | Trivial CRUD paths gain unnecessary indirection. Reject if the use cases are still uncertain.                  | The team agrees on stable business operations and their boundaries.  |
| Modular with public APIs      | Several modules need explicit dependency contracts and internal implementation isolation.        | More contracts and dependency checks cost maintenance. Reject when there is no consumer or ownership boundary. | Internal imports or cycles create repeated change risk.              |
| Monorepo workspaces           | Multiple real apps or packages need shared ownership, dependency policy, or coordinated changes. | Build, release, and package ownership need explicit policy. Reject when a single app has no package boundary.  | Another surface or package needs its own owner or release path.      |

## Add-ons, not default top-level buckets

- Shared types belong near their owner first. A shared contract module is justified by multiple current consumers and an explicit dependency rule.
- Configuration belongs in the existing framework convention or a named composition boundary. Separate build-time and runtime settings only when their lifecycle differs.
- Tests follow the project's conventions and the modules they verify. Generated code gets a documented boundary and is not manually reorganized.
- A public API is a contract, not a requirement for index.ts. Use explicit modules such as billing/contracts.ts or allowed package exports when barrels are prohibited.

## Invariants

- Domain dependencies point inward where Clean Architecture applies. Path names alone do not enforce the Dependency Rule.
- Every proposed directory has a current responsibility, owner, and first real file. No empty placeholder directories.
- Follow module-organization and the project's import policy. Do not introduce cycles or broad re-export barrels.
- Use monorepo-architecture for workspace ownership, build scope, and release policy.
- For an existing repository, preserve current conventions until an approved migration has import checks, tests, checkpoints, and rollback. Route execution to repo-reorganizer.
