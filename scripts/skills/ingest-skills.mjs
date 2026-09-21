#!/usr/bin/env node
// @ts-check

/**
 * @fileoverview Team Suite Ingestion Engine for Sauron.
 * Ingests autonomous-dev and design-engineering team suites with full lifecycle flows intact.
 * Converts every stage file (01-06 / 01-08) into organized sub-folders containing standard SKILL.md files.
 * Strictly adheres to Sauron JSDoc type safety and standard writing rules.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SAURON_ROOT = path.resolve(__dirname, "..", "..");
const SPEC_SKILLS_DIR = path.resolve(SAURON_ROOT, "..", "spec", "skills");
const TARGET_SKILLS_DIR = path.join(SAURON_ROOT, "skills");

/**
 * @typedef {Object} IngestedSkillMeta
 * @property {string} name - Canonical name of the skill.
 * @property {string} department - Assigned Sauron department.
 * @property {string} ownerAgent - Fellowship agent owner.
 * @property {string} targetPath - Relative destination file path.
 */

/**
 * Cleans obsolete skills previously dumped during flat ingestion.
 *
 * @returns {void}
 */
function cleanObsoleteSkills() {
  console.log(
    "[CLEAN] Cleaning obsolete flattened skills from previous ingestion...",
  );

  // Clean entire workflow directory (will be repopulated with autonomous-dev)
  const workflowDir = path.join(TARGET_SKILLS_DIR, "workflow");
  if (fs.existsSync(workflowDir)) {
    fs.rmSync(workflowDir, { recursive: true, force: true });
    fs.mkdirSync(workflowDir, { recursive: true });
  }

  // Remove temporary non-standard enterprise skills dumped into architecture
  const architectureDir = path.join(TARGET_SKILLS_DIR, "architecture");
  const obsoleteArchitecture = [
    "client-brief",
    "enterprise-business",
    "meeting-notes",
    "meeting-visualizer",
    "negotiation",
    "the-team",
  ];
  for (const item of obsoleteArchitecture) {
    const itemPath = path.join(architectureDir, item);
    if (fs.existsSync(itemPath)) {
      fs.rmSync(itemPath, { recursive: true, force: true });
    }
  }

  // Remove temporary non-standard skills dumped into frontend
  const frontendDir = path.join(TARGET_SKILLS_DIR, "frontend");
  const obsoleteFrontend = [
    "accessibility-auditor",
    "animations",
    "audio",
    "design-engineering",
    "enable-worklets-bundle-mode",
    "expo-native-ui",
    "expo-project-structure",
    "expo-tailwind-setup",
    "gestures",
    "jsi",
    "mobile-react-native",
    "multithreading",
    "on-device-ai",
    "react-native-best-practices",
    "rich-text",
    "svg",
    "ui-snapshot-tokens",
  ];
  for (const item of obsoleteFrontend) {
    const itemPath = path.join(frontendDir, item);
    if (fs.existsSync(itemPath)) {
      fs.rmSync(itemPath, { recursive: true, force: true });
    }
  }

  // Remove temporary non-standard api-endpoint-generator from backend
  const backendApiGen = path.join(
    TARGET_SKILLS_DIR,
    "backend",
    "api-endpoint-generator",
  );
  if (fs.existsSync(backendApiGen)) {
    fs.rmSync(backendApiGen, { recursive: true, force: true });
  }

  // Remove database-migration to ensure fresh clean re-ingest
  const dbMigration = path.join(
    TARGET_SKILLS_DIR,
    "database",
    "database-migration",
  );
  if (fs.existsSync(dbMigration)) {
    fs.rmSync(dbMigration, { recursive: true, force: true });
  }

  // Remove security-auditor to ensure fresh clean re-ingest
  const secAuditor = path.join(
    TARGET_SKILLS_DIR,
    "security",
    "security-auditor",
  );
  if (fs.existsSync(secAuditor)) {
    fs.rmSync(secAuditor, { recursive: true, force: true });
  }

  console.log("[CLEAN] Obsolete skills removed successfully.\n");
}

/**
 * Sanitizes prose to strictly conform to Sauron writing standards.
 *
 * @param {string} text - Raw markdown or YAML string.
 * @returns {string} Sanitized string free of emojis, Latin abbreviations, and em dashes.
 */
