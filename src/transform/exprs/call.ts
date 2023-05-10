import ansi from "ansi-colors";
import ts from "typescript";

import { TransformContext } from "../../context";
import { Log } from "../../logging";
import {
  CallMacro,
  CALL_MACROS,
  getTransformerCallMacroDecl,
} from "../macros/call";
import { Diagnostics } from "../utils/diagnostics";

export function transformCallExpression(
  ctx: TransformContext,
  node: ts.CallExpression,
) {
  const decl = getTransformerCallMacroDecl(ctx, node);
  if (decl !== undefined) {
    const canLog = Log.canLog(Log.Level.Debug);
    if (canLog) {
      const { line, character: column } = ts.getLineAndCharacterOfPosition(
        node.getSourceFile(),
        node.pos,
      );

      Log.debug(
        `Found transformer call macro at line ${line} on column ${column}`,
      );
      Log.pushIndent();
    }

    // Getting function name
    const functionName = decl.name && decl.name.getText();
    if (functionName === undefined) {
      ctx.addDiagnostic(Diagnostics.UNKNOWN_MACRO(node));
      return node;
    }

    // Call macro begins
    const macro = CALL_MACROS[functionName];
    if (canLog) {
      Log.debug(`Transforming call macro: ${ansi.bold(functionName)}`);
    }

    let result: ReturnType<CallMacro> = node;
    if (macro === undefined) {
      ctx.addDiagnostic(Diagnostics.UNKNOWN_CALL_MACRO(node, functionName));
    } else {
      result = macro(ctx, node);
    }

    if (canLog) Log.popIndent();
    return result;
  }
  return node;
}
