import ts from "typescript";
import Diagnostics from "../../../classes/diagnostics";
import { ERROR_MESSAGES } from "../../diagnostics";
import TransformerState from "../../state";
import createVoidExpression from "../../utils/createVoidExpression";
import { isAncestorOf } from "../../utils/isAncestorOf";
import performBaseMacroPathExists from "../base/exists";
import { CallMacro } from "../types";

function expectationBase(state: TransformerState, node: ts.CallExpression, specifier: "ANY" | "DIR" | "FILE") {
  const [exists, message] = performBaseMacroPathExists(state, specifier, node, node.arguments[0], node.arguments[1]);
  if (exists) {
    // remove this guy as possible...
    if (!isAncestorOf(node, ts.isExpressionStatement)) {
      return createVoidExpression(state);
    }
  } else if (message !== undefined) {
    Diagnostics.error(node, message);
  } else {
    Diagnostics.error(node, ERROR_MESSAGES.NOT_FOUND);
  }
}

export const CALL_MACRO_EXPECT_PATH: CallMacro = {
  name: "$expectPath",

  transform(state, node) {
    return expectationBase(state, node, "ANY");
  },
};

export const CALL_MACRO_EXPECT_DIR: CallMacro = {
  name: "$expectDir",

  transform(state, node) {
    return expectationBase(state, node, "DIR");
  },
};

export const CALL_MACRO_EXPECT_FILE: CallMacro = {
  name: "$expectFile",

  transform(state, node) {
    return expectationBase(state, node, "FILE");
  },
};
