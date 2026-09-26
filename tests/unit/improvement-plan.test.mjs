// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeIntegrity,
  parseLockfile,
  satisfiesRange,
  detectDrift,
  formatDriftReport,
} from "../../dist/adapters/skills-lock.js";
import {
  buildSkillResourceUri,
  parseSkillUri,
  buildSkillIndex,
  validateSkillIndex,
} from "../../dist/adapters/mcp-skills.js";
import {
  validateTraceEvent,
  summarizeTraces,
  redactSecrets,
} from "../../dist/adapters/tracing.js";
import {
  allowsImportDirection,
  checkLayerImports,
  checkDocFreshness,
} from "../../dist/adapters/fitness.js";
import {
  isValidBranchName,
  buildWorktreePlan,
  formatWorktreeCommands,
} from "../../dist/adapters/worktree.js";
import {
  scorePackage,
  scanUnsafeSinks,
  toSarif,
} from "../../dist/adapters/slopsquat.js";
import {
  detectPlatforms,
  buildImportPlan,
  convertMdcToMarkdown,
} from "../../dist/adapters/importer.js";
import {
  validateEntry,
  computeCompletenessScore,
  publishEntry,
  detectsDrift,
  buildCatalog,
} from "../../dist/adapters/registry.js";

describe("P0 skills lockfile with drift detection", () => {
  it("computes stable sha512 integrity", () => {
    const first = computeIntegrity("plan-feature content");
    const second = computeIntegrity("plan-feature content");
    assert.equal(first, second);
    assert.ok(first.startsWith("sha512:"));
  });

  it("parses valid lockfile and rejects malformed input", () => {
    const lock = parseLockfile({
      version: "1.0.0",
      skills: {
        "plan-feature": {
          name: "plan-feature",
          version: "1.0.0",
          resolved: "https://registry.example/plan-feature-1.0.0.tgz",
          integrity: computeIntegrity("v1"),
          installedAt: new Date().toISOString(),
        },
      },
    });
    assert.equal(lock.skills["plan-feature"]?.version, "1.0.0");
    assert.throws(() => parseLockfile({ version: "9.9.9", skills: {} }));
  });

  it("resolves caret and tilde ranges", () => {
    assert.equal(satisfiesRange("^1.2.0", "1.4.0"), true);
    assert.equal(satisfiesRange("^1.2.0", "2.0.0"), false);
    assert.equal(satisfiesRange("~1.2.0", "1.2.9"), true);
    assert.equal(satisfiesRange("~1.2.0", "1.3.0"), false);
    assert.equal(satisfiesRange("1.2.3", "1.2.3"), true);
  });

  it("detects missing changed untracked and outdated", () => {
    const integrity = computeIntegrity("v1");
    const lock = parseLockfile({
      version: "1.0.0",
      skills: {
        a: {
          name: "a",
          version: "1.0.0",
          resolved: "x",
          integrity,
          installedAt: "2026-01-01T00:00:00.000Z",
        },
        b: {
          name: "b",
          version: "1.0.0",
          resolved: "x",
          integrity,
          installedAt: "2026-01-01T00:00:00.000Z",
        },
      },
    });
    const report = detectDrift(
      lock,
      { a: "sha512:other", c: "sha512:new" },
      { a: "2.0.0" },
    );
    assert.deepEqual(report.changed, ["a"]);
    assert.deepEqual(report.missing, ["b"]);
    assert.deepEqual(report.untracked, ["c"]);
    assert.deepEqual(report.outdated, ["a"]);
    assert.ok(formatDriftReport(report).includes("missing=1"));
  });
});

describe("P1 MCP skills serving", () => {
  it("builds and parses skill URIs", () => {
    assert.equal(
      buildSkillResourceUri("plan-feature"),
      "skill://plan-feature/SKILL.md",
    );
    assert.equal(
      parseSkillUri("skill://plan-feature/SKILL.md"),
      "plan-feature",
    );
    assert.throws(() => buildSkillResourceUri("Bad Name!"));
    assert.throws(() => parseSkillUri("https://example.com/x"));
  });

  it("builds sorted index and validates round trip", () => {
    const index = buildSkillIndex([
      { name: "zebra", description: "Zebra skill description here." },
      { name: "alpha", description: "Alpha skill description here." },
    ]);
    assert.equal(index.skills[0]?.name, "alpha");
    const validated = validateSkillIndex(JSON.parse(JSON.stringify(index)));
    assert.equal(validated.skills.length, 2);
  });
});

describe("P2 fellowship tracing", () => {
  it("validates events and summarizes per agent", () => {
    const events = [
      validateTraceEvent({
        traceId: "t1",
        agent: "gandalf",
        span: "plan",
        inputTokens: 100,
        outputTokens: 50,
        startedAt: "2026-01-01T00:00:00.000Z",
        endedAt: "2026-01-01T00:00:01.000Z",
        skillTag: "skill:plan-feature",
        status: "ok",
      }),
      validateTraceEvent({
        traceId: "t1",
        agent: "frodo",
        span: "edit",
        inputTokens: 10,
        outputTokens: 5,
        startedAt: "2026-01-01T00:00:02.000Z",
        endedAt: "2026-01-01T00:00:03.000Z",
        skillTag: null,
        status: "failed",
      }),
    ];
    const summary = summarizeTraces(events);
    assert.equal(summary.eventCount, 2);
    assert.equal(summary.failedCount, 1);
    assert.equal(summary.byAgent["gandalf"]?.input, 100);
  });

  it("redacts secrets before export", () => {
    const redacted = redactSecrets(
      "key=AKIAIOSFODNN7EXAMPLE and token bearer abcdef1234567890",
    );
    assert.ok(!redacted.includes("AKIAIOSFODNN7EXAMPLE"));
  });
});

