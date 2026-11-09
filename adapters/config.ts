/** Versioned configuration parsing, validation, and reversible migration. */
import * as fs from "node:fs";
import * as path from "node:path";
import { parseDocument } from "yaml";
import {
  RUNTIME_IDS,
  parseCaveman,
  planFromConfig,
  resolvePlan,
  type InitPlan,
} from "./init-plan.js";
import { listDepartments, listSkills } from "./installer.js";

export class ConfigError extends Error {}

export type ConfigVersion = "1.0.0" | "2.0.0";

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function document(raw: string) {
  const doc = parseDocument(raw);

  if (doc.errors.length || doc.warnings.length) {
    throw new ConfigError(
      "Invalid YAML configuration: " +
        [...doc.errors, ...doc.warnings]
          .map((error) => error.message)
          .join(" "),
    );
  }

  const value: unknown = doc.toJS({ maxAliasCount: 100 });

  if (!record(value)) throw new ConfigError("Configuration must be a mapping.");

  return doc;
}

/** Parse a mapping with bounded YAML aliases and surface parse failures. */
export function parseConfig(raw: string): Record<string, unknown> {
  const value: unknown = document(raw).toJS({ maxAliasCount: 100 });

  if (!record(value)) throw new ConfigError("Configuration must be a mapping.");

  return value;
}

/** Keep missing versions compatible with v1 while rejecting unsupported versions. */
export function configVersion(config: Record<string, unknown>): ConfigVersion {
  const version = config["version"];

  if (version === undefined || version === "1.0.0") return "1.0.0";
  if (version === "2.0.0") return "2.0.0";
  throw new ConfigError(`Unsupported config version: ${String(version)}`);
}

/** Validate the keyword subset used by the bundled schema, without new dependencies. */
function check(value: unknown, rule: unknown, location: string): void {
  if (rule === false)
    throw new ConfigError(`${location} is not allowed in this version.`);
  if (rule === true) return;
  if (!record(rule)) throw new ConfigError("Invalid bundled schema.");
  if (Array.isArray(rule["oneOf"])) {
    let matches = 0;
    const errors: string[] = [];

    for (const option of rule["oneOf"]) {
      try {
        check(value, option, location);
        matches += 1;
      } catch (error) {
        if (!(error instanceof ConfigError)) throw error;
        errors.push(error.message);
      }
    }
    if (matches !== 1)
      throw new ConfigError(
        `${location} must match one schema alternative. ${errors.join(" ")}`,
      );
  }
  if ("const" in rule && value !== rule["const"])
    throw new ConfigError(`${location} has the wrong version.`);
  if (Array.isArray(rule["enum"]) && !rule["enum"].includes(value))
    throw new ConfigError(`${location} has an unsupported value.`);

  const type = rule["type"];

  if (
    (type === "object" && !record(value)) ||
    (type === "array" && !Array.isArray(value)) ||
    (type === "string" && typeof value !== "string") ||
    (type === "boolean" && typeof value !== "boolean") ||
    (type === "integer" &&
      (typeof value !== "number" || !Number.isInteger(value)))
  ) {
    throw new ConfigError(`${location} must be ${String(type)}.`);
  }
  if (
    typeof value === "string" &&
    typeof rule["pattern"] === "string" &&
    !new RegExp(rule["pattern"]).test(value)
  ) {
    throw new ConfigError(`${location} has an invalid selection format.`);
  }
  if (Array.isArray(value)) {
    if (typeof rule["minItems"] === "number" && value.length < rule["minItems"])
      throw new ConfigError(`${location} is empty.`);
    if (
      rule["uniqueItems"] === true &&
      new Set(value.map((item) => JSON.stringify(item))).size !== value.length
    ) {
      throw new ConfigError(`${location} contains duplicates.`);
    }
    value.forEach((item, index) => {
      if (rule["items"]) check(item, rule["items"], `${location}[${index}]`);
    });
  }
  if (record(value)) {
    if (Array.isArray(rule["required"])) {
      for (const key of rule["required"]) {
        if (typeof key === "string" && !(key in value))
          throw new ConfigError(`${location}.${key} is required.`);
      }
    }

    const properties = record(rule["properties"]) ? rule["properties"] : {};

    for (const [key, child] of Object.entries(value)) {
      if (key in properties)
        check(child, properties[key], `${location}.${key}`);
      else if (rule["additionalProperties"] === false)
        throw new ConfigError(`${location}.${key} is unknown.`);
      else if (record(rule["additionalProperties"]))
        check(child, rule["additionalProperties"], `${location}.${key}`);
    }
  }
}

