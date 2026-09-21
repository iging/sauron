/**
 * @fileoverview OpenClaude adapter generating .openclaude/config.json file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class OpenClaudeAdapter implements RuntimeAdapter {
  public readonly id = "openclaude";
  public readonly name = "OpenClaude";
  public readonly targetFiles = [".openclaude/config.json"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const config = {
      version: context.version,
      projectName: context.projectName,
      governance: {
        rules: context.rules,
        antiPatterns: context.antiPatterns,
      },
      fellowship: context.fellowship.map((agent) => ({
        id: agent.id,
        name: agent.name,
        role: agent.role,
        slashCommand: agent.slashCommand,
      })),
      skills: context.skills.map((skill) => ({
        id: skill.id,
        command: skill.triggerCommand,
        department: skill.department,
      })),
    };

    return [
      {
        relativePath: ".openclaude/config.json",
        content: JSON.stringify(config, null, 2),
        format: "json",
      },
    ];
  }
}
