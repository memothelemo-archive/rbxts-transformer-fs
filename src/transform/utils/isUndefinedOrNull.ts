import ts from "typescript";
import TransformerState from "../state";

export function isUndefinedOrNull(state: TransformerState, node: ts.Expression) {
  return state.getType(node).isNullableType();
}
