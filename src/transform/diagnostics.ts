import toComfortableFileSizeUnit from "../core/utils/toComfortableFileSizeUnit";

export const ERROR_MESSAGES = {
  EXPECTED: (type: string) => `Expected ${type}`,

  INVALID_ERR_MESSAGE: "Error message must be a literal string",

  MISSING_ARGUMENT: (no: string, type: string) => `Missing argument #${no} (${type})`,
  NOT_A_FILE: "Specified path is not a file",
  NOT_FOUND: "Specified path not found",

  REACHED_SIZE_LIMIT: (limit: number, actual: number) =>
    `This file reached the size limit! (limit: ${toComfortableFileSizeUnit(limit)}, got: ${toComfortableFileSizeUnit(
      actual,
    )})`,
  UNSUPPRORTED_FILE_HASH_ALG: "Unsupported file hash algorithm",
};
