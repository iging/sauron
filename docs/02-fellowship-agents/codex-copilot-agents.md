# Codex and Copilot Agents

Install native agents with an explicit runtime selection:

```sh
npx sauron-ai init --runtimes=codex,copilot --agents=fellowship --skills=none --yes
```

Use --agents=core for 69 specialists, both for all 78, or none to skip agents.
Codex receives .codex/agents/<id>.toml. Copilot receives .github/agents/<id>.agent.md.
Both remain beta until discovery and behavior are verified in their real tools.

## Codex

Standalone files contain name, description, and developer_instructions. No role registration
or permission changes are added to the parent config. A spec without shell intents disables
features.shell_tool. Models inherit unless agents.models.codex maps the spec's tier.

Codex inherits parent permissions. Agent edit scopes and command limits are instructions,
not enforced tool allowlists or separate sandboxes. Choose parent permissions before delegating.
See [official Codex docs](https://learn.chatgpt.com/docs/agent-configuration/subagents).

## Copilot

Files contain name, description, and an explicit tools list. Reviewers receive read and search,
plus execute only for shell intents. Other toolsets also receive edit. Models inherit unless
agents.models.copilot maps the tier. Tool aliases are portable, but model availability varies.
Path scopes and command limits remain instructions. Shell access is not restricted per command.
See [official Copilot docs](https://docs.github.com/en/copilot/reference/custom-agents-configuration).

Neither target receives Sauron slash command wrappers. Select or ask for a named agent instead.
Existing command installs for Claude Code, OpenCode, and omp keep their formats.

## Existing projects and safety

Saved nativeRuntimes choices remain authoritative. Sync does not add the new targets to an
old saved list. Run init with --runtimes=codex,copilot to opt in, or add those ids to the saved
init.nativeRuntimes list while keeping both runtimes enabled.

Agent files use ConflictManager raw writes and manifest tracking. Existing custom files and
user edits stay intact. Repair recreates missing files. Uninstall keeps edited agents.

## Verify by hand

- Codex: restart a trusted project session and ask it to use gandalf and frodo by name.
- Confirm instructions, configured model, and inherited parent permission behavior.
- Copilot: confirm gandalf and boromir appear in the custom agent picker and can run as subagents.
- Confirm a reviewer has no edit tool, and an agent without shell intents has no execute tool.
- Confirm Samwise asks before other commands and never pushes. This is an instruction limit.
