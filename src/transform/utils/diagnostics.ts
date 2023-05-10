import ts from "typescript";
import { PACKAGE_NAME } from "../../constants";
import { EOL } from "os";

function createFormatDiagnosticsHost(): ts.FormatDiagnosticsHost {
  return {
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: fileName => fileName,
    getNewLine: () => EOL,
  };
}

/**
 * Formats a given array of typescript diagnostics, `diagnostics`, into a readable format.
 */
function formatDiagnostics(diagnostics: ReadonlyArray<ts.Diagnostic>) {
  return ts.formatDiagnosticsWithColorAndContext(
    diagnostics,
    createFormatDiagnosticsHost(),
  );
}

function createTextDiagnostic(
  text: string,
  category = ts.DiagnosticCategory.Error,
): ts.Diagnostic {
  return {
    category,
    code: ` ${PACKAGE_NAME}` as unknown as number,
    file: undefined,
    messageText: text,
    start: undefined,
    length: undefined,
  };
}

function createDiagnosticWithLocation(
  message: string,
  category: ts.DiagnosticCategory,
  node: ts.Node,
): ts.DiagnosticWithLocation {
  return {
    category,
    code: ` ${PACKAGE_NAME}` as unknown as number,
    file: node.getSourceFile(),
    messageText: message,
    length: node.getWidth(),
    start: node.getStart(),
  };
}

function diagnostic(category: ts.DiagnosticCategory, message: string) {
  return (node: ts.Node) =>
    createDiagnosticWithLocation(message, category, node);
}

function warning(message: string) {
  return diagnostic(ts.DiagnosticCategory.Warning, message);
}

function error(message: string) {
  return diagnostic(ts.DiagnosticCategory.Error, message);
}

export class DiagnosticError {
  public constructor(public readonly diagnostic: ts.DiagnosticWithLocation) {}

  public toString() {
    return formatDiagnostics([this.diagnostic]);
  }
}

export function throwWithDiagnostic(diag: ts.DiagnosticWithLocation): never {
  throw new DiagnosticError(diag);
}

/**
 * Variety of diagnostics that are expected to
 * happen from rbxts-transformer-fs
 */
export const Diagnostics = {
  DEPRECATED: (node: ts.Node, name: string) =>
    warning(`${name} is deprecated.`)(node),

  DEPRECATED_WITH_ALT: (node: ts.Node, name: string, replacement: string) =>
    warning(`${name} is deprecated. Use ${replacement} instead`)(node),

  CALL_MACROS: {
    FILE_HASH_UNSUPPORTED_ALG: error("Unsupported hash algorithm"),
    FILE_HASH_EXPECTED_ALG: error("Algorithm for $fileHash is not specified"),

    EXPECT_BASE_INVALID_ERR_MESSAGE: error(
      "Error message must be a literal string",
    ),

    EXPECT_FILE_ERR: (node: ts.Node, msg: string | undefined) =>
      error(msg ?? "File not found")(node),
    EXPECT_PATH_ERR: (node: ts.Node, msg: string | undefined) =>
      error(msg ?? "Specified path not found")(node),
    EXPECT_DIR_ERR: (node: ts.Node, msg: string | undefined) =>
      error(msg ?? "Directory not found")(node),
  },

  EXPECTED_PATH: {
    ANY: error(
      "Specified path is not a literal string (it must be constant type string or not adding any possible modifications)",
    ),
    FILE: error(
      "Specified file path is not a literal string (it must be constant type string or not adding any possible modifications)",
    ),
    DIRECTORY: error(
      "Specified directory path is not a literal string (it must be constant type string or not adding any possible modifications)",
    ),
  },
  IS_A_DIRECTORY: error("Specified file is a directory"),

  NOT_FOUND: {
    FILE: error("File not found"),
    PATH: error("Specified path not found"),
    DIR: error("Directory not found"),
  },

  UNKNOWN_MACRO: error(`Unknown macro`),
  UNKNOWN_CALL_MACRO: (node: ts.CallExpression, name: string) =>
    error(`Unknown call macro: ${name}`)(node),

  UNKNOWN_TYPE: error("Unknown type"),
};
