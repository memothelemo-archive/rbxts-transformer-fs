import { z } from "zod";
import { fromZodError } from "zod-validation-error";

/**
 * Transformer configuration
 */
export type TransformerConfig = z.infer<typeof validator>;

/**
 * Default configuration set by the author
 */
export const DEFAULT_CONFIG: TransformerConfig = {};

const validator = z.object({
  logLevel: z.enum(["trace", "debug", "info", "warn"] as const).optional(),
  // z.union(
  //   // [
  //   //   z.literal("trace"),
  //   //   z.literal("debug"),
  //   //   z.literal("info"),
  //   //   z.literal("warn"),
  //   // ],
  //   {
  //     invalid_type_error:
  //       "'logLevel' must be exactly either 'trace', 'debug', 'info', 'warn' or null",
  //   },
  // ),,
});

export function isValidTransformerConfig(value: unknown): string | undefined {
  const result = validator.safeParse(value);
  if (!result.success) {
    const err = fromZodError(result.error);
    return err.toString();
  }
}
