/**
 * @fileoverview MCP Skills-over-MCP serving with skill URI scheme.
 * Follows SEP-2640 Resources-based extension with no new protocol methods.
 * Research trace: modelcontextprotocol SEP-2640, skill index, FastMCP consumer.
 */

/**
 * Minimal skill descriptor used for index generation.
 */
export interface IndexableSkill {
  /** Canonical skill name matching SKILL.md frontmatter. */
  name: string;
  /** One-line skill description. */
  description: string;
}

/**
 * Single index entry served at skill index URI.
 */
export interface SkillIndexEntry {
  /** Entry type. */
  type: "skill-md";
  /** Canonical skill name. */
  name: string;
  /** Skill description from frontmatter. */
  description: string;
  /** Full MCP resource URI. */
  url: string;
}

/**
 * Skill index document served at well-known URI.
 */
export interface SkillIndex {
  /** Schema identifier. */
  $schema: string;
  /** Skill entries. */
  skills: SkillIndexEntry[];
}

/**
 * Builds a canonical skill resource URI for a skill name.
 *
 * @param name - Canonical skill name.
 * @returns Resource URI such as skill://plan-feature/SKILL.md.
 * @throws Error when name violates charset rules.
 */
export function buildSkillResourceUri(name: string): string {
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(name)) {
    throw new Error(`Invalid skill name: ${name}`);
  }
  return `skill://${name}/SKILL.md`;
}

/**
 * Parses a skill resource URI back to a skill name with fail-closed rules.
 *
 * @param uri - Resource URI to parse.
 * @returns Canonical skill name.
 * @throws Error when URI violates expected shape.
 */
export function parseSkillUri(uri: string): string {
  const match = uri.match(/^skill:\/\/([a-z0-9][a-z0-9_-]*)\/SKILL\.md$/);
  if (match === null || match[1] === undefined) {
    throw new Error(`Invalid skill resource URI: ${uri}`);
  }
  return match[1];
}

/**
 * Builds a deterministic skill index sorted by skill name.
 *
 * @param skills - Indexable skills from workspace scan.
 * @returns Skill index document.
 */
export function buildSkillIndex(skills: IndexableSkill[]): SkillIndex {
  const sorted = [...skills].sort((a, b) => a.name.localeCompare(b.name));
  const entries: SkillIndexEntry[] = sorted.map((skill) => {
    if (skill.name.trim() === "" || skill.description.trim() === "") {
      throw new Error("Skill name and description must not be empty");
    }
    return {
      type: "skill-md",
      name: skill.name,
      description: skill.description,
      url: buildSkillResourceUri(skill.name),
    };
  });
  return {
    $schema: "https://sauron.ai/schemas/skill-index-1.0.0.json",
    skills: entries,
  };
}

/**
 * Validates a skill index document with fail-closed rules.
 *
 * @param raw - Unknown input to validate.
 * @returns Validated skill index.
 * @throws Error when document violates schema.
 */
export function validateSkillIndex(raw: unknown): SkillIndex {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Skill index must be an object");
  }
  const record = raw as Record<string, unknown>;
  const skillsRaw = record["skills"];
  if (!Array.isArray(skillsRaw)) {
    throw new Error("Skill index skills must be an array");
  }
  const skills: SkillIndexEntry[] = [];
  for (const item of skillsRaw) {
    if (typeof item !== "object" || item === null) {
      throw new Error("Skill index entry must be an object");
    }
    const entry = item as Record<string, unknown>;
    if (
      entry["type"] !== "skill-md" ||
      typeof entry["name"] !== "string" ||
      typeof entry["description"] !== "string" ||
      typeof entry["url"] !== "string"
    ) {
      throw new Error("Malformed skill index entry");
    }
    const name = entry["name"] as string;
    const url = entry["url"] as string;
    if (parseSkillUri(url) !== name) {
      throw new Error(`Index URL mismatch for skill ${name}`);
    }
    skills.push({
      type: "skill-md",
      name,
      description: entry["description"] as string,
      url,
    });
  }
  return {
    $schema: "https://sauron.ai/schemas/skill-index-1.0.0.json",
    skills,
  };
}
