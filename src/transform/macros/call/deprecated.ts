import performBaseMacroFileName from "../base/fileName";
import { CallMacro } from "../types";
import { CALL_MACRO_FILE_EXISTS } from "./exists";
import { CALL_MACRO_READ_FILE } from "./readFile";

export const CALL_MACRO_FILE_CONTENTS: CallMacro = {
  name: "$fileContents",
  deprecated: { replacement: "$read" },

  transform(state, node) {
    return CALL_MACRO_READ_FILE.transform(state, node);
  },
};

export const CALL_MACRO_FILE_NAME: CallMacro = {
  name: "$fileName",
  deprecated: { replacement: "$CURRENT_FILE_NAME variable" },

  transform(state, node) {
    return performBaseMacroFileName(state, node.getSourceFile());
  },
};

export const CALL_MACRO_REQUIRE_FILE: CallMacro = {
  name: "$requireFile",
  deprecated: { replacement: "$expectFile" },

  transform(state, node) {
    return CALL_MACRO_FILE_EXISTS.transform(state, node);
  },
};
