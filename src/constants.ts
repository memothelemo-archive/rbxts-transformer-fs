import { readFileSync } from "fs";
import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..");
export const TYPINGS_PATH = path.resolve(path.join(PACKAGE_ROOT, "index.d.ts"));

export const PACKAGE_NAME =
  JSON.parse(readFileSync(path.join(PACKAGE_ROOT, "package.json")).toString())
    .name ?? "Unknown Transformer";

/**
 * Source file contains functions that will transformed
 * on compile-time.
 */
export const TYPINGS_SRC_TXT = readFileSync(TYPINGS_PATH, "utf-8").toString();
