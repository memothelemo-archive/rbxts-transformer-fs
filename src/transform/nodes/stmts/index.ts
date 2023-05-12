import ts from "typescript";
import TransformerState from "../../state";
import transformChildrenOfNode from "../children";
import transformExpression from "../exprs";
import transformImportDeclaration from "./importDeclaration";

export default function transformStatement(state: TransformerState, node: ts.Statement) {
  switch (node.kind) {
    // To avoid internal errors when transformExpression is returned undefined
    case ts.SyntaxKind.ExpressionStatement:
      const result = transformExpression(state, (node as ts.ExpressionStatement).expression);
      if (result !== undefined) {
        return state.context.factory.createExpressionStatement(result);
      }
      break;
    case ts.SyntaxKind.ImportDeclaration:
      return transformImportDeclaration(state, node as ts.ImportDeclaration);
    default:
      return transformChildrenOfNode(state, node);
  }
}
