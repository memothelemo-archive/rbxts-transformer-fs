import crypto from "crypto";
import fs from "fs";
import { factory } from "typescript";

import { CallMacro } from ".";
import { Log } from "../../../logging";
import { Diagnostics, throwWithDiagnostic } from "../../utils/diagnostics";
import { getLiteralStringLike } from "../../utils/getLiteralString";
import { getPathFromArgument } from "../../utils/getPathFromArg";

// FIXME: Possible file buffer overflow
export const transformCallMacroHashFile: CallMacro = (ctx, node) => {
  const alg = getLiteralStringLike(ctx, node.arguments[1]);
  if (alg === undefined) {
    throwWithDiagnostic(Diagnostics.CALL_MACROS.FILE_HASH_EXPECTED_ALG(node));
  }

  const pathArg = getPathFromArgument(ctx, node, node.arguments[0]);
  if (pathArg === undefined) {
    throwWithDiagnostic(Diagnostics.EXPECTED_PATH.FILE(node));
  }

  if (!fs.existsSync(pathArg)) {
    throwWithDiagnostic(Diagnostics.NOT_FOUND.FILE(node));
  }

  if (fs.statSync(pathArg).isDirectory()) {
    throwWithDiagnostic(Diagnostics.IS_A_DIRECTORY(node));
  }

  const buffer = fs.readFileSync(pathArg).toString();

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
      throwWithDiagnostic(
        Diagnostics.CALL_MACROS.FILE_HASH_UNSUPPORTED_ALG(node),
      );
  }

  Log.trace(`Hashing specified file; algorithm = ${alg}`);
  hasher.update(buffer);
  return factory.createStringLiteral(hasher.digest("hex"));
};
