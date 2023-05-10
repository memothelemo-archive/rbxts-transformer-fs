import ts from "typescript";
import { TransformContext } from "../../context";
import { transformIdentifierLike } from "./identifier";

export function transformPropertyAccessExpression(
  ctx: TransformContext,
  node: ts.PropertyAccessExpression,
) {
  return transformIdentifierLike(ctx, node);
}
