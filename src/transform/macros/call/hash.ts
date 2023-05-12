import ansi from "ansi-colors";
import crypto from "crypto";
import fs from "fs";

import Diagnostics from "../../../classes/diagnostics";
import Log, { LogLevel } from "../../../core/logging";
import toComfortableFileSizeUnit from "../../../core/utils/toComfortableFileSizeUnit";
import { ERROR_MESSAGES } from "../../diagnostics";
import { getLiteralStringLike } from "../../utils/getLiteralString";
import getPathFromExpression from "../../utils/getPathFromExpression";
import { CallMacro } from "../types";

export const CALL_MACRO_HASH_FILE: CallMacro = {
  name: "$hashFile",

  transform(state, node) {
    const pathArg = getPathFromExpression(state, node, node.arguments[0]);
    if (pathArg === undefined) {
      Diagnostics.error(node, ERROR_MESSAGES.MISSING_ARGUMENT("1", "file path"));
    }

    const alg = getLiteralStringLike(state, node.arguments[1]);
    if (alg === undefined) {
      Diagnostics.error(node, ERROR_MESSAGES.MISSING_ARGUMENT("2", "file hash algorithm"));
    }

    if (Log.canLog(LogLevel.Debug)) {
      Log.debug(`Reading file: ${ansi.bold(state.relativeToProjectDir(pathArg))}`);
    }

    if (!fs.existsSync(pathArg)) {
      Diagnostics.error(node, ERROR_MESSAGES.NOT_FOUND);
    }

    const stat = fs.statSync(pathArg);
    if (!stat.isFile()) {
      Diagnostics.error(node, ERROR_MESSAGES.NOT_A_FILE);
    }

    if (stat.size > state.config.hashFileLimit!) {
      Diagnostics.error(node, ERROR_MESSAGES.REACHED_SIZE_LIMIT(state.config.hashFileLimit!, stat.size));
    }

    const buffer = fs.readFileSync(pathArg);

    // implementation of these hashers
    let hasher: crypto.Hash;
    switch (alg) {
      case "sha1":
        hasher = crypto.createHash("sha1");
        break;
      case "sha128":
        hasher = crypto.createHash("sha128");
        break;
      case "sha256":
        hasher = crypto.createHash("sha256");
        break;
      case "sha512":
        hasher = crypto.createHash("sha512");
        break;
      case "md5":
        hasher = crypto.createHash("md5");
        break;
      default:
        Diagnostics.error(node, ERROR_MESSAGES.UNSUPPRORTED_FILE_HASH_ALG);
    }

    if (Log.canLog(LogLevel.Debug)) {
      Log.trace(
        `Hashing specified file; algorithm = ${ansi.bold(alg)}, size = ${ansi.bold(
          toComfortableFileSizeUnit(stat.size),
        )}`,
      );
    }
    hasher.update(buffer);
    return state.context.factory.createStringLiteral(hasher.digest("hex"));
  },
};
