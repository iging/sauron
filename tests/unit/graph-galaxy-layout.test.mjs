// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { computeGalaxyLayout, scanSourceFiles } from "../../scripts/graph/generate-graph.mjs";

/** @param {string} category @param {number} count */
const make = (category, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${category}/file${i}.ts`,
    category,
    inDegree: i % 5,
    outDegree: i % 3,
  }));

describe("Graph galaxy layout", () => {
  const nodes = [...make("backend", 360), ...make("frontend", 300), ...make("packages", 160), ...make("root", 15)];

  it("gives every node a position and one galaxy per department", () => {
    const { positions, galaxies } = computeGalaxyLayout(nodes);
    assert.equal(positions.size, nodes.length);
    assert.deepEqual(galaxies.map((g) => g.category), ["backend", "frontend", "packages", "root"]);
  });

  it("is deterministic", () => {
    const a = computeGalaxyLayout(nodes);
    const b = computeGalaxyLayout(nodes);
    assert.deepEqual([...a.positions.entries()], [...b.positions.entries()]);
  });

  it("keeps galaxies apart instead of one round blob", () => {
    const { galaxies } = computeGalaxyLayout(nodes);
    for (let i = 0; i < galaxies.length; i++) {
      for (let j = i + 1; j < galaxies.length; j++) {
        const a = galaxies[i];
        const b = galaxies[j];
        const gap = Math.hypot(a.x - b.x, a.y - b.y);
        assert.ok(gap > a.radius + b.radius, `${a.category} and ${b.category} overlap`);
      }
    }
  });

  it("places each node near its own galaxy", () => {
    const { positions, galaxies } = computeGalaxyLayout(nodes);
    const byName = new Map(galaxies.map((g) => [g.category, g]));
    for (const node of nodes) {
      const g = byName.get(node.category);
      const p = positions.get(node.id);
      assert.ok(g && p);
      assert.ok(Math.hypot(p.x - g.x, p.y - g.y) < g.radius * 1.4, `${node.id} drifted out of its galaxy`);
    }
  });

  it("skips framework build output such as .next when scanning", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-graph-next-"));
    try {
      fs.mkdirSync(path.join(dir, "frontend", "src"), { recursive: true });
      fs.mkdirSync(path.join(dir, "frontend", ".next", "server"), { recursive: true });
      fs.writeFileSync(path.join(dir, "frontend", "src", "page.tsx"), "export default 1;\n");
      fs.writeFileSync(path.join(dir, "frontend", ".next", "server", "page.js"), "module.exports = 1;\n");
      const files = scanSourceFiles(dir).map((f) => path.relative(dir, f).split(path.sep).join("/"));
      assert.deepEqual(files, ["frontend/src/page.tsx"]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("skips .claude/worktrees copies when scanning", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-graph-wt-"));
    try {
      fs.mkdirSync(path.join(dir, "src"), { recursive: true });
      fs.mkdirSync(path.join(dir, ".claude", "worktrees", "copy", "src"), { recursive: true });
      fs.writeFileSync(path.join(dir, "src", "a.ts"), "export const a = 1;\n");
      fs.writeFileSync(path.join(dir, ".claude", "worktrees", "copy", "src", "a.ts"), "export const a = 1;\n");
      const files = scanSourceFiles(dir).map((f) => path.relative(dir, f).split(path.sep).join("/"));
      assert.deepEqual(files, ["src/a.ts"]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
