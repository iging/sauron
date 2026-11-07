/** Shared per-skill picker flow for terminal and numbered user interfaces. */
import { InitPlanError, type InitPlan } from "./init-plan.js";
import { listSkillChoices, type SkillChoice } from "./installer.js";

export class SkillPickerCancelled extends Error {}

export interface SkillPickerUI {
  departments(
    available: readonly string[],
    initial: readonly string[],
  ): Promise<string[]>;
  skills(
    department: string,
    options: readonly SkillChoice[],
    initial: readonly string[],
  ): Promise<string[] | "back">;
  action(): Promise<"another" | "done" | "back">;
}

function checked(
  values: readonly string[],
  available: readonly string[],
): string[] {
  const unknown = values.filter((value) => !available.includes(value));
  if (unknown.length)
    throw new InitPlanError(`Unknown picker selection: ${unknown.join(", ")}`);
  return [...new Set(values)];
}

/** Numbered input also accepts exact ids, all, or none. Navigation stays in the UI. */
export function parsePickerValues(
  input: string,
  available: readonly string[],
): string[] {
  const raw = input.trim().toLowerCase();
  if (raw === "all") return [...available];
  if (raw === "none") return [];
  const values = raw.split(",").map((value) => value.trim());
  if (values.some((value) => !value))
    throw new InitPlanError("Choose numbers or ids, all, or none.");
  return checked(
    values.map((value) =>
      /^\d+$/.test(value) ? (available[Number(value) - 1] ?? value) : value,
    ),
    available,
  );
}

/** Keep choices in memory until the caller's final write confirmation. */
export async function pickSkills(
  sauronRoot: string,
  departments: readonly string[],
  initial: InitPlan["skills"],
  ui: SkillPickerUI,
): Promise<InitPlan["skills"]> {
  const selections = new Map<string, "all" | string[]>();
  if (Array.isArray(initial)) {
    for (const item of initial) {
      const department = item.split("/")[0] ?? "";
      checked([department], departments);
      if (!item.includes("/")) selections.set(department, "all");
      else if (selections.get(department) !== "all") {
        const existing = selections.get(department);
        selections.set(department, [
          ...(Array.isArray(existing) ? existing : []),
          item,
        ]);
      }
    }
  }
  // Choosing Pick from all starts with no departments, then checks each fresh department fully.
  let selectedDepartments = [...selections.keys()];
  for (;;) {
    selectedDepartments = checked(
      await ui.departments(departments, selectedDepartments),
      departments,
    );
    for (const department of [...selections.keys()]) {
      if (!selectedDepartments.includes(department))
        selections.delete(department);
    }
    let back = false;
    for (const department of selectedDepartments) {
      const options = listSkillChoices(sauronRoot, [department]);
      const available = options.map((option) => option.value);
      const previous = selections.get(department);
      const defaults =
        previous === undefined || previous === "all"
          ? available
          : checked(previous, available);
      const picked = await ui.skills(department, options, defaults);
      if (picked === "back") {
        back = true;
        break;
      }
      selections.set(department, checked(picked, available));
    }
    if (back) continue;
    const action = await ui.action();
    if (action === "another" || action === "back") continue;
    if (action !== "done") throw new InitPlanError("Unknown picker action.");
    const result = selectedDepartments.flatMap((department) => {
      const values = selections.get(department);
      if (!Array.isArray(values))
        throw new InitPlanError(
          "Finish the selected department before continuing.",
        );
      return values;
    });
    return result.length ? [...new Set(result)] : "none";
  }
}
