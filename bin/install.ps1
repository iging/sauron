# ===================================================================
# Sauron Universal Windows PowerShell Installer
# "One Harness to rule them all..."
# Installs sauron CLI on Windows environments
# ===================================================================

[CmdletBinding()]
param (
    [string]$InstallPath = "$HOME\.sauron\bin"
)

$ErrorActionPreference = "Stop"
$Version = "1.0.0"

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "                       S A U R O N" -ForegroundColor Cyan
Write-Host "  One Harness to rule them all, One Harness to prompt them," -ForegroundColor Cyan
Write-Host "  One Harness to sync them all, and in your codebase bind them." -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INSTALLER] Installing sauron v$Version for Windows..." -ForegroundColor Yellow

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

# Step 2: Ensure destination directory exists
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
}

# Step 3: Create CMD and PowerShell wrapper scripts
$ScriptDir = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { "" }
$SauronMjs = if ($ScriptDir) { Join-Path (Split-Path -Parent (Split-Path -Parent $ScriptDir)) "bin\sauron.mjs" } else { "" }

if ($SauronMjs -and (Test-Path $SauronMjs)) {
    # Local repository installation mode
    $CmdWrapper = Join-Path $InstallPath "sauron.cmd"
    $PsWrapper = Join-Path $InstallPath "sauron.ps1"

    $CmdContent = "@echo off`r`nnode `"$SauronMjs`" %*"
    Set-Content -Path $CmdWrapper -Value $CmdContent -Encoding ASCII

    $PsContent = "& node `"$SauronMjs`" `$args"
    Set-Content -Path $PsWrapper -Value $PsContent -Encoding ASCII

    Write-Host "[SUCCESS] Created Windows wrappers in $InstallPath" -ForegroundColor Green
} else {
    # Remote installation fallback via npm
    Write-Host "[INSTALLER] Installing sauron-ai globally via npm..." -ForegroundColor Yellow
    npm install -g sauron-ai
}

# Step 4: Verify User PATH
$UserPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($UserPath -notlike "*$InstallPath*") {
    Write-Host ""
    Write-Host "[NOTICE] $InstallPath is not in your User PATH." -ForegroundColor Yellow
    Write-Host "Adding $InstallPath to your User PATH environment variable..." -ForegroundColor Yellow
    $NewPath = "$UserPath;$InstallPath"
    [Environment]::SetEnvironmentVariable("Path", $NewPath, [EnvironmentVariableTarget]::User)
    $env:Path = "$env:Path;$InstallPath"
    Write-Host "[SUCCESS] PATH updated. Please restart your shell for changes to take effect." -ForegroundColor Green
}

Write-Host ""
Write-Host "[COMPLETE] sauron v$Version installed successfully on Windows." -ForegroundColor Green
Write-Host "Run 'sauron status' to verify your installation." -ForegroundColor Cyan
