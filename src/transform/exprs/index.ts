import ts from "typescript";
import { TransformContext } from "../../context";
import { transformCallExpression } from "./call";
import { transformIdentifier } from "./identifier";
import { transformPropertyAccessExpression } from "./propertyAccess";

function transformExpression(ctx: TransformContext, node: ts.Expression) {
  switch (node.kind) {
    case ts.SyntaxKind.PropertyAccessExpression:
      return transformPropertyAccessExpression(
        ctx,
        node as ts.PropertyAccessExpression,
      );
    case ts.SyntaxKind.Identifier:
      return transformIdentifier(ctx, node as ts.Identifier);
    case ts.SyntaxKind.CallExpression:
      return transformCallExpression(ctx, node as ts.CallExpression);
    default:
      return node;
  }
}

export default transformExpression;
