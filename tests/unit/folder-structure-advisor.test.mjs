// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const base = "skills/architecture/folder-structure-advisor";
const read = (/** @type {string} */ file) => fs.readFileSync(file, "utf8");
const skill = read(base + "/SKILL.md");
const matrix = read(base + "/references/decision-matrix.md");
const proposal = read(base + "/references/proposal-template.md");

describe("Folder structure proposal contract", () => {
  it("owns a complete architecture workflow with honest runtime status", () => {
    assert.match(skill, /^---\r?\nname: folder-structure-advisor/);
    assert.match(skill, /department: architecture/);
    assert.match(skill, /ownerAgent: aragorn/);
    assert.match(skill, /Role:\*\* System Architect/);
    assert.match(skill, /Authority:\*\* Tier-5/);
    for (let section = 0; section <= 10; section += 1) {
      assert.ok(
        skill.includes("## " + section + ". "),
        "Missing section " + section,
      );
    }
    assert.match(skill, /instruction-only/);
    assert.match(skill, /Solo greenfield MVP/);
    assert.match(skill, /Existing web and mobile product/);
  });

  it("compares all required patterns using confirmed decision inputs", () => {
    for (const phrase of [
      "Product stage",
      "Team size and ownership",
      "App surfaces",
      "Domain language",
      "Stack constraints",
      "Layer-based",
      "Feature-based",
      "Screaming or use-case",
      "Modular with public APIs",
      "Monorepo workspaces",
      "Flat with progressive nesting",
      "Shared types",
      "Configuration",
    ]) {
      assert.ok(
        matrix.includes(phrase),
        "Missing matrix input or option: " + phrase,
      );
    }
    assert.match(matrix, /No empty placeholder directories/);
    assert.match(matrix, /not a requirement for index\.ts/);
    assert.match(matrix, /Domain dependencies point inward/);
    assert.match(matrix, /cycles or broad re-export barrels/);
  });

  it("restricts output to a reviewable proposal and defers migration execution", () => {
    assert.ok(
      skill.includes(
        "projects/<project-name>/context/core-domains/folder-structure.md",
      ),
    );
    assert.match(skill, /Only folder-structure\.md is writable/);
    assert.match(skill, /This skill does not create directories/);
    assert.match(
      skill,
      /Do not create any proposed application folders or files/,
    );
    for (const heading of [
      "Input evidence",
      "Chosen pattern and alternatives",
      "Proposed tree, text only",
      "Dependency and shared-code rules",
      "Adoption path",
      "Validation and open decisions",
    ]) {
      assert.ok(
        proposal.includes("## " + heading),
        "Missing proposal field: " + heading,
      );
    }
    assert.match(
      proposal,
      /Existing path.*Proposed path.*Import and behavior checks.*Rollback/,
    );
    assert.match(proposal, /hand actual moves to repo-reorganizer/);
  });

  it("runs automatically in both context workflows without application scaffolding", () => {
    for (const [file, finalStep] of [
      [
        "skills/workflow/define-core-domains/SKILL.md",
        "### Step 5: Final Review & Approval",
      ],
      [
        "skills/workflow/define-enterprise-context/SKILL.md",
        "### Step 6: Verification & Handoff Summary",
      ],
    ]) {
      const workflow = read(file);
      const automatic = workflow.indexOf("Automatic Folder Structure Proposal");
      assert.ok(
        automatic >= 0 && automatic < workflow.indexOf(finalStep),
        file,
      );
      const step = workflow.slice(automatic, workflow.indexOf(finalStep));
      assert.match(
        step,
        /Automatically run skills\/architecture\/folder-structure-advisor\/SKILL\.md/,
      );
      assert.match(step, /no src\/ rule/);
      assert.ok(
        step.includes(
          "projects/<project-name>/context/core-domains/folder-structure.md",
        ),
      );
    }
    assert.match(
      read("skills/workflow/define-enterprise-context/SKILL.md"),
      /only the approved projects\/<project-name>\/context\/core-domains\/ documentation container/,
    );
  });

  it("ships a sample tree for every pattern, add-on, and platform", () => {
    const samples = read(base + "/references/sample-structures.md");
    for (const heading of [
      "Flat with progressive nesting",
      "Layer-based",
      "Feature-based",
      "Screaming or use-case",
      "Modular with public APIs",
      "Monorepo workspaces",
      "Shared types",
      "Configuration by environment",
      "Web: Next.js",
      "API: Node",
      "Mobile: Expo",
      "Desktop: Electron",
      "Business system",
      "Python service",
    ]) {
      assert.ok(samples.includes(heading), "Missing sample: " + heading);
    }
    assert.ok(
      (samples.match(/```text/g) ?? []).length >= 14,
      "Each sample needs a text tree",
    );
    assert.match(samples, /Never paste a sample as the answer/);
    assert.match(skill, /references\/sample-structures\.md/);
  });

  it("ships industry-standard layouts with a source and a status for each", () => {
    const standards = read(base + "/references/industry-standards.md");
    const entries = standards.split(/\n### /).slice(1);
    assert.ok(
      entries.length >= 21,
      "Expected at least 21 stacks, found " + entries.length,
    );
    for (const entry of entries) {
      const name = entry.split("\n")[0];
      assert.match(
        name,
        /\((official|community)\b[^)]*\)$/,
        "Missing status: " + name,
      );
      assert.match(entry, /Source: <https:\/\//, "Missing source: " + name);
      assert.match(entry, /```text/, "Missing tree: " + name);
    }
    for (const stack of [
      "Next.js",
      "Angular",
      "NestJS",
      "Django",
      "Ruby on Rails",
      "Laravel",
      "Spring Boot",
      "ASP.NET Core",
      "Go module",
      "Python package",
      "Rust",
      "Android",
      "Flutter",
      "Swift Package Manager",
      "Hexagonal",
      "Domain-driven design",
      "Nx",
      "Turborepo",
      "Terraform",
      "Data science",
    ]) {
      assert.ok(standards.includes("### " + stack), "Missing stack: " + stack);
    }
    assert.match(skill, /references\/industry-standards\.md/);
    assert.match(
      skill,
      /official or tool-enforced layout, keep it as the base/,
    );
  });

  it("ships resolvable guidance links and plain English source", () => {
    for (const match of skill.matchAll(/\]\(([^)]+\.md)\)/g)) {
      assert.ok(
        fs.existsSync(path.resolve(base, match[1])),
        "Missing reference " + match[1],
      );
    }
    for (const document of [
      skill,
      matrix,
      proposal,
      read(base + "/references/sample-structures.md"),
      read(base + "/references/industry-standards.md"),
    ]) {
      assert.doesNotMatch(document, /[\u2014\u2013]/);
      assert.doesNotMatch(
        document,
        /\b(?:delve|leverage|utilize|robust|seamless|revolutionary|groundbreaking|however)\b/i,
      );
      assert.doesNotMatch(document, /;/);
    }
  });
});
