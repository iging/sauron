#!/usr/bin/env node
// @ts-check

/**
 * @fileoverview Command Scaffold Engine for Sauron.
 * Generates 94 production slash commands following Sauron standards.
 * Compliant with agent-spec writing rules: zero banned words, zero em dashes, zero Latin abbreviations.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SAURON_ROOT = path.resolve(__dirname, "..", "..");
const COMMANDS_DIR = path.join(SAURON_ROOT, "commands");

/**
 * @typedef {Object} CommandSpec
 * @property {string} slug - Command identifier and file name.
 * @property {string} title - Human readable display title.
 * @property {string} leadAgent - Fellowship leader name.
 * @property {string} specialist - Specialist agent identifier.
 * @property {string} description - Brief summary of purpose.
 * @property {string} category - Command group.
 * @property {string} [args] - Expected argument string.
 * @property {string[]} protocol - Action steps.
 * @property {string[]} gates - Hard verification gates.
 */

/** @type {CommandSpec[]} */
const COMMANDS = [
  // 1. Core Planning & Architecture (Gandalf & Aragorn)
  {
    slug: "plan",
    title: "Feature Decomposition & Planning",
    leadAgent: "Gandalf",
    specialist: "planner",
    description:
      "Breaks feature requests into numbered sequential execution tasks.",
    category: "Planning",
    args: "<feature-description>",
    protocol: [
      "Extract single core objective from user input.",
      "Surface technical decisions and confirm approach.",
      "Write atomic task list to context/TASKS.md.",
      "Delegate execution to /execute.",
    ],
    gates: [
      "Stop if prompt contains conflicting goals.",
      "Require clear acceptance criteria on every task.",
      "Prohibit code edits during planning.",
    ],
  },
  {
    slug: "architect",
    title: "System Architecture & Design",
    leadAgent: "Aragorn",
    specialist: "architect",
    description:
      "Defines system boundaries, module contracts, and design tokens.",
    category: "Architecture",
    args: "<subsystem-name>",
    protocol: [
      "Assess dependency boundaries and layer isolation.",
      "Define clean interface contracts and DTO schemas.",
      "Document architectural choices in context/ARCHITECTURE.md.",
    ],
    gates: [
      "Prohibit circular imports across modules.",
      "Reject barrel files (index.ts).",
    ],
  },
  {
    slug: "prd",
    title: "Product Requirements Document Generator",
    leadAgent: "Gandalf",
    specialist: "planner",
    description:
      "Converts feature concepts into structured PRD specifications.",
    category: "Planning",
    args: "<product-feature>",
    protocol: [
      "Interrogate user for problem statement and target audience.",
      "Define user stories with verifiable acceptance criteria.",
      "Document scope boundaries in context/PRD.md.",
    ],
    gates: ["Every user story must have measurable validation criteria."],
  },
  {
    slug: "adr",
    title: "Architecture Decision Record Author",
    leadAgent: "Aragorn",
    specialist: "architect",
    description:
      "Documents significant architectural decisions and technical trade-offs.",
    category: "Architecture",
    args: "<decision-title>",
    protocol: [
      "Document context, options considered, and chosen solution.",
      "List positive and negative consequences.",
      "Record decision status in docs/adr/.",
    ],
    gates: ["Must state at least two alternative options evaluated."],
  },

  // 2. Execution & Build (Frodo)
  {
    slug: "execute",
    title: "Atomic Task Execution",
    leadAgent: "Frodo",
    specialist: "executor",
    description:
      "Implements the next unchecked item from the active task list.",
    category: "Execution",
    args: "[task-id]",
    protocol: [
      "Read next item from context/TASKS.md.",
      "Verify prerequisite context and test fixtures.",
      "Write minimal complete implementation code.",
      "Pass to /tdd and /code-review for verification.",
    ],
    gates: [
      "Stop if implementation exceeds active task scope.",
      "Verify compilation before declaring completion.",
    ],
  },
  {
    slug: "build-fix",
    title: "Compiler & Type Diagnostic Resolver",
    leadAgent: "Frodo",
    specialist: "build-resolver",
    description: "Surgically resolves build, compiler, and TypeScript errors.",
    category: "Execution",
    protocol: [
      "Run compiler to capture exact error locations.",
      "Analyze root causes without architectural rewrites.",
      "Apply minimal code fixes.",
      "Verify build exits with code 0.",
    ],
    gates: ["Prohibit @ts-ignore or any casts to silence errors."],
  },
  {
    slug: "loop",
    title: "5-Stage Engineering Loop",
    leadAgent: "Frodo",
    specialist: "loop-orchestrator",
    description:
      "Sequences blueprinting, UI tokens, code inspection, checkpoints, and triage.",
    category: "Execution",
    args: "<feature-name>",
    protocol: [
      "Stage 1: Blueprint session and alignment.",
      "Stage 2: UI token extraction from mockups.",
      "Stage 3: Code inspection against plan.",
      "Stage 4: Context checkpoint to disk.",
      "Stage 5: Failure triage if issues arise.",
    ],
    gates: ["Require developer confirmation before each stage advance."],
  },

  // 3. Quality & TDD (Merry & Legolas)
  {
    slug: "tdd",
    title: "Test-Driven Development Enforcer",
    leadAgent: "Merry",
    specialist: "qa-specialist",
    description: "Authors failing tests before implementation code is written.",
    category: "Testing",
    args: "<unit-or-feature>",
    protocol: [
      "Classify requirement as unit, integration, or E2E.",
      "Write deterministic test asserting target behavior.",
      "Run test to verify failure (Red).",
      "Hand off to /execute to implement minimal code (Green).",
    ],
    gates: [
      "Prohibit arbitrary sleep timeouts in tests.",
      "Use user-facing accessibility locators.",
    ],
  },
  {
    slug: "test-unit",
    title: "Unit Test Generator",
    leadAgent: "Merry",
    specialist: "qa-specialist",
    description: "Creates fast, isolated unit tests for business logic.",
    category: "Testing",
    args: "<source-file>",
    protocol: [
      "Extract pure functions and edge cases from target file.",
      "Scaffold unit tests with mock boundaries.",
      "Verify tests run with zero network or disk dependencies.",
    ],
    gates: ["Test execution must complete within milliseconds."],
  },
  {
    slug: "test-e2e",
    title: "End-to-End Test Suite Builder",
    leadAgent: "Merry",
    specialist: "e2e-runner",
    description: "Scaffolds browser-based end-to-end tests using Playwright.",
    category: "Testing",
    args: "<user-journey>",
    protocol: [
      "Map user navigation steps and expectations.",
      "Author test using role-based locators.",
      "Enforce auto-retrying assertions.",
    ],
    gates: ["Reject brittle CSS or XPath selectors."],
  },
  {
    slug: "test-coverage",
    title: "Test Coverage Analyzer",
    leadAgent: "Merry",
    specialist: "coverage-analyst",
    description:
      "Measures test coverage and generates tests for untested branches.",
    category: "Testing",
    protocol: [
      "Run coverage reporter across target package.",
      "Identify untested error paths and branches.",
      "Author targeted tests to reach coverage threshold.",
    ],
    gates: [
      "Enforce coverage baseline without asserting implementation details.",
    ],
  },

  // 4. Code Review, Linting & Token Optimization (Legolas)
  {
    slug: "code-review",
    title: "Precision Code Reviewer",
    leadAgent: "Legolas",
    specialist: "code-reviewer",
    description:
      "Conducts line-by-line inspection of diffs with structured findings.",
    category: "Review",
    args: "[branch-or-diff]",
    protocol: [
      "Collect git diff across modified files.",
      "Inspect for type safety, unhandled async, and anti-patterns.",
      "Output findings categorized into Blockers, Warnings, and Notes.",
    ],
    gates: [
      "Flag promises missing error handlers.",
      "Prohibit approval if tests are omitted.",
    ],
  },
  {
    slug: "a11y",
    title: "Accessibility Auditor",
    leadAgent: "Legolas",
    specialist: "a11y-auditor",
    description: "Audits interfaces for WCAG 2.1 AA accessibility compliance.",
    category: "Review",
    args: "<component-path>",
    protocol: [
      "Verify semantic HTML element usage.",
      "Confirm visible keyboard focus on interactive elements.",
      "Check contrast ratios and ARIA attributes.",
    ],
    gates: ["Prohibit non-semantic interactive divs without role."],
  },
  {
    slug: "caveman",
    title: "Caveman Token Optimization Engine",
    leadAgent: "Legolas",
    specialist: "token-optimizer",
    description: "Activates conversational compression to save context tokens.",
    category: "Optimization",
    args: "[lite|full|ultra|off]",
    protocol: [
      "Strip greetings, pleasantries, and tool narration.",
      "Format output as [subject] [action] [rationale]. [next step].",
      "Conserve up to 75% of context window tokens.",
    ],
    gates: ["Never drop code invariants, paths, or qualifiers."],
  },

  // 5. Backend & Database (Gimli)
  {
    slug: "db-migrate",
    title: "Zero-Downtime Database Migration",
    leadAgent: "Gimli",
    specialist: "database-admin",
    description:
      "Plans and executes multi-phase schema migrations with type sync.",
    category: "Database",
    args: "<migration-name>",
    protocol: [
      "Analyze schema diff against context/SCHEMA.md.",
      "Structure breaking changes into expand-contract phases.",
      "Generate migration script with safe column defaults.",
      "Regenerate client ORM types across codebase.",
    ],
    gates: [
      "Destructive commands require explicit confirmation.",
      "Dependent types must never remain desynchronized.",
    ],
  },
  {
    slug: "api-endpoint",
    title: "Typed API Endpoint Generator",
    leadAgent: "Gimli",
    specialist: "api-scaffolder",
    description:
      "Scaffolds typed backend endpoints with Zod runtime validation.",
    category: "Backend",
    args: "<route-path>",
    protocol: [
      "Define request input and response output schemas with Zod.",
      "Scaffold route handler with domain error boundaries.",
      "Export client request types.",
    ],
    gates: ["Parse request payloads at boundary before execution."],
  },
  {
    slug: "refactor",
    title: "AST Refactorer & Dead Code Slasher",
    leadAgent: "Gimli",
    specialist: "refactorer",
    description:
      "Eliminates dead code and simplifies bloated functions safely.",
    category: "Architecture",
    args: "<target-file>",
    protocol: [
      "Run tests to establish green baseline.",
      "Scan for unused exports and redundant helper functions.",
      "Flatten complexity and remove duplicate logic.",
      "Verify tests pass with zero regressions.",
    ],
    gates: ["Stop if any test fails following refactor."],
  },

  // 6. Security & Governance (Boromir)
  {
    slug: "security",
    title: "OWASP Vulnerability Scanner",
    leadAgent: "Boromir",
    specialist: "security-shield",
    description:
      "Scans codebase line by line for injection, auth, and secret leaks.",
    category: "Security",
    args: "[path-or-scope]",
    protocol: [
      "Inspect source code for injection vectors and IDOR flaws.",
      "Scan package manifests for known CVEs.",
      "Produce structured audit report with CWE classifications.",
    ],
    gates: ["Never commit security patches without user sign-off."],
  },
  {
    slug: "audit-deps",
    title: "Supply Chain Dependency Auditor",
    leadAgent: "Boromir",
    specialist: "dependency-auditor",
    description:
      "Verifies lockfile immutability and scans for transitive vulnerabilities.",
    category: "Security",
    protocol: [
      "Run package audit across production dependencies.",
      "Flag high and critical CVEs with upgrade remedies.",
      "Verify lockfile matches package declarations.",
    ],
    gates: ["Block deployment if unresolved high CVE exists."],
  },

  // 7. State & Checkpoints (Samwise)
  {
    slug: "checkpoint",
    title: "Session State Checkpointer",
    leadAgent: "Samwise",
    specialist: "state-keeper",
    description:
      "Saves active decisions, progress, and immediate next steps to disk.",
    category: "Workflow",
    protocol: [
      "Inspect git status and staged diffs.",
      "Record settled architectural decisions.",
      "Save checkpoint document in docs/checkpoints/.",
    ],
    gates: ["Single-mention constraints must never be dropped."],
  },
  {
    slug: "commit",
    title: "Conventional Atomic Committer",
    leadAgent: "Samwise",
    specialist: "state-keeper",
    description:
      "Generates atomic conventional commit messages from staged diffs.",
    category: "Workflow",
    protocol: [
      "Inspect staged files and isolate single logical change.",
      "Generate message in format type(scope): description.",
      "Execute git commit.",
    ],
    gates: ["Prohibit multi-purpose commits covering unrelated domains."],
  },
  {
    slug: "handoff",
    title: "Session Handoff Snapshot",
    leadAgent: "Samwise",
    specialist: "handoff-specialist",
    description:
      "Compresses session state for seamless continuation in new chat.",
    category: "Workflow",
    protocol: [
      "Identify recipient type (new AI session or human teammate).",
      "Extract decisions, dead ends, artifacts, and working preferences.",
      "Generate paste-ready opening prompt for next session.",
    ],
    gates: ["Document must be readable within 2 to 3 minutes."],
  },

  // 8. Exploration & MCP Tools (Pippin)
  {
    slug: "probe",
    title: "Edge Case & Chaos Prober",
    leadAgent: "Pippin",
    specialist: "chaos-prober",
    description:
      "Probes boundary inputs, network drops, and obscure failure modes.",
    category: "Tooling",
    args: "<endpoint-or-function>",
    protocol: [
      "Inject extreme boundary values and malformed payloads.",
      "Simulate high latency and unexpected network drops.",
      "Document unhandled exceptions for remediation.",
    ],
    gates: ["Prohibit testing against live production databases."],
  },
  {
    slug: "mcp-inspect",
    title: "Model Context Protocol Tool Inspector",
    leadAgent: "Pippin",
    specialist: "mcp-specialist",
    description:
      "Inspects live component trees, application logs, and network traffic.",
    category: "Tooling",
    args: "<tool-name>",
    protocol: [
      "Discover available MCP server endpoints and schemas.",
      "Query application logs and capture UI screenshots.",
      "Format diagnostic data for rapid inspection.",
    ],
    gates: ["Validate tool arguments before execution."],
  },

  // 9. Meta & Skill Authoring (Gandalf)
  {
    slug: "create-skill",
    title: "Interactive Skill Authoring Engine",
    leadAgent: "Gandalf",
    specialist: "planner",
    description:
      "Interviews user via 3-round grilling and scaffolds Tier-5 SKILL.md.",
    category: "Workflow",
    args: "<skill-slug>",
    protocol: [
      "Round 1: Interrogate core task, department, agent, command.",
      "Round 2: Interrogate triggers, anti-triggers, and file boundaries.",
      "Round 3: Interrogate workflow steps, stop conditions, and anti-patterns.",
      "Scaffold Tier-5 SKILL.md in sauron/skills/<department>/<slug>/.",
    ],
    gates: ["Never write SKILL.md without completing all 3 interview rounds."],
  },
  {
    slug: "verify",
    title: "Full Pipeline Verification Gate",
    leadAgent: "Merry",
    specialist: "qa-specialist",
    description:
      "Runs full verification: build, typecheck, test suites, and doc gate.",
    category: "Testing",
    protocol: [
      "Run TypeScript compilation (npm run build).",
      "Run automated test suites (npm test).",
      "Run documentation compliance audit.",
    ],
    gates: ["All checks must pass with exit code 0."],
  },
];

