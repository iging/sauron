/// <reference types="node" />
/**
 * @fileoverview Pure resolution of `sauron init` choices into an install plan.
 * No disk I/O. Used by the CLI prompts, the non-interactive flags, and `sync`.
 */

import { CAVEMAN_MODES } from "./types.js";
import type { CavemanMode } from "./types.js";

/** Which subagent sets to install into runtimes that support subagents. */
export type AgentSet = "fellowship" | "core" | "both" | "none";

/** All valid agent sets. */
export const AGENT_SETS: readonly AgentSet[] = [
  "fellowship",
  "core",
  "both",
  "none",
];

/** Runtime ids accepted by `--runtimes`, matching the transpiler adapter ids. */
export const RUNTIME_IDS: readonly string[] = [
  "claude",
  "cursor",
  "windsurf",
  "copilot",
  "vscode",
  "cline",
  "trae",
  "zed",
  "codex",
  "gemini",
  "qwen",
  "kimi",
  "kiro",
  "hermes",
  "openclaw",
  "opencode",
  "pi",
  "omp",
  "adal",
  "codebuddy",
];

/** Fully resolved answers for one `init` run. */
export interface InitPlan {
  /** Runtime adapter ids to generate. The shared AGENTS.md core is always included. */
  runtimes: string[];
  /** Subagent set installed into `.claude/agents/` when Claude Code is selected. */
  agents: AgentSet;
  /** `all`, `none`, or a list of skill departments to install into `.agents/skills/`. */
  skills: "all" | "none" | string[];
  /** Default Caveman Mode tier. */
  caveman: CavemanMode;
  /** Copy Sauron slash commands into `.claude/commands/` when Claude Code is selected. */
  commands: boolean;
}

/** The one-keypress default: shared core, Claude Code, every skill, the Fellowship. */
export const PRESET_RECOMMENDED: Readonly<InitPlan> = Object.freeze({
  runtimes: ["claude"],
  agents: "fellowship",
  skills: "all",
  caveman: "full",
  commands: true,
});

/** Thrown when a flag value is invalid; the CLI prints it and exits 1. */
export class InitPlanError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InitPlanError";
  }
}

/** Reads `--name=value` from argv, or undefined when absent. */
function readFlag(argv: readonly string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const hit = argv.find((arg) => arg.startsWith(prefix));
  return hit === undefined ? undefined : hit.slice(prefix.length).trim();
}

/** Splits a comma list, lowercases, and drops empty entries. */
function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
}

/**
 * Validates a runtime list. `all` expands to every runtime.
 *
 * @throws InitPlanError when an id is unknown.
 */
export function parseRuntimes(value: string): string[] {
  const ids = splitList(value);
  if (ids.length === 1 && ids[0] === "all") {
    return [...RUNTIME_IDS];
  }
  const unknown = ids.filter((id) => !RUNTIME_IDS.includes(id));
  if (unknown.length > 0 || ids.length === 0) {
    throw new InitPlanError(
      `Unknown runtime '${unknown.join(", ") || value}'. Valid: all, ${RUNTIME_IDS.join(", ")}.`,
    );
  }
  return [...new Set(ids)];
}

/**
 * Validates a skills value against the available departments.
 *
 * @throws InitPlanError when a department is unknown.
 */
export function parseSkills(
  value: string,
  departments: readonly string[],
): InitPlan["skills"] {
  const items = splitList(value);
  if (items.length === 1 && (items[0] === "all" || items[0] === "none")) {
    return items[0];
  }
  const unknown = items.filter((dept) => !departments.includes(dept));
  if (unknown.length > 0 || items.length === 0) {
    throw new InitPlanError(
      `Unknown skill department '${unknown.join(", ") || value}'. Valid: all, none, ${departments.join(", ")}.`,
    );
  }
  return [...new Set(items)];
}

/** Validates an agent set. */
export function parseAgents(value: string): AgentSet {
  const agents = value.trim().toLowerCase();
  if (!AGENT_SETS.includes(agents as AgentSet)) {
    throw new InitPlanError(
      `Unknown agent set '${value}'. Valid: ${AGENT_SETS.join(", ")}.`,
    );
  }
  return agents as AgentSet;
}

/** Validates a Caveman tier. */
export function parseCaveman(value: string): CavemanMode {
  const mode = value.trim().toLowerCase();
  if (!CAVEMAN_MODES.includes(mode as CavemanMode)) {
    throw new InitPlanError(
      `Invalid caveman tier '${value}'. Valid: ${CAVEMAN_MODES.join(", ")}.`,
    );
  }
  return mode as CavemanMode;
}

/** Flags given on the command line; every field is optional. */
export type InitFlags = Partial<InitPlan>;

/**
 * Parses `init` flags. Unknown values throw InitPlanError.
 *
 * Supported: `--runtimes=`, `--agents=`, `--skills=`, `--caveman=`, `--no-commands`.
 */
export function parseInitFlags(
  argv: readonly string[],
  departments: readonly string[],
): InitFlags {
  const flags: InitFlags = {};
  const runtimes = readFlag(argv, "runtimes");
  const agents = readFlag(argv, "agents");
  const skills = readFlag(argv, "skills");
  const caveman = readFlag(argv, "caveman");
  if (runtimes !== undefined) flags.runtimes = parseRuntimes(runtimes);
  if (agents !== undefined) flags.agents = parseAgents(agents);
  if (skills !== undefined) flags.skills = parseSkills(skills, departments);
  if (caveman !== undefined) flags.caveman = parseCaveman(caveman);
  if (argv.includes("--no-commands")) flags.commands = false;
  return flags;
}

/** Fills missing choices from a base plan (the Recommended preset by default). */
export function resolvePlan(
  flags: InitFlags,
  base: Readonly<InitPlan> = PRESET_RECOMMENDED,
): InitPlan {
  return {
    runtimes: flags.runtimes ?? [...base.runtimes],
    agents: flags.agents ?? base.agents,
    skills:
      flags.skills ??
      (Array.isArray(base.skills) ? [...base.skills] : base.skills),
    caveman: flags.caveman ?? base.caveman,
    commands: flags.commands ?? base.commands,
  };
}

/**
 * Reads a previously saved plan from the parsed `init:` section of
 * `sauron.config.yaml`. Returns undefined when the section is missing or invalid.
 */
export function planFromConfig(
  section: unknown,
  departments: readonly string[],
): InitPlan | undefined {
  if (!section || typeof section !== "object") {
    return undefined;
  }
  const record = section as Record<string, unknown>;
  try {
    const runtimes = Array.isArray(record["runtimes"])
      ? parseRuntimes((record["runtimes"] as unknown[]).join(","))
      : undefined;
    const skillsRaw = record["skills"];
    const skills =
      typeof skillsRaw === "string"
        ? parseSkills(skillsRaw, departments)
        : Array.isArray(skillsRaw)
          ? parseSkills(skillsRaw.join(","), departments)
          : undefined;
    return resolvePlan({
      ...(runtimes ? { runtimes } : {}),
      ...(typeof record["agents"] === "string"
        ? { agents: parseAgents(record["agents"]) }
        : {}),
      ...(skills ? { skills } : {}),
      ...(typeof record["commands"] === "boolean"
        ? { commands: record["commands"] }
        : {}),
    });
  } catch {
    return undefined;
  }
}
