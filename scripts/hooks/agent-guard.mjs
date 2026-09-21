#!/usr/bin/env node

/**
 * Sauron Agent Guard: Pre-execution Safety Hook & Command Interceptor
 * Strictly implements skills/security/agent-guard/SKILL.md
 *
 * Intercepts autonomous agent tool calls and shell commands before execution.
 * Blocks destructive filesystem wipes, irreversible git history rewrites,
 * and credential exposure.
 */

const rawCommand = process.argv.slice(2).join(" ").trim();

if (!rawCommand) {
  process.exit(0);
}

// Normalized command for deterministic string matching (lowercase, collapsed spaces)
const normalized = rawCommand.toLowerCase().replace(/\s+/g, " ");

// 1. CREDENTIAL ACCESS RULES (HARD BLOCK)
const CREDENTIAL_PATTERNS = [
  /\.env(\.|$|\s)/,
  /id_rsa/,
  /id_ed25519/,
  /credentials\.json/,
  /\.pem(\b|\s|$)/,
  /\.key(\b|\s|$)/,
  /aws_access_key/,
];

for (const pattern of CREDENTIAL_PATTERNS) {
  if (pattern.test(normalized)) {
    console.error("\n🚫 [AGENT GUARD HARD BLOCK] Action Prohibited:");
    console.error(
      `   Command attempts to inspect or access secret credential files.`,
    );
    console.error(`   Offending Command: "${rawCommand}"`);
    console.error(
      `   Policy: Credentials must never enter LLM context windows or shell history.\n`,
    );
    process.exit(1);
  }
}

// 2. DESTRUCTIVE GIT COMMANDS (HARD BLOCK)
const DESTRUCTIVE_GIT_PATTERNS = [
  /\bgit\s+push\s+.*(--force|-f\b)/,
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+clean\s+-[a-z]*f[a-z]*d/,
  /\bgit\s+rebase\s+-i\b/,
];

for (const pattern of DESTRUCTIVE_GIT_PATTERNS) {
  if (pattern.test(normalized)) {
    console.error("\n🚫 [AGENT GUARD HARD BLOCK] Action Prohibited:");
    console.error(
      `   Command attempts irreversible upstream or working-tree git destruction.`,
    );
    console.error(`   Offending Command: "${rawCommand}"`);
    console.error(
      `   Policy: Forced git pushes and hard resets risk permanent codebase data loss.\n`,
    );
    process.exit(1);
  }
}

// 3. FILESYSTEM WIPE (HARD BLOCK)
const FILESYSTEM_WIPE_PATTERNS = [
  /\brm\s+-[a-z]*r[a-z]*f\s+([\/~.]|$|\*)/,
  /\brmdir\s+\/s\s+\/q\b/,
  /\bdel\s+\/f\s+\/s\s+\/q\s+[c-z]:\\/i,
];

for (const pattern of FILESYSTEM_WIPE_PATTERNS) {
  if (pattern.test(normalized)) {
    console.error("\n🚫 [AGENT GUARD HARD BLOCK] Action Prohibited:");
    console.error(`   Monolithic recursive filesystem wipe detected.`);
    console.error(`   Offending Command: "${rawCommand}"`);
    console.error(
      `   Policy: Unsandboxed directory deletion threatens the host operating system.\n`,
    );
    process.exit(1);
  }
}

// 4. DATABASE WIPES (HARD BLOCK)
const DB_DESTRUCTION_PATTERNS = [
  /\bdrop\s+database\b/,
  /\bdrop\s+table\b/,
  /\btruncate\s+table\b/,
  /\bprisma\s+migrate\s+reset\b/,
];

for (const pattern of DB_DESTRUCTION_PATTERNS) {
  if (pattern.test(normalized)) {
    console.error("\n🚫 [AGENT GUARD HARD BLOCK] Action Prohibited:");
    console.error(`   Destructive database operation detected.`);
    console.error(`   Offending Command: "${rawCommand}"`);
    console.error(
      `   Policy: Production schema destruction requires explicit manual confirmation.\n`,
    );
    process.exit(1);
  }
}

// Command verified safe
process.exit(0);
