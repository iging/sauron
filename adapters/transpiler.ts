/// <reference types="node" />
/**
 * @fileoverview Universal Transpiler Core Engine.
 * Converts Sauron master configuration and Fellowship specs into 17 target runtime adapters.
 * Strictly adheres to sauron typescript-standards. No barrel files.
 *
 * The Transpiler acts as the central orchestrator for multi-agent synchronization.
 * It reads the workspace context, parses Fellowship agent definitions, compiles
 * available department skills, and delegates file generation to registered RuntimeAdapters
 * while routing all filesystem writes through the safe ConflictManager.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { ConflictManager } from "./conflict-manager.js";
import { ClaudeAdapter } from "./claude.js";
import { CursorAdapter } from "./cursor.js";
import { WindsurfAdapter } from "./windsurf.js";
import { CopilotAdapter } from "./copilot.js";
import { ClineAdapter } from "./cline.js";
import { TraeAdapter } from "./trae.js";
import { ZedAdapter } from "./zed.js";
import { CodexAdapter } from "./codex.js";
import { VSCodeAdapter } from "./vscode.js";
import { GeminiAdapter } from "./gemini.js";
import { QwenAdapter } from "./qwen.js";
import { KimiAdapter } from "./kimi.js";
import { KiroAdapter } from "./kiro.js";
import { HermesAdapter } from "./hermes.js";
import { OpenClaudeAdapter } from "./openclaude.js";
import { OpenCodeAdapter } from "./opencode.js";
import { PiAdapter } from "./pi.js";
import { AdalAdapter } from "./adal.js";
import { CodeBuddyAdapter } from "./codebuddy.js";

import type {
  FellowshipAgentIR,
  SkillIR,
  TranspileContext,
  TranspileOutput,
  RuntimeAdapter,
  WriteFileResult,
} from "./types.js";

/**
 * Configuration options supplied to the Transpiler engine.
 */
export interface TranspileOptions {
  /** Target workspace root directory where agent files are deployed. */
  workspaceRoot: string;
  /** Root directory containing Sauron core assets, skills, and fellowship specs. */
  sauronRoot?: string;
  /** Optional custom path to sauron configuration file. */
  configPath?: string;
  /** When true, analyzes output without writing any files to disk. */
  dryRun?: boolean;
  /** Optional array of adapter IDs to restrict transpilation to specific runtimes. */
  targetRuntimes?: string[];
}

/**
 * Summary report returned after executing full transpilation across runtimes.
 */
export interface TranspileReport {
  /** Name of the project transpiled. */
  project: string;
  /** Version of the Sauron harness. */
  version: string;
  /** Whether the operation was executed in dry-run mode. */
  dryRun: boolean;
  /** Total number of configuration and instruction files emitted. */
  totalGenerated: number;
  /** Individual status records for every generated file. */
  files: WriteFileResult[];
}

/**
 * Multi-runtime compilation engine.
 *
 * Coordinates parsing agent definitions, assembling intermediate representations,
 * and dispatching generation jobs to tool-specific adapters.
 */
export class Transpiler {
  /** Absolute path to the user's workspace directory. */
  private readonly workspaceRoot: string;
  /** Absolute path to Sauron installation assets. */
  private readonly sauronRoot: string;
  /** Safe file mutation and backup manager. */
  private readonly conflictManager: ConflictManager;
  /** Map of registered adapters keyed by runtime ID. */
  private readonly adapters: Map<string, RuntimeAdapter>;

