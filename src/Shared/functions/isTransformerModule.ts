import ts from "byots";
import { SOURCE_MODULE_TEXT } from "../constants";

export function isTransformerModule(sourceFile: ts.SourceFile) {
	return sourceFile.text === SOURCE_MODULE_TEXT;
}