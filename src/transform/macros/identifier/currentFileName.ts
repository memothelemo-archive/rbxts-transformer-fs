import performBaseMacroFileName from "../base/fileName";
import { IdentifierMacro } from "../types";

const ID_MACRO_CURRENT_FILE_NAME: IdentifierMacro = {
  name: "$CURRENT_FILE_NAME",

  transform(state, node) {
    return performBaseMacroFileName(state, node.getSourceFile());
  },
};

export default ID_MACRO_CURRENT_FILE_NAME;
