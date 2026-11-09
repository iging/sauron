/// <reference types="node" />
/** @fileoverview Eye evidence contract and checked binary reads. Target data never becomes instructions. */
import * as crypto from "node:crypto";

/** JSON-safe values allowed in the evidence ledger. */
export type EyeValue =
  | null
  | string
  | number
  | boolean
  | EyeValue[]
  | { [key: string]: EyeValue };

/** One classified observation, inference or explicit gap with a stable report-local ID. */
export interface EyeEvidence {
  id: string;
  status: "observed" | "inferred" | "unknown";
  kind: string;
  summary: string;
  value: EyeValue;
  source: string;
  offset?: number;
  length?: number;
  reason?: string;
  evidence?: string[];
}

/** Bounded report shared by text, JSON, diff, reuse and MCP outputs. */
export interface EyeReport {
  schemaVersion: 1;
  target: { name: string; size: number; sha256: string };
  format: string;
  partial: boolean;
  evidence: EyeEvidence[];
  diagnostics: {
    code: string;
    message: string;
    source: string;
    offset?: number;
  }[];
  limitations: string[];
}

/** Global resource ceilings. Nested parsers share entry and inflation budgets. */
export const EYE_LIMITS = Object.freeze({
  inputBytes: 32 * 1024 * 1024,
  entryBytes: 4 * 1024 * 1024,
  inflatedBytes: 16 * 1024 * 1024,
  entries: 2000,
  evidence: 4000,
  depth: 4,
  strings: 256,
  stringBytes: 160,
});

/** A safe diagnostic code. Never put target bytes into a parser exception. */
export class EyeParseError extends Error {
  readonly code: string;

  constructor(code: string = "bounds") {
    super("Input exceeds a checked format boundary.");
    this.code = code;
  }
}

/** Check integer offsets before exposing a byte slice to any format parser. */
export function eyeRange(data: Buffer, offset: number, length: number): Buffer {
  if (
    !Number.isSafeInteger(offset) ||
    !Number.isSafeInteger(length) ||
    offset < 0 ||
    length < 0 ||
    offset > data.length ||
    length > data.length - offset
  )
    throw new EyeParseError();

  return data.subarray(offset, offset + length);
}

/** Read a checked 16-bit integer using the format's declared byte order. */
export function eyeU16(data: Buffer, offset: number, little = true): number {
  const value = eyeRange(data, offset, 2);

  return little ? value.readUInt16LE(0) : value.readUInt16BE(0);
}

/** Read a checked 32-bit integer using the format's declared byte order. */
export function eyeU32(data: Buffer, offset: number, little = true): number {
  const value = eyeRange(data, offset, 4);

  return little ? value.readUInt32LE(0) : value.readUInt32BE(0);
}

/** Reject 64-bit offsets that JavaScript cannot represent exactly. */
export function eyeU64(data: Buffer, offset: number, little = true): number {
  const value = eyeRange(data, offset, 8);
  const number = little ? value.readBigUInt64LE(0) : value.readBigUInt64BE(0);

  if (number > BigInt(Number.MAX_SAFE_INTEGER))
    throw new EyeParseError("integer");

  return Number(number);
}

/** Read a bounded NUL-terminated string and redact unsafe printable content. */
export function eyeCString(
  data: Buffer,
  offset: number,
  max = EYE_LIMITS.stringBytes,
): string {
  eyeRange(data, offset, 1);
  const end = Math.min(data.length, offset + max);
  const zero = data.indexOf(0, offset);

  return eyeText(
    data
      .subarray(offset, zero >= offset && zero < end ? zero : end)
      .toString("utf8"),
  );
}

/** Apply conservative control-character and credential-pattern redaction. */
export function eyeText(value: string, maximum = 256): string {
  return value
    .replace(/[\x00-\x1f\x7f]/g, " ")
    .replace(
      /\b(?:Bearer\s+|(?:token|password|secret|api[_-]?key|authorization)\s*[:=]\s*)[^\s,;]+/gi,
      "[redacted]",
    )
    .replace(/\b[A-Za-z0-9_+/=-]{48,}\b/g, "[redacted]")
    .slice(0, maximum);
}

