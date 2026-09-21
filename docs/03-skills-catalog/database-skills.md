# Database Skills

The Database domain houses skills that govern schema migrations, data modeling, type synchronization, and database performance.

---

## Core Database Skills

### Database Migration (`database-migration`)

- **Owner**: Gimli
- **Trigger**: `/database-migration`
- **Identity**: Principal Database Administrator.
- **Authority**: Owns schema change execution. Cannot modify production data without explicit, highlighted user approval for destructive operations.

---

## Zero-Downtime Deployment Rules

When executing database migrations, Gimli enforces these non-negotiable rules:

1. **Multi-Phase Schema Changes**: Breaking column renames or removals must follow the expand-and-contract pattern:
   - Phase 1: Add the new column alongside the old column.
   - Phase 2: Dual-write to both columns from the application layer.
   - Phase 3: Backfill historic records.
   - Phase 4: Switch application reads to the new column.
   - Phase 5: Drop the deprecated column in a separate deployment.
2. **Safe Column Defaults**: Adding non-nullable columns to populated tables requires default values to prevent table locking and migration failures.
3. **Type-Sync Discipline**: Every migration run must immediately trigger TypeScript type generation (for example running `prisma generate` or `drizzle-kit generate`), keeping frontend and backend types synchronized.
4. **Approval Gates**: Any drop table, drop column, or destructive data transformation command pauses execution until you explicitly approve it.
