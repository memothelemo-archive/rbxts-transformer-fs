import { EOL } from "os";
import ts from "typescript";

export abstract class BaseError {
  public stack?: string;

  public constructor() {
    debugger;
    const stack = new Error().stack;
    this.stack = stack;
  }
}

export const enum ErrorKind {
  FailedToLoadRojoProject,
  IndexFileNotResolved,
  InvalidConfig,
  NotImplemented,
}

export class TransformerError extends BaseError {
  public constructor(public readonly kind: ErrorKind, public readonly details?: string) {
    super();
  }

  public isABug() {
    switch (this.kind) {
      case ErrorKind.NotImplemented:
      case ErrorKind.IndexFileNotResolved:
        return true;
      default:
        return false;
    }
  }

  public toString() {
    switch (this.kind) {
      case ErrorKind.FailedToLoadRojoProject:
        return "Failed to load rojo project";
      case ErrorKind.IndexFileNotResolved:
        return "Failed to resolve rbxts-transformer-fs's index.d.ts file";
      case ErrorKind.InvalidConfig:
        return "Invalid transformer configuration";
      case ErrorKind.NotImplemented:
        return "Developer forgot to implement something";
    }
  }
}

export function throwErr(kind: ErrorKind, details?: string): never {
  debugger;
  throw new TransformerError(kind, details);
}

export class AssertError extends BaseError {
  public constructor(public readonly message?: string) {
    super();
  }
}

export class DiagnosticError extends BaseError {
  public constructor(public readonly diagnostic: ts.DiagnosticWithLocation) {
    super();
  }

  public toString() {
    function create_format_host(): ts.FormatDiagnosticsHost {
      return {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: fileName => fileName,
        getNewLine: () => EOL,
      };
    }

    /**
     * Formats a given array of typescript diagnostics, `diagnostics`, into a readable format.
     */
    function format(diagnostics: ReadonlyArray<ts.Diagnostic>) {
      return ts.formatDiagnosticsWithColorAndContext(diagnostics, create_format_host());
    }

    return format([this.diagnostic]);
  }
}
