import ts from "typescript";
import TransformerState from "../state";
import transformNode from "./node";

export default function transformChildrenOfNode<T extends ts.Node = ts.Node>(state: TransformerState, node: T) {
  return ts.visitEachChild(node, child => transformNode(state, child), state.context);
}
