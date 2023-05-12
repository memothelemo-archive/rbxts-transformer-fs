import ts from "typescript";

/**
 * Transformer entry type that must be returned
 * to every rbxtsc transformers
 */
export type TransformerEntry = (
  program: ts.Program,
  cfg: unknown,
) => (context: ts.TransformationContext) => (file: ts.SourceFile) => ts.SourceFile;

export type TransformResult = ts.Node | ts.Node[] | undefined;
