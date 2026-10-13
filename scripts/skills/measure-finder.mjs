#!/usr/bin/env node
// @ts-check
/**
 * @fileoverview Measures what `sauron find-skill` returns against what a catalog read costs.
 * Prints character counts and timing for this repository so documentation quotes measured
 * figures only. Characters are reported, not tokens: token counts depend on the model.
 *
 * Usage: node scripts/skills/measure-finder.mjs ["<task>"]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadSkillCatalog,
  rankSkills,
  formatFinderReport,
} from "../../dist/adapters/skill-finder.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SKILLS_ROOT = path.join(ROOT, "skills");
const query = process.argv[2] ?? "write a unit test for this function";

const started = performance.now();
const catalog = loadSkillCatalog(SKILLS_ROOT, ROOT);
const results = rankSkills(catalog.documents, query, 5);
const elapsedMs = performance.now() - started;

const report = formatFinderReport(results, query);
const descriptionChars = catalog.documents.reduce(
  (sum, doc) => sum + doc.name.length + doc.description.length,
  0,
);
const fullChars = catalog.documents.reduce(
  (sum, doc) => sum + fs.readFileSync(path.join(ROOT, doc.path), "utf8").length,
  0,
);
const topFile = results[0];
const topChars =
  topFile === undefined
    ? 0
    : fs.readFileSync(path.join(ROOT, topFile.path), "utf8").length;

/**
 * @param {number} part
 * @param {number} whole
 * @returns {string}
 */
const percent = (part, whole) =>
  whole === 0 ? "n/a" : `${((part / whole) * 100).toFixed(2)}%`;

console.log(`Query: "${query}"`);
console.log(`Skills indexed: ${catalog.documents.length}`);
console.log(`Skills rejected: ${catalog.rejected.length}`);
console.log(`Scan and rank time: ${elapsedMs.toFixed(0)} ms`);
console.log("");
console.log("Characters an agent reads to choose a skill:");
console.log(`  A. find-skill report (top 5):            ${report.length}`);
console.log(`  B. every name and description:           ${descriptionChars}`);
console.log(`  C. every SKILL.md in full:               ${fullChars}`);
console.log("");
console.log(`A as a share of B: ${percent(report.length, descriptionChars)}`);
console.log(`A as a share of C: ${percent(report.length, fullChars)}`);
console.log(`Top result file size: ${topChars} characters`);
