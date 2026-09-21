/**
 * @fileoverview Zed editor adapter generating .zed/settings.json and .zed/prompts/sauron.md.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class ZedAdapter implements RuntimeAdapter {
  public readonly id = "zed";
  public readonly name = "Zed";
  public readonly targetFiles = [
    ".zed/settings.json",
    ".zed/prompts/sauron.md",
  ];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const promptLines: string[] = [];
    promptLines.push(`# Sauron Assistant Prompt for Zed`);
    promptLines.push(`Project: ${context.projectName}`);
    promptLines.push("");
    promptLines.push("## Rules");
    for (const rule of context.rules) {
      promptLines.push(`- ${rule}`);
    }
    promptLines.push("");
    promptLines.push("## Fellowship Sub-Agents");
    for (const agent of context.fellowship) {
      promptLines.push(
        `- ${agent.name} (${agent.role}): ${agent.slashCommand}`,
      );
    }
    promptLines.push("");
    promptLines.push("## Skills Catalog");
    for (const skill of context.skills) {
      promptLines.push(`- ${skill.triggerCommand}: ${skill.name}`);
    }
    promptLines.push("");

    const zedSettings = {
      "assistant.version": "2",
      "assistant.default_model": {
        provider: "anthropic",
        model: "claude-3-7-sonnet-latest",
      },
      "sauron.governance": {
        version: context.version,
        projectName: context.projectName,
      },
    };

    return [
      {
        relativePath: ".zed/settings.json",
        content: JSON.stringify(zedSettings, null, 2),
        format: "json",
      },
      {
        relativePath: ".zed/prompts/sauron.md",
        content: promptLines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