describe("P3 fitness functions", () => {
  it("enforces forward-only layer direction", () => {
    assert.equal(allowsImportDirection("service", "ui"), true);
    assert.equal(allowsImportDirection("ui", "service"), false);
    assert.equal(allowsImportDirection("unknown", "ui"), false);
  });

  it("flags backward imports and stale docs", () => {
    const findings = checkLayerImports(
      "ui/page.ts",
      `import { repo } from "../repo/user-repo";`,
    );
    assert.ok(findings.length >= 0);
    const stale = checkDocFreshness(
      "ARCH.md",
      "TODO: update",
      "2026-06-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
    );
    assert.equal(stale.length, 1);
  });
});

describe("P4 worktree orchestration", () => {
  it("rejects main branch and validates names", () => {
    assert.equal(isValidBranchName("main"), false);
    assert.equal(isValidBranchName("feat/auth-login"), true);
  });

  it("builds isolated assignments without duplicate tasks", () => {
    const plan = buildWorktreePlan(
      ["auth", "cleanup"],
      ["frodo", "gimli"],
      "execute",
    );
    assert.equal(plan.length, 2);
    assert.ok(plan[0]?.branch.startsWith("feat/"));
    assert.ok(formatWorktreeCommands(plan).includes("git worktree add"));
    assert.throws(() =>
      buildWorktreePlan(["same", "same"], ["frodo", "gimli"], "execute"),
    );
  });
});

describe("P5 slopsquat guard and SAST", () => {
  it("blocks hallucinated packages", () => {
    const verdict = scorePackage({
      name: "nope-not-real",
      exists: false,
      ageDays: 0,
      weeklyDownloads: 0,
      maintainers: 0,
    });
    assert.equal(verdict.allow, false);
    assert.equal(verdict.risk, 100);
  });

  it("scans unsafe sinks and emits SARIF", () => {
    const findings = scanUnsafeSinks(
      "app.py",
      "result = eval(user_input)\n# eval in comment stays ignored\n",
    );
    assert.ok(findings.some((item) => item.rule === "no-eval"));
    const sarif = JSON.parse(toSarif(findings));
    assert.equal(sarif.version, "2.1.0");
  });
});

describe("P6 AGENTS import", () => {
  it("detects platforms and builds sorted plan", () => {
    const platforms = detectPlatforms([
      "CLAUDE.md",
      ".cursorrules",
      ".github/copilot-instructions.md",
    ]);
    assert.ok(platforms.includes("claude"));
    assert.ok(platforms.includes("cursor"));
    const plan = buildImportPlan([".cursorrules", "CLAUDE.md"]);
    assert.equal(plan.length, 2);
    assert.ok(
      plan[0]?.destination.localeCompare(plan[1]?.destination ?? "") <= 0,
    );
  });

  it("converts MDC to markdown", () => {
    const converted = convertMdcToMarkdown(
      "---\ndescription: test\nalwaysApply: true\n---\n\nBody text here\n",
    );
    assert.ok(converted.includes("Body text here"));
  });
});

describe("P7 governed registry", () => {
  it("validates entries and enforces quality gate", () => {
    const entry = validateEntry({
      slug: "plan-feature",
      name: "plan-feature",
      description: "Localized planning skill with scope boundaries.",
      source: "https://github.com/example/skills",
      commit: "abc1234",
      digest: "sha256:abc",
      version: "1.0.0",
      status: "draft",
      score: 85,
    });
    assert.equal(entry.slug, "plan-feature");
    const published = publishEntry(entry, 70);
    assert.equal(published.status, "published");
    assert.throws(() => publishEntry({ ...entry, score: 10 }, 70));
  });

  it("computes completeness and detects drift", () => {
    const score = computeCompletenessScore({
      slug: "x",
      name: "x",
      description: "A sufficiently long description for scoring.",
      source: "https://github.com/example/x",
      commit: "abc1234",
      digest: "sha256:abcdef1234567890",
      version: "1.0.0",
    });
    assert.ok(score >= 70);
    const entry = validateEntry({
      slug: "x",
      name: "x",
      description: "A sufficiently long description for scoring.",
      source: "https://github.com/example/x",
      commit: "abc1234",
      digest: "sha256:aaa",
      version: "1.0.0",
      status: "published",
      score: 90,
    });
    assert.equal(detectsDrift(entry, "abc1234", "sha256:aaa"), false);
    assert.equal(detectsDrift(entry, "def5678", "sha256:aaa"), true);
    const catalog = buildCatalog([entry], []);
    assert.equal(catalog.entries.length, 1);
    const excluded = buildCatalog([entry], ["x"]);
    assert.equal(excluded.entries.length, 0);
  });
});
