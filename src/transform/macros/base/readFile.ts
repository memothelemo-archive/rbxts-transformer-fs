import ansi from "ansi-colors";
import fs from "fs";
import ts from "typescript";

import Diagnostics from "../../../classes/diagnostics";
import Log, { LogLevel } from "../../../core/logging";
import { ERROR_MESSAGES } from "../../diagnostics";
import TransformerState from "../../state";
import getPathFromExpression from "../../utils/getPathFromExpression";

export default function performBaseMacroReadFile(state: TransformerState, node: ts.CallExpression) {
  // TypeScript is being weird today
  const pathArg = getPathFromExpression(state, node, node.arguments[0]);
  if (pathArg === undefined) {
    Diagnostics.error(node, ERROR_MESSAGES.MISSING_ARGUMENT("1", "file path"));
  }

  if (Log.canLog(LogLevel.Debug)) {
    Log.trace(`Attempting to read file from ${ansi.bold(state.relativeToProjectDir(pathArg))}`);
  }

  if (fs.existsSync(pathArg)) {
    const stat = fs.statSync(pathArg);
    if (stat.isFile()) {
      return state.context.factory.createStringLiteral(fs.readFileSync(pathArg).toString());
    } else {
      Diagnostics.error(node, ERROR_MESSAGES.NOT_A_FILE);
    }
  }
}
