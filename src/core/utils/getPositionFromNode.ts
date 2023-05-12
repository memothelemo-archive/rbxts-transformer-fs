import ts from "typescript";

export default function getPositionOfNode(file: ts.SourceFile, node: ts.Node): readonly [number, number] {
  const info = ts.getLineAndCharacterOfPosition(file, node.pos);
  return [info.line + 1, info.character] as const;
}
