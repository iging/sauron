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
- You can always run `npx sauron init --dry-run` first to preview changes without modifying anything on disk.

---

### 3. Do I need Node.js installed to use Sauron?

**No.** While Sauron has a fast npm package (`npx sauron`), it supports three zero-Node distribution channels:

1. **Standalone Shell Installers:**
   - Linux/macOS: `curl -fsSL https://raw.githubusercontent.com/sauron-ai/sauron/main/bin/install.sh | bash`
   - Windows PowerShell: `irm https://raw.githubusercontent.com/sauron-ai/sauron/main/bin/install.ps1 | iex`
2. **Python PyPI:** `pip install sauron-ai && sauron init`
3. **Hardened Docker Container:** Run directly with `docker compose run --rm sauron init` without installing anything on your host machine.

---

### 4. Does Sauron send my source code, prompts, or telemetry to external servers?

**No. Exactly zero telemetry.**

- All transpilation, schema parsing, and rule generation happens 100% locally on your machine.
- Sauron makes zero outbound network requests during operation.
- Your intellectual property, source files, and developer instructions never leave your local workspace.

---

### 5. Why are there 17 runtimes? Do I need to enable all of them?

No. While Sauron provides out-of-the-box adapters for 17 runtimes, you have complete control over which runtimes are active.
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

### 6. What is Caveman Mode and how does it save up to 75% tokens?

Conversational AI models spend up to 70% of their output tokens on pleasantries, filler phrases ("Sure, I can help with that!"), and repetitive summaries. Over long engineering sessions, this blows through context windows and burns expensive API credits.

**Caveman Mode** compresses agent communication into dense, telegraphic technical fragments:

- `/caveman full`: Spartan fragments, zero filler (~60% token reduction).
- `/caveman lite`: Grammatically complete sentences without conversational filler (~40% reduction).
- `/caveman ultra`: Extreme token compression for critical context conservation (~75% reduction).
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
   npx sauron init
   ```
3. Sauron will inspect your existing setup, back up existing rules into `.sauron/backups/`, and create `sauron.config.yaml`.
4. Add any modular skills you need:
   ```bash
   npx sauron add nextjs-principles
   npx sauron add clean-architecture
   ```
