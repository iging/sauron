# Token Optimization: Caveman Mode

Conversational padding wastes context window space and consumes API credits. In long-running development sessions, pleasantries, tool narration, and verbose prose consume thousands of unnecessary tokens.

Sauron integrates **Caveman Mode**, an automated token optimization and conversational compression engine.

---

## Core Directives

When Caveman Mode activates, the agent follows five strict compression rules:

1. **Remove Pleasantries and Filler**: Drops opening greetings ("Sure, I would be happy to help"), hedging phrases ("it seems like"), and conversational filler ("just", "really", "basically").
2. **Grammar and Brevity**: Permits sentence fragments. Uses short direct synonyms. States findings directly without conversational lead-in.
3. **Zero Tool Narration**: Executes tool calls directly without narrative announcements before or between operations.
4. **Preserve Exact Technical Precision**: Maintains exact code blocks, markdown tables, shell flags, and file paths. Critical logic qualifiers (`not`, `never`, `no`, `only`) are never dropped.
5. **Language Alignment**: Responds in the contributor's language (Tagalog, English, or other), compressing style while preserving technical substance.

---

## Compression Levels

| Level                | Trigger Phrase               | Behavior                                                              | Token Savings |
| -------------------- | ---------------------------- | --------------------------------------------------------------------- | ------------- |
| **Lite**             | `caveman lite`               | Complete sentences. Zero filler words. Dense, informative prose.      | 25% to 35%    |
| **Full** _(Default)_ | `caveman full` or `/caveman` | Drops articles. Allows sentence fragments. Direct tool calls.         | 60% to 75%    |
| **Ultra**            | `caveman ultra`              | Extreme compression. Minimal fragments. Maximum context conservation. | 75% to 85%    |
| **Off**              | `caveman off`                | Deactivates compression and reverts to standard conversational style. | 0%            |

---

## Sub-Skills

Caveman Mode provides four dedicated sub-skills:

- `/caveman-commit`: Generates dense, conventional commit messages directly from `git diff`.
- `/caveman-review`: Generates one-line pull request review comments focused on blockers.
- `/caveman-compress`: Compresses verbose documentation files while preserving technical requirements.
- `/caveman-help`: Displays a quick reference cheat sheet for token optimization.
