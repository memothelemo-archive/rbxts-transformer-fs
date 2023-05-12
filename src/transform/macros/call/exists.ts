import performBaseMacroPathExists from "../base/exists";
import { CallMacro } from "../types";

export const CALL_MACRO_PATH_EXISTS: CallMacro = {
  name: "$pathExists",

  transform(state, node) {
    const exists = performBaseMacroPathExists(state, "ANY", node, node.arguments[0], node.arguments[1])[0];
    const factory = state.context.factory;
    return exists ? factory.createTrue() : factory.createFalse();
  },
};

export const CALL_MACRO_FILE_EXISTS: CallMacro = {
  name: "$fileExists",

  transform(state, node) {
    const exists = performBaseMacroPathExists(state, "FILE", node, node.arguments[0], node.arguments[1])[0];
    const factory = state.context.factory;
    return exists ? factory.createTrue() : factory.createFalse();
  },
};

export const CALL_MACRO_DIR_EXISTS: CallMacro = {
  name: "$dirExists",

  transform(state, node) {
    const exists = performBaseMacroPathExists(state, "DIR", node, node.arguments[0], node.arguments[1])[0];
    const factory = state.context.factory;
    return exists ? factory.createTrue() : factory.createFalse();
  },
};
