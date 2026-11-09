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
import {
  DEFAULT_MODELS,
  accessNote,
  claudeAccessLines,
  codexAccessLines,
  copilotAccessLines,
  ompAccessLines,
  opencodeAccessLines,
  readAgentAccess,
  type AgentAccess,
  type ModelMap,
  type ShellCommands,
} from "./agent-access.js";

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
export function listSkills(
  sauronRoot: string,
  departments: readonly string[],
): SkillSource[] {
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

        if (
          child.isDirectory() &&
          fs.existsSync(path.join(childDir, "SKILL.md"))
        ) {
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

  for (const entry of fs.readdirSync(path.join(root, rel), {
    withFileTypes: true,
  })) {
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
      outputs.push({
        relativePath: `${base}/${skillName}/${file}`,
        content,
        raw: true,
      });
    }
  }

  return outputs;
}

/** Splits a markdown file into parsed YAML frontmatter and body. */
function readFrontmatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);

  if (!match) {
    return { data: {}, body: raw };
  }

  const parsed: unknown = parseYaml(match[1] ?? "");
  const data =
    parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : {};

  return { data, body: raw.slice(match[0].length) };
}

/** One picker option. Identity comes from the source path, labels from frontmatter. */
export interface SkillChoice {
  value: string;
  label: string;
  hint: string;
}

/** Read picker metadata only for the departments the user opens. */
export function listSkillChoices(
  sauronRoot: string,
  departments: readonly string[],
): SkillChoice[] {
  return listSkills(sauronRoot, departments).map((skill) => {
    const { data } = readFrontmatter(
      fs.readFileSync(path.join(skill.dir, "SKILL.md"), "utf8"),
    );
    const name = data["name"];
    const description = data["description"];

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      throw new Error(
        `Missing picker name or description: ${skill.department}/${skill.name}`,
      );
    }

    return {
      value: `${skill.department}/${skill.name}`,
      label: name.replace(/\s+/g, " ").trim(),
      hint: description.replace(/\s+/g, " ").trim(),
    };
  });
}

/** Quotes a value for a single-line YAML scalar. */
function yamlString(value: string): string {
  return JSON.stringify(value.replace(/\s+/g, " ").trim());
}

/** A Sauron agent spec, ready to render for one runtime. */
interface AgentSpec {
  id: string;
  description: string;
  body: string;
  access: AgentAccess;
}

/** Project facts used to render agent access: shell commands and real models. */
export interface AgentContext {
  commands: ShellCommands;
  models: ModelMap;
}

/** Context when no project is known: no shell commands, bundled models. */
export const DEFAULT_AGENT_CONTEXT: Readonly<AgentContext> = Object.freeze({
  commands: Object.freeze({}),
  models: DEFAULT_MODELS,
});

/** Where one runtime keeps native subagents and slash commands, and their format. */
export interface NativeTarget {
  /** Workspace-relative subagent folder. */
  agentsDir: string;
  /** Workspace-relative slash command folder, or null for agent-only targets. */
  commandsDir: string | null;
  /** File suffix and serialization of native agents. Markdown is the default. */
  agentExtension?: ".toml" | ".agent.md";
  agentFormat?: "toml";
  /** Renders the frontmatter lines of a subagent file. */
  agentFrontmatter: (agent: AgentSpec, context: AgentContext) => string[];
  /** True when the runtime documents the `argument-hint` command field. */
  argumentHint: boolean;
  /** Bundled commands left out because a built-in of the same name always wins. */
  reservedCommands: readonly string[];
}

const namedAgent = (agent: AgentSpec): string[] => [
  `name: ${agent.id}`,
  `description: ${yamlString(agent.description)}`,
];

