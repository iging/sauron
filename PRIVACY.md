# Privacy

Sauron is a command-line tool that runs on your machine. It has no accounts, and the project does not receive your code, prompts, or usage data.

## What the CLI does

- It sends no telemetry and has no analytics.
- It reads and writes files in your workspace.
- Traces, backups, and manifests stay on your machine under `.sauron/`.

## When a network is involved

The CLI makes no network requests of its own. These related actions do use a network:

| Action                                                    | Who receives the request                                        |
| :-------------------------------------------------------- | :-------------------------------------------------------------- |
| Installing or running through `npx`, `pnpm dlx`, or `npm` | Your package registry                                           |
| Running `bin/install.sh` or `bin/install.ps1`             | Your package registry                                           |
| Opening `.sauron/graph/graph.html` in a browser           | Google Fonts and unpkg, which serve its fonts and graph library |
| Using an AI coding tool with Sauron files                 | That tool and its provider, under their own terms               |

Sauron only writes instruction files for AI coding tools. What those tools send, and to whom, is set by each tool.

## Website

The website at <https://sauron-cli.vercel.app> has its own [privacy page](https://sauron-cli.vercel.app/privacy).

## Contact

Open a [GitHub issue](https://github.com/iging/sauron/issues) with privacy questions. See [SECURITY.md](./SECURITY.md) for security reports.
