/**
 * @fileoverview Pi adapter generating .pirules file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class PiAdapter implements RuntimeAdapter {
  public readonly id = "pi";
  public readonly name = "Pi";
  public readonly targetFiles = [".pirules"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# .pirules for ${context.projectName}`);
    lines.push(`Governed by Sauron v${context.version}`);
    lines.push("");
    lines.push("## Rules");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push("## Sub-Agents");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}) : ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Blocked Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".pirules",
        content: lines.join("\n"),
        format: "text",
      },
    ];
  }
}
