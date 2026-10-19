/**
 * @fileoverview Claude Code adapter generating CLAUDE.md adhering to Anthropic guidelines.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

/** Official documentation for the `.claude/` directory layout. */
const CLAUDE_DIRECTORY_DOCS = "https://code.claude.com/docs/en/claude-directory";

/** Describes one scaffold folder under `.claude/`. */
interface ClaudeFolder {
  readonly name: string;
  readonly purpose: string;
  readonly howToAdd: string;
  readonly format: string;
}

/** Officially documented `.claude/` subfolders emitted as scaffolds. */
const CLAUDE_FOLDERS: readonly ClaudeFolder[] = [
  {
    name: "rules",
    purpose: "Modular project instructions loaded alongside `CLAUDE.md`, optionally scoped to file paths.",
    howToAdd: "Create `.claude/rules/<topic>.md`, one topic per file.",
    format: "Markdown. Optional YAML frontmatter `paths:` (list of globs) limits when the rule loads.",
  },
  {
    name: "skills",
    purpose: "Reusable skills Claude loads on demand or via `/<skill-name>`. Skills replace the legacy `.claude/commands/` folder.",
    howToAdd: "Create `.claude/skills/<skill-name>/SKILL.md` plus any supporting files in that folder.",
    format: "`SKILL.md` with YAML frontmatter `name` and `description`, followed by Markdown instructions.",
  },
  {
    name: "agents",
    purpose: "Project subagents with their own system prompt, tools, and model.",
    howToAdd: "Create `.claude/agents/<agent-name>.md`.",
    format: "Markdown with YAML frontmatter `name`, `description`, optional `tools` and `model`; body is the system prompt.",
  },
  {
    name: "workflows",
    purpose: "Multi-step workflow definitions shared with the team.",
    howToAdd: "Create `.claude/workflows/<workflow-name>.md`.",
    format: "Markdown describing the steps; see the official docs for supported frontmatter.",
  },
  {
    name: "output-styles",
    purpose: "Custom output styles that change how Claude responds.",
    howToAdd: "Create `.claude/output-styles/<style-name>.md`.",
    format: "Markdown with YAML frontmatter `name` and `description`; body is the style prompt.",
  },
  {
    name: "agent-memory",
    purpose: "Persistent memory files written by subagents across sessions.",
    howToAdd: "Usually managed by Claude; add `.md` notes only when seeding memory deliberately.",
    format: "Plain Markdown.",
  },
  {
    name: "docs",
    purpose: "Reference documents Claude can read on demand without loading them into every session.",
    howToAdd: "Add Markdown files and reference them from `CLAUDE.md` or rules with `@.claude/docs/<file>.md`.",
    format: "Plain Markdown.",
  },
];

/**
 * Renders a scaffold folder README.
 *
 * @param folder - Folder metadata.
 * @returns README markdown.
 */
function renderFolderReadme(folder: ClaudeFolder): string {
  return [
    `# .claude/${folder.name}/`,
    "",
    "> Managed by Sauron.",
    "",
    "## Purpose",
    "",
    folder.purpose,
    "",
    "## How to add a file",
    "",
    folder.howToAdd,
    "",
    "## File format",
    "",
    folder.format,
    "",
    "## Official docs",
    "",
    CLAUDE_DIRECTORY_DOCS,
    "",
  ].join("\n");
}

/**
 * Renders the `.claude/README.md` folder map.
 *
 * @returns README markdown.
 */
function renderRootReadme(): string {
  return [
    "# .claude/",
    "",
    "> Managed by Sauron. Project-level Claude Code configuration.",
    "",
    "## Folder map",
    "",
    "- `settings.json`: shared project settings (permissions, hooks, env).",
    ...CLAUDE_FOLDERS.map((f) => `- \`${f.name}/\`: ${f.purpose}`),
    "",
    "Project instructions live in `CLAUDE.md` at the repository root. MCP servers go in `.mcp.json` at the root.",
    "",
    "## Legacy",
    "",
    "`.claude/commands/` is the older slash-command format. It still works, and Sauron installs its commands there; for new workflows prefer `.claude/skills/<name>/SKILL.md`.",
    "",
    "## Official docs",
    "",
    CLAUDE_DIRECTORY_DOCS,
    "",
  ].join("\n");
}

