/// <reference types="node" />
/** @fileoverview Static agent-config review rules. Never evaluate or return source values. */
import { parseDocument } from "yaml";
import type { SinkFinding } from "./slopsquat.js";

export interface ScanIssue {
  file: string;
  code: string;
  message: string;
}

export interface FileAnalysis {
  findings: SinkFinding[];
  issues: ScanIssue[];
  heuristic: boolean;
}

/** Comments and trailing commas are removed only outside JSON strings. */
function jsonText(text: string): string {
  return text
    .replace(
      /("(?:\\.|[^"\\])*")|\/\/[^\n\r]*|\/\*[\s\S]*?\*\//g,
      (match, quoted: string | undefined) =>
        quoted ?? match.replace(/[^\r\n]/g, " "),
    )
    .replace(
      /("(?:\\.|[^"\\])*")|,(\s*[}\]])/g,
      (match, quoted: string | undefined, closing: string | undefined) =>
        quoted ?? closing ?? match,
    );
}

/** Returns static review hints, never snippets, values, endpoints, or parser exception text. */
export function analyzeAgentFile(file: string, source: string): FileAnalysis {
  const findings: SinkFinding[] = [];
  const issues: ScanIssue[] = [];
  const add = (
    rule: string,
    severity: SinkFinding["severity"],
    message: string,
    line = 1,
  ) => {
    if (!findings.some((item) => item.rule === rule && item.line === line))
      findings.push({ file, line, rule, severity, message });
  };
  const problem = () => {
    if (!issues.length)
      issues.push({
        file,
        code: "scan-parse",
        message:
          "Selected configuration cannot be fully parsed within supported limits.",
      });
  };
  const command = (value: string, line = 1) => {
    if (
      /\b(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm)\b[\s\S]{0,400}\|\s*(?:bash|sh|pwsh|powershell|iex|Invoke-Expression)\b/i.test(
        value,
      )
    )
      add(
        "hook-remote-exec",
        "error",
        "Remote content is piped into an interpreter. Review and pin local code before execution.",
        line,
      );
    if (
      /--dangerously-(?:skip-permissions|bypass-approvals-and-sandbox)\b/.test(
        value,
      )
    )
      add(
        "permission-bypass",
        "error",
        "A command requests permission or sandbox bypass. Review isolation and approval controls.",
        line,
      );
    if (/\b(?:eval\s+|Invoke-Expression\s+)/i.test(value))
      add(
        "hook-dynamic-eval",
        "warning",
        "Dynamic shell evaluation needs manual input and trust review.",
        line,
      );
  };
  const prompt = (value: string, line: number) => {
    if (
      /^\s*(?:[-*]\s*)?(?:ignore|disregard)\s+(?:all\s+)?(?:previous|prior|system|developer)\s+(?:instructions|messages|rules)\b/i.test(
        value,
      )
    )
      add(
        "prompt-override",
        "warning",
        "Instruction text requests overriding earlier instructions. Review its authority and intent.",
        line,
      );
    if (
      /^\s*(?:[-*]\s*)?(?:send|upload|post|exfiltrate)\s+(?:(?:all|the|your)\s+)?(?:secrets|credentials|api\s+keys|environment\s+variables)\b/i.test(
        value,
      )
    )
      add(
        "prompt-secret-export",
        "error",
        "Instruction text requests exporting sensitive data. Remove or explicitly constrain that instruction.",
        line,
      );
  };
  const literal = (value: unknown): value is string =>
    typeof value === "string" &&
    value.trim() !== "" &&
    !/^(?:(?:Bearer|Basic)\s+)?(?:\$\{[^}]+\}|\$[A-Z_][A-Z0-9_]*|%[^%]+%|<[^>]+>|your[-_ ].*|example)$/i.test(
      value.trim(),
    );
  const secretKey = (key: string) =>
    /token|password|secret|api[_-]?key|authorization/i.test(key);
  const endpoint = (value: string, line = 1) => {
    try {
      const url = new URL(value);

      if (url.username || url.password)
        add(
          "mcp-inline-secret",
          "error",
          "MCP configuration contains inline credentials. Use an environment or secret reference.",
          line,
        );
      if (
        url.protocol === "http:" &&
        !["localhost", "127.0.0.1", "[::1]"].includes(
          url.hostname.toLowerCase(),
        )
      )
        add(
          "mcp-cleartext",
          "warning",
          "A non-loopback MCP endpoint uses cleartext HTTP. Review transport and endpoint trust.",
          line,
        );
    } catch {
      return;
    }
  };
  let nodes = 0;
  const seen = new WeakSet<object>();
  const walk = (node: unknown, context: string, depth = 0): void => {
    if (++nodes > 10000 || depth > 32) {
      problem();

      return;
    }
    if (!node || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const child of node) walk(child, context, depth + 1);

      return;
    }

    const record = node as Record<string, unknown>;

    if (
      context === "mcp" &&
      typeof record.command === "string" &&
      /(?:^|[\\/])npx(?:\.cmd|\.exe)?$/i.test(record.command)
    ) {
      const args = record.args;

      if (Array.isArray(args)) {
        const packages = args.filter(
          (arg): arg is string =>
            typeof arg === "string" && !arg.startsWith("-"),
        );

        if (packages.some((arg) => !/@v?\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(arg)))
          add(
            "mcp-floating-package",
            "warning",
            "An npx MCP package is not pinned to an exact version. Review supply-chain trust.",
          );
      }
    }
    for (const [key, value] of Object.entries(record)) {
      const lower = key.toLowerCase();
      const next = ["mcpservers", "mcp_servers", "servers"].includes(lower)
        ? "mcp"
        : lower === "hooks"
          ? "hook"
          : context;

      if (
        (lower === "sandbox_mode" && value === "danger-full-access") ||
        (lower === "default_permissions" && value === ":danger-full-access") ||
        (["defaultmode", "permissionmode"].includes(lower) &&
          value === "bypassPermissions")
      )
        add(
          "permission-bypass",
          "error",
          "Unrestricted sandbox or permission bypass is declared. Review activation, isolation, and approvals.",
        );
      if (lower === "approval_policy" && value === "never")
        add(
          "approval-disabled",
          "warning",
          "Approval prompts are disabled. Review unattended execution and host isolation.",
        );
      if (
        (lower === "allow" &&
          Array.isArray(value) &&
          value.some(
            (item) =>
              typeof item === "string" &&
              /^(?:\*|Bash(?:\((?::?\*)?\))?|PowerShell(?:\(\*\))?)$/i.test(
                item,
              ),
          )) ||
        (lower === "permission" && value === "allow") ||
        (context === "permission" &&
          ["*", "bash", "shell", "edit"].includes(lower) &&
          value === "allow") ||
        (record.effect === "allow" &&
          record.resource === "*" &&
          ["shell", "edit"].includes(String(record.action)))
      )
        add(
          "broad-tool-allow",
          "error",
          "A broad shell or write allow rule is declared. Review scope and rule precedence.",
        );
      if (
        ["permissiondecision", "decision"].includes(lower) &&
        ["allow", "approve"].includes(String(value))
      )
        add(
          "hook-approval",
          "warning",
          "A hook approval declaration needs review of its conditions and scope.",
        );
      if (next === "mcp") {
        if (lower === "url" && typeof value === "string") endpoint(value);
        if (lower === "command" && typeof value === "string") command(value);
        if (lower === "args" && Array.isArray(value))
          command(value.filter((item) => typeof item === "string").join(" "));
        if (secretKey(key) && literal(value))
          add(
            "mcp-inline-secret",
            "error",
            "MCP configuration contains inline credentials. Use an environment or secret reference.",
          );
      }
      if (
        next === "hook" &&
        ["command", "bash", "powershell"].includes(lower) &&
        typeof value === "string"
      )
        command(value);
      walk(
        value,
        lower === "permission" || lower === "permissions" ? "permission" : next,
        depth + 1,
      );
    }
  };
  const yaml = (text: string): unknown => {
    const doc = parseDocument(text, {
      prettyErrors: false,
      logLevel: "silent",
      uniqueKeys: true,
    });

    if (doc.errors.length || doc.warnings.length)
      throw new Error("Unsupported YAML");

    return doc.toJS({ maxAliasCount: 50 }) as unknown;
  };
  const extension = file.split(".").pop()?.toLowerCase();
  const heuristic = extension === "toml";

  if (
    extension === "json" ||
    extension === "jsonc" ||
    extension === "yaml" ||
    extension === "yml"
  ) {
    try {
      walk(
        extension === "json" || extension === "jsonc"
          ? JSON.parse(jsonText(source))
          : yaml(source),
        "",
      );
    } catch {
      problem();
    }
  } else {
    if (/^---\r?\n/.test(source)) {
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
      try {
        if (!frontmatter) throw new Error("Unclosed frontmatter");
        walk(yaml(frontmatter[1] ?? ""), "");
      } catch {
        problem();
      }
    }

    let multiline = "";
    let section = "";
    source.split(/\r?\n/).forEach((line, index) => {
      if (/^\s*(?:#|\/\/|>)/.test(line)) return;
      prompt(line, index + 1);
      if (!heuristic && !["md", "mdc"].includes(extension ?? ""))
        command(line, index + 1);
      if (!heuristic) return;
      if (multiline) {
        if (line.includes(multiline)) multiline = "";

        return;
      }

      const triple = /=\s*("{3}|'{3})/.exec(line)?.[1];

      if (triple) {
        if (line.split(triple).length < 3) multiline = triple;

        return;
      }

      const table = /^\s*\[([^\]]+)\]\s*(?:#.*)?$/.exec(line);

      if (table) {
        section = table[1] ?? "";

        return;
      }
      if (
        /^\s*(?:sandbox_mode|default_permissions)\s*=\s*["']:?danger-full-access["']\s*(?:#.*)?$/.test(
          line,
        )
      )
        add(
          "permission-bypass",
          "error",
          "Unrestricted sandbox access is declared. Review activation and isolation.",
          index + 1,
        );
      if (/^\s*approval_policy\s*=\s*["']never["']\s*(?:#.*)?$/.test(line))
        add(
          "approval-disabled",
          "warning",
          "Approval prompts are disabled. Review unattended execution and host isolation.",
          index + 1,
        );

      const scalar =
        /^\s*([\w-]+)\s*=\s*("(?:\\.|[^"\\])*"|'[^']*')\s*(?:#.*)?$/.exec(line);

      if (!scalar) return;

      let value: string;
      try {
        value = scalar[2]?.startsWith('"')
          ? (JSON.parse(scalar[2]) as string)
          : (scalar[2] ?? "").slice(1, -1);
      } catch {
        return;
      }
      if (scalar[1] === "developer_instructions")
        value.split(/\r?\n/).forEach((text) => prompt(text, index + 1));
      if (section.startsWith("mcp_servers.")) {
        if (scalar[1] === "url") endpoint(value, index + 1);
        if (secretKey(scalar[1] ?? "") && literal(value))
          add(
            "mcp-inline-secret",
            "error",
            "MCP configuration contains inline credentials. Use an environment or secret reference.",
            index + 1,
          );
      }
    });
  }

  return { findings, issues, heuristic };
}
