// @ts-check
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  tokenizeQuery,
  parseSkillDocument,
  loadSkillCatalog,
  rankSkills,
  formatFinderReport,
} from "../../dist/adapters/skill-finder.js";

/**
 * Builds SKILL.md text for a fixture skill.
 *
 * @param {string} name
 * @param {string} description
 * @param {string[]} triggers
 * @returns {string}
 */
function fixture(name, description, triggers = []) {
  const rows = triggers.map((t) => `| "${t}" | YES | Core trigger. |`);
  return [
    "---",
    `name: ${name}`,
    `description: "${description}"`,
    "department: workflow",
    "ownerAgent: gandalf",
    `triggerCommand: /${name}`,
    "antiPatternsPrevented:",
    "  - AP-1",
    "---",
    "",
    `# ${name}`,
    "",
    "## 2. Trigger Matrix",
    "",
    "| Trigger | Fire? | Notes |",
    "| --- | --- | --- |",
    ...rows,
    '| "Deploy to production" | NO | Out of scope. |',
    "",
    "## 3. Execution Workflow",
    "",
  ].join("\n");
}

const DOCS = [
  parseSkillDocument(
    "skills/workflow/test-driven-development/SKILL.md",
    fixture(
      "test-driven-development",
      "Enforces a failing test before implementation code.",
      ["Write a failing test first"],
    ),
  ),
  parseSkillDocument(
    "skills/workflow/systematic-debugging/SKILL.md",
    fixture(
      "systematic-debugging",
      "Finds the root cause of a bug before any fix is attempted.",
      ["Why does this test fail?"],
    ),
  ),
  parseSkillDocument(
    "skills/frontend/tailwind-principles/SKILL.md",
    fixture(
      "tailwind-principles",
      "Utility class conventions for Tailwind CSS styling.",
      ["Style this component"],
    ),
  ),
];

