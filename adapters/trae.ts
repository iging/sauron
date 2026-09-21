/**
 * @fileoverview Trae AI IDE adapter generating .traerules file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class TraeAdapter implements RuntimeAdapter {
  public readonly id = "trae";
  public readonly name = "Trae";
  public readonly targetFiles = [".traerules"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# .traerules for ${context.projectName}`);
    lines.push(`Configured by Sauron v${context.version}`);
    lines.push("");
    lines.push("## Workspace Governance");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push("## Fellowship Sub-Agents Context");
    for (const agent of context.fellowship) {
      lines.push(`- ${agent.name} (${agent.role}): ${agent.slashCommand}`);
    }
    lines.push("");
    lines.push("## Registered Skill Commands");
    for (const skill of context.skills) {
      lines.push(`- ${skill.triggerCommand} : ${skill.name}`);
    }
    lines.push("");
    lines.push("## Prohibited Anti-Patterns");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("");

    return [
      {
        relativePath: ".traerules",
        content: lines.join("\n"),
        format: "text",
      },
    ];
  }
}
