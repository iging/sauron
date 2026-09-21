/**
 * @fileoverview VS Code adapter generating .vscode/settings.json and .vscode/sauron.instructions.md.
 * Strictly adheres to Microsoft VS Code instruction files standard (https://aka.ms/vscode-ghcp-custom-instructions).
 * Eliminates deprecated github.copilot.chat.codeGeneration.instructions in settings.json.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

/**
 * Adapter compiling Sauron Intermediate Representation for Microsoft VS Code.
 * Follows the VS Code instruction files standard (https://aka.ms/vscode-ghcp-custom-instructions).
 * Emits `.vscode/settings.json` and `.vscode/sauron.instructions.md`.
 */
export class VSCodeAdapter implements RuntimeAdapter {
  /** Runtime identifier for VS Code. */
  public readonly id = "vscode";
  /** Display name for VS Code. */
  public readonly name = "VS Code";
  /** Target files managed by this adapter. */
  public readonly targetFiles = [
    ".vscode/settings.json",
    ".vscode/sauron.instructions.md",
  ];

  /**
   * Compiles context into VS Code workspace settings and instructions file.
   *
   * @param context - Universal transpile context containing project facts, agents, and skills.
   * @returns Array of output files ready for safe disk write.
   */
  public transpile(context: TranspileContext): TranspileOutput[] {
    // 1. Generate clean workspace settings without deprecated instruction keys
    const settingsObject = {
      "sauron.version": context.version,
      "sauron.projectName": context.projectName,
      "files.eol": "\n",
      "editor.tabSize": 2,
      "editor.insertSpaces": true,
    };

    // 2. Generate official instruction file per https://aka.ms/vscode-ghcp-custom-instructions
    const instructionLines: string[] = [];
    instructionLines.push(
      `# VS Code Copilot Custom Instructions : ${context.projectName}`,
    );
    instructionLines.push("");
    instructionLines.push(
      `> Governed by Sauron v${context.version}. Universal AI agent harness.`,
    );
    instructionLines.push(
      `> Applied automatically by GitHub Copilot via VS Code instruction files standard.`,
    );
    instructionLines.push("");
    instructionLines.push("## Coding and Architectural Directives");
    instructionLines.push("");
    for (const rule of context.rules) {
      instructionLines.push(`- ${rule}`);
    }
    instructionLines.push("");
    instructionLines.push("## Fellowship Sub-Agents Context");
    instructionLines.push("");
    for (const agent of context.fellowship) {
      instructionLines.push(
        `- **${agent.name}** (${agent.role}): invoke via \`${agent.slashCommand}\``,
      );
    }
    instructionLines.push("");
    instructionLines.push("## Prohibited Anti-Patterns");
    instructionLines.push("");
    for (const ap of context.antiPatterns) {
      instructionLines.push(`- ${ap}`);
    }
    instructionLines.push("");

    return [
      {
        relativePath: ".vscode/settings.json",
        content: JSON.stringify(settingsObject, null, 2),
        format: "json",
      },
      {
        relativePath: ".vscode/sauron.instructions.md",
        content: instructionLines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
