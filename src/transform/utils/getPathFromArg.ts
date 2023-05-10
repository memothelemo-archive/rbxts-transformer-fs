import path from "path";
import ts from "typescript";
import { TransformContext } from "../../context";
import { getLiteralStringLike } from "./getLiteralString";

export function getPathFromArgument(
  ctx: TransformContext,
  src: ts.Node,
  argument: ts.Expression | undefined,
) {
  const pathArg = getLiteralStringLike(ctx, argument);
  if (pathArg !== undefined) {
    // resolving file path, its root is from the source file
    return path.join(src.getSourceFile().resolvedPath, pathArg);
  }
}
