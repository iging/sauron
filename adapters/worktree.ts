/**
 * @fileoverview Git worktree orchestration helpers with lane separation.
 * Enforces plan, execute, audit, and supervise lanes with isolated workspaces.
 * Research trace: amux orchestration patterns, git worktree isolation, merge queue.
 */

/**
 * Supported workflow lanes with distinct authority.
 */
export type WorktreeLane = "plan" | "execute" | "audit" | "supervise";

/**
 * Single worktree assignment for one agent.
 */
export interface WorktreeAssignment {
  /** Agent identifier. */
  agent: string;
  /** Lane assigned to the agent. */
  lane: WorktreeLane;
  /** Branch name for isolated work. */
  branch: string;
  /** Worktree directory path. */
  worktree: string;
  /** Task identifier claimed atomically. */
  task: string;
}

/**
 * Validates a branch name with fail-closed rules.
 *
 * @param branch - Branch name to validate.
 * @returns True when branch name respects policy.
 */
export function isValidBranchName(branch: string): boolean {
  if (branch === "main" || branch === "master") {
    return false;
  }
  return /^(feat|fix|refactor|chore|security)\/[a-z0-9][a-z0-9._-]*$/.test(
    branch,
  );
}

/**
 * Builds deterministic worktree assignments for a task list.
 * Rejects shared branches and enforces one task per agent.
 *
 * @param tasks - Task identifiers to assign.
 * @param agents - Agent identifiers available for work.
 * @param lane - Lane assigned to this batch.
 * @returns Worktree assignments.
 * @throws Error when tasks or agents violate policy.
 */
export function buildWorktreePlan(
  tasks: string[],
  agents: string[],
  lane: WorktreeLane,
): WorktreeAssignment[] {
  if (tasks.length === 0) {
    throw new Error("Task list must not be empty");
  }
  if (agents.length === 0) {
    throw new Error("Agent list must not be empty");
  }
  if (tasks.length > agents.length) {
    throw new Error("Task count exceeds available isolated agents");
  }
  const seenTasks = new Set<string>();
  const assignments: WorktreeAssignment[] = [];
  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
    const agent = agents[index];
    if (
      task === undefined ||
      agent === undefined ||
      task.trim() === "" ||
      agent.trim() === ""
    ) {
      throw new Error("Task and agent names must not be empty");
    }
    if (seenTasks.has(task)) {
      throw new Error(`Duplicate task claim detected: ${task}`);
    }
    seenTasks.add(task);
    const slug = task
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const branch = `feat/${slug}`;
    if (!isValidBranchName(branch)) {
      throw new Error(`Generated branch violates policy: ${branch}`);
    }
    assignments.push({
      agent,
      lane,
      branch,
      worktree: `.worktrees/${slug}`,
      task,
    });
  }
  return assignments;
}

/**
 * Formats worktree setup commands for operator review.
 *
 * @param assignments - Assignments to render.
 * @returns Multiline shell command text without destructive flags.
 */
export function formatWorktreeCommands(
  assignments: WorktreeAssignment[],
): string {
  const lines: string[] = [];
  for (const assignment of assignments) {
    lines.push(
      `git worktree add ${assignment.worktree} -b ${assignment.branch}`,
    );
    lines.push(
      `# lane=${assignment.lane} agent=${assignment.agent} task=${assignment.task}`,
    );
  }
  lines.push(
    "# Human review remains required before merge to main. No force push allowed.",
  );
  return lines.join("\n");
}
