// @ts-check
/** Exercise the extracted standalone zip from a separate workspace without Node on PATH. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { archiveSha256 } from "../../dist/adapters/windows-package.js";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
const root = fileURLToPath(new URL("../../", import.meta.url)),
  args = process.argv.slice(2);
if (args.length !== 4 || args[0] !== "--archive" || args[2] !== "--work")
  throw new Error(
    "Usage: smoke-windows.mjs --archive <zip> --work <fresh-dir>",
  );
const work = path.resolve(root, args[3]),
  relative = path.relative(root, work),
  manager = new ConflictManager(root);
const cwd = path.join(work, "project with spaces");
assert.equal(
  manager.createOnlyTree(relative, [
    {
      relativePath: "project with spaces/app.js",
      content: "ipcMain.handle('read');\n",
    },
    {
      relativePath: "project with spaces/app.wasm",
      content: Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]),
    },
  ]),
  "created",
);
const legacyFiles = [
  {
    relativePath: "sauron.config.yaml",
    content: [
      "# Keep the legacy project note",
      'version: "1.0.0"',
      "project:",
      "  name: portable-legacy",
      "runtimes:",
      "  cursor: true",
      "init:",
      "  runtimes: [cursor]",
      "  agents: none",
      "  skills: [workflow]",
      "  commands: false",
      "  nativeRuntimes: []",
      "",
    ].join("\n"),
  },
];
assert.equal(
  manager.createOnlyTree(
    path.relative(root, path.join(work, "legacy project")),
    legacyFiles,
  ),
  "created",
);
const installed = path.join(work, "portable with spaces");
execFileSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-NonInteractive",
    "-File",
    path.join(root, "scripts/packaging/archive-windows.ps1"),
    "-Expand",
    "-Source",
    path.resolve(root, args[1]),
    "-Destination",
    installed,
  ],
  { stdio: "inherit" },
);
/** @type {{path:string;sha256:string}[]} */
const inventory = JSON.parse(
  fs.readFileSync(path.join(installed, "asset-manifest.json"), "utf8"),
);
assert.ok(inventory.length > 0);
for (const file of inventory) {
  const target = path.resolve(installed, file.path);
  assert.ok(target.startsWith(installed + path.sep));
  assert.equal(
    archiveSha256(target),
    file.sha256,
    "Archive asset differs: " + file.path,
  );
}
const exe = path.join(installed, "sauron.exe"),
  version = JSON.parse(
    fs.readFileSync(path.join(installed, "package.json"), "utf8"),
  ).version;
/** @param {string[]} command @param {string} [workingDirectory] */
const run = (command, workingDirectory = cwd) => {
  const env = {
    ...process.env,
    PATH: "",
    Path: "",
    NODE_PATH: "",
    NODE_OPTIONS: "",
  };
  const result = spawnSync(exe, command, {
    cwd: workingDirectory,
    env,
    encoding: "utf8",
    timeout: 60000,
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(
    result.status,
    0,
    result.stderr || result.error?.message || result.stdout,
  );
  return result.stdout;
};
assert.ok(run(["--version"]).includes("v" + version));
assert.ok(run(["--help"]).includes("eye <file>"));
assert.ok(run(["status"]).includes("S A U R O N"));
assert.ok(run(["list-skills"]).includes("llm-wiki"));
assert.equal(
  JSON.parse(run(["eye", "app.wasm", "--json"])).format,
  "WebAssembly",
);
assert.ok(run(["eye", "app.js"]).includes("js.ipc"));
run([
  "init",
  "--yes",
  "--runtimes=codex",
  "--agents=none",
  "--skills=workflow/llm-wiki",
]);
assert.ok(fs.existsSync(path.join(cwd, "AGENTS.md")));
assert.ok(
  fs.existsSync(
    path.join(cwd, ".agents/skills/llm-wiki/references/operations.md"),
  ),
);
assert.ok(run(["doctor"]).includes("DOCTOR"));
run(["repair", "--dry-run"]);
const scan = JSON.parse(run(["scan", "--json", "--fail-on=none"]));
assert.ok(scan);
run(["graph", "."]);
assert.ok(fs.existsSync(path.join(cwd, ".sauron/graph/graph.json")));
run(["uninstall", "--yes"]);
assert.ok(fs.existsSync(path.join(cwd, "sauron.config.yaml")));

const legacyCwd = path.join(work, "legacy project");
const legacyConfig = path.join(legacyCwd, "sauron.config.yaml");
const originalConfig = fs.readFileSync(legacyConfig, "utf8");

run(["upgrade", "--dry-run"], legacyCwd);
assert.equal(fs.readFileSync(legacyConfig, "utf8"), originalConfig);
assert.equal(fs.existsSync(path.join(legacyCwd, ".sauron")), false);

run(["upgrade"], legacyCwd);
const upgraded = fs.readFileSync(legacyConfig, "utf8");
assert.match(upgraded, /version:\s*["']?2\.0\.0/);
assert.ok(upgraded.includes("Keep the legacy project note"));
assert.ok(
  fs
    .readdirSync(path.join(legacyCwd, ".sauron/backups"))
    .some(
      (file) =>
        fs.readFileSync(
          path.join(legacyCwd, ".sauron/backups", file),
          "utf8",
        ) === originalConfig,
    ),
);
assert.ok(
  fs.readdirSync(path.join(legacyCwd, ".sauron/upgrade-reports")).length > 0,
);

run(["sync"], legacyCwd);
assert.ok(fs.existsSync(path.join(legacyCwd, "AGENTS.md")));

assert.equal(fs.existsSync(path.join(installed, "node_modules")), false);
assert.ok(fs.existsSync(path.join(installed, "NODE-LICENSE.txt")));
assert.ok(fs.existsSync(path.join(installed, "THIRD-PARTY-NOTICES.txt")));
assert.equal(
  fs.existsSync(path.join(installed, "docs/sauron-second-brain")),
  false,
);
assert.equal(fs.existsSync(path.join(installed, "docs/handoffs")), false);
console.log(
  "Extracted portable zip passes version/help/status/catalog/init/upgrade/sync/doctor/repair/Eye/scan/graph/uninstall without Node on PATH.",
);
