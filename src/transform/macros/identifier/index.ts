import path from "path";
import ts, { factory } from "typescript";
import { TransformContext } from "../../../context";
import { Diagnostics, throwWithDiagnostic } from "../../utils/diagnostics";
import { isAncestorOf } from "../../utils/isAncestorOf";

export type IdentifierMacro = (
  ctx: TransformContext,
  node: ts.Node,
) => ts.Expression;

export function getIdentifierMacro(
  ctx: TransformContext,
  node: ts.Node,
): [IdentifierMacro, string] | undefined {
  // Make sure we're not in imports otherwise it will be disaster!
  if (isAncestorOf(node, ts.isImportDeclaration)) {
    return undefined;
  }

  const symbol = ctx.getSymbol(node, true);
  if (symbol === undefined) {
    return undefined;
  }

  const decl = symbol.valueDeclaration;
  if (decl === undefined) {
    return undefined;
  }

  if (!ts.isVariableDeclaration(decl)) {
    return undefined;
  }

  if (!ctx.isFileFromTransformer(decl.getSourceFile())) {
    return undefined;
  }

  // Whoops! we need to check if it is pseudo global variable
  const parent = decl.parent as ts.VariableDeclarationList;
  if ((parent.flags & ts.NodeFlags.Const) !== ts.NodeFlags.Const) {
    return undefined;
  }

  if (!ts.isIdentifier(decl.name)) {
    return undefined;
  }

  const name = decl.name.getText();
  const macro = IDENTIFIER_MACROS[name];

  if (macro === undefined) {
    throwWithDiagnostic(Diagnostics.UNKNOWN_MACRO(node));
  }

  return [macro, name];
}

export const transformIdentifierMacroCurrentFileName: IdentifierMacro = (
  ctx: TransformContext,
  node: ts.Node,
) => {
  const sourceFile = node.getSourceFile();
  return factory.createStringLiteral(
    path.relative(ctx.projectDir, sourceFile.resolvedPath),
  );
};

export const IDENTIFIER_MACROS: {
  [K in string]?: IdentifierMacro;
} = {
  $CURRENT_FILE_NAME: transformIdentifierMacroCurrentFileName,
};
