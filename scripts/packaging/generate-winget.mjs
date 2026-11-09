// @ts-check
/** Generate a draft from the real archive hash. No publishing, settings or installation. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import {
  renderWingetManifests,
  archiveSha256,
} from "../../dist/adapters/windows-package.js";
const root = fileURLToPath(new URL("../../", import.meta.url));
/** @type {Map<string,string>} */
const flags = new Map();
const args = process.argv.slice(2),
  allowed = ["--id", "--archive", "--url", "--version", "--arch", "--out"];
for (let i = 0; i < args.length; i += 2) {
  const key = args[i],
    value = args[i + 1];
  if (
    !allowed.includes(key) ||
    !value ||
    value.startsWith("--") ||
    flags.has(key)
  )
    throw new Error("Expected unique named winget options with values.");
  flags.set(key, value);
}
const id = flags.get("--id"),
  archive = flags.get("--archive"),
  url = flags.get("--url"),
  out = flags.get("--out"),
  arch = flags.get("--arch") ?? "x64";
if (!id || !archive || !url || !out || !["x64", "arm64"].includes(arch))
  throw new Error(
    "Usage: generate-winget.mjs --id <chosen-id> --archive <zip> --url <https-url> --out <new-dir> [--version x.y.z] [--arch x64|arm64]",
  );
const version =
  flags.get("--version") ??
  JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
const files = renderWingetManifests(root, {
  id,
  version,
  architecture: arch === "x64" ? "x64" : "arm64",
  url,
  sha256: archiveSha256(path.resolve(root, archive)),
});
const target = path.resolve(root, out),
  relative = path.relative(root, target);
if (new ConflictManager(root).createOnlyTree(relative, files) !== "created")
  throw new Error("Manifest output already exists.");
console.log(
  "Draft manifests: " +
    target +
    ". Validate with winget; do not submit before the release URL exists.",
);
