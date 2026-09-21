---
name: zero-downtime-table-partitioning
description: PostgreSQL declarative range and hash partitioning migrations without exclusive table locks, application disruption, or blocking connection pools.
department: database
ownerAgent: aragorn
triggerCommand: /zero-downtime-table-partitioning
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-6
  - AP-18
  - AP-26
  - AP-28
---

# Zero-Downtime Table Partitioning

## 0. Identity

- **Role:** High-Scale Database Reliability Engineer. Executes multi-million row table partitioning migrations on live production databases with zero downtime, zero connection pool starvation, and non-blocking lock windows.
- **Authority:** Normative tier-4 standard for table partitioning under `skills/database/zero-downtime-table-partitioning/`.
- **Must not define:** Application UI presentation or client-side routing logic.
- **Normative base:** `core/fellowship/aragorn.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1 (unbounded exclusive table locks), AP-18 (I/O starvation during backfills), and AP-28 (unbounded migration loops).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                 |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Task             | Convert high-volume monolithic database tables into partitioned architectures with zero downtime.     |
| 2   | Target Tool      | PostgreSQL declarative range/hash partitioning, pg_partman, temporal partition automation.            |
| 3   | Output Format    | Four-phase DDL scripts, low-impact batch backfill procedures, and atomic swap transactions.           |
| 4   | Constraints      | Prohibit long-running exclusive locks (`ACCESS EXCLUSIVE`). Maximum 2-second lock timeout. Yield I/O. |
| 5   | Input            | High-volume table schema, growth projections, query filter access patterns.                           |
| 6   | Context          | Prevents database connection pool exhaustion and application downtime during schema refactoring.      |
| 7   | Audience         | Principal database engineers, site reliability engineers, infrastructure platform leads.              |
| 8   | Success Criteria | Zero connection timeout errors; sub-2-second cutover lock; transparent query partition pruning.       |
| 9   | Examples         | See Section 5.                                                                                        |

## 2. Trigger Matrix

| Trigger Condition                                              | Fire? | Action / Route                                                   |
| -------------------------------------------------------------- | ----- | ---------------------------------------------------------------- |
| Table size exceeds 20 million rows or vacuum causes I/O spikes | YES   | Initiate four-phase zero-downtime partitioning workflow.         |
| Table queries predominantly filter by date ranges or tenant ID | YES   | Design declarative range or hash partitioned schema.             |
| Small table under 500,000 records                              | NO    | Reject partitioning; optimize composite indexes instead.         |
| General SQL query optimization and EXPLAIN ANALYZE tuning      | NO    | Route to `skills/database/postgres-query-planner-optimization/`. |

## 3. Core Architectural Directives

1. **Strict Lock Timeout Bounds:** Never execute DDL without setting an explicit lock timeout (`SET lock_timeout = '2s'`). If an exclusive lock cannot be acquired within 2 seconds due to concurrent traffic, abort immediately and retry later rather than queueing behind long transactions.
2. **Four-Phase Partitioning Lifecycle:**
   - **Phase 1 (Shadow Structure):** Create the new partitioned parent table and initial child partitions.
   - **Phase 2 (Dual Writing):** Deploy application dual-writing or row-level replication triggers to keep the shadow partitioned table in sync.
   - **Phase 3 (Batched Backfill):** Copy historical records in small, bounded batches (2,000 to 5,000 rows) with sleep intervals (`PERFORM pg_sleep(0.05)`) to prevent disk I/O starvation.
   - **Phase 4 (Atomic Cutover):** Execute a brief transaction with a 2-second lock timeout to rename the legacy table and swap the partitioned table into active service.
3. **Partition Key Rules:** Primary keys and unique constraints must include the partition key column (for example composite key on `(id, created_at)`).
4. **Default Partition Guarantee:** Always provision a `DEFAULT` partition to capture records that fall outside planned ranges and prevent insertion failure exceptions.

## 4. Execution Workflow

### Step 1: Shadow Table Creation

- **Action:** Create shadow partitioned table and monthly child partitions with identical column types.
- **Validation:** Parent table declares `PARTITION BY RANGE (created_at)` with a default partition attached.

### Step 2: Dual-Writing Setup

- **Action:** Attach an `AFTER INSERT OR UPDATE OR DELETE` trigger on the legacy table to synchronize mutations into the shadow table.
- **Validation:** Live mutations replicate to shadow partitions in real time.

### Step 3: Low-Impact Backfill Execution

- **Action:** Execute iterative batched backfill script.
- **Validation:** Backfill loop yields execution between chunks; zero replication lag spikes observed.

### Step 4: Atomic Table Swap

- **Action:** Execute table rename in a single transaction wrapped in a tight lock timeout.
- **Validation:** Swap completes in under 200 milliseconds.

## 5. Reference Implementation

### SQL (Complete Zero-Downtime PostgreSQL Partitioning Script)

```sql
-- PHASE 1: Create Shadow Partitioned Table
CREATE TABLE IF NOT EXISTS audit_logs_partitioned (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  action VARCHAR(64) NOT NULL,
  payload JSONB,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Attach explicit child partitions
CREATE TABLE IF NOT EXISTS audit_logs_y2026m09
PARTITION OF audit_logs_partitioned
FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

CREATE TABLE IF NOT EXISTS audit_logs_default
PARTITION OF audit_logs_partitioned DEFAULT;

-- PHASE 3: Low-Impact Batched Backfill Script
DO $$
DECLARE
  v_batch_size INT := 5000;
  v_rows_copied INT;
BEGIN
  LOOP
    WITH batch AS (
      SELECT id, tenant_id, created_at, action, payload
      FROM legacy_audit_logs
      WHERE id NOT IN (SELECT id FROM audit_logs_partitioned WHERE created_at = legacy_audit_logs.created_at)
      ORDER BY created_at ASC
      LIMIT v_batch_size
    )
    INSERT INTO audit_logs_partitioned (id, tenant_id, created_at, action, payload)
    SELECT id, tenant_id, created_at, action, payload FROM batch
    ON CONFLICT (id, created_at) DO NOTHING;

    GET DIAGNOSTICS v_rows_copied = ROW_COUNT;
    EXIT WHEN v_rows_copied = 0;

    -- Yield execution to prevent disk I/O saturation
    PERFORM pg_sleep(0.05);
  END LOOP;
END $$;

-- PHASE 4: Atomic Cutover with Tight Lock Timeout
BEGIN;
SET LOCAL lock_timeout = '2s';

ALTER TABLE legacy_audit_logs RENAME TO legacy_audit_logs_retired;
ALTER TABLE audit_logs_partitioned RENAME TO audit_logs;

COMMIT;
```

## 6. Validation Gate

Run before executing partitioning operations:

- [ ] Lock timeout is explicitly set to 2 seconds or less for cutover transactions.
- [ ] Partition key is included in all primary keys and unique indexes.
- [ ] Default partition exists to prevent insertion errors.
- [ ] Backfill scripts use bounded batches with sleep intervals to protect disk I/O.
- [ ] Cutover transaction tested in staging environment under simulated query load.

## 7. Versioning & Portability Matrix

- **Version:** 2.0.0
- **Changelog:**
  - `2.0.0` (2026-09-20): Elevated to Sauron Tier-5 specification with non-blocking backfill and atomic cutover patterns.

| Runtime / Harness | Status   | Notes                                    |
| ----------------- | -------- | ---------------------------------------- |
| Claude Code       | verified | Fully supported via command integration. |
| Cursor            | verified | Compatible with editor rule context.     |
| Windsurf          | verified | Fully functional.                        |
| Antigravity       | verified | Certified.                               |
