#!/usr/bin/env node
// @ts-check

/**
 * @fileoverview Main CLI entry point for sauron.
 * Implements the command-line orchestrator following sauron JavaScript engineering standards.
 *
 * This executable orchestrates multi-runtime AI configuration synchronization. It reads
 * developer inputs, parses domain skill directories, and triggers the Transpiler engine
 * to emit tool-specific instructions (e.g., Claude Code, Cursor, Copilot, Windsurf)
 * while ensuring zero unbacked destructive overwrites via ConflictManager.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { Transpiler } from "../dist/adapters/transpiler.js";
import {
  AGENT_SETS,
  InitPlanError,
  PRESET_RECOMMENDED,
  RUNTIME_IDS,
  parseAgents,
  parseCaveman,
  parseInitFlags,
  parseRuntimes,
  parseSkills,
  planFromConfig,
  resolvePlan,
} from "../dist/adapters/init-plan.js";
import {
  buildInstallOutputs,
  listDepartments,
} from "../dist/adapters/installer.js";

// Determine canonical package root dynamically to ensure path resolution works
// identically regardless of whether installed globally or executed from within a submodule.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SAURON_ROOT = Object.freeze(path.resolve(__dirname, ".."));
const packageJsonPath = path.join(SAURON_ROOT, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

/** @type {string} Semantic version of the Sauron harness CLI. */
const VERSION = packageJson.version;

/** @type {string} ASCII banner celebrating the Lord of the Rings fellowship metaphor. */
const LOTR_BANNER = Object.freeze(`
===================================================================
                       S A U R O N
  "One Harness to rule them all, One Harness to prompt them,
   One Harness to sync them all, and in your codebase bind them."
===================================================================
`);

/**
 * @typedef {Object} RuntimeTarget
 * @property {string} id - Canonical runtime identifier key.
 * @property {string} name - Display name of the AI development tool.
 * @property {string} file - Default relative output path for instruction rules.
 */

/**
 * @typedef {Object} FellowshipMember
 * @property {string} id - Lowercase slug identifier.
 * @property {string} name - Character persona name.
 * @property {string} role - Specialized system responsibility.
 */

/**
 * @typedef {Object} InitOptions
 * @property {boolean} dryRun - Whether to simulate execution without modifying disk files.
 * @property {string[]} argv - Arguments after the command name (flags).
 * @property {boolean} isSync - True for `sauron sync` (never prompts, reuses saved choices).
 */

/**
 * @typedef {Object} DomainSummary
 * @property {string} name - Functional department name.
 * @property {string[]} skills - List of registered capability skills within this domain.
 */

/**
 * Catalog of the shared AGENTS.md core plus all 19 supported AI coding runtimes and their primary scaffold paths.
 * See docs/runtime-scaffolds.md for sources and verification status.
 * Sealed with Object.freeze to prevent runtime prototype pollution or accidental mutations.
 * @type {readonly RuntimeTarget[]}
 */
const RUNTIMES = Object.freeze([
  Object.freeze({
    id: "agents",
    name: "Shared Core",
    file: "AGENTS.md",
  }),
  Object.freeze({ id: "claude", name: "Claude Code", file: "CLAUDE.md" }),
  Object.freeze({
    id: "cursor",
    name: "Cursor",
    file: ".cursor/rules/sauron.mdc",
  }),
  Object.freeze({
    id: "windsurf",
    name: "Windsurf",
    file: ".windsurf/rules/sauron.md",
  }),
  Object.freeze({
    id: "copilot",
    name: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
  }),
  Object.freeze({ id: "cline", name: "Cline", file: ".cline/rules/sauron.md" }),
  Object.freeze({
    id: "vscode",
    name: "VS Code",
    file: ".vscode/settings.json",
  }),
  Object.freeze({
    id: "trae",
    name: "Trae",
    file: ".trae/rules/project_rules.md",
  }),
  Object.freeze({ id: "zed", name: "Zed", file: ".rules" }),
  Object.freeze({ id: "codex", name: "Codex", file: ".codex/config.toml" }),
  Object.freeze({ id: "gemini", name: "Gemini", file: "GEMINI.md" }),
  Object.freeze({ id: "qwen", name: "Qwen", file: "QWEN.md" }),
  Object.freeze({ id: "kimi", name: "Kimi", file: ".kimi/prompt.md" }),
  Object.freeze({ id: "kiro", name: "Kiro", file: ".kiro/steering/sauron.md" }),
  Object.freeze({ id: "hermes", name: "Hermes", file: ".hermesrules" }),
  Object.freeze({
    id: "openclaw",
    name: "OpenClaw",
    file: ".openclaw/config.json",
  }),
  Object.freeze({ id: "opencode", name: "OpenCode", file: "opencode.json" }),
  Object.freeze({ id: "pi", name: "Pi", file: ".pi/prompts/README.md" }),
  Object.freeze({ id: "adal", name: "AdaL", file: ".adalrules" }),
  Object.freeze({
    id: "codebuddy",
    name: "CodeBuddy",
    file: ".codebuddy/rules/sauron.md",
  }),
]);

/**
 * Canonical Fellowship of 9 sub-agents guiding architecture, testing, and operations.
 * @type {readonly FellowshipMember[]}
 */
const FELLOWSHIP = Object.freeze([
  Object.freeze({
    id: "gandalf",
    name: "Gandalf",
    role: "Master Planner and Strategy Guide",
  }),
  Object.freeze({
    id: "aragorn",
    name: "Aragorn",
    role: "Principal System Architect",
  }),
  Object.freeze({
    id: "legolas",
    name: "Legolas",
    role: "Precision Linter and Bug Hunter",
  }),
  Object.freeze({
    id: "gimli",
    name: "Gimli",
    role: "Refactorer and AST Dead Code Slasher",
  }),
  Object.freeze({
    id: "boromir",
    name: "Boromir",
    role: "Security Auditor and Shield",
  }),
  Object.freeze({
    id: "frodo",
    name: "Frodo",
    role: "Ringbearer and Core Task Executor",
  }),
  Object.freeze({
    id: "samwise",
    name: "Samwise",
    role: "Git Commits and State Keeper",
  }),
  Object.freeze({ id: "merry", name: "Merry", role: "QA and TDD Specialist" }),
  Object.freeze({
    id: "pippin",
    name: "Pippin",
    role: "Edge Case and Chaos Prober",
  }),
]);

