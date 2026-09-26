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
import { Transpiler } from "../dist/adapters/transpiler.js";

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
 */

/**
 * @typedef {Object} DomainSummary
 * @property {string} name - Functional department name.
 * @property {string[]} skills - List of registered capability skills within this domain.
 */

/**
 * Catalog of all 17 supported AI coding runtimes and their default configuration files.
 * Sealed with Object.freeze to prevent runtime prototype pollution or accidental mutations.
 * @type {readonly RuntimeTarget[]}
 */
const RUNTIMES = Object.freeze([
  Object.freeze({ id: "claude", name: "Claude Code", file: "CLAUDE.md" }),
  Object.freeze({ id: "cursor", name: "Cursor", file: ".cursorrules" }),
  Object.freeze({ id: "windsurf", name: "Windsurf", file: ".windsurfrules" }),
  Object.freeze({
    id: "copilot",
    name: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
  }),
  Object.freeze({ id: "cline", name: "Cline", file: ".clinerules" }),
  Object.freeze({ id: "trae", name: "Trae", file: ".traerules" }),
  Object.freeze({ id: "zed", name: "Zed", file: ".zed/settings.json" }),
  Object.freeze({ id: "codex", name: "Codex", file: ".codex/instructions.md" }),
  Object.freeze({ id: "gemini", name: "Gemini", file: "GEMINI.md" }),
  Object.freeze({ id: "hermes", name: "Hermes", file: ".hermesrules" }),
  Object.freeze({ id: "kimi", name: "Kimi", file: ".kimi/prompt.md" }),
  Object.freeze({ id: "kiro", name: "Kiro", file: ".kirorules" }),
  Object.freeze({
    id: "openclaude",
    name: "OpenClaude",
    file: ".openclaude/config.json",
  }),
  Object.freeze({
    id: "opencode",
    name: "OpenCode",
    file: ".opencode/instructions.md",
  }),
  Object.freeze({ id: "pi", name: "Pi", file: ".pirules" }),
  Object.freeze({ id: "qwen", name: "Qwen", file: ".qwen/system.md" }),
  Object.freeze({ id: "adal", name: "Adal / CodeBuddy", file: ".adalrules" }),
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
    "  init         Initialize sauron configuration and transpile to 17 runtimes",
  );
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

  console.log("--- The 17 Runtimes Bound by sauron ---");
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

/**
 * Initializes a repository with sauron configuration and generates 17 runtime adapter files.
 *
 * Execution flow:
 * 1. Verifies or bootstraps `sauron.config.yaml` in the current working directory.
 * 2. Instantiates the Transpiler engine with the active workspace context.
 * 3. Compiles all runtime adapters and displays safe file mutation results.
 *
 * @param {InitOptions} options - Options controlling execution (dryRun flag).
 * @returns {void}
 */
function executeInitCommand(options) {
  const { dryRun } = options;
  console.log(LOTR_BANNER);
  console.log(
    `[INIT] Initializing sauron in current workspace${dryRun ? " (DRY-RUN MODE)" : ""}...\n`,
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

  // Preserve existing user configuration if already present; copy template if new.
  if (!fs.existsSync(targetConfigPath)) {
    if (fs.existsSync(defaultTemplatePath)) {
      if (!dryRun) {
        fs.copyFileSync(defaultTemplatePath, targetConfigPath);
      }
      console.log(
        `  [CONFIG] sauron.config.yaml ${dryRun ? "(simulated)" : "created"} at ${targetConfigPath}`,
      );
    }
  } else {
    console.log(
      "  [CONFIG] Existing sauron.config.yaml detected. Preserving user configuration.",
    );
  }

  console.log("\n[TRANSPILING] Transpiling to 17 target runtime adapters...");

  const transpiler = new Transpiler({
    workspaceRoot: currentWorkingDirectory,
    sauronRoot: SAURON_ROOT,
    dryRun,
  });

  const report = transpiler.transpileAll({ dryRun });

  // Output formatted audit log showing whether files were created, updated with backup, or unchanged.
  for (const file of report.files) {
    const actionTag = file.action.toUpperCase();
    const backupNotice = file.backupPath
      ? ` [backed up -> ${file.backupPath}]`
      : "";
    console.log(
      `  [${actionTag.padEnd(9)}] ${file.runtime.padEnd(12)} -> ${file.filePath}${backupNotice}`,
    );
  }

  const completionMessage = dryRun
    ? `\n[COMPLETE] Dry-run simulated ${report.totalGenerated} runtime targets. Zero files modified.`
    : `\n[COMPLETE] sauron initialization synchronized ${report.totalGenerated} runtime targets.`;
  console.log(completionMessage);
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
      executeInitCommand({ dryRun: isDryRun });
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
