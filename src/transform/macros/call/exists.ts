import ansi from "ansi-colors";
import fs from "fs";
import path from "path";
import ts, { factory } from "typescript";

import { CallMacro } from ".";
import { TransformContext } from "../../../context";
import { Log } from "../../../logging";
import { Diagnostics, throwWithDiagnostic } from "../../utils/diagnostics";
import { getLiteralStringLike } from "../../utils/getLiteralString";

function inner(
  ctx: TransformContext,
  node: ts.CallExpression,
  kind: "dir" | "any" | "file",
) {
  let pathArg = getLiteralStringLike(ctx, node.arguments[0]);
  if (pathArg === undefined) {
    switch (kind) {
      case "any":
        throwWithDiagnostic(Diagnostics.EXPECTED_PATH.ANY(node));
      case "dir":
        throwWithDiagnostic(Diagnostics.EXPECTED_PATH.DIRECTORY(node));
      case "file":
        throwWithDiagnostic(Diagnostics.EXPECTED_PATH.FILE(node));
      default:
        throw new Error("TODO: Handle invalid kind");
    }
  }

  // resolving path, its root is from the source file
  pathArg = path.join(node.getSourceFile().resolvedPath, pathArg);
  if (Log.canLog(Log.Level.Debug)) {
    Log.trace(
      `Checking for path: ${ansi.bold(path.relative(ctx.projectDir, pathArg))}`,
    );
  }

  let result = false;
  switch (kind) {
    case "any":
      result = fs.existsSync(pathArg);
      break;
    default:
      if (fs.existsSync(pathArg)) {
        const stat = fs.statSync(pathArg);
        if (stat.isFile()) {
          result = kind === "file";
        } else if (stat.isDirectory()) {
          result = kind === "dir";
        }
      }
      break;
  }
  return result ? factory.createTrue() : factory.createFalse();
}

export const transformCallMacroPathExists: CallMacro = (ctx, node) => {
  return inner(ctx, node, "any");
};

export const transformCallMacroFileExists: CallMacro = (ctx, node) => {
  return inner(ctx, node, "file");
};

export const transformCallMacroDirExists: CallMacro = (ctx, node) => {
  return inner(ctx, node, "dir");
};
