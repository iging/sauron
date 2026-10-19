/**
 * @fileoverview VS Code adapter generating .vscode/settings.json.
 * Strictly adheres to Microsoft VS Code instruction files standard (https://aka.ms/vscode-ghcp-custom-instructions).
 * Instruction files are emitted by the Copilot adapter under `.github/instructions/`.
 * Eliminates deprecated github.copilot.chat.codeGeneration.instructions in settings.json.
 */

import {
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

/**
 * Adapter compiling Sauron Intermediate Representation for Microsoft VS Code.
 * Follows the VS Code instruction files standard (https://aka.ms/vscode-ghcp-custom-instructions).
 * Emits `.vscode/settings.json`.
 */
export class VSCodeAdapter implements RuntimeAdapter {
  /** Runtime identifier for VS Code. */
  public readonly id = "vscode";
  /** Display name for VS Code. */
  public readonly name = "VS Code";
  /** Target files managed by this adapter. */
  public readonly targetFiles = [
    ".vscode/settings.json",
  ];

  /**
   * Compiles context into VS Code workspace settings.
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

    return [
      {
        relativePath: ".vscode/settings.json",
        content: JSON.stringify(settingsObject, null, 2),
        format: "json",
      },
    ];
  }
}
