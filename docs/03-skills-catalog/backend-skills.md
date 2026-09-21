# Backend Skills

The Backend domain houses skills governing server architecture, typed API routing, request validation, caching layers, and server-side language conventions.

---

## Standalone Backend Skills

| Skill                      | Owner | Command                   | Purpose                                                                                      |
| -------------------------- | ----- | ------------------------- | -------------------------------------------------------------------------------------------- |
| **api-endpoint-generator** | Gimli | `/api-endpoint-generator` | Scaffolds typed backend endpoints (Next.js App Router, Express, NestJS) with Zod validation. |
| **backend-development**    | Gimli | `/backend-development`    | Implements domain logic, services, and repository layers adhering to clean API design.       |
| **caching-principles**     | Gimli | `/caching-principles`     | Implements Redis, in-memory caching, HTTP caching headers, and invalidation strategies.      |
| **database-principles**    | Gimli | `/database-principles`    | Optimizes SQL and NoSQL queries, connection pools, and relational constraints.               |
| **laravel-principles**     | Gimli | `/laravel-principles`     | Enforces Laravel conventions, Eloquent models, form requests, and service providers.         |
| **php-principles**         | Gimli | `/php-principles`         | Enforces modern PHP 8+ standards, strict typing, and Composer dependency management.         |
| **python-principles**      | Gimli | `/python-principles`      | Enforces Python typing, FastAPI patterns, Pydantic schemas, and virtual environment hygiene. |

---

## Key Backend Principles

1. **Parse, Don't Validate**: All request payloads must pass through schema parsers (like Zod or Pydantic) at the route boundary before business logic runs.
2. **Predictable Errors**: Internal database errors or stack traces must never leak to API clients. Use typed domain error objects with appropriate HTTP status codes.
3. **Idempotent Handlers**: State-changing endpoints (PUT, DELETE) must produce deterministic results regardless of retry frequency.
