---
name: docker-principles
description: Docker and containerization standards covering multi-stage builds, minimal base images, non-root user execution, layer caching discipline, BuildKit secrets, and vulnerability scanning.
department: devops
ownerAgent: samwise
triggerCommand: /docker-principles
antiPatternsPrevented:
  - AP-1
  - AP-4
  - AP-18
  - AP-26
  - AP-44
---

# Docker & Containerization Principles

## 0. Identity

- **Role:** Containerization Systems Architect. Governs Dockerfile design, multi-stage compilation, image layer caching, non-root security isolation, and container vulnerability management.
- **Authority:** Normative tier-4 standard for containerization across repositories under `skills/devops/docker-principles/`.
- **Must not define:** Kubernetes Custom Resource Definitions (see `kubernetes-operator-deployment`).
- **Normative base:** `core/fellowship/samwise.md`, `rules/engineering/architecture-boundaries.md`, `rules/common/code-style-standards.md`, `references/anti-patterns.md`.
- **Anti-pattern gate:** Blocks AP-4 (root-user container execution), AP-26 (leaking secrets in image layers), and AP-44 (unlocked container configurations).

## 1. Intent (9 Dimensions)

| #   | Dimension        | Value                                                                                            |
| --- | ---------------- | ------------------------------------------------------------------------------------------------ |
| 1   | Task             | Author, optimize, and secure container images and runtime Docker configurations.                 |
| 2   | Target Tool      | Docker, Docker BuildKit, Podman, Trivy, Docker Scout, Distroless, Alpine.                        |
| 3   | Output Format    | Optimized multi-stage Dockerfiles, .dockerignore files, and container compose manifests.         |
| 4   | Constraints      | Mandatory non-root user execution. Zero hardcoded secrets. Pin base image SHA digests.           |
| 5   | Input            | Application source trees, runtime dependencies, build toolchains, deployment targets.            |
| 6   | Context          | Prevents container privilege escalation, massive image bloat, and slow CI build times.           |
| 7   | Audience         | Backend engineers, DevOps architects, site reliability engineers, security auditors.             |
| 8   | Success Criteria | Production image size under 100MB; zero critical/high CVEs; 100 percent non-root user execution. |
| 9   | Examples         | See Section 5.                                                                                   |

## 2. Trigger Matrix

| Trigger Condition                                                | Fire? | Action / Route                                            |
| ---------------------------------------------------------------- | ----- | --------------------------------------------------------- |
| Writing or optimizing Dockerfiles for application deployment     | YES   | Implement multi-stage build with minimal runtime base.    |
| Container security scan detects high or critical vulnerabilities | YES   | Update base image digest and remove development packages. |
| Container processes running with root (UID 0) privileges         | YES   | Inject dedicated system user and set USER directive.      |
| Managing Kubernetes cluster orchestration and CRD controllers    | NO    | Route to `skills/devops/kubernetes-operator-deployment/`. |

## 3. Core Architectural Directives

1. **Multi-Stage Build Discipline:** Separate build-time dependencies (compilers, npm build tooling, package caches) from production runtime stages. Copy only the final compiled artifact into the runtime container.
2. **Minimal Base Image Selection:** Use minimal base images (Distroless or Alpine Linux) for production execution stages to minimize image size and attack surface.
3. **Mandatory Non-Root User Execution:** Never run production container processes as root (UID 0). Create a dedicated non-root user and group, and enforce the `USER` instruction prior to the entrypoint.
4. **Layer Caching Optimization:** Order Dockerfile instructions from least frequently changing (system dependencies, package manifests) to most frequently changing (source code) to maximize layer cache hits.
5. **Zero Secrets in Image Layers:** Never pass API keys or credentials via `ENV` or `ARG` directives. Use Docker BuildKit secret mounts (`RUN --mount=type=secret,id=...`) for build-time authentication.

## 4. Execution Workflow

### Step 1: Base Image & Dependency Setup

- **Action:** Select pinned base image using SHA256 digest. Establish .dockerignore file.
- **Validation:** Build context excludes .git, local node_modules, and environment files.

### Step 2: Multi-Stage Compilation

- **Action:** Execute compilation in designated builder stage.
- **Validation:** Development compilers and source files are excluded from the final stage.

### Step 3: Security Hardening & User Step-Down

- **Action:** Create non-root system user. Assign file permissions and declare `USER appuser`.
- **Validation:** Container process launches with non-zero UID.

## 5. Reference Implementation

### Multi-Stage Node.js Production Dockerfile

```dockerfile
# syntax=docker/dockerfile:1.6

# STAGE 1: Dependency Installation
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

# STAGE 2: Source Compilation
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --production

# STAGE 3: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Enforce Non-Root Execution
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

USER appuser
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

## 6. Validation Gate

Run before accepting container images:

- [ ] Dockerfile uses multi-stage architecture with distinct builder and runner stages.
- [ ] Base images are pinned to explicit versions or immutable digests.
- [ ] Process executes under an explicit non-root user (`USER` directive present).
- [ ] `.dockerignore` file exists and excludes build artifacts and secrets.
- [ ] Automated container vulnerability scan (Trivy) reports zero critical CVEs.

## 7. Versioning & Portability Matrix

- **Version:** 2.0.0
- **Changelog:**
  - `2.0.0` (2026-09-20): Elevated to Sauron Tier-5 specification with multi-stage non-root hardening patterns.

| Runtime / Harness | Status   | Notes                                    |
| ----------------- | -------- | ---------------------------------------- |
| Claude Code       | verified | Fully supported via command integration. |
| Cursor            | verified | Compatible with editor rule context.     |
| Windsurf          | verified | Fully functional.                        |
| Antigravity       | verified | Certified.                               |
