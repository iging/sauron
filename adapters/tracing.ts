/**
 * @fileoverview Fellowship tracing with OTLP-compatible events.
 * Emits turn, generation, and tool span events for Langfuse-style dashboards.
 * Research trace: langfuse coding-agent tracing, OpenTelemetry export, cost dashboards.
 */

/**
 * Single trace event emitted by a Fellowship agent run.
 */
export interface TraceEvent {
  /** Stable trace identifier grouping one user turn. */
  traceId: string;
  /** Agent identifier such as gandalf or frodo. */
  agent: string;
  /** Tool name or model generation label. */
  span: string;
  /** Input token count. */
  inputTokens: number;
  /** Output token count. */
  outputTokens: number;
  /** ISO-8601 start timestamp. */
  startedAt: string;
  /** ISO-8601 end timestamp. */
  endedAt: string;
  /** Optional skill tag such as skill:plan-feature. */
  skillTag: string | null;
  /** Optional status marker. */
  status: "ok" | "failed" | "retried";
}

/**
 * Aggregated cost and usage summary grouped by agent.
 */
export interface TraceSummary {
  /** Total input tokens across events. */
  totalInputTokens: number;
  /** Total output tokens across events. */
  totalOutputTokens: number;
  /** Total event count. */
  eventCount: number;
  /** Failed event count. */
  failedCount: number;
  /** Token totals grouped by agent name. */
  byAgent: Record<string, { input: number; output: number; events: number }>;
}

/**
 * Validates a trace event with fail-closed rules.
 *
 * @param raw - Unknown input.
 * @returns Validated trace event.
 * @throws Error when event violates schema.
 */
export function validateTraceEvent(raw: unknown): TraceEvent {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Trace event must be an object");
  }
  const record = raw as Record<string, unknown>;
  const traceId = record["traceId"];
  const agent = record["agent"];
  const span = record["span"];
  const inputTokens = record["inputTokens"];
  const outputTokens = record["outputTokens"];
  const startedAt = record["startedAt"];
  const endedAt = record["endedAt"];
  const status = record["status"];
  if (
    typeof traceId !== "string" ||
    typeof agent !== "string" ||
    typeof span !== "string" ||
    typeof inputTokens !== "number" ||
    typeof outputTokens !== "number" ||
    typeof startedAt !== "string" ||
    typeof endedAt !== "string" ||
    (status !== "ok" && status !== "failed" && status !== "retried")
  ) {
    throw new Error("Malformed trace event");
  }
  if (traceId.trim() === "" || agent.trim() === "" || span.trim() === "") {
    throw new Error("Trace identifiers must not be empty");
  }
  if (
    !Number.isInteger(inputTokens) ||
    !Number.isInteger(outputTokens) ||
    inputTokens < 0 ||
    outputTokens < 0
  ) {
    throw new Error("Token counts must be non-negative integers");
  }
  const skillTagRaw = record["skillTag"];
  const skillTag =
    skillTagRaw === null || skillTagRaw === undefined
      ? null
      : String(skillTagRaw);
  return {
    traceId,
    agent,
    span,
    inputTokens,
    outputTokens,
    startedAt,
    endedAt,
    skillTag,
    status,
  };
}

/**
 * Summarizes trace events into per-agent totals.
 *
 * @param events - Validated trace events.
 * @returns Aggregated summary.
 */
export function summarizeTraces(events: TraceEvent[]): TraceSummary {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let failedCount = 0;
  const byAgent: Record<
    string,
    { input: number; output: number; events: number }
  > = {};
  for (const event of events) {
    totalInputTokens += event.inputTokens;
    totalOutputTokens += event.outputTokens;
    if (event.status === "failed") {
      failedCount += 1;
    }
    const current = byAgent[event.agent] ?? { input: 0, output: 0, events: 0 };
    current.input += event.inputTokens;
    current.output += event.outputTokens;
    current.events += 1;
    byAgent[event.agent] = current;
  }
  return {
    totalInputTokens,
    totalOutputTokens,
    eventCount: events.length,
    failedCount,
    byAgent,
  };
}

/**
 * Redacts secret-looking values from free-text fields before export.
 * Applies conservative pattern matching without external dependencies.
 *
 * @param text - Raw text to redact.
 * @returns Redacted text safe for telemetry export.
 */
export function redactSecrets(text: string): string {
  return text
    .replace(/sk-(live|test|ant)-[A-Za-z0-9-_]{8,}/g, "[REDACTED_API_KEY]")
    .replace(/AKIA[0-9A-Z]{16}/g, "[REDACTED_AWS_KEY]")
    .replace(
      /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
      "[REDACTED_PRIVATE_KEY]",
    )
    .replace(/bearer\s+[A-Za-z0-9._~+/-]{12,}/gi, "bearer [REDACTED_TOKEN]");
}

/**
 * Formats a summary into CLI-readable lines.
 *
 * @param summary - Aggregated trace summary.
 * @returns Multiline report text.
 */
export function formatTraceSummary(summary: TraceSummary): string {
  const lines: string[] = [];
  lines.push(
    `events=${summary.eventCount} failed=${summary.failedCount} in=${summary.totalInputTokens} out=${summary.totalOutputTokens}`,
  );
  const agents = Object.keys(summary.byAgent).sort();
  for (const agent of agents) {
    const entry = summary.byAgent[agent];
    if (entry !== undefined) {
      lines.push(
        `  [TRACE] ${agent} events=${entry.events} in=${entry.input} out=${entry.output}`,
      );
    }
  }
  return lines.join("\n");
}
