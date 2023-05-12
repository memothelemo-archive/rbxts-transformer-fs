// We're importing this module to expose internal parts of
// TypeScript that are not available in their public API
import {} from "ts-expose-internals";

import { loadConfig } from "./core/config";
import Log from "./core/logging";
import { catchErrors } from "./core/utils/catchErrors";
import transformSourceFile from "./transform/nodes/sourceFile";
import TransformerState from "./transform/state";
import { TransformerEntry } from "./types";

const main: TransformerEntry = (program, rawCfg) => {
  return context => {
    const state = catchErrors(context, false, () => {
      const config = loadConfig(rawCfg);
      Log.setFromConfig(config);
      return new TransformerState(config, program, context);
    });
    return file => transformSourceFile(state, file);
  };
};

export default main;
