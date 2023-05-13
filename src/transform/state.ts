import { RojoResolver } from "@roblox-ts/rojo-resolver";
import ansi from "ansi-colors";
import path from "path";
import ts from "typescript";

import { TransformerConfig } from "../core/config";
import Log, { LogLevel } from "../core/logging";
import { assert } from "../core/utils/assert";
import PathTranslator from "../classes/pathTranslator";
import SymbolProvider from "../classes/symbolProvider";
import { RbxtsCommandLine } from "../rbxtsc/commandLine";
import { INDEX_DTS_PATH, INDEX_DTS_SRC } from "../core/constants";
import { CallMacro, IdentifierMacro } from "./macros/types";
import { IDENTIFIER_MACROS } from "./macros/identifier";
import { CALL_MACROS } from "./macros/call";
import { ErrorKind, throwErr } from "../core/error";

export default class TransformerState {
  public readonly compilerOptions = this.program.getCompilerOptions();
  public readonly typeChecker = this.program.getTypeChecker();
  public readonly rojoResolver: RojoResolver;
  public readonly pathTranslator: PathTranslator;
  public readonly projectDir: string;
  public readonly symbolProvider: SymbolProvider;

  public readonly identifierMacros = new Map<ts.Symbol, IdentifierMacro>();
  public readonly callMacros = new Map<ts.Symbol, CallMacro>();

  private prereqStack = new Array<Array<ts.Statement>>();

  public constructor(
    public readonly config: TransformerConfig,
    public readonly program: ts.Program,
    public readonly context: ts.TransformationContext,
  ) {
    // Getting command line from process entry arguments
    const cmdLine = RbxtsCommandLine;
    if (cmdLine.verboseEnabled) {
      process.stdout.write("\n");
    }

    Log.debug("Creating transform state");
    Log.pushIndent();

    // Let roblox-ts emit Rojo project warnings
    Log.trace(`Searching rojo config file; project.dir = ${cmdLine.projectDir}`);
    let rojoConfigFilePath = undefined;
    if (cmdLine.setRojoConfigFilePath !== undefined) {
      rojoConfigFilePath = path.resolve(cmdLine.setRojoConfigFilePath);
    } else {
      rojoConfigFilePath = RojoResolver.findRojoConfigFilePath(cmdLine.projectDir).path;
    }

    if (rojoConfigFilePath === undefined) {
      throwErr(ErrorKind.IndexFileNotResolved);
    }

    Log.info(
      `Loading Rojo project; selectedPath = ${ansi.bold(path.relative(cmdLine.projectDir, rojoConfigFilePath))}`,
    );
    const rojoResolver = RojoResolver.fromPath(rojoConfigFilePath);
    Log.info(
      `Successfully loaded Rojo project; rojoResolver.isGame = ${ansi.bold(rojoResolver.isGame ? "true" : "false")}`,
    );

    assert(this.compilerOptions.rootDir);
    assert(this.compilerOptions.outDir);
    this.rojoResolver = rojoResolver;
    this.projectDir = cmdLine.projectDir;
    this.pathTranslator = new PathTranslator(
      this.compilerOptions.rootDir,
      this.compilerOptions.outDir,
      this.compilerOptions.tsBuildInfoFile,
      this.compilerOptions.declaration ?? false,
    );

    const symbolProvider = new SymbolProvider(this);
    symbolProvider.loadSymbols();
    this.symbolProvider = symbolProvider;

    if (symbolProvider.isLoaded()) {
      Log.info("Setting up macro symbols");
      this.setupMacros();
    }

    Log.popIndent();
    Log.debug("Successfully created transformer state");
  }

  public canTransform() {
    return this.symbolProvider.isLoaded();
  }

  private setupMacros() {
    const canLog = Log.canLog(LogLevel.Debug);
    if (canLog) Log.pushIndent();
    for (const macro of IDENTIFIER_MACROS) {
      if (canLog)
        Log.debug(
          `Looking for${macro.deprecated !== undefined ? " deprecated" : ""} identifier macro: ${ansi.bold(
            macro.name,
          )}`,
        );

      const symbol =
        macro.getSymbol !== undefined ? macro.getSymbol(this) : this.symbolProvider.getFromIdentifierMacro(macro.name);

      this.identifierMacros.set(symbol, macro);
    }
    for (const macro of CALL_MACROS) {
      if (canLog)
        Log.debug(
          `Looking for${macro.deprecated !== undefined ? " deprecated" : ""} call macro: ${ansi.bold(macro.name)}`,
        );

      const symbol =
        macro.getSymbol !== undefined ? macro.getSymbol(this) : this.symbolProvider.getFromCallMacro(macro.name);

      this.callMacros.set(symbol, macro);
    }
    if (canLog) Log.popIndent();
  }

  public isTransformerIndexFile(module: ts.SourceFile) {
    // 'index.d.ts' check
    if (module.text !== INDEX_DTS_SRC) {
      return false;
    }

    // verify that is actually from 'index.d.ts' thing
    return module.resolvedPath === INDEX_DTS_PATH && module.isDeclarationFile;
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

  public relativeToProjectDir(targetPath: string) {
    return path.relative(this.projectDir, targetPath);
  }

  public capturePrereqs<T>(callback: () => T): [T, ts.Statement[]] {
    this.prereqStack.push([]);

    const result = callback();
    return [result, this.prereqStack.pop() ?? []];
  }

  public prereq(statement: ts.Statement) {
    const stack = this.prereqStack[this.prereqStack.length - 1];
    if (stack) stack.push(statement);
  }

  public prereqList(statements: ts.Statement[]) {
    const stack = this.prereqStack[this.prereqStack.length - 1];
    if (stack) stack.push(...statements);
  }
}
