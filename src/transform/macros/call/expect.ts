import ansi from "ansi-colors";
import fs from "fs";
import path from "path";
import ts from "typescript";

import { CallMacro } from ".";
import { TransformContext } from "../../../context";
import { Log } from "../../../logging";
import { Diagnostics, throwWithDiagnostic } from "../../utils/diagnostics";
import { getLiteralStringLike } from "../../utils/getLiteralString";
import { isUndefinedOrNull } from "../../utils/isUndefinedOrNull";

function existsInner(
  ctx: TransformContext,
  node: ts.CallExpression,
  kind: "dir" | "any" | "file",
): [boolean, string?] {
  // check that it is not a value like smth
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

  if (
    node.arguments[1] !== undefined ||
    !isUndefinedOrNull(ctx, node.arguments[1])
  ) {
    const errMsg = getLiteralStringLike(ctx, node.arguments[1]);
    if (errMsg === undefined) {
      throwWithDiagnostic(
        Diagnostics.CALL_MACROS.EXPECT_BASE_INVALID_ERR_MESSAGE(node),
      );
    }
    return [result, errMsg];
  } else {
    return [result, undefined];
  }
}

export const transformCallMacroExpectPath: CallMacro = (ctx, node) => {
  const [exists, msg] = existsInner(ctx, node, "any");
  if (!exists) {
    ctx.addDiagnostic(Diagnostics.CALL_MACROS.EXPECT_PATH_ERR(node, msg));
    return node;
  }
  return undefined as unknown as ts.Expression;
};

export const transformCallMacroExpectFile: CallMacro = (ctx, node) => {
  const [exists, msg] = existsInner(ctx, node, "any");
  if (!exists) {
    ctx.addDiagnostic(Diagnostics.CALL_MACROS.EXPECT_FILE_ERR(node, msg));
    return node;
  }
  return undefined as unknown as ts.Expression;
};

export const transformCallMacroExpectDir: CallMacro = (ctx, node) => {
  const [exists, msg] = existsInner(ctx, node, "any");
  if (!exists) {
    ctx.addDiagnostic(Diagnostics.CALL_MACROS.EXPECT_DIR_ERR(node, msg));
    return node;
  }
  return undefined as unknown as ts.Expression;
};
