import ts from "typescript";
import TransformerState from "../../state";

export default function performBaseMacroFileName(state: TransformerState, file: ts.SourceFile) {
  return state.context.factory.createStringLiteral(state.relativeToProjectDir(file.resolvedPath));
}
