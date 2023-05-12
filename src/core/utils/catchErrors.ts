import ansi from "ansi-colors";
import ts from "typescript";
import { PACKAGE_BUGS_URL } from "../constants";
import { AssertError, DiagnosticError, TransformerError } from "../error";
import Log from "../logging";

const TERMINATING_RBXTSC_TXT = ansi.bold(ansi.redBright("\nTerminating rbxtsc because of this error"));
const MESSAGE_HEADER = ansi.bold("Message:");
const STACK_HEADER = ansi.bold("Stack:");

const UNKNOWN_ERROR = ansi.gray("<unknown error>");
const UNKNOWN_STACK = ansi.gray("<unknown stack>");
const NO_DETAILS = ansi.gray("<no details>");

function printErrorInfo(message: string | undefined, stack: string | undefined) {
  const stackNewLinePos = stack?.indexOf("\n");
  if (stackNewLinePos !== undefined) {
    stack = stack!.substring(stackNewLinePos + 1);
  }
  Log.error(`${MESSAGE_HEADER} ${message ?? UNKNOWN_ERROR}`);
  Log.error(`${STACK_HEADER}\n${stack ?? UNKNOWN_STACK}`);
}

function printBugReportSuffix(possible_not_a_bug = false) {
  console.log(
    `\nPlease send this bug report with stack and error message at:\n${ansi.bold(ansi.yellowBright(PACKAGE_BUGS_URL))}`,
  );
  if (possible_not_a_bug) {
    console.log(ansi.gray("(only do this if you think it is a bug)"));
  }
}

export function catchErrors<T>(
  context: ts.TransformationContext,
  tsDiagnosticGraceful: true,
  callback: () => T,
): T | undefined;
export function catchErrors<T>(context: ts.TransformationContext, tsDiagnosticGraceful: false, callback: () => T): T;
export function catchErrors<T>(context: ts.TransformationContext, tsDiagnosticGraceful: boolean, callback: () => T) {
  try {
    return callback();
  } catch (e) {
    if (e instanceof AssertError) {
      Log.resetIndent();
      Log.error(ansi.redBright(ansi.bold("Assertion failed! This may be a bug.")));
      printErrorInfo(e.message, e.stack);
      printBugReportSuffix();
    } else if (e instanceof DiagnosticError) {
      context.addDiagnostic(e.diagnostic);
      if (tsDiagnosticGraceful) {
        return undefined;
      } else {
        Log.error(ansi.redBright("Caught an error with TypeScript diagnostic object!"));
        printErrorInfo(e.toString(), e.stack);
        printBugReportSuffix();
      }
    } else if (e instanceof TransformerError) {
      Log.resetIndent();
      Log.error(ansi.redBright(e.toString()));
      printErrorInfo(e.details ?? NO_DETAILS, e.stack);
      if (e.isABug()) {
        printBugReportSuffix();
      }
    } else {
      const err = e instanceof Error ? e : new Error(String(e));
      Log.resetIndent();
      Log.error(ansi.redBright(ansi.bold("Unexpected error occurred!")));
      printErrorInfo(err.message, err.stack);
      printBugReportSuffix();
    }

    console.log(TERMINATING_RBXTSC_TXT);
    process.exit(1);
  }
}
