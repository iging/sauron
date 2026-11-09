// @ts-check
/** Build a fresh Windows SEA and portable asset zip. Never modifies an existing output. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { build } from "esbuild";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import {
  collectWindowsAssets,
  archiveSha256,
  unsignedPeCopy,
} from "../../dist/adapters/windows-package.js";
const root = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.slice(2);
if (process.platform !== "win32" || !["x64", "arm64"].includes(process.arch))
  throw new Error("Build natively on Windows x64 or arm64.");
if (Number(process.versions.node.split(".")[0]) !== 24)
  throw new Error("Build the Windows executable with Node 24.");
if (args.length && !(args.length === 2 && args[0] === "--out"))
  throw new Error("Usage: build-windows.mjs [--out <new-workspace-directory>]");
const relative = args[1] ?? "build/windows-" + process.arch;
if (
  path.isAbsolute(relative) ||
  path.win32.isAbsolute(relative) ||
  relative.split(/[\\/]/).includes("..")
)
  throw new Error("Build output must stay inside the workspace.");
const output = path.resolve(root, relative);
if (fs.existsSync(output))
  throw new Error(
    "Build output already exists. Choose a fresh --out directory.",
  );
const result = await build({
  absWorkingDir: root,
  entryPoints: ["bin/sauron.mjs"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node24",
  write: false,
  metafile: true,
  legalComments: "inline",
  define: { "import.meta.url": "__sauronModuleUrl" },
  banner: {
    js: 'const __sauronModuleUrl = require("node:url").pathToFileURL(__filename).href;',
  },
});
const script = result.outputFiles?.[0];
if (!script) throw new Error("The CLI bundle is empty.");
const metadata = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const work = path.join(output, "work"),
  assets = path.join(output, "package");
const config = {
  main: path.join(work, "sauron.cjs"),
  output: path.join(work, "sauron.blob"),
  disableExperimentalSEAWarning: true,
  useSnapshot: false,
  useCodeCache: false,
  execArgvExtension: "none",
};
/** @type {Map<string,{name:string;version:string;license:string;directory:string}>} */
const bundled = new Map();
for (const input of Object.keys(result.metafile.inputs)) {
  if (!input.includes("node_modules/")) continue;
  let dir = path.dirname(path.resolve(root, input));
  while (
    dir !== path.dirname(dir) &&
    !fs.existsSync(path.join(dir, "package.json"))
  )
    dir = path.dirname(dir);
  const file = path.join(dir, "package.json");
  if (!fs.existsSync(file))
    throw new Error("Missing bundled dependency metadata.");
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  bundled.set(pkg.name, {
    name: pkg.name,
    version: pkg.version,
    license: String(pkg.license ?? "See upstream license"),
    directory: dir,
  });
}
let notices = "Bundled JavaScript dependencies\n\n";
for (const pkg of [...bundled.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
)) {
  const license = fs
    .readdirSync(pkg.directory)
    .find((name) => /^licen[sc]e(?:\.(?:md|txt))?$/i.test(name));
  if (!license) throw new Error("Missing bundled license for " + pkg.name);
  notices +=
    pkg.name +
    "@" +
    pkg.version +
    " (" +
    pkg.license +
    ")\n" +
    fs.readFileSync(path.join(pkg.directory, license), "utf8") +
    "\n\n";
}
const localLicense = path.join(path.dirname(process.execPath), "LICENSE");
let nodeLicense;
if (fs.existsSync(localLicense))
  nodeLicense = fs.readFileSync(localLicense, "utf8");
else {
  const response = await fetch(
    "https://raw.githubusercontent.com/nodejs/node/v" +
      process.versions.node +
      "/LICENSE",
    { signal: AbortSignal.timeout(30000) },
  );
  if (!response.ok)
    throw new Error("Cannot retrieve the matching Node license.");
  nodeLicense = await response.text();
}
if (
  !nodeLicense.includes("Node.js") ||
  nodeLicense.length < 1000 ||
  nodeLicense.length > 2 * 1024 * 1024
)
  throw new Error("Matching Node license is invalid.");
const manager = new ConflictManager(root);
const files = [
  { relativePath: "work/sauron.cjs", content: script.contents },
  {
    relativePath: "work/sea-config.json",
    content: JSON.stringify(config, null, 2) + "\n",
  },
  {
    relativePath: "package/sauron.exe",
    content: unsignedPeCopy(fs.readFileSync(process.execPath)),
  },
  { relativePath: "package/NODE-LICENSE.txt", content: nodeLicense },
  { relativePath: "package/THIRD-PARTY-NOTICES.txt", content: notices },
  ...collectWindowsAssets(root).map((file) => ({
    ...file,
    relativePath: "package/" + file.relativePath,
  })),
];
if (manager.createOnlyTree(relative, files) !== "created")
  throw new Error("Build output is not fresh.");
// Compiler and resource injector touch only newly reserved build artifacts.
execFileSync(
  process.execPath,
  ["--experimental-sea-config", path.join(work, "sea-config.json")],
  { cwd: work, stdio: "inherit" },
);
const require = createRequire(import.meta.url);
execFileSync(
  process.execPath,
  [
    require.resolve("postject/dist/cli.js"),
    path.join(assets, "sauron.exe"),
    "NODE_SEA_BLOB",
    path.join(work, "sauron.blob"),
    "--sentinel-fuse",
    "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2",
  ],
  { stdio: "inherit" },
);
const inventory = files
  .filter((file) => file.relativePath.startsWith("package/"))
  .map((file) => {
    const name = file.relativePath.slice("package/".length);
    return { path: name, sha256: archiveSha256(path.join(assets, name)) };
  });
manager.createOnlyFile(
  path.relative(root, path.join(assets, "asset-manifest.json")),
  JSON.stringify(inventory, null, 2) + "\n",
);
const filename =
  "sauron-" + metadata.version + "-windows-" + process.arch + ".zip";
const archive = path.join(output, filename);
execFileSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-NonInteractive",
    "-File",
    path.join(root, "scripts/packaging/archive-windows.ps1"),
    "-Source",
    assets,
    "-Destination",
    archive,
  ],
  { stdio: "inherit" },
);
const info = {
  version: metadata.version,
  node: process.versions.node,
  architecture: process.arch,
  filename,
  sha256: archiveSha256(archive),
  bundledDependencies: [...bundled.values()].map(
    ({ name, version, license }) => ({ name, version, license }),
  ),
};
manager.createOnlyFile(
  path.relative(root, path.join(output, "build-info.json")),
  JSON.stringify(info, null, 2) + "\n",
);
console.log(JSON.stringify(info, null, 2));
