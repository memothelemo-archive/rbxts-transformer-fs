import ts from "typescript";

import { TransformContext } from "../../../context";
import { Diagnostics } from "../../utils/diagnostics";
import { transformIdentifierMacroCurrentFileName } from "../identifier";
import {
  transformCallMacroDirExists,
  transformCallMacroFileExists,
  transformCallMacroPathExists,
} from "./exists";
import {
  transformCallMacroExpectDir,
  transformCallMacroExpectFile,
  transformCallMacroExpectPath,
} from "./expect";
import { transformCallMacroHashFile } from "./hashFile";
import {
  transformCallMacroRead as transformCallMacroReadFile,
  transformCallMacroReadOptional as transformCallMacroReadFileOptional,
} from "./read";

export type CallMacro = (
  ctx: TransformContext,
  node: ts.CallExpression,
) => ts.Expression;

export function getTransformerCallMacroDecl(
  ctx: TransformContext,
  node: ts.CallExpression,
): ts.SignatureDeclaration | undefined {
  // We need to get that signature of that expression
  const signature = ctx.typeChecker.getResolvedSignature(node);
  if (signature === undefined) {
    return undefined;
  }

  const declaration = signature.getDeclaration();
  if (declaration === undefined) return;

  if (
    !ts.isJSDocSignature(declaration) &&
    ctx.isFileFromTransformer(declaration.getSourceFile())
  ) {
    return declaration;
  }
}

export const CALL_MACROS: {
  [K in string]?: CallMacro;
} = {
  $readFile: transformCallMacroReadFile,
  $readFileOpt: transformCallMacroReadFileOptional,

  $hashFile: transformCallMacroHashFile,

  $pathExists: transformCallMacroPathExists,
  $dirExists: transformCallMacroDirExists,
  $fileExists: transformCallMacroFileExists,

  $expectFile: transformCallMacroExpectFile,
  $expectDir: transformCallMacroExpectDir,
  $expectPath: transformCallMacroExpectPath,

  // Deprecated functions
  $fileContents: (ctx, node) => {
    ctx.addDiagnostic(
      Diagnostics.DEPRECATED_WITH_ALT(node, "$fileContents", "$read"),
    );
    return CALL_MACROS["$read"]!(ctx, node);
  },
  $requireFile: (ctx, node) => {
    ctx.addDiagnostic(
      Diagnostics.DEPRECATED_WITH_ALT(node, "$requireFile", "$expectFile"),
    );
    return CALL_MACROS["$expectFile"]!(ctx, node);
  },
  $fileName: (ctx, node) => {
    ctx.addDiagnostic(
      Diagnostics.DEPRECATED_WITH_ALT(node, "$fileName", "$CURRENT_FILE_NAME"),
    );
    return transformIdentifierMacroCurrentFileName(ctx, node);
  },
};
