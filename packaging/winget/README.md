# Winget manifests

These are source templates, not installable submissions. Generate concrete version, installer
and default-locale YAML files with scripts/packaging/generate-winget.mjs. It reads the real
archive SHA-256 and creates a new output directory without replacing user files.

Required arguments: --id, --archive, --url and --out. Optional: --version and --arch.
The default version comes from package.json. Architecture defaults to x64. Build native ARM64
before using --arch arm64. The generator makes no network call and performs no installation.

Miguel chooses the production ID after the release. Use Local.Sauron only for local schema
validation. Never submit templates, placeholder values, invented hashes or unpublished URLs.

The zip root must contain sauron.exe and its sibling assets. The nested portable manifest uses
ArchiveBinariesDependOnPath. Do not strip the resource folders or add an unsupported Scope key.

See [Windows packaging](../../docs/01-getting-started/windows-portable.md) for build, validation,
manual installation and release checks.
