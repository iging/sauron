/// <reference types="node" />
/**
 * @fileoverview Tools, shell commands, and model tiers for each Sauron agent, and how each
 * runtime receives them. Agent specs name a toolset, shell intents, and a model tier. Runtimes
 * get only fields their docs define. A field Sauron cannot express strictly is left out.
 * Sources (checked 2026-11-07):
 * - Claude Code: https://code.claude.com/docs/en/sub-agents.md
 * - OpenCode: https://opencode.ai/docs/agents and https://opencode.ai/docs/permissions
 * - omp: https://omp.sh/docs/subagent-authoring
 * - Codex: https://learn.chatgpt.com/docs/agent-configuration/subagents
 * - Copilot: https://docs.github.com/en/copilot/reference/custom-agents-configuration
 * No barrel files.
 */

import * as fs from "node:fs";
import * as path from "node:path";

/** What an agent may touch. */
export type Toolset = "planner" | "reviewer" | "builder" | "tester" | "git";

/** Model size, mapped to a real model per runtime. */
export type ModelTier = "fast" | "balanced" | "deep";

/** Named groups of shell commands. Resolved per project. */
export type ShellIntent =
  | "test"
  | "lint"
  | "typecheck"
  | "build"
  | "audit"
  | "git-read"
  | "git-write";

export const TOOLSETS: readonly Toolset[] = [
  "planner",
  "reviewer",
  "builder",
  "tester",
  "git",
];
export const MODEL_TIERS: readonly ModelTier[] = ["fast", "balanced", "deep"];
export const SHELL_INTENTS: readonly ShellIntent[] = [
  "test",
  "lint",
  "typecheck",
  "build",
  "audit",
  "git-read",
  "git-write",
];

/** Where a toolset may write files. */
type EditScope = "all" | "docs" | "tests" | "none";

/** File access per toolset. Shell access comes from the agent's intents. */
export const TOOLSET_EDIT: Readonly<Record<Toolset, EditScope>> = Object.freeze(
  {
    planner: "docs",
    reviewer: "none",
    builder: "all",
    tester: "tests",
    git: "docs",
  },
);

/** Path patterns that `docs` and `tests` edit scopes allow. */
const EDIT_PATTERNS: Readonly<Record<"docs" | "tests", readonly string[]>> =
  Object.freeze({
    docs: ["docs/*", "context/*", "*.md"],
    tests: ["tests/*", "test/*", "*.test.*", "*.spec.*", "__tests__/*"],
  });

/** Access fields read from an agent spec. */
export interface AgentAccess {
  toolset: Toolset;
  shell: ShellIntent[];
  model: ModelTier;
}

/** The least access: read and search only, no shell, balanced model. */
export const LEAST_ACCESS: Readonly<AgentAccess> = Object.freeze({
  toolset: "reviewer",
  shell: [],
  model: "balanced",
});

/** Real model per runtime and tier. Users override it in `sauron.config.yaml` `agents.models`. */
export type ModelMap = Readonly<
  Record<string, Readonly<Partial<Record<ModelTier, string>>>>
>;

/**
 * Bundled defaults. Only Claude Code has stable aliases. OpenCode and omp need a provider
 * model id, which depends on the user's account, so they inherit unless the user sets one.
 */
export const DEFAULT_MODELS: ModelMap = Object.freeze({
  claude: Object.freeze({ fast: "haiku", balanced: "sonnet", deep: "opus" }),
});

/**
 * Reads and checks the access fields of an agent spec.
 * A spec with no fields gets the least access. A spec with a bad field throws.
 *
 * @param data - Parsed frontmatter.
 * @param id - Agent id, for the error message.
 */
export function readAgentAccess(
  data: Record<string, unknown>,
  id: string,
): AgentAccess {
  const toolset = data["toolset"] ?? LEAST_ACCESS.toolset;
  const model = data["model"] ?? LEAST_ACCESS.model;
  const shell = data["shell"] ?? [];
  if (!TOOLSETS.includes(toolset as Toolset))
    throw new Error(`Agent ${id}: unknown toolset ${String(toolset)}.`);
  if (!MODEL_TIERS.includes(model as ModelTier))
    throw new Error(`Agent ${id}: unknown model tier ${String(model)}.`);
  if (
    !Array.isArray(shell) ||
    shell.some((intent) => !SHELL_INTENTS.includes(intent as ShellIntent))
  )
    throw new Error(`Agent ${id}: shell must list known intents.`);
  return {
    toolset: toolset as Toolset,
    shell: [...new Set(shell as ShellIntent[])],
    model: model as ModelTier,
  };
}

