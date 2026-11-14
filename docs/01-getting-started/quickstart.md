# Quickstart Guide

This guide applies to Sauron 4.0.0.

## Prerequisites

npm and shell installations require Node.js 20.12.0 or newer. Docker includes Node.

## Install

For the published package:

```bash
npm install --global sauron-ai
```

For this development checkout:

```bash
git clone https://github.com/iging/sauron.git
cd sauron
npm ci
npm run build
```

Run the checkout CLI by its absolute path from the project you want to configure.
Use `sauron` below only after installing the package globally.

## Configure a project

```bash
cd /path/to/your-project
sauron init --dry-run --yes --runtimes=claude --skills=none
sauron init
```

The interactive flow selects runtimes, agents and skills, previews the plan, then asks before
writing. Recommended selects Claude Code, all 248 installable skills and Fellowship agents.
The shared `AGENTS.md` core installs with every plan. Other runtimes install only when selected.

Existing config v1 projects must [migrate to config v2](config-v2.md) before init or sync:

```bash
sauron upgrade --dry-run
sauron upgrade
sauron sync --dry-run
sauron sync
```

## Verify and maintain

```bash
sauron status
sauron list-installed
sauron doctor
sauron list-skills
```

Status reports the 20 available adapters and 248 installable skills across nine departments.
Availability does not mean every runtime is installed or verified in its real tool.
Read the [support tiers](../04-runtime-adapters/runtime-tiers.md).

Changed managed files receive backups or remain preserved, depending on the file type.
See [install lifecycle](install-lifecycle.md) for repair and preview-first uninstall.
See [CLI reference](cli-reference.md), [skill picker](skill-picker.md), and
[profiles and plugin](profiles-and-plugin.md) for configuration options.
