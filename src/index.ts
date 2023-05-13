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

    // The downside of using preloading symbols is that the
    // transformer has to expect that index.d.ts must be included
    // in TypeScript program's source files.
    //
    // So I put a cheap  condition if index.d.ts is not loaded
    // from the project then it will not going to perform
    // any transformations whatsoever.
    if (state.canTransform()) {
      return file => transformSourceFile(state, file);
    } else {
      Log.warn("This transformer is disabled temporarily (unused from the project)");
      return file => file;
    }
  };
};

export default main;