/**
 * Reads and groups all skills by their domain directory on disk.
 *
 * Dynamically scans `sauron/skills/` to provide an accurate, non-stale reflection
 * of available capabilities without requiring manual registration updates.
 *
 * @param {string} rootDirectory - Base directory containing the `skills/` folder.
 * @returns {DomainSummary[]} Alphabetically sorted array of domain summaries and skill names.
 * @throws {Error} If filesystem I/O fails during directory traversal.
 */
function querySkillDomains(rootDirectory) {
  const skillsDirectory = path.join(rootDirectory, "skills");

  if (!fs.existsSync(skillsDirectory)) {
    return [];
  }

  try {
    /** @type {string[]} */
    const entries = fs.readdirSync(skillsDirectory);
    // Filter to directories only; ignore loose readme files or hidden dot-files.
    const domainNames = entries
      .filter((/** @type {string} */ entry) =>
        fs.statSync(path.join(skillsDirectory, entry)).isDirectory(),
      )
      .sort();

    return domainNames.map((/** @type {string} */ domainName) => {
      const domainPath = path.join(skillsDirectory, domainName);
      /** @type {string[]} */
      const domainEntries = fs.readdirSync(domainPath);
      // Each skill within a domain is represented by its own subfolder containing a SKILL.md.
      const skillNames = domainEntries
        .filter((/** @type {string} */ entry) =>
          fs.statSync(path.join(domainPath, entry)).isDirectory(),
        )
        .sort();

      return {
        name: domainName,
        skills: skillNames,
      };
    });
  } catch (error) {
    throw new Error("Failed to read skill domains from disk", { cause: error });
  }
}

/**
 * Displays the CLI help menu and command options.
 *
 * Formatted cleanly for terminal display with zero non-standard characters.
 *
 * @returns {void}
 */
function printHelpMenu() {
  console.log(LOTR_BANNER);
  console.log(`sauron v${VERSION} : Universal AI Agent Harness\n`);
  console.log("Usage: sauron <command> [options]\n");
  console.log("Commands:");
  console.log(
    "  init         Initialize sauron configuration and transpile to 19 runtimes",
  );
  console.log(
    "               Interactive setup (Recommended or Custom). Flags skip questions:",
  );
  console.log(
    "               --yes                           Use Recommended (or saved choices), no prompts",
  );
  console.log(
    "               --runtimes=claude,cursor|all    Runtimes to generate (AGENTS.md always included)",
  );
  console.log(
    "               --agents=fellowship|core|both|none  Subagents for .claude/agents/",
  );
  console.log(
    "               --skills=all|none|<dept,...>    Skills for .agents/skills/ (+ .claude/skills/)",
  );
  console.log(
    "               --caveman=off|lite|full|ultra   Default Caveman tier",
  );
  console.log(
    "               --no-commands                   Skip .claude/commands/",
  );
  console.log("  sync         Re-apply saved init choices without prompts");
  console.log(
    "  add <skill>  Add one or more modular skills to local project workspace",
  );
  console.log(
    "  graph [path] Generate AST codebase knowledge graph (json, md, html)",
  );
  console.log(
    "  status       Display registered runtimes, Fellowship agents, and skills",
  );
  console.log("  list-skills  List all registered skills organized by domain");
  console.log(
    "  find-skill <task> Rank skills for a task (--limit n, --json, --root dir)",
  );
  console.log(
    "  sync         Synchronize master configuration into target runtimes",
  );
  console.log("  diff         Show drift between lockfile pins and workspace");
  console.log("  mcp-index    Emit MCP skill index with skill:// resources");
  console.log("  trace-report Summarize Fellowship tracing events");
  console.log("  fitness      Run harness fitness checks with remediation");
  console.log("  worktree-plan Generate isolated git worktree assignments");
  console.log("  slop-scan    Score packages and scan unsafe sinks to SARIF");
  console.log(
    "  import       Migrate Cursor Copilot Windsurf configs to Sauron",
  );
  console.log("  registry-build Export governed catalog from approved entries");
  console.log("\nOptions:");
  console.log(
    "  --to <dir>   Target directory for added skills (default: .agents/skills)",
  );
  console.log("  --dry-run    Inspect actions without modifying files on disk");
  console.log("  --version    Display CLI version");
  console.log("  --help       Display help menu");
}

/**
 * Handles the `status` command by printing active runtimes, fellowship personas, and skill count.
 *
 * Provides developers and contributors with a quick health check of their Sauron installation.
 *
 * @returns {void}
 */
function executeStatusCommand() {
  console.log(LOTR_BANNER);
  console.log(`[STATUS] sauron v${VERSION}\n`);

  console.log(
    "--- The 19 Runtimes Bound by sauron (+ shared AGENTS.md core) ---",
  );
  for (const runtime of RUNTIMES) {
    console.log(`  [OK] ${runtime.name.padEnd(20)} -> ${runtime.file}`);
  }

  console.log("\n--- The Fellowship of 9 Sub-Agents ---");
  for (const agent of FELLOWSHIP) {
    console.log(`  [OK] ${agent.name.padEnd(10)} : ${agent.role}`);
  }

  const domainSummaries = querySkillDomains(SAURON_ROOT);
  const totalSkills = domainSummaries.reduce(
    (count, domain) => count + domain.skills.length,
    0,
  );

  console.log("\n--- Skill Ecosystem ---");
  console.log(
    `  [OK] ${totalSkills} ECC-standard skills across ${domainSummaries.length} domains`,
  );
}

/**
 * Handles the `list-skills` command by printing a structured catalog of all capabilities.
 *
 * @returns {void}
 */
