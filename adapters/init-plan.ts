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

/** Runtimes that receive Sauron subagents as native files. Commands depend on the target. */
export const NATIVE_RUNTIMES: readonly string[] = [
  "claude",
  "opencode",
  "omp",
  "codex",
  "copilot",
];

/** Keeps only the runtimes that receive native subagents. */
export function nativeRuntimesFor(runtimes: readonly string[]): string[] {
  return runtimes.filter((id) => NATIVE_RUNTIMES.includes(id));
}

/** Fully resolved answers for one `init` run. */
export interface InitPlan {
  /** Runtime adapter ids to generate. The shared AGENTS.md core is always included. */
  runtimes: string[];
  /** Subagent set installed into each runtime in `nativeRuntimes`. */
  agents: AgentSet;
  /** `all`, `none`, or department and department/skill selections for `.agents/skills/`. */
  skills: "all" | "none" | string[];
  /** Default Caveman Mode tier. */
  caveman: CavemanMode;
  /** Copy Sauron slash commands where a native runtime supports them. */
  commands: boolean;
  /** Runtimes opted in to native subagents and commands. Saved so `sync` adds no others. */
  nativeRuntimes: string[];
}

/** The one-keypress default: shared core, Claude Code, every skill, the Fellowship. */
export const PRESET_RECOMMENDED: Readonly<InitPlan> = Object.freeze({
  runtimes: ["claude"],
  agents: "fellowship",
  skills: "all",
  caveman: "full",
  commands: true,
  nativeRuntimes: ["claude"],
});

/** Named install profiles for `--profile=<name>`. Explicit flags still override each field. */
export const INSTALL_PROFILES: Readonly<Record<string, Readonly<InitPlan>>> =
  Object.freeze({
    minimal: Object.freeze({
      runtimes: ["claude"],
      agents: "none",
      skills: "none",
      caveman: "full",
      commands: false,
      nativeRuntimes: ["claude"],
    }),
    recommended: PRESET_RECOMMENDED,
    frontend: Object.freeze({
      runtimes: ["claude"],
      agents: "fellowship",
      skills: ["frontend", "quality"],
      caveman: "full",
      commands: true,
      nativeRuntimes: ["claude"],
    }),
    backend: Object.freeze({
      runtimes: ["claude"],
      agents: "fellowship",
      skills: ["backend", "database", "devops", "security"],
      caveman: "full",
      commands: true,
      nativeRuntimes: ["claude"],
    }),
    full: Object.freeze({
      runtimes: [...RUNTIME_IDS],
      agents: "both",
      skills: "all",
      caveman: "full",
      commands: true,
      nativeRuntimes: [...NATIVE_RUNTIMES],
    }),
  });

/** How far Sauron's output for a runtime is proven. */
export type RuntimeTier = "stable" | "beta" | "instruction-only";

/** Support tier of one runtime, with the evidence behind it. */
export interface RuntimeSupport {
  tier: RuntimeTier;
  evidence: string;
}

const DOCUMENTED =
  "Paths match official docs. No recorded run in the real tool yet.";

const LEGACY =
  "Paths come from unofficial sources. Sauron writes an instruction file only.";

/**
 * Support tier per runtime. `stable` needs a recorded check in the real tool.
 * `beta` has paths from official docs. `instruction-only` has no official source.
 * Promote a runtime only with a new entry in `docs/04-runtime-adapters/runtime-tiers.md`.
 */
