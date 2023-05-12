import ts from "typescript";

import Log, { LogLevel } from "../../../core/logging";
import getPositionOfNode from "../../../core/utils/getPositionFromNode";
import TransformerState from "../../state";
import warnIfDeprecatedMacro from "../../utils/warnIfDeprecatedMacro";
import transformChildrenOfNode from "../children";

export default function transformCallExpression(state: TransformerState, node: ts.CallExpression) {
  const symbol = state.getSymbol(node.expression, true);
  if (symbol !== undefined) {
    const macro = state.callMacros.get(symbol);
    if (macro !== undefined) {
      const canLog = Log.canLog(LogLevel.Debug);
      if (canLog) {
        const [line, column] = getPositionOfNode(node.getSourceFile(), node);
        Log.debug(`Found call macro at line ${line} on column ${column}`);
        Log.pushIndent();
        Log.debug("Transforming call macro...");
      }

      warnIfDeprecatedMacro(state, node, macro);

      const result = macro.transform(state, node);
      if (canLog) {
        Log.debug("End of transforming identifier macro");
        Log.popIndent();
      }

      return result;
    }
  }
  return transformChildrenOfNode(state, node);
}
