import ts from "typescript";
import Log from "../../../core/logging";
import TransformerState from "../../state";
import transformChildrenOfNode from "../children";

function isTransformerImport(state: TransformerState, node: ts.ImportDeclaration) {
  if (!node.importClause) {
    return false;
  }

  const namedBindings = node.importClause.namedBindings;
  if (!node.importClause.name && !namedBindings) {
    return false;
  }

  const symbol = state.getSymbol(node.moduleSpecifier);
  return symbol && symbol.valueDeclaration && symbol === state.symbolProvider.getFromTransformIndexFile();
}

export default function transformImportDeclaration(state: TransformerState, node: ts.ImportDeclaration) {
  if (!isTransformerImport(state, node)) return transformChildrenOfNode(state, node);
  Log.debug("Found transformer import; stripping it off");

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
    state.context.factory.updateImportClause(clause, true, clause.name, clause.namedBindings),
    node.moduleSpecifier,
    undefined,
  );
}
