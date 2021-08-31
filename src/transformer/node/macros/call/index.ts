import ts from "typescript";
import { TransformContext } from "../../../context";
import {
	transformInstanceCallMacro,
	transformInstanceWaitForCallMacro,
} from "./instance";
import { transformFileContentsCallMacro } from "./fileContents";
import { transformJsonCallMacro } from "./json";
import { transformFileNameCallMacro } from "./fileName";

export type CallMacroFunction = (
	context: TransformContext,
	node: ts.CallExpression,
) => ts.Node | ts.Node[];

export const CALL_MACROS: { [index: string]: CallMacroFunction } = {
	$instance: transformInstanceCallMacro,
	$instanceWaitFor: transformInstanceWaitForCallMacro,
	$fileContents: transformFileContentsCallMacro,
	$fileName: transformFileNameCallMacro,
	$json: transformJsonCallMacro,
};