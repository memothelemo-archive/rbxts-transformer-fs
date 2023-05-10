import ts from "typescript";
import { TransformContext } from "../../context";
import { Diagnostics, throwWithDiagnostic } from "./diagnostics";

export function getLiteralStringLike(ctx: TransformContext, node?: ts.Node) {
  if (
    node === undefined ||
    !(ts.isIdentifier(node) || ts.isStringLiteralLike(node))
  ) {
    return undefined;
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    const text = node.getText();
    return ts.stripQuotes(text);
  }

  const type = ctx.getType(node);
  if (!type) {
    throwWithDiagnostic(Diagnostics.UNKNOWN_TYPE(node));
  }

  if (type.flags !== ts.TypeFlags.StringLiteral) {
    return undefined;
  }

  return (type as ts.StringLiteralType).value;
}
