/**
 * @fileoverview Adal adapter generating .adalrules file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class AdalAdapter implements RuntimeAdapter {
  public readonly id = "adal";
  public readonly name = "Adal";
  public readonly targetFiles = [".adalrules"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# .adalrules for ${context.projectName}`);
    lines.push(`Sauron v${context.version}`);
    lines.push("");
    lines.push("## Axioms");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push("## Fellowship");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}): ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Prevented Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".adalrules",
        content: lines.join("\n"),
        format: "text",
      },
    ];
  }
}
