/**
 * @fileoverview Kiro adapter generating .kirorules file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class KiroAdapter implements RuntimeAdapter {
  public readonly id = "kiro";
  public readonly name = "Kiro";
  public readonly targetFiles = [".kirorules"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# .kirorules for ${context.projectName}`);
    lines.push(`Configured by Sauron v${context.version}`);
    lines.push("");
    lines.push("## Rules and Axioms");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push("## Fellowship Sub-Agents");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}): ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Blocked Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".kirorules",
        content: lines.join("\n"),
        format: "text",
      },
    ];
  }
}
