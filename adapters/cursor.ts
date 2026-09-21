/**
 * @fileoverview Cursor adapter generating .cursorrules and .cursor/rules/*.mdc files.
 */

import type {
  RuntimeAdapter,
  TranspileContext,
  TranspileOutput,
} from "./types.js";

export class CursorAdapter implements RuntimeAdapter {
  public readonly id = "cursor";
  public readonly name = "Cursor";
  public readonly targetFiles = [".cursorrules", ".cursor/rules/sauron.mdc"];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const cursorRulesLines: string[] = [];
    cursorRulesLines.push(`# .cursorrules for ${context.projectName}`);
    cursorRulesLines.push(`Managed by Sauron v${context.version}`);
    cursorRulesLines.push("");
    cursorRulesLines.push("## Core Principles");
    for (const rule of context.rules) {
      cursorRulesLines.push(`- ${rule}`);
    }
    cursorRulesLines.push("");
    cursorRulesLines.push("## Fellowship Sub-Agents");
    for (const agent of context.fellowship) {
      cursorRulesLines.push(
        `- ${agent.name} (${agent.role}): ${agent.slashCommand}`,
      );
    }
    cursorRulesLines.push("");
    cursorRulesLines.push("## Prohibited Anti-Patterns");
    for (const ap of context.antiPatterns) {
      cursorRulesLines.push(`- ${ap}`);
    }
    cursorRulesLines.push("");

    const mdcLines: string[] = [];
    mdcLines.push("---");
    mdcLines.push(
      `description: Sauron unified governance rules for ${context.projectName}`,
    );
    mdcLines.push("globs: *");
    mdcLines.push("alwaysApply: true");
    mdcLines.push("---");
    mdcLines.push("");
    mdcLines.push(`# Sauron Governance Rules for Cursor`);
    mdcLines.push("");
    mdcLines.push("## Operational Directives");
    mdcLines.push("");
    for (const rule of context.rules) {
      mdcLines.push(`- ${rule}`);
    }
    mdcLines.push("");
    mdcLines.push("## Commands and Skills");
    mdcLines.push("");
    for (const skill of context.skills) {
      mdcLines.push(
        `- \`${skill.triggerCommand}\`: ${skill.name} (${skill.department})`,
      );
    }
    mdcLines.push("");

    return [
      {
        relativePath: ".cursorrules",
        content: cursorRulesLines.join("\n"),
        format: "text",
      },
      {
        relativePath: ".cursor/rules/sauron.mdc",
        content: mdcLines.join("\n"),
        format: "markdown",
      },
    ];
  }
}
