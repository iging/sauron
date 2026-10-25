/**
 * @fileoverview omp (oh-my-pi) adapter generating the native .omp/ scaffold and .omp/mcp.json.
 * Project instructions live in AGENTS.md, emitted by the shared AGENTS.md adapter.
 * Source: https://omp.sh/docs
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

interface FolderSpec {
  readonly dir: string;
  readonly title: string;
  readonly purpose: string;
  readonly howTo: string;
  readonly docUrl: string;
}

const OMP_MCP = ".omp/mcp.json";

const FOLDERS: readonly FolderSpec[] = [
  {
    dir: ".omp/skills",
    title: "omp Skills",
    purpose:
      "Project-scoped skills loaded on demand. omp also discovers `.agents/skills/` and `.claude/skills/`, so Sauron skills installed there are picked up without a copy.",
    howTo:
      "Add one folder per skill containing a `SKILL.md`, e.g. `my-skill/SKILL.md`. Discovery is one level deep. Frontmatter requires `description`; `name` and `hide` are optional. Invoke explicitly with `/skill:<name>`.",
    docUrl: "https://omp.sh/docs/skills",
  },
  {
    dir: ".omp/prompts",
    title: "omp Prompt Templates",
    purpose: "Project-scoped slash commands.",
    howTo:
      "Add one markdown file per command, e.g. `review-change.md` becomes `/review-change`. Only the `description` frontmatter field is used. `$ARGUMENTS` expands to all arguments and `$1`, `$2` to positional ones.",
    docUrl: "https://omp.sh/docs/prompt-templates",
  },
  {
    dir: ".omp/agents",
    title: "omp Subagents",
    purpose: "Project-scoped subagents for the task tool.",
    howTo:
      "Add one markdown file per agent, e.g. `api-reviewer.md`. Frontmatter requires `name` and `description`; optional fields include `tools` (list), `model`, `thinking-level`, `spawns`, and `autoload-skills`. The body is the agent prompt.",
    docUrl: "https://omp.sh/docs/subagent-authoring",
  },
];

export class OmpAdapter implements RuntimeAdapter {
  public readonly id = "omp";
  public readonly name = "omp (oh-my-pi)";
  public readonly targetFiles = [
    OMP_MCP,
    ...FOLDERS.map((f) => `${f.dir}/README.md`),
  ];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const outputs: TranspileOutput[] = [
      {
        relativePath: OMP_MCP,
        content: `${JSON.stringify({ mcpServers: {} }, null, 2)}\n`,
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
        "omp reads project instructions from `AGENTS.md` at the repository root and MCP servers from `.omp/mcp.json` (docs: https://omp.sh/docs/mcp).",
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
