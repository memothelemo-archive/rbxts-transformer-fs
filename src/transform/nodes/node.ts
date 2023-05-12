import ts from "typescript";

import TransformerState from "../state";
import transformChildrenOfNode from "./children";
import transformExpression from "./exprs";
import transformStatement from "./stmts";

export default function transformNode(state: TransformerState, node: ts.Node): ts.Node | ts.Statement[] | undefined {
  if (ts.isExpression(node)) {
    return transformExpression(state, node);
  } else if (ts.isStatement(node)) {
    return transformStatement(state, node);
  }
  return transformChildrenOfNode(state, node);
}
