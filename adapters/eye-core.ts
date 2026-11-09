/// <reference types="node" />
/** @fileoverview Eye core, HAR and JavaScript signals. All target material remains inert data.
 * HAR historical format reference: https://webperfwg.org/specs/HAR/Overview.html
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  EYE_LIMITS,
  EyeContext,
  EyeParseError,
  eyeHash,
  eyeText,
  eyeUrl,
  type EyeReport,
  type EyeFormatParser,
  type EyeChildInspector,
  type EyeValue,
} from "./eye-types.js";
import { eyeArchiveParsers } from "./eye-archives.js";
import { eyeNativeParsers } from "./eye-native.js";

/** Narrow untrusted JSON values before reading HAR or package fields. */
function object(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Extract allowlisted request metadata. Credentials, headers and bodies are omitted. */
function parseHar(data: Buffer, ctx: EyeContext): void {
  const parsed: unknown = JSON.parse(data.toString("utf8"));
  const log = object(object(parsed)?.log);
  const entries = log?.entries;

  if (!Array.isArray(entries)) throw new EyeParseError("har-log");

  const domains = new Map<string, number>();
  let first = "";
  let thirdParty = 0;

  for (let index = 0; index < entries.length; index++) {
    if (++ctx.budget.entries > EYE_LIMITS.entries) {
      ctx.diagnostic(
        "entry-limit",
        "Additional HAR entries exceed the global entry limit.",
      );
      break;
    }

    const entry = object(entries[index]);
    const request = object(entry?.request);
    const response = object(entry?.response);

    if (!request || typeof request.url !== "string") {
      ctx.diagnostic(
        "har-entry",
        "HAR request metadata is missing or malformed.",
      );
      continue;
    }

    const redacted = eyeUrl(request.url);

    if (!redacted) {
      ctx.diagnostic(
        "har-url",
        "A request endpoint cannot be safely represented.",
      );
      continue;
    }

    const url = new URL(request.url);

    if (!first) first = url.hostname;
    if (url.hostname !== first) thirdParty++;
    domains.set(url.hostname, (domains.get(url.hostname) ?? 0) + 1);
    const method =
      typeof request.method === "string" &&
      /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)$/.test(
        request.method,
      )
        ? request.method
        : "unknown";
    const status =
      typeof response?.status === "number" &&
      Number.isInteger(response.status) &&
      response.status >= 100 &&
      response.status <= 599
        ? response.status
        : null;
    ctx
      .fork("request-" + index)
      .observe(
        "har.request",
        "Request metadata with all credentials and payload values excluded.",
        {
          method,
          endpoint: redacted,
          routeHash: eyeHash(url.pathname).slice(0, 16),
          status,
        },
      );
  }
  const hosts: EyeValue[] = [...domains]
    .slice(0, 128)
    .map(([host, count]) => ({ host: eyeText(host), requests: count }));
  const evidence = ctx.observe(
    "har.domains",
    "Request host counts from HAR entries.",
    hosts,
  );
  ctx.infer(
    "har.third-party",
    "Requests to hosts different from the first request.",
    "Host comparison is not organization or ownership verification.",
    [evidence],
    { requests: thirdParty },
  );
  ctx.observe(
    "har.privacy",
    "Cookies, headers, payloads, query values and URL user information are intentionally omitted.",
    {
      endpointPaths: "Non-public segments are redacted",
      queryValues: "omitted",
      bodies: "omitted",
    },
  );
}

