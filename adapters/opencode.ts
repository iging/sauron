/**
 * @fileoverview OpenCode adapter generating .opencode/instructions.md file.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

export class OpenCodeAdapter implements RuntimeAdapter {
  public readonly id = "opencode";
  public readonly name = "OpenCode";
  public readonly targetFiles = [".opencode/instructions.md"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# OpenCode Governance Instructions : ${context.projectName}`);
    lines.push(`Sauron v${context.version}`);
    lines.push("");
    lines.push("## Core Principles");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##"));
    lines.push("## Fellowship Sub-Agents");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}): ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Prohibited Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".opencode/instructions.md",
        content: lines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
