/**
 * @fileoverview GitHub Copilot adapter generating .github/copilot-instructions.md.
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
    ];
  }
}
