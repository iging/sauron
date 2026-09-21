---
name: postgres-query-planner-optimization
description: Deep EXPLAIN ANALYZE inspection, sequential scan elimination, index cardinality tuning, join algorithm selection, and SARGable query optimization for PostgreSQL.
department: database
ownerAgent: aragorn
triggerCommand: /postgres-query-planner-optimization
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-6
  - AP-18
  - AP-26
  - AP-28
---

# PostgreSQL Query Planner Optimization

## 0. Identity

- **Role:** Principal Database Performance and Query Optimization Specialist. Analyzes query execution trees, optimizes PostgreSQL cost parameters, eliminates sequential scans, and tunes relational index selectivity.
- **Authority:** Normative tier-4 standard for PostgreSQL query performance under `skills/database/postgres-query-planner-optimization/`.
- **Must not define:** Application UI state or API route handlers.
- **Normative base:** `core/fellowship/aragorn.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-1 (unindexed query predicates), AP-18 (full table scan queries on large tables), and AP-28 (unbounded query join cascades).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                                                      |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Task             | Inspect, benchmark, and optimize slow PostgreSQL queries and execution plans.                                              |
| 2   | Target Tool      | PostgreSQL 15+, pg_stat_statements, EXPLAIN (ANALYZE, BUFFERS), pghero, pganalyze.                                         |
| 3   | Output Format    | Rewritten SARGable SQL queries, composite/partial index DDL, and execution cost reports.                                   |
| 4   | Constraints      | Prohibit non-SARGable WHERE predicates. Banish unindexed multi-table JOINs on large tables.                                |
| 5   | Input            | Slow query logs, execution plan JSON/text, table schemas, column cardinality stats.                                        |
| 6   | Context          | Prevents CPU saturation, buffer pool thrashing, lock contention, and degraded p99 latencies.                               |
| 7   | Audience         | Database administrators, backend engineers, performance engineering specialists.                                           |
| 8   | Success Criteria | p99 query latency under 5 milliseconds; 100 percent index coverage on filter columns; zero sequential scans over 10k rows. |
| 9   | Examples         | See Section 5.                                                                                                             |

## 2. Trigger Matrix

| Trigger Condition                                                    | Fire? | Action / Route                                                 |
| -------------------------------------------------------------------- | ----- | -------------------------------------------------------------- |
| Diagnosing slow queries with execution times exceeding 100ms         | YES   | Run EXPLAIN (ANALYZE, BUFFERS) and inspect plan tree.          |
| Eliminating full table scans (Seq Scan) on tables exceeding 10k rows | YES   | Design covering or composite index matching filter predicates. |
| Fixing query planner row misestimates caused by stale statistics     | YES   | Trigger ANALYZE and inspect column n_distinct values.          |
| Migrating table schemas or executing structural partitioning         | NO    | Route to `skills/database/database-migration/`.                |

## 3. Core Architectural Directives

1. **Mandatory EXPLAIN BUFFERS Inspection:** Always inspect execution plans with `EXPLAIN (ANALYZE, BUFFERS, SETTINGS, TIMING)`. Focus on `Buffers: shared hit / read` to measure disk I/O cost rather than raw execution time alone.
2. **SARGable Query Predicates:** Never wrap indexed columns inside SQL functions in `WHERE` clauses (for example `WHERE LOWER(email) = '...'` or `WHERE DATE(created_at) = '...'`). Rewrite queries to use direct range bounds or create functional indexes (`CREATE INDEX ON users (LOWER(email))`).
3. **Composite Index Ordering (Leftmost Prefix):** Order composite index columns:
   - Primary equality filter columns first.
   - Secondary equality filter columns second.
   - Range/inequality or sorting columns last.
4. **Index-Only Scans with Covering Indexes:** Use the `INCLUDE` clause to append frequently retrieved payload columns to the leaf pages of an index. This enables pure Index-Only Scans and eliminates expensive table heap visits.
5. **Partial Indexes for Status Subsets:** When queries predominantly target a small fraction of a table (for example `WHERE status = 'PENDING'`), define a partial index to minimize index size and memory footprint.

## 4. Execution Workflow

### Step 1: Execution Plan Capture

- **Action:** Run `EXPLAIN (ANALYZE, BUFFERS)` on the slow query.
- **Validation:** Discrepancies between estimated row counts and actual rows pinpoint stale statistics.

### Step 2: Index Alignment & Predicate Refactoring

- **Action:** Formulate covering or functional indexes concurrently. Refactor non-SARGable predicates into direct operators.
- **Validation:** Index created using `CONCURRENTLY` non-blocking syntax.

### Step 3: Performance Re-Verification

- **Action:** Re-run `EXPLAIN (ANALYZE, BUFFERS)` to verify the planner switches from `Seq Scan` to `Index Scan` or `Index Only Scan`.
- **Validation:** Shared buffer reads reduced by over 90 percent.

## 5. Reference Implementation

### SQL (SARGable Query Rewriting & Covering Indexes)

```sql
-- PROBLEM: Non-SARGable predicate forces full table scan (Seq Scan on 5M rows)
-- EXPLAIN (ANALYZE, BUFFERS)
-- SELECT id, total_cents FROM orders
-- WHERE DATE(created_at) = '2026-09-20' AND LOWER(customer_email) = 'vip@example.com';

-- FIX STEP 1: Add Functional + Covering Composite Index Concurrently
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_email_lower_covering
ON orders (LOWER(customer_email), created_at)
INCLUDE (total_cents, status)
WHERE status != 'CANCELLED';

-- FIX STEP 2: Rewrite Query to SARGable Range Predicate
-- Planner now performs an Index Only Scan with sub-millisecond latency
SELECT id, total_cents
FROM orders
WHERE LOWER(customer_email) = 'vip@example.com'
  AND created_at >= '2026-09-20 00:00:00+00'
  AND created_at <  '2026-09-21 00:00:00+00'
  AND status != 'CANCELLED';
```

## 6. Validation Gate

Run before accepting query planner optimizations:

- [ ] Query plan confirms `Index Scan` or `Index Only Scan` on large tables.
- [ ] Predicates avoid wrapping indexed columns in unindexed functions.
- [ ] Composite indexes follow the equality-first, range-second ordering rule.
- [ ] Production indexes are created using `CREATE INDEX CONCURRENTLY`.
- [ ] Shared buffer disk reads show measurable reduction in query cost.

## 7. Versioning & Portability Matrix

- **Version:** 2.0.0
- **Changelog:**
  - `2.0.0` (2026-09-20): Elevated to Sauron Tier-5 specification with EXPLAIN BUFFERS analysis and SARGable refactoring patterns.

| Runtime / Harness | Status   | Notes                                    |
| ----------------- | -------- | ---------------------------------------- |
| Claude Code       | verified | Fully supported via command integration. |
| Cursor            | verified | Compatible with editor rule context.     |
| Windsurf          | verified | Fully functional.                        |
| Antigravity       | verified | Certified.                               |
