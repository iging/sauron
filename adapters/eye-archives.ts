/// <reference types="node" />
/** @fileoverview Bounded in-memory ZIP and ASAR metadata inspection.
 * References: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
 * https://github.com/electron/asar/blob/main/README.md
 */
import { inflateRawSync } from "node:zlib";
import {
  EYE_LIMITS,
  EyeContext,
  EyeParseError,
  eyeRange,
  eyeU16,
  eyeU32,
  type EyeChildInspector,
  type EyeFormatParser,
} from "./eye-types.js";

/** Limit nested inspection to formats handled by the registered passive parsers. */
function interesting(name: string): boolean {
  return /(?:\.(?:[cm]?js|jsx|tsx?|json|har|asar|zip|apk|exe|dll|so|dylib|dex|wasm|pyc|sqlite|db|pcap|pcapng|dmp|bin)|AndroidManifest\.xml)$/i.test(
    name,
  );
}

/** Reject archive traversal and absolute paths even though entries stay in memory. */
function safeName(name: string): boolean {
  return (
    !/^(?:[\\/]|[a-z]:)/i.test(name) &&
    !name.split(/[\\/]/).some((part) => part === ".." || part === ".") &&
    !name.includes("\0")
  );
}

/** Check ZIP entry integrity using the format's CRC-32 polynomial. */
function crc32(data: Buffer): number {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

/** Validate central/local records and cap inflated bytes before delegating entry content. */
function parseZip(
  data: Buffer,
  ctx: EyeContext,
  inspect: EyeChildInspector,
): void {
  let end = -1;

  for (
    let offset = data.length - 22;
    offset >= Math.max(0, data.length - 65557);
    offset--
  )
    if (
      eyeU32(data, offset) === 0x06054b50 &&
      offset + 22 + eyeU16(data, offset + 20) === data.length
    ) {
      end = offset;
      break;
    }
  if (end < 0) throw new EyeParseError("zip-directory");

  const count = eyeU16(data, end + 10);
  const size = eyeU32(data, end + 12);
  const start = eyeU32(data, end + 16);
  ctx.observe(
    "zip.header",
    "ZIP central directory declarations.",
    { entries: count, directoryBytes: size },
    end,
    22,
  );
  if (
    eyeU16(data, end + 4) ||
    eyeU16(data, end + 6) ||
    eyeU16(data, end + 8) !== count
  ) {
    ctx.unknown("zip.multidisk", "Multi-disk ZIP content is unsupported.");

    return;
  }
  if (count === 0xffff || start === 0xffffffff || size === 0xffffffff) {
    ctx.unknown("zip.zip64", "ZIP64 content is not decoded.");

    return;
  }
  eyeRange(data, start, size);
  if (start + size > end) throw new EyeParseError("zip-directory");

  let offset = start;

  for (let index = 0; index < count; index++) {
    if (++ctx.budget.entries > EYE_LIMITS.entries) {
      ctx.diagnostic(
        "entry-limit",
        "Additional archive entries exceed the shared entry limit.",
      );
      break;
    }
    eyeRange(data, offset, 46);
    if (eyeU32(data, offset) !== 0x02014b50)
      throw new EyeParseError("zip-directory");

    const flags = eyeU16(data, offset + 8);
    const method = eyeU16(data, offset + 10);
    const crc = eyeU32(data, offset + 16);
    const compressed = eyeU32(data, offset + 20);
    const sizeBytes = eyeU32(data, offset + 24);
    const nameLength = eyeU16(data, offset + 28);
    const extraLength = eyeU16(data, offset + 30);
    const commentLength = eyeU16(data, offset + 32);
    const local = eyeU32(data, offset + 42);
    const next = offset + 46 + nameLength + extraLength + commentLength;

    if (next > start + size) throw new EyeParseError("zip-directory");

    const rawName = eyeRange(data, offset + 46, nameLength);
    const name = rawName.toString(flags & 0x800 ? "utf8" : "latin1");
    const child = ctx.fork(name);
    child.observe(
      "zip.entry",
      "Central directory entry declarations.",
      {
        name,
        compressedBytes: compressed,
        declaredBytes: sizeBytes,
        method,
        encrypted: Boolean(flags & 1),
      },
      offset,
      next - offset,
    );
    offset = next;
    if (!safeName(name)) {
      child.diagnostic(
        "archive-path",
        "Unsafe archive member name is not inspected.",
      );
      continue;
    }
    if (flags & 1) {
      child.unknown(
        "zip.encrypted",
        "Encrypted member content is unavailable.",
      );
      continue;
    }
    if (method !== 0 && method !== 8) {
      child.unknown(
        "zip.compression",
        "This compression method is unsupported.",
      );
      continue;
    }
    if (
      sizeBytes > EYE_LIMITS.entryBytes ||
      sizeBytes > EYE_LIMITS.inflatedBytes - ctx.budget.inflatedBytes
    ) {
      child.diagnostic(
        "inflate-limit",
        "Declared output exceeds an entry or cumulative inflation limit.",
      );
      continue;
    }
    try {
      eyeRange(data, local, 30);
      if (
        eyeU32(data, local) !== 0x04034b50 ||
        eyeU16(data, local + 6) !== flags ||
        eyeU16(data, local + 8) !== method
      )
        throw new EyeParseError("zip-local");

      const localNameLength = eyeU16(data, local + 26);
      const localExtraLength = eyeU16(data, local + 28);

      if (!eyeRange(data, local + 30, localNameLength).equals(rawName))
        throw new EyeParseError("zip-name");
      if (
        !(flags & 8) &&
        (eyeU32(data, local + 14) !== crc ||
          eyeU32(data, local + 18) !== compressed ||
          eyeU32(data, local + 22) !== sizeBytes)
      )
        throw new EyeParseError("zip-local");

      const body = local + 30 + localNameLength + localExtraLength;

      if (body + compressed > start) throw new EyeParseError("zip-overlap");

      const encoded = eyeRange(data, body, compressed);
      const bytes =
        method === 0
          ? encoded
          : inflateRawSync(encoded, {
              maxOutputLength: Math.max(
                1,
                Math.min(
                  EYE_LIMITS.entryBytes,
                  EYE_LIMITS.inflatedBytes - ctx.budget.inflatedBytes,
                ),
              ),
            });

      if (bytes.length !== sizeBytes || crc32(bytes) !== crc)
        throw new EyeParseError("zip-integrity");
      ctx.budget.inflatedBytes += bytes.length;
      if (interesting(name) && !name.endsWith("/")) inspect(bytes, name, child);
    } catch (error) {
      child.diagnostic(
        error instanceof EyeParseError ? error.code : "zip-inflate",
        "Member cannot be safely decoded within verified archive boundaries.",
      );
    }
  }
  if (offset !== start + size && ctx.budget.entries <= EYE_LIMITS.entries)
    ctx.diagnostic(
      "zip-directory-size",
      "Directory size does not match parsed member records.",
    );
}

/** Narrow JSON objects before following ASAR header fields. */
function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Walk bounded packed ASAR entries. External links and unpacked files are not followed. */
function parseAsar(
  data: Buffer,
  ctx: EyeContext,
  inspect: EyeChildInspector,
): void {
  if (eyeU32(data, 0) !== 4) throw new EyeParseError("asar-header");

  const headerSize = eyeU32(data, 4);
  const payloadSize = eyeU32(data, 8);
  const jsonSize = eyeU32(data, 12);

  if (
    headerSize < 8 ||
    payloadSize !== headerSize - 4 ||
    jsonSize > headerSize - 8
  )
    throw new EyeParseError("asar-header");
  eyeRange(data, 8, headerSize);
  const body = 8 + headerSize;
  const parsed: unknown = JSON.parse(
    eyeRange(data, 16, jsonSize).toString("utf8"),
  );
  ctx.observe(
    "asar.header",
    "ASAR JSON header and body boundaries.",
    { headerBytes: headerSize, bodyOffset: body },
    0,
    body,
  );
  const visit = (files: unknown, prefix: string, depth: number): void => {
    const entries = record(files);

    if (!entries) throw new EyeParseError("asar-files");
    if (depth > EYE_LIMITS.depth) {
      ctx.diagnostic(
        "depth-limit",
        "ASAR directory nesting exceeds the inspection limit.",
      );

      return;
    }
    for (const [name, value] of Object.entries(entries)) {
      if (++ctx.budget.entries > EYE_LIMITS.entries) {
        ctx.diagnostic(
          "entry-limit",
          "Additional archive entries exceed the shared entry limit.",
        );

        return;
      }

      const full = prefix + name;
      const item = record(value);
      const child = ctx.fork(full);

      if (!item || !safeName(full)) {
        child.diagnostic(
          "asar-entry",
          "Archive metadata or member name is invalid.",
        );
        continue;
      }
      if (item.files !== undefined) {
        visit(item.files, full + "/", depth + 1);
        continue;
      }
      if (item.link !== undefined || item.unpacked === true) {
        child.unknown(
          "asar.external",
          "Linked and unpacked members are not followed.",
        );
        continue;
      }
      if (
        typeof item.offset !== "string" ||
        !/^\d+$/.test(item.offset) ||
        typeof item.size !== "number" ||
        !Number.isSafeInteger(item.size) ||
        item.size < 0
      ) {
        child.diagnostic("asar-entry", "Member offset or size is invalid.");
        continue;
      }

      const relative = Number(item.offset);

      if (!Number.isSafeInteger(relative)) {
        child.diagnostic(
          "asar-offset",
          "Member offset exceeds the safe integer range.",
        );
        continue;
      }
      child.observe("asar.entry", "Packed ASAR member declaration.", {
        name: full,
        declaredBytes: item.size,
        offset: relative,
      });
      if (
        item.size > EYE_LIMITS.entryBytes ||
        item.size > EYE_LIMITS.inflatedBytes - ctx.budget.inflatedBytes
      ) {
        child.diagnostic(
          "entry-limit",
          "Member exceeds the entry or cumulative byte limit.",
        );
        continue;
      }
      try {
        const bytes = eyeRange(data, body + relative, item.size);
        ctx.budget.inflatedBytes += bytes.length;
        if (interesting(full)) inspect(bytes, full, child);
      } catch {
        child.diagnostic(
          "asar-bounds",
          "Member exceeds the archive body boundary.",
        );
      }
    }
  };
  visit(record(parsed)?.files, "", 0);
}

/** Register in-memory container readers. No extraction path is exposed. */
export const eyeArchiveParsers: readonly EyeFormatParser[] = [
  {
    format: "zip",
    detect: (data, name) =>
      /\.(?:zip|apk)$/i.test(name) ||
      (data.length >= 4 && [0x04034b50, 0x06054b50].includes(eyeU32(data, 0))),
    parse: parseZip,
  },
  {
    format: "asar",
    detect: (data, name) =>
      /\.asar$/i.test(name) ||
      (data.length >= 16 &&
        eyeU32(data, 0) === 4 &&
        eyeU32(data, 4) === eyeU32(data, 8) + 4),
    parse: parseAsar,
  },
];
