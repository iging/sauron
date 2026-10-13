/// <reference types="node" />
/**
 * @fileoverview Ranked local skill search over SKILL.md frontmatter and trigger phrases.
 * Scores skills against a task description with weighted BM25 so an agent reads
 * a few candidate files instead of the full catalog. No network or model calls.
 * Follows sauron typescript-standards. No barrel files.
 */

import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Searchable fields extracted from one SKILL.md file.
 */
export interface SkillDocument {
  /** Canonical skill name from frontmatter. */
  name: string;
  /** Skill description from frontmatter. */
  description: string;
  /** Owning department, or empty string when absent. */
  department: string;
  /** Slash command that triggers the skill, or empty string when absent. */
  triggerCommand: string;
  /** Trigger Matrix phrases marked YES. */
  triggerPhrases: string[];
  /** Path to the SKILL.md file with forward slashes. */
  path: string;
}

/**
 * A skill file excluded from the catalog, with the reason.
 */
export interface RejectedSkill {
  /** Path to the rejected file with forward slashes. */
  path: string;
  /** Parser error message. */
  reason: string;
}

/**
 * Result of scanning a skills directory.
 */
export interface SkillCatalog {
  /** Valid skills sorted by path. */
  documents: SkillDocument[];
  /** Files that failed frontmatter validation. */
  rejected: RejectedSkill[];
}

/**
 * One ranked search hit.
 */
export interface RankedSkill {
  /** Canonical skill name. */
  name: string;
  /** Path to the SKILL.md file. */
  path: string;
  /** Slash command, or empty string. */
  triggerCommand: string;
  /** Skill description. */
  description: string;
  /** Relevance score, higher is better. Always above zero. */
  score: number;
}

const STOP_WORDS: ReadonlySet<string> = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "do", "for", "from", "how",
  "i", "in", "is", "it", "me", "my", "of", "on", "or", "so", "that", "the",
  "this", "to", "we", "with", "you",
]);

/** Field weights: a name match counts most, then trigger phrases, then description. */
const NAME_WEIGHT = 3;
const TRIGGER_WEIGHT = 2;
const DESCRIPTION_WEIGHT = 1;

/** Standard BM25 saturation and length normalization constants. */
const BM25_K1 = 1.2;
const BM25_B = 0.75;

const SKILL_FILE = "SKILL.md";
const TEMPLATE_DIR = "_template";

/**
 * Removes a doubled final consonant left behind by suffix stripping (debugg -> debug).
 */
function undouble(stem: string): string {
  const last = stem.at(-1);
  if (stem.length > 3 && last !== undefined && last === stem.at(-2) && !"aeiouls".includes(last)) {
    return stem.slice(0, -1);
  }
  return stem;
}

/**
 * Folds common English endings so plural and verb forms share one token.
 */
function stem(word: string): string {
  if (word.length > 5 && word.endsWith("ing")) {
    return undouble(word.slice(0, -3));
  }
  if (word.length > 5 && word.endsWith("ed")) {
    return undouble(word.slice(0, -2));
  }
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

/**
 * Converts free text into normalized search tokens.
 *
 * @param text - Query or field text.
 * @returns Lowercase stemmed tokens in original order, without stop words.
 */
export function tokenizeQuery(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map(stem);
}

/**
 * Strips one pair of matching surrounding quotes from a frontmatter value.
 */
function unquote(value: string): string {
  const first = value.at(0);
  if (value.length >= 2 && (first === '"' || first === "'") && value.at(-1) === first) {
    return value.slice(1, -1);
  }
  return value;
}

/**
 * Reads top-level scalar keys from a YAML frontmatter block.
 * Indented continuation lines after an empty, `>`, or `|` value are joined with spaces.
 * List items are ignored.
 */
function readFrontmatter(block: string): Map<string, string> {
  const fields = new Map<string, string>();
  let openKey: string | undefined;
  for (const line of block.split(/\r?\n/)) {
    const match = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      const value = match[2].trim();
      const isBlockStart = value === "" || /^[>|][+-]?$/.test(value);
      openKey = isBlockStart ? match[1] : undefined;
      fields.set(match[1], isBlockStart ? "" : unquote(value));
      continue;
    }
    const continuation = line.trim();
    if (openKey !== undefined && /^\s+\S/.test(line) && !continuation.startsWith("- ")) {
      const previous = fields.get(openKey) ?? "";
      fields.set(openKey, previous === "" ? continuation : `${previous} ${continuation}`);
    } else if (continuation !== "") {
      openKey = undefined;
    }
  }
  return fields;
}

/**
 * Extracts Trigger Matrix phrases whose decision cell reads YES.
 */
