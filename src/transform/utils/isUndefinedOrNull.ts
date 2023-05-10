import ts from "typescript";
import { TransformContext } from "../../context";

export function isUndefinedOrNull(ctx: TransformContext, node: ts.Expression) {
  return ctx.getType(node).isNullableType();
}