/** Native install target per runtime id. Keys match `NATIVE_RUNTIMES`. */
export const NATIVE_TARGETS: Readonly<Record<string, NativeTarget>> =
  Object.freeze({
    claude: {
      agentsDir: ".claude/agents",
      commandsDir: ".claude/commands",
      agentFrontmatter: (agent: AgentSpec, context: AgentContext) => [
        ...namedAgent(agent),
        ...claudeAccessLines(agent.access, context.models),
      ],
      argumentHint: true,
      reservedCommands: [],
    },
    opencode: {
      agentsDir: ".opencode/agents",
      commandsDir: ".opencode/commands",
      // OpenCode takes the agent name from the file name.
      agentFrontmatter: (agent: AgentSpec, context: AgentContext) => [
        `description: ${yamlString(agent.description)}`,
        "mode: subagent",
        ...opencodeAccessLines(agent.access, context.commands, context.models),
      ],
      argumentHint: false,
      reservedCommands: [],
    },
    codex: {
      agentsDir: ".codex/agents",
      agentExtension: ".toml",
      agentFormat: "toml",
      commandsDir: null,
      agentFrontmatter: (agent: AgentSpec, context: AgentContext) => [
        `name = ${JSON.stringify(agent.id)}`,
        `description = ${JSON.stringify(agent.description)}`,
        ...codexAccessLines(agent.access, context.models),
      ],
      argumentHint: false,
      reservedCommands: [],
    },
    copilot: {
      agentsDir: ".github/agents",
      agentExtension: ".agent.md",
      commandsDir: null,
      agentFrontmatter: (agent: AgentSpec, context: AgentContext) => [
        ...namedAgent(agent),
        ...copilotAccessLines(agent.access, context.models),
      ],
      argumentHint: false,
      reservedCommands: [],
    },
    omp: {
      agentsDir: ".omp/agents",
      commandsDir: ".omp/prompts",
      agentFrontmatter: (agent: AgentSpec, context: AgentContext) => [
        ...namedAgent(agent),
        ...ompAccessLines(agent.access, context.models),
      ],
      argumentHint: false,
      // Built-in omp commands beat prompt templates. See https://omp.sh/docs/slash.
      reservedCommands: ["handoff", "loop", "plan", "security"],
    },
  });

/** Reads `core/<set>/*.md` specs into runtime-neutral agent specs. */
function loadAgents(
  sauronRoot: string,
  folder: "fellowship" | "agents",
): AgentSpec[] {
  const dir = path.join(sauronRoot, "core", folder);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const { data, body } = readFrontmatter(
        fs.readFileSync(path.join(dir, file), "utf8"),
      );
      const id =
        typeof data["id"] === "string" ? data["id"] : file.replace(/\.md$/, "");
      const name = typeof data["name"] === "string" ? data["name"] : id;
      const title = typeof data["title"] === "string" ? data["title"] : name;
      const invocation = data["invocation"] as
        | Record<string, unknown>
        | undefined;
      const keywords = Array.isArray(invocation?.["intent_keywords"])
        ? (invocation?.["intent_keywords"] as unknown[]).map(String).join(", ")
        : typeof data["department"] === "string"
          ? data["department"]
          : "";
      const description = `${title} (${name}).${keywords ? ` Use proactively for: ${keywords}.` : ""}`;

      return {
        id,
        description,
        body: body.replace(/^\s+/, ""),
        access: readAgentAccess(data, id),
      };
    });
}

/** Renders one subagent file for a runtime. */
function renderAgent(
  target: NativeTarget,
  agent: AgentSpec,
  context: AgentContext,
): string {
  if (target.agentFormat === "toml") {
    const instructions = `${agent.body.trimEnd()}\n\n${accessNote(agent.access, context.commands)}`;

    return [
      ...target.agentFrontmatter(agent, context),
      `developer_instructions = ${JSON.stringify(instructions)}`,
      "",
    ].join("\n");
  }

  return [
    "---",
    ...target.agentFrontmatter(agent, context),
    "---",
    "",
    agent.body.replace(/\s+$/, ""),
    "",
    accessNote(agent.access, context.commands),
  ].join("\n");
}

/** Renders the slash command that hands a task to one Fellowship member. */
function renderDelegateCommand(target: NativeTarget, agent: AgentSpec): string {
  return [
    "---",
    `description: ${yamlString(`Hand a task to ${agent.description}`)}`,
    ...(target.argumentHint ? ["argument-hint: <task>"] : []),
    "---",
    "",
    `Use the \`${agent.id}\` subagent to handle this task: $ARGUMENTS`,
    "",
  ].join("\n");
}

