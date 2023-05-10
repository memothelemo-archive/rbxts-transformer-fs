import ansi from "ansi-colors";
import path from "path";
import ts from "typescript";
import {} from "ts-expose-internals";

import { TransformContext } from "./context";
import {
  DEFAULT_CONFIG,
  isValidTransformerConfig,
  TransformerConfig,
} from "./config";
import { Log } from "./logging";
import { transformSourceFile } from "./transform";
import { DiagnosticError } from "./transform/utils/diagnostics";

function loadConfig(raw: unknown) {
  let config = { ...DEFAULT_CONFIG };
  if (raw !== undefined) {
    // validate raw config
    const err = isValidTransformerConfig(raw);
    if (err !== undefined) {
      throw new Error(`TODO: Invalid config: ${err}`);
    } else {
      config = raw as TransformerConfig;
    }
  }
  return config;
}

// Every transformer's entry point. 'program' argument will be
// be there for the lifetime of roblox-ts compiler program.
function main(program: ts.Program, rawCfg: unknown) {
  return (tsCtx: ts.TransformationContext) => {
    const config = loadConfig(rawCfg);
    Log.setFromConfig(config);

    const ctx = TransformContext.fromEntry(config, program, tsCtx);

    // This function runs in every file found
    // or scanned from a current Typescript project.
    return (file: ts.SourceFile) => {
      if (Log.canLog(Log.Level.Debug)) {
        Log.trace(
          `Transforming file; path = ${ansi.bold(
            path.relative(ctx.projectDir, file.resolvedPath),
          )}, file.kind = ${ansi.bold(ts.SyntaxKind[file.kind])}`,
        );
      }

      if (!ts.isSourceFile(file)) {
        throw new Error("TODO: Deal with incompatibility");
      }
      Log.pushIndent();

      let result = file;
      try {
        result = transformSourceFile(ctx, file);
      } catch (e) {
        Log.resetIndent();
        Log.pushIndent();
        Log.warn(`Got an error; reverting back to its original source`);
        if (e instanceof DiagnosticError) {
          ctx.addDiagnostic(e.diagnostic);
        } else if (e instanceof Error) {
          throw new Error(
            `Unexpected error!: [${e.name}]: ${e.message}\n\nStack traceback:${e.stack}`,
          );
        } else {
          throw "Unexpected error!";
        }
      }

      Log.popIndent();
      return result;
    };
  };
}

export default main;
