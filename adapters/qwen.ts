/**
 * @fileoverview Qwen adapter generating .qwen/system.md file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class QwenAdapter implements RuntimeAdapter {
  public readonly id = "qwen";
  public readonly name = "Qwen";
  public readonly targetFiles = [".qwen/system.md"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# Qwen System Prompt : ${context.projectName}`);
    lines.push(`Sauron v${context.version}`);
    lines.push("");
    lines.push("## Coding Axioms");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push("## Sub-Agents Hierarchy");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}): ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Forbidden Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".qwen/system.md",
        content: lines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
