# API — API Contracts & Endpoint Standards

> **Purpose:** Canonical specification for REST, GraphQL, and RPC endpoints, request/response JSON envelopes, URL path semantics, cursor pagination, and deterministic error contracts. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Architectural Style & Communication Protocols

- **Primary Protocol:** RESTful over HTTPS (RFC 9110 compliant).
- **Secondary Protocol:** Server-Sent Events (SSE) or WebSockets for real-time duplex streaming.
- **Payload Format:** JSON exclusively (`Content-Type: application/json; charset=utf-8`).

---

## 2. URL Naming & Route Design Rules

1. **Plural Nouns Exclusively:** Resource collections must be plural kebab-case nouns (e.g. `/api/v1/user-accounts`, `/api/v1/billing-invoices`).
2. **Zero Verbs in URLs:** Action semantics belong to HTTP verbs, never path segments (Banned: `/api/v1/getUsers`, `/api/v1/createProject`).
3. **Resource Hierarchy:** Nest child resources strictly under parent entities to express ownership (e.g. `GET /api/v1/workspaces/:workspaceId/projects`). Limit nesting depth to a maximum of 2 levels.
4. **Idempotency Support:** All state-creating requests (`POST`) handling billing or critical workflows must support an `Idempotency-Key` header with a 24-hour retention window.

---

## 3. Standard Request & Response Envelopes

All responses must adhere to a deterministic envelope structure to simplify client-side consumption.

### 3.1 Success Envelope

```typescript
export interface ApiResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: {
    readonly timestamp: string;
    readonly requestId: string;
    readonly pagination?: {
      readonly nextCursor: string | null;
      readonly hasMore: boolean;
      readonly totalCount?: number;
    };
  };
}
```

### 3.2 Error Envelope

```typescript
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string; // Machine-readable screaming snake case (e.g. "RESOURCE_NOT_FOUND")
    readonly message: string; // Sanitized human-readable description
    readonly details?: ReadonlyArray<{
      readonly field: string;
      readonly issue: string;
    }>;
  };
  readonly meta: {
    readonly timestamp: string;
    readonly requestId: string;
  };
}
```

---

## 4. Cursor Pagination Standard

Offset pagination (`OFFSET n LIMIT m`) is banned on tables containing more than 10,000 rows due to quadratic performance degradation. Use opaque cursor-based pagination.

- **Query Parameters:** `?cursor=eyJpZCI6MTIzfQ==&limit=25`
- **Default Limit:** 20 records.
- **Maximum Limit:** 100 records (requests exceeding this threshold must be clamped to 100).
- **Cursor Generation:** Encode the indexed sorting field and unique tie-breaker (e.g. `base64(created_at + ":" + id)`).

---

## 5. HTTP Status Code Mapping

| Status Code              | Semantic Meaning        | Usage Context                                                               |
| :----------------------- | :---------------------- | :-------------------------------------------------------------------------- |
| **`200 OK`**             | Request Succeeded       | Read queries, idempotent updates (`PUT`), synchronous actions.              |
| **`201 Created`**        | Resource Created        | Successful `POST` operations returning the newly provisioned record.        |
| **`204 No Content`**     | Action Completed        | Successful deletions (`DELETE`) or updates with zero body payload.          |
| **`400 Bad Request`**    | Validation Failure      | Malformed JSON syntax or schema validation errors.                          |
| **`401 Unauthorized`**   | Missing / Invalid Token | Missing, expired, or corrupted authentication bearer credentials.           |
| **`403 Forbidden`**      | Insufficient Scope      | Valid authentication, but caller lacks necessary RBAC permissions.          |
| **`404 Not Found`**      | Resource Missing        | Targeted URI or resource identifier does not exist.                         |
| **`409 Conflict`**       | State Collision         | Unique constraint violation, concurrency race condition, or lock conflict.  |
| **`422 Unprocessable`**  | Semantic Rejection      | Valid syntax, but violates business invariants (e.g. insufficient balance). |
| **`429 Rate Limited`**   | Quota Exceeded          | Request velocity exceeds allowed sliding window threshold.                  |
| **`500 Internal Error`** | Unhandled Exception     | Internal runtime failure; must sanitize internal stack traces.              |