function sanitizeProse(text) {
  return text
    .replace(/\be\.g\.,?\s*/gi, "for example, ")
    .replace(/\bi\.e\.,?\s*/gi, "that is, ")
    .replace(/\betc\.\s*/gi, "and so forth. ")
    .replace(/—/g, " - ")
    .replace(/[^\x00-\x7F]/g, (char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x20 && code <= 0x7e) return char;
      if (code === 0x0a || code === 0x0d || code === 0x09) return char;
      return "";
    });
}

/**
 * Parses frontmatter and body from markdown, handling UTF-8 BOM, multiline strings, and duplicate blocks.
 *
 * @param {string} content - Raw markdown text.
 * @returns {{ frontmatter: Record<string, any>; body: string }} Parsed frontmatter and clean body.
 */
function parseFrontmatterRobust(content) {
  let text = content.replace(/^\uFEFF/, "");
  /** @type {Record<string, any>} */
  const frontmatter = {};

  while (true) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) break;

    const yamlBlock = match[1] ?? "";
    text = match[2] ?? "";

    try {
      const parsed = YAML.parse(yamlBlock);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [k, v] of Object.entries(parsed)) {
          if (
            frontmatter[k] === undefined ||
            frontmatter[k] === "" ||
            frontmatter[k] === ">-"
          ) {
            frontmatter[k] = v;
          }
        }
      }
    } catch {
      // Fallback key-value parser for YAML with unquoted colons
      const lines = yamlBlock.split(/\r?\n/);
      let currKey = null;
      /** @type {string[]} */
      let currVal = [];
      for (const line of lines) {
        const topMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
        if (topMatch && !line.startsWith(" ") && !line.startsWith("\t")) {
          if (currKey) {
            const joined = currVal.join(" ").trim();
            if (
              frontmatter[currKey] === undefined ||
              frontmatter[currKey] === "" ||
              frontmatter[currKey] === ">-"
            ) {
              frontmatter[currKey] = joined;
            }
          }
          currKey = topMatch[1];
          currVal = [topMatch[2] ?? ""];
        } else if (currKey) {
          currVal.push(line.trim());
        }
      }
      if (currKey) {
        const joined = currVal.join(" ").trim();
        if (
          frontmatter[currKey] === undefined ||
          frontmatter[currKey] === "" ||
          frontmatter[currKey] === ">-"
        ) {
          frontmatter[currKey] = joined;
        }
      }
    }
  }

  return { frontmatter, body: text.trim() };
}

/**
 * Builds valid, compliant YAML frontmatter string without syntax errors.
 *
 * @param {Record<string, any>} data - Frontmatter properties.
 * @returns {string} Formatted YAML block enclosed in --- delimiters.
 */
function buildFrontmatter(data) {
  const yamlContent = YAML.stringify(data, { lineWidth: 0 }).trim();
  return `---\n${yamlContent}\n---`;
}

/**
 * Ingests a single sub-skill file from a stage folder into its own organized folder with SKILL.md.
 *
 * @param {string} sourceFile - Absolute path to source stage markdown file.
 * @param {string} targetStageDir - Destination stage directory path.
 * @param {string} department - Assigned Sauron department.
 * @param {string} ownerAgent - Assigned Fellowship owner agent.
 * @returns {IngestedSkillMeta} Metadata of ingested skill.
 */
