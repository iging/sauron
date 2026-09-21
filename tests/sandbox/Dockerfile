# syntax=docker/dockerfile:1

# ===================================================================
# Stage 1: Build & Verification Stage
# Compiles TypeScript source, installs dependencies, runs tests
# ===================================================================
FROM node:22.14.0-alpine3.21 AS builder

# Install build prerequisites with cache cleanup in the same layer
RUN apk add --no-cache bash git python3 make g++ \
  && rm -rf /var/cache/apk/*

WORKDIR /app/sauron

# Copy dependency specifications first for optimal layer caching
COPY package.json tsconfig.json ./

# Install dependencies deterministically
RUN npm ci || npm install --ignore-scripts

# Copy full application source code
COPY . .

# Compile TypeScript to JavaScript artifacts
RUN npx tsc --project tsconfig.json

# Execute automated test suite to ensure build integrity
RUN node --test tests/**/*.test.mjs

# ===================================================================
# Stage 2: Hardened Non-Root Minimal Runtime Stage
# Strictly adheres to Sauron docker-principles
# ===================================================================
FROM node:22.14.0-alpine3.21 AS runner

LABEL maintainer="sauron contributors"
LABEL description="Hardened minimal runtime container for Sauron 17-runtime transpiler"

# Install only minimal runtime dependencies with cache purged
RUN apk add --no-cache bash git python3 \
  && rm -rf /var/cache/apk/*

# Security: Create dedicated non-root system user and group (UID/GID 10001)
RUN addgroup -g 10001 -S sauron \
  && adduser -u 10001 -S sauron -G sauron -s /bin/sh -D

WORKDIR /workspace

# Copy built application and runtime artifacts with non-root ownership
COPY --from=builder --chown=sauron:sauron /app/sauron /workspace/sauron

# Create sandbox testing workspace owned by non-root user
WORKDIR /workspace/sandbox-test
RUN chown -R sauron:sauron /workspace

# Security: Drop root privileges permanently
USER sauron:sauron

# Run verification commands as non-root user
RUN node /workspace/sauron/bin/sauron.mjs status \
  && node /workspace/sauron/bin/sauron.mjs list-skills \
  && node /workspace/sauron/bin/sauron.mjs init --dry-run \
  && node /workspace/sauron/bin/sauron.mjs init

# Assert primary generated adapter outputs exist in sandbox
RUN test -f CLAUDE.md \
  && test -f .cursorrules \
  && test -f .windsurfrules \
  && test -f .clinerules \
  && test -f GEMINI.md

CMD ["echo", "[SANDBOX] Sauron hardened container verification completed successfully with exit code 0."]
