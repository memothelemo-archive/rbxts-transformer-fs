import ansi from "ansi-colors";
import ts from "typescript";
import Diagnostics from "../../classes/diagnostics";

import Log, { LogLevel } from "../../core/logging";
import { assert } from "../../core/utils/assert";
import { catchErrors } from "../../core/utils/catchErrors";
import TransformerState from "../state";
import transformStatement from "./stmts";

function transformStatementList(state: TransformerState, statements: ReadonlyArray<ts.Statement>) {
  const result = new Array<ts.Statement>();
  for (const statement of statements) {
    const [transformed, prereqs] = state.capturePrereqs(() => transformStatement(state, statement));
    result.push(...prereqs);
    if (Array.isArray(transformed)) {
      result.push(...transformed);
    } else if (transformed) {
      result.push(transformed);
    }
  }
  return result;
}

export default function transformSourceFile(state: TransformerState, file: ts.SourceFile) {
  if (Log.canLog(LogLevel.Debug)) {
    const path = ansi.bold(state.relativeToProjectDir(file.resolvedPath));
    const kind = ansi.bold(ts.SyntaxKind[file.kind]);
    Log.debug(`Transforming file; path = ${path}, file.kind = ${kind}`);
  }

  const result = catchErrors(state.context, true, () => {
    assert(ts.isSourceFile(file));
    Log.pushIndent();

    return state.context.factory.updateSourceFile(
      file,
      transformStatementList(state, file.statements),
      file.isDeclarationFile,
      file.referencedFiles,
      file.typeReferenceDirectives,
      file.hasNoDefaultLib,
      file.libReferenceDirectives,
    );
  });

  for (const diagnostic of Diagnostics.flush()) {
    state.context.addDiagnostic(diagnostic);
  }

  if (result === undefined) {
    Log.resetIndent();
    Log.pushIndent();
    Log.warn("Diagnostic error occurred; reverting back to its original source code");
    return file;
  } else {
    Log.popIndent();
    return result;
  }
}
