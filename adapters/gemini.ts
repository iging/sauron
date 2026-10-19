/**
 * @fileoverview Gemini adapter generating GEMINI.md and the .gemini/ scaffold for Google Gemini CLI and Code Assist.
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

/** README describing the `.gemini/` project scaffold. */
const GEMINI_README = [
  "# .gemini/",
  "",
  "> Governed by Sauron. Project-level configuration for Gemini CLI.",
  "",
  "## Contents",
  "",
  "- `settings.json`: project settings. `context.fileName` makes Gemini CLI load both `GEMINI.md` and `AGENTS.md` as context files.",
  "- `skills/`: project skills. Each skill is a folder containing a `SKILL.md` file with `name` and `description` YAML frontmatter.",
  "",
  "## Skills Alias",
  "",
  "Gemini CLI also discovers skills in `.agents/skills/`, an alias of `.gemini/skills/`. Prefer `.agents/skills/` to share skills with other runtimes.",
  "",
  "## Adding a Context File",
  "",
  "Add the file name to `context.fileName` in `settings.json`. Gemini CLI loads matching files hierarchically from the project root and subdirectories.",
  "",
  "## Antigravity Note",
  "",
  "On 2026-06-18 the Gemini CLI free tier was replaced by Antigravity CLI. Paid Gemini CLI tiers still read this folder.",
  "",
  "## Official Docs",
  "",
  "- https://geminicli.com/docs/cli/gemini-md",
  "- https://geminicli.com/docs/cli/skills",
  "",
].join("\n");

/**
 * Adapter compiling Sauron Intermediate Representation into Google Gemini CLI instructions.
 * Emits `GEMINI.md` following Gemini CLI context discovery standards.
 */
export class GeminiAdapter implements RuntimeAdapter {
  /** Runtime identifier for Gemini. */
  public readonly id = "gemini";
  /** Display name for Gemini. */
  public readonly name = "Gemini";
  /** Target files managed by this adapter. */
  public readonly targetFiles = [
    "GEMINI.md",
    ".gemini/settings.json",
    ".gemini/README.md",
  ];

  /**
   * Compiles context into GEMINI.md markdown instructions.
   *
   * @param context - Universal transpile context containing project facts, agents, and skills.
   * @returns GEMINI.md, .gemini/settings.json, and .gemini/README.md outputs.
   */
  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# GEMINI.md`);
    lines.push("");
    lines.push(
      `> Governed by Sauron v${context.version}. Persistent context and instructions for Gemini CLI.`,
    );
    lines.push("");
    lines.push("## Project Overview & Tech Stack");
    lines.push("");
    lines.push(
      context.projectDescription ||
        "Universal AI agent workspace governed by Sauron.",
    );
    lines.push("- Target: Node.js 20+, TypeScript 7+, ESM");
    lines.push("- Test Runner: Native Node.js test runner");
    lines.push("");
    lines.push("## Essential Commands");
    lines.push("");
    lines.push("- Build: `npm run build`");
    lines.push("- Test All: `npm test`");
    lines.push("- Lint & Typecheck: `npx tsc --noEmit`");
    lines.push("- Single Test: `node --test tests/<filename>.test.mjs`");
    lines.push("");
    lines.push("## Architectural & Coding Guidelines");
    lines.push("");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push(...formatCavemanSection("##", context.cavemanMode));
    lines.push("## Fellowship Sub-Agents Delegation");
    lines.push("");
    for (const agent of context.fellowship) {
      lines.push(
        `- **${agent.name}** (\`${agent.slashCommand}\`): ${agent.role}`,
      );
    }
    lines.push("");
    lines.push("## Gemini Behavior & Safety Boundaries");
    lines.push("");
    for (const ap of context.antiPatterns) {
      lines.push(`- ${ap}`);
    }
    lines.push("- Never modify files in `.sauron/backups/` directly.");
    lines.push("- Never commit secrets, credentials, or `.env` files.");
    lines.push(
      "- Always run tests and verify zero exit codes before concluding.",
    );
    lines.push("");

    return [
      {
        relativePath: "GEMINI.md",
        content: lines.join("\n"),
        format: "markdown",
      },
      {
        relativePath: ".gemini/settings.json",
        content:
          JSON.stringify(
            { context: { fileName: ["GEMINI.md", "AGENTS.md"] } },
            null,
            2,
          ) + "\n",
        format: "json",
      },
      {
        relativePath: ".gemini/README.md",
        content: GEMINI_README,
        format: "markdown",
      },
    ];
  }
}