  /**
   * Constructs and configures a Transpiler instance with registered adapters.
   *
   * @param options - Initialization options including workspace root and optional flags.
   */
  public constructor(options: TranspileOptions) {
    this.workspaceRoot = path.resolve(options.workspaceRoot);
    if (options.sauronRoot) {
      this.sauronRoot = path.resolve(options.sauronRoot);
    } else if (fs.existsSync(path.join(this.workspaceRoot, "core"))) {
      this.sauronRoot = this.workspaceRoot;
    } else {
      this.sauronRoot = path.resolve(this.workspaceRoot, "sauron");
    }
    this.conflictManager = new ConflictManager(this.workspaceRoot);
    this.adapters = new Map();

    // Registry of all 17+ supported AI coding runtimes.
    // Each adapter owns its tool-specific formatting while remaining decoupled from disk I/O.
    const adapterList: RuntimeAdapter[] = [
      new ClaudeAdapter(),
      new CursorAdapter(),
      new WindsurfAdapter(),
      new CopilotAdapter(),
      new ClineAdapter(),
      new TraeAdapter(),
      new ZedAdapter(),
      new CodexAdapter(),
      new VSCodeAdapter(),
      new GeminiAdapter(),
      new QwenAdapter(),
      new KimiAdapter(),
      new KiroAdapter(),
      new HermesAdapter(),
      new OpenClaudeAdapter(),
      new OpenCodeAdapter(),
      new PiAdapter(),
      new AdalAdapter(),
      new CodeBuddyAdapter(),
    ];

    for (const adapter of adapterList) {
      this.adapters.set(adapter.id, adapter);
    }
  }

  /**
   * Loads Fellowship agents from markdown definitions in `core/fellowship/*.md`.
   *
   * Falls back to standard hardcoded defaults if directory is missing or unreadable,
   * ensuring the harness functions even before full specification download.
   *
   * @returns Array of FellowshipAgentIR persona definitions.
   */
  public loadFellowship(): FellowshipAgentIR[] {
    const fellowshipDir = path.join(this.sauronRoot, "core", "fellowship");
    if (!fs.existsSync(fellowshipDir)) {
      return this.getDefaultFellowship();
    }

    try {
      const files = fs
        .readdirSync(fellowshipDir)
        .filter((f: string): boolean => f.endsWith(".md"));
      const agents: FellowshipAgentIR[] = [];

      for (const file of files) {
        const fullPath = path.join(fellowshipDir, file);
        const content = fs.readFileSync(fullPath, "utf8");
        const agent = this.parseAgentMarkdown(file.replace(".md", ""), content);
        agents.push(agent);
      }

      return agents.length > 0 ? agents : this.getDefaultFellowship();
    } catch {
      return this.getDefaultFellowship();
    }
  }

  /**
   * Discovers and compiles modular skills from `core/skills/`.
   *
   * Traverses functional department subdirectories and constructs intermediate
   * representation objects for cataloging across adapter outputs.
   *
   * @returns Array of SkillIR representations.
   */
  public loadSkills(): SkillIR[] {
    const skills: SkillIR[] = [];
    const coreSkillsDir = path.join(this.sauronRoot, "core", "skills");

    if (fs.existsSync(coreSkillsDir)) {
      const departments = fs.readdirSync(coreSkillsDir);
      for (const dep of departments) {
        const depPath = path.join(coreSkillsDir, dep);
        if (fs.statSync(depPath).isDirectory()) {
          const files = fs
            .readdirSync(depPath)
            .filter((f: string): boolean => f.endsWith(".md"));
          for (const file of files) {
            const skillId = file.replace(".md", "");
            skills.push({
              id: skillId,
              name: skillId
                .split("-")
                .map(
                  (w: string): string => w.charAt(0).toUpperCase() + w.slice(1),
                )
                .join(" "),
              department: dep,
              ownerAgent: "fellowship",
              triggerCommand: `/${skillId}`,
              summary: `Engineering skill for ${dep} department.`,
            });
          }
        }
      }
    }

    return skills;
  }

