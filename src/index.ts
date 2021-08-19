import ts from "typescript";
import Transformer from "./Transformer";
import { TransformerConfig } from "./Transformer/config";
import {} from "ts-expose-internals";
import { transformSourceFile } from "./Transformer/functions/transformSourceFile";
import { warn } from "./Shared/functions/warn";

export default function (program: ts.Program, config: TransformerConfig) {
	return (
		context: ts.TransformationContext,
	): ((file: ts.SourceFile) => ts.SourceFile) => {
		const state = new Transformer.State(program, context, config);

		// warn users that rbxts-transformer-path is outdated
		warn(
			"rbxts-transformer-path is deprecated, please use it at your own risk!",
		);

		state.printInVerbose("Initializing transformer state");

		return file => transformSourceFile(state, file);
	};
}