function ingestStageFile(sourceFile, targetStageDir, department, ownerAgent) {
  const rawContent = fs.readFileSync(sourceFile, "utf8");
  const { frontmatter, body } = parseFrontmatterRobust(rawContent);

  const baseFileName = path.basename(sourceFile, ".md");
  const isDirectSkillMd = baseFileName.toLowerCase() === "skill";

  const skillSlug = frontmatter["name"]
    ? String(frontmatter["name"]).trim().toLowerCase()
    : isDirectSkillMd
      ? path.basename(targetStageDir).replace(/^\d+[-_]/, "")
      : baseFileName;

  let description = "";
  if (typeof frontmatter["description"] === "string") {
    description = frontmatter["description"];
  }

  description = description
    .replace(/^>-\s*/, "")
    .replace(/\r?\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!description || description === ">-") {
    const roleMatch = body.match(/-\s+\*\*Role:\*\*\s+([^\r\n]+)/i);
    if (roleMatch && roleMatch[1]) {
      description = roleMatch[1].trim();
    } else {
      description = `Sauron engineering capability for ${skillSlug}.`;
    }
  }

  description = sanitizeProse(description);
  const sanitizedBody = sanitizeProse(body);

  const frontmatterData = {
    name: skillSlug,
    description,
    department,
    ownerAgent,
    triggerCommand: `/${skillSlug}`,
    antiPatternsPrevented: ["AP-1", "AP-6", "AP-18"],
  };

  const frontmatterYaml = buildFrontmatter(frontmatterData);
  const normalizedDoc = `${frontmatterYaml}\n\n${sanitizedBody}\n`;

  let skillFilePath;
  if (isDirectSkillMd) {
    skillFilePath = path.join(targetStageDir, "SKILL.md");
  } else {
    const skillFolder = path.join(targetStageDir, skillSlug);
    if (!fs.existsSync(skillFolder)) {
      fs.mkdirSync(skillFolder, { recursive: true });
    }
    skillFilePath = path.join(skillFolder, "SKILL.md");
  }

  fs.writeFileSync(skillFilePath, normalizedDoc, "utf8");

  return {
    name: skillSlug,
    department,
    ownerAgent,
    targetPath: path.relative(SAURON_ROOT, skillFilePath),
  };
}

/**
 * Ingests an entire team suite preserving its internal stage flow, converting stage files to SKILL.md.
 *
 * @param {string} suiteName - Directory name of suite (for example "autonomous-dev", "design-engineering").
 * @param {string} targetDept - Sauron department (for example "workflow", "frontend").
 * @param {string} ownerAgent - Fellowship persona owner (for example "frodo", "aragorn").
 * @returns {IngestedSkillMeta[]} Array of all ingested skills in this team suite.
 */
function ingestTeamSuite(suiteName, targetDept, ownerAgent) {
  const sourceSuiteDir = path.join(SPEC_SKILLS_DIR, suiteName);
  const targetSuiteDir = path.join(TARGET_SKILLS_DIR, targetDept, suiteName);

  console.log(
    `[SUITE] Ingesting team suite '${suiteName}' into department '${targetDept}' (Owner: ${ownerAgent})...`,
  );

  if (!fs.existsSync(sourceSuiteDir)) {
    throw new Error(`Source suite directory not found: ${sourceSuiteDir}`);
  }

  if (!fs.existsSync(targetSuiteDir)) {
    fs.mkdirSync(targetSuiteDir, { recursive: true });
  }

  /** @type {IngestedSkillMeta[]} */
  const suiteResults = [];

  // 1. Process root SKILL.md
  const rootSkillPath = path.join(sourceSuiteDir, "SKILL.md");
  if (fs.existsSync(rootSkillPath)) {
    const rootRaw = fs.readFileSync(rootSkillPath, "utf8");
    const { frontmatter, body } = parseFrontmatterRobust(rootRaw);

    let description = "";
    if (typeof frontmatter["description"] === "string") {
      description = frontmatter["description"];
    }
    description = description
      .replace(/^>-\s*/, "")
      .replace(/\r?\n\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!description || description === ">-") {
      description = `Root router and lifecycle dispatcher for ${suiteName}.`;
    }
    description = sanitizeProse(description);

    // Update Trigger Matrix in root body to point directly to converted SKILL.md paths
    // e.g. "01-ideation-and-design/brainstorming.md" -> "01-ideation-and-design/brainstorming/SKILL.md"
    const updatedBody = sanitizeProse(body).replace(
      /(\b\d\d-[a-zA-Z0-9_-]+\/)([a-zA-Z0-9_-]+)\.md\b/g,
      "$1$2/SKILL.md",
    );

    const rootFrontmatterData = {
      name: suiteName,
      description,
      department: targetDept,
      ownerAgent,
      triggerCommand: `/${suiteName}`,
      antiPatternsPrevented: ["AP-1", "AP-4", "AP-18", "AP-26", "AP-28"],
    };

    const targetRootPath = path.join(targetSuiteDir, "SKILL.md");
    fs.writeFileSync(
      targetRootPath,
      `${buildFrontmatter(rootFrontmatterData)}\n\n${updatedBody}\n`,
      "utf8",
    );

    suiteResults.push({
      name: suiteName,
      department: targetDept,
      ownerAgent,
      targetPath: path.relative(SAURON_ROOT, targetRootPath),
    });
  }

  // 2. Process all stage directories (numbered 01-* or named sub-skills)
  const entries = fs.readdirSync(sourceSuiteDir, { withFileTypes: true });
  const stageDirs = entries
    .filter(
      (e) =>
        e.isDirectory() && e.name !== "references" && e.name !== "node_modules",
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const stage of stageDirs) {
    const stageSourcePath = path.join(sourceSuiteDir, stage.name);
    const stageTargetPath = path.join(targetSuiteDir, stage.name);

    if (!fs.existsSync(stageTargetPath)) {
      fs.mkdirSync(stageTargetPath, { recursive: true });
    }

    const stageFiles = fs.readdirSync(stageSourcePath, { withFileTypes: true });

    for (const item of stageFiles) {
      if (item.isFile() && item.name.endsWith(".md")) {
        const itemSourcePath = path.join(stageSourcePath, item.name);
        const meta = ingestStageFile(
          itemSourcePath,
          stageTargetPath,
          targetDept,
          ownerAgent,
        );
        suiteResults.push(meta);
      } else if (item.isDirectory()) {
        // Copy subdirectories (such as brand-presets) recursively
        const subSource = path.join(stageSourcePath, item.name);
        const subTarget = path.join(stageTargetPath, item.name);
        fs.cpSync(subSource, subTarget, { recursive: true });
      }
    }
  }

  // 3. Copy references directory if present
  const refSourcePath = path.join(sourceSuiteDir, "references");
  if (fs.existsSync(refSourcePath)) {
    const refTargetPath = path.join(targetSuiteDir, "references");
    fs.cpSync(refSourcePath, refTargetPath, { recursive: true });
  }

  return suiteResults;
}

