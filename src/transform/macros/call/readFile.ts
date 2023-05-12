import Diagnostics from "../../../classes/diagnostics";
import { ERROR_MESSAGES } from "../../diagnostics";
import performBaseMacroReadFile from "../base/readFile";
import { CallMacro } from "../types";

export const CALL_MACRO_READ_FILE: CallMacro = {
  name: "$readFile",

  transform(state, node) {
    const output = performBaseMacroReadFile(state, node);
    if (output === undefined) {
      Diagnostics.error(node, ERROR_MESSAGES.NOT_FOUND);
    } else {
      return output;
    }
  },
};

export const CALL_MACRO_READ_FILE_OPT: CallMacro = {
  name: "$readFileOpt",

  transform(state, node) {
    const output = performBaseMacroReadFile(state, node);
    if (output === undefined) {
      return state.context.factory.createIdentifier("undefined");
    } else {
      return output;
    }
  },
};
