/**
 * @fileoverview Pi adapter scaffolding the .pi/ prompts and skills folders.
 * Pi reads project instructions from AGENTS.md (emitted by the shared AGENTS.md adapter).
 * Unverified source: https://wener.me/notes/ai/agent/pi
 */

import {
  formatCavemanSection,
  type RuntimeAdapter,
  type TranspileContext,
  type TranspileOutput,
} from "./types.js";

const PI_PROMPTS_README = ".pi/prompts/README.md";
const PI_SKILLS_README = ".pi/skills/README.md";
const PI_SOURCE = "https://wener.me/notes/ai/agent/pi";

export class PiAdapter implements RuntimeAdapter {
  public readonly id = "pi";
  public readonly name = "Pi";
  public readonly targetFiles = [PI_PROMPTS_README, PI_SKILLS_README];

  public transpile(context: TranspileContext): TranspileOutput[] {
    const prompts: string[] = [];
    prompts.push(`<!-- unverified: ${PI_SOURCE} -->`);
    prompts.push(`# Pi Prompts for ${context.projectName}`);
    prompts.push(`Governed by Sauron v${context.version}`);
    prompts.push("");
    prompts.push(
      "Pi reads project instructions from `AGENTS.md`. This folder holds reusable prompt templates.",
    );
    prompts.push("");
    prompts.push("## Adding a Prompt");
    prompts.push(
      "Create `.pi/prompts/<name>.md`; invoke it as `/<name>`. Format:",
    );
    prompts.push("");
    prompts.push("```markdown");
    prompts.push("---");
    prompts.push("description: One-line summary shown in the command list");
    prompts.push('argument-hint: "<target>"');
    prompts.push("---");
    prompts.push("Do the task for $ARGUMENTS.");
    prompts.push("```");
    prompts.push("");
    prompts.push(...formatCavemanSection("##"));
    prompts.push("## Sub-Agents");
    for (const agent of context.fellowship) {
      prompts.push(`- ${agent.name} (${agent.role}) : ${agent.slashCommand}`);
    }
    prompts.push("");
    prompts.push("## Blocked Anti-Patterns");
    for (const ap of context.antiPatterns) {
      prompts.push(`- ${ap}`);
    }
    prompts.push("");
    prompts.push(`Docs: ${PI_SOURCE}`);
    prompts.push("");

    const skills: string[] = [];
    skills.push(`<!-- unverified: ${PI_SOURCE} -->`);
    skills.push(`# Pi Skills for ${context.projectName}`);
    skills.push(`Governed by Sauron v${context.version}`);
    skills.push("");
    skills.push(
      "Project-scoped skills for Pi. Project instructions live in `AGENTS.md`.",
    );
    skills.push("");
    skills.push("## Adding a Skill");
    skills.push(
      "Create `.pi/skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter, followed by the instructions body.",
    );
    skills.push("");
    skills.push("## Registered Sauron Skills");
    for (const skill of context.skills) {
      skills.push(`- ${skill.triggerCommand} : ${skill.name}`);
    }
    skills.push("");
    skills.push(`Docs: ${PI_SOURCE}`);
    skills.push("");

    return [
      {
        relativePath: PI_PROMPTS_README,
        content: prompts.join("\n"),
        format: "markdown",
      },
      {
        relativePath: PI_SKILLS_README,
        content: skills.join("\n"),
        format: "markdown",
      },
    ];
  }
}
