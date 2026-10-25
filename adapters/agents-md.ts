/**
 * @fileoverview Shared AGENTS.md core adapter.
 *
 * Root `AGENTS.md` is the cross-tool instruction standard read by Codex, Cursor,
 * GitHub Copilot, Windsurf, Cline, OpenCode, Kiro, Zed, CodeBuddy, Pi, and omp.
 * Also emits the shared `.agents/skills/` scaffold README and the
 * `.agents/anti-patterns.md` reference when the source document is available.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

/** True when a non-empty anti-patterns reference document was loaded. */
function hasAntiPatternsDoc(
  context: TranspileContext,
): context is TranspileContext & { antiPatternsDoc: string } {
  return (context.antiPatternsDoc ?? "").trim().length > 0;
}

/**
 * Adapter compiling Sauron Intermediate Representation into the shared
 * AGENTS.md standard plus the `.agents/` folder scaffold.
 */
export class AgentsMdAdapter implements RuntimeAdapter {
  /** Runtime identifier for the shared AGENTS.md core. */
  public readonly id = "agents-md";
  /** Display name for the shared AGENTS.md core. */
  public readonly name = "AGENTS.md (shared)";
  /** Target files managed by this adapter. */
  public readonly targetFiles = [
    "AGENTS.md",
    ".agents/skills/README.md",
    ".agents/anti-patterns.md",
  ];

  /**
   * Compiles context into AGENTS.md, the skills README, and the anti-patterns reference.
   *
   * @param context - Universal transpile context.
   * @returns Output artifacts; `.agents/anti-patterns.md` is omitted when no source doc is loaded.
   */
  public transpile(context: TranspileContext): TranspileOutput[] {
    const outputs: TranspileOutput[] = [
      {
        relativePath: "AGENTS.md",
        content: this.renderAgentsMd(context),
        format: "markdown",
      },
      {
        relativePath: ".agents/skills/README.md",
        content: this.renderSkillsReadme(),
        format: "markdown",
      },
    ];
    if (hasAntiPatternsDoc(context)) {
      outputs.push({
        relativePath: ".agents/anti-patterns.md",
        content: `<!-- Managed by Sauron v${context.version} from references/anti-patterns.md. -->\n\n${context.antiPatternsDoc}`,
        format: "markdown",
      });
    }
    return outputs;
  }

  private renderAgentsMd(context: TranspileContext): string {
    const lines: string[] = [];
    lines.push("<!--");
    lines.push(
      "  AGENTS.md: shared agent instructions standard (https://agents.md).",
    );
    lines.push(
      "  Read by Codex, Cursor, GitHub Copilot, Windsurf, Cline, OpenCode, Kiro, Zed, CodeBuddy, Pi, and omp.",
    );
    lines.push("-->");
    lines.push("");
    lines.push("# AGENTS.md");
    lines.push("");
    lines.push(
      `> Governed by Sauron v${context.version}. Shared instructions for every AGENTS.md-aware coding agent.`,
    );
    lines.push("");
    lines.push("## Project Overview");
    lines.push("");
    lines.push(
      context.projectDescription ||
        "Universal AI agent workspace governed by Sauron.",
    );
    lines.push("");
    lines.push("## Essential Commands");
    lines.push("");
    lines.push("- Build: `npm run build`");
    lines.push("- Test All: `npm test`");
    lines.push("- Typecheck: `npx tsc --noEmit`");
    lines.push("");
    lines.push("## Engineering Rules");
    lines.push("");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##", context.cavemanMode));
    lines.push("## Fellowship Sub-Agents");
    lines.push("");
    for (const agent of context.fellowship) {
      lines.push(
        `- **${agent.name}** (\`${agent.slashCommand}\`): ${agent.role}`,
      );
    }
    lines.push("");
    lines.push("## Anti-Pattern Guardrails");
    lines.push("");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    if (hasAntiPatternsDoc(context)) {
      lines.push(
        "- Full catalog: see `.agents/anti-patterns.md` before planning non-trivial work.",
      );
    }
    lines.push("");
    lines.push("## Skills");
    lines.push("");
    lines.push(
      "- Shared Agent Skills live in `.agents/skills/<name>/SKILL.md`. See `.agents/skills/README.md`.",
    );
    lines.push("");
    return lines.join("\n");
  }

  private renderSkillsReadme(): string {
    return [
      "# .agents/skills",
      "",
      "Shared Agent Skills folder (https://agentskills.io). Each skill is a folder containing a `SKILL.md`.",
      "",
      "## Format",
      "",
      "```text",
      ".agents/skills/<name>/SKILL.md",
      "```",
      "",
      "`SKILL.md` starts with YAML frontmatter holding `name` (must match the folder name) and `description` (what the skill does and when to use it), followed by Markdown instructions:",
      "",
      "```markdown",
      "---",
      "name: my-skill",
      "description: One sentence on what this skill does and when to use it.",
      "---",
      "",
      "# My Skill",
      "",
      "Step-by-step instructions.",
      "```",
      "",
      "## Runtimes Reading This Folder",
      "",
      "- Verified: Cursor, GitHub Copilot, Windsurf, Gemini CLI, omp.",
      "<!-- unverified: Codex and Pi docs reference .agents/skills but discovery is not confirmed -->",
      "- Unverified: Codex, Pi.",
      "",
      "## Adding a Skill",
      "",
      "- Run `sauron add <skill>` to install a Sauron skill into `.agents/skills/<skill>/SKILL.md`.",
      "- Or create `.agents/skills/<name>/SKILL.md` by hand using the format above.",
      "",
    ].join("\n");
  }
}
