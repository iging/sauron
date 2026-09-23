/**
 * @fileoverview Kimi adapter generating .kimi/prompt.md file.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

export class KimiAdapter implements RuntimeAdapter {
  public readonly id = "kimi";
  public readonly name = "Kimi";
  public readonly targetFiles = [".kimi/prompt.md"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(
      `# Kimi Long-Context System Instructions : ${context.projectName}`,
    );
    lines.push(`Sauron v${context.version}`);
    lines.push("");
    lines.push("## Core Guidelines");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##"));
    lines.push("## Fellowship Structure");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} [${agent.role}] -> ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Enforced Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".kimi/prompt.md",
        content: lines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
