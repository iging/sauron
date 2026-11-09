# Windows portable executable

Phase 11 adds a Windows Node SEA build. The npm package still supports Node 20.12.0 or newer.
The portable executable embeds Node 24 and its JavaScript dependencies, so users do not need
Node or npm to run it. Windows x64 is locally checked. ARM64 requires a native ARM64 build.

## Build and verify

Run from the repository with Node 24 and development dependencies installed:

~~~powershell
npm ci
npm run build:windows -- --out build/windows
node scripts/packaging/smoke-windows.mjs --archive build/windows/sauron-3.2.0-windows-x64.zip --work build/windows-smoke
~~~

The filename uses the current package version and native architecture. Version stays 3.2.0
during roadmap development. Phase 12 changes it to 4.0.0. Use a fresh output directory for each
build. Existing outputs are never overwritten or deleted. Compiler/injection/archive tools
operate only on the newly reserved build artifacts.

The output contains a package directory, zip and build-info.json with its SHA-256.
The zip root holds sauron.exe plus skills, core, config, rules, references, commands, scripts,
licenses and public docs. It excludes node_modules, local workspace state, handoffs and the
second-brain vault. Credential filenames (.env variants, private-key and certificate containers)
are omitted, while explicit .env.example/.sample/.template files remain available.
Every expected asset has a hash in asset-manifest.json. The smoke test
extracts the zip, verifies every hash, then runs the CLI from a separate directory with spaces
and an empty PATH: version, help, status, catalog, init, upgrade, sync, doctor, repair, Eye, scan, graph and
uninstall. The legacy upgrade fixture checks dry-run immutability, the original backup,
comment preservation, the migration report and subsequent runtime synchronization.

The binary is unsigned. The build clears the copied Node executable's old Authenticode
directory before injection, because that signature cannot certify the modified executable.
This does not create a new signature or establish publisher trust. Keep the entire extracted
directory together. Moving only sauron.exe loses its required sibling assets.

The build includes Sauron's licenses, dependency notices and the exact embedded Node version's
license. If the Node installation lacks LICENSE, the build retrieves the license text from the
matching official Node tag. That is a build-time network request. The executable does not
download assets or dependencies at startup.

## Asset resolution

npm resolves assets above bin/sauron.mjs. SEA resolves them beside the real executable, including
a linked executable path. Neither mode uses the user's working directory as the package root.
A missing or unrelated package.json fails rather than falling back to a project copy.

## Winget preparation

Templates live in packaging/winget. Generate three concrete manifests with a chosen identifier,
the actual zip and its final HTTPS release URL:

~~~powershell
npm run winget:manifest -- --id Local.Sauron --archive build/windows/sauron-3.2.0-windows-x64.zip --url https://github.com/iging/sauron/releases/download/v3.2.0/sauron-3.2.0-windows-x64.zip --out build/winget-draft
winget validate --manifest build/winget-draft
~~~

Local.Sauron is a validation-only example, not a reserved production ID. The shown URL is a
future asset example, not an existing release download. Never submit or install that draft
until the actual asset is published and its URL/version/hash match. Miguel chooses the final
winget ID. No manifest contains an invented checksum.

The installer is a zip with a nested portable sauron.exe. ArchiveBinariesDependOnPath keeps the
installation directory on PATH so sibling assets remain available. Scope is omitted because
winget does not support that manifest field for portable installers.

After the release, Miguel performs the real local install and checks a new shell:

~~~powershell
winget install --manifest build/winget-final
sauron --version
sauron status
~~~

Local-manifest installation can require a Windows Package Manager setting. Do not enable it
automatically. The real install, PATH persistence, upgrade/uninstall behavior, final package ID
and community submission remain manual release checks. This phase does not install, submit,
publish, bump the package version or create a release.

The current bundle is unsigned. Windows Application Control can block it before the CLI starts.
A successful zip build or manifest validation does not prove execution is allowed. Do not disable
or bypass that policy. Use the supported npm/Docker installation path when available, or wait
for a release artifact accepted by your organization's policy.

## CI and release

Pull requests build and smoke-test the Windows portable zip on Node 24. The release workflow
builds/verifies Windows first, transfers the zip through a pinned artifact action, and attaches
it alongside the existing harness bundle. A tag must match the package version. Manual release
runs derive the tag from the package version. No action runs merely by editing these files.

References: [Node 24 SEA](https://github.com/nodejs/node/blob/v24.15.0/doc/api/single-executable-applications.md),
[esbuild Node bundling](https://esbuild.github.io/api/#platform),
[winget manifest authoring](https://learn.microsoft.com/en-us/windows/package-manager/package/manifest)
and the [portable archive schema](https://github.com/microsoft/winget-cli/blob/master/schemas/JSON/manifests/v1.12.0/manifest.installer.1.12.0.json).