  /**
   * Assembles the unified TranspileContext Intermediate Representation.
   *
   * Merges project properties, loaded fellowship personas, discovered skills,
   * standard writing rules, and core anti-patterns.
   *
   * @param configOverrides - Optional partial context to override defaults.
   * @returns Fully populated TranspileContext object ready for adapter consumption.
   */
  public buildContext(
    configOverrides?: Partial<TranspileContext>,
  ): TranspileContext {
    return {
      projectName:
        configOverrides?.projectName || path.basename(this.workspaceRoot),
      projectDescription:
        configOverrides?.projectDescription ||
        "Production codebase governed by Sauron Universal Agent Harness.",
      version: configOverrides?.version || "1.0.0",
      fellowship: this.loadFellowship(),
      skills: this.loadSkills(),
      rules: [
        "Present tense, active voice, English language exclusively.",
        "Zero emojis across all code files, comments, and commit messages.",
        "Prohibit Latin abbreviations: use 'for example', 'that is', 'and so forth'.",
        "Prohibit em dashes: use colons, parentheses, or separate sentences.",
        "Strict Red-Green-Refactor TDD required before touching production code.",
        "Zero untyped boundary parameters: enforce runtime validation (Zod, Pydantic).",
        "Zero hardcoded secrets, connection strings, or unredacted logging output.",
        "Token Conservation & Caveman Mode: When invoked with '/caveman' (or 'lite', 'ultra'), eliminate conversational filler and pleasantries while preserving all code, commands, paths, and technical precision verbatim. Restore standard conversational style when requested with '/caveman off'.",
      ],
      antiPatterns: [
        "AP-1 (Vague task verb) : Always decompose requests into concrete atomic tasks.",
        "AP-6 (Monolithic prompt) : Never combine architecture, code, and test in one step.",
        "AP-14 (Leaking secrets) : Zero credentials in version control.",
        "AP-17 (Skipping tests) : Code without a prior failing test is unverified code.",
        "AP-18 (Non-atomic commit) : One logical concern per commit.",
        "AP-52 (Fake fix) : Masking errors with type casts or empty catch blocks is prohibited.",
      ],
    };
  }

  /**
   * Executes multi-runtime transpilation for all or selected adapters.
   *
   * Pipeline steps:
   * 1. Constructs unified context.
   * 2. Iterates over active adapters.
   * 3. Calls `transpile(context)` on each adapter to generate in-memory outputs.
   * 4. Delegates each output to `ConflictManager.safeWrite()` for conflict detection and writing.
   * 5. Compiles aggregated report of actions taken.
   *
   * @param options - Transpilation options (dryRun mode and target runtime filters).
   * @returns Detailed TranspileReport with per-file write results.
   */
  public transpileAll(
    options: { dryRun?: boolean; targetRuntimes?: string[] } = {},
  ): TranspileReport {
    const dryRun = options.dryRun ?? false;
    const context = this.buildContext();
    const results: WriteFileResult[] = [];

    // Filter to specific runtimes if user requested, otherwise compile all 17 runtimes.
    const activeAdapterIds =
      options.targetRuntimes && options.targetRuntimes.length > 0
        ? options.targetRuntimes
        : Array.from(this.adapters.keys());

    for (const adapterId of activeAdapterIds) {
      const adapter = this.adapters.get(adapterId);
      if (!adapter) {
        continue;
      }

      const outputs: TranspileOutput[] = adapter.transpile(context);
      for (const out of outputs) {
        // Enforce zero-destructive overwrites across every generated file.
        const result = this.conflictManager.safeWrite(
          out.relativePath,
          out.content,
          adapter.id,
          dryRun,
        );
        results.push(result);
      }
    }

    return {
      project: context.projectName,
      version: context.version,
      dryRun,
      totalGenerated: results.length,
      files: results,
    };
  }

  /**
   * Parses frontmatter-like fields from an agent markdown document.
   *
   * Uses regex matching to extract identity, role, and slash command bindings.
   *
   * @param id - Fallback slug identifier.
   * @param content - Raw markdown text from fellowship spec file.
   * @returns Structured FellowshipAgentIR persona.
   */
  private parseAgentMarkdown(id: string, content: string): FellowshipAgentIR {
    const nameMatch = content.match(/name:\s*([^\r\n]+)/);
    const titleMatch = content.match(/title:\s*([^\r\n]+)/);
    const depMatch = content.match(/department:\s*([^\r\n]+)/);
    const cmdMatch = content.match(/slash_command:\s*([^\r\n]+)/);
    const tagMatch = content.match(/tag:\s*([^\r\n]+)/);

    return {
      id,
      name: nameMatch?.[1]?.trim() || id,
      role: titleMatch?.[1]?.trim() || "Fellowship Agent",
      department: depMatch?.[1]?.trim() || "engineering",
      slashCommand: cmdMatch?.[1]?.trim() || `/${id}`,
      tag: tagMatch?.[1]?.trim() || `@${id}`,
      authority: {
        canModify: [],
        mustNotModify: [],
      },
      preventedAntiPatterns: [],
    };
  }