/** Validate against the bundled schema subset before resolving installation choices. */
export function validateConfig(
  config: Record<string, unknown>,
  sauronRoot: string,
): void {
  const schema: unknown = JSON.parse(
    fs.readFileSync(
      path.join(sauronRoot, "config/schema/sauron.schema.json"),
      "utf8",
    ),
  );
  check(config, schema, "config");
}

/** Resolve a validated configuration into the same plan used by interactive init. */
export function configPlan(
  config: Record<string, unknown>,
  sauronRoot: string,
): InitPlan {
  if (configVersion(config) !== "2.0.0")
    throw new ConfigError(
      "Config v1 requires migration. Run sauron upgrade before init or sync.",
    );
  validateConfig(config, sauronRoot);
  const departments = listDepartments(sauronRoot);
  const selectors = listSkills(sauronRoot, departments).map(
    (skill) => `${skill.department}/${skill.name}`,
  );
  const plan = planFromConfig(config, departments, selectors);

  if (!plan)
    throw new ConfigError("Configuration does not contain a valid plan.");

  return plan;
}

/** Rewrite owned choice fields while preserving unrelated YAML nodes and comments. */
export function configWithPlan(raw: string, plan: InitPlan): string {
  if (plan.runtimes.some((id) => !RUNTIME_IDS.includes(id))) {
    throw new ConfigError("Cannot save unknown runtime ids.");
  }

  const doc = document(raw);
  doc.set("version", "2.0.0");
  if (!doc.has("runtimes")) doc.set("runtimes", doc.createNode({}));
  for (const runtime of RUNTIME_IDS)
    doc.setIn(["runtimes", runtime], plan.runtimes.includes(runtime));
  doc.set("skills", plan.skills);
  if (!doc.has("init")) doc.set("init", doc.createNode({}));
  doc.deleteIn(["init", "runtimes"]);
  doc.deleteIn(["init", "skills"]);
  doc.setIn(["init", "agents"], plan.agents);
  doc.setIn(["init", "commands"], plan.commands);
  doc.setIn(["init", "nativeRuntimes"], plan.nativeRuntimes);
  if (!doc.has("caveman")) doc.set("caveman", doc.createNode({}));
  doc.setIn(["caveman", "default_mode"], plan.caveman);
  const text = doc.toString();

  return raw.includes("\r\n") ? text.replace(/\n/g, "\r\n") : text;
}

export interface ConfigMigration {
  from: ConfigVersion;
  to: ConfigVersion;
  content: string;
  changed: boolean;
  changes: string[];
}

