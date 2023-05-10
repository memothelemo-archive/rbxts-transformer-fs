import ts from "typescript";
import { TransformContext } from "../context";
import transformExpression from "./exprs";
import transformStatement from "./stmts";

export function transformNode(ctx: TransformContext, node: ts.Node) {
  if (ts.isStatement(node)) {
    return transformStatement(ctx, node);
  }
  if (ts.isExpression(node)) {
    return transformExpression(ctx, node);
  }
  return node;
}

export function transformSourceFile(
  ctx: TransformContext,
  file: ts.SourceFile,
) {
  const visitNode: ts.Visitor = node =>
    ts.visitEachChild(
      transformNode(ctx, node),
      child => visitNode(child),
      ctx.tsCtx,
    );

  const output = ts.visitEachChild(file, visitNode, ctx.tsCtx);
  return output;
}
