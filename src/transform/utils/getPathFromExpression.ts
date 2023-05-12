import path from "path";
import ts from "typescript";

import TransformerState from "../state";
import { getLiteralStringLike } from "./getLiteralString";

export default function getPathFromExpression(
  state: TransformerState,
  source: ts.Node,
  value: ts.Expression | undefined,
) {
  const pathArg = getLiteralStringLike(state, value);
  if (pathArg !== undefined) {
    const file = source.getSourceFile();
    const realPath = pathArg.startsWith("./")
      ? path.join(path.dirname(file.resolvedPath), pathArg)
      : path.join(state.projectDir, pathArg);

    return realPath;
  }
}
