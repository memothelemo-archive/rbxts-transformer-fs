import fs from "fs";
import path from "path";
import ts from "typescript";
import { assert } from "./assert";

export interface RbxTsCmdLine {
  projectDir: string;
  manualRojoPath?: string;
  tsConfigPath: string;
  // verbose: boolean;
}

function findConfigFromDir(dir: string) {
  let resolvedDir: string | undefined = path.resolve(dir);
  if (!fs.existsSync(resolvedDir) || !fs.statSync(resolvedDir).isFile()) {
    resolvedDir = ts.findConfigFile(resolvedDir, ts.sys.fileExists);
  }
  if (resolvedDir !== undefined) {
    resolvedDir = path.resolve(process.cwd(), resolvedDir);
  }
  return resolvedDir;
}

// We tried to make it crash free as possible :)
export function getRbxtsCommandLine() {
  const cmdline = {} as RbxTsCmdLine;
  const projectIdx = process.argv.findIndex(
    x => x === "-p" || x === "--project",
  );

  const projectDir = projectIdx !== -1 ? process.argv[projectIdx + 1] : ".";
  const rojoProjectPathIdx = process.argv.findIndex(x => x === "--rojo");

  // projectDir may be a null value, but typescript says it is a string type.
  // you cannot guarantee indexing any number of array exists
  assert(projectDir);

  const resolvedTsConfigPath = findConfigFromDir(projectDir);
  if (resolvedTsConfigPath === undefined) {
    return undefined;
  }

  cmdline.projectDir = path.resolve(projectDir);
  cmdline.tsConfigPath = resolvedTsConfigPath;

  if (rojoProjectPathIdx !== -1) {
    const resolved = process.argv[rojoProjectPathIdx + 1];
    assert(resolved);

    cmdline.manualRojoPath = resolved;
  }

  return cmdline;
}
