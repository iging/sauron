/** Resolve bundled assets independently of the user's working directory. */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { isSea } from "node:sea";

export function resolveSauronRoot(
  moduleUrl: string,
  options: { sea?: boolean; executablePath?: string } = {},
): string {
  const root =
    (options.sea ?? isSea())
      ? path.dirname(
          fs.realpathSync(options.executablePath ?? process.execPath),
        )
      : path.resolve(path.dirname(fileURLToPath(moduleUrl)), "..");
  const metadata: unknown = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );

  if (
    !metadata ||
    typeof metadata !== "object" ||
    !("name" in metadata) ||
    metadata.name !== "sauron-ai"
  )
    throw new Error(
      "Sauron assets are missing beside the executable or npm entry point.",
    );

  return root;
}
