import { readFileSync } from "fs";
import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..", "..");
export const INDEX_DTS_PATH = path.resolve(path.join(PACKAGE_ROOT, "index.d.ts"));

const PACKAGE_METADATA = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, "package.json")).toString());

export const PACKAGE_NAME = PACKAGE_METADATA.name ?? "unknown-transformer";
export const PACKAGE_BUGS_URL = PACKAGE_METADATA.bugs.url;

/**
 * Source file contains macros that will transformed on compile-time.
 */
export const INDEX_DTS_SRC = readFileSync(INDEX_DTS_PATH, "utf-8").toString();
