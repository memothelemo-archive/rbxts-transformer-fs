import ts from "typescript";
import { IdentifierLike } from "../../macros/types";
import TransformerState from "../../state";
import transformChildrenOfNode from "../children";
import transformCallExpression from "./call";
import transformIdentifierLike from "./identifierLike";

function transformExpression(state: TransformerState, node: ts.Expression) {
  switch (node.kind) {
    case ts.SyntaxKind.CallExpression:
      return transformCallExpression(state, node as ts.CallExpression);
    case ts.SyntaxKind.Identifier:
    case ts.SyntaxKind.PropertyAccessExpression:
      return transformIdentifierLike(state, node as IdentifierLike);
    default:
      return transformChildrenOfNode(state, node);
  }
}

export default transformExpression;
