/**
 * @fileoverview OpenClaw adapter generating .openclaw/config.json file.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class OpenClawAdapter implements RuntimeAdapter {
  public readonly id = "openclaw";
  public readonly name = "OpenClaw";
  public readonly targetFiles = [".openclaw/config.json"];

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
        relativePath: ".openclaw/config.json",
        content: JSON.stringify(config, null, 2),
        format: "json",
      },
    ];
  }
}
