/**
 * @fileoverview Gemini adapter generating GEMINI.md for Google Gemini CLI and Code Assist.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

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
  public readonly targetFiles = ["GEMINI.md"];

  /**
   * Compiles context into GEMINI.md markdown instructions.
   *
   * @param context - Universal transpile context containing project facts, agents, and skills.
   * @returns Array containing GEMINI.md output.
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
    ];
  }
}
