import ts from "typescript";
import { PACKAGE_NAME } from "../core/constants";
import { DiagnosticError } from "../core/error";

function createDiagnosticAtLocation(
  node: ts.Node,
  messageText: string,
  category: ts.DiagnosticCategory,
  file = ts.getSourceFileOfNode(node),
): ts.DiagnosticWithLocation {
  return {
    category,
    file,
    messageText,
    start: node.getStart(),
    length: node.getWidth(),
    code: ` ${PACKAGE_NAME}` as never,
  };
}

export default class Diagnostics {
  private static diagnostics = new Array<ts.DiagnosticWithLocation>();

  private constructor() {
    debugger;
  }

  public static flush() {
    const waste = this.diagnostics;
    this.diagnostics = [];
    return waste;
  }

  public static create(node: ts.Node, category: ts.DiagnosticCategory, ...messages: string[]) {
    return createDiagnosticAtLocation(node, messages.join("\n"), category);
  }

  public static relocate(diagnostic: ts.DiagnosticWithLocation, node: ts.Node): never {
    diagnostic.file = ts.getSourceFileOfNode(node);
    diagnostic.start = node.getStart();
    diagnostic.length = node.getWidth();
    throw new DiagnosticError(diagnostic);
  }

  public static error(node: ts.Node, ...messages: string[]): never {
    throw new DiagnosticError(this.create(node, ts.DiagnosticCategory.Error, ...messages));
  }

  public static warning(node: ts.Node, ...messages: string[]) {
    this.diagnostics.push(this.create(node, ts.DiagnosticCategory.Warning, ...messages));
  }
}
