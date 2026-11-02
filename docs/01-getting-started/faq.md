# Frequently Asked Questions (FAQ)

> Common questions, safety guarantees, and configuration guides for **Sauron AI**.

---

### 1. What exactly is Sauron AI?

**Sauron AI** is a local-first, universal AI coding agent harness and orchestration framework. It solves two critical problems in modern AI engineering:

1. **Configuration Fragmentation:** Instead of manually maintaining separate rules for Cursor, Claude Code, Windsurf, Copilot, and Cline, Sauron compiles a single master configuration (`sauron.config.yaml`) to 17 native runtimes in milliseconds.
2. **Unverified Agent Coding:** Instead of letting generic AI prompts make chaotic, untested changes, Sauron enforces a 9-agent Fellowship (planning, architecture, TDD, linting, security, refactoring, commits) backed by over 300 modular skills.

---

### 2. Will running `sauron init` overwrite or destroy my existing configuration files?

**No.** Sauron enforces a strict **Zero-Destructive Operations** guarantee:

- The **ConflictManager** engine compares file contents and cryptographic checksums (SHA-256) before touching your disk.
- If an existing configuration file differs from the new output, Sauron automatically creates an immutable, timestamped backup in `.sauron/backups/` (e.g., `.cursorrules.20260921.bak`) before writing.
- You can always run `npx sauron-ai init --dry-run` first to preview changes without modifying anything on disk.

---

### 3. Do I need Node.js installed to use Sauron?

**Yes, unless you use Docker.** Sauron runs on Node.js 18 or newer. These install paths are available:

1. **npm or pnpm:** `npx sauron-ai init` or `pnpm dlx sauron-ai init`
2. **Shell Installers (Node.js required):**
   - Linux/macOS: `curl -fsSL https://raw.githubusercontent.com/iging/sauron/main/bin/install.sh | bash`
   - Windows PowerShell: `irm https://raw.githubusercontent.com/iging/sauron/main/bin/install.ps1 | iex`
3. **Docker Container (no Node.js needed on your host):** Run directly with `docker compose run --rm sauron init` without installing anything on your host machine.

---

### 4. Does Sauron send my source code, prompts, or telemetry to external servers?

**No. Exactly zero telemetry.**

- All transpilation, schema parsing, and rule generation happens 100% locally on your machine.
- The CLI makes no outbound network requests of its own. Installing it uses your package registry, and an opened `graph.html` loads fonts and its graph library. See [PRIVACY.md](../../PRIVACY.md).
- Your intellectual property, source files, and developer instructions never leave your local workspace.

---

### 5. Why are there 20 runtimes? Do I need to enable all of them?

No. While Sauron provides out-of-the-box adapters for 20 runtimes, you have complete control over which runtimes are active.
In your `sauron.config.yaml`, simply toggle whichever editors your team uses:

```yaml
runtimes:
  claude: true
  cursor: true
  windsurf: false
  copilot: true
  cline: false
  # ... toggle only what you need
```

Sauron will only transpile and maintain files for the runtimes you enable.

---

### 6. What is Caveman Mode and how does it save tokens?

Conversational AI models spend output tokens on pleasantries, filler phrases ("Sure, I can help with that!"), and repetitive summaries. Over long engineering sessions, this blows through context windows and burns expensive API credits.

**Caveman Mode** compresses agent communication into dense, telegraphic technical fragments:

- `/caveman full`: Spartan fragments, zero filler.
- `/caveman lite`: Grammatically complete sentences without conversational filler.
- `/caveman ultra`: Extreme token compression for critical context conservation.
- `/caveman off`: Restores default conversational mode.

---

### 7. How does Agent Guard protect against malware and shell injection?

Autonomous AI coding agents possess terminal-execution privileges, making them targets for indirect prompt injections (e.g., malicious instructions hidden in package READMEs or scraped web pages).

Sauron's **Agent Guard** (`scripts/hooks/agent-guard.mjs`) acts as an in-line command firewall:

- **Hard-Blocks Credential Theft:** Any command attempting to access `.env`, `.env.local`, SSH private keys (`id_rsa`), or cloud credentials is intercepted and terminated before execution.
- **Hard-Blocks Destructive Commands:** Commands like `rm -rf /`, `DROP DATABASE`, and `git push --force` are permanently blocked.
- **Blocks Unverified Remote Execution:** Remote pipe-to-bash executions (`curl ... | bash`) are stopped unless explicitly whitelisted.

---

### 8. How do I migrate an existing repository to Sauron?

Migration takes less than 60 seconds:

1. Navigate to your repository root.
2. Run:
   ```bash
   npx sauron-ai init
   ```
3. Sauron will inspect your existing setup, back up existing rules into `.sauron/backups/`, and create `sauron.config.yaml`.
4. Add any modular skills you need:
   ```bash
   npx sauron-ai add nextjs-principles
   npx sauron-ai add clean-architecture
   ```