/** Shell commands for each intent in one project. */
export type ShellCommands = Readonly<Partial<Record<ShellIntent, string[]>>>;

const GIT_COMMANDS: ShellCommands = Object.freeze({
  "git-read": ["git status", "git diff", "git log", "git show"],
  "git-write": ["git add", "git commit"],
});

/**
 * Finds the project's commands for each intent from its files. Writes nothing.
 * An intent with no matching tool in the project is left out.
 *
 * @param projectRoot - The project folder.
 */
export function detectShellCommands(projectRoot: string): ShellCommands {
  const has = (file: string) => fs.existsSync(path.join(projectRoot, file));
  const commands: Partial<Record<ShellIntent, string[]>> = { ...GIT_COMMANDS };
  if (has("package.json")) {
    const runner = has("pnpm-lock.yaml")
      ? "pnpm"
      : has("yarn.lock")
        ? "yarn"
        : has("bun.lockb") || has("bun.lock")
          ? "bun"
          : "npm";
    let scripts: Record<string, unknown> = {};
    try {
      const parsed: unknown = JSON.parse(
        fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"),
      );
      const value =
        parsed && typeof parsed === "object"
          ? (parsed as { scripts?: unknown }).scripts
          : undefined;
      if (value && typeof value === "object")
        scripts = value as Record<string, unknown>;
    } catch {
      scripts = {};
    }
    const run = (name: string) =>
      runner === "npm" ? `npm run ${name}` : `${runner} run ${name}`;
    if ("test" in scripts) commands.test = [`${runner} test`];
    if ("lint" in scripts) commands.lint = [run("lint")];
    if ("typecheck" in scripts) commands.typecheck = [run("typecheck")];
    else if (has("tsconfig.json")) commands.typecheck = ["npx tsc --noEmit"];
    if ("build" in scripts) commands.build = [run("build")];
    commands.audit = [`${runner} audit`];
  } else if (has("pyproject.toml") || has("requirements.txt")) {
    commands.test = ["pytest"];
    commands.lint = ["ruff check"];
    commands.typecheck = ["mypy"];
    commands.audit = ["pip-audit"];
  }
  return commands;
}

/** The commands an agent may run in this project. */
export function commandsFor(
  access: AgentAccess,
  commands: ShellCommands,
): string[] {
  return access.shell.flatMap((intent) => commands[intent] ?? []);
}

/**
 * Merges `agents.models` from a parsed config over the bundled defaults, per runtime and tier.
 * Values that are not non-empty strings are ignored.
 *
 * @param config - Parsed `sauron.config.yaml`.
 */
export function modelsFromConfig(config: Record<string, unknown>): ModelMap {
  const agents = config["agents"];
  const custom =
    agents && typeof agents === "object"
      ? (agents as Record<string, unknown>)["models"]
      : undefined;
  if (!custom || typeof custom !== "object") return DEFAULT_MODELS;
  const merged: Record<string, Partial<Record<ModelTier, string>>> = {};
  for (const [runtime, tiers] of Object.entries(DEFAULT_MODELS))
    merged[runtime] = { ...tiers };
  for (const [runtime, tiers] of Object.entries(
    custom as Record<string, unknown>,
  )) {
    if (!tiers || typeof tiers !== "object") continue;
    for (const tier of MODEL_TIERS) {
      const value = (tiers as Record<string, unknown>)[tier];
      if (typeof value === "string" && value.trim().length > 0)
        merged[runtime] = { ...merged[runtime], [tier]: value.trim() };
    }
  }
  return merged;
}

/** Looks up the real model for a runtime and tier, or undefined to inherit. */
export function modelFor(
  runtime: string,
  tier: ModelTier,
  models: ModelMap,
): string | undefined {
  return models[runtime]?.[tier];
}

/**
 * Claude Code subagent fields. `tools` takes bare tool names only, so shell access is the
 * whole Bash tool, and each command still goes through Claude Code's permission prompts.
 */
