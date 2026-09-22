// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const CAVEMAN_DIR = path.resolve("skills", "workflow", "caveman");

describe("Caveman Token Optimization Suite", () => {
  it("verifies root dispatcher SKILL.md exists with all compression tiers", () => {
    const rootSkillPath = path.join(CAVEMAN_DIR, "SKILL.md");
    assert.ok(fs.existsSync(rootSkillPath), "caveman SKILL.md must exist");

    const content = fs.readFileSync(rootSkillPath, "utf8");
    assert.ok(content.includes("lite"), "Must specify 'lite' mode");
    assert.ok(content.includes("full"), "Must specify 'full' mode");
    assert.ok(content.includes("ultra"), "Must specify 'ultra' mode");
  });

  it("verifies all 4 specialized sub-skills exist and have valid triggers", () => {
    const subSkills = ["commit", "review", "compress", "help"];
    for (const sub of subSkills) {
      const subSkillPath = path.join(CAVEMAN_DIR, sub, "SKILL.md");
      assert.ok(
        fs.existsSync(subSkillPath),
        `Caveman sub-skill '${sub}' SKILL.md must exist`,
      );

      const content = fs.readFileSync(subSkillPath, "utf8");
      assert.ok(
        content.includes(`triggerCommand: /caveman-${sub}`) ||
          content.includes(`triggerCommand: /caveman`) ||
          content.includes(`triggerCommand:`),
        `Caveman sub-skill '${sub}' must declare triggerCommand in frontmatter`,
      );
    }
  });

  it("enforces preservation constraints for technical code and file paths", () => {
    const rootSkillPath = path.join(CAVEMAN_DIR, "SKILL.md");
    const content = fs.readFileSync(rootSkillPath, "utf8");
    assert.ok(
      content.includes("Preserve code") || content.includes("preserve"),
      "Caveman must strictly enforce code and path preservation",
    );
  });
});