export const RUNTIME_SUPPORT: Readonly<Record<string, RuntimeSupport>> =
  Object.freeze({
    claude: { tier: "beta", evidence: DOCUMENTED },
    cursor: { tier: "beta", evidence: DOCUMENTED },
    windsurf: { tier: "beta", evidence: DOCUMENTED },
    copilot: { tier: "beta", evidence: DOCUMENTED },
    vscode: { tier: "beta", evidence: DOCUMENTED },
    cline: { tier: "beta", evidence: DOCUMENTED },
    trae: { tier: "instruction-only", evidence: LEGACY },
    zed: { tier: "beta", evidence: DOCUMENTED },
    codex: { tier: "beta", evidence: DOCUMENTED },
    gemini: { tier: "beta", evidence: DOCUMENTED },
    qwen: { tier: "beta", evidence: DOCUMENTED },
    kimi: { tier: "instruction-only", evidence: LEGACY },
    kiro: { tier: "beta", evidence: DOCUMENTED },
    hermes: { tier: "instruction-only", evidence: LEGACY },
    openclaw: { tier: "instruction-only", evidence: LEGACY },
    opencode: {
      tier: "stable",
      evidence:
        "On 2026-11-01, `opencode debug agents` listed the installed Fellowship agents.",
    },
    pi: { tier: "beta", evidence: DOCUMENTED },
    omp: { tier: "beta", evidence: DOCUMENTED },
    adal: { tier: "instruction-only", evidence: LEGACY },
    codebuddy: { tier: "beta", evidence: DOCUMENTED },
  });

/**
 * Validates a profile name and returns its plan.
 *
 * @throws InitPlanError when the name is unknown.
 */
export function parseProfile(value: string): Readonly<InitPlan> {
  const profile = INSTALL_PROFILES[value.trim().toLowerCase()];

  if (!profile) {
    throw new InitPlanError(
      `Unknown profile '${value}'. Valid: ${Object.keys(INSTALL_PROFILES).join(", ")}.`,
    );
  }

  return profile;
}

/** Reads `--profile=<name>`, or undefined when absent. */
export function readProfileFlag(
  argv: readonly string[],
): Readonly<InitPlan> | undefined {
  const value = readFlag(argv, "profile");

  return value === undefined ? undefined : parseProfile(value);
}

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
 * Validates a skills value against available departments and catalog selectors.
 *
 * @throws InitPlanError when a selection is unknown.
 */
