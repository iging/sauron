# Sauron CLI with Docker

Run Docker Compose from the repository root. The only Compose file is ../docker-compose.yml.
The Compose project is sauron-ai and its image is sauron-ai:local.
It builds the CLI with Dockerfile.cli. The landing page is maintained in a separate repository.

## Select the user project

The CLI reads and writes /workspace. Set SAURON_WORKSPACE to an existing absolute project path
before running init, add, repair, or uninstall. If unset, Compose mounts the Sauron clone itself.
Build paths stay relative to this clone, independently of the mounted user project.

PowerShell:

```powershell
$env:SAURON_WORKSPACE = 'C:\path\to\your-project'
docker compose config
docker compose build sauron
docker compose run --rm sauron status
docker compose run --rm sauron init --yes
docker compose run --rm sauron add api-design
```

Bash:

```bash
export SAURON_WORKSPACE="/absolute/path/to/your-project"
docker compose config
docker compose build sauron
docker compose run --rm sauron status
```

From another directory, use docker compose -f /absolute/path/to/sauron/docker-compose.yml.
The root Compose file remains the only configuration. No entrypoint override is needed.

## Image and permissions

- The Node 22 Alpine builder copies package.json and package-lock.json, then runs npm ci.
- TypeScript builds before the runtime image is assembled. Dependency or build failures stop it.
- The runtime uses the sauron user with UID/GID 10001. The mounted project must allow this user
  to write when running mutation commands. Docker Desktop handles Windows bind-mount access.
- The entrypoint is node /opt/sauron/bin/sauron.mjs. It does not depend on shebang line endings.
- Source .mjs and .sh files use LF through .gitattributes.
- .dockerignore excludes dependencies, compiled output, runtime state, worktrees, editor settings,
  secrets, and internal/local-only notes. Do not copy credentials into the build context.
- Build tools remain in the copied application tree. No image-size target is claimed.

## Standalone image

```bash
docker build -t sauron-ai:local -f docker/Dockerfile.cli .
docker run --rm --mount type=bind,source=/absolute/path/to/your-project,target=/workspace sauron-ai:local status
```
