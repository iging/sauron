/// <reference types="node" />
/**
 * @fileoverview Builds the extra files `sauron init` installs beyond the runtime
 * instruction files: skills, subagents, and slash commands. Reads Sauron's bundled
 * assets; never writes. Every output is written later through ConflictManager.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { InitPlan } from "./init-plan.js";

/** One file to install. `raw` files are copied verbatim (no managed block). */
export interface InstallOutput {
  /** Workspace-relative destination path. */
  relativePath: string;
  /** File content. */
  content: string;
  /** True when the file is copied verbatim and never merged into a user file. */
  raw: boolean;
}

/** A skill folder found in the bundled catalog. */
interface SkillSource {
  /** Folder name used as the installed skill name. */
  name: string;
  /** Department the skill belongs to. */
  department: string;
  /** Absolute path to the skill folder. */
  dir: string;
}

/** Lists the skill departments bundled with Sauron (excluding `_template`). */
export function listDepartments(sauronRoot: string): string[] {
  const skillsDir = path.join(sauronRoot, "skills");
  if (!fs.existsSync(skillsDir)) {
    return [];
  }
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();
}

/**
 * Finds installable skills: `skills/<dept>/<skill>/SKILL.md`, or one level deeper
 * for container folders (for example `skills/frontend/brand-presets/<brand>/`).
 */
export function listSkills(sauronRoot: string, departments: readonly string[]): SkillSource[] {
  const found: SkillSource[] = [];
  for (const department of departments) {
    const deptDir = path.join(sauronRoot, "skills", department);
    if (!fs.existsSync(deptDir)) continue;
    for (const entry of fs.readdirSync(deptDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(deptDir, entry.name);
      if (fs.existsSync(path.join(dir, "SKILL.md"))) {
        found.push({ name: entry.name, department, dir });
        continue;
      }
      for (const child of fs.readdirSync(dir, { withFileTypes: true })) {
        const childDir = path.join(dir, child.name);
        if (child.isDirectory() && fs.existsSync(path.join(childDir, "SKILL.md"))) {
          found.push({ name: child.name, department, dir: childDir });
        }
      }
    }
  }
  return found.sort((a, b) => a.name.localeCompare(b.name));
}

/** Recursively lists files under a folder, as forward-slash relative paths. */
function listFiles(root: string, rel = ""): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...listFiles(root, childRel));
    } else if (entry.isFile()) {
      files.push(childRel);
    }
  }
  return files;
}

/**
 * Builds verbatim outputs for every file of one skill folder, once per base
 * directory (for example `.agents/skills` and `.claude/skills`).
 */
export function skillFileOutputs(
  skillDir: string,
  skillName: string,
  baseDirs: readonly string[],
): InstallOutput[] {
  const outputs: InstallOutput[] = [];
  for (const file of listFiles(skillDir)) {
    const content = fs.readFileSync(path.join(skillDir, file), "utf8");
    for (const base of baseDirs) {
      outputs.push({ relativePath: `${base}/${skillName}/${file}`, content, raw: true });
    }
  }
  return outputs;
}

/** Splits a markdown file into parsed YAML frontmatter and body. */
function readFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) {
    return { data: {}, body: raw };
  }
  const parsed: unknown = parseYaml(match[1] ?? "");
  const data = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  return { data, body: raw.slice(match[0].length) };
}

/** Quotes a value for a single-line YAML scalar. */
function yamlString(value: string): string {
  return JSON.stringify(value.replace(/\s+/g, " ").trim());
}

/** A Sauron agent spec converted to Claude Code subagent form. */
interface ClaudeAgent {
  id: string;
  file: string;
  description: string;
  content: string;
}

/** Converts `core/<set>/*.md` specs into Claude Code subagent files. */
function loadClaudeAgents(sauronRoot: string, folder: "fellowship" | "agents"): ClaudeAgent[] {
  const dir = path.join(sauronRoot, "core", folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const { data, body } = readFrontmatter(fs.readFileSync(path.join(dir, file), "utf8"));
      const id = typeof data["id"] === "string" ? data["id"] : file.replace(/\.md$/, "");
      const name = typeof data["name"] === "string" ? data["name"] : id;
      const title = typeof data["title"] === "string" ? data["title"] : name;
      const invocation = data["invocation"] as Record<string, unknown> | undefined;
      const keywords = Array.isArray(invocation?.["intent_keywords"])
        ? (invocation?.["intent_keywords"] as unknown[]).map(String).join(", ")
        : typeof data["department"] === "string"
          ? data["department"]
          : "";
      const description = `${title} (${name}).${keywords ? ` Use proactively for: ${keywords}.` : ""}`;
      const content = [
        "---",
        `name: ${id}`,
        `description: ${yamlString(description)}`,
        "---",
        "",
        body.replace(/^\s+/, ""),
      ].join("\n");
      return { id, file: `.claude/agents/${id}.md`, description, content };
    });
}

/**
 * Builds every extra file for a plan. Claude-specific outputs (subagents,
 * `.claude/skills/`, commands) are produced only when `claude` is selected.
 */
export function buildInstallOutputs(sauronRoot: string, plan: InitPlan): InstallOutput[] {
  const outputs: InstallOutput[] = [];
  const claude = plan.runtimes.includes("claude");

  // Skills: shared copy for every runtime, plus Claude Code's own folder.
  const departments =
    plan.skills === "all"
      ? listDepartments(sauronRoot)
      : plan.skills === "none"
        ? []
        : plan.skills;
  const skillBases = claude ? [".agents/skills", ".claude/skills"] : [".agents/skills"];
  for (const skill of listSkills(sauronRoot, departments)) {
    outputs.push(...skillFileOutputs(skill.dir, skill.name, skillBases));
  }

  if (!claude) {
    return outputs;
  }

  // Subagents.
  const agents = [
    ...(plan.agents === "fellowship" || plan.agents === "both"
      ? loadClaudeAgents(sauronRoot, "fellowship")
      : []),
    ...(plan.agents === "core" || plan.agents === "both"
      ? loadClaudeAgents(sauronRoot, "agents")
      : []),
  ];
  for (const agent of agents) {
    outputs.push({ relativePath: agent.file, content: agent.content, raw: true });
  }

  // Slash commands: the bundled command set, plus one per installed Fellowship member.
  if (plan.commands) {
    const commandsDir = path.join(sauronRoot, "commands");
    if (fs.existsSync(commandsDir)) {
      for (const file of fs.readdirSync(commandsDir).filter((f) => f.endsWith(".md")).sort()) {
        outputs.push({
          relativePath: `.claude/commands/${file}`,
          content: fs.readFileSync(path.join(commandsDir, file), "utf8"),
          raw: true,
        });
      }
    }
    if (plan.agents === "fellowship" || plan.agents === "both") {
      for (const agent of loadClaudeAgents(sauronRoot, "fellowship")) {
        outputs.push({
          relativePath: `.claude/commands/${agent.id}.md`,
          content: [
            "---",
            `description: ${yamlString(`Hand a task to ${agent.description}`)}`,
            "argument-hint: <task>",
            "---",
            "",
            `Use the \`${agent.id}\` subagent to handle this task: $ARGUMENTS`,
            "",
          ].join("\n"),
          raw: true,
        });
      }
    }
  }

  return outputs;
}
