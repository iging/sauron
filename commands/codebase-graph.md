---
description: Generate and inspect an AST codebase knowledge graph with graph.json, graph-report.md, and graph.html
globs: ["**/*.ts", "**/*.js", "**/*.mjs", "**/*.tsx", "**/*.jsx"]
---

# /codebase-graph

Generate or inspect the codebase knowledge graph for the current repository.

## Execution

Execute the native Sauron knowledge graph generator:

```bash
node bin/sauron.mjs graph .
```

## Generated Outputs

1. `.sauron/graph/graph-report.md`: Review module distribution, god files, and circular dependencies.
2. `.sauron/graph/graph.json`: Machine-readable nodes and edges for programmatic queries.
3. `.sauron/graph/graph.html`: Standalone browser visualization.