describe("Skill finder", () => {
  describe("tokenizeQuery", () => {
    it("lowercases, splits on punctuation, and drops stop words", () => {
      assert.deepEqual(tokenizeQuery("Write the Failing-Test, first!"), [
        "write",
        "fail",
        "test",
        "first",
      ]);
    });

    it("folds plural and verb endings to one token", () => {
      assert.deepEqual(tokenizeQuery("tests testing tested"), [
        "test",
        "test",
        "test",
      ]);
    });

    it("returns an empty list for an empty or stop-word-only query", () => {
      assert.deepEqual(tokenizeQuery(""), []);
      assert.deepEqual(tokenizeQuery("the a of"), []);
    });
  });

  describe("parseSkillDocument", () => {
    it("reads frontmatter fields and normalizes the path", () => {
      const doc = parseSkillDocument(
        "skills\\workflow\\demo\\SKILL.md",
        fixture("demo", "Demo skill.", ["Run the demo"]),
      );
      assert.equal(doc.name, "demo");
      assert.equal(doc.description, "Demo skill.");
      assert.equal(doc.triggerCommand, "/demo");
      assert.equal(doc.path, "skills/workflow/demo/SKILL.md");
    });

    it("keeps only trigger phrases marked YES", () => {
      const doc = parseSkillDocument(
        "skills/x/SKILL.md",
        fixture("x", "X.", ["Run the demo"]),
      );
      assert.deepEqual(doc.triggerPhrases, ["Run the demo"]);
    });

    it("joins a multi-line description into one string", () => {
      const folded = parseSkillDocument(
        "skills/x/SKILL.md",
        [
          "---",
          "name: x",
          "description: >",
          "  First line",
          "  second line.",
          "department: workflow",
          "---",
          "",
        ].join("\n"),
      );
      assert.equal(folded.description, "First line second line.");
      assert.equal(folded.department, "workflow");
      const plain = parseSkillDocument(
        "skills/y/SKILL.md",
        [
          "---",
          "name: y",
          "description:",
          "  Indented start",
          "  and more.",
          "---",
          "",
        ].join("\n"),
      );
      assert.equal(plain.description, "Indented start and more.");
    });

    it("rejects content without frontmatter", () => {
      assert.throws(
        () => parseSkillDocument("skills/x/SKILL.md", "# No frontmatter"),
        /frontmatter/,
      );
    });

    it("rejects frontmatter without a name or a description", () => {
      assert.throws(
        () =>
          parseSkillDocument(
            "skills/x/SKILL.md",
            "---\ndescription: Only this\n---\n",
          ),
        /name/,
      );
      assert.throws(
        () => parseSkillDocument("skills/x/SKILL.md", "---\nname: x\n---\n"),
        /description/,
      );
    });
  });

  describe("rankSkills", () => {
    it("ranks the skill whose name and trigger match first", () => {
      const results = rankSkills(DOCS, "write a failing test first", 3);
      assert.equal(results[0]?.name, "test-driven-development");
    });

    it("omits skills that share no term with the query", () => {
      const results = rankSkills(DOCS, "failing test", 10);
      assert.ok(results.every((r) => r.name !== "tailwind-principles"));
      assert.ok(results.every((r) => r.score > 0));
    });

    it("weights a name match above a description match", () => {
      const results = rankSkills(DOCS, "debugging", 3);
      assert.equal(results[0]?.name, "systematic-debugging");
    });

    it("honors the limit", () => {
      assert.equal(rankSkills(DOCS, "test", 1).length, 1);
    });

    it("returns nothing for an empty query", () => {
      assert.deepEqual(rankSkills(DOCS, "   ", 5), []);
    });

    it("rejects a limit below one", () => {
      assert.throws(() => rankSkills(DOCS, "test", 0), /limit/);
    });

    it("breaks score ties by path", () => {
      const twins = [
        parseSkillDocument("skills/b/SKILL.md", fixture("twin", "Same.")),
        parseSkillDocument("skills/a/SKILL.md", fixture("twin", "Same.")),
      ];
      const results = rankSkills(twins, "twin", 2);
      assert.deepEqual(
        results.map((r) => r.path),
        ["skills/a/SKILL.md", "skills/b/SKILL.md"],
      );
    });
  });

  describe("formatFinderReport", () => {
    it("prints path, trigger command, and a paste-ready line", () => {
      const report = formatFinderReport(
        rankSkills(DOCS, "failing test first", 1),
        "failing test first",
      );
      assert.match(
        report,
        /skills\/workflow\/test-driven-development\/SKILL\.md/,
      );
      assert.match(report, /\/test-driven-development/);
      assert.match(
        report,
        /Read skills\/workflow\/test-driven-development\/SKILL\.md, then: failing test first/,
      );
    });

    it("states plainly when nothing matches", () => {
      assert.match(formatFinderReport([], "zzz"), /No skill matches "zzz"/);
    });
  });

  describe("loadSkillCatalog", () => {
    /** @type {string} */
    let root;

    before(() => {
      root = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-finder-"));
      const write = (/** @type {string} */ rel, /** @type {string} */ body) => {
        const full = path.join(root, rel);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, body, "utf8");
      };
      write("skills/workflow/good/SKILL.md", fixture("good", "Good skill."));
      write("skills/workflow/broken/SKILL.md", "# Missing frontmatter");
      write(
        "skills/_template/skill-name/SKILL.md",
        fixture("skill-name", "T."),
      );
      write("skills/workflow/good/notes.md", "not a skill");
    });

    after(() => {
      fs.rmSync(root, { recursive: true, force: true });
    });

    it("loads valid skills with paths relative to the base directory", () => {
      const catalog = loadSkillCatalog(path.join(root, "skills"), root);
      assert.deepEqual(
        catalog.documents.map((d) => d.path),
        ["skills/workflow/good/SKILL.md"],
      );
    });

    it("reports malformed skills instead of indexing them", () => {
      const catalog = loadSkillCatalog(path.join(root, "skills"), root);
      assert.equal(catalog.rejected.length, 1);
      assert.equal(
        catalog.rejected[0]?.path,
        "skills/workflow/broken/SKILL.md",
      );
      assert.match(catalog.rejected[0]?.reason ?? "", /frontmatter/);
    });

    it("fails closed when the skills directory is missing", () => {
      assert.throws(
        () => loadSkillCatalog(path.join(root, "nope"), root),
        /not found/,
      );
    });
  });
});