/** Reads the bundled command set, sorted by file name. */
function loadBundledCommands(
  sauronRoot: string,
): { file: string; sourceFile: string; content: string }[] {
  const commandsDir = path.join(sauronRoot, "commands");

  if (!fs.existsSync(commandsDir)) return [];

  const files = fs
    .readdirSync(commandsDir)
    .filter((file) => file.endsWith(".md"))
    .sort();
  const skillNames = new Set(
    listSkills(sauronRoot, listDepartments(sauronRoot)).map(
      (skill) => skill.name,
    ),
  );
  const commandNames = new Set(files.map((file) => file.slice(0, -3)));

  return files.map((sourceFile) => {
    const name = sourceFile.slice(0, -3);
    const alias = skillNames.has(name) ? `sauron-${name}` : name;

    if (alias !== name && (skillNames.has(alias) || commandNames.has(alias))) {
      throw new Error(`Command alias collides with an existing name: ${alias}`);
    }

    const content = fs.readFileSync(path.join(commandsDir, sourceFile), "utf8");

    return {
      sourceFile,
      file: `${alias}.md`,
      content:
        alias === name
          ? content
          : content.replace(
              new RegExp(`/${name}(?![a-zA-Z0-9_-])`, "g"),
              `/${alias}`,
            ),
    };
  });
}

/** One legacy install file and the new file that must exist before removing it. */
export interface InstallRetirement {
  relativePath: string;
  replacementPath: string;
}

/** Old command wrappers are retired after their aliases are installed successfully. */
export function commandRetirements(
  sauronRoot: string,
  plan: InitPlan,
): InstallRetirement[] {
  if (!plan.commands) return [];

  const commands = loadBundledCommands(sauronRoot);

  return plan.nativeRuntimes.flatMap((runtime) => {
    const target = NATIVE_TARGETS[runtime];

    if (!target?.commandsDir) return [];

    return commands
      .filter(
        ({ file, sourceFile }) =>
          file !== sourceFile &&
          !target.reservedCommands.includes(sourceFile.slice(0, -3)),
      )
      .map(({ sourceFile, file }) => ({
        relativePath: `${target.commandsDir}/${sourceFile}`,
        replacementPath: `${target.commandsDir}/${file}`,
      }));
  });
}

/**
 * Builds every extra file for a plan: shared skills, Claude Code's skill copy, and the
 * subagents and slash commands of each runtime in `plan.nativeRuntimes`.
 */
export function buildInstallOutputs(
  sauronRoot: string,
  plan: InitPlan,
  context: Readonly<AgentContext> = DEFAULT_AGENT_CONTEXT,
): InstallOutput[] {
  const outputs: InstallOutput[] = [];

  // Skills: shared copy for every runtime, plus Claude Code's own folder.
  const catalog = listSkills(sauronRoot, listDepartments(sauronRoot));
  const selected =
    plan.skills === "all"
      ? catalog
      : plan.skills === "none"
        ? []
        : catalog.filter(
            (skill) =>
              plan.skills.includes(skill.department) ||
              plan.skills.includes(`${skill.department}/${skill.name}`),
          );
  const skillBases = plan.runtimes.includes("claude")
    ? [".agents/skills", ".claude/skills"]
    : [".agents/skills"];

  for (const skill of selected) {
    outputs.push(...skillFileOutputs(skill.dir, skill.name, skillBases));
  }

  const fellowship =
    plan.agents === "fellowship" || plan.agents === "both"
      ? loadAgents(sauronRoot, "fellowship")
      : [];
  const core =
    plan.agents === "core" || plan.agents === "both"
      ? loadAgents(sauronRoot, "agents")
      : [];
  const bundledCommands = plan.commands ? loadBundledCommands(sauronRoot) : [];

  for (const runtime of plan.nativeRuntimes) {
    const target = NATIVE_TARGETS[runtime];

    if (!target) continue;

    for (const agent of [...fellowship, ...core]) {
      outputs.push({
        relativePath: `${target.agentsDir}/${agent.id}${target.agentExtension ?? ".md"}`,
        content: renderAgent(target, agent, context),
        raw: true,
      });
    }

    if (!plan.commands || !target.commandsDir) continue;

    // Slash commands: the bundled command set, plus one per installed Fellowship member.
    for (const { file, sourceFile, content } of bundledCommands) {
      if (target.reservedCommands.includes(sourceFile.replace(/\.md$/, "")))
        continue;
      outputs.push({
        relativePath: `${target.commandsDir}/${file}`,
        content,
        raw: true,
      });
    }
    for (const agent of fellowship) {
      outputs.push({
        relativePath: `${target.commandsDir}/${agent.id}.md`,
        content: renderDelegateCommand(target, agent),
        raw: true,
      });
    }
  }

  return outputs;
}
