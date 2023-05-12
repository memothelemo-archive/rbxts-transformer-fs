import ts from "typescript";
import Diagnostics from "../../classes/diagnostics";
import { BaseMacro } from "../macros/types";
import TransformerState from "../state";

export default function warnIfDeprecatedMacro(state: TransformerState, node: ts.Node, macro: BaseMacro) {
  if (macro.deprecated !== undefined) {
    const message = `${macro.name} is deprecated${
      macro.deprecated.replacement !== undefined ? `, use ${macro.deprecated.replacement} instead` : ""
    }.`;
    Diagnostics.warning(node, message);
  }
}
