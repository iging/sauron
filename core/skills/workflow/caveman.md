---
id: caveman
name: Caveman Token Optimization
department: workflow
owner_agent: legolas
trigger_command: /caveman
version: 1.0.0
---

# Caveman Token Optimization

Output token compression suite engineered for AI coding agents, reducing conversational padding while preserving code and technical precision.

## When to Activate

- Invoked with `/caveman`, `/caveman lite`, `/caveman full`, or `/caveman ultra`.
- Long-running autonomous sessions where context window limits and token conservation are critical.
- Generating dense pull request reviews, compact commit messages, or terse status summaries.
- Contributor requests deactivation via `/caveman off` to restore standard conversational mode.

## Core Intent and Authority

- **Owner Agent:** `legolas` (Precision Linter and Syntax Hunter).
- **Authority Boundary:** Owns agent response formatting and token density policy. Never mutates production code structure without authorization.
- **Execution Rule:** Strip conversational filler, pleasantries, and tool narration while preserving code blocks, file paths, commands, status codes, and boolean logic qualifiers (`not`, `never`, `no`) completely intact.

## Compression Tiers

1. **Lite (`/caveman lite`):** Complete sentences, zero filler words or pleasantries.
2. **Full (`/caveman` or `/caveman full`):** Sentence fragments, dropped articles, direct tool execution without pre-announcement.
3. **Ultra (`/caveman ultra`):** Bare fragments, single-word status statements when sufficient. Example: `tests pass. commit created.`
4. **Off (`/caveman off`):** Restore normal conversational style.

## Hard Preservation Constraints

- **Never** compress or alter code blocks, diffs, configuration files, or shell syntax.
- **Never** drop negative qualifiers (`not`, `never`, `no`, `forbidden`).
- **Never** truncate file paths, URLs, or symbol names.
