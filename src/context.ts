import ansi from "ansi-colors";
import path from "path";
import ts from "typescript";
import { RojoResolver } from "@roblox-ts/rojo-resolver";

import { TYPINGS_PATH, TYPINGS_SRC_TXT } from "./constants";
import { TransformerConfig } from "./config";
import { Log } from "./logging";
import { assert } from "./utils/assert";
import { PathTranslator } from "./utils/pathTranslator";
import { getRbxtsCommandLine } from "./utils/ts";

/**
 * Context for rbxts-transformer-fs transformer.
 *
 * When the entry function runs, it will create a new
 * transformation context with program as a parameter
 * (it must be passed from the entry function).
 */
export class TransformContext {
  /**
   * Transformer configuration set by the user
   */
  public readonly config!: TransformerConfig;

  public projectDir!: string;
  public rojoProject!: RojoResolver;

  public compilerOptions!: ts.CompilerOptions;
  public typeChecker!: ts.TypeChecker;
  public tsCtx!: ts.TransformationContext;

  public pathTranslator!: PathTranslator;

  // You can construct this with fromEntry or anything else
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Creates a new transformer context object
   * from the transformer's entry function.
   */
  public static fromEntry(
    config: TransformerConfig,
    program: ts.Program,
    tsCtx: ts.TransformationContext,
  ) {
    Log.trace("Parsing rbxtsc command line");

    // getting command line from rbxts exec
    const cmdLine = getRbxtsCommandLine();
    if (cmdLine === undefined) {
      throw new Error("TODO: Deal with unresolved command line");
    }

    // Let rbxtsc emit Rojo project warnings
    let rojoConfigPath: string | undefined = undefined;
    if (cmdLine.manualRojoPath !== undefined) {
      rojoConfigPath = path.resolve(cmdLine.manualRojoPath);
    } else {
      rojoConfigPath = RojoResolver.findRojoConfigFilePath(
        cmdLine.projectDir,
      ).path;
    }

    if (rojoConfigPath === undefined) {
      throw new Error("TODO: Rojo project not found");
    }
    Log.info(
      `Loading rojo project; selected project path: ${ansi.bold(
        path.relative(cmdLine.projectDir, rojoConfigPath),
      )}`,
    );

    const rojoProject = RojoResolver.fromPath(rojoConfigPath);
    const ctx = new TransformContext();

    Log.info(
      `Selected rojo project is successfully loaded; rojo.isGame = ${rojoProject.isGame}`,
    );

    // Unsafe way to set read-only property
    (ctx as unknown as { config: TransformerConfig }).config = config;

    ctx.rojoProject = rojoProject;
    ctx.projectDir = cmdLine.projectDir;
    ctx.compilerOptions = program.getCompilerOptions();
    ctx.typeChecker = program.getTypeChecker();
    ctx.tsCtx = tsCtx;

    // looking for srcDir and outDir
    Log.debug("Asserting ctx.compilerOptions properties");
    assert(ctx.compilerOptions.rootDir);
    assert(ctx.compilerOptions.outDir);

    ctx.pathTranslator = new PathTranslator(
      ctx.compilerOptions.rootDir,
      ctx.compilerOptions.outDir,
      ctx.compilerOptions.tsBuildInfoFile,
      ctx.compilerOptions.declaration ?? false,
    );

    return ctx;
  }

  /**
   * Report any TypeScript diagnostic object made from
   * transformer to rbxtsc.
   */
  public addDiagnostic(diag: ts.DiagnosticWithLocation) {
    this.tsCtx.addDiagnostic(diag);
  }

  /**
   * Checks if the specified module fie comes from
   * the transformer itself.
   */
  public isFileFromTransformer(module: ts.SourceFile) {
    // 'index.d.ts' check
    if (module.text !== TYPINGS_SRC_TXT) {
      return false;
    }

    // verify that is actually from 'index.d.ts' thing
    return module.resolvedPath === TYPINGS_PATH;
  }

  /**
   * Shortcut for `ctx.typeChecker.getTypeAtLocation()`
   */
  public getType(node: ts.Node) {
    return this.typeChecker.getTypeAtLocation(node);
  }

  /**
   * Shortcut for `ctx.typeChecker.getSymbolAtLocation()`
   */
  public getSymbol(node: ts.Node, skipAlias = false) {
    const symbol = this.typeChecker.getSymbolAtLocation(node);
    if (symbol && skipAlias) {
      return ts.skipAlias(symbol, this.typeChecker);
    } else {
      return symbol;
    }
  }
}
