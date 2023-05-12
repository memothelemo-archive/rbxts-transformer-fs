import fs from "fs";
import path from "path";
import ts from "typescript";

import { assert } from "../core/utils/assert";

export interface RbxtsCommandLine {
  readonly projectDir: string;
  readonly setRojoConfigFilePath?: string;
  readonly tsConfigPath: string;
}

type Writable<T extends object> = {
  -readonly [K in keyof T]: T[K];
};

function findTSConfigFromDir(dir: string) {
  let resolved_dir: string | undefined = path.resolve(dir);
  if (!fs.existsSync(resolved_dir) || !fs.statSync(resolved_dir).isFile()) {
    resolved_dir = ts.findConfigFile(resolved_dir, ts.sys.fileExists);
  }
  if (resolved_dir !== undefined) {
    resolved_dir = path.resolve(process.cwd(), resolved_dir);
  }
  return resolved_dir;
}

export function getRbxtsCmdLine() {
  const cmdLine = {} as Writable<RbxtsCommandLine>;

  const projectIdx = process.argv.findIndex(x => x === "-p" || x === "--project");
  const projectDir = projectIdx !== -1 ? process.argv[projectIdx + 1] : ".";

  // projectDir may be a null value, but typescript says it is a string type.
  // you cannot guarantee indexing any number of array exists
  assert(projectDir);

  const resolvedTSConfigPath = findTSConfigFromDir(projectDir);
  assert(resolvedTSConfigPath);

  const rojoProjectPathIdx = process.argv.findIndex(x => x === "--rojo");
  if (rojoProjectPathIdx !== -1) {
    const resolved = process.argv[rojoProjectPathIdx + 1];
    assert(resolved);

    cmdLine.setRojoConfigFilePath = resolved;
  }

  cmdLine.projectDir = path.resolve(projectDir);
  cmdLine.tsConfigPath = resolvedTSConfigPath;

  return cmdLine as RbxtsCommandLine;
}
