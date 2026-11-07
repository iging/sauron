# Install Profiles and the Claude Code Plugin

## Profiles

A profile is a named set of `init` answers. It skips the questions. Any other flag still wins for
its own field.

```bash
npx sauron-ai init --profile=frontend
npx sauron-ai init --profile=backend --runtimes=claude,cursor
```

| Profile       | Runtimes    | Agents     | Skills                              | Commands |
| :------------ | :---------- | :--------- | :---------------------------------- | :------- |
| `minimal`     | Claude Code | none       | none                                | no       |
| `recommended` | Claude Code | Fellowship | all                                 | yes      |
| `frontend`    | Claude Code | Fellowship | frontend, quality                   | yes      |
| `backend`     | Claude Code | Fellowship | backend, database, devops, security | yes      |
| `full`        | all 20      | both sets  | all                                 | yes      |

Sauron saves the resulting choices in `sauron.config.yaml`, so `sync` reuses them.

## Claude Code plugin

`sauron plugin` writes the Fellowship and specialist agents, the slash commands, and every skill
as one Claude Code plugin, plus a local marketplace that points at it.

```bash
npx sauron-ai plugin --out sauron-plugin
```

Then, inside Claude Code:

```text
/plugin marketplace add ./sauron-plugin
/plugin install sauron@sauron-local
```

Plugin parts are namespaced: `/sauron:gandalf`, `@agent-sauron:frodo`. The folder stays inside the
current folder. A rerun keeps files you changed. `claude plugin validate` passes on the output.
The plugin has no icon yet, which only matters for a listing in the plugin directory.