export function claudeAccessLines(
  access: AgentAccess,
  models: ModelMap,
): string[] {
  const tools = ["Read", "Grep", "Glob"];
  const edit = TOOLSET_EDIT[access.toolset];
  if (edit !== "none") tools.push("Edit", "Write");
  if (access.shell.length > 0) tools.push("Bash");
  const model = modelFor("claude", access.model, models);
  return [`tools: ${tools.join(", ")}`, ...(model ? [`model: ${model}`] : [])];
}

/**
 * OpenCode `permissions` rules. Shell asks by default, then each allowed command is allowed.
 * Edits are denied, or limited to docs or tests. The last matching rule wins.
 */
export function opencodeAccessLines(
  access: AgentAccess,
  commands: ShellCommands,
  models: ModelMap,
): string[] {
  const rules: string[] = [];
  const rule = (action: string, resource: string, effect: string) =>
    rules.push(
      `  - { action: ${action}, resource: ${JSON.stringify(resource)}, effect: ${effect} }`,
    );
  const edit = TOOLSET_EDIT[access.toolset];
  if (edit !== "all") {
    rule("edit", "*", "deny");
    if (edit === "docs" || edit === "tests")
      for (const pattern of EDIT_PATTERNS[edit]) rule("edit", pattern, "allow");
  }
  const allowed = commandsFor(access, commands);
  rule("shell", "*", allowed.length > 0 ? "ask" : "deny");
  for (const command of allowed) rule("shell", `${command} *`, "allow");
  if (access.toolset === "git") rule("shell", "git push *", "deny");
  const model = modelFor("opencode", access.model, models);
  return [...(model ? [`model: ${model}`] : []), "permissions:", ...rules];
}

/**
 * omp fields. omp limits tools by name, with no per-command shell rule. Sauron writes `tools`
 * only for read-only agents, whose tool names the docs show. Other agents inherit.
 */
export function ompAccessLines(
  access: AgentAccess,
  models: ModelMap,
): string[] {
  const lines: string[] = [];
  if (TOOLSET_EDIT[access.toolset] === "none" && access.shell.length === 0)
    lines.push("tools: [read, grep, glob]");
  const model = modelFor("omp", access.model, models);
  if (model) lines.push(`model: ${model}`);
  return lines;
}

/**
 * Codex standalone agent settings. Parent permissions are inherited. Only disable the
 * documented shell capability when no shell intent is present. No tool allowlist exists.
 */
export function codexAccessLines(
  access: AgentAccess,
  models: ModelMap,
): string[] {
  const model = modelFor("codex", access.model, models);
  return [
    ...(model ? [`model = ${JSON.stringify(model)}`] : []),
    ...(access.shell.length === 0 ? ["features.shell_tool = false"] : []),
  ];
}

/** Copilot's portable tool aliases. Path and command scopes remain body instructions. */
export function copilotAccessLines(
  access: AgentAccess,
  models: ModelMap,
): string[] {
  const tools = ["read", "search"];
  if (TOOLSET_EDIT[access.toolset] !== "none") tools.push("edit");
  if (access.shell.length > 0) tools.push("execute");
  const model = modelFor("copilot", access.model, models);
  return [
    `tools: ${JSON.stringify(tools)}`,
    ...(model ? [`model: ${JSON.stringify(model)}`] : []),
  ];
}

/**
 * A short body section every runtime shows the agent, so it knows its limits even where the
 * runtime cannot enforce them.
 */
export function accessNote(
  access: AgentAccess,
  commands: ShellCommands,
): string {
  const edit = {
    all: "You may edit and create files.",
    docs: "Edit only documentation and context files.",
    tests: "Edit only test files.",
    none: "Do not edit or create files.",
  }[TOOLSET_EDIT[access.toolset]];
  const allowed = commandsFor(access, commands);
  const shell =
    allowed.length > 0
      ? `Run only these commands without asking: ${allowed.map((c) => `\`${c}\``).join(", ")}. Ask before any other command.`
      : access.shell.length > 0
        ? `Shell use: ${access.shell.join(", ")}. Ask before running any command.`
        : "Do not run shell commands.";
  const push =
    access.toolset === "git"
      ? " Never push, force push, or delete branches."
      : "";
  return `## Access\n\n- Toolset: ${access.toolset}. ${edit}\n- ${shell}${push}\n`;
}
