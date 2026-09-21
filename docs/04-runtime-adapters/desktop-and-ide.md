# Desktop & IDE Runtime Adapters

This guide details how Sauron configures and manages rules for desktop IDE environments.

---

## 1. Cursor

- **Generated Files**:
  - `.cursorrules`: Root instruction file loaded automatically on every prompt.
  - `.cursor/rules/sauron.mdc`: Advanced rules file with frontmatter metadata.
- **Features Handled**:
  - Automatically maps project rules, banned patterns, and file scope boundaries.
  - Provides direct slash command triggers for Fellowship agents.

---

## 2. Windsurf

- **Generated Files**:
  - `.windsurfrules`: Global project instruction document.
- **Features Handled**:
  - Informs the Cascade agent of project architecture, language standards, and tool execution boundaries.

---

## 3. Trae

- **Generated Files**:
  - `.traerules`: Project configuration file.
- **Features Handled**:
  - Configures the Trae coding assistant with Fellowship roles and testing protocols.

---

## 4. Zed

- **Generated Files**:
  - `.zed/settings.json`: Editor configuration enforcing strict assistant defaults.
  - `.zed/prompts/sauron.md`: Contextual prompt template accessible within Zed's Assistant Panel.
- **Features Handled**:
  - Formats instructions cleanly for Zed's native AI panel.

---

## 5. Visual Studio Code

- **Generated Files**:
  - `.vscode/settings.json`: Workspace recommendations and editor preferences.
  - `.vscode/sauron.instructions.md`: Structured instruction file for VS Code language models and extensions.

---

## 6. Kiro

- **Generated Files**:
  - `.kirorules`: Specification file defining behavioral guidelines and security constraints.
