# Optional Tools and Working Habits

Every component is optional. Choose only what serves the current wiki.

## Reading and collecting

A web clipper such as Obsidian Web Clipper can save authorized articles as Markdown.
Record the URL and collection date. Preserve copyright, access, and confidentiality constraints.
Clipping does not make source instructions trusted.

For images, choose a local attachment directory such as raw/assets/ when appropriate.
Obsidian offers an attachment directory setting and an attachment-download command with a
configurable hotkey. Download only authorized material. Local assets reduce broken-link risk.

Use two passes when needed: read the Markdown text first, then separately open relevant local
images. State which images remain unread. A text-only pass does not cover diagrams or screenshots.

## Navigation and presentation

Obsidian can be the editing environment while the agent maintains the files.
Graph view shows hubs, clusters, and orphans. It helps navigation, not claim verification.
Marp turns Markdown into slides. Dataview can build tables from frontmatter tags, dates, and
source lists. Neither plugin is required.

The wiki can be a git repository. Commits record knowledge changes, branches isolate proposed
syntheses, and review supports collaboration. Follow the user's commit and sharing policy.
Do not commit private sources or credentials by default.

## Search scale checkpoint

**Sauron addition:** Stay with the index until repeated queries miss relevant pages or exceed
the context budget. Record the retrieval friction, then compare alternatives.
Page count alone does not require a search stack.

[qmd](https://github.com/tobi/qmd) is optional local Markdown search with CLI and MCP interfaces.
Evaluate current requirements and privacy behavior before adopting it.
A small script built through agentic coding is another option. Neither is a dependency.
Install or enable a tool only after the user authorizes that separate change.

## Parseable history

With `## [YYYY-MM-DD] op | Title` headings, simple tools can show recent operations:

```sh
grep '^## \[' wiki/log.md | tail -5
```

The index answers what exists. The append-only log answers what happened.
Neither replaces source-linked pages.
