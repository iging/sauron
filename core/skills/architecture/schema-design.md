---
id: schema-design
name: Schema Design and Migration Modeling
department: architecture
owner_agent: aragorn
trigger_command: /schema-design
version: 1.0.0
---

# Schema Design and Migration Modeling

Design normalized, type-safe, and forward-compatible data models across relational databases, document stores, and API contracts. Enforce strict boundary validation, migration reversibility, and zero unindexed query patterns.

## When to Activate

- Creating new database tables, collections, or entity definitions.
- Modifying existing schemas with column additions, deletions, or type changes.
- Designing API boundary contracts using Zod, JSON Schema, or Protocol Buffers.
- Planning reversible schema migrations and data seeding scripts.

## Core Intent and Authority

- **Owner Agent:** `aragorn` (Principal System Architect).
- **Authority Boundary:** Owns `context/SCHEMA.md`, database migrations, ORM schemas (Prisma, Drizzle, TypeORM, SQLAlchemy, Diesel), and runtime validation schemas (Zod, Pydantic).
- **Execution Rule:** Every schema alteration must provide both forward application and rollback procedures.

## Schema Modeling Principles

1. **Explicit Nullability:** Every field must explicitly declare nullability (`NOT NULL` or nullable). Never rely on engine defaults.
2. **Deterministic Primary Keys:** Prefer UUIDv7 or ULID for distributed identifiers to preserve time-ordered index locality. Use auto-incrementing integers only in isolated, single-node tables.
3. **Foreign Key Integrity:** All entity relations must enforce referential integrity with explicit `ON DELETE` constraints (`RESTRICT`, `CASCADE`, or `SET NULL`).
4. **Index Hygiene:** Foreign keys, frequently queried status columns, and timestamp range columns must have explicit indexes. Never query unindexed columns in production paths.
5. **Boundary Sync:** Database models must map cleanly to API transfer objects. Never expose raw database column names or internal records directly to client interfaces.

## Migration Design Standard

Every schema change must execute through a versioned migration file following this four-stage lifecycle:

```text
[Stage 1: Pre-Check]  -> Validate existing table locks and row counts
[Stage 2: Expand]     -> Add nullable columns or new tables (non-breaking)
[Stage 3: Backfill]   -> Populate existing rows with default values in batches
[Stage 4: Contract]   -> Apply NOT NULL constraint or remove deprecated columns
```

### Relational Schema Pattern (SQL / Drizzle Example)

```typescript
// schema/users.ts
import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    role: varchar("role", { length: 32 }).notNull().default("viewer"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_users_email").on(table.email),
    index("idx_users_created_at").on(table.createdAt),
  ],
);
```

### Runtime Validation Contract (Zod Example)

```typescript
// schema/user-contract.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  role: z.enum(["admin", "editor", "viewer"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserRequestSchema = UserSchema.pick({
  email: true,
  role: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
```

## Hard Verification Gates

- Reject any migration that drops a column without a documented multi-step deprecation cycle.
- Reject any schema with missing unique constraints on email or identity fields.
- Ensure all foreign keys define an explicit `onDelete` action.
- Ensure Zod or Pydantic validation mirrors database constraints without type widening (for example string instead of uuid).

## Anti-Patterns Prevented

- **AP-44 (Phantom types):** Prevents untyped data crossing service boundaries by mandating runtime schema validation.
- **AP-51 (Broken schema migration):** Prohibits unversioned and irreversible direct schema alterations.
- **AP-52 (Fake fix):** Forbids casting untyped records with `as any` or disabling validation checks.
- **AP-53 (Spec drift):** Synchronizes database models with `context/SCHEMA.md` and API contracts.

## Related Skills

- [plan-feature.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/architecture/plan-feature.md)
- [aragorn.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/fellowship/aragorn.md)
- [security-audit.md](file:///C:/Users/IGING/Documents/GitHub/agent-spec/sauron/core/skills/security/security-audit.md)
