---
id: api-doc-gen
name: API Documentation and OpenAPI Specification Generator
department: documentation
owner_agent: aragorn
trigger_command: /api-doc-gen
version: 1.0.0
---

# API Documentation and OpenAPI Specification Generator

Extract, validate, and generate comprehensive API documentation, endpoint catalogs, and OpenAPI 3.1 specifications directly from code routes and schema definitions. Ensure total synchronization between runtime handlers, parameter schemas, and published developer documentation.

## When to Activate

- Exposing new REST or RPC endpoints to external or internal clients.
- Updating route parameters, request payloads, or response headers.
- Generating OpenAPI (OAS 3.1) YAML or JSON artifacts for client SDK generators.
- Auditing existing endpoints for undocumented error status codes or missing schemas.

## Core Intent and Authority

- **Owner Agent:** `aragorn` (Principal System Architect).
- **Authority Boundary:** Owns API documentation files (`docs/api/`), OpenAPI specifications (`openapi.yaml`), and public endpoint contracts. Ensures API changes reflect accurate schemas.
- **Execution Rule:** Undocumented API endpoints are treated as security liabilities and must not be deployed.

## Endpoint Specification Protocol

Every documented API endpoint must declare the following parameters in its contract:

1. **HTTP Method and URI Path:** Explicit route signature (for example `POST /v1/orders`).
2. **Authentication Requirements:** Required scheme (`Bearer JWT`, `ApiKey`, or `Public`).
3. **Request Headers:** Mandatory and optional headers (`Content-Type`, `Idempotency-Key`).
4. **Path and Query Parameters:** Data types, constraints, and defaults.
5. **Request Body Schema:** JSON Schema or Zod representation of valid payloads.
6. **Response Status Matrix:** Explicit schemas for 2xx success, 4xx client errors, and 5xx server errors.

## OpenAPI 3.1 YAML Output Format

```yaml
openapi: 3.1.0
info:
  title: Sauron Core API
  version: 1.0.0
  description: High-performance universal agent harness API.

paths:
  /v1/workspaces/{workspace_id}/tasks:
    post:
      summary: Create an atomic workspace task
      operationId: createTask
      security:
        - BearerAuth: []
      parameters:
        - name: workspace_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - department
              properties:
                title:
                  type: string
                  minLength: 3
                  maxLength: 120
                department:
                  type: string
                  enum:
                    [
                      architecture,
                      qa_testing,
                      security,
                      devsecops,
                      documentation,
                    ]
      responses:
        "201":
          description: Task created successfully
          content:
            application/json:
              schema:
                type: object
                required: [id, title, status, createdAt]
                properties:
                  id:
                    type: string
                    format: uuid
                  title:
                    type: string
                  status:
                    type: string
                    enum: [pending, in_progress, completed]
                  createdAt:
                    type: string
                    format: date-time
        "400":
          description: Invalid request payload or validation failure
        "401":
          description: Missing or invalid authentication token
```

## Markdown Endpoint Reference Standard

In addition to OpenAPI artifacts, generate human-readable endpoint documentation in Markdown:

```markdown
### POST /v1/workspaces/{workspace_id}/tasks

Creates a single-purpose task item attached to a workspace.

#### Headers

| Header          | Type   | Required | Description                |
| :-------------- | :----- | :------- | :------------------------- |
| `Authorization` | string | Yes      | Bearer access token        |
| `Content-Type`  | string | Yes      | Must be `application/json` |

#### Path Parameters

| Parameter      | Type | Required | Description                 |
| :------------- | :--- | :------- | :-------------------------- |
| `workspace_id` | UUID | Yes      | Target workspace identifier |

#### Response Codes

- `201 Created`: Task created successfully.
- `400 Bad Request`: Validation failure on request body.
- `401 Unauthorized`: Missing or invalid bearer token.
- `404 Not Found`: Target workspace does not exist.
```

## Hard Verification Gates

- Fail verification if any route handler returns an undocumented HTTP status code.
- Ensure all request bodies enforce strict validation schemas without loose object types.
- Ensure sensitive internal identifiers (for example database primary keys or salt values) are omitted from response schemas.

## Anti-Patterns Prevented

- **AP-10 (Hallucinated API):** Guarantees that documented endpoints match actual running code routes.
- **AP-44 (Phantom types):** Validates that API schemas enforce strict types at boundary ingestion.
- **AP-46 (Outdated documentation):** Keeps OpenAPI specs synchronized with codebase changes.
- **AP-55 (Undocumented error modes):** Mandates explicit documentation for all 4xx and 5xx error responses.

## Related Skills

- [schema-design.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/architecture/schema-design.md)
- [readme-generator.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/docs/readme-generator.md)
- [aragorn.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/aragorn.md)
