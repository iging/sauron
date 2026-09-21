# INFRASTRUCTURE — Infrastructure & Environment Configuration

> **Purpose:** Document cloud provider resources, environment variable registries, container topologies, and local sandboxing setups. Tier-3 template — customize for your project.

_Last updated: [DATE]_

---

## 1. Hosting Architecture & Cloud Topology

[PLACEHOLDER: Overview of primary cloud hosting environments, VPC configurations, and managed services.]

- **Primary Cloud Provider:** AWS / Google Cloud / Cloudflare / Hetzner.
- **Compute Model:** Containerized microservices on Kubernetes (EKS) or serverless edge runtimes.
- **Managed Datastores:** Managed PostgreSQL (AWS Aurora / Supabase), Redis Cluster.

---

## 2. Environment Variables Registry

Every environment variable consumed by the application must be declared in this registry with its sensitivity tier and validation schema.

| Variable Name     | Required? | Sensitivity     | Default / Example | Purpose                                                              |
| :---------------- | :-------- | :-------------- | :---------------- | :------------------------------------------------------------------- |
| `NODE_ENV`        | Yes       | Public          | `'production'`    | Runtime execution mode (`development`, `test`, `production`).        |
| `PORT`            | No        | Public          | `3000`            | HTTP network port for listener binding.                              |
| `DATABASE_URL`    | Yes       | Critical Secret | None              | Connection string with username, password, host, port, and database. |
| `REDIS_URL`       | Yes       | Critical Secret | None              | Redis cluster endpoint and auth token.                               |
| `JWT_SIGNING_KEY` | Yes       | Critical Secret | None              | Private key used to sign authentication tokens.                      |

### Environment Validation Pattern (TypeScript / Zod)

```typescript
// src/config/env.ts
import { z } from "zod";

const EnvSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    JWT_SIGNING_KEY: z.string().min(32),
  })
  .strict();

export const env = EnvSchema.parse(process.env);
```

---

## 3. Container Configuration & Dockerfile Standards

All production container images must follow strict security and efficiency baselines:

1. **Multi-Stage Builds:** Separate build tooling (TypeScript compilers, package managers) from runtime images to keep final image size under `100MB`.
2. **Non-Root Execution:** Always create and switch to an unprivileged user (`USER appuser`) to mitigate container breakout exploits.
3. **Distroless or Alpine Base:** Utilize minimal base images (e.g. `cgr.dev/chainguard/node` or `node:20-alpine`) containing zero shell utilities or package managers in production.
4. **Health Check Probes:** Define explicit container health checks (`HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1`).