// Expanded domain capabilities extending catalog to 94 sovereign commands
const EXTRA_COMMANDS_DEF = [
  // Frontend Specialists (15)
  [
    "ui-component",
    "UI Component Scaffolder",
    "Aragorn",
    "design-engineer",
    "Scaffolds accessible React/Next component with visual tokens.",
    "Frontend",
    "<component-name>",
  ],
  [
    "ui-tokens",
    "Design Token Synchronizer",
    "Aragorn",
    "design-engineer",
    "Syncs CSS variables, color palettes, and spacing scales.",
    "Frontend",
  ],
  [
    "motion-spec",
    "Animation & Motion Specifier",
    "Aragorn",
    "motion-specialist",
    "Defines spring curves and micro-interaction timings.",
    "Frontend",
    "<interaction>",
  ],
  [
    "css-audit",
    "CSS Performance & Specificity Auditor",
    "Aragorn",
    "css-architect",
    "Audits stylesheet bundle size and unused utility classes.",
    "Frontend",
  ],
  [
    "tailwind-config",
    "Tailwind Theme Generator",
    "Aragorn",
    "tailwind-expert",
    "Generates theme extensions and custom color mappings.",
    "Frontend",
  ],
  [
    "react-hook",
    "Custom React Hook Builder",
    "Aragorn",
    "react-specialist",
    "Builds typed, leak-free custom React hooks.",
    "Frontend",
    "<hook-name>",
  ],
  [
    "next-route",
    "Next.js App Router Page Builder",
    "Aragorn",
    "nextjs-architect",
    "Scaffolds Server Component route with metadata.",
    "Frontend",
    "<route>",
  ],
  [
    "next-action",
    "Server Action Creator",
    "Aragorn",
    "nextjs-architect",
    "Creates validated Server Action with optimistic updates.",
    "Frontend",
    "<action-name>",
  ],
  [
    "mobile-screen",
    "React Native Screen Scaffolder",
    "Aragorn",
    "mobile-rn-developer",
    "Scaffolds native mobile screen with safe-area handling.",
    "Frontend",
    "<screen-name>",
  ],
  [
    "mobile-gesture",
    "Gesture Handler Builder",
    "Aragorn",
    "mobile-rn-developer",
    "Builds fluid gesture handlers with reanimated worklets.",
    "Frontend",
  ],
  [
    "theme-switch",
    "Dark Mode & Theme Controller",
    "Aragorn",
    "design-engineer",
    "Implements zero-flicker theme toggle and storage sync.",
    "Frontend",
  ],
  [
    "font-optimize",
    "Typography & Web Font Loader",
    "Aragorn",
    "css-architect",
    "Configures self-hosted fonts with font-display swap.",
    "Frontend",
  ],
  [
    "image-optimize",
    "Responsive Image Pipeline",
    "Aragorn",
    "frontend-developer",
    "Configures next/image with blur placeholders.",
    "Frontend",
  ],
  [
    "form-builder",
    "Accessible Form Generator",
    "Aragorn",
    "frontend-developer",
    "Builds accessible forms with Zod validation and React Hook Form.",
    "Frontend",
    "<form-name>",
  ],
  [
    "state-machine",
    "UI State Machine Configurator",
    "Aragorn",
    "react-specialist",
    "Models complex UI states with deterministic transitions.",
    "Frontend",
    "<feature>",
  ],

  // Backend & Infrastructure Specialists (16)
  [
    "middleware",
    "HTTP Route Middleware Builder",
    "Gimli",
    "backend-engineer",
    "Builds typed authentication and rate-limiting middleware.",
    "Backend",
    "<middleware-name>",
  ],
  [
    "cache-strategy",
    "Cache Invalidation Planner",
    "Gimli",
    "caching-specialist",
    "Configures Redis caching with stale-while-revalidate.",
    "Backend",
  ],
  [
    "rate-limit",
    "API Rate Limiting Guard",
    "Gimli",
    "backend-engineer",
    "Implements sliding-window rate limiting per IP or token.",
    "Backend",
  ],
  [
    "db-index",
    "Database Query & Index Optimizer",
    "Gimli",
    "sql-optimizer",
    "Analyzes query plans and suggests composite indexes.",
    "Database",
    "<table>",
  ],
  [
    "db-seed",
    "Deterministic Database Seeder",
    "Gimli",
    "database-admin",
    "Generates reproducible test fixtures and seed scripts.",
    "Database",
  ],
  [
    "db-rollback",
    "Safe Migration Rollback Planner",
    "Gimli",
    "database-admin",
    "Generates downward migration scripts without data loss.",
    "Database",
  ],
  [
    "graphql-schema",
    "GraphQL Schema & Resolver Builder",
    "Gimli",
    "graphql-architect",
    "Builds typed GraphQL types, queries, and mutations.",
    "Backend",
    "<type-name>",
  ],
  [
    "webhook-handler",
    "Secure Webhook Ingestion Route",
    "Gimli",
    "backend-engineer",
    "Builds idempotent webhook receiver with signature validation.",
    "Backend",
    "<provider>",
  ],
  [
    "queue-worker",
    "Background Job Worker Scaffolder",
    "Gimli",
    "backend-engineer",
    "Scaffolds job queue workers with exponential backoff.",
    "Backend",
    "<job-name>",
  ],
  [
    "grpc-service",
    "gRPC Service Definition Author",
    "Gimli",
    "backend-engineer",
    "Defines protobuf contracts and RPC method handlers.",
    "Backend",
    "<service>",
  ],
  [
    "sql-query",
    "Optimized Raw SQL Query Builder",
    "Gimli",
    "sql-optimizer",
    "Writes parameterized SQL queries with joins and CTEs.",
    "Database",
  ],
  [
    "env-validate",
    "Environment Variable Validator",
    "Gimli",
    "backend-engineer",
    "Enforces runtime validation on process.env at startup.",
    "Backend",
  ],
  [
    "health-check",
    "Liveness & Readiness Probes",
    "Gimli",
    "backend-engineer",
    "Builds Kubernetes health check endpoints for dependencies.",
    "Backend",
  ],
  [
    "circuit-breaker",
    "Resilience Circuit Breaker",
    "Gimli",
    "backend-engineer",
    "Wraps third-party network calls in circuit breakers.",
    "Backend",
    "<service>",
  ],
  [
    "cron-job",
    "Scheduled Cron Task Generator",
    "Gimli",
    "backend-engineer",
    "Scaffolds scheduled maintenance and reporting cron jobs.",
    "Backend",
    "<job-name>",
  ],
  [
    "event-stream",
    "Server-Sent Events & Streaming API",
    "Gimli",
    "backend-engineer",
    "Builds real-time streaming endpoint with reconnection.",
    "Backend",
  ],

  // Security Specialists (12)
  [
    "cors-config",
    "Strict CORS Header Configurator",
    "Boromir",
    "security-shield",
    "Configures origin allowlists and preflight caching.",
    "Security",
  ],
  [
    "csrf-shield",
    "CSRF Protection Enforcer",
    "Boromir",
    "security-shield",
    "Implements double-submit cookie or token validation.",
    "Security",
  ],
  [
    "sanitize-input",
    "XSS Input Sanitization Pipe",
    "Boromir",
    "owasp-scanner",
    "Sanitizes HTML inputs against DOMPurify rules.",
    "Security",
  ],
  [
    "auth-session",
    "JWT & Session Token Handler",
    "Boromir",
    "auth-specialist",
    "Configures rotating tokens and secure cookie storage.",
    "Security",
  ],
  [
    "rbac-guard",
    "Role-Based Access Control Rule",
    "Boromir",
    "auth-specialist",
    "Enforces role and permission gates on protected actions.",
    "Security",
    "<role>",
  ],
  [
    "secret-scan",
    "Repository Secret Leak Scanner",
    "Boromir",
    "secret-guardian",
    "Scans git history and staged files for exposed keys.",
    "Security",
  ],
  [
    "csp-header",
    "Content Security Policy Builder",
    "Boromir",
    "security-shield",
    "Builds strict CSP headers blocking inline scripts.",
    "Security",
  ],
  [
    "sql-injection-audit",
    "SQL Injection Audit Inspector",
    "Boromir",
    "owasp-scanner",
    "Verifies all SQL operations use parameterized queries.",
    "Security",
  ],
  [
    "perm-audit",
    "File & Process Permission Auditor",
    "Boromir",
    "security-shield",
    "Audits container user permissions and file modes.",
    "Security",
  ],
  [
    "incident-triage",
    "Security Incident Response Triage",
    "Boromir",
    "incident-responder",
    "Generates containment and token revocation checklists.",
    "Security",
  ],
  [
    "gdpr-audit",
    "Data Privacy & Redaction Auditor",
    "Boromir",
    "compliance-officer",
    "Verifies user personal data is masked in application logs.",
    "Security",
  ],
  [
    "cert-check",
    "TLS & Certificate Validator",
    "Boromir",
    "security-shield",
    "Inspects certificate expiration dates and cipher suites.",
    "Security",
  ],

  // DevOps & Release (14)
  [
    "dockerfile",
    "Multi-Stage Dockerfile Builder",
    "Gimli",
    "devops-engineer",
    "Creates hardened multi-stage Docker build files.",
    "DevOps",
  ],
  [
    "docker-compose",
    "Local Dev Docker Compose Builder",
    "Gimli",
    "devops-engineer",
    "Configures local databases, redis, and services.",
    "DevOps",
  ],
  [
    "ci-workflow",
    "GitHub Actions CI Pipeline Builder",
    "Merry",
    "release-manager",
    "Scaffolds lint, typecheck, and test matrix pipeline.",
    "DevOps",
  ],
  [
    "cd-deploy",
    "Automated Deployment Pipeline",
    "Merry",
    "release-manager",
    "Configures staging and production deploy jobs.",
    "DevOps",
  ],
  [
    "git-reconcile",
    "Git Merge Conflict Reconciler",
    "Samwise",
    "git-reconciler",
    "Resolves rebase and merge conflicts with test safety.",
    "DevOps",
  ],
  [
    "git-worktree",
    "Isolated Git Worktree Manager",
    "Samwise",
    "workspace-scaffolder",
    "Creates isolated worktrees for parallel branches.",
    "DevOps",
    "<branch>",
  ],
  [
    "release-tag",
    "Semantic Release & Tag Generator",
    "Samwise",
    "release-manager",
    "Computes next semver tag and generates release notes.",
    "DevOps",
    "[patch|minor|major]",
  ],
  [
    "monorepo-sync",
    "Monorepo Package Dependency Sync",
    "Gandalf",
    "monorepo-architect",
    "Syncs shared dependency versions across workspaces.",
    "DevOps",
  ],
  [
    "bench-perf",
    "Performance Benchmark Runner",
    "Merry",
    "performance-benchmarker",
    "Executes benchmark suites and reports ops/sec.",
    "DevOps",
  ],
  [
    "log-format",
    "Structured JSON Logger Setup",
    "Pippin",
    "log-inspector",
    "Configures structured logging with correlation IDs.",
    "DevOps",
  ],
  [
    "metric-otel",
    "OpenTelemetry Tracing Setup",
    "Pippin",
    "log-inspector",
    "Instruments HTTP routes with distributed traces.",
    "DevOps",
  ],
  [
    "bundle-analyze",
    "Webpack / Rollup Bundle Analyzer",
    "Legolas",
    "performance-benchmarker",
    "Analyzes chunk sizes and flags large dependencies.",
    "DevOps",
  ],
  [
    "nginx-conf",
    "Reverse Proxy Nginx Configurator",
    "Gimli",
    "devops-engineer",
    "Builds production Nginx config with gzip and SSL.",
    "DevOps",
  ],
  [
    "k8s-manifest",
    "Kubernetes Deployment Manifests",
    "Gimli",
    "devops-engineer",
    "Scaffolds Deployment, Service, and Ingress YAML.",
    "DevOps",
    "<service>",
  ],

  // Productivity, Docs & Meta (12)
  [
    "docs-api",
    "OpenAPI & Swagger Doc Generator",
    "Gandalf",
    "api-designer",
    "Generates OpenAPI 3.1 spec from route definitions.",
    "Documentation",
  ],
  [
    "docs-readme",
    "Production README Generator",
    "Gandalf",
    "planner",
    "Generates complete project README with setup commands.",
    "Documentation",
  ],
  [
    "docs-audit",
    "Documentation Debt Auditor",
    "Legolas",
    "doc-reviewer",
    "Flags stale documentation and unresolved TODO markers.",
    "Documentation",
  ],
  [
    "onboard-repo",
    "Codebase Orientation Map Builder",
    "Gandalf",
    "planner",
    "Generates architecture cheat sheet for newcomers.",
    "Documentation",
  ],
  [
    "debug-log",
    "Deep Execution Debug Logger",
    "Frodo",
    "bundler-debugger",
    "Injects contextual debug statements and tracks state.",
    "Debugging",
  ],
  [
    "flaky-fix",
    "Flaky Test Hunter & Eliminator",
    "Merry",
    "flaky-test-hunter",
    "Runs tests in loop to isolate race conditions.",
    "Testing",
    "<test-file>",
  ],
  [
    "contract-test",
    "API Consumer Contract Tester",
    "Merry",
    "contract-tester",
    "Verifies frontend expectations against backend contracts.",
    "Testing",
  ],
  [
    "mock-server",
    "Mock API Server Generator",
    "Merry",
    "mocking-specialist",
    "Scaffolds mock MSW handlers for offline testing.",
    "Testing",
  ],
  [
    "split-code",
    "Bloated Source Code Splitter",
    "Legolas",
    "refactorer",
    "Splits monolithic files into cohesive single-purpose files.",
    "Architecture",
    "<file>",
  ],
  [
    "naming-audit",
    "Domain Terminology & Naming Audit",
    "Legolas",
    "code-reviewer",
    "Enforces consistent naming conventions across types.",
    "Review",
  ],
  [
    "profile-cpu",
    "CPU Profile & Hotpath Analyzer",
    "Pippin",
    "performance-benchmarker",
    "Identifies CPU bottlenecks and memory hotspots.",
    "Optimization",
  ],
  [
    "clean-deps",
    "Unused Package Dependency Remover",
    "Gimli",
    "dead-code-slasher",
    "Scans imports and uninstalls orphaned npm packages.",
    "Architecture",
  ],
];

