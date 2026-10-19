/**
 * @fileoverview OpenCode adapter generating the official .opencode/ scaffold and opencode.json.
 * Project instructions live in AGENTS.md, emitted by the shared AGENTS.md adapter.
 */

import type { RuntimeAdapter, TranspileContext, TranspileOutput } from "./types.js";

interface FolderSpec {
  readonly dir: string;
  readonly title: string;
  readonly purpose: string;
  readonly howTo: string;
  readonly docUrl: string;
}

const FOLDERS: readonly FolderSpec[] = [
  {
    dir: ".opencode/agents",
    title: "OpenCode Agents",
    purpose: "Project-scoped custom agents (primary agents and subagents).",
    howTo:
      "Add one markdown file per agent, e.g. `reviewer.md`. The filename is the agent name. Use YAML frontmatter (`description`, `mode: primary | subagent`, `model`, `tools`) followed by the agent prompt.",
    docUrl: "https://opencode.ai/docs/agents",
  },
  {
    dir: ".opencode/commands",
    title: "OpenCode Commands",
    purpose: "Project-scoped custom slash commands.",
    howTo:
      "Add one markdown file per command, e.g. `test.md` becomes `/test`. Use YAML frontmatter (`description`, `agent`, `model`) followed by the prompt template. `$ARGUMENTS` expands to the command arguments.",
    docUrl: "https://opencode.ai/docs/commands",
  },
  {
    dir: ".opencode/skills",
    title: "OpenCode Skills",
    purpose: "Project-scoped agent skills loaded on demand.",
    howTo:
      "Add one folder per skill containing a `SKILL.md`, e.g. `my-skill/SKILL.md`. Frontmatter requires `name` (matching the folder) and `description`.",
    docUrl: "https://opencode.ai/docs/skills",
  },
];

export class OpenCodeAdapter implements RuntimeAdapter {
  public readonly id = "opencode";
  public readonly name = "OpenCode";
  public readonly targetFiles = ["opencode.json", ...FOLDERS.map((f) => `${f.dir}/README.md`)];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const outputs: TranspileOutput[] = [
      {
        relativePath: "opencode.json",
        content: `${JSON.stringify({ $schema: "https://opencode.ai/config.json" }, null, 2)}\n`,
        format: "json",
      },
    ];
    for (const folder of FOLDERS) {
      const lines = [
        `# ${folder.title}`,
        "",
        `Scaffolded by Sauron v${context.version} for ${context.projectName}.`,
        "",
        "## Purpose",
        folder.purpose,
        "",
        "## How to add a file",
        folder.howTo,
        "",
        "## Notes",
        "OpenCode reads project instructions from `AGENTS.md` at the repository root and config from `opencode.json`.",
        "",
        `Official docs: ${folder.docUrl}`,
        "",
      ];
      outputs.push({
        relativePath: `${folder.dir}/README.md`,
        content: lines.join("\n"),
        format: "markdown",
      });
    }
    return outputs;
  }
}
