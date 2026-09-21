/**
 * @fileoverview Claude Code adapter generating CLAUDE.md adhering to Anthropic guidelines.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

/**
 * Adapter compiling Sauron Intermediate Representation into Anthropic Claude Code instructions.
 * Emits `CLAUDE.md` following official Anthropic best practices.
 */
export class ClaudeAdapter implements RuntimeAdapter {
  /** Runtime identifier for Claude Code. */
  public readonly id = "claude";
  /** Display name for Claude Code. */
  public readonly name = "Claude Code";
  /** Target files managed by this adapter. */
  public readonly targetFiles = ["CLAUDE.md"];

  /**
   * Compiles context into CLAUDE.md markdown instructions.
   *
   * @param context - Universal transpile context containing project facts, agents, and skills.
   * @returns Array containing CLAUDE.md output.
   */
  public transpile(context: TranspileContext): TranspileOutput[] {
    const lines: string[] = [];

    lines.push(`# CLAUDE.md`);
    lines.push("");
    lines.push(
      `> Managed by Sauron v${context.version}. Persistent instruction manual for Claude Code.`,
    );
    lines.push("");
    lines.push("## Common Commands");
    lines.push("");
    lines.push("- **Build Engine**: `npm run build`");
    lines.push("- **Run Test Suite**: `npm test`");
    lines.push("- **Typecheck**: `npx tsc --noEmit`");
    lines.push(
      "- **Run Single Test**: `node --test tests/<filename>.test.mjs`",
    );
    lines.push("");
    lines.push("## Architecture & Code Organization");
    lines.push("");
    lines.push(
      `- Context: ${context.projectDescription || "Universal AI agent workspace governed by Sauron."}`,
    );
    lines.push(
      "- `adapters/`: 17 runtime transpilation adapters, types, and safe conflict manager.",
    );
    lines.push("- `bin/`: CLI orchestrator and runtime entry points.");
    lines.push(
      "- `core/`: Fellowship sub-agent specifications and department skill metadata.",
    );
    lines.push(
      "- `skills/`: 44 ECC-standard modular skills across 7 functional departments.",
    );
    lines.push(
      "- `tests/`: Automated test suite executed with native Node.js test runner.",
    );
    lines.push("");
    lines.push("## Code Style & Conventions");
    lines.push("");
    for (const rule of context.rules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
    lines.push("## Fellowship Sub-Agents");
    lines.push("");
    for (const agent of context.fellowship) {
      lines.push(
        `- **${agent.name}** (\`${agent.slashCommand}\`): ${agent.role}`,
      );
    }
    lines.push("");
    lines.push("## Claude-Specific Behaviors");
    lines.push("");
    lines.push(
      "- Use adaptive reasoning natively; avoid redundant scratchpad scaffolding.",
    );
    lines.push(
      "- For complex refactoring, outline blast radius and impacted files before modifying code.",
    );
    lines.push(
      "- Route all multi-runtime synchronization writes through ConflictManager.",
    );
    lines.push(
      "- Always verify changes with `npm test` and `npx tsc --noEmit` before concluding.",
    );
    lines.push("");

    return [
      {
        relativePath: "CLAUDE.md",
        content: lines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
