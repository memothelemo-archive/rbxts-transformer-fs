import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { RbxtsCommandLine } from "../rbxtsc/commandLine";
import { ErrorKind, throwErr } from "./error";
// import { ErrorKind, TransformerError } from "./error";

/** Transformer configuration */
export type TransformerConfig = z.infer<typeof VAILDATOR>;

/**
 * Default configuration set by the author
 */
const DEFAULT_CONFIG: TransformerConfig = {
  // Default is 100 MB
  hashFileLimit: 1000 * 1000 * 100,
  logLevel: RbxtsCommandLine.verboseEnabled ? "info" : "error",
};

const VAILDATOR = z.object({
  logLevel: z.enum(["trace", "debug", "info", "warn", "error"] as const).optional(),
  hashFileLimit: z.number().positive().optional(),
});

export function loadConfig(raw: unknown) {
  let config = {} as TransformerConfig;
  if (raw !== undefined) {
    const result = VAILDATOR.safeParse(raw);
    if (result.success) {
      config = { ...raw, ...DEFAULT_CONFIG };
    } else {
      const msg = fromZodError(result.error);
      throwErr(ErrorKind.InvalidConfig, msg.toString());
    }
  }
  return config;
}