  /**
   * Returns canonical default Fellowship of 9 personas.
   *
   * Provides baseline sub-agents with predefined roles, authority boundaries,
   * and anti-pattern mappings.
   *
   * @returns Array of 9 Fellowship sub-agents.
   */
  private getDefaultFellowship(): FellowshipAgentIR[] {
    return [
      {
        id: "gandalf",
        name: "Gandalf",
        role: "Master Planner and Strategy Guide",
        department: "architecture",
        slashCommand: "/gandalf",
        tag: "@gandalf",
        authority: {
          canModify: ["PRD.md", "TASKS.md"],
          mustNotModify: ["src/*"],
        },
        preventedAntiPatterns: ["AP-1", "AP-6", "AP-28"],
      },
      {
        id: "aragorn",
        name: "Aragorn",
        role: "Principal System Architect",
        department: "architecture",
        slashCommand: "/aragorn",
        tag: "@aragorn",
        authority: {
          canModify: ["SCHEMA.md", "ARCHITECTURE.md"],
          mustNotModify: ["src/*"],
        },
        preventedAntiPatterns: ["AP-44", "AP-51", "AP-53"],
      },
      {
        id: "legolas",
        name: "Legolas",
        role: "Precision Linter and Syntax Hunter",
        department: "quality",
        slashCommand: "/legolas",
        tag: "@legolas",
        authority: { canModify: ["eslint.config.js"], mustNotModify: [] },
        preventedAntiPatterns: ["AP-12", "AP-23", "AP-38"],
      },
      {
        id: "gimli",
        name: "Gimli",
        role: "Refactorer and Dead Code Slasher",
        department: "architecture",
        slashCommand: "/gimli",
        tag: "@gimli",
        authority: { canModify: ["src/*"], mustNotModify: ["tests/*"] },
        preventedAntiPatterns: ["AP-4", "AP-13", "AP-33"],
      },
      {
        id: "boromir",
        name: "Boromir",
        role: "Security Auditor and Shield",
        department: "security",
        slashCommand: "/boromir",
        tag: "@boromir",
        authority: { canModify: [".env.example"], mustNotModify: ["src/*"] },
        preventedAntiPatterns: ["AP-14", "AP-15", "AP-16"],
      },
      {
        id: "frodo",
        name: "Frodo",
        role: "Ringbearer and Core Task Executor",
        department: "engineering",
        slashCommand: "/frodo",
        tag: "@frodo",
        authority: { canModify: ["src/*"], mustNotModify: ["PRD.md"] },
        preventedAntiPatterns: ["AP-6", "AP-52"],
      },
      {
        id: "samwise",
        name: "Samwise",
        role: "Git Commits and State Keeper",
        department: "devsecops",
        slashCommand: "/samwise",
        tag: "@samwise",
        authority: { canModify: [".github/*"], mustNotModify: ["src/*"] },
        preventedAntiPatterns: ["AP-18", "AP-19", "AP-20"],
      },
      {
        id: "merry",
        name: "Merry",
        role: "QA and TDD Specialist",
        department: "qa_testing",
        slashCommand: "/merry",
        tag: "@merry",
        authority: { canModify: ["tests/*"], mustNotModify: ["src/*"] },
        preventedAntiPatterns: ["AP-17", "AP-43", "AP-48"],
      },
      {
        id: "pippin",
        name: "Pippin",
        role: "Edge Case and Chaos Prober",
        department: "qa_testing",
        slashCommand: "/pippin",
        tag: "@pippin",
        authority: { canModify: ["tests/fuzz/*"], mustNotModify: ["src/*"] },
        preventedAntiPatterns: ["AP-3", "AP-11", "AP-45"],
      },
    ];
  }
}
