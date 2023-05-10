import ansi from "ansi-colors";
import fs from "fs";
import path from "path";
import ts from "typescript";
import { factory } from "typescript";

import { CallMacro } from ".";
import { TransformContext } from "../../../context";
import { Log } from "../../../logging";
import { Diagnostics, throwWithDiagnostic } from "../../utils/diagnostics";
import { getPathFromArgument } from "../../utils/getPathFromArg";

function inner(ctx: TransformContext, node: ts.CallExpression) {
  const pathArg = getPathFromArgument(ctx, node, node.arguments.at(0));
  if (pathArg === undefined) {
    throwWithDiagnostic(Diagnostics.EXPECTED_PATH.FILE(node));
  }

  if (Log.canLog(Log.Level.Debug)) {
    Log.trace(
      `Attempting to read file from ${ansi.bold(
        path.relative(ctx.projectDir, pathArg),
      )}`,
    );
  }

  if (fs.existsSync(pathArg)) {
    const stat = fs.statSync(pathArg);
    if (stat.isFile()) {
      return factory.createStringLiteral(fs.readFileSync(pathArg).toString());
    } else {
      throwWithDiagnostic(Diagnostics.IS_A_DIRECTORY(node));
    }
  }
}

export const transformCallMacroReadOptional: CallMacro = (ctx, node) => {
  return inner(ctx, node) ?? factory.createIdentifier("undefined");
};

export const transformCallMacroRead: CallMacro = (ctx, node) => {
  const data = inner(ctx, node);
  if (data === undefined) {
    throwWithDiagnostic(Diagnostics.NOT_FOUND.FILE(node));
  }
  return data;
};
