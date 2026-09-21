# OBSERVABILITY — Observability & Telemetry Standards

> **Purpose:** Canonical standards for distributed request tracing (OpenTelemetry), structured JSON logging, application performance metrics, and alerting thresholds. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Structured JSON Logging Contract

Plain-text string logging (`console.log("user logged in")`) is strictly banned in production. All logs must be output as single-line JSON objects with standard fields.

```typescript
export interface StructuredLogMessage {
  readonly timestamp: string; // ISO 8601 UTC timestamp
  readonly level: "debug" | "info" | "warn" | "error";
  readonly message: string; // Concise, searchable event description
  readonly service: string; // Application / service identifier
  readonly environment: string; // "production" | "staging" | "development"
  readonly traceId?: string; // Distributed OpenTelemetry trace ID
  readonly spanId?: string; // Current execution span ID
  readonly tenantId?: string; // Scoped customer tenancy identifier
  readonly error?: {
    readonly name: string;
    readonly message: string;
    readonly stack?: string;
  };
  readonly [key: string]: unknown; // Additional structured context attributes
}
```

---

## 2. Distributed Tracing (OpenTelemetry Baseline)

- **Trace Propagation:** Every incoming HTTP request must extract or generate a W3C `traceparent` header (`00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`).
- **Span Boundaries:** Wrap long-lived operations, database query executions, cache retrievals, and external HTTP requests in explicit spans.
- **Trace Sampling Rate:** 100% on errors (HTTP 5xx) and slow requests (> 500ms); adaptive 10% sampling on healthy production traffic to control telemetry storage costs.

---

## 3. Critical Metrics & Alerting Thresholds

| Metric Name                  | Type      | Unit         | Alert Trigger Threshold   | Action                                                   |
| :--------------------------- | :-------- | :----------- | :------------------------ | :------------------------------------------------------- |
| `http.server.requests`       | Counter   | Count        | N/A                       | Measures request volume categorized by status code.      |
| `http.server.duration`       | Histogram | Milliseconds | P95 > 250ms for 5 minutes | Page on-call engineer; trigger auto-scaling check.       |
| `http.server.errors`         | Counter   | Count        | 5xx error rate > 1.0%     | P1 Incident trigger; review recent canary rollouts.      |
| `db.pool.active_connections` | Gauge     | Count        | Active > 85% capacity     | Warning alert; inspect connection leaks and pool limits. |
