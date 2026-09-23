/**
 * @fileoverview CodeBuddy adapter generating .codebuddy/rules.md file.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

export class CodeBuddyAdapter implements RuntimeAdapter {
  public readonly id = "codebuddy";
  public readonly name = "CodeBuddy";
  public readonly targetFiles = [".codebuddy/rules.md"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# CodeBuddy Rules for ${context.projectName}`);
    lines.push(`Configured by Sauron v${context.version}`);
    lines.push("");
    lines.push("## Coding Axioms");
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
        relativePath: ".codebuddy/rules.md",
        content: lines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
