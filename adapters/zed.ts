/**
 * @fileoverview Zed editor adapter generating .rules and .zed/settings.json.
 * Zed loads only the FIRST match of .rules, .cursorrules, .windsurfrules, .clinerules,
 * .github/copilot-instructions.md, AGENT.md, AGENTS.md, CLAUDE.md, GEMINI.md — so
 * .rules wins over AGENTS.md and the other runtime files.
 * @see https://zed.dev/docs/ai/rules
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

export class ZedAdapter implements RuntimeAdapter {
  public readonly id = "zed";
  public readonly name = "Zed";
  public readonly targetFiles = [
    ".zed/settings.json",
    ".rules",
  ];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const promptLines: string[] = [];
    promptLines.push(`# Sauron Rules for Zed`);
    promptLines.push(`Project: ${context.projectName}`);
    promptLines.push("");
    promptLines.push("## Rules");
    for (const rule of context.rules) {
      promptLines.push(`- ${rule}`);
    }
    promptLines.push("");
    promptLines.push(...formatCavemanSection("##", context.cavemanMode));
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
        relativePath: ".rules",
        content: promptLines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