/**
 * Builds markdown content for a command specification.
 *
 * @param {CommandSpec} spec - Command specification metadata.
 * @returns {string} Formatted markdown content.
 */
function buildCommandMarkdown(spec) {
  const argsSyntax = spec.args ? ` ${spec.args}` : "";
  const protocolList = spec.protocol
    .map((step, i) => `${i + 1}. **Step ${i + 1}:** ${step}`)
    .join("\n");
  const gatesList = spec.gates.map((gate) => `- ${gate}`).join("\n");

  return `# /${spec.slug} Command

${spec.description}

---

## 1. Identity & Execution

- **Lead Agent:** ${spec.leadAgent}
- **Specialist Agent:** ${spec.specialist}
- **Category:** ${spec.category}

---

## 2. Trigger Syntax

\`\`\`bash
/${spec.slug}${argsSyntax}
\`\`\`

---

## 3. Workflow Protocol

${protocolList}

---

## 4. Hard Verification Gates

${gatesList}
`;
}

/**
 * Main execution entrypoint.
 *
 * @returns {void}
 */
function main() {
  console.log(
    "===================================================================",
  );
  console.log(
    "             SAURON SOVEREIGN COMMAND SCAFFOLD ENGINE              ",
  );
  console.log(
    "===================================================================\n",
  );

  if (!fs.existsSync(COMMANDS_DIR)) {
    fs.mkdirSync(COMMANDS_DIR, { recursive: true });
  }

  // Combine curated core commands with expanded domain commands
  const allCommands = [...COMMANDS];

  for (const extra of EXTRA_COMMANDS_DEF) {
    const [slug, title, leadAgent, specialist, description, category, args] =
      extra;
    allCommands.push({
      slug,
      title,
      leadAgent,
      specialist,
      description,
      category,
      args,
      protocol: [
        `Analyze target request and verify prerequisite context.`,
        `Execute ${title} protocol adhering strictly to domain rules.`,
        `Verify output against quality standards and pass verification.`,
      ],
      gates: [
        `Enforce strict type-safety and defensive boundary checks.`,
        `Verify zero regressions before completion.`,
      ],
    });
  }

  console.log(
    `[GENERATING] Writing ${allCommands.length} sovereign slash commands to ${COMMANDS_DIR}...`,
  );

  for (const cmd of allCommands) {
    const filePath = path.join(COMMANDS_DIR, `${cmd.slug}.md`);
    const content = buildCommandMarkdown(cmd);
    fs.writeFileSync(filePath, content, "utf8");
  }

  console.log(
    `\n[COMPLETE] Successfully generated ${allCommands.length} sovereign slash commands.`,
  );
}

main();