function readTriggerPhrases(body: string): string[] {
  const section = /^## 2\. Trigger Matrix\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(body);
  if (section?.[1] === undefined) {
    return [];
  }
  const phrases: string[] = [];
  for (const line of section[1].split(/\r?\n/)) {
    const cells = line.split("|").map((cell) => cell.trim());
    const phrase = cells[1];
    const decision = cells[2];
    if (phrase !== undefined && decision !== undefined && decision.toUpperCase() === "YES") {
      phrases.push(phrase.replace(/^["'`]+|["'`]+$/g, ""));
    }
  }
  return phrases;
}

/**
 * Parses one SKILL.md file into a searchable document. Fails closed on missing fields.
 *
 * @param filePath - Path recorded on the document. Backslashes are normalized.
 * @param content - Full SKILL.md text.
 * @returns Parsed skill document.
 * @throws Error when frontmatter, name, or description is missing.
 */
export function parseSkillDocument(filePath: string, content: string): SkillDocument {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(content);
  if (match?.[1] === undefined) {
    throw new Error(`Missing frontmatter in ${normalizedPath}`);
  }
  const fields = readFrontmatter(match[1]);
  const name = fields.get("name") ?? "";
  const description = fields.get("description") ?? "";
  if (name === "") {
    throw new Error(`Missing name in frontmatter of ${normalizedPath}`);
  }
  if (description === "") {
    throw new Error(`Missing description in frontmatter of ${normalizedPath}`);
  }
  return {
    name,
    description,
    department: fields.get("department") ?? "",
    triggerCommand: fields.get("triggerCommand") ?? "",
    triggerPhrases: readTriggerPhrases(content.slice(match[0].length)),
    path: normalizedPath,
  };
}

/**
 * Recursively collects SKILL.md paths, skipping the template directory.
 */
function collectSkillFiles(directory: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== TEMPLATE_DIR && entry.name !== "node_modules") {
        found.push(...collectSkillFiles(full));
      }
    } else if (entry.name === SKILL_FILE) {
      found.push(full);
    }
  }
  return found;
}

/**
 * Scans a skills directory and parses every SKILL.md below it.
 *
 * @param skillsRoot - Directory that holds skill folders.
 * @param baseDir - Directory that result paths are made relative to.
 * @returns Valid documents and the files rejected by the parser.
 * @throws Error when skillsRoot does not exist or is not a directory.
 */
export function loadSkillCatalog(skillsRoot: string, baseDir: string): SkillCatalog {
  if (!fs.existsSync(skillsRoot) || !fs.statSync(skillsRoot).isDirectory()) {
    throw new Error(`Skills directory not found: ${skillsRoot}`);
  }
  const documents: SkillDocument[] = [];
  const rejected: RejectedSkill[] = [];
  for (const file of collectSkillFiles(skillsRoot)) {
    const relativePath = path.relative(baseDir, file).replace(/\\/g, "/");
    try {
      documents.push(parseSkillDocument(relativePath, fs.readFileSync(file, "utf8")));
    } catch (error) {
      rejected.push({
        path: relativePath,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  documents.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
  rejected.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
  return { documents, rejected };
}

/**
 * Builds the weighted term frequency map for one document.
 */
function weightedTerms(document: SkillDocument): Map<string, number> {
  const terms = new Map<string, number>();
  const add = (text: string, weight: number): void => {
    for (const token of tokenizeQuery(text)) {
      terms.set(token, (terms.get(token) ?? 0) + weight);
    }
  };
  add(document.name, NAME_WEIGHT);
  add(document.triggerCommand, NAME_WEIGHT);
  add(document.triggerPhrases.join(" "), TRIGGER_WEIGHT);
  add(document.description, DESCRIPTION_WEIGHT);
  return terms;
}

/**
 * Ranks skills against a task description with weighted BM25.
 *
 * @param documents - Catalog documents to search.
 * @param query - Task description in plain language.
 * @param limit - Maximum number of results. Must be at least one.
 * @returns Matching skills, best first. Ties sort by path. Non-matching skills are omitted.
 * @throws Error when limit is not a positive integer.
 */
export function rankSkills(
  documents: readonly SkillDocument[],
  query: string,
  limit: number,
): RankedSkill[] {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error(`Invalid limit: ${limit}. Expected a positive integer.`);
  }
  const queryTerms = [...new Set(tokenizeQuery(query))];
  if (queryTerms.length === 0 || documents.length === 0) {
    return [];
  }

  const termMaps = documents.map(weightedTerms);
  const lengths = termMaps.map((terms) => {
    let total = 0;
    for (const count of terms.values()) {
      total += count;
    }
    return total;
  });
  const averageLength = lengths.reduce((sum, length) => sum + length, 0) / documents.length || 1;

  const results: RankedSkill[] = [];
  documents.forEach((document, index) => {
    const terms = termMaps[index];
    const length = lengths[index];
    if (terms === undefined || length === undefined) {
      return;
    }
    let score = 0;
    for (const term of queryTerms) {
      const frequency = terms.get(term);
      if (frequency === undefined) {
        continue;
      }
      const containing = termMaps.filter((candidate) => candidate.has(term)).length;
      const idf = Math.log(1 + (documents.length - containing + 0.5) / (containing + 0.5));
      const normalized =
        (frequency * (BM25_K1 + 1)) /
        (frequency + BM25_K1 * (1 - BM25_B + BM25_B * (length / averageLength)));
      score += idf * normalized;
    }
    if (score > 0) {
      results.push({
        name: document.name,
        path: document.path,
        triggerCommand: document.triggerCommand,
        description: document.description,
        score,
      });
    }
  });

  results.sort((left, right) =>
    right.score !== left.score ? right.score - left.score : left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  );
  return results.slice(0, limit);
}

/**
 * Renders ranked results as plain text with a paste-ready instruction line.
 *
 * @param results - Output of rankSkills.
 * @param query - Original task description.
 * @returns Report text without a trailing newline.
 */
export function formatFinderReport(results: readonly RankedSkill[], query: string): string {
  const top = results[0];
  if (top === undefined) {
    return `No skill matches "${query}". Run: sauron list-skills`;
  }
  const lines: string[] = [`Skills ranked for "${query}":`, ""];
  results.forEach((result, index) => {
    const command = result.triggerCommand === "" ? "" : `  ${result.triggerCommand}`;
    lines.push(`${index + 1}. ${result.name}  (score ${result.score.toFixed(2)})${command}`);
    lines.push(`   ${result.path}`);
    lines.push(`   ${result.description}`);
  });
  lines.push("", "Paste-ready:", `Read ${top.path}, then: ${query}`);
  return lines.join("\n");
}
