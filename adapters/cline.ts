/**
 * @fileoverview Cline adapter generating .clinerules file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class ClineAdapter implements RuntimeAdapter {
  public readonly id = "cline";
  public readonly name = "Cline";
  public readonly targetFiles = [".clinerules"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# .clinerules for ${context.projectName}`);
    lines.push(`Sauron Autonomous Agent Protocol v${context.version}`);
    lines.push("");
    lines.push("## Autonomous Operating Directives");
    for (const rule of context.rules) {
      lines.push(`1. ${rule}`);
    }
    lines.push("");
    lines.push("## Fellowship Sub-Agents Delegation Model");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}): ${agent.slashCommand}`);
      lines.push(
        `  Authority: can modify [${agent.authority.canModify.join(", ")}], must not modify [${agent.authority.mustNotModify.join(", ")}]`,
      );
    }
    lines.push("");
    lines.push("## Verification Gate Protocol");
    lines.push(
      "- Run tests and verify exit code 0 before marking any task complete.",
    );
    lines.push("- Never commit without passing linting and type checks.");
    lines.push("- Never expose credentials or secret keys.");
    lines.push("");
    lines.push("## Prohibited Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".clinerules",
        content: lines.join("\n"),
        format: "text",
      },
    ];
  }
}