/**
 * Ingests a standalone skill folder containing SKILL.md and optional references.
 *
 * @param {string} sourceRelPath - Relative path under SPEC_SKILLS_DIR (for example "dev-workflow/workflows/prd-generator").
 * @param {string} targetDept - Sauron department (for example "workflow", "backend", "security").
 * @param {string} ownerAgent - Assigned Fellowship owner agent (for example "gandalf", "gimli").
 * @param {string} [customSlug] - Optional override for the skill directory name.
 * @returns {IngestedSkillMeta} Metadata of ingested skill.
 */
function ingestStandaloneSkill(
  sourceRelPath,
  targetDept,
  ownerAgent,
  customSlug,
) {
  const sourceDir = path.join(SPEC_SKILLS_DIR, sourceRelPath);
  const sourceSkillPath = path.join(sourceDir, "SKILL.md");

  if (!fs.existsSync(sourceSkillPath)) {
    throw new Error(`Source SKILL.md not found: ${sourceSkillPath}`);
  }

  const rawContent = fs.readFileSync(sourceSkillPath, "utf8");
  const { frontmatter, body } = parseFrontmatterRobust(rawContent);

  const skillSlug =
    customSlug ||
    (frontmatter["name"]
      ? String(frontmatter["name"]).trim().toLowerCase()
      : path.basename(sourceDir));

  let description = "";
  if (typeof frontmatter["description"] === "string") {
    description = frontmatter["description"];
  }

  description = description
    .replace(/^>-\s*/, "")
    .replace(/\r?\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!description || description === ">-") {
    const roleMatch = body.match(/-\s+\*\*Role:\*\*\s+([^\r\n]+)/i);
    if (roleMatch && roleMatch[1]) {
      description = roleMatch[1].trim();
    } else {
      description = `Sauron capability skill for ${skillSlug}.`;
    }
  }

  description = sanitizeProse(description);
  const sanitizedBody = sanitizeProse(body);

  const frontmatterData = {
    name: skillSlug,
    description,
    department: targetDept,
    ownerAgent,
    triggerCommand: `/${skillSlug}`,
    antiPatternsPrevented: ["AP-1", "AP-6", "AP-18"],
  };

  const targetDir = path.join(TARGET_SKILLS_DIR, targetDept, skillSlug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetSkillPath = path.join(targetDir, "SKILL.md");
  fs.writeFileSync(
    targetSkillPath,
    `${buildFrontmatter(frontmatterData)}\n\n${sanitizedBody}\n`,
    "utf8",
  );

  // Copy references directory if present
  const refSourcePath = path.join(sourceDir, "references");
  if (fs.existsSync(refSourcePath)) {
    const refTargetPath = path.join(targetDir, "references");
    fs.cpSync(refSourcePath, refTargetPath, { recursive: true });
  }

  return {
    name: skillSlug,
    department: targetDept,
    ownerAgent,
    targetPath: path.relative(SAURON_ROOT, targetSkillPath),
  };
}

/**
 * Ingests the 5-stage engineering loop suite with root lifecycle dispatcher.
 *
 * @returns {IngestedSkillMeta[]} Array of metadata for all loop skills.
 */
function ingestEngineeringLoop() {
  const sourceLoopDir = path.join(
    SPEC_SKILLS_DIR,
    "dev-workflow",
    "workflows",
    "engineering-loop",
  );
  const targetLoopDir = path.join(
    TARGET_SKILLS_DIR,
    "workflow",
    "engineering-loop",
  );

  console.log(
    "[LOOP] Ingesting engineering-loop suite into department 'workflow' (Owner: frodo)...",
  );

  if (!fs.existsSync(targetLoopDir)) {
    fs.mkdirSync(targetLoopDir, { recursive: true });
  }

  /** @type {IngestedSkillMeta[]} */
  const loopResults = [];

  // 1. Ingest each of the 5 stage folders
  const stages = [
    { dir: "blueprint-session", name: "blueprint-session" },
    { dir: "ui-snapshot-tokens", name: "ui-snapshot-tokens" },
    { dir: "code-inspection", name: "code-inspection" },
    { dir: "context-checkpoint", name: "context-checkpoint" },
    { dir: "failure-triage", name: "failure-triage" },
  ];

  for (const stage of stages) {
    const stageSourcePath = path.join(sourceLoopDir, stage.dir, "SKILL.md");
    if (!fs.existsSync(stageSourcePath)) {
      continue;
    }
    const rawContent = fs.readFileSync(stageSourcePath, "utf8");
    const { frontmatter, body } = parseFrontmatterRobust(rawContent);

    let description = "";
    if (typeof frontmatter["description"] === "string") {
      description = frontmatter["description"];
    }
    description = description
      .replace(/^>-\s*/, "")
      .replace(/\r?\n\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!description || description === ">-") {
      const roleMatch = body.match(/-\s+\*\*Role:\*\*\s+([^\r\n]+)/i);
      description =
        roleMatch && roleMatch[1]
          ? roleMatch[1].trim()
          : `Engineering loop stage ${stage.name}.`;
    }

    description = sanitizeProse(description);
    const sanitizedBody = sanitizeProse(body);

    const frontmatterData = {
      name: stage.name,
      description,
      department: "workflow",
      ownerAgent: "frodo",
      triggerCommand: `/${stage.name}`,
      antiPatternsPrevented: ["AP-1", "AP-6", "AP-18", "AP-28"],
    };

    const stageTargetDir = path.join(targetLoopDir, stage.dir);
    if (!fs.existsSync(stageTargetDir)) {
      fs.mkdirSync(stageTargetDir, { recursive: true });
    }

    const stageTargetFile = path.join(stageTargetDir, "SKILL.md");
    fs.writeFileSync(
      stageTargetFile,
      `${buildFrontmatter(frontmatterData)}\n\n${sanitizedBody}\n`,
      "utf8",
    );

    loopResults.push({
      name: stage.name,
      department: "workflow",
      ownerAgent: "frodo",
      targetPath: path.relative(SAURON_ROOT, stageTargetFile),
    });
  }

  // 2. Generate root SKILL.md router for engineering-loop
  const rootFrontmatterData = {
    name: "engineering-loop",
    description:
      "Autonomous 5-stage engineering loop orchestrator dispatching blueprinting, UI tokens, code inspection, checkpointing, and triage.",
    department: "workflow",
    ownerAgent: "frodo",
    triggerCommand: "/engineering-loop",
    antiPatternsPrevented: ["AP-1", "AP-4", "AP-18", "AP-26", "AP-28"],
  };

  const rootBody = `# Engineering Loop Lifecycle Dispatcher

## 0. Identity

- **Role:** Chief Engineering Loop Orchestrator. Sequences the 5-stage software engineering loop across pre-coding blueprinting, UI token extraction, code inspection, context checkpointing, and failure triage.
- **Authority:** Normative group orchestrator for \`skills/workflow/engineering-loop/\`.
- **Must not define:** Direct implementation code or individual stage rules; delegates execution sequentially to loop sub-skills.
- **Normative base:** \`core/decision-framework.md\`, \`shared/writing/writing-rules.md\`, \`docs/anti-patterns.md\`.

## 1. Intent (9 Dimensions)

| # | Dimension | Value |
|---|-----------|-------|
| 1 | Task | Sequence and dispatch engineering requests across the 5 stages of the engineering loop. |
| 2 | Target Tool | Any agent runtime: Claude Code, Cursor, Copilot, Windsurf, Kiro, Cline, raw API. |
| 3 | Output Format | Structured routing decision and execution handoff to stage sub-skills. |
| 4 | Constraints | Router executes no stage tasks directly. Always enforce pre-coding blueprinting before execution. |
| 5 | Input | User feature request, UI specification, code change, or failure diagnosis task. |
| 6 | Context | Prevents architectural drift, uninspected code, and unrecoverable session states. |
| 7 | Audience | Autonomous developer agents and software engineers. |
| 8 | Success Criteria | Clean transitions between stages with explicit developer confirmation. |
| 9 | Examples | See Section 10. |

## 2. Trigger Matrix

| Stage | Name | Trigger | Target Skill File Path |
|---|---|---|---|
| Stage 1 | Blueprint Session | Feature planning, pre-coding architectural alignment | \`skills/workflow/engineering-loop/blueprint-session/SKILL.md\` |
| Stage 2 | UI Snapshot Tokens | Visual design translation, UI token extraction | \`skills/workflow/engineering-loop/ui-snapshot-tokens/SKILL.md\` |
| Stage 3 | Code Inspection | Code audit against blueprint, quality review | \`skills/workflow/engineering-loop/code-inspection/SKILL.md\` |
| Stage 4 | Context Checkpoint | Long-running session state save and restore | \`skills/workflow/engineering-loop/context-checkpoint/SKILL.md\` |
| Stage 5 | Failure Triage | Build failures, runtime error diagnosis, flaky tests | \`skills/workflow/engineering-loop/failure-triage/SKILL.md\` |

## 3. Execution Workflow

### Step 1: Determine Current Engineering Phase
- **Action:** Assess workspace state and incoming request to identify current stage.
- **Input:** User prompt and workspace context.
- **Validation:** Matches an entry in the Trigger Matrix.

### Step 2: Handoff to Stage Skill
- **Action:** Hand off execution to the corresponding stage \`SKILL.md\`.
- **Validation:** Stage pre-conditions satisfied.

### Step 3: Verify Stage Completion Gate
- **Action:** Ensure stage verification criteria are met before advancing to next stage.
- **Validation:** Stage checklist signed off.

## 4. Anti-Patterns Enforced

- **AP-1 (Vague task verb):** Rejects ambiguous tasks without clear stage mapping.
- **AP-4 (Over-permissive action):** Enforces explicit developer confirmation before executing destructive changes.
- **AP-18 (Over-reliance on internal state):** Persists session state via Context Checkpoint.
- **AP-26 (No scope boundary):** Isolates each stage within strict authority limits.
- **AP-28 (No stop condition):** Defines deterministic completion gates for every stage.
`;

  const rootTargetFile = path.join(targetLoopDir, "SKILL.md");
  fs.writeFileSync(
    rootTargetFile,
    `${buildFrontmatter(rootFrontmatterData)}\n\n${rootBody}\n`,
    "utf8",
  );

  loopResults.unshift({
    name: "engineering-loop",
    department: "workflow",
    ownerAgent: "frodo",
    targetPath: path.relative(SAURON_ROOT, rootTargetFile),
  });

  return loopResults;
}

/**
 * Main execution entrypoint.
 *
 * @returns {void}
 */
function main() {
  console.log(
    "===================================================================",
  );
  console.log(
    "             SAURON TEAM SUITE INGESTION ENGINE                    ",
  );
  console.log(
    "===================================================================\n",
  );

  cleanObsoleteSkills();

  // 1. Ingest major multi-stage team suites
  const autoDevResults = ingestTeamSuite("autonomous-dev", "workflow", "frodo");
  const designEngResults = ingestTeamSuite(
    "design-engineering",
    "frontend",
    "aragorn",
  );
  const careerResults = ingestTeamSuite(
    "career-and-job-search",
    "workflow",
    "samwise",
  );
  const cavemanResults = ingestTeamSuite("caveman", "workflow", "legolas");
  const loopResults = ingestEngineeringLoop();

  // 2. Ingest Fellowship standalone workflow skills
  console.log(
    "\n[WORKFLOW] Ingesting standalone Fellowship workflow skills...",
  );
  /** @type {IngestedSkillMeta[]} */
  const standaloneWorkflow = [
    // Gandalf (Master Planner & Strategy Guide)
    ingestStandaloneSkill(
      "dev-workflow/workflows/prd-generator",
      "workflow",
      "gandalf",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/plan-feature",
      "workflow",
      "gandalf",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/project-onboarding-audit",
      "workflow",
      "gandalf",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/define-enterprise-context",
      "workflow",
      "gandalf",
    ),

    // Aragorn (Principal System Architect)
    ingestStandaloneSkill(
      "dev-workflow/workflows/define-foundation",
      "workflow",
      "aragorn",
    ),

    // Samwise (State Keeper & Repo Organization)
    ingestStandaloneSkill(
      "dev-workflow/workflows/handoff",
      "workflow",
      "samwise",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/repo-reorganizer",
      "workflow",
      "samwise",
    ),

    // Legolas (Precision Reviewer & Linter)
    ingestStandaloneSkill(
      "dev-workflow/workflows/spec-reviewer",
      "workflow",
      "legolas",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/split-file",
      "workflow",
      "legolas",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/prompt-auditor",
      "workflow",
      "legolas",
    ),
    ingestStandaloneSkill(
      "dev-workflow/evaluate-pr-suggestions",
      "workflow",
      "legolas",
    ),

    // Pippin (Chaos Prober & MCP Integration)
    ingestStandaloneSkill(
      "dev-workflow/workflows/radon-mcp",
      "workflow",
      "pippin",
    ),

    // Frodo (Core Task Executor)
    ingestStandaloneSkill(
      "dev-workflow/workflows/adapt-project",
      "workflow",
      "frodo",
    ),
  ];

  // 3. Ingest Fellowship domain department skills
  console.log(
    "\n[DEPARTMENTS] Ingesting Fellowship domain department skills...",
  );
  /** @type {IngestedSkillMeta[]} */
  const domainSkills = [
    // Gimli (Backend & Infrastructure)
    ingestStandaloneSkill(
      "dev-workflow/workflows/database-migration",
      "database",
      "gimli",
    ),
    ingestStandaloneSkill(
      "dev-workflow/workflows/api-endpoint-generator",
      "backend",
      "gimli",
    ),

    // Boromir (Security Auditor & Shield)
    ingestStandaloneSkill(
      "dev-workflow/workflows/security-auditor",
      "security",
      "boromir",
    ),

    // Legolas (Frontend Precision)
    ingestStandaloneSkill(
      "dev-workflow/workflows/accessibility-auditor",
      "frontend",
      "legolas",
    ),

    // Merry (QA & TDD Specialist)
    ingestStandaloneSkill(
      "dev-workflow/testing/write-a-test",
      "quality",
      "merry",
    ),
  ];

  const allResults = [
    ...autoDevResults,
    ...designEngResults,
    ...careerResults,
    ...cavemanResults,
    ...loopResults,
    ...standaloneWorkflow,
    ...domainSkills,
  ];

  console.log("\n--- Ingestion Manifest ---");
  for (const item of allResults) {
    console.log(
      `  [OK] ${item.department.padEnd(10)} | ${item.ownerAgent.padEnd(8)} | ${item.name.padEnd(42)} -> ${item.targetPath}`,
    );
  }

  console.log(
    `\n[COMPLETE] Successfully ingested ${allResults.length} organized skills across 8 departments.`,
  );
}

main();
