/**
 * @fileoverview GitHub Copilot adapter generating the official `.github/` customization scaffold.
 * @see https://code.visualstudio.com/docs/copilot/customization/overview
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

/**
 * Adapter compiling Sauron Intermediate Representation into GitHub Copilot instructions and CLI hooks.
 * Emits `.github/copilot-instructions.md` and schema-compliant `.github/hooks/agent-guard.json`.
 */
export class CopilotAdapter implements RuntimeAdapter {
  /** Runtime identifier for GitHub Copilot. */
  public readonly id = "copilot";
  /** Display name for GitHub Copilot. */
  public readonly name = "GitHub Copilot";
  /** Target files managed by this adapter. */
  public readonly targetFiles = [
    ".github/copilot-instructions.md",
    ".github/hooks/agent-guard.json",
    ".github/instructions/README.md",
    ".github/instructions/sauron.instructions.md",
    ".github/prompts/README.md",
    ".github/agents/README.md",
    ".github/skills/README.md",
  ];

  /**
   * Compiles context into markdown instructions and hook guard configuration.
   *
   * @param context - Universal transpile context containing project facts, agents, and skills.
   * @returns Array of output files ready for safe disk write.
   */
  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(
      `# GitHub Copilot Custom Instructions for ${context.projectName}`,
    );
    lines.push("");
    lines.push(`> Sauron Universal Harness v${context.version}`);
    lines.push("");
    lines.push("## Coding and Architectural Guidelines");
    lines.push("");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##"));
    lines.push("## Fellowship Sub-Agents and Roles");
    lines.push("");
    for (const agent of context.fellowship) {
      lines.push(`- **${agent.name}** (${agent.role}): ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Available Department Skills");
    lines.push("");
    for (const skill of context.skills) {
      lines.push(
        `- \`${skill.triggerCommand}\`: ${skill.name} (${skill.department})`,
      );
    }
    lines.push("");
    lines.push("## Anti-Patterns and Prohibitions");
    lines.push("");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    const hookContent = JSON.stringify(
      {
        version: 1,
        hooks: {
          sessionStart: [
            {
              type: "command",
              bash: "echo 'Sauron Agent Guard active'",
              timeoutSec: 5,
            },
          ],
          preToolUse: [
            {
              type: "command",
              bash: ".claude/hooks/guard.sh",
              timeoutSec: 10,
            },
          ],
        },
      },
      null,
      2,
    );

    return [
      {
        relativePath: ".github/copilot-instructions.md",
        content: lines.join("\n"),
        format: "markdown",
      },
      {
        relativePath: ".github/hooks/agent-guard.json",
        content: `${hookContent}\n`,
        format: "json",
      },
      {
        relativePath: ".github/instructions/sauron.instructions.md",
        content: [
          "---",
          'applyTo: "**"',
          `description: ${JSON.stringify(`Sauron v${context.version} baseline rules for ${context.projectName}`)}`,
          "---",
          "",
          "# Sauron Baseline Rules",
          "",
          ...context.rules.map((rule) => `- ${rule}`),
          "",
        ].join("\n"),
        format: "markdown",
      },
      ...SCAFFOLD_READMES.map((readme) => ({
        relativePath: `${readme.folder}/README.md`,
        content: formatReadme(readme),
        format: "markdown" as const,
      })),
    ];
  }
}

/** Folder README specification for the Copilot customization scaffold. */
interface ScaffoldReadme {
  readonly folder: string;
  readonly title: string;
  readonly purpose: string;
  readonly howToAdd: string;
  readonly format: readonly string[];
  readonly docUrl: string;
}

const SCAFFOLD_READMES: readonly ScaffoldReadme[] = [
  {
    folder: ".github/instructions",
    title: "Copilot Instruction Files",
    purpose:
      "Scoped custom instructions applied automatically to files matching an `applyTo` glob.",
    howToAdd: "Create `<name>.instructions.md` in this folder.",
    format: [
      "---",
      'applyTo: "src/**/*.ts"',
      'description: "TypeScript conventions"',
      "---",
      "",
      "- Use strict mode.",
    ],
    docUrl:
      "https://code.visualstudio.com/docs/copilot/customization/custom-instructions",
  },
  {
    folder: ".github/prompts",
    title: "Copilot Prompt Files",
    purpose: "Reusable prompts invoked in chat with `/<name>`.",
    howToAdd: "Create `<name>.prompt.md` in this folder.",
    format: [
      "---",
      'description: "Generate a unit test"',
      "agent: agent",
      "---",
      "",
      "Write a unit test for ${file}.",
    ],
    docUrl:
      "https://code.visualstudio.com/docs/copilot/customization/prompt-files",
  },
  {
    folder: ".github/agents",
    title: "Copilot Custom Agents",
    purpose:
      "Custom agent personas with their own instructions and tool sets. Replaces deprecated `.chatmode.md` files.",
    howToAdd: "Create `<name>.agent.md` in this folder.",
    format: [
      "---",
      'description: "Plan features without editing code"',
      "tools: ['search', 'fetch']",
      "---",
      "",
      "You are a planning agent.",
    ],
    docUrl:
      "https://code.visualstudio.com/docs/copilot/customization/custom-agents",
  },
  {
    folder: ".github/skills",
    title: "Copilot Agent Skills",
    purpose:
      "Agent Skills loaded on demand. Each skill lives in its own folder with a `SKILL.md`.",
    howToAdd: "Create `<skill-name>/SKILL.md` in this folder.",
    format: [
      "---",
      "name: skill-name",
      'description: "What the skill does and when to use it"',
      "---",
      "",
      "Step-by-step instructions.",
    ],
    docUrl:
      "https://code.visualstudio.com/docs/copilot/customization/agent-skills",
  },
];

/**
 * Renders a folder README describing purpose, usage, format, and docs.
 *
 * @param readme - Folder README specification.
 * @returns Markdown README content.
 */
function formatReadme(readme: ScaffoldReadme): string {
  return [
    `# ${readme.title}`,
    "",
    readme.purpose,
    "",
    "## How to add a file",
    "",
    readme.howToAdd,
    "",
    "## Format",
    "",
    "```markdown",
    ...readme.format,
    "```",
    "",
    `Docs: ${readme.docUrl}`,
    "",
    "> Scaffolded by Sauron.",
    "",
  ].join("\n");
}
