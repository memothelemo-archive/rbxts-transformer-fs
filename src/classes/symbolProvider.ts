import ansi from "ansi-colors";
import ts from "typescript";

import { PACKAGE_NAME } from "../core/constants";
import Log, { LogLevel } from "../core/logging";
import { assert } from "../core/utils/assert";
import getPositionOfNode from "../core/utils/getPositionFromNode";
import TransformerState from "../transform/state";

export default class SymbolProvider {
  private loaded = false;

  public readonly callMacros = new Map<string, ts.Symbol>();
  public readonly identifierMacros = new Map<string, ts.Symbol>();

  private _sourceFileSymbol!: ts.Symbol;

  public constructor(public state: TransformerState) {}

  public getFromTransformIndexFile() {
    const symbol = this._sourceFileSymbol;
    assert(symbol, "SymbolProvider is not initialized yet");
    return symbol;
  }

  public isLoaded() {
    return this.loaded;
  }

  public getFromCallMacro(name: string) {
    const symbol = this.callMacros.get(name);
    assert(symbol, `Unknown call macro symbol for ${name}`);

    return symbol;
  }

  public getFromIdentifierMacro(name: string) {
    const symbol = this.identifierMacros.get(name);
    assert(symbol, `Unknown identifier symbol for ${name}`);

    return symbol;
  }

  public loadSymbols() {
    Log.trace(`Loading symbols for ${PACKAGE_NAME}`);
    Log.pushIndent();

    let hasIndexFile = false;
    for (const file of this.state.program.getSourceFiles()) {
      if (Log.canLog(LogLevel.Debug)) {
        Log.debug(`Current file (loop): ${this.state.relativeToProjectDir(file.resolvedPath)}`);
      }
      if (this.state.isTransformerIndexFile(file)) {
        hasIndexFile = true;
        this.loadSymbolsWithFile(file);
        break;
      }
    }
    Log.popIndent();
    Log.trace("Loading symbols done");
    this.loaded = hasIndexFile;
  }

  private loadSymbolsWithFile(file: ts.SourceFile) {
    assert(file.symbol, `${file.resolvedPath} has no symbol`);
    this._sourceFileSymbol = file.symbol;

    for (const statement of file.statements) {
      switch (statement.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
          this.visitFunctionDeclaration(file, statement as ts.FunctionDeclaration);
          break;
        case ts.SyntaxKind.VariableStatement:
          this.visitVariableStatement(file, statement as ts.VariableStatement);
          break;
        default:
          break;
      }
    }
  }

  // Visitors
  private visitVariableStatement(file: ts.SourceFile, stmt: ts.VariableStatement) {
    for (const decl of stmt.declarationList.declarations) {
      if (ts.isIdentifier(decl.name)) {
        const name = decl.name.getText();
        const symbol = decl.symbol;
        assert(!this.identifierMacros.has(name), `${name} is registered twice`);

        if (Log.canLog(LogLevel.Debug)) {
          const [line, column] = getPositionOfNode(file, decl);
          Log.debug(`Loaded identifier macro symbol (${line}:${column}): ${ansi.bold(name)}`);
        }

        this.identifierMacros.set(name, symbol);
      } else if (Log.canLog(LogLevel.Error)) {
        const [line, column] = getPositionOfNode(file, decl);
        Log.warn(`Cannot load macro symbols from binding names (${line}:${column})`);
      }
    }
  }

  private visitFunctionDeclaration(file: ts.SourceFile, decl: ts.FunctionDeclaration) {
    const functionName = decl.name?.getText();
    const symbol = decl.symbol;
    assert(functionName, "unknown function name");
    assert(!this.callMacros.has(functionName), `${functionName} is registered twice`);

    if (Log.canLog(LogLevel.Debug)) {
      const [line, column] = getPositionOfNode(file, decl);
      Log.debug(`Loaded call macro symbol (${line}:${column}): ${ansi.bold(functionName)}`);
    }
    this.callMacros.set(functionName, symbol);
  }
}
