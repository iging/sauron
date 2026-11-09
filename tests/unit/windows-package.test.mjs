// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolveSauronRoot } from "../../dist/adapters/package-root.js";
import {
  collectWindowsAssets,
  WINDOWS_ASSET_DIRS,
  renderWingetManifests,
  archiveSha256,
  unsignedPeCopy,
} from "../../dist/adapters/windows-package.js";
import { ConflictManager } from "../../dist/adapters/conflict-manager.js";
import { parse } from "yaml";
const root = fileURLToPath(new URL("../../", import.meta.url));
/** @param {(dir:string)=>void} fn */
function fixture(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sauron-windows-"));
  try {
    fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
describe("portable package asset roots", () => {
  it("uses npm location rather than cwd and decodes spaces", () =>
    fixture((dir) => {
      const pkg = path.join(dir, "package with spaces");
      fs.mkdirSync(path.join(pkg, "bin"), { recursive: true });
      fs.writeFileSync(path.join(pkg, "package.json"), '{"name":"sauron-ai"}');
      assert.equal(
        resolveSauronRoot(
          pathToFileURL(path.join(pkg, "bin/sauron.mjs")).href,
          { sea: false },
        ),
        pkg,
      );
    }));
  it("uses the real executable directory and refuses missing or unrelated assets", () =>
    fixture((dir) => {
      const exe = path.join(dir, "sauron.exe");
      fs.writeFileSync(exe, "fixture");
      fs.writeFileSync(path.join(dir, "package.json"), '{"name":"sauron-ai"}');
      assert.equal(
        resolveSauronRoot("not-a-module", { sea: true, executablePath: exe }),
        fs.realpathSync(dir),
      );
      fs.writeFileSync(path.join(dir, "package.json"), '{"name":"other"}');
      assert.throws(
        () => resolveSauronRoot("unused", { sea: true, executablePath: exe }),
        /assets/,
      );
      fs.unlinkSync(path.join(dir, "package.json"));
      assert.throws(() =>
        resolveSauronRoot("unused", { sea: true, executablePath: exe }),
      );
    }));
  it("copies only allowlisted assets and excludes internal state/notes", () =>
    fixture((dir) => {
      for (const name of WINDOWS_ASSET_DIRS)
        fs.mkdirSync(path.join(dir, name), { recursive: true });
      for (const f of [
        "package.json",
        "README.md",
        "LICENSE",
        "skills/a.md",
        "docs/public.md",
      ])
        fs.writeFileSync(path.join(dir, f), "kept");
      for (const name of [
        "docs/handoffs",
        "docs/sauron-second-brain",
        "skills/.sauron",
      ]) {
        fs.mkdirSync(path.join(dir, name));
        fs.writeFileSync(path.join(dir, name, "private.md"), "private");
      }
      fs.mkdirSync(path.join(dir, ".vscode"));
      fs.writeFileSync(path.join(dir, ".vscode/settings.json"), "private");
      const files = collectWindowsAssets(dir);
      assert.ok(files.some((f) => f.relativePath === "docs/public.md"));
      assert.ok(
        !files.some((f) =>
          /private|handoffs|second-brain|\.vscode|\.sauron/.test(
            f.relativePath,
          ),
        ),
      );
    }));
  it("refuses linked asset directories", () =>
    fixture((dir) => {
      for (const name of WINDOWS_ASSET_DIRS)
        fs.mkdirSync(path.join(dir, name), { recursive: true });
      fs.mkdirSync(path.join(dir, "external"));
      fs.symlinkSync(
        path.join(dir, "external"),
        path.join(dir, "skills/linked"),
        process.platform === "win32" ? "junction" : "dir",
      );
      assert.throws(() => collectWindowsAssets(dir), /linked/);
    }));

  it("resolves executable-directory junctions to their sibling assets", () =>
    fixture((dir) => {
      const installed = path.join(dir, "installed");
      const alias = path.join(dir, "alias");
      fs.mkdirSync(installed);
      fs.writeFileSync(path.join(installed, "sauron.exe"), "fixture");
      fs.writeFileSync(
        path.join(installed, "package.json"),
        '{"name":"sauron-ai"}',
      );
      fs.symlinkSync(
        installed,
        alias,
        process.platform === "win32" ? "junction" : "dir",
      );

      assert.equal(
        resolveSauronRoot("unused", {
          sea: true,
          executablePath: path.join(alias, "sauron.exe"),
        }),
        fs.realpathSync(installed),
      );
    }));

  it("omits credential files while retaining explicitly named env templates", () =>
    fixture((dir) => {
      for (const name of WINDOWS_ASSET_DIRS) {
        fs.mkdirSync(path.join(dir, name), { recursive: true });
      }

      for (const file of ["package.json", "README.md", "LICENSE"]) {
        fs.writeFileSync(path.join(dir, file), "fixture");
      }

      const credentials = [
        ".env",
        ".env.production",
        "private.key",
        "certificate.pem",
        "bundle.pfx",
        "id_ed25519",
      ];
      const templates = [
        ".env.example",
        ".env.sample",
        ".env.production.template",
      ];

      for (const file of [...credentials, ...templates]) {
        fs.writeFileSync(path.join(dir, "config", file), "fixture");
      }

      const paths = collectWindowsAssets(dir).map((file) => file.relativePath);

      for (const file of credentials) {
        assert.ok(!paths.includes("config/" + file), file);
      }

      for (const file of templates) {
        assert.ok(paths.includes("config/" + file), file);
      }
    }));

  it("creates binary files exactly and never overwrites existing report files", () =>
    fixture((dir) => {
      const cm = new ConflictManager(dir),
        bytes = Buffer.from([0, 255, 128, 1]);
      assert.equal(
        cm.createOnlyTree("binary", [
          { relativePath: "fixture.bin", content: bytes },
        ]),
        "created",
      );
      assert.deepEqual(
        fs.readFileSync(path.join(dir, "binary/fixture.bin")),
        bytes,
      );
      cm.createOnlyFile("copy.bin", bytes);
      assert.deepEqual(fs.readFileSync(path.join(dir, "copy.bin")), bytes);
      assert.throws(() =>
        cm.createOnlyFile("copy.bin", Buffer.from("overwrite")),
      );
      assert.equal(fs.existsSync(path.join(dir, ".sauron")), false);
    }));
});
describe("winget drafts", () => {
  it("renders coherent zip/portable manifests with a real archive hash", () =>
    fixture((dir) => {
      const archive = path.join(dir, "release.zip");
      fs.writeFileSync(archive, "archive fixture");
      const hash = archiveSha256(archive);
      const files = renderWingetManifests(root, {
        id: "Local.Sauron",
        version: "3.2.0",
        architecture: "x64",
        url: "https://github.com/iging/sauron/releases/download/v3.2.0/release.zip",
        sha256: hash,
      });
      assert.equal(files.length, 3);
      for (const f of files) {
        const doc = parse(f.content);
        assert.equal(doc.PackageIdentifier, "Local.Sauron");
        assert.equal(doc.PackageVersion, "3.2.0");
        assert.ok(!/__\w+__/.test(f.content));
      }
      const installer = parse(
        files.find((f) => f.relativePath.endsWith(".installer.yaml"))
          ?.content ?? "",
      );
      assert.equal(installer.InstallerType, "zip");
      assert.equal(installer.NestedInstallerType, "portable");
      assert.equal(
        installer.NestedInstallerFiles[0].RelativeFilePath,
        "sauron.exe",
      );
      assert.equal(installer.ArchiveBinariesDependOnPath, true);
      assert.equal(installer.Installers[0].InstallerSha256, hash.toUpperCase());
    }));
  it("rejects malformed identifiers, versions, hashes and credential URLs", () => {
    const valid = {
      id: "Local.Sauron",
      version: "3.2.0",
      architecture: /** @type {const} */ ("x64"),
      url: "https://example.com/file.zip",
      sha256: "a".repeat(64),
    };
    for (const bad of [
      { id: "../escape" },
      { id: "Single" },
      { version: "v3.2.0" },
      { sha256: "TODO" },
      { url: "http://example.com/file.zip" },
      { url: "https://secret@example.com/file.zip" },
      { url: "https://example.com/file.zip#fragment" },
    ])
      assert.throws(() => renderWingetManifests(root, { ...valid, ...bad }));
  });
});
describe("copied Node Authenticode handling", () => {
  /** @returns {Buffer} */
  const signed = () => {
    const b = Buffer.alloc(552);
    b.write("MZ");
    b.writeUInt32LE(64, 60);
    b.write("PE\0\0", 64, "binary");
    b.writeUInt16LE(240, 84);
    b.writeUInt16LE(0x20b, 88);
    b.writeUInt32LE(512, 232);
    b.writeUInt32LE(40, 236);
    b.writeUInt32LE(123, 152);
    return b;
  };
  it("removes the stale directory and trailing certificate without touching its source", () => {
    const input = signed(),
      copy = Buffer.from(input),
      output = unsignedPeCopy(input);
    assert.equal(output.length, 512);
    assert.equal(output.readUInt32LE(232), 0);
    assert.equal(output.readUInt32LE(236), 0);
    assert.equal(output.readUInt32LE(152), 0);
    assert.deepEqual(input, copy);
    assert.equal(output.toString("ascii", 0, 2), "MZ");
  });
  it("refuses truncated, invalid or overlapping certificate metadata", () => {
    assert.throws(() => unsignedPeCopy(Buffer.alloc(4)));
    const invalid = signed();
    invalid.writeUInt32LE(0xffffffff, 232);
    assert.throws(() => unsignedPeCopy(invalid));
    const overlap = signed();
    overlap.writeUInt32LE(100, 232);
    assert.throws(() => unsignedPeCopy(overlap));
  });
});
