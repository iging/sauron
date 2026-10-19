/**
 * @fileoverview Trae AI IDE adapter generating .trae/rules/project_rules.md.
 * Unverified source: https://www.trae.ai/blog/trae_tutorial_0825
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

const TRAE_RULES_PATH = ".trae/rules/project_rules.md";
const TRAE_SOURCE = "https://www.trae.ai/blog/trae_tutorial_0825";

export class TraeAdapter implements RuntimeAdapter {
  public readonly id = "trae";
  public readonly name = "Trae";
  public readonly targetFiles = [TRAE_RULES_PATH];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`<!-- unverified: ${TRAE_SOURCE} -->`);
    lines.push(`# Trae Project Rules for ${context.projectName}`);
    lines.push(`Configured by Sauron v${context.version}`);
    lines.push("");
    lines.push("## Workspace Governance");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##", context.cavemanMode));
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
        relativePath: TRAE_RULES_PATH,
        content: lines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
