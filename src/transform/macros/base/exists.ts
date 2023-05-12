import ansi from "ansi-colors";
import fs from "fs";
import ts from "typescript";

import Diagnostics from "../../../classes/diagnostics";
import Log, { LogLevel } from "../../../core/logging";
import { assert } from "../../../core/utils/assert";
import { ERROR_MESSAGES } from "../../diagnostics";
import TransformerState from "../../state";
import { getLiteralStringLike } from "../../utils/getLiteralString";
import getPathFromExpression from "../../utils/getPathFromExpression";
import { isUndefinedOrNull } from "../../utils/isUndefinedOrNull";

export default function performBaseMacroPathExists(
  state: TransformerState,
  specifier: "ANY" | "DIR" | "FILE",
  source: ts.Node,
  value: ts.Expression | undefined,
  customErrMessageArg: ts.Expression | undefined,
): [boolean, string?] {
  // Check that it is not an unknown value like smth
  const pathArg = getPathFromExpression(state, source, value);
  if (pathArg === undefined) {
    switch (specifier) {
      case "ANY":
        Diagnostics.error(source, ERROR_MESSAGES.EXPECTED("any path"));
      case "DIR":
        Diagnostics.error(source, ERROR_MESSAGES.EXPECTED("directory path"));
      case "FILE":
        Diagnostics.error(source, ERROR_MESSAGES.EXPECTED("directory path"));
      default:
        assert(false, "Unknown specifier");
    }
  }

  // Resolve path
  if (Log.canLog(LogLevel.Debug)) {
    Log.trace(`Checking for path: ${ansi.bold(state.relativeToProjectDir(pathArg))}`);
  }

  let result = false;
  switch (specifier) {
    case "ANY":
      result = fs.existsSync(pathArg);
      break;
    default:
      if (fs.existsSync(pathArg)) {
        const stat = fs.statSync(pathArg);
        if (stat.isFile()) {
          result = specifier === "FILE";
        } else if (stat.isDirectory()) {
          result = specifier === "DIR";
        }
      }
      break;
  }

  if (customErrMessageArg !== undefined && !isUndefinedOrNull(state, customErrMessageArg)) {
    const errMsg = getLiteralStringLike(state, customErrMessageArg);
    if (errMsg === undefined) {
      Diagnostics.error(source, ERROR_MESSAGES.INVALID_ERR_MESSAGE);
    }
    return [result, errMsg];
  } else {
    return [result, undefined];
  }
}
