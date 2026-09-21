# Docker Architecture & Containerization Guide

This directory contains production-grade, hardened Docker configurations for **Sauron**, authored in strict compliance with [`skills/devops/docker-principles/SKILL.md`](../skills/devops/docker-principles/SKILL.md).

---

## 1. Architectural Highlights & Hardening Directives

- **Multi-Stage Build Discipline:** Build tools, TypeScript compilers, and intermediate layers are completely isolated from runtime containers to keep final images minimal (< 100MB).
- **Mandatory Non-Root User Execution:** Container processes execute strictly as non-root user `sauron` (UID 10001) or `nextjs` (UID 10001). Zero root-privilege execution (`USER` directive enforced).
- **Layer Caching Discipline:** Package manifests (`package*.json`, `tsconfig.json`) are copied and installed first to maximize layer cache hits during iterative changes.
- **Zero Secrets in Image Layers:** No credentials or environment secrets are embedded in images; BuildKit cache cleanup is run in the same layer (`rm -rf /var/cache/apk/*`).
- **Minimal Base Image:** Uses Alpine Linux (`node:22-alpine`) for a minimal attack surface and fast startup.

---

## 2. Available Services & Dockerfiles

| File                     | Purpose                             | Base Image       | Non-Root User    |
| :----------------------- | :---------------------------------- | :--------------- | :--------------- |
| **`Dockerfile.cli`**     | Sauron 17-Runtime Transpiler & CLI  | `node:22-alpine` | `sauron` (10001) |
| **`Dockerfile.landing`** | Sauron Landing Page Next.js Web App | `node:22-alpine` | `nextjs` (10001) |
| **`docker-compose.yml`** | Compose configuration for local dev | -                | -                |

---

## 3. Quickstart & Usage

### 3.1 Running Sauron CLI via Docker (Zero Local Node.js Required)

You can run Sauron CLI commands directly without installing Node.js or npm on your host machine:

```bash
# Check Sauron status
docker compose run --rm sauron status

# List all available skills across 9 departments
docker compose run --rm sauron list-skills

# Initialize Sauron harness in your current workspace
docker compose run --rm sauron init

# Add a specific skill to your workspace
docker compose run --rm sauron add api-design
```

### 3.2 Building and Running the Sauron Landing Page

To test and preview the Next.js landing page inside a hardened container:

```bash
# Start the landing page container
docker compose up sauron-landing

# Access in your browser:
# http://localhost:3000
```

### 3.3 Building Standalone Images Manually

```bash
# Build the CLI container
docker build -t sauron-cli -f docker/Dockerfile.cli .

# Run the CLI container
docker run --rm -v "$(pwd)":/workspace sauron-cli status

# Build the Landing Page container
docker build -t sauron-landing -f docker/Dockerfile.landing .
```