/** Conversion itself performs no writes. The CLI backs and writes through ConflictManager. */
export function migrateConfig(
  raw: string,
  sauronRoot: string,
  workspaceName: string,
  target: ConfigVersion = "2.0.0",
): ConfigMigration {
  const config = parseConfig(raw);
  const from = configVersion(config);

  if (from === target) {
    if (target === "2.0.0") configPlan(config, sauronRoot);
    else validateConfig(config, sauronRoot);

    return { from, to: target, content: raw, changed: false, changes: [] };
  }

  let content: string;
  let changes: string[];

  if (target === "2.0.0") {
    const departments = listDepartments(sauronRoot);
    const selectors = listSkills(sauronRoot, departments).map(
      (skill) => `${skill.department}/${skill.name}`,
    );
    const normalized = {
      ...config,
      version: "1.0.0",
      project: config["project"] ?? { name: workspaceName },
      runtimes:
        config["runtimes"] ??
        Object.fromEntries(RUNTIME_IDS.map((id) => [id, true])),
    };
    validateConfig(normalized, sauronRoot);
    const legacy = config["init"];

    if (
      legacy !== undefined &&
      (!record(legacy) ||
        (legacy["runtimes"] !== undefined &&
          (!Array.isArray(legacy["runtimes"]) ||
            !legacy["runtimes"].every((id) => typeof id === "string"))) ||
        (legacy["skills"] !== undefined &&
          typeof legacy["skills"] !== "string" &&
          (!Array.isArray(legacy["skills"]) ||
            !legacy["skills"].every((id) => typeof id === "string"))) ||
        (legacy["commands"] !== undefined &&
          typeof legacy["commands"] !== "boolean"))
    ) {
      throw new ConfigError("Invalid legacy init choices.");
    }

    const saved = planFromConfig(legacy, departments, selectors);

    if (legacy !== undefined && !saved)
      throw new ConfigError("Invalid legacy init choices.");

    const toggles = config["runtimes"];

    if (
      toggles !== undefined &&
      (!record(toggles) ||
        Object.entries(toggles).some(
          ([id, enabled]) =>
            !RUNTIME_IDS.includes(id) || typeof enabled !== "boolean",
        ))
    ) {
      throw new ConfigError("Invalid legacy runtime toggles.");
    }

    const runtimes = record(toggles)
      ? Object.keys(toggles).filter((id) => toggles[id] === true)
      : [...RUNTIME_IDS];
    const caveman = config["caveman"];

    if (caveman !== undefined && !record(caveman))
      throw new ConfigError("Invalid caveman settings.");

    const mode =
      record(caveman) && caveman["default_mode"] !== undefined
        ? parseCaveman(String(caveman["default_mode"]))
        : "full";
    const plan = {
      ...(saved ??
        resolvePlan({
          runtimes,
          skills: "none",
          agents: "none",
          commands: false,
          nativeRuntimes: [],
        })),
      caveman: mode,
    };
    const doc = document(raw);

    if (!doc.has("project"))
      doc.set("project", doc.createNode({ name: workspaceName }));
    content = configWithPlan(doc.toString(), plan);
    configPlan(parseConfig(content), sauronRoot);
    changes = [
      saved
        ? "Preserve the saved runtime and install choices."
        : "Honor runtime toggles without adding skills or native assets.",
      "Move skill selection to the top-level skills field.",
      "Use runtimes as the active scaffold selection.",
    ];
  } else {
    const plan = configPlan(config, sauronRoot);

    if (plan.runtimes.length === 0)
      throw new ConfigError(
        "Config v1 cannot represent an empty runtime list.",
      );
    if (
      Array.isArray(plan.skills) &&
      plan.skills.some((skill) => skill.includes("/"))
    ) {
      throw new ConfigError(
        "Config v1 cannot represent individual skills. Select departments before downgrading.",
      );
    }

    const doc = document(raw);
    doc.set("version", "1.0.0");
    doc.delete("skills");
    doc.setIn(["init", "runtimes"], plan.runtimes);
    doc.setIn(["init", "skills"], plan.skills);
    doc.setIn(["init", "agents"], plan.agents);
    doc.setIn(["init", "commands"], plan.commands);
    doc.setIn(["init", "nativeRuntimes"], plan.nativeRuntimes);
    content = doc.toString();
    validateConfig(parseConfig(content), sauronRoot);
    changes = [
      "Restore legacy init runtime and department selections.",
      "Keep native-runtime opt-in and Caveman settings.",
    ];
  }
  if (raw.includes("\r\n")) content = content.replace(/\r?\n/g, "\r\n");

  return { from, to: target, content, changed: content !== raw, changes };
}