function executeListSkillsCommand() {
  console.log(LOTR_BANNER);
  const domainSummaries = querySkillDomains(SAURON_ROOT);

  if (domainSummaries.length === 0) {
    console.log("[INFO] No skills currently registered.");
    return;
  }

  console.log("[SKILLS] Listing all registered skills:\n");
  for (const domain of domainSummaries) {
    console.log(
      `Domain: ${domain.name.toUpperCase()} (${domain.skills.length} skills)`,
    );
    for (const skill of domain.skills) {
      console.log(`  - ${skill}`);
    }
    console.log("");
  }
}

/**
 * Finds the absolute source path of a skill across all department folders.
 *
 * @param {string} rootDirectory - Base sauron root directory.
 * @param {string} skillIdentifier - Skill name (e.g., 'tdd-workflow') or path (e.g., 'quality/tdd-workflow').
 * @returns {{ sourcePath: string, skillName: string } | null}
 */
function resolveSkillSource(rootDirectory, skillIdentifier) {
  const skillsBase = path.join(rootDirectory, "skills");
  const normalizedInput = skillIdentifier.replace(/\\/g, "/").trim();

  // If specific path provided like 'quality/tdd-workflow' or 'skills/quality/tdd-workflow'
  const directCheck = normalizedInput.startsWith("skills/")
    ? path.join(rootDirectory, normalizedInput)
    : path.join(skillsBase, normalizedInput);

  if (
    fs.existsSync(directCheck) &&
    fs.existsSync(path.join(directCheck, "SKILL.md"))
  ) {
    return { sourcePath: directCheck, skillName: path.basename(directCheck) };
  }

  // Search across all department subdirectories
  const departments = fs
    .readdirSync(skillsBase, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dept of departments) {
    const candidatePath = path.join(skillsBase, dept, normalizedInput);
    if (
      fs.existsSync(candidatePath) &&
      fs.existsSync(path.join(candidatePath, "SKILL.md"))
    ) {
      return {
        sourcePath: candidatePath,
        skillName: path.basename(candidatePath),
      };
    }

    // Also search nested sub-suites (like enterprise-business, research-and-productivity)
    try {
      const subEntries = fs
        .readdirSync(path.join(skillsBase, dept), { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory());
      for (const sub of subEntries) {
        const nestedPath = path.join(
          skillsBase,
          dept,
          sub.name,
          normalizedInput,
        );
        if (
          fs.existsSync(nestedPath) &&
          fs.existsSync(path.join(nestedPath, "SKILL.md"))
        ) {
          return {
            sourcePath: nestedPath,
            skillName: path.basename(nestedPath),
          };
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  return null;
}

/**
 * Handles the `add` command by copying modular skills directly into the user project workspace.
 *
 * @param {string[]} skillNames - Names of the skills requested by the user.
 * @param {Object} options - Target destination directory and dryRun flags.
 * @param {string} [options.targetDir] - Destination folder (defaults to .agents/skills).
 * @param {boolean} [options.dryRun] - Dry-run simulation mode.
 * @returns {void}
 */
function executeAddCommand(skillNames, options) {
  console.log(LOTR_BANNER);
  if (!skillNames || skillNames.length === 0) {
    console.log(
      "[ERROR] Missing skill name. Usage: sauron add <skill-name> [--to <dir>]\n",
    );
    console.log("To view all available skills, run: sauron list-skills");
    process.exit(1);
  }

  const cwd = process.cwd();
  const defaultDir = options.targetDir || ".agents/skills";
  const destinationBase = path.isAbsolute(defaultDir)
    ? defaultDir
    : path.resolve(cwd, defaultDir);

  const modeTag = options.dryRun ? " (DRY-RUN MODE)" : "";
  const defaultNote = options.targetDir
    ? ""
    : " (default; override with --to <dir>)";
  console.log(
    `[ADD] Adding ${skillNames.length} skill(s) to ${path.relative(cwd, destinationBase) || destinationBase}${modeTag}${defaultNote}...\n`,
  );

  let addedCount = 0;
  for (const requestedSkill of skillNames) {
    const resolved = resolveSkillSource(SAURON_ROOT, requestedSkill);
    if (!resolved) {
      console.log(
        `  [NOT FOUND] "${requestedSkill}" could not be found in sauron skills registry.`,
      );
      continue;
    }

    const targetSkillDir = path.join(destinationBase, resolved.skillName);
    const statusLabel = options.dryRun ? "SIMULATED" : "ADDED";

    if (!options.dryRun) {
      fs.mkdirSync(targetSkillDir, { recursive: true });
      fs.cpSync(resolved.sourcePath, targetSkillDir, { recursive: true });
    }

    console.log(
      `  [${statusLabel.padEnd(9)}] ${resolved.skillName.padEnd(28)} -> ${path.relative(cwd, targetSkillDir)}`,
    );
    addedCount++;
  }

  const completionMessage = options.dryRun
    ? `\n[COMPLETE] Dry-run simulated adding ${addedCount} skill(s). Zero files written.`
    : `\n[COMPLETE] Successfully added ${addedCount} skill(s) to your workspace.`;
  console.log(completionMessage);
}

/** Valid Caveman Mode tiers accepted by `init --caveman`. */
const CAVEMAN_TIERS = Object.freeze(["off", "lite", "full", "ultra"]);

/**
 * Detects the package runner the user invoked Sauron with, for next-step hints.
 *
 * @returns {string} Command prefix such as `npx sauron-ai` or `pnpm dlx sauron-ai`.
 */
function detectRunner() {
  const agent = process.env["npm_config_user_agent"] ?? "";
  if (agent.startsWith("pnpm")) return "pnpm dlx sauron-ai";
  if (agent.startsWith("yarn")) return "yarn dlx sauron-ai";
  if (agent.startsWith("bun")) return "bunx sauron-ai";
  return "npx sauron-ai";
}

/**
 * Line reader shared by every init question. Buffers piped input so answers are
 * never lost between questions, and aborts cleanly on Ctrl+C or end of input.
 *
 * @returns {Promise<{ question: (text: string) => Promise<string>, close: () => void }>}
 */
async function createPrompter() {
  const { createInterface } = await import("node:readline");
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY === true,
  });
  /** @type {string[]} */
  const lines = [];
  /** @type {((line: string | null) => void) | null} */
  let waiter = null;
  let closed = false;
  rl.on("line", (line) => {
    if (waiter) {
      const resolve = waiter;
      waiter = null;
      resolve(line);
    } else {
      lines.push(line);
    }
  });
  rl.on("close", () => {
    closed = true;
    if (waiter) waiter(null);
  });
  rl.on("SIGINT", () => {
    console.log("\n[ABORTED] Nothing was written.");
    process.exit(130);
  });
  return {
    question(text) {
      process.stdout.write(text);
      const buffered = lines.shift();
      if (buffered !== undefined) {
        // Echo piped answers so the transcript reads like an interactive session.
        if (process.stdin.isTTY !== true) process.stdout.write(`${buffered}\n`);
        return Promise.resolve(buffered);
      }
      if (closed)
        return Promise.reject(
          new Error("Input ended before setup finished. Nothing was written."),
        );
      return new Promise((resolve, reject) => {
        waiter = (line) =>
          line === null
            ? reject(
                new Error(
                  "Input ended before setup finished. Nothing was written.",
                ),
              )
            : resolve(line);
      });
    },
    close() {
      rl.close();
    },
  };
}

/**
 * Asks one question; empty input returns the default.
 *
 * @param {{ question: (text: string) => Promise<string> }} prompter - Shared line reader.
 * @param {string} question - Prompt text.
 * @param {string} fallback - Value returned for empty input.
 * @param {(answer: string) => boolean} isValid - Validator for non-empty input.
 * @param {string} hint - Message shown on invalid input.
 * @returns {Promise<string>} The accepted answer.
 */
async function ask(prompter, question, fallback, isValid, hint) {
  for (;;) {
    const answer = (await prompter.question(`? ${question} [${fallback}]: `))
      .trim()
      .toLowerCase();
    if (answer === "") return fallback;
    if (isValid(answer)) return answer;
    console.log(`  ${hint}`);
  }
}

/**
 * Runs the shadcn-style init questions. Flags already given are not asked again.
 *
 * @param {{ question: (text: string) => Promise<string> }} rl - Shared line reader.
 * @param {import("../dist/adapters/init-plan.js").InitFlags} flags - Parsed flags.
 * @param {string[]} departments - Available skill departments.
 * @param {string} defaultCaveman - Caveman tier to offer as default.
 * @returns {Promise<import("../dist/adapters/init-plan.js").InitPlan>} Final plan.
 */
async function promptInitPlan(rl, flags, departments, defaultCaveman) {
  {
    console.log("Setup presets:");
    console.log(
      "  1) Recommended : AGENTS.md + Claude Code + all skills (.agents/skills) + Fellowship agents",
    );
    console.log("  2) Custom      : pick runtimes, agents, and skills");
    const preset = await ask(
      rl,
      "Setup",
      "1",
      (a) => a === "1" || a === "2",
      "Type 1 or 2.",
    );

    /** @type {import("../dist/adapters/init-plan.js").InitFlags} */
    const answers = { ...flags };
    if (preset === "2") {
      if (!answers.runtimes) {
        console.log("\nRuntimes (AGENTS.md is always included):");
        RUNTIME_IDS.forEach((id, i) =>
          console.log(`  ${String(i + 1).padStart(2)}) ${id}`),
        );
        const pick = await ask(
          rl,
          "Runtimes (numbers or ids, comma separated, or 'all')",
          "claude",
          (a) => {
            try {
              parseRuntimes(
                a.replace(/\b(\d+)\b/g, (n) => RUNTIME_IDS[Number(n) - 1] ?? n),
              );
              return true;
            } catch {
              return false;
            }
          },
          `Use numbers 1-${RUNTIME_IDS.length}, ids like claude,cursor, or 'all'.`,
        );
        answers.runtimes = parseRuntimes(
          pick.replace(/\b(\d+)\b/g, (n) => RUNTIME_IDS[Number(n) - 1] ?? n),
        );
      }
      if (!answers.agents && answers.runtimes.includes("claude")) {
        console.log("\nSubagents for .claude/agents/:");
        console.log(
          "  fellowship : 9 Fellowship agents (/gandalf, /frodo, ...)",
        );
        console.log("  core       : 69 specialist agents");
        console.log("  both | none");
        answers.agents = parseAgents(
          await ask(
            rl,
            "Subagents",
            "fellowship",
            (a) => AGENT_SETS.includes(a),
            `Choose: ${AGENT_SETS.join(", ")}.`,
          ),
        );
      }
      if (!answers.skills) {
        console.log(
          `\nSkills: all, none, or departments (${departments.join(", ")})`,
        );
        answers.skills = parseSkills(
          await ask(
            rl,
            "Skills",
            "all",
            (a) => {
              try {
                parseSkills(a, departments);
                return true;
              } catch {
                return false;
              }
            },
            "Use all, none, or a comma list of departments.",
          ),
          departments,
        );
      }
      if (
        answers.commands === undefined &&
        answers.runtimes.includes("claude")
      ) {
        answers.commands =
          (await ask(
            rl,
            "Install Sauron slash commands into .claude/commands/ (y/n)",
            "y",
            (a) => a === "y" || a === "n",
            "Type y or n.",
          )) === "y";
      }
    }

    if (!answers.caveman) {
      console.log(
        "\nCaveman Mode trims filler from agent replies. Code, paths, and commands stay verbatim.",
      );
      console.log(
        "  off : normal | lite : no filler | full : terse fragments | ultra : maximum compression",
      );
      answers.caveman = parseCaveman(
        await ask(
          rl,
          "Caveman tier",
          defaultCaveman,
          (a) => CAVEMAN_TIERS.includes(a),
          `Choose: ${CAVEMAN_TIERS.join(", ")}.`,
        ),
      );
    }
    return resolvePlan(answers);
  }
}

/**
 * Asks for a final yes/no confirmation. Defaults to yes.
 *
 * @param {{ question: (text: string) => Promise<string> }} prompter - Shared line reader.
 * @returns {Promise<boolean>} True when the user confirms.
 */
async function confirmPlan(prompter) {
  const answer = (await prompter.question("? Write these files (y/n) [y]: "))
    .trim()
    .toLowerCase();
  return answer === "" || answer === "y" || answer === "yes";
}

/**
 * Rewrites `caveman.default_mode` in sauron.config.yaml, keeping comments intact.
 *
 * @param {string} configPath - Absolute path to sauron.config.yaml.
 * @param {string} mode - Caveman tier to persist.
 * @returns {void}
 */
function setCavemanModeInConfig(configPath, mode) {
  const raw = fs.readFileSync(configPath, "utf8");
  const pattern = /^(\s*default_mode:\s*)"?[a-z]+"?/m;
  const next = pattern.test(raw)
    ? raw.replace(pattern, `$1"${mode}"`)
    : `${raw.replace(/\s*$/, "")}\n\ncaveman:\n  default_mode: "${mode}"\n`;
  if (next !== raw) {
    fs.writeFileSync(configPath, next, "utf8");
  }
}

/**
 * Saves the init choices under a top-level `init:` key so `sauron sync` reuses them.
 *
 * @param {string} configPath - Absolute path to sauron.config.yaml.
 * @param {import("../dist/adapters/init-plan.js").InitPlan} plan - Choices to persist.
 * @returns {void}
 */
function setInitPlanInConfig(configPath, plan) {
  const raw = fs.readFileSync(configPath, "utf8");
  const skills = Array.isArray(plan.skills)
    ? `[${plan.skills.join(", ")}]`
    : plan.skills;
  const block = [
    "init:",
    `  runtimes: [${plan.runtimes.join(", ")}]`,
    `  agents: ${plan.agents}`,
    `  skills: ${skills}`,
    `  commands: ${plan.commands}`,
    "",
  ].join("\n");
  const pattern = /^init:\r?\n(?:[ \t]+.*(?:\r?\n|$))*/m;
  const next = pattern.test(raw)
    ? raw.replace(pattern, block)
    : `${raw.replace(/\s*$/, "")}\n\n# Choices from \`sauron init\`; \`sauron sync\` reuses them.\n${block}`;
  if (next !== raw) {
    fs.writeFileSync(configPath, next, "utf8");
  }
}

/**
 * Reads sauron.config.yaml, or returns an empty object when missing or invalid.
 *
 * @param {string} configPath - Absolute path to sauron.config.yaml.
 * @returns {Record<string, unknown>} Parsed config.
 */
function readConfig(configPath) {
  if (!fs.existsSync(configPath)) return {};
  try {
    const parsed = parseYaml(fs.readFileSync(configPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Initializes a repository: asks for (or reads) the install plan, then writes the
 * shared AGENTS.md core, the selected runtime scaffolds, skills, subagents, and commands.
 *
 * Execution flow:
 * 1. Resolve the plan from flags, prompts (TTY), or the saved `init:` config (sync).
 * 2. Show a summary and confirm (interactive only). Nothing is written before this.
 * 3. Bootstrap `sauron.config.yaml` and persist the choices.
 * 4. Write every file through ConflictManager (merge, never replace user files).
 *
 * @param {InitOptions} options - Execution options.
 * @returns {Promise<void>}
 */
async function executeInitCommand(options) {
  const { dryRun, argv, isSync } = options;
  console.log(LOTR_BANNER);
  console.log(
    `[${isSync ? "SYNC" : "INIT"}] ${isSync ? "Re-syncing" : "Initializing"} sauron in current workspace${dryRun ? " (DRY-RUN MODE)" : ""}...\n`,
  );

  const currentWorkingDirectory = process.cwd();
  const targetConfigPath = path.join(
    currentWorkingDirectory,
    "sauron.config.yaml",
  );
  const defaultTemplatePath = path.join(
    SAURON_ROOT,
    "config",
    "sauron.config.yaml",
  );
  const isNewConfig = !fs.existsSync(targetConfigPath);
  const config = readConfig(targetConfigPath);
  const departments = listDepartments(SAURON_ROOT);

  const flags = parseInitFlags(argv, departments);
  const savedPlan = planFromConfig(config["init"], departments);
  const savedCaveman = /** @type {Record<string, unknown> | undefined} */ (
    config["caveman"]
  )?.["default_mode"];
  const defaultCaveman =
    typeof savedCaveman === "string" && CAVEMAN_TIERS.includes(savedCaveman)
      ? savedCaveman
      : "full";
  const assumeYes = argv.includes("--yes") || argv.includes("-y");
  // `--interactive` forces the prompts without a TTY (piped answers, tests).
  const interactive =
    !isSync &&
    !assumeYes &&
    (process.stdin.isTTY === true || argv.includes("--interactive"));

  /** @type {import("../dist/adapters/init-plan.js").InitPlan} */
  let plan;
  /** @type {{ question: (text: string) => Promise<string>, close: () => void } | undefined} */
  let prompter;
  if (interactive) {
    prompter = await createPrompter();
    plan = await promptInitPlan(prompter, flags, departments, defaultCaveman);
  } else {
    plan = resolvePlan(
      { caveman: /** @type {any} */ (defaultCaveman), ...flags },
      savedPlan ??
        (isSync
          ? resolvePlan({
              runtimes: [...RUNTIME_IDS],
              skills: "none",
              agents: "none",
              commands: false,
            })
          : PRESET_RECOMMENDED),
    );
    if (!isSync && !assumeYes && Object.keys(flags).length === 0) {
      console.log(
        "  [NOTICE] No terminal detected and no flags given: using the Recommended preset.",
      );
    }
  }

  const extras = buildInstallOutputs(SAURON_ROOT, plan);
  const skillCount = new Set(
    extras
      .filter((e) => e.relativePath.startsWith(".agents/skills/"))
      .map((e) => e.relativePath.split("/")[2]),
  ).size;
  const agentCount = extras.filter((e) =>
    e.relativePath.startsWith(".claude/agents/"),
  ).length;
  const commandCount = extras.filter((e) =>
    e.relativePath.startsWith(".claude/commands/"),
  ).length;

  console.log("\nPlan:");
  console.log(`  Runtimes  : AGENTS.md + ${plan.runtimes.join(", ")}`);
  console.log(
    `  Skills    : ${skillCount} into .agents/skills/${plan.runtimes.includes("claude") && skillCount > 0 ? " and .claude/skills/" : ""}`,
  );
  console.log(
    `  Subagents : ${agentCount} into .claude/agents/ (${plan.runtimes.includes("claude") ? plan.agents : "Claude Code not selected"})`,
  );
  console.log(`  Commands  : ${commandCount} into .claude/commands/`);
  console.log(`  Caveman   : ${plan.caveman}`);
  console.log(
    "  Safety    : existing files are merged, never replaced; backups in .sauron/backups/\n",
  );

  const confirmed = prompter ? await confirmPlan(prompter) : true;
  prompter?.close();
  if (!confirmed) {
    console.log("[ABORTED] Nothing was written.");
    return;
  }

  // Preserve existing user configuration if already present; copy template if new.
  if (isNewConfig && fs.existsSync(defaultTemplatePath)) {
    if (!dryRun) {
      fs.copyFileSync(defaultTemplatePath, targetConfigPath);
    }
    console.log(
      `  [CONFIG] sauron.config.yaml ${dryRun ? "(simulated)" : "created"} at ${targetConfigPath}`,
    );
  } else if (!isNewConfig) {
    console.log(
      "  [CONFIG] Existing sauron.config.yaml detected. Preserving user configuration.",
    );
  }
  if (!dryRun && fs.existsSync(targetConfigPath)) {
    setCavemanModeInConfig(targetConfigPath, plan.caveman);
    setInitPlanInConfig(targetConfigPath, plan);
  }

  console.log(
    `\n[WRITING] AGENTS.md core + ${plan.runtimes.length} runtime(s) + ${extras.length} skill/agent/command file(s)...`,
  );

  const transpiler = new Transpiler({
    workspaceRoot: currentWorkingDirectory,
    cavemanMode: plan.caveman,
    sauronRoot: SAURON_ROOT,
    dryRun,
  });
  const report = transpiler.transpileAll({
    dryRun,
    targetRuntimes: plan.runtimes,
    extras,
  });

  // Runtime files are listed one by one; installed assets are summarized by action.
  /** @type {Record<string, number>} */
  const installCounts = {};
  for (const file of report.files) {
    if (
      file.runtime === "install" &&
      file.action !== "merged" &&
      file.action !== "skipped"
    ) {
      installCounts[file.action] = (installCounts[file.action] ?? 0) + 1;
      continue;
    }
    const backupNotice = file.backupPath
      ? ` [backed up -> ${file.backupPath}]`
      : "";
    console.log(
      `  [${file.action.toUpperCase().padEnd(9)}] ${file.runtime.padEnd(12)} -> ${file.filePath}${backupNotice}`,
    );
  }
  const installSummary = Object.entries(installCounts)
    .map(([action, count]) => `${count} ${action}`)
    .join(", ");
  if (installSummary) {
    console.log(`  [INSTALL  ] skills, agents, commands -> ${installSummary}`);
  }

  console.log(
    dryRun
      ? `\n[COMPLETE] Dry-run simulated ${report.totalGenerated} files. Zero files modified.`
      : `\n[COMPLETE] sauron synchronized ${report.totalGenerated} files.`,
  );
  if (!dryRun && !isSync) {
    const runner = detectRunner();
    console.log("\nNext steps:");
    console.log(`  - Add a skill later:   ${runner} add <skill>`);
    console.log(`  - Re-apply after edits: ${runner} sync`);
    if (plan.runtimes.includes("claude")) {
      console.log(
        "  - In Claude Code: try /gandalf <goal>, or @frodo, or /<skill-name>",
      );
    }
  }
}

/**
 * Handles the `graph` command by generating an AST knowledge graph of the codebase.
 *
 * @param {string} [targetPath="."] - Target directory to scan.
 * @returns {Promise<void>}
 */
async function executeGraphCommand(targetPath = ".") {
  const resolvedTarget = path.resolve(process.cwd(), targetPath);
  console.log(LOTR_BANNER);
  console.log(`[GRAPH] Analyzing AST knowledge graph for: ${resolvedTarget}`);

  try {
    const { buildCodebaseGraph } =
      await import("../scripts/graph/generate-graph.mjs");
    const result = buildCodebaseGraph(resolvedTarget);

    console.log(`  [AST] Extracted ${result.nodes.length} nodes (files)`);
    console.log(
      `  [AST] Extracted ${result.edges.length} edges (dependencies)`,
    );
    console.log(
      `  [AST] Detected ${result.cycles.length} circular dependency cycles`,
    );
    console.log(
      `\n[COMPLETE] Knowledge graph artifacts generated in .sauron/graph/`,
    );
    console.log(`  - .sauron/graph/graph.json`);
    console.log(`  - .sauron/graph/graph-report.md`);
    console.log(`  - .sauron/graph/graph.html`);
  } catch (error) {
    console.error(
      `[ERROR] Failed to generate codebase graph: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `diff` command by comparing lockfile pins against workspace checksums.
 *
 * Reads sauron-skills.lock.json with fail-closed validation and reports drift.
 *
 * @returns {Promise<void>}
 */
async function executeDiffCommand() {
  console.log(LOTR_BANNER);
  const lockPath = path.join(process.cwd(), "sauron-skills.lock.json");
  if (!fs.existsSync(lockPath)) {
    console.log(
      "[DIFF] No sauron-skills.lock.json found. Run with locked skills first.",
    );
    return;
  }
  try {
    const { parseLockfile, detectDrift, formatDriftReport } =
      await import("../dist/adapters/skills-lock.js");
    const raw = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    const lockfile = parseLockfile(raw);
    const currentChecksums = {};
    const availableVersions = {};
    const report = detectDrift(lockfile, currentChecksums, availableVersions);
    console.log("[DIFF] Skills lockfile drift:");
    console.log(formatDriftReport(report));
  } catch (error) {
    console.error(
      `[ERROR] Diff failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `mcp-index` command by emitting SEP-2640 skill index JSON.
 *
 * @returns {Promise<void>}
 */
async function executeMcpIndexCommand() {
  console.log(LOTR_BANNER);
  try {
    const { buildSkillIndex } = await import("../dist/adapters/mcp-skills.js");
    const domains = querySkillDomains(SAURON_ROOT);
    const skills = [];
    for (const domain of domains) {
      for (const skill of domain.skills) {
        skills.push({
          name: skill,
          description: `Sauron ${domain.name} capability for ${skill}.`,
        });
      }
    }
    const index = buildSkillIndex(skills);
    console.log(JSON.stringify(index, null, 2));
  } catch (error) {
    console.error(
      `[ERROR] MCP index failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `fitness` command by running layer and doc checks.
 *
 * @param {string[]} args - CLI arguments with optional target path.
 * @returns {Promise<void>}
 */
async function executeFitnessCommand(args) {
  console.log(LOTR_BANNER);
  const target = args[0] ?? "adapters";
  const resolved = path.resolve(process.cwd(), target);
  try {
    const { checkLayerImports, formatFitnessReport } =
      await import("../dist/adapters/fitness.js");
    const findings = [];
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      const entries = fs.readdirSync(resolved);
      for (const entry of entries) {
        if (entry.endsWith(".ts") || entry.endsWith(".mjs")) {
          const full = path.join(resolved, entry);
          const content = fs.readFileSync(full, "utf8");
          findings.push(
            ...checkLayerImports(path.relative(process.cwd(), full), content),
          );
        }
      }
    }
    console.log(formatFitnessReport(findings));
  } catch (error) {
    console.error(
      `[ERROR] Fitness failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `worktree-plan` command by generating isolated assignments.
 *
 * @param {string[]} args - Task names to assign.
 * @returns {Promise<void>}
 */
async function executeWorktreePlanCommand(args) {
  console.log(LOTR_BANNER);
  if (args.length === 0) {
    console.log("[ERROR] Usage: sauron worktree-plan <task...>");
    process.exit(1);
  }
  try {
    const { buildWorktreePlan, formatWorktreeCommands } =
      await import("../dist/adapters/worktree.js");
    const agents = [
      "frodo",
      "aragorn",
      "legolas",
      "gimli",
      "boromir",
      "merry",
      "pippin",
      "samwise",
      "gandalf",
    ];
    const assignments = buildWorktreePlan(
      args,
      agents.slice(0, args.length),
      "execute",
    );
    console.log(formatWorktreeCommands(assignments));
  } catch (error) {
    console.error(
      `[ERROR] Worktree plan failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `slop-scan` command by scoring packages and scanning sinks.
 *
 * @param {string[]} args - Package names or file paths to review.
 * @returns {Promise<void>}
 */
async function executeSlopScanCommand(args) {
  console.log(LOTR_BANNER);
  try {
    const { scorePackage, scanUnsafeSinks, toSarif } =
      await import("../dist/adapters/slopsquat.js");
    const findings = [];
    for (const target of args) {
      if (
        fs.existsSync(path.resolve(target)) &&
        fs.statSync(path.resolve(target)).isFile()
      ) {
        const content = fs.readFileSync(path.resolve(target), "utf8");
        findings.push(...scanUnsafeSinks(target, content));
      } else {
        const verdict = scorePackage({
          name: target,
          exists: false,
          ageDays: 0,
          weeklyDownloads: 0,
          maintainers: 0,
        });
        console.log(
          `  [BLOCK] ${verdict.name} risk=${verdict.risk} ${verdict.reason}`,
        );
      }
    }
    if (findings.length > 0) {
      console.log(toSarif(findings));
    } else if (args.length > 0) {
      console.log("[SLOP] File scan complete with zero sink findings.");
    } else {
      console.log("[SLOP] Usage: sauron slop-scan <package|file...>");
    }
  } catch (error) {
    console.error(
      `[ERROR] Slop scan failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `import` command by detecting platform configs and previewing migration.
 *
 * @param {string[]} args - CLI arguments with dry-run support.
 * @returns {Promise<void>}
 */
async function executeImportCommand(args) {
  console.log(LOTR_BANNER);
  const isDryRun = args.includes("--dry-run");
  try {
    const { detectPlatforms, buildImportPlan, formatImportPlan } =
      await import("../dist/adapters/importer.js");
    const cwd = process.cwd();
    const entries = [];
    const candidates = [
      "CLAUDE.md",
      "AGENTS.md",
      "GEMINI.md",
      ".cursorrules",
      ".windsurfrules",
      ".clinerules",
      ".github/copilot-instructions.md",
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(path.join(cwd, candidate))) {
        entries.push(candidate);
      }
    }
    if (entries.length === 0) {
      console.log("[IMPORT] No platform configs detected for migration.");
      return;
    }
    console.log(
      `[IMPORT] Detected platforms: ${detectPlatforms(entries).join(", ")}${isDryRun ? " (DRY-RUN)" : ""}`,
    );
    console.log(formatImportPlan(buildImportPlan(entries)));
  } catch (error) {
    console.error(
      `[ERROR] Import failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Resolves the skills directory to search: explicit root, then the workspace, then the Sauron package.
 *
 * @param {string | undefined} explicitRoot - Value of --root, when given.
 * @returns {{ skillsRoot: string, baseDir: string }}
 */
function resolveFinderRoot(explicitRoot) {
  const cwd = process.cwd();
  if (explicitRoot !== undefined) {
    return { skillsRoot: path.resolve(cwd, explicitRoot), baseDir: cwd };
  }
  for (const candidate of [".agents/skills", "skills"]) {
    const full = path.join(cwd, candidate);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      return { skillsRoot: full, baseDir: cwd };
    }
  }
  return { skillsRoot: path.join(SAURON_ROOT, "skills"), baseDir: SAURON_ROOT };
}

/**
 * Handles the `find-skill` command by ranking local skills against a task description.
 *
 * @param {string[]} args - Arguments after the command name.
 * @returns {Promise<void>}
 */
async function executeFindSkillCommand(args) {
  const asJson = args.includes("--json");
  /** @type {string[]} */
  const queryParts = [];
  let limit = 5;
  /** @type {string | undefined} */
  let explicitRoot;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") continue;
    if (arg === "--limit") {
      limit = Number(args[index + 1]);
      index += 1;
    } else if (arg === "--root") {
      explicitRoot = args[index + 1];
      index += 1;
    } else if (arg !== undefined) {
      queryParts.push(arg);
    }
  }
  const query = queryParts.join(" ").trim();

  try {
    if (query === "") {
      throw new Error('Missing task. Usage: sauron find-skill "<task>"');
    }
    const { loadSkillCatalog, rankSkills, formatFinderReport } =
      await import("../dist/adapters/skill-finder.js");
    const { skillsRoot, baseDir } = resolveFinderRoot(explicitRoot);
    const catalog = loadSkillCatalog(skillsRoot, baseDir);
    const results = rankSkills(catalog.documents, query, limit);

    if (asJson) {
      console.log(
        JSON.stringify(
          {
            query,
            indexed: catalog.documents.length,
            rejected: catalog.rejected,
            results,
          },
          null,
          2,
        ),
      );
      return;
    }
    console.log(formatFinderReport(results, query));
    console.log(
      `
[INFO] Searched ${catalog.documents.length} skills in ${path.relative(process.cwd(), skillsRoot) || "."}.`,
    );
    if (catalog.rejected.length > 0) {
      console.log(
        `[WARN] Skipped ${catalog.rejected.length} skill files with invalid frontmatter. Run with --json for the list.`,
      );
    }
  } catch (error) {
    console.error(
      `[ERROR] Find skill failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `registry-build` command by exporting approved catalog entries.
 *
 * @returns {Promise<void>}
 */
async function executeRegistryBuildCommand() {
  console.log(LOTR_BANNER);
  try {
    const { buildCatalog } = await import("../dist/adapters/registry.js");
    const catalog = buildCatalog([]);
    console.log(JSON.stringify(catalog, null, 2));
    console.log(
      "\n[COMPLETE] Registry catalog exports published entries only. Add entries to provision catalog.",
    );
  } catch (error) {
    console.error(
      `[ERROR] Registry build failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * Handles the `trace-report` command by summarizing tracing events file.
 *
 * @param {string[]} args - Optional path to JSON events file.
 * @returns {Promise<void>}
 */
async function executeTraceReportCommand(args) {
  console.log(LOTR_BANNER);
  const target = args[0] ?? ".sauron/traces.json";
  const resolved = path.resolve(process.cwd(), target);
  if (!fs.existsSync(resolved)) {
    console.log(
      `[TRACE] No trace file at ${target}. Emit events first with opt-in hooks.`,
    );
    return;
  }
  try {
    const { validateTraceEvent, summarizeTraces, formatTraceSummary } =
      await import("../dist/adapters/tracing.js");
    const raw = JSON.parse(fs.readFileSync(resolved, "utf8"));
    if (!Array.isArray(raw)) {
      throw new Error("Trace file must contain an array");
    }
    const events = raw.map((item) => validateTraceEvent(item));
    console.log(formatTraceSummary(summarizeTraces(events)));
  } catch (error) {
    console.error(
      `[ERROR] Trace report failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

/**
 * CLI dispatcher resolving arguments and executing corresponding command functions.
 *
 * @param {string[]} commandLineArguments - Command-line arguments passed from process.argv.
 * @returns {void}
 */
function main(commandLineArguments) {
  const primaryCommand = commandLineArguments[0] ?? "";
  const isHelpRequested =
    !primaryCommand ||
    primaryCommand === "--help" ||
    primaryCommand === "-h" ||
    commandLineArguments.includes("--help");

  if (isHelpRequested) {
    printHelpMenu();
    process.exit(0);
  }

  const isVersionRequested =
    primaryCommand === "--version" ||
    primaryCommand === "-v" ||
    commandLineArguments.includes("--version");

  if (isVersionRequested) {
    console.log(`sauron v${VERSION}`);
    process.exit(0);
  }

  const isDryRun = commandLineArguments.includes("--dry-run");

  // Route commands to their respective controllers.
  switch (primaryCommand) {
    case "init":
    case "sync":
      executeInitCommand({
        dryRun: isDryRun,
        argv: commandLineArguments.slice(1),
        isSync: primaryCommand === "sync",
      }).catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(
          `${error instanceof InitPlanError ? "[INVALID FLAG]" : "[ERROR]"} ${message}`,
        );
        process.exit(1);
      });
      break;
    case "graph": {
      const targetDir = commandLineArguments[1] || ".";
      executeGraphCommand(targetDir);
      break;
    }
    case "add": {
      // Parse skill names and --to argument
      const toIndex = commandLineArguments.indexOf("--to");
      let targetDir = undefined;
      if (toIndex !== -1 && commandLineArguments[toIndex + 1]) {
        targetDir = commandLineArguments[toIndex + 1];
      }
      const skillArgs = commandLineArguments
        .slice(1)
        .filter((arg, idx, arr) => {
          if (arg === "--dry-run") return false;
          if (arg === "--to") return false;
          if (idx > 0 && arr[idx - 1] === "--to") return false;
          return true;
        });
      executeAddCommand(skillArgs, { targetDir, dryRun: isDryRun });
      break;
    }
    case "status":
      executeStatusCommand();
      break;
    case "list-skills":
      executeListSkillsCommand();
      break;
    case "find-skill":
      executeFindSkillCommand(commandLineArguments.slice(1));
      break;
    case "diff":
      executeDiffCommand();
      break;
    case "mcp-index":
      executeMcpIndexCommand();
      break;
    case "fitness":
      executeFitnessCommand(commandLineArguments.slice(1));
      break;
    case "worktree-plan":
      executeWorktreePlanCommand(
        commandLineArguments.slice(1).filter((arg) => arg !== "--dry-run"),
      );
      break;
    case "slop-scan":
      executeSlopScanCommand(commandLineArguments.slice(1));
      break;
    case "import":
      executeImportCommand(commandLineArguments.slice(1));
      break;
    case "registry-build":
      executeRegistryBuildCommand();
      break;
    case "trace-report":
      executeTraceReportCommand(commandLineArguments.slice(1));
      break;
    default:
      console.log(`[ERROR] Unknown command: "${primaryCommand}"`);
      printHelpMenu();
      process.exit(1);
  }
}

main(process.argv.slice(2));