/** Hash inert bytes for target identity. This does not establish authenticity. */
export function eyeHash(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/** Keep public route segments while dropping credentials, query and fragment data. */
export function eyeUrl(value: string): string | undefined {
  try {
    const url = new URL(value);

    if (!["http:", "https:", "ws:", "wss:"].includes(url.protocol))
      return undefined;

    const publicSegments =
      /^(?:api|v\d+|users?|auth|login|logout|graphql|rest|sessions?|assets?|static|images?|js|css|index(?:\.html)?|health|status)$/i;
    const route = url.pathname
      .split("/")
      .map((part) => (!part || publicSegments.test(part) ? part : "[redacted]"))
      .join("/");

    return eyeText(url.protocol + "//" + url.host + route);
  } catch {
    return undefined;
  }
}

/** Sanitize nested evidence values independently of the format parser that supplies them. */
function clean(value: EyeValue, depth = 0): EyeValue {
  if (depth > 8) return "[bounded]";
  if (typeof value === "string")
    return eyeText(
      value.replace(
        /https?:\/\/[^\s"'<>]+/g,
        (url) => eyeUrl(url) ?? "[redacted-url]",
      ),
    );
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value === null || typeof value === "boolean") return value;
  if (Array.isArray(value))
    return value.slice(0, 128).map((item) => clean(item, depth + 1));

  const result: { [key: string]: EyeValue } = Object.create(null) as {
    [key: string]: EyeValue;
  };

  for (const [key, item] of Object.entries(value).slice(0, 64))
    result[eyeText(key, 80)] =
      /token|secret|password|authorization|cookie/i.test(key)
        ? "[redacted]"
        : clean(item, depth + 1);

  return result;
}

/** Append evidence and diagnostics while sharing limits across nested containers. */
export class EyeContext {
  readonly report: EyeReport;
  readonly source: string;
  readonly budget: { entries: number; inflatedBytes: number };
  readonly depth: number;

  constructor(
    report: EyeReport,
    source: string,
    budget = { entries: 0, inflatedBytes: 0 },
    depth = 0,
  ) {
    this.report = report;
    this.source = source;
    this.budget = budget;
    this.depth = depth;
  }

  private add(
    status: EyeEvidence["status"],
    kind: string,
    summary: string,
    value: EyeValue,
    offset?: number,
    length?: number,
    reason?: string,
    evidence?: string[],
  ): string {
    if (this.report.evidence.length >= EYE_LIMITS.evidence) {
      this.diagnostic(
        "evidence-limit",
        "Further evidence exceeds the ledger limit.",
      );

      return "";
    }

    const id = "E" + String(this.report.evidence.length + 1).padStart(5, "0");
    this.report.evidence.push({
      id,
      status,
      kind: eyeText(kind, 100),
      summary: eyeText(summary),
      value: clean(value),
      source: eyeText(this.source),
      ...(offset === undefined ? {} : { offset }),
      ...(length === undefined ? {} : { length }),
      ...(reason === undefined ? {} : { reason: eyeText(reason) }),
      ...(evidence === undefined
        ? {}
        : { evidence: evidence.filter(Boolean).slice(0, 128) }),
    });

    return id;
  }

  observe(
    kind: string,
    summary: string,
    value: EyeValue = null,
    offset?: number,
    length?: number,
  ): string {
    return this.add("observed", kind, summary, value, offset, length);
  }

  infer(
    kind: string,
    summary: string,
    reason: string,
    evidence: string[] = [],
    value: EyeValue = null,
  ): string {
    return this.add(
      "inferred",
      kind,
      summary,
      value,
      undefined,
      undefined,
      reason,
      evidence,
    );
  }

  unknown(kind: string, reason: string): string {
    this.report.partial = true;

    return this.add(
      "unknown",
      kind,
      "Not established by bounded static inspection.",
      null,
      undefined,
      undefined,
      reason,
    );
  }

  diagnostic(code: string, message: string, offset?: number): void {
    this.report.partial = true;
    if (
      this.report.diagnostics.length < 100 &&
      !this.report.diagnostics.some(
        (item) =>
          item.source === this.source &&
          item.code === code &&
          item.offset === offset,
      )
    )
      this.report.diagnostics.push({
        code: eyeText(code, 80),
        message: eyeText(message),
        source: eyeText(this.source),
        ...(offset === undefined ? {} : { offset }),
      });
  }

  fork(source: string): EyeContext {
    return new EyeContext(
      this.report,
      this.source + "!" + eyeText(source),
      this.budget,
      this.depth + 1,
    );
  }
}

/** Delegate nested bytes without extraction, execution or a fresh resource budget. */
export type EyeChildInspector = (
  data: Buffer,
  name: string,
  context: EyeContext,
) => void;

/** Recognize and inspect inert bytes. Unsupported details remain explicit unknowns. */
export interface EyeFormatParser {
  format: string;
  detect(data: Buffer, name: string): boolean;
  parse(
    data: Buffer,
    context: EyeContext,
    inspectChild: EyeChildInspector,
  ): void;
}
