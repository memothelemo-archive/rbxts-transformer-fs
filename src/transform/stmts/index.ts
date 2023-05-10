import ts from "typescript";
import { TransformContext } from "../../context";
import { transformImportDeclaration } from "./import";

function transformStatement(ctx: TransformContext, node: ts.Statement) {
  switch (node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      return transformImportDeclaration(ctx, node as ts.ImportDeclaration);
    default:
      return node;
  }
}

export default transformStatement;