export function parseSkills(
  value: string,
  departments: readonly string[],
  selectors: readonly string[] = [],
): InitPlan["skills"] {
  const items = splitList(value);

  if (items.length === 1 && (items[0] === "all" || items[0] === "none")) {
    return items[0];
  }

  const unknown = items.filter(
    (item) => !departments.includes(item) && !selectors.includes(item),
  );

  if (unknown.length > 0 || items.length === 0) {
    throw new InitPlanError(
      `Unknown skill selection '${unknown.join(", ") || value}'. Valid: all, none, ${departments.join(", ")}.`,
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
  selectors: readonly string[] = [],
): InitFlags {
  const flags: InitFlags = {};
  const runtimes = readFlag(argv, "runtimes");
  const agents = readFlag(argv, "agents");
  const skills = readFlag(argv, "skills");
  const caveman = readFlag(argv, "caveman");

  if (runtimes !== undefined) flags.runtimes = parseRuntimes(runtimes);
  if (agents !== undefined) flags.agents = parseAgents(agents);
  if (skills !== undefined)
    flags.skills = parseSkills(skills, departments, selectors);
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
    nativeRuntimes:
      flags.nativeRuntimes ??
      (flags.runtimes
        ? nativeRuntimesFor(flags.runtimes)
        : [...base.nativeRuntimes]),
  };
}

/**
 * Reads the saved native runtimes. Configs saved before 3.2.0 have no such key, and
 * those users only ever chose native files for Claude Code, so `sync` keeps it that way.
 */
function savedNativeRuntimes(
  value: unknown,
  runtimes: readonly string[],
): string[] {
  const chosen = Array.isArray(value)
    ? nativeRuntimesFor(value.map(String))
    : ["claude"];

  return chosen.filter((id) => runtimes.includes(id));
}

/**
 * Reads a config v2 document or a legacy `init:` section from
 * `sauron.config.yaml`. Returns undefined when the section is missing or invalid.
 */
export function planFromConfig(
  section: unknown,
  departments: readonly string[],
  selectors: readonly string[] = [],
): InitPlan | undefined {
  if (!section || typeof section !== "object") {
    return undefined;
  }

  const record = section as Record<string, unknown>;

  if (record["version"] === "2.0.0") {
    const runtimeBlock = record["runtimes"];

    if (
      !runtimeBlock ||
      typeof runtimeBlock !== "object" ||
      Array.isArray(runtimeBlock)
    ) {
      throw new InitPlanError("Config v2 requires a runtimes mapping.");
    }

    const entries = Object.entries(runtimeBlock);

    if (
      entries.some(
        ([id, enabled]) =>
          !RUNTIME_IDS.includes(id) || typeof enabled !== "boolean",
      )
    ) {
      throw new InitPlanError(
        "Config v2 runtime entries must be known ids with boolean values.",
      );
    }

    const runtimes = entries.filter(([, enabled]) => enabled).map(([id]) => id);
    const init = record["init"];

    if (
      init !== undefined &&
      (!init || typeof init !== "object" || Array.isArray(init))
    ) {
      throw new InitPlanError("Config v2 init choices must be a mapping.");
    }

    const choices = (init ?? {}) as Record<string, unknown>;

    if ("runtimes" in choices || "skills" in choices) {
      throw new InitPlanError("Config v2 uses top-level runtimes and skills.");
    }

    const rawSkills = record["skills"];

    if (
      typeof rawSkills !== "string" &&
      (!Array.isArray(rawSkills) ||
        !rawSkills.every((item) => typeof item === "string"))
    ) {
      throw new InitPlanError(
        "Config v2 requires skills: all, none, or a selection list.",
      );
    }
    if (
      Array.isArray(rawSkills) &&
      rawSkills.some((item) => item === "all" || item === "none")
    ) {
      throw new InitPlanError("Use all or none as a scalar, not a list item.");
    }
    if (
      choices["commands"] !== undefined &&
      typeof choices["commands"] !== "boolean"
    ) {
      throw new InitPlanError("init.commands must be boolean.");
    }

    const native = choices["nativeRuntimes"];

    if (
      native !== undefined &&
      (!Array.isArray(native) ||
        !native.every(
          (id) => typeof id === "string" && NATIVE_RUNTIMES.includes(id),
        ))
    ) {
      throw new InitPlanError(
        "init.nativeRuntimes must list known native runtime ids.",
      );
    }

    const caveman = record["caveman"];
    const mode =
      caveman && typeof caveman === "object" && "default_mode" in caveman
        ? parseCaveman(String(caveman.default_mode))
        : "full";

    return resolvePlan({
      runtimes,
      skills: parseSkills(
        Array.isArray(rawSkills) ? rawSkills.join(",") : rawSkills,
        departments,
        selectors,
      ),
      agents:
        choices["agents"] === undefined
          ? "fellowship"
          : parseAgents(String(choices["agents"])),
      commands:
        choices["commands"] === undefined ? true : choices["commands"] === true,
      caveman: mode,
      nativeRuntimes:
        native === undefined
          ? runtimes.filter((id) => ["claude", "opencode", "omp"].includes(id))
          : native.filter((id) => runtimes.includes(id)),
    });
  }
  try {
    const runtimes = Array.isArray(record["runtimes"])
      ? parseRuntimes((record["runtimes"] as unknown[]).join(","))
      : undefined;
    const skillsRaw = record["skills"];
    const skills =
      typeof skillsRaw === "string"
        ? parseSkills(skillsRaw, departments, selectors)
        : Array.isArray(skillsRaw)
          ? parseSkills(skillsRaw.join(","), departments, selectors)
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
      nativeRuntimes: savedNativeRuntimes(
        record["nativeRuntimes"],
        runtimes ?? PRESET_RECOMMENDED.runtimes,
      ),
    });
  } catch {
    return undefined;
  }
}
