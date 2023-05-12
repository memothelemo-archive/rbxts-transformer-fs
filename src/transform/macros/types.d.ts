import ts from "typescript";
import TransformerState from "../state";

interface BaseMacro {
  name: string;
  deprecated?: { replacement?: string };

  getSymbol?: (state: TransformerState) => ts.Symbol;
  transform(state: TransformerState, node: ts.Node): ts.Node | ts.Node[] | undefined;
}

export interface CallMacro extends BaseMacro {
  transform(state: TransformerState, node: ts.CallExpression): ts.Expression | undefined;
}

export type IdentifierLike = ts.Identifier | ts.PropertyAccessExpression;

export interface IdentifierMacro extends BaseMacro {
  transform(state: TransformerState, node: IdentifierLike): ts.Expression;
}
