import ts from "typescript";
import { TransformContext } from "../../context";
import { Log } from "../../logging";

function isTransformerImport(
  ctx: TransformContext,
  node: ts.ImportDeclaration,
) {
  if (!node.importClause) {
    return false;
  }

  const namedBindings = node.importClause.namedBindings;
  if (!node.importClause.name && !namedBindings) {
    return false;
  }

  const symbol = ctx.getSymbol(node.moduleSpecifier);
  return (
    symbol &&
    symbol.valueDeclaration &&
    ctx.isFileFromTransformer(symbol.valueDeclaration.getSourceFile())
  );
}

// Goal: stripping 'rbxts-transformer-fs' import
export function transformImportDeclaration(
  ctx: TransformContext,
  node: ts.ImportDeclaration,
) {
  if (!isTransformerImport(ctx, node)) {
    return node;
  }

  Log.debug("Stripping transformer import");
  const { importClause: clause } = node;

  // We don't need to worry about this if it is a typed import statement
  if (clause !== undefined && clause.isTypeOnly) {
    return node;
  }

  if (clause === undefined) {
    return undefined;
  }

  return ts.factory.updateImportDeclaration(
    node,
    undefined,
    ctx.tsCtx.factory.updateImportClause(
      clause,
      true,
      clause.name,
      clause.namedBindings,
    ),
    node.moduleSpecifier,
    undefined,
  );
}