/** Find bounded package/URL/IPC signals without evaluating source text. */
function parseText(data: Buffer, ctx: EyeContext): void {
  const text = new TextDecoder("utf-8", { fatal: true }).decode(data);

  if (text.includes("\0")) throw new EyeParseError("text-encoding");
  ctx.observe("text.encoding", "Input decodes as UTF-8 text.", {
    bytes: data.length,
  });
  if (/^\s*\{/.test(text)) {
    try {
      const parsed: unknown = JSON.parse(text);
      const record = object(parsed);

      if (Array.isArray(object(record?.log)?.entries)) {
        parseHar(data, ctx);

        return;
      }
      if (
        record &&
        typeof record.name === "string" &&
        typeof record.version === "string"
      ) {
        const metadata: { [key: string]: EyeValue } = {
          name: eyeText(record.name),
          version: eyeText(record.version),
        };

        for (const key of ["main", "module", "type"])
          if (typeof record[key] === "string")
            metadata[key] = eyeText(record[key]);
        ctx.observe(
          "package.identity",
          "Declared package fields, not verified publisher identity.",
          metadata,
        );
      }
    } catch {
      if (/\.json$/i.test(ctx.source))
        ctx.diagnostic("json-parse", "JSON metadata cannot be fully parsed.");
    }
  }

  const urls = new Set<string>();

  for (const match of text.matchAll(/https?:\/\/[^\s"'<>\x60\\]+/g)) {
    const value = eyeUrl(match[0]);

    if (value) urls.add(value);
    if (urls.size >= 64) {
      ctx.diagnostic(
        "url-limit",
        "Further URL signals exceed the display limit.",
      );
      break;
    }
  }
  if (urls.size)
    ctx.observe(
      "js.urls",
      "Literal URL signals with private path segments and query values removed.",
      [...urls],
    );

  let ipc = 0;
  const ids: string[] = [];

  for (const match of text.matchAll(
    /\b(?:ipcMain|ipcRenderer)\s*\.\s*(on|once|handle|send|invoke|sendSync)\s*\(\s*["']([^"'\r\n]{1,160})["']/g,
  )) {
    ids.push(
      ctx.observe(
        "js.ipc",
        "Literal Electron IPC call signal, not executed behavior.",
        { operation: match[1] ?? "unknown", channel: eyeText(match[2] ?? "") },
      ),
    );
    if (++ipc >= 128) {
      ctx.diagnostic(
        "ipc-limit",
        "Further IPC signals exceed the display limit.",
      );
      break;
    }
  }
  if (/\b(?:ipcMain|ipcRenderer|BrowserWindow)\b/.test(text)) {
    if (!ids.length)
      ids.push(
        ctx.observe(
          "js.electron-marker",
          "Electron-related identifier text is present.",
          true,
        ),
      );
    ctx.infer(
      "js.framework",
      "Electron-related static signals.",
      "Names and literals can appear in comments or inactive code and do not prove execution.",
      ids,
      "Electron",
    );
  }
}

/** Use extension or a bounded printable prefix for conservative text detection. */
const textParser: EyeFormatParser = {
  format: "text",
  detect: (data, name) =>
    /\.(?:[cm]?js|jsx|tsx?|json|txt|md)$/i.test(name) ||
    (data.length > 0 &&
      data
        .subarray(0, 256)
        .every(
          (byte) =>
            byte === 9 ||
            byte === 10 ||
            byte === 13 ||
            (byte >= 32 && byte < 127),
        )),
  parse: (data, ctx) => parseText(data, ctx),
};

/** Recognize HAR names or a bounded log-object prefix before checked JSON parsing. */
const harParser: EyeFormatParser = {
  format: "har",
  detect: (data, name) =>
    /\.har$/i.test(name) ||
    /^\s*\{\s*"log"\s*:/.test(data.subarray(0, 512).toString("utf8")),
  parse: (data, ctx) => parseHar(data, ctx),
};

/** Create the shared ledger shape and disclose static-inspection limitations. */
function report(name: string, size: number, sha256 = ""): EyeReport {
  return {
    schemaVersion: 1,
    target: {
      name: eyeText(name.split(/[\\/]/).pop() ?? "target"),
      size,
      sha256,
    },
    format: "unknown",
    partial: false,
    evidence: [],
    diagnostics: [],
    limitations: [
      "Static observations only. No target code is executed and no network is used.",
      "A declared identity, API name, certificate or string is not proof of runtime behavior or trust.",
      "Input, evidence, recursion and decompression limits can make a report partial.",
      "Private HAR fields and endpoint segments are omitted. Binary strings use conservative redaction.",
    ],
  };
}

/** Inspect provided bytes. Extra parsers augment matching containers rather than replacing them. */
export function inspectEyeBuffer(
  data: Buffer,
  name = "target",
  extraParsers: readonly EyeFormatParser[] = [],
): EyeReport {
  const result = report(
    name,
    data.length,
    data.length <= EYE_LIMITS.inputBytes ? eyeHash(data) : "",
  );
  const context = new EyeContext(result, result.target.name);

  if (data.length > EYE_LIMITS.inputBytes) {
    context.diagnostic(
      "input-limit",
      "Target exceeds the input byte limit. No bytes are parsed.",
    );

    return result;
  }

  const parsers = [
    harParser,
    ...eyeArchiveParsers,
    ...eyeNativeParsers,
    textParser,
  ];
  const inspect: EyeChildInspector = (bytes, childName, ctx) => {
    if (ctx.depth > EYE_LIMITS.depth) {
      ctx.diagnostic(
        "depth-limit",
        "Nested content exceeds the recursion limit.",
      );

      return;
    }

    const base = parsers.find((parser) => parser.detect(bytes, childName));
    const extras = extraParsers.filter((parser) =>
      parser.detect(bytes, childName),
    );

    if (ctx.depth === 0)
      result.format = base?.format ?? extras[0]?.format ?? "unknown";
    if (!base && !extras.length) {
      ctx.unknown(
        "format",
        "The input format is not recognized by the registered static parsers.",
      );

      return;
    }
    for (const parser of [...(base ? [base] : []), ...extras]) {
      try {
        parser.parse(bytes, ctx, inspect);
      } catch (error) {
        ctx.diagnostic(
          error instanceof EyeParseError ? error.code : "parse",
          "Parser stops at malformed, truncated, unsupported or bounded input.",
        );
      }
    }
  };
  inspect(data, name, context);

  return result;
}

/** Reads only a checked regular file. Symlinks, junctions and special files are refused. */
export function inspectEyeFile(
  target: string,
  extraParsers: readonly EyeFormatParser[] = [],
): EyeReport {
  const fallback = report(path.basename(target), 0);
  const ctx = new EyeContext(fallback, fallback.target.name);
  let fd: number | undefined;
  try {
    const full = path.resolve(target);
    const parsed = path.parse(full);
    let prefix = parsed.root;

    for (const part of full.slice(parsed.root.length).split(path.sep)) {
      prefix = path.join(prefix, part);
      if (fs.lstatSync(prefix).isSymbolicLink())
        throw new EyeParseError("target-link");
    }
    const info = fs.lstatSync(full);
    fallback.target.size = info.size;
    if (!info.isFile()) throw new EyeParseError("target-file");
    if (info.size > EYE_LIMITS.inputBytes)
      throw new EyeParseError("input-limit");
    fd = fs.openSync(
      full,
      fs.constants.O_RDONLY |
        (fs.constants.O_NOFOLLOW ?? 0) |
        (fs.constants.O_NONBLOCK ?? 0),
    );
    const before = fs.fstatSync(fd);

    if (
      !before.isFile() ||
      before.ino !== info.ino ||
      before.dev !== info.dev ||
      before.size !== info.size
    )
      throw new EyeParseError("target-changed");

    const bytes = Buffer.alloc(info.size + 1);
    let length = 0;

    while (length < bytes.length) {
      const count = fs.readSync(fd, bytes, length, bytes.length - length, null);

      if (!count) break;
      length += count;
    }
    const after = fs.fstatSync(fd);

    if (
      length !== info.size ||
      before.mtimeMs !== after.mtimeMs ||
      before.size !== after.size
    )
      throw new EyeParseError("target-changed");

    return inspectEyeBuffer(
      bytes.subarray(0, length),
      path.basename(target),
      extraParsers,
    );
  } catch (error) {
    ctx.diagnostic(
      error instanceof EyeParseError ? error.code : "target-read",
      "Target cannot be safely read as a bounded regular file.",
    );

    return fallback;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}
