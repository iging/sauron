/**
 * @fileoverview CodeBuddy adapter generating .codebuddy/rules/sauron.md and .codebuddy/skills/README.md.
 * CodeBuddy reads CODEBUDDY.md (falling back to AGENTS.md); project rules live in
 * .codebuddy/rules/ and skills in .codebuddy/skills/<name>/SKILL.md.
 * @see https://www.tencentcloud.com/document/product/1256/77282
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
  public readonly targetFiles = [
    ".codebuddy/rules/sauron.md",
    ".codebuddy/skills/README.md",
  ];

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
        relativePath: ".codebuddy/rules/sauron.md",
        content: lines.join("\n"),
        format: "markdown",
      },
      {
        relativePath: ".codebuddy/skills/README.md",
        content: [
          "# CodeBuddy Skills",
          `Managed by Sauron v${context.version} for ${context.projectName}.`,
          "",
          "Each skill lives in its own folder: `.codebuddy/skills/<name>/SKILL.md`.",
          "Start SKILL.md with YAML frontmatter (`name`, `description`), then the instructions.",
          "",
        ].join("\n"),
        format: "markdown",
      },
    ];
  }
}
