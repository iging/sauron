/** Portable release assets and winget metadata. No publishing or installation. */
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

/** Explicit release roots. Internal vault, handoffs and workspace state are excluded. */
export const WINDOWS_ASSET_DIRS = [
  "skills",
  "core",
  "config",
  "rules",
  "references",
  "commands",
  "scripts",
  "licenses",
  "docs",
] as const;

/** A binary-safe file copied into a freshly reserved portable package. */
export interface WindowsAsset {
  relativePath: string;
  content: Uint8Array;
}

/** Keep credential files out of portable releases while retaining explicit env templates. */
function isCredentialFile(name: string): boolean {
  if (/^\.env(?:\..+)?$/i.test(name)) {
    return !/\.(?:example|sample|template)$/i.test(name);
  }

  return (
    /\.(?:pem|key|p12|pfx)$/i.test(name) ||
    /^id_(?:rsa|dsa|ecdsa|ed25519)$/i.test(name)
  );
}

/** Collect real allowlisted files while rejecting linked directories and special files. */
export function collectWindowsAssets(root: string): WindowsAsset[] {
  const files: WindowsAsset[] = [];
  const visit = (relative: string): void => {
    const full = path.join(root, relative);
    const stat = fs.lstatSync(full);

    if (stat.isSymbolicLink())
      throw new Error("Portable assets cannot contain linked paths.");
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(full).sort()) {
        if (
          [".git", ".sauron", ".vscode", "node_modules"].includes(name) ||
          isCredentialFile(name)
        )
          continue;
        if (
          relative === "docs" &&
          ["handoffs", "sauron-second-brain"].includes(name)
        )
          continue;
        visit(relative + "/" + name);
      }
    } else if (stat.isFile())
      files.push({ relativePath: relative, content: fs.readFileSync(full) });
    else throw new Error("Portable assets must be regular files.");
  };

  for (const dir of WINDOWS_ASSET_DIRS) visit(dir);
  for (const file of ["package.json", "README.md", "LICENSE"]) visit(file);

  return files;
}

/** Render coherent manifests from explicit identity, version, URL and real archive hash. */
export function renderWingetManifests(
  root: string,
  input: {
    id: string;
    version: string;
    architecture: "x64" | "arm64";
    url: string;
    sha256: string;
  },
): { relativePath: string; content: string }[] {
  if (
    !/^[A-Za-z0-9-]{1,32}(?:\.[A-Za-z0-9-]{1,32}){1,7}$/.test(input.id) ||
    input.id.length > 128
  )
    throw new Error("Choose a publisher.package winget identifier.");
  if (!/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(input.version))
    throw new Error("Invalid package version.");
  if (
    !["x64", "arm64"].includes(input.architecture) ||
    !/^[a-fA-F0-9]{64}$/.test(input.sha256)
  )
    throw new Error("Invalid archive metadata.");

  const url = new URL(input.url);

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.hash ||
    /[\x00-\x20]/.test(input.url)
  )
    throw new Error("Installer URL must be public HTTPS without credentials.");

  const values: { [key: string]: string } = {
    PACKAGE_ID: input.id,
    VERSION: input.version,
    ARCHITECTURE: input.architecture,
    INSTALLER_URL: input.url,
    SHA256: input.sha256.toUpperCase(),
  };
  const names = [
    ["version", input.id + ".yaml"],
    ["installer", input.id + ".installer.yaml"],
    ["default-locale", input.id + ".locale.en-US.yaml"],
  ] as const;

  return names.map(([template, relativePath]) => {
    const raw = fs.readFileSync(
      path.join(root, "packaging/winget", template + ".yaml.in"),
      "utf8",
    );
    const content = raw.replace(/__([A-Z_0-9]+)__/g, (_match, key: string) => {
      const value = values[key];

      if (value === undefined) throw new Error("Unknown winget template key.");

      return JSON.stringify(value);
    });

    return { relativePath, content };
  });
}

/** Hash a bounded regular artifact before it is referenced by a winget manifest. */
export function archiveSha256(file: string): string {
  const stat = fs.lstatSync(file);

  if (stat.isSymbolicLink() || !stat.isFile() || stat.size > 512 * 1024 * 1024)
    throw new Error("Archive must be a bounded regular file.");

  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
}

/** Remove the copied Node executable's stale Authenticode directory before SEA injection. */
export function unsignedPeCopy(input: Uint8Array): Buffer {
  let data = Buffer.from(input);
  const checked = (off: number, size: number) => {
    if (off < 0 || !Number.isSafeInteger(off) || off + size > data.length)
      throw new Error("Invalid build executable header.");
  };
  checked(0, 64);
  if (data.toString("ascii", 0, 2) !== "MZ")
    throw new Error("Expected a Windows PE executable.");

  const pe = data.readUInt32LE(60);
  checked(pe, 24);
  if (data.toString("binary", pe, pe + 4) !== "PE\0\0")
    throw new Error("Expected a PE signature.");

  const opt = pe + 24;
  const size = data.readUInt16LE(pe + 20);
  checked(opt, size);
  checked(opt, 2);
  const magic = data.readUInt16LE(opt);
  const base = magic === 0x20b ? 112 : magic === 0x10b ? 96 : 0;

  if (!base || size < base + 40)
    throw new Error("Expected PE optional header directories.");

  const security = opt + base + 32;
  const off = data.readUInt32LE(security);
  const len = data.readUInt32LE(security + 4);

  if (off || len) {
    if (!off || len < 8) throw new Error("Invalid PE certificate directory.");
    checked(off, len);
    if (off < opt + size) throw new Error("Certificate overlaps PE headers.");
  }
  data.fill(0, security, security + 8);
  data.fill(0, opt + 64, opt + 68);
  if (len && off + len === data.length) data = data.subarray(0, off);

  return data;
}
