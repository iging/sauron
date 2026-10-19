# ===================================================================
# Sauron Universal Windows PowerShell Installer
# "One Harness to rule them all..."
# Local clone: creates `sauron` wrappers in ~\.sauron\bin.
# Remote (irm | iex): installs sauron-ai globally with pnpm or npm.
# ===================================================================

[CmdletBinding()]
param (
    [string]$InstallPath = "$HOME\.sauron\bin"
)

$ErrorActionPreference = "Stop"

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "                       S A U R O N" -ForegroundColor Cyan
Write-Host "  One Harness to rule them all, One Harness to prompt them," -ForegroundColor Cyan
Write-Host "  One Harness to sync them all, and in your codebase bind them." -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Node.js prerequisite
$NodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $NodeCmd) {
    Write-Host "[ERROR] Node.js was not found in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js (version 18 or newer) before installing sauron." -ForegroundColor Red
    exit 1
}

$NodeVersionRaw = (node -v) -replace '^v',''
$NodeMajor = [int]($NodeVersionRaw.Split('.')[0])
if ($NodeMajor -lt 18) {
    Write-Host "[ERROR] Detected Node.js v$NodeVersionRaw. Sauron requires Node.js 18 or newer." -ForegroundColor Red
    exit 1
}

# Step 2: Local clone (this script lives in <repo>\bin) or remote install.
$ScriptDir = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { "" }
$SauronMjs = if ($ScriptDir) { Join-Path $ScriptDir "sauron.mjs" } else { "" }

if ($SauronMjs -and (Test-Path $SauronMjs)) {
    $RepoRoot = Split-Path -Parent $ScriptDir
    $Version = (Get-Content (Join-Path $RepoRoot "package.json") -Raw | ConvertFrom-Json).version
    Write-Host "[INSTALLER] Installing sauron v$Version from local clone..." -ForegroundColor Yellow

    # The CLI imports the compiled engine from dist\, so build it when missing.
    if (-not (Test-Path (Join-Path $RepoRoot "dist\adapters\transpiler.js"))) {
        Write-Host "[INSTALLER] Building the engine (npm install && npm run build)..." -ForegroundColor Yellow
        Push-Location $RepoRoot
        try {
            npm install --no-audit --no-fund
            if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
            npm run build
            if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
        } finally {
            Pop-Location
        }
    }

    if (-not (Test-Path $InstallPath)) {
        New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    }
    $CmdWrapper = Join-Path $InstallPath "sauron.cmd"
    $PsWrapper = Join-Path $InstallPath "sauron.ps1"
    Set-Content -Path $CmdWrapper -Value "@echo off`r`nnode `"$SauronMjs`" %*" -Encoding ASCII
    Set-Content -Path $PsWrapper -Value "& node `"$SauronMjs`" `$args" -Encoding ASCII
    Write-Host "[SUCCESS] Created Windows wrappers in $InstallPath" -ForegroundColor Green

    # Only the local launcher needs the PATH entry.
    $UserPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
    if ($UserPath -notlike "*$InstallPath*") {
        Write-Host "Adding $InstallPath to your User PATH..." -ForegroundColor Yellow
        [Environment]::SetEnvironmentVariable("Path", "$UserPath;$InstallPath", [EnvironmentVariableTarget]::User)
        $env:Path = "$env:Path;$InstallPath"
        Write-Host "[SUCCESS] PATH updated. Restart your shell for it to take effect." -ForegroundColor Green
    }
} else {
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        Write-Host "[INSTALLER] Installing sauron-ai globally via pnpm..." -ForegroundColor Yellow
        pnpm add -g sauron-ai
    } else {
        Write-Host "[INSTALLER] Installing sauron-ai globally via npm..." -ForegroundColor Yellow
        npm install -g sauron-ai
    }
    if ($LASTEXITCODE -ne 0) { throw "Global install failed" }
}

Write-Host ""
Write-Host "[COMPLETE] sauron installed." -ForegroundColor Green
Write-Host "Run 'sauron init' inside your project (or without installing: npx sauron-ai init / pnpm dlx sauron-ai init)." -ForegroundColor Cyan
