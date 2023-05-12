import ts from "typescript";
import { ErrorKind, throwErr } from "../../core/error";
import TransformerState from "../state";
// import { Diagnostics, throwWithDiagnostic } from "./diagnostics";

export function getLiteralStringLike(state: TransformerState, node?: ts.Node) {
  if (node === undefined || !(ts.isIdentifier(node) || ts.isStringLiteralLike(node))) {
    return undefined;
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    const text = node.getText();
    return ts.stripQuotes(text);
  }

  const type = state.getType(node);
  if (!type) {
    throwErr(ErrorKind.NotImplemented);
    // throwWithDiagnostic(Diagnostics.UNKNOWN_TYPE(node));
  }

  if (type.flags !== ts.TypeFlags.StringLiteral) {
    return undefined;
  }

  return (type as ts.StringLiteralType).value;
}
