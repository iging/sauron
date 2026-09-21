# PERFORMANCE — Performance & Latency Budgets

> **Purpose:** Canonical performance benchmarks, latency budgets, client bundle limits, database query thresholds, and memory constraints. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Latency & Response Time Budgets (SLA)

All production endpoints must meet explicit percentile latency budgets measured under standard load.

| Metric / Endpoint Tier            | Target (P50) | Warning (P95) | Critical Alert (P99) |
| :-------------------------------- | :----------- | :------------ | :------------------- |
| **Cached API Reads (Redis)**      | `< 15ms`     | `< 30ms`      | `> 50ms`             |
| **Relational Database Queries**   | `< 25ms`     | `< 75ms`      | `> 150ms`            |
| **Complex Mutation Transactions** | `< 100ms`    | `< 250ms`     | `> 500ms`            |
| **Third-Party External Webhooks** | `< 200ms`    | `< 500ms`     | `> 1000ms`           |

---

## 2. Frontend Bundle & Web Vitals Budgets

- **Initial JavaScript Payload:** Capped at `< 150KB` gzip-compressed for the primary landing bundle.
- **Core Web Vitals:**
  - **LCP (Largest Contentful Paint):** `< 2.0s` on simulated 4G networks.
  - **INP (Interaction to Next Paint):** `< 150ms` across all UI interactions.
  - **CLS (Cumulative Layout Shift):** `< 0.05` across all viewports.
- **Image Optimization:** All images must be served in WebP or AVIF formats with explicit `width` and `height` dimensions to prevent layout shifts.

---

## 3. Database Query & Memory Guardrails

- **Full Table Scan Ban:** Queries scanning unindexed columns on tables exceeding 5,000 rows must fail in CI automated query audits.
- **Statement Timeout:** Enforce `statement_timeout = '5s'` on web connection pools to terminate rogue runaway queries automatically.
- **Node.js Heap Allocation:** Production containers must monitor RSS memory usage and trigger pod recycling if heap consumption exceeds 80% of container limits.
