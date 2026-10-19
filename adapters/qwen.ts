/**
 * @fileoverview Qwen adapter generating QWEN.md and the .qwen/skills/ scaffold.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

/** README describing the `.qwen/skills/` project folder. */
const QWEN_SKILLS_README = [
  "# .qwen/skills/",
  "",
  "> Governed by Sauron. Project skills for Qwen Code.",
  "",
  "<!-- unverified: https://qwenlm.github.io/qwen-code-docs/ (QWEN.md context file and .qwen/skills/ layout not confirmed in official docs) -->",
  "",
  "## Adding a Skill",
  "",
  "Create a folder per skill containing a `SKILL.md` file with `name` and `description` YAML frontmatter, followed by markdown instructions.",
  "",
  "## Context File",
  "",
  "Project-wide instructions live in `QWEN.md` at the repository root, which replaces the legacy `.qwen/system.md`.",
  "",
  "## Official Docs",
  "",
  "- https://qwenlm.github.io/qwen-code-docs/",
  "",
].join("\n");

/** Adapter compiling Sauron context into Qwen Code instructions. */
export class QwenAdapter implements RuntimeAdapter {
  public readonly id = "qwen";
  public readonly name = "Qwen";
  public readonly targetFiles = ["QWEN.md", ".qwen/skills/README.md"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# QWEN.md : ${context.projectName}`);
    lines.push(`Sauron v${context.version}`);
    lines.push("");
    lines.push("## Coding Axioms");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##", context.cavemanMode));
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
        relativePath: "QWEN.md",
        content: lines.join("\n"),
        format: "markdown",
      },
      {
        relativePath: ".qwen/skills/README.md",
        content: QWEN_SKILLS_README,
        format: "markdown",
      },
    ];
  }
}
