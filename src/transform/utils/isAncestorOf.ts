import ts from "typescript";

export function isAncestorOf(node: ts.Node, callback: (node: ts.Node) => boolean) {
  let parent: ts.Node | undefined = node;
  while (parent !== undefined) {
    if (callback(parent)) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}
