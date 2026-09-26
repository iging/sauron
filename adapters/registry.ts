/**
 * @fileoverview Governed capability registry with evaluation gate.
 * Provides publication gate, pinning, drift detection, and static export.
 * Research trace: agentcaps publication gate, metahub Assay eval, agentskills semver.
 */

/**
 * Registry entry draft awaiting review.
 */
export interface RegistryEntry {
  /** Unique slug identifier. */
  slug: string;
  /** Skill name served to agents. */
  name: string;
  /** One-line description. */
  description: string;
  /** Source repository URL. */
  source: string;
  /** Pinned commit SHA. */
  commit: string;
  /** Content digest. */
  digest: string;
  /** Semantic version. */
  version: string;
  /** Publication status. */
  status: "draft" | "published" | "revoked";
  /** Completeness score from 0 to 100. */
  score: number;
}

/**
 * Static catalog export consumed by agents.
 */
export interface AgentCatalog {
  /** Catalog schema version. */
  specVersion: string;
  /** Export timestamp. */
  exportedAt: string;
  /** Published entries only. */
  entries: RegistryEntry[];
}

/**
 * Validates a registry entry with fail-closed rules.
 *
 * @param raw - Unknown input.
 * @returns Validated registry entry.
 * @throws Error when entry violates schema.
 */
export function validateEntry(raw: unknown): RegistryEntry {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Registry entry must be an object");
  }
  const record = raw as Record<string, unknown>;
  const slug = record["slug"];
  const name = record["name"];
  const description = record["description"];
  const source = record["source"];
  const commit = record["commit"];
  const digest = record["digest"];
  const version = record["version"];
  const status = record["status"];
  const score = record["score"];
  if (
    typeof slug !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof source !== "string" ||
    typeof commit !== "string" ||
    typeof digest !== "string" ||
    typeof version !== "string" ||
    (status !== "draft" && status !== "published" && status !== "revoked") ||
    typeof score !== "number"
  ) {
    throw new Error("Malformed registry entry");
  }
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(slug)) {
    throw new Error(`Invalid registry slug: ${slug}`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Invalid registry version: ${version}`);
  }
  if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
    throw new Error(`Invalid commit SHA: ${commit}`);
  }
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new Error("Registry score must be an integer from 0 to 100");
  }
  return {
    slug,
    name,
    description,
    source,
    commit,
    digest,
    version,
    status,
    score,
  };
}

/**
 * Computes a completeness score from entry metadata quality.
 *
 * @param entry - Entry without score.
 * @returns Score from 0 to 100.
 */
export function computeCompletenessScore(
  entry: Omit<RegistryEntry, "score" | "status"> & { status?: string },
): number {
  let score = 0;
  if (entry.description.trim().length >= 20) {
    score += 30;
  } else if (entry.description.trim().length > 0) {
    score += 10;
  }
  if (/^https:\/\//.test(entry.source)) {
    score += 20;
  }
  if (/^\d+\.\d+\.\d+$/.test(entry.version)) {
    score += 20;
  }
  if (entry.digest.startsWith("sha256:") && entry.digest.length > 20) {
    score += 15;
  }
  if (/^[0-9a-f]{7,40}$/i.test(entry.commit)) {
    score += 15;
  }
  return score;
}

/**
 * Publishes a draft entry when quality gate passes.
 *
 * @param entry - Draft entry.
 * @param minimumScore - Minimum completeness score required.
 * @returns Published entry.
 * @throws Error when gate fails.
 */
export function publishEntry(
  entry: RegistryEntry,
  minimumScore = 70,
): RegistryEntry {
  if (entry.status !== "draft") {
    throw new Error(`Only draft entries publish, found ${entry.status}`);
  }
  if (entry.score < minimumScore) {
    throw new Error(
      `Quality gate blocks publish: score ${entry.score} below ${minimumScore}`,
    );
  }
  return { ...entry, status: "published" };
}

/**
 * Detects source drift between published pin and latest upstream state.
 *
 * @param published - Published entry pin.
 * @param latestCommit - Latest upstream commit SHA.
 * @param latestDigest - Latest upstream content digest.
 * @returns True when drift exists.
 */
export function detectsDrift(
  published: RegistryEntry,
  latestCommit: string,
  latestDigest: string,
): boolean {
  return published.commit !== latestCommit || published.digest !== latestDigest;
}

/**
 * Builds a static catalog containing published entries only.
 * Excludes drifted entries when caller supplies drifted slugs.
 *
 * @param entries - All registry entries.
 * @param driftedSlugs - Slugs with known drift to exclude.
 * @returns Agent catalog export.
 */
export function buildCatalog(
  entries: RegistryEntry[],
  driftedSlugs: string[] = [],
): AgentCatalog {
  const drifted = new Set(driftedSlugs);
  const published = entries
    .filter((entry) => entry.status === "published" && !drifted.has(entry.slug))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return {
    specVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    entries: published,
  };
}
