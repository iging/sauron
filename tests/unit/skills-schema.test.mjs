// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR = path.resolve("skills");
const VALID_AGENTS = new Set([
  "gandalf",
  "aragorn",
  "legolas",
  "gimli",
  "boromir",
  "frodo",
  "samwise",
  "merry",
  "pippin",
]);

/**
 * Recursively find all SKILL.md files.
 * @param {string} dir
 * @returns {string[]}
 */
function findSkillFiles(dir) {
  /** @type {string[]} */
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findSkillFiles(full));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      results.push(full);
    }
  }
  return results;
}

describe("Skill Ecosystem Schema & Standards", () => {
  const skillFiles = findSkillFiles(SKILLS_DIR);

  it("finds registered skill definitions in skills directory", () => {
    assert.ok(
      skillFiles.length >= 40,
      `Expected at least 40 skills, found ${skillFiles.length}`,
    );
  });

  it("validates that every SKILL.md contains required frontmatter attributes", () => {
    for (const file of skillFiles) {
      const content = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(process.cwd(), file);

      assert.ok(
        content.startsWith("---"),
        `Skill ${relativePath} must start with YAML frontmatter delimiter (---)`,
      );

      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      assert.ok(
        frontmatterMatch,
        `Skill ${relativePath} must have closed YAML frontmatter`,
      );

      const frontmatter = frontmatterMatch[1];
      assert.ok(
        /name:\s*["']?[a-zA-Z0-9_\-]+["']?/.test(frontmatter),
        `Skill ${relativePath} must declare 'name'`,
      );
      assert.ok(
        /description:\s*.+/.test(frontmatter),
        `Skill ${relativePath} must declare 'description'`,
      );
      assert.ok(
        /department:\s*[a-zA-Z0-9_\-]+/.test(frontmatter),
        `Skill ${relativePath} must declare 'department'`,
      );

      // Check ownerAgent if declared
      const ownerMatch = frontmatter.match(/ownerAgent:\s*([a-zA-Z0-9_\-]+)/);
      if (ownerMatch) {
        const agent = ownerMatch[1].toLowerCase();
        assert.ok(
          VALID_AGENTS.has(agent),
          `Skill ${relativePath} declares unknown ownerAgent '${agent}'`,
        );
      }
    }
  });

  it("enforces zero broken internal link syntax across skills", () => {
    for (const file of skillFiles) {
      const content = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(process.cwd(), file);

      // Check for empty markdown links [text]()
      assert.ok(
        !/\[[^\]]+\]\(\s*\)/.test(content),
        `Skill ${relativePath} contains empty markdown link`,
      );
    }
  });
});