/**
 * Adapter compiling Sauron Intermediate Representation into Anthropic Claude Code instructions.
 * Emits `CLAUDE.md` following official Anthropic best practices.
 */
export class ClaudeAdapter implements RuntimeAdapter {
  /** Runtime identifier for Claude Code. */
  public readonly id = "claude";
  /** Display name for Claude Code. */
  public readonly name = "Claude Code";
  /** Target files managed by this adapter. */
  public readonly targetFiles = [
    "CLAUDE.md",
    ".claude/README.md",
    ".claude/settings.json",
    ".claude/output-styles/caveman.md",
    ...CLAUDE_FOLDERS.map((folder) => `.claude/${folder.name}/README.md`),
  ];

  /**
   * Compiles context into CLAUDE.md markdown instructions.
   *
   * @param context - Universal transpile context containing project facts, agents, and skills.
   * @returns Array containing CLAUDE.md output.
   */
  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# CLAUDE.md`);
    lines.push("");
    lines.push(
      `> Managed by Sauron v${context.version}. Persistent instruction manual for Claude Code.`,
    );
    lines.push("");
    lines.push("## Where Things Live");
    lines.push("");
    lines.push(
      "- Skills: `.claude/skills/` (invoke with `/<skill-name>`). Shared copy for other tools: `.agents/skills/`.",
    );
    lines.push(
      "- Subagents: `.claude/agents/` (invoke with `@<agent-id>` or let Claude delegate).",
    );
    lines.push("- Slash commands: `.claude/commands/`.");
    lines.push("- Anti-patterns reference: `.agents/anti-patterns.md`.");
    lines.push(
      "- Add your own project notes (build commands, architecture) outside the Sauron block in this file.",
    );
    lines.push("");
    lines.push("## Code Style & Conventions");
    lines.push("");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    const install = context.claudeInstall ?? { agents: "fellowship", commands: true };
    const fellowshipInstalled = install.agents === "fellowship" || install.agents === "both";
    lines.push("## Fellowship Sub-Agents");
    lines.push("");
    if (fellowshipInstalled) {
      for (const agent of context.fellowship) {
        const id = agent.slashCommand.replace(/^\//, "");
        const invoke = install.commands ? `\`@${id}\` or \`${agent.slashCommand}\`` : `\`@${id}\``;
        lines.push(`- **${agent.name}** (${invoke}): ${agent.role}`);
      }
    } else {
      lines.push(
        "- Not installed in this project. Add them with `npx sauron-ai init --agents=fellowship`.",
      );
    }
    if (install.agents === "core" || install.agents === "both") {
      lines.push(
        "- Specialist subagents are installed in `.claude/agents/`. Invoke one with `@<agent-id>`.",
      );
    }
    lines.push("");
    lines.push(...formatCavemanSection("##", context.cavemanMode));

    const cavemanOn = (context.cavemanMode ?? "full") !== "off";
    const settings: Record<string, unknown> = {
      $schema: "https://json.schemastore.org/claude-code-settings.json",
      ...(cavemanOn ? { outputStyle: "Caveman" } : {}),
    };
    const outputStyle: TranspileOutput[] = cavemanOn
      ? [
          {
            relativePath: ".claude/output-styles/caveman.md",
            content: [
              "---",
              "name: Caveman",
              `description: Terse replies at tier ${context.cavemanMode ?? "full"}. Code, paths, and commands stay verbatim.`,
              "keep-coding-instructions: true",
              "---",
              "",
              ...formatCavemanSection("##", context.cavemanMode),
            ].join("\n"),
            format: "markdown",
          },
        ]
      : [];

    return [
      {
        relativePath: "CLAUDE.md",
        content: lines.join("\n"),
        format: "markdown",
      },
      {
        relativePath: ".claude/README.md",
        content: renderRootReadme(),
        format: "markdown",
      },
      {
        relativePath: ".claude/settings.json",
        content: `${JSON.stringify(settings, null, 2)}\n`,
        format: "json",
      },
      ...outputStyle,
      ...CLAUDE_FOLDERS.map(
        (folder): TranspileOutput => ({
          relativePath: `.claude/${folder.name}/README.md`,
          content: renderFolderReadme(folder),
          format: "markdown",
        }),
      ),
    ];
  }
}
