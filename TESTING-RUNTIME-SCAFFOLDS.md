# How to Test the Runtime Scaffolds Before Release

Test the real package before running `npm run release:major`. Use `npm pack` so you test exactly what npm will publish.

## Step 0: Build a Local Package

```bash
cd C:/Users/IGING/Documents/GitHub/sauron
git checkout main && git pull
npm ci
npm run build
npm test                # must be 86/86 pass
npm pack                # creates sauron-ai-2.0.0.tgz
```

Keep the full path of the `.tgz` file. Example: `C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz`

## Test A: Brand-New Project

```bash
mkdir C:/temp/sauron-new && cd C:/temp/sauron-new
git init
npm init -y

# npm
npx --yes C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init --dry-run
npx --yes C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init

# or pnpm
pnpm dlx C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init
```

**Checklist (PASS/FAIL):**
- [ ] `--dry-run` lists paths as SIMULATED and creates no files except `.git`.
- [ ] After `init`, these exist: `AGENTS.md`, `.agents/skills/README.md`, `.agents/anti-patterns.md`.
- [ ] `.claude/` has `README.md`, `settings.json`, and a README in `rules/ skills/ agents/ workflows/ output-styles/ agent-memory/ docs/`.
- [ ] None of the legacy files exist: `.cursorrules`, `.windsurfrules`, `.clinerules`, `.traerules`, `.kirorules`, `.pirules`, `.codex/instructions.md`.
- [ ] Running `init` again shows every file as `UNCHANGED`.
- [ ] `git status` shows only Sauron files plus `sauron.config.yaml`.

**Runtime smoke test (optional):** Open the folder in each tool you use.
- Claude Code: type `/memory` and check that `CLAUDE.md` is loaded.
- Cursor: Settings → Rules should show `sauron`.
- Copilot: in Chat, the References list should include `copilot-instructions.md`.
- Gemini CLI: `/memory show`.

## Test B: Existing Project (the important one)

Use a copy or a test branch. Do not test on a real project's `main`.

```bash
cd C:/path/to/existing-project
git checkout -b test/sauron-v3
git status               # must be clean before you start

npx --yes C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init --dry-run
npx --yes C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init
git status
git diff
```

**Checklist (PASS/FAIL):**
- [ ] Your source code, `package.json`, and lockfile are not in `git diff`.
- [ ] Your existing `sauron.config.yaml` is preserved ("Preserving user configuration").
- [ ] Every file you already had that Sauron touched is reported as `UPDATED` with a backup path in `.sauron/backups/`.
- [ ] An old `.clinerules` file is left untouched.
- [ ] Old legacy files (`.cursorrules` and others) are **not deleted**. They are just no longer updated. Delete them yourself if you no longer need them.

**Safe merge (must PASS):**
- [ ] Your own `AGENTS.md` / `CLAUDE.md` is reported as `MERGED`. Your text is still at the top, and Sauron's content is inside the `<!-- sauron:start -->` … `<!-- sauron:end -->` block at the end.
- [ ] Your own `.claude/settings.json` (or `.gemini/settings.json`, `opencode.json`) is `MERGED`. All your keys and values are still there; Sauron only added missing keys such as `$schema`.
- [ ] Edit something outside the Sauron block, then run `init` again. Your edit is still there.

```bash
git diff AGENTS.md .claude/settings.json
ls .sauron/backups
```

## Test C: Caveman Mode

```bash
# Interactive: on the first init in a new project you are asked for a tier
npx --yes C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init

# Non-interactive
npx --yes C:/Users/IGING/Documents/GitHub/sauron/sauron-ai-2.0.0.tgz init --caveman=ultra
grep default_mode sauron.config.yaml        # "ultra"
grep "ACTIVE at tier" AGENTS.md CLAUDE.md   # tier `ultra`
```

- [ ] `--caveman=bogus` exits with an error.
- [ ] `--caveman=off` makes the files say `Default: OFF`.
- [ ] Open Claude Code or Cursor and ask something without typing `/caveman`. The reply is already terse.

**Cleanup after the test:**
```bash
git checkout main
git branch -D test/sauron-v3
```

## Step Z: Release (once A and B pass)

```bash
cd C:/Users/IGING/Documents/GitHub/sauron
del sauron-ai-2.0.0.tgz
npm run release:major    # 2.0.0 -> 3.0.0, publish, push tags
```
