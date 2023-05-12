import ts from "typescript";
import TransformerState from "../state";

export default function createVoidExpression(state: TransformerState) {
  const f = state.context.factory;
  return f.createAsExpression(
    f.createAsExpression(f.createIdentifier("undefined"), f.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)),
    f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
  );
}
