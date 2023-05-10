import ansi from "ansi-colors";
import ts from "typescript";
import { TransformContext } from "../../context";
import { Log } from "../../logging";
import { getIdentifierMacro, IdentifierMacro } from "../macros/identifier";

export function transformIdentifierLike(ctx: TransformContext, node: ts.Node) {
  const result = getIdentifierMacro(ctx, node);
  if (result !== undefined) {
    const [macro, name] = result;
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

    if (canLog) {
      Log.debug(
        `Transforming identifier macro ${ansi.bold(name)} with node ${ansi.bold(
          ts.SyntaxKind[node.kind],
        )}`,
      );
    }

    const macroResult: ReturnType<IdentifierMacro> = macro(ctx, node);
    if (canLog) Log.popIndent();

    return macroResult;
  } else {
    return node;
  }
}

export function transformIdentifier(
  ctx: TransformContext,
  node: ts.Identifier,
) {
  return transformIdentifierLike(ctx, node);
}
