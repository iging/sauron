/**
 * @fileoverview Kiro adapter generating .kiro/steering/sauron.md and .kiro/skills/README.md.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

export class KiroAdapter implements RuntimeAdapter {
  public readonly id = "kiro";
  public readonly name = "Kiro";
  public readonly targetFiles = [".kiro/steering/sauron.md", ".kiro/skills/README.md"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push("---");
    lines.push("inclusion: always");
    lines.push("---");
    lines.push("");
    lines.push(`# Sauron Steering for ${context.projectName}`);
    lines.push(`Configured by Sauron v${context.version}`);
    lines.push("");
    lines.push("## Rules and Axioms");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##", context.cavemanMode));
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

    const readme = [
      "# Kiro Skills",
      "",
      `Scaffolded by Sauron v${context.version} for ${context.projectName}.`,
      "",
      "## Purpose",
      "Project-scoped agent skills that Kiro loads on demand.",
      "",
      "## How to add a file",
      "Create one folder per skill containing a `SKILL.md`, e.g. `my-skill/SKILL.md`. Frontmatter requires `name` and `description`, followed by the skill instructions.",
      "",
      "## Notes",
      "Always-on project guidance lives in `.kiro/steering/` (markdown with `inclusion: always | fileMatch | manual` frontmatter).",
      "",
      "Official docs: https://kiro.dev/docs/skills",
      "",
    ];

    return [
      { relativePath: ".kiro/steering/sauron.md", content: lines.join("\n"), format: "markdown" },
      { relativePath: ".kiro/skills/README.md", content: readme.join("\n"), format: "markdown" },
    ];
  }
}
